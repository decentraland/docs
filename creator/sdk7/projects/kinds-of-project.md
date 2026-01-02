---
description: The available kinds of projects you can create in Decentraland.
---

# Kinds of Project

There are different types of content that you can make for Decentraland.

![](../../../.gitbook/assets/content-types.png)

### Scenes

Decentraland scenes can either be hosted in Parcels in Genesis City or in WORLDs.

#### Publish to LAND

Scenes that are published to Parcels can be found at specific coordinates inside Decentraland's open world.

These scenes are linked ot LAND ore Estate tokens. Each parcel takes up 16x16 meters. Multiple adjacent parcels can be used up by a single scene, these can be arranged into any shape, as long as the borders touch.

LAND tokens can be bought in the [Marketplace](https://decentraland.org/marketplace/lands). There's a limited supply of them, covering the map of Genesis City.

Scenes published to LAND are easier to discover, as players may run into them while visiting nearby content or exploring.

Scenes published to LAND can use up to 15 MB of space per each parcel in the scene. The more parcels, the more room available. This is to prevent overloading the player's CPU, since players may be experiencing many nearby scenes at the same time. See [size limitations](../sdk7/optimizing/scene-limitations.md).

#### Publish to WORLDs

Scenes published to a World must be accessed via a link.

These scenes are linked to NAME tokens. NAME tokens can be bought in the [Marketplace](https://decentraland.org/marketplace/names/claim). You can claim any name you want as long as it's not claimed yet. Alternatively, you can use an [ENS domain](https://ens.domains) to create a World.

Scenes published to a World have no parcel limitations and can have as many parcels of land as you wish. The same [size limitations](../sdk7/optimizing/scene-limitations.md) per parcel apply as in scenes published to LAND parcels, but you can add more parcels to your scene without any cost.

##### Size Limits

The maximum file size you can upload to your World depends on whether you're using a Decentraland NAME or an ENS domain.

**Worlds from Decentraland NAMEs**

Decentraland NAME holders enjoy dynamic storage capacity within the Foundation Worlds Content Server, which depends on their wallet holdings. The following rules govern this allocation:

* Each Decentraland NAME you own grants 100 MB of storage capacity (as well as a World).
* Each Decentraland LAND parcel you own grants an additional 100 MB of storage capacity.
* For every 2,000 MANA held in your wallet, an additional 100 MB of storage capacity is granted.

The space in the Foundation Worlds Content Server can be used to host scenes as large as users want, utilizing the Decentraland NAMEs they own and the combined space granted by their collective Decentraland assets. For instance, a user with multiple Worlds (granted by owning multiple NAMES) and a combined storage capacity of 500 MB can choose to deploy one World with a 200 MB scene file, another with a 200 MB scene file, and a third with a 100 MB scene file. Alternatively, they could opt to deploy one World with a 300 MB scene file and another with a 200 MB scene file.

The maximum server storage capacity for your Decentraland Worlds is calculated dynamically, adhering to the rules outlined above. If, by any chance, a user exceeds their allocated storage space—for instance, through asset sales or transfers to another wallet—they will be provided with a 24-hour window to address the situation. Failure to do so will result in their Worlds becoming inaccessible after this grace period.

To regain access to a blocked World, users can either acquire more MANA, Decentraland NAMEs, or LANDS, increasing their storage capacity or un-deploy existing scenes from the World Content Server to free up their storage space.

**Worlds from ENS Domains**

In contrast, Worlds granted from ENS domains have a fixed maximum scene file size of 36 MB per World, regardless of the user's other Decentraland holdings. Users with Worlds from ENS domains cannot increase their ENS World scene size limit by purchasing additional MANA or LAND.

However, Worlds granted by ENS domain ownership serve as the perfect first step into realizing the creative freedom offered by Decentraland.

##### Differences from LAND Scenes

Worlds offer several advantages over LAND scenes:

* No parcel limitations - you can create scenes of any size
* Access via link - players can visit your World directly via URL
* More storage capacity - especially for Decentraland NAME holders
* Access control - you can allow only certain players to access your World

See [Worlds](../worlds/about.md) for more info, or learn about [publishing to Worlds](../sdk7/publishing/publishing.md#publishing-to-worlds) and [configuring World settings](../sdk7/projects/scene-metadata.md#world-configuration).

### Global Scenes

Global scenes can transform the already existing landscape of Decentraland, adding layers of interactivity and gameplay. These are scenes that are not constrained to only run on certain parcels of LAND or certain Worlds. Players carry them with them wherever they go.

<!-- #### Portable Experiences

A portable experience is linked to a NAME token. NAME tokens can be bought in the [Marketplace](https://decentraland.org/marketplace/names/claim). You can claim any name you want as long as it's not claimed yet.

{% hint style="warning" %}
**📔 Note**: If a NAME token is assigned to a World, it can't also be used for a Portable Experience. Prior content will be overwritten.
{% endhint %}

Portable experiences can be activated as part of the interactive code of a scene (either in LAND or a World).

Players are prompted asking if they want to run this portable experience, and if they do they'll carry it with them wherever they go for the rest of their session. [Learn more](../sdk7/projects/portable-experiences.md). -->

#### Smart Wearables

Smart wearables are linked to Wearable tokens. These are sold as NFTs and purchased in the [Marketplace](https://decentraland.org/marketplace/browse?section=wearables\&vendor=decentraland\&page=1\&sortBy=newest\&status=on_sale).

Smart Wearables are activated whenever the player puts on the associated wearable item. They are turned off if the player takes off the item, or they can also turn off the global scene manually via the UI. Also, the scene that the player is standing in is able to suspend any Smart Wearables that are active in the scene.

* Learn everything about [Creating wearables](../wearables-and-emotes/wearables/creating-wearables.md).
* Learn about [smart wearables](../sdk7/projects/smart-wearables.md)
