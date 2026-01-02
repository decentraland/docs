---
description: How to obtain LAND or permissions to publish your scene
---

# Publishing Options

To invite others to visit a scene you built, you'll need to publish it in Decentraland. To do this, you'll need to have deploy permissions to Decentraland parcels or own a Decentraland name in order to deploy to a Decentraland World.

Decentraland is made up of _parcels_ of LAND, each 16 meters by 16 meters. A _scene_ is an experience that is built on one or several parcels.

This document gives an overview on the different ways to obtain permissions. See [publishing](publishing.md) for instructions on how to publish once you've obtained these.

### LAND permission options

In order to publish to LAND in Genesis City, you can do the following:

* **Rent LAND**: Purchase the right to deploy and keep your content on certain parcels for a fixed period of time. See [Rentals](../../marketplace/rentals.md).
* **Buy land**: Buy land parcels, and publish your content for as long as you wish. See [marketplace](../../marketplace/marketplace.md).
* **Get permissions from an owner**: Several land owners and districts manage large extensions of land and are willing to freely host content from others if it fits their theme and the kind of environment they want to create. Connect with them in the [Decentraland Discord server](https://dcl.gg/discord).
* **Worlds**: You can also deploy a stand-alone scene as a Decentraland World. Worlds exist outside the grid of Genesis City, and can be accessed by name. See [worlds](../../worlds/about.md)

{% hint style="warning" %}
**📔 Note**: You can also deploy scenes to a test server where players are not around. The same permissions per parcel apply when deploying to the test server, see [publishing](publishing.md#the-test-server) for more details.
{% endhint %}

### Decentraland Worlds

If you own a Decentraland NAME or an ENS domain, you can publish your scene to a Decentraland World. This option costs considerably less than buying land—a Decentraland NAME costs 100 MANA.

#### Getting a Decentraland NAME

You can get your own Decentraland World by getting a [Decentraland NAME](https://builder.decentraland.org/names), which are NAME NFTs within the DCL ecosystem. Acquiring a Decentraland NAME requires 100 MANA and can be assigned to your avatar, LAND, or Estate. Alternatively, you can purchase an already-minted NAME from a previous owner in the [Marketplace](https://decentraland.org/marketplace/names).

#### Using an ENS Domain

You can also get a World by having an [ENS domain](https://ens.domains), a decentralized name that can be used across both Web2 & 3. Worlds granted from ENS domains have a fixed maximum scene file size of 36 MB per World, regardless of your other Decentraland holdings.

#### Storage Capacity

Inside a World, you're allowed to use as many parcels as you want. For Decentraland NAME holders, the size limit of your scene in MegaBytes depends on how many NAMES, MANA, and LAND parcels you own. See [Worlds size limits](../sdk7/projects/kinds-of-project.md#size-limits) for detailed information on how storage capacity is calculated.

Worlds serve as a gateway for aspiring content creators, providing an accessible entry point to creating in Decentraland and the freedom to experiment with scene creation.

See [Worlds](../../worlds/about.md) for an overview, or learn about [publishing to Worlds](publishing.md#publishing-to-worlds) for step-by-step instructions.

### Get DAO funding

If you have a great idea and the means to achieve it, but need financing, you can request for a grant in the DAO. If the proposal convinces enough people from the community to vote on it, you can get a sum of money to achieve your vision, including funds for buying or renting LAND.

See [Community grants](../../archive/grants/community-grants.md).

### How land permissions work

LAND tokens can manage permissions that allow the following different kinds of roles to deploy to a particular parcel or estate.

* **LAND owner**: The person that owns the token in their Ethereum wallet. This user can always deploy, assign other roles, or transfer the token (unless the land is currently rented by someone else).
* **LAND operator**: The operator is only able to deploy, as long as they hold this role. The operator's address is referenced by the token, without needing to own anything. The owner can assign and revoke operator permissions to any number of addresses. See [Give permissions](../../marketplace/land-manager.md#give-permissions).

When renting a land, the tennant who pays for the rent gets to chose a single address that will hold a **LAND Operator** role for the duration of the rent (this can be their own address, or someone else's). While the rent is active, none of the original holders of roles can interfere with the content on that LAND or transfer the token.
