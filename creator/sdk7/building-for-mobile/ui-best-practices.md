---
description: DOs and DON'Ts for designing scene UIs that work well on mobile.
---

# UI Best Practices for Mobile

There is no single proven recipe for Decentraland mobile UI yet — the platform is new and we are still iterating. The recommendations on this page are the current best practices, distilled from work on real scenes. Treat them as a starting point and test on a real device.

## DOs

* **Design mobile-specific UIs**, or vary your UI by screen size and platform. Use [`isMobile()`](detect-platform.md) to branch.
* **Keep critical UI inside the [safe area](safe-area.md).** The device's hardware margins (notch, status bar, home indicator) are [cleared for you by default](safe-area.md#device-hardware-insets-screeninsetarea) — just don't opt out with `screenInset: 'none'`. The Decentraland system HUD regions are a separate area, and `screenInset: 'interactable'` covers part of that job: it positions your UI in the rectangle the explorer designates for scene UI. On mobile that clears the left-hand controls; the action buttons on the bottom right are drawn over the area by design, so keep the [reserved margins](safe-area.md#reserved-margins) below in mind for those corners. `'interactable'` requires mobile client `1.12.1` or newer — older clients report no margins at all and the UI covers the whole screen, and note that iOS receives a given client release later than Android.
* **Minimize options.** Show only what the player needs right now and progressively disclose the rest.
* **Place actionable dialogs at the center of the screen** — anywhere a player needs to read and respond.
* **Place non-actionable messages at the top-center** — status, notifications, and ambient information.

## DON'Ts

* **Don't size UI elements purely in pixels without a virtual screen in mind.** Pixel values are scaled against the `virtualWidth` / `virtualHeight` reference resolution described in [On-screen UI](../2d-ui/onscreen-ui.md#screen-virtual-scale) — `1600x720` by default on mobile, `1920x1080` on desktop and web. Know which reference resolution your pixel values are authored against, pass it explicitly if it isn't the default, and pair it with platform-aware sizing. Only disable the virtual screen (by passing a size of `0`) if you genuinely want raw canvas pixels.
* **Don't place elements outside the safe area.** They will clash with the system controls.
* **Don't rely on small buttons.** Small targets are unreliable to tap on a touch screen.
* **Don't bind key actions to `IA_ACTION_3`–`IA_ACTION_6`** (the `1`/`2`/`3`/`4` keys on a keyboard). They are not easily reachable on mobile. See [Input on mobile](input-on-mobile.md).

## Sizing

The old rule of thumb — *design on desktop, then scale UI sizes by 3× for mobile* — predates two SDK changes and should no longer be applied blindly. Most of that 3× is now applied for you:

* **`devicePixelRatio` takes no part in UI layout.** Pixel-sized UI now renders `devicePixelRatio` times larger than it used to — typically **2–3× on a phone**, and on retina laptops too. There is no opt-out.
* **The virtual screen defaults per platform**, `1600x720` on mobile against `1920x1080` on desktop and web, so the same pixel value already covers about 1.2× more of the screen on a phone.

Start from your desktop sizes unchanged, measure on a real device — see [Preview on mobile](preview-on-mobile.md) — and scale up only where tap targets or text actually come up short. Branch with [`isMobile()`](detect-platform.md) when the two genuinely need to differ.

## Current limitations

These limitations apply to scene UI on the current mobile client. They are tracked and expected to be lifted over time.

* **`borderRadius` is not supported on mobile yet.** Rounded corners, set via the `borderRadius` property of `uiTransform`, will render as squared on the mobile client. Plan your visual design accordingly, or branch the styling on `isMobile()`.

If you hit a limitation that is not listed here, please [report it](../debugging/report-bug.md) so we can document and prioritize it.

## Related

* [Mobile safe area](safe-area.md)
* [Detect the platform from code](detect-platform.md)
* [On-screen UI](../2d-ui/onscreen-ui.md)
* [UX & UI Guide](../design-experience/ux-ui-guide.md)
