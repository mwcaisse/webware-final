
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

    //load up dem bugs
    loadBugList();

}

function loadBugList() {
    $('#divBugList').load('/buglist.html', function() {
        $("#divBugList tr").each(function (index) {
            var id = $(this).attr("bugId");
            $(this).click(function() {
                displayBug(id);
            });
        });
    });
}

function displayBug(id) {
    alert("Display bug: " + id)
}


function renderPie(type, json) {
    var names;
    var lookat;
    var title;

    if(type == 'Priority') {
        names = ['High', 'Medium', 'Low'];
        title = "By Priority";
    }
    else if(type == 'Status') {
        names = ['New', 'Assigned', 'Completed'];
        title = "By Status";
    }

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
            text: title
        },
        chart: {
            width: null,
            height: null,
            backgroundColor: null,
            spacingTop: 0,
            spacingBottom: 0,
            maxPadding: 0
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

