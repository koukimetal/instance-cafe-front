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
    var res = {};
    if (cycle.length < 4) {
        res['message'] = 'Give me cycle';
        res['ok'] = false;
        return res;
    }
    if (cycle[0] !== cycle[GRAPH.length]) {
        res['message'] = 'Start and end should be same';
        res['ok'] = false;
        return res;
    }
    var vd = new Array(GRAPH.length);
    vd = vd.map(function() {return 0});
    var v = cycle[0];
    for (var i = 1; i < cycle.length; i++) {
        var nx = cycle[i];
        if (!GRAPH[v].has(nx)) {
            res['message'] = 'No edge from ' + v + ' to ' + nx;
            res['ok'] = false;
            return res;
        }
        vd[nx]++;
        if (vd[nx] >= 2) {
            res['message'] = "Don't visit same vertex twice";
            res['ok'] = false;
            return res;
        }
        v = nx;
    }
    res['ok'] = true;
    return res;
};

export default function() {
    new Clipboard('.copy_btn');
    
    initialize();

    $('#submitAnswer').click(function() {
        var input = common.parseInput($('#MyHamilton').val());
        var cycle = new Array(GRAPH.length + 1);
        var j = 0;
        for (var i = 0; i < input.length && j <= GRAPH.length; i++) {
            var v = input[i];
            cycle[j] = + v;
            j++;
        }
        if (j !== GRAPH.length + 1) {
            alert('The length of cycle should be N + 1');
            return;
        }
        var result = check(cycle);
        if (result['ok']) {
            alert('success!');
        } else {
            alert(result['message']);
        }
    });
}