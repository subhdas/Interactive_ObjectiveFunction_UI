(function() {
    TabCon = {}
    TabCon.radioCheckedSame = -1;

    TabCon.addSameLabContentFromData = function(valueSelect = 'Same-Label') {
        // Cons.typeConstraints['COMPOSITIONAL'][valueSelect]['Checked'] = true;
        // ConsInt.getActiveConstraints();
        for (var item in LabelCard.storedData) {
            var arr = ConsInt.activeConstraints[valueSelect]['input']["labelitemsConId_" + item];
            // console.log(' got arr for item ', item, arr)
            TabCon.makeSameLabContent("_mainContentMid" + item, item, valueSelect);
        }
    }

    TabCon.makeSameLabContent = function(containerId = "_mainContentMid" + TabCon.radioCheckedSame, item = TabCon.radioCheckedSame, dataFeed = 'Same-Label') {
        $("#" + containerId).empty();
        var htmlStr = "<div class = 'parChartMainContentCons' id = 'parChartMainContentCons_" + item + "'></div>";
        htmlStr += "<div class = 'textAreaMainContentCons' id ='textAreaMainContentCons_" + item + "' ></div>";
        $("#" + containerId).append(htmlStr);

        $(".parChartMainContentCons").css('display', 'flex');
        $(".parChartMainContentCons").css('width', '70%');
        $(".parChartMainContentCons").css('height', '100%');
        $(".parChartMainContentCons").css('padding', '3px');
        $(".parChartMainContentCons").css('border-right', '1px solid lightgray');

        $(".textAreaMainContentCons").css('display', 'flex');
        $(".textAreaMainContentCons").css('flex-direction', 'column');
        $(".textAreaMainContentCons").css('width', '30%');
        $(".textAreaMainContentCons").css('height', '100%');
        // $(".textAreaMainContentCons").css('padding', '3px');
        // $(".textAreaMainContentCons").css('margin-left', '5px');
        $(".textAreaMainContentCons").css('overflow-y', 'auto')
        $(".textAreaMainContentCons").css('overflow-x', 'hidden')


        // for (var item in LabelCard.storedData) {
        // console.log(' item is ', item, LabelCard.storedData, ConsInt.activeConstraints['Same-Label'])
        try {
            var data = [];
            var arrId = ConsInt.activeConstraints[dataFeed]['input']['labelitemsConId_' + item];
            // console.log(' add id ', arrId)
            for (var i = 0; i < arrId.length; i++) {
                var dataItem = Main.getDataById(arrId[i], Main.trainData);
                data.push(dataItem);
            }

            var dataNumeric = Main.getDataByKeys(Object.keys(Main.numericalAttributes), data);
            console.log(' data is ', dataNumeric)
            ParC.makeParallelCoordChart('parChartMainContentCons_' + item, dataNumeric);
            ParC.textListing('textAreaMainContentCons_' + item, data);
            console.log('par chart added ')
        } catch (e) {

        }
        // }//end of for
    }



    TabCon.makeSameLabHeader = function(containerId = "", supportId = "") {
        $('#' + containerId).empty();
        var htmlStr = ""
        for (var item in LabelCard.storedData) {
            var lab = LabelCard.storedData[item]['label']
            if (typeof lab == 'undefined') lab = item
            htmlStr += "<div class = '_wrapOneItem' ><div class = '_headConsTop' > Label : " + lab + "</div>";
            htmlStr += "<div class ='_mainContentMid' id = '_mainContentMid" + item + "' ></div></div>";
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
            TabCon.radioCheckedSame = lab;
        }
        $("#" + supportId).empty();
        $("#" + supportId).append(htmlStr);

        $('.radioLabelCons').on('change', function(e) {
            var check = $("input[name=group1]:checked").next().text();
            TabCon.radioCheckedSame = check;
            // console.log(' found ', check);
        })

    }



}())