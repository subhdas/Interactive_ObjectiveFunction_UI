(function () {
    ConP = {};
    ConP.showingConstPanel = false;
    ConP.selectedRowsCons = {}


    ConP.hideConPanel = function () {
        $(".conPanelDiv").hide();
        ConP.showingConstPanel = false;

    }

    ConP.showConPanel = function () {
        $(".conPanelDiv").show();
        ConP.showingConstPanel = true;
        var valueSelect = $('.selectConstrain').val();
        if (valueSelect == 'Same-Label') {
            TabCon.addSameLabContentFromData();
            // try {
            //     console.log('same label adding from data')
            // } catch (e) {
            //     ConP.makeSameLabHeader('conContentItems', 'conHeadSupportPan');
            //     console.log('same label errored , so adding blank')
            // }
        }
    }


    ConP.addPanelInLine = function (containerId = "") {
        if (containerId == "") containerId = "dataTableHeadTextId"

        var i = 1
        var htmlStr = "<div class = 'conHeadPan' ><div class='input-field col s12 consSelectorTop'><select  class='selectConstrain browser-default'>"
        htmlStr += "<option class ='' value='" + "Select Constraints" + "'>" + "Select Constraints" + "</option>";

        for (var item in Cons.typeConstraints) {
            if (item == 'QUANTITATIVE' || item == 'GENERALIZATION') continue;
            console.log(' item is ', i, item)
            //  htmlStr += "<optgroup class = 'optConsSelectorTop' label='" + item + "'>";
            //  if(i == 1){
            //   i += 1;
            //   continue;
            // }

            var k = Cons.typeConstraints[item];
            for (var elem in k) {
                var name = k[elem]['Name']
                if (elem == 'misc' || elem == 'Feature-Weights') continue;
                if (elem == 'Critical-Items' || elem == 'Information-Gain' || elem == 'Non-Critical') continue;
                htmlStr += "<option class ='' value='" + elem + "'>" + name + "</option>";
                i += 1;
            }
            htmlStr += "</optgroup>";
        }
        htmlStr += "</select>";
        htmlStr += "<label></label></div>"

        htmlStr += "<button id='addConstraintPanelItems' class='mdl-button mdl-js-button mdl-button--icon mdl-button--colored'>"
        htmlStr += "<i class='material-icons'>add</i></button>";

        //  htmlStr += "<button id='removeItemsConPanel' class='mdl-button mdl-js-button mdl-button--icon mdl-button--colored'>"
        //  htmlStr += "<i class='material-icons'>clear</i></button>";



        //  htmlStr += "<div id = 'conHeadSupportPan'></div>"
        htmlStr += "</div>";
        //  htmlStr += "<div id = 'conContentItems'></div>"

        $("#" + containerId).append(htmlStr);

        console.log('added con panel in line , ', Cons.typeConstraints, containerId)

        //    $(".conHeadPan").css('width', '100%')


        $(".consSelectorTop").css('margin', '0px')
        $(".conHeadPan").css('padding', '2px')
        $(".conHeadPan").css('border-bottom', '1px dotted lightgray')
        $(".conHeadPan").css('display', 'flex')
        $(".conHeadPan").css('flex-direction', 'row-reverse')
        $(".conHeadPan").css('align-items', 'center')

        $("#conHeadSupportPan").css('display', 'inline-flex')
        $("#conHeadSupportPan").css('width', '75%')
        $("#conHeadSupportPan").css('height', '20px')
        // $("#conHeadSupportPan").css('background', 'red')


        $("#conContentItems").css('display', 'flex');
        $("#conContentItems").css('width', '100%');
        $("#conContentItems").css('height', 'auto');
        // $("#conContentItems").css('background', 'yellow');
        $("#conContentItems").css('flex-direction', 'column');

        $('select').formSelect();

        // interaction for selector selection
        var $select1 = $('select:not(.browser-default)');
        $('.selectConstrain').on('change', function (e) {
            // var sel = $(this).val("1");
            // sel = $('.something').find('option[value="SELECT-VALUE"]').prop('selected', true);
            // var instance = M.FormSelect.getInstance($(this));
            // var sel = instance.input;
            // console.log(' e is ', sel)
            // console.log(' e is ', e.target, e.target.value
            var valueSelect = $(this).val();
            console.log(' e is ', valueSelect);

            if (valueSelect == 'Select Constraints') {
                console.log(' do nothing')
                $(".radioDivTopSelect").empty()
                ConP.showingConstPanel = false
                $("tr").css('background-color', "rgb(255,255,255)")
                $("tr").css('color', "black")

            }

            if (valueSelect == 'Same-Label') {
                ConP.showingConstPanel = true;
                $(".radioDivTopSelect").empty()
                var htmlStr = "<div class ='radioDivTopSelect'>"
                for (var i = 0; i < Main.labels.length; i++) {
                    var lab = Main.labels[i]
                    if (typeof lab == 'undefined') lab = item
                    htmlStr += "<p class ='par_radioBtnClass'><label><input class = 'radioLabelCons' name='group1' type='radio' checked />"
                    htmlStr += "<span>" + lab + "</span></label></p>";
                    TabCon.radioCheckedSame = lab;
                }
                htmlStr += "</div>"
                $("tr").css('background-color', "rgb(255,255,255)")
                $("tr").css('color', "black")
                try {
                    var arrFound = []
                    var objs = ConsInt.activeConstraints[valueSelect]['input']; //["labelitemsConId_" + TabCon.radioCheckedSame];
                    for (var el in objs) {
                        arrFound = arrFound.concat(objs[el])
                    }

                    arrFound.forEach(function (d, i) {
                        $("#tr_" + d).css('background', Main.colors.HIGHLIGHT2)
                        $("#tr_" + d).css('color', 'white')
                    })
                } catch (e) {}



            }



            if (valueSelect == 'Similarity-Metric') {
                ConP.showingConstPanel = true;
                $(".radioDivTopSelect").empty()
                var arr = ['Similar', 'Different']
                var htmlStr = "<div class ='radioDivTopSelect'>"

                for (var i = 0; i < arr.length; i++) {
                    var lab = arr[i]
                    if (typeof lab == 'undefined') lab = item
                    htmlStr += "<p class ='par_radioBtnClass'><label><input class = 'radioLabelCons' name='group1' type='radio' checked />"
                    htmlStr += "<span class = 'spanRadiobtnClass'>" + lab + "</span></label></p>";
                    TabCon.radioCheckedSame = lab;
                }
                htmlStr += "</div>"
                $("tr").css('background-color', "rgb(255,255,255)")
                $("tr").css('color', "black")
                try {
                    var arrFound = []
                    var objs = ConsInt.activeConstraints[valueSelect]['input']; //["labelitemsConId_" + TabCon.radioCheckedSame];
                    for (var el in objs) {
                        arrFound = arrFound.concat(objs[el])
                    }

                    arrFound.forEach(function (d, i) {
                        $("#tr_" + d).css('background', Main.colors.HIGHLIGHT2)
                        $("#tr_" + d).css('color', 'white')
                    })
                } catch (e) {}
            }

            if (valueSelect != 'Select Constraints') {

                $("#" + containerId).append(htmlStr)
                $(".radioDivTopSelect").css('display', 'flex')
                $(".radioDivTopSelect").css('margin', '0px')
                $(".radioDivTopSelect").css('align-items', 'center')

                $(".par_radioBtnClass").css('display', 'flex')
                $(".par_radioBtnClass").css('margin', '0px')
                $(".par_radioBtnClass").css('align-items', 'center')
                $(".par_radioBtnClass").css('padding-right', '15px')

                // $(".spanRadiobtnClass").css('padding-left', '15px')

                $('.radioLabelCons').on('change', function (e) {
                    var check = $("input[name=group1]:checked").next().text();
                    TabCon.radioCheckedSame = check;
                    console.log(' found ', check);
                })
            }



        }) // end of select constrain





        // add constrained items
        $("#addConstraintPanelItems").on('click', function () {

            var valueSelect = $('.selectConstrain').val();

            //Same label
            if (valueSelect == 'Same-Label') {
                Cons.typeConstraints['COMPOSITIONAL'][valueSelect]['Checked'] = true;
                ConsInt.getActiveConstraints();
                var arr = ConsInt.activeConstraints[valueSelect]['input']["labelitemsConId_" + TabCon.radioCheckedSame];
                try {
                    arr.push.apply(arr, Object.keys(ConP.selectedRowsCons));
                    arr = Util.getUniqueArray(arr)
                } catch (err) {
                    arr = Object.keys(ConP.selectedRowsCons);
                }
                ConsInt.activeConstraints[valueSelect]['input']["labelitemsConId_" + TabCon.radioCheckedSame] = arr;
                // TabCon.makeSameLabContent();
                TabCon.addSameLabContentFromData(valueSelect);

                var arr = Object.keys(ConP.selectedRowsCons);
                ConP.selectedRowsCons = {};
                // commented - no need deselect
                arr.forEach(function (d, i) {
                    // $("#tr_" + d).css('background', "rgb(255,255,255)")
                    // $("#tr_" + d).css('color', 'black')
                })

                //auto select the same label button on top
                if (arr.length > 0) {
                    var id = $(".btn_" + valueSelect).attr('id')
                    var elem = document.getElementById(id);
                    elem.click();
                    DataTable.sameLabelClicked = true;
                    $(".btn_" + valueSelect).trigger("click")
                }

                if (arr.length == 0 && DataTable.sameLabelClicked) {
                    DataTable.sameLabelClicked = false;
                    var id = $(".btn_" + valueSelect).attr('id')
                    var elem = document.getElementById(id);
                    elem.click();
                }
            }

            if (valueSelect == 'Similarity-Metric') {
                // $("._mainContentMid").empty();
                Cons.typeConstraints['COMPOSITIONAL'][valueSelect]['Checked'] = true;
                ConsInt.getActiveConstraints();
                var arr = ConsInt.activeConstraints[valueSelect]['input']["labelitemsConId_" + TabCon.radioCheckedSame];
                try {
                    arr.push.apply(arr, Object.keys(ConP.selectedRowsCons));
                    arr = Util.getUniqueArray(arr)
                } catch (err) {
                    arr = Object.keys(ConP.selectedRowsCons);
                }
                ConsInt.activeConstraints[valueSelect]['input']["labelitemsConId_" + TabCon.radioCheckedSame] = arr;

                // TabCon.makeSameLabContent("_mainContentMid" + TabCon.radioCheckedSame, TabCon.radioCheckedSame, valueSelect);
                TabCon.addSameLabContentFromData(valueSelect);
                var arr = Object.keys(ConP.selectedRowsCons);
                ConP.selectedRowsCons = {};
                //commented - no need to deselect
                arr.forEach(function (d, i) {
                    // $("#tr_" + d).css('background', "rgb(255,255,255)")
                    // $("#tr_" + d).css('color', 'black')
                })


                //auto select the similarity metric button on top
                if (arr.length > 0) {
                    var id = $(".btn_" + valueSelect).attr('id')
                    var elem = document.getElementById(id);
                    elem.click();
                    DataTable.similarityClicked = true;
                    $(".btn_" + valueSelect).trigger("click")
                }

                if (arr.length == 0 && DataTable.similarityClicked) {
                    DataTable.similarityClicked = false;
                    var id = $(".btn_" + valueSelect).attr('id')
                    var elem = document.getElementById(id);
                    elem.click();
                }
            }
            DataTable.makeTags();

        })
    }


    ConP.addPanelCon = function () {

        if ($(".conPanelDiv").length > 0) {
            ConP.showConPanel();
            console.log('now returning ')
            return;
        }

        var htmlStr = "<div class = 'conPanelDiv ui-widget-content'><div class = 'conPanelHeader'> <p class = 'labelConPanel'>CONSTRAINTS PANEL</p>"
        htmlStr += "<button id='clearConPanel' class='mdl-button mdl-js-button mdl-button--icon mdl-button--colored'>"
        htmlStr += "<i class='material-icons'>clear</i></button></div>";
        htmlStr += "<div id = 'conPanelContentId' class = 'conPanelContent'></div>"
        htmlStr += "</div>"
        $('body').append(htmlStr);
        var w = window.innerWidth;

        // console.log('window width ', w)

        $(".conPanelDiv").css('position', 'absolute');
        $(".conPanelDiv").css('top', '300px');
        $(".conPanelDiv").css('left', w * 0.55 + 'px');
        $(".conPanelDiv").css('height', '650px');
        $(".conPanelDiv").css('width', '550px');
        $(".conPanelDiv").css('overflow-x', 'hidden');
        $(".conPanelDiv").css('overflow-y', 'auto');
        $(".conPanelDiv").css('border', '1px dotted lightgray');
        $(".conPanelDiv").css('background', 'white');
        $(".conPanelDiv").css('box-shadow', '2px 3px 3px 2px lightgray');

        $(".conPanelHeader").css('padding', '10px');
        $(".conPanelHeader").css('background', Main.colors.HIGHLIGHT);
        $(".conPanelHeader").css('width', '100%');
        $(".conPanelHeader").css('height', '40px');
        $(".conPanelHeader").css('display', 'block');

        $(".labelConPanel").css('float', 'left');
        $(".labelConPanel").css('width', 'auto');
        $(".labelConPanel").css('display', 'inline');


        $(".conPanelContent").css('padding', '10px');
        $(".conPanelContent").css('width', '100%');
        $(".conPanelContent").css('height', 'auto');
        $(".conPanelContent").css('display', 'flex');
        $(".conPanelContent").css('flex-direction', 'column');

        $("#clearConPanel").css('float', 'right');


        $(function () {
            $(".conPanelDiv").draggable();
        });



        $("#clearConPanel").on('click', function () {
            ConP.hideConPanel();
        })

        ConP.addConstrainSelector();
    }



    // ConP.addConstrainSelector = function (containerId = "conPanelContentId") {
    //     $("#" + containerId).empty();
    //     ConP.showingConstPanel = true;

    //     var i = 1
    //     var htmlStr = "<div class = 'conHeadPan' ><div class='input-field col s12 consSelectorTop'><select  class='selectConstrain browser-default'>"
    //     for (var item in Cons.typeConstraints) {
    //         if (item == 'QUANTITATIVE' || item == 'GENERALIZATION') continue;
    //         htmlStr += "<optgroup class = 'optConsSelectorTop' label='" + item + "'>";
    //         var k = Cons.typeConstraints[item];
    //         for (var elem in k) {
    //             if (elem == 'misc' || elem == 'Feature-Weights') continue;
    //             if (elem == 'Critical-Items' || elem == 'Information-Gain') continue;
    //             htmlStr += "<option class ='' value='" + elem + "'>" + elem + "</option>";
    //             i += 1;
    //         }
    //         htmlStr += "</optgroup>";
    //     }
    //     htmlStr += "</select>";
    //     htmlStr += "<label></label></div>"

    //     htmlStr += "<button id='addConstraintPanelItems' class='mdl-button mdl-js-button mdl-button--icon mdl-button--colored'>"
    //     htmlStr += "<i class='material-icons'>add</i></button>";

    //     htmlStr += "<button id='removeItemsConPanel' class='mdl-button mdl-js-button mdl-button--icon mdl-button--colored'>"
    //     htmlStr += "<i class='material-icons'>clear</i></button>";



    //     htmlStr += "<div id = 'conHeadSupportPan'></div></div>";
    //     htmlStr += "<div id = 'conContentItems'></div>"

    //     $("#" + containerId).append(htmlStr);


    //     // $(".conHeadPan").css('display', 'flex')
    //     $(".conHeadPan").css('width', '100%')
    //     $(".conHeadPan").css('padding', '2px')
    //     $(".conHeadPan").css('border-bottom', '1px dotted lightgray')

    //     $("#conHeadSupportPan").css('display', 'inline-flex')
    //     $("#conHeadSupportPan").css('width', '75%')
    //     $("#conHeadSupportPan").css('height', '20px')
    //     // $("#conHeadSupportPan").css('background', 'red')


    //     $("#conContentItems").css('display', 'flex');
    //     $("#conContentItems").css('width', '100%');
    //     $("#conContentItems").css('height', 'auto');
    //     // $("#conContentItems").css('background', 'yellow');
    //     $("#conContentItems").css('flex-direction', 'column');

    //     $('select').formSelect();


    //     // add by default
    //     var valueSelect = $('.selectConstrain').val();
    //     if (valueSelect == 'Same-Label') {
    //         TabCon.makeSameLabHeader('conContentItems', 'conHeadSupportPan', valueSelect);
    //     }


    //     var $select1 = $('select:not(.browser-default)');
    //     $('.selectConstrain').on('change', function (e) {
    //         // var sel = $(this).val("1");
    //         // sel = $('.something').find('option[value="SELECT-VALUE"]').prop('selected', true);
    //         // var instance = M.FormSelect.getInstance($(this));
    //         // var sel = instance.input;
    //         // console.log(' e is ', sel)
    //         // console.log(' e is ', e.target, e.target.value
    //         var valueSelect = $(this).val();
    //         // console.log(' e is ', valueSelect);

    //         if (valueSelect == 'Same-Label') {
    //             try {
    //                 TabCon.makeSameLabHeader('conContentItems', 'conHeadSupportPan', valueSelect);
    //                 TabCon.addSameLabContentFromData(valueSelect);
    //             } catch (e) {
    //                 // TabCon.makeSameLabHeader('conContentItems', 'conHeadSupportPan', valueSelect);
    //             }
    //         }

    //         if (valueSelect == 'Feature-Range') {
    //             try {
    //                 TabCon.makeSameLabHeader('conContentItems', 'conHeadSupportPan', valueSelect);
    //                 TabCon.addSameLabContentFromData(valueSelect);
    //             } catch (e) {
    //                 // TabCon.makeSameLabHeader('conContentItems', 'conHeadSupportPan', valueSelect);
    //             }
    //         }

    //         if (valueSelect == 'Similarity-Metric') {
    //             try {
    //                 TabCon.makeSameLabHeader('conContentItems', 'conHeadSupportPan', valueSelect);
    //                 TabCon.addSameLabContentFromData(valueSelect);
    //             } catch (e) {
    //                 // TabCon.makeSameLabHeader('conContentItems', 'conHeadSupportPan', valueSelect);
    //             }
    //         }

    //     })

    //     // removes items added in the constrain panel
    //     $("#removeItemsConPanel").on('click', function () {
    //         var foundText = $(".selectConstrain").closest('label').text()
    //         console.log('found text ', foundText)
    //     })

    //     // when add button on constrain panel is clicked
    //     $("#addConstraintPanelItems").on('click', function () {
    //         console.log('adding items to constrains panel')
    //         var valueSelect = $('.selectConstrain').val();

    //         //Same label
    //         if (valueSelect == 'Same-Label') {
    //             Cons.typeConstraints['COMPOSITIONAL'][valueSelect]['Checked'] = true;
    //             ConsInt.getActiveConstraints();
    //             var arr = ConsInt.activeConstraints[valueSelect]['input']["labelitemsConId_" + TabCon.radioCheckedSame];
    //             try {
    //                 arr.push.apply(arr, Object.keys(ConP.selectedRowsCons));
    //                 arr = Util.getUniqueArray(arr)
    //             } catch (err) {
    //                 arr = Object.keys(ConP.selectedRowsCons);
    //             }
    //             ConsInt.activeConstraints[valueSelect]['input']["labelitemsConId_" + TabCon.radioCheckedSame] = arr;
    //             // TabCon.makeSameLabContent();
    //             TabCon.addSameLabContentFromData(valueSelect);

    //             var arr = Object.keys(ConP.selectedRowsCons);
    //             ConP.selectedRowsCons = {};
    //             arr.forEach(function (d, i) {
    //                 $("#tr_" + d).css('background', "rgb(255,255,255)")
    //                 $("#tr_" + d).css('color', 'black')
    //             })

    //             //auto select the same label button on top
    //             if (arr.length > 0) {
    //                 var id = $(".btn_" + valueSelect).attr('id')
    //                 var elem = document.getElementById(id);
    //                 elem.click();
    //                 DataTable.sameLabelClicked = true;
    //                 $(".btn_" + valueSelect).trigger("click")
    //             }

    //             if (arr.length == 0 && DataTable.sameLabelClicked) {
    //                 DataTable.sameLabelClicked = false;
    //                 var id = $(".btn_" + valueSelect).attr('id')
    //                 var elem = document.getElementById(id);
    //                 elem.click();
    //             }
    //         }

    //         //Feature Range
    //         // if (valueSelect == 'Feature-Range') {
    //         //     // $("._mainContentMid").empty();
    //         //     Cons.typeConstraints['QUALITATIVE'][valueSelect]['Checked'] = true;
    //         //     ConsInt.getActiveConstraints();
    //         //     var arr = ConsInt.activeConstraints[valueSelect]['input']["labelitemsConId_" + TabCon.radioCheckedSame];
    //         //     try {
    //         //         arr.push.apply(arr, Object.keys(ConP.selectedRowsCons));
    //         //         arr = Util.getUniqueArray(arr)
    //         //     } catch (err) {
    //         //         arr = Object.keys(ConP.selectedRowsCons);
    //         //     }
    //         //     ConsInt.activeConstraints[valueSelect]['input']["labelitemsConId_" + TabCon.radioCheckedSame] = arr;

    //         //     // TabCon.makeSameLabContent("_mainContentMid" + TabCon.radioCheckedSame, TabCon.radioCheckedSame, valueSelect);
    //         //     TabCon.addSameLabContentFromData(valueSelect);
    //         //     var arr = Object.keys(ConP.selectedRowsCons);
    //         //     ConP.selectedRowsCons = {};
    //         //     arr.forEach(function(d, i) {
    //         //         $("#tr_" + d).css('background', "rgb(255,255,255)")
    //         //         $("#tr_" + d).css('color', 'black')
    //         //     })
    //         // }

    //         //Similarity Metric
    //         if (valueSelect == 'Similarity-Metric') {
    //             // $("._mainContentMid").empty();
    //             Cons.typeConstraints['COMPOSITIONAL'][valueSelect]['Checked'] = true;
    //             ConsInt.getActiveConstraints();
    //             var arr = ConsInt.activeConstraints[valueSelect]['input']["labelitemsConId_" + TabCon.radioCheckedSame];
    //             try {
    //                 arr.push.apply(arr, Object.keys(ConP.selectedRowsCons));
    //                 arr = Util.getUniqueArray(arr)
    //             } catch (err) {
    //                 arr = Object.keys(ConP.selectedRowsCons);
    //             }
    //             ConsInt.activeConstraints[valueSelect]['input']["labelitemsConId_" + TabCon.radioCheckedSame] = arr;

    //             // TabCon.makeSameLabContent("_mainContentMid" + TabCon.radioCheckedSame, TabCon.radioCheckedSame, valueSelect);
    //             TabCon.addSameLabContentFromData(valueSelect);
    //             var arr = Object.keys(ConP.selectedRowsCons);
    //             ConP.selectedRowsCons = {};
    //             arr.forEach(function (d, i) {
    //                 $("#tr_" + d).css('background', "rgb(255,255,255)")
    //                 $("#tr_" + d).css('color', 'black')
    //             })


    //             //auto select the similarity metric button on top
    //             if (arr.length > 0) {
    //                 var id = $(".btn_" + valueSelect).attr('id')
    //                 var elem = document.getElementById(id);
    //                 elem.click();
    //                 DataTable.similarityClicked = true;
    //                 $(".btn_" + valueSelect).trigger("click")
    //             }

    //             if (arr.length == 0 && DataTable.similarityClicked) {
    //                 DataTable.similarityClicked = false;
    //                 var id = $(".btn_" + valueSelect).attr('id')
    //                 var elem = document.getElementById(id);
    //                 elem.click();
    //             }
    //         }
    //         DataTable.makeTags();


    //     }) // end of func addconstrain panel



    // }






}())