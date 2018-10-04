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
  htmlStr += "<div id = 'conPanelContentId' class = 'conPanelContent'></div>"
  htmlStr += "</div>"
  $('body').append(htmlStr);
  var w = window.innerWidth;

  console.log('window width ', w)

  $(".conPanelDiv").css('position', 'absolute');
  $(".conPanelDiv").css('top', '300px');
  $(".conPanelDiv").css('left', w*0.75+'px');
  $(".conPanelDiv").css('height', '650px');
  $(".conPanelDiv").css('width', '400px');
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



ConP.addConstrainSelector = function(containerId = "conPanelContentId"){
  $("#"+containerId).empty();

  var i = 1
  var htmlStr = "<div class = 'conHeadPan' ><div class='input-field col s12 consSelectorTop'><select  class='selectConstrain browser-default'>"
  for(var item in Cons.typeConstraints){
    htmlStr += "<optgroup class = 'optConsSelectorTop' label='"+item+"'>";
    var k = Cons.typeConstraints[item];
    for (var elem in k ){
      htmlStr +=  "<option class ='' value='"+elem+"'>"+elem+"</option>";
      i += 1;
    }
    htmlStr += "</optgroup>";
  }
  htmlStr += "</select>";        
  htmlStr += "<label></label></div>"

  htmlStr += "<button id='addLabelCard' class='mdl-button mdl-js-button mdl-button--icon mdl-button--colored'>"
  htmlStr += "<i class='material-icons'>add</i></button>";

  htmlStr += "<button id='addLabelCard' class='mdl-button mdl-js-button mdl-button--icon mdl-button--colored'>"
  htmlStr += "<i class='material-icons'>clear</i></button>";



  htmlStr += "<div id = 'conHeadSupportPan'></div></div>";

  $("#"+containerId).append(htmlStr);


  // $(".conHeadPan").css('display', 'flex')
  $(".conHeadPan").css('width', '100%')
  $(".conHeadPan").css('padding', '2px')
  $(".conHeadPan").css('border-bottom', '1px dotted lightgray')

  $("#conHeadSupportPan").css('display', 'inline-flex')
  $("#conHeadSupportPan").css('width', '75%')
  $("#conHeadSupportPan").css('height', '20px')
  $("#conHeadSupportPan").css('background', 'red')

   $('select').formSelect();

  var $select1 = $('select:not(.browser-default)');
  $('.selectConstrain').on('change', function(e){
     // var sel = $(this).val("1");
     // sel = $('.something').find('option[value="SELECT-VALUE"]').prop('selected', true);
     // var instance = M.FormSelect.getInstance($(this));
     // var sel = instance.input;
     // console.log(' e is ', sel)
     // console.log(' e is ', e.target, e.target.value
     var valueSelect = $(this).val();
     console.log(' e is ', valueSelect);

     if(valueSelect == 'Same-Label'){
      ConP.showSameLabelContent('conHeadSupportPan');
     }

  })
}

ConP.showSameLabelContent = function(containerId = ""){

  $('#'+containerId).empty();

}

}())