# Example scene catalog

This directory contains the source entries for the Example Scenes catalog. Each example has its own Markdown file. These files are the source of truth.

`README.md` and `catalog.json` are generated from the individual example files. Do not edit them directly.

Do not add this file to `creator/SUMMARY.md`. It is contributor guidance, not a catalog entry.

When adding, removing, or changing an example entry:

1. Keep its YAML front matter valid and complete. Every page requires `id`, `name`, `description`, `category`, `tags`, `source`, and `license`.
2. Published games must use `category: published-games` and include `developer`, derived from the GitHub repository owner.
3. Run `node creator/tutorials/examples/generate-catalog.mjs` from the repository root before committing.
4. Commit the generated `catalog.json` and `README.md` changes with the entry change.
5. Use an existing tag where it fits. Current tags are:

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