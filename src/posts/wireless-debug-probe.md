---
title: "Wireless Debug Probe (nRF52)"
date: 2026-10-26
description: "A small, custom debug probe for nRF52 boards with SWD, RTT, and USB-C."
tags: ["hw", "3d"]
chips: ["nRF52", "SWD", "BLE", "Custom PCB"]
read: "3 min read"
thumb: placeholder
lead:
  placeholder: "board on the cutting mat, shot at an angle<br>16:9 crop"
  caption: "The probe, rev <span class=\"todo\">[REV]</span>."
specs:
  - ["MCU", "nRF52840"]
  - ["Interface", "SWD (10-pin)"]
  - ["Power", "USB-C (5V)"]
  - ["Firmware", "Custom (RTT)"]
parts:
  - "nRF52840 (WLCSP)"
  - "USB-C connector"
  - "10-pin SWD header"
  - "Status LEDs"
  - "3D printed enclosure"
files:
  - "Schematic (PDF) <span class=\"todo\">[FILE PENDING]</span>"
  - "PCB (KiCad) <span class=\"todo\">[FILE PENDING]</span>"
  - "<a href=\"https://github.com/mallek\">Firmware (GitHub)</a>"
  - "Enclosure (STL) <span class=\"todo\">[FILE PENDING]</span>"
---

## The Goal

A small, reliable debug probe for nRF52 boards with SWD, RTT, and USB-C. Something I can leave in the bag, use on any board, and not worry about.

I had been borrowing a dev kit as a programmer. It works. It is also the size of a dev kit, and it is never in the bag when I need it.

## Hardware

The board is built around an nRF52840. USB-C handles power and data. The target connects through a 10-pin SWD header, and there are status LEDs so I can tell what it is doing without opening a terminal.

- nRF52840 in the WLCSP package
- USB-C, 5V in
- 10-pin SWD header to the target
- Status LEDs

![bare PCB, top side](placeholder "Top side before assembly.")

### Pinout

| Signal | Header pin | MCU pin | Notes |
| --- | --- | --- | --- |
| SWDIO | <span class="todo">[PIN]</span> | <span class="todo">[PIN]</span> | Data to target |
| SWCLK | <span class="todo">[PIN]</span> | <span class="todo">[PIN]</span> | Clock to target |
| nRESET | <span class="todo">[PIN]</span> | <span class="todo">[PIN]</span> | Target reset |
| VTREF | <span class="todo">[PIN]</span> | <span class="todo">[PIN]</span> | Target voltage sense |
| GND | <span class="todo">[PIN]</span> | n/a | |

## Firmware

The firmware is custom. It speaks SWD to the target and passes RTT through, so I get log output without wiring up a UART.

```c
/* PLACEHOLDER SNIPPET: replace with the real one from the repo. */
#define PIN_SWDIO   /* [PIN] */
#define PIN_SWCLK   /* [PIN] */
#define PIN_LED     /* [PIN] */

void status_led_set(bool on)
{
    gpio_write(PIN_LED, on);    /* it blinks. ship it. */
}
```

Flashing the probe itself is one script: `./flash.sh debug-probe`.

## Enclosure

The enclosure is 3D printed. Outside dimensions are <span class="todo">[W x D x H mm]</span>, printed in <span class="todo">[MATERIAL]</span>.

![printed enclosure, both halves](placeholder "Enclosure, both halves.")

## What I would change

<p class="callout">[PLACEHOLDER: notes after using it for a while. What broke, what was annoying, what rev B gets.]</p>
