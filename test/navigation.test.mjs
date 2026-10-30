import assert from 'node:assert/strict'
import { test } from 'node:test'
import { auditNavigation, navigationEntries } from '../scripts/navigation.mjs'

const audit = (files, spaces = ['docs'], exceptions = {}) => auditNavigation(new Map(Object.entries(files)), spaces, exceptions)

test('navigation parses nested and reference links with line numbers, preserving duplicates and ignoring examples', () => {
	const parsed = navigationEntries('\uFEFF---\nlabel: ignored\n---\n# Menu\n* [Home](README.md)\n  * [Guide][guide]\n* [Again](README.md)\n\n[guide]: guide.md\n\n```md\n* [Fake](missing.md)\n```\n<!-- * [Hidden](missing.md) -->\n[Outside list](missing.md)\n* ![image](missing.png)\n')
	assert.deepEqual(parsed.entries, [{ link: 'README.md', line: 5 }, { link: 'guide.md', line: 6 }, { link: 'README.md', line: 7 }])
})

test('navigation resolves encoded paths, fragments and directory README entries', () => {
	const result = audit({ 'docs/SUMMARY.md': '* [Home](./)\n* [Guide](folder/)\n* [Space](my%20page.md?q=1#heading)\n* [External](https://example.org)', 'docs/README.md': '', 'docs/folder/README.md': '', 'docs/my page.md': '' })
	assert.deepEqual(result.errors, [])
	assert.deepEqual(result.warnings, [])
	assert.equal(result.listedPages, 3)
})

test('navigation rejects missing, wrongly cased, non-Markdown, and summary targets', () => {
	const result = audit({ 'docs/SUMMARY.md': '* [Missing](missing.md)\n* [Case](guide.md)\n* [Asset](photo.webp)\n* [Menu](SUMMARY.md)\n* [Self](#menu)', 'docs/Guide.md': '' })
	assert.deepEqual(result.errors.map(({ link, reason }) => [link, reason]), [
		['missing.md', 'Markdown page does not exist (case-sensitive): docs/missing.md'],
		['guide.md', 'Markdown page does not exist (case-sensitive): docs/guide.md'],
		['photo.webp', 'Navigation must target a Markdown page, not an asset or other file.'],
		['SUMMARY.md', 'Navigation cannot target a SUMMARY.md manifest.'],
		['#menu', 'Navigation entry must target a page path.'],
	])
})

test('navigation rejects root-relative, malformed, escaping and cross-space targets', () => {
	const result = audit({ 'docs/SUMMARY.md': '* [Root](/docs/README.md)\n* [Encoded](%2Fdocs/README.md)\n* [Bad](bad%FF.md)\n* [Escape](../../out.md)\n* [Other](../other/README.md)\n* [Nested](es/README.md)', 'docs/README.md': '', 'other/README.md': '', 'other/SUMMARY.md': '* [Home](README.md)', 'docs/es/README.md': '', 'docs/es/SUMMARY.md': '* [Home](README.md)' }, ['docs', 'docs/es', 'other'])
	assert.deepEqual(result.errors.map(({ link, reason }) => [link, reason]), [
		['/docs/README.md', 'Use a relative navigation path inside this GitBook space.'],
		['%2Fdocs/README.md', 'Use a relative navigation path inside this GitBook space.'],
		['bad%FF.md', 'Invalid URL encoding'],
		['../../out.md', 'Target escapes the repository'],
		['../other/README.md', 'Navigation target is outside this GitBook space.'],
		['es/README.md', 'Navigation target is outside this GitBook space.'],
	])
})

test('navigation warns for duplicate pages and unlisted pages but excludes maintenance and unmapped trees', () => {
	const result = audit({ 'docs/SUMMARY.md': '* [Home](README.md)\n* [Again](README.md#section)', 'docs/README.md': '', 'docs/unlisted.md': '', 'docs/AGENTS.md': '', 'legacy/unlisted.md': '' })
	assert.equal(result.errors.length, 0)
	assert.equal(result.warnings.length, 2)
	assert.ok(result.warnings.some(issue => issue.reason.startsWith('Duplicate')))
	assert.ok(result.warnings.some(issue => issue.source === 'docs/unlisted.md'))
})

