'use strict';

// 画面に対するウィンドウの余白
var MESSAGE_WINDOW_OUTLINE_MARGIN = 10;

// 喋ってる方のキャラが動く距離
var TALKER_MOVE_PX = 5;

// キャラのサイズ
var SCALE = 0.5;

// 背景 遷移時のトランジション フレーム数
var TRANSITION_COUNT = 100;

// セリフウィンドウの縦の長さ
var MESSAGE_WINDOW_HEIGHT = 100;

// pos_name -> pos number
var LEFT_POS = "left";
var RIGHT_POS = "right";



var Util = require('../hakurei').util;
var base_scene = require('../hakurei').scene.base;

var SerifManager = require('../hakurei').serif_manager;

var CreateDarkerImage = require('../logic/create_darker_image');

var SceneTalk = function(game) {
	base_scene.apply(this, arguments);

	this.serif = new SerifManager();
};

Util.inherit(SceneTalk, base_scene);

SceneTalk.prototype.init = function(){
	base_scene.prototype.init.apply(this, arguments);
	this.serif.init(this.core.serif);
	this.serif.start();

	// 背景遷移時のトランジション
	this.transition_count = 0;

	// シーン遷移前の BGM 止める
	this.core.audio_loader.stopBGM();

	this._afterSerifChanged();
};

SceneTalk.prototype.beforeDraw = function(){
	base_scene.prototype.beforeDraw.apply(this, arguments);

	if (this.isInTransition()) {
		this.transition_count--;

		// トランジションが終わればセリフ送り再開
		if (this.transition_count === 0) {
			this.serif.resumePrintLetter();
		}
	}


	if(this.core.input_manager.isLeftClickPush()) {
		if(this.serif.isEnd()) {
			// 終了
			this.notifySerifEnd();
		}
		else {
			// トランジション中でなければ
			if (!this.isInTransition()) {
				// セリフを送る
				this.serif.next();

				// 背景変更があった
				if (this.serif.isBackgroundChanged()) {
					// トランジション開始
					this.transition_count = TRANSITION_COUNT;

					// トランジション中はセリフ送り中断
					this.serif.pausePrintLetter();
				}

				this._afterSerifChanged();
			}
			else {
				// トランジション終了
				this.transition_count = 0;
				// トランジションが終わればセリフ送り再開
				this.serif.resumePrintLetter();
			}
		}
	}
};

// 画面更新
SceneTalk.prototype.draw = function(){
	base_scene.prototype.draw.apply(this, arguments);
	var ctx = this.core.ctx;

	if (this.isInTransition()) {
		ctx.fillStyle = "white";
		ctx.fillRect(0, 0, this.width, this.height);

		// 背景表示
		ctx.globalAlpha = (TRANSITION_COUNT - this.transition_count) / TRANSITION_COUNT;
		this._showBackground();
		ctx.globalAlpha = 1.0;
	}
	else {
		// 背景表示
		this._showBackground();

		// キャラ表示
		if(this.serif.getCurrentCharaNameByPosition(RIGHT_POS)) {
			this._showRightChara();
		}
		if(this.serif.getCurrentCharaNameByPosition(LEFT_POS)) {
			this._showLeftChara();
		}

		// メッセージウィンドウ表示
		this._showMessageWindow();

		// メッセージ表示
		this._showMessage();
	}
};

// 背景画像表示
SceneTalk.prototype._showBackground = function(){
	var ctx = this.core.ctx;
	var background_name = this.serif.getCurrentBackgroundImageName();
	var background = this.core.image_loader.getImage(background_name);

	var bgWidth = background.width;
	var bgHeight = background.height;

	var scene_aspect = this.width / this.height;
	var bg_aspect = bgWidth / bgHeight;
	var left, top, width, height;

	if(bg_aspect >= scene_aspect) {
		width = this.width;
		height = this.width / bg_aspect;
		top = (this.height - height) / 2;
		left = 0;
	}
	else {
		height = this.height;
		width = this.height * bg_aspect;
		top = 0;
		left = (this.width - width) / 2;
	}

	ctx.drawImage(background,
		left,
		top,
		width,
		height
	);
};

