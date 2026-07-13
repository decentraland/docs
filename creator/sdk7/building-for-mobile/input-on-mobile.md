---
description: How input actions map to touch on the Decentraland mobile client.
---

# Input on Mobile

Decentraland's input system is designed to be device-agnostic. The same [`InputAction`](../interactivity/button-events/click-events.md#pointer-buttons) enum that the SDK exposes on desktop is also routed from the on-screen controls on mobile, so most scenes work without any changes. There are, however, a few rules and gotchas worth knowing when you're building for touch.

For the full input model, see [Click events](../interactivity/button-events/click-events.md). This page focuses on what is mobile-specific.

## What touch maps to

Every [`InputAction`](../interactivity/button-events/click-events.md#pointer-buttons) that exists on desktop is also available on the mobile client — the on-screen controls simply route touch to the same SDK inputs. This means any scene that relies on the standard [`InputAction`](../interactivity/button-events/click-events.md#pointer-buttons) values will work on mobile out of the box.

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
| **Camera drag** | — | Rotates the camera; not exposed as an [`InputAction`](../interactivity/button-events/click-events.md#pointer-buttons). |

## Choosing reachable actions

In the default layout the `1`/`2`/`3`/`4` buttons (`IA_ACTION_3`–`IA_ACTION_6`) sit behind the "+" menu and are awkward to reach mid-game. For a key action, prefer a directly visible button — `IA_POINTER`, `IA_PRIMARY`, `IA_SECONDARY`, or `IA_JUMP` — or a [proximity trigger](../interactivity/button-events/proximity-events.md) that fires automatically as the player approaches. Alternatively, [customize the controls](#customizing-the-on-screen-controls) to surface the exact button you need.

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
