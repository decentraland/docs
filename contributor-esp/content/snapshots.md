
Los servidores de contenido compilarán periódicamente resúmenes de las entidades activas que están alojando, llamados _instantáneas_ (snapshots). Son [archivos](file-system.md) regulares y pueden descargarse usando su identificador.

Las instantáneas se crean diariamente, semanalmente, mensualmente y anualmente. Cada una contiene el conjunto de entidades activas que cambiaron desde la instantánea anterior para ese rango.

Las instantáneas contendrán versiones conflictivas de las mismas entidades (es decir, diferentes [archivos manifest](entities.md#properties) asociados al mismo puntero) a medida que se actualizan. Al escanearlas, los clientes deben mantener la versión en la instantánea más reciente. Como los servidores de contenido pueden eliminar archivos inactivos, las versiones de entidad obsoletas no están garantizadas para estar disponibles para descarga.

Cuando una nueva instantánea _reemplaza_ a las más antiguas (ej. una instantánea semanal que combina una serie de diarias), sus metadatos indican qué archivos previos son reemplazados para que los clientes no necesiten descargarlos.

El conjunto completo de entidades activas puede descubrirse combinando todas las instantáneas disponibles (más sobre esto abajo), manteniendo la entidad más reciente referenciada por cada [puntero](pointers.md) descubierto en el camino.

Puedes experimentar con instantáneas usando código funcional en la sección [práctica](practice/README.md).


## Descubriendo Instantáneas {#discover}

Para localizar el conjunto actual de instantáneas, usa el [endpoint `snapshots`](https://decentraland.github.io/catalyst-api-specs/#tag/Content-Server/operation/getSnapshots). La respuesta contiene un array de elementos con estos campos:

| Campo | Valor |
| ----- | --- |
| `generationTimestamp` | La marca de tiempo Unix UTC cuando esta instantánea fue creada.
| `hash` | El [archivo](file-system.md) de la instantánea.
| `numberOfEntities` | El número de entradas en el archivo de instantánea.
| `replacedSnapshotHashes` | Un array con el `hash` de cualquier instantánea reemplazada por esta.
| `timeRange.initTimestamp` | La marca de tiempo Unix UTC (en milisegundos) para el inicio del rango de la instantánea.
| `timerange.endTimestamp` | La marca de tiempo Unix UTC (en milisegundos) para el final del rango de la instantánea.

Por ejemplo:

```json
{
  "generationTimestamp": 1684979298844,
  "hash": "bafybeiflmm46nr4vv2h3wuzbx3pukcz7ju4fhbfzt6yxmoo533uktlgru4",
  "numberOfEntities": 12345,
  "replacedSnapshotHashes": [ "bafybeicw6x75ieaxfwynekbyhpcsgctpjkt6cb4j6oa7s57qjj6e4b5phd" ],
  "timeRange": {
     "initTimestamp": 1684281600000,
     "endTimestamp": 1684886400000
  }
}
```

## Descargando Instantáneas {#download}

Usando el campo `hash` de una instantánea, los clientes pueden descargar el archivo asociado conteniendo entidades creadas o actualizadas en ese rango de tiempo.

Los archivos de instantánea comienzan con esta línea exacta:

```
### Decentraland json snapshot
```

Después de eso, cada línea es un documento JSON describiendo una [entidad](entities.md) con los siguientes campos:

| Campo | Valor |
| ----- | --- |
| `entityId` | El identificador inmutable para esta [entidad](entities.md).
| `entityType` | Uno de `scene`, `profile`, `wearable`, `emote`, `store` o `outfits`.
| `pointers` | Un array de [punteros](pointers.md) que resuelven (o solían resolver) a esta entidad.
| `entityTimestamp` | La marca de tiempo Unix UTC (en milisegundos) cuando esta entidad fue subida.
| `authChain` | La [cadena de autenticación](entities.md#ownership) para esta entidad.

Una entrada típica se ve así:

```json
{
  "entityId": "bafkreigrvaqynmiglpvewwhn2yd63q5dvagrrt5jbhimzvbrn5kimj5zne",
  "entityType": "wearable",
  "pointers": ["urn:decentraland:matic:collections-v2:0x11a6879861f36cbad632a4e7226816a16139fb33:0"],
  "entityTimestamp": 1671117456129,
  "authChain": [
    // ... payloads y firmas de cadena de autenticación
  ]
}
```

{% hint style="info" %}
Si intentas analizar una instantánea línea por línea, recuerda saltar (o mejor aún, validar) la primera con el encabezado, y estar listo para manejar una línea vacía al final del archivo.
{% endhint %}


### Iniciando un Índice de Entidades {#index-start}

Los clientes que quieren indexar el conjunto completo de entidades activas deben procesar todas las instantáneas actualmente disponibles, y mantener la [entidad](entities.md) más reciente para cada [puntero](pointers.md).

La estrategia más simple es procesar instantáneas en orden cronológico inverso (es decir, más reciente primero), ignorando punteros que ya han sido descubiertos, para mantener la referencia a la última entidad.

En pseudo-código:

```py
# Descargar el conjunto actual de instantáneas, y ordenarlas de más nueva a más antigua:
snapshots = get_snapshots()
snapshots.sort('timeRange.initTimestamp', DESCENDING)

seen_pointers = set()

# Procesar instantáneas, manteniendo la entidad más nueva para cada puntero:
for snapshot in snapshots:
    items = get_snapshot_items(snapshot) 

    for item in items:
        if any(pointer in seen_pointers for pointer in item.pointers):
            discard(item)
        else:
            keep(item)
            seen_pointers.update(item.pointers)
```

Como las entidades individuales pueden ser referenciadas por múltiples punteros (como es comúnmente el caso con [escenas](entity-types/scenes.md)), todos deben verificarse antes de elegir mantener o descartar el elemento.

{% hint style="info" %}
Los archivos de instantánea para rangos de tiempo más largos pueden ser muy grandes. Para propósitos de desarrollo y experimentación que no requieren indexar el conjunto completo de entidades, se recomienda usar las instantáneas más pequeñas. El conjunto resultante de entidades será incompleto pero válido.
{% endhint %}


### Actualizando un Índice de Entidades {#index-update}

Los clientes que mantienen un índice de entidades actualizado pueden hacer llamadas periódicas al endpoint [`snapshots`](https://decentraland.github.io/catalyst-api-specs/#tag/Content-Server/operation/getSnapshots), y determinar si descargar cada archivo considerando:

* ¿Ya fue descargada la instantánea identificada por `hash`?
* ¿Está `hash` en la lista `replacedSnapshotHashes` de otra instantánea que ya fue descargada?
* ¿Es el `timeRange` relevante para propósitos actuales?

Si deben procesarse nuevas instantáneas, la misma estrategia que arriba puede usarse para actualizar un conjunto de datos existente.


## Ejemplos

En la sección [práctica](practice/README.md), encontrarás ejemplos de código que trabajan con el sistema de instantáneas.
