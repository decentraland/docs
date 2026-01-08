---
description: >-
  Crea un componente personalizado para manejar datos específicos relacionados
  con una entidad
metaLinks:
  alternates:
    - >-
      https://app.gitbook.com/s/oPnXBby9S6MrsW83Y9qZ/scenes-sdk7/architecture/custom-components
---

# Componentes Personalizados

Los datos sobre una entidad se almacenan en sus [componentes](../sdk7/architecture/entities-components.md). El SDK de Decentraland proporciona una serie de componentes base que gestionan diferentes aspectos sobre una entidad, como su posición, forma, material, etc. El motor sabe cómo interpretar la información en estos, y cambiará cómo se renderiza la entidad en consecuencia tan pronto como cambien sus valores.

Si la lógica de tu escena requiere almacenar información sobre una entidad que no es manejada por los componentes predeterminados del SDK, entonces puedes crear un tipo personalizado de componente en tu escena. Luego puedes construir [sistemas](../sdk7/architecture/systems.md) que verifiquen cambios en estos componentes y respondan en consecuencia.

### Acerca de definir componentes

Para definir un nuevo componente, usa `engine.defineComponent`. Cada componente necesita lo siguiente:

* Un **componentName**: Un identificador de cadena único que el SDK usa internamente para identificar este tipo de componente. Puede ser cualquier cadena, siempre que sea única.
* Un **schema**: Una clase que define la estructura de datos contenida por el componente.
* **valores predeterminados** _(opcional)_: Un objeto que contiene valores predeterminados para usar al inicializar una copia del componente, cuando estos no son proporcionados.

```ts
export const WheelSpinComponent = engine.defineComponent('wheelSpinComponent', {
	spinning: Schemas.Boolean,
	speed: Schemas.Float,
})
```

{% hint style="warning" %}
**📔 Nota**: Los Componentes Personalizados siempre deben escribirse fuera de la función `main()`, en un archivo separado. Necesitan ser interpretados antes de que se ejecute `main()`. El lugar recomendado para esto es en una carpeta `/components` dentro de `/src`, cada uno en su propio archivo. De esa manera es más fácil reutilizarlos en proyectos futuros.
{% endhint %}

Una vez que definas un componente personalizado, puedes crear instancias de este componente, que referencian entidades en la escena. Cuando creas una instancia de un componente, proporcionas valores a cada uno de los campos en el esquema del componente. Los valores deben cumplir con los tipos declarados de cada campo.

```ts
// Crear entidades
const wheel = engine.addEntity()
const wheel2 = engine.addEntity()

// Crear instancias del componente
WheelSpinComponent.create(wheel, {
	spinning: true,
	speed: 10,
})

WheelSpinComponent.create(wheel2, {
	spinning: false,
	speed: 0,
})
```

Cada entidad que tiene el componente agregado instancia una nueva copia del componente, conteniendo datos específicos para esa entidad.

Tu componente personalizado también puede realizar las otras funciones comunes que están disponibles en otros componentes:

```ts
// Obtener una instancia de solo lectura del componente de una entidad
const readOnlyInstance = MyCustomComponent.get(myEntity)

// Obtener una instancia mutable del componente de una entidad
const mutableInstance = MyCustomComponent.getMutable(myEntity)

// Eliminar la instancia del componente de una entidad
MyCustomComponent.deleteFrom(myEntity)

```

### Acerca del componentName

Cada componente debe tener un nombre de componente o identificador único, que lo diferencia internamente. No necesitarás usar este identificador interno en ningún otro lugar de tu código. Una buena práctica es usar el mismo nombre que asignas al componente, pero comenzando con una letra minúscula, pero todo lo que realmente importa es que este identificador sea único dentro del proyecto.

