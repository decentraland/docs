---
description: >-
  Obtén datos del contexto donde tu escena está ejecutándose y de la escena
  misma
metaLinks:
  alternates:
    - >-
      https://app.gitbook.com/s/oPnXBby9S6MrsW83Y9qZ/scenes-sdk7/interactivity/runtime-data
---

# Datos del runtime

## Obtener la hora de Decentraland

Decentraland sigue un ciclo día/noche que tarda 2 horas en completarse, por lo que hay 12 ciclos completos cada día. Los jugadores también pueden cambiar la configuración para experimentar un momento específico y fijo del día, por ejemplo, para siempre ver Decentraland con un cielo nocturno de las 10 pm. Por esta razón, la hora de Decentraland puede variar de un jugador a otro.

Usa `getWorldTime()` para obtener la hora del día que el jugador está experimentando dentro de Decentraland.

```ts
import { getWorldTime } from '~system/Runtime'

executeTask(async () => {
  let time = await getWorldTime({})
  console.log(time.seconds)
})
```

{% hint style="info" %}
**💡 Consejo**: La función `getWorldTime()` es asincrónica. Consulta [Funciones asincrónicas](../programming-patterns/async-functions.md) si no estás familiarizado con ellas.
{% endhint %}

`getWorldTime()` devuelve un objeto con una propiedad `seconds`. Esta propiedad indica cuántos segundos han pasado (en tiempo de Decentraland) desde el inicio del día, asumiendo que el ciclo completo dura 24 horas. Divide el valor de segundos por 60 para obtener minutos, y por 60 nuevamente para obtener las horas desde el inicio del día. Por ejemplo, si el valor de `seconds` es _36000_, corresponde a _10 AM_.

En tiempo de Decentraland, el sol siempre sale a las 6:15 y se pone a las 19:50.

Podrías usar esta información para cambiar la escena en consecuencia, por ejemplo para reproducir sonidos de pájaros cuando hay luz del día y grillos cuando está oscuro, o para encender los materiales emisivos en las lámparas cuando está oscuro.

```ts
import { getWorldTime } from '~system/Runtime'

executeTask(async () => {
  let time = await getWorldTime({})
  console.log(time.seconds)
  if (time.seconds < 6.25 * 60 * 60 || time.seconds > 19.85 * 60 * 60) {
    // hora nocturna
    console.log('playing cricket sounds')
  } else {
    // hora diurna
    console.log('playing bird sounds')
  }
})
```

## Obtener datos del realm

Los jugadores en Decentraland existen en varios _realms_ separados. Los jugadores en diferentes realms no pueden verse, interactuar o chatear entre sí, incluso si están parados en las mismas parcelas. Dividir a los jugadores de esta manera permite a Decentraland manejar una cantidad ilimitada de jugadores sin encontrar ninguna limitación. También empareja a jugadores que están en regiones cercanas, para asegurar que los tiempos de ping entre jugadores que interactúan sean aceptables.

Si tu escena envía datos a un [servidor de terceros](../networking/authoritative-servers.md) para sincronizar cambios entre jugadores en tiempo real, entonces a menudo es importante que los cambios solo se sincronicen entre jugadores que están en el mismo realm. Debes manejar todos los cambios que pertenecen a un realm como separados de aquellos en un realm diferente. De lo contrario, los jugadores verán cosas cambiar de una manera espeluznante, sin que nadie haga el cambio.

```ts
import { getRealm } from '~system/Runtime'

executeTask(async () => {
  const { realmInfo } = await getRealm({})
  console.log(`You are in the realm: `, realmInfo.realmName)
})
```

{% hint style="info" %}
**💡 Consejo**: La función `getRealm()` es asincrónica. Consulta [Funciones asincrónicas](../programming-patterns/async-functions.md) si no estás familiarizado con ellas.
{% endhint %}

Decentraland maneja sus comunicaciones entre jugadores (incluyendo posiciones de jugadores, chat, mensajes de messageBus y cambios de estado de smart items) a través de una red descentralizada de servidores de comunicación, cada uno de estos servidores se llama un **Realm**. Cada uno de estos servidores puede soportar múltiples **rooms** separadas (también llamadas **islands**), cada una agrupando un conjunto diferente de jugadores que están cerca unos de otros en el mapa de Decentraland.

La función `getRealm()` devuelve la siguiente información:

* `baseUrl`: _(string)_ El dominio del servidor realm
* `realmName`: _(string)_ El nombre del servidor realm
* `networkId`: _(number)_ La red de Ethereum
* `commsAdapter`: _(string)_ Adaptador de comunicaciones, eliminando todos los parámetros de consulta (credenciales)
* `isPreview`: _(boolean)_ True si la escena se está ejecutando como una vista previa local, en lugar de publicada en Decentraland.
* `isConnectedSceneRoom`: _(boolean)_ True si el usuario está conectado a la sala de la escena.

{% hint style="warning" %}
**📔 Nota**: La propiedad `layer` está obsoleta y debe evitarse.
{% endhint %}

A medida que los jugadores se mueven por el mapa, pueden cambiar de rooms para agruparse con aquellos jugadores que ahora están más cerca de ellos. Las rooms también cambian sus fronteras dinámicamente para ajustarse a un grupo manejable de personas, por lo que incluso si un jugador se queda quieto, a medida que los jugadores entran y salen del mundo, el jugador podría encontrarse en otra room. Los jugadores en una misma `room` están comunicados, y compartirán mensajes a través del MessageBus incluso si están demasiado lejos para verse. Los jugadores en un mismo servidor pero en diferentes rooms no están actualmente comunicándose, pero podrían comunicarse a medida que se mueven por el mapa y cambian de rooms.

