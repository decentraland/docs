---
description: Aprende cómo manejar datos de solo lectura y mutables de los componentes
metaLinks:
  alternates:
    - >-
      https://app.gitbook.com/s/oPnXBby9S6MrsW83Y9qZ/scenes-sdk7/programming-patterns/mutable-data
---

# Datos Mutables

Al referenciar datos de un [componente](../architecture/entities-components.md), puedes obtener la versión mutable o de solo lectura (inmutable).

Siempre debes trabajar con las versiones de solo lectura de los datos cuando sea posible. Esta práctica puede traer una mejora muy significativa en el rendimiento de tu escena, cuando se compara con trabajar siempre con versiones mutables de esos mismos datos.

La función `.get()` en un componente devuelve una versión de solo lectura (inmutable) del componente. Solo puedes leer sus valores, pero no puedes cambiar ninguna de las propiedades en él.

La función `.getMutable()` devuelve una versión del componente que te permite cambiar sus valores. Usa versiones mutables solo cuando planees hacer cambios a un componente, de lo contrario, siempre usa `get()`.

```ts
// obtener una versión de solo lectura (inmutable)
const immutableTransform = Transform.get(myEntity)

// lo siguiente NO funciona:
// immutableTransform.position.y = 2

const mutableTransform = Transform.getMutable(myEntity)

// la siguiente línea SÍ cambia la posición de la entidad
mutableTransform.position.y = 2
```

Una buena práctica es iterar sobre componentes de solo lectura para verificar valores, y luego solo obtener la versión mutable de un componente individual cuando se requiere un cambio.

```ts
// altura máxima codificada
const MAX_HEIGHT = 10

// Definir el sistema
function HeightLimitSystem(dt: number) {
	// iterar sobre todas las entidades que tienen un componente Transform
	for (const [entity] of engine.getEntitiesWith(Transform)) {
		// obtener valores de solo lectura
		const currentHeight = Transform.get(entity).position.y

		// comparar valores
		if (currentHeight > MAX_HEIGHT) {
			// obtener versión mutable para hacer un cambio
			const mutableTransform = Transform.getMutable(entity)

			// cambiar transform
			mutableTransform.position.y = MAX_HEIGHT
		}
	}
}

// Agregar sistema al motor
engine.addSystem(HeightLimitSystem)
```

En el ejemplo anterior, un sistema verifica los valores de solo lectura del componente `Transform` de una entidad. En cada tick verifica si la posición _y_ es mayor que una altura máxima codificada. Si la altura en el transform resulta estar por encima de este límite, entonces y solo entonces obtenemos la versión mutable del Transform. Esto puede parecer trabajo extra para la escena, pero en una escena donde verificamos valores en cada tick del bucle del juego, y solo hacemos cambios ocasionalmente, resulta en enormes ganancias de rendimiento.

Esta práctica sigue los principios de la [programación orientada a datos](../architecture/data-oriented-programming.md). También está siendo adoptada gradualmente como una práctica estándar de la industria en los juegos, debido a cuánta mejora aporta.

{% hint style="warning" %}
**📔 Nota**: En versiones anteriores del SDK (6.x o anteriores), los componentes siempre se trataban como mutables. Ese patrón puede ser un poco más directo de aprender, pero era mucho menos eficiente de ejecutar.
{% endhint %}
