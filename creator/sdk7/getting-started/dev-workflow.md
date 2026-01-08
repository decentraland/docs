---
description: Recommended procedure for developing and testing a scene
---

# Development Workflow

This document outlines the steps recommended for developing a scene for Decentraland, from ideation to publishing and beyond.

## Install the Creator Hub

Make sure you have the Decentraland Creator Hub installed.

* [Installation Guide](../../scene-editor/get-started/editor-installation.md)

If you intend to work with code, also make sure you install [Visual Studio Code](https://code.visualstudio.com/).

## Design your experience

Think about how much space you need to take up, what kind of distribution, what kinds of mechanics you want players to be able to carry out, etc. The following documents can serve as a guide:

* [UX & UI Guide](../design-experience/ux-ui-guide.md)
* [Design constraints for games](../design-experience/design-games.md)
* [Scene MVP guidelines](../design-experience/mvp-guidelines.md)

## Where to publish

In Decentraland, content is published to adjacent plots of land in a finite amount of space. Players can freely walk from one to the other. Each scene is its own contained little world, items from one scene can't extend out into another scene, and the code for each scene is sandboxed from all others.

Permission to publish to each of these is controlled via tokens. You don't need land to develop a scene, but you will need access to land once you're ready to publish.

Alternatively, you have the option to publish to Decentraland [Worlds](../../worlds/about.md), which are self-contained and isolated scenes.

The following options are available:

* Rent LAND
* Purchase LAND
* Obtain permissions from a land owner
* Publish to a Decentraland World, see [worlds](../../worlds/about.md) to learn more.

See [Publishing options](../publishing/publishing-options.md) for more details.

## Templates and examples

When creating a new scene, choose amongst several base template scenes that include some basic code and 3d models. Use these to get started faster.

* [Example scenes](https://studios.decentraland.org/resources?sdk_version=SDK7): here you can find a large collection of example scenes, each showcasing different mechanics that you can borrow. You can also clone any of these scenes and use it as a starting point.
* [Helper libraries](https://studios.decentraland.org/resources?sdk_version=SDK7\&resource_type=Library): these can simplify many common tasks.

## Art assets

If you're an experienced artist or you have access to someone who is, you can create custom `.gltf` or `.glb` models for your scene. See [3D model essentials](../../3d-modeling/3d-models.md) for tips on how to create 3D models for Decentraland.

There are many sources to obtain free or paid art assets. For example:

* [IWB Catalog](https://dcl-iwb.co/)
* [SketchFab](https://sketchfab.com/)
* [Clara.io](https://clara.io/)
* [Archive3D](https://archive3d.net/)
* [SketchUp 3D Warehouse](https://3dwarehouse.sketchup.com/)
* [Thingiverse](https://www.thingiverse.com/)
* [ShareCG](https://www.sharecg.com/)
* [CGTrader](https://cgtrader.com)

You can also use Generative AI tools to generate your own 3D models. Check out:

* [Meshy](https://www.meshy.ai/)
* [Luma AI](https://lumalabs.ai/genie)
* [TRipo3D](https://www.tripo3d.ai/app)
* [Rodin](https://hyper3d.ai/rodin)

## Run a local preview

To run a preview of your scene, open a Visual Studio Code window on your project's root folder and click the **Preview** button on the Decentraland tab.

* [Preview your scene](preview-scene.md) for more details.
* Check the [Debug a scene](preview-scene.md#debug-a-scene) for tips on how to debug any issues.

{% hint style="info" %}
**💡 Tip**: When using the Creator Hub, every time you make a change on your scene, the preview is automatically updated. Even while running.
{% endhint %}

## Publish to the test server

Test your scene on the test server (Sepolia testnet) before going to mainnet. You don't need to own any LAND or names to publish to the test server.

See [publishing](../publishing/publishing.md).

## Publish to Decentraland

Once you're happy with your scene and tested it on the test server, it's time to publish to Decentraland. For this, you need to own LAND, a Decentraland NAME, or an ETH ENS name, or have permissions given by someone that does.

See [publishing](../publishing/publishing.md) for instructions on how to do that.

Alternatively, you can publish to [Worlds](../../worlds/about.md), a personal 3D space that doesn't require LAND.

## Promote

Now that your scene is out there, spread the voice! Here are a few ways to do that:

* Share it on social media (#DCL)
* Announce it on [Discord](https://dcl.gg/discord)
* Submit it to be featured on [events.decentraland.org](https://events.decentraland.org/)
* Organize an event in your scene
* Add a spawn point on a high-traffic area that links to your scene

## Iterate

Once your scene has been live for a while and you've gotten feedback from players, you're in a great position to iterate on it!

Update your content with improvements and new features, deploying new versions of your scene to the same coordinates.

## Giving back

If you create a scene, game, or application that you're proud of, consider making it open source! That way others can learn from your code and build on your work. You can also share the whole project in [Awesome Repository](https://github.com/decentraland-scenes/Awesome-Repository).

If you build a reusable piece of functionality, you may want to make it into a library that others can import into their projects.
