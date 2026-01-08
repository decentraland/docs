---
description: >-
  Pautas recomendadas para producir tu primera escena o experiencia MVP usando
  el SDK
metaLinks:
  alternates:
    - >-
      https://app.gitbook.com/s/oPnXBby9S6MrsW83Y9qZ/scenes-sdk7/design-experience/mvp-guidelines
---

# Pautas MVP

El propósito de este documento es ayudarte a guiarte a través del proceso de construcción de las primeras iteraciones de escenas en Decentraland. Nos referiremos a estas como un Producto Mínimo Viable (MVP).

**Al crear el Producto Mínimo Viable (MVP) para tu escena, necesitas pensar en dos áreas de enfoque:**

1. La experiencia de usuario básica y funcionalidad de tu proyecto.
2. La creación de un "pipeline" básico, o flujo de trabajo del equipo y sistema de gestión de contenido para construir tu experiencia y mejorarla iterativamente.

Un MVP no debe intentar demostrar todos los resultados posibles de cada experiencia posible. En su lugar, un MVP debe ser la mejor primera impresión de tu experiencia que puedes hacer usando el SDK de Decentraland.

Es importante considerar tus propias limitaciones, cómo planeas proporcionar contenido a tus usuarios y las expectativas de tus usuarios. Abordar tu MVP de esta manera requiere tres perspectivas diferentes:

1. Como desarrollador o productor, ¿cómo entrego una experiencia a mi usuario/jugador?
2. Como usuario o jugador, ¿qué espero de esta experiencia?
3. Como colaborador o stakeholder, ¿cómo contribuyo al pipeline o experiencia?

Es importante distinguir este enfoque del desarrollo ágil tradicional, porque es posible que tengas que usar métodos no óptimos para cumplir con tus objetivos de diseño.

Tendrás que examinar tus propios objetivos en el contexto de las expectativas de tus usuarios para decidir si un cierto lanzamiento está más enfocado en el jugador, en el pipeline y los colaboradores de contenido, o un poco de ambos.

Al planificar cada lanzamiento, es crítico que conscientemente y deliberadamente establezcas tus prioridades según cada una de estas tres perspectivas.

Puedes esperar que tu backlog de desarrollo siga dos vías:

* El backlog de experiencias de usuario que quieres crear.
* El desarrollo de las herramientas e interfaces necesarias para construir tu pipeline de entrega. (O para optimizar tu pipeline existente para colaboradores así como tu equipo de desarrollo.)

Estas dos vías también seguirán dos enfoques diferentes para las pruebas:

* Probar tus experiencias de usuario es más similar a las pruebas tradicionales de interfaz de usuario, y no requiere los mismos recursos de scripting.
* Probar tus herramientas e interfaces de pipeline requerirá más recursos técnicos.

Cuanto antes puedas poner una propuesta de valor frente a tu usuario o jugador, antes puedes obtener retroalimentación para confirmar o rechazar esa propuesta. Confirmar valor rápidamente es crítico. Muchos desarrolladores experimentados compartirán historias de cómo estaban seguros más allá de toda duda de lo increíble que sería una nueva mecánica hasta que la usaron y se sintió torpe y glitchy, los jugadores no respondieron en absoluto, o no resolvió una necesidad/deseo del consumidor. Quieres fallar rápidamente con el menor esfuerzo posible, para que puedas aprender de tu falla y planificar la siguiente iteración.

¿Cómo fallas rápidamente? Haces lo mínimo necesario para que tu jugador toque tu producto.

### Factores para Productos Mínimos Viables

Aquí está la lista de factores a considerar para tu MVP básico. Es aceptable declarar que usarás algo como marcador de posición y luego lo eliminarás gradualmente a medida que desarrolles un reemplazo más sólido.

1. Creación de Arte
   * Primero, comienza con imágenes estáticas básicas
   * Tu primera prueba debe ser de estilo: ¿el estilo que has elegido atrae a tus usuarios?
   * Esto podría ser el comienzo de una guía de estilo para proporcionar a un artista externo
