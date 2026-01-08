---
description: >-
  Aprende sobre los diferentes componentes que dan a las entidades su forma 3D y
  colisión
metaLinks:
  alternates:
    - >-
      https://app.gitbook.com/s/oPnXBby9S6MrsW83Y9qZ/scenes-sdk7/3d-essentials/shape-components
---

# Componentes de forma

Las escenas tridimensionales en Decentraland se basan en el modelo [Entity-Component](https://en.wikipedia.org/wiki/Entity%E2%80%93component%E2%80%93system), donde todo en una escena es una _entity_, y cada entidad puede incluir _components_ que dan forma a sus características y funcionalidad.

La forma renderizada de una entidad está determinada por el componente que usa.



## Usar el Scene Editor

La forma más fácil de darle una forma a una entidad es usar el [Scene Editor](../../scene-editor/about-editor.md). Puedes agregar un componente **Mesh Renderer** para proporcionar una forma primitiva, o un componente **GLTF** para hacer referencia a un modelo 3D desde un archivo. Consulta [Agregar Componentes](../../scene-editor/components.md#add-components).

## Formas primitivas

Varias formas básicas, a menudo llamadas _primitivas_, pueden agregarse a una entidad dándole a la entidad un componente `MeshRenderer`.

Las siguientes formas están disponibles. Varias formas incluyen campos adicionales opcionales, específicos para esa forma.

*   **box**:

    Usa `MeshRenderer.setBox()`, pasando la entidad. Pasa `uvs` como un campo adicional opcional, para mapear la alineación de texturas. Consulta [materiales](materials.md) para más detalles.
*   **plane**:

    Usa `MeshRenderer.setPlane()`, pasando la entidad. Pasa `uvs` como un campo adicional opcional, para mapear la alineación de texturas. Consulta [materiales](materials.md) para más detalles.
*   **sphere**:

    Usa `MeshRenderer.setSphere()`, pasando la entidad.
*   **cylinder**:

    Usa `MeshRenderer.setCylinder()`, pasando la entidad. Pasa `radiusTop` y `radiusBottom` como campos adicionales opcionales, para modificar el cilindro.

    CONSEJO: Establece `radiusTop` o `radiusBottom` en 0 para hacer un cono.

El siguiente ejemplo crea un cubo:

```ts
const myCube = engine.addEntity()

Transform.create(myCube, {
	position: Vector3.create(8, 1, 8),
})

MeshRenderer.setBox(myCube)
```

El siguiente ejemplo crea un cilindro con un `radiusTop` de 0, lo que produce un cono:

```ts
const myCone = engine.addEntity()

Transform.create(myCone, {
	position: Vector3.create(8, 1, 8),
})

MeshRenderer.setCylinder(myCone, 0, 1)
```

Las formas primitivas no incluyen materiales. Para darle un color o una textura, debes asignar un [componente de material](materials.md) a la misma entidad.

Para hacer una primitiva clickeable, o para evitar que los jugadores caminen a través de ella, debes darle a la entidad un _collider_ a través de un componente [MeshCollider](colliders.md).

Para cambiar la forma de una entidad que ya tiene un componente `MeshRenderer`, ejecuta `MeshRenderer.setBox()` o cualquiera de las otras funciones auxiliares y sobrescribirá la forma original. No hay necesidad de eliminar el `MeshRenderer` original o de usar la sintaxis avanzada.

```ts
const myCube = engine.addEntity()

Transform.create(myCube, {
	position: Vector3.create(8, 1, 8),
})

MeshRenderer.setBox(myCube)

// sobrescribir forma
MeshRenderer.setSphere(myCube)
```

{% hint style="warning" %}
**📔 Nota**: El componente `MeshRenderer` debe importarse mediante

> `import { MeshRenderer } from "@dcl/sdk/ecs"`

Consulta [Importaciones](../getting-started/coding-scenes.md#imports) para saber cómo manejarlas fácilmente.
{% endhint %}

## Modelos 3D

Para formas más complejas, puedes construir un modelo 3D en una herramienta externa como Blender y luego importarlos en _.glTF_ o _.glb_ (_.glTF_ binario). [glTF](https://www.khronos.org/gltf) (GL Transmission Format) es un proyecto abierto de Khronos que proporciona un formato común y extensible para activos 3D que es eficiente y altamente interoperable con las tecnologías web modernas.

Para agregar un modelo externo a una escena, agrega un componente `GltfContainer` a una entidad y establece su `src` a la ruta del archivo glTF que contiene el modelo.

```ts
const houseEntity = engine.addEntity()

GltfContainer.create(houseEntity, {
	src: 'models/House.gltf',
})
```

El campo `src` es obligatorio, debes darle un valor al construir el componente. En el ejemplo anterior, el modelo se encuentra en una carpeta `models` a nivel raíz de la carpeta del proyecto de la escena.

{% hint style="info" %}
**💡 Consejo**: Recomendamos mantener tus modelos separados en la carpeta `assets/scene/models` dentro de tu escena.
{% endhint %}

Los modelos glTF pueden incluir sus propias texturas, materiales, colisionadores y animaciones incrustadas. Consulta [modelos 3D](../../../creator/3d-modeling/3d-models/) para más información al respecto. Para anular los materiales de un modelo, usa el componente [GltfNodeModifiers](materials.md#modify-gltf-materials). Consulta [Modificar materiales glTF](materials.md#modify-gltf-materials) para más detalles.

Para evitar que los jugadores caminen a través de un modelo 3D, o para hacer un modelo clickeable, debes tener un [collider](colliders.md), que puede estar incrustado en el modelo o proporcionado a través de un componente `MeshCollider`.

Ten en cuenta que todos los modelos, sus shaders y sus texturas deben estar dentro de los parámetros de las [limitaciones de escena](../optimizing/scene-limitations.md).

{% hint style="warning" %}
**📔 Nota**: El componente `GltfContainer` debe importarse mediante

`import { GltfContainer } from "@dcl/sdk/ecs"`

Consulta [Importaciones](../getting-started/coding-scenes.md#imports) para saber cómo manejarlas fácilmente.
{% endhint %}

### Bibliotecas gratuitas para modelos 3D

En lugar de construir tus propios modelos 3D, también puedes descargarlos de varias bibliotecas gratuitas o de pago.

Para empezar, a continuación se muestra una lista de bibliotecas que tienen contenido gratuito o relativamente económico:

* [IWB Catalog](https://dcl-iwb.co/)
* [Asset Ovi](https://assetovi.com/)
* [Assets from the Builder](https://github.com/decentraland/builder-assets/tree/master/assets)
* [SketchFab](https://sketchfab.com/)
* [Clara.io](https://clara.io/)
* [Archive3D](https://archive3d.net/)
* [SketchUp 3D Warehouse](https://3dwarehouse.sketchup.com/)
* [Thingiverse](https://www.thingiverse.com/) (modelos 3D hechos principalmente para impresión 3D, pero adaptables a Mundos Virtuales)
* [ShareCG](https://www.sharecg.com/)
* [CGTrader](https://www.cgtrader.com/)

{% hint style="warning" %}
**📔 Nota**: Presta atención a las restricciones de licencia que tiene el contenido que descargas.
{% endhint %}

Ten en cuenta que en varios de estos sitios, puedes elegir en qué formato descargar el modelo. Siempre elige el formato _.glTF_ si está disponible. Si no está disponible, debes convertirlos a _glTF_ antes de poder usarlos en una escena. Para eso, recomendamos importarlos a Blender y exportarlos como _.glTF_ desde allí.

### Optimizar modelos 3D

Para asegurarte de que los modelos 3D en tu escena se carguen más rápido y ocupen menos memoria, sigue estas mejores prácticas:

* Guarda tus modelos en formato _.glb_, que es una versión más ligera de _.gltf_.
* Si tienes múltiples modelos que comparten las mismas texturas, exporta tus modelos con texturas en un archivo separado. De esa manera, múltiples modelos pueden referirse a un único archivo de textura que solo necesita cargarse una vez.
* Si tu escena tiene entidades que aparecen y desaparecen, puede ser una buena idea agrupar estas entidades y mantenerlas bajo tierra, o a una escala de 0. Esto ayudará a que aparezcan más rápido, el trade-off es que ocuparán memoria cuando no estén en uso. Consulta [entidades y componentes](../architecture/entities-components.md#pooling-entities-and-components)

## Estirar una forma

Las formas primitivas y los modelos 3D tienen dimensiones predeterminadas que puedes alterar cambiando la escala en el componente `Transform` de la entidad.

```ts
const primitiveEntity = engine.addEntity()

MeshRenderer.setBox(primitiveEntity)

Transform.create(primitiveEntity, {
	position: { x: 8, y: 1, z: 8 },
	scale: { x: 4, y: 0.5, z: 4 },
})
```

## Hacer invisible

Puedes hacer una entidad invisible dándole un `VisibilityComponent`, con su propiedad `visible` establecida en _false_.

```ts
const myEntity = engine.addEntity()
Transform.create(myEntity, {
	position: Vector3.create(4, 0, 4),
})
MeshRenderer.setBox(myEntity)

VisibilityComponent.create(myEntity, { visible: false })
```

El `VisibilityComponent` funciona igual para entidades con formas primitivas y con componentes `GLTFContainer`.

Si una entidad es invisible, su colisionador puede bloquear el camino de un jugador y/o prevenir hacer clic en entidades que están detrás de ella, dependiendo de las capas de colisión asignadas al colisionador.

## Estado de carga

Si un modelo 3D es bastante grande, puede tomar algo de tiempo notable para ser renderizado, este tiempo puede variar dependiendo del hardware del jugador y muchos otros factores. A veces necesitas asegurarte de que un modelo terminó de cargarse antes de realizar otra acción. Por ejemplo, si quieres teletransportar al jugador a una plataforma en el cielo, necesitas asegurarte primero de que la plataforma esté completamente renderizada antes de mover al jugador allí, o de lo contrario el jugador podría caer a través de la plataforma.

Para verificar si un modelo 3D terminó de renderizarse, verifica el componente `GltfContainerLoadingState` de la entidad. Este componente está destinado a ser de solo lectura, y existe en cualquier entidad que también tenga un componente `GltfContainer`.

Este componente tiene una sola propiedad llamada `currentState`, que contiene un valor del enum `LoadingState`.

El siguiente ejemplo usa un sistema para verificar periódicamente el estado de carga del modelo 3D de una entidad. Si el estado es `LoadingState.FINISHED`, es posible que desees realizar lógica personalizada allí y finalizar la ejecución del sistema.

```ts
export function main() {
	const meshEntity = engine.addEntity()
	GltfContainer.create(meshEntity, { src: 'models/Monster.glb' })
	engine.addSystem((deltaTime) => {
		const loadingState = GltfContainerLoadingState.getOrNull(meshEntity)
		if (!loadingState) return
		switch (loadingState.currentState) {
			case LoadingState.LOADING:
				console.log('mesh is LOADING')
				break
			case LoadingState.FINISHED:
				console.log('mesh is FINISHED')
				// Realizar lógica personalizada
				break
			case LoadingState.FINISHED_WITH_ERROR:
				console.log('mesh is FINISHED BUT MAY HAVE PROBLEMS')
				break
			case LoadingState.UNKNOWN:
				console.log('mesh is in an UNKNOWN STATE')
				break
		}
	})
}
```

## Sintaxis avanzada

La sintaxis completa para crear un componente `MeshRenderer`, sin ningún ayudante para simplificarlo, se ve así:

```ts
MeshRenderer.setBox(myBox, {
	mesh: {
		$case: 'box',
		box: { uvs: [] },
	},
})

MeshRenderer.create(myPlane, {
	mesh: {
		$case: 'plane',
		plane: { uvs: [] },
	},
})

MeshRenderer.create(myShpere, {
	mesh: {
		$case: 'sphere',
		sphere: {},
	},
})

MeshRenderer.create(myCylinder, {
	mesh: {
		$case: 'cylinder',
		cylinder: {},
	},
})
```

Así es como el protocolo base interpreta los componentes MeshRenderer. Las funciones auxiliares abstraen esto y exponen una sintaxis más amigable, pero detrás de escena generan esta sintaxis.

El campo `$case` te permite especificar uno de los tipos permitidos. Cada tipo admite un conjunto diferente de parámetros. En el ejemplo anterior, el tipo `box` admite un campo `uvs`.

Los valores compatibles para `$case` son los siguientes:

* `box`
* `plane`
* `sphere`
* `cylinder`

Dependiendo del valor de `$case`, es válido definir el objeto para la forma correspondiente, pasando las propiedades relevantes.

Para agregar un componente `MeshRenderer` a una entidad que potencialmente ya tiene una instancia de este componente, usa `MeshRenderer.createOrReplace()`. Las funciones auxiliares como `MeshRenderer.setBox()` manejan la sobrescritura de instancias existentes del componente, pero ejecutar `MeshRenderer.create()` en una entidad que ya tiene este componente devuelve un error.
