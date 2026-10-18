# Maintainer release instructions

Publishing commits does not publish a device update. A release must include a compiled application and a valid stable-channel manifest.

Keep the README's current version, changelog, illustrated scene guide, and validation record aligned with each published release. Run `node tools/build-scenes-tour.mjs --check`, `node tools/build-library.mjs --check`, and `node tools/check-docs.mjs` before publishing. Historical migration versions remain in the guides intentionally.

Keep the README's current version, changelog, illustrated scene guide, and validation record aligned with each published release. Run `node tools/build-scenes-tour.mjs --check`, `node tools/build-library.mjs --check`, and `node tools/check-docs.mjs` before publishing. Historical migration versions remain in the guides intentionally.

## Prepare and check

1. Merge the intended changes into main and wait for **Check Mini** to pass.
2. Make sure source and generated artwork match, documentation links pass, and the version is a new numeric `X.Y.Z` value.
   Add that version's changes to `CHANGELOG.md`; the workflow requires its entry and uses it to write the public release description, including installation and migration links.
3. Open **Actions → Prepare Mini release → Run workflow**.
4. Select **main**, enter the intended version, and leave **Publish unchecked** for a test package.
5. Wait for success. Download the `esp32-147-X.Y.Z` workflow artifact and extract it.
6. Verify the package contains `ocean-usb.bin`, `ascii-genesis-147.bin`, and `manifest.json`. Use the complete image for USB testing.
7. Check display, all touch buttons, pause/resume, normal reset, parade progress/return, Wi-Fi setup, hotspot reconnect, offline operation, startup acceptance, and update checks. Test full wireless installation/rollback on appropriate hardware when those paths change. Record what was actually tested.

## Publish

Run the same workflow from main, enter the tested version, and enable **Publish**. Use the same source commit; if main changed, build/check the intended source again first. The workflow checks, compiles, packages, creates `esp32-147-vX.Y.Z`, then uploads the manifest to `esp32-147-stable`.

Verify the public stable manifest and download the versioned application. Check its board ID, version, exact repository URL, byte length, SHA-256, and embedded application version. Confirm all jobs succeeded. Do not replace an existing numbered release's binary. Publish a higher version for a correction.

The stable release is a pointer; numbered releases contain the first-install image and application. The embedded project name and board ID must remain compatible with installed devices. The application is at most 6 MiB and must fit an inactive slot.

## One-time transition for v0.1.6

New firmware checks this repository. Old installed v0.1.4/v0.1.5 firmware only trusts versioned application URLs in `Mikepyt87/ascii-genesis`.

1. Publish and verify v0.1.6 **here first**.
2. In the original repository, run **Publish Mini transition → Run workflow**. It only accepts version 0.1.6.
3. That workflow downloads this repository's application, complete USB image, and manifest over HTTPS; verifies the expected model/version/application hash; and copies the images into the old versioned release.
4. It rewrites only the manifest's download URL to the old repository's expected path and promotes that manifest to the old stable channel.
5. Verify the old and new application bytes have the same SHA-256. The old stable manifest must point to the old versioned URL; the new stable manifest must point here. Both deliver the same new-repository firmware.
6. Existing boards can install v0.1.6 from the old channel, then automatically check this repository. Keep that compatibility release/channel available for boards that migrate later.

Do not point the old channel directly at a new-repository URL: the old firmware deliberately rejects that URL. Do not continue publishing future Mini releases in both repositories. The Pi updater follows its own main branch and does not consume either firmware channel.
