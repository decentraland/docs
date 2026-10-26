import assert from 'node:assert/strict'
import { test } from 'node:test'
import { parseCategory, parseExample } from '../scripts/example-catalog/frontmatter.mjs'

const example = `---
id: sample
name: "Example: quoted title"
description: >-
  A description with a colon:
  and a second line.
tags: ["game", 'camera']
source: "https://github.com/decentraland/example"
license: MIT
---
# Example
`

test('parses quoted strings, folded descriptions, and inline lists as YAML', () => {
	const parsed = parseExample('sample.md', 'gameplay-interaction', example)
	assert.equal(parsed.name, 'Example: quoted title')
	assert.equal(parsed.description, 'A description with a colon: and a second line.')
	assert.equal(parsed.source, 'https://github.com/decentraland/example')
	assert.deepEqual(parsed.tags, ['game', 'camera'])
	assert.equal(parsed.maintenance, 'decentraland')
})

test('accepts block lists with comments and derives external ownership', () => {
	const content = example.replace('tags: ["game", \'camera\']', 'tags:\n  - game # gameplay\n  - "camera"')
		.replace('decentraland/example', 'ExampleOwner/example')
	const parsed = parseExample('sample.md', 'gameplay-interaction', content)
	assert.deepEqual(parsed.tags, ['game', 'camera'])
	assert.equal(parsed.maintainer, 'ExampleOwner')
	assert.equal(parsed.maintenance, 'community')
})

for (const field of ['id', 'name', 'description', 'source', 'license']) {
	for (const value of ['', '[]', 'true', '42', '"  "']) {
		test(`rejects ${field} with invalid value ${JSON.stringify(value)}`, () => {
			// Replace the complete description block as well as scalar fields.
			const content = example.replace(new RegExp(`^${field}:.*(?:\\n  .*)*`, 'm'), `${field}: ${value}`)
			assert.throws(() => parseExample('sample.md', 'gameplay-interaction', content), new RegExp(`sample.md ${field} must be a non-empty string`))
		})
	}
}

test('rejects empty, scalar, and mixed-type tags', () => {
	for (const value of ['', 'game', '[]', '[game, 42]', '[game, " "]']) {
		assert.throws(() => parseExample('sample.md', 'gameplay-interaction', example.replace(/^tags:.*$/m, `tags: ${value}`)), /tags must be/)
	}
})

test('requires a developer for games and validates optional fields', () => {
	assert.throws(() => parseExample('sample.md', 'published-games', example), /developer must be/)
	for (const field of ['developer', 'realm', 'position']) {
		assert.throws(() => parseExample('sample.md', 'gameplay-interaction', example.replace('license: MIT', `license: MIT\n${field}: []`)), new RegExp(`${field} must be`))
	}
})

test('rejects duplicate YAML keys and malformed YAML', () => {
	assert.throws(() => parseExample('sample.md', 'gameplay-interaction', example.replace('license: MIT', 'license: MIT\nlicense: Apache-2.0')), /invalid YAML/)
	assert.throws(() => parseExample('sample.md', 'gameplay-interaction', example.replace('license: MIT', 'license: [broken')), /invalid YAML/)
})

test('requires a GitHub repository source', () => {
	for (const url of ['invalid', 'https://github.com/owner', 'http://github.com/owner/repo', 'https://example.com/owner/repo']) {
		assert.throws(() => parseExample('sample.md', 'gameplay-interaction', example.replace('https://github.com/decentraland/example', url)), /source must be/)
	}
})

test('parses category YAML and validates order without coercion', () => {
	const content = '---\ntitle: "Audio: examples"\ndescription: Useful examples\norder: 2\n---\n'
	assert.deepEqual(parseCategory('audio', content), { id: 'audio', name: 'Audio: examples', description: 'Useful examples', order: 2 })
	for (const value of ['', '"2"', 'true', '1.5']) {
		assert.throws(() => parseCategory('audio', content.replace('order: 2', `order: ${value}`)), /order must be an integer/)
	}
})
