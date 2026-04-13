---
description: Build multiplayer Decentraland scenes with a headless authoritative server.
---

# Authoritative Servers

An **authoritative server** is the recommended approach for syncing state changes in your scene across players.

This approach is the gold standard for multiplayer fairness and anti-cheat. Rather than trusting each client to report its own actions, a headless server process runs your scene code, validates every state change, and broadcasts the single source of truth to all connected players.

An authoritative server is also the right tool whenever you need **server-side logic** to have the final word on scene state. In a peer-to-peer setup, two players controlling something like a floating platform can produce conflicting outcomes, setting the platform's position at different heights at each time, and no client has the authority to decide which is the "right" height. A server eliminates these race conditions and sync problems by resolving every change in one place, so all clients converge on the same result.

An authoritative server also gives you a place to **store persisted data that lasts across sessions**. You can keep things like global leaderboards, player progression, unlocked achievements, or environment changes (a door a player opened, a tree they chopped down, items they placed in the world) so that when players come back, the world reflects what happened before.

Decentraland provides all of these features effortlessly, without needing to pay for hosting or configure anything extra. The same action of publishing your scene also takes care of publishing the server.

## Setup

### 1. Install the auth-server SDK version

The native authoritative server APIs (`isServer`, `registerMessages`, `Storage`, `EnvVar`, etc.) are available on a dedicated SDK tag. Install it instead of the standard `@dcl/sdk`:

```bash
npm install @dcl/sdk@auth-server
```

### 2. Configure scene.json

Add the following fields to your `scene.json`:

```json
{
	"authoritativeMultiplayer": true,
	"logsPermissions": ["0xYourWalletAddress"]
}
```

| Field                      | Required    | Description                                                                                           |
| -------------------------- | ----------- | ----------------------------------------------------------------------------------------------------- |
| `authoritativeMultiplayer` | ✅          | Enables the headless server runtime                                                                   |
| `logsPermissions`          | Recommended | Wallet addresses that can see `console.log()` from the server. Without this, server output is hidden. |

### 3. Run the preview

Use the standard preview command, no extra steps needed. When `authoritativeMultiplayer: true` is set, the preview automatically starts the authoritative server in the background.

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
	} else {
		// Client-only: UI, input handling, message sending
		const { initClient } = await import('./client/setup')
		const { setupUi } = await import('./client/ui')
		initClient()
		setupUi()
	}
}
```

The server runs your scene headlessly with no rendering. It has verified access to all player positions, wearables and other data via `PlayerIdentityData` and is the sole authority over game state.

## Synced Components and Validation

Define components that sync from the server to all clients, then lock them so clients cannot tamper with them.

### Syncing Entities to All Clients

After creating an entity on the server, use `syncEntity` to broadcast any changes in the indicated components of that entity:

```typescript
import { syncEntity } from '@dcl/sdk/network'

syncEntity(
	entity,
	[Transform.componentId, GameState.componentId],
	/* enumId */ 1
)
```

The syntax is identical to the one used for [Serverless multiplayer](../sdk7/networking/serverless-multiplayer.md) feature, making it trivial to upgrade a scene from using this architecture to using the authoritative server. When the scene uses the authoritative server, messages are no longer sent between all players, instead all communications are now routed and potentially validated via the server.

### Validating changes

Use `validateBeforeChange()` to restrict any updates to the state of a certain component of an entity, so that changes are only successful when a certain condition is met.

If the condition returns the value _true_, then the change is accepted and propagated to all players. If the condition returns the value _false_, then the change is rejected. A rejected change won't be passed to other players and is reverted for the player who attempted to make it.

#### Validate values

The simplest case is to validate the _value_ being written. For example, only accept changes to a `Transform` when the new Y position is above 1:

```typescript
import { engine, Transform } from '@dcl/sdk/ecs'
import { isServer } from '@dcl/sdk/network'

const entity = engine.addEntity()
Transform.create(entity, { position: Vector3.create(10, 2, 10) })

if (isServer()) {
	Transform.validateBeforeChange(entity, (value) => {
		// Reject any update that would place the entity at or below Y = 0
		return value.position.y > 0
	})
}
```

Because `validateBeforeChange()` only has meaning on the server, always guard it with `isServer()`. On the client the call does nothing useful.

#### Only allow changes by admins

You can also validate based on _who_ is sending the change. Every incoming value includes a `senderAddress` field with the wallet address of the sender, which lets you allow changes only from certain players. For example, to only allow scene admins to modify a `VideoPlayer` component:

```typescript
import { engine, VideoPlayer } from '@dcl/sdk/ecs'
import { isServer, isPreview } from '@dcl/sdk/network'
import { getSceneAdmins } from '@dcl/sdk/server'

