import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseCategory, parseExample } from './frontmatter.mjs'

const scriptDirectory = dirname(fileURLToPath(import.meta.url))
const repositoryRoot = join(scriptDirectory, '..', '..')
const examplesDirectory = join(repositoryRoot, 'creator', 'tutorials', 'examples')
const overviewPath = join(dirname(examplesDirectory), 'examples.md')
const catalogPath = join(examplesDirectory, 'catalog.json')
const summaryPath = join(repositoryRoot, 'creator', 'SUMMARY.md')

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


// MARK: renderMaintenance
function renderMaintenance(example) {
	return example.maintenance === 'community'
		? `Community · ${example.maintainer}`
		: 'Decentraland'
}


function renderCommunityWarning(collection = false) {
	return [
		'{% hint style="warning" %}',
		'**Community-maintained code — review before use**',
		'',
		collection
			? 'Community projects listed here are maintained outside the Decentraland GitHub organization. Their source code and live deployments may change independently.'
			: 'This community project is maintained outside the Decentraland GitHub organization. Its source code and live deployment may change independently.',
		'',
		'Inclusion in this catalog does not imply a security audit or guarantee of safety. Review code, dependencies, and installation scripts before running or reusing it.',
		'',
		"[Report a catalog concern](https://github.com/decentraland/docs/issues/new). For suspected vulnerabilities, follow the upstream project's security policy. Do not include exploit details or credentials in public issues.",
		'{% endhint %}',
	].join('\n')
}


// MARK: updateExampleContext
async function updateExampleContext(example) {
	const pagePath = join(examplesDirectory, example.fileName)
	const content = await readFile(pagePath, 'utf8')
	const markers = /<!-- example-context:start -->[\s\S]*?<!-- example-context:end -->/
	const context = [
		'<!-- example-context:start -->',
		'## Project information',
		'',
		`**Maintained by:** ${renderMaintenance(example)}`,
		'',
		`[${example.maintenance === 'community' ? 'View upstream source' : 'View source'}](${example.source})`,
		'',
		example.license.status === 'identified'
			? `**License:** [${example.license.name}](${example.license.url}). Check upstream terms before reuse; code and assets may have different terms.`
			: '**License:** Not identified in this catalog. Consult the upstream repository and maintainer for applicable terms before reuse.',
		...(example.maintenance === 'community' ? ['', renderCommunityWarning()] : []),
		'<!-- example-context:end -->',
	].join('\n')

	if (!markers.test(content) && !/^# .+$/m.test(content)) {
		throw new Error(`${example.fileName} must have a page heading for its generated context.`)
	}

	let updated = markers.test(content)
		? content.replace(markers, () => context)
		: content.replace(/^(# .+)$/m, heading => `${heading}\n\n${context}`)

	const highlightMarkers = /<!-- example-highlights:start -->[\s\S]*?<!-- example-highlights:end -->/
	const highlights = [
		'<!-- example-highlights:start -->',
		...(example.highlights.length ? [
			'## Explore the code', '',
			'These links point to a specific source snapshot so the explanations remain useful as upstream development continues. They are learning references, not a security assessment.', '',
			...example.highlights.flatMap(highlight => [
				`### ${highlight.title}`, '',
				highlight.description, '',
				`**Project context:** ${highlight.context}`, '',
				'**Source references:**', '',
				...highlight.references.map(reference => `- [${reference.label}](${reference.url})`), '',
			]),
		] : []),
		'<!-- example-highlights:end -->',
	].join('\n')
	if (highlightMarkers.test(updated)) updated = updated.replace(highlightMarkers, () => highlights)
	else if (example.highlights.length) updated = `${updated.trimEnd()}\n\n${highlights}\n`
	await writeFile(pagePath, updated)
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
			renderMaintenance(example),
			example.tags.map(tag => `\`${tag}\``).join(', '),
			`[Open ${example.source.includes('/tree/') ? 'scene' : 'repository'}](${example.source})`,
		].map(cell => cell.replace(/\r?\n/g, ' ').replace(/\|/g, '\\|')))

		const headings = category.id === 'published-games'
			? ['Game', 'What it demonstrates', 'Maintained by', 'Tags', 'Source']
			: ['Example', 'What it demonstrates', 'Maintained by', 'Tags', 'Source']

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
				renderCommunityWarning(true),
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

	for (const example of examples) {
		await updateExampleContext(example)
	}

	const catalog = {
		schemaVersion: 2,
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

	const summary = await readFile(summaryPath, 'utf8')

	const summaryMarkers = /<!-- example-navigation:start -->[\s\S]*?<!-- example-navigation:end -->\n?/
	const legacySection = /^\* \[Example Scenes\]\(tutorials\/examples\.md\)\r?\n(?:[\t ]+\* [^\r\n]*\r?\n)*/m
	const summarySection = summaryMarkers.test(summary) ? summaryMarkers : legacySection
	if (!summarySection.test(summary)) throw new Error('Could not find Example Scenes in creator/SUMMARY.md.')
	const summaryEntries = categories.flatMap(category => [
		`* [${category.name}](tutorials/examples/${category.id}/README.md)`,
		...examples.filter(example => example.category === category.id)
			.sort((first, second) => first.name.localeCompare(second.name))
			.map(example => `\t* [${example.name}](tutorials/examples/${example.fileName})`),
	])
	await writeFile(summaryPath, summary.replace(summarySection, () => [
		'<!-- example-navigation:start -->', '* [Example Scenes](tutorials/examples.md)',
		...summaryEntries, '<!-- example-navigation:end -->', '',
	].join('\n')))
	for (const category of categories) {
		const path = join(examplesDirectory, category.id, 'README.md')
		const content = await readFile(path, 'utf8')
		const markers = /<!-- example-category:start -->[\s\S]*?<!-- example-category:end -->/
		const section = [
			'<!-- example-category:start -->',
			renderCatalogTables(examples, [category])
				.replace(/^## /, '# ')
				.replaceAll(`](./examples/${category.id}/`, '](./'),
			'', '[Browse all example scenes](../../examples.md)',
			'<!-- example-category:end -->',
		].join('\n')
		await writeFile(path, markers.test(content) ? content.replace(markers, () => section) : `${content.trimEnd()}\n\n${section}\n`)
	}

	console.log(`Generated ${examples.length} examples in ${catalogPath} and ${overviewPath}.`)
}

await generateCatalog()
