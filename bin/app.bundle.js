/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

	import $ from 'jquery';

	var HeadRow = React.createClass({
	    displayName: 'HeadRow',

	    render: function () {
	        return React.createElement(
	            'tr',
	            null,
	            React.createElement(
	                'th',
	                null,
	                'id'
	            ),
	            React.createElement(
	                'th',
	                null,
	                'name'
	            ),
	            React.createElement(
	                'th',
	                null,
	                'N'
	            ),
	            React.createElement(
	                'th',
	                null,
	                'M'
	            ),
	            React.createElement(
	                'th',
	                null,
	                'game'
	            ),
	            React.createElement(
	                'th',
	                null,
	                'console'
	            ),
	            React.createElement(
	                'th',
	                null,
	                'answer'
	            )
	        );
	    }
	});

	var NormalRow = React.createClass({
	    displayName: 'NormalRow',


	    answerTag: function () {
	        if (this.props.answer === true) {
	            var answerLink = '../HamiltonCycle/answer.html' + '?id=p' + this.props.id;
	            return React.createElement(
	                'a',
	                { href: answerLink },
	                'answer'
	            );
	        } else {
	            return '';
	        }
	    },

	    render: function () {
	        var gameLink = '../HamiltonCycle/game.html' + '?id=p' + this.props.id;
	        var consoleLink = '../HamiltonCycle/console.html' + '?id=p' + this.props.id;
	        return React.createElement(
	            'tr',
	            null,
	            React.createElement(
	                'td',
	                null,
	                this.props.id
	            ),
	            React.createElement(
	                'td',
	                null,
	                this.props.name
	            ),
	            React.createElement(
	                'td',
	                null,
	                this.props.N
	            ),
	            React.createElement(
	                'td',
	                null,
	                this.props.M
	            ),
	            React.createElement(
	                'td',
	                null,
	                React.createElement(
	                    'a',
	                    { href: gameLink },
	                    'game'
	                )
	            ),
	            React.createElement(
	                'td',
	                null,
	                React.createElement(
	                    'a',
	                    { href: consoleLink },
	                    'console'
	                )
	            ),
	            React.createElement(
	                'td',
	                null,
	                this.answerTag()
	            )
	        );
	    }
	});

	var MoveButton = React.createClass({
	    displayName: 'MoveButton',

	    render: function () {
	        return React.createElement(
	            'button',
	            { type: 'button', className: 'btn btn-default btn-md', onClick: function () {
	                    this.props.pressCall(this.props.vec);
	                }.bind(this) },
	            React.createElement('span', { className: this.props.icon, 'aria-hidden': 'true' }),
	            ' ',
	            this.props.text
	        );
	    }
	});

	var MainTable = React.createClass({
	    displayName: 'MainTable',

	    getInitialState: function () {
	        return { data: [], pos: 1 };
	    },
	    componentDidMount: function () {
	        $.ajax({
	            url: this.props.url,
	            dataType: 'json',
	            cache: false,
	            success: function (data) {
	                this.setState({ data: data });
	            }.bind(this),
	            error: function (xhr, status, err) {
	                console.error(this.props.url, status, err.toString());
	            }.bind(this)
	        });
	    },
	    pressCall: function (vector) {
	        vector = parseInt(vector);
	        if (this.state.pos + vector <= 0) {
	            return;
	        }
	        this.state.pos += vector;
	        var url = "sample/p" + this.state.pos + ".json";
	        $.ajax({
	            url: url,
	            dataType: 'json',
	            cache: false,
	            success: function (data) {
	                this.setState({ data: data });
	            }.bind(this),
	            error: function (xhr, status, err) {
	                this.state.pos -= vector;
	                console.error(url, status, err.toString());
	            }.bind(this)
	        });
	    },

	    render: function () {
	        var data = this.state.data;
	        return React.createElement(
	            'div',
	            null,
	            React.createElement(
	                'a',
	                { href: 'new.html' },
	                'Submit your graph'
	            ),
	            React.createElement(
	                'table',
	                { className: 'table' },
	                React.createElement(
	                    'thead',
	                    null,
	                    React.createElement(HeadRow, null)
	                ),
	                React.createElement(
	                    'tbody',
	                    null,
	                    data.map(function (row) {
	                        return React.createElement(NormalRow, { id: row.id, name: row.name, N: row.N, M: row.M, answer: row.answer });
	                    })
	                )
	            ),
	            React.createElement(MoveButton, { icon: 'glyphicon glyphicon-menu-left', text: 'Prev', pressCall: this.pressCall, vec: '-1' }),
	            React.createElement(MoveButton, { icon: 'glyphicon glyphicon-menu-right', text: 'Next', pressCall: this.pressCall, vec: '1' })
	        );
	    }
	});

	ReactDOM.render(React.createElement(MainTable, { url: 'sample/p1.json' }), document.getElementById('content'));

/***/ }
/******/ ]);