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
	this._mode = option.mode;

	// ノベルID (更新の場合)
	this._id = option.id;

	// セリフ
	this.serif = option.script;
};
util.inherit(Game, core);

Game.prototype.init = function () {
	core.prototype.init.apply(this, arguments);

	if (this.isEditMode() || this.isNewMode()) {
		this.serif = CreateSerifLogic.exec();
	}
	else if (this.isShowMode()) {
		this.serif = JSON.parse(this.serif);
	}
	else {
		throw new Error("Illegal game mode");
	}

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
	if (this.isNewMode()) {
		url = "/api/v1/novel/create";
	}
	// 更新
	else if (this.isEditMode()) {
		url = "/api/v1/novel/update/" + this._id;
	}
	else {
		throw new Error("Illegal game mode");
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

Game.prototype.isShowMode = function () {
	return this._mode === "show";
};
Game.prototype.isEditMode = function () {
	return this._mode === "edit";
};
Game.prototype.isNewMode = function () {
	return this._mode === "new";
};




module.exports = Game;
