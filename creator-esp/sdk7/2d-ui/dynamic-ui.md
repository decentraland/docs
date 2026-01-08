---
description: >-
  Aprende cómo hacer que las UIs sean dinámicas, respondiendo a cambios en los
  datos.
metaLinks:
  alternates:
    - >-
      https://app.gitbook.com/s/oPnXBby9S6MrsW83Y9qZ/scenes-sdk7/2d-ui/dynamic-ui
---

# UI Dinámica

Puedes definir una UI que incluya elementos dinámicos, que se actualizan en cada tick. Solo necesitas manejar la actualización de la variable que representa estos datos, y la UI se adaptará en respuesta a los nuevos valores.

Esto es muy útil para incluir elementos como un temporizador, la puntuación de un jugador, etc. Pero incluso puedes llevar esto un paso más allá y definir estructuras UI completas basadas en el estado.

### Referenciar variables

Puedes simplemente referenciar una variable en cualquier propiedad de uno de los componentes en una uiEntity. A medida que la variable cambia de valor, la UI se adaptará en consecuencia.

El ejemplo a continuación define una variable `playerCurrentPosition` y la referencia como parte de una cadena en un componente `uiText`. Un sistema luego actualiza el valor de esta variable en cada tick, usando la posición actual del jugador. A medida que el valor de la variable cambia, la UI se actualiza en consecuencia, sin necesidad de modificar explícitamente la UI.

_**Archivo ui.tsx:**_

```tsx
import { UiEntity, ReactEcs } from '@dcl/sdk/react-ecs'
import { playerCurrentPosition } from '/index.ts'
import { Color4 } from '@dcl/sdk/math'

// dibujar UI
export const uiMenu = () => (
  <UiEntity
    uiTransform={{
			width: '100%',
			height: '100px',
			justifyContent: 'center',
			alignItems: 'center',
    }}
    uiText={{ value: `Player: `+  playerCurrentPosition, fontSize: 40 }}
    uiBackground={{ color: Color4.create(0.5, 0.8, 0.1, 0.6) }}
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

// definir variable
let playerCurrentPosition: string = ""

// sistema para actualizar variable
engine.addSystem(() => {
  const playerPosition = Transform.getOrNull(engine.PlayerEntity)
  if (!playerPosition) return
  const { x, y, z } = playerPosition.position
  playerCurrentPosition =  `{x: ${x.toFixed(2)}, y: ${y.toFixed(2)}, z: ${z.toFixed(2)} }`
})
```

En el ejemplo anterior, también podrías incluir la variable como parte de la cadena, señalando la variable con un `$`.

```ts
uiText={{
	value: `Player: $playerCurrentPosition`,
	fontSize: 40
}}
```

### Llamar funciones desde dentro de una UI

También puedes llamar una función desde dentro de una definición JSX, devolviendo un valor para usar en una propiedad de la UI. Las funciones que se llaman desde dentro de esta definición JSX se llaman recurrentemente, en cada tick del bucle del juego.

En el ejemplo a continuación, un componente `uiText` llama a la función `getPlayerPosition()` para definir parte de la cadena a mostrar.

Este ejemplo es similar al de la sección anterior, pero al llamar una función desde dentro de la definición de la UI evitamos declarar una variable separada y definir un sistema para alterar esa variable. Ten en cuenta que `getPlayerPosition()` se llama en cada tick del bucle del juego, sin necesidad de declarar explícitamente un sistema.

_**Archivo ui.tsx:**_

```tsx
import { UiEntity, ReactEcs } from '@dcl/sdk/react-ecs'
import { Color4 } from '@dcl/sdk/math'
import { engine } from "@dcl/sdk/ecs";

export const uiMenu = () => (
  <UiEntity
    uiTransform={{
      width: '100%',
      height: '100px',
      justifyContent: 'center',
      alignItems: 'center',
    }}
    uiText={{ value: `Player: `+  getPlayerPosition(), fontSize: 40 }}
    uiBackground={{ color: Color4.create(0.5, 0.8, 0.1, 0.6) }}
  />
)

function getPlayerPosition(){
  const playerPosition = Transform.getOrNull(engine.PlayerEntity)
  if (!playerPosition) return
  const { x, y, z } = playerPosition.position
  return `{x: ${x.toFixed(2)}, y: ${y.toFixed(2)}, z: ${z.toFixed(2)} }`
}
```

