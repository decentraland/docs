---
description: Lo que necesitas tener en cuenta al diseñar un juego para Decentraland.
metaLinks:
  alternates:
    - >-
      https://app.gitbook.com/s/oPnXBby9S6MrsW83Y9qZ/scenes-sdk7/design-experience/design-games
---

# Diseño de Juegos

Este documento cubre algunos puntos clave a considerar al diseñar un juego para Decentraland. Consideraciones como la proximidad de otras escenas y la propiedad distribuida de LAND hacen de Decentraland un lugar único que te obliga a reconsiderar suposiciones que puedes tener de juegos anteriores.

Por ejemplo, debes entender que, a diferencia de otras plataformas de juegos, los juegos de Decentraland no existen en el vacío. No tienes control sobre lo que hay en las escenas adyacentes, y no tienes control sobre ciertos detalles como los avatares de los jugadores o los objetos que podrían traer de otros juegos. Esto abre la puerta a posibilidades emocionantes y requiere que pienses sobre las mecánicas del juego de manera diferente.

Lo más cercano en los juegos mainstream actualmente es Roblox, donde el contenido generado por usuarios de la comunidad puede ser un punto de encuentro para que otros exploren, jueguen e interactúen. A diferencia de Roblox, navegas las escenas no explorando un menú de experiencias no relacionadas, sino explorando físicamente un terreno donde todas las escenas son adyacentes entre sí. Decentraland también hace uso del blockchain como una forma de gestionar la propiedad de land, avatares, assets, etc.

Estamos mejorando continuamente el SDK, por lo que algunas de las siguientes limitaciones se eliminarán con futuras actualizaciones antes de que Decentraland se abra a los usuarios finales.

### Límites de escena

**Tu juego debe caber completamente en el \_LAND**\_\*\* sobre el que se construye tu escena.\*\* Para escenas pequeñas, piensa en juegos como fútbol donde las reglas del juego mantienen la interacción relevante dentro de un espacio confinado, aunque los jugadores puedan salir del campo de juego. Los jugadores pueden caminar fuera de los límites de una escena, pero cualquier asset o entidades que pertenezcan a la escena deben permanecer dentro de la escena.

Los jugadores que salen de tu escena continúan renderizándola mientras esté en un rango visible. Si se alejan demasiado, dejarán de renderizarla por completo.

También podrías construir un juego que se extienda a través de varias parcelas de terreno desconectadas que son desconocidas para los jugadores, y donde la exploración del resto del mundo se convierte en parte del gameplay. Un juego así estaría compuesto por múltiples _escenas_ separadas, que podrían compartir datos entre sí a través de un servidor.

#### Inventario del usuario

**Actualmente no hay un inventario donde los jugadores puedan almacenar objetos del juego mientras caminan entre escenas.** Las siguientes alternativas están disponibles hoy:

* Puedes almacenar información del inventario en la escena misma y vincularla a la dirección de Ethereum de cada jugador (esto puede usarse como un id persistente). Esta información solo sería legible desde tu escena.
* Puedes usar un almacenamiento externo personalizado y sincronizar todas tus escenas con él. Esta es una solución más robusta que puede manejar mayores volúmenes de jugadores. También puede extender el acceso a este inventario a múltiples escenas separadas que tú u otros posean.
* Usa tokens en el blockchain para manejar la propiedad de los objetos.

Al ganar un objeto del juego, podría almacenarse como un token especial en el wallet de Ethereum de un jugador. Cuando un jugador que posee el token ingresa a tu escena, tu escena podría otorgarle al jugador ciertas características dentro del juego.

Otras escenas también podrían responder al mismo token de diferentes maneras, lo que puede crear una interacción interesante entre juegos.

La desventaja de usar el blockchain para almacenar objetos del inventario es que todas las transacciones tienen un costo para el jugador y no son inmediatas. Lee más sobre el blockchain en una sección especializada más abajo.

En futuras versiones, los jugadores tendrán un inventario que llevan a todas partes que incluirá assets on-chain y off-chain.

#### Experiencias portables

{% hint style="warning" %}
**📔 Nota**: Las experiencias portables y los smart wearables aún están en una etapa exploratoria y aún no están disponibles para que los creadores de la comunidad los hagan.
{% endhint %}