2. Creación de Escena
   * Desarrolla un sentido básico de tu espacio
   * El jugador debe sentir que está en un espacio nuevo y único
   * Delinea tu espacio de los espacios vecinos
   * Los bordes son evidentes y obvios – aunque sea solo por una línea dibujada
   * Cubre toda el área con contenido/arte estático
3. Arte Renderizado en la Escena
   * Está bien usar billboards u otra señalización (esto podría ser simplemente billboards reales o sprites más sofisticados que miran a la cámara)
   * Establece el tono y la estética de tu espacio (es decir, estilo, brillante, oscuro)
   * Nota tu proceso: ¿cómo se creó y desplegó el arte en la escena?
   * ¿Cómo quieres organizar tus archivos de arte para despliegues repetidos?
4. Experiencia del Jugador
   * Los jugadores pueden visitar tu espacio/escena
   * Los jugadores pueden distinguir tu espacio de los espacios vecinos
5. Objetivos del Pipeline
   * Desplegar escena estática de muestra: sin interacción con el jugador
   * Desplegar escena animada: elementos como fuentes de agua o banderas ondeantes repiten sus animaciones en loop
   * Desplegar escena interactiva: incluyendo interacción del jugador
   * Demostrar pipeline de despliegue re-desplegando contenido: desde la creación de arte hasta la escena incluyendo scripting + QA]
   * Exponer gaps del pipeline: identificar las incógnitas en áreas específicas de despliegue de contenido

### Niveles de prototipos

Fallar rápidamente te permite desarrollar tu experiencia creando prototipos sucesivos, con cada iteración construyendo sobre la anterior.

**Comienza con un prototipo de un solo jugador. Luego puedes planificar para scripting de interacciones multijugador. Finalmente, puedes abordar tu core loop persistente que demuestra capas transaccionales.**

**¿Qué es un persistent core loop?**

En diseño de juegos, un persistent core loop es el "game loop" fundamental que impulsa las acciones del jugador y la respuesta del juego a esas acciones. Estos loops persistentes se extienden a cualquier forma de experiencia virtual (como las proporcionadas por Districts).

