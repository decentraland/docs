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

export function parseExample(fileName, category, content) {
	const fields = parseFrontMatter(fileName, content)
	for (const field of ['id', 'name', 'description', 'source', 'license']) {
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
		license: fields.license,
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
