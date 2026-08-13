---
description: Play live audio streams in your scene.
---

# Audio Streaming

You can stream audio from a URL. This is useful to play music directly from an internet radio, or stream a conference into your scene.

{% hint style="info" %}
**💡 Tip**: In the [Scene Editor in Creator Hub](../../scene-editor/get-started/about-editor.md), you can use an **Audio Stream** [Smart Item](../../scene-editor/interactivity/smart-items.md) for a no-code way to achieve this.
{% endhint %}

The audio in the source must be in one of the following formats: `.mp3`, `ogg`, or `aac`. The source must also be an _https_ URL (_http_ URLs aren't supported), and the source should have [CORS policies (Cross Origin Resource Sharing)](https://en.wikipedia.org/wiki/Cross-origin_resource_sharing) that permit externally accessing it. If this is not the case, you might need to set up a server to act as a proxy and expose the stream in a valid way.

{% hint style="warning" %}
**📔 Note**: To instead play a pre-recorded sound in your scene, see [Sounds](../3d-essentials/sounds.md).
{% endhint %}

To add an audio stream into your scene, simply add an `AudioStream` component to an entity:

```ts
const streamEntity = engine.addEntity()

AudioStream.create(streamEntity, {
	url: 'https://icecast.ravepartyradio.org/ravepartyradio-192.mp3',
	playing: true,
	volume: 0.8,
})
```

{% hint style="warning" %}
**📔 Note**: The streamed sound isn't positional, it will be heard at a consistent volume throughout your entire scene. If a player steps out of the scene, they will not hear the streaming at all.
{% endhint %}

Set the volume of the `AudioStream` component by changing its `volume` property.

Switch the `AudioStream` component on or off by setting its `playing` property to _true_ or _false_.

{% hint style="info" %}
**📔 Note**: Not all streaming services allow you to play their audio outside their site. The following are some examples that work in Decentraland:

```ts
DELTA = "https://cdn.instream.audio/:9069/stream?_=171cd6c2b6e"
GRAFFITI = "https://n07.radiojar.com/2qm1fc5kb.m4a?1617129761=&rj-tok=AAABeIR7VqwAilDFeUM39SDjmw&rj-ttl=5"
ISLA NEGRA = "https://radioislanegra.org/listen/up/basic.aac"
```
{% endhint %}

## Stream state

You can monitor the state of an audio stream using either the `audioEventsSystem` (callback-based, recommended) or by polling with `AudioStream.getAudioState()`.

### Using audioEventsSystem (recommended)

Register a callback that fires only when the stream's state changes. This is the same system used for `AudioSource` entities (see [Monitor audio state](../3d-essentials/sounds.md#monitor-audio-state)).

```ts
import { engine, AudioStream, MediaState } from '@dcl/sdk/ecs'
import { audioEventsSystem } from '@dcl/sdk/ecs'

export function main() {
	const entity = engine.addEntity()

	AudioStream.create(entity, {
		playing: true,
		volume: 1,
		url: 'https://audio-edge-es6pf.mia.g.radiomast.io/ref-128k-mp3-stereo',
	})

	audioEventsSystem.registerAudioEventsEntity(entity, (event) => {
		console.log('Stream state: ', event.state)

		if (event.state === MediaState.MS_ERROR) {
			// Attempt reconnection
		}
	})
}
```

### Polling with getAudioState

You can also poll the state of a stream each frame using `AudioStream.getAudioState()`. This returns a `PBAudioEvent` object (or `undefined` if no state has been reported yet), with a `state` field and a `timestamp` field. The `state` field is a value of the `MediaState` enum:

* `MS_NONE`
* `MS_LOADING`
* `MS_READY`
* `MS_PLAYING`
* `MS_PAUSED`
* `MS_BUFFERING`
* `MS_SEEKING`
* `MS_ERROR`

```ts
export function main() {
	const entity = engine.addEntity()

	AudioStream.create(entity, {
		playing: true,
		volume: 1,
		url: 'https://audio-edge-es6pf.mia.g.radiomast.io/ref-128k-mp3-stereo',
	})

	let lastState: MediaState | undefined = undefined
	engine.addSystem(() => {
		const currentState = AudioStream.getAudioState(entity)?.state
		if (lastState !== currentState) {
			console.log('Stream state: ', currentState)
			lastState = currentState

			if (currentState == MediaState.MS_ERROR) {
				// Attempt reconnection
			}
		}
	})
}
```

## Spatial audio

By default, the audio from an `AudioStream` component is global, meaning it will be heard at a consistent volume throughout your entire scene. If a player steps out of the scene, they will not hear the streaming at all.

To make the audio spatial, set the `spatial` property to _true_.

```ts
AudioStream.create(entity, {
	url: 'https://radioislanegra.org/listen/up/stream',
    playing: true,
	spatial: true,
})
```

The audio will now be heard from the position of the entity that owns the `AudioStream` component, and will be louder as the player approaches it.

Control the spatial audio with the following properties:

- `spatialMinDistance`: The minimum distance at which audio becomes spatial. If the player is closer, the audio will be heard at full volume. _0_ by default.
- `spatialMaxDistance`: The maximum distance at which the audio is heard. If the player is further away, the audio will be heard at 0 volume. _60_ by default

```ts
const audioStreamEntity = engine.addEntity();

Transform.create(audioStreamEntity, {
    position: Vector3.create(8, 0, 8),
});

AudioStream.create(audioStreamEntity, {
    url: 'https://radioislanegra.org/listen/up/stream',
    playing: true,
    volume: 1.0,
    spatial: true,
    spatialMinDistance: 5,
    spatialMaxDistance: 10
});
```

{% hint style="warning" %}
**📔 Note**: Some audio formats don't support spatial audio. Make sure the stream audio is encoded in _mp3_, _AAC-LC_ or _FLAC_.
{% endhint %}

## Audio analysis

You can read real-time amplitude and frequency data from an `AudioStream` entity to drive reactive visuals like equalizers or beat-pulsing lights. See [Audio analysis](audio-analysis.md).
