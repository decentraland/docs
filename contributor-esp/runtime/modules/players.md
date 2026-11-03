El módulo `Players` permite a las [escenas](../../content/entity-types/scenes.md) buscar jugadores en su entorno y obtener información sobre su identidad y [perfiles](../../content/entity-types/profiles.md).

```ts
const Players = require("~system/Players");
```

Contiene los siguientes métodos y tipos:

- [`function getPlayersInScene`](#getplayersinscene)
- [`function getConnectedPlayers`](#getplayersinscene)
- [`function getPlayerData`](#getplayerdata)
- [`interface Player`](#player)
- [`interface UserData`](#userdata)

## Methods

Hay dos métodos en este módulo para descubrir jugadores en la escena, y uno para obtener sus perfiles.

### `getPlayersInScene` {#getplayersinscene}

Devuelve un array de [`Player`](#player), cada uno con un `userId` que puede usarse en [getPlayerData](#getplayerdata).

```ts
interface Request {}

interface Response {
  players: Player[];
}

function getPlayersInScene(Request): Promise<Response>;
```

### `getConnectedPlayers` {#getconnectedplayers}

```ts
interface Request {}

interface Response {
  players: Player[];
}

function getConnectedPlayers(Request): Promise<Response>;
```

### `getPlayerData` {#getplayerdata}

Devuelve los [`UserData`](#userdata) para un usuario, si se conocen para el `userId` dado.

```ts
interface Request {
  // El identificador del usuario, (para no invitados, su dirección de Ethereum).
  userId: string;
}

interface Response {
  // La información de perfil para este usuario, si está disponible.
  data?: UserData;
}

function getPlayerData(Request): Promise<Response>;
```

## Types

Hay solo dos tipos en este módulo: [`Player`](#player) y [`UserData`](#userdata).

### `Player` {#player}

Contiene una referencia a un `userId`.

```ts
interface Player {
  // El identificador del usuario, (para no invitados, su dirección de Ethereum).
  userId: string;
}
```

### `UserData` {#userdata}

Contiene información (posiblemente parcial) sobre un usuario, su identidad y avatar.

Los World Explorers obtienen esta información a través del [sistema de contenido](../../content/overview.md).

La [definición de entidad de perfil](../../content/entity-types/profiles.md) detalla todos estos campos y más. Mientras que la estructura y claves de `UserData` son ligeramente diferentes, el significado de cada campo es el mismo.

```ts
export interface UserData {
  // El identificador del usuario (es decir, su dirección de Ethereum).
  userId: string;

  // Un nombre para llamarlos en la UI.
  displayName: string;

  // La clave pública de Ethereum con la que firman.
  publicKey?: string;

  // Si tienen funcionalidad web3 habilitada.
  hasConnectedWeb3: boolean;

  // La versión secuencial de esta información, incrementada en cada actualización de usuario.
  version: number;

  // Información sobre su avatar, si está disponible.
  avatar?: {
    // Punteros a los activos requeridos para renderizar este avatar.
    bodyShape: string;
    wearables: string[];

    // Tintes de color RGB/RGBA codificados en hex para diferentes partes del cuerpo.
    skinColor: string;
    hairColor: string;
    eyeColor: string;

    // Identificadores de archivo para las "fotos" de este avatar.
    snapshots?: {
      face256: string;
      body: string;
    };
  };
}
```
