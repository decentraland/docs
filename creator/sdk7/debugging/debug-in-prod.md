---
description: How you can debug your scene that is running inside Decentraland
---

# Debug in Production

When running a scene that's already deployed to land in Decentraland, there are a number of things you can try out to debug it.

### Before deploying

#### Preview

Before you deploy your scene to Decentraland, make sure the scene runs well in preview using the latest version of the Decentraland SDK. See [debug in preview](../sdk7/debugging/debug-in-preview.md).

#### The test server

You can deploy scenes to a test server as a staging environment, before publishing them to the live content servers. This server is not frequented by any players that visit Decentraland normally. To enter this server you must manually write its URL, but keep in mind that it's not a private environment.

See [The test server](../sdk7/publishing/publishing.md#the-test-server) for details.

### Quick reload

If you need to reload the scene you're standing on, write the following into the chat and push enter:

`/reload`

### About the publishing pipeline

Keep in mind that after each publish, an internal process optimizes all 3D models before they can be rendered. This takes around 15 minutes. If you visit the scene before this is done, the scene may appear broken. This process may run even if the 3D models were all previously published.

You can check the current state of this process for your scene using [this tool](https://decentraland.github.io/opscli/). If the conversion is complete, all three variations of the assets should have green lights.

### Scene logs

When using Decentraland normally, it's not possible to open the console to check for debug messages. To make the console available, you must open decentraland with the `scene-console` parameter. You can then toggle the console by pressing the backtick key on your keyboard: **\`**. This key is left of the 1 key on most english language keyboards.

To open Decentraland with the `scene-console` parameter, either:

* Write the following deep link into a browser window: `decentraland://?position=0,0&scene-console`. This will open the Decentraland desktop application if you have it installed.
* Write the following on the command line:
  * **macOS**: `open Decentraland.app --args --position 0,0 --scene-console true`
  * **winOS**: `"C:\Users\[YOUR-USER]\Downloads\Decentraland_windows64\Decentraland.exe" --position 0,0 --scene-console true`

{% hint style="info" %}
\*\*💡 Tip\*\*: Change the \*\*position\*\* parameter to the coordinates of your scene, to load directly into your scene.
{% endhint %}

When running Decentraland with the \`

scene-console\`, you can open the console in three ways:

* Click the ![](../../../.gitbook/assets/console-icon.png) icon on the top-right corner
* Press the **\`** key for a short console
* Press Shift + **\`** to open a larger view of the console

Keep in mind that messages from each active scene will be logged to the console, so some of the things you see in the console might not be relevant to your scene.

### Report a bug

If you encounter a problem that is not with your scene, but instead with the Decentraland SDK in general, please see [Report a bug](../sdk7/debugging/report-bug.md).
