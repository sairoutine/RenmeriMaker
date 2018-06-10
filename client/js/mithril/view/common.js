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
					<div style={ { display: ctrl.isNewMode() || ctrl.isEditMode() ? 'block' : 'none'} }>
						<hr />
						<input type="button" value="リロード" onclick={reload} class="mdl-button mdl-js-button mdl-button--raised mdl-button--colored" />
					</div>

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
				<div class="mdl-card__title">
					<h1 class="mdl-card__title-text">編集</h1>
				</div>
				<div class="mdl-card__supporting-text mdl-color-text--black">
					{(function () {
						var vdomlist = [];
						for (var i = 0, len = ctrl.vm.vdom.length; i < len; i++) {
							var vdom = ctrl.vm.vdom[i];

							(function (vdom) {
								vdomlist.push(<span>
									<hr />
									<button onclick={function () {
										if(ctrl.delete(vdom)) {
											ctrl.reload();
										}
									}} class="mdl-button mdl-js-button mdl-button--icon">
										<i class="material-icons">delete_forever</i>
									</button>
									<button onclick={function () {
										if(ctrl.up(vdom)) {
											ctrl.reload();
										}
									}} class="mdl-button mdl-js-button mdl-button--icon">
										<i class="material-icons">keyboard_arrow_up</i>
									</button>
									<button onclick={function () {
										if(ctrl.down(vdom)) {
											ctrl.reload();
										}
									}} class="mdl-button mdl-js-button mdl-button--icon">
										<i class="material-icons">keyboard_arrow_down</i>
									</button>
									{vdom.toComponent(ctrl)}
								</span>);
							})(vdom);
						}
						return vdomlist;
					})()}

					<div class="mdl-textfield mdl-js-textfield">
						追加：<select class="mdl-textfield__input" onchange={m.withAttr("selectedIndex", ctrl.vm.currentAddVdomSelectedIndex)}>
						{(function () {
							var list = [];
							for (var i = 0, len = VdomList.length; i < len; i++) {
								var vdomconfig = VdomList[i];
								list.push(<option value={vdomconfig.value} selected={i === ctrl.vm.currentAddVdomSelectedIndex()}>{vdomconfig.name}</option>);
							}
							return list;
						})()}
						</select>
					</div>
					<button onclick={function () {
						ctrl.addVdom();
						ctrl.reload();
					}} class="mdl-button mdl-js-button mdl-button--fab mdl-button--mini-fab mdl-button--colored">
						<i class="material-icons">add</i>
					</button>
				</div>
				<div class="mdl-card__actions mdl-card--border">
					<div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
						<input class="mdl-textfield__input" type="text" id="title" value={ctrl.vm.title()} onchange={m.withAttr("value", ctrl.vm.title)} />
						<label class="mdl-textfield__label" for="title">タイトル</label>
					</div>
					<br />
					<div class="mdl-textfield mdl-js-textfield  mdl-textfield--floating-label">
						<textarea class="mdl-textfield__input" type="text" rows= "3" id="description" value={ctrl.vm.description()} onchange={m.withAttr("value", ctrl.vm.description)}></textarea>
						<label class="mdl-textfield__label" for="description">紹介文</label>
					</div>

					<label class="mdl-switch mdl-js-switch mdl-js-ripple-effect" for="switch-1">
						<input type="checkbox" id="switch-1" class="mdl-switch__input" onclick={togglePrivate} checked={!ctrl.vm.isPrivate()} />
						<span class="mdl-switch__label">
							{ ctrl.vm.isPrivate() ? "非公開" : "公開" }
						</span>
					</label>
				</div>
				<div class="mdl-card__actions mdl-card--border">
					<div class="mdl-layout-spacer"></div>
					<input type="button" value="セーブ" onclick={save} class="mdl-button mdl-js-button mdl-button--raised mdl-button--colored" />
				</div>

			</div>
			<div class="mdl-cell mdl-cell--2-col mdl-cell--hide-tablet mdl-cell--hide-phone"></div>
		</div>
		<div id="snackbar" class="mdl-js-snackbar mdl-snackbar" config={function (element, isInitialized, context) {
			if(isInitialized) return;
			window.componentHandler.upgradeElement(element);

			context.onunload = function() {
				window.componentHandler.downgradeElements(element);
			};
		}}>
			<div class="mdl-snackbar__text"></div>
			<button class="mdl-snackbar__action" type="button"></button>
		</div>
	</div>;
};

