---
description: >-
  How sign-in works in Decentraland, the wallet behind every account, playing as
  a guest, and how to use your wallet outside Decentraland.
---

# Your Account and Wallet

## What is a wallet?

A digital wallet is what holds your things in Decentraland: your Wearables, Emotes, NAMEs, LAND and MANA. Ownership of these items is recorded on a public blockchain, and the wallet is what proves they belong to you.

Every Decentraland account has a wallet behind it, but **you don't need to own crypto or set up a wallet yourself**. If you sign in with a social account or an email address, a wallet is created for you automatically. And you can buy Wearables, Emotes and NAMEs with [Marketplace Credits](paying-and-getting-paid.md#marketplace-credits) or a card without ever thinking about it.

Each wallet has two parts:

* **A wallet address**: a public identifier made of `0x` followed by 40 letters and numbers. It's your ID in Decentraland, and you can share it freely so that others can send you things.
* **A private key**: the secret that controls the wallet. Whoever has it can move everything the wallet holds, so it must never be shared.

## Ways to sign in

When you open Decentraland, you can sign in in any of these ways:

| Sign-in method | What happens behind the scenes |
| --- | --- |
| **Google, Discord, Apple or X** | A wallet is created for you by [Magic](https://magic.link/), a wallet service that Decentraland works with. You sign in with your social account and never have to see the wallet. |
| **Email** | You enter your email address and type in the code you receive. A wallet is created for you by [thirdweb](https://thirdweb.com/), another wallet service. |
| **A crypto wallet** (MetaMask, Coinbase Wallet, WalletConnect and others) | You use a wallet you already have. You hold the private key yourself. |
| **Play as guest** | A guest account is created on your device. See [Playing as a guest](#playing-as-a-guest). |

Hardware wallets like Ledger and Trezor also work: [connect them to MetaMask](https://support.metamask.io/more-web3/wallets/how-to-connect-a-trezor-or-ledger-hardware-wallet/) and sign in with MetaMask.

{% hint style="warning" %}
**📔 Note**: Each sign-in method has its own wallet. Signing in with Google and signing in with the same email address using an email code gives you **two different accounts**, each with its own avatar and items. Always sign in the same way you did the first time.
{% endhint %}

## Playing as a guest

On desktop and on the mobile app, choose **Play as guest** to jump in without an email or a wallet. You pick a ready-made avatar and you're in.

A guest account has a wallet like any other account, but it's tied to the device you created it on. You come back as the same guest each time you open the app, but you can't sign in to it from another device until you add an email address.

Guests can explore, customize their avatar, chat with people nearby, and buy, sell, gift and tip with MANA. Some features need a full account, and trying to use them will offer you an upgrade:

* Earning, buying and spending Marketplace Credits
* Claiming a NAME
* Voice chat and calls
* Creating or joining communities
* Starting a new private conversation (you can still reply to one someone else starts)

### Upgrade a guest account

To keep your guest account and unlock everything, add an email address to it:

1. Try to use any feature that needs a full account. A popup offers you to upgrade. On mobile, you can also choose **Add email** from your profile.
2. Enter your email address.
3. Type in the code you receive by email.

Your avatar, name, friends and wallet stay the same. From then on, sign in with that email address and a code instead of choosing **Play as guest**, on any device.

## Find your wallet address

* **In Decentraland**: open your profile. Your wallet address appears under your name.
* **Online**: go to the [Account page](https://decentraland.org/account/), open **Wallets**, and choose **Receive** from the **More actions** menu of either MANA card to copy your address.
* **In a crypto wallet**: if you sign in with MetaMask or similar, your address is shown in that wallet's app or extension.

## Use your wallet outside Decentraland

If you signed in with a crypto wallet, it's already yours and works in any app that supports it.

If Decentraland created the wallet for you when you signed in with **Google, Discord, Apple or X**, you can still take full control of it. Export its private key and import it into another wallet app, such as MetaMask. You'll then see the same address and the same items there, and can use them in any app or exchange.

{% hint style="danger" %}
**Anyone with your private key has full, irreversible control of everything in your wallet.** Decentraland staff will never ask for it. Store it offline, somewhere only you can reach, and never paste it into a website or chat.
{% endhint %}

### Export the key of a social-login wallet

1. Go to the [Account page](https://decentraland.org/account/) and sign in the same way you sign in to Decentraland.
2. Open the **Security** tab. It only appears for accounts created with Google, Discord, Apple or X.
3. Click **Reveal private key**. Magic's secure reveal page opens in a new tab.
4. Sign in on Magic's page using the same method you use for Decentraland, and copy your private key.

### Email and guest accounts

Exporting the key of a wallet created by signing in with an **email code** isn't available on the Account page at the moment. The same goes for **guest** accounts, which become email accounts when you upgrade them. Your MANA and items are still yours: you can send MANA to any address from the Account page, and sell or gift items from inside Decentraland. See [Paying and Getting Paid](paying-and-getting-paid.md#use-the-mana-youve-earned).

### Import the key into another wallet

Most wallet apps let you add an account from a private key. In MetaMask, see [Import an account](https://support.metamask.io/start/use-an-existing-wallet/). Your Decentraland login keeps working as before; the other app simply gives you a second way into the same wallet.

## Delete your account

If you signed in with a social account or an email code, you can delete your Decentraland account from the **Delete account** tab of the [Account page](https://decentraland.org/account/). It can't be undone, and you lose:

* Your profile: username, avatar, bio and display name
* Social connections: friends list and blocked users
* Marketplace activity: open listings, purchase history and offers
* Unspent Marketplace Credits and rewards
* Favorites and history: saved places, recent activity and event RSVPs
* Notification settings and history

{% hint style="warning" %}
**📔 Note**: Deleting your account can make you lose access to the items in your wallet (Wearables, Emotes, NAMEs, LAND and MANA) forever. If you signed in with Google, Discord, Apple or X, [export your private key](#export-the-key-of-a-social-login-wallet) before you delete your account. If you signed in with an email code, the key can't be exported yet, so move or sell anything you want to keep first.
{% endhint %}

Accounts that use your own crypto wallet, like MetaMask, can't be deleted this way, because you hold the keys yourself. To stop using one, simply disconnect it.

## Keep your account safe

* Never share your private key or your wallet's recovery phrase (also called a seed phrase) with anyone.
* Decentraland will never offer you free MANA or ask you to "verify" your wallet. Messages that do are scams.
* Read every confirmation before you approve it. Decentraland always asks you to confirm before anything leaves your wallet.

See [Security](../faqs/security.md) for more tips on spotting scams.
