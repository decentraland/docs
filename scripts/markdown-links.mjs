import MarkdownIt from 'markdown-it'
import { parseFragment } from 'parse5'
import { posix } from 'node:path'

const markdown = new MarkdownIt({ html: true })

export function splitFrontMatter(content) {
	const text = content.replace(/^\uFEFF/, '')
	const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/)
	return { body: match ? text.slice(match[0].length) : text, frontMatter: match?.[1] }
}

// Follow the srcset tokenization rules: commas inside a URL (notably a data
// URL) belong to that URL; commas after a descriptor separate candidates.
export function srcsetLinks(value) {
	const links = []
	let offset = 0
	while (offset < value.length) {
		while (/[\t\n\f\r ,]/.test(value[offset] ?? '') && offset < value.length) offset++
		const start = offset
		while (offset < value.length && !/[\t\n\f\r ]/.test(value[offset])) offset++
		const url = value.slice(start, offset)
		if (!url) break
		links.push(url.replace(/,+$/, ''))
		if (url.endsWith(',')) continue
		let parentheses = 0
		while (offset < value.length) {
			const character = value[offset++]
			if (character === '(') parentheses++
			else if (character === ')' && parentheses) parentheses--
			else if (character === ',' && !parentheses) break
		}
	}
	return links.filter(Boolean)
}

export function extractLinks(content) {
	// YAML may contain prose and example URLs, not rendered Markdown links.
	const { body } = splitFrontMatter(content)
	const links = []
	function gitbookLinks(text) {
		for (const tag of text.matchAll(/\{%\s*(?:file|embed|image)\b([\s\S]*?)%\}/g)) {
			for (const attr of tag[1].matchAll(/\b(?:src|url)\s*=\s*(["'])(.*?)\1/g)) links.push(attr[2])
		}
	}
	function htmlLinks(html) {
		function visit(node) {
			if (['code', 'pre', 'script', 'style'].includes(node.tagName)) return
			for (const attr of node.attrs ?? []) {
				if (['href', 'src', 'poster'].includes(attr.name)) links.push(attr.value)
				if (attr.name === 'srcset') links.push(...srcsetLinks(attr.value))
			}
			if (node.nodeName === '#text') gitbookLinks(node.value)
			for (const child of node.childNodes ?? []) visit(child)
			if (node.content) visit(node.content)
		}
		visit(parseFragment(html))
	}
	function visit(tokens) {
		let codeTag
		for (const token of tokens) {
			if (token.type === 'html_inline') {
				if (codeTag) {
					if (new RegExp(`</${codeTag}\\s*>`, 'i').test(token.content)) codeTag = undefined
					continue
				}
				const opening = token.content.match(/^<(code|pre|script|style)(?:\s|>)/i)
				if (opening) {
					if (!new RegExp(`</${opening[1]}\\s*>`, 'i').test(token.content)) codeTag = opening[1]
					continue
				}
			}
			if (codeTag) continue
			if (token.type === 'link_open') links.push(token.attrGet('href'))
			if (token.type === 'image') links.push(token.attrGet('src'))
			if (token.type === 'html_inline' || token.type === 'html_block') htmlLinks(token.content)
			if (token.type === 'text') gitbookLinks(token.content)
			if (token.children) visit(token.children)
		}
	}
	visit(markdown.parse(body, {}))
	return [...new Set(links.filter(Boolean))]
}

export function resolveLocalLink(source, link) {
	if (/^(?:[a-z][a-z\d+.-]*:|\/\/|#)/i.test(link)) return null
	const pathname = link.split(/[?#]/, 1)[0]
	if (!pathname) return null
	let decoded
	try {
		decoded = decodeURIComponent(pathname)
	} catch {
		return { error: 'Invalid URL encoding' }
	}
	const target = posix.normalize(decoded.startsWith('/') ? decoded.slice(1) : posix.join(posix.dirname(source), decoded))
	if (target === '..' || target.startsWith('../')) return { error: 'Target escapes the repository' }
	return { target: target.replace(/\/$/, '') }
}

export function findBrokenLinks(source, content, paths) {
	const errors = []
	for (const link of extractLinks(content)) {
		const resolved = resolveLocalLink(source, link)
		if (!resolved) continue
		if (resolved.error || !paths.has(resolved.target)) {
			errors.push({ source, link, target: resolved.target ?? null, reason: resolved.error ?? 'Target does not exist (paths are case-sensitive)' })
		}
	}
	return errors
}
