(function () {

	ConfM = {};

	ConfM.cellClickedTrain = false;
	ConfM.cellClickedTest = false;
	ConfM.addMatrix = 0;

	ConfM.getMaxMinConfMat = function (data) {

		var mxVal = 0;
		var minVal = 100000;
		data.forEach(function (d, i) {
			d.forEach(function (m, k) {
				if (m > mxVal) mxVal = m;
				if (m < minVal) minVal = m;
			})
		})
		return [minVal, mxVal]
	}

	ConfM.modelResultsDisplay = function (containerId = "", type = "", index = 0) {
		if (containerId == "") containerId = "confMatTrain"
		$("#modelResult_" + containerId + "_"+type).remove();
		//   try {
		//   	var featImpDict = BarM.allModelData[index]['feat_imp_dict'];
		//   } catch (e) {
		//   	return
		//   }

		var acc = (Util.getRandomNumberBetween(0.9, 0.75) * 100).toFixed(2)

		
		var ob = 'trainMetrics'
		if(type == 'test') ob ='testMetrics'
		var text = 'Prediction Accuracy is  '
		var text = 'Objective Function Score is  '
		var metObj = BarM.allModelData[BarM.selectedModelId][ob];
		var score = 0, ind =0;
		for(var item in metObj){
			score += +metObj[item]
			ind+= 1
		}
		if (type == 'train') idName = 'modResRowid_0'
		else idName = 'modResRowid_1'
		acc = ((score * 100) / ind).toFixed(2)
		if(acc > 1.0) acc = (acc*0.9).toFixed(2)
		var htmlStr = "<div class = '"+type + "_wrapDivs modelResult' id = 'modelResult_" + containerId + "_" + type + "'>"
		htmlStr += "<div class = 'modResRow' id = '"+idName+"' ><span class ='modelResHeadText'> "+text+"</span>"
		htmlStr += "<span class = 'modelResOut' >" + acc + " </span></div>";

		var acc2 = 2;
		if(BarM.modIter > 0){
			// console.log('moditer is ', BarM.modIter)
			var text2 = 'Last Objective Function Score was  '

			var metObj = BarM.histData[BarM.modIter-1][+BarM.selectedModelId][ob];
			var score = 0, 	 	
				ind = 0;
			for (var item in metObj) {
				score += +metObj[item]
				ind += 1
			}
			acc2 = ((score * 100) / ind).toFixed(2)
			if (acc2 > 1.0) acc2 = (acc2 * 0.9).toFixed(2)

			htmlStr += "<div class = 'modResRow' ><span class ='modelResHeadText'>"+text2+" </span>"
			htmlStr += "<span class = 'modelResOut' >" + acc2 + " </span></div>";
		}


		//add other constraints
		// for (var item in ConsInt.activeConstraints) {
		// 	if (item == 'Precision' || item == 'Recall' || item == 'F1-Score') continue;
		// 	try {
		// 		var arr = ConsInt.activeConstraints[item]['input']['labelitemsConId_' + item];
		// 		if (arr.length == 0) continue;
		// 	} catch (e) {}

		// 	var val = (Util.getRandomNumberBetween(1, 0) * 100).toFixed(2)
		// 	var name = ConsInt.activeConstraints[item]['usedName']
		// 	htmlStr += "<div class = 'modResRow'><span class ='modelResHeadText'>" + name + " Accuracy is  </span>"
		// 	htmlStr += "<span class = 'modelResOut' >" + val + " </span></div>";
		// }
		htmlStr += "</div>";

		$("#" + containerId).append(htmlStr);

		if (acc2 < acc && BarM.modIter > 0) {
			 htmlStr = "<button id='modelWin' class='mdl-button mdl-js-button mdl-button--icon mdl-button--colored'>"
			 htmlStr += "<i class='material-icons'>touch_app</i></button>";
			 if(type=='train') $('#modResRowid_0').append(htmlStr)
			 else $('#modResRowid_1').append(htmlStr)
		}else{

		}


		$(".modelResult").css('display', 'flex')
		$(".modelResult").css('flex-direction', 'column')
		$(".modelResult").css('padding', '3px')
		$(".modelResult").css('font-size', '1.3em')
		$(".modelResult").css('margin', '4px')
		// $(".modelResult").css('height', '20px')

		$(".modelResOut").css('background', Main.colors.HIGHLIGHT2)
		$(".modelResOut").css('padding', '3px')
		$(".modelResOut").css('margin', '3px')

		$(".modResRow").css('margin-bottom', '10px')
		$(".modResRow").css('display', 'flex')
		$(".modResRow").css('align-items', 'center')

		$("." + type + "_wrapDivs").wrapAll("<div class='wrapperDivConfMatr'></div>");

		var ind = 0
		$('.wrapperDivConfMatr').each(function(d,i){
			$(this).attr('id', 'wrapperDivConfMatrId_'+ind)
			ind += 1;
		})


		$(".wrapperDivConfMatr").css('display', 'flex');
		$(".wrapperDivConfMatr").css('width', '100%');
		$(".wrapperDivConfMatr").css('height', 'auto');
		$(".wrapperDivConfMatr").css('padding', '4px');
		$(".wrapperDivConfMatr").css('align-items', 'center');
		$(".wrapperDivConfMatr").css('justify-content', 'center');

	}

	ConfM.makeConfMatrix = function (dataIn, type = "train", containerId = "") {
		if (containerId == "" && type == 'train') {
			containerId = "confMatTrain"
		}

		if (containerId == "" && type == 'test') {
			// containerId = "confMatTest"
			containerId = "confMatTrain"

		}


		
		if (ConfM.addMatrix == 0) $("#" + containerId).empty();
		ConfM.addMatrix += 1;
		if(ConfM.addMatrix == 2) ConfM.addMatrix = 0


		// $("#"+containerId).css('overflow-Y', 'auto')

		// if(type == 'train'){
		// 	$("#"+containerId).empty();
		// }



		var margin = {
				top: 20,
				right: 50,
				bottom: 100,
				left: 100
			},
			width = 400,
			height = 400,
			data = dataIn,
			labelsData = Main.labels, //.reverse(),
			numrows,
			numcols;


		width = $("#" + containerId).width() * 0.5;
		height = $("#" + containerId).height() * 0.1; //0.4

		width = height;

		if(width < 120){
			width = 120;
			height = 120
		}
		// var width = 100;
		// var height = 100;


		if (!data) {
			throw new Error('No data passed.');
		}

		if (!Array.isArray(data) || !data.length || !Array.isArray(data[0])) {
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
		
		var svg = d3.select("#" + containerId)
			.append('div')
			.attr('id', type + '_ConfMatrixDiv')
			.attr('class', type + '_wrapDivs')
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
			.append("svg")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
			// .style('max-width', mxWid)
			// .style('max-height', mxHt)
			.append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		var background = svg.append("rect")
			.style("stroke", "black")
			.style("stroke-width", "2px")
			.attr("width", width)
			.attr("height", height)
			// .style('max-width', mxWid)
			// .style('max-height', mxHt)


		var x = d3.scale.ordinal()
			.domain(d3.range(numcols))
			.rangeBands([0, width]);

		var y = d3.scale.ordinal()
			.domain(d3.range(numrows))
			.rangeBands([0, height]);

		var colorMap = d3.scale.linear()
			.domain([0, 1])
			.range(["white", "black"]);

		var row = svg.selectAll(type + '_.grp_row_Conf')
			.data(data)
			.enter().append("g")
			.attr("class", type + '_.grp_row_Conf')
			.attr('id', function (d, i) {
				// console.log(' giving row names ', d, i)
				return type + '_grp_row_Conf_id_' + i;
			})
			.attr("transform", function (d, i) {
				return "translate(0," + y(i) + ")";
			});

		var cell = row.selectAll("." + type + "_cell_conf_rect")
			.data(function (d) {
				return d;
			})
			.enter().append("g")
			.attr("class", type + "_cell_conf_rect")
			.attr("transform", function (d, i) {
				return "translate(" + x(i) + ", 0)";
			});

		cell.append('rect')
			.attr('class', function (d, i) {
				var id = $(this).parents();
				var idNum = $(id[1]).attr('id')
				idNum = Util.getNumberFromText(idNum);
				var added = type + '_cell_' + idNum + '_' + i;
				return type + '_conf_rect ' + added;
			})
			.attr('id', function (d, i) {
				// console.log(' giving id names ', d,i)
				return type + '_conf_rect_id_' + i;
			})
			.attr("width", x.rangeBand())
			.attr("height", y.rangeBand())
			.style("cursor", 'pointer')
			.style("stroke-width", 0)
			.style("fill", function (d) {
				// console.log('found color ', d, extent)
				return ConfM.color(+d);
			})
			.on('mouseover', function (d, i) {
				// console.log(' matrix found ', d3.selectAll(this));
				// console.log(' matrix is ', $(this).attr('class'));
				ConfM.cellStroke = $(this).css('stroke');
				ConfM.cellStrokeWidth = $(this).css('stroke-weight');
				$(this).css('stroke', 'black');
				$(this).css('stroke-width', '2px');

				var id = $(this).parents();
				var idNum = $(id[1]).attr('id')
				idNum = Util.getNumberFromText(idNum)
				// console.log(' getting the parent ', idNum, i, type)
				// var idList = DataTable.findLabelAcc(labelsData[i], labelsData[idNum])
				if (type == 'train') {
					if (!ConfM.cellClickedTrain) {
						// var idList = BarM.modelData[0]['predictions']
						// 	['confMatTrain_ids'][idNum + '_' + [i]]['data_idList'];
						var idList = BarM.allModelData[BarM.selectedModelId]
							['confMatTrain_ids'][idNum + '_' + [i]]['data_idList'];

						console.log('idlist gotten ', idList)
						DataTable.hideRowsById(idList, 'train');
						if (!Main.tabelViewMode) Scat.hideSelectedCircle(idList);
					}
				} else {
					//test
					if (!ConfM.cellClickedTest) {
						// var idList = BarM.modelData[0]['predictions']
						// 	['confMatTest_ids'][idNum + '_' + [i]]['data_idList'];
						var idList = BarM.allModelData[BarM.selectedModelId]
							['confMatTest_ids'][idNum + '_' + [i]]['data_idList'];
						DataTable.hideRowsById(idList, 'test');
					}
				}
				// var idList = DataTable.findLabelAcc(labelsData[idNum] , labelsData[i])
				// console.log(' getting the parent ', labelsData[idNum], labelsData[i], idList)
			})
			.on('mouseout', function (d, i) {
				$(this).css('stroke', ConfM.cellStroke);
				$(this).css('stroke-width', ConfM.cellStrokeWidth);

				if (type == 'train') {
					if (!ConfM.cellClickedTrain) {
						$("#dataViewAppTable_tableContent").find('tr').show();
						if (!Main.tabelViewMode) Scat.showAllCircle();
					}
				} else {
					if (!ConfM.cellClickedTest) {
						$("#dataViewAppTable_tableContentTest").find('tr').show();
					}
				}
			})
			.on('click', function (d, i) {
				var id = $(this).parents();
				var idNum = $(id[1]).attr('id')
				idNum = Util.getNumberFromText(idNum)
				// for train matrix
				if (type == 'train' && ConfM.cellClickedTrain == false) {
					ConfM.cellClickedTrainId = idNum + '_' + i;
					ConfM.cellClickedTrain = true;
					ConfM.cellColorTrain = $(this).css('fill')
					$("#dataViewAppTable_tableContent").find('tr').show();
					// var idList = BarM.modelData[0]['predictions']
					// 	['confMatTrain_ids'][idNum + '_' + [i]]['data_idList'];

					var idList = BarM.allModelData[BarM.selectedModelId]
						['confMatTrain_ids'][idNum + '_' + [i]]['data_idList'];
					DataTable.hideRowsById(idList, 'train');
					$(this).css('fill', Main.colors.HIGHLIGHT2);
				} else if (type == 'train' && ConfM.cellClickedTrain == true) {
					if (ConfM.cellClickedTrainId == idNum + '_' + i) {
						ConfM.cellClickedTrain = false;
						$(this).css('fill', ConfM.cellColorTrain)
					} else {
						// $('#' + type + '_grp_row_Conf_id_' + idNum)
						// .find('#' + type + '_conf_rect_id_' + i).css("fill", ConfM.cellColorTrain);
						var selector = "." + type + "_cell_" + ConfM.cellClickedTrainId;
						$(selector).css("fill", ConfM.cellColorTrain);
						// console.log(' selector prev ', selector, idNum, i, ConfM.cellColorTrain)

						ConfM.cellClickedTrainId = idNum + '_' + i;
						ConfM.cellClickedTrain = true;
						ConfM.cellColorTrain = $(this).css('fill')
						$(this).css('fill', Main.colors.HIGHLIGHT2);
						$("#dataViewAppTable_tableContent").find('tr').show();
						// var idList = BarM.modelData[0]['predictions']
						// 	['confMatTrain_ids'][idNum + '_' + [i]]['data_idList'];
						var idList = BarM.allModelData[BarM.selectedModelId]
							['confMatTrain_ids'][idNum + '_' + [i]]['data_idList'];
						DataTable.hideRowsById(idList, 'train');
					}

				}

				//test matrix
				if (type == 'test' && ConfM.cellClickedTest == false) {
					ConfM.cellClickedTestId = idNum + '_' + i;
					ConfM.cellClickedTest = true;
					ConfM.cellColorTest = $(this).css('fill')
					$("#dataViewAppTable_tableContentTest").find('tr').show();
					// var idList = BarM.modelData[0]['predictions']
					// 	['confMatTest_ids'][idNum + '_' + [i]]['data_idList'];
					var idList = BarM.allModelData[BarM.selectedModelId]
						['confMatTest_ids'][idNum + '_' + [i]]['data_idList'];
					DataTable.hideRowsById(idList, 'test');
					$(this).css('fill', Main.colors.HIGHLIGHT2);
				} else if (type == 'test' && ConfM.cellClickedTest == true) {
					if (ConfM.cellClickedTestId == idNum + '_' + i) {
						ConfM.cellClickedTest = false;
						$(this).css('fill', ConfM.cellColorTrain)
					} else {
						// $('#' + type + '_grp_row_Conf_id_' + idNum)
						// .find('#' + type + '_conf_rect_id_' + i).css("fill", ConfM.cellColorTrain);
						var selector = "." + type + "_cell_" + ConfM.cellClickedTestId;
						$(selector).css("fill", ConfM.cellColorTest);
						// console.log(' selector prev ', selector, idNum, i, ConfM.cellColorTrain)

						ConfM.cellClickedTestId = idNum + '_' + i;
						ConfM.cellClickedTest = true;
						ConfM.cellColorTest = $(this).css('fill')
						$(this).css('fill', Main.colors.HIGHLIGHT2);
						$("#dataViewAppTable_tableContentTest").find('tr').show();
						// var idList = BarM.modelData[0]['predictions']
						// 	['confMatTest_ids'][idNum + '_' + [i]]['data_idList'];
						var idList = BarM.allModelData[BarM.selectedModelId]
							['confMatTest_ids'][idNum + '_' + [i]]['data_idList'];
						DataTable.hideRowsById(idList, 'test');
					}
				}
			})

		cell.append("text")
			.attr("dy", ".32em")
			.attr("x", x.rangeBand() / 2)
			.attr("y", y.rangeBand() / 2)
			.attr("text-anchor", "middle")
			.style("fill", function (d, i) {
				return d >= 0.5 ? 'white' : 'black';
			})
			.style("font-size", '1.5em')
			.style("cursor", 'pointer')
			.text(function (d, i) {
				return d;
			});

		row.selectAll("." + type + "_cell_conf_rect")
			.data(function (d, i) {
				return data[i];
			})
			.style("fill", function (d) {
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
			.attr("transform", function (d, i) {
				return "translate(" + x(i) + "," + height + ")";
			});

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
			.text(function (d, i) {
				return d;
			});

		var rowLabels = labels.selectAll(".row-label")
			.data(labelsData)
			.enter().append("g")
			.attr("class", "row-label")
			.attr("transform", function (d, i) {
				return "translate(" + 0 + "," + y(i) + ")";
			});

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
			.text(function (d, i) {
				return d;
			});

		ConfM.modelResultsDisplay(containerId, type)

	}

}())