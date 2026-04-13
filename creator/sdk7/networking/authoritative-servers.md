---
description: Build multiplayer Decentraland scenes with a headless authoritative server.
---

# Authoritative Servers

An **authoritative server** is the gold standard for multiplayer fairness and anti-cheat. Rather than trusting each client to report its own actions, a headless server process runs your scene code, validates every state change, and broadcasts the single source of truth to all connected players.

This page covers the **native SDK authoritative server** — a first-class feature that lets you write one TypeScript codebase that runs on both client and server, controlled by a single `isServer()` check.

{% hint style="info" %}
**💡 Not sure if you need this?** If your scene has no in-world economy, no competitive gameplay, and no incentive to cheat, [Serverless Multiplayer](serverless-multiplayer.md) is simpler and requires no server infrastructure.
{% endhint %}

## Contents

- [Setup](#setup)
- [Server / Client Branching](#server--client-branching)
- [Synced Components and Validation](#synced-components-and-validation)
- [Messages](#messages)
- [Server Reading Player Positions](#server-reading-player-positions)
- [Storage](#storage)
- [Environment Variables](#environment-variables)
- [Recommended Project Structure](#recommended-project-structure)
- [Testing Locally](#testing-locally)
- [Alternative: Third-Party Servers](#alternative-third-party-servers)

---

## Setup

### 1. Install the auth-server SDK

The native authoritative server APIs (`isServer`, `registerMessages`, `Storage`, `EnvVar`, etc.) are available on a dedicated SDK tag. Install it instead of the standard `@dcl/sdk`:

```bash
npm install @dcl/sdk@auth-server
```

### 2. Configure scene.json

Add the following fields to your `scene.json`:

```json
{
  "authoritativeMultiplayer": true,
  "worldConfiguration": {
    "name": "my-world-name.dcl.eth"
  },
  "logsPermissions": ["0xYourWalletAddress"]
}
```

| Field | Required | Description |
|---|---|---|
| `authoritativeMultiplayer` | ✅ | Enables the headless server runtime |
| `worldConfiguration.name` | ✅ | Identifies the world for deployment, Storage, and environment variables |
| `logsPermissions` | Recommended | Wallet addresses that can see `console.log()` from the server. Without this, server output is hidden. |

### 3. Run the preview

Use the standard preview command — no extra steps needed. When `authoritativeMultiplayer: true` is set, the preview automatically starts the authoritative server in the background.

---

## Server / Client Branching

The same codebase runs on both server and client. Use `isServer()` at the entry point to split execution paths:

```typescript
import { isServer } from '@dcl/sdk/network'

export async function main() {
  if (isServer()) {
    // Server-only: game logic, validation, state management
    const { initServer } = await import('./server/server')
    initServer()
    return
  }

  // Client-only: UI, input handling, message sending
  const { initClient } = await import('./client/setup')
  const { setupUi } = await import('./client/ui')
  initClient()
  setupUi()
}
```

The server runs your scene headlessly with no rendering. It has verified access to all player positions via `PlayerIdentityData` and is the sole authority over game state.

---

## Synced Components and Validation

Define components that sync from the server to all clients, then lock them so clients cannot tamper with them.

### Custom Components

Use `validateBeforeChange()` to restrict all writes to the server:

```typescript
import { engine, Schemas } from '@dcl/sdk/ecs'
import { AUTH_SERVER_PEER_ID } from '@dcl/sdk/network/message-bus-sync'

export const GameState = engine.defineComponent('game:State', {
  phase: Schemas.String,
  score: Schemas.Int,
  timeRemaining: Schemas.Int,
})

// Only the server can modify this component
GameState.validateBeforeChange((value) => {
  return value.senderAddress === AUTH_SERVER_PEER_ID
})
```

### Built-in Components (Per-Entity Validation)

For built-in components like `Transform` and `GltfContainer`, apply validation **per entity** rather than globally — this avoids blocking client-side transforms on the player's own avatar:

```typescript
import { Entity, Transform, GltfContainer } from '@dcl/sdk/ecs'
import { AUTH_SERVER_PEER_ID } from '@dcl/sdk/network/message-bus-sync'

type ComponentWithValidation = {
  validateBeforeChange: (
    entity: Entity,
    cb: (value: { senderAddress: string }) => boolean
  ) => void
}

function protectServerEntity(entity: Entity, components: ComponentWithValidation[]) {
  for (const component of components) {
    component.validateBeforeChange(entity, (value) => {
      return value.senderAddress === AUTH_SERVER_PEER_ID
    })
  }
}

// After creating a server-managed entity:
const entity = engine.addEntity()
Transform.create(entity, { position: Vector3.create(10, 5, 10) })
GltfContainer.create(entity, { src: 'assets/model.glb' })
protectServerEntity(entity, [Transform, GltfContainer])
```

### Syncing Entities to All Clients

After creating and protecting an entity on the server, use `syncEntity` to broadcast it:

```typescript
import { syncEntity } from '@dcl/sdk/network'

syncEntity(entity, [Transform.componentId, GameState.componentId], /* enumId */ 1)
```

{% hint style="warning" %}
**📔 Note**: Because `validateBeforeChange` blocks client writes, clients can only read synced state and send messages. The server is the single source of truth. If the server and client state diverge, the server always wins.
{% endhint %}

---

## Messages

Use `registerMessages()` for typed, schema-validated communication between clients and the server.

### Define Messages

Define all messages in a shared file. Each message is a `Schemas.Map` describing its payload:

```typescript
import { Schemas } from '@dcl/sdk/ecs'
import { registerMessages } from '@dcl/sdk/network'

export const Messages = {
  // Client → Server
  playerReady: Schemas.Map({ displayName: Schemas.String }),
  playerAction: Schemas.Map({ action: Schemas.String, targetId: Schemas.Int }),

  // Server → Client
  gameStarted: Schemas.Map({ roundNumber: Schemas.Int }),
  gameEnded:   Schemas.Map({ winnerId: Schemas.String }),
}

export const room = registerMessages(Messages)
```

### Send Messages

```typescript
// Client → Server (broadcast, server receives it)
room.send('playerReady', { displayName: 'Alice' })

// Server → all clients
room.send('gameStarted', { roundNumber: 1 })

// Server → one specific client (by wallet address)
room.send('gameEnded', { winnerId: 'Alice' }, { to: [playerAddress] })
```

### Receive Messages

```typescript
// Server receives from client
room.onMessage('playerReady', (data, context) => {
  if (!context) return
  const senderAddress = context.from  // verified wallet address
  console.log(`[Server] ${data.displayName} is ready (${senderAddress})`)
})

// Client receives from server
room.onMessage('gameStarted', (data) => {
  console.log(`Round ${data.roundNumber} started!`)
})
```

### Wait for State Sync Before Sending

Clients should wait until the scene state is synced before sending their first message, to avoid race conditions on join:

```typescript
import { isStateSyncronized } from '@dcl/sdk/network'

engine.addSystem(() => {
  if (!isStateSyncronized()) return

  // Safe to send messages now
  room.send('playerReady', { displayName: 'Alice' })
})
```

---

## Server Reading Player Positions

The server can read **verified** player positions — clients cannot spoof these. This is the foundation of position-based anti-cheat:

```typescript
import { engine, PlayerIdentityData, Transform } from '@dcl/sdk/ecs'

engine.addSystem(() => {
  for (const [entity, identity] of engine.getEntitiesWith(PlayerIdentityData)) {
    const transform = Transform.getOrNull(entity)
    if (!transform) continue

    const address  = identity.address
    const position = transform.position
    // This position is server-verified — never trust client-reported position
  }
})
```

{% hint style="warning" %}
**📔 Note**: Always use `PlayerIdentityData` + `Transform` on the server to get player positions. Never trust values reported by the client itself.
{% endhint %}

---

## Storage

Persist data across server restarts. Storage is **server-only** — always guard calls with `isServer()`.

```typescript
import { Storage } from '@dcl/sdk/server'
```

### World Storage — Shared Across All Players

```typescript
// Write
await Storage.world.set('leaderboard', JSON.stringify([
  { name: 'Alice', score: 100 },
  { name: 'Bob',   score: 85 },
]))

// Read
const raw = await Storage.world.get<string>('leaderboard')
const leaderboard = raw ? JSON.parse(raw) : []

// Delete
await Storage.world.delete('leaderboard')
```

### Player Storage — Per Wallet Address

```typescript
// Write
await Storage.player.set(playerAddress, 'progress', JSON.stringify({
  level: 5,
  coins: 250,
}))

// Read
const saved = await Storage.player.get<string>(playerAddress, 'progress')
const progress = saved ? JSON.parse(saved) : { level: 1, coins: 0 }

// Delete
await Storage.player.delete(playerAddress, 'progress')
```

{% hint style="info" %}
**💡 Tip**: Storage only accepts strings. Use `JSON.stringify()` / `JSON.parse()` for objects and `String()` / `parseInt()` for numbers.

During local development, storage is written to `node_modules/@dcl/sdk-commands/.runtime-data/server-storage.json`.
{% endhint %}

---

## Environment Variables

Configure your scene without hardcoding values. `EnvVar` is **server-only** — guard with `isServer()`.

```typescript
import { EnvVar } from '@dcl/sdk/server'

const maxPlayers  = parseInt((await EnvVar.get('MAX_PLAYERS'))   || '4')
const gameDuration = parseInt((await EnvVar.get('GAME_DURATION')) || '300')
const debugMode   = ((await EnvVar.get('DEBUG')) || 'false') === 'true'
```

### Local Development

Create a `.env` file in your project root:

```
MAX_PLAYERS=8
GAME_DURATION=300
DEBUG=true
```

Add `.env` to your `.gitignore`.

### Deploy to Production

```bash
# Set a variable
npx sdk-commands deploy-env MAX_PLAYERS --value 8

# Remove a variable
npx sdk-commands deploy-env OLD_VAR --delete
```

Deployed environment variables take precedence over `.env` values.

---

## Recommended Project Structure

Separating server, client, and shared code keeps the codebase readable as it grows:

```
src/
├── index.ts              # Entry point — isServer() branch
├── client/
│   ├── setup.ts          # Input handlers, message senders
│   └── ui.tsx            # React ECS UI (reads synced state)
├── server/
│   ├── server.ts         # Game loop, message handlers, state mutations
│   └── gameState.ts      # Helper functions for server state
└── shared/
    ├── schemas.ts        # Component definitions + validateBeforeChange
    └── messages.ts       # registerMessages() — imported by both sides
```

{% hint style="info" %}
**💡 Tip**: Keep all `registerMessages()` calls and custom component definitions in `shared/`. Both server and client import from there, ensuring they always agree on message schemas.
{% endhint %}

---

## Testing Locally

The standard preview handles everything. When `authoritativeMultiplayer: true` is set in `scene.json`, the server starts automatically in the background alongside the client preview.

To test multiplayer interactions locally, open the preview in two separate browser windows — each window is treated as a separate player. Connect each window with a different wallet address. Both clients will connect to the same local server instance.

---

## Alternative: Third-Party Servers

The native SDK server is the recommended approach for new scenes. If you have an existing server infrastructure, you can still connect your scene via:

- **REST API + DB**: Good for data that changes infrequently (leaderboards, guestbooks). Players poll the API for updates; state persists between sessions. See [Network Connections](network-connections.md) for how to make `fetch` requests from a scene.
- **WebSocket server**: Allows real-time two-way communication. See [Network Connections](network-connections.md) for WebSocket usage. Libraries like [Colyseus](https://colyseus.io/) work well with the Decentraland SDK.

{% hint style="warning" %}
**📔 Note**: Third-party servers don't integrate with `syncEntity`, `validateBeforeChange`, or `Storage` — you'll need to implement your own state management and sync logic.
{% endhint %}
