(function () {


    Cons = {};
    // Cons.typeConstraints = {
    //   'COMPOSITIONAL' : {
    //     'Items-In-Same-Label': {
    //       'Add' : true,
    //     },
    //     'Similar-Items-In-Same-Label' :{},
    //     'Dissimilar-Items-In-Diff-Label' : {}
    //   },
    //   'QUALITATIVE' : {
    //     'Similar-Features-In-Same-Label': {},
    //     'Follow-Feature-Weights' :{
    //       'Add' : true,
    //     },
    //     'Same-Range-Features-In-Same-label' : {}
    //   },
    //   'PREDICTIVE' : {
    //     'Interacted-Items-Correctly-Predicted': {
    //       'Add' : true,
    //     },
    //     'Critical-Items-Correctly-Predicted' :{
    //       'Add' : true,
    //     },
    //     'Number-Items-Correctly-Predicted' : {}
    //   },
    //   'QUANTITATIVE' : {
    //     'Precision-Score': {},
    //     'Accuracy' :{},
    //     'Recall' : {},
    //     'Cross-Val-Score' : {},
    //   },
    //   'GENERALIZATION' : {
    //     'Number-Label-Correct-HoldOut-Data': {},
    //     'Critical-Data-Correct-HoldOut-Data' :{},
    //     'Cross-Val-Score-HoldOut-Data' : {}
    //   },
    // }

    Cons.typeConstraints = {
      'COMPOSITIONAL' : {
        'Same-Label': {
          'Add' : true,
        },
        'Similar-Items' :{},
        'Dissimilar-Items' : {}
      },
      'QUALITATIVE' : {
        'Similar-Features': {},
        'Feature-Weights' :{
          'Add' : true,
        },
        'Same-Range-Features' : {}
      },
      'PREDICTIVE' : {
        'Interacted-Items': {
          'Add' : true,
        },
        'Critical-Items' :{
          'Add' : true,
        },
        'Number-Items' : {}
      },
      'QUANTITATIVE' : {
        'Precision': {},
        'Accuracy' :{},
        'Recall' : {},
        'Cross-Val' : {},
      },
      'GENERALIZATION' : {
        'Number-Label-HoldOut': {},
        'Critical-Data-HoldOut' :{},
        'Cross-Val-Score' : {}
      },
    }


    Cons.numConstraints = Object.keys(Cons.typeConstraints).length;


    Cons.makeConsDivs = function(containerId = "constrainPanel"){
      console.log('Cons is ', Cons.typeConstraints)
      var htmlStr = ""
      for (var item in Cons.typeConstraints){
        console.log('item is ', item)
        htmlStr = "<div id= 'typeConst_"+item+"' class= 'typeCons'> <div class ='headRowCons'> "+item +"</div>"
        htmlStr += "<div class= 'contentRowCons'>"
        var k=0;
        for (var val in Cons.typeConstraints[item]){
          console.log('val in ', val, k)
          // htmlStr += "<div id ='row_"+item+"_"+val+"' class ='rowTypeCons'>"
          //checkbox
          //name

          htmlStr += "<div class = 'wrapRowCons'><label for='"+val+"checkbox-"+k+"'>" + val + "</label>"
          // htmlStr += "<label for='checkbox-"+k+"'>" + val + "</label>"
          // htmlStr += "<label for='checkbox-nested-1'>" + val + "</label>"
          // htmlStr += "<label for='checkbox-nested-1'>" + val + "</label>"
          // htmlStr += "<input type='checkbox' name='checkbox-nested-1' id='checkbox-nested-1'>"
          htmlStr += "<input type='checkbox' name='"+val+"checkbox-"+k+"' id='"+val+"checkbox-"+k+"'>"
          if(Cons.typeConstraints[item][val]['Add']){
            htmlStr += "<button class='ui-button ui-widget ui-corner-all'>+</button>"
            // htmlStr += "<button id = 'btnAdd' class='ui-button ui-widget ui-corner-all ui-button-icon-only' title='Add'>+</button>"
          } // if add button
          htmlStr += "<div>"
          k = k + 1;
        }// end for second
        htmlStr += "  </div>"
        htmlStr += "<div>";
        $("#"+containerId).append(htmlStr);

      }


      // $("#"+containerId).empty();

      // $(".typeCons").css('margin', '5px');


      $(".wrapRowCons").css('padding', '2px')
      $(".headRowCons").css('background', Main.colors.LIGHTGRAY)
      $(".headRowCons").css('padding', '2px')

      $(".contentRowCons").css('padding', '4px')
      // $(".contentRowCons").css('background', Main.colors.LIGHTGRAY)

      $(".typeCons").css('display', 'flex');
      $(".typeCons").css('flex-direction', 'column');
      // $(".typeCons").css('padding', '10px');
      // $(".typeCons").css('width', '20%');
      // $(".typeCons").css('height', '100%');
      $(".typeCons").css('border', '1px solid lightgray');
      $(".typeCons").css('padding', '2px');


      $( "input" ).checkboxradio({
         icon: false
       });

       $("#btnAdd").button({
         icon : "ui-icon-gear",
         // showLabel : false
       })

       $( "#bottomBar" ).accordion({
         collapsible: true,
         heightStyle: "content",
         active: false,
       });

       // $( "#btnAdd" ).button( "option", "icon", "ui-icon-gear" );

    }



})();
