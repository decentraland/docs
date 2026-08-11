---
description: DOs and DON'Ts for designing scene UIs that work well on mobile.
---

# UI Best Practices for Mobile

There is no single proven recipe for Decentraland mobile UI yet — the platform is new and we are still iterating. The recommendations on this page are the current best practices, distilled from work on real scenes. Treat them as a starting point and test on a real device.

## DOs

* **Design mobile-specific UIs**, or vary your UI by screen size and platform. Use [`isMobile()`](detect-platform.md) to branch.
* **Keep critical UI inside the [safe area](safe-area.md).** The device's hardware margins (notch, status bar, home indicator) are [cleared for you by default](safe-area.md#device-hardware-insets-screeninsetarea) — just don't opt out with `screenInset: 'none'`. The Decentraland system HUD regions still need to be avoided by hand.
* **Minimize options.** Show only what the player needs right now and progressively disclose the rest.
* **Place actionable dialogs at the center of the screen** — anywhere a player needs to read and respond.
* **Place non-actionable messages at the top-center** — status, notifications, and ambient information.

## DON'Ts

* **Don't size UI elements purely in pixels without a virtual screen in mind.** Pixel values are scaled against the `virtualWidth` / `virtualHeight` reference resolution described in [On-screen UI](../2d-ui/onscreen-ui.md#screen-virtual-scale) — `1600x720` by default on mobile, `1920x1080` on desktop and web. Know which reference resolution your pixel values are authored against, pass it explicitly if it isn't the default, and pair it with platform-aware sizing. Only disable the virtual screen (by passing a size of `0`) if you genuinely want raw canvas pixels.
* **Don't place elements outside the safe area.** They will clash with the system controls.
* **Don't rely on small buttons.** Small targets are unreliable to tap on a touch screen.
* **Don't bind key actions to `IA_ACTION_3`–`IA_ACTION_6`** (the `1`/`2`/`3`/`4` keys on a keyboard). They are not easily reachable on mobile. See [Input on mobile](input-on-mobile.md).

## Sizing

The single most useful recommendation when adapting an existing desktop UI to mobile:

> **Design and test the UI on desktop first, then scale UI sizes by 3× for mobile.**

Combined with the SDK's `virtualWidth` / `virtualHeight` setup, this gives you readable text, comfortably tappable buttons, and a layout that holds up across devices. Always confirm the result on a real phone — see [Preview on mobile](preview-on-mobile.md).

Note that part of that scaling can come for free: if you let the virtual screen default per platform, mobile uses a `1600x720` reference against desktop's `1920x1080`, so the same pixel value already renders larger relative to the screen on a phone. Measure on a device before adding a full 3× on top of it.

## Current limitations

These limitations apply to scene UI on the current mobile client. They are tracked and expected to be lifted over time.

* **`borderRadius` is not supported on mobile yet.** Rounded corners, set via the `borderRadius` property of `uiTransform`, will render as squared on the mobile client. Plan your visual design accordingly, or branch the styling on `isMobile()`.

If you hit a limitation that is not listed here, please [report it](../debugging/report-bug.md) so we can document and prioritize it.

## Related

* [Mobile safe area](safe-area.md)
* [Detect the platform from code](detect-platform.md)
* [On-screen UI](../2d-ui/onscreen-ui.md)
* [UX & UI Guide](../design-experience/ux-ui-guide.md)
