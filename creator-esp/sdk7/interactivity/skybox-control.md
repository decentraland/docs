---
description: Cambia la hora del skybox, reemplaza el cielo y los reflejos con tus propias texturas o videos, o recolorea el cielo, el sol, la niebla, las nubes y las estrellas
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

## Textura de cielo y reflejos personalizados

El componente `Skybox` reemplaza el cielo en sí y los reflejos que usan todos los materiales brillantes de la escena. Al igual que `SkyboxTime`, solo puede agregarse a la entidad raíz de la escena, `engine.RootEntity`, y solo tiene efecto mientras el jugador está dentro de tu escena.

```ts
import { engine, Material, Skybox } from '@dcl/sdk/ecs'

function main() {
  Skybox.create(engine.RootEntity, {
    skyboxTexture: Material.Texture.Common({ src: 'images/sky.png' }),
    reflectionMap: Material.Texture.Common({ src: 'images/reflections.png' })
  })
}
```

* `skyboxTexture`: una imagen equirectangular (un panorama latitud-longitud de proporción 2:1) que reemplaza el cielo visible. La iluminación según la hora del día sigue funcionando por debajo. El centro horizontal de la imagen mira hacia el eje Z positivo de la escena.
* `reflectionMap`: una imagen equirectangular que reemplaza el mapa de reflejos que usan los materiales metálicos y brillantes. Si defines `skyboxTexture` pero no `reflectionMap`, los reflejos se derivan automáticamente de la textura del cielo, así las superficies reflectantes coinciden con lo que el jugador ve en el cielo.

