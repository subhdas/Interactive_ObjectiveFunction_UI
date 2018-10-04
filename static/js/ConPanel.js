(function(){
ConP = {};


ConP.hideConPanel = function(){
  $(".conPanelDiv").hide();
}

ConP.showConPanel = function(){
  $(".conPanelDiv").show();
}


ConP.addPanelCon = function(){

  if($(".conPanelDiv").length > 0) {
    ConP.showConPanel()
    return;
  }

  var htmlStr = "<div class = 'conPanelDiv'><div class = 'conPanelHeader'> <p class = 'labelConPanel'>CONSTRAINTS PANEL</p>"
  htmlStr += "<button id='clearConPanel' class='mdl-button mdl-js-button mdl-button--icon mdl-button--colored'>"
  htmlStr += "<i class='material-icons'>clear</i></button></div>";
  htmlStr += "<div class = 'conPanelContent'></div>"
  htmlStr += "</div>"
  $('body').append(htmlStr);
  var w = window.innerWidth;

  console.log('window width ', w)

  $(".conPanelDiv").css('position', 'absolute');
  $(".conPanelDiv").css('top', '300px');
  $(".conPanelDiv").css('left', w*0.75+'px');
  $(".conPanelDiv").css('height', '650');
  $(".conPanelDiv").css('width', '300px');
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

  $("#clearConPanel").css('float', 'right');



  $("#clearConPanel").on('click', function(){
    ConP.hideConPanel();
  })
}



}())