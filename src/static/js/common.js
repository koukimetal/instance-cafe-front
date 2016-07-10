"use strict";

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
        for (var i = 0; i < obj.M; i++) {
            var a = obj.E[2*i];
            var b = obj.E[2*i + 1];
            res[i + 1] = a + ' ' + b;
        }
        return res.join('\n');
    },
    
    parseInput : function(text) {
        var input = text.split(/\s+/);

        input = input.filter(function(val) {
            return val !== "";
        });

        return input;
    }
};