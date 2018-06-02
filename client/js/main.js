'use strict';

var m = require('mithril');

var New  = require('./mithril/component/new.js');
var Edit = require('./mithril/component/edit.js');
var Show = require('./mithril/component/show.js');

m.route.mode = "pathname";

//HTML要素にコンポーネントをマウント
m.route(document.getElementById("root"), "/novel/new", {
	"/novel/new": New,
	"/novel/show/:id": Show,
	"/novel/edit/:id": Edit,
});
