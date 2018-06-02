'use strict';

var Util = require('../hakurei').util;
var base_scene = require('../hakurei').scene.base;

var SceneTalk = function(game) {
	base_scene.apply(this, arguments);

};

Util.inherit(SceneTalk, base_scene);

SceneTalk.prototype.init = function(){
	base_scene.prototype.init.apply(this, arguments);
	this.core.scene_manager.setFadeIn(60, "black");
};

SceneTalk.prototype.beforeDraw = function(){
	base_scene.prototype.beforeDraw.apply(this, arguments);
};

// 画面更新
SceneTalk.prototype.draw = function(){
	base_scene.prototype.draw.apply(this, arguments);
	var ctx = this.core.ctx;

	ctx.save();

	ctx.fillStyle = "black";
	ctx.fillRect(0, 0, this.width, this.height);

	ctx.fillStyle = 'white';
	ctx.font = "36px 'Migu'";
	ctx.textAlign = 'center';
	ctx.textBaseAlign = 'middle';

	ctx.fillText("END", this.width/2, this.height/2);

	ctx.restore();
};

module.exports = SceneTalk;
