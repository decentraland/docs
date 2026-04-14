---
title: Vibe Coding with AI
description: Use AI assistants to build Decentraland scenes by describing what you want in plain language.
---

# Vibe Coding with AI

Build Decentraland scenes by describing what you want — an AI assistant handles the SDK7 code, ECS architecture, and project structure for you.

Whether you're a first-time creator or a seasoned developer, AI-assisted "vibe coding" lets you go from an idea to a running scene in minutes instead of hours.

{% hint style="info" %}
**💡 Tip**: You don't need to know TypeScript to get started. AI assistants can generate working scene code from plain language descriptions.
{% endhint %}

## What is Vibe Coding?

Vibe coding means building scenes by having a conversation with an AI assistant rather than writing every line of code by hand. You describe what you want — "a medieval tavern with clickable doors and background music" — and the AI writes correct, deployable SDK7 code.

This approach works at any skill level:

- **Beginners & non-developers** — Go from zero to a working scene without writing code manually.
- **Experienced developers** — Skip the boilerplate. Let the AI handle multiplayer sync, UI scaffolding, and deployment config while you focus on creative decisions.
- **Teams & studios** — Prototype scene concepts quickly before committing full development resources.

## Choosing an AI Tool

There are two main ways to use AI when building Decentraland scenes:

### Option A: OpenDCL (Terminal Agent)

