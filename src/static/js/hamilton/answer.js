"use strict";

import Clipboard from 'clipboard';
import common from '../common';
import '../../css/common.css';

import 'jquery';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap';


var parser = function(cycle) {
    return cycle.join(' ');
};

var initialize = function() {
    var problem = common.getUrlParameter()['id'];
    if (problem == null) {
        return;
    }
    var basePath = '../../json/hamilton/ans/';
    $.ajax({
        url: basePath + problem + '.json',
        dataType: 'json',
        cache: true,
        success: function(data) {
            $('#answer').val(parser(data));
        }.bind(this),
        error: function(xhr, status, err) {
            console.error('Failed to get data');
        }.bind(this)
    });
};

export default function() {
    new Clipboard('.copy_btn');
    initialize();
}