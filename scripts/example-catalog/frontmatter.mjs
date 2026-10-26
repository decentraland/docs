import { parseDocument } from 'yaml'

function parseFrontMatter(fileName, content) {
	const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/)
	if (!match) {
		throw new Error(`${fileName} must begin with YAML front matter.`)
	}

	const document = parseDocument(match[1], { uniqueKeys: true })
	if (document.errors.length > 0 || document.warnings.length > 0) {
		throw new Error(`${fileName} has invalid YAML: ${[...document.errors, ...document.warnings].map(error => error.message).join('; ')}`)
	}
	const fields = document.toJS({ maxAliasCount: 100 })
	if (!fields || typeof fields !== 'object' || Array.isArray(fields)) {
		throw new Error(`${fileName} front matter must be a mapping.`)
	}
	return fields
}

function requireString(fields, field, fileName) {
	if (typeof fields[field] !== 'string' || fields[field].trim().length === 0) {
		throw new Error(`${fileName} ${field} must be a non-empty string.`)
	}
	return fields[field].trim()
}

function parseLicense(value, fileName) {
	if (!value || !['unknown', 'identified'].includes(value.status)) throw new Error(`${fileName} license must have status unknown or identified.`)
	if (value.status === 'unknown') {
		if (value.name !== undefined || value.url !== undefined) throw new Error(`${fileName} unknown license cannot have a name or URL.`)
		return { status: 'unknown' }
	}
	const name = requireString(value, 'name', fileName)
	const url = requireString(value, 'url', fileName)
	requireHttps(url, `${fileName} license`)
	return { status: 'identified', name, url }
}

function requireHttps(value, context) {
	let url
	try { url = new URL(value) } catch { throw new Error(`${context} requires an HTTPS URL.`) }
	if (url.protocol !== 'https:' || url.username || url.password) throw new Error(`${context} requires an HTTPS URL.`)
	return url
}

function parseHighlights(value, fileName) {
	if (value === undefined) return []
	if (!Array.isArray(value) || value.length === 0) throw new Error(`${fileName} highlights must be a non-empty list.`)
	return value.map((highlight, index) => {
		const context = `${fileName} highlight ${index + 1}`
		if (!highlight || typeof highlight !== 'object') throw new Error(`${context} must be a mapping.`)
		const title = requireString(highlight, 'title', context)
		const description = requireString(highlight, 'description', context)
		const detail = requireString(highlight, 'context', context)
		if (!Array.isArray(highlight.tags) || !highlight.tags.length || highlight.tags.some(tag => typeof tag !== 'string' || !tag.trim())) throw new Error(`${context} tags must be a non-empty list of strings.`)
		if (!Array.isArray(highlight.references) || !highlight.references.length) throw new Error(`${context} references must be a non-empty list.`)
		const references = highlight.references.map(reference => {
			if (!reference || typeof reference !== 'object') throw new Error(`${context} reference must be a mapping.`)
			const label = requireString(reference, 'label', context)
			const url = requireString(reference, 'url', context)
			const parsed = requireHttps(url, context)
			if (parsed.hostname !== 'github.com' || !/^\/[^/]+\/[^/]+\/blob\/[a-f0-9]{40}\/.+/.test(parsed.pathname)) throw new Error(`${context} reference must point to a GitHub file at a full commit SHA.`)
			return { label, url }
		})
		return { title, description, context: detail, tags: highlight.tags.map(tag => tag.trim()), references }
	})
}

export function parseExample(fileName, category, content) {
	const fields = parseFrontMatter(fileName, content)
	for (const field of ['id', 'name', 'description', 'source']) {
		fields[field] = requireString(fields, field, fileName)
	}
	for (const field of ['developer', 'realm', 'position']) {
		if (fields[field] !== undefined || (field === 'developer' && category === 'published-games')) {
			fields[field] = requireString(fields, field, fileName)
		}
	}
	if (!Array.isArray(fields.tags) || fields.tags.length === 0 || fields.tags.some(tag => typeof tag !== 'string' || tag.trim().length === 0)) {
		throw new Error(`${fileName} tags must be a non-empty YAML list of non-empty strings.`)
	}

	let sourceUrl
	try {
		sourceUrl = new URL(fields.source)
	} catch {
		throw new Error(`${fileName} source must be an HTTPS GitHub repository URL.`)
	}
	const [maintainer, repository] = sourceUrl.pathname.split('/').filter(Boolean)
	if (sourceUrl.protocol !== 'https:' || sourceUrl.hostname !== 'github.com' || !maintainer || !repository || sourceUrl.username || sourceUrl.password) {
		throw new Error(`${fileName} source must be an HTTPS GitHub repository URL.`)
	}

	return {
		id: fields.id,
		name: fields.name,
		description: fields.description,
		category,
		tags: fields.tags.map(tag => tag.trim()),
		developer: fields.developer,
		maintainer,
		maintenance: maintainer.toLowerCase() === 'decentraland' ? 'decentraland' : 'community',
		source: fields.source,
		realm: fields.realm,
		position: fields.position,
		license: parseLicense(fields.license, fileName),
		highlights: parseHighlights(fields.highlights, fileName),
		page: `./${fileName}`,
		fileName,
	}
}

export function parseCategory(categoryId, content) {
	const fileName = `${categoryId}/README.md`
	const fields = parseFrontMatter(fileName, content)
	const name = requireString(fields, 'title', fileName)
	const description = requireString(fields, 'description', fileName)
	if (!Number.isInteger(fields.order)) {
		throw new Error(`${fileName} order must be an integer.`)
	}
	return { id: categoryId, name, description, order: fields.order }
}
