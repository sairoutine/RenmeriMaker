'use strict';
var m = require('mithril');
var Game = require('../../game/game');

var BackgroundVDom = require('./vdom/background');
var BgmVDom = require('./vdom/bgm');
var SerifVDom = require('./vdom/serif');

var DEFAULT_SCRIPT = '[{"define":"background","background":"nc4527"},{"define":"serif","pos":"right","exp":"normal","chara":"renko","serif":"あら奇遇ね\\n"},{"define":"serif","pos":"left","exp":"smile","chara":"merry","serif":"こちらこそ\\n蓮子は授業の帰りかしら"},{"define":"serif","pos":"right","exp":"normal","chara":"renko","serif":"まぁそんなところよ\\n"},{"define":"serif","pos":"right","exp":"smile","chara":"renko","serif":"このあとお茶でもいかがかしら？\\n"},{"define":"serif","pos":"left","exp":"smile","chara":"merry","serif":"あら、ぜひ\\n"}]';

var ViewModel = function (args) {
	this.title = m.prop("");
	this.description = m.prop("");
	this.vdom = [];
	this._string2vdom(DEFAULT_SCRIPT);
};
ViewModel.prototype._string2vdom = function (string) {
	var script_list = JSON.parse(string);

	for (var i = 0, len = script_list.length; i < len; i++) {
		var script = script_list[i];

		if (script.define === "background") {
			this.vdom.push(new BackgroundVDom(script));
		}
		else if (script.define === "bgm") {
			this.vdom.push(new BgmVDom(script));
		}
		else if (script.define === "serif") {
			this.vdom.push(new SerifVDom(script));
		}
		else {
			throw new Error("Illegal script define: " + script.define);
		}
	}
};
ViewModel.prototype._vdom2string = function () {
	return JSON.stringify(this.toGameData());
};


ViewModel.prototype.toGameData = function () {
	var game_data = [];
	for (var i = 0, len = this.vdom.length; i < len; i++) {
		var vdom = this.vdom[i];
		game_data.push(vdom.toGameData());
	}

	return game_data;
};
ViewModel.prototype.toPostData = function () {
	var serif = this._vdom2string();

	return m.route.buildQueryString({
		script: serif,
		title: this.title(),
		description: this.description(),
	});
};




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





module.exports = {
	controller: Controller,
	view: function(ctrl, args) {
		var reload = ctrl.reload.bind(ctrl);
		var save = ctrl.save.bind(ctrl);
		var runGame = ctrl.runGame.bind(ctrl);

		return <div>
			<div id="debug"></div>
			<div id="canvasdiv">
				<canvas id="mainCanvas" width="640" height="480" config={runGame}></canvas>
			</div>
			<hr />
			<div>
				<b>編集</b><br />
				タイトル：<input type="text" value={ctrl.vm.title()} onchange={m.withAttr("value", ctrl.vm.title)} /><br />
				紹介文：<textarea value={ctrl.vm.description()} onchange={m.withAttr("value", ctrl.vm.description)}></textarea><br />

				{(function () {
					var vdomlist = [];
					for (var i = 0, len = ctrl.vm.vdom.length; i < len; i++) {
						var vdom = ctrl.vm.vdom[i];
						vdomlist.push(vdom.toComponent(ctrl));
					}
					return vdomlist;
				})()}

				<input type="button" value="リロード" onclick={reload} />
				<input type="button" value="セーブ" onclick={save} />
				<br />
			</div>
		</div>;
	}
};
