---
description: How to publish my project?
---

# Publishing

### Before you begin

Make sure of the following:

* Your scene complies with all of the [scene limitations](../sdk7/optimizing/scene-limitations.md). Most of these are validated each time you run a preview of your scene.
* You have a [Metamask](https://metamask.io/) account, with your LAND parcels assigned to it.
*   You own the necessary amount of adjacent LAND parcels or a Decentraland NAME. Otherwise you can purchase LAND in the [Market](https://market.decentraland.org) or a NAME in the [Builder](https://decentraland.org/builder/names).

    \{% hint style="warning" %\} **📔 Note**: Multi-parcel scenes can only be deployed to adjacent parcels. \{% endhint %\}

{% hint style="danger" %}
**❗Warning**: When planning live events, make sure you don't make last minute changes to the scene right before the event.

After each publish, an internal process optimizes all 3D models before they can be rendered. This takes around 15 minutes. If you visit the scene before this is done, the scene may appear broken. This process runs even if the 3D models were all previously published.
{% endhint %}

### Check scene data

When deploying, the CLI reads information from the _scene.json_ file to determine where to deploy your scene.

Open your scene's _scene.json_ file and complete the following data:

* **title**: The title is displayed on the UI under the mini-map, whenever players enter your scene. It also shows on the teleport popup.
* **description**: A description of what players will find in your scene. This is displayed on the teleport popup.
* **navmapThumbnail**: An image that represents your scene. This is displayed on the teleport popup. The image should be a _.png_ or _.jpg_ image of a recommended size of _228x160_ pixels.
* **Parcels**: The coordinates of the parcels that will be occupied by your scene
* **Base**: The coordinates of the parcel that will be considered the \[0,0] coordinate of the scene. If your scene has multiple parcels, it should be the bottom-left (South-West) parcel.
* **spawnPoints**: A set of coordinates inside the scene (relative to the scene's base parcel) where players spawn. By default players spawn at the _0,0,0_ location of the scene (bottom-left corner). Use this to start players in a specific location, or set a region to prevent players from overlapping with each other when they first appear.
* **tags**: A set of tags that describe your scene. These help players explore Decentraland by making it easier to find content they're interested in. [See the list of available tags](../sdk7/projects/scene-metadata.md#tags).
* **rating**: This is used to classify the content of your scene based on its appropriateness for different age groups (`T` for Teens or `A` for Adults). It helps in filtering content for players.

{% hint style="warning" %}
**📔 Note**: See [scene metadata](../sdk7/projects/scene-metadata.md) for more details on how to set these parameters.
{% endhint %}

### To publish the scene

#### Using the Scene Editor in Creator Hub

The Scene Editor in Creator Hub provides an easy way to publish your scenes. Make sure you've [installed the Creator Hub](../scene-editor/get-started/editor-installation.md).

1. Open your scene project.
2. Click the **Publish** button on the top-right corner.
3. A prompt will ask if you want to publish to a **WORLD** or to **LAND**.
   * Select **PUBLISH TO WORLD** to make your scene available in one of your [WORLDs](../worlds/about.md). Then select which of your NAMEs or ENS Domains to publish to.
   * Select **PUBLISH TO LAND** if you own land, or have been given deploy permissions by an owner. Then select the parcels where you want it deployed on the map. Parcels where you are allowed to deploy are shown in pink.
   * Select **Alternative servers** to publish to the [test server](publishing.md#the-test-server) or a [custom server](publishing.md#custom-servers).

![](../../../.gitbook/assets/publish-options.png)

4. This opens a new tab on your browser, showing details about the upload. Approve the transaction.
   * For LAND on a Metamask browser account, confirm the deployment. Then approve the transaction on the Metamask browser extension.
   * For LAND linked to a wallet you can use via Wallet Connect, click **Connect wallet**, then scan the QR code with your mobile device and follow the steps on Wallet Connect.

#### Via the CLI

1. Log into your Metamask account with the same public address associated with your parcels in Decentraland.
2. Run `npm run deploy` from the scene's folder.

{% hint style="info" %}
\*\*💡 Tip\*\*: If there are files in your project folder that you don't want to deploy, list them in the \_.dclignore\_ file before deploying.
{% endhint %}

3. A browser tab will open, showing what parcels you're deploying to. Click **Sign and Deploy**.
4. Metamask opens, notifying you that your signature is requested. Click **Sign** to confirm this action.

{% hint style="info" %}
**💡 Tip**: If you're implementing a continuous integration flow, where changes to your scene are deployed automatically, then you can set the `export DCL_PRIVATE_KEY` environment variable to the private key of an account that has deploy permissions.
{% endhint %}

{% hint style="info" %}
**💡 Tip**: `npm run deploy` runs a `npm run build`, which checks the scene for type errors more strictly than running `npm run start`. If these errors can't be avoided (eg: they happen in an external library) and they don't impact the scene, you can use `npm run deploy --skip-build` to skip the `npm run build` step and deploy the scene as it is.
{% endhint %}

### Publishing to Worlds

To publish your scene to a Decentraland World, you need to own a Decentraland NAME or ENS domain. See [Publishing Options](publishing-options.md#decentraland-worlds) for information on how to obtain one.

#### Configure scene.json

You need to specify under what **name** your deployment is to be made. Add the following section in your `scene.json`:

```json
{
	"worldConfiguration": {
		"name": "my-name.dcl.eth"
	}
}
```

The **name** specified in the `scene.json` can be either a Decentraland NAME or an ENS Domain. It must be owned by the wallet signing the deployment, or by any wallet that has been given permission via Access Control Lists (ACL).

Keep the following in mind:

* The wallet signing the deployment must own the NAME specified in the `scene.json` file
* The scene has no parcel limitations (since January 2023)
* All Worlds are automatically listed on the Places page unless you opt out as detailed below

#### Opt-out from Places listing

If you wish to opt-out from your Worlds being indexed in Places, you can add the following section in your `scene.json`:

```json
{
	"worldConfiguration": {
		"name": "my-name.dcl.eth",
		"placesConfig": {
			"optOut": true
		}
	}
}
```

#### Using the Scene Editor in Creator Hub

1. Open your scene project.
2. Click the **Publish** button on the top-right corner.
3. Select **PUBLISH TO WORLD**.
4. Select which of your NAMEs or ENS Domains to publish to.

#### Via the CLI

Use the following command:

```bash
npm run deploy -- --target-content https://worlds-content-server.decentraland.org
```

Once you run the command, you will be prompted to sign the deployment with your wallet and a set of validations will be executed to allow or reject the scene.


#### Accessing a World

Once a scene is uploaded to the Worlds server, you can access it using the Decentraland Explorer with the following URL: `decentraland://?realm=NAME.dcl.eth`, where `NAME` should be replaced with the Decentraland NAME or ENS Domain you deployed to.

With Decentraland already open, you can also jump to a world by typing the `/goto NAME.dcl.eth` command in the chatbox.

See [Make discoverable](../sdk7/projects/make-discoverable.md) for more information on how to make your World discoverable.

#### Migrating a World to Genesis City

If you are a LAND owner and wish to deploy a World scene to Genesis City, you can do so by re-deploying your scene to the decentralized Catalyst network, which is the content server for Genesis City.

Things to remember:

* Remove the `worldConfiguration` section from `scene.json`
* The size limitation for Worlds (dynamic based on holdings) is different from that for LAND parcels (15MB per parcel), so make sure your scene is sized correctly for deployments to Genesis City!

### Publish from a hardware wallet

Instead of storing your LAND tokens in a Metamask account, you may find it more secure to store them in a hardware wallet device, such as a [Ledger](https://www.ledger.com/) or a [Trezor](https://trezor.io/), that's physically plugged in to your computer.

If you're using one of these devices, you can link the hardware wallet to Metamask to enable signing messages, while keeping the tokens more secure. See [this article from Metamask](https://metamask.zendesk.com/hc/en-us/articles/360020394612-How-to-connect-a-Trezor-or-Ledger-Hardware-Wallet) for instructions to connect your account.

Once your hardware wallet can be used via Metamask, you can deploy following the same steps as if your tokens were on a Metamask account.

### Scene overwriting

When a new scene is deployed, it overwrites older content that existed on the parcels it occupies.

If a scene that takes up multiple parcels is only partially overwritten by another, all of its parcels are either overwritten or erased.

Suppose you deployed your scene _A_ over two parcels _\[100, 100]_ and _\[100, 101]_. Then you sell parcel _\[100, 101]_ to a user who owns adjacent land and that deploys a large scene (_B_) to several parcels, including _\[100, 101]_.

Your scene _A_ can't be partially rendered in just one parcel, so _\[100, 100]_ won't display any content. You must build a new version of scene _A_ that only takes up one parcel and deploy it to only parcel _\[100, 100]_.

### What are the content servers

The content servers are a network of community-owned servers with a filesystem that's content-addressed, meaning that each file is identified by its contents, not by an arbitrary file name.

We use the content servers to host and distribute all scene content in a similar way to BitTorrent, keeping the Decentraland network distributed.

1. The content servers store and distribute all of the assets required to render your scenes.
2. The `npm run deploy` command links these assets to the LAND parcel specified in your **scene.json** file. Whenever you redeploy your scene, the CLI will update your LAND smart contract, if needed, to point to the most recent content available on the content servers.

The information on each copy of the server is verifiable, as each scene is signed by the LAND owner's hash. This means that someone hosting a copy of the server won't be able to tamper with the content to display something illegitimate. The community can also vote to approve or remove any of these servers using the DAO.

### The test server

You can deploy content to the test catalyst server to run full tests with multiple users, the surrounding scenes, and an environment that is identical to production. The test server is identical to all other catalyst servers. The difference is that content deployed to this server isn't propagated to the others. However, content deployed to other servers does get propagated to this server, so surrounding scenes should look as they will in production.

{% hint style="warning" %}
**📔 Note**: To deploy to parcels in the test server, you must have the same permissions required to deploy to those parcels in the main network.
{% endhint %}

Players are never directed to this server, the only way to access it is to explicitly provide a URL parameter to connect to it.

If you're working in a confidential project that you don't want to unveil until launch, note that the test server is relatively hidden from players, but anyone explicitly using the test server's URL could potentially run into it.

#### Via the CLI

To deploy to the test server, run:

`npm run deploy -- --target peer-testing.decentraland.org`

To enter the content server, add `&CATALYST=peer-testing.decentraland.org` to the Decentraland URL

_https://play.decentraland.org/?CATALYST=peer-testing.decentraland.org_

### Custom servers

You can deploy content to a custom server that doesn't belong to the official DAO-maintained network of catalyst servers. To do this, you don't need to own any LAND or NAME tokens, as you can configure the server to use any validation logic you prefer to control who can deploy where. Custom servers can choose to include content from the official servers (which you can overwrite), or start from a blank slate and publish entirely new content.

See [How to run your own Catalyst Node](../tutorials/how-to-run-a-catalyst.md) for more info on what you can do with your own server and how to set it up.

{% hint style="warning" %}
**📔 Note**: Players will need to manually type in a URL to access your custom server. Certain validations from services like the [rewards server](../rewards/getting-started.md) or the [quests server](../deprecated/quests/overview.md) might fail in these contexts, as often these services require that the request comes from an official server.
{% endhint %}

Players are never directed to this server, the only way to access it is to explicitly type in the URL to connect to it.

#### Via the CLI

To deploy to a custom server, run:

`npm run deploy -- --target <CUSTOM SERVER DOMAIN>`

The URL to enter your deployed scene on your custom server will depend on the domain where it's being hosted.

### Verify deployment success

Once you deployed your scene, these changes will take a few minutes to be propagated throughout the various content servers in the network. If you enter Decentraland right after deploying, you might still see the previous version of your content, depending on what realm you enter.

After you sign to authorize the deployment of your scene, the signing dapp will start displaying confirmations that the new version of your content has been propagated throughout all of the servers in the network.

You'll see a list of each of the servers that make up Decentraland's content network. For each server, it specifies the timestamp of the last uploaded change on that parcel. Each server refers to a different realm. You can see how these server names map to realm names in the [catalyst monitor screen](https://decentraland.github.io/catalyst-monitor/).

You can also obtain this information at any time by running the following command on the command line console:

`npx @dcl/opscli pointer-consistency --pointer 0,0`

{% hint style="warning" %}
**📔 Note**: Use the coordinates of your scene instead of `0,0`. If your scene has multiple parcels, any one of its parcels will produce the same output. If the coordinates start with a negative number, add a `\` at the start of the coordinates to prevent the `-` character from being misinterpreted by the command line.
{% endhint %}

### Automatic deployments

If you regularly make changes to your scene's content and want to implement a streamlined publication pipeline, you can automate the deployment of your scene via a GitHub action.

For this, you must first store your scene in a GitHub project. You can then set a [GitHub action](https://docs.github.com/en/actions) with the following script, which runs every time there's a merge to the `main` branch. The script installs any dependencies, builds the project and then deploys it to Decentraland.

```yaml
name: Deploy to DCL PROD

on:
  push:
    branches:
      - main

env:
  DCL_PRIVATE_KEY: ${{ secrets.DCL_PRIVATE_KEY }}

jobs:
  deploy:
    name: Deploy
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Install npm packages
        run: |
          npm install
      - name: Build scene
        run: |
          npm run build:ci
      - name: Deploy scene
        run: |
          npm run deploy:prod
```

> Important: For this process to run, you must set a wallet's private key as an environment variable in GitHub, which is used to sign the deployment. As always, be very careful with keeping private keys secure. Do NOT use the private key of the account that actually owns the land tokens, as that would pose significant security risks. Instead, delegate operator rights to a disposable wallet that owns no valuable tokens. If this private key is ever leaked, you can easily revoke those operator rights from the account and set up a new wallet.
