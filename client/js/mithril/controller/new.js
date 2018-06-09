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
	if(this.vm.isSaveLocked()) return;

	this.vm.saveLock();

	var self = this;
	this.vm.create()
	.then(function(result) {
		var snackbarContainer = window.document.querySelector('#snackbar');
		var data = {
			message: '保存しました',
			timeout: 1000,
		};
		snackbarContainer.MaterialSnackbar.showSnackbar(data);

		setTimeout(function() {
			self.vm.saveUnLock();
			location.href = "/novel/show/" + result.id;
		}, 1000);
	});
};

Controller.prototype.isNewMode = function () {
	return true;
};


module.exports = Controller;
