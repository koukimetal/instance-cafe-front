"use strict";

import HamiltonCycle from '../hamilton/HamiltonCycle';
import common from '../common';
import '../../css/common.css';
import 'jquery';
import 'bootstrap/dist/css/bootstrap.css';

var check = function(input) {
    var N = + input[0];
    var M = + input[1];
    
    if (N <= 0) {
        alert('N is too small');
        return false;
    }
    if (M > Math.floor((N*(N-1))/2)) {
        alert('M is too big');
        return false;
    }

    if (input.length < 2 + 2*M) {
        alert('Input is too small');
        return false;
    }

    var graph = new Array(N);
    for (var i = 0; i < N; i++) {
        graph[i] = new Set();
    }

    for (i = 0; i < M; i++) {
        var a = + input[2 + 2*i];
        var b = + input[2 + 2*i + 1];
        if (a < 0 || N <= a || b < 0 || N <= b) {
            alert(a + ' ' + b + ' is wrong edge');
            return false;
        }
        if (graph[a].has(b) || graph[b].has(a)) {
            alert('edge ' + a + ' ' + b + ' is duplicated');
            return false;
        }
        graph[a].add(b);
        graph[b].add(a);
    }
    return true;
};

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
        if (check(input)) {
            alert('success');
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
        if (check(input)) {
            var container = document.getElementById('problem');
            hamiltonCycle = new customizedHamilton(input[0], input.slice(2), container);
            handlePhysics();
            handleSmooth();
        }
    });
};