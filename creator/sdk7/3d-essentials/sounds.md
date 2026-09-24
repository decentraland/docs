---
description: Learn how to add sounds to your scene.
---

# Sounds

Sound is a great way to provide feedback to player actions and events, background sounds can also give your scene more context and improve the player's immersion into it.

{% hint style="warning" %}
**📔 Note**: Keep in mind that sounds are only heard by players who are standing within the parcels that make up the scene where the sound was generated, even if they would otherwise be in hearing range. Players can also chose to turn off all sounds on their settings.
{% endhint %}

Supported sound formats vary depending on the browser, but it's recommended to use _.mp3_.

_.wav_ files are also supported but not generally recommended as they are significantly heavier.

## Play sounds

The easiest way to play a sound is to add an **Audio Source** component visually on the [Scene Editor in Creator Hub](../../scene-editor/get-started/about-editor.md) and set it to **Start Playing** and **Loop**. See [Add Components](../../scene-editor/build/components.md#add-components).

![](../../images/editor/AudioSource-component.png)

You can also trigger the playing of a sound in a no-code way via **Actions**, see [Make any item smart](../../scene-editor/interactivity/make-any-item-smart.md).

To play a sound via code, use the `AudioSource.playSound` function.

```ts
// Create entity
const sourceEntity = engine.addEntity()

// Play sound
AudioSource.playSound(sourceEntity, 'assets/sounds/sound-effect.mp3')
```

The sound file must be inside the project folder. In the example above, the audio file is located in an `assets/sounds` folder, which is located at root level of the scene project folder.

{% hint style="warning" %}
**📔 Note**: The `AudioSource` component must be imported via

> `import { AudioSource } from "@dcl/sdk/ecs"`

See [Imports](../getting-started/coding-scenes.md#imports) for how to handle these easily.
{% endhint %}

The `AudioSource.playSound()` function takes the following arguments:

* `entity`: On what entity to apply the sound. The sound will be heard from this entity's position, meaning it gets louder as the player approaches it.
* `src`: The location of the sound file within your project.

{% hint style="info" %}
**💡 Tip**: For more clarity, we recommend keeping your sound files separate in a `assets/sounds` folder inside your scene.
{% endhint %}

* `resetCursor`: _(optional)_ If true, the sound always starts from the beginning. Otherwise it continues from the current cursor position. Useful for pausing and resuming.

Another way to play sounds is to manually create an `AudioSource` component on an entity. Use this approach to have more control over the sound, for example to make it loop or set the volume.

```ts
// Create entity
const sourceEntity = engine.addEntity()

// Create AudioSource component
AudioSource.create(sourceEntity, {
	audioClipUrl: 'sounds/sound-effect.mp3',
	loop: true,
	playing: true,
})
```

The following properties can be set:

* `audioClipUrl`: The location of the sound file within your project.
* `playing`: If true, the sound starts playing. You can create a sound with `playing` set to false, and then set it to true at a later time.
* `volume`: _(optional)_ The volume of the sound file. 1 by default, which is full volume.
* `pitch`: _(optional)_ Modify the pitch of a sound. 1 is the default, make it lower for a deeper sound and higher for a higher pitch sound.

{% hint style="info" %}
**💡 Tip**: To prevent a sound effect from becoming too repetitive during a game, it's useful to randomize some slight variations to the sound's pitch every time it plays.
{% endhint %}

* `currentTime`: _(optional)_ 0 by default. Set this value to avoid starting from the beginning of the sound file. This is a seek command: the renderer never writes the current position of the sound back into it. To know where a sound actually is, see [Playback position reports](#playback-position-reports).
* `reportPlaybackPosition`: _(optional)_ _false_ by default. If true, the renderer reports the playback position of the clip while it plays, so that your scene can follow the sound that the player is actually hearing. See [Playback position reports](#playback-position-reports).

Each entity can only have a single `AudioSource` component, that can only play a single clip at a time. This limitation can be easily overcome by modifying the audio source at the time of playing a new sound, or by including multiple invisible child entities, each with their own sound.

{% hint style="warning" %}
**📔 Note**: Sounds are played on each player's local instance. Other nearby players won't hear the same sounds unless their local scene explicitly plays them too.
{% endhint %}

### Pre Loading a Sound

If an entity uses a sound, but is not played immediately at scene runtime, it might take some time to download. It can be available at scene runtime by using the `AssetLoad` component. 

```ts
import { AssetLoad } from "@dcl/sdk/ecs"

AssetLoad.create(engine.RootEntity, {
  assets: [
    "assets/scene/bundle1/explosionSound.mp3",
  ],
})
```
For more information, check the [Pre Load Resources](../optimizing/pre-load-resources.md) documentation.

## Stopping sounds

To stop an entity from playing its sound, use the `AudioSource.stopSound()` function. You only need to specify the entity, since each entity has a single `AudioSource` component, and each `AudioSource` component plays a single file at a time.

```ts
AudioSource.stopSound(sourceEntity)
```

Another way to stop a sound is to set the `playing` property to false.

```ts
// Create entity
const sourceEntity = engine.addEntity()

// Create AudioSource component
AudioSource.create(sourceEntity, {
	audioClipUrl: 'sounds/explosion.mp3',
	playing: true,
})

// Define a simple function
function stopSound(entity: Entity) {
	// fetch mutable version of audio source component
	const audioSource = AudioSource.getMutable(entity)

	// modify its playing value
	audioSource.playing = false
}

// call function
stopSound(sourceEntity)
```

## Detect when a sound finishes

When a non-looping sound finishes playing on its own, the engine sets the `playing` property of the `AudioSource` component back to _false_. Your scene's code can read this value to know when the sound ended, for example to chain another sound or action right after it.

```ts
let wasPlaying = false

engine.addSystem(() => {
	const audio = AudioSource.get(sourceEntity)
	const isPlaying = audio.playing ?? false

	if (wasPlaying && !isPlaying) {
		console.log('sound finished playing')
		// react here: play another sound, advance a sequence, etc.
	}

	wasPlaying = isPlaying
})
```

{% hint style="warning" %}
**📔 Note**: When polling the component every frame, always read it with `AudioSource.get()` (read-only). Using `AudioSource.getMutable()` would mark the component as changed on every frame, causing unnecessary synchronization work.

The `playing` property is only flipped by the engine when the sound ends by itself. If the scene stops the sound explicitly (via `AudioSource.stopSound()` or by setting `playing` to _false_), that change comes from your own code, and looping sounds play until stopped, so they never flip the property on their own.
{% endhint %}

Alternatively, use `audioEventsSystem.registerAudioEventsEntity` to define a function that runs every time the playback state of the entity's audio changes, just like [video events](../media/video-playing.md#video-events) for videos. The function receives an event with a `state` field, using the `MediaState` enum.

```ts
import { engine, AudioSource, audioEventsSystem, MediaState } from '@dcl/sdk/ecs'

// ... Create sourceEntity with an AudioSource component ...

audioEventsSystem.registerAudioEventsEntity(sourceEntity, (audioEvent) => {
	switch (audioEvent.state) {
		case MediaState.MS_LOADING:
			console.log('audio event - sound is LOADING')
			break
		case MediaState.MS_READY:
			console.log('audio event - sound is READY (loaded, or finished playing)')
			break
		case MediaState.MS_PLAYING:
			console.log('audio event - sound started PLAYING')
			break
		case MediaState.MS_ERROR:
			console.log('audio event - sound ERROR (e.g. the file failed to load)')
			break
	}
})
```

A transition from `MS_PLAYING` to `MS_READY` means the sound stopped playing. A clip played by an `AudioSource` only ever reaches five of the values in the `MediaState` enum: `MS_NONE`, `MS_ERROR`, `MS_LOADING`, `MS_READY` and `MS_PLAYING`. The remaining values, `MS_PAUSED`, `MS_BUFFERING` and `MS_SEEKING`, only occur on an [`AudioStream`](../media/audio-streaming.md), which the same system also handles. There's no paused state for a clip: setting `playing` to _false_ stops the sound and rewinds it, it doesn't pause it.

Each event also carries a `timestamp`, a counter that the renderer increments on every report it writes for the entity. It is **not** a time value, only use it to tell reports apart or to order them. You can query the latest reported state at any time with `audioEventsSystem.getAudioState(entity)`, unregister the callback with `audioEventsSystem.removeAudioEventsEntity(entity)`, or check whether an entity is registered with `audioEventsSystem.hasAudioEventsEntity(entity)`.

Functions registered with `registerAudioEventsEntity()` run on state changes only. To follow where a clip is while it's playing, see [Playback position reports](#playback-position-reports).

{% hint style="warning" %}
**📔 Note**: These features are only supported in the Desktop client.
{% endhint %}

## Looping

To keep a sound playing in a continuous loop, set the `loop` field of the `AudioSource` component to _true_ before you start playing it.

```ts
// Create entity
const sourceEntity = engine.addEntity()

// Create AudioSource component
AudioSource.create(sourceEntity, {
	audioClipUrl: 'sounds/sound-effect.mp3',
	playing: true,
	loop: true,
})
```

Looping sounds is especially useful for adding background music or other background sounds.

## Set volume

You can set the `volume` property of the `AudioSource` component to change the volume of a sound.

The volume is expressed as a number from _0_ to _1_.

```ts
// Create entity
const sourceEntity = engine.addEntity()

// Create AudioSource component
AudioSource.create(sourceEntity, {
	audioClipUrl: 'sounds/sound-effect.mp3',
	playing: true,
	volume: 0.5,
})
```

{% hint style="warning" %}
**📔 Note**: Of course, the volume of a sound is also affected by the distance of the player from the audio source. As the player walks away, the volume will be lower.
{% endhint %}

## Global sounds

By default, all sounds from an `AudioSource` are positional. This means they appear to generate from the position of the `Transform` component, and will sound louder as the player walks closer. But you can also configure a sound to be global, so that the volume is constant, no matter where the player is standing. This is ideal for using on background music, notification sounds, and other non-positional sound.

{% hint style="warning" %}
**📔 Note**: Global Sounds are a feature that's only supported in the DCL 2.0 desktop client.
{% endhint %}

To make a sound global, set the `global` property to _true_.

```ts
AudioSource.create(sourceEntity, {
	audioClipUrl: 'sounds/music.mp3',
	playing: true,
	global: true,
})
```

## Play a segment of a sound

To play a segment of a longer sound file, use the `playSoundSegment()` in the SDK Utils library. See [SDK7 Utils](https://github.com/decentraland/sdk7-utils).

You can also achieve this by explicitly set the `currentTime` property on an `AudioSource` component, and then stopping it after waiting for a period of time.

## Playback position reports

{% hint style="warning" %}
**📔 Note**: Playback position reports require an SDK release that includes them, and an explorer that implements them. On explorers that don't, the properties described below stay _undefined_, functions registered with `registerAudioPlaybackEntity()` never run, and `getAudioPlayback()` always returns _undefined_.
{% endhint %}

While an `AudioSource` clip is playing, the renderer can also write reports of the playback position into the `AudioEvent` component, every time the playhead moves. These reports carry the following _optional_ properties, in addition to `state` and `timestamp`:

* `tickNumber` (_number_): The scene tick in which the position was sampled. It matches the `tickNumber` of the [EngineInfo](../interactivity/runtime-data.md#the-engineinfo-component) component in that same tick.
* `currentOffset` (_number_): The playback position of the clip, in seconds, at that tick.
* `clipLength` (_number_): The total length of the clip, in seconds, when known.

These reports are the only way to know what the player is actually hearing. The renderer starts a clip some milliseconds after your scene asks for it, and that delay isn't the same every time. The `currentTime` property of the `AudioSource` component doesn't help either: it's a seek command that your scene writes and the renderer never updates, so reading it back only tells you what you last set. Rely on the reports instead whenever your gameplay needs to follow the sound: rhythm games, effects that fire on the beat, or aligning a sound to a video.

### Opt in to position reports

Position reports only happen if your scene asks for them. Set the `reportPlaybackPosition` property of the `AudioSource` component to _true_, otherwise the renderer never writes a position for that source.

```ts
import { engine, AudioSource } from '@dcl/sdk/ecs'

const sourceEntity = engine.addEntity()

AudioSource.create(sourceEntity, {
	audioClipUrl: 'sounds/music.mp3',
	playing: true,
	reportPlaybackPosition: true,
})
```

Media state changes are reported either way, this flag only enables the position reports. It's opt-in because the renderer writes a position report every time the playhead moves, far more often than the state changes, and a scene can have plenty of audio sources playing at once. Scenes that play fire-and-forget sound effects leave the flag unset and pay nothing for it, scenes that need to follow a sound turn it on only on the sources that matter.

{% hint style="warning" %}
**📔 Note**: `AudioSource.playSound()` creates the component with default values, without this flag. Create the `AudioSource` component explicitly, as shown above, to enable the reports. Later calls to `AudioSource.playSound()` on that same entity keep the flag, since they preserve the component's existing properties.
{% endhint %}

### Read the playback position

Use `audioEventsSystem.registerAudioPlaybackEntity()` to define a function that runs once per frame with the newest position report for an entity. It's skipped on frames where no new position arrived.

Your function receives the reading already worked out against your scene's clock, as `{ report, sceneTime, offset }`. `report` is the raw `AudioEvent`, in case you need `clipLength` or the state, `offset` is the position of the clip in seconds, and `sceneTime` is the scene clock at the tick the renderer sampled that position, explained in [Sync gameplay to the sound](#sync-gameplay-to-the-sound).

```ts
import { engine, AudioSource, audioEventsSystem } from '@dcl/sdk/ecs'

const sourceEntity = engine.addEntity()

AudioSource.create(sourceEntity, {
	audioClipUrl: 'sounds/music.mp3',
	playing: true,
	reportPlaybackPosition: true,
})

audioEventsSystem.registerAudioPlaybackEntity(sourceEntity, ({ report, offset }) => {
	console.log(`clip at ${offset}s of ${report.clipLength ?? 'unknown'}s`)
})
```

Use `audioEventsSystem.getAudioPlayback()` to read the latest report that carries a position, for example to draw a progress bar. It returns _undefined_ until the renderer reports a position, so always check for that before using the value. To stop listening, use `audioEventsSystem.removeAudioPlaybackEntity()`.

```ts
engine.addSystem(() => {
	const playback = audioEventsSystem.getAudioPlayback(sourceEntity)
	if (!playback || playback.currentOffset === undefined || playback.clipLength === undefined) return

	const progress = playback.currentOffset / playback.clipLength
	// ... update a progress bar, etc
})
```

### Sync gameplay to the sound

A report reaches your scene a few frames after the renderer sampled it. Don't compare `currentOffset` to your clock at the moment your function runs, or you'll be off by however long the report took to arrive. It has to be compared against your clock _in the tick the position was sampled_.

The SDK keeps that per-tick history for you, which is why `registerAudioPlaybackEntity()` hands you `sceneTime`: the scene clock in seconds at the tick the reading was taken, paired with `offset`, the position of the clip at that same moment.

`sceneTime - offset` is the moment on the scene clock at which the audible clip started, it's not a lag. Keep that value, and the position of the clip at any later time is a single subtraction.

```ts
import { engine, AudioSource, audioEventsSystem, MediaState } from '@dcl/sdk/ecs'

const sourceEntity = engine.addEntity()

AudioSource.create(sourceEntity, {
	audioClipUrl: 'sounds/music.mp3',
	playing: true,
	reportPlaybackPosition: true,
})

// Your own scene clock, in milliseconds
let clockMs = 0
engine.addSystem((dt) => {
	clockMs += dt * 1000
})

// The moment the sound you can actually hear started, on that same clock
let originMs: number | undefined

audioEventsSystem.registerAudioPlaybackEntity(sourceEntity, ({ report, sceneTime, offset }) => {
	if (report.state !== MediaState.MS_PLAYING) return

	originMs = sceneTime * 1000 - offset * 1000
})

// At any moment, the clip is at about (clockMs - originMs) milliseconds
```

`clockMs - originMs` is your best estimate of the position of the clip at any moment between two reports. Use it to schedule effects on the beat, or to judge how well timed a player's input was. If the explorer doesn't send position reports, the function never runs, `originMs` stays _undefined_, and your scene should fall back to its own clock.

If you'd rather handle the raw reports yourself, `audioEventsSystem.getSceneTimeAtTick()` gives you the same per-tick lookup on its own: pass it a `tickNumber` and it returns the scene clock at that tick. It works for `VideoEvent` reports too.

{% hint style="warning" %}
**📔 Note**: `currentOffset` is where the decoder is reading, which isn't exactly the moment when the sound leaves the speaker. The audio output adds a few tens of milliseconds on top of it, and no property reports that. It's roughly constant for a given device, so if you need accuracy finer than a tick, calibrate it once at the start and subtract it.
{% endhint %}

{% hint style="info" %}
**💡 Tip**: The `VideoEvent` component reports `tickNumber` and `currentOffset` for videos in the same way, see [Video events](../media/video-playing.md#video-events). Use both to keep a sound and a video aligned.
{% endhint %}

## Audio streaming

See [Audio streaming](../media/audio-streaming.md) to learn how you can play a live audio stream from an external source.

## Audio analysis

See [Audio analysis](../media/audio-analysis.md) to learn how to read real-time amplitude and frequency data from an `AudioSource` and drive reactive visuals from it, like cubes that pulse with the bass or equalizer-style bar visualizers.
