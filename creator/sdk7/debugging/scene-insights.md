---
description: Search persistent Multiplayer Server logs, follow live logs, and inspect scene performance metrics.
---

# Scene Insights

Scene Insights helps you investigate a deployed [Multiplayer Server](../networking/authoritative-servers.md) scene. Search historical server logs, follow new messages live, and retrieve CPU, memory, and other metrics from your terminal or AI assistant.

**Logs and metrics are kept for 7 days**, across server restarts and scene redeploys. This covers server-side execution; use [Debug in Production](debug-in-prod.md) for client-side and rendering issues.

## Update Your Project

Run these commands from your scene project to install the latest `auth-server` SDK and runtime:

```bash
npm install @dcl/sdk@auth-server @dcl/js-runtime@auth-server
```

If your project also lists `@dcl/sdk-commands` directly in `package.json`, update it to `@auth-server` too. Confirm the installed CLI includes `login`, `logs`, `tail`, `metrics`, and `executions`:

```bash
npx sdk-commands scene-insights --help
```

For AI-assisted debugging, also install or refresh the [SDK Skills](../getting-started/vibe-coding.md):

```bash
npx skills add decentraland/sdk-skills --all
```

You can ask your AI companion to do the setup:

> Update this scene to the latest auth-server SDK and runtime, and update the Decentraland SDK Skills. Help me sign in to Scene Insights, then investigate the last two hours of server errors and CPU and memory usage.

Reading telemetry from an already deployed scene does not require a redeploy. Permission changes do.

## Who Can Read the Data?

Sign in with a wallet that meets one of these conditions:

- It appears in the deployed scene's root-level `logsPermissions` array.
- It owns the World.
- It is a World deployment collaborator whose grant covers the whole World or every deployed parcel of the scene.
- For Genesis City, it owns the scene's **base parcel**, or has delegated LAND management permission on that parcel: `operator`, `updateOperator`, `updateManager`, or `approvedForAll`.

Owners and eligible managers do not need a `logsPermissions` entry or a scene redeploy. To explicitly grant access to another wallet, add it to `scene.json` and redeploy:

```json
{
  "logsPermissions": ["0xYourWalletAddress"]
}
```

For Genesis City, permission is checked against the deployed scene's base parcel, even if you query another parcel within the scene. Ownership or management rights on a different parcel alone do not grant access to the scene.

The same permissions cover historical logs, live logs, metrics, and execution history. Access follows **current permissions**: the base-parcel owner can read telemetry from scenes deployed by an operator or tenant, including retained history under the same scene key for up to 7 days.

Permission changes can take up to 60 seconds to affect new requests with the default cache settings. Open live streams recheck access periodically (every 5 minutes by default). Logging in does not grant permission to read other scenes.

## Sign In

```bash
npx sdk-commands scene-insights login
```

Approve the login in your browser with a normal wallet or a smart contract wallet. This creates an Insights session limited to reading logs, metrics, and executions. It lasts up to **12 hours**, bounded by the parent session's expiry. Subsequent commands reuse it without another approval.

Check the signed-in address and expiration with:

```bash
npx sdk-commands scene-insights session --json
```

When the session expires, run `login` again. If an AI assistant is investigating for you, approve the wallet login yourself. Do not share private keys or the cached session file with it.

## Choose a Scene

From the scene project, commands infer the World from `scene.json`'s `worldConfiguration.name`, or use `scene.base` for Genesis City. You can also choose explicitly:

```bash
# A World
npx sdk-commands scene-insights logs --world myworld.dcl.eth

# One scene in a multi-scene World
npx sdk-commands scene-insights logs --world myworld.dcl.eth --position 10,10

# A Genesis City scene: use = when coordinates are negative
npx sdk-commands scene-insights logs --position=-125,-96
```

Commands default to production (`.org`). For a scene on the development network, add `--target https://multiplayer-scenes-insights-service.decentraland.zone` to login, session checks, and queries. Using the same target throughout also ensures smart contract wallets are validated on the correct network.

## Search Logs and Executions

```bash
# Latest 200 errors in the last 6 hours
npx sdk-commands scene-insights logs --from 6h --level error --limit 200

# Find text in a fixed UTC time window
npx sdk-commands scene-insights logs --from 2026-11-01T14:00:00Z --to 2026-11-01T14:30:00Z --query "player joined"

# List server runs in the last day
npx sdk-commands scene-insights executions --from 1d

# Logs from one run: replace EXECUTION_ID with an ID from executions
npx sdk-commands scene-insights logs --execution EXECUTION_ID --from 1d
```

