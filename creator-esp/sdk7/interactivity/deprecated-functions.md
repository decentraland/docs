---
description: Funciones heredadas
metaLinks:
  alternates:
    - >-
      https://app.gitbook.com/s/oPnXBby9S6MrsW83Y9qZ/scenes-sdk7/interactivity/deprecated-functions
---

# Funciones obsoletas

Las siguientes funciones son todas heredadas y deben evitarse. Aún funcionan, pero en el futuro podrían dejar de ser compatibles. Todos estos ejemplos incluyen enlaces a formas alternativas de obtener la misma información o lograr los mismos resultados.

## El jugador entra o sale de la escena

{% hint style="warning" %}
**📔 Nota**: Los eventos `onEnterSceneObservable` y `onLeaveSceneObservable` están obsoletos en SDK 7.x. Usa `onEnterScene` en su lugar, consulta [El jugador entra o sale de la escena](event-listeners.md#player-enters-or-leaves-scene).
{% endhint %}

Cada vez que un avatar entra o sale de las parcelas de tierra que conforman tu escena, o se teletransporta dentro o fuera, esto crea un evento al que puedes escuchar. Este evento es activado por todos los avatares, incluido el del jugador.

```ts
import {
	onEnterSceneObservable,
	onLeaveSceneObservable,
} from '@dcl/sdk/observables'

onEnterSceneObservable.add((player) => {
	console.log('player entered scene: ', player.userId)
})

onLeaveSceneObservable.add((player) => {
	console.log('player left scene: ', player.userId)
})
```

{% hint style="warning" %}
**📔 Nota**: Este evento solo responde a jugadores que actualmente están siendo renderizados localmente. En escenas grandes donde el tamaño de la escena excede el rango visual, los jugadores que entran en la esquina opuesta pueden no ser registrados. Si el número de jugadores en la región excede las capacidades de una isla en los servidores de Decentraland, los jugadores que no comparten una misma isla no son visibles y tampoco son rastreados por estos eventos.
{% endhint %}

Los observables `onEnterScene` y `onLeaveScene` importados desde `'@dcl/sdk/observables'` también están obsoletos. Las funciones correctas tienen el mismo nombre, pero se importan desde `'@dcl/sdk/src/players'` en su lugar. En el ejemplo a continuación puedes ver ambas variaciones, primero la versión obsoleta, luego la correcta.

```ts
// OBSOLETO - importado desde observables
import { onEnterScene, onLeaveScene } from '@dcl/sdk/observables'

onEnterScene.add((player) => {
	console.log('player entered scene: ', player.userId)
})

onLeaveScene.add((player) => {
	console.log('player left scene: ', player.userId)
})

// ACTUAL - importado como una función de jugador
import { onEnterScene, onLeaveScene } from '@dcl/sdk/src/players'

export function main() {
	onEnterScene((player) => {
		if (!player) return
		console.log('ENTERED SCENE', player)
	})

	onLeaveScene((userId) => {
		if (!userId) return
		console.log('LEFT SCENE', userId)
	})
}
```

## El jugador se conecta o desconecta

{% hint style="warning" %}
**📔 Nota**: La función `getConnectedPlayers` y los eventos `onPlayerConnectedObservable` y `onPlayerDisconnectedObservable` están obsoletos en SDK 7.x. Usa `onEnterScene` en su lugar, consulta [El jugador entra o sale de la escena](event-listeners.md#player-enters-or-leaves-scene). Cada escena ahora es una isla de comunicaciones distinta, haciendo que sea lo mismo estar conectado o en la misma escena.
{% endhint %}

Obtén la lista completa de jugadores actualmente conectados desde `getConnectedPlayers`.

```ts
import { getConnectedPlayers } from '~system/Players'

executeTask(async () => {
	let connectedPlayers = await getConnectedPlayers({})
	connectedPlayers.players.forEach((player) => {
		console.log('player was already here: ', player.userId)
	})
})
```

Cada vez que otro jugador comienza o deja de ser renderizado por el motor local, esto crea un evento al que puedes escuchar. Los jugadores pueden o no estar parados en la misma escena que tú, pero deben estar dentro del rango visual (no necesariamente a la vista). El `onPlayerConnectedObservable` detecta tanto cuando un jugador se conecta recientemente cerca como cuando se acerca lo suficiente para estar en rango visual, del mismo modo el `onPlayerDisconnectedObservable` detecta cuando un jugador termina su sesión o se aleja demasiado.

```ts
import {
	onPlayerConnectedObservable,
	onPlayerDisconnectedObservable,
} from '@dcl/sdk/observables'

onPlayerConnectedObservable.add((player) => {
	console.log('player entered: ', player.userId)
})

onPlayerDisconnectedObservable.add((player) => {
	console.log('player left: ', player.userId)
})
```

Ten en cuenta que si otros jugadores ya están siendo renderizados en los alrededores antes de que el jugador haya cargado tu escena, este evento no notificará a la escena recién cargada de los jugadores ya existentes. Si necesitas hacer un seguimiento de todos los jugadores actuales, puedes consultar los jugadores existentes al cargar la escena, y luego escuchar este evento para actualizaciones.

## Consultar todos los jugadores en la escena

{% hint style="warning" %}
**📔 Nota**: La función `getPlayersInScene` está obsoleta en SDK 7.x. En su lugar, itera sobre todos los jugadores con un componente `PlayerIdentityData`. Consulta [Obtener todos los jugadores](user-data.md#fetch-all-players).
{% endhint %}

También puedes obtener la lista completa de jugadores que actualmente están en tu escena y siendo renderizados llamando a `getPlayersInScene()`.

```ts
import { getPlayersInScene } from '~system/Players'

executeTask(async () => {
	let connectedPlayers = await getPlayersInScene({})
	connectedPlayers.players.forEach((player) => {
		console.log('player was already here: ', player.userId)
	})
})
```

## El jugador reproduce una animación

{% hint style="warning" %}
**📔 Nota**: El evento `onPlayerExpressionObservable` está obsoleto en SDK 7.x. Usa el componente `AvatarEmoteCommand` en su lugar, consulta [El jugador reproduce una animación](event-listeners.md#player-plays-animation).
{% endhint %}

Cada vez que el jugador reproduce un emote (baile, aplaudir, saludar, etc.), puedes detectar este evento.

```ts
import { onPlayerExpressionObservable } from '@dcl/sdk/observables'

onPlayerExpressionObservable.add(({ expressionId }) => {
	console.log('Expression: ', expressionId)
})
```

El evento incluye la siguiente información:

* expressionId: Nombre del emote realizado (ej: _wave_, _clap_, _kiss_)

{% hint style="warning" %}
**📔 Nota**: Este evento se activa cada vez que el jugador hace un emote y la escena está cargada. El jugador podría estar parado en una escena cercana cuando esto sucede.
{% endhint %}

## El jugador cambia de perfil

{% hint style="warning" %}
**📔 Nota**: El evento `onProfileChanged` está obsoleto en SDK 7.x. Usa el componente `AvatarEquippedData` en su lugar, consulta [El jugador cambia de perfil](event-listeners.md#player-changes-profile).
{% endhint %}

Cada vez que el jugador realiza un cambio en su perfil, se llama al evento `onProfileChanged`. Estos cambios pueden incluir ponerse diferentes wearables, cambiar nombre, descripción, activar experiencias portátiles, etc.

```ts
import { onProfileChanged } from '@dcl/sdk/observables'

onProfileChanged.add((profileData) => {
	console.log('Own profile data is ', profileData)
})
```

Los datos del evento incluyen solo el ID del jugador y un número de versión para el perfil de ese avatar, según el servidor catalyst. Cada vez que se propaga un cambio, el número de versión aumenta en 1.

Cuando se activa este evento, puedes usar la función [getUserData()](user-data.md#get-player-data) para obtener la última versión de esta información, incluida la lista de wearables que el jugador tiene puestos. Es posible que necesites agregar un ligero retraso antes de llamar a `getUserData()` para asegurarte de que la versión que devuelve esta función esté actualizada.

{% hint style="info" %}
**💡 Consejo**: Al probar en vista previa con el explorador web heredado, para evitar usar un avatar aleatorio, ejecuta la escena en el navegador conectado con tu billetera Metamask.
{% endhint %}

{% hint style="warning" %}
**📔 Nota**: Este evento solo se activa por cambios al jugador actual, no por cambios en los perfiles de otros jugadores cercanos.
{% endhint %}

## La escena terminó de cargar

{% hint style="warning" %}
**📔 Nota**: El evento `onSceneReadyObservable` está obsoleto desde SDK v7.x. Esta función ya no es relevante. Puedes asegurarte de que algo se ejecute después de que la escena termine de cargar ejecutándolo dentro de la función `Main()`. Consulta [Ciclo de vida de la escena](../getting-started/coding-scenes.md#scene-lifecycle)
{% endhint %}

Cuando la escena termina de cargar, se llama el `onSceneReadyObservable`. Esto funciona tanto si el jugador carga directamente en la escena, o si el jugador camina hasta la escena desde otro lugar. Cuando todo el contenido en la escena ha terminado su carga inicial, incluidos modelos pesados, etc., se llama este evento.

```ts
import { onSceneReadyObservable } from '@dcl/sdk/observables'

onSceneReadyObservable.add(() => {
	console.log('SCENE LOADED')
})
```

## Métodos obsoletos de datos del jugador

{% hint style="warning" %}
**📔 Nota**: Las funciones `getUserData()` y `getPlayerData()` están obsoletas desde SDK v7.4.x. Usa `getPlayer()` en su lugar. Consulta [Datos de usuario](user-data.md#get-user-data).
{% endhint %}

Para obtener información del jugador actual que está ejecutando la escena, usa `getUserData()`.

El ejemplo a continuación importa el namespace `~system/UserIdentity` y ejecuta `getUserData()`.

```ts
import { getUserData } from '~system/UserIdentity'

executeTask(async () => {
	let userData = await getUserData({})
	console.log(userData.data)
})
```

Puedes obtener datos de otros jugadores que están cerca, llamando a `getPlayerData()`, pasando el id de una cuenta de Decentraland.

```ts
import { getPlayerData } from '~system/Players'

executeTask(async () => {
	let userData = await getPlayerData({ userId: '0x….' })
	console.log(userData)
})
```

Tanto `getUserData()` como `getPlayerData()` devuelven la misma estructura de datos disponible a través de la API de contenido. Consulta [Datos de cualquier jugador](user-data.md#data-from-any-player)

`getPlayerData()` solo puede obtener datos de jugadores que actualmente están cerca. No tienen que estar necesariamente parados en la misma escena, pero en rango visual, eso es porque esta información se obtiene del motor local que está renderizando estos avatares. Para probar esto en vista previa, abre una segunda pestaña e inicia sesión con una cuenta diferente.

{% hint style="warning" %}
**📔 Nota**: Los IDs de usuario siempre deben estar en minúsculas. Si copias una dirección de billetera, asegúrate de que todos los caracteres estén en minúsculas.
{% endhint %}

Las funciones `getUserPublicKey()` y `getUserAccount()` también están obsoletas. Por favor usa `getPlayer()` en su lugar. Consulta [Datos de usuario](user-data.md#get-user-data).

## Obtener la hora del skybox

{% hint style="warning" %}
**📔 Nota**: La función `getDecentralandTime()` está obsoleta desde SDK v7.x.x. Usa `getWorldTime()` en su lugar. Consulta [Obtener la hora de Decentraland](runtime-data.md#get-decentraland-time).
{% endhint %}

```ts
import { getDecentralandTime } from '~system/EnvironmentApi'

executeTask(async () => {
	let time = await getDecentralandTime({})
	console.log(time)
})
```

## Obtener realm

{% hint style="warning" %}
**📔 Nota**: La función `getCurrentRealm()` está obsoleta desde SDK v7.x.x. Usa `getRealm()` en su lugar. Consulta [Obtener datos del Realm](runtime-data.md#get-realm-data).
{% endhint %}

```ts
import { getCurrentRealm } from '@decentraland/EnvironmentAPI'

async function fetchPlayerData() {
	const playerRealm = await getCurrentRealm()

	console.log(playerRealm.domain)
}

fetchPlayerData()
```

## Es modo de vista previa

{% hint style="warning" %}
**📔 Nota**: La función `isPreviewMode()` está obsoleta desde SDK v7.x.x. Usa `getRealm()` en su lugar, que contiene una propiedad `preview`. Consulta [Obtener datos del Realm](runtime-data.md#get-realm-data).
{% endhint %}

```ts
import { isPreviewMode } from '~system/EnvironmentAPI'

executeTask(async () => {
	const preview: boolean = await isPreviewMode({})

	if (preview) {
		console.log('Running in preview')
	}
})
```

## El jugador hace clic en otro jugador

Cada vez que el jugador hace clic en otro jugador, puedes detectar un evento.

```ts
import { onPlayerClickedObservable } from '@dcl/sdk/observables'

onPlayerClickedObservable.add((clickEvent) => {
	console.log('Clicked ', clickEvent.userId, ' details: ', clickEvent.ray)
})
```

{% hint style="warning" %}
**📔 Nota**: El evento `onPlayerClickedObservable` está obsoleto desde SDK v7.x. Las versiones futuras permitirán un enfoque más [orientado a datos](../architecture/data-oriented-programming.md), basado en consultar datos regularmente en lugar de eventos.

Como alternativa, puedes adjuntar un colisionador invisible al jugador y detectar clics contra esto.
{% endhint %}

{% hint style="warning" %}
**📔 Nota**: Tanto el jugador que realiza el clic como el jugador al que se hace clic deben estar parados dentro de las parcelas de la escena. Este listener solo detecta eventos del jugador actual haciendo clic en otros jugadores, no aquellos de clics realizados por otros jugadores.
{% endhint %}

El evento incluye los siguientes datos:

* `userId`: El id del jugador al que se hizo clic
* `ray`: Datos sobre el rayo trazado por el clic
  * `direction`: _Vector3_ Un Vector3 normalizado que representa la dirección desde el punto de origen del clic hasta el punto de impacto del clic.
  * `distance`: _number_ La distancia en metros desde el punto de origen hasta el punto de impacto.
  * `origin`: _Vector3_ El punto de origen del clic, la posición del jugador que hizo el clic, relativa a la escena.

{% hint style="info" %}
**💡 Consejo**: El comportamiento predeterminado de hacer clic en otro jugador es abrir el pasaporte del jugador, donde puedes ver información adicional sobre ese jugador, agregarlo como amigo, etc. Puedes deshabilitar la apertura de esta UI para que no interfiera con la experiencia que deseas construir agregando un [Área modificadora de avatar](avatar-modifiers.md).
{% endhint %}

## El jugador bloquea/desbloquea el cursor

{% hint style="warning" %}
**📔 Nota**: El evento `onPointerLockedStateChange` está obsoleto desde SDK v7.x. Consulta [Event listeners](event-listeners.md#player-locks-or-unlocks-cursor) para una alternativa no obsoleta.
{% endhint %}

Los jugadores pueden cambiar entre dos modos de cursor: modo de _cursor bloqueado_ para controlar la cámara o modo de _cursor desbloqueado_ para mover el cursor libremente sobre la UI.

Los jugadores desbloquean el cursor haciendo clic en el _botón derecho del mouse_ o presionando la tecla _Esc_, y bloquean el cursor nuevamente haciendo clic en cualquier lugar de la pantalla.

Este evento `onPointerLockedStateChange` se activa cada vez que un jugador cambia entre estos dos modos, mientras está cerca de la escena.

```ts
import { onPointerLockedStateChange } from '@dcl/sdk/observables'

onPointerLockedStateChange.add(({ locked }) => {
	if (locked) {
		console.log('Pointer has been locked')
	} else {
		console.log('Pointer has been unlocked')
	}
})
```

{% hint style="warning" %}
**📔 Nota**: Este evento se activa incluso si el jugador no está parado directamente dentro de la escena.
{% endhint %}

## El jugador cambia de realm o isla

Los jugadores en Decentraland existen en _realms_ separados, y en _islas_ separadas dentro de cada realm. Los jugadores en diferentes realms o islas no pueden verse, interactuar o chatear entre sí, incluso si están parados en las mismas parcelas.

Cada vez que el jugador cambia de realm o isla, se llama el evento `onRealmChangedObservable`.

```ts
import { onRealmChangedObservable } from '@dcl/sdk/observables'

onRealmChangedObservable.add((realmChange) => {
	console.log('PLAYER CHANGED ISLAND TO ', realmChange.room)
})
```

{% hint style="warning" %}
**📔 Nota**: El evento `onRealmChangedObservable` está obsoleto desde SDK v7.x. Las versiones futuras permitirán un enfoque más [orientado a datos](../architecture/data-oriented-programming.md), basado en consultar datos regularmente en lugar de eventos.
{% endhint %}

Este evento incluye los siguientes campos:

* **serverName**: _string_; El nombre del servidor catalyst.
* **room**: _string_; El nombre de la isla.
* **displayName**: _string_; El nombre del servidor catalyst seguido de un _-_ y el nombre de la isla. Por ejemplo `unicorn-x011`.
* **domain**: _string_; La url al servidor catalyst que se está usando.

A medida que los jugadores se mueven por el mapa, pueden cambiar de islas para agruparse con aquellos jugadores que ahora están más cerca de ellos. Las islas también cambian sus fronteras dinámicamente para ajustarse a un grupo manejable de personas en cada una. Entonces, incluso si un jugador se queda quieto, podría cambiar de isla a medida que otros entran y salen de las escenas circundantes.

Si tu escena depende de un [servidor de terceros](../networking/authoritative-servers.md) para sincronizar cambios entre jugadores en tiempo real, entonces es posible que solo desees compartir datos entre jugadores que están agrupados en un mismo realm+isla, por lo que es una buena práctica cambiar de salas en el servidor de terceros cada vez que los jugadores cambian de isla.

## Funciones de criptografía

{% hint style="warning" %}
**📔 Nota**: Las funciones `requirePayment()`, `signMessage()`, `convertMessageToObject()` están obsoletas. Usa la función `sendAsync()` en su lugar. Consulta [Operaciones blockchain de la escena](deprecated-functions.md). También hay bibliotecas que pueden ayudar a simplificar algunos casos de uso comunes con estas funciones.
{% endhint %}

## Eventos de video

{% hint style="warning" %}
**📔 Nota**: El evento `onVideoEvent` está obsoleto desde SDK v7.x. Consulta [Event listeners](../media/video-playing.md#video-events) para una alternativa no obsoleta.
{% endhint %}

Cuando un video cambia su estado de reproducción, el observable `onVideoEvent` recibe un evento.

```ts
onVideoEvent.add((data) => {
	log('New Video Event ', data)
})
```

La entrada de un evento de video contiene las siguientes propiedades:

* `videoClipId` ( _string_): El ID para la entidad que cambió de estado.
* `componentId` (_string_): El ID de la entidad que cambió de estado.
* `currentOffset` (_number_): El valor actual de la propiedad `seek` en el video. Este valor muestra segundos después del comienzo original del video. _-1_ por defecto.
* `totalVideoLength` (_number_ ): La longitud en segundos del video completo. _-1_ si la longitud es desconocida.
* `videoStatus`: El valor para el nuevo estado de video del `VideoTexture`, expresado como un valor del enum `VideoStatus`. Este enum puede contener los siguientes valores posibles:
* `VideoStatus.NONE` = 0,
* `VideoStatus.ERROR` = 1,
* `VideoStatus.LOADING` = 2,
* `VideoStatus.READY` = 3,
* `VideoStatus.PLAYING` = 4,
* `VideoStatus.BUFFERING` = 5
