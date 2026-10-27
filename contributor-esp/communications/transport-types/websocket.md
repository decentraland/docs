El transporte websocket es uno de los transportes de mensajería de isla soportados por el protocolo comms de Decentraland. Los clientes deben usarlo cuando reciben una cadena de conexión apropiada del servicio [Archipelago](../archipelago.md) de su realm, o si está indicado como un transporte fijo.

En el contexto del transporte websocket, una isla se refiere como una _room_ (sala). Cualquier nombre indica lo mismo: un grupo de jugadores cercanos que intercambian actualizaciones y chat.

Las cadenas de conexión comienzan con el prefijo `ws-room:`, seguido de un URI `wss://` para la sala específica. Se ven así:

```
ws-room:wss://comms.example.com/rooms/<room-id>
```

En ausencia de un protocolo explícito para el URI websocket, se asume `wss://`.

## Conectando

El transporte usa el protocolo websocket regular sobre HTTPS. Los clientes pueden abrir una conexión usando cualquier implementación estándar a su disposición.

## Paquetes Websocket

Todos los mensajes del transporte websocket están serializados usando la estructura [`WsPacket`][WsPacket]. Implementan un conjunto de mensajes de conectividad y autenticación a nivel de protocolo, además de un tipo contenedor para mensajes de cliente.

