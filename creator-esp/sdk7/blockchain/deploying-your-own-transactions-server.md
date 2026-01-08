---
description: Proporciona a los usuarios transacciones sin costo
metaLinks:
  alternates:
    - >-
      https://app.gitbook.com/s/oPnXBby9S6MrsW83Y9qZ/scenes-sdk7/blockchain/deploying-your-own-transactions-server
---

# Desplegando Tu Servidor de Transacciones

El [transactions-server](https://github.com/decentraland/transactions-server/tree/1.8.0) es un servidor proxy que retransmite transacciones a [Gelato](https://www.gelato.network/relay). Recibe una transacción firmada del cliente que a su vez se envía a la red apropiada detrás de escena. Esto permite al propietario del servidor facilitar a sus usuarios transacciones sin costo

El servidor de transacciones se usa para ayudar con la UX de usar múltiples redes y para evitar que cambien de proveedores de red sobre la marcha. Los usuarios pueden permanecer conectados a [Ethereum](https://ethereum.org/en/) e interactuar con [Polygon](https://polygon.technology/) [solo firmando transacciones](https://docs.decentraland.org/blockchain-integration/transactions-in-polygon/)

El DAO de Decentraland ha configurado un servidor usado por nuestras dapps, cubriendo el costo hasta un cierto límite con algunas [restricciones](deploying-your-own-transactions-server.md#restrictions). Este documento explica cómo puedes [desplegar este servidor](deploying-your-own-transactions-server.md#running-the-server) para permitir que tus usuarios retransmitan transacciones con las restricciones que necesites, si las hay.

### Restricciones

Todas las restricciones son por transacción que el usuario intenta enviar. Lo que, en la práctica, se traduce en una solicitud POST al servidor.

Las restricciones configurables que tiene el servidor son:

* Verifica una cuota de transacciones máximas por día. Consulta [la sección de colecciones](deploying-your-own-transactions-server.md#collections) para más información.
* Verifica contratos en whitelist, por lo que si una transacción está intentando interactuar con un contrato que no está reconocido fallará. Para hacer esto usa
  * Los contratos y colecciones desplegadas. Consulta [la sección de contratos y colecciones](deploying-your-own-transactions-server.md#contracts-and-collections) para más información
* El precio de las ventas, restringiéndolo si está por debajo de un umbral. Consulta [la sección de valor mínimo de venta](deploying-your-own-transactions-server.md#min-sale-value) para más información

### Configurando Gelato

[Gelato](https://www.gelato.network/relay) es un Protocolo de Retransmisión Multicadena. Usamos su infraestructura para habilitar transacciones sin costo. Esto significa efectivamente que, cuando vas a enviar una transacción, en su lugar estás firmando un mensaje y enviándolo a Gelato. El servicio se encargará de enviar la transacción por ti y darte una respuesta (hash de transacción) de vuelta.

Necesita un contrato para reenviar las transacciones, pero afortunadamente podemos reutilizar el que está siendo usado por Decentraland (ver abajo)

[Gelato](https://www.gelato.network/relay) funciona como una API al servidor. [Para configurar](deploying-your-own-transactions-server.md#configuring-the-server) necesitarás primero una API KEY que [usaremos más tarde](deploying-your-own-transactions-server.md#gelato). Para obtenerlas:

* [Regístrate](https://app.gelato.network/relay) en el servicio
* Crea una nueva dapp para la red que pretendes apuntar. Para imitar lo que Decentraland configuró:
  * Selecciona las opciones de `Mainnets`
  * Establece un `App name` apropiado para tu dApp
  * elige `Polygon` como la red para el `Smart Contract`
  * Habilita la opción toggle `Any Contract`
* Copia la API KEY de la sección `API Key`

Por último, necesitarás fondear tu dapp recién creada. Puedes hacer esto conectando tu wallet en la sección [1Balance](https://app.gelato.network/1balance) en la barra lateral izquierda. Una vez conectado, te permitirá depositar tu [USDC](https://polygonscan.com/token/0x3c499c542cef5e3811e1192ce70d8cc03d5c3359) para fondear las transacciones que tus usuarios enviarán. Si necesitas obtener MATIC, consulta este [post](https://docs.decentraland.org/blockchain-integration/transactions-in-polygon/#where-can-i-get-matic-to-pay-for-transaction-fees).

#### Testnet

Si quieres probar tu app antes de ir en vivo y estás usando Polygon puedes hacerlo en `Polygon Amoy`, el testnet de Polygon.

Para hacer esto simplemente repite [el proceso](deploying-your-own-transactions-server.md#configuring-gelato) pero seleccionando `Matic Testnet (Amoy)` en el campo de red.

Necesitarás fondear tu dapp, pero puedes hacerlo fácilmente obteniendo tokens Sepolia ETH del [faucet](https://sepoliafaucet.com/).

### Descargando el servidor de transacciones

Primero, necesitarás una copia del código del transactions-server de Decentraland. Puedes encontrarlo [en github](https://github.com/decentraland/transactions-server/tree/v1). Desde allí, tienes dos opciones:

1. **Descargar el código**: Para descargar el código, primero tienes que hacer clic en el botón verde `Code` y luego

* Hacer clic en `Download ZIP`
* Copiar la URL bajo el título `Clone` y luego ejecutar `$ git clone THE_URL_HERE`

2. **Hacer fork del código**: Puedes hacer clic en el botón `fork` en la parte superior derecha de la página. Una vez que el proceso esté completo, podrás descargar tu código de la misma manera que lo harías en la primera opción. Necesitarás una cuenta de Github para esto, para más información sobre hacer fork de repositorios consulta [aquí](https://docs.github.com/en/enterprise-server@3.5/get-started/quickstart/fork-a-repo)

### Configurando el servidor

El servidor de transacciones está escrito en [NodeJS](https://nodejs.org/en/) usando [Typescript](https://www.typescriptlang.org/). Antes de ejecutarlo necesitarás configurar algunas variables de entorno.

Para hacer esto:

* Copia el archivo `.env.example` y pégalo renombrado como `.env`
* Abre el archivo `.env`. Verás que algunas variables tienen un valor predeterminado, como `HTTP_SERVER_PORT=5000` (en qué puerto ejecutar el servidor)
* Puedes dejar la mayoría de los valores como están, pero hay algunos valores importantes a considerar:
  * [Gelato](deploying-your-own-transactions-server.md#gelato)
  * [Transacciones](deploying-your-own-transactions-server.md#transactions)
  * [Contratos y colecciones](deploying-your-own-transactions-server.md#contracts-and-collections)
  * [Valor mínimo de venta](deploying-your-own-transactions-server.md#min-sale-value)

#### Gelato

Usa la API KEY que obtuvimos al [configurar gelato](deploying-your-own-transactions-server.md#configuring-gelato).

```
GELATO_API_KEY=p_qXAlcVwWyU__Fjbn_qwr0rTy14asDf_Z2XCVBnmZX_
```

#### Transacciones

Cuando llega una nueva solicitud de transacción verificará la cantidad **de una dirección** que ha enviado ese día. Si supera el valor establecido, la transacción fallará.

```
MAX_TRANSACTIONS_PER_DAY=10
```

Para eliminar completamente esta verificación, puedes ir al código y eliminar el

```ts
await checkQuota(components, transactionData)
```

método de `async function checkData(transactionData: TransactionData): Promise<void> {` en `src/ports/transactions/component.ts`

#### Contratos y colecciones

El servidor obtendrá la URL de direcciones de Contrato y las almacenará localmente y consultará el subgraph. Cuando llega una nueva solicitud de transacción, entonces verificará si el contrato con el que la transacción está interactuando pertenece a los contratos desplegados en la URL o a las colecciones desplegadas en el subgraph.

Si quieres proporcionar tus propios contratos cambia la URL y mantén la misma estructura que tiene el actual [https://contracts.decentraland.org/addresses.json](https://contracts.decentraland.org/addresses.json). La red usada está determinada por COLLECTIONS\_CHAIN\_ID, y el intervalo con el que se vuelve a obtener el caché es COLLECTIONS\_CHAIN\_ID

Si tienes tus propias colecciones también puedes cambiar la URL del subgraph.

Para eliminar completamente estas verificaciones, puedes ir al código y eliminar el

```ts
await checkContractAddress(components, transactionData)
```

método de `async function checkData(transactionData: TransactionData): Promise<void> {` en `src/ports/transactions/component.ts`

```
CONTRACT_ADDRESSES_URL=https://contracts.decentraland.org/addresses.json
COLLECTIONS_FETCH_INTERVAL_MS=3600000
COLLECTIONS_CHAIN_ID=80002

COLLECTIONS_SUBGRAPH_URL=https://subgraph.decentraland.org/decentraland/collections-matic-amoy
```

#### Valor mínimo de venta

Cuando llega una nueva solicitud de transacción primero analizará los datos que está intentando retransmitir. Si detecta una venta (compra de marketplace, oferta, etc.), verificará el valor contra MIN\_SALE\_VALUE\_IN\_WEI. Si es menor, la transacción fallará.

```
MIN_SALE_VALUE_IN_WEI=1000000000000000000
```

Para verificar los métodos de venta relevantes, puedes ver `src/ports/transaction/validation/checkSalePrice.ts` y para eliminar completamente esta verificación, puedes ir al código y eliminar el

```ts
await checkSalePrice(components, transactionData)
```

método de `async function checkData(transactionData: TransactionData): Promise<void> {` en `src/ports/transactions/component.ts`

### Ejecutando el servidor

Ahora que toda la configuración está lista, lo que queda es ejecutar el servidor. Puedes seguir [su README](deploying-your-own-transactions-server.md) pero en resumen, tendrás que:

* Tener [NodeJS](https://nodejs.org/en/) instalado
* Abrir tu terminal de elección
* Ejecutar los siguientes comandos:

```bash
npm install
npm run migrate # solo la primera ejecución
npm run start
```

Por supuesto, probablemente querrás desplegar esto en tu servicio de elección, como [AWS](https://aws.amazon.com/) por ejemplo. Puedes usar el [Dockerfile](https://github.com/decentraland/transactions-server/tree/v1/blob/master/Dockerfile) del Proyecto para hacerlo.

### Usando el servidor

Ahora que todo está configurado y en ejecución, es hora de usar el servidor.

Para enviar una transacción, necesitas hacer POST a `/transactions`. El esquema requerido para la solicitud está definido por `transactionSchema` en `src/ports/transaction/types.ts`.

Si, en cambio, quieres usar nuestras libs pre-hechas para hacer tu vida más fácil puedes probar [decentraland-transactions](https://github.com/decentraland/decentraland-transactions). Se usa a través de [decentraland-dapps](https://github.com/decentraland/decentraland-dapps) en nuestras dapps como el [Marketplace](https://market.decentraland.org), con las utilidades [`sendTransaction`](https://github.com/decentraland/decentraland-dapps/blob/master/src/modules/wallet/utils.ts#L104). Consulta [este código](https://github.com/decentraland/marketplace/blob/a2191515c6ae7ede54a685cc2dd9f9fafa35366b/webapp/src/modules/vendor/decentraland/OrderService.ts#L33) para un ejemplo.
