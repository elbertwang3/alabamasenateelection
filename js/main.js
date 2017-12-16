var width = window.innerWidth / 2,
height = window.innerHeight,
margin = {top: 50, bottom: 50, left: 50, right: 50},
container = $('#container'),
scrollTop = container.scrollTop()
console.log(scrollTop)
console.log(container)
svg = d3.select('#sticky')
	.append("svg")
	.attr("width", width)
	.attr("height", height)

var tooltip = d3.select("#sticky")
    .append("div")
    .attr("class","tooltip")
    //.style("transform", "translate(" + margin.left+"px" + "," + margin.top+"px" + ")")
    .on("click",function(){
      tooltip.style("visibility",null);
    });

var trump = d3.select("#trump")


/*console.log($('#title').position().top-height)
console.log($('#default').position().top-height)
console.log($('#trump').position().top-height)
console.log($('#flipflop').position().top-height)
console.log($('#turnoutchoropleth').position().top-height)
console.log($('#default').position().top-height)
console.log($('#default').position().top-height)
console.log($('#default').position().top-height)
console.log($('#default').position().top-height)*/
cutoffs = []
$(".panel").each(function() {
	console.log($(this).position().top-height/2)
	console.log($(this).position().top)
	cutoffs.push($(this).position().top-height/2)
	cutoffs.push($(this).position().top)
})

container.scroll(function() { 
	
    scrollTop = container.scrollTop()
    //console.log(scrollTop);
});
  


var colorScale = d3.scaleLinear()
					.domain([0.666136,0, -0.765782])
					.range(["#ff3333","#f5f5f5","#2161fa"]);

d3.json('alabama/mergedalabama.json', function(data) {
	var projection = d3.geoMercator()
    .scale(1)
    .translate([0, 0]);

// Create a path generator.
var path = d3.geoPath()
    .projection(projection);

// Compute the bounds of a feature of interest, then derive scale & translate.
var b = path.bounds(data),
    s = .9 / Math.max((b[1][0] - b[0][0]) / width, (b[1][1] - b[0][1]) / height),
    t = [(width - s * (b[1][0] + b[0][0])) / 2, (height - s * (b[1][1] + b[0][1])) / 2];
 

// Update the projection to use computed scale & translate.
projection
    .scale(s)
    .translate(t);  

	svg.append("g")
      .attr("class", "counties")
      //.attr("transform", "translate("+margin.left + ", " + margin.top+")")
		.selectAll("path")
    .data(data.features)
    .enter().append("path")
      .attr("fill", function(d) { return colorScale(d.properties['percentmoorevotes']-d.properties['percentjonesvotes']); })
      .attr("d", path)
     // .attr("stroke", "#aaa")
    
    //.append("title")
      //.text(function(d) { return d.rate + "%"; });

	

})