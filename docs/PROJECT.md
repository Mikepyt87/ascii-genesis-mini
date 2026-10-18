# About ASCII Genesis - Mini

ASCII Genesis - Mini is a small decorative ocean made from colored text characters. It runs directly on the **Waveshare ESP32-S3-Touch-LCD-1.47**, with no Raspberry Pi or operating-system installation. Plug it into USB power and the ocean starts. Internet is optional and is used for firmware updates.

## What you will see

Fish and other sea creatures cross a dark blue screen above a gently rolling seabed. Plants sway while their roots stay attached to the moving ground, and small bubbles rise through the water. The collection includes 28 creature and vehicle designs, from a tiny three-line fish to a whale, submarine, lionfish, and peacock mantis shrimp.

The Mini uses a small 320 × 172 screen, so it leaves space between the full drawings and limits the ordinary scene to three swimmers. Large creatures wait for enough room. Tap the screen for Pause, New World, Parade, and Settings. The parade gives each design a complete crossing on its own.

The [visual tour](SCREENSHOTS.md) shows the screen, and the [Ocean Library](OCEAN-LIBRARY.md) documents every design and the scenery. The drawings are stylized artwork; creature names do not imply a biological simulation.

## Mini and Raspberry Pi editions

| Detail | Mini: this repository | [Original Raspberry Pi edition](https://github.com/Mikepyt87/ascii-genesis) |
| --- | --- | --- |
| Hardware | ESP32-S3 with integrated 1.47-inch touch LCD | Pi 4 with separate 7.9-inch HDMI/USB touch display |
| Display | 320 × 172 bitmap renderer | 1280 × 400 browser renderer |
| Installation | Flash the board over USB once | Install the Pi desktop application |
| Everyday operation | USB power; no computer needed | Raspberry Pi OS Desktop |
| Normal swimmers | Up to three, separated by vertical bands | Its own larger scene and population rules |
| Collection | 28 designs, both directions | Shared artwork collection, with different behavior |
| Parade | Up to two; original order; named; 105 seconds | Staggered lineup; two minutes |
| Ecosystem | Decorative motion and habitat labels | Food web, schools, encounters, and visitors |
| Lighting/narration | No day/night or AI narration controls | Separate lighting and optional narration features |
| Updates | Wi-Fi firmware download after you choose Install | Update desktop icon follows the Pi repository |
| Enclosure files | No Mini enclosure supplied here | Pi case and legs supplied in that project |

The projects share artwork and history, but have different setup steps and software. Mini releases do not update a Pi, and Pi source updates cannot be flashed onto a Mini.

## What is included here

This repository contains the complete device application, configured LCD and touch drivers, Wi-Fi setup page, wireless updater, standalone browser preview, original and upstream artwork, source licenses, build checks, and release packaging. No neighboring checkout is needed to build it.

It does not include Bluetooth updates, SD-card storage features, sound, battery-management features, a phone app, or a Mini 3D-printed enclosure. The SD slot does not expand working memory. USB power and the supported board are enough to run the ocean.

## Where it came from

The Mini grew from [ASCII Genesis](https://github.com/Mikepyt87/ascii-genesis). Its artwork builds on Asciiquarium by Kirk Baucom, with most upstream art credited to Joan Stark and expanded biodiversity by Claudio Matsuoka. The early display exploration was inspired by OpenGhost / xanderchinxyz. The Mini became a separate repository at v0.1.6 so its hardware, flashing, and update instructions could stand on their own. [Full credits](../CREDITS.md).
