---
name: add-3d-models
description: Add 3D models (.glb/.gltf) to a Decentraland scene using GltfContainer. Covers loading, positioning, scaling, colliders, parenting, and browsing 2,700+ free assets from the Creator Hub catalog and 991 CC0 models. Use when the user wants to add models, import GLB files, find free 3D assets, or set up model colliders. Do NOT use for materials/textures (see advanced-rendering) or model animations (see animations-tweens).
---

# Adding 3D Models to Decentraland Scenes

## RULE: Use composite for initial models

**Always add models that exist at scene load to `assets/scene/main.composite`, not in TypeScript.**

Only use TypeScript (`engine.addEntity()` + `GltfContainer.create()`) for models spawned dynamically at runtime (e.g., a bullet instantiated on fire, an NPC summoned by an event).

For initial/static models, define them in the composite using `core::GltfContainer` and `core::Transform`. See `{baseDir}/../composites/composite-reference.md` for the full format.

```json
{
	"name": "core::GltfContainer",
	"data": {
		"512": {
			"json": {
				"src": "assets/asset-packs/tree_forest_01/Tree_Forest_01.glb",
				"visibleMeshesCollisionMask": 0,
				"invisibleMeshesCollisionMask": 3
			}
		}
	}
}
```

To add behavior to a model placed in the composite, fetch it in `index.ts` by name or tag — do NOT re-create it in code. See the **composites/composite-reference** for `getEntityOrNullByName` and `getEntitiesByTag` patterns.

---

## Loading a 3D Model in TypeScript (dynamic entities only)

Use `GltfContainer` to load `.glb` or `.gltf` files for entities spawned at runtime:

```typescript
import { engine, Transform, GltfContainer } from '@dcl/sdk/ecs'
import { Vector3, Quaternion } from '@dcl/sdk/math'

const model = engine.addEntity()
Transform.create(model, {
	position: Vector3.create(8, 0, 8),
	rotation: Quaternion.fromEulerDegrees(0, 0, 0),
	scale: Vector3.create(1, 1, 1),
})
GltfContainer.create(model, {
	src: 'assets/scene/Models/myModel.glb',
})
```

## File Organization

Place model files in the `assets/scene/Models/` directory at the project root:

```
project/
├── assets/
│   └── scene/
│       └── Models/
│           ├── building.glb
│           ├── tree.glb
│           └── furniture/
│               ├── chair.glb
│               └── table.glb
├── src/
│   └── index.ts
└── scene.json
```

## RULE: Always check for animations

Before finalizing any entity with a `GltfContainer`, check whether the GLB file contains animations (look for embedded clip names in the file metadata or catalog entry).

- **If the model has animations:** always add an `Animator` component. Without it the engine silently loops the first clip forever with no way to control playback.
- **If the model has no animations:** omit `Animator`.

In TypeScript:

```typescript
import { Animator } from '@dcl/sdk/ecs'

Animator.create(model, {
	states: [
		{ clip: 'idle', playing: true, loop: true },
		{ clip: 'walk', playing: false, loop: true },
	],
})
```

In composite (`core::Animator`):

```json
{
	"name": "core::Animator",
	"data": {
		"512": {
			"json": { "states": [{ "clip": "idle", "playing": true, "loop": true }] }
		}
	}
}
```

## RULE: Always check for built-in colliders

Before finalizing any entity with a `GltfContainer`, check whether the GLB contains collision meshes — any mesh whose name includes the substring `_collider`.

- **If the model has `_collider` meshes:** set `invisibleMeshesCollisionMask: 3` (CL_POINTER + CL_PHYSICS) to activate them. These invisible meshes define the exact collision shape the author intended.
- **If the model has no `_collider` meshes:** evaluate whether a `MeshCollider` is needed. Add one for any model that is a walkable surface, a wall, or needs to be clickable.

### Using built-in colliders

```typescript
GltfContainer.create(model, {
	src: 'assets/scene/Models/building.glb',
	visibleMeshesCollisionMask: 0, // visible meshes: no collision (default)
	invisibleMeshesCollisionMask: 3, // _collider meshes: physics + pointer
})
```

### Adding a MeshCollider when the model has no built-in colliders

```typescript
import { MeshCollider } from '@dcl/sdk/ecs'
MeshCollider.setBox(model) // rough box coverage
MeshCollider.setSphere(model) // rough sphere coverage
```

## RULE: Always validate entity positions against parcel bounds

**Entities positioned outside the scene parcels are not rendered at all** — no error is shown; they simply disappear.

- Each parcel is **16×16 meters**.
- With the default base parcel at the lower-left corner: valid X and Z range is `0` to `16 * parcelCount` on each axis. **Any negative X or Z value is outside the scene.**
- Y axis minimum is `0` (ground level). There is no hard upper limit but practical rendering stops around 20m per parcel height.

Before placing any entity, confirm its position satisfies:

```
0 ≤ x ≤ 16 * parcelsWide
0 ≤ z ≤ 16 * parcelsDeep
y ≥ 0
```

## Common Model Operations

### Scaling

```typescript
Transform.create(model, {
	position: Vector3.create(8, 0, 8),
	scale: Vector3.create(2, 2, 2), // 2x size
})
```

### Rotation

```typescript
Transform.create(model, {
	position: Vector3.create(8, 0, 8),
	rotation: Quaternion.fromEulerDegrees(0, 90, 0), // Rotate 90° on Y axis
})
```

