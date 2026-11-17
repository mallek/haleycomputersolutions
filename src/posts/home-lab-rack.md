---
title: "Home Lab: The Rack"
date: 2026-11-10
description: "A small rack with an open-frame PC on top, a patch panel, a receiver, and a power conditioner. Plus two problems it took a while to find."
tags: ["lab", "web"]
chips: ["Plex", "NVENC", "Live TV", "Networking"]
read: "4 min read"
thumb: assets/img/rack-thumb.jpg
lead:
  src: assets/img/rack-lead.jpg
  alt: "A black equipment rack with a patch panel, a network switch on a shelf, and a Sony receiver"
  caption: "Patch panel, switch shelf, and the receiver."
specs:
  - ["CPU", "Core Ultra 7 270K Plus"]
  - ["GPU", "GTX 1070 Ti"]
  - ["Media", "Plex, with live TV"]
  - ["Tuner", "HDHomeRun, 2 tuners"]
  - ["Audio", "Sony STR-DH590, 4.0"]
  - ["Power", "Panamax M5100-PM"]
  - ["Patch panel", "24 port, CAT6A"]
parts:
  - "Open-frame PC"
  - "24-port CAT6A patch panel"
  - "Network switch"
  - "Sony STR-DH590 receiver"
  - "Panamax M5100-PM power conditioner"
  - "HDHomeRun network tuner"
  - "Antenna"
files:
  - "<span class=\"todo\">[NETWORK DIAGRAM PENDING]</span>"
---

## What it is

One rack beside the desk. It holds the network, the audio, clean power, and the PC that does the heavy work.

## From the top down

![An open-frame PC sitting on top of the rack](assets/img/rack-pc.jpg "The PC rides on top. Open frame, so there is nothing to take apart when a part changes.")

- **The PC.** Open frame, on top of the rack. It runs the media server and anything else that needs a real processor or a graphics card.
- **Patch panel.** 24 ports of CAT6A, with short patch leads down to the switch.
- **Switch shelf.** The switch, and the small boxes that only need power and a network port.
- **Receiver.** A Sony STR-DH590 driving four speakers: bookshelf speakers on the desk and towers behind me.
- **Power.** A Panamax M5100-PM power conditioner at the bottom.

![The bottom of the rack with a receiver above a power conditioner showing 123 volts](assets/img/rack-power.jpg "The power conditioner shows line voltage on the front. 123V here.")

## Media server

The PC runs Plex. Movies come from a drive, and live TV comes from an antenna through a network tuner with two tuners in it.

### Problem 1: streams that died after a minute

With the processor's built-in graphics doing the video encoding, every live TV stream died. Some lasted 13 seconds and some lasted two and a half minutes. The player just said it lost the connection. The server log had the real reason:

```
h264_qsv: Error during encoding: device failed (-17)
```

Software encoding was stable but heavy. The fix was a graphics card. I moved an older GTX 1070 Ti into the machine and pointed Plex at that card by name, so it could not quietly pick the built-in graphics again. Two streams at once now run clean, at about 133 MB of video memory each.

The monitor stays plugged into the motherboard, not the card. That leaves all of the card's memory for encoding.

### Problem 2: the tuner that dropped off the network

Watching one channel worked. Watching two did not: both streams stalled about every 90 seconds.

It looked like a server problem. It was not. The tuner keeps its own log, and the log showed its network link going down and coming back 11 seconds later, every time both tuners were busy. The firmware on it was from 2017. After a firmware update, two streams ran with zero drops.

<p class="callout">Check the box at the far end before blaming the server. It usually keeps a log too.</p>

## Audio

The receiver gets sound from the graphics card over HDMI. Windows sees it as a 5.1 device, but I only have four speakers, so the PC handles the routing: bass under 80 Hz goes to the towers, and there are two profiles, one for music and one for surround.

## What I would change

- Back up the movie drive. Right now it is the only copy.
- Tidy the cabling on top. The PC's leads cross the front of the rack.
- <span class="todo">[MONITORING AND ALERTS: not built yet]</span>
