function resetScales(){
    bar = false;
    xset=false;
    yset=false;
    $('#y-axis-range').text("");
    $('#x-axis-range').text("");
    $('#color-bar-range').text("");
    gBrushes.selectAll('.brush')
    	.remove();
    newColorBrush();
    $('#status').text('Click and drag over the color bar to set color scale');
}
function toggleRemove(){
  addPoints=!addPoints;
  if (addPoints){
    $('#status').text('Click on the image to add points');
  }
  else {
    $('#status').text('Remove point mode: Click on the points to remove them');
  }

}

function resetAll() {
  resetScales();
  resetData('dataTable-container');
  $('#status').text('Click and drag over the color bar to set color scale');
}
function findPos(obj) {
    var curleft = 0, curtop = 0;
    if (obj.offsetParent) {
        do {
            curleft += obj.offsetLeft;
            curtop += obj.offsetTop;
        } while (obj = obj.offsetParent);
        return { x: curleft, y: curtop };
    }
    return undefined;
}

function loadImageFileAsURL()
{
    var filesSelected = document.getElementById("inputFileToLoad").files;
    if (filesSelected.length > 0)
    {
        var fileToLoad = filesSelected[0];
        if (fileToLoad.type.match("image.*"))
        {
            var fileReader = new FileReader();
            fileReader.onload = function(fileLoadedEvent)
            {
    					var image = new Image;
    					image.src = fileLoadedEvent.target.result;
    					image.onload = loadImageToCanvas;
            };
            fileReader.readAsDataURL(fileToLoad);
        }
    }
    resetAll();
}

function loadImageToCanvas() {
  context.clearRect(0, 0, width, height);
  context.drawImage(this,0,0, width, width*this.height/this.width);
  newColorBrush();
}

function newColorBrush(){
 brushNode = gBrushes.append("g")
      .attr("class", "brush")
      .call(brush)

  //keep the selection during the clicking
  oldMousedown = brushNode.on("mousedown.brush");
  // and replace it with our custom handler
  brushNode.on('mousedown.brush', function () {
	  brushNode.on('mouseup.brush', function () {
		  clearHandlers();
	  });
	  brushNode.on('mousemove.brush', function () {
		  clearHandlers();
		  oldMousedown.call(this);
	  });
	  function clearHandlers() {
		  brushNode.on('mousemove.brush', null);
		  brushNode.on('mouseup.brush', null);
	  }
	})
}

