---
id: monster-recon
name: Monster Recon
description: Outsmart rapid-fire Memory Match rounds, then dash through camp to hunt down monsters and build a Codex of rare, exotic, and epic finds.
tags: [game, collection, leaderboard]
developer: carlosmu
source: https://github.com/carlosmu/dcl-monster-recon
realm: monsterrecon.dcl.eth
license: unlicensed
---
# Monster Recon

<!-- example-context:start -->
**Maintained by:** Community · carlosmu

[View upstream source](https://github.com/carlosmu/dcl-monster-recon)

This community project is maintained outside the Decentraland GitHub organization. Its source code and live deployment may change independently. Inclusion in this catalog does not imply a security audit or guarantee of safety. Review code, dependencies, and installation scripts before running or reusing it.

[Report a catalog concern](https://github.com/decentraland/docs/issues/new). For suspected vulnerabilities, follow the upstream project's security policy. Do not include exploit details or credentials in public issues.
<!-- example-context:end -->

- [Play on Decentraland](https://decentraland.org/jump?realm=monsterrecon.dcl.eth)

A memory-match game where you clear timed boards, then chase down the monster you revealed before it escapes. Collect rare finds in your Codex and climb the weekly and all-time leaderboards.
### Key features

- Multiplayer Server
- Storage for progress, best times, leaderboards and weekly rewards.
- Virtual cameras
- Scene emotes
- Trigger areas
- Particles
- Tweens
- TextShapes
- 3D Leaderboard (with player profile pictures)
- Custom bitmap font for UI
- Synced live feed of other players’ catches

### Explore the code

These links point to a specific source snapshot so the explanations remain useful as upstream development continues. They are learning references, not a security assessment.

- **Build a chase from scene markers and trigger areas.** [`spawnHop`](https://github.com/carlosmu/dcl-monster-recon/blob/eb0bc6fa87b9ebf98c8c068ebb9bba686a9467cb/src/prizeChase.ts#L216-L271) combines a bobbing tween, spherical trigger, sound, and billboard sprite at a selected marker. The [catch handler](https://github.com/carlosmu/dcl-monster-recon/blob/eb0bc6fa87b9ebf98c8c068ebb9bba686a9467cb/src/prizeChase.ts#L183-L214) checks that the entering entity is the local player before cleaning up and calling the reward callback. Read this with the marker names, sprite atlas, and callbacks supplied to `startPrizeChase`.
- **Render custom bitmap text in ReactEcs.** [`BitmapTextLine`](https://github.com/carlosmu/dcl-monster-recon/blob/eb0bc6fa87b9ebf98c8c068ebb9bba686a9467cb/src/bitmapFont.tsx#L268-L327) lays out individual glyph images using atlas UVs, glyph offsets, and kerning. The preceding [measurement and wrapping helpers](https://github.com/carlosmu/dcl-monster-recon/blob/eb0bc6fa87b9ebf98c8c068ebb9bba686a9467cb/src/bitmapFont.tsx#L229-L266) break text into lines by measured width. The renderer needs matching bitmap-font metrics and texture assets.

![Monster Recon preview](images/monsterRecon-preview.webp)
