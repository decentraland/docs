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
- [Available Schema Types](#available-schema-types)
- [Server Reading Player Positions](#server-reading-player-positions)
- [Storage](#storage)
- [Environment Variables](#environment-variables)
- [Recommended Project Structure](#recommended-project-structure)
- [Performance Best Practices](#performance-best-practices)
- [Common Pitfalls](#common-pitfalls)
- [Complete Example](#complete-example)
- [Testing Locally](#testing-locally)
- [Migrating from Colyseus](#migrating-from-colyseus)
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

## Available Schema Types

All message payloads and custom components use `Schemas` for binary serialization. Here is a quick reference of the types available:

```typescript
// Basic types
Schemas.String      // "hello"
Schemas.Int         // 42
Schemas.Float       // 3.14
Schemas.Bool        // true / false
Schemas.Int64       // Date.now()

// Vector types
Schemas.Vector3     // { x: 1, y: 2, z: 3 }
Schemas.Quaternion  // { x, y, z, w }

// Complex types
Schemas.Array(Schemas.String)     // ["a", "b", "c"]
Schemas.Entity                    // Entity reference
Schemas.Optional(Schemas.String)  // "hello" or undefined
Schemas.Optional(Schemas.Int)     // 42 or undefined

// Nested objects
Schemas.Map({
  name: Schemas.String,
  health: Schemas.Int,
  position: Schemas.Vector3,
  playerId: Schemas.Optional(Schemas.String)
})
```

{% hint style="warning" %}
**📔 Note**: Messages *must* be defined using `Schemas.Map(...)`. You cannot send plain JavaScript objects — they will fail binary serialization.
{% endhint %}

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

## Performance Best Practices

Every component change sends the *entire* component data over the network — unlike Colyseus, which sends only diffs. Design your components with this in mind.

### ❌ Avoid monolithic components

```typescript
// BAD — changing the score also sends the positions array
const GameState = engine.defineComponent('GameState', {
  playerAScore: Schemas.Int,
  playerBScore: Schemas.Int,
  timer: Schemas.Int,
  playerPositions: Schemas.Array(Schemas.Vector3)  // large payload
})
```

### ✅ Prefer atomic components

```typescript
// GOOD — each update is small and independent
const PlayerScore = engine.defineComponent('PlayerScore', {
  playerA: Schemas.Int,
  playerB: Schemas.Int
})

const GameTimer = engine.defineComponent('GameTimer', {
  secondsLeft: Schemas.Int
})
```

*Rule of thumb*: group fields that change together and at a similar frequency. Separate fast-changing data (timers, positions) from slow-changing data (scores, configuration).

### Throttle frequent messages

Avoid sending messages on every frame. Batch or throttle where possible:

```typescript
let lastSend = 0
engine.addSystem((dt) => {
  lastSend += dt
  if (lastSend > 0.1) {  // every 100 ms
    room.send('position', transform.position)
    lastSend = 0
  }
})
```

---

## Common Pitfalls

### Forgetting validation on server-only state

Without `validateBeforeChange`, clients can write to any component:

```typescript
// ❌ BAD — clients can cheat
const Score = engine.defineComponent('Score', { value: Schemas.Int })

// ✅ GOOD — server-only
Score.validateBeforeChange((v) => v.senderAddress === AUTH_SERVER_PEER_ID)
```

### Trusting client-supplied values

Never let a client dictate its own health, score, or position:

```typescript
// ❌ BAD
room.onMessage('setHealth', (data) => {
  player.health = data.health  // client controls the value!
})

// ✅ GOOD — server calculates the result
room.onMessage('takeDamage', (data) => {
  const damage = calculateDamage(data.source)
  player.health = Math.max(0, player.health - damage)
})
```

### Sending messages before state sync

Clients must wait until state is synchronised before interacting:

```typescript
import { isStateSyncronized } from '@dcl/sdk/network'

engine.addSystem(() => {
  if (!isStateSyncronized()) return
  // safe to send messages
})
```

---

## Complete Example

A minimal multiplayer counter — click a button, the server increments a synced score:

```typescript
import { engine, Schemas } from '@dcl/sdk/ecs'
import { registerMessages, isServer, syncEntity } from '@dcl/sdk/network'
import { AUTH_SERVER_PEER_ID } from '@dcl/sdk/network/message-bus-sync'
import { pointerEventsSystem } from '@dcl/sdk/ecs'

// 1. Define messages (shared)
const Messages = {
  increment: Schemas.Map({}),
  stateUpdate: Schemas.Map({
    count: Schemas.Int,
    lastPlayer: Schemas.String,
  }),
}

// 2. Define a server-only component (shared)
const Counter = engine.defineComponent('Counter', {
  value: Schemas.Int,
  lastPlayer: Schemas.String,
})

Counter.validateBeforeChange((v) => v.senderAddress === AUTH_SERVER_PEER_ID)

// 3. Create the room
const room = registerMessages(Messages)

export function main() {
  if (isServer()) {
    // === SERVER ===
    const counterEntity = engine.addEntity()
    syncEntity(counterEntity, [Counter.componentId], 1)
    Counter.create(counterEntity, { value: 0, lastPlayer: 'none' })

    room.onMessage('increment', (_data, context) => {
      if (!context) return
      const counter = Counter.getMutable(counterEntity)
      counter.value += 1
      counter.lastPlayer = context.from

      room.send('stateUpdate', {
        count: counter.value,
        lastPlayer: context.from,
      })
    })
  } else {
    // === CLIENT ===
    const button = engine.addEntity()
    // ... add Transform, MeshRenderer, etc.

    pointerEventsSystem.onPointerDown(button, () => {
      room.send('increment', {})
    })

    room.onMessage('stateUpdate', (data) => {
      console.log(`Count: ${data.count} (last click by ${data.lastPlayer})`)
    })
  }
}
```

---

## Testing Locally

The standard preview handles everything. When `authoritativeMultiplayer: true` is set in `scene.json`, the server starts automatically in the background alongside the client preview.

To test multiplayer interactions locally, open the preview in two separate browser windows — each window is treated as a separate player. Connect each window with a different wallet address. Both clients will connect to the same local server instance.

### Debugging tips

- *Prefix your logs* with `[SERVER]` or `[CLIENT]` so you can tell them apart in the terminal:

  ```typescript
  if (isServer()) {
    console.log('[SERVER] Starting...')
  } else {
    console.log('[CLIENT] Starting...')
  }
  ```

- *Verify component sync* on the client by logging entity counts:

  ```typescript
  engine.addSystem(() => {
    const entities = Array.from(engine.getEntitiesWith(MyComponent))
    console.log('[CLIENT] Synced entities:', entities.length)
  })
  ```

- *Check `logsPermissions`* — if you don't see any server output, make sure your wallet address is listed in `scene.json`.

---

## Migrating from Colyseus

If you have an existing scene built on Colyseus, the table below maps common Colyseus patterns to their SDK7 equivalents:

| Colyseus | SDK7 Authoritative Server |
|---|---|
| `room.send(type, data)` | `room.send(type, data)` — same API |
| `room.onMessage(type, cb)` | `room.onMessage(type, cb)` — same API |
| `room.state.players` (schema) | `syncEntity` + custom components |
| JSON serialization | Binary serialization (automatic via `Schemas`) |
| Separate server application | Same codebase — `isServer()` branching |
| Custom server hosting | Built-in: preview runs the server automatically |

Key differences to keep in mind:

- *Serialization*: Colyseus sends JSON diffs; the SDK sends the full component on every change. Keep components small (see [Performance Best Practices](#performance-best-practices)).
- *State model*: Colyseus uses a mutable state tree with automatic diffing. The SDK uses ECS components synced via `syncEntity` and protected with `validateBeforeChange`.
- *Hosting*: No separate server deployment. The authoritative server runs as part of the scene runtime.

---

## Alternative: Third-Party Servers

The native SDK server is the recommended approach for new scenes. If you have an existing server infrastructure, you can still connect your scene via:

- **REST API + DB**: Good for data that changes infrequently (leaderboards, guestbooks). Players poll the API for updates; state persists between sessions. See [Network Connections](network-connections.md) for how to make `fetch` requests from a scene.
- **WebSocket server**: Allows real-time two-way communication. See [Network Connections](network-connections.md) for WebSocket usage. Libraries like [Colyseus](https://colyseus.io/) work well with the Decentraland SDK.

{% hint style="warning" %}
**📔 Note**: Third-party servers don't integrate with `syncEntity`, `validateBeforeChange`, or `Storage` — you'll need to implement your own state management and sync logic.
{% endhint %}
