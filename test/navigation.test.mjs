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
	assert.equal(result.errors.length, 5)
	assert.ok(result.errors.some(issue => issue.reason.includes('case-sensitive')))
})

test('navigation rejects root-relative, malformed, escaping and cross-space targets', () => {
	const result = audit({ 'docs/SUMMARY.md': '* [Root](/docs/README.md)\n* [Encoded](%2Fdocs/README.md)\n* [Bad](bad%FF.md)\n* [Escape](../../out.md)\n* [Other](../other/README.md)\n* [Nested](es/README.md)', 'docs/README.md': '', 'other/README.md': '', 'other/SUMMARY.md': '* [Home](README.md)', 'docs/es/README.md': '', 'docs/es/SUMMARY.md': '* [Home](README.md)' }, ['docs', 'docs/es', 'other'])
	assert.equal(result.errors.length, 6)
	assert.ok(result.errors.some(issue => issue.reason.includes('Invalid URL encoding')))
	assert.ok(result.errors.some(issue => issue.reason.includes('escapes')))
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
