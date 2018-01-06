'use strict';
// サンプルセリフ
var Serif= [
	{"background":"nc4527"},
	{"pos":"left","exp":"normal","chara":"merry"	, "option": {"bgm": "nc13447"} },
	{"pos":"right","exp":"normal","chara":"renko"	, "option": {"bgm": "nc13447"},"serif": "こんにちはメリー"},
	{"pos":"left","exp":"normal","chara":"merry"	, "option": {"bgm": "nc13447"} ,"serif": "こんにちは蓮子"},
	{"pos":"right","exp":"smile","chara":"renko"	, "option": {"bgm": "nc13447"} ,"serif": "今日もいい天気ね"},
	{"pos":"left","exp":"smile","chara":"merry"	, "option": {"bgm": "nc13447"}, "serif": "そうね"},
];

// 静的クラス
var CreateSerif = function() {};


CreateSerif.exec = function () {
	return Serif;
};
module.exports = CreateSerif;
