'use strict';
var core = require('./hakurei').core;
var util = require('./hakurei').util;
var SceneTalk = require('./scene/talk');
var SceneLoading = require('./scene/loading');
var SceneEnd = require('./scene/end');

var CreateSerifLogic = require('./logic/create_serif');

var Game = function(canvas, option) {
	core.apply(this, arguments);

	option = option || {};

	// 新規作成 or 更新
	this._is_new = option.is_new;

	// ノベルID (更新の場合)
	this._id = option.id;

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

	var url;

	// 新規作成
	if (this._is_new) {
		url = "/api/v1/novel/create";
	}
	// 更新
	else {
		url = "/api/v1/novel/update/" + this._id;
	}
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
