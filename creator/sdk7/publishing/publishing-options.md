---
description: How to get Decentraland World or LAND permissions to publish your scene
---

To invite others to visit a scene you built, you'll need to publish it in Decentraland. To do this, you'll need to have deploy permissions to a Decentraland World or own parcels of Decentraland LAND.

This document gives an overview on the different ways to obtain permissions. See [publishing](publishing.md) for instructions on how to publish once you've obtained these.

## About Decentraland Worlds

Decentraland Worlds are your own personal 3D space in the Decentraland ecosystem, separate from Genesis City's public map of LAND parcels.

A World can be kept private or shared with anyone with just a link. Able to host up to 100 concurrent users, you can use your World to:

- Host events
- Build new experiences
- Share a portfolio of scenes
- Test scenes before deploying them to Genesis City LAND

## How to get a World

There are two ways to get a Decentraland World:

- **Get a Decentraland NAME (recommended).**  
  You can get your own Decentraland World by getting a [Decentraland NAME](https://builder.decentraland.org/names), which are NAME NFTs within the DCL ecosystem. A NAME costs 100 MANA and immediately gives you a World with that name. You can [buy a new NAME](https://decentraland.org/shop/items?category=names) or buy an existing one from a previous owner in the [Marketplace](https://decentraland.org/marketplace/names).

- **Buy an ENS domain.**  
  You can also get a World by buying an [ENS domain](https://ens.domains/), a decentralized name that can be used across both Web2 & 3.

Once you have a NAME or ENS domain, you can publish scenes to that World using the standard [Publishing](publishing.md) flow.  
You can also let others publish on to your Decentraland World. Check the [Managing Worlds documentation](../../scene-editor/publish/publish-scene.md#managing-worlds) to learn more about Multi Scene Worlds and other topics like Private Worlds.

## World Storage Capacity

Inside a World, you're allowed to use as many parcels as you want. For Decentraland NAME holders, the size limit of your scene in MegaBytes depends on how many NAMES, MANA, and LAND parcels you own. See [Worlds size limits](../projects/kinds-of-project.md#size-limits) for detailed information on how storage capacity is calculated.

You can check your used and remaining storage budget in the **Manage** section of the Creator Hub, or in the **Worlds** tab of the [Builder](https://decentraland.org/builder/worlds).

## Learn more about Worlds

- [Worlds as a project type](../projects/kinds-of-project.md#publish-to-worlds) - Learn about size limits and how Worlds differ from LAND scenes
- [Publishing to Worlds](publishing.md#publishing-to-worlds) - Step-by-step publishing instructions
- [World configuration](../projects/scene-metadata.md#world-configuration) - Configure skybox, communication settings, and more
- [Managing Worlds](../../scene-editor/get-started/manage-scenes.md#managing-worlds) - Visualize storage space and manage deployments
- [World FAQs](../../scene-editor/faq/README.md) - Common questions about Worlds

## Publishing to Decentraland LAND

Genesis City is Decentraland’s shared space: the large public map made up of LAND parcels. Each LAND parcel is **16 metres × 16 metres**. A scene can be built across one or more parcels.

If you prefer to publish to LAND, there are three options:

- **Rent LAND**: Purchase the right to deploy and keep your content on certain parcels for a fixed period of time. See [Rentals](https://docs.decentraland.org/player/marketplace/rentals/).
- **Buy land**: Buy land parcels, and publish your content for as long as you wish. See [marketplace](https://docs.decentraland.org/player/marketplace/marketplace/).
- **Get permissions from an owner**: Several land owners and districts manage large extensions of land and are willing to freely host content from others if it fits their theme and the kind of environment they want to create. Connect with them in the [Decentraland Discord server](https://dcl.gg/discord).

## How LAND permissions work

LAND tokens can manage permissions that allow the following different kinds of roles to deploy to a particular parcel or estate.

- **LAND owner**: The person that owns the token in their Ethereum wallet. This user can always deploy, assign other roles, or transfer the token (unless the land is currently rented by someone else).
- **LAND operator**: The operator is only able to deploy, as long as they hold this role. The operator's address is referenced by the token, without needing to own anything. The owner can assign and revoke operator permissions to any number of addresses. See [Give permissions](https://docs.decentraland.org/player/marketplace/land-manager/#give-permissions).

When renting a land, the tenant who pays for the rent gets to chose a single address that will hold a **LAND Operator** role for the duration of the rent (this can be their own address, or someone else's). While the rent is active, none of the original holders of roles can interfere with the content on that LAND or transfer the token.

## How to publish your scene

When you have obtained your World or LAND permissions, follow the standard [Publishing guide](publishing.md) to deploy your scene.
