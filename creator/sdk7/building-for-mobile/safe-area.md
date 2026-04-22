---
description: The screen regions reserved for client controls on mobile.
---

# Mobile Safe Area

When your scene runs on the mobile client, the Decentraland app overlays its own controls on top of the screen — joystick, chat, profile, camera controls, and the interaction button. These regions are reserved: any scene UI that lands inside them will visually clash with the controls and may also be unreachable for touch input.

The **mobile safe area** is the rule of thumb for where scene UI can safely live.

## Reserved regions

Do not place scene UI inside any of these zones:

| Region | Reserved for |
|---|---|
| **Left side** | Chat, Search, Profile, on-screen Joystick, Emotes |
| **Top right** | Profile access, camera controls |
| **Bottom right** | Interaction button(s) |

The remaining area — broadly the center and the top-center of the screen — is yours to use for scene UI.

<figure><img src="../../../.gitbook/assets/mobile-safe-area-unsafe.png" alt="Mobile screen with the reserved regions highlighted"><figcaption><p>Reserved regions on the mobile client: the left side, top right, and bottom right are owned by the system controls.</p></figcaption></figure>

<figure><img src="../../../.gitbook/assets/mobile-safe-area.png" alt="Mobile screen with the safe area highlighted"><figcaption><p>The safe area for scene UI on mobile — broadly the center and top-center of the screen.</p></figcaption></figure>

## Where to put scene UI

Following the safe area, the recommended placements are:

* **Center of screen** — for actionable dialogs (anything the player needs to read and respond to).
* **Top-center of screen** — for non-actionable messages, status, and notifications.
* **Center-bottom (above the interaction button)** — for context-sensitive hints.

## Why it matters

Scene UI that overlaps the reserved regions will:

* Be partially hidden behind the joystick, interaction button, or camera controls.
* Compete for taps with the system controls — players will accidentally trigger one or the other.
* Make your scene feel broken on mobile, which hurts featuring and retention.

## Related

* [UI best practices for mobile](ui-best-practices.md)
* [Detect the platform from code](detect-platform.md) — use `isMobile()` to swap layouts.
* [On-screen UI](../2d-ui/onscreen-ui.md)
* [UX & UI Guide](../design-experience/ux-ui-guide.md)
