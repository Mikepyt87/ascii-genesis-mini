# Third-party source and licenses

| Material | Location | License / notice |
| --- | --- | --- |
| Firmware and standalone project additions | `firmware/`, `preview/`, `tools/` | [GPL-3.0-or-later](LICENSE), except retained third-party files |
| Asciiquarium source and adapted creature artwork | `art/` | [GPL-2.0-or-later](art/LICENSE.txt); original notices in upstream source |
| Original ASCII Genesis creature artwork | `art/original-fish.mjs` and generated `art/fish-art.js` | GPL-2.0-or-later |
| JD9853 driver | `firmware/components/esp_lcd_jd9853/` | [Apache-2.0](firmware/components/esp_lcd_jd9853/LICENSE), retained vendor/source notices |
| Adafruit GFX bitmap font | `preview/font.js`, generated firmware assets | [BSD notice](preview/FONT-LICENSE.txt) |

Generated firmware assets combine the artwork and font with their notices in the generated header. Source copies remain in this repository. See [CREDITS.md](CREDITS.md) for authorship and provenance. ESP-IDF is obtained separately by the build environment and retains its own licenses.
