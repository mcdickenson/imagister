var minDate = new Date("2012-06-01");
var maxDate = new Date("2013-07-08");
var height = 1200;
var width = 400; 
var increment = 5; 
var green = "#7FC97F",
	icewsColor=green;
var purple = "#BEAED4",
	gdeltColor=purple;
var red = "#FDC086";
var formatTime = d3.time.format("%e %B");

var records; 
d3.json("data/testfile.json", function(error, json){
	if(error){ return console.warn(error); }
	records = json; 
	visualize(records);
});

Date.prototype.addDays = function(days) {
   var dat = new Date(this.valueOf())
   dat.setDate(dat.getDate() + days);
   return dat;
}

function getDates(startDate, stopDate) {
  var dateArray = new Array();
  var currentDate = startDate;
  while (currentDate <= stopDate) {
    dateArray.push(currentDate.toDateString());
    currentDate = currentDate.addDays(1);
  }
  return dateArray;
}

var daySeq = getDates(minDate, maxDate);

var dayCounts = [];

for(var i=0; i<daySeq.length; i++){
	dayCounts[i] = { "date": new Date(daySeq[i]),
									 "gdelt": {
									 		"anti": 0,
									 		"govt" :0
									 },
									 "icews": {
									 		"anti": 0,
									 		"govt": 0
									 }
									};
}

var visualize = function(records){
	var countMax = 0; 
	for(var i=0; i<records.length; i++){
		var ix = daySeq.indexOf((new Date(records[i].Date)).toDateString() );
		dayCounts[ix][records[i].Source][records[i].SenderActor] += 1
		var mag = dayCounts[ix][records[i].Source][records[i].SenderActor];
		if( mag > countMax){ countMax=mag; }
	}
	countMaxRounded = Math.ceil(countMax/increment)*increment;

	var xAxisScale = d3.scale.linear()
		.domain([0, countMaxRounded])
		.range([0, width/2]);

	var xAxisScaleNeg = d3.scale.linear()
		.domain([countMaxRounded, 0])
		.range([-width/2, 0]);

	var yAxisScale = d3.time.scale()
		.domain([minDate, maxDate])
		.range([0, height]);

	var xAxisRight = d3.svg.axis()
		.scale(xAxisScale)
		.ticks(3)
		.tickFormat(d3.format(".0f"))
		.tickSize(5)
		.orient("bottom");

	var xAxisLeft = d3.svg.axis()
		.scale(xAxisScaleNeg)
		.ticks(3)
		.tickFormat(d3.format(".0f"))
		.tickSize(5)
		.orient("bottom");

	var yAxis = d3.svg.axis()
		.scale(yAxisScale)
		.ticks(d3.time.years, 1)
		.orient("left")
		.tickSize(0, 0, 0);

	var svgContainer = d3.select("body").append("svg")
		.attr("width", width+40)
		.attr("height", height+60)
		.append("g")
			.attr("transform", "translate(30,20)");

	var h = (height/daySeq.length) * 0.5;

	var icewsGov = svgContainer.selectAll(".icewsGov")
			.data(dayCounts)
		.enter().append("rect")
			.attr("class", "icewsGov")
			.attr("x", width/2)
			.attr("y", function(d) { return yAxisScale(d.date) + h; } )
			.attr("width", function(d) { return xAxisScale(	d["icews"]["govt"]); })
			.attr("height", h)
			.attr("fill", icewsColor)
		.on("mouseover", function(d){
			tooltip.transition()
				.duration(200)
				.style("opacity", .9)
			tooltip.html(formatTime(d.date) + "<br/>" + d["icews"]["govt"] + " repressive acts")
				.style("left", (d3.event.pageX ) +"px")
				.style("top", (d3.event.pageY ) +"px") 
			})
		.on("mouseout", function(d){
			tooltip.transition()
				.duration(400)
				.style("opacity", 0)
		});

	var icewsAnti = svgContainer.selectAll(".icewsAnti")
		.data(dayCounts)
		.enter()
		.append("rect")
		.attr("class", "icewsAnti")
		.attr("x", function(d) { return (width/2) - xAxisScale(	d["icews"]["anti"]);})
		.attr("y", function(d) { return yAxisScale(d.date) + h; } )
		.attr("width", function(d) { return xAxisScale(	d["icews"]["anti"]); })
		.attr("height", h)
		.attr("fill", icewsColor);

	var gdeltGov = svgContainer.selectAll(".gdeltGov")
		.data(dayCounts)
		.enter()
		.append("rect")
		.attr("class", "gdeltGov")
		.attr("x", width/2)
		.attr("y", function(d) { return yAxisScale(d.date); } )
		.attr("width", function(d) { return xAxisScale(	d["gdelt"]["govt"]); })
		.attr("height", h)
		.attr("fill", gdeltColor);

	var gdeltAnti = svgContainer.selectAll(".gdeltAnti")
		.data(dayCounts)
		.enter()
		.append("rect")
		.attr("class", "gdeltAnti")
		.attr("x", function(d) { return width/2 - xAxisScale(	d["gdelt"]["anti"]);})
		.attr("y", function(d) { return yAxisScale(d.date); } )
		.attr("width", function(d) { return xAxisScale(	d["gdelt"]["anti"]); })
		.attr("height", h)
		.attr("fill", gdeltColor);

	svgContainer.append("svg:g")
		.attr("class", "x axis")
		.attr("transform", "translate(" + (width/2) + "," + (height) + ")")
		.call( xAxisRight );

	svgContainer.append("svg:g")
		.attr("class", "x axis left")
		.attr("transform", "translate(" + (width/2) + "," + (height) + ")")
		.call( xAxisLeft );

	svgContainer.append("svg:g")
		.attr("class", "y axis")
		.attr("transform", "translate(" + width/2 + ",0)")
		.call( yAxis);

	var textLabels = [
		{
			"lab": "Protests",
			"color": "black",
			"x": width/4,
			"y": 10,
			"anchor": "middle"
		},
		{
			"lab": "Repression",
			"color": "black",
			"x": 3*width/4,
			"y": 10,
			"anchor": "middle"
		}];

	var text = svgContainer.selectAll(".textLabel")
		.data(textLabels)
		.enter()
		.append("text")
		.attr("class", "textLabel")
		.attr("x", function(d) { return d.x; })
		.attr("y", function(d) { return d.y; })
		.attr("fill", function(d) { return d.color; })
		.attr("text-anchor", function(d) { return d.anchor; })
		.text( function(d) { return d.lab; });

	var dateLabels = [
		{
			"date": new Date("2012-07-04"),
			"text": "July 4",
			"anchor": "left"
		}];
	console.log(dateLabels);

	var datelabs = svgContainer.selectAll(".dateLabel")
		.data(dateLabels)
		.enter()
		.append("text")
		.attr("class", "dateLabel")
		.attr("x", width/2+10)
		.attr("y", function(d){ return yAxisScale(d.date); })
		.attr("fill", "black")
		.attr("text-anchor", function(d){ return d.anchor })
		.text(function(d) { return d.text; });

	var tooltip = d3.select("body").append("div")
		.attr("class", "tooltip")
		.style("opacity", 0);

}