{% hint style="info" %}
La estructura [`WsPacket`](#paquetes-websocket) no debe confundirse con el mensaje [`Packet`][Packet]. Es una capa de envoltorio adicional específica del transporte websocket. Los mensajes comms reales están contenidos en el tipo [`WsPeerUpdate`](#WsPeerUpdate).
{% endhint %}

| Campo     | Tipo   | Valor                                                                                                                                                  |
| --------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `message` | `enum` | Uno de `WsIdentification`, `WsChallengeRequired`, `WsSignedChallenge`, <br>`WsWelcome`, `WsPeerJoin`, `WsPeerLeave`, `WsKicked` o `WsPeerUpdate`. |

## Autenticación

Antes de poder comenzar a retransmitir mensajes a otros, los clientes deben autenticarse firmando una cadena de desafío. Esto es requerido incluso cuando el URI de transporte se obtuvo de [Archipelago](../archipelago.md) después de una ronda previa de autenticación.

El primer mensaje que un cliente envía al unirse a una isla es [`WsIdentification`][WsIdentification], que contiene una dirección pública. Será respondido con [`WsChallengeRequired`](#WsChallengeRequired), y los clientes envían un [`WsSignedChallenge`](#WsSignedChallenge) en respuesta.

```
  .----------.                .--------.
  |  Server  |                | Client |
  '----+-----'                '---+----'
       ⋮                          |
       ⋮                  Connect |
       o - - - - - - - - - - - - -|
       |                          |
       |                          |
       |         WsIdentification |
       |<-------------------------+
       +------------------------->|
       | WsChallengeRequired      |
       |                          |
       |                          |
       |        WsSignedChallenge |
       |<-------------------------+
       +------------------------->|
       | WsWelcome                |
       |                          |

```

Si el flujo se completa exitosamente, el cliente recibirá un [`WsWelcome`](#WsWelcome) y puede comenzar a enviar mensajes a peers.

---

##### `WsIdentification` <small>[↗ fuente][WsIdentification]</small> {#WsIdentification}

| Campo     | Tipo     | Valor                                        |
| --------- | -------- | -------------------------------------------- |
| `address` | `string` | La dirección pública de Ethereum del cliente |

---

##### `WsChallengeRequired` <small>[↗ fuente][WsChallengeRequired]</small> {#WsChallengeRequired}

| Campo               | Tipo     | Valor                                                                           |
| ------------------- | -------- | ------------------------------------------------------------------------------- |
| `challenge_to_sign` | `string` | La cadena proporcionada por el servidor para ser firmada como prueba de identidad |
| `already_connected` | `string` | Una pista del servidor a clientes, indicando que conexiones previas pueden cerrarse. |

---

##### `WsSignedChallenge` <small>[↗ fuente][WsSignedChallenge]</small> {#WsSignedChallenge}

| Campo             | Tipo     | Valor                                                                                                                    |
| ----------------- | -------- | ------------------------------------------------------------------------------------------------------------------------ |
| `auth_chain_json` | `string` | Una [cadena de autenticación](../../authentication/authchain.md) serializada terminando con la firma del desafío. |

---

##### `WsWelcome` <small>[↗ fuente][WsWelcome]</small> {#WsWelcome}

| Campo             | Tipo                  | Valor                                                     |
| ----------------- | --------------------- | --------------------------------------------------------- |
| `alias`           | `uint32`              | Un ID generado por el servidor para la sesión del cliente |
| `peer_identities` | `map<uint32, string>` | Las direcciones de todos los peers actuales, indexadas por alias |

## Conectividad

Se definen tres mensajes para ayudar a los clientes a rastrear sus peers y su propio estado.

[`WsPeerJoin`](#WsPeerJoin) se recibe cuando un cliente compañero se conecta a la sala y se autentica exitosamente, mientras que [`WsPeerLeave`](#WsPeerLeave) se recibe cuando peers se desconectan.

También está el mensaje [`WsKicked`](#WsKicked), que informa a clientes que su conexión está a punto de cerrarse y la razón para ello. En la práctica actual, la razón principal por la que un servidor puede expulsar a un cliente de una sala es porque se conectaron simultáneamente a otra sala, cuando eso está prohibido por política del servidor.

---

##### `WsPeerJoin` <small>[↗ fuente][WsPeerJoin]</small> {#WsPeerJoin}

| Campo     | Tipo     | Valor                                                        |
| --------- | -------- | ------------------------------------------------------------ |
| `alias`   | `uint32` | El ID generado por el servidor enviado en [`WsWelcome`](#WsWelcome) |
| `address` | `string` | La dirección de Ethereum del nuevo peer                      |

---

##### `WsPeerLeave` <small>[↗ fuente][WsPeerLeave]</small> {#WsPeerLeave}

| Campo   | Tipo     | Valor                                             |
| ------- | -------- | ------------------------------------------------- |
| `alias` | `uint32` | El ID generado por el servidor del peer desconectado |

---

##### `WsKicked` <small>[↗ fuente][WsKicked]</small> {#WsKicked}

| Campo    | Tipo     | Valor                                                            |
| -------- | -------- | ---------------------------------------------------------------- |
| `reason` | `string` | La explicación del servidor de por qué la conexión se cerrará    |

## Mensajes de Cliente

Para enviar [mensajes](../messages.md) comms, los clientes los envuelven en la estructura [`WsPeerUpdate`](#WsPeerUpdate). Esto diferencia los tipos de mensaje de control de transporte de los mensajes reales enviados entre peers.

```
.-------------------.
| WsPacket          |
|  .--------------. |
|  | WsPeerUpdate | |
|  | .----------. | |
|  | |  Packet  | | |
|  | '----------' | |
|  '--------------' |
'-------------------'

```

---

##### `WsPeerUpdate` <small>[↗ fuente][WsPeerUpdate]</small> {#WsPeerUpdate}

| Campo        | Tipo     | Valor                                                                                        |
| ------------ | -------- | -------------------------------------------------------------------------------------------- |
| `from_alias` | `uint32` | El ID generado por el servidor del remitente                                                 |
| `body`       | `bytes`  | El [mensaje](../messages.md) serializado que está siendo envuelto                  |
| `unreliable` | `bool`   | Si el remitente priorizó velocidad o fiabilidad para entregar este mensaje                  |

Los clientes deben establecer el campo `from_alias` a `0` al enviar, y el servidor lo llenará con el identificador correcto antes de entregarlo a los peers.

[WsWelcome]: https://github.com/decentraland/protocol/blob/c48ea0aa00d8173084571552463a6a05a7f49636/proto/decentraland/kernel/comms/rfc5/ws_comms.proto#L11
[WsPeerJoin]: https://github.com/decentraland/protocol/blob/c48ea0aa00d8173084571552463a6a05a7f49636/proto/decentraland/kernel/comms/rfc5/ws_comms.proto#L19
[WsPeerLeave]: https://github.com/decentraland/protocol/blob/c48ea0aa00d8173084571552463a6a05a7f49636/proto/decentraland/kernel/comms/rfc5/ws_comms.proto#L27
[WsPeerUpdate]: https://github.com/decentraland/protocol/blob/c48ea0aa00d8173084571552463a6a05a7f49636/proto/decentraland/kernel/comms/rfc5/ws_comms.proto#L34
[WsChallengeRequired]: https://github.com/decentraland/protocol/blob/c48ea0aa00d8173084571552463a6a05a7f49636/proto/decentraland/kernel/comms/rfc5/ws_comms.proto#L48
[WsSignedChallenge]: https://github.com/decentraland/protocol/blob/c48ea0aa00d8173084571552463a6a05a7f49636/proto/decentraland/kernel/comms/rfc5/ws_comms.proto#L56
[WsIdentification]: https://github.com/decentraland/protocol/blob/c48ea0aa00d8173084571552463a6a05a7f49636/proto/decentraland/kernel/comms/rfc5/ws_comms.proto#L64
[WsKicked]: https://github.com/decentraland/protocol/blob/c48ea0aa00d8173084571552463a6a05a7f49636/proto/decentraland/kernel/comms/rfc5/ws_comms.proto#L74
[WsPacket]: https://github.com/decentraland/protocol/blob/c48ea0aa00d8173084571552463a6a05a7f49636/proto/decentraland/kernel/comms/rfc5/ws_comms.proto#L78
[Packet]: ../messages.md#Packet
