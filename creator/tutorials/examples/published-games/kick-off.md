---
id: kick-off
name: Kick Off
description: "A World Cup prediction scene with charged ball kicks, immediate local motion feedback,
  and responsive schedule panels."
tags: [ game, seasonal, input, multiplayer, ui ]
developer: dcl-regenesislabs
source: https://github.com/dcl-regenesislabs/kickoff-2026
realm: kickoff.dcl.eth
license:
  status: unknown
highlights:
  - title: Connect a charged kick to immediate visual feedback
    description: The charge-and-release loop combines keyboard and mobile input, grows and recolors a
      charge bar, sends a kick message, and starts local ball motion. `releaseOptimistic`
      initializes that motion.
    tags:
      - input
      - feedback
    references:
      - label: charge-and-release loop
        url: https://github.com/dcl-regenesislabs/kickoff-2026/blob/1813434548c1c56d9eec46575cc001d2bbdcebfd/client/ball.ts#L491-L536
      - label: "`releaseOptimistic`"
        url: https://github.com/dcl-regenesislabs/kickoff-2026/blob/1813434548c1c56d9eec46575cc001d2bbdcebfd/client/ball.ts#L155-L178
    context: Study it with the project's `prodeNet` room and ball message handlers to understand the
      relationship between input, feedback, and multiplayer messages.
  - title: Scale UI from a reference canvas
    description: "`layoutScale` reads `UiCanvasInformation`, compares both dimensions with a 1920×1080
      design space, clamps the result, and applies an additional mobile factor."
    tags:
      - ui
      - responsive-layout
    references:
      - label: "`layoutScale`"
        url: https://github.com/dcl-regenesislabs/kickoff-2026/blob/1813434548c1c56d9eec46575cc001d2bbdcebfd/schedule/responsive.ts#L1-L21
    context: It is a compact example of a shared layout helper; the limits and mobile factor are tuned
      for this project's panels.
---
# Kick Off

![Kick Off preview](images/dclKickoff-preview.webp)

A seasonal World Cup prediction game.

- [Play on Decentraland](https://decentraland.org/jump?realm=kickoff.dcl.eth)

<!-- example-context:start -->
## Project information

**Maintained by:** Community · dcl-regenesislabs

[View upstream source](https://github.com/dcl-regenesislabs/kickoff-2026)

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

### Connect a charged kick to immediate visual feedback

The charge-and-release loop combines keyboard and mobile input, grows and recolors a charge bar, sends a kick message, and starts local ball motion. `releaseOptimistic` initializes that motion.

**Project context:** Study it with the project's `prodeNet` room and ball message handlers to understand the relationship between input, feedback, and multiplayer messages.

**Source references:**

- [charge-and-release loop](https://github.com/dcl-regenesislabs/kickoff-2026/blob/1813434548c1c56d9eec46575cc001d2bbdcebfd/client/ball.ts#L491-L536)
- [`releaseOptimistic`](https://github.com/dcl-regenesislabs/kickoff-2026/blob/1813434548c1c56d9eec46575cc001d2bbdcebfd/client/ball.ts#L155-L178)

### Scale UI from a reference canvas

`layoutScale` reads `UiCanvasInformation`, compares both dimensions with a 1920×1080 design space, clamps the result, and applies an additional mobile factor.

**Project context:** It is a compact example of a shared layout helper; the limits and mobile factor are tuned for this project's panels.

**Source references:**

- [`layoutScale`](https://github.com/dcl-regenesislabs/kickoff-2026/blob/1813434548c1c56d9eec46575cc001d2bbdcebfd/schedule/responsive.ts#L1-L21)

<!-- example-highlights:end -->
