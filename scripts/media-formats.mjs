import { extname } from 'node:path'

const allowed = new Map([
	['.svg', new Set(['image/svg+xml'])],
	['.webp', new Set(['image/webp'])],
	['.webm', new Set(['video/webm', 'audio/webm'])],
])
const mediaExtensions = new Set([
	...allowed.keys(),
	'.png', '.apng', '.jpg', '.jpeg', '.jpe', '.jfif', '.gif', '.avif', '.heic', '.heif',
	'.bmp', '.dib', '.tif', '.tiff', '.ico', '.icns', '.jxl', '.jp2', '.j2k', '.jpf',
	'.psd', '.xcf', '.tga', '.dds', '.exr', '.hdr', '.pbm', '.pgm', '.ppm', '.pnm',
	'.mp4', '.m4v', '.mov', '.qt', '.avi', '.mkv', '.mpeg', '.mpg', '.mpe',
	'.mpv', '.m2v', '.mts', '.m2ts', '.vob', '.flv', '.wmv', '.asf', '.ogv', '.3gp', '.3g2',
])

export function mediaFormatIssue(path, mime) {
	const extension = extname(path).toLowerCase()
	if (!mediaExtensions.has(extension) && !/^(image|video)\//.test(mime)) return null
	const types = allowed.get(extension)
	if (!types) return 'Use SVG or WebP for images, or WebM for video.'
	if (!types.has(mime)) return `The ${extension} extension does not match detected content (${mime}). Convert the asset; do not just rename it.`
	return null
}

export function evaluateMedia(files, exceptions) {
	const failures = []
	const stale = new Set(Object.keys(exceptions))
	let grandfathered = 0
	for (const file of files) {
		const issue = mediaFormatIssue(file.path, file.mime)
		if (!issue) continue
		const exception = exceptions[file.path]
		if (exception && /^[a-f0-9]{64}$/.test(exception.sha256) && exception.sha256 === file.sha256) {
			grandfathered++
			stale.delete(file.path)
		} else {
			failures.push({ path: file.path, reason: issue })
		}
	}
	return { failures, stale: [...stale], grandfathered }
}
