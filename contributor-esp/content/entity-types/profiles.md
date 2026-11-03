Los perfiles son la descripción básica de un jugador, con información como su nombre en el mundo y avatar.

Están disponibles en servidores de contenido como [entidades](../entities.md) regulares, aunque los World Explorers usualmente aprovechan el sistema de comms para obtener versiones actualizadas al instante.

El sistema está preparado para permitir múltiples identidades con el mismo propietario, todas incluidas como avatares en el manifest de entidad. Sin embargo, en la práctica, la gran mayoría de jugadores tienen solo uno.

## Punteros {#pointers}

Los [punteros](../pointers.md) de perfil son la dirección de Ethereum del propietario, sin ningún prefijo o sufijo. Por ejemplo:

```
0x210c4415d6a71195af76beef9b85dd0eb43f35df
```

## Campos de Metadata

| Campo | Valor |
| ----- | --- |
|`avatars`| Un array de descripciones para cada uno de los avatares del propietario (ver abajo).

## Avatars

Cada avatar en `metadata.avatars[]` representa una identidad con el mismo propietario, y tiene varias propiedades que permiten a clientes mostrar perfiles, renderizar avatares en el mundo y contactar al propietario.

| Campo | Valor |
| ----- | --- |
| `userId` | El [puntero](../pointers.md) que resuelve (o solía resolver) a este perfil.
| `name` | El nombre de visualización de este jugador.
| `email` | (Opcional) Una dirección de correo electrónico para este jugador.
| `description` | (Opcional) Texto elegido por el jugador para describirse.
| `ethAddress` | La dirección de ethereum de este jugador (actualmente igual a su `userId`).
| `hasClaimedName` | Si el campo `name` es un nombre ENS reclamado.
| `unclaimedName` | Un nombre temporal para usuarios sin un nombre ENS (ej. invitados).
| `tutorialStep` | El progreso del tutorial para este jugador.
| `avatar` | Propiedades del avatar en el mundo del jugador (ver abajo).

Un ejemplo:

```json
{
  "userId": "0x210c4415d6a71195af76beef9b84dd0eb43f35da",
  "name": "Bob",
  "email": "",
  "hasClaimedName": false,
  "description": "",
  "ethAddress": "0x210c4415d6a71195af76beef9b84dd0eb43f35da",
  "avatar": {
    // Ver abajo
  }
}
```

### Avatar Field

El campo `metadata.avatars[].avatar` tiene toda la información que un World Explorer (u otros clientes, como un editor de avatar independiente) requieren para renderizar un jugador.

| Campo | Valor |
| ----- | --- |
| `bodyShape` | El [puntero](../pointers.md) a la entidad de forma de cuerpo del avatar.
| `snapshots` | Un objeto con imágenes para este avatar (ver abajo).
| `eyes` | Un objeto con un `color` en forma de objeto `{ r, g, b }` para los ojos del avatar.
| `hair` | Un objeto con un `color` en forma de objeto `{ r, g, b }` para el cabello del avatar.
| `skin` | Un objeto con un `color` en forma de objeto `{ r, g, b }` para la piel del avatar.
| `wearables` | Un array de [punteros de wearable](wearables.md#pointers) en uso por el avatar.

Para ilustrar:

```json
{
  "bodyShape": "urn:decentraland:off-chain:base-avatars:BaseMale",
  "snapshots": {
    // Ver abajo
  },
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

### Snapshots

El campo `metadata.avatars[].avatar.snapshots` contiene [identificadores de archivo](../file-system.md#identifiers) para imágenes (incluidos en el [campo `content` de nivel superior](../entities.md#properties)). Cada propiedad es un tipo de imagen, y actualmente hay dos: `face256` (una miniatura) y `body` (una versión de tamaño completo).

Por ejemplo:

```json
{
  "face256": "bafkreidvjwc3gqqdqk646rqnxnqzpsyjsjafqfc76zenfgjnm2ahbvrtsd",
  "body": "bafkreigclygt6vzzu7myzg3weifapb3a5uec245lzndg4f53y4vfb3cmwm"
}
```
