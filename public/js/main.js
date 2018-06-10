(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

var Util = require('../hakurei').util;
var AssetsConfig = {};

AssetsConfig.images = Util.assign(require("./chara"), require("./bg"));

AssetsConfig.sounds = {
	/*
 leaving_title: {
 	path: "/sound/leaving_title.ogg",
 	volume: 1.0,
 },
 */
};

AssetsConfig.bgms = require("./bgm");

module.exports = AssetsConfig;

},{"../hakurei":6,"./bg":2,"./bgm":3,"./chara":4}],2:[function(require,module,exports){
'use strict';

module.exports = {
	"nc138477": {
		name: "森の中",
		path: "/image/bg/nc138477.jpg"
	},
	"nc14162": {
		name: "夜の海岸",
		path: "/image/bg/nc14162.jpg"
	},
	"nc4527": {
		name: "道路",
		path: "/image/bg/nc4527.jpg"
	},
	"nc68222": {
		name: "校門前",
		path: "/image/bg/nc68222.jpg"
	},
	"nc72006": {
		name: "夜の森林",
		path: "/image/bg/nc72006.jpg"
	},
	"nc7951": {
		name: "学内",
		path: "/image/bg/nc7951.jpg"
	},
	"nc95621": {
		name: "お店",
		path: "/image/bg/nc95621.jpg"
	}
};

},{}],3:[function(require,module,exports){
'use strict';

module.exports = {
	nc13447: {
		name: "しんみり",
		path: "/bgm/nc13447.mp3",
		loopStart: 0 * 60 + 0 + 0.000,
		//loopEnd: 1*60 + 47 + 0.027,
		volume: 1.0
	},
	nc20349: {
		name: "やる気がない",
		path: "/bgm/nc20349.mp3",
		loopStart: 0 * 60 + 0 + 0.000,
		//loopEnd: 1*60 + 47 + 0.027,
		volume: 1.0
	},
	nc22928: {
		name: "ナチュラル",
		path: "/bgm/nc22928.mp3",
		loopStart: 0 * 60 + 0 + 0.000,
		//loopEnd: 1*60 + 47 + 0.027,
		volume: 1.0
	},
	nc32144: {
		name: "おしゃれ",
		path: "/bgm/nc32144.m4a",
		loopStart: 0 * 60 + 0 + 0.000,
		//loopEnd: 1*60 + 47 + 0.027,
		volume: 1.0
	},
	nc38444: {
		name: "ほのぼの",
		path: "/bgm/nc38444.mp3",
		loopStart: 0 * 60 + 0 + 0.000,
		//loopEnd: 1*60 + 47 + 0.027,
		volume: 1.0
	},
	nc41740: {
		name: "キラキラ",
		path: "/bgm/nc41740.mp3",
		loopStart: 0 * 60 + 0 + 0.000,
		//loopEnd: 1*60 + 47 + 0.027,
		volume: 1.0
	},

	nc76949: {
		name: "和風",
		path: "/bgm/nc76949.mp3",
		loopStart: 0 * 60 + 0 + 0.000,
		//loopEnd: 1*60 + 47 + 0.027,
		volume: 1.0
	}
};

},{}],4:[function(require,module,exports){
'use strict';

module.exports = {
	"renko_normal": "/image/renko/normal1.png",
	"renko_smile": "/image/renko/smile1.png",
	"renko_cry": "/image/renko/cry1.png",
	"renko_surprised": "/image/renko/surprised1.png",
	"renko_angry": "/image/renko/angry1.png",
	"merry_normal": "/image/merry/normal1.png",
	"merry_smile": "/image/merry/smile.png",
	"merry_cry": "/image/merry/cry1.png",
	"merry_surprised": "/image/merry/surprised1.png",
	"merry_angry": "/image/merry/angry1.png"
};

},{}],5:[function(require,module,exports){
'use strict';

var core = require('./hakurei').core;
var util = require('./hakurei').util;
var SceneTalk = require('./scene/talk');
var SceneLoading = require('./scene/loading');
var SceneEnd = require('./scene/end');

var Game = function Game(canvas, option) {
	core.apply(this, arguments);

	// セリフ
	this.serif = null;

	this.scene_manager.addScene("loading", new SceneLoading(this));
	this.scene_manager.addScene("talk", new SceneTalk(this));
	this.scene_manager.addScene("end", new SceneEnd(this));
};
util.inherit(Game, core);

Game.prototype.setSerif = function (serif) {
	this.serif = serif;
};

Game.prototype.init = function () {
	this.scene_manager.changeScene("loading");
};

// ゲームを読み込み直し
Game.prototype.reload = function () {
	this.scene_manager.changeScene("talk");
};

module.exports = Game;

},{"./hakurei":6,"./scene/end":58,"./scene/loading":59,"./scene/talk":60}],6:[function(require,module,exports){
'use strict';

module.exports = require("./hakureijs/index");

},{"./hakureijs/index":13}],7:[function(require,module,exports){
'use strict';

var AudioLoader = function AudioLoader() {
	this.sounds = {};
	this.bgms = {};

	this.loading_audio_num = 0;
	this.loaded_audio_num = 0;

	// key: sound_name, value: only true
	// which determine what sound is played.
	this._reserved_play_sound_name_map = {};

	this.audio_context = null;
	if (window && window.AudioContext) {
		this.audio_context = new window.AudioContext();

		// for legacy browser
		this.audio_context.createGain = this.audio_context.createGain || this.audio_context.createGainNode;
	}

	// key: bgm name, value: playing AudioBufferSourceNode instance
	this._audio_source_map = {};
};
AudioLoader.prototype.init = function () {
	// cancel already playing bgms if init method is called by re-init
	this.stopAllBGM();

	// TODO: cancel already playing sound?
	// TODO: cancel already loading bgms and sounds

	this.sounds = {};
	this.bgms = {};

	this.loading_audio_num = 0;
	this.loaded_audio_num = 0;

	this._reserved_play_sound_name_map = {};

	this._audio_source_map = {};
};

AudioLoader.prototype.loadSound = function (name, path, volume) {
	if (!window || !window.Audio) return;

	var self = this;
	self.loading_audio_num++;

	if (typeof volume === 'undefined') volume = 1.0;

	// it's done to load sound
	var onload_function = function onload_function() {
		self.loaded_audio_num++;
	};

	var audio = new window.Audio(path);
	audio.volume = volume;
	audio.addEventListener('canplay', onload_function);
	audio.addEventListener("error", function () {
		throw new Error("Audio Element error. code: " + audio.error.code + ", message: " + audio.error.message);
	});
	audio.load();
	self.sounds[name] = {
		audio: audio
	};
};

AudioLoader.prototype.loadBGM = function (name, path, volume, loopStart, loopEnd) {
	if (!this.audio_context) return;

	var self = this;
	self.loading_audio_num++;

	if (typeof volume === 'undefined') volume = 1.0;

	// it's done to load audio
	var successCallback = function successCallback(audioBuffer) {
		self.loaded_audio_num++;
		self.bgms[name] = {
			audio: audioBuffer,
			volume: volume,
			loopStart: loopStart,
			loopEnd: loopEnd
		};
	};

	var errorCallback = function errorCallback(error) {
		if (error instanceof Error) {
			throw new Error(error.message);
		} else {
			throw error;
		}
	};

	var xhr = new XMLHttpRequest();
	xhr.onload = function () {
		if (xhr.status !== 200) {
			return;
		}

		var arrayBuffer = xhr.response;

		// decode
		self.audio_context.decodeAudioData(arrayBuffer, successCallback, errorCallback);
	};

	xhr.open('GET', path, true);
	xhr.responseType = 'arraybuffer';
	xhr.send(null);
};

AudioLoader.prototype.isAllLoaded = function () {
	return this.loaded_audio_num === this.loading_audio_num;
};

AudioLoader.prototype.playSound = function (name) {
	if (!this.audio_context) return;
	if (!(name in this.sounds)) throw new Error("Can't find sound '" + name + "'.");

	this._reserved_play_sound_name_map[name] = true;
};

AudioLoader.prototype.executePlaySound = function () {
	for (var name in this._reserved_play_sound_name_map) {
		// play
		this.sounds[name].audio.pause();
		this.sounds[name].audio.currentTime = 0;
		this.sounds[name].audio.play();

		// delete flag
		delete this._reserved_play_sound_name_map[name];
	}
};

AudioLoader.prototype.playSoundByDataURL = function (dataurl, volume) {
	if (!window || !window.Audio) return;

	if (typeof volume === 'undefined') volume = 1.0;

	var audio = new window.Audio();
	audio.volume = volume;
	audio.src = dataurl;
	audio.addEventListener('canplay', function () {
		audio.play();
	});
	audio.addEventListener("error", function () {
		throw new Error("Audio Element error. code: " + audio.error.code + ", message: " + audio.error.message);
	});
	audio.load();
};

AudioLoader.prototype.playBGM = function (name) {
	// stop playing bgm
	this.stopAllBGM();

	this.addBGM(name);
};
AudioLoader.prototype.addBGM = function (name) {
	if (!this.audio_context) return;
	if (this.isPlayingBGM(name)) {
		this.stopBGM(name);
	}

	this._audio_source_map[name] = this._createSourceNodeAndGainNode(name);
	this._audio_source_map[name].source_node.start(0);
};

// play if the bgm is not playing now
AudioLoader.prototype.changeBGM = function (name) {
	if (!this.isPlayingBGM(name)) {
		this.playBGM(name);
	}
};
AudioLoader.prototype.stopAllBGM = function () {
	for (var bgm_name in this._audio_source_map) {
		this.stopBGM(bgm_name);
	}
};
AudioLoader.prototype.stopBGMWithout = function (exclude_bgm_name) {
	for (var bgm_name in this._audio_source_map) {
		if (bgm_name !== exclude_bgm_name) {
			this.stopBGM(bgm_name);
		}
	}
};

AudioLoader.prototype.stopBGM = function (name) {
	if (typeof name === "undefined") {
		return this.stopAllBGM();
	}

	// NOTE: not use AudioBufferSourceNode's stop method
	// because it creates noises.
	this.fadeOutBGM(0.1, name);

	if (name in this._audio_source_map) {
		delete this._audio_source_map[name];
	}
};
AudioLoader.prototype.isPlayingBGM = function (name) {
	if (typeof name === "undefined") {
		return Object.keys(this._audio_source_map).length ? true : false;
	} else {
		return name in this._audio_source_map ? true : false;
	}
};
AudioLoader.prototype.fadeOutAllBGM = function (fadeout_time) {
	for (var bgm_name in this._audio_source_map) {
		this.fadeOutBGM(fadeout_time, bgm_name);
	}
};

AudioLoader.prototype.fadeOutBGM = function (fadeout_time, bgm_name) {
	if (!this.audio_context) return;
	if (typeof bgm_name === "undefined") {
		return this.fadeOutAllBGM(fadeout_time);
	}

	var map = this._audio_source_map[bgm_name];

	if (!map) return;

	var audio_gain = map.gain_node;

	var gain = audio_gain.gain;
	var startTime = this.audio_context.currentTime;
	gain.cancelScheduledValues(startTime);
	gain.setValueAtTime(gain.value, startTime); // for old browser
	var endTime = startTime + fadeout_time;
	gain.linearRampToValueAtTime(0, endTime);
};

AudioLoader.prototype.muteAllBGM = function () {
	for (var bgm_name in this._audio_source_map) {
		this.muteBGM(bgm_name);
	}
};

AudioLoader.prototype.muteBGM = function (bgm_name) {
	if (!this.audio_context) return;
	if (typeof bgm_name === "undefined") {
		return this.muteAllBGM();
	}

	var map = this._audio_source_map[bgm_name];

	if (!map) return;

	var audio_gain = map.gain_node;

	// mute
	audio_gain.gain.setValueAtTime(0, this.audio_context.currentTime);
};
AudioLoader.prototype.unMuteAllBGM = function () {
	for (var bgm_name in this._audio_source_map) {
		this.unMuteBGM(bgm_name);
	}
};

AudioLoader.prototype.unMuteBGM = function (bgm_name) {
	if (!this.audio_context) return;
	if (typeof bgm_name === "undefined") {
		return this.unMuteAllBGM();
	}

	var map = this._audio_source_map[bgm_name];

	if (!map) return;

	var audio_gain = map.gain_node;

	var data = this.bgms[bgm_name];
	audio_gain.gain.setValueAtTime(data.volume, this.audio_context.currentTime);
};

AudioLoader.prototype.unMuteWithFadeInAllBGM = function (fadein_time) {
	for (var bgm_name in this._audio_source_map) {
		this.unMuteWithFadeInBGM(fadein_time, bgm_name);
	}
};

AudioLoader.prototype.unMuteWithFadeInBGM = function (fadein_time, bgm_name) {
	if (!this.audio_context) return;
	if (typeof bgm_name === "undefined") {
		return this.unMuteWithFadeInAllBGM(fadein_time);
	}

	var map = this._audio_source_map[bgm_name];

	if (!map) return;

	var data = this.bgms[bgm_name];

	var audio_gain = map.gain_node;

	var gain = audio_gain.gain;
	var startTime = this.audio_context.currentTime;
	gain.setValueAtTime(gain.value, startTime); // for old browser
	var endTime = startTime + fadein_time;
	gain.linearRampToValueAtTime(data.volume, endTime);
};

// create AudioBufferSourceNode and GainNode instance
AudioLoader.prototype._createSourceNodeAndGainNode = function (name) {
	if (!this.audio_context) return;
	var self = this;
	var data = self.bgms[name];

	var source = self.audio_context.createBufferSource();
	source.buffer = data.audio;

	if ("loopStart" in data || "loopEnd" in data) {
		source.loop = true;
	}
	if (data.loopStart) {
		source.loopStart = data.loopStart;
	}
	if (data.loopEnd) {
		source.loopEnd = data.loopEnd;
	}

	var audio_gain = self.audio_context.createGain();
	audio_gain.gain.setValueAtTime(data.volume, self.audio_context.currentTime);

	source.connect(audio_gain);

	audio_gain.connect(self.audio_context.destination);
	source.start = source.start || source.noteOn;
	source.stop = source.stop || source.noteOff;

	return {
		source_node: source,
		gain_node: audio_gain
	};
};

AudioLoader.prototype.progress = function () {
	// avoid division by zero
	if (this.loading_audio_num === 0) return 1;

	return this.loaded_audio_num / this.loading_audio_num;
};

module.exports = AudioLoader;

},{}],8:[function(require,module,exports){
'use strict';

// TODO: refactor
// - change private property name
// - _isLoadedDone and fontStatuses's is_loaded are duplicated?
// - isAllLoaded and progress method is a little slow
// - add comment

var FontLoader = function FontLoader() {
	this._isLoadedDone = false;
	this._loadedFonts = null;
	this._fontStatues = {};
	this._hiddenCanvas = null;
};
FontLoader.prototype.init = function () {
	this._isLoadedDone = false;
	this._loadedFonts = null;
	this._fontStatues = {};
};
FontLoader.prototype.isAllLoaded = function () {
	for (var name in this._fontStatues) {
		if (!this.isLoaded(name)) return false;
	}

	return true;
};

FontLoader.prototype.progress = function () {
	var all_font_num = 0;
	var loaded_font_num = 0;
	for (var name in this._fontStatues) {
		all_font_num++;

		if (this.isLoaded(name)) loaded_font_num++;
	}

	// avoid division by zero
	if (all_font_num === 0) return 1;

	return loaded_font_num / all_font_num;
};

FontLoader.prototype.setupEvents = function () {
	var self = this;
	if (self.canUseCssFontLoading()) {
		// TODO: after all font loading, calling init method and adding same font loading can't fire ready event
		window.document.fonts.ready.then(function (fonts) {
			self._isLoadedDone = true;
			self._loadedFonts = fonts;
		}).catch(function (error) {
			throw new Error("Can't load font.");
		});
	} else if (self.canUseCssFont()) {
		window.document.fonts.addEventListener('loadingdone', function () {
			self._isLoadedDone = true;
			self._loadedFonts = null;
		});
	} else {
		self._isLoadedDone = true;
		self._loadedFonts = null;
	}
};

// check if it's enable to use document.fonts.ready
var _canUseCssFontLoading = window.document && window.document.fonts && window.document.fonts.ready && document.fonts.ready.then;
FontLoader.prototype.canUseCssFontLoading = function () {
	return _canUseCssFontLoading;
};

// check if it's enable to use document.fonts's loadingdone event
// Note: safari 10.0 has document.fonts but not occur loadingdone event
FontLoader.prototype.canUseCssFont = function () {
	return window.document && window.document.fonts && !this.isSafari10();
};

FontLoader.prototype.isSafari10 = function () {
	return navigator.userAgent.toLowerCase().indexOf("safari") && navigator.userAgent.toLowerCase().indexOf("version/10.0");
};

FontLoader.prototype.isLoaded = function (name) {
	if (!(name in this._fontStatues)) return false;

	var status = this._fontStatues[name];

	if (status.is_loaded) return true;

	var is_loaded = this.checkFontLoaded(name);

	if (is_loaded) {
		status.is_loaded = true;
	}

	return is_loaded;
};

FontLoader.prototype.checkFontLoaded = function (name) {
	if (this.canUseCssFontLoading()) {
		return window.document.fonts.check('10px "' + name + '"');
	} else {
		if (!this._hiddenCanvas) {
			this._hiddenCanvas = window.document.createElement('canvas');
		}
		var context = this._hiddenCanvas.getContext('2d');
		var text = 'abcdefghijklmnopqrstuvwxyz';
		var width1, width2;
		context.font = '40px ' + name + ', sans-serif';
		width1 = context.measureText(text).width;
		context.font = '40px sans-serif';
		width2 = context.measureText(text).width;
		return width1 !== width2;
	}
};

FontLoader.prototype.loadFont = function (name, url, format) {
	if (!window.document) return false;

	this._fontStatues[name] = {
		is_loaded: false
	};

	this._createFontFaceStyle(name, url, format);
	this._createFontLoadingDOM(name);

	return true;
};

FontLoader.prototype._createFontFaceStyle = function (name, url, format) {
	var head = window.document.getElementsByTagName('head');

	if (!head) {
		throw new Error("Fontloader class needs head tag in html file.");
	}

	var rule;
	if (typeof format !== "undefined") {
		rule = '@font-face { font-family: "' + name + '"; src: url("' + url + '") format("' + format + '"); }';
	} else {
		rule = '@font-face { font-family: "' + name + '"; src: url("' + url + '"); }';
	}

	var style = window.document.createElement('style');
	style.type = 'text/css';
	head.item(0).appendChild(style);
	style.sheet.insertRule(rule, 0);
};

// fonts set by @font-face is loaded by while using it.
FontLoader.prototype._createFontLoadingDOM = function (name) {
	var div = window.document.createElement('div');
	var text = window.document.createTextNode('.');
	div.style.fontFamily = name;
	div.style.fontSize = '0px';
	div.style.color = 'transparent';
	div.style.position = 'absolute';
	div.style.margin = 'auto';
	div.style.top = '0px';
	div.style.left = '0px';
	div.style.width = '1px';
	div.style.height = '1px';
	div.appendChild(text);
	window.document.body.appendChild(div);
};

module.exports = FontLoader;

},{}],9:[function(require,module,exports){
'use strict';

var ImageLoader = function ImageLoader() {
	this.images = {};

	this.loading_image_num = 0;
	this.loaded_image_num = 0;
};
ImageLoader.prototype.init = function () {
	// cancel already loading images
	for (var name in this.images) {
		this.images[name].image.src = "";
	}

	this.images = {};

	this.loading_image_num = 0;
	this.loaded_image_num = 0;
};

ImageLoader.prototype.loadImage = function (name, path, scale_width, scale_height) {
	var self = this;

	self.loading_image_num++;

	// it's done to load image
	var onload_function = function onload_function() {
		self.loaded_image_num++;
	};

	var image = new Image();
	image.src = path;
	image.onload = onload_function;
	this.images[name] = {
		scale_width: scale_width,
		scale_height: scale_height,
		image: image
	};
};

ImageLoader.prototype.isAllLoaded = function () {
	return this.loaded_image_num === this.loading_image_num;
};
ImageLoader.prototype.isLoaded = function (name) {
	return name in this.images ? true : false;
};

ImageLoader.prototype.getImage = function (name) {
	if (!this.isLoaded(name)) throw new Error("Can't find image '" + name + "'.");

	return this.images[name].image;
};
ImageLoader.prototype.getScaleWidth = function (name) {
	if (!this.isLoaded(name)) throw new Error("Can't find image '" + name + "'.");

	return this.images[name].scale_width;
};
ImageLoader.prototype.getScaleHeight = function (name) {
	if (!this.isLoaded(name)) throw new Error("Can't find image '" + name + "'.");

	return this.images[name].scale_height;
};

ImageLoader.prototype.progress = function () {
	// avoid division by zero
	if (this.loading_image_num === 0) return 1;

	return this.loaded_image_num / this.loading_image_num;
};

module.exports = ImageLoader;

},{}],10:[function(require,module,exports){
'use strict';

// only keyboard (because core class uses key board map)

var Constant = {
	BUTTON_LEFT: 0x01,
	BUTTON_UP: 0x02,
	BUTTON_RIGHT: 0x04,
	BUTTON_DOWN: 0x08,
	BUTTON_Z: 0x10,
	BUTTON_X: 0x20,
	BUTTON_SHIFT: 0x40,
	BUTTON_SPACE: 0x80
};

module.exports = Constant;

},{}],11:[function(require,module,exports){
'use strict';

var CONSTANT = {
	SPRITE3D: {}
};

// vertices
CONSTANT.SPRITE3D.V_ITEM_SIZE = 3;
CONSTANT.SPRITE3D.V_ITEM_NUM = 4;
CONSTANT.SPRITE3D.V_SIZE = CONSTANT.SPRITE3D.V_ITEM_SIZE * CONSTANT.SPRITE3D.V_ITEM_NUM;
// texture coordinates
CONSTANT.SPRITE3D.C_ITEM_SIZE = 2;
CONSTANT.SPRITE3D.C_ITEM_NUM = 4;
CONSTANT.SPRITE3D.C_SIZE = CONSTANT.SPRITE3D.C_ITEM_SIZE * CONSTANT.SPRITE3D.C_ITEM_NUM;

// indices
CONSTANT.SPRITE3D.I_ITEM_SIZE = 1;
CONSTANT.SPRITE3D.I_ITEM_NUM = 6;
CONSTANT.SPRITE3D.I_SIZE = CONSTANT.SPRITE3D.I_ITEM_SIZE * CONSTANT.SPRITE3D.I_ITEM_NUM;

// color
CONSTANT.SPRITE3D.A_ITEM_SIZE = 4;
CONSTANT.SPRITE3D.A_ITEM_NUM = 4;
CONSTANT.SPRITE3D.A_SIZE = CONSTANT.SPRITE3D.A_ITEM_SIZE * CONSTANT.SPRITE3D.A_ITEM_NUM;

module.exports = CONSTANT;

},{}],12:[function(require,module,exports){
'use strict';

/* TODO: create scene_manager class */

var WebGLDebugUtils = require("webgl-debug");
var Util = require("./util");
var DebugManager = require("./manager/debug");
var SceneManager = require("./manager/scene");
var TimeManager = require("./manager/time");
var SaveManager = require("./manager/save");
var InputManager = require("./manager/input");
var ImageLoader = require("./asset_loader/image");
var AudioLoader = require("./asset_loader/audio");
var FontLoader = require("./asset_loader/font");
var StorageScenario = require('./storage/scenario');

var ShaderProgram = require('./shader_program');
var VS = require("./shader/main.vs");
var FS = require("./shader/main.fs");

var Core = function Core(canvas, options) {
	if (!options) {
		options = {};
	}

	this.canvas_dom = canvas;
	this.ctx = null; // 2D context
	this.gl = null; // 3D context

	// WebGL 3D mode
	if (options.webgl) {
		this.gl = this.createWebGLContext(this.canvas_dom);

		// shader program
		this.sprite_3d_shader = new ShaderProgram(this.gl,
		// verticle shader, fragment shader
		VS, FS,
		// attributes
		["aTextureCoordinates", "aVertexPosition", "aColor"],
		// uniforms
		["uMVMatrix", "uPMatrix", "uSampler"]);
	}
	// Canvas 2D mode
	else {
			this.ctx = this.canvas_dom.getContext('2d');
		}

	this.debug_manager = new DebugManager(this);
	this.scene_manager = new SceneManager(this);
	this.time_manager = new TimeManager(this);
	this.save_manager = new SaveManager();
	this.input_manager = new InputManager();

	this.width = Number(canvas.getAttribute('width'));
	this.height = Number(canvas.getAttribute('height'));

	this._cursor_image_name = null;
	this._default_cursor_image_name = null;

	this.frame_count = 0;

	this.request_id = null;

	this.image_loader = new ImageLoader();
	this.audio_loader = new AudioLoader();
	this.font_loader = new FontLoader();

	// add default save
	this.save_manager.addClass("scenario", StorageScenario);
};
Core.prototype.init = function () {
	this.frame_count = 0;

	this.request_id = null;

	this.debug_manager.init();
	this.scene_manager.init();
	this.time_manager.init();
	// TODO:
	//this.save_manager.init();
	this.input_manager.init();

	this.image_loader.init();
	this.audio_loader.init();
	this.font_loader.init();

	this.save_manager.initialLoad();
};

Core.prototype.reload = function () {
	this.init();
};

Core.prototype.isRunning = function () {
	return this.request_id ? true : false;
};
Core.prototype.startRun = function () {
	if (this.isRunning()) return;

	this.run();
};
Core.prototype.stopRun = function () {
	if (!this.isRunning()) return;

	cancelAnimationFrame(this.request_id);

	this.request_id = null;
};
Core.prototype.run = function () {
	// update fps
	this.debug_manager.beforeRun();

	this.scene_manager.beforeRun();
	// get gamepad input
	// get pressed key time
	this.input_manager.beforeRun();

	// play sound which already set to play
	this.time_manager.executeEvents();

	// play sound which already set to play
	this.audio_loader.executePlaySound();

	// change default cursor image
	this.changeDefaultCursorImage();

	var current_scene = this.scene_manager.currentScene();
	if (current_scene) {
		current_scene.beforeDraw();

		// clear already rendered canvas
		this.clearCanvas();

		current_scene.draw();

		current_scene.afterDraw();

		// draw transtion
		this.scene_manager.drawTransition();

		// overwrite cursor image on scene
		this._renderCursorImage();
	}

	this.frame_count++;

	this.debug_manager.afterRun();
	this.input_manager.afterRun();

	// tick
	this.request_id = requestAnimationFrame(Util.bind(this.run, this));
};
Core.prototype.clearCanvas = function () {
	if (this.is2D()) {
		// 2D
		this.ctx.clearRect(0, 0, this.width, this.height);
	} else if (this.is3D()) {
		// 3D
		this.gl.clearColor(0.0, 0.0, 0.0, 0.0);
		this.gl.clearDepth(1.0);
		this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
	}
};
Core.prototype.is2D = function () {
	return this.ctx ? true : false;
};
Core.prototype.is3D = function () {
	return this.gl ? true : false;
};
// this method is deprecated.
Core.prototype.isKeyDown = function (flag) {
	return this.input_manager.isKeyDown(flag);
};
// this method is deprecated.
Core.prototype.isKeyPush = function (flag) {
	return this.input_manager.isKeyPush(flag);
};
// this method is deprecated.
Core.prototype.getKeyDownTime = function (bit_code) {
	return this.input_manager.getKeyDownTime(bit_code);
};
// this method is deprecated.
Core.prototype.isLeftClickDown = function () {
	return this.input_manager.isLeftClickDown();
};
// this method is deprecated.
Core.prototype.isLeftClickPush = function () {
	return this.input_manager.isLeftClickPush();
};
// this method is deprecated.
Core.prototype.isRightClickDown = function () {
	return this.input_manager.isRightClickDown();
};
// this method is deprecated.
Core.prototype.isRightClickPush = function () {
	return this.input_manager.isRightClickPush();
};

// this method is deprecated.
Core.prototype.mousePositionX = function () {
	return this.input_manager.mousePositionX();
};
// this method is deprecated.
Core.prototype.mousePositionY = function () {
	return this.input_manager.mousePositionX();
};
// this method is deprecated.
Core.prototype.mouseMoveX = function () {
	return this.input_manager.mouseMoveX();
};
// this method is deprecated.
Core.prototype.mouseMoveY = function () {
	return this.input_manager.mouseMoveY();
};
// this method is deprecated.
Core.prototype.mouseScroll = function () {
	return this.input_manager.mouseScroll();
};

Core.prototype.fullscreen = function () {
	var mainCanvas = this.canvas_dom;
	if (mainCanvas.requestFullscreen) {
		mainCanvas.requestFullscreen();
	} else if (mainCanvas.msRequestuestFullscreen) {
		mainCanvas.msRequestuestFullscreen();
	} else if (mainCanvas.mozRequestFullScreen) {
		mainCanvas.mozRequestFullScreen();
	} else if (mainCanvas.webkitRequestFullscreen) {
		mainCanvas.webkitRequestFullscreen();
	}
};

Core.prototype.isAllLoaded = function () {
	if (this.image_loader.isAllLoaded() && this.audio_loader.isAllLoaded() && this.font_loader.isAllLoaded()) {
		return true;
	}
	return false;
};

// TODO: If destroy core instance, delete event handler, if do not, memory leak
Core.prototype.setupEvents = function () {
	if (!window) return;

	// setup WebAudio
	window.AudioContext = function () {
		return window.AudioContext || window.webkitAudioContext;
	}();

	// setup requestAnimationFrame
	window.requestAnimationFrame = function () {
		return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function (callback) {
			window.setTimeout(callback, 1000 / 60);
		};
	}();

	this._setupError();

	this.font_loader.setupEvents();

	this.input_manager.setupEvents(this.canvas_dom);
};

Core.prototype._setupError = function () {
	/*
  * msg: error message
  * file: file path
  * line: row number
  * column: column number
  * err: error object
  */

	var self = this;
	window.onerror = function (msg, file, line, column, err) {
		self.showError(msg, file, line, column, err);

		// restart game at error point
		//self.request_id = requestAnimationFrame(Util.bind(self.run, self));

		// or

		// restart game at first point
		//self.init();
		//self.startRun();
	};
};

Core.prototype.showError = function (msg, file, line, column, err) {
	this.clearCanvas();

	if (this.is2D()) {
		// TODO: create html dom and overlay it on canvas
		var ctx = this.ctx;
		var x = 24;
		var y = 80;

		ctx.save();
		ctx.fillStyle = 'black';
		ctx.fillRect(0, 0, this.width, this.height);
		ctx.restore();

		ctx.save();
		ctx.fillStyle = "red";
		ctx.font = "48px 'sans-serif'";
		ctx.fillText('Error', x, y);

		y += 48;

		ctx.fillStyle = "white";
		ctx.font = "24px 'sans-serif'";

		ctx.fillText(msg, x, y);
		y += 24 + 5;
		ctx.fillText("Time: " + new Date().toString(), x, y);
		y += 24 + 5;
		ctx.fillText("File: " + file, x, y);
		y += 24 + 5;
		ctx.fillText("Line: " + line + ", Column:" + column, x, y);
		y += 24 + 5;
		ctx.fillText("Stack Trace: ", x, y);
		y += 24 + 5;
		x += 24 + 5;
		var stack = err.stack.split("\n");
		for (var i = 0, len = stack.length; i < len; i++) {
			var text = stack[i];
			ctx.fillText(text, x, y);
			y += 24 + 5;
		}
		ctx.restore();
	} else if (this.is3D()) {
		// TODO: render canvas by WebGL
		window.alert(msg + "\n" + line + ":" + column);
	}
};

Core.prototype.createWebGLContext = function (canvas) {
	var gl;
	try {
		gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
		gl = WebGLDebugUtils.makeDebugContext(gl);
	} catch (e) {
		throw e;
	}
	if (!gl) {
		throw new Error("Could not initialize WebGL");
	}

	return gl;
};

Core.prototype.enableCursorImage = function (default_image_name) {
	// disable to show browser default cursor
	this.canvas_dom.style.cursor = "none";

	this._default_cursor_image_name = default_image_name;
};

// use your own cursor image
Core.prototype.isUsingCursorImage = function () {
	return this._default_cursor_image_name ? true : false;
};

Core.prototype.changeCursorImage = function (image_name) {
	this._cursor_image_name = image_name;
};
// change browser default cursor
Core.prototype.disableCursorImage = function (image_name) {
	if (!this.isUsingCursorImage()) return;

	this.canvas_dom.style.cursor = "auto";
	this._cursor_image_name = null;
	this._default_cursor_image_name = null;
};
Core.prototype.changeDefaultCursorImage = function () {
	if (!this.isUsingCursorImage()) return;
	this._cursor_image_name = this._default_cursor_image_name;
};
Core.prototype._renderCursorImage = function () {
	if (!this.isUsingCursorImage()) return;

	// if it is in loading scene, not show cursor
	if (!this.image_loader.isLoaded(this._cursor_image_name)) return;

	var ctx = this.ctx;

	if (!ctx) return;

	ctx.save();

	var cursor = this.image_loader.getImage(this._cursor_image_name);

	var x = this.input_manager.mousePositionX();
	var y = this.input_manager.mousePositionY();

	var scale_width = this.image_loader.getScaleWidth(this._cursor_image_name);
	var scale_height = this.image_loader.getScaleHeight(this._cursor_image_name);
	ctx.translate(x, y);
	ctx.drawImage(cursor, 0, 0, cursor.width * scale_width, cursor.height * scale_height);
	ctx.restore();
};

Core.prototype.setTimeout = function (callback, frame_count) {
	console.error("core's setTimeout method is deprecated.");
	this.time_manager.setTimeout(callback, frame_count);
};
Core.prototype.currentScene = function () {
	console.error("core's currentScene method is deprecated.");
	return this.scene_manager.currentScene.apply(this.scene_manager, arguments);
};
Core.prototype.addScene = function (name, scene) {
	console.error("core's addScene method is deprecated.");
	return this.scene_manager.addScene.apply(this.scene_manager, arguments);
};
Core.prototype.changeScene = function (scene_name, varArgs) {
	console.error("core's changeScene method is deprecated.");
	return this.scene_manager.changeScene.apply(this.scene_manager, arguments);
};
Core.prototype.changeNextSceneIfReserved = function () {
	console.error("core's changeNextSceneIfReserved method is deprecated.");
	return this.scene_manager.changeNextSceneIfReserved.apply(this.scene_manager, arguments);
};
Core.prototype.changeSceneWithLoading = function (scene, assets) {
	console.error("core's changeSceneWithLoading method is deprecated.");
	return this.scene_manager.changeSceneWithLoading.apply(this.scene_manager, arguments);
};

module.exports = Core;

},{"./asset_loader/audio":7,"./asset_loader/font":8,"./asset_loader/image":9,"./manager/debug":14,"./manager/input":15,"./manager/save":16,"./manager/scene":18,"./manager/time":20,"./shader/main.fs":50,"./shader/main.vs":51,"./shader_program":52,"./storage/scenario":55,"./util":56,"webgl-debug":33}],13:[function(require,module,exports){
'use strict';

var Hakurei = {
	// deprecated namespaces
	util: require("./util"),
	core: require("./core"),
	shader_program: require("./shader_program"),
	constant: require("./util").assign(require("./constant/button"), {
		button: require("./constant/button")
	}),
	serif_manager: require("./manager/scenario"),
	save_manager: require("./manager/save"),
	manager: {
		save: require("./manager/save"),
		scenario: require("./manager/scenario")
	},
	scene: {
		base: require("./scene/base"),
		loading: require("./scene/loading"),
		movie: require("./scene/movie")
	},
	object: {
		base: require("./object/base"),
		point: require("./object/point"),
		sprite: require("./object/sprite"),
		sprite3d: require("./object/sprite3d"),
		pool_manager: require("./object/pool_manager"),
		pool_manager3d: require("./object/pool_manager3d"),
		ui_parts: require("./object/ui_parts")
	},
	asset_loader: {
		image: require("./asset_loader/image"),
		audio: require("./asset_loader/audio"),
		font: require("./asset_loader/font")
	},
	storage: {
		base: require("./storage/base"),
		save: require("./storage/save")
	},

	// recommended namespaces
	Util: require("./util"),
	Core: require("./core"),
	ShaderProgram: require("./shader_program"),
	Constant: {
		Button: require("./constant/button")
	},
	Manager: {
		Save: require("./manager/save"),
		Scenario: require("./manager/scenario")
	},
	Scene: {
		Base: require("./scene/base"),
		Loading: require("./scene/loading"),
		Movie: require("./scene/movie")
	},
	Object: {
		Base: require("./object/base"),
		Point: require("./object/point"),
		Sprite: require("./object/sprite"),
		Sprite3d: require("./object/sprite3d"),
		PoolManager: require("./object/pool_manager"),
		PoolManager3d: require("./object/pool_manager3d"),
		UIParts: require("./object/ui_parts"),
		UI: {
			Base: require("./object/ui/base"),
			Text: require("./object/ui/text"),
			Spinner: require("./object/ui/spinner"),
			Group: require("./object/ui/group"),
			Image: require("./object/ui/image")
		}
	},
	AssetLoader: {
		Image: require("./asset_loader/image"),
		Audio: require("./asset_loader/audio"),
		Font: require("./asset_loader/font")
	},
	Storage: {
		Base: require("./storage/base"),
		Save: require("./storage/save")
	},
	Master: {
		RepositoryGenerator: require("./master/repository_generator")
	}

};
module.exports = Hakurei;

},{"./asset_loader/audio":7,"./asset_loader/font":8,"./asset_loader/image":9,"./constant/button":10,"./core":12,"./manager/save":16,"./manager/scenario":17,"./master/repository_generator":22,"./object/base":35,"./object/point":36,"./object/pool_manager":37,"./object/pool_manager3d":38,"./object/sprite":39,"./object/sprite3d":40,"./object/ui/base":41,"./object/ui/group":42,"./object/ui/image":43,"./object/ui/spinner":44,"./object/ui/text":45,"./object/ui_parts":46,"./scene/base":47,"./scene/loading":48,"./scene/movie":49,"./shader_program":52,"./storage/base":53,"./storage/save":54,"./util":56}],14:[function(require,module,exports){
'use strict';

var Util = require("../util");

// per frame
var FPS_CALCULATION_INTERVAL = 60;

var DebugManager = function DebugManager(core) {
	this.core = core;
	this.dom = null; // debug menu area

	this.is_debug_mode = false; // default: false


	this._is_showing_collision_area = false; // default: false

	this._is_showing_fps = false; // default: false

	this._variables = {};

	// Time when FPS was calculated last time(millisecond)
	this._before_time = 0;

	// calculated current fps
	this._fps = 0;
};
DebugManager.prototype.init = function () {
	this._before_time = 0;
	this._fps = 0;
};
DebugManager.prototype.setOn = function (dom) {
	this.is_debug_mode = true;
	this.dom = dom;
};
DebugManager.prototype.setOff = function () {
	this.is_debug_mode = false;
	this.dom = null;
};

DebugManager.prototype.set = function (name, value) {
	if (!this.is_debug_mode) return;

	this._variables[name] = value;
};
DebugManager.prototype.get = function (name) {
	if (!this.is_debug_mode) return null;

	return this._variables[name];
};

DebugManager.prototype.beforeRun = function () {
	if (this.isShowingFps()) {
		this._calculateFps();
	}
};

DebugManager.prototype._calculateFps = function () {
	if (this.core.frame_count % FPS_CALCULATION_INTERVAL !== 0) return;

	var newTime = Date.now();

	if (this._before_time) {
		this._fps = Math.floor(1000 * FPS_CALCULATION_INTERVAL / (newTime - this._before_time));
	}

	this._before_time = newTime;
};

DebugManager.prototype.afterRun = function () {
	if (this.isShowingFps()) {
		this._renderFps();
	}
};

DebugManager.prototype._renderFps = function () {
	var ctx = this.core.ctx;
	ctx.save();
	ctx.fillStyle = 'red';
	ctx.textAlign = 'left';
	ctx.font = "16px 'sans-serif'";
	ctx.fillText("FPS: " + this._fps, this.core.width - 70, this.core.height - 10);
	ctx.restore();
};

// add text menu
DebugManager.prototype.addMenuText = function (text) {
	if (!this.is_debug_mode) return;

	// create element
	var dom = window.document.createElement('pre');
	dom.textContent = text;

	// add element
	this.dom.appendChild(dom);
};
// add <br> tag
DebugManager.prototype.addNewLine = function () {
	if (!this.is_debug_mode) return;

	// create element
	var dom = window.document.createElement('br');

	// add element
	this.dom.appendChild(dom);
};

// add image
DebugManager.prototype.addMenuImage = function (image_path) {
	if (!this.is_debug_mode) return;

	// create element
	var dom = window.document.createElement('img');
	dom.src = image_path;

	// add element
	this.dom.appendChild(dom);
};

// add button menu
DebugManager.prototype.addMenuButton = function (button_value, func) {
	if (!this.is_debug_mode) return;

	var core = this.core;

	// create element
	var input = window.document.createElement('input');

	// set attributes
	input.setAttribute('type', 'button');
	input.setAttribute('value', button_value);
	input.onclick = function () {
		func(core);
	};

	// add element
	this.dom.appendChild(input);
};

// add select pull down menu
DebugManager.prototype.addMenuSelect = function (button_value, pulldown_list, func) {
	if (!this.is_debug_mode) return;

	var core = this.core;

	// select tag
	var select = window.document.createElement("select");

	// label
	var option_label = document.createElement("option");
	option_label.setAttribute("value", "");
	option_label.appendChild(document.createTextNode(button_value));
	select.appendChild(option_label);

	// add event
	select.onchange = function () {
		if (select.value === "") return;
		func(core, select.value);
	};

	// set attributes
	for (var i = 0, len = pulldown_list.length; i < len; i++) {
		var opt = pulldown_list[i];
		var value = opt.value;
		var name = name in opt ? opt.name : value;

		var option = document.createElement("option");
		option.setAttribute("value", value);
		option.appendChild(document.createTextNode(name));
		select.appendChild(option);
	}

	// add element
	this.dom.appendChild(select);
};

DebugManager.prototype.addGitLatestCommitInfo = function (user_name, repo_name, branch) {
	if (!this.is_debug_mode) return;

	branch = branch || "master";

	// create element
	var dom = window.document.createElement('pre');

	// add element
	this.dom.appendChild(dom);

	var git_api_url = "https://api.github.com/repos/" + user_name + "/" + repo_name + "/branches/" + branch;

	// fetch git info
	var xhr = new XMLHttpRequest();
	xhr.onload = function () {
		if (xhr.status !== 200) {
			return;
		}

		var json_text = xhr.response;

		var json;
		if (json_text) {
			json = JSON.parse(json_text);
		} else {
			throw new Error("Can't parse git lastest commit info");
		}

		dom.textContent =
		//"sha: " + json.commit.sha + "\n" +
		//"author: " + json.commit.commit.author.name + "\n" +
		"last update date: " + new Date(json.commit.commit.author.date) + "\n" +
		//"message: " + json.commit.commit.message + "\n" +
		"";
	};

	xhr.open('GET', git_api_url, true);
	xhr.send(null);
};

// TODO: decide where to move this function
var base64toBlob = function base64toBlob(base64) {
	var tmp = base64.split(',');
	var data = atob(tmp[1]);
	var mime = tmp[0].split(':')[1].split(';')[0];
	var buf = new Uint8Array(data.length);
	for (var i = 0; i < data.length; i++) {
		buf[i] = data.charCodeAt(i);
	}
	// blobデータを作成
	var blob = new Blob([buf], { type: mime });
	return blob;
};

DebugManager.prototype.addCaputureImageButton = function (button_value, filename) {
	if (!this.is_debug_mode) return;

	var canvas_dom = this.core.canvas_dom;

	this.addMenuButton(button_value, function () {
		var current_filename = filename;

		// default filename is unixtime
		if (typeof filename === "undefined") {
			var date = new Date();
			current_filename = Math.floor(date.getTime() / 1000);
		}

		var base64 = canvas_dom.toDataURL("image/png");

		var blob = base64toBlob(base64);
		Util.downloadBlob(blob, current_filename + ".png");
	});
};

var READ_TYPE_TO_FILEREADER_FUNCTION_NAME = {
	array_buffer: "readAsArrayBuffer",
	binary_string: "readAsBinaryString",
	text: "readAsText",
	data_url: "readAsDataURL"
};

// add upload button
DebugManager.prototype.addUploadFileButton = function (value, func, read_type) {
	if (!this.is_debug_mode) return;

	if (typeof read_type === "undefined") read_type = "array_buffer";

	if (!READ_TYPE_TO_FILEREADER_FUNCTION_NAME[read_type]) throw new Error("Unknown read_type: " + read_type);

	// add text
	var dom = window.document.createElement('pre');
	dom.style.display = "inline"; // unable to insert br
	dom.textContent = value;
	this.dom.appendChild(dom);

	// create element
	var input = window.document.createElement('input');

	// set attributes
	input.setAttribute('type', 'file');

	var reader_func_name = READ_TYPE_TO_FILEREADER_FUNCTION_NAME[read_type];
	var core = this.core;

	input.onchange = function (e) {
		if (!input.value) return;

		var file = e.target.files[0]; // FileList object
		var reader = new FileReader();
		var type = file.type;

		reader.onload = function (e) {
			var result = e.target.result;
			func(core, type, result);
		};

		reader[reader_func_name](file);
	};

	// occur onchange event if same file is set
	input.onclick = function (e) {
		input.value = null;
	};

	// add element
	this.dom.appendChild(input);
};

// show collision area of object instance
DebugManager.prototype.setShowingCollisionAreaOn = function () {
	if (!this.is_debug_mode) return null;
	this._is_showing_collision_area = true;
};
DebugManager.prototype.setShowingCollisionAreaOff = function () {
	if (!this.is_debug_mode) return null;
	this._is_showing_collision_area = false;
};
DebugManager.prototype.isShowingCollisionArea = function () {
	if (!this.is_debug_mode) return false;
	return this._is_showing_collision_area;
};

// show fps
DebugManager.prototype.setShowingFpsOn = function () {
	if (!this.is_debug_mode) return null;
	this._is_showing_fps = true;
};
DebugManager.prototype.setShowingFpsOff = function () {
	if (!this.is_debug_mode) return null;
	this._is_showing_fps = false;
};
DebugManager.prototype.isShowingFps = function () {
	if (!this.is_debug_mode) return false;
	return this._is_showing_fps;
};

module.exports = DebugManager;

},{"../util":56}],15:[function(require,module,exports){
'use strict';

var CONSTANT = require("../constant/button");
var Util = require("../util");
var ObjectPoint = require("../object/point");

// const
var DEFAULT_BUTTON_ID_TO_BIT_CODE = {
	0: CONSTANT.BUTTON_Z,
	1: CONSTANT.BUTTON_X,
	2: CONSTANT.BUTTON_SPACE,
	3: CONSTANT.BUTTON_SHIFT
};

var InputManager = function InputManager() {
	this.current_keyflag = 0x0;
	this.before_keyflag = 0x0;
	this._key_bit_code_to_down_time = {};

	// gamepad button_id to bit code of key input
	this._button_id_to_key_bit_code = Util.shallowCopyHash(DEFAULT_BUTTON_ID_TO_BIT_CODE);

	this.is_left_clicked = false;
	this.is_right_clicked = false;
	this.before_is_left_clicked = false;
	this.before_is_right_clicked = false;
	this.mouse_change_x = 0;
	this.mouse_change_y = 0;
	this.mouse_x = 0;
	this.mouse_y = 0;
	this.mouse_scroll = 0;

	this._is_gamepad_usable = false;
};

InputManager.prototype.init = function () {
	this.current_keyflag = 0x0;
	this.before_keyflag = 0x0;
	this.initPressedKeyTime();

	// gamepad button_id to bit code of key input
	this._button_id_to_key_bit_code = Util.shallowCopyHash(DEFAULT_BUTTON_ID_TO_BIT_CODE);

	this.is_left_clicked = false;
	this.is_right_clicked = false;
	this.before_is_left_clicked = false;
	this.before_is_right_clicked = false;
	this.mouse_change_x = 0;
	this.mouse_change_y = 0;
	this.mouse_x = 0;
	this.mouse_y = 0;
	this.mouse_scroll = 0;
};
InputManager.prototype.beforeRun = function () {
	// get gamepad input
	this.handleGamePad();

	// get pressed key time
	this.handlePressedKeyTime();
};

InputManager.prototype.afterRun = function () {
	// save key current pressed keys
	this.before_keyflag = this.current_keyflag;
	this.before_is_left_clicked = this.is_left_clicked;
	this.before_is_right_clicked = this.is_right_clicked;

	// reset mouse wheel and mouse move
	this.mouse_scroll = 0;
	this.mouse_change_x = 0;
	this.mouse_change_y = 0;
};

InputManager.prototype.handleKeyDown = function (e) {
	this.current_keyflag |= this._keyCodeToBitCode(e.keyCode);
	e.preventDefault();
};
InputManager.prototype.handleKeyUp = function (e) {
	this.current_keyflag &= ~this._keyCodeToBitCode(e.keyCode);
	e.preventDefault();
};
InputManager.prototype.isKeyDown = function (flag) {
	return this.current_keyflag & flag ? true : false;
};
InputManager.prototype.isKeyPush = function (flag) {
	return !(this.before_keyflag & flag) && this.current_keyflag & flag;
};

InputManager.prototype.getKeyDownTime = function (bit_code) {
	return this._key_bit_code_to_down_time[bit_code];
};

InputManager.prototype.handleMouseDown = function (event) {
	if ("which" in event) {
		// Gecko (Firefox), WebKit (Safari/Chrome) & Opera
		this.is_left_clicked = event.which === 1;
		this.is_right_clicked = event.which === 3;
	} else if ("button" in event) {
		// IE, Opera
		this.is_left_clicked = event.button === 1;
		this.is_right_clicked = event.button === 2;
	}
	event.preventDefault();
};
InputManager.prototype.handleMouseUp = function (event) {
	if ("which" in event) {
		// Gecko (Firefox), WebKit (Safari/Chrome) & Opera
		this.is_left_clicked = event.which === 1 ? false : this.is_left_clicked;
		this.is_right_clicked = event.which === 3 ? false : this.is_right_clicked;
	} else if ("button" in event) {
		// IE, Opera
		this.is_left_clicked = event.button === 1 ? false : this.is_left_clicked;
		this.is_right_clicked = event.button === 2 ? false : this.is_right_clicked;
	}
	event.preventDefault();
};
InputManager.prototype.isLeftClickDown = function () {
	return this.is_left_clicked;
};
InputManager.prototype.isLeftClickPush = function () {
	// not true if is pressed in previous frame
	return this.is_left_clicked && !this.before_is_left_clicked;
};
InputManager.prototype.isRightClickDown = function () {
	return this.is_right_clicked;
};
InputManager.prototype.isRightClickPush = function () {
	// not true if is pressed in previous frame
	return this.is_right_clicked && !this.before_is_right_clicked;
};
InputManager.prototype.handleMouseMove = function (d) {
	d = d ? d : window.event;
	d.preventDefault();

	// get absolute coordinate position of canvas and adjust click position
	// because clientX and clientY return the position from the document.
	var rect = d.target.getBoundingClientRect();

	var x = d.clientX - rect.left;
	var y = d.clientY - rect.top;

	this.mouse_change_x = this.mouse_x - x;
	this.mouse_change_y = this.mouse_y - y;
	this.mouse_x = x;
	this.mouse_y = y;
};

InputManager.prototype.mousePositionPoint = function (scene) {
	var x = this.mousePositionX();
	var y = this.mousePositionY();

	var point = new ObjectPoint(scene);
	point.init();
	point.setPosition(x, y);

	return point;
};

InputManager.prototype.mousePositionX = function () {
	return this.mouse_x;
};
InputManager.prototype.mousePositionY = function () {
	return this.mouse_y;
};
InputManager.prototype.mouseMoveX = function () {
	return this.mouse_change_x;
};
InputManager.prototype.mouseMoveY = function () {
	return this.mouse_change_y;
};
InputManager.prototype.handleMouseWheel = function (event) {
	this.mouse_scroll = event.detail ? event.detail : -event.wheelDelta / 120;
};
InputManager.prototype.mouseScroll = function () {
	return this.mouse_scroll;
};
InputManager.prototype._keyCodeToBitCode = function (keyCode) {
	var flag;
	switch (keyCode) {
		case 16:
			// shift
			flag = CONSTANT.BUTTON_SHIFT;
			break;
		case 32:
			// space
			flag = CONSTANT.BUTTON_SPACE;
			break;
		case 37:
			// left
			flag = CONSTANT.BUTTON_LEFT;
			break;
		case 38:
			// up
			flag = CONSTANT.BUTTON_UP;
			break;
		case 39:
			// right
			flag = CONSTANT.BUTTON_RIGHT;
			break;
		case 40:
			// down
			flag = CONSTANT.BUTTON_DOWN;
			break;
		case 88:
			// x
			flag = CONSTANT.BUTTON_X;
			break;
		case 90:
			// z
			flag = CONSTANT.BUTTON_Z;
			break;
	}
	return flag;
};
InputManager.prototype.handleGamePad = function () {
	if (!this._is_gamepad_usable) return;
	var pads = window.navigator.getGamepads();
	var pad = pads[0]; // 1Pコン

	if (!pad) return;

	// button
	for (var i = 0, len = pad.buttons.length; i < len; i++) {
		if (!(i in this._button_id_to_key_bit_code)) continue; // ignore if I don't know its button
		if (pad.buttons[i].pressed) {
			// pressed
			this.current_keyflag |= this.getKeyByButtonId(i);
		} else {
			// not pressed
			this.current_keyflag &= ~this.getKeyByButtonId(i);
		}
	}

	// arrow keys
	if (pad.axes[1] < -0.5) {
		this.current_keyflag |= CONSTANT.BUTTON_UP;
	} else {
		this.current_keyflag &= ~CONSTANT.BUTTON_UP;
	}
	if (pad.axes[1] > 0.5) {
		this.current_keyflag |= CONSTANT.BUTTON_DOWN;
	} else {
		this.current_keyflag &= ~CONSTANT.BUTTON_DOWN;
	}
	if (pad.axes[0] < -0.5) {
		this.current_keyflag |= CONSTANT.BUTTON_LEFT;
	} else {
		this.current_keyflag &= ~CONSTANT.BUTTON_LEFT;
	}
	if (pad.axes[0] > 0.5) {
		this.current_keyflag |= CONSTANT.BUTTON_RIGHT;
	} else {
		this.current_keyflag &= ~CONSTANT.BUTTON_RIGHT;
	}
};
InputManager.prototype.initPressedKeyTime = function () {
	this._key_bit_code_to_down_time = {};

	for (var button_id in CONSTANT) {
		var bit_code = CONSTANT[button_id];
		this._key_bit_code_to_down_time[bit_code] = 0;
	}
};

InputManager.prototype.handlePressedKeyTime = function () {
	for (var button_id in CONSTANT) {
		var bit_code = CONSTANT[button_id];
		if (this.isKeyDown(bit_code)) {
			this._key_bit_code_to_down_time[bit_code]++;
		} else {
			this._key_bit_code_to_down_time[bit_code] = 0;
		}
	}
};
InputManager.prototype.setupEvents = function (canvas_dom) {
	var self = this;

	// bind keyboard
	window.onkeydown = function (e) {
		self.handleKeyDown(e);
	};
	window.onkeyup = function (e) {
		self.handleKeyUp(e);
	};

	// bind mouse click
	canvas_dom.onmousedown = function (e) {
		self.handleMouseDown(e);
	};
	canvas_dom.onmouseup = function (e) {
		self.handleMouseUp(e);
	};

	// bind mouse move
	canvas_dom.onmousemove = function (d) {
		self.handleMouseMove(d);
	};

	// bind mouse wheel
	var mousewheelevent = window.navi && /Firefox/i.test(window.navigator.userAgent) ? "DOMMouseScroll" : "mousewheel";
	if (canvas_dom.addEventListener) {
		//WC3 browsers
		canvas_dom.addEventListener(mousewheelevent, function (e) {
			var event = window.event || e;
			self.handleMouseWheel(event);
		}, false);
	}

	// unable to use right click menu.
	canvas_dom.oncontextmenu = function () {
		return false;
	};

	// bind gamepad
	if (window.Gamepad && window.navigator && window.navigator.getGamepads) {
		self._is_gamepad_usable = true;
	}
};

InputManager.prototype.getKeyByButtonId = function (button_id) {
	var keys = this._button_id_to_key_bit_code[button_id];
	if (!keys) keys = 0x00;

	return keys;
};

// get one of the pressed button id
InputManager.prototype.getAnyButtonId = function () {
	if (!this._is_gamepad_usable) return;

	var pads = window.navigator.getGamepads();
	var pad = pads[0]; // 1Pコン

	if (!pad) return;

	for (var i = 0; i < pad.buttons.length; i++) {
		if (pad.buttons[i].pressed) {
			return i;
		}
	}
};
/*
InputManager.prototype.setButtonIdMapping = function(button_id, key) {
	var defined_key = this._button_id_to_key_bit_code[button_id];

	for (var target_button_id in this._button_id_to_key_bit_code) {
		var target_key = this._button_id_to_key_bit_code[target_button_id];
		// If there are already set keys in other keys, replace it.
		if (target_key === key) {
			if (defined_key) {
				// replace other key's button_id mapping to current button_id's key.
				this._button_id_to_key_bit_code[target_button_id] = defined_key;
			}
			else {
				// the player presses target_button_id, no event has occured.
				delete this._button_id_to_key_bit_code[target_button_id];
			}
		}
	}

	// set
	this._button_id_to_key_bit_code[button_id] = key;
};

InputManager.prototype.setAllButtonIdMapping = function(map) {
	this._button_id_to_key_bit_code = Util.shallowCopyHash(map);
};

InputManager.prototype.getButtonIdToKeyMap = function() {
	return Util.shallowCopyHash(this._button_id_to_key_bit_code);
};
// convert { value => key } hash
InputManager.prototype.getKeyToButtonIdMap = function() {
	var map = {};
	for (var button_id in this._button_id_to_key_bit_code) {
		var key = this._button_id_to_key_bit_code[button_id];
		map[key] = button_id; // NOTE: cannot duplicate, if it, overwrite it
	}

	return map;
};


InputManager.prototype.dumpGamePadKey = function() {
	var dump = {};

	for (var button_id in this._button_id_to_key_bit_code) {
		var key = this._button_id_to_key_bit_code[ button_id ];
		switch(key) {
			case CONSTANT.BUTTON_LEFT:
				dump[button_id] = "LEFT";
				break;
			case CONSTANT.BUTTON_UP:
				dump[button_id] = "UP";
				break;
			case CONSTANT.BUTTON_RIGHT:
				dump[button_id] = "RIGHT";
				break;
			case CONSTANT.BUTTON_DOWN:
				dump[button_id] = "DOWN";
				break;
			case CONSTANT.BUTTON_Z:
				dump[button_id] = "Z";
				break;
			case CONSTANT.BUTTON_X:
				dump[button_id] = "X";
				break;
			case CONSTANT.BUTTON_SHIFT:
				dump[button_id] = "SHIFT";
				break;
			case CONSTANT.BUTTON_SPACE:
				dump[button_id] = "SPACE";
				break;
			default:
				dump[button_id] = "UNKNOWN";
		}
	}

	console.log(dump);
};
*/

module.exports = InputManager;

},{"../constant/button":10,"../object/point":36,"../util":56}],16:[function(require,module,exports){
'use strict';
// repository for storage save class

//var Util = require("../util");

var SaveManager = function SaveManager() {
	this._name_to_class = {};
};

// klass must inherited save/base class
SaveManager.prototype.addClass = function (name, klass) {
	if (typeof this[name] !== "undefined") throw new Error(name + " is reserved word.");

	this._name_to_class[name] = klass;
};

SaveManager.prototype.initialLoad = function () {
	for (var name in this._name_to_class) {
		var Klass = this._name_to_class[name];

		if (!this[name]) {
			this[name] = Klass.load();
		}
	}
};

SaveManager.prototype.load = function () {
	for (var name in this._name_to_class) {
		var Klass = this._name_to_class[name];
		this[name] = Klass.load();
	}
};

SaveManager.prototype.save = function () {
	for (var name in this._name_to_class) {
		this[name].save();
	}
};

SaveManager.prototype.reload = function () {
	for (var name in this._name_to_class) {
		this[name].reload();
	}
};

SaveManager.prototype.del = function () {
	for (var name in this._name_to_class) {
		this[name].del();
	}
};

module.exports = SaveManager;

},{}],17:[function(require,module,exports){
'use strict';

// TODO: add _isStartPrintLetter, isPausePrintLetter method

// default typography speed

var TYPOGRAPHY_SPEED = 10;
// default chara position
var POSITION = 0;

var Util = require("../util");
var BaseClass = require("./serif_abolished_notifier_base");

var ScenarioManager = function ScenarioManager(core, option) {
	this.core = core;

	option = option || {};
	this._typography_speed = "typography_speed" in option ? option.typography_speed : TYPOGRAPHY_SPEED;
	this._criteria_function_map = "criteria" in option ? option.criteria : {};

	// event handler
	this._event_to_callback = {
		printend: function printend() {}
	};

	this._timeoutID = null;

	// serif scenario
	this._script = null;

	// where serif has progressed
	this._progress = null;

	// chara
	this._current_talking_pos = null; // which chara is talking
	this._pos_to_chara_id_map = {};
	this._pos_to_exp_id_map = {};

	// background
	this._is_background_changed = false;
	this._current_bg_image_name = null;

	// junction
	this._current_junction_list = [];

	// option
	this._current_option = {};

	// letter data to print
	this._current_message_letter_list = [];
	this._current_message_sentenses_num = null;
	this._current_message_max_length_letters = null;

	// current printed sentences
	this._letter_idx = 0;
	this._sentences_line_num = 0;
	this._current_printed_sentences = [];
};
Util.inherit(ScenarioManager, BaseClass);

ScenarioManager.prototype.init = function (script) {
	if (!script) throw new Error("set script arguments to use scenario_manager class");

	if (this._timeoutID) this._stopPrintLetter();

	this._script = script.slice(); // shallow copy

	this._progress = -1;

	// chara
	this._current_talking_pos = null;
	this._pos_to_chara_id_map = {};
	this._pos_to_exp_id_map = {};

	// background
	this._is_background_changed = false;
	this._current_bg_image_name = null;

	// junction
	this._current_junction_list = [];

	// option
	this._current_option = {};

	// letter data to print
	this._current_message_letter_list = [];
	this._current_message_sentenses_num = null;
	this._current_message_max_length_letters = null;

	// current printed sentences
	this._letter_idx = 0;
	this._sentences_line_num = 0;
	this._current_printed_sentences = [];
};
ScenarioManager.prototype.on = function (event, callback) {
	this._event_to_callback[event] = callback;

	return this;
};
ScenarioManager.prototype.removeEvent = function (event) {
	this._event_to_callback[event] = function () {};

	return this;
};

ScenarioManager.prototype.start = function (progress) {
	if (!this._script) throw new Error("start method must be called after instance was initialized.");

	if (this.isEnd()) return;

	this._progress = progress || 0;

	this._chooseNextSerifScript();

	this._setupCurrentSerifScript();
};

ScenarioManager.prototype.next = function (choice) {
	// chosen serif junction
	choice = choice || 0;

	if (this.isEnd()) return false;

	this._progress++;

	this._chooseNextSerifScript(choice);

	this._setupCurrentSerifScript();

	return true;
};
ScenarioManager.prototype._chooseNextSerifScript = function (choice) {
	var script = this._script[this._progress];

	var type = script.type || "serif";

	var chosen_serifs;
	if (type === "serif") {
		// do nothing
	} else if (type === "junction_serif") {
		chosen_serifs = script.serifs[choice];
		if (!chosen_serifs) throw new Error("chosen junction index '" + choice + "' does not exists in next serifs array");

		// delete current script and insert new chosen serif list
		Array.prototype.splice.apply(this._script, [this._progress, 1].concat(chosen_serifs));
	} else if (type === "criteria_serif") {
		var criteria_name = script.criteria;
		var argument_list = script.arguments;
		choice = this._execCriteriaFunction(criteria_name, argument_list);
		chosen_serifs = script.serifs[choice];

		if (!chosen_serifs) throw new Error("choisen criteria index '" + choice + "' does not exists");

		// delete current script and insert new chosen serif list
		Array.prototype.splice.apply(this._script, [this._progress, 1].concat(chosen_serifs));

		// check criteria recursively
		this._chooseNextSerifScript();
	} else {
		throw new Error("Unknown serif script type: " + type);
	}
};

ScenarioManager.prototype._execCriteriaFunction = function (criteria_name, argument_list) {
	var criteria_function = this._criteria_function_map[criteria_name];

	if (!criteria_function) throw new Error(criteria_name + " criteria does not exists");

	return criteria_function.apply({}, [this.core].concat(argument_list));
};

ScenarioManager.prototype.isStart = function () {
	return this._progress > -1;
};
ScenarioManager.prototype.isEnd = function () {
	return this._progress === this._script.length - 1;
};

ScenarioManager.prototype.isPrintLetterEnd = function () {
	var letter_length = this._current_message_letter_list.length;
	return this._letter_idx >= letter_length ? true : false;
};

ScenarioManager.prototype._setupCurrentSerifScript = function () {
	var script = this._script[this._progress];

	this._setupChara(script);
	this._setupBackground(script);
	this._setupJunction(script);
	this._setupOption(script);

	this._saveSerifPlayed(script);

	if (typeof script.serif === "string") {
		this._setupSerif(script);
	} else {
		// If serif is empty, show chara without talking and next
		if (!this.isEnd()) {
			this.next();
		}
	}
};
ScenarioManager.prototype._setupChara = function (script) {
	var pos = script.pos;
	var chara = script.chara;
	var exp = script.exp;

	if (!pos) pos = POSITION;

	this._current_talking_pos = pos;
	this._pos_to_chara_id_map[this._current_talking_pos] = chara;
	this._pos_to_exp_id_map[this._current_talking_pos] = exp;
};

ScenarioManager.prototype._setupBackground = function (script) {
	var background = script.background;

	this._is_background_changed = false;

	if (background && this._current_bg_image_name !== background) {
		this._is_background_changed = true;
		this._current_bg_image_name = background;
	}
};

ScenarioManager.prototype._setupJunction = function (script) {
	var junction_list = script.junction;
	this._current_junction_list = junction_list || [];
};

ScenarioManager.prototype._setupOption = function (script) {
	this._current_option = script.option || {};
};

ScenarioManager.prototype._saveSerifPlayed = function (script) {
	var id = script.id;
	var is_save = script.save;

	if (!is_save) return;

	if (typeof id === "undefined") throw new Error("script save property needs id property");

	this.core.save_manager.scenario.incrementPlayedCount(id);
};

ScenarioManager.prototype._setupSerif = function (script) {
	var message = script.serif;

	// cancel already started message
	this._stopPrintLetter();

	// setup letter data to print
	this._current_message_letter_list = message.split("");

	var sentences = message.split("\n");

	// count max length of sentence
	this._current_message_max_length_letters = 0;
	for (var i = 0, len = sentences.length; i < len; i++) {
		if (this._current_message_max_length_letters < sentences[i].length) {
			this._current_message_max_length_letters = sentences[i].length;
		}
	}

	// count newline of current message
	this._current_message_sentenses_num = sentences.length;

	// clear current printed sentences
	this._letter_idx = 0;
	this._sentences_line_num = 0;
	this._current_printed_sentences = [];

	// start message
	this._startPrintLetter();
};
ScenarioManager.prototype._startPrintLetter = function () {
	this._printLetter();

	if (!this.isPrintLetterEnd()) {
		this._timeoutID = setTimeout(Util.bind(this._startPrintLetter, this), this._typography_speed);
	} else {
		this._timeoutID = null;
	}
};

ScenarioManager.prototype._stopPrintLetter = function () {
	if (this._timeoutID !== null) {
		clearTimeout(this._timeoutID);
		this._timeoutID = null;
	}
};

ScenarioManager.prototype._printLetter = function () {
	if (this.isPrintLetterEnd()) return;

	var current_message_letter_list = this._current_message_letter_list;

	// get A letter to add
	var letter = current_message_letter_list[this._letter_idx++];

	if (letter === "\n") {
		this._sentences_line_num++;
	} else {
		// initialize if needed
		if (!this._current_printed_sentences[this._sentences_line_num]) {
			this._current_printed_sentences[this._sentences_line_num] = "";
		}

		// print A letter
		this._current_printed_sentences[this._sentences_line_num] += letter;
	}
	// If printing has finished, call printend callback.
	if (this.isPrintLetterEnd()) {
		this._event_to_callback.printend();
	}
};

ScenarioManager.prototype.resumePrintLetter = function () {
	this._startPrintLetter();
};
ScenarioManager.prototype.pausePrintLetter = function () {
	this._stopPrintLetter();
};

ScenarioManager.prototype.getCurrentPrintedSentences = function () {
	return this._current_printed_sentences;
};

ScenarioManager.prototype.getCurrentSentenceNum = function () {
	return this._current_message_sentenses_num;
};

ScenarioManager.prototype.getCurrentMaxLengthLetters = function () {
	return this._current_message_max_length_letters;
};

ScenarioManager.prototype.isBackgroundChanged = function () {
	return this._is_background_changed;
};

ScenarioManager.prototype.getCurrentBackgroundImageName = function () {
	return this._current_bg_image_name;
};

ScenarioManager.prototype.getCurrentOption = function () {
	return this._current_option;
};

ScenarioManager.prototype.getCurrentCharaNameByPosition = function (pos) {
	pos = pos || POSITION;
	return this._pos_to_chara_id_map[pos];
};

ScenarioManager.prototype.getCurrentCharaExpressionByPosition = function (pos) {
	pos = pos || POSITION;
	return this._pos_to_exp_id_map[pos];
};

ScenarioManager.prototype.isCurrentTalkingByPosition = function (pos) {
	return this._current_talking_pos === pos;
};

ScenarioManager.prototype.isCurrentSerifExistsJunction = function () {
	return this._current_junction_list.length > 0;
};

ScenarioManager.prototype.getCurrentJunctionList = function () {
	return this._current_junction_list;
};

module.exports = ScenarioManager;

},{"../util":56,"./serif_abolished_notifier_base":19}],18:[function(require,module,exports){
'use strict';

var SceneLoading = require('../scene/loading');

var SceneManager = function SceneManager(core) {
	this.core = core;

	this._current_scene = null;
	// next scene which changes next frame run
	this._reserved_next_scene_name_and_arguments = null;
	this._is_reserved_next_scene_init = true; // is scene will inited?

	this._scenes = {};

	// property for fade in
	this._fade_in_duration = null;
	this._fade_in_color = null;
	this._fade_in_start_frame_count = null;

	// property for fade out
	this._fade_out_duration = null;
	this._fade_out_color = null;
	this._fade_out_start_frame_count = null;

	// add default scene
	this.addScene("loading", new SceneLoading(core));
};
SceneManager.prototype.init = function () {
	this._current_scene = null;
	// next scene which changes next frame run
	this._reserved_next_scene_name_and_arguments = null;
	this._is_reserved_next_scene_init = true; // is scene will inited?

	// property for fade in
	this._fade_in_duration = null;
	this._fade_in_color = null;
	this._fade_in_start_frame_count = null;

	// property for fade out
	this._fade_out_duration = null;
	this._fade_out_color = null;
	this._fade_out_start_frame_count = null;
};

SceneManager.prototype.beforeRun = function () {
	// go to next scene if next scene is set
	this._changeNextSceneIfReserved();
};

SceneManager.prototype.currentScene = function () {
	if (this._current_scene === null) {
		return null;
	}

	return this._scenes[this._current_scene];
};

SceneManager.prototype.addScene = function (name, scene) {
	this._scenes[name] = scene;
};

SceneManager.prototype.changeScene = function (scene_name, varArgs) {
	if (!(scene_name in this._scenes)) throw new Error(scene_name + " scene doesn't exists.");

	var args = Array.prototype.slice.call(arguments); // to convert array object
	this._reserved_next_scene_name_and_arguments = args;
	this._is_reserved_next_scene_init = true; // scene will inited

	// immediately if no scene is set
	if (!this._current_scene) {
		this._changeNextSceneIfReserved();
	}
};
SceneManager.prototype.returnScene = function (scene_name) {
	if (!(scene_name in this._scenes)) throw new Error(scene_name + " scene doesn't exists.");

	this._reserved_next_scene_name_and_arguments = [scene_name];
	this._is_reserved_next_scene_init = false; // scene will NOT inited
};

SceneManager.prototype._changeNextSceneIfReserved = function () {
	if (this._reserved_next_scene_name_and_arguments) {

		if (this.isSetFadeOut() && !this.isInFadeOut()) {
			this.startFadeOut();
		} else if (this.isSetFadeOut() && this.isInFadeOut()) {
			// waiting for quiting fade out
		} else {
			// change next scene
			this._current_scene = this._reserved_next_scene_name_and_arguments.shift();
			var current_scene = this.currentScene();

			var argument_list = this._reserved_next_scene_name_and_arguments;
			this._reserved_next_scene_name_and_arguments = null;

			// if returnScene method is called, scene will not be inited.
			if (this._is_reserved_next_scene_init) {
				current_scene.init.apply(current_scene, argument_list);
			}
		}
	}
};
SceneManager.prototype.changeSceneWithLoading = function (scene, assets) {
	if (!assets) assets = {};
	this.changeScene("loading", assets, scene);
};

SceneManager.prototype.setFadeIn = function (duration, color) {
	this._fade_in_duration = duration || 30;
	this._fade_in_color = color || 'white';

	// start fade in immediately
	this._startFadeIn();
};
SceneManager.prototype._startFadeIn = function () {
	this._quitFadeOut();
	this._fade_in_start_frame_count = this.core.frame_count;
};

SceneManager.prototype._quitFadeIn = function () {
	this._fade_in_duration = null;
	this._fade_in_color = null;
	this._fade_in_start_frame_count = null;
};
SceneManager.prototype.isInFadeIn = function () {
	return this._fade_in_start_frame_count !== null ? true : false;
};

SceneManager.prototype.setFadeOut = function (duration, color) {
	duration = typeof duration !== "undefined" ? duration : 30;
	this._fade_out_duration = duration;
	this._fade_out_color = color || 'black';
};
SceneManager.prototype.startFadeOut = function () {
	if (!this.isSetFadeOut()) return;

	this._quitFadeIn();
	this._fade_out_start_frame_count = this.core.frame_count;
};

SceneManager.prototype._quitFadeOut = function () {
	this._fade_out_duration = null;
	this._fade_out_color = null;
	this._fade_out_start_frame_count = null;
};
SceneManager.prototype.isInFadeOut = function () {
	return this._fade_out_start_frame_count !== null ? true : false;
};
SceneManager.prototype.isSetFadeOut = function () {
	return this._fade_out_duration && this._fade_out_color ? true : false;
};

SceneManager.prototype.drawTransition = function () {
	var ctx = this.core.ctx;

	var alpha;
	// fade in
	if (this.isInFadeIn()) {
		ctx.save();
		// tranparent settings
		if (this.core.frame_count - this._fade_in_start_frame_count < this._fade_in_duration) {
			alpha = 1.0 - (this.core.frame_count - this._fade_in_start_frame_count) / this._fade_in_duration;
		} else {
			alpha = 0.0;
		}

		ctx.globalAlpha = alpha;

		// transition color
		ctx.fillStyle = this._fade_in_color;
		ctx.fillRect(0, 0, this.core.width, this.core.height);

		ctx.restore();

		// alpha === 0.0 by transparent settings so quit fade in
		// why there? because alpha === 0, _fade_in_color === null by quitFadeIn method
		if (alpha === 0) this._quitFadeIn();
	}
	// fade out
	else if (this.isInFadeOut()) {
			ctx.save();
			// tranparent settings
			if (this.core.frame_count - this._fade_out_start_frame_count < this._fade_out_duration) {
				alpha = (this.core.frame_count - this._fade_out_start_frame_count) / this._fade_out_duration;
			} else {
				alpha = 1.0;
			}

			ctx.globalAlpha = alpha;

			// transition color
			ctx.fillStyle = this._fade_out_color;
			ctx.fillRect(0, 0, this.core.width, this.core.height);

			ctx.restore();

			// alpha === 1.0 by transparent settings so quit fade out
			// why there? because alpha === 1, _fade_out_color === null by quitFadeOut method
			if (alpha === 1) this._quitFadeOut();
		}
};

module.exports = SceneManager;

},{"../scene/loading":48}],19:[function(require,module,exports){
'use strict';

var SerifManager = function SerifManager(option) {};

SerifManager.prototype.init = function (script) {
	return console.error("this method is abolished.");
};
SerifManager.prototype.setAutoStart = function (flag) {
	return console.error("this method is abolished.");
};
SerifManager.prototype.isEnd = function () {
	return console.error("this method is abolished.");
};
SerifManager.prototype.isStart = function () {
	return console.error("this method is abolished.");
};
SerifManager.prototype.next = function () {
	return console.error("this method is abolished.");
};
SerifManager.prototype._showBackground = function (script) {
	return console.error("this method is abolished.");
};
SerifManager.prototype._showChara = function (script) {
	return console.error("this method is abolished.");
};
SerifManager.prototype._setOption = function (script) {
	return console.error("this method is abolished.");
};
SerifManager.prototype._printMessage = function (message) {
	return console.error("this method is abolished.");
};
SerifManager.prototype.isWaitingNext = function () {
	return console.error("this method is abolished.");
};
SerifManager.prototype.isEndPrinting = function () {
	return console.error("this method is abolished.");
};
SerifManager.prototype._startPrintMessage = function () {
	return console.error("this method is abolished.");
};
SerifManager.prototype._cancelPrintMessage = function () {
	return console.error("this method is abolished.");
};
SerifManager.prototype.startPrintMessage = function () {
	return console.error("this method is abolished.");
};
SerifManager.prototype.cancelPrintMessage = function () {
	return console.error("this method is abolished.");
};
SerifManager.prototype.isBackgroundChanged = function () {
	return console.error("this method is abolished.");
};
SerifManager.prototype.getBackgroundImageName = function () {
	return console.error("this method is abolished.");
};
SerifManager.prototype.getImageName = function (pos) {
	return console.error("this method is abolished.");
};
SerifManager.prototype.getChara = function (pos) {
	return console.error("this method is abolished.");
};
SerifManager.prototype.isTalking = function (pos) {
	return console.error("this method is abolished.");
};
SerifManager.prototype.getOption = function () {
	return console.error("this method is abolished.");
};
SerifManager.prototype.lines = function () {
	return console.error("this method is abolished.");
};
SerifManager.prototype.getSerifRowsCount = function () {
	return console.error("this method is abolished.");
};
SerifManager.prototype.right_image = function () {
	return console.error("this method is abolished.");
};
SerifManager.prototype.left_image = function () {
	return console.error("this method is abolished.");
};
SerifManager.prototype.is_right_talking = function () {
	return console.error("this method is abolished.");
};
SerifManager.prototype.is_left_talking = function () {
	return console.error("this method is abolished.");
};
SerifManager.prototype.font_color = function () {
	return console.error("this method is abolished.");
};
SerifManager.prototype.is_end = function () {
	return console.error("this method is abolished.");
};
SerifManager.prototype.is_background_changed = function () {
	return console.error("this method is abolished.");
};
SerifManager.prototype.background_image = function () {
	return console.error("this method is abolished.");
};

module.exports = SerifManager;

},{}],20:[function(require,module,exports){
'use strict';

var ID = 0;

var TimeManager = function TimeManager(core) {
	this.core = core;

	this.events = {};
};
TimeManager.prototype.init = function () {
	this.events = {};
};

TimeManager.prototype.setTimeout = function (callback, frame_count) {
	var current_frame_count = this.core.frame_count;
	var execute_timing = current_frame_count + frame_count;
	var id = ++ID;

	if (!this.events[execute_timing]) {
		this.events[execute_timing] = {};
	}

	this.events[execute_timing][id] = {
		callback: callback
	};

	return id;
};

TimeManager.prototype.clearTimeout = function (id) {
	for (var frame_count in this.events) {
		var current_events = this.events[frame_count];
		if (id in current_events) {
			delete current_events[id];
			return true;
		}
	}

	return false;
};

TimeManager.prototype.executeEvents = function () {
	var current_frame_count = this.core.frame_count;
	var current_events = this.events[current_frame_count];

	if (!current_events) return;

	for (var id in current_events) {
		var event = current_events[id];
		event.callback();
	}

	delete this.events[current_frame_count];
};

module.exports = TimeManager;

},{}],21:[function(require,module,exports){
'use strict';
/*
	{
		id:          "number",
		type:        "number",
		name:        "string",
		imageName:   "string",
		soundName:   "string",
		description: "string",
	},
	{
		pk: "id"
	},
*/

// static class

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var MasterDAOGenerator = {};
MasterDAOGenerator.exec = function (type_info, option) {
	if (!type_info || (typeof type_info === "undefined" ? "undefined" : _typeof(type_info)) !== "object") throw new Error("type_info argument must be set");

	option = option || {
		pk: null
	};

	if (!option.pk) throw new Error("pk option must be set");

	// constructor
	var DAOClass = function DAOClass(data) {
		this._data = data || {};
	};

	// properties
	for (var method_name in type_info) {
		var type = type_info[method_name];

		// create property
		(function (method_name) {
			DAOClass.prototype[method_name] = function () {
				return this._data[method_name];
			};
		})(method_name);
	}
	return DAOClass;
};

module.exports = MasterDAOGenerator;

},{}],22:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var MasterDAOGenerator = require("./dao_generator");

// static class
var MasterRepositoryGenerator = {};
MasterRepositoryGenerator.exec = function (type_info, option, data_list) {
	if (!type_info || (typeof type_info === "undefined" ? "undefined" : _typeof(type_info)) !== "object") throw new Error("type_info argument must be set");

	option = option || {
		pk: null,
		validate: false
	};
	data_list = data_list || [];

	if (!option.pk) throw new Error("pk option must be set");

	// create DAO class
	var DAOClass = MasterDAOGenerator.exec(type_info, option);

	// convert array => hash
	var data_hash = {};
	for (var i = 0, len = data_list.length; i < len; i++) {
		var data = data_list[i];

		if (!(option.pk in data)) throw new Error(option.pk + " key data does not exists in master data (index: " + i + ")");

		var pk_value = data[option.pk];

		// create instance
		data_hash[pk_value] = new DAOClass(data);
	}

	// repository is static class.
	var RepositoryClass = {};

	// property
	RepositoryClass.DAOClass = DAOClass;

	// methods
	RepositoryClass.find = function (pk) {
		return data_hash[pk];
	};

	return RepositoryClass;
};

module.exports = MasterRepositoryGenerator;

},{"./dao_generator":21}],23:[function(require,module,exports){
/**
 * @fileoverview gl-matrix - High performance matrix and vector operations
 * @author Brandon Jones
 * @author Colin MacKenzie IV
 * @version 2.3.2
 */

/* Copyright (c) 2015, Brandon Jones, Colin MacKenzie IV.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE. */
// END HEADER

exports.glMatrix = require("./gl-matrix/common.js");
exports.mat2 = require("./gl-matrix/mat2.js");
exports.mat2d = require("./gl-matrix/mat2d.js");
exports.mat3 = require("./gl-matrix/mat3.js");
exports.mat4 = require("./gl-matrix/mat4.js");
exports.quat = require("./gl-matrix/quat.js");
exports.vec2 = require("./gl-matrix/vec2.js");
exports.vec3 = require("./gl-matrix/vec3.js");
exports.vec4 = require("./gl-matrix/vec4.js");
},{"./gl-matrix/common.js":24,"./gl-matrix/mat2.js":25,"./gl-matrix/mat2d.js":26,"./gl-matrix/mat3.js":27,"./gl-matrix/mat4.js":28,"./gl-matrix/quat.js":29,"./gl-matrix/vec2.js":30,"./gl-matrix/vec3.js":31,"./gl-matrix/vec4.js":32}],24:[function(require,module,exports){
/* Copyright (c) 2015, Brandon Jones, Colin MacKenzie IV.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE. */

/**
 * @class Common utilities
 * @name glMatrix
 */
var glMatrix = {};

// Configuration Constants
glMatrix.EPSILON = 0.000001;
glMatrix.ARRAY_TYPE = (typeof Float32Array !== 'undefined') ? Float32Array : Array;
glMatrix.RANDOM = Math.random;
glMatrix.ENABLE_SIMD = false;

// Capability detection
glMatrix.SIMD_AVAILABLE = (glMatrix.ARRAY_TYPE === Float32Array) && ('SIMD' in this);
glMatrix.USE_SIMD = glMatrix.ENABLE_SIMD && glMatrix.SIMD_AVAILABLE;

/**
 * Sets the type of array used when creating new vectors and matrices
 *
 * @param {Type} type Array type, such as Float32Array or Array
 */
glMatrix.setMatrixArrayType = function(type) {
    glMatrix.ARRAY_TYPE = type;
}

var degree = Math.PI / 180;

/**
* Convert Degree To Radian
*
* @param {Number} Angle in Degrees
*/
glMatrix.toRadian = function(a){
     return a * degree;
}

/**
 * Tests whether or not the arguments have approximately the same value, within an absolute
 * or relative tolerance of glMatrix.EPSILON (an absolute tolerance is used for values less 
 * than or equal to 1.0, and a relative tolerance is used for larger values)
 * 
 * @param {Number} a The first number to test.
 * @param {Number} b The second number to test.
 * @returns {Boolean} True if the numbers are approximately equal, false otherwise.
 */
glMatrix.equals = function(a, b) {
	return Math.abs(a - b) <= glMatrix.EPSILON*Math.max(1.0, Math.abs(a), Math.abs(b));
}

module.exports = glMatrix;

},{}],25:[function(require,module,exports){
/* Copyright (c) 2015, Brandon Jones, Colin MacKenzie IV.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE. */

var glMatrix = require("./common.js");

/**
 * @class 2x2 Matrix
 * @name mat2
 */
var mat2 = {};

/**
 * Creates a new identity mat2
 *
 * @returns {mat2} a new 2x2 matrix
 */
mat2.create = function() {
    var out = new glMatrix.ARRAY_TYPE(4);
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 1;
    return out;
};

/**
 * Creates a new mat2 initialized with values from an existing matrix
 *
 * @param {mat2} a matrix to clone
 * @returns {mat2} a new 2x2 matrix
 */
mat2.clone = function(a) {
    var out = new glMatrix.ARRAY_TYPE(4);
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    return out;
};

/**
 * Copy the values from one mat2 to another
 *
 * @param {mat2} out the receiving matrix
 * @param {mat2} a the source matrix
 * @returns {mat2} out
 */
mat2.copy = function(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    return out;
};

/**
 * Set a mat2 to the identity matrix
 *
 * @param {mat2} out the receiving matrix
 * @returns {mat2} out
 */
mat2.identity = function(out) {
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 1;
    return out;
};

/**
 * Create a new mat2 with the given values
 *
 * @param {Number} m00 Component in column 0, row 0 position (index 0)
 * @param {Number} m01 Component in column 0, row 1 position (index 1)
 * @param {Number} m10 Component in column 1, row 0 position (index 2)
 * @param {Number} m11 Component in column 1, row 1 position (index 3)
 * @returns {mat2} out A new 2x2 matrix
 */
mat2.fromValues = function(m00, m01, m10, m11) {
    var out = new glMatrix.ARRAY_TYPE(4);
    out[0] = m00;
    out[1] = m01;
    out[2] = m10;
    out[3] = m11;
    return out;
};

/**
 * Set the components of a mat2 to the given values
 *
 * @param {mat2} out the receiving matrix
 * @param {Number} m00 Component in column 0, row 0 position (index 0)
 * @param {Number} m01 Component in column 0, row 1 position (index 1)
 * @param {Number} m10 Component in column 1, row 0 position (index 2)
 * @param {Number} m11 Component in column 1, row 1 position (index 3)
 * @returns {mat2} out
 */
mat2.set = function(out, m00, m01, m10, m11) {
    out[0] = m00;
    out[1] = m01;
    out[2] = m10;
    out[3] = m11;
    return out;
};


/**
 * Transpose the values of a mat2
 *
 * @param {mat2} out the receiving matrix
 * @param {mat2} a the source matrix
 * @returns {mat2} out
 */
mat2.transpose = function(out, a) {
    // If we are transposing ourselves we can skip a few steps but have to cache some values
    if (out === a) {
        var a1 = a[1];
        out[1] = a[2];
        out[2] = a1;
    } else {
        out[0] = a[0];
        out[1] = a[2];
        out[2] = a[1];
        out[3] = a[3];
    }
    
    return out;
};

/**
 * Inverts a mat2
 *
 * @param {mat2} out the receiving matrix
 * @param {mat2} a the source matrix
 * @returns {mat2} out
 */
mat2.invert = function(out, a) {
    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3],

        // Calculate the determinant
        det = a0 * a3 - a2 * a1;

    if (!det) {
        return null;
    }
    det = 1.0 / det;
    
    out[0] =  a3 * det;
    out[1] = -a1 * det;
    out[2] = -a2 * det;
    out[3] =  a0 * det;

    return out;
};

/**
 * Calculates the adjugate of a mat2
 *
 * @param {mat2} out the receiving matrix
 * @param {mat2} a the source matrix
 * @returns {mat2} out
 */
mat2.adjoint = function(out, a) {
    // Caching this value is nessecary if out == a
    var a0 = a[0];
    out[0] =  a[3];
    out[1] = -a[1];
    out[2] = -a[2];
    out[3] =  a0;

    return out;
};

/**
 * Calculates the determinant of a mat2
 *
 * @param {mat2} a the source matrix
 * @returns {Number} determinant of a
 */
mat2.determinant = function (a) {
    return a[0] * a[3] - a[2] * a[1];
};

/**
 * Multiplies two mat2's
 *
 * @param {mat2} out the receiving matrix
 * @param {mat2} a the first operand
 * @param {mat2} b the second operand
 * @returns {mat2} out
 */
mat2.multiply = function (out, a, b) {
    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3];
    var b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3];
    out[0] = a0 * b0 + a2 * b1;
    out[1] = a1 * b0 + a3 * b1;
    out[2] = a0 * b2 + a2 * b3;
    out[3] = a1 * b2 + a3 * b3;
    return out;
};

/**
 * Alias for {@link mat2.multiply}
 * @function
 */
mat2.mul = mat2.multiply;

/**
 * Rotates a mat2 by the given angle
 *
 * @param {mat2} out the receiving matrix
 * @param {mat2} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat2} out
 */
mat2.rotate = function (out, a, rad) {
    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3],
        s = Math.sin(rad),
        c = Math.cos(rad);
    out[0] = a0 *  c + a2 * s;
    out[1] = a1 *  c + a3 * s;
    out[2] = a0 * -s + a2 * c;
    out[3] = a1 * -s + a3 * c;
    return out;
};

/**
 * Scales the mat2 by the dimensions in the given vec2
 *
 * @param {mat2} out the receiving matrix
 * @param {mat2} a the matrix to rotate
 * @param {vec2} v the vec2 to scale the matrix by
 * @returns {mat2} out
 **/
mat2.scale = function(out, a, v) {
    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3],
        v0 = v[0], v1 = v[1];
    out[0] = a0 * v0;
    out[1] = a1 * v0;
    out[2] = a2 * v1;
    out[3] = a3 * v1;
    return out;
};

/**
 * Creates a matrix from a given angle
 * This is equivalent to (but much faster than):
 *
 *     mat2.identity(dest);
 *     mat2.rotate(dest, dest, rad);
 *
 * @param {mat2} out mat2 receiving operation result
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat2} out
 */
mat2.fromRotation = function(out, rad) {
    var s = Math.sin(rad),
        c = Math.cos(rad);
    out[0] = c;
    out[1] = s;
    out[2] = -s;
    out[3] = c;
    return out;
}

/**
 * Creates a matrix from a vector scaling
 * This is equivalent to (but much faster than):
 *
 *     mat2.identity(dest);
 *     mat2.scale(dest, dest, vec);
 *
 * @param {mat2} out mat2 receiving operation result
 * @param {vec2} v Scaling vector
 * @returns {mat2} out
 */
mat2.fromScaling = function(out, v) {
    out[0] = v[0];
    out[1] = 0;
    out[2] = 0;
    out[3] = v[1];
    return out;
}

/**
 * Returns a string representation of a mat2
 *
 * @param {mat2} mat matrix to represent as a string
 * @returns {String} string representation of the matrix
 */
mat2.str = function (a) {
    return 'mat2(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + a[3] + ')';
};

/**
 * Returns Frobenius norm of a mat2
 *
 * @param {mat2} a the matrix to calculate Frobenius norm of
 * @returns {Number} Frobenius norm
 */
mat2.frob = function (a) {
    return(Math.sqrt(Math.pow(a[0], 2) + Math.pow(a[1], 2) + Math.pow(a[2], 2) + Math.pow(a[3], 2)))
};

/**
 * Returns L, D and U matrices (Lower triangular, Diagonal and Upper triangular) by factorizing the input matrix
 * @param {mat2} L the lower triangular matrix 
 * @param {mat2} D the diagonal matrix 
 * @param {mat2} U the upper triangular matrix 
 * @param {mat2} a the input matrix to factorize
 */

mat2.LDU = function (L, D, U, a) { 
    L[2] = a[2]/a[0]; 
    U[0] = a[0]; 
    U[1] = a[1]; 
    U[3] = a[3] - L[2] * U[1]; 
    return [L, D, U];       
}; 

/**
 * Adds two mat2's
 *
 * @param {mat2} out the receiving matrix
 * @param {mat2} a the first operand
 * @param {mat2} b the second operand
 * @returns {mat2} out
 */
mat2.add = function(out, a, b) {
    out[0] = a[0] + b[0];
    out[1] = a[1] + b[1];
    out[2] = a[2] + b[2];
    out[3] = a[3] + b[3];
    return out;
};

/**
 * Subtracts matrix b from matrix a
 *
 * @param {mat2} out the receiving matrix
 * @param {mat2} a the first operand
 * @param {mat2} b the second operand
 * @returns {mat2} out
 */
mat2.subtract = function(out, a, b) {
    out[0] = a[0] - b[0];
    out[1] = a[1] - b[1];
    out[2] = a[2] - b[2];
    out[3] = a[3] - b[3];
    return out;
};

/**
 * Alias for {@link mat2.subtract}
 * @function
 */
mat2.sub = mat2.subtract;

/**
 * Returns whether or not the matrices have exactly the same elements in the same position (when compared with ===)
 *
 * @param {mat2} a The first matrix.
 * @param {mat2} b The second matrix.
 * @returns {Boolean} True if the matrices are equal, false otherwise.
 */
mat2.exactEquals = function (a, b) {
    return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3];
};

/**
 * Returns whether or not the matrices have approximately the same elements in the same position.
 *
 * @param {mat2} a The first matrix.
 * @param {mat2} b The second matrix.
 * @returns {Boolean} True if the matrices are equal, false otherwise.
 */
mat2.equals = function (a, b) {
    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3];
    var b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3];
    return (Math.abs(a0 - b0) <= glMatrix.EPSILON*Math.max(1.0, Math.abs(a0), Math.abs(b0)) &&
            Math.abs(a1 - b1) <= glMatrix.EPSILON*Math.max(1.0, Math.abs(a1), Math.abs(b1)) &&
            Math.abs(a2 - b2) <= glMatrix.EPSILON*Math.max(1.0, Math.abs(a2), Math.abs(b2)) &&
            Math.abs(a3 - b3) <= glMatrix.EPSILON*Math.max(1.0, Math.abs(a3), Math.abs(b3)));
};

/**
 * Multiply each element of the matrix by a scalar.
 *
 * @param {mat2} out the receiving matrix
 * @param {mat2} a the matrix to scale
 * @param {Number} b amount to scale the matrix's elements by
 * @returns {mat2} out
 */
mat2.multiplyScalar = function(out, a, b) {
    out[0] = a[0] * b;
    out[1] = a[1] * b;
    out[2] = a[2] * b;
    out[3] = a[3] * b;
    return out;
};

/**
 * Adds two mat2's after multiplying each element of the second operand by a scalar value.
 *
 * @param {mat2} out the receiving vector
 * @param {mat2} a the first operand
 * @param {mat2} b the second operand
 * @param {Number} scale the amount to scale b's elements by before adding
 * @returns {mat2} out
 */
mat2.multiplyScalarAndAdd = function(out, a, b, scale) {
    out[0] = a[0] + (b[0] * scale);
    out[1] = a[1] + (b[1] * scale);
    out[2] = a[2] + (b[2] * scale);
    out[3] = a[3] + (b[3] * scale);
    return out;
};

module.exports = mat2;

},{"./common.js":24}],26:[function(require,module,exports){
/* Copyright (c) 2015, Brandon Jones, Colin MacKenzie IV.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE. */

var glMatrix = require("./common.js");

/**
 * @class 2x3 Matrix
 * @name mat2d
 * 
 * @description 
 * A mat2d contains six elements defined as:
 * <pre>
 * [a, c, tx,
 *  b, d, ty]
 * </pre>
 * This is a short form for the 3x3 matrix:
 * <pre>
 * [a, c, tx,
 *  b, d, ty,
 *  0, 0, 1]
 * </pre>
 * The last row is ignored so the array is shorter and operations are faster.
 */
var mat2d = {};

/**
 * Creates a new identity mat2d
 *
 * @returns {mat2d} a new 2x3 matrix
 */
mat2d.create = function() {
    var out = new glMatrix.ARRAY_TYPE(6);
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 1;
    out[4] = 0;
    out[5] = 0;
    return out;
};

/**
 * Creates a new mat2d initialized with values from an existing matrix
 *
 * @param {mat2d} a matrix to clone
 * @returns {mat2d} a new 2x3 matrix
 */
mat2d.clone = function(a) {
    var out = new glMatrix.ARRAY_TYPE(6);
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out[4] = a[4];
    out[5] = a[5];
    return out;
};

/**
 * Copy the values from one mat2d to another
 *
 * @param {mat2d} out the receiving matrix
 * @param {mat2d} a the source matrix
 * @returns {mat2d} out
 */
mat2d.copy = function(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out[4] = a[4];
    out[5] = a[5];
    return out;
};

/**
 * Set a mat2d to the identity matrix
 *
 * @param {mat2d} out the receiving matrix
 * @returns {mat2d} out
 */
mat2d.identity = function(out) {
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 1;
    out[4] = 0;
    out[5] = 0;
    return out;
};

/**
 * Create a new mat2d with the given values
 *
 * @param {Number} a Component A (index 0)
 * @param {Number} b Component B (index 1)
 * @param {Number} c Component C (index 2)
 * @param {Number} d Component D (index 3)
 * @param {Number} tx Component TX (index 4)
 * @param {Number} ty Component TY (index 5)
 * @returns {mat2d} A new mat2d
 */
mat2d.fromValues = function(a, b, c, d, tx, ty) {
    var out = new glMatrix.ARRAY_TYPE(6);
    out[0] = a;
    out[1] = b;
    out[2] = c;
    out[3] = d;
    out[4] = tx;
    out[5] = ty;
    return out;
};

/**
 * Set the components of a mat2d to the given values
 *
 * @param {mat2d} out the receiving matrix
 * @param {Number} a Component A (index 0)
 * @param {Number} b Component B (index 1)
 * @param {Number} c Component C (index 2)
 * @param {Number} d Component D (index 3)
 * @param {Number} tx Component TX (index 4)
 * @param {Number} ty Component TY (index 5)
 * @returns {mat2d} out
 */
mat2d.set = function(out, a, b, c, d, tx, ty) {
    out[0] = a;
    out[1] = b;
    out[2] = c;
    out[3] = d;
    out[4] = tx;
    out[5] = ty;
    return out;
};

/**
 * Inverts a mat2d
 *
 * @param {mat2d} out the receiving matrix
 * @param {mat2d} a the source matrix
 * @returns {mat2d} out
 */
mat2d.invert = function(out, a) {
    var aa = a[0], ab = a[1], ac = a[2], ad = a[3],
        atx = a[4], aty = a[5];

    var det = aa * ad - ab * ac;
    if(!det){
        return null;
    }
    det = 1.0 / det;

    out[0] = ad * det;
    out[1] = -ab * det;
    out[2] = -ac * det;
    out[3] = aa * det;
    out[4] = (ac * aty - ad * atx) * det;
    out[5] = (ab * atx - aa * aty) * det;
    return out;
};

/**
 * Calculates the determinant of a mat2d
 *
 * @param {mat2d} a the source matrix
 * @returns {Number} determinant of a
 */
mat2d.determinant = function (a) {
    return a[0] * a[3] - a[1] * a[2];
};

/**
 * Multiplies two mat2d's
 *
 * @param {mat2d} out the receiving matrix
 * @param {mat2d} a the first operand
 * @param {mat2d} b the second operand
 * @returns {mat2d} out
 */
mat2d.multiply = function (out, a, b) {
    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], a4 = a[4], a5 = a[5],
        b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3], b4 = b[4], b5 = b[5];
    out[0] = a0 * b0 + a2 * b1;
    out[1] = a1 * b0 + a3 * b1;
    out[2] = a0 * b2 + a2 * b3;
    out[3] = a1 * b2 + a3 * b3;
    out[4] = a0 * b4 + a2 * b5 + a4;
    out[5] = a1 * b4 + a3 * b5 + a5;
    return out;
};

/**
 * Alias for {@link mat2d.multiply}
 * @function
 */
mat2d.mul = mat2d.multiply;

/**
 * Rotates a mat2d by the given angle
 *
 * @param {mat2d} out the receiving matrix
 * @param {mat2d} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat2d} out
 */
mat2d.rotate = function (out, a, rad) {
    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], a4 = a[4], a5 = a[5],
        s = Math.sin(rad),
        c = Math.cos(rad);
    out[0] = a0 *  c + a2 * s;
    out[1] = a1 *  c + a3 * s;
    out[2] = a0 * -s + a2 * c;
    out[3] = a1 * -s + a3 * c;
    out[4] = a4;
    out[5] = a5;
    return out;
};

/**
 * Scales the mat2d by the dimensions in the given vec2
 *
 * @param {mat2d} out the receiving matrix
 * @param {mat2d} a the matrix to translate
 * @param {vec2} v the vec2 to scale the matrix by
 * @returns {mat2d} out
 **/
mat2d.scale = function(out, a, v) {
    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], a4 = a[4], a5 = a[5],
        v0 = v[0], v1 = v[1];
    out[0] = a0 * v0;
    out[1] = a1 * v0;
    out[2] = a2 * v1;
    out[3] = a3 * v1;
    out[4] = a4;
    out[5] = a5;
    return out;
};

/**
 * Translates the mat2d by the dimensions in the given vec2
 *
 * @param {mat2d} out the receiving matrix
 * @param {mat2d} a the matrix to translate
 * @param {vec2} v the vec2 to translate the matrix by
 * @returns {mat2d} out
 **/
mat2d.translate = function(out, a, v) {
    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], a4 = a[4], a5 = a[5],
        v0 = v[0], v1 = v[1];
    out[0] = a0;
    out[1] = a1;
    out[2] = a2;
    out[3] = a3;
    out[4] = a0 * v0 + a2 * v1 + a4;
    out[5] = a1 * v0 + a3 * v1 + a5;
    return out;
};

/**
 * Creates a matrix from a given angle
 * This is equivalent to (but much faster than):
 *
 *     mat2d.identity(dest);
 *     mat2d.rotate(dest, dest, rad);
 *
 * @param {mat2d} out mat2d receiving operation result
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat2d} out
 */
mat2d.fromRotation = function(out, rad) {
    var s = Math.sin(rad), c = Math.cos(rad);
    out[0] = c;
    out[1] = s;
    out[2] = -s;
    out[3] = c;
    out[4] = 0;
    out[5] = 0;
    return out;
}

/**
 * Creates a matrix from a vector scaling
 * This is equivalent to (but much faster than):
 *
 *     mat2d.identity(dest);
 *     mat2d.scale(dest, dest, vec);
 *
 * @param {mat2d} out mat2d receiving operation result
 * @param {vec2} v Scaling vector
 * @returns {mat2d} out
 */
mat2d.fromScaling = function(out, v) {
    out[0] = v[0];
    out[1] = 0;
    out[2] = 0;
    out[3] = v[1];
    out[4] = 0;
    out[5] = 0;
    return out;
}

/**
 * Creates a matrix from a vector translation
 * This is equivalent to (but much faster than):
 *
 *     mat2d.identity(dest);
 *     mat2d.translate(dest, dest, vec);
 *
 * @param {mat2d} out mat2d receiving operation result
 * @param {vec2} v Translation vector
 * @returns {mat2d} out
 */
mat2d.fromTranslation = function(out, v) {
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 1;
    out[4] = v[0];
    out[5] = v[1];
    return out;
}

/**
 * Returns a string representation of a mat2d
 *
 * @param {mat2d} a matrix to represent as a string
 * @returns {String} string representation of the matrix
 */
mat2d.str = function (a) {
    return 'mat2d(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + 
                    a[3] + ', ' + a[4] + ', ' + a[5] + ')';
};

/**
 * Returns Frobenius norm of a mat2d
 *
 * @param {mat2d} a the matrix to calculate Frobenius norm of
 * @returns {Number} Frobenius norm
 */
mat2d.frob = function (a) { 
    return(Math.sqrt(Math.pow(a[0], 2) + Math.pow(a[1], 2) + Math.pow(a[2], 2) + Math.pow(a[3], 2) + Math.pow(a[4], 2) + Math.pow(a[5], 2) + 1))
}; 

/**
 * Adds two mat2d's
 *
 * @param {mat2d} out the receiving matrix
 * @param {mat2d} a the first operand
 * @param {mat2d} b the second operand
 * @returns {mat2d} out
 */
mat2d.add = function(out, a, b) {
    out[0] = a[0] + b[0];
    out[1] = a[1] + b[1];
    out[2] = a[2] + b[2];
    out[3] = a[3] + b[3];
    out[4] = a[4] + b[4];
    out[5] = a[5] + b[5];
    return out;
};

/**
 * Subtracts matrix b from matrix a
 *
 * @param {mat2d} out the receiving matrix
 * @param {mat2d} a the first operand
 * @param {mat2d} b the second operand
 * @returns {mat2d} out
 */
mat2d.subtract = function(out, a, b) {
    out[0] = a[0] - b[0];
    out[1] = a[1] - b[1];
    out[2] = a[2] - b[2];
    out[3] = a[3] - b[3];
    out[4] = a[4] - b[4];
    out[5] = a[5] - b[5];
    return out;
};

/**
 * Alias for {@link mat2d.subtract}
 * @function
 */
mat2d.sub = mat2d.subtract;

/**
 * Multiply each element of the matrix by a scalar.
 *
 * @param {mat2d} out the receiving matrix
 * @param {mat2d} a the matrix to scale
 * @param {Number} b amount to scale the matrix's elements by
 * @returns {mat2d} out
 */
mat2d.multiplyScalar = function(out, a, b) {
    out[0] = a[0] * b;
    out[1] = a[1] * b;
    out[2] = a[2] * b;
    out[3] = a[3] * b;
    out[4] = a[4] * b;
    out[5] = a[5] * b;
    return out;
};

/**
 * Adds two mat2d's after multiplying each element of the second operand by a scalar value.
 *
 * @param {mat2d} out the receiving vector
 * @param {mat2d} a the first operand
 * @param {mat2d} b the second operand
 * @param {Number} scale the amount to scale b's elements by before adding
 * @returns {mat2d} out
 */
mat2d.multiplyScalarAndAdd = function(out, a, b, scale) {
    out[0] = a[0] + (b[0] * scale);
    out[1] = a[1] + (b[1] * scale);
    out[2] = a[2] + (b[2] * scale);
    out[3] = a[3] + (b[3] * scale);
    out[4] = a[4] + (b[4] * scale);
    out[5] = a[5] + (b[5] * scale);
    return out;
};

/**
 * Returns whether or not the matrices have exactly the same elements in the same position (when compared with ===)
 *
 * @param {mat2d} a The first matrix.
 * @param {mat2d} b The second matrix.
 * @returns {Boolean} True if the matrices are equal, false otherwise.
 */
mat2d.exactEquals = function (a, b) {
    return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3] && a[4] === b[4] && a[5] === b[5];
};

/**
 * Returns whether or not the matrices have approximately the same elements in the same position.
 *
 * @param {mat2d} a The first matrix.
 * @param {mat2d} b The second matrix.
 * @returns {Boolean} True if the matrices are equal, false otherwise.
 */
mat2d.equals = function (a, b) {
    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], a4 = a[4], a5 = a[5];
    var b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3], b4 = b[4], b5 = b[5];
    return (Math.abs(a0 - b0) <= glMatrix.EPSILON*Math.max(1.0, Math.abs(a0), Math.abs(b0)) &&
            Math.abs(a1 - b1) <= glMatrix.EPSILON*Math.max(1.0, Math.abs(a1), Math.abs(b1)) &&
            Math.abs(a2 - b2) <= glMatrix.EPSILON*Math.max(1.0, Math.abs(a2), Math.abs(b2)) &&
            Math.abs(a3 - b3) <= glMatrix.EPSILON*Math.max(1.0, Math.abs(a3), Math.abs(b3)) &&
            Math.abs(a4 - b4) <= glMatrix.EPSILON*Math.max(1.0, Math.abs(a4), Math.abs(b4)) &&
            Math.abs(a5 - b5) <= glMatrix.EPSILON*Math.max(1.0, Math.abs(a5), Math.abs(b5)));
};

module.exports = mat2d;

},{"./common.js":24}],27:[function(require,module,exports){
/* Copyright (c) 2015, Brandon Jones, Colin MacKenzie IV.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE. */

var glMatrix = require("./common.js");

/**
 * @class 3x3 Matrix
 * @name mat3
 */
var mat3 = {};

/**
 * Creates a new identity mat3
 *
 * @returns {mat3} a new 3x3 matrix
 */
mat3.create = function() {
    var out = new glMatrix.ARRAY_TYPE(9);
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 1;
    out[5] = 0;
    out[6] = 0;
    out[7] = 0;
    out[8] = 1;
    return out;
};

/**
 * Copies the upper-left 3x3 values into the given mat3.
 *
 * @param {mat3} out the receiving 3x3 matrix
 * @param {mat4} a   the source 4x4 matrix
 * @returns {mat3} out
 */
mat3.fromMat4 = function(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[4];
    out[4] = a[5];
    out[5] = a[6];
    out[6] = a[8];
    out[7] = a[9];
    out[8] = a[10];
    return out;
};

/**
 * Creates a new mat3 initialized with values from an existing matrix
 *
 * @param {mat3} a matrix to clone
 * @returns {mat3} a new 3x3 matrix
 */
mat3.clone = function(a) {
    var out = new glMatrix.ARRAY_TYPE(9);
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out[4] = a[4];
    out[5] = a[5];
    out[6] = a[6];
    out[7] = a[7];
    out[8] = a[8];
    return out;
};

/**
 * Copy the values from one mat3 to another
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the source matrix
 * @returns {mat3} out
 */
mat3.copy = function(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out[4] = a[4];
    out[5] = a[5];
    out[6] = a[6];
    out[7] = a[7];
    out[8] = a[8];
    return out;
};

/**
 * Create a new mat3 with the given values
 *
 * @param {Number} m00 Component in column 0, row 0 position (index 0)
 * @param {Number} m01 Component in column 0, row 1 position (index 1)
 * @param {Number} m02 Component in column 0, row 2 position (index 2)
 * @param {Number} m10 Component in column 1, row 0 position (index 3)
 * @param {Number} m11 Component in column 1, row 1 position (index 4)
 * @param {Number} m12 Component in column 1, row 2 position (index 5)
 * @param {Number} m20 Component in column 2, row 0 position (index 6)
 * @param {Number} m21 Component in column 2, row 1 position (index 7)
 * @param {Number} m22 Component in column 2, row 2 position (index 8)
 * @returns {mat3} A new mat3
 */
mat3.fromValues = function(m00, m01, m02, m10, m11, m12, m20, m21, m22) {
    var out = new glMatrix.ARRAY_TYPE(9);
    out[0] = m00;
    out[1] = m01;
    out[2] = m02;
    out[3] = m10;
    out[4] = m11;
    out[5] = m12;
    out[6] = m20;
    out[7] = m21;
    out[8] = m22;
    return out;
};

/**
 * Set the components of a mat3 to the given values
 *
 * @param {mat3} out the receiving matrix
 * @param {Number} m00 Component in column 0, row 0 position (index 0)
 * @param {Number} m01 Component in column 0, row 1 position (index 1)
 * @param {Number} m02 Component in column 0, row 2 position (index 2)
 * @param {Number} m10 Component in column 1, row 0 position (index 3)
 * @param {Number} m11 Component in column 1, row 1 position (index 4)
 * @param {Number} m12 Component in column 1, row 2 position (index 5)
 * @param {Number} m20 Component in column 2, row 0 position (index 6)
 * @param {Number} m21 Component in column 2, row 1 position (index 7)
 * @param {Number} m22 Component in column 2, row 2 position (index 8)
 * @returns {mat3} out
 */
mat3.set = function(out, m00, m01, m02, m10, m11, m12, m20, m21, m22) {
    out[0] = m00;
    out[1] = m01;
    out[2] = m02;
    out[3] = m10;
    out[4] = m11;
    out[5] = m12;
    out[6] = m20;
    out[7] = m21;
    out[8] = m22;
    return out;
};

/**
 * Set a mat3 to the identity matrix
 *
 * @param {mat3} out the receiving matrix
 * @returns {mat3} out
 */
mat3.identity = function(out) {
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 1;
    out[5] = 0;
    out[6] = 0;
    out[7] = 0;
    out[8] = 1;
    return out;
};

/**
 * Transpose the values of a mat3
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the source matrix
 * @returns {mat3} out
 */
mat3.transpose = function(out, a) {
    // If we are transposing ourselves we can skip a few steps but have to cache some values
    if (out === a) {
        var a01 = a[1], a02 = a[2], a12 = a[5];
        out[1] = a[3];
        out[2] = a[6];
        out[3] = a01;
        out[5] = a[7];
        out[6] = a02;
        out[7] = a12;
    } else {
        out[0] = a[0];
        out[1] = a[3];
        out[2] = a[6];
        out[3] = a[1];
        out[4] = a[4];
        out[5] = a[7];
        out[6] = a[2];
        out[7] = a[5];
        out[8] = a[8];
    }
    
    return out;
};

/**
 * Inverts a mat3
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the source matrix
 * @returns {mat3} out
 */
mat3.invert = function(out, a) {
    var a00 = a[0], a01 = a[1], a02 = a[2],
        a10 = a[3], a11 = a[4], a12 = a[5],
        a20 = a[6], a21 = a[7], a22 = a[8],

        b01 = a22 * a11 - a12 * a21,
        b11 = -a22 * a10 + a12 * a20,
        b21 = a21 * a10 - a11 * a20,

        // Calculate the determinant
        det = a00 * b01 + a01 * b11 + a02 * b21;

    if (!det) { 
        return null; 
    }
    det = 1.0 / det;

    out[0] = b01 * det;
    out[1] = (-a22 * a01 + a02 * a21) * det;
    out[2] = (a12 * a01 - a02 * a11) * det;
    out[3] = b11 * det;
    out[4] = (a22 * a00 - a02 * a20) * det;
    out[5] = (-a12 * a00 + a02 * a10) * det;
    out[6] = b21 * det;
    out[7] = (-a21 * a00 + a01 * a20) * det;
    out[8] = (a11 * a00 - a01 * a10) * det;
    return out;
};

/**
 * Calculates the adjugate of a mat3
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the source matrix
 * @returns {mat3} out
 */
mat3.adjoint = function(out, a) {
    var a00 = a[0], a01 = a[1], a02 = a[2],
        a10 = a[3], a11 = a[4], a12 = a[5],
        a20 = a[6], a21 = a[7], a22 = a[8];

    out[0] = (a11 * a22 - a12 * a21);
    out[1] = (a02 * a21 - a01 * a22);
    out[2] = (a01 * a12 - a02 * a11);
    out[3] = (a12 * a20 - a10 * a22);
    out[4] = (a00 * a22 - a02 * a20);
    out[5] = (a02 * a10 - a00 * a12);
    out[6] = (a10 * a21 - a11 * a20);
    out[7] = (a01 * a20 - a00 * a21);
    out[8] = (a00 * a11 - a01 * a10);
    return out;
};

/**
 * Calculates the determinant of a mat3
 *
 * @param {mat3} a the source matrix
 * @returns {Number} determinant of a
 */
mat3.determinant = function (a) {
    var a00 = a[0], a01 = a[1], a02 = a[2],
        a10 = a[3], a11 = a[4], a12 = a[5],
        a20 = a[6], a21 = a[7], a22 = a[8];

    return a00 * (a22 * a11 - a12 * a21) + a01 * (-a22 * a10 + a12 * a20) + a02 * (a21 * a10 - a11 * a20);
};

/**
 * Multiplies two mat3's
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the first operand
 * @param {mat3} b the second operand
 * @returns {mat3} out
 */
mat3.multiply = function (out, a, b) {
    var a00 = a[0], a01 = a[1], a02 = a[2],
        a10 = a[3], a11 = a[4], a12 = a[5],
        a20 = a[6], a21 = a[7], a22 = a[8],

        b00 = b[0], b01 = b[1], b02 = b[2],
        b10 = b[3], b11 = b[4], b12 = b[5],
        b20 = b[6], b21 = b[7], b22 = b[8];

    out[0] = b00 * a00 + b01 * a10 + b02 * a20;
    out[1] = b00 * a01 + b01 * a11 + b02 * a21;
    out[2] = b00 * a02 + b01 * a12 + b02 * a22;

    out[3] = b10 * a00 + b11 * a10 + b12 * a20;
    out[4] = b10 * a01 + b11 * a11 + b12 * a21;
    out[5] = b10 * a02 + b11 * a12 + b12 * a22;

    out[6] = b20 * a00 + b21 * a10 + b22 * a20;
    out[7] = b20 * a01 + b21 * a11 + b22 * a21;
    out[8] = b20 * a02 + b21 * a12 + b22 * a22;
    return out;
};

/**
 * Alias for {@link mat3.multiply}
 * @function
 */
mat3.mul = mat3.multiply;

/**
 * Translate a mat3 by the given vector
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the matrix to translate
 * @param {vec2} v vector to translate by
 * @returns {mat3} out
 */
mat3.translate = function(out, a, v) {
    var a00 = a[0], a01 = a[1], a02 = a[2],
        a10 = a[3], a11 = a[4], a12 = a[5],
        a20 = a[6], a21 = a[7], a22 = a[8],
        x = v[0], y = v[1];

    out[0] = a00;
    out[1] = a01;
    out[2] = a02;

    out[3] = a10;
    out[4] = a11;
    out[5] = a12;

    out[6] = x * a00 + y * a10 + a20;
    out[7] = x * a01 + y * a11 + a21;
    out[8] = x * a02 + y * a12 + a22;
    return out;
};

/**
 * Rotates a mat3 by the given angle
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat3} out
 */
mat3.rotate = function (out, a, rad) {
    var a00 = a[0], a01 = a[1], a02 = a[2],
        a10 = a[3], a11 = a[4], a12 = a[5],
        a20 = a[6], a21 = a[7], a22 = a[8],

        s = Math.sin(rad),
        c = Math.cos(rad);

    out[0] = c * a00 + s * a10;
    out[1] = c * a01 + s * a11;
    out[2] = c * a02 + s * a12;

    out[3] = c * a10 - s * a00;
    out[4] = c * a11 - s * a01;
    out[5] = c * a12 - s * a02;

    out[6] = a20;
    out[7] = a21;
    out[8] = a22;
    return out;
};

/**
 * Scales the mat3 by the dimensions in the given vec2
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the matrix to rotate
 * @param {vec2} v the vec2 to scale the matrix by
 * @returns {mat3} out
 **/
mat3.scale = function(out, a, v) {
    var x = v[0], y = v[1];

    out[0] = x * a[0];
    out[1] = x * a[1];
    out[2] = x * a[2];

    out[3] = y * a[3];
    out[4] = y * a[4];
    out[5] = y * a[5];

    out[6] = a[6];
    out[7] = a[7];
    out[8] = a[8];
    return out;
};

/**
 * Creates a matrix from a vector translation
 * This is equivalent to (but much faster than):
 *
 *     mat3.identity(dest);
 *     mat3.translate(dest, dest, vec);
 *
 * @param {mat3} out mat3 receiving operation result
 * @param {vec2} v Translation vector
 * @returns {mat3} out
 */
mat3.fromTranslation = function(out, v) {
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 1;
    out[5] = 0;
    out[6] = v[0];
    out[7] = v[1];
    out[8] = 1;
    return out;
}

/**
 * Creates a matrix from a given angle
 * This is equivalent to (but much faster than):
 *
 *     mat3.identity(dest);
 *     mat3.rotate(dest, dest, rad);
 *
 * @param {mat3} out mat3 receiving operation result
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat3} out
 */
mat3.fromRotation = function(out, rad) {
    var s = Math.sin(rad), c = Math.cos(rad);

    out[0] = c;
    out[1] = s;
    out[2] = 0;

    out[3] = -s;
    out[4] = c;
    out[5] = 0;

    out[6] = 0;
    out[7] = 0;
    out[8] = 1;
    return out;
}

/**
 * Creates a matrix from a vector scaling
 * This is equivalent to (but much faster than):
 *
 *     mat3.identity(dest);
 *     mat3.scale(dest, dest, vec);
 *
 * @param {mat3} out mat3 receiving operation result
 * @param {vec2} v Scaling vector
 * @returns {mat3} out
 */
mat3.fromScaling = function(out, v) {
    out[0] = v[0];
    out[1] = 0;
    out[2] = 0;

    out[3] = 0;
    out[4] = v[1];
    out[5] = 0;

    out[6] = 0;
    out[7] = 0;
    out[8] = 1;
    return out;
}

/**
 * Copies the values from a mat2d into a mat3
 *
 * @param {mat3} out the receiving matrix
 * @param {mat2d} a the matrix to copy
 * @returns {mat3} out
 **/
mat3.fromMat2d = function(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = 0;

    out[3] = a[2];
    out[4] = a[3];
    out[5] = 0;

    out[6] = a[4];
    out[7] = a[5];
    out[8] = 1;
    return out;
};

/**
* Calculates a 3x3 matrix from the given quaternion
*
* @param {mat3} out mat3 receiving operation result
* @param {quat} q Quaternion to create matrix from
*
* @returns {mat3} out
*/
mat3.fromQuat = function (out, q) {
    var x = q[0], y = q[1], z = q[2], w = q[3],
        x2 = x + x,
        y2 = y + y,
        z2 = z + z,

        xx = x * x2,
        yx = y * x2,
        yy = y * y2,
        zx = z * x2,
        zy = z * y2,
        zz = z * z2,
        wx = w * x2,
        wy = w * y2,
        wz = w * z2;

    out[0] = 1 - yy - zz;
    out[3] = yx - wz;
    out[6] = zx + wy;

    out[1] = yx + wz;
    out[4] = 1 - xx - zz;
    out[7] = zy - wx;

    out[2] = zx - wy;
    out[5] = zy + wx;
    out[8] = 1 - xx - yy;

    return out;
};

/**
* Calculates a 3x3 normal matrix (transpose inverse) from the 4x4 matrix
*
* @param {mat3} out mat3 receiving operation result
* @param {mat4} a Mat4 to derive the normal matrix from
*
* @returns {mat3} out
*/
mat3.normalFromMat4 = function (out, a) {
    var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3],
        a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
        a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11],
        a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15],

        b00 = a00 * a11 - a01 * a10,
        b01 = a00 * a12 - a02 * a10,
        b02 = a00 * a13 - a03 * a10,
        b03 = a01 * a12 - a02 * a11,
        b04 = a01 * a13 - a03 * a11,
        b05 = a02 * a13 - a03 * a12,
        b06 = a20 * a31 - a21 * a30,
        b07 = a20 * a32 - a22 * a30,
        b08 = a20 * a33 - a23 * a30,
        b09 = a21 * a32 - a22 * a31,
        b10 = a21 * a33 - a23 * a31,
        b11 = a22 * a33 - a23 * a32,

        // Calculate the determinant
        det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

    if (!det) { 
        return null; 
    }
    det = 1.0 / det;

    out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
    out[1] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
    out[2] = (a10 * b10 - a11 * b08 + a13 * b06) * det;

    out[3] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
    out[4] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
    out[5] = (a01 * b08 - a00 * b10 - a03 * b06) * det;

    out[6] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
    out[7] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
    out[8] = (a30 * b04 - a31 * b02 + a33 * b00) * det;

    return out;
};

/**
 * Returns a string representation of a mat3
 *
 * @param {mat3} mat matrix to represent as a string
 * @returns {String} string representation of the matrix
 */
mat3.str = function (a) {
    return 'mat3(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + 
                    a[3] + ', ' + a[4] + ', ' + a[5] + ', ' + 
                    a[6] + ', ' + a[7] + ', ' + a[8] + ')';
};

/**
 * Returns Frobenius norm of a mat3
 *
 * @param {mat3} a the matrix to calculate Frobenius norm of
 * @returns {Number} Frobenius norm
 */
mat3.frob = function (a) {
    return(Math.sqrt(Math.pow(a[0], 2) + Math.pow(a[1], 2) + Math.pow(a[2], 2) + Math.pow(a[3], 2) + Math.pow(a[4], 2) + Math.pow(a[5], 2) + Math.pow(a[6], 2) + Math.pow(a[7], 2) + Math.pow(a[8], 2)))
};

/**
 * Adds two mat3's
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the first operand
 * @param {mat3} b the second operand
 * @returns {mat3} out
 */
mat3.add = function(out, a, b) {
    out[0] = a[0] + b[0];
    out[1] = a[1] + b[1];
    out[2] = a[2] + b[2];
    out[3] = a[3] + b[3];
    out[4] = a[4] + b[4];
    out[5] = a[5] + b[5];
    out[6] = a[6] + b[6];
    out[7] = a[7] + b[7];
    out[8] = a[8] + b[8];
    return out;
};

/**
 * Subtracts matrix b from matrix a
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the first operand
 * @param {mat3} b the second operand
 * @returns {mat3} out
 */
mat3.subtract = function(out, a, b) {
    out[0] = a[0] - b[0];
    out[1] = a[1] - b[1];
    out[2] = a[2] - b[2];
    out[3] = a[3] - b[3];
    out[4] = a[4] - b[4];
    out[5] = a[5] - b[5];
    out[6] = a[6] - b[6];
    out[7] = a[7] - b[7];
    out[8] = a[8] - b[8];
    return out;
};

/**
 * Alias for {@link mat3.subtract}
 * @function
 */
mat3.sub = mat3.subtract;

/**
 * Multiply each element of the matrix by a scalar.
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the matrix to scale
 * @param {Number} b amount to scale the matrix's elements by
 * @returns {mat3} out
 */
mat3.multiplyScalar = function(out, a, b) {
    out[0] = a[0] * b;
    out[1] = a[1] * b;
    out[2] = a[2] * b;
    out[3] = a[3] * b;
    out[4] = a[4] * b;
    out[5] = a[5] * b;
    out[6] = a[6] * b;
    out[7] = a[7] * b;
    out[8] = a[8] * b;
    return out;
};

/**
 * Adds two mat3's after multiplying each element of the second operand by a scalar value.
 *
 * @param {mat3} out the receiving vector
 * @param {mat3} a the first operand
 * @param {mat3} b the second operand
 * @param {Number} scale the amount to scale b's elements by before adding
 * @returns {mat3} out
 */
mat3.multiplyScalarAndAdd = function(out, a, b, scale) {
    out[0] = a[0] + (b[0] * scale);
    out[1] = a[1] + (b[1] * scale);
    out[2] = a[2] + (b[2] * scale);
    out[3] = a[3] + (b[3] * scale);
    out[4] = a[4] + (b[4] * scale);
    out[5] = a[5] + (b[5] * scale);
    out[6] = a[6] + (b[6] * scale);
    out[7] = a[7] + (b[7] * scale);
    out[8] = a[8] + (b[8] * scale);
    return out;
};

/*
 * Returns whether or not the matrices have exactly the same elements in the same position (when compared with ===)
 *
 * @param {mat3} a The first matrix.
 * @param {mat3} b The second matrix.
 * @returns {Boolean} True if the matrices are equal, false otherwise.
 */
mat3.exactEquals = function (a, b) {
    return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && 
           a[3] === b[3] && a[4] === b[4] && a[5] === b[5] &&
           a[6] === b[6] && a[7] === b[7] && a[8] === b[8];
};

/**
 * Returns whether or not the matrices have approximately the same elements in the same position.
 *
 * @param {mat3} a The first matrix.
 * @param {mat3} b The second matrix.
 * @returns {Boolean} True if the matrices are equal, false otherwise.
 */
mat3.equals = function (a, b) {
    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], a4 = a[4], a5 = a[5], a6 = a[6], a7 = a[7], a8 = a[8];
    var b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3], b4 = b[4], b5 = b[5], b6 = a[6], b7 = b[7], b8 = b[8];
    return (Math.abs(a0 - b0) <= glMatrix.EPSILON*Math.max(1.0, Math.abs(a0), Math.abs(b0)) &&
            Math.abs(a1 - b1) <= glMatrix.EPSILON*Math.max(1.0, Math.abs(a1), Math.abs(b1)) &&
            Math.abs(a2 - b2) <= glMatrix.EPSILON*Math.max(1.0, Math.abs(a2), Math.abs(b2)) &&
            Math.abs(a3 - b3) <= glMatrix.EPSILON*Math.max(1.0, Math.abs(a3), Math.abs(b3)) &&
            Math.abs(a4 - b4) <= glMatrix.EPSILON*Math.max(1.0, Math.abs(a4), Math.abs(b4)) &&
            Math.abs(a5 - b5) <= glMatrix.EPSILON*Math.max(1.0, Math.abs(a5), Math.abs(b5)) &&
            Math.abs(a6 - b6) <= glMatrix.EPSILON*Math.max(1.0, Math.abs(a6), Math.abs(b6)) &&
            Math.abs(a7 - b7) <= glMatrix.EPSILON*Math.max(1.0, Math.abs(a7), Math.abs(b7)) &&
            Math.abs(a8 - b8) <= glMatrix.EPSILON*Math.max(1.0, Math.abs(a8), Math.abs(b8)));
};


module.exports = mat3;

},{"./common.js":24}],28:[function(require,module,exports){
/* Copyright (c) 2015, Brandon Jones, Colin MacKenzie IV.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE. */

var glMatrix = require("./common.js");

/**
 * @class 4x4 Matrix
 * @name mat4
 */
var mat4 = {
  scalar: {},
  SIMD: {},
};

/**
 * Creates a new identity mat4
 *
 * @returns {mat4} a new 4x4 matrix
 */
mat4.create = function() {
    var out = new glMatrix.ARRAY_TYPE(16);
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = 1;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 1;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
};

/**
 * Creates a new mat4 initialized with values from an existing matrix
 *
 * @param {mat4} a matrix to clone
 * @returns {mat4} a new 4x4 matrix
 */
mat4.clone = function(a) {
    var out = new glMatrix.ARRAY_TYPE(16);
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out[4] = a[4];
    out[5] = a[5];
    out[6] = a[6];
    out[7] = a[7];
    out[8] = a[8];
    out[9] = a[9];
    out[10] = a[10];
    out[11] = a[11];
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
    return out;
};

/**
 * Copy the values from one mat4 to another
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the source matrix
 * @returns {mat4} out
 */
mat4.copy = function(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out[4] = a[4];
    out[5] = a[5];
    out[6] = a[6];
    out[7] = a[7];
    out[8] = a[8];
    out[9] = a[9];
    out[10] = a[10];
    out[11] = a[11];
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
    return out;
};

/**
 * Create a new mat4 with the given values
 *
 * @param {Number} m00 Component in column 0, row 0 position (index 0)
 * @param {Number} m01 Component in column 0, row 1 position (index 1)
 * @param {Number} m02 Component in column 0, row 2 position (index 2)
 * @param {Number} m03 Component in column 0, row 3 position (index 3)
 * @param {Number} m10 Component in column 1, row 0 position (index 4)
 * @param {Number} m11 Component in column 1, row 1 position (index 5)
 * @param {Number} m12 Component in column 1, row 2 position (index 6)
 * @param {Number} m13 Component in column 1, row 3 position (index 7)
 * @param {Number} m20 Component in column 2, row 0 position (index 8)
 * @param {Number} m21 Component in column 2, row 1 position (index 9)
 * @param {Number} m22 Component in column 2, row 2 position (index 10)
 * @param {Number} m23 Component in column 2, row 3 position (index 11)
 * @param {Number} m30 Component in column 3, row 0 position (index 12)
 * @param {Number} m31 Component in column 3, row 1 position (index 13)
 * @param {Number} m32 Component in column 3, row 2 position (index 14)
 * @param {Number} m33 Component in column 3, row 3 position (index 15)
 * @returns {mat4} A new mat4
 */
mat4.fromValues = function(m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33) {
    var out = new glMatrix.ARRAY_TYPE(16);
    out[0] = m00;
    out[1] = m01;
    out[2] = m02;
    out[3] = m03;
    out[4] = m10;
    out[5] = m11;
    out[6] = m12;
    out[7] = m13;
    out[8] = m20;
    out[9] = m21;
    out[10] = m22;
    out[11] = m23;
    out[12] = m30;
    out[13] = m31;
    out[14] = m32;
    out[15] = m33;
    return out;
};

/**
 * Set the components of a mat4 to the given values
 *
 * @param {mat4} out the receiving matrix
 * @param {Number} m00 Component in column 0, row 0 position (index 0)
 * @param {Number} m01 Component in column 0, row 1 position (index 1)
 * @param {Number} m02 Component in column 0, row 2 position (index 2)
 * @param {Number} m03 Component in column 0, row 3 position (index 3)
 * @param {Number} m10 Component in column 1, row 0 position (index 4)
 * @param {Number} m11 Component in column 1, row 1 position (index 5)
 * @param {Number} m12 Component in column 1, row 2 position (index 6)
 * @param {Number} m13 Component in column 1, row 3 position (index 7)
 * @param {Number} m20 Component in column 2, row 0 position (index 8)
 * @param {Number} m21 Component in column 2, row 1 position (index 9)
 * @param {Number} m22 Component in column 2, row 2 position (index 10)
 * @param {Number} m23 Component in column 2, row 3 position (index 11)
 * @param {Number} m30 Component in column 3, row 0 position (index 12)
 * @param {Number} m31 Component in column 3, row 1 position (index 13)
 * @param {Number} m32 Component in column 3, row 2 position (index 14)
 * @param {Number} m33 Component in column 3, row 3 position (index 15)
 * @returns {mat4} out
 */
mat4.set = function(out, m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33) {
    out[0] = m00;
    out[1] = m01;
    out[2] = m02;
    out[3] = m03;
    out[4] = m10;
    out[5] = m11;
    out[6] = m12;
    out[7] = m13;
    out[8] = m20;
    out[9] = m21;
    out[10] = m22;
    out[11] = m23;
    out[12] = m30;
    out[13] = m31;
    out[14] = m32;
    out[15] = m33;
    return out;
};


/**
 * Set a mat4 to the identity matrix
 *
 * @param {mat4} out the receiving matrix
 * @returns {mat4} out
 */
mat4.identity = function(out) {
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = 1;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 1;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
};

/**
 * Transpose the values of a mat4 not using SIMD
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the source matrix
 * @returns {mat4} out
 */
mat4.scalar.transpose = function(out, a) {
    // If we are transposing ourselves we can skip a few steps but have to cache some values
    if (out === a) {
        var a01 = a[1], a02 = a[2], a03 = a[3],
            a12 = a[6], a13 = a[7],
            a23 = a[11];

        out[1] = a[4];
        out[2] = a[8];
        out[3] = a[12];
        out[4] = a01;
        out[6] = a[9];
        out[7] = a[13];
        out[8] = a02;
        out[9] = a12;
        out[11] = a[14];
        out[12] = a03;
        out[13] = a13;
        out[14] = a23;
    } else {
        out[0] = a[0];
        out[1] = a[4];
        out[2] = a[8];
        out[3] = a[12];
        out[4] = a[1];
        out[5] = a[5];
        out[6] = a[9];
        out[7] = a[13];
        out[8] = a[2];
        out[9] = a[6];
        out[10] = a[10];
        out[11] = a[14];
        out[12] = a[3];
        out[13] = a[7];
        out[14] = a[11];
        out[15] = a[15];
    }

    return out;
};

/**
 * Transpose the values of a mat4 using SIMD
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the source matrix
 * @returns {mat4} out
 */
mat4.SIMD.transpose = function(out, a) {
    var a0, a1, a2, a3,
        tmp01, tmp23,
        out0, out1, out2, out3;

    a0 = SIMD.Float32x4.load(a, 0);
    a1 = SIMD.Float32x4.load(a, 4);
    a2 = SIMD.Float32x4.load(a, 8);
    a3 = SIMD.Float32x4.load(a, 12);

    tmp01 = SIMD.Float32x4.shuffle(a0, a1, 0, 1, 4, 5);
    tmp23 = SIMD.Float32x4.shuffle(a2, a3, 0, 1, 4, 5);
    out0  = SIMD.Float32x4.shuffle(tmp01, tmp23, 0, 2, 4, 6);
    out1  = SIMD.Float32x4.shuffle(tmp01, tmp23, 1, 3, 5, 7);
    SIMD.Float32x4.store(out, 0,  out0);
    SIMD.Float32x4.store(out, 4,  out1);

    tmp01 = SIMD.Float32x4.shuffle(a0, a1, 2, 3, 6, 7);
    tmp23 = SIMD.Float32x4.shuffle(a2, a3, 2, 3, 6, 7);
    out2  = SIMD.Float32x4.shuffle(tmp01, tmp23, 0, 2, 4, 6);
    out3  = SIMD.Float32x4.shuffle(tmp01, tmp23, 1, 3, 5, 7);
    SIMD.Float32x4.store(out, 8,  out2);
    SIMD.Float32x4.store(out, 12, out3);

    return out;
};

/**
 * Transpse a mat4 using SIMD if available and enabled
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the source matrix
 * @returns {mat4} out
 */
mat4.transpose = glMatrix.USE_SIMD ? mat4.SIMD.transpose : mat4.scalar.transpose;

/**
 * Inverts a mat4 not using SIMD
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the source matrix
 * @returns {mat4} out
 */
mat4.scalar.invert = function(out, a) {
    var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3],
        a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
        a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11],
        a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15],

        b00 = a00 * a11 - a01 * a10,
        b01 = a00 * a12 - a02 * a10,
        b02 = a00 * a13 - a03 * a10,
        b03 = a01 * a12 - a02 * a11,
        b04 = a01 * a13 - a03 * a11,
        b05 = a02 * a13 - a03 * a12,
        b06 = a20 * a31 - a21 * a30,
        b07 = a20 * a32 - a22 * a30,
        b08 = a20 * a33 - a23 * a30,
        b09 = a21 * a32 - a22 * a31,
        b10 = a21 * a33 - a23 * a31,
        b11 = a22 * a33 - a23 * a32,

        // Calculate the determinant
        det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

    if (!det) {
        return null;
    }
    det = 1.0 / det;

    out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
    out[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
    out[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
    out[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
    out[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
    out[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
    out[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
    out[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
    out[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
    out[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
    out[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
    out[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
    out[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
    out[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
    out[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
    out[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;

    return out;
};

/**
 * Inverts a mat4 using SIMD
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the source matrix
 * @returns {mat4} out
 */
mat4.SIMD.invert = function(out, a) {
  var row0, row1, row2, row3,
      tmp1,
      minor0, minor1, minor2, minor3,
      det,
      a0 = SIMD.Float32x4.load(a, 0),
      a1 = SIMD.Float32x4.load(a, 4),
      a2 = SIMD.Float32x4.load(a, 8),
      a3 = SIMD.Float32x4.load(a, 12);

  // Compute matrix adjugate
  tmp1 = SIMD.Float32x4.shuffle(a0, a1, 0, 1, 4, 5);
  row1 = SIMD.Float32x4.shuffle(a2, a3, 0, 1, 4, 5);
  row0 = SIMD.Float32x4.shuffle(tmp1, row1, 0, 2, 4, 6);
  row1 = SIMD.Float32x4.shuffle(row1, tmp1, 1, 3, 5, 7);
  tmp1 = SIMD.Float32x4.shuffle(a0, a1, 2, 3, 6, 7);
  row3 = SIMD.Float32x4.shuffle(a2, a3, 2, 3, 6, 7);
  row2 = SIMD.Float32x4.shuffle(tmp1, row3, 0, 2, 4, 6);
  row3 = SIMD.Float32x4.shuffle(row3, tmp1, 1, 3, 5, 7);

  tmp1   = SIMD.Float32x4.mul(row2, row3);
  tmp1   = SIMD.Float32x4.swizzle(tmp1, 1, 0, 3, 2);
  minor0 = SIMD.Float32x4.mul(row1, tmp1);
  minor1 = SIMD.Float32x4.mul(row0, tmp1);
  tmp1   = SIMD.Float32x4.swizzle(tmp1, 2, 3, 0, 1);
  minor0 = SIMD.Float32x4.sub(SIMD.Float32x4.mul(row1, tmp1), minor0);
  minor1 = SIMD.Float32x4.sub(SIMD.Float32x4.mul(row0, tmp1), minor1);
  minor1 = SIMD.Float32x4.swizzle(minor1, 2, 3, 0, 1);

  tmp1   = SIMD.Float32x4.mul(row1, row2);
  tmp1   = SIMD.Float32x4.swizzle(tmp1, 1, 0, 3, 2);
  minor0 = SIMD.Float32x4.add(SIMD.Float32x4.mul(row3, tmp1), minor0);
  minor3 = SIMD.Float32x4.mul(row0, tmp1);
  tmp1   = SIMD.Float32x4.swizzle(tmp1, 2, 3, 0, 1);
  minor0 = SIMD.Float32x4.sub(minor0, SIMD.Float32x4.mul(row3, tmp1));
  minor3 = SIMD.Float32x4.sub(SIMD.Float32x4.mul(row0, tmp1), minor3);
  minor3 = SIMD.Float32x4.swizzle(minor3, 2, 3, 0, 1);

  tmp1   = SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(row1, 2, 3, 0, 1), row3);
  tmp1   = SIMD.Float32x4.swizzle(tmp1, 1, 0, 3, 2);
  row2   = SIMD.Float32x4.swizzle(row2, 2, 3, 0, 1);
  minor0 = SIMD.Float32x4.add(SIMD.Float32x4.mul(row2, tmp1), minor0);
  minor2 = SIMD.Float32x4.mul(row0, tmp1);
  tmp1   = SIMD.Float32x4.swizzle(tmp1, 2, 3, 0, 1);
  minor0 = SIMD.Float32x4.sub(minor0, SIMD.Float32x4.mul(row2, tmp1));
  minor2 = SIMD.Float32x4.sub(SIMD.Float32x4.mul(row0, tmp1), minor2);
  minor2 = SIMD.Float32x4.swizzle(minor2, 2, 3, 0, 1);

  tmp1   = SIMD.Float32x4.mul(row0, row1);
  tmp1   = SIMD.Float32x4.swizzle(tmp1, 1, 0, 3, 2);
  minor2 = SIMD.Float32x4.add(SIMD.Float32x4.mul(row3, tmp1), minor2);
  minor3 = SIMD.Float32x4.sub(SIMD.Float32x4.mul(row2, tmp1), minor3);
  tmp1   = SIMD.Float32x4.swizzle(tmp1, 2, 3, 0, 1);
  minor2 = SIMD.Float32x4.sub(SIMD.Float32x4.mul(row3, tmp1), minor2);
  minor3 = SIMD.Float32x4.sub(minor3, SIMD.Float32x4.mul(row2, tmp1));

  tmp1   = SIMD.Float32x4.mul(row0, row3);
  tmp1   = SIMD.Float32x4.swizzle(tmp1, 1, 0, 3, 2);
  minor1 = SIMD.Float32x4.sub(minor1, SIMD.Float32x4.mul(row2, tmp1));
  minor2 = SIMD.Float32x4.add(SIMD.Float32x4.mul(row1, tmp1), minor2);
  tmp1   = SIMD.Float32x4.swizzle(tmp1, 2, 3, 0, 1);
  minor1 = SIMD.Float32x4.add(SIMD.Float32x4.mul(row2, tmp1), minor1);
  minor2 = SIMD.Float32x4.sub(minor2, SIMD.Float32x4.mul(row1, tmp1));

  tmp1   = SIMD.Float32x4.mul(row0, row2);
  tmp1   = SIMD.Float32x4.swizzle(tmp1, 1, 0, 3, 2);
  minor1 = SIMD.Float32x4.add(SIMD.Float32x4.mul(row3, tmp1), minor1);
  minor3 = SIMD.Float32x4.sub(minor3, SIMD.Float32x4.mul(row1, tmp1));
  tmp1   = SIMD.Float32x4.swizzle(tmp1, 2, 3, 0, 1);
  minor1 = SIMD.Float32x4.sub(minor1, SIMD.Float32x4.mul(row3, tmp1));
  minor3 = SIMD.Float32x4.add(SIMD.Float32x4.mul(row1, tmp1), minor3);

  // Compute matrix determinant
  det   = SIMD.Float32x4.mul(row0, minor0);
  det   = SIMD.Float32x4.add(SIMD.Float32x4.swizzle(det, 2, 3, 0, 1), det);
  det   = SIMD.Float32x4.add(SIMD.Float32x4.swizzle(det, 1, 0, 3, 2), det);
  tmp1  = SIMD.Float32x4.reciprocalApproximation(det);
  det   = SIMD.Float32x4.sub(
               SIMD.Float32x4.add(tmp1, tmp1),
               SIMD.Float32x4.mul(det, SIMD.Float32x4.mul(tmp1, tmp1)));
  det   = SIMD.Float32x4.swizzle(det, 0, 0, 0, 0);
  if (!det) {
      return null;
  }

  // Compute matrix inverse
  SIMD.Float32x4.store(out, 0,  SIMD.Float32x4.mul(det, minor0));
  SIMD.Float32x4.store(out, 4,  SIMD.Float32x4.mul(det, minor1));
  SIMD.Float32x4.store(out, 8,  SIMD.Float32x4.mul(det, minor2));
  SIMD.Float32x4.store(out, 12, SIMD.Float32x4.mul(det, minor3));
  return out;
}

/**
 * Inverts a mat4 using SIMD if available and enabled
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the source matrix
 * @returns {mat4} out
 */
mat4.invert = glMatrix.USE_SIMD ? mat4.SIMD.invert : mat4.scalar.invert;

/**
 * Calculates the adjugate of a mat4 not using SIMD
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the source matrix
 * @returns {mat4} out
 */
mat4.scalar.adjoint = function(out, a) {
    var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3],
        a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
        a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11],
        a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];

    out[0]  =  (a11 * (a22 * a33 - a23 * a32) - a21 * (a12 * a33 - a13 * a32) + a31 * (a12 * a23 - a13 * a22));
    out[1]  = -(a01 * (a22 * a33 - a23 * a32) - a21 * (a02 * a33 - a03 * a32) + a31 * (a02 * a23 - a03 * a22));
    out[2]  =  (a01 * (a12 * a33 - a13 * a32) - a11 * (a02 * a33 - a03 * a32) + a31 * (a02 * a13 - a03 * a12));
    out[3]  = -(a01 * (a12 * a23 - a13 * a22) - a11 * (a02 * a23 - a03 * a22) + a21 * (a02 * a13 - a03 * a12));
    out[4]  = -(a10 * (a22 * a33 - a23 * a32) - a20 * (a12 * a33 - a13 * a32) + a30 * (a12 * a23 - a13 * a22));
    out[5]  =  (a00 * (a22 * a33 - a23 * a32) - a20 * (a02 * a33 - a03 * a32) + a30 * (a02 * a23 - a03 * a22));
    out[6]  = -(a00 * (a12 * a33 - a13 * a32) - a10 * (a02 * a33 - a03 * a32) + a30 * (a02 * a13 - a03 * a12));
    out[7]  =  (a00 * (a12 * a23 - a13 * a22) - a10 * (a02 * a23 - a03 * a22) + a20 * (a02 * a13 - a03 * a12));
    out[8]  =  (a10 * (a21 * a33 - a23 * a31) - a20 * (a11 * a33 - a13 * a31) + a30 * (a11 * a23 - a13 * a21));
    out[9]  = -(a00 * (a21 * a33 - a23 * a31) - a20 * (a01 * a33 - a03 * a31) + a30 * (a01 * a23 - a03 * a21));
    out[10] =  (a00 * (a11 * a33 - a13 * a31) - a10 * (a01 * a33 - a03 * a31) + a30 * (a01 * a13 - a03 * a11));
    out[11] = -(a00 * (a11 * a23 - a13 * a21) - a10 * (a01 * a23 - a03 * a21) + a20 * (a01 * a13 - a03 * a11));
    out[12] = -(a10 * (a21 * a32 - a22 * a31) - a20 * (a11 * a32 - a12 * a31) + a30 * (a11 * a22 - a12 * a21));
    out[13] =  (a00 * (a21 * a32 - a22 * a31) - a20 * (a01 * a32 - a02 * a31) + a30 * (a01 * a22 - a02 * a21));
    out[14] = -(a00 * (a11 * a32 - a12 * a31) - a10 * (a01 * a32 - a02 * a31) + a30 * (a01 * a12 - a02 * a11));
    out[15] =  (a00 * (a11 * a22 - a12 * a21) - a10 * (a01 * a22 - a02 * a21) + a20 * (a01 * a12 - a02 * a11));
    return out;
};

/**
 * Calculates the adjugate of a mat4 using SIMD
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the source matrix
 * @returns {mat4} out
 */
mat4.SIMD.adjoint = function(out, a) {
  var a0, a1, a2, a3;
  var row0, row1, row2, row3;
  var tmp1;
  var minor0, minor1, minor2, minor3;

  var a0 = SIMD.Float32x4.load(a, 0);
  var a1 = SIMD.Float32x4.load(a, 4);
  var a2 = SIMD.Float32x4.load(a, 8);
  var a3 = SIMD.Float32x4.load(a, 12);

  // Transpose the source matrix.  Sort of.  Not a true transpose operation
  tmp1 = SIMD.Float32x4.shuffle(a0, a1, 0, 1, 4, 5);
  row1 = SIMD.Float32x4.shuffle(a2, a3, 0, 1, 4, 5);
  row0 = SIMD.Float32x4.shuffle(tmp1, row1, 0, 2, 4, 6);
  row1 = SIMD.Float32x4.shuffle(row1, tmp1, 1, 3, 5, 7);

  tmp1 = SIMD.Float32x4.shuffle(a0, a1, 2, 3, 6, 7);
  row3 = SIMD.Float32x4.shuffle(a2, a3, 2, 3, 6, 7);
  row2 = SIMD.Float32x4.shuffle(tmp1, row3, 0, 2, 4, 6);
  row3 = SIMD.Float32x4.shuffle(row3, tmp1, 1, 3, 5, 7);

  tmp1   = SIMD.Float32x4.mul(row2, row3);
  tmp1   = SIMD.Float32x4.swizzle(tmp1, 1, 0, 3, 2);
  minor0 = SIMD.Float32x4.mul(row1, tmp1);
  minor1 = SIMD.Float32x4.mul(row0, tmp1);
  tmp1   = SIMD.Float32x4.swizzle(tmp1, 2, 3, 0, 1);
  minor0 = SIMD.Float32x4.sub(SIMD.Float32x4.mul(row1, tmp1), minor0);
  minor1 = SIMD.Float32x4.sub(SIMD.Float32x4.mul(row0, tmp1), minor1);
  minor1 = SIMD.Float32x4.swizzle(minor1, 2, 3, 0, 1);

  tmp1   = SIMD.Float32x4.mul(row1, row2);
  tmp1   = SIMD.Float32x4.swizzle(tmp1, 1, 0, 3, 2);
  minor0 = SIMD.Float32x4.add(SIMD.Float32x4.mul(row3, tmp1), minor0);
  minor3 = SIMD.Float32x4.mul(row0, tmp1);
  tmp1   = SIMD.Float32x4.swizzle(tmp1, 2, 3, 0, 1);
  minor0 = SIMD.Float32x4.sub(minor0, SIMD.Float32x4.mul(row3, tmp1));
  minor3 = SIMD.Float32x4.sub(SIMD.Float32x4.mul(row0, tmp1), minor3);
  minor3 = SIMD.Float32x4.swizzle(minor3, 2, 3, 0, 1);

  tmp1   = SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(row1, 2, 3, 0, 1), row3);
  tmp1   = SIMD.Float32x4.swizzle(tmp1, 1, 0, 3, 2);
  row2   = SIMD.Float32x4.swizzle(row2, 2, 3, 0, 1);
  minor0 = SIMD.Float32x4.add(SIMD.Float32x4.mul(row2, tmp1), minor0);
  minor2 = SIMD.Float32x4.mul(row0, tmp1);
  tmp1   = SIMD.Float32x4.swizzle(tmp1, 2, 3, 0, 1);
  minor0 = SIMD.Float32x4.sub(minor0, SIMD.Float32x4.mul(row2, tmp1));
  minor2 = SIMD.Float32x4.sub(SIMD.Float32x4.mul(row0, tmp1), minor2);
  minor2 = SIMD.Float32x4.swizzle(minor2, 2, 3, 0, 1);

  tmp1   = SIMD.Float32x4.mul(row0, row1);
  tmp1   = SIMD.Float32x4.swizzle(tmp1, 1, 0, 3, 2);
  minor2 = SIMD.Float32x4.add(SIMD.Float32x4.mul(row3, tmp1), minor2);
  minor3 = SIMD.Float32x4.sub(SIMD.Float32x4.mul(row2, tmp1), minor3);
  tmp1   = SIMD.Float32x4.swizzle(tmp1, 2, 3, 0, 1);
  minor2 = SIMD.Float32x4.sub(SIMD.Float32x4.mul(row3, tmp1), minor2);
  minor3 = SIMD.Float32x4.sub(minor3, SIMD.Float32x4.mul(row2, tmp1));

  tmp1   = SIMD.Float32x4.mul(row0, row3);
  tmp1   = SIMD.Float32x4.swizzle(tmp1, 1, 0, 3, 2);
  minor1 = SIMD.Float32x4.sub(minor1, SIMD.Float32x4.mul(row2, tmp1));
  minor2 = SIMD.Float32x4.add(SIMD.Float32x4.mul(row1, tmp1), minor2);
  tmp1   = SIMD.Float32x4.swizzle(tmp1, 2, 3, 0, 1);
  minor1 = SIMD.Float32x4.add(SIMD.Float32x4.mul(row2, tmp1), minor1);
  minor2 = SIMD.Float32x4.sub(minor2, SIMD.Float32x4.mul(row1, tmp1));

  tmp1   = SIMD.Float32x4.mul(row0, row2);
  tmp1   = SIMD.Float32x4.swizzle(tmp1, 1, 0, 3, 2);
  minor1 = SIMD.Float32x4.add(SIMD.Float32x4.mul(row3, tmp1), minor1);
  minor3 = SIMD.Float32x4.sub(minor3, SIMD.Float32x4.mul(row1, tmp1));
  tmp1   = SIMD.Float32x4.swizzle(tmp1, 2, 3, 0, 1);
  minor1 = SIMD.Float32x4.sub(minor1, SIMD.Float32x4.mul(row3, tmp1));
  minor3 = SIMD.Float32x4.add(SIMD.Float32x4.mul(row1, tmp1), minor3);

  SIMD.Float32x4.store(out, 0,  minor0);
  SIMD.Float32x4.store(out, 4,  minor1);
  SIMD.Float32x4.store(out, 8,  minor2);
  SIMD.Float32x4.store(out, 12, minor3);
  return out;
};

/**
 * Calculates the adjugate of a mat4 using SIMD if available and enabled
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the source matrix
 * @returns {mat4} out
 */
 mat4.adjoint = glMatrix.USE_SIMD ? mat4.SIMD.adjoint : mat4.scalar.adjoint;

/**
 * Calculates the determinant of a mat4
 *
 * @param {mat4} a the source matrix
 * @returns {Number} determinant of a
 */
mat4.determinant = function (a) {
    var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3],
        a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
        a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11],
        a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15],

        b00 = a00 * a11 - a01 * a10,
        b01 = a00 * a12 - a02 * a10,
        b02 = a00 * a13 - a03 * a10,
        b03 = a01 * a12 - a02 * a11,
        b04 = a01 * a13 - a03 * a11,
        b05 = a02 * a13 - a03 * a12,
        b06 = a20 * a31 - a21 * a30,
        b07 = a20 * a32 - a22 * a30,
        b08 = a20 * a33 - a23 * a30,
        b09 = a21 * a32 - a22 * a31,
        b10 = a21 * a33 - a23 * a31,
        b11 = a22 * a33 - a23 * a32;

    // Calculate the determinant
    return b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
};

/**
 * Multiplies two mat4's explicitly using SIMD
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the first operand, must be a Float32Array
 * @param {mat4} b the second operand, must be a Float32Array
 * @returns {mat4} out
 */
mat4.SIMD.multiply = function (out, a, b) {
    var a0 = SIMD.Float32x4.load(a, 0);
    var a1 = SIMD.Float32x4.load(a, 4);
    var a2 = SIMD.Float32x4.load(a, 8);
    var a3 = SIMD.Float32x4.load(a, 12);

    var b0 = SIMD.Float32x4.load(b, 0);
    var out0 = SIMD.Float32x4.add(
                   SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(b0, 0, 0, 0, 0), a0),
                   SIMD.Float32x4.add(
                       SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(b0, 1, 1, 1, 1), a1),
                       SIMD.Float32x4.add(
                           SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(b0, 2, 2, 2, 2), a2),
                           SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(b0, 3, 3, 3, 3), a3))));
    SIMD.Float32x4.store(out, 0, out0);

    var b1 = SIMD.Float32x4.load(b, 4);
    var out1 = SIMD.Float32x4.add(
                   SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(b1, 0, 0, 0, 0), a0),
                   SIMD.Float32x4.add(
                       SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(b1, 1, 1, 1, 1), a1),
                       SIMD.Float32x4.add(
                           SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(b1, 2, 2, 2, 2), a2),
                           SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(b1, 3, 3, 3, 3), a3))));
    SIMD.Float32x4.store(out, 4, out1);

    var b2 = SIMD.Float32x4.load(b, 8);
    var out2 = SIMD.Float32x4.add(
                   SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(b2, 0, 0, 0, 0), a0),
                   SIMD.Float32x4.add(
                       SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(b2, 1, 1, 1, 1), a1),
                       SIMD.Float32x4.add(
                               SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(b2, 2, 2, 2, 2), a2),
                               SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(b2, 3, 3, 3, 3), a3))));
    SIMD.Float32x4.store(out, 8, out2);

    var b3 = SIMD.Float32x4.load(b, 12);
    var out3 = SIMD.Float32x4.add(
                   SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(b3, 0, 0, 0, 0), a0),
                   SIMD.Float32x4.add(
                        SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(b3, 1, 1, 1, 1), a1),
                        SIMD.Float32x4.add(
                            SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(b3, 2, 2, 2, 2), a2),
                            SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(b3, 3, 3, 3, 3), a3))));
    SIMD.Float32x4.store(out, 12, out3);

    return out;
};

/**
 * Multiplies two mat4's explicitly not using SIMD
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the first operand
 * @param {mat4} b the second operand
 * @returns {mat4} out
 */
mat4.scalar.multiply = function (out, a, b) {
    var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3],
        a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
        a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11],
        a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];

    // Cache only the current line of the second matrix
    var b0  = b[0], b1 = b[1], b2 = b[2], b3 = b[3];
    out[0] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
    out[1] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
    out[2] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
    out[3] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

    b0 = b[4]; b1 = b[5]; b2 = b[6]; b3 = b[7];
    out[4] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
    out[5] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
    out[6] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
    out[7] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

    b0 = b[8]; b1 = b[9]; b2 = b[10]; b3 = b[11];
    out[8] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
    out[9] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
    out[10] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
    out[11] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

    b0 = b[12]; b1 = b[13]; b2 = b[14]; b3 = b[15];
    out[12] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
    out[13] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
    out[14] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
    out[15] = b0*a03 + b1*a13 + b2*a23 + b3*a33;
    return out;
};

/**
 * Multiplies two mat4's using SIMD if available and enabled
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the first operand
 * @param {mat4} b the second operand
 * @returns {mat4} out
 */
mat4.multiply = glMatrix.USE_SIMD ? mat4.SIMD.multiply : mat4.scalar.multiply;

/**
 * Alias for {@link mat4.multiply}
 * @function
 */
mat4.mul = mat4.multiply;

/**
 * Translate a mat4 by the given vector not using SIMD
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to translate
 * @param {vec3} v vector to translate by
 * @returns {mat4} out
 */
mat4.scalar.translate = function (out, a, v) {
    var x = v[0], y = v[1], z = v[2],
        a00, a01, a02, a03,
        a10, a11, a12, a13,
        a20, a21, a22, a23;

    if (a === out) {
        out[12] = a[0] * x + a[4] * y + a[8] * z + a[12];
        out[13] = a[1] * x + a[5] * y + a[9] * z + a[13];
        out[14] = a[2] * x + a[6] * y + a[10] * z + a[14];
        out[15] = a[3] * x + a[7] * y + a[11] * z + a[15];
    } else {
        a00 = a[0]; a01 = a[1]; a02 = a[2]; a03 = a[3];
        a10 = a[4]; a11 = a[5]; a12 = a[6]; a13 = a[7];
        a20 = a[8]; a21 = a[9]; a22 = a[10]; a23 = a[11];

        out[0] = a00; out[1] = a01; out[2] = a02; out[3] = a03;
        out[4] = a10; out[5] = a11; out[6] = a12; out[7] = a13;
        out[8] = a20; out[9] = a21; out[10] = a22; out[11] = a23;

        out[12] = a00 * x + a10 * y + a20 * z + a[12];
        out[13] = a01 * x + a11 * y + a21 * z + a[13];
        out[14] = a02 * x + a12 * y + a22 * z + a[14];
        out[15] = a03 * x + a13 * y + a23 * z + a[15];
    }

    return out;
};

/**
 * Translates a mat4 by the given vector using SIMD
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to translate
 * @param {vec3} v vector to translate by
 * @returns {mat4} out
 */
mat4.SIMD.translate = function (out, a, v) {
    var a0 = SIMD.Float32x4.load(a, 0),
        a1 = SIMD.Float32x4.load(a, 4),
        a2 = SIMD.Float32x4.load(a, 8),
        a3 = SIMD.Float32x4.load(a, 12),
        vec = SIMD.Float32x4(v[0], v[1], v[2] , 0);

    if (a !== out) {
        out[0] = a[0]; out[1] = a[1]; out[2] = a[2]; out[3] = a[3];
        out[4] = a[4]; out[5] = a[5]; out[6] = a[6]; out[7] = a[7];
        out[8] = a[8]; out[9] = a[9]; out[10] = a[10]; out[11] = a[11];
    }

    a0 = SIMD.Float32x4.mul(a0, SIMD.Float32x4.swizzle(vec, 0, 0, 0, 0));
    a1 = SIMD.Float32x4.mul(a1, SIMD.Float32x4.swizzle(vec, 1, 1, 1, 1));
    a2 = SIMD.Float32x4.mul(a2, SIMD.Float32x4.swizzle(vec, 2, 2, 2, 2));

    var t0 = SIMD.Float32x4.add(a0, SIMD.Float32x4.add(a1, SIMD.Float32x4.add(a2, a3)));
    SIMD.Float32x4.store(out, 12, t0);

    return out;
};

/**
 * Translates a mat4 by the given vector using SIMD if available and enabled
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to translate
 * @param {vec3} v vector to translate by
 * @returns {mat4} out
 */
mat4.translate = glMatrix.USE_SIMD ? mat4.SIMD.translate : mat4.scalar.translate;

/**
 * Scales the mat4 by the dimensions in the given vec3 not using vectorization
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to scale
 * @param {vec3} v the vec3 to scale the matrix by
 * @returns {mat4} out
 **/
mat4.scalar.scale = function(out, a, v) {
    var x = v[0], y = v[1], z = v[2];

    out[0] = a[0] * x;
    out[1] = a[1] * x;
    out[2] = a[2] * x;
    out[3] = a[3] * x;
    out[4] = a[4] * y;
    out[5] = a[5] * y;
    out[6] = a[6] * y;
    out[7] = a[7] * y;
    out[8] = a[8] * z;
    out[9] = a[9] * z;
    out[10] = a[10] * z;
    out[11] = a[11] * z;
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
    return out;
};

/**
 * Scales the mat4 by the dimensions in the given vec3 using vectorization
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to scale
 * @param {vec3} v the vec3 to scale the matrix by
 * @returns {mat4} out
 **/
mat4.SIMD.scale = function(out, a, v) {
    var a0, a1, a2;
    var vec = SIMD.Float32x4(v[0], v[1], v[2], 0);

    a0 = SIMD.Float32x4.load(a, 0);
    SIMD.Float32x4.store(
        out, 0, SIMD.Float32x4.mul(a0, SIMD.Float32x4.swizzle(vec, 0, 0, 0, 0)));

    a1 = SIMD.Float32x4.load(a, 4);
    SIMD.Float32x4.store(
        out, 4, SIMD.Float32x4.mul(a1, SIMD.Float32x4.swizzle(vec, 1, 1, 1, 1)));

    a2 = SIMD.Float32x4.load(a, 8);
    SIMD.Float32x4.store(
        out, 8, SIMD.Float32x4.mul(a2, SIMD.Float32x4.swizzle(vec, 2, 2, 2, 2)));

    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
    return out;
};

/**
 * Scales the mat4 by the dimensions in the given vec3 using SIMD if available and enabled
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to scale
 * @param {vec3} v the vec3 to scale the matrix by
 * @returns {mat4} out
 */
mat4.scale = glMatrix.USE_SIMD ? mat4.SIMD.scale : mat4.scalar.scale;

/**
 * Rotates a mat4 by the given angle around the given axis
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @param {vec3} axis the axis to rotate around
 * @returns {mat4} out
 */
mat4.rotate = function (out, a, rad, axis) {
    var x = axis[0], y = axis[1], z = axis[2],
        len = Math.sqrt(x * x + y * y + z * z),
        s, c, t,
        a00, a01, a02, a03,
        a10, a11, a12, a13,
        a20, a21, a22, a23,
        b00, b01, b02,
        b10, b11, b12,
        b20, b21, b22;

    if (Math.abs(len) < glMatrix.EPSILON) { return null; }

    len = 1 / len;
    x *= len;
    y *= len;
    z *= len;

    s = Math.sin(rad);
    c = Math.cos(rad);
    t = 1 - c;

    a00 = a[0]; a01 = a[1]; a02 = a[2]; a03 = a[3];
    a10 = a[4]; a11 = a[5]; a12 = a[6]; a13 = a[7];
    a20 = a[8]; a21 = a[9]; a22 = a[10]; a23 = a[11];

    // Construct the elements of the rotation matrix
    b00 = x * x * t + c; b01 = y * x * t + z * s; b02 = z * x * t - y * s;
    b10 = x * y * t - z * s; b11 = y * y * t + c; b12 = z * y * t + x * s;
    b20 = x * z * t + y * s; b21 = y * z * t - x * s; b22 = z * z * t + c;

    // Perform rotation-specific matrix multiplication
    out[0] = a00 * b00 + a10 * b01 + a20 * b02;
    out[1] = a01 * b00 + a11 * b01 + a21 * b02;
    out[2] = a02 * b00 + a12 * b01 + a22 * b02;
    out[3] = a03 * b00 + a13 * b01 + a23 * b02;
    out[4] = a00 * b10 + a10 * b11 + a20 * b12;
    out[5] = a01 * b10 + a11 * b11 + a21 * b12;
    out[6] = a02 * b10 + a12 * b11 + a22 * b12;
    out[7] = a03 * b10 + a13 * b11 + a23 * b12;
    out[8] = a00 * b20 + a10 * b21 + a20 * b22;
    out[9] = a01 * b20 + a11 * b21 + a21 * b22;
    out[10] = a02 * b20 + a12 * b21 + a22 * b22;
    out[11] = a03 * b20 + a13 * b21 + a23 * b22;

    if (a !== out) { // If the source and destination differ, copy the unchanged last row
        out[12] = a[12];
        out[13] = a[13];
        out[14] = a[14];
        out[15] = a[15];
    }
    return out;
};

/**
 * Rotates a matrix by the given angle around the X axis not using SIMD
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */
mat4.scalar.rotateX = function (out, a, rad) {
    var s = Math.sin(rad),
        c = Math.cos(rad),
        a10 = a[4],
        a11 = a[5],
        a12 = a[6],
        a13 = a[7],
        a20 = a[8],
        a21 = a[9],
        a22 = a[10],
        a23 = a[11];

    if (a !== out) { // If the source and destination differ, copy the unchanged rows
        out[0]  = a[0];
        out[1]  = a[1];
        out[2]  = a[2];
        out[3]  = a[3];
        out[12] = a[12];
        out[13] = a[13];
        out[14] = a[14];
        out[15] = a[15];
    }

    // Perform axis-specific matrix multiplication
    out[4] = a10 * c + a20 * s;
    out[5] = a11 * c + a21 * s;
    out[6] = a12 * c + a22 * s;
    out[7] = a13 * c + a23 * s;
    out[8] = a20 * c - a10 * s;
    out[9] = a21 * c - a11 * s;
    out[10] = a22 * c - a12 * s;
    out[11] = a23 * c - a13 * s;
    return out;
};

/**
 * Rotates a matrix by the given angle around the X axis using SIMD
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */
mat4.SIMD.rotateX = function (out, a, rad) {
    var s = SIMD.Float32x4.splat(Math.sin(rad)),
        c = SIMD.Float32x4.splat(Math.cos(rad));

    if (a !== out) { // If the source and destination differ, copy the unchanged rows
      out[0]  = a[0];
      out[1]  = a[1];
      out[2]  = a[2];
      out[3]  = a[3];
      out[12] = a[12];
      out[13] = a[13];
      out[14] = a[14];
      out[15] = a[15];
    }

    // Perform axis-specific matrix multiplication
    var a_1 = SIMD.Float32x4.load(a, 4);
    var a_2 = SIMD.Float32x4.load(a, 8);
    SIMD.Float32x4.store(out, 4,
                         SIMD.Float32x4.add(SIMD.Float32x4.mul(a_1, c), SIMD.Float32x4.mul(a_2, s)));
    SIMD.Float32x4.store(out, 8,
                         SIMD.Float32x4.sub(SIMD.Float32x4.mul(a_2, c), SIMD.Float32x4.mul(a_1, s)));
    return out;
};

/**
 * Rotates a matrix by the given angle around the X axis using SIMD if availabe and enabled
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */
mat4.rotateX = glMatrix.USE_SIMD ? mat4.SIMD.rotateX : mat4.scalar.rotateX;

/**
 * Rotates a matrix by the given angle around the Y axis not using SIMD
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */
mat4.scalar.rotateY = function (out, a, rad) {
    var s = Math.sin(rad),
        c = Math.cos(rad),
        a00 = a[0],
        a01 = a[1],
        a02 = a[2],
        a03 = a[3],
        a20 = a[8],
        a21 = a[9],
        a22 = a[10],
        a23 = a[11];

    if (a !== out) { // If the source and destination differ, copy the unchanged rows
        out[4]  = a[4];
        out[5]  = a[5];
        out[6]  = a[6];
        out[7]  = a[7];
        out[12] = a[12];
        out[13] = a[13];
        out[14] = a[14];
        out[15] = a[15];
    }

    // Perform axis-specific matrix multiplication
    out[0] = a00 * c - a20 * s;
    out[1] = a01 * c - a21 * s;
    out[2] = a02 * c - a22 * s;
    out[3] = a03 * c - a23 * s;
    out[8] = a00 * s + a20 * c;
    out[9] = a01 * s + a21 * c;
    out[10] = a02 * s + a22 * c;
    out[11] = a03 * s + a23 * c;
    return out;
};

/**
 * Rotates a matrix by the given angle around the Y axis using SIMD
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */
mat4.SIMD.rotateY = function (out, a, rad) {
    var s = SIMD.Float32x4.splat(Math.sin(rad)),
        c = SIMD.Float32x4.splat(Math.cos(rad));

    if (a !== out) { // If the source and destination differ, copy the unchanged rows
        out[4]  = a[4];
        out[5]  = a[5];
        out[6]  = a[6];
        out[7]  = a[7];
        out[12] = a[12];
        out[13] = a[13];
        out[14] = a[14];
        out[15] = a[15];
    }

    // Perform axis-specific matrix multiplication
    var a_0 = SIMD.Float32x4.load(a, 0);
    var a_2 = SIMD.Float32x4.load(a, 8);
    SIMD.Float32x4.store(out, 0,
                         SIMD.Float32x4.sub(SIMD.Float32x4.mul(a_0, c), SIMD.Float32x4.mul(a_2, s)));
    SIMD.Float32x4.store(out, 8,
                         SIMD.Float32x4.add(SIMD.Float32x4.mul(a_0, s), SIMD.Float32x4.mul(a_2, c)));
    return out;
};

/**
 * Rotates a matrix by the given angle around the Y axis if SIMD available and enabled
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */
 mat4.rotateY = glMatrix.USE_SIMD ? mat4.SIMD.rotateY : mat4.scalar.rotateY;

/**
 * Rotates a matrix by the given angle around the Z axis not using SIMD
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */
mat4.scalar.rotateZ = function (out, a, rad) {
    var s = Math.sin(rad),
        c = Math.cos(rad),
        a00 = a[0],
        a01 = a[1],
        a02 = a[2],
        a03 = a[3],
        a10 = a[4],
        a11 = a[5],
        a12 = a[6],
        a13 = a[7];

    if (a !== out) { // If the source and destination differ, copy the unchanged last row
        out[8]  = a[8];
        out[9]  = a[9];
        out[10] = a[10];
        out[11] = a[11];
        out[12] = a[12];
        out[13] = a[13];
        out[14] = a[14];
        out[15] = a[15];
    }

    // Perform axis-specific matrix multiplication
    out[0] = a00 * c + a10 * s;
    out[1] = a01 * c + a11 * s;
    out[2] = a02 * c + a12 * s;
    out[3] = a03 * c + a13 * s;
    out[4] = a10 * c - a00 * s;
    out[5] = a11 * c - a01 * s;
    out[6] = a12 * c - a02 * s;
    out[7] = a13 * c - a03 * s;
    return out;
};

/**
 * Rotates a matrix by the given angle around the Z axis using SIMD
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */
mat4.SIMD.rotateZ = function (out, a, rad) {
    var s = SIMD.Float32x4.splat(Math.sin(rad)),
        c = SIMD.Float32x4.splat(Math.cos(rad));

    if (a !== out) { // If the source and destination differ, copy the unchanged last row
        out[8]  = a[8];
        out[9]  = a[9];
        out[10] = a[10];
        out[11] = a[11];
        out[12] = a[12];
        out[13] = a[13];
        out[14] = a[14];
        out[15] = a[15];
    }

    // Perform axis-specific matrix multiplication
    var a_0 = SIMD.Float32x4.load(a, 0);
    var a_1 = SIMD.Float32x4.load(a, 4);
    SIMD.Float32x4.store(out, 0,
                         SIMD.Float32x4.add(SIMD.Float32x4.mul(a_0, c), SIMD.Float32x4.mul(a_1, s)));
    SIMD.Float32x4.store(out, 4,
                         SIMD.Float32x4.sub(SIMD.Float32x4.mul(a_1, c), SIMD.Float32x4.mul(a_0, s)));
    return out;
};

/**
 * Rotates a matrix by the given angle around the Z axis if SIMD available and enabled
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */
 mat4.rotateZ = glMatrix.USE_SIMD ? mat4.SIMD.rotateZ : mat4.scalar.rotateZ;

/**
 * Creates a matrix from a vector translation
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.translate(dest, dest, vec);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {vec3} v Translation vector
 * @returns {mat4} out
 */
mat4.fromTranslation = function(out, v) {
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = 1;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 1;
    out[11] = 0;
    out[12] = v[0];
    out[13] = v[1];
    out[14] = v[2];
    out[15] = 1;
    return out;
}

/**
 * Creates a matrix from a vector scaling
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.scale(dest, dest, vec);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {vec3} v Scaling vector
 * @returns {mat4} out
 */
mat4.fromScaling = function(out, v) {
    out[0] = v[0];
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = v[1];
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = v[2];
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
}

/**
 * Creates a matrix from a given angle around a given axis
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.rotate(dest, dest, rad, axis);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {Number} rad the angle to rotate the matrix by
 * @param {vec3} axis the axis to rotate around
 * @returns {mat4} out
 */
mat4.fromRotation = function(out, rad, axis) {
    var x = axis[0], y = axis[1], z = axis[2],
        len = Math.sqrt(x * x + y * y + z * z),
        s, c, t;

    if (Math.abs(len) < glMatrix.EPSILON) { return null; }

    len = 1 / len;
    x *= len;
    y *= len;
    z *= len;

    s = Math.sin(rad);
    c = Math.cos(rad);
    t = 1 - c;

    // Perform rotation-specific matrix multiplication
    out[0] = x * x * t + c;
    out[1] = y * x * t + z * s;
    out[2] = z * x * t - y * s;
    out[3] = 0;
    out[4] = x * y * t - z * s;
    out[5] = y * y * t + c;
    out[6] = z * y * t + x * s;
    out[7] = 0;
    out[8] = x * z * t + y * s;
    out[9] = y * z * t - x * s;
    out[10] = z * z * t + c;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
}

/**
 * Creates a matrix from the given angle around the X axis
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.rotateX(dest, dest, rad);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */
mat4.fromXRotation = function(out, rad) {
    var s = Math.sin(rad),
        c = Math.cos(rad);

    // Perform axis-specific matrix multiplication
    out[0]  = 1;
    out[1]  = 0;
    out[2]  = 0;
    out[3]  = 0;
    out[4] = 0;
    out[5] = c;
    out[6] = s;
    out[7] = 0;
    out[8] = 0;
    out[9] = -s;
    out[10] = c;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
}

/**
 * Creates a matrix from the given angle around the Y axis
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.rotateY(dest, dest, rad);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */
mat4.fromYRotation = function(out, rad) {
    var s = Math.sin(rad),
        c = Math.cos(rad);

    // Perform axis-specific matrix multiplication
    out[0]  = c;
    out[1]  = 0;
    out[2]  = -s;
    out[3]  = 0;
    out[4] = 0;
    out[5] = 1;
    out[6] = 0;
    out[7] = 0;
    out[8] = s;
    out[9] = 0;
    out[10] = c;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
}

/**
 * Creates a matrix from the given angle around the Z axis
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.rotateZ(dest, dest, rad);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */
mat4.fromZRotation = function(out, rad) {
    var s = Math.sin(rad),
        c = Math.cos(rad);

    // Perform axis-specific matrix multiplication
    out[0]  = c;
    out[1]  = s;
    out[2]  = 0;
    out[3]  = 0;
    out[4] = -s;
    out[5] = c;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 1;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
}

/**
 * Creates a matrix from a quaternion rotation and vector translation
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.translate(dest, vec);
 *     var quatMat = mat4.create();
 *     quat4.toMat4(quat, quatMat);
 *     mat4.multiply(dest, quatMat);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {quat4} q Rotation quaternion
 * @param {vec3} v Translation vector
 * @returns {mat4} out
 */
mat4.fromRotationTranslation = function (out, q, v) {
    // Quaternion math
    var x = q[0], y = q[1], z = q[2], w = q[3],
        x2 = x + x,
        y2 = y + y,
        z2 = z + z,

        xx = x * x2,
        xy = x * y2,
        xz = x * z2,
        yy = y * y2,
        yz = y * z2,
        zz = z * z2,
        wx = w * x2,
        wy = w * y2,
        wz = w * z2;

    out[0] = 1 - (yy + zz);
    out[1] = xy + wz;
    out[2] = xz - wy;
    out[3] = 0;
    out[4] = xy - wz;
    out[5] = 1 - (xx + zz);
    out[6] = yz + wx;
    out[7] = 0;
    out[8] = xz + wy;
    out[9] = yz - wx;
    out[10] = 1 - (xx + yy);
    out[11] = 0;
    out[12] = v[0];
    out[13] = v[1];
    out[14] = v[2];
    out[15] = 1;

    return out;
};

/**
 * Returns the translation vector component of a transformation
 *  matrix. If a matrix is built with fromRotationTranslation,
 *  the returned vector will be the same as the translation vector
 *  originally supplied.
 * @param  {vec3} out Vector to receive translation component
 * @param  {mat4} mat Matrix to be decomposed (input)
 * @return {vec3} out
 */
mat4.getTranslation = function (out, mat) {
  out[0] = mat[12];
  out[1] = mat[13];
  out[2] = mat[14];

  return out;
};

/**
 * Returns a quaternion representing the rotational component
 *  of a transformation matrix. If a matrix is built with
 *  fromRotationTranslation, the returned quaternion will be the
 *  same as the quaternion originally supplied.
 * @param {quat} out Quaternion to receive the rotation component
 * @param {mat4} mat Matrix to be decomposed (input)
 * @return {quat} out
 */
mat4.getRotation = function (out, mat) {
  // Algorithm taken from http://www.euclideanspace.com/maths/geometry/rotations/conversions/matrixToQuaternion/index.htm
  var trace = mat[0] + mat[5] + mat[10];
  var S = 0;

  if (trace > 0) { 
    S = Math.sqrt(trace + 1.0) * 2;
    out[3] = 0.25 * S;
    out[0] = (mat[6] - mat[9]) / S;
    out[1] = (mat[8] - mat[2]) / S; 
    out[2] = (mat[1] - mat[4]) / S; 
  } else if ((mat[0] > mat[5])&(mat[0] > mat[10])) { 
    S = Math.sqrt(1.0 + mat[0] - mat[5] - mat[10]) * 2;
    out[3] = (mat[6] - mat[9]) / S;
    out[0] = 0.25 * S;
    out[1] = (mat[1] + mat[4]) / S; 
    out[2] = (mat[8] + mat[2]) / S; 
  } else if (mat[5] > mat[10]) { 
    S = Math.sqrt(1.0 + mat[5] - mat[0] - mat[10]) * 2;
    out[3] = (mat[8] - mat[2]) / S;
    out[0] = (mat[1] + mat[4]) / S; 
    out[1] = 0.25 * S;
    out[2] = (mat[6] + mat[9]) / S; 
  } else { 
    S = Math.sqrt(1.0 + mat[10] - mat[0] - mat[5]) * 2;
    out[3] = (mat[1] - mat[4]) / S;
    out[0] = (mat[8] + mat[2]) / S;
    out[1] = (mat[6] + mat[9]) / S;
    out[2] = 0.25 * S;
  }

  return out;
};

/**
 * Creates a matrix from a quaternion rotation, vector translation and vector scale
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.translate(dest, vec);
 *     var quatMat = mat4.create();
 *     quat4.toMat4(quat, quatMat);
 *     mat4.multiply(dest, quatMat);
 *     mat4.scale(dest, scale)
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {quat4} q Rotation quaternion
 * @param {vec3} v Translation vector
 * @param {vec3} s Scaling vector
 * @returns {mat4} out
 */
mat4.fromRotationTranslationScale = function (out, q, v, s) {
    // Quaternion math
    var x = q[0], y = q[1], z = q[2], w = q[3],
        x2 = x + x,
        y2 = y + y,
        z2 = z + z,

        xx = x * x2,
        xy = x * y2,
        xz = x * z2,
        yy = y * y2,
        yz = y * z2,
        zz = z * z2,
        wx = w * x2,
        wy = w * y2,
        wz = w * z2,
        sx = s[0],
        sy = s[1],
        sz = s[2];

    out[0] = (1 - (yy + zz)) * sx;
    out[1] = (xy + wz) * sx;
    out[2] = (xz - wy) * sx;
    out[3] = 0;
    out[4] = (xy - wz) * sy;
    out[5] = (1 - (xx + zz)) * sy;
    out[6] = (yz + wx) * sy;
    out[7] = 0;
    out[8] = (xz + wy) * sz;
    out[9] = (yz - wx) * sz;
    out[10] = (1 - (xx + yy)) * sz;
    out[11] = 0;
    out[12] = v[0];
    out[13] = v[1];
    out[14] = v[2];
    out[15] = 1;

    return out;
};

/**
 * Creates a matrix from a quaternion rotation, vector translation and vector scale, rotating and scaling around the given origin
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.translate(dest, vec);
 *     mat4.translate(dest, origin);
 *     var quatMat = mat4.create();
 *     quat4.toMat4(quat, quatMat);
 *     mat4.multiply(dest, quatMat);
 *     mat4.scale(dest, scale)
 *     mat4.translate(dest, negativeOrigin);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {quat4} q Rotation quaternion
 * @param {vec3} v Translation vector
 * @param {vec3} s Scaling vector
 * @param {vec3} o The origin vector around which to scale and rotate
 * @returns {mat4} out
 */
mat4.fromRotationTranslationScaleOrigin = function (out, q, v, s, o) {
  // Quaternion math
  var x = q[0], y = q[1], z = q[2], w = q[3],
      x2 = x + x,
      y2 = y + y,
      z2 = z + z,

      xx = x * x2,
      xy = x * y2,
      xz = x * z2,
      yy = y * y2,
      yz = y * z2,
      zz = z * z2,
      wx = w * x2,
      wy = w * y2,
      wz = w * z2,

      sx = s[0],
      sy = s[1],
      sz = s[2],

      ox = o[0],
      oy = o[1],
      oz = o[2];

  out[0] = (1 - (yy + zz)) * sx;
  out[1] = (xy + wz) * sx;
  out[2] = (xz - wy) * sx;
  out[3] = 0;
  out[4] = (xy - wz) * sy;
  out[5] = (1 - (xx + zz)) * sy;
  out[6] = (yz + wx) * sy;
  out[7] = 0;
  out[8] = (xz + wy) * sz;
  out[9] = (yz - wx) * sz;
  out[10] = (1 - (xx + yy)) * sz;
  out[11] = 0;
  out[12] = v[0] + ox - (out[0] * ox + out[4] * oy + out[8] * oz);
  out[13] = v[1] + oy - (out[1] * ox + out[5] * oy + out[9] * oz);
  out[14] = v[2] + oz - (out[2] * ox + out[6] * oy + out[10] * oz);
  out[15] = 1;

  return out;
};

/**
 * Calculates a 4x4 matrix from the given quaternion
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {quat} q Quaternion to create matrix from
 *
 * @returns {mat4} out
 */
mat4.fromQuat = function (out, q) {
    var x = q[0], y = q[1], z = q[2], w = q[3],
        x2 = x + x,
        y2 = y + y,
        z2 = z + z,

        xx = x * x2,
        yx = y * x2,
        yy = y * y2,
        zx = z * x2,
        zy = z * y2,
        zz = z * z2,
        wx = w * x2,
        wy = w * y2,
        wz = w * z2;

    out[0] = 1 - yy - zz;
    out[1] = yx + wz;
    out[2] = zx - wy;
    out[3] = 0;

    out[4] = yx - wz;
    out[5] = 1 - xx - zz;
    out[6] = zy + wx;
    out[7] = 0;

    out[8] = zx + wy;
    out[9] = zy - wx;
    out[10] = 1 - xx - yy;
    out[11] = 0;

    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;

    return out;
};

/**
 * Generates a frustum matrix with the given bounds
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {Number} left Left bound of the frustum
 * @param {Number} right Right bound of the frustum
 * @param {Number} bottom Bottom bound of the frustum
 * @param {Number} top Top bound of the frustum
 * @param {Number} near Near bound of the frustum
 * @param {Number} far Far bound of the frustum
 * @returns {mat4} out
 */
mat4.frustum = function (out, left, right, bottom, top, near, far) {
    var rl = 1 / (right - left),
        tb = 1 / (top - bottom),
        nf = 1 / (near - far);
    out[0] = (near * 2) * rl;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = (near * 2) * tb;
    out[6] = 0;
    out[7] = 0;
    out[8] = (right + left) * rl;
    out[9] = (top + bottom) * tb;
    out[10] = (far + near) * nf;
    out[11] = -1;
    out[12] = 0;
    out[13] = 0;
    out[14] = (far * near * 2) * nf;
    out[15] = 0;
    return out;
};

/**
 * Generates a perspective projection matrix with the given bounds
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {number} fovy Vertical field of view in radians
 * @param {number} aspect Aspect ratio. typically viewport width/height
 * @param {number} near Near bound of the frustum
 * @param {number} far Far bound of the frustum
 * @returns {mat4} out
 */
mat4.perspective = function (out, fovy, aspect, near, far) {
    var f = 1.0 / Math.tan(fovy / 2),
        nf = 1 / (near - far);
    out[0] = f / aspect;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = f;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = (far + near) * nf;
    out[11] = -1;
    out[12] = 0;
    out[13] = 0;
    out[14] = (2 * far * near) * nf;
    out[15] = 0;
    return out;
};

/**
 * Generates a perspective projection matrix with the given field of view.
 * This is primarily useful for generating projection matrices to be used
 * with the still experiemental WebVR API.
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {Object} fov Object containing the following values: upDegrees, downDegrees, leftDegrees, rightDegrees
 * @param {number} near Near bound of the frustum
 * @param {number} far Far bound of the frustum
 * @returns {mat4} out
 */
mat4.perspectiveFromFieldOfView = function (out, fov, near, far) {
    var upTan = Math.tan(fov.upDegrees * Math.PI/180.0),
        downTan = Math.tan(fov.downDegrees * Math.PI/180.0),
        leftTan = Math.tan(fov.leftDegrees * Math.PI/180.0),
        rightTan = Math.tan(fov.rightDegrees * Math.PI/180.0),
        xScale = 2.0 / (leftTan + rightTan),
        yScale = 2.0 / (upTan + downTan);

    out[0] = xScale;
    out[1] = 0.0;
    out[2] = 0.0;
    out[3] = 0.0;
    out[4] = 0.0;
    out[5] = yScale;
    out[6] = 0.0;
    out[7] = 0.0;
    out[8] = -((leftTan - rightTan) * xScale * 0.5);
    out[9] = ((upTan - downTan) * yScale * 0.5);
    out[10] = far / (near - far);
    out[11] = -1.0;
    out[12] = 0.0;
    out[13] = 0.0;
    out[14] = (far * near) / (near - far);
    out[15] = 0.0;
    return out;
}

/**
 * Generates a orthogonal projection matrix with the given bounds
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {number} left Left bound of the frustum
 * @param {number} right Right bound of the frustum
 * @param {number} bottom Bottom bound of the frustum
 * @param {number} top Top bound of the frustum
 * @param {number} near Near bound of the frustum
 * @param {number} far Far bound of the frustum
 * @returns {mat4} out
 */
mat4.ortho = function (out, left, right, bottom, top, near, far) {
    var lr = 1 / (left - right),
        bt = 1 / (bottom - top),
        nf = 1 / (near - far);
    out[0] = -2 * lr;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = -2 * bt;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 2 * nf;
    out[11] = 0;
    out[12] = (left + right) * lr;
    out[13] = (top + bottom) * bt;
    out[14] = (far + near) * nf;
    out[15] = 1;
    return out;
};

/**
 * Generates a look-at matrix with the given eye position, focal point, and up axis
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {vec3} eye Position of the viewer
 * @param {vec3} center Point the viewer is looking at
 * @param {vec3} up vec3 pointing up
 * @returns {mat4} out
 */
mat4.lookAt = function (out, eye, center, up) {
    var x0, x1, x2, y0, y1, y2, z0, z1, z2, len,
        eyex = eye[0],
        eyey = eye[1],
        eyez = eye[2],
        upx = up[0],
        upy = up[1],
        upz = up[2],
        centerx = center[0],
        centery = center[1],
        centerz = center[2];

    if (Math.abs(eyex - centerx) < glMatrix.EPSILON &&
        Math.abs(eyey - centery) < glMatrix.EPSILON &&
        Math.abs(eyez - centerz) < glMatrix.EPSILON) {
        return mat4.identity(out);
    }

    z0 = eyex - centerx;
    z1 = eyey - centery;
    z2 = eyez - centerz;

    len = 1 / Math.sqrt(z0 * z0 + z1 * z1 + z2 * z2);
    z0 *= len;
    z1 *= len;
    z2 *= len;

    x0 = upy * z2 - upz * z1;
    x1 = upz * z0 - upx * z2;
    x2 = upx * z1 - upy * z0;
    len = Math.sqrt(x0 * x0 + x1 * x1 + x2 * x2);
    if (!len) {
        x0 = 0;
        x1 = 0;
        x2 = 0;
    } else {
        len = 1 / len;
        x0 *= len;
        x1 *= len;
        x2 *= len;
    }

    y0 = z1 * x2 - z2 * x1;
    y1 = z2 * x0 - z0 * x2;
    y2 = z0 * x1 - z1 * x0;

    len = Math.sqrt(y0 * y0 + y1 * y1 + y2 * y2);
    if (!len) {
        y0 = 0;
        y1 = 0;
        y2 = 0;
    } else {
        len = 1 / len;
        y0 *= len;
        y1 *= len;
        y2 *= len;
    }

    out[0] = x0;
    out[1] = y0;
    out[2] = z0;
    out[3] = 0;
    out[4] = x1;
    out[5] = y1;
    out[6] = z1;
    out[7] = 0;
    out[8] = x2;
    out[9] = y2;
    out[10] = z2;
    out[11] = 0;
    out[12] = -(x0 * eyex + x1 * eyey + x2 * eyez);
    out[13] = -(y0 * eyex + y1 * eyey + y2 * eyez);
    out[14] = -(z0 * eyex + z1 * eyey + z2 * eyez);
    out[15] = 1;

    return out;
};

/**
 * Returns a string representation of a mat4
 *
 * @param {mat4} mat matrix to represent as a string
 * @returns {String} string representation of the matrix
 */
mat4.str = function (a) {
    return 'mat4(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + a[3] + ', ' +
                    a[4] + ', ' + a[5] + ', ' + a[6] + ', ' + a[7] + ', ' +
                    a[8] + ', ' + a[9] + ', ' + a[10] + ', ' + a[11] + ', ' +
                    a[12] + ', ' + a[13] + ', ' + a[14] + ', ' + a[15] + ')';
};

/**
 * Returns Frobenius norm of a mat4
 *
 * @param {mat4} a the matrix to calculate Frobenius norm of
 * @returns {Number} Frobenius norm
 */
mat4.frob = function (a) {
    return(Math.sqrt(Math.pow(a[0], 2) + Math.pow(a[1], 2) + Math.pow(a[2], 2) + Math.pow(a[3], 2) + Math.pow(a[4], 2) + Math.pow(a[5], 2) + Math.pow(a[6], 2) + Math.pow(a[7], 2) + Math.pow(a[8], 2) + Math.pow(a[9], 2) + Math.pow(a[10], 2) + Math.pow(a[11], 2) + Math.pow(a[12], 2) + Math.pow(a[13], 2) + Math.pow(a[14], 2) + Math.pow(a[15], 2) ))
};

/**
 * Adds two mat4's
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the first operand
 * @param {mat4} b the second operand
 * @returns {mat4} out
 */
mat4.add = function(out, a, b) {
    out[0] = a[0] + b[0];
    out[1] = a[1] + b[1];
    out[2] = a[2] + b[2];
    out[3] = a[3] + b[3];
    out[4] = a[4] + b[4];
    out[5] = a[5] + b[5];
    out[6] = a[6] + b[6];
    out[7] = a[7] + b[7];
    out[8] = a[8] + b[8];
    out[9] = a[9] + b[9];
    out[10] = a[10] + b[10];
    out[11] = a[11] + b[11];
    out[12] = a[12] + b[12];
    out[13] = a[13] + b[13];
    out[14] = a[14] + b[14];
    out[15] = a[15] + b[15];
    return out;
};

/**
 * Subtracts matrix b from matrix a
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the first operand
 * @param {mat4} b the second operand
 * @returns {mat4} out
 */
mat4.subtract = function(out, a, b) {
    out[0] = a[0] - b[0];
    out[1] = a[1] - b[1];
    out[2] = a[2] - b[2];
    out[3] = a[3] - b[3];
    out[4] = a[4] - b[4];
    out[5] = a[5] - b[5];
    out[6] = a[6] - b[6];
    out[7] = a[7] - b[7];
    out[8] = a[8] - b[8];
    out[9] = a[9] - b[9];
    out[10] = a[10] - b[10];
    out[11] = a[11] - b[11];
    out[12] = a[12] - b[12];
    out[13] = a[13] - b[13];
    out[14] = a[14] - b[14];
    out[15] = a[15] - b[15];
    return out;
};

/**
 * Alias for {@link mat4.subtract}
 * @function
 */
mat4.sub = mat4.subtract;

/**
 * Multiply each element of the matrix by a scalar.
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to scale
 * @param {Number} b amount to scale the matrix's elements by
 * @returns {mat4} out
 */
mat4.multiplyScalar = function(out, a, b) {
    out[0] = a[0] * b;
    out[1] = a[1] * b;
    out[2] = a[2] * b;
    out[3] = a[3] * b;
    out[4] = a[4] * b;
    out[5] = a[5] * b;
    out[6] = a[6] * b;
    out[7] = a[7] * b;
    out[8] = a[8] * b;
    out[9] = a[9] * b;
    out[10] = a[10] * b;
    out[11] = a[11] * b;
    out[12] = a[12] * b;
    out[13] = a[13] * b;
    out[14] = a[14] * b;
    out[15] = a[15] * b;
    return out;
};

/**
 * Adds two mat4's after multiplying each element of the second operand by a scalar value.
 *
 * @param {mat4} out the receiving vector
 * @param {mat4} a the first operand
 * @param {mat4} b the second operand
 * @param {Number} scale the amount to scale b's elements by before adding
 * @returns {mat4} out
 */
mat4.multiplyScalarAndAdd = function(out, a, b, scale) {
    out[0] = a[0] + (b[0] * scale);
    out[1] = a[1] + (b[1] * scale);
    out[2] = a[2] + (b[2] * scale);
    out[3] = a[3] + (b[3] * scale);
    out[4] = a[4] + (b[4] * scale);
    out[5] = a[5] + (b[5] * scale);
    out[6] = a[6] + (b[6] * scale);
    out[7] = a[7] + (b[7] * scale);
    out[8] = a[8] + (b[8] * scale);
    out[9] = a[9] + (b[9] * scale);
    out[10] = a[10] + (b[10] * scale);
    out[11] = a[11] + (b[11] * scale);
    out[12] = a[12] + (b[12] * scale);
    out[13] = a[13] + (b[13] * scale);
    out[14] = a[14] + (b[14] * scale);
    out[15] = a[15] + (b[15] * scale);
    return out;
};

/**
 * Returns whether or not the matrices have exactly the same elements in the same position (when compared with ===)
 *
 * @param {mat4} a The first matrix.
 * @param {mat4} b The second matrix.
 * @returns {Boolean} True if the matrices are equal, false otherwise.
 */
mat4.exactEquals = function (a, b) {
    return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3] && 
           a[4] === b[4] && a[5] === b[5] && a[6] === b[6] && a[7] === b[7] && 
           a[8] === b[8] && a[9] === b[9] && a[10] === b[10] && a[11] === b[11] &&
           a[12] === b[12] && a[13] === b[13] && a[14] === b[14] && a[15] === b[15];
};

/**
 * Returns whether or not the matrices have approximately the same elements in the same position.
 *
 * @param {mat4} a The first matrix.
 * @param {mat4} b The second matrix.
 * @returns {Boolean} True if the matrices are equal, false otherwise.
 */
mat4.equals = function (a, b) {
    var a0  = a[0],  a1  = a[1],  a2  = a[2],  a3  = a[3],
        a4  = a[4],  a5  = a[5],  a6  = a[6],  a7  = a[7], 
        a8  = a[8],  a9  = a[9],  a10 = a[10], a11 = a[11], 
        a12 = a[12], a13 = a[13], a14 = a[14], a15 = a[15];

    var b0  = b[0],  b1  = b[1],  b2  = b[2],  b3  = b[3],
        b4  = b[4],  b5  = b[5],  b6  = b[6],  b7  = b[7], 
        b8  = b[8],  b9  = b[9],  b10 = b[10], b11 = b[11], 
        b12 = b[12], b13 = b[13], b14 = b[14], b15 = b[15];

    return (Math.abs(a0 - b0) <= glMatrix.EPSILON*Math.max(1.0, Math.abs(a0), Math.abs(b0)) &&
            Math.abs(a1 - b1) <= glMatrix.EPSILON*Math.max(1.0, Math.abs(a1), Math.abs(b1)) &&
            Math.abs(a2 - b2) <= glMatrix.EPSILON*Math.max(1.0, Math.abs(a2), Math.abs(b2)) &&
            Math.abs(a3 - b3) <= glMatrix.EPSILON*Math.max(1.0, Math.abs(a3), Math.abs(b3)) &&
            Math.abs(a4 - b4) <= glMatrix.EPSILON*Math.max(1.0, Math.abs(a4), Math.abs(b4)) &&
            Math.abs(a5 - b5) <= glMatrix.EPSILON*Math.max(1.0, Math.abs(a5), Math.abs(b5)) &&
            Math.abs(a6 - b6) <= glMatrix.EPSILON*Math.max(1.0, Math.abs(a6), Math.abs(b6)) &&
            Math.abs(a7 - b7) <= glMatrix.EPSILON*Math.max(1.0, Math.abs(a7), Math.abs(b7)) &&
            Math.abs(a8 - b8) <= glMatrix.EPSILON*Math.max(1.0, Math.abs(a8), Math.abs(b8)) &&
            Math.abs(a9 - b9) <= glMatrix.EPSILON*Math.max(1.0, Math.abs(a9), Math.abs(b9)) &&
            Math.abs(a10 - b10) <= glMatrix.EPSILON*Math.max(1.0, Math.abs(a10), Math.abs(b10)) &&
            Math.abs(a11 - b11) <= glMatrix.EPSILON*Math.max(1.0, Math.abs(a11), Math.abs(b11)) &&
            Math.abs(a12 - b12) <= glMatrix.EPSILON*Math.max(1.0, Math.abs(a12), Math.abs(b12)) &&
            Math.abs(a13 - b13) <= glMatrix.EPSILON*Math.max(1.0, Math.abs(a13), Math.abs(b13)) &&
            Math.abs(a14 - b14) <= glMatrix.EPSILON*Math.max(1.0, Math.abs(a14), Math.abs(b14)) &&
            Math.abs(a15 - b15) <= glMatrix.EPSILON*Math.max(1.0, Math.abs(a15), Math.abs(b15)));
};



module.exports = mat4;

},{"./common.js":24}],29:[function(require,module,exports){
/* Copyright (c) 2015, Brandon Jones, Colin MacKenzie IV.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE. */

var glMatrix = require("./common.js");
var mat3 = require("./mat3.js");
var vec3 = require("./vec3.js");
var vec4 = require("./vec4.js");

/**
 * @class Quaternion
 * @name quat
 */
var quat = {};

/**
 * Creates a new identity quat
 *
 * @returns {quat} a new quaternion
 */
quat.create = function() {
    var out = new glMatrix.ARRAY_TYPE(4);
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
    out[3] = 1;
    return out;
};

/**
 * Sets a quaternion to represent the shortest rotation from one
 * vector to another.
 *
 * Both vectors are assumed to be unit length.
 *
 * @param {quat} out the receiving quaternion.
 * @param {vec3} a the initial vector
 * @param {vec3} b the destination vector
 * @returns {quat} out
 */
quat.rotationTo = (function() {
    var tmpvec3 = vec3.create();
    var xUnitVec3 = vec3.fromValues(1,0,0);
    var yUnitVec3 = vec3.fromValues(0,1,0);

    return function(out, a, b) {
        var dot = vec3.dot(a, b);
        if (dot < -0.999999) {
            vec3.cross(tmpvec3, xUnitVec3, a);
            if (vec3.length(tmpvec3) < 0.000001)
                vec3.cross(tmpvec3, yUnitVec3, a);
            vec3.normalize(tmpvec3, tmpvec3);
            quat.setAxisAngle(out, tmpvec3, Math.PI);
            return out;
        } else if (dot > 0.999999) {
            out[0] = 0;
            out[1] = 0;
            out[2] = 0;
            out[3] = 1;
            return out;
        } else {
            vec3.cross(tmpvec3, a, b);
            out[0] = tmpvec3[0];
            out[1] = tmpvec3[1];
            out[2] = tmpvec3[2];
            out[3] = 1 + dot;
            return quat.normalize(out, out);
        }
    };
})();

/**
 * Sets the specified quaternion with values corresponding to the given
 * axes. Each axis is a vec3 and is expected to be unit length and
 * perpendicular to all other specified axes.
 *
 * @param {vec3} view  the vector representing the viewing direction
 * @param {vec3} right the vector representing the local "right" direction
 * @param {vec3} up    the vector representing the local "up" direction
 * @returns {quat} out
 */
quat.setAxes = (function() {
    var matr = mat3.create();

    return function(out, view, right, up) {
        matr[0] = right[0];
        matr[3] = right[1];
        matr[6] = right[2];

        matr[1] = up[0];
        matr[4] = up[1];
        matr[7] = up[2];

        matr[2] = -view[0];
        matr[5] = -view[1];
        matr[8] = -view[2];

        return quat.normalize(out, quat.fromMat3(out, matr));
    };
})();

/**
 * Creates a new quat initialized with values from an existing quaternion
 *
 * @param {quat} a quaternion to clone
 * @returns {quat} a new quaternion
 * @function
 */
quat.clone = vec4.clone;

/**
 * Creates a new quat initialized with the given values
 *
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @param {Number} w W component
 * @returns {quat} a new quaternion
 * @function
 */
quat.fromValues = vec4.fromValues;

/**
 * Copy the values from one quat to another
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a the source quaternion
 * @returns {quat} out
 * @function
 */
quat.copy = vec4.copy;

/**
 * Set the components of a quat to the given values
 *
 * @param {quat} out the receiving quaternion
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @param {Number} w W component
 * @returns {quat} out
 * @function
 */
quat.set = vec4.set;

/**
 * Set a quat to the identity quaternion
 *
 * @param {quat} out the receiving quaternion
 * @returns {quat} out
 */
quat.identity = function(out) {
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
    out[3] = 1;
    return out;
};

/**
 * Sets a quat from the given angle and rotation axis,
 * then returns it.
 *
 * @param {quat} out the receiving quaternion
 * @param {vec3} axis the axis around which to rotate
 * @param {Number} rad the angle in radians
 * @returns {quat} out
 **/
quat.setAxisAngle = function(out, axis, rad) {
    rad = rad * 0.5;
    var s = Math.sin(rad);
    out[0] = s * axis[0];
    out[1] = s * axis[1];
    out[2] = s * axis[2];
    out[3] = Math.cos(rad);
    return out;
};

/**
 * Gets the rotation axis and angle for a given
 *  quaternion. If a quaternion is created with
 *  setAxisAngle, this method will return the same
 *  values as providied in the original parameter list
 *  OR functionally equivalent values.
 * Example: The quaternion formed by axis [0, 0, 1] and
 *  angle -90 is the same as the quaternion formed by
 *  [0, 0, 1] and 270. This method favors the latter.
 * @param  {vec3} out_axis  Vector receiving the axis of rotation
 * @param  {quat} q     Quaternion to be decomposed
 * @return {Number}     Angle, in radians, of the rotation
 */
quat.getAxisAngle = function(out_axis, q) {
    var rad = Math.acos(q[3]) * 2.0;
    var s = Math.sin(rad / 2.0);
    if (s != 0.0) {
        out_axis[0] = q[0] / s;
        out_axis[1] = q[1] / s;
        out_axis[2] = q[2] / s;
    } else {
        // If s is zero, return any axis (no rotation - axis does not matter)
        out_axis[0] = 1;
        out_axis[1] = 0;
        out_axis[2] = 0;
    }
    return rad;
};

/**
 * Adds two quat's
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a the first operand
 * @param {quat} b the second operand
 * @returns {quat} out
 * @function
 */
quat.add = vec4.add;

/**
 * Multiplies two quat's
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a the first operand
 * @param {quat} b the second operand
 * @returns {quat} out
 */
quat.multiply = function(out, a, b) {
    var ax = a[0], ay = a[1], az = a[2], aw = a[3],
        bx = b[0], by = b[1], bz = b[2], bw = b[3];

    out[0] = ax * bw + aw * bx + ay * bz - az * by;
    out[1] = ay * bw + aw * by + az * bx - ax * bz;
    out[2] = az * bw + aw * bz + ax * by - ay * bx;
    out[3] = aw * bw - ax * bx - ay * by - az * bz;
    return out;
};

/**
 * Alias for {@link quat.multiply}
 * @function
 */
quat.mul = quat.multiply;

/**
 * Scales a quat by a scalar number
 *
 * @param {quat} out the receiving vector
 * @param {quat} a the vector to scale
 * @param {Number} b amount to scale the vector by
 * @returns {quat} out
 * @function
 */
quat.scale = vec4.scale;

/**
 * Rotates a quaternion by the given angle about the X axis
 *
 * @param {quat} out quat receiving operation result
 * @param {quat} a quat to rotate
 * @param {number} rad angle (in radians) to rotate
 * @returns {quat} out
 */
quat.rotateX = function (out, a, rad) {
    rad *= 0.5; 

    var ax = a[0], ay = a[1], az = a[2], aw = a[3],
        bx = Math.sin(rad), bw = Math.cos(rad);

    out[0] = ax * bw + aw * bx;
    out[1] = ay * bw + az * bx;
    out[2] = az * bw - ay * bx;
    out[3] = aw * bw - ax * bx;
    return out;
};

/**
 * Rotates a quaternion by the given angle about the Y axis
 *
 * @param {quat} out quat receiving operation result
 * @param {quat} a quat to rotate
 * @param {number} rad angle (in radians) to rotate
 * @returns {quat} out
 */
quat.rotateY = function (out, a, rad) {
    rad *= 0.5; 

    var ax = a[0], ay = a[1], az = a[2], aw = a[3],
        by = Math.sin(rad), bw = Math.cos(rad);

    out[0] = ax * bw - az * by;
    out[1] = ay * bw + aw * by;
    out[2] = az * bw + ax * by;
    out[3] = aw * bw - ay * by;
    return out;
};

/**
 * Rotates a quaternion by the given angle about the Z axis
 *
 * @param {quat} out quat receiving operation result
 * @param {quat} a quat to rotate
 * @param {number} rad angle (in radians) to rotate
 * @returns {quat} out
 */
quat.rotateZ = function (out, a, rad) {
    rad *= 0.5; 

    var ax = a[0], ay = a[1], az = a[2], aw = a[3],
        bz = Math.sin(rad), bw = Math.cos(rad);

    out[0] = ax * bw + ay * bz;
    out[1] = ay * bw - ax * bz;
    out[2] = az * bw + aw * bz;
    out[3] = aw * bw - az * bz;
    return out;
};

/**
 * Calculates the W component of a quat from the X, Y, and Z components.
 * Assumes that quaternion is 1 unit in length.
 * Any existing W component will be ignored.
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a quat to calculate W component of
 * @returns {quat} out
 */
quat.calculateW = function (out, a) {
    var x = a[0], y = a[1], z = a[2];

    out[0] = x;
    out[1] = y;
    out[2] = z;
    out[3] = Math.sqrt(Math.abs(1.0 - x * x - y * y - z * z));
    return out;
};

/**
 * Calculates the dot product of two quat's
 *
 * @param {quat} a the first operand
 * @param {quat} b the second operand
 * @returns {Number} dot product of a and b
 * @function
 */
quat.dot = vec4.dot;

/**
 * Performs a linear interpolation between two quat's
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a the first operand
 * @param {quat} b the second operand
 * @param {Number} t interpolation amount between the two inputs
 * @returns {quat} out
 * @function
 */
quat.lerp = vec4.lerp;

/**
 * Performs a spherical linear interpolation between two quat
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a the first operand
 * @param {quat} b the second operand
 * @param {Number} t interpolation amount between the two inputs
 * @returns {quat} out
 */
quat.slerp = function (out, a, b, t) {
    // benchmarks:
    //    http://jsperf.com/quaternion-slerp-implementations

    var ax = a[0], ay = a[1], az = a[2], aw = a[3],
        bx = b[0], by = b[1], bz = b[2], bw = b[3];

    var        omega, cosom, sinom, scale0, scale1;

    // calc cosine
    cosom = ax * bx + ay * by + az * bz + aw * bw;
    // adjust signs (if necessary)
    if ( cosom < 0.0 ) {
        cosom = -cosom;
        bx = - bx;
        by = - by;
        bz = - bz;
        bw = - bw;
    }
    // calculate coefficients
    if ( (1.0 - cosom) > 0.000001 ) {
        // standard case (slerp)
        omega  = Math.acos(cosom);
        sinom  = Math.sin(omega);
        scale0 = Math.sin((1.0 - t) * omega) / sinom;
        scale1 = Math.sin(t * omega) / sinom;
    } else {        
        // "from" and "to" quaternions are very close 
        //  ... so we can do a linear interpolation
        scale0 = 1.0 - t;
        scale1 = t;
    }
    // calculate final values
    out[0] = scale0 * ax + scale1 * bx;
    out[1] = scale0 * ay + scale1 * by;
    out[2] = scale0 * az + scale1 * bz;
    out[3] = scale0 * aw + scale1 * bw;
    
    return out;
};

/**
 * Performs a spherical linear interpolation with two control points
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a the first operand
 * @param {quat} b the second operand
 * @param {quat} c the third operand
 * @param {quat} d the fourth operand
 * @param {Number} t interpolation amount
 * @returns {quat} out
 */
quat.sqlerp = (function () {
  var temp1 = quat.create();
  var temp2 = quat.create();
  
  return function (out, a, b, c, d, t) {
    quat.slerp(temp1, a, d, t);
    quat.slerp(temp2, b, c, t);
    quat.slerp(out, temp1, temp2, 2 * t * (1 - t));
    
    return out;
  };
}());

/**
 * Calculates the inverse of a quat
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a quat to calculate inverse of
 * @returns {quat} out
 */
quat.invert = function(out, a) {
    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3],
        dot = a0*a0 + a1*a1 + a2*a2 + a3*a3,
        invDot = dot ? 1.0/dot : 0;
    
    // TODO: Would be faster to return [0,0,0,0] immediately if dot == 0

    out[0] = -a0*invDot;
    out[1] = -a1*invDot;
    out[2] = -a2*invDot;
    out[3] = a3*invDot;
    return out;
};

/**
 * Calculates the conjugate of a quat
 * If the quaternion is normalized, this function is faster than quat.inverse and produces the same result.
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a quat to calculate conjugate of
 * @returns {quat} out
 */
quat.conjugate = function (out, a) {
    out[0] = -a[0];
    out[1] = -a[1];
    out[2] = -a[2];
    out[3] = a[3];
    return out;
};

/**
 * Calculates the length of a quat
 *
 * @param {quat} a vector to calculate length of
 * @returns {Number} length of a
 * @function
 */
quat.length = vec4.length;

/**
 * Alias for {@link quat.length}
 * @function
 */
quat.len = quat.length;

/**
 * Calculates the squared length of a quat
 *
 * @param {quat} a vector to calculate squared length of
 * @returns {Number} squared length of a
 * @function
 */
quat.squaredLength = vec4.squaredLength;

/**
 * Alias for {@link quat.squaredLength}
 * @function
 */
quat.sqrLen = quat.squaredLength;

/**
 * Normalize a quat
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a quaternion to normalize
 * @returns {quat} out
 * @function
 */
quat.normalize = vec4.normalize;

/**
 * Creates a quaternion from the given 3x3 rotation matrix.
 *
 * NOTE: The resultant quaternion is not normalized, so you should be sure
 * to renormalize the quaternion yourself where necessary.
 *
 * @param {quat} out the receiving quaternion
 * @param {mat3} m rotation matrix
 * @returns {quat} out
 * @function
 */
quat.fromMat3 = function(out, m) {
    // Algorithm in Ken Shoemake's article in 1987 SIGGRAPH course notes
    // article "Quaternion Calculus and Fast Animation".
    var fTrace = m[0] + m[4] + m[8];
    var fRoot;

    if ( fTrace > 0.0 ) {
        // |w| > 1/2, may as well choose w > 1/2
        fRoot = Math.sqrt(fTrace + 1.0);  // 2w
        out[3] = 0.5 * fRoot;
        fRoot = 0.5/fRoot;  // 1/(4w)
        out[0] = (m[5]-m[7])*fRoot;
        out[1] = (m[6]-m[2])*fRoot;
        out[2] = (m[1]-m[3])*fRoot;
    } else {
        // |w| <= 1/2
        var i = 0;
        if ( m[4] > m[0] )
          i = 1;
        if ( m[8] > m[i*3+i] )
          i = 2;
        var j = (i+1)%3;
        var k = (i+2)%3;
        
        fRoot = Math.sqrt(m[i*3+i]-m[j*3+j]-m[k*3+k] + 1.0);
        out[i] = 0.5 * fRoot;
        fRoot = 0.5 / fRoot;
        out[3] = (m[j*3+k] - m[k*3+j]) * fRoot;
        out[j] = (m[j*3+i] + m[i*3+j]) * fRoot;
        out[k] = (m[k*3+i] + m[i*3+k]) * fRoot;
    }
    
    return out;
};

/**
 * Returns a string representation of a quatenion
 *
 * @param {quat} vec vector to represent as a string
 * @returns {String} string representation of the vector
 */
quat.str = function (a) {
    return 'quat(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + a[3] + ')';
};

/**
 * Returns whether or not the quaternions have exactly the same elements in the same position (when compared with ===)
 *
 * @param {quat} a The first quaternion.
 * @param {quat} b The second quaternion.
 * @returns {Boolean} True if the vectors are equal, false otherwise.
 */
quat.exactEquals = vec4.exactEquals;

/**
 * Returns whether or not the quaternions have approximately the same elements in the same position.
 *
 * @param {quat} a The first vector.
 * @param {quat} b The second vector.
 * @returns {Boolean} True if the vectors are equal, false otherwise.
 */
quat.equals = vec4.equals;

module.exports = quat;

},{"./common.js":24,"./mat3.js":27,"./vec3.js":31,"./vec4.js":32}],30:[function(require,module,exports){
/* Copyright (c) 2015, Brandon Jones, Colin MacKenzie IV.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE. */

var glMatrix = require("./common.js");

/**
 * @class 2 Dimensional Vector
 * @name vec2
 */
var vec2 = {};

/**
 * Creates a new, empty vec2
 *
 * @returns {vec2} a new 2D vector
 */
vec2.create = function() {
    var out = new glMatrix.ARRAY_TYPE(2);
    out[0] = 0;
    out[1] = 0;
    return out;
};

/**
 * Creates a new vec2 initialized with values from an existing vector
 *
 * @param {vec2} a vector to clone
 * @returns {vec2} a new 2D vector
 */
vec2.clone = function(a) {
    var out = new glMatrix.ARRAY_TYPE(2);
    out[0] = a[0];
    out[1] = a[1];
    return out;
};

/**
 * Creates a new vec2 initialized with the given values
 *
 * @param {Number} x X component
 * @param {Number} y Y component
 * @returns {vec2} a new 2D vector
 */
vec2.fromValues = function(x, y) {
    var out = new glMatrix.ARRAY_TYPE(2);
    out[0] = x;
    out[1] = y;
    return out;
};

/**
 * Copy the values from one vec2 to another
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the source vector
 * @returns {vec2} out
 */
vec2.copy = function(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    return out;
};

/**
 * Set the components of a vec2 to the given values
 *
 * @param {vec2} out the receiving vector
 * @param {Number} x X component
 * @param {Number} y Y component
 * @returns {vec2} out
 */
vec2.set = function(out, x, y) {
    out[0] = x;
    out[1] = y;
    return out;
};

/**
 * Adds two vec2's
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {vec2} out
 */
vec2.add = function(out, a, b) {
    out[0] = a[0] + b[0];
    out[1] = a[1] + b[1];
    return out;
};

/**
 * Subtracts vector b from vector a
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {vec2} out
 */
vec2.subtract = function(out, a, b) {
    out[0] = a[0] - b[0];
    out[1] = a[1] - b[1];
    return out;
};

/**
 * Alias for {@link vec2.subtract}
 * @function
 */
vec2.sub = vec2.subtract;

/**
 * Multiplies two vec2's
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {vec2} out
 */
vec2.multiply = function(out, a, b) {
    out[0] = a[0] * b[0];
    out[1] = a[1] * b[1];
    return out;
};

/**
 * Alias for {@link vec2.multiply}
 * @function
 */
vec2.mul = vec2.multiply;

/**
 * Divides two vec2's
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {vec2} out
 */
vec2.divide = function(out, a, b) {
    out[0] = a[0] / b[0];
    out[1] = a[1] / b[1];
    return out;
};

/**
 * Alias for {@link vec2.divide}
 * @function
 */
vec2.div = vec2.divide;

/**
 * Math.ceil the components of a vec2
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a vector to ceil
 * @returns {vec2} out
 */
vec2.ceil = function (out, a) {
    out[0] = Math.ceil(a[0]);
    out[1] = Math.ceil(a[1]);
    return out;
};

/**
 * Math.floor the components of a vec2
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a vector to floor
 * @returns {vec2} out
 */
vec2.floor = function (out, a) {
    out[0] = Math.floor(a[0]);
    out[1] = Math.floor(a[1]);
    return out;
};

/**
 * Returns the minimum of two vec2's
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {vec2} out
 */
vec2.min = function(out, a, b) {
    out[0] = Math.min(a[0], b[0]);
    out[1] = Math.min(a[1], b[1]);
    return out;
};

/**
 * Returns the maximum of two vec2's
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {vec2} out
 */
vec2.max = function(out, a, b) {
    out[0] = Math.max(a[0], b[0]);
    out[1] = Math.max(a[1], b[1]);
    return out;
};

/**
 * Math.round the components of a vec2
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a vector to round
 * @returns {vec2} out
 */
vec2.round = function (out, a) {
    out[0] = Math.round(a[0]);
    out[1] = Math.round(a[1]);
    return out;
};

/**
 * Scales a vec2 by a scalar number
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the vector to scale
 * @param {Number} b amount to scale the vector by
 * @returns {vec2} out
 */
vec2.scale = function(out, a, b) {
    out[0] = a[0] * b;
    out[1] = a[1] * b;
    return out;
};

/**
 * Adds two vec2's after scaling the second operand by a scalar value
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @param {Number} scale the amount to scale b by before adding
 * @returns {vec2} out
 */
vec2.scaleAndAdd = function(out, a, b, scale) {
    out[0] = a[0] + (b[0] * scale);
    out[1] = a[1] + (b[1] * scale);
    return out;
};

/**
 * Calculates the euclidian distance between two vec2's
 *
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {Number} distance between a and b
 */
vec2.distance = function(a, b) {
    var x = b[0] - a[0],
        y = b[1] - a[1];
    return Math.sqrt(x*x + y*y);
};

/**
 * Alias for {@link vec2.distance}
 * @function
 */
vec2.dist = vec2.distance;

/**
 * Calculates the squared euclidian distance between two vec2's
 *
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {Number} squared distance between a and b
 */
vec2.squaredDistance = function(a, b) {
    var x = b[0] - a[0],
        y = b[1] - a[1];
    return x*x + y*y;
};

/**
 * Alias for {@link vec2.squaredDistance}
 * @function
 */
vec2.sqrDist = vec2.squaredDistance;

/**
 * Calculates the length of a vec2
 *
 * @param {vec2} a vector to calculate length of
 * @returns {Number} length of a
 */
vec2.length = function (a) {
    var x = a[0],
        y = a[1];
    return Math.sqrt(x*x + y*y);
};

/**
 * Alias for {@link vec2.length}
 * @function
 */
vec2.len = vec2.length;

/**
 * Calculates the squared length of a vec2
 *
 * @param {vec2} a vector to calculate squared length of
 * @returns {Number} squared length of a
 */
vec2.squaredLength = function (a) {
    var x = a[0],
        y = a[1];
    return x*x + y*y;
};

/**
 * Alias for {@link vec2.squaredLength}
 * @function
 */
vec2.sqrLen = vec2.squaredLength;

/**
 * Negates the components of a vec2
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a vector to negate
 * @returns {vec2} out
 */
vec2.negate = function(out, a) {
    out[0] = -a[0];
    out[1] = -a[1];
    return out;
};

/**
 * Returns the inverse of the components of a vec2
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a vector to invert
 * @returns {vec2} out
 */
vec2.inverse = function(out, a) {
  out[0] = 1.0 / a[0];
  out[1] = 1.0 / a[1];
  return out;
};

/**
 * Normalize a vec2
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a vector to normalize
 * @returns {vec2} out
 */
vec2.normalize = function(out, a) {
    var x = a[0],
        y = a[1];
    var len = x*x + y*y;
    if (len > 0) {
        //TODO: evaluate use of glm_invsqrt here?
        len = 1 / Math.sqrt(len);
        out[0] = a[0] * len;
        out[1] = a[1] * len;
    }
    return out;
};

/**
 * Calculates the dot product of two vec2's
 *
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {Number} dot product of a and b
 */
vec2.dot = function (a, b) {
    return a[0] * b[0] + a[1] * b[1];
};

/**
 * Computes the cross product of two vec2's
 * Note that the cross product must by definition produce a 3D vector
 *
 * @param {vec3} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {vec3} out
 */
vec2.cross = function(out, a, b) {
    var z = a[0] * b[1] - a[1] * b[0];
    out[0] = out[1] = 0;
    out[2] = z;
    return out;
};

/**
 * Performs a linear interpolation between two vec2's
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @param {Number} t interpolation amount between the two inputs
 * @returns {vec2} out
 */
vec2.lerp = function (out, a, b, t) {
    var ax = a[0],
        ay = a[1];
    out[0] = ax + t * (b[0] - ax);
    out[1] = ay + t * (b[1] - ay);
    return out;
};

/**
 * Generates a random vector with the given scale
 *
 * @param {vec2} out the receiving vector
 * @param {Number} [scale] Length of the resulting vector. If ommitted, a unit vector will be returned
 * @returns {vec2} out
 */
vec2.random = function (out, scale) {
    scale = scale || 1.0;
    var r = glMatrix.RANDOM() * 2.0 * Math.PI;
    out[0] = Math.cos(r) * scale;
    out[1] = Math.sin(r) * scale;
    return out;
};

/**
 * Transforms the vec2 with a mat2
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the vector to transform
 * @param {mat2} m matrix to transform with
 * @returns {vec2} out
 */
vec2.transformMat2 = function(out, a, m) {
    var x = a[0],
        y = a[1];
    out[0] = m[0] * x + m[2] * y;
    out[1] = m[1] * x + m[3] * y;
    return out;
};

/**
 * Transforms the vec2 with a mat2d
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the vector to transform
 * @param {mat2d} m matrix to transform with
 * @returns {vec2} out
 */
vec2.transformMat2d = function(out, a, m) {
    var x = a[0],
        y = a[1];
    out[0] = m[0] * x + m[2] * y + m[4];
    out[1] = m[1] * x + m[3] * y + m[5];
    return out;
};

/**
 * Transforms the vec2 with a mat3
 * 3rd vector component is implicitly '1'
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the vector to transform
 * @param {mat3} m matrix to transform with
 * @returns {vec2} out
 */
vec2.transformMat3 = function(out, a, m) {
    var x = a[0],
        y = a[1];
    out[0] = m[0] * x + m[3] * y + m[6];
    out[1] = m[1] * x + m[4] * y + m[7];
    return out;
};

/**
 * Transforms the vec2 with a mat4
 * 3rd vector component is implicitly '0'
 * 4th vector component is implicitly '1'
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the vector to transform
 * @param {mat4} m matrix to transform with
 * @returns {vec2} out
 */
vec2.transformMat4 = function(out, a, m) {
    var x = a[0], 
        y = a[1];
    out[0] = m[0] * x + m[4] * y + m[12];
    out[1] = m[1] * x + m[5] * y + m[13];
    return out;
};

/**
 * Perform some operation over an array of vec2s.
 *
 * @param {Array} a the array of vectors to iterate over
 * @param {Number} stride Number of elements between the start of each vec2. If 0 assumes tightly packed
 * @param {Number} offset Number of elements to skip at the beginning of the array
 * @param {Number} count Number of vec2s to iterate over. If 0 iterates over entire array
 * @param {Function} fn Function to call for each vector in the array
 * @param {Object} [arg] additional argument to pass to fn
 * @returns {Array} a
 * @function
 */
vec2.forEach = (function() {
    var vec = vec2.create();

    return function(a, stride, offset, count, fn, arg) {
        var i, l;
        if(!stride) {
            stride = 2;
        }

        if(!offset) {
            offset = 0;
        }
        
        if(count) {
            l = Math.min((count * stride) + offset, a.length);
        } else {
            l = a.length;
        }

        for(i = offset; i < l; i += stride) {
            vec[0] = a[i]; vec[1] = a[i+1];
            fn(vec, vec, arg);
            a[i] = vec[0]; a[i+1] = vec[1];
        }
        
        return a;
    };
})();

/**
 * Returns a string representation of a vector
 *
 * @param {vec2} vec vector to represent as a string
 * @returns {String} string representation of the vector
 */
vec2.str = function (a) {
    return 'vec2(' + a[0] + ', ' + a[1] + ')';
};

/**
 * Returns whether or not the vectors exactly have the same elements in the same position (when compared with ===)
 *
 * @param {vec2} a The first vector.
 * @param {vec2} b The second vector.
 * @returns {Boolean} True if the vectors are equal, false otherwise.
 */
vec2.exactEquals = function (a, b) {
    return a[0] === b[0] && a[1] === b[1];
};

/**
 * Returns whether or not the vectors have approximately the same elements in the same position.
 *
 * @param {vec2} a The first vector.
 * @param {vec2} b The second vector.
 * @returns {Boolean} True if the vectors are equal, false otherwise.
 */
vec2.equals = function (a, b) {
    var a0 = a[0], a1 = a[1];
    var b0 = b[0], b1 = b[1];
    return (Math.abs(a0 - b0) <= glMatrix.EPSILON*Math.max(1.0, Math.abs(a0), Math.abs(b0)) &&
            Math.abs(a1 - b1) <= glMatrix.EPSILON*Math.max(1.0, Math.abs(a1), Math.abs(b1)));
};

module.exports = vec2;

},{"./common.js":24}],31:[function(require,module,exports){
/* Copyright (c) 2015, Brandon Jones, Colin MacKenzie IV.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE. */

var glMatrix = require("./common.js");

/**
 * @class 3 Dimensional Vector
 * @name vec3
 */
var vec3 = {};

/**
 * Creates a new, empty vec3
 *
 * @returns {vec3} a new 3D vector
 */
vec3.create = function() {
    var out = new glMatrix.ARRAY_TYPE(3);
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
    return out;
};

/**
 * Creates a new vec3 initialized with values from an existing vector
 *
 * @param {vec3} a vector to clone
 * @returns {vec3} a new 3D vector
 */
vec3.clone = function(a) {
    var out = new glMatrix.ARRAY_TYPE(3);
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    return out;
};

/**
 * Creates a new vec3 initialized with the given values
 *
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @returns {vec3} a new 3D vector
 */
vec3.fromValues = function(x, y, z) {
    var out = new glMatrix.ARRAY_TYPE(3);
    out[0] = x;
    out[1] = y;
    out[2] = z;
    return out;
};

/**
 * Copy the values from one vec3 to another
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the source vector
 * @returns {vec3} out
 */
vec3.copy = function(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    return out;
};

/**
 * Set the components of a vec3 to the given values
 *
 * @param {vec3} out the receiving vector
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @returns {vec3} out
 */
vec3.set = function(out, x, y, z) {
    out[0] = x;
    out[1] = y;
    out[2] = z;
    return out;
};

/**
 * Adds two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
vec3.add = function(out, a, b) {
    out[0] = a[0] + b[0];
    out[1] = a[1] + b[1];
    out[2] = a[2] + b[2];
    return out;
};

/**
 * Subtracts vector b from vector a
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
vec3.subtract = function(out, a, b) {
    out[0] = a[0] - b[0];
    out[1] = a[1] - b[1];
    out[2] = a[2] - b[2];
    return out;
};

/**
 * Alias for {@link vec3.subtract}
 * @function
 */
vec3.sub = vec3.subtract;

/**
 * Multiplies two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
vec3.multiply = function(out, a, b) {
    out[0] = a[0] * b[0];
    out[1] = a[1] * b[1];
    out[2] = a[2] * b[2];
    return out;
};

/**
 * Alias for {@link vec3.multiply}
 * @function
 */
vec3.mul = vec3.multiply;

/**
 * Divides two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
vec3.divide = function(out, a, b) {
    out[0] = a[0] / b[0];
    out[1] = a[1] / b[1];
    out[2] = a[2] / b[2];
    return out;
};

/**
 * Alias for {@link vec3.divide}
 * @function
 */
vec3.div = vec3.divide;

/**
 * Math.ceil the components of a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a vector to ceil
 * @returns {vec3} out
 */
vec3.ceil = function (out, a) {
    out[0] = Math.ceil(a[0]);
    out[1] = Math.ceil(a[1]);
    out[2] = Math.ceil(a[2]);
    return out;
};

/**
 * Math.floor the components of a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a vector to floor
 * @returns {vec3} out
 */
vec3.floor = function (out, a) {
    out[0] = Math.floor(a[0]);
    out[1] = Math.floor(a[1]);
    out[2] = Math.floor(a[2]);
    return out;
};

/**
 * Returns the minimum of two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
vec3.min = function(out, a, b) {
    out[0] = Math.min(a[0], b[0]);
    out[1] = Math.min(a[1], b[1]);
    out[2] = Math.min(a[2], b[2]);
    return out;
};

/**
 * Returns the maximum of two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
vec3.max = function(out, a, b) {
    out[0] = Math.max(a[0], b[0]);
    out[1] = Math.max(a[1], b[1]);
    out[2] = Math.max(a[2], b[2]);
    return out;
};

/**
 * Math.round the components of a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a vector to round
 * @returns {vec3} out
 */
vec3.round = function (out, a) {
    out[0] = Math.round(a[0]);
    out[1] = Math.round(a[1]);
    out[2] = Math.round(a[2]);
    return out;
};

/**
 * Scales a vec3 by a scalar number
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the vector to scale
 * @param {Number} b amount to scale the vector by
 * @returns {vec3} out
 */
vec3.scale = function(out, a, b) {
    out[0] = a[0] * b;
    out[1] = a[1] * b;
    out[2] = a[2] * b;
    return out;
};

/**
 * Adds two vec3's after scaling the second operand by a scalar value
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @param {Number} scale the amount to scale b by before adding
 * @returns {vec3} out
 */
vec3.scaleAndAdd = function(out, a, b, scale) {
    out[0] = a[0] + (b[0] * scale);
    out[1] = a[1] + (b[1] * scale);
    out[2] = a[2] + (b[2] * scale);
    return out;
};

/**
 * Calculates the euclidian distance between two vec3's
 *
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {Number} distance between a and b
 */
vec3.distance = function(a, b) {
    var x = b[0] - a[0],
        y = b[1] - a[1],
        z = b[2] - a[2];
    return Math.sqrt(x*x + y*y + z*z);
};

/**
 * Alias for {@link vec3.distance}
 * @function
 */
vec3.dist = vec3.distance;

/**
 * Calculates the squared euclidian distance between two vec3's
 *
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {Number} squared distance between a and b
 */
vec3.squaredDistance = function(a, b) {
    var x = b[0] - a[0],
        y = b[1] - a[1],
        z = b[2] - a[2];
    return x*x + y*y + z*z;
};

/**
 * Alias for {@link vec3.squaredDistance}
 * @function
 */
vec3.sqrDist = vec3.squaredDistance;

/**
 * Calculates the length of a vec3
 *
 * @param {vec3} a vector to calculate length of
 * @returns {Number} length of a
 */
vec3.length = function (a) {
    var x = a[0],
        y = a[1],
        z = a[2];
    return Math.sqrt(x*x + y*y + z*z);
};

/**
 * Alias for {@link vec3.length}
 * @function
 */
vec3.len = vec3.length;

/**
 * Calculates the squared length of a vec3
 *
 * @param {vec3} a vector to calculate squared length of
 * @returns {Number} squared length of a
 */
vec3.squaredLength = function (a) {
    var x = a[0],
        y = a[1],
        z = a[2];
    return x*x + y*y + z*z;
};

/**
 * Alias for {@link vec3.squaredLength}
 * @function
 */
vec3.sqrLen = vec3.squaredLength;

/**
 * Negates the components of a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a vector to negate
 * @returns {vec3} out
 */
vec3.negate = function(out, a) {
    out[0] = -a[0];
    out[1] = -a[1];
    out[2] = -a[2];
    return out;
};

/**
 * Returns the inverse of the components of a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a vector to invert
 * @returns {vec3} out
 */
vec3.inverse = function(out, a) {
  out[0] = 1.0 / a[0];
  out[1] = 1.0 / a[1];
  out[2] = 1.0 / a[2];
  return out;
};

/**
 * Normalize a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a vector to normalize
 * @returns {vec3} out
 */
vec3.normalize = function(out, a) {
    var x = a[0],
        y = a[1],
        z = a[2];
    var len = x*x + y*y + z*z;
    if (len > 0) {
        //TODO: evaluate use of glm_invsqrt here?
        len = 1 / Math.sqrt(len);
        out[0] = a[0] * len;
        out[1] = a[1] * len;
        out[2] = a[2] * len;
    }
    return out;
};

/**
 * Calculates the dot product of two vec3's
 *
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {Number} dot product of a and b
 */
vec3.dot = function (a, b) {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
};

/**
 * Computes the cross product of two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
vec3.cross = function(out, a, b) {
    var ax = a[0], ay = a[1], az = a[2],
        bx = b[0], by = b[1], bz = b[2];

    out[0] = ay * bz - az * by;
    out[1] = az * bx - ax * bz;
    out[2] = ax * by - ay * bx;
    return out;
};

/**
 * Performs a linear interpolation between two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @param {Number} t interpolation amount between the two inputs
 * @returns {vec3} out
 */
vec3.lerp = function (out, a, b, t) {
    var ax = a[0],
        ay = a[1],
        az = a[2];
    out[0] = ax + t * (b[0] - ax);
    out[1] = ay + t * (b[1] - ay);
    out[2] = az + t * (b[2] - az);
    return out;
};

/**
 * Performs a hermite interpolation with two control points
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @param {vec3} c the third operand
 * @param {vec3} d the fourth operand
 * @param {Number} t interpolation amount between the two inputs
 * @returns {vec3} out
 */
vec3.hermite = function (out, a, b, c, d, t) {
  var factorTimes2 = t * t,
      factor1 = factorTimes2 * (2 * t - 3) + 1,
      factor2 = factorTimes2 * (t - 2) + t,
      factor3 = factorTimes2 * (t - 1),
      factor4 = factorTimes2 * (3 - 2 * t);
  
  out[0] = a[0] * factor1 + b[0] * factor2 + c[0] * factor3 + d[0] * factor4;
  out[1] = a[1] * factor1 + b[1] * factor2 + c[1] * factor3 + d[1] * factor4;
  out[2] = a[2] * factor1 + b[2] * factor2 + c[2] * factor3 + d[2] * factor4;
  
  return out;
};

/**
 * Performs a bezier interpolation with two control points
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @param {vec3} c the third operand
 * @param {vec3} d the fourth operand
 * @param {Number} t interpolation amount between the two inputs
 * @returns {vec3} out
 */
vec3.bezier = function (out, a, b, c, d, t) {
  var inverseFactor = 1 - t,
      inverseFactorTimesTwo = inverseFactor * inverseFactor,
      factorTimes2 = t * t,
      factor1 = inverseFactorTimesTwo * inverseFactor,
      factor2 = 3 * t * inverseFactorTimesTwo,
      factor3 = 3 * factorTimes2 * inverseFactor,
      factor4 = factorTimes2 * t;
  
  out[0] = a[0] * factor1 + b[0] * factor2 + c[0] * factor3 + d[0] * factor4;
  out[1] = a[1] * factor1 + b[1] * factor2 + c[1] * factor3 + d[1] * factor4;
  out[2] = a[2] * factor1 + b[2] * factor2 + c[2] * factor3 + d[2] * factor4;
  
  return out;
};

/**
 * Generates a random vector with the given scale
 *
 * @param {vec3} out the receiving vector
 * @param {Number} [scale] Length of the resulting vector. If ommitted, a unit vector will be returned
 * @returns {vec3} out
 */
vec3.random = function (out, scale) {
    scale = scale || 1.0;

    var r = glMatrix.RANDOM() * 2.0 * Math.PI;
    var z = (glMatrix.RANDOM() * 2.0) - 1.0;
    var zScale = Math.sqrt(1.0-z*z) * scale;

    out[0] = Math.cos(r) * zScale;
    out[1] = Math.sin(r) * zScale;
    out[2] = z * scale;
    return out;
};

/**
 * Transforms the vec3 with a mat4.
 * 4th vector component is implicitly '1'
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the vector to transform
 * @param {mat4} m matrix to transform with
 * @returns {vec3} out
 */
vec3.transformMat4 = function(out, a, m) {
    var x = a[0], y = a[1], z = a[2],
        w = m[3] * x + m[7] * y + m[11] * z + m[15];
    w = w || 1.0;
    out[0] = (m[0] * x + m[4] * y + m[8] * z + m[12]) / w;
    out[1] = (m[1] * x + m[5] * y + m[9] * z + m[13]) / w;
    out[2] = (m[2] * x + m[6] * y + m[10] * z + m[14]) / w;
    return out;
};

/**
 * Transforms the vec3 with a mat3.
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the vector to transform
 * @param {mat4} m the 3x3 matrix to transform with
 * @returns {vec3} out
 */
vec3.transformMat3 = function(out, a, m) {
    var x = a[0], y = a[1], z = a[2];
    out[0] = x * m[0] + y * m[3] + z * m[6];
    out[1] = x * m[1] + y * m[4] + z * m[7];
    out[2] = x * m[2] + y * m[5] + z * m[8];
    return out;
};

/**
 * Transforms the vec3 with a quat
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the vector to transform
 * @param {quat} q quaternion to transform with
 * @returns {vec3} out
 */
vec3.transformQuat = function(out, a, q) {
    // benchmarks: http://jsperf.com/quaternion-transform-vec3-implementations

    var x = a[0], y = a[1], z = a[2],
        qx = q[0], qy = q[1], qz = q[2], qw = q[3],

        // calculate quat * vec
        ix = qw * x + qy * z - qz * y,
        iy = qw * y + qz * x - qx * z,
        iz = qw * z + qx * y - qy * x,
        iw = -qx * x - qy * y - qz * z;

    // calculate result * inverse quat
    out[0] = ix * qw + iw * -qx + iy * -qz - iz * -qy;
    out[1] = iy * qw + iw * -qy + iz * -qx - ix * -qz;
    out[2] = iz * qw + iw * -qz + ix * -qy - iy * -qx;
    return out;
};

/**
 * Rotate a 3D vector around the x-axis
 * @param {vec3} out The receiving vec3
 * @param {vec3} a The vec3 point to rotate
 * @param {vec3} b The origin of the rotation
 * @param {Number} c The angle of rotation
 * @returns {vec3} out
 */
vec3.rotateX = function(out, a, b, c){
   var p = [], r=[];
	  //Translate point to the origin
	  p[0] = a[0] - b[0];
	  p[1] = a[1] - b[1];
  	p[2] = a[2] - b[2];

	  //perform rotation
	  r[0] = p[0];
	  r[1] = p[1]*Math.cos(c) - p[2]*Math.sin(c);
	  r[2] = p[1]*Math.sin(c) + p[2]*Math.cos(c);

	  //translate to correct position
	  out[0] = r[0] + b[0];
	  out[1] = r[1] + b[1];
	  out[2] = r[2] + b[2];

  	return out;
};

/**
 * Rotate a 3D vector around the y-axis
 * @param {vec3} out The receiving vec3
 * @param {vec3} a The vec3 point to rotate
 * @param {vec3} b The origin of the rotation
 * @param {Number} c The angle of rotation
 * @returns {vec3} out
 */
vec3.rotateY = function(out, a, b, c){
  	var p = [], r=[];
  	//Translate point to the origin
  	p[0] = a[0] - b[0];
  	p[1] = a[1] - b[1];
  	p[2] = a[2] - b[2];
  
  	//perform rotation
  	r[0] = p[2]*Math.sin(c) + p[0]*Math.cos(c);
  	r[1] = p[1];
  	r[2] = p[2]*Math.cos(c) - p[0]*Math.sin(c);
  
  	//translate to correct position
  	out[0] = r[0] + b[0];
  	out[1] = r[1] + b[1];
  	out[2] = r[2] + b[2];
  
  	return out;
};

/**
 * Rotate a 3D vector around the z-axis
 * @param {vec3} out The receiving vec3
 * @param {vec3} a The vec3 point to rotate
 * @param {vec3} b The origin of the rotation
 * @param {Number} c The angle of rotation
 * @returns {vec3} out
 */
vec3.rotateZ = function(out, a, b, c){
  	var p = [], r=[];
  	//Translate point to the origin
  	p[0] = a[0] - b[0];
  	p[1] = a[1] - b[1];
  	p[2] = a[2] - b[2];
  
  	//perform rotation
  	r[0] = p[0]*Math.cos(c) - p[1]*Math.sin(c);
  	r[1] = p[0]*Math.sin(c) + p[1]*Math.cos(c);
  	r[2] = p[2];
  
  	//translate to correct position
  	out[0] = r[0] + b[0];
  	out[1] = r[1] + b[1];
  	out[2] = r[2] + b[2];
  
  	return out;
};

/**
 * Perform some operation over an array of vec3s.
 *
 * @param {Array} a the array of vectors to iterate over
 * @param {Number} stride Number of elements between the start of each vec3. If 0 assumes tightly packed
 * @param {Number} offset Number of elements to skip at the beginning of the array
 * @param {Number} count Number of vec3s to iterate over. If 0 iterates over entire array
 * @param {Function} fn Function to call for each vector in the array
 * @param {Object} [arg] additional argument to pass to fn
 * @returns {Array} a
 * @function
 */
vec3.forEach = (function() {
    var vec = vec3.create();

    return function(a, stride, offset, count, fn, arg) {
        var i, l;
        if(!stride) {
            stride = 3;
        }

        if(!offset) {
            offset = 0;
        }
        
        if(count) {
            l = Math.min((count * stride) + offset, a.length);
        } else {
            l = a.length;
        }

        for(i = offset; i < l; i += stride) {
            vec[0] = a[i]; vec[1] = a[i+1]; vec[2] = a[i+2];
            fn(vec, vec, arg);
            a[i] = vec[0]; a[i+1] = vec[1]; a[i+2] = vec[2];
        }
        
        return a;
    };
})();

/**
 * Get the angle between two 3D vectors
 * @param {vec3} a The first operand
 * @param {vec3} b The second operand
 * @returns {Number} The angle in radians
 */
vec3.angle = function(a, b) {
   
    var tempA = vec3.fromValues(a[0], a[1], a[2]);
    var tempB = vec3.fromValues(b[0], b[1], b[2]);
 
    vec3.normalize(tempA, tempA);
    vec3.normalize(tempB, tempB);
 
    var cosine = vec3.dot(tempA, tempB);

    if(cosine > 1.0){
        return 0;
    } else {
        return Math.acos(cosine);
    }     
};

/**
 * Returns a string representation of a vector
 *
 * @param {vec3} vec vector to represent as a string
 * @returns {String} string representation of the vector
 */
vec3.str = function (a) {
    return 'vec3(' + a[0] + ', ' + a[1] + ', ' + a[2] + ')';
};

/**
 * Returns whether or not the vectors have exactly the same elements in the same position (when compared with ===)
 *
 * @param {vec3} a The first vector.
 * @param {vec3} b The second vector.
 * @returns {Boolean} True if the vectors are equal, false otherwise.
 */
vec3.exactEquals = function (a, b) {
    return a[0] === b[0] && a[1] === b[1] && a[2] === b[2];
};

/**
 * Returns whether or not the vectors have approximately the same elements in the same position.
 *
 * @param {vec3} a The first vector.
 * @param {vec3} b The second vector.
 * @returns {Boolean} True if the vectors are equal, false otherwise.
 */
vec3.equals = function (a, b) {
    var a0 = a[0], a1 = a[1], a2 = a[2];
    var b0 = b[0], b1 = b[1], b2 = b[2];
    return (Math.abs(a0 - b0) <= glMatrix.EPSILON*Math.max(1.0, Math.abs(a0), Math.abs(b0)) &&
            Math.abs(a1 - b1) <= glMatrix.EPSILON*Math.max(1.0, Math.abs(a1), Math.abs(b1)) &&
            Math.abs(a2 - b2) <= glMatrix.EPSILON*Math.max(1.0, Math.abs(a2), Math.abs(b2)));
};

module.exports = vec3;

},{"./common.js":24}],32:[function(require,module,exports){
/* Copyright (c) 2015, Brandon Jones, Colin MacKenzie IV.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE. */

var glMatrix = require("./common.js");

/**
 * @class 4 Dimensional Vector
 * @name vec4
 */
var vec4 = {};

/**
 * Creates a new, empty vec4
 *
 * @returns {vec4} a new 4D vector
 */
vec4.create = function() {
    var out = new glMatrix.ARRAY_TYPE(4);
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    return out;
};

/**
 * Creates a new vec4 initialized with values from an existing vector
 *
 * @param {vec4} a vector to clone
 * @returns {vec4} a new 4D vector
 */
vec4.clone = function(a) {
    var out = new glMatrix.ARRAY_TYPE(4);
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    return out;
};

/**
 * Creates a new vec4 initialized with the given values
 *
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @param {Number} w W component
 * @returns {vec4} a new 4D vector
 */
vec4.fromValues = function(x, y, z, w) {
    var out = new glMatrix.ARRAY_TYPE(4);
    out[0] = x;
    out[1] = y;
    out[2] = z;
    out[3] = w;
    return out;
};

/**
 * Copy the values from one vec4 to another
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the source vector
 * @returns {vec4} out
 */
vec4.copy = function(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    return out;
};

/**
 * Set the components of a vec4 to the given values
 *
 * @param {vec4} out the receiving vector
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @param {Number} w W component
 * @returns {vec4} out
 */
vec4.set = function(out, x, y, z, w) {
    out[0] = x;
    out[1] = y;
    out[2] = z;
    out[3] = w;
    return out;
};

/**
 * Adds two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {vec4} out
 */
vec4.add = function(out, a, b) {
    out[0] = a[0] + b[0];
    out[1] = a[1] + b[1];
    out[2] = a[2] + b[2];
    out[3] = a[3] + b[3];
    return out;
};

/**
 * Subtracts vector b from vector a
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {vec4} out
 */
vec4.subtract = function(out, a, b) {
    out[0] = a[0] - b[0];
    out[1] = a[1] - b[1];
    out[2] = a[2] - b[2];
    out[3] = a[3] - b[3];
    return out;
};

/**
 * Alias for {@link vec4.subtract}
 * @function
 */
vec4.sub = vec4.subtract;

/**
 * Multiplies two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {vec4} out
 */
vec4.multiply = function(out, a, b) {
    out[0] = a[0] * b[0];
    out[1] = a[1] * b[1];
    out[2] = a[2] * b[2];
    out[3] = a[3] * b[3];
    return out;
};

/**
 * Alias for {@link vec4.multiply}
 * @function
 */
vec4.mul = vec4.multiply;

/**
 * Divides two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {vec4} out
 */
vec4.divide = function(out, a, b) {
    out[0] = a[0] / b[0];
    out[1] = a[1] / b[1];
    out[2] = a[2] / b[2];
    out[3] = a[3] / b[3];
    return out;
};

/**
 * Alias for {@link vec4.divide}
 * @function
 */
vec4.div = vec4.divide;

/**
 * Math.ceil the components of a vec4
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a vector to ceil
 * @returns {vec4} out
 */
vec4.ceil = function (out, a) {
    out[0] = Math.ceil(a[0]);
    out[1] = Math.ceil(a[1]);
    out[2] = Math.ceil(a[2]);
    out[3] = Math.ceil(a[3]);
    return out;
};

/**
 * Math.floor the components of a vec4
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a vector to floor
 * @returns {vec4} out
 */
vec4.floor = function (out, a) {
    out[0] = Math.floor(a[0]);
    out[1] = Math.floor(a[1]);
    out[2] = Math.floor(a[2]);
    out[3] = Math.floor(a[3]);
    return out;
};

/**
 * Returns the minimum of two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {vec4} out
 */
vec4.min = function(out, a, b) {
    out[0] = Math.min(a[0], b[0]);
    out[1] = Math.min(a[1], b[1]);
    out[2] = Math.min(a[2], b[2]);
    out[3] = Math.min(a[3], b[3]);
    return out;
};

/**
 * Returns the maximum of two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {vec4} out
 */
vec4.max = function(out, a, b) {
    out[0] = Math.max(a[0], b[0]);
    out[1] = Math.max(a[1], b[1]);
    out[2] = Math.max(a[2], b[2]);
    out[3] = Math.max(a[3], b[3]);
    return out;
};

/**
 * Math.round the components of a vec4
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a vector to round
 * @returns {vec4} out
 */
vec4.round = function (out, a) {
    out[0] = Math.round(a[0]);
    out[1] = Math.round(a[1]);
    out[2] = Math.round(a[2]);
    out[3] = Math.round(a[3]);
    return out;
};

/**
 * Scales a vec4 by a scalar number
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the vector to scale
 * @param {Number} b amount to scale the vector by
 * @returns {vec4} out
 */
vec4.scale = function(out, a, b) {
    out[0] = a[0] * b;
    out[1] = a[1] * b;
    out[2] = a[2] * b;
    out[3] = a[3] * b;
    return out;
};

/**
 * Adds two vec4's after scaling the second operand by a scalar value
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @param {Number} scale the amount to scale b by before adding
 * @returns {vec4} out
 */
vec4.scaleAndAdd = function(out, a, b, scale) {
    out[0] = a[0] + (b[0] * scale);
    out[1] = a[1] + (b[1] * scale);
    out[2] = a[2] + (b[2] * scale);
    out[3] = a[3] + (b[3] * scale);
    return out;
};

/**
 * Calculates the euclidian distance between two vec4's
 *
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {Number} distance between a and b
 */
vec4.distance = function(a, b) {
    var x = b[0] - a[0],
        y = b[1] - a[1],
        z = b[2] - a[2],
        w = b[3] - a[3];
    return Math.sqrt(x*x + y*y + z*z + w*w);
};

/**
 * Alias for {@link vec4.distance}
 * @function
 */
vec4.dist = vec4.distance;

/**
 * Calculates the squared euclidian distance between two vec4's
 *
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {Number} squared distance between a and b
 */
vec4.squaredDistance = function(a, b) {
    var x = b[0] - a[0],
        y = b[1] - a[1],
        z = b[2] - a[2],
        w = b[3] - a[3];
    return x*x + y*y + z*z + w*w;
};

/**
 * Alias for {@link vec4.squaredDistance}
 * @function
 */
vec4.sqrDist = vec4.squaredDistance;

/**
 * Calculates the length of a vec4
 *
 * @param {vec4} a vector to calculate length of
 * @returns {Number} length of a
 */
vec4.length = function (a) {
    var x = a[0],
        y = a[1],
        z = a[2],
        w = a[3];
    return Math.sqrt(x*x + y*y + z*z + w*w);
};

/**
 * Alias for {@link vec4.length}
 * @function
 */
vec4.len = vec4.length;

/**
 * Calculates the squared length of a vec4
 *
 * @param {vec4} a vector to calculate squared length of
 * @returns {Number} squared length of a
 */
vec4.squaredLength = function (a) {
    var x = a[0],
        y = a[1],
        z = a[2],
        w = a[3];
    return x*x + y*y + z*z + w*w;
};

/**
 * Alias for {@link vec4.squaredLength}
 * @function
 */
vec4.sqrLen = vec4.squaredLength;

/**
 * Negates the components of a vec4
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a vector to negate
 * @returns {vec4} out
 */
vec4.negate = function(out, a) {
    out[0] = -a[0];
    out[1] = -a[1];
    out[2] = -a[2];
    out[3] = -a[3];
    return out;
};

/**
 * Returns the inverse of the components of a vec4
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a vector to invert
 * @returns {vec4} out
 */
vec4.inverse = function(out, a) {
  out[0] = 1.0 / a[0];
  out[1] = 1.0 / a[1];
  out[2] = 1.0 / a[2];
  out[3] = 1.0 / a[3];
  return out;
};

/**
 * Normalize a vec4
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a vector to normalize
 * @returns {vec4} out
 */
vec4.normalize = function(out, a) {
    var x = a[0],
        y = a[1],
        z = a[2],
        w = a[3];
    var len = x*x + y*y + z*z + w*w;
    if (len > 0) {
        len = 1 / Math.sqrt(len);
        out[0] = x * len;
        out[1] = y * len;
        out[2] = z * len;
        out[3] = w * len;
    }
    return out;
};

/**
 * Calculates the dot product of two vec4's
 *
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {Number} dot product of a and b
 */
vec4.dot = function (a, b) {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3];
};

/**
 * Performs a linear interpolation between two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @param {Number} t interpolation amount between the two inputs
 * @returns {vec4} out
 */
vec4.lerp = function (out, a, b, t) {
    var ax = a[0],
        ay = a[1],
        az = a[2],
        aw = a[3];
    out[0] = ax + t * (b[0] - ax);
    out[1] = ay + t * (b[1] - ay);
    out[2] = az + t * (b[2] - az);
    out[3] = aw + t * (b[3] - aw);
    return out;
};

/**
 * Generates a random vector with the given scale
 *
 * @param {vec4} out the receiving vector
 * @param {Number} [scale] Length of the resulting vector. If ommitted, a unit vector will be returned
 * @returns {vec4} out
 */
vec4.random = function (out, scale) {
    scale = scale || 1.0;

    //TODO: This is a pretty awful way of doing this. Find something better.
    out[0] = glMatrix.RANDOM();
    out[1] = glMatrix.RANDOM();
    out[2] = glMatrix.RANDOM();
    out[3] = glMatrix.RANDOM();
    vec4.normalize(out, out);
    vec4.scale(out, out, scale);
    return out;
};

/**
 * Transforms the vec4 with a mat4.
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the vector to transform
 * @param {mat4} m matrix to transform with
 * @returns {vec4} out
 */
vec4.transformMat4 = function(out, a, m) {
    var x = a[0], y = a[1], z = a[2], w = a[3];
    out[0] = m[0] * x + m[4] * y + m[8] * z + m[12] * w;
    out[1] = m[1] * x + m[5] * y + m[9] * z + m[13] * w;
    out[2] = m[2] * x + m[6] * y + m[10] * z + m[14] * w;
    out[3] = m[3] * x + m[7] * y + m[11] * z + m[15] * w;
    return out;
};

/**
 * Transforms the vec4 with a quat
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the vector to transform
 * @param {quat} q quaternion to transform with
 * @returns {vec4} out
 */
vec4.transformQuat = function(out, a, q) {
    var x = a[0], y = a[1], z = a[2],
        qx = q[0], qy = q[1], qz = q[2], qw = q[3],

        // calculate quat * vec
        ix = qw * x + qy * z - qz * y,
        iy = qw * y + qz * x - qx * z,
        iz = qw * z + qx * y - qy * x,
        iw = -qx * x - qy * y - qz * z;

    // calculate result * inverse quat
    out[0] = ix * qw + iw * -qx + iy * -qz - iz * -qy;
    out[1] = iy * qw + iw * -qy + iz * -qx - ix * -qz;
    out[2] = iz * qw + iw * -qz + ix * -qy - iy * -qx;
    out[3] = a[3];
    return out;
};

/**
 * Perform some operation over an array of vec4s.
 *
 * @param {Array} a the array of vectors to iterate over
 * @param {Number} stride Number of elements between the start of each vec4. If 0 assumes tightly packed
 * @param {Number} offset Number of elements to skip at the beginning of the array
 * @param {Number} count Number of vec4s to iterate over. If 0 iterates over entire array
 * @param {Function} fn Function to call for each vector in the array
 * @param {Object} [arg] additional argument to pass to fn
 * @returns {Array} a
 * @function
 */
vec4.forEach = (function() {
    var vec = vec4.create();

    return function(a, stride, offset, count, fn, arg) {
        var i, l;
        if(!stride) {
            stride = 4;
        }

        if(!offset) {
            offset = 0;
        }
        
        if(count) {
            l = Math.min((count * stride) + offset, a.length);
        } else {
            l = a.length;
        }

        for(i = offset; i < l; i += stride) {
            vec[0] = a[i]; vec[1] = a[i+1]; vec[2] = a[i+2]; vec[3] = a[i+3];
            fn(vec, vec, arg);
            a[i] = vec[0]; a[i+1] = vec[1]; a[i+2] = vec[2]; a[i+3] = vec[3];
        }
        
        return a;
    };
})();

/**
 * Returns a string representation of a vector
 *
 * @param {vec4} vec vector to represent as a string
 * @returns {String} string representation of the vector
 */
vec4.str = function (a) {
    return 'vec4(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + a[3] + ')';
};

/**
 * Returns whether or not the vectors have exactly the same elements in the same position (when compared with ===)
 *
 * @param {vec4} a The first vector.
 * @param {vec4} b The second vector.
 * @returns {Boolean} True if the vectors are equal, false otherwise.
 */
vec4.exactEquals = function (a, b) {
    return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3];
};

/**
 * Returns whether or not the vectors have approximately the same elements in the same position.
 *
 * @param {vec4} a The first vector.
 * @param {vec4} b The second vector.
 * @returns {Boolean} True if the vectors are equal, false otherwise.
 */
vec4.equals = function (a, b) {
    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3];
    var b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3];
    return (Math.abs(a0 - b0) <= glMatrix.EPSILON*Math.max(1.0, Math.abs(a0), Math.abs(b0)) &&
            Math.abs(a1 - b1) <= glMatrix.EPSILON*Math.max(1.0, Math.abs(a1), Math.abs(b1)) &&
            Math.abs(a2 - b2) <= glMatrix.EPSILON*Math.max(1.0, Math.abs(a2), Math.abs(b2)) &&
            Math.abs(a3 - b3) <= glMatrix.EPSILON*Math.max(1.0, Math.abs(a3), Math.abs(b3)));
};

module.exports = vec4;

},{"./common.js":24}],33:[function(require,module,exports){
(function (global){
/*
** Copyright (c) 2012 The Khronos Group Inc.
**
** Permission is hereby granted, free of charge, to any person obtaining a
** copy of this software and/or associated documentation files (the
** "Materials"), to deal in the Materials without restriction, including
** without limitation the rights to use, copy, modify, merge, publish,
** distribute, sublicense, and/or sell copies of the Materials, and to
** permit persons to whom the Materials are furnished to do so, subject to
** the following conditions:
**
** The above copyright notice and this permission notice shall be included
** in all copies or substantial portions of the Materials.
**
** THE MATERIALS ARE PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
** EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
** MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
** IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
** CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
** TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
** MATERIALS OR THE USE OR OTHER DEALINGS IN THE MATERIALS.
*/

//Ported to node by Marcin Ignac on 2016-05-20

// Various functions for helping debug WebGL apps.

WebGLDebugUtils = function() {

//polyfill window in node
if (typeof(window) == 'undefined') {
    window = global;
}

/**
 * Wrapped logging function.
 * @param {string} msg Message to log.
 */
var log = function(msg) {
  if (window.console && window.console.log) {
    window.console.log(msg);
  }
};

/**
 * Wrapped error logging function.
 * @param {string} msg Message to log.
 */
var error = function(msg) {
  if (window.console && window.console.error) {
    window.console.error(msg);
  } else {
    log(msg);
  }
};


/**
 * Which arguments are enums based on the number of arguments to the function.
 * So
 *    'texImage2D': {
 *       9: { 0:true, 2:true, 6:true, 7:true },
 *       6: { 0:true, 2:true, 3:true, 4:true },
 *    },
 *
 * means if there are 9 arguments then 6 and 7 are enums, if there are 6
 * arguments 3 and 4 are enums
 *
 * @type {!Object.<number, !Object.<number, string>}
 */
var glValidEnumContexts = {
  // Generic setters and getters

  'enable': {1: { 0:true }},
  'disable': {1: { 0:true }},
  'getParameter': {1: { 0:true }},

  // Rendering

  'drawArrays': {3:{ 0:true }},
  'drawElements': {4:{ 0:true, 2:true }},

  // Shaders

  'createShader': {1: { 0:true }},
  'getShaderParameter': {2: { 1:true }},
  'getProgramParameter': {2: { 1:true }},
  'getShaderPrecisionFormat': {2: { 0: true, 1:true }},

  // Vertex attributes

  'getVertexAttrib': {2: { 1:true }},
  'vertexAttribPointer': {6: { 2:true }},

  // Textures

  'bindTexture': {2: { 0:true }},
  'activeTexture': {1: { 0:true }},
  'getTexParameter': {2: { 0:true, 1:true }},
  'texParameterf': {3: { 0:true, 1:true }},
  'texParameteri': {3: { 0:true, 1:true, 2:true }},
  'texImage2D': {
     9: { 0:true, 2:true, 6:true, 7:true },
     6: { 0:true, 2:true, 3:true, 4:true }
  },
  'texSubImage2D': {
    9: { 0:true, 6:true, 7:true },
    7: { 0:true, 4:true, 5:true }
  },
  'copyTexImage2D': {8: { 0:true, 2:true }},
  'copyTexSubImage2D': {8: { 0:true }},
  'generateMipmap': {1: { 0:true }},
  'compressedTexImage2D': {7: { 0: true, 2:true }},
  'compressedTexSubImage2D': {8: { 0: true, 6:true }},

  // Buffer objects

  'bindBuffer': {2: { 0:true }},
  'bufferData': {3: { 0:true, 2:true }},
  'bufferSubData': {3: { 0:true }},
  'getBufferParameter': {2: { 0:true, 1:true }},

  // Renderbuffers and framebuffers

  'pixelStorei': {2: { 0:true, 1:true }},
  'readPixels': {7: { 4:true, 5:true }},
  'bindRenderbuffer': {2: { 0:true }},
  'bindFramebuffer': {2: { 0:true }},
  'checkFramebufferStatus': {1: { 0:true }},
  'framebufferRenderbuffer': {4: { 0:true, 1:true, 2:true }},
  'framebufferTexture2D': {5: { 0:true, 1:true, 2:true }},
  'getFramebufferAttachmentParameter': {3: { 0:true, 1:true, 2:true }},
  'getRenderbufferParameter': {2: { 0:true, 1:true }},
  'renderbufferStorage': {4: { 0:true, 1:true }},

  // Frame buffer operations (clear, blend, depth test, stencil)

  'clear': {1: { 0: { 'enumBitwiseOr': ['COLOR_BUFFER_BIT', 'DEPTH_BUFFER_BIT', 'STENCIL_BUFFER_BIT'] }}},
  'depthFunc': {1: { 0:true }},
  'blendFunc': {2: { 0:true, 1:true }},
  'blendFuncSeparate': {4: { 0:true, 1:true, 2:true, 3:true }},
  'blendEquation': {1: { 0:true }},
  'blendEquationSeparate': {2: { 0:true, 1:true }},
  'stencilFunc': {3: { 0:true }},
  'stencilFuncSeparate': {4: { 0:true, 1:true }},
  'stencilMaskSeparate': {2: { 0:true }},
  'stencilOp': {3: { 0:true, 1:true, 2:true }},
  'stencilOpSeparate': {4: { 0:true, 1:true, 2:true, 3:true }},

  // Culling

  'cullFace': {1: { 0:true }},
  'frontFace': {1: { 0:true }},

  // ANGLE_instanced_arrays extension

  'drawArraysInstancedANGLE': {4: { 0:true }},
  'drawElementsInstancedANGLE': {5: { 0:true, 2:true }},

  // EXT_blend_minmax extension

  'blendEquationEXT': {1: { 0:true }}
};

/**
 * Map of numbers to names.
 * @type {Object}
 */
var glEnums = null;

/**
 * Map of names to numbers.
 * @type {Object}
 */
var enumStringToValue = null;

/**
 * Initializes this module. Safe to call more than once.
 * @param {!WebGLRenderingContext} ctx A WebGL context. If
 *    you have more than one context it doesn't matter which one
 *    you pass in, it is only used to pull out constants.
 */
function init(ctx) {
  if (glEnums == null) {
    glEnums = { };
    enumStringToValue = { };
    for (var propertyName in ctx) {
      if (typeof ctx[propertyName] == 'number') {
        glEnums[ctx[propertyName]] = propertyName;
        enumStringToValue[propertyName] = ctx[propertyName];
      }
    }
  }
}

/**
 * Checks the utils have been initialized.
 */
function checkInit() {
  if (glEnums == null) {
    throw 'WebGLDebugUtils.init(ctx) not called';
  }
}

/**
 * Returns true or false if value matches any WebGL enum
 * @param {*} value Value to check if it might be an enum.
 * @return {boolean} True if value matches one of the WebGL defined enums
 */
function mightBeEnum(value) {
  checkInit();
  return (glEnums[value] !== undefined);
}

/**
 * Gets an string version of an WebGL enum.
 *
 * Example:
 *   var str = WebGLDebugUtil.glEnumToString(ctx.getError());
 *
 * @param {number} value Value to return an enum for
 * @return {string} The string version of the enum.
 */
function glEnumToString(value) {
  checkInit();
  var name = glEnums[value];
  return (name !== undefined) ? ("gl." + name) :
      ("/*UNKNOWN WebGL ENUM*/ 0x" + value.toString(16) + "");
}

/**
 * Returns the string version of a WebGL argument.
 * Attempts to convert enum arguments to strings.
 * @param {string} functionName the name of the WebGL function.
 * @param {number} numArgs the number of arguments passed to the function.
 * @param {number} argumentIndx the index of the argument.
 * @param {*} value The value of the argument.
 * @return {string} The value as a string.
 */
function glFunctionArgToString(functionName, numArgs, argumentIndex, value) {
  var funcInfo = glValidEnumContexts[functionName];
  if (funcInfo !== undefined) {
    var funcInfo = funcInfo[numArgs];
    if (funcInfo !== undefined) {
      if (funcInfo[argumentIndex]) {
        if (typeof funcInfo[argumentIndex] === 'object' &&
            funcInfo[argumentIndex]['enumBitwiseOr'] !== undefined) {
          var enums = funcInfo[argumentIndex]['enumBitwiseOr'];
          var orResult = 0;
          var orEnums = [];
          for (var i = 0; i < enums.length; ++i) {
            var enumValue = enumStringToValue[enums[i]];
            if ((value & enumValue) !== 0) {
              orResult |= enumValue;
              orEnums.push(glEnumToString(enumValue));
            }
          }
          if (orResult === value) {
            return orEnums.join(' | ');
          } else {
            return glEnumToString(value);
          }
        } else {
          return glEnumToString(value);
        }
      }
    }
  }
  if (value === null) {
    return "null";
  } else if (value === undefined) {
    return "undefined";
  } else {
    return value.toString();
  }
}

/**
 * Converts the arguments of a WebGL function to a string.
 * Attempts to convert enum arguments to strings.
 *
 * @param {string} functionName the name of the WebGL function.
 * @param {number} args The arguments.
 * @return {string} The arguments as a string.
 */
function glFunctionArgsToString(functionName, args) {
  // apparently we can't do args.join(",");
  var argStr = "";
  var numArgs = args.length;
  for (var ii = 0; ii < numArgs; ++ii) {
    argStr += ((ii == 0) ? '' : ', ') +
        glFunctionArgToString(functionName, numArgs, ii, args[ii]);
  }
  return argStr;
};


function makePropertyWrapper(wrapper, original, propertyName) {
  //log("wrap prop: " + propertyName);
  wrapper.__defineGetter__(propertyName, function() {
    return original[propertyName];
  });
  // TODO(gmane): this needs to handle properties that take more than
  // one value?
  wrapper.__defineSetter__(propertyName, function(value) {
    //log("set: " + propertyName);
    original[propertyName] = value;
  });
}

// Makes a function that calls a function on another object.
function makeFunctionWrapper(original, functionName) {
  //log("wrap fn: " + functionName);
  var f = original[functionName];
  return function() {
    //log("call: " + functionName);
    var result = f.apply(original, arguments);
    return result;
  };
}

/**
 * Given a WebGL context returns a wrapped context that calls
 * gl.getError after every command and calls a function if the
 * result is not gl.NO_ERROR.
 *
 * @param {!WebGLRenderingContext} ctx The webgl context to
 *        wrap.
 * @param {!function(err, funcName, args): void} opt_onErrorFunc
 *        The function to call when gl.getError returns an
 *        error. If not specified the default function calls
 *        console.log with a message.
 * @param {!function(funcName, args): void} opt_onFunc The
 *        function to call when each webgl function is called.
 *        You can use this to log all calls for example.
 * @param {!WebGLRenderingContext} opt_err_ctx The webgl context
 *        to call getError on if different than ctx.
 */
function makeDebugContext(ctx, opt_onErrorFunc, opt_onFunc, opt_err_ctx) {
  opt_err_ctx = opt_err_ctx || ctx;
  init(ctx);
  opt_onErrorFunc = opt_onErrorFunc || function(err, functionName, args) {
        // apparently we can't do args.join(",");
        var argStr = "";
        var numArgs = args.length;
        for (var ii = 0; ii < numArgs; ++ii) {
          argStr += ((ii == 0) ? '' : ', ') +
              glFunctionArgToString(functionName, numArgs, ii, args[ii]);
        }
        error("WebGL error "+ glEnumToString(err) + " in "+ functionName +
              "(" + argStr + ")");
      };

  // Holds booleans for each GL error so after we get the error ourselves
  // we can still return it to the client app.
  var glErrorShadow = { };

  // Makes a function that calls a WebGL function and then calls getError.
  function makeErrorWrapper(ctx, functionName) {
    return function() {
      if (opt_onFunc) {
        opt_onFunc(functionName, arguments);
      }
      var result = ctx[functionName].apply(ctx, arguments);
      var err = opt_err_ctx.getError();
      if (err != 0) {
        glErrorShadow[err] = true;
        opt_onErrorFunc(err, functionName, arguments);
      }
      return result;
    };
  }

  // Make a an object that has a copy of every property of the WebGL context
  // but wraps all functions.
  var wrapper = {};
  for (var propertyName in ctx) {
    if (typeof ctx[propertyName] == 'function') {
      if (propertyName != 'getExtension') {
        wrapper[propertyName] = makeErrorWrapper(ctx, propertyName);
      } else {
        var wrapped = makeErrorWrapper(ctx, propertyName);
        wrapper[propertyName] = function () {
          var result = wrapped.apply(ctx, arguments);
          return makeDebugContext(result, opt_onErrorFunc, opt_onFunc, opt_err_ctx);
        };
      }
    } else {
      makePropertyWrapper(wrapper, ctx, propertyName);
    }
  }

  // Override the getError function with one that returns our saved results.
  wrapper.getError = function() {
    for (var err in glErrorShadow) {
      if (glErrorShadow.hasOwnProperty(err)) {
        if (glErrorShadow[err]) {
          glErrorShadow[err] = false;
          return err;
        }
      }
    }
    return ctx.NO_ERROR;
  };

  return wrapper;
}

function resetToInitialState(ctx) {
  var numAttribs = ctx.getParameter(ctx.MAX_VERTEX_ATTRIBS);
  var tmp = ctx.createBuffer();
  ctx.bindBuffer(ctx.ARRAY_BUFFER, tmp);
  for (var ii = 0; ii < numAttribs; ++ii) {
    ctx.disableVertexAttribArray(ii);
    ctx.vertexAttribPointer(ii, 4, ctx.FLOAT, false, 0, 0);
    ctx.vertexAttrib1f(ii, 0);
  }
  ctx.deleteBuffer(tmp);

  var numTextureUnits = ctx.getParameter(ctx.MAX_TEXTURE_IMAGE_UNITS);
  for (var ii = 0; ii < numTextureUnits; ++ii) {
    ctx.activeTexture(ctx.TEXTURE0 + ii);
    ctx.bindTexture(ctx.TEXTURE_CUBE_MAP, null);
    ctx.bindTexture(ctx.TEXTURE_2D, null);
  }

  ctx.activeTexture(ctx.TEXTURE0);
  ctx.useProgram(null);
  ctx.bindBuffer(ctx.ARRAY_BUFFER, null);
  ctx.bindBuffer(ctx.ELEMENT_ARRAY_BUFFER, null);
  ctx.bindFramebuffer(ctx.FRAMEBUFFER, null);
  ctx.bindRenderbuffer(ctx.RENDERBUFFER, null);
  ctx.disable(ctx.BLEND);
  ctx.disable(ctx.CULL_FACE);
  ctx.disable(ctx.DEPTH_TEST);
  ctx.disable(ctx.DITHER);
  ctx.disable(ctx.SCISSOR_TEST);
  ctx.blendColor(0, 0, 0, 0);
  ctx.blendEquation(ctx.FUNC_ADD);
  ctx.blendFunc(ctx.ONE, ctx.ZERO);
  ctx.clearColor(0, 0, 0, 0);
  ctx.clearDepth(1);
  ctx.clearStencil(-1);
  ctx.colorMask(true, true, true, true);
  ctx.cullFace(ctx.BACK);
  ctx.depthFunc(ctx.LESS);
  ctx.depthMask(true);
  ctx.depthRange(0, 1);
  ctx.frontFace(ctx.CCW);
  ctx.hint(ctx.GENERATE_MIPMAP_HINT, ctx.DONT_CARE);
  ctx.lineWidth(1);
  ctx.pixelStorei(ctx.PACK_ALIGNMENT, 4);
  ctx.pixelStorei(ctx.UNPACK_ALIGNMENT, 4);
  ctx.pixelStorei(ctx.UNPACK_FLIP_Y_WEBGL, false);
  ctx.pixelStorei(ctx.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
  // TODO: Delete this IF.
  if (ctx.UNPACK_COLORSPACE_CONVERSION_WEBGL) {
    ctx.pixelStorei(ctx.UNPACK_COLORSPACE_CONVERSION_WEBGL, ctx.BROWSER_DEFAULT_WEBGL);
  }
  ctx.polygonOffset(0, 0);
  ctx.sampleCoverage(1, false);
  ctx.scissor(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.stencilFunc(ctx.ALWAYS, 0, 0xFFFFFFFF);
  ctx.stencilMask(0xFFFFFFFF);
  ctx.stencilOp(ctx.KEEP, ctx.KEEP, ctx.KEEP);
  ctx.viewport(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.clear(ctx.COLOR_BUFFER_BIT | ctx.DEPTH_BUFFER_BIT | ctx.STENCIL_BUFFER_BIT);

  // TODO: This should NOT be needed but Firefox fails with 'hint'
  while(ctx.getError());
}

function makeLostContextSimulatingCanvas(canvas) {
  var unwrappedContext_;
  var wrappedContext_;
  var onLost_ = [];
  var onRestored_ = [];
  var wrappedContext_ = {};
  var contextId_ = 1;
  var contextLost_ = false;
  var resourceId_ = 0;
  var resourceDb_ = [];
  var numCallsToLoseContext_ = 0;
  var numCalls_ = 0;
  var canRestore_ = false;
  var restoreTimeout_ = 0;

  // Holds booleans for each GL error so can simulate errors.
  var glErrorShadow_ = { };

  canvas.getContext = function(f) {
    return function() {
      var ctx = f.apply(canvas, arguments);
      // Did we get a context and is it a WebGL context?
      if (ctx instanceof WebGLRenderingContext) {
        if (ctx != unwrappedContext_) {
          if (unwrappedContext_) {
            throw "got different context"
          }
          unwrappedContext_ = ctx;
          wrappedContext_ = makeLostContextSimulatingContext(unwrappedContext_);
        }
        return wrappedContext_;
      }
      return ctx;
    }
  }(canvas.getContext);

  function wrapEvent(listener) {
    if (typeof(listener) == "function") {
      return listener;
    } else {
      return function(info) {
        listener.handleEvent(info);
      }
    }
  }

  var addOnContextLostListener = function(listener) {
    onLost_.push(wrapEvent(listener));
  };

  var addOnContextRestoredListener = function(listener) {
    onRestored_.push(wrapEvent(listener));
  };


  function wrapAddEventListener(canvas) {
    var f = canvas.addEventListener;
    canvas.addEventListener = function(type, listener, bubble) {
      switch (type) {
        case 'webglcontextlost':
          addOnContextLostListener(listener);
          break;
        case 'webglcontextrestored':
          addOnContextRestoredListener(listener);
          break;
        default:
          f.apply(canvas, arguments);
      }
    };
  }

  wrapAddEventListener(canvas);

  canvas.loseContext = function() {
    if (!contextLost_) {
      contextLost_ = true;
      numCallsToLoseContext_ = 0;
      ++contextId_;
      while (unwrappedContext_.getError());
      clearErrors();
      glErrorShadow_[unwrappedContext_.CONTEXT_LOST_WEBGL] = true;
      var event = makeWebGLContextEvent("context lost");
      var callbacks = onLost_.slice();
      setTimeout(function() {
          //log("numCallbacks:" + callbacks.length);
          for (var ii = 0; ii < callbacks.length; ++ii) {
            //log("calling callback:" + ii);
            callbacks[ii](event);
          }
          if (restoreTimeout_ >= 0) {
            setTimeout(function() {
                canvas.restoreContext();
              }, restoreTimeout_);
          }
        }, 0);
    }
  };

  canvas.restoreContext = function() {
    if (contextLost_) {
      if (onRestored_.length) {
        setTimeout(function() {
            if (!canRestore_) {
              throw "can not restore. webglcontestlost listener did not call event.preventDefault";
            }
            freeResources();
            resetToInitialState(unwrappedContext_);
            contextLost_ = false;
            numCalls_ = 0;
            canRestore_ = false;
            var callbacks = onRestored_.slice();
            var event = makeWebGLContextEvent("context restored");
            for (var ii = 0; ii < callbacks.length; ++ii) {
              callbacks[ii](event);
            }
          }, 0);
      }
    }
  };

  canvas.loseContextInNCalls = function(numCalls) {
    if (contextLost_) {
      throw "You can not ask a lost contet to be lost";
    }
    numCallsToLoseContext_ = numCalls_ + numCalls;
  };

  canvas.getNumCalls = function() {
    return numCalls_;
  };

  canvas.setRestoreTimeout = function(timeout) {
    restoreTimeout_ = timeout;
  };

  function isWebGLObject(obj) {
    //return false;
    return (obj instanceof WebGLBuffer ||
            obj instanceof WebGLFramebuffer ||
            obj instanceof WebGLProgram ||
            obj instanceof WebGLRenderbuffer ||
            obj instanceof WebGLShader ||
            obj instanceof WebGLTexture);
  }

  function checkResources(args) {
    for (var ii = 0; ii < args.length; ++ii) {
      var arg = args[ii];
      if (isWebGLObject(arg)) {
        return arg.__webglDebugContextLostId__ == contextId_;
      }
    }
    return true;
  }

  function clearErrors() {
    var k = Object.keys(glErrorShadow_);
    for (var ii = 0; ii < k.length; ++ii) {
      delete glErrorShadow_[k];
    }
  }

  function loseContextIfTime() {
    ++numCalls_;
    if (!contextLost_) {
      if (numCallsToLoseContext_ == numCalls_) {
        canvas.loseContext();
      }
    }
  }

  // Makes a function that simulates WebGL when out of context.
  function makeLostContextFunctionWrapper(ctx, functionName) {
    var f = ctx[functionName];
    return function() {
      // log("calling:" + functionName);
      // Only call the functions if the context is not lost.
      loseContextIfTime();
      if (!contextLost_) {
        //if (!checkResources(arguments)) {
        //  glErrorShadow_[wrappedContext_.INVALID_OPERATION] = true;
        //  return;
        //}
        var result = f.apply(ctx, arguments);
        return result;
      }
    };
  }

  function freeResources() {
    for (var ii = 0; ii < resourceDb_.length; ++ii) {
      var resource = resourceDb_[ii];
      if (resource instanceof WebGLBuffer) {
        unwrappedContext_.deleteBuffer(resource);
      } else if (resource instanceof WebGLFramebuffer) {
        unwrappedContext_.deleteFramebuffer(resource);
      } else if (resource instanceof WebGLProgram) {
        unwrappedContext_.deleteProgram(resource);
      } else if (resource instanceof WebGLRenderbuffer) {
        unwrappedContext_.deleteRenderbuffer(resource);
      } else if (resource instanceof WebGLShader) {
        unwrappedContext_.deleteShader(resource);
      } else if (resource instanceof WebGLTexture) {
        unwrappedContext_.deleteTexture(resource);
      }
    }
  }

  function makeWebGLContextEvent(statusMessage) {
    return {
      statusMessage: statusMessage,
      preventDefault: function() {
          canRestore_ = true;
        }
    };
  }

  return canvas;

  function makeLostContextSimulatingContext(ctx) {
    // copy all functions and properties to wrapper
    for (var propertyName in ctx) {
      if (typeof ctx[propertyName] == 'function') {
         wrappedContext_[propertyName] = makeLostContextFunctionWrapper(
             ctx, propertyName);
       } else {
         makePropertyWrapper(wrappedContext_, ctx, propertyName);
       }
    }

    // Wrap a few functions specially.
    wrappedContext_.getError = function() {
      loseContextIfTime();
      if (!contextLost_) {
        var err;
        while (err = unwrappedContext_.getError()) {
          glErrorShadow_[err] = true;
        }
      }
      for (var err in glErrorShadow_) {
        if (glErrorShadow_[err]) {
          delete glErrorShadow_[err];
          return err;
        }
      }
      return wrappedContext_.NO_ERROR;
    };

    var creationFunctions = [
      "createBuffer",
      "createFramebuffer",
      "createProgram",
      "createRenderbuffer",
      "createShader",
      "createTexture"
    ];
    for (var ii = 0; ii < creationFunctions.length; ++ii) {
      var functionName = creationFunctions[ii];
      wrappedContext_[functionName] = function(f) {
        return function() {
          loseContextIfTime();
          if (contextLost_) {
            return null;
          }
          var obj = f.apply(ctx, arguments);
          obj.__webglDebugContextLostId__ = contextId_;
          resourceDb_.push(obj);
          return obj;
        };
      }(ctx[functionName]);
    }

    var functionsThatShouldReturnNull = [
      "getActiveAttrib",
      "getActiveUniform",
      "getBufferParameter",
      "getContextAttributes",
      "getAttachedShaders",
      "getFramebufferAttachmentParameter",
      "getParameter",
      "getProgramParameter",
      "getProgramInfoLog",
      "getRenderbufferParameter",
      "getShaderParameter",
      "getShaderInfoLog",
      "getShaderSource",
      "getTexParameter",
      "getUniform",
      "getUniformLocation",
      "getVertexAttrib"
    ];
    for (var ii = 0; ii < functionsThatShouldReturnNull.length; ++ii) {
      var functionName = functionsThatShouldReturnNull[ii];
      wrappedContext_[functionName] = function(f) {
        return function() {
          loseContextIfTime();
          if (contextLost_) {
            return null;
          }
          return f.apply(ctx, arguments);
        }
      }(wrappedContext_[functionName]);
    }

    var isFunctions = [
      "isBuffer",
      "isEnabled",
      "isFramebuffer",
      "isProgram",
      "isRenderbuffer",
      "isShader",
      "isTexture"
    ];
    for (var ii = 0; ii < isFunctions.length; ++ii) {
      var functionName = isFunctions[ii];
      wrappedContext_[functionName] = function(f) {
        return function() {
          loseContextIfTime();
          if (contextLost_) {
            return false;
          }
          return f.apply(ctx, arguments);
        }
      }(wrappedContext_[functionName]);
    }

    wrappedContext_.checkFramebufferStatus = function(f) {
      return function() {
        loseContextIfTime();
        if (contextLost_) {
          return wrappedContext_.FRAMEBUFFER_UNSUPPORTED;
        }
        return f.apply(ctx, arguments);
      };
    }(wrappedContext_.checkFramebufferStatus);

    wrappedContext_.getAttribLocation = function(f) {
      return function() {
        loseContextIfTime();
        if (contextLost_) {
          return -1;
        }
        return f.apply(ctx, arguments);
      };
    }(wrappedContext_.getAttribLocation);

    wrappedContext_.getVertexAttribOffset = function(f) {
      return function() {
        loseContextIfTime();
        if (contextLost_) {
          return 0;
        }
        return f.apply(ctx, arguments);
      };
    }(wrappedContext_.getVertexAttribOffset);

    wrappedContext_.isContextLost = function() {
      return contextLost_;
    };

    return wrappedContext_;
  }
}

return {
  /**
   * Initializes this module. Safe to call more than once.
   * @param {!WebGLRenderingContext} ctx A WebGL context. If
   *    you have more than one context it doesn't matter which one
   *    you pass in, it is only used to pull out constants.
   */
  'init': init,

  /**
   * Returns true or false if value matches any WebGL enum
   * @param {*} value Value to check if it might be an enum.
   * @return {boolean} True if value matches one of the WebGL defined enums
   */
  'mightBeEnum': mightBeEnum,

  /**
   * Gets an string version of an WebGL enum.
   *
   * Example:
   *   WebGLDebugUtil.init(ctx);
   *   var str = WebGLDebugUtil.glEnumToString(ctx.getError());
   *
   * @param {number} value Value to return an enum for
   * @return {string} The string version of the enum.
   */
  'glEnumToString': glEnumToString,

  /**
   * Converts the argument of a WebGL function to a string.
   * Attempts to convert enum arguments to strings.
   *
   * Example:
   *   WebGLDebugUtil.init(ctx);
   *   var str = WebGLDebugUtil.glFunctionArgToString('bindTexture', 2, 0, gl.TEXTURE_2D);
   *
   * would return 'TEXTURE_2D'
   *
   * @param {string} functionName the name of the WebGL function.
   * @param {number} numArgs The number of arguments
   * @param {number} argumentIndx the index of the argument.
   * @param {*} value The value of the argument.
   * @return {string} The value as a string.
   */
  'glFunctionArgToString': glFunctionArgToString,

  /**
   * Converts the arguments of a WebGL function to a string.
   * Attempts to convert enum arguments to strings.
   *
   * @param {string} functionName the name of the WebGL function.
   * @param {number} args The arguments.
   * @return {string} The arguments as a string.
   */
  'glFunctionArgsToString': glFunctionArgsToString,

  /**
   * Given a WebGL context returns a wrapped context that calls
   * gl.getError after every command and calls a function if the
   * result is not NO_ERROR.
   *
   * You can supply your own function if you want. For example, if you'd like
   * an exception thrown on any GL error you could do this
   *
   *    function throwOnGLError(err, funcName, args) {
   *      throw WebGLDebugUtils.glEnumToString(err) +
   *            " was caused by call to " + funcName;
   *    };
   *
   *    ctx = WebGLDebugUtils.makeDebugContext(
   *        canvas.getContext("webgl"), throwOnGLError);
   *
   * @param {!WebGLRenderingContext} ctx The webgl context to wrap.
   * @param {!function(err, funcName, args): void} opt_onErrorFunc The function
   *     to call when gl.getError returns an error. If not specified the default
   *     function calls console.log with a message.
   * @param {!function(funcName, args): void} opt_onFunc The
   *     function to call when each webgl function is called. You
   *     can use this to log all calls for example.
   */
  'makeDebugContext': makeDebugContext,

  /**
   * Given a canvas element returns a wrapped canvas element that will
   * simulate lost context. The canvas returned adds the following functions.
   *
   * loseContext:
   *   simulates a lost context event.
   *
   * restoreContext:
   *   simulates the context being restored.
   *
   * lostContextInNCalls:
   *   loses the context after N gl calls.
   *
   * getNumCalls:
   *   tells you how many gl calls there have been so far.
   *
   * setRestoreTimeout:
   *   sets the number of milliseconds until the context is restored
   *   after it has been lost. Defaults to 0. Pass -1 to prevent
   *   automatic restoring.
   *
   * @param {!Canvas} canvas The canvas element to wrap.
   */
  'makeLostContextSimulatingCanvas': makeLostContextSimulatingCanvas,

  /**
   * Resets a context to the initial state.
   * @param {!WebGLRenderingContext} ctx The webgl context to
   *     reset.
   */
  'resetToInitialState': resetToInitialState
};

}();

module.exports = WebGLDebugUtils;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],34:[function(require,module,exports){
'use strict';

// internal class
// you should require base.js or point.js

var Util = require('../util');

// used by isOutOfStage method
var EXTRA_OUT_OF_SIZE = 100;

var id = 0;

var ObjectBase = function ObjectBase(scene) {
	this.scene = scene;
	this.core = scene.core;
	// TODO: parent -> parent() because ajust to root method
	this.parent = null; // parent object if this is sub object
	this.id = ++id;

	this.frame_count = 0;

	this._x = 0; // local center x
	this._y = 0; // local center y

	// manage flags that disappears in frame elapsed
	this._auto_disable_times_map = {};

	this._velocity = null;
	this.resetVelocity();

	this._previous_x = null;
	this._previous_y = null;

	// sub object
	this.objects = [];
};

Util.defineProperty(ObjectBase, "x");
Util.defineProperty(ObjectBase, "y");

ObjectBase.prototype.init = function () {
	this.frame_count = 0;

	// NOTE: abolished
	//this._x = 0;
	//this._y = 0;

	this._auto_disable_times_map = {};

	this.resetVelocity();

	this._previous_x = null;
	this._previous_y = null;

	for (var i = 0, len = this.objects.length; i < len; i++) {
		this.objects[i].init();
	}
};

ObjectBase.prototype.beforeDraw = function () {
	this.frame_count++;

	// check flags that disappears in frame elapsed
	this._checkAutoDisableFlags();

	for (var i = 0, len = this.objects.length; i < len; i++) {
		this.objects[i].beforeDraw();
	}

	// move if this object is set velocity
	this._move();
};

ObjectBase.prototype.draw = function () {
	// If is in DEBUG mode, show collision area
	if (this.core.debug_manager.isShowingCollisionArea()) {
		this._drawCollisionArea("white");
	}

	for (var i = 0, len = this.objects.length; i < len; i++) {
		this.objects[i].draw();
	}
};

ObjectBase.prototype.afterDraw = function () {
	for (var i = 0, len = this.objects.length; i < len; i++) {
		this.objects[i].afterDraw();
	}
};

ObjectBase.prototype.width = function () {
	return 0;
};
ObjectBase.prototype.height = function () {
	return 0;
};

ObjectBase.prototype.setPosition = function (x, y) {
	this._x = x;
	this._y = y;
};

ObjectBase.prototype.root = function () {
	if (this.parent) {
		return this.parent.root();
	} else {
		return this;
	}
};

/*
*******************************
* position methods
*******************************
*/

ObjectBase.prototype.globalCenterX = function () {
	return this.scene.x() + this.x();
};

ObjectBase.prototype.globalCenterY = function () {
	return this.scene.y() + this.y();
};

ObjectBase.prototype.globalLeftX = function () {
	return this.scene.x() + this.x() - this.width() / 2;
};

ObjectBase.prototype.globalRightX = function () {
	return this.scene.x() + this.x() + this.width() / 2;
};

ObjectBase.prototype.globalUpY = function () {
	return this.scene.y() + this.y() - this.height() / 2;
};

ObjectBase.prototype.globalDownY = function () {
	return this.scene.y() + this.y() + this.height() / 2;
};

/*
*******************************
* sub object methods
*******************************
*/

// add sub object
ObjectBase.prototype.addSubObject = function (object) {
	object.setParent(this);
	this.objects.push(object);
};

// add sub object list
ObjectBase.prototype.addSubObjects = function (object_list) {
	// set parent
	for (var i = 0, len = object_list.length; i < len; i++) {
		var object = object_list[i];
		object.setParent(this);
	}

	this.objects = this.objects.concat(object_list);
};

ObjectBase.prototype.removeSubObject = function (object) {
	// TODO: O(n) -> O(1)
	for (var i = 0, len = this.objects.length; i < len; i++) {
		if (this.objects[i].id === object.id) {
			this.objects[i].resetParent();
			this.objects.splice(i, 1);
			break;
		}
	}
};

ObjectBase.prototype.removeAllSubObject = function () {
	for (var i = 0, len = this.objects.length; i < len; i++) {
		this.objects[i].resetParent();
	}

	this.objects = [];
};

// set parent object if this is sub object
ObjectBase.prototype.setParent = function (parent_object) {
	if (this.parent) throw new Error("already set parent");
	this.parent = parent_object;
};

ObjectBase.prototype.resetParent = function () {
	this.parent = null;
};

/*
*******************************
* collision methods
*******************************
*/

// collision width
// NOTE: the obj of arguments is collision target object
ObjectBase.prototype.collisionWidth = function (obj) {
	return 0;
};

// collision height
// NOTE: the obj of arguments is collision target object
ObjectBase.prototype.collisionHeight = function (obj) {
	return 0;
};

// callback if the object is collision with
// NOTE: the obj of arguments is collision target object
ObjectBase.prototype.onCollision = function (obj) {};

// flag if the object is check collision with
// NOTE: the obj of arguments is collision target object
ObjectBase.prototype.isCollision = function (obj) {
	return true;
};

// check Collision Detect with object and execute onCollision method if detect
ObjectBase.prototype.checkCollisionWithObject = function (obj1) {
	var obj2 = this;
	var is_collision = obj1.intersect(obj2);

	if (is_collision) {
		obj1.onCollision(obj2);
		obj2.onCollision(obj1);
	}

	return is_collision;
};

// check Collision Detect with object array and execute onCollision method if detect
ObjectBase.prototype.checkCollisionWithObjects = function (objs) {
	var obj1 = this;
	var return_flag = false;
	for (var i = 0; i < objs.length; i++) {
		var obj2 = objs[i];
		if (obj1.checkCollisionByObject(obj2)) {
			obj1.onCollision(obj2);
			obj2.onCollision(obj1);
			return_flag = true;
		}
	}

	return return_flag;
};

// check Collision Detect with (x, y) and execute onCollision method if detect
ObjectBase.prototype.checkCollisionWithPosition = function (x, y) {
	var point = new ObjectPoint(this.scene);
	point.init();
	point.setPosition(x, y);

	return this.checkCollisionWithObject(point);
};

// is the object collides with obj of argument ?
ObjectBase.prototype.intersect = function (obj) {
	if (!this.isCollision(obj) || !obj.isCollision(this)) return false;

	if (Math.abs(this.collisionX() - obj.collisionX()) < this.collisionWidth(obj) / 2 + obj.collisionWidth(this) / 2 && Math.abs(this.collisionY() - obj.collisionY()) < this.collisionHeight(obj) / 2 + obj.collisionHeight(this) / 2) {
		return true;
	}

	return false;
};

ObjectBase.prototype.collisionX = function () {
	return this.x();
};
ObjectBase.prototype.collisionY = function () {
	return this.y();
};

ObjectBase.prototype.getCollisionLeftX = function (obj) {
	return this.collisionX() - this.collisionWidth(obj) / 2;
};

ObjectBase.prototype.getCollisionRightX = function (obj) {
	return this.collisionX() + this.collisionWidth(obj) / 2;
};

ObjectBase.prototype.getCollisionUpY = function (obj) {
	return this.collisionY() - this.collisionHeight(obj) / 2;
};

ObjectBase.prototype.getCollisionDownY = function (obj) {
	return this.collisionY() + this.collisionHeight(obj) / 2;
};

ObjectBase.prototype._drawCollisionArea = function (color) {
	// make dummy object to decide collision width and height
	var dummy_object = new ObjectBase(this.scene);

	// check whether does collide with
	if (!this.isCollision(dummy_object)) return;

	color = color || 'rgb( 255, 255, 255 )';
	var ctx = this.core.ctx;
	ctx.save();
	ctx.fillStyle = color;
	ctx.globalAlpha = 0.4;
	ctx.fillRect(this.getCollisionLeftX(dummy_object), this.getCollisionUpY(dummy_object), this.collisionWidth(dummy_object), this.collisionHeight(dummy_object));
	ctx.restore();
};

// NOTE: deprecated
ObjectBase.prototype.checkCollision = function (obj) {
	return this.checkCollisionByObject(obj);
};

// NOTE: deprecated
ObjectBase.prototype.checkCollisionByObject = function (obj) {
	return this.intersect(obj);
};
/*
*******************************
* disable flag methods
*******************************
*/

// set flags that disappears in frame elapsed
// TODO: enable to set flag which becomes false -> true
// TODO: reset flag if the object calls init method
ObjectBase.prototype.setAutoDisableFlag = function (flag_name, count) {
	var self = this;

	self[flag_name] = true;

	self._auto_disable_times_map[flag_name] = self.frame_count + count;
};

// check flags that disappears in frame elapsed
ObjectBase.prototype._checkAutoDisableFlags = function () {
	var self = this;
	for (var flag_name in self._auto_disable_times_map) {
		if (this._auto_disable_times_map[flag_name] < self.frame_count) {
			self[flag_name] = false;
			delete self._auto_disable_times_map[flag_name];
		}
	}
};

/*
*******************************
* velocity methods
*******************************
*/

ObjectBase.prototype.setVelocity = function (velocity) {
	this._velocity = velocity;
};

ObjectBase.prototype.resetVelocity = function () {
	this._velocity = { magnitude: 0, theta: 0 };
};

ObjectBase.prototype.setVelocityMagnitude = function (magnitude) {
	this._velocity.magnitude = magnitude;
};

ObjectBase.prototype.setVelocityTheta = function (theta) {
	this._velocity.theta = theta;
};

// move if this object is set velocity
// TODO: doesn't move if the object's velocity magnitude is 0
ObjectBase.prototype._move = function () {
	var x = Util.calcMoveXByVelocity(this._velocity);
	var y = Util.calcMoveYByVelocity(this._velocity);

	// save previous (x,y)
	this._previous_x = this._x;
	this._previous_y = this._y;

	this._x += x;
	this._y += y;
};

ObjectBase.prototype.moveBack = function () {
	if (this._previous_x === null && this._previous_y) return;

	var current_x = this._x;
	var current_y = this._y;

	this._x = this._previous_x;
	this._y = this._previous_y;

	this._previous_x = current_x;
	this._previous_y = current_y;
};

/*
*******************************
* other methods
*******************************
*/

// TODO: this.core -> this.scene
ObjectBase.prototype.isOutOfStage = function () {
	if (this.x() + EXTRA_OUT_OF_SIZE < 0 || this.y() + EXTRA_OUT_OF_SIZE < 0 || this.x() > this.core.width + EXTRA_OUT_OF_SIZE || this.y() > this.core.height + EXTRA_OUT_OF_SIZE) {
		return true;
	}

	return false;
};

/*
*******************************
* point object class
*******************************
*/

var ObjectPoint = function ObjectPoint(scene) {
	ObjectBase.apply(this, arguments);
};
Util.inherit(ObjectPoint, ObjectBase);

ObjectPoint.prototype.collisionWidth = function () {
	return 1;
};
ObjectPoint.prototype.collisionHeight = function () {
	return 1;
};
ObjectPoint.prototype.width = function () {
	return 1;
};
ObjectPoint.prototype.height = function () {
	return 1;
};

module.exports = {
	object_base: ObjectBase,
	object_point: ObjectPoint
};

},{"../util":56}],35:[function(require,module,exports){
'use strict';

var _base_and_point_classes = require('./_base_and_point_classes');

module.exports = _base_and_point_classes.object_base;

},{"./_base_and_point_classes":34}],36:[function(require,module,exports){
'use strict';

var _base_and_point_classes = require('./_base_and_point_classes');

module.exports = _base_and_point_classes.object_point;

},{"./_base_and_point_classes":34}],37:[function(require,module,exports){
'use strict';
// TODO: rename manager -> container
// TODO: add pooling logic
// TODO: split object container class and pool object container class

var base_object = require('./base');
var util = require('../util');

var PoolManager = function PoolManager(scene, Class) {
	base_object.apply(this, arguments);

	this.Class = Class;
	this.objects = {};
};
util.inherit(PoolManager, base_object);

PoolManager.prototype.init = function () {
	base_object.prototype.init.apply(this, arguments);

	this.objects = {};
};

PoolManager.prototype.beforeDraw = function () {
	base_object.prototype.beforeDraw.apply(this, arguments);

	for (var id in this.objects) {
		this.objects[id].beforeDraw();
	}
};

PoolManager.prototype.draw = function () {
	base_object.prototype.draw.apply(this, arguments);
	for (var id in this.objects) {
		this.objects[id].draw();
	}
};

PoolManager.prototype.afterDraw = function () {
	base_object.prototype.afterDraw.apply(this, arguments);
	for (var id in this.objects) {
		this.objects[id].afterDraw();
	}
};

PoolManager.prototype.create = function () {
	var object = new this.Class(this.scene);
	object.init.apply(object, arguments);

	this.objects[object.id] = object;

	return object;
};
PoolManager.prototype.remove = function (id) {
	delete this.objects[id];
};

PoolManager.prototype.checkCollisionWithObject = function (obj1) {
	for (var id in this.objects) {
		var obj2 = this.objects[id];
		if (obj1.checkCollision(obj2)) {
			obj1.onCollision(obj2);
			obj2.onCollision(obj1);
		}
	}
};

PoolManager.prototype.checkCollisionWithManager = function (manager) {
	for (var obj1_id in this.objects) {
		for (var obj2_id in manager.objects) {
			if (this.objects[obj1_id].checkCollision(manager.objects[obj2_id])) {
				var obj1 = this.objects[obj1_id];
				var obj2 = manager.objects[obj2_id];

				obj1.onCollision(obj2);
				obj2.onCollision(obj1);

				// do not check died object twice
				if (!this.objects[obj1_id]) {
					break;
				}
			}
		}
	}
};

PoolManager.prototype.removeOutOfStageObjects = function () {
	for (var id in this.objects) {
		if (this.objects[id].isOutOfStage()) {
			this.remove(id);
		}
	}
};

module.exports = PoolManager;

},{"../util":56,"./base":35}],38:[function(require,module,exports){
'use strict';

// TODO: rename manager -> container
// TODO: add pooling logic
// TODO: split object container class and pool object container class

var base_object = require('./base');
var util = require('../util');
var glmat = require('gl-matrix');

var CONSTANT_3D = require('../constant/webgl').SPRITE3D;

var PoolManager3D = function PoolManager3D(scene, Class) {
	base_object.apply(this, arguments);

	this.Class = Class;
	this.objects = {};

	this.vertices = [];
	this.coordinates = [];
	this.indices = [];
	this.colors = [];

	var gl = this.core.gl;
	this.vBuffer = gl.createBuffer();
	this.cBuffer = gl.createBuffer();
	this.iBuffer = gl.createBuffer();
	this.aBuffer = gl.createBuffer();

	this.mvMatrix = glmat.mat4.create();
	this.pMatrix = glmat.mat4.create();
};
util.inherit(PoolManager3D, base_object);

PoolManager3D.prototype.init = function () {
	base_object.prototype.init.apply(this, arguments);

	this.objects = {};

	this._initmvpMatrix();
};
PoolManager3D.prototype._initmvpMatrix = function () {
	// The upper left corner is the canvas origin
	// so reduce canvas width and add canvas height
	glmat.mat4.identity(this.mvMatrix);
	glmat.mat4.translate(this.mvMatrix, this.mvMatrix, [-this.core.width / 2, this.core.height / 2, 0]);

	this._setOrthographicProjection();
};
PoolManager3D.prototype._setOrthographicProjection = function () {
	glmat.mat4.identity(this.pMatrix);
	var near = 0.1;
	var far = 10.0;
	glmat.mat4.ortho(this.pMatrix, -this.core.width / 2, this.core.width / 2, -this.core.height / 2, this.core.height / 2, near, far);
};

PoolManager3D.prototype.beforeDraw = function () {
	base_object.prototype.beforeDraw.apply(this, arguments);

	for (var id in this.objects) {
		this.objects[id].beforeDraw();
	}

	// update: vertices, indices, texture coordinates, colors
	this._updateAttributes();
};

// update: vertices, indices, texture coordinates, colors
PoolManager3D.prototype._updateAttributes = function () {
	this._resetAttributes();

	var i = 0;
	for (var id in this.objects) {
		var object = this.objects[id];

		if (!object.isShow()) {
			continue;
		}

		var j;
		for (j = 0; j < CONSTANT_3D.V_SIZE; j++) {
			this.vertices[i * CONSTANT_3D.V_SIZE + j] = object.vertices[j];
		}

		for (j = 0; j < CONSTANT_3D.C_SIZE; j++) {
			this.coordinates[i * CONSTANT_3D.C_SIZE + j] = object.coordinates[j];
		}

		for (j = 0; j < CONSTANT_3D.I_SIZE; j++) {
			this.indices[i * CONSTANT_3D.I_SIZE + j] = i * CONSTANT_3D.V_ITEM_NUM + object.indices[j];
		}

		for (j = 0; j < CONSTANT_3D.A_SIZE; j++) {
			this.colors[i * CONSTANT_3D.A_SIZE + j] = object.colors[j];
		}

		i++;
	}
};

PoolManager3D.prototype._resetAttributes = function () {
	this.vertices.length = 0;
	this.coordinates.length = 0;
	this.indices.length = 0;
	this.colors.length = 0;
};

PoolManager3D.prototype.draw = function () {
	base_object.prototype.draw.apply(this, arguments);

	// There is no objects.
	if (this.vertices.length === 0) return;

	var gl = this.core.gl;
	var shader = this.shader();

	gl.useProgram(shader.shader_program);
	gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
	gl.enable(gl.BLEND);
	gl.disable(gl.DEPTH_TEST);

	this._setupAttribute("aVertexPosition", this.vBuffer, new Float32Array(this.vertices), CONSTANT_3D.V_ITEM_SIZE);
	this._setupAttribute("aTextureCoordinates", this.cBuffer, new Float32Array(this.coordinates), CONSTANT_3D.C_ITEM_SIZE);
	this._setupAttribute("aColor", this.aBuffer, new Float32Array(this.colors), CONSTANT_3D.A_ITEM_SIZE);

	// TODO: use some types of texture
	for (var id in this.objects) {
		var texture = this.objects[id].texture;
		this._setupTexture("uSampler", 0, texture);
		break;
	}

	gl.uniformMatrix4fv(shader.uniform_locations.uPMatrix, false, this.pMatrix);
	gl.uniformMatrix4fv(shader.uniform_locations.uMVMatrix, false, this.mvMatrix);

	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.iBuffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), gl.STATIC_DRAW);

	// TODO: how to implement?
	//this.setupAdditionalVariables();

	gl.drawElements(gl.TRIANGLES, this.indices.length, gl.UNSIGNED_SHORT, 0);

	/*
  * TODO:
  * reflect
  * scaling
 */
};

PoolManager3D.prototype._setupAttribute = function (attr_name, buffer, data, size) {
	var gl = this.core.gl;
	var shader = this.shader();
	gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
	gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
	gl.enableVertexAttribArray(shader.attribute_locations[attr_name]);
	gl.vertexAttribPointer(shader.attribute_locations[attr_name], size, gl.FLOAT, false, 0, 0);
};
PoolManager3D.prototype._setupTexture = function (uniform_name, unit_no, texture) {
	var gl = this.core.gl;
	var shader = this.shader();
	gl.activeTexture(gl["TEXTURE" + unit_no]);
	gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.uniform1i(shader.uniform_locations[uniform_name], unit_no);
};

PoolManager3D.prototype.afterDraw = function () {
	base_object.prototype.afterDraw.apply(this, arguments);
	for (var id in this.objects) {
		this.objects[id].afterDraw();
	}
};

PoolManager3D.prototype.create = function () {
	var object = new this.Class(this.scene);
	object.init.apply(object, arguments);

	this.objects[object.id] = object;

	return object;
};
PoolManager3D.prototype.remove = function (id) {
	delete this.objects[id];
};

PoolManager3D.prototype.checkCollisionWithObject = function (obj1) {
	for (var id in this.objects) {
		var obj2 = this.objects[id];
		if (obj1.checkCollision(obj2)) {
			obj1.onCollision(obj2);
			obj2.onCollision(obj1);
		}
	}
};

PoolManager3D.prototype.checkCollisionWithManager = function (manager) {
	for (var obj1_id in this.objects) {
		for (var obj2_id in manager.objects) {
			if (this.objects[obj1_id].checkCollision(manager.objects[obj2_id])) {
				var obj1 = this.objects[obj1_id];
				var obj2 = manager.objects[obj2_id];

				obj1.onCollision(obj2);
				obj2.onCollision(obj1);

				// do not check died object twice
				if (!this.objects[obj1_id]) {
					break;
				}
			}
		}
	}
};

PoolManager3D.prototype.removeOutOfStageObjects = function () {
	for (var id in this.objects) {
		if (this.objects[id].isOutOfStage()) {
			this.remove(id);
		}
	}
};

PoolManager3D.prototype.shader = function () {
	return this.core.sprite_3d_shader;
};

module.exports = PoolManager3D;

},{"../constant/webgl":11,"../util":56,"./base":35,"gl-matrix":23}],39:[function(require,module,exports){
'use strict';

var base_object = require('./base');
var util = require('../util');

var Sprite = function Sprite(scene) {
	base_object.apply(this, arguments);

	this.current_sprite_index = 0;
};
util.inherit(Sprite, base_object);

Sprite.prototype.init = function () {
	base_object.prototype.init.apply(this, arguments);

	this.current_sprite_index = 0;
};

Sprite.prototype.beforeDraw = function () {
	base_object.prototype.beforeDraw.apply(this, arguments);

	// animation sprite
	if (this.frame_count % this.spriteAnimationSpan() === 0) {
		this.current_sprite_index++;
		if (this.current_sprite_index >= this.spriteIndices().length) {
			this.current_sprite_index = 0;
		}
	}
};
Sprite.prototype.draw = function () {
	if (this.isShow()) {

		var image = this.core.image_loader.getImage(this.spriteName());

		if (this.scale()) console.error("scale method is deprecated. you should use scaleWidth and scaleHeight.");

		var ctx = this.core.ctx;

		ctx.save();

		// set position
		ctx.translate(this.globalCenterX(), this.globalCenterY());

		// rotate
		var rotate = util.thetaToRadian(this._velocity.theta + this.rotateAdjust());
		ctx.rotate(rotate);

		var sprite_width = this.spriteWidth();
		var sprite_height = this.spriteHeight();
		if (!sprite_width) sprite_width = image.width;
		if (!sprite_height) sprite_height = image.height;

		var width = this.width();
		var height = this.height();

		// reflect left or right
		if (this.isReflect()) {
			ctx.transform(-1, 0, 0, 1, 0, 0);
		}

		ctx.globalAlpha = this.alpha();
		ctx.drawImage(image,
		// sprite position
		sprite_width * this.spriteIndexX(), sprite_height * this.spriteIndexY(),
		// sprite size to get
		sprite_width, sprite_height,
		// adjust left x, up y because of x and y indicate sprite center.
		-width / 2, -height / 2,
		// sprite size to show
		width, height);
		ctx.restore();
	}

	// draw sub objects(even if this object is not show)
	base_object.prototype.draw.apply(this, arguments);
};

Sprite.prototype.spriteName = function () {
	throw new Error("spriteName method must be overridden.");
};
Sprite.prototype.spriteIndexX = function () {
	return this.spriteIndices()[this.current_sprite_index].x;
};
Sprite.prototype.spriteIndexY = function () {
	return this.spriteIndices()[this.current_sprite_index].y;
};
Sprite.prototype.width = function () {
	return this.spriteWidth() * this.scaleWidth();
};
Sprite.prototype.height = function () {
	return this.spriteHeight() * this.scaleHeight();
};

Sprite.prototype.isShow = function () {
	return true;
};

Sprite.prototype.spriteAnimationSpan = function () {
	return 0;
};
Sprite.prototype.spriteIndices = function () {
	return [{ x: 0, y: 0 }];
};
Sprite.prototype.spriteWidth = function () {
	return 0;
};
Sprite.prototype.spriteHeight = function () {
	return 0;
};
Sprite.prototype.rotateAdjust = function () {
	return 0;
};

// scale method is deprecated. you should use scaleWidth and scaleHeight
Sprite.prototype.scale = function () {
	return 0;
};

Sprite.prototype.scaleWidth = function () {
	return 1;
};
Sprite.prototype.scaleHeight = function () {
	return 1;
};
Sprite.prototype.isReflect = function () {
	return false;
};
Sprite.prototype.alpha = function () {
	return 1.0;
};

module.exports = Sprite;

},{"../util":56,"./base":35}],40:[function(require,module,exports){
'use strict';

var base_object = require('./base');
var util = require('../util');
var CONSTANT_3D = require('../constant/webgl').SPRITE3D;
var glmat = require('gl-matrix');

var Sprite3d = function Sprite3d(scene) {
	base_object.apply(this, arguments);

	this.current_sprite_index = 0;

	this._z = 0;

	this.vertices = [];
	this.coordinates = [];
	this.indices = [];
	this.colors = [];

	this.vertices.length = CONSTANT_3D.V_SIZE;
	this.coordinates.length = CONSTANT_3D.C_SIZE;
	this.indices.length = CONSTANT_3D.I_SIZE;
	this.colors.length = CONSTANT_3D.A_SIZE;

	var gl = this.core.gl;
	this.vBuffer = gl.createBuffer();
	this.cBuffer = gl.createBuffer();
	this.iBuffer = gl.createBuffer();
	this.aBuffer = gl.createBuffer();

	this.texture = null;

	this.mvMatrix = glmat.mat4.create();
	this.pMatrix = glmat.mat4.create();
};
util.inherit(Sprite3d, base_object);

Sprite3d.prototype.init = function () {
	base_object.prototype.init.apply(this, arguments);

	this.current_sprite_index = 0;

	this._initmvpMatrix();
	this._initVertices();
	this._initCoordinates();
	this._initIndices();
	this._initColors();

	this._initTexture();
};

Sprite3d.prototype._initmvpMatrix = function () {
	// The upper left corner is the canvas origin
	// so reduce canvas width and add canvas height
	glmat.mat4.identity(this.mvMatrix);
	glmat.mat4.translate(this.mvMatrix, this.mvMatrix, [-this.core.width / 2, this.core.height / 2, 0]);

	this._setOrthographicProjection();
};
Sprite3d.prototype._initVertices = function () {
	var w = this.spriteWidth() / 2;
	var h = this.spriteHeight() / 2;

	this.vertices[0] = -w;
	this.vertices[1] = -h;
	this.vertices[2] = -1.0;

	this.vertices[3] = w;
	this.vertices[4] = -h;
	this.vertices[5] = -1.0;

	this.vertices[6] = w;
	this.vertices[7] = h;
	this.vertices[8] = -1.0;

	this.vertices[9] = -w;
	this.vertices[10] = h;
	this.vertices[11] = -1.0;
};

Sprite3d.prototype._initCoordinates = function () {

	var image = this.core.image_loader.getImage(this.spriteName());

	var w = this.spriteWidth() / image.width;
	var h = this.spriteHeight() / image.height;

	var x1 = w * this.spriteIndexX();
	var y1 = h * this.spriteIndexY();
	var x2 = x1 + w;
	var y2 = y1 + h;

	this.coordinates[0] = x1;
	this.coordinates[1] = y2;

	this.coordinates[2] = x2;
	this.coordinates[3] = y2;

	this.coordinates[4] = x2;
	this.coordinates[5] = y1;

	this.coordinates[6] = x1;
	this.coordinates[7] = y1;
};

Sprite3d.prototype._initIndices = function () {
	this.indices[0] = 0;
	this.indices[1] = 1;
	this.indices[2] = 2;

	this.indices[3] = 0;
	this.indices[4] = 2;
	this.indices[5] = 3;
};

Sprite3d.prototype._initColors = function () {
	this.colors[0] = 1.0;
	this.colors[1] = 1.0;
	this.colors[2] = 1.0;
	this.colors[3] = 1.0;

	this.colors[4] = 1.0;
	this.colors[5] = 1.0;
	this.colors[6] = 1.0;
	this.colors[7] = 1.0;

	this.colors[8] = 1.0;
	this.colors[9] = 1.0;
	this.colors[10] = 1.0;
	this.colors[11] = 1.0;

	this.colors[12] = 1.0;
	this.colors[13] = 1.0;
	this.colors[14] = 1.0;
	this.colors[15] = 1.0;
};

Sprite3d.prototype._initTexture = function () {
	var gl = this.core.gl;
	var image = this.core.image_loader.getImage(this.spriteName());

	var texture = gl.createTexture();

	gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
	gl.bindTexture(gl.TEXTURE_2D, null);

	this.texture = texture;
};
Sprite3d.prototype._setOrthographicProjection = function () {
	glmat.mat4.identity(this.pMatrix);
	var near = 0.1;
	var far = 10.0;
	glmat.mat4.ortho(this.pMatrix, -this.core.width / 2, this.core.width / 2, -this.core.height / 2, this.core.height / 2, near, far);
};

Sprite3d.prototype.beforeDraw = function () {
	base_object.prototype.beforeDraw.apply(this, arguments);
	// animation sprite
	if (this.frame_count % this.spriteAnimationSpan() === 0) {
		this.current_sprite_index++;
		if (this.current_sprite_index >= this.spriteIndices().length) {
			this.current_sprite_index = 0;
		}
	}

	// update vertices property
	this._initVertices();
	this._initCoordinates();
	this._translate();
	// TODO: rotate
	//this._rotate();
};

Sprite3d.prototype._translate = function () {
	for (var i = 0; i < CONSTANT_3D.V_ITEM_NUM; i++) {
		this.vertices[i * CONSTANT_3D.V_ITEM_SIZE + 0] += this.x();
		this.vertices[i * CONSTANT_3D.V_ITEM_SIZE + 1] -= this.y();
		this.vertices[i * CONSTANT_3D.V_ITEM_SIZE + 2] += this.z();
	}
};

Sprite3d.prototype._rotate = function () {
	var radian = this._getRadian();
	for (var i = 0; i < CONSTANT_3D.V_ITEM_NUM; i++) {
		var x = this.vertices[i * CONSTANT_3D.V_ITEM_SIZE + 0];
		var y = this.vertices[i * CONSTANT_3D.V_ITEM_SIZE + 1];

		this.vertices[i * CONSTANT_3D.V_ITEM_SIZE + 0] = x * Math.cos(radian) - y * Math.sin(radian);
		this.vertices[i * CONSTANT_3D.V_ITEM_SIZE + 1] = x * Math.sin(radian) + y * Math.cos(radian);
	}
};

Sprite3d.prototype._getRadian = function () {
	var theta = this.velocity.theta;
	return util.thetaToRadian(theta);
};

Sprite3d.prototype.draw = function () {
	if (this.isShow()) {
		var gl = this.core.gl;

		var shader = this.shader();

		gl.useProgram(shader.shader_program);

		gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
		gl.enable(gl.BLEND);
		gl.disable(gl.DEPTH_TEST);

		this._setupAttribute("aVertexPosition", this.vBuffer, new Float32Array(this.vertices), CONSTANT_3D.V_ITEM_SIZE);
		this._setupAttribute("aTextureCoordinates", this.cBuffer, new Float32Array(this.coordinates), CONSTANT_3D.C_ITEM_SIZE);
		this._setupAttribute("aColor", this.aBuffer, new Float32Array(this.colors), CONSTANT_3D.A_ITEM_SIZE);

		this._setupTexture("uSampler", 0, this.texture);

		gl.uniformMatrix4fv(shader.uniform_locations.uPMatrix, false, this.pMatrix);
		gl.uniformMatrix4fv(shader.uniform_locations.uMVMatrix, false, this.mvMatrix);

		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.iBuffer);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), gl.STATIC_DRAW);

		// inherit class may implement this.
		this.setupAdditionalVariables();

		gl.drawElements(gl.TRIANGLES, this.indices.length, gl.UNSIGNED_SHORT, 0);

		/*
   * TODO:
   * reflect
   * scaling
  */
	}

	// draw sub objects(even if this object is not show)
	base_object.prototype.draw.apply(this, arguments);
};

Sprite3d.prototype._setupAttribute = function (attr_name, buffer, data, size) {
	var gl = this.core.gl;
	var shader = this.shader();
	gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
	gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
	gl.enableVertexAttribArray(shader.attribute_locations[attr_name]);
	gl.vertexAttribPointer(shader.attribute_locations[attr_name], size, gl.FLOAT, false, 0, 0);
};
Sprite3d.prototype._setupTexture = function (uniform_name, unit_no, texture) {
	var gl = this.core.gl;
	var shader = this.shader();
	gl.activeTexture(gl["TEXTURE" + unit_no]);
	gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.uniform1i(shader.uniform_locations[uniform_name], unit_no);
};

Sprite3d.prototype.z = function (val) {
	if (typeof val !== 'undefined') {
		this._z = val;
	}
	return this._z;
};

Sprite3d.prototype.shader = function () {
	return this.core.sprite_3d_shader;
};

// setup additional variables for shader(attributes, uniforms)
Sprite3d.prototype.setupAdditionalVariables = function () {};

Sprite3d.prototype.spriteName = function () {
	throw new Error("spriteName method must be overridden.");
};
Sprite3d.prototype.spriteIndexX = function () {
	return this.spriteIndices()[this.current_sprite_index].x;
};
Sprite3d.prototype.spriteIndexY = function () {
	return this.spriteIndices()[this.current_sprite_index].y;
};
Sprite3d.prototype.width = function () {
	return this.spriteWidth() * this.scaleWidth();
};
Sprite3d.prototype.height = function () {
	return this.spriteHeight() * this.scaleHeight();
};

Sprite3d.prototype.isShow = function () {
	return true;
};

Sprite3d.prototype.spriteAnimationSpan = function () {
	return 0;
};
Sprite3d.prototype.spriteIndices = function () {
	return [{ x: 0, y: 0 }];
};
Sprite3d.prototype.spriteWidth = function () {
	return 0;
};
Sprite3d.prototype.spriteHeight = function () {
	return 0;
};
Sprite3d.prototype.rotateAdjust = function () {
	return 0;
};

Sprite3d.prototype.scaleWidth = function () {
	return 1;
};
Sprite3d.prototype.scaleHeight = function () {
	return 1;
};
Sprite3d.prototype.isReflect = function () {
	return false;
};

module.exports = Sprite3d;

},{"../constant/webgl":11,"../util":56,"./base":35,"gl-matrix":23}],41:[function(require,module,exports){
'use strict';

var BaseObject = require('../base');
var Util = require('../../util');

var ObjectUIBase = function ObjectUIBase(scene, option) {
	BaseObject.apply(this, arguments);

	option = option || {};

	this._default_property = {
		x: option.x || 0,
		y: option.y || 0,
		children: option.children || []
	};

	// event handler
	this._event_to_callback = {
		beforedraw: function beforedraw() {}
	};

	// children
	this.objects = this._default_property.children;

	this._show_call_count = 0;
};
Util.inherit(ObjectUIBase, BaseObject);

ObjectUIBase.prototype.init = function () {
	// reset children
	this.objects = this._default_property.children;

	BaseObject.prototype.init.apply(this, arguments);

	this._show_call_count = 0;

	// postion
	this.x(this._default_property.x);
	this.y(this._default_property.y);

	// default
	this.show();
};

ObjectUIBase.prototype.on = function (event, callback) {
	this._event_to_callback[event] = callback;

	return this;
};
ObjectUIBase.prototype.removeEvent = function (event) {
	this._event_to_callback[event] = function () {};

	return this;
};

ObjectUIBase.prototype._callEvent = function (event) {
	this._event_to_callback[event].apply(this);
};

ObjectUIBase.prototype.isEventSet = function (event) {
	return this._event_to_callback[event] ? true : false;
};

ObjectUIBase.prototype.beforeDraw = function () {
	BaseObject.prototype.beforeDraw.apply(this, arguments);

	this._callEvent("beforedraw");

	if (this.isEventSet("click") && this.core.input_manager.isLeftClickPush()) {
		var x = this.core.input_manager.mousePositionX();
		var y = this.core.input_manager.mousePositionY();

		if (this.checkCollisionWithPosition(x, y)) {
			this._callEvent("click");
		}
	}
};

ObjectUIBase.prototype.draw = function () {
	BaseObject.prototype.draw.apply(this, arguments);
};

ObjectUIBase.prototype.isShow = function () {
	return this._show_call_count > 0;
};

ObjectUIBase.prototype.collisionWidth = function () {
	return this.width();
};

ObjectUIBase.prototype.collisionHeight = function () {
	return this.height();
};

ObjectUIBase.prototype.show = function () {
	++this._show_call_count;
};
ObjectUIBase.prototype.hide = function () {
	--this._show_call_count;
};

module.exports = ObjectUIBase;

},{"../../util":56,"../base":35}],42:[function(require,module,exports){
'use strict';

var BaseObjectUI = require('./base');
var Util = require('../../util');
var ObjectUIGroup = function ObjectUIGroup(scene, option) {
	BaseObjectUI.apply(this, arguments);

	option = option || {};

	this._default_property = Util.assign(this._default_property, {
		width: option.width || 0,
		height: option.height || 0,
		backgroundColor: option.backgroundColor || null
	});
};
Util.inherit(ObjectUIGroup, BaseObjectUI);

Util.defineProperty(ObjectUIGroup, "width");
Util.defineProperty(ObjectUIGroup, "height");
Util.defineProperty(ObjectUIGroup, "backgroundColor");

ObjectUIGroup.prototype.init = function () {
	BaseObjectUI.prototype.init.apply(this, arguments);

	this.width(this._default_property.width);
	this.height(this._default_property.height);
	this.backgroundColor(this._default_property.backgroundColor);
};

ObjectUIGroup.prototype.beforeDraw = function () {
	BaseObjectUI.prototype.beforeDraw.apply(this, arguments);
};

ObjectUIGroup.prototype.draw = function () {
	if (!this.isShow()) return;

	var ctx = this.core.ctx;

	if (this.backgroundColor()) {
		ctx.save();
		ctx.translate(this.x(), this.y());
		ctx.fillStyle = this.backgroundColor();
		ctx.fillRect(-this.width() / 2, -this.height() / 2, this.width(), this.height());
		ctx.restore();
	}
	BaseObjectUI.prototype.draw.apply(this, arguments);
};

module.exports = ObjectUIGroup;

},{"../../util":56,"./base":41}],43:[function(require,module,exports){
'use strict';

var BaseObjectUI = require('./base');
var Util = require('../../util');
var ObjectUIImage = function ObjectUIImage(scene, option) {
	BaseObjectUI.apply(this, arguments);

	option = option || {};

	this._default_property = Util.assign(this._default_property, {
		image_name: option.image_name || null,
		scale: option.scale || 1,
		width: option.width || null,
		height: option.height || null
	});
};
Util.inherit(ObjectUIImage, BaseObjectUI);

Util.defineProperty(ObjectUIImage, "image_name");
Util.defineProperty(ObjectUIImage, "scale");
Util.defineProperty(ObjectUIImage, "width");
Util.defineProperty(ObjectUIImage, "height");

ObjectUIImage.prototype.init = function () {
	BaseObjectUI.prototype.init.apply(this, arguments);

	this.image_name(this._default_property.image_name);
	this.scale(this._default_property.scale);
	this.width(this._default_property.width);
	this.height(this._default_property.height);

	if (!this.width() && !this.height()) {
		var image = this.core.image_loader.getImage(this.image_name());
		this.width(image.width * this.scale());
		this.height(image.height * this.scale());
	}
};

ObjectUIImage.prototype.beforeDraw = function () {
	BaseObjectUI.prototype.beforeDraw.apply(this, arguments);
};

ObjectUIImage.prototype.draw = function () {
	if (!this.isShow()) return;

	var image = this.core.image_loader.getImage(this.image_name());
	var width = image.width * this.scale();
	var height = image.height * this.scale();
	var ctx = this.core.ctx;
	ctx.save();
	ctx.translate(this.x(), this.y());
	ctx.drawImage(image, -width / 2, -height / 2, width, height);
	ctx.restore();
	BaseObjectUI.prototype.draw.apply(this, arguments);
};

module.exports = ObjectUIImage;

},{"../../util":56,"./base":41}],44:[function(require,module,exports){
'use strict';

var LINES = 16;

var BaseObjectUI = require('./base');
var Util = require('../../util');

var ObjectUISpinner = function ObjectUISpinner(scene, option) {
	BaseObjectUI.apply(this, arguments);

	option = option || {};

	this._default_property = Util.assign(this._default_property, {
		size: option.size || "",
		color: option.color || "black"
	});
};
Util.inherit(ObjectUISpinner, BaseObjectUI);

Util.defineProperty(ObjectUISpinner, "size");
Util.defineProperty(ObjectUISpinner, "color");

ObjectUISpinner.prototype.init = function () {
	BaseObjectUI.prototype.init.apply(this, arguments);

	this.size(this._default_property.size);
	this.color(this._default_property.color);

	this._start = new Date();
};

ObjectUISpinner.prototype.beforeDraw = function () {
	BaseObjectUI.prototype.beforeDraw.apply(this, arguments);
};

ObjectUISpinner.prototype.draw = function () {
	if (!this.isShow()) return;

	var ctx = this.core.ctx;

	var rotation = Math.floor(this.frame_count / 60 * LINES) / LINES;
	ctx.save();
	ctx.translate(this.x(), this.y());
	ctx.rotate(Math.PI * 2 * rotation);
	for (var i = 0; i < LINES; i++) {

		ctx.beginPath();
		ctx.rotate(Math.PI * 2 / LINES);
		ctx.moveTo(this.size() / 10, 0);
		ctx.lineTo(this.size() / 4, 0);
		ctx.lineWidth = this.size() / 30;
		ctx.globalAlpha = i / LINES;
		ctx.strokeStyle = this.color();
		ctx.stroke();
	}
	ctx.restore();
	BaseObjectUI.prototype.draw.apply(this, arguments);
};

ObjectUISpinner.prototype.width = function () {
	return this.size() / 2;
};
ObjectUISpinner.prototype.height = function () {
	return this.size() / 2;
};

module.exports = ObjectUISpinner;

},{"../../util":56,"./base":41}],45:[function(require,module,exports){
'use strict';

var BaseObjectUI = require('./base');
var Util = require('../../util');
var ObjectUIText = function ObjectUIText(scene, option) {
	BaseObjectUI.apply(this, arguments);

	option = option || {};

	this._default_property = Util.assign(this._default_property, {
		text: option.text || "",
		textColor: option.textColor || "black",
		textSize: option.textSize || "24px",
		textAlign: option.textAlign || "left"
	});
};
Util.inherit(ObjectUIText, BaseObjectUI);

Util.defineProperty(ObjectUIText, "text");
Util.defineProperty(ObjectUIText, "textColor");
Util.defineProperty(ObjectUIText, "textSize");
Util.defineProperty(ObjectUIText, "textAlign");

ObjectUIText.prototype.init = function () {
	BaseObjectUI.prototype.init.apply(this, arguments);

	this.text(this._default_property.text);
	this.textColor(this._default_property.textColor);
	this.textSize(this._default_property.textSize);
	this.textAlign(this._default_property.textAlign);
};

ObjectUIText.prototype.beforeDraw = function () {
	BaseObjectUI.prototype.beforeDraw.apply(this, arguments);
};

ObjectUIText.prototype.draw = function () {
	if (!this.isShow()) return;

	var ctx = this.core.ctx;

	ctx.save();
	ctx.fillStyle = this.textColor();
	ctx.textAlign = this.textAlign();
	ctx.font = this.textSize() + " 'sans-serif'";
	ctx.fillText(this.text(), this.x(), this.y());
	ctx.restore();
	BaseObjectUI.prototype.draw.apply(this, arguments);
};

module.exports = ObjectUIText;

},{"../../util":56,"./base":41}],46:[function(require,module,exports){
'use strict';
// deprecated. use ui objects

var base_object = require('./base');
var Util = require('../util');

var ObjectUIParts = function ObjectUIParts(scene, x, y, width, height, draw_function) {
	base_object.apply(this, arguments);

	this.x(x);
	this.y(y);

	this._width = width;
	this._height = height;

	this._draw_function = null;
	if (typeof draw_function !== "undefined") {
		this._draw_function = Util.bind(draw_function, this);
	}

	this._is_show_rect = false;

	this._collision_callback = null;
};
Util.inherit(ObjectUIParts, base_object);

ObjectUIParts.prototype.onCollision = function (obj) {
	if (this._collision_callback) {
		this._collision_callback(obj);
	}
};

ObjectUIParts.prototype.collisionWidth = function () {
	return this._width;
};

ObjectUIParts.prototype.collisionHeight = function () {
	return this._height;
};

ObjectUIParts.prototype.setShowRect = function () {
	this._is_show_rect = true;
	return this;
};

ObjectUIParts.prototype.setVariable = function (name, value) {
	this[name] = value;
	return this;
};
ObjectUIParts.prototype.setCollisionCallback = function (func) {
	this._collision_callback = Util.bind(func, this);
};

ObjectUIParts.prototype.draw = function () {
	base_object.prototype.draw.apply(this, arguments);
	var ctx = this.core.ctx;
	ctx.save();
	if (this._draw_function) {
		this._draw_function();
	}
	ctx.restore();

	if (this._is_show_rect) {
		ctx.save();
		ctx.fillStyle = 'rgb( 255, 255, 255 )';
		ctx.globalAlpha = 0.4;
		ctx.fillRect(this.getCollisionLeftX(), this.getCollisionUpY(), this.collisionWidth(), this.collisionHeight());
		ctx.restore();
	}
};

module.exports = ObjectUIParts;

},{"../util":56,"./base":35}],47:[function(require,module,exports){
'use strict';

var ObjectBase = require("../object/base");
var Util = require('../util');

var SceneBase = function SceneBase(core) {
	this.core = core;
	// TODO: parent -> parent() because ajust to root method
	this.parent = null; // parent scene if this is sub scene
	this.width = this.core.width; // default
	this.height = this.core.height; // default

	this._x = 0;
	this._y = 0;

	this.frame_count = 0;

	this.objects = [];

	// sub scenes
	this.current_scene = null;
	this._reserved_next_scene = null; // next scene which changes next frame run
	this._is_reserved_next_scene_init = true; // is scene will inited?

	this.scenes = {};

	// property for wait to start bgm
	this._wait_to_start_bgm_name = null;
	this._wait_to_start_bgm_duration = null;
	this._wait_to_start_bgm_start_frame_count = null;

	// property for background
	this._background_color = null;

	// UI view
	this.ui = new UI(this);
	this.addObject(this.ui); // TODO: draw after all objects drawed
};

SceneBase.prototype.init = function () {
	// sub scenes
	this.current_scene = null;
	this._reserved_next_scene = null; // next scene which changes next frame run
	this._is_reserved_next_scene_init = true; // is scene will inited?

	this._x = 0;
	this._y = 0;

	this.frame_count = 0;

	// property for wait to start bgm
	this._wait_to_start_bgm_name = null;
	this._wait_to_start_bgm_duration = null;
	this._wait_to_start_bgm_start_frame_count = null;

	for (var i = 0, len = this.objects.length; i < len; i++) {
		this.objects[i].init();
	}
};

SceneBase.prototype.beforeDraw = function () {
	// for setWaitToStartBGM method
	if (this._wait_to_start_bgm_name) {
		if (this.frame_count - this._wait_to_start_bgm_start_frame_count >= this._wait_to_start_bgm_duration) {
			this.core.audio_loader.playBGM(this._wait_to_start_bgm_name);

			// reset properties for wait to start bgm
			this._wait_to_start_bgm_name = null;
			this._wait_to_start_bgm_duration = null;
			this._wait_to_start_bgm_start_frame_count = null;
		}
	}

	// go to next sub scene if next scene is set
	this.changeNextSubSceneIfReserved();

	for (var i = 0, len = this.objects.length; i < len; i++) {
		this.objects[i].beforeDraw();
	}

	if (this.currentSubScene()) this.currentSubScene().beforeDraw();

	this.frame_count++;
};

SceneBase.prototype.draw = function () {
	this._drawBackground();

	for (var i = 0, len = this.objects.length; i < len; i++) {
		this.objects[i].draw();
	}
	if (this.currentSubScene()) this.currentSubScene().draw();
};

SceneBase.prototype._drawBackground = function () {
	var ctx = this.core.ctx;

	// background color
	if (this._background_color) {
		ctx.save();
		ctx.fillStyle = this._background_color;
		ctx.fillRect(0, 0, this.width, this.height);
		ctx.restore();
	}
};

SceneBase.prototype.afterDraw = function () {
	for (var i = 0, len = this.objects.length; i < len; i++) {
		this.objects[i].afterDraw();
	}

	if (this.currentSubScene()) this.currentSubScene().afterDraw();
};

SceneBase.prototype.addObject = function (object) {
	this.objects.push(object);
};
SceneBase.prototype.addObjects = function (object_list) {
	this.objects = this.objects.concat(object_list);
};
SceneBase.prototype.removeAllObject = function () {
	this.objects = [];
};
SceneBase.prototype.removeObject = function (object) {
	// TODO: O(n) -> O(1)
	for (var i = 0, len = this.objects.length; i < len; i++) {
		if (this.objects[i].id === object.id) {
			this.objects.splice(i, 1);
			break;
		}
	}
};

// set parent scene if this is sub scene
SceneBase.prototype.setParent = function (parent_scene) {
	if (this.parent) throw new Error("already set parent");
	this.parent = parent_scene;
};

SceneBase.prototype.resetParent = function () {
	this.parent = null;
};

SceneBase.prototype.currentSubScene = function () {
	if (this.current_scene === null) {
		return;
	}

	return this.scenes[this.current_scene];
};
SceneBase.prototype.getSubScene = function (name) {
	return this.scenes[name];
};

SceneBase.prototype.addSubScene = function (name, scene) {
	scene.setParent(this);
	this.scenes[name] = scene;
};
SceneBase.prototype.changeSubScene = function () {
	var args = Array.prototype.slice.call(arguments); // to convert array object
	this._reserved_next_scene = args;
	this._is_reserved_next_scene_init = true; // scene will inited

	// immediately if no sub scene is set
	if (!this.current_scene) {
		this.changeNextSubSceneIfReserved();
	}
};
SceneBase.prototype.returnSubScene = function (scene_name) {
	this._reserved_next_scene = [scene_name];
	this._is_reserved_next_scene_init = false; // scene will NOT inited
};

SceneBase.prototype.changeNextSubSceneIfReserved = function () {
	if (this._reserved_next_scene) {
		this.current_scene = this._reserved_next_scene.shift();
		var current_sub_scene = this.currentSubScene();

		var argument_list = this._reserved_next_scene;
		this._reserved_next_scene = null;

		// if returnSubScene method is called, scene will not be inited.
		if (this._is_reserved_next_scene_init) {
			current_sub_scene.init.apply(current_sub_scene, argument_list);
		}
	}
};

// play bgm after some wait counts
SceneBase.prototype.setWaitToStartBGM = function (bgm_name, wait_count) {
	if (!wait_count) wait_count = 0;
	this._wait_to_start_bgm_name = bgm_name;
	this._wait_to_start_bgm_duration = wait_count;
	this._wait_to_start_bgm_start_frame_count = this.frame_count;
};

SceneBase.prototype.x = function (val) {
	if (typeof val !== 'undefined') {
		this._x = val;
	}
	return this._x;
};
SceneBase.prototype.y = function (val) {
	if (typeof val !== 'undefined') {
		this._y = val;
	}
	return this._y;
};
SceneBase.prototype.root = function () {
	if (this.parent) {
		return this.parent.root();
	} else {
		return this;
	}
};
SceneBase.prototype.setBackgroundColor = function (color) {
	this._background_color = color;
};

SceneBase.prototype.setFadeIn = function (duration, color) {
	console.error("scene's setFadeIn method is deprecated.");
	return this.core.scene_manager.setFadeIn.apply(this.core.scene_manager, arguments);
};
SceneBase.prototype.isInFadeIn = function () {
	console.error("scene's isInFadeIn method is deprecated.");
	return this.core.scene_manager.isInFadeIn.apply(this.core.scene_manager, arguments);
};
SceneBase.prototype.setFadeOut = function (duration, color) {
	console.error("scene's setFadeOut method is deprecated.");
	return this.core.scene_manager.setFadeOut.apply(this.core.scene_manager, arguments);
};
SceneBase.prototype.startFadeOut = function () {
	console.error("scene's startFadeOut method is deprecated.");
	return this.core.scene_manager.startFadeOut.apply(this.core.scene_manager, arguments);
};
SceneBase.prototype.isInFadeOut = function () {
	console.error("scene's isInFadeOut method is deprecated.");
	return this.core.scene_manager.isInFadeOut.apply(this.core.scene_manager, arguments);
};
SceneBase.prototype.isSetFadeOut = function () {
	console.error("scene's isSetFadeOut method is deprecated.");
	return this.core.scene_manager.isSetFadeOut.apply(this.core.scene_manager, arguments);
};

/*
*******************************
* UI view object class
*******************************
*/

var UI = function UI(scene) {
	ObjectBase.apply(this, arguments);
};
Util.inherit(UI, ObjectBase);

module.exports = SceneBase;

},{"../object/base":35,"../util":56}],48:[function(require,module,exports){
'use strict';

// loading scene

var base_scene = require('./base');
var util = require('../util');

var SceneLoading = function SceneLoading(core) {
	base_scene.apply(this, arguments);

	// go if the all assets loading is done.
	this.next_scene_name = null;
};
util.inherit(SceneLoading, base_scene);

SceneLoading.prototype.init = function (assets, next_scene_name) {
	base_scene.prototype.init.apply(this, arguments);

	// assets
	var images = assets.images || [];
	var sounds = assets.sounds || [];
	var bgms = assets.bgms || [];
	var fonts = assets.fonts || [];

	// go if the all assets loading is done.
	this.next_scene_name = next_scene_name;

	for (var key in images) {
		var image_conf = images[key];
		if (typeof image_conf === "string") {
			this.core.image_loader.loadImage(key, image_conf);
		} else {
			this.core.image_loader.loadImage(key, image_conf.path, image_conf.scale_width, image_conf.scale_height);
		}
	}

	for (var key2 in sounds) {
		var conf2 = sounds[key2];
		this.core.audio_loader.loadSound(key2, conf2.path, conf2.volume);
	}

	for (var key3 in bgms) {
		var conf3 = bgms[key3];
		var volume = "volume" in conf3 ? conf3.volume : 1.0;
		this.core.audio_loader.loadBGM(key3, conf3.path, volume, conf3.loopStart, conf3.loopEnd);
	}

	for (var key4 in fonts) {
		var conf4 = fonts[key4];
		this.core.font_loader.loadFont(key4, conf4.path, conf4.format);
	}
};

SceneLoading.prototype.beforeDraw = function () {
	base_scene.prototype.beforeDraw.apply(this, arguments);

	if (this.core.isAllLoaded()) {
		this.notifyAllLoaded();
	}
};

SceneLoading.prototype.progress = function () {
	var progress = (this.core.audio_loader.progress() + this.core.image_loader.progress() + this.core.font_loader.progress()) / 3;
	return progress;
};

SceneLoading.prototype.draw = function () {
	base_scene.prototype.draw.apply(this, arguments);
};
SceneLoading.prototype.notifyAllLoaded = function () {
	if (this.next_scene_name) {
		this.core.scene_manager.changeScene(this.next_scene_name);
	}
};

module.exports = SceneLoading;

},{"../util":56,"./base":47}],49:[function(require,module,exports){
'use strict';

// movie scene

var base_scene = require('./base');
var util = require('../util');

var SceneMovie = function SceneMovie(core) {
	base_scene.apply(this, arguments);

	this.video = null;

	// go if the movie is done.
	this.next_scene_name_and_args = null;

	this.is_playing = false;

	this._height = null;
	this._width = null;
	this._top = null;
	this._left = null;

	this.is_mute = false;
};
util.inherit(SceneMovie, base_scene);

SceneMovie.prototype.init = function (movie_path, next_scene_name, varArgs) {
	base_scene.prototype.init.apply(this, arguments);

	var self = this;

	// parse arguments
	var args = Array.prototype.slice.call(arguments); // to convert array object
	movie_path = args.shift();
	varArgs = args;

	self.is_playing = false;

	self._height = null;
	self._width = null;
	self._top = null;
	self._left = null;

	// go if the movie is done.
	self.next_scene_name_and_args = null;
	if (varArgs.length > 0) {
		self.next_scene_name_and_args = varArgs;
	}

	// stop bgm if it is played.
	this.core.audio_loader.stopBGM();

	var video = document.createElement("video");
	video.src = movie_path;
	video.controls = false;
	video.preload = "auto";
	video.oncanplaythrough = function () {
		self._calcDrawSizeAndPosition();

		video.play();

		self.is_playing = true;
	};

	if (this.is_mute) {
		video.muted = true;
	}

	video.load();

	self.video = video;
};

SceneMovie.prototype.beforeDraw = function () {
	base_scene.prototype.beforeDraw.apply(this, arguments);

	if (this.is_playing && this.video.ended) {
		this.notifyEnd();
	}
};

SceneMovie.prototype.draw = function () {
	base_scene.prototype.draw.apply(this, arguments);

	var ctx = this.core.ctx;

	if (!ctx) return; // 2D context has been depricated in this game

	ctx.save();
	ctx.fillStyle = 'black';
	ctx.fillRect(0, 0, this.core.width, this.core.height);

	if (this.is_playing) {
		ctx.drawImage(this.video, 0, 0, this.video.videoWidth, this.video.videoHeight, this._left, this._top, this._width, this._height);
	}
	ctx.restore();
};

SceneMovie.prototype._calcDrawSizeAndPosition = function () {
	var scene_aspect = this.width / this.height; // canvas aspect
	var video_aspect = this.video.videoWidth / this.video.videoHeight; // video aspect
	var left, top, width, height;

	if (video_aspect >= scene_aspect) {
		// video width is larger than it's height
		width = this.width;
		height = this.width / video_aspect;
		top = (this.height - height) / 2;
		left = 0;
	} else {
		// video height is larger than it's width
		height = this.height;
		width = this.height * video_aspect;
		top = 0;
		left = (this.width - width) / 2;
	}

	this._height = height;
	this._width = width;
	this._top = top;
	this._left = left;
};

SceneMovie.prototype.notifyEnd = function () {
	// release video data memory
	this.video = null;

	this.is_playing = false;

	if (this.next_scene_name_and_args) {
		this.core.scene_manager.changeScene.apply(this.core.scene_manager, this.next_scene_name_and_args);
	}
};

module.exports = SceneMovie;

},{"../util":56,"./base":47}],50:[function(require,module,exports){
"use strict";

module.exports = "attribute vec3 aVertexPosition;\nattribute vec2 aTextureCoordinates;\nattribute vec4 aColor;\n\nuniform mat4 uMVMatrix;\nuniform mat4 uPMatrix;\nvarying vec2 vTextureCoordinates;\nvarying vec4 vColor;\n\nvoid main() {\n\tgl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);\n\tvTextureCoordinates = aTextureCoordinates;\n\tvColor = aColor;\n}\n\n";

},{}],51:[function(require,module,exports){
"use strict";

module.exports = "precision mediump float;\nuniform sampler2D uSampler;\nvarying vec2 vTextureCoordinates;\nvarying vec4 vColor;\n\nvoid main() {\n\tvec4 textureColor = texture2D(uSampler, vTextureCoordinates);\n\tgl_FragColor = textureColor * vColor;\n}\n\n";

},{}],52:[function(require,module,exports){
'use strict';

var glmat = require("gl-matrix");

var ShaderProgram = function ShaderProgram(gl, vs_text, fs_text, attribute_variables, uniform_variables) {
	if (!gl) throw new Error("arguments 1 must be WebGLRenderingContext instance");

	this.gl = gl;

	var vs_shader = this.createShader(gl, gl.VERTEX_SHADER, vs_text);
	var fs_shader = this.createShader(gl, gl.FRAGMENT_SHADER, fs_text);
	var shader_program = this.createShaderProgram(gl, vs_shader, fs_shader);

	var i;
	var attribute_locations = {};
	for (i = 0; i < attribute_variables.length; i++) {
		attribute_locations[attribute_variables[i]] = gl.getAttribLocation(shader_program, attribute_variables[i]);
	}

	var uniform_locations = {};
	for (i = 0; i < uniform_variables.length; i++) {
		uniform_locations[uniform_variables[i]] = gl.getUniformLocation(shader_program, uniform_variables[i]);
	}

	this.shader_program = shader_program;
	this.attribute_locations = attribute_locations;
	this.uniform_locations = uniform_locations;
};

ShaderProgram.prototype.createShader = function (gl, type, source_text) {
	if (type !== gl.VERTEX_SHADER && type !== gl.FRAGMENT_SHADER) {
		throw new Error("type must be vertex or fragment");
	}

	var shader = gl.createShader(type);

	gl.shaderSource(shader, source_text);

	gl.compileShader(shader);

	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		throw (type === gl.VERTEX_SHADER ? "Vertex" : "Fragment") + " failed to compile:\n\n" + gl.getShaderInfoLog(shader);
	}

	return shader;
};

ShaderProgram.prototype.createShaderProgram = function (gl, vertex_shader, fragment_shader) {
	var shaderProgram = gl.createProgram();

	gl.attachShader(shaderProgram, vertex_shader);
	gl.attachShader(shaderProgram, fragment_shader);

	gl.linkProgram(shaderProgram);

	if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
		throw new Error("Could not initialize shaders:\n\n" + gl.getProgramInfoLog(shaderProgram));
	}

	return shaderProgram;
};

module.exports = ShaderProgram;

},{"gl-matrix":23}],53:[function(require,module,exports){
'use strict';
/* eslint-disable new-cap */

/*
 * TODO: split load and save method by sync and async
 * TODO: compress save data
 * TODO: implement: defineColumnProperty method
 */

var Util = require("../util");

var StorageBase = function StorageBase(data) {
	if (!data) data = {};
	this._data = data;
};

// save file unique key
//
// for browser: local storage key name
// for electron or node-webkit: file name
//
// this constant must be overridden!
StorageBase.KEY = function () {
	throw new Error("KEY method must be overridden.");
};

// save file directory for Electron or NW.js
StorageBase.localFileDirectory = function () {
	return "save";
};

StorageBase.prototype.set = function (key, value) {
	this._data[key] = value;
};
StorageBase.prototype.get = function (key) {
	return this._data[key];
};
StorageBase.prototype.exists = function (key) {
	return key in this._data;
};

StorageBase.prototype.remove = function (key) {
	return delete this._data[key];
};
StorageBase.prototype.isEmpty = function () {
	return Object.keys(this._data).length === 0;
};
StorageBase.prototype.toHash = function () {
	return Util.shallowCopyHash(this._data);
};

// is Electron or NW.js ?
StorageBase.isLocalMode = function () {
	// this is Electron
	if (Util.isElectron()) {
		return true;
	}

	// TODO: NW.js
	return false;
};

StorageBase.prototype.save = function () {
	var Klass = this.constructor;
	if (Klass.isLocalMode()) {
		this._saveToLocalFile();
	} else {
		this._saveToWebStorage();
	}
};

StorageBase.prototype._saveToLocalFile = function () {
	var Klass = this.constructor;
	var fs = window.require('fs');

	var data = JSON.stringify(this._data);

	var dir_path = Klass._localFileDirectoryPath();

	var file_path = dir_path + Klass._localFileName(Klass.KEY());

	if (!fs.existsSync(dir_path)) {
		fs.mkdirSync(dir_path);
	}
	fs.writeFileSync(file_path, data);
};

// save file directory
StorageBase._localFileDirectoryPath = function () {
	var path = window.require('path');
	var app = window.require('electron').remote.app;
	var base = app.getPath("appData");
	var app_name = app.getName();
	return path.join(base, app_name, this.localFileDirectory());
};

StorageBase._localFileName = function (key) {
	return key + ".json";
};

StorageBase._localFilePath = function (key) {
	return this._localFileDirectoryPath() + this._localFileName(key);
};

StorageBase.prototype._saveToWebStorage = function () {
	var Klass = this.constructor;

	var key = Klass.KEY();
	var data = JSON.stringify(this._data);
	try {
		window.localStorage.setItem(key, data);
	} catch (e) {
		// nothing to do
	}
};

StorageBase.prototype.reload = function () {
	var Klass = this.constructor;
	var data;
	if (Klass.isLocalMode()) {
		data = Klass._loadFromLocalFile();
	} else {
		data = Klass._loadFromWebStorage();
	}

	this._data = data;
};

StorageBase.load = function () {
	var data;
	if (this.isLocalMode()) {
		data = this._loadFromLocalFile();
	} else {
		data = this._loadFromWebStorage();
	}

	var Klass = this;
	if (data) {
		// there is a storage data
		return new Klass(data);
	} else {
		// there is NOT a storage data
		return new Klass();
	}
};

StorageBase._loadFromLocalFile = function () {
	var fs = window.require('fs');

	var file_path = this._localFilePath(this.KEY());
	if (!fs.existsSync(file_path)) return null;

	var data = fs.readFileSync(file_path, { encoding: 'utf8' });

	if (data) {
		return JSON.parse(data);
	} else {
		return null;
	}
};

StorageBase._loadFromWebStorage = function () {
	var key = this.KEY();
	var data;
	try {
		data = window.localStorage.getItem(key);
	} catch (e) {
		// nothing to do
	}

	if (data) {
		return JSON.parse(data);
	} else {
		return null;
	}
};

StorageBase.prototype.del = function () {
	var Klass = this.constructor;
	if (Klass.isLocalMode()) {
		this._removeLocalFile();
	} else {
		this._removeWebStorage();
	}

	// reset this object properties
	this._data = {};
};

StorageBase.prototype._removeLocalFile = function () {
	var Klass = this.constructor;
	var fs = window.require('fs');
	var file_path = Klass._localFilePath(Klass.KEY());

	if (fs.existsSync(file_path)) {
		fs.unlinkSync(file_path);
	}
};

StorageBase.prototype._removeWebStorage = function () {
	var Klass = this.constructor;
	var key = Klass.KEY();
	try {
		window.localStorage.removeItem(key);
	} catch (e) {
		// nothing to do
	}
};

module.exports = StorageBase;

},{"../util":56}],54:[function(require,module,exports){
'use strict';

var base_class = require('./base');
var util = require('../util');

var StorageSave = function StorageSave(scene) {
	base_class.apply(this, arguments);
};
util.inherit(StorageSave, base_class);

var PREFIX = "hakurei_engine";
var KEY = "save";

StorageSave.KEY = function () {
	if (!this.isLocalMode() && window && window.location) {
		// localstorage key for browser
		return [PREFIX, KEY, window.location.pathname].join(":");
	} else {
		// file name for electron or node-webkit
		return KEY;
	}
};

module.exports = StorageSave;

},{"../util":56,"./base":53}],55:[function(require,module,exports){
'use strict';

var base_class = require('./base');
var util = require('../util');

var StorageScenario = function StorageScenario(scene) {
	base_class.apply(this, arguments);
};
util.inherit(StorageScenario, base_class);

var PREFIX = "hakurei_engine";
var KEY = "scenario";

StorageScenario.KEY = function () {
	if (!this.isLocalMode() && window && window.location) {
		// localstorage key for browser
		return [PREFIX, KEY, window.location.pathname].join(":");
	} else {
		// file name for electron or node-webkit
		return KEY;
	}
};

StorageScenario.prototype.getSerifStatus = function (id) {
	var status = this.get(id);

	if (!status) status = {};

	return status;
};

StorageScenario.prototype.getPlayedCount = function (id) {
	var status = this.getSerifStatus(id);

	return status.played_count || 0;
};

StorageScenario.prototype.incrementPlayedCount = function (id) {
	var status = this.getSerifStatus(id);

	status.played_count = status.played_count || 0;
	status.played_count++;
	this.set(id, status);
};

module.exports = StorageScenario;

},{"../util":56,"./base":53}],56:[function(require,module,exports){
'use strict';

var Util = {
	inherit: function inherit(child, parent) {
		// inherit instance methods
		var getPrototype = function getPrototype(p) {
			if (Object.create) return Object.create(p);

			var F = function F() {};
			F.prototype = p;
			return new F();
		};
		child.prototype = getPrototype(parent.prototype);
		child.prototype.constructor = child;

		// inherit static methods
		for (var func_name in parent) {
			child[func_name] = parent[func_name];
		}
	},
	radianToTheta: function radianToTheta(radian) {
		return radian * 180 / Math.PI | 0;
	},
	thetaToRadian: function thetaToRadian(theta) {
		return theta * Math.PI / 180;
	},
	calcMoveXByVelocity: function calcMoveXByVelocity(velocity) {
		return velocity.magnitude * Math.cos(Util.thetaToRadian(velocity.theta));
	},
	calcMoveYByVelocity: function calcMoveYByVelocity(velocity) {
		return velocity.magnitude * Math.sin(Util.thetaToRadian(velocity.theta));
	},
	hexToRGBString: function hexToRGBString(h) {
		var hex16 = h.charAt(0) === "#" ? h.substring(1, 7) : h;
		var r = parseInt(hex16.substring(0, 2), 16);
		var g = parseInt(hex16.substring(2, 4), 16);
		var b = parseInt(hex16.substring(4, 6), 16);

		return 'rgb(' + r + ', ' + g + ', ' + b + ')';
	},
	clamp: function clamp(num, min, max) {
		return num < min ? min : num > max ? max : num;
	},
	isElectron: function isElectron() {
		if (typeof window !== 'undefined' && window.process && window.process.type === 'renderer') {
			return true;
		}
		return false;
	},
	canPlayOgg: function canPlayOgg() {
		var audio = document.createElement('audio');
		if (audio.canPlayType) {
			return audio.canPlayType('audio/ogg');
		}

		return false;
	},

	getRandomInt: function getRandomInt(min, max) {
		if (arguments.length === 1) {
			max = arguments[0];
			min = 1;
		}

		return Math.floor(Math.random() * (max - min + 1)) + min;
	},
	// save blob object to your computer
	downloadBlob: function downloadBlob(blob, fileName) {
		// create url
		var url = window.URL || window.webkitURL;
		var dataUrl = url.createObjectURL(blob);
		// create mouse event
		var event = document.createEvent("MouseEvents");
		event.initMouseEvent("click", true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
		// create a tag
		var a = document.createElementNS("http://www.w3.org/1999/xhtml", "a");
		a.href = dataUrl;
		a.download = fileName;
		// dispatch mouse click event to a link
		a.dispatchEvent(event);
	},
	shallowCopyHash: function shallowCopyHash(src_hash) {
		var dst_hash = {};
		for (var k in src_hash) {
			dst_hash[k] = src_hash[k];
		}
		return dst_hash;
	},

	// for old browser
	assign: function assign(target, varArgs) {
		// .length of function is 2
		if (!target) {
			// TypeError if undefined or null
			throw new TypeError('Cannot convert undefined or null to object');
		}

		var to = Object(target);

		for (var index = 1; index < arguments.length; index++) {
			var nextSource = arguments[index];

			if (nextSource) {
				// Skip over if undefined or null
				for (var nextKey in nextSource) {
					// Avoid bugs when hasOwnProperty is shadowed
					if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
						to[nextKey] = nextSource[nextKey];
					}
				}
			}
		}
		return to;
	},

	// for old browser
	bind: function bind(func, oThis) {
		if (typeof func !== 'function') {
			// closest thing possible to the ECMAScript 5
			// internal IsCallable function
			throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
		}

		var aArgs = Array.prototype.slice.call(arguments, 1),
		    fToBind = func,
		    FNOP = function FNOP() {},
		    fBound = function fBound() {
			return fToBind.apply(func instanceof FNOP ? func : oThis, aArgs.concat(Array.prototype.slice.call(arguments)));
		};

		if (func.prototype) {
			// Function.prototype doesn't have a prototype property
			FNOP.prototype = func.prototype;
		}
		fBound.prototype = new FNOP();

		return fBound;
	},
	// for old browser
	// NOTE: not perfect polyfill
	defineProperty: function defineProperty(klass, prop_name) {
		var private_prop_name = "_" + prop_name;
		klass.prototype[prop_name] = function (val) {
			if (typeof val !== 'undefined') {
				this[private_prop_name] = val;
			}
			return this[private_prop_name];
		};
	}
};

module.exports = Util;

},{}],57:[function(require,module,exports){
'use strict';

/* 画像を暗く変換する */

// 静的クラス

var CreateDarkerImage = function CreateDarkerImage() {};

CreateDarkerImage.exec = function (image, alpha) {
	if (typeof alpha === "undefined") {
		return image;
	}

	var canvas = document.createElement("canvas");
	canvas.width = image.width;
	canvas.height = image.height;
	var ctx2 = canvas.getContext("2d");

	ctx2.globalAlpha = alpha;
	ctx2.fillStyle = 'rgb( 0, 0, 0 )';
	ctx2.fillRect(0, 0, image.width, image.height);

	ctx2.globalCompositeOperation = "destination-atop";
	ctx2.globalAlpha = 1.0;

	ctx2.drawImage(image, 0, 0, image.width, image.height);

	return canvas;
};

module.exports = CreateDarkerImage;

},{}],58:[function(require,module,exports){
'use strict';

var Util = require('../hakurei').util;
var base_scene = require('../hakurei').scene.base;

var SceneTalk = function SceneTalk(game) {
	base_scene.apply(this, arguments);
};

Util.inherit(SceneTalk, base_scene);

SceneTalk.prototype.init = function () {
	base_scene.prototype.init.apply(this, arguments);
	this.core.scene_manager.setFadeIn(60, "black");
};

SceneTalk.prototype.beforeDraw = function () {
	base_scene.prototype.beforeDraw.apply(this, arguments);
};

// 画面更新
SceneTalk.prototype.draw = function () {
	base_scene.prototype.draw.apply(this, arguments);
	var ctx = this.core.ctx;

	ctx.save();

	ctx.fillStyle = "black";
	ctx.fillRect(0, 0, this.width, this.height);

	ctx.fillStyle = 'white';
	ctx.font = "36px 'Migu'";
	ctx.textAlign = 'center';
	ctx.textBaseAlign = 'middle';

	ctx.fillText("END", this.width / 2, this.height / 2);

	ctx.restore();
};

module.exports = SceneTalk;

},{"../hakurei":6}],59:[function(require,module,exports){
'use strict';

// ローディングシーン

var base_scene = require('../hakurei').scene.loading;
var Util = require('../hakurei').util;
var AssetsConfig = require('../config/assets');

var SceneLoading = function SceneLoading(core) {
	base_scene.apply(this, arguments);
};
Util.inherit(SceneLoading, base_scene);

SceneLoading.prototype.init = function () {
	base_scene.prototype.init.apply(this, [AssetsConfig, "talk"]);
};

SceneLoading.prototype.draw = function () {
	base_scene.prototype.draw.apply(this, arguments);
	var ctx = this.core.ctx;

	// 背景
	ctx.save();
	ctx.fillStyle = 'black';
	ctx.fillRect(0, 0, this.core.width, this.core.height);
	ctx.restore();

	// メッセージ
	var per_frame = this.frame_count % 60;
	var DOT_SPAN = 15;

	var dot = "";
	if (DOT_SPAN > per_frame && per_frame >= 0) {
		dot = "";
	} else if (DOT_SPAN * 2 > per_frame && per_frame >= DOT_SPAN * 1) {
		dot = ".";
	} else if (DOT_SPAN * 3 > per_frame && per_frame >= DOT_SPAN * 2) {
		dot = "..";
	} else {
		dot = "...";
	}

	ctx.save();
	ctx.fillStyle = "white";
	ctx.textAlign = 'left';
	ctx.font = "30px 'OradanoGSRR'";
	ctx.fillText('Now Loading' + dot, this.core.width - 250, this.core.height - 50);
	ctx.restore();

	// プログレスバー
	ctx.save();
	ctx.fillStyle = "white";
	ctx.fillRect(0, this.core.height - 20, this.core.width * this.progress(), 50);
	ctx.restore();
};

module.exports = SceneLoading;

},{"../config/assets":1,"../hakurei":6}],60:[function(require,module,exports){
'use strict';

// 画面に対するウィンドウの余白

var MESSAGE_WINDOW_OUTLINE_MARGIN = 10;

// 喋ってる方のキャラが動く距離
var TALKER_MOVE_PX = 5;

// キャラのサイズ
var SCALE = 0.5;

// 背景 遷移時のトランジション フレーム数
var TRANSITION_COUNT = 100;

// セリフウィンドウの縦の長さ
var MESSAGE_WINDOW_HEIGHT = 100;

// pos_name -> pos number
var LEFT_POS = "left";
var RIGHT_POS = "right";

var Util = require('../hakurei').util;
var base_scene = require('../hakurei').scene.base;

var SerifManager = require('../hakurei').serif_manager;

var CreateDarkerImage = require('../logic/create_darker_image');

var SceneTalk = function SceneTalk(game) {
	base_scene.apply(this, arguments);

	this.serif = new SerifManager();
};

Util.inherit(SceneTalk, base_scene);

SceneTalk.prototype.init = function () {
	base_scene.prototype.init.apply(this, arguments);
	this.serif.init(this.core.serif);
	this.serif.start();

	// 背景遷移時のトランジション
	this.transition_count = 0;

	// シーン遷移前の BGM 止める
	this.core.audio_loader.stopBGM();

	this._afterSerifChanged();
};

SceneTalk.prototype.beforeDraw = function () {
	base_scene.prototype.beforeDraw.apply(this, arguments);

	if (this.isInTransition()) {
		this.transition_count--;

		// トランジションが終わればセリフ送り再開
		if (this.transition_count === 0) {
			this.serif.resumePrintLetter();
		}
	}

	if (this.core.input_manager.isLeftClickPush()) {
		if (this.serif.isEnd()) {
			// 終了
			this.notifySerifEnd();
		} else {
			// トランジション中でなければ
			if (!this.isInTransition()) {
				// セリフを送る
				this.serif.next();

				// 背景変更があった
				if (this.serif.isBackgroundChanged()) {
					// トランジション開始
					this.transition_count = TRANSITION_COUNT;

					// トランジション中はセリフ送り中断
					this.serif.pausePrintLetter();
				}

				this._afterSerifChanged();
			} else {
				// トランジション終了
				this.transition_count = 0;
				// トランジションが終わればセリフ送り再開
				this.serif.resumePrintLetter();
			}
		}
	}
};

// 画面更新
SceneTalk.prototype.draw = function () {
	base_scene.prototype.draw.apply(this, arguments);
	var ctx = this.core.ctx;

	if (this.isInTransition()) {
		ctx.fillStyle = "white";
		ctx.fillRect(0, 0, this.width, this.height);

		// 背景表示
		ctx.globalAlpha = (TRANSITION_COUNT - this.transition_count) / TRANSITION_COUNT;
		this._showBackground();
		ctx.globalAlpha = 1.0;
	} else {
		// 背景表示
		this._showBackground();

		// キャラ表示
		if (this.serif.getCurrentCharaNameByPosition(RIGHT_POS)) {
			this._showRightChara();
		}
		if (this.serif.getCurrentCharaNameByPosition(LEFT_POS)) {
			this._showLeftChara();
		}

		// メッセージウィンドウ表示
		this._showMessageWindow();

		// メッセージ表示
		this._showMessage();
	}
};

// 背景画像表示
SceneTalk.prototype._showBackground = function () {
	var ctx = this.core.ctx;
	var background_name = this.serif.getCurrentBackgroundImageName();

	if (!background_name) return;

	var background = this.core.image_loader.getImage(background_name);

	var bgWidth = background.width;
	var bgHeight = background.height;

	var scene_aspect = this.width / this.height;
	var bg_aspect = bgWidth / bgHeight;
	var left, top, width, height;

	if (bg_aspect >= scene_aspect) {
		width = this.width;
		height = this.width / bg_aspect;
		top = (this.height - height) / 2;
		left = 0;
	} else {
		height = this.height;
		width = this.height * bg_aspect;
		top = 0;
		left = (this.width - width) / 2;
	}

	ctx.drawImage(background, left, top, width, height);
};

SceneTalk.prototype._showRightChara = function () {
	var ctx = this.core.ctx;
	ctx.save();

	var x = 350;
	var y = 65;

	var right_image = this.core.image_loader.getImage(this.serif.getCurrentCharaNameByPosition(RIGHT_POS) + "_" + this.serif.getCurrentCharaExpressionByPosition(RIGHT_POS));
	if (!this.serif.isCurrentTalkingByPosition(RIGHT_POS)) {
		// 喋ってない方のキャラは暗くなる
		right_image = CreateDarkerImage.exec(right_image, 0.5);
	} else {
		x -= TALKER_MOVE_PX;
		y -= TALKER_MOVE_PX;
	}

	ctx.drawImage(right_image, x, y, right_image.width * SCALE, right_image.height * SCALE);

	ctx.restore();
};

SceneTalk.prototype._showLeftChara = function () {
	var ctx = this.core.ctx;
	ctx.save();

	var x = -50;
	var y = 65 + 20;

	var left_image = this.core.image_loader.getImage(this.serif.getCurrentCharaNameByPosition(LEFT_POS) + "_" + this.serif.getCurrentCharaExpressionByPosition(LEFT_POS));
	if (!this.serif.isCurrentTalkingByPosition(LEFT_POS)) {
		// 喋ってない方のキャラは暗くなる
		left_image = CreateDarkerImage.exec(left_image, 0.5);
	} else {
		x += TALKER_MOVE_PX;
		y -= TALKER_MOVE_PX;
	}

	ctx.drawImage(left_image, x, y, left_image.width * SCALE, left_image.height * SCALE);

	ctx.restore();
};

SceneTalk.prototype._showMessageWindow = function () {
	var ctx = this.core.ctx;
	// show message window
	ctx.save();

	ctx.globalAlpha = 0.5;
	ctx.fillStyle = 'rgb( 0, 0, 0 )';
	ctx.fillRect(MESSAGE_WINDOW_OUTLINE_MARGIN, this.height - 125, this.width - MESSAGE_WINDOW_OUTLINE_MARGIN * 2, MESSAGE_WINDOW_HEIGHT);

	ctx.restore();
};

// セリフ表示
SceneTalk.prototype._showMessage = function () {
	var ctx = this.core.ctx;
	ctx.save();

	// セリフの色
	var font_color = this.serif.getCurrentOption().font_color;
	if (font_color) {
		font_color = Util.hexToRGBString(font_color);
	} else {
		font_color = 'rgb(255, 255, 255)';
	}

	ctx.font = "18px 'Migu'";
	ctx.textAlign = 'left';
	ctx.textBaseAlign = 'middle';

	var y;
	// セリフ表示
	var lines = this.serif.getCurrentPrintedSentences();
	if (lines.length) {
		// セリフテキストの y 座標初期位置
		y = this.height - 125 + 40;

		for (var i = 0, len = lines.length; i < len; i++) {
			ctx.fillStyle = 'rgb( 0, 0, 0 )';
			ctx.lineWidth = 4.0;
			ctx.strokeText(lines[i], MESSAGE_WINDOW_OUTLINE_MARGIN * 2 + 20, y); // 1行表示

			ctx.fillStyle = font_color;
			ctx.fillText(lines[i], MESSAGE_WINDOW_OUTLINE_MARGIN * 2 + 20, y); // 1行表示

			y += 30;
		}
	}

	ctx.restore();
};

SceneTalk.prototype._afterSerifChanged = function () {
	while (!this.serif.isEnd() && this.serif.getCurrentMaxLengthLetters() === 0) {
		// BGM 再生
		if (this.serif.getCurrentOption().bgm) {
			this.core.audio_loader.playBGM(this.serif.getCurrentOption().bgm);
		}

		this.serif.next();
	}
};

// 立ち絵＆セリフ終了後
SceneTalk.prototype.notifySerifEnd = function () {
	// フェードアウトする
	this.core.scene_manager.setFadeOut(60);

	this.core.scene_manager.changeScene("end");
};

// 遷移中かどうか
SceneTalk.prototype.isInTransition = function () {
	return this.transition_count ? true : false;
};

module.exports = SceneTalk;

},{"../hakurei":6,"../logic/create_darker_image":57}],61:[function(require,module,exports){
'use strict';

var m = require('mithril');

var New = require('./mithril/component/new.js');
var Edit = require('./mithril/component/edit.js');
var Show = require('./mithril/component/show.js');

m.route.mode = "pathname";

//HTML要素にコンポーネントをマウント
m.route(document.getElementById("root"), "/novel/new", {
	"/novel/new": New,
	"/novel/show/:id": Show,
	"/novel/edit/:id": Edit
});

},{"./mithril/component/edit.js":62,"./mithril/component/new.js":63,"./mithril/component/show.js":64,"mithril":75}],62:[function(require,module,exports){
'use strict';

var Controller = require('../controller/edit');
var View = require('../view/common');

module.exports = {
	controller: Controller,
	view: View
};

},{"../controller/edit":67,"../view/common":73}],63:[function(require,module,exports){
'use strict';

var Controller = require('../controller/new');
var View = require('../view/common');

module.exports = {
	controller: Controller,
	view: View
};

},{"../controller/new":68,"../view/common":73}],64:[function(require,module,exports){
'use strict';

var Controller = require('../controller/show');
var View = require('../view/common');

module.exports = {
	controller: Controller,
	view: View
};

},{"../controller/show":69,"../view/common":73}],65:[function(require,module,exports){
'use strict';

var BackgroundVDom = require('../vdom/background');
var BgmVDom = require('../vdom/bgm');
var SerifVDom = require('../vdom/serif');

module.exports = [{ name: "セリフ", value: "serif", Klass: SerifVDom }, { name: "背景変更", value: "background", Klass: BackgroundVDom }, { name: "BGM変更", value: "bgm", Klass: BgmVDom }];

},{"../vdom/background":70,"../vdom/bgm":71,"../vdom/serif":72}],66:[function(require,module,exports){
'use strict';

var Game = require('../../game/game');
var ViewModel = require('../vm/common');

var Controller = function Controller(args) {
	this.game = null;

	this.vm = new ViewModel();
	this.load();
};
Controller.prototype.reload = function () {
	// ゲームのセリフ更新
	this.game.setSerif(this.vm.toGameData());

	// リロード
	this.game.reload();
};
Controller.prototype.togglePrivate = function () {
	this.vm.togglePrivate();
};

Controller.prototype.runGame = function (element, isInitialized, context) {
	if (!isInitialized) {
		var game = new Game(element);

		game.setupEvents();

		// reset keyboard binding
		window.onkeydown = function (e) {};
		window.onkeyup = function (e) {};

		game.init();

		game.startRun();

		this.game = game;
		// ゲームのセリフ更新
		this.game.setSerif(this.vm.toGameData());
	} else {
		// NOTE: redraw
		// nothing to do
		// TODO: try to reload game
	}
};
Controller.prototype.delete = function (vdom) {
	for (var i = 0, len = this.vm.vdom.length; i < len; i++) {
		if (this.vm.vdom[i] === vdom) {
			this.vm.vdom.splice(i, 1);
			return true;
		}
	}

	return false;
};
Controller.prototype.up = function (vdom) {
	for (var i = 0, len = this.vm.vdom.length; i < len; i++) {
		if (this.vm.vdom[i] === vdom) {
			// 一番上なのでそれ以上 上には移動できない
			if (i === 0) break;

			this.vm.vdom.splice(i - 1, 2, this.vm.vdom[i], this.vm.vdom[i - 1]);
			return true;
		}
	}

	return false;
};
Controller.prototype.down = function (vdom) {
	for (var i = 0, len = this.vm.vdom.length; i < len; i++) {
		if (this.vm.vdom[i] === vdom) {
			// 一番下なのでそれ以上 下には移動できない
			if (i === this.vm.vdom.length - 1) break;

			this.vm.vdom.splice(i, 2, this.vm.vdom[i + 1], this.vm.vdom[i]);
			return true;
		}
	}

	return false;
};
Controller.prototype.addVdom = function () {
	this.vm.addVdomByCurrentSelectedIndex();
};
Controller.prototype.addEmoji = function (type) {
	this.vm.addEmoji(type).then(function () {
		location.reload();
	});
};

Controller.prototype.isShowMode = function () {
	return false;
};
Controller.prototype.isEditMode = function () {
	return false;
};
Controller.prototype.isNewMode = function () {
	return false;
};
Controller.prototype.load = function () {};
Controller.prototype.save = function () {};

module.exports = Controller;

},{"../../game/game":5,"../vm/common":74}],67:[function(require,module,exports){
'use strict';

var m = require('mithril');
var util = require('../../game/hakurei').util;
var BaseClass = require('../controller/base');

var Controller = function Controller(canvas, option) {
	BaseClass.apply(this, arguments);
};
util.inherit(Controller, BaseClass);

Controller.prototype.load = function () {
	var id = m.route.param("id");
	this.vm.loadFromAPI(id);
};

// セーブデータを保存する
Controller.prototype.save = function () {
	if (this.vm.isSaveLocked()) return;

	this.vm.saveLock();

	var self = this;
	this.vm.update().then(function (result) {
		var snackbarContainer = window.document.querySelector('#snackbar');
		var data = {
			message: '保存しました',
			timeout: 1000
		};
		snackbarContainer.MaterialSnackbar.showSnackbar(data);

		setTimeout(function () {
			self.vm.saveUnLock();
		}, 1000);
	});
};
Controller.prototype.isEditMode = function () {
	return true;
};

module.exports = Controller;

},{"../../game/hakurei":6,"../controller/base":66,"mithril":75}],68:[function(require,module,exports){
'use strict';

var util = require('../../game/hakurei').util;
var BaseClass = require('../controller/base');

var Controller = function Controller(canvas, option) {
	BaseClass.apply(this, arguments);
};
util.inherit(Controller, BaseClass);

Controller.prototype.load = function () {
	this.vm.loadFromDefault();
};
// セーブデータを保存する
Controller.prototype.save = function () {
	if (this.vm.isSaveLocked()) return;

	this.vm.saveLock();

	var self = this;
	this.vm.create().then(function (result) {
		var snackbarContainer = window.document.querySelector('#snackbar');
		var data = {
			message: '保存しました',
			timeout: 1000
		};
		snackbarContainer.MaterialSnackbar.showSnackbar(data);

		setTimeout(function () {
			self.vm.saveUnLock();
			location.href = "/novel/show/" + result.id;
		}, 1000);
	});
};

Controller.prototype.isNewMode = function () {
	return true;
};

module.exports = Controller;

},{"../../game/hakurei":6,"../controller/base":66}],69:[function(require,module,exports){
'use strict';

var m = require('mithril');
var util = require('../../game/hakurei').util;
var BaseClass = require('../controller/base');

var Controller = function Controller(canvas, option) {
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

},{"../../game/hakurei":6,"../controller/base":66,"mithril":75}],70:[function(require,module,exports){
'use strict';

var m = require('mithril');
var bg_map = require('../../game/config/bg');
// game 側の assets config からメニュー一覧を生成

var bg_list = [];
for (var key in bg_map) {
	var value = bg_map[key];

	bg_list.push({ name: value.name, value: key });
}

var Background = function Background(args) {
	this.define = m.prop(args.define);
	this.value = m.prop(args.background || bg_list[0].value);
};
Background.prototype.toGameData = function () {
	return {
		define: this.define(),
		serif: "",
		background: this.value()
	};
};

Background.prototype.toComponent = function (ctrl) {
	var self = this;
	return {
		tag: 'div',
		children: [{
			tag: 'select',
			children: [function () {
				var list = [];
				for (var i = 0, len = bg_list.length; i < len; i++) {
					var bg = bg_list[i];

					list.push({
						tag: 'option',
						children: [bg.name],
						attrs: { value: bg.value, selected: bg.value === self.value() }
					});
				}
				return list;
			}()],
			attrs: { className: 'mdl-textfield__input', onchange: m.withAttr("value", function (value) {
					self.value(value);
					ctrl.reload();
				}) }
		}],
		attrs: { className: 'mdl-textfield mdl-js-textfield' }
	};
};

module.exports = Background;

},{"../../game/config/bg":2,"mithril":75}],71:[function(require,module,exports){
'use strict';

var m = require('mithril');

var bgm_map = require('../../game/config/bgm');
// game 側の assets config からメニュー一覧を生成

var bgm_list = [];
for (var key in bgm_map) {
	var value = bgm_map[key];

	bgm_list.push({ name: value.name, value: key });
}

var Bgm = function Bgm(args) {
	var bgm = args.option && args.option.bgm ? args.option.bgm : bgm_list[0].value;
	this.define = m.prop(args.define);
	this.value = m.prop(bgm);
};
Bgm.prototype.toGameData = function () {
	return {
		define: this.define(),
		serif: "",
		option: {
			bgm: this.value()
		}
	};
};

Bgm.prototype.toComponent = function (ctrl) {
	var self = this;
	return {
		tag: 'div',
		children: [{
			tag: 'select',
			children: [function () {
				var list = [];
				for (var i = 0, len = bgm_list.length; i < len; i++) {
					var bgm = bgm_list[i];

					list.push({
						tag: 'option',
						children: [bgm.name],
						attrs: { value: bgm.value, selected: bgm.value === self.value() }
					});
				}
				return list;
			}()],
			attrs: { className: 'mdl-textfield__input', onchange: m.withAttr("value", function (value) {
					self.value(value);
					ctrl.reload();
				}) }
		}],
		attrs: { className: 'mdl-textfield mdl-js-textfield' }
	};
};

module.exports = Bgm;

},{"../../game/config/bgm":3,"mithril":75}],72:[function(require,module,exports){
'use strict';

var m = require('mithril');

var chara_list = [{ name: "蓮子", value: "renko" }, { name: "メリー", value: "merry" }];

var exp_list = [{ name: "普通", value: "normal" }, { name: "笑", value: "smile" }, { name: "泣", value: "cry" }, { name: "怒", value: "angry" }, { name: "驚", value: "surprised" }];

var _id = 0;

var Serif = function Serif(args) {
	this.id = m.prop(++_id);
	this.define = m.prop(args.define);
	this.pos = m.prop(args.pos);
	this.exp = m.prop(args.exp || exp_list[0].value);
	this.chara = m.prop(args.chara || chara_list[0].value);

	if (typeof this.pos() === "undefined") {
		// TODO:
		if (this.chara() === "renko") {
			this.pos("right");
		} else {
			this.pos("left");
		}
	}

	this.value = m.prop(args.serif || "");
};
Serif.prototype.toGameData = function () {
	return {
		define: this.define(),
		pos: this.pos(),
		exp: this.exp(),
		chara: this.chara(),
		serif: this.value()
	};
};

Serif.prototype.toComponent = function (ctrl) {
	var self = this;
	return {
		tag: 'span',
		children: [{
			tag: 'div',
			children: [{
				tag: 'select',
				children: [function () {
					var list = [];
					for (var i = 0, len = chara_list.length; i < len; i++) {
						var chara = chara_list[i];

						list.push({
							tag: 'option',
							children: [chara.name],
							attrs: { value: chara.value, selected: chara.value === self.chara() }
						});
					}
					return list;
				}()],
				attrs: { className: 'mdl-textfield__input', onchange: m.withAttr("value", function (value) {
						self.chara(value);

						// TODO:
						if (value === "renko") {
							self.pos("right");
						} else {
							self.pos("left");
						}
						ctrl.reload();
					}) }
			}],
			attrs: { className: 'mdl-textfield mdl-js-textfield' }
		}, {
			tag: 'br'
		}, {
			tag: 'div',
			children: [{
				tag: 'select',
				children: [function () {
					var list = [];
					for (var i = 0, len = exp_list.length; i < len; i++) {
						var exp = exp_list[i];

						list.push({
							tag: 'option',
							children: [exp.name],
							attrs: { value: exp.value, selected: exp.value === self.exp() }
						});
					}
					return list;
				}()],
				attrs: { className: 'mdl-textfield__input', onchange: m.withAttr("value", function (value) {
						self.exp(value);
						ctrl.reload();
					}) }
			}],
			attrs: { className: 'mdl-textfield mdl-js-textfield' }
		}, {
			tag: 'br'
		}, {
			tag: 'div',
			children: [{
				tag: 'textarea',
				attrs: { className: 'mdl-textfield__input', rows: '3', id: self.id(), value: self.value(), onchange: m.withAttr("value", function (value) {
						self.value(value);
						ctrl.reload();
					}) }
			}, {
				tag: 'label',
				children: ['\u30BB\u30EA\u30D5'],
				attrs: { className: 'mdl-textfield__label', 'for': self.id() }
			}],
			attrs: { className: 'mdl-textfield mdl-js-textfield', style: 'display: block;width:100%;', config: function config(element, isInitialized, context) {
					if (isInitialized) return;
					window.componentHandler.upgradeElement(element);

					context.onunload = function () {
						window.componentHandler.downgradeElements(element);
					};
				} }
		}]
	};
};

module.exports = Serif;

},{"mithril":75}],73:[function(require,module,exports){
'use strict';

var m = require('mithril');
var VdomList = require('../config/vdomlist');

module.exports = function (ctrl, args) {
	var reload = ctrl.reload.bind(ctrl);
	var save = ctrl.save.bind(ctrl);
	var togglePrivate = ctrl.togglePrivate.bind(ctrl);
	var runGame = ctrl.runGame.bind(ctrl);

	return {
		tag: 'div',
		children: [{
			tag: 'div',
			children: [{
				tag: 'div',
				attrs: { className: 'mdl-cell mdl-cell--2-col mdl-cell--hide-tablet mdl-cell--hide-phone' }
			}, {
				tag: 'div',
				children: [{
					tag: 'div',
					children: [{
						tag: 'canvas',
						attrs: { width: '640', height: '480', config: runGame, style: 'width: 100%; max-width: 640px;height: auto;' }
					}, {
						tag: 'div',
						children: [{
							tag: 'hr'
						}, {
							tag: 'input',
							attrs: { type: 'button', value: '\u30EA\u30ED\u30FC\u30C9', onclick: reload, className: 'mdl-button mdl-js-button mdl-button--raised mdl-button--colored' }
						}],
						attrs: { style: { display: ctrl.isNewMode() || ctrl.isEditMode() ? 'block' : 'none' } }
					}, {
						tag: 'div',
						children: [{
							tag: 'hr'
						}, '\u30BF\u30A4\u30C8\u30EB:', ctrl.vm.title(), {
							tag: 'br'
						}, '\u8AAC\u660E:', ctrl.vm.description(), {
							tag: 'br'
						}, '\u6295\u7A3F\u8005:', {
							tag: 'a',
							children: [ctrl.vm.user().dispName()],
							attrs: { href: "/user/show/" + ctrl.vm.user().id() }
						}, {
							tag: 'br'
						}, {
							tag: 'hr'
						}, function () {
							var list = [];
							for (var i = 0, len = ctrl.vm.emojis().length; i < len; i++) {
								var emoji = ctrl.vm.emojis()[i];
								var onsubmit = function (emoji) {
									return function (e) {
										e.preventDefault();
										ctrl.addEmoji(emoji.type());
									};
								}(emoji);

								if (ctrl.vm.isOwner()) {
									list.push({
										tag: 'span',
										children: [{
											tag: 'img',
											attrs: { src: "/image/emoji/" + emoji.fileName(), width: '24', height: '24' }
										}, {
											tag: 'span',
											children: ["　" + emoji.count()],
											attrs: { className: 'mdl-chip__text', style: 'font-size: 18px' }
										}],
										attrs: { className: 'mdl-chip' }
									});
								} else {
									list.push({
										tag: 'button',
										children: [{
											tag: 'img',
											attrs: { src: "/image/emoji/" + emoji.fileName(), width: '24', height: '24' }
										}, {
											tag: 'span',
											children: ["　" + emoji.count()],
											attrs: { className: 'mdl-chip__text', style: 'font-size: 18px' }
										}],
										attrs: { className: 'mdl-chip', style: 'cursor: pointer;', onclick: onsubmit }
									});
								}
							}
							return list;
						}()],
						attrs: { style: { display: ctrl.isShowMode() ? 'block' : 'none' } }
					}],
					attrs: { className: 'mdl-card__supporting-text mdl-color-text--black' }
				}, {
					tag: 'div',
					children: [{
						tag: 'div',
						children: [{
							tag: 'div',
							attrs: { className: 'mdl-layout-spacer' }
						}, {
							tag: 'a',
							children: ['\u7DE8\u96C6\xA0', {
								tag: 'i',
								children: ['build'],
								attrs: { className: 'material-icons' }
							}],
							attrs: { className: 'mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect', href: "/novel/edit/" + ctrl.vm.id() }
						}],
						attrs: { className: 'mdl-card__actions mdl-card--border' }
					}],
					attrs: { style: { display: ctrl.isShowMode() && ctrl.vm.isOwner() ? 'block' : 'none' } }
				}],
				attrs: { className: 'mdl-card mdl-cell mdl-cell--8-col mdl-shadow--2dp' }
			}, {
				tag: 'div',
				attrs: { className: 'mdl-cell mdl-cell--2-col mdl-cell--hide-tablet mdl-cell--hide-phone' }
			}],
			attrs: { className: 'content-grid mdl-grid' }
		}, {
			tag: 'div',
			children: [{
				tag: 'div',
				attrs: { className: 'mdl-cell mdl-cell--2-col mdl-cell--hide-tablet mdl-cell--hide-phone' }
			}, {
				tag: 'div',
				children: [{
					tag: 'div',
					children: [{
						tag: 'h1',
						children: ['\u7DE8\u96C6'],
						attrs: { className: 'mdl-card__title-text' }
					}],
					attrs: { className: 'mdl-card__title' }
				}, {
					tag: 'div',
					children: [{
						tag: 'table',
						children: [{
							tag: 'tbody',
							children: [function () {
								var vdomlist = [];
								for (var i = 0, len = ctrl.vm.vdom.length; i < len; i++) {
									var vdom = ctrl.vm.vdom[i];

									(function (vdom) {
										vdomlist.push({
											tag: 'tr',
											children: [{
												tag: 'td',
												children: [{
													tag: 'button',
													children: [{
														tag: 'i',
														children: ['delete_forever'],
														attrs: { className: 'material-icons' }
													}],
													attrs: { onclick: function onclick() {
															if (ctrl.delete(vdom)) {
																ctrl.reload();
															}
														}, className: 'mdl-button mdl-js-button mdl-button--icon' }
												}, {
													tag: 'button',
													children: [{
														tag: 'i',
														children: ['keyboard_arrow_up'],
														attrs: { className: 'material-icons' }
													}],
													attrs: { onclick: function onclick() {
															if (ctrl.up(vdom)) {
																ctrl.reload();
															}
														}, className: 'mdl-button mdl-js-button mdl-button--icon' }
												}, {
													tag: 'button',
													children: [{
														tag: 'i',
														children: ['keyboard_arrow_down'],
														attrs: { className: 'material-icons' }
													}],
													attrs: { onclick: function onclick() {
															if (ctrl.down(vdom)) {
																ctrl.reload();
															}
														}, className: 'mdl-button mdl-js-button mdl-button--icon' }
												}],
												attrs: { className: 'mdl-data-table__cell--non-numeric' }
											}, {
												tag: 'td',
												children: [vdom.toComponent(ctrl)]
											}]
										});
									})(vdom);
								}
								return vdomlist;
							}()]
						}],
						attrs: { className: 'mdl-data-table mdl-js-data-table mdl-data-table--selectable mdl-shadow--2dp' }
					}, {
						tag: 'div',
						children: ['\u8FFD\u52A0\uFF1A', {
							tag: 'select',
							children: [function () {
								var list = [];
								for (var i = 0, len = VdomList.length; i < len; i++) {
									var vdomconfig = VdomList[i];
									list.push({
										tag: 'option',
										children: [vdomconfig.name],
										attrs: { value: vdomconfig.value, selected: i === ctrl.vm.currentAddVdomSelectedIndex() }
									});
								}
								return list;
							}()],
							attrs: { className: 'mdl-textfield__input', onchange: m.withAttr("selectedIndex", ctrl.vm.currentAddVdomSelectedIndex) }
						}],
						attrs: { className: 'mdl-textfield mdl-js-textfield' }
					}, {
						tag: 'button',
						children: [{
							tag: 'i',
							children: ['add'],
							attrs: { className: 'material-icons' }
						}],
						attrs: { onclick: function onclick() {
								ctrl.addVdom();
								ctrl.reload();
							}, className: 'mdl-button mdl-js-button mdl-button--fab mdl-button--mini-fab mdl-button--colored' }
					}],
					attrs: { className: 'mdl-card__supporting-text mdl-color-text--black' }
				}, {
					tag: 'div',
					children: [{
						tag: 'div',
						children: [{
							tag: 'input',
							attrs: { className: 'mdl-textfield__input', type: 'text', id: 'title', value: ctrl.vm.title(), onchange: m.withAttr("value", ctrl.vm.title) }
						}, {
							tag: 'label',
							children: ['\u30BF\u30A4\u30C8\u30EB'],
							attrs: { className: 'mdl-textfield__label', 'for': 'title' }
						}],
						attrs: { className: 'mdl-textfield mdl-js-textfield mdl-textfield--floating-label' }
					}, {
						tag: 'br'
					}, {
						tag: 'div',
						children: [{
							tag: 'textarea',
							attrs: { className: 'mdl-textfield__input', type: 'text', rows: '3', id: 'description', value: ctrl.vm.description(), onchange: m.withAttr("value", ctrl.vm.description) }
						}, {
							tag: 'label',
							children: ['\u7D39\u4ECB\u6587'],
							attrs: { className: 'mdl-textfield__label', 'for': 'description' }
						}],
						attrs: { className: 'mdl-textfield mdl-js-textfield  mdl-textfield--floating-label' }
					}, {
						tag: 'label',
						children: [{
							tag: 'input',
							attrs: { type: 'checkbox', id: 'switch-1', className: 'mdl-switch__input', onclick: togglePrivate, checked: !ctrl.vm.isPrivate() }
						}, {
							tag: 'span',
							children: [ctrl.vm.isPrivate() ? "非公開" : "公開"],
							attrs: { className: 'mdl-switch__label' }
						}],
						attrs: { className: 'mdl-switch mdl-js-switch mdl-js-ripple-effect', 'for': 'switch-1' }
					}],
					attrs: { className: 'mdl-card__actions mdl-card--border' }
				}, {
					tag: 'div',
					children: [{
						tag: 'div',
						attrs: { className: 'mdl-layout-spacer' }
					}, {
						tag: 'input',
						attrs: { type: 'button', value: '\u30BB\u30FC\u30D6', onclick: save, className: 'mdl-button mdl-js-button mdl-button--raised mdl-button--colored' }
					}],
					attrs: { className: 'mdl-card__actions mdl-card--border' }
				}],
				attrs: { className: 'mdl-card mdl-cell mdl-cell--8-col mdl-shadow--2dp' }
			}, {
				tag: 'div',
				attrs: { className: 'mdl-cell mdl-cell--2-col mdl-cell--hide-tablet mdl-cell--hide-phone' }
			}],
			attrs: { className: 'content-grid mdl-grid', style: { display: ctrl.isEditMode() || ctrl.isNewMode() ? '' : 'none' } }
		}, {
			tag: 'div',
			children: [{
				tag: 'div',
				attrs: { className: 'mdl-snackbar__text' }
			}, {
				tag: 'button',
				attrs: { className: 'mdl-snackbar__action', type: 'button' }
			}],
			attrs: { id: 'snackbar', className: 'mdl-js-snackbar mdl-snackbar', config: function config(element, isInitialized, context) {
					if (isInitialized) return;
					window.componentHandler.upgradeElement(element);

					context.onunload = function () {
						window.componentHandler.downgradeElements(element);
					};
				} }
		}]
	};
};

},{"../config/vdomlist":65,"mithril":75}],74:[function(require,module,exports){
'use strict';

var m = require('mithril');
var VdomList = require('../config/vdomlist');
var DEFAULT_SCRIPT = '[{"define":"background","background":"nc4527"},{"define":"serif","pos":"right","exp":"normal","chara":"renko","serif":"あら奇遇ね\\n"},{"define":"serif","pos":"left","exp":"smile","chara":"merry","serif":"こちらこそ\\n蓮子は授業の帰りかしら"},{"define":"serif","pos":"right","exp":"normal","chara":"renko","serif":"まぁそんなところよ\\n"},{"define":"serif","pos":"right","exp":"smile","chara":"renko","serif":"このあとお茶でもいかがかしら？\\n"},{"define":"serif","pos":"left","exp":"smile","chara":"merry","serif":"あら、ぜひ\\n"}]';

var User = function User(args) {
	args = args || {};
	this.id = m.prop(args.ID);
	this.dispName = m.prop(args.DispName);
	this.fileName = m.prop(args.FileName);
};

var Emoji = function Emoji(args) {
	args = args || {};
	this.fileName = m.prop(args.FileName);
	this.count = m.prop(args.Count);
	this.type = m.prop(args.Type);
};

var ViewModel = function ViewModel(args) {
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
		url: api_url
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
		isPrivate: this.isPrivate() ? 1 : 0
	});
};

ViewModel.prototype.addVdomByCurrentSelectedIndex = function () {
	var vdomconfig = VdomList[this.currentAddVdomSelectedIndex()];
	this.vdom.push(new vdomconfig.Klass({ type: vdomconfig.value }));
};

ViewModel.prototype.create = function () {
	var data = this.toPostData();

	var api_url = "/api/v1/novel/create";

	var _csrf_token = this._csrf_token;

	return m.request({
		method: "POST",
		url: api_url,
		data: data,
		serialize: function serialize(data) {
			return data;
		},
		config: function config(xhr) {
			if (_csrf_token) {
				xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
				xhr.setRequestHeader("X-CSRF-TOKEN", _csrf_token);
			}
		}
	});
};

ViewModel.prototype.update = function () {
	var data = this.toPostData();

	var api_url = "/api/v1/novel/update/" + this.id();

	var _csrf_token = this._csrf_token;

	return m.request({
		method: "POST",
		url: api_url,
		data: data,
		serialize: function serialize(data) {
			return data;
		},
		config: function config(xhr) {
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
		config: function config(xhr) {
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

},{"../config/vdomlist":65,"mithril":75}],75:[function(require,module,exports){
;(function (global, factory) { // eslint-disable-line
	"use strict"
	/* eslint-disable no-undef */
	var m = factory(global)
	if (typeof module === "object" && module != null && module.exports) {
		module.exports = m
	} else if (typeof define === "function" && define.amd) {
		define(function () { return m })
	} else {
		global.m = m
	}
	/* eslint-enable no-undef */
})(typeof window !== "undefined" ? window : this, function (global, undefined) { // eslint-disable-line
	"use strict"

	m.version = function () {
		return "v0.2.5"
	}

	var hasOwn = {}.hasOwnProperty
	var type = {}.toString

	function isFunction(object) {
		return typeof object === "function"
	}

	function isObject(object) {
		return type.call(object) === "[object Object]"
	}

	function isString(object) {
		return type.call(object) === "[object String]"
	}

	var isArray = Array.isArray || function (object) {
		return type.call(object) === "[object Array]"
	}

	function noop() {}

	var voidElements = {
		AREA: 1,
		BASE: 1,
		BR: 1,
		COL: 1,
		COMMAND: 1,
		EMBED: 1,
		HR: 1,
		IMG: 1,
		INPUT: 1,
		KEYGEN: 1,
		LINK: 1,
		META: 1,
		PARAM: 1,
		SOURCE: 1,
		TRACK: 1,
		WBR: 1
	}

	// caching commonly used variables
	var $document, $location, $requestAnimationFrame, $cancelAnimationFrame

	// self invoking function needed because of the way mocks work
	function initialize(mock) {
		$document = mock.document
		$location = mock.location
		$cancelAnimationFrame = mock.cancelAnimationFrame || mock.clearTimeout
		$requestAnimationFrame = mock.requestAnimationFrame || mock.setTimeout
	}

	// testing API
	m.deps = function (mock) {
		initialize(global = mock || window)
		return global
	}

	m.deps(global)

	/**
	 * @typedef {String} Tag
	 * A string that looks like -> div.classname#id[param=one][param2=two]
	 * Which describes a DOM node
	 */

	function parseTagAttrs(cell, tag) {
		var classes = []
		var parser = /(?:(^|#|\.)([^#\.\[\]]+))|(\[.+?\])/g
		var match

		while ((match = parser.exec(tag))) {
			if (match[1] === "" && match[2]) {
				cell.tag = match[2]
			} else if (match[1] === "#") {
				cell.attrs.id = match[2]
			} else if (match[1] === ".") {
				classes.push(match[2])
			} else if (match[3][0] === "[") {
				var pair = /\[(.+?)(?:=("|'|)(.*?)\2)?\]/.exec(match[3])
				cell.attrs[pair[1]] = pair[3] || ""
			}
		}

		return classes
	}

	function getVirtualChildren(args, hasAttrs) {
		var children = hasAttrs ? args.slice(1) : args

		if (children.length === 1 && isArray(children[0])) {
			return children[0]
		} else {
			return children
		}
	}

	function assignAttrs(target, attrs, classes) {
		var classAttr = "class" in attrs ? "class" : "className"

		for (var attrName in attrs) {
			if (hasOwn.call(attrs, attrName)) {
				if (attrName === classAttr &&
						attrs[attrName] != null &&
						attrs[attrName] !== "") {
					classes.push(attrs[attrName])
					// create key in correct iteration order
					target[attrName] = ""
				} else {
					target[attrName] = attrs[attrName]
				}
			}
		}

		if (classes.length) target[classAttr] = classes.join(" ")
	}

	/**
	 *
	 * @param {Tag} The DOM node tag
	 * @param {Object=[]} optional key-value pairs to be mapped to DOM attrs
	 * @param {...mNode=[]} Zero or more Mithril child nodes. Can be an array,
	 *                      or splat (optional)
	 */
	function m(tag, pairs) {
		var args = []

		for (var i = 1, length = arguments.length; i < length; i++) {
			args[i - 1] = arguments[i]
		}

		if (isObject(tag)) return parameterize(tag, args)

		if (!isString(tag)) {
			throw new Error("selector in m(selector, attrs, children) should " +
				"be a string")
		}

		var hasAttrs = pairs != null && isObject(pairs) &&
			!("tag" in pairs || "view" in pairs || "subtree" in pairs)

		var attrs = hasAttrs ? pairs : {}
		var cell = {
			tag: "div",
			attrs: {},
			children: getVirtualChildren(args, hasAttrs)
		}

		assignAttrs(cell.attrs, attrs, parseTagAttrs(cell, tag))
		return cell
	}

	function forEach(list, f) {
		for (var i = 0; i < list.length && !f(list[i], i++);) {
			// function called in condition
		}
	}

	function forKeys(list, f) {
		forEach(list, function (attrs, i) {
			return (attrs = attrs && attrs.attrs) &&
				attrs.key != null &&
				f(attrs, i)
		})
	}
	// This function was causing deopts in Chrome.
	function dataToString(data) {
		// data.toString() might throw or return null if data is the return
		// value of Console.log in some versions of Firefox (behavior depends on
		// version)
		try {
			if (data != null && data.toString() != null) return data
		} catch (e) {
			// silently ignore errors
		}
		return ""
	}

	// This function was causing deopts in Chrome.
	function injectTextNode(parentElement, first, index, data) {
		try {
			insertNode(parentElement, first, index)
			first.nodeValue = data
		} catch (e) {
			// IE erroneously throws error when appending an empty text node
			// after a null
		}
	}

	function flatten(list) {
		// recursively flatten array
		for (var i = 0; i < list.length; i++) {
			if (isArray(list[i])) {
				list = list.concat.apply([], list)
				// check current index again and flatten until there are no more
				// nested arrays at that index
				i--
			}
		}
		return list
	}

	function insertNode(parentElement, node, index) {
		parentElement.insertBefore(node,
			parentElement.childNodes[index] || null)
	}

	var DELETION = 1
	var INSERTION = 2
	var MOVE = 3

	function handleKeysDiffer(data, existing, cached, parentElement) {
		forKeys(data, function (key, i) {
			existing[key = key.key] = existing[key] ? {
				action: MOVE,
				index: i,
				from: existing[key].index,
				element: cached.nodes[existing[key].index] ||
					$document.createElement("div")
			} : {action: INSERTION, index: i}
		})

		var actions = []
		for (var prop in existing) {
			if (hasOwn.call(existing, prop)) {
				actions.push(existing[prop])
			}
		}

		var changes = actions.sort(sortChanges)
		var newCached = new Array(cached.length)

		newCached.nodes = cached.nodes.slice()

		forEach(changes, function (change) {
			var index = change.index
			if (change.action === DELETION) {
				clear(cached[index].nodes, cached[index])
				newCached.splice(index, 1)
			}
			if (change.action === INSERTION) {
				var dummy = $document.createElement("div")
				dummy.key = data[index].attrs.key
				insertNode(parentElement, dummy, index)
				newCached.splice(index, 0, {
					attrs: {key: data[index].attrs.key},
					nodes: [dummy]
				})
				newCached.nodes[index] = dummy
			}

			if (change.action === MOVE) {
				var changeElement = change.element
				var maybeChanged = parentElement.childNodes[index]
				if (maybeChanged !== changeElement && changeElement !== null) {
					parentElement.insertBefore(changeElement,
						maybeChanged || null)
				}
				newCached[index] = cached[change.from]
				newCached.nodes[index] = changeElement
			}
		})

		return newCached
	}

	function diffKeys(data, cached, existing, parentElement) {
		var keysDiffer = data.length !== cached.length

		if (!keysDiffer) {
			forKeys(data, function (attrs, i) {
				var cachedCell = cached[i]
				return keysDiffer = cachedCell &&
					cachedCell.attrs &&
					cachedCell.attrs.key !== attrs.key
			})
		}

		if (keysDiffer) {
			return handleKeysDiffer(data, existing, cached, parentElement)
		} else {
			return cached
		}
	}

	function diffArray(data, cached, nodes) {
		// diff the array itself

		// update the list of DOM nodes by collecting the nodes from each item
		forEach(data, function (_, i) {
			if (cached[i] != null) nodes.push.apply(nodes, cached[i].nodes)
		})
		// remove items from the end of the array if the new array is shorter
		// than the old one. if errors ever happen here, the issue is most
		// likely a bug in the construction of the `cached` data structure
		// somewhere earlier in the program
		forEach(cached.nodes, function (node, i) {
			if (node.parentNode != null && nodes.indexOf(node) < 0) {
				clear([node], [cached[i]])
			}
		})

		if (data.length < cached.length) cached.length = data.length
		cached.nodes = nodes
	}

	function buildArrayKeys(data) {
		var guid = 0
		forKeys(data, function () {
			forEach(data, function (attrs) {
				if ((attrs = attrs && attrs.attrs) && attrs.key == null) {
					attrs.key = "__mithril__" + guid++
				}
			})
			return 1
		})
	}

	function isDifferentEnough(data, cached, dataAttrKeys) {
		if (data.tag !== cached.tag) return true

		if (dataAttrKeys.sort().join() !==
				Object.keys(cached.attrs).sort().join()) {
			return true
		}

		if (data.attrs.id !== cached.attrs.id) {
			return true
		}

		if (data.attrs.key !== cached.attrs.key) {
			return true
		}

		if (m.redraw.strategy() === "all") {
			return !cached.configContext || cached.configContext.retain !== true
		}

		if (m.redraw.strategy() === "diff") {
			return cached.configContext && cached.configContext.retain === false
		}

		return false
	}

	function maybeRecreateObject(data, cached, dataAttrKeys) {
		// if an element is different enough from the one in cache, recreate it
		if (isDifferentEnough(data, cached, dataAttrKeys)) {
			if (cached.nodes.length) clear(cached.nodes)

			if (cached.configContext &&
					isFunction(cached.configContext.onunload)) {
				cached.configContext.onunload()
			}

			if (cached.controllers) {
				forEach(cached.controllers, function (controller) {
					if (controller.onunload) {
						controller.onunload({preventDefault: noop})
					}
				})
			}
		}
	}

	function getObjectNamespace(data, namespace) {
		if (data.attrs.xmlns) return data.attrs.xmlns
		if (data.tag === "svg") return "http://www.w3.org/2000/svg"
		if (data.tag === "math") return "http://www.w3.org/1998/Math/MathML"
		return namespace
	}

	var pendingRequests = 0
	m.startComputation = function () { pendingRequests++ }
	m.endComputation = function () {
		if (pendingRequests > 1) {
			pendingRequests--
		} else {
			pendingRequests = 0
			m.redraw()
		}
	}

	function unloadCachedControllers(cached, views, controllers) {
		if (controllers.length) {
			cached.views = views
			cached.controllers = controllers
			forEach(controllers, function (controller) {
				if (controller.onunload && controller.onunload.$old) {
					controller.onunload = controller.onunload.$old
				}

				if (pendingRequests && controller.onunload) {
					var onunload = controller.onunload
					controller.onunload = noop
					controller.onunload.$old = onunload
				}
			})
		}
	}

	function scheduleConfigsToBeCalled(configs, data, node, isNew, cached) {
		// schedule configs to be called. They are called after `build` finishes
		// running
		if (isFunction(data.attrs.config)) {
			var context = cached.configContext = cached.configContext || {}

			// bind
			configs.push(function () {
				return data.attrs.config.call(data, node, !isNew, context,
					cached)
			})
		}
	}

	function buildUpdatedNode(
		cached,
		data,
		editable,
		hasKeys,
		namespace,
		views,
		configs,
		controllers
	) {
		var node = cached.nodes[0]

		if (hasKeys) {
			setAttributes(node, data.tag, data.attrs, cached.attrs, namespace)
		}

		cached.children = build(
			node,
			data.tag,
			undefined,
			undefined,
			data.children,
			cached.children,
			false,
			0,
			data.attrs.contenteditable ? node : editable,
			namespace,
			configs
		)

		cached.nodes.intact = true

		if (controllers.length) {
			cached.views = views
			cached.controllers = controllers
		}

		return node
	}

	function handleNonexistentNodes(data, parentElement, index) {
		var nodes
		if (data.$trusted) {
			nodes = injectHTML(parentElement, index, data)
		} else {
			nodes = [$document.createTextNode(data)]
			if (!(parentElement.nodeName in voidElements)) {
				insertNode(parentElement, nodes[0], index)
			}
		}

		var cached

		if (typeof data === "string" ||
				typeof data === "number" ||
				typeof data === "boolean") {
			cached = new data.constructor(data)
		} else {
			cached = data
		}

		cached.nodes = nodes
		return cached
	}

	function reattachNodes(
		data,
		cached,
		parentElement,
		editable,
		index,
		parentTag
	) {
		var nodes = cached.nodes
		if (!editable || editable !== $document.activeElement) {
			if (data.$trusted) {
				clear(nodes, cached)
				nodes = injectHTML(parentElement, index, data)
			} else if (parentTag === "textarea") {
				// <textarea> uses `value` instead of `nodeValue`.
				parentElement.value = data
			} else if (editable) {
				// contenteditable nodes use `innerHTML` instead of `nodeValue`.
				editable.innerHTML = data
			} else {
				// was a trusted string
				if (nodes[0].nodeType === 1 || nodes.length > 1 ||
						(nodes[0].nodeValue.trim &&
							!nodes[0].nodeValue.trim())) {
					clear(cached.nodes, cached)
					nodes = [$document.createTextNode(data)]
				}

				injectTextNode(parentElement, nodes[0], index, data)
			}
		}
		cached = new data.constructor(data)
		cached.nodes = nodes
		return cached
	}

	function handleTextNode(
		cached,
		data,
		index,
		parentElement,
		shouldReattach,
		editable,
		parentTag
	) {
		if (!cached.nodes.length) {
			return handleNonexistentNodes(data, parentElement, index)
		} else if (cached.valueOf() !== data.valueOf() || shouldReattach) {
			return reattachNodes(data, cached, parentElement, editable, index,
				parentTag)
		} else {
			return (cached.nodes.intact = true, cached)
		}
	}

	function getSubArrayCount(item) {
		if (item.$trusted) {
			// fix offset of next element if item was a trusted string w/ more
			// than one html element
			// the first clause in the regexp matches elements
			// the second clause (after the pipe) matches text nodes
			var match = item.match(/<[^\/]|\>\s*[^<]/g)
			if (match != null) return match.length
		} else if (isArray(item)) {
			return item.length
		}
		return 1
	}

	function buildArray(
		data,
		cached,
		parentElement,
		index,
		parentTag,
		shouldReattach,
		editable,
		namespace,
		configs
	) {
		data = flatten(data)
		var nodes = []
		var intact = cached.length === data.length
		var subArrayCount = 0

		// keys algorithm: sort elements without recreating them if keys are
		// present
		//
		// 1) create a map of all existing keys, and mark all for deletion
		// 2) add new keys to map and mark them for addition
		// 3) if key exists in new list, change action from deletion to a move
		// 4) for each key, handle its corresponding action as marked in
		//    previous steps

		var existing = {}
		var shouldMaintainIdentities = false

		forKeys(cached, function (attrs, i) {
			shouldMaintainIdentities = true
			existing[cached[i].attrs.key] = {action: DELETION, index: i}
		})

		buildArrayKeys(data)
		if (shouldMaintainIdentities) {
			cached = diffKeys(data, cached, existing, parentElement)
		}
		// end key algorithm

		var cacheCount = 0
		// faster explicitly written
		for (var i = 0, len = data.length; i < len; i++) {
			// diff each item in the array
			var item = build(
				parentElement,
				parentTag,
				cached,
				index,
				data[i],
				cached[cacheCount],
				shouldReattach,
				index + subArrayCount || subArrayCount,
				editable,
				namespace,
				configs)

			if (item !== undefined) {
				intact = intact && item.nodes.intact
				subArrayCount += getSubArrayCount(item)
				cached[cacheCount++] = item
			}
		}

		if (!intact) diffArray(data, cached, nodes)
		return cached
	}

	function makeCache(data, cached, index, parentIndex, parentCache) {
		if (cached != null) {
			if (type.call(cached) === type.call(data)) return cached

			if (parentCache && parentCache.nodes) {
				var offset = index - parentIndex
				var end = offset + (isArray(data) ? data : cached.nodes).length
				clear(
					parentCache.nodes.slice(offset, end),
					parentCache.slice(offset, end))
			} else if (cached.nodes) {
				clear(cached.nodes, cached)
			}
		}

		cached = new data.constructor()
		// if constructor creates a virtual dom element, use a blank object as
		// the base cached node instead of copying the virtual el (#277)
		if (cached.tag) cached = {}
		cached.nodes = []
		return cached
	}

	function constructNode(data, namespace) {
		if (data.attrs.is) {
			if (namespace == null) {
				return $document.createElement(data.tag, data.attrs.is)
			} else {
				return $document.createElementNS(namespace, data.tag,
					data.attrs.is)
			}
		} else if (namespace == null) {
			return $document.createElement(data.tag)
		} else {
			return $document.createElementNS(namespace, data.tag)
		}
	}

	function constructAttrs(data, node, namespace, hasKeys) {
		if (hasKeys) {
			return setAttributes(node, data.tag, data.attrs, {}, namespace)
		} else {
			return data.attrs
		}
	}

	function constructChildren(
		data,
		node,
		cached,
		editable,
		namespace,
		configs
	) {
		if (data.children != null && data.children.length > 0) {
			return build(
				node,
				data.tag,
				undefined,
				undefined,
				data.children,
				cached.children,
				true,
				0,
				data.attrs.contenteditable ? node : editable,
				namespace,
				configs)
		} else {
			return data.children
		}
	}

	function reconstructCached(
		data,
		attrs,
		children,
		node,
		namespace,
		views,
		controllers
	) {
		var cached = {
			tag: data.tag,
			attrs: attrs,
			children: children,
			nodes: [node]
		}

		unloadCachedControllers(cached, views, controllers)

		if (cached.children && !cached.children.nodes) {
			cached.children.nodes = []
		}

		// edge case: setting value on <select> doesn't work before children
		// exist, so set it again after children have been created
		if (data.tag === "select" && "value" in data.attrs) {
			setAttributes(node, data.tag, {value: data.attrs.value}, {},
				namespace)
		}

		return cached
	}

	function getController(views, view, cachedControllers, controller) {
		var controllerIndex

		if (m.redraw.strategy() === "diff" && views) {
			controllerIndex = views.indexOf(view)
		} else {
			controllerIndex = -1
		}

		if (controllerIndex > -1) {
			return cachedControllers[controllerIndex]
		} else if (isFunction(controller)) {
			return new controller()
		} else {
			return {}
		}
	}

	var unloaders = []

	function updateLists(views, controllers, view, controller) {
		if (controller.onunload != null &&
				unloaders.map(function (u) { return u.handler })
					.indexOf(controller.onunload) < 0) {
			unloaders.push({
				controller: controller,
				handler: controller.onunload
			})
		}

		views.push(view)
		controllers.push(controller)
	}

	var forcing = false
	function checkView(
		data,
		view,
		cached,
		cachedControllers,
		controllers,
		views
	) {
		var controller = getController(
			cached.views,
			view,
			cachedControllers,
			data.controller)

		var key = data && data.attrs && data.attrs.key

		if (pendingRequests === 0 ||
				forcing ||
				cachedControllers &&
					cachedControllers.indexOf(controller) > -1) {
			data = data.view(controller)
		} else {
			data = {tag: "placeholder"}
		}

		if (data.subtree === "retain") return data
		data.attrs = data.attrs || {}
		data.attrs.key = key
		updateLists(views, controllers, view, controller)
		return data
	}

	function markViews(data, cached, views, controllers) {
		var cachedControllers = cached && cached.controllers

		while (data.view != null) {
			data = checkView(
				data,
				data.view.$original || data.view,
				cached,
				cachedControllers,
				controllers,
				views)
		}

		return data
	}

	function buildObject( // eslint-disable-line max-statements
		data,
		cached,
		editable,
		parentElement,
		index,
		shouldReattach,
		namespace,
		configs
	) {
		var views = []
		var controllers = []

		data = markViews(data, cached, views, controllers)

		if (data.subtree === "retain") return cached

		if (!data.tag && controllers.length) {
			throw new Error("Component template must return a virtual " +
				"element, not an array, string, etc.")
		}

		data.attrs = data.attrs || {}
		cached.attrs = cached.attrs || {}

		var dataAttrKeys = Object.keys(data.attrs)
		var hasKeys = dataAttrKeys.length > ("key" in data.attrs ? 1 : 0)

		maybeRecreateObject(data, cached, dataAttrKeys)

		if (!isString(data.tag)) return

		var isNew = cached.nodes.length === 0

		namespace = getObjectNamespace(data, namespace)

		var node
		if (isNew) {
			node = constructNode(data, namespace)
			// set attributes first, then create children
			var attrs = constructAttrs(data, node, namespace, hasKeys)

			// add the node to its parent before attaching children to it
			insertNode(parentElement, node, index)

			var children = constructChildren(data, node, cached, editable,
				namespace, configs)

			cached = reconstructCached(
				data,
				attrs,
				children,
				node,
				namespace,
				views,
				controllers)
		} else {
			node = buildUpdatedNode(
				cached,
				data,
				editable,
				hasKeys,
				namespace,
				views,
				configs,
				controllers)
		}

		if (!isNew && shouldReattach === true && node != null) {
			insertNode(parentElement, node, index)
		}

		// The configs are called after `build` finishes running
		scheduleConfigsToBeCalled(configs, data, node, isNew, cached)

		return cached
	}

	function build(
		parentElement,
		parentTag,
		parentCache,
		parentIndex,
		data,
		cached,
		shouldReattach,
		index,
		editable,
		namespace,
		configs
	) {
		/*
		 * `build` is a recursive function that manages creation/diffing/removal
		 * of DOM elements based on comparison between `data` and `cached` the
		 * diff algorithm can be summarized as this:
		 *
		 * 1 - compare `data` and `cached`
		 * 2 - if they are different, copy `data` to `cached` and update the DOM
		 *     based on what the difference is
		 * 3 - recursively apply this algorithm for every array and for the
		 *     children of every virtual element
		 *
		 * The `cached` data structure is essentially the same as the previous
		 * redraw's `data` data structure, with a few additions:
		 * - `cached` always has a property called `nodes`, which is a list of
		 *    DOM elements that correspond to the data represented by the
		 *    respective virtual element
		 * - in order to support attaching `nodes` as a property of `cached`,
		 *    `cached` is *always* a non-primitive object, i.e. if the data was
		 *    a string, then cached is a String instance. If data was `null` or
		 *    `undefined`, cached is `new String("")`
		 * - `cached also has a `configContext` property, which is the state
		 *    storage object exposed by config(element, isInitialized, context)
		 * - when `cached` is an Object, it represents a virtual element; when
		 *    it's an Array, it represents a list of elements; when it's a
		 *    String, Number or Boolean, it represents a text node
		 *
		 * `parentElement` is a DOM element used for W3C DOM API calls
		 * `parentTag` is only used for handling a corner case for textarea
		 * values
		 * `parentCache` is used to remove nodes in some multi-node cases
		 * `parentIndex` and `index` are used to figure out the offset of nodes.
		 * They're artifacts from before arrays started being flattened and are
		 * likely refactorable
		 * `data` and `cached` are, respectively, the new and old nodes being
		 * diffed
		 * `shouldReattach` is a flag indicating whether a parent node was
		 * recreated (if so, and if this node is reused, then this node must
		 * reattach itself to the new parent)
		 * `editable` is a flag that indicates whether an ancestor is
		 * contenteditable
		 * `namespace` indicates the closest HTML namespace as it cascades down
		 * from an ancestor
		 * `configs` is a list of config functions to run after the topmost
		 * `build` call finishes running
		 *
		 * there's logic that relies on the assumption that null and undefined
		 * data are equivalent to empty strings
		 * - this prevents lifecycle surprises from procedural helpers that mix
		 *   implicit and explicit return statements (e.g.
		 *   function foo() {if (cond) return m("div")}
		 * - it simplifies diffing code
		 */
		data = dataToString(data)
		if (data.subtree === "retain") return cached
		cached = makeCache(data, cached, index, parentIndex, parentCache)

		if (isArray(data)) {
			return buildArray(
				data,
				cached,
				parentElement,
				index,
				parentTag,
				shouldReattach,
				editable,
				namespace,
				configs)
		} else if (data != null && isObject(data)) {
			return buildObject(
				data,
				cached,
				editable,
				parentElement,
				index,
				shouldReattach,
				namespace,
				configs)
		} else if (!isFunction(data)) {
			return handleTextNode(
				cached,
				data,
				index,
				parentElement,
				shouldReattach,
				editable,
				parentTag)
		} else {
			return cached
		}
	}

	function sortChanges(a, b) {
		return a.action - b.action || a.index - b.index
	}

	function copyStyleAttrs(node, dataAttr, cachedAttr) {
		for (var rule in dataAttr) {
			if (hasOwn.call(dataAttr, rule)) {
				if (cachedAttr == null || cachedAttr[rule] !== dataAttr[rule]) {
					node.style[rule] = dataAttr[rule]
				}
			}
		}

		for (rule in cachedAttr) {
			if (hasOwn.call(cachedAttr, rule)) {
				if (!hasOwn.call(dataAttr, rule)) node.style[rule] = ""
			}
		}
	}

	var shouldUseSetAttribute = {
		list: 1,
		style: 1,
		form: 1,
		type: 1,
		width: 1,
		height: 1
	}

	function setSingleAttr(
		node,
		attrName,
		dataAttr,
		cachedAttr,
		tag,
		namespace
	) {
		if (attrName === "config" || attrName === "key") {
			// `config` isn't a real attribute, so ignore it
			return true
		} else if (isFunction(dataAttr) && attrName.slice(0, 2) === "on") {
			// hook event handlers to the auto-redrawing system
			node[attrName] = autoredraw(dataAttr, node)
		} else if (attrName === "style" && dataAttr != null &&
				isObject(dataAttr)) {
			// handle `style: {...}`
			copyStyleAttrs(node, dataAttr, cachedAttr)
		} else if (namespace != null) {
			// handle SVG
			if (attrName === "href") {
				node.setAttributeNS("http://www.w3.org/1999/xlink",
					"href", dataAttr)
			} else {
				node.setAttribute(
					attrName === "className" ? "class" : attrName,
					dataAttr)
			}
		} else if (attrName in node && !shouldUseSetAttribute[attrName]) {
			// handle cases that are properties (but ignore cases where we
			// should use setAttribute instead)
			//
			// - list and form are typically used as strings, but are DOM
			//   element references in js
			//
			// - when using CSS selectors (e.g. `m("[style='']")`), style is
			//   used as a string, but it's an object in js
			//
			// #348 don't set the value if not needed - otherwise, cursor
			// placement breaks in Chrome
			try {
				if (tag !== "input" || node[attrName] !== dataAttr) {
					node[attrName] = dataAttr
				}
			} catch (e) {
				node.setAttribute(attrName, dataAttr)
			}
		}
		else node.setAttribute(attrName, dataAttr)
	}

	function trySetAttr(
		node,
		attrName,
		dataAttr,
		cachedAttr,
		cachedAttrs,
		tag,
		namespace
	) {
		if (!(attrName in cachedAttrs) || (cachedAttr !== dataAttr) || ($document.activeElement === node)) {
			cachedAttrs[attrName] = dataAttr
			try {
				return setSingleAttr(
					node,
					attrName,
					dataAttr,
					cachedAttr,
					tag,
					namespace)
			} catch (e) {
				// swallow IE's invalid argument errors to mimic HTML's
				// fallback-to-doing-nothing-on-invalid-attributes behavior
				if (e.message.indexOf("Invalid argument") < 0) throw e
			}
		} else if (attrName === "value" && tag === "input" &&
				node.value !== dataAttr) {
			// #348 dataAttr may not be a string, so use loose comparison
			node.value = dataAttr
		}
	}

	function setAttributes(node, tag, dataAttrs, cachedAttrs, namespace) {
		for (var attrName in dataAttrs) {
			if (hasOwn.call(dataAttrs, attrName)) {
				if (trySetAttr(
						node,
						attrName,
						dataAttrs[attrName],
						cachedAttrs[attrName],
						cachedAttrs,
						tag,
						namespace)) {
					continue
				}
			}
		}
		return cachedAttrs
	}

	function clear(nodes, cached) {
		for (var i = nodes.length - 1; i > -1; i--) {
			if (nodes[i] && nodes[i].parentNode) {
				try {
					nodes[i].parentNode.removeChild(nodes[i])
				} catch (e) {
					/* eslint-disable max-len */
					// ignore if this fails due to order of events (see
					// http://stackoverflow.com/questions/21926083/failed-to-execute-removechild-on-node)
					/* eslint-enable max-len */
				}
				cached = [].concat(cached)
				if (cached[i]) unload(cached[i])
			}
		}
		// release memory if nodes is an array. This check should fail if nodes
		// is a NodeList (see loop above)
		if (nodes.length) {
			nodes.length = 0
		}
	}

	function unload(cached) {
		if (cached.configContext && isFunction(cached.configContext.onunload)) {
			cached.configContext.onunload()
			cached.configContext.onunload = null
		}
		if (cached.controllers) {
			forEach(cached.controllers, function (controller) {
				if (isFunction(controller.onunload)) {
					controller.onunload({preventDefault: noop})
				}
			})
		}
		if (cached.children) {
			if (isArray(cached.children)) forEach(cached.children, unload)
			else if (cached.children.tag) unload(cached.children)
		}
	}

	function appendTextFragment(parentElement, data) {
		try {
			parentElement.appendChild(
				$document.createRange().createContextualFragment(data))
		} catch (e) {
			parentElement.insertAdjacentHTML("beforeend", data)
			replaceScriptNodes(parentElement)
		}
	}

	// Replace script tags inside given DOM element with executable ones.
	// Will also check children recursively and replace any found script
	// tags in same manner.
	function replaceScriptNodes(node) {
		if (node.tagName === "SCRIPT") {
			node.parentNode.replaceChild(buildExecutableNode(node), node)
		} else {
			var children = node.childNodes
			if (children && children.length) {
				for (var i = 0; i < children.length; i++) {
					replaceScriptNodes(children[i])
				}
			}
		}

		return node
	}

	// Replace script element with one whose contents are executable.
	function buildExecutableNode(node){
		var scriptEl = document.createElement("script")
		var attrs = node.attributes

		for (var i = 0; i < attrs.length; i++) {
			scriptEl.setAttribute(attrs[i].name, attrs[i].value)
		}

		scriptEl.text = node.innerHTML
		return scriptEl
	}

	function injectHTML(parentElement, index, data) {
		var nextSibling = parentElement.childNodes[index]
		if (nextSibling) {
			var isElement = nextSibling.nodeType !== 1
			var placeholder = $document.createElement("span")
			if (isElement) {
				parentElement.insertBefore(placeholder, nextSibling || null)
				placeholder.insertAdjacentHTML("beforebegin", data)
				parentElement.removeChild(placeholder)
			} else {
				nextSibling.insertAdjacentHTML("beforebegin", data)
			}
		} else {
			appendTextFragment(parentElement, data)
		}

		var nodes = []

		while (parentElement.childNodes[index] !== nextSibling) {
			nodes.push(parentElement.childNodes[index])
			index++
		}

		return nodes
	}

	function autoredraw(callback, object) {
		return function (e) {
			e = e || event
			m.redraw.strategy("diff")
			m.startComputation()
			try {
				return callback.call(object, e)
			} finally {
				endFirstComputation()
			}
		}
	}

	var html
	var documentNode = {
		appendChild: function (node) {
			if (html === undefined) html = $document.createElement("html")
			if ($document.documentElement &&
					$document.documentElement !== node) {
				$document.replaceChild(node, $document.documentElement)
			} else {
				$document.appendChild(node)
			}

			this.childNodes = $document.childNodes
		},

		insertBefore: function (node) {
			this.appendChild(node)
		},

		childNodes: []
	}

	var nodeCache = []
	var cellCache = {}

	m.render = function (root, cell, forceRecreation) {
		if (!root) {
			throw new Error("Ensure the DOM element being passed to " +
				"m.route/m.mount/m.render is not undefined.")
		}
		var configs = []
		var id = getCellCacheKey(root)
		var isDocumentRoot = root === $document
		var node

		if (isDocumentRoot || root === $document.documentElement) {
			node = documentNode
		} else {
			node = root
		}

		if (isDocumentRoot && cell.tag !== "html") {
			cell = {tag: "html", attrs: {}, children: cell}
		}

		if (cellCache[id] === undefined) clear(node.childNodes)
		if (forceRecreation === true) reset(root)

		cellCache[id] = build(
			node,
			null,
			undefined,
			undefined,
			cell,
			cellCache[id],
			false,
			0,
			null,
			undefined,
			configs)

		forEach(configs, function (config) { config() })
	}

	function getCellCacheKey(element) {
		var index = nodeCache.indexOf(element)
		return index < 0 ? nodeCache.push(element) - 1 : index
	}

	m.trust = function (value) {
		value = new String(value) // eslint-disable-line no-new-wrappers
		value.$trusted = true
		return value
	}

	function gettersetter(store) {
		function prop() {
			if (arguments.length) store = arguments[0]
			return store
		}

		prop.toJSON = function () {
			return store
		}

		return prop
	}

	m.prop = function (store) {
		if ((store != null && (isObject(store) || isFunction(store)) || ((typeof Promise !== "undefined") && (store instanceof Promise))) &&
				isFunction(store.then)) {
			return propify(store)
		}

		return gettersetter(store)
	}

	var roots = []
	var components = []
	var controllers = []
	var lastRedrawId = null
	var lastRedrawCallTime = 0
	var computePreRedrawHook = null
	var computePostRedrawHook = null
	var topComponent
	var FRAME_BUDGET = 16 // 60 frames per second = 1 call per 16 ms

	function parameterize(component, args) {
		function controller() {
			/* eslint-disable no-invalid-this */
			return (component.controller || noop).apply(this, args) || this
			/* eslint-enable no-invalid-this */
		}

		if (component.controller) {
			controller.prototype = component.controller.prototype
		}

		function view(ctrl) {
			var currentArgs = [ctrl].concat(args)
			for (var i = 1; i < arguments.length; i++) {
				currentArgs.push(arguments[i])
			}

			return component.view.apply(component, currentArgs)
		}

		view.$original = component.view
		var output = {controller: controller, view: view}
		if (args[0] && args[0].key != null) output.attrs = {key: args[0].key}
		return output
	}

	m.component = function (component) {
		var args = new Array(arguments.length - 1)

		for (var i = 1; i < arguments.length; i++) {
			args[i - 1] = arguments[i]
		}

		return parameterize(component, args)
	}

	function checkPrevented(component, root, index, isPrevented) {
		if (!isPrevented) {
			m.redraw.strategy("all")
			m.startComputation()
			roots[index] = root
			var currentComponent

			if (component) {
				currentComponent = topComponent = component
			} else {
				currentComponent = topComponent = component = {controller: noop}
			}

			var controller = new (component.controller || noop)()

			// controllers may call m.mount recursively (via m.route redirects,
			// for example)
			// this conditional ensures only the last recursive m.mount call is
			// applied
			if (currentComponent === topComponent) {
				controllers[index] = controller
				components[index] = component
			}
			endFirstComputation()
			if (component === null) {
				removeRootElement(root, index)
			}
			return controllers[index]
		} else if (component == null) {
			removeRootElement(root, index)
		}
	}

	m.mount = m.module = function (root, component) {
		if (!root) {
			throw new Error("Please ensure the DOM element exists before " +
				"rendering a template into it.")
		}

		var index = roots.indexOf(root)
		if (index < 0) index = roots.length

		var isPrevented = false
		var event = {
			preventDefault: function () {
				isPrevented = true
				computePreRedrawHook = computePostRedrawHook = null
			}
		}

		forEach(unloaders, function (unloader) {
			unloader.handler.call(unloader.controller, event)
			unloader.controller.onunload = null
		})

		if (isPrevented) {
			forEach(unloaders, function (unloader) {
				unloader.controller.onunload = unloader.handler
			})
		} else {
			unloaders = []
		}

		if (controllers[index] && isFunction(controllers[index].onunload)) {
			controllers[index].onunload(event)
		}

		return checkPrevented(component, root, index, isPrevented)
	}

	function removeRootElement(root, index) {
		roots.splice(index, 1)
		controllers.splice(index, 1)
		components.splice(index, 1)
		reset(root)
		nodeCache.splice(getCellCacheKey(root), 1)
	}

	var redrawing = false
	m.redraw = function (force) {
		if (redrawing) return
		redrawing = true
		if (force) forcing = true

		try {
			// lastRedrawId is a positive number if a second redraw is requested
			// before the next animation frame
			// lastRedrawId is null if it's the first redraw and not an event
			// handler
			if (lastRedrawId && !force) {
				// when setTimeout: only reschedule redraw if time between now
				// and previous redraw is bigger than a frame, otherwise keep
				// currently scheduled timeout
				// when rAF: always reschedule redraw
				if ($requestAnimationFrame === global.requestAnimationFrame ||
						new Date() - lastRedrawCallTime > FRAME_BUDGET) {
					if (lastRedrawId > 0) $cancelAnimationFrame(lastRedrawId)
					lastRedrawId = $requestAnimationFrame(redraw, FRAME_BUDGET)
				}
			} else {
				redraw()
				lastRedrawId = $requestAnimationFrame(function () {
					lastRedrawId = null
				}, FRAME_BUDGET)
			}
		} finally {
			redrawing = forcing = false
		}
	}

	m.redraw.strategy = m.prop()
	function redraw() {
		if (computePreRedrawHook) {
			computePreRedrawHook()
			computePreRedrawHook = null
		}
		forEach(roots, function (root, i) {
			var component = components[i]
			if (controllers[i]) {
				var args = [controllers[i]]
				m.render(root,
					component.view ? component.view(controllers[i], args) : "")
			}
		})
		// after rendering within a routed context, we need to scroll back to
		// the top, and fetch the document title for history.pushState
		if (computePostRedrawHook) {
			computePostRedrawHook()
			computePostRedrawHook = null
		}
		lastRedrawId = null
		lastRedrawCallTime = new Date()
		m.redraw.strategy("diff")
	}

	function endFirstComputation() {
		if (m.redraw.strategy() === "none") {
			pendingRequests--
			m.redraw.strategy("diff")
		} else {
			m.endComputation()
		}
	}

	m.withAttr = function (prop, withAttrCallback, callbackThis) {
		return function (e) {
			e = e || window.event
			/* eslint-disable no-invalid-this */
			var currentTarget = e.currentTarget || this
			var _this = callbackThis || this
			/* eslint-enable no-invalid-this */
			var target = prop in currentTarget ?
				currentTarget[prop] :
				currentTarget.getAttribute(prop)
			withAttrCallback.call(_this, target)
		}
	}

	// routing
	var modes = {pathname: "", hash: "#", search: "?"}
	var redirect = noop
	var isDefaultRoute = false
	var routeParams, currentRoute

	m.route = function (root, arg1, arg2, vdom) { // eslint-disable-line
		// m.route()
		if (arguments.length === 0) return currentRoute
		// m.route(el, defaultRoute, routes)
		if (arguments.length === 3 && isString(arg1)) {
			redirect = function (source) {
				var path = currentRoute = normalizeRoute(source)
				if (!routeByValue(root, arg2, path)) {
					if (isDefaultRoute) {
						throw new Error("Ensure the default route matches " +
							"one of the routes defined in m.route")
					}

					isDefaultRoute = true
					m.route(arg1, true)
					isDefaultRoute = false
				}
			}

			var listener = m.route.mode === "hash" ?
				"onhashchange" :
				"onpopstate"

			global[listener] = function () {
				var path = $location[m.route.mode]
				if (m.route.mode === "pathname") path += $location.search
				if (currentRoute !== normalizeRoute(path)) redirect(path)
			}

			computePreRedrawHook = setScroll
			global[listener]()

			return
		}

		// config: m.route
		if (root.addEventListener || root.attachEvent) {
			var base = m.route.mode !== "pathname" ? $location.pathname : ""
			root.href = base + modes[m.route.mode] + vdom.attrs.href
			if (root.addEventListener) {
				root.removeEventListener("click", routeUnobtrusive)
				root.addEventListener("click", routeUnobtrusive)
			} else {
				root.detachEvent("onclick", routeUnobtrusive)
				root.attachEvent("onclick", routeUnobtrusive)
			}

			return
		}
		// m.route(route, params, shouldReplaceHistoryEntry)
		if (isString(root)) {
			var oldRoute = currentRoute
			currentRoute = root

			var args = arg1 || {}
			var queryIndex = currentRoute.indexOf("?")
			var params

			if (queryIndex > -1) {
				params = parseQueryString(currentRoute.slice(queryIndex + 1))
			} else {
				params = {}
			}

			for (var i in args) {
				if (hasOwn.call(args, i)) {
					params[i] = args[i]
				}
			}

			var querystring = buildQueryString(params)
			var currentPath

			if (queryIndex > -1) {
				currentPath = currentRoute.slice(0, queryIndex)
			} else {
				currentPath = currentRoute
			}

			if (querystring) {
				currentRoute = currentPath +
					(currentPath.indexOf("?") === -1 ? "?" : "&") +
					querystring
			}

			var replaceHistory =
				(arguments.length === 3 ? arg2 : arg1) === true ||
				oldRoute === root

			if (global.history.pushState) {
				var method = replaceHistory ? "replaceState" : "pushState"
				computePreRedrawHook = setScroll
				computePostRedrawHook = function () {
					try {
						global.history[method](null, $document.title,
							modes[m.route.mode] + currentRoute)
					} catch (err) {
						// In the event of a pushState or replaceState failure,
						// fallback to a standard redirect. This is specifically
						// to address a Safari security error when attempting to
						// call pushState more than 100 times.
						$location[m.route.mode] = currentRoute
					}
				}
				redirect(modes[m.route.mode] + currentRoute)
			} else {
				$location[m.route.mode] = currentRoute
				redirect(modes[m.route.mode] + currentRoute)
			}
		}
	}

	m.route.param = function (key) {
		if (!routeParams) {
			throw new Error("You must call m.route(element, defaultRoute, " +
				"routes) before calling m.route.param()")
		}

		if (!key) {
			return routeParams
		}

		return routeParams[key]
	}

	m.route.mode = "search"

	function normalizeRoute(route) {
		return route.slice(modes[m.route.mode].length)
	}

	function routeByValue(root, router, path) {
		routeParams = {}

		var queryStart = path.indexOf("?")
		if (queryStart !== -1) {
			routeParams = parseQueryString(
				path.substr(queryStart + 1, path.length))
			path = path.substr(0, queryStart)
		}

		// Get all routes and check if there's
		// an exact match for the current path
		var keys = Object.keys(router)
		var index = keys.indexOf(path)

		if (index !== -1){
			m.mount(root, router[keys [index]])
			return true
		}

		for (var route in router) {
			if (hasOwn.call(router, route)) {
				if (route === path) {
					m.mount(root, router[route])
					return true
				}

				var matcher = new RegExp("^" + route
					.replace(/:[^\/]+?\.{3}/g, "(.*?)")
					.replace(/:[^\/]+/g, "([^\\/]+)") + "\/?$")

				if (matcher.test(path)) {
					/* eslint-disable no-loop-func */
					path.replace(matcher, function () {
						var keys = route.match(/:[^\/]+/g) || []
						var values = [].slice.call(arguments, 1, -2)
						forEach(keys, function (key, i) {
							routeParams[key.replace(/:|\./g, "")] =
								decodeURIComponent(values[i])
						})
						m.mount(root, router[route])
					})
					/* eslint-enable no-loop-func */
					return true
				}
			}
		}
	}

	function routeUnobtrusive(e) {
		e = e || event
		if (e.ctrlKey || e.metaKey || e.shiftKey || e.which === 2) return

		if (e.preventDefault) {
			e.preventDefault()
		} else {
			e.returnValue = false
		}

		var currentTarget = e.currentTarget || e.srcElement
		var args

		if (m.route.mode === "pathname" && currentTarget.search) {
			args = parseQueryString(currentTarget.search.slice(1))
		} else {
			args = {}
		}

		while (currentTarget && !/a/i.test(currentTarget.nodeName)) {
			currentTarget = currentTarget.parentNode
		}

		// clear pendingRequests because we want an immediate route change
		pendingRequests = 0
		m.route(currentTarget[m.route.mode]
			.slice(modes[m.route.mode].length), args)
	}

	function setScroll() {
		if (m.route.mode !== "hash" && $location.hash) {
			$location.hash = $location.hash
		} else {
			global.scrollTo(0, 0)
		}
	}

	function buildQueryString(object, prefix) {
		var duplicates = {}
		var str = []

		for (var prop in object) {
			if (hasOwn.call(object, prop)) {
				var key = prefix ? prefix + "[" + prop + "]" : prop
				var value = object[prop]

				if (value === null) {
					str.push(encodeURIComponent(key))
				} else if (isObject(value)) {
					str.push(buildQueryString(value, key))
				} else if (isArray(value)) {
					var keys = []
					duplicates[key] = duplicates[key] || {}
					/* eslint-disable no-loop-func */
					forEach(value, function (item) {
						/* eslint-enable no-loop-func */
						if (!duplicates[key][item]) {
							duplicates[key][item] = true
							keys.push(encodeURIComponent(key) + "=" +
								encodeURIComponent(item))
						}
					})
					str.push(keys.join("&"))
				} else if (value !== undefined) {
					str.push(encodeURIComponent(key) + "=" +
						encodeURIComponent(value))
				}
			}
		}

		return str.join("&")
	}

	function parseQueryString(str) {
		if (str === "" || str == null) return {}
		if (str.charAt(0) === "?") str = str.slice(1)

		var pairs = str.split("&")
		var params = {}

		forEach(pairs, function (string) {
			var pair = string.split("=")
			var key = decodeURIComponent(pair[0])
			var value = pair.length === 2 ? decodeURIComponent(pair[1]) : null
			if (params[key] != null) {
				if (!isArray(params[key])) params[key] = [params[key]]
				params[key].push(value)
			}
			else params[key] = value
		})

		return params
	}

	m.route.buildQueryString = buildQueryString
	m.route.parseQueryString = parseQueryString

	function reset(root) {
		var cacheKey = getCellCacheKey(root)
		clear(root.childNodes, cellCache[cacheKey])
		cellCache[cacheKey] = undefined
	}

	m.deferred = function () {
		var deferred = new Deferred()
		deferred.promise = propify(deferred.promise)
		return deferred
	}

	function propify(promise, initialValue) {
		var prop = m.prop(initialValue)
		promise.then(prop)
		prop.then = function (resolve, reject) {
			return propify(promise.then(resolve, reject), initialValue)
		}

		prop.catch = prop.then.bind(null, null)
		return prop
	}
	// Promiz.mithril.js | Zolmeister | MIT
	// a modified version of Promiz.js, which does not conform to Promises/A+
	// for two reasons:
	//
	// 1) `then` callbacks are called synchronously (because setTimeout is too
	//    slow, and the setImmediate polyfill is too big
	//
	// 2) throwing subclasses of Error cause the error to be bubbled up instead
	//    of triggering rejection (because the spec does not account for the
	//    important use case of default browser error handling, i.e. message w/
	//    line number)

	var RESOLVING = 1
	var REJECTING = 2
	var RESOLVED = 3
	var REJECTED = 4

	function Deferred(onSuccess, onFailure) {
		var self = this
		var state = 0
		var promiseValue = 0
		var next = []

		self.promise = {}

		self.resolve = function (value) {
			if (!state) {
				promiseValue = value
				state = RESOLVING

				fire()
			}

			return self
		}

		self.reject = function (value) {
			if (!state) {
				promiseValue = value
				state = REJECTING

				fire()
			}

			return self
		}

		self.promise.then = function (onSuccess, onFailure) {
			var deferred = new Deferred(onSuccess, onFailure)

			if (state === RESOLVED) {
				deferred.resolve(promiseValue)
			} else if (state === REJECTED) {
				deferred.reject(promiseValue)
			} else {
				next.push(deferred)
			}

			return deferred.promise
		}

		function finish(type) {
			state = type || REJECTED
			next.map(function (deferred) {
				if (state === RESOLVED) {
					deferred.resolve(promiseValue)
				} else {
					deferred.reject(promiseValue)
				}
			})
		}

		function thennable(then, success, failure, notThennable) {
			if (((promiseValue != null && isObject(promiseValue)) ||
					isFunction(promiseValue)) && isFunction(then)) {
				try {
					// count protects against abuse calls from spec checker
					var count = 0
					then.call(promiseValue, function (value) {
						if (count++) return
						promiseValue = value
						success()
					}, function (value) {
						if (count++) return
						promiseValue = value
						failure()
					})
				} catch (e) {
					m.deferred.onerror(e)
					promiseValue = e
					failure()
				}
			} else {
				notThennable()
			}
		}

		function fire() {
			// check if it's a thenable
			var then
			try {
				then = promiseValue && promiseValue.then
			} catch (e) {
				m.deferred.onerror(e)
				promiseValue = e
				state = REJECTING
				return fire()
			}

			if (state === REJECTING) {
				m.deferred.onerror(promiseValue)
			}

			thennable(then, function () {
				state = RESOLVING
				fire()
			}, function () {
				state = REJECTING
				fire()
			}, function () {
				try {
					if (state === RESOLVING && isFunction(onSuccess)) {
						promiseValue = onSuccess(promiseValue)
					} else if (state === REJECTING && isFunction(onFailure)) {
						promiseValue = onFailure(promiseValue)
						state = RESOLVING
					}
				} catch (e) {
					m.deferred.onerror(e)
					promiseValue = e
					return finish()
				}

				if (promiseValue === self) {
					promiseValue = TypeError()
					finish()
				} else {
					thennable(then, function () {
						finish(RESOLVED)
					}, finish, function () {
						finish(state === RESOLVING && RESOLVED)
					})
				}
			})
		}
	}

	m.deferred.onerror = function (e) {
		if (type.call(e) === "[object Error]" &&
				!/ Error/.test(e.constructor.toString())) {
			pendingRequests = 0
			throw e
		}
	}

	m.sync = function (args) {
		var deferred = m.deferred()
		var outstanding = args.length
		var results = []
		var method = "resolve"

		function synchronizer(pos, resolved) {
			return function (value) {
				results[pos] = value
				if (!resolved) method = "reject"
				if (--outstanding === 0) {
					deferred.promise(results)
					deferred[method](results)
				}
				return value
			}
		}

		if (args.length > 0) {
			forEach(args, function (arg, i) {
				arg.then(synchronizer(i, true), synchronizer(i, false))
			})
		} else {
			deferred.resolve([])
		}

		return deferred.promise
	}

	function identity(value) { return value }

	function handleJsonp(options) {
		var callbackKey = options.callbackName || "mithril_callback_" +
			new Date().getTime() + "_" +
			(Math.round(Math.random() * 1e16)).toString(36)

		var script = $document.createElement("script")

		global[callbackKey] = function (resp) {
			script.parentNode.removeChild(script)
			options.onload({
				type: "load",
				target: {
					responseText: resp
				}
			})
			global[callbackKey] = undefined
		}

		script.onerror = function () {
			script.parentNode.removeChild(script)

			options.onerror({
				type: "error",
				target: {
					status: 500,
					responseText: JSON.stringify({
						error: "Error making jsonp request"
					})
				}
			})
			global[callbackKey] = undefined

			return false
		}

		script.onload = function () {
			return false
		}

		script.src = options.url +
			(options.url.indexOf("?") > 0 ? "&" : "?") +
			(options.callbackKey ? options.callbackKey : "callback") +
			"=" + callbackKey +
			"&" + buildQueryString(options.data || {})

		$document.body.appendChild(script)
	}

	function createXhr(options) {
		var xhr = new global.XMLHttpRequest()
		xhr.open(options.method, options.url, true, options.user,
			options.password)

		xhr.onreadystatechange = function () {
			if (xhr.readyState === 4) {
				if (xhr.status >= 200 && xhr.status < 300) {
					options.onload({type: "load", target: xhr})
				} else {
					options.onerror({type: "error", target: xhr})
				}
			}
		}

		if (options.serialize === JSON.stringify &&
				options.data &&
				options.method !== "GET") {
			xhr.setRequestHeader("Content-Type",
				"application/json; charset=utf-8")
		}

		if (options.deserialize === JSON.parse) {
			xhr.setRequestHeader("Accept", "application/json, text/*")
		}

		if (isFunction(options.config)) {
			var maybeXhr = options.config(xhr, options)
			if (maybeXhr != null) xhr = maybeXhr
		}

		var data = options.method === "GET" || !options.data ? "" : options.data

		if (data && !isString(data) && data.constructor !== global.FormData) {
			throw new Error("Request data should be either be a string or " +
				"FormData. Check the `serialize` option in `m.request`")
		}

		xhr.send(data)
		return xhr
	}

	function ajax(options) {
		if (options.dataType && options.dataType.toLowerCase() === "jsonp") {
			return handleJsonp(options)
		} else {
			return createXhr(options)
		}
	}

	function bindData(options, data, serialize) {
		if (options.method === "GET" && options.dataType !== "jsonp") {
			var prefix = options.url.indexOf("?") < 0 ? "?" : "&"
			var querystring = buildQueryString(data)
			options.url += (querystring ? prefix + querystring : "")
		} else {
			options.data = serialize(data)
		}
	}

	function parameterizeUrl(url, data) {
		if (data) {
			url = url.replace(/:[a-z]\w+/gi, function (token){
				var key = token.slice(1)
				var value = data[key] || token
				delete data[key]
				return value
			})
		}
		return url
	}

	m.request = function (options) {
		if (options.background !== true) m.startComputation()
		var deferred = new Deferred()
		var isJSONP = options.dataType &&
			options.dataType.toLowerCase() === "jsonp"

		var serialize, deserialize, extract

		if (isJSONP) {
			serialize = options.serialize =
			deserialize = options.deserialize = identity

			extract = function (jsonp) { return jsonp.responseText }
		} else {
			serialize = options.serialize = options.serialize || JSON.stringify

			deserialize = options.deserialize =
				options.deserialize || JSON.parse
			extract = options.extract || function (xhr) {
				if (xhr.responseText.length || deserialize !== JSON.parse) {
					return xhr.responseText
				} else {
					return null
				}
			}
		}

		options.method = (options.method || "GET").toUpperCase()
		options.url = parameterizeUrl(options.url, options.data)
		bindData(options, options.data, serialize)
		options.onload = options.onerror = function (ev) {
			try {
				ev = ev || event
				var response = deserialize(extract(ev.target, options))
				if (ev.type === "load") {
					if (options.unwrapSuccess) {
						response = options.unwrapSuccess(response, ev.target)
					}

					if (isArray(response) && options.type) {
						forEach(response, function (res, i) {
							response[i] = new options.type(res)
						})
					} else if (options.type) {
						response = new options.type(response)
					}

					deferred.resolve(response)
				} else {
					if (options.unwrapError) {
						response = options.unwrapError(response, ev.target)
					}

					deferred.reject(response)
				}
			} catch (e) {
				deferred.reject(e)
				m.deferred.onerror(e)
			} finally {
				if (options.background !== true) m.endComputation()
			}
		}

		ajax(options)
		deferred.promise = propify(deferred.promise, options.initialValue)
		return deferred.promise
	}

	return m
}); // eslint-disable-line

},{}]},{},[61]);
