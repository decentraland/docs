---
description: >-
  Eventos que la escena puede rastrear, relacionados con acciones del jugador y
  cambios en la escena
metaLinks:
  alternates:
    - >-
      https://app.gitbook.com/s/oPnXBby9S6MrsW83Y9qZ/scenes-sdk7/interactivity/event-listeners
---

# Event listeners

Hay varios eventos a los que la escena puede suscribirse, para conocer las acciones del jugador mientras está en o cerca de la escena.

Para eventos de botones y clics realizados por el jugador, consulta [Eventos de botones](click-events.md).

## El jugador entra o sale de la escena

Cada vez que un avatar entra o sale de las parcelas de tierra que conforman tu escena, o se teletransporta dentro o fuera, esto crea un evento al que puedes escuchar.

Este evento es activado por todos los avatares, incluido el del jugador.

```ts
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

En el evento `onEnterScene`, la función puede acceder a todos los datos devueltos por [obtener datos del jugador](user-data.md#get-player-data) a través de la propiedad `player`. En el evento `onLeaveScene`, la función solo tiene acceso al ID del jugador.

### Solo jugador actual

Puedes filtrar los eventos activados para reaccionar solo al avatar del jugador, en lugar de otros avatares que puedan estar cerca.

```ts
import { getPlayer, onEnterScene, onLeaveScene } from '@dcl/sdk/src/players'

export function main() {
	let myPlayer = getPlayer()

	onEnterScene((player) => {
		if (!player) return
		console.log('ENTERED SCENE', player)

		if (myPlayer && player.userId == myPlayer.userId) {
			console.log('I CAME IN')
		}
	})

	onLeaveScene((userId) => {
		if (!userId) return
		console.log('LEFT SCENE', userId)

		if (myPlayer && userId == myPlayer.userId) {
			console.log('I LEFT')
		}
	})
}
```

Este ejemplo primero obtiene el ID del jugador, luego se suscribe a los eventos y compara el `userId` devuelto por el evento con el del jugador.

### Consultar todos los jugadores en la escena

Revisa la lista completa de jugadores que actualmente están en tu escena iterando sobre todas las entidades con un componente `PlayerIdentityData`.

```ts
import { PlayerIdentityData, Transform } from '@dcl/sdk/ecs'

export function main() {
	for (const [entity, data, transform] of engine.getEntitiesWith(
		PlayerIdentityData,
		Transform
	)) {
		console.log('PLAYER: ', { entity, data, transform })
	}
}
```

## El jugador cambia el modo de cámara

Conocer el modo de cámara puede ser muy útil para ajustar las mecánicas de tu escena para adaptarse mejor a lo que es más cómodo usando este modo. Por ejemplo, objetivos pequeños son más difíciles de hacer clic en tercera persona.

El siguiente fragmento usa la función `onChange` para disparar un evento cada vez que la cámara cambia. También dispara un evento cuando se carga la escena, con el modo de cámara inicial del jugador.

```ts
export function main() {
	CameraMode.onChange(engine.CameraEntity, (cameraComponent) => {
		if (!cameraComponent) return
		console.log('Camera mode changed', cameraComponent?.mode)
		// 0 = primera persona
		// 1 = tercera persona
	})
}
```

Consulta [Verificar el modo de cámara del jugador](user-data.md#check-the-players-camera-mode).

## El jugador reproduce una animación

Usa la función `onChange` en el componente `AvatarEmoteCommand` para disparar un evento cada vez que el jugador reproduce un emote. Esto incluye tanto emotes base (baile, aplaudir, saludar, etc.) como emotes de tokens.

```ts
import { AvatarEmoteCommand } from '@dcl/sdk/ecs'