### Parenting (Attach to Another Entity)

```typescript
const parent = engine.addEntity()
Transform.create(parent, { position: Vector3.create(8, 0, 8) })

const child = engine.addEntity()
Transform.create(child, {
	position: Vector3.create(0, 2, 0), // 2m above parent
	parent: parent,
})
GltfContainer.create(child, { src: 'assets/scene/Models/hat.glb' })
```

### Get Global (World-Space) Position and Rotation

When an entity is parented, `Transform.get(entity).position` returns the **local** position relative to the parent. Use `getWorldPosition` and `getWorldRotation` to get the actual world-space values:

```typescript
import { getWorldPosition, getWorldRotation } from '@dcl/sdk/ecs'

const worldPos = getWorldPosition(engine, childEntity)
console.log(worldPos.x, worldPos.y, worldPos.z)

const worldRot = getWorldRotation(engine, childEntity)
console.log(worldRot.x, worldRot.y, worldRot.z, worldRot.w)
```

Both functions traverse the parent hierarchy to compute the final result. They return a zero vector / identity quaternion if the entity has no `Transform`.

## Free 3D Models

Always check the scene's local asset folder first.

IMPORTANT: Only fetch models from the free catalogs below if the prompt explicitly asks to add new models. Confirm with the user always if they wish to add new models to their scene.

### Creator Hub Asset Packs (2,700+ models)

Read `{baseDir}/../context/asset-packs-catalog.md` for official Decentraland models across 12 themed packs (Cyberpunk, Fantasy, Gallery, Sci-fi, Western, Pirates, etc.) with furniture, structures, decorations, nature, and more.

To use a Creator Hub model:

```bash
# Download from catalog
mkdir -p assets/scene/Models
curl -o assets/scene/Models/arcade_machine.glb "https://builder-items.decentraland.org/contents/bafybei..."
```

```typescript
// Reference in code — must be a local file path
GltfContainer.create(entity, { src: 'assets/scene/Models/arcade_machine.glb' })
```

### Open Source CC0 Models (991 models)

Read `{baseDir}/../context/open-source-3d-assets.md` for free CC0-licensed models from Polygonal Mind, organized by 18 themed collections (MomusPark, Medieval Fair, Cyberpunk, Sci-fi, etc.) with direct GitHub download URLs.

```bash
curl -o assets/scene/Models/tree.glb "https://raw.githubusercontent.com/ToxSam/cc0-models-Polygonal-Mind/main/projects/MomusPark/Tree_01_Art.glb"
```

### How to suggest models

1. Read both catalog files
2. Search for models matching the user's description/theme
3. Suggest specific models with download commands
4. Download selected models into the scene's `assets/scene/Models/` directory
5. Reference them in code with local paths

> **Important**: `GltfContainer` only works with **local files**. Never use external URLs for the model `src` field. Always download models into `models/` first.

### Checking Model Load State

Use `GltfContainerLoadingState` to check if a model has finished loading:

```typescript
import {
	GltfContainer,
	GltfContainerLoadingState,
	LoadingState,
} from '@dcl/sdk/ecs'

engine.addSystem(() => {
	const state = GltfContainerLoadingState.getOrNull(modelEntity)
	if (state && state.currentState === LoadingState.FINISHED) {
		console.log('Model loaded successfully')
	} else if (state && state.currentState === LoadingState.FINISHED_WITH_ERROR) {
		console.log('Model failed to load')
	}
})
```

## Troubleshooting

| Problem                          | Cause                             | Solution                                                                                                    |
| -------------------------------- | --------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| Model not visible                | Wrong file path                   | Verify the file exists at the exact path relative to project root (e.g., `assets/scene/Models/myModel.glb`) |
| Model not visible                | Position outside scene boundaries | Check Transform position is within 0-16 per parcel. Center of 1-parcel scene is (8, 0, 8)                   |
| Model not visible                | Scale is 0 or very small          | Check `Transform.scale` — default is (1,1,1). Try larger values if model was exported very small            |
| Model not visible                | Behind the camera                 | Move the avatar or rotate to look in the model's direction                                                  |
| Model loads but looks wrong      | Y-up vs Z-up mismatch             | Decentraland uses Y-up. Re-export from Blender with "Y Up" checked                                          |
| "FINISHED_WITH_ERROR" load state | Corrupted or unsupported .glb     | Re-export the model. Use `.glb` (binary GLTF) format. Ensure no unsupported extensions                      |
| Clicking model does nothing      | Missing collider                  | Add `visibleMeshesCollisionMask: ColliderLayer.CL_POINTER` to `GltfContainer` or add `MeshCollider`         |

> **Need to optimize models for scene limits?** See the **optimize-scene** skill for triangle budgets and LOD patterns.
> **Need animations from your model?** See the **animations-tweens** skill for playing GLTF animation clips with Animator.

## Model Best Practices

- Keep models under 50MB per file for good loading times
- Use `.glb` format (binary GLTF) — smaller than `.gltf`
- Optimize triangle count: aim for under 1,500 triangles per model for small props
- Use texture atlases when possible to reduce draw calls
- Models with embedded animations can be played with the `Animator` component
- Test model orientation — Decentraland uses Y-up coordinate system
- Materials in models should use PBR (physically-based rendering) for best results
