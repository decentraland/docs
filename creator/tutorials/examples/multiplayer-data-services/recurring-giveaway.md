---
id: recurring-giveaway
name: Recurring giveaway
description: A daily wearable giveaway that tracks visits and claims on a companion server.
tags: [ rewards, wearables, captcha, server, storage ]
source: https://github.com/decentraland/sdk7-goerli-plaza/tree/main/simple-giveaway-scene
license:
  status: identified
  name: Apache-2.0
  url: https://github.com/decentraland/sdk7-goerli-plaza/blob/main/simple-giveaway-scene/README.md
highlights:
  - title: Claim with an optional captcha step
    description: "`claimToken` either requests the reward directly or, when `USE_CAPTCHA` is on, fetches
      a captcha first. `validateCaptcha` sends the answer with the claim, then records the claim on the
      companion server and refreshes the player's progress."
    tags:
      - captcha
      - rewards
    references:
      - label: "`claimToken` and `requestToken`"
        url: https://github.com/decentraland/sdk7-goerli-plaza/blob/54a07775ee340f0ce22eb23280ef0e9c35f5e386/simple-giveaway-scene/src/classes/claim.class.ts#L29-L91
      - label: "`validateCaptcha`"
        url: https://github.com/decentraland/sdk7-goerli-plaza/blob/54a07775ee340f0ce22eb23280ef0e9c35f5e386/simple-giveaway-scene/src/classes/claim.class.ts#L110-L161
    context: The campaign and dispenser keys are set in `src/config/claim.config.ts`, which points at
      the Rewards test server by default.
  - title: Track daily progress on a companion server
    description: The Express and SQLite server in `server/` counts visits and advances each player to
      the next of three wearables, at most once every 24 hours.
    tags:
      - server
      - storage
    references:
      - label: "`/update-wearable`"
        url: https://github.com/decentraland/sdk7-goerli-plaza/blob/54a07775ee340f0ce22eb23280ef0e9c35f5e386/simple-giveaway-scene/server/src/index.ts#L59-L99
    context: The server trusts the player ID sent in the request body, and the scene records the claim
      only after the Rewards request succeeds. Treat the 24-hour limit as a demo; a production
      giveaway needs to verify the player with signed requests and enforce limits in the campaign.
---

# Recurring giveaway

Give away a different wearable on each of three consecutive days. A small companion server tracks each player's visits and claims, and the scene shows that data in its UI.

<!-- example-context:start -->
## Project information

**Maintained by:** Decentraland

[View source](https://github.com/decentraland/sdk7-goerli-plaza/tree/main/simple-giveaway-scene)

**License:** [Apache-2.0](https://github.com/decentraland/sdk7-goerli-plaza/blob/main/simple-giveaway-scene/README.md). Check upstream terms before reuse; code and assets may have different terms.
<!-- example-context:end -->

<!-- example-highlights:start -->
## Explore the code

These links point to a specific source snapshot so the explanations remain useful as upstream development continues. They are learning references, not a security assessment.

### Claim with an optional captcha step

`claimToken` either requests the reward directly or, when `USE_CAPTCHA` is on, fetches a captcha first. `validateCaptcha` sends the answer with the claim, then records the claim on the companion server and refreshes the player's progress.

**Project context:** The campaign and dispenser keys are set in `src/config/claim.config.ts`, which points at the Rewards test server by default.

**Source references:**

- [`claimToken` and `requestToken`](https://github.com/decentraland/sdk7-goerli-plaza/blob/54a07775ee340f0ce22eb23280ef0e9c35f5e386/simple-giveaway-scene/src/classes/claim.class.ts#L29-L91)
- [`validateCaptcha`](https://github.com/decentraland/sdk7-goerli-plaza/blob/54a07775ee340f0ce22eb23280ef0e9c35f5e386/simple-giveaway-scene/src/classes/claim.class.ts#L110-L161)

### Track daily progress on a companion server

The Express and SQLite server in `server/` counts visits and advances each player to the next of three wearables, at most once every 24 hours.

**Project context:** The server trusts the player ID sent in the request body, and the scene records the claim only after the Rewards request succeeds. Treat the 24-hour limit as a demo; a production giveaway needs to verify the player with signed requests and enforce limits in the campaign.

**Source references:**

- [`/update-wearable`](https://github.com/decentraland/sdk7-goerli-plaza/blob/54a07775ee340f0ce22eb23280ef0e9c35f5e386/simple-giveaway-scene/server/src/index.ts#L59-L99)

<!-- example-highlights:end -->
