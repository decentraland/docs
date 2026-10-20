---
description: Cambia la hora del skybox, reemplaza el cielo con tu propia textura, o recolorea el cielo, las nubes y las estrellas y controla el sol y la niebla
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

## Cielo, sol y niebla personalizados

Tres componentes permiten que tu escena tome el control del entorno mientras el jugador está dentro de ella:

* `Skybox`: reemplaza el cielo con tu propia textura, o recolorea el cielo procedural, sus nubes y sus estrellas.
* `Sun`: recolorea, atenúa, oculta o fija la dirección de la luz del sol (y de la luna).
* `EnvironmentFog`: recolorea la niebla de distancia y cambia su densidad.

Al igual que `SkyboxTime`, los tres solo pueden agregarse a la entidad raíz de la escena, `engine.RootEntity`. Agregar cualquiera de ellos pone a tu escena al mando del entorno. Todos los campos son opcionales: lo que no definas mantiene su comportamiento por defecto según la hora del día.

```ts
import { engine, Skybox, Sun, EnvironmentFog } from '@dcl/sdk/ecs'
import { Color4, Vector3 } from '@dcl/sdk/math'

function main() {
  Skybox.create(engine.RootEntity, {
    skyboxTexture: 'images/sky.png'
  })
  Sun.create(engine.RootEntity, { intensity: 0.5, direction: Vector3.create(-1, -1, 0) })
  EnvironmentFog.create(engine.RootEntity, {
    color: { keys: [{ time: 0, color: Color4.create(0.6, 0.2, 0.1, 1) }] },
    density: 0.01
  })
}
```

### Textura de cielo personalizada

`skyboxTexture` reemplaza el cielo visible con una imagen de los assets de la escena. Defínela con la ruta del archivo de imagen, igual que el `src` de una textura. La imagen debe ser un panorama equirectangular (una imagen latitud-longitud de proporción 2:1): su centro horizontal mira hacia el eje Z positivo (el norte) de la escena, su fila superior es el cenit y su fila inferior el nadir. Los formatos de cubemap en cruz, 3x2 o de seis caras no son compatibles.

```ts
import { engine, Skybox } from '@dcl/sdk/ecs'

Skybox.create(engine.RootEntity, {
  skyboxTexture: 'images/sky.png'
})
```

La imagen se repite horizontalmente y se filtra de forma bilineal. Si la imagen no se puede cargar, se mantiene el cielo por defecto.

La textura solo cambia el aspecto del cielo: la luz del sol sigue la hora del día, la luz ambiental sigue los `skyColors` (así puedes ajustarla a tu imagen), y los componentes `Sun` y `EnvironmentFog` se siguen aplicando encima. En el Explorer de Decentraland, los reflejos de los materiales brillantes también siguen tu textura de cielo.

### Colores del cielo, nubes y estrellas

Si conservas el cielo procedural, el componente `Skybox` te permite recolorearlo y ajustar su capa de nubes y su campo de estrellas.

```ts
import { engine, Skybox, ColorGradient } from '@dcl/sdk/ecs'
import { Color4 } from '@dcl/sdk/math'

// Un gradiente con una sola clave es un color constante
function constant(color: Color4): ColorGradient {
  return { keys: [{ time: 0, color }] }
}

function main() {
  Skybox.create(engine.RootEntity, {
    skyColors: {
      zenith: constant(Color4.create(0.55, 0.25, 0.12, 1)),
      horizon: constant(Color4.create(0.95, 0.55, 0.3, 1)),
      nadir: constant(Color4.create(0.35, 0.15, 0.08, 1))
    },
    clouds: { opacity: 0.3, speed: 0.01, color: constant(Color4.create(0.9, 0.6, 0.4, 1)) },
    stars: { brightness: 4.62 }
  })
}
```

