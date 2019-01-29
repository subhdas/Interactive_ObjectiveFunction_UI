(function() {


    BarM = {};
    BarM.numModel = parseInt(Util.getRandomNumberBetween(10, 5));
    BarM.modelData = {};
    BarM.allModelData = {};
    BarM.selectedModelId = 0;

    BarM.filterHistData = {};

    BarM.createData = function() {
        var data = [];
        for (var i = 0; i < Cons.numConstraints; i++) {
            var arr = [];
            for (var j = 0; j < BarM.numModel; j++) {
                var obj = {
                    y: Util.getRandomNumberBetween(30, 3),
                    x: "Model-" + j,
                }
                arr.push(obj);
            } //second for
            data.push(arr);
        } //1st for
        return data
    }


    BarM.computeIdsConfMatrAllModel = function(){
        for(var item in BarM.allModelData){
            var mod = BarM.allModelData[item];
            var confMatrixTrain = JSON.parse(mod['trainConfMatrix'])
             console.log(' checking for ' , item, confMatrixTrain)
              var dataObj = {};
              for (var i = 0; i < confMatrixTrain.length; i++) {
                  var row = confMatrixTrain[i];
                  for (var j = 0; j < row.length; j++) {
                      var idList = DataTable.findLabelAcc(Main.labels[i], Main.labels[j], 'train', item)
                      var obj = {
                          'data_idList': idList,
                          'num_pred': row[j]
                      }
                      dataObj[i + '_' + j] = obj;
                  }
              }
              BarM.allModelData[item]['confMatTrain_ids'] = dataObj;


            var confMatrixTest = JSON.parse(mod['testConfMatrix'])

              // test conf matr
              var dataObj = {};
              for (var i = 0; i < confMatrixTest.length; i++) {
                  var row = confMatrixTest[i];
                  for (var j = 0; j < row.length; j++) {
                      var idList = DataTable.findLabelAcc(Main.labels[i], Main.labels[j], 'test', item)
                      var obj = {
                          'data_idList': idList,
                          'num_pred': row[j]
                      }
                      dataObj[i + '_' + j] = obj;
                  }
              }
              BarM.allModelData[item]['confMatTest_ids'] = dataObj;


        }
    }


    BarM.makeStackedModelBars = function(containerId = "modelExplorePanel") {
        var data = [{
            data: [{
                target: {
                    id: 'MED_SURG',
                    name: 'Med/Surg'
                },
                count: 6
            }, {
                target: {
                    id: 'ICU',
                    name: 'ICU'
                },
                count: 5
            }, {
                target: {
                    id: 'SPI_INICU',
                    name: 'Spine/INICU'
                },
                count: 1
            }, {
                target: {
                    id: 'INT',
                    name: 'Intermediate'
                },
                count: 3
            }, {
                target: {
                    id: 'TELE',
                    name: 'Tele'
                },
                count: 1
            }, {
                target: {
                    id: 'SPEC',
                    name: 'Specialty'
                },
                count: 0
            }],
            source: 'ED'
        }, {
            data: [{
                target: {
                    id: 'MED_SURG',
                    name: 'Med/Surg'
                },
                count: 5
            }, {
                target: {
                    id: 'ICU',
                    name: 'ICU'
                },
                count: 2
            }, {
                target: {
                    id: 'SPI_INICU',
                    name: 'Spine/INICU'
                },
                count: 4
            }, {
                target: {
                    id: 'INT',
                    name: 'Intermediate'
                },
                count: 0
            }, {
                target: {
                    id: 'TELE',
                    name: 'Tele'
                },
                count: 1
            }, {
                target: {
                    id: 'SPEC',
                    name: 'Specialty'
                },
                count: 0
            }],
            source: 'PACU'
        }];

        var UNIT_LABEL_WIDTH = 100;
        var UNIT_LABEL_HEIGHT = 25;
        var GUTTER_WIDTH = 25;

        var htmlStr = "<div class = 'barModelChart'></div>";
        htmlStr += "<div class = 'barModelChartLegend'></div>";
        htmlStr += "<div id='tooltip' class='hidden'><p><span id='value'>100</span></p></div>";
        $("#" + containerId).empty();
        $("#" + containerId).append(htmlStr);

        var chartContainer = '.barModelChart';
        var chartLegendContainer = '.barModelChartLegend';

        var margins = {
            left: UNIT_LABEL_WIDTH,
            bottom: UNIT_LABEL_HEIGHT,
            right: GUTTER_WIDTH
        };

        var sizes = {
            width: 600,
            height: 120
        };

        var width = sizes.width - margins.left - margins.right;
        var height = sizes.height - margins.bottom;

        var series = data.map(function(d) {
            return d.source;
        });

        console.log('seris is ', series, data)

        var dataset = data.map(function(d) {
            return d.data.map(function(o, i) {
                // Structure it so that your numeric axis (the stacked amount) is y
                return {
                    y: o.count,
                    x: o.target.name
                };
            });
        });

        dataset = BarM.createData();

        console.log('series dataset ', dataset)
            // return
        d3.layout.stack()(dataset);

        var dataset = dataset.map(function(group) {
            return group.map(function(d) {
                // Invert the x and y values, and y0 becomes x0
                return {
                    x: d.y,
                    y: d.x,
                    x0: d.y0
                };
            });
        });

        var svg = d3.select(chartContainer)
            .append('svg')
            .attr('id', 'modelBar_' + containerId)
            .attr('class', 'modelBar')
            .attr('width', width + margins.left + margins.right)
            .attr('height', height + margins.bottom)
            .append('g')
            .attr('transform', 'translate(' + margins.left + ', 0)');

        var units = dataset[0].map(function(d) {
            return d.y;
            
        });

        var yScale = d3.scale.ordinal()
            .domain(units)
            .rangeRoundBands([0, height], .1);

        var yAxis = d3.svg.axis()
            .scale(yScale)
            .orient('left');

        var xMax = d3.max(dataset, function(group) {
            var groupMax = d3.max(group, function(d) {
                return d.x + d.x0;
            });
            return groupMax;
        });

        var xScale = d3.scale.linear()
            .domain([0, xMax])
            .range([0, width]);

        var xAxis = d3.svg.axis()
            .scale(xScale)
            .orient('bottom');

        // var colors = function(i) {
        //   return i ? '#30A7D6' : '#16557F';
        // };
        var colors = [
            "#13D8E9",
            "#E98E13",
            "#8B13E9",
            "#E9131A",
            "#27E913",
            "#134EE9",
            "#E9DC13",
            "#BF13E9",
            "#13E9DF",
            "#11146F",
            "#6F1120",
            "#918550"
        ]

        colors = [
            "#DEE54F",
            "#90D09D",
            "#D0B790",
            "#A2B0C8",
            "#F4A1E9",
        ]

        var groups = svg.selectAll('g')
            .data(dataset)
            .enter()
            .append('g')
            .attr('class', 'mainGrpStackedBarModel')
            .style('fill', function(d, i) {
                return colors[i];
            });

        groups.selectAll('rect')
            .data(function(d) {
                return d;
            })
            .enter()
            .append('rect')
            .attr('x', function(d) {
                return xScale(d.x0);
            })
            .attr('y', function(d, i) {
                return yScale(d.y);
            })
            .attr('height', function(d) {
                return yScale.rangeBand();
            })
            .attr('width', function(d) {
                return xScale(d.x);
            })
            .on('mouseover', function(d) {
                console.log('mouseovering')
                var xPos = parseFloat(d3.select(this).attr('x')) / 2 + width / 2;
                var yPos = parseFloat(d3.select(this).attr('y')) + yScale.rangeBand() / 2;
                d3.select('#tooltip')
                    .style('left', xPos + 'px')
                    .style('top', yPos + 'px')
                    .select('#value')
                    .text(d.x);
                d3.select('#tooltip').classed('hidden', false);
            })
            .on('mouseout', function() {
                d3.select('#tooltip').classed('hidden', true);
            });

        svg.append('g')
            .attr('class', 'bc-x-axis bc-axis')
            .attr('transform', 'translate(0,' + height + ')')
            .call(xAxis);

        svg.append('g')
            .attr('class', 'bc-y-axis bc-axis')
            .call(yAxis);

        //modify path
        // var selector = $("#modelBar_"+containerId).closest('path');
        // d3.selectAll(selector)
        // .style('stroke-width', 0.2)
        // .style('stroke', 'red')

        d3.selectAll('.modelBar path')
            .style('stroke', Main.colors.LIGHTGRAY)
            .style('stroke-width', '2px')
            .style('fill', 'none')

        // Legend
        var legendContainer = d3.select(chartLegendContainer)
            .append('div')
            .attr('class', 'bc-legend');

        legendContainer
            .append('span')
            .attr('class', 'bc-legend-label')
            .html(series[0]);

        series.forEach(function(s, i) {
            legendContainer.append('span')
                .attr('class', 'bc-legend-color')
                .style('background-color', colors[i]);
        });

        legendContainer
            .append('span')
            .attr('class', 'bc-legend-label')
            .html(series[1]);
    }


    BarM.getDataforHorBar = function(labelName) {
        console.log(' found ', LabelCard.computeReturnData, labelName)
        var dataIn = LabelCard.computeReturnData['colWtByData'][labelName];
        var dataOut = []
        for (var i = 0; i < dataIn.length; i++) {
            if (dataIn[i][1] == 'id') continue;
            var obj = {
                label: dataIn[i][1],
                value: Math.log((+dataIn[i][0] / 10)).toFixed(2),
            }
            dataOut.push(obj)
        }
        return dataOut;
    }

    BarM.makeHistoFilterTable = function(containerId = "", w, h, data = "", dataQuery, attr="") {
        var ran = Main.attrDict[attr]['range']
        var numbins = 8;
        if(attr == 'Cylinders') numbins = 2
        var minbin = ran[0]
        var maxbin = ran[1]
        // var numbins =parseInt((maxbin - minbin) / binsize);
        var binsize =parseInt((maxbin - minbin) / numbins);
        // console.log('numbins ', numbins, maxbin, minbin, ran, containerId)

        // whitespace on either side of the bars in units of MPG
        var binmargin = .2;
        var margin = {
            top: 2,
            right: 2,
            bottom: 35,
            left: 2
        };
        var width = w - margin.left - margin.right;
        var height = h - margin.top - margin.bottom;

        // Set the limits of the x axis
        var xmin = minbin - 1
        var xmax = maxbin + 1

        histdata = new Array(numbins);
        for (var i = 0; i < numbins; i++) {
            histdata[i] = {
                numfill: 0,
                meta: "",
                bin : -1,
                attr: ""
            };
        }



        // Fill histdata with y-axis values and meta data
        data.forEach(function(d,i) {
            var bin = Math.abs(Math.floor((d.value - minbin) / binsize));
            // console.log(' bin is ', bin, d.value)
            if ((bin.toString() != "NaN") && (bin < histdata.length)) {
                try{
                    BarM.filterHistData[attr+"_"+bin].push(d.label)
                }catch(err){
                    BarM.filterHistData[attr+"_"+bin] = [d.label]                    
                }

                var dt = Main.getDataById("" + d.label, dataQuery); //Main.trainData
                // console.log('data is ', dt)
                histdata[bin].numfill += 1;
                histdata[bin].bin = bin;
                histdata[bin].attr = attr;
                histdata[bin].meta += "<tr><td> " + dt[Main.entityNameSecondImp] +
                    " id :  " + d.label +
                    "</td><td> " + attr + " : " +
                    d.value + " </td></tr>";
            }
        });

        histdata.forEach(function(d){
            d.numfill = Math.log(+d.numfill);
        })

        // console.log('numbin hist data is ', histdata)

        // This scale is for determining the widths of the histogram bars
        // Must start at 0 or else x(binsize a.k.a dx) will be negative
        var x = d3.scale.linear()
            .domain([0, (xmax - xmin)])
            .range([0, width]);

        // Scale for the placement of the bars
        var x2 = d3.scale.linear()
            .domain([xmin, xmax])
            .range([0, width]);

        var y = d3.scale.linear()
            .domain([0, d3.max(histdata, function(d) {
                return d.numfill;
            })])
            .range([height, 0]);

        var xAxis = d3.svg.axis()
            .scale(x2)
            .ticks(4)
            .orient("bottom");
        var yAxis = d3.svg.axis()
            .scale(y)
            .ticks(8)
            .orient("left");

        var tip = d3.tip()
            .attr('class', 'd3-tip')
            .direction('e')
            .offset([0, 20])
            .html(function(d) {
                return '<table id="tiptable">' + d.meta + "</table>";
            })
            .style('background', 'black')
            .style('font-size', '0.8em')
            .style('padding', '3px')
            .style('border-radius', '10px');


        

        // put the graph in the "mpg" div
        var svg = d3.selectAll("#"+containerId).append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," +
                margin.top + ")");

        svg.call(tip);
        $("#tiptable").css("font-size", "1.3em")
        $("#tiptable").css("background", "black")
        $("#tiptable").css("color", "black")
        // console.log('numbin added svg ', svg)

        // return

        // set up the bars
        var bar = svg.selectAll(".bar_"+containerId)
            .data(histdata)
            .enter().append("g")
            .attr("class", "bar_"+containerId)
            .attr("transform", function(d, i) {
                return "translate(" +
                    x2(i * binsize + minbin) + "," + y(d.numfill) + ")";
            })
            .on('mouseover', tip.show)
            .on('mouseout', tip.hide);

        // add rectangles of correct size at correct location
        bar.append("rect")
            .attr('id', function(d){
                // return "histoBars_" + d.attr + "_" + d.bin + "_" + containerId
                return "histoBars_"+d.attr+"_"+d.bin
            })
            .attr("x", x(binmargin))
            .attr("width", x(binsize - 2 * binmargin))
            .attr("height", function(d) {
                return height - y(d.numfill);
            })
            .style('fill', Main.colors.HIGHLIGHT2)

        // add the x axis and x-label
        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
            .select('path')
            .style('display' , 'block')
        svg.append("text")
            .attr("class", "xlabel")
            .attr("text-anchor", "middle")
            .attr("x", width / 2)
            .attr("y", height + margin.bottom)
            .text(attr);

        // add the y axis and y-label
        svg.append("g")
            .attr("class", "y axis")
            .attr("transform", "translate(0,0)")
            // .call(yAxis);
        svg.append("text")
            .attr("class", "ylabel")
            .attr("y", 0 - margin.left) // x and y switched due to rotation
            .attr("x", 0 - (height / 2))
            .attr("dy", "1em")
            .attr("transform", "rotate(-90)")
            .style("text-anchor", "middle")
            .text("");

    }


    BarM.makeFeatureLabelsVerBar = function(containerId = "", w, h, data = "") {

        $("#" + containerId).empty();

        // var w = $("#"+containerId).width(); //960
        // var h = $("#"+containerId).height(); //500
        var labelName = containerId.split('_')[1];
        if (data == "") data = BarM.getDataforHorBar(labelName);
        console.log('height is ', containerId, h, w, data)


        var margin = {
                top: 5,
                right: 0,
                bottom: 15,
                left: 0
            },
            width = w - margin.left - margin.right,
            height = h - margin.top - margin.bottom;

        // Parse the date / time

        var x = d3.scale.ordinal().rangeRoundBands([0, width], .05);

        var y = d3.scale.linear()
            // .base(Math.E)
            .domain([0, d3.max(data, function(d) {
                return +d.value;
            })])
            .range([height, 0]);

        var xAxis = d3.svg.axis()
            .scale(x)
            .ticks(4)
            .orient("bottom")
            // .tickFormat(d3.time.format("%Y-%m"));

        var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left")
            .ticks(4);

        var svg = d3
            .selectAll("#" + containerId)
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

        data.forEach(function(d) {
            d.value = +d.value;
        });

        x.domain(data.map(function(d) {
            return d.label
        }));
        // y.domain([0, d3.max(data, function(d) {
        //     return +d.value;
        // })]);

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
            .select('path')
            .style('display', 'block')
            .selectAll("text")
            .remove()
            // .style("text-anchor", "end")
            // .attr("dx", "-.8em")
            // .attr("dy", "-.55em")
            // .attr("transform", "rotate(-90)");

        svg.append("g")
            .attr("class", "y axis")
            // .call(yAxis)
            // .append("text")
            // .attr("transform", "rotate(-90)")
            // .attr("y", 6)
            // .attr("dy", ".71em")
            // .style("text-anchor", "end")
            // .text("Value ($)");


        // tooltips
        var div_tooltip = d3.select('body').append('div')
            .attr('class', 'tooltip_verBarFeat')
            .style('display', 'none')
            .style('position', 'absolute');

        svg.selectAll("bar")
            .data(data)
            .enter().append("rect")
            .style("fill", Main.colors.HIGHLIGHT2)
            .attr("x", function(d) {
                return x(d.label);
            })
            .attr("width", x.rangeBand())
            .attr("y", function(d) {
                return y(d.value);
            })
            .attr("height", function(d) {
                return height - y(d.value);
            })
            .on('mouseover', function(d) {
                div_tooltip.style('display', 'inline');
                div_tooltip
                    .html(d.label + ': ' + d.value)
                    .style('position', 'absolute')
                    .style('left', (d3.event.pageX - 34) + 'px')
                    .style('top', (d3.event.pageY - 12) + 'px');
            })
            .on('mouseout', function(d) {
                div_tooltip.style('display', 'none');
            })


    }




})();