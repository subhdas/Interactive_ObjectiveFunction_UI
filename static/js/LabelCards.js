(function(){
  LabelCard = {};
  LabelCard.storedData ={}

LabelCard.getDataForCard = function(dataGiven = Main.trainData){
  var ran = Util.getRandomNumberBetween(Main.trainData.length*0.75 , 3).toFixed(0);
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
  LabelCard.storedData = {};

  for(var item in DataTable.selectedRows){
    var htmlStr = "<div id='labelCard_"+item+"' class = 'ui-droppable labelCard'>";
    htmlStr += "</div>";
    $("#"+containerId).append(htmlStr);
    var data = LabelCard.getDataForCard();
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
        $(this).append($(ui.draggable));
        console.log("dropped item ", event, this, ui)
    }
});

}



}())
