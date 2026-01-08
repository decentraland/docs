---
description: >-
  Aprende qué ofrece el SDK para realizar operaciones con el blockchain de
  Ethereum
metaLinks:
  alternates:
    - >-
      https://app.gitbook.com/s/oPnXBby9S6MrsW83Y9qZ/scenes-sdk7/blockchain/scene-blockchain-operations
---

# Operaciones Blockchain de la Escena

Una escena de Decentraland puede interactuar con el blockchain de Ethereum. Esto puede servir para obtener datos sobre el wallet del usuario y los tokens en él, o para activar transacciones que podrían involucrar cualquier token de Ethereum, fungible o no fungible. Esto puede usarse de muchas maneras, por ejemplo para vender tokens, para recompensar tokens como parte de una mecánica de juego, para cambiar cómo un jugador interactúa con una escena si posee ciertos tokens, etc.

Ten en cuenta que todas las transacciones en la mainnet de Ethereum que son activadas por una escena requerirán que un jugador apruebe y pague una tarifa de gas.

Todas las operaciones blockchain también deben llevarse a cabo como [funciones asíncronas](../sdk7/programming-patterns/async-functions.md), ya que el timing depende de eventos externos.

### Obtener la cuenta ethereum de un jugador

Para obtener la cuenta de Ethereum de un jugador, usa la función `getPlayer()`.

```ts
import { getPlayer } from '@dcl/sdk/src/players'

export function main() {
	let userData = getPlayer()
	if (!userData.isGuest) {
		console.log(userData.userId)
	} else {
		log('Player is not connected with Web3')
	}
}
```

