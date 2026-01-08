---
description: Muestra y controla avatares NPC
metaLinks:
  alternates:
    - >-
      https://app.gitbook.com/s/oPnXBby9S6MrsW83Y9qZ/scenes-sdk7/interactivity/npc-avatars
---

# Avatares NPC

Muestra un avatar como una entidad en una escena.

## Crear un avatar

El siguiente fragmento crea un avatar con wearables y forma de cuerpo aleatorios, y nombre "NPC".

```ts
const myAvatar = engine.addEntity()
AvatarShape.create(myAvatar)

Transform.create(myAvatar, {
	position: Vector3.create(4, 0.25, 5),
})
```

Al pasar datos para generar un `AvatarShape`, se requiere el siguiente campo:

* `id`: (requerido) Identificador interno para el Avatar

Los siguientes campos opcionales también están disponibles:

* `name`: Nombre a mostrar sobre la cabeza del Avatar. Por defecto: "NPC".
* `bodyShape`: Cadena para definir qué forma de cuerpo usar.
* `wearables`: Array con lista de URNs para wearables que el avatar tiene actualmente puestos. Si los wearables entran en conflicto (como dos de ellos son sombreros), el último en la lista reemplaza al otro.
* `emotes`: Array con lista de URNs para emotes NFT que el avatar es capaz de reproducir
* `eyeColor`: _Color3_ para el color de ojos (cualquier color es válido)
* `skinColor`: _Color3_ para el color de piel (cualquier color es válido)
* `hairColor`: _Color3_ para el color de cabello (cualquier color es válido)
* `talking`: Si es _true_, muestra un conjunto verde de barras junto al nombre, como cuando los jugadores usan el chat de voz en el mundo.
* <div data-gb-custom-block data-tag="hint" data-style="info" class="hint hint-info"><p><strong>💡 Consejo</strong>: Consulta <a href="../3d-essentials/color-types.md">tipos de color</a> para más detalles sobre cómo establecer colores.</p></div>

{% hint style="warning" %}
**📔 Nota**: El componente `AvatarShape` debe importarse mediante

> `import { AvatarShape } from "@dcl/sdk/ecs"`

