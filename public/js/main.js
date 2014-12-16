
window.addEventListener("load", init, false);

function init() {

    var gOpt = document.getElementById('graphoptions');

    gOpt.value = 'Priority';

    gOpt.addEventListener("change", function () {

            $.getJSON("/bug/all", function (data) {
                renderPie(gOpt.value, data);
            });
        }, false);



    /*document.getElementById('cBut').addEventListener("click", function() {
        var newComment = new Object();
        newComment.body = document.getElementById("comment");
        newComment.bugId = currentBugId;
        newComment.author = document.getElementById("user");

        $.ajax({
            type: "POST",
            url: "/comment/create",
            data: JSON.stringify(newComment),
            success: getComments
        });
    });*/

    $.getJSON("/bug/all", function (data) {
        renderPie(gOpt.value, data);
    });

    loadBugList();
}


function getComments(){
    $.ajax({
        type: "GET",
        url: "/comment/pull",
        data: currentBugId,
        success: function(data){
            var dis = document.getElementById('discussion');
            dis.innerHtml = "";
            jquery.each(data, function(index, commentData) {
                    var newComment = createElement("div");
                    newComment.class = "comment";
                    var cAuth = createElement("h1");
                    cAuth.innerhtml = commentData.author;
                    newComment.appendChild(cAuth);
                    var cDate = createElement("h2");
                    cDate.innerhtml = commentData.createData;
                    newComment.appendChild(cDate);
                    var cBody = createElement("p");
                    cBody.innerhtml = commentData.body;
                    newComment.appendChild(cBody);
                    dis.appendChild(newComment);
                }
            );
        }
    });


}

function loadBugList() {
    $('#divBugList').load('/buglist.html', function() {
        $("#divBugList tr").each(function (index) {
            var id = $(this).attr("bugId");
            $(this).click(function() {
                openBugDetails(id);
            });
        });
    });
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

/* * * * * * * * * * * * * * * *\
 * Begin bug detail JavaScript
\* * * * * * * * * * * * * * * */

// Specifies state of detail window
var editModeEnabled;

// Holds the ID of the currently open bug
var currentBugId;

// Store DOM objects as jQuery objects for later usage
var divTwo;
var editButton;
var detailForm;
var tmpSelect;

// Store form elements as jQuery objects for later usage
var details = {
    title: null,
    priority: null,
    status: null,
    assignment: null,
    description: null
}

/**
 * When assigned as an event callback on the change of a dropdown,
 * Resizes the dropdown according to the length of the selected string
 */
function resizeSelect(e) {
    var select = $(e.target);
    var option = select[0][select[0].selectedIndex];
    tmpSelect.html(option.textContent);
    select.width(tmpSelect.width());
}

/**
 * 
 */
function getSelectedValue(select) {
    return select[0][select[0].selectedIndex].textContent;
}

/**
 * Sets detail pane to edit mode
 */
function enableDetailForm() {
    editButton.removeClass('btn-danger');
    editButton.addClass('btn-success');
    editButton.html('Update Bug');

    for(var detail in details) {
        details[detail].removeAttr('disabled','');
    }

    details.priority.removeClass(getSelectedValue(details.priority) + '-priority');
    details.status.removeClass(getSelectedValue(details.status) + '-status');

    details.priority.addClass('form-control');
    details.status.addClass('form-control');

    editModeEnabled = true;
}

/**
 * Sets detail pane to edit mode
 */
function disableDetailForm() {
    editButton.addClass('btn-danger');
    editButton.removeClass('btn-success');
    editButton.html('Edit Bug');

    for(var detail in details) {
        details[detail].attr('disabled','');
    }

    details.priority.addClass(getSelectedValue(details.priority) + '-priority');
    details.status.addClass(getSelectedValue(details.status) + '-status');

    details.priority.removeClass('form-control');
    details.status.removeClass('form-control');

    editModeEnabled = false;
}

// Initialize bug detail pane
function initDetailPane( newDetailForm ) {
    
    // Cache detail pane elements for later usage
    detailForm = $(newDetailForm);
    editButton = detailForm.find('#editButton');
    tmpSelect = detailForm.find('#tmpSelect');

    // Cache form elements for later usage
    details.title		= $( detailForm[0][0] );
    details.assignment	= $( detailForm[0][1] );
    details.priority		= $( detailForm[0][2] );
    details.status		= $( detailForm[0][3] );
    details.description	= $( detailForm[0][5] );

    // Attach event listeners to resize dropdown menus
    details.priority.on('change', resizeSelect);
    details.status.on('change', resizeSelect);
    
    // Disable refreshing of page when the form is submitted
    detailForm.on('submit', function() {
        return false;
    });
    
    // Toggle edit mode
    editButton.on('click', function() {
        if(editModeEnabled) {
            disableDetailForm();
        }
        else {
            enableDetailForm();
        }
    });
    
    // Set detail pane to read-only mode
    disableDetailForm();
    
    // Expose new detail pane
    divTwo.empty();
    divTwo.append(detailForm);

    // Initilize size of dropdown menus
    resizeSelect({target: details.priority});
    resizeSelect({target: details.status});
}

$(document).ready(function() {
    divTwo = $('.div-two');
});

function openBugDetails( bugId ) {
    $.ajax({
        type: 'GET',
        url: '/bug/id/' + bugId,
        dataType: 'html',
        success: initDetailPane
    });

}

/* * * * * * * * * * * * * * *\
 * End bug detail JavaScript
\* * * * * * * * * * * * * * */
