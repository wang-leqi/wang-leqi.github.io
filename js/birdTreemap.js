var optionTreemap;
var birdTreemap = echarts.init(document.getElementById('mainDetail'));

var birdColorByYear = new Array();
var birdData = new Array();

d3.csv('data/tabletsForInitial.csv', function (csv) {


        function praseCsvByYear(year) {

                birdColorByYear = new Array();
                birdData = new Array();

                var arr = new Array();

                for(var i = 0; i < csv.length; i++) {

                        var nstr = csv[i]["year_" + year];
                        if(nstr.length == 0) {
                                nstr = "0";
                        }

                        if(parseFloat(nstr) != 0) {

                                arr.push({
                                        num: parseFloat(nstr),
                                        color: csv[i]["colorSeries"],
                                        name: csv[i]["specie"]
                                })
                        }
                }

                arr.sort(function(a, b) {
                        return b.num - a.num;
                });

                for(var i = 0; i < arr.length; i++) {
                        birdData.push({
                                name: arr[i].name,
                                path: arr[i].name,
                                value: arr[i].num,
                        });
                        birdColorByYear.push(arr[i].color);
                }

                return birdData;
        }

        praseCsvByYear(2016);

        // console.log(birdData);
        // console.log(birdColorByYear);

        var formatUtil = echarts.format;

        function getLevelOption() {
                return [
                        {
                                color: birdColorByYear,
                                colorMappingBy: 'index',
                                itemStyle: {
                                        normal: {
                                                borderWidth: 0,
                                                gapWidth: 5
                                        }
                                }
                        },
                        {
                                itemStyle: {
                                        normal: {
                                                gapWidth: 1
                                        }
                                }
                        },
                        {
                                colorSaturation: [0.35, 0.5],
                                itemStyle: {
                                        normal: {
                                                gapWidth: 1,
                                                borderColorSaturation: 0.6
                                        }
                                }
                        }
                ];
        }

        var modes = ['1988', '1998', '2007', '2014', '2015', '2016'];
        birdTreemap.setOption(optionTreemap = {

                legend: {
                        data: modes,
                        selectedMode: 'single',
                        top: 0,
                        itemGap: 5
                },

                tooltip: {
                        formatter: function (info) {
                                var value = info.value;
                                var treePathInfo = info.treePathInfo;
                                var treePath = [];

                                for (var i = 1; i < treePathInfo.length; i++) {
                                        treePath.push(treePathInfo[i].name);
                                }

                                return [
                                        '<div class="tooltip-title">' + formatUtil.encodeHTML(treePath.join('/')) + '</div>',
                                        // 'Disk Usage: ' + formatUtil.addCommas(value) + ' KB',
                                ].join('');
                        }
                },

                series: modes.map(function (mode, idx) {
                        // console.log(mode);

                        return {
                                name: mode,
                                type:'treemap',

                                visibleMin: 0,
                                roam:false,
                                label: {
                                        show: true,
                                        formatter: '{b}'
                                },
                                itemStyle: {
                                        normal: {
                                                borderColor: 'rgba(0, 0, 0, 0)',
                                                // colorAlpha:1
                                        }
                                },
                                levels: getLevelOption(),
                                data: praseCsvByYear(mode)
                        };

                        // var seriesOpt = createSeriesCommon();
                        // seriesOpt.name = mode;
                        // seriesOpt.top = 80;
                        // seriesOpt.visualDimension = idx === 2 ? 2 : null;
                        // seriesOpt.data = buildData(idx, obama_budget_2012);
                        // seriesOpt.levels = getLevelOption(idx);
                        // return seriesOpt;
                })
        });

        $(window).resize(function (e) {
                birdTreemap.resize();
        });

});