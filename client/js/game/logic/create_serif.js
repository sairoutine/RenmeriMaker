'use strict';
var Util = require('../hakurei').util;

// 静的クラス
var CreateSerif = function() {};


CreateSerif.exec = function () {
	var bg = document.getElementById("background").value;
	var bgm = document.getElementById("bgm").value;

	var serif = [];
	var i, len;
	for (i = 1, len = 5; i <= len; i++) {
		var chara = document.getElementById("chara" + i).value;
		var exp = document.getElementById("exp" + i).value;
		var pos = chara === "renko" ? "right" : "left";

		var serif1 = document.getElementById("serif" + i + "_1").value;
		var serif2 = document.getElementById("serif" + i + "_2").value;

		if (!serif1) continue;

		var message = serif1 + "\n" + serif2;

		serif.push({
			"pos": pos,
			"exp": exp,
			"chara": chara,
			"serif": message,
		});
	}
	// 背景
	serif.unshift({"background": bg});

	// BGM
	if (bgm !== "なし") {
		for (i = 0, len = serif.length; i < len; i++) {
			serif[i] = Util.assign({}, serif[i], {"option": {"bgm": bgm}});
		}
	}

	return serif;
};

CreateSerif.revert = function (serif) {
	// 背景
	document.getElementById("background").value = serif.shift().background;

	// BGM
	if (serif[0].option) {
		document.getElementById("bgm").value = serif[0].option.bgm;
	}

	var i, len;
	for (i = 1, len = 5; i <= len; i++) {
		var s = serif[i - 1]

		document.getElementById("chara" + i).value = s.chara;
		document.getElementById("exp" + i).value = s.exp;

		var messages = s.serif.split(/\n/);
		document.getElementById("serif" + i + "_1").value = messages[0];
		document.getElementById("serif" + i + "_2").value = messages[1];
	}
};

module.exports = CreateSerif;
