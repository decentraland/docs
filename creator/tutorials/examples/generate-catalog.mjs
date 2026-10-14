import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const scriptDirectory = dirname(fileURLToPath(import.meta.url))
const examplesDirectory = scriptDirectory
const overviewPath = join(dirname(examplesDirectory), 'examples.md')
const catalogPath = join(examplesDirectory, 'catalog.json')

const ignoredMarkdownFiles = new Set([
	'AGENTS.md',
	'README.md',
])

// MARK: getRepositoryAuthor
function getRepositoryAuthor(source) {
	const sourceUrl = new URL(source)
	const [author = ''] = sourceUrl.pathname.split('/').filter(Boolean)

	return author.toLocaleLowerCase()
}


// MARK: getCanonicalSource
function getCanonicalSource(source) {
	const sourceUrl = new URL(source)

	sourceUrl.hostname = sourceUrl.hostname.replace(/^www\./i, '')
	sourceUrl.pathname = sourceUrl.pathname.replace(/\/$/, '')

	return sourceUrl.toString()
}


// MARK: parseExample
function parseExample(
	fileName,
	category,
	content,
) {
	const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/)

	if (!match) {
		throw new Error(`${fileName} must begin with YAML front matter.`)
	}

	const fields = {}
	let listKey = null

	for (const line of match[1].split(/\r?\n/).filter(Boolean)) {
		const listItemMatch = line.match(/^\s*-\s*(.+)$/)

		if (listItemMatch) {
			if (!listKey || !Array.isArray(fields[listKey])) {
				throw new Error(`${fileName} has an invalid front matter line: ${line}`)
			}

			fields[listKey].push(listItemMatch[1].trim())

			continue
		}

		const separator = line.indexOf(':')

		if (separator === -1) {
			throw new Error(`${fileName} has an invalid front matter line: ${line}`)
		}

		const key = line.slice(0, separator).trim()
		const value = line.slice(separator + 1).trim()

		fields[key] = value || []
		listKey = Array.isArray(fields[key]) ? key : null
	}

	const requiredFields = ['id', 'name', 'description', 'tags', 'source', 'license']

	for (const field of requiredFields) {
		if (!fields[field]) {
			throw new Error(`${fileName} is missing required field: ${field}`)
		}
	}

	const tags = Array.isArray(fields.tags)
		? fields.tags
		: /^\[[^\]]*\]$/.test(fields.tags)
			? fields.tags.slice(1, -1).split(',').map(tag => tag.trim()).filter(Boolean)
			: null

	if (!tags) {
		throw new Error(`${fileName} tags must use an inline or block YAML list.`)
	}

	if (category === 'published-games' && !fields.developer) {
		throw new Error(`${fileName} must define a developer for Published Games.`)
	}

	return {
		id:          fields.id,
		name:        fields.name,
		description: fields.description,
		category,
		tags,
		developer:   fields.developer,
		source:      fields.source,
		license:     fields.license,
		page:        `./${fileName}`,
		fileName,
	}
}


// MARK: parseCategory
function parseCategory(
	categoryId,
	content,
) {
	const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/)

	if (!match) {
		throw new Error(`${categoryId}/README.md must begin with YAML front matter.`)
	}

	const fields = Object.fromEntries(match[1]
		.split(/\r?\n/)
		.filter(Boolean)
		.map(line => {
			const separator = line.indexOf(':')

			if (separator === -1) {
				throw new Error(`${categoryId}/README.md has an invalid front matter line: ${line}`)
			}

			const key = line.slice(0, separator).trim()
			const value = line.slice(separator + 1).trim()

			return [key, value]
		}))

	const order = Number(fields.order)

	if (!fields.title || !fields.description || !Number.isInteger(order)) {
		throw new Error(`${categoryId}/README.md requires title, description, and integer order fields.`)
	}

	return {
		id:          categoryId,
		name:        fields.title,
		description: fields.description,
		order,
	}
}


