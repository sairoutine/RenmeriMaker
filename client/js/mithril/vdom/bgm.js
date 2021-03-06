'use strict';
var m = require('mithril');

var bgm_map = require('../../game/config/bgm');
// game 側の assets config からメニュー一覧を生成

var bgm_list = [];
for (var key in bgm_map) {
	var value = bgm_map[key];

	bgm_list.push({name: value.name, value: key});
}



var Bgm = function (args) {
	var bgm = args.option && args.option.bgm ? args.option.bgm : bgm_list[0].value;
	this.value = m.prop(bgm);
};
Bgm.prototype.define = function () {
	return "bgm";
};

Bgm.prototype.toGameData = function () {
	return {
		define: this.define(),
		serif: "",
		option: {
			bgm: this.value(),
		}
	};
};

Bgm.prototype.toComponent = function (ctrl, idx) {
	var self = this;
	return <span>
		<b>BGM変更</b><br />
		<div class="mdl-textfield mdl-js-textfield">
		<select class="mdl-textfield__input" onchange={m.withAttr("value", function (value) {
			self.value(value);
			ctrl.reload(null, idx);
		})}>
		{(function () {
			var list = [];
			for (var i = 0, len = bgm_list.length; i < len; i++) {
				var bgm = bgm_list[i];

				list.push(<option value={bgm.value} selected={ bgm.value === self.value() }>{bgm.name}</option>);
			}
			return list;
		})()}
		</select>
		</div>
	</span>;
};

module.exports = Bgm;
