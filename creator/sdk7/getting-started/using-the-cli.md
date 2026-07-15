---
description: How to use the Decentraland CLI to run, deploy, etc
---

# Using the CLI

To build scenes for Decentraland you can either use:

* The [Creator Hub](../../scene-editor/get-started/editor-installation.md)
* The Command Line Interface (CLI)

Both tools allow you to compile and preview your scene in an "off-chain" development environment. After testing your scene locally, you can upload your content to the content server, linking it with your LAND or WORLD.

Although the Scene Editor in the Creator Hub is easier to use, the CLI allows you more flexibility, and can be easily used in automated processes.

{% hint style="warning" %}
**📔 Note**: The Scene Editor runs the same command-line operations behind the curtains.
{% endhint %}

{% hint style="info" %}
**💡 Tip**: See [Installation guide](../../scene-editor/get-started/editor-installation.md) for instructions on how to install the Creator Hub.
{% endhint %}

## Before you Begin

To deal with the scene via the command line, please install the following dependencies before you run CLI commands with the scene:

* [Node.js](https://nodejs.org) (version 20 or later)

## Initiate a new project

Run `npx @dcl/sdk-commands init` on an empty folder to populate it with the default files of a Decentraland [scene](../projects/scene-metadata.md) project.

To start from a different kind of project, use the `--project` flag. For example, to create a [smart wearable](../projects/smart-wearables.md) project:

```bash
npx @dcl/sdk-commands init --project smart-wearable
```

The available options for `--project` are `scene-template` (the default), `px-template`, `smart-wearable`, and `library`.

## Update the SDK version of a scene

Run the following command on the scene folder:

```bash
npm i @dcl/sdk@latest
```

You can confirm that it worked by checking the `package.json` file for the scene, and looking for the `@dcl/sdk` version there.

## Run a preview

Run `npm run start` on the root level of a scene, workspace, or smart wearable project to open a preview in the Decentraland Desktop client.

```bash
npm run start
```

To preview your scene on the [Decentraland mobile app](../building-for-mobile/) instead, run `npm run start -- --mobile` (alias `-- -m`). The CLI prints a QR code that opens the scene on a phone connected to the same Wi-Fi network as your computer. See [Preview on mobile](../building-for-mobile/preview-on-mobile.md) for the full guide.

```bash
npm run start -- --mobile
```

See [preview scenes](preview-scene.md) for details and special options when running a preview.

## Build

Run `npm run build` to build your project. Decentraland scenes are written in TypeScript, but they are built to minified JavaScript when published. See [coding scenes](https://github.com/decentraland/docs-creator/blob/main/sdk7/getting-started/coding-scenes.md) for more details.

The build command is optional, as it also runs in the background before deploying (although you can add a flag to skip it).

The build command runs more rigurous type checks than those that run with `npm run start`, running it can sometimes be helpful to debug a scene.

## Deploy a scene

Run `npm run deploy` to publish your scene to Decentraland. This command opens a browser window where you can sign with your wallet to authorize the deployment.

See [publishing](../publishing/publishing.md) for details and special options when publishing a scene.

## Troubleshooting

If you run into issues, see the [troubleshooting](../debugging/troubleshooting.md) section.
