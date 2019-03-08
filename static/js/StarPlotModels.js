(function () {

    StarM = {}

    StarM.colorFill = [
        '#FAD569',
        '#3DFFED',
        '#FF471E',
        '#8C55EE',
    ]

    StarM.modelOutputView = true;
    StarM.constraintsDict = {}
    StarM.starPlotMode = false;

    StarM.getModelData = function () {
        var modelData = BarM.allModelData;
        var dataCollect = [];
        var origDef = ['Recall', 'Precision', 'F1-Score', 'Testing-Accuracy', 'Cross-Val-Score']
        for (var el in modelData) {
            var trainMet = modelData[el]['trainMetrics']
            // var obj = {}
            var obj = {
                className: 'model_' + el,
                // axes: [{
                //         axis: 'Recall',
                //         value: trainMet['acc'],
                //     },
                //     {
                //         axis: 'Precision',
                //         value: trainMet['prec'],
                //     },
                //     {
                //         axis: 'F1-Score',
                //         value: trainMet['f1'],
                //     }
                // ]
                axes: [],
            }

            //add items from active constraints
            for (var item in ConsInt.activeConstraints) {
                var ind = origDef.indexOf(item)
                var name = ConsInt.activeConstraints[item]['usedName']
                var inpObj = ConsInt.activeConstraints[item]['input']
                // console.log(' getting name as ', name, item, ConsInt.activeConstraints, el);
                if (typeof name == 'undefined') name = item
                try {
                    var keyInp = Object.keys(inpObj)
                    // console.log(' keyInp s ', keyInp, item)
                    if (keyInp.length == 0 && ind == -1) continue;
                    if (inpObj[keyInp[0]].length == 0 && ind == -1) continue
                } catch (e) {

                }

                var valFound = trainMet[item]
                // if (ind == -1) {
                var ob = {
                    axis: name,
                    // value: Util.getRandomNumberBetween(1, 0).toFixed(2),
                    value: valFound
                }
                obj['axes'].push(ob);
                // }
            }
            dataCollect.push(obj);
        }
        return dataCollect;

    }

    StarM.getRandomData = function () {
        var data = StarM.getModelData();
        if (data.length == 0) {

            data = [{
                    className: 'model1', // optional can be used for styling
                    axes: [{
                            axis: "accuracy",
                            value: 13
                        },
                        {
                            axis: "precision",
                            value: 6
                        },
                        {
                            axis: "f1-score",
                            value: 5
                        },
                        // {
                        //     axis: "dexterity",
                        //     value: 9
                        // },
                        // {
                        //     axis: "luck",
                        //     value: 2
                        // }
                    ]
                },
                {
                    className: 'model2',
                    axes: [{
                            axis: "accuracy",
                            value: 0.6
                        },
                        {
                            axis: "precision",
                            value: 0.7
                        },
                        {
                            axis: "f1-score",
                            value: 0.9
                        },
                        // {
                        //     axis: "dexterity",
                        //     value: 13
                        // },
                        // {
                        //     axis: "luck",
                        //     value: 9
                        // }
                    ]
                }
            ];

        }


        function randomDataset() {
            return data.map(function (d) {
                return {
                    className: d.className,
                    axes: d.axes.map(function (k) {
                        return {
                            axis: k.axis,
                            value: Math.ceil(Math.random() * 10)
                        };
                    })
                };
            });
        }
        // console.log('getting data this time ', data)
        return data;
        // return randomDataset();
    }

    StarM.addModelSelectors = function (containerId = "") {
        if (containerId == "") containerId = "starPlotHeadTitleId";
        //  $("#" + containerId).empty();

        var htmlStr = "";
        for (var item in BarM.allModelData) {
            var splClass = ""
            if (item == BarM.selectedModelId) splClass = "modelNameHeadSel"
            htmlStr += "<div class = 'modelNameHead " + splClass + "' id = 'modelNameHead_" + item + "' > M_" + item + " </div>";
        }
        $('#' + containerId).append(htmlStr);

        var selBorder = '2px solid black';
        //css styling
        $(".modelNameHead").css('display', 'flex');
        $(".modelNameHead").css('font-size', '0.8em');
        $(".modelNameHead").css('background', Main.colors.HIGHLIGHT2);
        $(".modelNameHead").css('color', 'white');
        $(".modelNameHead").css('border-radius', '4px');
        $(".modelNameHead").css('padding', '4px');
        $(".modelNameHead").css('margin-right', '4px');
        $(".modelNameHead").css('cursor', 'pointer');

        $(".modelNameHeadSel").css('border', selBorder)

        //interactions
        $(".modelNameHead").on('mouseover', function (e) {
            var idNum = $(this).attr('id');
            idNum = Util.getNumberFromText(idNum);
            $(".modelNameHead").css('opacity', 0.3);
            $(this).css('opacity', 1);
            $(".poly_model").css("opacity", 0.05);
            $(".model_" + idNum).css("opacity", 0.75);
        })

        $(".modelNameHead").on('mouseout', function (e) {
            var idNum = $(this).attr('id');
            idNum = Util.getNumberFromText(idNum);
            $(".modelNameHead").css('opacity', 1);
            $(".poly_model").css("opacity", 0.75);
        })

        $(".modelNameHead").on('click', function (e) {

            var idNum = $(this).attr('id');
            idNum = Util.getNumberFromText(idNum);
            BarM.selectedModelId = idNum;
            // $(".modelNameHead").css('opacity', 1);
            // $(".poly_model").css("opacity", 0.75);
            $(".modelNameHead").css('background', Main.colors.HIGHLIGHT2)
            $(".modelNameHead").css('border', 'transparent')
            $(this).css('background', Main.colors.HIGHLIGHT)
            $(this).css('border', selBorder)

            DataTable.modelUpdateLabel(idNum);


            var mod = BarM.allModelData[idNum];
            confMatrixTrain = mod['trainConfMatrix']
            confMatrixTest = mod['testConfMatrix']

            confMatrixTrain = JSON.parse(confMatrixTrain)
            confMatrixTest = JSON.parse(confMatrixTest)

            //to be done
            ConfM.makeConfMatrix(confMatrixTrain, 'train');
            ConfM.makeConfMatrix(confMatrixTest, 'test');

            StarM.addfeatureResults("", BarM.selectedModelId)


        })

    }


    StarM.toggleParCoorStarPlot = function () {

        if (StarM.starPlotMode) {
            var arr = ['id'];
            arr.push.apply(arr, Object.keys(Main.numericalAttributes));
            var dataNumeric = Main.getDataByKeys(arr, Main.trainData);
            //   console.log('par coord model metric ', arr, dataNumeric)
            StarM.makeMetricsParCoord('', dataNumeric, true);

        } else {
            StarM.makeStarPlot();
        }
    }




    StarM.toggleModelConstraintView = function () {

        // var wid = $("#modelExplorePanel").width()
        // var ht = $("#modelExplorePanel").height()
        // wid = 300;
        // $("#modelExplorePanel").css('width', wid)
        // $("#modelExplorePanel").css('height', ht)

        StarM.modelOutputView = !StarM.modelOutputView;
        if (StarM.modelOutputView) {
            $(".modelOutputText").text('Model Output Panel')
            if (StarM.starPlotMode) $("#starPlotModelId").show()
            else $("#parCoorModelMetric").show()
            // $("#starPlotModelId").show()
            $("#modelOutDivId").show()
            $('.modelNameHead').show();

        } else {
            $(".modelOutputText").text('Constraint List View')
            if (StarM.starPlotMode) $("#starPlotModelId").hide()
            else $("#parCoorModelMetric").hide()
            // $("#starPlotModelId").hide()
            $("#modelOutDivId").hide()
            StarM.addConstraintsTable();

            $('.modelNameHead').hide();
        }
    }


    StarM.addIconsStarPlot = function (containerId = "") {
        if (containerId == "") containerId = "starPlotHeaderId";
        $("#" + containerId).empty();

        var htmlStr = "<div class = 'starPlotHeadTitle' id='starPlotHeadTitleId' > <span class = 'modelOutputText'> Model Output Panel </span> </div>";
        htmlStr += "<div class = 'starPlotHeadButton' ></div>";

        $("#" + containerId).append(htmlStr);

        $(".starPlotHeadTitle").css('width', '100%')
        $(".starPlotHeadTitle").css('font-size', '1.5em')
        $(".starPlotHeadTitle").css('display', 'flex')
        htmlStr = "<button id='toggleParStarPlotId' class='someBtn mdl-button mdl-js-button mdl-button--icon mdl-button--colored'>"
        htmlStr += "<i class='material-icons'>change_history</i></button>";
        htmlStr += "<button id='toggleModelConstraintsId' class='someBtn mdl-button mdl-js-button mdl-button--icon mdl-button--colored'>"
        htmlStr += "<i class='material-icons'>blur_linear</i></button>";

        $(".starPlotHeadButton").append(htmlStr);

        //css styling
        $(".modelOutputText").css('margin-right', '25px')

        //click reset data button
        $("#someBtnId").on('click', function () {

        })

        $('.starPlotHeadButton').css('display', 'flex')
        // $('.starPlotHeadButton').css('display', 'css')


        //extra content
        StarM.addModelSelectors("starPlotHeadTitleId")


        $("#toggleParStarPlotId").on('click', function (d) {
            StarM.toggleParCoorStarPlot();
        })

        $("#toggleModelConstraintsId").on('click', function (d) {
            StarM.toggleModelConstraintView();
        })

    }

    StarM.makeMetricsParCoord = function (containerId = "", data, addInteract = false) {
        StarM.starPlotMode = false;

        // make sure empt and update header
        if (containerId == "") containerId = "modelExplorePanel"
        $("#" + containerId).empty();

        $('#' + containerId).css('border-left', '1px solid lightgray')
        //make icon panel 
        var htmlStr = "<div class = 'starPlotHeader' id = 'starPlotHeaderId' ></div>";
        htmlStr += "<div class = 'starPlotContent' id = 'starPlotContentId' ></div>";
        $("#" + containerId).append(htmlStr);

        // var ht = $('.constraintContent').height();
        var ht = 275;
        // console.log('height found ', ht)
        // css styling
        $('.starPlotHeader').css('display', 'flex');
        $('.starPlotHeader').css('padding', '3px');
        // $('.featureEngHeader').css('margin', '5px');
        $('.starPlotHeader').css('width', '100%');
        $('.starPlotHeader').css('height', '35px');
        $('.starPlotHeader').css('border-bottom', '1px dotted lightgray');

        $('.starPlotContent').css('display', 'flex');
        $('.starPlotContent').css('padding', '4px');
        $('.starPlotContent').css('margin', '5px');
        $('.starPlotContent').css('width', '100%');
        $('.starPlotContent').css('height', ht);

        StarM.addIconsStarPlot('starPlotHeaderId');
        $('.starPlotContent').hide();
        // return


        var w = $("#" + containerId).width()
        w = parseFloat(w)
        // var h = $("#" + containerId).css('height');
        var h = $("#" + containerId).height();
        h = parseFloat(h)

        if ((w < 120 && h < 120) || addInteract) {
            w = 650;
            h = 300;
        }

        // console.log('par coord width is ', w, h)

        var margin = {
                top: 20,
                right: 10,
                bottom: 30,
                left: 10
            },
            width = w - margin.left - margin.right,
            height = h - margin.top - margin.bottom;

        if (addInteract) {
            margin = {
                top: 20,
                right: 20,
                bottom: 30,
                left: 10
            }
        }

        var x = d3.scale.ordinal().rangePoints([0, width], 1),
            y = {},
            dragging = {};

        var line = d3.svg.line(),
            axis = d3.svg.axis().orient("left"),
            background,
            foreground;

        var svg = d3.select("#" + containerId).append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
            .attr('id', 'parCoorModelMetric')


        // get data in the right format
        var dataAll = StarM.getRandomData();
        var dataFin = [];
        for (var i = 0; i < dataAll.length; i++) {
            var obj = dataAll[i]['axes']
            var obFin = {}
            for (var item in obj) {
                obFin[obj[item]['axis']] = obj[item]['value']
            }
            dataFin.push(obFin);
        }
        // console.log('data a;ll ', dataAll, dataFin)
        data = dataFin;

        // Extract the list of dimModelMetr and create a scale for each.
        x.domain(dimModelMetr = d3.keys(data[0]).filter(function (d) {
            return d != "name" && (y[d] = d3.scale.linear()
                .domain(d3.extent(data, function (p) {
                    return +p[d];
                }))
                .range([height, 0]));
        }));

        //  console.log('dimModelMetr are ', dimModelMetr)
        //  return


        // Add grey background lines for context.
        background = svg.append("g")
            .attr("class", "background")
            .selectAll("path")
            .data(data)
            .enter().append("path")
            .attr("d", path);

        // Add blue foreground lines for focus.
        foreground = svg.append("g")
            .attr("class", "foreground")
            .selectAll("path")
            .data(data)
            .enter().append("path")
            .attr("d", path);

        // Add a group element for each dimension.
        var g = svg.selectAll(".dimension")
            .data(dimModelMetr)
            .enter().append("g")
            .attr("class", "dimension")
            .attr("transform", function (d) {
                return "translate(" + x(d) + ")";
            })
            .call(d3.behavior.drag()
                .origin(function (d) {
                    return {
                        x: x(d)
                    };
                })
                .on("dragstart", function (d) {
                    dragging[d] = x(d);
                    background.attr("visibility", "hidden");
                })
                .on("drag", function (d) {
                    dragging[d] = Math.min(width, Math.max(0, d3.event.x));
                    foreground.attr("d", path);
                    dimModelMetr.sort(function (a, b) {
                        return position(a) - position(b);
                    });
                    x.domain(dimModelMetr);
                    g.attr("transform", function (d) {
                        return "translate(" + position(d) + ")";
                    })
                })
                .on("dragend", function (d) {
                    delete dragging[d];
                    transition(d3.select(this)).attr("transform", "translate(" + x(d) + ")");
                    transition(foreground).attr("d", path);

                    // console.log(' brusing drag ', dragging)
                    background
                        .attr("d", path)
                        .transition()
                        .delay(500)
                        .duration(0)
                        .attr("visibility", null);
                }));

        // Add an axis and title.
        var gr = g.append("g")
            .attr("class", "axis")
            .each(function (d) {
                d3.select(this).call(axis.scale(y[d]));
            })

        // only do the following if the following flag is true
        if (addInteract) {
            //feature selection rects on top
            gr.append("rect")
                .attr('class', 'par_rect_header')
                .attr("x", -35)
                .attr("y", -20)
                .style('width', '70px')
                .style('height', '15px')
                .style('fill', 'lightgray')
                .on('mouseover', function (d, i) {
                    d3.select(this)
                        .style('stroke', 'black')
                })
                .on('mouseout', function (d, i) {
                    d3.select(this)
                        .style('stroke', '')
                })
                .on('click', function (d) {
                    var ind = ParC.userPickedAttr.indexOf(d);
                    if (ind == -1) {
                        d3.select(this).style('fill', Main.colors.HIGHLIGHT2)
                        ParC.userPickedAttr.push(d);
                    } else {
                        d3.select(this).style('fill', 'lightgray')
                        ParC.userPickedAttr.splice(ind, 1);
                    }
                })

            gr.append("text")
                .attr('class', 'par_text_header')
                .style("text-anchor", "middle")
                .attr("y", -9)
                .text(function (d) {
                    return d;
                });



            //  // following for variance
            //  var ypos = height - 0
            //  gr.append("rect")
            //      .attr('class', 'par_rect_variance')
            //      .attr('id', function (d, i) {
            //          return 'par_rect_var_' + i
            //      })
            //      .attr("x", -20)
            //      .attr("y", ypos)
            //      .style('width', '40px')
            //      .style('height', '15px')
            //      .style('fill', 'lightgray')
            //      .on('mouseover', function (d, i) {
            //          d3.select(this)
            //              .style('stroke', 'black')
            //          ParC.hoveredItem = d;
            //      })
            //      .on('mouseout', function (d, i) {
            //          d3.select(this)
            //              .style('stroke', '')
            //          setTimeout(() => {
            //              ParC.hoveredItem = '';

            //          }, 15000);
            //      })
            //      .on('click', function (d) {
            //          var id = $(this).attr('id');
            //          id = Util.getNumberFromText(id);
            //          if (ParC.userVariance[d] == 'mid') {
            //              ParC.userVariance[d] = 'high';
            //              d3.select(this).style('fill', 'red')
            //              d3.select('#par_text_var_' + id).text('V-H')

            //          } else if (ParC.userVariance[d] == 'high') {
            //              ParC.userVariance[d] = 'low';
            //              d3.select(this).style('fill', 'cyan')
            //              d3.select('#par_text_var_' + id).text('V-L')

            //          } else {
            //              ParC.userVariance[d] = 'mid';
            //              d3.select(this).style('fill', 'lightgray')
            //              d3.select('#par_text_var_' + id).text('V-M')

            //          }
            //      })
            //  .on("contextmenu", function (d, i) {
            //      d3.event.preventDefault();
            //      // react on right-clicking
            //      console.log('main attr clicked ', d)
            //  });

            //  gr.append("text")
            //      .attr('class', 'par_text_variance')
            //      .attr('id', function (d, i) {
            //          return 'par_text_var_' + i
            //      })
            //      .style("text-anchor", "middle")
            //      .attr("y", ypos + 8)
            //      .text(function (d) {
            //          ParC.userVariance[d] = 'mid';
            //          return 'V-M';
            //      });



            //  //following for correlation
            //  // tooltips
            //  var div_tooltip = d3.select('body').append('div')
            //      .attr('class', 'tooltip_par_correl')
            //      .style('display', 'none')
            //      .style('position', 'absolute');


            //  gr.append("rect")
            //      .attr('class', function (d, i) {
            //          return 'par_corr_variance par_corr_' + d
            //      })
            //      .attr('id', function (d, i) {
            //          return 'par_rect_corr_' + i
            //      })
            //      .attr("x", 20)
            //      .attr("y", ypos)
            //      .style('width', '15px')
            //      .style('height', '15px')
            //      .style('fill', 'black')
            //      .style('opacity', 0)
            //      .on('mouseover', function (d) {
            //          var op = $(this).css('opacity');
            //          if (op == 0) return;


            //          div_tooltip.style('display', 'inline');
            //          div_tooltip
            //              .html('Correlated to : ' + ParC.userCorrel[d])
            //              .style('position', 'absolute')
            //              .style('left', (d3.event.pageX - 34) + 'px')
            //              .style('top', (d3.event.pageY - 12) + 'px');
            //      })
            //      .on('mouseout', function (d) {
            //          var op = $(this).css('opacity');
            //          if (op == 0) return;
            //          div_tooltip.style('display', 'none');
            //      })
        }




        // Add and store a brush for each axis.
        g.append("g")
            .attr("class", "brush")
            .each(function (d) {
                d3.select(this).call(y[d].brush = d3.svg.brush().y(y[d])
                    .on("brushstart", brushstart)
                    .on("brush", brush));
            })
            .selectAll("rect")
            .attr("x", -8)
            .attr("width", 16);

        // add a context menu here
        var itemObj = {};
        for (var item in Main.numericalAttributes) {
            var obj = {
                name: item,
                icon: item,
            }
            itemObj[item] = obj;
        }
        itemObj['sep1'] = '------------------'
        itemObj['clear'] = {
            name: 'clear',
            icon: 'clear'
        }
        $.contextMenu({
            selector: '.par_rect_variance',
            callback: function (key, options) {
                //  var m = "clicked: " + key;
                //  window.console && console.log(m) || alert(m);
                if (key == 'clear') {
                    try {
                        delete ParC.userCorrel[ParC.hoveredItem];
                        d3.select('.par_corr_' + ParC.hoveredItem)
                            .style('opacity', 0);
                    } catch (e) {

                    }
                } else {
                    if (key != ParC.hoveredItem) {
                        ParC.userCorrel[ParC.hoveredItem] = key;
                        d3.select('.par_corr_' + ParC.hoveredItem)
                            .style('opacity', 1);

                    }
                }
            },
            items: itemObj
        });

        $('.context-menu-one').on('click', function (e) {
            //  console.log('clicked', this);
        })

        function position(d) {
            var v = dragging[d];
            return v == null ? x(d) : v;
        }

        function transition(g) {
            return g.transition().duration(500);
        }

        // Returns the path for a given data point.
        function path(d) {
            return line(dimModelMetr.map(function (p) {
                return [position(p), y[p](d[p])];
            }));
        }

        function brushstart() {
            d3.event.sourceEvent.stopPropagation();
        }

        // Handles a brush event, toggling the display of foreground lines.
        function brush() {
            $('.tagContainer').hide();
            //  ParC.filteredData = [];
            //  ParC.parallelBrushed = true;
            var actives = dimModelMetr.filter(function (p) {
                    return !y[p].brush.empty();
                }),
                extents = actives.map(function (p) {
                    return y[p].brush.extent();
                });
            // console.log('active found ', actives, extents)
            // Rul.brushPast = true;
            // setTimeout(() => {
            //     Rul.brushPast = false;
            // }, 12000);



            //  ParC.tempDimRules = []
            //  ParC.tempDimRules.push(actives)
            //  ParC.tempDimRules.push(extents)

            foreground.style("display", function (d, k) {



                //  ParC.filteredData.push(actives.every(function (p, j) {
                //      // console.log(' found d p ', d, p)
                //      return +(extents[j][0] <= d[p] && d[p] <= extents[j][1]);
                //  }) ? d['id'] : -1);

                //  ParC.filteredData = Util.getUniqueArray(ParC.filteredData);


                // console.log(' final Arr is ', finalArr)
                return actives.every(function (p, i) {
                    // console.log(' found d p ', d, p)
                    return extents[i][0] <= d[p] && d[p] <= extents[i][1];
                }) ? null : "none";
            });

            //  var ind = ParC.filteredData.indexOf(-1);
            //  ParC.filteredData.splice(ind, 1);
            //  setTimeout(function () {
            //      DataTable.hideSelectedRows(ParC.filteredData, ParC.dataImpactContainer);
            //  }, 1000)
        }
    }

    StarM.makeStarPlot = function (containerId = "") {
        StarM.starPlotMode = true;
        // console.log(' making star plot for models ')
        RadarChart.defaultConfig.color = function () {};
        RadarChart.defaultConfig.radius = 3;
        RadarChart.defaultConfig.w = 300;
        RadarChart.defaultConfig.h = 250;

        if (containerId == "") containerId = "modelExplorePanel"
        $("#" + containerId).empty();

        $('#' + containerId).css('border-left', '1px solid lightgray')
        //make icon panel 
        var htmlStr = "<div class = 'starPlotHeader' id = 'starPlotHeaderId' ></div>";
        htmlStr += "<div class = 'starPlotContent' id = 'starPlotContentId' ></div>";
        $("#" + containerId).append(htmlStr);

        // var ht = $('.constraintContent').height();
        var ht = 275;
        // console.log('height found ', ht)
        // css styling
        $('.starPlotHeader').css('display', 'flex');
        $('.starPlotHeader').css('padding', '3px');
        // $('.featureEngHeader').css('margin', '5px');
        $('.starPlotHeader').css('width', '100%');
        $('.starPlotHeader').css('height', '35px');
        $('.starPlotHeader').css('border-bottom', '1px dotted lightgray');

        $('.starPlotContent').css('display', 'flex');
        $('.starPlotContent').css('padding', '4px');
        $('.starPlotContent').css('margin', '5px');
        $('.starPlotContent').css('width', '100%');
        $('.starPlotContent').css('height', ht);

        StarM.addIconsStarPlot('starPlotHeaderId');
        $('.starPlotContent').hide();


        // make the svg
        var chart = RadarChart.chart();
        var cfg = chart.config(); // retrieve default config
        var svg = d3.select('#' + containerId)
            .append('div')
            .attr('class', 'modelOutDiv')
            .attr('id', 'modelOutDivId')
            .style('width', '100%')
            .style('height', '100%')
            .style('display', 'flex')
            .style('flex-direction', 'column')
            .style('align-items', 'center')
            .append('svg')
            .attr('class', 'starPlotModelClass')
            .attr('id', 'starPlotModelId')
            .attr('width', cfg.w + 80)
            // .attr('width', cfg.w + cfg.w + 50)
            .attr('height', cfg.h + cfg.h / 10);
        svg.append('g').classed('single', 1).datum(StarM.getRandomData()).call(chart);


        // many radars
        chart.config({
            w: cfg.w / 4,
            h: cfg.h / 4,
            axisText: false,
            levels: 0,
            circles: false
        });
        cfg = chart.config();

        function render() {
            var game = svg.selectAll('g.game').data(
                [
                    // StarM.getRandomData(),
                    // StarM.getRandomData(),
                ]
            );
            game.enter().append('g').classed('game', 1);
            game
                .attr('transform', function (d, i) {
                    return 'translate(' + ((cfg.w * 4) + 50 + (i * cfg.w)) + ',' + (cfg.h * 1.3) + ')';
                })
                .call(chart);

            setTimeout(render, 1000);
        }
        render();


        StarM.stylingStarPlot();
        StarM.addfeatureResults("", BarM.selectedModelId)
    }

    StarM.stylingStarPlot = function () {

        d3.selectAll('.poly_model')
            .each(function (d, i) {
                // console.log(' styling the poly ', d, i)
                $(this).css('fill', StarM.colorFill[i]);
                $(this).css('stroke-width', '2');
                $(this).css('stroke', 'gray');
                $(this).css('opacity', 0.75);
            })

    }


    StarM.addfeatureResults = function (containerId = "", index = 0) {
        if (containerId == "") containerId = "modelOutDivId" //        "modelExplorePanel"
        $(".featExplain").remove()
        try {
            var featImpDict = BarM.allModelData[index]['feat_imp_dict'];
        } catch (e) {
            return
        }
        var featImpArr = []
        for (var item in featImpDict) {
            featImpArr.push([item, featImpDict[item]])
        }

        featImpArr.sort(function (a, b) {
            if (a[1] > b[1]) return -1
            else return 1
        })

        console.log('top attrib are  ', featImpArr)
        var maxFeat = 2
        var htmlStr = "<div class = 'featExplain' >"
        htmlStr += "<span class ='featExHeadText'> Decision Making features are </span>"
        for (var i = 0; i < featImpArr.length; i++) {
            htmlStr += "<span class = 'featName' >" + featImpArr[i][0] + " </span>";
            if (i >= maxFeat) break;
        }

        htmlStr += "</div>";

        $("#" + containerId).append(htmlStr);


        // $(".featExplain").css('display', 'flex')
        $(".featExplain").css('padding', '3px')
        $(".featExplain").css('font-size', '1.2em')
        $(".featExplain").css('margin', '4px')
        $(".featExplain").css('line-height', '20px')

        $(".featName").css('background', Main.colors.HIGHLIGHT2)
        $(".featName").css('color', 'white')
        $(".featName").css('padding', '4px')
        $(".featName").css('margin', '4px')



    }


    StarM.showAllRows = function () {
        $('.rowConstTable').show();

    }

    StarM.showOnlyRows = function (idList, type) {
        $('.rowConstTable').show();
        $('.rowConstTable').each(function (d) {
            var id = $(this).attr('parent');
            // console.log('getting id ', id, idList);
            var name = $(this).attr('given');
            if (idList.indexOf(id) == -1 && name != type) {
                $(this).hide();
            }
        })
    }

    StarM.addConstraintsTable = function (containerId = "") {
        if (containerId == "") containerId = "starPlotContentId"
        $("#" + containerId).empty();
        if (StarM.modelOutputView) $("#" + containerId).hide();

        // CONSTRAINTS SOLVE SCORE = 40/100
        // TAGS TYPE HIGHLIGHTED ABOVVE TO FILTER TABLE
        var htmlStr = "";
        htmlStr += "<div class = 'consTableDiv'>"
        for (var item in ConsInt.activeConstraints) {
            var arrDict = ConsInt.activeConstraints[item]['input'];
            var name = ConsInt.activeConstraints[item]['usedName'];
            var arrId = [];
            for (var el in arrDict) {
                arrId.push.apply(arrId, arrDict[el])
            }
            arrId = Util.getUniqueArray(arrId);
            var par = ConsInt.activeConstraints[item]['parent'][0]
            if (arrId.length > 0) {
                for (var i = 0; i < arrId.length; i++) {
                    var dataItem = Main.getDataById(arrId[i], Main.trainData);
                    var nameItem = dataItem[Main.entityNameSecondImp];
                    var fullNameItem = dataItem[Main.entityNameSecondImp];
                    if (nameItem.length > 20) nameItem = nameItem.substring(0, 15) + "..."
                    var result = Util.getRandomNumberBetween(1, 0).toFixed(0);
                    var splClass = 'rowConstTableCol_' + result;
                    StarM.constraintsDict[i] = true;
                    htmlStr += "<div class = 'rowConstTable " + splClass + "' id = rowConstTableId_" + dataItem['id'] + " parent = " + dataItem['id'] + " given = " + name + ">"
                    htmlStr += "<span class ='rowNameConstTable rowSpanConsTab rowSpanNameItem' parent = '" + dataItem[Main.entityNameSecondImp] + "'>" + nameItem + "</span>";
                    htmlStr += "<span class ='rowNameConstTable rowSpanConsTab rowSpanParent'>" + par + "</span>";
                    htmlStr += "<span class ='rowNameConstTable rowSpanConsTab rowSpanItem'>" + name + "</span>";
                    htmlStr += "<span class ='rowNameConstTable rowSpanConsTab'>" + result + "</span>";
                    htmlStr += "</div>"
                } // end of inner for
            }
        } // end of outer for


        //adding informative samples
        if (DataTable.userInformativeItems.length > 0) {
            // htmlStr += "<div class = 'consTableDiv'>"
            var par = 'I'; //informative
            var name = 'informative'
            var arrId = DataTable.userInformativeItems;
            for (var i = 0; i < arrId.length; i++) {
                var dataItem = Main.getDataById(arrId[i], Main.trainData);
                var nameItem = dataItem[Main.entityNameSecondImp];
                var fullNameItem = dataItem[Main.entityNameSecondImp];
                if (nameItem.length > 20) nameItem = nameItem.substring(0, 15) + "..."
                var result = Util.getRandomNumberBetween(1, 0).toFixed(0);
                var splClass = 'rowConstTableCol_' + result;
                StarM.constraintsDict[i] = true;
                htmlStr += "<div class = 'rowConstTable " + splClass + "' id = rowConstTableId_" + dataItem['id'] + " parent = " + dataItem['id'] + " given = " + name + ">"
                htmlStr += "<span class ='rowNameConstTable rowSpanConsTab rowSpanNameItem' parent = '" + dataItem[Main.entityNameSecondImp] + "'>" + nameItem + "</span>";
                htmlStr += "<span class ='rowNameConstTable rowSpanConsTab rowSpanParent'>" + par + "</span>";
                htmlStr += "<span class ='rowNameConstTable rowSpanConsTab rowSpanItem'>" + name + "</span>";
                htmlStr += "<span class ='rowNameConstTable rowSpanConsTab'>" + result + "</span>";
                htmlStr += "</div>"
            } // end of inner for
        }
        //adding wasteful samples
        if (DataTable.userWastefulItems.length > 0) {
            // htmlStr += "<div class = 'consTableDiv'>"
            var par = 'W'; //wasteful
            var name = 'wasteful'

            var arrId = DataTable.userWastefulItems;
            for (var i = 0; i < arrId.length; i++) {
                var dataItem = Main.getDataById(arrId[i], Main.trainData);
                var nameItem = dataItem[Main.entityNameSecondImp];
                var fullNameItem = dataItem[Main.entityNameSecondImp];
                if (nameItem.length > 20) nameItem = nameItem.substring(0, 15) + "..."
                var result = Util.getRandomNumberBetween(1, 0).toFixed(0);
                var splClass = 'rowConstTableCol_' + result;
                StarM.constraintsDict[i] = true;
                htmlStr += "<div class = 'rowConstTable " + splClass + "' id = rowConstTableId_" + dataItem['id'] + " parent = " + dataItem['id'] + " given = " + name + ">"
                htmlStr += "<span class ='rowNameConstTable rowSpanConsTab rowSpanNameItem' parent = '" + dataItem[Main.entityNameSecondImp] + "'>" + nameItem + "</span>";
                htmlStr += "<span class ='rowNameConstTable rowSpanConsTab rowSpanParent'>" + par + "</span>";
                htmlStr += "<span class ='rowNameConstTable rowSpanConsTab rowSpanItem'>" + name + "</span>";
                htmlStr += "<span class ='rowNameConstTable rowSpanConsTab'>" + result + "</span>";
                htmlStr += "</div>"
            } // end of inner for
        }

        htmlStr += "</div>"
        $("#" + containerId).append(htmlStr)


        var col = [
            "#E29510",
            "#5B61E1"
        ]

        $(".rowConstTableCol_0").css('background', '#E29510')
        $(".rowConstTableCol_1").css('background', '#5B61E1')



        $(".consTableDiv").css('display', 'flex')
        $(".consTableDiv").css('flex-direction', 'column')
        $(".consTableDiv").css('margin-bottom', '3px')
        $(".consTableDiv").css('padding', '3px')
        $(".consTableDiv").css('overflow-X', 'auto')
        $(".consTableDiv").css('overflow-Y', 'auto')
        $(".consTableDiv").css('max-height', '325px')
        $(".consTableDiv").css('height', '100%')

        $(".rowConstTable").css('display', 'flex')
        $(".rowConstTable").css('min-height', '20px')
        $(".rowConstTable").css('height', '20px')
        $(".rowConstTable").css('margin-bottom', '3px')
        $(".rowConstTable").css('color', 'white')
        $(".rowConstTable").css('cursor', 'pointer')

        $(".rowConstTable").css('border-bottom', '1px dashed lightgray')

        $(".rowSpanConsTab").css('width', '200px')
        $(".rowSpanConsTab").css('padding', '3px')
        $(".rowSpanParent").css('width', '40px')


        $(".rowConstTable").on('click', function (e) {
            var id = $(this).attr('id')
            id = Util.getNumberFromText(id);
            StarM.constraintsDict[id] = !StarM.constraintsDict[id];
            var item = $(this).find('.rowSpanItem').text();
            var nameItem = $(this).find('.rowSpanNameItem').attr('parent')

            var data = Main.getDataByEntityName(Main.entityNameSecondImp, nameItem, Main.trainData)
            // console.log(' clicked on ', 'id', item, nameItem, data)

            if (!StarM.constraintsDict[id]) {
                //when removing it
                $(this).css('background', 'transparent')
                $(this).css('color', 'black')


                if (item == 'Critical-Items' || item == 'Non-Critical') {
                    var arr = ConsInt.activeConstraints[item]['input']['labelitemsConId_' + item]
                    var ind = arr.indexOf(data.id);
                    if (ind != -1) {
                        arr.splice(ind, 1);
                        ConsInt.activeConstraints[item]['input']['labelitemsConId_' + item] = arr;
                    }
                    delete DataTable.criticalInteract[data.id]

                    var htmlStr = "<button id = 'criticalRectId_" + containerId + "' parent = '" + containerId + "' class='mdl-button mdl-js-button mdl-button--icon mdl-button--colored btnTableAddOn'>"
                    htmlStr += "<i class='material-icons'>linear_scale</i></button>";
                    $("#criticalRectId_" + data.id).html(htmlStr);
                    $('.btnTableAddOn').css('width', '100%')
                    $('.btnTableAddOn').css('height', '100%')
                }

                if (item == 'Same-Label' || item == 'Similarity-Metric') {

                    var inputElem = ConsInt.activeConstraints[item]['input'];

                    for (var obj in inputElem) {
                        try {
                            var arr = ConsInt.activeConstraints[item]['input'][obj]
                            var ind = arr.indexOf(data.id.toString());
                            if (ind != -1) {
                                arr.splice(ind, 1);
                                ConsInt.activeConstraints[item]['input'][obj] = arr;
                            }
                            // console.log('removed array success ', arr)
                        } catch (e) {
                            // console.log(' errored on same label ', e)
                        }
                    }

                    // for (var i = 0; i < Main.labels.length; i++) {
                    //     try {
                    //         var arr = ConsInt.activeConstraints[item]['input']['labelitemsConId_' + Main.labels[i]]
                    //         var ind = arr.indexOf(data.id.toString());
                    //         if (ind != -1) {
                    //             arr.splice(ind, 1);
                    //             ConsInt.activeConstraints[item]['input']['labelitemsConId_' + Main.labels[i]] = arr;
                    //         }
                    //         // console.log('removed array success ', arr)
                    //     } catch (e) {
                    //         // console.log(' errored on same label ', e)
                    //     }
                    // }
                }





            } else {
                //when addding it back
                $(this).css('background', col[0])
                $(this).css('color', 'white')

                if (item == 'Critical-Items' || item == 'Non-Critical') {
                    var arr = ConsInt.activeConstraints[item]['input']['labelitemsConId_' + item]
                    arr.push(data.id);
                    arr = Util.getUniqueArray(arr);
                    ConsInt.activeConstraints[item]['input']['labelitemsConId_' + item] = arr;
                    DataTable.criticalInteract[data.id] = 'yes'

                    var htmlStr = "<button id = 'criticalRectId_" + containerId + "' parent = '" + containerId + "' class='mdl-button mdl-js-button mdl-button--icon mdl-button--colored btnTableAddOn'>"
                    htmlStr += "<i class='material-icons'>alarm_on</i></button>";
                    $("#criticalRectId_" + data.id).html(htmlStr);
                    $('.btnTableAddOn').css('width', '100%')
                    $('.btnTableAddOn').css('height', '100%')
                }

                if (item == 'Same-Label' || item == 'Similar-Items') {
                    for (var i = 0; i < Main.labels.length; i++) {
                        try {
                            var arr = ConsInt.activeConstraints[item]['input']['labelitemsConId_' + Main.labels[i]]
                            arr.push(data.id)
                            ConsInt.activeConstraints[item]['input']['labelitemsConId_' + Main.labels[i]] = arr;
                        } catch (e) {
                            // console.log(' errored on same label ', e)
                        }
                    }



                }
            }

            // $(".rowConstTable").css('border-bottom', '3px')
        })

    }

    // ON/OFF Volkwswagen          CMP     CRIT        SATISFIED Y/N
    // ON/OFF AUDI                 CMP     NON-CRIT    SATISFIED Y/N


})()