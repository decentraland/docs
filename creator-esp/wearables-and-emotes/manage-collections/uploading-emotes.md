---
description: Directrices para subir Emotes al Editor
metaLinks:
  alternates:
    - >-
      https://app.gitbook.com/s/oPnXBby9S6MrsW83Y9qZ/wearables-and-emotes/manage-collections/uploading-emotes
---

# Uploading Emotes

Una vez que exportes tu emote, tendrás que subirlo al builder. Este documento cubrirá el proceso de subir emotes.

### **Subiendo Tu Archivo**

Recuerda que necesitas crear una colección antes de poder subir tu archivo. Si no sabes cómo hacer eso, consulta [Creating a Collection](https://github.com/decentraland/docs-creator/blob/main/creator/wearables-and-emotes/manage-collections/creating-a-collection.md). Para subir tu emote, simplemente arrastra y suelta el archivo en la ventana _**New Item**_ o busca en tu computadora. Detectará automáticamente si el archivo tiene alguna animación, identificándolo como un emote.

![](../images/wearables-and-emotes/uploading-emotes/01_new_item.png)

Arrastra y suelta tu archivo de animación para subirlo.

Se te pedirá que ingreses un nombre para tu emote, definas su rarity, la categoría y el play mode. Debajo de la miniatura se muestra el número de clips de animación en tu archivo, la longitud de la animación en segundos, la longitud en frames y el frame rate.

![](../images/wearables-and-emotes/uploading-emotes/upload_emote.png)

### **Subiendo Emotes Usando un Archivo .zip**

Si el emote tiene sonido (_mp3_ o _ogg_) debe comprimirse con el `.glb`. Después de eso, simplemente arrastra y suelta el `.zip` al builder. También, es posible agregar un archivo `.json` junto con los otros assets en el mismo `.zip` para agregar nombre, descripción, rarity, categoría, play mode y/o tags. Estas son las definiciones para cada uno:

* `name`: Nombre del Emote
* `description`: Descripción de tu Emote (no más de 64 caracteres en total, contando espacios)
* `category`: Categoría del Emote ("dance", "stunt", "greetings", "fun", "poses", "reactions", "horror", "miscellaneous")
* `rarity`: Rarity del Item ("unique", "mythic", "legendary", "epic", "rare", "exotic", "uncommon", "common")
* `play_mode`: Animación Simple o Loop ("simple", "loop")
* `tags`: Tags para fácil búsqueda en el marketplace.

Para agregar esas definiciones al emote simplemente crea un archivo de texto, nombrándolo **emote.json** y agrega las siguientes líneas como en el ejemplo:

```json
{
  "name": "Tennis Shot",
  "description": "Show me you can do tennis",
  "category": "fun",
  "rarity":"epic",
  "play_mode": "simple",
  "tags":["tennis", "emote", "shot"]
}
```

De esta manera el builder tomará toda la información del .json y la agregará automáticamente al emote.

**Rarity**

Consulta la tabla de rarity [aquí](https://github.com/decentraland/docs-creator/blob/main/creator/wearables-and-emotes/manage-collections/creating-a-collection.md#rarity).

### **Category**

Elige la categoría que mejor describa tu emote.

* Dance
* Stunt
* Greetings
* Fun
* Poses
* Reactions
* Horror
* Miscellaneous

### **Play Mode**

Actualmente hay dos play modes:

* _**Play Once**_: significa que tu emote se reproducirá solo una vez. Después de eso el avatar volverá a la posición _Idle_.
* _**Loop**_: el emote seguirá reproduciéndose en bucle hasta que el usuario ingrese otra acción.

### **Custom Thumbnails**

Para emotes, no tienes que subir ninguna imagen ya que el editor ya tiene una herramienta integrada para crear una miniatura. Solo selecciona el frame que mejor represente la acción.

Las personas deberían poder identificar de qué se trata la animación a través de la miniatura. Si una toma frontal no es suficientemente buena, intenta rotar el modelo, hacer zoom in o out, pan up o down, elige cualquier frame de tu clip. ¡Es realmente importante que selecciones la mejor toma!

![](../images/wearables-and-emotes/uploading-emotes/Edit_thumbnail.gif)

Rota, haz zoom in o out, pan up y down. ¡Usa las herramientas para obtener la mejor toma de tu animación!

### El Editor

Una vez que establezcas la miniatura, tendrás el editor abierto. Aquí es donde puedes verificar si la animación se está reproduciendo bien ya que un avatar 3D la estará realizando.

![](../images/wearables-and-emotes/uploading-emotes/editor.png)

Haciendo clic en el ícono en la parte inferior izquierda podrás editar el avatar. Haz clic en el ícono de cilindro en la parte inferior derecha para verificar si tu animación se mantiene dentro de los límites de altura y espacio.

![](../images/wearables-and-emotes/uploading-emotes/edit_avatar.gif)

El ícono en la parte inferior izquierda te permite editar el avatar.

![](../images/wearables-and-emotes/uploading-emotes/boundaries.gif)

El ícono de cilindro muestra los límites para la animación.

También puedes editar el nombre del emote, miniatura, categoría, rarity y play mode, así como agregar una descripción de la animación y agregar tags. Haz clic en _**Save**_ cuando hayas terminado.

* **Description:** Esta es una breve declaración describiendo tu ítem que se mostrará en el marketplace.
* **Utility** Describe la utilidad en el mundo del Wearable o Emote.
* **Tags:** Los tags son simplemente palabras descriptivas que los usuarios pueden usar al buscar o filtrar ítems. ¡Estas son relevantes para competencias o eventos!

![](../images/wearables-and-emotes/uploading-emotes/editor2.png)

## Probando en el Mundo

Incluso después de probar la animación en el editor, es importante verificar cómo realmente se verá y se comportará en Decentraland. Para probarlo en el mundo, ve a la pestaña Collections, selecciona la colección deseada y mostrará todos los ítems que tienes en ella. Haz clic en See in Decentraland.

![](../images/wearables-and-emotes/uploading-emotes/getting_started.png)

{% hint style="info" %}
Se te pedirá que elijas si quieres probarlo en un Empty Parcel o en Genesis Plaza. Seleccionar Empty Parcels te teletransportará a un lugar sin demasiado contenido, que cargará más rápido. Seleccionar Genesis Plaza te llevará a la plaza principal.
{% endhint %}

![](../images/wearables-and-emotes/uploading-emotes/choice.png)

{% hint style="info" %}
Después de elegir, se abrirá una nueva pestaña en tu navegador con un mensaje informándote que estás por usar un Catalyst personalizado. Haz clic en TRUST PEER-TESTING.DECENTRALAND.ORG para continuar.
{% endhint %}

![](../images/wearables-and-emotes/uploading-emotes/custom_catalyst.png)

{% hint style="info" %}
Después de eso, obtendrás un pop-up preguntando para abrir el Decentraland Explorer. Una vez que el explorer esté ejecutándose, haz clic en Jump Into Decentraland.
{% endhint %}

![](../images/wearables-and-emotes/uploading-emotes/monoco.png)

{% hint style="info" %}
Una vez en el mundo, presiona I para abrir el backpack y, en la pestaña de emotes, selecciona el emote para probar.
{% endhint %}

![](../images/wearables-and-emotes/uploading-emotes/testing.gif)

### **Antes de Publicar**

Asegúrate de agregar una buena descripción y verificar si toda la información y configuraciones son correctas. Revisa también la miniatura. Si has completado toda la información necesaria verás Ready to Submit como el estado de tu ítem. ¡Ahora tu emote está listo para ser publicado!

![](../images/wearables-and-emotes/uploading-emotes/last.png)

¡El estado Ready to Submit significa que tu archivo está listo para ser publicado!
