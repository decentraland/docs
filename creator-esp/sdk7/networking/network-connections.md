---
description: Cómo comunicar tu escena con servidores externos y APIs.
metaLinks:
  alternates:
    - >-
      https://app.gitbook.com/s/oPnXBby9S6MrsW83Y9qZ/scenes-sdk7/networking/network-connections
---

# Conexiones de Red

Tu escena puede aprovechar servicios externos que exponen APIs, puedes usar esto para obtener datos actualizados de precios, datos climáticos o cualquier otro tipo de información expuesta por una API.

También puedes configurar tu propio servidor externo para ayudar a tu escena y servir para sincronizar datos entre tus jugadores. Esto puede hacerse con un servidor que exponga una API REST, o con un servidor que use WebSockets.

### Llamar a una API REST

El código de tu escena puede enviar llamadas a una API REST para obtener datos.

Dado que el servidor podría tardar en enviar su respuesta, debes ejecutar este comando como una [función asíncrona](../programming-patterns/async-functions.md), usando `executeTask()`.

```ts
executeTask(async () => {
	try {
		let response = await fetch(callUrl)
		let json = await response.json()
		console.log(json)
	} catch {
		console.log('failed to reach URL')
	}
})
```

El comando fetch también puede incluir un segundo argumento opcional que agrupa headers, método HTTP y body HTTP en un solo objeto.

* **url**: Dirección para enviar la solicitud
* **init**: Un objeto `FlatFetchInit` que puede contener:
  * **method** : Método HTTP a usar (GET, POST, DELETE, etc)
  * **body**: Contenidos del body de la solicitud. Debe enviarse como un objeto JSON stringificado.
  * **headers**: Headers adicionales para incluir en la solicitud. Los headers relacionados con la firma se agregan automáticamente.
  * **redirect**: Estrategia de redirección ('follow' | 'error' | 'manual')
  * **responseBodyType**: Especifica si el body de la respuesta es 'text' o 'json'
  * **timeout**: Cuánto tiempo esperar una respuesta antes de que falle la solicitud. Por defecto 30000 milisegundos (30 segundos).

```ts
executeTask(async () => {
	try {
		let response = await fetch(callUrl, {
			headers: { 'Content-Type': 'application/json' },
			method: 'POST',
			body: JSON.stringify(myBody),
		})
		let json = await response.json()
		console.log(json)
	} catch {
		console.log('failed to reach URL')
	}
})
```

El comando fetch devuelve un objeto `response` con los siguientes datos:

* `headers`: Un objeto `ReadOnlyHeaders`. Llama al método `get()` para obtener un header específico, o al método `has()` para verificar si un header está presente.
* `ok`: Boolean
* `redirected`: Boolean
* `status`: Número de código de estado
* `statusText`: Texto para el código de estado
* `type`: Tendrá uno de los siguientes valores: _basic_, _cors_, _default_, _error_, _opaque_, _opaqueredirect_
* `url`: URL que fue enviada
* `json()`: Obtener el body en formato JSON.
* `text()`: Obtener el body como texto.

{% hint style="warning" %}
**📔 Nota**: `json()` y `text()` son mutuamente excluyentes. Si obtienes el body de la respuesta en uno de los dos formatos, ya no puedes obtener el otro del objeto `response`.
{% endhint %}

{% hint style="warning" %}
**📔 Nota**: A cada escena de Decentraland solo se le permite realizar un comando `fetch` a la vez. Esto no tiene efecto en cómo debe estructurarse el código de la escena, ya que las solicitudes se ponen en cola internamente. Si tu escena requiere enviar múltiples solicitudes a diferentes endpoints, ten en cuenta que cada solicitud solo se envía cuando la anterior ha sido respondida.
{% endhint %}

### Solicitudes firmadas

Puedes emplear una medida de seguridad adicional para certificar que una solicitud se está originando de una sesión de jugador dentro de Decentraland. Puedes enviar tus solicitudes con una firma adicional, que está firmada usando una clave efímera que la sesión de Decentraland genera para cada jugador basándose en la dirección del jugador. El servidor que recibe la solicitud puede entonces verificar que el mensaje firmado efectivamente coincida con una dirección que está actualmente activa en el mundo.

