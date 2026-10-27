El transporte Simulator es una implementación completamente arbitraria, sin comportamiento especificado más allá de la interfaz de transporte.

Puede emitir mensajes entrantes y manejar mensajes salientes como se desee, sin requisitos semánticos. La implementación puede elegir nunca emitir mensajes e ignorar todas las llamadas de métodos, pero el [transporte Offline](offline.md) es más adecuado para eso.

Los URIs Simulator se ven así:

```
simulator:<sufijo personalizado>
```

Lo que viene después del prefijo `simulator:` no está especificado, y puede ser usado por implementaciones (o dejarse vacío) como deseen.
