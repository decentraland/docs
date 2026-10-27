El transporte [LiveKit](https://livekit.io/) es el más versátil y eficiente de los transportes soportados, y también el más fácil de implementar. Los clientes deben usarlo cuando reciben una cadena de conexión apropiada del servicio [Archipelago](../archipelago.md) de su realm, o si está indicado como un transporte fijo.

{% hint style="info" %}
Puedes ver el transporte LiveKit en acción y jugar con sus características usando la [Comms Station](https://decentraland.github.io/comms-station/) de código abierto.
{% endhint %}

A diferencia del transporte [websocket](websocket.md) personalizado, usa una librería de terceros (código abierto), que simplifica enormemente el proceso de desarrollo abstrayendo toda la lógica de nivel de transporte y serialización.

Los URIs de transporte LiveKit comienzan con el prefijo `livekit:`, seguido de la URL del servidor `wss://`. También incluyen un `access_token` pre-autorizado, generado por [Archipelago](../archipelago.md) cuando el cliente se autentica.

```
livekit:wss://comms.example.com?access_token=eyJhbGciOiJI...
```

## Conectando y Autenticando

La librería cliente de LiveKit encapsula ordenadamente toda la lógica de conexión y autenticación.

No hay paso de autenticación adicional al usar el transporte LiveKit. El `access_token` proporcionado por Archipelago ya está verificado y autorizado.


## Intercambiando Mensajes

Los clientes que confían en la librería LiveKit pueden fácilmente transmitir, enviar mensajes directos y publicar feeds de medios en vivo.

Los payloads son [`Packets`](../messages.md) comms planos sin ningún envoltorio adicional.
