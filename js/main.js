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
cutoffs = []
$(".panel").each(function() {
	//console.log($(this).position().top-height/2)
	//console.log($(this).position().top)
	cutoffs.push($(this).position().top)
})






var colorScale = d3.scaleLinear()
					.domain([0.810500,0, -0.765782])
					.range(["#f55","#f5f5f5","#1055fa"]);

annotations = svg.append("g")
	.attr("class", "annotations")
	.attr("transform", "translate(" + 2.8*width/5 + ", " + height/4 + ")")
	.attr("width" ,100)
	.attr("height", 300)
gannotation = annotations.selectAll(".sideAnnotation")
		.data(["Change in turnout from the 2016 Presidential Election", "Change in Republican vote from 2016 election"])
		.enter()
		.append("g")
		.attr("height", 100)
gannotation.append('text')
	.text(function(d) { return d;})
	.attr("y", function(d, i) { return i * height/3;})
	.attr("class", "annotation-label")
	.attr("dy", "1em")
	.call(wrap, 200)




d3.queue()
    .defer(d3.json, 'alabama/mergedalabama3.json')
    .defer(d3.csv, "data/bigcities.csv")
    .await(ready);
function ready(error,data, bigcities) {

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
	 
	  
	// Update the projection to use computed scale & translate.
	projection
	    .scale(s)
	    .translate(t); 

	data.objects.alabama.geometries.map(function(d) { return d.properties['presturnout'] - d.properties['senateturnout'];})
	/*var turnoutScale = d3.scaleQuantile()
					.domain(data.features.map(function(d) { return d.properties['presturnout'] - d.properties['senateturnout'];}))
					.range(["#ff3333",'#FD5353','#FC7474','#FA9494','#F8B4B4','#F7D5D5',"#f5f5f5"]);*/
	var turnoutScale = d3.scaleThreshold()
					.domain([0.2,0.25,0.3,0.35])
					.range(['#F6DEDE','#F9B0B0','#FC8383','#FF5555']);
	counties = svg.append("g")
	      .attr("class", "counties")
	      .attr("transform", "translate(-175,0)")
	counties.selectAll("path")
	    .data(topojson.feature(data, data.objects.alabama).features)
	    .enter().append("path")
	      .attr("fill", function(d) { return colorScale(d.properties['percentmoorevotes']-d.properties['percentjonesvotes']); })
	      .attr("d", path)
	 
	      .attr('stroke-opacity', 0)
	      .attr("class", "county")
	      .on("mouseover", function(d) {
	      	//console.log(d.properties['countyname'])
	      	 d3.select(this).moveToFront()
	      	 	
        		.attr('stroke-opacity','1')
        		

		 	data = d.properties;
		 	d3.select(this).classed("hover", true);
		 	mouseOverEvents(data,d3.select(this));
		

		})
		.on("mouseout", function(d) {
			 d3.select(this).attr("stroke-opacity", "0").moveToBack()
		 	data = d.properties;
		 	d3.select(this).classed("hover", false);
		 	mouseOutEvents(data,d3.select(this));

		}) 
	counties.append("path")
		.attr("class","county-border")
		.attr("d", path(topojson.mesh(data, data.objects.alabama, function(a, b) { return a !== b; })));

		console.log(bigcities);
	bigcitiesg = svg.append("g")
		.attr("class", "big-cities")

	bigcity = bigcitiesg.selectAll(".city")
		.data(bigcities)
		.enter()
	bigcity
		.append("circle")
		.attr("class", "big-city")
		//.attr("cx", function (d) { console.log(projection(parseFloat(d['lng']))); return projection(parseFloat(d['lng'])); })
		//.attr("cy", function (d) { console.log(projection(parseFloat(d['lat'])));return projection(parseFloat(d['lat'])); })
		.attr("r", 3)
		.attr("cx", -175)
		 .attr("transform", function(d) {
		    return "translate(" + projection([
		      d['lng'],
		      d['lat']
		    ]) + ")";
		});
	bigcity
		.append("text")
		.text(function(d) { return d['city']; })
		.attr("class", "big-city-name")
		.attr("x", -170)
		.attr("y", 12)
		 .attr("transform", function(d) {
		    return "translate(" + projection([
		      d['lng'],
		      d['lat']
		    ]) + ")";
		});



	     // .attr("stroke", "#aaa")
	    
	    //.append("title")
	      //.text(function(d) { return d.rate + "%"; });
	
	container.scroll(function() { 
	
	    scrollTop = container.scrollTop()

	    if (scrollTop > cutoffs[0] && scrollTop < cutoffs[1]) {
	
	    	d3.selectAll(".county")
	    		.transition()
	    		.duration(1500)
	    		.attr("fill", function(d) { return colorScale(d.properties['percentmoorevotes']-d.properties['percentjonesvotes']); })
		}
		//TRUMP MAP
	    else if (scrollTop > cutoffs[1] && scrollTop < cutoffs[2]) {
	    	d3.selectAll(".county")
	    		.transition()
	    		.duration(1500)
	    		.attr("fill", function(d) { return colorScale(d.properties['percenttrumpvotes']-d.properties['percentclintonvotes']); })
	    	
		}	
		//COUNTIES THAT FLIPFLOPPED
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
	    		.attr("fill", "#f5f5f5")  

	    	d3.selectAll(".county")
	    		.filter(function(d) {
	    			return (d.properties['countyname'] == 'Tuscaloosa') || (d.properties['countyname'] == 'Madison') || (d.properties['countyname'] == 'Mobile')
	    		})
	    		.on("mouseout", function(d) {
					 d3.select(this).attr("stroke-opacity", "0").moveToBack()
				 	data = d.properties;
				 	d3.select(this).classed("hover", false);
				 	mouseOutEvents(data,d3.select(this));

				})
	    		.attr("stroke-opacity", "0")
	    		.moveToBack()
		}	
		//METRO AREAS THAT FLIPFLOPPED
		else if (scrollTop > cutoffs[3] && scrollTop < cutoffs[4]) {

			

			d3.selectAll(".county")
	    		.filter(function(d) {
	    			return (d.properties['countyname'] == 'Tuscaloosa') || (d.properties['countyname'] == 'Madison') || (d.properties['countyname'] == 'Mobile')
	    		})
	    		.on("mouseout", function(d) {
				 	data = d.properties;
				 	d3.select(this).classed("hover", false);
				 	mouseOutEvents(data,d3.select(this));

				}) 
	    		.moveToFront()
	    		.transition()
	    		.duration(1500)
	    		.attr("stroke-opacity", "1")
		  	
	    	d3.selectAll(".county")
	    		.filter(function(d) {
	    			return (d.properties['countyname'] == 'Jefferson') || (d.properties['countyname'] == 'Montgomery')
	    		})
	    		.on("mouseout", function(d) {
					 d3.select(this).attr("stroke-opacity", "0").moveToBack()
				 	data = d.properties;
				 	d3.select(this).classed("hover", false);
				 	mouseOutEvents(data,d3.select(this));

				})
	    		.attr("stroke-opacity", "0")
	    		.moveToBack()

	    	 d3.selectAll(".county")
	    		.filter(function(d) { 
	    			
	    			return ((d.properties['percenttrumpvotes'] > d.properties['percentclintonvotes']) 
	    				&& (d.properties['percentmoorevotes'] < d.properties['percentjonesvotes']));
	    		})
	    		.attr("fill", function(d) { return colorScale(d.properties['percentmoorevotes']-d.properties['percentjonesvotes']); })
	
	    	d3.selectAll(".county")
	    		.filter(function(d) { 
	    			return !((d.properties['percenttrumpvotes'] > d.properties['percentclintonvotes']) 
	    				&& (d.properties['percentmoorevotes'] < d.properties['percentjonesvotes']));
	    		})

	    		.attr("fill", "#f5f5f5")   
	    }
	    //ALL METRO AREAS
	    else if (scrollTop > cutoffs[4] && scrollTop < cutoffs[5]) {
	    	
	    	d3.selectAll(".county")
	    		.filter(function(d) {
	    			return (d.properties['countyname'] == 'Tuscaloosa') || (d.properties['countyname'] == 'Madison') || (d.properties['countyname'] == 'Mobile') || (d.properties['countyname'] == 'Jefferson') || (d.properties['countyname'] == 'Montgomery')
	    		})
	    		.on("mouseout", function(d) {
				 	data = d.properties;
				 	d3.select(this).classed("hover", false);
				 	mouseOutEvents(data,d3.select(this));

				}) 
	    		.moveToFront()
	    		.transition()
	    		.duration(1500)
	    		.attr("stroke-opacity", "1")
	    		.attr("fill", function(d) { return colorScale(d.properties['percentmoorevotes']-d.properties['percentjonesvotes']); })
		
	    		
	    	
	    				
	    	d3.selectAll(".county")
	    		.filter(function(d) {
	    			return !((d.properties['countyname'] == 'Tuscaloosa') || (d.properties['countyname'] == 'Madison') || (d.properties['countyname'] == 'Mobile') || (d.properties['countyname'] == 'Jefferson') || (d.properties['countyname'] == 'Montgomery'))
	    		})

	    		.transition()
	    		.delay(1500)
	    		.duration(1500)
	    		.attr("fill", "#f5f5f5")

			
	    	
		}
		//METRO AREAS HAD SOME OF THE LOWEST DECREASE IN TURNOUT  
		else if (scrollTop > cutoffs[5] && scrollTop < cutoffs[6]) {
				
	    	d3.selectAll(".county")
	    		.filter(function(d) {
	    			return (d.properties['countyname'] == 'Tuscaloosa') || (d.properties['countyname'] == 'Madison') || (d.properties['countyname'] == 'Mobile') || (d.properties['countyname'] == 'Jefferson') || (d.properties['countyname'] == 'Montgomery')
	    		})
	    		.on("mouseout", function(d) {
				 	data = d.properties;
				 	d3.select(this).classed("hover", false);
				 	mouseOutEvents(data,d3.select(this));

				}) 
	    		.moveToFront()
	    		.transition()
	    		.duration(1500)
	    		.attr("stroke-opacity", "1")	
	    	
	    	
	    		
	    	d3.selectAll(".county")
	    		.transition()
	    		.duration(1500)
	    		.attr("fill", function(d) {  return turnoutScale(d.properties['presturnout'] - d.properties['senateturnout'])})

	    }
	    //black belt
	    else if (scrollTop > cutoffs[6] && scrollTop < cutoffs[7]) {
	    	d3.selectAll(".county")
	    	.on("mouseout", function(d) {
					 d3.select(this).attr("stroke-opacity", "0").moveToBack()
				 	data = d.properties;
				 	d3.select(this).classed("hover", false);
				 	mouseOutEvents(data,d3.select(this));

				})
	    		.attr("stroke-opacity", "0")

	    	d3.selectAll(".county")
	    		.filter(function(d) {
	    			return !(d.properties['percentblack2017'] > 0.4);
	    		})
	    		.transition()

	    		.duration(1500)
	    		.attr("fill", "#f5f5f5")
	    	d3.selectAll(".county")
	    		.filter(function(d) {
	    			return d.properties['percentblack2017'] > 0.4;
	    		})
	    		.transition()
	    		.duration(1500)
	    		.attr("fill", function(d) {  return turnoutScale(d.properties['presturnout'] - d.properties['senateturnout'])})
	    }
	     else if (scrollTop > cutoffs[7] && scrollTop < cutoffs[8]) {
	    	

	    	d3.selectAll(".county")
	    		.filter(function(d) {
	    			return !(d.properties['percentwhite2017'] > 0.9);
	    		})
	    		.transition()
	    		
	    		.duration(1500)
	    		.attr("fill", "#f5f5f5")
	    	d3.selectAll(".county")
	    	.filter(function(d) {
	    			return d.properties['percentwhite2017'] > 0.9;
	    		})
	    		.transition()
	    
	    		.duration(1500)
	    		.attr("fill", function(d) {  return turnoutScale(d.properties['presturnout'] - d.properties['senateturnout'])})
	    }
	    else if (scrollTop > cutoffs[8] && scrollTop < cutoffs[9]) {
	    	

	    	d3.selectAll(".county")
	    		.filter(function(d) {
	    			return !(d.properties['evangelicalpercent'] > 0.5);
	    		})
	    		.transition()
	    		
	    		.duration(1500)
	    		.attr("fill", "#f5f5f5")
	    	d3.selectAll(".county")
	    	.filter(function(d) {
	    			return d.properties['evangelicalpercent'] > 0.5;
	    		})
	    		.transition()
	    
	    		.duration(1500)
	    		.attr("fill", function(d) {  return turnoutScale(d.properties['presturnout'] - d.properties['senateturnout'])})

	    	d3.selectAll(".county")
	    		.filter(function(d) {
	    			return (d.properties['countyname'] == 'Marengo') || (d.properties['countyname'] == 'Clarke')
	    		})
	    			.on("mouseout", function(d) {
					 d3.select(this).attr("stroke-opacity", "0").moveToBack()
				 	data = d.properties;
				 	d3.select(this).classed("hover", false);
				 	mouseOutEvents(data,d3.select(this));

				})
	    		.moveToBack()
	    		.attr("stroke-opacity", "0")
	    }
	    else if (scrollTop > cutoffs[9] && scrollTop < cutoffs[10]) {
	    	
	    	d3.selectAll(".county")
	    		.filter(function(d) {
	    			return !(d.properties['evangelicalpercent'] > 0.5);
	    		})
	    		.attr("fill", "#f5f5f5")
	    	d3.selectAll(".county")
	    		.filter(function(d) {
	    			return d.properties['evangelicalpercent'] > 0.5;
	    		})
	    		.attr("fill", function(d) {  return turnoutScale(d.properties['presturnout'] - d.properties['senateturnout'])})
	    	d3.selectAll(".county")
	    		.filter(function(d) {
	    			return (d.properties['countyname'] == 'Marengo') || (d.properties['countyname'] == 'Clarke')
	    		})
	    		.on("mouseout", function(d) {
				 	data = d.properties;
				 	d3.select(this).classed("hover", false);
				 	mouseOutEvents(data,d3.select(this));

				}) 
	    		.moveToFront()
	    		.transition()
	    		.duration(1500)
	    		.attr("stroke-opacity", "1")
	    	
	    }
	    else if (scrollTop > cutoffs[10] && scrollTop < cutoffs[11]) {
		    d3.selectAll(".county")
	    		.filter(function(d) {
	    			return (d.properties['countyname'] == 'Marengo') || (d.properties['countyname'] == 'Clarke')
	    		})
	    			.on("mouseout", function(d) {
					 d3.select(this).attr("stroke-opacity", "0").moveToBack()
				 	data = d.properties;
				 	d3.select(this).classed("hover", false);
				 	mouseOutEvents(data,d3.select(this));

				})
	    		.moveToBack()
	    		.attr("stroke-opacity", "0")

	    	d3.selectAll(".county")
	    		.transition()
	    		.duration(1500)
	    		.attr("fill", function(d) { return colorScale(d.properties['percentmoorevotes']-d.properties['percentjonesvotes']); })
		}
	});

		d3.selection.prototype.moveToFront = function() {
				return this.each(function(){
					this.parentNode.appendChild(this);
				});
			};
		d3.selection.prototype.moveToBack = function() {
					return this.each(function() {
							var firstChild = this.parentNode.firstChild;
							if (firstChild) {
									this.parentNode.insertBefore(this, firstChild);
							}
					});
			};
	function mouseOverEvents(data, element) {
    	tooltip.selectAll("div").remove();

    	var tooltipcontainer = tooltip.append("div");
					

      	tooltipheader = tooltipcontainer.append("div")
						.attr("class", "tooltip-header")
		tooltipheader.append("div")
			.attr("class", "county-name")
			.text(function () { return data['countyname'] + " County"; })
		tooltipheader.append("div")
						.attr("class", "tot-registered-voters")
						.text(function () { return "total registered voters: " + parseInt(data['total2017']).toLocaleString(); })
		electionlabels = tooltipcontainer.append("div")
			.attr("class", "election-labels")

		electionlabels.selectAll(".election-label")
			.data([{'label': 'candidate', 'x':0},{'label': '%', 'x':70},{'label': 'votes', 'x':215}])
			.enter()
			.append("div")
			.attr("class", "election-label")
			//.attr("transform", function(d, i) { console.log(d); return "translate("+ d['x']+ ",0)"; })
			.text(function(d) { return d['label'];})
			.style('left', function(d) { return d['x'];})

		barsvgdiv = tooltipcontainer.append("div")
						.attr("class", "bar-svg-div")
		var barwidth = 100,
		barheight = 50,
		barmargin = {top: 20, left: 0, right: 10, bottom: 5},
		barsheight = 20

		baryscale = d3.scaleLinear()
			.domain([0,1])
			.range([barmargin.top,barheight-barmargin.bottom])
		barxscale = d3.scaleLinear()
			.domain([0,1])
			.range([barmargin.left, barwidth-barmargin.right])
		

		barsvg = barsvgdiv.append("svg")
					.attr("class", "bar-svg")
					.attr("width", 250)
					.attr("height", 70)

		

		candidatenames = barsvg.append('g')
			.attr("class", "candidate-names")
			.attr("width", 40)
			.attr("transform", function(d, i) { return "translate(0," + barmargin.top + ")"; })
		candidatenames.selectAll(".candidate")
			.data(["Doug Jones", "Roy Moore"])
			.enter()
			.append("text")
			.attr("transform", function(d, i) { return "translate(0," + i * barsheight*1.3 + ")"; })
			.text(function(d) { return d;})
			.attr("class", "candidate-name")
			.attr('x', barmargin.left)
	    	.attr('y', barsheight/2)
	    	.attr("font-family", "Roboto")
	    	.attr("font-size", "12px")
	    	.attr("text-anchor", "start")
	    	.attr("alignment-baseline", "middle")

	    percentages = barsvg.append('g')
			.attr("class", "percentages")
			.attr("width", 20)
			.attr("transform", function(d, i) { return "translate(70," + barmargin.top + ")"; })
		percentages.selectAll(".percentage")
			.data(["Jones", "Moore"])
			.enter()
			.append("text")
			.attr("transform", function(d, i) { return "translate(0," + i * barsheight*1.3 + ")"; })
			.text(function(d) {
				if (d=="Moore") {
					return Math.round(data['percentmoorevotes']*100)+"%"
				} else {
					return Math.round(data['percentjonesvotes']*100)+"%";
				}
			})
			.attr("class", "percentage")
			.attr('x', 0)
	    	.attr('y', barsheight/2)
	    	.attr("font-family", "Roboto")
	    	.attr("font-size", "12px")
	    	.attr("text-anchor", "start")
	    	.attr("alignment-baseline", "middle")
	    votes = barsvg.append('g')
			.attr("class", "votes")
			.attr("width", 20)
			.attr("transform", function(d, i) { return "translate(240," + barmargin.top + ")"; })
		votes.selectAll(".vote")
			.data(["Jones", "Moore"])
			.enter()
			.append("text")
			.attr("transform", function(d, i) { return "translate(0," + i * barsheight*1.3 + ")"; })
			.text(function(d) {
				if (d=="Moore") {
					return parseInt(data['moorevotes']).toLocaleString();
				} else {
					return parseInt(data['jonesvotes']).toLocaleString();
				}
			})
			.attr("class", "vote")
			.attr('x', 0)
	    	.attr('y', barsheight/2)
	    	.attr("font-family", "Roboto")
	    	.attr("font-size", "12px")
	    	.attr("text-anchor", "end")
	    	.attr("alignment-baseline", "middle")

	    bars = barsvg.append('g')
			.attr("class", "bars")
			.attr("transform", function(d, i) { return "translate(100," + barmargin.top + ")"; })
		bar = bars.selectAll(".bar")
			.data(["Jones", "Moore"])
			.enter()
			.append("g")
			.attr("transform", function(d, i) { return "translate(0," + i * barsheight*1.3 + ")"; });


   		bar.append("rect") 
			.attr("width", function(d) {
				if (d=="Moore") {
					return  barxscale(data['percentmoorevotes']);
				} else {
					return barxscale(data['percentjonesvotes']);
				}
			})
			
    		.attr("height", barsheight - 1)
    		.attr("fill", function(d) { 
    			if (d=="Moore") {
					return "#f55";
				} else {
					return "#1055fa";
				}
			})
			.attr("opacity", 0.7)
		bar.append("rect") 
			.attr("width", function(d) {
				if (d=="Moore") {
					return barxscale(1) - barxscale(data['percentmoorevotes']);
				} else {
					return barxscale(1) - barxscale(data['percentjonesvotes']);
				}
			})
			.attr("x", function(d) {
				if (d=="Moore") {
					return barxscale(data['percentmoorevotes']);
				} else {
					return barxscale(data['percentjonesvotes']);
				}
			})
    		.attr("height", barsheight - 1)
    		.attr("fill", "#ececec")

		gannotation.append('text')
	.text(function(d) { 
		if (d=="Change in turnout from the 2016 Presidential Election") {
			return Math.round((data['senateturnout'] - data['presturnout'])*100)+"%";
		} else {
			return Math.round(((data['percentmoorevotes'] - data['percentjonesvotes']) - (data['percenttrumpvotes'] - data['percentclintonvotes']))*100)+'%';
		}
	})
	.attr("y", function(d, i) { return i * height/3;})
	.attr("dx", "2.5em")
	.attr("class", "annotation-number")
	.attr("dy", "3em")
	.call(wrap, 200)
      	
      	tooltip
          .style("visibility","visible")
          .style("top",function(d){
            /*if(viewportWidth < 450 || mobile){
              return "250px";
            }*/
            return (d3.event.pageY+35) +"px"
          })
          .style("left",function(d){
            /*if(viewportWidth < 450 || mobile){
              return "0px";
            }*/
            return (d3.event.pageX - 125) +"px";
          })

    }
    function mouseOutEvents(data, element) {
    	gannotation.selectAll(".annotation-number").remove();
    	tooltip
       		.style("visibility",null);
	}

}


function wrap(text, width) {
  text.each(function() {
    var text = d3.select(this),
        words = text.text().split(/\s+/).reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 1.1, // ems
        y = text.attr("y"),
        dy = parseFloat(text.attr("dy")),
        tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
    while (word = words.pop()) {
      line.push(word);
      tspan.text(line.join(" "));
      if (tspan.node().getComputedTextLength() > width) {
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
      }
    }
  });
}