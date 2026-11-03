---
id: reward-claim-dispenser
name: Reward claim dispenser
description: Wearable dispensers and airdrop crates that claim rewards from a Rewards campaign.
tags: [ rewards, wearables, captcha, ui ]
source: https://github.com/decentraland/sdk7-goerli-plaza/tree/main/reward-claim
license:
  status: identified
  name: Apache-2.0
  url: https://github.com/decentraland/sdk7-goerli-plaza/blob/main/reward-claim/LICENSE
highlights:
  - title: Request a reward with a signed fetch
    description: "`claimToken` throttles repeated clicks, skips campaigns already claimed in the
      session, and checks that the player has a wallet. `requestToken` then posts the dispenser key,
      the current catalyst, and the player's address to the Rewards server using `signedFetch`."
    tags:
      - rewards
      - api
    references:
      - label: "`claimToken` and `requestToken`"
        url: https://github.com/decentraland/sdk7-goerli-plaza/blob/54a07775ee340f0ce22eb23280ef0e9c35f5e386/reward-claim/src/dispenser/claiming/claim.ts#L26-L99
      - label: "`ClaimConfig`"
        url: https://github.com/decentraland/sdk7-goerli-plaza/blob/54a07775ee340f0ce22eb23280ef0e9c35f5e386/reward-claim/src/dispenser/claiming/claimConfig.ts#L21-L34
    context: Replace the test campaign ID and dispenser key in `ClaimConfig` with your own campaign's
      values. See the Rewards getting-started guide for creating a campaign and dispenser.
  - title: Map Rewards responses to player feedback
    description: "`processResponse` distinguishes campaigns that have not started, have ended, or are
      disabled, out-of-stock dispensers, rewards already assigned, and successful claims, and shows a
      different dispenser UI for each."
    tags:
      - rewards
      - ui
    references:
      - label: "`processResponse`"
        url: https://github.com/decentraland/sdk7-goerli-plaza/blob/54a07775ee340f0ce22eb23280ef0e9c35f5e386/reward-claim/src/dispenser/claiming/claim.ts#L101-L197
    context: The UI states are defined in `dispenserUi.tsx`. Campaign start and end dates are
      optional fields on the campaign config.
  - title: Retry a claim with a captcha
    description: When the Rewards server asks for a captcha, `getCaptcha` fetches a captcha image and
      shows it in the dispenser UI. Submitting the answer calls `claimToken` again with the captcha
      ID and value.
    tags:
      - captcha
      - rewards
    references:
      - label: "`getCaptcha`"
        url: https://github.com/decentraland/sdk7-goerli-plaza/blob/54a07775ee340f0ce22eb23280ef0e9c35f5e386/reward-claim/src/dispenser/claiming/claim.ts#L209-L216
      - label: Captcha submit button
        url: https://github.com/decentraland/sdk7-goerli-plaza/blob/54a07775ee340f0ce22eb23280ef0e9c35f5e386/reward-claim/src/dispenser/claiming/ui/dispenserUi.tsx#L640-L643
    context: Whether a captcha is required is a setting of the dispenser in the Rewards dashboard.
  - title: Claim from an airdropped crate
    description: "`randomCrateSpawn` drops a crate with a parachute at a random point in the stage area.
      `DropCrate` raycasts down to find the ground and tweens the crate onto it, and clicking the crate
      claims the reward and makes it vanish."
    tags:
      - rewards
      - raycast
      - animation
    references:
      - label: "`randomCrateSpawn` and `SpawnCrate`"
        url: https://github.com/decentraland/sdk7-goerli-plaza/blob/54a07775ee340f0ce22eb23280ef0e9c35f5e386/reward-claim/src/crate.ts#L40-L119
    context: The crate drop is triggered by the `Activate` action of a Creator Hub lever in `main`.
---

# Reward claim dispenser

Give players wearables from a Decentraland Rewards campaign. The scene includes a click-to-claim dispenser, a button dispenser, and a lever that airdrops claimable crates.

<!-- example-context:start -->
## Project information

**Maintained by:** Decentraland

[View source](https://github.com/decentraland/sdk7-goerli-plaza/tree/main/reward-claim)

**License:** [Apache-2.0](https://github.com/decentraland/sdk7-goerli-plaza/blob/main/reward-claim/LICENSE). Check upstream terms before reuse; code and assets may have different terms.
<!-- example-context:end -->

<!-- example-highlights:start -->
## Explore the code

These links point to a specific source snapshot so the explanations remain useful as upstream development continues. They are learning references, not a security assessment.

### Request a reward with a signed fetch

`claimToken` throttles repeated clicks, skips campaigns already claimed in the session, and checks that the player has a wallet. `requestToken` then posts the dispenser key, the current catalyst, and the player's address to the Rewards server using `signedFetch`.

**Project context:** Replace the test campaign ID and dispenser key in `ClaimConfig` with your own campaign's values. See the Rewards getting-started guide for creating a campaign and dispenser.

**Source references:**

- [`claimToken` and `requestToken`](https://github.com/decentraland/sdk7-goerli-plaza/blob/54a07775ee340f0ce22eb23280ef0e9c35f5e386/reward-claim/src/dispenser/claiming/claim.ts#L26-L99)
- [`ClaimConfig`](https://github.com/decentraland/sdk7-goerli-plaza/blob/54a07775ee340f0ce22eb23280ef0e9c35f5e386/reward-claim/src/dispenser/claiming/claimConfig.ts#L21-L34)

### Map Rewards responses to player feedback

`processResponse` distinguishes campaigns that have not started, have ended, or are disabled, out-of-stock dispensers, rewards already assigned, and successful claims, and shows a different dispenser UI for each.

**Project context:** The UI states are defined in `dispenserUi.tsx`. Campaign start and end dates are optional fields on the campaign config.

**Source references:**

- [`processResponse`](https://github.com/decentraland/sdk7-goerli-plaza/blob/54a07775ee340f0ce22eb23280ef0e9c35f5e386/reward-claim/src/dispenser/claiming/claim.ts#L101-L197)

### Retry a claim with a captcha

When the Rewards server asks for a captcha, `getCaptcha` fetches a captcha image and shows it in the dispenser UI. Submitting the answer calls `claimToken` again with the captcha ID and value.

**Project context:** Whether a captcha is required is a setting of the dispenser in the Rewards dashboard.

**Source references:**

- [`getCaptcha`](https://github.com/decentraland/sdk7-goerli-plaza/blob/54a07775ee340f0ce22eb23280ef0e9c35f5e386/reward-claim/src/dispenser/claiming/claim.ts#L209-L216)
- [Captcha submit button](https://github.com/decentraland/sdk7-goerli-plaza/blob/54a07775ee340f0ce22eb23280ef0e9c35f5e386/reward-claim/src/dispenser/claiming/ui/dispenserUi.tsx#L640-L643)

### Claim from an airdropped crate

`randomCrateSpawn` drops a crate with a parachute at a random point in the stage area. `DropCrate` raycasts down to find the ground and tweens the crate onto it, and clicking the crate claims the reward and makes it vanish.

**Project context:** The crate drop is triggered by the `Activate` action of a Creator Hub lever in `main`.

**Source references:**

- [`randomCrateSpawn` and `SpawnCrate`](https://github.com/decentraland/sdk7-goerli-plaza/blob/54a07775ee340f0ce22eb23280ef0e9c35f5e386/reward-claim/src/crate.ts#L40-L119)

<!-- example-highlights:end -->