const videoEntity = engine.addEntity()
VideoPlayer.create(videoEntity, { src: 'videos/intro.mp4' })

if (isServer()) {
	// Cache of admin wallet addresses, refreshed from the scene admin list
	let adminAddresses = new Set<string>()

	async function updateAdminAddresses() {
		if (isPreview()) return
		try {
			const [error, response] = await getSceneAdmins()
			if (error) {
				console.error('[SERVER] Error fetching admin list:', error)
				adminAddresses = new Set()
				return
			}
			adminAddresses = new Set(
				(response ?? []).map((admin) => admin.admin.toLowerCase())
			)
			console.log(
				'[SERVER] Updated admin addresses cache:',
				Array.from(adminAddresses)
			)
		} catch (error) {
			console.error('[SERVER] Error updating admin addresses:', error)
			adminAddresses = new Set()
		}
	}

	// Populate the cache before wiring up validation
	await updateAdminAddresses()

	VideoPlayer.validateBeforeChange(videoEntity, (value) => {
		// Always allow changes while running in preview, so local testing is easier
		if (isPreview()) return true

		const senderAddress = value.senderAddress.toLowerCase()
		if (!adminAddresses.has(senderAddress)) {
			console.log(
				'[SERVER] Unauthorized VideoPlayer change blocked from:',
				senderAddress
			)
			return false
		}
		return true
	})
}
```

See [Scene Admin](../../scene-editor/live-ops/scene-admin.md) for more context about how players become admins on a scene.

#### Only allow changes by the server

The strictest case is to only accept writes that originate from the server itself, rejecting any change coming from a client, no matter which player sent it. This is the go-to pattern for state that should be fully authoritative: scores, game phase, spawned entities, etc.

Every incoming value includes a `senderAddress` field. When the sender is the server, this field matches the constant `AUTH_SERVER_PEER_ID`, exported from `@dcl/sdk/network/message-bus-sync`. Comparing against it is all you need to lock a component down.

The example below defines a small `protectServerEntity()` helper that applies this check to one or more components on a given entity. It's a convenient way to protect multiple built-in components (like `Transform` and `GltfContainer`) in a single call:

```typescript
import { Entity, Transform, GltfContainer } from '@dcl/sdk/ecs'
import { AUTH_SERVER_PEER_ID } from '@dcl/sdk/network/message-bus-sync'

type ComponentWithValidation = {
	validateBeforeChange: (
		entity: Entity,
		cb: (value: { senderAddress: string }) => boolean
	) => void
}

