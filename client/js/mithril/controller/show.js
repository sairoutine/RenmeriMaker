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

Controller.prototype.isShowMode = function () {
	return true;
};


module.exports = Controller;
