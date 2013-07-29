var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 960 - margin.left - margin.right,
    height = 700 - margin.top - margin.bottom;

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

var projection = d3.geo.mercator()
    .scale(2000)
    .center([0, 28.5])
    .rotate([-31.25, 0])
    .translate([width / 2, height / 2]);


var color = d3.scale.linear()
    .domain([0,5,10,15,20,25,30,35,500])
    .range(["#ffffd9","#edf8b1","#c7e9b4","#7fcdbb","#41b6c4","#1d91c0","#225ea8","#253494","#081d58"])
    .interpolate(d3.interpolateLab);



var hexbin = d3.hexbin()
    .size([width, height])
    .radius(10);

var points = new Array();

// var randomX = d3.random.normal(31, 5),
//     randomY = d3.random.normal(28, 5),
//     points = d3.range(2000).map(function() { return projection([randomX(), randomY()]); });

plotmap = function(collection)
{
  svg.selectAll('path')
  .data(collection.features)
  .enter().append('path')
  .attr('d', d3.geo.path().projection(projection))
  .style('fill', '#66CD00')
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

plothex = function(collection)
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
    .style("fill", function(d) { return color(d.length); })
};


d3.json('data/EGY_adm0.json', function(collection) 
{
  plotmap(collection);
});

d3.json('data/testfile.json', function(collection)
{
  // points = projection([collection.Latitude,collection.Longitude]);
  for(i in collection)
  {
    points[i] = projection([collection[i].Longitude,collection[i].Latitude]);
  }
  // plotcircles(points);
});

function drawcircles()
{
  plotcircles(points);
}

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