SceneTalk.prototype._showRightChara = function(){
	var ctx = this.core.ctx;
	ctx.save();

	var x = 350;
	var y = 65;

	var right_image = this.core.image_loader.getImage(this.serif.getCurrentCharaNameByPosition(RIGHT_POS) + "_" + this.serif.getCurrentCharaExpressionByPosition(RIGHT_POS));
	if(!this.serif.isCurrentTalkingByPosition(RIGHT_POS)) {
		// 喋ってない方のキャラは暗くなる
		right_image = CreateDarkerImage.exec(right_image, 0.5);
	}
	else {
		x -= TALKER_MOVE_PX;
		y -= TALKER_MOVE_PX;
	}


	ctx.drawImage(right_image,
		x,
		y,
		right_image.width  * SCALE,
		right_image.height * SCALE
	);

	ctx.restore();
};

SceneTalk.prototype._showLeftChara = function(){
	var ctx = this.core.ctx;
	ctx.save();

	var x = -50;
	var y = 65 + 20;

	var left_image = this.core.image_loader.getImage(this.serif.getCurrentCharaNameByPosition(LEFT_POS) + "_" + this.serif.getCurrentCharaExpressionByPosition(LEFT_POS));
	if(!this.serif.isCurrentTalkingByPosition(LEFT_POS)) {
		// 喋ってない方のキャラは暗くなる
		left_image = CreateDarkerImage.exec(left_image, 0.5);
	}
	else {
		x += TALKER_MOVE_PX;
		y -= TALKER_MOVE_PX;
	}


	ctx.drawImage(left_image,
		x,
		y,
		left_image.width  * SCALE,
		left_image.height * SCALE
	);

	ctx.restore();
};

SceneTalk.prototype._showMessageWindow = function(){
	var ctx = this.core.ctx;
	// show message window
	ctx.save();

	ctx.globalAlpha = 0.5;
	ctx.fillStyle = 'rgb( 0, 0, 0 )';
	ctx.fillRect(
		MESSAGE_WINDOW_OUTLINE_MARGIN,
		this.height - 125,
		this.width - MESSAGE_WINDOW_OUTLINE_MARGIN * 2,
		MESSAGE_WINDOW_HEIGHT
	);

	ctx.restore();
};

// セリフ表示
SceneTalk.prototype._showMessage = function() {
	var ctx = this.core.ctx;
	ctx.save();

	// セリフの色
	var font_color = this.serif.getCurrentOption().font_color;
	if(font_color) {
		font_color = Util.hexToRGBString(font_color);
	}
	else {
		font_color = 'rgb(255, 255, 255)';
	}

	ctx.font = "18px 'Migu'";
	ctx.textAlign = 'left';
	ctx.textBaseAlign = 'middle';

	var y;
	// セリフ表示
	var lines = this.serif.getCurrentPrintedSentences();
	if (lines.length) {
		// セリフテキストの y 座標初期位置
		y = this.height - 125 + 40;

		for(var i = 0, len = lines.length; i < len; i++) {
			ctx.fillStyle = 'rgb( 0, 0, 0 )';
			ctx.lineWidth = 4.0;
			ctx.strokeText(lines[i], MESSAGE_WINDOW_OUTLINE_MARGIN * 2 + 20, y); // 1行表示

			ctx.fillStyle = font_color;
			ctx.fillText(lines[i], MESSAGE_WINDOW_OUTLINE_MARGIN * 2 + 20, y); // 1行表示

			y+= 30;
		}
	}

	ctx.restore();
};


SceneTalk.prototype._afterSerifChanged = function() {
	while (this.serif.getCurrentMaxLengthLetters() === 0) {
		// BGM 再生
		if (this.serif.getCurrentOption().bgm) {
			this.core.audio_loader.playBGM(this.serif.getCurrentOption().bgm);
		}

		this.serif.next();
	}
};

// 立ち絵＆セリフ終了後
SceneTalk.prototype.notifySerifEnd = function() {
	// フェードアウトする
	this.core.scene_manager.setFadeOut(60);

	this.core.scene_manager.changeScene("end");
};

// 遷移中かどうか
SceneTalk.prototype.isInTransition = function() {
	return this.transition_count ? true : false;
};

module.exports = SceneTalk;
