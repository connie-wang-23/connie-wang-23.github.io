# HeatMapDigitizer #

HeatMapDigitizer 
Provides a web tool for converting the colors in a figure to numerical data. The user uploads the 
figure of interest and selects the legend/color bar by dragging over the figure and defining the values
at either end of the legend. 
Clicking on the canvas then records the converted value shown in the bottom right and adds it to the data
array. The complete array can be displayed by clicking the print data button. 


### Set Up ###

A simple server can be run using 
```
python -m SimpleHTTPServer 
```
and navigating to localhost:8000/index.html

Needed Files

* index.html
* nearestColor.js
* picoModal-3.0.0.min.js
* jsFeat-min.js
* mains.js

### Source and Help ###


Sources and help:
  * http://timelyportfolio.blogspot.com/2015/03/extracting-heatmap.html
  * http://stackoverflow.com/questions/6735470/get-pixel-color-from-canvas-on-mouseover
  * http://bl.ocks.org/jinroh/4666920
  * https://github.com/dtao/nearest-color
  * https://github.com/Nycto/PicoModal
  * https://github.com/inspirit/jsfeat 
  * https://github.com/CodyAntcliffe/xrayedger/blob/master/main.js

### Authors ###

Connie Wang, Nathaniel Suriawijaya
