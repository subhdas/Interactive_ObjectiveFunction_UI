(function() {


    Cons = {};
    // Cons.typeConstraints = {
    //   'COMPOSITIONAL' : {
    //     'Items-In-Same-Label': {
    //       'Add' : true,
    //     },
    //     'Similar-Items-In-Same-Label' :{},
    //     'Dissimilar-Items-In-Diff-Label' : {}
    //   },
    //   'QUALITATIVE' : {
    //     'Similar-Features-In-Same-Label': {},
    //     'Follow-Feature-Weights' :{
    //       'Add' : true,
    //     },
    //     'Same-Range-Features-In-Same-label' : {}
    //   },
    //   'PREDICTIVE' : {
    //     'Interacted-Items-Correctly-Predicted': {
    //       'Add' : true,
    //     },
    //     'Critical-Items-Correctly-Predicted' :{
    //       'Add' : true,
    //     },
    //     'Number-Items-Correctly-Predicted' : {}
    //   },
    //   'QUANTITATIVE' : {
    //     'Precision-Score': {},
    //     'Accuracy' :{},
    //     'Recall' : {},
    //     'Cross-Val-Score' : {},
    //   },
    //   'GENERALIZATION' : {
    //     'Number-Label-Correct-HoldOut-Data': {},
    //     'Critical-Data-Correct-HoldOut-Data' :{},
    //     'Cross-Val-Score-HoldOut-Data' : {}
    //   },
    // }

    Cons.typeConstraints = {
        'COMPOSITIONAL': {
            'Same-Label': {
                'Add': true,
                'Checked': false,
            },
            'Similarity-Metric': {
                'Add': true,
                'Checked': false,
            },
            'Information-Gain': {
                'Add': true,
                'Checked': false,
            },
            'misc': {
                'Color-Type': '#DEE54F'
            }
        },
        'QUALITATIVE': {
            'Feature-Weights': {
                'Add': true,
                'Checked': false,
            },
            'Feature-Range': {
                'Add': true,
                'Checked': false,
            },
            'misc': {
                'Color-Type': '#90D09D'
            }
        },
        'PREDICTIVE': {
            'Critical-Items': {
                'Add': true,
                'Checked': false,
            },
            'Discard-Items': {
                'Add': true,
                'Checked': false,
            },
            'Number-Items-Features': {
                'Add': true,
                'Checked': false,
            },
            'Number-Items': {
                'Checked': false,
            },
            'misc': {
                'Color-Type': '#D0B790'
            }
        },
        'QUANTITATIVE': {
            'F1-Score': {
                'Checked': false,
            },
            'Recall': {
                'Checked': false,
            },
            'Cross-Val': {
                'Checked': false,
            },
            'misc': {
                'Color-Type': '#A2B0C8'
            }
        },
        'GENERALIZATION': {
            'Number-Label-HoldOut': {
                'Checked': false,
            },
            'Critical-Data-HoldOut': {
                'Checked': false,
            },
            'Cross-Val-Score': {
                'Checked': false,
            },
            'misc': {
                'Color-Type': '#F4A1E9'
            }
        },
    }


    Cons.numConstraints = Object.keys(Cons.typeConstraints).length;
    Cons.lastItemClicked = "";


    Cons.makeConsDivs = function(containerId = "constrainPanel") {
        console.log('Cons is ', Cons.typeConstraints)
        var htmlStr = ""
        for (var item in Cons.typeConstraints) {
            console.log('item is ', item)
            htmlStr += "<div id= 'typeConst_" + item + "' class= 'typeCons'> <div class ='headRowCons' id= 'headRowCons_" + item + "'> " + item + "</div>"
            htmlStr += "<div id='resizable' class='ui-widget-content resizeWeight'></div>";
            htmlStr += "<div class= 'contentRowCons'>"
            var k = 0;
            for (var val in Cons.typeConstraints[item]) {
                if (val == 'misc') continue;
                htmlStr += "<div class = 'wrapRowCons'>"
                    // htmlStr += "<label for='"+val+"checkbox-"+k+"'>" + val + "</label>"
                    // htmlStr += "<input type='checkbox' parent = '"+item+"' given = '"+val+"' name='"+val+"checkbox-"+k+"' class = 'constOpt' id='"+val+"checkbox-"+k+"'>"


                if (Cons.typeConstraints[item][val]['Add']) {
                    // htmlStr += "<button  parent = '"+item+"' given = '"+val+"' class='ui-button ui-widget ui-corner-all constOptBtn'>+</button>"
                    // htmlStr += "<button parent = '"+item+"' given = '"+val+"'  class='mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect mdl-button--colored constOptBtn'>"
                    // htmlStr += "<i class='material-icons'>add</i></button>"
                    htmlStr += "<a parent = '" + item + "' given = '" + val + "' class='btn-floating constOptBtn'><i class='material-icons'>add</i></a>"
                        // htmlStr += "<button id = 'btnAdd' class='ui-button ui-widget ui-corner-all ui-button-icon-only' title='Add'>+</button>"
                } // if add button
                else {
                    htmlStr += "<a parent = '" + item + "' given = '" + val + "' class='btn-floating constOptBtn'><i class='material-icons'>check</i></a>"
                }

                htmlStr += "<button parent = '" + item + "' given = '" + val + "' name='" + val + "checkbox-" + k + "' id='" + val + "checkbox-" + k + "' \
          class='mdl-button mdl-js-button mdl-button--accent constOpt'>" + val + "</button>"



                htmlStr += "</div>"
                k = k + 1;
            } // end for second
            // htmlStr += "  </div>"
            htmlStr += "</div>";
            $("#" + containerId).append(htmlStr);
            htmlStr = "<div class= 'continueCons'> <div class ='continueContentCons'> + </div></div>"
        }

        for (var item in Cons.typeConstraints) {
            var col = Cons.typeConstraints[item]['misc']['Color-Type']
            $("#headRowCons_" + item).css('background', col)

        }

        $(function() {
            $(".resizeWeight").resizable({
                containment: "parent",
                maxHeight: 10,
                animate: true
            });
        });


        $(".resizeWeight").css('width', '100%')
        $(".resizeWeight").css('height', '10px')
        $(".resizeWeight").css('background', Main.colors.HIGHLIGHT)

        $(".constOptBtn").css('display', 'flex');
        $(".constOptBtn").css('align-items', 'center');
        $(".constOptBtn").css('width', '25px');
        $(".constOptBtn").css('height', '25px');
        $(".constOptBtn").css('margin-left', '5px');
        $(".constOptBtn").hide();

        $(".constOpt").css('display', 'flex');
        $(".constOpt").css('text-align', 'left');
        $(".constOpt").css('font-size', '0.9em');
        $(".constOpt").css('font-weight', 'bold');
        $(".constOpt").css('color', 'black');
        $(".constOpt").css('font-family', 'helvetica');
        $(".constOpt").css('margin-left', '5px');


        $(".continueContentCons").css('display', 'flex');
        $(".continueContentCons").css('font-size', '2em');
        $(".continueContentCons").css('font-weight', 'bold');
        $(".continueContentCons").css('padding', '10px');




        //events
        $('.constOpt').on('click', function(e) {
            var name = $(this).attr('given');
            var item = $(this).attr('parent');
            console.log('clicked checkbox ', name, item);
            Cons.typeConstraints[item][name]['Checked'] = !Cons.typeConstraints[item][name]['Checked'];
            Cons.lastItemClicked = name;
            // $(this).find('button').css('display', 'block');
            if (Cons.typeConstraints[item][name]['Checked']) {
                $(this).siblings().show();
                $(this).css('background', Main.colors.HIGHLIGHT)
                $(this).css('color', 'white')
                    // ConsInt.showPanel();
            } else {
                $(this).siblings().closest('a').hide();
                $(this).css('background', '')
                $(this).css('color', 'black')
                ConsInt.hidePanel();
            }
            // ConsInt.getActiveConstraints();
            // ConsInt.makeInteractionPanel();
        })

        $('.constOptBtn').on('click', function(e) {
            var name = $(this).attr('given');
            var item = $(this).attr('parent');
            console.log('clicked checkbox ', name, item);
            // Cons.typeConstraints[item][name]['Checked'] = !Cons.typeConstraints[item][name]['Checked'];
            ConsInt.showPanel();
            Cons.lastItemClicked = name;
            ConsInt.getActiveConstraints();
            ConsInt.makeInteractionPanel(stri = name);
            ConsInt.interPanelContentFromData(stri = name);

            if ($('#consInterPanel').children().length > 0) {}

        })


        // $("#"+containerId).empty();

        // $(".typeCons").css('margin', '5px');


        $(".wrapRowCons").css('display', 'flex')
        $(".wrapRowCons").css('padding', '2px')
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
        });

        // $( "#btnAdd" ).button( "option", "icon", "ui-icon-gear" );

    }



})();