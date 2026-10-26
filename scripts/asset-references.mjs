import { posix } from 'node:path'
import { parse } from 'yaml'
import { extractLinks, resolveLocalLink } from './markdown-links.mjs'

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
	const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/)
	if (match) {
		const seen = new Set()
		function visit(value) {
			if (typeof value === 'string') links.push(value)
			else if (value && typeof value === 'object' && !seen.has(value)) {
				seen.add(value)
				for (const child of Object.values(value)) visit(child)
			}
		}
		visit(parse(match[1], { maxAliasCount: 100 }))
	}
	return links
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

export function findUnreferencedAssets(paths, pages) {
	const assets = new Set(paths.filter(isAsset))
	for (const page of pages) {
		let links
		try { links = assetLinks(page.content) } catch (error) {
			throw new Error(`${page.path}: unable to read asset references from front matter.`, { cause: error })
		}
		for (const link of links) assets.delete(referencedAsset(page.path, link))
	}
	return [...assets].sort()
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
