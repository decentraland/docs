El módulo `RestrictedActions` permite a las escenas acceder a funcionalidad sensible (y por lo tanto restringida). Está vinculado al sistema de [`permission`](../../content/entity-types/scenes.md#permissions), que las escenas usan para solicitar el uso de métodos individuales.

```ts
const RestrictedActions = require("~system/RestrictedActions");
```

{% hint style="info" %}
Como implementador de World Explorer, tu runtime podría no tener aplicación de permisos. **Recomendamos encarecidamente** contra esto, ya que pone a los jugadores en peligro.
{% endhint %}

La mayor parte de la funcionalidad restringida es proporcionada por este módulo, pero también hay [funciones globales](../globals.md) restringidas.

El módulo contiene los siguientes métodos y tipos:

- [`function movePlayerTo`](#moveplayerto)
- [`function teleportTo`](#teleportto)
- [`function triggerEmote`](#triggeremote)
- [`function changeRealm`](#changerealm)
- [`function openExternalUrl`](#openexternalurl)
- [`function openNftDialog`](#opennftdialog)
- [`interface Vector3`](#vector3)

## Methods

Cada uno de los métodos abajo está asociado con un [permiso](../../content/entity-types/scenes.md#permissions) específico que puede solicitarse en el manifest de escena.

### `movePlayerTo` {#moveplayerto}

Desplazar al jugador a una nueva posición relativa a la actual, y opcionalmente establecer el objetivo de cámara con [vectores](#vector3).

Requiere el permiso [`ALLOW_TO_MOVE_PLAYER_INSIDE_SCENE`](../../content/entity-types/scenes.md#permissions).

```ts
interface Request {
  newRelativePosition: Vector3;
  cameraTarget?: Vector3;
}

interface Response {}

function movePlayerTo(Request): Promise<Response>;
```

### `teleportTo` {#teleportto}

Reposicionar al jugador a una ubicación mundial absoluta dada por [vectores](#vector3).

En lugar de requerir un permiso pre-aprobado, cada llamada a `teleportTo` debe ser aprobada por el jugador.

```ts
interface Request {
  worldPosition: Vector3;
}

interface Response {}

function teleportTo(Request): Promise<Response>;
```

### `triggerEmote` {#triggeremote}

Hacer que el avatar del jugador muestre una animación de emote, usando uno de los nombres predefinidos.

Requiere el permiso [`ALLOW_TO_TRIGGER_AVATAR_EMOTE`](../../content/entity-types/scenes.md#permissions).

```ts
interface Request {
  predefinedEmote: string;
}

interface Response {}

function triggerEmote(Request): Promise<Response>;
```

### `openExternalUrl` {#openexternalurl}

Ofrecer mostrar un sitio web al jugador, usando una UI apropiada (que puede ser otra aplicación).

Requiere el permiso [`OPEN_EXTERNAL_LINK`](../../content/entity-types/scenes.md#permissions).

```ts
interface Request {
  url: string;
}

interface Response {
  // Si el jugador autorizó abrir el enlace.
  success: boolean;
}

function openExternalUrl(Request): Promise<Response>;
```

### `openNftDialog` {#opennftdialog}

Mostrar información sobre un NFT al jugador, usando una UI apropiada.

```ts
interface Request {
  // El URN del NFT.
  urn: string;
}

interface Response {
  // Si el NFT fue localizado exitosamente y se refería a una imagen o video.
  success: boolean;
}

function openNftDialog(Request): Promise<Response>;
```

### `changeRealm` {#changerealm}

Cambiar el World Explorer a otro servidor de contenido, usando su URL base.

```ts
interface Request {
  // La URL del nuevo realm.
  realm: string;

  // Un mensaje opcional para mostrar a usuarios cuando tienen que aprobar el cambio.
  message?: string;
}

interface Response {
  // Si el cambio de realm fue autorizado y exitoso.
  success: boolean;
}

function changeRealm(Request): Promise<Response>;
```

## Types

El único tipo adicional usado por métodos en este módulo es el `Vector3`.

### `Vector3` {#vector3}

Contiene una posición 3d relativa o absoluta.

```ts
interface Vector3 {
  x: number;
  y: number;
  z: number;
}
```

<!--
## Pending

```ts
export function changeRealm(body: ChangeRealmRequest): Promise<SuccessResponse>;
export interface ChangeRealmRequest {
  realm: string;
  message?: string | undefined;
}

export function setCommunicationsAdapter(body: CommsAdapterRequest): Promise<SuccessResponse>;
export interface CommsAdapterRequest {
    connectionString: string;
}

export interface UnblockPointerRequest {
    }
```
-->
