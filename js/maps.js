var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 960 - margin.left - margin.right,
    height = 700 - margin.top - margin.bottom;

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

var projection = d3.geo.mercator()
    .scale(3000)
    .center([0, 27])
    .rotate([-31, 0])
    .translate([width / 2, height / 2]);


var color = d3.scale.linear()
    .domain([0,5,10,15,20,25,30,35,500])
    .range(["#ffffd9","#edf8b1","#c7e9b4","#7fcdbb","#41b6c4","#1d91c0","#225ea8","#253494","#081d58"])
    .interpolate(d3.interpolateLab);



var hexbin = d3.hexbin()
    .size([width, height])
    .radius(10);

var points = new Array();
var highlightpoints = new Array();

// var randomX = d3.random.normal(31, 5),
//     randomY = d3.random.normal(28, 5),
//     points = d3.range(2000).map(function() { return projection([randomX(), randomY()]); });

plotmap = function(collection)
{
  svg.selectAll('path')
  .data(collection.features)
  .enter().append('path')
  .attr('d', d3.geo.path().projection(projection))
  .style('fill', '#222222')
  .style('stroke', 'white')
  .style('stroke-width', 1);
};

plotcircles = function(collection)
{ 
  svg.selectAll("circle")
  .data(collection)
  .enter()
  .append("circle")
  .attr("cx", function(d) {return d[0];})
  .attr("cy", function(d) {return d[1];})
  // .attr("transform", function(d) { return "translate(" + d[0] + "," + d[1] + ")"; })
  .attr("r", 5);
};

plothex = function(collection,color)
{
  // points = [collection.Latitude,collection.Longitude]
  // var points = [[collection.Latitude, collection.Longitude]];
  // points = [[collection.Longitude, collection.Latitude]];
  points = collection;
  svg.append("g")
    .attr("clip-path", "url(#clip)")
  .selectAll(".hexagon")
    .data(hexbin(points))
  .enter().append("path")
    .attr("class", "hexagon")
    .attr("d", hexbin.hexagon())
    .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
    // .style("fill", function(d) { return color(d.length); })
    .style("fill",color)
};


svg.append("rect")
  .attr("x",0)
  .attr("y",0)
  .attr("height",height)
  .attr("width",width)
  .attr("fill","black");

d3.json('data/Egypt_Region.json', function(collection) 
{
  plotmap(collection);
});

d3.json('data/testfile.json', function(collection)
{
  for(i in collection)
  {
    points[i] = projection([collection[i].Longitude,collection[i].Latitude,collection[i].Date,collection[i].Sender,collection[i].Action,collection[i].Source]);
  }
  // plotcircles(points);
    plothex(points,"gray");
    dailyhex("2012-06-02","govt","repress","icews");
});

function drawcircles()
{
  plothex(points,"gray");
}


function dailyhex(date,sender,action,source)
{
  for(i in points)
  {
    if(points[2]==date && points[3]==sender && points[4]==action && points[5]==source)
    {
      highlightpoints.push(points[0],points[1]);
    }
  }
  plothex(highlightpoints,"red");
}


// dailyhex("2012-06-02","govt","repress","icews");

// );


// var records; 
// d3.json("testfile.json", function(error, json){
//   if(error){ return console.warn(error); }
//   records = json; 
//   visualize(records);
// });


// var randomX = d3.random.normal(width / 2, 80),
//     randomY = d3.random.normal(height / 2, 80),
//     points = d3.range(100).map(function() { return [randomX(), randomY()]; });
