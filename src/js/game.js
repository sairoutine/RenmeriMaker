'use strict';
var core = require('./hakurei').core;
var util = require('./hakurei').util;
var SceneTalk = require('./scene/talk');
var SceneLoading = require('./scene/loading');
var SceneEnd = require('./scene/end');

var CreateSerifLogic = require('./logic/create_serif');

// サンプルセリフ
var Serif= [
	{"background":"nc4527"},
	{"pos":"left","exp":"normal","chara":"merry"	, "option": {"bgm": "nc13447"} },
	{"pos":"right","exp":"normal","chara":"renko"	, "option": {"bgm": "nc13447"},"serif": "こんにちはメリー"},
	{"pos":"left","exp":"normal","chara":"merry"	, "option": {"bgm": "nc13447"} ,"serif": "こんにちは蓮子"},
	{"pos":"right","exp":"smile","chara":"renko"	, "option": {"bgm": "nc13447"} ,"serif": "今日もいい天気ね"},
	{"pos":"left","exp":"smile","chara":"merry"	, "option": {"bgm": "nc13447"}, "serif": "そうね"},
];

var Game = function(canvas) {
	core.apply(this, arguments);

	this.serif = Serif;
};
util.inherit(Game, core);

Game.prototype.init = function () {
	core.prototype.init.apply(this, arguments);

	this.addScene("loading", new SceneLoading(this));
	this.addScene("talk", new SceneTalk(this));
	this.addScene("end", new SceneEnd(this));

	this.changeScene("loading");
};

Game.prototype.reload = function () {
	//this.serif = CreateSerifLogic.exec();
	this.init();

};
module.exports = Game;
