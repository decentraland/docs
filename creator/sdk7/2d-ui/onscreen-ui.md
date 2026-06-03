---
description: >-
  Learn how to create a UI for players in your scene. This is useful, for
  example, to display game-related information.
---

# Onscreen UI

You can build a UI for your scene, to be displayed in the screen's fixed 2D space, instead of in the 3D world space.

UI elements are only visible when the player is standing inside the scene's LAND parcels, as neighboring scenes might have their own UI to display. Parts of the UI can also be triggered to open when certain events occur in the world-space, for example if the player clicks on a specific place.

Build a UI by defining a structure of nested `UIEntity` objects in JSX. The syntax used for UIs is very similar to that of [React](https://reactjs.org/) (a very popular javascript-based library for building web UIs).

{% hint style="warning" %}
**📔 Note**: You can only define UI syntax in files that have a `.tsx` extension. `.tsx` files support everything that `.ts` files support, plus UI syntax. We recommend creating a `ui.tsx` file and defining your UI there. Remember to call your UI render method from `index.ts` with `ReactEcsRenderer.setUiRenderer(yourUiMethodName)`, see example below.
{% endhint %}

A simple UI with static elements can look a lot like HTML, but when you add dynamic elements that respond to a change in state, you can do things that are a lot more powerful.

The default Decentraland explorer UI includes a chat widget, a map, and other elements. These UI elements are always displayed on the top layer, above any scene-specific UI. So if your scene has UI elements that occupy the same screen space as these, they will be occluded.

See [UX guidelines](../design-experience/ux-ui-guide.md) for tips on how to design the look and feel of your UI.

{% hint style="info" %}
**📱 Designing for mobile**: The [mobile client](../building-for-mobile/) reserves the left side, the top-right, and the bottom-right of the screen for system controls (joystick, chat, profile, camera, interaction button). Scene UI in those regions will clash with the controls. Before publishing, review the [Mobile safe area](../building-for-mobile/safe-area.md) and the [UI best practices for mobile](../building-for-mobile/ui-best-practices.md). A useful starting point is to design your UI on desktop and then **scale sizes by 3×** for mobile readability.
{% endhint %}

{% hint style="info" %}
**📱 Avoid hardware-reserved margins**: On mobile, devices reserve screen space for the notch, status bar, home indicator, and rounded corners. Wrap your UI in the [`ScreenInsetArea` component](../building-for-mobile/screen-inset-area.md) to keep it clear of these areas automatically. It only affects the mobile client — on desktop it has no effect, so it's safe to leave in cross-platform UI.
{% endhint %}

When the player clicks the _close UI_ button, on the bottom-right corner of the screen, all UI elements are hidden.

## Render a UI

To display a UI in your scene, use the `ReactEcsRenderer.setUiRenderer()` function, passing it a valid structure of entities, described in a `.tsx` file.

Each entity is defined as an HTML-like node, with properties for each of its components.

_**ui.tsx file:**_

```ts
import { UiEntity, ReactEcs } from '@dcl/sdk/react-ecs'
import { Color4 } from '@dcl/sdk/math'

export const uiMenu = () => (
  <UiEntity
    uiTransform={{
      width: 700,
      height: 400,
      margin: { top: '35px', left: '500px' },
    }}
    uiBackground={{ color: Color4.Red() }}
  />
)
```

_**index.ts file:**_

```ts
import { ReactEcsRenderer } from '@dcl/sdk/react-ecs'
import { uiMenu } from './ui'

export function main() {
    ReactEcsRenderer.setUiRenderer(uiMenu, { virtualWidth: 1920, virtualHeight: 1080 })
}
```

You can also define an entity structure and render it, all in one same command in a `.tsx` file.

_**ui.tsx file:**_

```tsx
import ReactEcs, { ReactEcsRenderer, UiEntity } from '@dcl/sdk/react-ecs'
import { Color4 } from '@dcl/sdk/math'

export function setupUI() {
  ReactEcsRenderer.setUiRenderer(() => (
    <UiEntity
      uiTransform={{
        width: 700,
        height: 400,
        margin: { top: '35px', left: '500px' },
      }}
      uiBackground={{ color: Color4.Red() }}
    />
  ), { virtualWidth: 1920, virtualHeight: 1080 })
}
```

_**index.ts file:**_

```ts
import { setupUI } from './ui'

export function main() {
    setupUI()
}
```

{% hint style="warning" %}
**📔 Note**: All of your UI elements need to be nested into the same structure, and have one single parent at the root of the structure. You can only call `ReactEcsRenderer.setUiRenderer()` once in the scene.
{% endhint %}

## UI Entities

Each element in the UI must be defined as a separate `UiEntity`, wether it's an image, text, background, an invisible alignment box, etc. Just like in the scene's 3D space, each `UiEntity` has its own components to give it a position, color, etc.

The React-like syntax allows you to specify each component as a property within the `UiEntity`, this makes the code shorter and more readable.

The components used in a `UiEntity` are different from those used in regular entities. You cannot apply a UI component to a regular entity, nor a regular component to a UI entity.

The following components are available to use in a `UiEntity`:

* `uiTransform`
* `uiBackground`
* `uiText`
* `onClick`

Like with HTML tags, you can define components as self-closing or nest one within another.

_**ui.tsx file:**_

```tsx
import ReactEcs, { ReactEcsRenderer, UiEntity } from '@dcl/sdk/react-ecs'
import { Color4 } from '@dcl/sdk/math'

export const uiMenu = () => (
  // parent entity
  <UiEntity
    uiTransform={{
      width: 200,
      height: 200,
      margin: { top: '250px', left: '500px' },
    }}
    uiBackground={{ color: Color4.Blue() }}
  >
    // self-closing child entity
    <UiEntity
      uiTransform={{
        width: 400,
        height: 400,
        margin: { top: '35px', left: '500px' },
      }}
      uiText={{ value: `Hello world!`, fontSize: 40 }}
    />
    // closing statement for the parent entity
  </UiEntity>
)
```

_**index.ts file:**_

```ts
import { ReactEcsRenderer } from '@dcl/sdk/react-ecs'
import { uiMenu } from './ui'

export function main() {
    ReactEcsRenderer.setUiRenderer(uiMenu, { virtualWidth: 1920, virtualHeight: 1080 })
}
```

A definition of a UI module can only have one parent-level entity. You can define as many other entities as you want, but they must all fit inside a structure with one single parent at the top.

## Screen Virtual Scale

Set a vitual width and height for the UI. This is encouraged to make sure your UI looks the same on different screen sizes, regardless of the actual screen size in pixels.

```ts
export function setupUi() {
    ReactEcsRenderer.setUiRenderer(uiComponent, { virtualWidth: 1920, virtualHeight: 1080 })
}
```

If you set a virtual width to 1920, and a virtual height to 1080, the UI will be scaled to fit the screen size. If the screen is 1920x1080, the UI will be displayed at the same size as the virtual size. If the screen is larger or smaller, any pixel values will be scaled to fit the virtual size. For example, if the screen is 3840x2160, an item that is defined as 100 pixels in width will be displayed over 200 actual pixels.

The actual calculation for the Ui Scale Factor that gets multiplied on pixel values is [`Math.min(realWidth / virtualWidth, realHeight / virtualHeight)`](https://github.com/decentraland/js-sdk-toolchain/blob/fbf4826ef686982ca1e60d368186e8e10c02a6e6/packages/%40dcl/react-ecs/src/system.ts#L124)

## Multiple UI modules

If your scene contains multiple systems or modules that each define their own UI, you can render each UI module with `ReactEcsRenderer.addUiRenderer()`. This is especially useful when working on a complex scene with multiple UI components, or when defining UIs for a [smart item](../smart-items/smart-items.md), which should be usable independent of what's in the code of the rest of the scene.

The `ReactEcsRenderer.addUiRenderer()` function requires that you provide an entity as the owner of the UI. This can be any entity, even a dummy entity created only to be used as the owner of the UI.

```ts
export function setupUi() {

    // Create a dummy entity to be the owner of the UI
    const dummyEntity = engine.addEntity()

    // Define the UI module as a function that returns an array of UI modules
    const uiComponent = () => [
      // Function returning a UI module,
      // Function returning a UI module
      // ...
    ]

    // Render the UI module with the dummy entity as the owner
    ReactEcsRenderer.addUiRenderer(dummyEntity, uiComponent)
}
```

This snippet can exist independently of any other UI code in the scene. The rest of the scene might include a `ReactEcsRenderer.setUiRenderer()`, or none at all, and the UI will still be rendered.

An `addUiRenderer()` call can also include a virtual width and height, just like `setUiRenderer()`. However, if the scene has a `setUiRenderer()` call that also defines a virtual width and height, the virtual width and height of the `addUiRenderer()` call will be ignored.

```tsx
ReactEcsRenderer.addUiRenderer(dummyEntity, uiComponent, { virtualWidth: 1920, virtualHeight: 1080 })
```

That UI can be removed with `ReactEcsRenderer.removeUiRenderer(dummyEntity)` , also If the entity that owns the UI is destroyed, the UI will be removed too. If `ReactEcsRenderer.addUiRenderer()` is called again for the same entity but with a different UiRenderer, the previous one is cleaned up and the new one replaces it.


### Sharing a single setUiRenderer statement


Instead of calling `ReactEcsRenderer.addUiRenderer()` for each UI module, you can call `ReactEcsRenderer.setUiRenderer()` once with an array of UI modules, that can live in different files.

```ts
const uiComponent = () => [
  // Function returning a UI module,
  // Function returning a UI module
  // ...
]

ReactEcsRenderer.setUiRenderer(uiComponent, { virtualWidth: 1920, virtualHeight: 1080 })
```

Below is a more complete example:

_**ui.tsx file:**_

```ts
export function UIModule1() {
  return (
    <UiEntity
      uiTransform={{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        positionType: 'absolute',
        position: { right: '3%', bottom: '3%' },
      }}
    >
      <Label value="Hello World!" fontSize={18} textAlign="middle-center" />
    </UiEntity>
  )
}

export function UIModule2() {
  return (
    <UiEntity
      uiTransform={{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        positionType: 'absolute',
        position: { right: '3%', top: '3%' },
      }}
    >
      <Label
        value="Here's some more UI!"
        fontSize={18}
        textAlign="middle-center"
      />
    </UiEntity>
  )
}
```

_**index.ts file:**_

```ts
import { ReactEcsRenderer } from '@dcl/sdk/react-ecs'
import { UIModule1, UIModule2 } from './ui'

export function main() {
    ReactEcsRenderer.setUiRenderer([
      UIModule1(),
      UIModule2(),
      // ...
      // The line below is to use the DCL UI Toolkit library
      // https://github.com/decentraland-scenes/dcl-ui-toolkit
      ui.render(),
    ], { virtualWidth: 1920, virtualHeight: 1080 })
}
```
