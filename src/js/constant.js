'use strict';
var DEBUG = require("./debug_constant");

var CONSTANT = {
	DEBUG: {},

};

if (DEBUG.ON) {
	CONSTANT.DEBUG = DEBUG;
}
module.exports = CONSTANT;
