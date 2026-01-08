---
description: >-
  Usar un servidor para sincronizar cambios en la escena para todos los
  jugadores
metaLinks:
  alternates:
    - >-
      https://app.gitbook.com/s/oPnXBby9S6MrsW83Y9qZ/scenes-sdk7/networking/authoritative-servers
---

# Servidores Autoritativos

Decentraland ejecuta escenas localmente en el navegador de un jugador. Por defecto, los jugadores pueden verse e interactuar directamente entre sí, pero cada uno interactúa con el entorno de manera independiente. Los cambios en el entorno no se comparten entre jugadores por defecto. Debes implementar esto manualmente.

Permitir que todos los jugadores vean una escena teniendo el mismo contenido en el mismo estado es extremadamente importante para que los jugadores interactúen de maneras más significativas. Sin esto, si un jugador abre una puerta y entra a una casa, otros jugadores verán esa puerta como aún cerrada, y el primer jugador parecerá caminar directamente a través de la puerta cerrada para otros jugadores.

* **Marcar una entidad como sincronizada**: La opción más fácil. Consulta [Marcar una entidad como sincronizada](../sdk7/networking/serverless-multiplayer.md#mark-an-entity-as-synced)
* **Enviar Mensajes MessageBus Explícitos**: Enviar y escuchar manualmente mensajes específicos. Consulta [Enviar mensajes MessageBus explícitos](../sdk7/networking/serverless-multiplayer.md#send-explicit-messagebus-messages)
* **Usar un Servidor**: Este documento trata sobre esta opción. Esta opción requiere más trabajo para configurar, pero es recomendable si hay incentivos para explotar tu escena.

### Tipos de servidores

Un servidor puede tener diferentes niveles de participación con la escena:

* API + DB: Esto es útil para escenas donde los cambios no ocurren constantemente y donde es aceptable tener retrasos menores en la sincronización. Cuando un jugador cambia algo, envía una solicitud HTTP a una API REST que almacena el nuevo estado de la escena en una base de datos. Los cambios se mantienen almacenados para cualquier jugador nuevo que visite la escena en una fecha posterior. La principal limitación es que los nuevos cambios de otros jugadores no se notifican a los jugadores que ya están allí, los mensajes no pueden enviarse desde el servidor a los jugadores. Los jugadores deben enviar regularmente solicitudes al servidor para obtener el último estado.

{% hint style="info" %}
**💡 Tip**: También es posible optar por un enfoque híbrido donde los cambios se notifican entre jugadores a través de mensajes Messagebus, pero el estado final también se almacena a través de una API para futuros visitantes.
{% endhint %}

* Websockets: Esta alternativa es más robusta, ya que establece un canal de comunicación bidireccional entre jugador y servidor. Las actualizaciones pueden enviarse desde el servidor, incluso podrías tener lógica de juego ejecutándose o validándose en el servidor. Esto habilita interacción en tiempo real y hace posibles juegos de ritmo más rápido. También es más seguro, ya que cada mensaje entre jugador y servidor es parte de una sesión que se abre, no hay necesidad de validar cada mensaje.

### Escenas de ejemplo con servidor dedicado

API + DB:

* [Leaderboard](https://github.com/decentraland/sdk7-goerli-plaza/tree/main/leader-board)
* [Guestbook](https://github.com/decentraland/sdk7-goerli-plaza/tree/main/guest-book-api)
* [Validate authenticity](https://github.com/decentraland/sdk7-goerli-plaza/tree/main/validate-player-authenticity)

### Vista previa de escenas con servidores dedicados

Para previsualizar una escena que usa un servidor de terceros, debes ejecutar tanto la escena como el servidor del que depende. El servidor puede ejecutarse localmente en la misma máquina que la vista previa, como una forma más fácil de probarlo. Al ejecutarse localmente, el servidor puede usar conexiones `http` o `ws` no seguras, para una configuración más fácil.

Para iniciar el servidor, ve a la carpeta `/server` y ejecuta `npm run start`.

Una vez que el servidor esté ejecutándose, ya sea remotamente o localmente, puedes ejecutar tu escena como normalmente lo haces.

#### Probar una escena multijugador localmente

Si lanzas una vista previa de escena y la abres en dos (o más) ventanas diferentes del explorador, cada ventana abierta será interpretada como un jugador separado, y un servidor de comunicaciones simulado mantendrá a estos jugadores sincronizados.

Interactúa con la escena en una ventana, luego cambia a la otra para ver que los efectos de esa interacción también son visibles allí.

Usando el Creator Hub, haz clic en el botón Preview una segunda vez, y eso abre una segunda ventana del explorador de Decentraland. Debes conectarte en ambas ventanas con direcciones diferentes. Las mismas sesiones permanecerán abiertas mientras la escena se recarga.

Como alternativa, puedes abrir una segunda ventana del explorador de Decentraland escribiendo lo siguiente en una URL del navegador:

> `decentraland://realm=http://127.0.0.1:8000&local-scene=true&debug=true`

### Realms separados

Los jugadores en decentraland existen en muchos _realms_ separados. Los jugadores en diferentes realms no pueden verse, interactuar o chatear entre sí, incluso si están parados en las mismas parcelas. Dividir a los jugadores de esta manera permite a Decentraland manejar una cantidad ilimitada de jugadores sin encontrarse con limitaciones. También empareja jugadores que están en regiones cercanas, para asegurar que los tiempos de ping entre jugadores que interactúan sean aceptables.

Si tu escena envía datos a un servidor de terceros para sincronizar cambios entre jugadores en tiempo real, entonces es importante que los cambios solo se sincronicen entre jugadores que estén en el mismo realm. Debes manejar todos los cambios que pertenecen a un realm como separados de aquellos en un realm diferente. De lo contrario, los jugadores verán cosas cambiar de una manera espeluznante, sin nadie haciendo el cambio.

Consulta cómo obtener el realm para cada jugador en [obtener datos del jugador](../sdk7/interactivity/user-data.md)

### Persistencia multijugador

A diferencia de las escenas locales que se montan nuevamente cada vez que un jugador entra a ellas, las escenas que usan servidores de terceros tienen un lapso de vida que se extiende mucho más allá de cuando el jugador entra y sale de la escena.

Por lo tanto, debes diseñar la experiencia teniendo en cuenta que los jugadores no siempre encontrarán la escena en el mismo estado inicial. Cualquier cambio hecho a la escena persistirá para que otros jugadores lo encuentren, debes asegurarte de que estos no interfieran con las experiencias de futuros jugadores de una manera no deseada.

#### Restablecer el estado

Al cargar la escena, asegúrate de que esté construida basándose en la información compartida almacenada en el servidor, y no en un estado predeterminado.

En algunos casos, tiene sentido incluir algún tipo de botón de reinicio en la escena. Presionar el botón de reinicio reiniciaría la escena con gracia.

A veces, esto solo implica establecer las variables en el estado de la escena de vuelta a valores predeterminados. Pero reiniciar la escena también puede implicar desuscribirse de listeners y detener loops en el lado del servidor. Si loops vacíos permanecen cada vez que se reinicia la escena, estos se seguirían acumulando y tendrían un efecto negativo en el rendimiento de la escena.
