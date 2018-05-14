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

	this.scene_manager.addScene("loading", new SceneLoading(this));
	this.scene_manager.addScene("talk", new SceneTalk(this));
	this.scene_manager.addScene("end", new SceneEnd(this));

	this.scene_manager.changeScene("loading");
};

// ゲームを読み込み直し
Game.prototype.reload = function () {
	this.audio_loader.stopAllBGM();

	this.init();
};

// セーブデータを保存する
Game.prototype.save = function () {
	var serif = JSON.stringify(this.serif);

	serif = encodeURIComponent(serif);

	var http = new XMLHttpRequest();
	var url = "/novel/create";
	var params = "script=" + serif;

	http.open("POST", url, true);
	http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	http.onreadystatechange = function() {//Call a function when the state changes.
		if(http.readyState === 4 && http.status === 200) {
			window.alert("保存しました");
		}
	};
	http.send(params);
};


module.exports = Game;
