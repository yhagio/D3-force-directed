// Set up
var dataSource = 'https://raw.githubusercontent.com/DealPete/forceDirected/master/countries.json';

var width = 800;
var height = 600;

// Draw SVG
var body = d3.select(".graph")
var svg = body
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .style('background', 'linear-gradient(#efefef, #fff)');

d3.json(dataSource, function(data) {
  
  // Set up force layout
  var force = d3.layout.force()
      .nodes(data.nodes)
      .links(data.links)
      .size([width, height])
      .linkDistance(50) // distance between connected nodes
      .charge(-50) // acts like electrical charge on the nodes
      .on("tick", tick)
      .start();
  
  // Append links
  var link = svg.selectAll(".link")
    .data(data.links)
    .enter()
    .append("line")
    .attr("class", "link");
  
  // Append nodes (flags)
  var node = body.select('.flags').selectAll(".node")
    .data(data.nodes)
    .enter()
		.append('img')
		.attr('class', function(d) { 
      return 'flag flag-' + d.code })
    .attr({
      x: -5,
      y: -5,
      "width": 32,
      "height": 32,
    })

    // Tooltip
    .on('mouseover', function(d) {
      // Show Tooltip Animation
      d3.select('#tooltip')
        .transition()
        .ease('quad')
        .duration(100)
        .style("opacity", 1);
      
      // Tooltip
      d3.select('#tooltip')
        .style("left", (d.x + 10) + "px")
        .style("top", d.y + 30 + "px")
        .select("#value")
          .html('<strong class="nodeText">' + d.country + '</strong>');
    })
    .on('mouseout', function(d) {
      // Hide Tooltip Animation
      d3.select('#tooltip')
        .transition()
        .ease('quad')
        .duration(100)
        .style("opacity", 0);
    })
    // Make the d3 draggable
    .call(force.drag);
  
  // Define corrdinates of links and nodes
  function tick() {
    node
      .style('left', function(d) { return (d.x - 5) + "px" }) 
			.style('top', function(d) { return (d.y - 5) + "px" });

    link
      .attr("x1", function(d) { return d.source.x; })
      .attr("y1", function(d) { return d.source.y; })
      .attr("x2", function(d) { return d.target.x; })
      .attr("y2", function(d) { return d.target.y; });
  }
});
