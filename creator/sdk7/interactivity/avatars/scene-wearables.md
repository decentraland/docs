---
description: Dress the player's own avatar in a costume or uniform, using wearables from your scene's files or the catalog.
---

# Scene Wearables

Your scene can decide what the player's avatar wears while they're inside it: a team jersey, a costume for a themed party, a uniform for each role in a murder mystery. Write an `AvatarShape` component on the player's entity, and their real avatar changes its look. It keeps walking, jumping, gliding and playing emotes as usual. While they're in your scene, your outfit wins: changing clothes in the backpack doesn't undo it.

The wearables can be any catalog item, whether or not the player owns it, or `.glb` files that ship with your scene, with nothing to publish to the marketplace first. The player's profile never changes: once they leave your scene, they look like themselves again, and their backpack and passport always show their own outfit.

{% hint style="warning" %}
**📔 Note**: Scene wearables are supported in the Decentraland desktop explorer.
{% endhint %}

## Ask your AI assistant

If you use an AI coding assistant, install or update the [Decentraland SDK Skills](../../getting-started/vibe-coding.md). The `player-avatar` skill covers dressing players, so you can describe the outfit and let the assistant write the code, for example:

> Dress every player in my scene in the team jersey from `assets/wearables/jersey/`, with short hair, brown pants and classic shoes from the base avatar catalog. Use the male or female model depending on each player's body shape.

## Dress the player

List everything the player should wear in `wearables`. Each item is either a wearable URN or the path to a `.glb` file in your scene:

```ts
import { AvatarShape, engine } from '@dcl/sdk/ecs'

const BASE = 'urn:decentraland:off-chain:base-avatars:'

export function main() {
	AvatarShape.createOrReplace(engine.PlayerEntity, {
		id: '', // id and emotes are required by the type, but ignored on players
		emotes: [],
		wearables: [
			BASE + 'short_hair',
			BASE + 'brown_pants',
			BASE + 'classic_shoes',
			'assets/wearables/jersey/jersey_upper_body.glb',
		],
	})
}
```

That's all it takes. The outfit applies as soon as the avatar is ready, comes off when the player walks out of your scene, and comes back when they return, without writing the component again.

