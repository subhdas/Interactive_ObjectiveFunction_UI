(function(){
  LabelCard = {};

LabelCard.makeCards = function(containerId = ""){
  if(containerId == "") containerId = "labelCardPanel";

  for(var item in DataTable.selectedRows){
    var htmlStr = "<div id='labelCard_"+item+"' class = 'labelCard'>";
    htmlStr += "</div>";
    $("#"+containerId).append(htmlStr);
  }

  $(".labelCard").css("display", "flex");
  $(".labelCard").css("width", "100%");
  $(".labelCard").css("height", "300px");
  $(".labelCard").css("border-bottom", "1px solid lightgray");
  $(".labelCard").css("padding", "3px");
  $(".labelCardhover").css("background", "lightgray");
  $(".labelCardhover").css("oveflow-y", "hidden");
  $(".labelCardhover").css("oveflow-x", "auto");
}

}())
