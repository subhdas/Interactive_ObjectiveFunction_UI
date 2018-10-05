(function() {
    ConP = {};
    ConP.showingConstPanel = false;
    ConP.selectedRowsCons = {}


    ConP.hideConPanel = function() {
        $(".conPanelDiv").hide();
        ConP.showingConstPanel = false;

    }

    ConP.showConPanel = function() {
        $(".conPanelDiv").show();
        ConP.showingConstPanel = true;
    }


    ConP.addPanelCon = function() {

        if ($(".conPanelDiv").length > 0) {
            ConP.showConPanel()
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


        $( function() {
    $( ".conPanelDiv" ).draggable();
  } );



        $("#clearConPanel").on('click', function() {
            ConP.hideConPanel();
        })
    }



    ConP.addConstrainSelector = function(containerId = "conPanelContentId") {
        $("#" + containerId).empty();
        ConP.showingConstPanel = true;

        var i = 1
        var htmlStr = "<div class = 'conHeadPan' ><div class='input-field col s12 consSelectorTop'><select  class='selectConstrain browser-default'>"
        for (var item in Cons.typeConstraints) {
            htmlStr += "<optgroup class = 'optConsSelectorTop' label='" + item + "'>";
            var k = Cons.typeConstraints[item];
            for (var elem in k) {
                htmlStr += "<option class ='' value='" + elem + "'>" + elem + "</option>";
                i += 1;
            }
            htmlStr += "</optgroup>";
        }
        htmlStr += "</select>";
        htmlStr += "<label></label></div>"

        htmlStr += "<button id='addConstraintPanelItems' class='mdl-button mdl-js-button mdl-button--icon mdl-button--colored'>"
        htmlStr += "<i class='material-icons'>add</i></button>";

        htmlStr += "<button id='addLabelCard' class='mdl-button mdl-js-button mdl-button--icon mdl-button--colored'>"
        htmlStr += "<i class='material-icons'>clear</i></button>";



        htmlStr += "<div id = 'conHeadSupportPan'></div></div>";
        htmlStr += "<div id = 'conContentItems'></div>"

        $("#" + containerId).append(htmlStr);


        // $(".conHeadPan").css('display', 'flex')
        $(".conHeadPan").css('width', '100%')
        $(".conHeadPan").css('padding', '2px')
        $(".conHeadPan").css('border-bottom', '1px dotted lightgray')

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

        var $select1 = $('select:not(.browser-default)');
        $('.selectConstrain').on('change', function(e) {
            // var sel = $(this).val("1");
            // sel = $('.something').find('option[value="SELECT-VALUE"]').prop('selected', true);
            // var instance = M.FormSelect.getInstance($(this));
            // var sel = instance.input;
            // console.log(' e is ', sel)
            // console.log(' e is ', e.target, e.target.value
            var valueSelect = $(this).val();
            console.log(' e is ', valueSelect);

            if (valueSelect == 'Same-Label') {
                ConP.showSameLabelContent('conContentItems', 'conHeadSupportPan');
            }

        })

        $("#addConstraintPanelItems").on('click', function() {
            var valueSelect = $('.selectConstrain').val();
            if (valueSelect == 'Same-Label') {
                Cons.typeConstraints['COMPOSITIONAL'][valueSelect]['Checked'] = true;
                ConsInt.getActiveConstraints();
                var arr = ConsInt.activeConstraints[valueSelect]['input']["labelitemsConId_" + ConP.radioCheckedSame];
                try {
                    arr.push.apply(arr, Object.keys(ConP.selectedRowsCons));
                    arr = Util.getUniqueArray(arr)
                } catch (err) {
                    arr = Object.keys(ConP.selectedRowsCons);
                }
                ConsInt.activeConstraints[valueSelect]['input']["labelitemsConId_" + ConP.radioCheckedSame] = arr;
                ConP.makeSameLabContent();
            }

        })
    }

    ConP.makeSameLabContent = function(containerId = "_mainContentMid"+ConP.radioCheckedSame) {
        $("#" + containerId).empty();
        var htmlStr = "<div class = 'parChartMainContentCons' id = 'parChartMainContentCons_"+ConP.radioCheckedSame+"'></div>";
        htmlStr += "<div id ='textAreaMainContentCons' ></div>";
        $("#" + containerId).append(htmlStr);

        $(".parChartMainContentCons").css('display', 'flex');
        $(".parChartMainContentCons").css('width', '70%');
        $(".parChartMainContentCons").css('height', '100%');
        $(".parChartMainContentCons").css('padding', '3px');
        $(".parChartMainContentCons").css('border-right', '1px solid lightgray');

        $("#textAreaMainContentCons").css('display', 'flex');
        $("#textAreaMainContentCons").css('width', '30%');
        $("#textAreaMainContentCons").css('height', '100%');
        $("#textAreaMainContentCons").css('padding', '3px');


        // for (var item in LabelCard.storedData) {
            // console.log(' item is ', item, LabelCard.storedData, ConsInt.activeConstraints['Same-Label'])
            try {
                var data = [];
                var arrId = ConsInt.activeConstraints['Same-Label']['input']['labelitemsConId_' + ConP.radioCheckedSame];
                // console.log(' add id ', arrId)
                for (var i = 0; i < arrId.length; i++) {
                    var dataItem = Main.getDataById(arrId[i], Main.trainData);
                    data.push(dataItem);
                }

                data = Main.getDataByKeys(Object.keys(Main.numericalAttributes), data);
                console.log(' data is ', data)
                ParC.makeParallelCoordChart('parChartMainContentCons_'+ConP.radioCheckedSame, data);
                console.log('par chart added ')
            } catch (e) {

            }
        // }//end of for


    }

    ConP.showSameLabelContent = function(containerId = "", supportId = "") {

        $('#' + containerId).empty();
        var htmlStr = ""
        for (var item in LabelCard.storedData) {
            var lab = LabelCard.storedData[item]['label']
            if (typeof lab == 'undefined') lab = item
            htmlStr += "<div class = '_wrapOneItem' ><div class = '_headConsTop' > Label : " + lab + "</div>";
            htmlStr += "<div class ='_mainContentMid' id = '_mainContentMid"+item+"' ></div></div>";
        }

        $("#" + containerId).append(htmlStr);
        $("._wrapOneItem").css('display', 'flex');
        $("._wrapOneItem").css('flex-direction', 'column');
        $("._wrapOneItem").css('width', '100%');
        $("._wrapOneItem").css('height', '200px');
        $("._wrapOneItem").css('border-bottom', '1px dotted lightgray');
        $("._wrapOneItem").css('padding', '5px');

        $("._headConsTop").css('width', '100%');
        $("._mainContentMid").css('display', 'flex');
        $("._mainContentMid").css('flex-direction', 'row');
        $("._mainContentMid").css('width', '100%');
        $("._mainContentMid").css('height', '75%');

        htmlStr = ""
        for (var item in LabelCard.storedData) {
            var lab = LabelCard.storedData[item]['label']
            if (typeof lab == 'undefined') lab = item
            htmlStr += "<p><label><input class = 'radioLabelCons' name='group1' type='radio' checked />"
            htmlStr += "<span>" + lab + "</span></label></p>";
            ConP.radioCheckedSame = lab;
        }
        $("#" + supportId).append(htmlStr);

        $('.radioLabelCons').on('change', function(e) {
            var check = $("input[name=group1]:checked").next().text();
            ConP.radioCheckedSame = check;
            console.log(' found ', check);
        })

    }

}())