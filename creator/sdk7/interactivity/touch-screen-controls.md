---
description: Configure the native on-screen touch controls for your scene.
---

# On-screen Controls

The `TouchScreenControls` component lets your scene customize the native on-screen touch controls that a player sees on the mobile client — the virtual joystick and the on-screen gamepad. Use it to declutter the HUD, hide the joystick or crosshair, change what the large central button does, or swap a button's glyph for your own icon.

{% hint style="info" %}
**📔 Note**: The screenshots on this page are placeholders and will be replaced with real captures.
{% endhint %}

![Default on-screen controls](../images/touch-controls/touch-controls-default.svg)

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
* `mainAction` (_InputAction_) — the action the large central button triggers. Only gamepad actions are valid (see below). When unset, the default central button (`IA_JUMP`) is kept.
* `touchInputs` (_array_) — per-button overrides. A button that isn't listed keeps its default (shown, with its default glyph). Each entry has:
  * `inputAction` (_InputAction_) — which on-screen button this entry configures.
  * `hide` (_boolean_) — hide this button. Default is `false` (shown).
  * `icon` (_string_, optional) — override the button glyph with a content-mapped texture (an image included in your scene). For the jump button this replaces all of its dynamic states (jump / double-jump / glide). If the path can't be resolved, the built-in glyph is used.

## Which actions map to which buttons

The `InputAction` values used here are the same ones documented in [Input on mobile](../building-for-mobile/input-on-mobile.md) and [Click events](button-events/click-events.md). The actions that map to on-screen buttons are:

* `IA_POINTER` — the interaction button
* `IA_PRIMARY` — the E button
* `IA_SECONDARY` — the F button
* `IA_JUMP` — the large central button (default)
* `IA_ACTION_3` / `IA_ACTION_4` / `IA_ACTION_5` / `IA_ACTION_6` — the 1 / 2 / 3 / 4 buttons

`IA_ANY` and `IA_MODIFIER` are meta values and can't be used here.

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

![Central button with a custom icon and action](../images/touch-controls/custom-main-action.svg)

To replace the native controls entirely, hide them here and build your own touch buttons with [UI Input Binding](../2d-ui/ui_input_binding.md).

## Related

* [UI Input Binding](../2d-ui/ui_input_binding.md)
* [Input on mobile](../building-for-mobile/input-on-mobile.md)
* [Click events](button-events/click-events.md)
* [Detect the platform from code](../building-for-mobile/detect-platform.md)
