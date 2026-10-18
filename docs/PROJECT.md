# About ASCII Genesis - Mini

ASCII Genesis - Mini is a small decorative ocean made from colored text characters. It runs directly on the **Waveshare ESP32-S3-Touch-LCD-1.47**, with no Raspberry Pi or operating-system installation. Plug it into USB power and the ocean starts. Internet is optional and is used for firmware updates.

## What you will see

Fish and other sea creatures cross a dark blue screen above a gently rolling seabed. Plants sway while their roots stay attached to the moving ground, and small bubbles rise through the water. The collection includes 28 creature and vehicle designs, from a tiny three-line fish to a whale, submarine, lionfish, and peacock mantis shrimp.

The Mini uses a small 320 × 172 screen, so it leaves space between the full drawings and limits the ordinary scene to three swimmers. Large creatures wait for enough room. Tap the screen for Pause, New World, Parade, and Settings. The parade keeps the original order and gives each design a complete crossing, with up to two visible at a time.

The [visual tour](SCREENSHOTS.md) shows the screen, and the [Ocean Library](OCEAN-LIBRARY.md) documents every design and the scenery. The drawings are stylized artwork; creature names do not imply a biological simulation.

## Surface visits and landmarks

The journey occasionally rises to a visible waterline, then returns to deeper water. A surface stretch lasts about two minutes in a cycle of four to five minutes. The camera eases into and out of it over twelve seconds. A sailing boat, a surfacing whale with a short animated water spout, and a long-necked sea monster each get a thirty-second crossing window. Only one surface visitor appears at a time. Their order varies with the world seed; the creature parade keeps its original order.

Castles and submerged ruins belong to fixed world coordinates, so they move with the seabed. These new landmarks stay in the bottom third of the screen. They are background scenery rather than extra swimmers. The sea monster uses two poses adapted from the original Asciiquarium drawing; the compact boat, whale, spout, castle, and ruins are ASCII Genesis additions. See the repository credits for authors and licenses.

The surface visitors and landmarks are separate from the 28 regular creature and vehicle designs. They do not add entries to the parade. Pause freezes the scene; New World starts a new journey. During the parade, the surface scenes are hidden and their normal-world clock is held, then resumes afterward.

The Mini shares a two-bubble limit across the scene, with 7–12 seconds between emission attempts. [New artwork and exact behavior](SURFACE-SCENES.md).

## Mini and Raspberry Pi editions

| Detail | Mini: this repository | [Original Raspberry Pi edition](https://github.com/Mikepyt87/ascii-genesis) |
| --- | --- | --- |
| Hardware | ESP32-S3 with integrated 1.47-inch touch LCD | Pi 4 with separate 7.9-inch HDMI/USB touch display |
| Display | 320 × 172 bitmap renderer | 1280 × 400 browser renderer |
| Installation | Flash the board over USB once | Install the Pi desktop application |
| Everyday operation | USB power; no computer needed | Raspberry Pi OS Desktop |
| Normal swimmers | Up to three, separated by vertical bands | Its own larger scene and population rules |
| Collection | 28 designs, both directions | Shared artwork collection, with different behavior |
| Parade | Up to two; original order; named; 114 seconds | Staggered lineup; two minutes |
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
