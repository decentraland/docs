---
description: >-
  Aprende sobre los diferentes componentes que dan a las entidades su forma 3D y
  colisión
metaLinks:
  alternates:
    - >-
      https://app.gitbook.com/s/oPnXBby9S6MrsW83Y9qZ/scenes-sdk7/3d-essentials/colliders
---

# Colisionadores

Las entidades que tienen colisionadores ocupan espacio y bloquean el camino de un jugador, las entidades sin colisionadores pueden ser atravesadas por el avatar de un jugador.

Los colisionadores también son necesarios para hacer una entidad clickeable. Los eventos de botón se basan en la forma del colisionador de una entidad, no en su forma visible.

Hay capas de colisión separadas para interactuar con la física del jugador o con eventos de puntero, los colisionadores se pueden configurar para interactuar solo con uno o el otro. También se pueden configurar para interactuar con capas personalizadas, que se pueden usar con [raycasts](colliders.md) para manejar lo que tenga sentido para la escena.

{% hint style="warning" %}
**📔 Nota**: Los colisionadores no afectan cómo otras entidades interactúan entre sí, las entidades siempre pueden superponerse. La configuración de colisión solo afecta cómo la entidad interactúa con el avatar del jugador y eventos de botón. Decentraland no tiene un motor de física nativo, por lo que si deseas que las entidades caigan, choquen o reboten, debes codificar este comportamiento en la escena, o importar una biblioteca para manejar eso.
{% endhint %}

## Usar el Scene Editor

La forma más fácil de administrar los colisionadores de una entidad es usar el [Scene Editor](../../scene-editor/about-editor.md).

