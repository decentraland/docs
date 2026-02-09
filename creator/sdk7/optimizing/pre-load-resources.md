---
title: Pre-loading Resources into Your Scene
description: Pre-loading Resources allows assets to be downloaded at scene startup so they are ready when the player interacts with them for the first time.
---

# Pre-loading Resources

In some cases, an asset is added to the scene but is not used immediately. For example, a sound file may only be played when the player presses a button. In this scenario, the first time the player presses the button, the audio may play a couple of seconds too late, because the file is only downloaded when needed.

To avoid this issue, use the `AssetLoad` component to ensure these assets are downloaded and ready to use before they are needed.

```ts
import { AssetLoad } from "@dcl/sdk/ecs"

AssetLoad.create(engine.RootEntity, {
  assets: [
    "assets/scene/bundle1/explosionSound.mp3",
    "assets/scene/bundle1/explosion.glb",
  ],
})
```

The assets listed in the `AssetLoad` component are downloaded and added to memory, ensuring they are instantly available when the scene needs to load them.

{% hint style="info" %}
**Note:** You can place the `AssetLoad` component on any entity (not just the RootEntity), and you can use it on as many entities as needed. This can be helpful to handle separate load states for different levels or regions of your scene.

The `AssetLoad` component is used to add assets to memory, not to remove them. Removing an asset from the list in `AssetLoad.create` will not free memory.
{% endhint %}

{% hint style="info" %}
**Note:** If an asset is used immediately when the scene loads (for example, a GLB model placed in the scene, or a background sound that plays continuously), there is no need to use the `AssetLoad` component, since it is already being downloaded. 

Be mindful when adding assets to `AssetLoad.create`, and only pre-load assets that are not required at scene startup to avoid unnecessary performance costs.
{% endhint %}
