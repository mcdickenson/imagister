var rectHeights = [30, 20, 10];

var svgContainer = d3.select("body").append("svg")
	.attr("width", 200)
	.attr("height", 200);

var line = svgContainer.append("line")
	.attr("x1", 10)
	.attr("y1", 100)
	.attr("x2", 70)
	.attr("y2", 100)
	.attr("stroke-with", 2)
	.attr("stroke", "black");


var rects = svgContainer.selectAll("rect")
	.data(rectHeights)
	.enter()
	.append("rect");

var rectAttributes = rects
	.attr("x", function(d) { return d*2; } )
	.attr("y", function(d) { return 100-d;} )
	.attr("width", 10)
	.attr("height", function(d) { return d; 
	});