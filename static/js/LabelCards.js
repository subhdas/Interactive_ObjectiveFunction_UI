(function(){
  LabelCard = {};
  LabelCard.storedData ={}

LabelCard.getDataForCard = function(dataGiven = Main.trainData){
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
  return data;
}

LabelCard.makeCards = function(containerId = ""){
  if(containerId == "") containerId = "labelCardPanel";
  $("#"+containerId).empty();
  // LabelCard.storedData = {};

  for(var item in DataTable.selectedRows){
    var htmlStr = "<div id='labelCard_"+item+"' class = 'ui-droppable labelCard'>";
    htmlStr += "</div>";
    $("#"+containerId).append(htmlStr);
    var data = LabelCard.storedData[item];
    console.log('found data is ', data)
    if(data == null) data = LabelCard.getDataForCard();
    else data = data['data']
    DataTable.makeTable(data,"labelCard_"+item);
    LabelCard.storedData[item] = {
      'data' : data
    }
  }

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
        var dataCard = LabelCard.storedData[idCard]['data']
        dataCard.unshift(dataGet);
        DataTable.makeTable(dataCard,"labelCard_"+idCard);


        console.log('id dropped ',idNum, dataGet);
        console.log('id dropped ',idCard, dataCard);


    }
});

}// end of makeCards

LabelCard.updateCardById = function(cardId = 0){
}



}())
