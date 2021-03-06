var minDate = new Date("2012-06-01");
var maxDate = new Date("2013-07-08");
var margin = {
	top: 20,
	bottom: 20,
	left: 30,
	right: 30
};
var height = 600 - margin.top - margin.bottom;
var width = 400 - margin.left - margin.right; 
var increment = 5; 
var orange = "#FECC5C",
	blue = "#41B6C4";
	green = "#7FC97F",
	red = "#FDC086",
	purple = "#BEAED4",
	icewsColor=blue,
	gdeltColor=orange;
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

	var series = ["gdelt", "icews"].map(function(source){
			return ["anti", "govt"].map(function(sender){
				return dayCounts.map(function(d){
					return {date: d["date"], count: d[source][sender], source: source, sender: sender};
				});
			});
		});

	var xAxisScale = d3.scale.linear()
		.domain([0, countMaxRounded])
		.range([0, width/2]);

	var xAxisScaleNeg = d3.scale.linear()
		.domain([countMaxRounded, 0])
		.range([-width/2, 0]);

	var yAxisScale = d3.time.scale()
		.domain([minDate, maxDate])
		.range([margin.top, height]);

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
		.ticks(d3.time.months, 1)
		.orient("left")
		.tickSize(50, 0, 0);

	var zoom = d3.behavior.zoom()
		.y(yAxisScale)
		.scaleExtent([1, 10])
		.translate([0, 0])
		.on("zoom", zoomed);

	var svgContainer = d3.select("body").append("svg")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
		.append("g")
			.attr("transform", "translate("+margin.left+","+margin.top+")")
			.call(zoom);

	svgContainer.append("svg:rect")
		.attr("width", width)
		.attr("height", height)
		.attr("class", "plot")
		.attr("fill", "#fff");

	var h = (height/daySeq.length)*0.5;

	var rects = svgContainer.selectAll(".series")
			.data(series)
		.enter().append("g")
			.attr("class", "series")
		.selectAll(".source")
			.data(function(d) { return d; })
		.enter().append("g")
			.attr("class", "source")
		.selectAll(".sender")
			.data(function(d) { return d; })
		.enter().append("rect")
			.attr("class", function(d) {return d.source + d.sender;})
			.attr("x", function(d){
				var x;
				if(d.sender=="govt"){ 
					x = width/2;
				} else {
					x = (width/2) - xAxisScale(	d.count);
				}
				return x;
			})
			.attr("y", function(d){ 
				var dy = yAxisScale(d.date);
				if(d.source=="icews"){ dy = dy + h; }
				return dy; 
			})
			.attr("height", h)
			.attr("width", function(d){ return xAxisScale(d.count);})
			.attr("fill", function(d){
				var col;
				if(d.source=="gdelt"){
					col=gdeltColor;
				} else {
					col=icewsColor;
				}
				return col;
			})
		.on("mouseover", function(d){
			tooltip.transition()
				.duration(200)
				.style("opacity", .9)
			tooltip.html(formatTime(d.date) + "<br/>" + d.count + " events (" + d.source.toUpperCase() + ")")
				.style("left", (d3.event.pageX ) +"px")
				.style("top", (d3.event.pageY ) +"px") 
		})
		.on("mouseout", function(d){
			tooltip.transition()
				.duration(400)
				.style("opacity", 0)
		});

	svgContainer.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(" + (width/2) + "," + (height) + ")")
		.call( xAxisRight );

	svgContainer.append("g")
		.attr("class", "x axis left")
		.attr("transform", "translate(" + (width/2) + "," + (height) + ")")
		.call( xAxisLeft );

	svgContainer.append("g")
		.attr("class", "y axis")
		.attr("transform", "translate(" + width/2 + ",0)")
		.call( yAxis);

	var textLabels = [
		{
			"lab": "Protests",
			"color": "black",
			"x": width/4,
			"y": 0,
			"anchor": "middle"
		},
		{
			"lab": "Repression",
			"color": "black",
			"x": 3*width/4,
			"y": 0,
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

	function zoomed(){
		var t = d3.event.translate,
			s = d3.event.scale;
		t[1] = Math.min(t[1], 0);
		t[1] = Math.max(t[1], height-(yAxisScale(maxDate)*s) );
		zoom.translate(t);
		svgContainer.select(".y.axis").call(yAxis);
		svgContainer.select(".x.axis").call(xAxisRight);
		svgContainer.select(".x.axis.left").call(xAxisLeft);
		rects.attr("y", function(d){ 
				var dy = yAxisScale(d.date);
				if(d.source=="icews"){ dy = dy + (h*s); }
				return dy; 
			})
			.attr("height", h*s);		
		datelabs.attr("y", function(d){ return yAxisScale(d.date); })
	}
}
