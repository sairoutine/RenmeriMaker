'use strict';
//var m = require('../mithril');
var Game = require('../../game/game');

var Controller = function (args) {
	this.game = null;
};
Controller.prototype.reload = function () {
	this.game.reload();
};
Controller.prototype.save = function () {
	this.game.save();
};
Controller.prototype.runGame = function(element, isInitialized, context) {
	if (!isInitialized) {
		// サーバーサイドからのデータ
		var options = window.config;

		var game = new Game(element, options);

		game.setupEvents();

		// reset keyboard binding
		window.onkeydown = function(e) {};
		window.onkeyup   = function(e) {};

		game.init();
		game.startRun();

		this.game = game;
	}
	else {
		// redraw
		// nothing to do
	}
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
				タイトル：<input type="text" id="title" /><br />
				紹介文：<textarea id="description"></textarea><br />
				背景：<select id="background" onchange={reload}>
					<option>nc138477</option>
					<option>nc14162</option>
					<option selected>nc4527</option>
					<option>nc72006</option>
					<option>nc7951</option>
					<option>nc95621</option>
				</select>
				BGM：<select id="bgm" onchange={reload}>
					<option selected>なし</option>
					<option>nc13447</option>
					<option>nc20349</option>
					<option>nc22928</option>
					<option>nc32144</option>
					<option>nc38444</option>
					<option>nc41740</option>
					<option>nc76949</option>
				</select><br />


				<select id="chara1" onchange={reload}>
					<option value="renko" selected>蓮子</option>
					<option value="merry">メリー</option>
				</select>
				<select id="exp1" onchange={reload}>
					<option value="normal" selected>普通</option>
					<option value="smile">笑</option>
					<option value="cry">泣</option>
					<option value="angry">怒</option>
					<option value="surprised">驚</option>
				</select>
				<input type="text" id="serif1_1" onchange={reload} value="あら奇遇ね" />
				<input type="text" id="serif1_2" onchange={reload} />
				<br />

				<select id="chara2" onchange={reload}>
					<option value="renko">蓮子</option>
					<option value="merry" selected>メリー</option>
				</select>
				<select id="exp2" onchange={reload}>
					<option value="normal">普通</option>
					<option value="smile" selected>笑</option>
					<option value="cry">泣</option>
					<option value="angry">怒</option>
					<option value="surprised">驚</option>
				</select>
				<input type="text" id="serif2_1" onchange={reload} value="こちらこそ" />
				<input type="text" id="serif2_2" onchange={reload} value="蓮子は授業の帰りかしら" />
				<br />

				<select id="chara3" onchange={reload}>
					<option value="renko" selected>蓮子</option>
					<option value="merry">メリー</option>
				</select>
				<select id="exp3" onchange={reload}>
					<option value="normal">普通</option>
					<option value="smile">笑</option>
					<option value="cry">泣</option>
					<option value="angry">怒</option>
					<option value="surprised">驚</option>
				</select>
				<input type="text" id="serif3_1" onchange={reload} value="まぁそんなところよ" />
				<input type="text" id="serif3_2" onchange={reload} />
				<br />

				<select id="chara4" onchange={reload}>
					<option value="renko" selected>蓮子</option>
					<option value="merry">メリー</option>
				</select>
				<select id="exp4" onchange={reload}>
					<option value="normal">普通</option>
					<option value="smile" selected>笑</option>
					<option value="cry">泣</option>
					<option value="angry">怒</option>
					<option value="surprised">驚</option>
				</select>
				<input type="text" id="serif4_1" onchange={reload} value="このあとお茶でもいかがかしら？" />
				<input type="text" id="serif4_2" onchange={reload} />
				<br />

				<select id="chara5" onchange={reload}>
					<option value="renko">蓮子</option>
					<option value="merry" selected>メリー</option>
				</select>
				<select id="exp5" onchange={reload}>
					<option value="normal">普通</option>
					<option value="smile" selected>笑</option>
					<option value="cry">泣</option>
					<option value="angry">怒</option>
					<option value="surprised">驚</option>
				</select>
				<input type="text" id="serif5_1" onchange={reload} value="あら、ぜひ" />
				<input type="text" id="serif5_2" onchange={reload} />
				<br />

				<input type="button" value="リロード" onclick={reload} />
				<input type="button" value="セーブ" onclick={save} />
				<br />
			</div>
		</div>;
	}
};

