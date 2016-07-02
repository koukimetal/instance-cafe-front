"use strict";

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

$('#submitGraph').click(function() {
    var text = $('#MyGraph').val();
    var input = text.split(/\s+/);

    input = input.filter(function(val) {
        return val !== "";
    });

    if (check(input)) {
        alert('success');
    }
});