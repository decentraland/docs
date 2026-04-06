---
name: agent-behaviors
description: Behavioral guidelines for AI agents working on Decentraland scenes. Defines which actions require user confirmation before proceeding. Load this as part of any Decentraland scene workflow.
---

# Agent Behavioral Guidelines

## Actions that require user confirmation before proceeding

Three categories of change are significant enough that you should describe what you're planning and get the user's explicit go-ahead before doing them — even when the user's request implies them. A quick confirmation prevents misalignments that are hard to undo.

**How to ask:** Always phrase the confirmation question in plain, non-technical language that describes *what will happen to the scene*, not the underlying command. The user may not be able to read a bash command or a file path. Lead with the human-readable question; only add the technical detail (command, path, URL) as secondary clarification if helpful.

Good: *"Should I download this tree model into your scene assets?"*
Bad: *"Run `curl https://… -o assets/scene/Models/tree.glb`?"*

### 1. Changing parcel count or layout

**When it applies:** Any modification to `scene.parcels` in scene.json — adding parcels, removing them, or reshaping the grid (e.g., `["0,0"]` → `["0,0", "1,0"]`).

**Why it matters:** Parcel layout defines the scene's coordinate space. Changing it shifts the valid position range for every entity. Entities near the current boundary may end up outside (invisible) or inside the wrong parcel. The user may also have a deployment slot in mind and parcel count needs to match it.

**What to say:** Describe the change and its effect in plain language before acting:

> "To fit the scene you described, I'd need to expand from 1 parcel (16×16 m) to a 2×1 layout (32×16 m). This changes the coordinate bounds for every entity in the scene. Should I go ahead?"

### 2. Fetching assets from external sources

**When it applies:** Downloading any file not already in the project directory — 3D models (.glb), images, audio files, or video files. Includes downloads from the Creator Hub catalog, CC0 model repositories, or any external URL.

**Why it matters:** The user may have their own assets in mind, may not want new files added, or may be targeting a specific visual style. Downloading without asking can bloat the project and introduce unexpected dependencies.

**What to say:** Describe what is being added and why, in plain language:

> "I'd like to download a [description] model from [source] and add it to your scene. Should I go ahead?"

Avoid leading with the file path or download command — mention those only as secondary detail if the user asks.

For streaming references (AudioStream, VideoPlayer): these don't download files but do add an external URL dependency. Confirm if the URL wasn't provided by the user:

> "I'd set up a video stream from [source]. Is that the one you want to use?"

### 3. Adding an authoritative server

**When it applies:** Any introduction of server-side logic — `isServer()`, `registerMessages()`, `Storage`, `EnvVar`, or switching to `@dcl/sdk@auth-server`.

**Why it matters:** The authoritative server is **BETA**. It requires a different SDK branch (`@dcl/sdk@auth-server`), changes how the scene builds and deploys, and is a fundamentally different architecture from CRDT multiplayer. Many users who want "multiplayer" only need the simpler `multiplayer-sync` skill (no server). Adding a server when the user just wanted basic sync is a significant overstep.

**What to say:** Clarify the scope in plain language before proceeding:

> "To handle multiplayer this way I'd need to add a Beta Authoritative Server — that's a bigger change than basic sync and requires switching to a different SDK version. Is that what you're after, or would simpler peer-to-peer sync work for your use case?"

---

## General principle

These aren't things the agent should refuse to do — they're things it should communicate about before doing. If the user confirms, proceed confidently. The goal is transparency, not gatekeeping.
