
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
    if(type == 'Priority') {
            var holes = [0,0,0];
            var total = 0;
            for (var bugitem in json) {
                total++;
                switch(bugitem.priority){
                    case 'High':
                        holes[0]++;
                        break;
                    case 'Medium':
                        holes[1]++;
                        break;
                    case 'Low':
                        holes[2]++;
                        break;
                }
            }
            $('#graph').highcharts({
                title: {
                    text: 'Bugs by Priority'
                },
                series: [{
                    type: 'pie',
                    name: 'Percent of bugs',
                    data: [
                        ['High', holes[0]/total],
                        ['Medium', holes[1]/total],
                        ['Low', holes[2]/total]
                    ]}]
            });
        }
    else if(type == 'Status') {
            var holes = [0,0,0];
            var total = 0;
            for (var bugitem in json) {
                total++;
                switch(bugitem.status){
                    case 'New':
                        holes[0]++;
                        break;
                    case 'Assigned':
                        holes[1]++;
                        break;
                    case 'Completed':
                        holes[2]++;
                        break;
                }
            }
            $('#graph').highcharts({
                title: {
                    text: 'Bugs by Status'
                },
                series: [{
                    type: 'pie',
                    name: 'Percent of bugs',
                    data: [
                        ['New', holes[0]/total],
                        ['Assigned', holes[1]/total],
                        ['Completed', holes[2]/total]
                    ]}]
            });
        }
}