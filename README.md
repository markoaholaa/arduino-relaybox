
# Arduino Relay Box
Control relays remotely with NodeJS app and Arduino.
Project includes PCB design, 3D printing, Arduino programming and NodeJS programming.

## PCB Design
The system consists of 2 boards.
The main board:<br></br>
![main board](https://i.imgur.com/XttDpse.png)
Since the Arduino MKR GSM 1400 pins can only do 3.3V and it was easier to find 5V relays with the max current I wanted, I decided to use the arduino to control MOSFETs instead of the relays directly.

And 3 additional boards to add if needed:<br></br>
![addon board](https://i.imgur.com/ozBc17R.png)

Im in no way a professional PCB designer, but these should work.

## 3D Printed Case

The system obviously needs a case and rather than finding a case that already exists, I wanted to design my own.<br></br>

![3d printed case](https://i.imgur.com/7mK3FWr.png)
It has screw holes for the main board and 3 additional boards.


## Project Updates
Below here I will be adding updates about the progress.