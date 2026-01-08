---
description: Play Videos in your scene
---

# Video Screen

To play pre-recorded or streamed videos on a screen on your scene, use the Video Player [Smart Item](smart-items.md).

![](../../../.gitbook/assets/video-player-item.png)

## General settings

These settings are relevant for all scenarios, either if you're playing videos or streaming.

![](../../../.gitbook/assets/video-automatic.png)

You can configure the volume of the video's audio. Note that the audio from the stream is not positional, it is heard at an even volume through all your scene.

The **Default Media Source** dropdown lets you pick between two different kinds of sources:

* **Video URL**: Fetch a video or a stream from a URL or local video file
* **Live Stream**: Use Decentraland's free streaming infrastructure to display a stream. To use this, you must also include an [Admin tools](../live-ops/scene-admin.md) smart item in your scene.

## Play Videos

You can Play pre-recorded videos from either:

* **Local files**: Upload a video file as part of the scene, then point the _URL_ field to the path to that file.
* **Stream from a URL**: Point to a live or pre-recorded stream on the web, for example from Vimeo. See [streaming videos](video-screen.md#streaming-videos)

The timing of when the Video Player smart item plays a video can depend on different things:

*   **Automatic**: The video starts playing as soon as the scene loads. For this, set the default media source dropdown to **Video URL** and paste a URL directly into the **Default Video URL** field.

    ![](../../../.gitbook/assets/video-automatic.png)
* **Triggered by an admin**: A [Scene admin](../live-ops/scene-admin.md) who's currently in the scene can use the Admin UI to paste a video URL and play it for all players who are currently in the scene.
*   **Based on player actions**: Define an Action of type **Play Video Stream**. This lets you trigger the playing of the video as the result of interacting with some other smart item, like walking into a room, or pushing a button. See [Smart Items - Advanced](smart-items-advanced.md).

    ![](../../../.gitbook/assets/video-from-action.png)

In all cases you configure the video to either loop or play once.

{% hint style="warning" %}
**📔 Note**: If too many videos are playing at the same time in your scene, some will be paused by the engine. The priority is determined based on proximity to the player, direction of the camera and size of the screen. The maximum amount of simultaneous videos depends on the player's quality settings.

* Low: 1
* Medium: 5
* High: 10

We also recommend starting to play the video when the player is near or performs an action to do that. Starting to play a video when your scene is loaded far in the horizon will unnecessarily affect performance while players visit neighboring scenes.
{% endhint %}

## Multiple Video Screens

You can play the same video on multiple screens at the same time. To do this, you must edit the advanced properties of the Video Player smart item.

{% hint style="warning" %}
**📔 Note**: Avoid having more than one different video playing at the same time, as that hurts performance a lot.

If you simply paste the same URL on two video players, the engine won't know these are the same video, and will play them both separately. Follow the steps below to configure the second video player to play the same video as the first one.
{% endhint %}

1. Add Two Video Player smart items to the scene, one for each screen.
2. Configure the first one normally, as described in the [Play Videos](video-screen.md#play-videos) section.
3. On the second video player, remove the **Video Player** component.

![](../../../.gitbook/assets/delete-video-player.png)

{% hint style="warning" %}
**📔 Note**: This step is important, otherwise the second video player will be processed by the engine, even if not visible.
{% endhint %}

4. Still on the second video player, open the **Material** component, expand the **Texture** section, and select the **Video Source Entity** dropdown to point to the first video player.

![](../../../.gitbook/assets/point-to-video.png)

You can do the same for any number of video players, as long as you configure each one to point to the same video player.

When doing [live streaming](../live-ops/live-streaming.md), both screens will also display the same stream.

{% hint style="info" %}
**💡 Tip**: The steps above can also be repeated with an item that has a **Swap Material** component, to turn any 3D model into a video screen. Configure the **Texture** section inside the **Swap Material** component to point to the video player entity.
{% endhint %}

## About Video Files

The following file formats are supported:

* _.mp4_
* _.ogg_
* _.webm_

Keep in mind that a video file adds to the total size of the scene, which makes the scene take longer to download for players walking into your scene. The video size might also make you go over the [scene limitations](../../sdk7/optimizing/scene-limitations.md), as you have a maximum of 15 MB per parcel to use. We recommend compressing the video as much as possible, so that it's less of a problem.

## Live streaming

For end-to-end live streaming, see [Live Streaming](../live-ops/live-streaming.md).

### Streaming from other sources

You can also stream videos using other streaming infrastructures. To do this, simply configure the Video Player smart item to use the **Video URL** media source, and paste the stream URL into the **Default Video URL** field.

The source of the streaming must be an _https_ URL (_http_ URLs aren't supported), and the source should have [CORS policies (Cross Origin Resource Sharing)](https://en.wikipedia.org/wiki/Cross-origin_resource_sharing) that permit externally accessing it. This means you can't stream a video from YouTube or similar sites, as these only allow displaying their content in their branded HTML widget. See [About External Streaming](../../sdk7/media/video-playing.md#about-external-streaming) for options and tips.

There are a number of options for streaming video. The simplest option is to use a managed hosting provider like [Vimeo](https://vimeo.com/), [Livepeer Studio](https://livepeer.studio/) or [Serraform](https://serraform.gitbook.io/streaming-docs/guides/decentraland-playback) where you pay a fee to the provider to manage all the streaming infrastructure.

Read [Setting up OBS for successful streaming](../../sdk7/media/video-playing.md#setting-up-obs-for-successful-streaming) for tips on how to best stream content into Decentraland.
