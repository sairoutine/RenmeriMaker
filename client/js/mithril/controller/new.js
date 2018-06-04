'use strict';
var util = require('../../game/hakurei').util;
var BaseClass = require('../controller/base');

var Controller = function(canvas, option) {
	BaseClass.apply(this, arguments);

};
util.inherit(Controller, BaseClass);

Controller.prototype.load = function () {
	this.vm.loadFromDefault();
};
// セーブデータを保存する
Controller.prototype.save = function () {
	this.vm.create()
	.then(function(result) {
		window.alert("保存しました");
		location.href = "/novel/show/" + result.id;
	})
};
Controller.prototype.isNewMode = function () {
	return true;
};


module.exports = Controller;
