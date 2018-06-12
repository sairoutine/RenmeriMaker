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

var _id = 0;

var Serif = function (args) {
	this.id = m.prop(++_id);
	this.define = m.prop(args.define);
	this.pos = m.prop(args.pos);
	this.exp = m.prop(args.exp || exp_list[0].value);
	this.chara = m.prop(args.chara || chara_list[0].value);

	if (typeof this.pos() === "undefined") {
		// TODO:
		if (this.chara() === "renko") {
			this.pos("right");
		}
		else {
			this.pos("left");
		}
	}

	this.value = m.prop(args.serif || "");
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
		<b>セリフ</b><br />
		<div class="mdl-textfield mdl-js-textfield">
			<select class="mdl-textfield__input" onchange={m.withAttr("value", function (value) {
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
		</div>
		<br />

		<div class="mdl-textfield mdl-js-textfield">
			<select class="mdl-textfield__input" onchange={m.withAttr("value", function (value) {
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
		</div>

		<br />

		<div class="mdl-textfield mdl-js-textfield" style="display: block;width:100%;" config={function (element, isInitialized, context) {
			if(isInitialized) return;
			window.componentHandler.upgradeElement(element);

			context.onunload = function() {
				window.componentHandler.downgradeElements(element);
			};
		}}>
			<textarea class="mdl-textfield__input" rows= "3" id={self.id()} value={self.value()} onchange={m.withAttr("value", function (value) {
				self.value(value);
				ctrl.reload();
			})}></textarea>
			<label class="mdl-textfield__label" for={self.id()}>セリフ</label>
		</div>
	</span>;
};

module.exports = Serif;
