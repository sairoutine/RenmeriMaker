'use strict';
var Game = require('../../game/game');
var ViewModel = require('../vm/common');

var Controller = function (args) {
	this.game = null;

	this.vm = new ViewModel();
	this.load();
};
Controller.prototype.reload = function () {
	// ゲームのセリフ更新
	this.game.setSerif(this.vm.toGameData());

	// リロード
	this.game.reload();
};
Controller.prototype.togglePrivate = function () {
	this.vm.togglePrivate();
};

Controller.prototype.runGame = function(element, isInitialized, context) {
	if (!isInitialized) {
		var game = new Game(element);

		game.setupEvents();

		// reset keyboard binding
		window.onkeydown = function(e) {};
		window.onkeyup   = function(e) {};

		game.init();

		game.startRun();

		this.game = game;
		// ゲームのセリフ更新
		this.game.setSerif(this.vm.toGameData());
	}
	else {
		// NOTE: redraw
		// nothing to do
		// TODO: try to reload game
	}
};
Controller.prototype.delete = function (vdom) {
	for (var i = 0, len = this.vm.vdom.length; i < len; i++) {
		if(this.vm.vdom[i] === vdom) {
			this.vm.vdom.splice(i, 1);
			return true;
		}
	}

	return false;
};
Controller.prototype.up = function (vdom) {
	for (var i = 0, len = this.vm.vdom.length; i < len; i++) {
		if(this.vm.vdom[i] === vdom) {
			// 一番上なのでそれ以上 上には移動できない
			if (i === 0) break;

			this.vm.vdom.splice(i - 1, 2, this.vm.vdom[i], this.vm.vdom[i - 1]);
			return true;
		}
	}

	return false;
};
Controller.prototype.down = function (vdom) {
	for (var i = 0, len = this.vm.vdom.length; i < len; i++) {
		if(this.vm.vdom[i] === vdom) {
			// 一番下なのでそれ以上 下には移動できない
			if (i === this.vm.vdom.length - 1) break;

			this.vm.vdom.splice(i, 2, this.vm.vdom[i + 1], this.vm.vdom[i]);
			return true;
		}
	}

	return false;
};
Controller.prototype.addVdom = function () {
	this.vm.addVdomByCurrentSelectedIndex();
};


Controller.prototype.isShowMode = function () {
	return false;
};
Controller.prototype.isEditMode = function () {
	return false;
};
Controller.prototype.isNewMode = function () {
	return false;
};
Controller.prototype.load = function () {
};
Controller.prototype.save = function () {
};



module.exports = Controller;
