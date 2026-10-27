The `UserIdentity` module allows [scenes](../../content/entity-types/scenes.md) to access the [profile](../../content/entity-types/profiles.md) for the player's user.

```ts
const UserIdentity = require("~system/UserIdentity");
```

It contains the following methods and types:

- [`function getUserData`](#getuserdata)
- [`interface UserData`](#userdata)

## Methods

The two methods in this module fetch bits of information from the player's user.

### `getUserData` {#getuserdata}

Returns the [`UserData`](#userdata) for the player's user.

```ts
interface Request {}

interface Response {
  // The profile information for the user, if available.
  data?: UserData;
}

function getUserData(Request): Promise<Response>;
```

## Types

There's just one type in this module: `UserData`.

### `UserData` {#userdata}

Holds (possibly partial) information about a user, their identity and avatar.

World Explorers can obtain this through the [content system](../../content/overview.md).

The [profile entity definition](../../content/entity-types/profiles.md) details all of these fields and more. While the structure and keys of `UserData` are slightly different, the meaning of each field is the same.

```ts
export interface UserData {
  // The user's Ethereum address.
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

    // Hex-encoded RGB/RGBA colors for different body parts (#aabbcc or #aabbccdd).
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
