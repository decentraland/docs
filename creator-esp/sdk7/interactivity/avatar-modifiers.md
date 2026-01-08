---
description: >-
  Especifica un área en tu escena donde los avatares de jugadores o la cámara se
  comportan de manera diferente
metaLinks:
  alternates:
    - >-
      https://app.gitbook.com/s/oPnXBby9S6MrsW83Y9qZ/scenes-sdk7/interactivity/avatar-modifiers
---

# Áreas modificadoras

## Modificadores de avatar

Los avatares se comportan y se ven de manera consistente en todo Decentraland mientras caminan a través de escenas. Sin embargo, puedes agregar un `AvatarModifierArea` a una región de tu escena para afectar cómo se comportan los avatares de jugadores cuando entran en esa área.

{% hint style="danger" %}
**❗Advertencia**\
Por favor limita la cantidad de `AvatarModifierAreas` que usas en tu escena a solo un par. Si usas demasiadas, puede tener un impacto significativo en el rendimiento.
{% endhint %}

### Colocar áreas modificadoras de avatar

Agrega una entidad con un componente `AvatarModifierArea` y posiciona esta entidad usando un componente `Transform`.

```ts
const entity = engine.addEntity()

AvatarModifierArea.create(entity, {
	area: Vector3.create(4, 3, 4),
	modifiers: [AvatarModifierType.AMT_HIDE_AVATARS],
	excludeIds: []
})

Transform.create(entity, {
	position: Vector3.create(8, 0, 8),
})
```

Al crear un componente `AvatarModifierArea`, debes proporcionar lo siguiente:

* `area`: Tamaño del área modificadora
* `modifiers`: Un array listando los modificadores a implementar en el área. Esta propiedad usa valores del enum `AvatarModifierType`.

Los modificadores compatibles son:

* `AvatarModifierType.AMT_HIDE_AVATARS`
* `AvatarModifierType.AMT_DISABLE_PASSPORTS`

Todos los efectos de un `AvatarModifierArea` solo tienen lugar dentro de la región de su área. Los jugadores vuelven a la normalidad cuando salen del área.

Un `AvatarModifierArea` afecta solo a jugadores que están dentro del área, entrar en el área no afecta cómo se perciben otros jugadores que están fuera del área.

Los efectos de un `AvatarModifierArea` se calculan localmente para cada jugador. Puedes tener un `AvatarModifierArea` que solo esté presente en la escena para algunos de los jugadores y no para otros. Por ejemplo, podrías hacer un juego de "marco polo", donde solo un jugador en la escena tiene un área modificadora que oculta a todos los demás jugadores. Todos los otros jugadores que no tienen esta área modificadora en su versión local de la escena pueden verse normalmente entre sí. Si el área oculta avatares, entonces los jugadores que no tienen el área en su versión local de la escena verán todos los avatares normalmente. Incluso aquellos que se experimentan a sí mismos como ocultos. Los jugadores que tienen el área experimentarán a sí mismos y a todos los demás avatares como afectados por el área cuando entren en ella.

{% hint style="warning" %}
**📔 Nota**: Las áreas modificadoras de avatar son afectadas por la _posición_ y _rotación_ del componente Transform de su entidad anfitriona, pero no son afectadas por el _scale_.
{% endhint %}

{% hint style="warning" %}
**📔 Nota**: El componente `AvatarModifierArea` debe importarse mediante

> `import { AvatarModifierArea } from "@dcl/sdk/ecs"`

