(function () {


    Cons = {};

    Cons.origWidthConsBars = 0;
    Cons.cnsBtnMouseEvent = false;
    Cons.accordionOpen = false;

    Cons.userWtConst = {
        'COMPOSITIONAL': 1,
        'QUANTITATIVE': 1,
        'GENERALIZATION': 1,
    }


    Cons.indivUserWtConst = {}


    Cons.typeConstraints = {
        'COMPOSITIONAL': {
            'Same-Label': {
                // 'Add': true,
                'Checked': false,
                'UserWt': 1,
                'Name': 'Candidate',
                'Tip': 'Data items representing assigned labels. Provide data items as examples which strongly represent their target label',
            },
            'Similarity-Metric': {
                // 'Add': true,
                'Checked': false,
                'UserWt': 1,
                'Name': 'Similarity',
                'Tip': 'Data items which are similar or different to each other. Provide data items as examples showing similarity and difference between them.',

            },
            // 'Information-Gain': {
            //     // 'Add': true,
            //     'Checked': false,
            //     'UserWt': 1,
            // },

            'Critical-Items': {
                // 'Add': true,
                'Checked': false,
                'UserWt': 1,
                'Name': 'Critical',
                'Tip': 'Data items which are most relevant to you for the model to make correct predictions.',


            },
            'Non-Critical': {
                // 'Add': true,
                'Checked': false,
                'UserWt': 1,
                'Name': 'Ignore',
                'Tip': 'Data items which are least relevant to you for the model to make any error in predictions.',

            },
            'misc': {
                'Color-Type': '#DEE54F'
            }
        },
        // 'QUALITATIVE': {
        //     'Feature-Weights': {
        //         'Add': true,
        //         'Checked': false,
        //     },
        //     'Feature-Range': {
        //         'Add': true,
        //         'Checked': false,
        //     },       
        //     'misc': {
        //         'Color-Type': '#90D09D'
        //     }
        // },
        'QUANTITATIVE': {
            'Recall': {
                'Checked': true,
                'UserWt': 1,
                'Name': 'Accuracy Recall',
                'Tip': 'Accuracy Recall is how many of the true positives are correctly predicted by the model',
            },

            'Precision': {
                'Checked': true,
                'UserWt': 1,
                'Name': 'Accuracy Precision',
                'Tip': 'Accuracy Precision is how many of the predicted data items were true positive',
            },
            'F1-Score': {
                'Checked': true,
                'UserWt': 1,
                'Name': 'Accuracy F1',
                'Tip': 'Accuracy F1 is the weighted average of Precision and Recall. This score takes both false positives and false negatives into account.\
                Accuracy F1 is usually more useful if you have an uneven class distribution in the data',
            },
            'Training-Accuracy': {
                'Checked': false,
                'UserWt': 1,
                'Name': 'Accuracy Train',
                'Tip': 'Accuracy F1 is the weighted average of Precision and Recall. Therefore, this score takes both false positives and false negatives into account.\
                Accuracy F1 is usually more useful if you have an uneven class distribution in the data',
            },
            'misc': {
                'Color-Type': '#A2B0C8'
            }
        },
        'GENERALIZATION': {
            'Testing-Accuracy': {
                'Checked': false,
                'UserWt': 1,
                'Name': 'Accuracy Test',
                'Tip': 'Prediction accuracy of the test data will be used to evaluate model performance',

            },
            'Cross-Val-Score': {
                'Checked': false,
                'UserWt': 1,
                'Name': 'Cross Validation',
                'Tip': 'The train data will be split into 10 folds and randomly one fold will be test data. \
                 The model will be tested 10 times on each fold and the best performing accuracy score will be picked.',

            },
            'misc': {
                'Color-Type': '#D0B790'
            }
        },
    }


    Cons.numConstraints = Object.keys(Cons.typeConstraints).length;
    Cons.lastItemClicked = "";


    Cons.addIconsConstraintsPanel = function (containerId = "") {
        if (containerId == "") containerId = "constraintHeaderId";
        $("#" + containerId).empty();

        var htmlStr = "<div class = 'constraintHeadTitle' > Objective Function Stack </div>";
        htmlStr += "<div class = 'constraintHeadButton' ></div>";

        $("#" + containerId).append(htmlStr);

        $(".constraintHeadTitle").css('width', '100%')
        $(".constraintHeadTitle").css('font-size', '1.5em')
        // htmlStr = "<button id='someBtnId' class='someBtn mdl-button mdl-js-button mdl-button--icon mdl-button--colored'>"
        // htmlStr += "<i class='material-icons'>keyboard_return</i></button>";

        // $(".constraintHeadButton").append(htmlStr);

        //click reset data button
        $("#someBtnId").on('click', function () {

        })

    }

    Cons.constraintIdFinder = function () {
        var origDef = ['Recall', 'Precision', 'F1-Score', 'Training-Accuracy', 'Testing-Accuracy', 'Cross-Val-Score']
        var origDef = [];
        var metricObj = {}
        for (var item in ConsInt.activeConstraints) {
            var check = true;
            if (origDef.indexOf(item) != -1) check = false;

            var el = ConsInt.activeConstraints[item]
            if (Object.keys(el).length == 0) check = false;
            // else if (Object.keys(el['input']).length == 0) check = false;
            else {
                try {
                    var keysObj = Object.keys(el['input']);
                    // if (el['input'][keysObj[0]].length == 0) check = false;
                } catch (e) {
                    check = false
                }
            }
            if (check == true) {
                var keysObj = Object.keys(el['input']);
                var obj = {}
                for (var i = 0; i < keysObj.length; i++) {
                    var key = keysObj[i].replace('labelitemsConId_', '')
                    obj[key] = el['input'][keysObj[i]];
                }
                metricObj[item] = obj;
            }

        }

        return metricObj;

    }



    Cons.checkConstraintsActive = function () {
        var origDef = ['Recall', 'Precision', 'F1-Score', 'Training-Accuracy', 'Testing-Accuracy', 'Cross-Val-Score']

        for (var item in ConsInt.activeConstraints) {
            var check = true;
            var el = ConsInt.activeConstraints[item]
            if (Object.keys(el).length == 0) check = false;
            else if (Object.keys(el['input']).length == 0) check = false;
            else {
                try {
                    var keysObj = Object.keys(el['input']);
                    if (el['input'][keysObj[0]].length == 0) check = false;
                } catch (e) {
                    check = false
                }
            }
            if (origDef.indexOf(item) != -1) check = true;

            if (check == false) {
                //toggle button
                var idBtn = $(".btn_" + item).attr('id');
                // console.log('toggling button ', item, check)
                var name = $("#" + idBtn).attr('given');
                var item = $("#" + idBtn).attr('parent');
                // if (!DataTable.fromTableInferred) Cons.typeConstraints[item][name]['Checked'] = !Cons.typeConstraints[item][name]['Checked'];
                Cons.typeConstraints[item][name]['Checked'] = false;
                $("#" + idBtn).click();

            }

        }
    }


    Cons.computeWeightsToSend = function () {
        var metricList = Object.keys(ConsInt.activeConstraints);
        Cons.indivUserWtConst = {}
        for (var i = 0; i < metricList.length; i++) {

            var compList = ['Same-Label', 'Similarity-Metric', 'Critical-Items', 'Non-Critical'];
            var quantList = ['Recall', 'Precision', 'F1-Score', 'Training-Accuracy'];
            var genList = ['Testing-Accuracy', 'Cross-Val-Score'];

            if (compList.indexOf(metricList[i]) != -1) {

                var lowWt = Cons.typeConstraints['COMPOSITIONAL'][metricList[i]]['UserWt']
                Cons.indivUserWtConst[metricList[i]] = Cons.userWtConst['COMPOSITIONAL'] * lowWt;
                continue;
            }

            if (quantList.indexOf(metricList[i]) != -1) {
                var lowWt = Cons.typeConstraints['QUANTITATIVE'][metricList[i]]['UserWt']
                Cons.indivUserWtConst[metricList[i]] = Cons.userWtConst['QUANTITATIVE'] * lowWt
                continue;
            }

            if (genList.indexOf(metricList[i]) != -1) {
                var lowWt = Cons.typeConstraints['GENERALIZATION'][metricList[i]]['UserWt']
                Cons.indivUserWtConst[metricList[i]] = Cons.userWtConst['GENERALIZATION'] * lowWt
                continue;
            }
        }

        console.log('indiv cons wt computed ', Cons.indivUserWtConst)
    }

    Cons.makeConsDivs = function (containerId = "constrainPanel") {
        // console.log('Cons is ', Cons.typeConstraints)
        if (containerId == "") containerId = "constrainPanel";
        $("#" + containerId).empty();
        var htmlStr = "<div class = 'constraintHeader' id = 'constraintHeaderId' ></div>";
        htmlStr += "<div class = 'constraintContent' id = 'constraintContentId' ></div>";
        $("#" + containerId).append(htmlStr);

        // css styling
        $('.constraintHeader').css('display', 'flex');
        $('.constraintHeader').css('padding', '3px');
        // $('.featureEngHeader').css('margin', '5px');
        $('.constraintHeader').css('width', '100%');
        $('.constraintHeader').css('height', '35px');
        $('.constraintHeader').css('border-bottom', '1px dotted lightgray');

        $('.constraintContent').css('display', 'flex');
        $('.constraintContent').css('padding', '4px');
        $('.constraintContent').css('margin', '5px');
        $('.constraintContent').css('width', '100%');
        $('.constraintContent').css('height', '100%');
        $('.constraintContent').css('justify-content', 'center');

        Cons.addIconsConstraintsPanel('constraintHeaderId');

        containerId = "constraintContentId";
        var htmlStr = ""
        for (var item in Cons.typeConstraints) {
            // console.log('item is ', item)
            htmlStr += "<div id= 'typeConst_" + item + "' class= 'typeCons'> <div class ='headRowCons' id= 'headRowCons_" + item + "'> " + item + "</div>"
            htmlStr += "<div parent = '" + item + "' id='resizable' class='ui-widget-content resizeWeight'></div>";
            htmlStr += "<div class= 'contentRowCons'>"
            var k = 0;

            htmlStr += "<ul class ='sortable' parent = '" + item + "' class='ui-sortable'>";
            // < ul id = "sortable" >
            //     <
            //     li class = "ui-state-default" > Item 1 < /li> <
            //     li class = "ui-state-default" > Item 2 < /li> <
            //     li class = "ui-state-default" > Item 3 < /li> <
            //     li class = "ui-state-default" > Item 4 < /li> <
            //     li class = "ui-state-default" > Item 5 < /li> <
            //     li class = "ui-state-default" > Item 6 < /li> <
            //     li class = "ui-state-default" > Item 7 < /li> <
            //     li class = "ui-state-default" > Item 8 < /li> <
            //     li class = "ui-state-default" > Item 9 < /li> <
            //     /ul>


            for (var val in Cons.typeConstraints[item]) {
                if (val == 'misc') continue;
                var nameItem = Cons.typeConstraints[item][val]['Name']
                var titleItem = Cons.typeConstraints[item][val]['Tip']

                htmlStr += "<li class = 'ui-state-default' >"
                htmlStr += "<div class = 'wrapRowCons' parent = '" + item + "' >"

                // htmlStr += "<label for='"+val+"checkbox-"+k+"'>" + val + "</label>"
                // htmlStr += "<input type='checkbox' parent = '"+item+"' given = '"+val+"' name='"+val+"checkbox-"+k+"' class = 'constOpt' id='"+val+"checkbox-"+k+"'>"

                // add func removed now
                // if (Cons.typeConstraints[item][val]['Add']) {
                //     // htmlStr += "<button  parent = '"+item+"' given = '"+val+"' class='ui-button ui-widget ui-corner-all constOptBtn'>+</button>"
                //     // htmlStr += "<button parent = '"+item+"' given = '"+val+"'  class='mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect mdl-button--colored constOptBtn'>"
                //     // htmlStr += "<i class='material-icons'>add</i></button>"
                //     htmlStr += "<a parent = '" + item + "' given = '" + val + "' class='btn-floating constOptBtn'><i class='material-icons'>add</i></a>"
                //     // htmlStr += "<button id = 'btnAdd' class='ui-button ui-widget ui-corner-all ui-button-icon-only' title='Add'>+</button>"
                // } // if add button
                // else {
                //     htmlStr += "<a parent = '" + item + "' given = '" + val + "' class='btn-floating constOptBtn'><i class='material-icons'>check</i></a>"
                // }

                // htmlStr += "<div id = 'criticalRectId_" + d.id + "' class = 'criticalRect tableBtnInt' >"
                htmlStr += "<button  parent = '" + item + "' given = '" + val + "'  \
                class='mdl-button mdl-js-button mdl-button--icon mdl-button--colored btnConstOpt' id='" + val + "_btnCheck-" + k + "'>"
                htmlStr += "<i class='material-icons'>linear_scale</i></button>"; // drag_handle
                // htmlStr += "</div>"

                htmlStr += "<button parent = '" + item + "' given = '" + val + "' name='" + val + "checkbox-" + k + "' id='" + val + "checkbox-" + k + "' \
          class = 'mdl-button mdl-js-button mdl-button--accent constOpt btn_" + val + " 'title = '" + titleItem + "'>" + nameItem + " </button>"



                htmlStr += "</div>"
                htmlStr += "</li>"
                k = k + 1;
            } // end for second
            // htmlStr += "  </div>"
            htmlStr += "</ul>";
            htmlStr += "</div>";
            $("#" + containerId).append(htmlStr);
            htmlStr = "<div class= 'continueCons'> <div class ='continueContentCons'> + </div></div>"
        }


        // for default items
        for (var item in Cons.typeConstraints) {
            var col = Cons.typeConstraints[item]['misc']['Color-Type']
            $("#headRowCons_" + item).css('background', col)
            for (var el in Cons.typeConstraints[item]) {
                if (Cons.typeConstraints[item][el]['Checked']) {
                    // $('.btn_' + el).css('background', Main.colors.HIGHLIGHT)
                    // $('.btn_' + el).css('color', 'white')

                    //to fix button toggles
                    var item = $('.btn_' + el).parent().find('.btnConstOpt').attr('parent')
                    var val = $('.btn_' + el).parent().find('.btnConstOpt').attr('given')
                    $('.btn_' + el).parent().find('.btnConstOpt').remove();
                    var k = 0
                    var htmlStr = "<button  parent = '" + item + "' given = '" + val + "' \
                class='mdl-button mdl-js-button mdl-button--icon mdl-button--colored btnConstOpt btnConstOptSpl' id='" + val + "_btnCheck-" + k + "'>"
                    htmlStr += "<i class='material-icons'>check</i></button>"; // drag_handle
                    $('.btn_' + el).parent().prepend(htmlStr);
                    $(".btnConstOptSpl").css('background', Main.colors.HIGHLIGHT2)

                }

            }

        }


        // $(".btnConstOpt").hide();
        // $(".btnConstOpt").on('click', function (e) {

        // })


        $(".sortable").sortable({
            placeholder: "ui-state-highlight",
            out: function (e, ui) {
                var par = $(this).parents();
                var children = $(par[0]).find('.wrapRowCons')

                var type = $(children[0]).attr('parent');
                var wt = 1.0;
                var inc = 1 / children.length;
                children.each(function (d) {
                    var txt = $(this).text();
                    // var giv = $(this).attr('given')
                    var giv = $(this).find('button').attr('given')
                    var par = $(this).attr('parent')
                       console.log(' child is ', txt, giv,par, $(this))
                    Cons.typeConstraints[type][giv]['UserWt'] = wt
                    wt -= inc;
                })
            }
        });

        $(".sortable").disableSelection();


        $(function () {
            $(".resizeWeight").resizable({
                containment: "parent",
                maxHeight: 20,
                minHeight: 20,
                // animate: true
                create: function (event, ui) {
                    $(".ui-resizable-handle").css("cursor", "col-resize");
                },
                resize: function (e, ui) {
                    var wd = $(this).width();
                    var par = $(this).attr('parent');
                    Cons.userWtConst[par] = +(wd / Cons.origWidthConsBars).toFixed(3);
                    //   console.log('width bar is ', wd);
                }
            });
        });


        $(".typeCons").css('width', '200px')
        // $(".typeCons").css('font-size', '0.75em')


        $(".resizeWeight").css('width', '100%')
        $(".resizeWeight").css('height', '20px')
        $(".resizeWeight").css('background', Main.colors.HIGHLIGHT)
        // $(".resizeWeight").css('cursor', 'col-resize')
        // $(".ui-resizable-e").css("cursor", "col-resize");

        $(".constOptBtn").css('display', 'flex');
        $(".constOptBtn").css('align-items', 'center');
        $(".constOptBtn").css('width', '25px');
        $(".constOptBtn").css('height', '25px');
        $(".constOptBtn").css('margin-left', '5px');
        $(".constOptBtn").hide();

        $(".constOpt").css('display', 'flex');
        $(".constOpt").css('text-align', 'left');
        $(".constOpt").css('font-size', '0.75em');
        $(".constOpt").css('font-weight', 'bold');
        $(".constOpt").css('color', 'black');
        $(".constOpt").css('font-family', 'helvetica');
        $(".constOpt").css('margin-left', '5px');
        $(".constOpt").css('width', '150px');
        $(".constOpt").css('height', 'auto');
        $(".constOpt").css('line-height', '18px');


        $(".continueContentCons").css('display', 'flex');
        $(".continueContentCons").css('font-size', '2em');
        $(".continueContentCons").css('font-weight', 'bold');
        $(".continueContentCons").css('padding', '10px');


        Cons.origWidthConsBars = $(".resizeWeight").width();

        $('.constOpt').on('mouseover', function (e) {
            Cons.cnsBtnMouseEvent = true;

        })

        $('.constOpt').on('mouseout', function (e) {

            Cons.cnsBtnMouseEvent = false;

        })

        //events
        $('.constOpt').on('click', function (e) {
            // return
            var name = $(this).attr('given');
            var item = $(this).attr('parent');
            console.log('clicked checkbox ', name, item);
            //COMMENTED BELOW
            // if (!DataTable.fromTableInferred) Cons.typeConstraints[item][name]['Checked'] = !Cons.typeConstraints[item][name]['Checked'];
            if (Cons.cnsBtnMouseEvent) {
                Cons.typeConstraints[item][name]['Checked'] = !Cons.typeConstraints[item][name]['Checked'];
                // console.log('hovered and clicked button ', Cons.typeConstraints[item][name])
            }
            Cons.lastItemClicked = name;
            // $(this).find('button').css('display', 'block');
            if (Cons.typeConstraints[item][name]['Checked'] == true) {

                //to fix button toggles
                var item = $(this).parent().find('.btnConstOpt').attr('parent')
                var val = $(this).parent().find('.btnConstOpt').attr('given')
                $(this).parent().find('.btnConstOpt').remove();
                var k = 0
                var htmlStr = "<button  parent = '" + item + "' given = '" + val + "' \
                class='mdl-button mdl-js-button mdl-button--icon mdl-button--colored btnConstOpt btnConstOptSpl' id='" + val + "_btnCheck-" + k + "'>"
                htmlStr += "<i class='material-icons'>check</i></button>"; // drag_handle
                $(this).parent().prepend(htmlStr);
                $(".btnConstOptSpl").css('background', Main.colors.HIGHLIGHT2)





                // to send alerts if no examples constraint found
                // only true when hand clicked manually
                if (Cons.cnsBtnMouseEvent) {
                    // get data from tempActiveConsr
                    // try {
                    //     ConsInt.activeConstraints[name] = ConsInt.tempActConstraints[name];
                    //     console.log(' active copying worked ', ConsInt.activeConstraints, name, ConsInt.tempActConstraints)
                    // } catch (e) {}
                    setTimeout(() => {
                        var alertSend = false;
                        var origDef = ['Recall', 'Precision', 'F1-Score', 'Testing-Accuracy', 'Cross-Val-Score', 'Training-Accuracy']
                        var usedName = Cons.typeConstraints[item][name]['Name']
                        try {
                            var inpObj = ConsInt.activeConstraints[name]['input'];
                            var keys = Object.keys(inpObj);
                            if (keys.length == 0) {
                                alertSend = true;
                            } else if (inpObj[keys[0]].length == 0) {
                                alertSend = true;
                            }
                            console.log(' inp obj is ', inpObj, name)
                        } catch (e) {
                            alertSend = true;
                        }
                        var ind = origDef.indexOf(name)
                        if (ind != -1) alertSend = false;
                        // if (alertSend) alert('Please add examples for constraint : ' + name)
                        if (alertSend) {
                            // $('.ajs-error').css('width', '500px')
                            alertify.set('notifier', 'position', 'top-center');
                            alertify.error('Please show examples for: ' + usedName);
                        }
                    }, 500);
                }


            } else {

                //to fix button toggles
                var item = $(this).parent().find('.btnConstOpt').attr('parent')
                var val = $(this).parent().find('.btnConstOpt').attr('given')
                $(this).parent().find('.btnConstOpt').remove();
                var k = 0;
                var htmlStr = "<button  parent = '" + item + "' given = '" + val + "' \
                 class='mdl-button mdl-js-button mdl-button--icon mdl-button--colored btnConstOpt' id='" + val + "_btnCheck-" + k + "'>"
                htmlStr += "<i class='material-icons'>linear_scale</i></button>"; // drag_handle
                $(this).parent().prepend(htmlStr);


            }
            setTimeout(() => {
                // if (!Cons.cnsBtnMouseEvent) ConsInt.getActiveConstraints();
                ConsInt.getActiveConstraints();
            }, 300);

            // Rul.makeRuleList();

            // ConsInt.makeInteractionPanel();
        })


        //this is the add button(which we dont have now so below COMMENTED)
        // $('.constOptBtn').on('click', function (e) {
        //     var name = $(this).attr('given');
        //     var item = $(this).attr('parent');
        //     console.log('clicked checkbox ', name, item);
        //     // Cons.typeConstraints[item][name]['Checked'] = !Cons.typeConstraints[item][name]['Checked'];
        //     ConsInt.showPanel();
        //     Cons.lastItemClicked = name;
        //     ConsInt.getActiveConstraints();
        //     ConsInt.makeInteractionPanel(stri = name);
        //     ConsInt.interPanelContentFromData(stri = name);

        //     if ($('#consInterPanel').children().length > 0) {}

        // })


        // $("#"+containerId).empty();

        // $(".typeCons").css('margin', '5px');


        $(".wrapRowCons").css('display', 'flex')
        $(".wrapRowCons").css('padding', '2px')
        $(".wrapRowCons").css('width', '100%')
        // $(".headRowCons").css('background', Main.colors.LIGHTGRAY)
        $(".headRowCons").css('padding', '5px')
        $(".headRowCons").css('height', 'auto')
        $(".headRowCons").css('width', '100%')
        $(".headRowCons").css('font-size', '1.3em')

        $(".contentRowCons").css('padding', '4px')
        // $(".contentRowCons").css('background', Main.colors.LIGHTGRAY)

        $(".typeCons").css('display', 'flex');
        $(".typeCons").css('flex-direction', 'column');
        // $(".typeCons").css('padding', '10px');
        // $(".typeCons").css('width', '150px');
        // $(".typeCons").css('height', '100%');
        $(".typeCons").css('border', '1px solid lightgray');
        $(".typeCons").css('padding', '2px');


        $("input").checkboxradio({
            icon: false
        });

        $("#btnAdd").button({
            icon: "ui-icon-gear",
            // showLabel : false
        })

        $("#bottomBar").accordion({
            collapsible: true,
            heightStyle: "content",
            active: false,
            activate: function (event, ui) {
                Cons.accordionOpen = !Cons.accordionOpen
                // console.log('accordion opened ', Cons.accordionOpen)
                // return

                if (Cons.accordionOpen) {
                    Main.rightPanelBothShow = false;
                    $("#confMatTrain").hide();
                } else {
                    Main.rightPanelBothShow = true;

                    $("#confMatTrain").show();
                }

                // if (Cons.accordionOpen) {
                //     // $("#confMatTrain").hide();
                //     $('#confMatTrain').css('height', 'auto');
                //     var trnHt = $('#trainContent').height();
                //     var testHt = $('#testContent').height();
                //     console.log('height calc both train test ', trnHt, testHt)
                //     if (trnHt > testHt) {
                //         //train mode
                //         $('#wrapperDivConfMatrId_' + 1).hide();
                //     } else {
                //         //test mode
                //         $('#wrapperDivConfMatrId_' + 0).hide();
                //     }
                // } else {
                //     // $("#confMatTrain").show();
                //     $('#wrapperDivConfMatrId_' + 0).show();
                //     $('#wrapperDivConfMatrId_' + 1).show();
                //     //   $('#confMatTrain').css('height', '50%');

                // }
            }
        });

        // $( "#btnAdd" ).button( "option", "icon", "ui-icon-gear" );

    }



})();