---
description: Enlaza a otras escenas o sitios externos
metaLinks:
  alternates:
    - >-
      https://app.gitbook.com/s/oPnXBby9S6MrsW83Y9qZ/scenes-sdk7/interactivity/external-links
---

# Enlaces salientes

Puedes agregar enlaces desde tu escena hacia otro contenido, ya sea a otras escenas o a sitios web externos.

## Usar el Scene Editor

La forma más fácil de agregar un enlace externo o un teletransporte es usar el [Scene Editor](../../scene-editor/about-editor.md). Usa el [Smart Item](../../scene-editor/smart-items.md) **Teleport** para agregar un teletransporte a otra escena en Genesis City, o usa cualquiera de los smart items de **Social Links** para agregar enlaces a sitios externos.



## Teletransportes

Para teletransportar a un jugador a otra escena, llama a la siguiente función, indicando las coordenadas a las que deseas que los jugadores se teletransporten.

```ts
import { teleportTo } from "~system/RestrictedActions"

(...)

teleportTo({ worldCoordinates: { x: -51, y: 1 } })
```

A los jugadores se les presenta una pantalla de confirmación antes de ser teletransportados, esta pantalla muestra información del archivo `scene.json` de la escena de destino, incluyendo el `name` de la escena, `description` y `navmapThumbnail`. Consulta [metadatos de escena](../projects/scene-metadata.md) para detalles sobre cómo establecer estos datos.

Ten en cuenta que los teletransportes te llevan a una escena en las coordenadas indicadas, pero no necesariamente a esas mismas coordenadas. Esto significa que al viajar a una escena que tiene múltiples parcelas, los jugadores pueden no aterrizar en las mismas coordenadas especificadas, sino en uno de los puntos de spawn designados por el creador de la escena.

Para mover a un jugador a otro conjunto de coordenadas dentro de la escena actual, usa la función `movePlayerTo()` en su lugar. Consulta [Mover un jugador](move-player.md).

## Teletransporte a un WORLD

Para enviar a un jugador a una escena que no está publicada en el mapa abierto de Genesis City, sino a un [Decentraland WORLD](../../worlds/about.md) aislado, usa la función `changeRealm()`.

```ts
import { changeRealm } from "~system/RestrictedActions"

(...)

changeRealm({realm: 'mannakia.dcl.eth'})
```

A los jugadores se les presenta una pantalla de confirmación antes de ser teletransportados, esta pantalla muestra información del archivo `scene.json` de la escena de destino, incluyendo el `name` de la escena, `description` y `navmapThumbnail`. Consulta [metadatos de escena](../projects/scene-metadata.md) para detalles sobre cómo establecer estos datos.

El jugador aparecerá en uno de los puntos de spawn de la escena en ese world, independientemente de sus coordenadas actuales en el mapa.

## Enlaces externos

Para agregar un enlace a un sitio web externo, usa el comando `openExternalUrl()`.

```ts
import { openExternalUrl } from '~system/RestrictedActions'

openExternalUrl({ url: 'google.com' })
```

Para prevenir cualquier uso abusivo de esta característica para enviar spam a los jugadores, solo es posible llamar a `openExternalUrl` desde un evento de clic o botón explícito en una entidad. No es posible llamar a esta función como resultado de un temporizador, o un área de colisión, o un evento de clic global. Consulta [Eventos de botones](click-events.md) para detalles sobre cómo hacer esto.

Cuando se llama a `openExternalUrl`, se le solicita a los jugadores una pantalla de confirmación, donde se les informa a dónde los llevará el enlace, y donde pueden aceptar o rechazar visitar el enlace.

El enlace se abre en una nueva pestaña, manteniendo la pestaña original en Decentraland.

Si los jugadores marcan la casilla _trust this domain_, no se les solicitará nuevamente durante su sesión, siempre que el enlace provenga de la misma escena y sea hacia el mismo dominio.
