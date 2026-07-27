---
description: Cómo establecer la posición, rotación y escala de una entidad en una escena
metaLinks:
  alternates:
    - >-
      https://app.gitbook.com/s/oPnXBby9S6MrsW83Y9qZ/scenes-sdk7/3d-essentials/entity-positioning
---

# Establecer posiciones de entidades

Puedes establecer la _posición_, _rotación_ y _escala_ de cualquier entidad usando el componente `Transform`. Esto se puede usar en cualquier entidad en el espacio 3D, afectando dónde se renderiza la entidad. Esto incluye formas primitivas (cubo, esfera, plano, etc), formas de texto 3D, formas NFT y modelos 3D (`GltfContainer`).

## Usar el Scene Editor

Al agregar un elemento a tu escena a través del [Scene Editor](../../scene-editor/about-editor.md), incluye implícitamente un componente **Transform**. Luego cambias los valores en el componente Transform de la entidad implícitamente al cambiar la posición, rotación o escala de una entidad. También puedes usar la UI del Scene Editor para proporcionar valores numéricamente para mayor precisión.

## Fundamentos de código



```ts
// Crear una nueva entidad
const ball = engine.addEntity()

// Darle a esta entidad una forma, para hacerla visible
MeshRenderer.setSphere(ball)

// Darle a esta entidad un componente Transform
Transform.create(ball, {
	position: Vector3.create(5, 1, 5),
	scale: Vector3.create(1, 1, 1),
	rotation: Quaternion.Zero(),
})
```

Para mover, rotar o cambiar el tamaño de una entidad en tu escena durante un período de tiempo, cambia los valores en este componente incrementalmente, fotograma por fotograma. Consulta [Mover entidades](move-entities.md) para más detalles y mejores prácticas.

{% hint style="warning" %}
**📔 Nota**: `Vector3` y `Quaternion` deben importarse mediante

> `import { Vector3, Quaternion } from "@dcl/sdk/math"`

