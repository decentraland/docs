---
description: Crea wearables con capacidades interactivas
metaLinks:
  alternates:
    - >-
      https://app.gitbook.com/s/oPnXBby9S6MrsW83Y9qZ/scenes-sdk7/projects/smart-wearables
---

# Smart Wearables

Los smart wearables son un tipo de escena global. Como las [experiencias portables](../sdk7/projects/portable-experiences.md), son gameplay que los jugadores llevan consigo mientras se mueven por el metaverso. Por ejemplo, mientras ejecuta una escena global, un jugador podría tomar una bola de nieve del suelo en Genesis Plaza, alejarse a otra escena y lanzar la bola de nieve a otro jugador que también está jugando el mismo juego.

Los smart wearables son experiencias portables que se activan cuando el jugador se pone un cierto artículo de ropa. Los smart wearables pueden otorgar a los jugadores nuevas habilidades, como un jetpack que les permite volar, o agregar una nueva capa de contenido sobre el resto del mundo, como colocar aleatoriamente monedas para recolectar en toda genesis city.

{% hint style="warning" %}
**📔 Nota**: Los Smart Wearables solo pueden crearse usando SDK 7.

El **Creator Hub** actualmente no soporta la creación de proyectos de Smart Wearables.
{% endhint %}

### Comenzando

#### Usando el CLI

1. Abre una línea de comandos en una carpeta nueva y ejecuta

`npx @dcl/sdk-commands init --project smart-wearable`

Este comando crea los archivos y estructura básicos para un nuevo smart wearable.

### Los archivos en la plantilla

La carpeta de un proyecto de Smart Wearable completamente nuevo es muy similar a la de una [escena de Decentraland](../sdk7/projects/scene-files.md), pero notarás las siguientes diferencias:

* `wearable.json` incluye todos los metadatos para la experiencia portable
* Hay un modelo 3D de marcador de posición (glasses.glb) y miniatura (glasses.png) para un par de gafas oscuras. Debes reemplazarlos con el wearable real que estás creando
* `scene.json` es mucho más corto, no incluye propiedades que son irrelevantes para un wearable, como parcelas o puntos de aparición

### Acerca de wearable.json

El archivo `wearable.json` predeterminado se ve así:

```json
{
	"data": {
		"replaces": [],
		"hides": [],
		"tags": ["special", "new", "eyebrows"],
		"representations": [
			{
				"bodyShapes": [
					"urn:decentraland:off-chain:base-avatars:BaseMale",
					"urn:decentraland:off-chain:base-avatars:BaseFemale"
				],
				"mainFile": "glasses.glb",
				"contents": ["glasses.glb"],
				"overrideHides": [],
				"overrideReplaces": []
			}
		],
		"category": "eyewear"
	},
	"name": "Portable Experience Example",
	"description": "This feature is in Alpha state.",
	"rarity": "mythic"
}
```

Los siguientes campos son requeridos en `wearable.json`:

* `id`: Id único del smart wearable.
* `name`: El nombre para el wearable que los usuarios verán en el marketplace
* `description`: La descripción del wearable que los usuarios verán en el marketplace. Asegúrate de indicar qué puede hacer el smart wearable, ya que los usuarios del marketplace no tendrán forma de previsualizar su funcionalidad antes de comprarlo.
* `rarity`: La rareza de suministro del token. Los valores posibles son:
  * unique (1 copia)
  * mythic (10 copias)
  * exotic (50 copias)
  * legendary (100 copias)
  * epic (1000 copias)
  * uncommon (10.000 copias)
  * common (100.000 copias)

