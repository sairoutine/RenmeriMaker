'use strict';
var m = require('mithril');
var Controller = require('../controller/new');
var VdomList = require('../config/vdomlist');




module.exports = {
	controller: Controller,
	view: function(ctrl, args) {
		var reload = ctrl.reload.bind(ctrl);
		var save = ctrl.save.bind(ctrl);
		var runGame = ctrl.runGame.bind(ctrl);

		return <div>
			<div id="debug"></div>
			<div id="canvasdiv">
				<canvas id="mainCanvas" width="640" height="480" config={runGame}></canvas>
			</div>
			<hr />
			<div>
				<b>編集</b><br />
				タイトル：<input type="text" value={ctrl.vm.title()} onchange={m.withAttr("value", ctrl.vm.title)} /><br />
				紹介文：<textarea value={ctrl.vm.description()} onchange={m.withAttr("value", ctrl.vm.description)}></textarea><br />

				{(function () {
					var vdomlist = [];
					for (var i = 0, len = ctrl.vm.vdom.length; i < len; i++) {
						var vdom = ctrl.vm.vdom[i];
						vdomlist.push(vdom.toComponent(ctrl));

						(function (vdom) {
							vdomlist.push(<span>
								<input type="button" value="☓" onclick={function () {
									if(ctrl.delete(vdom)) {
										ctrl.reload();
									}
								}} />
								<input type="button" value="↑" onclick={function () {
									if(ctrl.up(vdom)) {
										ctrl.reload();
									}
								}} />
								<input type="button" value="↓" onclick={function () {
									if(ctrl.down(vdom)) {
										ctrl.reload();
									}
								}} />
								<br /></span>);
						})(vdom);
					}
					return vdomlist;
				})()}

				<select onchange={m.withAttr("selectedIndex", ctrl.vm.currentAddVdomSelectedIndex)}>
				{(function () {
					var list = [];
					for (var i = 0, len = VdomList.length; i < len; i++) {
						var vdomconfig = VdomList[i];
						list.push(<option value={vdomconfig.value} selected={i === ctrl.vm.currentAddVdomSelectedIndex()}>{vdomconfig.name}</option>);
					}
					return list;
				})()}
				</select>
				<input type="button" value="追加" onclick={function () {
					ctrl.addVdom();
					ctrl.reload();
				}} />
				<hr />
				<input type="button" value="リロード" onclick={reload} />
				<input type="button" value="セーブ" onclick={save} />
				<br />
			</div>
		</div>;
	}
};
