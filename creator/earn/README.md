---
description: >-
  The ways creators get paid in Decentraland: the Creator Fund, Creator
  Success, selling wearables and emotes, and accepting payments in a scene.
---

# How to make money in Decentraland

There are several ways to get paid for what you make in Decentraland. Two Foundation programs pay creators for building games and experiences that players keep coming back to. You can also sell wearables and emotes, and a scene can accept payments directly from players.

| Option                                                         | Best for                                                            | How you get paid                                              |
| -------------------------------------------------------------- | ------------------------------------------------------------------- | ------------------------------------------------------------- |
| [Creator Fund](#creator-fund-get-rewarded-for-player-activity) | Owners of published scenes that already attract players             | USDC rewards after every Cycle, based on player activity      |
| [Creator Success](#creator-success-get-paid-to-make-games)     | Game developers and small studios starting a new Decentraland game  | Staged funding in USD as you build and release the game       |
| [Wearables and emotes](#sell-wearables-and-emotes)             | 3D artists and animators                                            | MANA from each sale in the Marketplace, plus resale royalties |
| [Payments in your scene](#accept-payments-in-your-scene)       | Scenes with optional paid extras                                    | Crypto sent by players from inside the scene                  |

## Creator Fund: get rewarded for player activity

The **Creator Fund** rewards creators whose published experiences attract and keep real players. Each Cycle, a fixed pool is shared among the enrolled experiences in proportion to the activity they generate. You don't apply with a pitch or a plan: you publish a scene, join the program, and your scene starts earning based on how players use it.

* **What it pays:** the Beta Season runs from November 15 to December 31, 2026, with a Season Pool of USD 30,000 split over three Cycles. Each month has two reward Cycles.
* **What counts:** scenes in Genesis City and public Worlds owned by your wallet. Rewards are driven by the new Decentraland players you bring in, active playtime, and players who come back in the days after their first visit.
* **How to join:** open the **Earn** tab in [Creator Hub](https://decentraland.org/download/creator-hub) and sign the Program Terms with the wallet that owns your LAND or NAME. Opt-in opens on November 11, 2026. Every eligible scene you own is enrolled automatically, and scenes you publish later join too.
* **How you get paid:** in USDC, within 14 days after each Cycle ends, to the Payout Wallet you set in Creator Hub. Payout Wallet setup opens in Creator Hub on November 25, 2026. Creator Hub also shows your scenes' metrics during the Cycle and a leaderboard of the top experiences.

Read the full eligibility rules, the Cycle dates and the payout process in [Creator Fund: Program Rules](../creator-fund/program-rules.md).

## Creator Success: get paid to make games

**Creator Success** is a guided pathway into paid game development for individual developers and small indie studios. Instead of competing for a prize with a finished game, you work through a structured process with the Foundation: shape the idea, prove you can build it, get funded to test it with real players, and work towards a live release.

* **What it pays:** funding comes in stages. V0, a small vertical slice of your game, is funded at USD 1,000. If it works, V1 turns it into the first complete playable version over four weeks, funded at USD 3,100. Games that show strong retention can then be considered for V2 at USD 2,800, and V3 after that.
* **What we look for:** high-retention social games with a clear game loop, meaningful social play and a reason for players to return day after day.
* **How to apply:** play the Featured games, build a first scene with Creator Hub, write a short Game Design Document, publish a small test scene to your own World and submit your repository through the V0 application form. The first round of V0 applications is open until November 30, 2026, and applications are reviewed weekly. You must be over 18 to apply.

Follow the six application steps in [Creator Success: Get Paid To Make Games](../studio-onboarding.md).

The two programs are separate, and you can take part in both. A game you build through Creator Success is published to a World or LAND you own, so once it is live it can also be enrolled in the Creator Fund if it meets the [eligibility rules](../creator-fund/program-rules.md#who-can-take-part).

## Sell wearables and emotes

Wearables are items of clothing and accessories that avatars wear. Emotes are animations that avatars perform. Both are sold as NFTs in the Decentraland [Marketplace](https://decentraland.org/marketplace), and 3D artists and animators earn MANA from every sale.

The path from an idea to a sale looks like this:

1. **Model or animate the item.** Build it in Blender or your preferred 3D tool, following the avatar system and the size limits. See [Creating Wearables](../wearables-and-emotes/wearables/creating-wearables.md) and [Creating Emotes](../wearables-and-emotes/emotes/creating-emotes.md). The [Wearable Tutorial Series](../tutorials/creating-a-wearable-series.md) and the [Emote Videos](../tutorials/video-emotes.md) walk through the whole process on video.
2. **Create a collection and upload your items.** Collections group your items and set their rarity, which is how many copies can ever be minted. See [Creating a Collection](../wearables-and-emotes/manage-collections/creating-a-collection.md), [Uploading Wearables](../wearables-and-emotes/manage-collections/uploading-wearables.md) and [Uploading Emotes](../wearables-and-emotes/manage-collections/uploading-emotes.md).
3. **Publish the collection.** Publishing has a fee per item, currently 25 USD, of which the Decentraland Foundation covers 20 USD for a limited time, so you pay 5 USD per item in MANA. The Curation Committee then reviews your items. See [Publishing Collections](../wearables-and-emotes/publishing/publishing-collections.md) and the [Curation Committee](../wearables-and-emotes/publishing/curation-committee.md).
4. **Put your items on sale.** Once approved, set a price for each item. The store mints a copy automatically every time someone buys one, and sends the MANA to your beneficiary address. Primary sales carry a 2.5% fee that goes to the Decentraland DAO. When a buyer resells your item in the Marketplace, you receive royalties. See [Selling Items](../wearables-and-emotes/publishing/publishing-collections.md#selling-items).

If you also write code, a wearable can carry gameplay with it: a [smart wearable](../sdk7/projects/smart-wearables.md) runs a scene whenever a player puts it on, so a jetpack can fly or a fishing rod can fish anywhere in Genesis City.

## Accept payments in your scene

A scene can ask a player to pay from inside the experience. Using the SDK, your scene can read the player's wallet, call smart contracts and trigger a transaction in MANA or any other token, for example to sell an entry ticket, an upgrade or an in-game item. See [Scene Blockchain Operations](../sdk7/blockchain/scene-blockchain-operations.md) to get started. Transactions on [Polygon](../sdk7/blockchain/second-layer.md) are faster and cheaper than on Ethereum mainnet, and you can run your own [transactions server](../sdk7/blockchain/deploying-your-own-transactions-server.md) to cover gas for your players.

{% hint style="warning" %}
**📔 Note**: Most players don't have a wallet with funds ready to spend. Many play as guests, and players who do have an account often hold no tokens, so a payment prompt is a dead end for them. Design payments as optional extras, never as the only way to play, and check `isGuest` from [player data](../sdk7/interactivity/user-data.md#get-player-data) before offering them. For a steady income from your scene, lean on the Creator Fund and Creator Success above.
{% endhint %}

If what you want is to hand out items rather than sell them, the [Rewards](../rewards/overview.md) service lets a scene give wearables and emotes to players, for example as prizes in a game.
