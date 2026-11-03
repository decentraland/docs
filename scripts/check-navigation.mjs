import { execFileSync } from 'node:child_process'
import { readFile, stat } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parse } from 'yaml'
import { gitbookSpaceDirectories } from './asset-references.mjs'
import { auditNavigation } from './navigation.mjs'

const rootIndex = process.argv.indexOf('--root')
if (rootIndex !== -1 && !process.argv[rootIndex + 1]) throw new Error('--root requires a repository directory.')
const root = rootIndex === -1 ? join(dirname(fileURLToPath(import.meta.url)), '..') : resolve(process.argv[rootIndex + 1])
const paths = execFileSync('git', ['ls-files', '--cached', '--others', '--exclude-standard', '-z'], { cwd: root, encoding: 'utf8' }).split('\0').filter(path => /\.md$/i.test(path))
const pages = new Map()
for (const path of new Set(paths)) {
	try {
		if ((await stat(join(root, path))).isFile()) pages.set(path, await readFile(join(root, path), 'utf8'))
	} catch (error) { if (error.code !== 'ENOENT') throw error }
}
const config = parse(await readFile(join(root, 'gitbook-docs.yaml'), 'utf8'))
const exceptions = JSON.parse(await readFile(join(root, 'scripts/navigation-exceptions.json'), 'utf8'))
const result = auditNavigation(pages, gitbookSpaceDirectories(config), exceptions)
if (process.argv.includes('--json')) console.log(JSON.stringify(result, null, 2))
else {
	for (const [level, issues] of [['error', result.errors], ['warning', result.warnings]]) {
		for (const issue of issues) console.error(`${level}: ${issue.source}${issue.line ? `:${issue.line}` : ''}: ${issue.reason}${issue.link ? ` (${issue.link})` : ''}`)
	}
	console.log(`Checked ${result.spaces} spaces and ${result.entries} navigation entries; ${result.translations.length} managed translation menus; ${result.errors.length} errors; ${result.warnings.length} warnings.`)
}
process.exitCode = result.errors.length || (process.argv.includes('--strict') && result.warnings.length) ? 1 : 0
