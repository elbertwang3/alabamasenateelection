var width = window.innerWidth / 2,
height = window.innerHeight,
margin = {top: 50, bottom: 50, left: 50, right: 50},
container = $('#container'),
scrollTop = container.scrollTop()
svg = d3.select('#sticky')
	.append("svg")
	.attr("width", width)
	.attr("height", height)

var tooltip = d3.select("body")
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
	//console.log($(this).position().top-height/2)
	//console.log($(this).position().top)
	cutoffs.push($(this).position().top)
})






var colorScale = d3.scaleLinear()
					.domain([0.810500,0, -0.765782])
					.range(["#f55","#f5f5f5","#1055fa"]);



d3.json('alabama/mergedalabama2.json', function(data) {
	console.log(data);
	var projection = d3.geoMercator()
    .scale(1)
    .translate([0, 0]);

	// Create a path generator.
	var path = d3.geoPath()
	    .projection(projection);

	// Compute the bounds of a feature of interest, then derive scale & translate.
	var b = path.bounds(topojson.feature(data, data.objects.alabama)),
	    s = .9 / Math.max((b[1][0] - b[0][0]) / width, (b[1][1] - b[0][1]) / height),
	    t = [(width - s * (b[1][0] + b[0][0])) / 2, (height - s * (b[1][1] + b[0][1])) / 2];
	 
	    console.log(s)
	    console.log(t)
	// Update the projection to use computed scale & translate.
	projection
	    .scale(s)
	    .translate(t); 

	data.objects.alabama.geometries.map(function(d) { return d.properties['presturnout'] - d.properties['senateturnout'];})
	console.log(data.objects.alabama.geometries)
	/*var turnoutScale = d3.scaleQuantile()
					.domain(data.features.map(function(d) { return d.properties['presturnout'] - d.properties['senateturnout'];}))
					.range(["#ff3333",'#FD5353','#FC7474','#FA9494','#F8B4B4','#F7D5D5',"#f5f5f5"]);*/
	var turnoutScale = d3.scaleThreshold()
					.domain([0.2,0.25,0.3,0.35])
					.range(['#F6DEDE','#F9B0B0','#FC8383','#FF5555']);
	counties = svg.append("g")
	      .attr("class", "counties")
	      //.attr("transform", "translate("+margin.left + ", " + margin.top+")")
	counties.selectAll("path")
	    .data(topojson.feature(data, data.objects.alabama).features)
	    .enter().append("path")
	      .attr("fill", function(d) { return colorScale(d.properties['percentmoorevotes']-d.properties['percentjonesvotes']); })
	      .attr("d", path)
	      .attr("stroke", "none")
	      .attr("class", "county")
	      .on("mouseover", function(d) {
	      	//console.log(d.properties['countyname'])
	      	 d3.select(this.parentNode.appendChild(this))
	      	 	
        		.attr('stroke','black')
        		.attr("stroke-width", "2px")
		 	data = d.properties;
		 	d3.select(this).classed("hover", true);
		 	mouseOverEvents(data,d3.select(this));
		

		})
		.on("mouseout", function(d) {
			 d3.select(this)

        		.attr("stroke", "none")
		 	data = d.properties;
		 	d3.select(this).classed("hover", false);
		 	mouseOutEvents(data,d3.select(this));

		}) 
	counties.append("path")
		.attr("class","county-border")
		.attr("d", path(topojson.mesh(data, data.objects.alabama, function(a, b) { return a !== b; })));

	     // .attr("stroke", "#aaa")
	    
	    //.append("title")
	      //.text(function(d) { return d.rate + "%"; });
	container.scroll(function() { 
	
	    scrollTop = container.scrollTop()
	    //console.log(scrollTop);
	    if (scrollTop > cutoffs[0] && scrollTop < cutoffs[1]) {
	
	    	d3.selectAll(".county")
	    		.transition()
	    		.duration(1500)
	    		.attr("fill", function(d) { return colorScale(d.properties['percentmoorevotes']-d.properties['percentjonesvotes']); })
		}
	    else if (scrollTop > cutoffs[1] && scrollTop < cutoffs[2]) {
	    	d3.selectAll(".county")
	    		.transition()
	    		.duration(1500)
	    		.attr("fill", function(d) { return colorScale(d.properties['percenttrumpvotes']-d.properties['percentclintonvotes']); })
		}	
		else if (scrollTop > cutoffs[2] && scrollTop < cutoffs[3]) {
	    	 d3.selectAll(".county")
	    		.filter(function(d) { 
	    			
	    			return ((d.properties['percenttrumpvotes'] > d.properties['percentclintonvotes']) 
	    				&& (d.properties['percentmoorevotes'] < d.properties['percentjonesvotes']));
	    		})
	   		.transition()
	   			.delay(1500)
	    		.duration(1500)
	    		.attr("fill", function(d) { return colorScale(d.properties['percentmoorevotes']-d.properties['percentjonesvotes']); })
	
	    	d3.selectAll(".county")
	    		.filter(function(d) { 
	    			return !((d.properties['percenttrumpvotes'] > d.properties['percentclintonvotes']) 
	    				&& (d.properties['percentmoorevotes'] < d.properties['percentjonesvotes']));
	    		})
	    		.transition()
	    		.duration(1500)
	    		.attr("fill", "#ececec")   		
		}	
		else if (scrollTop > cutoffs[3] && scrollTop < cutoffs[4]) {
	    	d3.selectAll(".county")
	    		.transition()
	    		.duration(1500)
	    		.attr("fill", function(d) {  return turnoutScale(d.properties['presturnout'] - d.properties['senateturnout'])})
		}
	});
	function mouseOverEvents(data, element) {
    	tooltip.selectAll("div").remove();
    	var tooltipcontainer = tooltip.append("div");
					

      	tooltipcontainer.append("div")
						.attr("class", "county-name")
						.text(function () { return data['countyname']; })
						
      	
      	tooltip
          .style("visibility","visible")
          .style("top",function(d){
            /*if(viewportWidth < 450 || mobile){
              return "250px";
            }*/
            return (d3.event.pageY)+ 15+"px"
          })
          .style("left",function(d){
            /*if(viewportWidth < 450 || mobile){
              return "0px";
            }*/
            return (d3.event.pageX) +"px";
          })

    }
    function mouseOutEvents(data, element) {
    	tooltip
       		.style("visibility",null);
	}

})