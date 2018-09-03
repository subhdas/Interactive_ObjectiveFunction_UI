(function() {


  ConsInt = {};
  ConsInt.activeConstraints = {};


  ConsInt.getActiveConstraints = function() {
    for (var item in Cons.typeConstraints) {
      var elem = Cons.typeConstraints[item];
      for (var k in elem) {
        if(typeof ConsInt.activeConstraints[k] != 'undefined' ) continue;
        if (elem[k]['Checked'] == true) {
          var obj = {
            'input': {},
            'parent': item,
            'name': k
          }
          ConsInt.activeConstraints[k] = obj;
        }
      }
    }
  }

  ConsInt.addInterHeader = function(val = "something", containerId = "consInterPanel") {
    var htmlStr = "<div class ='interHead' id = 'interHeadId'>Add : " + val + "</div>";
    $("#" + containerId).append(htmlStr);
    $('.interHead').css('padding', '5px')
  }

  ConsInt.hidePanel = function(containerId = "consInterPanel") {
    $("#" + containerId).hide();
  }

  ConsInt.showPanel = function(containerId = "consInterPanel") {
    $("#" + containerId).show();
  }

  ConsInt.stylizeAddContent = function(idNum,labelId){
    var dataGet = Main.getDataById(idNum, Main.trainData);
    var name = dataGet[Main.entityNameSecondImp]
    var htmlStr = "<div class = 'dropNameInt'>" + name + "</div>"
    $("#labelitemsConId_"+labelId).append(htmlStr);
    $(".dropNameInt").css('display', 'flex');
    $(".dropNameInt").css('padding', '3px');
    $(".dropNameInt").css('margin-bottom', '2px');
    $(".dropNameInt").css('background', Main.colors.HIGHLIGHT2);
    $(".dropNameInt").css('border-radius', '3px');
  }


  ConsInt.interPanelContentFromData = function(stri = ""){
    console.log('inter called')
    for(var item in LabelCard.storedData){
      var labelId = item;
      if(typeof ConsInt.activeConstraints[stri]['input'][labelId] == 'undefined') continue;
      var idArr = ConsInt.activeConstraints[stri]['input'][labelId];
      $("#labelitemsConId_"+labelId).empty();
      for(var i =0;i<idArr.length;i++){
        var idNum = idArr[i];
        ConsInt.stylizeAddContent(idNum,labelId);
      }
    }//end of for
  }


  ConsInt.makeInteractionPanel = function(stri = "", containerId = "consInterPanel") {
    $("#" + containerId).empty();
    ConsInt.addInterHeader(stri, containerId);
    var htmlStr = "<div class = 'labelCon'>"
    //add label boxes
    for (var item in LabelCard.storedData) {
      var val =  LabelCard.tempLabels[item];
      if(typeof val =='undefined') val = item;
      htmlStr += "<div class = 'labelitemsTitle'> Label : " + val + "</div>"
      htmlStr += "<div givenCons = '"+stri+"' class = 'ui-droppable labelitemsCon' id = 'labelitemsConId_"+val+"' ></div><br>"; // this is the event.target
    }
    htmlStr += "</div>";
    $('#' + containerId).append(htmlStr);
    //style
    $(".labelitemsTitle").css('padding', '5px');

    //add droppable interface
    $(".ui-droppable.labelitemsCon").droppable({
      hoverClass: "labelitemHover",
      drop: function(event, ui) {
        // console.log("dropped item ", ui);
        console.log("dropped item new ", event);
        var idNum = Util.getNumberFromText(ui.draggable[0]['id']);
        var labelId = Util.getNumberFromText($(this).attr('id'));


        //update data
        var obj = {};
        var lab = $(event.target).attr('id');
        lab = Util.getNumberFromText(lab);
        try{
          if(  ConsInt.activeConstraints[stri]['input'][lab].indexOf(idNum) != -1) return ;
          ConsInt.activeConstraints[stri]['input'][lab].push(idNum);
        }catch(err){
          ConsInt.activeConstraints[stri]['input'][lab] = [idNum];
        }

        // ConsInt.stylizeAddContent(idNum,labelId);
        for(var item in LabelCard.storedData){
          var index;
          try{
            index = ConsInt.activeConstraints[stri]['input'][item].indexOf(idNum);
          }catch(err){
            index = -1
          }
          console.log(' dropped with index ', index, item, lab)
          if(index != -1 && lab != item) {
            ConsInt.activeConstraints[stri]['input'][item].splice(index, 1);
          }
        }
        try{
          ConsInt.interPanelContentFromData(stri);
        }catch(err){
          // ConsInt.stylizeAddContent(idNum,labelId);
        }

      }// end of drop


    })

    //style

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
  }







})();
