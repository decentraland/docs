---
description: Sincroniza el estado de la escena entre jugadores.
metaLinks:
  alternates:
    - >-
      https://app.gitbook.com/s/oPnXBby9S6MrsW83Y9qZ/scenes-sdk7/networking/serverless-multiplayer
---

# Multijugador sin Servidor

Decentraland ejecuta escenas localmente en el navegador de un jugador. Por defecto, los jugadores pueden verse e interactuar directamente entre sí, pero cada jugador interactúa con el entorno de manera independiente. Los cambios en el entorno no se comparten entre jugadores por defecto.

Ver el mismo contenido en el mismo estado es extremadamente importante para que los jugadores interactúen de maneras más significativas.

Hay tres formas de sincronizar el estado de la escena, para que todos los jugadores vean lo mismo:

* **Marcar una entidad como sincronizada**: La opción más fácil. Consulta [Marcar una entidad como sincronizada](serverless-multiplayer.md#mark-an-entity-as-synced)
* **Enviar Mensajes MessageBus Explícitos**: Enviar y escuchar manualmente mensajes específicos. Consulta [Enviar mensajes MessageBus explícitos](serverless-multiplayer.md#send-explicit-messagebus-messages)
* **Usar un Servidor**: Consulta [servidores de terceros](../sdk7/networking/authoritative-servers.md). Esta opción es más complicada de configurar, pero es recomendable si los jugadores tienen incentivos para explotar tu escena.

Las primeras dos opciones están cubiertas en este documento. Son más simples, ya que no requieren servidor. La desventaja es que dependes más de las velocidades de conexión de los jugadores, y el estado de la escena no se persiste cuando todos los jugadores salen de la escena.

### Marcar una Entidad como Sincronizada

En el [Creator Hub](../scene-editor/get-started/about-editor.md), marca una entidad como sincronizada agregando un componente **Multiplayer** a ella. Incluye una casilla de verificación para cada uno de los otros componentes en la entidad, permitiéndote seleccionar cuáles actualizar.

Para marcar una entidad como sincronizada a través de código, usa la función `syncEntity`:

```ts
import { syncEntity } from '@dcl/sdk/network'

const doorEntity = engine.addEntity()

syncEntity(doorEntity, [Transform.componentId, Animator.componentId], 1)
```

La función `syncEntity` toma las siguientes entradas:

* **entityId**: Una referencia a la entidad a sincronizar
* **componentIds**: Una lista de los componentes que necesitan sincronizarse de esa entidad. Este es un arreglo que puede contener tantas entidades como sea necesario. Todos los valores deben ser propiedades `componentId`.
* **entityEnumId**: (opcional) Un id único que se usa consistentemente por todos los jugadores, consulta [Acerca del enum id](serverless-multiplayer.md#about-the-enum-id).

No todas las entidades o componentes necesitan sincronizarse. Elementos estáticos como un árbol que permanece en el mismo lugar no requieren sincronización. En las entidades que sí sincronices, solo los componentes que cambian con el tiempo deben sincronizarse. Por ejemplo, si un cubo cambia de color cuando se hace clic, solo debes sincronizar el componente Material, no el MeshRenderer o el Transform, ya que esos nunca cambiarán.

{% hint style="info" %}
**💡 Tip**: Si los datos que quieres compartir no existen como un componente, define un [componente personalizado](../sdk7/architecture/custom-components.md) que contenga esos datos.
{% endhint %}

#### Acerca del enum id

El **entityEnumId** de una entidad debe ser único. No está relacionado con el entityId local asignado en `engine.addEntity()`, que se genera automáticamente y puede variar entre jugadores ejecutando la misma escena. El entityEnumId de una entidad debe definirse explícitamente en el código y ser único.

Establecer explícitamente este ID es importante para evitar inconsistencias si una condición de carrera hace que una parte de la escena cargue antes que otra. Tal vez para el jugador A la puerta en la escena sea la entidad _512_, pero para el jugador B esa misma puerta es la entidad _513_. En ese caso, si el jugador A abre la puerta, el jugador B en su lugar verá todo el edificio moverse.

{% hint style="info" %}
**💡 Tip**: Crea un enum en tu escena, para mantener referencias claras a cada id sincronizable en tu escena.

```ts
import { syncEntity } from '@dcl/sdk/network'

enum EntityEnumId {
	DOOR = 1,
	DRAW_BRIDGE = 2,
	ELEVATOR = 3,
}

syncEntity(
	doorEntity,
	[Transform.componentId, Animator.componentId],
	EntityEnumId.DOOR
)
```

Aquí el enum EntityEnumId se usa para etiquetar entidades con un identificador único, asegurando que cada cliente reconozca la entidad modificada, independientemente del orden de creación.
{% endhint %}

{% hint style="warning" %}
**📔 Nota**: Evita usar números mayores a **8001** si tu escena también incluye Smart Items. Los ítems que se crean por el [Creator Hub](../scene-editor/get-started/about-editor.md) con un componente Multiplayer usarán IDs asignados automáticamente desde 8001 en adelante. Cualquier ID menor a 8001 es seguro para asignar a tus entidades sincronizadas.
{% endhint %}

**Entidades creadas por un jugador**

En algunos casos, los jugadores pueden crear nuevas entidades en la escena, por ejemplo instanciando proyectiles. Puedes usar `syncEntity` en estas entidades dinámicas, omitiendo el parámetro `entityEnumId`. El SDK generará automáticamente un id único para la nueva entidad y lo compartirá con otros jugadores.

```ts
const projectile = engine.addEntity()
syncEntity(projectile, [Transform.componentId])
```

En este caso, el `entityEnumId` es opcional, ya que el SDK asignará automáticamente un ID único de tiempo de ejecución que compartirá entre jugadores.

### Enviar mensajes MessageBus explícitos

Otra opción es enviar y escuchar mensajes explícitos a través del MessageBus.

Consulta [Message Bus](../sdk7/interactivity/event-listeners.md#message-bus) para obtener detalles completos sobre cómo enviar y escuchar mensajes entre jugadores.

El enfoque con MessageBus te da más control sobre qué información se sincroniza y cuándo. Es más trabajo extra, pero puede ser más eficiente con el ancho de banda, ya que puedes decidir exactamente qué valores transmitir, en lugar de todo el componente.

Ten en cuenta que con MessageBus debes ser más cuidadoso para asegurar consistencia entre jugadores. Con `syncEntity`, cada jugador mantiene una copia de toda la entidad sincronizada, cada uno con sus propios componentes. Con MessageBus, puedes enviar solo un valor booleano para indicar que se interactuó con algo, pero debes asegurarte de que todos los jugadores respondan de la misma manera. Por ejemplo, si cambias un color en base a un generador de números aleatorios, debes enviar el número aleatorio en el mensaje, en lugar de simplemente un comando para cambiar el color. De lo contrario, cada jugador verá un color diferente.

```ts
import { getPlayer, getPlayerData } from '@dcl/sdk/players'
import { signedFetch } from '~system/SignedFetch'

executeTask(async () => {
	try {
		const player = getPlayer()
		const playerData = getPlayerData(player.userId)

		let body = JSON.stringify({
			playerId: player.userId,
			playerName: playerData?.displayName,
		})

		let response = await signedFetch({
			url: `<my server>`,
			init: {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: body,
			},
		})

		if (!response || !response.text) {
			throw new Error('Invalid response')
		}

		let json = JSON.parse(response.text)
		console.log('Response: ', json)
	} catch (e) {
		console.log('error fetching from server ', e)
	}
})
```
