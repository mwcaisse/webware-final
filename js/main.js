var graph = require('graphic');

window.addEventListener("load", init, false);

function init() {

    document.getElementById('graphoptions').value = 'Priority';
    document.getElementById('graphoptions').addEventListener("change", graph.renderPie(document.getElementById('graphoptions').value), false);
}