(function () {


    Cons = {};

    Cons.origWidthConsBars = 0;

    Cons.userWtConst = {
        'COMPOSITIONAL': 1,
        'QUANTITATIVE': 1,
        'GENERALIZATION': 1,
    }


    Cons.typeConstraints = {
        'COMPOSITIONAL': {
            'Same-Label': {
                // 'Add': true,
                'Checked': false,
            },
            'Similarity-Metric': {
                // 'Add': true,
                'Checked': false,
            },
            'Information-Gain': {
                // 'Add': true,
                'Checked': false,
            },
            'Critical-Items': {
                // 'Add': true,
                'Checked': false,
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
            'F1-Score': {
                'Checked': false,
            },
            'Training-Accuracy': {
                'Checked': false,
            },
            'misc': {
                'Color-Type': '#A2B0C8'
            }
        },
        'GENERALIZATION': {
            'Testing-Accuracy': {
                'Checked': false,
            },
            'Cross-Val-Score': {
                'Checked': false,
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

        var htmlStr = "<div class = 'constraintHeadTitle' > Constraint Panel </div>";
        htmlStr += "<div class = 'constraintHeadButton' ></div>";

        $("#" + containerId).append(htmlStr);

        $(".constraintHeadTitle").css('width', '100%')
        $(".constraintHeadTitle").css('font-size', '1.5em')
        htmlStr = "<button id='someBtnId' class='someBtn mdl-button mdl-js-button mdl-button--icon mdl-button--colored'>"
        htmlStr += "<i class='material-icons'>keyboard_return</i></button>";

        $(".constraintHeadButton").append(htmlStr);

        //click reset data button
        $("#someBtnId").on('click', function () {

        })

    }



    Cons.makeConsDivs = function (containerId = "constrainPanel") {
        console.log('Cons is ', Cons.typeConstraints)
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

        Cons.addIconsConstraintsPanel('constraintHeaderId');

        containerId = "constraintContentId";
        var htmlStr = ""
        for (var item in Cons.typeConstraints) {
            console.log('item is ', item)
            htmlStr += "<div id= 'typeConst_" + item + "' class= 'typeCons'> <div class ='headRowCons' id= 'headRowCons_" + item + "'> " + item + "</div>"
            htmlStr += "<div parent = '"+item+"' id='resizable' class='ui-widget-content resizeWeight'></div>";
            htmlStr += "<div class= 'contentRowCons'>"
            var k = 0;

            htmlStr += "<ul class ='sortable' parent = '"+item+"' class='ui-sortable'>";
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
                htmlStr += "<li class = 'ui-state-default' >"
                htmlStr += "<div class = 'wrapRowCons'>"

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

                htmlStr += "<button parent = '" + item + "' given = '" + val + "' name='" + val + "checkbox-" + k + "' id='" + val + "checkbox-" + k + "' \
          class='mdl-button mdl-js-button mdl-button--accent constOpt btn_" + val + "'>" + val + "</button>"



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

        for (var item in Cons.typeConstraints) {
            var col = Cons.typeConstraints[item]['misc']['Color-Type']
            $("#headRowCons_" + item).css('background', col)

        }


        //activate sortable effect
        // $(".sortable").sortable({
        //     change: function (event, ui) {
        //         var pos = ui.helper.index() < ui.placeholder.index() ?
        //             {
        //                 start: ui.helper.index(),
        //                 end: ui.placeholder.index()
        //             } :
        //             {
        //                 start: ui.placeholder.index(),
        //                 end: ui.helper.index()
        //             }

        //         $(this)
        //             .children().removeClass('highlight')
        //             .not(ui.helper).slice(pos.start, pos.end).addClass('highlight');
        //     },
        //     stop: function (event, ui) {
        //         $(this).children().removeClass('highlight');
        //     }
        // });

        $(".sortable").sortable({
            placeholder: "ui-state-highlight"
        });

        //  $(".sortable").sortable();
         $(".sortable").disableSelection();

            // $("#sortable").sortable();



        $(function () {
            $(".resizeWeight").resizable({
                containment: "parent",
                maxHeight: 20,
                minHeight: 20,
                // animate: true
                  create: function (event, ui) {
                      // Prefers an another cursor with two arrows
                      $(".ui-resizable-handle").css("cursor", "col-resize");
                  },
                  resize: function(e, ui){
                      var wd = $(this).width();
                      var par = $(this).attr('parent');
                      Cons.userWtConst[par] = +(wd/Cons.origWidthConsBars).toFixed(3);
                    //   console.log('width bar is ', wd);
                  }
            });
        });


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
        $(".constOpt").css('font-size', '0.9em');
        $(".constOpt").css('font-weight', 'bold');
        $(".constOpt").css('color', 'black');
        $(".constOpt").css('font-family', 'helvetica');
        $(".constOpt").css('margin-left', '5px');


        $(".continueContentCons").css('display', 'flex');
        $(".continueContentCons").css('font-size', '2em');
        $(".continueContentCons").css('font-weight', 'bold');
        $(".continueContentCons").css('padding', '10px');


        Cons.origWidthConsBars = $(".resizeWeight").width();

   

        //events
        $('.constOpt').on('click', function (e) {
            // return
            var name = $(this).attr('given');
            var item = $(this).attr('parent');
            console.log('clicked checkbox ', name, item);
            Cons.typeConstraints[item][name]['Checked'] = !Cons.typeConstraints[item][name]['Checked'];
            Cons.lastItemClicked = name;
            // $(this).find('button').css('display', 'block');
            if (Cons.typeConstraints[item][name]['Checked']) {
                // $(this).siblings().show();
                $(this).css('background', Main.colors.HIGHLIGHT)
                $(this).css('color', 'white')
                // ConsInt.showPanel();
            } else {
                // $(this).siblings().closest('a').hide();
                $(this).css('background', '')
                $(this).css('color', 'black')
                // ConsInt.hidePanel();
            }
            // ConsInt.getActiveConstraints();
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
        });

        // $( "#btnAdd" ).button( "option", "icon", "ui-icon-gear" );

    }



})();