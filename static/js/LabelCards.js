(function(){
  LabelCard = {};
  LabelCard.storedData ={};
  LabelCard.tempLabels ={};
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
    var dataRows = [];
    var defLabel = "Label_"+item;
    for(var i=0;i<arr.length;i++){
      var data = Main.getDataById(arr[i], Main.trainData);
      data[Main.targetName] = defLabel;
      // if(arr[i] == item)continue;
      dataRows.push(Object.assign({}, data));
    }
    var dataARow = Main.getDataById(item, Main.trainData);
    dataARow[Main.targetName] = defLabel;


    dataRows.unshift(dataARow);
    var lab = defLabel; //item
    try{
      lab = LabelCard.tempLabels[item];
    }catch(err){}
    if(typeof  lab == 'undefined') lab = defLabel;
    LabelCard.storedData[item] = {
      'data' : dataRows,
      'mainRow' : dataRows[0],
      'label' : lab,
    }
  }

    DataTable.userUpdateLabel();
}

LabelCard.addHeader = function(containerId = ""){
  if(containerId == "") containerId = "labelCardPanel";
  var htmlStr = "<div id ='labelCardHeaderId' >"
  // htmlStr += "<div class = 'iconDiv'><div class='iconHolder' id='makeModel' onclick='' title='Make Models'>"
  // htmlStr += "<img class='imgIcon' src='static/img/icons/three_bar.png'></div></div>"

  htmlStr += "<button id='makeModel' class='mdl-button mdl-js-button mdl-button--icon mdl-button--colored'>"
  htmlStr += "<i class='material-icons'>dashboard</i></button>";
  htmlStr += "<div id ='labelCardHeadRow' >Labels Added : " + Object.keys(LabelCard.storedData).length +  " | Features Relevant : " + LabelCard.computeReturnData['colSelected'] +"</div>";
  // htmlStr += "<div id ='labelCardHeadRow' >Features Relevant : " + LabelCard.computeReturnData['colSelected'] + "</div>";

  htmlStr += "</div>";

  $("#"+containerId).append(htmlStr);

  $("#labelCardHeaderId").css('display', 'flex');
  $("#labelCardHeaderId").css('flex-direction', 'column');
  $("#labelCardHeaderId").css('padding', '3px');
  $("#labelCardHeaderId").css('border-bottom', '1px solid gray');
  $(".iconDiv").css('border-bottom', '1px solid gray');

  $("#makeModel").on('click', function(){
    var objSend = {
      'train' : Main.trainData,
      'targetCol' : Main.targetName,
    }
    socket.emit("get_good_model", objSend);
    // socket.off('get_good_model');
    // socket.removeAllListeners('send_good_model');
    socket.on("send_good_model", function (dataObj) {
      console.log('good model recieved ', dataObj );
      BarM.modelData[0] = Object.assign({}, dataObj);
      DataTable.modelUpdateLabel();
    })
  })
}