Al crear componentes que se compartirán como parte de una librería, ten en cuenta que los nombres de componentes en tu librería no deben superponerse con ningún nombre de componente en el proyecto donde se está usando, o en otras librerías que también son usadas por ese proyecto. Para evitar el riesgo de cualquier superposición, la mejor práctica recomendada es incluir el nombre de la librería como parte de la cadena `componentName`. Puedes seguir esta fórmula: `${packageName}::${componentName}`. Por ejemplo, si construyes una librería `MyUtilities` que incluye un componente `MoveEntity`, establece el `componentName` de ese componente como `MyUtilities::moveEntity`.

### Componentes como banderas

Puede que quieras agregar un componente que simplemente marque una entidad para diferenciarla de otras, sin usarlo para almacenar datos. Para hacer esto, deja el esquema como un objeto vacío.

Esto es especialmente útil cuando usas [consultas de componentes](../sdk7/architecture/querying-components.md). Un componente de bandera simple puede usarse para diferenciar entidades de otras, y evitar que el sistema itere sobre más entidades de las necesarias.

```ts
export const IsEnemyFlag = engine.defineComponent('isEnemyFlag', {})
```

Luego puedes crear un sistema que itere sobre todas las entidades con este componente.

```ts
export function handleEnemies() {
	for (const [entity] of engine.getEntitiesWith(IsEnemyFlag)) {
		// hacer algo en cada entidad
	}
}

engine.addSystem(handleEnemies)
```

### Esquemas de Componentes

Un esquema describe la estructura de los datos dentro de un componente. Un componente puede almacenar tantos campos como quieras, cada uno debe incluirse en la estructura del esquema. El esquema puede incluir tantos niveles de ítems anidados como necesites.

Cada campo en el esquema debe incluir una declaración de tipo. Solo puedes usar los tipos de esquema especiales proporcionados por el SDK. Por ejemplo, usa el tipo `Schemas.Boolean` en lugar del tipo `boolean`. Escribe `Schemas.` y tu IDE mostrará todas las opciones disponibles.

```ts
export const WheelSpinComponent = engine.defineComponent('WheelSpinComponent', {
	spinning: Schemas.Boolean,
	speed: Schemas.Float,
})
```

El ejemplo anterior define un componente cuyo esquema contiene dos valores, un booleano `spinning` y un número de punto flotante `speed`.

Puedes elegir crear el esquema en línea mientras defines el componente, o para mayor legibilidad puedes crearlo y luego referenciarlo.

```ts
// Opción 1: Definición en línea
export const WheelSpinComponent = engine.defineComponent('WheelSpinComponent', {
	spinning: Schemas.Boolean,
	speed: Schemas.Float,
})

// Opción 2: definir esquema y componente por separado

//// esquema
const mySchema = {
	spinning: Schemas.Boolean,
	speed: Schemas.Float,
}

//// componente
export const WheelSpinComponent = engine.defineComponent(
	'WheelSpinComponent',
	mySchema
)
```

{% hint style="info" %}
**💡 Tip**: Al crear una instancia de un componente, las opciones de autocompletado de VS Studio sugerirán qué campos puedes agregar al componente presionando _Ctrl + Espacio_.
{% endhint %}

#### Tipos de Schema predeterminados

Los siguientes tipos básicos están disponibles para usar dentro de los campos de un esquema:

* `Schemas.Boolean`
* `Schemas.Byte`
* `Schemas.Double`
* `Schemas.Float`
* `Schemas.Int`
* `Schemas.Int64`
* `Schemas.Number`
* `Schemas.Short`
* `Schemas.String`
* `Schemas.Entity`

Los siguientes tipos complejos también existen. Cada uno incluye una serie de propiedades anidadas con valores numéricos.

* `Schemas.Vector3`
* `Schemas.Quaternion`
* `Schemas.Color3`
* `Schemas.Color4`

{% hint style="info" %}
**💡 Tip**: Consulta [Tipos de geometría](../sdk7/3d-essentials/special-types.md) y [Tipos de color](../sdk7/3d-essentials/color-types.md) para más detalles sobre cómo estos tipos de datos son útiles.
{% endhint %}

