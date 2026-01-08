---
description: Haz que el jugador realice un emote
metaLinks:
  alternates:
    - >-
      https://app.gitbook.com/s/oPnXBby9S6MrsW83Y9qZ/scenes-sdk7/interactivity/trigger-emotes
---

# Activar emotes

Puedes hacer que el jugador realice una animación como parte del código de la escena. Esto puede ayudar a proporcionar más inmersión, y también puede ayudar a comunicar lo que otros jugadores están haciendo entre sí. Las animaciones de avatar son vistas tanto por el jugador (en vista de tercera persona) como por cualquier otro jugador alrededor.

Las animaciones realizadas por el jugador son anuladas por las animaciones de locomoción predeterminadas, como caminar y saltar. Por lo tanto, las animaciones reproducidas por la escena solo se reproducen mientras el jugador está quieto. Si el jugador camina o salta, cualquier animación se interrumpe.

{% hint style="warning" %}
**📔 Nota**: Los jugadores solo pueden ser animados si ya están dentro de los límites de la escena, no si están en una escena vecina. Las experiencias portátiles y wearables inteligentes pueden reproducir animaciones en cualquier lugar.
{% endhint %}

## Usar el Scene Editor

La forma más fácil de hacer que un jugador realice una animación es usar el [Scene Editor](../../scene-editor/about-editor.md). Usa la acción sin código **Play Emote** para reproducir una animación predeterminada, o la acción **Play Custom Emote** para reproducir una animación desde un archivo. Consulta [Hacer cualquier item inteligente](../../scene-editor/make-any-item-smart.md).

## Animaciones predeterminadas

Usa la función `triggerEmote()` para ejecutar una de las animaciones predeterminadas que los jugadores pueden reproducir en cualquier lugar de Decentraland. Esta función toma un objeto con una sola propiedad como argumento:

* `predefinedEmote`: Un nombre de cadena para un emote existente.

```ts
import { triggerEmote } from '~system/RestrictedActions'

const emoter = engine.addEntity()
Transform.create(emoter, { position: Vector3.create(8, 0, 8) })
MeshRenderer.setBox(emoter)
MeshCollider.setBox(emoter)
pointerEventsSystem.onPointerDown(
	{
		entity: emoter,
		opts: { button: InputAction.IA_POINTER, hoverText: 'Dance' },
	},
	() => {
		triggerEmote({ predefinedEmote: 'robot' })
	}
)
```

Los siguientes emotes muestran retroalimentación sobre acciones del jugador en tu escena, todos estos son valores válidos para el campo `predefinedEmote`:

* `buttonDown`
* `buttonFront`
* `getHit`
* `knockOut`
* `lever`
* `openChest`
* `openDoor`
* `punch`
* `push`
* `swingWeaponOneHand`
* `swingWeaponTwoHands`
* `throw`
* `sittingChair1`
* `sittingChair2`
* `sittingGround1`
* `sittingGround2`

Estos emotes están disponibles para todos los jugadores en su rueda de emotes predeterminada, y también se pueden usar en cualquier escena.

* `wave`
* `fistpump`
* `robot`
* `raiseHand`
* `clap`
* `money`
* `kiss`
* `tik`
* `hammer`
* `tektonik`
* `dontsee`
* `handsair`
* `shrug`
* `disco`
* `dab`
* `headexplode`

{% hint style="info" %}
**💡 Consejo**: Si un jugador camina o salta mientras reproduce la animación, la interrumpirán. Si no quieres que eso sea posible, puedes congelar el avatar con [Modificadores de entrada](input-modifiers.md) durante la duración de la animación del avatar.
{% endhint %}

## Animaciones personalizadas

Usa `triggerSceneEmote()` para hacer que el jugador realice una animación personalizada, almacenada como un archivo .glb como parte del asset de la escena.

{% hint style="warning" %}
**📔 Nota**: El nombre del archivo **debe** terminar en `_emote.glb` para funcionar como una animación de avatar.
{% endhint %}

Esta función toma un objeto como argumento con los siguientes argumentos:

* `src`: Una cadena con una ruta al archivo de emote.
* `loop`: Si es true, la animación se repetirá continuamente hasta que el jugador se mueva o se detenga la animación. False por defecto.

```ts
import { triggerSceneEmote } from '~system/RestrictedActions'

const emoter = engine.addEntity()
Transform.create(emoter, { position: Vector3.create(8, 0, 8) })
MeshRenderer.setBox(emoter)
MeshCollider.setBox(emoter)
pointerEventsSystem.onPointerDown(
	{
		entity: emoter,
		opts: { button: InputAction.IA_POINTER, hoverText: 'Make snowball' },
	},
	() => {
		triggerSceneEmote({ src: 'animations/Snowball_Throw_emote.glb', loop: false })
	}
)
```

{% hint style="info" %}
**💡 Consejo**: Si un jugador camina o salta mientras reproduce la animación, la interrumpirán. Si no quieres que eso sea posible, puedes congelar el avatar con [Modificadores de entrada](input-modifiers.md) durante la duración de la animación del avatar.
{% endhint %}

## Permisos requeridos en wearables inteligentes y experiencias portátiles

{% hint style="warning" %}
**📔 Nota**: Los permisos solo son relevantes en [experiencias portátiles](../projects/portable-experiences.md) y [wearables inteligentes](../projects/smart-wearables.md). Las escenas normales (tanto en parcelas como en Worlds) son libres de usar animaciones de avatar y no se ven afectadas por permisos.
{% endhint %}

Los wearables inteligentes y las experiencias portátiles solo pueden usar esta funcionalidad si agregan un permiso correspondiente en el archivo `scene.json`. Esto se aplica tanto a animaciones predefinidas como personalizadas. Esto se otorga mediante el permiso `ALLOW_TO_TRIGGER_AVATAR_EMOTE`.

```json
  "requiredPermissions": [
    "ALLOW_TO_TRIGGER_AVATAR_EMOTE"
  ],
```

Consulta [Permisos requeridos](../projects/scene-metadata.md#required-permissions) para más detalles.
