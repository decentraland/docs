---
description: >-
  Cómo mover, rotar y escalar una entidad gradualmente a lo largo del tiempo,
  con cambios incrementales
metaLinks:
  alternates:
    - >-
      https://app.gitbook.com/s/oPnXBby9S6MrsW83Y9qZ/scenes-sdk7/3d-essentials/move-entities
---

# Mover entidades

Para mover, rotar o cambiar el tamaño de una entidad en tu escena durante un período de tiempo, usa el componente `Tween`. El motor realiza la transformación deseada suavemente, mostrando actualizaciones en cada fotograma hasta que se complete la duración especificada. Además, los valores del componente `Transform` de la entidad afectada se actualizan en tiempo real en caso de que sea necesario realizar verificaciones de proximidad en el código de la escena.

{% hint style="info" %}
**💡 Consejo**: En el [Scene Editor](../../scene-editor/about-editor.md), puedes mover entidades de forma sin código a través de **Actions**, consulta [Hacer cualquier elemento inteligente](../../scene-editor/smart-items.md).
{% endhint %}

El componente Tween tiene las siguientes funciones:

* `setMove`: Mover entre dos puntos
* `setRotate`: Rotar entre dos direcciones
* `setScale`: Escalar entre dos tamaños
* `setMoveContinuous`: Mover constantemente en la misma dirección
* `setRotateContinuous`: Rotar constantemente en la misma dirección
* `setTextureMove`: Desplazar la textura de un material entre dos posiciones
* `setTextureMoveContinuous`: Desplazar la textura de un material constantemente en la misma dirección

## Mover entre dos puntos

Para mover una entidad entre dos puntos, crea un componente `Tween` con la función `setMove`.

```ts
const myEntity = engine.addEntity()
Transform.create(myEntity, {
	position: Vector3.create(4, 1, 4),
})
MeshRenderer.setBox(myEntity)

Tween.setMove(myEntity, 
	Vector3.create(1, 1, 1), 
	Vector3.create(8, 1, 8), 
	2000
)
```

El tween de movimiento toma la siguiente información:

* `entity`: La entidad a mover
* `start`: Un Vector3 para la posición inicial
* `end`: Un Vector3 para la posición final
* `duration`: Cuántos milisegundos toma moverse entre las dos posiciones

Estos otros parámetros opcionales también están disponibles:

