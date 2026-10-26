# Decentraland Documentation

This repository contains all documentation for the Decentraland ecosystem, organized as a GitBook-powered monorepo with multiple documentation spaces.

## 📚 Documentation Spaces

This repository hosts four separate GitBook spaces, each with its own purpose and audience:

### 🎮 [Player Documentation](player/)
Documentation for Decentraland users and players. Covers gameplay, avatars, marketplace, DAO participation, and in-world features.

- **Audience**: End users, players
- **Topics**: Getting started, blockchain integration, DAO, marketplace, in-world features
- **GitBook Space**: `player`

### 🎨 [Creator Documentation](creator/)
Complete guide for content creators building experiences in Decentraland. Includes Scene Editor, SDK7, wearables, emotes, and 3D modeling.

- **Audience**: Scene creators, wearable designers, game developers
- **Topics**: Scene Editor, SDK7, wearables, emotes, 3D modeling, publishing
- **GitBook Space**: `creator`

### 💻 [Contributor Documentation](contributor/)
Technical documentation for developers contributing to Decentraland's open-source codebase.

- **Audience**: Core developers, open-source contributors
- **Topics**: Architecture, authentication, content system, scene runtime, communications, testing standards
- **GitBook Space**: `contributor`

### 🔌 [API Reference](apis/)
Comprehensive API documentation for all Decentraland backend services.

- **Audience**: Developers integrating with Decentraland services
- **Topics**: RESTful APIs, authentication, service endpoints, data models
- **GitBook Space**: `apis`

## 🏗️ Repository Structure

```
docs/
├── README.md                    # This file
├── .gitbook.yaml               # GitBook configuration (root)
│
├── player/                      # Player documentation space
│   ├── README.md               # Player landing page
│   ├── SUMMARY.md              # Player navigation/sidebar
│   ├── images/                 # Player images
│   └── ...                     # Player content pages
│
├── creator/                     # Creator documentation space
│   ├── README.md               # Creator landing page
│   ├── SUMMARY.md              # Creator navigation/sidebar
│   ├── images/                 # Creator images
│   └── ...                     # Creator content pages
│
├── contributor/                 # Contributor documentation space
│   ├── README.md               # Contributor landing page
│   ├── SUMMARY.md              # Contributor navigation/sidebar
│   ├── images/                 # Contributor images
│   └── ...                     # Contributor content pages
│
└── apis/                        # API reference space
    ├── README.md               # APIs landing page
    ├── SUMMARY.md              # APIs navigation/sidebar
    └── ...                     # API documentation pages
```

## 🔄 GitBook Integration

### How It Works

