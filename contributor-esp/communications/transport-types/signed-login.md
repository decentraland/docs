El transporte Signed Login puede ser usado por servidores que quieren personalizar la forma en que asignan clientes a islas, reemplazando o envolviendo Archipelago en su arquitectura.

En lugar de conectarse directamente a un backend en tiempo real, Signed Login hace un [signed fetch](../../authentication/signed-fetch.md) para obtener la cadena de conexión. Este paso intermedio permite a servidores emplear cualquier estrategia de asignación que deseen.

Los URIs Signed Login tienen esta forma:

```
signed-login:https://comms.example.com/auth&param=value
```

La porción después del prefijo `signed-login:` puede ser cualquier URL válida.


## Uso

Una solicitud Signed Login se construye usando el mecanismo [signed fetch](../../authentication/signed-fetch.md).

La respuesta, si es exitosa, tendrá estado `200` y un cuerpo JSON con _al menos_ los siguientes campos:


| Campo | Tipo | Valor
| ----- | --- | --- |
| `fixedAdapter` | `string` | El URI de transporte asignado (ej. `livekit:` o `ws-room:`)


Por ejemplo:

```
{ 
  fixedAdapter: "ws-room:wss://comms.example.com/rooms/17"
}
```

En caso de falla, la respuesta puede tener cualquier código de estado apropiado y un cuerpo JSON con _al menos_ los siguientes campos:

| Campo | Tipo | Valor
| ----- | --- | --- |
| `message` | `string` | (Opcional) una explicación o código de error para la falla.

Las respuestas con campos adicionales en el cuerpo JSON son válidas, y el contenido del `message` de error se deja sin especificar. Las implementaciones pueden usar esta flexibilidad para integrar `signed-login:` en sus aplicaciones como deseen.
