// SPDX-License-Identifier: GPL-3.0-or-later
import fs from 'node:fs/promises';
const [version,output]=process.argv.slice(2);
if(!/^\d+\.\d+\.\d+$/.test(version||'')||!output)throw Error('Supply version X.Y.Z and output path');
const changelog=await fs.readFile(new URL('../CHANGELOG.md',import.meta.url),'utf8');
const section=changelog.split(`## ${version}\n`)[1]?.split('\n## ')[0].trim();
if(!section)throw Error(`Document version ${version} in CHANGELOG.md before publishing`);
await fs.writeFile(output,`For **Waveshare ESP32-S3-Touch-LCD-1.47** only.\n\n${section}\n\n## Install or update\n\n- Existing Mini: **Settings → Check for updates → Install**. Keep power connected through the restart and for at least 30 seconds afterward.\n- First installation or USB recovery: download **aquarium-usb.bin** and follow the [complete USB guide](https://github.com/Mikepyt87/ascii-genesis-mini/blob/main/docs/INSTALL.md). Write this complete image at **0x0**.\n- **ascii-genesis-147.bin** is the application-only wireless-update image; it is not a complete USB image.\n- Boards on v0.1.4/v0.1.5 install the v0.1.6 transition first, then check again for this release. v0.1.2/v0.1.3 need USB recovery. [Migration details](https://github.com/Mikepyt87/ascii-genesis-mini/blob/main/docs/MIGRATION.md).\n\nExplore the [Mini Ocean Library](https://github.com/Mikepyt87/ascii-genesis-mini/blob/main/docs/OCEAN-LIBRARY.md) and [visual tour](https://github.com/Mikepyt87/ascii-genesis-mini/blob/main/docs/SCREENSHOTS.md).\n\nThe Raspberry Pi edition has its own repository and update system.\n`);
