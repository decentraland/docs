---
description: Features available on the Decentraland desktop client that are not yet supported in the mobile app, and known cross-platform inconsistencies.
---

# Missing Features

{% hint style="info" %}
This page tracks the feature gap between the Decentraland desktop (Unity) client and the mobile app. It is sourced from the [godot-explorer feature parity tracker](https://github.com/decentraland/godot-explorer/issues/2402) and updated regularly. ETAs are estimates and subject to change.

Last reviewed: **October 2026** (mobile app v1.14.1).
{% endhint %}

## Recently Shipped

These are no longer gaps. They are available in the mobile app as of the version shown:

- [Scene Dynamic Lights (`LightSource`)](../../sdk7/3d-essentials/lights.md) — v1.13.0
- [Avatar Masks (upper-body-only emotes)](../../sdk7/interactivity/avatars/avatar-animations.md#animate-only-the-upper-body) — v1.13.0
- SDK audio parity with Unity (volume curves and spatial attenuation) — v1.14.0
- [AudioEvent component (`PBAudioEvent`)](../../sdk7/3d-essentials/sounds.md#detect-when-a-sound-finishes) — v1.14.0
- [Audio Analysis component](../../sdk7/media/audio-analysis.md) — v1.14.0
- [`teleportTo` with a `realm`, to send players to a place in another World or realm](https://github.com/decentraland/godot-explorer/issues/2816) — v1.14.0
- Scenes can read the player's language (`getExplorerInformation().configurations.locale`) — v1.14.0
- `TextEncoder` / `TextDecoder` globals — v1.14.0
- Material texture `offset` / `tiling` move in the same vertical direction as on desktop — v1.14.0

## SDK Features Missing on Mobile

- [`stopEmote` restricted action](https://github.com/decentraland/godot-explorer/issues/2859) — fixed in [PR #2931](https://github.com/decentraland/godot-explorer/pull/2931), ships in **v1.15.0**. Upper-body emotes started by a scene will also pause when the player leaves the scene and stop when it unloads.
- [`AvatarNametag` (scene-authored label above a player's nametag)](https://github.com/decentraland/godot-explorer/issues/2811) — in progress, No ETA
- [`Tween` `MoveRotateScale` mode](https://github.com/decentraland/godot-explorer/issues/2949) — not implemented; the entity stays static. Use separate `Move`, `Rotate` and `Scale` tweens on parented entities instead — No ETA
- [SDK7 UiBackground nine-slice tiles instead of stretching](https://github.com/decentraland/godot-explorer/issues/2060) — No ETA
- [Draco mesh compression (`KHR_draco_mesh_compression`)](https://github.com/decentraland/godot-explorer/issues/2432) — not supported. The mobile client cannot load Draco-compressed `.gltf`/`.glb` models at runtime; export your models without Draco compression — No ETA
- Smart Items — not officially supported on mobile

## Desktop Client Features Not in Mobile

- [Proximity Voice Chat](https://github.com/decentraland/godot-explorer/issues/888) — No ETA
- [Point-At In World](https://github.com/decentraland/godot-explorer/issues/1736) — No ETA
- [Nameplate Color Change](https://github.com/decentraland/godot-explorer/issues/1684) — No ETA
- [Communities](https://github.com/decentraland/godot-explorer/issues/656) — No ETA
- [Photo Gallery](https://github.com/decentraland/godot-explorer/issues/680) — No ETA
- [Community Streams](https://github.com/decentraland/godot-explorer/issues/676) — No ETA
- [Profile Badges](https://github.com/decentraland/godot-explorer/issues/678) — No ETA
- [Daily Quests](https://github.com/decentraland/godot-explorer/issues/682) — No ETA
- [Chat Reactions](https://github.com/decentraland/godot-explorer/issues/1824) — No ETA
- [Chat Auto-Translation](https://github.com/decentraland/godot-explorer/issues/2260) — No ETA
- [Chat: Direct Messages](https://github.com/decentraland/godot-explorer/issues/1120) — No ETA
- [DCL Cast Support on mobile](https://github.com/decentraland/godot-explorer/issues/1881) — No ETA
- [YouTube / Google Drive Video URLs unsupported](https://github.com/decentraland/godot-explorer/issues/2081) — Restricted in mobile for store compliance
- [Outfit Slots in Backpack](https://github.com/decentraland/godot-explorer/issues/1625) — No ETA
- [Gifting wearables to other players](https://github.com/decentraland/godot-explorer/issues/2957) — No ETA
- ["Session ended" notice when the same account signs in on another device](https://github.com/decentraland/godot-explorer/issues/2880) — No ETA

## Cross-Platform Inconsistencies

- [Other players' positions are sent to scenes in map-wide coordinates instead of scene-relative ones](https://github.com/decentraland/godot-explorer/issues/2780) — fixed in [PR #3003](https://github.com/decentraland/godot-explorer/pull/3003), ships in **v1.15.0**. Affects `getPlayer({ userId }).position`, the player position in `onEnterScene`, and items attached to other players.
- **Player movement and collisions vs Unity**
  - Capsule size, step height, jump arc and gravity, run speed and air control — fixed in [PR #2920](https://github.com/decentraland/godot-explorer/pull/2920), ships in **v1.15.0**
  - [Slopes, edges, walls, landing and moving platforms](https://github.com/decentraland/godot-explorer/issues/2852) and [glide behavior](https://github.com/decentraland/godot-explorer/issues/2854) — in progress, No ETA
  - [Scene colliders thinner than 1 cm only collide from above, and invisible blockers and some SDK collision layers don't block the player](https://github.com/decentraland/godot-explorer/issues/2853) — No ETA
  - Landing and jump animations, movement blending ([#2855](https://github.com/decentraland/godot-explorer/issues/2855), [#2856](https://github.com/decentraland/godot-explorer/issues/2856), [#1553](https://github.com/decentraland/godot-explorer/issues/1553)) — No ETA
- [Downward raycasts from the player report a growing `hitDistance` on sloped geometry](https://github.com/decentraland/godot-explorer/issues/2830) — fix in review, No ETA
- [Upper-body emotes play as full-body emotes when seen by other mobile players](https://github.com/decentraland/godot-explorer/issues/2943) — No ETA
- [Scene-triggered emotes from Bevy Web players don't play on mobile](https://github.com/decentraland/godot-explorer/issues/2986) — fix in review, No ETA
- [In a Creator Hub mobile preview, the mobile player's avatar is not visible to desktop testers](https://github.com/decentraland/godot-explorer/issues/2773) — No ETA
- [Avatar teeth render dark/gray instead of white](https://github.com/decentraland/godot-explorer/issues/1994) — No ETA

## Input/Platform Constraints

- **Touch-only input** — no mouse hover states, keyboard shortcuts, or right-click.
- **Limited gesture support** — pinch-to-zoom (switching between first- and third-person camera) was added in v1.14.0; no other gestures are currently planned.

## Report a Missing Feature

If you hit a limitation that is not listed here, please [report it](../../sdk7/debugging/report-bug.md) so we can document and prioritize it.
