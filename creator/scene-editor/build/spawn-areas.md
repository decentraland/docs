description: Using Spawn Areas to set the Spawning position & Spawn Camera position visually.
---

# Spawn Areas

The creator can set the **Spawn Position** and **Spawn Camera Target** in the Creator Hub by editing a **Spawn Area** Entity. 

This gives the creator a visual way of setting the Spawn Area and the direction the avatar will be facing when spawned as done with other objects in the scene. 

<img src="../../../.gitbook/assets/spawn-entity-scene-editor.png" width="200" />

The Spawn Area is composed of two different entities that work together:

* **Spawn** Entity: can be found inside the **Player** Entity. Defines the actual Spawn Point of the Player.

<img src="../../../.gitbook/assets/spawn-entity.png" width="200" />

* **Camera Target** Entity: can be found inside the **Spawn Area** Entity. Move it to the desired direction in which the Player will be spawned.

<img src="../../../.gitbook/assets/spawn-camera-entity.png" width="200" />

## Changing Spawn Areas

**Spawn Areas** and their **Camera Target** can be moved directly from the Scene Editor as with any other object in the scene, or modify it's values manually (as with Transforms in other Entities).

### Parameters

When a Spawn Area is selected, the creator is able to see and set the following values on the Components section:

<img src="../../../.gitbook/assets/default-spawn-point-component.png" width="600" />

* **Position**: Avatar's Spawn Position.
* **Spawn Camera Target**: The direction the camera (and the avatar) will be facing once spawned into the scene. When modifying the Spawn Camera Target.
* **Randomized Area**: Adds randomness to the Spawn Area in meters, enabling and disabling it with the **Don't randomize** toggle. When enabled, an area is rendered in the Scene Editor, showing the area in which the Player can randonmly be spawned in.

<img src="../../../.gitbook/assets/spawn-point-randomized.png" width="600" />

## Multiple Spawn Areas

<img src="../../../.gitbook/assets/spawn-area-multiple-scene-editor.png" width="600" />

The creator can have multiple **Spawn Areas** defined. To create a new Spawn Area, follow these steps:

1. Select any Spawn Area, **spawn1** being the default.
2. All the Spawn Areas show on the right Panel. You can add new ones by clicking on **+ Add New Spawn Area** <img src="../../../.gitbook/assets/spawn-area-add-new.png" width="200" style="vertical-align: middle;" alt="icon">.

<img src="../../../.gitbook/assets/spawn-area-multiple-components.png" width="600" />

3. Enable the **Main Spawn** <img src="../../../.gitbook/assets/spawn-areas-main-spawn-toggle.png" width="100" style="vertical-align: middle;" alt="icon"> of the desired Spawn Area. If there are many Spawn areas toggled as **Main Spawn**, the player will randonmly appear in one of them.
4. Preview the scene.



