// Set up
var width = 900;
var height = 800;

// Draw SVG
var svg = d3.select("body").append("svg")
  .attr("width", width)
  .attr("height", height)
  .style('background-color', '#efefef');

var nodes = {};
var links = [];

function getHostname(url) {
  var urlElement = document.createElement('a');
  urlElement.href = url;
  return urlElement.hostname;
}

d3.json('http://www.freecodecamp.com/news/hot', function(data) {
  
  // Create links array 
  data.forEach(function(d) {
    var link = {
      source: d.author.username,
      target: getHostname(d.link),
      rank: d.rank,
      image: d.image,
      upvotes: d.upVotes.length
    };
    links.push(link);
  });

  // console.log(links);
  
  // Create nodes
  links.forEach(function(link) {
    // console.log(link);
    link.source = nodes[link.source] ||
      (nodes[link.source] = {
        nodeText: link.source,
        rank: link.rank,
        upvotes: link.upvotes,
        image: link.image
      });
    link.target = nodes[link.target] ||
      (nodes[link.target] = {
        nodeText: link.target
      });
  });
  
  // console.log(nodes);

  var force = d3.layout.force()
      .nodes(d3.values(nodes))
      .links(links)
      .size([width, height])
      .linkDistance(40)
      .charge(-150)
      .on("tick", tick)
      .start();

  var link = svg.selectAll(".link")
      .data(force.links())
    .enter().append("line")
      .attr("class", "link");

  var node = svg.selectAll(".node")
    .data(force.nodes())
    .enter().append("g")
    .attr("class", "node")

    /********** TOOLTIP **********/
    .on('mouseover', function(d) {
      // Show Tooltip Animation
      d3.select('#tooltip')
        .transition()
        .ease('quad')
        .duration(100)
        .style("opacity", 1);
      
      // Tooltip
      d3.select('#tooltip')
        .style("left", d.x + 55 + "px")
        .style("top", d.y + 35 + "px")
        .select("#value")
          .html('<strong class="nodeText">'+d.nodeText+'</strong>');
    })
    .on('mouseout', function(d) {
      // Hide Tooltip Animation
      d3.select('#tooltip')
        .transition()
        .ease('quad')
        .duration(100)
        .style("opacity", 0);
    })
    // Make the graph draggable
    .call(force.drag);
  
  // Size of circle representing the number 
  // of connections (weight of the node)
  node.append("circle")
    .attr("r", function(d) {
      return d.weight + 5;
    });
  
  // Define corrdinates of links and nodes
  function tick() {
    link
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node
        .attr("transform", function(d) {
          return "translate(" + d.x + "," + d.y + ")"; 
        });
  }
});