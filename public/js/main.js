
window.addEventListener("load", init, false);

function init() {

    var gOpt = document.getElementById('graphoptions');

    gOpt.value = 'Priority';

    gOpt.addEventListener("change", function () {

            $.getJSON("/bug/all", function (data) {
                renderPie(gOpt.value, data);
            });
        }, false);

    $.getJSON("/bug/all", function (data) {
        renderPie(gOpt.value, data);
    });

/*
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", "chart", false );
    xmlHttp.send( null );
    renderPie(gOpt.value, JSON.parse(xmlHttp.responseText));
    */

}


function renderPie(type, json) {
    var names;
    if(type == 'Priority')
        names = ['High', 'Medium', 'Low'];
    else if(type == 'Status')
        names = ['New', 'Assigned', 'Completed'];

    var holes = [0,0,0];
    var total = 0;
    for (var bugitem in json) {
        total++;
        switch(bugitem.priority){
            case names[0]:
                holes[0]++;
                break;
            case names[1]:
                holes[1]++;
                break;
            case names[2]:
                holes[2]++;
                break;
        }
    }
    $('#graph').highcharts({
        title: {
            text: 'Bugs by Priority'
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b>: {point.percentage:.1f} %'
                }
            }
        },
        series: [{
            type: 'pie',
            name: 'Percent of bugs',
            data: [
                [names[0], holes[0]/total],
                [names[1], holes[1]/total],
                [names[2], holes[2]/total]
            ]}]
    });
}

