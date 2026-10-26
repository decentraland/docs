---
id: dead-surge
name: Dead Surge
description: "Zombie survival with weapon progression, pooled reward text, and local enemy steering
  around other zombies and obstacles."
tags: [ game, combat, progression, movement, ui, performance ]
developer: dcl-regenesislabs
source: https://github.com/dcl-regenesislabs/dead-surge
realm: deadsurge.dcl.eth
license:
  status: unknown
highlights:
  - title: Reuse entities for floating reward text
    description: "`spawnZcRewardTextAtPosition` and its pool initializer cycle through a fixed set of
      text entities. The `rewardTextSystem` makes them rise, face the camera, and fade before hiding
      them for reuse."
    tags:
      - object-pooling
      - ui
    references:
      - label: "`spawnZcRewardTextAtPosition` and its pool initializer"
        url: https://github.com/dcl-regenesislabs/dead-surge/blob/4e967ba0590e0cdf7d6550ebbf56ea3b246a36dd/src/zombie.ts#L592-L640
      - label: "`rewardTextSystem`"
        url: https://github.com/dcl-regenesislabs/dead-surge/blob/4e967ba0590e0cdf7d6550ebbf56ea3b246a36dd/src/zombie.ts#L815-L850
    context: Read the scene's `RewardTextComponent` and game-time updates with these functions to
      understand their lifetime tracking.
  - title: Steer enemies around each other and simple obstacles
    description: "`getZombieSeparationDirection` combines repulsion from nearby zombies.
      `resolveZombieMovePosition` tries the desired direction, a fallback, and individual movement
      axes against circular brick obstacles."
    tags:
      - ai
      - movement
    references:
      - label: "`getZombieSeparationDirection`"
        url: https://github.com/dcl-regenesislabs/dead-surge/blob/4e967ba0590e0cdf7d6550ebbf56ea3b246a36dd/src/zombie.ts#L868-L896
      - label: "`resolveZombieMovePosition`"
        url: https://github.com/dcl-regenesislabs/dead-surge/blob/4e967ba0590e0cdf7d6550ebbf56ea3b246a36dd/src/zombie.ts#L898-L939
    context: This illustrates local steering; the behavior depends on the scene's movement entries,
      obstacle positions, and radius constants.
---
# Dead Surge

![Dead Surge preview](images/deadSurge-preview.webp)

Zombie survival game with combat and weapon progression.

- [Play on Decentraland](https://decentraland.org/jump?realm=deadsurge.dcl.eth)

<!-- example-context:start -->
## Project information

**Maintained by:** Community · dcl-regenesislabs

[View upstream source](https://github.com/dcl-regenesislabs/dead-surge)

**License:** Not identified in this catalog. Consult the upstream repository and maintainer for applicable terms before reuse.

{% hint style="warning" %}
**Community-maintained code — review before use**

This community project is maintained outside the Decentraland GitHub organization. Its source code and live deployment may change independently.

Inclusion in this catalog does not imply a security audit or guarantee of safety. Review code, dependencies, and installation scripts before running or reusing it.

[Report a catalog concern](https://github.com/decentraland/docs/issues/new). For suspected vulnerabilities, follow the upstream project's security policy. Do not include exploit details or credentials in public issues.
{% endhint %}
<!-- example-context:end -->

<!-- example-highlights:start -->
## Explore the code

These links point to a specific source snapshot so the explanations remain useful as upstream development continues. They are learning references, not a security assessment.

### Reuse entities for floating reward text

`spawnZcRewardTextAtPosition` and its pool initializer cycle through a fixed set of text entities. The `rewardTextSystem` makes them rise, face the camera, and fade before hiding them for reuse.

**Project context:** Read the scene's `RewardTextComponent` and game-time updates with these functions to understand their lifetime tracking.

**Source references:**

- [`spawnZcRewardTextAtPosition` and its pool initializer](https://github.com/dcl-regenesislabs/dead-surge/blob/4e967ba0590e0cdf7d6550ebbf56ea3b246a36dd/src/zombie.ts#L592-L640)
- [`rewardTextSystem`](https://github.com/dcl-regenesislabs/dead-surge/blob/4e967ba0590e0cdf7d6550ebbf56ea3b246a36dd/src/zombie.ts#L815-L850)

### Steer enemies around each other and simple obstacles

`getZombieSeparationDirection` combines repulsion from nearby zombies. `resolveZombieMovePosition` tries the desired direction, a fallback, and individual movement axes against circular brick obstacles.

**Project context:** This illustrates local steering; the behavior depends on the scene's movement entries, obstacle positions, and radius constants.

**Source references:**

- [`getZombieSeparationDirection`](https://github.com/dcl-regenesislabs/dead-surge/blob/4e967ba0590e0cdf7d6550ebbf56ea3b246a36dd/src/zombie.ts#L868-L896)
- [`resolveZombieMovePosition`](https://github.com/dcl-regenesislabs/dead-surge/blob/4e967ba0590e0cdf7d6550ebbf56ea3b246a36dd/src/zombie.ts#L898-L939)

<!-- example-highlights:end -->
