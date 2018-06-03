'use strict';

var m = require('mithril');
var VdomList = require('../config/vdomlist');
var DEFAULT_SCRIPT = '[{"define":"background","background":"nc4527"},{"define":"serif","pos":"right","exp":"normal","chara":"renko","serif":"あら奇遇ね\\n"},{"define":"serif","pos":"left","exp":"smile","chara":"merry","serif":"こちらこそ\\n蓮子は授業の帰りかしら"},{"define":"serif","pos":"right","exp":"normal","chara":"renko","serif":"まぁそんなところよ\\n"},{"define":"serif","pos":"right","exp":"smile","chara":"renko","serif":"このあとお茶でもいかがかしら？\\n"},{"define":"serif","pos":"left","exp":"smile","chara":"merry","serif":"あら、ぜひ\\n"}]';


var ViewModel = function (args) {
	this.title = m.prop("");
	this.description = m.prop("");
	this.currentAddVdomSelectedIndex = m.prop(0);
	this.vdom = [];
	this._string2vdom(DEFAULT_SCRIPT);
};
ViewModel.prototype._string2vdom = function (string) {
	var script_list = JSON.parse(string);

	for (var i = 0, leni = script_list.length; i < leni; i++) {
		var script = script_list[i];

		for (var j = 0, lenj = VdomList.length; j < lenj; j++) {
			var vdomconfig = VdomList[j];

			if (vdomconfig.value === script.define) {
				this.vdom.push(new vdomconfig.Klass(script));
				break;
			}
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

ViewModel.prototype.addVdomByCurrentSelectedIndex = function () {
	var vdomconfig = VdomList[this.currentAddVdomSelectedIndex()];
	this.vdom.push(new vdomconfig.Klass({type: vdomconfig.value}));
};
module.exports = ViewModel;
