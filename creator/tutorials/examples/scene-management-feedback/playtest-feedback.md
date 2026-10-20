---
id: playtest-feedback
name: Playtest feedback
description: Collect player ratings and comments during play or through a feedback button, kiosk, or area, with CSV results in scene Storage.
tags: [ui, multiplayer-server, storage]
source: https://github.com/decentraland/sdk7-test-scenes/tree/feat/scene-feedback/scenes/0,-1-scene-feedback
license: unlicensed
---
# Playtest feedback

- [Source on GitHub](https://github.com/decentraland/sdk7-test-scenes/tree/feat/scene-feedback/scenes/0,-1-scene-feedback)
- [Full installation and usage guide](https://github.com/decentraland/sdk7-test-scenes/blob/fb87fd03c4649522ccefc79d8b40a287e2ff0f0e/scenes/0%2C-1-scene-feedback/README.md)

Add a reusable feedback module to your scene to collect player ratings and optional comments. Ask questions at chosen moments during play, or let players open a feedback form through a button, kiosk, or trigger area. A coin-hunt demo shows both approaches.

Copy the module's source and assets into your scene, then customise its questions and rating scales. Responses are saved as CSV in scene Storage by a Multiplayer Server. The example requires `@dcl/sdk@auth-server` and `authoritativeMultiplayer: true` in `scene.json`.

The source currently lives on a feature branch while [PR #108](https://github.com/decentraland/sdk7-test-scenes/pull/108) is open.
