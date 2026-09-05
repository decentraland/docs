---
description: Managing your scene projects
---

# Manage scenes

Each of your available scenes is shown as a card. Open the card to edit that scene, from there you can preview it or publish it too.

## Create a scene

Click the **Create** button and select **New Scene** to create a new scene. You'll then be asked to choose a template, there are a few options, including an **Empty Scene**.

Then you'll be asked to name your scene, and choose a location to save it.

Once you confirm these steps, the scene project will be created. This may take a minute or two, as it downloads dependencies and sets up a folder on your local machine with everything it needs. When done, your scene will be opened in the [Scene Editor](scene-editor-essentials.md).

Click the three dots on an already created scene's card and click **Duplicate** to make a copy of an existing scene.

To rename your scene's display name, open it and click the pencil icon to change the **Name** field and other properties.

To rename the scene's folder on disk, click the three dots on the scene's card and select **Rename Folder**. Enter the new folder name and confirm. The folder name must be valid for your operating system and must not collide with an existing folder in the same location.

## Import a scene

The scene manager displays the scenes it finds in the default path on your machine.

To add a scene that is elsewhere on your local disk, click **Import scene** and find the path to the project folder. The imported scene will now be available as a new card in the scene manager screen.

The imported scene does not get moved in your local disk.

{% hint style="warning" %}
**📔 Note**: Do not manually rename or move the folder of an imported scene directly from your file manager. The Scene Editor will no longer be able to find the imported scene in its new path.
{% endhint %}

Scenes you created on the older web editor are stored in the cloud. To work on these scenes from the desktop Scene Editor, you must export the scene from the Web Editor, unzip it into a folder, and then import it on the desktop Scene Editor. See [Migrate from Web Editor](migrate-from-web.md) for more details.

## Delete a scene

In the scene selector screen, press the _three dots_ icon and select _Delete from My Scenes_.

This removes the scene from your Scene Editor home screen. By default it doesn't delete the files from your machine, but the confirmation dialog includes a checkbox to **also delete the scene's files from your computer**.

By default, projects created via the Scene Editor are kept inside a `Scenes` folder in the Creator Hub's application data directory. You can change this location from the app's **Settings**, and you can navigate to a project's folder by clicking the three dots on its card and selecting **Open Folder Location**.

## Managing Worlds

If you own a Decentraland NAME or ENS domain, you can publish scenes to your [Decentraland World](../../sdk7/publishing/publishing-options.md#decentraland-worlds). Worlds appear in the Scene Editor just like regular scenes, and you can publish to them using the same **Publish** button.

A World has its own metadata (name, description, and thumbnail), separate from the metadata of each scene published to it. In Worlds with a single scene it's kept in sync with the scene's metadata automatically, in Worlds with multiple scenes it can only be edited in the **Manage** tab. See [World metadata vs scene metadata](../publish/publish-scene.md#world-metadata-vs-scene-metadata).

### Visualizing storage space

Scenes published to Worlds count against a storage budget that is shared across all the Worlds owned by your wallet. The budget is calculated from your holdings: each Decentraland NAME or LAND parcel you own grants 100 MB, and every 2,000 MANA held in your wallet grants an additional 100 MB.

You can check your used and remaining storage budget in two places:

- The **Manage** section of the Creator Hub shows how much of your total budget is used and your total storage capacity. Click **View Details** for a breakdown of how your MANA, LAND, and NAME holdings add up.

<img src="../../../.gitbook/assets/world-storage-budget.png" width="300" />

- The **Worlds** tab of the [Builder](https://decentraland.org/builder/worlds).

### Undeploying scenes

If you need to free up storage space, you can undeploy scenes from the World Content Server. This can be done through the Builder interface, which allows you to easily undeploy scenes to release storage space.

For Decentraland NAME holders, if you exceed your allocated storage space (for instance, through asset sales or transfers to another wallet), you will be provided with a 48-hour window to address the situation. Failure to do so will result in your Worlds becoming inaccessible after this grace period.

To regain access to a blocked World, you can either:

- Acquire more MANA, Decentraland NAMEs, or LANDS to increase your storage capacity
- Undeploy existing scenes from the World Content Server to free up storage space

See [Worlds size limits](../../sdk7/projects/kinds-of-project.md#size-limits) for detailed information on how storage capacity is calculated.
