(function () {

        sav = {}

        sav.setOfDataDownloads = function () {
            sav.downloadCurrrentTimeStepData(window.data);
            sav.downloadSelectiveCurrrentData(window.data);
            sav.downloadDataByTimeStep();
            sav.downloadFullDataRankClassOnly();
        }


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