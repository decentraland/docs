---
description: Managing your scene projects
---

# Manage scenes

Each of your available scenes is shown as a card. Open the card to edit that scene, from there you can preview it or publish it too.

### Create a scene

Click **Create scene** to create a new scene. You'll then be asked to choose a template, there are a few options, including a blank scene.

Then you'll be asked to name your scene, and choose a location to save it.

Once you confirm these steps, the scene project will be created. This may take a minute or two, as it downloads dependencies and sets up a folder on your local machine with everything it needs. When done, your scene will be opened in the [Scene Editor](scene-editor-essentials.md).

Click the three dots on an already created scene's card and click **Duplicate** to make a copy of an existing scene.

To rename your scene, open it and click the pencil icon to change the **Name** field and other properties.

### Import a scene

The scene manager displays the scenes it finds in the default path on your machine.

To add a scene that is elsewhere on your local disk, click **Import scene** and find the path to the project folder. The imported scene will now be available as a new card in the scene manager screen.

The imported scene does not get moved in your local disk.

{% hint style="warning" %}
**📔 Note**: Do not manually rename or move the folder of an imported scene directly from your file manager. The Scene Editor will no longer be able to find the imported scene in its new path.
{% endhint %}

Scenes you created on the older web editor are stored in the cloud. To work on these scenes from the desktop Scene Editor, you must export the scene from the Web Editor, unzip it into a folder, and then import it on the desktop Scene Editor. See [Migrate from Web Editor](migrate-from-web.md) for more details.

### Delete a scene

In the scene selector screen, press the _three dots_ icon and select _Delete_.

This removes the scene from your Scene Editor home screen, but doesn't delete the files from your machine.

If you wish to delete the project files, you must do this manually. By default projects created via the Scene Editor are kept inside a `.decentraland` folder under your user directory. You can navigate here by clicking the three dots on a project card and selecting **Open folder**.

### Managing Worlds

If you own a Decentraland NAME or ENS domain, you can publish scenes to your [Decentraland World](../../worlds/about.md). Worlds appear in the Scene Editor just like regular scenes, and you can publish to them using the same **Publish** button.

#### Visualizing storage space

The [Builder](https://builder.decentraland.org/worlds) serves as the go-to place for visualizing your allocated space and monitoring how much is consumed by each Decentraland NAME or ENS Domain. You can:

* View your total storage capacity
* See how much space each World is using
* Monitor when your storage capacity is exceeded
* Access comprehensive information about your Worlds, whether they are hosted on Decentraland NAMEs or ENS Domains

#### Undeploying scenes

If you need to free up storage space, you can undeploy scenes from the World Content Server. This can be done through the Builder interface, which allows you to easily undeploy scenes to release storage space.

For Decentraland NAME holders, if you exceed your allocated storage space (for instance, through asset sales or transfers to another wallet), you will be provided with a 24-hour window to address the situation. Failure to do so will result in your Worlds becoming inaccessible after this grace period.

To regain access to a blocked World, you can either:
* Acquire more MANA, Decentraland NAMEs, or LANDS to increase your storage capacity
* Undeploy existing scenes from the World Content Server to free up storage space

See [Worlds size limits](../../sdk7/projects/kinds-of-project.md#size-limits) for detailed information on how storage capacity is calculated.