Por ejemplo, puedes usar estos tipos de esquema en un componente como este para rastrear el movimiento gradual de una entidad. Este componente almacena una posición inicial y final como valores Vector3, así como una velocidad y fracción de la ruta completada como números flotantes. Consulta [Mover entidades](../sdk7/3d-essentials/move-entities.md#move-between-two-points) para la implementación completa de este ejemplo.

```ts
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
```

#### Tipos de arreglo

Para establecer el tipo de un campo como un arreglo, usa `Schemas.Array()`. Pasa el tipo de los elementos en el arreglo como una propiedad.

```ts
const MySchema = {
	numberList: Schemas.Array(Schemas.Int),
}
```

#### Tipos de esquema anidados

Para establecer el tipo de un campo como un objeto, usa `Schemas.Map()`. Pasa el contenido de este objeto como una propiedad. Este objeto anidado es esencialmente un esquema en sí mismo, anidado dentro del esquema padre.

```ts
const MySchema = {
	simpleField: Schemas.Boolean,
	myComplexField: Schemas.Map({
		nestedField1: Schemas.Boolean,
		nestedField2: Schemas.Boolean
	})}
}
```

Alternativamente, para mantener las cosas más legibles y reutilizables, podrías lograr lo mismo definiendo el esquema anidado por separado, luego referenciándolo al definir el esquema padre.

```ts
const MyNestedSchema = Schemas.Map({
	nestedField1: Schemas.Boolean,
	nestedField2: Schemas.Boolean,
})

const MySchema = {
	simpleField: Schemas.Boolean,
	myComplexField: MyNestedSchema,
}
```

#### Tipos Enums

Puedes establecer el tipo de un campo en un esquema como un enum. Los enums facilitan la selección entre un número finito de opciones, proporcionando valores legibles para cada uno.

Para establecer el tipo de un campo como un enum, primero debes definir el enum. Luego puedes referirte a él usando `Schemas.EnumNumber` o `Schemas.EnumString`, dependiendo del tipo de enum. Debes pasar el enum a referenciar entre `<>`, así como el tipo como parámetro (ya sea `Schemas.Int` para enums numéricos, o `Schemas.String` para enums de cadena). También debes pasar un valor predeterminado para usar en este campo.

```ts
//// String enum

// Definir enum
enum Color {
	Red = 'red',
	Green = 'green',
	Pink = 'pink',
}

// Definir un componente que usa este enum en un campo
const ColorComponent = engine.defineComponent('Color', {
	color: Schemas.EnumString<Color>(Color, Color.Red),
})

// Usar componente en una entidad
ColorComponent.create(engine.addEntity(), { color: Color.Green })

//// Number enum

// Definir enum
enum CurveType {
	LINEAR,
	EASEIN,
	EASEOUT,
}

// Definir un componente que usa este enum en un campo
const CurveComponent = engine.defineComponent('curveComponent', {
	curve: Schemas.EnumNumber<CurveType>(CurveType, CurveType.LINEAR),
})

// Usar componente en una entidad
CurveComponent.create(engine.addEntity(), { curve: CurveType.EASEIN })
```

#### Tipos intercambiables

Puedes establecer el tipo de un campo en un esquema para seguir un patrón `oneOf`, donde se pueden aceptar diferentes tipos.

```ts
const MySchema = {
	myField: Schemas.OneOf({ type1: Schemas.Vector3, type2: Schemas.Quaternion }),
}

export const MyComponent = engine.defineComponent('MyComponent', MySchema)
```

Al crear una instancia del componente, necesitas especificar el tipo seleccionado con un `$case`, por ejemplo:

```ts
MyComponent.create(myEntity, {
	myField: {
		$case: 'type1',
		value: Vector3.create(1, 1, 1)
	}
})
```

### Valores predeterminados

A menudo es bueno tener valores predeterminados en tus componentes, para que no sea necesario establecer explícitamente cada valor cada vez que crees una nueva copia.

La función `engine.defineComponent()` toma un tercer argumento, que te permite pasar un objeto con valores para usar por defecto. Este objeto puede incluir algunos o todos los valores en el esquema. Los valores que no se proporcionan en los valores predeterminados necesitarán proporcionarse siempre al inicializar una copia del componente.

```ts
// Definición

//// esquema
const mySchema = {
	spinning: Schemas.Boolean,
	speed: Schemas.Float,
}

//// valores predeterminados
const myDefaultValues = {
	spinning: true,
	speed: 1,
}

//// componente
export const WheelSpinComponent = engine.defineComponent(
	'WheelSpinComponent',
	mySchema,
	myDefaultValues
)

// Uso
export function main() {
	//// Crear entidades
	const wheel = engine.addEntity()
	const wheel2 = engine.addEntity()

	//// inicializar componente usando valores predeterminados
	WheelSpinComponent.create(wheel)

	//// inicializar componente con un valor personalizado, usando el predeterminado para cualquier otro
	WheelSpinComponent.create(wheel2, { speed: 5 })
}
```

El ejemplo anterior crea un componente `WheelSpinComponent` que incluye tanto un esquema como un conjunto de valores predeterminados para usar. Si luego inicializas una copia de este componente sin especificar valores, usará los establecidos en el predeterminado.

### Suscribirse a cambios

Un caso de uso común es solo ejecutar una función en caso de que los datos en un cierto componente cambien. Usa la función [OnChange](../sdk7/architecture/subscribe-to-changes.md) para evitar tener que definir un sistema y tener que comparar explícitamente valores antiguos con valores nuevos.

```ts
export function main() {
	//Crear entidad, etc

	WheelSpinComponent.onChange(myEntity, (componentData) => {
		if (!componentData) return
		console.log(componentData.speed)
		console.log(componentData.spinning)
	})
}
```

### Construir sistemas para usar un componente

Con tu componente definido y agregado a entidades en tu escena, puedes crear [Sistemas](../sdk7/architecture/systems.md) para realizar lógica, haciendo uso de estos datos almacenados en el componente.

```ts
// definir componente
export const WheelSpinComponent = engine.defineComponent('WheelSpinComponent', {
	spinning: Schemas.Boolean,
	speed: Schemas.Float,
})

// Uso
export function main() {
	// Crear entidades
	const wheel1 = engine.addEntity()
	const wheel2 = engine.addEntity()

	// Crear instancias del componente
	WheelSpinComponent.create(wheel1, {
		spinning: true,
		speed: 10,
	})

	WheelSpinComponent.create(wheel2, {
		spinning: false,
		speed: 0,
	})
}

// Definir un sistema para iterar sobre estas entidades
export function spinSystem(dt: number) {
	// iterar sobre todas las entidades con un WheelSpinComponent
	for (const [entity, wheelSpin] of engine.getEntitiesWith(
		WheelSpinComponent
	)) {
		// solo hacer algo si spinning == true
		if (wheelSpin.spinning) {
			// obtener un componente Transform mutable
			const transform = Transform.getMutable(entity)

			// actualizar el valor de rotación en consecuencia
			transform.rotation = Quaternion.multiply(
				transform.rotation,
				Quaternion.fromAngleAxis(dt * wheelSpin.speed, Vector3.Up())
			)
		}
	}
}

// Agregar sistema al motor
engine.addSystem(spinSystem)
```

El ejemplo anterior define un sistema que itera sobre todas las entidades que incluyen el `wheelSpinComponent` personalizado, y las rota ligeramente en cada tick del bucle del juego. La cantidad de esta rotación es proporcional al valor `speed` almacenado en la instancia del componente de cada entidad. El ejemplo hace uso de [consultas de componentes](../sdk7/architecture/querying-components.md) para obtener solo las entidades relevantes.
