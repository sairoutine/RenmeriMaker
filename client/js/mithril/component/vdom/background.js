'use strict';
var m = require('mithril');

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

var bg_list = [
	{name: "A", value: "nc138477"},
	{name: "B", value: "nc14162"},
	{name: "C", value: "nc4527"},
	{name: "D", value: "nc72006"},
	{name: "E", value: "nc7951"},
	{name: "F", value: "nc95621"},
];



Background.prototype.toComponent = function (ctrl) {
	var self = this;
	return <div>
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
	</div>;
};

module.exports = Background;
