# Composite Format Reference

This document defines the `main.composite` JSON declarative format that defines all of the entities that are loaded as the initial state of the scene.

It's best to load heavy assets through the composite, as they load faster. Assets in the composite can also be easily visually adjusted by the user through the Creator Hub.

This file must exist at `assets/scene/main.composite`.

## Structure

```json
{
  "version": 1,
  "components": [
    {
      "name": "namespace::ComponentName",
      "data": {
        "<entity-id>": {
          "json": { ... component data ... }
        }
      }
    }
  ]
}
```

## DO NOT Include

These components are auto-generated and must NOT be in the composite:

- **`inspector::Nodes`** — the Inspector creates this automatically from existing entities. Including it causes SDK build error: `"inspector::Nodes is not defined and there is no schema to define it"`
- **`inspector::SceneMetadata`** — the Inspector creates this from `scene.json`. Same build error if included.
- **`inspector::Selection`**, **`inspector::UIState`** — editor-only, stripped during save
- **`composite::root`** — auto-generated, never include manually
- **`asset-packs::ActionTypes`** — auto-generated from the engine's action type registry

## jsonSchema Rules

**`core::` components** — do NOT include `jsonSchema`. The SDK knows these natively.

```json
{ "name": "core::Transform", "data": { "512": { "json": { ... } } } }
```

**Non-core components** (`asset-packs::*`, `core-schema::*`) — MUST include `jsonSchema`. Without it the SDK build fails. Copy the jsonSchema from the asset's composite in the catalog.

```json
{ "name": "asset-packs::Actions", "jsonSchema": { ... }, "data": { "512": { "json": { ... } } } }
```

**How to get the jsonSchema:** When you read an asset's composite from the catalog (`node_modules/@dcl/asset-packs/catalog.json`), each non-core component already has its `jsonSchema`. Copy it as-is into the scene composite.

## Entity ID Allocation

| ID   | Purpose                                                                                   |
| ---- | ----------------------------------------------------------------------------------------- |
| 0    | RootEntity — holds `inspector::Nodes`, `inspector::SceneMetadata`, `asset-packs::Counter` |
| 1    | PlayerEntity (reserved, must appear in Nodes)                                             |
| 2    | CameraEntity (reserved, must appear in Nodes)                                             |
| 512+ | User entities (first = 512, then 513, 514, ...)                                           |

**For existing scenes:** Read the current composite, find the highest entity ID, allocate new ones starting from `highest + 1`.

## Required Components (Every Scene)

**NOTE:** Do NOT include `inspector::Nodes` or `inspector::SceneMetadata` in the composite. The Inspector creates these automatically when opening the scene. Including them causes the SDK build to fail.

### 1. core::Transform (on every entity)

```json
{
	"name": "core::Transform",
	"data": {
		"512": {
			"json": {
				"position": { "x": 8, "y": 0, "z": 8 },
				"scale": { "x": 1, "y": 1, "z": 1 },
				"rotation": { "x": 0, "y": 0, "z": 0, "w": 1 },
				"parent": 0
			}
		}
	}
}
```

**Notes:**

- `rotation` is a quaternion (x, y, z, w). Default = `{x:0, y:0, z:0, w:1}` (no rotation)
- `parent: 0` means child of RootEntity (top-level)
- Each parcel is 16m x 16m. A 1x1 scene center is at x=8, z=8

### 4. core-schema::Name (on every user entity)

```json
{
	"name": "core-schema::Name",
	"data": {
		"512": { "json": { "value": "My Entity Name" } }
	}
}
```

## Common Components

### core::GltfContainer (3D models from catalog)

```json
{
	"name": "core::GltfContainer",
	"data": {
		"512": {
			"json": {
				"src": "assets/asset-packs/arcade_machine_-_black/Arcade_Machine_Black.glb",
				"visibleMeshesCollisionMask": 0,
				"invisibleMeshesCollisionMask": 3
			}
		}
	}
}
```

**Asset path format:** `assets/asset-packs/<slugified-asset-name>/<filename>`

- Slug rule: `asset.name.trim().replaceAll(' ', '_').toLowerCase()`
- Example: "Tree Forest Pink 01" → `assets/asset-packs/tree_forest_pink_01/Tree_Forest_Pink_01.glb`

**Default collision masks:** If not provided, set `visibleMeshesCollisionMask: 0` and `invisibleMeshesCollisionMask: 3` (CL_POINTER + CL_PHYSICS).

### core::MeshRenderer (primitive shapes)

