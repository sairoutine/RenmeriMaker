'use strict';
var core = require('./hakurei').core;
var util = require('./hakurei').util;
var SceneTalk = require('./scene/talk');
var SceneLoading = require('./scene/loading');
var SceneEnd = require('./scene/end');

var CreateSerifLogic = require('./logic/create_serif');

var Game = function(canvas) {
	core.apply(this, arguments);

	this.serif = null;
};
util.inherit(Game, core);

Game.prototype.init = function () {
	core.prototype.init.apply(this, arguments);

	this.serif = CreateSerifLogic.exec();

	this.addScene("loading", new SceneLoading(this));
	this.addScene("talk", new SceneTalk(this));
	this.addScene("end", new SceneEnd(this));

	this.changeScene("loading");
};

Game.prototype.reload = function () {
	this.audio_loader.stopAllBGM();

	this.init();
};
module.exports = Game;
