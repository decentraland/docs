---
description: Cambia la hora del skybox
metaLinks:
  alternates:
    - >-
      https://app.gitbook.com/s/oPnXBby9S6MrsW83Y9qZ/scenes-sdk7/interactivity/skybox-control
---

# Control del skybox

Puedes cambiar cómo ve el skybox un jugador cuando está parado en tu escena, esto también afecta el tono y la dirección de la iluminación global.

El cielo en Decentraland sigue un ciclo día/noche predeterminado donde 1 minuto pasa cada segundo, por lo que un ciclo completo tarda 24 minutos en completarse. Si la escena no está imponiendo ningún momento específico del día, los jugadores también pueden cambiar a un momento particular del día cambiando un control deslizante en su UI.

Cada vez que los jugadores ingresan a una escena con un momento diferente del día, o la escena cambia el momento del día dinámicamente, el skybox se transiciona suavemente durante unos segundos a este nuevo valor.

## Hora fija del día

Puedes establecer un momento fijo del día para tu escena. Todos los jugadores verán la escena con este momento del día, y el skybox no seguirá el ciclo día/noche.

En el Creator Hub, abre la configuración de la escena y haz clic en la pestaña **Settings** para encontrar la sección **Skybox**. Desmarca la opción **Auto** y establece el momento del día que deseas.



También puedes establecer el momento del día del skybox en el código de tu escena. Para hacer esto, agrega la siguiente sección a tu `scene.json` en el nivel raíz:

```json
 "skyboxConfig": {
    "fixedTime": 36000
  }
```

El número se refiere al número de segundos desde el inicio del día, que va de 0 (que se refiere a _00:00_) a 86400 (que se refiere a _24:00_). Cualquier número mayor que 86400 también se interpreta como medianoche.

Aquí hay algunos más ejemplos de valores válidos:

* 0 segundos => _00:00_
* 21600 segundos => _06:00_
* 43200 segundos => _12:00_
* 64800 segundos => _18:00_
* 86400 segundos => _24:00_

## Leer el momento del día

Puedes leer el momento del día desde el código de tu escena usando la función `getWorldTime()`.

```ts
import { getWorldTime } from '~system/Runtime'

executeTask(async () => {
  let time = await getWorldTime({})
  console.log(time.seconds)
})
```

La función devuelve un número entre 0 y 86400, donde 0 es medianoche y 86400 es 24:00. Este valor se actualiza si la escena cambia el momento del día dinámicamente o si el jugador cambia el momento del día en la UI. De lo contrario, devuelve el valor relativo al ciclo día/noche predeterminado.

## Cambiar el momento del día dinámicamente

Puedes cambiar el momento del día dinámicamente usando el componente `SkyboxTime`. Este componente solo puede agregarse a la entidad raíz de la escena `engine.rootEntity`.

```ts
import { SkyboxTime } from '@dcl/sdk/ecs'

function main() {
  SkyboxTime.create(engine.RootEntity, { fixedTime: 36000 })
}
```

La propiedad `fixed_time` es un número entre 0 y 86400, donde 0 es medianoche y 86400 es 24:00. Cualquier número mayor que 86400 también se interpreta como medianoche.

Cada vez que este componente se agrega, elimina, o la propiedad `fixed_time` cambia, el momento del día del skybox se transiciona suavemente durante unos segundos a este nuevo valor. Lo mismo sucede cuando el jugador sale o entra en la escena. Mientras el momento del día del skybox esté fijo, el skybox ya no seguirá el progreso en su ciclo día/noche y los jugadores no pueden cambiar el momento del día a través de la UI.

Por defecto, la transición siempre ocurre en la dirección hacia adelante, pero puedes cambiar esto estableciendo la propiedad `direction` en `TransitionMode.TM_FORWARD` o `TransitionMode.TM_BACKWARD`.

```ts
import { TransitionMode } from '~system/Runtime'
import { SkyboxTime } from '@dcl/sdk/ecs'

function main() {
  SkyboxTime.create(engine.RootEntity, { fixedTime: 36000, direction: TransitionMode.TM_BACKWARD })
}
```
