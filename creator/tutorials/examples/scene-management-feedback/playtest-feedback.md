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

Learn what players find confusing, frustrating or enjoyable, even when you cannot watch them play. This reusable module includes a coin-hunt scene showing how to collect feedback during play and when players choose to give it.

### Add it with an AI agent

Give your AI agent the [Scene Feedback SDK skill](https://github.com/decentraland/sdk-skills/tree/main/scene-feedback) link and ask:

> Help me add Scene Feedback to this scene. First suggest suitable questions and when to ask them, then review the plan with me before integrating it.

The skill can help at two stages:

- **Before a playtest:** adapt questions, rating scales and timing to your game, then integrate the module after you review the plan.
- **After a playtest:** use the skill again with your CSV files to identify recurring problems and preferences, review the evidence and decide what to investigate next. You can also ask for a human-readable HTML report with grouped answers and rating summaries.

Prefer to integrate it yourself? Follow the [installation guide](https://github.com/decentraland/sdk7-test-scenes/blob/main/scenes/0,-1-scene-feedback/README.md#add-it-to-your-scene).

### What players experience

[Try the coin hunt in Zone](https://decentraland.zone/jump/?dclenv=zone&realm=sdk7testscenes.dcl.eth&position=0,-1):

1. **Collect the first coin.** An invitation asks whether the player wants to give feedback: "Hi, we're the Coin Hunt team!" If accepted, one question follows: "How easy or difficult was it to spot the coins?" The player chooses a rating and can add a comment.
2. **Finish the first round (five coins).** Players who agreed to participate receive two questions, one after another: how clear the next goal is and whether they want to keep playing.
3. **Give feedback at any time.** The **Leave feedback** button, clickable kiosk and marked area open a welcome message followed by a question set. These remain available even after declining gameplay questions.

![Example feedback form with five rating choices and an optional comment field](https://raw.githubusercontent.com/decentraland/sdk7-test-scenes/main/scenes/0%2C-1-scene-feedback/assets/images/feedback-panel.png)

### Key features

- **Flexible questions.** Choose labelled ratings, optional comments or text-only answers, with your own question wording and rating scales.
- **Demo participation rewards.** Once per visit, answer every question in one form to get a visit-only Playtest Contributor nameplate visible to you, +5 coin score and double score for the next five pickups. Any rating counts; comments remain optional.
- **CSV results in scene Storage.** A Multiplayer Server saves each response with its question and gameplay moment. Download the files to review in a spreadsheet.

### Adapt it to your scene

Use the [integration recipes](https://github.com/decentraland/sdk7-test-scenes/blob/main/scenes/0,-1-scene-feedback/EXAMPLES.md) to connect questions to your own game events, including inviting participants now and asking after later gameplay. For playtest planning and finding players, see [Playtests](https://docs.decentraland.org/creator/scenes-sdk7/designing-the-experience/playtests).
