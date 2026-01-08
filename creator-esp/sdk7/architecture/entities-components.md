---
description: >-
  Aprende los fundamentos sobre entidades y componentes en una escena de
  Decentraland
metaLinks:
  alternates:
    - >-
      https://app.gitbook.com/s/oPnXBby9S6MrsW83Y9qZ/scenes-sdk7/architecture/entities-components
---

# Entidades & Componentes

Las escenas de Decentraland están construidas alrededor de [_entidades_, _componentes_ y _sistemas_](https://en.wikipedia.org/wiki/Entity%E2%80%93component%E2%80%93system). Este es un patrón común usado en la arquitectura de varios motores de juegos, que permite fácil composabilidad y escalabilidad.

### Descripción general

Las _Entidades_ son la unidad básica para construir todo en las escenas de Decentraland. Todos los objetos 3D visibles e invisibles y reproductores de audio en tu escena serán cada uno una entidad. Una entidad no es más que un id, que puede ser referenciado por componentes. La entidad en sí no tiene propiedades o métodos propios, simplemente sirve para agrupar varios componentes juntos.

Los _Componentes_ definen las características de una entidad. Por ejemplo, un componente `Transform` almacena las coordenadas, rotación y escala de la entidad. Un componente `MeshRenderer` le da a la entidad una forma visible (como un cubo o una esfera) cuando se renderiza en la escena, un componente `Material` le da a la entidad un color o textura. También puedes crear componentes personalizados para servir los datos requeridos por tu escena, por ejemplo un `health` personalizado podría almacenar el valor de salud restante de una entidad, y agregarlo a entidades que representan enemigos no jugadores en un juego.

Si estás familiarizado con el desarrollo web, piensa en las entidades como el equivalente de _Elementos_ en un árbol _DOM_, y en los componentes como _atributos_ de esos elementos.

En el [Editor de Escenas](../scene-editor/get-started/about-editor.md), puedes ver los componentes que pertenecen a una entidad seleccionándola.

{% hint style="warning" %}
**📔 Nota**: En versiones anteriores del SDK, las Entidades eran _objetos_ que se instanciaban, y podían extenderse para agregar funciones. A partir de la versión 7.0 del SDK, las entidades son solo un ID. Esta estructura se ajusta mejor a los principios de la [programación orientada a datos](../sdk7/architecture/data-oriented-programming.md) y puede ayudar en el rendimiento de la escena.
{% endhint %}

Los componentes como `Transform`, `Material` o cualquiera de los componentes de _forma_ están estrechamente vinculados con el renderizado de la escena. Si los valores en estos componentes cambian, eso solo es suficiente para que el motor cambie cómo se renderiza la escena en el siguiente fotograma.

El motor es la parte de la escena que se sitúa en el medio y gestiona todas las demás partes. Determina qué entidades se renderizan y cómo los jugadores interactúan con ellas. También coordina qué funciones de [sistemas](../sdk7/architecture/systems.md) se ejecutan y cuándo.

Los componentes están destinados a almacenar datos sobre su entidad referenciada. Solo pueden almacenar estos datos, no pueden modificar estos datos por sí mismos. Todos los cambios a los valores en los componentes son llevados a cabo por [Sistemas](../sdk7/architecture/systems.md). Los sistemas están completamente desacoplados de los componentes y entidades en sí. Las entidades y componentes son agnósticos a qué _sistemas_ están actuando sobre ellos.

### Sintaxis para entidades y componentes

El ejemplo a continuación muestra algunas operaciones básicas para declarar y configurar entidades y componentes básicos.

```ts
export function main() {
	// Crear una entidad
	const door = engine.addEntity()

	// Dar a la entidad una posición a través de un componente transform
	Transform.create(door, {
		position: Vector3.create(5, 1, 5),
	})

	// Dar a la entidad una forma visible a través de un componente GltfContainer
	GltfContainer.create(door)
}
```

{% hint style="warning" %}
**📔 Nota**: En versiones anteriores del SDK, era necesario agregar manualmente una entidad al motor para comenzar a renderizarla. A partir de la versión 7 del SDK, las entidades se agregan implícitamente al motor tan pronto como se les asigna un componente.
{% endhint %}

Cuando se crea un componente, siempre se asigna a una entidad padre. Los valores del componente luego afectan a la entidad.

### Eliminar entidades

Para eliminar una entidad del motor, usa `engine.removeEntity()`

```ts
export function main() {
	// Crear una entidad
	const door = engine.addEntity()

	// Dar a la entidad una forma visible a través de un componente GltfContainer
	GltfContainer.create(door)

	// Eliminar entidad
	engine.removeEntity(door)
}
```

Si una entidad eliminada tiene entidades hijas, estas cambian su padre de vuelta a la entidad predeterminada `engine.RootEntity`, que está posicionada en la posición base de la escena, con una escala de _1_.

Para eliminar una entidad y también todas sus hijas (y cualquier hija de sus hijas, recurrentemente), usa el helper `removeEntityWithChildren()`.

```ts
export function main() {
	// Crear entidad padre
	const door = engine.addEntity()

	// Crear entidad hija
	const doorKnob = engine.addEntity()

	// Dar a las entidades una forma visible
	GltfContainer.create(door, {
		src: 'models/door.glb',
	})
	GltfContainer.create(doorKnob, {
		src: 'models/doorKnob.glb',
	})

	// Parentar
	Transform.create(doorKnob, {
		parent: door,
	})

	// Eliminar tanto padre como hijas
	removeEntityWithChildren(engine, door)
}
```

{% hint style="info" %}
**💡 Tip**: En lugar de eliminar una entidad del motor, en algunos casos podría ser mejor hacerla invisible, en caso de que quieras poder cargarla nuevamente sin demora. Consulta [Hacer invisible](../sdk7/3d-essentials/shape-components.md#make-invisible)
{% endhint %}

#### Eliminar entidades detrás de escena

Una entidad es solo un id que es referenciado por sus componentes. Entonces, al eliminar una entidad realmente estás eliminando cada uno de los componentes que referencian esta entidad. Esto significa que si eliminas manualmente todos los componentes de una entidad, tendrá el mismo efecto que hacer `engine.removeEntity()`.

Una vez que los componentes de la entidad son eliminados, ese id de entidad está libre para ser referenciado por nuevos componentes como una entidad fresca nueva.

### Entidades anidadas

Una entidad puede tener otras entidades como hijas. Gracias a esto, podemos organizar entidades en árboles, igual que el HTML de una página web.

Para establecer una entidad como padre de otra, la entidad hija debe tener un componente `Transform`. Luego puedes establecer el campo `parent` con una referencia a la entidad padre.

```ts
export function main() {
	// Crear entidades
	const parentEntity = engine.addEntity()

	const childEntity = engine.addEntity()

	// Establecer padre
	Transform.create(childEntity, {
		parent: parentEntity,
	})
}
```

Una vez que se asigna un padre, puede leerse de la entidad hija desde el campo `parent` en su componente `Transform`.

```ts
// Obtener padre de una entidad
const parent = Transform.get(childEntity).parent
```

Si una entidad padre tiene un componente `Transform` que afecta su posición, escala o rotación, sus entidades hijas también son afectadas. Cualquier valor de posición o rotación se suma, cualquier valor de escala se multiplica.

Si la entidad padre o hija no tiene un componente `Transform`, se usan los siguientes valores predeterminados.

* Para **posición**, el centro del padre es _0, 0, 0_
* Para **rotación** la rotación del padre es el quaternion _0, 0, 0, 1_ (equivalente a los ángulos de Euler _0, 0, 0_)
* Para **escala**, el padre se considera que tiene un tamaño de _1_. Cualquier redimensionamiento del padre afecta la escala y posición en proporción.

Las entidades sin componente de forma son invisibles en la escena. Estas pueden usarse como envoltorios para manejar y posicionar múltiples entidades como un grupo.

Para separar una entidad hija de su padre, puedes asignar el padre de la entidad a `engine.RootEntity`.

```ts
const mutableChildTransform = Transform.getMutable(childEntity)
mutableChildTransform.parent = engine.RootEntity
```

{% hint style="warning" %}
**📔 Nota**: Al trabajar con entidades anidadas que están sincronizadas con otros jugadores, usa la función `parentEntity()` en lugar de la entidad `parent` en el Transform. Consulta [Entidades parentadas](../sdk7/networking/serverless-multiplayer.md#parented-entities)
{% endhint %}

En el [Editor de escenas](../scene-editor/get-started/about-editor.md), puedes ver toda la jerarquía de entidades anidadas en tu escena en el panel del lado izquierdo.

### Obtener una entidad por ID

Cada entidad en tu escena tiene un número _id_ único. Puedes recuperar un componente que se refiere a una entidad específica del motor basándote en este ID.

```typescript
// obtener un componente Transform
Transform.get(1000 as Entity)
```

{% hint style="warning" %}
**📔 Nota**: Los ids de entidad entre _0_ y _511_ están reservados por el motor para entidades fijas, como el avatar del jugador, la escena base, etc.
{% endhint %}

Por ejemplo, si el clic de un jugador o un [raycast](../sdk7/interactivity/raycasting.md) golpea una entidad, esto devolverá el id de la entidad golpeada, y puedes usar el comando anterior para obtener el componente Transform de la entidad que coincide con ese id. También puedes obtener cualquier otro componente de esa entidad de la misma manera.

### Obtener una entidad por nombre

Al agregar entidades a través de arrastrar y soltar en el [Editor de Escenas](../scene-editor/get-started/about-editor.md), cada entidad tiene un nombre único. Usa la función `engine.getEntityOrNullByName()` para referenciar una de estas entidades desde tu código. Pasa el nombre de la entidad como una cadena, como está escrito en la UI del Editor de Escenas, en la vista de árbol a la izquierda.

```ts
function main() {
	const door = engine.getEntityOrNullByName('door3')
}
```

{% hint style="warning" %}
**📔 Nota**: Asegúrate de usar `engine.getEntityOrNullByName()` solo dentro de la función `main()`, en funciones que se ejecutan después de `main()`, o en un sistema. Si se usa fuera de uno de esos contextos, las entidades creadas en la UI del [Editor de Escenas](../scene-editor/get-started/about-editor.md) pueden no estar instanciadas todavía.
{% endhint %}

Eres libre de realizar cualquier acción en una entidad obtenida a través de este método, como agregar o eliminar componentes, modificar valores de componentes existentes, o eliminar la entidad del motor.

```ts
function main() {
	// obtener entidad
	const door = engine.getEntityOrNullByName('door-3')
	// verificar que la entidad existe
	if (door) {
		// agregar un callback de eventos de puntero
		pointerEventsSystem.onPointerDown(
			{
				entity: door,
				opts: { button: InputAction.IA_PRIMARY, hoverText: 'Open' },
			},
			function () {
				// abrir puerta
			}
		)
	}
}
```

Todas las entidades agregadas a través de la UI del Editor de Escenas tienen un componente `Name`, puedes iterar sobre todas ellas así:

```ts
function main() {
	for (const [entity, name] of engine.getEntitiesWith(Name)) {
		console.log({ entity, name })
	}
}
```

### Agregar o reemplazar un componente

Cada entidad solo puede tener un componente de un tipo dado. Por ejemplo, si intentas asignar un Transform a una entidad que ya tiene uno, esto causará un error.

Para prevenir este error, puedes usar `.createOrReplace` en lugar de `.create`. Este comando sobrescribe cualquier componente existente del mismo tipo si existen, de lo contrario crea un nuevo componente como `.create`.

```ts
Transform.createOrReplace(door, {
	position: Vector3.create(5, 1, 5),
})
```

{% hint style="warning" %}
**📔 Nota**: Como `.createOrReplace` ejecuta una verificación adicional antes de crear el componente, siempre es más eficiente usar `.create`. Si estás seguro de que la entidad no tiene ya un componente como el que estás agregando, usa `.create`.
{% endhint %}

### Acceder a un componente de una entidad

Puedes acceder a componentes de una entidad usando las funciones `.get()` o `getMutable()` de la entidad.

```ts
export function main() {
	// Crear entidad
	const box = engine.addEntity()

	// Crear y agregar componente a esa entidad
	Transform.create(box)

	// Obtener versión de solo lectura del componente
	let transform = Transform.get(box)

	// Obtener versión mutable del componente
	let transform = Transform.getMutable(box)
}
```

La función `get()` obtiene una referencia de solo lectura al componente. No puedes cambiar valores desde esta referencia del componente.

Si deseas cambiar los valores del componente, usa la función `getMutable()` en su lugar. Si cambias los valores en la versión mutable del componente, estás afectando directamente a la entidad a la que pertenece ese componente.

Consulta [datos mutables](../sdk7/programming-patterns/mutable-data.md) para más detalles.

{% hint style="warning" %}
**📔 Nota**: Solo usa `getMutable()` si realmente vas a hacer cambios a los valores del componente. De lo contrario, siempre usa `get()`. Esta práctica sigue los principios de la [programación orientada a datos](../sdk7/architecture/data-oriented-programming.md), y puede ayudar significativamente en el rendimiento de la escena.
{% endhint %}

```ts
// Obtener versión mutable del componente
let transform = Transform.getMutable(box)

// cambiar un valor del componente
transform.scale.x = 5
```

El ejemplo anterior modifica directamente el valor de la escala _x_ en el componente Transform.

Si no estás completamente seguro de si la entidad tiene el componente que estás intentando recuperar, usa `getOrNull()` o `getMutableOrNull()`.

{% hint style="warning" %}
**📔 Nota**: Evita usar `getOrNull()` o `getMutableOrNull()` cuando sea posible, ya que estas funciones involucran verificaciones adicionales y por lo tanto son menos eficientes que `.get()` y `getMutable()`.
{% endhint %}

```ts
//  getOrNull
const transformOrNull = Transform.getOrNull(myEntity)

//  getMutableOrNull
const mutableTransformOrNull = Transform.getMutableOrNull(myEntity)
```

Si el componente que estás intentando recuperar no existe en la entidad:

* `get()` y `getMutable()` devuelven un error.
* `getOrNull()` y `getMutableOrNull()` devuelven `Null`.

### Eliminar un componente de una entidad

Para eliminar un componente de una entidad, usa el método `deleteFrom()` del tipo de componente de la entidad.

```ts
Transform.deleteFrom(myEntity)
```

Si intentas eliminar un componente que no existe en la entidad, esta acción no generará errores.

{% hint style="warning" %}
**📔 Nota**: Para eliminar todos los componentes de una entidad a la vez, consulta [esta sección](entities-components.md#remove-entities)
{% endhint %}

### Verificar un componente

Puedes verificar si una entidad posee una instancia de un cierto componente usando la función `has()`. Esta función devuelve _true_ si el componente está presente, y _false_ si no lo está. Esto puede ser muy útil para usar en lógica condicional en tu escena.

```ts
const hasTransform = Transform.has(myEntity)
```

{% hint style="info" %}
**💡 Tip**: También puedes [consultar componentes](../sdk7/architecture/querying-components.md) para obtener una lista completa de componentes que tienen un componente específico, o un conjunto específico de componentes. No iteres sobre todas las entidades en la escena manualmente para verificar cada una con un `has()`, ese enfoque es mucho menos eficiente.
{% endhint %}

### Verificar cambios en un componente

Usa la función `onChange` para ejecutar una función callback cada vez que los valores del componente cambien para una entidad dada. Esto funciona en cualquier componente, y es un gran atajo para ayudar a mantener tu código legible.

La función callback puede incluir un parámetro de entrada que contiene el nuevo estado del componente.

```ts
Transform.onChange(cubeEntity, (newTransform) => {
	if (!newTransform) return
	console.log(
		'Posición del cubo cambió: ',
		newTransform.position,
		newTransform.rotation
	)
})

VisibilityComponent.onChange(cubeEntity, (newVisibilityComponent) => {
	if (!newVisibilityComponent) return
	console.log('Visibilidad del cubo cambió: ', newVisibilityComponent.visible)
})
```

Si el componente es eliminado de la entidad, entonces la función es llamada con una entrada de `undefined`.

{% hint style="warning" %}
**📔 Nota**: La función `.onChange()` actualmente solo funciona con componentes nativos del SDK, no funciona con [componentes personalizados](../sdk7/architecture/custom-components.md) definidos por el creador.
{% endhint %}

### Entidades reservadas

Ciertos ids de entidad están reservados para entidades especiales que existen en cada escena. Pueden accederse a través de los siguientes alias:

* `engine.RootEntity`
* `engine.PlayerEntity`
* `engine.CameraEntity`

{% hint style="warning" %}
**📔 Nota**: Evita referirte a estas entidades antes de que se inicialicen. Para evitar este problema, refiérete a estas entidades en la función `main()`, o en un sistema.
{% endhint %}

### La entidad raíz

Todas las entidades en la escena son hijas de `engine.RootEntity`, directa o indirectamente.

### La entidad jugador

La entidad `engine.PlayerEntity` representa el avatar del jugador. Obtén el componente `Transform` del jugador para obtener la posición y rotación actual del jugador, consulta [datos del usuario](../sdk7/interactivity/user-data.md). También puedes modificar este Transform para mover al jugador, consulta [mover jugador](../sdk7/interactivity/move-player.md).

### La entidad cámara

La entidad `engine.CameraEntity` representa la cámara del jugador. Obtén el componente `Transform` de la cámara para obtener la posición y rotación de la cámara. También puedes obtener el componente `CameraMode` de la cámara para saber si el jugador está usando el modo de cámara en primera o tercera persona, consulta [modo de cámara](../sdk7/interactivity/user-data.md#check-the-players-camera-mode).
