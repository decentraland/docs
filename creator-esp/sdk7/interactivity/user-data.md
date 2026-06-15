---
description: Obtén datos de los jugadores mientras interactúan con tu escena
metaLinks:
  alternates:
    - >-
      https://app.gitbook.com/s/oPnXBby9S6MrsW83Y9qZ/scenes-sdk7/interactivity/user-data
---

# Datos del jugador

## Posición y rotación del jugador

Usa `PlayerEntity` y `CameraEntity` para conocer la posición y rotación del jugador, verificando sus componentes `Transform`.

```ts
function getPlayerPosition() {
	if (!Transform.has(engine.PlayerEntity)) return
	if (!Transform.has(engine.CameraEntity)) return

	//posición del jugador
	const playerPos = Transform.get(engine.PlayerEntity).position

	//rotación del jugador
	const playerRot = Transform.get(engine.PlayerEntity).rotation

	//posición de la cámara
	const CameraPos = Transform.get(engine.CameraEntity).position

	//rotación de la cámara
	const CameraRot = Transform.get(engine.CameraEntity).rotation

	console.log('playerPos: ', playerPos)
	console.log('playerRot: ', playerRot)
	console.log('cameraPos: ', CameraPos)
	console.log('cameraRot: ', CameraRot)
}

engine.addSystem(getPlayerPosition)
```

* **Posición de PlayerEntity**: La posición del avatar, a la altura del pecho. Aproximadamente a 0.88 cm sobre el suelo.
* **Rotación de PlayerEntity**: La dirección en la que el avatar está mirando, expresada como un quaternion.
* **Posición de CameraEntity**:
  * En primera persona: Igual a la posición del avatar, pero a la altura de los ojos. Aproximadamente a 1.75 cm sobre el suelo.
  * En tercera persona: Puede variar dependiendo de los movimientos de la cámara.
* **Rotación de PlayerEntity**:
  * En primera persona: Similar a la dirección en la que el avatar está mirando, expresada como un quaternion. Puede estar redondeada ligeramente diferente de la rotación del jugador.
  * En tercera persona: Puede variar dependiendo de los movimientos de la cámara.

