'use strict';
var Game = require('./game/game');

module.exports = function(element, isInitialized, context) {

	if (!isInitialized) {
		// サーバーサイドからのデータ
		var options = window.config;

		var game = new Game(element, options);

		game.setupEvents();

		// reset keyboard binding
		window.onkeydown = function(e) {};
		window.onkeyup   = function(e) {};

		game.init();
		game.startRun();
	}
	else {
		// redraw
		// nothing to do
	}
};
