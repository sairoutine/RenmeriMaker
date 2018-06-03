'use strict';
var m = require('mithril');
var bg_map = require('../../../game/config/bg');
// game 側の assets config からメニュー一覧を生成

var bg_list = [];
for (var key in bg_map) {
	var value = bg_map[key];

	bg_list.push({name: value.name, value: key});
}


var Background = function (args) {
	this.define = m.prop(args.define);
	this.value = m.prop(args.background);
};
Background.prototype.toGameData = function () {
	return {
		define: this.define(),
		background: this.value(),
	};
};

Background.prototype.toComponent = function (ctrl) {
	var self = this;
	return <span>
		<select onchange={m.withAttr("value", function (value) {
			self.value(value);
			ctrl.reload();
		})}>
		{(function () {
			var list = [];
			for (var i = 0, len = bg_list.length; i < len; i++) {
				var bg = bg_list[i];

				list.push(<option value={bg.value} selected={ bg.value === self.value() }>{bg.name}</option>);
			}
			return list;
		})()}
		</select>
	</span>;
};

module.exports = Background;
