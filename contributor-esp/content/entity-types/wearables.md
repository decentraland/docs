Los wearables son las [entidades](../entities.md) que contienen artículos para que los jugadores los usen y personalicen sus avatares.

El campo `wearables` en el [perfil](profiles.md) de un jugador contiene una lista de punteros a los artículos que están usando actualmente.

Cada wearable pertenece a una _categoría_, indicando el lugar que ocupa en el cuerpo del avatar, y puede ocultar o reemplazar otras categorías (por ejemplo, un vestido largo puede usarse como ropa superior pero cubrir completamente las piernas).

Hay 18 categorías de wearables, referenciadas en varios campos de metadata: `body_shape`, `hair`, `eyes`, `eyebrows`, `facial_hair`, `mouth`, `upper_body`, `lower_body`, `feet`, `hat`, `helmet`, `mask`, `tiara`, `top_head`, `earring`, `eyewear`, `skin` y `hands_wear`.

Las entidades wearable incluyen archivos en formato GLB para diferentes formas de cuerpo.

## Punteros {#pointers}

Los wearables tienen exactamente un [puntero](../pointers.md) asociado, que indica la [colección](../collections.md) a la que pertenecen y su identificador dentro de ella.

Cuando el wearable es un activo on-chain, el puntero es un URN de esta forma:

```
urn:decentraland:<blockchain>:collections-v2:<collection address>:<item index>
```

Para ilustrar, el array `pointers` para un wearable on-chain se ve así:

```json
{
  "pointers": [
    "urn:decentraland:matic:collections-v2:0x2d9560df9dd8ba8b2dc3746bc1d217698d258fb5:0"
  ],
  // ... otras propiedades de entidad
}
```

Cuando el wearable es un activo off-chain, como los wearables predeterminados para avatares nuevos, será de esta forma:

```
urn:decentraland:off-chain:<collection>:<item name>
```

La colección en este caso es un nombre, no una dirección, y el identificador del artículo también es un nombre en lugar de un índice.

El array `pointers` para un wearable off-chain tiene este aspecto:

```json
{
  "pointers": [
    "urn:decentraland:off-chain:base-avatars:BaseFemale"
  ],
  // ... otras propiedades de entidad
}
```

## Campos de Metadata

Los wearables comparten la mayoría de sus campos básicos con [emotes](emotes.md). La propiedad `data` es donde se encuentra la información específica del wearable.

| Campo | Valor |
| ----- | --- |
| `id` | El [puntero](../pointers.md) que resuelve (o solía resolver) a este wearable.
| `name` | El título de visualización para este wearable en una [colección](../collections.md).
| `description` | Una descripción extendida para este wearable.
| `image` | El [nombre de archivo interno](../entities.md#files) de una imagen para este wearable.
| `thumbnail` | El [nombre de archivo interno](../entities.md#files) de una versión 256x256 de la `image`.
| `rarity` | Uno de `common`, `uncommon`, `rare`, `epic`, `legendary`, `exotic`, `mythic` o `unique`.
| `i18n` | Un array de traducciones para el campo `name`.
| `collectionAddress` | La dirección de Ethereum para la colección que contiene este wearable.
| `metrics` | Algunas mediciones útiles sobre las animaciones (ver abajo).
| `data` | Los metadatos extendidos para este wearable (ver abajo).

En forma JSON típica:

```json
{
  "id": "urn:decentraland:matic:collections-v2:0x11a6879861f36cbad632b4e7226816a16139fb33:0",
  "name": "Pretty Dress",
  "description": "Very nice to wear",
  "image": "image.png",
  "thumbnail": "thumbnail.png",
  "rarity": "uncommon",
  "i18n": [
    { "code": "es", "text": "Vestido Lindo" }
  ],
  "collectionAddress": "0x11a6879861f36cbad632b4e7226816a16139fb33",
  "metrics": {
    // Objeto de mediciones (ver abajo).
  },
  "data": {
    // Metadatos extendidos (ver abajo).
  }
}
```

## Metrics

En el objeto `metadata.metrics`, encontrarás algunas mediciones simples para los modelos empaquetados con este wearable. Un ejemplo:

```json
{
  "entities": 1,
  "bodies": 12,
  "materials": 2,
  "meshes": 12,
  "textures": 2,
  "triangles": 3321
}
```

## Data

El objeto `metadata.data` es donde se encuentran las propiedades específicas del wearable.

| Campo | Valor |
| ----- | --- |
| `category` | Una de las categorías de wearable listadas arriba.
| `representations` | Un array de archivos asociados a diferentes formas de cuerpo (ver abajo).
| `hides` | Un array de categorías que este wearable oculta.
| `replaces` | Un array de categorías que este wearable reemplaza completamente.
| `tags` | Un array de etiquetas de cadena descriptivas de este wearable.

### Representations

Cada elemento en el array representations asocia una forma de cuerpo con una colección de modelos, y puede agregar reglas respecto a qué wearables se muestran en cada categoría.

| Campo | Valor |
| ----- | --- |
| `bodyShapes` | Un array de [punteros](../pointers.md) a entidades de forma de cuerpo.
| `mainFile` | El archivo de modelo 3D para iniciar el renderizado.
| `contents` | Un array de nombres de archivo (presentes en el [campo `content` de nivel superior](../entities.md#properties)) usados por el `mainFile`.
| `overrideHides` | Sustituye la lista `hides` arriba para esta representación.
| `overrideReplaces` | Sustituye la lista `replaces` arriba para esta representación.

Este es un elemento `representations` típico:

```json
{
  "bodyShapes": [
      "urn:decentraland:off-chain:base-avatars:BaseFemale"
  ],
  "mainFile": "male/190.glb",
  "contents": [
      "male/190.glb"
  ],
  "overrideHides": [ "lower_body" ],
  "overrideReplaces": []
}
```
