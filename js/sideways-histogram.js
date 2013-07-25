var counts = [
	{
		"count": 10
	},
	{
		"count": 20 
	},
	{
		"count": 30
	}
];

var toLeftX = function(d){
	return 100-d;
}

var toRightX = function(d){
	return 100;
}

var leftOrRight = function(d){
	if(d===30){ xPlacement = toLeftX(d); 
	} else if(d===20){ xPlacement = toRightX(d); 
	} else if(d===10){ xPlacement = toLeftX(d); }
	return xPlacement;
}

var svgContainer = d3.select("body").append("svg")
	.attr("width", 200)
	.attr("height", 200);

var line = svgContainer.append("line")
	.attr("x1", 100)
	.attr("y1", 10)
	.attr("x2", 100)
	.attr("y2", 70)
	.attr("stroke-with", 2)
	.attr("stroke", "black");

var rects = svgContainer.selectAll("rect")
	.data(counts)
	.enter()
	.append("rect");

var rectAttributes = rects
	.attr("x", function(d) { return leftOrRight(d.count)})
	.attr("y", function(d) { return d.count*2; } )
	.attr("width", function(d) { return d.count; })
	.attr("height", 10);