`logs` defaults to the last hour and the newest 100 matching lines, displayed chronologically. Set `--limit` between 1 and 10,000. `--level` is a minimum severity (`warn` includes errors); `--query` searches literal text without case sensitivity. Use `--source scene,engine` to filter origins.

`executionId` identifies a server run; `entityId` identifies the deployed scene version. A new execution can mean an idle stop/start, a rollout, or a crash. Check surrounding logs before concluding that it crashed.

Add `--json` for machine-readable output. Historical logs return one JSON document; `more: true` means additional matches exist beyond the returned limit. Narrow the window or increase the limit.

## Follow Live Logs

```bash
npx sdk-commands scene-insights tail
```

Press **Ctrl+C** to stop. For a bounded capture, including when asking an AI assistant to investigate:

```bash
npx sdk-commands scene-insights tail --for 30s --lines 20 --json
```

This replays the newest 20 lines, then follows new ones for 30 seconds. JSON output contains one log entry per line. The CLI reconnects and resumes during a running tail. Logs normally arrive a few seconds after the scene writes them.

`tail` supports level and text filters. For historical time windows or execution/source filters, use `logs`.

If you use `npm run server-logs`, check that your project's `package.json` contains:

```json
{
  "scripts": {
    "server-logs": "sdk-commands scene-insights tail"
  }
}
```

Full project builds with the updated SDK create or migrate the SDK-generated default script. Custom scripts are preserved; previews with `--skip-build` and single-file builds do not update it. You can edit the script directly without rebuilding just to inspect logs.

## Inspect Performance Metrics

First list metrics that have data, then query a series:

```bash
npx sdk-commands scene-insights metrics --json
npx sdk-commands scene-insights metrics cpu.percent --from 2h --step 60 --json
npx sdk-commands scene-insights metrics mem.heap_used --from 2h --step 60 --json
```

`--step` sets the bucket size in seconds. Available metrics depend on the engine version and scene activity. Metric discovery and `executions` default to the last 24 hours. Use `--execution EXECUTION_ID` on a metric series to isolate a run.

| Metric | What it tells you |
| --- | --- |
| `cpu.percent` | Execution-thread CPU as a percentage of one core; sustained values near 100% suggest that thread is busy |
| `cpu.run_ms` | CPU time spent in `onStart`/`onUpdate`, not wall-clock latency |
| `mem.heap_used`, `mem.heap_limit`, `mem.external_bytes` | JavaScript heap use, heap ceiling, and V8 external memory |
| `logs.lines`, `logs.bytes` | Console output before rate limits; useful for spotting excessive logging |
| `fetch.failed`, `storage.failed` | Failed outbound HTTP or storage calls to correlate with error logs |
| `comms.msgs_out`, `comms.bytes_out` | Messages and bytes sent to players |

CPU metrics do not measure the entire server, and memory metrics are not the process's total memory or container limit. Compare the same execution, time window, and workload before diagnosing a leak or performance problem.

Gauges return `avg` and `max` per bucket. Sums return `sum` and a per-second `rate`. A `null` point means no stored sample, not zero usage; idle scenes, delays, and collection failures can all cause gaps.

## Retention and Limits

| Limit | Default |
| --- | --- |
| Log and metric retention | 7 days |
| Maximum query time range | 7 days |
| Log results per query | 100 by default; up to 10,000 |
| Metric series | Up to 1,500 buckets; increase `--step` for longer windows |
| Sustained scene logging | 50 lines/second and 64 KiB/second |
| Logging burst allowance | 500 lines and 512 KiB |
| Daily scene log quota | 500,000 lines or 128 MiB; resets at 00:00 UTC |

Rate limits and daily quotas drop excess logs; dropped lines cannot be retrieved later. Engine warning messages report drops and quota resets. Reaching the daily quota stops additional log persistence until the reset; the scene keeps running. Reduce repeated per-frame logging so useful messages fit within the budget.

Large messages can be truncated (the API defaults to 8,192 characters per message). Collection is best effort: outages, export failures, and rate limits can leave gaps. Only collected telemetry is available; installing the new CLI cannot recover older or dropped data. Empty results alone do not prove that a scene is healthy.
