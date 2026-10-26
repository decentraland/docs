import MarkdownIt from 'markdown-it'
import { parseFragment } from 'parse5'
import { posix } from 'node:path'

const markdown = new MarkdownIt({ html: true })

export function extractLinks(content) {
	// YAML may contain prose and example URLs, not rendered Markdown links.
	const body = content.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, '')
	const links = []
	function htmlLinks(html) {
		function visit(node) {
			for (const attr of node.attrs ?? []) {
				if (['href', 'src', 'poster'].includes(attr.name)) links.push(attr.value)
			}
			for (const child of node.childNodes ?? []) visit(child)
			if (node.content) visit(node.content)
		}
		visit(parseFragment(html))
	}
	function visit(tokens) {
		for (const token of tokens) {
			if (token.type === 'link_open') links.push(token.attrGet('href'))
			if (token.type === 'image') links.push(token.attrGet('src'))
			if (token.type === 'html_inline' || token.type === 'html_block') htmlLinks(token.content)
			if (token.type === 'text') {
				for (const tag of token.content.matchAll(/\{%\s*(?:file|embed|image)\b([\s\S]*?)%\}/g)) {
					for (const attr of tag[1].matchAll(/\b(?:src|url)\s*=\s*(["'])(.*?)\1/g)) links.push(attr[2])
				}
			}
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

export function compareBaseline(errors, baseline) {
	const key = (source, link) => JSON.stringify([source, link])
	const known = new Set(Object.entries(baseline).flatMap(([source, links]) => links.map(link => key(source, link))))
	const actual = new Set(errors.map(error => key(error.source, error.link)))
	return {
		newErrors: errors.filter(error => !known.has(key(error.source, error.link))),
		stale: [...known].filter(entry => !actual.has(entry)).map(entry => { const [source, link] = JSON.parse(entry); return { source, link } }),
		existing: errors.filter(error => known.has(key(error.source, error.link))).length,
	}
}
