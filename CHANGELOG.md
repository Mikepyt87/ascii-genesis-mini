# Mini version history

Numbered firmware downloads are on [Releases](https://github.com/Mikepyt87/ascii-genesis-mini/releases). This history also records versions published before the Mini moved into its own repository. A source commit is not an installable firmware update.

## 0.1.15

- Adds Balance Angelfish, Steadfast Marlin, and Spark Wrasse to the normal ocean and parade (31 designs).
- Adds distinct three-second entrance celebrations, in both directions, with particles kept clear of fish and controls. Pause freezes the effects.
- Adds optional private personal editions: local setup profile, on-device dedication, signature opening fish, and persistence through normal OTA updates. No recipient information is included in the public release.
- Keeps existing swimming and scenery speeds.

## 0.1.14

- Keeps the shore crab, reef lobster, peacock mantis shrimp, and violet octopus on the scrolling seabed in the normal ocean and parade.
- Anchors visible feet to the terrain and removes their swimming bob. Bottom arrivals wait for a clear bottom band.
- Keeps the original parade order and six-second crossings. Neighbors take turns when the bottom lane needs room; the full parade now takes 114 seconds.
- Adds browser and native checks for both directions, terrain contact, spacing, complete crossings, and grounded parade placement.

## 0.1.13

- Fixes creatures disappearing when the waterline drops: the line now waits above existing swimmers instead of clearing their slots or moving their lanes.
- Reserves clear bands below the intended surface depth for new arrivals, with full upward-bob clearance for existing swimmers.
- Adds regression checks that track each creature through surface transitions until its full drawing leaves the screen.

## 0.1.12

- Reviews all 28 regular designs for a consistent size relationship, shared across Pi, Mini, and Mid.
- Shrinks the jellyfish from 15 × 7 to 6 × 4 characters, and reduces the shore crab, reef lobster, and peacock mantis shrimp.
- Makes the reef shark about 15% longer and the humpback whale about 11% longer without adding height.
- Preserves the original parade order, timing, movement rules, and sparse bubble limits. See [creature proportions](docs/CREATURE-SIZES.md) for all drawing sizes.

## 0.1.11

- Adds occasional surface stretches with sailing boats, surfacing and spouting whales, and a Nessie-like sea monster, one visitor at a time.
- Adds castles and submerged ruins anchored to the scrolling seabed, contained within the bottom third of the screen.
- Uses sparse bubbles from passing creatures or the seabed: at most two, with 7–12 seconds between emission attempts. Bubbles rise and disappear at the waterline.
- Keeps the ordered creature parade separate from surface visitors and landmarks.

## 0.1.10

- Makes parade names 50% larger and brighter in the top-right corner. Both full names fit beside the counter and above the creatures.
- Preserves the original parade order, six-second crossings, two-creature limit, and existing parade duration.

## 0.1.9

- Makes Asciiquarium and its creators, along with OpenGhost's display inspiration, prominent near the top of the GitHub README.
- Uses ocean consistently in the project description, guides, device status messages, and phone Wi-Fi setup. Original project names and historical credits are preserved.
- Keeps the display layout, creatures, ordered parade, touch controls, and Wi-Fi update behavior unchanged.

## 0.1.8

- Faster parade: six-second crossings, with up to two creatures in separate bands. Tall neighbors wait when needed. The full parade takes 1 minute 45 seconds, down from 3 minutes 44 seconds.
- Keeps all 28 designs in their original order and displays their names at the top right.
- Randomizes the regular ocean's starting creatures, directions, positions, and habitat at startup and New World. Parade order remains fixed.
- Preserves pause, Return, the normal ocean, and the existing Wi-Fi/update flow.

## 0.1.7

- Regular swimmers move three times faster: 9–18 pixels per second instead of 3–6.
- Scrolling remains 3.6 pixels per second; parade timing remains 224 seconds.
- Added the complete Mini Ocean Library with all 28 designs, both directions, palettes, dimensions, credits, and actual Mini behavior.
- Added renderer illustrations, a visual tour, project comparison, and contribution guide.

## 0.1.6

- First standalone Mini repository, with separate installation, Wi-Fi, recovery, development, and release guides.
- Added Parade/Return: all 28 designs, one at a time, with the normal ocean preserved.
- Moved future firmware checks to this repository; a matching transition image remains available through the old channel.

## 0.1.5

- Added the peacock mantis shrimp.
- Increased Mini scenery scrolling to 3.6 pixels per second. Pi scrolling stayed unchanged.

## 0.1.4

- Fixed GitHub update downloads that failed on long signed addresses.
- Improved update status and manifest identity checking. A successful check can report that the current version is installed.

## 0.1.2–0.1.3

- Adopted the ASCII Genesis - Mini name, anchored plants to the scrolling ground, improved creature spacing, enlarged setup Wi-Fi text, and added rounded-corner margins.
- Improved phone setup, clock synchronization, and reconnection behavior.
- These versions need USB recovery for the long-address update-download problem; see [Migration](docs/MIGRATION.md).

## 0.1.1

- Fixed the AXS5106L touch read sequence. Touch operation was confirmed on the board.

## 0.1.0

- Initial device firmware with the configured JD9853 LCD, ocean rendering, phone Wi-Fi setup, and update support.
