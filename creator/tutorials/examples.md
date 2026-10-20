---
title: Example Scenes
description: A curated, AI-readable index of Decentraland SDK7 example scenes, mechanics, and reusable systems.
---

# Example Scenes

Use this catalog before building a common mechanic from scratch. Every entry links to the canonical implementation, so you can inspect, clone, or reference the working code in your own scene or prompt to an AI coding agent.

This is an index, not a second copy of the code. Examples stay in the repositories that maintain them.

AI Agent? Go here: [catalog.json](./examples/catalog.json). It contains the same entries and metadata in a machine-readable format.

<!--
	EDITORS READ THIS: Don't edit below this line. Instead, edit the files in the ./examples/ directory and then run the generate-catalog.mjs script to update the tables below.
-->
<!-- example-scenes-catalog:start -->
## Start here

Core SDK7 references and starting points for new scenes.

| Example | What it demonstrates | Tags | Source |
| --- | --- | --- | --- |
| [SDK7 scene template](./examples/getting-started/sdk7-scene-template.md) | A clean starting point for a new TypeScript SDK7 scene. | `sdk7`, `scene` | [Open repository](https://github.com/decentraland/sdk7-scene-template) |

## Published Games

Released Decentraland scenes that demonstrate real-world mechanics.

| Game                                                                   | What it demonstrates                                                                                                                                                                                                                            | Developer         | Tags                                                                                                           | Source                                                                          |
| ---------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------- | -------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| [Alien Scrapyard](./examples/published-games/alien-scrapyard.md)       | Multiplayer co-op with timed rounds for building shapes before the clock runs out. Each completed object unlocks new scores and shapes, giving players a reason to return and help finish whatever absurd structure the crowd is building next. | procesista        | `game`, `multiplayer`, `timed-rounds`                                                                          | [Open repository](https://github.com/procesista/Alienscrap)                     |
| [Astro Crew](./examples/published-games/astro-crew.md)                 | A cooperative spaceship game where players shoot asteroids and saucers, repair hull breaches, and improve their gunner and engineering levels.                                                                                                  | DansStuff         | `game`, `multiplayer`, `multiplayer-server`, `progression`, `leaderboard`, `storage`                           | [Open repository](https://github.com/DansStuff/AstroCrew)                       |
| [Bloom Garden](./examples/published-games/bloom-garden.md)             | A cooperative Multiplayer Server garden with built-in Storage for persistent plant state and a weekly leaderboard.                                                                                                                              | TheLivingGarden   | `game`, `multiplayer`, `multiplayer-server`, `storage`, `leaderboard`                                          | [Open scene](https://github.com/TheLivingGarden/TheLivingGarden/tree/main-main) |
| [Clean The Club](./examples/published-games/clean-the-club.md)         | Team up with friends to transform a trashed nightclub before the next party begins, clearing bottles, cigarettes, and lost items from the chaos of the night before.                                                                            | CleanTheClub      | `game`, `multiplayer`, `timed-rounds`                                                                          | [Open repository](https://github.com/CleanTheClub/CleanTheClub)                 |
| [Cozy Farm](./examples/published-games/cozy-farm.md)                   | Grow crops, expand your farm, and make friends.                                                                                                                                                                                                 | dcl-regenesislabs | `game`, `social`                                                                                               | [Open repository](https://github.com/dcl-regenesislabs/cozy-farm)               |
| [Dead Surge](./examples/published-games/dead-surge.md)                 | Enter the graveyard, defeat zombies, survive as long as possible, and improve your weapons.                                                                                                                                                     | dcl-regenesislabs | `game`, `combat`, `progression`                                                                                | [Open repository](https://github.com/dcl-regenesislabs/dead-surge)              |
| [Fastlane Bowling](./examples/published-games/fastlane-bowling.md)     | A Multiplayer Server bowling game with server-simulated Cannon-ES physics, persistent player progression, leaderboards, and storage-backed components.                                                                                          | stom66            | `game`, `studio-made`, `multiplayer`, `multiplayer-server`, `physics`, `progression`, `leaderboard`, `storage` | [Open repository](https://github.com/stom66/dcl-bowling)                        |
| [Flag Tag](./examples/published-games/flag-tag.md)                     | A Multiplayer Server keep-away game with timed rounds, power-ups, and persistent leaderboards.                                                                                                                                                  | iillee            | `game`, `studio-made`, `multiplayer`, `multiplayer-server`, `leaderboard`                                      | [Open repository](https://github.com/iillee/flagtag)                            |
| [Goal Legends](./examples/published-games/goal-legends.md)             | Score goals.                                                                                                                                                                                                                                    | carlosmu          | `game`                                                                                                         | [Open repository](https://github.com/carlosmu/goal-legends-arena)               |
| [Kick Off](./examples/published-games/kick-off.md)                     | A seasonal World Cup prediction game.                                                                                                                                                                                                           | dcl-regenesislabs | `game`, `seasonal`                                                                                             | [Open repository](https://github.com/dcl-regenesislabs/kickoff-2026)            |
| [Monster Recon](./examples/published-games/monster-recon.md)           | Outsmart rapid-fire Memory Match rounds, then dash through camp to hunt down monsters and build a Codex of rare, exotic, and epic finds.                                                                                                        | carlosmu          | `game`, `collection`, `leaderboard`                                                                            | [Open repository](https://github.com/carlosmu/dcl-monster-recon)                |
| [My Dear Pet](./examples/published-games/my-dear-pet.md)               | A pet collecting game.                                                                                                                                                                                                                          | dcl-regenesislabs | `game`, `collection`                                                                                           | [Open repository](https://github.com/dcl-regenesislabs/marsh-colony)            |
| [Pigeon Deluxe](./examples/published-games/pigeon-deluxe.md)           | A playable Decentraland scene.                                                                                                                                                                                                                  | PepeGawd          | `game`, `community-made`                                                                                       | [Open repository](https://github.com/PepeGawd/Pigeon-Deluxe)                    |
| [Prime Drive](./examples/published-games/prime-drive.md)               | A three-lane bike racing game with obstacle dodging, coin collecting, and a track-record ghost to beat.                                                                                                                                         | carlosmu          | `game`, `multiplayer-server`, `leaderboard`, `storage`                                                         | [Open repository](https://github.com/carlosmu/dcl-prime-drive)                  |
| [Shroom Zoom](./examples/published-games/shroom-zoom.md)               | Bounce, double-jump, and glide around a glowing lakeside mushroom world, collecting sprites, uncovering lore, and racing to beat your best time.                                                                                                | CanessaDCL        | `game`, `platformer`, `collectibles`                                                                           | [Open repository](https://github.com/CanessaDCL/dcl-shroomzoom)                 |
| [Sky Chaser](./examples/published-games/sky-chaser.md)                 | A Multiplayer Server game about catching escaping packages, with weekly and all-time leaderboards.                                                                                                                                              | stom66            | `game`, `studio-made`, `multiplayer`, `multiplayer-server`, `leaderboard`                                      | [Open repository](https://github.com/stom66/dcl-sky-chaser)                     |
| [Slay the Steps](./examples/published-games/slay-the-steps.md)         | A Multiplayer Server Festive Trail experience with custom avatars, Marketplace API integration, and a custom colour-wheel picker.                                                                                                               | stom66            | `game`, `studio-made`, `multiplayer`, `multiplayer-server`, `avatars`, `marketplace-api`, `ui`                 | [Open repository](https://github.com/stom66/dcl-slay-the-steps)                 |
| [Slide Penguin](./examples/published-games/slide-penguin.md)           | A seasonal penguin game.                                                                                                                                                                                                                        | ToxSam            | `game`, `seasonal`, `platformer`                                                                               | [Open repository](https://github.com/ToxSam/SlidePenguin)                       |
| [The Fortune Teller](./examples/published-games/the-fortune-teller.md) | Step into a mystical circus booth where players can get their fortune told or take over the booth to tell friends' fortunes.                                                                                                                    | carlosmu          | `game`, `social`, `multiplayer`                                                                                | [Open repository](https://github.com/carlosmu/circus_fortune_teller)            |
| [Tower of Madness](./examples/published-games/tower-of-madness.md)     | Reach the top before time runs out.                                                                                                                                                                                                             | dcl-regenesislabs | `game`, `platformer`, `timed-rounds`                                                                           | [Open repository](https://github.com/dcl-regenesislabs/towerofmadness)          |

## Gameplay and interaction

Core gameplay mechanics and player interactions.

| Example | What it demonstrates | Tags | Source |
| --- | --- | --- | --- |
| [Input modifier](./examples/gameplay-interaction/input-modifier.md) | Changing or constraining player movement input in part of a scene. | `movement`, `input`, `player` | [Open scene](https://github.com/decentraland/sdk7-test-scenes/tree/main/scenes/0,1-input-modifier) |
| [Particle system](./examples/gameplay-interaction/particle-system.md) | Fire, smoke, sparks, snow, and other particle effects. | `particles`, `effects`, `visuals` | [Open scene](https://github.com/decentraland/sdk7-test-scenes/tree/main/scenes/0,7-particle-system) |
| [Pointer lock control](./examples/gameplay-interaction/pointer-lock-control.md) | Capturing mouse input for custom controls. | `input`, `mouse`, `camera` | [Open scene](https://github.com/decentraland/sdk7-test-scenes/tree/main/scenes/31,20-pointer-lock-control) |
| [Raycasting and collider layers](./examples/gameplay-interaction/raycasting-and-collider-layers.md) | Pointing at scene geometry and controlling which colliders react to a raycast. | `interaction`, `raycast`, `collision` | [Open scene](https://github.com/decentraland/sdk7-test-scenes/tree/main/scenes/77,-1-raycast-unit-tests) |
| [Trigger areas](./examples/gameplay-interaction/trigger-areas.md) | Detecting players entering and leaving areas, including collider-based triggers. | `interaction`, `triggers`, `collision` | [Open scene](https://github.com/decentraland/sdk7-test-scenes/tree/main/scenes/75,-9-trigger-areas) |
| [Zombie Attack](./examples/gameplay-interaction/zombie-attack.md) | A complete, playable game scene with enemies and scoring. | `game`, `complete-scene`, `score` | [Open scene](https://github.com/decentraland/sdk7-goerli-plaza/tree/main/zombie-attack) |

## UI, camera, and player experience

Interface, camera, and player-facing systems.

| Example | What it demonstrates | Tags | Source |
| --- | --- | --- | --- |
| [NPC Toolkit](./examples/ui-camera-player/npc-toolkit.md) | Reusable NPC behaviours and dialogue UI for SDK7 scenes. | `npc`, `dialogue`, `ui` | [Open repository](https://github.com/decentraland-scenes/dcl-npc-toolkit) |
| [Spectate mode](./examples/ui-camera-player/spectate-mode.md) | A spectator-style camera and player viewing flow. | `camera`, `spectator`, `player` | [Open scene](https://github.com/decentraland/sdk7-test-scenes/tree/main/scenes/33,20-spectate-mode) |
| [UI animations](./examples/ui-camera-player/ui-animations.md) | Animated UI elements, sprite sheets, and loading indicators. | `ui`, `animation`, `sprites` | [Open scene](https://github.com/decentraland/sdk7-goerli-plaza/tree/main/ui-animations) |
| [UI safe areas](./examples/ui-camera-player/ui-safe-areas.md) | Positioning interface elements around screen insets and safe areas. | `ui`, `hud` | [Open scene](https://github.com/decentraland/sdk7-test-scenes/tree/main/scenes/81,-2-ui-screen-inset-area) |
| [Virtual cameras](./examples/ui-camera-player/virtual-cameras.md) | Creating and switching to scene-defined cameras. | `camera`, `cinematic`, `controls` | [Open scene](https://github.com/decentraland/sdk7-test-scenes/tree/main/scenes/2,22-virtual-cameras) |

## Multiplayer, data, and services

Multiplayer patterns, persistent data, and external services.

| Example | What it demonstrates | Tags | Source |
| --- | --- | --- | --- |
| [Mini Games library](./examples/multiplayer-data-services/mini-games-library.md) | Player queues, scoreboards, and supporting logic for multiplayer mini games. | `multiplayer`, `scoreboard`, `game` | [Open repository](https://github.com/decentraland/sdk-mini-games) |
| [Multiplayer Server leaderboard](./examples/multiplayer-data-services/authoritative-server-leaderboard.md) | A server-owned leaderboard that validates scores, stores totals, and broadcasts rankings. | `multiplayer`, `leaderboard`, `server`, `storage` | [Open scene](https://github.com/decentraland/sdk7-test-scenes/tree/main/scenes/90,-9-authoritative-server-leaderboard) |
| [Third-party guest book](./examples/multiplayer-data-services/third-party-guest-book.md) | A guest book backed by an external HTTP service. | `api`, `storage` | [Open scene](https://github.com/decentraland/sdk7-goerli-plaza/tree/main/guest-book-api) |
| [Third-party leaderboard](./examples/multiplayer-data-services/third-party-leaderboard.md) | A persistent leaderboard backed by an external HTTP service. | `api`, `storage`, `leaderboard` | [Open scene](https://github.com/decentraland/sdk7-goerli-plaza/tree/main/leader-board) |
| [Third-party player authentication](./examples/multiplayer-data-services/third-party-player-authentication.md) | Verifying player identity for requests sent to an external service. | `api`, `authentication`, `player` | [Open scene](https://github.com/decentraland/sdk7-goerli-plaza/tree/main/validate-player-authenticity) |

## Audio, video, and environment

Media, lighting, and environment controls.

| Example | What it demonstrates | Tags | Source |
| --- | --- | --- | --- |
| [Audio visualization](./examples/audio-video-environment/audio-visualization.md) | Using live audio data to drive visual scene behaviour. | `audio`, `visualization`, `effects` | [Open scene](https://github.com/decentraland/sdk7-test-scenes/tree/main/scenes/88,-10-audio-visualization) |
| [Dynamic lights](./examples/audio-video-environment/dynamic-lights.md) | Changing lights at runtime. | `lighting`, `environment`, `effects` | [Open scene](https://github.com/decentraland/sdk7-test-scenes/tree/main/scenes/0,4-dynamic-lights) |
| [Skybox control](./examples/audio-video-environment/skybox-control.md) | Updating skybox time and transition settings from scene code. | `skybox`, `environment`, `lighting` | [Open scene](https://github.com/decentraland/sdk7-test-scenes/tree/main/scenes/2,1-skybox-sdk-scene-a) |
| [Video streaming](./examples/audio-video-environment/video-streaming.md) | Playing streamed video on a scene surface. | `video`, `streaming`, `media` | [Open scene](https://github.com/decentraland/sdk7-goerli-plaza/tree/main/video-streaming) |

## Performance and scene systems

Asset loading and scene-level systems.

| Example | What it demonstrates | Tags | Source |
| --- | --- | --- | --- |
| [Asset loading](./examples/performance-scene-systems/asset-loading.md) | Loading scene assets on demand rather than all at once. | `performance`, `loading`, `assets` | [Open scene](https://github.com/decentraland/sdk7-test-scenes/tree/main/scenes/88,-12-asset-load) |
| [Material and texture gallery](./examples/performance-scene-systems/material-and-texture-gallery.md) | Material, texture, and GLTF node modifier patterns. | `materials`, `textures`, `rendering` | [Open scene](https://github.com/decentraland/sdk7-test-scenes/tree/main/scenes/52,-52-testing-gallery) |
| [Modifier areas](./examples/performance-scene-systems/modifier-areas.md) | Applying area-specific settings such as hiding player name tags. | `player`, `areas`, `modifiers` | [Open scene](https://github.com/decentraland/sdk7-test-scenes/tree/main/scenes/9,99-modifier-areas) |

## Scene management and feedback

Tools for managing scenes and collecting player feedback.

| Example | What it demonstrates | Tags | Source |
| --- | --- | --- | --- |
| [Playtest feedback](./examples/scene-management-feedback/playtest-feedback.md) | Collect player ratings and comments during play or through a feedback button, kiosk, or area, with CSV results in scene Storage. | `ui`, `multiplayer-server`, `storage` | [Open scene](https://github.com/decentraland/sdk7-test-scenes/tree/feat/scene-feedback/scenes/0,-1-scene-feedback) |
<!-- example-scenes-catalog:end -->

## For AI-assisted creation

Give your coding agent the link to the closest example along with a clear request. For example: "Use the Multiplayer Server leaderboard scene as a reference and build a score board for my game."

Install the [SDK Skills](https://github.com/decentraland/sdk-skills) first so the agent has up-to-date SDK7 guidance.

For a broader guide to working with agents, see [Vibe Coding with AI](../sdk7/getting-started/vibe-coding.md).

## Legacy references

[Awesome Repository](https://github.com/decentraland-scenes/Awesome-Repository) is useful for historical SDK6 material, but it is not a canonical SDK7 source. Prefer the SDK7 examples above for new projects.
