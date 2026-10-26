---
id: goal-legends
name: Goal Legends
description: "Multiplayer penalty shootouts with server-run matches, persistent leaderboards, phase-driven cameras, and synchronized ball animations."
tags: [game, multiplayer, multiplayer-server, storage, leaderboard, camera, animation]
developer: carlosmu
source: https://github.com/carlosmu/goal-legends-arena
realm: goallegends.dcl.eth
license: NOASSERTION
---
# Goal Legends

<!-- example-context:start -->
**Maintained by:** Community · carlosmu

[View upstream source](https://github.com/carlosmu/goal-legends-arena)

This community project is maintained outside the Decentraland GitHub organization. Its source code and live deployment may change independently. Inclusion in this catalog does not imply a security audit or guarantee of safety. Review code, dependencies, and installation scripts before running or reusing it.

[Report a catalog concern](https://github.com/decentraland/docs/issues/new). For suspected vulnerabilities, follow the upstream project's security policy. Do not include exploit details or credentials in public issues.
<!-- example-context:end -->

- [Play on Decentraland](https://decentraland.org/jump?realm=goallegends.dcl.eth)

A multiplayer penalty shootout game. Duel another player or the GL-Bot: pick left, center or right to score or save. Every round ends with a replay in the style of a TV broadcast, with the crowd reacting live.
### Key features

- **Multiplayer Server** runs the matches
- **Storage** for daily/all-time PvP/PvE leaderboards, and each player’s country flag.
- **Scene** **emotes**
- Animator-synced ball props for kicks, dives, goals and saves.
- **Virtual cameras** for the gameplay views and a winner cinematic everyone sees.
- **AvatarShape** crowd NPCs that react to each goal and save.
- **Particles** for the fireworks
- A portal with lights and **`GltfNodeModifiers`** that takes you to another World.

### Explore the code

These links point to a specific source snapshot so the explanations remain useful as upstream development continues. They are learning references, not a security assessment.

- **Switch cameras with match phases.** [`initGameplayCamera`](https://github.com/carlosmu/goal-legends-arena/blob/5d42bba8f10ac2c3103a4e5804541c693e8528b3/src/client/gameplayCamera.ts#L109-L165) selects gameplay, winner, or standard cameras from the client match snapshot. The winner camera orbits a pivot, while spectators can choose a free camera during play. Follow this alongside `clientSnapshot`, the `GameState` enum, and the named scene camera pivot.
- **Coordinate a prop animation with the game state.** [`tickAnimationManager`](https://github.com/carlosmu/goal-legends-arena/blob/5d42bba8f10ac2c3103a4e5804541c693e8528b3/src/client/animationManager.ts#L78-L114) starts a ball clip when the phase changes, chooses goal/save animations from the shot direction, and briefly hides the prop while changing clips. This path is specific to the bot kicker; human kickers carry the ball in their emotes. It depends on the scene's ball model and named animation clips.

![Goal Legends preview](images/goalLegends-preview.webp)
