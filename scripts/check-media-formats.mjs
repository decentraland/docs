import { execFileSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { readFile, lstat } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { evaluateMedia, mediaFormatIssue } from './media-formats.mjs'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const listed = execFileSync('git', ['ls-files', '--cached', '--others', '--exclude-standard', '-z'], { cwd: root, encoding: 'utf8' }).split('\0').filter(Boolean)
const paths = []
for (const path of new Set(listed)) {
	try {
		const info = await lstat(join(root, path))
		if (info.isFile() || info.isSymbolicLink()) paths.push(path)
	} catch (error) {
		if (error.code !== 'ENOENT') throw error
	}
}
const files = []
// Inspect every file, so a PNG renamed to .webp (or .bin) cannot bypass the policy.
// Batch arguments, using -- to safely handle spaces and leading hyphens in paths.
for (let offset = 0; offset < paths.length; offset += 100) {
	const batch = paths.slice(offset, offset + 100)
	let output
	try {
		output = execFileSync('file', ['--mime-type', '--brief', '--', ...batch], { cwd: root, encoding: 'utf8' })
	} catch (error) {
		throw new Error('Media validation requires the file utility (preinstalled on the CI Ubuntu runner).', { cause: error })
	}
	const types = output.trimEnd().split('\n')
	if (types.length !== batch.length || types.some(type => !/^[\w.+-]+\/[\w.+-]+$/.test(type))) {
		throw new Error('Could not identify all file types; media validation cannot continue.')
	}
	for (const [index, path] of batch.entries()) {
		const mime = types[index]
		if (mime === 'inode/symlink') throw new Error(`${path}: symlinks are not supported by media validation.`)
		const sha256 = mediaFormatIssue(path, mime)
			? createHash('sha256').update(await readFile(join(root, path))).digest('hex')
			: undefined
		files.push({ path, mime, sha256 })
	}
}
const exceptions = JSON.parse(await readFile(join(root, 'scripts/media-format-exceptions.json'), 'utf8'))
const result = evaluateMedia(files, exceptions)
for (const failure of result.failures) console.error(`${failure.path}: ${failure.reason}`)
for (const path of result.stale) console.error(`${path}: remove the stale entry from scripts/media-format-exceptions.json.`)
console.log(`Checked ${files.length} files; ${result.failures.length} format violations; ${result.grandfathered} unchanged legacy assets; ${result.stale.length} stale exceptions.`)
process.exitCode = result.failures.length || result.stale.length ? 1 : 0
