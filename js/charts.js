// // -------------------------------------------------------------------
// //  趋势图
// // -------------------------------------------------------------------
//

var option_chart;
var historyCharts = echarts.init(document.getElementById('main'));

d3.csv('./Echarts/历史趋势.csv', function (csv) {
        //console.log(csv);
        convertData(csv);
        option_chart = {
                title: {
                        text: '指数'
                },
                legend: {
                        data: ['面积', 'AQI', '候鸟', '留鸟', '气温']
                },
                grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: false
                },
                toolbox: {
                        feature: {
                                saveAsImage: {}
                        }
                },
                xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: year,

                },
                yAxis: {
                        type: 'value',
                        axisLine:{
                                lineStyle:{
                                        color:"#000"
                                }
                        },
                        splitLine:{
                                show: false
                        }
                },

                series: [
                        {

                                name: '面积',
                                type:'line',
                                data: area,
                                label: {
                                        normal: {
                                                show: false
                                        },
                                        emphasis: {
                                                show: false
                                        }
                                },
                                itemStyle: {
                                        emphasis: {
                                                borderColor: '#fff',
                                                borderWidth: 1
                                        }
                                }
                        },
                        {
                                name: 'AQI',
                                type:'line',
                                data: aqiarr,
                                label: {
                                        normal: {
                                                show: false
                                        },
                                        emphasis: {
                                                show: false
                                        }
                                },
                                itemStyle: {
                                        emphasis: {
                                                borderColor: '#fff',
                                                borderWidth: 1
                                        }
                                }
                        },
                        {
                                name: '候鸟',
                                type:'line',
                                data: migrant,
                                label: {
                                        normal: {
                                                show: false
                                        },
                                        emphasis: {
                                                show: false
                                        }
                                },
                                itemStyle: {
                                        emphasis: {
                                                borderColor: '#fff',
                                                borderWidth: 1
                                        }
                                }
                        },
                        {
                                name: '留鸟',
                                type:'line',
                                data: resident,
                                label: {
                                        normal: {
                                                show: false
                                        },
                                        emphasis: {
                                                show: false
                                        }
                                },
                                itemStyle: {
                                        emphasis: {
                                                borderColor: '#fff',
                                                borderWidth: 1
                                        }
                                }
                        },
                        {
                                name: '气温',
                                type:'line',
                                data: temperature,
                                label: {
                                        normal: {
                                                show: false
                                        },
                                        emphasis: {
                                                show: false
                                        }
                                },
                                itemStyle: {
                                        emphasis: {
                                                borderColor: '#fff',
                                                borderWidth: 1
                                        }
                                }
                        }

                ],

        };

        historyCharts.setOption(option_chart);
        // historyCharts.resize(size);
        $(window).resize(function(e){
                historyCharts.resize();
        });


});

var year = [];
var area = [];
var aqiarr = [];
var migrant = [];
var resident = [];
var temperature = [];

function convertData(data) {

        for(i = 0; i < data.length; i++){

                year.push(data[i].attribution);
                area.push(checkLength(data[i].Area));
                aqiarr.push(checkLength(data[i].AQI));
                migrant.push(checkLength(data[i].migrantBird));
                resident.push(checkLength(data[i].risidentBird));
                temperature.push(checkLength(data[i].temperature));
        }
        console.log(resident);
}

function checkLength(str) {
        if(str.length == 0) {
                return 0;
        } else {
                return parseFloat(str);
        }
}



//
// d3.csv("../data/infoOfBirds_new_sorted.csv",function(csv){
//         count(csv);
//         console.log(index);
// });
// // var path_index;
// var index = 0;
//
// function count(data){
//         for(i = 0; i < data.length; i++){
//                 if(data[i].path.indexOf(".CR2") == 1) {
//                         index++;
//                 }
//         }
//         return index;
// }
//
