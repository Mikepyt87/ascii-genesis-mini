# Moving from ASCII Genesis to the Mini repository

## Which project is which?

| Project | Repository | Installation |
| --- | --- | --- |
| ASCII Genesis | [ascii-genesis](https://github.com/Mikepyt87/ascii-genesis) | Raspberry Pi OS Desktop, 7.9-inch HDMI screen, Pi desktop installer |
| ASCII Genesis - Mini | [ascii-genesis-mini](https://github.com/Mikepyt87/ascii-genesis-mini) | ESP32-S3-Touch-LCD-1.47, USB firmware first, then optional wireless updates |

Do not run the Pi installer for the Mini. Do not flash Mini binaries to the Pi. Each project now has its own guides, development files, and update process.

## Existing Mini boards

There is no new hardware or account requirement. Your ocean and saved Wi-Fi details remain usable.

1. A Mini running v0.1.4 or v0.1.5 still checks the original repository's `esp32-147-stable` channel.
2. That channel offers **v0.1.6** using an old-repository download URL that those versions already trust.
3. The transition binary is the same application published by the new Mini repository, with the same SHA-256 and board/project identity.
4. After booting v0.1.6, the firmware checks `ascii-genesis-mini` for future releases. No re-pairing or manual repository address is needed.
5. The old channel stays at the transition release for boards that have not moved yet. Future Mini releases are published only in the new repository.

Boards still running v0.1.2/v0.1.3 need [USB installation](INSTALL.md) because of their existing GitHub download bug.

## What was kept stable

The board ID, embedded project name `ascii_genesis_147`, two 6 MiB application slots, touch/display pin mapping, NVS Wi-Fi namespace, versioned asset filenames, and release tag format are preserved. The new firmware's repository URL changes after the transition. A complete merged USB image is a separate recovery route and can overwrite saved settings.

## Source and artwork history

The standalone Mini starts from the Mini code and shared artwork in original repository commit `93edc82417ec08ebcb6a79afab48ff8e2ff5e8dc`. This repository keeps source and third-party notices needed for those assets. Original history and prior releases remain available in the old repository; the Pi renderer and ecosystem stay there.

The first standalone version adds the Mini parade. It does not change the Pi's scrolling speed, parade, or runtime behavior.

## The 4-inch edition

[ASCII Genesis — Mid](https://github.com/Mikepyt87/ascii-genesis-mid) runs on the GUITION ESP32-4848S040, with a 480 × 480 touch display and a 320 × 320 logical ocean. It shares the artwork, but has its own USB image and wireless update channel. Its parade lasts 99 seconds. Mini firmware must not be used on Mid.
