var minDate = new Date("2012-06-01");
var maxDate = new Date("2012-06-04");
var height = 100;
var width = 200; 
var increment = 5; 
var green = "#7FC97F";
var purple = "#BEAED4";
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
	.domain([-countMaxRounded, countMaxRounded])
	.range([-width/2, width/2]);

var yAxisScale = d3.scale.linear()
	.domain([0, daySeq.length])
	.range([0, height]);

var xAxis = d3.svg.axis()
	.scale(xAxisScale)
	.ticks(Math.ceil(countMax/increment))
	.tickFormat(d3.format(".0f"))
	.tickSize(5)
	.orient("bottom");

var yAxis = d3.svg.axis()
	.scale(yAxisScale)
	.tickValues([])
	.tickFormat(d3.format(".0f"))
	.tickSize(2)
	.orient("left");

var svgContainer = d3.select("body").append("svg")
	.attr("width", width+50)
	.attr("height", height+50);

svgContainer.append("svg:g")
	.attr("class", "x axis")
	.attr("transform", "translate(" + (width/2) + "," + (height) + ")")
	.call( xAxis );

svgContainer.append("svg:g")
	.attr("class", "y axis")
	.attr("transform", "translate(" + width/2 + ",0)")
	.call( yAxis);

var icewsGov = svgContainer.selectAll(".icewsGov")
	.data(dayCounts)
	.enter()
	.append("rect")
	.attr("class", "icewsGov")
	.attr("x", 100)
	.attr("y", function(d) { return yAxisScale(d.index); } )
	.attr("width", function(d) { return xAxisScale(	d["icews"]["govt"]); })
	.attr("height", height/daySeq.length)
	.attr("fill", green)
	.attr("opacity", 0.5);

var icewsAnti = svgContainer.selectAll(".icewsAnti")
	.data(dayCounts)
	.enter()
	.append("rect")
	.attr("class", "icewsAnti")
	.attr("x", function(d) { return 100 - xAxisScale(	d["icews"]["anti"]);})
	.attr("y", function(d) { return yAxisScale(d.index); } )
	.attr("width", function(d) { return xAxisScale(	d["icews"]["anti"]); })
	.attr("height", height/daySeq.length)
	.attr("fill", green)
	.attr("opacity", 0.5);

var gdeltGov = svgContainer.selectAll(".gdeltGov")
	.data(dayCounts)
	.enter()
	.append("rect")
	.attr("class", "gdeltGov")
	.attr("x", 100)
	.attr("y", function(d) { return yAxisScale(d.index); } )
	.attr("width", function(d) { return xAxisScale(	d["gdelt"]["govt"]); })
	.attr("height", height/daySeq.length)
	.attr("fill", purple)
	.attr("opacity", 0.5);

var gdeltAnti = svgContainer.selectAll(".gdeltAnti")
	.data(dayCounts)
	.enter()
	.append("rect")
	.attr("class", "gdeltAnti")
	.attr("x", function(d) { return 100 - xAxisScale(	d["gdelt"]["anti"]);})
	.attr("y", function(d) { return yAxisScale(d.index); } )
	.attr("width", function(d) { return xAxisScale(	d["gdelt"]["anti"]); })
	.attr("height", height/daySeq.length)
	.attr("fill", purple)
	.attr("opacity", 0.5);


