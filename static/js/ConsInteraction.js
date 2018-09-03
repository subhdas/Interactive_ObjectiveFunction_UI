(function () {


    ConsInt = {};
    ConsInt.activeConstraints = {};


    ConsInt.getActiveConstraints = function(){
      for(var item in Cons.typeConstraints){
        var elem = Cons.typeConstraints[item];
        for(var k in elem){
          if(elem[k]['Checked'] == true) {
            var obj = {
              'input' : {},
              'parent' : item,
              'name' : k
            }
            ConsInt.activeConstraints[k] = obj;
          }
        }
      }
    }

    ConsInt.addInterHeader = function(val = "something", containerId = "consInterPanel" ){
      var htmlStr = "<div class ='interHead' id = 'interHeadId'>Add : " + val + "</div>";
      $("#"+containerId).append(htmlStr);
    }

    ConsInt.hidePanel = function(containerId = "consInterPanel"){
      $("#"+containerId).hide();
    }

    ConsInt.showPanel = function(containerId = "consInterPanel"){
      $("#"+containerId).show();
    }


    ConsInt.makeInteractionPanel = function(stri = "",containerId = "consInterPanel"){
      $("#"+containerId).empty();
      ConsInt.addInterHeader(stri, containerId);

      var htmlStr = "<div class = 'labelCon'>"
      //add label boxes
      for(var item in LabelCard.storedData){
        htmlStr += "<div class = 'labelitemsCon'></div><br>"
      }
      htmlStr += "</div>";
      $('#'+containerId).append(htmlStr);

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


      $('#'+containerId).css('display', 'flex');
      $('#'+containerId).css('flex-direction', 'column');
      $("#"+containerId).css('overflow-x', 'hidden');
      $("#"+containerId).css('overflow-y', 'auto');
      $("#"+containerId).css('width', '30%');
      $("#"+containerId).css('height', '100%');
      $("#"+containerId).css('border-left', '1px solid lightgray');
      $("#"+containerId).css('padding', '5px');
    }







})();
