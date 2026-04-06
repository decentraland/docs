---
name: agent-behaviors
description: Behavioral guidelines for AI agents working on Decentraland scenes. Defines which actions require user confirmation before proceeding. Load this as part of any Decentraland scene workflow.
---

# Agent Behavioral Guidelines

## Actions that require user confirmation before proceeding

Three categories of change are significant enough that you should describe what you're planning and get the user's explicit go-ahead before doing them — even when the user's request implies them. A quick confirmation prevents misalignments that are hard to undo.

### 1. Changing parcel count or layout

**When it applies:** Any modification to `scene.parcels` in scene.json — adding parcels, removing them, or reshaping the grid (e.g., `["0,0"]` → `["0,0", "1,0"]`).

**Why it matters:** Parcel layout defines the scene's coordinate space. Changing it shifts the valid position range for every entity. Entities near the current boundary may end up outside (invisible) or inside the wrong parcel. The user may also have a deployment slot in mind and parcel count needs to match it.

**What to say:** Describe the change and its effect before acting:

> "To do this I'd need to go from 1 parcel (16×16m, X: 0–16) to a 2-parcel layout (32×16m, X: 0–32). That changes the coordinate bounds for the whole scene. Should I go ahead?"

### 2. Fetching assets from external sources

**When it applies:** Downloading any file not already in the project directory — 3D models (.glb), images, audio files, or video files. Includes downloads from the Creator Hub catalog, CC0 model repositories, or any external URL.

**Why it matters:** The user may have their own assets in mind, may not want new files added, or may be targeting a specific visual style. Downloading without asking can bloat the project and introduce unexpected dependencies.

**What to say:** Name the asset and source before fetching:

> "I'd download [model name] from [source] into `assets/scene/Models/`. Want me to fetch it?"

For streaming references (AudioStream, VideoPlayer): these don't download files but do add an external URL dependency. Confirm if the URL wasn't provided by the user:

> "I'd reference the stream at [URL]. Is that the source you want to use?"

### 3. Adding an authoritative server

**When it applies:** Any introduction of server-side logic — `isServer()`, `registerMessages()`, `Storage`, `EnvVar`, or switching to `@dcl/sdk@auth-server`.

**Why it matters:** The authoritative server is **BETA**. It requires a different SDK branch (`@dcl/sdk@auth-server`), changes how the scene builds and deploys, and is a fundamentally different architecture from CRDT multiplayer. Many users who want "multiplayer" only need the simpler `multiplayer-sync` skill (no server). Adding a server when the user just wanted basic sync is a significant overstep.

**What to say:** Clarify the scope before proceeding:

> "Adding an authoritative server means switching to the BETA `@dcl/sdk@auth-server` branch and restructuring the project to run server-side logic. That's a larger change than basic peer-to-peer multiplayer. Is this what you're after, or would CRDT sync (no server) work for your use case?"

---

## General principle

These aren't things the agent should refuse to do — they're things it should communicate about before doing. If the user confirms, proceed confidently. The goal is transparency, not gatekeeping.
