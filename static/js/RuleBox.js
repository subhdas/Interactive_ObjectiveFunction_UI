(function () {

	Rul = {};

	Rul.ruleData = {}
	Rul.ruleIndex = 0
	Rul.setRule = true;



	Rul.makeRuleList = function (containerId = "") {

		if (!Rul.setRule) return;
		if (containerId == "") containerId = "featureEnggPanel"
		$("#" + containerId).empty();

		var htmlStr = ""
		// htmlStr += "<div class ='fullRuleAll' >"

		// get the rules 
		if (ParC.tempDimRules.length > 0) {
			var dims = ParC.tempDimRules[0]
			var ext = ParC.tempDimRules[1]

			
			Rul.ruleData['n_rule_' + Rul.ruleIndex] = {}
			for (var i = 0; i < dims.length; i++) {
				ext[i] = ext[i].map(function (e) {
					console.log('e ', e)
					return +e.toFixed(2);
				});
				Rul.ruleData['n_rule_' + Rul.ruleIndex][dims[i]] = ext[i]
			}
			Rul.ruleIndex += 1;
			Rul.setRule = false;
			setTimeout(() => {
				Rul.setRule = true;
			}, 300);
		}






		if (Object.keys(Rul.ruleData).length == 0) {
			Rul.ruleData = {
				'rule_1': {
					'MPG': [32, 90],
					'Acceleration': [6.5, 8.23],
					'Weight': [2874, 3585],
					'Cyinders': [3, 6],
				},

				'rule_2': {
					'Acceleration': [2.1, 5.3],
					'Cyinders': [5, 7],
				},


				'rule_3': {
					'Weight': [-1, 3402],
					'MPG': [-1, 38],
				},
			}
		}

		for (var item in Rul.ruleData) {
			var dataObj = Rul.ruleData[item];
			htmlStr += "<div class ='fullRuleAll' >"
			htmlStr += "<div class ='ruleName' >" + item + "</div>"
			htmlStr += "<div class ='ruleOneSet' >"

			for (var el in dataObj) {
				htmlStr += "<div class ='ruleRow' >"
				htmlStr += "<span class = 'ruleItems mainFeatRule'>" + el + "</span>";

				if (dataObj[el][0] != -1) {
					htmlStr += "<span class = 'ruleItems ruleNumber'> < </span>";
					htmlStr += "<span class = 'ruleItems ruleNumber'>" + dataObj[el][0] + "</span>";
					htmlStr += "<span class = 'ruleItems ruleNumber'> and  </span>";
					htmlStr += "<span class = 'ruleItems ruleNumber'> >  </span>";
					htmlStr += "<span class = 'ruleItems ruleNumber'>" + dataObj[el][1] + "</span>";
				} else {
					htmlStr += "<span class = 'ruleItems ruleNumber'> = </span>";
					htmlStr += "<span class = 'ruleItems ruleNumber'>" + dataObj[el][1] + "</span>";
				}
				htmlStr += "</div>"

			}
			htmlStr += "</div>"
			htmlStr += "</div>"


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
		$('.ruleName').css('height', '25px');

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


		$(".fullRuleAll").on('mouseover', function (e) {
			$(this).css('background', 'lightgray')
		})

		$(".fullRuleAll").on('mouseout', function (e) {
			$(this).css('background', '')
		})

	}



})()