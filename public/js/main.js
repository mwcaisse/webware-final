
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


}


function renderPie(type, json) {
    var names;
    var lookat;

    if(type == 'Priority')
        names = ['High', 'Medium', 'Low'];

    else if(type == 'Status')
        names = ['New', 'Assigned', 'Completed'];

    var holes = [0,0,0];
    var total = 0;
    jQuery.each(json, function(index, bugitem) {
        total++;
        if(type == 'Priority')
            lookat = bugitem.priority;
        else if(type == 'Status')
            lookat = bugitem.status;

        switch(lookat){
            case(names[0]):
                holes[0] = holes[0] + 1;
                break;
            case(names[1]):
                holes[1] = holes[1] + 1;
                break;
            case(names[2]):
                holes[2] = holes[2] + 1;
                break;
            default:
                console.log(JSON.stringify(bugitem));
                break;

        }
    });

    $('#graph').highcharts({
        title: {
            text: 'Bugs Overview'
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                dataLabels: {
                    enabled: true
                }
            }
        },
        series: [{
            type: 'pie',
            name: '# of Bugs',
            data: [
                [names[0], holes[0]],
                [names[1], holes[1]],
                [names[2], holes[2]]
            ]}]
    });
}