Consulta [onRealmChangedObservable](event-listeners.md#player-changes-realm-or-island) para saber cómo detectar cambios relacionados con el realm o isla del jugador.

{% hint style="warning" %}
**📔 Nota**: Cuando la escena se carga por primera vez, puede que aún no haya una room asignada para el jugador. El explorador eventualmente asignará una room al jugador, pero esto a veces puede ocurrir un par de segundos después de que la escena se cargue.
{% endhint %}

## Obtener la plataforma del jugador

Los jugadores pueden acceder a Decentraland a través de varias plataformas, incluyendo la aplicación oficial de escritorio, y versiones web y de escritorio obsoletas, así como [clientes experimentales alternativos](https://github.com/decentraland/protocol-squad) construidos para otros motores.

Usa `getExplorerInformation()` para saber en qué plataforma el jugador actual está ejecutando Decentraland.

```ts
import { getExplorerInformation } from '~system/Runtime';

executeTask(async () => {
  let data = await getExplorerInformation({})
  console.log("PLATFORM: ", data.platform, " AGENT: ", data.agent)
})
```

Al usar la aplicación oficial de escritorio de Decentraland, esta función debería devolver los siguientes datos:

```
{
    agent: unity-explorer,
    platform: desktop
}
```

Los jugadores que usan la aplicación oficial de escritorio de Decentraland probablemente tendrán una experiencia mucho más fluida que aquellos en el navegador, ya que el navegador impone limitaciones de rendimiento sobre cuánto poder de procesamiento de la máquina puede usar la pestaña del navegador. También faltarán muchas características como control de cámara, luces dinámicas, congelamiento del movimiento del jugador, mejoras de UI, etc.

## El componente EngineInfo

El componente `EngineInfo` rastrea datos sobre el ciclo de vida de la escena, lo que a veces puede ser útil para saber cuándo está ocurriendo un evento, en relación con la inicialización de la escena.

Este componente se agrega a `engine.RootEntity`.

```ts
engine.addSystem((deltaTime) => {
  const engineInfo = EngineInfo.getOrNull(engine.RootEntity)
  if (!engineInfo) return

  console.log(
    '--------------' +
      '\nframeNumber: ' +
      engineInfo.frameNumber +
      '\ntickNumber: ' +
      engineInfo.tickNumber +
      '\ntotalRuntime: ' +
      engineInfo.totalRuntime +
      '\nsceneHidden: ' +
      engineInfo.sceneHidden +
      '\n--------------'
  )
})
```

El componente `EngineInfo` contiene los siguientes datos:

* `frame_number`: Contador de frames del motor
* `total_runtime`: Runtime total de esta escena en segundos
* `tick_number`: Contador de ticks de la escena según [ADR-148](https://adr.decentraland.org/adr/ADR-148)
* `scene_hidden`: Si la escena está actualmente oculta detrás de la UI de pantalla completa del Explorer

{% hint style="warning" %}
**📔 Nota**: El componente `EngineInfo` debe importarse mediante

> `import { EngineInfo } from "@dcl/sdk/ecs"`

Consulta [Importaciones](../getting-started/coding-scenes.md#imports) para saber cómo manejarlas fácilmente.
{% endhint %}

### Reaccionar a la desaparición de la pantalla de carga

El campo `scene_hidden` indica si el jugador realmente puede ver tu escena, o si está cubierta por la UI de pantalla completa del Explorer. Mientras la pantalla de carga está visible, `sceneHidden` vale `true`. En el momento en que la pantalla de carga se desvanece y el jugador ve el mundo por primera vez, pasa a `false`.

Esta es la única forma que tiene una escena de saber cuándo ocurre esa primera revelación. Úsala para retener todo aquello que, de otro modo, sucedería detrás de la pantalla de carga y el jugador se perdería: cinemáticas de introducción, sonidos de bienvenida, un tween que solo se entiende si se mira, una UI de apertura, o un evento de analítica que solo debería contar cuando el jugador realmente está ahí.

```ts
import { engine, EngineInfo } from '@dcl/sdk/ecs'

function onSceneRevealed() {
  // El jugador ya está viendo la escena, arranca la introducción acá
  console.log('La pantalla de carga acaba de desaparecer')
}

engine.addSystem(function waitForSceneRevealed() {
  const engineInfo = EngineInfo.getOrNull(engine.RootEntity)
  if (!engineInfo || engineInfo.sceneHidden) return

  // Ejecutar una sola vez
  engine.removeSystem(waitForSceneRevealed)
  onSceneRevealed()
})
```

{% hint style="warning" %}
**📔 Nota**: Tu escena sigue ejecutándose normalmente mientras `sceneHidden` vale `true`, simplemente no se está mostrando. No uses este campo para pausar la lógica de tu escena, úsalo para temporizar aquello que el jugador debe presenciar.

`scene_hidden` requiere un `@dcl/sdk` actualizado y una versión reciente del Decentraland Explorer. En clientes más antiguos el campo mantiene su valor por defecto `false`, así que una escena que lo espera igual se ejecuta — simplemente no queda sincronizada con la desaparición de la pantalla de carga.
{% endhint %}

