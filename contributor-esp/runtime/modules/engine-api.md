El módulo `EngineApi` proporciona acceso al framework Entity-Component-System compartido entre el World Explorer (que ejecuta el loop del juego) y escenas individuales (que gestionan sus propias entidades), más utilidades relacionadas.

```ts
const engine = require("~system/EngineApi");
```

Este módulo es el más complejo y rico en funcionalidad, y el más probable de recibir actualizaciones y extensiones. Es donde reside la mayor parte del poder de Decentraland, ya que determina el tipo de experiencias que las personas pueden crear.

Este módulo contiene los siguientes métodos:

- [`function crdtSendToRenderer`](#crdtSendToRenderer)
- [`function crdtGetState`](#crdtGetState)

## Introduction

El módulo `EngineApi` está diseñado para sincronizar el estado del mundo entre el Explorer y la escena intercambiando actualizaciones, eventos y comandos. Implementa un protocolo de mensajes extensible que permite a las escenas, entre otras cosas:

- Crear y destruir entidades.
- Adjuntar, actualizar y remover componentes.
- Lanzar rayos en el entorno 3D y detectar impactos.
- Recibir eventos como entrada del jugador.

```
.------------------------------------------------------.
| World Explorer                                       |
|                                                      |
|                   [Engine API]                       |
|                        |                             |
|  .--------.            |              .------------. |
|  |        |<-----------+<-------------+  Runtime   | |
|  |  Game  |            |   Commands   |  .------.  | |
|  |        |   Events   |              |  | Scene | | |
|  | Engine +----------->+------------->|  |       | | |
|  |        |            |              |  '-------' | |
|  '--------'            |              '------------' |
|                                                      |
'------------------------------------------------------'

```

{% hint style="info" %}
El módulo `EngineApi` está atravesando renovaciones. Si vas a las definiciones fuente, encontrarás métodos legacy que ya no se usan o pueden implementarse como no-ops en la última versión (más sobre esto abajo).
{% endhint %}

## ECS Framework

Con el módulo `EngineApi` viene una implementación genérica y extensible de un framework ECS compartido, que permite tanto a escenas como al motor del juego mismo crear entidades, adjuntar componentes y actualizar sus estados.

Los cambios realizados desde cualquier lado se reflejan en el otro intercambiando mensajes. El mecanismo usado ([ver abajo](#synchronization)) asegura que ambas partes acuerden el orden de cualquier actualización y alcancen consistencia eventual sobre el estado del mundo.

El World Explorer implementa un conjunto bien conocido de componentes básicos (posiciones, formas, texturas, medios y más), y sabe cómo deserializar y aplicar cambios a su estado cuando recibe una actualización. Las escenas que usan el [SDK](https://docs.decentraland.org/creator) también tienen utilidades para crear componentes personalizados, pero esos son completamente gestionados por la escena (no sincronizados) y por lo tanto fuera del alcance del protocolo.

{% hint style="info" %}
La mayoría de las escenas usan el SDK de Decentraland, que encapsula el módulo `EngineApi` y ofrece una interfaz mucho más agradable y de alto nivel para desarrolladores de contenido. Las escenas que acceden directamente al protocolo de mensajería en este módulo son extremadamente raras.
{% endhint %}

### Identifying Entities {#identifying}

Los IDs de entidad son enteros simples comenzando con `0`.

Por protocolo, los IDs por debajo de `512` están reservados para el World Explorer, y por lo tanto son inválidos para entidades creadas por escenas. Los números `0`, `1` y `2` están actualmente en uso (ver [entidades básicas](../basic-entities.md)), con el resto del rango disponible para extensiones futuras.

Cada escena tiene su propio rango privado de IDs, que el Explorer puede mapear transparentemente a un identificador global entre todas las entidades en el motor del juego.

Con el tiempo, a medida que las entidades son creadas y eliminadas, es perfectamente válido reusar IDs que fueron liberados previamente -- de hecho, esto puede requerirse por razones de rendimiento ([ver abajo](#crdtStateDeleteEntities)).

### Synchronization {#synchronization}

Tanto el World Explorer como la escena deben gestionar un conjunto de entidades y componentes compartidos, donde las actualizaciones vienen desde ambos lados de manera asíncrona. Sin medidas adicionales, sus versiones del estado del mundo pueden (y lo harán) terminar siendo diferentes.

Para prevenir esto, se usa un CRDT ([conflict-free replicated data type](https://en.wikipedia.org/wiki/Conflict-free_replicated_data_type)) para alcanzar un acuerdo entre ambas partes intercambiando mensajes con actualizaciones. Esto ofrece varias ventajas:

- Ambas partes pueden actualizar el estado independientemente y concurrentemente.
- Los conflictos son gestionados por una estrategia de resolución compartida aplicada localmente por ambas partes.
- Ambas partes están garantizadas de converger a un estado compartido e idéntico.
- Aparte de una pequeña sobrecarga en el tamaño del mensaje, no se requieren coordinación adicional o ida y vuelta de mensajes.

{% hint style="info" %}
Esta página explica el uso del CRDT para sincronizar estado entre una escena ejecutándose localmente y el motor del juego, pero el verdadero potencial de este mecanismo yace en escenarios multijugador. Usando este protocolo, los jugadores pueden coordinar su estado de juego y compartir la misma experiencia.
{% endhint %}

Para que esto funcione, todos los mensajes deben ser conmutativos e idempotentes. Los mensajes fuera de orden pueden aplicarse incluso si una actualización intermedia supuestamente no fue recibida aún, y mensajes iguales pueden reprocesarse sin romper la consistencia.

Revisitemos el diagrama arquitectónico arriba, ahora enfocándonos en el CRDT:

```
.-------------------------------------------------------.
| World Explorer                                        |
|                                                       |
| .-------------.                       .------------.  |
| | Game Engine |                       |   Scene     | |
| |  .-------.  |                       |  .-------.  | |
| |  |       +--+-----------------------+->|       |  | |
| |  | CRDT  |  |     Sync Protocol     |  | CRDT  |  | |
| |  |       |<-+-----------------------+--+       |  | |
| |  '-------'  |                       |  '-------'  | |
| |             |                       |             | |
| '-------------'                       '-------------' |
'-------------------------------------------------------'

```

La implementación del mecanismo de sincronización CRDT consiste en tres partes:

1. Una representación interna del estado de todas las entidades y componentes.
2. Una estrategia de resolución de conflictos para elegir entre estados competidores.
3. Un protocolo de mensajería para comunicar y procesar actualizaciones al estado.

#### CRDT State {#crdtState}

El CRDT contiene el estado de todos los componentes para todas sus entidades adjuntas, y puede almacenarse en un mapeo de componentes a estados con marca de tiempo para cada entidad. En pseudocódigo:

```ts
// El estado (completamente genérico) de un componente para una entidad específica, en un punto en el tiempo:
type EntityComponentState = { timestamp: number; state: byte[] };

// El estado de un componente para todas las entidades adjuntas:
type ComponentState = Map<EntityId, EntityComponentState>;

// El estado completo del CRDT:
type CRDTState = Map<ComponentId, ComponentState>;
```

Los timestamps no son en realidad timestamps estilo Unix. Son un tipo de contador incremental para secuenciar actualizaciones, sin relación con el tiempo del reloj. Más sobre esto [abajo](#timestamps).

<div id="crdtStateAutoCreate"><!-- just an invisible anchor to link --></div>

Como la capa CRDT no conoce (o necesita conocer) todos los componentes disponibles, el estado inicial es un mapa vacío. Las entradas se crean al vuelo cuando las operaciones involucran un `ComponentId` o `EntityId` que no estaba ya mapeado. Cuando una entidad es removida, el estado asociado se elimina de todos los componentes.

Ilustremos esto con algo más de pseudocódigo.

```ts
const crdtState = new Map(); // vacío, haremos espacio automáticamente para nuevos componentes y entidades
```

```ts
function putEntityComponentState(componentId, entityId, entityComponentState) {
  // Si este componente no se conoce aún, agregarlo:
  if (!crdtState[componentId]) {
    crdtState[componentId] = new Map();
  }

  // Si esta entidad no tiene estado para este componente, agregarlo y terminar:
  if (!crdtState[componentId][entityId] && shouldCreate(entityId)) {
    crdtState[componentId][entityId] = entityComponentState;
    return;
  }

  // En este punto, tenemos dos estados competidores. El que acabamos de recibir no es necesariamente el
  // que debe mantenerse. Necesitamos decidir.
  const existingEntityComponentState = crdtState[componentId][entityId];

  // Solo si las reglas de resolución de conflictos lo dicen (más sobre esto después), reemplazar el estado:
  if (shouldReplace(entityComponentState, existingEntityComponentState)) {
    crdtState[componentId][entityId] = entityComponentState;
  }
}
```

El pseudocódigo arriba (si se traduce a código real) obviamente está incompleto y es sub-óptimo. En particular, está faltando la definición de `shouldCreate` y `shouldReplace`, que encapsulan la estrategia de resolución de conflictos. Estos tienen requisitos:

- `shouldCreate` debe agregar nuevas entidades, pero rechazar recrear entidades eliminadas.
- `shouldReplace` debe preferir mantener estados que tengan timestamps mayores (con algunos casos extremos).

<div id="crdtStateDeleteEntities"><!-- just an invisible anchor to link --></div>

Para soportar el requisito `shouldCreate`, querrás hacer seguimiento de IDs de entidad eliminados, para ignorar cualquier actualización de estado futura para esos. Veamos esto en más pseudocódigo:

```ts
const crdtDeletedEntities = new Set();

function shouldCreate(entityId) {
  return !crdtDeletedEntities.contains(entityId);
}

function deleteEntity(entityId) {
  // Marcar esta entidad como eliminada:
  crdtDeletedEntities.add(entityId);

  // Eliminar el estado para esta entidad en cada componente:
  for (componentState of crdtState) {
    delete componentState[entityId];
  }
}
```

{% hint style="info" %}
Ten en cuenta que, en la implementación ingenua arriba, el conjunto de entidades eliminadas solo crecerá. En escenas que reciclan rápidamente entidades, esto puede llevar a una explosión en el uso de memoria.

Para evitar esto, el explorer de la Foundation emplea un índice generacional para reusar IDs en un espacio numérico finito, limitando la cantidad de memoria requerida para hacer seguimiento tanto de entidades activas como eliminadas.
{% endhint %}

En cuanto al requisito `shouldReplace`, ver [resolución de conflictos](#crdtConflicts) abajo.

#### Timestamps {#timestamps}

Como se mencionó arriba, cuando hablamos de timestamps CRDT no nos referimos a timestamps Unix reales para un punto en el tiempo. En su lugar, se usa un [Lamport timestamp](https://en.wikipedia.org/wiki/Lamport_timestamp) (un tipo especial de contador incremental compartido) para hacer seguimiento de la secuencia de eventos por ambas partes.

El valor de este contador se actualiza según estas reglas:

1. Inicializar el contador local a `0`.
2. Antes de enviar un mensaje a partes remotas, incrementar el contador local.
3. Después de recibir un mensaje de una parte remota, establecer el contador local al máximo entre su valor y el valor recibido, más `1`.

En pseudocódigo:

```ts
const localTimestamp = 0;

function sendState(state) {
  send({ state, timestamp: ++localTimestamp });
}

function receiveState() {
  const { state, timestamp } = receive();
  localTimestamp = max(localTimestamp, remoteTimestamp) + 1;
}
```

#### Conflict Resolution {#crdtConflicts}

Cuando el CRDT encuentra dos estados competidores, necesita una estrategia de resolución compartida que todas las partes apliquen idénticamente, asegurando que todos alcancen la misma decisión. El protocolo de Decentraland usa reglas muy simples:

1. Si la entidad fue eliminada (y el ID nunca reutilizado), ignorar nuevo estado.
2. Si no había estado previo, mantener el nuevo estado.
3. Si el nuevo estado tiene un timestamp mayor, mantener el nuevo estado.
4. Si el nuevo estado tiene un timestamp menor, mantener el estado antiguo.
5. Si ambos timestamps son iguales, comparar los estados byte por byte y mantener el valor menor.

La mayoría de casos serán resueltos por las reglas `1`, `2` y `3`.

#### Initial Synchronization

Antes de que una escena comience a ejecutar su propio código, el runtime puebla el CRDT con el estado de todas las [entidades básicas](../basic-entities.md) y sus componentes.

Durante esta sincronización inicial, solo el runtime puede establecer el estado compartido. La escena no tiene permitido hacer modificaciones hasta que el proceso esté completo.

#### Messaging Protocol {#messages}

Los mensajes entre el World Explorer y el runtime de escena son estructuras en una representación binaria serializada. Cada mensaje lleva un encabezado indicando el tipo y longitud, seguido de un payload particular para cada tipo de mensaje.

```
.----------------.--------------.---------------------------------.
| length: uint32 | type: uint32 |     payload: byte[length]       |
'----------------'--------------'---------------------------------'
╵         common fields         ╵         type-dependent          ╵

```

Hay tres tipos de mensaje en el protocolo CRDT:

- [`PutComponent`](#PutComponentMessage)
- [`DeleteComponent`](#DeleteComponentMessage)
- [`DeleteEntity`](#DeleteEntityMessage)

Ten en cuenta que no hay mensajes `CreateComponent` o `CreateEntity`. Las reglas CRDT auto-crean entidades y componentes que no se conocían previamente, como [se explicó arriba](#crdtStateAutoCreate).

##### `PutComponentMessage` {#PutComponentMessage}

Actualizar el `state` de un `component` para una `entity` particular, creando componentes y entidades desconocidos en el CRDT si es necesario. [Resolver conflictos](#crdtConflicts) según `timestamp`.

```
.----------------.-------------------.-------------------------------------------.
| entity: uint32 | component: uint32 | timestamp: uint32 |     state: byte[]     |
'----------------'-------------------'-------------------------------------------'
╵                       common fields                    ╵  component-dependent  ╵

```

El campo `state` es una serialización binaria definida por el componente. La mayoría de componentes usan [protocol buffers](https://protobuf.dev) para codificar mensajes como se especifica en los archivos `.proto` del [paquete de protocolo de Decentraland](https://github.com/decentraland/protocol). La excepción notable a esta regla es el componente `Transform`, que (siendo el más común por lejos) tiene un formato de serialización optimizado.

Esta capa adicional de serialización tiene una ventaja importante: el protocolo CRDT es agnóstico a cualquier implementación de componente presente o futura.

Si la actualización contenida en este mensaje se aplica al CRDT, el campo `state` se copia tal cual en la estructura.

##### `DeleteComponentMessage` {#DeleteComponentMessage}

Remover el estado de `component` para una `entity`. [Resolver conflictos](#crdtConflicts) según `timestamp`.

```
.----------------.-------------------.-------------------.
| entity: uint32 | component: uint32 | timestamp: uint32 |
'----------------'-------------------'-------------------'

```

##### `DeleteEntityMessage` {#DeleteEntityMessage}

Eliminar `entity` (es decir, todo el estado de componente asociado), esperando que el identificador nunca sea reutilizado para una entidad diferente.

```
.----------------.
| entity: uint32 |
'----------------'

```

Ten en cuenta que no hay campo `timestamp`. Como el tiempo de vida de `entity` terminó, la estrategia de resolución de conflictos para cualquier actualización fuera de orden es simplemente ignorarlas.

## Methods

El conjunto de métodos en `EngineApi` proporciona la interfaz para intercambiar mensajes y reconstruir el estado del mundo desde cero.

##### `crdtSendToRenderer` {#crdtSendToRenderer}

Enviar un mensaje serializado desde la escena al renderizador, devolver un array de mensajes serializados que el renderizador tiene para la escena.

```ts
interface Request {
  // El mensaje serializado para esta solicitud:
  data: byte[];
}

interface Response {
  // Un array de mensajes serializados del renderizador (si hay):
  data: byte[][];
}

function crdtSendToRenderer(Request): Promise<Response>;
```

##### `crdtGetState` {#crdtGetState}

```ts
interface Request {}

interface Response {
  // Si el estado tiene entidades creadas por escena:
  hasEntities: boolean;

  // Un array de mensajes que pueden reconstruir el estado CRDT:
  data: byte[][];
}

function crdtGetState(Request): Promise<Response>;
```

## Legacy Scenes

Las escenas de estilo antiguo (es decir, aquellas construidas usando la versión 6 del SDK o anterior) no usan el mecanismo CRDT moderno, en su lugar llaman métodos en `EngineApi` que ahora están obsoletos.

El soporte para estas escenas no es un requisito para una aplicación de Decentraland compatible con el protocolo.