Consulta [Importaciones](../getting-started/coding-scenes.md#imports) para saber cómo manejarlas fácilmente.
{% endhint %}

### Ocultar avatares

Cuando un jugador camina hacia un `AvatarModifierArea` que tiene el modificador `AvatarModifierType.AMT_HIDE_AVATARS`, el avatar del jugador deja de renderizarse. Esto se aplica tanto para el jugador en vista de tercera persona, como para cuando otros jugadores caminan hacia el área.

```ts
const entity = engine.addEntity()

AvatarModifierArea.create(entity, {
	area: Vector3.create(4, 3, 4),
	modifiers: [AvatarModifierType.AMT_HIDE_AVATARS],
	excludeIds: []
})

Transform.create(entity, {
	position: Vector3.create(8, 0, 8),
})
```

Esto te permite reemplazar el avatar predeterminado de Decentraland con cualquier avatar personalizado que desees mostrar en tu escena. Ten en cuenta que si deseas ver a otros jugadores con avatares personalizados, debes manejar la sincronización de las posiciones de los jugadores tú mismo.

### Deshabilitar Popup de Passport

Cuando un jugador camina hacia un `AvatarModifierArea` que tiene el modificador `AvatarModifierType.AMT_DISABLE_PASSPORTS`, hacer clic en ellos ya no abre la UI de pasaporte que muestra la biografía del jugador, inventario, etc.

```ts
const entity = engine.addEntity()

AvatarModifierArea.create(entity, {
	area: Vector3.create(4, 3, 4),
	modifiers: [AvatarModifierType.AMT_DISABLE_PASSPORTS],
	excludeIds: []
})

Transform.create(entity, {
	position: Vector3.create(8, 0, 8),
})
```

Esto es especialmente útil en juegos donde accidentalmente abrir esta UI podría interrumpir el flujo del juego, por ejemplo en un juego de disparos multijugador.

## Modificadores de cámara

Normalmente los jugadores son libres de cambiar entre cámara en primera y tercera persona presionando V en el teclado. Usa un `CameraModeArea` para forzar el modo de cámara a 1ra o 3ra persona para todos los jugadores que están dentro de un área específica en tu escena.

```ts
const entity = engine.addEntity()

CameraModeArea.create(entity, {
	area: Vector3.create(4, 3, 4),
	mode: CameraType.CT_FIRST_PERSON,
})
```

Si el modo de cámara actual de un jugador no coincide con el del `CameraModeArea`, hará una transición a ese modo de cámara. Aparece un mensaje en pantalla para aclarar que este cambio se debe a la escena. Mientras están dentro, los jugadores no pueden cambiar su modo de cámara. Cuando un jugador sale del `CameraModeArea`, su modo de cámara se restaura al que tenía antes de entrar.

Usa `CameraModeArea` en regiones donde los jugadores tendrían una experiencia significativamente mejor usando un modo de cámara específico. Por ejemplo, la primera persona es ideal si el jugador necesita hacer clic en objetos pequeños, o la tercera persona puede ser útil para que los jugadores noten alguna entidad que tu escena ha adjuntado sobre su cabeza. No asumas que los jugadores saben cómo cambiar modos de cámara, muchos jugadores nuevos pueden no saber que tienen la opción, o no recordar la tecla para hacerlo.

{% hint style="warning" %}
**📔 Nota**: Las áreas modificadoras de cámara son afectadas por la _posición_ y _rotación_ del componente Transform de su entidad anfitriona, pero no son afectadas por el _scale_.
{% endhint %}

{% hint style="warning" %}
**📔 Nota**: Si superpones múltiples áreas modificadoras de cámara, la última que se instancie en el código de tu escena tendrá prioridad sobre las demás.
{% endhint %}

Al crear un componente `CameraModeArea`, debes proporcionar lo siguiente:

* `area`: Tamaño del área modificadora
* `cameraMode`: Qué modo de cámara forzar en esta área, del enum `CameraType`.

Los modos de cámara compatibles son:

* `CameraType.CT_FIRST_PERSON`
* `CameraType.CT_THIRD_PERSON`

## Excluir avatares

Puedes excluir una lista de jugadores de ser afectados por un área modificadora agregando sus IDs de jugador a un array en la propiedad `excludeIds` del área modificadora.

Este ejemplo oculta todos los avatares en un área, excepto aquellos de jugadores con IDs específicos. Podrías usar esto por ejemplo en un evento en vivo, para mostrar solo los anfitriones del evento en el escenario, y ocultar cualquier otro jugador que salte al escenario.

```ts
const entity = engine.addEntity()

AvatarModifierArea.create(entity, {
	area: Vector3.create(4, 3, 4),
	modifiers: [AvatarModifierType.AMT_HIDE_AVATARS],
	excludeIds: ['0xx1...', '0xx2...'],
})

Transform.create(entity, {
	position: Vector3.create(8, 0, 8),
})
```

{% hint style="warning" %}
**📔 Nota**: Asegúrate de que los IDs de jugador estén todos escritos con letras minúsculas. Usa `.toLowerCase()` si es necesario.
{% endhint %}

Las áreas modificadoras se ejecutan localmente en la instancia de cada jugador, la lista de IDs excluidos puede ser diferente para cada jugador. En el ejemplo a continuación, cada jugador excluye su propio ID de un modificador que oculta avatares, para que cada uno vea su propio avatar y ningún otro.

```ts
import { getPlayer } from '@dcl/sdk/src/players'

export function main() {
	let userData = getPlayer()
	if (!userData) return

	const entity = engine.addEntity()

	AvatarModifierArea.create(entity, {
		area: Vector3.create(16, 5, 16),
		modifiers: [AvatarModifierType.AMT_HIDE_AVATARS],
		excludeIds: [userData.userId],
	})

	Transform.create(entity, {
		position: Vector3.create(8, 0, 8),
	})
}
```

{% hint style="danger" %}
**❗Advertencia**\
Si la lista de IDs excluidos va a ser cambiada periódicamente (por ejemplo basándose en jugadores entrando o saliendo de un área), asegúrate de que la lista se mantenga en orden. Realiza un `.sort()` en el array, para que la lista permanezca en el mismo orden cada vez que se pasa. De esa manera, solo los cambios en la lista serán computados. Esto de lo contrario puede tener un impacto significativo en el rendimiento de la escena.

```ts
AvatarModifierArea.create(entity, {
	area: Vector3.create(16, 5, 16),
	modifiers: [AvatarModifierType.AMT_HIDE_AVATARS],
	excludeIds: [myAvatarList.sort()],
})
```
{% endhint %}

## Depurar áreas modificadoras

Puede ser difícil saber exactamente qué partes de la escena cubren tus áreas modificadoras basándose en el código. La retroalimentación visual ayuda mucho a confirmar que están bien colocadas.

Para verificar las posiciones de un `AvatarModifierArea` o un `CameraModeArea`, dale a la entidad que lo contiene un componente `MeshRenderer` con una forma de `box`, y establece la escala al mismo tamaño que el `area` del área modificadora.

{% hint style="warning" %}
**📔 Nota**: Las áreas modificadoras no son afectadas por la propiedad `scale` del transform, su tamaño se basa en su propiedad `area`.
{% endhint %}

```ts
const entity = engine.addEntity()
const areaSize = Vector3.create(8, 3, 8)

AvatarModifierArea.create(entity, {
	area: areaSize,
	modifiers: [AvatarModifierType.AMT_HIDE_AVATARS],
  	excludeIds: []
})

Transform.create(entity, {
	position: Vector3.create(8, 0, 8),
	scale: areaSize,
})

MeshRenderer.setBox(entity)
Material.setPbrMaterial(entity, {
	albedoColor: Color4.create(0.5, 0.5, 0.5, 0.5),
})
```

Para activar los efectos del área modificadora, la cabeza o torso del jugador debe entrar en el área. No tendrá efecto si solo los pies del jugador están cubiertos. Asegúrate de que el jugador no pueda evadir fácilmente el área saltando.

{% hint style="warning" %}
**📔 Nota**: El área completa debe caber dentro de los límites de tu escena.
{% endhint %}
