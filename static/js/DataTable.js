(function () {
    DataTable = {};
    DataTable.pickedAttrDict = {};
    DataTable.viewFullTable = true;
    DataTable.ratioSelect = 0.15;
    DataTable.extraContent = false;
    DataTable.showingFilterPanel = false;


    //new variabbles
    DataTable.selectedRows = {}

    DataTable.modelUpdateLabel = function () {
        var predTrainDict = BarM.modelData[0]['predictions']['trainPred'];
        for (var item in predTrainDict) {
            console.log('updating data table ', item)
            var label = predTrainDict[item];
            var col = 'lightgray'
            var existingLabel = $('#tr_' + item).find('.td_0_' + Main.targetName).text();
            if(existingLabel != label) col = 'orange'
            // $('.td_id_' + item).parent().find('.td_0_' + Main.predictedName).text(label);
            $('#tr_' + item).find('.td_0_' + Main.predictedName).text(label);
            $('#tr_' + item).find('.td_0_' + Main.predictedName).css('border', '1px solid gray')
            $('#tr_' + item).find('.td_0_' + Main.predictedName).css('background', col)
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
            $('.dataTableHeadText').text(Main.trainData.length + ' rows')
            DataTable.makeTable(Main.trainData);
        } else {
            // $('.dataTableHeadText').text(' Added : ' + Main.currentData.length + ' rows  | Left : ' + Main.leftData.length + ' rows ')
            $('.dataTableHeadText').text(' Current Data Length : ' + Main.currentData.length)
            DataTable.makeTable(Main.leftData);
        }
    }


    DataTable.updateOnlyHeader = function (dataGiven) {
        // $('.dataTableHeadText').text(dataGiven.length + ' rows');
        $('.dataTableHeadText').text(' Current Data Length : ' + Main.currentData.length)
    }


    DataTable.switchToLeftData = function () {
        DataTable.viewFullTable = false;
        $('#tableContent').css('background', Main.colors.HIGHLIGHT);
        $('.dataTableHeadText').text(' Current Data Length : ' + Main.trainData.length)
    }


    DataTable.showTableView = function () {
        Main.tabelViewMode = true;
        $("#tableContent").show();
        $("#scatContent").hide();
    }



    DataTable.addIconsTop = function (dataIn = Main.trainData, containerId = "") {

        if (containerId == "") {
            containerId = "tableSelectors";
        }
        $("#tableSelectors").empty();
        $("#tableSelectors").css('display', 'flex');

        // var htmlStr = "<div id='clusterControlDiv'></div>";
        // $("#" + containerId).append(htmlStr);


        // htmlStr = "<div class='iconHolder' id='addAllData' onclick='' title='Add all data'>"
        // htmlStr += "<img class='imgIcon' src='static/img/icons/loadData.png'></div>"
        htmlStr = "<div class='iconHolder' id='tableViewC' onclick='' title='Show Table View'>"
        htmlStr += "<img class='imgIcon' src='static/img/icons/table_view.png'></div>"

        htmlStr += "<div class='iconHolder' id='correlViewC' onclick='' title='Show Correlation View'>"
        htmlStr += "<img class='imgIcon' src='static/img/icons/parallel.png'></div>"

        // htmlStr += "<button id='dataToggleBtn'> </button>";
        htmlStr += "<div class = 'dataTableHeadText'>" + dataIn.length + " rows </div>";
        // htmlStr += "<div class='iconHolder' id='addLabelCard' onclick='' title='Add Label Card'>"
        // htmlStr += "<img class='imgIcon' src='static/img/icons/add.png'></div>"

            htmlStr += "<button id='addConstraints' class='mdl-button mdl-js-button mdl-button--icon mdl-button--colored'>"
            htmlStr += "<i class='material-icons'>chat</i></button>";
        htmlStr += "<button id='bakeModels' class='mdl-button mdl-js-button mdl-button--icon mdl-button--colored'>"
        htmlStr += "<i class='material-icons'>dashboard</i></button>";


        // htmlStr += "<button id='addConstraints' class='mdl-button mdl-js-button mdl-button--icon mdl-button--colored'>"
        // htmlStr += "<i class='material-icons'>chat</i></button>";



        $("#" + containerId).append(htmlStr);

        $('.dataTableHeadText').css('display', 'flex');
        $('.dataTableHeadText').css('flex-direction', 'row-reverse');
        $('.dataTableHeadText').css('width', '100%');
        $('.dataTableHeadText').css('padding', '5px');
        $('.dataTableHeadText').css('align-self', 'center');
        // $('.dataTableHeadText').css('display' , )

        // $('#dataToggleBtn').button({
        //     icon: "ui-icon-gear",
        //     showLabel: false
        // })
        //
        // $('#dataToggleBtn').click(function () {
        //     DataTable.viewFullTable = !DataTable.viewFullTable;
        //     DataTable.updateHeader();
        // })


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
        $('#bakeModels').on('click', function () {
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

            var objSend = {
                'train': Main.trainData,
                'targetCol': Main.targetName,
            }
            socket.emit("get_good_model", objSend);
            // socket.off('get_good_model');
            // socket.removeAllListeners('send_good_model');
            socket.on("send_good_model", function (dataObj) {
                console.log('good model recieved ', dataObj);
                BarM.modelData[0] = Object.assign({}, dataObj);
                DataTable.modelUpdateLabel();
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

    DataTable.makeFilterVisTable = function (attr, el) {
        console.log('attr ', attr)
        if (attr == Main.entityName || attr == Main.entityNameSecondImp) return;
        try {
            if (Main.attrDict[attr]['type'] == 'categorical') return;
        } catch (e) {
            return;
        }
        var data = [];
        Main.trainData.forEach(function (d, i) {
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

        w = 200;
        h = 100;
        console.log('data ffound ', attr, data, id, w, h);
        // BarM.makeFeatureLabelsVerBar(id,w,h,data)
        BarM.makeHistoFilterTable(id, w, h, data, attr)

    }

    DataTable.addExtraItemsTables = function (containerId = "", data) {
        var table = d3.select('#dataViewAppTable_' + containerId)
        // var titles = d3.keys(data[0]);
        var titles = table.selectAll('th').data();
        // console.log(' data head is ', titles)

        table.selectAll('td')
            .attr('width', '125px')
        $('#tableContent').css('display', 'block')

        // to add filter panel
        table.selectAll('tbody')
            .insert("tr", ":first-child")
            .attr('id', 'filter_tr')
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
                return 'filter_td_' + d.name
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
                DataTable.makeFilterVisTable(d.name, $(this))
                return '';
            })



        table.selectAll('tr')
            .insert("td", ":first-child")
            .attr('id', 'critical_')
            // .style('background', 'white')
            .style('display', function (d, i) {
                if (i != 0) return 'flex'
            })
            .style('flex-direction', 'row')
            .style('width', '150px')
            .html(function (d, i) {
                // console.log(' d and i is ', d, i)
                if (i < 2) {
                    var col = $(this).siblings().attr('background');
                    if (i == 0) col = "#333"
                    if (i == 1) col = ""
                    $(this).css('background', col);
                    return ""
                } else {
                    var htmlStr = "<div class='switch switch_critical' id = 'switch_critical_" + d.id + "'><label>";
                    htmlStr += "<input type='checkbox' id = 'check_critical_" + d.id + "'><span class='lever'></span></label></div>"
                    htmlStr += "<label><input type='checkbox' class='filled-in check_discard' id = 'check_discard_" + d.id + "'/><span></span></label>"
                    return htmlStr;
                }
            })




        //toggle switches input controls-----------------------------------------------------------------------------------------
        $(".switch_critical").on('input', function (e) {
            var id = $(this).attr('id');
            var idNum = Util.getNumberFromText(id);
            console.log('e is ', e, idNum);
            var stri = 'Critical-Items'
            Cons.typeConstraints['PREDICTIVE'][stri]['Checked'] = !Cons.typeConstraints['PREDICTIVE'][stri]['Checked'];
            ConsInt.getActiveConstraints();
            console.log('active cons ', ConsInt.activeConstraints)
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
        // $(".ui-corner-all").css('background', 'transparent')
        // $(".ui-corner-all").css('border', 'none')


        // add filter data button
        var sel = $("#filter_tr").find('td').first();
        var htmlStr = "<button id='toggleFilterTableBtn' class='mdl-button mdl-js-button mdl-button--icon mdl-button--colored'>"
        htmlStr += "<i class='material-icons'>filter_tilt_shift</i></button>";
        sel.append(htmlStr);


        $("#toggleFilterTableBtn").on('click', function (e) {
            if ($(".filterPanelDiv").length > 0) {
                DataTable.showFilterPanel();
            } else {

                DataTable.addFilterPanel(100, 200, 500, 200);
            }

        })


    } // end of add extra


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

    DataTable.hideSelectedRows = function (arrIds = []) {
        $(".trTable").hide();
        for (var item in arrIds) {
            $("#tr_" + item).show();
            // $(".trTable").css('opacity', 1);

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

        // console.log(" drawing test data table ... ", dataGiven);
        data.forEach(function (d, i) {
            delete d.cluster;
            d['0_' + Main.targetName] = d[Main.targetName]
            d['0_' + Main.predictedName] = d[Main.predictedName]
            delete d[Main.targetName];
            delete d[Main.predictedName];
        }); // end of data for each
        // main.testData = data.slice();

        var sortAscending = true;
        var table = d3
            .select("#" + containerId)
            .insert("table", ":first-child")
            .attr("id", "dataViewAppTable_" + containerId)
            .attr("class", "dataViewAppTable")
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
            .text(function (d) {
                return d;
            })
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
                            DataTable.tempCol = $("#histoBars_" + item).css('fill');
                            DataTable.tempItem = item;
                            $("#histoBars_" + item).css('fill', Main.colors.HIGHLIGHT);
                            return
                        }
                    }
                }
            })
            .on('mouseout', function (d) {
                $(this).css('background', DataTable.tdOrigColor);
                $("#histoBars_" + DataTable.tempItem).css('fill', DataTable.tempCol);



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
                if (typeof ConP.selectedRowsCons[idNum] == 'undefined') {
                    $(this).css('background', Main.colors.HIGHLIGHT2);
                    DataTable.fontColor = $(this).css('color');
                    $(this).css('color', 'white');
                    ConP.selectedRowsCons[idNum] = true;
                } else {
                    $(this).css('background', "rgb(255,255,255)");
                    console.log("removing colors")
                    delete ConP.selectedRowsCons[idNum];
                    $(this).css('color', DataTable.fontColor);
                }
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
            DataTable.addExtraItemsTables(containerId, data);
            DataTable.extraContent = true;
        }

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

}());