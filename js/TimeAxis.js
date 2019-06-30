var timeChart = echarts.init(document.getElementById('timeAxis'));
var time_option;


d3.csv("data/infoOfBirds_new_sorted_rep.csv", function (csv) {
        // console.log(csv);
        MyFunction(csv);
//
        time_option = {
//                        backgroundColor: '#404a59',
//                        color: [
//                                '#dd4444'
//                        ],
                title: {
                        text: '鸟类年变化表'
                },
                legend: {
                        data: ['Date', 'Class', 'Name']
                },
                tooltip: {
                        position: 'top',
                        formatter: function (params) {
                                return params.value[0] + ' , ' + params.value[1];
                        }
                },

                xAxis: {
                        type: 'category',
                        data: TimeDate
                },
                yAxis: {
                        type: 'value',
                        min: 0,
                        max: 86400,
                        splitNumber: 10,
                        inverse: true,
                        axisLabel: {
                                formatter: function (d) {
                                        var h = checkDoubleNum(Math.floor(d / 3600));
                                        var m = checkDoubleNum(Math.floor((d - h * 3600) / 60));
                                        var s = checkDoubleNum(d - h * 3600 - m * 60);
                                        return h + ":" + m + ":" + s;
                                }
                        },
                        show: true
                },
                dataZoom: {
                        type: 'slider',
                        showDetail: false
                },

//                        visualMap: [
//
//                                {
//                                        show: false,
//                                        inRange: {
//                                                symbolSize: [50]
//                                        },
//                                        outOfRange: {
//                                                symbolSize: [60]
//                                        }
//                                }
//                        ],

                series: [
//
                        {
                                name: 'photos',
                                type: 'scatter',
                                data: birds
                        },
                ]

        };

        timeChart.on('click', function (params) {

                // console.log(params);

                $('#timeAxis').magnificPopup({
                        items: {
                                src: '.' + params.data.value[2],
                                title: params.data.name + "<br>拍摄时间：" + params.data.value[3]
                        },
                        type: 'image', // this is default type
                });
        });

        $(window).resize(function (e) {
                timeChart.resize();
        });
        timeChart.setOption(time_option);

});

var TimeDate = [];
// var Path = [];
var Class = [];
var birdName = [];
var birdData = [];

var birds = [];

function MyFunction(data) {


        for (var i = 0; i < data.length; i++) {
                birdName.push(data[i].name);
                // Path.push(String(data[i].path));
                // Class.push(data[i].class);

                var date = new Date(data[i].timestamp);
                var xstr = date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate();
                var yval = date.getHours() * 3600 + date.getMinutes() * 60 + date.getSeconds();
                var Path = data[i].path.toString();
                var path_small = Path.replace('birdPictures','birdPicture1s');

                TimeDate.push(xstr);
                birdData.push([xstr, yval, Path]);

                birds.push({
                        value: [xstr, yval, Path, data[i].timestamp],
                        symbol: 'image:/' + path_small.toString(),
                        symbolSize: [50, 50],
                        name: data[i].name
                });
        }
}

function checkDoubleNum(d) {
        if (d < 10) {
                return "0" + d;
        } else {
                return d.toString();
        }
}

//                console.log(birdName);
// console.log(birdData);
//                console.log(Class);
//                console.log(TimeDate);
