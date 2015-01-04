node-protocol-analyzer
======================

web based rs-232 protocol analyzer

## Detailed Description

Let's say you have two devices connected by RS-232 and that you've created a custom adapter from DB-9 to DB-25 for said connection. To create this adapter, you've used a breadboard and spread out and labelled pins like so:

```
                    DB-9 to PC ---->
NAME: CTS RTS DSR GND DTR TXD RXD
PIN#:  8   7   6   5   4   3   2
       |   |   |   |   |   |   |
       4   5  20   7   6   3   2
      RTS CTS DTR GND DSR RXD TXD
<---- DB-25 to Device
```

**Notice that on Pin 3, TXD of PC is sending bits to RXD of Device. Vice versa for Pin 2.**

You decide to listen in on the conversation by occupying two additional serial ports, say COM2 and COM3 on your windows PC.

You connect COM2's RXD pin to pin 3 of your breadboard and COM3's RXD pin to pin 2 of your breadboard.

At this point you're effectively able to open both sniffer probes (COM2 and COM3) and read them in order to listen in on the PC and the Device.

This program assumes you've done the hardware work already. It will open the probe ports for you at the baud rate of your choosing.

The rest is a work in progress as I hack this together and update the readme with additional features. I'm expecting to implement some or all of this:

* Binary, Hex, and Plaintext views
* Session Recorder
* Diff checker (against previously recorded sessions)
