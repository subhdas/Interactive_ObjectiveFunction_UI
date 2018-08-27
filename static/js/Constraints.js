(function () {


    Cons = {};
    Cons.typeConstraints = {
      'COMPOSITIONAL' : {
        'Items-In-Same-Label': {
          'Add' : true,
        },
        'Similar-Items-In-Same-Label' :{},
        'Dissimilar-Items-In-Diff-Label' : {}
      },
      'QUALITATIVE' : {
        'Similar-Features-In-Same-Label': {},
        'Follow-Feature-Weights' :{
          'Add' : true,
        },
        'Same-Range-Features-In-Same-label' : {}
      },
      'PREDICTIVE' : {
        'Interacted-Items-Correctly-Predicted': {
          'Add' : true,
        },
        'Critical-Items-Correctly-Predicted' :{
          'Add' : true,
        },
        'Number-Items-Correctly-Predicted' : {}
      },
      'QUANTITATIVE' : {
        'Precision-Score': {},
        'Accuracy' :{},
        'Recall' : {},
        'Cross-Val-Score' : {},
      },
      'GENERALIZATION' : {
        'Number-Label-Correct-HoldOut-Data': {},
        'Critical-Data-Correct-HoldOut-Data' :{},
        'Cross-Val-Score-HoldOut-Data' : {}
      },
    }


    Cons.makeConsDivs = function(){
      console.log('Cons is ', Cons.typeConstraints)

    }



})();
