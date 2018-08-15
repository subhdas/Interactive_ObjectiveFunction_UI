(function(){
  LabelCard = {};
  LabelCard.storedData ={};
  LabelCard.computeReturnData = {};

LabelCard.getDataForCard = function(mainId = 0, dataGiven = Main.trainData){
  // var ran = Util.getRandomNumberBetween(Main.trainData.length*0.75 , 3).toFixed(0);
  var ran = 3;
  var data = [];
  var i = 0;
  Main.trainData.forEach(function(d){
    if(i < ran){
      data.push(Object.assign({}, d));
      i += 1;
    }
  })
  data.unshift(Main.getDataById(mainId));
  return data;
}


LabelCard.getDataObject = function(idObject){
  LabelCard.storedData ={}
  for(var item in idObject){
    var arr = idObject[item]
    var dataRows = []
    for(var i=0;i<arr.length;i++){
      if(arr[i] == item)continue;
      var data = Main.getDataById(arr[i], Main.trainData);
      dataRows.push(Object.assign({}, data));
    }
    var dataARow = Main.getDataById(item, Main.trainData);
    dataRows.unshift(dataARow);
    LabelCard.storedData[item] = {
      'data' : dataRows,
      'mainRow' : dataRows[0]
    }
  }
}

LabelCard.addHeader = function(containerId = ""){
  if(containerId == "") containerId = "labelCardPanel";
  var htmlStr = "<div id ='labelCardHeaderId' >"
  htmlStr += "<div id ='labelCardHeadRow' >Labels Added : " + Object.keys(LabelCard.storedData).length + "</div>";
  htmlStr += "<div id ='labelCardHeadRow' >Features Relevant : " + LabelCard.computeReturnData['colSelected'] + "</div>";
  htmlStr += "</div>";

  $("#"+containerId).append(htmlStr);

  $("#labelCardHeaderId").css('display', 'flex');
  $("#labelCardHeaderId").css('flex-direction', 'column');
  $("#labelCardHeaderId").css('padding', '3px');
  $("#labelCardHeaderId").css('border-bottom', '1px solid gray');
}


LabelCard.makeCards = function(containerId = ""){
  if(containerId == "") containerId = "labelCardPanel";
  $("#"+containerId).empty();
  LabelCard.addHeader(containerId);

  for(var item in DataTable.selectedRows){

    var htmlStr = "<div class ='labelWrap' ><div id ='labelCardInfo' >"
    htmlStr += "<div id ='labelCardInfoRow' >Label Id : " + item + "</div>";
    htmlStr += "<div id ='labelCardInfoRow' >Data Length : " + LabelCard.storedData[item]['data'].length + "</div>";
    htmlStr += "</div>";
    htmlStr += "<div id='labelCard_"+item+"' class = 'ui-droppable labelCard'>";
    htmlStr += "</div></div>";
    $("#"+containerId).append(htmlStr);
    var data = LabelCard.storedData[item];
    console.log('found data is ', data)
    if(data == null) data = LabelCard.getDataForCard(item);
    else data = data['data']
    DataTable.makeTable(data,"labelCard_"+item);
    LabelCard.stylizeTables("labelCard_"+item);
    LabelCard.storedData[item] = {
      'data' : data,
      'mainRow' : data[0]
    }
  }

  $(".labelWrap").css('display', 'flex')
  $(".labelWrap").css('flex-direction', 'column')
  $(".labelWrap").css('padding', '3px')
  $(".labelWrap").css('font-size', '0.8em')
  $(".labelWrap").css('border-bottom', '1px solid lightgray')
  $(".labelCard").css("display", "flex");
  $(".labelCard").css("width", "100%");
  $(".labelCard").css("height", "300px");
  $(".labelCard").css("border-bottom", "1px solid lightgray");
  $(".labelCard").css("margin", "5px");
  $(".labelCard").css("overflow-y", "auto");
  $(".labelCard").css("overflow-x", "auto");
  // $(".labelCard :hover").css("background", "lightgray");



$(".ui-droppable.labelCard").droppable({
   activate: function( event, ui ) {
     console.log("droppable activate")
   },
    // tolerance: "intersect",
    // accept: "tr",
    // activeClass: "ui-state-default",
    // hoverClass: "ui-state-hover",
    drop: function(event, ui) {
        $(this).addClass( "ui-state-highlight" )
        // $(this).append($(ui.draggable));
        console.log("dropped item ", ui);
        var idNum = Util.getNumberFromText( ui.draggable[0]['id']);
        var dataGet = Main.getDataById(idNum, Main.trainData);

        var idCard = Util.getNumberFromText($(this).attr('id'));
        var dataCard = LabelCard.storedData[idCard]['data'];
        dataCard.splice(0,1);
        dataCard.unshift(dataGet);
        dataCard.unshift(LabelCard.storedData[idCard]['mainRow']);
        DataTable.makeTable(dataCard,"labelCard_"+idCard);
        LabelCard.stylizeTables("labelCard_"+idCard)

        console.log('id dropped ',idNum, dataGet);
        console.log('id dropped ',idCard, dataCard);


    }
});

}// end of makeCards

LabelCard.updateCardById = function(cardId = 0){
}


LabelCard.stylizeTables = function(containerId = ""){
  $("#"+containerId+" tr:nth-child(1)").css('background', Main.colors.HIGHLIGHT2);
}



}())
