# Decentraland SDK7 — Skill Index

This file is a navigation index. Use it to identify which skill or reference file to load for a given topic. Do not treat the section descriptions here as complete documentation — always load the linked skill for full patterns and code examples.

---

## Scene Setup & Configuration
**Skill: `create-scene`**
Scaffolding a new scene with `/init`, `scene.json` schema (parcels, spawnPoints, permissions, featureToggles), multi-parcel layouts, composite vs TypeScript entity rules, and what goes in `assets/scene/main.composite` vs `src/index.ts`.

## 3D Models
**Skill: `add-3d-models`**
Loading `.glb`/`.gltf` files with `GltfContainer`, positioning and scaling, collider setup (`visibleMeshesCollisionMask`, `invisibleMeshesCollisionMask`, `MeshCollider`), checking for built-in colliders and animations, and browsing the free asset catalogs.

## Animations & Tweens
**Skill: `animations-tweens`**
Playing GLTF animation clips with `Animator`, programmatic movement/rotation/scale with `Tween` and `TweenSequence`, easing functions, and sequencing multiple tweens.

## Materials & Rendering
**Skill: `advanced-rendering`**
PBR materials (metallic, roughness, emissive, transparency), `TextShape`, `Billboard`, `VisibilityComponent`, texture modes, and flat material accessors.

## Lighting & Environment
**Skill: `lighting-environment`**
Point lights, spot lights, shadow casting, `SkyboxTime` (day/night cycle), and emissive materials. For realm/world-time APIs see `scene-runtime`.

## Click & Proximity Interactivity
**Skill: `add-interactivity`**
Event-driven input: `pointerEventsSystem` (onClick, onPointerDown/Up, hover), trigger areas (enter/exit proximity zones), and raycasting. For polling-based input (held keys, WASD, InputModifier) see `advanced-input`.

## Advanced Input & Movement Control
**Skill: `advanced-input`**
Polling patterns with `inputSystem` (`isTriggered`, `isPressed`), WASD-controlled entities, `InputModifier` (freeze/restrict player), `PointerLock` (cursor capture), `PrimaryPointerInfo` (screen coords + world ray), and action bar number keys.

## Player & Avatar
**Skill: `player-avatar`**
Reading player position/profile, triggering emotes, reading equipped wearables, attaching objects with `AvatarAttach`, `AvatarModifierArea`, and locomotion speed settings.

## NPCs
**Skill: `npcs`**
Avatar-shaped NPCs using `AvatarShape` (wearables, expressions, mannequin mode) and the NPC Toolkit library (`libraries/npc.mdc`) for GLB-based NPCs with dialogue, movement patterns, and state machines.

## Player Physics
**Skill: `player-physics`**
Applying impulse forces to the player, knockback, repulsion fields, continuous and timed forces.

## Camera
**Skill: `camera-control`**
Reading camera state and mode, `CameraModeArea` (force first/third person), `VirtualCamera` for cinematic shots, and tracking camera position.

## Screen-Space UI
**Skill: `build-ui`**
React ECS components for 2D in-world UI: layout, text, images, buttons, inputs. See `references/ui-components.md` for the full component catalogue.

## Audio & Video
**Skill: `audio-video`**
`AudioSource` (local files), `AudioStream` (streaming URLs), `VideoPlayer` on mesh surfaces, media permissions (`ALLOW_MEDIA_HOSTNAMES`).

## Blockchain & NFTs
**Skill: `nft-blockchain`**
`NftShape`, wallet address checks, token gating, signed requests, smart contract calls, gas pricing, marketplace interactions.

## Multiplayer (CRDT, no server)
**Skill: `multiplayer-sync`**
`syncEntity` for CRDT-based peer-to-peer sync, `MessageBus` for broadcast events, parent-child sync, state readiness check. For custom backend communication see `scene-runtime`.

## Authoritative Server (BETA)
**Skill: `authoritative-server`**
Headless server with `isServer()`, `registerMessages()`, `validateBeforeChange()`, `Storage` (world + player persistence), and `EnvVar`. Requires `@dcl/sdk@auth-server`. **Confirm with user before implementing** — see `overview/agent-behaviors.md`.

## Async, HTTP, WebSocket, Timers
**Skill: `scene-runtime`**
`executeTask` for async work, `fetch` and `signedFetch` for HTTP, WebSocket, timers (`setInterval`/`setTimeout`), realm/scene info (`getRealm`, `getSceneInformation`), and restricted actions (`movePlayerTo`, `triggerEmote`, `openExternalUrl`).

## Scene Optimization
**Skill: `optimize-scene`**
Scene limits table (triangles, entities, materials, textures, height — all parcel counts), object pooling, LOD patterns, texture optimization, system throttling, and asset preloading with `AssetLoad`.

## Game Design
**Skill: `game-design`**
DCL-specific design philosophy (no startup screens, drop-in/drop-out, no player ejection), texture requirements, state management (module-level, component-based, state machines), UX guidelines, game loop archetypes, and MVP planning.

## Deployment
- **Genesis City**: `deploy-scene` — scene.json validation, the `dcl deploy` command, troubleshooting
- **Personal Worlds**: `deploy-worlds` — `worldConfiguration` in scene.json, ENS/DCL NAME requirements, Places listing

## Composites
**Reference: `Skills/composites/composite-reference.md`**
The `.composite` JSON format for declaring initial scene entities. Includes `getEntityOrNullByName` and `getEntitiesByTag` patterns for fetching composite entities in TypeScript.

## NPC Toolkit Library
**Reference: `libraries/npc.mdc`**
Full API for the `dcl-npc-toolkit`: GLB-based NPCs, dialogue systems, movement, state machines, animations. Sections: Installation, Basic Creation, Animations, Appearance, Interaction, Dialogue, Movement, State Management, Multiplayer, Common/Advanced Patterns, Config, Performance, Best Practices.

## Crypto/MANA Library
**Reference: `libraries/crypto.mdc`**
MANA operations, currency/NFT transactions, marketplace integration, contract interactions, wearable data.

## Utils Library (deprecated)
**Reference: `libraries/utils.mdc`**
Legacy utility library. Most functions now have native SDK equivalents (timers → `setInterval`, tweens → `Tween`, world transforms → `getWorldPosition`/`getWorldRotation`). Check native alternatives before using.

## SDK7 Cheat Sheet
**Reference: `Skills/context/sdk7-cheat-sheet.md`**
Quick lookup: common imports, component names, frequently used patterns.

## Components Reference
**Reference: `Skills/context/components-reference.md`**
Full ECS component API: all fields, types, and defaults.

## Free Asset Catalogs
- **3D Models — Creator Hub (2,746 models)**: `Skills/context/asset-packs-catalog.md` — 12 themed packs: Cyberpunk, Fantasy, Gallery, Genesis City, Halloween, Pirates, Sci-fi, Smart Items, Steampunk, Voxels, Western, Year of the Pig
- **3D Models — CC0 (991 models)**: `Skills/context/open-source-3d-assets.md` — 18 Polygonal Mind collections (MomusPark, Medieval Fair, Cyberpunk, Sci-fi, etc.)
- **Audio (50 sounds)**: `Skills/context/audio-catalog.md` — Music, Ambient, SFX, Game Mechanics, UI sounds

---

## How to use this index

1. Identify the topic from the user's request
2. Load the corresponding skill — it contains the full API, code patterns, and rules
3. For broad requests spanning multiple topics, load each relevant skill
4. For asset discovery, load the relevant catalog and suggest specific assets before fetching any
