'use strict';

var Util = require('../hakurei').util;
var AssetsConfig = {};

AssetsConfig.images = Util.assign(
	require("./chara"),
	require("./bg")
);

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
