"use strict";

var sizeOfConnectedComponent = function(graph, v, visited) {
    visited[v] = true;
    var size = 1;
    for (let nv of graph[v]) {
        if (!visited[nv]) {
            size += sizeOfConnectedComponent(graph, nv, visited);
        }
    }
    return size;
};

export default {
    getUrlParameter : function() {
        var queries = decodeURIComponent(window.location.search.substring(1));
        var keyValues = queries.split('&');
        var res = {};
        for (var i = 0; i < keyValues.length; i++) {
            var kv = keyValues[i].split('=');
            res[kv[0]] = kv[1];
        }
        return res;
    },

    jsonToRaw : function(obj) {
        var res = new Array(obj.M + 1);
        res[0] = obj.N + ' ' + obj.M;

        if (obj.V !== undefined) {
            var edgeCount = 0;
            for (var i = 0; i < obj.N; i++) {
                for (var j = 0; j < obj.V[i].length; j++) {
                    if (i < obj.V[i][j]) {
                        res[edgeCount + 1] = i + ' ' + obj.V[i][j];
                        edgeCount++;
                    }
                }
            }
            if (edgeCount !== obj.M) {
                console.log('something wrong with edge count');
            }
        } else {
            for (i = 0; i < obj.M; i++) {
                var a = obj.E[2*i];
                var b = obj.E[2*i + 1];
                res[i + 1] = a + ' ' + b;
            }
        }

        return res.join('\n');
    },

    parseInput : function(text) {
        var input = text.split(/\s+/);

        input = input.filter(function(val) {
            return val !== "";
        });

        return input;
    },

    checkConnected : function(graph) {
        var N = graph.length;
        var visited = new Array(N).fill(false);
        var size = sizeOfConnectedComponent(graph, 0, visited);
        return size === N;
    },

    generateGraph : function(input) {
        var res = {
            'message' : 'success'
        };

        var N = Number.parseInt(input[0]);
        var M = Number.parseInt(input[1]);

        if (N <= 0) {
            res['message'] = 'N is too small';
            return res;
        }
        if (M > Math.floor((N*(N-1))/2)) {
            res['message'] = 'M is too big';
            return res;
        }

        if (input.length < 2 + 2*M) {
            res['message'] = 'Input is too small';
            return res;
        }

        var graph = new Array(N);
        for (var i = 0; i < N; i++) {
            graph[i] = new Set();
        }

        for (i = 0; i < M; i++) {
            var a = Number.parseInt(input[2 + 2*i]);
            var b = Number.parseInt(input[2 + 2*i + 1]);
            if (a < 0 || N <= a || b < 0 || N <= b || a === b) {
                res['message'] = 'edge' + a + ' ' + b + ' is wrong';
                return res;
            }
            if (graph[a].has(b) || graph[b].has(a)) {
                res['message'] = 'edge ' + a + ' ' + b + ' is duplicated';
                return res;
            }
            graph[a].add(b);
            graph[b].add(a);
        }
        res['graph'] = graph;
        return res;
    },

    graphToRequest : function(graph) {
        var N = graph.length;
        var V = new Array(N);
        var M = 0;
        for (var i = 0; i < N; i++) {
            V[i] = new Array(graph[i].size);
            var j = 0;
            for (let v of graph[i]) {
                V[i][j] = v;
                j++;
            }
            M += j;
        }
        M = Number.parseInt(M/2);
        return {
            'N' : N,
            'M' : M,
            'V' : V
        };
    }
};