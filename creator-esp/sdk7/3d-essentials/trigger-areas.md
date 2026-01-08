---
description: Aprende cómo usar áreas de activación en tu escena
metaLinks:
  alternates:
    - >-
      https://app.gitbook.com/s/oPnXBby9S6MrsW83Y9qZ/scenes-sdk7/3d-essentials/trigger-areas
---

# Áreas de activación

Las áreas de activación te permiten reaccionar al evento de un jugador entrando o saliendo de un área, o de cualquier otra entidad entrando o saliendo de un área. Esta es una herramienta fundamental para crear escenas interactivas. Úsalas para cosas como abrir una puerta cuando el jugador se acerca, o para anotar un punto cuando una pelota entra en una portería.

## Usar áreas de activación

Para usar áreas de activación necesitas agregar un componente `TriggerArea` a una entidad, luego usar un `triggerAreaEventsSystem` para reaccionar a los eventos.

```ts
import { engine, Transform, TriggerArea, triggerAreaEventsSystem } from '@dcl/sdk/ecs'

// crear entidad
const triggerEntity = engine.addEntity()

// establecer Transform
Transform.create(triggerEntity, {
  position: Vector3.create(8, 0, 8)
  })

// Área de activación
TriggerArea.setBox(triggerEntity)

// Evento cuando se activa el área de activación
triggerAreaEventsSystem.onTriggerEnter(triggerEntity, function(result) {
  console.log('¡El jugador entró al área de activación!')
})
```

## Formas de áreas de activación

Las áreas de activación pueden ser una caja o una esfera.

```ts
import { engine, Transform, TriggerArea } from '@dcl/sdk/ecs'

// Caja
TriggerArea.setBox(triggerEntity)

// Esfera
TriggerArea.setSphere(triggerEntity)
```

{% hint style="info" %}
**💡 Consejo**: La esfera es la forma más fácil de calcular para el motor, ya que se logra verificando la distancia desde el centro de la esfera. En caso de duda, usa una esfera.
{% endhint %}

Para alterar el tamaño del área de activación, puedes usar la propiedad `scale` del componente `Transform` en la entidad que contiene el `TriggerArea`.

```ts
import { engine, Transform, TriggerArea } from '@dcl/sdk/ecs'

const triggerEntity = engine.addEntity()

TriggerArea.setBox(triggerEntity)

Transform.create(triggerEntity, {
  scale: Vector3.create(4, 2, 4),
})
```

### Depuración

Para depurar tu escena y ver el área cubierta por el área de activación, puedes agregar un componente `MeshShape` a la entidad con el área de activación, y establecer la forma a la que deseas depurar. Las dimensiones del mesh predeterminado coincidirán con las dimensiones del área de activación.

```ts
import { engine, Transform, TriggerArea } from '@dcl/sdk/ecs'

const triggerEntity = engine.addEntity()

TriggerArea.setBox(triggerEntity)

MeshRenderer.setBox(triggerEntity)

Transform.create(triggerEntity, {
  position: Vector3.create(8, 0, 8),
})
```

## Eventos de áreas de activación

Puedes usar el `triggerAreaEventsSystem` para reaccionar a los diferentes eventos de un área de activación:

* `onTriggerEnter`: Se activa cuando una entidad entra al área de activación.
* `onTriggerExit`: Se activa cuando una entidad sale del área de activación.
* `onTriggerStay`: Se activa mientras una entidad está en el área de activación, en cada fotograma.

```ts
import { engine, Transform, TriggerArea, triggerAreaEventsSystem } from '@dcl/sdk/ecs'

const triggerEntity = engine.addEntity()

TriggerArea.setBox(triggerEntity)

// Al entrar
triggerAreaEventsSystem.onTriggerEnter(triggerEntity, function(result) {
  console.log('¡El jugador entró al área de activación!')
})

// Al salir
triggerAreaEventsSystem.onTriggerExit(triggerEntity, function(result) {
  console.log('¡El jugador salió del área de activación!')
})

// Mientras está dentro
triggerAreaEventsSystem.onTriggerStay(triggerEntity, function(result) {
  console.log('¡El jugador está en el área de activación!')
})
```

## Respuestas de eventos de activación

Cuando se activa un evento de área de activación, puedes usar el parámetro `result` para obtener información sobre la entidad que fue activada y la entidad que activó el evento.

Las siguientes propiedades están disponibles en el parámetro `result`:

