---
description: Keep your scene UI clear of a mobile device's hardware-reserved margins with the ScreenInsetArea component.
---

# Screen Inset Area

Mobile devices reserve parts of the screen for hardware: the notch or camera cutout, the status bar, the home indicator, and rounded corners. UI drawn underneath these regions is partly hidden or hard to tap. The area that's left — the part of the screen that's actually safe to draw on — is the **screen inset area**.

The `ScreenInsetArea` component wraps your UI and automatically constrains it to that safe region, reading the current insets reported by the device.

{% hint style="info" %}
**📱 Mobile only:** This component only changes anything on the **mobile client**, where the device reports real inset values (notch, home indicator, etc.). On the **desktop client** the insets are `(0, 0, 0, 0)`, so `ScreenInsetArea` has no effect and your UI renders exactly as it would without it. You can leave it in your code for all platforms — it's safe to always wrap mobile-sensitive UI in it.
{% endhint %}

## Use the component

Import `ScreenInsetArea` from `@dcl/sdk/react-ecs` and wrap the UI you want to keep inside the safe region. Anything you nest inside it is positioned within the device's insets.

```tsx
import ReactEcs, { ReactEcsRenderer, UiEntity, ScreenInsetArea } from '@dcl/sdk/react-ecs'
import { Color4 } from '@dcl/sdk/math'

export function setupUi() {
  ReactEcsRenderer.setUiRenderer(() => (
    <ScreenInsetArea>
      {/* This child fills the safe area exactly */}
      <UiEntity
        uiTransform={{ width: '100%', height: '100%' }}
        uiBackground={{ color: Color4.create(0, 0, 0, 0.5) }}
      />
    </ScreenInsetArea>
  ))
}
```

A child sized to `width: '100%'` and `height: '100%'` fills the inset area exactly, since `ScreenInsetArea` spans from the inset boundaries to the canvas edges. Place your own layout inside it as you normally would.

## How it positions itself

`ScreenInsetArea` positions itself absolutely, using the inset values the device reports. Because it owns its own placement, the `positionType` and `position` fields of its `uiTransform` are reserved: any value you set for them is ignored. All other `uiTransform` properties (such as `padding`, `flexDirection`, or `alignItems`) and all other UI components (`uiBackground`, `onMouseDown`, etc.) work as usual.

```tsx
<ScreenInsetArea
  uiTransform={{
    // positionType and position here are ignored — the component sets them
    padding: 10,
    flexDirection: 'column',
    alignItems: 'center',
  }}
>
  {/* your UI */}
</ScreenInsetArea>
```

The component reacts automatically when the device reports new inset values (for example on rotation or when system bars appear or hide), so your UI stays inside the safe region without any extra code.

## Hardware insets vs. the system HUD

The screen inset area is about **hardware-reserved** regions of the physical device. It is *not* the same as the regions reserved by Decentraland's own on-screen controls (joystick, chat, profile, interaction button). For keeping UI clear of those system controls, see [Mobile safe area](safe-area.md).

Use both together: wrap your UI in `ScreenInsetArea` to stay clear of the hardware, and follow the [Mobile safe area](safe-area.md) guidance to stay clear of the system HUD.

## Related

* [Mobile safe area](safe-area.md) — the screen regions reserved for the system HUD.
* [UI best practices for mobile](ui-best-practices.md)
* [Detect the platform from code](detect-platform.md) — use `isMobile()` to branch layouts.
* [Onscreen UI](../2d-ui/onscreen-ui.md)