Las experiencias portables son partes del gameplay que los jugadores llevan consigo mientras se mueven por el metaverso. Estas no están vinculadas a parcelas de terreno, a veces están vinculadas a tokens, o a veces las lanza el explorador. Por ejemplo, un jugador podría tomar una bola de nieve de tu escena, alejarse a otra escena y lanzar la bola de nieve a otro jugador que también está jugando el mismo juego.

Los smart wearables son un tipo de experiencia portable que está vinculada a un token wearable y se activa cuando el jugador se pone el artículo de ropa. Los smart wearables pueden otorgar a los jugadores nuevas habilidades, como un jetpack que les permite volar, o agregar una nueva capa de contenido sobre el resto del mundo, como colocar aleatoriamente monedas para recolectar en toda genesis city.

Ten en cuenta que los jugadores podrían estar usando la experiencia portable de otra persona mientras están en tu escena. Consulta [Datos del usuario](../sdk7/interactivity/user-data.md#get-portable-experiences) para aprender cómo verificar qué experiencias portables tiene activadas actualmente un jugador.

### Persistencia del Juego

**Decentraland es un mundo persistente, tu escena puede ser visitada por jugadores en cualquier momento.** Tu escena no tiene una fase de inicio ni un final, por lo que debes diseñar las mecánicas del juego de manera que permita que los jugadores que entran o salen en cualquier momento también puedan participar.

Tu escena podría tener un mecanismo de reinicio que la establece en un estado inicial, pero debes tener cuidado de no interrumpir el juego para los jugadores que ya están jugando.

#### Sincronizar estado de la escena

**Actualmente, los estados de las escenas no se comparten entre jugadores a menos que se implemente manualmente.** Esta es la forma más simple de construir una escena, pero no es ideal para experiencias sociales.

Puedes usar el MessageBus para usar la misma arquitectura de mensajería utilizada para compartir los cambios de posición del jugador y el chat. Estos cambios de estado no se almacenan en ninguna parte. Si ningún jugador está actualmente cerca de la escena y cargándola, la escena se reiniciará a un estado predeterminado la próxima vez que se cargue.

**Puedes alojar tu propio servidor para almacenar información sobre tu escena y mantener a todos los jugadores sincronizados con él.** Esto asegura buenas velocidades de conexión y mantiene la escena funcionando continuamente incluso cuando no hay jugadores cerca. Si haces esto, tus limitaciones de latencia no serían diferentes a las de cualquier otro juego multijugador masivo en línea.

Alojar tu propio servidor también es una medida de seguridad recomendada para juegos que involucran transacciones con objetos valiosos del juego, ya que puedes mantener cierta información como tokens de seguridad solo en el servidor, nunca exponiendo esa información fuera.

{% hint style="warning" %}
**📔 Nota**: En futuras versiones, proporcionaremos soluciones listas para usar y ejemplos de código sobre cómo implementar tu propio servidor.
{% endhint %}

#### Timing del juego

**Los juegos que usan la arquitectura de comunicaciones predeterminada deben tener en cuenta que podría haber lag entre los jugadores** y no deben depender de reacciones rápidas entre las acciones de diferentes jugadores. Recomendamos juegos que sean por turnos, o que se basen principalmente en interacciones de jugador contra entorno.

Para juegos donde el timing de las acciones entre jugadores es crítico, como un shooter en primera persona, debes implementar tu propio servidor como fuente autoritativa de verdad en tiempo real entre todos los jugadores en tu escena.

### Jugadores en la escena

**Los jugadores se identifican en Decentraland usando su dirección de wallet de Ethereum.** Este wallet se usa como un ID persistente que ya está asociado con todos los tokens que posee el jugador.

**Actualmente no hay forma de limitar cuántos jugadores pueden estar presentes en Decentraland al mismo tiempo.** A diferencia de muchos otros juegos donde puede haber diferentes sesiones de juego alojadas en servidores separados, solo hay una instancia de Decentraland compartida entre todos los jugadores, al menos por ahora.

Debes tener en cuenta que puede haber varios jugadores caminando por tu escena en cualquier momento. Algunos de ellos podrían estar de paso y no participar en el juego. Asegúrate de que las mecánicas del juego no puedan ser fácilmente interrumpidas por esto.

**El game loop de tu escena no puede afectar a los jugadores directamente**, la escena tiene un enfoque reactivo a las acciones del jugador. Si un jugador está parado sobre una entidad y la entidad se mueve o rota, el jugador se moverá con esta entidad. Esto es especialmente útil para ascensores, plataformas flotantes y similares.

Como propietario de una escena, no puedes empujar o teletransportar forzosamente a un jugador ofensivo fuera de tu escena. Sin embargo, podrás incluir jugadores en una lista negra en el servidor de señalización. También puedes implementar una lista negra en el código de tu escena y negar ciertos servicios a jugadores en lista negra.

### Limitaciones de contenido de la escena

**Por favor, construye tu escena teniendo mucho cuidado con la eficiencia de tu código.** Decentraland necesita funcionar en navegadores web y dispositivos móviles, y los jugadores estarán renderizando múltiples escenas al mismo tiempo mientras caminan por el metaverso.

**También debes intentar mantener la escena ligera.** A diferencia de otros juegos en línea donde las mismas texturas y assets se repiten convenientemente a lo largo de un gran mundo abierto, en Decentraland cada escena podría tener su propio conjunto de assets completamente diferente. A medida que los jugadores caminan por múltiples escenas, deben poder descargar la totalidad del contenido de la escena, incluyendo texturas, archivos de sonido, etc., a una velocidad razonable.

Debido a esto, hemos impuesto algunos límites para prevenir el uso excesivo de recursos computacionales. Consulta [limitaciones de escena](../sdk7/optimizing/scene-limitations.md) para obtener detalles sobre cuáles son estos límites.

### Acceso a las escenas

**El mapa de Decentraland está diseñado para que haya caminos y plazas públicas,** estos garantizan un fácil acceso a varias partes del mapa, independientemente de lo que otras personas construyan. Las parcelas de terreno que no son adyacentes a ningún camino o plaza corren el riesgo de ser bloqueadas por escenas vecinas, aunque esperamos que la mayoría de las escenas sean transitables y no bloqueen a otros.

Los nuevos jugadores comenzarán su experiencia en Genesis Plaza, en el centro del mapa, donde serán alentados a seguir algunas actividades de tutorial y luego explorar el mundo.

Los jugadores también pueden escribir manualmente una URL para una coordenada específica en el mapa de Decentraland para aparecer en esa ubicación. También puedes compartir enlaces a URLs que tienen coordenadas iniciales codificadas.

Ten en cuenta que si un jugador comienza en una ubicación que está bloqueada o debajo del nivel del terreno, no será una experiencia agradable. Para evitar esto, hay una forma en que puedes definir un conjunto de ubicaciones específicas en tu escena que sea seguro para aparecer. Consulta [metadatos de escena](../sdk7/projects/scene-metadata.md) para obtener detalles.

En futuras versiones, los jugadores también podrán navegar por el mundo rápidamente usando mapas con puntos de aparición, listas de ubicaciones populares y ubicaciones de amigos. El SDK también hará posible agregar teletransportes en tu escena que puedan transportar a otras partes del mundo.

### UI del Usuario

**La UI superpuesta predeterminada que los jugadores ven al entrar a Decentraland tiene solo lo esencial.** Puedes agregar elementos adicionales a esa UI mientras un jugador está en tu escena. Ten en cuenta que la UI predeterminada de Decentraland se muestra encima de cualquier cosa de tu escena, así que diseña tu UI para que no se superponga con esto.

Cuando un jugador sale de la escena, todos los elementos de la UI se eliminan para no interferir con otras escenas. Los jugadores también tienen un botón disponible en su pantalla para desactivar todos los elementos de la UI en la escena, esto es principalmente útil para prevenir comportamientos abusivos por parte de escenas que puedan querer cubrir todo el campo de visión del jugador.

### Física

Ten en cuenta que el SDK no proporciona su propio motor de física. Si quieres usar física en tu escena, puedes importar una biblioteca o codificar el comportamiento tú mismo.

### Controles de entrada

**Los controles de tu juego deben limitarse a movimientos básicos, saltar, apuntar y hacer clic, así como un botón primario y secundario.** Soportaremos controladores móviles y de Realidad Virtual, por lo que no podemos asumir que todos tienen un teclado.

Tenemos soporte para eventos globales de _button up_ y _button down_ para los tres botones. Los tres botones también tienen eventos de hit que te permiten identificar si una entidad estaba en la mira del jugador.

### Avatares

**Los jugadores pueden construir sus avatares basándose en un conjunto de artículos wearables predeterminados.** Expandiremos la lista de wearables y opciones disponibles, y en el futuro también haremos posible que terceros creen y vendan wearables.

### Comunicación entre jugadores

**Los usuarios pueden chatear entre sí. Actualmente los avatares no tienen forma de transmitir lenguaje corporal más allá del uso de controles de movimiento básicos.**

En futuras versiones también podrán hacer chat de voz y realizar gestos como bailar o fruncir el ceño con sus avatares. También podrán mostrar un emoji temporal sobre su avatar para expresarse. Los jugadores también podrán mostrar tokens que poseen para que otros jugadores los vean.

### Notificaciones del juego

**Actualmente no hay un sistema de notificaciones entre escenas.** Cualquier juego que requiera notificaciones mostradas fuera de la escena actual tendrá que implementarlas usando un servicio externo.

### Uso del blockchain

**En Decentraland, el blockchain se usa para almacenar información sobre propiedad.** Hoy esto se refiere principalmente a la propiedad de LAND, pero también puede usarse para la propiedad de objetos del juego, wearables, avatares especiales, emotes y tokens que pueden asegurar ciertos privilegios de juego o acceso a juegos.

El blockchain no se usa para almacenar el estado del juego, la posición del jugador o cualquier cosa que necesite cambiar en tiempo real.

#### LAND y MANA

**Los jugadores no necesitan poseer parcelas de terreno para participar en el metaverso.** De hecho, la gran mayoría de los jugadores no lo harán. Los avatares de los jugadores y los tokens de LAND que poseen no están conectados de ninguna manera directa.

**Los jugadores no necesitan poseer previamente un wallet de Ethereum o tokens MANA para entrar a Decentraland.** Si tu gameplay depende en gran medida de poseer tokens, estarías excluyendo a la mayoría de los jugadores. Un modelo de juego freemium podría ser una forma ideal de adaptarse a ambas bases de usuarios.

#### Otros NFTs

**Puedes usar tokens no fungibles (NFTs) especiales para representar objetos del juego, avatares personalizados o wearables.** Si un jugador posee uno de estos tokens, tu escena podría responder a él de diferentes maneras.

Lee sobre qué son los NFTs en [este blogpost](https://decentraland.org/blog/technology/what-are-nfts/).

#### Transacciones en el juego

**Tu escena puede soportar transacciones blockchain para que los jugadores compren o ganen tokens.**

Las transacciones blockchain no son inmediatas, requieren tiempos de verificación y tienen un costo en Ether, tanto el tiempo como el costo varían dependiendo del uso actual de la red.

Decentraland está trabajando en crear una side-chain que será capaz de manejar transacciones más rápido y más barato que la red de Ethereum. Esta side-chain será ideal para transacciones en el juego, ya que los cambios pueden ocurrir más cerca del tiempo real y a un costo muy bajo. La cadena principal de Ethereum seguirá siendo recomendada para transacciones que requieren mayor seguridad y que pueden permitirse ser más caras y tomar más tiempo.

El jugador siempre debe aprobar estas transacciones explícitamente en su cliente de Ethereum. Por ejemplo, cuando usan Metamask, Metamask solicita al jugador que acepte cada transacción antes de que se procese.

Los jugadores también podrían firmar un contrato que apruebe automáticamente todas las transacciones solicitadas por una dirección específica o dentro de ciertas restricciones, para evitar interrupciones al aprobar transacciones.

También puedes usar smart contracts para condicionar transacciones basadas en condiciones personalizadas. Por ejemplo, los jugadores podrían apostar en el resultado de un juego, y los pagos correspondientes ocurrirían automáticamente tan pronto como se conozca el resultado.

Para implementar interacciones blockchain en el código de tu escena, debes usar bibliotecas externas que interfacen con la red de Ethereum. Las futuras versiones del SDK proporcionarán una API personalizada para exponer estas funcionalidades de una manera más simple.
