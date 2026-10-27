import { posix } from 'node:path'
import { parse } from 'yaml'
import { extractLinks, resolveLocalLink, splitFrontMatter } from './markdown-links.mjs'

const assetExtensions = new Set([
	'.svg', '.svgz', '.webp', '.webm', '.png', '.apng', '.jpg', '.jpeg', '.gif', '.ico', '.icns',
	'.avif', '.heic', '.heif', '.bmp', '.tif', '.tiff', '.jxl', '.psd', '.xcf', '.tga', '.exr', '.hdr',
	'.mp4', '.m4v', '.mov', '.avi', '.mkv', '.mpeg', '.mpg', '.wmv', '.flv', '.ogv',
	'.mp3', '.wav', '.ogg', '.flac', '.m4a', '.aac', '.opus',
	'.glb', '.gltf', '.obj', '.fbx', '.blend', '.ma', '.pkr', '.usd', '.usdz',
	'.woff', '.woff2', '.ttf', '.otf', '.zip', '.gz', '.7z', '.rar', '.tar',
	'.pdf', '.csv', '.xlsx', '.docx', '.pptx',
])

export function isAsset(path) {
	const extension = posix.extname(path).toLowerCase()
	if (extension === '.md') return false
	return assetExtensions.has(extension)
		|| /(?:^|\/)(?:assets|images)\//.test(path)
		|| (extension === '.json' && /^(?:creator|player|contributor|apis)(?:[-/])/.test(path))
}

export function assetLinks(content) {
	const links = extractLinks(content)
	const { frontMatter } = splitFrontMatter(content)
	if (frontMatter !== undefined) {
		const data = parse(frontMatter, { maxAliasCount: 100 })
		// GitBook's cover field references an image. Descriptions, examples,
		// aliases, and arbitrary metadata are not evidence that an asset is used.
		if (typeof data?.cover === 'string') links.push(data.cover)
	}
	return [...new Set(links)]
}

export function gitbookSpaceDirectories(config) {
	const directories = new Set()
	function visit(items) {
		for (const item of items ?? []) {
			if (typeof item.content?.directory === 'string') {
				const directory = posix.normalize(item.content.directory).replace(/\/$/, '') || '.'
				if (posix.isAbsolute(directory) || directory === '..' || directory.startsWith('../')) {
					throw new Error(`GitBook space directory must stay inside the repository: ${item.content.directory}`)
				}
				directories.add(directory)
			}
			visit(item.children)
		}
	}
	visit(config?.site?.structure)
	// Nested spaces take precedence over their parent directory.
	return [...directories].sort((a, b) => b.length - a.length)
}

export function assetSpaceIssue(source, link, target, spaces) {
	if (/^(?:[a-z][a-z\d+.-]*:|\/\/|#)/i.test(link)) return null
	const pathname = decodeURIComponent(link.split(/[?#]/, 1)[0])
	if (pathname.startsWith('/')) return 'Use a relative path to an asset inside the consuming GitBook space; leading-slash asset paths do not resolve in GitBook.'
	const spaceFor = path => spaces.find(space => space === '.' || path === space || path.startsWith(`${space}/`))
	const sourceSpace = spaceFor(source)
	if (sourceSpace && sourceSpace !== spaceFor(target)) {
		return `Asset is outside the consuming GitBook space (${sourceSpace}); copy it into that space and use a relative path.`
	}
	return null
}

export function referencedAsset(source, link) {
	// Only current-main URLs in this repository count; another repository or
	// an older commit is not evidence that this checkout's asset is in use.
	const prefixes = [
		'https://raw.githubusercontent.com/decentraland/docs/main/',
		'https://raw.githubusercontent.com/decentraland/docs/refs/heads/main/',
		'https://github.com/decentraland/docs/blob/main/',
		'https://github.com/decentraland/docs/raw/main/',
		'https://github.com/decentraland/docs/raw/refs/heads/main/',
	]
	const prefix = prefixes.find(prefix => link.startsWith(prefix))
	return resolveLocalLink(source, prefix ? `/${link.slice(prefix.length)}` : link)?.target ?? null
}

export function auditAssetReferences(paths, pages, spaces = []) {
	const allPaths = new Set(paths)
	const assets = new Set(paths.filter(isAsset))
	const errors = []
	for (const page of pages) {
		let links
		try { links = assetLinks(page.content) } catch (error) {
			errors.push({ source: page.path, reason: `Invalid YAML front matter: ${error.message}` })
			// A metadata error must not hide the page's body references or stop
			// diagnostics from other pages.
			links = extractLinks(page.content)
		}
		for (const link of links) {
			const target = referencedAsset(page.path, link)
			if (!target || !isAsset(target)) continue
			const reason = assetSpaceIssue(page.path, link, target, spaces)
				?? (!allPaths.has(target) ? 'Referenced asset does not exist (paths are case-sensitive).' : null)
			if (reason) errors.push({ source: page.path, link, target, reason })
			else assets.delete(target)
		}
	}
	return { unused: [...assets].sort(), errors }
}

export function findUnreferencedAssets(paths, pages) {
	const { unused, errors } = auditAssetReferences(paths, pages)
	if (errors.some(error => error.reason.startsWith('Invalid YAML'))) {
		throw new AggregateError(errors.map(error => new Error(`${error.source}: ${error.reason}`)), 'Unable to read all asset references.')
	}
	return unused
}

export function compareAssetBaseline(unused, baseline) {
	const known = new Set(baseline)
	const current = new Set(unused)
	return {
		newUnused: unused.filter(path => !known.has(path)),
		stale: baseline.filter(path => !current.has(path)),
		existing: unused.filter(path => known.has(path)).length,
	}
}