function newXBrush(){
 brushNode = gBrushes.append("g")
      .attr("class", "brush")
      .call(brushX)
}
function newYBrush(){
 brushNode = gBrushes.append("g")
      .attr("class", "brush")
      .call(brushY)
}
function setYscale(){
	if (d3.event.selection && d3.event.selection[0]!=d3.event.selection[1]) {
 		s=d3.event.selection
		if(yset == false){
			 var pMod = picoModal([
			  "<h1>Define Y-axis </h1>",
			  "Top:<div id='scale_min' contentEditable='true'>" +
				  ((document.getElementById("scale_min")) ? document.getElementById("scale_min").textContent : 0) + "</div>",
			  "Bottom:<div id='scale_max' contentEditable='true'>" +
				  ((document.getElementById("scale_max")) ? document.getElementById("scale_max").textContent : 1) + "</div>",
        "<p><button href='#' class='dismiss'>Set Y-axis</button></p>"
			].join("\n"))
			  .afterClose(function(modal){
			 	 yScale.domain(s).range([
				  parseFloat(modal.modalElem().childNodes[2].textContent),
				  parseFloat(modal.modalElem().childNodes[4].textContent)
				])
        $('#y-axis-range').text(yScale.range()[0].toFixed(2) + " - " + yScale.range()[1].toFixed(2))
				yset = true;
				gBrushes.selectAll('.brush').remove();
			  })
        .afterCreate(function(modal){
            modal.modalElem().getElementsByClassName("dismiss")[0]
                .addEventListener('click', modal.close);
        })
        .show()
          ymin=s[0];
          ymax=s[1]
		}
	}
  $('#status').text('Y-axis set. Click on points to find value or try auto detect.');
  addPoints = true;
}
function setXscale(){
	if (d3.event.selection && d3.event.selection[0]!=d3.event.selection[1]) {
 		s=d3.event.selection;
 		var d1=0;
 		var d2=1;
		if(xset == false){
			 var pMod = picoModal([
			  "<h1>Define X-axis </h1>",
			  "Left:<div id='scale_min' contentEditable='true'>" +
				  ((document.getElementById("scale_min")) ? document.getElementById("scale_min").textContent : 0) + "</div>",
			  "Right:<div id='scale_max' contentEditable='true'>" +
				  ((document.getElementById("scale_max")) ? document.getElementById("scale_max").textContent : 1) + "</div>",
        "<p><button href='#' class='dismiss'>Set X-axis</button></p>"
			].join("\n"))
			  .afterClose(function(modal){
			    xScale.domain(s).range([
				  parseFloat(modal.modalElem().childNodes[2].textContent),
				  parseFloat(modal.modalElem().childNodes[4].textContent)
				])
        $('#x-axis-range').text(xScale.range()[0].toFixed(2) + " - " + xScale.range()[1].toFixed(2))
				xset = true;
				brushNode.call(brush.move,null);
				newYBrush();
			  })
        .afterCreate(function(modal){
            modal.modalElem().getElementsByClassName("dismiss")[0]
                .addEventListener('click', modal.close);
        })
			  .show()
              console.log(s, height, width)
              xmin=s[0];
              xmax=s[1]
		}
	}
  $('#status').text('X-axis set. Click to set y-axis');
}
//Signifies end of brush selection
function setColorScale(){
	if (d3.event.selection && d3.event.selection[0]!=d3.event.selection[1]) {
		s=d3.event.selection;
		//if bar is false (color bar not selected yet), pico modal will pop up allowing user to specify domain for the color range.
		if(bar == false){
			 var pMod = picoModal([
			  "<h1>Adjust Scale Below</h1>",
			  "Scale Left/Top:<div id='scale_min' contentEditable='true'>" +
				  ((document.getElementById("scale_min")) ? document.getElementById("scale_min").textContent : 1) + "</div>",
			  "Scale Right/Bottom:<div id='scale_max' contentEditable='true'>" +
				  ((document.getElementById("scale_max")) ? document.getElementById("scale_max").textContent : 0) + "</div>",
          "<p><button href='#' class='dismiss'>Set Color Scale</button></p>"
			].join("\n"))
			  .beforeClose(function(modal){
				      colorScale.domain([
				  parseFloat(modal.modalElem().childNodes[2].textContent),
				  parseFloat(modal.modalElem().childNodes[4].textContent)
				])
			  })
			  .afterClose(function(modal){
				updateColorScale(s);
			  })
        .afterCreate(function(modal){
            modal.modalElem().getElementsByClassName("dismiss")[0]
                .addEventListener('click', modal.close);
        })
			  .show()
			  newXBrush();

		}
    $('#color-bar-range').text(colorScale.domain()[0].toFixed(2) + " - " + colorScale.domain()[1].toFixed(2))
    $('#status').text('Color scale set. Click to set x-axis');
	}
}

function updateColorScale(extent){
    var pos = findPos(canvas);
    console.log("Got here! at pos"+pos.x , pos.y);
    console.log(extent);
    colorRef = {};

    var dx = Math.abs(extent[1][0] - extent[0][0]);
    var dy = Math.abs(extent[0][1] - extent[1][1]);
    var colorRange = [];
    var colorDomain = [];
    console.log(dx,dy)
    if (dx > dy){
      var x0 = extent[0][0];
      var x1 = extent[1][0];
      var ymid = (extent[0][1] + extent[1][1])/2 ;
      for(i = 0; i < 1000; i++){
        var x = (x1 - x0)/1000 * i + x0
        var p = context.getImageData(x, ymid, 1, 1).data;
        var hex = "#" + ("000000" + rgbToHex(p[0], p[1], p[2])).slice(-6);
        colorDomain.push(colorScale.domain()[0]+((colorScale.domain()[1]-colorScale.domain()[0])/1000 * i));
        colorRange.push(hex);
      }
    }
    else{
      console.log("vertical")
      var y0 = extent[0][1];
      var y1 = extent[1][1];
      var xmid = (extent[0][0] + extent[1][0])/2 ;
      //arbitrarily pick 1000 spots on the range
      for(i = 0; i < 1000; i++){
        var y = (y1 - y0)/1000 * i + y0
        var p = context.getImageData(xmid, y, 1, 1).data;
        var hex = "#" + ("000000" + rgbToHex(p[0], p[1], p[2])).slice(-6);
        colorDomain.push(colorScale.domain()[0]+((colorScale.domain()[1]-colorScale.domain()[0])/1000 * i));
        colorRange.push(hex);
      }
    }
    colorScale.range(colorRange).domain(colorDomain);

    colorRange.forEach(function(d,i){
      colorRef[d] = colorDomain[i];
    })

    if( colorRange.length > 2 ){
      nearest = nearestColor.from( colorRange );
    }
    bar = true;
}

