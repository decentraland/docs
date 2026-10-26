import assert from 'node:assert/strict'
import { test } from 'node:test'
import { execFileSync } from 'node:child_process'
import { mkdtemp, writeFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { evaluateMedia, mediaFormatIssue } from '../scripts/media-formats.mjs'

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

test('content inspection detects a PNG renamed to WebP, including paths with spaces', async () => {
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