Puedes agregar un componente **Mesh Collider** a tu entidad para asignar una forma primitiva (cubo, plano, esfera, cilindro o cono) a tu entidad. Luego puedes elegir [Capas de colisión](colliders.md#collision-layers) de un menú desplegable.

También puedes configurar las capas de colisión en un componente **GLTF** para cambiar las [Capas de colisión](colliders.md#collision-layers) predeterminadas utilizadas en la geometría del colisionador o la geometría visible del modelo. Consulta [Agregar Componentes](../../scene-editor/components.md#add-components).



## Colisionadores en formas primitivas

El componente `MeshCollider` le da a una entidad un colisionador simple basado en una forma primitiva (cajas, esferas, planos, cilindros o conos).

Las entidades que tienen un componente `MeshRenderer` para darles una [forma primitiva](shape-components.md#primitive-shapes) no tienen colisionadores por defecto. También debes darle a la entidad un componente `MeshCollider`.

Las siguientes formas de colisionador están disponibles en `MeshCollider`. Varias formas incluyen campos adicionales opcionales, específicos para esa forma.

*   **box**:

    Usa `MeshCollider.setBox()`, pasando la entidad.
*   **plane**:

    Usa `MeshCollider.setPlane()`, pasando la entidad.
*   **sphere**:

    Usa `MeshCollider.setSphere()`, pasando la entidad.
*   **cylinder**:

    Usa `MeshCollider.setCylinder()`, pasando la entidad. Pasa `radiusTop` y `radiusBottom` como campos adicionales opcionales, para modificar el cilindro.

{% hint style="info" %}
**💡 Consejo**: Establece `radiusTop` o `radiusBottom` en 0 para hacer un cono.
{% endhint %}

Este ejemplo define una entidad de caja que no se puede atravesar.

```ts
// crear entidad
const myCollider = engine.addEntity()

// forma visible
MeshRenderer.setBox(myCollider)

// colisionador
MeshCollider.setBox(myCollider)
```

La forma utilizada por el `MeshCollider` no necesita coincidir necesariamente con la utilizada por el `MeshRenderer`. También puedes agregar un `MeshCollider` a una entidad que tiene un modelo 3D de un componente `GLTFContainer`, o a una entidad que no tiene forma visible en absoluto.

{% hint style="warning" %}
**📔 Nota**: El componente `MeshCollider` y `ColliderLayer` deben importarse mediante

> `import { MeshCollider, ColliderLayer } from "@dcl/sdk/ecs"`

Consulta [Importaciones](../getting-started/coding-scenes.md#imports) para saber cómo manejarlas fácilmente.
{% endhint %}

## Colisionadores en modelos 3D

Los modelos 3D pueden tener colisionadores asignados en dos niveles de geometría diferentes:

* `visibleMeshesCollisionMask`: Se refiere a la geometría visible del modelo. Por defecto, esta geometría no tiene colisionadores.
* `invisibleMeshesCollisionMask`: se refiere a los meshes de colisionador, cuyo nombre termina en `_collider`. Por defecto, esta geometría se trata como un colisionador tanto para física como para eventos de puntero.

Cualquier mesh incrustado como parte de un modelo 3D cuyo nombre termina en `_collider` se trata como parte de la capa `invisibleMeshesCollisionMask`, y se interpreta como un colisionador por defecto.

Definir la geometría del colisionador como una capa invisible separada permite un control mucho mayor y es mucho menos exigente en el sistema que usar la geometría visible, ya que el objeto de colisión suele ser mucho más simple (con menos vértices) que el modelo original.

Si un modelo no tiene ninguna geometría de colisionador, y deseas que afecte a la física o a los sistemas de eventos de puntero, puedes:

* Asignar capas de colisión directamente a la geometría visible, a través del `visibleMeshesCollisionMask`.

{% hint style="warning" %}
**📔 Nota**: Si la geometría visible del objeto tiene muchos vértices, ten en cuenta que esto puede tener más costo de rendimiento.
{% endhint %}

* Darle a la entidad un componente `MeshCollider`, para darle un colisionador de forma primitiva.
* Superponer una entidad invisible que tenga un componente `MeshCollider`.
* Editar el modelo en una herramienta externa como Blender para incluir un _mesh de colisionador_. El colisionador debe llamarse _x\_collider_, donde _x_ es el nombre del modelo. Entonces, para un modelo llamado _house_, el colisionador debe llamarse _house\_collider_.

Es posible que también desees asignar la capa de colisión de eventos de puntero al `visibleMeshesCollisionMask` en caso de que desees que las hints de hover y eventos de puntero respondan con más precisión al contorno de la entidad. Ten en cuenta que esto es más exigente en términos de rendimiento.

{% hint style="warning" %}
**📔 Nota**: Asegúrate de no tener la misma capa (física, eventos de puntero o capas personalizadas) asignada tanto a `visibleMeshesCollisionMask` como a `invisibleMeshesCollisionMask`, ya que eso sería un uso muy ineficiente de recursos. Puedes tener diferentes capas en cada una, como física en la capa invisible y eventos de puntero en la capa visible.
{% endhint %}

```ts
// crear entidad
const myEntity = engine.addEntity()

// asignar forma GLTF
GltfContainer.create(myEntity, {
	src: '/models/myModel.gltf',
	invisibleMeshesCollisionMask: ColliderLayer.CL_PHYSICS,
	visibleMeshesCollisionMask: ColliderLayer.CL_POINTER,
})
```

Consulta [modelos 3D](../../../creator/3d-modeling/3d-models/) para más detalles sobre cómo agregar geometría de colisionador invisible a un modelo 3D.

{% hint style="warning" %}
**📔 Nota**: El componente `GltfContainer` y `ColliderLayer` deben importarse mediante

> `import { GltfContainer, ColliderLayer } from "@dcl/sdk/ecs"`

Consulta [Importaciones](../getting-started/coding-scenes.md#imports) para saber cómo manejarlas fácilmente.
{% endhint %}

### Modelos animados

Al configurar colisionadores para usar la geometría visible en un modelo que incluye [animaciones basadas en armature](../../3d-modeling/animations.md), las animaciones no son seguidas por colisionadores. Los meshes de colisionador mantienen su forma original. Si una animación implica deformar la geometría de un mesh, los meshes de colisionador conservan la forma no animada mientras se reproduce la animación.

Al reproducir animaciones que implican mover meshes completos sin cambiar su forma, estos cambios se reflejan con precisión en los colisionadores. Por ejemplo, si una plataforma se mueve como parte de una animación, el colisionador de la plataforma sí se mueve con la animación.

## Capas de colisión

La escena puede manejar capas de colisión separadas, que tienen diferentes comportamientos.

Puedes configurar un componente `MeshCollider` o el componente `GltfContainer` para responder solo a un tipo de interacción, o a varias de ellas, o ninguna. Para hacer esto, en el `MeshCollider` establece la propiedad `collisionMask`, y en `GltfContainer` establece las propiedades `visibleMeshesCollisionMask` o `invisibleMeshesCollisionMask` a uno o varios de los siguientes valores:

* `ColliderLayer.CL_PHYSICS`: Solo bloquea el movimiento del jugador (y no afecta eventos de puntero)
* `ColliderLayer.CL_POINTER`: Responde solo a eventos de puntero (y no bloquea el movimiento del jugador)
* `ColliderLayer.CL_CUSTOM1` hasta `CL_CUSTOM8`: Se pueden usar junto con raycasts, para que un rayo solo detecte colisiones con una capa específica.
* `ColliderLayer.CL_NONE`: No responde a colisiones de ningún tipo.

{% hint style="warning" %}
**📔 Nota**: Para deshabilitar colisiones de un componente `MeshCollider`, elimina el componente. No establezcas la capa de colisión en `ColliderLayer.CL_NONE`. Hay un problema conocido con el componente `MeshCollider`. En lugar de deshabilitar todas las colisiones, hace que este valor sea equivalente al predeterminado (`ColliderLayer.CL_PHYSICS | ColliderLayer.CL_POINTER`).
{% endhint %}

```ts
// crear entidad
const myEntity = engine.addEntity()
// forma visible
MeshRenderer.setBox(myEntity)

// crear un componente MeshCollider que solo responde a física del jugador
MeshCollider.setBox(myEntity, ColliderLayer.CL_PHYSICS)
```

Una sola máscara de colisión puede responder a múltiples capas de colisión. Usa el carácter `|` como un _or_, para incluir tantas capas como necesites. El valor predeterminado en un MeshCollider es `ColliderLayer.CL_PHYSICS | ColliderLayer.CL_POINTER`.

```ts
MeshCollider.setBox(
	myEntity,
	ColliderLayer.CL_CUSTOM1 |
		ColliderLayer.CL_CUSTOM3 |
		ColliderLayer.CL_PHYSICS |
		ColliderLayer.CL_POINTER
)
```

Puedes usar las 8 capas personalizadas diferentes para lo que mejor se adapte a tu escena, por ejemplo una podría usarse para cálculos de línea de visión de NPC, mientras que otra para estimar trayectorias de objetos que caen. Usar diferentes capas para diferentes sistemas te permite usar menos recursos, ya que en cada caso solo estarás verificando colisiones con las entidades relevantes.

Consulta [Raycasting](../interactivity/raycasting.md) para más información sobre cómo usar capas de colisión personalizadas.

### Cámaras y colisionadores

Cuando la cámara de un jugador se mueve en modo de tercera persona, la cámara puede ser bloqueada por colisionadores o no, dependiendo de las capas de colisión asignadas a las entidades. Ten esto en cuenta al diseñar tu escena, es posible que desees evitar que la cámara atraviese paredes u otras entidades.

Para evitar que la cámara atraviese paredes, debes asignar tanto la capa `ColliderLayer.CL_PHYSICS` como la capa `ColliderLayer.CL_POINTER` a las entidades que deseas que bloqueen la cámara. Es importante que ambas capas estén asignadas a la misma geometría en la entidad. Entonces, si asignas la capa `ColliderLayer.CL_PHYSICS` a la capa visible de la entidad, también debes asignar la capa `ColliderLayer.CL_POINTER` a la misma geometría.

Por ejemplo, en el Creator Hub, la siguiente combinación de configuraciones evitará que la cámara atraviese paredes:



Tanto la capa `ColliderLayer.CL_PHYSICS` como la capa `ColliderLayer.CL_POINTER` están asignadas a la misma capa invisible de la geometría de la entidad. Si ambas estuvieran asignadas a la capa visible, el resultado sería el mismo. Este es el comportamiento predeterminado, tanto al agregar una entidad a través del Creator Hub como a través de código.



En este segundo ejemplo, la cámara puede atravesar la pared, porque la capa `ColliderLayer.CL_PHYSICS` está asignada a la capa invisible de la entidad, y la capa `ColliderLayer.CL_POINTER` está asignada a la capa visible de la entidad, incluso si ambas geometrías tienen la misma forma general.

```ts
// NO CÁMARA ATRAVESANDO LA PARED
// predeterminado (ambos puntero y física usan la geometría invisible)
GLTFContainer.create(myEntity, {
	src: '/models/myModel.gltf',
})

// NO CÁMARA ATRAVESANDO LA PARED
// Ambos usan la misma geometría invisible
GltfContainer.create(myEntity2, {
	src: '/models/myModel.gltf',
	invisibleMeshesCollisionMask: ColliderLayer.CL_PHYSICS | ColliderLayer.CL_POINTER,
})

// NO CÁMARA ATRAVESANDO LA PARED
// Ambos usan la misma geometría visible
GltfContainer.create(myEntity2, {
	src: '/models/myModel.gltf',
	visibleMeshesCollisionMask: ColliderLayer.CL_PHYSICS | ColliderLayer.CL_POINTER,
})

// SÍ CÁMARA ATRAVIESA LA PARED
// física y puntero están en capas diferentes
GltfContainer.create(myEntity2, {
	src: '/models/myModel.gltf',
	invisibleMeshesCollisionMask: ColliderLayer.CL_PHYSICS,
	visibleMeshesCollisionMask: ColliderLayer.CL_POINTER
})

// SÍ CÁMARA ATRAVIESA LA PARED
// física y puntero están en capas diferentes
GltfContainer.create(myEntity2, {
	src: '/models/myModel.gltf',
	invisibleMeshesCollisionMask: ColliderLayer.CL_POINTER,
	visibleMeshesCollisionMask: ColliderLayer.CL_PHYSICS
})
```

### Bloqueo de puntero

Solo las formas que tienen colisionadores pueden activarse con [eventos de puntero](../interactivity/click-events.md). Una entidad también necesita tener un colisionador para bloquear eventos de puntero que pasen a través de ella y evitar hacer clic en entidades detrás de ella. Entonces, por ejemplo, un jugador no puede recoger algo que está encerrado dentro de un cofre, si el cofre tiene colisionadores a su alrededor. Los eventos de puntero del jugador solo se ven afectados por meshes que están activos en la capa `ColliderLayer.CL_POINTER`.

Por defecto, un MeshCollider afecta tanto a las capas de Física como de Puntero, pero puedes cambiar este valor para afectar solo a una, o ninguna, y para afectar capas personalizadas en su lugar.

{% hint style="warning" %}
**📔 Nota**: Además de colisionadores, una entidad también necesita tener un componente `PointerEvents` para responder a eventos de puntero. Los helpers `pointerEventsSystem` también se encargan de este requisito.
{% endhint %}

```ts
// solo responde a física del jugador
// por ejemplo para una pared invisible que no puedes atravesar pero puedes hacer clic a través de ella
MeshCollider.setBox(myEntity, ColliderLayer.CL_PHYSICS)

// solo responde al puntero del jugador
// por ejemplo para un objeto que puedes hacer clic para recoger, pero puedes atravesar caminando
MeshCollider.setBox(myEntity2, ColliderLayer.CL_POINTER)
```

Por defecto, la geometría visible de un `GLTFContainer` no está mapeada a ninguna capa de colisión, pero la geometría invisible afecta tanto a las capas de Física como de Puntero. Puedes cambiar este valor para afectar solo a una, o ninguna, y para afectar capas personalizadas en su lugar. También puedes configurar la capa de geometría visible de la misma manera.

```ts
// predeterminado (ambos puntero y física usan la geometría invisible)
GLTFContainer.create(myEntity, {
	src: '/models/myModel.gltf',
})

// física del jugador usa la geometría invisible más simple
// eventos de puntero usan el contorno detallado completo de la geometría visible
GltfContainer.create(myEntity2, {
	src: '/models/myModel.gltf',
	invisibleMeshesCollisionMask: ColliderLayer.CL_PHYSICS,
	visibleMeshesCollisionMask: ColliderLayer.CL_POINTER,
})

// tanto física del jugador como eventos de puntero usan el contorno detallado completo de la geometría visible
// la geometría invisible más simple está mapeada a ColliderLayer.CL_NONE para evitar calcular ambas
GltfContainer.create(myEntity, {
	src: '/models/myModel.gltf',
	invisibleMeshesCollisionMask: ColliderLayer.CL_NONE,
	visibleMeshesCollisionMask:
		ColliderLayer.CL_POINTER | ColliderLayer.CL_PHYSICS,
})

// no responder a colisiones de ningún tipo, con la geometría visible o invisible:
GltfContainer.create(myEntity, {
	src: '/models/myModel.gltf',
	invisibleMeshesCollisionMask: ColliderLayer.CL_NONE,
})
```

## Sintaxis avanzada de MeshCollider

La sintaxis completa para crear un componente `MeshCollider`, sin ningún helper para simplificarlo, se ve así:

```ts
MeshCollider.create(myBox, {
	mesh: {
		$case: 'box',
		box: {},
	},
})

MeshCollider.create(myPlane, {
	mesh: {
		$case: 'plane',
		plane: {},
	},
})

MeshCollider.create(myShpere, {
	mesh: {
		$case: 'sphere',
		sphere: {},
	},
})

MeshCollider.create(myCylinder, {
	mesh: {
		$case: 'cylinder',
		cylinder: {},
	},
})
```

Así es como el protocolo base interpreta los componentes MeshCollider. Las funciones auxiliares abstraen esto y exponen una sintaxis más amigable, pero detrás de escena generan esta sintaxis.

El campo `$case` te permite especificar uno de los tipos permitidos. Cada tipo admite un conjunto diferente de parámetros.

Los valores compatibles para `$case` son los siguientes:

* `box`
* `plane`
* `sphere`
* `cylinder`

Dependiendo del valor de `$case`, es válido definir el objeto para la forma correspondiente, pasando las propiedades relevantes.
