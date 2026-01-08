---
description: >-
  Cosas importantes a tener en cuenta si deseas integrar los Estates de
  Decentraland en tu marketplace
metaLinks:
  alternates:
    - >-
      https://app.gitbook.com/s/oPnXBby9S6MrsW83Y9qZ/marketplace/estates-marketplace-integrations
---

# Integraciones de Marketplace de Estates

### Integrar el Estate de Decentraland en tu Marketplace

El Estate de Decentraland es un NFT conforme con ERC721 y funciona en Ethereum Mainnet. Por lo tanto, muchos marketplaces de terceros pueden comercializarlos. Para hacerlo, este marketplace debe seguir ciertas reglas para mantener las transacciones seguras para los usuarios.

Como probablemente sepas, cada [Estate](https://docs.decentraland.org/decentraland/faq/#what-is-an-estate) es un grupo de [LANDs](https://docs.decentraland.org/decentraland/faq/#what-is-land) y tiene un hash de _bytes_ asociado al grupo que se llama _`fingerprint`_. Cada vez que el Estate cambia al agregar o eliminar un LAND, su _`fingerprint`_ también cambia.

Para los marketplaces, especialmente los que no tienen un sistema de custodia (escrow), se recomienda al 100% tener un registro del _`fingerprint`_ del Estate cuando alguien lo lista para la venta o hace una oferta. De esa manera, cuando la orden/oferta se ejecuta exitosamente, el propietario actual no puede cambiar el estate intentando hacer front-run a la ejecución de la orden.

No se recomienda listar Estates vacíos. El smart contract del Estate tiene un método `getEstateSize` que devuelve el número de LANDs en el Estate. Si el resultado es `0`, recomendamos no listar ese Estate. Si quieres listarlos de todos modos, verás una imagen como esta:

![](../../.gitbook/assets/dissolved_estate.png)

### Ejemplo

#### Sin usar el fingerprint del Estate

* Bob tiene el Estate1 con LAND (1,1) y (1,2). Fingerprint del Estate1: hash1
* Bob agrega el LAND (1,3) al Estate1. El Estate1 tiene los LANDs: (1,1), (1,2) y (1,3). Fingerprint del Estate1: hash2 (Fingerprint cambió)
* Bob elimina el LAND (1,1) del Estate1. El Estate1 tiene los LANDs: (1,2) y (1,3). Fingerprint del Estate1: hash3 (Fingerprint cambió)
* Bob pone a la venta el Estate1. La lista se crea onchain en Ethereum mainnet con la dirección del smart contract del Estate, el id del Estate, el precio y la fecha de expiración.
* Alice envía una transacción para comprar el Estate especificando el id del estate y el precio esperado a pagar.
* Bob detecta que alguien está tratando de comprar su Estate1 y envía una transacción con tarifas de gas más altas que Alice para eliminar los LANDs (1,2) y (1,3) del Estate1.
* La transacción de Bob se mina primero. Estate1 tiene 0 LANDs. Fingerprint del Estate1: hash4 (Fingerprint cambió)
* La transacción de Alice se mina después. Alice compró el Estate1 con 0 LANDs en él. Significa que Alice fue víctima de front-running (y robada/estafada) por Bob.

#### Usando el fingerprint del Estate

* Bob tiene el Estate1 con LAND (1,1) y (1,2). Fingerprint del Estate1: hash1
* Bob agrega el LAND (1,3) al Estate1. El Estate1 tiene los LANDs: (1,1), (1,2) y (1,3). Fingerprint del Estate1: hash2 (Fingerprint cambió)
* Bob elimina el LAND (1,1) del Estate1. El Estate1 tiene los LANDs: (1,2) y (1,3). Fingerprint del Estate1: hash3 (Fingerprint cambió)
* Bob pone a la venta el Estate1. La lista se crea onchain en Ethereum mainnet con la dirección del smart contract del Estate, el id del Estate, el precio, la fecha de expiración.
* Alice envía una transacción para comprar el Estate especificando el id del estate, el precio esperado a pagar, y **el fingerprint que vio (hash3)**.
* Bob detecta que alguien está tratando de comprar su Estate1 y envía una transacción con tarifas de gas más altas que Alice para eliminar los LANDs (1,2) y (1,3) del Estate1.
* La transacción de Bob se mina primero. Estate1 tiene 0 LANDs. Fingerprint del Estate1: hash4 (Fingerprint cambió)
* La transacción de Alice se revierte porque el smart contract verificó que el fingerprint en el parámetro que Alice envió no coincide con el fingerprint actual del Estate1 (hash3 != hash4). Esta verificación evitó que Alice comprara un Estate no deseado.

### Interfaz de Fingerprint del Smart Contract del Estate

El smart contract del Estate es conforme con una [interfaz de fingerprint](https://github.com/decentraland/land/blob/master/contracts/estate/EstateStorage.sol#L19). Para verificar si una orden/oferta para un estate sigue siendo válida o no, puedes llamar a la función _`verifyFingerprint(uint256 estateId, bytes fingerprint)`_ implementada en el smart contract del Estate. Puedes consultar un ejemplo de producción funcional [aquí](https://github.com/decentraland/marketplace-contracts/blob/master/contracts/marketplace/MarketplaceV2.sol#L382)
