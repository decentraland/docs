---
name: add-3d-models
description: Add 3D models (.glb/.gltf) to a Decentraland scene using GltfContainer. Covers loading, positioning, scaling, colliders, parenting, and browsing 2,700+ free assets from the Creator Hub catalog and 991 CC0 models. Use when the user wants to add models, import GLB files, find free 3D assets, or set up model colliders. Do NOT use for materials/textures (see advanced-rendering) or model animations (see animations-tweens).
---

# Adding 3D Models to Decentraland Scenes

## RULE: Check bounding boxes before placing models

**A model's `Transform.position` is its local origin, not its visual extent.** Vegetation and large structural models often extend 6–12 m beyond their origin. A tree placed at x=2 can render at x=–10 — outside scene bounds and invisible to players.

**Before placing any GLB model, determine its actual bounding box** by reading GLTF accessor `min`/`max` fields from the binary:

```js
node -e "
const buf = require('fs').readFileSync('assets/scene/Models/Tree_01_Art.glb');
const jsonLen = buf.readUInt32LE(12);
const json = JSON.parse(buf.slice(20, 20+jsonLen));
json.accessors.filter(a=>a.type==='VEC3').forEach(a=>
  console.log('min', a.min, 'max', a.max));
"
```

Then compute the safe placement zone:

```
safeMinX = -bbox.minX + edgeMargin (≥1 m)
safeMinZ = -bbox.minZ + edgeMargin (≥1 m)
safeMaxX = sceneMaxX - bbox.maxX - edgeMargin
safeMaxZ = sceneMaxZ - bbox.maxZ - edgeMargin
```

Place the origin only within `[safeMinX, safeMaxX]` × `[safeMinZ, safeMaxZ]`.

**When the bounding box is unknown**, use a conservative **12 m buffer from all edges** for trees and large foliage, or **3 m** for small props (rocks, torches, etc.).

---

## RULE: Account for model depth before neighboring entities

Two models don't overlap just because their origins are different. Always verify that `origin ± extent` of every model does not intersect any neighboring model's bounding box. Pay special attention to:

- **Deep arch / gateway models** — their bounding box often extends far in ±Z (e.g. an arch that is 18 m tall may also extend 14 m in front and behind the face). Check the Z extent before placing anything near the arch.
- **Rotated models** — rotating 90° around Y swaps the X and Z extents. A 4 m wide wall rotated 90° becomes 4 m deep in Z, not in X. Recompute extents after applying rotation.

---

## RULE: Single-sided models — orient the rendered face toward players

Many GLB models use back-face culling: only one face of each polygon is visible. A flat wall, floor panel, or thin structural element will be **invisible** when viewed from the wrong side.

**How to determine facing:**

- The rendered face is the one whose polygon normals point outward (toward the viewer).
- For flat panels (Z depth ≈ 0) the rendered face is typically toward local **−Z** in the GLB coordinate system.
- Y rotation transforms the facing direction:
  - rot= 0°: rendered face → global −Z (faces south / toward lower Z)
  - rot= 90°: rendered face → global +X (faces east / toward higher X)
  - rot=180°: rendered face → global +Z (faces north / toward higher Z)
  - rot=270°: rendered face → global −X (faces west / toward lower X)

**Rules:**

1. Always orient single-sided models so their rendered face points toward where players will stand.
2. When players approach from both sides (e.g. a temple wall visible from inside and outside), add a second copy of the model at the same position rotated 180° around its face axis.
3. Prefer models with double-sided geometry (built-in by the artist) for elements that need to be visible from all angles — columns, obelisks, tree trunks, etc.

---

## RULE: Text labels must be in open air — no occlusion by geometry

`TextShape` labels that have a Billboard component are rendered in world space and can be occluded by any solid geometry between the label and the camera.

The exception to these rules is if the label is mounted on a wall, without a Billboard component.

**Placement checklist before committing a text position:**

1. **No solid model within 2 m in any horizontal direction.** Measure from the label origin to the nearest wall, column, arch face, pedestal, or door.
2. **Height clearance:** Place at `y ≥ 0.3 m above any geometry directly below` and `y < height of surrounding walls` if you want the label inside a room, or `y > wall height` if you want it visible from anywhere.
3. **Billboard mode for interactive labels:** Always add `core::Billboard` with `billboardMode: 2` (Y-axis billboard) so the label faces the player from any angle. Without Billboard the label is only legible when the player faces a specific direction.
4. **Prefer open-area placement:** Put approach hints on the path before the building, in-room hints at the room center rather than near walls.
5. **Verify with bounding box math:** For a label near an arch or complex structure, compute whether the structure's bounding box intersects the label position — if `struct.origin ± struct.extent` includes the label's X/Z, the structure may partially occlude it.

---

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

