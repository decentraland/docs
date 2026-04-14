---
description: Add dynamic physics to wearables with Spring Bones
---

# Spring Bones

<-- [VIDEO PLACEHOLDER]: short clip showing spring bones in action on hair, earrings, and cape wearables -->

## What Are Spring Bones?

Spring bones (also known as jiggle bones or physics bones) are extra bones added to a wearable that move dynamically in response to avatar movement and gravity, rather than being driven by animation clips. They bring life to elements like hair, earrings, capes, belts, ponytails, and other hanging accessories by making them sway, bounce, and settle naturally as the avatar walks, runs, or turns.

Spring bones are **not** part of the base avatar armature. They are additional bones that you add to your wearable's skeleton in Blender (or any 3D editor), and their physics behavior is configured in the Builder after uploading.

This implementation follows the [VRM Spring Bone standard](https://vrm.dev/en/vrm1/springbone/), a widely adopted convention for avatar physics in formats like VRM and MMD.

![](../../images/spring-bones/01_spring_bones_workflow.png)

## How Spring Bones Work

A **spring chain** is a sequence of bones that simulates physics together:

1. **Spring root bone** — The first bone in the chain. It owns the physics configuration (stiffness, gravity, drag, etc.). Identified by having `springbone` anywhere in the bone name (case-insensitive).
2. **Chain members** — Descendant bones of the root. They inherit the root's physics parameters and form the chain.
3. **Chain tip** — The deepest (last) bone in the chain. It defines the geometric endpoint of the chain but is not simulated itself.

A spring chain must have **at least 2 bones** (a root and a tip). A single spring bone on its own won't produce any movement — the simulation needs the root to drive the physics and the tip to define the geometric endpoint. Longer chains (3+ bones) produce smoother, more natural movement for elements like long hair or capes.

All descendants of a spring root bone automatically become part of its chain. Each chain should be **linear** (each bone has at most one child in the chain). Branching chains may produce unexpected behavior.

<-- [IMAGE PLACEHOLDER]: diagram showing a spring chain hierarchy: root → member → member → tip -->

### Example Hierarchy

```
Avatar_Head
├── SpringBone_hair_left        ← spring root (has physics config)
│   ├── SpringBone_hair_left_01 ← chain member (inherits config)
│   │   └── SpringBone_hair_left_tip  ← chain tip (endpoint only)
├── SpringBone_earring_r        ← spring root
│   └── SpringBone_earring_r_tip      ← chain tip
```

### Naming Convention

All spring bone nodes **must** contain the substring `springbone` (case-insensitive) in their name. The substring can appear at any position:

| Node name              | Valid?                   |
| ---------------------- | ------------------------ |
| `SpringBone_hair_left` | ✓                        |
| `hair_springbone_l`    | ✓                        |
| `springbone_earring_r` | ✓                        |
| `ponytail_SPRINGBONE`  | ✓                        |
| `skirt_1`              | ✗ (missing "springbone") |

{% hint style="warning" %} Bones that don't contain `springbone` in their name will not be recognized as spring bones, even if they are children of a spring root bone in the hierarchy. {% endhint %}

### Limits

<-- TODO: replace N and M with final values when defined -->

Each wearable has the following spring bone limits:

- Maximum **N** spring chains per wearable
- Maximum **M** total spring bones (sum of all bones across all chains)
- Maximum chain depth of **N** bones

## Setting Up Spring Bones in Blender

Spring bones are additional bones that you create in Blender beyond the base avatar armature. The physics parameters are configured later in the Builder — you only need to set up the bone hierarchy in Blender.

### Step 1: Add Extra Bones to the Armature

In **Edit Mode**, select the bone from which you want your spring chain to hang (e.g., `Avatar_Head` for hair, or a bone near the ear for earrings). Extrude new bones (`E`) to create your spring chain.

<-- [IMAGE PLACEHOLDER]: Blender screenshot showing extrusion of spring bones from Avatar_Head -->

### Step 2: Name Your Bones

Rename each bone in the chain to include `springbone` in the name. Use a clear, descriptive naming pattern:

- `SpringBone_hair_left` — root
- `SpringBone_hair_left_01` — chain member
- `SpringBone_hair_left_tip` — tip (last bone)

You can follow Blender's left/right naming convention (e.g., `_L` / `_R` or `_left` / `_right`) to use the **Symmetrize** feature for mirroring chains to both sides.

<-- [IMAGE PLACEHOLDER]: Blender screenshot showing properly named spring bone chain in the outliner -->

### Step 3: Position the Bones

Place bones along the path you want the mesh to swing. For hair, follow the strands from root to tip. For earrings, a short chain of 2–3 bones hanging from the ear is usually enough.

The **rest pose** of the bones defines the position the chain tries to return to. Make sure the bones are positioned where you want the mesh to naturally sit when at rest.

### Step 4: Skin Weight the Mesh

Paint the mesh vertices to be influenced by the spring bones, just as you would with any other bone. Vertices near the root should have more influence from the root, and vertices near the tip should follow the tip bone.

<-- [IMAGE PLACEHOLDER]: Blender weight painting example on a hair mesh with spring bones -->

### Step 5: Export

Export your wearable as a `.glb` file as usual. Spring bones are exported as part of the armature.

{% hint style="info" %} Spring bones named with `springbone` are an exception to the general rule that wearables should not have bones outside the base armature. These extra bones are expected and will be detected by the Builder. {% endhint %}

## Configuring Spring Bones in the Builder

After uploading a wearable that contains `springbone`-named bones, the Builder automatically detects them and shows the **Spring Bones** configuration panel.

<-- [IMAGE PLACEHOLDER]: screenshot of the Spring Bones panel in the Builder showing a spring root bone with all parameter sliders -->

From this panel you can configure the physics parameters for each spring root bone. The avatar preview in the Builder will immediately reflect your changes, so you can fine-tune the behavior in real time.

{% hint style="info" %} You cannot add new spring bones from the Builder. The bones must already exist in the uploaded `.glb` file with the correct naming convention. The Builder only lets you configure the physics parameters for detected spring bones. {% endhint %}

### Parameter Reference

#### Stiffness Force

|             |        |
| ----------- | ------ |
| **Range**   | 0 to 4 |
| **Default** | `2.0`  |

Controls how strongly the bone tries to return to its rest pose. This is the restoring force — think of it as the "firmness" of the spring.

- **0**: The bone won't return to rest at all — it will just hang limply under gravity.
- **Low values** (e.g., 0–1): The bone is loose and saggy, swinging freely. Good for long flowing hair or lightweight hanging accessories.
- **High values** (e.g., 3–4): The bone is stiff, staying close to its original position and snapping back quickly. Good for short hair or rigid accessories.

#### Gravity Power

|             |         |
| ----------- | ------- |
| **Range**   | 0 to 2 |
| **Default** | `0`    |

Controls the magnitude of the gravity force pulling on the bone each frame.

- **0**: No gravity effect — the bone is only affected by movement inertia and stiffness.
- **Low values** (e.g., 0.3–0.8): Subtle gravity pull, good for most accessories.
- **High values** (e.g., 1.5–2.0): Strong gravity pull, causing the bone to droop heavily.

#### Gravity Direction

|             |                                |
| ----------- | ------------------------------ |
| **Format**  | X, Y, Z vector                 |
| **Default** | `X: 0, Y: -1, Z: 0` (downward) |

Sets the direction of the gravity force in world space. By default, gravity pulls downward (Y = -1), simulating natural gravity.

| X   | Y   | Z   | Effect                                |
| --- | --- | --- | ------------------------------------- |
| 0   | -1  | 0   | Downward (natural gravity, default)   |
| 0   | 1   | 0   | Upward (floating/supernatural effect) |
| 1   | 0   | 0   | Leftward                              |
| -1  | 0   | 0   | Rightward                             |
| 0   | 0   | 1   | Forward                               |
| 0   | 0   | -1  | Backward                              |

You can combine axes (e.g., `X: 0.5, Y: -0.5, Z: 0`) for diagonal directions. This is useful for simulating wind-like effects or creating a floating appearance for supernatural characters.

#### Drag Force

|             |       |
| ----------- | ----- |
| **Range**   | 0 – 1 |
| **Default** | `0.5` |

Controls how quickly the bone loses momentum and settles down. Think of it as air resistance or damping.

- **Low values** (e.g., 0–0.2): The bone swings freely for a long time before settling, like a pendulum with little friction.
- **High values** (e.g., 0.7–1.0): The bone settles almost instantly after movement, giving a heavy or dampened feel.
- **1**: The bone barely moves at all — maximum deceleration.

#### Center (Optional)

|             |                      |
| ----------- | -------------------- |
| **Format**  | Bone name (dropdown) |
| **Default** | None                 |

An optional reference bone used to calculate the spring bone's movement relative to a point on the avatar, instead of relative to world space. This prevents the spring chain from swaying excessively when the avatar moves around (walking, running).

**Without a center bone**, springs calculate inertia in world space — every step the avatar takes causes the bones to react as if the whole world moved, resulting in exaggerated swinging during locomotion.

**With a center bone**, the simulation uses that bone's space as the reference frame, so only the avatar's _local_ movements (head turning, body bending) trigger the spring reaction.

Choose the center bone based on where the wearable is located on the body:

| Wearable location                     | Recommended center bone |
| ------------------------------------- | ----------------------- |
| Head (hair, earrings, tiaras)         | `Avatar_Head`           |
| Upper body (capes, necklaces)         | `Avatar_Spine`          |
| Lower body (belts, skirt accessories) | `Avatar_Hips`           |

{% hint style="warning" %} The center bone **must not** be part of any spring chain. It should be a bone from the base avatar armature. {% endhint %}

## Common Use Cases & Recommended Values

These are suggested starting points. Adjust to taste using the Builder's real-time preview.

| Use case | Stiffness | Gravity Power | Gravity Dir | Drag | Center | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| Long hair / ponytail | 1.0 – 2.0 | 0.3 – 0.8 | 0, -1, 0 | 0.3 – 0.5 | `Avatar_Head` | More bones in the chain = smoother movement |
| Short hair | 3.0 – 4.0 | 0 – 0.3 | 0, -1, 0 | 0.4 – 0.6 | `Avatar_Head` | Higher stiffness keeps hair close to the head |
| Earrings | 0.5 – 1.5 | 0.5 – 1.0 | 0, -1, 0 | 0.4 – 0.6 | `Avatar_Head` | Short chain (2–3 bones), lower stiffness for dangling |
| Cape / cloak | 1.0 – 2.0 | 0.5 – 1.0 | 0, -1, 0 | 0.3 – 0.5 | `Avatar_Spine` | Multiple parallel chains for width |
| Belt / hanging ornament | 1.5 – 2.5 | 0.3 – 0.8 | 0, -1, 0 | 0.5 – 0.7 | `Avatar_Hips` | Higher drag for heavier items |
| Floating / ghost effect | 1.0 – 2.0 | 0.5 – 1.0 | 0, 1, 0 | 0.3 – 0.5 | `Avatar_Spine` | Upward gravity for supernatural look |

## Limitations

Keep the following limitations in mind when working with spring bones:

- **No colliders**: Spring bones do not collide with the avatar's body or other bones. Chains may clip through the body mesh in extreme poses. Future versions may add collider support.
- **No cross-wearable interactions**: Each wearable's spring chains are independent. Chains from different wearables don't affect each other.
- **No global wind**: There is no scene-level wind force. You can approximate a wind effect per-wearable by adjusting the `gravityDir` to a diagonal direction.
- **Performance on remote avatars**: Spring bone simulation is disabled for avatars that are far from the local player to save performance. Nearby avatars will display spring bone physics normally.
- **Alternative clients compatibility**: Wearables with spring bones are backward-compatible with alternative clients and older Explorer versions, but the spring bone elements will remain static. In some cases, there may be minor visual issues.

## Technical Reference

Spring bone parameters are stored inside the `.glb` file using a glTF vendor extension called `DCL_spring_bone_joint`. When you configure parameters in the Builder, they are written directly into this extension in the file.

You don't need to interact with this format directly — the Builder handles reading and writing it. This section is provided for reference.

### glTF Extension Structure

```json
{
  "asset": {"version": "2.0"},
  "extensionsUsed": ["DCL_spring_bone_joint"],
  "nodes": [
    {"name": "Avatar_Head", "children": [1, 2]},
    {
      "name": "SpringBone_earring_r",
      "children": [3],
      "extensions": {
        "DCL_spring_bone_joint": {
          "version": 1,
          "stiffness": 0.5,
          "gravityPower": 1.0,
          "gravityDir": [0, -1, 0],
          "drag": 0.6,
          "isRoot": true,
          "center": "Avatar_Hips"
        }
      }
    },
    {
      "name": "SpringBone_hair_left",
      "children": [4],
      "extensions": {
        "DCL_spring_bone_joint": {
          "version": 1,
          "stiffness": 2.0,
          "gravityPower": 0.8,
          "gravityDir": [0, -1, 0],
          "drag": 0.4,
          "isRoot": true,
          "center": "Avatar_Head"
        }
      }
    },
    {"name": "springbone_earring_r_tip"},
    {"name": "SpringBone_hair_left_tip"}
  ]
}
```

### Extension Parameters

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `version` | integer | required (`1`) | Schema version for forward compatibility. |
| `stiffness` | float | `1.0` | Restoring force toward rest pose. |
| `gravityPower` | float | `1.0` | Magnitude of gravity force. |
| `gravityDir` | vec3 | `[0, -1, 0]` | Direction of gravity in world space. |
| `drag` | float | `0.5` | Damping / deceleration factor. |
| `isRoot` | boolean | `true` | Whether this node is the root of a spring chain. |
| `center` | string | none | Name of a reference bone for relative inertia calculation. |

{% hint style="info" %} The extension defaults listed above are the glTF schema defaults. The Builder uses different practical defaults (stiffness: 2.0, gravityPower: 0, drag: 0.5) which are better suited for most wearables. {% endhint %}