```json
{
	"name": "core::MeshRenderer",
	"data": {
		"512": {
			"json": {
				"mesh": { "$case": "box", "box": {} }
			}
		}
	}
}
```

Mesh types: `box`, `sphere`, `cylinder`, `plane`.

Cylinder options: `{ "$case": "cylinder", "cylinder": { "radiusTop": 0.5, "radiusBottom": 0.5 } }`

### core::MeshCollider

```json
{
	"name": "core::MeshCollider",
	"data": {
		"512": {
			"json": {
				"collisionMask": 1,
				"mesh": { "$case": "box", "box": {} }
			}
		}
	}
}
```

**Collision mask values:**

- `0` = CL_NONE
- `1` = CL_POINTER (mouse/pointer raycasting)
- `2` = CL_PHYSICS (player physics, walls, floors)
- `3` = CL_POINTER + CL_PHYSICS (both)

### core::Material

**PBR material:**

```json
{
	"name": "core::Material",
	"data": {
		"512": {
			"json": {
				"material": {
					"$case": "pbr",
					"pbr": {
						"albedoColor": { "r": 1, "g": 0, "b": 0, "a": 1 },
						"metallic": 0.5,
						"roughness": 0.5,
						"texture": {
							"tex": {
								"$case": "texture",
								"texture": {
									"src": "assets/scene/Images/image.png",
									"wrapMode": 0,
									"filterMode": 0
								}
							}
						}
					}
				}
			}
		}
	}
}
```

**Unlit material (for video screens):**

```json
{
	"material": {
		"$case": "unlit",
		"unlit": {
			"texture": {
				"tex": {
					"$case": "videoTexture",
					"videoTexture": { "videoPlayerEntity": 512 }
				}
			}
		}
	}
}
```

### core::TextShape

```json
{
	"name": "core::TextShape",
	"data": {
		"512": {
			"json": {
				"text": "Hello World",
				"fontSize": 3,
				"textColor": { "r": 1, "g": 1, "b": 1, "a": 1 }
			}
		}
	}
}
```

### core::AudioSource

```json
{
	"name": "core::AudioSource",
	"data": {
		"512": {
			"json": {
				"audioClipUrl": "assets/scene/Sounds/music.mp3",
				"playing": true,
				"volume": 1,
				"loop": true,
				"global": false
			}
		}
	}
}
```

### core::VideoPlayer

```json
{
	"name": "core::VideoPlayer",
	"data": {
		"512": {
			"json": {
				"src": "https://example.com/video.mp4",
				"playing": true,
				"volume": 1,
				"loop": true
			}
		}
	}
}
```

### core::PointerEvents

```json
{
	"name": "core::PointerEvents",
	"data": {
		"512": {
			"json": {
				"pointerEvents": [
					{
						"eventType": 1,
						"eventInfo": {
							"button": 1,
							"hoverText": "Click me",
							"maxDistance": 10,
							"showFeedback": true
						}
					}
				]
			}
		}
	}
}
```

### core::Animator

```json
{
	"name": "core::Animator",
	"data": {
		"512": {
			"json": {
				"states": [
					{ "clip": "idle", "playing": true, "loop": true },
					{ "clip": "walk", "playing": false, "loop": true }
				]
			}
		}
	}
}
```

### core::Billboard

```json
{
	"name": "core::Billboard",
	"data": {
		"512": {
			"json": {
				"billboardMode": 7
			}
		}
	}
}
```

Modes: 0=NONE, 1=X, 2=Y, 4=Z, 7=ALL (1+2+4).

### core::VisibilityComponent

```json
{
	"name": "core::VisibilityComponent",
	"data": {
		"512": {
			"json": { "visible": false }
		}
	}
}
```

### core::LightSource

```json
{
	"name": "core::LightSource",
	"data": {
		"512": {
			"json": {
				"active": true,
				"color": { "r": 1, "g": 1, "b": 1 },
				"intensity": 16000,
				"range": -1,
				"shadow": true,
				"type": { "$case": "point", "point": {} }
			}
		}
	}
}
```

Light types: `point`, `spot`.

### core::Tween (movement/rotation animation)

```json
{
	"name": "core::Tween",
	"data": {
		"512": {
			"json": {
				"duration": 5000,
				"easingFunction": 0,
				"mode": {
					"$case": "move",
					"move": {
						"start": { "x": 0, "y": 0, "z": 0 },
						"end": { "x": 5, "y": 0, "z": 0 }
					}
				},
				"playing": true
			}
		}
	}
}
```

