# Example scene catalog

This directory contains the source entries for the Example Scenes catalog. Each category has its own folder, and each example has its own Markdown file. These files are the source of truth.

`creator/tutorials/examples.md` and `catalog.json` are generated from the individual example files. Do not edit them directly. The generator also registers example pages under Example Scenes in `creator/SUMMARY.md` so GitBook publishes their detail pages.

Do not add this file to `creator/SUMMARY.md`. It is contributor guidance, not a catalog entry.

When adding, removing, or changing an example entry:

1. Place the file in the folder for its category. The generator derives the category from the folder name.
2. Each category folder has a `README.md` with its display `title`, `description`, and `order`. Change that file to rename, describe, or reorder a category. It is not an example entry.
3. Keep each example's YAML front matter valid and complete. Every page requires `id`, `name`, `description`, `tags`, `source`, and `license`.
4. Published games belong in `published-games` and include `developer`, derived from the GitHub repository owner.
	- Include `realm` with the World name from the deployed play link, such as `skychaser.dcl.eth`. For Genesis City deployments, use `position` with parcel coordinates, such as `-140,101`, instead.
5. Run `node creator/tutorials/examples/generate-catalog.mjs` from the repository root before committing.
6. Commit the generated `catalog.json` and `creator/tutorials/examples.md` changes with the entry change.
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
