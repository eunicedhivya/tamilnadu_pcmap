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
			.attr('fill', "#FFFFFF")
			.attr('stroke', "#676767")
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
            .on("click", function(d,i){
                d3.selectAll('.boundary').attr('fill', '#FFFFFF')
                d3.select(this).attr('fill', '#BF318A');
                let selectedData = filterDataByConst(d.properties['PC_CODE']);

                d3.select('#const-name').text(d.properties['PC_NAME'])

                let candidates = d3.select('.candidates');

                candidates.html(null);

                let item = candidates.selectAll('.item')
                    .data(selectedData).enter().append("div")
                    .attr('class', 'item')

                item.append('img')
                    .attr('src', 'image\\1.png')
                    .attr('alt', 'test')

                item.append('p')
                    .text(function(d){
                        return d["Candidate_Nme"];
                    })
                
                item.append('span')
                    .text(function(d){
                        return d["Party_Name"];
                    })
                    
                

            })

    
    })

}

function filterDataByConst(criteria){
    return constData.filter(function(obj){
        return obj['PC_No'] === criteria;
    })
}

