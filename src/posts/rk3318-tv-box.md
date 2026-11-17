---
title: "Android TV Box as a Test Device (RK3318)"
date: 2026-10-27
description: "What is inside a cheap RK3318 Android TV box, and why a slow one makes a good test target for an app."
tags: ["hw", "sw"]
chips: ["RK3318", "Android", "adb", "Teardown"]
read: "3 min read"
thumb: assets/img/tvbox-thumb.jpg
lead:
  src: assets/img/tvbox-lead.jpg
  alt: "A black circuit board with a silver heatsink in the middle and ports along the edges"
  caption: "Top side. The processor is under the heatsink."
specs:
  - ["SoC", "Rockchip RK3318"]
  - ["Board", "RK3318_V1.2"]
  - ["RAM", "4 GB"]
  - ["Storage", "64 GB"]
  - ["Wireless", "SP2734C module"]
  - ["Display out", "HDMI, 1920x1080"]
parts:
  - "RK3318 Android TV box"
files:
  - "<span class=\"todo\">[ADB NOTES PENDING]</span>"
---

## The Goal

I needed an Android device that is always on, always on the network, and that I do not mind breaking. A TV box does that, and it plugs into any monitor.

## What is inside

![The underside of the board, sitting in the bottom half of its case](assets/img/tvbox-bottom.jpg "Bottom side, still in the case. The sticker gives the build away.")

The sticker on the bottom reads `QC2 4+64+2734C`. That is the whole spec in one line: 4 GB of RAM, 64 GB of storage, and the 2734C wireless module.

| Part | Marking | What it is |
| --- | --- | --- |
| Processor | under the heatsink | Rockchip RK3318 |
| Memory | D9RVW, four per side | Micron RAM |
| Storage | Micron, beside the heatsink | 64 GB flash <span class="todo">[PART NUMBER]</span> |
| Wireless | SP2734C | WiFi and Bluetooth module |
| Regulator | AMS1117 | Linear regulator |
| Display driver | FD6551 | Runs the clock on the front panel |

Around the edge: power, network, HDMI, an AV jack, one USB 3 port, one USB 2 port, and a microSD slot. The board is marked `RK3318_V1.2` with a date of 2018.11.23, so the design is a good deal older than the box it came in.

## Using it as a test device

I build an Android app and install it on the box over the network with adb. No cable, no unlocking a phone.

```
adb connect <box address>:5555
adb install -r app-debug.apk
adb exec-out screencap -p > screen.png
```

Two things about this box turned out to be useful.

- **It is landscape, 1920x1080.** A design drawn for a phone held upright does not fit. The app got a second layout for wide screens because of this box.
- **It is slow.** A cold start of the app takes 8 to 14 seconds. If the app feels acceptable here, it is fine on a phone.

<p class="callout">Wait for the app to finish starting before taking a screenshot. On this box that is longer than you think.</p>

## What I would change

- <span class="todo">[NOTES: what broke, what was annoying]</span>
