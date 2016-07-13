"use strict";

import HamiltonCycle from '../hamilton/HamiltonCycle';
import common from '../common';
import '../../css/common.css';
import 'jquery';
import 'bootstrap/dist/css/bootstrap.css';

class customizedHamilton extends HamiltonCycle {
    success(result) {
        alert('You found a hamilton cycle!');
    };
}

var hamiltonCycle;

var handlePhysics = function() {
    var physics = $('#physics').is(':checked');
    hamiltonCycle.setPhysics(physics);
};

var handleSmooth = function() {
    var smooth = $('#smooth').is(':checked');
    hamiltonCycle.setSmooth(smooth);
};

export default function() {
    $('#submitGraph').click(function() {
        var input = common.parseInput($('#MyGraph').val());
        var obj = common.generateGraph(input);
        if (obj.message !== 'success') {
            alert(obj.message);
        } else if (!common.checkConnected(obj.graph)) {
            alert('graph is not connected');
        } else {
            alert('success!');
            console.log(common.graphToRequest(obj.graph));
        }
    });

    $('#physics').click(function() {
        handlePhysics();
    });

    $('#smooth').click(function() {
        handleSmooth();
    });

    $('#visualizeGraph').click(function() {
        var input = common.parseInput($('#MyGraph').val());
        var obj = common.generateGraph(input);
        if (obj.message !== 'success') {
            alert(obj.message);
        } else {
            var container = document.getElementById('problem');
            hamiltonCycle = new customizedHamilton(input[0], input.slice(2), container);
            handlePhysics();
            handleSmooth();
        }
    });
};