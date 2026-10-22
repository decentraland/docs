---
id: playtest-feedback
name: Scene Feedback
description: Collect player ratings and comments during play or through a feedback button, kiosk, or area, with CSV results in scene Storage.
tags: [ui, multiplayer-server, storage]
source: https://github.com/decentraland/sdk7-test-scenes/tree/main/scenes/0,-1-scene-feedback
license: unlicensed
---
# Scene Feedback

- [Source on GitHub](https://github.com/decentraland/sdk7-test-scenes/tree/main/scenes/0,-1-scene-feedback)
- [Full installation and usage guide](https://github.com/decentraland/sdk7-test-scenes/blob/main/scenes/0,-1-scene-feedback/README.md)

Add a reusable feedback module to your scene to collect player ratings and optional comments. Ask questions at chosen moments during play, or let players open a feedback form through a button, kiosk, or trigger area. A coin-hunt demo shows both approaches.

Copy the module's source and assets into your scene, then customise its questions and rating scales. Responses are saved as CSV in scene Storage by a Multiplayer Server. The example requires `@dcl/sdk@auth-server` and `authoritativeMultiplayer: true` in `scene.json`.

For AI-assisted planning, integration, and response analysis, see the [Scene Feedback SDK skill (in review)](https://github.com/decentraland/sdk-skills/pull/131).