LabelCard.makeCards = function(containerId = ""){
  if(containerId == "") containerId = "labelCardPanel";
  $("#"+containerId).empty();
  LabelCard.addHeader(containerId);

  for(var item in DataTable.selectedRows){

    var data = Main.getDataById(item, Main.trainData);
    var name = data[Main.entityNameSecondImp];

    var htmlStr = "<br><div class ='labelWrap' ><div id ='labelCardInfo'>"
    htmlStr += "<div class ='labelHeaderWrap'><div class = 'labelHeadText'>"
    // htmlStr += "<div id ='labelCardInfoRow'>Label Id : <span contenteditable='true'>" + item + "</span></div>";
    htmlStr += "<div class = 'labelInfo' id ='labelCardInfoRow' class ='labelNameRow' >Label : <span class = 'labelItem' id = 'spanLabel_"+item+"' contenteditable='true'>"+ item + "</span></div>";
    htmlStr += "<div class = 'labelInfo' id ='labelCardInfoRow'>Label Id/Name: <span > " + item + " | "+ name + " </span> | Data Length : <span class = 'labelCardLength_"+item+"'>" + LabelCard.storedData[item]['data'].length + "</span></div>";
    // htmlStr += "<div id ='labelCardInfoRow' >Data Length : " + LabelCard.storedData[item]['data'].length + "</div>";
    htmlStr += "</div><div class = 'featBarLabelCard' id='featBar-labelCard_"+item+"' ></div></div>"    

    htmlStr += "</div>";
    // htmlStr += "<div class = 'wrapLabelCard' ><div class = 'horBar' id='horBar-labelCard_"+item+"'></div><div id='labelCard_"+item+"' class = 'ui-droppable labelCard'>";
    htmlStr += "<div class = 'wrapLabelCard' ><div id='labelCard_"+item+"' class = 'ui-droppable labelCard'>";
    htmlStr += "</div></div></div>";
    $("#"+containerId).append(htmlStr);
    var data = LabelCard.storedData[item];
    console.log('found data is ', data)
    if(data == null) data = LabelCard.getDataForCard(item);
    else data = data['data']
    // DataTable.makeTable(data,"labelCard_"+item);
    DataTable.makeHeatMapTable(data,"labelCard_"+item);
    // BarM.makeFeatureLabelsHorBar("horBar-labelCard_"+item, 100,300);
    BarM.makeFeatureLabelsVerBar("featBar-labelCard_"+item,400,100);
    // LabelCard.stylizeTables("labelCard_"+item);
    var lab = item;
    try{
      lab = LabelCard.tempLabels[item];
    }catch(err){}
    LabelCard.storedData[item] = {
      'data' : data,
      'mainRow' : data[0],
      'label' : lab,
    }
  }

  $(".labelHeaderWrap").css('display', 'flex')
  $(".labelHeaderWrap").css('flex-direction', 'row')
  $(".labelHeaderWrap").css('width', '100%')
  $(".labelHeaderWrap").css('height', '10%')

  $(".labelHeadText").css('display', 'flex')
  $(".labelHeadText").css('flex-direction', 'column')
  $(".labelHeadText").css('width', '60%')
  $(".labelHeadText").css('height', '100%')

  $(".featBarLabelCard").css('display', 'flex')
  $(".featBarLabelCard").css('width', '40%')
  $(".featBarLabelCard").css('height', '100%')
  // $(".featBarLabelCard").css('background', 'yellow')


  $(".wrapLabelCard").css('display', 'flex')
  $(".horBar").css('display', 'flex')
  $(".horBar").css('height', '300')
  $(".horBar").css('width', '100')
  $(".horBar").css('background', 'cyan')

  $(".labelWrap").css('display', 'flex')
  $(".labelWrap").css('flex-direction', 'column')
  $(".labelWrap").css('padding', '3px')
  $(".labelWrap").css('font-size', '0.8em')
  $(".labelWrap").css('border-bottom', '1px solid lightgray')
  $(".labelCard").css("display", "flex");
  $(".labelCard").css("width", "100%");
  $(".labelCard").css("height", "300px");
  $(".labelCard").css("border-bottom", "1px solid lightgray");
  $(".labelCard").css("margin-left", "5px");
  $(".labelCard").css("overflow-y", "auto");
  $(".labelCard").css("overflow-x", "auto");

  $(".labelNameRow").css('font-weight', '900')
  $(".labelInfo").css('padding', '3px')
  $(".labelItem").css('background', Main.colors.HIGHLIGHT)
  $(".labelItem").css('padding', '5px')
  $(".labelItem").css('border-radius', '4px')
  $(".labelItem").css('color', 'white');
  // $(".labelCard :hover").css("background", "lightgray");



$(".ui-droppable.labelCard").droppable({
   activate: function( event, ui ) {
     console.log("droppable activate");
   },
    // tolerance: "intersect",
    // accept: "tr",
    // activeClass: "ui-state-default",
    // hoverClass: "labelitemHover",
    drop: function(event, ui) {
        $(this).addClass( "ui-state-highlight" )

        // $(this).append($(ui.draggable));
        // console.log("dropped item ", ui);
        var idNum = Util.getNumberFromText( ui.draggable[0]['id']); //dropped id





        var dataGet = Main.getDataById(idNum, Main.trainData);

        var idCard = Util.getNumberFromText($(this).attr('id')); // card id dropped to
        var dataCard = LabelCard.storedData[idCard]['data'];
        var check = false; //already present
        dataCard.forEach(function(d,i){
          if (idNum == d.id) check = true;
        })
        if(check) return;


        var dataIndex = Main.getDataIndexById(idCard, dataCard);

        dataGet[Main.targetName] =  LabelCard.tempLabels[idCard];
        $('.td_id_' + idNum).parent().find('.td_' + Main.targetName).text(dataGet[Main.targetName]);
        dataCard.splice(0,1);
        dataCard.unshift(dataGet);
        dataCard.unshift(LabelCard.storedData[idCard]['mainRow']);

        $(".labelCardLength_"+idCard).text(dataCard.length);
        // DataTable.makeTable(dataCard,"labelCard_"+idCard);
        DataTable.makeHeatMapTable(dataCard,"labelCard_"+idCard);
        // LabelCard.stylizeTables("labelCard_"+idCard);

        console.log('id dropped ',idNum, dataGet);
        console.log('id dropped ',idCard, dataCard);


        //remove data from the labalcard where it was lastDragged
        //
        setTimeout(function(){
          var dataPrev = LabelCard.storedData[parseInt(DataTable.lastLabelCardId)]['data'];
          var newData = [];
          dataPrev.forEach(function(d){
            if(d.id != DataTable.lastDraggedId ){
              newData.push(d);
            }
          })
          console.log('newdata and data prev length ', newData.length, dataPrev.length);
          LabelCard.storedData[parseInt(DataTable.lastLabelCardId)]['data'] = newData;
          $(".labelCardLength_"+DataTable.lastLabelCardId).text(newData.length);
          // DataTable.makeTable(newData,"labelCard_"+parseInt(DataTable.lastLabelCardId));
          DataTable.makeHeatMapTable(newData,"labelCard_"+parseInt(DataTable.lastLabelCardId));
          // LabelCard.stylizeTables("labelCard_"+parseInt(DataTable.lastLabelCardId));
      }, 50);
    }
});

//contenteditable event listener
$('body').on('focus', '[contenteditable]', function() {
    // console.log('found focus ', $(this).text())
})
// .on('blur keyup paste input', '[contenteditable]', function() {
//     console.log('key up focus ', $(this).text())
// })
.on('blur', '[contenteditable]', function(){
  var id =  Util.getNumberFromText($(this).attr('id'));
  console.log('onblur ', $(this).text(), id);
  LabelCard.storedData[id]['label'] = $(this).text();
  LabelCard.tempLabels[id] = $(this).text();
  DataTable.userUpdateLabel();
})

}// end of makeCards



LabelCard.updateCardById = function(cardId = 0){
}


LabelCard.stylizeTables = function(containerId = ""){
  $("#"+containerId+" tr:nth-child(1)").css('background', Main.colors.HIGHLIGHT2);
}



}())
