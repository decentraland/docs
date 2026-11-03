
# Signed Fetch

Cuando los clientes del protocolo desean hacer solicitudes HTTPS autenticadas, pueden aprovechar el mecanismo estándar de _signed fetch_.

Un signed fetch es una solicitud que incluye una [cadena de autenticación](authchain.md), representada a través de headers. Los servidores con APIs compatibles con Decentraland pueden validar identidades antes de, por ejemplo, [permitir solicitudes desde escenas](../runtime/modules/signed-fetch.md) o crear [adaptadores](../communications/overview.md).

## Headers

La información que el servidor necesita para validar la cadena de autenticación se transmite en 3+ headers:

* `X-Identity-Timestamp`: el campo `timestamp` incluido en el payload firmado (ver abajo).
* `X-Identity-Metadata`: el campo `metadata` incluido en el payload firmado (ver abajo).
* `X-Identity-AuthChain-<index>`: el [paso de autenticación serializado en JSON](authchain.md#constructing) `<index>`, comenzando desde `0`.

La cadena transmitida es validada por el servidor [como se especifica](authchain.md).

## Body

El cuerpo de la solicitud no está especificado. Los servicios tienen flexibilidad completa para usar cualquier protocolo o formato que deseen.

## Payload

El [payload](authchain.md#constructing) de la cadena de autenticación para un signed fetch es una cadena **en minúsculas, separada por dos puntos** que incluye algunos de los elementos de la solicitud:

```
<method>:<path>:<timestamp>:<metadata>
```

Los campos `method` y `path` deben coincidir con los de la solicitud, y `timestamp` es el mismo que en el header `X-Identity-Timestamp`.

El último campo, `metadata`, puede tener contenido arbitrario.

Por ejemplo:

```
get:/some/path:1682790056:{"some":"custom json"}
```
