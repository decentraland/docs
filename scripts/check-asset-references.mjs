import { execFileSync } from 'node:child_process'
import { readFile, stat } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parse } from 'yaml'
import { isAsset, auditAssetReferences, gitbookSpaceDirectories, compareAssetBaseline } from './asset-references.mjs'

const rootIndex = process.argv.indexOf('--root')
if (rootIndex !== -1 && !process.argv[rootIndex + 1]) throw new Error('--root requires a repository directory.')
const root = rootIndex === -1 ? join(dirname(fileURLToPath(import.meta.url)), '..') : resolve(process.argv[rootIndex + 1])
const listed = execFileSync('git', ['ls-files', '--cached', '--others', '--exclude-standard', '-z'], { cwd: root, encoding: 'utf8' }).split('\0').filter(Boolean)
const paths = []
for (const path of new Set(listed)) {
	try {
		if ((await stat(join(root, path))).isFile()) paths.push(path)
	} catch (error) {
		if (error.code !== 'ENOENT') throw error
	}
}
const pages = await Promise.all(paths.filter(path => /\.md$/i.test(path)).map(async path => ({ path, content: await readFile(join(root, path), 'utf8') })))
let spaces = []
try {
	spaces = gitbookSpaceDirectories(parse(await readFile(join(root, 'gitbook-docs.yaml'), 'utf8')))
} catch (error) {
	if (error.code !== 'ENOENT') throw new Error('Unable to read GitBook space mappings from gitbook-docs.yaml.', { cause: error })
}
const { unused, errors } = auditAssetReferences(paths, pages, spaces)
const baseline = JSON.parse(await readFile(join(root, 'scripts/unreferenced-assets-baseline.json'), 'utf8'))
if (!Array.isArray(baseline) || baseline.some(path => typeof path !== 'string') || new Set(baseline).size !== baseline.length) {
	throw new Error('The unused-asset baseline must be a list of unique paths.')
}
const result = compareAssetBaseline(unused, baseline)
const failures = process.argv.includes('--strict') ? unused : result.newUnused
const summary = { assets: paths.filter(isAsset).length, pages: pages.length, unused, errors, ...result }
if (process.argv.includes('--json')) console.log(JSON.stringify(summary, null, 2))
else {
	for (const error of errors) console.error(`${error.source}: ${error.link ? `${error.link}: ` : ''}${error.reason}`)
	for (const path of failures) console.error(`${path}: not referenced by any Markdown file. Link to it from the appropriate page or remove it.`)
	for (const path of result.stale) console.error(`${path}: remove the stale entry from scripts/unreferenced-assets-baseline.json.`)
	console.log(`Checked ${summary.assets} assets against ${summary.pages} Markdown files; ${result.newUnused.length} new unreferenced assets; ${result.existing} existing unreferenced assets; ${result.stale.length} stale baseline entries; ${errors.length} reference errors.`)
}
process.exitCode = failures.length || result.stale.length || errors.length ? 1 : 0
