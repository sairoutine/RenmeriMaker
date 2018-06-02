'use strict';
var Game = require('./game/game');

window.onload = function() {
	var mainCanvas = document.getElementById('mainCanvas');

	// サーバーサイドからのデータ
	var options = window.config;

	var game = new Game(mainCanvas, options);

	game.setupEvents();

	// reset keyboard binding
	window.onkeydown = function(e) {};
	window.onkeyup   = function(e) {};

	game.init();
	game.startRun();

};
