(function () {

    Scat = {};

    Scat.hideScatterView = function () {
        Main.tabelViewMode = true;
        $("#tableContent").show();
        $("#scatContent").hide();

    }

    Scat.filteredScatData = [];

    Scat.prepNumericalData = function () {
        var numericArr = Object.keys(Main.numericalAttributes);
        var dataCopy = Util.deepCopyData(Main.trainData);
        dataCopy.forEach(function (d) {
            for (var item in d) {
                if (numericArr.indexOf(item) == -1 && item != Main.entityNameSecondImp && item != 'id') {
                    delete d[item];
                } else if (item == Main.entityNameSecondImp) {
                    //pass
                } else if (item == 'id') {
                    // console.log(' getting to see id ', d.id)
                    d[item] = +d[item]
                } else {
                    d[item] = +d[item]
                }
            }
        })
        // console.log('numeric data is ', dataCopy)
        return dataCopy;
    }

    Scat.showScatterView = function () {
        if ($('#scatContent').children().length == 0) Scat.makeTheMatrix();
        Main.tabelViewMode = false;
        $("#tableContent").hide();
        $("#scatContent").show();

    }

    Scat.hideSelectedCircle = function (idList) {

        $('.scatterCir').show();
        idList.forEach(function (d, i) {
            idList[i] = +idList[i]
        })
        var data = Main.trainData;
        data.forEach(function (d, i) {
            if (idList.indexOf(+d.id) == -1) {
                $('.scatterCir_' + +d.id).hide();
            }
        })
    }

    Scat.showAllCircle = function () {
        $(".scatterCir").show();
    }

    Scat.makeTheMatrix = function (containerId = "") {
        if (containerId == "") containerId = "scatContent";
        var dataHave = Scat.prepNumericalData();
        // $("#tableContent").hide();

        var wd = $("#" + containerId).css('width');
        wd = Util.getNumberFromText(wd);
        console.log('wd compute ', +wd * 0.5)
        var width = 300, //960
            size = 150,
            padding = 20;

        var x = d3.scale.linear()
            .range([padding / 2, size - padding / 2]);

        var y = d3.scale.linear()
            .range([size - padding / 2, padding / 2]);

        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom")
            .ticks(6);

        var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left")
            .ticks(6);

        var color = d3.scale.category10();

        d3.csv("static/data/flowers.csv", function (error, data) {
            if (error) throw error;
            var categorical = Main.entityNameSecondImp; //"species"
            if (categorical == '0_') {
                var key = Object.keys(Main.numericalAttributes);
                categorical = key[Util.getRandomNumberBetween(0, key.length - 1).toFixed(0)]
            }
            data = dataHave

            var domainByTrait = {},
                traits = d3.keys(data[0]).filter(function (d) {
                    return d !== categorical;
                }),
                n = traits.length;

            traits.forEach(function (trait) {
                domainByTrait[trait] = d3.extent(data, function (d) {
                    return d[trait];
                });
            });

            xAxis.tickSize(size * n);
            yAxis.tickSize(-size * n);

            var brush = d3.svg.brush()
                .x(x)
                .y(y)
                .on("brushstart", brushstart)
                .on("brush", brushmove)
                .on("brushend", brushend);

            var svg = d3.select("#" + containerId)
                .append("svg")
                .attr('class', '.scatMatSvg')
                .attr("width", size * n + padding + 100)
                .attr("height", size * n + padding + 100)
                .append("g")
                .attr("transform", "translate(" + padding + "," + padding / 2 + ")");

            svg.selectAll(".x.axis")
                .data(traits)
                .enter().append("g")
                .attr("class", "x axis")
                .attr("transform", function (d, i) {
                    return "translate(" + (n - i - 1) * size + ",0)";
                })
                .each(function (d) {
                    x.domain(domainByTrait[d]);
                    d3.select(this).call(xAxis);
                });

            svg.selectAll(".y.axis")
                .data(traits)
                .enter().append("g")
                .attr("class", "y axis")
                .attr("transform", function (d, i) {
                    return "translate(0," + i * size + ")";
                })
                .each(function (d) {
                    y.domain(domainByTrait[d]);
                    d3.select(this).call(yAxis);
                });

            var cell = svg.selectAll(".cell_scat")
                .data(cross(traits, traits))
                .enter().append("g")
                .attr("class", "cell_scat")
                .attr("transform", function (d) {
                    return "translate(" + (n - d.i - 1) * size + "," + d.j * size + ")";
                })
                .each(plot);

            // Titles for the diagonal.
            cell.filter(function (d) {
                    return d.i === d.j;
                }).append("text")
                .attr("x", padding)
                .attr("y", padding)
                .attr("dy", ".71em")
                .text(function (d) {
                    return d.x;
                });

            cell.call(brush);

            setTimeout(() => {
                // $(".background").prependTo(".cell");
                // $('.background').css('opacity' ,0)
                // $('.background').css('fill' ,'none')

                $('.cell_scat').each(function (e) {
                    $(this).find('.background').prependTo(this);
                })

            }, 200);

            function plot(p) {
                var cell = d3.select(this);

                x.domain(domainByTrait[p.x]);
                y.domain(domainByTrait[p.y]);

                cell.append("rect")
                    .attr("class", "frame")
                    .attr("x", padding / 2)
                    .attr("y", padding / 2)
                    .attr("width", size - padding)
                    .attr("height", size - padding);

                cell.selectAll("circle")
                    .data(data)
                    .enter().append("circle")
                    .attr('class', function (d) {
                        return 'scatterCir scatterCir_' + d.id
                    })
                    .attr('id', function (d) {
                        return 'scatterCirId_' + d.id
                    })
                    .attr("cx", function (d) {
                        return x(d[p.x]);
                    })
                    .attr("cy", function (d) {
                        return y(d[p.y]);
                    })
                    .attr("r", 4)
                    .style("fill", function (d) {
                        return color(d[categorical]);
                    })
                    .style('z-index', 1000)
                    .on('mouseover', function (d, i) {
                        $(this).css('stroke', 'black')
                        var id = $(this).attr('id');
                        id = Util.getNumberFromText(id);
                        $('.par_Filter_cl').css('opacity', 0.1);
                        $('#par_Filter_Id_' + id).css('opacity', 1);
                        $('#par_Filter_Id_' + id).css('stroke-width', 5);

                        // console.log('mouse over circle ', d,id, i)
                        var e = Main.getDataById(d.id,Main.trainData);
                        showTooltip(e, id);
                    })
                    .on('mouseout', function (d, i) {
                        $(this).css('stroke', 'transparent')

                        var id = $(this).attr('id');
                        id = Util.getNumberFromText(id);
                        $('.par_Filter_cl').css('opacity', 1);
                        $('.par_Filter_cl').css('stroke-width', 1);
                        // console.log('mouse out circle ', id, i)

                        Scat.tipDiv.style("display", "none");

                    })
            }

               function showTooltip (d, idVal) {

                  var disp = $(".dipScat").remove()
                //   console.log('hill tip disp ', disp);

                  Scat.tipDiv = d3
                      .select("body")
                      .append("div")
                      .attr("class", "dipScat")
                      .attr("id", "dipScat_" + idVal);


                  d3.selectAll(".dipScat")
                      .style("position", "absolute")
                      .style("display", "flex")
                      .style("min-width", "80px")
                      .style("height", "auto")
                      .style("background", "none repeat scroll 0 0 #ffffff")
                      .style("border", "1px solid "+ Main.colors.HIGHLIGHT)
                      .style("padding", "3px")
                      .style("text-align", "center");


                  var htmlStr = "<div class = 'tipHullHeader'><span class = 'topHead' > ID : " + d.id + "</span>";
                  htmlStr += "<span> Name : " + d[Main.entityName] + "</span></div>";
                //   htmlStr += "<div class = 'tipHullContent' ><div>Local Coeff : " + Util.getRandomNumberBetween(10, 0).toFixed(4) + "</div>";
                  // htmlStr += "<div class = 'tooltipModelContent' ><div>Origin : " + 2 + "</div>";
                  // htmlStr += "<div class = 'tooltipModelContent' ><div>Cluster : " +  3 + "</div>";
                  // htmlStr += "<div class = 'tooltipModelContent' ><div>MPG : " + 4+ "</div>";

                  Scat.tipDiv
                      .style("left", d3.event.pageX + 35 + "px")
                      .style("top", d3.event.pageY - 75 + "px")
                      .style("display", "flex")
                      .style("flex-direction", "column")
                      .style("align-items", "start")
                      .style("font-size", "0.75em")
                      .style("padding", "4px")
                      .html(htmlStr);

                  $(".topHead").css("font-weight", "bold");

                  $(".tipHullHeader").css("display", "flex");
                  $(".tipHullHeader").css("flex-direction", "column");
                  $(".tipHullHeader").css("align-items", "start");
                  $(".tipHullHeader").css("width", "100%");
                  $(".tipHullHeader").css('background', 'white');
                  $(".tipHullHeader").css("padding", "4px");

                  $(".tipHullContent").css("display", "flex");
                  $(".tipHullContent").css("flex-direction", "column");
                  $(".tipHullContent").css("align-items", "start");
                  $(".tipHullContent").css("width", "100%");
                  $(".tipHullContent").css("background", "transparent");
                  // $(".tooltipModelContent").css("padding", "4px");

                  setTimeout(() => {
                      $("#dipScat_" + idVal).show();
                  }, 100);

              }

            var brushCell;

            // Clear the previously-active brush, if any.
            function brushstart(p) {
                if (brushCell !== this) {
                    d3.select(brushCell).call(brush.clear());
                    x.domain(domainByTrait[p.x]);
                    y.domain(domainByTrait[p.y]);
                    brushCell = this;
                }
            }

            // Highlight the selected circles.
            function brushmove(p) {
                var e = brush.extent();
                Scat.filteredScatData = [];
                ConP.selectedRowsCons = {}

                svg.selectAll("circle").classed("hidden", function (d) {
                    // console.log('d is ', d)
                    var res = e[0][0] > d[p.x] || d[p.x] > e[1][0] ||
                        e[0][1] > d[p.y] || d[p.y] > e[1][1]

                    if (!res) {
                        Scat.filteredScatData.push(+d.id);
                        ConP.selectedRowsCons[d.id] = true;
                    }
                    Scat.filteredScatData = Util.getUniqueArray(Scat.filteredScatData)

                    return res
                });
            }

            // If the brush is empty, select all circles.
            function brushend() {
                if (brush.empty()) svg.selectAll(".hidden").classed("hidden", false);
                $('.par_Filter_cl').css('opacity', 0.1);
                // $('.par_Filter_cl').addClass('hiddenParFilter');

                for (var i = 0; i < Scat.filteredScatData.length; i++) {
                    var id = Scat.filteredScatData[i]
                     $('#par_Filter_Id_' + id).css('opacity', 1);
                     $('#par_Filter_Id_' + id).css('stroke-width', 1);
                    // $('#par_Filter_Id_' + id).removeClass('hiddenParFilter');
                    // $('#par_Filter_Id_' + id).addClass('strongParFilter');

                }
            }
        });

        function cross(a, b) {
            var c = [],
                n = a.length,
                m = b.length,
                i, j;
            for (i = -1; ++i < n;)
                for (j = -1; ++j < m;) c.push({
                    x: a[i],
                    i: i,
                    y: b[j],
                    j: j
                });
            return c;
        }

        setTimeout(function () {
            $("#scatContent line").css('stroke', 'lightgray')
            $("#scatContent line").css('stroke-width', '0.5')
        }, 200)


    }

}())