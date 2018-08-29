(function() {
  DataTable = {};
  DataTable.pickedAttrDict = {};
  DataTable.viewFullTable = true;
  DataTable.ratioSelect = 0.15;


  //new variabbles
  DataTable.selectedRows = {}

  DataTable.modelUpdateLabel = function() {
    var predTrainDict = BarM.modelData[0]['predictions']['trainPred'];
    for (var item in predTrainDict) {
      var label = predTrainDict[item];
      $('.td_id_' + item).parent().find('.td_' + Main.predictedName).text(label);
    }
  }

  DataTable.userUpdateLabel = function() {
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


  DataTable.updateHeader = function() {
    if (DataTable.viewFullTable) {
      $('.dataTableHeadText').text(Main.trainData.length + ' rows')
      DataTable.makeTable(Main.trainData);
    } else {
      // $('.dataTableHeadText').text(' Added : ' + Main.currentData.length + ' rows  | Left : ' + Main.leftData.length + ' rows ')
      $('.dataTableHeadText').text(' Current Data Length : ' + Main.currentData.length)
      DataTable.makeTable(Main.leftData);
    }
  }


  DataTable.updateOnlyHeader = function(dataGiven) {
    // $('.dataTableHeadText').text(dataGiven.length + ' rows');
    $('.dataTableHeadText').text(' Current Data Length : ' + Main.currentData.length)
  }


  DataTable.switchToLeftData = function() {
    DataTable.viewFullTable = false;
    $('#tableContent').css('background', Main.colors.HIGHLIGHT);
    $('.dataTableHeadText').text(' Current Data Length : ' + Main.trainData.length)
  }





  DataTable.addIconsTop = function(dataIn = Main.trainData, containerId = "") {

    if (containerId == "") {
      containerId = "tableSelectors";
    }
    $("#tableSelectors").empty();
    $("#tableSelectors").css('display', 'flex');

    // var htmlStr = "<div id='clusterControlDiv'></div>";
    // $("#" + containerId).append(htmlStr);


    // htmlStr = "<div class='iconHolder' id='addAllData' onclick='' title='Add all data'>"
    // htmlStr += "<img class='imgIcon' src='static/img/icons/loadData.png'></div>"
    htmlStr = "<div class='iconHolder' id='addLabelCard' onclick='' title='Add Label Card'>"
    htmlStr += "<img class='imgIcon' src='static/img/icons/add.png'></div>"
    // htmlStr += "<button id='dataToggleBtn'> </button>";
    htmlStr += "<div class = 'dataTableHeadText'>" + dataIn.length + " rows </div>";


    $("#" + containerId).append(htmlStr);

    $('.dataTableHeadText').css('display', 'flex');
    $('.dataTableHeadText').css('flex-direction', 'row-reverse');
    $('.dataTableHeadText').css('width', '100%');
    $('.dataTableHeadText').css('padding', '5px');
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



    $('#addLabelCard').on('click', function() {
      // Object.keys( DataTable.selectedRows).forEach(key =>  DataTable.selectedRows[key] === undefined ? delete  DataTable.selectedRows[key] : '');
      // Object.keys(DataTable.selectedRows).forEach(key => {
      //   if (typeof key == 'undefined') {
      //     delete DataTable.selectedRows[key];
      //   }
      // });
      var objSend = {
        data: Main.trainData,
        selectedRowIds: DataTable.selectedRows
      };

      socket.emit("find_similarData", objSend);
      socket.off('find_similarData');
      socket.removeAllListeners('similarData_return');
      socket.on("similarData_return", function(dataObj) {
        console.log('similar data returned ', dataObj);
        LabelCard.computeReturnData = dataObj;
        LabelCard.getDataObject(dataObj['indexBydata']);
        LabelCard.makeCards();
      })

    })





  }

  DataTable.dragFunction = function() {
    console.log('adding drag function')
    // $(".dataViewAppTable tr").draggable({
    $("tr").draggable({
      helper: "clone",
      start: function() {
        // console.log(' starting drag ')
        $(this).css('border-bottom', '5px solid black')
      },
      drag: function() {
        // console.log('dragging now ', this)
      },
      stop: function(e) {
        var id = $(this).attr('id');
        var idNum = Util.getNumberFromText(id);
        console.log('stopped drag now ', id, idNum, e);
        $(this).css('border-bottom', 'transparent')
        // DataTable.filterById(idNum);
      }
    });

    //add droppable
    $(".ui-droppable.tableContent").droppable({
      activate: function(event, ui) {
        console.log("droppable activate")
      },
      // tolerance: "intersect",
      // accept: "tr",
      // activeClass: "ui-state-default",
      // hoverClass: "ui-state-hover",
      drop: function(event, ui) {
        $(this).addClass("ui-state-highlight")
        $(this).append($(ui.draggable));
        console.log("dropped item ", event, this, ui)
      }
    });


  }

  DataTable.filterById = function(idGiven) {
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
      data = data.filter(function(d) {
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


  DataTable.computeLeftData = function() {
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

  DataTable.filterTableByCluster = function(item) {
    var data = Util.deepCopyData(Main.currentData);
    // data.forEach(function(d){

    // })
    data = data.filter(function(d) {
      // console.log('got d is ', d, d.cluster)
      return d.cluster == item;
    })

    console.log('data length table  ', data.length, item)
    DataTable.makeTable(data);
    DataTable.updateOnlyHeader(data);
    $('#tableContent').css('background', 'white');
  }


  DataTable.makeTable = function(dataGiven = main.appData, containerId = "tableContent") {
    $("#dataViewAppTable_" + containerId).remove();

    var color_scale = d3.scale.linear().domain([0, 1]).range(['beige', 'green']);

    var data = Util.deepCopyData(dataGiven);

    // console.log(" drawing test data table ... ", dataGiven);
    data.forEach(function(d, i) {
      delete d.cluster;
    }); // end of data for each
    // main.testData = data.slice();

    var sortAscending = true;
    var table = d3
      .select("#" + containerId)
      .insert("table", ":first-child")
      .attr("id", "dataViewAppTable_" + containerId)
      .attr("class", "dataViewAppTable")
      .attr("height", "100%")
      .attr("width", "100%");
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
      .text(function(d) {
        return d;
      })
      .on("click", function(d) {
        headers.attr("class", "header");

        if (sortAscending) {
          rows.sort(function(a, b) {
            if (b[d] < a[d]) return 1
            else return -1
          });
          sortAscending = false;
          this.className = "aes";
        } else {
          rows.sort(function(a, b) {
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
      .attr('class', function(d, i) {
        return 'trTable trCl_' + i
      })
      .attr('id', function(d) {
        return 'tr_' + d.id;
      })
      .style('background', function(d) {
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
      .on('mouseover', function(d) {
        try {
          DataTable.nodeColor = d3.selectAll(".node_" + d.id).style("fill");
          d3.selectAll(".node_" + d.id).style("fill", "black");
        } catch (err) {

        }

      })
      .on('mouseout', function(d) {
        try {
          d3.selectAll(".node_" + d.id).style("fill", DataTable.nodeColor);
        } catch (err) {

        }

      })
    rows
      .selectAll("td")
      .data(function(d) {
        return titles.map(function(k) {
          return {
            value: d[k],
            name: k
          };
        });
      })
      .enter()
      .append("td")
      .attr("data-th", function(d) {
        return d.name;
      })
      .attr("data-id", function(d) {
        return d.id;
      })
      .attr('class', function(d) {
        return 'td_' + d.value + ' td_' + d.name + ' td_' + d.name + '_' + d.value;
      })
      .text(function(d) {
        return d.value;
      })
      .on('click', function(d) {
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


    $("#dataViewAppTable_" + containerId + " tr").on('click', function(d) {
      var back = $(this).css('background-color');
      // console.log("clicked tabel tr ", $(this), d, back);
      var idNum = Util.getNumberFromText($(this).attr('id'));
      if(typeof idNum == 'undefined') return;
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
