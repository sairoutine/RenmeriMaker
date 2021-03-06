'use strict';

var m = require('mithril');
var VdomList = require('../config/vdomlist');
var DEFAULT_SCRIPT = '[{"define":"bgm","serif":"","option":{"bgm":"muon"}},{"define":"background","background":"nc4527"},{"define":"serif","pos":"right","exp":"normal","chara":"renko","serif":"あら奇遇ね\\n"},{"define":"serif","pos":"left","exp":"smile","chara":"merry","serif":"こちらこそ\\n蓮子は授業の帰りかしら"},{"define":"serif","pos":"right","exp":"normal","chara":"renko","serif":"まぁそんなところよ\\n"},{"define":"serif","pos":"right","exp":"smile","chara":"renko","serif":"このあとお茶でもいかがかしら？\\n"},{"define":"serif","pos":"left","exp":"smile","chara":"merry","serif":"あら、ぜひ\\n"}]';

var User = function (args) {
	args = args || {};
	this.id = m.prop(args.ID);
	this.dispName = m.prop(args.DispName);
	this.fileName = m.prop(args.FileName);
};

var Emoji = function (args) {
	args = args || {};
	this.fileName = m.prop(args.FileName);
	this.count    = m.prop(args.Count);
	this.type     = m.prop(args.Type);
};

var ViewModel = function (args) {
	this.id = m.prop(null);
	this.isPrivate = m.prop(true);
	this.title = m.prop("");
	this.description = m.prop("");
	this.user = m.prop(new User());
	this.emojis = m.prop([]);
	this.isOwner = m.prop(false);

	this.vdom = [];
	this.currentAddVdomSelectedIndex = m.prop(0);

	this._isSaveLocked = m.prop(false);

	// csrf token
	this._csrf_token = window.config.csrf;
};
ViewModel.prototype.loadFromDefault = function () {
    var deferred = m.deferred();

	this._string2vdom(DEFAULT_SCRIPT);

	deferred.resolve();
    return deferred.promise;
};
ViewModel.prototype.loadFromAPI = function (id) {
	var api_url = "/api/v1/novel/show/" + id;

	var self = this;
	return m.request({
		method: "GET",
		url: api_url,
	}).then(function (response) {
		self.id(response.Id);
		self.isPrivate(response.IsPrivate);
		self.title(response.Title);
		self.description(response.Description);
		self.user(new User(response.User));
		self.isOwner(response.IsOwner);

		var emojis = [];
		for (var i = 0, len = response.Emojis.length; i < len; i++) {
			emojis.push(new Emoji(response.Emojis[i]));
		}
		self.emojis(emojis);

		self._string2vdom(response.Script);
	});
};
ViewModel.prototype._string2vdom = function (string) {
	var script_list = JSON.parse(string);

	for (var i = 0, leni = script_list.length; i < leni; i++) {
		var script = script_list[i];

		for (var j = 0, lenj = VdomList.length; j < lenj; j++) {
			var vdomconfig = VdomList[j];

			if (vdomconfig.value === script.define) {
				this.vdom.push(new vdomconfig.Klass(script));
				break;
			}
		}
	}
};
ViewModel.prototype._vdom2string = function () {
	return JSON.stringify(this.toGameData());
};


ViewModel.prototype.toGameData = function () {
	var game_data = [];
	for (var i = 0, len = this.vdom.length; i < len; i++) {
		var vdom = this.vdom[i];
		game_data.push(vdom.toGameData());
	}

	return game_data;
};
ViewModel.prototype.toPostData = function () {
	var serif = this._vdom2string();

	return m.route.buildQueryString({
		script: serif,
		title: this.title(),
		description: this.description(),
		isPrivate: this.isPrivate() ? 1 : 0,
	});
};

ViewModel.prototype.addVdomByCurrentSelectedIndex = function (index) {
	var vdomconfig = VdomList[this.currentAddVdomSelectedIndex()];
	this.vdom.splice(index, 0, new vdomconfig.Klass({type: vdomconfig.value}));
};

ViewModel.prototype.create = function () {
	var data = this.toPostData()

	var api_url = "/api/v1/novel/create";

	var _csrf_token = this._csrf_token;

	return m.request({
		method: "POST",
		url: api_url,
		data: data,
		serialize: function(data) {return data},
		config: function (xhr) {
			if (_csrf_token) {
				xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
				xhr.setRequestHeader("X-CSRF-TOKEN", _csrf_token);
			}
		}
	});
};

ViewModel.prototype.update = function () {
	var data = this.toPostData()

	var api_url = "/api/v1/novel/update/" + this.id();

	var _csrf_token = this._csrf_token;

	return m.request({
		method: "POST",
		url: api_url,
		data: data,
		serialize: function(data) {return data},
		config: function (xhr) {
			if (_csrf_token) {
				xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
				xhr.setRequestHeader("X-CSRF-TOKEN", _csrf_token);
			}
		}
	});
};
ViewModel.prototype.addEmoji = function (type) {
	var api_url = "/api/v1/novel/emoji/" + this.id() + "/add/" + type;

	var _csrf_token = this._csrf_token;

	return m.request({
		method: "POST",
		url: api_url,
		config: function (xhr) {
			if (_csrf_token) {
				xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
				xhr.setRequestHeader("X-CSRF-TOKEN", _csrf_token);
			}
		}
	});
};

ViewModel.prototype.togglePrivate = function () {
	this.isPrivate(!this.isPrivate());
};

ViewModel.prototype.isSaveLocked = function () {
	return this._isSaveLocked();
};

ViewModel.prototype.saveLock = function () {
	return this._isSaveLocked(true);
};

ViewModel.prototype.saveUnLock = function () {
	return this._isSaveLocked(false);
};







module.exports = ViewModel;
