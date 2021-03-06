"use strict";
import HamiltonCycle from '../hamilton/HamiltonCycle';
import Clipboard from 'clipboard';
import '../../css/common.css';
import common from '../common';

import 'jquery';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap';

class customizedHamilton extends HamiltonCycle {
    success(result) {
        alert('Congratulation!');
        $('#MyHamilton').val(result.route.join(' '));
    };
}

var getRandomInt = function(min, max) {
    return Math.floor( Math.random() * (max - min + 1) ) + min;
};

var shuffle = function(array) {
    for (var i = 0; i < array.length; i++) {
        var p = getRandomInt(i, array.length - 1);
        var a = array[i];
        array[i] = array[p];
        array[p] = a;
    }
};

var getRandomPerm = function(N) {
    var perm = new Array(N);
    for (var i = 0; i < N; i++) {
        perm[i] = i;
    }
    shuffle(perm);
    return perm;
};

var makeRandomEdgeEnsuringHamiltonCycle = function(N, M) {
    if (M < N || N < 3) {
        console.log("impossible");
        return;
    }

    var res = new Array(2 * M);
    var ecnt = 0;

    var connect = new Array(N);
    //Ensure hamilton cycle
    var perm = getRandomPerm(N);
    for (var i = 0; i < N; i++) {
        var a = perm[i];
        var b = perm[(i + 1)%N];
        connect[a] = b;
        res[2*ecnt] = a;
        res[2*ecnt + 1] = b;
        ecnt++;
    }

    var eperm = new Array(Math.floor((N*(N-1))/2));
    var tempCnt = 0;
    for (i = 0; i < N; i++) {
        for (var j = i + 1; j < N; j++) {
            eperm[tempCnt++] = [i, j];
        }
    }
    shuffle(eperm);

    for (i = 0; i < eperm.length && ecnt < M; i++) {
        a = eperm[i][0];
        b = eperm[i][1];
        if (connect[a] == b || connect[b] == a) {
            continue;
        }

        res[2*ecnt] = a;
        res[2*ecnt + 1] = b;
        ecnt++;
    }
    return res;
};

var randomHamilton = function(N, M) {
    M = Math.max(N, Math.min(M, Math.floor((N*(N-1))/2)));
    var E = makeRandomEdgeEnsuringHamiltonCycle(N, M);
    var container = document.getElementById('problem');
    return new customizedHamilton(N, E, container);
};

var handlePhysics = function() {
    var physics = $('#physics').is(':checked');
    hamiltonCycle.setPhysics(physics);
};

var handleSmooth = function() {
    var smooth = $('#smooth').is(':checked');
    hamiltonCycle.setSmooth(smooth);
};

var hamiltonCycle;

export default function() {
    hamiltonCycle = randomHamilton(15, 15 * 1.5);

    new Clipboard('.copy_btn');

    $('#rawData').val(hamiltonCycle.exportRaw());

    $('#randomGenerate').click(function() {
        var N = parseInt($('#vertex').val());
        var operator = $('#operator').val();
        var edge = parseFloat($('#edge').val());
        var M = 0;
        if (operator === 'plus') {
            M = N + edge;
        } else if (operator === 'multi') {
            M = N * edge;
        }
        M = Math.floor(M);
        hamiltonCycle = randomHamilton(N, M);
        handlePhysics();
        handleSmooth();
        $('#rawData').val(hamiltonCycle.exportRaw());
    });

    $('#inputGenerate').click(function() {
        var nums = common.parseInput($('#inputGraph').val());
        var N = nums[0];
        var M = nums[1];
        var E = nums.slice(2, 2 + M);

        var container = document.getElementById('problem');
        hamiltonCycle = new customizedHamilton(N, E, container);
        $('#rawData').val(hamiltonCycle.exportRaw());
        handlePhysics();
        handleSmooth();
    });

    $('#physics').click(function() {
        handlePhysics();
    });

    $('#smooth').click(function() {
        handleSmooth();
    });
};