---
description: Configure the native on-screen touch controls for your scene.
---

# On-screen Controls

The `TouchScreenControls` component lets your scene customize the native on-screen touch controls that a player sees on the mobile client — the virtual joystick and the on-screen gamepad. Use it to declutter the HUD, hide the joystick or crosshair, change what the large central button does, or swap a button's glyph for your own icon.

<figure><img src="../../images/touch-controls/touch-controls-default.jpg" alt="Default on-screen controls"><figcaption><p>Default on-screen controls</p></figcaption></figure>

The component is applied automatically while the player is inside your scene, and reverts to the defaults (nothing hidden, jump as the central button) as soon as they leave — so scenes that don't use it are unaffected. It only affects platforms with native on-screen controls; it's a no-op on desktop and has no effect in VR.

## Adding the component

`TouchScreenControls` provides a set of convenience helpers. They always write the component onto the scene's `RootEntity` (where the client reads it) and merge with the current value, so you can call them from anywhere:

```ts
import { TouchScreenControls, InputAction } from '@dcl/sdk/ecs'

export function main() {
	// Make the large central button trigger the "primary" action instead of jump
	TouchScreenControls.setMainAction(InputAction.IA_PRIMARY)

	// Hide the crosshair and the native joystick
	TouchScreenControls.hideCrosshair()
	TouchScreenControls.hideJoystick()

	// Hide specific gamepad buttons
	TouchScreenControls.hide([InputAction.IA_SECONDARY])
}
```

Available helpers:

* `hideJoystick()` — hide the native virtual joystick.
* `hideCrosshair()` — hide the on-screen crosshair / reticle.
* `setMainAction(action)` — set which action the large central button triggers.
* `hide(actions)` — hide the given on-screen gamepad buttons (merged into the current config).
* `hideAll()` — hide every on-screen gamepad button.
* `showAll()` — show every on-screen gamepad button (clears the hide list).

You can also write the raw component directly on `engine.RootEntity` if you need full control (for example, to set a custom `icon`):

```ts
import { engine, TouchScreenControls, InputAction } from '@dcl/sdk/ecs'

export function main() {
	TouchScreenControls.createOrReplace(engine.RootEntity, {
		hideCrosshair: true,
		mainAction: InputAction.IA_PRIMARY,
		touchInputs: [{ inputAction: InputAction.IA_PRIMARY, icon: 'images/grab.png' }],
	})
}
```

## Properties

* `hideJoystick` (_boolean_) — hides the native virtual movement joystick.
* `hideCrosshair` (_boolean_) — hides the on-screen crosshair / reticle.
* `mainAction` (_InputAction_) — moves this action to the front of the button stack, making it the large central button; the other buttons keep their priority order. Only gamepad actions are valid (see below). When unset, the first visible button (`IA_JUMP` by default) is the central button. See [How the button layout works](#how-the-button-layout-works).
* `touchInputs` (_array_) — per-button overrides. A button that isn't listed keeps its default (shown, with its default glyph). Each entry has:
  * `inputAction` (_InputAction_) — which on-screen button this entry configures.
  * `hide` (_boolean_) — hide this button. Default is `false` (shown). Any button can be hidden, **including `IA_JUMP`**; the remaining buttons cascade up to fill its place.
  * `icon` (_string_, optional) — override the button glyph with a content-mapped texture (an image included in your scene). For the jump button this replaces all of its dynamic states (jump / double-jump / glide). If the path can't be resolved, the built-in glyph is used.

## Which actions map to which buttons

The `InputAction` values used here are the same ones documented in [Input on mobile](../building-for-mobile/input-on-mobile.md) and [Click events](button-events/click-events.md). The actions that map to on-screen buttons are:

* `IA_POINTER` — the interaction button
* `IA_PRIMARY` — the E button
* `IA_SECONDARY` — the F button
* `IA_JUMP` — the large central button (default)
* `IA_ACTION_3` / `IA_ACTION_4` / `IA_ACTION_5` / `IA_ACTION_6` — the 1 / 2 / 3 / 4 buttons

`IA_ANY` and `IA_MODIFIER` are meta values and can't be used here.

## How the button layout works

The on-screen buttons form a single **priority stack**, in this fixed order:

1. `IA_JUMP`
2. `IA_POINTER`
3. `IA_PRIMARY` (E)
4. `IA_SECONDARY` (F)
5. `IA_ACTION_3` (1)
6. `IA_ACTION_4` (2)
7. `IA_ACTION_5` (3)
8. `IA_ACTION_6` (4)

The on-screen positions are fixed; the **visible** buttons fill those positions from the top of the list down. This means:

* **Hiding a button cascades the rest up.** When you hide a button, every lower-priority button moves up to fill the gap. Any button can be hidden, **including jump** — hide it and `IA_POINTER` takes the central spot.
* **The large central button is always the first visible button.** By default that's `IA_JUMP`; if jump is hidden, the next visible button becomes the central one.
* **`mainAction` moves an action to the front.** The chosen action jumps to the front of the stack and becomes the central button; every other button keeps the normal order. If the `mainAction` target is also hidden, it stays hidden (hiding wins).
* **The "+" overflow menu only appears when more than four buttons are visible.** With four or fewer visible buttons, they all show directly and there is no "+". With more than four, the first four (the central button plus three around it) show directly and the rest sit behind the "+" toggle.

So hiding higher-priority buttons is also how you surface `IA_ACTION_3`–`IA_ACTION_6`: drop the button count to four or fewer and they show directly instead of behind the "+".

## Example

Hide the joystick and the crosshair, remove the F button, and make the central button fire `IA_PRIMARY` using a custom icon shipped with the scene:

```ts
import { engine, TouchScreenControls, InputAction } from '@dcl/sdk/ecs'

export function main() {
	TouchScreenControls.createOrReplace(engine.RootEntity, {
		hideJoystick: true,
		hideCrosshair: true,
		mainAction: InputAction.IA_PRIMARY,
		touchInputs: [
			{ inputAction: InputAction.IA_SECONDARY, hide: true },
			{ inputAction: InputAction.IA_PRIMARY, icon: 'images/grab.png' },
		],
	})
}
```

<figure><img src="../../images/touch-controls/custom-main-action.jpg" alt="Central button with a custom icon and action"><figcaption><p>Central button with a custom icon and action</p></figcaption></figure>

To replace the native controls entirely, hide them here and build your own touch buttons with [UI Input Binding](../2d-ui/ui_input_binding.md).

## Related

* [UI Input Binding](../2d-ui/ui_input_binding.md)
* [Input on mobile](../building-for-mobile/input-on-mobile.md)
* [Click events](button-events/click-events.md)
* [Detect the platform from code](../building-for-mobile/detect-platform.md)
