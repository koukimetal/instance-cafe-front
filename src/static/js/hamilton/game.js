"use strict";

import HamiltonCycle from '../hamilton/HamiltonCycle';
import Clipboard from 'clipboard';
import common from '../common';
import '../../css/common.css';

import 'jquery';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap';

class customizedHamilton extends HamiltonCycle {
    success(result) {
        alert('Congratulation!');
        $('#MyHamilton').val(result.route.join(' '));
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
            var container = document.getElementById('problem');
            hamiltonCycle = new customizedHamilton(data.N, data.V, container, true);
            handlePhysics();
            handleSmooth();
            $('#rawData').val(hamiltonCycle.exportRaw());
        }.bind(this),
        error: function(xhr, status, err) {
            console.error('Failed to get data');
        }.bind(this)
    });
};

export default function() {
    new Clipboard('.copy_btn');

    initialize();

    $('#physics').click(function() {
        handlePhysics();
    });

    $('#smooth').click(function() {
        handleSmooth();
    });
};