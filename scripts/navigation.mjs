import MarkdownIt from 'markdown-it'
import { posix } from 'node:path'
import { parse } from 'yaml'
import { resolveLocalLink, splitFrontMatter } from './markdown-links.mjs'

const markdown = new MarkdownIt()
const maintenanceFiles = new Set(['AGENTS.md', 'CLAUDE.md'])

export function navigationEntries(content) {
	const { body } = splitFrontMatter(content)
	const offset = content.slice(0, content.length - body.length).split('\n').length - 1
	const entries = []
	let listDepth = 0
	let translation = false
	for (const token of markdown.parse(body, {})) {
		if (token.type === 'list_item_open') listDepth++
		if (token.type === 'list_item_close') listDepth--
		if (!listDepth) continue
		if (token.type === 'fence' && token.info.trim() === 'yaml') {
			try {
				const block = parse(token.content)
				const ref = block?.dependencies?.translation?.ref
				if (block?.type === 'builtin:translation' && ref?.kind === 'translation' && typeof ref.translation === 'string' && ref.translation.trim()) translation = true
			} catch { /* Invalid declarations do not substitute for navigation entries. */ }
		}
		if (token.type !== 'inline') continue
		for (const child of token.children ?? []) {
			if (child.type === 'link_open') entries.push({ link: child.attrGet('href'), line: (token.map?.[0] ?? 0) + offset + 1 })
		}
	}
	return { entries, translation }
}

export function auditNavigation(pages, directories, exceptions = {}) {
	const spaces = [...directories].sort((a, b) => b.length - a.length)
	const spaceFor = path => spaces.find(space => space === '.' || path === space || path.startsWith(`${space}/`))
	const errors = [], warnings = [], translations = [], listed = new Set(), candidates = new Set()
	let entryCount = 0
	if (!spaces.length) errors.push({ source: 'gitbook-docs.yaml', reason: 'No GitBook spaces configured.' })
	for (const path of pages.keys()) {
		if (spaceFor(path) && !['SUMMARY.md', ...maintenanceFiles].includes(posix.basename(path))) candidates.add(path)
	}
	for (const space of spaces) {
		const source = posix.join(space, 'SUMMARY.md')
		if (!pages.has(source)) { errors.push({ source, reason: 'Missing navigation manifest.' }); continue }
		const { entries, translation } = navigationEntries(pages.get(source))
		if (translation) translations.push(space)
		if (!entries.length && !translation) errors.push({ source, reason: 'Navigation has no page entries or supported translation declaration.' })
		const seen = new Set()
		for (const { link, line } of entries) {
			entryCount++
			const issue = reason => errors.push({ source, line, link, reason })
			const resolved = resolveLocalLink(source, link)
			if (!resolved) {
				if (link.startsWith('#') || !link) issue('Navigation must target a page, not the summary itself.')
				continue // External links are permitted, but not fetched by this check.
			}
			if (resolved.error) { issue(resolved.error); continue }
			if (decodeURIComponent(link.split(/[?#]/, 1)[0]).startsWith('/')) { issue('Use a relative navigation path inside this GitBook space.'); continue }
			let target = resolved.target
			if (!/\.md$/i.test(target)) target = posix.join(target, 'README.md')
			if (spaceFor(target) !== space) { issue('Navigation target is outside this GitBook space.'); continue }
			if (!pages.has(target)) { issue(`Markdown page does not exist (case-sensitive): ${target}`); continue }
			if (posix.basename(target) === 'SUMMARY.md') { issue('Navigation cannot target a SUMMARY.md manifest.'); continue }
			listed.add(target)
			if (seen.has(target)) warnings.push({ source, line, link, reason: `Duplicate navigation entry: ${target}` })
			seen.add(target)
		}
	}
	const excluded = new Set()
	if (!exceptions || typeof exceptions !== 'object' || Array.isArray(exceptions)) {
		errors.push({ source: 'scripts/navigation-exceptions.json', reason: 'Exceptions must be an object keyed by repository page path.' })
	} else for (const [path, value] of Object.entries(exceptions)) {
		if (typeof value?.reason !== 'string' || !value.reason.trim()) {
			errors.push({ source: path, reason: 'Navigation exception requires a nonempty reason.' })
		} else if (!candidates.has(path) || listed.has(path)) {
			errors.push({ source: path, reason: 'Stale navigation exception: page is missing, out of scope, or already listed.' })
		} else excluded.add(path)
	}
	for (const path of [...candidates].sort()) {
		if (!listed.has(path) && !excluded.has(path)) warnings.push({ source: path, reason: 'Page is not listed in its GitBook space SUMMARY.md.' })
	}
	return { spaces: spaces.length, entries: entryCount, listedPages: listed.size, excludedPages: excluded.size, translations, errors, warnings }
}
