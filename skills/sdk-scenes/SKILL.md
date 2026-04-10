---
name: sdk-scenes
description: Build, extend, and deploy Decentraland SDK7 scenes. This is the entry-point skill — it contains agent behavioral guidelines, the composite-first rule, and an index of all individual topic skills. Install this alongside the individual skills you need, or use `--skill '*'` to install everything.
---

# Decentraland SDK7 Scene Development

> **Runtime constraint:** Decentraland runs in a QuickJS sandbox. No Node.js APIs (`fs`, `http`, `path`, `process`). Use `executeTask()` + `fetch()` for async work.

## Agent Behavioral Guidelines

Before taking any significant action, check whether it falls into one of the three categories below and **confirm with the user first**.

**How to ask:** Phrase the question in plain, non-technical language that describes _what will happen to the scene_, not the underlying command.

> Good: _"Should I download this tree model into your scene assets?"_
> Bad: _"Run `curl https://… -o assets/scene/Models/tree.glb`?"_

### 1. Changing parcel count or layout

Any modification to `scene.parcels` in scene.json changes the scene's coordinate space. Describe the change and its effect before acting:

> "To fit the scene you described, I'd need to expand from 1 parcel (16×16 m) to a 2×1 layout (32×16 m). This changes the coordinate bounds for every entity. Should I go ahead?"

### 2. Fetching assets from external sources

Downloading any file not already in the project — 3D models (.glb), images, audio, video. Confirm before downloading:

> "I'd like to download a [description] model from [source] and add it to your scene. Should I go ahead?"

### 3. Adding an authoritative server

Introduces `isServer()`, `registerMessages()`, `Storage`, `EnvVar`, or switches to `@dcl/sdk@auth-server`. This is a **BETA** feature that changes the build and deploy architecture. Confirm before implementing:

> "To handle multiplayer this way I'd need to add a Beta Authoritative Server — that's a bigger change than basic sync and requires switching to a different SDK version. Is that what you're after?"

---

## CRITICAL RULE — Composite-first scene authoring

All static entities (models, lights, spawn points) MUST be defined in `assets/scene/main.composite`, NOT created in TypeScript via `engine.addEntity()`.

TypeScript (`src/index.ts`) is ONLY for:
- Dynamic behavior (systems, event handlers, state changes)
- Referencing composite entities via `getEntityOrNullByName('name')` or `getEntitiesByTag('tag')`
- Entities that are truly runtime-only (spawned/despawned during gameplay)

---

## Individual Skills

This skill is the entry point. The detailed implementation guidance lives in individual topic skills, each installable separately. Install specific ones or use `--skill '*'` for all.

### Scene Setup & Configuration
**Skill: `create-scene`** — Scaffolding, `scene.json` schema, multi-parcel layouts, composite vs TypeScript entity rules.

### 3D Models
**Skill: `add-3d-models`** — Loading `.glb`/`.gltf` with `GltfContainer`, positioning, colliders, and browsing the free asset catalogs (8,800+ models).

### Animations & Tweens
**Skill: `animations-tweens`** — GLTF animation clips with `Animator`, programmatic `Tween` and `TweenSequence`, easing functions.

### Materials & Rendering
**Skill: `advanced-rendering`** — PBR materials, `TextShape`, `Billboard`, `VisibilityComponent`, texture modes.

### Lighting & Environment
**Skill: `lighting-environment`** — Point/spot lights, shadows, `SkyboxTime` (day/night cycle), emissive materials.

### Click & Proximity Interactivity
**Skill: `add-interactivity`** — `pointerEventsSystem`, trigger areas, raycasting. For polling-based input see `advanced-input`.

### Advanced Input & Movement Control
**Skill: `advanced-input`** — `inputSystem` polling, WASD-controlled entities, `InputModifier`, `PointerLock`, `PrimaryPointerInfo`.

### Player & Avatar
**Skill: `player-avatar`** — Player position/profile, emotes, wearables, `AvatarAttach`, `AvatarModifierArea`.

### NPCs
**Skill: `npcs`** — `AvatarShape` NPCs and the NPC Toolkit library for GLB-based NPCs with dialogue and state machines.

### Player Physics
**Skill: `player-physics`** — Impulse forces, knockback, repulsion fields.

### Camera
**Skill: `camera-control`** — Camera state, `CameraModeArea`, `VirtualCamera` for cinematic shots.

### Screen-Space UI
**Skill: `build-ui`** — React ECS components for 2D in-world UI: layout, text, images, buttons, inputs.

### Audio & Video
**Skill: `audio-video`** — `AudioSource`, `AudioStream`, `VideoPlayer`, media permissions.

### Blockchain & NFTs
**Skill: `nft-blockchain`** — `NftShape`, wallet checks, token gating, signed requests, smart contracts.

### Multiplayer (CRDT, no server)
**Skill: `multiplayer-sync`** — `syncEntity` for peer-to-peer sync, `MessageBus`, parent-child sync.

### Authoritative Server (BETA)
**Skill: `authoritative-server`** — Headless server, `isServer()`, `registerMessages()`, `Storage`, `EnvVar`. Requires `@dcl/sdk@auth-server`.

### Script Components (Creator Hub)
**Skill: `script-components`** — Writing `.tsx` script files for the Creator Hub Script component, constructor parameters, `@action()` decorators.

### Async, HTTP, WebSocket, Timers
**Skill: `scene-runtime`** — `executeTask`, `fetch`, `signedFetch`, WebSocket, timers, realm/scene info, restricted actions.

### Scene Optimization
**Skill: `optimize-scene`** — Scene limits, object pooling, LOD, texture optimization, system throttling.

### Game Design
**Skill: `game-design`** — DCL design philosophy, state management, UX guidelines, game loop archetypes, MVP planning.

### Deployment
- **Skill: `deploy-scene`** — Genesis City deployment, `dcl deploy`, troubleshooting.
- **Skill: `deploy-worlds`** — Personal Worlds, `worldConfiguration`, ENS/DCL NAME requirements.

---

## How to use

1. Identify the topic from the user's request
2. Load the corresponding skill — it contains the full API, code patterns, and rules
3. For broad requests spanning multiple topics, load each relevant skill
4. For asset discovery, load the relevant catalog and suggest specific assets before fetching any
