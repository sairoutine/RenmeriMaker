'use strict';
var runGame = require('./run_game');
window.onload = function() {
	var mainCanvas = document.getElementById('mainCanvas');

	runGame(mainCanvas);
};