* `skyColors`: el color del cielo en su `zenith` (cenit, justo arriba), en el `horizon` (horizonte) y en su `nadir` (el cielo bajo el horizonte, visible donde no lo cubre el terreno, por ejemplo a gran altura). Estos colores también controlan la luz ambiental de la escena: el color del cenit ilumina los objetos desde arriba, el del horizonte desde los lados y el del nadir desde abajo, de modo que objetos y avatares coinciden con el cielo que los rodea. `skyColors.rim` es un resplandor estrecho que se dibuja justo sobre la línea del horizonte, como el brillo de un atardecer; si no lo defines, sigue tu color de `horizon`, así que solo lo necesitas como acento (por ejemplo, un borde naranja de amanecer sobre un cielo oscuro).
* `clouds.opacity`: de 0 (sin nubes) a 1, el valor por defecto. `clouds.speed`: la velocidad a la que gira la capa de nubes alrededor del cielo, en radianes por segundo: 0.01 por defecto (una vuelta cada ~10 minutos), 0 para nubes estáticas, negativo para invertir el sentido. `clouds.color`: el tinte de la capa de nubes; sin él, las nubes mantienen sus colores por defecto según la hora del día incluso sobre un cielo recoloreado.
* `stars.brightness`: un multiplicador sobre la textura de estrellas, 4.62 por defecto (los valores mayores que 1 son HDR, 0 oculta las estrellas). Las estrellas solo se ven durante la parte nocturna del día.

Mientras haya una `skyboxTexture` definida, la textura reemplaza el cielo procedural: `clouds` y `stars` no tienen efecto, y `skyColors` ya no colorea el cielo pero sigue controlando la luz ambiental.

### Sol

El componente `Sun` modifica la luz direccional del sol y de la luna.

```ts
import { engine, Sun } from '@dcl/sdk/ecs'
import { Color4, Vector3 } from '@dcl/sdk/math'

Sun.create(engine.RootEntity, {
  color: { keys: [{ time: 0, color: Color4.create(1, 0.65, 0.4, 1) }] },
  intensity: 0.5,
  direction: Vector3.create(-1, -1, 0)
})
```

* `color`: el color de la luz direccional. También tiñe el disco del sol.
* `visible`: `true` por defecto. Defínelo en `false` para ocultar los discos del sol y la luna y el destello (lens flare) del sol, por ejemplo cuando se verían a través de una `skyboxTexture`. La luz que proyecta el sol no se ve afectada.
* `intensity`: un multiplicador sobre la intensidad de la luz según la hora del día, 1 por defecto. 0 apaga la luz del sol; los valores negativos cuentan como 0.
* `direction`: la dirección en la que viaja la luz del sol, en coordenadas de la escena: `(0, -1, 0)` pone el sol justo arriba, y `(-1, -1, 0)` lo pone en el lado X positivo (este) del cielo, 45 grados sobre el horizonte. Mientras está definida, el sol queda fijo a cualquier hora del día, pero su color y su intensidad siguen la hora del día. Déjala sin definir para mantener el recorrido normal del sol por el cielo.

### Niebla

El componente `EnvironmentFog` modifica la niebla de distancia.

```ts
import { engine, EnvironmentFog } from '@dcl/sdk/ecs'
import { Color4 } from '@dcl/sdk/math'

EnvironmentFog.create(engine.RootEntity, {
  color: { keys: [{ time: 0, color: Color4.create(0.85, 0.5, 0.3, 1) }] },
  density: 0.01
})
```

* `color`: el color de la niebla.
* `density`: qué tan rápido se desvanecen las cosas en la niebla, como densidad exponencial por metro: la niebla a una distancia dada es `1 - e^(-density * distance)`, así que `1 / density` es aproximadamente la distancia a la que dos tercios de la vista quedan cubiertos por la niebla. El valor por defecto es 0.0005 (unos 2 km); 0.02 cubre todo más allá de unos 50 m y 0 hace la niebla invisible. Los valores negativos cuentan como 0.