> Use `visibleMeshesCollisionMask: 3, invisibleMeshesCollisionMask: 0` when the model has **no `_collider` meshes** (the common case for Creator Hub asset packs). Use `visibleMeshesCollisionMask: 0, invisibleMeshesCollisionMask: 3` only when the model has `_collider` meshes. Never set both to non-zero values simultaneously.

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

Before finalizing any entity with a `GltfContainer`, check whether the GLB contains collision meshes — any mesh whose name includes the substring `_collider`:

```js
node -e "
const buf = require('fs').readFileSync('assets/scene/Models/myModel.glb');
const jsonLen = buf.readUInt32LE(12);
const json = JSON.parse(buf.slice(20, 20+jsonLen));
const hasCollider = json.meshes?.some(m => m.name && m.name.includes('_collider'));
console.log(hasCollider ? 'HAS _collider meshes' : 'NO _collider meshes');
"
```

### Two correct patterns — pick one, never mix

**Model HAS `_collider` meshes** — use the invisible meshes for collision; disable visible mesh collision to avoid doubling:

```json
"visibleMeshesCollisionMask": 0,
"invisibleMeshesCollisionMask": 3
```

```typescript
GltfContainer.create(model, {
	src: 'assets/scene/Models/building.glb',
	visibleMeshesCollisionMask: 0, // visual mesh: no collision
	invisibleMeshesCollisionMask: 3, // _collider meshes: physics (2) + pointer (1)
})
```

**Model has NO `_collider` meshes** —
evaluate whether a `MeshCollider` is needed. Add one for any model that is a walkable surface, a wall, or needs to be clickable. If colliders are needed, put all collision on the visible mesh; invisible layer does nothing:

```json
"visibleMeshesCollisionMask": 3,
"invisibleMeshesCollisionMask": 0
```

```typescript
GltfContainer.create(model, {
	src: 'assets/scene/Models/building.glb',
	visibleMeshesCollisionMask: 3, // visual mesh: physics (2) + pointer (1)
	invisibleMeshesCollisionMask: 0,
})
```

Choose the mask based on the model's role:

| Role                                   | visibleMeshesCollisionMask | Why                                                      |
| -------------------------------------- | -------------------------- | -------------------------------------------------------- |
| Interactive (player clicks it)         | `3`                        | Needs physics (block walking) + pointer (detect clicks)  |
| Structural / decorative wall or prop   | `3`                        | Block walking, also block clicks (avoid click confusion) |
| Clickable-only with no physical bulk   | `1`                        | Detects clicks without blocking player movement          |
| Purely decorative, no collision needed | `0`                        | No interaction at all                                    |

### Anti-pattern — DO NOT USE

```json
"visibleMeshesCollisionMask": 2,
"invisibleMeshesCollisionMask": 3
```

This mixes both patterns. When the model has no `_collider` meshes (the common case), `invisibleMeshesCollisionMask: 3` does nothing, and `visibleMeshesCollisionMask: 2` gives physics but **misses CL_POINTER** — the model cannot be clicked. When the model does have `_collider` meshes, `visibleMeshesCollisionMask: 2` adds redundant physics on the visual mesh.

Always verify `_collider` mesh presence before setting either mask.

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

Before fetching any model, confirm with the user — name the asset and where it would come from. The user may have their own assets in mind or may not want new files added to the project. See `agent-behaviors.md` in `overview/` for the full confirmation pattern.

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

| Problem                           | Cause                              | Solution                                                                                                                                                                      |
| --------------------------------- | ---------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Model not visible                 | Wrong file path                    | Verify the file exists at the exact path relative to project root (e.g., `assets/scene/Models/myModel.glb`)                                                                   |
| Model not visible                 | Position outside scene boundaries  | Check Transform position is within 0-16 per parcel. Center of 1-parcel scene is (8, 0, 8)                                                                                     |
| Model not visible                 | Scale is 0 or very small           | Check `Transform.scale` — default is (1,1,1). Try larger values if model was exported very small                                                                              |
| Model not visible                 | Behind the camera                  | Move the avatar or rotate to look in the model's direction                                                                                                                    |
| Model loads but looks wrong       | Y-up vs Z-up mismatch              | Decentraland uses Y-up. Re-export from Blender with "Y Up" checked                                                                                                            |
| "FINISHED_WITH_ERROR" load state  | Corrupted or unsupported .glb      | Re-export the model. Use `.glb` (binary GLTF) format. Ensure no unsupported extensions                                                                                        |
| Clicking model does nothing       | CL_POINTER not set on visible mesh | If the model has no `_collider` meshes, set `visibleMeshesCollisionMask: 3`. Setting `invisibleMeshesCollisionMask: 3` alone does nothing when there are no invisible meshes. |
| Can click through a model's walls | CL_POINTER not on visible mesh     | If the model has no `_collider` meshes, set `visibleMeshesCollisionMask: 3` (or at minimum `1`) so the visible geometry blocks pointer rays.                                  |

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