export function main() {
	AvatarEmoteCommand.onChange(engine.PlayerEntity, (emote) => {
		if (!emote) return
		console.log('Emote played: ', emote.emoteUrn)
	})
}
```

El evento incluye la siguiente información:

* `emoteUrn`: Nombre del emote realizado (ej: _wave_, _clap_, _kiss_)
* `loop`: Si el emote se está repitiendo o reproduciendo una vez
* `timestamp`: Cuándo se activó el emote.

También puedes detectar emotes de otros jugadores en la escena, simplemente pasa una referencia al otro jugador en lugar de `engine.PlayerEntity`.

## El jugador cambia de perfil

Usa la función `onChange` en el componente `AvatarEquippedData` para disparar un evento cada vez que el jugador cambie uno de sus wearables, o sus emotes listados en la rueda de acceso rápido. Del mismo modo, usa la función `onChange` en `AvatarBase` para disparar un evento cada vez que el jugador cambie sus propiedades de avatar base, como color de cabello, color de piel, forma de avatar, o nombre.

```ts
import { AvatarEquippedData, AvatarBase } from '@dcl/sdk/ecs'

export function main() {
	AvatarEquippedData.onChange(engine.PlayerEntity, (equipped) => {
		if (!equipped) return
		console.log('New wearables list: ', equipped.wearableUrns)
		console.log('New emotes list : ', equipped.emoteUrns)
	})

	AvatarBase.onChange(engine.PlayerEntity, (body) => {
		if (!body) return
		console.log('New eyes color: ', body.eyesColor)
		console.log('New skin color: ', body.skinColor)
		console.log('New hair color: ', body.hairColor)
		console.log('New body URN: ', body.bodyShapeUrn)
	})
}
```

El evento en `AvatarEquippedData` incluye la siguiente información:

* `wearableUrns`: La lista de wearables que el jugador tiene actualmente equipados.
* `emoteUrns`: La lista de emotes que el jugador tiene actualmente equipados en la rueda de acceso rápido.

El evento en `AvatarBase` incluye la siguiente información:

* `name`: El nombre del jugador.
* `bodyShapeUrn`: Los IDs correspondientes al tipo de cuerpo masculino o femenino.
* `skinColor`: Color de piel del jugador como un `Color4`
* `eyeColor`: Color de ojos del jugador como un `Color4`
* `hairColor`: Color de cabello del jugador como un `Color4`

También puedes detectar cambios en wearables o avatares de otros jugadores en la escena, simplemente pasa una referencia al otro jugador en lugar de `engine.PlayerEntity`.

{% hint style="info" %}
**💡 Consejo**: Al probar en vista previa con el editor web heredado, para evitar usar un avatar aleatorio, ejecuta la escena en el navegador conectado con tu billetera Metamask.
{% endhint %}

También puedes detectar cambios en los perfiles de otros jugadores en la escena, simplemente pasa una referencia al otro jugador en lugar de `engine.PlayerEntity`.

## El jugador bloquea o desbloquea el cursor

Los jugadores pueden cambiar entre dos modos de cursor: modo de _cursor bloqueado_ para controlar la cámara o modo de _cursor desbloqueado_ para mover el cursor libremente sobre la UI.

Los jugadores desbloquean el cursor haciendo clic en el _botón derecho del mouse_ o presionando la tecla _Esc_, y bloquean el cursor nuevamente haciendo clic en cualquier lugar de la pantalla.

Usa la función `onChange` en el componente `PointerLock` para disparar un evento cada vez que el jugador cambie entre los dos modos de cursor.

```ts
export function main() {
	PointerLock.onChange(engine.CameraEntity, (pointerLock) => {
		if (!pointerLock) return
		console.log('Pointer lock changed', pointerLock.isPointerLocked)
	})
}
```

Verificar este componente es útil si el jugador necesita cambiar modos de cursor y puede necesitar una sugerencia sobre cómo bloquear/desbloquear el cursor. Esto también se puede usar en escenas donde se espera que el jugador reaccione rápido, pero la acción puede tomar un descanso mientras el jugador tiene el cursor desbloqueado.
