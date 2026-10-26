---
id: sky-chaser
name: Sky Chaser
description: A Multiplayer Server game about catching escaping packages, with weekly and all-time leaderboards.
tags: [game, studio-made, multiplayer, multiplayer-server, leaderboard]
developer: stom66
source: https://github.com/stom66/dcl-sky-chaser
realm: skychaser.dcl.eth
license: NOASSERTION
---
# Sky Chaser

<!-- example-context:start -->
**Maintained by:** Community · stom66

[View upstream source](https://github.com/stom66/dcl-sky-chaser)

This community project is maintained outside the Decentraland GitHub organization. Its source code and live deployment may change independently. Inclusion in this catalog does not imply a security audit or guarantee of safety. Review code, dependencies, and installation scripts before running or reusing it.

[Report a catalog concern](https://github.com/decentraland/docs/issues/new). For suspected vulnerabilities, follow the upstream project's security policy. Do not include exploit details or credentials in public issues.
<!-- example-context:end -->

- [Play on Decentraland](https://decentraland.org/jump?realm=skychaser.dcl.eth)

A multiplayer game where players compete to catch escaping packages in each round. The scene includes weekly and all-time leaderboards.
### Key features

- Multiplayer server
- Synced gameplay via synced Mulberry32 RNG
- Storage API for leaderboards
- Player locomotion tweaks and physics forces for booster/trampolines/explosions
- Particle systems (boost trails, explosions, pickups)

### Explore the code

These links point to a specific source snapshot so the explanations remain useful as upstream development continues. They are learning references, not a security assessment.

- **Reuse projectile entities during play.** [`fireProjectile` and `getIdleProjectile`](https://github.com/stom66/dcl-sky-chaser/blob/e546854d2a2634ca5e28635c8b9be124a173f6dc/dcl/src/client/projectileManager.ts#L76-L124) reuse inactive projectiles, create new ones when the pool is exhausted, and update only active projectiles. Follow the project's `Projectile` class and event handlers for movement, collision responses, and round-end cleanup.
- **Seed pickup placement from round state.** [`onGameStart` and `getRandomPosition`](https://github.com/stom66/dcl-sky-chaser/blob/e546854d2a2634ca5e28635c8b9be124a173f6dc/dcl/src/client/spawners/pickupSpawner.ts#L115-L164) use the round start time to initialize the project's random generator, then sample pickup distances and heights. Read the pickup configuration and component store alongside it: mobile limits and later pickup activity affect the sequence of random calls, so a shared seed alone does not guarantee identical layouts on every client.

![Sky Chaser preview](images/skyChaser-preview.jpg)
