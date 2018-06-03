'use strict';
var m = require('mithril');
var Game = require('../../game/game');
var ViewModel = require('../vm/new');

var Controller = function (args) {
	this.game = null;

	// csrf token
	this._csrf_token = window.config.csrf;

	this.vm = new ViewModel();
};
Controller.prototype.reload = function () {
	// ゲームのセリフ更新
	this.game.setSerif(this.vm.toGameData());

	// リロード
	this.game.reload();
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
	}
};

// セーブデータを保存する
Controller.prototype.save = function () {
	var data = this.vm.toPostData()


	var api_url = "/api/v1/novel/create";

	var _csrf_token = this._csrf_token;
	m.request({
		method: "POST",
		url: api_url,
		data: data,
		serialize: function(data) {return data},
		config: function (xhr) {
			if (_csrf_token) {
				xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
				xhr.setRequestHeader("X-CSRF-TOKEN", _csrf_token);
			}
		}
	})
	.then(function(result) {
		window.alert("保存しました");
		location.href = "/novel/show/" + result.id;
	})
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




module.exports = Controller;
