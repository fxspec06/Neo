enyo.kind({
	name: 'Neo.Sidebar',
	kind: 'FittableRows',
	classes: 'neo-sidebar',

	//@* published
		published: {
			//@* arbitrary
				sidebarWidth: 344,
			//@* there has to be a better way...
				unread: new Array(10),
			//@* holds current sidebar selection
				index: 0
		},
	//@* statics
		_side: [
			{name: 'Timeline', icon: 'timeline'},
			{name: 'Mentions', icon: 'mentions'},
			{name: 'Messages', icon: 'messages'},
			{name: 'Search', icon: 'search'},
			{name: 'Trends', icon: 'trends'},
			{name: 'Favorites', icon: 'favorites'},
			{name: 'Profile', icon: 'profile'},
			{name: 'Lists', icon: 'lists'},
			{name: 'Retweets', icon: 'retweets'},
			{name: 'Filters', icon: 'filters'},
		],
		_menu: [
			{name: 'About', icon: 'NEO', type: 'aboutPopup'},
			{name: 'Settings', icon: 'settings', type: 'settingsPopup'},
			{name: 'Themes', icon: 'settings', type: 'themes'},
			{name: 'Accounts', icon: 'accounts', type: 'accountsPopup'}
		],
	//@* components
	components: [
		{kind: 'Neo.Toolbar', align: 'left', left: [{name: 'avatar', kind: 'Neo.AvatarButton'}], middle: [
			{kind: 'onyx.PickerDecorator', components: [
				{name: 'accountName', kind: 'Neo.Button', icon: 'twitter', collapse: false},
				{name: 'accountSelection', kind: 'Neo.PopupList', onSelect: 'selectAccount'}
			]}
		]},



		{kind: 'Scroller', fit: true, touch: true, thumb: false, horizontal: 'hidden', classes: 'list', components: [
			{name: 'list', kind: 'Repeater', onSetupItem: 'setupItem', components: [
				{name: 'item', kind: 'Neo.SidebarItem', selectColumn: 'itemTap',
					onUpdateUnread: 'updateUnread', onSetWidth: 'setWidth'}
			]}
		]},

		{kind: 'Neo.Toolbar', align: 'left',
			middle: [
				{name: 'pin', kind: 'Neo.Button', icon: 'back', ontap: 'collapse', style: 'z-index: 999'},
				{kind: 'onyx.PickerDecorator', components: [
					{kind: 'Neo.Button', text: '', icon: 'settings', collapse: true},
					{name: 'menu', kind: 'Neo.PopupList', onSelect: 'menuSelect'}
			]}]
		}
	],



	create: function() {
		this.inherited(arguments);

		AppUI.addFunction('selectSidebar', this.selectSidebar, this);
		AppUI.addFunction('selectSidebarByName', function(n, p){
			for (var x in this._side) {
				var item = this._side[x];
				if (item.name.toLowerCase() == n.toLowerCase()) {
					this.index = parseInt(x);
					AppUI.selectSidebar(parseInt(x), p);
				}
			}
		}, this);

		this.$.list.setCount(this._side.length);
		this.$.list.build();

		//@* build the menu
			this.buildMenu();

		this.refreshAccountsButton();
		this.render();
	},

	collapse: function(inSender, inEvent){
		if (this.getBounds().width != 65) {
			this.applyStyle('width', '65px');
			this.$.pin.setIcon('forward');
		} else {
			this.applyStyle('width', null);
			this.$.pin.setIcon('back');
		}
		enyo.Signals.send('setFullscreen', {fs:true});
		enyo.Signals.send('setFullscreen', {fs:false});
		this.render();
		this.container.reflow();
		this.reflow();
	},

	//@* private
	//@* from item.js
	setWidth: function(s, w) {
		this.setSidebarWidth(w.width);
	},
	sidebarWidthChanged: function(oldVal) {
		var width = this.sidebarWidth;
		this.applyStyle('width', width + 'px');
		this.applyStyle('max-width', width + 'px');
		this.render();
		this.reflow();
	},

	selectSidebar: function(index, preventLoad) {
		if (!index) index = this.index;
		this.refreshAccountsButton();
		this.$.list.build();
		var scrollTo = index - 3;
		scrollTo = (scrollTo < 0) ? 0 : scrollTo;
		this.$.scroller.scrollToControl(this.$.list.children[scrollTo].$.item);
	},
	updateUnread: function(inSender, inEvent) {
		var index = inEvent.index,
			unread = inEvent.unread;
		this.unread[index] = unread;
		return true;
	},


	//@* events

	//@* sidebar list setup item
	setupItem: function(s, e) {
		var _i = e.index,
			_$i = e.item.$.item,
			_mi = this._side[_i];

		_$i.setIcon(_mi.icon);
		_$i.setTitle(_mi.name);
		_$i.selectItem(this.index == _i);
		_$i.setUnread(this.unread[_i]);
	},

	//@* private
	//@* called on sidebar item tapped
	itemTap: function(s, e) {
		var _t = e.originator.$.title.content,
			_i = e.index,
			_mi = this._side[_i];

		//if (_i == this.index) return;
		this.index = _i;
		if (_t == 'Profile') AppUI.showMore(_t);
		else AppUI.loadColumn(_t);
		this.$.list.build();
	},

	//@* private
	//@* called on bottom menu popup selected
	menuSelect: function(s, e) {
		var _i = e.selected;
		AppUI.showMore(_i.type);
	},



	//@* private
	//@* builds the popup list quick menu
	buildMenu: function() {
		this.$.menu.destroyClientControls();
		enyo.forEach(this._menu, function(_s) {
			this.$.menu.createComponent({
				content: _s.name,
				type: _s.type
			}, {owner: this});
		}, this);
	},











	refreshAllFinished: function() {
		this.refreshAccountsButton();
	},
	refreshAccountsButton: function() {
		var _as = App.Users.getAll(),
			current = App.Prefs.get('currentUser'),
			_cmps = [];
		this.$.accountSelection.destroyClientControls();
		enyo.forEach(_as, function(_a) {
			_cmps.push({content:'@'+_a.username, id: _a.id});
		}, this);
		this.$.accountSelection.createComponents(_cmps, {owner: this});
		AppUtils.getAccount(App.Prefs.get('currentUser'), enyo.bind(this,
			function(_u) {
				this.$.avatar.setIcon(_u.profile_image_url);
				this.$.accountName.setText('' + _u.screen_name);
				this.$.accountName.container.render();
				this.render();
			}),
			enyo.bind(this, function(xhr, msg, exc){
				console.error("Couldn't find user's avatar");
				this.$.avatar.setIcon('');
				this.$.accountName.setText('');
				this.$.accountName.container.render();
				this.render();
			})
		);
		this.reflow();
		this.render();
	},
	selectAccount: function(s, e){
		var oldUser = App.Prefs.get('currentUser');
		App.Prefs.set('currentUser', e.selected.id);
		AppUI.userChange(oldUser);
	}
});
