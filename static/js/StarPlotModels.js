(function(){

    StarM = {}

    StarM.getRandomData = function(){
        var data = [{
                className: 'model1', // optional can be used for styling
                axes: [{
                        axis: "accuracy",
                        value: 13
                    },
                    {
                        axis: "precision",
                        value: 6
                    },
                    {
                        axis: "f1-score",
                        value: 5
                    },
                    // {
                    //     axis: "dexterity",
                    //     value: 9
                    // },
                    // {
                    //     axis: "luck",
                    //     value: 2
                    // }
                ]
            },
            {
                className: 'model2',
                axes: [{
                        axis: "accuracy",
                        value: 0.6
                    },
                    {
                        axis: "precision",
                        value: 0.7
                    },
                    {
                        axis: "f1-score",
                        value: 0.9
                    },
                    // {
                    //     axis: "dexterity",
                    //     value: 13
                    // },
                    // {
                    //     axis: "luck",
                    //     value: 9
                    // }
                ]
            }
        ];

        function randomDataset() {
            return data.map(function (d) {
                return {
                    className: d.className,
                    axes: d.axes.map(function (axis) {
                        return {
                            axis: axis.axis,
                            value: Math.ceil(Math.random() * 10)
                        };
                    })
                };
            });
        }

        return randomDataset();
    }

    StarM.makeStarPlot = function(containerId = ""){

        RadarChart.defaultConfig.color = function () {};
        RadarChart.defaultConfig.radius = 3;
        RadarChart.defaultConfig.w = 400;
        RadarChart.defaultConfig.h = 200;

        if (containerId == "") containerId = "modelExplorePanel"
        $("#"+containerId).empty();


        // make the svg
        var chart = RadarChart.chart();
        var cfg = chart.config(); // retrieve default config
        var svg = d3.select('#'+containerId).append('svg')
            .attr('class', 'starPlotModelClass')
            .attr('id', 'starPlotModelId')
            .attr('width', cfg.w + cfg.w + 50)
            .attr('height', cfg.h + cfg.h / 4);
        svg.append('g').classed('single', 1).datum(StarM.getRandomData()).call(chart);


        // many radars
        chart.config({
            w: cfg.w / 4,
            h: cfg.h / 4,
            axisText: false,
            levels: 0,
            circles: false
        });
        cfg = chart.config();

        function render() {
            var game = svg.selectAll('g.game').data(
                [
                    StarM.getRandomData(),
                    StarM.getRandomData(),
                ]
            );
            game.enter().append('g').classed('game', 1);
            game
                .attr('transform', function (d, i) {
                    return 'translate(' + ((cfg.w * 4) + 50 + (i * cfg.w)) + ',' + (cfg.h * 1.3) + ')';
                })
                .call(chart);

            setTimeout(render, 1000);
        }
        render();
    }


})()