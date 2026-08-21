---
description: Features available on the Decentraland desktop client that are not yet supported in the mobile app, and known cross-platform inconsistencies.
---

# Missing Features

{% hint style="info" %}
This page tracks the feature gap between the Decentraland desktop (Unity) client and the mobile app. It is sourced from the [godot-explorer feature parity tracker](https://github.com/decentraland/godot-explorer/issues/2402) and updated regularly. ETAs are estimates and subject to change.

Last reviewed: **August 2026**.
{% endhint %}

## Recently Added to Mobile

These gaps have been closed and are no longer limitations. They may not be in the build you are testing yet — check that you are on the latest mobile release.

| Feature | Issue | Closed |
| --- | --- | --- |
| SDK Particle System support | [#1538](https://github.com/decentraland/godot-explorer/issues/1538) | Jul 2026 |
| `AssetLoad` (pre-load resources) SDK component | [#2496](https://github.com/decentraland/godot-explorer/issues/2496) | Jul 2026 |
| `PBPrimaryPointerInfo` (`worldRayDirection`) now populated | [#2411](https://github.com/decentraland/godot-explorer/issues/2411) | Aug 2026 |
| Scene dynamic lights (`PBPointLight` / `PBSpotlight`) | [#616](https://github.com/decentraland/godot-explorer/issues/616) | Aug 2026 |
| Password-protected Worlds modal on pre-load | [#2502](https://github.com/decentraland/godot-explorer/issues/2502) | Aug 2026 |
| Avatar Masks (upper-body-only emotes) | [#2621](https://github.com/decentraland/godot-explorer/issues/2621) | Aug 2026 |
| Camera — see through walls | [#1814](https://github.com/decentraland/godot-explorer/issues/1814) | Jul 2026 |
| Minted name swapping in profile | [#1857](https://github.com/decentraland/godot-explorer/issues/1857) | Jul 2026 |
| Unity client avatars not visible on mobile | [#1815](https://github.com/decentraland/godot-explorer/issues/1815) | Aug 2026 |
| UI/TextShape elements positioned at different heights | [#2371](https://github.com/decentraland/godot-explorer/issues/2371) | Jul 2026 |

## SDK Features Missing on Mobile

- [SDK7 UiBackground nine-slice tiles instead of stretching](https://github.com/decentraland/godot-explorer/issues/2060) — No ETA
- [SDK audio parity audit (volume curves and spatial attenuation vs Unity)](https://github.com/decentraland/godot-explorer/issues/861) — No ETA
- [AudioEvent component (`PBAudioEvent`)](https://github.com/decentraland/godot-explorer/issues/2673) — No ETA
- [Audio Analysis component](https://github.com/decentraland/godot-explorer/issues/1184) — No ETA
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
- Marketplace Credits — No ETA
- [Chat Reactions](https://github.com/decentraland/godot-explorer/issues/1824) — No ETA
- [Chat Auto-Translation](https://github.com/decentraland/godot-explorer/issues/2260) — No ETA
- [Chat: Direct Messages](https://github.com/decentraland/godot-explorer/issues/1120) — No ETA
- [DCL Cast Support on mobile](https://github.com/decentraland/godot-explorer/issues/1881) — No ETA
- [YouTube / Google Drive Video URLs unsupported](https://github.com/decentraland/godot-explorer/issues/2081) — Restricted in mobile for store compliance
- [Outfit Slots in Backpack](https://github.com/decentraland/godot-explorer/issues/1625) — No ETA

## Cross-Platform Inconsistencies

- [Colliders Shape Consistency Review vs Unity](https://github.com/decentraland/godot-explorer/issues/905) — No ETA
- [Avatar teeth render dark/gray instead of white](https://github.com/decentraland/godot-explorer/issues/1994) — No ETA

## Input/Platform Constraints

- **Static HUD Controls defined by Mobile Client** — ability to remove/modify them arriving July/August. [See issues](https://github.com/orgs/decentraland/projects/43/views/29).
- **Touch-only input** — no mouse hover states, keyboard shortcuts, or right-click.
- **No gesture support** — not currently planned.

## Report a Missing Feature

If you hit a limitation that is not listed here, please [report it](../../sdk7/debugging/report-bug.md) so we can document and prioritize it.
