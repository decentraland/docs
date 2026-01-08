---
description: Transmite video en vivo a tu escena usando el Video Screen y Admin Tools.
metaLinks:
  alternates:
    - >-
      https://app.gitbook.com/s/oPnXBby9S6MrsW83Y9qZ/scene-editor/live-ops/live-streaming
---

# Live Streaming

Usa el smart item **Video Screen** junto con el smart item **Scene Admin** para transmitir video en vivo a tu escena.

### Requisitos

* Una escena con al menos un smart item [Video Screen](../scene-editor/interactivity/video-screen.md).
* El smart item [Scene Admin](../scene-editor/live-ops/scene-admin.md) vinculado a tus video screens.
* Software de streaming que pueda enviar a un endpoint RTMP (ej. [OBS](https://obsproject.com/), [XSplit](https://www.xsplit.com/), [StreamYard](https://streamyard.com/)).

### Configurar la escena

1.  Agrega un smart item **Video Screen** a tu escena.

    ![](../images/editor/admin/video-player-item.png)
2.  Agrega un smart item **Scene Admin** y habilita la sección **Video Screens**. Selecciona cada pantalla del desplegable y dale un nombre amigable para la UI de admin.

    ![](../images/editor/admin/multi-video-setup.png)
3.  Publica tu escena (World o Genesis City) y entra como un usuario con permisos de admin.

    ![](../images/editor/publish-button.png)

### Obtener credenciales de stream

1.  Abre la UI de Admin en la escena (ícono superior derecho).

    ![](../images/editor/admin/admin-icon.png)
2.  En la pestaña **Video**, cambia a **Live** y haz clic en **Get Stream Key**.

    ![](../images/editor/admin/get-key.png)
3.  Copia el **RTMP Server** y **Stream Key** en tu software de streaming.

    ![](../images/editor/admin/OBS-configuration.png)

{% hint style="danger" %}
**❗Advertencia**: Solo una persona puede transmitir a una escena a la vez. Cuando termines de transmitir, haz clic en **Stop Streaming** en tu software para liberar el canal.
{% endhint %}

### Iniciar y controlar el stream

1. Inicia streaming desde tu software.
2.  En la UI de Admin, haz clic en **Activate** para mostrar el stream en la escena.

    ![](../images/editor/admin/activate.png)

Notas:

* El streaming funciona en Worlds y Genesis City, sin límites de audiencia del lado de la escena.
* Si agregas múltiples Video Screens, silencia todas menos una para evitar artefactos de audio.

### Stream keys

Las stream keys se generan por escena y son válidas por 4 días (96 horas). Una sola sesión en vivo puede ejecutarse hasta 4 horas continuamente.

![](../images/editor/admin/live-stream-settings.png)

* Haz clic en **Reset Stream Key** para revocar la clave actual y emitir una nueva. Los streams en curso se detendrán.
* Cada escena tiene su propia dirección de streaming y clave. Los admins pueden compartir la clave con streamers externos.
* Solo un stream puede estar activo por escena a la vez; iniciar uno nuevo sobrescribirá el stream actual.

{% hint style="danger" %}
**❗Advertencia**: Trata las stream keys como secretos. Restablece la clave entre presentadores si es necesario.
{% endhint %}

### Streaming desde otros proveedores

También puedes transmitir usando infraestructura de terceros configurando el Video Screen a **Video URL** y pegando una URL de stream.

* La URL debe ser `https` y habilitada para CORS por el proveedor (YouTube y sitios similares no permitirán reproducción directa). Consulta [About External Streaming](../sdk7/media/video-playing.md#about-external-streaming).
* Los proveedores administrados incluyen [Vimeo](https://vimeo.com/), [Livepeer Studio](https://livepeer.studio/) y [Serraform](https://serraform.gitbook.io/streaming-docs/guides/decentraland-playback).
* Tips para configuración de encoder: [Setting up OBS for successful streaming](../sdk7/media/video-playing.md#setting-up-obs-for-successful-streaming).
