(function () {

        CFR = {};


        //make the UI
        CFR.setupPanel = function(containerId = 'body'){
            console.log('starting to setup CFR')
            let confclass = 'conflictresPanel'
            let htmlstr = "<div class ='"+confclass+"'>"
            htmlstr += "</div>"
            $(containerId).append(htmlstr);
            let pos = $('#rightPanel').position()
            let wid = $('#rightPanel').width()
            $('.' + confclass).css('top', pos.top)
            $('.' + confclass).css('left', pos.left)
            $('.' + confclass).css('width', wid)
            $('.'+confclass).hide();
            $('#cfrBtn').on('click', function(e){
                e.stopPropagation();            
                $('.' + confclass).toggle();
            })
        }


}())