The `Players` module allows [scenes](../../content/entity-types/scenes.md) to look for players in their environment and get information about their identity and [profiles](../../content/entity-types/profiles.md).

```ts
const Players = require("~system/Players");
```

It contains the following methods and types:

- [`function getPlayersInScene`](#getplayersinscene)
- [`function getConnectedPlayers`](#getplayersinscene)
- [`function getPlayerData`](#getplayerdata)
- [`interface Player`](#player)
- [`interface UserData`](#userdata)

## Methods

There's two methods in this module to discover players in the scene, and one to obtain their profiles.

### `getPlayersInScene` {#getplayersinscene}

Returns a [`Player`](#player) array, each with a `userId` that can be used in [getPlayerData](#getplayerdata).

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

Returns the [`UserData`](#userdata) for a user, if known for the given `userId`.

```ts
interface Request {
  // The user identifier, (for non-guests, their Ethereum address).
  userId: string;
}

interface Response {
  // The profile information for this user, if available.
  data?: UserData;
}

function getPlayerData(Request): Promise<Response>;
```

## Types

There's only two types in this module: [`Player`](#player) and [`UserData`](#userdata).

### `Player` {#player}

Holds a reference to a `userId`.

```ts
interface Player {
  // The user identifier, (for non-guests, their Ethereum address).
  userId: string;
}
```

### `UserData` {#userdata}

Holds (possibly partial) information about a user, their identity and avatar.

World Explorers obtain this information through the [content system](../../content/overview.md).

The [profile entity definition](../../content/entity-types/profiles.md) details all of these fields and more. While the structure and keys of `UserData` are slightly different, the meaning of each field is the same.

```ts
export interface UserData {
  // The user identifier (i.e. their Ethereum address).
  userId: string;

  // A name to call them in the UI.
  displayName: string;

  // The Ethereum public key they sign with.
  publicKey?: string;

  // Whether they have web3 functionality enabled.
  hasConnectedWeb3: boolean;

  // The sequential version of this information, incremented on each user update.
  version: number;

  // Information about their avatar, if available.
  avatar?: {
    // Pointers to the assets required to render this avatar.
    bodyShape: string;
    wearables: string[];

    // Hex-encoded RGB/RGBA color tints for different body parts.
    skinColor: string;
    hairColor: string;
    eyeColor: string;

    // File identifiers for the "photos" of this avatar.
    snapshots?: {
      face256: string;
      body: string;
    };
  };
}
```
