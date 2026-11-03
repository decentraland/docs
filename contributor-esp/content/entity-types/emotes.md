Los emotes son las [entidades](../entities.md) que contienen animaciones para los avatares de los jugadores.

Incluyen archivos en formato GLB para diferentes formas de cuerpo.

## Punteros {#pointers}

Los emotes tienen exactamente un [puntero](../pointers.md) asociado, que indica la colección a la que pertenecen y su índice dentro de ella. Son URNs de esta forma:

```
urn:decentraland:matic:collections-v2:<collection address>:<item index>
```

Para ilustrar, el array `pointers` para un emote se ve así:

```json
{
  "pointers": [
    "urn:decentraland:matic:collections-v2:0x2d9560df9dd8ba8b2dc3746bc1d217698d258fb5:0"
  ],
  // ... otras propiedades de entidad
}
```

## Campos de Metadata

Los emotes comparten la mayoría de sus campos básicos con [wearables](wearables.md). La propiedad `emoteDataADR74` es donde se encuentra la información específica del emote.

| Campo | Valor |
| ----- | --- |
| `id` | El [puntero](../pointers.md) que resuelve (o solía resolver) a este emote.
| `name` | El título de visualización para este emote en una [colección](../collections.md).
| `description` | Una descripción extendida para este emote.
| `image` | El [nombre de archivo interno](../entities.md#files) con una imagen para este emote.
| `thumbnail` | El [nombre de archivo interno](../entities.md#files) para una versión 256x256 de la `image`.
| `rarity` | Uno de `common`, `uncommon`, `rare`, `epic`, `legendary`, `exotic`, `mythic` o `unique`.
| `i18n` | Un array de traducciones para el campo `name`.
| `collectionAddress` | La dirección de Ethereum para la colección que contiene este emote.
| `metrics` | Algunas mediciones útiles sobre las animaciones (ver abajo).
| `emoteDataADR74` | Los metadatos extendidos para este emote, según lo definido en [ADR-74](https://adr.decentraland.org/adr/ADR-74) (ver abajo).


Así es como se ve un JSON típico:

```json
{
  "id": "urn:decentraland:matic:collections-v2:0x2d9560df9dd8ba8b2dc3746bc1d217698d258fb5:0",
  "name": "Funny Dance",
  "description": "Move around like a champ",
  "image": "image.png",
  "thumbnail": "thumbnail.png",
  "rarity": "rare",
  "i18n": [
    { "code": "es", "text": "Danza Graciosa" }
  ],
  "collectionAddress": "0x2d9560df9dd8ba8b2dc3746bc1d217698d258fb5",
  "metrics": {
    // Objeto de mediciones (ver abajo).
  },
  "emoteDataADR74": {
    // Metadatos extendidos definidos en ADR-74 (ver abajo).
  }
}
```

## Metrics

En el objeto `metadata.metrics`, encontrarás algunas mediciones simples para la animación empaquetada con este emote. Un ejemplo:

```json
{
  "triangles": 0,
  "materials": 0,
  "textures": 0,
  "meshes": 0,
  "bodies": 0,
  "entities": 1
}
```

## Emote Data ADR-74

Este objeto contiene los campos que los World Explorers (u otras aplicaciones gráficas) necesitan para animar modelos con este emote.

| Campo | Valor |
| ----- | --- |
| `category` | Uno de `dance`, `stunt`, `greetings`, `fun`, `poses`, `reactions`, `horror` o `miscellaneous`.
| `representations` | Un array de archivos de animación asociados a diferentes formas de cuerpo.
| `tags` | Un array de etiquetas de cadena descriptivas de este emote.
| `loop` | `true` si la animación debe repetirse una vez que termina.

Algún JSON para claridad:

```json
{
  "category": "dance",
  "representations": [
    // Información sobre la animación para diferentes formas de cuerpo (ver abajo).
  ],
  "tags": [ "carnaval", "dance" ],
  "loop": true
}
```

### Representations

Cada elemento en el campo `metadata.emoteDataADR74.representations` define los archivos de animación apropiados para cada forma de cuerpo.

| Campo | Valor |
| ----- | --- |
| `bodyShapes` | Un array de [punteros](../pointers.md) de forma de cuerpo aplicables.
| `mainFile` | El [nombre de archivo interno](../entities.md#files) para el archivo GLB principal.
| `contents` | Todos los archivos, incluyendo `mainFile` y cualquiera adicional que pueda referenciar.

Por ejemplo, un elemento `representation`:

```json
{
  "bodyShapes": [ "urn:decentraland:off-chain:base-avatars:BaseMale" ],
  "mainFile": "male/funnydance.glb",
  "contents": [
    "male/funnydance.glb"
  ]
}
```

Comúnmente encontrarás dos entradas de representación, una para `BaseMale` y una para `BaseFemale`.
