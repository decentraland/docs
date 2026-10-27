import MarkdownIt from 'markdown-it'
import { parseFragment } from 'parse5'
import { posix } from 'node:path'
import { extractLinks, resolveLocalLink, splitFrontMatter } from './markdown-links.mjs'

const markdown = new MarkdownIt({ html: true })

// GitBook lowercases explicit IDs; implicit headings use lowercase text with
// diacritics removed, ampersands expanded, and separators collapsed. These
// rules are covered by fixtures checked against rendered GitBook previews.
function slug(text) {
	return text.normalize('NFKD').replace(/\p{M}/gu, '').toLowerCase()
		.replace(/&/g, 'and').replace(/[^\p{L}\p{N}_\s-]/gu, '')
		.replace(/[\s-]+/g, '-').replace(/^-|-$/g, '')
}

export function extractAnchors(content) {
	const { body } = splitFrontMatter(content)
	const anchors = new Set()
	const generated = new Set()
	let titleSeen = false
	function addGenerated(text) {
		const base = slug(text)
		let id = base
		let suffix = 0
		while (generated.has(id)) id = `${base}-${++suffix}`
		generated.add(id)
		anchors.add(id)
	}
	function htmlAnchors(html, heading = false) {
		function text(node) {
			return node.nodeName === '#text' ? node.value : (node.childNodes ?? []).map(text).join('')
		}
		function visit(node) {
			const attrs = node.attrs ?? []
			for (const attr of attrs) {
				if (heading && (attr.name === 'id' || (node.tagName === 'a' && attr.name === 'name'))) anchors.add(attr.value.toLowerCase())
			}
			// GitBook makes expandable FAQ summaries linkable too.
			if (node.tagName === 'summary' && !attrs.some(attr => attr.name === 'id')) addGenerated(text(node))
			for (const child of node.childNodes ?? []) visit(child)
		}
		visit(parseFragment(html))
	}
	function visit(tokens) {
		for (let index = 0; index < tokens.length; index++) {
			const token = tokens[index]
			// Git Sync consumes the first H1 as the page title, rendered without an ID.
			if (token.type === 'heading_open' && token.tag === 'h1' && !titleSeen) {
				titleSeen = true
				continue
			}
			if (token.type === 'heading_open' && Number(token.tag.slice(1)) <= 4) {
				const inline = tokens[index + 1]
				for (const child of inline.children ?? []) {
					if (child.type === 'html_inline') htmlAnchors(child.content, true)
				}
				const explicit = inline.content.match(/\{#([^}]+)\}\s*$/)?.[1]
				if (explicit) anchors.add(explicit.toLowerCase())
				else {
					const text = (inline.children ?? [])
						.filter(child => ['text', 'code_inline', 'image'].includes(child.type))
						.map(child => child.content).join('')
					addGenerated(text)
				}
			}
			if (token.type === 'html_inline' || token.type === 'html_block') htmlAnchors(token.content)
			if (token.children) visit(token.children)
		}
	}
	visit(markdown.parse(body, {}))
	return anchors
}

export function findBrokenAnchors(pages) {
	const anchors = new Map([...pages].map(([path, content]) => [path, extractAnchors(content)]))
	const errors = []
	let checked = 0
	for (const [source, content] of pages) {
		for (const link of extractLinks(content)) {
			if (!link.includes('#') || /^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(link)) continue
			const hash = link.indexOf('#')
			const pathname = link.slice(0, hash)
			const resolved = pathname && !pathname.startsWith('?') ? resolveLocalLink(source, pathname) : { target: source }
			let target = resolved?.target
			if (target && !anchors.has(target) && anchors.has(posix.join(target, 'README.md'))) target = posix.join(target, 'README.md')
			// Asset fragments (SVG IDs, PDF page numbers, etc.) are not Markdown anchors.
			if (target && posix.extname(target) && !/\.md$/i.test(target)) continue
			let fragment
			try {
				fragment = decodeURIComponent(link.slice(hash + 1))
			} catch {
				errors.push({ source, link, target, reason: 'Invalid fragment encoding' })
				continue
			}
			if (!fragment) continue
			checked++
			if (!anchors.has(target)) errors.push({ source, link, target, reason: resolved?.error ?? 'Markdown target does not exist' })
			else if (!anchors.get(target).has(fragment)) errors.push({ source, link, target, fragment, reason: 'Anchor does not exist (IDs are case-sensitive)' })
		}
	}
	return { checked, errors }
}