_**Archivo index.ts:**_

```ts
import { ReactEcsRenderer } from '@dcl/sdk/react-ecs'
import { uiMenu } from './ui'

export function main() {
    ReactEcsRenderer.setUiRenderer(uiMenu)
}
```

### Activar y desactivar una UI

La forma más fácil de activar y desactivar una UI es usar una variable para el valor de la propiedad `display` en el `uiTransform` de una entidad. La propiedad `display` hace que una entidad UI y todos sus hijos sean invisibles si se establece en `none`.

El siguiente ejemplo usa una variable para establecer el campo `display` de una parte de la UI. El valor de esta variable puede activarse/desactivarse al hacer clic en otro elemento de la UI.

_**Archivo ui.tsx:**_

```tsx
import { UiEntity, ReactEcs } from '@dcl/sdk/react-ecs'
import { Color4 } from '@dcl/sdk/math'

// Variable para reflejar el estado actual de visibilidad del menú
var isMenuVisible: boolean = false

// Función para alternar el estado del menú
function toggleMenuVisibility() {
  isMenuVisible = !isMenuVisible
}

export const uiMenu = () => (
   // padre
   <UiEntity>
      // Menú
      <UiEntity
       uiTransform={{
          width: '80%',
          height: '100px',
          alignContent: 'center',
          justifyContent: 'center',
          display: isMenuVisible ? 'flex': 'none'
        }}
         uiText={{
          value: "Menu",
          fontSize: 30
        }}
        uiBackground={{ color: Color4.Green() }}
      />
      // botón
      <UiEntity
        uiTransform={{
          width: 100,
          height: 30,
          margin: { top: '35px', left: '500px' }
        }}
        uiText={{
          value: "Toggle Menu",
          fontSize: 40
        }}
        uiBackground={{ color: Color4.Red() }}
        onMouseDown={toggleMenuVisibility}
      />
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

### Entidades UI dinámicas

Los ejemplos en las secciones anteriores muestran cómo cambiar dinámicamente una sola propiedad en una entidad, pero también puedes definir estructuras completas de entidades que pueden escalar basándose en datos que cambian dinámicamente. Este tipo de patrón es común en desarrollo web al usar librerías como React, y es extremadamente poderoso. Con esto puedes definir aplicaciones UI extremadamente flexibles y escalables.

El siguiente ejemplo lista los ids de todas las entidades en la escena que tienen un `MeshRenderer` y `Transform`. Crea un `uiText` para cada una. A medida que el contenido de la escena cambia, la lista de entidades UI también se adapta en cada tick.

_**Archivo ui.tsx:**_

```tsx
import { UiEntity, ReactEcs } from '@dcl/sdk/react-ecs'
import { Color4 } from '@dcl/sdk/math'
import { engine } from '@dcl/sdk/ecs'
import { MeshRenderer } from '@dcl/sdk/ecs'
import { Transform } from '@dcl/sdk/ecs'

export const uiMenu = () => (
  <UiEntity
    uiTransform={{
      width: '100%',
      height: '300px',
      justifyContent: 'center',
      alignItems: 'center',
    }}
    uiBackground={{ color: Color4.create(0.5, 0.8, 0.1, 0.6) }}
  >
    <UiEntity>
      {generateText()}
    </UiEntity>
  </UiEntity>
)


function generateText(){
  return Array.from(engine.getEntitiesWith(
    MeshRenderer,
    Transform
  )).map(([entity]) => <TextComponent value={entity.toString()} key={entity} /> )
}


function TextComponent(props: { value: string; key: string | number }) {
  return <UiEntity
    key={props.key}
    uiTransform={{ width: 80, height: 20 }}
    uiText={{ value: props.value, textAlign: 'middle-center', fontSize: 12 }}
    uiBackground={{ color: { r: 255, g: 45, b: 85, a: 1 } }}
  />
}
```

_**Archivo index.ts:**_

```ts
import { ReactEcsRenderer } from '@dcl/sdk/react-ecs'
import { uiMenu } from './ui'

export function main() {
    ReactEcsRenderer.setUiRenderer(uiMenu)
}
```
