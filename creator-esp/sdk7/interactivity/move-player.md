---
description: Cambia la posición de un jugador dentro de la escena
metaLinks:
  alternates:
    - >-
      https://app.gitbook.com/s/oPnXBby9S6MrsW83Y9qZ/scenes-sdk7/interactivity/move-player
---

# Mover un jugador

## Usar el Scene Editor

La forma más fácil de mover al jugador es usar el [Scene Editor](../../scene-editor/about-editor.md). Usa las acciones sin código **Move player** o **Move player here**, consulta [Hacer cualquier item inteligente](../../scene-editor/make-any-item-smart.md).

## Mover jugador

Para cambiar la posición del jugador en la escena, usa la función `movePlayerTo()`. Esta función toma un objeto con tres propiedades:

* `newRelativePosition`: Dónde posicionar al jugador, expresado como un Vector3.
* `cameraTarget`: (opcional) Qué dirección hacer que la cámara mire, expresado como un Vector3 que representa las coordenadas de un punto en el espacio al que mirar. Si no se proporciona ningún valor, la cámara mantendrá la misma rotación que antes de moverse.
* `avatarTarget`: (opcional) Qué dirección hacer que el avatar mire, expresado como un Vector3 que representa las coordenadas de un punto en el espacio al que mirar. Si no se proporciona ningún valor, el avatar mantendrá la misma rotación que antes de moverse. Si el jugador está en modo de cámara en primera persona, la rotación de la cámara y el avatar es la misma.

```ts
import { movePlayerTo } from '~system/RestrictedActions'

// crear entidad
const myEntity = engine.addEntity()
MeshRenderer.setBox(myEntity)
MeshCollider.setBox(myEntity)

Transform.create(myEntity, {
	position: { x: 4, y: 1, z: 4 },
})

// dar comportamiento a la entidad
pointerEventsSystem.onPointerDown(
	{
		entity: myEntity,
		opts: { button: InputAction.IA_POINTER, hoverText: 'Click' },
	},
	function () {
		// reaparecer jugador
		movePlayerTo({
			newRelativePosition: Vector3.create(1, 0, 1),
			cameraTarget: Vector3.create(8, 1, 8),
			avatarTarget: Vector3.create(8, 1, 8),
		})
	}
)
```

El movimiento del jugador ocurre instantáneamente, sin pantallas de confirmación ni transiciones de cámara.

{% hint style="warning" %}
**📔 Nota**: Los jugadores solo pueden ser movidos si ya están parados dentro de los límites de la escena, y solo pueden ser movidos a ubicaciones que estén dentro de los límites de la escena. No puedes usar `movePlayerTo()` para transportar a un jugador a otra escena. Para mover a un jugador a otra escena, consulta [Teletransportes](external-links.md#teleports).
{% endhint %}

## Permisos requeridos en wearables inteligentes y experiencias portátiles

{% hint style="warning" %}
**📔 Nota**: Los permisos solo son relevantes en [experiencias portátiles](../projects/portable-experiences.md) y [wearables inteligentes](../projects/smart-wearables.md). Las escenas normales (tanto en parcelas como en Worlds) son libres de mover al jugador y no se ven afectadas por permisos.
{% endhint %}

Los wearables inteligentes y las experiencias portátiles solo pueden usar esta funcionalidad si agregan un permiso correspondiente en el archivo `scene.json`. Esto se aplica tanto a animaciones predefinidas como personalizadas. Esto se otorga mediante el permiso `ALLOW_TO_MOVE_PLAYER_INSIDE_SCENE`. Si aún no está presente, crea una propiedad `requiredPermissions` en el nivel raíz del archivo JSON para asignarle este permiso.

```json
"requiredPermissions": [
    "ALLOW_TO_MOVE_PLAYER_INSIDE_SCENE"
  ],
```

Consulta [Permisos requeridos](../projects/scene-metadata.md#required-permissions) para más detalles.
