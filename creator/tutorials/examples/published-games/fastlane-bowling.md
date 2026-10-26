---
id: fastlane-bowling
name: Fastlane Bowling
description: "Multiplayer bowling with server-simulated physics, persistent progression, batched
  state updates, and mobile-scaled particle effects."
tags:
  [
    game,
    studio-made,
    multiplayer,
    multiplayer-server,
    physics,
    progression,
    leaderboard,
    storage,
    particles
  ]
developer: stom66
source: https://github.com/stom66/dcl-bowling
realm: stom.dcl.eth
license:
  status: identified
  name: CC BY-NC-ND 4.0
  url: https://github.com/stom66/dcl-bowling/blob/main/LICENSE.md
highlights:
  - title: Batch synchronized state changes into client events
    description: In `LaneWatcher.onLaneChanged`, a set collects changed lanes and schedules one flush.
      `flush` reads each lane's snapshot and emits state and phase-transition events. Follow this
      flow to understand how the scene connects synchronized components to client reactions.
    tags:
      - multiplayer
      - events
    references:
      - label: "`LaneWatcher.onLaneChanged`"
        url: https://github.com/stom66/dcl-bowling/blob/25c5a7f9152835c190d9d20fa18b6010d0c6ce50/dcl/src/client/laneWatcher.ts#L79-L90
      - label: "`flush`"
        url: https://github.com/stom66/dcl-bowling/blob/25c5a7f9152835c190d9d20fa18b6010d0c6ce50/dcl/src/client/laneWatcher.ts#L132-L153
    context: Read it alongside the project's `LaneStore` and event-bus definitions.
  - title: Scale particle effects for mobile
    description: "`getParticleRatio` and `scaleConfig` adjust emission rates, particle limits, and burst
      counts using a mobile ratio while preserving the original configuration. `spawn` applies that
      configuration to a new emitter, with optional parenting and timed cleanup."
    tags:
      - particles
      - performance
    references:
      - label: "`getParticleRatio` and `scaleConfig`"
        url: https://github.com/stom66/dcl-bowling/blob/25c5a7f9152835c190d9d20fa18b6010d0c6ce50/dcl/src/client/particleSpawner.ts#L176-L218
      - label: "`spawn`"
        url: https://github.com/stom66/dcl-bowling/blob/25c5a7f9152835c190d9d20fa18b6010d0c6ce50/dcl/src/client/particleSpawner.ts#L91-L121
    context: This is useful when studying how one effect configuration can serve different devices.
---
# Fastlane Bowling

<!-- example-context:start -->
**Maintained by:** Community · stom66

[View upstream source](https://github.com/stom66/dcl-bowling)

**License:** [CC BY-NC-ND 4.0](https://github.com/stom66/dcl-bowling/blob/main/LICENSE.md). Check upstream terms before reuse; code and assets may have different terms.

This community project is maintained outside the Decentraland GitHub organization. Its source code and live deployment may change independently. Inclusion in this catalog does not imply a security audit or guarantee of safety. Review code, dependencies, and installation scripts before running or reusing it.

[Report a catalog concern](https://github.com/decentraland/docs/issues/new). For suspected vulnerabilities, follow the upstream project's security policy. Do not include exploit details or credentials in public issues.
<!-- example-context:end -->

- [Play on Decentraland](https://decentraland.org/jump?realm=stom.dcl.eth)

A multiplayer bowling game with realistic physics provided by Cannon-ES. Multiple games run across separate lanes in a shared space.
### Key features

- **[Cannon-ES](https://github.com/pmndrs/cannon-es) physics** on the Multiplayer Server, with compressed keyframes replayed by clients.
- **Storage** for player progression, stats, preferences, inventory, and weekly/all-time leaderboards.
- Dynamic **lights** with rotating shadow masks and spotlights that follow the ball.
- **Particle** trails and unlock effects, with reduced particle counts on mobile.
- **Virtual cameras** for the arrival fly-in, aiming, and roll playback.
- **`GltfNodeModifiers`** for scrolling neon texture UVs.
- SDK-controlled **glTF animations** for lane bumpers, countdowns, and scoring effects.

<!-- example-highlights:start -->
### Explore the code

These links point to a specific source snapshot so the explanations remain useful as upstream development continues. They are learning references, not a security assessment.

- **Batch synchronized state changes into client events.** In `LaneWatcher.onLaneChanged`, a set collects changed lanes and schedules one flush. `flush` reads each lane's snapshot and emits state and phase-transition events. Follow this flow to understand how the scene connects synchronized components to client reactions. Read it alongside the project's `LaneStore` and event-bus definitions. Sources: [`LaneWatcher.onLaneChanged`](https://github.com/stom66/dcl-bowling/blob/25c5a7f9152835c190d9d20fa18b6010d0c6ce50/dcl/src/client/laneWatcher.ts#L79-L90); [`flush`](https://github.com/stom66/dcl-bowling/blob/25c5a7f9152835c190d9d20fa18b6010d0c6ce50/dcl/src/client/laneWatcher.ts#L132-L153).
- **Scale particle effects for mobile.** `getParticleRatio` and `scaleConfig` adjust emission rates, particle limits, and burst counts using a mobile ratio while preserving the original configuration. `spawn` applies that configuration to a new emitter, with optional parenting and timed cleanup. This is useful when studying how one effect configuration can serve different devices. Sources: [`getParticleRatio` and `scaleConfig`](https://github.com/stom66/dcl-bowling/blob/25c5a7f9152835c190d9d20fa18b6010d0c6ce50/dcl/src/client/particleSpawner.ts#L176-L218); [`spawn`](https://github.com/stom66/dcl-bowling/blob/25c5a7f9152835c190d9d20fa18b6010d0c6ce50/dcl/src/client/particleSpawner.ts#L91-L121).
<!-- example-highlights:end -->

![Fastlane Bowling preview](images/fastlaneBowling-preview.webp)