{% hint style="warning" %}
**📔 Nota**: El cliente de Decentraland toma prestadas algunas ideas arquitectónicas de [React.js](https://reactjs.org/) y solo renderiza una escena cuando ha ocurrido un cambio, no a una tasa constante.
{% endhint %}

**¿Qué son las transactional layers?**

Las transactional layers son las interfaces entre sistemas como una actualización al blockchain u otra aplicación que se ha interfaceado con tu experiencia para mantener un registro persistente de las acciones del jugador. Crear y mantener este registro persistente es lo que construye una experiencia más personal.

Recomendamos crear tu MVP como una experiencia de un solo jugador.

Por ejemplo, podrías diseñar una escena con las siguientes experiencias sucesivas:

* Un solo jugador puede entrar al mundo.
* El jugador puede interactuar con una o dos entidades simples dentro de la escena.
* Otros jugadores pueden unirse e interactuar con el mundo y el otro jugador.
* Finalmente, puedes agregar la capacidad de recordar que cada jugador entró a la escena, y rastrear los eventos y actividades de los jugadores.

### Cómo compartir tu MVP

Aunque el mundo de Decentraland aún no está abierto a todos, puedes subir una vista previa de la escena a un servidor y compartir fácilmente un enlace con personas que puedan darte retroalimentación.

Incluso una vez que Decentraland esté disponible para todos, aún recomendamos probar cambios con usuarios de prueba en un servidor de vista previa separado primero, antes de subir una nueva versión de tu escena a Decentraland.

Lee [este blogpost](https://decentraland.org/blog/announcements/decentraland-on-now/) para obtener detalles sobre cómo subir tu vista previa de escena a un servidor gratuito.

### Consideraciones adicionales

Una vez que los casos de uso básicos estén cubiertos, puedes comenzar a ser más sofisticado con tu estrategia de gestión de lanzamientos enfocándote en las mecánicas. **Mecánicas** es un término amplio que cubre todas las acciones que un jugador puede tomar y las respuestas que el sistema proporcionará basándose en esas acciones del jugador.

**La interoperabilidad de dispositivos** es algo importante de tener en cuenta. Los usuarios de tu escena pueden estar accediendo a tu escena usando un escritorio, un dispositivo móvil o un headset de VR. Los usuarios deben poder interactuar con tu escena razonablemente bien usando cualquiera de ellos. Para aquellos que usan un headset de VR, intenta evitar movimientos mareantes que puedan causar motion sickness.

**El audio** es otro aspecto crítico de la atmósfera de una escena. Sonidos de fondo como viento, grillos, conversaciones distantes, tal vez incluso música pueden ser una forma muy poderosa de aumentar la inmersión y dar contexto. También puedes cambiar cómo los niveles de volumen se relacionan con la distancia de la fuente de sonido para poner más o menos énfasis en la ubicación de un sonido.

Lee [restricciones de diseño para juegos](../sdk7/design-experience/design-games.md) para ver en detalle una serie de otras consideraciones.

Considera el MVP como uno de muchos prototipos que puedes usar para establecer tu cadencia de lanzamientos una vez que hayas establecido tu pipeline. El enfoque de cada lanzamiento puede variar, o puede ser un híbrido de cada aspecto de la experiencia. Sin embargo, debes apuntar a entregar experiencias sucesivamente más complicadas, cada iteración construyendo sobre la anterior.

1. **MVP**: Un solo jugador
2. **Lanzamiento 2**: Agregar soporte multijugador y/o de interacción
3. **Lanzamiento 3**: Introduce tu primera mecánica
4. **Lanzamiento 4**: Agregar soporte de audio
5. **Lanzamiento 5**: Finalizar tu pipeline de arte

Por ejemplo, digamos que estamos construyendo un MVP para un juego de frisbee golf. El MVP incluirá algunas imágenes estáticas del campo. El jugador incluso podría lanzar un disco, de una manera muy rudimentaria, de estilo de bloque. Esto nos permite trabajar nuestras mecánicas básicas de lanzamiento. El siguiente lanzamiento puede incluir un prototipo para soporte multijugador para que podamos demostrar y probar dos usuarios conectados y jugando en nuestro LAND al mismo tiempo.

Recuerda, aunque el objetivo final es un mundo 3D verdaderamente inmersivo, ese no es donde comenzará tu MVP. Hacer que un jugador entre a tu mundo lo más rápido posible debe ser tu primer objetivo. Tomar semanas, no meses, para probar tus lanzamientos es crítico para aprender e iterar sin desperdiciar esfuerzo.

Recomendamos enfáticamente que te mantengas consciente de la primera impresión que presenta tu experiencia. Una experiencia vacía dejará a los jugadores decepcionados. Por otro lado, una escena con algo de contenido inicial y experiencias básicas muestra a los jugadores el potencial de lo que vendrá y los alienta a comprometerse con tu comunidad y regresar a los próximos lanzamientos.

### Factores de persistencia a considerar

En última instancia, quieres alcanzar un nivel de persistencia donde puedas demostrar que las capas transaccionales de tu arquitectura están operativas. Transaccional no se limita a las acciones de los jugadores, sino también a las reacciones del sistema a los jugadores.

1. **Información de la cuenta**: nombre de inicio de sesión, zona horaria, ubicación para tu experiencia/juego específico
2. **Estadísticas del leaderboard**: resultados de juegos anteriores, clasificaciones globales/regionales, competiciones
3. **Validación de identidad**: dirección de wallet de Ethereum, o cualquier otra gestión de identidad de backend
4. **Actualizaciones del blockchain**: según sea necesario basándose en tu experiencia/juego para actualizar el ledger del blockchain para transparencia transaccional
5. **Persistencia en runtime**: datos temporales para persistencia en una plataforma potencialmente distribuida (es decir, salud solo para la experiencia de un solo juego)
