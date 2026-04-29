---
description: Reproduce Videos en tu escena
metaLinks:
  alternates:
    - >-
      https://app.gitbook.com/s/oPnXBby9S6MrsW83Y9qZ/scene-editor/interactivity/video-screen
---

# Video Screen

Para reproducir videos pre-grabados o transmitidos en una pantalla en tu escena, usa el Video Player [Smart Item](../scene-editor/interactivity/smart-items.md).

![](../images/editor/admin/video-player-item.png)

### Configuraciones generales

Estas configuraciones son relevantes para todos los escenarios, ya sea que estés reproduciendo videos o transmitiendo.

![](../images/editor/admin/video-automatic.png)

Puedes configurar el volumen del audio del video. Ten en cuenta que el audio del stream no es posicional, se escucha a un volumen uniforme a través de toda tu escena.

El desplegable **Default Media Source** te permite elegir entre dos tipos diferentes de fuentes:

- **Video URL**: Obtén un video o un stream desde una URL o archivo de video local
- **Live Stream**: Usa la infraestructura de streaming gratuita de Decentraland para mostrar un stream. Para usar esto, también debes incluir un smart item [Admin tools](../scene-editor/live-ops/scene-admin.md) en tu escena.

### Reproducir Videos

Puedes reproducir videos pre-grabados desde:

- **Archivos locales**: Sube un archivo de video como parte de la escena, luego apunta el campo _URL_ a la ruta a ese archivo.
- **Stream desde una URL**: Apunta a un stream en vivo o pre-grabado en la web, por ejemplo desde Vimeo. Consulta [streaming videos](video-screen.md#streaming-videos)

El momento en que el smart item Video Player reproduce un video puede depender de diferentes cosas:

- **Automatic**: El video comienza a reproducirse tan pronto como se carga la escena. Para esto, establece el desplegable de media source predeterminado en **Video URL** y pega una URL directamente en el campo **Default Video URL**.

  ![](../images/editor/admin/video-automatic.png)

- **Activado por un admin**: Un [Scene admin](../scene-editor/live-ops/scene-admin.md) que está actualmente en la escena puede usar la UI de Admin para pegar una URL de video y reproducirlo para todos los jugadores que están actualmente en la escena.
- **Basado en acciones del jugador**: Define una Action de tipo **Play Video Stream**. Esto te permite activar la reproducción del video como resultado de interactuar con algún otro smart item, como caminar a una habitación o presionar un botón. Consulta [Smart Items - Advanced](../scene-editor/interactivity/smart-items-advanced.md).

  ![](../images/editor/video-from-action.png)

En todos los casos, configuras el video para que se reproduzca en bucle o una sola vez.

{% hint style="warning" %}
**📔 Nota**: Si demasiados videos se están reproduciendo al mismo tiempo en tu escena, algunos serán pausados por el motor. La prioridad se determina en función de la proximidad al jugador, dirección de la cámara y tamaño de la pantalla. La cantidad máxima de videos simultáneos depende de la configuración de calidad del jugador.

- Low: 1
- Medium: 5
- High: 10

También recomendamos comenzar a reproducir el video cuando el jugador está cerca o realiza una acción para hacerlo. Comenzar a reproducir un video cuando tu escena se carga lejos en el horizonte afectará innecesariamente el rendimiento mientras los jugadores visitan escenas vecinas.
{% endhint %}

#### Acerca de los Archivos de Video

Los siguientes formatos de archivo son soportados:

- _.mp4_
- _.ogg_
- _.webm_

Ten en cuenta que un archivo de video se suma al tamaño total de la escena, lo que hace que la escena tarde más en descargarse para los jugadores que caminan hacia tu escena. El tamaño del video también podría hacer que superes las [scene limitations](../sdk7/optimizing/scene-limitations.md), ya que tienes un máximo de 15 MB por parcel para usar. Recomendamos comprimir el video tanto como sea posible, para que sea menos problemático.

### Live streaming

Para transmisión en vivo de extremo a extremo (configuración de OBS, stream keys, controles de admin), consulta [Live Streaming](../scene-editor/live-ops/live-streaming.md).

#### Streaming desde otras fuentes

También puedes transmitir videos usando otras infraestructuras de streaming. Para hacer esto, simplemente configura el smart item Video Player para usar la media source **Video URL**, y pega la URL del stream en el campo **Default Video URL**.

La fuente del streaming debe ser una URL _https_ (las URLs _http_ no son soportadas). Consulta [About External Streaming](../sdk7/media/video-playing.md#about-external-streaming) para opciones y tips.

Hay una serie de opciones para transmitir video. La opción más simple es usar un proveedor de hosting administrado como [Vimeo](https://vimeo.com/), [Livepeer Studio](https://livepeer.studio/) o [Serraform](https://serraform.gitbook.io/streaming-docs/guides/decentraland-playback) donde pagas una tarifa al proveedor para administrar toda la infraestructura de streaming.

Lee [Setting up OBS for successful streaming](../sdk7/media/video-playing.md#setting-up-obs-for-successful-streaming) para tips sobre cómo transmitir mejor contenido a Decentraland.
