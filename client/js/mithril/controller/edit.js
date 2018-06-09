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
	if(this.vm.isSaveLocked()) return;

	this.vm.saveLock();

	var self = this;
	this.vm.update()
	.then(function(result) {
		var snackbarContainer = window.document.querySelector('#snackbar');
		var data = {
			message: '保存しました',
			timeout: 1000,
		};
		snackbarContainer.MaterialSnackbar.showSnackbar(data);

		setTimeout(function() {
			self.vm.saveUnLock();
		}, 1000);
	});
};
Controller.prototype.isEditMode = function () {
	return true;
};



module.exports = Controller;