Ambas texturas aceptan archivos de imagen de los assets de la escena y texturas de video (consulta [Skybox de video](#skybox-de-video) más abajo); las texturas de avatar se ignoran. Si una imagen no se puede cargar, se mantienen el cielo o los reflejos por defecto.

### Skybox de video

`skyboxTexture` y `reflectionMap` también aceptan una textura de video, así que el cielo puede ser un panorama animado o una transmisión en vivo. Agrega un componente `VideoPlayer` a cualquier entidad de la escena y apunta la textura a esa entidad con `Material.Texture.Video()`, de la misma forma que lo harías para una [pantalla de video](../media/video-playing.md).

```ts
import { engine, Material, Skybox, VideoPlayer } from '@dcl/sdk/ecs'

function main() {
  const video = engine.addEntity()
  VideoPlayer.create(video, { src: 'assets/sky.mp4', playing: true, loop: true, volume: 0 })

  Skybox.createOrReplace(engine.RootEntity, {
    skyboxTexture: Material.Texture.Video({ videoPlayerEntity: video })
  })
}
```

El video se muestrea en vivo para el cielo. Los reflejos derivados de él lo siguen con un retraso de unos pocos fotogramas, ya que se regeneran progresivamente, igual que con el cielo por defecto. Ten en cuenta:

* La entidad con el `VideoPlayer` no necesita una malla ni un material: el video solo lo usa el cielo. Sigue siendo un reproductor de video normal, eso sí: reproduce su audio a menos que definas `volume: 0`, y cuenta para el número máximo de videos simultáneos (consulta [Consideraciones de rendimiento](../media/video-playing.md#consideraciones-de-rendimiento)). Mientras el skybox lo está usando, el motor nunca lo pausa en favor de otros videos más cercanos al jugador.
* Usa un video de proporción 2:1 para que coincida con el mapeo equirectangular; un video con cualquier otra proporción se estira para ajustarse a él.
* `clouds.texture` también acepta una textura de video, consulta [Nubes personalizadas](#nubes-personalizadas).

## Colores del cielo, sol, niebla, nubes y estrellas

Si conservas el cielo procedural, el mismo componente te permite recolorearlo y ajustar su capa de nubes y su campo de estrellas. Todos los campos son opcionales: lo que no definas mantiene su comportamiento por defecto según la hora del día.

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
    sun: { color: constant(Color4.create(1, 0.65, 0.4, 1)) },
    fog: { color: constant(Color4.create(0.85, 0.5, 0.3, 1)) },
    clouds: { opacity: 0.3, speed: 0.01 },
    stars: { brightness: 4.62 }
  })
}
```

* `skyColors`: el color del cielo en su `zenith` (cenit, justo arriba), en el `horizon` (horizonte) y en su `nadir` (bajo el horizonte). Estos colores también controlan la luz ambiental de la escena: el color del cenit ilumina los objetos desde arriba, el del horizonte desde los lados y el del nadir desde abajo, de modo que objetos y avatares coinciden con el cielo que los rodea. `skyColors.rim` es el resplandor que se dibuja a lo largo de la línea del horizonte; si no lo defines, sigue tu color de `horizon`, así que solo lo necesitas como acento (por ejemplo, un borde naranja de amanecer sobre un cielo oscuro).
* `sun.color`: el color de la luz direccional. También tiñe el disco del sol.
* `fog.color`: el color de la niebla de distancia. Que la niebla se renderice o no es un ajuste de calidad elegido por el jugador; una escena no puede activarla ni desactivarla.
* `clouds.opacity`: de 0 (sin nubes) a 1, el valor por defecto. `clouds.speed`: la velocidad a la que se desplaza la capa de nubes, 0.01 por defecto, 0 para nubes estáticas. `clouds.color`: el tinte de la capa de nubes; sin él, las nubes mantienen sus colores por defecto según la hora del día incluso sobre un cielo recoloreado. `clouds.texture`: tu propia imagen de capa de nubes, consulta [Nubes personalizadas](#nubes-personalizadas).
* `stars.brightness`: 4.62 por defecto. Las estrellas solo se ven durante la parte nocturna del día.

`skyColors`, `clouds` y `stars` no tienen efecto mientras haya una `skyboxTexture` definida, ya que la textura reemplaza el cielo procedural. `sun`, `fog` y la luz ambiental sí se aplican en ese caso.

### Nubes personalizadas

`clouds.texture` reemplaza la capa de nubes por defecto del cielo procedural con tu propia imagen equirectangular de proporción 2:1, o con una textura de video (consulta [Skybox de video](#skybox-de-video)). El resto de los campos de `clouds` siguen funcionando sobre ella: `opacity` la atenúa, `speed` la hace girar y `color` la tiñe.

```ts
import { engine, Material, Skybox } from '@dcl/sdk/ecs'

Skybox.createOrReplace(engine.RootEntity, {
  clouds: {
    texture: Material.Texture.Common({ src: 'images/clouds.png' }),
    speed: 0.005
  }
})
```

El motor lee cada canal de color de la imagen por separado:

* **R**: la intensidad del tinte de las nubes, multiplicada por `clouds.color` (o por el tinte por defecto según la hora del día).
* **G**: la opacidad, o cobertura, de las nubes.
* **B**: la máscara de resalte solar, donde las nubes reciben la luz del sol.

Una imagen simple en escala de grises, donde los tres canales son iguales, funciona como una máscara de nubes básica: blanco donde hay nubes, negro para cielo despejado. Como el resto de los campos de `clouds`, la textura no tiene efecto mientras haya una `skyboxTexture` definida, ya que el panorama reemplaza todo el cielo procedural, nubes incluidas.

### Gradientes de color a lo largo del día

Cada color del componente `Skybox` es un `ColorGradient`: una lista de `keys`, cada una con un `time` y un `Color4`. El `time` es la hora del día normalizada, de 0 (_00:00_) a 1 (_24:00_), así que 0.5 es el mediodía, el mismo reloj que usa `SkyboxTime`. El color se interpola entre claves vecinas; antes de la primera clave y después de la última se usa el color de esa clave. Un gradiente con una sola clave es simplemente un color constante.

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

Los gradientes no dan la vuelta a medianoche, así que repite el mismo color en `time: 0` y `time: 1` si el día debe repetirse sin cortes. Los valores de color no están limitados a 1: valores mayores producen un sol o un cielo más brillantes (HDR). El canal alfa se ignora. Combina los gradientes con `SkyboxTime` para fijar el día en un punto concreto de tu gradiente.

## Ocultar el sol y la luna

Define `sun.visible` en `false` para ocultar los discos del sol y la luna y el destello (lens flare) del sol. Esto también funciona junto con una `skyboxTexture`, donde el destello se vería de otro modo a través de la textura. La luz que proyecta el sol no se ve afectada.

```ts
Skybox.createOrReplace(engine.RootEntity, { sun: { visible: false } })
```

### Oscuridad total

Para que las luces colocadas en tu escena sean la única fuente de iluminación, deja en negro todo lo que aporta el cielo: el sol y su disco, los colores del cielo (y con ellos la luz ambiental), la niebla, las nubes y las estrellas.

```ts
import { engine, Skybox } from '@dcl/sdk/ecs'
import { Color4 } from '@dcl/sdk/math'

const black = { keys: [{ time: 0, color: Color4.Black() }] }

Skybox.createOrReplace(engine.RootEntity, {
  sun: { color: black, visible: false },
  skyColors: { zenith: black, horizon: black, nadir: black },
  fog: { color: black },
  clouds: { opacity: 0 },
  stars: { brightness: 0 }
})
```

Consulta [Luces](../3d-essentials/lights.md) para agregar luces puntuales y focos a tu escena.

## Alcance y restablecimiento

Todas las modificaciones de `Skybox` se aplican solo mientras el jugador está dentro de tu escena. Cuando el jugador sale de la escena, cuando se elimina el componente o cuando se quita un campo, el cielo, los reflejos y la iluminación vuelven a sus valores por defecto, y al volver a entrar se aplican de nuevo. Los cambios se aplican de inmediato, sin transición.

{% hint style="warning" %}
**📔 Nota**: Mientras están activas, estas modificaciones son globales: las parcelas vecinas que se ven desde dentro de tu escena también se renderizan con tu cielo, tu niebla y tu iluminación.
{% endhint %}

{% hint style="info" %}
**💡 Consejo**: La escena de prueba [`2,2-reflection-map`](https://github.com/decentraland/sdk7-test-scenes/tree/main/scenes/2,2-reflection-map) ejercita el componente `Skybox`: texturas de cielo y de reflejos, presets de entorno, ocultar el sol y un modo de oscuridad total.
{% endhint %}
