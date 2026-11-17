---
title: "Teardown: Inside a Bluetooth Game Accessory"
date: 2026-10-04
description: "Opening a small BLE accessory, reading the chip markings, and backing up its flash before changing anything."
tags: ["hw"]
chips: ["nRF52832", "SPI Flash", "BLE", "Teardown"]
read: "4 min read"
thumb: assets/img/teardown-thumb.jpg
lead:
  src: assets/img/teardown-lead.jpg
  alt: "A green circuit board on a blue work mat, with two large chips near the middle"
  caption: "Side B of the main board. Flash on the left, radio in the middle."
specs:
  - ["MCU", "nRF52832 (QFAA)"]
  - ["Flash", "MX25U6433F, 8 MB"]
  - ["Flash voltage", "1.8V"]
  - ["Flash package", "WSON8"]
  - ["Charging", "USB-C daughterboard"]
parts:
  - "CH341A programmer"
  - "1.8V adapter for the CH341A"
  - "WSON8 pogo probe (6x5 mm)"
  - "Fine-tip test leads"
  - "Soldering iron"
files:
  - "<a href=\"https://www.nordicsemi.com/Products/nRF52832\">nRF52832 product page</a>"
---

## The Goal

I wanted to know what was inside a small Bluetooth accessory I own, and I wanted a full copy of its flash chip before I changed anything on the board. Backup first, then tinker.

## Opening it

The battery sits on a press connector, so it comes off without a soldering iron. That is the first thing to remove. After that the main board lifts out with the vibration motor and the USB-C board still attached.

![The whole board with a small USB-C board attached by a flex cable](assets/img/teardown-board.jpg "Main board, the USB-C daughterboard, and the motor housing at right.")

The USB-C port is on its own small board, joined to the main board by a four-conductor flex. The antenna leaves the board on a tiny coax connector. The gold dome near the bottom is the button.

## What is on the board

| Part | Marking | What it is |
| --- | --- | --- |
| MCU and radio | N52832 QFAAE1 | Nordic nRF52832, Bluetooth LE |
| Flash | MX25U6433F | Macronix SPI flash, 8 MB, 1.8V, WSON8 |
| Small TI part | CKP TI 4AI | <span class="todo">[NOT IDENTIFIED]</span> |
| Small part with a 2D code | SE ... 618 | Probably the motion sensor. <span class="todo">[NOT CONFIRMED]</span> |

![Close view of the main chip, marked N52832](assets/img/teardown-nrf52832.jpg "The nRF52832. One chip is the processor and the radio.")

![Close view of the flash chip with the Macronix logo](assets/img/teardown-flash.jpg "The Macronix flash. No legs: the pads are underneath and along the edge.")

The nRF52832 is a common part and easy to find documents for. The flash is the interesting one. It runs at 1.8V, and the package has no legs to clip onto.

![Close view of a small chip marked CKP TI](assets/img/teardown-ti.jpg "The TI part. I have not matched the marking to a part number yet.")

![Close view of a small chip with a printed 2D code](assets/img/teardown-sensor.jpg "The part with the 2D code.")

## Reading the flash

Two things make this chip harder to read than the usual 8-pin flash.

- **It is a 1.8V part.** A stock CH341A programmer puts out 3.3V or more, and that can damage a 1.8V chip. I used a 1.8V adapter and checked it with a meter before it went near the board. It measured 1.797V.
- **It is a WSON8 package.** A normal SOIC clip has nothing to grab. I tried a probe with a SOP8 head first. Its rows are 5.8 mm apart, which is marginal on this chip. A proper 6x5 mm WSON probe fit.

I read the full 8 MB twice and compared SHA-256 hashes of the two files. They matched. If two reads in a row match, the probe was seated and the copy is good.

<p class="callout">Measure the adapter before you trust it. A label that says 1.8V is not a measurement.</p>

## Putting it back

The unit went back together and works. While it was open I desoldered the red lead of the vibration motor and taped it off, so it runs silent now. The black lead is still attached, which makes the change easy to undo.

## What I would change

- Order the right probe first. The wrong one cost me days of waiting on shipping.
- Identify the two small parts. <span class="todo">[TO DO]</span>
