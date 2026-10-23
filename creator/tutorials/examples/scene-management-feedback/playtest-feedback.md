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
- [Play shared test build (Zone)](https://decentraland.zone/jump/?dclenv=zone&realm=sdk7testscenes.dcl.eth&position=0,-1)
- [Installation and usage guide](https://github.com/decentraland/sdk7-test-scenes/blob/main/scenes/0,-1-scene-feedback/README.md)

Learn what players find confusing, frustrating or enjoyable, even when you cannot watch them play. In the coin hunt, the first coin opens an invitation to give feedback, followed by a question if accepted. The first completed round brings a short set of questions for players who agreed to participate.

### Key features

- **Gameplay and player-opened feedback.** Ask at chosen game moments, or let players open a form through a button, kiosk or marked area. Declining gameplay questions still leaves those forms available.
- **Flexible questions.** Choose labelled ratings, optional comments or text-only answers, with your own question wording and rating scales.
- **Demo participation rewards.** Once per visit, answer every question in one form to get a visit-only Playtest Contributor nameplate visible to you, +5 coin score and double score for the next five pickups. Any rating counts; comments remain optional.
- **CSV results in scene Storage.** A Multiplayer Server saves each response with its question and gameplay moment. Download the files to review in a spreadsheet.

### Try and adapt it

Follow [How to test this scene](https://github.com/decentraland/sdk7-test-scenes/blob/main/scenes/0,-1-scene-feedback/README.md#how-to-test-this-scene) to run it locally. Collect a coin, accept the invitation, finish a round, then try the **Leave feedback** button.

For your scene, use the README's [full installation steps](https://github.com/decentraland/sdk7-test-scenes/blob/main/scenes/0,-1-scene-feedback/README.md#add-it-to-your-scene) for dependencies, permissions and World setup. Adapt the questions and moments using the [integration recipes](https://github.com/decentraland/sdk7-test-scenes/blob/main/scenes/0,-1-scene-feedback/EXAMPLES.md), including an invitation now and a question after later gameplay.

For playtest planning and finding players, see [Playtests](https://docs.decentraland.org/creator/scenes-sdk7/designing-the-experience/playtests). For AI-assisted planning, integration and analysis, use the [Scene Feedback SDK skill](https://github.com/decentraland/sdk-skills/tree/main/scene-feedback).

![Scene Feedback question with five rating choices and an optional comment field](https://raw.githubusercontent.com/decentraland/sdk7-test-scenes/main/scenes/0%2C-1-scene-feedback/assets/images/feedback-panel.png)