{% hint style="warning" %}
**📔 Nota**: Evita referirte a `engine.PlayerEntity` o `engine.CameraEntity` en la carga inicial de la escena, porque eso puede resultar en errores si las entidades aún no están inicializadas. Para evitar este problema, úsalas dentro de la función `main()`, o en una función llamada indirectamente por `main()`. También puedes encapsular el comportamiento en un bloque async [`executeTask`](../programming-patterns/async-functions.md#the-executetask-function).

Otra opción es referirte a estas entidades dentro de un sistema. Allí siempre estarán disponibles, porque la primera ejecución del sistema se llama una vez que la escena ya está correctamente inicializada.
{% endhint %}

## Obtener todos los jugadores

Todos los jugadores en la escena tienen un componente `Transform`. Este componente es de solo lectura en avatares. Para obtener las posiciones de todos los jugadores, [itera sobre todas las entidades con](../architecture/querying-components.md) un componente `PlayerIdentityData`.

```ts
import { PlayerIdentityData } from '@dcl/sdk/ecs'

for (const [entity, data, transform] of engine.getEntitiesWith(
	PlayerIdentityData,
	Transform
)) {
	console.log('Player data: ', { entity, data, transform })
}
```

El código anterior itera sobre todas las entidades con un componente `Transform` y `PlayerIdentityData`, y registra sus datos. Puedes usar este mismo método para obtener cualquiera de los datos disponibles de todos los jugadores.

Consulta [Event listeners](event-listeners.md#player-locks-or-unlocks-cursor) para aprender cómo detectar y reaccionar cuando nuevos jugadores se unen a la escena.

## Obtener datos del jugador

Usa `getPlayer()` para obtener datos sobre el jugador actual, o cualquier otro jugador en la escena.

```ts
import { getPlayer } from '@dcl/sdk/src/players'

export function main() {
	createCube(5, 1, 5)

	let myPlayer = getPlayer()

	if (myPlayer) {
		console.log('Name : ', myPlayer.name)
		console.log('UserId : ', myPlayer.userId)
	}
}
```

`getPlayer()` devuelve lo siguiente:

* `name`: _(string)_ El nombre de usuario del jugador, como otros ven en el mundo
* `userId`: _(string)_ Una cadena UUID que identifica al jugador. Si el jugador tiene una clave pública, este campo tendrá el mismo valor que la clave pública.
* `isGuest`: _(boolean)_ Indica si el jugador tiene una clave pública. _True_ si el jugador es una cuenta de invitado sin clave pública.
* `position`: _(Vector3)_ La posición del avatar en la escena.
* `avatar`: Un objeto anidado con datos sobre el avatar base del jugador y su apariencia.
* `wearables`: Un array de identificadores para cada uno de los wearables que el jugador está usando actualmente. Por ejemplo `urn:decentraland:off-chain:base-avatars:green_hoodie`. Todos los wearables tienen un identificador similar, incluso si son NFTs.
* `emotes`: Un array de identificadores para cada uno de los emotes que el jugador tiene actualmente equipados en la rueda de acceso rápido.
* `entity`: Una referencia a la entidad del jugador. Esto puede ser útil para pasarlo a otras funciones, o para agregar componentes personalizados.

El objeto `avatar` tiene la siguiente información anidada:

* `bodyShapeUrn`: Un identificador para la forma general del cuerpo del avatar. Ya sea `urn:decentraland:off-chain:base-avatars:BaseFemale` para femenino o `urn:decentraland:off-chain:base-avatars:BaseMale` para masculino.
* `skinColor`: Color de piel del jugador como un `Color4`
* `eyesColor`: Color de ojos del jugador como un `Color4`
* `hairColor`: Color de cabello del jugador como un `Color4`
* `name`: El nombre del jugador.

{% hint style="warning" %}
**📔 Nota**: Los datos del jugador pueden no estar disponibles en el primer frame de la escena, dependiendo de los tiempos de carga. Debes verificar que los datos fueron devueltos y de lo contrario intentar nuevamente unos milisegundos después.
{% endhint %}

```ts
import { getPlayer } from '@dcl/sdk/src/players'

export function main() {
	createCube(5, 1, 5)

	let myPlayer = getPlayer()

	if (myPlayer) {
		console.log('Is Guest: ', myPlayer.isGuest)
		console.log('Name : ', myPlayer.name)
		console.log('UserId : ', myPlayer.userId)
		console.log('Avatar shape : ', myPlayer.position)
		console.log('Avatar shape : ', myPlayer.avatar?.bodyShapeUrn)
		console.log('Avatar eyes color : ', myPlayer.avatar?.eyesColor)
		console.log('Avatar hair color : ', myPlayer.avatar?.hairColor)
		console.log('Wearables on : ', myPlayer.wearables)
		console.log('Emotes available : ', myPlayer.emotes)
	}
}
```

{% hint style="info" %}
**💡 Consejo**: Al probar en vista previa con el editor web heredado, para evitar usar un avatar aleatorio, ejecuta la escena en el navegador conectado con tu billetera Metamask.
{% endhint %}

Para obtener los datos de un jugador específico en la escena, diferente del jugador actual, ejecuta `getPlayer()` con un objeto con una propiedad `userId`.

```ts
import { getPlayer } from '@dcl/sdk/src/players'

for (const [entity, data, transform] of engine.getEntitiesWith(
	PlayerIdentityData,
	Transform
)) {
	let player = getPlayer({ userId: data.address })
	console.log('PLAYER : ', player?.name)
}
```

El fragmento anterior itera sobre todas las entidades con un componente `PlayerIdentityData`, es decir, todas las entidades de avatar en la escena. Luego ejecuta el `getPlayer()` para esa entidad.

`getPlayer()` solo puede obtener datos de jugadores que actualmente están parados en la misma escena, no tienen que estar necesariamente en rango visual, pero deben estar conectados a la misma isla de comunicaciones. Para probar esto en vista previa, abre una segunda pestaña e inicia sesión con una cuenta diferente, y haz que ambos jugadores estén dentro de la escena.

{% hint style="warning" %}
**📔 Nota**: Los IDs de usuario siempre deben estar en minúsculas. Si copias una dirección de billetera, asegúrate de que todos los caracteres estén en minúsculas.
{% endhint %}

## Datos de cualquier jugador

Para obtener información de cualquier jugador, haz una [llamada REST API](../networking/network-connections.md#call-a-rest-api) a los servidores de contenido.

Esta información está expuesta en la siguiente URL, agregando el ID de usuario del jugador al parámetro de la URL.

`https://peer.decentraland.org/lambdas/profile/<player user id>`

{% hint style="info" %}
**💡 Consejo**: Prueba la URL en un navegador para ver cómo está estructurada la respuesta.
{% endhint %}

La siguiente información está disponible desde esta API:

* `displayName`: _(string)_ El nombre de usuario del jugador, como otros ven en el mundo
* `userId`: _(string)_ Una cadena UUID que identifica al jugador. Si el jugador tiene una clave pública, este campo tendrá el mismo valor que la clave pública.
* `hasConnectedWeb3`: _(boolean)_ Indica si el jugador tiene una clave pública. _True_ si el jugador tiene una.
* `publicKey`: _(string)_ La clave pública de la billetera Ethereum del jugador. Si el jugador inicia sesión como invitado, sin billetera vinculada, este campo será `null`.
* `avatar`: Un objeto anidado con datos sobre la apariencia del jugador.
* `version`: _(number)_ Un número de versión que aumenta en uno cada vez que el jugador cambia cualquiera de sus configuraciones. Usa esto si encuentras datos en conflicto, para saber qué versión es más reciente.

{% hint style="warning" %}
**📔 Nota**: Para cualquier transacción de Ethereum con el jugador, siempre usa el campo `publicKey`, en lugar del `userId`, para evitar lidiar con billeteras inexistentes.
{% endhint %}

El objeto `avatar` tiene la siguiente información anidada:

* `wearables`: `WearableId[]` Un array de identificadores para cada uno de los wearables que el jugador está usando actualmente. Por ejemplo `urn:decentraland:off-chain:base-avatars:green_hoodie`. Todos los wearables tienen un identificador similar, incluso si son NFTs.
* `bodyShape`: Un identificador para la forma general del cuerpo del avatar. Ya sea `urn:decentraland:off-chain:base-avatars:BaseFemale` para femenino o `urn:decentraland:off-chain:base-avatars:BaseMale` para masculino.
* `skinColor`: _ColorString_ Un valor hexadecimal para el color de piel del jugador.
* `hairColor`: _ColorString_ Un valor hexadecimal para el color de cabello del jugador.
* `eyeColor`: _ColorString_ Un valor hexadecimal para el color de ojos del jugador.
* `snapshots`: Un objeto anidado con representaciones en base64 de imágenes .jpg del jugador en varias resoluciones.
  * `face256`: _string_ La cara del jugador como una imagen de 256x256 píxeles.
  * `body`: _string_ La imagen de resolución completa del jugador parado derecho, con 512x1024 píxeles.

{% hint style="danger" %}
**❗Advertencia** Las capturas del avatar quedarán obsoletas en el futuro y ya no se devolverán como parte de los datos de un avatar. El enfoque recomendado es usar `AvatarTexture` en su lugar, consulta [Retratos de Avatar](../3d-essentials/materials.md#avatar-portraits).
{% endhint %}

A diferencia de `getPlayer()`, esta opción no está limitada solo a los jugadores que actualmente están en la misma escena, o incluso en el mismo servidor. Con este enfoque puedes obtener datos de cualquier jugador que haya iniciado sesión en los servidores en el pasado.

Si sabes en qué servidor está conectado el jugador que deseas consultar, puedes obtener datos más actualizados enviando tus solicitudes a ese servidor específico. Por ejemplo, si el jugador cambia de ropa, esta información estará disponible instantáneamente en el servidor del jugador, pero probablemente tardará un par de minutos en propagarse al servidor `peer.decentraland.org`.

`https://<player server>/lambdas/profile/<player user id>`

{% hint style="info" %}
**💡 Consejo**: Puedes obtener el servidor del jugador actual obteniendo `getRealm().domain`.
{% endhint %}

Este ejemplo combina `myProfile.userId` y `getRealm()` para obtener los datos del jugador directamente del servidor en el que está el jugador:

```ts
import { getRealm } from '~system/Runtime'
import { myProfile } from '@dcl/sdk/network'

async function fetchPlayerData() {
	const { realmInfo } = await getRealm({})

	const url = `${realmInfo.baseUrl}/lambdas/profile/${myProfile.userId}`
	console.log('using URL: ', url)

	try {
		const json = (await fetch(url)).json()

		console.log('full response: ', json)
		console.log(
			'player is wearing :',
			json[0].metadata.avatars[0].avatar.wearables
		)
		console.log('player owns :', json[0].metadata.avatars[0].inventory)
	} catch {
		console.log('an error occurred while reaching for player data')
	}
}

fetchPlayerData()
```

## Componentes de datos del jugador

En lugar de usar `getPlayer()`, puedes leer datos directamente de una serie de componentes que almacenan los datos en cada entidad de jugador. Existen los siguientes componentes:

* `PlayerIdentityData`: Almacena la dirección del jugador y una propiedad `isGuest` para marcar cuentas de invitado.
* `AvatarBase`: Almacena datos sobre el avatar base, incluyendo:
  * `name`: El nombre del jugador.
  * `bodyShapeUrn`: Los IDs correspondientes al tipo de cuerpo masculino o femenino.
  * `skinColor`: Color de piel del jugador como un `Color4`
  * `eyeColor`: Color de ojos del jugador como un `Color4`
  * `hairColor`: Color de cabello del jugador como un `Color4`
* `AvatarEquippedData`: La lista de wearables y emotes equipados.
  * `wearableUrns`: La lista de wearables que el jugador tiene actualmente equipados.
  * `emoteUrns`: La lista de emotes que el jugador tiene actualmente equipados en la rueda de acceso rápido.
* `AvatarEmoteCommand`: Información sobre emotes que el jugador está reproduciendo actualmente. Incluye:
  * `emoteUrn`: El URN para el último emote reproducido por el jugador, desde que ingresó a la escena
  * `loop`: True si el emote se está repitiendo
  * `timestamp`: El tiempo cuando se activó este emote

```ts
for (const [entity, data, base, attach, transform] of engine.getEntitiesWith(
	PlayerIdentityData,
	AvatarBase,
	AvatarEquippedData,
	Transform
)) {
	console.log('PLAYER DATA: ', { entity, data, transform, base, attach })
}
```

{% hint style="warning" %}
**📔 Nota**: Todos estos componentes son de solo lectura. No puedes cambiar sus valores desde la escena.
{% endhint %}

## Obtener Experiencias Portátiles

Las experiencias portátiles son esencialmente escenas que no están limitadas a parcelas de tierra. Los jugadores pueden llevarlas consigo a cualquier lugar en Decentraland, agregando una nueva capa de contenido sobre el mundo. Los Smart Wearables son ejemplos de experiencias portátiles. Es posible que desees saber si un jugador está usando uno de estos, ya que un wearable inteligente puede permitir que los jugadores tengan habilidades que podrían considerarse trampa en un juego competitivo. Por ejemplo, en un juego de plataformas, un jugador que usa un jetpack tiene una ventaja muy injusta sobre otros.

Como creador de escenas, es posible que desees limitar lo que los jugadores que usan experiencias portátiles pueden hacer en tu escena. Usa `getPortableExperiencesLoaded()` para verificar si el jugador tiene alguna experiencia portátil activada actualmente.

```ts
import { getPortableExperiencesLoaded } from '~system/PortableExperiences'

executeTask(async () => {
	let portableExperiences = await getPortableExperiencesLoaded({})
	console.log(portableExperiences.loaded)
})
```

`getPortableExperiencesLoaded()` devuelve un array de objetos, cada uno de estos objetos incluye un atributo `id`. En el caso de wearables, el id es el URN del wearable.

## Obtener información detallada sobre los wearables de un jugador

La función `getPlayer()` devuelve solo una lista de IDs de wearables, sin información sobre cada wearable. Tal vez desees verificar cualquier wearable de una categoría específica (ej: sombreros), o cualquier wearable de una rareza específica (ej: Mítico), para eso necesitarás obtener información más detallada sobre los wearables del jugador.

Haz una [llamada REST API](../networking/network-connections.md#call-a-rest-api) a la siguiente URL, para obtener una lista completa actualizada de todos los wearables que están actualmente utilizables, con detalles sobre cada uno.

`${playerRealm.realmInfo.baseUrl}/lambdas/collections/wearables-by-owner/${userData.userId}?includeDefinitions`

{% hint style="warning" %}
**📔 Nota**: Para construir esta URL, debes obtener el realm (probablemente con `getRealm()`) y el ID del jugador (probablemente con `getPlayer()`)
{% endhint %}

Esta característica podría usarse junto con obtener información sobre el jugador, para por ejemplo solo permitir que los jugadores ingresen a un lugar si están usando cualquier wearable de la colección de halloween, o cualquier wearable que sea de rareza _legendaria_.

{% hint style="info" %}
**💡 Consejo**: Prueba la URL en un navegador para ver cómo está estructurada la respuesta.
{% endhint %}

```ts
import { getPlayer } from '@dcl/sdk/src/players'
import { getRealm } from '~system/Runtime'

async function fetchWearablesData() {
	try {
		let userData = getPlayer({})
		const realm = await getRealm({})

		const url =
			`${realm.realmInfo?.baseUrl}/lambdas/collections/wearables-by-owner/${userData.userId}?includeDefinitions`.toString()
		console.log('using URL: ', url)

		let response = await fetch(url)
		let json = await response.json()

		console.log('full response: ', json)
	} catch {
		console.log('an error occurred while reaching for wearables data')
	}
}

executeTask(fetchWearablesData)
```

{% hint style="info" %}
**💡 Consejo**: Puedes obtener aún más información sobre wearables específicos desde la [siguiente API](https://decentraland.github.io/catalyst-api-specs/#tag/Lambdas/operation/searchWearables).
{% endhint %}

## Verificar el modo de cámara del jugador

Los jugadores pueden estar usando una cámara en primera o tercera persona cuando exploran Decentraland. Verifica cuál de estas está usando el jugador verificando el valor del componente `CameraMode` de la entidad `engine.CameraEntity`.

```ts
function checkCameraMode() {
	if (!Transform.has(engine.CameraEntity)) return

	let cameraEntity = CameraMode.get(engine.CameraEntity)

	if (cameraEntity.mode == CameraType.CT_THIRD_PERSON) {
		console.log('The player is using the 3rd person camera')
	} else {
		console.log('The player is using the 1st person camera')
	}
}

engine.addSystem(checkCameraMode)
```

{% hint style="warning" %}
**📔 Nota**: La información de la cámara solo está disponible para el jugador actual ejecutando la escena. No puedes consultar los datos de cámara de ningún otro jugador.
{% endhint %}

El modo de cámara usa un valor del enum `CameraType`. Los siguientes valores son posibles:

* `CameraType.CT_FIRST_PERSON`
* `CameraType.CT_THIRD_PERSON`

El componente `CameraMode` del `engine.CameraEntity` es de solo lectura, no puedes forzar al jugador a cambiar el modo de cámara a través de esto.

{% hint style="info" %}
**💡 Consejo**: Para cambiar el modo de cámara del jugador, usa un [área modificadora de cámara](avatar-modifiers.md#camera-modifiers).
{% endhint %}

Conocer el modo de cámara puede ser muy útil para ajustar las mecánicas de tu escena para ajustarse mejor a lo que es más cómodo usando este modo. Por ejemplo, objetivos pequeños son más difíciles de hacer clic cuando se está en tercera persona.

{% hint style="warning" %}
**📔 Nota**: Evita referirte a `engine.CameraEntity` en la carga inicial de la escena, porque eso puede resultar en errores si las entidades aún no están inicializadas. Para evitar este problema, úsalas dentro de la función `main()`, o en una función llamada indirectamente por `main()`. También puedes encapsular el comportamiento en un bloque async [`executeTask`](../programming-patterns/async-functions.md#the-executetask-function).

Otra opción es referirte a esta entidad dentro de un sistema. Siempre estará disponible, porque la primera ejecución del sistema se llama una vez que la escena ya está correctamente inicializada.
{% endhint %}

## Verificar si el jugador tiene el cursor bloqueado

Los jugadores pueden cambiar entre dos modos de cursor: modo de _cursor bloqueado_ para controlar la cámara o modo de _cursor desbloqueado_ para mover el cursor libremente sobre la UI.

Los jugadores desbloquean el cursor haciendo clic en el _botón derecho del mouse_ o presionando la tecla _Esc_, y bloquean el cursor nuevamente haciendo clic en cualquier lugar de la pantalla.

Verifica el componente `PointerLock` de la [entidad de cámara](../architecture/entities-components.md#reserved-entities) de la escena para saber cuál es el modo de cursor actual.

```ts
export function main() {
	const isLocked = PointerLock.get(engine.CameraEntity).isPointerLocked
	console.log(isLocked)
}
```

Consulta [Event listeners](event-listeners.md#player-locks-or-unlocks-cursor) para ver cómo reaccionar fácilmente a cambios en el estado del cursor.

También puedes forzar el estado del cursor del jugador escribiendo en el campo `isPointerLocked` del componente `PointerLock` en `engine.CameraEntity`. Consulta [Bloquear o desbloquear el cursor](button-events/click-events.md#lock-or-unlock-the-cursor) para ver ejemplos.

{% hint style="warning" %}
**📔 Nota**: Evita referirte a `engine.CameraEntity` en la carga inicial de la escena, porque eso puede resultar en errores si las entidades aún no están inicializadas. Para evitar este problema, úsalas dentro de la función `main()`, o en una función llamada indirectamente por `main()`. También puedes encapsular el comportamiento en un bloque async [`executeTask`](../programming-patterns/async-functions.md#the-executetask-function).

Otra opción es referirte a la entidad dentro de un sistema. Siempre estará disponible, porque la primera ejecución del sistema se llama una vez que la escena ya está correctamente inicializada.
{% endhint %}

## Verificar la posición del cursor del jugador

Usa el componente `primaryPointerInfo` en `engine.RootEntity` para obtener la posición del cursor del jugador. Esto se puede usar para mecánicas como interacciones de arrastrar y soltar, gestos de deslizamiento, etc.

```ts
import { PrimaryPointerInfo } from '@dcl/sdk/ecs'

function CursorSystem() {
	const pointerInfo = PrimaryPointerInfo.get(engine.RootEntity)
	console.log(pointerInfo)
}

engine.addSystem(CursorSystem)
```

{% hint style="warning" %}
**📔 Nota**: Evita referirte a `engine.RootEntity` en la carga inicial de la escena, porque eso puede resultar en errores si las entidades aún no están inicializadas. Para evitar este problema, siempre refiere a la entidad dentro de un sistema. Siempre estará disponible, porque la primera ejecución del sistema se llama una vez que la escena ya está correctamente inicializada.
{% endhint %}

El componente `primaryPointerInfo` devuelve un objeto con las siguientes propiedades:

* `screenCoordinates`: _(Vector2)_ La posición del cursor en la escena, expresada en píxeles. El origen es la esquina superior izquierda de la pantalla.
* `screenDelta`: _(Vector2)_ El cambio delta en la posición del cursor desde el último frame, expresado en píxeles.
* `worldRayDirection`: _(Vector3)_ Un vector que representa la dirección del rayo desde la cámara al cursor. El origen es la posición de la cámara. Usa esto para calcular la posición del cursor en el mundo.
* `pointerType`: 0 para `none`, 1 para `mouse`

{% hint style="info" %}
**💡 Consejo**: Para reaccionar a eventos simples de hover en elementos de UI, puede resultarte más fácil usar los eventos `onMouseEnter` y `onMouseLeave`, consulta [Eventos de botones de UI](../2d-ui/ui_button_events.md#hover-feedback).
{% endhint %}

El componente `primaryPointerInfo` es de solo lectura, no puedes forzar al jugador a cambiar la posición del cursor.

El siguiente ejemplo muestra cómo mostrar la posición del cursor en un elemento de UI.

_**archivo ui.tsx:**_

```tsx
import { UiEntity, ReactEcs } from '@dcl/sdk/react-ecs'
import { Color4 } from '@dcl/sdk/math'
import {cursorXpos, cursorYpos} from './index'

export const uiMenu = () => (
  <UiEntity
    uiTransform={{
			width: '100%',
			height: '100px',
			justifyContent: 'center',
			alignItems: 'center',
    }}
    uiText={{ value: `Cursor pos: `+  cursorXpos + `,` + cursorYpos, fontSize: 40 }}
    uiBackground={{ color: Color4.create(0.5, 0.8, 0.1, 0.6) }}
  />
)
```

_**archivo index.ts:**_

```ts
import { engine } from '@dcl/sdk/ecs'
import { ReactEcsRenderer } from '@dcl/sdk/react-ecs'
import { uiMenu } from './ui'

export function main() {
  ReactEcsRenderer.setUiRenderer(uiMenu)
}

export let cursorXpos: number | undefined = undefined
export let cursorYpos: number | undefined = undefined

function CursorSystem() {
  const pointerInfo = PrimaryPointerInfo.get(engine.RootEntity)
  console.log(pointerInfo)

  cursorXpos = pointerInfo.screenCoordinates?.x
  cursorYpos = pointerInfo.screenCoordinates?.y
}

engine.addSystem(CursorSystem)
```

Puedes usar `worldRayDirection` para establecer el campo `direction` de un raycast para saber si una entidad está en la línea de visión del cursor. Consulta [Raycasting](raycasting.md) para más detalles.
