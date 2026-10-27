import assert from 'node:assert/strict'
import { test } from 'node:test'
import { extractLinks, resolveLocalLink, findBrokenLinks, srcsetLinks, splitFrontMatter } from '../scripts/markdown-links.mjs'

test('extracts inline, reference, image, HTML and GitBook links', () => {
	const content = '[page](page.md) ![image](image.webp) [ref][r]\n\n[r]: other.md\n\n<a href="html.md">HTML</a><img src="photo.webp"><video poster="cover.webp"></video>\n\n{% file src="file.zip" %}'
	assert.deepEqual(extractLinks(content), ['page.md', 'image.webp', 'other.md', 'html.md', 'photo.webp', 'cover.webp', 'file.zip'])
})

test('ignores YAML, code samples and HTML comments', () => {
	assert.deepEqual(extractLinks('---\ntext: "[x](yaml.md)"\n---\n`[x](inline.md)`\n\n```md\n[x](fence.md)\n```\n\n<!-- [x](comment.md) -->'), [])
})

test('resolves encoded paths, queries, fragments and repository-root paths', () => {
	assert.deepEqual(resolveLocalLink('docs/page.md', '../images/my%20photo.webp?raw=1#preview'), {target:'images/my photo.webp'})
	assert.deepEqual(resolveLocalLink('docs/page.md', '/README.md'), {target:'README.md'})
	for (const link of ['#heading','https://example.org/file.md','mailto:a@example.org','//example.org/a']) assert.equal(resolveLocalLink('a.md',link),null)
	assert.ok(resolveLocalLink('a.md','../outside.md').error)
	assert.ok(resolveLocalLink('a.md','bad%ZZ.md').error)
})

test('checks exact casing and reports missing assets, including deleted files', () => {
	const paths = new Set(['docs/README.md', 'docs/images'])
	assert.equal(findBrokenLinks('docs/a.md','[ok](README.md) [directory](images/)',paths).length,0)
	assert.equal(findBrokenLinks('docs/a.md','[bad](readme.md) ![deleted](images/gone.webp)',paths).length,2)
})

test('reports legacy broken-reference placeholders as failures', () => {
	const errors = findBrokenLinks('docs/page.md', '![Screenshot](broken-reference)', new Set(['docs/page.md']))
	assert.equal(errors.length, 1)
	assert.equal(errors[0].target, 'docs/broken-reference')
})


test('extracts srcset candidates without splitting data URLs on their internal comma', () => {
	assert.deepEqual(srcsetLinks('data:image/svg+xml,%3Csvg%3E,%3C/svg%3E 1x, images/large.webp 2x, images/wide.webp 1200w'), ['data:image/svg+xml,%3Csvg%3E,%3C/svg%3E', 'images/large.webp', 'images/wide.webp'])
	assert.deepEqual(extractLinks('<picture><source srcset="small.webp 1x, large.webp 2x"><img src="fallback.webp"></picture>'), ['small.webp', 'large.webp', 'fallback.webp'])
	assert.deepEqual(srcsetLinks('first.webp, second.webp 2x'), ['first.webp', 'second.webp'])
})

test('extracts GitBook tags in HTML blocks but ignores comments and code', () => {
	const content = `<div>
{% file src="download.zip" %}
<!-- {% file src="comment.zip" %} -->
<pre><code>{% file src="example.zip" %}</code></pre>
{% image src="image.webp" %}
</div>

An inline <code>{% file src="inline-example.zip" %}</code> example.

\`{% file src="markdown-example.zip" %}\`
`
	assert.deepEqual(extractLinks(content), ['download.zip', 'image.webp'])
})

test('recognizes front matter after a byte-order mark and at end of file', () => {
	assert.deepEqual(splitFrontMatter('\uFEFF---\ncover: image.webp\n---\n[page](page.md)'), { frontMatter: 'cover: image.webp', body: '[page](page.md)' })
	assert.deepEqual(extractLinks('\uFEFF---\ntext: "[metadata](ignored.md)"\n---\n[page](page.md)'), ['page.md'])
	assert.deepEqual(extractLinks('---\ntext: "[metadata](ignored.md)"\n---'), [])
})
