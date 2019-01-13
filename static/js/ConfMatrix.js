(function(){

ConfM = {};

/*
 * renders a confusion matrix to a given container 
 *
 */

 ConfM.getMaxMinConfMat = function(data){

 	var mxVal = 0;
 	var minVal = 100000;
 	data.forEach(function(d,i){
 		d.forEach(function(m,k){
 			if(m>mxVal) mxVal = m;	
 			if(m<minVal) minVal = m;	
 		})
 	})
 	return [minVal, mxVal]
 }
ConfM.makeConfMatrix = function(dataIn, type = "train", containerId = "") {
	if(containerId == ""){
		containerId = "sideRightContentPanel"
	}
	if(type == 'train'){
		$("#"+containerId).empty();
	}


	
	var margin = {top: 100, right: 100, bottom: 100, left: 100},
	    width = 400,
	    height = 400,
	    data = dataIn,
	    labelsData = Main.labels,
	    numrows,
	    numcols;

	    
	if(!data){
		throw new Error('No data passed.');
	}

	if(!Array.isArray(data) || !data.length || !Array.isArray(data[0])){
		throw new Error('Data type should be two-dimensional Array.');
	}

	var extent = ConfM.getMaxMinConfMat(data);
        ConfM.color = d3.scale.linear().domain([extent[0], extent[1]])
        .interpolate(d3.interpolateHcl)
        // .range([d3.rgb("#007AFF"), d3.rgb('#FFF500')]);
        // .range([d3.rgb("#DAF7A6"), d3.rgb('#581845')]);
        // .range([d3.rgb("#B9B8B8"), d3.rgb('#343434')]);
        .range([d3.rgb("#B9B8B8"), d3.rgb(Main.colors.HIGHLIGHT)]);

	numrows = data.length;
	numcols = data[0].length;

	var svg = d3.select("#"+containerId)
		.append('div')
		.attr('id', type+'_ConfMatrixDiv')
		.attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom)
		.append("svg")
	    .attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom)
		.append("g")
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	var background = svg.append("rect")
	    .style("stroke", "black")
	    .style("stroke-width", "2px")
	    .attr("width", width)
	    .attr("height", height);


	var x = d3.scale.ordinal()
	    .domain(d3.range(numcols))
	    .rangeBands([0, width]);

	var y = d3.scale.ordinal()
	    .domain(d3.range(numrows))
	    .rangeBands([0, height]);

	var colorMap = d3.scale.linear()
	    .domain([0, 1])
	    .range(["white", "black"]);    

	var row = svg.selectAll(type+'_.grp_row_Conf')
	    .data(data)
	  	.enter().append("g")
		.attr("class", type+'_.grp_row_Conf')
		.attr('id', function (d, i) {
			console.log(' giving row names ', d, i)
			return type + '_grp_row_Conf_id_' + i;
		})
	    .attr("transform", function(d, i) { return "translate(0," + y(i) + ")"; });

	var cell = row.selectAll("."+type+"_cell_conf_rect")
	    .data(function(d) { return d; })
			.enter().append("g")
	    .attr("class", type+"_cell_conf_rect")
	    .attr("transform", function(d, i) { return "translate(" + x(i) + ", 0)"; });

	cell.append('rect')  
		.attr('class', type+'_conf_rect')  
		.attr('id', function(d,i){
			console.log(' giving id names ', d,i)
			return type+'_conf_rect_id_'+i;
		})
	    .attr("width", x.rangeBand())
	    .attr("height", y.rangeBand())
	    .style("stroke-width", 0)
	    .style("fill", function(d){
	    	// console.log('found color ', d, extent)
	    	return ConfM.color(+d);
		})
		.on('mouseover', function(d,i){
			// console.log(' matrix found ', d3.selectAll(this));
			// console.log(' matrix is ', $(this).attr('class'));
			ConfM.cellStroke = $(this).css('stroke');
			ConfM.cellStrokeWidth = $(this).css('stroke-weight');
			$(this).css('stroke', 'black');
			$(this).css('stroke-width', '4px');

			var id = $(this).parents();
			var idNum = $(id[1]).attr('id')
			idNum = Util.getNumberFromText(idNum)
			console.log(' getting the parent ', idNum, i)
			var idList = DataTable.findLabelAcc(Main.labels[idNum], Main.labels[i])
			console.log(' getting the parent ', Main.labels[idNum], Main.labels[i], idList)

		})
		.on('mouseout', function(d,i){
			$(this).css('stroke', ConfM.cellStroke);
			$(this).css('stroke-width', ConfM.cellStrokeWidth);
		})

    cell.append("text")
	    .attr("dy", ".32em")
	    .attr("x", x.rangeBand() / 2)
	    .attr("y", y.rangeBand() / 2)
	    .attr("text-anchor", "middle")
	    .style("fill", function(d, i) { return d >= 0.5 ? 'white' : 'black'; })
	    .style("font-size", '1.5em')
	    .text(function(d, i) { return d; });

	row.selectAll("."+type+"_cell_conf_rect")
	    .data(function(d, i) { return data[i]; })
	     .style("fill", function(d){
	    	// console.log('found color ', d, extent)
	    	return ConfM.color(+d);
	    })
	    // .style("fill", colorMap);

	var labels = svg.append('g')
		.attr('class', "labels");

	var columnLabels = labels.selectAll(".column-label")
	    .data(labelsData)
	  .enter().append("g")
	    .attr("class", "column-label")
	    .attr("transform", function(d, i) { return "translate(" + x(i) + "," + height + ")"; });

	columnLabels.append("line")
		.style("stroke", "black")
	    .style("stroke-width", "1px")
	    .attr("x1", x.rangeBand() / 2)
	    .attr("x2", x.rangeBand() / 2)
	    .attr("y1", 0)
	    .attr("y2", 5);

	columnLabels.append("text")
	    .attr("x", 6)
	    .attr("y", y.rangeBand() / 2)
	    .attr("dy", ".32em")
	    .attr("text-anchor", "end")
	    .attr("transform", "rotate(-60)")
	    .text(function(d, i) { return d; });

	var rowLabels = labels.selectAll(".row-label")
	    .data(labelsData)
	  .enter().append("g")
	    .attr("class", "row-label")
	    .attr("transform", function(d, i) { return "translate(" + 0 + "," + y(i) + ")"; });

	rowLabels.append("line")
		.style("stroke", "black")
	    .style("stroke-width", "1px")
	    .attr("x1", 0)
	    .attr("x2", -5)
	    .attr("y1", y.rangeBand() / 2)
	    .attr("y2", y.rangeBand() / 2);

	rowLabels.append("text")
	    .attr("x", -8)
	    .attr("y", y.rangeBand() / 2)
	    .attr("dy", ".32em")
	    .attr("text-anchor", "end")
	    .text(function(d, i) { return d; });

}

}())