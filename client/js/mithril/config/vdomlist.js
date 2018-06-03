'use strict';
var BackgroundVDom = require('../vdom/background');
var BgmVDom = require('../vdom/bgm');
var SerifVDom = require('../vdom/serif');

module.exports = [
	{name: "背景変更", value: "background", Klass: BackgroundVDom},
	{name: "BGM変更", value: "bgm", Klass: BgmVDom},
	{name: "セリフ", value: "serif", Klass: SerifVDom},
];
