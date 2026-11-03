import { execFileSync } from 'node:child_process'
import { readFile, stat } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { findBrokenAnchors } from './markdown-anchors.mjs'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const listed = execFileSync('git', ['ls-files', '--cached', '--others', '--exclude-standard', '-z'], { cwd: root, encoding: 'utf8' }).split('\0').filter(path => /\.md$/i.test(path))
const pages = new Map()
for (const path of [...new Set(listed)].sort()) {
	try {
		if ((await stat(join(root, path))).isFile()) pages.set(path, await readFile(join(root, path), 'utf8'))
	} catch (error) {
		if (error.code !== 'ENOENT') throw error
	}
}
const result = findBrokenAnchors(pages)
if (process.argv.includes('--json')) console.log(JSON.stringify({ pages: pages.size, ...result }, null, 2))
else {
	for (const error of result.errors) console.error(`${error.source}: ${error.link} → ${error.reason}`)
	console.log(`Checked ${result.checked} local anchor references across ${pages.size} Markdown files; ${result.errors.length} broken anchors.`)
}
process.exitCode = result.errors.length ? 1 : 0
