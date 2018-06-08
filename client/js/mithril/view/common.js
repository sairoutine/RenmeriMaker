'use strict';
var m = require('mithril');
var VdomList = require('../config/vdomlist');

module.exports = function(ctrl, args) {
	var reload = ctrl.reload.bind(ctrl);
	var save = ctrl.save.bind(ctrl);
	var togglePrivate = ctrl.togglePrivate.bind(ctrl);
	var runGame = ctrl.runGame.bind(ctrl);

	return <div>
		<div class="content-grid mdl-grid">
			<div class="mdl-cell mdl-cell--2-col mdl-cell--hide-tablet mdl-cell--hide-phone"></div>
			<div class="mdl-card mdl-cell mdl-cell--8-col mdl-shadow--2dp">
				<div class="mdl-card__supporting-text mdl-color-text--black">
					<canvas width="640" height="480" config={runGame} style="width: 100%; max-width: 640px;height: auto;"></canvas>
					<div style={ { display: ctrl.isShowMode() ? 'block' : 'none'} }>
						<hr />
						タイトル:{ ctrl.vm.title() }<br />
						説明:{ ctrl.vm.description() }<br />
						投稿者:<a href={"/user/show/" + ctrl.vm.user().id()}>{ctrl.vm.user().dispName()}</a><br />
						<hr/>
						{(function () {
							var list = [];
							for (var i = 0, len = ctrl.vm.emojis().length; i < len; i++) {
								var emoji = ctrl.vm.emojis()[i];
								var onsubmit = (function (emoji) {
									return function (e) {
										e.preventDefault();
										ctrl.addEmoji(emoji.type());
									};
								})(emoji);

								if (ctrl.vm.isOwner()) {
									list.push(<span class="mdl-chip">
										<img src={"/image/emoji/" + emoji.fileName() } width="24" height="24"  />
										<span class="mdl-chip__text" style="font-size: 18px">{"　"+emoji.count()}</span>
									</span>);
								}
								else {
									list.push(<button class="mdl-chip" style="cursor: pointer;" onclick={onsubmit}>
										<img src={"/image/emoji/" + emoji.fileName() } width="24" height="24"  />
										<span class="mdl-chip__text" style="font-size: 18px">{"　"+emoji.count()}</span>
									</button>);
								}
							}
							return list;
						})()}
					</div>
				</div>
				<div style={ { display: ctrl.isShowMode() && ctrl.vm.isOwner() ? 'block' : 'none'} }>
					<div class="mdl-card__actions mdl-card--border">
						<div class="mdl-layout-spacer"></div>
						<a class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect" href={"/novel/edit/" + ctrl.vm.id() }>編集&nbsp;<i class="material-icons">build</i></a>
					</div>
				</div>
			</div>
			<div class="mdl-cell mdl-cell--2-col mdl-cell--hide-tablet mdl-cell--hide-phone"></div>
		</div>

		<div class="content-grid mdl-grid" style={ { display: ctrl.isEditMode() || ctrl.isNewMode() ? '' : 'none'} }>
			<div class="mdl-cell mdl-cell--2-col mdl-cell--hide-tablet mdl-cell--hide-phone"></div>
			<div class="mdl-card mdl-cell mdl-cell--8-col mdl-shadow--2dp">
				<div class="mdl-card__supporting-text mdl-color-text--black">
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

					現在:{ ctrl.vm.isPrivate() ? "非公開" : "公開" }
					<input type="button" value="公開／非公開の変更" onclick={togglePrivate}/>

					<input type="button" value="リロード" onclick={reload} />
					<input type="button" value="セーブ" onclick={save} />
				</div>
			</div>
			<div class="mdl-cell mdl-cell--2-col mdl-cell--hide-tablet mdl-cell--hide-phone"></div>
		</div>
	</div>;
};

