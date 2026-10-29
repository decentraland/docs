---
description: The basic ideas behind blockchains, tokens, network fees and smart contracts in Decentraland.
---

# About the Blockchain

This page explains the ideas behind the blockchain features of Decentraland. You don't need any of it to play, but it helps make sense of terms like _NFT_, _gas_ or _Polygon_ when you come across them.

## What is a blockchain?

A blockchain is a shared record of who owns what. Instead of living on one company's servers, it's copied across thousands of computers around the world, and they all have to agree on every change. Changes are grouped into _blocks_ that are added one after another, forming a _chain_.

Because no single party controls that record, nobody can quietly change it or take your things away. That's why your Wearables, Emotes, NAMEs and LAND truly belong to you.

Decentraland uses the blockchain only to record ownership. Everything that changes in real time, like where your avatar is standing or what's happening in a game, is handled off the blockchain.

## Ethereum and Polygon

Decentraland uses two blockchain networks:

* **Ethereum**: one of the most widely used blockchains. LAND, Estates and NAMEs live here.
* **Polygon**: a network that runs alongside Ethereum and is faster and cheaper to use. Most Wearables and Emotes live here.

See [Transactions in Polygon](transactions-in-polygon.md) and [Paying and Getting Paid](paying-and-getting-paid.md#what-is-mana) for what this means in practice.

## Tokens

Anything recorded on a blockchain as something you can own and transfer is called a _token_. There are two main kinds:

* **Fungible tokens** are all identical, like coins: any one MANA is worth the same as any other. MANA, ETH and POL are fungible tokens. On Ethereum and Polygon, most of them follow a standard called _ERC-20_.
* **Non-fungible tokens (NFTs)** are each unique. Every LAND parcel has its own location, every NAME is a different word, and every copy of a Wearable has its own number. Most NFTs follow a standard called _ERC-721_.

Because tokens are kept in your wallet, not in any one place, they go with you everywhere in Decentraland. Every scene can see which tokens you own and can react to them, for example by letting you into a private area if you own a certain item.

Read [What are NFTs](https://decentraland.org/blog/technology/what-are-nfts/) on the Decentraland blog to learn more.

## Wallets

Tokens are held in wallets. Each wallet has a public _address_, which identifies it, and a secret _private key_, which proves you control it. Every change to the blockchain has to be approved, or _signed_, with the private key of the wallet it comes from.

In Decentraland, your wallet address is your identity. See [Your Account and Wallet](get-a-wallet.md) for how wallets work when you sign in with a social account, an email address or a crypto wallet.

## Transactions and network fees

A _transaction_ is any change to the blockchain, such as sending MANA, buying a Wearable or merging LAND parcels into an Estate.

Each transaction has a small cost called a _network fee_ or _gas fee_. It pays the computers that run the network for processing it. Fees rise and fall with demand: when many people are using the network at once, they go up. They're paid in the network's own currency: ETH on Ethereum and POL on Polygon. They're measured in _gwei_, a billionth of an ETH or POL.

On Polygon, the Decentraland DAO pays the fee for many Marketplace transactions. See [Gas-free transactions](transactions-in-polygon.md#gas-free-transactions-in-the-marketplace-and-builder).

Transactions aren't instant. They usually take seconds on Polygon and up to a minute or so on Ethereum, and once confirmed they **can't be undone**.

## Smart contracts

A _smart contract_ is a small program that lives on the blockchain and runs exactly as written. Every token is defined by a smart contract that sets its rules: who can create it, how it can be transferred, and so on.

Smart contracts are public, so anyone can read their code and check what they do. You can find the address of every contract Decentraland uses in the [list of Decentraland smart contracts](https://contracts.decentraland.org/addresses.json), and look any of them up on [Etherscan](https://etherscan.io/) or [Polygonscan](https://polygonscan.com/).

## dApps

A _dApp_ (decentralized application) is an app built on top of smart contracts. The [Marketplace](https://decentraland.org/marketplace), the [Builder](https://decentraland.org/builder), the [DAO](https://decentraland.org/dao) and the [Account page](https://decentraland.org/account/) are all dApps.

## For creators

If you're building a scene that reads from the blockchain or asks players to make transactions, see [Blockchain Basics](../../creator/sdk7/blockchain/blockchain-basics.md) in the creator docs.
