import assert from 'node:assert/strict'
import { test } from 'node:test'
import { execFileSync } from 'node:child_process'
import { mkdtemp, writeFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { evaluateMedia, mediaFormatIssue, isSvgContent } from '../scripts/media-formats.mjs'

test('allows SVG, WebP and WebM only when their detected content matches', () => {
	for (const [path, mime] of [['a.svg', 'image/svg+xml'], ['a.WEBP', 'image/webp'], ['a.webm', 'video/webm'], ['a.webm', 'audio/webm']]) {
		assert.equal(mediaFormatIssue(path, mime), null)
	}
	for (const [path, mime] of [['a.png', 'image/png'], ['a.gif', 'image/gif'], ['a.avif', 'image/avif'], ['a.mp4', 'video/mp4'], ['a.mov', 'video/quicktime'], ['a.ico', 'image/vnd.microsoft.icon'], ['a.webp', 'image/png'], ['a.svg', 'text/html'], ['a.webm', 'video/x-matroska'], ['a.bin', 'image/png'], ['a', 'video/mp4']]) {
		assert.ok(mediaFormatIssue(path, mime), `${path}: ${mime}`)
	}
})

test('does not apply the image/video policy to documents, audio, models or archives', () => {
	for (const [path, mime] of [['page.md', 'text/plain'], ['data.json', 'application/json'], ['archive.zip', 'application/zip'], ['scene.glb', 'model/gltf-binary'], ['sound.mp3', 'audio/mpeg']]) {
		assert.equal(mediaFormatIssue(path, mime), null)
	}
})

test('permits only the exact path and bytes of an existing legacy exception', () => {
	const sha256 = 'a'.repeat(64)
	const exceptions = { 'legacy.gif': { sha256 } }
	assert.deepEqual(evaluateMedia([{ path: 'legacy.gif', mime: 'image/gif', sha256 }], exceptions), { failures: [], stale: [], grandfathered: 1 })
	for (const file of [
		{ path: 'new.gif', mime: 'image/gif', sha256 },
		{ path: 'legacy.gif', mime: 'image/gif', sha256: 'b'.repeat(64) },
	]) {
		assert.equal(evaluateMedia([file], exceptions).failures.length, 1)
	}
})

test('requires removing exceptions after their assets are deleted or converted', () => {
	const exceptions = { 'old.png': { sha256: 'a'.repeat(64) } }
	assert.deepEqual(evaluateMedia([], exceptions).stale, ['old.png'])
	assert.deepEqual(evaluateMedia([{ path: 'old.webp', mime: 'image/webp' }], exceptions).stale, ['old.png'])
	assert.equal(evaluateMedia([{ path: 'old.png', mime: 'image/png', sha256: 'a'.repeat(64) }], { 'old.png': { sha256: '*' } }).failures.length, 1)
})

let hasFile = false
try { execFileSync('file', ['--version'], { stdio: 'ignore' }); hasFile = true } catch {}

test('content inspection detects a PNG renamed to WebP, including paths with spaces', { skip: hasFile ? false : 'The optional native file utility is not installed.' }, async () => {
	const directory = await mkdtemp(join(tmpdir(), 'docs-media-test-'))
	try {
		const path = join(directory, 'renamed image.webp')
		await writeFile(path, Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aB1sAAAAASUVORK5CYII=', 'base64'))
		const mime = execFileSync('file', ['--mime-type', '--brief', '--', path], { encoding: 'utf8' }).trim()
		assert.equal(mime, 'image/png')
		assert.match(mediaFormatIssue(path, mime), /does not match/)
	} finally {
		await rm(directory, { recursive: true, force: true })
	}
})


test('validates SVG XML independently of file MIME heuristics', () => {
	for (const prefix of ['', '\uFEFF', '<?xml version="1.0"?>', '<!-- license -->', '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">']) {
		const content = Buffer.from(`${prefix}<svg xmlns="http://www.w3.org/2000/svg"><path d="M0 0"/></svg>`)
		assert.equal(isSvgContent(content), true)
		for (const mime of ['text/plain', 'text/xml', 'application/xml', 'image/svg+xml']) assert.equal(mediaFormatIssue('asset.svg', mime, content), null)
	}
})

test('rejects malformed or non-SVG XML even when file reports an SVG MIME type', () => {
	for (const text of ['<svg><path></svg>', '<html><svg/></html>', '<!-- <svg/> -->', '<svg xmlns="urn:not-svg"/>', '<svg/><!--oops', '<svg>&external;</svg>']) {
		assert.ok(mediaFormatIssue('asset.svg', 'image/svg+xml', Buffer.from(text)), text)
	}
})

test('accepts inline SVG documents while rejecting disguised binary images and SVGZ', () => {
	assert.equal(mediaFormatIssue('page.md', 'image/svg+xml'), null)
	assert.equal(mediaFormatIssue('page.html', 'image/svg+xml'), null)
	assert.ok(mediaFormatIssue('page.md', 'image/png'))
	assert.equal(mediaFormatIssue('example.mjs', 'image/svg+xml', Buffer.from('const icon = `<svg/>`')), null)
	assert.ok(mediaFormatIssue('disguised.mjs', 'image/svg+xml', Buffer.from('<svg/>')))
	assert.ok(mediaFormatIssue('asset.svgz', 'application/gzip'))
	assert.ok(mediaFormatIssue('asset.SVGZ', 'application/octet-stream'))
})


test('accepts bounded internal literal namespace entities without loading a DTD', () => {
	const content = Buffer.from(`<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "https://example.invalid/svg.dtd" [
		<!-- <!ENTITY ignored SYSTEM "https://example.invalid/ignored"> -->
		<!ENTITY ns_svg "http://www.w3.org/2000/svg">
		<!ENTITY ns_xlink 'http://www.w3.org/1999/xlink'>
	]><svg xmlns="&ns_svg;" xmlns:xlink="&ns_xlink;"><text>Example</text></svg>`)
	assert.equal(isSvgContent(content), true)
	assert.equal(mediaFormatIssue('export.svg', 'text/xml', content), null)
})

test('gives an actionable diagnostic for external, parameter, and nested SVG entities', () => {
	for (const declaration of [
		'<!ENTITY value SYSTEM "https://example.invalid/external">',
		'<!ENTITY % value "parameter">',
		'<!ENTITY first "literal"><!ENTITY value "&first;">',
		'<!ENTITY value "<path/>">',
	]) {
		const issue = mediaFormatIssue('export.svg', 'image/svg+xml', Buffer.from(`<!DOCTYPE svg [${declaration}]><svg/>`))
		assert.match(issue, /unsupported entity declarations/)
		assert.match(issue, /Export a self-contained SVG/)
	}
})

test('bounds SVG entity declarations, literal size, total declared bytes, and total expansion', () => {
	const documents = [
		`<!DOCTYPE svg [${Array.from({ length: 65 }, (_, i) => `<!ENTITY e${i} "x">`).join('')}]><svg/>`,
		`<!DOCTYPE svg [<!ENTITY value "${'x'.repeat(4097)}">]><svg/>`,
		`<!DOCTYPE svg [${Array.from({ length: 17 }, (_, i) => `<!ENTITY e${i} "${'x'.repeat(4096)}">`).join('')}]><svg/>`,
		`<!DOCTYPE svg [<!ENTITY value "${'x'.repeat(4096)}">]><svg><text>${'&value;'.repeat(257)}</text></svg>`,
	]
	for (const text of documents) assert.match(mediaFormatIssue('export.svg', 'text/xml', Buffer.from(text)), /entity expansion limits/)
})