{% hint style="warning" %}
**📔 Nota**: Si bifurcaste tu proyecto de uno existente, asegúrate de que el valor `id` sea único antes de publicar tu wearable. Usa [uuidgenerator.net](https://www.uuidgenerator.net/) para generar un nuevo UUID aleatorio
{% endhint %}

Los siguientes campos también pueden incluirse opcionalmente. Estas configuraciones también pueden configurarse desde la UI del Builder, una vez que subas el smart wearable.

* `data`: Incluye lo siguiente
  * `replaces`: Lista de categorías de otros wearables que deben desequiparse al equipar este wearable, además del predeterminado de esta categoría. Ej: Al ponerse una capa top-body, también ocultar los pies.
  * `hides`: Lista de categorías de otros wearables que deben ocultarse (pero no desequiparse) al equipar este wearable, además del predeterminado de esta categoría.
  * `tags`: Etiquetas usadas para hacer que el wearable sea buscable en el marketplace.
  * `representations`:
    * `bodyShapes`: La lista de representaciones de avatar que pueden usar este wearable. Todos los smart wearables deben estar disponibles para formas de cuerpo masculinas y femeninas.
    * `mainFile`: El archivo principal con el modelo 3D del wearable.
    * `contents`: La lista completa de archivos usados para renderizar el modelo 3D del wearable. Por ejemplo, el modelo 3D podría incluir texturas como archivos separados.
    * `overrideHides`: Cualquier excepción del comportamiento predeterminado _hide_ de esta categoría de wearable.
    * `overrideReplaces`: Cualquier excepción del comportamiento predeterminado _replace_ de esta categoría de wearable.
  * `category`: Qué categoría de wearable usar. Los valores posibles son:
    * 'eyebrows'
    * 'eyes'
    * 'facial\_hair'
    * 'hair'
    * 'mouth'
    * 'upper\_body'
    * 'lower\_body'
    * 'feet'
    * 'earring'
    * 'eyewear'
    * 'hat'
    * 'helmet'
    * 'mask'
    * 'tiara'
    * 'top\_head'
    * 'skin'
    * 'hands\_wear'
* `menuBarIcon`: Imagen para usar en el menú de "experiencias", para representar esta experiencia portable, para representar la experiencia portable. Esta imagen debe estar al nivel raíz en tu carpeta. El tamaño de imagen recomendado es 256x256.
* `model`: El modelo 3D para usar para el wearable. Este archivo debe estar al nivel raíz en tu carpeta.
* `bodyShape`: El tipo de cuerpo de avatar con el que este wearable es compatible. Valores posibles:
  * male
  * female
  * both
* `collectionAddress`: La dirección ethereum de la colección publicada de wearables. Esta dirección se asigna una vez publicada, puede dejarse en blanco.

### La miniatura

Debes incluir una imagen llamada `thumbnail.png` al nivel raíz en tu carpeta. Esta imagen se mostrará tanto en la mochila como en el marketplace, para representar tu wearable en 2d. El tamaño de imagen requerido recomendado es 256x256.

Elige una imagen que establezca las expectativas del jugador y represente adecuadamente tu creación.

### La Vista Previa

Ejecutar una vista previa de una experiencia portable es igual que ejecutar la de una escena, simplemente haz clic en **Run Scene** en la pestaña de Decentraland, o ejecuta `npm run start` en la línea de comandos. Si el archivo `wearable.json` está correctamente configurado y el proyecto se reconoce como un smart wearable, notarás que todo lo visible a tu alrededor son las parcelas vacías predeterminadas. En este modo de vista previa, no estás restringido a ningún conjunto de parcelas, puedes agregar modelos 3D o sonidos en cualquier lugar del mundo.

Para probar cómo se comporta el smart wearable en el contexto de una escena, también puedes ejecutar una vista previa de tu wearable al mismo tiempo que ejecutas una vista previa de una o varias escenas usando un [Workspace](../sdk7/projects/workspaces.md). Por ejemplo, puedes ejecutar tu smart wearable junto con la escena [Genesis Plaza](https://github.com/decentraland-scenes/Genesis-Plaza) para probar cómo se comporta en una escena concurrida, mientras está en un ascensor, etc.

### Consejos

* Al posicionar una entidad, ten en cuenta que las posiciones son globales, relativas a las coordenadas 0,0 de Genesis Plaza.
* Para reaccionar a jugadores cercanos:
  * Consulta [Obtener todos los jugadores](../sdk7/interactivity/user-data.md#fetch-all-players) para saber cómo obtener datos de otros jugadores en los alrededores.
  * Ten en cuenta que la carga del smart wearable, escenas circundantes y otros jugadores puede ocurrir en diferentes órdenes dependiendo de la situación. Si el jugador ingresa a Decentraland con el smart wearable ya puesto, es probable que la escena global de tu wearable se cargue antes que otros jugadores. Por otro lado, si el jugador primero carga en una escena y luego se pone el wearable, es probable que otros jugadores ya estén cargados para cuando la escena del wearable comience a ejecutarse.
  * Para experiencias multijugador, espera hasta que el jugador esté conectado a una isla dentro de su realm. Obtén los datos del realm y verifica el campo 'room'. Si el campo 'room' es null, el jugador aún no está conectado a una isla y otros jugadores no estarán cargados todavía. Puedes verificar esto periódicamente cada 1 segundo hasta que el campo 'room' esté presente, y solo entonces inicializar tu lógica.
* Para interactuar con escenas circundantes:
  * No puedes enviar instrucciones directamente a escenas cercanas u otras experiencias portables, el `messageBus` actualmente está en sandbox para cada experiencia portable/escena.
  * Puedes usar un servidor intermediario para enviar información entre la experiencia portable y una escena.
  * Si haces un raycast, puedes detectar hits contra los colliders de entidades de las escenas circundantes. Esto puede decirte la ubicación exacta del hit, dirección normal, e incluso el nombre de la entidad y nombre de mesh del modelo 3D. Esto solo funciona al golpear entidades en escenas escritas con SDK7.
* Matar una experiencia portable: Ejecuta el método `kill()` para auto-terminar una experiencia portable.

### Publicar

Para publicar tu smart wearable:

1. Asegúrate de que la información en `wearable.json` sea precisa. Si usaste otro proyecto como punto de partida, asegúrate de que el `id` sea un identificador único, no usado por otros wearables.
2. Ejecuta `npm run pack` en tu carpeta de proyecto. Esto genera un archivo `smart-wearable.zip` en tu carpeta de proyecto.

{% hint style="warning" %}
**📔 Nota**: La salida de `npm run pack` indicará el tamaño del proyecto exportado sin comprimir, debe ser menor a 3MB. Si es más grande que eso, no será aceptado por el builder.
{% endhint %}

3. Abre el Builder, abre la pestaña Collections, haz clic en + para subir un nuevo wearable.
4. Arrastra tu archivo comprimido `smart-wearable.zip` al Builder, verifica que toda la información sea precisa.

> Nota: Si tu wearable contiene diferentes representaciones de modelo, necesitas hacer un workaround:
>
> 1. En tu proyecto, crea una nueva carpeta para cada representación (`male` y `female`), y pon el modelo 3D para cada representación en su carpeta correspondiente.
> 2. Actualiza tu archivo `wearable.json` para incluir las nuevas representaciones.
> 3. ```lang-json
>    "representations": [{
>      "bodyShapes": ["urn:decentraland:off-chain:base-avatars:BaseMale"],
>      "mainFile": "male/glasses.glb",
>      "contents": ["male/glasses.glb"],
>      "overrideHides": [],
>      "overrideReplaces": []
>    },
>    {
>      "bodyShapes": ["urn:decentraland:off-chain:base-avatars:BaseFemale"],
>      "mainFile": "female/glasses.glb",
>      "contents": ["female/glasses.glb"],
>      "overrideHides": [],
>      "overrideReplaces": []
>    }],
>    ```
> 4. Ejecuta `npm run pack` para generar un nuevo archivo smart-wearable.zip.
> 5. Arrastra el nuevo archivo smart-wearable.zip al Builder.

5. Abre el editor de wearables y asegúrate de que las categorías "hide" y "remove" estén correctamente configuradas para deshabilitar otras categorías de wearables cuando este wearable esté puesto.
6. Crea una nueva colección con este y quizás otros wearables.
7. Haz clic en el ícono de 3 puntos junto a "Mint Items" y selecciona "See in world". Esto abrirá una pestaña con el explorador en Sepolia, donde puedes probar todos los wearables de tu colección en Decentraland, y ver cómo se comportan en un escenario más real, por ejemplo corriendo por Genesis Plaza.
8. En este punto, tu wearable está listo para ser publicado.

### Acciones restringidas

Para prevenir abusos, ciertas funcionalidades no están permitidas en experiencias portables por defecto, y requieren agregar una bandera de permiso.

Consulta [Permisos requeridos](../sdk7/projects/scene-metadata.md#required-permissions) para más detalles.

### Limitaciones

> IMPORTANTE: El smart wearable completo necesita caber dentro de 3MB. Esto incluye el modelo 3D, miniatura, código, librerías, archivos de sonido, modelos 3D adicionales, imágenes de UI, etc. Este límite es para la carpeta sin comprimir. El builder no te permitirá subir wearables más grandes que esto. Para verificar el tamaño de tu experiencia portable, ejecuta `npm run pack`, el tamaño del proyecto se especifica en el texto de salida del comando. También puedes verificar esto descomprimiendo el archivo `smart-wearable.zip` generado y verificando el tamaño de la carpeta.

Los smart wearables solo ejecutan la experiencia portable para el jugador que usa el wearable. Otros jugadores no ven los efectos. Por ejemplo, si la experiencia portable renderiza una mascota que sigue al jugador, otros jugadores alrededor no verán esta mascota. Sin embargo, otros jugadores verán a los avatares realizar animaciones que se ejecutan como parte de la escena del wearable, incluso [animaciones de avatar personalizadas](../sdk7/interactivity/trigger-emotes.md#custom-animations) subidas como parte de los archivos del smart wearable.

Los smart wearables solo funcionan cuando los jugadores los tienen puestos. Por esta razón, los jugadores solo pueden tener un número limitado de smart wearables activados, y dependiendo de qué parte del cuerpo ocupen, algunos serán incompatibles con otros. Por ejemplo, no puedes tener dos sombreros al mismo tiempo, o un casco y cabello al mismo tiempo.

Si un wearable está "oculto" pero no "eliminado" por otros wearables que se usan, entonces el smart wearable aún puede estar activado, incluso si el wearable correspondiente no es visible.

### Ejemplos

[Muestra de smart wearable](https://github.com/decentraland/smart-wearable-sample))
