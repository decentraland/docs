---
description: Aprende cómo mostrar un NFT certificado que posees en tu escena
metaLinks:
  alternates:
    - >-
      https://app.gitbook.com/s/oPnXBby9S6MrsW83Y9qZ/scenes-sdk7/media/display-a-certified-nft
---

# Mostrar un NFT Certificado

Puedes mostrar un NFT 2D (Non-Fungible Token) que posees en tus escenas de Decentraland.

La imagen del NFT y otros datos se toman de una API, basándose en el contrato y el id del token. Cualquier NFT que sea soportado en [OpenSea](https://opensea.io/) también puede mostrarse en un marco de imagen de NFT en Decentraland.

{% hint style="info" %}
**💡 Tip**: En el [Scene Editor](../scene-editor/get-started/about-editor.md), puedes usar un **NFT** [Smart Item](../scene-editor/interactivity/smart-items.md) para lograr esto sin código.
{% endhint %}

El marco de imagen se muestra ajustándose a las dimensiones de la imagen del NFT. Si las dimensiones de la imagen son 512 X 512 píxeles, el marco mantiene su tamaño original. Si la imagen tiene dimensiones diferentes, el marco se redimensionará y estirará para coincidir con estas dimensiones.

{% hint style="info" %}
**💡 Tip**: Si quieres estirar o redimensionar la imagen de lo generado por defecto, puedes cambiar la propiedad `scale` en el componente `Transform` de la entidad.
{% endhint %}

### Agregar un NFT

Agrega un componente `NftShape` a una entidad para mostrar un token 2D en tu escena.

```ts
const nft = engine.addEntity()

Transform.create(nft, {
	position: Vector3.create(8, 1, 8),
})

NftShape.create(nft, {
	urn: 'urn:decentraland:ethereum:erc721:0x06012c8cf97bead5deae237070f9587f8e7a266d:558536',
})
```

El componente `NftShape` debe ser instanciado con un parámetro que incluya lo siguiente:

* Campo `urn`. Este campo toma una cadena que debe seguir esta estructura:

`urn:decentraland:<CHAIN>:<CONTRACT_STANDARD>:<CONTRACT_ADDRESS>:<TOKEN_ID>`

Esta cadena incluye:

* La _red_ donde existe este token. Consulta la lista de valores soportados a continuación.
* El _estándar de contrato_ en el que se basa este token, por ejemplo `erc721`
* El _contrato_ del token (por ejemplo, el contrato de CryptoKitties)
* El _id_ del token específico a mostrar

Por ejemplo:

`urn:decentraland:ethereum:erc721:0x06012c8cf97BEaD5deAe237070F9587f8E7A266d:558536`

El ejemplo anterior obtiene un NFT con la dirección de contrato `0x06012c8cf97BEaD5deAe237070F9587f8E7A266d`, y el identificador específico `558536`. El asset correspondiente puede encontrarse en OpenSea en [https://opensea.io/assets/0x06012c8cf97BEaD5deAe237070F9587f8E7A266d/558536](https://opensea.io/assets/0x06012c8cf97BEaD5deAe237070F9587f8E7A266d/558536).

Los siguientes valores son soportados para _network_:

* `ethereum`: Ethereum Mainnet
* `matic`: Polygon Matic
* `klaytn`: Klaytn
* `bsc`: BNB Chain
* `arbitrum`: Arbitrum
* `arbitrum_nova`: Arbitrum Nova
* `avalanche`: Avalanche
* `optimism`: Optimism
* `solana`: Solana
* `base`: Base
* `blast`: Blast
* `zora`: Zora

{% hint style="warning" %}
**📔 Nota**: Las imágenes deben pesar hasta **6 MB**. Si la imagen es más grande, no se renderizará en la escena.
{% endhint %}

### Personalizar el marco

Por defecto, la imagen tendrá un fondo morado y tendrá un marco con una textura emisiva pulsante alrededor. Puedes establecer las siguientes propiedades para que coincidan mejor con el estilo del NFT y la escena:

* `color`: Determina el lado posterior del modelo, y también el fondo de la imagen en caso de que la imagen del NFT tenga transparencia.
* `style`: Selecciona un modelo de marco de un enum de varias opciones predeterminadas. Usa un valor del enum `NftFrameType`, que contiene una lista de todos los estilos disponibles.

```ts
const shapeComponent = new NftShape(
  urn: 'urn:decentraland:ethereum:erc721:0x06012c8cf97bead5deae237070f9587f8e7a266d:558536',
  {
    color: Color3.Green(),
    style: NftFrameType.NFT_GOLD_EDGES,
  }
)
```

Aquí está la lista completa de estilos de marco soportados:

* `NFT_CLASSIC`
* `NFT_BAROQUE_ORNAMENT`
* `NFT_DIAMOND_ORNAMENT`
* `NFT_MINIMAL_WIDE`
* `NFT_MINIMAL_GREY`
* `NFT_BLOCKY`
* `NFT_GOLD_EDGES`
* `NFT_GOLD_CARVED`
* `NFT_GOLD_WIDE`
* `NFT_GOLD_ROUNDED`
* `NFT_METAL_MEDIUM`
* `NFT_METAL_WIDE`
* `NFT_METAL_SLIM`
* `NFT_METAL_ROUNDED`
* `NFT_PINS`
* `NFT_MINIMAL_BLACK`
* `NFT_MINIMAL_WHITE`
* `NFT_TAPE`
* `NFT_WOOD_SLIM`
* `NFT_WOOD_WIDE`
* `NFT_WOOD_TWIGS`
* `NFT_CANVAS`
* `NFT_NONE`

Algunos marcos usan más materiales que otros. Por ejemplo, el marco predeterminado agrega 1 material para el NFT en sí, 1 material para un plano de fondo coloreado, y 2 materiales para el marco (compartidos con otros marcos de imagen del mismo estilo). Si necesitas reducir materiales para [mantenerte dentro de las limitaciones de escena](../sdk7/optimizing/scene-limitations.md), elige un estilo que sea más simple. Por ejemplo "none" usa solo 1 material para el NFT en sí.

{% hint style="info" %}
**💡 Tip**: Usando Visual Studio Code (u otro IDE), ve la lista completa escribiendo `NftFrameType.` y esperando a que las sugerencias inteligentes muestren la lista de opciones. Usa `NftFrameType.NFT_NONE` para mostrar el NFT simple tal como está, sin marco ni color de fondo.
{% endhint %}

### Abrir una UI de NFT

Abre una UI preconstruida que muestra el nombre, propietario y descripción de un NFT. También incluye el precio actual del NFT y el precio de la última venta si aplica, y un botón que enlaza a la página del NFT en OpenSea, donde hay más información disponible y puede comprarse.

Abre esta UI llamando a la función `openNftDialog()`. Esta función requiere un objeto como argumento que contiene un solo campo `urn`. Este campo toma una cadena que debe seguir esta estructura:

`urn:decentraland:<CHAIN>:<CONTRACT_STANDARD>:<CONTRACT_ADDRESS>:<TOKEN_ID>`

Por ejemplo:

`urn:decentraland:ethereum:erc721:0x00...000:123`

{% hint style="warning" %}
**📔 Nota**: La UI debe abrirse como resultado de un evento de botón, para prevenir spam abusivo. El evento de botón no necesariamente necesita estar en el mismo marco de imagen o en un `NftShape`.
{% endhint %}

Para abrir esta UI como resultado de una acción de clic, agrega lo siguiente:

```ts
import { openNftDialog } from '~system/RestrictedActions'

// Add pointer collider so it can be clicked
MeshCollider.setBox(myEntity, ColliderLayer.CL_POINTER)

// Add onPointerDown callback event.
pointerEventsSystem.onPointerDown(
	{
		entity: myEntity,
		opts: { button: InputAction.IA_PRIMARY, hoverText: 'Click' },
	},
	function () {
		openNftDialog({
			urn: 'urn:decentraland:ethereum:erc721:0x06012c8cf97BEaD5deAe237070F9587f8E7A266d:558536',
		})
	}
)
```
