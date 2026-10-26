import assert from 'node:assert/strict'
import { test } from 'node:test'
import { extractLinks, resolveLocalLink, findBrokenLinks, compareBaseline } from '../scripts/markdown-links.mjs'

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

test('baseline permits only exact existing source/link pairs and identifies resolved entries', () => {
	const errors=[{source:'a.md',link:'old.md'}, {source:'b.md',link:'new.md'}]
	const result=compareBaseline(errors, {'a.md':['old.md','fixed.md']})
	assert.deepEqual(result.newErrors,[errors[1]])
	assert.deepEqual(result.stale,[{source:'a.md',link:'fixed.md'}])
	assert.equal(result.existing,1)
})
