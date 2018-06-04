'use strict';
var m = require('mithril');
var util = require('../../game/hakurei').util;
var BaseClass = require('../controller/base');

var Controller = function(canvas, option) {
	BaseClass.apply(this, arguments);
};
util.inherit(Controller, BaseClass);

Controller.prototype.load = function () {
	var id = m.route.param("id");
	this.vm.loadFromAPI(id);
};

// セーブデータを保存する
Controller.prototype.save = function () {
	this.vm.update()
	.then(function(result) {
		window.alert("保存しました");
	})
};
Controller.prototype.isEditMode = function () {
	return true;
};



module.exports = Controller;
