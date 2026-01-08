---
description: >-
  Una descripción del proceso de publicación y aprobación para wearables de
  Decentraland
metaLinks:
  alternates:
    - >-
      https://app.gitbook.com/s/oPnXBby9S6MrsW83Y9qZ/wearables-and-emotes/publishing/publishing-collections
---

# Publishing Collections

Para instrucciones detalladas sobre cómo enviar tus colecciones para aprobación antes de la publicación, consulta [how to create a collection](../wearables-and-emotes/manage-collections/creating-a-collection.md). Este documento explica cómo funciona el proceso de aprobación al publicar wearables y emotes, y qué criterios usa el Curation Committee al revisar wearables. Para información detallada sobre el Curation Committee, [comienza aquí](../wearables-and-emotes/publishing/curation-committee.md).

### **El Proceso de Publicación**

1. Después de hacer clic en "Publish" en tu propuesta completada y pagar las tarifas de los ítems, la colección se enviará al Curation Committee para aprobación. Las colecciones pendientes de aprobación se marcarán como "Under Review".
2. Cualquier colección pendiente de aprobación del Curation Committee no se puede acuñar hasta que el proceso de aprobación esté completo.
3. Cada vez que publicas una nueva colección, se crea automáticamente un post en el [Decentraland Forum](https://forum.decentraland.org/), proporcionando una lista y descripción general de cada ítem en la colección. Este post del Forum da a la comunidad y al Curation Committee un espacio para compartir comentarios o solicitar cualquier cambio que necesites hacer antes de que tu colección pueda ser aprobada.
4. Si hay cambios que necesitas hacer, el Curation Committee te notificará en el hilo del Forum de tu colección.
5. Puedes hacer cualquier modificación necesaria y enviar tu colección para aprobación nuevamente. Es posible que las colecciones pasen por múltiples revisiones y rechazos antes de recibir la aprobación final.
6. Una vez que tu colección tenga la aprobación final, se te notificará en el Forum. También verás un indicador visual verde en el Wearable Editor junto a la colección aprobada.
7. ¡Con una aprobación exitosa, puedes comenzar a acuñar ítems en tu colección!

### **Tarifas de Publicación**

Hay una tarifa requerida para publicar ítems. Esta tarifa fue originalmente [votada por el DAO de Decentraland](https://governance.decentraland.org/proposal/?id=50092c00-c315-11eb-ac84-1705d1ae4a66) para disuadir a los usuarios de publicar un número excesivo de wearables en un intento de hacer "spam" en el mercado de wearables.

El 2 de septiembre de 2023 [una propuesta](https://governance.decentraland.org/proposal/?id=98d74360-3eae-11ee-88e6-1fe6cb69ee51) estableció las tarifas de publicación en **100 USD por ítem, a pagar en MANA de Polygon**.

{% hint style="warning" %}
**📔 Nota**: Puedes mover MANA entre Ethereum y Polygon usando la [Account dApp](https://account.decentraland.org).
{% endhint %}

Por ejemplo, si publicas una colección con dos ítems y el precio de MANA en ese momento es 1.25 USD, tendrás que pagar una tarifa de 160 MANA (100 USD por cada ítem dividido por el precio de MANA en USD) independientemente de la rarity (o cuántos NFTs se pueden acuñar) de esos ítems.

Estas tarifas se transfieren al comité de curadores y al DAO de Decentraland, donde se usan para ayudar a financiar el crecimiento de la plataforma a través de grants y otras iniciativas votadas por la mayor comunidad de Decentraland.

{% hint style="warning" %}
**📔 Nota**: Actualmente, debido al tiempo y recursos requeridos para revisar cada colección enviada, **la tarifa de publicación no es reembolsable**. Si tu colección es rechazada, no recibirás tu MANA de vuelta. Si tu colección no es aprobada inmediatamente, el Curation Committee te proporcionará sugerencias y comentarios sobre cómo mejorarla, pero la aceptación final de tu colección no puede ser garantizada.
{% endhint %}

### **Criterios de Aceptación**

A continuación hay una descripción general de los criterios utilizados por el Curation Committee al determinar la elegibilidad de una colección. Gran parte de estos criterios se basa en la Sección 2 de la [Content Policy](https://decentraland.org/content/) de Decentraland.

Específicamente, los wearables no pueden:

* Involucrar ilegalidad, como piratería, actividad criminal, terrorismo o pornografía infantil
* Infringir derechos de propiedad intelectual de terceros
* Contener imágenes crueles u odiosas que puedan dañar, acosar, promover o condonar violencia contra, o que estén principalmente destinadas a incitar al odio de, animales, o individuos o grupos basados en raza u origen étnico, religión, nacionalidad, discapacidad, género, edad, estatus de veterano, u orientación sexual/identidad de género
* Contener contenido que sea difamatorio, falso, inexacto, engañoso, o invada la privacidad de otra persona
* Violar la Privacy Policy
* Contener cualquier contenido que promueva o pueda interpretarse como principalmente destinado a evadir las limitaciones descritas anteriormente

Por favor consulta la Content Policy completa [aquí](https://decentraland.org/content/) para detalles y definiciones adicionales. Cualquier envío que viole los criterios anteriores será rechazado.

**Además de la Content Policy, el comité puede rechazar envíos de wearables bajo las siguientes condiciones técnicas:**

> * Es importante que los wearables estén correctamente "skin weighted" para que las animaciones del avatar puedan renderizarse como se espera. Los wearables sin skin weighting correcto serán rechazados.
> * Los wearables deben preservar el mapeo UV del avatar para asegurar que los tonos de piel seleccionados por el usuario puedan renderizarse como se espera.
> * Las dimensiones de las texturas de eyebrow, eye y mouth no deben exceder 256 por 256px, y la imagen debe tener fondo transparente.
> * En el caso de la categoría hands, el wearable no puede ser un ítem adjunto a la mano (una espada, escudo, etc). La categoría está destinada a accesorios de mano como pulseras, relojes, anillos, etc. y en el caso de reemplazar la mano completamente debe seguir un skinning de armature apropiado para los huesos de la mano.
> * Los wearables con un número desproporcionado de triángulos, texturas y materiales pueden ser rechazados porque pueden causar mal rendimiento y una mala experiencia para los jugadores. Los creadores no deben exceder las [directrices](../wearables-and-emotes/wearables/creating-wearables.md) de limitación al crear wearables.
> * Los wearables no pueden contener ítems duplicados dentro de una colección. (Cada ítem dentro de una colección debe ser único.)
> * Los wearables no pueden imitar o copiar otros wearables que ya han sido publicados.
> * Por razones de seguridad, cualquier wearable que contenga cualquier tipo de Código QR puede ser rechazado.
> * Wearables que excedan las restricciones de espacio.
> * Los wearables con categorías engañosas pueden ser rechazados; por ejemplo, un sombrero que está categorizado como un ítem de lower body.
> * Los wearables deben seguir la estructura humanoide de armature para asegurar un gameplay de buena calidad. En este sentido, actualmente vehículos o mascotas no están permitidos porque estos no son wearables por definición.
> * Emotes que excedan las restricciones de tiempo y espacio. Para más información consulta las [directrices de emote](../wearables-and-emotes/emotes/creating-emotes.md)
> * Los curadores del comité de curadores pueden enviar colecciones pero no aprobar las propias. En este caso, otro curador del comité necesitaría revisar para aprobar o rechazar.

### **Atribuyendo Colaboradores** [**#**](https://docs.decentraland.org/creator/wearables/wearables-editor-user-guide/#attributing-collaborators)

Si colaboraste con otros artistas al crear tus ítems, puedes agregar atribuciones dentro del Wearables Editor. Esto solo se puede hacer después de publicar una colección.

Primero, navega al [**Builder**](https://builder.decentraland.org/) y selecciona la pestaña **Collections**. Selecciona la colección que contiene los ítems a los que quieres agregar atribuciones, haz clic en el ícono **…** junto al botón **Mint Items**, y selecciona **Collaborators**.

Para agregar colaboradores, simplemente ingresa su dirección de Ethereum, y haz clic en **Add**. Puedes agregar tantos colaboradores como quieras. Para eliminar un colaborador, simplemente haz clic en **Remove** junto a la dirección del colaborador.

![](../images/wearables-and-emotes/publishing-collections/add-collaborators.png)

### **Vendiendo Ítems**

Después de que tus ítems sean publicados en una colección y aprobados por el Curation Committee, pueden venderse a otros usuarios en el metaverso.

Los ítems pueden venderse en **ventas primarias** y **ventas secundarias**.

* **Las ventas primarias** son realizadas por el smart contract de la Tienda de Decentraland. Durante una venta primaria, el **ítem se acuña automáticamente**, y se vende por el precio establecido por ti en el Wearable Editor.
* **Las ventas secundarias** son realizadas por el smart contract del Marketplace de Decentraland. Estas ocurren cada vez que un usuario vende un ítem en el Marketplace **después de que ha sido acuñado** o **comprado en una venta primaria**. Los ítems pueden venderse por cualquier precio en una venta secundaria.

Para ver ítems disponibles para comprar en ventas primarias y secundarias, dirígete al [**Decentraland Marketplace!**](https://market.decentraland.org/)

### **Ventas Primarias**

Las ventas primarias ocurren cuando uno de tus ítems se compra por primera vez. Estas ventas solo son realizadas por el smart contract de la Tienda de Decentraland.

Cuando un usuario hace una compra primaria de uno de tus ítems, la tienda **acuña el ítem automáticamente**, transfiere el ítem al comprador, y envía las ganancias de MANA a la dirección de beneficiario.

> ¡Recuerda! ¡No necesitas acuñar tus ítems para venderlos en ventas primarias!

Para vender tus ítems a través de ventas primarias, comienza navegando al [**Builder**](https://builder.decentraland.org/) y sigue los siguientes pasos:

Para habilitar Primary Sales, ve a la pestaña **Collections**, selecciona la que quieres habilitar y haz clic en el botón _**Enable sales**_, después de eso haz clic en **Enable Sales** en la ventana de confirmación que aparece.

![](../images/wearables-and-emotes/uploading-wearables/25_enable_sales.png)

Ahora necesitas establecer el precio y poner cada uno de tus ítems a la venta haciendo clic en su botón **Put up for sale** y establecer el precio que quieres que tenga. **Cuando esto esté hecho, tu ítem estará disponible para comprar dentro del** [**Marketplace**](https://market.decentraland.org/) **de Decentraland.**

![](../images/wearables-and-emotes/publishing-collections/put_item_for_sale.png)

Si las ventas de la colección están habilitadas y el precio de los ítems establecido, el [Marketplace](https://market.decentraland.org/) de Decentraland acuñará automáticamente uno de tus ítems cada vez que un usuario haga una compra primaria. Esto te permite acuñar y vender todos tus ítems disponibles hasta que se alcance el suministro máximo. Si quieres guardar uno o más de tus ítems antes de listarlos para venta, necesitas acuñar manualmente un ítem a una de tus propias direcciones de wallet.

Cualquier comprador de uno de tus ítems puede revenderlo en cualquier momento y a cualquier precio en el [Marketplace](https://market.decentraland.org/) de Decentraland.

**Todas las Ventas Primarias en la tienda en el mundo de Decentraland están sujetas a una tarifa del 2.5%, que se transfiere al DAO de Decentraland.**

Si vendes un ítem a través de una venta primaria, recibirás tu MANA en Polygon. Las ganancias de cualquier ítem vendido en Polygon residirán en la sidechain. Si quieres transferir tu MANA de la sidechain de Polygon a la cadena principal de Ethereum, tendrás que pagar una tarifa de transacción. Puedes hacerlo desde la página de [Accounts](https://account.decentraland.org/). Para más información sobre la sidechain de Polygon, consulta [esta publicación del blog](https://decentraland.org/blog/announcements/polygon-mana/).

#### **Deshabilitando Primary Sales**

Para quitar tus ítems de la lista, haz clic en el botón **Remove from sale** de los ítems que quieres eliminar. Esto solo se aplicará a las ventas primarias de tus ítems.

### **Ventas Secundarias**

Los ítems pueden venderse en ventas secundarias en cualquier momento, y por cualquier precio, en el Decentraland Marketplace solo después de:

* Han sido **acuñados**
* Han sido **comprados en una Venta Primaria**

En otras palabras, cualquiera que posea un NFT de un wearable puede venderlo en el Decentraland Marketplace. Hay royalties para wearables vendidos en ventas secundarias en Decentraland. Los royalties van al beneficiario del ítem.

### **Acuñando Wearables**

Acuñar es el proceso de crear los tokens no fungibles (NFTs) reales basados en los ítems que has subido al Wearables Editor.

Todos los wearables en Decentraland se acuñan en la sidechain de Polygon. Esto permite a los usuarios acuñar y transferir ítems sin pagar ninguna tarifa de gas (siempre que estas transacciones se realicen únicamente en la sidechain de Polygon).

Al igual que vender ítems en ventas primarias, no podrás acuñar ningún ítem dentro de una colección hasta que el proceso de revisión esté completo. Si tu colección todavía está bajo revisión, verás la etiqueta **"Under Review"** agregada a tu colección. Después de que haya sido revisada y aprobada, la etiqueta cambiará a **"Published"**, y podrás comenzar a acuñar tus ítems manualmente.

#### **Cómo Acuñar Ítems Manualmente**

Para acuñar ítems publicados, abre la colección que contiene los ítems que te gustaría acuñar, y haz clic en **Mint Items**.

![](../images/wearables-and-emotes/publishing-collections/minting-items-1.png)

Se te mostrará una ventana modal que contiene una lista de los ítems disponibles junto con el suministro disponible para cada uno. Recuerda, el suministro es el número total de ítems que puedes acuñar. Por ejemplo, si tu suministro dice 0/10, entonces has usado 0 de tu suministro total de 10.

![](../images/wearables-and-emotes/publishing-collections/minting-items-2.png)

Al acuñar, debes establecer la dirección que recibirá los ítems acuñados y debes establecer el número de ítems que quieres acuñar a esa dirección. No puedes acuñar más ítems de los que están disponibles en el suministro disponible.

Si ingresas tu propia dirección, entonces los ítems que se acuñan se transferirán a tu cuenta.

Puedes "regalar" ítems a cualquiera que desees ingresando su dirección en lugar de la tuya bajo Address.

Recuerda, estos ítems se acuñan y transfieren a la dirección ingresada gratis. El precio que estableces para los ítems solo se cobra en ventas primarias.

{% hint style="warning" %}
⚠️ Nota: Actualmente solo puedes acuñar 50 ítems por transacción.
{% endhint %}

¿Hay tarifas asociadas con acuñar ítems? No, los ítems se acuñan en la sidechain de Matic, eliminando así cualquier tarifa tradicionalmente asociada con acuñar NFTs en la blockchain principal de Ethereum.

#### **Agregando Minters a la Colección**

Para agregar minters, simplemente ingresa su dirección de Ethereum, y haz clic en **Add**. Puedes agregar tantos minters como quieras. Para eliminar un minter, simplemente haz clic en **Remove** junto a la dirección del minter.

![](../images/wearables-and-emotes/publishing-collections/add-minters.png)

#### **Transferencia de Propiedad de Colección**

Para transferir la propiedad de una Colección, necesitarás:

* La dirección de wallet usada para crear la Colección
* La nueva dirección de wallet a la que la transferirás
* El contrato de la colección

{% hint style="warning" %}
⚠️ Nota: Esto aplica solo a Wearables de Polygon.
{% endhint %}

Usa esta URL - `https://polygonscan.com/address/collection_address#writeContract` y reemplaza `collection_address` con el contrato de tu colección.

![](../images/wearables-and-emotes/publishing-collections/ownership_transfer.png)