Este tipo de medidas de seguridad son especialmente valiosas cuando puede haber un incentivo para que un jugador abuse del sistema, para farmear tokens o puntos en un juego.

Para enviar una solicitud firmada, todo lo que necesitas hacer es usar la función `signedFetch()`, exactamente de la misma manera en que usarías la función `fetch()`.

```ts
executeTask(async () => {
	try {
		let response = await signedFetch({
			url: callUrl,
			init: {
				headers: { 'Content-Type': 'application/json' },
				method: 'POST',
				body: JSON.stringify(myBody),
			},
		})

		if (!response.statusText) {
			throw new Error('Invalid response')
		}

		let json = await JSON.parse(response.statusText)
		console.log(json)
	} catch {
		console.log('error fetching from URL')
	}
})
```

Consulta [Validar autenticidad de jugador](https://github.com/decentraland/sdk7-goerli-plaza/tree/main/validate-player-authenticity) para una escena de ejemplo que usa solicitudes firmadas.

### WebSockets

Tu escena puede conectarse a un servidor externo usando WebSockets. Esto es útil para mantener una conexión constante con tu servidor y sincronizar cambios con tu escena.

Un socket web permite un canal de comunicación bidireccional entre el jugador y el servidor, y puede usarse para enviar actualizaciones en cualquier dirección. Alternativamente, puedes usar [conexiones REST](network-connections.md#call-a-rest-api), pero esto solo permite enviar solicitudes desde el jugador al servidor. Las conexiones WebSocket también resultan en significativamente menos overhead para escenas con tráfico de red frecuente.

Intenta configurar un servidor WebSocket usando el framework de tu elección, [socket.io](https://socket.io/) es una opción muy popular que a menudo se usa con Node.js. Consulta [esta escena de ejemplo](https://github.com/decentraland-scenes/ws-example) que incluye el código del servidor.

Para abrir una conexión con el servidor:

1. Importa el paquete WebSocket (`@dcl/sdk/WebSocket`) en tu archivo.
2. Instancia una nueva conexión con `const socket = new WebSocket('url')`
3. Maneja las aperturas de conexión con `socket.onopen`
4. Maneja los mensajes recibidos con `socket.onmessage`
5. Maneja los cierres de conexión con `socket.onclose`
6. Maneja los errores con `socket.onerror`

El siguiente ejemplo abre una conexión con un servidor y luego escucha mensajes desde él. También envía una actualización al servidor cada segundo.

```ts
import { WebSocket } from '~system/WebSockets'

let socket: WebSocket | null = null

async function initializeWebSocket() {
	socket = await WebSocket.connect('ws://localhost:8080')

	socket.onopen = () => {
		console.log('WebSocket conectado')
	}

	socket.onmessage = (event) => {
		console.log('Mensaje recibido:', event.data)
	}

	socket.onclose = () => {
		console.log('WebSocket desconectado')
	}

	socket.onerror = (error) => {
		console.error('Error de WebSocket:', error)
	}

	// Enviar mensajes al servidor cada segundo
	engine.addSystem(() => {
		if (socket && socket.readyState === WebSocket.OPEN) {
			socket.send('Hello Server')
		}
	}, 1) // ejecutar cada 1 segundo
}

export function main() {
	initializeWebSocket()
}
```

### Llamando a servicios API externos

Tu escena puede llamar a servicios API disponibles públicamente, obteniendo datos sobre distintas cosas del mundo exterior. Por ejemplo:

* Datos climáticos desde una ubicación física
* Valores de acciones o valores de criptomonedas
* Hora actual del día en un lugar del mundo
* Información de blockchain
* Generación de números aleatorios a partir de un servicio externo.

Para llevar a cabo estas solicitudes, consulta [Call a REST API](network-connections.md#call-a-rest-api).

{% hint style="warning" %}
**📔 Nota**: Ten en cuenta que los datos que usas para tu escena debes asegurarte de que provengan de una API que esté pública y abierta. Tu escena se ejecuta en el navegador del jugador, sin intermediarios, por lo que solo tiene acceso a APIs donde todas las transacciones sean públicas.
{% endhint %}
