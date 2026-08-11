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

#### Reutilizar el mismo modelo muchas veces

Las escenas suelen estar llenas de contenido repetido: postes de luz a lo largo de una calle, sillas en una sala, árboles en un parque. La mejor forma de construir esto es la más simple: **dale a cada copia su propia entidad, y apúntalas todas al mismo archivo _.glb_.**

```ts
// BIEN: un archivo, muchas entidades
for (const position of lampPostPositions) {
  const lampPost = engine.addEntity()
  Transform.create(lampPost, { position })
  GltfContainer.create(lampPost, { src: 'assets/scene/lampPost.glb' })
}
```

El motor reconoce que estas entidades comparten una misma fuente. El archivo se descarga una vez, se convierte a asset bundle una vez, y sus meshes y texturas se mantienen en memoria una sola vez — el vigésimo poste de luz casi no cuesta nada más allá de su propia posición en el mundo. Esto también funciona entre escenas: si una escena vecina usa el mismo archivo, ya está en memoria. En cambio, exportar veinte archivos _.glb_ casi idénticos significa veinte descargas y veinte copias en memoria.

Lo que esto **no** ahorra son draw calls. Veinte postes de luz son veinte objetos a dibujar, ya sea que vengan de veinte entidades o de un único _.glb_ que tenga veinte postes modelados adentro. La única forma de reducir esa cantidad es unir los meshes en tu herramienta de modelado, lo cual es un intercambio real — consulta [Instancing vs Duplicating vs Merging](../../3d-modeling/meshes.md#instancing-objects-vs-duplicating-objects) para saber cuándo vale la pena.

Algunos consejos relacionados:

* **Agrupa en conjuntos en lugar de un único modelo gigante.** Si tienes muchos props dispersos, un buen punto medio es un _.glb_ por grupo — una cuadra de una calle, los muebles de una sala — en lugar de un modelo por prop o un modelo para toda la escena. Reduces la cantidad de objetos y a la vez mantienes cada conjunto lo bastante chico como para que el culling siga sirviendo de algo.
* **¿Vas a crear muchas copias de golpe?** Precarga el modelo primero con el componente `AssetLoad`. Así las copias se crean a partir de un modelo que ya está en memoria, en lugar de que cada una espere la misma descarga.
* **Un modelo muy grande es más difícil para el motor que muchos pequeños.** El motor reparte el trabajo de construir tu escena a lo largo de varios frames para evitar tirones, pero no puede dividir un único modelo enorme: ese cae todo en un mismo frame. Muchas piezas pequeñas cargan de forma progresiva; una pieza monolítica tiene más probabilidades de causar un tirón visible.
* **Repetir un modelo no agrega materiales ni texturas nuevas.** Veinte postes de luz construidos a partir de un modelo reutilizan los materiales y texturas de ese modelo en lugar de sumar al conjunto. Lo que acerca una escena a los [límites](scene-limitations.md) de materiales y texturas es tener muchos modelos *distintos*, cada uno con su propio set — así que consolidar tu escena en torno a una biblioteca más chica de modelos reutilizados también ayuda ahí.