Modes: `move`, `rotate`, `scale`.

### core::NftShape

```json
{
	"name": "core::NftShape",
	"data": {
		"512": {
			"json": {
				"urn": "urn:decentraland:ethereum:erc721:0x06012c8cf97bead5deae237070f9587f8e7a266d:558536",
				"style": 0,
				"color": { "r": 0.6, "g": 0.25, "b": 1 }
			}
		}
	}
}
```

## Component Grouping Pattern

Components share entity IDs across the `data` map. All components for entity 512 have their data under key `"512"`:

```json
{
	"version": 1,
	"components": [
		{
			"name": "core::Transform",
			"data": {
				"512": {
					"json": {
						"position": { "x": 8, "y": 0, "z": 8 },
						"scale": { "x": 1, "y": 1, "z": 1 },
						"rotation": { "x": 0, "y": 0, "z": 0, "w": 1 },
						"parent": 0
					}
				},
				"513": {
					"json": {
						"position": { "x": 4, "y": 0, "z": 4 },
						"scale": { "x": 1, "y": 1, "z": 1 },
						"rotation": { "x": 0, "y": 0, "z": 0, "w": 1 },
						"parent": 0
					}
				}
			}
		},
		{
			"name": "core::GltfContainer",
			"data": {
				"512": {
					"json": {
						"src": "assets/asset-packs/pack1/asset1/Model.glb",
						"visibleMeshesCollisionMask": 0,
						"invisibleMeshesCollisionMask": 3
					}
				},
				"513": {
					"json": {
						"src": "assets/asset-packs/pack2/asset2/Model.glb",
						"visibleMeshesCollisionMask": 0,
						"invisibleMeshesCollisionMask": 3
					}
				}
			}
		},
		{
			"name": "core-schema::Name",
			"data": {
				"512": { "json": { "value": "Table" } },
				"513": { "json": { "value": "Chair" } }
			}
		}
	]
}
```

## inspector::SceneMetadata

The `inspector::SceneMetadata` component in the composite must match `scene.json`:

```json
{
	"name": "inspector::SceneMetadata",
	"data": {
		"0": {
			"json": {
				"name": "Same as display.title",
				"description": "Same as display.description",
				"layout": {
					"base": { "x": 0, "y": 0 },
					"parcels": [
						{ "x": 0, "y": 0 },
						{ "x": 1, "y": 0 }
					]
				}
			}
		}
	}
}
```

**Note:** In scene.json parcels use string format `"0,0"`, in SceneMetadata they use object format `{ "x": 0, "y": 0 }`.

## Validation Checklist

Before writing a composite, verify:

- [ ] `version` is `1`
- [ ] NO `inspector::Nodes` or `inspector::SceneMetadata` — the Inspector creates these automatically
- [ ] NO `composite::root` or `asset-packs::ActionTypes` — auto-generated by engine
- [ ] Every user entity (512+) has `core::Transform` and `core-schema::Name`
- [ ] No duplicate entity IDs across the composite
- [ ] No duplicate entity IDs with entities created via code with an explicit ID
- [ ] `core::` components do NOT have `jsonSchema`
- [ ] Non-core components (`asset-packs::*`, `core-schema::*`) MUST have `jsonSchema` (copied from catalog)
- [ ] All `GltfContainer.src` paths use slugified name format: `assets/asset-packs/<slug>/<filename>`
- [ ] All referenced asset files were downloaded to disk (GLB, audio, images)
- [ ] Default collision masks set on GltfContainer (`visibleMeshesCollisionMask: 0`, `invisibleMeshesCollisionMask: 3`)
- [ ] All positions within parcel bounds (16m per parcel)
- [ ] `asset-packs::Counter` must exist on entity 0, and have `value` = highest allocated component ID
- [ ] No `{self}`, `{assetPath}`, or placeholder strings — all resolved to concrete values
- [ ] Component names use base names (e.g., `asset-packs::Actions`, not `asset-packs::Actions-v1`)
- [ ] The project must have the `@dcl/asset-packs` library as a dependency to be able to use a composite file

## Post-Write Validation

After writing the composite, **run the SDK build** to verify:

```bash
npx sdk-commands build
```

The build must pass with zero errors. If it fails, the composite is invalid. Common errors:

- `"X is not defined and there is no schema to define it"` → missing `jsonSchema` on non-core component, or `inspector::*` component that shouldn't be there
- TypeScript errors → fix generated scripts
