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

    StarM.getModelData = function () {
        var modelData = BarM.allModelData;
        var dataCollect = [];
        var origDef = ['Recall', 'Precision', 'F1-Score']
        for (var item in modelData) {
            var trainMet = modelData[item]['trainMetrics']
            var obj = {
                className: 'model_' + item,
                axes: [{
                        axis: 'Recall',
                        value: trainMet['acc'],
                    },
                    {
                        axis: 'Precision',
                        value: trainMet['prec'],
                    },
                    {
                        axis: 'F1-Score',
                        value: trainMet['f1'],
                    }
                ]
            }

            //add items from active constraints
            for (var item in ConsInt.activeConstraints) {
                var ind = origDef.indexOf(item)
                var name = ConsInt.activeConstraints[item]['usedName']

                if (ind == -1) {
                    var ob = {
                        axis: name,
                        value: Util.getRandomNumberBetween(1, 0).toFixed(2),
                    }
                    obj['axes'].push(ob);
                }
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
                    axes: d.axes.map(function (axis) {
                        return {
                            axis: axis.axis,
                            value: Math.ceil(Math.random() * 10)
                        };
                    })
                };
            });
        }

        return randomDataset();
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


    StarM.toggleModelConstraintView = function () {

        // var wid = $("#modelExplorePanel").width()
        // var ht = $("#modelExplorePanel").height()
        // wid = 300;
        // $("#modelExplorePanel").css('width', wid)
        // $("#modelExplorePanel").css('height', ht)

        StarM.modelOutputView = !StarM.modelOutputView;
        if (StarM.modelOutputView) {
            $(".modelOutputText").text('Model Output Panel')
            $("#starPlotContentId").hide()
            // $("#starPlotModelId").show()
            $("#modelOutDivId").show()
            $('.modelNameHead').show();

        } else {
            $(".modelOutputText").text('Constraint List View')

            $("#starPlotContentId").show()
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
        htmlStr = "<button id='toggleModelConstraintsId' class='someBtn mdl-button mdl-js-button mdl-button--icon mdl-button--colored'>"
        htmlStr += "<i class='material-icons'>blur_linear</i></button>";

        $(".starPlotHeadButton").append(htmlStr);

        //css styling
        $(".modelOutputText").css('margin-right', '25px')

        //click reset data button
        $("#someBtnId").on('click', function () {

        })


        //extra content
        StarM.addModelSelectors("starPlotHeadTitleId")


        $("#toggleModelConstraintsId").on('click', function (d) {
            StarM.toggleModelConstraintView();
        })

    }

    StarM.makeStarPlot = function (containerId = "") {
        console.log(' making star plot for models ')
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
        console.log('height found ', ht)
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
            .attr('height', cfg.h + cfg.h / 20);
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
                console.log(' styling the poly ', d, i)
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
                    htmlStr += "<div class = 'rowConstTable " + splClass + "' id = rowConstTableId_" + dataItem['id'] + +" parent = " + dataItem['id'] + " given = " + name + ">"
                    htmlStr += "<span class ='rowNameConstTable rowSpanConsTab rowSpanNameItem' parent = '" + dataItem[Main.entityNameSecondImp] + "'>" + nameItem + "</span>";
                    htmlStr += "<span class ='rowNameConstTable rowSpanConsTab rowSpanParent'>" + par + "</span>";
                    htmlStr += "<span class ='rowNameConstTable rowSpanConsTab rowSpanItem'>" + name + "</span>";
                    htmlStr += "<span class ='rowNameConstTable rowSpanConsTab'>" + result + "</span>";
                    htmlStr += "</div>"
                } // end of inner for
            }
        } // end of outer for


        //adding informative samples and wasteful samples
        if (DataTable.userInformativeItems.length > 0) {
            // htmlStr += "<div class = 'consTableDiv'>"
            var par = 'informative';
            var arrId = DataTable.userInformativeItems;
            for (var i = 0; i < arrId.length; i++) {
                var dataItem = Main.getDataById(arrId[i], Main.trainData);
                var nameItem = dataItem[Main.entityNameSecondImp];
                var fullNameItem = dataItem[Main.entityNameSecondImp];
                if (nameItem.length > 20) nameItem = nameItem.substring(0, 15) + "..."
                var result = Util.getRandomNumberBetween(1, 0).toFixed(0);
                var splClass = 'rowConstTableCol_' + result;
                StarM.constraintsDict[i] = true;
                htmlStr += "<div class = 'rowConstTable " + splClass + "' id = rowConstTableId_" + dataItem['id'] + +" parent = " + dataItem['id'] + " given = " + name + ">"
                htmlStr += "<span class ='rowNameConstTable rowSpanConsTab rowSpanNameItem' parent = '" + dataItem[Main.entityNameSecondImp] + "'>" + nameItem + "</span>";
                htmlStr += "<span class ='rowNameConstTable rowSpanConsTab rowSpanParent'>" + par + "</span>";
                htmlStr += "<span class ='rowNameConstTable rowSpanConsTab rowSpanItem'>" + name + "</span>";
                htmlStr += "<span class ='rowNameConstTable rowSpanConsTab'>" + result + "</span>";
                htmlStr += "</div>"
            } // end of inner for
        }

        if (DataTable.userWastefulItems.length > 0) {
            // htmlStr += "<div class = 'consTableDiv'>"
            var par = 'wasteful';
            var arrId = DataTable.userWastefulItems;
            for (var i = 0; i < arrId.length; i++) {
                var dataItem = Main.getDataById(arrId[i], Main.trainData);
                var nameItem = dataItem[Main.entityNameSecondImp];
                var fullNameItem = dataItem[Main.entityNameSecondImp];
                if (nameItem.length > 20) nameItem = nameItem.substring(0, 15) + "..."
                var result = Util.getRandomNumberBetween(1, 0).toFixed(0);
                var splClass = 'rowConstTableCol_' + result;
                StarM.constraintsDict[i] = true;
                htmlStr += "<div class = 'rowConstTable " + splClass + "' id = rowConstTableId_" + dataItem['id'] + +" parent = " + dataItem['id'] + " given = " + name + ">"
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
            console.log(' clicked on ', 'id', item, nameItem, data)








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