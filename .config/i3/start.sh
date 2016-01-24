#!/bin/bash
exec feh --bg-scale ~/Images/Debian.jpg &
xrdb -merge .Xresources &
xrandr --output DVI-I-0 --brightness 0.9 &
iceweasel &
compton &
dropbox start
