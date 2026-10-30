---
description: Cómo animar modelos 3D en tu escena
metaLinks:
  alternates:
    - >-
      https://app.gitbook.com/s/oPnXBby9S6MrsW83Y9qZ/scenes-sdk7/3d-essentials/3d-model-animations
---

# Animaciones

Los modelos 3D en formato _.glTF_ y _.glb_ pueden incluir tantas animaciones como desees. Las animaciones le dicen al mesh cómo moverse, especificando una serie de _keyframes_ que se colocan a lo largo del tiempo, el mesh luego se mezcla de una pose a la otra para simular movimiento continuo.

La mayoría de las animaciones de modelos 3D son [_animaciones esqueléticas_](https://en.wikipedia.org/wiki/Skeletal_animation). Estas animaciones simplifican la geometría compleja del modelo en una "figura de palo", vinculando cada vértice en el mesh al _bone_ (hueso) más cercano en el _skeleton_ (esqueleto). Los modeladores ajustan el esqueleto en diferentes poses, y el mesh se estira y dobla para seguir estos movimientos.

Como alternativa, las _animaciones de vértices_ animan un modelo sin la necesidad de un esqueleto. Estas animaciones especifican la posición de cada vértice en el modelo directamente. Decentraland también admite estas animaciones.

Consulta [Animaciones](../../3d-modeling/animations.md) para detalles sobre cómo crear animaciones para un modelo 3D. Lee [Componentes de forma](shape-components.md) para instrucciones sobre cómo importar un modelo 3D a una escena.

{% hint style="info" %}
**💡 Consejo**: Las animaciones usualmente son mejores para mover algo en su lugar, no para cambiar la posición de una entidad. Por ejemplo, puedes establecer una animación para mover los pies de un personaje en su lugar, pero para cambiar la ubicación de la entidad es mejor usar el componente Transform. Consulta [Posicionar entidades](move-entities.md) para más detalles.
{% endhint %}

## Verificar un modelo 3D para animaciones

No todos los archivos _glTF_ incluyen animaciones. Para ver si hay alguna disponible, puedes hacer lo siguiente:

* Si usas [VS Code](https://code.visualstudio.com/)(recomendado), instala la extensión _GLTF Tools_ y visualiza el contenido de un archivo glTF allí.
* Abre el sitio [Babylon Sandbox](https://sandbox.babylonjs.com/) y arrastra el archivo glTF (y cualquier dependencia _.jpg_ o _.bin_) al navegador.
* Abre el archivo _.glTF_ con un editor de texto y desplázate hacia abajo hasta encontrar _"animations":_.

{% hint style="info" %}
**💡 Consejo**: En animaciones _esqueléticas_, el nombre de una animación a menudo está compuesto por el nombre de su armature, un guión bajo y el nombre de su animación. Por ejemplo `myArmature_animation1`.
{% endhint %}

## Reproducción automática

Si un modelo 3D incluye cualquier animación, el comportamiento predeterminado es que la primera de estas siempre se reproduce en loop.

Para evitar este comportamiento, agrega un componente `Animator` a la entidad que tiene el modelo, y luego maneja la reproducción de animaciones explícitamente. Si un componente `Animator` está presente en la entidad, todas las animaciones por defecto tienen un estado `playing: false`, y necesitan ser reproducidas manualmente.

{% hint style="info" %}
**💡 Consejo**: En el [Scene Editor](../../scene-editor/get-started/about-editor.md), puedes agregar un componente **Animator** visualmente. Consulta [Agregar Componentes](../../scene-editor/build/components.md#add-components). También puedes controlar animaciones de forma sin código a través de **Actions**, consulta [Hacer cualquier elemento inteligente](../../scene-editor/interactivity/smart-items.md).
{% endhint %}

## Manejar animaciones explícitamente

Un componente `Animator` se usa para acceder a todas las animaciones de la entidad y puede usarse para decirle explícitamente a la entidad que reproduzca o detenga una animación. El componente `Animator` incluye un array de `states`, esta lista debe incluir un objeto para cada una de las animaciones que el modelo 3D puede realizar. Un solo `Animator` puede incluir tantos estados como sean necesarios.

```ts
// Crear entidad
const shark = engine.addEntity()

// Agregar un modelo 3D a ella
GltfContainer.create(shark, {
	src: 'models/shark.glb',
})

Animator.create(shark, {
	states: [
		{
			clip: 'swim',
			playing: true,
			loop: true,
		},
	],
})
```

Cada objeto `state` hace un seguimiento de si una animación se está reproduciendo actualmente.

{% hint style="warning" %}
**📔 Nota**: El componente `Animator` debe importarse mediante

> `import { Animator } from "@dcl/sdk/ecs"`

Consulta [Importaciones](../../../creator/sdk7/getting-started/coding-scenes.md#imports) para saber cómo manejarlas fácilmente.
{% endhint %}

## Obtener una animación

Obtén un clip del `Animator` por nombre usando la función `.Animator.getClip()`. Esta función devuelve una versión mutable del objeto de estado de animación.

```ts
const swimAnim = Animator.getClip(sharkEntity, 'swim')
```

`Animator.getClip` requiere los siguientes parámetros:

* `entity`: La entidad del componente `Animator` que deseas consultar.
* `clipName`: String para el nombre del clip que deseas obtener.

`Animator.getClip` obtiene una versión mutable del estado de animación, por lo que puedes modificar valores libremente en lo que esta función devuelve.

```ts
const swimAnim = Animator.getClip(sharkEntity, 'swim')
swimAnim.looping = false
```

{% hint style="warning" %}
**📔 Nota**: Si intentas usar `Animator.getClip()` para obtener un clip que existe en el modelo 3D, pero no está listado en el componente `Animator`, devuelve `null`.
{% endhint %}

## Reproducir una animación

El campo `.playing` en un estado de animación determina si la animación se está reproduciendo actualmente. Ten en cuenta que múltiples animaciones pueden estar reproduciéndose en un solo modelo 3D al mismo tiempo.

Usa la función `Animator.playSingleAnimation()` en un objeto `AnimationState`.

```ts
Animator.playSingleAnimation(sharkEntity, 'swim')
```

Si la entidad estaba reproduciendo cualquier otra animación, `Animator.playSingleAnimation` las detiene.

`Animator.playSingleAnimation` requiere los siguientes parámetros:

* `entity`: La entidad del componente `Animator` que deseas afectar.
* `clipName`: String para el nombre del clip que deseas reproducir.
* `resetCursor`: _(opcional)_ Si _true_, reproduce la animación desde el inicio, incluso si la animación fue previamente pausada. Si _false_, continuará reproduciendo la animación desde donde fue pausada. Por defecto: _true_.

```ts
Animator.playSingleAnimation(sharkEntity, 'swim', false)
```

La siguiente tabla resume cómo se comporta `Animator.playSingleAnimation()`, usando diferentes valores para la propiedad `resetCursor`:

|                               | `reset` = _false_ (por defecto)                   | `reset` = _true_           |
| ----------------------------- | ------------------------------------------------- | -------------------------- |
| **Reproduciendo actualmente** | No tiene efecto.                                  | Reproduce desde el inicio. |
| **Pausado**                   | Se reanuda desde el último fotograma reproducido. | Reproduce desde el inicio. |
| **Terminado (sin loop)**      | Reproduce desde el inicio.                        | Reproduce desde el inicio. |

## Animaciones en loop

Por defecto, las animaciones se reproducen en un loop que mantiene repitiendo la animación para siempre.

Cambia esta configuración estableciendo la propiedad `loop` en el objeto `state`.

```ts
Animator.create(shark, {
	states: [
		{
			clip: 'bite',
			playing: true,
			loop: false,
		},
	],
})
```

Si `looping` está establecido en _false_, la animación se reproduce solo una vez y luego se detiene, quedando en la postura del último fotograma.

## Detener una animación

Para detener todas las animaciones que una entidad está reproduciendo, usa `Animator.stopAllAnimations()`.

```ts
Animator.stopAllAnimations(shark)
```

`Animator.stopAllAnimations` requiere los siguientes parámetros:

* `entity`: La entidad del componente `Animator` que deseas afectar.
* `resetCursor`: _(opcional)_ Si _true_, vuelve a la postura en el primer fotograma de la animación. Si _false_, se queda pausada en su postura actual. Por defecto: _true_.

{% hint style="warning" %}
**📔 Nota**: Al reproducir una animación con `Animator.playSingleAnimation`, esta función maneja detener todas las demás animaciones detrás de escena. No necesitas detener explícitamente otras animaciones en ese caso.
{% endhint %}

Cuando una animación termina de reproducir una animación sin loop, por defecto el modelo 3D permanece en la última postura que tenía. Para cambiar este comportamiento predeterminado para que cuando la animación termine vuelva a la primera postura, establece la propiedad `shouldReset` en _true_.

```ts
Animator.create(shark, {
	states: [
		{
			name: 'bite',
			clip: 'bite',
			playing: true,
			shouldReset: true,
			loop: true,
		},
	],
})
```

También puedes usar `Animator.stopAllAnimations()` en cualquier momento para establecer explícitamente la postura de vuelta al primer fotograma en la animación.

{% hint style="warning" %}
**📔 Nota**: Restablecer la postura es un cambio abrupto. Si deseas hacer que el modelo haga la transición suavemente a otra postura, puedes:
{% endhint %}

```
- aplicar una animación con una propiedad `weight` de 0 y aumentar gradualmente el `weight`
- crear un clip de animación que describa un movimiento desde la postura desde la que deseas hacer la transición hasta la postura predeterminada que deseas.
```

## Manejar múltiples animaciones

Si un modelo 3D tiene múltiples animaciones empaquetadas en él, un solo componente `Animator` puede lidiar con todas ellas.

```ts
// Crear entidad
const shark = engine.addEntity()

// Agregar un modelo 3D a ella
GltfContainer.create(shark, {
	src: 'models/shark.glb'
})

Animator.create(shark, {
	states:[{
			clip: "swim",
			playing: true,
			loop: true
		}. {
			clip: "bite",
			playing: true,
			loop: true
		}
	]
})
```

En el ejemplo anterior, dos animaciones son manejadas por objetos `state` separados, y luego ambos se asignan al mismo componente `Animator`.

Cada hueso en una animación solo puede ser afectado por una animación a la vez, a menos que estas animaciones tengan un `weight` que sume un valor de 1 o menos.

Si una animación solo afecta las piernas de un personaje, y otra solo afecta la cabeza de un personaje, entonces pueden reproducirse al mismo tiempo sin ningún problema. Pero si ambas afectan las piernas del personaje, entonces debes reproducir solo una a la vez, o reproducirlas con valores de `weight` más bajos.

Si en el ejemplo anterior, la animación `bite` solo afecta la boca del tiburón, y la animación `swim` solo afecta los huesos de la columna vertebral del tiburón, entonces ambas pueden reproducirse al mismo tiempo si están en capas separadas.

{% hint style="warning" %}
**📔 Nota**: `Animator.playSingleAnim()` detiene todas las demás animaciones que la entidad está reproduciendo actualmente. Para reproducir múltiples animaciones al mismo tiempo, modifica la propiedad `playing` en los estados de animación manualmente.
{% endhint %}

## Velocidad de animación

Cambia la velocidad a la que se reproduce una animación cambiando la propiedad `speed`. El valor de la velocidad es 1 por defecto.

```ts
Animator.create(shark, {
	states: [
		{
			clip: 'swim',
			playing: true,
			loop: true,
			speed: 2,
		},
	],
})
```

Establece la velocidad menor que 1 para reproducirla más lenta, por ejemplo a 0.5 para reproducirla a la mitad de la velocidad. Establécela mayor que 1 para reproducirla más rápido, por ejemplo a 2 para reproducirla al doble de la velocidad.

```ts
const swimAnim = Animator.getClip(sharkEntity, 'swim')

swimAnim.speed = 0.5
```

## Peso de animación

La propiedad `weight` permite a un solo modelo realizar múltiples animaciones en diferentes capas a la vez, calculando un promedio ponderado de todos los movimientos involucrados en la animación. El valor de `weight` determina cuánta importancia se le dará a esa animación en el promedio.

Por defecto, `weight` es igual a _1_. El valor de `weight` no puede ser mayor que _1_.

```ts
Animator.create(shark, {
	states: [
		{
			clip: 'swim',
			playing: true,
			loop: true,
			weight: 0.2,
		},
	],
})
```

El valor de `weight` de todas las animaciones activas en una entidad debe sumar 1 en todo momento. Si suma menos de 1, el promedio ponderado usará la posición predeterminada de la armature para la parte restante del cálculo.

Por ejemplo, en el ejemplo de código anterior, estamos reproduciendo la animación _swim_, que solo tiene un `weight` de _0.2_. Este movimiento de natación será bastante sutil: solo el 20% de la intensidad que define la animación. El 80% restante del cálculo toma valores de la postura predeterminada de la armature.

La propiedad `weight` puede usarse de maneras interesantes, por ejemplo la propiedad `weight` de _swim_ podría establecerse en proporción a qué tan rápido está nadando el tiburón, por lo que no necesitas crear múltiples animaciones para natación rápida y lenta.

También podrías cambiar el valor de `weight` gradualmente al iniciar y detener una animación para darle una transición más natural y evitar saltos desde la pose predeterminada a la primera pose en la animación.

{% hint style="warning" %}
**📔 Nota**: El valor de `weight` agregado de todas las animaciones que están actuando en el hueso de un modelo 3D no puede ser más de 1. Si más de una animación está afectando los mismos huesos al mismo tiempo, necesitan tener su weight establecido en valores que sumen menos de 1.
{% endhint %}

```ts
const swimAnim = Animator.getClip(sharkEntity, 'swim')

swimAnim.weight = 0.5
```
