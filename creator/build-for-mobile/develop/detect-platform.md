---
description: Detect whether your scene is running on mobile, desktop, or web, and which language the player uses.
---

# Detect the Platform from Code

Use the `isMobile()` function to adapt your UI, controls, and gameplay specifically for mobile. This is the recommended way to deliver a great experience across all clients without forking your scene logic entirely.

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

## Read the player's language

Use `getPlayerLanguage()` to show your scene's text in the same language as the player's client.

```ts
import { getPlayerLanguage, onPlayerLanguageChanged, getSystemLanguage } from '@dcl/sdk/platform'
```

* **`getPlayerLanguage()`** — returns the language of the player's client as a [BCP-47](https://www.rfc-editor.org/info/bcp47) tag, such as `'en'`, `'es'` or `'pt-BR'`. This is the language the client's own UI is shown in, which is not necessarily the language of the player's operating system.
* **`onPlayerLanguageChanged`** — an observable that fires with `{ language }` whenever the value of `getPlayerLanguage()` changes, for example when the player switches the client's language in the settings mid-session.
* **`getSystemLanguage()`** — returns the language of the player's device (its operating system) as a BCP-47 tag, such as `'es-AR'` or `'ja-JP'`. It can differ from `getPlayerLanguage()`, for example when the client doesn't offer the device's language and falls back to English. Prefer `getPlayerLanguage()` for your scene's texts, so they match the rest of the client; use `getSystemLanguage()` when you need the device's own setting, such as for regional content. It has no change event.

`getPlayerLanguage()` and `getSystemLanguage()` always return a valid tag, falling back to `'en'`:

* Until the explorer has reported its language back to the scene (this happens shortly after the scene starts, like `getPlatform()`).
* On clients that don't report a language, or that report a value that isn't a valid language tag.

Because of this, read the language through `onPlayerLanguageChanged` instead of only once in `main()`: the observable also fires when the explorer first reports a language other than `'en'`. Clients that don't support mid-session changes never fire it, and the scene keeps the language it started with.

{% hint style="info" %}
**💡 Tip**: Match on the primary language subtag as a fallback, so that `'es-AR'` or `'pt-PT'` still find your `'es'` or `'pt'` texts. Always keep English as the last fallback.
{% endhint %}

### Example: translate your UI text

Keep your texts in a table per language, pick the matching table when the scene starts and again whenever the language changes:

```tsx
import { engine, Transform, TextShape } from '@dcl/sdk/ecs'
import { Vector3 } from '@dcl/sdk/math'
import ReactEcs, { ReactEcsRenderer, Label } from '@dcl/sdk/react-ecs'
import { getPlayerLanguage, onPlayerLanguageChanged } from '@dcl/sdk/platform'

type Texts = { welcome: string; sign: string }

const TEXTS: Record<string, Texts> = {
  en: { welcome: 'Welcome!', sign: 'Gallery' },
  es: { welcome: '¡Bienvenido!', sign: 'Galería' },
  pt: { welcome: 'Bem-vindo!', sign: 'Galeria' }
}

function textsFor(language: string): Texts {
  const primary = language.split('-')[0].toLowerCase()
  return TEXTS[language] ?? TEXTS[primary] ?? TEXTS.en
}

let texts = textsFor(getPlayerLanguage())

export function main() {
  // A 3D sign: its text must be updated explicitly
  const sign = engine.addEntity()
  Transform.create(sign, { position: Vector3.create(8, 2, 8) })
  TextShape.create(sign, { text: texts.sign })

  onPlayerLanguageChanged.add(({ language }) => {
    texts = textsFor(language)
    TextShape.getMutable(sign).text = texts.sign
  })

  // The UI is redrawn every frame, so it picks up the new texts on its own
  ReactEcsRenderer.setUiRenderer(() => (
    <Label value={texts.welcome} fontSize={24} />
  ))
}
```

## Related

* [Mobile safe area](safe-area.md)
* [UI best practices for mobile](ui-best-practices.md)
* [On-screen UI](../../sdk7/2d-ui/onscreen-ui.md)
