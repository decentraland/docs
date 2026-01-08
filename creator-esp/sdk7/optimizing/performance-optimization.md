---
description: >-
  Optimiza tu escena para que cargue rápido y funcione sin problemas para todos
  los jugadores.
metaLinks:
  alternates:
    - >-
      https://app.gitbook.com/s/oPnXBby9S6MrsW83Y9qZ/scenes-sdk7/optimizing/performance-optimization
---

# Optimización de Rendimiento

Hay varios aspectos que puedes optimizar en tus escenas para asegurar la mejor experiencia posible para los jugadores que las visitan. Este documento cubre algunas mejores prácticas que pueden hacer una gran diferencia en qué tan rápido carga tu escena y qué tan suavemente se ejecuta para los jugadores que están en ella o en escenas vecinas.

Ten en cuenta que muchos jugadores pueden estar visitando Decentraland usando hardware que no está construido para juegos, y a través del navegador, lo que limita cuánto del poder de procesamiento del hardware está disponible para usar. La experiencia de visitar tu escena debe ser fluida para todos.

El explorador de Decentraland impone muchas optimizaciones a nivel de motor. Estas optimizaciones hacen una gran diferencia, pero el desafío de renderizar múltiples experiencias generadas por usuarios simultáneamente en un navegador es grande. Necesitamos tu ayuda para que las cosas funcionen sin problemas.

### Temporización

#### Reproducción de video

Reproducir videos es una de las cosas más costosas para que el motor las maneje. Si tu escena incluye videos, asegúrate de que solo _UNA_ VideoTexture esté en uso a la vez. Puedes tener docenas de planos compartiendo la misma VideoTexture sin impacto significativo en el rendimiento, pero tan pronto como agregues una segunda VideoTexture, sus efectos en el framerate se vuelven muy notables.

También debes evitar tener videos reproduciéndose en regiones donde no se pueden ver. Por ejemplo, si tienes una pantalla en interiores, activa/desactiva el video usando un área de activación basada en cuándo el jugador entra y sale.

{% hint style="info" %}
**💡 Tip**: Un truco que varias escenas han usado es transmitir un solo video con múltiples regiones que se mapean de manera diferente a diferentes planos. Cada pantalla de video usa [mapeo UV](../sdk7/3d-essentials/materials.md#using-textures) para mostrar solo una parte distinta de la VideoTexture. Gracias a esto, puede parecer que hay videos separados reproduciéndose sin el costo de múltiples VideoTextures.
{% endhint %}

{% hint style="info" %}
**💡 Tip**: Cuando los jugadores están parados fuera de tu escena, las VideoTextures no se actualizan en cada fotograma. Esto ayuda a reducir el impacto para las escenas circundantes. No obstante, es ideal solo activar la reproducción de cualquier video cuando los jugadores [entren a tu escena](../sdk7/interactivity/event-listeners.md#player-enters-or-leaves-scene).
{% endhint %}

#### Carga diferida

Si tu escena es grande, o tiene áreas interiores que no siempre son visibles, puedes elegir no cargar el conjunto completo de entidades desde el principio. En su lugar, carga el contenido por región a medida que el jugador visita diferentes partes de la escena. Esto puede reducir significativamente el tiempo de carga de la escena, y también la cantidad de texturas y contenido 3D que el motor necesita manejar en cada fotograma.

Por ejemplo, el edificio principal de un museo podría cargarse desde el inicio, pero las pinturas en cada piso solo se cargan para cada jugador a medida que visitan cada piso.

Consulta [esta escena de ejemplo](https://github.com/decentraland-scenes/lazy-loading) para ver cómo podría funcionar eso.

Para el mejor resultado en términos de evitar interrupciones, oculta entidades cambiando la propiedad `visible` de su forma a false. Con este enfoque, las agregas al motor al crearlas, pero simplemente no haces visibles sus modelos.

Una alternativa es no agregar las entidades al motor hasta que sea necesario. Esto puede resultar en algunas interrupciones cuando las entidades aparecen por primera vez, y también pueden tardar un par de segundos en volverse visibles. La ventaja de este enfoque es que es una forma válida de evitar las [limitaciones de escena](../sdk7/optimizing/scene-limitations.md). Ten en cuenta que el conteo de limitaciones de escena es para el contenido que se está renderizando en la escena en un momento dado, no para el contenido total que podría renderizarse. Cargar y descargar partes de la escena debería permitirte evitar esas limitaciones.

{% hint style="warning" %}
**📔 Nota**: Las entidades que no son visibles pero están agregadas al motor sí cuentan para las limitaciones de escena.
{% endhint %}

Tambié

n puedes activar/desactivar animaciones para entidades que están lejos u ocultas. Por ejemplo, para un NPC que reproduce una animación idle muy sutil, podrías hacer que solo reproduzca esa animación cuando el jugador esté a menos de 20 metros. Usa un área de activación alrededor del NPC y activa/desactiva sus animaciones en consecuencia.

{% hint style="info" %}
**💡 Tip**: Cuando una entidad está lejos y lo suficientemente pequeña, es descartada por el motor. Este descarte ayuda a nivel de drawcall, eliminar entidades del motor siempre es mejor. Este descarte tampoco toma en cuenta la oclusión por otras entidades, por lo que las entidades que no son tan pequeñas pero están ocultas por una pared aún se renderizan.
{% endhint %}

#### Bloques Async

Los bloques de [código async](../sdk7/programming-patterns/async-functions.md) se procesan en un hilo separado del resto de la escena, para evitar bloquear el progreso de todo lo demás.

Cualquier proceso que dependa de respuestas de servicios asíncronos, como `getPlayerData()` o `getRealm()` siempre debe ejecutarse en bloques async, ya que de lo contrario bloquean el resto de la carga de la escena mientras esperan una respuesta. Lo mismo aplica a cualquier llamada a servidores de terceros.

Ten en cuenta que la escena se considerará completamente cargada cuando todo lo que no es async esté hecho. Los procesos async podrían aún estar ejecutándose cuando el jugador entre a la escena. Evita situaciones donde un proceso async resulte en la carga de una entidad que potencialmente podría dejar al jugador atrapado dentro de su geometría.

#### Depender de Eventos

Intenta hacer que la lógica de la escena dependa de escuchar [eventos](../sdk7/interactivity/event-listeners.md) tanto como sea posible, en lugar de ejecutar verificaciones en cada fotograma.

La función `update()` en un [sistema](../sdk7/architecture/systems.md) se ejecuta en cada fotograma, 30 veces por segundo (idealmente). Evita hacer verificaciones recurrentes si en su lugar puedes suscribirte a un evento.

Por ejemplo, en lugar de verificar constantemente los wearables del jugador, puedes suscribirte al evento `onProfileChanged`, y verificar los wearables del jugador solo cuando han cambiado.

Si debes usar un sistema, evita hacer verificaciones o ajustes en cada fotograma individual. Puedes incluir un temporizador como parte de la función update y solo ejecutar la verificación una vez por cada segundo completo, o cualquier período que tenga sentido.

### Optimizar modelos 3D

Hay varias formas en las que tus modelos 3D pueden optimizarse para ser más ligeros.

Al trabajar con el [Creator Hub](../scene-editor/get-started/editor-installation.md), puedes ver estadísticas sobre los recursos usados por modelos 3D en tu escena, y si pasan alguna de las [limitaciones de escena](../sdk7/optimizing/scene-limitations.md).

Puedes expandir este menú para ver detalles.

Consulta [Optimización de modelos 3D](../3d-modeling/3d-models.md) para varios consejos sobre cómo mantener tus modelos ligeros.
