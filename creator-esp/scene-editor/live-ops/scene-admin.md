---
description: >-
  Los administradores de escenas tienen control especial sobre lo que sucede en
  la escena en tiempo real.
metaLinks:
  alternates:
    - >-
      https://app.gitbook.com/s/oPnXBby9S6MrsW83Y9qZ/scene-editor/live-ops/scene-admin
---

# Scene Admin

Otorga a ciertos jugadores el rol especial de **admin** en tu escena.

Durante un evento en vivo, un admin puede controlar espontáneamente lo que sucede en la escena desde dentro de Decentraland, sin necesidad de pre-programar acciones o depender de un servicio de terceros. Inicia la música cuando se haya reunido suficiente multitud, suelta confeti o haz aparecer una nave espacial cuando el momento se sienta correcto.

Cuando un admin de escena visita tu escena, ve una UI especial en la esquina superior derecha que solo ellos pueden ver. A través de esta UI pueden reproducir videos o streams en vivo, enviar anuncios, banear jugadores o activar cualquier smart item que esté configurado para ser activado así. Estas acciones son vistas por todos los demás jugadores en la escena que están conectados a la misma isla de comms que el admin.

![](../images/editor/admin/admin-console.png)

### Configurar admins

Para asignar admins, necesitas agregar el smart item **Scene Admin** a tu escena.

![](../images/editor/admin/admin-smart-item.png)

{% hint style="warning" %}
**📔 Nota**: Actualiza tu escena para usar las últimas dependencias. El Smart item Scene Admin no funcionará si la escena está desactualizada.

<img src="../images/editor/admin/update-dependencies.png" alt="" data-size="original">
{% endhint %}

Mientras estás desarrollando la escena y probándola localmente, siempre eres un admin. Una vez que la escena se publica, cualquier persona con permisos de publicación en la escena también es automáticamente un admin. Esto incluye:

