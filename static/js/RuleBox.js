(function () {

	Rul = {};

	Rul.ruleData = {}


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

	Rul.makeRuleList = function (containerId = "") {
		if (containerId == "") containerId = "featureEnggPanel"
		$("#" + containerId).empty();

		var htmlStr = ""
		// htmlStr += "<div class ='fullRuleAll' >"

		for (var item in Rul.ruleData) {
			var dataObj = Rul.ruleData[item];
			htmlStr += "<div class ='fullRuleAll' >"
			htmlStr += "<div class ='ruleName' >" + item + "</div>"
			htmlStr += "<div class ='ruleOneSet' >"

			for (var el in dataObj) {
				htmlStr += "<div class ='ruleRow' >"
				htmlStr += "<span class = 'ruleItems mainFeatRule'>" + el + "</span>";

				if (dataObj[el][0] != -1) {
					htmlStr += "<span class = 'ruleItems lessthanRule'> < </span>";
					htmlStr += "<span class = 'ruleItems lessthanRule'>" + dataObj[el][0] + "</span>";
					htmlStr += "<span class = 'ruleItems morethanRule'> and > </span>";
					htmlStr += "<span class = 'ruleItems morethanRule'>" + dataObj[el][1] + "</span>";
				} else {
					htmlStr += "<span class = 'ruleItems morethanRule'> = </span>";
					htmlStr += "<span class = 'ruleItems morethanRule'>" + dataObj[el][1] + "</span>";
				}
				htmlStr += "</div>"

			}
			htmlStr += "</div>"
		htmlStr += "</div>"


		}




		$("#" + containerId).append(htmlStr);


		$("")

		$('.ruleRow').css('display', 'flex');
		$('.ruleRow').css('width', '100%');
		$('.ruleRow').css('height', 'auto');
		$('.ruleRow').css('padding', '3px');
		$('.ruleRow').css('margin-bottom', '5px');

		$('.fullRuleAll').css('display', 'flex');
		$('.fullRuleAll').css('flex-direction', 'row');
		$('.fullRuleAll').css('padding', '5px');
		$('.fullRuleAll').css('margin', '5px');
		
		$('.ruleName').css('margin-right', '5px');

		$('.ruleOneSet').css('display', 'flex');
		$('.ruleOneSet').css('flex-direction', 'column');
		$('.ruleOneSet').css('width', '100%');
		$('.ruleOneSet').css('height', 'auto');
		$('.ruleOneSet').css('padding', '3px');
		$('.ruleOneSet').css('border', '1px dotted gray');
		$('.ruleOneSet').css('margin-bottom', '5px');
		$('.ruleOneSet').css('background', 'lightgray');

	}



})()