test('nested spaces own their pages and each space requires its own manifest', () => {
	const result = audit({ 'docs/SUMMARY.md': '* [Home](README.md)', 'docs/README.md': '', 'docs/es/SUMMARY.md': '* [Home](README.md)', 'docs/es/README.md': '' }, ['docs', 'docs/es', 'missing'])
	assert.deepEqual(result.warnings, [])
	assert.deepEqual(result.errors, [{ source: 'missing/SUMMARY.md', reason: 'Missing navigation manifest.' }])
})

test('managed translation declarations are recognized without treating YAML as page links', () => {
	const summary = '* ```yaml\n  type: builtin:translation\n  dependencies:\n    translation:\n      ref:\n        kind: translation\n        translation: tr_123\n  ```'
	const result = audit({ 'docs/SUMMARY.md': summary, 'docs/unlisted.md': '' })
	assert.deepEqual(result.errors, [])
	assert.deepEqual(result.translations, ['docs'])
	assert.equal(result.warnings.length, 1) // Actual local pages still need review.
	assert.equal(audit({ 'docs/SUMMARY.md': '# Empty' }).errors.length, 1)
	assert.equal(audit({ 'docs/SUMMARY.md': '* ```yaml\n  type: builtin:translation\n  ```' }).errors.length, 1)
})

test('exceptions suppress only intentionally unlisted pages and require reasons', () => {
	const files = { 'docs/SUMMARY.md': '* [Home](README.md)', 'docs/README.md': '', 'docs/hidden.md': '' }
	assert.equal(audit(files, ['docs'], { 'docs/hidden.md': { reason: 'Direct-link guide' } }).warnings.length, 0)
	assert.equal(audit(files, ['docs'], { 'docs/hidden.md': { reason: ' ' } }).errors.length, 1)
	assert.equal(audit(files, ['docs'], []).errors.length, 1)
	for (const path of ['docs/README.md', 'docs/deleted.md', 'outside.md']) {
		assert.match(audit(files, ['docs'], { [path]: { reason: 'Old exception' } }).errors[0].reason, /Stale/)
	}
})

test('empty space configuration cannot silently pass', () => {
	assert.equal(audit({}, []).errors.length, 1)
})


test('external-only menus fail but external links are allowed alongside a valid local page', () => {
	for (const link of ['https://example.org', '//example.org']) {
		const files = { 'docs/SUMMARY.md': `* [External](${link})`, 'docs/README.md': '' }
		assert.deepEqual(audit(files).errors, [{ source: 'docs/SUMMARY.md', reason: 'Navigation has no local Markdown page entries or supported translation declaration.' }])
		files['docs/SUMMARY.md'] += '\n* [Home](README.md)'
		assert.deepEqual(audit(files).errors, [])
	}
})

test('query-only navigation entries are rejected with or without valid neighboring links', () => {
	for (const suffix of ['', '\n* [Home](README.md)']) {
		const result = audit({ 'docs/SUMMARY.md': '* [Query](?a)' + suffix, 'docs/README.md': '' })
		assert.deepEqual(result.errors, [{ source: 'docs/SUMMARY.md', line: 1, link: '?a', reason: 'Navigation entry must target a page path.' }])
	}
})

test('root ownership is the fallback regardless of space order or directory-name length', () => {
	const files = { 'SUMMARY.md': '* [Home](README.md)', 'README.md': '', 'a/SUMMARY.md': '* [Home](x.md)', 'a/x.md': '' }
	for (const spaces of [['.', 'a'], ['a', '.']]) {
		const result = audit(files, spaces)
		assert.deepEqual(result.errors, [])
		assert.deepEqual(result.warnings, [])
		assert.equal(result.listedPages, 2)
		assert.equal(audit({ ...files, 'SUMMARY.md': '* [Nested](a/x.md)' }, spaces).errors[0].reason, 'Navigation target is outside this GitBook space.')
	}
})

test('dotted directories remain valid while non-Markdown files get a dedicated diagnostic', () => {
	const result = audit({ 'docs/SUMMARY.md': '* [Version](guide.v2)\n* [PDF](manual.pdf)', 'docs/guide.v2/README.md': '' })
	assert.deepEqual(result.errors.map(({ link, reason }) => [link, reason]), [['manual.pdf', 'Navigation must target a Markdown page, not an asset or other file.']])
	assert.equal(result.listedPages, 1)
})
