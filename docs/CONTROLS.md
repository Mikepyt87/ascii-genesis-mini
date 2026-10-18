# Touch controls and creature parade

Tap the ocean and lift your finger. Four buttons appear along the bottom. They fade after eight seconds so the ocean has room. When controls are hidden, the first tap reveals them; a second tap selects a button.

| Button | What happens |
| --- | --- |
| Pause / Resume | Freezes or resumes the ocean, including plants, ground, bubbles, and an active parade |
| New World | Cancels the parade and starts a fresh, unpaused ocean |
| Parade / Return | Starts the creature parade, or ends it early and returns to your preserved ocean |
| Settings | Opens Wi-Fi setup, version information, and update controls |

## Parade

For the collection’s drawings, colors, and movement rules, see the [Mini Ocean Library](OCEAN-LIBRARY.md). Normal swimmers move at 9–18 pixels per second in v0.1.7; the parade keeps its own timing below.

The Mini shows **all 28 designs in their original order**, facing right, with up to two at a time. Each crosses in six seconds, with the next entering after three seconds when the two drawings fit in separate bands. The full sequence lasts **105 seconds: 1 minute 45 seconds**. The counter appears at the top left. Names appear at the top right on separate lines matching the upper and lower bands. From v0.1.10, names are 50% larger and use brighter text; the counter stays separate.

Tall neighboring drawings that cannot share the screen wait for one another, so their drawings and bobbing never overlap. The regular ocean is held in place during the parade: its creatures, camera position, bubbles, pending arrivals, and random state are preserved. It resumes automatically at the end. Return ends the parade early without resetting that ocean.

Pause also pauses the parade. If you start it while paused, tap Resume. Opening Settings does not cancel the parade; it continues unless paused. If you want to watch every design, return to the ocean promptly or pause before opening Settings.

## Settings

The top shows the installed firmware version and whether Wi-Fi is online. Set up Wi-Fi opens the phone setup screen. Check for updates checks the published channel. If a newer compatible version is found, that button offers Install and restart. Back to ocean closes the settings screen.

## What is different from Raspberry Pi?

The Mini has its own 320 × 172 bitmap renderer, touch driver, Wi-Fi setup, and firmware updater. It has three ordinary swimmer slots and an ordered parade with up to two creatures. Startup and New World randomize the normal ocean’s opening creatures, directions, positions, and habitat; the parade order stays fixed. The Pi uses a 1280 × 400 browser display and its separate ecosystem/parade. Its scrolling speed is unchanged by the Mini's faster scrolling. The Mini does not include Pi narration, hunting, schooling, desktop launchers, or the Pi enclosure.
