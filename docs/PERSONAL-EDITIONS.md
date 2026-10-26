# Private personal editions

A personal Mini uses the regular Mini firmware plus a small profile saved on that device. The profile supplies a name, a dedication, and one signature fish. It is not compiled into the public firmware or sent to GitHub. Normal OTA updates preserve it in NVS. A factory erase or full USB image can remove it, so keep your private profile backup. This is local personalization, not encrypted storage against physical access.

## Prepare a profile

Create a JSON file in a private folder outside this repository. The format is:

```json
{"name":"Example","dedication":"Thank you for everything you brought to the team.","fish":0}
```

Use 1-12 printable ASCII characters for the name and 1-320 for the dedication. Use ordinary straight quotes and hyphens. Fish 0 is Balance Angelfish; 1 is Steadfast Marlin; 2 is Spark Wrasse. For comfortable reading, keep the message under 250 characters. The screen wraps it at 46 characters.

## Install on the Mini

1. Install v0.1.15 or newer through the normal Mini update process.
2. On the device, open Settings > Set up Wi-Fi with phone. Join the password-protected setup network shown on that device.
3. Open **http://192.168.4.1**. Tap **Install a personal edition**. This page is only available on the device's setup network while setup is open.
4. Open your private JSON file and copy all the text, including the braces. Paste it into **Private profile**, then tap **Save personal edition**.
5. Return to the ocean on the device. Its name now appears in the header. In Settings, the bottom-right **Dedication** button opens the message; the bottom-left **Back** returns to the ocean.
6. Tap **New World** to start the signature fish in the first lane. Other fish continue to arrive normally.
7. Restart the device and confirm the name and dedication remain. Keep your JSON file as the recovery backup.

Saving a personal profile does not change Wi-Fi credentials. It does not require internet access. The setup server never displays the saved private message back to the phone. A later valid profile replaces the previous one. Avoid posting screenshots containing private names or messages to public issues.

## Preview before gifting

Run the [browser preview](DEVELOPMENT.md) and use **Private edition** to open your JSON file. The preview reads it locally in memory and does not upload it. **Dedication** toggles the message. Reloading clears this preview-only copy. Firmware stores its separate copy on the device.
