import { extname } from 'node:path'
import { SaxesParser } from 'saxes'

const allowed = new Map([
	['.svg', new Set(['image/svg+xml'])],
	['.webp', new Set(['image/webp'])],
	['.webm', new Set(['video/webm', 'audio/webm'])],
])
const mediaExtensions = new Set([
	...allowed.keys(),
	'.svgz', '.png', '.apng', '.jpg', '.jpeg', '.jpe', '.jfif', '.gif', '.avif', '.heic', '.heif',
	'.bmp', '.dib', '.tif', '.tiff', '.ico', '.icns', '.jxl', '.jp2', '.j2k', '.jpf',
	'.psd', '.xcf', '.tga', '.dds', '.exr', '.hdr', '.pbm', '.pgm', '.ppm', '.pnm',
	'.mp4', '.m4v', '.mov', '.qt', '.avi', '.mkv', '.mpeg', '.mpg', '.mpe',
	'.mpv', '.m2v', '.mts', '.m2ts', '.vob', '.flv', '.wmv', '.asf', '.ogv', '.3gp', '.3g2',
])

const svgXmlIssue = 'The .svg file must contain well-formed XML with an SVG root element.'
const svgEntityIssue = 'The SVG uses unsupported entity declarations or exceeds entity expansion limits. Export a self-contained SVG with literal attribute and text values.'

function svgContentIssue(content) {
	let text
	try {
		// XML SVGs may use a UTF-8 or UTF-16 byte-order mark.
		const encoding = content[0] === 0xff && content[1] === 0xfe ? 'utf-16le'
			: content[0] === 0xfe && content[1] === 0xff ? 'utf-16be' : 'utf-8'
		text = new TextDecoder(encoding, { fatal: true }).decode(content)
	} catch { return svgXmlIssue }
	let valid = true
	let root
	let entityIssue = false
	let expandedBytes = 0
	const parser = new SaxesParser({ xmlns: true })
	parser.on('error', error => {
		valid = false
		if (error.message.includes('undefined entity')) entityIssue = true
	})
	parser.on('opentag', node => { root ??= node })
	parser.on('doctype', declaration => {
		// Adobe-style SVGs use short, literal namespace entities. Resolve only
		// that bounded subset: no external, parameter, markup, or nested entities.
		const dtd = declaration.replace(/<!--[^]*?-->/g, '')
		const declarations = [...dtd.matchAll(/<!ENTITY\b/g)]
		if (declarations.length > 64 || /%[A-Za-z_:][\w.:-]*;/.test(dtd)) {
			entityIssue = true
			return
		}
		let declaredBytes = 0
		for (const declaration of declarations) {
			const match = dtd.slice(declaration.index).match(/^<!ENTITY\s+([A-Za-z_:][\w.:-]*)\s+(["'])([^]*?)\2\s*>/)
			if (!match) { entityIssue = true; continue }
			const [, name, , value] = match
			const bytes = Buffer.byteLength(value)
			declaredBytes += bytes
			if (/[&<]/.test(value) || name in parser.ENTITIES || bytes > 4096 || declaredBytes > 65536) {
				entityIssue = true
				continue
			}
			Object.defineProperty(parser.ENTITIES, name, { get() {
				expandedBytes += bytes
				if (expandedBytes > 1048576) {
					entityIssue = true
					throw new Error('SVG entity expansion limit exceeded.')
				}
				return value
			} })
		}
	})
	// SAX parsing never fetches a DTD or resolves external entities.
	try { parser.write(text).close() } catch { valid = false }
	if (entityIssue) return svgEntityIssue
	return valid && root?.local === 'svg' && ['', 'http://www.w3.org/2000/svg'].includes(root.uri) ? null : svgXmlIssue
}

export function isSvgContent(content) {
	return svgContentIssue(content) === null
}

export function mediaFormatIssue(path, mime, content) {
	const extension = extname(path).toLowerCase()
	// Inline SVG is valid page content; binary images disguised as Markdown still fail.
	if (['.md', '.mdx', '.html', '.htm'].includes(extension) && mime === 'image/svg+xml') return null
	if (['.js', '.mjs', '.cjs', '.ts', '.tsx', '.jsx'].includes(extension) && mime === 'image/svg+xml'
		&& content !== undefined && !isSvgContent(content)) return null
	if (extension === '.svg' && content !== undefined) {
		return svgContentIssue(content)
	}
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
		const issue = mediaFormatIssue(file.path, file.mime, file.content)
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
