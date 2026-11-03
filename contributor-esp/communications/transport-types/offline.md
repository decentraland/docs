El transporte Offline es una implementación ficticia para señalar que no hay servidor comms disponible en un realm. Se usa comúnmente en entornos de prueba y desarrollo.

El transporte nunca emite mensajes entrantes, e ignora todos los mensajes salientes. Si quieres una variante offline con comportamiento simulado, ve [Simulator](simulator.md) en su lugar.

Los URIs se ven así:

```
offline:<sufijo personalizado>
```

Lo que viene después del prefijo `offline:` no está especificado, y puede ser usado por implementaciones (o dejarse vacío) como deseen.
