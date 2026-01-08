---
description: Acuerdo de soporte de versiones
metaLinks:
  alternates:
    - >-
      https://app.gitbook.com/s/oPnXBby9S6MrsW83Y9qZ/scenes-sdk7/releases/version-support-agreement
---

# Acuerdo de Soporte de Versiones

Este documento describe la política de versionado aplicada tanto al Scene Editor (en el Creator Hub) como al framework de scripting (el paquete `@dcl/sdk`).

El objetivo de esta política de versionado es forjar un contrato entre el equipo del SDK de la Fundación Decentraland y los creadores de contenido, para establecer expectativas claras y permitir que los creadores de contenido planifiquen su trabajo en consecuencia.

### Definiciones

* _Número de versión_ -- un identificador único para una versión disponible públicamente de software. Este identificador consiste en un número de _versión mayor_ y un número de _versión menor_, separados por puntos (por ejemplo, 7.2).
* _Familia de versión_ -- todas las versiones que tienen un número de versión mayor idéntico forman una familia. Llamamos a la versión A un _sucesor_ de la versión B si A y B pertenecen a la misma familia y el número menor de A es mayor que el de B (por ejemplo, 7.11 es un sucesor de 7.10).
* _Breaking change_ -- un cambio que obliga a un usuario a cambiar su código o assets para mantenerlos en estado funcional. Por ejemplo, una propiedad cambia de nombre, y obliga al usuario a cambiar ese nombre de propiedad cada vez que se usa en todo su código.
* _Non-breaking change_ -- un cambio que no requiere ninguna acción por parte del usuario, el comportamiento y propiedades del código y assets del usuario no cambian si migran su escena.
* _Versión estable_ -- una versión que prohíbe breaking changes en todos sus sucesores (que también se consideran estables). Cualquier breaking change debe introducirse solo a través de la creación de una nueva familia de versión al incrementar el número de versión mayor, sin embargo ver la salvedad en la sección [breaking changes](version-support-agreement.md#breaking-changes). Los non-breaking changes se reflejan al incrementar el número de versión menor.
* _Versión inestable_ -- una versión que permite breaking changes en sus sucesores. Los breaking changes pueden introducirse al incrementar el número de versión menor.

### Política de soporte

En cada familia de versión estable, la Fundación Decentraland soporta solo la última versión menor. En cualquier momento dado debe haber como máximo dos familias soportadas.

Por ejemplo, si la última versión menor de la familia 6.x es 6.11, y la última versión menor de la familia 7.x es 7.3, se espera que los creadores de contenido desarrollen sus escenas en 6.11 o 7.3. Las escenas que fueron desarrolladas y publicadas con la versión 6.10 o anterior probablemente seguirán funcionando y los jugadores podrán disfrutarlas. Sin embargo, si estas escenas antiguas experimentan algún problema, primero deben actualizarse a una versión soportada, y el problema solo será investigado si aún ocurre en una versión soportada.

El Scene Editor ofrece actualizar automáticamente el paquete de scripting de todas las escenas dentro de una misma familia de versión, para que todos los desarrolladores estén usando la última versión soportada cuando desarrollan sus escenas.

### Desarrollo de funcionalidades

Las nuevas funcionalidades solo se lanzarán en la última versión en desarrollo. Tan pronto como el equipo de desarrollo comience a trabajar en una nueva familia de versión, las familias de versión antiguas que permanezcan en soporte solo recibirán correcciones de bugs importantes, y no se implementarán funcionalidades adicionales.

### Breaking changes

Los breaking changes solo deberían ocurrir en lanzamientos mayores. No debería haber breaking changes dentro de los lanzamientos menores estables de una misma familia de versión, excepto en caso de emergencia y ausencia de cualquier otro medio para abordarlo. Los breaking changes dentro de un lanzamiento menor son una medida drástica que los desarrolladores evitarán a toda costa. Los nuevos lanzamientos menores extenderán las capacidades de la sintaxis existente, pero nunca deberían cambiar lo que produce la sintaxis establecida, excepto al corregir bugs.

#### Cambios aislados

En ocasiones muy raras, podría ser preferible hacer un pequeño breaking change aislado, si esto solo causará inconvenientes a un pequeño subconjunto de usuarios. (Crear una nueva versión mayor es un inconveniente para todos los usuarios.) En este caso, el SDK podría deprecar una funcionalidad, pero debe continuar soportando la funcionalidad por un tiempo razonable.

#### Cambios de emergencia

En ciertos casos excepcionales, como preocupaciones de seguridad o requisitos regulatorios, cualquier funcionalidad puede cambiarse de manera breaking independientemente de su nivel de estabilidad, y no se promete una depreciación en estas situaciones.

### Lanzamientos estables e inestables

#### Alpha

Cada vez que se introduce un nuevo lanzamiento mayor, algunos lanzamientos menores iniciales pueden etiquetarse como versiones **alpha** inestables. Se deben permitir y esperar breaking changes en los lanzamientos alpha, y los usuarios no deben tener expectativa de estabilidad.

Los desarrolladores son libres de experimentar con estas versiones alpha, pero no se les anima a publicar contenido construido con versiones alpha inestables, ya que no hay garantía de que el contenido seguirá funcionando después de cambios subsecuentes. Tampoco se recomienda comenzar grandes migraciones complicadas en este punto, ya que pueden requerirse más cambios antes del próximo lanzamiento estable.

#### Beta

Una vez que una familia de versión alcanza un cierto nivel de madurez, se hace disponible un lanzamiento **beta**. Un lanzamiento beta se considera completo y listo para ser declarado estable, sujeto a pruebas públicas.

Las familias de versión beta deben ser tan estables como sea posible; sin embargo, se les permite cambiar con el tiempo. Estos cambios deben ser mínimos pero pueden incluir breaking changes. Los breaking changes deben hacerse solo después de un período de depreciación razonable para dar a los creadores de contenido la oportunidad de migrar sus escenas. Este período de depreciación debe definirse en el momento de introducir un breaking change.

Las familias de versión beta solo deben estar en beta por un período de tiempo limitado, especificado en el momento de ser marcadas como beta. Deben promoverse a estables si no se encuentran problemas en ese período. La duración de este período de tiempo puede variar caso por caso, pero una buena regla general es 90 días.

El contenido escrito con la sintaxis de una versión beta debe ser sencillo de migrar a las próximas versiones dentro de ese árbol familiar. Aún no es aconsejable desarrollar contenido para eventos importantes con una versión beta, ya que las pruebas aún están en progreso y es probable que aún haya bugs.

#### Estable

Una vez que el período de tiempo beta termine sin problemas importantes, la familia de versión se considera **estable** y no debería haber más cambios en la sintaxis, aparte de la adición de nuevas funcionalidades. A partir de este punto, la versión se considera la opción recomendada y alentada para que todos los desarrolladores la usen.

Una familia de versión estable debe estar completamente soportada durante su vida útil. No debe haber breaking changes, sujeto a las salvedades descritas abajo.

### Funcionalidades inestables en lanzamientos estables

Funcionalidades específicas en un lanzamiento pueden tener niveles de estabilidad diferentes del lanzamiento en su conjunto. Esto puede ser porque la funcionalidad se introdujo recientemente y requiere más pruebas, o porque está destinada a ser reemplazada pronto.

Por ejemplo, un nuevo tipo de componente podría introducirse como alpha en un lanzamiento ya estable del framework del SDK, ya que este componente particular puede requerir aún su propio ciclo de pruebas. Luego puede pasar por el flujo de versionado descrito arriba, yendo de alpha, a beta, a estable.

Cualquier funcionalidad de un lanzamiento estable que no se considere estable debe estar claramente etiquetada como tal en la documentación. Los creadores que hagan uso de funcionalidades inestables deben ser conscientes de que la funcionalidad potencialmente podría sufrir breaking changes. Cualquier breaking change se comunicará claramente, incluyendo guías de migración, y habrá un período de transición para que los creadores ajusten el código de su escena.

### ¿Cuánto tiempo soportamos una familia de versión estable?

Una vez que una nueva familia de versión se vuelve estable (7.x), el equipo se compromete a dar soporte (correcciones de bugs importantes) en la versión anterior (6.x) durante varios meses, para dar a los creadores mucho tiempo para migrar. La cantidad de meses se determina caso por caso, dependiendo del esfuerzo de migración requerido por los creadores para migrar.

### Versiones pre-lanzadas

Siempre es posible acceder a las adiciones más recientes al framework de scripting instalando la versión `@next` del paquete `@dcl/sdk` en una escena.

Las funcionalidades en esta rama pueden ser inestables o no estar documentadas, ya que no se empujan como parte de una versión oficialmente soportada del SDK.
