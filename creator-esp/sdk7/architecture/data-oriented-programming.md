---
description: >-
  La Programación Orientada a Datos es un enfoque poderoso de programación que
  obtiene el máximo rendimiento.
metaLinks:
  alternates:
    - >-
      https://app.gitbook.com/s/oPnXBby9S6MrsW83Y9qZ/scenes-sdk7/architecture/data-oriented-programming
---

# Programación Orientada a Datos

La Programación Orientada a Datos es un enfoque poderoso de programación que resulta en grandes mejoras en el rendimiento. Se enfoca en tratar los _datos_ como el elemento central, todo lo demás se organiza a su alrededor, ya sea para acceder o modificar esos datos. Este enfoque también es muy amigable para multijugador, ya que hace que los datos que necesitan sincronizarse entre jugadores sean más fáciles y rápidos de acceder.

La Programación Orientada a Datos te anima a pensar en todo en tu escena como datos que necesitan copiarse y mutarse a través de los diversos sistemas. El principal beneficio de este enfoque está en optimizar la velocidad a la que los datos pueden leerse de la memoria, que a menudo es el principal cuello de botella al ejecutar aplicaciones y juegos modernos.

Debido a esta notable mejora en el rendimiento, gran parte de la industria de creación de juegos ha estado cambiando hacia adoptar este enfoque en los últimos años.

El SDK de Decentraland ejecuta escenas en JavaScript, y un inconveniente de este lenguaje es que no ofrece control sobre la asignación de memoria. El motor que ejecuta Decentraland, sin embargo, usa C#, que sí se beneficia mucho al seguir principios orientados a datos. El SDK y el motor están constantemente enviando mensajes entre sí. Para hacer esta comunicación lo más eficiente posible, tiene sentido mantener las estructuras de datos en ambos lados lo más similares posible, para evitar tener que reorganizar constantemente estos datos.

### Cómo se ve

La Programación Orientada a Datos es diferente de la Programación Orientada a Objetos, un enfoque con el que muchos desarrolladores están actualmente familiarizados. En la Programación Orientada a Objetos, el código se estructura siguiendo abstracciones que intentan replicar construcciones del mundo real: objetos. Cada uno de estos objetos puede contener tanto datos como funcionalidad. Las aplicaciones que usan este enfoque suelen ser fáciles de planificar conceptualmente, pero también más ineficientes de ejecutar.

En la Programación Orientada a Datos, los datos no se estructuran alrededor de objetos, se estructuran para optimizar su facilidad de acceso. Las construcciones del mundo real que los datos representan no juegan ningún papel en los diferentes flujos que mutan esos datos.

El modelo Entity Component System (ECS) sobre el que está construido el SDK de Decentraland es muy compatible con el enfoque de Programación Orientada a Datos. Cada componente es parte de una colección estructurada de datos. Los componentes pertenecen a una entidad por referencia, pero los datos no están estructurados alrededor de la entidad, los datos están estructurados como una colección de componentes similares. Por ejemplo, todos los componentes `Transform` en una escena son iguales. Uno de estos transforms podría pertenecer al modelo de tu edificio principal, otro a un vaso que es hijo de una mesa. Los sistemas en la escena luego procesan la lista de componentes `Transform` uno por uno, sin hacer distinciones. Todos los componentes `Transform` tienen los mismos campos y se someten a las mismas verificaciones.

Imagina una escena que tiene una docena de puertas que pueden estar abiertas o cerradas. Puedes representar el estado de todas estas puertas como un simple componente "isOpen" que contiene un valor booleano. Si "isOpen" es true la puerta debe estar abierta; si es false la puerta debe estar cerrada. Si un jugador hace clic en una puerta, debería cambiar de estado, y otros jugadores también deberían verla cambiar. Mientras tu escena está procesando un cambio en el estado de una puerta, y sincronizándolo con otros jugadores, la escena realmente no se preocupa por lo que "isOpen" representa. Todo el conjunto de componentes es solo una colección de booleanos que necesitan sincronizarse con otros jugadores. Un sistema separado en tu escena puede entonces encargarse de regularmente coincidir el estado de cada "isOpen" con la rotación de su puerta correspondiente.