* El propietario de los parcels de LAND o World NAME donde se publica la escena
* Cualquiera a quien se le otorguen **derechos de Operator** en estos parcels o name. Consulta [Give permissions](../marketplace/land-manager.md#give-permissions).
* Cualquier usuario que alquile esa land. Consulta [Rentals](../marketplace/rentals.md).

También puedes asignar personas adicionales a la lista de admin una vez que tu escena esté publicada visitando tu escena como admin y abriendo la pestaña **Moderation Tools**.

![](../images/editor/admin/moderation-tools.png)

Escribe la dirección de wallet de la persona que deseas agregar a la lista de admin y haz clic en **Add**.

Puedes ver quién es admin en la escena haciendo clic en el botón **Admin List**. Desde esta pantalla también puedes **Remove** personas de la lista de admin.

![](../images/editor/admin/admin-list.png)

{% hint style="warning" %}
**📔 Nota**: Solo es posible eliminar el rol de admin de jugadores que fueron agregados manualmente a la lista a través de la pestaña **Moderation Tools**. Los jugadores que son propietarios, operators o renters de la escena se muestran en esta lista pero no se pueden eliminar de sus roles de admin desde esta UI. Para eliminar un rol de admin de un operator, primero debes eliminar su rol de operator.
{% endhint %}

Cada vez que un jugador admin está en la escena, verá una UI especial en la esquina superior derecha. Los jugadores no-admin no ven esta UI.

![](../images/editor/admin/admin-console.png)

### Reproducción de videos

Una de las acciones más comunes que hacen los admins es reproducir videos. El panel de admin incluye una sección de reproductor de video donde pueden controlar cualquier cosa relacionada con videos.

Para habilitar esto, necesitas agregar un smart item **Video Player** a tu escena y vincularlo al smart item Scene Admin.

1.  Agrega un smart item **Video Player** a tu escena

    ![](../images/editor/admin/video-player-item.png)

    Consulta [Video Screen](../scene-editor/interactivity/video-screen.md) para más detalles sobre cómo puedes configurar la media source predeterminada, marcador de posición de imagen y otras configuraciones del smart item Video Player. La mayoría de estas configuraciones pueden ser sobrescritas por el admin una vez dentro de la escena.

    \{% hint style="warning" %\} **📔 Nota**: Un admin solo puede gestionar videos que se reproducen en el smart item Video Screen, no en pantallas agregadas a través de código SDK.

    Puedes incluir tantas video screens como desees. En general, evita tener más de un video diferente reproduciéndose al mismo tiempo, ya que eso perjudica mucho el rendimiento. \{% endhint %\}
2.  Abre el Smart Item Scene Admin, asegúrate de que la casilla **Video Screens** esté habilitada para que esta sección se muestre. Luego selecciona la pantalla de una lista desplegable y dale un nombre amigable para mostrar en la UI de Admin. Puedes agregar tantas Video Screens como desees, cada pantalla se controla de forma independiente.

    ![](../../../.gitbook/assets/multi-video-setup.webp)

Una vez que lo anterior esté configurado, los usuarios admin en tu escena pueden abrir el panel de admin y seleccionar la sección de video para controlar estas video screens.

![](../images/editor/admin/video-player.png)

Si tu escena tiene múltiples video screens, el desplegable **Current Screen** te permite elegir qué video screen controlar. La lista muestra los nombres que diste a cada video screen en la configuración del smart item Admin Tools.

#### Media Sources

Hay dos tipos de media sources para reproducir videos:

*   **Video**: Reproduce un archivo de video desde tu sistema de archivos local o desde una URL. Pega una URL de video en el campo **Video URL** y haz clic en el botón verde **Activate**. El video comenzará a reproducirse en la pantalla seleccionada para todos los jugadores. También puedes detener, pausar, reiniciar, silenciar o cambiar el volumen del video.

    ![](../images/editor/admin/video-from-url.png)

    \{% hint style="warning" %\} **📔 Nota**: No cualquier URL de video funcionará. Los videos de sitios como Youtube, por ejemplo, tienen políticas estrictas sobre su contenido y bloquearán el acceso a ellos desde Decentraland. Consulta [Streaming from other sources](../scene-editor/interactivity/video-screen.md#streaming-from-other-sources) para más información sobre qué puedes y no puedes reproducir en Decentraland. \{% endhint %\}
*   **Live stream**: Reproduce un stream en vivo usando la infraestructura de streaming gratuita de Decentraland y un software de streaming como OBS o StreamYard.

    ![](../images/editor/admin/live-stream.png)

    Consulta [Live Streaming](../scene-editor/live-ops/live-streaming.md) para más información sobre cómo configurar un stream en vivo.

Cada pantalla en tu escena tendrá una de las media sources anteriores establecida como **Active**. Puedes hacer clic en los botones **Video** o **Live** para explorar la configuración en cada sección, no interrumpirás lo que se está reproduciendo actualmente hasta que hagas clic en el botón **Activate** en cualquiera de las secciones.

![](../images/editor/admin/activate.png)

### Anuncios

En la pestaña **Announcements** del panel de admin, los admins pueden escribir mensajes que son vistos por todos los jugadores en la escena. Mensajes como este solo pueden ser enviados por admins, por lo que otros jugadores los percibirán como más legítimos que un mensaje en el chat de alguien que afirma ser un admin.

Selecciona la sección Message de la UI de admin. Escribe un mensaje y haz clic en **Share**. El mensaje puede tener hasta 90 caracteres de largo.

![](../images/editor/admin/announcement.png)

### Banear jugadores

Puedes banear jugadores de tu escena seleccionando la pestaña **Moderation** de la UI de admin, escribiendo el nombre o dirección de wallet del jugador que deseas banear y haciendo clic en el botón **Ban**.

![](../images/editor/admin/ban-players.png)

{% hint style="info" %}
**💡 Tip**: Para obtener la dirección de wallet de un jugador, haz clic en su avatar para abrir su perfil, luego haz clic en el botón **Copy to clipboard** junto a la dirección de wallet.
{% endhint %}

Los jugadores baneados no podrán cargar tu escena ni interactuar con ninguno de sus contenidos. Otros jugadores no los verán en la escena, ni leerán ninguno de sus mensajes de chat.

{% hint style="warning" %}
**📔 Nota**: Los efectos de tu baneo son inmediatos y permanentes. Una vez que un jugador es baneado, permanecerá baneado hasta que se levante el baneo. Banear a un jugador de tu escena solo afecta lo que los jugadores que están parados dentro de tu escena pueden ver, si un jugador sale de los límites de tu escena, ya no se ven afectados por el baneo. Los jugadores baneados son invisibles para otros jugadores si están parados fuera de tu escena también.
{% endhint %}

Haz clic en **View Ban List** para ver la lista de jugadores actualmente baneados. Desde esta lista también puedes **Unban** jugadores.

### Activar smart items

Para Activar una acción de cualquier smart item en la escena:

* Agrega un smart item a tu escena
* Abre la configuración del Smart Item **Scene Admin** en el Creator Hub
* En la sección **Smart item actions**, agrega el smart item del desplegable, dale un nombre personalizado y selecciona una acción predeterminada

Una vez que lo anterior esté configurado, los admins pueden activar la acción abriendo la sección **Smart Item Actions** de la UI de admin y luego seleccionando un ítem de la lista desplegable. Luego pueden hacer clic en el botón **Default** para activar la acción predeterminada de ese ítem, o seleccionar cualquier otra de las acciones del ítem de la lista.

![](../images/editor/admin/smart-item-actions.png)

También puedes mostrar u ocultar cualquier smart item en esta lista, incluso si no incluye una acción para hacer eso.