Consulta [Importaciones](../getting-started/coding-scenes.md#imports) para saber cómo manejarlas fácilmente.
{% endhint %}

## Posición

`position` es un _vector 3D_, establece la posición del centro de la entidad en los tres ejes, _x_, _y_, y _z_. Consulta [Tipos de geometría](special-types.md) para más detalles.

```ts
// Crear una nueva entidad
const ball = engine.addEntity()

// Crear transform con una posición predefinida
Transform.create(ball, {
	  position: Vector3.create(5, 1, 5)
}

// Obtener una versión mutable del transform
const mutableTransform = Transform.getMutable(ball)

// Establecer la posición con un objeto
mutableTransform.position = { x: 5, y: 1, z: 5 }

// Establecer la posición con un objeto (sintaxis alternativa)
mutableTransform.position = Vector3.create(2, 1, 4)

// Establecer cada eje individualmente
mutableTransform.position.x = 3
mutableTransform.position.y = 1
mutableTransform.position.z = 3
```

Al establecer una posición, ten en cuenta las siguientes consideraciones:

* Los números en un vector de posición representan _metros_ (a menos que la entidad sea hija de una entidad escalada).
* Una escena que está compuesta por una sola parcela mide 16m x 16m. El centro de la escena (a nivel del suelo) está en `x:8, y:0, z:8`. Si la escena está compuesta por múltiples parcelas, entonces el centro variará dependiendo de su disposición.
*   `x:0, y:0, z:0` se refiere a la esquina _Suroeste_ de la parcela base de la escena, a nivel del suelo.

    > Consejo: Al ver una vista previa de la escena, aparece una brújula en el punto (0,0,0) de la escena con etiquetas para cada eje como referencia.

    > Nota: Puedes cambiar la parcela base de una escena editando el atributo `base` de _scene.json_.
* Para orientarte mejor, usa tu mano _izquierda_:
  * tu dedo índice (apuntando hacia adelante) es el eje _z_
  * tu dedo medio (apuntando hacia el lado) es el eje _x_
  * tu pulgar (apuntando hacia arriba) es el eje _y_.
* Si una entidad es hija de otra, entonces `x:0, y:0, z:0` se refiere al centro de su entidad padre, dondequiera que esté en la escena.
*   Cada entidad en tu escena debe estar posicionada dentro de los límites de las parcelas que ocupa en todo momento. Si una entidad sale de estos límites, generará un error.

    > Consejo: Al ver una escena en modo de vista previa, las entidades que están fuera de límites se resaltan en _rojo_.
* Tu escena también está limitada en altura. Cuantas más parcelas componen la escena, más alto puedes construir. Consulta [limitaciones de escena](../optimizing/scene-limitations.md) para más detalles.

## Rotación

`rotation` se almacena como un [_quaternion_](https://en.wikipedia.org/wiki/Quaternion), un sistema de cuatro números, _x_, _y_, _z_ y _w_. Cada uno de estos números va de 0 a 1. Consulta [Tipos de geometría](special-types.md) para más detalles.

```ts
// Crear una nueva entidad
const cube = engine.addEntity()

// Crear transform con una rotación predefinida de 0
Transform.create(cube, {
	  rotation: Quaternion.Zero()
}

// Obtener una versión mutable del transform
const mutableTransform = Transform.getMutable(cube)

// Establecer la rotación con un objeto, desde ángulos euler
mutableTransform.rotation = Quaternion.fromEulerDegrees(0, 90, 0)

// Establecer la rotación con un objeto
mutableTransform.rotation = { x: 0.1, y: 0.5, z: 0.5, w: 0 }

// Establecer cada eje individualmente
mutableTransform.rotation.x = 0
mutableTransform.rotation.y = 1
mutableTransform.rotation.z = 0.3
mutableTransform.rotation.w = 0
```

También puedes establecer el campo de rotación con ángulos [_Euler_](https://en.wikipedia.org/wiki/Euler_angles), la notación más común de _x_, _y_ y _z_ con números que van de 0 a 360 con la que la mayoría de la gente está familiarizada. Para usar ángulos Euler, usa una de las siguientes notaciones:

```ts
// Crear transform con una rotación predefinida en ángulos Euler
Transform.create(cube, {
	  rotation: Quaternion.fromEulerDegrees(0, 90, 0)
}

// Obtener una versión mutable del transform
const mutableTransform = Transform.getMutable(cube)

// Establecer la rotación con un objeto, desde ángulos euler
mutableTransform.rotation = Quaternion.fromEulerDegrees(0, 90, 0)
```

Cuando usas un _vector 3D_ para representar ángulos Euler, _x_, _y_ y _z_ representan la rotación en ese eje, medida en grados. Un giro completo requiere 360 grados.

Cuando obtienes la rotación de una entidad, devuelve un quaternion por defecto. Para obtener la rotación expresada en ángulos Euler, usa `.toEuler()`:

```ts
// Obtener una versión de solo lectura del transform
const transform = Transform.getMutable(cube)

// Establecer la rotación con un objeto, desde ángulos euler
const eulerAngle = Quaternion.toEuler(transform.rotation)
```

## Mirar al jugador

Agrega un componente _Billboard_ a una entidad para que siempre rote para mirar al jugador.

Los billboards eran una técnica común utilizada en juegos 3D de los 90, donde la mayoría de las entidades eran planos 2D que siempre miraban al jugador. La misma idea también se puede usar para rotar un modelo 3D.

```ts
// Crear una nueva entidad
const cube = engine.addEntity()

// Darle a la entidad una forma visible
MeshRenderer.setBox(cube)

// Crear transform con una posición predefinida
Transform.create(cube, {
	  position: Vector3.create(5, 1, 5)
}

// Darle a la entidad un componente Billboard
Billboard.create(cube, {})
```

Puedes configurar cómo se comporta el billboard con los siguientes parámetros:

* `billboardMode`: Usa un valor del `BillboardMode` para establecer su comportamiento:
  * `BillboardMode.BM_ALL`: La entidad rota para mirar al jugador en todos sus ejes de rotación. Si el jugador está muy por encima de la entidad, la entidad mirará hacia arriba.
  * `BillboardMode.BM_NONE`: La entidad no rotará en absoluto.
  * `BillboardMode.BM_X`: La entidad tiene su eje de rotación _x_ fijo.
  * `BillboardMode.BM_Y`: La entidad tiene su eje de rotación _y_ fijo. Solo rota hacia la izquierda y derecha, no arriba y abajo. Permanece perpendicular al suelo si el jugador está encima o debajo de la entidad.
  * `BillboardMode.BM_Z`: La entidad tiene su eje de rotación _z_ fijo.

* `targetEntity`: (opcional) Una entidad hacia la cual rota el billboard, en lugar de la cámara del jugador. Si la entidad referenciada no existe (por ejemplo, todavía no fue creada o fue eliminada), el billboard deja de rotar y mantiene su última orientación hasta que la entidad exista nuevamente. Asignarle `engine.CameraEntity` es equivalente a no asignar el campo.

```ts
// billboard plano
const perpendicularPlane = engine.addEntity()

Transform.create(perpendicularPlane, {
	position: Vector3.create(8, 1, 8),
})

PlaneShape.create(perpendicularPlane)

Billboard.create(perpendicularPlane, {
	billboardMode: BillboardMode.BM_Y,
})

// etiqueta de texto
const textLabel = engine.addEntity()

Transform.create(textLabel, {
	position: Vector3.create(6, 1, 6),
})

TextShape.create(textLabel, {
	text: 'Este texto siempre es legible',
})

Billboard.create(textLabel)

// cartel que mira a otra entidad en lugar del jugador
const sphere = engine.addEntity()

Transform.create(sphere, {
	position: Vector3.create(4, 2, 4),
})

MeshRenderer.setSphere(sphere)

const sign = engine.addEntity()

Transform.create(sign, {
	position: Vector3.create(8, 1, 8),
})

TextShape.create(sign, {
	text: 'Mirando la esfera',
})

Billboard.create(sign, {
	targetEntity: sphere,
})
```

{% hint style="info" %}
**💡 Consejo**: Los billboards son muy útiles para agregar a entidades de _texto_, ya que las hace siempre legibles.
{% endhint %}

El valor de `rotation` del componente `Transform` de la entidad no cambia a medida que el billboard sigue a los jugadores.

Si una entidad tiene tanto un componente `Billboard` como un componente `Transform` con valores de `rotation`, los jugadores verán la entidad rotando como un billboard. Si el billboard no afecta todos los ejes, el eje restante se rotará de acuerdo con el componente `Transform`.

{% hint style="warning" %}
**📔 Nota**: Si hay varios jugadores presentes al mismo tiempo, cada uno verá las entidades con modo billboard mirándolos. Las rotaciones de billboard se calculan localmente para cada jugador y no afectan lo que ven los demás. Esto no aplica a los billboards con `targetEntity`: como la posición del objetivo es parte de la escena, todos los jugadores ven esos billboards orientados de la misma manera.
{% endhint %}

## Mirar un conjunto de coordenadas

Para que la entidad A mire a la entidad B:

```
1) Resta la posición de la entidad A de la entidad B para obtener un vector que describa la distancia entre ellas.
2) Normaliza ese vector, para que tenga una longitud de 1, manteniendo su dirección.
3) Usa `Quaternion.lookRotation` para obtener una rotación Quaternion que describa rotar en esa dirección.
4) Establece ese Quaternion como la rotación de la entidad A
```

```ts
export function turn(entity: Entity, target: ReadOnlyVector3) {
	const transform = Transform.getMutable(entity)
	const difference = Vector3.subtract(target, transform.position)
	const normalizedDifference = Vector3.normalize(difference)
	transform.rotation = Quaternion.lookRotation(normalizedDifference)
}
```

## Escala

`scale` también es un _vector 3D_, almacenado como un objeto `Vector3`, incluyendo el factor de escala en los ejes _x_, _y_ y _z_. La forma de la entidad se escala en consecuencia, ya sea una primitiva o un modelo 3D.

La escala predeterminada es 1, así que asigna un valor mayor a 1 para estirar una entidad o menor que 1 para encogerla.

```ts
// Crear una nueva entidad
const ball = engine.addEntity()

// Crear transform con una posición predefinida
Transform.create(ball, {
	  scale: Vector3.create(5, 5, 5)
}

// Obtener una versión mutable del transform
const mutableTransform = Transform.getMutable(ball)

// Establecer la escala con un Vector3

mutableTransform.scale = Vector3.create(2, 2, 2)

// Establecer la posición con un objeto
mutableTransform.scale = { x: 5, y: 1, z: 5 }

// Establecer cada eje individualmente
mutableTransform.scale.x = 3
mutableTransform.scale.y = 3
mutableTransform.scale.z = 2
```

## Heredar transformaciones del padre

Cuando una entidad está anidada dentro de otra, las entidades hijas heredan componentes de los padres. Esto significa que si una entidad padre está posicionada, escalada o rotada, sus hijos también se ven afectados. Los valores de posición, rotación y escala de las entidades hijas no anulan los de los padres, en cambio se combinan.

Asignas una entidad para que sea padre de otra estableciendo el campo `parent` en el componente `Transform` de la entidad hija.

Si una entidad padre está escalada, todos los valores de posición de sus hijos también se escalan.

```ts
// Crear entidades
const parentEntity = engine.addEntity()
const childEntity = engine.addEntity()

// Crear un transform para el padre
Transform.create(parentEntity, {
	position: Vector3.create(3, 1, 1),
	scale: Vector3.create(0.5, 0.5, 0.5),
})

// Crear un transform para el hijo y asignarlo como hijo
Transform.create(childEntity, {
	position: Vector3.create(0, 1, 0),
	parent: parentEntity,
})
```

En este ejemplo, la entidad hija se reducirá a 0.5, ya que su padre tiene esa escala. La posición de la entidad hija también será relativa a su padre. Tenemos que sumar la posición del padre más la del hijo. En este caso, dado que el padre está escalado a la mitad de su tamaño, la transformación del hijo también se escala proporcionalmente. En términos absolutos, el hijo está posicionado en `{ x: 3, y: 1.5, z: 1 }`. Si el padre tuviera una `rotation`, esto también afectaría la posición final del hijo, ya que cambia el eje en el que se desplaza el hijo.

Si una entidad hija no tiene `position` en su Transform, el valor predeterminado es `0,0,0`, lo que la dejará posicionada en la misma posición que su padre.

Puedes usar una entidad invisible sin componente de forma como padre, para envolver un conjunto de otras entidades. Esta entidad no será visible en la escena renderizada, pero puede usarse para agrupar a sus hijos y aplicar una transformación a todos ellos.

## Adjuntar una entidad a un avatar

Hay tres métodos para adjuntar una entidad al jugador:

* Hacerla hija de la **Avatar Entity**
* Hacerla hija de la **Camera Entity**
* Usar el **componente AvatarAttach**

La forma más simple de adjuntar una entidad al avatar es establecer el padre como la [entidad reservada](../architecture/entities-components.md#reserved-entities) `engine.PlayerEntity`. La entidad se moverá junto con la posición del jugador.

```ts
let childEntity = engine.addEntity()

MeshRenderer.setCylinder(childEntity)

Transform.create(childEntity, {
	scale: Vector3.create(0.2, 0.2, 0.2),
	position: Vector3.create(0, 0.4, 0),
	parent: engine.PlayerEntity,
})
```

También puedes establecer una entidad a la [entidad reservada](../architecture/entities-components.md#reserved-entities) `engine.CameraEntity`. Al usar la entidad de cámara en primera persona, la entidad adjunta seguirá los movimientos de la cámara. Esto es ideal para mantener algo siempre a la vista, por ejemplo para mantener el modelo 3D del arma siempre a la vista, incluso cuando la cámara apunta hacia arriba.

```ts
let childEntity = engine.addEntity()

MeshRenderer.setCylinder(childEntity)

Transform.create(childEntity, {
	scale: Vector3.create(0.2, 0.2, 0.2),
	position: Vector3.create(0, 0.4, 0),
	parent: engine.CameraEntity,
})
```

Para adjuntar un objeto a uno de los huesos del avatar y hacer que se mueva junto con las animaciones del avatar, agrega un componente `AvatarAttach` a la entidad.

Puedes elegir diferentes puntos de anclaje en el avatar, la mayoría de estos puntos están vinculados a la armadura del jugador y siguen las animaciones del jugador. Por ejemplo, al usar el punto de anclaje de la mano derecha, la entidad adjunta se moverá cuando el avatar salude o balancee sus brazos mientras corre, como si el jugador estuviera sosteniendo la entidad en su mano.

```ts
// Adjuntar al jugador principal, si avatarId no está configurado, se usa engine.PlayerEntity por defecto
AvatarAttach.create(myEntity, {
	anchorPointId: AvatarAnchorPointType.AAPT_NAME_TAG,
})

// Adjuntar a un jugador por ID
AvatarAttach.create(myEntity, {
	avatarId: '0xAAAAAAAAAAAAAAAAA',
	anchorPointId: AvatarAnchorPointType.AAPT_NAME_TAG,
})
```

Al crear un componente `AvatarAttach`, pasa un objeto con los siguientes datos:

* `avatarId`: _Opcional_ El ID del jugador al que adjuntar. Esto es lo mismo que la dirección Ethereum del jugador, para aquellos jugadores conectados con una wallet Ethereum. Si no se especifica, adjunta la entidad al avatar del jugador local.
* `anchorPointId`: Qué punto de anclaje en el esqueleto del avatar adjuntar la entidad, usando un valor del enum `AvatarAnchorPointType`.

{% hint style="warning" %}
**📔 Nota**: Si quieres que todos los jugadores en la escena vean un objeto adjunto al mismo jugador, por ejemplo para que todos vean que el Jugador A recogió un objeto y lo sostiene en su mano izquierda, entonces debes proporcionar un valor a `avatarId`. Si no se especifica, todos los jugadores verán el objeto adjunto a sus propios avatares.
{% endhint %}

El siguiente ejemplo coloca una entidad adjunta a un avatar en particular, para que todos los demás jugadores la vean adjunta a ese mismo avatar.

```ts
import { getPlayer } from '@dcl/sdk/src/players'
import { AvatarAnchorPointType, AvatarAttach, engine, Entity } from '@dcl/sdk/ecs'
import { syncEntity } from '@dcl/sdk/src/network'

async function attachToPlayer(){

 let userData = await getPlayer()
 console.log(userData)

 if (!userData || !userData.wearables) return

  let entity = engine.addEntity()

  AvatarAttach.create(entity, {
    avatarId: userData.userId,
    anchorPointId: AvatarAnchorPointType.AAPT_RIGHT_HAND,
  })

  // Otros componentes

  syncEntity(entity, [AvatarAttach.componentId])

}
```

Los siguientes puntos de anclaje están disponibles en el enum `AvatarAnchorPointType`:

* `AAPT_RIGHT_HAND`: Fijo en la mano derecha del jugador
* `AAPT_LEFT_HAND`: Fijo en la mano izquierda del jugador
* `AAPT_HEAD`: Fijo en el centro de la cabeza del jugador.
* `AAPT_NECK`: Fijo en la base del cuello del jugador.
* `AAPT_SPINE`: Fijo en la sección superior de la columna vertebral.
* `AAPT_SPINE1`: Fijo en la sección media de la columna vertebral.
* `AAPT_SPINE2`: Fijo en la sección inferior de la columna vertebral.
* `AAPT_HIP`: Fijo en el hueso de la cadera.
* `AAPT_LEFT_SHOULDER`: Fijo en el hombro izquierdo.
* `AAPT_LEFT_ARM`: Fijo en el primer hueso del brazo izquierdo, a la altura del hombro.
* `AAPT_LEFT_FOREARM`: Fijo en el hueso del antebrazo izquierdo.
* `AAPT_LEFT_HAND_INDEX`: Fijo en la punta del dedo índice izquierdo.
* `AAPT_RIGHT_SHOULDER`: Fijo en el hombro derecho.
* `AAPT_RIGHT_ARM`: Fijo en el primer hueso del brazo derecho, a la altura del hombro.
* `AAPT_RIGHT_FOREARM`: Fijo en el hueso del antebrazo derecho.
* `AAPT_RIGHT_HAND_INDEX`: Fijo en la punta del dedo índice derecho.
* `AAPT_LEFT_UP_LEG`: Fijo en el hueso superior de la pierna izquierda.
* `AAPT_LEFT_LEG`: Fijo en el hueso inferior de la pierna izquierda.
* `AAPT_LEFT_FOOT`: Fijo en el tobillo de la pierna izquierda.
* `AAPT_LEFT_TOE_BASE`: Fijo en la punta del dedo del pie de la pierna izquierda.
* `AAPT_RIGHT_UP_LEG`: Fijo en el hueso superior de la pierna derecha.
* `AAPT_RIGHT_LEG`: Fijo en el hueso inferior de la pierna derecha.
* `AAPT_RIGHT_FOOT`: Fijo en el tobillo de la pierna derecha.
* `AAPT_RIGHT_TOE_BASE`: Fijo en la punta del dedo del pie de la pierna derecha.
*   `.AAPT_NAME_TAG`: Flota justo encima del nombre del jugador, no se ve afectado por las animaciones del jugador.

    > Nota: La altura del nombre se ajusta dinámicamente según la altura de los wearables que lleva un jugador. Por lo tanto, un jugador que usa un sombrero alto tendrá su nombre un poco más alto que otros.
*   `AAPT_POSITION` _OBSOLETO_: La posición general del jugador. Esto aparece a una altura de 0.8 por encima de los pies del jugador.

    >

{% hint style="warning" %}
\> \*\*📔 Nota\*\*: El \`AAPT\_POSITION\` está obsoleto. Para seguir la posición general del jugador, es mejor hacer que la entidad sea hija de la Avatar Entity. Consulta el inicio de esta sección para un ejemplo. >
{% endhint %}

{% hint style="info" %}
**💡 Consejo**: Para usar estos valores, escribe `AvatarAnchorPointType.` y VS Code mostrará la lista completa de opciones en un menú desplegable.
{% endhint %}



La renderización de entidades se determina localmente en cada instancia de la escena. Adjuntar una entidad en un jugador no la hace visible para otros jugadores que están viendo a ese jugador. Si una entidad está adjunta al jugador local predeterminado, cada jugador experimentará la entidad como adjunta a su propio avatar.

{% hint style="warning" %}
**📔 Nota**: Las entidades adjuntas a un avatar deben permanecer dentro de los límites de la escena para ser renderizadas. Si un jugador sale de tu escena, cualquier entidad adjunta dejará de renderizarse hasta que el jugador vuelva a entrar. Los wearables inteligentes no tienen esta limitación.
{% endhint %}

El componente `AvatarAttach` sobrescribe el componente `Transform`. Una sola entidad puede tener tanto un componente `AvatarAttach` como un componente `Transform` al mismo tiempo, pero los valores en el componente `Transform` se ignoran.

Si necesitas posicionar una entidad con un desplazamiento desde el punto de anclaje en el avatar, o una rotación o escala diferente, adjunta una entidad padre al punto de anclaje. Luego puedes establecer el modelo visible en una entidad hija de ese padre, y darle a este hijo su propio componente Transform para describir sus cambios desde el punto de anclaje.

```ts
// Crear entidad padre
const parentEntity = engine.addEntity()

// Adjuntar entidad padre al jugador
AvatarAttach.create(parentEntity, {
	anchorPointId: AvatarAnchorPointType.AAPT_NAME_TAG,
})

// Crear entidad hija
let childEntity = engine.addEntity()

MeshRenderer.setCylinder(childEntity)

Transform.create(childEntity, {
	scale: Vector3.create(0.2, 0.2, 0.2),
	position: Vector3.create(0, 0.4, 0),
	parent: parentEntity,
})
```

{% hint style="warning" %}
**📔 Nota**: Si la entidad adjunta tiene colisionadores, estos colisionadores podrían bloquear el movimiento del jugador. Considera deshabilitar la capa de física de los colisionadores de la entidad. Consulta [Capas de colisión](colliders.md#collision-layers)
{% endhint %}

### Adjuntar a otros jugadores

Puedes usar el componente `AvatarAttach` para adjuntar una entidad al avatar de otro jugador. Para hacer esto, debes conocer el id del jugador.

Para adjuntar una entidad al avatar de otro jugador, debes proporcionar el ID del usuario en el campo `avatarId`. Hay [varias formas](../interactivity/user-data.md#get-player-data) de obtener estos datos.

{% hint style="warning" %}
**📔 Nota**: Para aquellos jugadores conectados con una wallet Ethereum, su `userId` es lo mismo que su dirección Ethereum.
{% endhint %}

Obtén el `userId` para todos los demás jugadores cercanos a través de `getPlayer()`

```ts
executeTask(async () => {
	for (const [entity, data] of engine.getEntitiesWith(PlayerIdentityData)) {
		console.log('Player id: ', data.address)
	}
})
```

Usándolo junto con `AvatarAttach`, podrías usar el siguiente código para agregar un cubo flotando sobre la cabeza de cada otro jugador en la escena:

```ts
executeTask(async () => {
        for (const [entity, data] of engine.getEntitiesWith(PlayerIdentityData)) {
            const myEntity = engine.addEntity()
            MeshRenderer.setBox(myEntity)
            AvatarAttach.create(myEntity, {
                anchorPointId: AvatarAnchorPointType.AAPT_LEFT_HAND,
                avatarId: data.address,
            })
        }
    })
```

Consulta otras formas de obtener los IDs de otros usuarios en [Obtener datos del jugador](../interactivity/user-data.md#get-player-data).

## Límites de la escena

Todas las entidades en tu escena deben caber dentro de los límites de la escena, ya que lo que está fuera de esos límites son parcelas de tierra que son propiedad de otros jugadores.

Si alguna parte de tus modelos se extiende más allá de estos límites al ejecutar una vista previa, estas partes que se extienden se cortarán y no se renderizarán, tanto al ejecutar una vista previa como en la escena publicada.

La posición de las entidades en tu escena se verifica constantemente a medida que se mueven, si una entidad sale de la escena y luego regresa, se eliminará y luego se renderizará normalmente nuevamente.

Una cuadrícula en el suelo de la escena muestra los límites de la escena, que por defecto van de 0 a 16 en el eje _x_ y _z_, y hasta 20 en el eje _y_. Eres libre de colocar entidades bajo tierra, debajo de 0 en el eje _y_.

{% hint style="info" %}
**💡 Consejo**: Si tu escena necesita más parcelas, puedes agregarlas en el archivo `scene.json` del proyecto. Consulta [Metadatos de escena](../projects/scene-metadata.md) para instrucciones. Una vez agregadas, deberías ver que la cuadrícula se extiende para cubrir las parcelas adicionales.
{% endhint %}
