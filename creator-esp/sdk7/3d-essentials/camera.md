---
description: Aprende cómo controlar la cámara del jugador
metaLinks:
  alternates:
    - >-
      https://app.gitbook.com/s/oPnXBby9S6MrsW83Y9qZ/scenes-sdk7/3d-essentials/camera
---

# Cámara

Como creador, puedes tener control total sobre la cámara del jugador. Por defecto, los jugadores son libres de elegir entre un modo de cámara de primera o tercera persona mientras exploran tu escena, pero puedes imponer una modalidad de cámara diferente.

Las cámaras virtuales pueden ser estáticas, pueden rotar para mirar siempre al jugador o a alguna otra entidad, o pueden estar adjuntas al jugador o a alguna otra entidad para que siempre las acompañen.

{% hint style="warning" %}
**📔 Nota**: Las cámaras virtuales son una característica que solo es compatible con el cliente de escritorio DCL 2.0.

Para cambiar entre las cámaras predeterminadas de primera y tercera persona, consulta [Áreas modificadoras de cámara](../interactivity/avatar-modifiers.md#modificadores-de-camara).
{% endhint %}

## Usar cámaras virtuales

Para usar un comportamiento de cámara personalizado en tu escena, necesitas dos cosas:

* Crear una Cámara Virtual: Crea una entidad en tu escena y dale un `VirtualCamera`.
* Asignar esa cámara virtual: Agrega un componente `MainCamera` a la [entidad reservada](../architecture/entities-components.md#entidades-reservadas) `engine.CameraEntity`, con una referencia a la entidad con el componente `VirtualCamera`.

La cámara entonces estará adjunta a la entidad con el componente `VirtualCamera`. Si la entidad se mueve o rota, la cámara se mueve con ella.

```ts
function main() {
	const myCustomCamera = engine.addEntity()
	Transform.create(myCustomCamera, {
		position: Vector3.create(1, 2, 1),
	})
	VirtualCamera.create(myCustomCamera, {})

	const mainCamera = MainCamera.createOrReplace(engine.CameraEntity, {
		virtualCameraEntity: myCustomCamera,
	})
}
```

En este ejemplo, la cámara siempre estará en una posición fija en la escena, siempre que el jugador permanezca dentro de los límites de la escena. Tan pronto como el jugador salga de los límites de la escena, se restaurará el comportamiento predeterminado de la cámara.

Tu escena puede incluir tantas entidades con un componente `VirtualCamera` como desees, y cambiar dinámicamente entre múltiples cámaras virtuales a medida que el jugador se mueve, o cuando realizan ciertas acciones. Solo una cámara virtual está activa en un momento dado, esta se asigna mediante el componente `MainCamera` en `engine.CameraEntity`.

Para volver al comportamiento predeterminado de la cámara, establece el valor en `undefined` en `MainCamera.virtualCameraEntity`. El jugador entonces es libre de cambiar entre cámaras de primera y tercera persona. Si quieres que el jugador solo use uno de estos dos modos, puedes usar [Áreas modificadoras de cámara](../interactivity/avatar-modifiers.md#modificadores-de-camara) para forzar uno de los dos.

{% hint style="warning" %}
**📔 Nota**: Las áreas modificadoras de cámara solo tienen efecto en el jugador si no hay cámaras virtuales activas. Si la escena está usando actualmente una cámara virtual y el jugador entra en un área modificadora de cámara, no pasa nada.

Si un modelo 3D incluye un nodo `camera` como parte de sus contenidos, este no puede ser usado por el SDK. Debes crear todas las cámaras como entidades con el SDK.
{% endhint %}

```ts
function main() {
	// cámara virtual personalizada
	const myCustomCamera = engine.addEntity()
	Transform.create(myCustomCamera, {
		position: Vector3.create(1, 2, 1),
	})
	VirtualCamera.create(myCustomCamera, {})

	const mainCamera = MainCamera.createOrReplace(engine.CameraEntity, {
		virtualCameraEntity: myCustomCamera,
	})

	// cubo clickeable
	const clickCube = engine.addEntity()
	Transform.create(clickCube, { position: Vector3.create(8, 0, 8) })
	MeshRenderer.setBox(clickCube)
	MeshCollider.setBox(clickCube)
	pointerEventsSystem.onPointerDown(
		{
			entity: clickCube,
			opts: { button: InputAction.IA_POINTER, hoverText: 'Reset camera' },
		},
		() => {
			// restablecer cámara a comportamiento predeterminado
			const mainCamera = MainCamera.getMutable(engine.CameraEntity)
			mainCamera.virtualCameraEntity = undefined
		}
	)
}
```

{% hint style="info" %}
**💡 Consejo**: Cuando la cámara se aleja del avatar, a menudo es una buena práctica también congelar los movimientos del avatar. De esa manera el jugador no se mueve a ciegas hacia obstáculos. Consulta [Modificadores de entrada](../interactivity/input-modifiers.md)
{% endhint %}

## Vista de pájaro

Puedes usar una cámara virtual para mirar la escena desde una vista superior, esto puede ser una variación divertida en la perspectiva normal de tu avatar y habilitar diferentes mecánicas de juego.

Debes evitar colocar una cámara mirando en una dirección perfectamente recta hacia abajo. En cambio, inclina siempre la cámara ligeramente, incluso 1 grado es suficiente. Esto se debe a que los controles de dirección del jugador se basan en la perspectiva de la cámara, no en la orientación del avatar. Si la cámara está mirando desde una vista perfecta de pájaro, no hay una definición clara de qué dirección es cuál. Una inclinación imperceptible de 1 grado es suficiente para establecer una dirección hacia adelante.

```ts
function main() {
	// cámara de vista de pájaro
	const myCustomCamera = engine.addEntity()
	Transform.create(myCustomCamera, {
		position: Vector3.create(8, 5, 8),
		rotation: Quaternion.Euler(0, 0, 91) 
		// Nota que la rotación es 91º, no 90º
	})
	VirtualCamera.create(myCustomCamera, {})

	const mainCamera = MainCamera.createOrReplace(engine.CameraEntity, {
		virtualCameraEntity: myCustomCamera,
	})
}
```

## Transiciones de cámara

Siempre que la escena cambia entre cámaras virtuales, o entre el comportamiento predeterminado de la cámara y las cámaras virtuales, los jugadores ven una transición. La posición, rotación y cualquier otro parámetro de la cámara virtual cambian suavemente durante un período de tiempo.

Los ajustes de transición en una cámara virtual determinan cómo haces la transición _hacia_ esa cámara, desde cualquier otra cámara en la escena, incluida la predeterminada. No afectan cómo haces la transición _desde_ esa cámara.

```ts
VirtualCamera.create(myCustomCamera1, {
	defaultTransition: { transitionMode: VirtualCamera.Transition.Time(6) },
})
```

{% hint style="info" %}
**💡 Consejo**: Para evitar tener una transición y cambiar instantáneamente a una cámara, establece el tiempo o la velocidad de transición en 0.
{% endhint %}

Dependiendo de tu caso de uso, puedes preferir establecer la velocidad de la transición en lugar de la duración:

* **Tiempo Fijo**: Estableces la duración de la transición, la cámara se moverá tan rápido como necesite para completar el camino en ese período de tiempo.
* **Velocidad Fija**: Estableces qué tan rápido quieres que se mueva la cámara virtual durante la transición, la duración dependerá de la distancia. El valor usado para la velocidad se interpreta como **metros por segundo**.

A continuación se muestran ejemplos para ambos modos de transición:

```ts
// duración fija
VirtualCamera.create(myCustomCamera1, {
	defaultTransition: { transitionMode: VirtualCamera.Transition.Time(6) },
})

// velocidad fija
VirtualCamera.create(myCustomCamera1, {
	defaultTransition: { transitionMode: VirtualCamera.Transition.Speed(3) },
})
```

A continuación se muestra un ejemplo completo con dos cámaras virtuales y transiciones entre ellas:

```ts
function main() {
	// cámara virtual personalizada 1
	const myCustomCamera1 = engine.addEntity()
	Transform.create(myCustomCamera1, {
		position: Vector3.create(1, 2, 1),
	})
	VirtualCamera.create(myCustomCamera1, {
		defaultTransition: { transitionMode: VirtualCamera.Transition.Time(1) },
	})

	// cámara virtual personalizada 2
	const myCustomCamera2 = engine.addEntity()
	Transform.create(myCustomCamera2, {
		position: Vector3.create(1, 2, 1),
	})
	VirtualCamera.create(myCustomCamera2, {
		defaultTransition: { transitionMode: VirtualCamera.Transition.Time(3) },
	})

	const mainCamera = MainCamera.createOrReplace(engine.CameraEntity, {
		virtualCameraEntity: myCustomCamera,
	})

	// cubo clickeable
	const clickCube = engine.addEntity()
	Transform.create(clickCube, { position: Vector3.create(8, 0, 8) })
	MeshRenderer.setBox(clickCube)
	MeshCollider.setBox(clickCube)
	pointerEventsSystem.onPointerDown(
		{
			entity: clickCube,
			opts: { button: InputAction.IA_POINTER, hoverText: 'Reset camera' },
		},
		() => {
			// restablecer cámara a comportamiento predeterminado
			const mainCamera = MainCamera.getMutable(engine.CameraEntity)
			mainCamera.virtualCameraEntity =
				mainCamera.virtualCameraEntity == myCustomCamera1
					? myCustomCamera2
					: myCustomCamera1
		}
	)
}
```

Las transiciones siempre se mueven en línea recta, sin considerar ningún obstáculo en el camino. En su lugar, podrías crear una transición manualmente usando otra cámara virtual como intermediaria, de esa manera tendrías control total sobre sus movimientos. Esta cámara virtual intermediaria podría realizar un [Tween](move-entities.md#move-between-two-points) desde la posición de la primera cámara hasta la posición de la segunda cámara, o seguir un camino más personalizado que evite obstáculos o tome un desvío cinematográfico.

## Seguimiento de cámara

Puedes configurar una cámara virtual para que siempre mire en la dirección del jugador, o alguna entidad específica en la escena. La posición de la cámara permanecerá estática, pero su rotación cambiará para mantener siempre esta entidad centrada.

Esto se puede lograr con la propiedad `lookAtEntity` en el componente `VirtualCamera`. Para seguir al jugador, usa la [entidad reservada](../architecture/entities-components.md#entidades-reservadas) `engine.PlayerEntity`.

```ts
const myCustomCamera1 = engine.addEntity()
Transform.create(myCustomCamera1, {
	position: Vector3.create(1, 2, 1),
})
VirtualCamera.create(myCustomCamera1, {
	lookAtEntity: engine.PlayerEntity,
})
```

Si una entidad está siendo seguida por la cámara, esto solo cambiará la rotación, no la posición de la cámara.

A medida que la cámara rota, el Transform de la entidad con el componente `VirtualCamera` no cambia. Sin embargo, puedes leer la rotación de la cámara desde el Transform en `engine.CameraEntity`. La rotación y posición de esta entidad serán absolutas, no estarán condicionadas por las de la entidad con el componente `VirtualCamera`. La rotación de este transform se ve afectada por el comportamiento `lookAtEntity`.

{% hint style="warning" %}
**📔 Nota**: Si configuras la cámara virtual con un `lookAtEntity` que hace referencia a la misma entidad que contiene la cámara virtual, o la entidad `engine.MainCamera`, el comportamiento resultante será el mismo que no asignar ninguna entidad en absoluto.
{% endhint %}

## Adjuntar al jugador

Otro uso de la cámara virtual es seguir al jugador desde una distancia o ángulo personalizado, adjuntando una cámara virtual a la entidad del jugador. Ten en cuenta que el jugador no puede cambiar la rotación de la cámara libremente, por lo que en este caso la rotación de la cámara se fijará a la de la cámara virtual. Esto podría ser útil, por ejemplo, para juegos de carreras, donde se espera que el jugador siempre mire hacia adelante.

```ts
function main() {
	const myCustomCamera = engine.addEntity()
	Transform.create(myCustomCamera, {
		position: Vector3.create(0, 1, 5),
		parent: engine.PlayerEntity,
	})
	VirtualCamera.create(myCustomCamera, {
		defaultTransition: { transitionMode: VirtualCamera.Transition.Time(2) },
	})

	const mainCamera = MainCamera.createOrReplace(engine.CameraEntity, {
		virtualCameraEntity: myCustomCamera,
	})
}
```

## Cámaras y colisionadores

Cuando la cámara de un jugador se mueve en modo de tercera persona, la cámara puede ser bloqueada por colisionadores o no, dependiendo de las capas de colisión asignadas a las entidades. Ten esto en cuenta al diseñar tu escena, es posible que desees evitar que la cámara atraviese paredes u otras entidades.

Consulta [Colisionadores](colliders.md#camaras-y-colisionadores) para más detalles sobre cómo configurar colisionadores para tu escena.
