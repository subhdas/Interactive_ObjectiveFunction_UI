(function () {

    ParC = {}
    ParC.filteredData = [];


    ParC.addIconsFeatureEditor = function (containerId = "") {
        if (containerId == "") containerId = "featureEngHeaderId";
        $("#" + containerId).empty();

    var htmlStr = "<div class = 'featureHeadTitle' > Feature Panel </div>";
    htmlStr += "<div class = 'featureHeadButton' ></div>";

    $("#" + containerId).append(htmlStr);

    $(".featureHeadTitle").css('width', '100%')
    $(".featureHeadTitle").css('font-size', '1.5em')
    htmlStr = "<button id='resetDataBtnId' class='resetDataBtn mdl-button mdl-js-button mdl-button--icon mdl-button--colored'>"
    htmlStr += "<i class='material-icons'>keyboard_return</i></button>";

    $(".featureHeadButton").append(htmlStr);

    //click reset data button
    $("#resetDataBtnId").on('click', function(){
           $(".trTable").show();
           ParC.filteredData = [];
        //    var arr = ['id'];
        //    arr.push.apply(arr, Object.keys(Main.numericalAttributes));
        //    var dataNumeric = Main.getDataByKeys(arr, Main.trainData);
        //    ParC.makeParallelCoordChart('filterContentId', dataNumeric);
        ParC.featureEditorCreate();

    })

    }


    ParC.featureEditorCreate = function (containerId = "") {
        if (containerId == "") containerId = "featureEnggPanel";
        $("#" + containerId).empty();
        // $("#" + containerId).css('height', Main.contentHeightTopBar + 'px');
        // $("#" + containerId).css('height', Main.contentWidthTopBar + 'px');
         //  $("#" + containerId).css('width', '1200px');

        var htmlStr = "<div class = 'featureEngHeader' id = 'featureEngHeaderId' ></div>";
        htmlStr += "<div class = 'featureEngContent' id = 'featureEngContentId' ></div>";
        $("#" + containerId).append(htmlStr);

        // css styling
        $('.featureEngHeader').css('display', 'flex');
        $('.featureEngHeader').css('padding', '3px');
        // $('.featureEngHeader').css('margin', '5px');
        $('.featureEngHeader').css('width', '100%');
        $('.featureEngHeader').css('height', '35px');
        $('.featureEngHeader').css('border-bottom', '1px dotted lightgray');

        $('.featureEngContent').css('display', 'flex');
        $('.featureEngContent').css('padding', '4px');
        $('.featureEngContent').css('margin', '5px');
        $('.featureEngContent').css('width', '100%');
        $('.featureEngContent').css('height', '100%');

        ParC.addIconsFeatureEditor('featureEngHeaderId');


       
        setTimeout(() => {
        var arr = ['id'];
        arr.push.apply(arr, Object.keys(Main.numericalAttributes));


        var dataNumeric = Main.getDataByKeys(arr, Main.trainData);
        ParC.makeParallelCoordChart('featureEngContentId', dataNumeric);
        }, 0);
    
            
    }


    ParC.makeParallelCoordChart = function (containerId = "", data) {
        var parentContainerId = "featureEnggPanel";
        $('#' + containerId).empty();
        // var w = $("#" + containerId).css('width');
        var w = $("#" + containerId).width()
        w = parseFloat(w)
        // var h = $("#" + containerId).css('height');
        var h = $("#" + containerId).height();
        h = parseFloat(h)

        if(w < 120 && h < 120){
            w = 650;
            h = 300;
        }

        console.log('par coord width is ', w, h)

        var margin = {
                top: 30,
                right: 10,
                bottom: 10,
                left: 10
            },
            width = w - margin.left - margin.right,
            height = h - margin.top - margin.bottom;

        var x = d3.scale.ordinal().rangePoints([0, width], 1),
            y = {},
            dragging = {};

        var line = d3.svg.line(),
            axis = d3.svg.axis().orient("left"),
            background,
            foreground;

        var svg = d3.select("#" + containerId).append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


        // Extract the list of dimensions and create a scale for each.
        x.domain(dimensions = d3.keys(data[0]).filter(function (d) {
            return d != "name" && (y[d] = d3.scale.linear()
                .domain(d3.extent(data, function (p) {
                    return +p[d];
                }))
                .range([height, 0]));
        }));

        // Add grey background lines for context.
        background = svg.append("g")
            .attr("class", "background")
            .selectAll("path")
            .data(data)
            .enter().append("path")
            .attr("d", path);

        // Add blue foreground lines for focus.
        foreground = svg.append("g")
            .attr("class", "foreground")
            .selectAll("path")
            .data(data)
            .enter().append("path")
            .attr("d", path);

        // Add a group element for each dimension.
        var g = svg.selectAll(".dimension")
            .data(dimensions)
            .enter().append("g")
            .attr("class", "dimension")
            .attr("transform", function (d) {
                return "translate(" + x(d) + ")";
            })
            .call(d3.behavior.drag()
                .origin(function (d) {
                    return {
                        x: x(d)
                    };
                })
                .on("dragstart", function (d) {
                    dragging[d] = x(d);
                    background.attr("visibility", "hidden");
                })
                .on("drag", function (d) {
                    dragging[d] = Math.min(width, Math.max(0, d3.event.x));
                    foreground.attr("d", path);
                    dimensions.sort(function (a, b) {
                        return position(a) - position(b);
                    });
                    x.domain(dimensions);
                    g.attr("transform", function (d) {
                        return "translate(" + position(d) + ")";
                    })
                })
                .on("dragend", function (d) {
                    delete dragging[d];
                    transition(d3.select(this)).attr("transform", "translate(" + x(d) + ")");
                    transition(foreground).attr("d", path);

                    console.log(' brusing drag ', dragging)
                    background
                        .attr("d", path)
                        .transition()
                        .delay(500)
                        .duration(0)
                        .attr("visibility", null);
                }));

        // Add an axis and title.
        g.append("g")
            .attr("class", "axis")
            .each(function (d) {
                d3.select(this).call(axis.scale(y[d]));
            })
            .append("text")
            .style("text-anchor", "middle")
            .attr("y", -9)
            .text(function (d) {
                return d;
            });

        // Add and store a brush for each axis.
        g.append("g")
            .attr("class", "brush")
            .each(function (d) {
                d3.select(this).call(y[d].brush = d3.svg.brush().y(y[d])
                    .on("brushstart", brushstart)
                    .on("brush", brush));
            })
            .selectAll("rect")
            .attr("x", -8)
            .attr("width", 16);

        function position(d) {
            var v = dragging[d];
            return v == null ? x(d) : v;
        }

        function transition(g) {
            return g.transition().duration(500);
        }

        // Returns the path for a given data point.
        function path(d) {
            return line(dimensions.map(function (p) {
                return [position(p), y[p](d[p])];
            }));
        }

        function brushstart() {
            d3.event.sourceEvent.stopPropagation();
        }

        // Handles a brush event, toggling the display of foreground lines.
        function brush() {
            ParC.filteredData = [];

            var actives = dimensions.filter(function (p) {
                    return !y[p].brush.empty();
                }),
                extents = actives.map(function (p) {
                    return y[p].brush.extent();
                });
            // console.log('active found ', actives)
            foreground.style("display", function (d, k) {

                // // if(k==0) ParC.filteredData = [];
                // var inside = false;
                // actives.every(function(m,n){
                // 	// console.log(' found m n ', m,n, extents)
                // 	if(extents[n][0] <= +d[m] && +d[m] <= extents[n][1]){
                //    		// ParC.filteredData.push(d);
                //    		inside = true;
                //    	}else{
                //    		inside = false
                //    	}
                // })
                // if(inside) ParC.filteredData.push(d)

                ParC.filteredData.push(actives.every(function (p, j) {
                    // console.log(' found d p ', d, p)
                    return extents[j][0] <= d[p] && d[p] <= extents[j][1];
                }) ? d['id'] : -1);


                ParC.filteredData = Util.getUniqueArray(ParC.filteredData);


                // console.log(' final Arr is ', finalArr)
                return actives.every(function (p, i) {
                    // console.log(' found d p ', d, p)
                    return extents[i][0] <= d[p] && d[p] <= extents[i][1];
                }) ? null : "none";
            });

            var ind = ParC.filteredData.indexOf(-1);
            ParC.filteredData.splice(ind, 1);
            setTimeout(function () {
                DataTable.hideSelectedRows(ParC.filteredData);
            }, 1000)
        }
    }

    ParC.textListing = function (containerId = "", data = []) {
        $("#" + containerId).empty();
        var htmlStr = ""
        data.forEach(function (d, i) {
            htmlStr += "<div class = 'textPerItemConstrain' >" + d[Main.entityNameSecondImp] + "</div>";
        })
        $("#" + containerId).append(htmlStr);
        $(".textPerItemConstrain").css('width', '100%')
        $(".textPerItemConstrain").css('height', 'auto')
        $(".textPerItemConstrain").css('background', Main.colors.HIGHLIGHT2)
        $(".textPerItemConstrain").css('padding', '3px')
        $(".textPerItemConstrain").css('border-radius', '3px')
        $(".textPerItemConstrain").css('margin-bottom', '5px')
        $(".textPerItemConstrain").css('margin-left', '5px')
    }

}())