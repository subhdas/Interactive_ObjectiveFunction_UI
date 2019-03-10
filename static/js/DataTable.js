(function () {
    DataTable = {};
    DataTable.pickedAttrDict = {};
    DataTable.viewFullTable = true;
    DataTable.ratioSelect = 0.15;
    DataTable.extraContent = false;
    DataTable.showingFilterPanel = false;
    DataTable.addedExtra = 0;

    DataTable.splitView = true

    DataTable.fontColor = 'black'
    //auto triggers
    DataTable.criticalSwitch = false;
    DataTable.criticalClicked = false;
    DataTable.non_criticalClicked = false;

    DataTable.sameLabelClicked = false;
    DataTable.similarityClicked = false;


    //for critical items and informative sample toggle switches
    DataTable.criticalInteract = {}
    DataTable.criticalInteractAll = {
        '-1': '-'
    }
    DataTable.inforInteract = {}
    DataTable.inforInteractaLL = {
        '-1': '-'
    }

    //new variabbles
    DataTable.selectedRows = {}

    //user added data informative and wasteful
    DataTable.userInformativeItems = []
    DataTable.userWastefulItems = []


    DataTable.tagClicked = false;
    DataTable.tagClickName = ""
    DataTable.tagNameDataId = {}
    DataTable.latestTag = ""

    DataTable.findLabelAcc = function (labelTar, labelPre, type = 'train', index = -1) {

        var data = [];
        if (type == 'train') {
            data = Main.trainData;
        } else {
            data = Main.testData;
        }

        var idList = []
        data.forEach(function (d, i) {
            // console.log('data check ', d , Main.targetName, Main.predictedName)
            var predVal = BarM.modelData[0]['predictions']['trainPred'][d.id];
            if (type == 'test') predVal = BarM.modelData[0]['predictions']['testPred'][d.id];

            if (index != -1) {
                if (type == 'train') {
                    predVal = BarM.allModelData[index]['trainPred'][d.id];
                } else {
                    predVal = BarM.allModelData[index]['testPred'][d.id];
                }
            }

            if (d[Main.targetName] == labelTar && predVal == labelPre) {
                idList.push(d.id);
            }
        })

        idList = Util.getUniqueArray(idList);
        return idList;
    }

    DataTable.modelUpdateLabel = function (index = 0) {
        // return
        //train data update
        // var predTrainDict = BarM.modelData[0]['predictions']['trainPred'];
        var predTrainDict = BarM.allModelData[index]['trainPred'];
        for (var item in predTrainDict) {
            // console.log('updating data table ', item)
            var label = predTrainDict[item];
            var col = 'lightgray'

            // var existingLabel = $('#tr_' + item).find('.td_0_' + Main.targetName).text();
            var existingLabel = $('#tr_' + item).find('.td_0_' + Main.targetName).attr('parent');
            // if (existingLabel != label) col = Main.colors.HIGHLIGHT; //'orange'
            // // $('.td_id_' + item).parent().find('.td_0_' + Main.predictedName).text(label);
            // $('#tr_' + item).find('.td_0_' + Main.predictedName).text(label);
            // $('#tr_' + item).find('.td_0_' + Main.predictedName).css('border', '1px solid gray')
            // $('#tr_' + item).find('.td_0_' + Main.predictedName).css('background', col)
            // if (existingLabel != label) $('#tr_' + item).find('.td_0_' + Main.predictedName).css('color', 'white')

            // new design on label
            var res = 'check'
            var val = existingLabel
            var classSpl = ""
            if (existingLabel != label) {
                res = 'close';
                val = existingLabel + ' / ' + label;
                classSpl = "btnResOutSpl"
            }
            var htmlStr = "<button  parent = '" + 5 + "' given = '" + 5 + "'  \
                class='mdl-button mdl-js-button mdl-button--icon mdl-button--colored btnResOut " + classSpl + "' id='btnResOutId" + 0 + "'>"
            htmlStr += "<i class='material-icons'>" + res + "</i></button>"; // drag_handle
            htmlStr += "<span class = 'itemResult'>" + val + "</span>";
            $('#tr_' + item).find('.td_0_' + Main.targetName).html(htmlStr)

            $('.btnResOutSpl').css('background', Main.colors.HIGHLIGHT)
            $('.btnResOut').css('margin-right', '5px')
            // $('#tr_' + item).find('.td_0_' + Main.targetName).text(existingLabel + '/' + label)


        }


        //test data update
        // var predTestDict = BarM.modelData[0]['predictions']['testPred'];
        var predTestDict = BarM.allModelData[index]['testPred'];
        for (var item in predTestDict) {
            var label = predTestDict[item];
            var col = 'lightgray'
            var existingLabel = $("#tableContentTest").find('#tr_' + item).find('.td_0_' + Main.targetName).attr('parent');
            // console.log('updating test data table ', existingLabel, item)
            // if (existingLabel != label) col = Main.colors.HIGHLIGHT; //'orange'
            // // $('.td_id_' + item).parent().find('.td_0_' + Main.predictedName).text(label);
            // $("#tableContentTest").find('#tr_' + item).find('.td_0_' + Main.predictedName).text(label);
            // $("#tableContentTest").find('#tr_' + item).find('.td_0_' + Main.predictedName).css('border', '1px solid gray')
            // $("#tableContentTest").find('#tr_' + item).find('.td_0_' + Main.predictedName).css('background', col)
            // if (existingLabel != label) $("#tableContentTest").find('#tr_' + item).find('.td_0_' + Main.predictedName).css('color', 'white')



            //new changed rendering
            var res = 'check'
            var val = existingLabel
            var classSpl = ""
            if (existingLabel != label) {
                res = 'close';
                val = existingLabel + ' / ' + label;
                classSpl = "btnResOutSpl"
            }
            var htmlStr = "<button  parent = '" + 5 + "' given = '" + 5 + "'  \
                class='mdl-button mdl-js-button mdl-button--icon mdl-button--colored btnResOut " + classSpl + "' id='btnResOutId" + 0 + "'>"
            htmlStr += "<i class='material-icons'>" + res + "</i></button>"; // drag_handle
            htmlStr += "<span class = 'itemResult'>" + val + "</span>";
            $("#tableContentTest").find('#tr_' + item).find('.td_0_' + Main.targetName).html(htmlStr)

            $('.btnResOutSpl').css('background', Main.colors.HIGHLIGHT)
            $('.btnResOut').css('margin-right', '5px')


        }
    }

    DataTable.userUpdateLabel = function () {
        var arr = [];
        for (var item in LabelCard.storedData) {
            var data = LabelCard.storedData[item]['data'];
            var label = LabelCard.storedData[item]['label'];
            for (var i = 0; i < data.length; i++) {
                data[i][Main.targetName] = label;
                $('.td_id_' + data[i].id).parent().find('.td_' + Main.targetName).text(label);
            }
            arr = arr.concat(data);
        }
        Main.trainData = arr;
    }


    DataTable.updateHeader = function () {
        if (DataTable.viewFullTable) {
            $('.containerDataTableHeadText').text(Main.trainData.length + ' rows')
            DataTable.makeTable(Main.trainData);
        } else {
            // $('.dataTableHeadText').text(' Added : ' + Main.currentData.length + ' rows  | Left : ' + Main.leftData.length + ' rows ')
            $('.containerDataTableHeadText').text(' Current Data Length : ' + Main.currentData.length)
            DataTable.makeTable(Main.leftData);
        }
    }


    DataTable.updateOnlyHeader = function (dataGiven) {
        // $('.dataTableHeadText').text(dataGiven.length + ' rows');
        $('.containerDataTableHeadText').text(' Current Data Length : ' + Main.currentData.length)
    }


    DataTable.switchToLeftData = function () {
        DataTable.viewFullTable = false;
        // $('#tableContent').css('background', Main.colors.HIGHLIGHT);
        $('.containerDataTableHeadText').text(' Current Data Length : ' + Main.trainData.length)
    }


    DataTable.showTableView = function () {
        Main.tabelViewMode = true;
        if (Scat.filteredScatData.length > 0){
            DataTable.hideRowsById(Scat.filteredScatData, 'train')
        }
        $("#tableContent").show();
        $("#scatContent").hide();
    }


    DataTable.toggleTableContentViews = function (id = 0) {
        $("#tableHeadDivTrain").show()
        //id=0, train table , elese test table
        DataTable.splitView = !DataTable.splitView;
        if (Cons.accordionOpen) {

            if (id == 0) {
                //train
                $("#tableHeadDivTrain").hide()
                $('#trainContent').css('height', '0%')
                $('#testContent').css('height', '100%')
            } else {
                $('#trainContent').css('height', '100%')
                $('#testContent').css('height', '0%')
            }
        } else {
            if (DataTable.splitView) {
                //two tables showing
                $('#trainContent').css('height', '85%') // 50%
                $('#testContent').css('height', '15%') // 50%

            } else {
                //only one showing
                if (id == 0) {
                    //train
                    $('#trainContent').css('height', '100%');
                    $('#testContent').css('height', '0%');
                } else {
                    $("#tableHeadDivTrain").hide();
                    $('#trainContent').css('height', '0%')
                    $('#testContent').css('height', '100%')
                }
            }
        }
    }


   



    DataTable.addIconsTop = function (dataIn = Main.trainData, containerId = "") {

        if (containerId == "") {
            // containerId = "tableSelectors";
            containerId = "tableHeadDivTrain"
        }
        // $("#"+containerId).empty();
        $("#" + containerId).css('display', 'flex');

        // var htmlStr = "<div id='clusterControlDiv'></div>";
        // $("#" + containerId).append(htmlStr);


        // htmlStr = "<div class='iconHolder' id='addAllData' onclick='' title='Add all data'>"
        // htmlStr += "<img class='imgIcon' src='static/img/icons/loadData.png'></div>"

        // htmlStr = "<div class='iconHolder' id='tableViewC' onclick='' title='Show Table View'>"
        // htmlStr += "<img class='imgIcon' src='static/img/icons/table_view.png'></div>"

        // htmlStr += "<div class='iconHolder' id='correlViewC' onclick='' title='Show Correlation View'>"
        // htmlStr += "<img class='imgIcon' src='static/img/icons/parallel.png'></div>"

        htmlStr = "<div class = tabSelectorBtnsDiv>"
        htmlStr += "<button id='tableViewC' title='Show Table View' class='mdl-button mdl-js-button mdl-button--icon mdl-button--colored' title='Show Correlation View'>"
        htmlStr += "<i class='material-icons'>credit_card</i></button>";
        htmlStr += "<button id='correlViewC' class='mdl-button mdl-js-button mdl-button--icon mdl-button--colored'>"
        htmlStr += "<i class='material-icons'>border_outer</i></button>";


        // htmlStr += "<button id='bakeModels' class='mdl-button mdl-js-button mdl-button--icon mdl-button--colored bakeModelsCl'>"
        // htmlStr += "<i class='material-icons'>play_circle_filled</i></button>";
        htmlStr += '</div>'
        // htmlStr += "<button id='dataToggleBtn'> </button>";

        htmlStr += "<div class = tableHeadButtons>"
        // htmlStr += "<button id='addConstraints' class='mdl-button mdl-js-button mdl-button--icon mdl-button--colored'>"
        // htmlStr += "<i class='material-icons'>chat</i></button>";
        // htmlStr += "<button id='bakeModels' class='mdl-button mdl-js-button mdl-button--icon mdl-button--colored'>"
        // htmlStr += "<i class='material-icons'>dashboard</i></button>";
        htmlStr += '</div>'

        htmlStr += "<div class = 'dataTableHeadText' id = 'dataTableHeadTextId'><div class = 'containerDataTableHeadText'>" + dataIn.length + " rows </div></div>";
        // htmlStr += "<div class='iconHolder' id='addLabelCard' onclick='' title='Add Label Card'>"
        // htmlStr += "<img class='imgIcon' src='static/img/icons/add.png'></div>"




        // htmlStr += "<button id='addConstraints' class='mdl-button mdl-js-button mdl-button--icon mdl-button--colored'>"
        // htmlStr += "<i class='material-icons'>chat</i></button>";



        $("#" + containerId).append(htmlStr);


        //adds constraint selector inline
        setTimeout(() => {
            ConP.addPanelInLine();
        }, 10);


        $(".tabSelectorBtnsDiv").css('display', 'flex')
        $(".tabSelectorBtnsDiv").css('align-items', 'center')

        $('.dataTableHeadText').css('display', 'flex');
        // $('.dataTableHeadText').css('flex-direction', 'row-reverse');
        $('.dataTableHeadText').css('width', 'auto');
        $('.dataTableHeadText').css('padding', '5px');
        $('.dataTableHeadText').css('align-self', 'center');
        $('.dataTableHeadText').css('font-size', '1.2em');

        $('.containerDataTableHeadText').css('display', 'flex')
        $('.containerDataTableHeadText').css('align-items', 'center')

        $('.tableHeadButtons').css('display', 'flex')
        $('.tableHeadButtons').css('align-items', 'center')


        // $('.dataTableHeadText').css('display' , )


        $('#addConstraints').on('click', function () {
            ConP.addPanelCon();
            // ConP.addConstrainSelector();  
        })


        $('#correlViewC').on('click', function () {
            Scat.showScatterView();
        })

        $('#tableViewC').on('click', function () {
            DataTable.showTableView();
        })

        // table mode button click
        $('#bakeModels').on('click', function (e) {
            e.stopPropagation();
            // var objSend = {
            //     data: Main.trainData,
            //     selectedRowIds: DataTable.selectedRows
            // };
            // socket.emit("find_similarData", objSend);
            // socket.off('find_similarData');
            // socket.removeAllListeners('similarData_return');
            // socket.on("similarData_return", function(dataObj) {
            //     console.log('similar data returned ', dataObj);
            //     LabelCard.computeReturnData = dataObj;
            //     LabelCard.getDataObject(dataObj['indexBydata']); 
            //     LabelCard.makeCards();
            // })
            Main.loadingSpinnerToggle(true);
            var metricList = Object.keys(ConsInt.activeConstraints);
            var metricObj = Cons.constraintIdFinder();
            console.log(' finding metric obj ', metricObj)
            var objSend = {
                'train': Main.trainData,
                'test': Main.testData,
                'targetCol': Main.targetName,
                'metrics': metricList,
                'metricKeys': metricObj,
            }
            socket.emit("get_good_model", objSend);
            // socket.off('get_good_model');
            // socket.removeAllListeners('send_good_model');
            socket.on("send_good_model", function (dataObj) {
                console.log('good model recieved ', dataObj);
                BarM.modelData[0] = Object.assign({}, dataObj);


                var confMatrixTrain = JSON.parse(dataObj['predictions']['trainConfMatrix'])
                var confMatrixTest = JSON.parse(dataObj['predictions']['testConfMatrix'])
                BarM.modelData[0]['predictions']['trainConfMatrix'] = confMatrixTrain;
                BarM.modelData[0]['predictions']['testConfMatrix'] = confMatrixTest;
                console.log('confMatrix gotten ', confMatrixTrain);

                BarM.allModelData = dataObj['predictionsAll']




                // comppute data ids for each label combo
                // train conf matr
                var dataObj = {};
                for (var i = 0; i < confMatrixTrain.length; i++) {
                    var row = confMatrixTrain[i];
                    for (var j = 0; j < row.length; j++) {
                        var idList = DataTable.findLabelAcc(Main.labels[i], Main.labels[j], 'train')
                        var obj = {
                            'data_idList': idList,
                            'num_pred': row[j]
                        }
                        dataObj[i + '_' + j] = obj;
                    }
                }
                BarM.modelData[0]['predictions']['confMatTrain_ids'] = dataObj;



                // test conf matr
                var dataObj = {};
                for (var i = 0; i < confMatrixTest.length; i++) {
                    var row = confMatrixTest[i];
                    for (var j = 0; j < row.length; j++) {
                        var idList = DataTable.findLabelAcc(Main.labels[i], Main.labels[j], 'test')
                        var obj = {
                            'data_idList': idList,
                            'num_pred': row[j]
                        }
                        dataObj[i + '_' + j] = obj;
                    }
                }
                BarM.modelData[0]['predictions']['confMatTest_ids'] = dataObj;
                BarM.allModelData[0] = BarM.modelData[0]['predictions']

                BarM.computeIdsConfMatrAllModel();
                setTimeout(() => {
                    // StarM.makeStarPlot();

                    var arr = ['id'];
                    arr.push.apply(arr, Object.keys(Main.numericalAttributes));
                    var dataNumeric = Main.getDataByKeys(arr, Main.trainData);
                    console.log('par coord model metric ', arr, dataNumeric)
                    StarM.makeMetricsParCoord('',dataNumeric, true);
                }, 0);

                

                ConfM.makeConfMatrix(confMatrixTrain, 'train');
                ConfM.makeConfMatrix(confMatrixTest, 'test'); // test

                DataTable.modelUpdateLabel();
                Cons.checkConstraintsActive();




                setTimeout(() => {
                    Main.loadingSpinnerToggle(false);
                    BarM.histData[BarM.modIter] = BarM.allModelData;
                    BarM.modIter += 1;
                }, 150);


            })
        })







    }

    DataTable.dragFunction = function () {
        console.log('adding drag function')
        // $(".dataViewAppTable tr").draggable({
        $("tr").draggable({
            helper: "clone",
            start: function () {
                // console.log(' starting drag ')
                $(this).css('border-bottom', '5px solid black')
            },
            drag: function () {
                // console.log('dragging now ', this)
            },
            stop: function (e, ui) {
                var id = $(this).attr('id');
                DataTable.lastLabelCardId = $(this).parent().parent().parent();
                DataTable.lastLabelCardId = DataTable.lastLabelCardId.attr('id');
                DataTable.lastLabelCardId = Util.getNumberFromText(DataTable.lastLabelCardId)
                var idNum = Util.getNumberFromText(id);
                console.log('stopped drag now ', id, idNum, DataTable.lastLabelCardId);
                DataTable.lastDraggedId = idNum;
                $(this).css('border-bottom', 'transparent');
                // DataTable.filterById(idNum);
            }
        });

        //add droppable
        $(".ui-droppable.tableContent").droppable({
            activate: function (event, ui) {
                console.log("droppable activate")
            },
            // tolerance: "intersect",
            // accept: "tr",
            // activeClass: "ui-state-default",
            // hoverClass: "ui-state-hover",
            drop: function (event, ui) {
                $(this).addClass("ui-state-highlight")
                $(this).append($(ui.draggable));
                console.log("dropped item ", event, this, ui)
            }
        });


    }

    DataTable.filterById = function (idGiven) {
        var data = [];
        if (Main.leftData.length == 0) {
            data = Util.deepCopyData(Main.trainData);
        } else {
            data = Util.deepCopyData(Main.leftData);
        }
        var key = Object.keys(DataTable.pickedAttrDict);
        if (key.length == 0) {
            data = Main.getDataById(idGiven, data);
            if (typeof data == 'undefined') return;
            var maxCluster = d3.max(ClusterModeler.clusterIds);
            if (typeof maxCluster == 'undefined') maxCluster = 0;
            data['cluster'] = maxCluster + 1;
            ClusterModeler.clusterIds.push(data['cluster']);
            // Main.currentData = [Object.assign({}, data)]
            data = [Object.assign({}, data)]
            data.push.apply(data, Main.currentData)
            singleRowCheck = true;
        } else {
            data = data.filter(function (d) {
                // return d.id == idGiven;
                if (d.id == idGiven) return true
                for (var item in DataTable.pickedAttrDict) {
                    var ran = Main.attrDict[item]['range'];
                    var fac = Math.abs(+ran[0] - +ran[1]) * DataTable.ratioSelect
                    if (d[item] == DataTable.pickedAttrDict[item]) {
                        return true;
                    }

                    if (Math.abs(d[item] - DataTable.pickedAttrDict[item]) < fac) {
                        return true;
                    }
                }
                return false;
            }) // data filtering completes here

            if (data.length < ClusterModeler.numClusters + 1) {
                data.push.apply(data, Main.currentData);
                singleRowCheck = true;
                console.log('filter data commes less than 10 length ', data)
            } else {
                singleRowCheck = false;
            }
        }


        Main.currentTempStoreData = Util.deepCopyData(Main.currentData);
        var clusterIds = []
        for (var i = 0; i < Main.currentTempStoreData.length; i++) {
            clusterIds.push(Main.currentTempStoreData[i]['cluster']);
        }
        clusterIds = Util.getUniqueArray(clusterIds);
        if (data.length > 0) {
            // console.log('filtering , ', data.length, Main.currentData.length)
            for (var i = 0; i < ClusterModeler.numRecommendations; i++) {
                console.log('current data obtained iterating ', i, Main.currentData.length, data.length, clusterIds);
                // ClusterModeler.getClustering(true, Main.currentData, i, clusterIds.length); // commented
                ClusterModeler.getClustering(true, false, data, i, clusterIds.length, singleRowCheck, true);
            }
            // DataTable.makeTable(data);
        }
        console.log(' filtered by id data now : ', data);
        //computes leftData
        DataTable.computeLeftData();
    }


    DataTable.computeLeftData = function () {
        //computeleftdata
        setTimeout(() => {
            var currentDataId = [];
            for (var i = 0; i < Main.currentData.length; i++) {
                currentDataId.push(+Main.currentData[i]['id']);
            }
            Main.leftData = [];
            for (var i = 0; i < Main.trainData.length; i++) {
                var index = currentDataId.indexOf(Main.trainData[i]['id'])
                if (index == -1) Main.leftData.push(Object.assign({}, Main.trainData[i]));
            }
            DataTable.pickedAttrDict = {};
            DataTable.updateHeader();

        }, 400);
    }

    DataTable.filterTableByCluster = function (item) {
        var data = Util.deepCopyData(Main.currentData);
        // data.forEach(function(d){

        // })
        data = data.filter(function (d) {
            // console.log('got d is ', d, d.cluster)
            return d.cluster == item;
        })

        console.log('data length table  ', data.length, item)
        DataTable.makeTable(data);
        DataTable.updateOnlyHeader(data);
        $('#tableContent').css('background', 'white');
    }

    DataTable.makeFilterVisTable = function (attr, el, dataIn, containerId) {
        if (attr == Main.entityName || attr == Main.entityNameSecondImp) return;
        try {
            if (Main.attrDict[attr]['type'] == 'categorical') return;
        } catch (e) {
            return;
        }
        var data = [];
        dataIn.forEach(function (d, i) {
            var obj = {
                index: i,
                label: d['id'],
                value: d[attr]
            }
            data.push(obj)
        })

        // el.css('display', 'flex')
        // el.css('flex-direction', 'row')
        el.css('width', 'auto')

        var id = el.attr('id');
        var w = parseFloat(el.css('width'));
        var h = parseFloat(el.css('height'));
        // console.log('in filter vis table  ', attr, data, id)

        // w = 200;
        h = 75; // 75

        w = 100 // 199
        // console.log('data ffound ', attr, data, id, w, h);
        // BarM.makeFeatureLabelsVerBar(id,w,h,data)
        BarM.makeHistoFilterTable(id, w, h, data, dataIn, attr, containerId);

    }

    DataTable.addExtraItemsTables = function (containerId = "", data) {
        // return
        // console.log('extra item adding ', containerId, DataTable.addedExtra)
        if (DataTable.addedExtra == 0) containerId = "tableContent"
        else containerId = "tableContentTest";

        var table = d3.select('#dataViewAppTable_' + containerId)
        // var titles = d3.keys(data[0]);
        var titles = table.selectAll('th').data();
        // console.log(' data head is ', titles)
        table.selectAll('td')
            .attr('width', '125px')
        $('#' + containerId).css('display', 'block')






        // to add filter panel
        // table.selectAll('#'+containerId)
        table.select('tbody')
            .insert("tr", ":first-child")
            .attr('id', 'filter_tr_' + containerId)
            .attr('class', 'filter_tr')
            .attr('height', '100px')
            .data([data[0]])
            .selectAll("td")
            .data(function (d) {
                // console.log(' getting d as ', d, titles)
                return titles.map(function (k) {
                    return {
                        value: d[k],
                        name: k
                    };
                });
            })
            .enter()
            .append("td")
            .attr('id', function (d) {
                return 'filter_td_' + d.name + '_' + containerId
                // return 'filter_td_' + d.name
            })
            .attr("data-th", function (d) {
                return d.name;
            })
            .attr("data-id", function (d) {
                return d.id;
            })
            .attr('class', function (d) {
                return 'td_' + d.value + ' td_' + d.name + ' td_' + d.name + '_' + d.value;
            })
            .style('background', function (d) {
                if (DataTable.addedExtra == 1) dataGo = Main.testData;
                else dataGo = Main.trainData;
                // console.log(' found ', d.name, containerId)
                DataTable.makeFilterVisTable(d.name, $(this), dataGo, containerId)
                return '';
            })



        //adds critical and informative sample interactions
        table.selectAll('tr')
            .insert("td", ":first-child")
            // .attr('id', 'critical_')
            .attr('id', function (d, i) {
                return 'critical_' + i
            })
            .attr('class', 'critical_cls')
            // .style('background', 'white')
            .style('display', function (d, i) {
                if (i != 0) return 'flex'
                // return flex;
            })
            .style('flex-direction', 'row')
            .style('width', '150px')
            // .style('background', 'white')
            // .style('color', 'black')
            .html(function (d, i) {
                // console.log(' d and i is ', d, i)
                if (i < 2) {
                    var col = $(this).siblings().attr('background');
                    if (i == 0) col = "#333"
                    if (i == 0) col = "white"
                    if (i == 1) col = ""
                    $(this).css('background', col);
                    return ""
                } else {
                    // return ""
                    // var htmlStr = "<div class='switch switch_critical' id = 'switch_critical_" + d.id + "'><label>";
                    // htmlStr += "<input type='checkbox' id = 'check_critical_" + d.id + "'><span class='lever'></span></label></div>"
                    // htmlStr += "<label><input type='checkbox' class='filled-in check_discard' id = 'check_discard_" + d.id + "'/><span></span></label>"
                    // return htmlStr;

                    DataTable.criticalInteract[d.id] = '-'
                    DataTable.inforInteract[d.id] = '-'
                    var htmlStr = "<div class ='containIntBtns' >"
                    // htmlStr += "<div class = 'criticalRect tableBtnInt' id = 'criticalRectId_" + d.id + "' >"
                    htmlStr += "<div id = 'criticalRectId_" + d.id + "' class = 'criticalRect tableBtnInt' >"
                    htmlStr += "<button  class='mdl-button mdl-js-button mdl-button--icon mdl-button--colored btnTableAddOn'>"
                    htmlStr += "<i class='material-icons'>linear_scale</i></button>";
                    htmlStr += "</div>"


                    // htmlStr += "<div id = 'criticalRectId_" + d.id + "'  class='iconHolder criticalRect tableBtnInt'  title='Show logs'>"
                    // htmlStr += "<img class='imgIcon' src='static/img/icons/print.png'> </div>"

                    // htmlStr += "</div>";
                    // htmlStr += "<div class = 'infoRect tableBtnInt' id = 'infoRectId_" + d.id + "' ></div>";

                    if (containerId == 'tableContent') {
                        htmlStr += "<div id = 'infoRectId_" + d.id + "' class = 'infoRect tableBtnInt' >"
                        htmlStr += "<button  class='mdl-button mdl-js-button mdl-button--icon mdl-button--colored  btnTableAddOn'>"
                        htmlStr += "<i class='material-icons'>arrow_forward</i></button>";
                        htmlStr += "</div>"
                    }


                    htmlStr += "</div>"
                    return htmlStr

                }
            })

        // for selectall buttons
        $("#dataViewAppTable_" + containerId)
            .find("#critical_1")
            // .css('background', 'yellow')
            .html(function (d, i) {
                // DataTable.criticalInteract[d.id] = '-'
                // DataTable.inforInteract[d.id] = '-'
                var htmlStr = "<div class ='containIntBtns' >"
                // htmlStr += "<div class = 'tableBtnInt criticalRectAll' id = 'criticalRectId_" + containerId + "' parent = '" + containerId + "' >"
                // htmlStr += "</div>";                
                htmlStr += "<div id = 'criticalRectId_" + containerId + "' parent = '" + containerId + "' class = 'tableBtnInt criticalRectAll' >"
                htmlStr += "<button  class='mdl-button mdl-js-button mdl-button--icon mdl-button--colored  btnTableAddOn'>"
                htmlStr += "<i class='material-icons'>linear_scale</i></button>";
                htmlStr += "</div>"



                // htmlStr += "<div class = 'tableBtnInt infoRectAll' id = 'infoRectId_" + containerId + "' parent = '" + containerId + "' ></div>";
                if (containerId == 'tableContent') {

                    htmlStr += "<div id = 'infoRectId_" + containerId + "' parent = '" + containerId + "' class = 'tableBtnInt infoRectAll' >"
                    htmlStr += "<button class='mdl-button mdl-js-button mdl-button--icon mdl-button--colored btnTableAddOn'>"
                    htmlStr += "<i class='material-icons'>arrow_forward</i></button>";
                    htmlStr += "</div>"

                }
                // htmlStr += "</div>";


                htmlStr += "</div>"
                return htmlStr;
            })



        // style for critical and informative samples
        $(".containIntBtns").css("display", 'flex')
        $(".containIntBtns").css("margin-right", '4px')

        $(".tableBtnInt").css("display", 'flex')
        $(".tableBtnInt").css("height", '20px')
        $(".tableBtnInt").css("width", '20px')
        // $(".tableBtnInt").css("background", 'lightgray')
        $(".tableBtnInt").css("justify-content", 'center')
        $(".tableBtnInt").css("border-radius", '4px')
        $(".tableBtnInt").css("margin", '4px')

        $(".btnTableAddOn").css('height', '100%')
        $(".btnTableAddOn").css('width', '100%')


        //interactions for select all buttons
        $(".criticalRectAll").on('mouseover', function (d, i) {
            $(this).css('border', '1px solid black')
        })
        $(".criticalRectAll").on('mouseout', function (d, i) {
            $(this).css('border', '')
        })
        $(".criticalRectAll").on('click', function (d, i) {
            if (DataTable.criticalSwitch) {
                return
            }
            DataTable.criticalSwitch = true;
            setTimeout(function () {
                DataTable.criticalSwitch = false;
            }, 500)

            DataTable.fromTableInferred = true;
            setTimeout(() => {
                DataTable.fromTableInferred = false;
            }, 6000);
            var id = -1;
            var val = DataTable.criticalInteractAll[id];
            if (val == '-') {
                DataTable.criticalInteractAll[id] = 'yes'
                // $(this).css('background', Main.colors.HIGHLIGHT);
                //id = 'criticalRectId_" + containerId + "' parent = '" + containerId + "'
                var htmlStr = "<button class='mdl-button mdl-js-button mdl-button--icon mdl-button--colored btnTableAddOn'>"
                htmlStr += "<i class='material-icons'>alarm_on</i></button>";
                $(this).html(htmlStr);
                $('.btnTableAddOn').css('width', '100%')
                $('.btnTableAddOn').css('height', '100%')
                DataTable.tempLatestTag = 'Critical'

            } else if (val == 'yes') {
                DataTable.criticalInteractAll[id] = 'no'
                // $(this).css('background', Main.colors.HIGHLIGHT2);

                var htmlStr = "<button class='mdl-button mdl-js-button mdl-button--icon mdl-button--colored btnTableAddOn'>"
                htmlStr += "<i class='material-icons'>alarm_off</i></button>";
                $(this).html(htmlStr);
                $('.btnTableAddOn').css('width', '100%')
                $('.btnTableAddOn').css('height', '100%')
                DataTable.tempLatestTag = 'Ignore'

            } else {
                DataTable.criticalInteractAll[id] = '-'
                // $(this).css('background', 'lightgray');

                var htmlStr = "<button class='mdl-button mdl-js-button mdl-button--icon mdl-button--colored btnTableAddOn'>"
                htmlStr += "<i class='material-icons'>linear_scale</i></button>";
                $(this).html(htmlStr);
                $('.btnTableAddOn').css('width', '100%')
                $('.btnTableAddOn').css('height', '100%')
            }
            var col = $(this).css('background-color');
            var state = DataTable.criticalInteractAll[id];
            // var arr = ParC.filteredData;
            var stri = 'Critical-Items';
            var stri2 = 'Non-Critical';
            // Cons.typeConstraints['COMPOSITIONAL'][stri]['Checked'] = true; // !Cons.typeConstraints['COMPOSITIONAL'][stri]['Checked'];
            // ConsInt.getActiveConstraints();
            // ConsInt.activeConstraints[stri]['input']['labelitemsConId_' + stri] = ParC.filteredData;

            var cont = $(this).attr('parent')
            $("#dataViewAppTable_" + cont)
                .find(".trTable:visible")
                .each(function (i, el) {
                    var id = $(this).attr('id');
                    id = Util.getNumberFromText(id);
                    // arr.push(id)
                    // $("#criticalRectId_" + id).css('background', col)
                    htmlStr = "<button class='mdl-button mdl-js-button mdl-button--icon mdl-button--colored btnTableAddOn'>"

                    if (col == "rgb(194, 53, 115)" || state == 'yes') {
                        htmlStr += "<i class='material-icons'>alarm_on</i></button>";

                    } else if (col == "rgb(53, 183, 194)" || state == 'no') {
                        htmlStr += "<i class='material-icons'>alarm_off</i></button>";

                    } else {
                        htmlStr += "<i class='material-icons'>linear_scale</i></button>";
                    }
                    $("#criticalRectId_" + id).html(htmlStr);
                    $("#criticalRectId_" + id).attr('parent', state);
                    DataTable.criticalInteract[id] = state
                    $('.btnTableAddOn').css('width', '100%')
                    $('.btnTableAddOn').css('height', '100%')
                });

            if (state == 'yes') {
                Cons.typeConstraints['COMPOSITIONAL'][stri]['Checked'] = true; //false     
                Cons.typeConstraints['COMPOSITIONAL'][stri2]['Checked'] = false; //false
                DataTable.criticalClicked = false;
            } else if (state == 'no') {
                Cons.typeConstraints['COMPOSITIONAL'][stri]['Checked'] = false; //false
                Cons.typeConstraints['COMPOSITIONAL'][stri2]['Checked'] = true; //false          
                DataTable.criticalClicked = true;
            } else {
                //same as no
                Cons.typeConstraints['COMPOSITIONAL'][stri]['Checked'] = false; //false     
                Cons.typeConstraints['COMPOSITIONAL'][stri2]['Checked'] = false; //false
                DataTable.criticalClicked = true;
            }
            var critIdList = [];
            var critIdList2 = [];
            // $("#dataViewAppTable_" + cont)
            //     .find(".trTable:visible")
            //     .each(function (i, el) {
            //         // console.log(' found is ', i, cont, el)
            //         var id = $(this).attr('id');
            //         id = Util.getNumberFromText(id);
            //         // arr.push(id)
            //         var back = $("#criticalRectId_" + id).css('background-color')
            //         // console.log(' found back col as ', back)
            //         if (back == 'rgb(194, 53, 115)' || state == 'yes') {
            //             critIdList.push(id);
            //         }

            //         if (back == 'rgb(53, 183, 194)' || state == 'no') {
            //             critIdList2.push(id);
            //         }
            //     });



            $("#dataViewAppTable_" + cont)
                .find(".trTable")
                .each(function (i, el) {
                    var id = $(this).attr('id');
                    // var stateGot = $(this).attr('parent');
                    id = Util.getNumberFromText(id);
                    // arr.push(id)
                    var back = $("#criticalRectId_" + id).css('background-color')
                    var stateGot = $("#criticalRectId_" + id).attr('parent')
                    // console.log('state getting ', stateGot, id)
                    // console.log(' found back col as ', back)
                    if (back == 'rgb(194, 53, 115)' || stateGot == 'yes') {
                        critIdList.push(id);
                    }

                    if (back == 'rgb(53, 183, 194)' || stateGot == 'no') {
                        critIdList2.push(id);
                    }
                });


            if (critIdList.length == 0) {
                Cons.typeConstraints['COMPOSITIONAL'][stri]['Checked'] = false; //false          
                DataTable.criticalClicked = false;
            } else {
                Cons.typeConstraints['COMPOSITIONAL'][stri]['Checked'] = true; //true
                DataTable.criticalClicked = true;
            }

            if (critIdList2.length == 0) {
                Cons.typeConstraints['COMPOSITIONAL'][stri2]['Checked'] = false; //false          
                DataTable.criticalClicked = false;
            } else {
                Cons.typeConstraints['COMPOSITIONAL'][stri2]['Checked'] = true; //true
                DataTable.criticalClicked = true;
            }
            ConsInt.getActiveConstraints();
            try {
                ConsInt.activeConstraints[stri]['input']['labelitemsConId_' + stri] = critIdList;
            } catch (e) {}
            try {
                ConsInt.activeConstraints[stri2]['input']['labelitemsConId_' + stri2] = critIdList2;
            } catch (e) {}



            setTimeout(() => {
                var idBtn = $(".btn_" + stri).attr('id')
                var idBtn2 = $(".btn_" + stri2).attr('id')
                $("#" + idBtn).click();
                $("#" + idBtn2).click();
            }, 100);

            // Rul.makeRuleList('', 'critical_All');
            DataTable.makeTags();
        }) // end of rect dict


        $(".infoRectAll").on('click', function (d, i) {
            if (DataTable.criticalSwitch) {
                return
            }
            DataTable.criticalSwitch = true;
            setTimeout(function () {
                DataTable.criticalSwitch = false;
            }, 500)
            var id = -1;
            var val = DataTable.inforInteractaLL[id];
            if (val == '-') {
                DataTable.inforInteractaLL[id] = 'yes'
                // $(this).css('background', Main.colors.HIGHLIGHT);
                var htmlStr = "<button class='mdl-button mdl-js-button mdl-button--icon mdl-button--colored btnTableAddOn'>"
                htmlStr += "<i class='material-icons'>arrow_upward</i></button>";
                $(this).html(htmlStr);
                $('.btnTableAddOn').css('width', '100%')
                $('.btnTableAddOn').css('height', '100%')
                DataTable.tempLatestTag = 'informative'

            } else if (val == 'yes') {
                DataTable.inforInteractaLL[id] = 'no'
                // $(this).css('background', Main.colors.HIGHLIGHT2);
                var htmlStr = "<button class='mdl-button mdl-js-button mdl-button--icon mdl-button--colored btnTableAddOn'>"
                htmlStr += "<i class='material-icons'>arrow_downward</i></button>";
                $(this).html(htmlStr);
                $('.btnTableAddOn').css('width', '100%')
                $('.btnTableAddOn').css('height', '100%')
                DataTable.tempLatestTag = 'wasteful'

            } else {
                DataTable.inforInteractaLL[id] = '-'
                // $(this).css('background', 'lightgray');
                var htmlStr = "<button class='mdl-button mdl-js-button mdl-button--icon mdl-button--colored btnTableAddOn'>"
                htmlStr += "<i class='material-icons'>arrow_forward</i></button>";
                $(this).html(htmlStr);
                $('.btnTableAddOn').css('width', '100%')
                $('.btnTableAddOn').css('height', '100%')
            }
            var col = $(this).css('background-color');
            var state = DataTable.inforInteractaLL[id];

            // var arr = ParC.filteredData;

            var cont = $(this).attr('parent')
            $("#dataViewAppTable_" + cont)
                .find(".trTable:visible")
                .each(function (i, el) {
                    // console.log(' found is ', i, cont, el)
                    var id = $(this).attr('id');
                    id = Util.getNumberFromText(id);
                    // arr.push(id)
                    // $("#infoRectId_" + id).css('background', col)

                    htmlStr = "<button class='mdl-button mdl-js-button mdl-button--icon mdl-button--colored btnTableAddOn'>"

                    if (col == "rgb(194, 53, 115)" || state == 'yes') {
                        htmlStr += "<i class='material-icons'>arrow_upward</i></button>";

                    } else if (col == "rgb(53, 183, 194)" || state == 'no') {
                        htmlStr += "<i class='material-icons'>arrow_downward</i></button>";

                    } else {
                        htmlStr += "<i class='material-icons'>arrow_forward</i></button>";
                    }
                    $("#infoRectId_" + id).html(htmlStr);
                    $("#infoRectId_" + id).attr('parent', state);
                    DataTable.inforInteract[id] = state

                    $('.btnTableAddOn').css('width', '100%')
                    $('.btnTableAddOn').css('height', '100%')

                });

            var critIdInforList = [];
            var critIdWasteList = []
            $("#dataViewAppTable_" + cont)
                .find(".trTable")
                .each(function (i, el) {
                    // console.log(' found is ', i, cont, el)
                    var id = $(this).attr('id');
                    id = Util.getNumberFromText(id);
                    // arr.push(id)
                    var back = $("#infoRectId_" + id).css('background-color')
                    // var stateGot = $("#infoRectId_" + id).attr('parent')
                    var stateGot = DataTable.inforInteract[id];


                    // console.log(' found back col as ', back)
                    if (back == 'rgb(194, 53, 115)' || stateGot == 'yes') {
                        critIdInforList.push(id);
                    }

                    if (back == 'rgb(53, 183, 194)' || stateGot == 'no') {
                        critIdWasteList.push(id);
                    }
                });

            DataTable.userInformativeItems = critIdInforList;
            DataTable.userWastefulItems = critIdWasteList;

            DataTable.makeTags();
        }) // end of inforectall




        //interactions for critical and informative samples
        $(".criticalRect").on('mouseover', function (d, i) {
            $(this).css('border', '1px solid black')
        })
        $(".criticalRect").on('mouseout', function (d, i) {
            $(this).css('border', '')
        })
        $(".criticalRect").on('click', function (d, i) {
            if (DataTable.criticalSwitch) {
                return
            }
            DataTable.criticalSwitch = true;
            setTimeout(function () {
                DataTable.criticalSwitch = false;
            }, 500)

            d.stopPropagation();
            var id = $(this).attr('id');
            id = Util.getNumberFromText(id);
            var val = DataTable.criticalInteract[id];
            if (val == '-') {
                DataTable.criticalInteract[id] = 'yes'
                // $(this).css('background', Main.colors.HIGHLIGHT);
                var htmlStr = "<button id = 'criticalRectId_" + containerId + "' parent = '" + containerId + "' class='mdl-button mdl-js-button mdl-button--icon mdl-button--colored btnTableAddOn'>"
                htmlStr += "<i class='material-icons'>alarm_on</i></button>";
                $(this).html(htmlStr);
                $('.btnTableAddOn').css('width', '100%')
                $('.btnTableAddOn').css('height', '100%')
                DataTable.tempLatestTag = 'Critical'


                // $(this).parent().prepend(htmlStr);
                // $(this).remove()
            } else if (val == 'yes') {
                DataTable.criticalInteract[id] = 'no'
                // $(this).css('background', Main.colors.HIGHLIGHT2);
                var htmlStr = "<button id = 'criticalRectId_" + containerId + "' parent = '" + containerId + "' class='mdl-button mdl-js-button mdl-button--icon mdl-button--colored btnTableAddOn'>"
                htmlStr += "<i class='material-icons'>alarm_off</i></button>";
                $(this).html(htmlStr)
                $('.btnTableAddOn').css('width', '100%')
                $('.btnTableAddOn').css('height', '100%')
                DataTable.tempLatestTag = 'Ignore'

            } else {
                DataTable.criticalInteract[id] = '-'
                // $(this).css('background', 'lightgray');
                var htmlStr = "<button id = 'criticalRectId_" + containerId + "' parent = '" + containerId + "' class='mdl-button mdl-js-button mdl-button--icon mdl-button--colored btnTableAddOn'>"
                htmlStr += "<i class='material-icons'>linear_scale</i></button>";
                $(this).html(htmlStr)
                $('.btnTableAddOn').css('width', '100%')
                $('.btnTableAddOn').css('height', '100%')
            }

            //critical items find
            var critIdList = []
            for (var item in DataTable.criticalInteract) {
                if (DataTable.criticalInteract[item] == 'yes') {
                    // console.log(' checked yes found ', item, DataTable.criticalInteract[item])
                    critIdList.push(item)
                }
            }
            critIdList = Util.getUniqueArray(critIdList);
            // console.log('critical id list found ', critIdList)
            var stri = 'Critical-Items'
            // DataTable.fromTableInferred = true;
            // setTimeout(() => {
            //     DataTable.fromTableInferred = false;
            // }, 6000);
            Cons.typeConstraints['COMPOSITIONAL'][stri]['Checked'] = true; // !Cons.typeConstraints['COMPOSITIONAL'][stri]['Checked'];
            ConsInt.getActiveConstraints();
            ConsInt.activeConstraints[stri]['input']["labelitemsConId_" + stri] = critIdList;

            var idBtn = $(".btn_" + stri).attr('id')
            // console.log('button click check ', arr, DataTable.criticalClicked)
            if (!DataTable.criticalClicked) {
                setTimeout(() => {
                    // $("#" + idBtn).trigger('click');
                    $("#" + idBtn).click();
                }, 100);
                // $("#" + idBtn).trigger('click');
                DataTable.criticalClicked = true;
                // console.log(' now tag is ', DataTable.criticalClicked, idBtn)
            }
            if (critIdList.length == 0 && DataTable.criticalClicked) {
                // $("#" + idBtn).trigger('click');
                Cons.typeConstraints['COMPOSITIONAL'][stri]['Checked'] = false;
                $("#" + idBtn).click();
                DataTable.criticalClicked = false;
                // console.log(' now tag is 2 ', DataTable.criticalClicked, idBtn)
            }

            setTimeout(() => {
                //non-critical items find
                var critIdList = []
                for (var item in DataTable.criticalInteract) {
                    if (DataTable.criticalInteract[item] == 'no') {
                        // console.log(' checked yes found ', item, DataTable.criticalInteract[item])
                        critIdList.push(item)
                    }
                }
                critIdList = Util.getUniqueArray(critIdList);
                // return
                // console.log('critical id list found ', critIdList)
                if (critIdList.length > 0) {
                    var stri2 = 'Non-Critical'
                    Cons.typeConstraints['COMPOSITIONAL'][stri2]['Checked'] = true; // !Cons.typeConstraints['COMPOSITIONAL'][stri]['Checked'];
                    ConsInt.getActiveConstraints();
                    ConsInt.activeConstraints[stri2]['input']["labelitemsConId_" + stri2] = critIdList;

                    var idBtn = $(".btn_" + stri2).attr('id')
                    // console.log('button click check ', arr, DataTable.criticalClicked)
                    if (critIdList.length > 0 && !DataTable.non_criticalClicked) {
                        Cons.typeConstraints['COMPOSITIONAL'][stri2]['Checked'] = true;
                        setTimeout(() => {
                            $("#" + idBtn).trigger('click');
                        }, 100);
                        DataTable.non_criticalClicked = true;
                        // console.log(' now tag is ', DataTable.non_criticalClicked, idBtn, critIdList)
                    }
                    if (critIdList.length == 0 && DataTable.non_criticalClicked) {
                        Cons.typeConstraints['COMPOSITIONAL'][stri2]['Checked'] = false;
                        $("#" + idBtn).click();
                        DataTable.non_criticalClicked = false;
                    }
                }
                DataTable.makeTags();

            }, 800);

            return

        }) // end of critical 


        $(".infoRect").on('mouseover', function (d, i) {
            $(this).css('border', '1px solid black')
        })
        $(".infoRect").on('mouseout', function (d, i) {
            $(this).css('border', '')
        })
        $(".infoRect").on('click', function (d, i) {
            var id = $(this).attr('id');
            id = Util.getNumberFromText(id);
            var val = DataTable.inforInteract[id];
            // console.log(' clicked info rect ', id, val)
            d.stopPropagation();

            if (val == '-') {
                DataTable.inforInteract[id] = 'yes'
                // $(this).css('background', Main.colors.HIGHLIGHT);

                var htmlStr = "<button id = 'infoRectid_" + containerId + "' parent = '" + containerId + "' class='mdl-button mdl-js-button mdl-button--icon mdl-button--colored btnTableAddOn'>"
                htmlStr += "<i class='material-icons'>arrow_upward</i></button>";
                $(this).html(htmlStr);
                $('.btnTableAddOn').css('width', '100%')
                $('.btnTableAddOn').css('height', '100%')
                DataTable.tempLatestTag = 'informative'

            } else if (val == 'yes') {
                DataTable.inforInteract[id] = 'no'
                // $(this).css('background', Main.colors.HIGHLIGHT2);
                var htmlStr = "<button id = 'infoRectid_" + containerId + "' parent = '" + containerId + "' class='mdl-button mdl-js-button mdl-button--icon mdl-button--colored btnTableAddOn'>"
                htmlStr += "<i class='material-icons'>arrow_downward</i></button>";
                $(this).html(htmlStr);
                $('.btnTableAddOn').css('width', '100%')
                $('.btnTableAddOn').css('height', '100%')
                DataTable.tempLatestTag = 'wasteful'

            } else {
                DataTable.inforInteract[id] = '-'
                // $(this).css('background', 'lightgray');
                var htmlStr = "<button id = 'infoRectid_" + containerId + "' parent = '" + containerId + "' class='mdl-button mdl-js-button mdl-button--icon mdl-button--colored btnTableAddOn'>"
                htmlStr += "<i class='material-icons'>arrow_forward</i></button>";
                $(this).html(htmlStr);
                $('.btnTableAddOn').css('width', '100%')
                $('.btnTableAddOn').css('height', '100%')
            }

            var critIdList = []
            for (var item in DataTable.inforInteract) {
                if (DataTable.inforInteract[item] == 'yes') {
                    critIdList.push(item)
                }
            }
            DataTable.userInformativeItems = Util.getUniqueArray(critIdList);

            var critIdList = []
            for (var item in DataTable.inforInteract) {
                if (DataTable.inforInteract[item] == 'no') {
                    critIdList.push(item)
                }
            }
            DataTable.userWastefulItems = Util.getUniqueArray(critIdList);
            DataTable.makeTags();

        })



        //toggle switches input controls-----------------------------------------------------------------------------------------
        $(".switch_critical").on('input', function (e) {
            if (DataTable.criticalSwitch) {
                return
            }
            DataTable.criticalSwitch = true;
            setTimeout(function () {
                DataTable.criticalSwitch = false;
            }, 500)

            var id = $(this).attr('id');
            var idNum = Util.getNumberFromText(id);
            console.log('e is ', e, idNum);
            var stri = 'Critical-Items'
            Cons.typeConstraints['COMPOSITIONAL'][stri]['Checked'] = !Cons.typeConstraints['COMPOSITIONAL'][stri]['Checked'];
            ConsInt.getActiveConstraints();
            // console.log('active cons ', ConsInt.activeConstraints)
            try {
                var arr = ConsInt.activeConstraints[stri]['input']["labelitemsConId_" + stri]
                var ind = arr.indexOf(idNum)
                if (ind != -1) {
                    arr.splice(ind, 1);
                } else {
                    arr.push(idNum);
                }
            } catch (e) {
                ConsInt.activeConstraints[stri]['input']["labelitemsConId_" + stri] = [idNum]
            }
            setTimeout(function () {
                $(".btn_" + stri).trigger("click");
            }, 1000)


            // if(typeof ConsInt.activeConstraints[stri] != 'undefined'){
            try {
                var item = ConsInt.activeConstraints[stri]
                // $(".btn_"+stri).trigger("click");
                var x = document.getElementsByClassName("btn_" + stri);
                var id = $(".btn_" + stri).attr('id')
                var elem = document.getElementById(id);
                // elem.click();
                var arr = ConsInt.activeConstraints[stri]['input']["labelitemsConId_" + stri]
                if (!DataTable.criticalClicked) {
                    elem.click()
                    DataTable.criticalClicked = true;
                }
                if (arr.length == 0 && DataTable.criticalClicked) {
                    elem.click();
                    DataTable.criticalClicked = false;
                }

                console.log('clicked button cons ', ConsInt.activeConstraints[stri], item, id)
            } catch (e) {
                console.log('error in clicking button ', e, ConsInt.activeConstraints, stri)

            }
        })

        $(".check_discard").on('input', function (e) {
            var id = $(this).attr('id');
            var idNum = Util.getNumberFromText(id);
            console.log('e in check discard is ', e, idNum);
            var stri = 'Discard-Items'
            Cons.typeConstraints['PREDICTIVE'][stri]['Checked'] = !Cons.typeConstraints['PREDICTIVE'][stri]['Checked'];
            ConsInt.getActiveConstraints();
            // console.log('active cons ', ConsInt.activeConstraints)
            try {
                var arr = ConsInt.activeConstraints[stri]['input']["labelitemsConId_" + stri]
                var ind = arr.indexOf(idNum)
                if (ind != -1) {
                    arr.splice(ind, 1);
                } else {
                    arr.push(idNum);
                }
            } catch (e) {
                ConsInt.activeConstraints[stri]['input']["labelitemsConId_" + stri] = [idNum]
            }
        })



    } // end of add extra



    DataTable.hideRowsById = function (idList, type = 'train') {
        // console.log('idlist before  , ', idList)
        idList.forEach(function (d, i) {
            idList[i] = +idList[i]
        })
        // console.log('idlist now , ', idList)
        var data = Main.trainData;
        if (type == 'test') data = Main.testData;
        data.forEach(function (d, i) {
            if (idList.indexOf(+d.id) == -1) {
                $('#tr_' + +d.id).hide();
            }
        })
    }


    DataTable.addFilterPanel = function (top, left, w, h) {
        var htmlStr = "<div class = 'filterPanelDiv ui-widget-content'><div class = 'filterPanelHeader'> <p class = 'filterHeadtext'>Filter</p>"

        htmlStr += "<div class = 'filterHeadButtonRack' ><button id='tickFilterBtn' class='filterPanelBtns mdl-button mdl-js-button mdl-button--icon mdl-button--colored'>"
        htmlStr += "<i class='material-icons'>done</i></button>";

        htmlStr += "<button id='resetFilterPanel' class='filterPanelBtns mdl-button mdl-js-button mdl-button--icon mdl-button--colored'>"
        htmlStr += "<i class='material-icons'>keyboard_return</i></button>";

        htmlStr += "<button id='clearFilterPanel' class='filterPanelBtns mdl-button mdl-js-button mdl-button--icon mdl-button--colored'>"
        htmlStr += "<i class='material-icons'>clear</i></button></div></div>";
        htmlStr += "<div id = 'filterContentId' class = 'filterContent'></div>"
        htmlStr += "</div></div>"
        $('body').append(htmlStr);





        $(function () {
            $(".filterPanelDiv").draggable();
        });

        // console.log('window width ', w)

        $(".filterPanelDiv").css('position', 'absolute');
        $(".filterPanelDiv").css('top', top + 'px');
        $(".filterPanelDiv").css('left', left + 'px');
        $(".filterPanelDiv").css('height', h + 'px');
        $(".filterPanelDiv").css('width', w + 'px');
        $(".filterPanelDiv").css('overflow-x', 'hidden');
        $(".filterPanelDiv").css('overflow-y', 'auto');
        $(".filterPanelDiv").css('border', '1px dotted lightgray');
        $(".filterPanelDiv").css('background', 'white');
        $(".filterPanelDiv").css('box-shadow', '2px 3px 3px 2px lightgray');

        $(".filterPanelHeader").css('padding', '10px');
        $(".filterPanelHeader").css('background', Main.colors.HIGHLIGHT);
        $(".filterPanelHeader").css('width', '100%');
        $(".filterPanelHeader").css('height', '40px');
        $(".filterPanelHeader").css('display', 'block');
        // $(".filterPanelHeader").css('flex', '2 1 auto');



        // $(".filterPanelHeader").css('padding', '10px');
        // $(".filterPanelHeader").css('background', Main.colors.HIGHLIGHT);
        // $(".filterHeadButtonRack").css('width', '100%');
        $(".filterHeadButtonRack").css('height', '100%');
        $(".filterHeadButtonRack").css('display', 'flex');

        $(".filterPanelBtns").css('color', 'white')

        $(".filterHeadtext").css('float', 'left');
        $(".filterHeadtext").css('width', '82%');
        $(".filterHeadtext").css('display', 'inline');
        $(".filterHeadtext").css('color', 'white');


        // $(".filterContent").css('padding', '10px');
        $(".filterContent").css('width', '100%');
        $(".filterContent").css('height', '70%');
        $(".filterContent").css('display', 'flex');
        $(".filterContent").css('flex-direction', 'column');

        $("#clearFilterPanel").css('float', 'right');
        var arr = ['id'];
        arr.push.apply(arr, Object.keys(Main.numericalAttributes));


        var dataNumeric = Main.getDataByKeys(arr, Main.trainData);
        ParC.makeParallelCoordChart('filterContentId', dataNumeric);

        $("#clearFilterPanel").on('click', function () {
            DataTable.hideFilterPanel();
        })

        $("#tickFilterBtn").on('click', function () {
            DataTable.hideSelectedRows(ParC.filteredData);
        })

        $("#resetFilterPanel").on('click', function () {
            DataTable.resetFilterPanel();
        })


    }

    DataTable.resetFilterPanel = function () {
        $(".trTable").show();
        ParC.filteredData = [];
        var arr = ['id'];
        arr.push.apply(arr, Object.keys(Main.numericalAttributes));
        var dataNumeric = Main.getDataByKeys(arr, Main.trainData);
        ParC.makeParallelCoordChart('filterContentId', dataNumeric);
    }

    DataTable.hideSelectedRows = function (arrIds = [], containerId = 'tableContent') {
        // var containerId = 'tableContent'
        $("#dataViewAppTable_" + containerId).find('.trTable').hide();
        // $(".trTable").hide();
        for (var i = 0; i < arrIds.length; i++) {
            // $("#tr_" + arrIds[i]).show();
            $("#dataViewAppTable_" + containerId).find("#tr_" + arrIds[i]).show();
        }
    }

    DataTable.hideFilterPanel = function () {
        $(".filterPanelDiv").hide();
        DataTable.showingFilterPanel = false;

    }

    DataTable.showFilterPanel = function () {
        $(".filterPanelDiv").show();
        DataTable.showingFilterPanel = true;
    }


    DataTable.makeTable = function (dataGiven = main.appData, containerId = "tableContent") {
        $("#dataViewAppTable_" + containerId).remove();

        // var color_scale = d3.scale.linear().domain([0, 1]).range(['beige', 'green']);
        var color_scale = d3.scale.linear().domain([0, 1]).range([Main.colors.DARK_BWN, Main.colors.LIGHT_BWN]);


        var data = Util.deepCopyData(dataGiven);
        var vc = 15
        data.forEach(function (d, i) {
            // return
            delete d.cluster;
            // delete d.id
            d['0_' + Main.targetName] = d[Main.targetName]
            // d['0_' + Main.predictedName] = d[Main.predictedName]
            delete d[Main.targetName];
            delete d[Main.predictedName];

            var name = d[Main.entityNameSecondImp]
            // console.log(' name is ', name, name.length)
            try {
                if (name.length > vc) {
                    name = name.substring(0, vc) + '...'
                }
            } catch (e) {}

            d[Main.entityNameSecondImp] = name
            if(Main.entityNameSecondImp == "0_") delete d[Main.entityNameSecondImp]
            // var temp = d.id;
            // delete d['id']
            // d['zid'] = temp
        }); // end of data for each
        // main.testData = data.slice();


        var sortAscending = true;
        var table = d3
            .select("#" + containerId)
            .insert("table", ":first-child")
            .attr("id", "dataViewAppTable_" + containerId)
            // .attr("class", "dataViewAppTable mdl-data-table mdl-js-data-table mdl-data-table--selectable mdl-shadow--2dp")
            .attr("class", "dataViewAppTablep")
            .attr("height", "100%")
            .attr("width", "auto");
        // .attr("margin-top", "10px");

        $("#dataViewAppTable_" + containerId).css("margin-top", "10px");
        //  .append('div')
        //  .attr('class', 'sepDivDataView')
        //  .style('height', '100px')
        //  .style('width', '100%')

        var titles = d3.keys(data[0]);
        titles.sort();
        var headers = table
            .append("thead")
            .append("tr")
            .selectAll("th")
            .data(titles)
            .enter()
            .append("th")
            .attr('class', 'fixedHeader')
            // .attr('class', 'mdl-data-table__cell--non-numeric')
            .text(function (d) {
                return d
            })
            .style('color', 'black')
            .style('background', 'white')
            .on("click", function (d) {
                // headers.attr("class", "header");

                // if (sortAscending) {
                //     rows.sort(function(a, b) {
                //         if (b[d] < a[d]) return 1
                //         else return -1
                //     });
                //     sortAscending = false;
                //     this.className = "aes";
                // } else {
                //     rows.sort(function(a, b) {
                //         if (b[d] < a[d]) return -1
                //         else return 1
                //     });
                //     sortAscending = true;
                //     this.className = "des";
                // }
            });

        var rows = table
            .append("tbody")
            .attr('class', 'scrollContent')
            .selectAll("tr")
            .data(data)
            .enter()
            .append("tr")
            .attr('class', function (d, i) {
                return 'trTable ' + containerId + '_trCl_' + i
            })
            .attr('id', function (d) {
                // return containerId + '_tr_' + d.id;
                return 'tr_' + d.id;
            })
            .style('background', function (d) {
                var id = d.id;
                var parId = Util.getNumberFromText(containerId);
                if (parId == "") return "";
                else {
                    var index = LabelCard.computeReturnData['indexBydata'][parId].indexOf(id);
                    // console.log('returning can add color ', index, id, parId)
                    if (index != -1) {
                        var prob = LabelCard.computeReturnData['probByData'][parId][index];
                        // return color_scale(Util.getRandomNumberBetween(1,0))
                        // console.log('returning color scale ', prob)
                        return color_scale(prob);
                    } else {
                        return ""
                    }
                }

            })
            .on('mouseover', function (d) {
                try {
                    DataTable.nodeColor = d3.selectAll(".node_" + d.id).style("fill");
                    d3.selectAll(".node_" + d.id).style("fill", "black");
                } catch (err) {

                }

            })
            .on('mouseout', function (d) {
                try {
                    d3.selectAll(".node_" + d.id).style("fill", DataTable.nodeColor);
                } catch (err) {

                }

            })
        rows
            .selectAll("td")
            .data(function (d) {
                return titles.map(function (k) {
                    return {
                        value: d[k],
                        name: k,
                        id: d['id']
                    };
                });
            })
            .enter()
            .append("td")
            .attr("data-th", function (d) {
                return d.name;
            })
            .attr("data-id", function (d) {
                return d.id;
            })
            .attr('parent', function (d) {
                return d.value
            })
            .attr('class', function (d) {
                return 'td_' + d.value + ' td_' + d.name + ' td_' + d.name + '_' + d.value;
            })
            .text(function (d) {
                return d.value;
            })
            // .html(function(d){
            //     return "<div class = 'td_elem_cell' >"+d.value+"</div>";
            // })
            // .style('height', '2em')
            .on('click', function (d) {
                // if (DataTable.viewFullTable) return;
                // // return;
                // var back = $(this).css('background-color');
                // console.log(' background value ', back, d)
                // if (back.toString() == "rgba(0, 0, 0, 0)" || typeof back == 'undefined') {
                //     // $('.td_' + d.name).css('background', 'rgba(0,0,0,0)');
                //     // $('.td_' + d.name + '_' + d.value).css('background', Main.colors.HIGHLIGHT);
                //     // $(this).css('background', Main.colors.HIGHLIGHT);
                //     $(this).closest('tr').css('background', Main.colors.HIGHLIGHT);
                //     var txt = $(this).text();
                //     var nameAttr = $(this).attr('data-th');
                //     var idAttr = $(this).closest('tr').attr('id');
                //     idAttr = Util.getNumberFromText(idAttr);
                //     DataTable.pickedAttrDict[nameAttr] = txt;
                //     console.log('txt clicked ', txt, nameAttr, idAttr, DataTable.pickedAttrDict);
                // } else {
                //     // $(this).css('background', 'rgba(0,0,0,0)');
                //     $(this).closest('tr').css('background', 'rgba(0,0,0,0)');
                //     // $('.td_' + d.name + '_' + d.value).css('background', 'rgba(0,0,0,0)');
                //     var nameAttr = $(this).attr('data-th');
                //     delete DataTable.pickedAttrDict[nameAttr];
                //     console.log('txt removing  clicked ', txt, nameAttr, DataTable.pickedAttrDict);
                // }
                //
                // var ran = Main.attrDict[d.name]['range'];
                // var fac = Math.abs(+ran[0] - +ran[1]) * DataTable.ratioSelect;
                // var idList = [];
                // //find data ids which will be effected on selecting this value
                // data.forEach(function (m) {
                //     if (Math.abs(m[d.name] - d.value) < fac) {
                //         idList.push(m.id);
                //     }
                // })
                //
                // for (var k = 0; k < idList.length; k++) {
                //     var back = $("#tr_" + idList[k]).find('.td_' + d.name).css('background-color');
                //     console.log('background color clikced now ', back);
                //     // $("#tr_" + idList[k]).find('.td_' + d.name).css('background', Main.colors.HIGHLIGHT);
                //     if (back.toString() == "rgba(0, 0, 0, 0)" || typeof back == 'undefined')  {
                //         $("#tr_" + idList[k]).find('.td_' + d.name).css('background', Main.colors.HIGHLIGHT);
                //     }else{
                //         $("#tr_" + idList[k]).find('.td_' + d.name).css('background', 'rgba(0,0,0,0)');
                //     }
                // }
                // console.log('background ', idList, fac)
                // // $(this).css('background', 'cyan')
            })
            .on('mouseover', function (d) {
                DataTable.tdOrigColor = $(this).css('background')
                $(this).css('background', Main.colors.HIGHLIGHT2);
                var id = d.id;
                // console.log(' d is ', d)
                for (var item in BarM.filterHistData) {
                    var nam = item.split('_')[0];
                    if (d.name == nam) {
                        if (BarM.filterHistData[item].indexOf(id) != -1) {
                            DataTable.tempCol = $("#histoBars_" + containerId + "_" + item).css('fill');
                            DataTable.tempItem = item;
                            $("#histoBars_" + containerId + "_" + item).css('fill', Main.colors.HIGHLIGHT);
                            return
                        }
                    }
                }
            })
            .on('mouseout', function (d) {
                $(this).css('background', DataTable.tdOrigColor);
                $("#histoBars_" + containerId + "_" + DataTable.tempItem).css('fill', DataTable.tempCol);



            })

        // $(".td_elem_cell").css('height', 'auto');
        // $(".td_elem_cell").css('max-height', '25px');


        $("#dataViewAppTable_" + containerId + " tr").on('click', function (d) {
            if (containerId != "tableContent") return;
            var back = $(this).css('background-color');
            // console.log("clicked tabel tr ", $(this), d, back);
            var idNum = Util.getNumberFromText($(this).attr('id'));
            if (typeof idNum == 'undefined') return;

            if (ConP.showingConstPanel) {
                var valueSelect = $('.selectConstrain').val();

                // if (typeof ConP.selectedRowsCons[idNum] == 'undefined') {
                if (back != 'rgb(53, 183, 194)') {
                    $(this).css('background', Main.colors.HIGHLIGHT2);
                    DataTable.fontColor = $(this).css('color');
                    $(this).css('color', 'white');
                    ConP.selectedRowsCons[idNum] = true;
                    console.log(' was not there before ', idNum, ConP.selectedRowsCons, back)
                    DataTable.tempLatestTag = valueSelect;
                } else {
                    $(this).css('background', "rgb(255,255,255)");
                    console.log("removing colors")
                    delete ConP.selectedRowsCons[idNum];


                    //delete from the main data
                    var arr = ConsInt.activeConstraints[valueSelect]['input']["labelitemsConId_" + TabCon.radioCheckedSame];
                    var ind = arr.indexOf(idNum);
                    arr.splice(ind, 1)

                    $(this).css('color', 'black');
                    console.log(' was there before ', idNum, ConP.selectedRowsCons);
                }


                //directly adding the data


                //Same label
                if (valueSelect == 'Same-Label') {

                    DataTable.tempLatestTag = 'Candidate'
                    Cons.typeConstraints['COMPOSITIONAL'][valueSelect]['Checked'] = true;
                    ConsInt.getActiveConstraints();
                    var arr = ConsInt.activeConstraints[valueSelect]['input']["labelitemsConId_" + TabCon.radioCheckedSame];
                    try {
                        arr.push.apply(arr, Object.keys(ConP.selectedRowsCons));
                        arr = Util.getUniqueArray(arr)
                    } catch (err) {
                        arr = Object.keys(ConP.selectedRowsCons);
                    }
                    ConsInt.activeConstraints[valueSelect]['input']["labelitemsConId_" + TabCon.radioCheckedSame] = arr;
                    // TabCon.makeSameLabContent();
                    TabCon.addSameLabContentFromData(valueSelect);

                    var arr = Object.keys(ConP.selectedRowsCons);
                    ConP.selectedRowsCons = {};
                    // commented - no need deselect
                    arr.forEach(function (d, i) {
                        // $("#tr_" + d).css('background', "rgb(255,255,255)")
                        // $("#tr_" + d).css('color', 'black')
                    })

                    //auto select the same label button on top
                    if (arr.length > 0) {
                        var id = $(".btn_" + valueSelect).attr('id')
                        var elem = document.getElementById(id);
                        elem.click();
                        DataTable.sameLabelClicked = true;
                        $(".btn_" + valueSelect).trigger("click")
                    }

                    if (arr.length == 0 && DataTable.sameLabelClicked) {
                        DataTable.sameLabelClicked = false;
                        var id = $(".btn_" + valueSelect).attr('id')
                        var elem = document.getElementById(id);
                        elem.click();
                    }
                }

                if (valueSelect == 'Similarity-Metric') {

                    DataTable.tempLatestTag = 'Similarity'

                    // $("._mainContentMid").empty();
                    Cons.typeConstraints['COMPOSITIONAL'][valueSelect]['Checked'] = true;
                    ConsInt.getActiveConstraints();
                    var arr = ConsInt.activeConstraints[valueSelect]['input']["labelitemsConId_" + TabCon.radioCheckedSame];
                    try {
                        arr.push.apply(arr, Object.keys(ConP.selectedRowsCons));
                        arr = Util.getUniqueArray(arr)
                    } catch (err) {
                        arr = Object.keys(ConP.selectedRowsCons);
                    }
                    ConsInt.activeConstraints[valueSelect]['input']["labelitemsConId_" + TabCon.radioCheckedSame] = arr;

                    // TabCon.makeSameLabContent("_mainContentMid" + TabCon.radioCheckedSame, TabCon.radioCheckedSame, valueSelect);
                    TabCon.addSameLabContentFromData(valueSelect);
                    var arr = Object.keys(ConP.selectedRowsCons);
                    ConP.selectedRowsCons = {};
                    //commented - no need to deselect
                    arr.forEach(function (d, i) {
                        // $("#tr_" + d).css('background', "rgb(255,255,255)")
                        // $("#tr_" + d).css('color', 'black')
                    })


                    //auto select the similarity metric button on top
                    if (arr.length > 0) {
                        var id = $(".btn_" + valueSelect).attr('id')
                        var elem = document.getElementById(id);
                        elem.click();
                        DataTable.similarityClicked = true;
                        $(".btn_" + valueSelect).trigger("click")
                    }

                    if (arr.length == 0 && DataTable.similarityClicked) {
                        DataTable.similarityClicked = false;
                        var id = $(".btn_" + valueSelect).attr('id')
                        var elem = document.getElementById(id);
                        elem.click();
                    }
                }
                DataTable.makeTags();


            } else {
                return
                // if (typeof DataTable.selectedRows[idNum] == 'undefined') {
                //     $(this).css('background', Main.colors.HIGHLIGHT);
                //     DataTable.fontColor = $(this).css('color');
                //     $(this).css('color', 'white');
                //     DataTable.selectedRows[idNum] = true;
                // } else {
                //     $(this).css('background', "rgb(255,255,255)");
                //     console.log("removing colors")
                //     delete DataTable.selectedRows[idNum];
                //     $(this).css('color', DataTable.fontColor);
                // }
            }


        })

        DataTable.dragFunction()
        if (DataTable.extraContent == false) {
            try {
                DataTable.addExtraItemsTables(containerId, data);
                DataTable.extraContent = true;
                DataTable.addedExtra += 1
            } catch (e) {

            }

        }



        //adding for freezing top row

        $("#tableContent").scroll(function () {
            return
            var screenTop = $(document).scrollTop();
            var thisTop = $(this).scrollTop();

            // var wid = $("#critical_2").width();


            $(this).find('thead').css('position', 'absolute')
            // $(this).find('thead').css('width', '1600px')
            $(this).find('thead').css('display', 'flex')
            $(this).find('thead').css('top', thisTop - 20)
            $(this).find('thead').closest('tr').css('background', 'white')
            $(this).find('th').css('display', 'table-cell')
            $(this).find('th').css('width', '400px')
            // $(this).find('thead').closest('th').css('z-index', 100)
            $(this).find('thead').css('z-index', 100)



            setTimeout(() => {
                var wid = $("#critical_2").css('width');
                console.log('scrollng noew ', screenTop, thisTop, wid)

                $('#critical_0').css('width', wid)
                $('#critical_0').css('display', 'table-cell')
            }, 0);




            $(this).find('.filter_tr').css('position', 'absolute')
            $(this).find('.filter_tr').css('display', 'table')
            $(this).find('.filter_tr').css('height', '100px')
            $(this).find('.filter_tr').css('top', thisTop + 40 - 20)
            $(this).find('.filter_tr').closest('tr').css('background', 'white')
            $(this).find('.filter_tr').find('td').css('width', '100px')
            $(this).find('.filter_tr').closest('tr').css('z-index', 100)
            $(this).find('.filter_tr').css('z-index', 100)

            // $('tbody').css('width', '1600px')
            $('tbody').css('display', 'table')
            $('td').css('width', '100px')
            $('td').css('min-width', '100px')
            $('td').css('display', 'table-cell')
            $('.critical_cls').css('width', '55px')

        });


    }; // end of makeTable


    DataTable.makeHeatMapTable = function (dataGiven = main.appData, containerId = "tableContent") {
        $("#dataViewAppTable_" + containerId).remove();

        // var color_scale = d3.scale.linear().domain([0, 1]).range(['beige', 'green']);
        var color_scale = d3.scale.linear().domain([0, 1]).range([Main.colors.DARK_BWN, Main.colors.LIGHT_BWN]);

        var data = Util.deepCopyData(dataGiven);

        // console.log(" drawing test data table ... ", dataGiven);
        data.forEach(function (d, i) {
            delete d.cluster;
            // d['0_' + Main.targetName] = d[Main.targetName]
            // d['0_' + Main.predictedName] = d[Main.predictedName]
            // delete d[Main.targetName];
            // delete d[Main.predictedName];
        }); // end of data for each

        var sortAscending = true;
        var table = d3
            .select("#" + containerId)
            .insert("table", ":first-child")
            .attr("id", "dataViewAppTable_" + containerId)
            .attr("class", "dataViewAppTable")
            .attr("height", "100%")
            .attr("width", "100%");

        $("#dataViewAppTable_" + containerId).css("margin-top", "10px");


        var titles = d3.keys(data[0]);
        titles.sort();
        var headers = table
            .append("thead")
            .append("tr")
            .selectAll("th")
            .data(titles)
            .enter()
            .append("th")
            .text(function (d) {
                return d;
            })
            .on("click", function (d) {
                headers.attr("class", "header");

                if (sortAscending) {
                    rows.sort(function (a, b) {
                        if (b[d] < a[d]) return 1
                        else return -1
                    });
                    sortAscending = false;
                    this.className = "aes";
                } else {
                    rows.sort(function (a, b) {
                        if (b[d] < a[d]) return -1
                        else return 1
                    });
                    sortAscending = true;
                    this.className = "des";
                }
            });

        var rows = table
            .append("tbody")
            .selectAll("tr")
            .data(data)
            .enter()
            .append("tr")
            .attr('class', function (d, i) {
                return 'trTable trCl_' + i
            })
            .attr('id', function (d) {
                return 'tr_' + d.id;
            })
            // .style('background', function(d) {
            //   var id = d.id;
            //   var parId = Util.getNumberFromText(containerId);
            //   if (parId == "") return "";
            //   else {
            //     var index = LabelCard.computeReturnData['indexBydata'][parId].indexOf(id);
            //     // console.log('returning can add color ', index, id, parId)
            //     if (index != -1) {
            //       var prob = LabelCard.computeReturnData['probByData'][parId][index];
            //       // return color_scale(Util.getRandomNumberBetween(1,0))
            //       // console.log('returning color scale ', prob)
            //       return color_scale(prob);
            //     } else {
            //       return ""
            //     }
            //   }

            // })
            .on('mouseover', function (d) {
                try {
                    DataTable.nodeColor = d3.selectAll(".node_" + d.id).style("fill");
                    d3.selectAll(".node_" + d.id).style("fill", "black");
                } catch (err) {

                }

            })
            .on('mouseout', function (d) {
                try {
                    d3.selectAll(".node_" + d.id).style("fill", DataTable.nodeColor);
                } catch (err) {

                }

            })
        rows
            .selectAll("td")
            .data(function (d) {
                return titles.map(function (k) {
                    return {
                        value: d[k],
                        name: k
                    };
                });
            })
            .enter()
            .append("td")
            .attr("data-th", function (d) {
                return d.name;
            })
            .attr("data-id", function (d) {
                return d.id;
            })
            .attr('class', function (d) {
                return 'td_' + d.value + ' td_' + d.name + ' td_' + d.name + '_' + d.value;
            })
            .style('margin', '10px')
            .text(function (d) {
                if (d.name != Main.entityNameSecondImp &&
                    d.name != Main.entityName && d.name != 'predicted' && d.name != 'target_variable') {
                    // console.log('Main attr ', Main.attrDict[d.name], d.name, d.value)
                    var ran = Main.attrDict[d.name]['range']
                    var diff = ran[1] - ran[0];
                    var val = d.value / ran[1];
                    var col = color_scale(val.toFixed(3));
                    $(this).closest('td').css('background', col);
                    // return val.toFixed(3);
                    return d.value;

                } else {
                    return d.value;
                }

            })
            .on('click', function (d) {

            })


        $("#dataViewAppTable_" + containerId + " tr").on('click', function (d) {
            if (containerId != "tableContent") return;
            var back = $(this).css('background-color');
            // console.log("clicked tabel tr ", $(this), d, back);
            var idNum = Util.getNumberFromText($(this).attr('id'));
            if (typeof idNum == 'undefined') return;

            if (typeof DataTable.selectedRows[idNum] == 'undefined') {
                $(this).css('background', Main.colors.HIGHLIGHT);
                DataTable.fontColor = $(this).css('color');
                $(this).css('color', 'white');
                // var selection = $(this).closest('td')
                // DataTable.selectedRows[idNum] = d3.select(selection).datum();
                DataTable.selectedRows[idNum] = true;
            } else {
                $(this).css('background', "rgb(255,255,255)");
                console.log("removing colors")
                delete DataTable.selectedRows[idNum];
                $(this).css('color', DataTable.fontColor);
            }
        })

        DataTable.dragFunction()

    }; // end of makeTable



    DataTable.getTagNames = function () {
        tagDict = {}
        for (var item in Cons.typeConstraints) {
            if (item == 'QUANTITATIVE' || item == 'GENERALIZATION') continue;
            var obj = Cons.typeConstraints[item];
            for (var el in obj) {
                if (el == 'misc') continue;
                if (obj[el]['Checked']) {
                    tagDict[el] = true
                } else {
                    tagDict[el] = true // to be removed
                }
            }
        }

        tagDict['informative'] = true
        tagDict['wasteful'] = true
        tagDict['different'] = true
        return tagDict
    }

    DataTable.createFakeTagIdData = function (tagDict) {

        for (var item in tagDict) {
            var numLen = Util.getRandomNumberBetween(20, 5).toFixed(0);
            var idList = [];
            for (var i = 0; i < numLen; i++) {
                var val = Util.getRandomNumberBetween(140, 0).toFixed(0)
                idList.push(+val)
            }
            tagDict[item] = idList
        }
        DataTable.tagNameDataId = tagDict;
    }

    DataTable.getTagRealData = function () {
        var tagDict = {}
        for (var item in ConsInt.activeConstraints) {
            var arrDict = ConsInt.activeConstraints[item]['input'];
            var arrId = [];
            for (var el in arrDict) {
                arrId.push.apply(arrId, arrDict[el])
            }
            arrId = Util.getUniqueArray(arrId);
            // if (arrId.length > 0) tagDict[item] = arrId;
            if (arrId.length > 0) tagDict[ConsInt.activeConstraints[item]['usedName']] = arrId;
        }

        //for informative and wasteful items
        if (DataTable.userInformativeItems.length > 0) {
            tagDict['informative'] = DataTable.userInformativeItems;
        }
        if (DataTable.userWastefulItems.length > 0) {
            tagDict['wasteful'] = DataTable.userWastefulItems;
        }


        // find latest tag
        var keyAlready = Object.keys(DataTable.tagNameDataId)
        var keyNew = Object.keys(tagDict);

        DataTable.latestTag = Util.arrayDiff(keyAlready, keyNew);

        if (DataTable.latestTag.length == 0) {
            DataTable.latestTag.push(DataTable.tempLatestTag)
        }

        DataTable.tagNameDataId = tagDict;
    }



    DataTable.makeTags = function (containerId = "") {
        if (containerId == "") containerId = "tableHeadDivTrain"
        $(".tagContainer").remove();

        $("#" + containerId).css('display', 'flex')
        $("#" + containerId).css('align-items', 'center')
        var listOfTagDict = {
            'critical-items': true,
            'ignore': true,
            'similar': true,
            'same-label': true,
            'different': true,
        }

        // listOfTagDict = DataTable.getTagNames();
        // DataTable.createFakeTagIdData(listOfTagDict);
        DataTable.getTagRealData()
        var htmlStr = "<div class ='tagContainer' >"
        // for (var item in listOfTagDict) {
        for (var item in DataTable.tagNameDataId) {
            var tagName = item;
            htmlStr += "<div class ='tagHead' id = 'tagHead_" + tagName + " ' parent = " + tagName + " > " + tagName + " </div>"
        }
        htmlStr += "</div>"
        $("#" + containerId).append(htmlStr);

        //css stylings
        $(".tagContainer").css('display', 'flex')
        $(".tagContainer").css('width', 'auto')
        $(".tagContainer").css('height', '100%')
        $(".tagContainer").css('padding', '5px')
        $(".tagContainer").css('align-items', 'center')

        $(".tagHead").css('display', 'flex')
        $(".tagHead").css('width', 'auto')
        $(".tagHead").css('height', '20px')
        $(".tagHead").css('padding', '3px')
        $(".tagHead").css('margin-right', '5px')
        $(".tagHead").css('border-radius', '5px')
        $(".tagHead").css('background', Main.colors.HIGHLIGHT2)
        $(".tagHead").css('color', 'white')
        $(".tagHead").css('font-size', '0.9em')
        $(".tagHead").css('cursor', 'pointer')
        $(".tagHead").css('align-items', 'center')

        $(".tagHead").on('mouseover', function (d) {
            if (DataTable.tagClicked) return
            if (ParC.parallelBrushed) return
            $(this).css('border', '1px solid black')
            $(".tagHead").css('background', 'lightgray')
            $(this).css('background', Main.colors.HIGHLIGHT2)

            var elem = $(this).attr('parent')
            var idList = DataTable.tagNameDataId[elem]
            $("#dataViewAppTable_tableContent").find('tr').show();

            // console.log(' found is ', elem, idList, DataTable.tagNameDataId)
            DataTable.hideRowsById(idList, 'train')
        })

        $(".tagHead").on('mouseout', function (d) {
            if (DataTable.tagClicked) return
            if (ParC.parallelBrushed) return

            $(this).css('border', 'transparent')
            $(".tagHead").css('background', Main.colors.HIGHLIGHT2)
            //train table
            $("#dataViewAppTable_tableContent").find('tr').show();
        })

        $(".tagHead").on('click', function (d) {
            if (ParC.parallelBrushed) return

            var elem = $(this).attr('parent');

            if (DataTable.tagClickName == elem) {
                DataTable.tagClicked = false;
                DataTable.tagClickName = ""
            } else {
                DataTable.tagClicked = true;
                DataTable.tagClickName = elem;

            }
            if (DataTable.tagClicked) {
                $(".tagHead").css('border', 'transparent')
                $(this).css('border', '1px solid black')
                $(".tagHead").css('background', 'lightgray')
                $(this).css('background', Main.colors.HIGHLIGHT2)

                var idList = DataTable.tagNameDataId[elem]
                console.log(' found is ', elem, idList, DataTable.tagNameDataId);
                $("#dataViewAppTable_tableContent").find('tr').show();
                DataTable.hideRowsById(idList, 'train')
            } else {
                $(".tagHead").css('border', 'transparent')
                $(".tagHead").css('background', Main.colors.HIGHLIGHT2)
                //train table
                $("#dataViewAppTable_tableContent").find('tr').show();
            }
        })

        StarM.addConstraintsTable();
        setTimeout(() => {
            Rul.makeRuleList();
        }, 400);
    }

}());