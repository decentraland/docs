---
description: Aprende cómo configurar una escena y configurar sus metadatos.
metaLinks:
  alternates:
    - >-
      https://app.gitbook.com/s/oPnXBby9S6MrsW83Y9qZ/scenes-sdk7/projects/scene-metadata
---

# Metadatos de Escena

Una escena es un proyecto de Decentraland que está delimitado espacialmente, y está mapeado a una o varias parcelas. Si una escena se despliega al mapa de Genesis City de Decentraland, los jugadores pueden experimentarla visitando las coordenadas de la escena. Si una escena se despliega a un [World](../worlds/about.md), los jugadores pueden visitarla vía URL.

Consulta [Archivos en una escena](../sdk7/projects/scene-files.md) para obtener una lista de qué archivos se usan en un proyecto de escena.

### Metadatos

Para editar los metadatos de una escena en el [Scene Editor](../scene-editor/get-started/about-editor.md), abre una escena y haz clic en el **ícono de lápiz**.

![](../images/editor/pencil-icon.png)

Esto abre el menú de la escena, donde puedes configurar múltiples propiedades.

![](../images/editor/metadata-ui.png)

Alternativamente, puedes editar directamente el archivo `scene.json`, donde se almacenan todos estos valores.

{% hint style="warning" %}
**📔 Nota**: No agregues campos personalizados al archivo `scene.json` que no se mencionen en esta página, ya que podría causar problemas al cargar tu escena.
{% endhint %}

### Título, descripción e imagen de la escena

Es muy importante darle a tu escena un título, una descripción y una imagen miniatura para atraer jugadores a tu escena y que sepan qué esperar.

Los jugadores verán estos datos mostrados en un modal cuando seleccionen las parcelas de tu escena en el mapa. También los verán en una pantalla de confirmación cuando sean [teletransportados](../sdk7/interactivity/external-links.md) allí por otra escena. Configurar datos convincentes aquí puede ayudar significativamente a conducir tráfico a tu escena.

Cuando los jugadores navegan por el mundo y entran a tu escena, pueden leer el título de la escena desde debajo del minimapa.

![](../images/media/scene-name.png)

Agrega estos datos a través del menú de escena en el [Scene Editor](../scene-editor/get-started/about-editor.md).

La miniatura debe ser una imagen _.png_ de un tamaño recomendado de _228x160_ píxeles. El tamaño mínimo soportado es _196x143_ píxeles. La imagen puede estirarse si las proporciones ancho-alto no coinciden con _228x160_.

La imagen en `navmapThumbnail` debe ser una ruta a un archivo de imagen en la carpeta del proyecto. También puede ser un enlace URL a una imagen alojada en otro lugar.

{% hint style="warning" %}
**📔 Nota**: Si alojas una imagen en otro lugar, asegúrate de que esté en un sitio que tenga políticas CORS permisivas para mostrar contenido en otros sitios.
{% endhint %}

En caso de que quieras que otros desarrolladores puedan contactarte, también puedes agregar información de contacto a tu escena.

### Categorías

