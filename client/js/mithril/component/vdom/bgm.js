'use strict';
var m = require('mithril');

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


var bgm_list = [
	{name: "A", value: "nc13447"},
	{name: "B", value: "nc20349"},
	{name: "C", value: "nc22928"},
	{name: "D", value: "nc32144"},
	{name: "E", value: "nc38444"},
	{name: "F", value: "nc41740"},
	{name: "G", value: "nc76949"},
];

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
	</div>;
};

module.exports = Bgm;