function protectServerEntity(
	entity: Entity,
	components: ComponentWithValidation[]
) {
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

{% hint style="warning" %}
**📔 Note**: Because `validateBeforeChange` blocks client writes, clients can only read synced state and send messages. The server is the single source of truth. If the server and client state diverge, the server always wins.
{% endhint %}

#### Custom Components

You can also apply `validateBeforeChange()` on custom components defined by the scene.

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
	gameEnded: Schemas.Map({ winnerId: Schemas.String }),
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
	const senderAddress = context.from // verified wallet address
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

### Available Schema Types

All message payloads and custom components use `Schemas` for binary serialization. Here is a quick reference of the types available:

```typescript
// Basic types
Schemas.String // "hello"
Schemas.Int // 42
Schemas.Float // 3.14
Schemas.Bool // true / false
Schemas.Int64 // Date.now()

// Vector types
Schemas.Vector3 // { x: 1, y: 2, z: 3 }
Schemas.Quaternion // { x, y, z, w }

// Complex types
Schemas.Array(Schemas.String) // ["a", "b", "c"]
Schemas.Entity // Entity reference
Schemas.Optional(Schemas.String) // "hello" or undefined
Schemas.Optional(Schemas.Int) // 42 or undefined

// Nested objects
Schemas.Map({
	name: Schemas.String,
	health: Schemas.Int,
	position: Schemas.Vector3,
	playerId: Schemas.Optional(Schemas.String),
})
```

{% hint style="warning" %}
**📔 Note**: Messages _must_ be defined using `Schemas.Map(...)`. You cannot send plain JavaScript objects — they will fail binary serialization.
{% endhint %}

## Server Reading Player Positions

The server can read **verified** player positions;clients cannot spoof these. This is the foundation of position-based anti-cheat:

```typescript
import { engine, PlayerIdentityData, Transform } from '@dcl/sdk/ecs'

engine.addSystem(() => {
	for (const [entity, identity] of engine.getEntitiesWith(PlayerIdentityData)) {
		const transform = Transform.getOrNull(entity)
		if (!transform) continue

		const address = identity.address
		const position = transform.position
		// This position is server-verified — never trust client-reported position
	}
})
```

{% hint style="warning" %}
**📔 Note**: Always use `PlayerIdentityData` + `Transform` on the server to get player positions. Never trust values reported by the client itself.
{% endhint %}

## Data Storage

Persist data across server restarts. Storage is **server-only**, always guard calls with `isServer()`. The server can both write and read this data.

```typescript
import { Storage } from '@dcl/sdk/server'
```

Data can be stored at two levels:

- **World**: Use this for data that is relevant to all players, like leaderboards or persistent environment changes.
- **Player**: Use this for player-specific data, like saving progress or preferences for that player.

### World Storage — Shared Across All Players

```typescript
// Write
await Storage.world.set(
	'leaderboard',
	JSON.stringify([
		{ name: 'Alice', score: 100 },
		{ name: 'Bob', score: 85 },
	])
)

// Read
const raw = await Storage.world.get<string>('leaderboard')
const leaderboard = raw ? JSON.parse(raw) : []

// Delete
await Storage.world.delete('leaderboard')
```

### Player Storage — Per Wallet Address

```typescript
// Write
await Storage.player.set(
	playerAddress,
	'progress',
	JSON.stringify({
		level: 5,
		coins: 250,
	})
)

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

### Access stored data

TODO: OPEN STORAGE UI

Read values, edit values

## Environment Variables

Configure your scene without hardcoding values into the code. These are useful for sensitive data, and also for feature flags that can be easily changed without republishing your scene.

`EnvVar` is **server-only** — guard with `isServer()`. The server can read environment variables, but not change their values.

```typescript
import { EnvVar } from '@dcl/sdk/server'

const maxPlayers = parseInt((await EnvVar.get('MAX_PLAYERS')) || '4')
const gameDuration = parseInt((await EnvVar.get('GAME_DURATION')) || '300')
const debugMode = ((await EnvVar.get('DEBUG')) || 'false') === 'true'
```

### Sensitive data

Environment variables are especially useful for storing private keys, reward claim codes, and other sensitive data that would be risky to expose in the public scene's compiled code.

You can store private keys in the server's storage, and have only the server read these with `isServer()`. That way the sensitive data never travels through the player's machine.

### Local Development

To use environment variables while running your project locally, create a `.env` file in your project root:

```
MAX_PLAYERS=8
GAME_DURATION=300
DEBUG=true
```

Important: Add `.env` to your `.gitignore`, so that these potentially sensitive values are never uploaded to the public content servers.

### Change environment variables

The easiest way to change the values of your environment variables is via the storage UI.

TODO: OPENING THE STORAGE UI

You can also upload and alter the values of environment variables via the command line:

```bash
# Set a variable
npx sdk-commands deploy-env MAX_PLAYERS --value 8

# Remove a variable
npx sdk-commands deploy-env OLD_VAR --delete
```

Deployed environment variables take precedence over `.env` values.

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

## Performance Best Practices

Every component change sends the _entire_ component data over the network — unlike Colyseus, which sends only diffs. When designing custom components, keep this in mind. The optimal solution may be to store data like game state in separate components, based on change cadency.

### ❌ Avoid monolithic components

```typescript
// BAD — changing the score also sends the positions array
const GameState = engine.defineComponent('GameState', {
	playerAScore: Schemas.Int,
	playerBScore: Schemas.Int,
	timer: Schemas.Int,
	playerPositions: Schemas.Array(Schemas.Vector3), // large payload
})
```

### ✅ Prefer atomic components

```typescript
// GOOD — each update is small and independent
const PlayerScore = engine.defineComponent('PlayerScore', {
	playerA: Schemas.Int,
	playerB: Schemas.Int,
})

const GameTimer = engine.defineComponent('GameTimer', {
	secondsLeft: Schemas.Int,
})
```

_Rule of thumb_: group fields that change together and at a similar frequency. Separate fast-changing data (timers, positions) from slow-changing data (scores, configuration).

### Throttle frequent messages

Avoid sending messages on every frame. Batch or throttle where possible:

```typescript
let lastSend = 0
engine.addSystem((dt) => {
	lastSend += dt
	if (lastSend > 0.1) {
		// every 100 ms
		room.send('position', transform.position)
		lastSend = 0
	}
})
```

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
	player.health = data.health // client controls the value!
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

### Wait for the server to start up

There has to be at least one player present in your scene for the server to run. If nobody's there after a few minutes, the server shuts down.

When a first player comes into the scene after a while of inactivity, the server takes a few seconds to start up. That's why your scene's code should be prepared to have to have to wait for the server to be online. Initial requests to the server should be have catch and retry mechanisms to provide resilience.

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

## Testing Locally

The standard preview handles everything. When `authoritativeMultiplayer: true` is set in `scene.json`, the local server starts automatically in the background alongside the client preview.

To test multiplayer interactions locally, open the preview in two separate windows, each window is treated as a separate player. Connect each window with a different wallet address. Both clients will connect to the same local server instance.

### Debugging tips

- _Prefix your logs_ with `[SERVER]` or `[CLIENT]` so you can tell them apart in the terminal:

  ```typescript
  if (isServer()) {
  	console.log('[SERVER] Starting...')
  } else {
  	console.log('[CLIENT] Starting...')
  }
  ```

- _Verify component sync_ on the client by logging entity counts:

  ```typescript
  engine.addSystem(() => {
  	const entities = Array.from(engine.getEntitiesWith(MyComponent))
  	console.log('[CLIENT] Synced entities:', entities.length)
  })
  ```

## Debug in production

TODO

view logs

view storage UI

## Version Control

Every published version of your scene gets its own unique hash ID, and each hash is paired with its own server instance. This means that the client code and the server code always move together, there is no window where a client running old logic talks to a server running new logic (or vice versa).

When you publish an update:

- _Players already in the scene_ keep seeing the old version until they leave and come back. Their clients stay connected to the server instance that matches the old hash.
- _New players arriving_ after the update load the new scene version and connect to the new server instance.

This guarantees that client and server state never fall out of sync because of a schema change or a renamed component. An update can never break the session of a player who is already in your scene.

The trade-off is that, for a short window right after a deploy, players can end up split across two different server instances. A player who was already there and a player who just arrived may not see each other or be able to interact via the scene, even though they are in the same scene, until the older players leave and rejoin.

{% hint style="info" %}
**💡 Tip**: Data stored via the [Storage](#data-storage) service (like leaderboards, player progress, or persistent environment changes) is _not_ wiped between versions. Storage is persisted at the location level and shared across all server instances that point to the same scene, so new versions pick up right where the previous one left off.
{% endhint %}

## Migrating from Colyseus

If you have an existing scene built on Colyseus, the table below maps common Colyseus patterns to their SDK7 equivalents:

| Colyseus                      | SDK7 Authoritative Server                       |
| ----------------------------- | ----------------------------------------------- |
| `room.send(type, data)`       | `room.send(type, data)` — same API              |
| `room.onMessage(type, cb)`    | `room.onMessage(type, cb)` — same API           |
| `room.state.players` (schema) | `syncEntity` + custom components                |
| JSON serialization            | Binary serialization (automatic via `Schemas`)  |
| Separate server application   | Same codebase — `isServer()` branching          |
| Custom server hosting         | Built-in: preview runs the server automatically |

Key differences to keep in mind:

- _Serialization_: Colyseus sends JSON diffs; the SDK sends the full component on every change. Keep components small (see [Performance Best Practices](#performance-best-practices)).
- _State model_: Colyseus uses a mutable state tree with automatic diffing. The SDK uses ECS components synced via `syncEntity` and protected with `validateBeforeChange`.
- _Hosting_: No separate server deployment. The authoritative server is deployed automatically together with the scene.

## Alternative: Third-Party Servers

The native SDK server is the recommended approach for new scenes. If you have an existing server infrastructure, you can still connect your scene via:

- **REST API + DB**: Good for data that changes infrequently (leaderboards, guestbooks). Players poll the API for updates; state persists between sessions. See [Network Connections](network-connections.md) for how to make `fetch` requests from a scene.
- **WebSocket server**: Allows real-time two-way communication. See [Network Connections](network-connections.md) for WebSocket usage. Libraries like [Colyseus](https://colyseus.io/) work well with the Decentraland SDK.

{% hint style="warning" %}
**📔 Note**: Third-party servers don't integrate with `syncEntity`, `validateBeforeChange`, or `Storage` — you'll need to implement your own state management and sync logic.
{% endhint %}
