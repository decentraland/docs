import { execFileSync } from 'node:child_process'
import { readFile, stat } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { findBrokenLinks } from './markdown-links.mjs'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const listed = execFileSync('git', ['ls-files', '--cached', '--others', '--exclude-standard', '-z'], { cwd: root, encoding: 'utf8' }).split('\0').filter(Boolean)
const files = []
for (const path of new Set(listed)) {
	try {
		if ((await stat(join(root, path))).isFile()) files.push(path)
	} catch (error) {
		if (error.code !== 'ENOENT') throw error
	}
}
const paths = new Set(['.'])
for (const file of files) {
	paths.add(file)
	let parent = dirname(file)
	while (parent !== '.') {
		paths.add(parent)
		parent = dirname(parent)
	}
}
const pages = files.filter(path => /\.md$/i.test(path)).sort()
const errors = []
for (const page of pages) errors.push(...findBrokenLinks(page, await readFile(join(root, page), 'utf8'), paths))
if (process.argv.includes('--json')) {
	console.log(JSON.stringify({ pages: pages.length, errors }, null, 2))
} else {
	for (const error of errors) console.error(`${error.source}: ${error.link} → ${error.target ?? error.reason}`)
	console.log(`Checked ${pages.length} Markdown files; ${errors.length} broken local links.`)
}
process.exitCode = errors.length > 0 ? 1 : 0
