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

var colorscale = d3.scale.linear()
    .domain([0,3,6,9,12])
    .range(["#C6DBEF","#9ECAE1","#6BAED6","#2182BD","#08519C"])
    .interpolate(d3.interpolateLab);

var hexbin = d3.hexbin()
    .size([width, height])
    .radius(10);

var mapbackground = "black",
    mapforeground = "#222222",
    maplinecolor =  "white";


var json;

svg.append("rect")
  .attr("x",0)
  .attr("y",0)
  .attr("height",height)
  .attr("width",width)
  .attr("fill",mapbackground);

plotmap = function(collection)
{
  svg.selectAll('path')
  .data(collection.features)
  .enter().append('path')
  .attr('d', d3.geo.path().projection(projection))
  .style('fill', mapforeground)
  .style('stroke', maplinecolor)
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
  .attr("r", 5);
};

plothex = function(collection,color,classtype)
{
  points = collection;
  svg.append("g")
    .attr("clip-path", "url(#clip)")
  .selectAll(".hexagon")
    .data(hexbin(points))
  .enter().append("path")
    .attr("class", "hexagon")
    .attr("id", classtype)
    .attr("d", hexbin.hexagon())
    .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
    // .style("fill", function(d) { return color(d.length); })
    .style("fill",color)
};

d3.json('data/Egypt_Region.json', function(collection) 
{
  plotmap(collection);
});


d3.json('data/testfile.json', function(collection)
{
  json = collection;
  points = getpoints();
  plothex(points,"#444444","basehex");
});


function getpoints(date,sender,source)
{

  // THIS FUNCTION TAKES IN date, sender, source AND RETURNS PROJECTED [Long,Lat] 
  // THIS FUNCTION DEFAULTS TO 'all' IF ANY ARGUMENTS ARE NOT SUPPLIED

  if(typeof(date)==='undefined') date = "all";
  if(typeof(sender)==='undefined') sender = "all";
  if(typeof(source)==='undefined') source = "all";

  points = new Array();
  for(i in json)
  {
    if( (json[i].Date==date || date=="all") && (json[i].SenderActor==sender || sender=="all") && (json[i].Source==source || source=="all"))
    {
      points[i] = projection([json[i].Longitude,json[i].Latitude])
    }
  }
  return(points)
}


function highlighthexes(date,sender,source,color)
{
  if(typeof(color)==='undefined') color = function(d) { return colorscale(d.length); };

  var highlightedhexes = svg.selectAll("#highlighthex");
  highlightedhexes.remove();
  newpoints = getpoints(date,sender,source);
  plothex(newpoints,color,"highlighthex");
}

function legend(colorlist,highlabel,lowlabel,title)
{

}