* `faceDirection`: Si es true, la entidad se rota para mirar en la dirección del movimiento.
* `easingFunction`: Qué función de easing usar. Consulta [Tweens no lineales](move-entities.md#non-linear-tweens)

## Rotar entre dos direcciones

Para rotar una entidad entre dos puntos, crea un componente `Tween` con la función `setRotate`.

```ts
const myEntity = engine.addEntity()
Transform.create(myEntity, {
	position: Vector3.create(4, 1, 4),
})
MeshRenderer.setBox(myEntity)

Tween.setRotate(myEntity, 
	Quaternion.fromEulerDegrees(0, 0, 0), 
	Quaternion.fromEulerDegrees(0, 170, 0), 
	700
)
```

El tween de rotación toma la siguiente información:

* `start`: Un Quaternion para la rotación inicial
* `end`: Un Quaternion para la rotación final
* `duration`: Cuántos milisegundos toma moverse entre las dos posiciones

Este otro parámetro opcional también está disponible:

* `easingFunction`: Qué función de easing usar. Consulta [Tweens no lineales](move-entities.md#non-linear-tweens)

### Rotar con un punto de pivote

Al rotar una entidad, la rotación siempre está en referencia a la coordenada central de la entidad. Para rotar una entidad usando otro conjunto de coordenadas como punto de pivote, crea una segunda entidad (invisible) con el punto de pivote como su posición y hazla padre de la entidad que deseas rotar.

Al rotar la entidad padre, sus hijos serán todos rotados usando la posición del padre como punto de pivote. Ten en cuenta que la `position` de la entidad hija está en referencia a la de la entidad padre.

```ts
const pivotEntity = engine.addEntity()
Transform.create(pivotEntity, {
	position: Vector3.create(4, 1, 4),
})

const childEntity = engine.addEntity()
Transform.create(childEntity, {
	position: Vector3.create(1, 0, 0),
	parent: pivotEntity,
})
MeshRenderer.setBox(myEntity)

Tween.setRotate(pivotEntity, 
	Quaternion.fromEulerDegrees(0, 0, 0), 
	Quaternion.fromEulerDegrees(0, 170, 0), 
	700
)
```

Ten en cuenta que en este ejemplo, el sistema está rotando la entidad `pivotEntity`, que es padre de la entidad `childEntity`.

## Escalar entre dos tamaños

Para cambiar la escala de una entidad entre dos tamaños, crea un componente `Tween` con su modo establecido en `Tween.Mode.Scale`.

```ts
const myEntity = engine.addEntity()
Transform.create(myEntity, {
	position: Vector3.create(4, 1, 4),
})
MeshRenderer.setBox(myEntity)

Tween.setScale(myEntity, 
	Vector3.create(1, 1, 1), 
	Vector3.create(4, 4, 4), 
	2000
)	

```

El tween de escala toma la siguiente información:

* `start`: Un Vector3 para el tamaño inicial
* `end`: Un Vector3 para el tamaño final
* `duration`: Cuántos milisegundos toma moverse entre las dos posiciones

Este otro parámetro opcional también está disponible:

* `easingFunction`: Qué función de easing usar. Consulta [Tweens no lineales](move-entities.md#non-linear-tweens)

## Tweens no lineales

Los tweens pueden seguir diferentes **Funciones de Easing** que afectan la tasa de cambio a lo largo del tiempo. Una función **lineal**, significa que la velocidad del cambio es constante de principio a fin. Hay muchas opciones para elegir, que dibujan curvas de diferentes formas dependiendo de si el comienzo y/o el final comienzan lento, y cuánto. Una curva **easeinexpo** comienza lenta y termina rápida, aumentando la velocidad exponencialmente, por el contrario, una curva **easeoutexpo** comienza rápida y termina lenta.



{% hint style="info" %}
**💡 Consejo**: Experimenta con diferentes curvas de movimiento. Las diferencias a menudo son sutiles, pero subconscientemente interpretamos información de cómo se mueven las cosas, como peso, fricción o incluso personalidad.
{% endhint %}

```ts
Tween.setScale(myEntity, 
	Vector3.create(1, 1, 1), 
	Vector3.create(4, 4, 4), 
	2000,
	EasingFunction.EF_EASEOUTBOUNCE
)

```

El parámetro opcional `easingFunction` toma su valor del enum `EasingFunction`, que ofrece las siguientes opciones:

* `EF_EASEBACK`
* `EF_EASEBOUNCE`
* `EF_EASECIRC`
* `EF_EASECUBIC`
* `EF_EASEELASTIC`
* `EF_EASEEXPO`
* `EF_EASEINBACK`
* `EF_EASEINBOUNCE`
* `EF_EASEINCIRC`
* `EF_EASEINCUBIC`
* `EF_EASEINELASTIC`
* `EF_EASEINEXPO`
* `EF_EASEINQUAD`
* `EF_EASEINQUART`
* `EF_EASEINQUINT`
* `EF_EASEINSINE`
* `EF_EASEOUTBACK`
* `EF_EASEOUTBOUNCE`
* `EF_EASEOUTCIRC`
* `EF_EASEOUTCUBIC`
* `EF_EASEOUTELASTIC`
* `EF_EASEOUTEXPO`
* `EF_EASEOUTQUAD`
* `EF_EASEOUTQUART`
* `EF_EASEOUTQUINT`
* `EF_EASEOUTSINE`
* `EF_EASEQUAD`
* `EF_EASEQUART`
* `EF_EASEQUINT`
* `EF_EASESINE`
* `EF_LINEAR`

## Rotación constante

Para hacer que una entidad rote constantemente, usa el componente `Tween` con la función `setRotateContinuous`.

```ts
Tween.setRotateContinuous(myEntity, 
	Quaternion.fromEulerDegrees(0, -1, 0), 
	700
)
```

El tween de rotación continua toma la siguiente información:

* `entity`: La entidad a rotar
* `direction`: Un Quaternion para la rotación
* `speed`: Cuántos grados por segundo rotará la entidad

Este otro parámetro opcional también está disponible:

* `duration`: Cuántos milisegundos sostener la rotación. Después de este tiempo, la rotación se detendrá.

## Movimiento constante

Para hacer que una entidad se mueva constantemente en la misma dirección, usa el componente `Tween` con la función `setMoveContinuous`.

```ts
Tween.setMoveContinuous(myEntity, 
	Vector3.create(0, 0, 1), 
	0.7
)
```

El tween de movimiento continuo toma la siguiente información:

* `entity`: La entidad a mover
* `direction`: Un Vector3 para el movimiento
* `speed`: Cuántos metros por segundo se moverá la entidad

Este otro parámetro opcional también está disponible:

* `duration`: Cuántos milisegundos sostener el movimiento. Después de este tiempo, el movimiento se detendrá.

El tween de movimiento continuo toma la siguiente información:

## Secuencias de tweens

Para hacer que una entidad reproduzca una serie de tweens en secuencia, usa el componente `TweenSequence`. Este componente requiere dos campos:

* `sequence`: Un array con múltiples definiciones de tween, que se llevarán a cabo secuencialmente. El array puede estar vacío, en cuyo caso solo reproduce el tween actual.
* `loop` _(opcional)_: Si no se proporciona, la secuencia solo se reproduce una vez. Si el campo está presente, el valor debe ser un valor del enum `TweenLoop`. Los valores aceptados son:
  * `TL_RESTART`: Cuando la secuencia termina, se reinicia. Si el último estado no coincide con el primer estado, la entidad salta instantáneamente de uno a otro.
  * `TL_YOYO`: Cuando la secuencia termina, va hacia atrás, haciendo todos los tweens en reversa hasta que alcanza el inicio nuevamente. Luego comienza una vez más.

### Mover de ida y vuelta

Para hacer que una plataforma se mueva constantemente de ida y vuelta entre dos posiciones, deja el array `sequence` vacío, y establece `loop` en `TweenLoop.TL_YOYO`

```ts
const myEntity = engine.addEntity()
Transform.create(myEntity, {
	position: Vector3.create(4, 1, 4),
})
MeshRenderer.setBox(myEntity)

Tween.setMove(myEntity, 
	Vector3.create(1, 1, 1), 
	Vector3.create(8, 1, 8), 
	2000
)

TweenSequence.create(myEntity, { sequence: [], loop: TweenLoop.TL_YOYO })
```

La entidad se moverá de ida y vuelta entre el punto de inicio y el punto final, con la misma duración y la misma función de easing en ambas direcciones.

### Seguir un camino

Para hacer que una entidad siga un camino más complejo con múltiples puntos, proporciona una lista de definiciones de tween en la `sequence` de un componente `TweenSequence`.

```ts
const myEntity = engine.addEntity()
Transform.create(myEntity, {
	position: Vector3.create(4, 1, 4),
})
MeshRenderer.setBox(myEntity)

Tween.setMove(myEntity, 
	Vector3.create(6.5, 7, 4), 
	Vector3.create(6.5, 7, 12), 
	4000
)

TweenSequence.create(myEntity, {
	sequence: [
		{
			duration: 2000,
			easingFunction: EasingFunction.EF_LINEAR,
			mode: Tween.Mode.Move({
				start: Vector3.create(6.5, 7, 12),
				end: Vector3.create(6.5, 10.5, 12),
			}),
		},
		{
			duration: 3000,
			easingFunction: EasingFunction.EF_LINEAR,
			mode: Tween.Mode.Move({
				start: Vector3.create(6.5, 10.5, 12),
				end: Vector3.create(6.5, 10.5, 4),
			}),
		},
		{
			duration: 3000,
			easingFunction: EasingFunction.EF_LINEAR,
			mode: Tween.Mode.Move({
				start: Vector3.create(6.5, 10.5, 4),
				end: Vector3.create(6.5, 7, 4),
			}),
		},
	],
	loop: TweenLoop.TL_RESTART,
})
```

Ten en cuenta que al definir un tween dentro de un TweenSequence, necesitas usar el formato más verboso de `Tween.Mode.Move`, o `Tween.Mode.Rotate`, o `Tween.Mode.Scale` para definir el tween. En este formato más verboso, necesitas especificar:

* `duration`: Cuántos milisegundos toma moverse entre las dos posiciones
* `easingFunction`: Qué función de easing usar. Consulta [Tweens no lineales](move-entities.md#non-linear-tweens). En este formato el valor es obligatorio.
* `mode`: El modo del tween, que puede ser `Tween.Mode.Move`, `Tween.Mode.Rotate`, o `Tween.Mode.Scale`.

Y dentro del campo `mode`, necesitas especificar:

* `start`: El valor inicial del tween
* `end`: El valor final del tween

## Al finalizar un tween

Usa `tweenSystem.tweenCompleted` para detectar cuándo un tween ha terminado. Esto puede ser útil para realizar acciones cuando un tween termina, por ejemplo para abrir una puerta de elevador.

```ts
engine.addSystem(() => {
	const tweenCompleted = tweenSystem.tweenCompleted(myEntity)
	if (tweenCompleted) {
		//reproducir sonido
	}
})
```

## Tweens simultáneos

Una entidad solo puede tener un componente `Tween`, y cada componente tween solo puede realizar una transformación a la vez. Por ejemplo, no puedes hacer que una entidad se mueva lateralmente y también rote al mismo tiempo. Como solución, puedes usar entidades con padres. Por ejemplo, puedes tener una entidad padre invisible que se mueve lateralmente, con un hijo visible que rota.

En el siguiente fragmento, una entidad padre rota mientras un hijo escala.

```ts
const parentEntity = engine.addEntity()
Transform.create(parentEntity, {
	position: Vector3.create(4, 1, 4),
})
MeshRenderer.setBox(parentEntity)
Tween.setRotate(parentEntity, 
	Quaternion.fromEulerDegrees(0, 0, 0), 
	Quaternion.fromEulerDegrees(0, 170, 0), 
	5000
)

const childEntity = engine.addEntity()
Transform.create(childEntity, {
	position: Vector3.create(0, 0, 0),
	parent: parentEntity,
})
MeshRenderer.setBox(childEntity)
Tween.setScale(childEntity, 
	Vector3.create(1, 1, 1), 
	Vector3.create(4, 4, 4), 
	5000
)
```

## Pausar un tween

Para pausar un tween, cambia la propiedad `playing` a false. Para reanudarlo, cámbialo de vuelta a true.

```ts
pointerEventsSystem.onPointerDown(
	{
		entity: button,
		opts: { button: InputAction.IA_POINTER, hoverText: 'pause' },
	},
	() => {
		let tweenData = Tween.getMutable(myEntity)
		tweenData.playing = !tweenData.playing
	}
)
```

Para terminar un tween que no necesita ser continuado, elimina el componente `Tween` de la entidad. Si la entidad también estaba usando un componente `TweenSequence`, elimina ese también.

```ts
pointerEventsSystem.onPointerDown(
	{
		entity: button,
		opts: { button: InputAction.IA_POINTER, hoverText: 'pause' },
	},
	() => {
		if( Tween.has(myEntity)){
			Tween.deleteFrom(myEntity)
		}
		if( TweenSequence.has(myEntity)){
			TweenSequence.deleteFrom(myEntity)
		}
	}
)
```

## Tweens basados en un sistema

En lugar de usar el componente Tween y dejar que el motor maneje la transformación, puedes preferir hacer esta transición incrementalmente, fotograma por fotograma, a través de un [sistema](../architecture/systems.md) en tu escena. Moviendo la entidad una pequeña cantidad cada vez que se ejecuta la función.

Por un lado, esto te da más control para recalcular movimientos en cada fotograma. Por otro lado, el código es más complicado, y los jugadores con máquinas menos performantes podrían experimentar el tween como laggy, notando cada incremento.

### Mover mediante sistema

La forma más fácil de mover una entidad es modificar gradualmente el valor de _position_ almacenado en el componente `Transform`.

```ts
function SimpleMove() {
	let transform = Transform.getMutable(myEntity)
	transform.position = Vector3.add(
		transform.position,
		Vector3.scale(Vector3.Forward(), 0.05)
	)
}

engine.addSystem(SimpleMove)

const myEntity = engine.addEntity()
Transform.create(myEntity, {
	position: Vector3.create(4, 1, 4),
})
MeshRenderer.setBox(myEntity)
```

En este ejemplo estamos moviendo una entidad 0.1 metros por tick del bucle del juego.

`Vector3.Forward()` devuelve un vector que mira hacia adelante y mide 1 metro de longitud. En este ejemplo luego estamos escalando este vector a 1/10 de su longitud con `Vector3.scale()`. Si nuestra escena tiene 30 fotogramas por segundo, la entidad se está moviendo a 3 metros por segundo en velocidad.



### Rotar mediante sistema

La forma más fácil de rotar una entidad es cambiar gradualmente los valores en el componente Transform incrementalmente, y ejecutar esto como parte de la función de un sistema.

```ts
function SimpleRotate() {
	let transform = Transform.getMutable(myEntity)
	transform.rotation = Quaternion.multiply(
		transform.rotation,
		Quaternion.fromAngleAxis(1, Vector3.Up())
	)
}

engine.addSystem(SimpleRotate)

const myEntity = engine.addEntity()
Transform.create(myEntity, {
	position: Vector3.create(4, 1, 4),
})
MeshRenderer.setBox(myEntity)
```

Ten en cuenta que para combinar la rotación actual con cada incremento, estamos usando `Quaternion.multiply`. En matemáticas de quaternion, combinas dos rotaciones multiplicándolas, NO sumándolas. La rotación resultante de multiplicar un quaternion por otro será la rotación final equivalente después de realizar primero una rotación y luego la otra.

En este ejemplo, estamos rotando la entidad 1 grado en dirección hacia arriba en cada tick del bucle del juego.

{% hint style="info" %}
**💡 Consejo**: Para hacer que una entidad siempre rote para mirar al jugador, puedes agregar un [componente `Billboard`](entity-positioning.md#face-the-user).
{% endhint %}



### Rotar mediante sistema sobre un punto de pivote

Al rotar una entidad, la rotación siempre está en referencia a la coordenada central de la entidad. Para rotar una entidad usando otro conjunto de coordenadas como punto de pivote, crea una segunda entidad (invisible) con el punto de pivote como su posición y hazla padre de la entidad que deseas rotar.

Al rotar la entidad padre, sus hijos serán todos rotados usando la posición del padre como punto de pivote. Ten en cuenta que la `position` de la entidad hija está en referencia a la de la entidad padre.

```ts
function SimpleRotate() {
	let transform = Transform.getMutable(pivotEntity)
	transform.rotation = Quaternion.multiply(
		transform.rotation,
		Quaternion.fromAngleAxis(1, Vector3.Up())
	)
}

engine.addSystem(SimpleRotate)

const pivotEntity = engine.addEntity()
Transform.create(pivotEntity, {
	position: Vector3.create(4, 1, 4),
})

const childEntity = engine.addEntity()
Transform.create(childEntity, {
	position: Vector3.create(1, 0, 0),
	parent: pivotEntity,
})
MeshRenderer.setBox(myEntity)
```

Ten en cuenta que en este ejemplo, el sistema está rotando la entidad `pivotEntity`, que es padre de la entidad `childEntity`.



### Ajustar movimiento al tiempo de retardo

Supón que el jugador que visita tu escena está luchando para mantener el ritmo de la tasa de fotogramas. Eso podría resultar en que el movimiento parezca entrecortado, ya que no todos los fotogramas están espaciados uniformemente en el tiempo pero cada uno mueve la entidad en la misma cantidad.

Puedes compensar este tiempo desigual usando el parámetro `dt` para ajustar la escala del movimiento.

```ts
function SimpleMove(dt: number) {
	let transform = Transform.getMutable(myEntity)
	transform.position = Vector3.add(
		transform.position,
		Vector3.scale(Vector3.Forward(), dt)
	)
}

engine.addSystem(SimpleMove)

const myEntity = engine.addEntity()
Transform.create(myEntity, {
	position: Vector3.create(4, 1, 4),
})
MeshRenderer.setBox(myEntity)
```

El ejemplo anterior mantiene el movimiento aproximadamente a la misma velocidad que el ejemplo de movimiento anterior, incluso si la tasa de fotogramas cae. Al ejecutarse a 30 fotogramas por segundo, el valor de `dt` es 1/30.

También puedes suavizar rotaciones de la misma manera multiplicando la cantidad de rotación por `dt`.

### Mover entre dos puntos mediante sistema

Si deseas que una entidad se mueva suavemente entre dos puntos, usa el algoritmo _lerp_ (interpolación lineal). Este algoritmo es muy conocido en el desarrollo de juegos, ya que es realmente útil.

La función `lerp()` toma tres parámetros:

* El vector para la posición de origen
* El vector para la posición objetivo
* La cantidad, un valor de 0 a 1 que representa qué fracción de la traducción hacer.

```ts
const originVector = Vector3.Zero()
const targetVector = Vector3.Forward()

let newPos = Vector3.lerp(originVector, targetVector, 0.6)
```

El algoritmo de interpolación lineal encuentra un punto intermedio en el camino entre ambos vectores que coincide con la cantidad proporcionada.

Por ejemplo, si el vector de origen es _(0, 0, 0)_ y el vector objetivo es _(10, 0, 10)_:

* Usando una cantidad de 0 devolvería _(0, 0, 0)_
* Usando una cantidad de 0.3 devolvería _(3, 0, 3)_
* Usando una cantidad de 1 devolvería _(10, 0, 10)_

Para implementar este `lerp()` en tu escena, recomendamos crear un [componente personalizado](../architecture/custom-components.md) para almacenar la información necesaria. También necesitas definir un sistema que implemente el movimiento gradual en cada fotograma.

```ts
// definir componente personalizado
const MoveTransportData = {
	start: Schemas.Vector3,
	end: Schemas.Vector3,
	fraction: Schemas.Float,
	speed: Schemas.Float,
}

export const LerpTransformComponent = engine.defineComponent(
	'LerpTransformComponent',
	MoveTransportData
)

// definir sistema
function LerpMove(dt: number) {
	let transform = Transform.getMutable(myEntity)
	let lerp = LerpTransformComponent.getMutable(myEntity)
	if (lerp.fraction < 1) {
		lerp.fraction += dt * lerp.speed
		transform.position = Vector3.lerp(lerp.start, lerp.end, lerp.fraction)
	}
}

engine.addSystem(LerpMove)

// crear entidad
const myEntity = engine.addEntity()

Transform.create(myEntity, {
	position: Vector3.create(4, 1, 4),
})

MeshRenderer.setBox(myEntity)

LerpTransformComponent.create(myEntity, {
	start: Vector3.create(4, 1, 4),
	end: Vector3.create(8, 1, 8),
	fraction: 0,
	speed: 1,
})
```



### Rotar entre dos ángulos mediante sistema

Para rotar suavemente entre dos ángulos, usa el algoritmo _slerp_ (interpolación lineal _esférica_). Este algoritmo es muy similar a un _lerp_, pero maneja rotaciones de quaternion.

La función `slerp()` toma tres parámetros:

* El ángulo [quaternion](https://en.wikipedia.org/wiki/Quaternion) para la rotación de origen
* El ángulo [quaternion](https://en.wikipedia.org/wiki/Quaternion) para la rotación objetivo
* La cantidad, un valor de 0 a 1 que representa qué fracción de la traducción hacer.

{% hint style="info" %}
**💡 Consejo**: Puedes pasar valores de rotación en grados [euler](https://en.wikipedia.org/wiki/Euler_angles) (de 0 a 360) usando `Quaternion.fromEulerDegrees()`.
{% endhint %}

```ts
const originRotation = Quaternion.fromEulerDegrees(0, 90, 0)
const targetRotation = Quaternion.fromEulerDegrees(0, 0, 0)

let newRotation = Quaternion.slerp(originRotation, targetRotation, 0.6)
```

Para implementar esto en tu escena, recomendamos almacenar los datos que van en la función `Slerp()` en un [componente personalizado](../architecture/custom-components.md). También necesitas definir un sistema que implemente la rotación gradual en cada fotograma.

```ts
// definir componente personalizado
const RotateSlerpData = {
	start: Schemas.Quaternion,
	end: Schemas.Quaternion,
	fraction: Schemas.Float,
	speed: Schemas.Float,
}

export const SlerpData = engine.defineComponent('SlerpData', RotateSlerpData)

// definir sistema
function SlerpRotate(dt: number) {
	let transform = Transform.getMutable(myEntity)
	let slerpData = SlerpData.getMutable(myEntity)
	if (slerpData.fraction < 1) {
		slerpData.fraction += dt * slerpData.speed
		transform.rotation = Quaternion.slerp(
			slerpData.start,
			slerpData.end,
			slerpData.fraction
		)
	}
}

engine.addSystem(SlerpRotate)

// crear entidad
const myEntity = engine.addEntity()

Transform.create(myEntity, {
	position: Vector3.create(4, 1, 4),
})

MeshRenderer.setBox(myEntity)

SlerpData.create(myEntity, {
	start: Quaternion.fromEulerDegrees(0, 0, 0),
	end: Quaternion.fromEulerDegrees(0, 180, 0),
	fraction: 0,
	speed: 0.3,
})
```

{% hint style="warning" %}
**📔 Nota**: En su lugar, podrías representar la rotación con ángulos euler como valores `Vector3` y usar una función `Lerp()`, pero eso implicaría una conversión de `Vector3` a `Quaternion` en cada fotograma. Los valores de rotación se almacenan internamente como quaternions en el componente `Transform`, por lo que es más eficiente para la escena trabajar con quaternions.
{% endhint %}



Un enfoque más simple pero menos eficiente para esto aprovecha la función `Quaternion.rotateTowards`, y evita usar componentes personalizados.

```ts
function SimpleRotate(dt: number) {
	let transform = Transform.getMutable(myEntity)
	transform.rotation = Quaternion.rotateTowards(
		transform.rotation,
		Quaternion.fromEulerDegrees(90, 0, 0),
		dt * 10
	)
	if (transform.rotation === Quaternion.fromEulerDegrees(90, 0, 0)) {
		console.log('done')
		engine.removeSystem(this)
	}
}

const simpleRotateSystem = engine.addSystem(SimpleRotate)

const myEntity = engine.addEntity()
Transform.create(myEntity, {
	position: Vector3.create(4, 1, 4),
	rotation: Quaternion.fromEulerDegrees(0, 0, 90),
})

MeshRenderer.setBox(myEntity)
```

En el ejemplo anterior `Quaternion.rotateTowards` toma tres argumentos: la rotación inicial, la rotación final que se desea, y el incremento máximo por fotograma. En este caso, dado que el incremento máximo es de `dt * 10` grados, la rotación se llevará a cabo durante un período de un par de 9 segundos.

Ten en cuenta que el sistema también verifica si la rotación está completa y si es así elimina el sistema del motor. De lo contrario, el sistema seguiría haciendo cálculos en cada fotograma, incluso una vez que la rotación esté completa.

### Cambiar escala entre dos tamaños mediante sistema

Si deseas que una entidad cambie de tamaño suavemente y sin cambiar sus proporciones, usa el algoritmo _lerp_ (interpolación lineal) del objeto `Scalar`.

De lo contrario, si deseas cambiar los ejes en diferentes proporciones, usa `Vector3` para representar la escala de origen y la escala objetivo, y luego usa la función _lerp_ del `Vector3`.

La función `lerp()` del objeto `Scalar` toma tres parámetros:

* Un número para la escala de origen
* Un número para la escala objetivo
* La cantidad, un valor de 0 a 1 que representa qué fracción del escalado hacer.

```ts
const originScale = 1
const targetScale = 10

let newScale = Scalar.Lerp(originScale, targetScale, 0.6)
```

Para implementar este lerp en tu escena, recomendamos crear un componente personalizado para almacenar la información necesaria. También necesitas definir un sistema que implemente el escalado gradual en cada fotograma.

```ts
// definir componente personalizado
const ScaleTransportData = {
	start: Schemas.Number,
	end: Schemas.Number,
	fraction: Schemas.Float,
	speed: Schemas.Float,
}

export const ScaleTransformComponent = engine.defineComponent(
	'ScaleTransformComponent',
	ScaleTransportData
)

// definir sistema
function LerpMove(dt: number) {
	let transform = Transform.getMutable(myEntity)
	let lerp = ScaleTransformComponent.getMutable(myEntity)
	if (lerp.fraction < 1) {
		lerp.fraction += dt * lerp.speed
		const newScale = Scalar.lerp(lerp.start, lerp.end, lerp.fraction)
		transform.scale = Vector3.create(newScale, newScale, newScale)
	}
}

engine.addSystem(LerpMove)

// crear entidad
const myEntity = engine.addEntity()

Transform.create(myEntity, {
	position: { x: 4, y: 1, z: 4 },
})

MeshRenderer.setBox(myEntity)

ScaleTransformComponent.create(myEntity, {
	start: 1,
	end: 2,
	fraction: 0,
	speed: 1,
})

Vector3.create(1, 1, 1)
```



### Mover a velocidades irregulares entre dos puntos mediante sistema

Mientras usas el método lerp, puedes hacer que la velocidad de movimiento sea no lineal. En el ejemplo anterior incrementamos la cantidad de lerp en una cantidad dada cada fotograma, pero también podríamos usar una función matemática para aumentar el número exponencialmente o en otras medidas que te den un ritmo de movimiento diferente.

También podrías usar una función que dé resultados recurrentes, como una función seno, para describir un movimiento que va y viene.

A menudo estas transiciones no lineales pueden darle mucha vida a una escena. Un movimiento que acelera sobre una curva o desacelera gradualmente puede decir mucho sobre la naturaleza de un objeto o personaje. Incluso podrías aprovechar funciones matemáticas que agreguen efectos de rebote.

```ts
// definir componente personalizado
const MoveTransportData = {
	start: Schemas.Vector3,
	end: Schemas.Vector3,
	fraction: Schemas.Float,
	speed: Schemas.Float,
}

export const LerpTransformComponent = engine.defineComponent(
	'LerpTransformComponent',
	MoveTransportData
)

// definir sistema
function LerpMove(dt: number) {
	let transform = Transform.getMutable(myEntity)
	let lerp = LerpTransformComponent.getMutable(myEntity)
	if (lerp.fraction < 1) {
		lerp.fraction += dt * lerp.speed
		const interpolatedValue = interpolate(lerp.fraction)
		transform.position = Vector3.lerp(lerp.start, lerp.end, interpolatedValue)
	}
}

// mapear la fracción de lerp a una curva exponencial
function interpolate(t: number) {
	return t * t
}

engine.addSystem(LerpMove)

// crear entidad
const myEntity = engine.addEntity()

Transform.create(myEntity, {
	position: { x: 4, y: 1, z: 4 },
})

MeshRenderer.setBox(myEntity)

LerpTransformComponent.create(myEntity, {
	start: Vector3.create(4, 1, 4),
	end: Vector3.create(8, 1, 8),
	fraction: 0,
	speed: 1,
})
```

El ejemplo anterior es igual al ejemplo de lerp lineal que hemos mostrado antes, pero el campo `fraction` se mapea a un valor no lineal en cada tick. Este valor no lineal se usa para calcular la función `lerp`, resultando en un movimiento que sigue una curva exponencial.

También puedes mapear una transición en rotación o en escala de la misma manera que se muestra arriba, mapeando una transición lineal a una curva.



### Seguir un camino mediante sistema

Puedes hacer que una entidad itere sobre un array de vectores, realizando un movimiento lerp entre cada uno para seguir un camino más complejo.

```ts
// definir componente personalizado
const PathTransportData = {
	path: Schemas.Array(Schemas.Vector3),
	start: Schemas.Vector3,
	end: Schemas.Vector3,
	fraction: Schemas.Float,
	speed: Schemas.Float,
	pathTargetIndex: Schemas.Int,
}

export const LerpTransformComponent = engine.defineComponent(
	'LerpTransformComponent',
	PathTransportData
)

// definir sistema
function PathMove(dt: number) {
	let transform = Transform.getMutable(myEntity)
	let lerp = LerpTransformComponent.getMutable(myEntity)
	if (lerp.fraction < 1) {
		lerp.fraction += dt * lerp.speed
		transform.position = Vector3.lerp(lerp.start, lerp.end, lerp.fraction)
	} else {
		lerp.pathTargetIndex += 1
		if (lerp.pathTargetIndex >= lerp.path.length) {
			lerp.pathTargetIndex = 0
		}
		lerp.start = lerp.end
		lerp.end = lerp.path[lerp.pathTargetIndex]
		lerp.fraction = 0
	}
}

engine.addSystem(PathMove)

// crear entidad
const myEntity = engine.addEntity()

Transform.create(myEntity, {
	position: Vector3.create(1, 1, 1),
})

MeshRenderer.setBox(myEntity)

const point1 = Vector3.create(1, 1, 1)
const point2 = Vector3.create(8, 1, 3)
const point3 = Vector3.create(8, 4, 7)
const point4 = Vector3.create(1, 1, 7)

const myPath = [point1, point2, point3, point4]

LerpTransformComponent.create(myEntity, {
	path: myPath,
	start: Vector3.create(4, 1, 4),
	end: Vector3.create(8, 1, 8),
	fraction: 0,
	speed: 1,
	pathTargetIndex: 1,
})
```

El ejemplo anterior define un camino 3D que está compuesto por cuatro vectores 3D. El componente personalizado `PathTransportData` contiene los mismos datos utilizados por el componente personalizado en el ejemplo _lerp_ anterior, pero agrega un array `path`, con todos los puntos en nuestro camino, y un campo `pathTargetIndex` para hacer un seguimiento de qué segmento del camino se está usando actualmente.

El sistema es muy similar al sistema en el ejemplo _lerp_, pero cuando se completa una acción lerp, establece los campos `target` y `origin` a nuevos valores. Si llegamos al final del camino, volvemos al primer valor en el camino.



## Tweens de textura

Para hacer que una textura se deslice suavemente, usa el componente `Tween` con la función `setTextureMove`.

```ts
Tween.setTextureMove(myEntity, 
	Vector2.create(0, 0), 
	Vector2.create(1, 0), 
	2000
)
```

El tween de textura toma la siguiente información:

* `entity`: La entidad para mover la textura
* `start`: Un Vector2 para la posición inicial
* `end`: Un Vector2 para la posición final
* `duration`: Cuántos milisegundos toma moverse entre las dos posiciones

Este otro parámetro opcional también está disponible:

* `movementType`: (opcional), define si el movimiento será en el campo offset o tiling. Por defecto usa offset.
* `easingFunction`: Qué función de easing usar. Consulta [Tweens no lineales](move-entities.md#non-linear-tweens). Nota: Este parámetro solo se usa si se proporciona una duración.

## Movimiento constante de textura

Para hacer que una textura se deslice constantemente, usa el componente `Tween` con la función `setTextureMoveContinuous`.

```ts
Tween.setTextureMoveContinuous(myEntity, 
	Vector2.create(0, 1), 
	0.7
)
```

El tween continuo de textura toma la siguiente información:

* `entity`: La entidad para mover la textura
* `direction`: Un Vector2 para el movimiento
* `speed`: Cuántas unidades por segundo se moverá la entidad

Este otro parámetro opcional también está disponible:

* `movementType`: define si el movimiento será en el campo offset o tiling. Por defecto usa offset.
* `duration`: Cuántos milisegundos sostener el movimiento. Después de este tiempo, el movimiento se detendrá.

Lee más sobre tweens de textura en la sección [Tweens de textura](materials.md#texture-tweens).
