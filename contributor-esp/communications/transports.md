Un _transporte_ es una interfaz del lado del cliente que puede conectarse a un URI comms e intercambiar mensajes en tiempo real con peers o servicios.

{% hint style="info" %}
Puedes ver el protocolo comms en acción y experimentar con él usando la [Comms Station](https://decentraland.github.io/comms-station/) de código abierto.
{% endhint %}

Los clientes son libres de implementar transportes como deseen (siempre que sigan el protocolo esperado por otros clientes y servicios), pero el [diseño recomendado](#recommended) descrito a continuación ha sido probado en la práctica y ha demostrado integrarse bien con diferentes proyectos.

## Transportes Estándar {#types}

Hay 5 tipos de transporte definidos por el protocolo:

* [Websocket](transport-types/websocket.md) (`ws-room`) usa un stream websocket estándar.
* [LiveKit](transport-types/livekit.md) (`livekit`) usa el framework de código abierto LiveKit, basado en WebRTC.
* [SignedLogin](transport-types/signed-login.md) (`signed-login`) hace una solicitud HTTPS firmada para obtener un transporte asignado dinámicamente de un servidor.
* [Offline](transport-types/offline.md) (`offline`) es un transporte ficticio que indica que no hay comms en el entorno actual.
* [Simulator](transport-types/simulator.md) (`simulator`) es un transporte ficticio con comportamiento completamente personalizado, principalmente para que desarrolladores depuren sus implementaciones.

Los mensajes enviados y recibidos a través de una interfaz de transporte son siempre los mismos (ver [mensajes](messages.md)). Algunos transportes pueden envolverlos en estructuras de control para transmisión, pero estos deben desempaquetarse antes de cruzar la interfaz `Transport`.


## Diseño Recomendado {#recommended}

Esta es una interfaz `Transport` mínima escrita en TypeScript:

```ts
interface Transport {
  // Inicializar el Transport con un URI:
  constructor(private uriWithConnectionParams: string)

  // Abrir una conexión usando el URI dado en el constructor:
  connect(): Promise<void>

  // Cerrar la conexión:
  disconnect(): Promise<void>

  // Enviar un payload arbitrario al servicio y todos los peers:
  send(packet: Packet): Promise<void>

  // Suscribirse a mensajes entrantes tanto del servicio como de todos los peers:
  on(event: 'receive', callback: (packet: Packet) => void): void
}
```

Las implementaciones reales comúnmente extienden esto, agregando eventos de conexión/desconexión y unión/salida, envío no broadcast, tipado más estricto o adaptaciones específicas del lenguaje.

### URIs de Transporte

Los valores de `uriWithConnectionParams` son siempre de la forma:

```
<type>:<parámetros de conexión del tipo>
```

El `<type>` corresponde a uno listado arriba, y el formato para `<parámetros de conexión del tipo>` depende del transporte específico. Puede ser una URL, un token opaco, o cualquier dato arbitrario.

El transporte [LiveKit](transport-types/livekit.md), por ejemplo, usa una URL `wss` con un parámetro `access_token` para establecer una conexión autenticada:

```
livekit:wss://comms.example.com?access_token=eyJhbGciOiJI...
```

Para comparación, el transporte [Websocket](transport-types/websocket.md) también usa una URL `wss`, pero sin un token pre-generado. Requiere un flujo de autenticación una vez conectado.


### Creando Transportes

Como cada clase `Transport` soportará un tipo particular de URI, es buena idea tener un método factory que retorne un `Transport` válido o falle inmediatamente. Por ejemplo:

```ts
function createTransport(uriWithConnectionParams: string) {
  const type = getPrefix(urlWithConnectionParams)

  switch (type) {
    case 'ws-room': return new WsRoomTransport(uriWithConnectionParams)
    case 'livekit': return new LiveKitTransport(uriWithConnectionParams)
    // ... otras implementaciones soportadas...
  }

  throw new Error(`Tipo de transporte no soportado: ${type}`)
}
```

Los clientes no están obligados a implementar todos los transportes estándar. Si intentan usar solo un subconjunto de los tipos definidos sin apuntar a manejar todos los URIs, son libres de rechazar tipos que no soporten.

Los clientes más completos, como un World Explorer, son aconsejados a implementar al menos los transportes [websocket](transport-types/websocket.md) y [LiveKit](transport-types/livekit.md), que actualmente están en uso por todos los realms principales.


## Aprende más

Dirígete a una sección de [tipo de transporte específico](#types), lee sobre los diferentes [tipos de mensaje](messages.md) o revisa la [[Comms Demo Station]].
