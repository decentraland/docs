---
id: npc-toolkit
name: NPC Toolkit
description: Reusable NPC behaviours and dialogue UI for SDK7 scenes.
tags: [ npc, dialogue, ui ]
source: https://github.com/decentraland-scenes/dcl-npc-toolkit
license:
  status: identified
  name: Apache-2.0
  url: https://github.com/decentraland-scenes/dcl-npc-toolkit/blob/main/LICENSE
highlights:
  - title: Separate revealing dialogue from advancing it
    description: "`handleDialogClick`, `rushText`, and `confirmText` first reveal the remaining
      characters if text is still typing. Subsequent input advances the script or selects a numeric
      dialogue branch, with callbacks for game actions."
    tags:
      - dialogue
      - ui
    references:
      - label: "`handleDialogClick`, `rushText`, and `confirmText`"
        url: https://github.com/decentraland-scenes/dcl-npc-toolkit/blob/60e327c67a126d92e47ecf8e7eda342ce1191076/src/dialog.ts#L489-L549
    context: Read this alongside the toolkit's `Dialog` data and `npcDialogComponent` state to
      understand how UI input drives a conversation.
  - title: Connect proximity and pointer input to an NPC interaction
    description: "`addClickReactions` and `addTriggerArea` configure pointer callbacks and a child
      sphere trigger, with settings for click-only activation and continuing dialogue when the
      player walks away. `activate` and `endInteraction` coordinate the active NPC, cooldown,
      dialogue, and optional player-facing behavior."
    tags:
      - triggers
      - input
    references:
      - label: "`addClickReactions` and `addTriggerArea`"
        url: https://github.com/decentraland-scenes/dcl-npc-toolkit/blob/60e327c67a126d92e47ecf8e7eda342ce1191076/src/npc.ts#L410-L531
      - label: "`activate` and `endInteraction`"
        url: https://github.com/decentraland-scenes/dcl-npc-toolkit/blob/60e327c67a126d92e47ecf8e7eda342ce1191076/src/npc.ts#L769-L823
    context: These functions rely on the toolkit's callback maps and tracking system.
---

# NPC Toolkit

<!-- example-context:start -->
**Maintained by:** Community · decentraland-scenes

[View upstream source](https://github.com/decentraland-scenes/dcl-npc-toolkit)

**License:** [Apache-2.0](https://github.com/decentraland-scenes/dcl-npc-toolkit/blob/main/LICENSE). Check upstream terms before reuse; code and assets may have different terms.

This community project is maintained outside the Decentraland GitHub organization. Its source code and live deployment may change independently. Inclusion in this catalog does not imply a security audit or guarantee of safety. Review code, dependencies, and installation scripts before running or reusing it.

[Report a catalog concern](https://github.com/decentraland/docs/issues/new). For suspected vulnerabilities, follow the upstream project's security policy. Do not include exploit details or credentials in public issues.
<!-- example-context:end -->

Use reusable NPC behaviours and dialogue UI for SDK7 scenes.

<!-- example-highlights:start -->
### Explore the code

These links point to a specific source snapshot so the explanations remain useful as upstream development continues. They are learning references, not a security assessment.

- **Separate revealing dialogue from advancing it.** `handleDialogClick`, `rushText`, and `confirmText` first reveal the remaining characters if text is still typing. Subsequent input advances the script or selects a numeric dialogue branch, with callbacks for game actions. Read this alongside the toolkit's `Dialog` data and `npcDialogComponent` state to understand how UI input drives a conversation. Sources: [`handleDialogClick`, `rushText`, and `confirmText`](https://github.com/decentraland-scenes/dcl-npc-toolkit/blob/60e327c67a126d92e47ecf8e7eda342ce1191076/src/dialog.ts#L489-L549).
- **Connect proximity and pointer input to an NPC interaction.** `addClickReactions` and `addTriggerArea` configure pointer callbacks and a child sphere trigger, with settings for click-only activation and continuing dialogue when the player walks away. `activate` and `endInteraction` coordinate the active NPC, cooldown, dialogue, and optional player-facing behavior. These functions rely on the toolkit's callback maps and tracking system. Sources: [`addClickReactions` and `addTriggerArea`](https://github.com/decentraland-scenes/dcl-npc-toolkit/blob/60e327c67a126d92e47ecf8e7eda342ce1191076/src/npc.ts#L410-L531); [`activate` and `endInteraction`](https://github.com/decentraland-scenes/dcl-npc-toolkit/blob/60e327c67a126d92e47ecf8e7eda342ce1191076/src/npc.ts#L769-L823).
<!-- example-highlights:end -->
