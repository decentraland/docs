# Example scene catalog

This directory contains the source entries for the Example Scenes catalog. Each category has its own folder, and each example has its own Markdown file. These files are the source of truth.

`creator/tutorials/examples.md` and `catalog.json` are generated from the individual example files. Do not edit them directly. The generator also registers example pages under Example Scenes in `creator/SUMMARY.md` so GitBook publishes their detail pages.

The generator derives `maintainer` from the GitHub source URL and `maintenance` as `decentraland` for the `decentraland` organization or `community` for other owners. These describe repository ownership, not security review status. It also updates the source link, maintenance label, and community notice between `example-context` markers in every detail page. Do not edit those generated blocks; edit the source URL and regenerate instead. Keep descriptions educational and do not imply that inclusion certifies safety or grants permission to reuse code or assets.

Do not add this file to `creator/SUMMARY.md`. It is contributor guidance, not a catalog entry.

To enrich an example, inspect its implementation and add an "Explore the code" section outside the generated context block. Explain a concrete technique, link to the relevant files or lines at a full commit SHA, and mention project-specific dependencies needed to understand it. Keep the main source link pointed at upstream development. Do not describe code highlights as a security assessment. Prefer explanations and source links; check the upstream license before copying code or assets.

When adding, removing, or changing an example entry:

1. Place the file in the folder for its category. The generator derives the category from the folder name.
2. Each category folder has a `README.md` with its display `title`, `description`, and `order`. Change that file to rename, describe, or reorder a category. It is not an example entry.
3. Keep each example's YAML front matter valid and complete. Every page requires `id`, `name`, `description`, `tags`, `source`, and `license`.
4. Published games belong in `published-games` and include `developer`, derived from the GitHub repository owner.
	- Include `realm` with the World name from the deployed play link, such as `skychaser.dcl.eth`. For Genesis City deployments, use `position` with parcel coordinates, such as `-140,101`, instead.
5. Install dependencies with `npm ci --ignore-scripts` (Node.js 22 or newer), then run `npm run generate:examples` from the repository root before committing. Run `npm test` for parser validation. CI runs `npm run check:examples` to ensure generated content is committed.
6. Commit generated changes to `catalog.json`, `creator/tutorials/examples.md`, `creator/SUMMARY.md`, and the detail-page context blocks with the entry change.
7. Use an existing tag where it fits. Current tags are:

	- `ai`
	- `animation`
	- `api`
	- `areas`
	- `assets`
	- `audio`
	- `authentication`
	- `avatars`
	- `camera`
	- `cinematic`
	- `collectibles`
	- `collection`
	- `collision`
	- `combat`
	- `community-made`
	- `complete-scene`
	- `controls`
	- `dialogue`
	- `effects`
	- `environment`
	- `game`
	- `hud`
	- `input`
	- `interaction`
	- `leaderboard`
	- `lighting`
	- `loading`
	- `marketplace-api`
	- `materials`
	- `media`
	- `modifiers`
	- `mouse`
	- `movement`
	- `multiplayer`
	- `multiplayer-server`
	- `npc`
	- `particles`
	- `performance`
	- `physics`
	- `platformer`
	- `player`
	- `progression`
	- `raycast`
	- `rendering`
	- `scene`
	- `score`
	- `scoreboard`
	- `sdk7`
	- `seasonal`
	- `server`
	- `skybox`
	- `social`
	- `spectator`
	- `sprites`
	- `storage`
	- `streaming`
	- `studio-made`
	- `textures`
	- `timed-rounds`
	- `triggers`
	- `ui`
	- `video`
	- `visualization`
	- `visuals`
	- `workflow`
