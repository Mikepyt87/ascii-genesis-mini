# Mini version history

Numbered firmware downloads are on [Releases](https://github.com/Mikepyt87/ascii-genesis-mini/releases). This history also records versions published before the Mini moved into its own repository. A source commit is not an installable firmware update.

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

- Initial device firmware with the configured JD9853 LCD, aquarium rendering, phone Wi-Fi setup, and update support.