function KlesmithColorScaleTat(value) {
  //Klesmith2016 color scale goes from 4 at [250,105,105] to -1 at [90, 138,198]
  if (value > 4 || value < -1) {
    return [191,191,191]
  }
  else if (value >= 0) {
    return [250, (4-value)/4*(255-105)+105, (4-value)/4*(255-105)+105];
  }
  else {
    return [255+value*(255-90), 255+value*(255-138), 255+value*(255-198)];
  }
}

function KlesmithColorScaleYSD(value) {
  //Klesmith2016 color scale goes from 4 at [250,105,105] to -1 at [90, 138,198]
  if (value > 2 || value < -0.5) {
    return [191,191,191]
  }
  else if (value >= 0) {
    return [250, (2-value)/2*(255-105)+105, (2-value)/2*(255-105)+105];
  }
  else {
    return [255+(value/0.5)*(255-90), 255+(value/0.5)*(255-138), 255+(value/0.5)*(255-198)];
  }
}
function rwb_scale(value) {
  // red -> white -> blue color scale
  // at 0, (1,0,0) red ; at 0.5, (1,1,1) white ;  at 1 (0,0,1)
  if (value > 1 || value < 0) {
    return [0,0,0];
  }
  else if ( value <= 0.5) {

    return [255, (value*2)*255, (value*2)*255];
  }
  else {
    return [(1-value)*2*255, (1-value)*2*255, 255];
  }
}
function setManualColorScale() {
  console.log("Manually setting the color scale");
  colorRef = {};
  var colorRange = [];
  var colorDomain = [];
  var pMod = picoModal([
   "<h1>Set Color Scale  (assumes RWB scale ) Red and Blue Values </h1>",
   "Red:<div id='scale_min' contentEditable='true'>" +
     ((document.getElementById("scale_min")) ? document.getElementById("scale_min").textContent : 1) + "</div>",
   "Blue:<div id='scale_max' contentEditable='true'>" +
     ((document.getElementById("scale_max")) ? document.getElementById("scale_max").textContent : 0) + "</div>",
     "<p><button href='#' class='dismiss'>Set Color Scale</button></p>",
    "Red value:<div id='scale_max' contentEditable='true'>" +
       ((document.getElementById("scale_max")) ? document.getElementById("scale_max").textContent : 0) + "</div>",
       "<p><button href='#' class='dismiss'>Set Color Scale</button></p>"
  ].join("\n"))
   .beforeClose(function(modal){
       colorScale.domain([
     parseFloat(modal.modalElem().childNodes[2].textContent),
     parseFloat(modal.modalElem().childNodes[4].textContent)
   ])
   })
   .afterClose(function(modal){
     //arbitrarily pick 1000 spots on the range
     for(i = 0; i < 1000; i++){
       var p = rwb_scale(i/1000.0)
       var hex = "#" + ("000000" + rgbToHex(p[0], p[1], p[2])).slice(-6);
       // console.log(hex);
       colorDomain.push(colorScale.domain()[0]+((colorScale.domain()[1]-colorScale.domain()[0])/1000.0 * i));
       colorRange.push(hex);
     };
     colorScale.range(colorRange).domain(colorDomain);
     colorRange.forEach(function(d,i){
       colorRef[d] = colorDomain[i];
     })
     if( colorRange.length > 2 ){
       nearest = nearestColor.from( colorRange );
     }
     bar = true;
   })
   .afterCreate(function(modal){
       modal.modalElem().getElementsByClassName("dismiss")[0]
           .addEventListener('click', modal.close);
   })
   .show()
 }


function setKlesmithColorScaleTat() {
  console.log("Manually setting the color scale to the Klesmith scale");
  colorRef = {};
  var colorRange = [];
  var colorDomain = [];
  for(i = 0; i < 1000; i++){
    var p = KlesmithColorScaleTat((i*5)/1000.0 - 1)
    var hex = "#" + ("000000" + rgbToHex(p[0], p[1], p[2])).slice(-6);
    // console.log(hex);
    colorDomain.push((i*5)/1000.0 - 1);
    colorRange.push(hex);
  };
  colorScale.range(colorRange).domain(colorDomain);
  colorRange.forEach(function(d,i){
    colorRef[d] = colorDomain[i];
  })
    if( colorRange.length > 2 ){
      nearest = nearestColor.from( colorRange );
    }
    bar = true;
}

