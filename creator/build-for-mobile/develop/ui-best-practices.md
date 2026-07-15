---
description: DOs and DON'Ts for designing scene UIs that work well on mobile.
---

# UI Best Practices for Mobile

There is no single proven recipe for Decentraland mobile UI yet — the platform is new and we are still iterating. The recommendations on this page are the current best practices, distilled from work on real scenes. Treat them as a starting point and test on a real device.

## DOs

* **Design mobile-specific UIs**, or vary your UI by screen size and platform. Use [`isMobile()`](detect-platform.md) to branch.
* **Keep critical UI inside the [safe area](safe-area.md)**, and wrap it in [`ScreenInsetArea`](safe-area.md#device-hardware-insets-screeninsetarea) to clear the device's hardware margins (notch, status bar, home indicator).
* **Minimize options.** Show only what the player needs right now and progressively disclose the rest.
* **Place actionable dialogs at the center of the screen** — anywhere a player needs to read and respond.
* **Place non-actionable messages at the top-center** — status, notifications, and ambient information.

## DON'Ts

* **Don't size UI elements purely in pixels.** Pixel-only layouts will look different on every device. Use the `virtualWidth` / `virtualHeight` mechanism described in [On-screen UI](../../sdk7/2d-ui/onscreen-ui.md#screen-virtual-scale) and pair it with platform-aware sizing.
* **Don't place elements outside the safe area.** They will clash with the system controls.
* **Don't rely on small buttons.** Small targets are unreliable to tap on a touch screen.
* **Don't bind key actions to `IA_ACTION_3`–`IA_ACTION_6`** (the `1`/`2`/`3`/`4` keys on a keyboard). They are not easily reachable on mobile. See [Input on mobile](input-on-mobile.md).

## Sizing

The single most useful recommendation when adapting an existing desktop UI to mobile:

> **Design and test the UI on desktop first, then scale UI sizes by 3× for mobile.**

Combined with the SDK's `virtualWidth` / `virtualHeight` setup, this gives you readable text, comfortably tappable buttons, and a layout that holds up across devices. Always confirm the result on a real phone — see [Preview on mobile](preview-on-mobile.md).

## Current limitations

These limitations apply to scene UI on the current mobile client. They are tracked and expected to be lifted over time.

* **`borderRadius` is not supported on mobile yet.** Rounded corners, set via the `borderRadius` property of `uiTransform`, will render as squared on the mobile client. Plan your visual design accordingly, or branch the styling on `isMobile()`.

If you hit a limitation that is not listed here, please [report it](../../sdk7/debugging/report-bug.md) so we can document and prioritize it.

## Related

* [Mobile safe area](safe-area.md)
* [Detect the platform from code](detect-platform.md)
* [On-screen UI](../../sdk7/2d-ui/onscreen-ui.md)
* [UX & UI Guide](../../sdk7/design-experience/ux-ui-guide.md)
