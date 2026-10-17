# ASCII Genesis - Mini

A small, touch-controlled ASCII aquarium for the **Waveshare ESP32-S3-Touch-LCD-1.47**. The screen runs sideways at **320 × 172**. The ESP32 is built into the display board; no Raspberry Pi is needed.

**This repository is for the Mini only.** The larger Raspberry Pi aquarium has its own [repository and instructions](https://github.com/Mikepyt87/ascii-genesis).

## Start here

| What you want to do | Follow this guide |
| --- | --- |
| Put the aquarium on a new board | [First installation: download, USB port, flash, and first startup](docs/INSTALL.md) |
| Update an aquarium that already works | [Wireless updates and version checks](docs/UPDATES.md) |
| Connect home Wi-Fi or a phone hotspot | [Wi-Fi setup, step by step](docs/WIFI.md) |
| Use Pause, New World, Parade, and Settings | [Touch controls and parade](docs/CONTROLS.md) |
| Fix a blank screen, connection problem, or failed update | [Troubleshooting and USB recovery](docs/TROUBLESHOOTING.md) |
| Preview it or build from source | [Developer setup and checks](docs/DEVELOPMENT.md) |
| Understand the move from the original repository | [Repository transition and existing boards](docs/MIGRATION.md) |

## Required hardware

- **Waveshare ESP32-S3-Touch-LCD-1.47**, including its capacitive touch screen, 16 MB flash, and 8 MB PSRAM. Check the full model name: the non-touch LCD-1.47 is different.
- A USB **data** cable and a computer for the first installation. A charge-only cable will power the screen but cannot install firmware.
- A USB power source for normal use.
- Optional: home Wi-Fi or a phone hotspot operating at **2.4 GHz** for updates.

No microSD card, soldered headers, API key, Raspberry Pi OS, or Pi desktop installer is required. The aquarium runs without internet. An SD card does not add RAM and is not used by this firmware.

## What it does

The ocean includes 28 colored creature and vehicle designs, plants rooted to the scrolling ground, bubbles, six habitat labels, and space between full creature drawings. It keeps content away from the screen's rounded corners. The Mini is a decorative aquarium; the larger Pi edition has its own food web and other features.

Tap the water to reveal **Pause · New World · Parade · Settings**. Controls fade after eight seconds. The parade shows all 28 designs in order, one at a time, then returns to the ocean you left. A full parade takes about **3 minutes 44 seconds**. [Full controls guide](docs/CONTROLS.md).

Source firmware version: **0.1.6**. Use a numbered release from [Releases](https://github.com/Mikepyt87/ascii-genesis-mini/releases); a source-code ZIP is not installable firmware. The release page identifies which version is actually published.

## Quick update for an existing board

1. Connect the aquarium to home Wi-Fi or a 2.4 GHz hotspot.
2. Tap **Settings → Check for updates**.
3. When offered a newer version, tap **Install** and leave power connected through the restart.
4. Wait at least 30 seconds after the ocean returns, then confirm the version in Settings.

Boards on **v0.1.2 or v0.1.3 need USB recovery first** because those versions cannot follow GitHub's long download addresses. Boards on v0.1.4/v0.1.5 receive the v0.1.6 transition through the old channel; v0.1.6 and later check this repository. See [the transition guide](docs/MIGRATION.md).

## Source layout

| Folder | Contents |
| --- | --- |
| `firmware/` | ESP-IDF 5.5.2 application, display/touch driver, Wi-Fi and updater |
| `preview/` | Local browser simulation; no real passwords or flashing |
| `art/` | Shared-source ASCII drawings, original additions, and artwork license |
| `tools/` | Asset generator, manifest generator, and software checks |
| `docs/` | Installation, Wi-Fi, controls, updates, recovery, and development guides |

## Credits and licenses

ASCII Genesis builds on **Asciiquarium by Kirk Baucom**, with most upstream art credited to **Joan Stark** and expanded biodiversity by **Claudio Matsuoka**. Original project additions include the mantis shrimp and other creatures. **OpenGhost / xanderchinxyz** inspired the early display exploration. See [CREDITS.md](CREDITS.md) and [THIRD-PARTY.md](THIRD-PARTY.md).

The firmware is [GPL-3.0-or-later](LICENSE). Artwork is [GPL-2.0-or-later](art/LICENSE.txt); the display driver and bitmap font retain their own notices.
