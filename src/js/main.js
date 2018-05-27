'use strict';
var Game = require('./game');

var game;

window.onload = function() {
	var mainCanvas = document.getElementById('mainCanvas');

	// サーバーサイドからのデータ
	var options = window.config;

	game = new Game(mainCanvas, options);

	game.setupEvents();

	// reset keyboard binding
	window.onkeydown = function(e) {};
	window.onkeyup   = function(e) {};

	game.init();
	game.startRun();

	window.game = game;
};

// for electron
if(window.require) {
	window.require('electron').webFrame.setVisualZoomLevelLimits(1,1); // unable to zoom
}
