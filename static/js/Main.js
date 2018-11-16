(function () {


    Main = {}
    // window.socket = io.connect("http://" + document.domain + ":" + location.port);
    window.socket = io.connect('');

    Main.currentData = [];
    Main.currentTempStoreData = [];
    Main.leftData = [];
    Main.trainData = [];
    Main.trainDataCopy = [];
    Main.trainTarget = [];
    Main.testData = [];
    Main.testTarget = [];
    Main.attrDict = {};
    Main.numericalAttributes = {};
    Main.targetName = 'target_variable';
    Main.predictedName = 'predicted'
    Main.appData = [];
    Main.outerData = [];
    Main.entityName = '';
    Main.entityNameSecondImp = '';
    Main.tooltipDictArr = [];

    Main.tabelViewMode = true;




    /*
    stores system colors
    */

    Main.colors = {
        HIGHLIGHT: "#C23573",
        HIGHLIGHT2: "#35B7C2",
        LIGHTGRAY: "lightgray",
        BLACK: 'black',
        POS_COL: 'red',
        NEG_COL: 'blue',
        DARK_BWN : '#A19393',
        LIGHT_BWN : '#EFE2E2'
    }

    /*
    stores system variables
    */
    Main.commonVars = {
        DEBUG: true,
    }


    Main.init = function (tag = false) {
        $(document).ready(function () {
            console.log("loading data");
            if (!Main.commonVars.DEBUG) {
                // console.log = function () {};
            }
            $("#sidePanel").css("width", "25px");
            $("#viewPanel").css("width", "100%");
            var dataSrc = "static/data/car_full2.csv";
            // var dataSrc = "static/data/movies_200.csv";
            // var dataSrc = "static/data/movie_metadata_200.csv";
            // var dataSrc = "static/data/BreastCancerDataSet.csv";

            if (tag) Main.sendData(Main.outerData);
            else Main.loadData(dataSrc);

        });

    }

    Main.getDataByKeys = function(keys= [],data=[]){
        var dataOut = [];
        data.forEach(function(d){
            var obj ={}
            for (var item in d){
                if(keys.indexOf(item) != -1){
                    obj[item] = d[item]
                }
            }
            dataOut.push(obj)
        })
        return dataOut;
    }


    Main.getDataById = function (id = 0, data = Main.trainData) {
        for (var i = 0; i < data.length; i++) {
            if (data[i].id == id)
                return data[i];
        }
        return null;
    }

    Main.getDataIndexById = function (id = 0, data = Main.trainData) {
        for (var i = 0; i < data.length; i++) {
            if (data[i].id == id)
                return i
        }
        return -1;
    }

    Main.resetViewsAndData = function () {
        $("#clusterDivSvg").empty();
        $("#globalPanel").empty();
        $("#gridDataPanel").empty();
        $("#tableSelectors").empty();
        $("#tableContent").empty();
        $("#featurePanel").empty();

        $('.modelTooltip').remove();

        //data
        Main.entityName = '';
        Main.entityNameSecondImp = '';
        Main.tooltipDictArr = [];
        Main.attrDict = {};
    }


    Main.sendData = function (dataset) {
        console.log('loaded outer data sending ', Main.outerData)
        var objSend = {
            data: dataset,
            targetName: Main.targetName
        }

            socket.emit("data_preprocess", objSend);

            socket.on("data_return_preprocess", function (dataGet) {
                console.log("received data after pre process ", dataGet);
                Main.trainData = dataGet[0];
                Main.trainDataCopy = Util.deepCopyData(Main.trainData)
                Main.leftData = Util.deepCopyData(Main.trainData)
                // Main.currentData = Util.deepCopyData(Main.trainData)
                Main.currentData = []; //Util.deepCopyData(Main.trainData)

                // Main.trainTarget = dataGet[1];
                Main.testData = dataGet[1];
                // Main.testTarget = dataGet[3];
                Main.appData = dataGet[2];


                // GridData.deletedNodesData = Util.deepCopyData(Main.trainData);

                Main.processAttrData(Main.trainData);
                Main.taskScheduler();
            });
    }



    Main.loadData = function (fileName) {
        console.log("starting sload data ");
        d3.csv(fileName, function (dataset) {
            console.log("data loaded ", dataset);
            var objSend = {
                data: dataset,
                targetName: Main.targetName
            }
            socket.emit("data_preprocess", objSend);
            socket.on("data_return_preprocess", function (dataGet) {
                console.log("received data after pre process ", dataGet);
                Main.trainData = dataGet[0];
                Main.trainDataCopy = Util.deepCopyData(Main.trainData);
                Main.leftData = Util.deepCopyData(Main.trainData);
                // Main.currentData = Util.deepCopyData(Main.trainData)
                Main.currentData = []; //Util.deepCopyData(Main.trainData)

                // Main.trainTarget = dataGet[1];
                Main.testData = dataGet[1];
                // Main.testTarget = dataGet[3];
                Main.appData = dataGet[2];


                // GridData.deletedNodesData = Util.deepCopyData(Main.trainData);
                // console.log(' now test data ', Main.testData.length, dataGet[2].length)
                Main.processAttrData(Main.trainData);
                Main.taskScheduler();
            });

        });

    }

    /*
    ideally should only run once, when the system loads
    */
    Main.taskScheduler = function () {
        DataTable.addIconsTop(Main.trainData);
        DataTable.switchToLeftData();
        DataTable.makeTable(Main.trainData);
        DataTable.extraContent = false;
        DataTable.makeTable(Main.testData, "tableContentTest");
        Scat.makeTheMatrix();
        Scat.hideScatterView();

        Cons.makeConsDivs();
        BarM.makeStackedModelBars();

        ConsInt.getActiveConstraints();
    }

    Main.addLabels = function(data = Main.trainData){
        var labels = ['sports', 'economical', 'utility']
        data.forEach(function(d,i){
            var ind = Util.getRandomNumberBetween(1,0)*3;
            ind = Math.ceil(ind-1)
            
            d[Main.targetName] = labels[ind];
        })
        var dataOut = data;
        return dataOut;
    }


    Main.makeLabelIds = function(data){
        Main.storedData = {}
        data.forEach(function(d,i){
            var target =  d[Main.targetName]
            if(typeof Main.storedData[target] == 'undefined'){
                Main.storedData[target] = {
                    'data' : [d['id']],
                    'mainRow': d['id'],
                    'label' : target
                }
            }else{
                Main.storedData[target]['data'].push(d['id'])
            }
        })
    }


    Main.processAttrData = function (data) {

        data = Main.addLabels(data);
        var title = Object.keys(data[0]);
        // console.log("title found ", title)
        for (var i = 0; i < title.length; i++) {
            var toolKeys = Main.tooltipDictArr.length;
            Main.attrDict[title[i]] = {};
            var type = 'quantitative';
            // console.log(" type is ", typeof parseInt(data[0][title[i]]), parseInt(data[0][title[i]]));
            if (isNaN(parseInt(data[0][title[i]]))) {
                type = "categorical";
                if (Main.entityName == '') {
                    Main.entityName = title[i];
                } else {
                    if (Main.entityNameSecondImp == '') {
                        Main.entityNameSecondImp = title[i];
                    }
                }
            }else{
              if(title[i] != 'id' && title[i] != 'cluster'){
                Main.numericalAttributes[title[i]] = true;
              }
            }
            Main.attrDict[title[i]]['type'] = type;
            if (toolKeys < 5 && title[i] != Main.entityName) Main.tooltipDictArr.push(title[i]);

            var attrList = [];
            data.forEach(function (d) {
                attrList.push(+d[title[i]])
                // d[Main.targetName] = -1;
                d[Main.predictedName] = 'NA';
            })

            var attrUniq = Util.getUniqueArray(attrList);
            attrUniq.sort(function (a, b) {
                return a - b;
            });
            Main.attrDict[title[i]]["uniqueVals"] = attrUniq;
            Main.attrDict[title[i]]["range"] = [attrUniq[0], attrUniq[attrUniq.length - 1]];
        }

        Main.trainData.forEach(function(d){
          var temp = d[Main.entityName];
          var temp2 = d[Main.entityNameSecondImp];
          delete d[Main.entityName];
          delete d[Main.entityNameSecondImp];

          d["0_"+Main.entityName] = temp;
          d["0_"+Main.entityNameSecondImp] = temp2;
        })
        Main.entityName = "0_"+Main.entityName;
        Main.entityNameSecondImp = "0_"+Main.entityNameSecondImp;
        Main.leftData = Main.trainData;
        Main.makeLabelIds(Main.trainData);
        console.log(' train test and left data ', Main.trainData.length, Main.testData.length, Main.leftData.length)

        setTimeout(() => {
        //  Util.writeCSV(Main.trainData)            
        }, 3000);
    }

    /*
prints the system state variabbles
*/
    Main.printLogs = function () {
        console.log("MAIN object ", Main);
        console.log(' saving data ', Main.trainData)
        Util.writeCSV(Main.trainData)
    }



})();
