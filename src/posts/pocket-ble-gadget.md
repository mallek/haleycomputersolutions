---
title: "Pocket BLE Gadget (XIAO nRF52840)"
date: 2026-10-14
description: "A XIAO nRF52840, a 400 mAh cell, a slide switch, and a seven-pixel light ring in a printed case."
tags: ["hw", "3d"]
chips: ["nRF52840", "BLE", "LiPo", "NeoPixel"]
read: "3 min read"
thumb: assets/img/ble-thumb.jpg
lead:
  src: assets/img/ble-lead.jpg
  alt: "An open blue printed case holding a small battery, a tiny circuit board, and a round board with seven LEDs"
  caption: "Lid off. Battery on top, XIAO at lower left, light ring at lower right."
specs:
  - ["MCU", "nRF52840"]
  - ["Radio", "Bluetooth LE"]
  - ["Battery", "3.7V 400 mAh LiPo"]
  - ["Charging", "USB-C, on the XIAO"]
  - ["Lights", "7 RGB pixels"]
  - ["Runtime", "<span class=\"todo\">[NOT MEASURED]</span>"]
parts:
  - "Seeed XIAO nRF52840"
  - "752035 LiPo cell, 400 mAh"
  - "7-pixel RGB ring"
  - "Slide switch"
  - "JST ZH 1.5 mm pigtail"
  - "3D printed case"
files:
  - "Case (STL) <span class=\"todo\">[FILE PENDING]</span>"
  - "<a href=\"https://wiki.seeedstudio.com/XIAO_BLE/\">XIAO nRF52840 docs (Seeed)</a>"
---

## The Goal

A battery-powered Bluetooth device small enough for a pocket. It pairs with a phone game, and the light ring tells me what is happening so I do not have to look at the phone.

## Hardware

![A Seeed XIAO nRF52840 board on a desk](assets/img/ble-xiao.jpg "The XIAO nRF52840 before it went in the case. It is about the size of a postage stamp.")

The XIAO nRF52840 does most of the work on its own. It has the radio, a USB-C port, and a LiPo charger on board. That leaves three things to add.

- **Battery.** A 400 mAh cell, the kind sold for small drones. It solders to the two battery pads on the underside of the XIAO, and it charges whenever USB-C is plugged in.
- **Switch.** A slide switch in series with the red battery lead. Off means off: nothing drains the cell in a drawer.
- **Light ring.** Seven RGB pixels, six in a circle and one in the middle. It needs power, ground, and one data pin.

### Wiring

| From | To | Notes |
| --- | --- | --- |
| Battery + | Switch, then BAT+ pad | Red lead |
| Battery - | BAT- pad | Black lead |
| Ring data in | D7 | Moved from D0 during the build |
| Ring power | <span class="todo">[PIN]</span> | |
| D1 | GND, held 5 seconds | Clears saved pairing |

D1 is the reset for saved state. Short it to ground for five seconds and the device forgets its pairing and starts clean.

## Lights

The ring only lights for things worth knowing about. A light that is always on stops meaning anything.

- **Good event:** a rainbow chase around the outer six.
- **Bad event:** all seven flash red three times.
- **Connected, disconnected, fully charged:** the whole ring, once.
- **Battery:** the middle pixel only. Amber under 30%, red under 10%, a slow green pulse while charging.

Some events are dark on purpose. They happen too often to be worth a flash.

## Enclosure

The case is 3D printed in blue. It has one pocket for the cell, one for the XIAO with the USB-C port at the edge, a round seat for the ring, and a slot in the wall for the switch. Outside dimensions are <span class="todo">[W x D x H mm]</span>, printed in <span class="todo">[MATERIAL]</span>.

## Firmware

The firmware is an Arduino sketch built on the Seeed nRF52 core. It is a fork of an open source project, and my changes are the lights and the battery handling.

One quirk when flashing: the first upload often fails because the serial port disappears. Double-tap the reset button to force the bootloader, then upload again.

## What I would change

- Measure the runtime. My estimate is somewhere between 16 and 30 hours, which is not a number.
- <span class="todo">[NOTES after carrying it for a while]</span>

<p class="callout">Next version is already on the bench: the same firmware on a board with a screen.</p>
