
# Signed Fetch

When protocol clients what to make authenticated HTTPs requests, they can leverage the standard _signed fetch_ mechanism.

A signed fetch is request that includes an [authentication chain](authchain.md), represented through headers. Servers with Decentraland-compatible APIs can validate identities before, for example, [allowing requests from scenes](../runtime/modules/signed-fetch.md) or creating [adapters](../communications/overview.md).

## Headers

The information the server needs to validate the authentication chain is relayed in 3+ headers:

* `X-Identity-Timestamp`: the `timestamp` field included in the signed payload (see below).
* `X-Identity-Metadata`: the `metadata` field included in the signed payload (see below).
* `X-Identity-AuthChain-<index>`: the [JSON-serialized authentication step](authchain.md#constructing) `<index>`, starting from `0`.

The transmitted chain is validated by the server [as specified](authchain.md).

## Body

The request body is unspecified. Services have full flexibility to use any protocols or formats they like.

## Payload

The authentication chain [payload](authchain.md#constructing) for a signed fetch is a **colon-separated** string that includes some of the request elements:

```
<method>:<path>:<timestamp>:<metadata>
```

The `method` and `path` fields must match those of the request and are lower-cased, and `timestamp` is the same as in the `X-Identity-Timestamp` header.

The last field, `metadata`, can have arbitrary content. It is included exactly as sent in the `X-Identity-Metadata` header, without changing its case.

For example:

```
get:/some/path:1682790056:{"Some":"Custom JSON"}
```

Older clients lower-cased the whole payload, metadata included. Some services still accept that form for compatibility, but new clients should sign the payload described above.
