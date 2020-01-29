(function () {

    sav = {}

    sav.setOfDataDownloads = function () {
        sav.downloadCurrrentTimeStepData(window.data);
        sav.downloadSelectiveCurrrentData(window.data);
        sav.downloadDataByTimeStep();
        sav.downloadFullDataRankClassOnly();
    }

    sav.jsonObj = function () {
        function download(content, fileName, contentType) {
            var a = document.createElement("a");
            var file = new Blob([content], {
                type: contentType
            });
            a.href = URL.createObjectURL(file);
            a.download = fileName;
            a.click();
        }
        download(JSON.stringify(BarM.histData), 'json_histdata.txt', 'text/plain');
    }

    sav.timeOperate = function () {
        function download(content, fileName, contentType) {
            var a = document.createElement("a");
            var file = new Blob([content], {
                type: contentType
            });
            a.href = URL.createObjectURL(file);
            a.download = fileName;
            a.click();
        }
        var timeObj = {}
        timeObj['begin'] = Main.beginTimeObj;
        timeObj['end'] = Main.endTimeObj;
        var start = Main.beginTimeObj['min'] * 60 + Main.beginTimeObj['sec']
        var end = Main.endTimeObj['min'] * 60 + Main.endTimeObj['sec']
        timeObj['timer'] = end - start
        download(JSON.stringify(timeObj), 'json_timer.txt', 'text/plain');
    }

    sav.histDataCsv = function () {
        let id = 0
        let csvContent = "data:text/csv;charset=utf-8,";
        var keys = ['iteration', 'model_id', 'testDataLoss', 'trainDataLoss', 'param_space', 'feature_imp', 'model_name',
            'test_acc', 'test_prec', 'test_recall'
        ]
        csvContent += keys.join(',') + "\r\n";

        var hist = BarM.histData;
        for (var item in hist) {
            var models = hist[item];
            for (var modObj in models) {
                if (modObj.length >= 2) continue
                let obj = models[modObj]
                console.log('modelobj ', modObj)
                var row = [];
                row.push(item);
                row.push(modObj);
                row.push(obj['lossTest'])
                row.push(obj['loss'])

                let parSpace = JSON.stringify(obj['parSpace'])
                parSpace = parSpace.replace("{", "")
                parSpace = parSpace.replace("}", "")
                parSpace = parSpace.replace(/,/g, " || ");
                row.push(parSpace)

                let featImp = JSON.stringify(obj['feat_imp_dict'])
                featImp = featImp.replace("{", "")
                featImp = featImp.replace("}", "")
                featImp = featImp.replace(/,/g, " || ");
                console.log('featImp is ', featImp, obj['feat_imp_dict'])
                row.push(featImp)

                row.push(obj['modelName'])
                row.push(obj['testMetrics']['acc'])
                row.push(obj['testMetrics']['f1'])
                row.push(obj['testMetrics']['prec'])
                csvContent += row.join(',') + "\r\n";
            }

        }
        sav.writeCSV(csvContent, "histModelData" + id + ".csv");
    }

    sav.constrData = function () {
        let id = 0
        let csvContent = "data:text/csv;charset=utf-8,";
        var keys = ['index', 'iteration', 'cons_name', 'cons_data_id', 'label']
        csvContent += keys.join(',') + "\r\n";
        var consData = ConsInt.activeConstraints;
        var ind = 0
        var hist = BarM.histData;

        for (var el in hist) {
            consData = hist[el]['consInter']
            for (var item in consData) {
                var row = [];
                var obj = consData[item];
                var inp = obj['input'];
                var inp = obj['input'];
                row.push(ind);
                row.push(el);
                row.push(item);
                ind += 1;
                if (Object.keys(inp).length > 0) {

                    var keyArr = inp[Object.keys(inp)[0]];
                    let keyArrStr = JSON.stringify(keyArr);
                    keyArrStr = keyArrStr.replace("[", "");
                    keyArrStr = keyArrStr.replace("]", "");
                    keyArrStr = keyArrStr.replace(/,/g, " || ");
                    row.push(keyArrStr);
                } else {
                    row.push('NA');
                }

                //adding label
                if (item == 'Same-Label' || item == 'Similarity-Metric') {
                    var labelName = Object.keys(inp)[0];
                    labelName = labelName.replace("labelitemsConId_", "")
                    row.push(labelName);
                } else {
                    row.push('NA');
                }
                csvContent += row.join(',') + "\r\n";
            }
        }


        sav.writeCSV(csvContent, "constInteraction" + id + ".csv");
    }

    sav.constrData1 = function () {
        let id = 0
        let csvContent = "data:text/csv;charset=utf-8,";
        var keys = ['index', 'cons_name', 'cons_data_id']
        csvContent += keys.join(',') + "\r\n";
        var consData = ConsInt.activeConstraints;
        var ind = 0
        var hist = BarM.histData;

        for (var item in consData) {
            var row = [];
            var obj = consData[item];
            var inp = obj['input'];
            var inp = obj['input'];
            row.push(ind);
            row.push(item);
            ind += 1;
            if (Object.keys(inp).length > 0) {
                var keyArr = inp[Object.keys(inp)[0]];
                let keyArrStr = JSON.stringify(keyArr);
                keyArrStr = keyArrStr.replace("[", "");
                keyArrStr = keyArrStr.replace("]", "");
                keyArrStr = keyArrStr.replace(/,/g, " || ");
                row.push(keyArrStr);
            } else {
                row.push('NA');
            }
            csvContent += row.join(',') + "\r\n";
        }
        sav.writeCSV(csvContent, "constInteraction" + id + ".csv");
    }


    sav.writeCSV = function (csvContent, fileName = "my_data_0" + ".csv") {
        var encodedUri = encodeURI(csvContent);
        var link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", fileName);
        link.style.visibility = 'hidden';
        link.innerHTML = "Click Here to download";
        document.body.appendChild(link);
        link.click();
    }

    // old function needs deletion
    sav.downloadFullDataRankClassOnly = function () {

        var nameDict = {};
        for (var i = 0; i < window.data.length; i++) {
            nameDict[window.data[i][mar.tooltipAttribute]] = window.data[i]['uniqueId'];

        }

        console.log('name dict is ', nameDict)

        let csvContent = "data:text/csv;charset=utf-8,";
        var keys = Object.keys(data[0]);

        var keys = ['uniqueId', mar.tooltipAttribute, 'isInteracted']
        for (var i = 0; i < window.dataOverTime.length; i++) {
            keys.push('rank_time_cur' + i);
            keys.push('class_time_cur' + i);
            keys.push('rank_time_' + i);
            keys.push('class_time_' + i);
        }

        csvContent += keys.join(',') + "\r\n";

        for (var item in nameDict) {

            var row = [];
            row.push(nameDict[item])
            row.push(item)
            if (window.classifCanvasSelectedIds.indexOf(nameDict[item]) > -1) val = 1
            else val = 0;
            row.push(val)

            for (var i = 0; i < window.dataOverTime.length; i++) {
                var dataNow = window.dataOverTime[i];
                var dataCur = window.currentDataOverTime[i];
                // console.log(' data now found ', dataNow, nameDict[item], row)
                console.log(' data now found ', dataNow[i]['uniqueId'])
                var dataItem = mar.getDataByUniqueId(+nameDict[item], dataNow);
                var dataItemCur = mar.getDataByUniqueId(+nameDict[item], dataCur);
                // var dataItem = [];
                // for (var m = 0; m < dataNow.length; m++) {
                //     console.log('lets check ids ', dataNow[m]['uniqueId'], nameDict[item], dataNow[m][mar.tooltipAttribute])
                //     if (dataNow[m]["uniqueId"] == nameDict[item]){
                //         dataItem = dataNow[m];
                //         break;
                //     }                     
                // }
                console.log('data item si ', dataItem)
                row.push(dataItemCur['rank'])
                row.push(dataItemCur['target_variable'])
                row.push(dataItem['rank'])
                row.push(dataItem['target_variable'])
            }
            csvContent += row.join(',') + "\r\n";
        }
        sav.writeCSV(csvContent, "fullDataRankClassify_" + mar.subjectId + ".csv");
    }




})()