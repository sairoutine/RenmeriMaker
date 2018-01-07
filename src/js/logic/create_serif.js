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
module.exports = CreateSerif;
