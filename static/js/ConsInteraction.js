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







})();
