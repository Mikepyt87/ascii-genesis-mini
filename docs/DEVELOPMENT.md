# Preview, build, and test

Use this guide only if you want to change the Mini or compile it yourself. To install a published image, use [INSTALL.md](INSTALL.md).

## Download the standalone project

Install Git, then run:

```text
git clone https://github.com/Mikepyt87/ascii-genesis-mini.git ASCII-Genesis-Mini
cd ASCII-Genesis-Mini
```

All following paths are relative to this repository. No file from a neighboring Pi checkout is required. With an existing checkout, save personal changes before `git pull --ff-only` on main.

## Browser preview

Install Node.js 20 or newer. From the repository root:

```text
node preview/serve.mjs
```

Open **http://127.0.0.1:4174** on that computer. Leave the terminal running. Stop it with Ctrl+C. If the address is already in use, close the previous preview server before starting another one.

The preview simulates the 320 × 172 screen, rounded corners, touch buttons, pause, world reset, and parade. Native pixels shows the canvas at one browser pixel per display pixel; physical size still depends on your monitor. Settings includes a clearly marked Wi-Fi/update simulation with no real networking or passwords. The preview cannot provision or flash a board.

## Software checks

No npm packages are required:

```text
node preview/check.mjs
node preview/network-check.mjs
node tools/generate-assets.mjs --check
node tools/check-docs.mjs
```

The ocean check includes one simulated hour, all habitats, creature clearance, matching plant/ground movement, rounded-panel containment, large setup text, pause/reset controls, and all 28 parade arrivals, complete crossings, exits, duration, cancellation, and preservation of the normal ocean.

CI also compiles `tools/policy-check.c`, `touch-check.c`, `portal-check.c`, `geometry-check.c`, and `parade-check.c` with a native C compiler and warnings treated as errors. Geometry and parade checks link `-lm`. It then builds the actual firmware using ESP-IDF 5.5.2.

## Build the actual firmware

1. Install **ESP-IDF 5.5.2** and the ESP32-S3 tools using [Espressif's guide](https://docs.espressif.com/projects/esp-idf/en/v5.5.2/esp32s3/get-started/index.html).
2. Open the supplied ESP-IDF terminal. An ordinary PowerShell window does not automatically load its compiler environment.
3. Check `idf.py --version`; use 5.5.2 for this project's supported build.
4. From the repository root:

```text
cd firmware
idf.py set-target esp32s3
idf.py build
idf.py -p COM7 flash monitor
```

Replace COM7 with the board's actual port. Exit the monitor with Ctrl+] before using the port again. `idf.py flash` writes the build's bootloader, partition table, OTA metadata, and application at the right offsets. Do not manually reuse addresses from another board.

If you built the folder using a different IDF version, use an ESP-IDF 5.5.2 terminal and `idf.py fullclean`, then build again. Fullclean removes local generated build output; it does not erase the board.

## Assets and hardware

Edit source creature drawings in `art/original-fish.mjs`, then run from the root:

```text
node art/restore-sprites.mjs
node tools/generate-assets.mjs
```

Commit the source, generated `art/fish-art.js`, and `firmware/main/assets.h` together. Do not edit the generated header alone. Keep color masks aligned with the drawing and keep license notices. Mini firmware supports at most ten ASCII rows per creature; update the renderer and checks if expanding that limit.

Display: JD9853 SPI, SCLK38, MOSI39, CS21, DC45, RESET40, backlight46. Touch: AXS5106L at I2C address 0x63, SDA42, SCL41, RESET47, INT48. Landscape uses the vendor display initialization and the tested separate I2C select/read sequence. Do not substitute an ordinary ST7789 setup.

Normal camera speed is 3.6 pixels/second. Parade timing/placement is in `firmware/main/parade.h` and mirrored in `preview/ocean.js`. Keep both implementations and their tests in agreement. The firmware project name remains `ascii_genesis_147` for installed-board compatibility.

CI and browser checks do not emulate the radio, LCD, touch controller, physical power, flash writes, or bootloader. Record actual hardware verification separately.
