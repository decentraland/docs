---
description: Directrices para Subir Smart Wearables al Editor
metaLinks:
  alternates:
    - >-
      https://app.gitbook.com/s/oPnXBby9S6MrsW83Y9qZ/wearables-and-emotes/manage-collections/uploading-smart-wearables
---

# Uploading Smart Wearables

Después de generar tu Smart Wearable usando el [SDK7](https://github.com/decentraland/docs-creator/blob/main/creator/development-guide/sdk7/smart-wearables/README.md), el siguiente paso es subirlo al builder. Este documento explica cómo subir, publicar y poner tus Smart Wearables a la venta.

### Subiendo Tu Archivo

Recuerda que necesitas crear una colección antes de subir tu archivo. Si no sabes cómo hacer eso, consulta [Creating a Collection](https://github.com/decentraland/docs-creator/blob/main/wearables-and-emotes/manage-collections/creator/wearables-and-emotes/manage-collections/creating-collection/README.md). Para subir tu Smart Wearable, arrastra y suelta el archivo en la ventana _**New Item**_ o busca en tu computadora. Detectará automáticamente si el archivo es un Smart Wearable. **Recuerda que el tamaño máximo de archivo de la colección es 3MB**.

Cuando subas el archivo, se te pedirá que subas un video showcase.

### Subiendo Tu Video Showcase

Este video showcase se mostrará en el marketplace para que los compradores vean cómo funciona el Smart Wearable.

Para subir tu video showcase, arrastra y suelta un archivo de video **.mp4** en la ventana _**Upload a video for your Smart Wearable**_ o busca en tu computadora. **Recuerda que el tamaño máximo del video es 4MB y la duración máxima es 15 segundos**.

Cuando subas el video showcase, se te pedirá que ingreses un nombre y definas la rarity y la categoría. También puedes agregar una miniatura para el Smart Wearable si gustas.

#### Rarity

Selecciona la Rarity de tu ítem.

| Rarity    | Number of Items |
| --------- | --------------- |
| Unique    | 1               |
| Mythic    | 10              |
| Exotic    | 50              |
| Legendary | 100             |
| Epic      | 1,000           |
| Rare      | 5,000           |
| Uncommon  | 10,000          |
| Common    | 100,000         |

#### Category

Los wearables están organizados en diferentes categorías, dependiendo de qué parte de un avatar modifican. En este paso, debes seleccionar la categoría de ítem apropiada.

#### Custom Thumbnails

Puedes agregar tu miniatura haciendo clic en el ícono de cámara y seleccionando la imagen que deseas de tu computadora. **Por favor asegúrate de que la miniatura esté en un formato de archivo .png cuadrado de 256px, con fondo transparente.** Ten en cuenta que el Curation Committee no aprobará colecciones que tengan miniaturas sin fondos transparentes.

{% hint style="warning" %}
⚠️ Tener un buen render de tu Wearable es crucial para hacerlo más atractivo para los usuarios potenciales del Marketplace. **Es importante evitar agregar gráficos que no sean el wearable en sí porque esto puede causar que el Curation Committee lo rechace.**
{% endhint %}

#### Update Video Showcase

Para actualizar tu video showcase, simplemente haz clic en el ícono de cámara y busca el video en tu computadora. **Ten en cuenta que el tamaño máximo de archivo permitido es 4MB y la duración no debe exceder 15 segundos**.

#### Properties

Junto a la miniatura, encontrarás las propiedades de tu wearable como el número de triángulos de tu modelo, el número de materiales y las texturas.

### Subiendo Mouth, Eyes and Eyebrows

Las categorías mouth, eyes y eyebrows tienen un comportamiento diferente en el editor porque estos son solo archivos .png. Para subirlos simplemente arrastra y suelta el archivo png como una imagen transparente (256X256 pixels). Mouth será automáticamente teñido por el color de piel, lo mismo para las eyebrows teñidas por el color del cabello.

{% hint style="warning" %}
Si quieres que el asset esté enmascarado, para que una parte del mouth o eyebrows no se vea afectada por el teñido, sube un archivo zip con tanto el png como los archivos de máscara. Recuerda que el archivo de máscara debe tener un sufijo "\\\_mask" para funcionar.
{% endhint %}

Después de subir tus Wearables terminarás con una pantalla como esta, que muestra los ítems en tu colección.

### Estableciendo el Precio de Tu Smart Wearable

Puedes establecer el precio de tu Wearable haciendo clic en _**Set Price**_. Todo esto se puede editar en cualquier momento, así que no te preocupes si quieres cambiarlo más tarde. Los precios se establecen en MANA. Recuerda que cuando acuñas Wearables, se acuñan directamente en Matic/Polygon. De hecho, cuando un usuario compre tu ítem, la transacción se realizará en MANA de Matic/Polygon.

También podrías _**Make it Free**_, lo que significa que el precio será 0 MANA, y la dirección de beneficiario será nula. Ten en cuenta que ofrecer un producto gratis como venta primaria no impide que se venda a cualquier precio como venta secundaria.

No olvides establecer la dirección de beneficiario, que es la que recibirá el MANA de tus ventas. Puedes usar cualquier dirección de Ethereum que desees. Para completar automáticamente la dirección con la que iniciaste sesión, haz clic en _**I'm the Beneficiary.**_

Guarda el precio, y volverás a la lista de Wearables en tu colección. Cuando hagas clic en el ítem, obtendrás su información general. Haz clic en el botón _**Preview in Editor**_ para verlo en el editor.

## El Editor

Una vez que hagas clic en _**Preview in Editor**_, tendrás el editor abierto. Puedes editar la información de tu Smart Wearable, incluyendo la descripción, tags y overrides.

### Description

Esta es una breve declaración describiendo tu ítem que se mostrará en el marketplace.

### Overrides

Los overrides determinan qué categorías de Wearable o partes del cuerpo del avatar tu ítem ocultará. Por ejemplo, un sombrero con cabello adjunto podría necesitar ocultar la categoría _Hair_. Un casco de buzo de aguas profundas puede requerir ocultar accesorios de cabeza como aretes, eyewear, tiaras, etc., que no serían visibles. Se pueden seleccionar múltiples opciones para cada override.

* **Base Body**: Esto se refiere a partes centrales del avatar como la _head_ y las _hands_. Por ejemplo, si estás creando un ítem de **Handwear** como una mano mecánica de robot, probablemente necesitarás ocultar _hands_ para prevenir superposición y clipping.
* **Wearables**: Esto incluye otras categorías de Wearable. Puedes ocultar múltiples categorías. Por favor echa un vistazo a [**Creating Wearables**](https://github.com/decentraland/docs-creator/blob/main/creator/wearables/creating-wearables/README.md) para más detalles sobre cada categoría y cómo interactúan los ítems.

{% hint style="warning" %}
Nota: Los overrides que selecciones serán la configuración predeterminada sugerida para tu Wearable. Sin embargo, los usuarios pueden personalizar qué Wearables están ocultos o mostrándose desde el Backpack.
{% endhint %}

### Tags

¡Los tags son palabras descriptivas que los usuarios pueden utilizar para competencias o eventos!

### Preview

Para previsualizar tu Smart Wearable, pasa tu mouse sobre el elemento de wearable en la parte superior izquierda y haz clic en el símbolo de ojo.

Haciendo clic en el ícono en la parte inferior izquierda, puedes editar el avatar. Esto es útil si tienes una versión masculina y femenina de tu Wearable, así que verifica cómo se ven ambas versiones en el editor, probando diferentes emotes para identificar problemas de skinning y mezclando otros Wearables para ver cómo combina con otras ropas. Cuando hayas terminado de editar tu wearable, haz clic en _**Save**_.

### Probando en Decentraland

Incluso después de probar el Smart Wearable en el editor, es importante verificar cómo se verá y comportará en Decentraland. Para probarlo allí, ve a la pestaña Collections. Selecciona la colección deseada y haz clic en el botón _**See in Decentraland**_.

Después de hacer clic en el botón _**See in Decentraland**_, aparecerá el siguiente pop-up. Seleccionar _**Empty Parcels**_ te teletransportará a un lugar sin demasiado contenido, que cargará más rápido. Seleccionar _**Genesis Plaza**_ te llevará a la plaza principal.

Una vez que selecciones la ubicación para teletransportarte, se abrirá una nueva pestaña en tu navegador y obtendrás este mensaje.

Haz clic en _**Switch to Sepolia**_, y aparecerá un pop-up de tu wallet pidiéndote cambiar la red. Haz clic en Switch Network, y la nueva pestaña se actualizará automáticamente. Para probar tu Smart Wearable, puedes ir al backpack y seleccionarlo.

{% hint style="warning" %}
Si no has habilitado las redes testnet de Ethereum, puedes seguir este [Artículo de Metamask](https://support.metamask.io/hc/en-us/articles/13946422437147-How-to-view-testnets-in-MetaMask).
{% endhint %}

### Antes de Publicar

Asegúrate de establecer el precio correctamente, agregar una buena descripción y verificar si toda la información y configuraciones son correctas. Si has completado toda la información necesaria verás _**Done**_ como el estado de tu ítem.
