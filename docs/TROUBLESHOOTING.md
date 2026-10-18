# Troubleshooting and USB recovery

Start by opening Settings and recording the installed version. Describe what appears on the screen and which step failed. Do not post Wi-Fi passwords, setup passwords, or private logs.

| Problem | What to try |
| --- | --- |
| Screen powers on but the computer sees no port | Use a known data cable, a direct USB port, and check Device Manager while reconnecting |
| COM port is busy | Close the ESP-IDF monitor with Ctrl+], and close other serial/flashing tools |
| Flashing cannot connect | Hold BOOT, press/release RESET, release BOOT; recheck the USB port and retry |
| Flash verified but screen stays blank | Confirm the exact Touch-LCD-1.47 model and complete image; press RESET without BOOT; capture the startup error |
| Text/image clipped at corners | Use current firmware with the rounded-screen safe area; check landscape orientation |
| Picture appears but touch does nothing | Update from firmware older than v0.1.1; tap once, lift, then tap a displayed button |
| Parade seems empty | The first creature begins off screen; wait a moment, check Pause/Resume, and watch the counter |
| Parade counter does not move | If paused, tap Resume. Each design crosses in six seconds; tall neighbors enter one at a time |
| Setup network disappeared | Reopen Settings → Set up Wi-Fi. Setup closes after ten minutes, saving credentials, or Back |
| Phone reports no internet on setup Wi-Fi | Stay connected and open http://192.168.4.1; that temporary network is only for setup |
| Browser says Join the device setup network first | On v0.1.1 or older, use USB recovery; v0.1.2 fixed dual-stack socket checking. On current firmware, rejoin the displayed setup network |
| Hotspot will not connect | Use 2.4 GHz, check the exact saved hotspot name/password, turn hotspot on after saving, and allow retries. Leave hotspot on and restart if needed |
| Wi-Fi online but clock not ready | Keep internet available for 1–2 minutes and check again; networks blocking time service can prevent synchronization |
| v0.1.2/v0.1.3 says no compatible update despite a newer release | Use USB recovery. Their HTTP transmit buffer is too small for GitHub's signed download address |
| Current version appears after checking | There is no newer published compatible version; source commits alone are not device releases |
| Download fails on a hotspot | Check mobile data, carrier limits, signal, and that the hotspot stays on. Retry with reliable power |
| Device restarts after an update | Keep it powered for recovery; the bootloader may return to the previous accepted image. Use USB if it does not recover |

## Recover over USB

Use the [complete installation instructions](INSTALL.md), with the newest numbered release's **aquarium-usb.bin** at **0x0**. Expect to enter Wi-Fi settings again when using a complete merged image. Do not flash the application-only file at 0x0.

Normal recovery does not require erasing the entire flash first. Only perform a full erase when deliberately removing all settings and both application slots, and when a known-good complete image and working USB connection are ready. An erase by itself leaves no aquarium to boot.

## Collect a startup log

For developers using ESP-IDF 5.5.2, open its terminal inside `firmware/` and run `idf.py -p COM7 monitor`, replacing COM7 with your port. The USB console runs at 115200 baud. Press RESET once to see startup messages. Exit with Ctrl+] before flashing. Touch diagnostics show initialization and press coordinates; the updater reports receipt of a valid manifest. Remove private network information before sharing a log.
