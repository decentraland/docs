---
description: Detect when players speak in nearby voice chat, and change how voices are heard inside regions of your scene.
---

# Nearby Voice Chat

Nearby voice chat lets players talk with the people around them. Your scene can react to it in two ways:

* **Detect who is speaking** with the `PlayerVoiceState` component, to light up a stage, open a door with your voice, or show who is talking.
* **Shape how voices are heard** inside a region with the `VoiceChatModifierArea` component: whisper corners, quiet zones, muted audiences, or private booths.

{% hint style="warning" %}
**📔 Note**: `PlayerVoiceState` and `VoiceChatModifierArea` require an `@dcl/sdk` release newer than 7.30.1.
{% endhint %}

To turn voice chat off for your whole scene instead, use the voice chat feature toggle in your [scene settings](../../projects/scene-metadata.md#feature-toggles).

## Detect who is speaking

The engine writes a `PlayerVoiceState` component on the entity of every player standing in your scene, including `engine.PlayerEntity`. Its `isSpeaking` field is `true` while the voice the player is sending to nearby voice chat is detected as speech.

```ts
import { engine, PlayerVoiceState } from '@dcl/sdk/ecs'

engine.addSystem(() => {
	const isSpeaking = PlayerVoiceState.getOrNull(engine.PlayerEntity)?.isSpeaking ?? false
	if (isSpeaking) {
		openVoiceDoor()
	}
})
```

To check every player in the scene, iterate the entities that have `PlayerIdentityData`:

```ts
import { engine, PlayerIdentityData, PlayerVoiceState } from '@dcl/sdk/ecs'

engine.addSystem(() => {
	for (const [entity, identity] of engine.getEntitiesWith(PlayerIdentityData)) {
		const isSpeaking = PlayerVoiceState.getOrNull(entity)?.isSpeaking ?? false
		setSpeakingMarker(identity.address, isSpeaking)
	}
})
```

`PlayerVoiceState` is written by the engine, so only read it, with `get` or `getOrNull`. Never use `getMutable` on it.

{% hint style="warning" %}
**📔 Note**:

* `isSpeaking` reflects nearby voice chat only. Private calls and community calls are never reported.
* A player's state reaches only the scene that player is standing in.
* `isSpeaking` is never `true` while the player's microphone is off, muted, or idle on push-to-talk.
* It updates within about a second and can flicker between words. If you need a steady signal, for example to keep a light on during a sentence, keep it `true` for a short time after it turns `false`.
* The component is absent while voice chat isn't available to the player, so treat a missing component as "not speaking".
{% endhint %}

## Voice chat modifier areas

Add a `VoiceChatModifierArea` to a region of your scene to change how players **speaking inside it** are heard. The effect follows the speaker: everyone hears a player in a whisper corner as whispering, wherever the listener stands.

An area only affects players standing on your scene's parcels. If part of the area reaches past the edge of your scene, that part has no effect, so your areas never change how players in a neighboring scene are heard.

```ts
import { engine, Transform, VoiceChatModifierArea } from '@dcl/sdk/ecs'
import { Vector3 } from '@dcl/sdk/math'

const whisperCorner = engine.addEntity()

VoiceChatModifierArea.create(whisperCorner, {
	area: Vector3.create(4, 3, 4),
	maxDistance: 3,
})

Transform.create(whisperCorner, {
	position: Vector3.create(4, 0, 4),
})
```

Position the area with a `Transform`. Its size comes from `area`; the `scale` of the transform is ignored, and the rotation is applied.

These are the available fields. All of them are optional except `area`. A field set to `NaN` or `Infinity` is ignored, as if it weren't set:

| Field | Effect | Default |
| --- | --- | --- |
| `area` | Size of the region, as a `Vector3`. | Required |
| `maxDistance` | Distance in meters at which the voice fades out. Use a small value, like `3`, to whisper. Values below `0.1` are raised to `0.1`, and values beyond the client's nearby range have no effect. | The client's nearby range |
| `volumeScale` | Voice volume, from `0` to `1`. Values outside that range are clamped, so an area can't make a voice louder. | `1` |
| `mute` | The voice isn't heard at all, the same as a `volumeScale` of `0`. | `false` |
| `isolate` | Speakers inside are heard only by listeners inside the same area, and those listeners only hear speakers inside it. | `false` |
| `excludeIds` | Player addresses that stay unaffected, for example a performer on a stage. Addresses are compared without regard to upper or lower case. | `[]` |

### Mute an audience and let a performer speak

```ts
VoiceChatModifierArea.create(stage, {
	area: Vector3.create(16, 6, 12),
	mute: true,
	excludeIds: [performerAddress],
})
```

### Private booth

```ts
VoiceChatModifierArea.create(booth, {
	area: Vector3.create(4, 3, 4),
	isolate: true,
})
```

Players inside the booth hear each other normally. Players outside can't hear them, and they can't hear players outside, even players standing in another, non-isolating area. Two separate booths are two separate rooms: players in one booth can't hear players in the other.

### Overlapping areas

When a player stands in several areas at once, the most restrictive value of each field wins: the lowest `volumeScale`, the shortest `maxDistance`, and `mute` if any area mutes. A whisper corner inside a quiet zone is both quiet and a whisper.

{% hint style="warning" %}
**📔 Note**:

* A player listed in `excludeIds` is treated as outside the area, including for isolation.
* A muted speaker still reports `isSpeaking: true` in `PlayerVoiceState`: they are talking, just not heard.
* If an entity holds a `VoiceChatModifierArea` together with another area component, such as an `AvatarModifierArea`, a `CameraModeArea`, or a `TriggerArea`, only one of them takes effect. Use a separate entity for each.
* Areas are applied by each listener's client, so they shape the experience but are not a privacy or security boundary. Don't rely on `mute` or `isolate` to keep a conversation private.
{% endhint %}

### Debug voice chat modifier areas

To see where an area is, give the same entity a `MeshRenderer` box scaled to the `area` size, with a translucent material, as described in [Debug modifier areas](modifier-areas.md#debug-modifier-areas).

{% hint style="info" %}
**💡 Tip**: For a working example, see the [`60,60-nearby-voice-areas`](https://github.com/decentraland/sdk7-test-scenes/tree/main/scenes/60,60-nearby-voice-areas) test scene. It combines a whisper corner, a mute zone, an isolation booth, a quiet zone, a performer stage, and a speaking marker above every player.
{% endhint %}