* `triggeredEntity`: El ID de la entidad que fue activada (esta es la entidad que posee el área de activación)
* `triggeredEntityPosition`: La posición de la entidad que fue activada
* `triggeredEntityRotation`: La rotación de la entidad que fue activada
* `eventType`: El tipo de evento de activación (ENTER, EXIT, STAY)
* `timestamp`: La marca de tiempo del evento de activación
* `trigger`: Un objeto con los siguientes campos:
  * `entity`: El ID de la entidad que activó el trigger (la entidad que entró al área de activación)
  * `layer`: La capa de colisión de la entidad que activó el trigger
  * `position`: La posición de la entidad que activó el trigger
  * `rotation`: La rotación de la entidad que activó el trigger
  * `scale`: La escala de la entidad que activó el trigger

```ts
import { engine, Transform, TriggerArea, triggerAreaEventsSystem } from '@dcl/sdk/ecs'

// Área de activación
const triggeredEntity = engine.addEntity()

TriggerArea.setBox(triggerEntity)

Transform.create(triggerEntity, {
  position: Vector3.create(8, 0, 8),
})

// Entidad que activará el área de activación
const triggerEntity = engine.addEntity()

const triggeredEntity = engine.addEntity()

Transform.create(triggeredEntity, {
  position: Vector3.create(8, 0, 8),
})

// Al entrar
triggerAreaEventsSystem.onTriggerEnter(triggerEntity, function(result) {
  console.log('¡Una entidad entró al área de activación!', result.triggeredEntity)
  console.log('Posición de la entidad activada: ', result.triggeredEntityPosition)
  console.log('Rotación de la entidad activada: ', result.triggeredEntityRotation)
  console.log('Tipo de evento: ', result.eventType)
  console.log('Timestamp: ', result.timestamp)
  console.log('Entidad trigger: ', result.trigger.entity)
  console.log('Capa trigger: ', result.trigger.layer)
  console.log('Posición trigger: ', result.trigger.position)
  console.log('Rotación trigger: ', result.trigger.rotation)
  console.log('Escala trigger: ', result.trigger.scale)
})
```

## Capas de áreas de activación

Usa el segundo argumento opcional del componente `TriggerArea` para establecer las capas que activarán el área de activación.

Por defecto, el área de activación se activa solo por el jugador, a través de la capa `ColliderLayer.CL_PLAYER`. Puedes cambiar esto a cualquier otra capa de colisión pasándola como segundo argumento del componente `TriggerArea`.

```ts
import { engine, Transform, TriggerArea, MeshCollider, triggerAreaEventsSystem } from '@dcl/sdk/ecs'

// Área de activación
const triggerEntity = engine.addEntity()

TriggerArea.setBox(triggerEntity, ColliderLayer.CL_CUSTOM1)

Transform.create(triggerEntity, {
  position: Vector3.create(8, 0, 8),
})

// Entidad que activará el área de activación
const movingEntity = engine.addEntity()

Transform.create(movingEntity, {
  position: Vector3.create(8, 0, 8),
})

MeshCollider.setBox(movingEntity, ColliderLayer.CL_CUSTOM1)
```

Los valores permitidos son los mismos que los del componente `MeshCollider`. Consulta [Capas de colisión](colliders.md#Collision-layers) para más detalles.

* `ColliderLayer.CL_PHYSICS`
* `ColliderLayer.CL_POINTER`
* `ColliderLayer.CL_CUSTOM1` hasta `CL_CUSTOM8`
* `ColliderLayer.CL_NONE`

{% hint style="info" %}
**💡 Consejo**: Las capas `CL_CUSTOM1` hasta `CL_CUSTOM8` no tienen ningún comportamiento especial por sí mismas, puedes usarlas para lo que mejor se adapte a tu escena.
{% endhint %}

También puedes configurar un área de activación para detectar múltiples capas a la vez.

```ts
import { engine, Transform, TriggerArea, triggerAreaEventsSystem } from '@dcl/sdk/ecs'

const triggerEntity = engine.addEntity()

TriggerArea.setBox(triggerEntity, ColliderLayer.CL_CUSTOM1 | ColliderLayer.CL_CUSTOM2)

Transform.create(triggerEntity, {
  position: Vector3.create(8, 0, 8),
})
```

Esto activará el área de activación cuando cualquier entidad con las capas `CL_CUSTOM1` o `CL_CUSTOM2` entre al área de activación.
