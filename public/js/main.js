
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

    loadBugList();
}


function getComments(){
    $('#div4').load('/comment/pull/'+currentBugId, function() {
        $('#cBut').click(function () {
            var newComment = new Object();
            newComment.body = document.getElementById("comment").value;
            newComment.bugId = currentBugId;
            newComment.author = document.getElementById("user").value;
            document.getElementById("user").value = "";
            document.getElementById("comment").value = "";

            $.ajax({
                type: "POST",
                url: "/comment/create",
                data: JSON.stringify(newComment),
                contentType: "application/json",
                success: getComments
            });
        });
    }, false);
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
var detailState;

const VIEW_BUG = 0;
const EDIT_BUG = 1;
const CREATE_BUG = 2;

// Holds the ID of the currently open bug
var currentBugId;

// Store DOM objects as jQuery objects for later usage
var divThree;
var editButton;
var detailForm;
var tmpSelect;

// Store form elements as jQuery objects for later usage
var details = {
    title: null,
    priority: null,
    status: null,
    assignment: null,
    description: null,
    author: null
}

/**
 * When assigned as an event callback on the change of a dropdown,
 * Resizes the dropdown according to the length of the selected string
 */
function resizeSelect(e) {
    var select = $(e.target);
    var option = select[0][select[0].selectedIndex];
    tmpSelect.html(option.textContent);
    select.width(tmpSelect.width() + (select.hasClass('detail-tag') ? 36 : 6));
}

/**
 * Retrieves the text of the selected option of a given dropdown
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
    editButton.html(detailState === CREATE_BUG ? 'Submit Bug' : 'Update Bug');

    for(var detail in details) {
        if(detailState === CREATE_BUG || detail !== 'author') {
            details[detail].removeAttr('disabled','');
        }
    }

    details.priority.removeClass(getSelectedValue(details.priority) + '-priority');
    details.status.removeClass(getSelectedValue(details.status) + '-status');

    details.priority.addClass('form-control');
    details.status.addClass('form-control');
    document.getElementById("discussion").style.visibility = "hidden";
    document.getElementById("newC").style.visibility = "hidden";
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
    document.getElementById("discussion").style.visibility = "visible";
    document.getElementById("newC").style.visibility = "visible";
}

// Initialize bug detail pane
function initDetailPane( newDetailForm ) {
    
    // Cache detail pane elements for later usage
    detailForm = $(newDetailForm);
    editButton = detailForm.find('#editButton');
    tmpSelect = detailForm.find('#tmpSelect');

    // Cache form elements for later usage
    details.title        = $( detailForm[0][0] );
    details.assignment   = $( detailForm[0][1] );
    details.priority     = $( detailForm[0][2] );
    details.status       = $( detailForm[0][3] );
    details.description  = $( detailForm[0][5] );
    details.author       = $( detailForm[0][6] );
    
    currentBugId = parseInt(detailForm[0][7].value);

    getComments();
    // Attach event listeners to resize dropdown menus
    details.priority.on('change', resizeSelect);
    details.assignment.on('change', resizeSelect);
    details.status.on('change', resizeSelect);
    details.author.on('change', resizeSelect);
    
    // Disable refreshing of page when the form is submitted
    detailForm.on('submit', function() {
        return false;
    });
    
    // Toggle edit mode
    editButton.on('click', function() {
        if(detailState !== VIEW_BUG) {
            if(details.title.value !== '') {
                $.post('/bug/' + (detailState === CREATE_BUG ? 'create' : 'update'), detailForm.serialize());
            }
            detailState = VIEW_BUG;
            disableDetailForm();
        }
        else {
            detailState = EDIT_BUG;
            enableDetailForm();
        }
    });
    
    // Expose new detail pane
    divThree.empty();
    divThree.append(detailForm);

    // Initilize size of dropdown menus
    resizeSelect({target: details.assignment});
    resizeSelect({target: details.priority});
    resizeSelect({target: details.status});
    resizeSelect({target: details.author});
}

function openBugDetails( bugId ) {
    $.get('/view/bug/' + bugId, null, function(newDetailForm) {
        initDetailPane(newDetailForm);
        
        // Set detail pane to read-only mode
        detailState = VIEW_BUG;
        disableDetailForm();
    }, 'html' );

}

function createBug() {
   $.get('/view/create-bug', null, function(newDetailForm) {
        initDetailPane(newDetailForm);
        
        // Set detail pane to create mode
        detailState = CREATE_BUG;
        enableDetailForm();
    }, 'html' );
}

$(document).ready(function() {
    divThree = $('.div-three');

    $('#addBug').click(function() {
        createBug();
    });
});

/* * * * * * * * * * * * * * *\
 * End bug detail JavaScript
\* * * * * * * * * * * * * * */
