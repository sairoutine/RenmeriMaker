'use strict';

/* 画像を暗く変換する */

// 静的クラス
var CreateDarkerImage = function() {};

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
	ctx2.fillRect(
		0,
		0,
		image.width,
		image.height
	);

	ctx2.globalCompositeOperation = "destination-atop";
	ctx2.globalAlpha = 1.0;

	ctx2.drawImage(image,
		0,
		0,
		image.width,
		image.height
	);

	return canvas;
};

module.exports = CreateDarkerImage;
