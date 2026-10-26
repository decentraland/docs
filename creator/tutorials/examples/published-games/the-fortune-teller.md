---
id: the-fortune-teller
name: The Fortune Teller
description: "Social fortune-telling with explicit conversation-state transitions and a pivot-based cinematic camera rig."
tags: [game, social, multiplayer, dialogue, camera, cinematic]
developer: carlosmu
source: https://github.com/carlosmu/circus_fortune_teller
realm: fortunes.dcl.eth
license: unlicensed
---
# The Fortune Teller

<!-- example-context:start -->
**Maintained by:** Community · carlosmu

[View upstream source](https://github.com/carlosmu/circus_fortune_teller)

This community project is maintained outside the Decentraland GitHub organization. Its source code and live deployment may change independently. Inclusion in this catalog does not imply a security audit or guarantee of safety. Review code, dependencies, and installation scripts before running or reusing it.

[Report a catalog concern](https://github.com/decentraland/docs/issues/new). For suspected vulnerabilities, follow the upstream project's security policy. Do not include exploit details or credentials in public issues.
<!-- example-context:end -->

- [Play on Decentraland](https://decentraland.org/jump?realm=fortunes.dcl.eth)

A social roleplay experience where players can receive fortunes or tell fortunes for friends.

### Explore the code

These links point to a specific source snapshot so the explanations remain useful as upstream development continues. They are learning references, not a security assessment.

- **Represent a reading as explicit state transitions.** The [fortune state machine](https://github.com/carlosmu/circus_fortune_teller/blob/f8db0c5630a03208d328a96737224e1293df60c7/src/fortuneFsm/machine.ts#L6-L60) lists allowed steps from category and deck selection through the reveal. `tryTransition` checks the next step, updates the session, and notifies state-entry listeners. Read it with the session types and action handlers to see how a multi-step interaction is organized.
- **Build a camera rig around a scene object.** [`ensureHostPivotRig` and `startHostCinematicCamera`](https://github.com/carlosmu/circus_fortune_teller/blob/f8db0c5630a03208d328a96737224e1293df60c7/src/cinematicCamera.ts#L141-L197) parent a virtual camera to a pivot under the table, choose starting and ending angles from the player's side, and activate the camera. The rig depends on the table entity, configuration values, and update system in this module; those pieces explain how to frame an interaction in its scene context.

![The Fortune Teller preview](images/Decentraland_n9oGHbJPnR.webp)
