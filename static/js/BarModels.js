(function() {


    BarM = {};
    BarM.numModel = parseInt(Util.getRandomNumberBetween(10, 5));
    BarM.modelData = {};

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
            var obj = {
                label: dataIn[i][1],
                value: (dataIn[i][0]/100).toFixed(1)
            }
            dataOut.push(obj)
        }
        return dataOut;
    }


    BarM.makeFeatureLabelsVerBar = function(containerId = "",w,h) {
        $("#" + containerId).empty();

        // var w = $("#"+containerId).width(); //960
        // var h = $("#"+containerId).height(); //500
        var labelName = containerId.split('_')[1];
        var data = BarM.getDataforHorBar(labelName);
        console.log('height is ', h, w, data)

        var margin = {
                top: 10,
                right: 10,
                bottom: 10,
                left: 20
            },
            width = w - margin.left - margin.right,
            height =  h- margin.top - margin.bottom;

        var x = d3.scale.ordinal()
            .rangeRoundBands([0, width], .1);

        var y = d3.scale.linear()
            .range([height, 0]);

        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom");

        var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left");



        var chart = d3
            .select("#" + containerId)
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            x.domain(data.map(function(d) {
                return d.label;
            }));
            y.domain([0, d3.max(data, function(d) {
                return d.value;
            })]);

            chart.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height + ")")
                .call(xAxis);

            chart.append("g")
                .attr("class", "y axis")
                .call(yAxis);

            chart.selectAll(".bar")
                .data(data)
                .enter().append("rect")
                .attr("class", "bar")
                .attr("x", function(d) {
                    return x(d.label);
                })
                .attr("y", function(d) {
                    return y(d.value);
                })
                .attr("height", function(d) {
                    return height - y(d.value);
                })
                .attr("width", x.rangeBand());

        function type(d) {
            d.value = +d.value; // coerce to number
            return d;
        }

    }

    BarM.makeFeatureLabelsHorBar = function(containerId = "", w, h) {

        $("#" + containerId).empty();
        var labelName = containerId.split('_')[1];

        var data = BarM.getDataforHorBar(labelName)

        var div = d3
            .select("body")
            .append("div")
            .attr("class", "toolTip_horBarLabels");

        var axisMargin = 15,
            margin = 15,
            valueMargin = 4,
            width = w, //$("#" + containerId).width(),
            // width = 50,
            height = h, //$("#" + containerId).height(),
            // height = 200, //$("#" + containerId).height()*0.8,
            barHeight = 20, //(height - axisMargin - margin * 2) * 0.7/ data.length,
            barPadding = 3, //(height - axisMargin - margin * 2) * 0.3 / data.length,
            excess = 10,
            // height = (barHeight + barPadding + excess) * data.length,
            data,
            bar,
            svg,
            scale,
            xAxis,
            labelWidth = 0;

        console.log("width is now ", width, height, containerId);

        max = d3.max(data, function(d) {
            return +d.value;
        });

        svg = d3
            .select("#" + containerId)
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr('class', 'mainGrpHorBar')
            .attr('transform', 'translate (0,' + height * 0.9 + ')');

        bar = svg
            .selectAll("g")
            .data(data)
            .enter()
            .append("g")

        bar
            .attr("class", "bar")
            .attr("cx", 0)
            .attr("transform", function(d, i) {
                // return "translate(" + margin  + "," + (i * (barHeight + barPadding) + barPadding) + ")";
                return "translate(" + 75 + "," + (i * (barHeight + barPadding) + barPadding) + ")";
            });

        // bar
        //   .append("text")
        //   .attr("class", "label")
        //   .attr("y", barHeight / 2)
        //   .attr("dy", ".35em") //vertical align middle
        //   // .text(function(d) {
        //   //   return d.label;
        //   // })
        //   // .attr("transform", function(d, i) {
        //   //   return "translate(" + (-10) + "," + 0 + ")";
        //   // })
        //   .each(function() {
        //     labelWidth = Math.ceil(Math.max(labelWidth, this.getBBox().width));
        //   });

        scale = d3.scale
            .linear()
            .domain([0, max])
            .range([0, width - margin * 2 - labelWidth]);

        xAxis = d3.svg
            .axis()
            .scale(scale)
            .tickSize(-height + 2 * margin + axisMargin)
            .orient("bottom");

        var wdFac = 1.0;

        bar
            .append("rect")
            .attr('id', function(d) {
                return 'rectCluster_' + d.label;
            })
            // .attr("transform", "translate(" + labelWidth + ", 0)")
            .attr("transform", "translate(" + 0 + ", 0) scale (-1)")
            .attr("height", barHeight)
            .attr("width", function(d) {
                return scale(1 * d.value);
            })
            .style('fill', Main.colors.HIGHLIGHT)
            .style('cursor', 'ew-resize')
            .call(d3.behavior.drag().on('drag', function(d) {

                wdFac -= 0.0002;
                if (wdFac < 0.1) widFac = 1;
                var wid = $(this).attr('width');

                var new_width = +wid + d3.event.dx;
                var valPer = (d.value * 1.0) / (wid * 1.0);
                var valNew = (valPer * new_width);
                // d.value = wdFac*d.value;
                // d3.selectAll("#rectCluster_"+d.label).attr('width', wid*wdFac )

                Metrics.clusterMembersNumByUser[d.label] = +Math.floor(valNew).toFixed(0);
                d3.selectAll("#rectCluster_" + d.label).attr('width', new_width)
                d3.selectAll("#textCluster_" + d.label).text(function(d) {
                        d.value = (valNew).toFixed(0);
                        return Math.floor(valNew).toFixed(0);
                    })
                    .attr("x", function(d) {
                        var wp = new_width - 15;
                        if (wp < 20) wp = 20
                            // if (wp > +$("#" + containerId).attr('width')) wp = +$("#" + containerId).attr('width') - 15
                        return wp;
                    })


                // console.log('dragging ', d, wid, wdFac)
                // console.log('dragging ', new_width, wid, d3.event.dx, valNew)

            }))

        bar
            .append("text")
            .attr("class", "value")
            .attr("id", function(d) {
                return "textCluster_" + d.label
            })
            .attr("y", barHeight / 2)
            .attr("dx", -valueMargin + labelWidth) //margin right
            .attr("dy", ".35em") //vertical align middle
            .attr("text-anchor", "end")
            .text(function(d) {
                // return d.value.toFixed(3) + "%";
                return d.label;
                // return (d.value * 100 / max).toFixed(2) + "%";
            })
            .attr("x", function(d) {
                var width = this.getBBox().width;
                var wp = Math.max(width + valueMargin - 15, scale(d.value) - 15);
                if (wp < 20) wp = 20
                return wp
            })
            .attr("transform", "translate(" + -75 + ", 0)")
            .style("fill", Main.colors.BLACK)
            .style("font-size", '0.75em')



        // var brush = d3.svg.brush()
        //     // .extent(function (d, i) {
        //     //     return [[0, y(i) + delim / 2],
        //     //     [width, y(i) + height / data.length - delim / 2]]
        //     // })
        //     .x(scale)
        //     .on("brush", brushmove);


        // var svgbrush = svg
        //     .selectAll('.brush')
        //     .data(data)
        //     .enter()
        //     .append('g')
        //     .attr('class', 'brush')
        //     .append('g')
        //     .call(brush)
        //     .call(brush.move, function (d) { return [0, +d.value].map(scale); });


        // function brushmove() {
        //     console.log('brushmoving ')
        //     if (!d3.event.sourceEvent) return; // Only transition after input.
        //     if (!d3.event.selection) return; // Ignore empty selections.
        //     if (d3.event.sourceEvent.type === "brush") return;

        //     var d0 = d3.event.selection.map(scale.invert);
        //     var d1 = [0, d0[1]];

        //     // return

        //     var d = d3.select(this).select('.selection');;

        //     d.datum().value = d0[1]; // Change the value of the original data

        //     d3.select(this).call(d3.event.target.move, d1.map(scale));

        //     svgbrush
        //         .selectAll('text')
        //         .attr('x', function (d) { return scale(d.value) - 25; })
        //         .text(function (d) { return d3.format('.2')(d.value); });

        // }

        bar.on("mousemove", function(d) {
            div.style("left", d3.event.pageX + 10 + "px");
            div.style("top", d3.event.pageY - 25 + "px");
            div.style("display", "inline-block");
            div.html(d.label + "<br>" + d.value + "%");
        });
        bar.on("mouseout", function(d) {
            div.style("display", "none");
        });

        svg
            .insert("g", ":first-child")
            .attr("class", "axisHorizontal")
            .attr("transform", "translate(" + (margin + labelWidth) + "," + (height - axisMargin - margin) + ")")
            // .call(xAxis);
    }


})();