[OpenDCL](https://github.com/dcl-regenesislabs/opendcl) is a purpose-built terminal agent that knows Decentraland inside out. It can scaffold projects, write code, preview scenes, and deploy — all from a single conversation.

```bash
# Install
npm install -g @dcl-regenesislabs/opendcl

# Run in any directory
opendcl
```

On first run, type `/setup` to configure your AI provider (Anthropic, OpenAI, Google, Ollama, and more).

**In an empty folder:**

```
$ opendcl
> Create a medieval tavern scene with a bar, tables, and a fireplace
```

OpenDCL scaffolds `scene.json`, `package.json`, `tsconfig.json`, and `src/index.ts` with your scene.

**In an existing scene:**

```
$ cd my-scene/
$ opendcl
> Add a click handler to the door that opens it with an animation
```

OpenDCL reads your scene context and modifies existing code without overwriting unrelated parts.

**Built-in commands:**

| Command | Description |
|---------|-------------|
| `/init` | Scaffold a new Decentraland scene |
| `/preview` | Start the dev server and open the scene in browser |
| `/deploy` | Deploy to Genesis City or a World |
| `/review` | Audit your code for quality and SDK7 best practices |
| `/explain <concept>` | Explain a Decentraland concept (e.g., `/explain tweens`) |

OpenDCL includes 20 built-in skills covering scaffolding, 3D models, interactivity, UI, animations, multiplayer, authoritative servers, audio/video, deployment, optimization, and more. Skills load automatically based on what you ask.

### Option B: Code Editor with AI (Cursor, VS Code + Copilot, etc.)

Use a general-purpose AI code editor like [Cursor](https://www.cursor.com/) or VS Code with GitHub Copilot. Decentraland provides a context folder so these tools understand the SDK.

1. Open the Creator Hub and create or open a scene.
2. Click the **< > CODE** button to open your code editor.
3. Use the editor's built-in AI assistant (Cursor's chat, Copilot, etc.) to generate or modify code.

### Option C: Install Skills into Any AI Agent

If you already use another AI coding agent (Claude Code, Windsurf, Codex, or others), you can install just the Decentraland skills without installing OpenDCL:

```bash
# Install all Decentraland skills
npx skills add dcl-regenesislabs/opendcl

# Or pick specific skills
npx skills add dcl-regenesislabs/opendcl --skill create-scene --skill multiplayer-sync

# Install globally (available in all projects)
npx skills add dcl-regenesislabs/opendcl -g
```

This copies skill files into your agent's configuration so it knows Decentraland patterns and constraints.

## The AI Context Folder

Every Decentraland scene project includes a `/dclcontext` folder with reference files that help AI assistants write correct SDK7 code. This folder contains information about components, APIs, patterns, and constraints.

The context folder is updated automatically when your scene's dependencies are updated. To force an update:

```bash
npx sdk-commands get-context-files
```

{% hint style="info" %}
**💡 Tip**: You can add your own context files to this folder to teach the AI about your specific project. Place custom files in a separate file, since the default files are overwritten on SDK updates.
{% endhint %}

## Available AI Skills

When you use OpenDCL or install skills into your agent, the following capabilities are available:

| Skill | What it does |
|-------|-------------|
| `create-scene` | Scaffold a new project from scratch |
| `add-3d-models` | Load `.glb` models, browse 2,700+ free Creator Hub assets |
| `add-interactivity` | Add click handlers, hover effects, triggers |
| `build-ui` | Create HUDs, menus, and buttons with React-ECS |
| `animations-tweens` | Animate objects, play GLTF animations, tweens |
| `multiplayer-sync` | Sync state between players (CRDT-based) |
| `authoritative-server` | Server-authoritative multiplayer with anti-cheat and persistence |
| `audio-video` | Add sounds, music, and video screens |
| `deploy-scene` | Publish to Genesis City (LAND-based) |
| `deploy-worlds` | Publish to a Decentraland World |
| `optimize-scene` | Fix performance issues, stay within limits |
| `camera-control` | Switch camera modes, cinematic cameras |
| `lighting-environment` | Lights, shadows, day/night cycle, glow |
| `player-avatar` | Player data, emotes, attachments, NPC avatars |
| `nft-blockchain` | Display NFTs, wallet checks, smart contracts |
| `advanced-rendering` | Billboards, 3D text, materials, transparency |
| `advanced-input` | Cursor state, movement restriction, input patterns |
| `scene-runtime` | Async tasks, fetch, timers, realm info |
| `visual-feedback` | Screenshot tool for seeing and iterating visually |
| `game-design` | Plan game architecture, scene limits, MVP planning |

## Tips for Effective Prompting

Getting the best results from AI is about giving clear, specific prompts. Here are some tips:

### Be specific about what you want

Instead of:
> "Make my scene better"

Try:
> "Add a door at position (8, 0, 8) that opens with a rotation animation when clicked, and plays a creak sound effect"

### Reference existing items

> "Make the red button on the table trigger the elevator to go up"

### Ask for one thing at a time

Break complex requests into steps:

1. "Add a scoreboard UI in the top-right corner"
2. "Add a counter that increases when the player clicks the target"
3. "Display the counter value on the scoreboard"

### Include constraints

> "Add background music that loops, but keep the file size under 1 MB"

### Iterate and refine

After each change:

1. Preview the scene (click **Preview** in Creator Hub, or `/preview` in OpenDCL)
2. Check what works and what doesn't
3. Tell the AI what to adjust: "Move the NPC 2 meters to the left and make it face the player"

## What AI Can Help With

- Scaffolding new scenes from a description
- Adding and positioning 3D models
- Writing click handlers and interactivity
- Building UI (HUDs, menus, dialogs)
- Setting up multiplayer sync
- Configuring authoritative servers for anti-cheat
- Adding audio, video, and streaming
- Creating animations and tweens
- Optimizing scene performance
- Preparing scenes for deployment
- Debugging issues in existing code

## Limitations

While AI tools are powerful, keep these in mind:

- **Always preview** — AI-generated code may not look exactly how you expect. Run a preview to verify.
- **Scene limits still apply** — AI cannot bypass Decentraland's [scene limitations](../optimizing/scene-limitations.md) (triangle counts, file sizes, parcel boundaries).
- **Complex game logic** — For intricate game mechanics, you may need to guide the AI step by step or refine its output manually.
- **Custom 3D models** — AI can reference existing free assets or load models you provide, but it cannot create 3D models from scratch.

## Next Steps

- [SDK Quick Start](sdk-101.md) — Learn SDK7 fundamentals
- [Combine with Code](../../scene-editor/code/overview.md) — Mix visual editing with code
- [Authoritative Servers](../networking/authoritative-servers.md) — Server-authoritative multiplayer
- [Scene Examples](https://studios.decentraland.org/resources?sdk_version=SDK7) — Browse example scenes for inspiration
