---
description: Spawn a tree of entities and components at runtime from a composite file
---

# Composites

A _composite_ is a file that describes a tree of [entities and components](entities-components.md). Instead of writing code to create each entity one by one, you can store that structure in a composite file and spawn the whole thing with a single call.

You might already work with composites without realizing it:

- Every scene has a `main.composite` file. It holds everything you added and configured visually in the [Scene Editor](../../scene-editor/get-started/about-editor.md). This file is loaded automatically when your scene starts.
- [Custom Items](../../scene-editor/interactivity/custom-items.md) are saved as `composite.json` files. Each Custom Item is a composite that you can reuse across scenes.

This page covers how to spawn a composite from code at runtime, for example to spawn a Custom Item dynamically as part of your scene's logic.

## Spawn a composite

Spawning a composite takes two steps: **load** the composite file, then **spawn** it. Loading is asynchronous and spawning is synchronous, so the pattern is always load-then-spawn:

```ts
export async function spawnBarrel() {
  const src = "barrel.composite";

  // 1. Load the composite from its file
  await engine.getCompositeProvider().loadComposite(src);

  // 2. Spawn it: creates all its entities and components
  const barrel = engine.addEntityFromComposite(src);
  return barrel;
}
```

`engine.getCompositeProvider().loadComposite(src)` reads the composite file and loads it into memory. In a normal scene built with `@dcl/sdk`, a composite provider is already set up for you, you reach it with `engine.getCompositeProvider()`.

`engine.addEntityFromComposite(src)` then creates all the entities described in the composite, with all their components, and returns the **root entity** of the spawned tree. Use this returned entity to read or change components later, for example to reposition or remove the spawned item.

{% hint style="info" %}
**💡 Tip**: To do the same thing without writing code, use the **Spawn Entity** action in the Scene Editor. See [About spawning entities](../../scene-editor/interactivity/smart-items-advanced.md#about-spawning-entities).
{% endhint %}

{% hint style="warning" %}
**📔 Note**: You must load a composite before you spawn it. `engine.addEntityFromComposite()` is synchronous and can only spawn a composite that's already loaded. If you call it on a composite that hasn't been loaded, it throws `Composite "<src>" not found.`. If no composite provider has been set, it throws `CompositeProvider has not been set.`.

`loadComposite()` is idempotent: it keys each composite by its `src` string, so calling it again with the same path doesn't reload the file, it returns the already-loaded composite. You can safely call it before every spawn without worrying about loading the same file twice.
{% endhint %}

## Position a spawned composite

Pass a `transform` option to `addEntityFromComposite()` to place the spawned composite at a specific position, rotation, or scale. This transform is applied to the root entity.

```ts
import { Vector3 } from "@dcl/sdk/math";

export async function spawnBarrel() {
  const src = "barrel.composite";
  await engine.getCompositeProvider().loadComposite(src);

  // Spawn the composite at a specific position
  engine.addEntityFromComposite(src, {
    transform: {
      position: Vector3.create(8, 0, 8),
    },
  });
}
```

The transform fields (`position`, `rotation`, and `scale`) are all optional. Any field you leave out keeps the value stored in the composite.

{% hint style="warning" %}
**📔 Note**: The transform you pass replaces the root entity's existing Transform component. Only the root entity is affected, child entities keep their positions relative to the root.
{% endhint %}

## Current limitation: nested composites

Spawning works for self-contained composites and Custom Items. A composite can reference another composite from one of its entities, but loading does **not** recurse into those nested references yet.

If a spawned composite's root references another composite (anything other than `main.composite`, the only composite bundled with your scene), it fails to instantiate. For now, keep the composites you spawn self-contained.

## Related pages

- [Entities & Components](entities-components.md) — the building blocks a composite describes.
- [Custom Items](../../scene-editor/interactivity/custom-items.md) — reusable items stored as composites.
- [Smart Items - Advanced](../../scene-editor/interactivity/smart-items-advanced.md#about-spawning-entities) — spawn composites with no code, using the Spawn Entity action.
- [Scene Files](../projects/scene-files.md) — where `main.composite` lives in your scene project.
</content>
