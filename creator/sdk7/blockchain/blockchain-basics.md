---
description: >-
  Key blockchain concepts to understand before building a scene that reads
  from the blockchain or triggers transactions.
---

# Blockchain Basics

This page covers the blockchain concepts that matter when you build a scene that checks what players own or asks them to make transactions. For a player-level introduction, see [About the Blockchain](../../../player/blockchain-integration/ethereum-essentials.md).

## What goes on the blockchain

Decentraland uses the blockchain to record ownership of digital assets: LAND, NAMEs, Wearables, Emotes, MANA and any other token a scene might care about.

The blockchain isn't used for anything that changes in real time as players interact with a scene, like positions, game state or scores. That state lives on each player's machine, or on a server you run for your scene. As a scene developer, you decide which information is worth recording on the blockchain and which belongs on a server.

## Player wallets and identity

Every signed-in player has a wallet address, which you can use to identify them persistently across sessions. Get it with `getPlayer()`, as shown in [Scene Blockchain Operations](scene-blockchain-operations.md#get-a-players-ethereum-account).

Players can sign in with their own crypto wallet (like MetaMask), or with a social account or an email address, in which case a wallet is created for them. Your scene doesn't need to treat them differently: they all have an address, hold tokens and can sign transactions. Players who play as guests have limited access to blockchain features, so check the `isGuest` field before asking them to transact.

## Transactions

A transaction is any change to the blockchain: tokens changing owners, or changing information stored about a token, such as merging LAND parcels into an Estate.

Every transaction is signed with the private key of the wallet it comes from. This proves it was sent by the owner of that address. When your scene triggers a transaction, **the player must always approve it explicitly** in a confirmation window. A scene can never move a player's tokens without their consent.

### Network fees

Every transaction pays a fee, called _gas_, in the network's own currency: ETH on Ethereum and POL on Polygon.

On both networks, the fee is made of a _base fee_, set by the network according to how busy it is, plus an optional _priority fee_ (a tip) that the sender adds to get processed sooner. Fees are measured in gwei, a billionth of an ETH or POL. You can read the current gas price from a scene, see [Check gas price](scene-blockchain-operations.md#check-gas-price).

Fees on Ethereum can be high enough to matter for small purchases. Polygon fees are a tiny fraction of that, which is why most in-world transactions happen on Polygon. See [Second Layer](second-layer.md).

### How transactions are confirmed

Ethereum is secured by _validators_ that stake ETH, a system known as _proof of stake_. Roughly every 12 seconds, one validator is chosen to propose a new block containing pending transactions, and the others check it and vote on it.

A transaction isn't instant:

1. It's sent to the network and waits in a pool of pending transactions.
2. A validator includes it in a new block, usually within a few seconds, but longer if the fee offered is low compared to demand.
3. Other validators verify the block and add it to their copy of the chain.
4. After about two _epochs_ (roughly 13 minutes on Ethereum), the block becomes _finalized_ and can no longer be reverted.

Polygon follows a similar model with much shorter block times. See the [Polygon PoS documentation](https://docs.polygon.technology/pos/) for details on how it reaches finality.

## Reorgs and confirmations

Until a block is finalized, there's a small chance that the network replaces the most recent block or two with a different version, an event called a _reorg_. Transactions in the replaced blocks go back to the pending pool and may end up in a later block, or be dropped.

Each block added after the one containing a transaction counts as a _confirmation_ of it. The more confirmations a transaction has, the less likely it is to be reverted.

If a transaction has consequences in your scene that happen off the blockchain, such as unlocking a door or granting points, keep reorgs in mind:

* Waiting for more confirmations, or for finality, makes the result very reliable, but players wait longer to see it.
* Reacting after a single confirmation feels fast, but in rare cases the transaction may be reverted, and you may need to reverse its consequences in your scene.

## Smart contracts

A smart contract is code (its methods) and data (its state) that live at a specific address on the blockchain.

* A contract's methods are always called through a transaction whose _to_ field is the contract's address. That code can call other contracts, which creates further transactions whose _from_ field is the calling contract.
* A contract can't act on its own or on a timer. Everything it does starts from a transaction that calls one of its methods.
* A contract's code is public, so anyone can verify its rules.

You can use smart contracts to make transactions depend on custom conditions. For example, players could bet on the outcome of a game, and the contract pays out as soon as the result is reported to it.

Every token is defined by a smart contract that specifies its properties and what can be done with it. You can find the address of every contract Decentraland maintains in the [list of Decentraland smart contracts](https://contracts.decentraland.org/addresses.json), and read their verified code on [Etherscan](https://etherscan.io/) or [Polygonscan](https://polygonscan.com/). To call a contract from your scene, see [Scene Blockchain Operations](scene-blockchain-operations.md#import-a-contract-abi).

## Token standards

* **ERC-20** is the standard for fungible tokens, where every unit is identical. MANA follows this standard. A custom ERC-20 token can represent large quantities of identical game items, or a ticket that grants access to an area.
* **ERC-721** is the standard for non-fungible tokens (NFTs), where every unit is unique. LAND, NAMEs, Wearables and Emotes follow this standard. A single ERC-721 contract can represent many items, each with its own properties.

Because tokens are held in a player's wallet, they go with the player from scene to scene. Any scene can choose whether and how to react to any token a player owns.

## Test networks

Before you deploy a smart contract, a new token, or a scene that relies on transactions, make sure it has no bugs or gaps that someone could exploit. Test networks let you do this with tokens that have no real value:

* **Sepolia** is the test network for Ethereum. Get free Sepolia ETH from a faucet, such as the [Alchemy Sepolia faucet](https://www.alchemy.com/faucets/ethereum-sepolia).
* **Amoy** is the test network for Polygon. See [Second Layer](second-layer.md#try-the-polygon-testnet).

See [Using the Ethereum test network](scene-blockchain-operations.md#using-the-ethereum-test-network) to run your scene against a test network.