This repository uses [GitBook's GitHub Sync](https://docs.gitbook.com/integrations/git-sync) to automatically publish documentation changes.

1. **Write**: Contributors edit markdown files in this repository
2. **Review**: Changes are reviewed via GitHub Pull Requests
3. **Merge**: Approved changes are merged to the `main` branch
4. **Deploy**: GitBook automatically syncs and publishes the updated documentation

### GitBook Configuration

Each documentation space has its own `.gitbook.yaml` configuration file (or shares the root configuration) that defines:

- **Root directory**: Where the documentation lives (e.g., `player/`, `creator/`)
- **Structure**: Entry point (`README.md`) and navigation (`SUMMARY.md`)
- **Redirects**: URL redirects for moved pages (optional)

Example `.gitbook.yaml`:

```yaml
root: ./player/

structure:
  readme: README.md
  summary: SUMMARY.md
```

### Automatic Deployment

✅ **Every merge to `main` triggers an automatic deployment**

When you merge a pull request to the `main` branch:
1. GitHub notifies GitBook via webhook
2. GitBook pulls the latest changes
3. GitBook rebuilds and publishes all affected spaces
4. Changes are live within minutes

## 📝 Writing Documentation

### Markdown Guidelines

- Use standard [GitHub Flavored Markdown](https://github.github.com/gfm/)
- GitBook supports additional features:
  - `{% hint style="info|warning|danger|success" %}` for callout boxes
  - `{% embed url="..." %}` for embedded content (videos, etc.)
  - Mermaid diagrams with triple backtick code blocks

### Navigation Structure

Each space has a `SUMMARY.md` file that defines the sidebar navigation:

```markdown
# Table of contents

* [Welcome](README.md)

## Section Name

* [Page Title](path/to/page.md)
* [Another Page](path/to/another.md)
  * [Nested Page](path/to/nested.md)
```

**GitBook Limitations:**
- Maximum 2 levels of nesting (groups and pages)
- Groups are defined by `##` headings
- Nested items use indentation

### Images

Store images in the `images/` directory within each space:

```
player/images/
creator/images/
contributor/images/
apis/images/
```

Reference images using relative paths:

```markdown
![Alt text](images/subfolder/image.png)
```

## 🤝 Contributing

### Maintaining the example catalog

Edit example pages and category metadata in [`creator/tutorials/examples/`](creator/tutorials/examples/). See the [catalog editing instructions](creator/tutorials/examples/AGENTS.md) for required fields, ownership labels, and code highlights. The generator and YAML parser live in [`scripts/example-catalog/`](scripts/example-catalog/); tests live in [`test/example-catalog.test.mjs`](test/example-catalog.test.mjs).

With Node.js 22 or newer, run these commands from the repository root:

```bash
npm ci --ignore-scripts
npm run generate:examples
npm test
```

Commit the generated overview, `catalog.json`, category landing pages, detail-page context and highlight blocks, and `creator/SUMMARY.md` alongside your entry changes. Keep the public JSON and images with the content. After committing, run `npm run check:examples` to verify generation leaves those files unchanged; CI runs the same check. Do not manually edit generated sections.

### Validating local links

Run `npm run check:links` to validate local links in every tracked or unignored Markdown file, including translations and contributor instructions. CI runs this on every pull request and push to `main`, including asset-only changes that could break links from unchanged pages.

The check covers Markdown links and images (including reference links), HTML `href`, `src`, and `poster` attributes, and GitBook file/embed/image URLs. Paths are case-sensitive; relative paths resolve from the Markdown file and leading `/` paths resolve from the repository root. It checks file/directory existence, not heading fragments or external URLs, and ignores front matter and code samples.

The initial scan found 1,134 existing broken links. These are explicitly recorded in [`scripts/local-links-baseline.json`](scripts/local-links-baseline.json); no Markdown directories are excluded. CI fails for new broken links and stale baseline entries. When repairing a known link, remove its exact entry from that file. Do not add entries to accommodate new failures. Run `npm run check:links -- --strict` to fail on the entire backlog, or append `--json` for a machine-readable report. The ordinary check reports how many known failures remain; passing it does not mean all historical links have been repaired.

### Validating media formats

Use **SVG** for vector images, **WebP** for still or animated raster images, and **WebM** for video. Run `npm run check:media` before committing assets. CI runs the same check on every pull request and push to `main`.

The script scans all tracked and unignored files using the `file` utility (preinstalled on macOS and the Ubuntu CI runner). It checks both the extension and detected content: renaming a PNG to `.webp` or hiding it under another extension fails. Non-media documents, audio files, models, and archives are outside this image/video policy. It does not inspect remote media or files inside archives. SVG/WebP/WebM extensions must match their content; codec compatibility is not checked. Symlinks are unsupported.

The initial optimization retained 374 PNG/JPEG/GIF files where lossless conversion was larger, failed exact verification, or the source was invalid, plus two existing ICO favicons. These 376 files are recorded by exact path and SHA-256 in [`scripts/media-format-exceptions.json`](scripts/media-format-exceptions.json). Only their unchanged contents are accepted. New files, copies at another path, and modifications must use an allowed format. When deleting or converting a legacy asset, remove its exception; stale entries fail CI. Do not add exceptions for new assets.

Convert assets with an appropriate encoder rather than changing their extension, preserve useful detail and animation behavior, and update all references. Run `npm run check:links` after replacing files.

### Checking for unused assets

Run `npm run check:assets` to check whether repository assets are referenced by at least one Markdown file. CI runs this on every pull request and push to `main`, so removing a page's last asset reference is checked even when the asset itself has not changed.

The inventory includes image, video, audio, font, model, archive and document asset extensions, all non-Markdown files under `images/` or `assets/`, and JSON downloads in documentation spaces. It excludes tooling/configuration files and does not inspect files inside archives. The check resolves Markdown links/images, reference-style links, HTML `src`/`href`/`poster`, GitBook file/embed/image URLs, and string paths in YAML front matter. Current `main` GitHub/raw URLs pointing into this repository also count. Paths must match exactly; mentioning a filename in prose or a code sample, or linking to its directory, does not count as using the asset.

The initial inventory found **3,796 unreferenced assets out of 4,573**. They are recorded in [`scripts/unreferenced-assets-baseline.json`](scripts/unreferenced-assets-baseline.json). CI fails on new unreferenced assets and stale baseline entries. Add a useful reference or remove the unused asset; when fixing an existing entry, remove it from the baseline. Do not add entries for new unused assets. This check does not delete files automatically, and passing it does not mean the historical backlog has been cleaned up.

Run `npm run check:assets -- --strict` to fail on every unreferenced asset, or `npm run check:assets -- --json` to produce a complete machine-readable inventory, including the backlog.

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/decentraland/docs.git
   cd docs
   ```

2. **Create a branch**
   ```bash
   git checkout -b feature/your-improvement
   ```

3. **Make changes**
   - Edit markdown files in the appropriate space
   - Add images to the `images/` directory
   - Update `SUMMARY.md` if adding/removing pages

4. **Test locally** (optional)
   - Preview markdown files in your editor
   - Or use GitBook's local preview

5. **Submit a pull request**
   ```bash
   git add .
   git commit -m "docs: Description of changes"
   git push origin feature/your-improvement
   ```

6. **Preview your changes**
   - When you open a PR to the `main` branch, GitBook automatically generates a preview deployment
   - Look for the GitBook check in the PR status — it will include a link to preview your changes
   - Use this preview to verify formatting, links, and overall presentation before requesting review

### PR Preview

Every pull request to `main` triggers GitBook's preview integration:

| Step | What Happens |
|------|--------------|
| PR Opened | GitBook builds a preview version of the documentation with your changes |
| Preview Ready | A unique preview URL is generated and posted in the PR checks |
| Review | Reviewers can see exactly how changes will look when published |
| Merge | Once approved and merged, changes deploy to the live documentation |

This preview feature ensures that documentation changes can be thoroughly reviewed in their final rendered form before going live.

## 🔗 Links

- **Live Documentation**: [docs.decentraland.org](https://docs.decentraland.org)
- **GitBook**: [Decentraland GitBook Organization](https://app.gitbook.com/)

## 📜 License

This documentation is licensed under the [Apache License 2.0](LICENSE).
