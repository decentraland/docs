import assert from 'node:assert/strict'
import { test } from 'node:test'
import { spawnSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { gzipSync } from 'node:zlib'

const scripts = fileURLToPath(new URL('../scripts/', import.meta.url))
const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aB1sAAAAASUVORK5CYII=', 'base64')
const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1"><rect width="1" height="1"/></svg>'
const fileProbe = spawnSync('file', ['--version'], { encoding: 'utf8' })
const nativeMediaOptions = { skip: fileProbe.error?.code === 'ENOENT' ? 'Native media CLI integration requires the file utility; CI runs these tests on Ubuntu.' : false }

async function fixture(t) {
	const root = await mkdtemp(join(tmpdir(), 'docs-validation-cli-'))
	t.after(() => rm(root, { recursive: true, force: true }))
	const initialized = spawnSync('git', ['init', '--quiet'], { cwd: root, encoding: 'utf8' })
	assert.equal(initialized.status, 0, initialized.stderr || initialized.error?.message)
	async function write(path, content) {
		await mkdir(dirname(join(root, path)), { recursive: true })
		await writeFile(join(root, path), content)
	}
	function git(...args) {
		const result = spawnSync('git', args, { cwd: root, encoding: 'utf8' })
		assert.equal(result.status, 0, result.stderr || result.error?.message)
	}
	function run(script, ...args) {
		const result = spawnSync(process.execPath, [join(scripts, script), '--root', root, ...args], { cwd: root, encoding: 'utf8', timeout: 30_000 })
		assert.ifError(result.error)
		assert.equal(result.signal, null, result.stderr)
		return result
	}
	await write('scripts/unreferenced-assets-baseline.json', '[]\n')
	await write('scripts/media-format-exceptions.json', '{}\n')
	return { root, write, git, run }
}

test('local-link CLI validates tracked and untracked pages while respecting Git ignores', async t => {
	const { write, git, run } = await fixture(t)
	await write('.gitignore', 'ignored.md\n')
	await write('README.md', '[photo](docs/my%20photo.webp) [section](docs/)\n')
	await write('docs/my photo.webp', 'asset bytes are irrelevant to path validation')
	await write('ignored.md', '[missing](missing-ignored.md)\n')
	git('add', '.gitignore', 'README.md', 'docs/my photo.webp')
	await write('docs/untracked.md', '[home](../README.md)\n')
	const result = run('check-local-links.mjs', '--json')
	assert.equal(result.status, 0, result.stderr)
	assert.deepEqual(JSON.parse(result.stdout), { pages: 2, errors: [] })
})

test('local-link CLI fails for a removed tracked asset and reports its source in JSON', async t => {
	const { root, write, git, run } = await fixture(t)
	await write('docs/page.md', '![image](gone.webp)\n')
	await write('docs/gone.webp', 'previous asset')
	git('add', 'docs')
	await rm(join(root, 'docs/gone.webp'))
	const result = run('check-local-links.mjs', '--json')
	assert.equal(result.status, 1, result.stderr)
	const report = JSON.parse(result.stdout)
	assert.equal(report.errors.length, 1)
	assert.equal(report.errors[0].source, 'docs/page.md')
	assert.equal(report.errors[0].target, 'docs/gone.webp')
})

test('asset CLI reports new orphans and stale baseline entries together', async t => {
	const { write, run } = await fixture(t)
	await write('README.md', '![used](used.webp)\n')
	await write('used.webp', 'used image')
	await write('legacy.webp', 'legacy image')
	await write('new.webp', 'new image')
	await write('scripts/unreferenced-assets-baseline.json', JSON.stringify(['legacy.webp', 'deleted.webp']))
	const result = run('check-asset-references.mjs', '--json')
	assert.equal(result.status, 1, result.stderr)
	const report = JSON.parse(result.stdout)
	assert.deepEqual(report.newUnused, ['new.webp'])
	assert.deepEqual(report.stale, ['deleted.webp'])
	assert.equal(report.existing, 1)
})

test('asset CLI allows exact legacy orphans normally but rejects them in strict mode', async t => {
	const { write, run } = await fixture(t)
	await write('legacy.webp', 'legacy image')
	await write('scripts/unreferenced-assets-baseline.json', '["legacy.webp"]\n')
	assert.equal(run('check-asset-references.mjs').status, 0)
	const result = run('check-asset-references.mjs', '--strict')
	assert.equal(result.status, 1)
	assert.match(result.stderr, /legacy\.webp/)
})

test('asset CLI aggregates malformed front matter and continues checking other pages', async t => {
	const { write, run } = await fixture(t)
	await write('bad-one.md', '---\ncover: [unclosed\n---\n# One\n')
	await write('bad-two.md', '---\ncover: {unclosed\n---\n# Two\n')
	await write('good.md', '![used](used.webp)\n')
	await write('used.webp', 'used image')
	await write('orphan.webp', 'unreferenced image')
	const result = run('check-asset-references.mjs', '--json')
	assert.equal(result.status, 1, result.stderr)
	const report = JSON.parse(result.stdout)
	assert.equal(report.pages, 3)
	assert.equal(report.errors.length, 2)
	assert.deepEqual(report.errors.map(error => error.source ?? error.path).sort(), ['bad-one.md', 'bad-two.md'])
	assert.deepEqual(report.newUnused, ['orphan.webp'])
})

test('asset CLI rejects root-relative and cross-space asset links that exist on disk', async t => {
	const { write, run } = await fixture(t)
	await write('gitbook-docs.yaml', 'site:\n  structure:\n    - type: space\n      content:\n        directory: ./creator\n    - type: space\n      content:\n        directory: ./player\n')
	await write('creator/images/local.webp', 'creator image')
	await write('player/images/shared.webp', 'player image')
	await write('creator/page.md', '![cross-space](../player/images/shared.webp)\n![root-relative](/creator/images/local.webp)\n')
	await write('player/page.md', '![local](images/shared.webp)\n')
	const result = run('check-asset-references.mjs', '--json')
	assert.equal(result.status, 1, result.stderr)
	const report = JSON.parse(result.stdout)
	assert.equal(report.errors.length, 2)
	assert.deepEqual(report.errors.map(error => error.link).sort(), ['/creator/images/local.webp', '../player/images/shared.webp'].sort())
})

test('asset CLI accepts in-space assets and detects supported references after a BOM', async t => {
	const { write, run } = await fixture(t)
	await write('gitbook-docs.yaml', 'site:\n  structure:\n    - type: space\n      content:\n        directory: ./docs\n')
	await write('docs/page.md', '\uFEFF---\ncover: images/cover.webp\ndescription: images/not-a-reference.webp\n---\n<picture><source srcset="images/small.webp 1x, images/large.webp 2x"></picture>\n\n<div>\n{% file src="images/download.zip" %}\n</div>\n')
	for (const name of ['cover.webp', 'small.webp', 'large.webp', 'download.zip', 'not-a-reference.webp']) await write(`docs/images/${name}`, 'asset')
	const result = run('check-asset-references.mjs', '--json')
	assert.equal(result.status, 1, result.stderr)
	const report = JSON.parse(result.stdout)
	assert.deepEqual(report.newUnused, ['docs/images/not-a-reference.webp'])
	assert.equal(report.errors.length, 0)
})

test('media CLI accepts valid SVG preambles and Markdown that starts with inline SVG', nativeMediaOptions, async t => {
	const { write, run } = await fixture(t)
	await write('comment.svg', `<!-- exported icon -->\n${svg}`)
	await write('doctype.svg', `<?xml version="1.0"?>\n<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n${svg}`)
	await write('README.md', `${svg}\n\n# Documentation\n`)
	const result = run('check-media-formats.mjs')
	assert.equal(result.status, 0, result.stderr)
	assert.match(result.stdout, /0 format violations/)
})

test('media CLI rejects disguised PNGs and compressed SVGs, including paths with spaces', nativeMediaOptions, async t => {
	const { write, run } = await fixture(t)
	await write('renamed image.webp', png)
	await write('hidden.bin', png)
	await write('compressed.svgz', gzipSync(svg))
	const result = run('check-media-formats.mjs')
	assert.equal(result.status, 1)
	for (const path of ['renamed image.webp', 'hidden.bin', 'compressed.svgz']) assert.ok(result.stderr.includes(path), result.stderr)
	assert.match(result.stdout, /3 format violations/)
})

test('media CLI enforces exact legacy hashes and rejects stale exceptions', nativeMediaOptions, async t => {
	const { root, write, git, run } = await fixture(t)
	const sha256 = createHash('sha256').update(png).digest('hex')
	await write('legacy.png', png)
	await write('scripts/media-format-exceptions.json', JSON.stringify({ 'legacy.png': { sha256 } }))
	git('add', 'legacy.png')
	assert.equal(run('check-media-formats.mjs').status, 0)
	await write('legacy.png', Buffer.concat([png, Buffer.from('changed')]))
	const changed = run('check-media-formats.mjs')
	assert.equal(changed.status, 1)
	assert.match(changed.stderr, /legacy\.png/)
	await rm(join(root, 'legacy.png'))
	const deleted = run('check-media-formats.mjs')
	assert.equal(deleted.status, 1)
	assert.match(deleted.stderr, /legacy\.png: remove the stale entry/)
})

test('navigation CLI warns by default, fails in strict mode, and includes untracked pages', async t => {
	const { write, run } = await fixture(t)
	await write('gitbook-docs.yaml', 'site:\n  structure:\n    - content:\n        directory: ./docs\n')
	await write('scripts/navigation-exceptions.json', '{}')
	await write('docs/SUMMARY.md', '* [Home](README.md)\n* [Duplicate](README.md#section)')
	await write('docs/README.md', '# Home')
	await write('docs/new.md', '# New')
	await write('.gitignore', 'docs/ignored.md\n')
	await write('docs/ignored.md', '# Ignored')
	const normal = run('check-navigation.mjs', '--json')
	assert.equal(normal.status, 0, normal.stderr)
	const warnings = JSON.parse(normal.stdout).warnings
	assert.equal(warnings.length, 2)
	assert.ok(warnings.some(issue => issue.source === 'docs/new.md'))
	assert.ok(warnings.every(issue => issue.source !== 'docs/ignored.md'))
	assert.equal(run('check-navigation.mjs', '--strict').status, 1)
})

test('navigation CLI fails when a tracked navigation destination is removed', async t => {
	const { root, write, git, run } = await fixture(t)
	await write('gitbook-docs.yaml', 'site:\n  structure:\n    - content:\n        directory: docs\n')
	await write('scripts/navigation-exceptions.json', '{}')
	await write('docs/SUMMARY.md', '* [Home](README.md)')
	await write('docs/README.md', '# Home')
	git('add', '.')
	await rm(join(root, 'docs/README.md'))
	const result = run('check-navigation.mjs', '--json')
	assert.equal(result.status, 1)
	assert.match(JSON.parse(result.stdout).errors[0].reason, /does not exist/)
})

test('navigation CLI fails for stale exceptions and malformed configuration', async t => {
	const { write, run } = await fixture(t)
	await write('gitbook-docs.yaml', 'site:\n  structure:\n    - content:\n        directory: docs\n')
	await write('docs/SUMMARY.md', '* [Home](README.md)')
	await write('docs/README.md', '# Home')
	await write('scripts/navigation-exceptions.json', '{"docs/README.md":{"reason":"Now listed"}}')
	assert.equal(run('check-navigation.mjs').status, 1)
	await write('gitbook-docs.yaml', 'site: [')
	assert.equal(run('check-navigation.mjs').status, 1)
})


test('navigation CLI reports file and line and rejects a missing root argument', async t => {
	const { root, write, run } = await fixture(t)
	await write('gitbook-docs.yaml', 'site:\n  structure:\n    - content:\n        directory: docs\n')
	await write('scripts/navigation-exceptions.json', '{}')
	await write('docs/SUMMARY.md', '# Menu\n\n* [Bad](?query)')
	const output = run('check-navigation.mjs')
	assert.equal(output.status, 1)
	assert.match(output.stderr, /error: docs\/SUMMARY\.md:3: Navigation entry must target a page path\. \(\?query\)/)
	const missingRoot = spawnSync(process.execPath, [join(scripts, 'check-navigation.mjs'), '--root'], { cwd: root, encoding: 'utf8' })
	assert.equal(missingRoot.status, 1)
	assert.match(missingRoot.stderr, /--root requires a repository directory/)
})

test('navigation CLI rejects an external-only manifest even without strict mode', async t => {
	const { write, run } = await fixture(t)
	await write('gitbook-docs.yaml', 'site:\n  structure:\n    - content:\n        directory: docs\n')
	await write('scripts/navigation-exceptions.json', '{}')
	await write('docs/SUMMARY.md', '* [External](https://example.org)')
	const result = run('check-navigation.mjs', '--json')
	assert.equal(result.status, 1)
	assert.equal(JSON.parse(result.stdout).errors[0].reason, 'Navigation has no local Markdown page entries or supported translation declaration.')
})
