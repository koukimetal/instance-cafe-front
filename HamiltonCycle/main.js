"use strict";
//TODO select multi edge
//WISH show degree
var HamiltonCycle = function (N, M) {
    this.N = N;
    this.nodes = this.makeNodes(N);
    this.edges = this.makeEdges(this.makeRandomEdge(N, M));
    this.container = document.getElementById('problem');
    this.data = {
        nodes: this.nodes,
        edges: this.edges
    };
    var options = {};

    this.HEAD_NODE = '#ffff99';
    this.SELECTED_NODE = '#ffcccc';
    this.SELECTED_EDGE = '#ff3232';

    this.permutation = [];
    this.visited = new Set();
    this.finished = false;

    this.network = new vis.Network(this.container, this.data, options);
    this.network.on("doubleClick", function (params) {
        console.log(params);
        if (params.nodes.length == 0 || this.finished) {
            return;
        }
        var id = params.nodes[0];
        this.handleDoubleClicked(id, params.edges);
    }.bind(this));
};

HamiltonCycle.prototype.makeNodes = function(N) {
    var nodes = new Array(N);
    for (var i = 0; i < N; i++) {
        nodes[i] = {id: i, label: i};
    }
    return new vis.DataSet(nodes);
};

HamiltonCycle.prototype.makeEdges = function(E) {
    var edges = new Array(E.length/2);
    for (var i = 0; i < E.length; i += 2) {
        edges[i/2] = {id: i/2, from: E[i], to: E[i+1]};
    }
    return new vis.DataSet(edges);
};

HamiltonCycle.prototype.getRandomInt = function(min, max) {
    return Math.floor( Math.random() * (max - min + 1) ) + min;
};

HamiltonCycle.prototype.shuffle = function(array) {
    for (var i = 0; i < array.length; i++) {
        var p = this.getRandomInt(i, array.length - 1);
        var a = array[i];
        array[i] = array[p];
        array[p] = a;
    }
};

HamiltonCycle.prototype.getRandomPerm = function(N) {
    var perm = new Array(N);
    for (var i = 0; i < N; i++) {
        perm[i] = i;
    }
    this.shuffle(perm);
    return perm;
};

HamiltonCycle.prototype.makeRandomEdge = function(N, M) {
    if (M < N || N < 3) {
        console.log("impossible");
        return;
    }

    var res = new Array(2 * M);
    var ecnt = 0;

    var connect = new Array(N);
    //Ensure hamilton cycle
    var perm = this.getRandomPerm(N);
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
    this.shuffle(eperm);

    for (i = 0; i < eperm.length && ecnt < M; i++) {
        a = eperm[i][0];
        b = eperm[i][1];
        if (connect[a] == b || connect[b] == a) {
            continue;
        }

        console.log(a, b);
        res[2*ecnt] = a;
        res[2*ecnt + 1] = b;
        ecnt++;
    }
    return res;
};

HamiltonCycle.prototype.handleDoubleClicked = function(id, neighborIds) {
    if (!this.visited.has(id)) {
        //advance
        if (this.visited.size == 0) {
            this.visit(-1, id, null);
        } else {
            var from = this.permutation[this.permutation.length - 1];
            this.visit(from, id, neighborIds);
        }
    } else if (id === this.permutation[this.permutation.length - 1]) {
        //withdraw
        if (this.visited.size == 1) {
            this.withdraw(-1, id, null);
        } else {
            from = this.permutation[this.permutation.length - 2];
            this.withdraw(from, id, neighborIds);
        }
    } else if (id === this.permutation[0] && this.visited.size === this.N) {
        //Final step
        from = this.permutation[this.permutation.length - 1];
        this.visit(from, id, neighborIds);
        if (this.permutation.length === this.N + 1) {
            this.finished = true;
            alert('Congratulation!');
        }
    }
};

HamiltonCycle.prototype.visit = function(prevId, id, neighborIds) {
    var visitable = false;
    var edgeId = -1;
    if (prevId === -1) {
        visitable = true;
    } else {
        edgeId = this.getEdge(neighborIds, prevId, id);
        if (edgeId >= 0) {
            visitable = true;
        }
    }

    if (!visitable) {
        return;
    }

    //Changing node color
    this.nodes.update(
        [
            {
                id: id,
                color: {
                    background: this.HEAD_NODE,
                    highlight: {
                        background: this.HEAD_NODE
                    }
                }
            }
        ]
    );
    if (prevId >= 0) {
        //Changing edge color
        this.edges.update([
            {
                id: edgeId,
                color: {
                    color: this.SELECTED_EDGE,
                    highlight: this.SELECTED_EDGE
                }
            }
        ]);

        this.nodes.update(
            [
                {
                    id: prevId,
                    color: {
                        background: this.SELECTED_NODE,
                        highlight: {
                            background: this.SELECTED_NODE
                        }
                    }
                }
            ]
        );
    }
    this.visited.add(id);
    this.permutation.push(id);
};

HamiltonCycle.prototype.withdraw = function(prevId, id, neighborIds) {
    this.nodes.update(
        [
            {
                id: id,
                color: null
            }
        ]
    );
    if (prevId >= 0) {
        var edgeId = this.getEdge(neighborIds, prevId, id);
        this.edges.update([
            {
                id: edgeId,
                color: null
            }
        ]);
        this.nodes.update(
            [
                {
                    id: prevId,
                    color: {
                        background: this.HEAD_NODE,
                        highlight: {
                            background: this.HEAD_NODE
                        }
                    }
                }
            ]
        );
    }
    this.visited.delete(id);
    this.permutation.pop();
};

HamiltonCycle.prototype.getEdge = function(neighborIds, fId, tId) {
    for (var i = 0; i < neighborIds.length; i++) {
        var edgeId = neighborIds[i];
        var edge = this.edges.get(edgeId);

        if (edge.from == fId && edge.to == tId || edge.from == tId && edge.to == fId) {
            return edge.id;
        }
    }
    return -1;
};

var hamiltonCycle = new HamiltonCycle(10, 10);

$(function(){
    $('#generate').click(function() {
        var N = $('#vertex').val();
        var operator = $('#operator').val();
        var edge = $('#edge').val();
        var M = 0;
        if (operator === 'plus') {
            M = N + edge;
        } else if (operator === 'multi') {
            M = N * edge;
        }
        M = Math.floor(M);
        hamiltonCycle = new HamiltonCycle(N, M);
    });
});

