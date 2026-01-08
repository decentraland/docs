---
description: >-
  Usa raycasting para trazar una línea en el espacio y consultar colisiones con
  entidades en la escena
metaLinks:
  alternates:
    - >-
      https://app.gitbook.com/s/oPnXBby9S6MrsW83Y9qZ/scenes-sdk7/interactivity/raycasting
---

# Raycasting

El raycasting es una herramienta fundamental en el desarrollo de juegos. Con raycasting, puedes trazar una línea imaginaria en el espacio y consultar si alguna entidad es intersectada por esa línea. Esto es útil para calcular líneas de visión, trayectorias de balas, algoritmos de pathfinding y muchas otras aplicaciones.

Cuando un jugador presiona el botón del puntero, o el botón primario o secundario, se traza un rayo desde la posición del jugador en la dirección en la que están mirando, consulta [eventos de botones](click-events.md) para más detalles sobre esto. Este documento cubre cómo trazar un rayo invisible desde cualquier posición y dirección arbitraria, independiente de las acciones del jugador, que puedes usar en muchos otros escenarios.

Ten en cuenta que los raycasts solo impactan objetos con colisionadores. Entonces, si deseas detectar impactos de rayos contra un modelo 3D, ya sea:

* El modelo debe contener [meshes colisionadores](../../3d-modeling/colliders.md).
* El `GLTFContainer` debe estar configurado para usar la [geometría visible con máscaras de colisión](../3d-essentials/colliders.md#colliders-on-3d-models).
* Agregar un [componente MeshCollider](../3d-essentials/colliders.md).

También es una buena práctica asignar [capas de colisión](../3d-essentials/colliders.md#collision-layers) personalizadas a los modelos 3D, para que los rayos solo necesiten calcular colisiones contra las entidades relevantes, en lugar de contra todo lo que tiene un colisionador.

## Crear un rayo

Todos los rayos tienen un punto de origen y una dirección. El punto de origen se basa en la posición de una entidad, tomando los valores en el componente Transform de la entidad. La dirección de un rayo se puede definir de 4 maneras diferentes:

* **local**: Una dirección relativa a la dirección hacia adelante de la entidad, afectada también por la transformación de cualquier entidad padre. Esto es útil para detectar obstáculos frente a vehículos respetando su rumbo.
* **global**: Ignora la rotación de la entidad, y mira una dirección como si la rotación de la entidad fuera 0. Esto es útil para, por ejemplo, siempre apuntar hacia abajo.
* **objetivo global**: Traza una línea entre la posición de la entidad y una posición objetivo global en la escena. Ignora la rotación de la entidad. Útil por ejemplo para crear juegos de tower defense, la torreta de cada torre puede apuntar a una coordenada señalada en el espacio.
* **entidad objetivo**: Traza una línea entre la posición de la entidad y la posición de una segunda entidad objetivo. Ignora la rotación de cualquiera de las entidades.

El siguiente código crea un raycast con una dirección local:

```ts
const myEntity = engine.addEntity()
Transform.create(myEntity, {
  position: Vector3.create(4, 1, 4),
})

raycastSystem.registerLocalDirectionRaycast(
  {
    entity: myEntity,
    opts: { direction: Vector3.Forward() },
  },
  function (raycastResult) {
    // función callback
  }
)
```

Usa las siguientes funciones para crear raycasts proporcionando la dirección de diferentes maneras:

* `raycastSystem.registerLocalDirectionRaycast()`: crea un raycast con una dirección **local**. El campo `direction` espera un `Vector3` que describe un vector relativo a la entidad y su rotación (ej. `Vector3.Forward()` terminaría usando el vector forward del transform de la entidad)
* `raycastSystem.registerGlobalDirectionRaycast()`: crea un raycast con una dirección **global**. El campo `direction` espera un `Vector3` que describe la dirección global.
* `raycastSystem.registerGlobalTargetRaycast()`: crea un raycast con una dirección definida por una posición **objetivo global**. El campo `target` espera un `Vector3` que describe una posición global en la escena.
* `raycastSystem.registerTargetEntityRaycast()`: crea un raycast con una dirección definida hacia la posición de una **entidad objetivo**. El campo `targetEntity` espera una referencia a una entidad, la posición de esta entidad se usará como objetivo del rayo.

Los siguientes campos opcionales están disponibles al crear un rayo con cualquiera de los métodos anteriores:

* `maxDistance`: _number_ para establecer la longitud con la que se trazará este rayo. Si no se establece, el predeterminado es 16 metros.
* `queryType`: valor enum _RaycastQueryType_, para definir si el rayo devolverá todas las entidades impactadas o solo la primera. Las siguientes opciones están disponibles:
  * `RaycastQueryType.RQT_HIT_FIRST`: _(predeterminado)_ solo devuelve la primera entidad impactada, comenzando desde el punto de origen.
  * `RaycastQueryType.RQT_QUERY_ALL`: devuelve todas las entidades impactadas, desde el origen hasta la distancia máxima del rayo.
* `originOffset`: En lugar de comenzar el raycast desde la posición de origen de la entidad, agrega un desplazamiento para comenzar la consulta desde una posición relativa. Puedes, por ejemplo, usar un pequeño desplazamiento para evitar que el rayo colisione contra el colisionador propio de la entidad. Si no se establece, el predeterminado es `Vector3.Zero()`.
* `collisionMask`: Solo detectar colisiones con ciertas capas de colisión. Usa esto junto con una capa de colisión personalizada, o para detectar solo la capa de physics o eventos de puntero. Consulta [capas de colisión](../3d-essentials/colliders.md#collision-layers). Si no se establece, la capa predeterminada usada es `ColliderLayer.CL_PHYSICS`.
* `continuous`: Si es true, seguirá ejecutando una consulta de raycast en cada frame. Si es false, el rayo solo se usará en el frame actual. Si no se establece, el predeterminado es false.
* Al establecer la dirección con una dirección local o global, el campo `direction` por defecto es `Vector3.Forward()`.
* Al establecer la dirección con un objetivo global, el campo `globalTarget` por defecto es `Vector3.Zero()`.
* Al establecer la dirección con un objetivo de entidad, el campo `targetEntity` por defecto es la entidad raíz de la escena, ubicada en `Vector3.Zero()`.

{% hint style="warning" %}
**📔 Nota**: La propiedad `continuous` debe usarse con precaución, ya que ejecutar una consulta de raycast en cada frame puede ser muy costoso para el rendimiento. Cuando sea posible, usa un sistema (o la función `interval` en la biblioteca Utils) para ejecutar consultas de raycast a un intervalo regular más espaciado, consulta [raycasting recurrente](raycasting.md#recurrent-raycasting).
{% endhint %}

A continuación hay ejemplos usando cada uno de los cuatro métodos para determinar la dirección del rayo:

```ts
// RAYCAST DE DIRECCIÓN LOCAL
raycastSystem.registerLocalDirectionRaycast(
  {
    entity: myEntity,
    opts: {
      queryType: RaycastQueryType.RQT_QUERY_ALL,
      direction: Vector3.Forward(),
      maxDistance: 30,
    },
  },
  function (raycastResult) {
    console.log(raycastResult.hits)
  }
)
// RAYCAST DE DIRECCIÓN GLOBAL
raycastSystem.registerGlobalDirectionRaycast(
  {
    entity: myEntity,
    opts: {
      queryType: RaycastQueryType.RQT_QUERY_ALL,
      direction: Vector3.Forward(),
      maxDistance: 30,
    },
  },
  function (raycastResult) {
    console.log(raycastResult.hits)
  }
)
// RAYCAST DE POSICIÓN OBJETIVO GLOBAL
raycastSystem.registerGlobalTargetRaycast(
  {
    entity: myEntity,
    opts: {
      queryType: RaycastQueryType.RQT_QUERY_ALL,
      globalTarget: Vector3.Zero(),
    },
  },
  (raycastResult) => {
    console.log(raycastResult.hits)
  }
)
// RAYCAST DE ENTIDAD OBJETIVO
const targetEntity = engine.addEntity()
Transform.create(targetEntity, { position: Vector3.create(8, 1, 10) })

raycastSystem.registerTargetEntityRaycast(
  {
    entity: myEntity,
    opts: {
      queryType: RaycastQueryType.RQT_QUERY_ALL,
      targetEntity: targetEntity,
    },
  },
  (raycastResult) => {
    console.log(raycastResult.hits)
  }
)
```

{% hint style="warning" %}
**📔 Nota**: `raycastSystem`, `RaycastQueryType` y `ColliderLayer` deben importarse mediante

> `import { raycastSystem, RaycastQueryType, ColliderLayer } from "@dcl/sdk/ecs"`

Consulta [Importaciones](../getting-started/coding-scenes.md#imports) para saber cómo manejarlas fácilmente.
{% endhint %}

## Resultado del raycast

La función callback que maneja el raycast recibe un objeto que contiene datos sobre el rayo mismo, y cualquier entidad que fue impactada.

* `globalOrigin`: La posición donde se originó el rayo, relativa a la escena.
* `direction`: La dirección global que el rayo estaba apuntando, como un `Vector3`.
* `hits`: Un array con un objeto por cada entidad que fue impactada. Si no hubo entidades impactadas, este array está vacío. Si el raycast usó `RaycastQueryType.RQT_HIT_FIRST`, este array solo contendrá un objeto.

Cada objeto en el array `hits` incluye:

* `entityId`: Número de Id de la entidad que fue impactada por el rayo.
* `meshName`: _String_ con el nombre interno del mesh específico en el modelo 3D que fue impactado. Esto es útil cuando un modelo 3D está compuesto por múltiples meshes.
* `position`: _Vector3_ para la posición donde el rayo intersectó con la entidad impactada (relativa a la escena)
* `length`: Longitud del rayo desde su origen hasta la posición donde ocurrió el impacto contra la entidad.
* `normalHit`: _Quaternion_ para el ángulo de la normal del impacto en espacio mundial.
* `globalOrigin`: _Vector3_ para la posición donde se origina el rayo (relativa a la escena)
* `direction`: La dirección global que el rayo estaba apuntando, como un `Vector3`.

El siguiente ejemplo itera sobre las entidades que fueron impactadas:

```ts
const myEntity = engine.addEntity()
Transform.create(myEntity, {
  position: Vector3.create(4, 1, 4),
})

raycastSystem.registerLocalDirectionRaycast(
  {
    entity: myEntity,
    opts: {
      queryType: RaycastQueryType.RQT_QUERY_ALL,
      direction: Vector3.Forward(),
      maxDistance: 30,
    },
  },
  function (raycastResult) {
    if (raycastResult.hits.length > 0) {
      for (const hit of raycastResult.hits) {
        if (hit.entityId) {
          console.log('hit entity ', hit.entityId)
        }
      }
    } else {
      console.log('no entities hit')
    }
  }
)
```

{% hint style="warning" %}
**📔 Nota**: Puedes obtener un resultado de raycast al impactar una entidad en una escena diferente.
{% endhint %}

## Manejar entidades impactadas

Cuando obtienes un resultado de raycast que impactó una entidad, puedes usar el `entityId` para interactuar con la entidad y sus componentes. Una entidad es [nada más que un número](../architecture/entities-components.md#overview), por lo que el valor `entityId` mismo puede interpretarse como un tipo `Entity`.

```ts
const hitEntity = result.entityId as Entity
const transform = Transform.get(entity)
console.log(transform.position)
```

## Capas de colisión

Es una buena práctica solo verificar colisiones contra entidades que sean relevantes, para hacer la escena más eficiente. El campo `collisionMask` permite listar solo capas de colisión específicas, que pueden incluir la capa de physics (que bloquea el movimiento del jugador), la capa de puntero (que se usa para eventos de puntero), y 8 capas personalizadas que puedes asignar libremente según tus necesidades. Consulta [capas de colisión](../3d-essentials/colliders.md#collision-layers). Por defecto, todas las capas se detectan.

Por defecto, el campo `collisionMask` está configurado para responder tanto a las capas `ColliderLayer.CL_POINTER` como `ColliderLayer.CL_PHYSICS`. Puedes cambiar este valor para listar solo una de esas, o para incluir capas personalizadas. Usa el separador `|` para listar múltiples opciones.

```ts
raycastSystem.registerLocalDirectionRaycast(
  {
    entity: myEntity,
    opts: {
      queryType: RaycastQueryType.RQT_QUERY_ALL,
      direction: Vector3.Forward(),
      maxDistance: 30,
      collisionMask:
        ColliderLayer.CL_CUSTOM1 |
        ColliderLayer.CL_CUSTOM3 |
        ColliderLayer.CL_POINTER,
    },
  },
  (raycastResult) => {
    log(raycastResult.hits)
  }
)
```

## Raycasting recurrente

Al usar las funciones del `raycastSystem`, el comportamiento predeterminado es crear un solo rayo, que consultará colisiones una vez. Como alternativa, puedes establecer el campo `continuous` en _true_ para ejecutar una consulta y la función callback en cada tick del bucle del juego.

El siguiente ejemplo seguirá ejecutando la consulta de raycast desde este punto en adelante

```ts
raycastSystem.registerLocalDirectionRaycast(
  {
    entity: myEntity,
    opts: {
      queryType: RaycastQueryType.RQT_QUERY_ALL,
      direction: Vector3.Forward(),
      maxDistance: 30,
      continuous: true,
    },
  },
  function (raycastResult) {
    log(raycastResult.hits)
  }
)
```

{% hint style="warning" %}
**📔 Nota**: La propiedad `continuous` debe usarse con precaución, ya que ejecutar una consulta de raycast en cada frame puede ser muy costoso para el rendimiento.
{% endhint %}

Cuando ya no se necesite, elimina cualquier raycast recurrente. Para hacerlo, debes usar `raycastSystem.removeRaycasterEntity`.

```ts
raycastSystem.removeRaycasterEntity(myEntity)
```

Cuando sea posible, usa un sistema (o la función `interval` en la biblioteca Utils) para ejecutar consultas de raycast a un intervalo regular más espaciado, como solo una vez por segundo, o cada quinta parte de segundo.

```typescript
// componentes personalizados
const CubeOscilator = engine.defineComponent('CubeOscilator', {
  t: Schemas.Float,
})

const TimerComponent = engine.defineComponent('TimerComponent', {
  t: Schemas.Float,
})

const RAY_INTERVAL = 0.1

// verificar rayos
engine.addSystem((dt) => {
  for (const [entity] of engine.getEntitiesWith(TimerComponent)) {
    const timer = TimerComponent.getMutable(entity)
    timer.t += dt

    if (timer.t > RAY_INTERVAL) {
      timer.t = 0
      raycastSystem.registerGlobalDirectionRaycast(
        {
          entity: myEntity,
          opts: {
            queryType: RaycastQueryType.RQT_HIT_FIRST,
            direction: Vector3.Forward(),
            maxDistance: 16,
          },
        },
        function (raycastResult) {
          log(raycastResult.hits)
        }
      )
    }
  }
})

TimerComponent.create(engine.addEntity())

// sistema de cubo oscilante
engine.addSystem((dt) => {
  for (const [entity, cube] of engine.getEntitiesWith(
    CubeOscilator,
    Transform
  )) {
    CubeOscilator.getMutable(entity).t += dt
    Transform.getMutable(entity).position.y = 2 + Math.cos(cube.t)
  }
})

// crear cubo
const cubeEntity = engine.addEntity()
Transform.create(cubeEntity, { position: { x: 8, y: 1, z: 8 } })
CubeOscilator.create(cubeEntity)
MeshRenderer.setBox(cubeEntity)
MeshCollider.setBox(cubeEntity)
```

El ejemplo anterior ejecuta un raycast recurrente cada 0.1 segundos. Usa un componente temporizador y la propiedad `dt` de un sistema para cronometrarlos uniformemente. También incluye un cubo que oscila hacia arriba y hacia abajo, controlado por otro sistema, para moverse dentro y fuera del camino del rayo.

{% hint style="info" %}
**💡 Consejo**: Usa la función `interval` en la [biblioteca SDK Utils](https://github.com/decentraland/sdk7-utils) para una manera más simple de ejecutar una función a un intervalo fijo.
{% endhint %}

## Raycasts a través de un sistema

Otra forma de realizar raycasts recurrentes es ejecutarlos desde dentro de la función recurrente de un sistema. Esto te permite tener mucho más control sobre cuándo y cómo funcionan. En lugar de registrar una función callback, puedes realizar una consulta de raycast con `raycastSystem.registerRaycast` y luego verificar los datos devueltos por esta operación, todo dentro de la función del sistema.

Ten en cuenta que como el raycast se ejecuta en un sistema, el resultado solo estará disponible el siguiente tick, necesitando dos ejecuciones del sistema. Una para registrar el raycast para el siguiente frame, y el siguiente frame procesar su resultado.

```ts
engine.addSystem((deltaTime) => {
		const result = raycastSystem.registerRaycast(
			entity,
			localDirectionOptions({
				collisionMask: ColliderLayer.CL_CUSTOM1 | ColliderLayer.CL_CUSTOM3 | ColliderLayer.CL_POINTER,
				originOffset: Vector3.create(0, 0.4, 0),
				maxDistance: RAY_POWER,
				queryType: raycastQueryType,
				direction: Vector.forward()
				continuous: true // no abuses de la propiedad 'continuous' ya que el raycasting es costoso en rendimiento
			})
		)
		if (result) // hacer algo
	})
```

## Colisionar con el jugador

No puedes impactar directamente el avatar del jugador o los de otros jugadores con un rayo, pero lo que puedes hacer como solución alternativa es posicionar una entidad invisible ocupando el mismo espacio que un jugador usando el [componente AvatarAttach](../3d-essentials/entity-positioning.md#attach-an-entity-to-an-avatar), y verificar colisiones con ese cubo.

## Raycasts desde el jugador

Para trazar un rayo desde la posición del jugador en la dirección enfrentada por la cámara, puedes trazar un rayo usando la cámara o el avatar [Entidades Reservadas](../architecture/entities-components.md#reserved-entities).

{% hint style="info" %}
**💡 Consejo**: Para la mayoría de los casos, podrías estar mejor usando [Eventos de puntero](click-events.md) en lugar de raycasts.
{% endhint %}

El siguiente ejemplo traza un rayo desde la posición de la cámara del jugador hacia adelante, usando la entidad `engine.CameraEntity`.

```ts
raycastSystem.registerGlobalDirectionRaycast(
  {
    entity: engine.CameraEntity,
    opts: {
      queryType: RaycastQueryType.RQT_HIT_FIRST,
      direction: Vector3.rotate(
        Vector3.Forward(),
        Transform.get(engine.CameraEntity).rotation
      ),
    },
  },
  function (raycastResult) {
    console.log(raycastResult)
  }
)
```

{% hint style="warning" %}
**📔 Nota**: Ten en cuenta que en tercera persona el cursor podría en el futuro no comportarse igual que en primera persona. Se recomienda solo usar esto si el jugador está en primera persona.
{% endhint %}

## Raycast desde la posición del cursor

También puedes trazar un rayo desde la posición del cursor del jugador hacia el mundo 3D. Esto se puede usar para arrastrar objetos, shooters, etc.

En este ejemplo, detectamos cuando el jugador presiona la tecla E, y luego trazamos un rayo desde la posición del cursor hacia el mundo 3D. Luego verificamos si el rayo impactó alguna entidad, y si es así, hacemos algo con ella.

```ts
import { engine, Entity, InputAction, inputSystem, PointerEventType, RaycastQueryType, raycastSystem, TextShape, Transform } from '@dcl/sdk/ecs'
import { EntityNames } from '../assets/scene/entity-names'
import { PrimaryPointerInfo } from '@dcl/sdk/ecs'

let cooldown = 1
let rayFrequency = 0.1
let mousePressed = false

export function main() {
   engine.addSystem(rayCastSystem)
}

const rayCastSystem = (t: number) => {

    if (inputSystem.isTriggered(InputAction.IA_PRIMARY, PointerEventType.PET_DOWN)) {
      mousePressed = true
    }

    if (inputSystem.isTriggered(InputAction.IA_PRIMARY, PointerEventType.PET_UP)) {
      mousePressed = false
    }

    if (!mousePressed) {
      cooldown = 0
      raycastSystem.removeRaycasterEntity(engine.CameraEntity)
      return
    }

    cooldown += t
    if (cooldown > rayFrequency) return
    cooldown = 0

    const pointerInfo = PrimaryPointerInfo.getOrCreateMutable(engine.RootEntity)
    let dir = pointerInfo.worldRayDirection

    raycastSystem.registerGlobalDirectionRaycast(
      {
        entity: engine.CameraEntity,
        opts: {
          queryType: RaycastQueryType.RQT_HIT_FIRST,
          direction: dir,
        },
      },
      function (raycastResult) {
        let result = raycastResult.hits[0]

        // hacer algo en la posición de impacto
        if (result && result.position) {
          console.log("x:", result.position.x, ", y:", result.position.y, ", z:", result.position.z)
        }

        // hacer algo con la entidad impactada
        const entity = result.entityId as Entity
        if (entity) {
          console.log("entity: ", entity)
        }
      }
    )
}

```

{% hint style="info" %}
**💡 Consejo**: En este ejemplo usamos el botón primario (E) para activar el raycast. No usamos el botón del puntero (clic izquierdo) porque hacer clic y arrastrar también cambia el ángulo de la cámara por defecto. Si deseas evitar rotar la cámara mientras arrastras, puedes usar una [Cámara Virtual](../3d-essentials/camera.md) para establecer el ángulo de la cámara como fijo.
{% endhint %}

## Sintaxis avanzada

### Crear un componente raycast

Un componente Raycast describe el rayo invisible que se usa para consultar entidades intersectadas. El rayo se traza comenzando en la posición de la entidad, como se define en el componente Transform y afectado por el de cualquier entidad padre. La dirección se puede definir de varias maneras.

Los rayos se definen usando los siguientes datos:

* `direction`: Un objeto que contiene un campo `$case` para seleccionar el tipo de dirección, y un campo adicional que dependerá de este tipo, que determina esta dirección. Los siguientes son los valores aceptados para `$case`:
  * `LOCAL_DIRECTION`: Una dirección relativa a la dirección hacia adelante de la entidad, afectada también por la transformación de cualquier entidad padre. Esto es útil para detectar obstáculos frente a vehículos respetando su rumbo. La rotación se define por el campo `localDirection`, como un `Vector3` que describe una rotación.
  * `GLOBAL_DIRECTION`: Ignora la rotación de la entidad, y mira una dirección como si la rotación de la entidad fuera 0. Esto es útil para, por ejemplo, siempre apuntar hacia abajo. La rotación se define por el campo `globalDirection`, como un `Vector3` que describe una rotación.
  * `GLOBAL_TARGET`: Traza una línea entre la posición de la entidad y una posición objetivo global en la escena. Ignora la rotación de la entidad. Útil para crear juegos de tower defense, la torreta de cada torre puede apuntar a una coordenada señalada en el espacio. El objetivo se define por el campo `globalTarget`, como un `Vector3` que describe la posición global.
  * `TARGET_ENTITY`: Traza una línea entre la posición de la entidad y la posición de una segunda entidad objetivo. Ignora la rotación de cualquiera de las entidades. El objetivo se define por el campo `targetEntity`, manteniendo una referencia a la entidad.
* `maxDistance`: _number_ para establecer la longitud con la que se trazará este rayo.
* `queryType`: valor enum _RaycastQueryType_, para definir si el rayo devolverá todas las entidades impactadas o solo la primera. Las siguientes opciones están disponibles:
  * `RaycastQueryType.RQT_QUERY_ALL`: solo devuelve la primera entidad impactada, comenzando desde el punto de origen.
  * `RaycastQueryType.RQT_HIT_FIRST`: devuelve todas las entidades impactadas, desde el origen hasta la distancia máxima del rayo.
* `collisionMask`: Solo detectar colisiones con ciertas capas de colisión. Usa esto junto con una capa de colisión personalizada, o para detectar solo la capa de physics o eventos de puntero. Consulta [capas de colisión](../3d-essentials/colliders.md#collision-layers). Por defecto, todas las capas se detectan.
* `originOffset`: En lugar de comenzar el raycast desde la posición de origen de la entidad, agrega un desplazamiento para comenzar la consulta desde una posición relativa. Puedes, por ejemplo, usar un pequeño desplazamiento para evitar que el rayo colisione contra el modelo 3D propio de la entidad.
* `continuous`: Si es true, seguirá ejecutando una consulta de raycast en cada frame. Si es false, el rayo solo se usará en el frame actual. Por defecto este valor es false.

{% hint style="warning" %}
**📔 Nota**: La propiedad `continuous` debe usarse con precaución, ya que ejecutar una consulta de raycast en cada frame puede ser muy costoso para el rendimiento. Cuando sea posible, usa un sistema (o la función `interval` en la biblioteca Utils) para ejecutar consultas de raycast a un intervalo regular más espaciado, consulta [raycasting recurrente](raycasting.md#recurrent-raycasting).
{% endhint %}

El siguiente ejemplo usa una rotación global para determinar la dirección, y solo devuelve la primera entidad que es impactada en el frame que se envía el rayo.

```typescript
const entity1 = engine.addEntity()

Transform.create(entity1, {
  position: Vector3.create(8, 1, 0)
})

Raycast.createOrReplace(entity1, {
  direction: {
    $case: "globalDirection",
    globalDirection: Vector3.create(0, 0, 1)
  }
  maxDistance: 16,
  queryType: RaycastQueryType.RQT_HIT_FIRST
})
```

El ejemplo a continuación lanza un rayo en la dirección hacia adelante de la entidad, devolviendo solo el primer elemento impactado. Lo hace continuamente. También incluye un desplazamiento menor de 0.5 para evitar que el rayo impacte el colisionador propio de la entidad.

```typescript
const entity1 = engine.addEntity()

Transform.create(entity1, {
  position: Vector3.create(8, 1, 0)
})

Raycast.createOrReplace(entity1, {
  direction: {
    $case: "localDirection",
    localDirection: Vector3.Forward()
  }
  maxDistance: 16,
  queryType: RaycastQueryType.RQT_HIT_FIRST,
  originOffset: Vector3.create(0.5, 0, 0),
  continuous: true
})
```

Este ejemplo traza un rayo entre dos entidades. Devuelve todas las entidades que son impactadas en el medio.

```ts
const entity1 = engine.addEntity()

Transform.create(entity1, {
  position: Vector3.create(8, 1, 0)
})

const entity2 = engine.addEntity()

Transform.create(entity2, {
  position: Vector3.create(0, 1, 8)
})

Raycast.createOrReplace(entity1, {
  direction: {
    $case: "targetEntity",
    targetEntity: entity2
  }
  maxDistance: 16,
  queryType: RaycastQueryType.RQT_QUERY_ALL
})
```

### Componente de resultados de raycast

{% hint style="warning" %}
**📔 Nota**: La forma más fácil de manejar resultados de raycast es usar `raycastEventSystem`, y registrar una función callback como parte de la misma declaración que crea el rayo. El componente `RaycastResult` se usa internamente por esa interfaz, pero también se expone para permitir lógica personalizada más avanzada.
{% endhint %}

Después de crear un componente Raycast, la entidad a la que se agrega este componente tendrá un componente `RaycastResult`. Este componente incluye información sobre cualquier impacto del rayo. Configura un sistema para verificar estos datos.

El componente `RaycastResult` contiene los siguientes datos:

* `globalOrigin`: La posición donde se originó el rayo, relativa a la escena.
* `direction`: La dirección global que el rayo estaba apuntando, como un `Vector3`.
* `hits`: Un array con un objeto por cada entidad que fue impactada. Si no hubo entidades impactadas, este array está vacío. Si el raycast usó `RaycastQueryType.RQT_HIT_FIRST`, este array solo contendrá un objeto.

Cada objeto en el array `hits` incluye:

* `entityId`: Número de Id de la entidad que fue impactada por el rayo.
* `meshName`: _String_ con el nombre interno del mesh específico en el modelo 3D que fue impactado. Esto es útil cuando un modelo 3D está compuesto por múltiples meshes.
* `position`: _Vector3_ para la posición donde el rayo intersectó con la entidad impactada (relativa a la escena)
* `length`: Longitud del rayo desde su origen hasta la posición donde ocurrió el impacto contra la entidad.
* `normalHit`: _Quaternion_ para el ángulo de la normal del impacto en espacio mundial.
* `globalOrigin`: _Vector3_ para la posición donde se origina el rayo (relativa a la escena)
* `direction`: La dirección global que el rayo estaba apuntando, como un `Vector3`.

El ejemplo a continuación muestra cómo puedes acceder a resultados de una entidad individual usando un sistema:

```typescript

const rayEntity = engine.addEntity()

Transform.create(rayEntity, {
  position: Vector3.create(8, 1, 0)
})

// devolver todas las entidades
Raycast.createOrReplace(rayEntity, {
  direction: {
    $case: "globalDirection",
    globalDirection: Vector3.create(0, 0, 1)
  }
  maxDistance: 16,
  queryType: RaycastQueryType.RQT_QUERY_ALL
})

engine.addSystem(() => {
  const rayResult = RaycastResult.get(rayEntity)
  console.log(rayResult.hits)
})
```

El siguiente ejemplo muestra cómo puedes acceder a componentes `RaycastResult` de todas las entidades en la escena, usando una [consulta de componentes](../architecture/querying-components.md).

```typescript
engine.addSystem(() => {
  for (const [_, result] of engine.getEntitiesWith(RaycastResult)) {
    console.log(result.hits)
  }
})
```

{% hint style="warning" %}
**📔 Nota**: Los resultados de un raycast no llegan en el mismo tick del bucle del juego en que creaste el raycast. Los resultados pueden tardar uno o múltiples ticks en llegar.
{% endhint %}

En una escena donde uses múltiples tipos de rayos para diferentes propósitos (como para pathfinding, verificación de línea de visión, rastreo de proyectiles, etc), es posible que desees usar diferentes [capas de colisión](../3d-essentials/colliders.md#collision-layers), para evitar calcular colisiones irrelevantes.
