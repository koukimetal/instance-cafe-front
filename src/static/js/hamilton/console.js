"use strict";

import Clipboard from 'clipboard';
import common from '../common';
import '../../css/common.css';

import 'jquery';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap';

var GRAPH;

var initialize = function() {
    var problem = common.getUrlParameter()['id'];
    if (problem == null) {
        return;
    }
    var basePath = '../../json/hamilton/';
    $.ajax({
        url: basePath + problem + '.json',
        dataType: 'json',
        cache: true,
        success: function(data) {
            $('#rawData').val(common.jsonToRaw(data));
            GRAPH = new Array(data.N);
            for (var i = 0; i < data.N; i++) {
                GRAPH[i] = new Set();
            }

            if (data.V !== undefined) {
                for (i = 0; i < data.N; i++) {
                    for (var j = 0; j < data.V[i].length; j++) {
                        GRAPH[i].add(data.V[i][j]);
                    }
                }
            } else {
                for (i = 0; i < data.M; i++) {
                    var a = + data.E[2*i];
                    var b = + data.E[2*i + 1];
                    GRAPH[a].add(b);
                    GRAPH[b].add(a);
                }
            }
        }.bind(this),
        error: function(xhr, status, err) {
            console.error('Failed to get data');
        }.bind(this)
    });
};

var check = function(cycle) {
    if (cycle.length < 4) {
        alert('Give me cycle');
        return false;
    }
    if (cycle[0] !== cycle[GRAPH.length]) {
        alert('Start and end should be same');
        return false;
    }
    var vd = new Array(GRAPH.length);
    vd = vd.map(function() {return 0});
    var v = cycle[0];
    for (var i = 1; i < cycle.length; i++) {
        var nx = cycle[i];
        if (!GRAPH[v].has(nx)) {
            alert('No edge from ' + v + ' to ' + nx);
            return false;
        }
        vd[nx]++;
        if (vd[nx] >= 2) {
            alert("Don't visit same vertex twice");
            return false;
        }
        v = nx;
    }
    return true;
};

export default function() {
    new Clipboard('.copy_btn');
    
    initialize();

    $('#submitAnswer').click(function() {
        var text = $('#MyHamilton').val();
        var input = text.split(/\s+/);
        var cycle = new Array(GRAPH.length + 1);
        var j = 0;
        for (var i = 0; i < input.length && j <= GRAPH.length; i++) {
            var v = input[i];
            if (v !== "") {
                cycle[j] = + v;
                j++;
            }
        }
        if (j !== GRAPH.length + 1) {
            alert('The length of cycle should be N + 1');
            return;
        }
        if (check(cycle)) {
            alert('success!');
        }
    });
}