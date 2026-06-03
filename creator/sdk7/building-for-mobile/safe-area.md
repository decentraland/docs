---
description: The screen regions reserved for client controls on mobile.
---

# Mobile Safe Area

When your scene runs on the mobile client, the Decentraland app overlays its own controls on top of the screen — joystick, chat, profile, camera controls, and the interaction button. These regions are reserved: any scene UI that lands inside them will visually clash with the controls and may also be unreachable for touch input.

The **mobile safe area** defines exactly where scene UI can safely live without clashing with the system HUD.

{% hint style="info" %}
All values below use normalized coordinates `[0.0 – 1.0]` based on a **1600 × 720 px landscape** reference resolution. Always use normalized values so your layout adapts to any screen size. Always verify on a real device using the [preview QR code](preview-on-mobile.md).
{% endhint %}

## Reserved margins

The system HUD occupies the outer edges on all four sides. Do not place scene UI inside these regions:

| Edge | Reserved for | Size |
|---|---|---|
| **Left** | Chat, joystick, emotes | 480 px — 30% of width |
| **Right** | Profile, action buttons | 400 px — 25% of width |
| **Top** | System bar | 58 px — 8% of height |
| **Bottom** | System bar | 58 px — 8% of height |

```
// Minimum safe insets (normalized)
margin: { left: 0.30, right: 0.25, top: 0.08, bottom: 0.08 }
```

<figure><img src="../../../.gitbook/assets/mobile-safe-area-unsafe.png" alt="Mobile screen with the reserved regions highlighted"><figcaption><p>Reserved regions on the mobile client: left side, top-right, and bottom-right are owned by system controls.</p></figcaption></figure>

## Center safe zone

The recommended area for all scene UI is the center band of the screen. It gives you **720 × 605 px** of usable space:

| | Pixels | Normalized |
|---|---|---|
| **x start** | 480 px | 0.30 |
| **x end** | 1200 px | 0.75 |
| **y start** | 58 px | 0.08 |
| **y end** | 662 px | 0.92 |

```
// Center safe zone (normalized)
safeArea: {
  x: [ 0.30, 0.75 ],  // 480 – 1200 px  →  45% of screen width
  y: [ 0.08, 0.92 ]   // 58 – 662 px    →  84% of screen height
}
```

<figure><img src="../../../.gitbook/assets/mobile-safe-area.png" alt="Mobile screen with the safe area highlighted"><figcaption><p>The center safe zone: 720 × 605 px, from x 30%–75% and y 8%–92%.</p></figcaption></figure>

## Right-side gap (small elements only)

Between the Profile avatar (top-right) and the action button cluster (bottom-right) there is a narrow gap where small UI elements — icons, counters, status indicators — can live. Keep elements here to a maximum of **48 × 48 px** to avoid crowding the controls.

| | Pixels | Normalized |
|---|---|---|
| **x range** | 1200 – 1600 px | 0.75 – 1.0 |
| **y range** | 158 – 360 px | 0.22 – 0.50 |

```
// Right-side gap (normalized)
rightGap: {
  x: [ 0.75, 1.0  ],  // 1200 – 1600 px
  y: [ 0.22, 0.50 ]   // 158 – 360 px
}
```

## Where to put scene UI

* **Center of screen** — actionable dialogs, anything the player needs to read and respond to.
* **Top-center** — non-actionable messages, status, and notifications.
* **Center-bottom (above the interaction button)** — context-sensitive hints.
* **Right-side gap** — small icons or counters only (max 48 × 48 px).

## Why it matters

Scene UI that overlaps the reserved regions will:

* Be partially hidden behind the joystick, interaction button, or camera controls.
* Compete for taps with the system controls — players will accidentally trigger one or the other.
* Make your scene feel broken on mobile, which hurts featuring and retention.

{% hint style="info" %}
The reserved regions on this page belong to the Decentraland **system HUD**. They are separate from the device's own **hardware-reserved** margins (notch, status bar, home indicator). To keep UI clear of those, wrap it in the [`ScreenInsetArea` component](screen-inset-area.md).
{% endhint %}

## Related

* [Screen inset area](screen-inset-area.md) — keep UI clear of the device's hardware-reserved margins.
* [UI best practices for mobile](ui-best-practices.md)
* [Detect the platform from code](detect-platform.md) — use `isMobile()` to swap layouts.
* [On-screen UI](../2d-ui/onscreen-ui.md)
* [UX & UI Guide](../design-experience/ux-ui-guide.md)
