import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const scriptDirectory = dirname(fileURLToPath(import.meta.url))
const repositoryDirectory = join(scriptDirectory, '..', '..', '..')
const examplesDirectory = scriptDirectory
const overviewPath = join(examplesDirectory, 'README.md')
const catalogPath = join(examplesDirectory, 'catalog.json')
const summaryPath = join(repositoryDirectory, 'creator', 'SUMMARY.md')

const ignoredMarkdownFiles = new Set([
	'AGENTS.md',
	'README.md',
])

const categories = [
	{
		id: 'getting-started',
		name: 'Start here',
	},
	{
		id: 'gameplay-interaction',
		name: 'Gameplay and interaction',
	},
	{
		id: 'ui-camera-player',
		name: 'UI, camera, and player experience',
	},
	{
		id: 'multiplayer-data-services',
		name: 'Multiplayer, data, and services',
	},
	{
		id: 'audio-video-environment',
		name: 'Audio, video, and environment',
	},
	{
		id: 'performance-scene-systems',
		name: 'Performance and scene systems',
	},
]


// MARK: parseExample
function parseExample(
	fileName,
	content,
) {
	const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/)

	if (!match) {
		throw new Error(`${fileName} must begin with YAML front matter.`)
	}

	const fields = Object.fromEntries(match[1]
		.split(/\r?\n/)
		.filter(Boolean)
		.map(line => {
			const separator = line.indexOf(':')

			if (separator === -1) {
				throw new Error(`${fileName} has an invalid front matter line: ${line}`)
			}

			const key = line.slice(0, separator).trim()
			const value = line.slice(separator + 1).trim()

			return [key, value]
		}))

	const requiredFields = ['id', 'name', 'description', 'category', 'tags', 'source']

	for (const field of requiredFields) {
		if (!fields[field]) {
			throw new Error(`${fileName} is missing required field: ${field}`)
		}
	}

	if (!/^\[[^\]]*\]$/.test(fields.tags)) {
		throw new Error(`${fileName} tags must use an inline YAML list.`)
	}

	return {
		id:          fields.id,
		name:        fields.name,
		description: fields.description,
		category:    fields.category,
		tags:        fields.tags.slice(1, -1).split(',').map(tag => tag.trim()).filter(Boolean),
		source:      fields.source,
		page:        `./${fileName}`,
		fileName,
	}
}


// MARK: renderCatalogTables
function renderCatalogTables(examples) {
	const sections = categories.map(category => {
		const categoryExamples = examples.filter(example => example.category === category.id)

		if (categoryExamples.length === 0) {
			return ''
		}

		const rows = categoryExamples.map(example => [
			`| [${example.name}](${example.page})`,
			example.description,
			example.tags.map(tag => `\`${tag}\``).join(', '),
			`[Open ${example.source.includes('/tree/') ? 'scene' : 'repository'}](${example.source}) |`,
		].join(' | '))

		return [
			`## ${category.name}`,
			'',
			'| Example | What it demonstrates | Tags | Source |',
			'| --- | --- | --- | --- |',
			...rows,
		].join('\n')
	}).filter(Boolean)

	return sections.join('\n\n')
}


// MARK: renderSummaryEntries
function renderSummaryEntries(examples) {
	return examples
		.map(example => `  * [${example.name}](tutorials/examples/${example.fileName})`)
		.join('\n')
}


// MARK: generateCatalog
async function generateCatalog() {
	const fileNames = (await readdir(examplesDirectory))
		.filter(fileName => fileName.endsWith('.md') && !ignoredMarkdownFiles.has(fileName))
		.sort()

	const examples = await Promise.all(fileNames.map(async fileName => {
		const content = await readFile(join(examplesDirectory, fileName), 'utf8')

		return parseExample(fileName, content)
	}))

	const ids = new Set()

	for (const example of examples) {
		if (ids.has(example.id)) {
			throw new Error(`Duplicate example id: ${example.id}`)
		}

		if (!categories.some(category => category.id === example.category)) {
			throw new Error(`${example.id} has an unknown category: ${example.category}`)
		}

		ids.add(example.id)
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
		throw new Error('Could not find the example-scenes-catalog markers in creator/tutorials/examples/README.md.')
	}

	const generatedOverview = overview.replace(
		overviewMarkers,
		[
			'<!-- example-scenes-catalog:start -->',
			renderCatalogTables(examples),
			'<!-- example-scenes-catalog:end -->',
		].join('\n'),
	)

	await writeFile(overviewPath, generatedOverview)

	const summary = await readFile(summaryPath, 'utf8')
	const summaryMarkers = /<!-- example-scenes-catalog:start -->[\s\S]*?<!-- example-scenes-catalog:end -->/

	if (!summaryMarkers.test(summary)) {
		throw new Error('Could not find the example-scenes-catalog markers in creator/SUMMARY.md.')
	}

	const generatedSummary = summary.replace(
		summaryMarkers,
		[
			'<!-- example-scenes-catalog:start -->',
			renderSummaryEntries(examples),
			'<!-- example-scenes-catalog:end -->',
		].join('\n'),
	)

	await writeFile(summaryPath, generatedSummary)

	console.log(`Generated ${examples.length} examples in ${catalogPath} and ${overviewPath}.`)
}

await generateCatalog()