Ten en cuenta que si un jugador ha ingresado a Decentraland como invitado, no tendrá un wallet de ethereum conectado. Si están conectados como invitados, el campo `isGuest` en la respuesta de `getPlayer()` será true. Si `hasConnectedWeb3` es true, entonces puedes obtener la dirección del jugador del campo `publicKey`. Aprende más sobre los datos que puedes obtener de un jugador en [obtener datos del jugador](../sdk7/interactivity/user-data.md#get-player-data)

Debes envolver la función en una función `async()`, aprende más sobre esto en [funciones async](../sdk7/programming-patterns/async-functions.md)

{% hint style="warning" %}
**📔 Nota**: Aunque la dirección eth puede contener caracteres en mayúscula, algunos navegadores convierten la cadena devuelta a minúsculas automáticamente. Si deseas comparar valores de dirección y que funcione en todos los navegadores, usa el método `.toLowerCase()` para convertir el valor a minúsculas.
{% endhint %}

### Verificar precio del gas

Después de importar la librería `eth-connect`, debes instanciar un web3 provider y un request manager, que te permitirán conectarte vía web3 a Metamask en el navegador del jugador.

La función a continuación obtiene el precio actual del gas en la red principal de Ethereum y lo imprime.

```ts
import { RequestManager } from 'eth-connect'
import { createEthereumProvider } from '@dcl/sdk/ethereum-provider'

executeTask(async function () {
	// crear una instancia del web3 provider para interactuar con Metamask
	const provider = createEthereumProvider()
	// Crear el objeto que manejará el envío y recepción de mensajes RPC
	const requestManager = new RequestManager(provider)
	// Verificar el precio actual del gas en la red de Ethereum
	const gasPrice = await requestManager.eth_gasPrice()
	// registrar respuesta
	console.log({ gasPrice })
})
```

{% hint style="info" %}
**💡 Tip**: Ten en cuenta que las funciones manejadas por el `requestManager` deben llamarse usando `await`, ya que dependen de obtener datos externos y pueden tomar algo de tiempo en completarse.
{% endhint %}

### Importar un ABI de contrato

Un ABI (Application Binary Interface) describe cómo interactuar con un contrato de Ethereum, determinando qué funciones están disponibles, qué inputs toman y qué producen. Cada contrato de Ethereum tiene su propio ABI, debes importar los ABIs de todos los contratos que desees usar en tu proyecto.

Por ejemplo, aquí hay un ejemplo de una función en el ABI de MANA:

```ts
{
  anonymous: false,
  inputs: [
    {
      indexed: true,
      name: 'burner',
      type: 'address'
    },
    {
      indexed: false,
      name: 'value',
      type: 'uint256'
    }
  ],
  name: 'Burn',
  type: 'event'
}
```

Las definiciones de ABI pueden ser bastante extensas, ya que a menudo incluyen muchas funciones, por lo que recomendamos pegar el contenido JSON de un archivo ABI en un archivo `.ts` separado e importarlo en otros archivos de escena desde allí. También recomendamos mantener todos los archivos ABI en una carpeta separada de tu escena, llamada `/contracts`.

```ts
import { abi } from '../contracts/mana'
```

Aquí hay enlaces a diferentes contratos de Decentraland. Obtén el ABI para cada contrato haciendo clic en _Export ABI_ y eligiendo _JSON Format_.

* [MANA Token ABI](https://etherscan.io/address/0x0f5d2fb29fb7d3cfee444a200298f468908cc942#code)
* [Decentraland Marketplace](https://etherscan.io/address/0x19a8ed4860007a66805782ed7e0bed4e44fc6717#code)
* [LAND ABI](https://etherscan.io/address/0xf87e31492faf9a91b02ee0deaad50d51d56d5d4d#code)
* [Estate ABI](https://etherscan.io/address/0x959e104e1a4db6317fa58f8295f586e1a978c297#code)
* [AvatarNameRegistry ABI](https://etherscan.io/address/0x894b883905bfEe2CC448880F1b59f4A762E67566)
* [Catalyst ABI](https://etherscan.io/address/0xcc054fab08127c19f621ab83ade5962cd10584ec)

Estos son los contratos para las diversas colecciones de wearables: (cada colección se emitió como un contrato separado)

* [ExclusiveMasksCollection ABI](https://etherscan.io/address/0xc04528c14c8ffd84c7c1fb6719b4a89853035cdd)
* [Halloween2019Collection ABI](https://etherscan.io/address/0xc1f4b0eea2bd6690930e6c66efd3e197d620b9c2)
* [Halloween2019CollectionFactory ABI](https://etherscan.io/address/0x07ccfd0fbada4ac3c22ecd38037ca5e5c0ad8cfa)
* [Xmas2019Collection ABI](https://etherscan.io/address/0xc3af02c0fd486c8e9da5788b915d6fff3f049866)
* [MCHCollection ABI](https://etherscan.io/address/0xf64dc33a192e056bb5f0e5049356a0498b502d50)
* [CommunityContestCollection ABI](https://etherscan.io/address/0x32b7495895264ac9d0b12d32afd435453458b1c6)
* [DCLLaunchCollection ABI](https://etherscan.io/address/0xd35147be6401dcb20811f2104c33de8e97ed6818)
* [DCGCollection ABI](https://etherscan.io/address/0x3163d2cfee3183f9874e2869942cc62649eeb004)

{% hint style="info" %}
**💡 Tip**: Para ver claramente las funciones expuestas por un contrato, ábrelo en [abitopic.io](https://abitopic.io). Solo pega la dirección del contrato allí y abre la pestaña _functions_ para ver la lista completa de funciones soportadas y sus argumentos. Incluso puedes probar llamar las funciones con diferentes parámetros a través de la página web.
{% endhint %}

Configurar TypeScript para poder importar desde un archivo JSON tiene sus dificultades. La solución más fácil recomendada es cambiar la extensión del archivo `ABI.JSON` a `.ts` y modificarlo ligeramente para que su contenido comience con `export default`.

Por ejemplo, si el contenido del archivo ABI comienza con `[{"constant":true,"inputs":[{"internalType":"bytes4" ...etc`, modifícalo para que comience con `export default [{"constant":true,"inputs":[{"internalType":"bytes4" ...etc`.

#### Instanciar un contrato

Después de importar la librería `eth-connect` y el _abi_ de un contrato, debes instanciar varios objetos que te permitirán usar las funciones en el contrato y conectarte a Metamask en el navegador del jugador.

También debes importar el web3 provider. Esto es porque Metamask en el navegador del jugador usa web3, por lo que necesitamos una forma de interactuar con eso.

```ts
import { RequestManager, ContractFactory } from 'eth-connect'
import { createEthereumProvider } from '@dcl/sdk/ethereum-provider'
import { abi } from '../contracts/mana'

executeTask(async () => {
	// crear una instancia del web3 provider para interactuar con Metamask
	const provider = createEthereumProvider()
	// Crear el objeto que manejará el envío y recepción de mensajes RPC
	const requestManager = new RequestManager(provider)
	// Crear un objeto factory basado en el abi
	const factory = new ContractFactory(requestManager, abi)
	// Usar el objeto factory para instanciar un objeto `contract`, referenciando un contrato específico
	const contract = (await factory.at(
		'0x2a8fd99c19271f4f04b1b7b9c4f7cf264b626edb'
	)) as any
})
```

{% hint style="info" %}
**💡 Tip**: Para contratos que siguen un mismo estándar, como ERC20 o ERC721, puedes importar un solo ABI genérico para todos. Luego generas un solo objeto `ContractFactory` con ese ABI y usas esa misma factory para instanciar interfaces para cada contrato.
{% endhint %}

#### Llamar a los métodos en un contrato

Una vez que hayas creado un objeto `contract`, puedes llamar fácilmente las funciones que están definidas en su ABI, pasándole los parámetros de entrada especificados.

```ts
import { getPlayer } from '@dcl/sdk/src/players'
import { createEthereumProvider } from '@dcl/sdk/ethereum-provider'
import { RequestManager, ContractFactory } from 'eth-connect'
import { abi } from '../contracts/mana'

executeTask(async () => {
	try {
		// Pasos de configuración explicados en la sección anterior
		const provider = createEthereumProvider()
		const requestManager = new RequestManager(provider)
		const factory = new ContractFactory(requestManager, abi)
		const contract = (await factory.at(
			'0x2a8fd99c19271f4f04b1b7b9c4f7cf264b626edb'
		)) as any
		let userData = getPlayer()
		if (userData.isGuest) {
			return
		}

		// Realizar una función del contrato
		const res = await contract.setBalance(
			'0xaFA48Fad27C7cAB28dC6E970E4BFda7F7c8D60Fb',
			100,
			{
				from: userData.userId,
			}
		)
		// Registrar respuesta
		console.log(res)
	} catch (error: any) {
		console.log(error.toString())
	}
})
```

El ejemplo anterior usa el abi para el contrato de MANA de Ropsten y transfiere 100 _MANA falso_ a tu cuenta en la red de prueba de Ropsten.

#### Otras funciones

La librería eth-connect incluye una serie de otros helpers que puedes usar. Por ejemplo para:

* Obtener un precio de gas estimado
* Obtener el balance de una dirección dada
* Obtener un recibo de transacción
* Obtener el número de transacciones enviadas desde una dirección
* Convertir entre varios formatos incluyendo hexadecimal, binario, utf8, etc.

### Usando la red de prueba de Ethereum

Mientras pruebas tu escena, para evitar transferir MANA real u otras monedas, puedes usar la _red de prueba Ethereum Sepolia_ y transferir MANA de testnet falso en su lugar.

Para usar la red de prueba debes configurar tu extensión de Chrome Metamask para usar la _red de prueba Sepolia_ en lugar de _Main network_.

Debes adquirir Ether de Sepolia, que puedes obtener gratis de varios faucets externos como [este](https://www.alchemy.com/faucets/ethereum-sepolia/).

{% hint style="info" %}
**💡 Tip**: Para ejecutar la transacción de transferir MANA de Sepolia a tu wallet, necesitarás pagar una tarifa de gas en Ether de Sepolia.
{% endhint %}

Para previsualizar tu escena usando la red de prueba, pega la siguiente URL en una pestaña del navegador. Esto abrirá la escena en el cliente de escritorio de Decentraland:

`decentraland://realm=http://127.0.0.1:8000&local-scene=true&debug=true&dclenv=zone&position=0,0`

{% hint style="info" %}
**💡 Tip**: Cambia el parámetro de posición a las coordenadas de tu escena, para cargar directamente en tu escena.
{% endhint %}

Cualquier transacción que aceptes mientras ves la escena en este modo solo ocurrirá en la red de prueba y no afectará el balance de MANA en tu wallet real.

Si necesitas probar transacciones en el Testnet de Polygon y necesitas tener MANA en ese testnet, necesitarás intercambiar MANA a esa red después de adquirirlo en Sepolia. Para hacer bridge de MANA de Sepolia al Testnet de Polygon, visita tu [página de cuenta de Decentraland en Sepolia](https://account.decentraland.zone/) y haz clic en 'swap' en el lado de Ethereum MANA.

Cuando ejecutas una vista previa en el cliente web heredado, de una escena que usa una de las librerías de ethereum, debes abrir la vista previa en una ventana de navegador separada, tener Metamask abierto en tu navegador, e incluir manualmente la cadena `&ENABLE_WEB3`.

### Enviar mensajes RPC personalizados

Usa la función `sendAsync()` para enviar mensajes sobre [protocolo RPC](https://en.wikipedia.org/wiki/Remote_procedure_call).

```ts
import { sendAsync } from '~system/EthereumController'

// enviar un mensaje
await sendAsync({
	id: 1,
	method: 'myMethod',
	jsonParams: '{ myParam: myValue }',
})
```

### Smart contracts de Decentraland

En el siguiente enlace puedes encontrar una lista de smart contracts de Ethereum relevantes para el ecosistema de Decentraland. La lista incluye los contratos en mainnet así como en otras redes de prueba de Ethereum.

[contracts.decentraland.org](https://contracts.decentraland.org/links)
