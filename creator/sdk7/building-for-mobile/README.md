---
description: Build Decentraland scenes that look great and play well on the mobile app.
---

# Building for Mobile

Decentraland is now available on mobile. Players can explore your scenes from iOS and Android devices, in addition to the desktop client and the web. As a creator, you can adapt your scenes so they look great and play well on touch-based devices.

This section covers how to detect mobile clients from your scene code, how to preview and test your scene on a real device from the Creator Hub or the CLI, the safe-area rules for placing UI on small screens, and how to get your scene featured in the mobile Discover section.

## Get the mobile app

* [Download for iOS (App Store)](https://apps.apple.com/app/decentraland/id6478403840?utm_source=docs&utm_medium=internal&utm_content=ios)
* [Download for Android (Google Play)](https://play.google.com/store/apps/details?id=org.decentraland.godotexplorer&pcampaignid=web_share&utm_source=docs&utm_medium=internal&utm_content=android)

{% hint style="info" %}
**For beta testers:** the iOS build is also available via [TestFlight](https://testflight.apple.com/join/KF4r3jlU?utm_source=docs&utm_medium=internal&utm_content=ios) for power users who want to try unreleased changes.
{% endhint %}

## In this section

* [Detect the platform from code](detect-platform.md) — use `@dcl/sdk/platform` to branch logic for mobile, desktop, or web.
* [Preview your scene on mobile](preview-on-mobile.md) — preview directly on a phone via the Creator Hub or the CLI.
* [Mobile safe area](safe-area.md) — the screen regions reserved for system controls and the device's hardware margins (notch, home indicator); keep scene UI clear of them, with the `ScreenInsetArea` component or by hand.
* [UI best practices for mobile](ui-best-practices.md) — DOs and DON'Ts, sizing recommendations, and current limitations.
* [Input on mobile](input-on-mobile.md) — touch-friendly input mappings and which `InputAction`s to avoid.
* [Get featured on mobile Discover](get-featured.md) — submission requirements for the mobile Discover section.

## Quick checklist

Before publishing a scene that should work well on mobile, make sure that:

* [ ] You have previewed the scene on a real device — see [Preview your scene on mobile](preview-on-mobile.md).
* [ ] All critical UI elements stay inside the [mobile safe area](safe-area.md).
* [ ] Your UI is sized large enough for touch — follow the [3× recommendation](ui-best-practices.md#sizing).
* [ ] Key actions are not bound to `IA_ACTION_3`–`IA_ACTION_6` (the `1`/`2`/`3`/`4` keys), which are not easily reachable on mobile — see [Input on mobile](input-on-mobile.md).
* [ ] Your scene's [performance](../optimizing/performance-optimization.md) is comfortable on a mid-range phone.