Consulta [Importaciones](../getting-started/coding-scenes.md#imports) para saber cómo manejarlas fácilmente.
{% endhint %}

{% hint style="warning" %}
**📔 Nota**: Los campos URN deben seguir el mismo formato usado para [NFTShapes](../media/display-a-certified-nft.md): `urn:decentraland:<CHAIN>:<CONTRACT_STANDARD>:<CONTRACT_ADDRESS>:<TOKEN_ID>`
{% endhint %}

## Animaciones

Los avatares reproducen animaciones inactivas predeterminadas mientras están quietos.

Para reproducir animaciones en el avatar, establece la cadena `expressionTriggerId` al nombre de la animación que deseas reproducir.

```ts
const myAvatar = engine.addEntity()
AvatarShape.create(myAvatar, {
	id: '',
	emotes: [],
	wearables: [],
	expressionTriggerId: 'robot',
})

Transform.create(myAvatar, {
	position: Vector3.create(4, 0.25, 5),
})
```

El campo `expressionTriggerId` admite todas las [animaciones predeterminadas](trigger-emotes.md#default-animations), así como animaciones personalizadas [desde un archivo de escena](trigger-emotes.md#custom-animations), e incluso URNs de emotes que están publicados en el marketplace.

### Repetir animaciones

Las animaciones en un `AvatarShape` se reproducen una vez, si deseas que el avatar siga repitiendo una animación, debes crear un sistema que le indique reproducir la animación nuevamente cada par de segundos.

Usa `expressionTriggerTimestamp` para reproducir el mismo emote. El valor de este campo es un [lamport timestamp](https://en.wikipedia.org/wiki/Lamport_timestamp), lo que significa que no es un valor de tiempo, sino más bien un índice que se aumenta en 1 por cada repetición del emote.

Entonces, la primera vez que reproduces un emote, estableces `expressionTriggerTimestamp` en _0_. Para reproducir el emote nuevamente, debes actualizar este valor a 1. Así es como el motor sabe que esta es una nueva instrucción, y no una instrucción sobre la que ya actuó.

El siguiente fragmento crea un sistema que ejecuta el mismo emote cada 2 segundos:

```ts
const myAvatar = engine.addEntity()
AvatarShape.create(myAvatar, {
	id: '',
	emotes: [],
	wearables: [],
	expressionTriggerId: 'clap',
    expressionTriggerTimestamp: 0
})

Transform.create(myAvatar, {
	position: Vector3.create(4, 0.25, 5),
})

let clapTimer = 0
let emoteDuration = 2  // 2 segundos

// sistema
engine.addSystem((dt: number) => {
    clapTimer += dt
      
    if (clapTimer >= emoteDuration) {
        // Activar el emote clap
        AvatarShape.getMutable(wearable).expressionTriggerTimestamp =+ 1 
        
        clapTimer = 0 // Reiniciar temporizador
    }
})
```

{% hint style="info" %}
**💡 Consejo**: Debes conocer la duración del emote, y hacer que esa sea la duración del sistema. Si creas un emote que fija al avatar quieto en la misma pose, es recomendable hacer que la duración del emote sea más larga que el sistema. De esa manera, puedes asegurarte de que no haya artefactos al finalizar y reiniciar la animación.
{% endhint %}

## Copiar wearables del jugador

El siguiente fragmento cambia los wearables y otras características de un avatar NPC para que coincidan con los que el jugador tiene actualmente puestos. Esto podría usarse en una escena como un maniquí, para mostrar un wearable o emote particular combinado con el atuendo actual del jugador.

```ts
import { getPlayer } from '@dcl/sdk/src/players'


export function swapAvatar(avatar: Entity) {

  let userData = getPlayer()
  console.log(userData)

  if (!userData || !userData.wearables) return

  const mutableAvatar = AvatarShape.getMutable(avatar)

  mutableAvatar.wearables = userData.wearables
  mutableAvatar.bodyShape = userData.avatar?.bodyShapeUrn
  mutableAvatar.eyeColor = userData.avatar?.eyesColor
  mutableAvatar.skinColor = userData.avatar?.skinColor
  mutableAvatar.hairColor = userData.avatar?.hairColor
  
}
```

## Mostrar solo wearables

Usa el campo `show_only_wearables` para mostrar solo los wearables listados de un avatar. El resto del cuerpo del avatar será invisible.

```ts
const myAvatar = engine.addEntity()
AvatarShape.create(myAvatar, {
	id: '',
	emotes: [],
	wearables: [
    'urn:decentraland:matic:collections-v2:0x90e5cb2d673699be8f28d339c818a0b60144c494:0'
  ],
	show_only_wearables: true,
})

Transform.create(myAvatar, {
	position: Vector3.create(4, 0.25, 5),
})
```

Esto es útil para mostrar wearables, por ejemplo en una tienda.

{% hint style="info" %}
**💡 Consejo**: Si un wearable es bastante pequeño, intenta establecer el `scale` del `Transform` a un valor más grande.
{% endhint %}

## Adjuntar una entidad a un NPC

Puedes usar la característica `AvatarAttach` para fijar una entidad a uno de los huesos de un avatar NPC, por ejemplo para que el NPC esté sosteniendo un objeto en su mano. La entidad se moverá junto con el avatar cuando anime.

Para usar esta característica, usa la propiedad `id` en `AvatarShape` para asignar un id arbitrario a este avatar, y luego referencia ese id en `AvatarAttach`. El id puede ser cualquier cadena que desees.

```ts
// Crear NPC, con un ID
const myAvatar = engine.addEntity()
Transform.create(myAvatar, {
  position: Vector3.create(8, 0.25, 8),
})
AvatarShape.create(myAvatar, {
  id: "my-avatar-id", 
  wearables: [],
  emotes: []
})

// Crear objeto para adjuntar al NPC
const attachedEntity = engine.addEntity()
Transform.create(attachedEntity, {
    position: Vector3.create(4, 2, 4),
    scale: Vector3.create(0.15,0.15,0.15)
})
MeshRenderer.setBox(attachedEntity)
Material.setBasicMaterial(attachedEntity, { diffuseColor: Color4.Blue() })
AvatarAttach.create(attachedEntity, {
    avatarId: "my-avatar-id",
    anchorPointId: AvatarAnchorPointType.AAPT_LEFT_HAND
})
```

Aprende más sobre el componente `AvatarAttach` [aquí](../3d-essentials/entity-positioning.md#attach-an-entity-to-an-avatar).
