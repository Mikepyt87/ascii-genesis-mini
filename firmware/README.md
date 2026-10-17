# Mini firmware source

For **Waveshare ESP32-S3-Touch-LCD-1.47** only.

- New board or USB recovery: [installation guide](../docs/INSTALL.md).
- Already installed: [Wi-Fi](../docs/WIFI.md), [wireless updates](../docs/UPDATES.md), and [touch/parade controls](../docs/CONTROLS.md).
- Compile or modify firmware: [developer guide](../docs/DEVELOPMENT.md).
- Publish a release: [maintainer guide](../docs/RELEASES.md).

This directory uses ESP-IDF **5.5.2**. Open an ESP-IDF terminal here and use `idf.py set-target esp32s3`, `idf.py build`, then `idf.py -p COM7 flash monitor`, replacing the port. The full guides explain tool installation, file selection, ports, BOOT/RESET, and validation. No Raspberry Pi installer is used.
