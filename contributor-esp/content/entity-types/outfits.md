Los outfits son los atuendos guardados de un jugador. Un outfit está compuesto de forma de cuerpo, piel, cabello, ojos y configuraciones de wearables.

## Punteros {#pointers}

Los [punteros](../pointers.md) de outfits son la dirección de Ethereum del propietario con un sufijo "`:outfits`". Por ejemplo:

```
0x210c4415d6a71195af76beef9b85dd0eb43f35df:outfits
```

## Campos de Metadata

| Campo | Valor |
| ----- | --- |
|`outfits`| Un array de descripciones para cada outfit (ver abajo).
|`namesForExtraSlots`| Un array de nombres propiedad usados para validar ranuras extra. Por cada nombre propiedad, se otorga una ranura extra hasta 5.

## Outfits

Cada outfit en `metadata.outfits[]` representa un outfit del usuario, y tiene varias propiedades:

| Campo | Valor |
| ----- | --- |
| `slot` | Número de ranura del outfit guardado.
| `outfit` | El outfit guardado (ver abajo).

Un ejemplo:

```json
{
  "slot": 1,
  "outfit": {
    // Ver abajo
  }
}
```

### Outfit Field

El campo `metadata.outfits[].outfit` tiene toda la información para guardar el outfit de un jugador y renderizarlo.

| Campo | Valor |
| ----- | --- |
| `bodyShape` | El [puntero](../pointers.md) a la entidad de forma de cuerpo del avatar.
| `eyes` | Un objeto con un `color` en forma de objeto `{ r, g, b }` para los ojos del avatar.
| `hair` | Un objeto con un `color` en forma de objeto `{ r, g, b }` para el cabello del avatar.
| `skin` | Un objeto con un `color` en forma de objeto `{ r, g, b }` para la piel del avatar.
| `wearables` | Un array de [punteros de wearable](wearables.md#pointers) en uso por el avatar.

Para ilustrar:

```json
{
  "bodyShape": "urn:decentraland:off-chain:base-avatars:BaseMale",
  "eyes": {
    "color": { "r": 0.37109375, "g": 0.22265625, "b": 0.1953125 }
  },
  "hair": {
    "color": { "r": 0.234375, "g": 0.12890625, "b": 0.04296875 }
  },
  "skin": {
    "color": { "r": 0.80078125, "g": 0.609375, "b": 0.46484375 }
  },
  "wearables": [
    "urn:decentraland:off-chain:base-avatars:eyes_00",
    "urn:decentraland:off-chain:base-avatars:eyebrows_00",
    "urn:decentraland:off-chain:base-avatars:mouth_00",
    "urn:decentraland:off-chain:base-avatars:m_mountainshoes.glb",
    "urn:decentraland:off-chain:base-avatars:sport_jacket",
    "urn:decentraland:off-chain:base-avatars:brown_pants",
    "urn:decentraland:off-chain:base-avatars:aviatorstyle",
    "urn:decentraland:off-chain:base-avatars:casual_hair_03",
    "urn:decentraland:off-chain:base-avatars:Mustache_Short_Beard"
  ]
}
```