// MARK: renderCatalogTables
function renderCatalogTables(
	examples,
	categories,
) {
	const sections = categories.map(category => {
		const categoryExamples = examples
			.filter(example => example.category === category.id)
			.sort((firstExample, secondExample) => firstExample.name.localeCompare(secondExample.name))

		if (categoryExamples.length === 0) {
			return ''
		}

		const rows = categoryExamples.map(example => [
			`[${example.name}](./examples/${example.fileName})`,
			example.description,
			...(category.id === 'published-games' ? [example.developer] : []),
			example.tags.map(tag => `\`${tag}\``).join(', '),
			`[Open ${example.source.includes('/tree/') ? 'scene' : 'repository'}](${example.source})`,
		])

		const headings = category.id === 'published-games'
			? ['Game', 'What it demonstrates', 'Developer', 'Tags', 'Source']
			: ['Example', 'What it demonstrates', 'Tags', 'Source']

		if (category.id === 'published-games') {
			const widths = headings.map((heading, index) => Math.max(
				heading.length,
				...rows.map(row => row[index].length),
			))

			const renderRow = row => `| ${row.map((cell, index) => cell.padEnd(widths[index])).join(' | ')} |`

			return [
				`## ${category.name}`,
				'',
				category.description,
				'',
				renderRow(headings),
				renderRow(widths.map(width => '-'.repeat(width))),
				...rows.map(renderRow),
			].join('\n')
		}

		return [
			`## ${category.name}`,
			'',
			category.description,
			'',
			`| ${headings.join(' | ')} |`,
			`| ${headings.map(() => '---').join(' | ')} |`,
			...rows.map(row => `| ${row.join(' | ')} |`),
		].join('\n')
	}).filter(Boolean)

	return sections.join('\n\n')
}


// MARK: generateCatalog
async function generateCatalog() {
	const categoryIds = (await readdir(examplesDirectory, { withFileTypes: true }))
		.filter(entry => entry.isDirectory())
		.map(entry => entry.name)

	const categories = (await Promise.all(categoryIds.map(async categoryId => {
		const categoryPath = join(examplesDirectory, categoryId, 'README.md')
		const content = await readFile(categoryPath, 'utf8')

		return parseCategory(categoryId, content)
	})))
		.sort((firstCategory, secondCategory) => firstCategory.order - secondCategory.order || firstCategory.name.localeCompare(secondCategory.name))

	const examples = (await Promise.all(categories.map(async category => {
		const categoryDirectory = join(examplesDirectory, category.id)
		const fileNames = (await readdir(categoryDirectory))
			.filter(fileName => fileName.endsWith('.md') && !ignoredMarkdownFiles.has(fileName))
			.sort()

		return Promise.all(fileNames.map(async fileName => {
			const content = await readFile(join(categoryDirectory, fileName), 'utf8')
			const examplePath = `${category.id}/${fileName}`

			return parseExample(examplePath, category.id, content)
		}))
	}))).flat()
		.sort((firstExample, secondExample) => {
			const authorComparison = getRepositoryAuthor(firstExample.source)
				.localeCompare(getRepositoryAuthor(secondExample.source))

			return authorComparison || firstExample.name.localeCompare(secondExample.name)
		})

	const ids = new Set()
	const sources = new Set()

	for (const example of examples) {
		if (ids.has(example.id)) {
			throw new Error(`Duplicate example id: ${example.id}`)
		}

		if (!categories.some(category => category.id === example.category)) {
			throw new Error(`${example.id} has an unknown category: ${example.category}`)
		}

		ids.add(example.id)

		const source = getCanonicalSource(example.source)

		if (sources.has(source)) {
			throw new Error(`Duplicate example source: ${example.source}`)
		}

		sources.add(source)
	}

	const catalog = {
		schemaVersion: 1,
		categories,
		examples,
	}

	await mkdir(examplesDirectory, { recursive: true })
	await writeFile(catalogPath, `${JSON.stringify(catalog, null, '\t')}\n`)

	const overview = await readFile(overviewPath, 'utf8')
	const overviewMarkers = /<!-- example-scenes-catalog:start -->[\s\S]*?<!-- example-scenes-catalog:end -->/

	if (!overviewMarkers.test(overview)) {
		throw new Error('Could not find the example-scenes-catalog markers in creator/tutorials/examples.md.')
	}

	const generatedOverview = overview.replace(
		overviewMarkers,
		[
			'<!-- example-scenes-catalog:start -->',
			renderCatalogTables(examples, categories),
			'<!-- example-scenes-catalog:end -->',
		].join('\n'),
	)

	await writeFile(overviewPath, generatedOverview)

	console.log(`Generated ${examples.length} examples in ${catalogPath} and ${overviewPath}.`)
}

await generateCatalog()
