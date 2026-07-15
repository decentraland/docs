---
description: Detect whether your scene is running on mobile, desktop, or web.
---

# Detect the Platform from Code

The `@dcl/sdk/platform` module lets your scene check which client a player is using, so you can adapt your UI, controls, and gameplay accordingly. This is the recommended way to deliver a great experience across all clients without forking your scene.

## Available functions

```ts
import { getPlatform, isMobile, isDesktop, isWeb } from '@dcl/sdk/platform'
```

* **`getPlatform()`** — returns the current platform as `'mobile' | 'desktop' | 'web' | null`. Returns `null` until the explorer has reported its platform back to the scene (this happens shortly after the scene starts).
* **`isMobile()`** — returns `true` if the player is on the mobile client.
* **`isDesktop()`** — returns `true` if the player is on the desktop client.
* **`isWeb()`** — returns `true` if the player is on the web client.

{% hint style="warning" %}
**📔 Note**: These functions read a value that is populated asynchronously when the scene starts, and nothing guarantees it's already available by the time `main()` runs. If you call them too early, they may still return `null` / `false`. To be safe, defer any platform-dependent setup until `getPlatform()` returns something other than `null`, for example by checking inside a system:

```ts
import { engine } from '@dcl/sdk/ecs'
import { getPlatform } from '@dcl/sdk/platform'

function platformCheckSystem() {
  if (getPlatform() === null) return
  engine.removeSystem(platformCheckSystem)
  setupUI()
}

engine.addSystem(platformCheckSystem)
```
{% endhint %}

## Branch your UI by platform

A common pattern is to set up a different UI for mobile and desktop players:

```ts
import { isMobile, isDesktop } from '@dcl/sdk/platform'

function setupUI() {
  if (isMobile()) {
    // Larger buttons, simpler layout for touch
    createMobileUI()
  } else if (isDesktop()) {
    // Denser layout tuned for keyboard and mouse
    createDesktopUI()
  }
}
```

You can also use the same pattern to:

* Show or hide on-screen instructions tailored to each input method.
* Replace small clickable elements with larger touch targets on mobile.
* Disable input bindings that are not easily available on mobile (see [Input on mobile](input-on-mobile.md)).

## Checking the raw platform value

If you need to handle multiple platforms in a single switch, use `getPlatform()`:

```ts
import { getPlatform } from '@dcl/sdk/platform'

const platform = getPlatform()

switch (platform) {
  case 'mobile':
    // mobile-specific behavior
    break
  case 'desktop':
    // desktop-specific behavior
    break
  case 'web':
    // web-specific behavior
    break
  case null:
    // platform not yet known
    break
}
```

## Related

* [Mobile safe area](safe-area.md)
* [UI best practices for mobile](ui-best-practices.md)
* [On-screen UI](../../sdk7/2d-ui/onscreen-ui.md)