function setKlesmithColorScaleYSD() {
  console.log("Manually setting the color scale to the Klesmith scale");
  colorRef = {};
  var colorRange = [];
  var colorDomain = [];
  for(i = 0; i < 1000; i++){
    var p = KlesmithColorScaleYSD((i*2.5)/1000.0 - 0.5)
    var hex = "#" + ("000000" + rgbToHex(p[0], p[1], p[2])).slice(-6);
    // console.log(hex);
    colorDomain.push((i*2.5)/1000.0 - 0.5);
    colorRange.push(hex);
  };
  colorScale.range(colorRange).domain(colorDomain);
  colorRange.forEach(function(d,i){
    colorRef[d] = colorDomain[i];
  })
    if( colorRange.length > 2 ){
      nearest = nearestColor.from( colorRange );
    }
    bar = true;
}


 function rgbToHex(r, g, b) {
      if (r > 255 || g > 255 || b > 255)
          throw "Invalid color component";
      return ((r << 16) | (g << 8) | b).toString(16);
  }

 function drawLine(x1,x2,y1,y2){
     svg.append("line")
     .attr("x1", x1)
     .attr("x2", x2)
     .attr("y1", y1)
     .attr("y2", y2)
     .style("stroke", "green");
 }

function dragstarted(d) {
  d3.select(this).raise().classed("active", true);
}

function dragged(d) {
  d3.select(this).attr("cx", d3.event.x).attr("cy", d3.event.y);
}

function dragended(d) {
  d3.select(this).classed("active", false);
}

function markPoint(x,y){
     svg.append("circle")
     .attr("cx", x)
     .attr("cy", y)
     .attr("r", 5)
     .style("fill", "gray")
     .on("click",function(d){
       d3.select(this).remove();
     })
		 .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));
 }


function printData(dataTableId){
     var tableText = "<table id=dataTable><thead><tr><th>X</th><th>Y</th><th>Value</th></tr></thead><tbody>"
     svg.selectAll("circle").each(function(d,i) {
       var p = context.getImageData(d3.select(this).attr('cx'), d3.select(this).attr('cy'), 1, 1).data;
       var hex = "#" + ("000000" + rgbToHex(p[0], p[1], p[2])).slice(-6);
       var result = colorRef[nearest(hex)];
        tableText+='<tr><td>'+xScale(d3.select(this).attr('cx')).toFixed(3)+'</td><td>'+yScale(d3.select(this).attr('cy')).toFixed(3)+'</td><td>'+result.toFixed(3)+'</td></tr>'
     });
     tableText+='</tbody></table>'
     document.getElementById(dataTableId).innerHTML = tableText;
     $('#dataTable').DataTable({
         dom: 'Bfrtip',
         buttons:['csv','excel','copy']
      }
     );
 }

function resetData(dataTableId){
     data=[];
     document.getElementById(dataTableId).innerHTML = "";
     svg.selectAll("circle").remove();
     svg.selectAll("line").remove();
 }

