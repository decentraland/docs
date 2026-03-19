---
description: Apply forces and impulses to the player's avatar
---

# Player Physics

You can apply physical forces to the player's avatar from your scene's code. This allows you to create gameplay mechanics like launch pads, wind zones, knockback effects, explosions, and more.

There are two kinds of force you can apply:

* **Impulse**: A one-shot instantaneous push. Use this for sudden discrete effects like launching the player into the air or knocking them back.
* **Continuous force**: A sustained push applied every tick for as long as it's active. Use this for ongoing effects like wind zones, water currents, or gravity fields.

Both are applied through the `Physics` helper, imported from `@dcl/sdk/ecs`.

{% hint style="warning" %}
**📔 Note**: These forces only affect the local player's avatar. Other players see the changes on other player's positions, but the forces themselves aren not synced to other players in multiplayer. Each player's physics run locally on their own instance.
{% endhint %}

## Apply an impulse

Use `Physics.applyImpulseToPlayer()` to give the player a one-shot push in a given direction.

```ts
import { Physics } from '@dcl/sdk/ecs'
import { Vector3 } from '@dcl/sdk/math'

// Launch the player straight up
Physics.applyImpulseToPlayer(Vector3.create(0, 20, 0))
```

The vector you pass sets both the direction and the magnitude of the impulse. A larger vector produces a stronger push.

You can also pass a direction and a magnitude separately. In this case, the direction vector is normalized automatically:

```ts
import { Physics } from '@dcl/sdk/ecs'
import { Vector3 } from '@dcl/sdk/math'

// Launch the player upward with a magnitude of 20
Physics.applyImpulseToPlayer(Vector3.create(0, 1, 0), 20)
```

If you call `applyImpulseToPlayer()` multiple times within the same frame, the impulses are accumulated — they are added together and applied as a single combined impulse.

### Trigger an impulse on player entry

A common pattern is to trigger an impulse when the player steps into an area. Use a trigger area to detect when the player enters:

```ts
import { Physics, TriggerArea, triggerAreaEventsSystem, ColliderLayer, MeshRenderer, Transform } from '@dcl/sdk/ecs'
import { Vector3 } from '@dcl/sdk/math'

const launchPad = engine.addEntity()
Transform.create(launchPad, { position: Vector3.create(8, 0, 8) })
MeshRenderer.setBox(launchPad)
TriggerArea.setBox(launchPad, ColliderLayer.CL_PLAYER)

triggerAreaEventsSystem.onTriggerEnter(launchPad, () => {
	Physics.applyImpulseToPlayer(Vector3.create(0, 25, 0))
})
```

## Apply a continuous force

Use `Physics.applyForceToPlayer()` to apply a sustained force to the player. Unlike an impulse, this force is applied every tick as long as it remains active.

You must pass a **source entity** as the first argument. The source entity serves to have a way to refer back to this force, so you can update or remove it later. The position of the source entity is not relevant to the direction of the force.

```ts
import { Physics } from '@dcl/sdk/ecs'
import { Vector3 } from '@dcl/sdk/math'

const windZoneEntity = engine.addEntity()

// Push the player to the right continuously
Physics.applyForceToPlayer(windZoneEntity, Vector3.create(10, 0, 0))
```

If you call `applyForceToPlayer()` again with the same source entity, it replaces the previous force from that source. If multiple force sources are accumulated their vectors are summed each tick.

### Remove a continuous force

To stop applying a force, call `Physics.removeForceFromPlayer()` with a reference to the source entity that was used to create the force:

```ts
Physics.removeForceFromPlayer(windZoneEntity)
```


### Apply a force for a limited duration

Use `Physics.applyForceToPlayerForDuration()` to apply a force for a specific amount of time. The duration is in milliseconds. The force is automatically removed when the time elapses.

```ts
import { Physics } from '@dcl/sdk/ecs'
import { Vector3 } from '@dcl/sdk/math'

const gustEntity = engine.addEntity()

// Apply a strong upward force for 1.5 seconds
Physics.applyForceToPlayerForDuration(gustEntity, Vector3.create(0, 15, 0), 1500)
```

### Wind zone example

This example creates a wind tunnel that pushes the player while they're inside it, and stops when they leave:

```ts
import { Physics, TriggerArea, triggerAreaEventsSystem, ColliderLayer, MeshRenderer, MeshCollider, Transform } from '@dcl/sdk/ecs'
import { Vector3 } from '@dcl/sdk/math'

const windTunnel = engine.addEntity()
Transform.create(windTunnel, {
	position: Vector3.create(8, 1, 8),
	scale: Vector3.create(4, 3, 4),
})
MeshRenderer.setBox(windTunnel)
TriggerArea.setBox(windTunnel, ColliderLayer.CL_PLAYER)

triggerAreaEventsSystem.onTriggerEnter(windTunnel, () => {
	Physics.applyForceToPlayer(windTunnel, Vector3.create(0, 8, 0))
})

triggerAreaEventsSystem.onTriggerExit(windTunnel, () => {
	Physics.removeForceFromPlayer(windTunnel)
})
```

## Apply a repulsion force

Use `Physics.applyRepulsionForceToPlayer()` to push the player away from a point in space, like an explosion or a force field. The force is stronger when the player is closer to the source, and weakens with distance based on the radius and falloff.

```ts
import { Physics, timers } from '@dcl/sdk/ecs'
import { Vector3 } from '@dcl/sdk/math'

const explosionSource = engine.addEntity()
Transform.create(explosionSource, { position: Vector3.create(8, 1, 8) })

// Push the player away from position (8, 1, 8), up to 10 meters away
Physics.applyRepulsionForceToPlayer(
	explosionSource,
	Vector3.create(8, 1, 8),  // origin of the repulsion
	50,                         // magnitude
	10,                         // radius of effect in meters
)

// Remove force after half a second
timers.setTimeout(()=>{
    Physics.removeForceFromPlayer(this.entity)
}, 500)
```


<!-- 
## Local vs world space

By default, forces and impulses are applied in **world space** — the x, y, and z axes are fixed relative to the scene. You can instead apply them in **local space**, which is relative to the player's current facing direction. This is useful for mechanics like a "forward boost" that pushes the player in the direction they're looking.

To specify the space, pass a `PhysicsForceSpace` value as the last argument:

```ts
import { Physics, PhysicsForceSpace } from '@dcl/sdk/ecs'
import { Vector3 } from '@dcl/sdk/math'

// Push the player forward relative to where they're facing
Physics.applyImpulseToPlayer(
	Vector3.create(0, 5, 15),
	PhysicsForceSpace.PFS_LOCAL
)
```

```ts
import { Physics, PhysicsForceSpace } from '@dcl/sdk/ecs'
import { Vector3 } from '@dcl/sdk/math'

const boostEntity = engine.addEntity()

// Continuously push the player forward relative to their facing direction
Physics.applyForceToPlayer(
	boostEntity,
	Vector3.create(0, 0, 10),
	PhysicsForceSpace.PFS_LOCAL
)
```

The `PhysicsForceSpace` enum has two values:

* `PhysicsForceSpace.PFS_WORLD`: Default. Force is applied in world-space coordinates.
* `PhysicsForceSpace.PFS_LOCAL`: Force is rotated to match the player's current rotation before being applied.
 -->
