(function () {


    ConsInt = {};
    ConsInt.activeConstraints = {};
    ConsInt.tempActConstraints = {}


    ConsInt.getActiveConstraints = function () {
        for (var item in Cons.typeConstraints) {
            var elem = Cons.typeConstraints[item];
            for (var k in elem) {
                if (!Cons.cnsBtnMouseEvent) {
                    if (typeof ConsInt.activeConstraints[k] != 'undefined') continue; // COMMENTED
                }
                if (elem[k]['Checked'] == true) {
                    //adding data to the datastack
                    var obj = {}
                    try {
                        obj = ConsInt.tempActConstraints[k];
                        console.log(' active copying worked ', ConsInt.activeConstraints, k, ConsInt.tempActConstraints)
                    } catch (e) {}
                    if (typeof obj == 'undefined') {
                        //normal case
                        obj = {
                            'input': {},
                            'parent': item,
                            'name': k,
                            'usedName': elem[k]['Name'], // 
                        }
                    }
                    ConsInt.activeConstraints[k] = obj;
                } else {
                    //deleting item from the datastack
                    try {
                        var obj = ConsInt.activeConstraints[k]
                        if (Object.keys(obj).length > 0) {
                            ConsInt.tempActConstraints[k] = Object.assign({}, obj)
                        }
                        delete ConsInt.activeConstraints[k]
                        // console.log(' deleted ', k)
                    } catch (e) {
                        // console.log(' delete error ', e)
                    }
                }
            }
        }
    }

    ConsInt.addInterHeader = function (val = "something", containerId = "consInterPanel") {
        var htmlStr = "<div class ='interHead' id = 'interHeadId'>Add : " + val + "</div>";
        $("#" + containerId).append(htmlStr);
        $('.interHead').css('padding', '5px')
    }

    ConsInt.hidePanel = function (containerId = "consInterPanel") {
        $("#" + containerId).hide();
    }

    ConsInt.showPanel = function (containerId = "consInterPanel") {
        $("#" + containerId).show();
    }

    ConsInt.stylizeAddContent = function (idNum, labelId) {
        var dataGet = Main.getDataById(idNum, Main.trainData);
        var name = dataGet[Main.entityNameSecondImp]
        var htmlStr = "<div class = 'dropNameInt'>" + name + "</div>"
        $("#labelitemsConId_" + labelId).append(htmlStr);
        $(".dropNameInt").css('display', 'flex');
        $(".dropNameInt").css('padding', '3px');
        $(".dropNameInt").css('margin-bottom', '2px');
        $(".dropNameInt").css('background', Main.colors.HIGHLIGHT2);
        $(".dropNameInt").css('border-radius', '3px');
    }


    ConsInt.interPanelContentFromData = function (stri = "") {
        // return
        // console.log('inter called')
        if (stri == "Same-Label") {
            for (var item in LabelCard.storedData) {
                var labelId = item;
                if (typeof ConsInt.activeConstraints[stri]['input']["labelitemsConId_" + labelId] == 'undefined') continue;
                var idArr = ConsInt.activeConstraints[stri]['input']["labelitemsConId_" + labelId];
                $("#labelitemsConId_" + labelId).empty();
                for (var i = 0; i < idArr.length; i++) {
                    var idNum = idArr[i];
                    ConsInt.stylizeAddContent(idNum, labelId);
                }
            } //end of for
        } else if (stri == "Similarity-Metric") {
            var labelId = "Same";
            // if(typeof ConsInt.activeConstraints[stri]['input']["labelitemsConId_"+labelId] == 'undefined')
            var idArr = ConsInt.activeConstraints[stri]['input']["labelitemsConId_" + labelId];
            if (typeof idArr == 'undefined') return;
            $("#labelitemsConId_" + labelId).empty();
            for (var i = 0; i < idArr.length; i++) {
                var idNum = idArr[i];
                ConsInt.stylizeAddContent(idNum, labelId);
            }
            labelId = "Different";
            var idArr = ConsInt.activeConstraints[stri]['input']["labelitemsConId_" + labelId];
            $("#labelitemsConId_" + labelId).empty();
            for (var i = 0; i < idArr.length; i++) {
                var idNum = idArr[i];
                ConsInt.stylizeAddContent(idNum, labelId);
            }
        } else if (stri == "Information-Gain") {
            var labelId = "Max";
            // if(typeof ConsInt.activeConstraints[stri]['input']["labelitemsConId_"+labelId] == 'undefined')
            var idArr = ConsInt.activeConstraints[stri]['input']["labelitemsConId_" + labelId];
            if (typeof idArr == 'undefined') return;
            $("#labelitemsConId_" + labelId).empty();
            for (var i = 0; i < idArr.length; i++) {
                var idNum = idArr[i];
                ConsInt.stylizeAddContent(idNum, labelId);
            }
            labelId = "Min";
            var idArr = ConsInt.activeConstraints[stri]['input']["labelitemsConId_" + labelId];
            if (typeof idArr == 'undefined') return;
            $("#labelitemsConId_" + labelId).empty();
            for (var i = 0; i < idArr.length; i++) {
                var idNum = idArr[i];
                ConsInt.stylizeAddContent(idNum, labelId);
            }
        } else if (stri == "Critical-Items") {
            var labelId = "Critical";
            // if(typeof ConsInt.activeConstraints[stri]['input']["labelitemsConId_"+labelId] == 'undefined')
            var idArr = ConsInt.activeConstraints[stri]['input']["labelitemsConId_" + labelId];
            if (typeof idArr == 'undefined') return;
            $("#labelitemsConId_" + labelId).empty();
            for (var i = 0; i < idArr.length; i++) {
                var idNum = idArr[i];
                ConsInt.stylizeAddContent(idNum, labelId);
            }
        }
    }

    // same-label content
    ConsInt.contentForLabels = function (containerId = "") {
        var htmlStr = "<div class = 'labelCon'>"
        //add label boxes
        for (var item in LabelCard.storedData) {
            var val = LabelCard.tempLabels[item];
            if (typeof val == 'undefined') val = item;
            htmlStr += "<div class = 'labelitemsTitle'> Label : " + val + "</div>"
            htmlStr += "<div givenCons = '" + stri + "' class = 'ui-droppable labelitemsCon' id = 'labelitemsConId_" + val + "' ></div><br>"; // this is the event.target
        }
        htmlStr += "</div>";
        $('#' + containerId).append(htmlStr);
    }

    // feature -range content
    ConsInt.contentForFeatRange = function (containerId = "") {
        var htmlStr = "<div class = 'labelCon featWtCon'>"
        var val = "Feature-Range"
        // htmlStr += "<div class = 'labelitemsTitle'> Set : " + val + "</div>"
        htmlStr += "<div givenCons = '" + stri + "' class = 'labelitemsConFeat' id = 'labelitemsConId_" + val + "' ></div><br>"; // this is the event.target
        htmlStr += "</div>";
        $('#' + containerId).append(htmlStr);

        //place the features
        var feat = Object.keys(Main.attrDict);
        htmlStr = "";
        for (var i = 0; i < feat.length; i++) {
            if (feat[i] == 'id') continue;
            htmlStr += "<div class = 'wrapRowFeatWt'><label class = 'labelFeatWt' for='" + feat[i] + "checkbox-" + i + "'>" + feat[i] + "</label>"
            htmlStr += "<input type='checkbox' parent = '" + val + "' given = '" + feat[i] + "' name='" + feat[i] + "checkbox-" + i + "' \
      class = 'featOpt featOpt_" + feat[i] + "' id='" + feat[i] + "checkbox-" + i + "'>";

            // htmlStr += "<div class = 'sliderFeat' id='slider_"+feat[i]+"' >\
            // <div  parent = '"+val+"' given = '"+feat[i]+"' id='custom-handle1" + feat[i]+"' class='ui-slider-handle custom-handle1'></div>\
            // <div  parent = '"+val+"' given = '"+feat[i]+"' id='custom-handle2" + feat[i]+"' class='ui-slider-handle custom-handle2'></div>\
            // </div>"

            htmlStr += "<div class ='sliderFeat' id='slider_" + feat[i] + "'></div>"
            htmlStr += "</div>"
        }
        $('#labelitemsConId_' + val).append(htmlStr);
        try {
            for (var i = 0; i < feat.length; i++) {

                // var slider = document.getElementById("slider_"+feat[i]);
                var slider = d3.select("#slider_" + feat[i])[0][0]
                console.log('slider is ', slider, i)
                noUiSlider.create(slider, {
                    start: [20, 80],
                    connect: true,
                    step: 1,
                    orientation: 'horizontal', // 'horizontal' or 'vertical'
                    range: {
                        'min': 0,
                        'max': 100
                    }

                });


            }
        } catch (e) {}

        for (var i = 0; i < feat.length; i++) {



            $("#slider_" + feat[i]).on('input', function (e) {
                console.log(' e is ', e.target.value);
            })

        }

        $('.sliderFeat').hide();
        $('.sliderFeat').css('height', '20px');
        $('.sliderFeat').css('padding', '1  0px');


        $(".featOpt").checkboxradio({
            icon: false
        });

        //slider Function
        for (var i = 0; i < feat.length; i++) {
            var ran = Main.attrDict[feat[i]]['range']
            // console.log('range found is ', ran)
            // $( "#slider_"+feat[i] ).slider({
            //   range: true,
            //   min: ran[0],
            //   max: ran[1],
            //   values: [ ran[0], ran[1] ],
            //   create: function() {
            //     var handle1 = $( '#custom-handle1' + feat[i] );
            //     var handle2 = $( '#custom-handle2' + feat[i] );

            //     var val1 = $(this ).slider( "values", 0 );
            //     var val2 = $(this ).slider( "values", 1 );
            //     handle1.text(val1);
            //     handle2.text(val2);
            //     // handle2.text($( this ).slider("value"));
            //   },
            //   slide: function( event, ui ) {
            //     // var handle = $('#custom-handle' + feat[i] );
            //     var handle1 =  $(this).find('.custom-handle1');
            //     var handle2 =  $(this).find('.custom-handle2');

            //     // var handle1 = $( '#custom-handle1' + feat[i] );
            //     // var handle2 = $( '#custom-handle2' + feat[i] );
            //     handle1.text( ui.values[0] );
            //     handle2.text( ui.values[1] );
            //     // console.log(' now ui value ', ui.value, feat[i], i, handle)
            //   },
            //   change : function(e,ui){
            //     var id = ui.handle.id;
            //     // console.log(' found change ', ui);
            //     var ftWt =  $("#"+id).attr('parent');
            //     var nam =  $("#"+id).attr('given');
            //     ConsInt.activeConstraints[ftWt]['input'][nam] = ui.values;
            //   }
            // });
        }
        //events
        $('.featOpt').on('click', function (e) {
            // console.log('clicked attr ', e)
            // console.log('clicked attr ', );
            var nam = $(this).attr('given');
            var ftWt = $(this).attr('parent');
            $("#slider_" + nam).toggle();
            // console.log('checked or not ', this.checked);
            if (this.checked) {
                // var v = $("#slider_"+nam).slider("option", "value");
                ConsInt.activeConstraints[ftWt]['input'][nam] = v;
            } else {
                delete ConsInt.activeConstraints[ftWt]['input'][nam];
            }

            // console.log('clicked attr ', $(e.target).attr('id'));
        }) // end of clicked



        var objDict = ConsInt.activeConstraints[val]['input'];
        for (var item in objDict) {
            var v = objDict[item];
            console.log(' now in objdict ', v, objDict, val, item)
            $(".featOpt_" + item).prop('checked', 'checked');
            $(".featOpt_" + item).checkboxradio("refresh");
            $("#slider_" + item).slider('value', v);
            $("#slider_" + item).toggle();
            $("#custom-handle" + item).text(v);
        }

        $(".labelitemsConFeat").css('height', 'auto')
        $(".labelFeatWt").css('width', '100px')
        $(".labelFeatWt").css('text-align', 'left')
    } // end of feature range


    // feature -weights content
    ConsInt.contentForFeatWeights = function (containerId = "") {
        var htmlStr = "<div class = 'labelCon featWtCon'>"
        var val = "Feature-Weights"
        // htmlStr += "<div class = 'labelitemsTitle'> Set : " + val + "</div>"
        htmlStr += "<div givenCons = '" + stri + "' class = 'labelitemsConFeat' id = 'labelitemsConId_" + val + "' ></div><br>"; // this is the event.target
        htmlStr += "</div>";
        $('#' + containerId).append(htmlStr);

        //place the features
        var feat = Object.keys(Main.attrDict);
        htmlStr = "";
        for (var i = 0; i < feat.length; i++) {
            if (feat[i] == 'id') continue;
            htmlStr += "<div class = 'wrapRowFeatWt'><label class = 'labelFeatWt' for='" + feat[i] + "checkbox-" + i + "'>" + feat[i] + "</label>"
            htmlStr += "<input type='checkbox' parent = '" + val + "' given = '" + feat[i] + "' name='" + feat[i] + "checkbox-" + i + "' \
      class = 'featOpt featOpt_" + feat[i] + "' id='" + feat[i] + "checkbox-" + i + "'>";

            // htmlStr += "<div class = 'sliderFeat' id='slider_"+feat[i]+"' ><div  parent = '"+val+"' given = '"+feat[i]+"' id='custom-handle" + feat[i]+"' class='ui-slider-handle custom-handle'></div></div>"
            htmlStr += "<div class = 'sliderFeat' id='slider_" + feat[i] + "' > <form action='#''><p class='range-field'><input type='range' id='test5' min='0' max='100'/></p></form></div>"
            htmlStr += "</div>"
        }
        $('#labelitemsConId_' + val).append(htmlStr);
        $(".featOpt").checkboxradio({
            icon: false
        });



        //slider Function
        for (var i = 0; i < feat.length; i++) {
            $("#slider_" + feat[i]).slider({
                create: function () {
                    var handle = $('#custom-handle' + feat[i]);
                    handle.text($(this).slider("value"));
                },
                slide: function (event, ui) {
                    // var handle = $('#custom-handle' + feat[i] );
                    var handle = $(this).find('.custom-handle')
                    handle.text(ui.value);
                    // console.log(' now ui value ', ui.value, feat[i], i, handle)
                },
                change: function (e, ui) {
                    var id = ui.handle.id;
                    // console.log(' found change ', $("#"+id).attr('parent'));
                    var ftWt = $("#" + id).attr('parent');
                    var nam = $("#" + id).attr('given');
                    ConsInt.activeConstraints[ftWt]['input'][nam] = ui.value;
                }
            });
        }
        //events
        $('.featOpt').on('click', function (e) {
            // console.log('clicked attr ', e)
            // console.log('clicked attr ', );
            var nam = $(this).attr('given');
            var ftWt = $(this).attr('parent');
            $("#slider_" + nam).toggle();
            // console.log('checked or not ', this.checked);
            if (this.checked) {
                // var v = $("#slider_"+nam).slider("option", "value");
                ConsInt.activeConstraints[ftWt]['input'][nam] = v;
            } else {
                delete ConsInt.activeConstraints[ftWt]['input'][nam];
            }

            // console.log('clicked attr ', $(e.target).attr('id'));
        }) // end of clicked
        $('.sliderFeat').css('height', 'auto');
        $('.sliderFeat').hide();

        var objDict = ConsInt.activeConstraints[val]['input'];
        for (var item in objDict) {
            var v = objDict[item];
            console.log(' now in objdict ', v, objDict, val, item)
            $(".featOpt_" + item).prop('checked', 'checked');
            $(".featOpt_" + item).checkboxradio("refresh");
            $("#slider_" + item).slider('value', v);
            $("#slider_" + item).toggle();
            $("#custom-handle" + item).text(v);
        }

        $(".labelitemsConFeat").css('height', 'auto')
        $(".labelFeatWt").css('width', '100px')
        $(".labelFeatWt").css('text-align', 'left')
    } // end of feature weights

    // similarity - metric label
    ConsInt.contentForCriticalItems = function (containerId = "") {
        var htmlStr = "<div class = 'labelCon'>"
        //add label boxes - same
        val = 'Critical'
        htmlStr += "<div class = 'labelitemsTitle'>" + val + " items : </div>"
        htmlStr += "<div givenCons = '" + stri + "' class = 'ui-droppable labelitemsCon' id = 'labelitemsConId_" + val + "' ></div><br>"; // this is the event.target

        htmlStr += "</div>";
        $('#' + containerId).append(htmlStr);
    }

    // similarity - metric label
    ConsInt.contentForSimilarItems = function (containerId = "") {
        var htmlStr = "<div class = 'labelCon'>"
        //add label boxes - same
        val = 'Same'
        htmlStr += "<div class = 'labelitemsTitle'>" + val + " items : </div>"
        htmlStr += "<div givenCons = '" + stri + "' class = 'ui-droppable labelitemsCon' id = 'labelitemsConId_" + val + "' ></div><br>"; // this is the event.target

        // -different
        val = 'Different'
        htmlStr += "<div class = 'labelitemsTitle'>" + val + " items :</div>"
        htmlStr += "<div givenCons = '" + stri + "' class = 'ui-droppable labelitemsCon' id = 'labelitemsConId_" + val + "' ></div><br>"; // this is the event.target

        htmlStr += "</div>";
        $('#' + containerId).append(htmlStr);
    }


    // similarity - metric label
    ConsInt.contentForInfoGain = function (containerId = "") {
        var htmlStr = "<div class = 'labelCon'>"
        //add label boxes - max gain
        val = 'Max'
        htmlStr += "<div class = 'labelitemsTitle'>" + val + " items : </div>"
        htmlStr += "<div givenCons = '" + stri + "' class = 'ui-droppable labelitemsCon' id = 'labelitemsConId_" + val + "' ></div><br>"; // this is the event.target

        // -min gain
        val = 'Min'
        htmlStr += "<div class = 'labelitemsTitle'>" + val + " items :</div>"
        htmlStr += "<div givenCons = '" + stri + "' class = 'ui-droppable labelitemsCon' id = 'labelitemsConId_" + val + "' ></div><br>"; // this is the event.target

        htmlStr += "</div>";
        $('#' + containerId).append(htmlStr);
    }


    ConsInt.makeInteractionPanel = function (stri = "", containerId = "consInterPanel") {
        $("#" + containerId).empty();
        ConsInt.addInterHeader(stri, containerId);
        if (stri == "Same-Label") ConsInt.contentForLabels(containerId);
        else if (stri == "Similarity-Metric") ConsInt.contentForSimilarItems(containerId);
        else if (stri == "Information-Gain") ConsInt.contentForInfoGain(containerId);
        else if (stri == "Feature-Weights") ConsInt.contentForFeatWeights(containerId);
        else if (stri == "Feature-Range") ConsInt.contentForFeatRange(containerId);
        else if (stri == "Critical-Items") ConsInt.contentForCriticalItems(containerId);

        //style
        $(".labelitemsTitle").css('padding', '5px');
        $('.labelCon').css('display', 'flex');
        $('.labelCon').css('flex-direction', 'column');
        $('.labelCon').css('width', '100%');
        $('.labelCon').css('height', '100%');
        $('.labelitemsCon').css('display', 'flex');
        $('.labelitemsCon').css('flex-direction', 'column');
        $('.labelitemsCon').css('padding', '5px');
        $('.labelitemsCon').css('width', '100%');
        $('.labelitemsCon').css('height', '200px');
        $('.labelitemsCon').css('border-bottom', '1px solid gray');


        $('#' + containerId).css('display', 'flex');
        $('#' + containerId).css('flex-direction', 'column');
        $("#" + containerId).css('overflow-x', 'hidden');
        $("#" + containerId).css('overflow-y', 'auto');
        $("#" + containerId).css('width', '30%');
        $("#" + containerId).css('height', '100%');
        $("#" + containerId).css('border-left', '1px solid lightgray');
        $("#" + containerId).css('padding', '5px');

        //add droppable interface
        $(".ui-droppable.labelitemsCon").droppable({
            hoverClass: "labelitemHover",
            drop: function (event, ui) {
                console.log("dropped item ", ui);
                console.log("dropped item new ", event);
                var idNum = Util.getNumberFromText(ui.draggable[0]['id']);
                var labelId = Util.getNumberFromText($(this).attr('id'));


                //update data
                var obj = {};
                var lab = $(event.target).attr('id');
                // lab = Util.getNumberFromText(lab);
                try {
                    if (ConsInt.activeConstraints[stri]['input'][lab].indexOf(idNum) != -1) return;
                    ConsInt.activeConstraints[stri]['input'][lab].push(idNum);
                } catch (err) {
                    ConsInt.activeConstraints[stri]['input'][lab] = [idNum];
                }

                // ConsInt.stylizeAddContent(idNum,labelId);
                for (var item in LabelCard.storedData) {
                    var index;
                    try {
                        index = ConsInt.activeConstraints[stri]['input'][item].indexOf(idNum);
                    } catch (err) {
                        index = -1
                    }
                    // console.log(' dropped with index ', index, item, lab)
                    if (index != -1 && lab != item) {
                        ConsInt.activeConstraints[stri]['input'][item].splice(index, 1);
                    }
                }
                try {
                    ConsInt.interPanelContentFromData(stri);
                } catch (err) {}

            } // end of drop
        })


    }







})();