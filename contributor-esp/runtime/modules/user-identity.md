El módulo `UserIdentity` permite a las [escenas](../../content/entity-types/scenes.md) acceder al [perfil](../../content/entity-types/profiles.md) del usuario del jugador.

```ts
const UserIdentity = require("~system/UserIdentity");
```

Contiene los siguientes métodos y tipos:

- [`function getUserData`](#getuserdata)
- [`interface UserData`](#userdata)

## Methods

Los dos métodos en este módulo obtienen fragmentos de información del usuario del jugador.

### `getUserData` {#getuserdata}

Devuelve los [`UserData`](#userdata) para el usuario del jugador.

```ts
interface Request {}

interface Response {
  // La información de perfil para el usuario, si está disponible.
  data?: UserData;
}

function getUserData(Request): Promise<Response>;
```

## Types

Hay solo un tipo en este módulo: `UserData`.

### `UserData` {#userdata}

Contiene información (posiblemente parcial) sobre un usuario, su identidad y avatar.

Los World Explorers pueden obtener esto a través del [sistema de contenido](../../content/overview.md).

La [definición de entidad de perfil](../../content/entity-types/profiles.md) detalla todos estos campos y más. Mientras que la estructura y claves de `UserData` son ligeramente diferentes, el significado de cada campo es el mismo.

```ts
export interface UserData {
  // La dirección de Ethereum del usuario.
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

    // Colores RGB/RGBA codificados en hex para diferentes partes del cuerpo (#aabbcc o #aabbccdd).
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