{% hint style="info" %}
**💡 Tip**: A list of wearables replaces the player's **whole** outfit. Every category you leave out stays empty: no hair, bare legs, bare feet. The face shows the default eyes, eyebrows and mouth, not the player's own; to choose them, add face items from the catalog, like `eyes_00`, `eyebrows_00` and `mouth_00` from the base avatars. List each category you want filled, or [add your items on top of the player's outfit](#add-items-on-top-of-the-players-outfit) instead.
{% endhint %}

## Wearables from your scene files

A `.glb` file in your scene's folder works as a wearable, with no upload or approval:

* **Name the file `<name>_<category>.glb`**, for example `jersey_upper_body.glb` or `crown_tiara.glb`. When several categories match the end of the name, the longest one wins, so `beard_facial_hair.glb` is `facial_hair`, not `hair`.
* **Valid categories**: `upper_body`, `lower_body`, `feet`, `hands_wear`, `hat`, `helmet`, `top_head`, `mask`, `eyewear`, `earring`, `tiara`, `hair`, `facial_hair` and `skin`. Eyes, eyebrows and mouth are textures, not models, so they can't be scene wearables.
* **Write the path from your project's root folder**, as in `assets/wearables/jersey/jersey_upper_body.glb`, with forward slashes and no leading `./` or `/`. Letter case doesn't matter, `.GLB` included. Full URLs and paths with backslashes, a `?query` or a trailing space are skipped.
* **Keep each wearable in its own folder**, together with its textures. Only files in the same folder as the `.glb` are loaded with it, not files in subfolders. For color variants, export a separate `.glb` per variant.
* **Model it like any other wearable**, rigged to the Decentraland avatar armature. See [Creating Wearables](../../../wearables-and-emotes/wearables/creating-wearables.md#building-3d-models-for-wearables). An `upper_body` item keeps the avatar's own hands visible, so don't model hands into it.
* **Hair and skin colors** apply as on catalog items: any material whose name contains `hair` or `skin`, in any letter case, takes the player's hair or skin color, even one named `Chair` or `Skinny_Jeans`.

A scene wearable is always visible: nothing hides it, except a later item of the same category, which replaces it. A catalog helmet that normally hides the hair doesn't hide your scene's hair, and catalog dungarees that cover the legs don't hide a scene kilt: both show. A scene wearable doesn't hide anything either, so a scene hat doesn't hide the hair: leave hair out of the list, or ship a short `_hair.glb` that fits under the hat. The exception is `skin`: like a catalog skin, it hides the hair, upper and lower body, feet, hands wear and facial hair, catalog and profile items included, and only your scene wearables still show over it. Catalog URNs in the list keep their usual hiding rules.

The same `.glb` is used on both body shapes. If you have a separate model for each, pick one by the player's body shape, as in the [example below](#example-team-jerseys-for-every-player).

## Add items on top of the player's outfit

To keep what the player wears and add a scene item, start from the profile's list in `AvatarEquippedData` and append your item. Put it **last**: of two items in the same category, the later one is used.

Read the list in a system, which also catches the outfit the player already wears when the scene starts, and write `AvatarShape` only when the list changes:

```ts
import { AvatarEquippedData, AvatarShape, engine } from '@dcl/sdk/ecs'

const CROWN = 'assets/wearables/crown/crown_tiara.glb'
let writtenKey = ''

export function main() {
	engine.addSystem(() => {
		const equipped = AvatarEquippedData.getOrNull(engine.PlayerEntity)
		if (!equipped) return // profile not loaded yet

		// Changes when the player changes their outfit in the backpack
		const key = equipped.wearableUrns.join()
		if (key === writtenKey) return
		writtenKey = key
		AvatarShape.createOrReplace(engine.PlayerEntity, {
			id: '',
			emotes: [],
			wearables: [...equipped.wearableUrns, CROWN],
		})
	})
}
```

The crown replaces the player's own tiara, if they wear one. Profile items of other categories stay and can overlap your item, as described [above](#wearables-from-your-scene-files). When the scene's look must win outright, list the whole outfit instead.

## Take the outfit off

Delete the component to bring back the player's own look:

```ts
AvatarShape.deleteFrom(engine.PlayerEntity)
```

Writing an `AvatarShape` that sets nothing (an empty `wearables` list and no colors, body shape or `showOnlyWearables`) does the same. The current look stays until the profile's items have loaded, so the player never shows up bare in between.

## Dress other players

You can write `AvatarShape` on any player's entity, not only `engine.PlayerEntity`. Find the other players through their [`PlayerIdentityData`](../user-data.md#player-data-components) component.

The outfit is **local to each client**. It's never sent to other players: each player sees the outfits that their own copy of your scene writes.

* If the outfit follows from data that every client can read, like a body shape or a wallet address, every copy of the scene reaches the same result and everyone sees the same outfits. The example below works this way.
* If players choose their own outfits, your scene must sync each player's choice, and every client dresses every player from the synced state. For a simple case, each client can store its own player's choice on an entity it syncs with `syncEntity`, see [Serverless multiplayer](../../networking/serverless-multiplayer.md). When choices must be validated, so that nobody can cheat, keep them on an [authoritative server](../../networking/authoritative-servers.md), as the [`4,25-scene-wearables`](https://github.com/decentraland/sdk7-test-scenes/tree/main/scenes/4,25-scene-wearables) test scene does.

An outfit shows only while the viewer stands in your scene, and only on players who are inside it too. A player who walks out keeps the `AvatarShape` on their entity and wears the outfit again when they come back, with no new write. A player who disconnects doesn't pass it on: when they reconnect, or someone new joins, they show their own look until your scene dresses them.

## Example: team jerseys for every player

This system dresses every player in the scene in a red or a blue jersey, picked from their wallet address, so all clients agree without syncing anything. Each jersey has a male and a female model, chosen by the player's body shape, and the rest of the outfit is shared. It runs on every frame, but writes `AvatarShape` only when a player's jersey changes.

```ts
import { AvatarBase, AvatarShape, engine, Entity, PlayerIdentityData } from '@dcl/sdk/ecs'

const BASE = 'urn:decentraland:off-chain:base-avatars:'
const SHARED = [BASE + 'short_hair', BASE + 'brown_pants', BASE + 'classic_shoes']
const JERSEYS = {
	red: {
		male: 'assets/wearables/red_jersey/red_jersey_m_upper_body.glb',
		female: 'assets/wearables/red_jersey/red_jersey_f_upper_body.glb',
	},
	blue: {
		male: 'assets/wearables/blue_jersey/blue_jersey_m_upper_body.glb',
		female: 'assets/wearables/blue_jersey/blue_jersey_f_upper_body.glb',
	},
}

// The jersey each player entity was last dressed in
const written = new Map<Entity, string>()

export function main() {
	engine.addSystem(() => {
		// Forget players that left, so the map doesn't grow
		for (const player of written.keys()) {
			if (!PlayerIdentityData.has(player)) written.delete(player)
		}

		for (const [player, identity] of engine.getEntitiesWith(PlayerIdentityData)) {
			const avatar = AvatarBase.getOrNull(player)
			if (!avatar) continue // profile not loaded yet

			const team = parseInt(identity.address.slice(-1), 16) % 2 === 0 ? JERSEYS.red : JERSEYS.blue
			const jersey = avatar.bodyShapeUrn.toLowerCase().endsWith(':basefemale') ? team.female : team.male

			// The rest of the outfit never changes, so the jersey alone tells whether to write
			if (written.get(player) === jersey) continue
			written.set(player, jersey)
			AvatarShape.createOrReplace(player, { id: '', emotes: [], wearables: [...SHARED, jersey] })
		}
	})
}
```

`AvatarBase.bodyShapeUrn` is the body shape from the player's profile. If your scene also sets `bodyShape`, pick the models for the body you set instead.

## Read what the player wears

`AvatarEquippedData.wearables` tells you which items of the player's profile outfit are actually visible, after other items hide or replace them. It has one entry per item of `wearableUrns`, in the same order, each with the item's `urn` and a `visible` flag.

```ts
import { AvatarEquippedData, engine } from '@dcl/sdk/ecs'

function logOutfit() {
	const equipped = AvatarEquippedData.getOrNull(engine.PlayerEntity)
	if (!equipped) return
	for (const { urn, visible } of equipped.wearables) {
		console.log(urn, visible === undefined ? 'still loading' : visible ? 'visible' : 'hidden')
	}
}

export function main() {
	logOutfit() // the outfit the player wears when the scene starts
	AvatarEquippedData.onChange(engine.PlayerEntity, logOutfit) // and every change after that
}
```

* `visible` is `true` when the item shows, and `false` when another item hides it, a later item of the same category replaces it, or the item's metadata failed to load. A model that fails to load after its metadata loaded still reads `true`.
* `visible` is unset on every entry until the metadata of every item has loaded, then the component changes again with the flags. If that takes longer than a minute, the flags stay unset until the player changes their outfit.
* The list describes the player's **profile** outfit. An `AvatarShape` written by your scene doesn't change it, and scene wearables never appear in it. The same goes for `AvatarBase`.
* It's available for other players too, on their entities.
* `wearables` is a required field. Code that builds `AvatarEquippedData` itself, for example a mock in a test, must include `wearables: []`.

## How the fields apply on a player

On a player's entity, `AvatarShape` changes only what you set. Any field you leave out keeps the value from the player's profile.

* `wearables`: a non-empty list replaces the whole outfit, as in [Dress the player](#dress-the-player). An **empty** list keeps the profile wearables, so you can change the colors or body shape alone. Up to 32 items are used.
* `bodyShape`: `urn:decentraland:off-chain:base-avatars:BaseMale` or `urn:decentraland:off-chain:base-avatars:BaseFemale`, written exactly like this. Any other value, including a different letter case, gives the male body.
* `skinColor`, `hairColor`, `eyeColor`: each one applies on its own when set.
* `showOnlyWearables`: `true` hides the skin, hair and face, leaving only the wearables.
* `id`, `name`, `emotes`, `expressionTriggerId`, `expressionTriggerTimestamp` and `talking` are **ignored** on players. The nametag always shows the player's own name. To show a role or a team, add an [Avatar Nametag](avatar-nametags.md); to hide names, use an [Avatar Modifier Area](modifier-areas.md#hide-nametags). To play an emote on the player, use [`triggerEmote()`](avatar-animations.md#default-animations).

To change the look without touching the outfit, pass an empty `wearables` list:

```ts
import { AvatarShape, engine } from '@dcl/sdk/ecs'
import { Color3 } from '@dcl/sdk/math'

AvatarShape.createOrReplace(engine.PlayerEntity, {
	id: '',
	emotes: [],
	wearables: [], // keep the profile wearables
	skinColor: Color3.create(0.3, 0.8, 0.3),
	hairColor: Color3.Red(),
	bodyShape: 'urn:decentraland:off-chain:base-avatars:BaseMale',
})
```

## Details

| Case | What happens |
| ---- | ------------ |
| Writing the component | Writing the same values again does nothing. Any real change, even one color, reloads all of the avatar's wearables, and the new look appears once every item has loaded. Write only when the outfit changes, and don't animate colors. |
| Two items of the same category | The later one in the list is used, and the earlier one neither shows nor hides anything. NPCs work the same way. |
| Skipped entries | An entry that is neither a URN nor a path ending in `.glb`, a path in a form described [above](#wearables-from-your-scene-files) as skipped, a file name without a valid `_<category>.glb` ending, or a file that isn't in your scene. Each one logs a warning, and the rest of the list still applies. If every entry is skipped, the list counts as empty. |
| Items that fail to load | A catalog URN that doesn't exist, or a scene file that fails to load, isn't shown, but it still counts as part of the list, so the categories you left out stay empty. |
| Right after deploying | A deployed scene loads its wearables from its processed assets. If the scene loaded before asset processing finished, its `.glb` items are skipped until the scene is loaded again. Local preview loads the files directly, so a working preview doesn't prove the deployed scene works: check it after deploying too. |
| Profile items the player forced to show | Not kept whenever your `wearables` list isn't empty, including when you add on top of `wearableUrns`. Kept when you only set colors or the body shape. |
| Several scenes | Only the scene that the local player stands in applies its outfits. Portable experiences and smart wearables can't dress players. |
| NPCs | They accept the same `.glb` paths in their `wearables`. See [NPC Avatars](npc-avatars.md). |

{% hint style="info" %}
**💡 Tip**: For a working example, see the [`4,25-scene-wearables`](https://github.com/decentraland/sdk7-test-scenes/tree/main/scenes/4,25-scene-wearables) test scene, which dresses the player and an NPC from a UI panel, either locally or synced to everyone through an authoritative server, and shows the edge cases above side by side.
{% endhint %}

## Related pages

* [NPC Avatars](npc-avatars.md): show avatars that aren't players, with the same `AvatarShape` component.
* [Avatar Nametags](avatar-nametags.md): show a role or team above a player's name.
* [Avatar Modifier Areas](modifier-areas.md): hide avatars or nametags inside a region of the scene.
* [Get player data](../user-data.md): read the player's profile, body shape and equipped wearables.
* [Creating Wearables](../../../wearables-and-emotes/wearables/creating-wearables.md): model and rig a wearable.
