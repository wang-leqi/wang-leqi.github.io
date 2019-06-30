var option;
var birdCharts = echarts.init(document.getElementById('mainDetail'));

var birdNumByYear;
var birdWidByYear;
var birdColorByYear;
var birdNameByYear;
var birdQuantile;

d3.csv('data/tabletsForInitial.csv', function (csv) {
        // console.log(csv);

        var dataStyle = {
                normal: {
                        label: {show: false},
                        labelLine: {show: false},
                        shadowBlur: 40,
                        shadowColor: 'rgba(40, 40, 40, 0.5)',
                }
        };
        var placeHolderStyle = {
                normal: {
                        color: 'rgba(0,0,0,0)',
                        label: {show: false},
                        labelLine: {show: false}
                },
                emphasis: {
                        color: 'rgba(0,0,0,0)'
                }
        };


        //------------------------------------------------------------
        //------------------------------------------------------------
        function pickBirdsByYear(year) {

                birdNumByYear = new Array();
                birdWidByYear = new Array();
                birdColorByYear = new Array();
                birdNameByYear = new Array();

                var arr = new Array();

                var numarr = new Array();
                var colorarr = new Array();
                var namearr = new Array();

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
                        numarr.push(arr[i].num);
                        colorarr.push(arr[i].color);
                        namearr.push(arr[i].name);
                }

                var qnum = d3.quantile(numarr, .5);
                birdQuantile = qnum;
                // console.log(qnum);
                console.log(Math.floor(49 / qnum));
                var gap = 1.2;

                for(var i = 0; i < numarr.length; i++) {
                        var inum = Math.floor(numarr[i] / qnum);
                        // console.log(namearr[i] + "(" + numarr[i] + "): " + inum + ", " + qnum);
                        if(inum == 0) {
                                birdNumByYear.push(numarr[i]);
                                birdWidByYear.push(gap);
                                birdColorByYear.push(colorarr[i]);
                                birdNameByYear.push(namearr[i]);
                        } else {

                                birdNumByYear.push(qnum);
                                birdWidByYear.push(inum * gap);
                                birdColorByYear.push(colorarr[i]);
                                birdNameByYear.push(namearr[i]);

                                if(numarr[i] % qnum != 0) {
                                        birdNumByYear.push(numarr[i] % qnum);
                                        birdWidByYear.push(gap);
                                        birdColorByYear.push(colorarr[i]);
                                        birdNameByYear.push(namearr[i]);
                                }
                        }

                }
        }

        pickBirdsByYear(2016);
        // console.log(birdNumByYear);
        // console.log(birdColorByYear);
        // console.log(birdNameByYear);


        //------------------------------------------------------------
        //------------------------------------------------------------
        var birdInnerR = 100;
        var seriesArr = new Array();
        for(var i = 0; i < birdNameByYear.length; i++) {

                var obj = {
                        name: birdNameByYear[i],
                        type: 'pie',
                        clockWise: false,
                        radius: [birdInnerR, birdInnerR + birdWidByYear[i]],
                        itemStyle: dataStyle,
                        hoverAnimation: false,
                        itemStyle: {
                                normal: {
                                        color: birdColorByYear[i]
                                }
                        },

                        data: [
                                {
                                        value: birdNumByYear[i],
                                        name: birdNameByYear[i]
                                },
                                {
                                        value: birdQuantile - birdNumByYear[i],
                                        name: 'invisible',
                                        itemStyle: placeHolderStyle
                                }

                        ]
                };

                seriesArr.push(obj);

                birdInnerR += birdWidByYear[i];
        }


        option = {
                // backgroundColor: '#f4f2e3',
                // color: birdColorByYear,
                tooltip: {
                        show: true,
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                legend: {
                        itemGap: 12,

                        top: '87%',
                        data: birdNameByYear
                },
                toolbox: {
                        show: true,
                        feature: {
                                mark: {show: true},
                                dataView: {show: true, readOnly: false},
                                restore: {show: true},
                                saveAsImage: {show: true}
                        }
                },
                series: seriesArr
        };

        birdCharts.setOption(option);

        $(window).resize(function (e) {
                birdCharts.resize();
        });
});