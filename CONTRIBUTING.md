# Contributing to ASCII Genesis - Mini

This is the ESP32 Mini project. For the Raspberry Pi program, use the [original repository](https://github.com/Mikepyt87/ascii-genesis).

## Report a problem

Open an [issue](https://github.com/Mikepyt87/ascii-genesis-mini/issues) with the exact board model, firmware version shown in Settings, what you expected, what happened, and steps to reproduce it. Say whether it happens on the board, in the preview, or both. For update problems, include the displayed message and whether the connection is home Wi-Fi or a hotspot. Remove passwords and private network information from pictures and logs.

## Change artwork or behavior

1. Follow [Development](docs/DEVELOPMENT.md) to clone, preview, build, and check the project.
2. Keep firmware and browser behavior in agreement. Preserve rounded-corner margins, complete off-screen arrivals/departures, and room around full drawings.
3. For new artwork, preserve both directions and aligned color masks. Keep the ten-row limit unless the renderer and checks are deliberately updated.
4. Regenerate artwork and firmware assets using the commands in the development guide. Update the descriptions in `tools/build-library.mjs`, then run `node tools/build-library.mjs` to rebuild the catalog and illustrations.
5. Run the software checks. Describe physical board tests separately; a browser preview does not test the LCD, radio, or bootloader.
6. Open a pull request explaining the visible change, how it was checked, and any remaining limitations. Firmware publication follows the [release guide](docs/RELEASES.md).

## Preserve credit

Keep copyright and license notices, including the upstream Asciiquarium source. Record the original author, source link, license, and your changes for adapted material in [CREDITS.md](CREDITS.md) and [THIRD-PARTY.md](THIRD-PARTY.md). Credit your own work accurately. Firmware/project code is GPL-3.0-or-later; creature artwork is GPL-2.0-or-later; the driver and font retain their separate notices. Do not add assets without a compatible license.
