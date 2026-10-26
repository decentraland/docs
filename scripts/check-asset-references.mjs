import { execFileSync } from 'node:child_process'
import { readFile, stat } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { isAsset, findUnreferencedAssets, compareAssetBaseline } from './asset-references.mjs'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
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
const unused = findUnreferencedAssets(paths, pages)
const baseline = JSON.parse(await readFile(join(root, 'scripts/unreferenced-assets-baseline.json'), 'utf8'))
if (!Array.isArray(baseline) || baseline.some(path => typeof path !== 'string') || new Set(baseline).size !== baseline.length) {
	throw new Error('The unused-asset baseline must be a list of unique paths.')
}
const result = compareAssetBaseline(unused, baseline)
const failures = process.argv.includes('--strict') ? unused : result.newUnused
const summary = { assets: paths.filter(isAsset).length, pages: pages.length, unused, ...result }
if (process.argv.includes('--json')) console.log(JSON.stringify(summary, null, 2))
else {
	for (const path of failures) console.error(`${path}: not referenced by any Markdown file. Link to it from the appropriate page or remove it.`)
	for (const path of result.stale) console.error(`${path}: remove the stale entry from scripts/unreferenced-assets-baseline.json.`)
	console.log(`Checked ${summary.assets} assets against ${summary.pages} Markdown files; ${result.newUnused.length} new unreferenced assets; ${result.existing} existing unreferenced assets; ${result.stale.length} stale baseline entries.`)
}
process.exitCode = failures.length || result.stale.length ? 1 : 0
