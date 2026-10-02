---
description: Change the skybox time, replace the sky and reflections with your own textures or videos, or recolor the sky, sun, fog, clouds and stars
---

# Skybox Control

You can change how a player sees the skybox whenever they are standing in your scene, this also affects the hue and direction of the global lighting.

The sky in Decentraland follows a default day/night cycle that takes 2 hours to complete, so there are 12 full cycles every real day. If the scene is not enforcing any fixed time of day, then players are also able to switch to a particular time of day by changing a slider in their UI.

Whenever players enter a scene with a different time of day, or the scene changes the time of day dynamically, the skybox transitions smoothly over a few seconds to this new value.

## Fixed time of day

You can set a fixed time of day for your scene. All players will see the scene with this time of day, and the skybox will not follow the day/night cycle.

In the Creator Hub, open the scene settings and click on the **Settings** tab to find the **Skybox** section. Uncheck the **Auto** option and set the time of day you want.

![](../../images/fixed-time-of-day.png)

You can also set the skybox time of day in your scene code. To do this, add the following section to your `scene.json` at root level:

```json
 "skyboxConfig": {
    "fixedTime": 36000
  }
```

The number refers to the number of seconds since the start of the day, ranging from 0 (that refers to _00:00_) to 86400 (that refers to _24:00_). Any number higher than 86400 is interpreted also as midnight.

Here are some more examples of valid values:

* 0 seconds => _00:00_
* 21600 seconds => _06:00_
* 43200 seconds => _12:00_
* 64800 seconds => _18:00_
* 86400 seconds => _24:00_

## Reading the time of day

You can read the time of day from your scene code using the `getWorldTime()` function.

```ts
import { getWorldTime } from '~system/Runtime'

executeTask(async () => {
  let time = await getWorldTime({})
  console.log(time.seconds)
})
```

The function returns a number between 0 and 86400, where 0 is midnight and 86400 is 24:00. This value is updated if the scene changes the time of day dynamically or if the player changes the time of day in the UI. Otherwise, it returns the value relative to the default day/night cycle.

## Changing the time of day dynamically

You can change the time of day dynamically using the `SkyboxTime` component. This component can only be added to the root entity of the scene `engine.RootEntity`.

```ts
import { SkyboxTime } from '@dcl/sdk/ecs'

function main() {
  SkyboxTime.create(engine.RootEntity, { fixedTime: 36000 })
}
```

The `fixedTime` property is a number between 0 and 86400, where 0 is midnight and 86400 is 24:00. Any number higher than 86400 is interpreted also as midnight.

Whenever this component is added, removed, or the `fixedTime` property is changed, the skybox time of day transitions smoothly over a few seconds to this new value. The same happens when the player steps out or into the scene. While the skybox time of day is fixed, the skybox will no longer follow progress in its day/night cycle and players can't change the time of day via the UI.

By default, the transition always happens in the forward direction, but you can change this by setting the `transitionMode` property to `TransitionMode.TM_FORWARD` or `TransitionMode.TM_BACKWARD`.

```ts
import { SkyboxTime, TransitionMode } from '@dcl/sdk/ecs'

function main() {
  SkyboxTime.create(engine.RootEntity, { fixedTime: 36000, transitionMode: TransitionMode.TM_BACKWARD })
}
```

## Custom sky texture and reflections

The `Skybox` component replaces the sky itself and the reflections that every shiny material in the scene uses. Like `SkyboxTime`, it can only be added to the root entity of the scene, `engine.RootEntity`, and it only takes effect while the player is standing inside your scene.

```ts
import { engine, Material, Skybox } from '@dcl/sdk/ecs'

function main() {
  Skybox.create(engine.RootEntity, {
    skyboxTexture: Material.Texture.Common({ src: 'images/sky.png' }),
    reflectionMap: Material.Texture.Common({ src: 'images/reflections.png' })
  })
}
```

* `skyboxTexture`: an equirectangular image (a 2:1 latitude-longitude panorama) that replaces the visible sky. The time-of-day lighting keeps running underneath it. The horizontal center of the image faces the positive Z axis of the scene.
* `reflectionMap`: an equirectangular image that replaces the reflection map used by metallic and glossy materials. If you set `skyboxTexture` but not `reflectionMap`, the reflections are derived from the sky texture automatically, so reflective surfaces match what the player sees in the sky.

Both textures accept image files from the scene's assets and video textures (see [Video skybox](#video-skybox) below); avatar textures are ignored. If an image fails to load, the default sky or reflections stay in place.

### Video skybox