Puedes agregar categorías a tu escena para ayudar a los jugadores y usuarios a explorar Decentraland mejor. Estas se usan en la [dApp Places de Decentraland](https://places.decentraland.org) para categorizar cada lugar y facilitar que los usuarios encuentren lo que les interesa.

Las **Categorías** deben elegirse de una lista predefinida de opciones:

* 🎨 Arte
* 🕹️ Juego
* 🃏 Casino
* 👥 Social
* 🎶 Música
* 👠 Moda
* 🪙 Crypto
* 📚 Educación
* 🛍️ Tienda
* 🏢 Negocios
* 🏅 Deportes
* 🏃 Parkour

Una escena puede pertenecer a más de una categoría, puede tener un máximo de 3 categorías listadas.

En el `scene.json` las categorías se listan en el array `tags`.

Estas son las categorías predefinidas:

* `art`
* `game`
* `casino`
* `social`
* `music`
* `fashion`
* `crypto`
* `education`
* `shop`
* `business`
* `sports`
* `parkour`

Por ejemplo, una Escena podría etiquetarse como `game` y `casino` agregando lo siguiente al `scene.json`

```json
  "tags": [
    "game",
    "casino",
  ],
```

Después de eso, la escena se lista en la dApp Places bajo las categorías `game` y `casino`.

### Clasificación por Edad

El campo **Age Rating** se usa para clasificar el contenido de tu escena según su idoneidad para diferentes grupos de edad. Ayuda a filtrar contenido para los jugadores. Las siguientes opciones están disponibles:

* **🟢 `T` para Teens (13+)**: Este es el requisito de edad mínima según se especifica en los [Términos de Uso](https://decentraland.org/terms/#8-children) de Decentraland. Opta por esta categoría si tu escena se limita a violencia moderada, contenido sugestivo o de terror, apuestas simuladas y lenguaje moderado.
* **🟡 `A` para Adults (18+)**: Elige esta categoría si tu escena presenta alguno de los siguientes: lenguaje ofensivo intenso, violencia gráfica, contenido sexual explícito y/o desnudez, apuestas con dinero real, o sustancias como alcohol, tabaco y drogas.

Al editar el Age Rating a través del `scene.json`, rating es un **código de una sola letra**, escribe ya sea **T** para teens, o **A** para adults.

![](../images/media/content-moderation-flag-icon.png)

```json
 "scene": {
    "rating": "T"
  }
```

#### Contenido Restringido

Hay una tercera categoría para escenas: 🔴 `R` para Restringido. Esta clasificación es aplicada manualmente por Moderadores de Contenido a escenas que violan la [Política de Contenido](https://decentraland.org/content) de Decentraland. Las violaciones pueden incluir, pero no se limitan a:

* Contenido sospechoso o spam
* Contenido abusivo u odioso
* Contenido sexual o degradante
* Abuso infantil
* Acoso o bullying
* Promoción de terrorismo/violencia
* Infracción de IP/Copyright

Las escenas con esta clasificación no se cargarán y nadie podrá interactuar con ellas. Si tu escena cae en esta categoría, debes revisarla y actualizarla para cumplir con la [Política de Contenido](https://decentraland.org/content).

### Feature Toggles

Hay ciertas funcionalidades que pueden deshabilitarse en escenas específicas para que los jugadores no puedan usarlas de forma abusiva. Configura estas en la pestaña **Settings** de la configuración de escena.

![](../images/editor/scene-restrictions.png)

Actualmente, solo se maneja de esta manera la siguiente funcionalidad:

* **Voice Chat**: Se refiere a que los jugadores usen sus micrófonos para tener conversaciones por chat de voz con otros jugadores cercanos.
* **Disable Portable Experiences**: Esta configuración establecerá el comportamiento para cualquier experiencia portable de un jugador mientras esté dentro de tu escena. Esto incluye no solo [experiencias portables](../sdk7/projects/portable-experiences.md) sino también [smart wearables](../sdk7/projects/smart-wearables.md). Con esta configuración, puedes elegir mantenerlos todos habilitados (predeterminado), deshabilitarlos u ocultar su UI. Esto es útil para escenas donde las experiencias portables podrían dar una ventaja injusta a algunos jugadores, por ejemplo usar un jetpack en un desafío de parkour. También se recomienda prevenirlos en escenas donde ocurren transacciones blockchain, y donde una experiencia portable maliciosa podría potencialmente suplantar la UI de la escena.

En el archivo `scene.json`, estos toggles se gestionan bajo `featureToggles`. Las funcionalidades correspondientes están habilitadas por defecto, a menos que se especifiquen como _disabled_ en el archivo `scene.json`.

```json
"featureToggles": {
    "voiceChat": "disabled",
    "portableExperiences": "enabled" | "disabled" | "hideUi"
},
```

Si una propiedad `featureToggles` no existe en tu archivo `scene.json`, créala al nivel raíz en el árbol json.

### Ubicación de aparición

Los **Spawn Settings** en la pestaña **Settings** definen dónde aparecen los jugadores cuando acceden a tu escena directamente, ya sea escribiendo directamente las coordenadas en el navegador o teletransportándose.

![](../images/editor/spawn-point-ui.png)

Tu escena podría tener objetos que pueden bloquear a los jugadores de moverse si resulta que aparecen justo sobre ellos, como árboles o escaleras, o tu escena podría tener un terreno elevado. Sería una mala experiencia para los jugadores si aparecieran sobre algo que no les permite moverse. Por eso tienes la opción de establecer múltiples posiciones de aparición en ubicaciones ad-hoc.

La posición está compuesta por coordenadas dentro de la escena. Estos números se refieren a una posición dentro de la parcela, similar a lo que usarías en el código de la escena en un componente Transform para [posicionar una entidad](../sdk7/3d-essentials/entity-positioning.md).

{% hint style="warning" %}
**📔 Nota**: Todos los puntos de aparición deben estar dentro de las parcelas que componen la escena. No puedes hacer aparecer a un jugador fuera del espacio de estas parcelas.
{% endhint %}

Marca la casilla **Random Offset** para desplazar aleatoriamente a los jugadores que aparecen alrededor del punto de aparición, con un valor máximo. Esto evita que todos los jugadores aparezcan superpuestos cuando aparecen, lo que se ve especialmente mal en escenas concurridas. El valor **Max Offset** es la distancia máxima posible desde el punto de aparición original, en el eje X o Z.

Establece el **Camera Target** para establecer la dirección en la que los jugadores comienzan a mirar cuando saltan a tu escena. Esto te permite tener un mejor control sobre su primera impresión, y puede ser útil cuando quieres ayudar a dirigirlos hacia una dirección específica. Por defecto esto apunta a `{x: 8, y:1, z:8}`, que se traduce al centro de la escena para escenas de una sola parcela, o al centro de la parcela inferior izquierda para escenas más grandes.

Haz clic en **Add Spawn Point** para listar tantos puntos de aparición como quieras. Los jugadores aparecerán aleatoriamente en uno de esos.

#### Puntos de aparición en JSON

Los puntos de aparición también pueden configurarse a través del archivo `scene.json`, en el campo `spawnPoints`.

```json
  "spawnPoints": [
    {
      "name": "spawn1",
      "position": {
        "x": 5,
        "y": 1,
        "z": 4
      }
    }
  ],
```

Una sola escena puede tener múltiples puntos de aparición. Esto es especialmente útil en escenas grandes. Para tener muchos puntos de aparición, simplemente lístalos como un array.

```json
  "spawnPoints": [
    {
      "name": "spawn1",
      "position": {
        "x": 5,
        "y": 1,
        "z": 4
      }
	},
	{
      "name": "spawn2",
      "position": {
        "x": 3,
        "y": 1,
        "z": 1
      }
    }
  ],
```

Cuando hay múltiples puntos de aparición, se elige el que está más cerca de las coordenadas indicadas por el jugador.

Si una coordenada está marcada como `default`, siempre se usará, independientemente de si es la más cercana. Si múltiples puntos de aparición están marcados como `default`, se elige el más cercano de estos.

```json
  "spawnPoints": [
    {
      "name": "spawn1",
      "default": true,
      "position": {
        "x": 5,
        "y": 1,
        "z": 4
      }
	},
	{
      "name": "not-used",
      "position": {
        "x": 3,
        "y": 1,
        "z": 1
      }
    }
  ],
```

**Regiones de aparición**

Puedes establecer una región completa en la escena para que actúe como un punto de aparición. Al especificar un array de dos números en cualquiera de las dimensiones de la posición, los jugadores aparecerán en una ubicación aleatoria dentro de este rango de números. Esto ayuda a prevenir la superposición de jugadores que entran.

```json
  "spawnPoints": [
    {
      "name": "region",
      "position": {
        "x": [1,5],
        "y": [1,1],
        "z": [2,4]
      }
    }
  ],
```

En el ejemplo anterior, los jugadores pueden aparecer en cualquier lugar del cuadrado cuyos esquinas están en _1,1,2_ y _5,1,4_.

Una escena también puede tener múltiples regiones de aparición, al igual que puede tener múltiples puntos de aparición.

```json
  "spawnPoints": [
    {
      "name": "region1",
      "position": {
        "x": [1,5],
        "y": [1,1],
        "z": [2,4]
      }
    },
      {
      "name": "region2",
      "position": {
        "x": [1,5],
        "y": [1,1],
        "z": [6,8]
      }
    }
  ],
```

**Rotación**

También puedes especificar la rotación de los jugadores cuando aparecen, para que estén mirando en una dirección específica.

Simplemente agrega un campo `cameraTarget` a los datos del punto de aparición. El valor de `cameraTarget` debe referenciar una ubicación en el espacio, con coordenadas _x_, _y_ y _z_ relativas a la escena, al igual que el campo `position`.

```json
  "spawnPoints": [
    {
      "name": "spawn1",
      "position": {
        "x": 5,
        "y": 1,
        "z": 4
      },
      "cameraTarget": {
        "x": 10,
        "y": 1,
        "z": 4
      }
    }
  ],
```

Este ejemplo hace aparecer a un jugador en _5, 1, 4_ mirando al Este hacia _10, 1, 4_. Si la posición de aparición es un rango, entonces la rotación del jugador siempre coincidirá con el objetivo indicado. Si hay múltiples puntos de aparición, cada uno puede tener su propio objetivo separado.

### Permisos Requeridos

La propiedad `requiredPermissions` gestiona varias funcionalidades controladas que podrían usarse de manera abusiva y dañar la experiencia de un jugador.

{% hint style="warning" %}
**📔 Nota**: Los permisos solo son relevantes en [experiencias portables](../sdk7/projects/portable-experiences.md) y [smart wearables](../sdk7/projects/smart-wearables.md). Las escenas normales (tanto en parcelas como en Worlds) no se ven afectadas por estos permisos, y son libres de usar la funcionalidad correspondiente.
{% endhint %}

Las funcionalidades correspondientes están bloqueadas de ser usadas por la escena, a menos que el permiso sea solicitado en el archivo `scene.json`.

```json
"requiredPermissions": [
    "ALLOW_TO_MOVE_PLAYER_INSIDE_SCENE",
		"OPEN_EXTERNAL_LINK",
  ],
```

Actualmente, los siguientes permisos se gestionan en smart wearables y experiencias portables:

* `ALLOW_TO_MOVE_PLAYER_INSIDE_SCENE`: Se refiere a [mover un Jugador](../sdk7/interactivity/move-player.md)
* `ALLOW_TO_TRIGGER_AVATAR_EMOTE`: Se refiere a [Reproducir emotes en el avatar del jugador](../sdk7/interactivity/trigger-emotes.md)
* `USE_WEB3_API`: Se refiere a interactuar con los wallets del navegador del jugador, para hacer transacciones o firmar mensajes.
* `USE_FETCH`: Se refiere a enviar solicitudes http a servidores de terceros, usando `fetch` o `signedFetch`
* `USE_WEBSOCKET`: Se refiere a abrir conexiones websocket con servidores de terceros
* `OPEN_EXTERNAL_LINK`: Se refiere a solicitar al jugador que abra enlaces a sitios externos

Si una propiedad `requiredPermissions` no existe en tu archivo `scene.json`, créala al nivel raíz en el árbol json.

### Parcelas de la escena

Al [desplegar](../sdk7/publishing/publishing.md) una escena, el contenido se sube a las coordenadas asignadas en la configuración de la escena. Una escena puede incluir una sola parcela, o una lista de hasta docenas de ellas.

Edita esto en la segunda pestaña del menú de escena en el Scene Editor.

![](../images/editor/scene-parcels-3x3.png)

Usa los dropdowns y haz clic en **Apply Layout** para cambiar las dimensiones de tu escena. También puedes hacer clic en cada parcela individual para desactivarla de tu diseño.

![](../images/editor/scene-parcels-toggled.png)

La escena predeterminada tiene sus coordenadas establecidas en _0,0_, esta información no es necesario cambiarla mientras desarrollas una escena offline, a menos que necesites ocupar múltiples parcelas. Necesitarás cambiar esto antes de desplegar, a coordenadas donde tengas permisos de despliegue.

También puedes cambiar las coordenadas de la escena en el archivo `scene.json`:

```json
 "scene": {
    "parcels": [
      "54,-14"
    ],
    "base": "54,-14"
  }
```

El campo `base` define qué parcela considerar como parcela base. Si tu escena tiene una sola parcela, la base debe ser esa parcela. Si tu escena tiene múltiples parcelas, la base debe ser la parcela inferior izquierda (Sur-Oeste). Todas las posiciones de entidades se medirán en referencia a la esquina Sur-Oeste de esta parcela.

Para mostrar múltiples parcelas en la vista previa de la escena, lista tantas parcelas como pretendas usar. No necesitan ser las parcelas exactas a las que desplegarás, pero todas deben ser adyacentes y estar dispuestas de la misma manera en relación entre sí.

```json
 "scene": {
    "parcels": [
      "54,-14",  "55,-14"
    ],
    "base": "54,-14"
  }
```

{% hint style="warning" %}
**📔 Nota**: El tamaño de escena más grande que puedes establecer es de 45 x 45 parcelas.
{% endhint %}

#### Establecer parcelas a través de la línea de comandos

Puedes establecer las parcelas en tu escena ejecutando el comando `npx update-parcels` en la carpeta de tu escena. Esto es especialmente útil para escenas grandes, ya que no necesitas listar cada parcela involucrada.

**Parcela única**

Pasa un solo argumento con las coords de la escena. Esta coordenada también se establece como la parcela base.

`npx update-parcels <parcel>`

Por ejemplo:

`npx update-parcels 15,-26`

**Múltiples parcelas**

Pasa dos argumentos: las parcelas Sur-Oeste y Norte-Este. La parcela Sur-Oeste también se establece como la parcela base.

`npx update-parcels <parcel> <parcel>`

{% hint style="info" %}
**💡 Tip**: La parcela Sur-Oeste siempre es la que tiene los números más bajos tanto en las coordenadas _X_ como _Y_.
{% endhint %}

Por ejemplo:

`npx update-parcels 15,-26 17,-24`

Este comando genera una escena 3x3, con su parcela base en `15,-26`.

**Personalizar Parcela Base**

Pasa tres argumentos: las parcelas Sur-Oeste y Norte-Este, y la parcela a usar como parcela base.

`npx update-parcels <parcel> <parcel> <parcel>`

{% hint style="warning" %}
**📔 Nota**: La parcela base debe ser una de las parcelas en la escena.
{% endhint %}

**Escenas no cuadradas**

Los comandos anteriores generan escenas de forma rectangular. Las escenas de Decentraland pueden tener formas en L u otras configuraciones. Puedes generar un cuadrado más grande con `npx update-parcels` y luego eliminar manualmente las parcelas en exceso del archivo `scene.json`.

{% hint style="warning" %}
**📔 Nota**: La parcela base debe ser una de las parcelas en la escena.
{% endhint %}

### Hora del día del skybox

Puedes establecer una hora del día fija para tu escena. Todos los jugadores verán la escena con esta hora del día, y el skybox no seguirá el ciclo día/noche.

Abre la configuración de la escena y haz clic en la pestaña **Settings** para encontrar la sección **Skybox**. Desmarca la opción **Auto** y establece la hora del día que desees.

![](../images/editor/fixed-time-of-day.png)

También puedes establecer la hora del día del skybox en el código de tu escena. Para hacer esto, agrega la siguiente sección a tu `scene.json` al nivel raíz:

```json
 "skyboxConfig": {
    "fixedTime": 36000
  }
```

El número se refiere al número de segundos desde el inicio del día, que van desde 0 (que se refiere a _00:00_) hasta 86400 (que se refiere a _24:00_). Cualquier número mayor que 86400 también se interpreta como medianoche.

Aquí hay algunos ejemplos más de valores válidos:

* 0 segundos => _00:00_
* 21600 segundos => _06:00_
* 43200 segundos => _12:00_
* 64800 segundos => _18:00_
* 86400 segundos => _24:00_

### Obtener metadatos desde el código de la escena

[Referencia de API de Escena](https://js-sdk-toolchain.pages.dev/modules/js_runtime_apis.__system_Scene_)

Puede que el código de una escena necesite acceder a los campos de los metadatos de la escena, como las parcelas a las que se despliega la escena, o las posiciones de los puntos de aparición. Esto es especialmente útil para escenas que están destinadas a ser replicadas, o para código que está destinado a ser reutilizado en otras escenas. También es muy útil para librerías, donde la librería podría, por ejemplo, necesitar saber dónde están los límites de la escena.

Para acceder a estos datos, primero importa la función `getSceneInformation`:

```ts
import { getSceneInformation } from '~system/Runtime'
```

Luego puedes llamar a la función `getSceneInformation()`, que devuelve un objeto json que incluye gran parte del contenido del archivo scene.json. El ejemplo a continuación muestra la ruta para obtener varios de los campos más comunes que podrías necesitar de la respuesta de esta función:

```ts
import { getSceneInformation } from '~system/Runtime'

executeTask(async () => {
  const sceneInfo = await getSceneInformation({})

  if (!sceneInfo) return
  console.log("SCENE INFO: ", sceneInfo)
})
```

{% hint style="warning" %}
**📔 Nota**: `getSceneInformation()` necesita ejecutarse como una [función async](../sdk7/programming-patterns/async-functions.md), ya que la respuesta puede demorar una fracción de segundo o más en devolver datos. No uses la función deprecada `getSceneInfo()`.
{% endhint %}

El objeto devuelto por `getSceneInformation()` incluye lo siguiente:

* `baseUrl`: La URL base donde se aloja el contenido de la escena
* `content`: Un array con todos los archivos de la escena, incluyendo su hash, que puede usarse junto con la baseUrl para recuperarlos.
* `metadataJson`: El contenido completo del scene.json de la escena, como una cadena. Debes analizar esto para obtener valores específicos.
* `urn`: El urn único para la escena en su totalidad.

El ejemplo a continuación analiza el contenido de `metadataJson` para obtener valores de propiedades en el archivo scene.json

```ts
import { getSceneInformation } from '~system/Runtime'

executeTask(async () => {
	const sceneInfo = await getSceneInformation({})

	if (!sceneInfo) return

	const sceneJson = JSON.parse(sceneInfo.metadataJson)
	const spawnPoints = sceneJson.spawnPoints
	const parcels = sceneJson.scene.parcels
	console.log({ parcels, spawnPoints })
})
```
