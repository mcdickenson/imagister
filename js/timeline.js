var minDate = new Date("2012-06-01");
var maxDate = new Date("2012-06-04");
var height = 100;
var width = 200; 
var increment = 5; 
var green = "#7FC97F",
	icewsColor=green;
var purple = "#BEAED4",
	gdeltColor=purple;
var red = "#FDC086"; 

var records=[
	{
		"SenderActor": "anti",
		"Action": "protest",
		"ReceiverActor": "govt",
		"Date": "2012-06-01",
		"Latitude": 30.05,
		"Longitude": 31.25,
		"Country": "Egypt",
		"Source": "gdelt"
	},
	{
		"SenderActor": "anti",
		"Action": "protest",
		"ReceiverActor": "govt",
		"Date": "2012-06-02",
		"Latitude": 29.9737,
		"Longitude": 32.5263,
		"Country": "Egypt",
		"Source": "gdelt"
	},
	{
		"SenderActor": "anti",
		"Action": "protest",
		"ReceiverActor": "govt",
		"Date": "2012-06-02",
		"Latitude": 30.05,
		"Longitude": 31.25,
		"Country": "Egypt",
		"Source": "gdelt"
	},
	{
		"SenderActor": "anti",
		"Action": "protest",
		"ReceiverActor": "govt",
		"Date": "2012-06-02",
		"Latitude": 30.0626,
		"Longitude": 31.2497,
		"Country": "Egypt",
		"Source": "icews"
	},
	{
		"SenderActor": "govt",
		"Action": "repress",
		"ReceiverActor": "anti",
		"Date": "2012-06-02",
		"Latitude": 30.05,
		"Longitude": 31.25,
		"Country": "Egypt",
		"Source": "gdelt"
	},
	{
		"SenderActor": "govt",
		"Action": "repress",
		"ReceiverActor": "anti",
		"Date": "2012-06-02",
		"Latitude": 29.9737,
		"Longitude": 32.5263,
		"Country": "Egypt",
		"Source": "gdelt"
	},
	{
		"SenderActor": "govt",
		"Action": "repress",
		"ReceiverActor": "anti",
		"Date": "2012-06-02",
		"Latitude": 30.05,
		"Longitude": 31.25,
		"Country": "Egypt",
		"Source": "gdelt"
	},
	{
		"SenderActor": "govt",
		"Action": "repress",
		"ReceiverActor": "anti",
		"Date": "2012-06-03",
		"Latitude": 30.05,
		"Longitude": 31.25,
		"Country": "Egypt",
		"Source": "gdelt"
	},
	{
		"SenderActor": "govt",
		"Action": "repress",
		"ReceiverActor": "anti",
		"Date": "2012-06-03",
		"Latitude": 30.05,
		"Longitude": 31.25,
		"Country": "Egypt",
		"Source": "icews"
	},
	{
		"SenderActor": "govt",
		"Action": "repress",
		"ReceiverActor": "anti",
		"Date": "2012-06-04",
		"Latitude": 30.05,
		"Longitude": 31.25,
		"Country": "Egypt",
		"Source": "icews"
	},
	{
		"SenderActor": "govt",
		"Action": "repress",
		"ReceiverActor": "anti",
		"Date": "2012-06-04",
		"Latitude": 30.05,
		"Longitude": 31.25,
		"Country": "Egypt",
		"Source": "icews"
	},
	{
		"SenderActor": "govt",
		"Action": "repress",
		"ReceiverActor": "anti",
		"Date": "2012-06-04",
		"Latitude": 30.05,
		"Longitude": 31.25,
		"Country": "Egypt",
		"Source": "icews"
	}
];

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
	dayCounts[i] = { "date": daySeq[i],
									 "index": i,
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

var countMax = 0; 
for(var i=0; i<records.length; i++){
	var ix = daySeq.indexOf((new Date(records[i].Date)).toDateString());
	dayCounts[ix][records[i].Source][records[i].SenderActor] += 1
	var mag = dayCounts[ix][records[i].Source][records[i].SenderActor];
	if( mag > countMax){ countMax=mag; }
}
countMaxRounded = Math.ceil(countMax/increment)*increment;
// console.log(dayCounts);
// console.log(countMax);
// console.log(countMaxRounded);

var xAxisScale = d3.scale.linear()
	.domain([0, countMaxRounded])
	.range([0, width/2]);

var xAxisScaleNeg = d3.scale.linear()
	.domain([countMaxRounded, 0])
	.range([-width/2, 0]);

var yAxisScale = d3.scale.linear()
	.domain([0, daySeq.length])
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
	.tickValues([])
	.tickFormat(d3.format(".0f"))
	.tickSize(0, 0, 0)
	.orient("left");

var svgContainer = d3.select("body").append("svg")
	.attr("width", width)
	.attr("height", height+50);

var icewsGov = svgContainer.selectAll(".icewsGov")
	.data(dayCounts)
	.enter()
	.append("rect")
	.attr("class", "icewsGov")
	.attr("x", 100)
	.attr("y", function(d) { return yAxisScale(d.index); } )
	.attr("width", function(d) { return xAxisScale(	d["icews"]["govt"]); })
	.attr("height", height/daySeq.length)
	.attr("fill", icewsColor);

var icewsAnti = svgContainer.selectAll(".icewsAnti")
	.data(dayCounts)
	.enter()
	.append("rect")
	.attr("class", "icewsAnti")
	.attr("x", function(d) { return 100 - xAxisScale(	d["icews"]["anti"]);})
	.attr("y", function(d) { return yAxisScale(d.index); } )
	.attr("width", function(d) { return xAxisScale(	d["icews"]["anti"]); })
	.attr("height", height/daySeq.length)
	.attr("fill", icewsColor);

var gdeltGov = svgContainer.selectAll(".gdeltGov")
	.data(dayCounts)
	.enter()
	.append("rect")
	.attr("class", "gdeltGov")
	.attr("x", 100)
	.attr("y", function(d) { return yAxisScale(d.index); } )
	.attr("width", function(d) { return xAxisScale(	d["gdelt"]["govt"]); })
	.attr("height", height/daySeq.length)
	.attr("fill", gdeltColor);

var gdeltAnti = svgContainer.selectAll(".gdeltAnti")
	.data(dayCounts)
	.enter()
	.append("rect")
	.attr("class", "gdeltAnti")
	.attr("x", function(d) { return 100 - xAxisScale(	d["gdelt"]["anti"]);})
	.attr("y", function(d) { return yAxisScale(d.index); } )
	.attr("width", function(d) { return xAxisScale(	d["gdelt"]["anti"]); })
	.attr("height", height/daySeq.length)
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
		"lab": "GDELT",
		"color": gdeltColor,
		"x": width/3,
		"y": height+30,
		"anchor": "middle"
	}, 
	{
		"lab": "ICEWS",
		"color": icewsColor,
		"x": 2*width/3,
		"y": height+30,
		"anchor": "middle"
	},
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
		"x": 2*width/3,
		"y": 10,
		"anchor": "left"
	}];
// console.log(textLabels);

var text = svgContainer.selectAll(".textLabel")
	.data(textLabels)
	.enter()
	.append("text")
	.attr("class", "textLabel")
	.attr("x", function(d) { return d.x; })
	.attr("y", function(d) { return d.y; })
	.text( function(d) { return d.lab; })
	.attr("fill", function(d) { return d.color; })
	.attr("text-anchor", function(d) { return d.anchor; });

// todo: load json remotely
// todo: add some date labels