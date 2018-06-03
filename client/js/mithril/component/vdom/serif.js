'use strict';
var m = require('mithril');

var chara_list = [
	{name: "蓮子", value: "renko"},
	{name: "メリー", value: "merry"},
];

var exp_list = [
	{name: "普通", value: "normal"},
	{name: "笑", value: "smile"},
	{name: "泣", value: "cry"},
	{name: "怒", value: "angry"},
	{name: "驚", value: "surprised"},
];



var Serif = function (args) {
	this.define = m.prop(args.define);
	this.pos = m.prop(args.pos);
	this.exp = m.prop(args.exp);
	this.chara = m.prop(args.chara);

	this.value = m.prop(args.serif);
};
Serif.prototype.toGameData = function () {
	return {
		define: this.define(),
		pos: this.pos(),
		exp: this.exp(),
		chara: this.chara(),
		serif: this.value(),
	};
};

Serif.prototype.toComponent = function (ctrl) {
	var self = this;
	return <span>
		<select onchange={m.withAttr("value", function (value) {
			self.chara(value);

			// TODO:
			if (value === "renko") {
				self.pos("right");
			}
			else {
				self.pos("left");
			}
			ctrl.reload();
		})}>
		{(function () {
			var list = [];
			for (var i = 0, len = chara_list.length; i < len; i++) {
				var chara = chara_list[i];

				list.push(<option value={chara.value} selected={ chara.value === self.chara() }>{chara.name}</option>);
			}
			return list;
		})()}
		</select>

		<select onchange={m.withAttr("value", function (value) {
			self.exp(value);
			ctrl.reload();
		})}>
		{(function () {
			var list = [];
			for (var i = 0, len = exp_list.length; i < len; i++) {
				var exp = exp_list[i];

				list.push(<option value={exp.value} selected={ exp.value === self.exp() }>{exp.name}</option>);
			}
			return list;
		})()}
		</select>

		<textarea value={self.value()} onchange={m.withAttr("value", function (value) {
			self.value(value);
			ctrl.reload();
		})}></textarea>
	</span>;
};

module.exports = Serif;
