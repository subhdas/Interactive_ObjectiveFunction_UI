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
        console.log('numeric data is ', dataCopy)
        return dataCopy;
    }

    Scat.showScatterView = function () {
        Main.tabelViewMode = false;
        $("#tableContent").hide();
        $("#scatContent").show();

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

            var svg = d3.select("#" + containerId).append("svg")
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

            var cell = svg.selectAll(".cell")
                .data(cross(traits, traits))
                .enter().append("g")
                .attr("class", "cell")
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
                    .attr("cx", function (d) {
                        return x(d[p.x]);
                    })
                    .attr("cy", function (d) {
                        return y(d[p.y]);
                    })
                    .attr("r", 4)
                    .style("fill", function (d) {
                        return color(d[categorical]);
                    });
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