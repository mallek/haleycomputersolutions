---
title: "WiFi SWD Probe from a XIAO ESP32-C3"
date: 2026-09-28
description: "A XIAO ESP32-C3 flashed as a wireless debug probe, and the dead nRF52840 dongle it brought back."
tags: ["hw", "sw"]
chips: ["ESP32-C3", "SWD", "CMSIS-DAP", "OpenOCD"]
read: "3 min read"
lead:
  placeholder: "the XIAO wired to the dongle<br>16:9 crop"
  caption: "Photo to come."
specs:
  - ["Probe board", "XIAO ESP32-C3"]
  - ["Protocol", "CMSIS-DAP 2.1 over WiFi"]
  - ["SWCLK", "D4"]
  - ["SWDIO", "D5"]
  - ["Host", "OpenOCD (elaphureLink)"]
parts:
  - "Seeed XIAO ESP32-C3"
  - "Three wires: SWCLK, SWDIO, GND"
  - "Pin header"
files:
  - "<a href=\"https://github.com/windowsair/wireless-esp8266-dap\">wireless-esp8266-dap (probe firmware)</a>"
  - "<a href=\"https://github.com/windowsair/openocd-elaphurelink\">openocd-elaphurelink</a>"
---

## The Goal

I had an nRF52840 USB dongle with no bootloader on it. Someone had overwritten it before the dongle got to me. Without a bootloader it does not show up over USB, so the only way back in is SWD, the two-wire debug port.

I did not own a debug probe. I did have a spare XIAO ESP32-C3.

## Hardware

The probe is the XIAO and three wires.

| Signal | XIAO pin | Notes |
| --- | --- | --- |
| SWCLK | D4 | Clock to target |
| SWDIO | D5 | Data to target |
| GND | GND | Shared ground |

<p class="callout">Do not connect the probe's 3V3 to a target that has its own USB power. Share ground only.</p>

I soldered a header on those three pins. Those were my first solder joints.

## Firmware

The XIAO runs wireless-esp8266-dap, an open source project that turns an ESP board into a CMSIS-DAP probe that talks over WiFi. I backed up what was on the XIAO first, then flashed the prebuilt image.

The prebuilt image joins one fixed network name with one fixed password. I did not want to rebuild it, so I let the PC meet it halfway: a short script turns on the Windows hotspot with that name on 2.4 GHz. The probe joins and gets an address. `arp -a` shows which one.

## Driving it

The host side is a build of OpenOCD that speaks the probe's network protocol. No drivers and no USB passthrough.

```
openocd -f interface/elaphurelink.cfg \
  -c "cmsis-dap elaphurelink addr <probe address>" \
  -f target/nordic/nrf52.cfg
```

## What went wrong

Three things cost me time.

- **Mass erase needs a halt first.** `nrf5 mass_erase` fails unless you run `reset halt` before it.
- **`program` fails on a blank chip.** Over this link, `program file.hex verify` stops with "Error erasing sector". `flash write_image` followed by `verify_image` works.
- **Readback protection.** The chip can lock its debug port. `nrf52_recover` unlocks it by erasing everything, which was fine here.

## Result

The dongle has a bootloader again and shows up as a USB drive. Drop a firmware file on it and it flashes itself. The XIAO stays wired to it, because that pair is now my nRF52 programmer.

## What I would change

- Build the firmware myself so the WiFi name is mine, and skip the hotspot trick.
