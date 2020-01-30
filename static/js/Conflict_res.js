(function () {

    CFR = {};


    //make the UI
    CFR.setupPanel = function (containerId = 'body') {
        console.log('starting to setup CFR')
        let confclass = 'conflictresPanel'
        let htmlstr = "<div class ='" + confclass + "'>"
        htmlstr += "</div>"
        $(containerId).append(htmlstr);
        let pos = $('#rightPanel').position()
        let wid = $('#rightPanel').width()
        $('.' + confclass).css('top', pos.top)
        $('.' + confclass).css('left', pos.left)
        $('.' + confclass).css('width', wid)
        $('.' + confclass).hide();
        $('#cfrBtn').on('click', function (e) {
            e.stopPropagation();
            $('.' + confclass).toggle();
        })
    }

    // find set of conflicts
    CFR.findConflicts = function () {
        let knownCons = ['Critical-Items', 'Same-Label', 'Non-Critical'];
        let actCons = ConsInt.activeConstraints;
        let labelprefix = 'labelitemsConId_'
        for (let item in knownCons) {
            let el = knownCons[item]
            let obj = actCons[el];
            console.log('cfr obj ', item, el, obj, actCons)
            try {
                let ids = obj['input'][labelprefix + el];
                console.log('cfr ids for ', item, ids);
            } catch (e) {
                console.log('cfr make conflict vis error ', e)
                continue;
            }
        }

    }
    CFR.get_data = function () {
        let data = {}
        data['Similarity'] = [{
                'constraint': 'Candidate',
                'input': [3, 45, 14, 21, 100],
                'error': true
            },
            {
                'constraint': 'Critical',
                'input': [18, 32, 49, 54],
                'error': true
            }
        ]

        data['Ignore'] = [{
                'constraint': 'Critical',
                'input': [14, 18, 23, 121],
                'error': true
            },
            {
                'constraint': 'Candidate',
                'input': [3, 10, 15, 98],
                'error': true
            },
            {
                'constraint': 'Similarity',
                'input': [121, 54],
                'error': true
            },
        ]
        return data
    }

    // make the conflict view
    CFR.makeConflictVis = function (containerId = 'conflictresPanel') {
        let data = this.get_data();
        let conflictVisClass = 'confViewClass'
        let btnId = 'btnconfviewId_';
        let res = "close";

        let htmlstr = "<div class ='" + conflictVisClass + "'>"
        for (let item in data) {
            let arrobj = data[item];
            for (let i = 0; i < arrobj.length; i++) {
                let obj = arrobj[i]
                let frstitem = item;
                let secitem = obj['constraint']
                console.log(' lets check in cfr ', item, obj, frstitem, secitem)
                htmlstr += "<div class ='rowconfview'>"
                htmlstr += "<span class ='itemconfview'>" + frstitem + "  </span>"
                htmlstr += "<div class ='btnencdiv'> <div class = 'confsep'> - > </div>"
                htmlstr += "<button parent = "+frstitem+" child = "+secitem+" class='mdl-button mdl-js-button mdl-button--icon mdl-button--colored btnconfview' id='"+btnId + item + "'>"
                htmlstr += "<i class='material-icons'>" + res + "</i> </button>"; // drag_handle
                htmlstr += "<div class = 'confsep' > < - </div>  </div>"
                htmlstr += "<span class ='itemconfviewsec'> " + secitem + " </span>"
                htmlstr += "</div>"
            }

        }
        //styling
        htmlstr += "</div>"
        $('.' + containerId).append(htmlstr);
        $('.btnconfview').css('background', Main.colors.HIGHLIGHT)

        //interactions
        $('.btnconfview').on('click', function(e){
            let frstitem = $(this).attr('parent');
            let secitem = $(this).attr('child');
            let id = $(this).attr('id');
            id = id.replace(btnId, '')
            console.log(' cfr id clicked on btn ', id, frstitem, secitem)
        })


    }



}())