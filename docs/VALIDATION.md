# Mini validation record

## Current release: v0.1.15 — October 25, 2026

The three signature fish and entrance effects passed the browser simulation, full parade, spacing, pause/return, documentation, and native C effect checks. The [firmware build and publication](https://github.com/Mikepyt87/ascii-genesis-mini/actions/runs/40260459890) passed. The live update manifest and both application and USB images were downloaded and checked for board ID, versioned URL, byte count (**1,104,576 application bytes**), SHA-256, embedded project/version, and identical application bytes within the USB image at 0x20000.

Private personal profiles and all three dedication layouts were visually checked in the local browser preview. No recipient names or messages are in this repository or its firmware. The profile uses device-local NVS separate from the OTA application slots. Saving/reloading the profile, physical screen/touch behavior, and OTA persistence still need confirmation on the gift boards. A browser simulation and a successful build do not establish hardware behavior.

## Previous release: v0.1.14 — October 18, 2026

Local checks cover all four bottom dwellers in both directions, visible foot contact, scrolling terrain, no swimming bob, reserved bands, and grounded parade placement. Physical-board confirmation of this version is pending. The [automated checks](https://github.com/Mikepyt87/ascii-genesis-mini/actions/runs/39133520206) and [release build](https://github.com/Mikepyt87/ascii-genesis-mini/actions/runs/39133594902) passed for source commit `9e57883c780f9bbccec25cdbc6e0840d6036edf5`, including the native C terrain-contact tests. The public stable manifest, application, and complete USB image were downloaded and verified: correct board, exact versioned URL, embedded project/version, **1,096,848 application bytes**, SHA-256, and matching application bytes in the USB image at 0x20000. The four grounded designs were visually checked in the browser preview.

## Previous release: v0.1.13 — October 18, 2026

Local simulation and renderer checks passed, including creature identity and unchanged swimming lanes throughout waterline transitions. Native waterline clearance is checked alongside the parade geometry. This version has not been confirmed on the physical board. The [automated checks](https://github.com/Mikepyt87/ascii-genesis-mini/actions/runs/39132030404) and [release build](https://github.com/Mikepyt87/ascii-genesis-mini/actions/runs/39132090251) passed for source commit `48e24a9581cd10de7d1204a14c5e8a36fc2a5864`. The public stable manifest, application, and complete USB image were downloaded and verified: correct board, exact versioned URL, embedded project/version, **1,092,288 application bytes**, SHA-256, and matching application bytes in the USB image at 0x20000.

## Previous release: v0.1.12 — October 18, 2026

The shared artwork now uses balanced creature proportions; see [drawing sizes](CREATURE-SIZES.md). Local simulation and renderer checks passed for the new artwork, including full parade entry/exit, non-overlapping bands, bottom-creature contact, and existing surface/bubble limits. This release has not been confirmed on the physical board. The [automated checks](https://github.com/Mikepyt87/ascii-genesis-mini/actions/runs/39130123669) and [release build](https://github.com/Mikepyt87/ascii-genesis-mini/actions/runs/39130185386) passed for source commit `bb872aaf337eae6e825e567a20ff4d1748a1f3b2`. Downloaded and verified the public stable manifest, application, and complete USB image: correct board, embedded project/version, exact asset URL, **1,092,256 application bytes**, SHA-256, and matching application bytes in the USB image at 0x20000.

## v0.1.11 — October 18, 2026

The release was built from commit `13ec9c557520a337321d4b02a52ddcc3fdd84b14`. [Check Mini](https://github.com/Mikepyt87/ascii-genesis-mini/actions/runs/39127562220) and the [release build](https://github.com/Mikepyt87/ascii-genesis-mini/actions/runs/39127598504) both passed, including ESP-IDF 5.5.2 compilation and the existing native C checks.

Preview checks passed for one simulated hour, 40 randomized starts, ordered two-creature parades, spacing, rounded-corner safety, controls, and the Wi-Fi/update simulation. Six additional ten-minute runs checked all surface visitors, transitions, the two-bubble limit, disappearance at the waterline, bottom-third landmarks, pause, and parade isolation. The revised artwork and screen proportions were visually inspected.

The public manifest, application, and complete USB image were downloaded and verified. Checks covered board ID, exact versioned URL, embedded application/version, byte count **1,093,056**, SHA-256, matching USB application bytes at 0x20000, and identical compatibility USB filenames.

The v0.1.11 scenes and installation have **not yet been confirmed on the physical board**. A browser preview does not verify LCD colors, touch, Wi-Fi provisioning, or physical update/rollback behavior. [Installation](INSTALL.md), [updates](UPDATES.md), and [surface scene details](SURFACE-SCENES.md).