La Programación Orientada a Datos no es necesariamente más difícil, pero es un enfoque diferente que necesita ser aprendido y adoptado. Los desarrolladores que no están acostumbrados a este enfoque podrían necesitar algo de tiempo para familiarizarse con él, te animamos a que explores y juegues con ejemplos para obtener una mejor sensación.

### Por qué funciona

Para entender por qué la programación orientada a datos hace tal diferencia, necesitamos ver el hardware.

Cuando el procesador necesita obtener datos de la memoria, obtiene un bloque completo de datos en caché, incluyendo datos que simplemente están escritos en la memoria junto al valor que queríamos. Cuanto más tu código pueda hacer uso de datos que ya están en caché, más rápido se ejecutará tu código.

Imagina que la memoria de la máquina es un almacén literal, donde los datos se almacenan en muchas cajas apiladas. Cada vez que necesitamos cierto dato, necesitamos llamar a una carretilla elevadora para que vaya a buscar la caja donde se ubica ese dato, y la traiga al mostrador para inspección. Ese mostrador solo puede contener un par de cajas a la vez, por lo que no puedes mantener muchos datos cerca.

Toma mucho tiempo para la carretilla elevadora ir a la parte trasera del almacén y traernos una caja. Si los datos que quieres de estas cajas están dispersos, eso significará pedirle a la carretilla elevadora que haga muchos viajes. La mayor parte del tiempo, estarás jugando con tus pulgares parado junto al mostrador, esperando a que llegue la siguiente caja que solicitaste.

Puedes evitar mucho de ese tiempo desperdiciado si apilas estas cajas inteligentemente, y empacas los datos para que las cosas que probablemente necesitarás al mismo tiempo estén mayormente agrupadas. Si agrupas los datos astutamente, a menudo encontrarás que lo siguiente que necesitas ya está en una de las cajas en el mostrador. Podrás saltar directamente a ello sin molestar al operador de la carretilla elevadora.

Por ejemplo, si tienes una escena que necesita obtener el estado de una puerta para verificar si está abierta o cerrada, el hardware no solo está obteniendo el valor del booleano particular que describe el estado de esa puerta, está obteniendo un montón de otros datos que pueden o no ser relevantes.

Supón que tu escena tiene un sistema que necesita actualizar el estado abierto/cerrado de una docena de puertas, una vez por cada fotograma. Si tu código está organizado siguiendo un enfoque de Programación Orientada a Objetos, no hay forma de saber cómo los diferentes bits relevantes de información pueden estar agrupados. Tal vez una "caja" de nuestro almacén contiene el estado "isOpen" de la puerta A y también contiene la textura de la puerta A y el audio que reproduce al abrirse. Podrías tener que hacer un viaje para obtener una nueva "caja" de datos para cada una de las docenas de puertas. Y por supuesto, todo este proceso necesita suceder nuevamente en cada fotograma. Entonces son 360 (30 x 12) viajes metafóricos a la parte trasera del almacén por segundo, incluso cuando ninguna de las puertas ha cambiado de estado.

Si tu código sigue un enfoque Orientado a Datos, por otro lado, es muy probable que todos esos 12 booleanos estén en la misma caja. Esto es porque todos estos booleanos son parte de un solo arreglo que fue grabado en memoria de una vez. Nunca estás organizando explícitamente cómo estos datos encajan en la memoria, así que en el peor escenario el arreglo podría terminar dividido en dos cajas. Pero incluso en ese peor escenario, 2 viajes es mucho mejor que 12.

Verificar el estado de cada puerta en cada fotograma suena como mucho trabajo, pero en realidad es súper rápido si todos los datos ya están en el caché de memoria. Si tus datos están ordenados ordenadamente, tu escena puede ejecutar procesos como estos sobre muchas entidades y aún funcionar muy rápido.
