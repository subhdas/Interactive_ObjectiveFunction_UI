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

    // Main.labels = ['sports', 'economical', 'utility'];
    Main.labels = ['economical', 'sports', 'utility'];
    Main.contentHeightTopBar = '300';
    Main.contentWidthTopBar = '700';

    Main.rightPanelBothShow = true
    Main.LABELMODE = true
    Main.dataSet = ''

    //employee salaries





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
        DARK_BWN: '#A19393',
        LIGHT_BWN: '#EFE2E2'
    }

    /*
    stores system variables
    */
    Main.commonVars = {
        DEBUG: false,
    }

    Main.datasetSelector = function () {
        // var dataSel = 1; // car
        // var dataSel = 2; // creditcard
        var dataSel = 3; // salary
        // var dataSel = 4; // movie
        // var dataSel = 5; // diabetes


        if (dataSel == 1) {
            Main.labels = ['economical', 'sports', 'utility']; // for CARS DATA labels          
            Main.dataset = 'cars'
            return "static/data/scenario/car_full2.csv";
        } else if (dataSel == 2) {
            Main.labels = ['default no', 'default yes']; // for credit card default
            Main.dataset = 'credit_card'
            return "static/data/scenario/def_credit_card_short1.csv";
        } else if (dataSel == 3) {
            Main.labels = ['admin_fin', 'cult_rec', 'health', 'pub_serv', 'welfare_city']; // for SALARY DATA default
            Main.dataset = 'salary'
            return "static/data/scenario/Employee_Compensation_SF_SUB_short1.csv";
        } else if (dataSel == 4) {
            // Main.labels = ['low', 'med', 'high']; // for MOVIE DATA default
            Main.labels = ['high', 'med', 'low']; // for MOVIE DATA default
            Main.labels = ['high', 'low', 'med']; // for MOVIE DATA default
            // Main.labels = ['med', 'low', 'high']; // for MOVIE DATA default
            Main.dataset = 'movie'
            return "static/data/scenario/movie_metadata_short_SUB.csv";
        } else if (dataSel == 5) {

            Main.labels = ['<30', '>30', 'NO']; // for DIABETES DATA default = WORKED
            // Main.labels = ['>30', '<30', 'NO']; // for DIABETES DATA default
            Main.dataset = 'diabetis'
            return "static/data/scenario/diabetic_data_short_SUB.csv";

        }


    }


    Main.init = function (tag = false) {
        $(document).ready(function () {
            console.log("loading data");
            if (!Main.commonVars.DEBUG) {
                console.log = function () {};
            }
            $("#sidePanel").css("width", "25px");
            $("#viewPanel").css("width", "100%");
            Main.LABELMODE = false; // for car data make it true
            // Main.labels = ['economical', 'sports', 'utility']; // for CARS DATA labels
            // Main.labels = ['default no', 'default yes']; // for credit card default
            // Main.labels = ['admin_fin', 'cult_rec', 'health', 'pub_serv', 'welfare_city']; // for SALARY DATA default
            // Main.labels = ['low', 'med', 'high']; // for MOVIE DATA default

            // var dataSrc = "static/data/car_full2.csv";
            // var dataSrc = "static/data/def_credit_card_short1.csv";
            // // var dataSrc = "static/data/Employee_Compensation_SF_SUB_short1.csv";
            // // var dataSrc = "static/data/movie_metadata_short_SUB.csv";
            // // 
            // // var dataSrc = "static/data/movies_200.csv";
            // // var dataSrc = "static/data/movie_metadata_200.csv";
            // // var dataSrc = "static/data/BreastCancerDataSet.csv";

            var dataSrc = Main.datasetSelector();
            if (tag) Main.sendData(Main.outerData);
            else Main.loadData(dataSrc);

        });

    }

    Main.getDataByEntityName = function (entityName, entity, data = []) {
        for (var i = 0; i < data.length; i++) {
            if (data[i][entityName] == entity)
                return data[i];
        }
        return null;
    }

    Main.getDataByKeys = function (keys = [], data = []) {
        var dataOut = [];
        data.forEach(function (d) {
            var obj = {}
            for (var item in d) {
                if (keys.indexOf(item) != -1) {
                    obj[item] = d[item]
                }
            }
            dataOut.push(obj)
        })
        return dataOut;
    }

    Main.getDataByFeatValCat = function (feat = '', featVal = '', data = Main.trainData) {
        var idList = []

        data.forEach(function (d) {
            //  for (var item in d) {
            if (typeof d[feat] == 'undefined') {
                if (d['0_' + feat] == featVal) {
                    idList.push(d.id)
                }
            } else {
                if (d[feat] == featVal) {
                    idList.push(d.id)
                }
            }

            //  }
        })
        return idList;
    }

    Main.getDataByFeatValQuant = function (feat = '', featVal = '', tag = true, data = Main.trainData) {
        var idList = []
        data.forEach(function (d) {
            if (tag == false) {
                if (typeof d[feat] == 'undefined') {
                    if (+d['0_' + feat] <= +featVal) {
                        idList.push(d.id)
                    }
                } else {
                    if (+d[feat] <= +featVal) {
                        idList.push(d.id)
                    }
                }
            } else {
                  if (typeof d[feat] == 'undefined') {
                      if (+d['0_' + feat] >= +featVal) {
                          idList.push(d.id)
                      }
                  } else {
                      if (+d[feat] >= +featVal) {
                          idList.push(d.id)
                      }
                  }

            }

        })
        return idList;
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

            Main.processAttrData(Main.trainData, Main.testData);
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
                Main.processAttrData(Main.trainData, Main.testData);
                Main.taskScheduler();
            });

        });

    }

    Main.makeTablePanelsAccord = function () {
        setTimeout(() => {
            $("#trainContent").accordion({
                collapsible: true,
                heightStyle: "content",
                active: false,
            });

            $("#testContent").accordion({
                collapsible: true,
                heightStyle: "content",
                active: false,
            });
        }, 100);

    }


    Main.addLoadingWidget = function () {
        // src = http://tobiasahlin.com/spinkit/
        var htmlStr = "";
        htmlStr += "<div class ='wrapLoadingDiv'>"
        htmlStr += "<div class='spinner'>"
        htmlStr += "<div class='rect1'></div>"
        htmlStr += "<div class='rect2'></div>"
        htmlStr += "<div class='rect3'></div>"
        htmlStr += "<div class='rect4'></div>"
        htmlStr += "<div class='rect5'></div>"
        htmlStr += "</div>"
        htmlStr += "</div>"
        $('body').prepend(htmlStr);
        $('.wrapLoadingDiv').hide();
        Main.showSpinner = false;
    }


    Main.loadingSpinnerToggle = function (tog = true) {
        //pre conditioning 
        var containerId = "confMatTrain"; //"confMatTrain"
        var offs = $("#" + containerId).position()
        var wid = $("#" + containerId).width()
        var ht = $("#" + containerId).height()

        var topPos = offs.top - 5; //400
        var leftPos = offs.left //100


        console.log(' found top and left pos ', topPos, leftPos)

        $('.wrapLoadingDiv').css('display', 'flex')
        $('.wrapLoadingDiv').css('width', wid)
        $('.wrapLoadingDiv').css('height', ht)
        $('.wrapLoadingDiv').css('position', 'absolute')
        $('.wrapLoadingDiv').css('top', topPos + 'px')
        $('.wrapLoadingDiv').css('left', leftPos + 'px')
        $('.wrapLoadingDiv').css('z-index', 2000)
        $('.wrapLoadingDiv').css('background', 'white')
        //  $('.wrapLoadingDiv').css('border', '1px solid lightgray')
        $('.wrapLoadingDiv').css('align-items', 'center')
        $('.wrapLoadingDiv').css('justify-content', 'center')
        $('.wrapLoadingDiv').css('opacity', '0.75')
        Main.showSpinner = tog;
        if (Main.showSpinner) {
            $('.wrapLoadingDiv').show();
        } else {
            $('.wrapLoadingDiv').hide();
        }
    }

    /*
    ideally should only run once, when the system loads
    */
    Main.taskScheduler = function () {
        DataTable.addIconsTop(Main.trainData);
        DataTable.switchToLeftData();
        ParC.featureEditorCreate();
        DataTable.makeTable(Main.trainData);

        DataTable.extraContent = false;
        DataTable.makeTable(Main.testData, "tableContentTest");
        // Scat.makeTheMatrix(); // COMMENTED
        Scat.hideScatterView();

        Cons.makeConsDivs();

        ConsInt.getActiveConstraints();

        Main.tableTogglingApply();

        Main.addRightPanelIcon();
        Main.addLoadingWidget();
    }


    Main.addRightPanelIcon = function (containerId = "") {
        if (containerId == "") containerId = "rightPanelIconId"

        var htmlStr = ""
        htmlStr += "<button id='togRightPan' title='Show Table View' class='mdl-button mdl-js-button mdl-button--icon mdl-button--colored' title='Toggle Right Panel Content'>"
        htmlStr += "<i class='material-icons'>eject</i></button>";

        $('#' + containerId).append(htmlStr)

        $("#rightPanelIconId").css('display', 'flex')
        $("#rightPanelIconId").css('width', '100%')
        $("#rightPanelIconId").css('height', '30px')
        $("#rightPanelIconId").css('padding', '2px')
        $("#rightPanelIconId").css('margin', '2px')


        //add listerner
        $("#togRightPan").on('click', function (d) {
            Main.rightPanelBothShow = !Main.rightPanelBothShow;

            if (Main.rightPanelBothShow) {
                $("#confMatTrain").show();
                // $("#confMatTest").show();
            } else {
                $("#confMatTrain").hide();
                // $("#confMatTest").show();
            }
        })

    }

    Main.tableTogglingApply = function () {
        $('.tableTogglerCl').on('click', function (e) {
            var id = $(this).attr('id');
            id = Util.getNumberFromText(id);
            DataTable.toggleTableContentViews(id);
        })

    }

    Main.addLabels = function (dataIn = Main.trainData, num = 3) {
        var data = Util.deepCopyData(dataIn)
        data.forEach(function (d, i) {
            var ind = Util.getRandomNumberBetween(1, 0) * num; // 3
            ind = Math.ceil(ind - 1)
            d[Main.targetName] = Main.labels[ind];
        })
        var dataOut = Util.deepCopyData(data)
        console.log('dataoUt ', dataOut)
        return dataOut;
    }


    Main.addOrigLabels = function (dataIn = Main.trainData) {
        var data = Util.deepCopyData(dataIn)
        data.forEach(function (d, i) {
            var ind = +d[Main.targetName]
            d[Main.targetName] = Main.labels[ind];
            // console.log(' ind and data ', ind, d)
        })
        var dataOut = Util.deepCopyData(data)
        console.log('dataoUt ', dataOut)
        return dataOut;
    }






    Main.makeLabelIds = function (data) {
        Main.storedData = {}
        data.forEach(function (d, i) {
            var target = d[Main.targetName]
            if (typeof Main.storedData[target] == 'undefined') {
                Main.storedData[target] = {
                    'data': [d['id']],
                    'mainRow': d['id'],
                    'label': target
                }
            } else {
                Main.storedData[target]['data'].push(d['id'])
            }
        })
    }


    Main.processAttrData = function (data, dataTest) {

        if (Main.dataSet == 'cars') {
            var num = 3
            data = Main.addLabels(data, num); // only for car data set
            dataTest = Main.addLabels(dataTest, num) // only for car data set
        } else if (Main.dataset == 'diabetis') {} else {
            data = Main.addOrigLabels(data); // COMMENTED
            dataTest = Main.addOrigLabels(dataTest) // COMMENTED
        }
        // if (!Main.LABELMODE) {
        //     var num = 5
        //     // data = Main.addLabels(data, num); // only for car data set
        //     // dataTest = Main.addLabels(dataTest, num) // only for car data set

        //     data = Main.addOrigLabels(data); // only for car data set
        //     dataTest = Main.addOrigLabels(dataTest) // only for car data set
        // }

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

                if (Main.entityName == Main.targetName) Main.entityName = ''
                if (Main.entityNameSecondImp == Main.targetName) Main.entityNameSecondImp = ''
            } else {
                if (title[i] != 'id' && title[i] != 'cluster') {
                    Main.numericalAttributes[title[i]] = true;
                }
            }
            Main.attrDict[title[i]]['type'] = type;
            if (toolKeys < 5 && title[i] != Main.entityName) Main.tooltipDictArr.push(title[i]);

            var attrList = [];
            data.forEach(function (d) {
                var val = d[title[i]]
                if (typeof val == 'undefined') val = d[title[i]]
                attrList.push(val)
                // delete d[Main.predictedName]
                d[Main.predictedName] = 'NA';
            })

            dataTest.forEach(function (d) {
                // delete d[Main.predictedName]
                d[Main.predictedName] = 'NA';
            })

            var attrUniq = Util.getUniqueArray(attrList);
            attrUniq.sort(function (a, b) {
                return a - b;
            });
            Main.attrDict[title[i]]["uniqueVals"] = attrUniq;
            Main.attrDict[title[i]]["range"] = [attrUniq[0], attrUniq[attrUniq.length - 1]];
        }


        // console.log('main entity names ', Main.entityName, Main.entityNameSecondImp)

        data.forEach(function (d) {
            var temp = d[Main.entityName];
            var temp2 = d[Main.entityNameSecondImp];
            delete d[Main.entityName];
            delete d[Main.entityNameSecondImp];

            d["0_" + Main.entityName] = temp;
            d["0_" + Main.entityNameSecondImp] = temp2;
        })

        dataTest.forEach(function (d) {
            var temp = d[Main.entityName];
            var temp2 = d[Main.entityNameSecondImp];
            delete d[Main.entityName];
            delete d[Main.entityNameSecondImp];

            d["0_" + Main.entityName] = temp;
            d["0_" + Main.entityNameSecondImp] = temp2;
        })

        Main.trainData = data;
        Main.testData = dataTest
        // console.log(' data test is ', dataTest, Main.testData)


        Main.entityName = "0_" + Main.entityName;
        Main.entityNameSecondImp = "0_" + Main.entityNameSecondImp;
        Main.leftData = Main.trainData;
        Main.makeLabelIds(Main.trainData);
        // console.log(' train test and left data ', Main.trainData.length, Main.testData.length, Main.leftData.length)

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