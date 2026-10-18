# Mini validation record

## Current release: v0.1.12 — October 18, 2026

The shared artwork now uses balanced creature proportions; see [drawing sizes](CREATURE-SIZES.md). Local simulation and renderer checks passed for the new artwork, including full parade entry/exit, non-overlapping bands, bottom-creature contact, and existing surface/bubble limits. This release has not been confirmed on the physical board. The [automated checks](https://github.com/Mikepyt87/ascii-genesis-mini/actions/runs/39130123669) and [release build](https://github.com/Mikepyt87/ascii-genesis-mini/actions/runs/39130185386) passed for source commit `bb872aaf337eae6e825e567a20ff4d1748a1f3b2`. Downloaded and verified the public stable manifest, application, and complete USB image: correct board, embedded project/version, exact asset URL, **1,092,256 application bytes**, SHA-256, and matching application bytes in the USB image at 0x20000.

## v0.1.11 — October 18, 2026

The release was built from commit `13ec9c557520a337321d4b02a52ddcc3fdd84b14`. [Check Mini](https://github.com/Mikepyt87/ascii-genesis-mini/actions/runs/39127562220) and the [release build](https://github.com/Mikepyt87/ascii-genesis-mini/actions/runs/39127598504) both passed, including ESP-IDF 5.5.2 compilation and the existing native C checks.

Preview checks passed for one simulated hour, 40 randomized starts, ordered two-creature parades, spacing, rounded-corner safety, controls, and the Wi-Fi/update simulation. Six additional ten-minute runs checked all surface visitors, transitions, the two-bubble limit, disappearance at the waterline, bottom-third landmarks, pause, and parade isolation. The revised artwork and screen proportions were visually inspected.

The public manifest, application, and complete USB image were downloaded and verified. Checks covered board ID, exact versioned URL, embedded application/version, byte count **1,093,056**, SHA-256, matching USB application bytes at 0x20000, and identical compatibility USB filenames.

The v0.1.11 scenes and installation have **not yet been confirmed on the physical board**. A browser preview does not verify LCD colors, touch, Wi-Fi provisioning, or physical update/rollback behavior. [Installation](INSTALL.md), [updates](UPDATES.md), and [surface scene details](SURFACE-SCENES.md).
