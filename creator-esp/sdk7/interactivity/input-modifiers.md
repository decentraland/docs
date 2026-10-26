---
description: Cambia qué acciones pueden realizar los jugadores
metaLinks:
  alternates:
    - >-
      https://app.gitbook.com/s/oPnXBby9S6MrsW83Y9qZ/scenes-sdk7/interactivity/input-modifiers
---

# Modificadores de entrada

Puedes restringir qué acciones puede hacer el jugador en tu escena. Úsalo para congelar al jugador, o para restringir solo formas específicas de locomoción, por ejemplo para evitar que el jugador salte o corra.

{% hint style="warning" %}
**📔 Nota**: Los Modificadores de Entrada son una característica que solo es compatible con el cliente de escritorio DCL 2.0.
{% endhint %}

## Congelar al jugador

Puedes congelar al jugador para que ninguna de las teclas de entrada pueda mover el avatar. Esto puede ser útil para muchas mecánicas de juego. También es una buena práctica congelar a un jugador mientras se realiza una animación importante que no debería ser interrumpida por movimiento, o mientras una [Cámara Virtual](../3d-essentials/camera.md) apunta lejos del avatar y no quieres que el jugador se mueva a ciegas.

Usa el componente `InputModifier` en `engine.PlayerEntity` para evitar que las entradas del jugador afecten la locomoción del avatar. El avatar permanecerá quieto, el jugador solo podrá rotar la cámara.

```ts
import {InputModifier, engine} from '@dcl/sdk/ecs'

InputModifier.create(engine.PlayerEntity, {
	mode: InputModifier.Mode.Standard({
		disableAll: true,
	}),
})
```

Ten en cuenta las siguientes consideraciones:

* Mientras las interacciones del jugador están deshabilitadas, su avatar sigue siendo afectado por fuerzas externas, como la gravedad o plataformas en movimiento.
* El componente `InputModifier` solo puede usarse con la entidad `engine.PlayerEntity`. Solo puede afectar al jugador actual, no puede afectar a otros jugadores.
* Este componente solo afecta al jugador mientras el avatar está dentro de los límites de tu escena. Su locomoción deja de estar restringida tan pronto como salgan.
* Mientras las interacciones del jugador están deshabilitadas, el jugador no puede realizar emotes libremente, pero la escena puede activar animaciones en el avatar.
* Las entradas del jugador no afectan al avatar, pero los [eventos de entrada globales](button-events/system-based-events.md#global-input-events) aún pueden ser escuchados por la escena. Podrías usarlos para controlar un vehículo, o usar una [Cámara Virtual](../3d-essentials/camera.md) para seguir otra entidad mientras se mueve, tratándola como un avatar alternativo.

## Restringir la locomoción

En lugar de congelar completamente al jugador, puedes restringir ciertas formas específicas de locomoción del jugador. El `InputModifier` incluye las siguientes opciones:

* `disableWalk`: El jugador no puede caminar lentamente (presionando control). Si el jugador intenta caminar, trotará o correrá si está permitido.
* `disableRun`: El jugador no puede correr (presionando shift). Si el jugador intenta correr, trotará o caminará si está permitido.
* `disableJog`: El jugador no puede trotar (esta es la velocidad de movimiento predeterminada). Si el jugador intenta trotar, correrá o caminará si está permitido.
* `disableJump`: El jugador no puede saltar.
* `disableEmote`: El jugador no puede realizar emotes voluntariamente. La escena puede activar animaciones en el avatar del jugador.
* `disableAll`: El jugador no puede realizar ninguna de las acciones anteriores.

```ts
import {InputModifier, engine} from '@dcl/sdk/ecs'

InputModifier.create(engine.playerEntity, {
	mode: InputModifier.Mode.Standard({
		disableAll: false,
		disableWalk: false,
		disableRun: true,
		disableJog: true,
		disableJump: true,
		disableEmote: true,
	}),
})
```

## Sintaxis avanzada

Para usar el componente sin ningún helper, puedes usar la siguiente sintaxis:

```ts
import {InputModifier, engine} from '@dcl/sdk/ecs'

InputModifier.createOrReplace(engine.PlayerEntity, {
	mode: {
		$case: 'standard',
		standard: {
			disableAll: false,
			disableWalk: false,
			disableRun: true,
			disableJog: true,
			disableJump: true,
			disableEmote: true,
		},
	},
})
```
