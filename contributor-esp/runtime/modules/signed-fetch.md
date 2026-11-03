El módulo `SignedFetch` proporciona una implementación de la interfaz `fetch` que es transparentemente compatible con el protocolo [signed fetch](../../authentication/signed-fetch.md), que define cómo adjuntar [cadenas de autenticación](../../authentication/authchain.md) firmadas a solicitudes salientes.

Los procedimientos para firmar y verificar esta solicitud se detallan en la página [authentication chain](../../authentication/authchain.md).

Usar `SignedFetch` desde una escena requiere el permiso [`USE_FETCH`](../../content/entity-types/scenes.md#permissions).

## Methods

### `signedFetch` {#signedfetch}

Hacer una solicitud HTTP como lo harías con ([`fetch`](../globals.md#http)), agregando automáticamente los encabezados de verificación.

```ts
interface Request {
  // La URL objetivo de la solicitud:
  url: string;

  // Parámetros opcionales autoexplicativos para la solicitud:
  init?: {
    method?: string;
    body?: string;
    headers: { [key: string]: string };
  };
}

interface Response {
  // Si la solicitud HTTP se realizó exitosamente (códigos distintos a 2xx no son fallos)
  ok: boolean;

  // Los detalles autoexplicativos de la respuesta:
  status: number;
  statusText: string;
  headers: { [key: string]: string };
  body: string;
}

function signedFetch(Request): Promise<Response>;
```
