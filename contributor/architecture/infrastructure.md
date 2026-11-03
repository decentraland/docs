# Infrastructure

This page covers supporting infrastructure and external services that power Decentraland.

## External Services (SaaS)

### LiveKit

**Purpose**: High-quality media server for voice and video

[LiveKit](https://livekit.io/) provides:

* WebRTC media routing
* Voice chat
* Video conferencing
* Screen sharing
* Spatial audio (in development)

**Access Control**: [Comms Gatekeeper](../../apis/apis/comms-gatekeeper/README.md) generates time-limited tokens

**Used By**:

* Archipelago Workers - Default voice
* Worlds - Per-world voice channels
* Events - Event-specific channels

### SendGrid

**Purpose**: Email delivery service

Sends notification emails:

* Friend requests
* Event reminders
* System notifications

**Triggered By**: [Notifications system](../../apis/apis/notifications-workers/README.md)

***

## Blockchain Indexers

Multiple indexing services provide fast blockchain queries:

### Squids

**Purpose**: Custom blockchain indexer

[Subsquid](https://www.sqd.ai/) based indexers:

* Custom data models
* Fast sync times
* GraphQL API

**Indexes**:

* Land parcels (LAND NFTs)
* Wearables and collections
* Marketplace activity
* ENS names

### Satsuma

**Purpose**: Hosted GraphQL provider

Managed subgraph hosting:

* High availability
* Auto-scaling
* Monitoring included

### The Graph

**Purpose**: Decentralized indexing protocol

[The Graph](https://thegraph.com/) network:

* Decentralized indexers
* Query fees in GRT
* Community-operated

***

## Message Broker

### NATS

**Purpose**: Pub/sub message routing

[NATS](https://nats.io/) provides:

* Real-time message delivery
* Pub/sub patterns
* Request/reply patterns
* Clustering support

**Used By**:

| Service        | Purpose          |
| -------------- | ---------------- |
| Archipelago    | Position updates |
| Social Service | Friend status    |
| Worlds         | World events     |

***

## Media Processing

### Image Conversion Service (Metamorph)

**Purpose**: Image format conversion and optimization

Converts images between formats:

* WebP optimization
* Thumbnail generation
* Format conversion

**GitHub**: [metamorph](https://github.com/decentraland/metamorph)

### Profile Images System

**Purpose**: Avatar thumbnail generation

Generates avatar preview images:

* Face shots
* Full body shots
* Multiple resolutions

**Components**:

* **Profile Images Consumer** - Renders avatars
* **Profile Producer** - Listens for avatar changes

***

## Asset Processing Workers

### Asset Bundle Converter

**Purpose**: Platform-specific asset optimization

Converts deployed assets to optimized bundles for all platforms.

**Registers bundles in**: [Asset Bundle Registry](../../apis/apis/asset-bundle-registry/README.md)

### LODs Generator

**Purpose**: Level of detail variants

Generates lower-poly versions of 3D models for better performance.

***

## Rewards System

### Rewards API

**Purpose**: NFT reward distribution

Grants NFT rewards for actions:

* Onboarding completion
* Event participation
* Referrals

***

## Next Steps

* Review [Backend Services](services.md) for service specifications
* Check [Catalyst Network](catalyst.md) for content infrastructure
* See [Architecture Overview](architecture.md) for the complete picture
