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
	const used = new Set()
	let firstHeading = true
	function addId(base) {
		if (!base) return
		let id = base
		let suffix = 0
		while (used.has(id)) id = `${base}-${++suffix}`
		used.add(id)
		anchors.add(id)
	}
	function text(node) {
		if (node.nodeName === '#text') return node.value
		if (node.tagName === 'br') return '\n'
		if (node.tagName === 'img') return node.attrs?.find(attr => attr.name === 'alt')?.value ?? ''
		return (node.childNodes ?? []).map(text).join('')
	}
	function inlineIds(node, ids) {
		for (const attr of node.attrs ?? []) {
			if (attr.name === 'id' || (node.tagName === 'a' && attr.name === 'name')) ids.add(attr.value.toLowerCase())
		}
		for (const child of node.childNodes ?? []) inlineIds(child, ids)
	}
	// Render once so a <summary> split across HTML and Markdown blocks remains
	// one element. Mark Markdown headings to avoid crediting arbitrary raw HTML.
	const tokens = markdown.parse(body, {})
	for (const token of tokens) {
		if (token.type === 'heading_open') token.attrSet('data-markdown-heading', 'true')
	}
	function visit(node) {
		if (['pre', 'code', 'script', 'style'].includes(node.tagName)) return
		const attrs = node.attrs ?? []
		if (attrs.some(attr => attr.name === 'data-markdown-heading')) {
			// Only a first, top-level H1 is consumed as the unanchored page title.
			const title = firstHeading && node.tagName === 'h1' && node.parentNode?.nodeName === '#document-fragment'
			firstHeading = false
			if (!title && Number(node.tagName.slice(1)) <= 4) {
				const ids = new Set()
				inlineIds(node, ids)
				const headingText = text(node)
				const explicit = headingText.match(/\{#([^}]+)\}\s*$/)?.[1]
				if (explicit) ids.add(explicit.toLowerCase())
				for (const id of ids) addId(id)
				if (!explicit) addId(slug(headingText))
			}
		} else if (node.tagName === 'summary' && !attrs.some(attr => attr.name === 'id')) {
			addId(slug(text(node)))
		}
		for (const child of node.childNodes ?? []) visit(child)
	}
	visit(parseFragment(markdown.renderer.render(tokens, markdown.options, {})))
	return anchors
}

function decodePath(path) {
	try { return decodeURIComponent(path) } catch { return path }
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
			const directoryLink = pathname && /\/$/.test(decodePath(pathname.split('?')[0]))
			if (target && !directoryLink && posix.extname(target) && !/\.md$/i.test(target)) continue
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
