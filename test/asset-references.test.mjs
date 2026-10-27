import assert from 'node:assert/strict'
import { test } from 'node:test'
import { isAsset, findUnreferencedAssets, compareAssetBaseline, referencedAsset, assetLinks, auditAssetReferences, gitbookSpaceDirectories } from '../scripts/asset-references.mjs'

test('includes media, downloads, models, content JSON and files in asset folders', () => {
	for (const path of ['image.webp', 'video.webm', 'model.glb', 'resources/example.zip', 'font.woff2', 'creator/tutorials/examples/catalog.json', '.gitbook/assets/sample.custom', 'creator/images/source.blend']) assert.equal(isAsset(path), true, path)
	for (const path of ['README.md', 'creator/images/README.md', 'package.json', 'scripts/config.json', 'scripts/check.mjs', '.github/workflows/check.yml']) assert.equal(isAsset(path), false, path)
})

test('finds Markdown, reference-style, HTML, GitBook and front-matter asset references', () => {
	const paths = ['docs/hero.webp', 'docs/inline.svg', 'docs/ref.webp', 'docs/video.webm', 'docs/poster.webp', 'docs/download.zip', 'docs/unused.webp']
	const content = '---\ncover: hero.webp\n---\n![inline](inline.svg) [ref][asset]\n\n[asset]: ref.webp\n\n<video src="video.webm" poster="poster.webp"></video>\n\n{% file src="download.zip" %}'
	assert.deepEqual(findUnreferencedAssets(paths, [{ path: 'docs/page.md', content }]), ['docs/unused.webp'])
})

test('resolves encoded filenames, queries, fragments and current repository-hosted URLs', () => {
	assert.equal(referencedAsset('docs/page.md', '../assets/my%20image.webp?raw=1#preview'), 'assets/my image.webp')
	assert.equal(referencedAsset('docs/page.md', 'https://raw.githubusercontent.com/decentraland/docs/main/assets/my%20image.webp'), 'assets/my image.webp')
	assert.equal(referencedAsset('docs/page.md', 'https://github.com/decentraland/docs/blob/main/assets/image.webp?raw=true'), 'assets/image.webp')
	assert.equal(referencedAsset('docs/page.md', 'https://github.com/another/repo/blob/main/assets/image.webp'), null)
	assert.equal(referencedAsset('docs/page.md', 'https://github.com/decentraland/docs/blob/old-commit/assets/image.webp'), null)
})

test('requires exact references and ignores directory links, code samples and plain filenames', () => {
	const content = '[folder](images/) ![wrong case](images/HERO.webp)\n\n`![sample](images/hero.webp)`\n\nimages/hero.webp'
	assert.deepEqual(findUnreferencedAssets(['docs/images/hero.webp'], [{ path: 'docs/page.md', content }]), ['docs/images/hero.webp'])
})

test('reports newly added assets and assets orphaned by removing a Markdown reference', () => {
	const paths = ['used.webp', 'new.webp', 'legacy.webp']
	const before = findUnreferencedAssets(paths, [{ path: 'README.md', content: '![used](used.webp)' }])
	assert.deepEqual(compareAssetBaseline(before, ['legacy.webp']).newUnused, ['new.webp'])
	const after = findUnreferencedAssets(paths, [{ path: 'README.md', content: '' }])
	assert.deepEqual(compareAssetBaseline(after, ['legacy.webp']).newUnused, ['new.webp', 'used.webp'])
})

test('requires removing legacy entries when files are deleted or become referenced', () => {
	assert.deepEqual(compareAssetBaseline([], ['deleted.webp', 'now-used.webp']), { newUnused: [], stale: ['deleted.webp', 'now-used.webp'], existing: 0 })
})


test('counts only the supported cover front-matter field as an asset reference', () => {
	const content = '\uFEFF---\ncover: cover.webp\ndescription: description.webp\naliases: [alias.webp]\nexamples:\n  image: example.webp\n---\n'
	assert.deepEqual(assetLinks(content), ['cover.webp'])
	assert.deepEqual(findUnreferencedAssets(['cover.webp', 'description.webp', 'alias.webp', 'example.webp'], [{ path: 'README.md', content }]), ['alias.webp', 'description.webp', 'example.webp'])
})

test('aggregates YAML failures while continuing to inspect page bodies and other pages', () => {
	const result = auditAssetReferences(['a.webp', 'b.webp', 'unused.webp'], [
		{ path: 'a.md', content: '---\ncover: [invalid\n---\n![a](a.webp)' },
		{ path: 'b.md', content: '---\ncover: {invalid\n---\n![b](b.webp)' },
		{ path: 'valid.md', content: '![missing](missing.webp)' },
	])
	assert.deepEqual(result.unused, ['unused.webp'])
	assert.equal(result.errors.length, 3)
	assert.deepEqual(result.errors.map(error => error.source), ['a.md', 'b.md', 'valid.md'])
	assert.match(result.errors[0].reason, /Invalid YAML/)
	assert.match(result.errors[2].reason, /does not exist/)
})

test('rejects root-relative and cross-space assets even when their paths exist', () => {
	const paths = ['creator/images/a.webp', 'player/images/b.webp']
	const result = auditAssetReferences(paths, [{ path: 'creator/guide.md', content: '![root](/creator/images/a.webp) ![other](../player/images/b.webp)' }], ['creator', 'player'])
	assert.equal(result.errors.length, 2)
	assert.deepEqual(result.unused, paths)
	assert.match(result.errors[0].reason, /leading-slash/)
	assert.match(result.errors[1].reason, /outside/)
})

test('uses the most specific configured space, including nested language spaces', () => {
	const spaces = gitbookSpaceDirectories({ site: { structure: [{ type: 'section', children: [
		{ content: { directory: './docs/' } }, { content: { directory: './docs/es/' } }, { content: { directory: null } },
	] }] } })
	assert.deepEqual(spaces, ['docs/es', 'docs'])
	const result = auditAssetReferences(['docs/images/a.webp', 'docs/es/images/b.webp'], [
		{ path: 'docs/es/guide.md', content: '![escape](../images/a.webp) ![local](images/b.webp)' },
		{ path: 'docs/guide.md', content: '![nested](es/images/b.webp)' },
	], spaces)
	assert.equal(result.errors.length, 2)
	assert.deepEqual(result.unused, ['docs/images/a.webp'])
	assert.throws(() => gitbookSpaceDirectories({ site: { structure: [{ content: { directory: '../outside' } }] } }), /inside the repository/)
})

test('keeps public repository URLs usable without applying local space-boundary rules', () => {
	const result = auditAssetReferences(['player/images/a.webp'], [{ path: 'creator/guide.md', content: '![remote](https://raw.githubusercontent.com/decentraland/docs/main/player/images/a.webp)' }], ['creator', 'player'])
	assert.deepEqual(result, { unused: [], errors: [] })
})
