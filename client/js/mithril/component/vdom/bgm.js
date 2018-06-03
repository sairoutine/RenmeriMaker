'use strict';
var m = require('mithril');

var bgm_map = require('../../../game/config/bgm');
// game 側の assets config からメニュー一覧を生成

var bgm_list = [];
for (var key in bgm_map) {
	var value = bgm_map[key];

	bgm_list.push({name: value.name, value: key});
}



var Bgm = function (args) {
	this.define = m.prop(args.define);
	this.value = m.prop(args.option.bgm);
};
Bgm.prototype.toGameData = function () {
	return {
		define: this.define(),
		option: {
			bgm: this.value(),
		}
	};
};

Bgm.prototype.toComponent = function (ctrl) {
	var self = this;
	return <div>
		<select onchange={m.withAttr("value", function (value) {
			self.value(value);
			ctrl.reload();
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
		<input type="button" value="☓" onclick={function () {
			ctrl.delete(self);
			ctrl.reload();
		}} />
	</div>;
};

module.exports = Bgm;
