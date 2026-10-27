import assert from 'node:assert/strict'
import { test } from 'node:test'
import { extractAnchors, findBrokenAnchors } from '../scripts/markdown-anchors.mjs'

test('extracts formatted and setext headings, preserving Unicode and punctuation rules', () => {
	const anchors = extractAnchors('## Hello **World**\n## `getPlayer()`\n## ¿Qué es un NAME?\nA & B\n-----\n')
	for (const id of ['hello-world', 'getplayer', 'que-es-un-name', 'a-and-b']) assert.ok(anchors.has(id), id)
})

test('lowercases explicit GitBook IDs instead of generating a second implicit ID', () => {
	const anchors = extractAnchors('## Transform {#Transform}\n')
	assert.deepEqual([...anchors], ['transform'])
})

test('increments duplicate headings without colliding with previously generated suffixes', () => {
	assert.deepEqual([...extractAnchors('## Test\n## Test\n## Test-1\n## Test\n')], ['test', 'test-1', 'test-1-1', 'test-2'])
})

test('recognizes heading-inline HTML IDs and expandable GitBook summaries', () => {
	const anchors = extractAnchors('## Heading <a id="CaseSensitive"></a> {#heading}\n## Legacy <a name="legacy"></a> {#legacy-heading}\n\n<details>\n<summary>What is a <strong>NAME</strong>?</summary>\n</details>\n')
	assert.deepEqual([...anchors], ['casesensitive', 'heading', 'legacy', 'legacy-heading', 'what-is-a-name'])
})

test('ignores front matter, code examples, and commented-out headings and anchors', () => {
	const content = '---\ntitle: "# hidden"\n---\n```md\n# Example\n<a id="example"></a>\n```\n\n<!--\n# Pending\n<a id="pending"></a>\n-->\n\n`<a id="inline"></a>`\n'
	assert.equal(extractAnchors(content).size, 0)
})

test('resolves same-page, relative, root, directory, query, and percent-encoded references', () => {
	const pages = new Map([
		['docs/a.md', '## Local\n[one](#local) [two](b.md#%71ue) [three](/docs/b.md#que) [four](section/#section) [five](?view=wide#local) [six](b.md?view=wide#que)'],
		['docs/b.md', '## Qué'], ['docs/section/README.md', '## Section'],
	])
	assert.deepEqual(findBrokenAnchors(pages), { checked: 6, errors: [] })
})

test('reports missing and case-mismatched anchors and removed destination pages', () => {
	const pages = new Map([['a.md', '## Transform {#Transform}\n[wrong](#Transform) [missing](b.md#gone) [removed](deleted.md#section)'], ['b.md', '# Present']])
	const result = findBrokenAnchors(pages)
	assert.equal(result.errors.length, 3)
	assert.equal(result.errors[0].fragment, 'Transform')
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
	assert.deepEqual([...extractAnchors('\uFEFF---\ntitle: "# Not a heading"\n---\n## Actual heading\n')], ['actual-heading'])
})


test('does not credit level-five and level-six headings that GitBook imports as text', () => {
	const result = findBrokenAnchors(new Map([['page.md', '##### Transform {#transform}\n###### Details {#details}\n[one](#transform) [two](#details)']]))
	assert.equal(result.errors.length, 2)
})


test('does not credit the page title H1 that GitBook renders without an ID', () => {
	assert.deepEqual([...extractAnchors('# Page title {#custom-title}\n## Section\n')], ['section'])
	assert.equal(findBrokenAnchors(new Map([['page.md', '# Page title\n[bad](#page-title)']])).errors.length, 1)
})


test('matches implicit IDs observed in GitBook English and Spanish previews', () => {
	const content = '## FK - Forward Kinematics\n## Layers & Pins\n## Publicación de scenes\n## Adding Wearables to the Linked Wearables Collection - In Bulk\n## What’s FK and IK in a rig?\n'
	assert.deepEqual([...extractAnchors(content)], ['fk-forward-kinematics', 'layers-and-pins', 'publicacion-de-scenes', 'adding-wearables-to-the-linked-wearables-collection-in-bulk', 'whats-fk-and-ik-in-a-rig'])
})

test('only a first top-level H1 is an unanchored title', () => {
	assert.deepEqual([...extractAnchors('## Resources\n# Before Starting\n')], ['resources', 'before-starting'])
	assert.deepEqual([...extractAnchors('> # Quoted\n\n## Section\n')], ['quoted', 'section'])
	assert.deepEqual([...extractAnchors('- # Listed\n\n## Section\n')], ['listed', 'section'])
})

test('extracts complete summary text across HTML and Markdown blocks without empty IDs', () => {
	const anchors = extractAnchors('<details>\n<summary>\n\n**Question**\n\n</summary>\n\nAnswer\n</details>\n\n## <a id="a"></a>\n## !!!\n## Question\n')
	assert.deepEqual([...anchors], ['question', 'a', 'question-1'])
})

test('explicit and generated IDs share the duplicate namespace observed in GitBook', () => {
	assert.deepEqual([...extractAnchors('## Foo {#foo-1}\n## Foo\n## Foo\n')], ['foo-1', 'foo', 'foo-2'])
	assert.deepEqual([...extractAnchors('## Sending Heartbeat {#heartbeat}\n### Heartbeat {#heartbeat}\n')], ['heartbeat', 'heartbeat-1'])
})

test('preserves word boundaries in multiline setext headings', () => {
	assert.deepEqual([...extractAnchors('Foo\nBar\n---\n')], ['foo-bar'])
})

test('missing dotted directories are not skipped as asset fragments', () => {
	const result = findBrokenAnchors(new Map([['page.md', '[missing](missing.v2/#x) [encoded](missing.v3%2F#x) [present](present.v2/#x)'], ['present.v2/README.md', '## X']]))
	assert.equal(result.checked, 3)
	assert.equal(result.errors.length, 2)
	assert.ok(result.errors.every(error => error.reason === 'Markdown target does not exist'))
})


test('preserves image alt text and inline code while ignoring raw HTML headings', () => {
	assert.deepEqual([...extractAnchors('## ![Logo](logo.svg) `API`\n\n<h2 id="raw">Raw HTML</h2>\n')], ['logo-api'])
})
