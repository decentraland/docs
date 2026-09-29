# Example scene catalog

This directory contains the source entries for the Example Scenes catalog.

When adding, removing, or changing an example entry:

1. Keep its YAML front matter valid and complete. Every page requires `id`, `name`, `description`, `category`, `tags`, and `source`.
2. Published games must use `category: published-games` and include `developer`, derived from the GitHub repository owner.
3. Use an existing tag where it fits. Current tags are: `ai`, `animation`, `api`, `areas`, `assets`, `audio`, `authentication`, `avatars`, `camera`, `cinematic`, `collectibles`, `collection`, `collision`, `combat`, `community-made`, `complete-scene`, `controls`, `dialogue`, `effects`, `environment`, `farming`, `festive-trail`, `football`, `game`, `garden`, `hud`, `input`, `interaction`, `leaderboard`, `lighting`, `loading`, `marketplace-api`, `materials`, `media`, `memory-match`, `modifiers`, `mouse`, `movement`, `multiplayer`, `multiplayer-server`, `npc`, `particles`, `performance`, `pets`, `physics`, `platformer`, `player`, `predictions`, `progression`, `queue`, `racing`, `raycast`, `reference`, `rendering`, `responsive`, `roleplay`, `scene`, `score`, `scoreboard`, `sdk7`, `seasonal`, `server`, `skybox`, `social`, `spectator`, `sports`, `sprites`, `starter`, `storage`, `streaming`, `studio-made`, `survival`, `teamwork`, `test-scenes`, `textures`, `timed-rounds`, `triggers`, `ui`, `video`, `visualization`, `visuals`, `workflow`.
4. Run `node creator/tutorials/examples/generate-catalog.mjs` from the repository root before committing.
5. Commit the generated `catalog.json` and `README.md` changes with the entry change.

Do not add this file to `creator/SUMMARY.md`. It is contributor guidance, not a catalog entry.
