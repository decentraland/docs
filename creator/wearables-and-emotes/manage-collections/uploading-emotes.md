---
description: Guidelines to upload Emotes to the Editor
---

# Uploading Emotes

Once you export your emote, you’ll have to upload it to the builder. This document will cover the process of uploading emotes.

### **Uploading Your File**

Remember that you need to create a collection before you can upload your file. If you don’t know how to do that, check [Creating a Collection](https://github.com/decentraland/docs-creator/blob/main/creator/wearables-and-emotes/manage-collections/creating-a-collection.md). To upload your emote, just drag and drop the file on the _**New Item**_ window or browse your computer. It will automatically detect if the file has any animation, identifying it as an emote.

![](<../../../.gitbook/assets/01_new_item (1).png>)

Drag and drop your animation file to upload it.

You will be asked to enter a name for your emote, define its rarity, the category and the play mode. Below the thumbnail is shown the number of animation clips in your file, the length of the animation in seconds, the length in frames and the frame rate.

![](../../../.gitbook/assets/upload_emote.png)

### **Uploading Emotes Using a .zip File**

If the emote has sound (_mp3_ or _ogg_) it must be zipped with the `.glb`. After that, just drag and drop the `.zip` to the builder. Also, it is possible to add a `.json` file along with the other assets in the same `.zip` to add name, description, rarity, category, play mode and/or tags. These are the definitions for each:

* `name`: Name of the Emote
* `description`: Description of your Emote (no more than 64 characters in total, counting spaces)
* `category`: Category of the Emote ("dance", "stunt", "greetings", "fun", "poses", "reactions", "horror", "miscellaneous")
* `rarity`: Rarity of the Item ("unique", "mythic", "legendary", "epic", "rare", "exotic", "uncommon", "common")
* `play_mode`: Simple or Loop Animation ("simple", "loop")
* `tags`: Tags for easy finding in the marketplace.

To add those definitions to the emote just create a text file, naming it **emote.json** and add the following lines as the example:

```
{
  "name": "Tennis Shot",
  "description": "Show me you can do tennis",
  "category": "fun",
  "rarity":"epic",
  "play_mode": "simple",
  "tags":["tennis", "emote", "shot"]

}

```

This way the builder is going to take all the .json information and it automatically to the emote.

**Rarity**

Check the rarity chart in [here](https://github.com/decentraland/docs-creator/blob/main/creator/wearables-and-emotes/manage-collections/creating-a-collection.md#rarity).

### **Category**

Choose the category that best describe your emote.

* Dance
* Stunt
* Greetings
* Fun
* Poses
* Reactions
* Horror
* Miscellaneous

### **Play Mode**

There are currently two play modes:

* _**Play Once**_: means that your emote will only play once. After that the avatar will return to _Idle_ position.
* _**Loop**_: the emote will keep playing in loop until the user input another action.

### **Custom Thumbnails**

For emotes, you don’t have to upload any images since the editor already has a built in tool to create a thumbnail. Just select the frame that best represents the action.

People should be able to identify what the animation is about through the thumbnail. If a front shot isn’t good enough, try rotating the model, zoom in or out, pan up or down, pick any frame from your clip. It’s really important that you select the best shot!

![](../../../.gitbook/assets/Edit_thumbnail.gif)

Rotate, zoom in or out, pan up and down. Use the tools to get the best shot of your animation!

### The Editor

Once you set the thumbnail, you will have the editor open. This is where you can check if the animation is playing well since a 3D avatar will be performing it.

![](../../../.gitbook/assets/editor.png)

By clicking on the icon at the lower left you will be able to edit the avatar. Click on the cilinder icon on the lower right to check if you animation is staying within the boundaries of height and space.

![](../../../.gitbook/assets/edit_avatar.gif)

The icon at the botton left allows you to edit the avatar.

![](../../../.gitbook/assets/boundaries.gif)

Cylinder icon shows the boundaries for the animation.

You can also edit the emote’s name, thumbnail, category, rarity and play mode, as well as add a description of the animation and add tags to it. Click on _**Save**_ when you are done.

* **Description:** This is a brief statement describing your item that will be displayed in the marketplace.
* **Utility** Describe the in-world utility of the Wearable or Emote.
* **Tags:** Tags are simply descriptive words that users can use when searching or filtering for items. These are relevant to competitions or events!

![](../../../.gitbook/assets/editor2.png)

## Testing in World

Even after testing the animation in the editor, it’s important to check how it’s actually going to look like and behave in Decentraland. To test it in world, go to the Collections tab, select the desired collection and it will show all the items you have in it. Click on See in Decentraland.

\
\\

![](../../../.gitbook/assets/getting_started.png)

\
\\

{% hint style="info" %}
You will be asked to choose if you want to test it in an Empty Parcel or in Genesis Plaza. Selecting Empty Parcels will teleport you to a place without too much content, which will load faster. Selecting Genesis Plaza will take you to the main plaza.
{% endhint %}

\
\\

![](../../../.gitbook/assets/choice.png)

\
\\

{% hint style="info" %}
After choosing, a new tab will be open in your browser with a message informing you that you are about to use a custom Catalyst. Click on TRUST PEER-TESTING.DECENTRALAND.ORG to continue.
{% endhint %}

\
\\

![](../../../.gitbook/assets/custom_catalyst.png)

\
\\

{% hint style="info" %}
After that, you will get a pop-up asking to open the Decentraland Explorer. Once the explorer is running, click on Jump Into Decentraland.
{% endhint %}

\
\\

![](../../../.gitbook/assets/monoco.png)

\
\\

{% hint style="info" %}
Once in world, press I to open the backpack and, in the emotes tab, select the emote to test.
{% endhint %}

\
\\

![](../../../.gitbook/assets/testing.gif)

\
\\

### **Before Publishing**

Make sure to add a nice description and verify if all the information and settings are right. Double check the thumbnail too. If you’ve filled all the information necessary you will see Ready to Submit as the status of your item. Now your emote is ready to be published!

![](../../../.gitbook/assets/last.png)

The Ready to Submit status means that your file is ready be published!
