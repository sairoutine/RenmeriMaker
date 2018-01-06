'use strict';
var core = require('./hakurei').core;
var util = require('./hakurei').util;
var SceneTalk = require('./scene/talk');
var SceneLoading = require('./scene/loading');

var Game = function(canvas) {
	core.apply(this, arguments);
};
util.inherit(Game, core);

Game.prototype.init = function () {
	core.prototype.init.apply(this, arguments);
	this.addScene("loading", new SceneLoading(this));
	this.addScene("talk", new SceneTalk(this));
	//this.addScene("end", new SceneEnd(this));
	this.changeScene("loading");
};

module.exports = Game;
