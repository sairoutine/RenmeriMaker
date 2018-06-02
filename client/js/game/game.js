'use strict';
var core = require('./hakurei').core;
var util = require('./hakurei').util;
var SceneTalk = require('./scene/talk');
var SceneLoading = require('./scene/loading');
var SceneEnd = require('./scene/end');


var Game = function(canvas, option) {
	core.apply(this, arguments);

	// セリフ
	this.serif = null;

	this.scene_manager.addScene("loading", new SceneLoading(this));
	this.scene_manager.addScene("talk", new SceneTalk(this));
	this.scene_manager.addScene("end", new SceneEnd(this));
};
util.inherit(Game, core);

Game.prototype.setSerif = function (serif) {
	this.serif = serif;
};

Game.prototype.init = function () {
	this.scene_manager.changeScene("loading");
};

// ゲームを読み込み直し
Game.prototype.reload = function () {
	this.scene_manager.changeScene("talk");
};

module.exports = Game;
