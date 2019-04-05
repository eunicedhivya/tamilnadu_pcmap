function draw_map(selection, options){
    
    //unpack options object content
    const { map, width, height,  scale, latlong } = options

    //Generate the svg container by targeting the html selection
	const svg = d3.select(selection).append("svg")
        .attr("class", "pcmap")
        .attr("viewBox", "0 0 " + width + " " + height)
        .attr("preserveAspectRatio", "xMinYMin")
        .append("g")

    //Enter latlong, scale info of chosenstate
	const projection = d3.geoMercator()
    .scale(scale)
    .center(latlong)
    .translate([width / 2, height / 2])

    const geoPath = d3.geoPath()
        .projection(projection)

    //function to read the map source topojson
    d3.json(map, function(error, mapshape){
        
        //select the readable portion of topojson
        let allShape = topojson.feature(mapshape, mapshape.objects.collection).features;

        //draw and enter map based on mapshape data
		svg.selectAll(".boundary")
            .data(allShape).enter().append("path")
            .attr("d", geoPath)
			.attr("class", function(d, i){
                // console.log(i+1,d.properties['PC_CODE'])
                return 'boundary c' + d.properties['PC_CODE']
            })
			.attr('fill', "#F0F2EF")
			.attr('stroke', "#636363")
			.attr('stroke-width', "0.5")
            .attr('stroke-opacity', "0.5")
            .on("mouseover", function(d,i){
                d3.select('.tooltip').text(d.properties['PC_NAME'])
                    .style('display', 'block')
                    .style("left", (d3.event.pageX + 10) + "px")
					.style("top", d3.event.pageY + "px")
            })
            .on("mouseout", function(d,i){
                d3.select('.tooltip').text(d.properties['PC_NAME'])
                    .style('display', 'none')
            })

    
    })

}