Que la niebla se renderice o no es un ajuste de calidad elegido por el jugador; una escena no puede activarla ni desactivarla.

### Gradientes de color a lo largo del día

Cada color de estos componentes es un `ColorGradient`: una lista de `keys`, cada una con un `time` y un `Color4`. El `time` es la hora del día normalizada, de 0 (_00:00_) a 1 (_24:00_), así que 0.5 es el mediodía, el mismo reloj que usa `SkyboxTime`. El color se interpola entre claves vecinas; antes de la primera clave y después de la última se usa el color de esa clave. Un gradiente con una sola clave es simplemente un color constante.

```ts
Skybox.createOrReplace(engine.RootEntity, {
  skyColors: {
    horizon: {
      keys: [
        { time: 0, color: Color4.create(0.05, 0.05, 0.2, 1) }, // medianoche
        { time: 0.25, color: Color4.create(0.95, 0.5, 0.4, 1) }, // amanecer
        { time: 0.5, color: Color4.create(0.7, 0.9, 1, 1) }, // mediodía
        { time: 0.75, color: Color4.create(0.95, 0.4, 0.2, 1) }, // atardecer
        { time: 1, color: Color4.create(0.05, 0.05, 0.2, 1) } // medianoche otra vez, para que no haya un salto
      ]
    }
  }
})
```

Los gradientes no dan la vuelta a medianoche, así que repite el mismo color en `time: 0` y `time: 1` si el día debe repetirse sin cortes. Los valores de color no están limitados a 1: valores mayores producen un sol o un cielo más brillantes (HDR). El canal alfa se ignora. Usa como máximo 8 claves por gradiente: los gradientes más largos se remuestrean a 8 claves equidistantes, lo que suaviza el detalle entre ellas. Combina los gradientes con `SkyboxTime` para fijar el día en un punto concreto de tu gradiente.

### Oscuridad total

Para que las luces colocadas en tu escena sean la única fuente de iluminación, deja en negro todo lo que aporta el entorno: la luz del sol y su disco, los colores del cielo (y con ellos la luz ambiental), la niebla, las nubes y las estrellas.

```ts
import { engine, Skybox, Sun, EnvironmentFog } from '@dcl/sdk/ecs'
import { Color4 } from '@dcl/sdk/math'

const black = { keys: [{ time: 0, color: Color4.Black() }] }

Skybox.createOrReplace(engine.RootEntity, {
  skyColors: { zenith: black, horizon: black, nadir: black },
  clouds: { opacity: 0 },
  stars: { brightness: 0 }
})
Sun.createOrReplace(engine.RootEntity, { intensity: 0, visible: false })
EnvironmentFog.createOrReplace(engine.RootEntity, { color: black })
```

Consulta [Luces](../3d-essentials/lights.md) para agregar luces puntuales y focos a tu escena.

## Alcance y restablecimiento

Las modificaciones de `Skybox`, `Sun` y `EnvironmentFog` se aplican solo mientras el jugador está dentro de tu escena. Cuando el jugador sale de la escena, cuando se elimina un componente o cuando se quita un campo, el cielo y la iluminación vuelven a sus valores por defecto, y al volver a entrar se aplican de nuevo. Los cambios se aplican de inmediato, sin transición.

{% hint style="warning" %}
**📔 Nota**: Mientras están activas, estas modificaciones son globales: las parcelas vecinas que se ven desde dentro de tu escena también se renderizan con tu cielo, tu sol y tu niebla.
{% endhint %}

{% hint style="info" %}
**💡 Consejo**: La escena de prueba [`2,2-skybox-control`](https://github.com/decentraland/sdk7-test-scenes/tree/main/scenes/2,2-skybox-control) ejercita los componentes `Skybox`, `Sun` y `EnvironmentFog`: texturas de cielo, presets de entorno, ocultar el sol y un modo de oscuridad total.
{% endhint %}
