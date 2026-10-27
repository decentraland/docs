import assert from 'node:assert/strict'
import { test } from 'node:test'
import { extractAnchors, findBrokenAnchors } from '../scripts/markdown-anchors.mjs'

test('extracts formatted and setext headings, preserving Unicode and punctuation rules', () => {
	const anchors = extractAnchors('# Hello **World**\n## `getPlayer()`\n## ¿Qué es un NAME?\nA & B\n-----\n')
	for (const id of ['hello-world', 'getplayer', 'qué-es-un-name', 'a--b']) assert.ok(anchors.has(id), id)
})

test('preserves explicit GitBook IDs instead of generating a second implicit ID', () => {
	const anchors = extractAnchors('## Transform {#Transform}\n')
	assert.deepEqual([...anchors], ['Transform'])
})

test('increments duplicate headings without colliding with previously generated suffixes', () => {
	assert.deepEqual([...extractAnchors('# Test\n# Test\n# Test-1\n# Test\n')], ['test', 'test-1', 'test-1-1', 'test-2'])
})

test('recognizes heading-inline HTML IDs and expandable GitBook summaries', () => {
	const anchors = extractAnchors('## Heading <a id="CaseSensitive"></a> {#heading}\n## Legacy <a name="legacy"></a> {#legacy-heading}\n\n<details>\n<summary>What is a <strong>NAME</strong>?</summary>\n</details>\n')
	assert.deepEqual([...anchors], ['CaseSensitive', 'heading', 'legacy', 'legacy-heading', 'what-is-a-name'])
})

test('ignores front matter, code examples, and commented-out headings and anchors', () => {
	const content = '---\ntitle: "# hidden"\n---\n```md\n# Example\n<a id="example"></a>\n```\n\n<!--\n# Pending\n<a id="pending"></a>\n-->\n\n`<a id="inline"></a>`\n'
	assert.equal(extractAnchors(content).size, 0)
})

test('resolves same-page, relative, root, directory, query, and percent-encoded references', () => {
	const pages = new Map([
		['docs/a.md', '# Local\n[one](#local) [two](b.md#qu%C3%A9) [three](/docs/b.md#qué) [four](section/#section) [five](?view=wide#local) [six](b.md?view=wide#qué)'],
		['docs/b.md', '# Qué'], ['docs/section/README.md', '# Section'],
	])
	assert.deepEqual(findBrokenAnchors(pages), { checked: 6, errors: [] })
})

test('reports missing and case-mismatched anchors and removed destination pages', () => {
	const pages = new Map([['a.md', '## Transform {#Transform}\n[wrong](#transform) [missing](b.md#gone) [removed](deleted.md#section)'], ['b.md', '# Present']])
	const result = findBrokenAnchors(pages)
	assert.equal(result.errors.length, 3)
	assert.equal(result.errors[0].fragment, 'transform')
	assert.equal(result.errors[2].reason, 'Markdown target does not exist')
})

test('validates HTML and reference links without counting commented or fenced examples', () => {
	const pages = new Map([['a.md', '# Present\n<a href="#gone">bad</a>\n[ref][target]\n\n[target]: #missing\n\n<!-- <a href="#ignored">hidden</a> -->\n\n```md\n[example](#ignored)\n```\n']])
	assert.deepEqual(findBrokenAnchors(pages).errors.map(error => error.link), ['#gone', '#missing'])
})

test('skips remote URLs, asset fragments, and empty fragments', () => {
	const pages = new Map([['a.md', '[remote](https://example.com/#missing) [relative](//example.com/#missing) [svg](image.svg#icon) [pdf](file.pdf#page=2) [top](#)']])
	assert.deepEqual(findBrokenAnchors(pages), { checked: 0, errors: [] })
})

test('rejects malformed fragment encoding', () => {
	const result = findBrokenAnchors(new Map([['a.md', '<a href="#%ZZ">bad</a>']]))
	assert.equal(result.errors[0].reason, 'Invalid fragment encoding')
})


test('does not credit standalone HTML anchors that GitBook drops during import', () => {
	const result = findBrokenAnchors(new Map([['page.md', '<a id="missing"></a>\n\n**Label**\n\n[link](#missing)']]))
	assert.equal(result.errors.length, 1)
	assert.equal(result.errors[0].fragment, 'missing')
})


test('does not turn BOM-prefixed front matter into a heading', () => {
	assert.deepEqual([...extractAnchors('\uFEFF---\ntitle: "# Not a heading"\n---\n# Actual heading\n')], ['actual-heading'])
})