`skyboxTexture` and `reflectionMap` also accept a video texture, so the sky can be an animated panorama or a live stream. Add a `VideoPlayer` component to any entity of the scene and point the texture at that entity with `Material.Texture.Video()`, the same way you would for a [video screen](../media/video-playing.md).

```ts
import { engine, Material, Skybox, VideoPlayer } from '@dcl/sdk/ecs'

function main() {
  const video = engine.addEntity()
  VideoPlayer.create(video, { src: 'assets/sky.mp4', playing: true, loop: true, volume: 0 })

  Skybox.createOrReplace(engine.RootEntity, {
    skyboxTexture: Material.Texture.Video({ videoPlayerEntity: video })
  })
}
```

The video is sampled live for the sky. Reflections derived from it follow it with a delay of a few frames, since they are regenerated progressively, just like for the default sky. Keep in mind:

* The entity with the `VideoPlayer` doesn't need a mesh or a material: the video is only used by the sky. It is still a normal video player, though: it plays its audio unless you set `volume: 0`, and it counts toward the maximum number of simultaneous videos (see [Performance considerations](../media/video-playing.md#performance-considerations)). While the skybox is using it, the engine never pauses it in favor of other videos closer to the player.
* Use a 2:1 video to match the equirectangular mapping; a video with any other aspect ratio is stretched to fit it.
* `clouds.texture` accepts a video texture too, see [Custom clouds](#custom-clouds).

## Sky colors, sun, fog, clouds and stars

If you keep the procedural sky, the same component lets you recolor it and adjust its cloud layer and star field. Every field is optional: anything you leave out keeps its default time-of-day behavior.

```ts
import { engine, Skybox, ColorGradient } from '@dcl/sdk/ecs'
import { Color4 } from '@dcl/sdk/math'

// A gradient with a single key is a constant color
function constant(color: Color4): ColorGradient {
  return { keys: [{ time: 0, color }] }
}

function main() {
  Skybox.create(engine.RootEntity, {
    skyColors: {
      zenith: constant(Color4.create(0.55, 0.25, 0.12, 1)),
      horizon: constant(Color4.create(0.95, 0.55, 0.3, 1)),
      nadir: constant(Color4.create(0.35, 0.15, 0.08, 1))
    },
    sun: { color: constant(Color4.create(1, 0.65, 0.4, 1)) },
    fog: { color: constant(Color4.create(0.85, 0.5, 0.3, 1)), density: 0.01 },
    clouds: { opacity: 0.3, speed: 0.01 },
    stars: { brightness: 4.62 }
  })
}
```

* `skyColors`: the color of the sky at its `zenith` (straight up), at the `horizon`, and at its `nadir` (below the horizon). These colors also drive the ambient light of the scene: the zenith color lights objects from above, the horizon color from the sides and the nadir color from below, so that objects and avatars match the sky around them. `skyColors.rim` is the glow drawn along the horizon line; when you leave it unset it follows your `horizon` color, so you only need it for an accent (for example an orange sunrise rim on a dark sky).
* `sun.color`: the color of the directional light. It also tints the sun disc.
* `fog.color`: the color of the distance fog. `fog.density`: how quickly things fade into it, as an exponential density per meter: `1 / density` is roughly the distance at which two thirds of the view is fogged. The default is 0.0005 (about 2 km); 0.02 fogs everything beyond about 50 m, 0 makes the fog invisible. `fog.startDistance` / `fog.endDistance`: the range of a linear fog in meters, for clients that render fog that way; the Decentraland Explorer renders exponential fog, so it uses `density` and ignores these two. Whether fog is rendered at all is a quality setting chosen by the player, a scene can't turn it on or off.
* `clouds.opacity`: from 0 (no clouds) to 1, the default. `clouds.speed`: how fast the cloud layer drifts, 0.01 by default, 0 for static clouds. `clouds.color`: the tint of the cloud layer; without it clouds keep their default time-of-day colors even on a recolored sky. `clouds.texture`: your own cloud layer image, see [Custom clouds](#custom-clouds).
* `stars.brightness`: 4.62 by default. Stars are only visible during the night part of the day.

`skyColors`, `clouds` and `stars` have no effect while a `skyboxTexture` is set, since the texture replaces the procedural sky. `sun`, `fog` and the ambient light still apply in that case.

### Custom clouds

`clouds.texture` replaces the default cloud layer of the procedural sky with your own equirectangular 2:1 image, or with a video texture (see [Video skybox](#video-skybox)). The other `clouds` fields keep working on it: `opacity` fades it, `speed` rotates it and `color` tints it.

```ts
import { engine, Material, Skybox } from '@dcl/sdk/ecs'

Skybox.createOrReplace(engine.RootEntity, {
  clouds: {
    texture: Material.Texture.Common({ src: 'images/clouds.png' }),
    speed: 0.005
  }
})
```

The engine reads each color channel of the image separately:

* **R**: the intensity of the cloud tint, multiplied by `clouds.color` (or by the default time-of-day tint).
* **G**: the opacity, or coverage, of the clouds.
* **B**: the sun-highlight mask, where the clouds catch the light of the sun.

A plain grayscale image, where the three channels are the same, works as a simple cloud mask: white where there are clouds, black for clear sky. Like the rest of the `clouds` fields, the texture has no effect while a `skyboxTexture` is set, since the panorama replaces the whole procedural sky, clouds included.

### Color gradients over the day

Every color in the `Skybox` component is a `ColorGradient`: a list of `keys`, each with a `time` and a `Color4`. The `time` is the normalized time of day, from 0 (_00:00_) to 1 (_24:00_), so 0.5 is noon, the same clock that `SkyboxTime` uses. The color is interpolated between neighboring keys; before the first key and after the last one, that key's color is used. A gradient with a single key is simply a constant color.

```ts
Skybox.createOrReplace(engine.RootEntity, {
  skyColors: {
    horizon: {
      keys: [
        { time: 0, color: Color4.create(0.05, 0.05, 0.2, 1) }, // midnight
        { time: 0.25, color: Color4.create(0.95, 0.5, 0.4, 1) }, // dawn
        { time: 0.5, color: Color4.create(0.7, 0.9, 1, 1) }, // noon
        { time: 0.75, color: Color4.create(0.95, 0.4, 0.2, 1) }, // dusk
        { time: 1, color: Color4.create(0.05, 0.05, 0.2, 1) } // midnight again, so there's no jump
      ]
    }
  }
})
```

Gradients don't wrap around midnight, so repeat the same color at `time: 0` and `time: 1` if the day should loop seamlessly. Color values are not limited to 1: values above 1 produce a brighter, HDR sun or sky. The alpha channel is ignored. Use up to 8 keys per gradient: longer gradients are resampled to 8 evenly spaced keys, which smooths out any detail between them. Combine gradients with `SkyboxTime` to pin the day at one specific point of your gradient.

## Hiding the sun and moon

Set `sun.visible` to `false` to hide the sun and moon discs and the sun's lens flare. This also works together with a `skyboxTexture`, where the lens flare would otherwise still show through the texture. The light that the sun casts is not affected.

```ts
Skybox.createOrReplace(engine.RootEntity, { sun: { visible: false } })
```

### Complete darkness

To make the lights placed in your scene the only source of illumination, black out everything the sky contributes: the sun and its disc, the sky colors (and with them the ambient light), the fog, the clouds and the stars.

```ts
import { engine, Skybox } from '@dcl/sdk/ecs'
import { Color4 } from '@dcl/sdk/math'

const black = { keys: [{ time: 0, color: Color4.Black() }] }

Skybox.createOrReplace(engine.RootEntity, {
  sun: { color: black, visible: false },
  skyColors: { zenith: black, horizon: black, nadir: black },
  fog: { color: black },
  clouds: { opacity: 0 },
  stars: { brightness: 0 }
})
```

See [Lights](../3d-essentials/lights.md) to add point and spot lights to your scene.

## Scope and reset

All `Skybox` overrides apply only while the player is inside your scene. When the player leaves the scene, when the component is removed, or when a field is unset, the sky, reflections and lighting go back to their defaults, and re-entering the scene applies them again. Changes apply immediately, without a transition.

{% hint style="warning" %}
**📔 Note**: While active, these overrides are global: neighboring parcels seen from inside your scene are also rendered with your sky, fog and lighting.
{% endhint %}

{% hint style="info" %}
**💡 Tip**: For working examples of skybox control, see the [`2,1-skybox-sdk-scene-a`](https://github.com/decentraland/sdk7-test-scenes/tree/main/scenes/2,1-skybox-sdk-scene-a) and [`3,1-skybox-sdk-scene-b`](https://github.com/decentraland/sdk7-test-scenes/tree/main/scenes/3,1-skybox-sdk-scene-b) test scenes, which drive `SkyboxTime` and `TransitionMode` live from a UI panel, and [`2,0-skybox-scene-json`](https://github.com/decentraland/sdk7-test-scenes/tree/main/scenes/2,0-skybox-scene-json), which reads the `fixedTime` set in `scene.json` back at runtime via `getSceneInformation()`. The [`2,2-reflection-map`](https://github.com/decentraland/sdk7-test-scenes/tree/main/scenes/2,2-reflection-map) scene exercises the `Skybox` component: sky and reflection textures, environment presets, hiding the sun and a complete-darkness mode.
{% endhint %}