function canny(b, l, h) {
     //Get the dimensions of the photo currently on the canvas
     var width = canvas.width;
     var height = canvas.height;
     console.log('in canny width,height:',width, height)
     console.log('in canny ',xmin, xmax, ymin, ymax)
     var data_type = jsfeat.U8_t | jsfeat.C1_t;
     var img = image;

     var data_buffer = new jsfeat.data_t(width * height);
     var img_u8 = new jsfeat.matrix_t(width, height, data_type, data_buffer);
     var imageData = context.getImageData(0, 0, width, height);
     console.log(imageData);

     //Convert to grascale(needed for other methods)
     jsfeat.imgproc.grayscale(imageData.data, width, height, img_u8);

     //Control level of detail in edge detection
     var blurLevel;
     var lowThreshold;
     var highThreshhold;

     if (b == undefined)
         blurLevel = 2;
     else
         blurLebel = b;
     if (l == undefined)
         lowThreshold = 40;
     else
         lowThreshold = l;
     if (h == undefined)
         highThreshhold = 100;
     else
         highThreshhold = h;

     //Gaussian Blur to reduce noise
     var r = blurLevel | 0;
     var kernel_size = (r + 1) << 1;
     jsfeat.imgproc.gaussian_blur(img_u8, img_u8, kernel_size, 0);

     //Reduce image to edges
     jsfeat.imgproc.canny(img_u8, img_u8, lowThreshold | 0, highThreshhold | 0);

     //print the detected edges
     //TODO turn this into a "proposed" grid!
     //restrict edges to defined between x-axis and y-axis
     //draw grid on canvas
     var xPoints = {}
     for(var x = 0; x < img_u8.cols; x++){
         xPoints[x] = 0;
     }
     var yPoints = {}
     for( var y =0; y< img_u8.rows; y++) {
         yPoints[y] = 0;
     }
     for(var x = 0; x < img_u8.cols; x++){
         for( var y =0; y< img_u8.rows; y++) {
             var ind =  x + y*img_u8.rows;
             if (x < xmax && x > xmin && y < ymax && y > ymin && img_u8.data[ind] != 0 ) {
               xPoints[x] += 1;
               yPoints[y] += 1;
             }
         }
     }
     //DRAW GRIDLINES AND PUT DOTS ON MIDDLES OF SQUARES!
     var xthreshold = (ymax-ymin)/3;
     var ythreshold = (xmax-xmin)/3;
     var gap = 3;
     var xArray = [];
     var yArray = [];

     for(var x = 0; x < img_u8.cols; x++){
         if (xPoints[x] > xthreshold) {
             xArray.push(x);
             drawLine(x, x, ymin,ymax);
         }
     }
     for(var y = 0; y < img_u8.rows; y++){
         if (yPoints[y] > ythreshold) {
             yArray.push(y);
             // drawLine(xmin,xmax,y, y);
         }
     }
     for (var i =0; i < xArray.length-1;i++){
         for (var j =0;j<yArray.length-1;j++){
             if (xArray[i+1] - xArray[i] > gap && yArray[j+1]-yArray[j] > gap)  {
                 var xpos = (xArray[i]+xArray[i+1])/2.0;
                 var ypos = (yArray[j]+yArray[j+1])/2.0;
                 samplePoints.push([xpos,ypos]);
                 var p = context.getImageData(xpos, ypos, 1, 1).data;
                 var hex = "#" + ("000000" + rgbToHex(p[0], p[1], p[2])).slice(-6);
                 data.push([xScale(xpos), yScale(ypos), colorRef[nearest(hex)]]);
                 markPoint(xpos, ypos);
             }
         }
     }

     //Render the image data back to canvas
     var data_u32 = new Uint32Array(imageData.data.buffer);
     var alpha = (0xff << 24);
     var i = img_u8.cols * img_u8.rows,
         pix = 0;
     while (--i >= 0) {
         pix = img_u8.data[i];
         data_u32[i] = alpha | (pix << 16) | (pix << 8) | pix;
     }
     //Put the edited image on the canvas
     //context.putImageData(imageData, 0, 0);
 }

var svg = d3.select("svg");
// We initially generate a SVG group to keep our brushes' DOM elements in:
var gBrushes = svg.append('g')
  .attr("class", "brushes");

var canvas = document.querySelector("canvas"),
    context = canvas.getContext("2d"),
    width = canvas.width,
    height = canvas.height;
$('#status').text('Click and drag over the color bar to set color scale');
var brush = d3.brush()
    .on("end", setColorScale);

var brushX = d3.brushX()
	.on("end",setXscale);

var brushY = d3.brushY()
	.on("end",setYscale);

var brushNode,
	oldMousedown;

var	bar   = false;
var xset = false;
var yset = false;
var data = [];
var addPoints = false;

var xScale = d3.scaleLinear().domain([0,width]).range([0,10]);
var yScale = d3.scaleLinear().domain([0,height]).range([0,10]);

var colorScale = d3.scaleLinear().domain([0,1]);
var nearest = nearestColor;
var colorRef;

var xmin = 0; //saving the ranges of the graph for auto detect
var xmax = 0;
var ymin = 0;
var ymax = 0;
var samplePoints=[]; //store the autodetected points for sampling




var image = new Image;
image.src = "image.png";
image.onload = loadImageToCanvas;


svg.on("click", function() {
    if (addPoints){
      $('#status').text('Data point clicked');
      var pos = findPos(canvas);
      var x = d3.event.pageX - pos.x;
      var y = d3.event.pageY - pos.y;
      var coord = "x=" + x + ", y=" + y;
      var p = context.getImageData(x, y, 1, 1).data;
      var hex = "#" + ("000000" + rgbToHex(p[0], p[1], p[2])).slice(-6);
      //console.log([coord,hex].join(" ")+nearest(hex) + ":" + colorRef[nearest(hex)]);
      d3.select("#color-block")
        .style("background-color",hex);
      d3.select("#color-value")
        .text(colorRef[nearest(hex)].toFixed(3));
      d3.select("#color-hex")
        .text(hex);
      markPoint(x,y);
    }
});
