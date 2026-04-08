---
description: Preview your scene on a real mobile device from the Creator Hub or the CLI.
---

# Preview your scene on mobile

You can preview your scene directly on the Decentraland mobile app from the Creator Hub or from the command line. This is the only reliable way to confirm that your UI, input handling, and performance hold up on a real device.

## Prerequisites

* The Decentraland mobile app installed on your phone — see the [download links](README.md#get-the-mobile-app).
* The phone and your development machine must be on the **same local network** (Wi-Fi). The preview is served from your computer; the QR code links to a LAN URL.

## Option A — From the Creator Hub

1. Open your scene in the Creator Hub.
2. Click the dropdown next to the **Preview** button and choose **Show QR Code for Mobile**.
3. Scan the displayed QR code with your phone's camera. The link opens the Decentraland mobile app and loads your scene preview.

<!-- TODO: add screenshot of the "Show QR Code for Mobile" dropdown menu (creator/images/building-for-mobile/preview-qr-creator-hub.png) -->

## Option B — From the command line

From the root of your scene project, run:

```bash
npm run start -- --mobile
```

The CLI prints a QR code in the terminal that points to your scene's LAN URL. Scan it with your phone to load the scene in the Decentraland mobile app.

<!-- TODO: add screenshot of the QR code printed in the terminal (creator/images/building-for-mobile/preview-qr-cli.png) -->

{% hint style="info" %}
**💡 Tip**: When you pass `--mobile`, the desktop explorer is not also launched. If you want to test on both at once, run `npm run start` in one terminal for desktop and `npm run start -- --mobile` (on a different port if needed) for mobile.
{% endhint %}

## Hot reload

Just like with desktop preview, the mobile preview reloads automatically when you change scene files. You don't need to re-scan the QR code after every edit.

## Troubleshooting

* **QR code doesn't open the app** — make sure the Decentraland app is installed and that you've opened it at least once on the device.
* **Phone can't reach the preview server** — confirm the phone and the dev machine are on the same Wi-Fi network. Some corporate networks isolate clients; use a personal hotspot or a different network if so.
* **Scene loads on the phone but looks different from desktop** — that is expected. Use this as the moment to validate your [safe area](safe-area.md), [UI sizing](ui-best-practices.md#sizing), and [input bindings](input-on-mobile.md).

## Related

* [Preview Your Scene](../getting-started/preview-scene.md)
* [Using the CLI](../getting-started/using-the-cli.md)
* [Get featured on mobile Discover](get-featured.md)
