---
description: Features available on the Decentraland desktop client that are not yet supported in the mobile app, and known cross-platform inconsistencies.
---

# Missing Features

{% hint style="info" %}
This page tracks the feature gap between the Decentraland desktop (Unity) client and the mobile app. It is sourced from the [godot-explorer feature parity tracker](https://github.com/decentraland/godot-explorer/issues/2402) and updated regularly. ETAs are estimates and subject to change.
{% endhint %}

## SDK Features Missing on Mobile

- [SDK Particle System Support](https://github.com/decentraland/godot-explorer/issues/1538) — arriving July–August 2026
- [PBPrimaryPointerInfo (worldRayDirection) not being populated](https://github.com/decentraland/godot-explorer/issues/2411) — July 20th
- [Implement AssetLoad (pre-load resources) SDK component on mobile](https://github.com/decentraland/godot-explorer/issues/2496) — July 20th
- [Scene Dynamic Lights](https://github.com/decentraland/godot-explorer/issues/616) — PBPointLight protocol exists but not implemented on mobile
- [SDK7 UiBackground nine-slice tiles instead of stretching](https://github.com/decentraland/godot-explorer/issues/2060) — No ETA
- [Audio Event Component](https://github.com/decentraland/godot-explorer/issues/861) — No ETA
- [Audio Analysis Component](https://github.com/decentraland/godot-explorer/issues/1184) — No ETA
- [Access Password Protected Worlds Modal on Pre-Load](https://github.com/decentraland/godot-explorer/issues/2502) — No ETA
- **Smart Items** — Not officially supported on mobile

## Desktop Client Features Not in Mobile

- [Camera — See Through Walls](https://github.com/decentraland/godot-explorer/issues/1814) — August 2026
- [Proximity Voice Chat](https://github.com/decentraland/godot-explorer/issues/888) — No ETA
- [Point-At In World](https://github.com/decentraland/godot-explorer/issues/1736) — No ETA
- [Nameplate Color Change](https://github.com/decentraland/godot-explorer/issues/1684) — No ETA
- [Communities](https://github.com/decentraland/godot-explorer/issues/656) — No ETA
- [Photo Gallery](https://github.com/decentraland/godot-explorer/issues/680) — No ETA
- [Community Streams](https://github.com/decentraland/godot-explorer/issues/676) — No ETA
- [Profile Badges](https://github.com/decentraland/godot-explorer/issues/678) — No ETA
- [Daily Quests](https://github.com/decentraland/godot-explorer/issues/682) — No ETA
- **Marketplace Credits** — No ETA
- [Chat Reactions](https://github.com/decentraland/godot-explorer/issues/1824) — No ETA
- [Chat Auto-Translation](https://github.com/decentraland/godot-explorer/issues/2260) — No ETA
- [Chat: Direct Messages](https://github.com/decentraland/godot-explorer/issues/1120) — No ETA
- [DCL Cast Support on mobile](https://github.com/decentraland/godot-explorer/issues/1881) — No ETA
- [Allow Minted Names Swapping in Profile](https://github.com/decentraland/godot-explorer/issues/1857) — No ETA
- [YouTube / Google Drive Video URLs unsupported](https://github.com/decentraland/godot-explorer/issues/2081) — Restricted in mobile for store compliance
- [Outfit Slots in Backpack](https://github.com/decentraland/godot-explorer/issues/1625) — No ETA

## Cross-Platform Inconsistencies

- [Unity client avatars not visible on mobile app](https://github.com/decentraland/godot-explorer/issues/1815) — July 2026
- [Colliders Shape Consistency Review vs Unity](https://github.com/decentraland/godot-explorer/issues/905) — August 2026
- [UI/TextShape elements positioned at different heights on mobile vs Unity](https://github.com/decentraland/godot-explorer/issues/2371) — August 2026
- [Avatar teeth render dark/gray instead of white](https://github.com/decentraland/godot-explorer/issues/1994) — No ETA

## Input/Platform Constraints

- **Static HUD Controls defined by Mobile Client** — ability to remove/modify them arriving July/August. [See issues](https://github.com/orgs/decentraland/projects/43/views/29).
- **Touch-only input** — no mouse hover states, keyboard shortcuts, or right-click.
- **No gesture support** — not currently planned.
