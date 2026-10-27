---
description: Make the player's avatar play default or custom animations, and detect when an emote finishes
---

# Avatar Animations

You can make the player perform an animation as part of the scene's code. This can help provide more immersion, and it can also help communicate what other players are doing to each other. The avatar animations are seen both by the player (in 3rd person view) and any other players around.

Player-controlled animations that run on the full body are overridden by the default locomotion animations, like walking and jumping. So full-body animations played by the scene only play while the player is standing still. If the player walks or jumps, any full-body animations are interrupted. Upper-body animations don't get interrupted by movement.

{% hint style="warning" %}
**📔 Note**: Players can only be animated if they already are standing inside the scene's bounds, not if they are on a neighboring scene. Smart wearables can play animations anywhere.

While a player is performing an animation, they are not affected by collisions, and their movements aren't constrained by the scene's physics. Also note that if an animation displaces the player from their original position (for example, if the animation involves a jump), the player's Transform component will not be affected by this displacement.
{% endhint %}

### Use the Scene Editor

The easiest way to make a player perform an animation is to use the Scene Editor. Use the no-code **Play Emote** action to play a default animation, or the **Play Custom Emote** action to play an animation from a file. See [Make any item smart](../../../scene-editor/interactivity/make-any-item-smart.md).

### Default animations

Use the `triggerEmote()` function to run one of the default animations that players are able to play anywhere in Decentraland. This function takes an object with the following properties as an argument:

* `predefinedEmote`: A string name for an existing emote.
* `mask`: (optional) Play the animation on only part of the avatar's body, using a value from the `AvatarMask` enum. For example, `AvatarMask.AM_UPPER_BODY` animates only the avatar's upper body. See [Animate only the upper body](#animate-only-the-upper-body).

```ts
import { triggerEmote } from '~system/RestrictedActions'

const emoter = engine.addEntity()
Transform.create(emoter, { position: Vector3.create(8, 0, 8) })
MeshRenderer.setBox(emoter)
MeshCollider.setBox(emoter)
pointerEventsSystem.onPointerDown(
	{
		entity: emoter,
		opts: { button: InputAction.IA_POINTER, hoverText: 'Dance' },
	},
	() => {
		triggerEmote({ predefinedEmote: 'robot' })
	}
)
```

The following emotes show feedback about player actions in your scene, all of these are valid values for the `predefinedEmote` field:

* `buttonDown`
* `buttonFront`
* `getHit`
* `knockOut`
* `lever`
* `openChest`
* `openDoor`
* `punch`
* `push`
* `swingWeaponOneHand`
* `swingWeaponTwoHands`
* `throw`
* `sittingChair1`
* `sittingChair2`
* `sittingGround1`
* `sittingGround2`

The four `sitting` emotes loop: the avatar holds the pose until the player moves or your scene calls `stopEmote({})`. All the others play through once and the avatar returns to idle.

These emotes are available to all players in their default emote wheel, and can also be used in any scene.

* `wave`
* `fistpump`
* `robot`
* `raiseHand`
* `clap`
* `money`
* `kiss`
* `tik`
* `hammer`
* `tektonik`
* `dontsee`
* `handsair`
* `shrug`
* `disco`
* `dab`
* `headexplode`
* `crafting`
* `handsintheair`
* `Victory`
* `Waving`
* `fistpump_short`

{% hint style="warning" %}
**📔 Note**: Use these names exactly as listed. A wrong name fails silently in your scene: nothing plays and nothing appears in the scene console. Watch out for `handsintheair` with no separators, and `fistpump_short` with its suffix.
{% endhint %}

{% hint style="info" %}
**💡 Tip**: If a player walks or jumps while playing the animation, they will interrupt it. If you don't want that to be possible, you can freeze the avatar with [Input Modifiers](locomotion.md#freeze-the-player) for the duration of the avatar animation.
{% endhint %}

### Custom animations

Use the `triggerSceneEmote()` to make the player perform a custom animation, stored as a .glb file as part of the scene's asset.

{% hint style="info" %}
**💡 Tip**: You don't have to make these yourself. The **Avatar Animations** pack in the Scene Editor has 45 ready-made animations, including sitting poses, fishing, carrying a box and dancing. Drag one onto the 3D view and the editor copies its file into your scene, then pass that file's path to `triggerSceneEmote()`. Files land under `assets/asset-packs/<animation-folder>/`, for example `assets/asset-packs/whack/Whack_Avatar_emote.glb`. Check the exact path in **Local Assets**. See [Add items](../../../scene-editor/get-started/about-editor.md#avatar-animations).
{% endhint %}

{% hint style="warning" %}
**📔 Note**: The file's name **must** end in `_emote.glb` to work as an avatar animation.
{% endhint %}

This function takes an object with the following properties:

* `src`: The full path to the emote file, counted from your project's root folder. A file at `assets/animations/sit_emote.glb` needs `'assets/animations/sit_emote.glb'`.
* `loop`: If true, the animation will loop continuously until the player moves or the animation is stopped. False by default.
* `mask`: (optional) Play the animation on only part of the avatar's body, using a value from the `AvatarMask` enum. For example, `AvatarMask.AM_UPPER_BODY` animates only the avatar's upper body. See [Animate only the upper body](#animate-only-the-upper-body).

{% hint style="warning" %}
**📔 Note**: `src` must be the full path to the file. There is no search by file name, and the `_emote` suffix is not added for you. If the path is wrong, `triggerSceneEmote()` resolves to `{ success: false }` and nothing plays. Copy the path from your project folder and include every folder in it.
{% endhint %}

```ts
import { triggerSceneEmote } from '~system/RestrictedActions'
import { AvatarMask } from '@dcl/sdk/ecs'

const emoter = engine.addEntity()
Transform.create(emoter, { position: Vector3.create(8, 0, 8) })
MeshRenderer.setBox(emoter)
MeshCollider.setBox(emoter)
pointerEventsSystem.onPointerDown(
	{
		entity: emoter,
		opts: { button: InputAction.IA_POINTER, hoverText: 'Make snowball' },
	},
	() => {
		triggerSceneEmote({ src: 'assets/animations/Snowball_Throw_emote.glb', loop: false, mask: AvatarMask.AM_UPPER_BODY })
	}
)
```

{% hint style="info" %}
**💡 Tip**: If a player walks or jumps while playing the animation, they will interrupt it. If you don't want that to be possible, you can freeze the avatar with [Input Modifiers](locomotion.md#freeze-the-player) for the duration of the avatar animation.
{% endhint %}

#### Props, particles and sound

An emote file played with `triggerSceneEmote()` can include props, like a tennis racket or a jet of flames, animated together with the avatar. Build it the same way as an Emotes 2.0 emote, following the naming rules in [Props and Sounds](../../../wearables-and-emotes/emotes/props-and-sounds.md):

* The file contains two animation clips: one whose name includes `_Avatar` for the avatar, and one whose name includes `_Prop` for the prop armature.
* Both clips have the same length.
* Particle effects work if you convert them to animated bones, see [Particles in Emotes](../../../wearables-and-emotes/emotes/particles-in-emotes.md).

Other players around see the props, just like they see the avatar animation.

{% hint style="warning" %}
**📔 Note**: `triggerSceneEmote()` doesn't play sound. Audio only plays for emotes uploaded through the Builder. To pair a sound with a scene emote, play it with an [AudioSource](../../3d-essentials/sounds.md) at the same time.
{% endhint %}

### Animate only the upper body

Both `triggerEmote()` and `triggerSceneEmote()` accept an optional `mask` property, that limits the animation to only part of the avatar's body.

Normally, an animation stops as soon as the player walks or jumps, because the default locomotion animations take over the whole body. When you set `mask` to `AvatarMask.AM_UPPER_BODY`, the animation only drives the avatar from the waist up, and the legs remain controlled by the default locomotion animations. This means the player can keep walking or running around the scene while the upper body plays your animation. Use this for actions that shouldn't interrupt movement, like carrying a crate, holding a torch, or juggling.

```ts
import { triggerSceneEmote } from '~system/RestrictedActions'
import {
	engine,
	AvatarMask,
	InputAction,
	MeshCollider,
	MeshRenderer,
	pointerEventsSystem,
	Transform,
} from '@dcl/sdk/ecs'
import { Vector3 } from '@dcl/sdk/math'

const cheerButton = engine.addEntity()
Transform.create(cheerButton, { position: Vector3.create(8, 0, 8) })
MeshRenderer.setBox(cheerButton)
MeshCollider.setBox(cheerButton)
pointerEventsSystem.onPointerDown(
	{
		entity: cheerButton,
		opts: { button: InputAction.IA_POINTER, hoverText: 'Cheer' },
	},
	() => {
		triggerSceneEmote({
			src: 'assets/animations/Cheer_emote.glb',
			loop: true,
			mask: AvatarMask.AM_UPPER_BODY,
		})
	}
)
```

In this example, the player clicks a button and starts cheering with their arms in the air, in a looping animation. Since only the upper body is animated, they can keep running around the scene while they cheer, for example to follow the action in a race or a football match.

Some things to keep in mind:

* `AvatarMask.AM_UPPER_BODY` is currently the only value in the `AvatarMask` enum. To play an animation on the full body, simply don't set the `mask` property.
* The `loop` property behaves the same as with full-body animations: with `loop: false` the masked animation plays once and the upper body then returns to normal locomotion, with `loop: true` it repeats until stopped.
* To stop a looping masked animation from code, call `stopEmote({})`, also imported from `~system/RestrictedActions`.

### Detect when an emote finishes

Every emote lifecycle event is reported through the `AvatarEmoteCommand` component on the player entity. Each new entry carries a `state` field, with a value from the `EmoteState` enum:

* `EmoteState.ES_STARTED`: The emote started playing. This is also the value reported when the `state` field is absent.
* `EmoteState.ES_FINISHED`: A non-looping emote played through to its natural end.
* `EmoteState.ES_INTERRUPTED`: The emote was cut short: the player moved or jumped, teleported, another emote started, the emote was explicitly stopped, or the player left the scene.

This works for emotes triggered by the scene (`triggerEmote()` and `triggerSceneEmote()`) as well as emotes the player plays themselves through the emote wheel, and also for emotes played by other players in the scene.

Use the `onChange` function on the `AvatarEmoteCommand` component to react to each new entry:

```ts
import { AvatarEmoteCommand, EmoteState } from '@dcl/sdk/ecs'

export function main() {
	AvatarEmoteCommand.onChange(engine.PlayerEntity, (emote) => {
		if (!emote) return

		switch (emote.state ?? EmoteState.ES_STARTED) {
			case EmoteState.ES_STARTED:
				console.log('emote started: ', emote.emoteUrn)
				break
			case EmoteState.ES_FINISHED:
				console.log('emote finished naturally: ', emote.emoteUrn)
				break
			case EmoteState.ES_INTERRUPTED:
				console.log('emote was interrupted: ', emote.emoteUrn)
				break
		}
	})
}
```

{% hint style="warning" %}
**📔 Note**: This feature is only supported in the Desktop client. Emotes played with a `mask` (partial-body emotes) on the local player don't currently report lifecycle events.
{% endhint %}

{% hint style="info" %}
**💡 Tip**: To play animations on avatars that aren't players, see [NPC Avatars](npc-avatars.md#animations).
{% endhint %}
