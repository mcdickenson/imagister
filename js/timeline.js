var minDate = new Date("2012-06-01");
var maxDate = new Date("2012-06-04");

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
									 "count": 0 };
}

for(var i=0; i<records.length; i++){
	var ix = daySeq.indexOf((new Date(records[i].Date)).toDateString());
	dayCounts[ix].count += 1;
}
console.log(dayCounts);

var xAxisScale = d3.scale.linear()
	.domain([0, 10])
	.range([0, 100]);

var yAxisScale = d3.scale.linear()
	.domain([0, 10])
	.range([0, 90]);

var xAxis = d3.svg.axis()
	.scale(xAxisScale)
	.tickValues([0,5])
	.tickFormat(d3.format(".0f"))
	.tickSize(5)
	.orient("bottom");

var yAxis = d3.svg.axis()
	.scale(yAxisScale)
	.tickValues([])
	.tickFormat(d3.format(".0f"))
	.tickSize(2)
	.orient("left");

var width=200;
var height=100;

var svgContainer = d3.select("body").append("svg")
	.attr("width", width)
	.attr("height", height);

svgContainer.append("svg:g")
	.attr("class", "x axis")
	.attr("transform", "translate(100,80)")
	.call( xAxis );

svgContainer.append("svg:g")
	.attr("class", "y axis")
	.attr("transform", "translate(100,-10)")
	.call( yAxis);

var rects = svgContainer.selectAll("rect")
	.data(dayCounts)
	.enter()
	.append("rect");

var rectAttributes = rects
	.attr("x", 100)
	.attr("y", function(d) { return d.index*10+10; } )
	.attr("width", function(d) { return xAxisScale(d.count); })
	.attr("height", 10);
// todo: scaling width by maximum 

