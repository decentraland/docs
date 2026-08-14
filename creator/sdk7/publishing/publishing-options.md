---
description: How to obtain LAND or permissions to publish your scene
---

# Publishing Options

To invite others to visit a scene you built, you'll need to publish it in Decentraland. To do this, you'll need to have deploy permissions to Decentraland parcels or own a Decentraland name in order to deploy to a Decentraland World.

Decentraland is made up of _parcels_ of LAND, each 16 meters by 16 meters. A _scene_ is an experience that is built on one or several parcels.

This document gives an overview on the different ways to obtain permissions. See [publishing](publishing.md) for instructions on how to publish once you've obtained these.

## LAND permission options

In order to publish to LAND in Genesis City, you can do the following:

* **Rent LAND**: Purchase the right to deploy and keep your content on certain parcels for a fixed period of time. See [Rentals](https://docs.decentraland.org/player/marketplace/rentals/).
* **Buy land**: Buy land parcels, and publish your content for as long as you wish. See [marketplace](https://docs.decentraland.org/player/marketplace/marketplace/).
* **Get permissions from an owner**: Several land owners and districts manage large extensions of land and are willing to freely host content from others if it fits their theme and the kind of environment they want to create. Connect with them in the [Decentraland Discord server](https://dcl.gg/discord).
* **Worlds**: You can also deploy a stand-alone scene as a Decentraland World. Worlds exist outside the grid of Genesis City, and can be accessed by name. See [Decentraland Worlds](#decentraland-worlds) below.

## Decentraland Worlds

Decentraland Worlds are your own personal 3D space in the Decentraland ecosystem, separate from Genesis City's map of LAND parcels. A World can be kept private or shared with anyone with just a link. Able to host up to 100 concurrent users, you can use your World for purposes such as:

* Hosting events
* Unleashing your creativity
* Building new experiences
* Hosting a portfolio of scenes
* Testing scenes before deploying them to Genesis City

If you own a Decentraland NAME or an ENS domain, you can publish your scene and let others publish on to your Decentraland World. Check the [Managing Worlds documentation](../../scene-editor/publish/publish-scene.md#managing-worlds) to learn more about Multi Scene Worlds and other topics like Private Worlds.

{% hint style="info" %}
**📔 Note**: This option costs considerably less than buying land—a Decentraland NAME costs 100 MANA.
{% endhint %}

### Getting a Decentraland NAME

You can get your own Decentraland World by getting a [Decentraland NAME](https://builder.decentraland.org/names), which are NAME NFTs within the DCL ecosystem. Acquiring a Decentraland NAME requires 100 MANA and can be assigned to your avatar, LAND, or Estate. Alternatively, you can purchase an already-minted NAME from a previous owner in the [Marketplace](https://decentraland.org/marketplace/names).

### Using an ENS Domain

You can also get a World by having an [ENS domain](https://ens.domains), a decentralized name that can be used across both Web2 & 3. Worlds granted from ENS domains have a fixed maximum scene file size of 36 MB per World, regardless of your other Decentraland holdings.

### Storage Capacity

Inside a World, you're allowed to use as many parcels as you want. For Decentraland NAME holders, the size limit of your scene in MegaBytes depends on how many NAMES, MANA, and LAND parcels you own. See [Worlds size limits](../projects/kinds-of-project.md#size-limits) for detailed information on how storage capacity is calculated.

You can check your used and remaining storage budget in the **Manage** section of the Creator Hub, or in the **Worlds** tab of the [Builder](https://decentraland.org/builder/worlds).

Worlds serve as a gateway for aspiring content creators, providing an accessible entry point to creating in Decentraland and the freedom to experiment with scene creation.

### Learn more about Worlds

* [Worlds as a project type](../projects/kinds-of-project.md#publish-to-worlds) - Learn about size limits and how Worlds differ from LAND scenes
* [Publishing to Worlds](publishing.md#publishing-to-worlds) - Step-by-step publishing instructions
* [World configuration](../projects/scene-metadata.md#world-configuration) - Configure skybox, communication settings, and more
* [Managing Worlds](../../scene-editor/get-started/manage-scenes.md#managing-worlds) - Visualize storage space and manage deployments
* [World FAQs](../../scene-editor/faq/README.md) - Common questions about Worlds

## Get DAO funding

If you have a great idea and the means to achieve it, but need financing, you can request for a grant in the DAO. If the proposal convinces enough people from the community to vote on it, you can get a sum of money to achieve your vision, including funds for buying or renting LAND.

See the [Decentraland DAO](https://decentraland.org/dao/) for how to submit a proposal.

## How land permissions work

LAND tokens can manage permissions that allow the following different kinds of roles to deploy to a particular parcel or estate.

* **LAND owner**: The person that owns the token in their Ethereum wallet. This user can always deploy, assign other roles, or transfer the token (unless the land is currently rented by someone else).
* **LAND operator**: The operator is only able to deploy, as long as they hold this role. The operator's address is referenced by the token, without needing to own anything. The owner can assign and revoke operator permissions to any number of addresses. See [Give permissions](https://docs.decentraland.org/player/marketplace/land-manager/#give-permissions).

When renting a land, the tennant who pays for the rent gets to chose a single address that will hold a **LAND Operator** role for the duration of the rent (this can be their own address, or someone else's). While the rent is active, none of the original holders of roles can interfere with the content on that LAND or transfer the token.
