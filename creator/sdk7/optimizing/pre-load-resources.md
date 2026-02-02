---
title: Pre-loading Resources into Your Scene
description: Pre-loading Resources allows custom assets to be downloaded at scene startup so they are ready when the player interacts with them for the first time.
---

# Pre-loading Resources

When creating a scene, you can add custom assets to extend the default assets available in the Creator Hub.

In some cases, a custom asset is added to the scene but is not used immediately. For example, a custom sound file may only be played when the player presses a button. In this scenario, the first time the player presses the button, the audio may not play because it has not finished downloading.

To avoid this, use the `AssetLoad.create` method to ensure these assets are downloaded before they are needed.

```ts
AssetLoad.create(engine.RootEntity, {
  assets: [
    "assets/scene/bundle1/explosionSound.mp3",
    "assets/scene/bundle1/explosion.glb",
  ],
})
```

The assets listed in `AssetLoad.create` are automatically downloaded when the scene starts, ensuring they are available the first time the player interacts with them.

The `AssetLoad` component is used to add assets to memory, not to remove them. Removing an asset from the list in `AssetLoad.create` will not free memory.

{% hint style="info" %}
**Note:** You can place the AssetLoad component on any entity (not only the RootEntity), and you can use it on as many entities as needed.
{% endhint %}

{% hint style="warning" %}
If your custom asset is used immediately when the scene loads (for example, a GLB model placed in the scene, or a background sound that plays continuously), it will already be downloaded and used automatically. Be mindful when adding assets to `AssetLoad.create`, and only pre-load assets that are not required at scene startup to avoid unnecessary performance costs.
{% endhint %}
