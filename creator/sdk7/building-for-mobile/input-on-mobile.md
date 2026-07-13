---
description: How input actions map to touch on the Decentraland mobile client.
---

# Input on Mobile

Decentraland's input system is designed to be device-agnostic. The same `InputAction` enum that the SDK exposes on desktop is also routed from the on-screen controls on mobile, so most scenes work without any changes. There are, however, a few rules and gotchas worth knowing when you're building for touch.

For the full input model, see [Click events](../interactivity/button-events/click-events.md). This page focuses on what is mobile-specific.

## What touch maps to

Every `InputAction` that exists on desktop is also available on the mobile client — the on-screen controls simply route touch to the same SDK inputs. This means any scene that relies on the standard `InputAction` values will work on mobile out of the box.

<figure><img src="../../images/touch-controls/touch-controls-default.jpg" alt="Default on-screen controls"><figcaption><p>Default on-screen controls</p></figcaption></figure>

The on-screen controls map to input actions as follows:

| Control | InputAction | Notes |
| --- | --- | --- |
| **On-screen joystick** | `IA_FORWARD` / `IA_BACKWARD` / `IA_LEFT` / `IA_RIGHT` | Drives avatar movement. |
| **Interaction button** (bottom right) | `IA_POINTER` | The left mouse button on desktop; fires against whatever the player is aiming at. |
| **E button** | `IA_PRIMARY` | The `E` key on desktop. |
| **F button** | `IA_SECONDARY` | The `F` key on desktop. |
| **Jump button** | `IA_JUMP` | The `Space` key on desktop. By default the largest, most reachable button — but a scene can reconfigure or hide it (see [Customizing the on-screen controls](#customizing-the-on-screen-controls)). |
| **1 / 2 / 3 / 4 buttons** | `IA_ACTION_3` / `IA_ACTION_4` / `IA_ACTION_5` / `IA_ACTION_6` | In the default layout these live behind a secondary "+" menu (see below). |
| **Camera drag** | — | Rotates the camera; not exposed as an `InputAction`. |

## Inputs to avoid for key actions on mobile

All `InputAction` values are reachable on mobile, but in the **default layout** `IA_ACTION_3`–`IA_ACTION_6` (the `1`/`2`/`3`/`4` buttons) are tucked away behind the secondary "+" menu and are **not easily reachable during gameplay**. If your scene uses them as primary actions, mobile players won't be able to trigger them comfortably.

{% hint style="info" %}
A scene that customizes the controls can surface these buttons directly: the "+" menu only appears when more than four buttons are visible, so hiding higher-priority buttons pulls `1`–`4` up into reach. See [How the button layout works](../interactivity/touch-screen-controls.md#how-the-button-layout-works). The guidance below applies to the default layout.
{% endhint %}

Avoid binding key actions to:

* `IA_ACTION_3` — the `1` key on desktop / `1` button on mobile
* `IA_ACTION_4` — the `2` key on desktop / `2` button on mobile
* `IA_ACTION_5` — the `3` key on desktop / `3` button on mobile
* `IA_ACTION_6` — the `4` key on desktop / `4` button on mobile

Prefer instead:

* `IA_POINTER` for the main tap / interaction button
* `IA_PRIMARY` for the E button action
* `IA_SECONDARY` for the F button action
* `IA_JUMP` when an action maps naturally to jumping (it's the largest and most reachable button on the mobile HUD)
* Proximity-based triggers (see [Proximity Events](../interactivity/button-events/proximity-events.md)) when an action should fire automatically as the player approaches an entity

## Cursor lock

The [`PointerLock` component](../interactivity/button-events/click-events.md#lock-or-unlock-the-cursor) is a desktop-client concept (locked vs. unlocked mouse cursor). It does not apply to touch on mobile and is safe to leave in your scene — it has no effect there.

## Customizing the on-screen controls

Scenes can reconfigure these on-screen controls — hide the joystick or crosshair, hide any button (including jump), change what the central button does, re-icon buttons, or replace them with custom UI. See [On-screen Controls](../interactivity/touch-screen-controls.md) and [UI Input Binding](../2d-ui/ui_input_binding.md).

<figure><img src="../../images/touch-controls/custom-main-action.jpg" alt="Customized on-screen controls"><figcaption><p>Customized on-screen controls: a re-iconed central button</p></figcaption></figure>

## Related

* [On-screen Controls](../interactivity/touch-screen-controls.md)
* [UI Input Binding](../2d-ui/ui_input_binding.md)
* [Click events](../interactivity/button-events/click-events.md)
* [Proximity Events](../interactivity/button-events/proximity-events.md)
* [Detect the platform from code](detect-platform.md)
* [UI best practices for mobile](ui-best-practices.md)
