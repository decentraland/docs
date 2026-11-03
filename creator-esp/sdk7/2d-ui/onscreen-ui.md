---
description: >-
  Aprende cómo crear una UI para jugadores en tu escena. Esto es útil, por
  ejemplo, para mostrar información relacionada con el juego.
metaLinks:
  alternates:
    - >-
      https://app.gitbook.com/s/oPnXBby9S6MrsW83Y9qZ/scenes-sdk7/2d-ui/onscreen-ui
---

# UI en Pantalla

Puedes construir una UI para tu escena, que se muestre en el espacio 2D fijo de la pantalla, en lugar de en el espacio 3D del mundo.

Los elementos UI solo son visibles cuando el jugador está de pie dentro de las parcelas LAND de la escena, ya que las escenas vecinas podrían tener su propia UI para mostrar. Partes de la UI también pueden activarse para abrirse cuando ocurren ciertos eventos en el espacio mundial, por ejemplo si el jugador hace clic en un lugar específico.

Construye una UI definiendo una estructura de objetos `UIEntity` anidados en JSX. La sintaxis usada para UIs es muy similar a la de [React](https://reactjs.org/) (una librería basada en javascript muy popular para construir UIs web).

{% hint style="warning" %}
**📔 Nota**: Solo puedes definir sintaxis UI en archivos que tengan una extensión `.tsx`. Los archivos `.tsx` soportan todo lo que los archivos `.ts` soportan, más la sintaxis UI. Recomendamos crear un archivo `ui.tsx` y definir tu UI allí. Recuerda llamar tu método de renderizado UI desde `index.ts` con `ReactEcsRenderer.setUiRenderer(yourUiMethodName)`, consulta el ejemplo a continuación.
{% endhint %}

Una UI simple con elementos estáticos puede verse muy parecida a HTML, pero cuando agregas elementos dinámicos que responden a un cambio de estado, puedes hacer cosas que son mucho más poderosas.

La UI predeterminada del explorador de Decentraland incluye un widget de chat, un mapa y otros elementos. Estos elementos UI siempre se muestran en la capa superior, encima de cualquier UI específica de escena. Entonces, si tu escena tiene elementos UI que ocupan el mismo espacio de pantalla que estos, serán ocluidos.

Consulta [lineamientos UX](../design-experience/ux-ui-guide.md) para consejos sobre cómo diseñar el aspecto de tu UI.

Cuando el jugador hace clic en el botón _cerrar UI_, en la esquina inferior derecha de la pantalla, todos los elementos UI se ocultan.

### Renderizar una UI

Para mostrar una UI en tu escena, usa la función `ReactEcsRenderer.setUiRenderer()`, pasándole una estructura válida de entidades, descrita en un archivo `.tsx`.

Cada entidad se define como un nodo similar a HTML, con propiedades para cada uno de sus componentes.

_**Archivo ui.tsx:**_

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

_**Archivo index.ts:**_

```ts
import { ReactEcsRenderer } from '@dcl/sdk/react-ecs'
import { uiMenu } from './ui'

export function main() {
    ReactEcsRenderer.setUiRenderer(uiMenu)
}
```

También puedes definir una estructura de entidades y renderizarla, todo en un mismo comando en un archivo `.tsx`.

_**Archivo ui.tsx:**_

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
  ))
}
```

_**Archivo index.ts:**_

```ts
import { ReactEcsRenderer } from '@dcl/sdk/react-ecs'
import { setupUI } from './ui'

export function main() {
    setupUI()
}
```

{% hint style="warning" %}
**📔 Nota**: Todos tus elementos UI deben estar anidados en la misma estructura, y tener un solo padre en la raíz de la estructura. Solo puedes llamar `ReactEcsRenderer.setUiRenderer()` una vez en la escena.
{% endhint %}

### Entidades UI

Cada elemento en la UI debe definirse como una `UiEntity` separada, ya sea una imagen, texto, fondo, una caja de alineación invisible, etc. Al igual que en el espacio 3D de la escena, cada `UiEntity` tiene sus propios componentes para darle una posición, color, etc.

La sintaxis similar a React te permite especificar cada componente como una propiedad dentro de la `UiEntity`, esto hace que el código sea más corto y legible.

Los componentes usados en una `UiEntity` son diferentes de aquellos usados en entidades regulares. No puedes aplicar un componente UI a una entidad regular, ni un componente regular a una entidad UI.

Los siguientes componentes están disponibles para usar en una `UiEntity`:

* `uiTransform`
* `uiBackground`
* `uiText`
* `onClick`

Como con las etiquetas HTML, puedes definir componentes como auto-cierre o anidar uno dentro de otro.

_**Archivo ui.tsx:**_

```tsx
import ReactEcs, { ReactEcsRenderer, UiEntity } from '@dcl/sdk/react-ecs'
import { Color4 } from '@dcl/sdk/math'

export const uiMenu = () => (
  // entidad padre
  <UiEntity
    uiTransform={{
      width: 200,
      height: 200,
      margin: { top: '250px', left: '500px' },
    }}
    uiBackground={{ color: Color4.Blue() }}
  >
    // entidad hija auto-cierre
    <UiEntity
      uiTransform={{
        width: 400,
        height: 400,
        margin: { top: '35px', left: '500px' },
      }}
      uiText={{ value: `Hello world!`, fontSize: 40 }}
    />
    // declaración de cierre para la entidad padre
  </UiEntity>
)
```

_**Archivo index.ts:**_

```ts
import { ReactEcsRenderer } from '@dcl/sdk/react-ecs'
import { uiMenu } from './ui'

export function main() {
    ReactEcsRenderer.setUiRenderer(uiMenu)
}
```

Una definición de un módulo UI solo puede tener una entidad de nivel padre. Puedes definir tantas otras entidades como quieras, pero todas deben caber dentro de una estructura con un solo padre en la parte superior.

### Múltiples módulos UI

Tu escena debe tener una sola llamada a la función `ReactEcsRenderer.setUiRenderer()`. Para definir tu UI a través de una serie de módulos separados en diferentes archivos, puedes pasar un arreglo a la función de renderizado listando cada módulo. Esto también es útil cuando combinas módulos UI de una librería (como la [librería DCL UI toolkit](https://github.com/decentraland-scenes/dcl-ui-toolkit)) con UI personalizada:

```ts
const uiComponent = () => [
  // Función que devuelve un módulo UI,
  // Función que devuelve un módulo UI
  // ...
]

ReactEcsRenderer.setUiRenderer(uiComponent)
```

A continuación un ejemplo más completo:

_**Archivo ui.tsx:**_

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

_**Archivo index.ts:**_

```ts
import { ReactEcsRenderer } from '@dcl/sdk/react-ecs'
import { UIModule1, UIModule2 } from './ui'

export function main() {
    ReactEcsRenderer.setUiRenderer([
      UIModule1(),
      UIModule2(),
      // ...
      // La línea a continuación es para usar la librería DCL UI Toolkit
      // https://github.com/decentraland-scenes/dcl-ui-toolkit
      ui.render(),
    ])
}
```
