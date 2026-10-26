---
id: slide-penguin
name: Slide Penguin
description: A penguin-sliding game with timed sweeping, deceleration, and distance-based scoring.
tags: [game, seasonal, platformer]
developer: ToxSam
source: https://github.com/ToxSam/SlidePenguin
position: -140,101
license: unlicensed
---
# Slide Penguin

<!-- example-context:start -->
**Maintained by:** Community · ToxSam

[View upstream source](https://github.com/ToxSam/SlidePenguin)

This community project is maintained outside the Decentraland GitHub organization. Its source code and live deployment may change independently. Inclusion in this catalog does not imply a security audit or guarantee of safety. Review code, dependencies, and installation scripts before running or reusing it.

[Report a catalog concern](https://github.com/decentraland/docs/issues/new). For suspected vulnerabilities, follow the upstream project's security policy. Do not include exploit details or credentials in public issues.
<!-- example-context:end -->

- [Play on Decentraland](https://decentraland.org/jump?position=-140%2C101)

Slide a penguin toward a target and use timed sweeps to affect how quickly it slows down.

Deployment note: Not currently deployed.

### Explore the code

These links point to a specific source snapshot so the explanations remain useful as upstream development continues. They are learning references, not a security assessment.

- **Turn sweeping into a temporary movement modifier.** [`handleSwipe`](https://github.com/ToxSam/SlidePenguin/blob/19978bf4ca9e793ce87cd5637efc1abf3a3b686c/src/systems.ts#L519-L598) applies a cooldown to the deceleration reduction and records when that effect expires. [`penguinMovementSystem`](https://github.com/ToxSam/SlidePenguin/blob/19978bf4ca9e793ce87cd5637efc1abf3a3b686c/src/systems.ts#L864-L913) restores the base deceleration after that window, updates speed, and advances the transform using frame time. Follow the project's `PenguinMovement` and `SwipeBox` components and tuning constants to understand the connection between input and motion.
- **Score how close an object lands to a target.** [`calculateDistance2D` and `calculateScore`](https://github.com/ToxSam/SlidePenguin/blob/19978bf4ca9e793ce87cd5637efc1abf3a3b686c/src/scoring.ts#L5-L39) ignore height, normalize horizontal distance against a maximum distance, and map it to a rounded score capped by `MAX_SCORE`. This small module is a useful starting point for understanding proximity scoring; its inputs are the final penguin position and target position.
