(function () {

	Rul = {};

	Rul.ruleData = {}
	Rul.ruleIndex = 0
	Rul.setRule = true;
	Rul.brushPast = false;
	Rul.tempRuleName = [];
	Rul.tempRuleMapping = {}

	Rul.addIcons = function(containerId = ''){
		 if (containerId == "") containerId = "ruleHeaderId";
		 $("#" + containerId).empty();

		 var htmlStr = "<div class = 'ruleHeadTitle' > Rule Panel </div>";
		 htmlStr += "<div class = 'ruleHeadButton' ></div>";

		 $("#" + containerId).append(htmlStr);

		 $(".ruleHeadTitle").css('width', '100%')
		 $(".ruleHeadTitle").css('font-size', '1.5em')




		 htmlStr = "<button id='resetRuleDataBtnId' class='resetRuleDataBtn mdl-button mdl-js-button mdl-button--icon mdl-button--colored'>"
		 htmlStr += "<i class='material-icons'>settings_backup_restore</i></button>";

		 $(".ruleHeadButton").append(htmlStr);

		 $(".ruleHeadButton").css('display', 'flex')
		 $(".ruleHeadButton").css('padding', '10px')
		 $(".ruleHeadButton").css('align-items', 'center')
		 $(".ruleHeadButton").css('justify-content', 'center')
		 $(".ruleHeadButton").css('height', '20px')


		 //click reset data button
		 $("#resetRuleDataBtnId").on('click', function () {


		 })

	}


	Rul.makeRuleList = function (containerId = "", id = "") {
		// Rul.ruleData = {}

		if (!Rul.setRule) return;
		if (containerId == "") containerId = "featureEnggPanel"
		$("#" + containerId).empty();



		     var htmlStr = "<div class = 'ruleHeader' id = 'ruleHeaderId' ></div>";
		     htmlStr += "<div class = 'ruleContent' id = 'ruleContentId' ></div>";
		     $("#" + containerId).append(htmlStr);

		     // css styling
		     $('.ruleHeader').css('display', 'flex');
		     $('.ruleHeader').css('padding', '3px');
		     // $('.featureEngHeader').css('margin', '5px');
		     $('.ruleHeader').css('width', '100%');
		     $('.ruleHeader').css('height', '35px');
		     $('.ruleHeader').css('border-bottom', '1px dotted lightgray');

		     $('.ruleContent').css('display', 'flex');
		     $('.ruleContent').css('padding', '4px');
		     $('.ruleContent').css('margin', '5px');
		     $('.ruleContent').css('width', '100%');
		     $('.ruleContent').css('height', '100%');
		     $('.ruleContent').css('overflow-X', 'auto');

		     Rul.addIcons('ruleHeaderId');

		// if (Rul.brushPast) {
		// 	// var spl = ''
		// 	Rul.ruleIndex += 1
		// } else {}

		var htmlStr = ""
		// htmlStr += "<div class ='fullRuleAll' >"


		// for (var item in ConsInt.activeConstraints) {
		// 	var elem = ConsInt.activeConstraints[item];
		// 	// console.log('gottent iem ', elem, item);
		// 	var go = true;
		// 	try{
		// 		var key  = Object.keys(elem['input'])
		// 		for(var m =0;m<key.length;m++){
		// 			var lenVal = elem['input'][key[m]].length
		// 		}
		// 		// var lenVal = elem['input']['labelitemsConId_' + item].length
		// 		console.log('lets check ', lenVal, item)
		// 	}catch(e){
		// 		// console.log('contiuing for ', elem, item)
		// 		go = false;
		// 	}
		// 	// var spl = '_' + Rul.ruleIndex
		// 	var spl = ''



		// 	id = elem['usedName'] + spl //item;

		// 	if (lenVal > 0 && go) {
		// 		try {
		// 			var k = Object.keys(Rul.ruleData[id]).length
		// 			console.log('k ', k.length)

		// 			// if(typeof k == 'undefined'){

		// 			// }
		// 			// console.log(' lets find k ', k, item)
		// 		} catch (e) {

		// 		// else {
		// 			// get the rules 
		// 			if (ParC.tempDimRules.length > 0) {
		// 				var dims = ParC.tempDimRules[0]
		// 				var ext = ParC.tempDimRules[1]

		// 				// if (id == "") {
		// 				// 	id = 'n_rule_' + Rul.ruleIndex
		// 				// }
		// 				console.log('lets make rule for ', item)
		// 				Rul.ruleData[id] = {}
		// 				for (var i = 0; i < dims.length; i++) {
		// 					ext[i] = ext[i].map(function (e) {
		// 						return +e.toFixed(2);
		// 					});
		// 					Rul.ruleData[id][dims[i]] = ext[i]
		// 				}
		// 				// Rul.ruleIndex += 1;
		// 				Rul.setRule = false;
		// 				setTimeout(() => {
		// 					Rul.setRule = true;
		// 				}, 300);
		// 			}
		// 		}
		// 	}
		// } //end of for



		if (ParC.tempDimRules.length > 0) {
			var dims = ParC.tempDimRules[0]
			var ext = ParC.tempDimRules[1]

			// if (id == "") {
			// 	id = 'n_rule_' + Rul.ruleIndex
			// }
			var checkin = true;
			try {
				id = DataTable.latestTag[0];
			} catch (e) {
				// return
				checkin = false;
			}
			if (typeof id == 'undefined') checkin = false
			console.log('lets make rule for ', id)
			if (checkin) {
				Rul.ruleData[id] = {}
				for (var i = 0; i < dims.length; i++) {
					ext[i] = ext[i].map(function (e) {
						return +e.toFixed(2);
					});
					Rul.ruleData[id][dims[i]] = ext[i]
				}
				// Rul.ruleIndex += 1;
				Rul.setRule = false;
				setTimeout(() => {
					Rul.setRule = true;
				}, 300);
			}
		}





		// // get the rules 
		// if (ParC.tempDimRules.length > 0) {
		// 	var dims = ParC.tempDimRules[0]
		// 	var ext = ParC.tempDimRules[1]

		// 	if(id==""){
		// 		id = 'n_rule_' + Rul.ruleIndex
		// 	}
		// 	Rul.ruleData[id] = {}
		// 	for (var i = 0; i < dims.length; i++) {
		// 		ext[i] = ext[i].map(function (e) {
		// 			return +e.toFixed(2);
		// 		});
		// 		Rul.ruleData[id][dims[i]] = ext[i]
		// 	}
		// 	Rul.ruleIndex += 1;
		// 	Rul.setRule = false;
		// 	setTimeout(() => {
		// 		Rul.setRule = true;
		// 	}, 300);
		// }






		// if (Object.keys(Rul.ruleData).length == 0) {
		// 	Rul.ruleData = {
		// 		'rule_1': {
		// 			'MPG': [32, 90],
		// 			'Acceleration': [6.5, 8.23],
		// 			'Weight': [2874, 3585],
		// 			'Cyinders': [3, 6],
		// 		},

		// 		'rule_2': {
		// 			'Acceleration': [2.1, 5.3],
		// 			'Cyinders': [5, 7],
		// 		},


		// 		'rule_3': {
		// 			'Weight': [-1, 3402],
		// 			'MPG': [-1, 38],
		// 		},
		// 	}
		// }


		var keysTags = Object.keys(DataTable.tagNameDataId);

		keysTags.push.apply(keysTags,Rul.tempRuleName)
		console.log(' key tags are ', keysTags)
		var ind = 0;
		for (var item in Rul.ruleData) {
			if(keysTags.indexOf(item) == -1) continue; // might need to remoe for custom naming
			var dataObj = Rul.ruleData[item];
			htmlStr += "<div class ='fullRuleAll' parent = "+item+" >"
			htmlStr += "<div class ='ruleName' contenteditable=" + true + " parent=" + item + "  given=" + item + " id='ruleNameId_" + ind + "' >" + item + "</div>"
			htmlStr += "<div class ='ruleOneSet' >"

			for (var el in dataObj) {
				htmlStr += "<div class ='ruleRow' >"
				htmlStr += "<span class = 'ruleItems mainFeatRule'>" + el + "</span>";

				if (dataObj[el][0] != -1) {
					htmlStr += "<span class = 'ruleNumber'> is betweeen </span>";
					htmlStr += "<span class = 'ruleItems ruleNumber'>" + dataObj[el][0] + "</span>";
					htmlStr += "<span class = 'ruleNumber'> and  </span>";
					// htmlStr += "<span class = 'ruleItems ruleNumber'> >  </span>";
					htmlStr += "<span class = 'ruleItems ruleNumber'>" + dataObj[el][1] + "</span>";
				} else {
					htmlStr += "<span class = 'ruleNumber'> = </span>";
					htmlStr += "<span class = 'ruleItems ruleNumber'>" + dataObj[el][1] + "</span>";
				}
				htmlStr += "</div>"

			}
			htmlStr += "</div>"
			htmlStr += "</div>"
			ind += 1;

		}




		$("#" + containerId).append(htmlStr);



		$('.ruleRow').css('display', 'flex');
		$('.ruleRow').css('width', '100%');
		$('.ruleRow').css('height', 'auto');
		$('.ruleRow').css('padding', '3px');
		$('.ruleRow').css('margin-bottom', '5px');
		$('.ruleRow').css('border-bottom', '1px dotted gray');

		$('.fullRuleAll').css('display', 'flex');
		$('.fullRuleAll').css('flex-direction', 'row');
		$('.fullRuleAll').css('padding', '5px');
		$('.fullRuleAll').css('margin', '5px');

		$('.ruleName').css('margin-right', '5px');
		$('.ruleName').css('background', Main.colors.HIGHLIGHT);
		$('.ruleName').css('border-radius', '3px');
		$('.ruleName').css('color', 'white');
		$('.ruleName').css('padding', '4px');
		$('.ruleName').css('height', '50px');
		$('.ruleName').css('width', '75px');

		$('.ruleOneSet').css('display', 'flex');
		$('.ruleOneSet').css('flex-direction', 'column');
		$('.ruleOneSet').css('width', '100%');
		$('.ruleOneSet').css('height', 'auto');
		$('.ruleOneSet').css('padding', '3px');
		$('.ruleOneSet').css('border-left', '1px dotted gray');
		$('.ruleOneSet').css('margin-bottom', '5px');
		// $('.ruleOneSet').css('background', 'lightgray');


		$('.ruleItems').css('padding', '2px')
		$('.mainFeatRule').css('background', Main.colors.HIGHLIGHT2)
		$('.mainFeatRule').css('font-size', '1.1em')
		$('.mainFeatRule').css('padding', '6px')
		$('.mainFeatRule').css('border-radius', '3px')
		$('.mainFeatRule').css('color', 'white')


		$('.ruleNumber').css('font-size', '1.1em')
		$('.ruleNumber').css('padding', '6px')
		$('.ruleNumber').css('border-radius', '3px')
		$('.ruleNumber').css('border', '1px solid ' + Main.colors.HIGHLIGHT2)


		$('.ruleItems').css('font-weight', 'bold')
		$('.ruleItems').css('font-size', '1.3em')



		$(".ruleName").on('keyup', function(e){
			var origTxt = $(this).attr('parent');
			var txt = $(this).text();
			console.log(' txt found on change ', origTxt, txt)

			var ob = Rul.ruleData[origTxt];
			delete Rul.ruleData[origTxt];
			Rul.ruleData[txt] = ob;

			$(this).attr('parent', txt)
			var id =$(this).attr('id')
			setTimeout(() => {
				var newtxt = $("#" + id).text()
				Rul.tempRuleMapping[newtxt] = $("#" + id).attr('given')
				Rul.tempRuleName.push(newtxt)
				Rul.tempRuleName = Util.getUniqueArray(Rul.tempRuleName);
			}, 3000);
		})

		var selector = ".fullRuleAll"
		var selector = ".ruleOneSet"

		$(selector).on('mouseover', function (e) {
			$(this).css('background', 'lightgray');


			// var nam = $(this).attr('parent');
			var nam = $(this).parent().attr('parent');
			console.log(' found naming in parent ', nam, DataTable.tagNameDataId)
			var rowIdList = DataTable.tagNameDataId[nam];
			if(typeof rowIdList == 'undefined'){
				nam = Rul.tempRuleMapping[nam];
				rowIdList = DataTable.tagNameDataId[nam];
			}
			StarM.showOnlyRows(rowIdList,nam);

			// var self = this;
			// var htmlStr = "<div class= 'closeBtnRules'>";
			// htmlStr += "<button id='closeBtnRuleId' title='Remove Rule' class='mdl-button mdl-js-button mdl-button--icon mdl-button--colored' >"
			// htmlStr += "<i class='material-icons'>close</i></button>";
			// htmlStr += "</div>";

			// $("body").append(htmlStr);

			// var pos = $(this).offset();
			// var wid = $(this).width();

			// $('.closeBtnRules').css('display', 'flex')
			// $('.closeBtnRules').css('position', 'absolute')
			// $('.closeBtnRules').css('top', pos.top - 10)
			// $('.closeBtnRules').css('left', pos.left+wid - 20)
			// $('.closeBtnRules').css('height', '20px')
			// $('.closeBtnRules').css('width', '20px')


			// // $('.closeBtnRules').on('mouseover',function(k){
			// // 	// $(this).css('background', 'white')
			// // })

			// // $('.closeBtnRules').on('mouseout', function (k) {
			// // 	// $(this).css('background', '')
			// // })


			// $('.closeBtnRules').on('click', function (k) {
			// 	// $(this).css('background', '')
			// 	$(self).remove();
			// 	console.log('removing it ', self)
			// })

		})

		$(selector).on('mouseout', function (e) {
			$(this).css('background', '')
			$('.closeBtnRules').remove();
			StarM.showAllRows();
		})

		$(selector).on('click', function (e) {
			// var nam = $(this).attr('parent');
			var nam = $(this).parent().attr('parent');
			console.log('removing name ', nam)
			delete Rul.ruleData[nam]
			$(this).parent().remove();

		})

	}



})()