enyo.kind({
	name: 'Neo.UserView',
	kind: "FittableRows",
	
	classes: 'neo-tweet-view',
	
	published: {
		user: '',
		items: [],
		
		states: ['tweets', 'followers','friends'],
		cacheIndex: 0,
		cache: [
			[],[],[]
		],
		
		scrollPositions: {},
	},
	
	events: {
		onGoPreviousViewEvent: '',
		onGetViewEvents: '',
		onDestroy: ''
	},
	components: [
		{name: 'toolbar', kind: 'Neo.Toolbar', onClose: 'deleteColumn', closeable: false, align: 'left',
			left: [{name: 'back', kind: 'Neo.Button', icon: 'back', text: 'Back', ontap: 'back'}],
			middle: [
				{name: 'avatar', kind: 'Image', classes: 'neo-avatar neo-avatar-large'},
					{components: [
						{name: 'username', classes: 'neo-tweet-big'},
						{name: 'realname', classes: 'neo-tweet-bigger'}
					]},
					{name: 'private', kind: 'Image', style: 'width: 13px; height: 13px;', src: 'assets/images/tiny-lock-icon.png', showing: false}
			], right: [{kind: 'Neo.Button', icon: 'close', text: 'Close', ontap: 'doDestroy'}]
		},
		{name: 'bio', kind: 'Neo.Subtext', ontap: 'bioClick'},
		{name: 'subtoolbar', kind: 'Neo.Toolbar',
			left: [
				{kind: 'onyx.PickerDecorator', components: [
					{kind: 'onyx.PickerButton', classes: 'neo-button', content: 'Account'},
					{name: 'accounts', kind: 'Neo.PopupList', onChange: 'pickerTap'},
				]},
				{name: 'following', kind: 'Neo.Button', ontap: 'toggleFollow', text: 'Loading...', disabled: true, blue: false}
			],
			right: [
				{name: 'radio', kind: 'onyx.RadioGroup', layoutKind: 'FittableColumnsLayout', onchange: 'radio', components: [
					{name: 'tweets', kind: 'Neo.RadioButton', index: 0, active: true, icon: 'mention'},
					{name: 'followers', kind: 'Neo.RadioButton',index: 1, icon: 'accounts'},
					{name: 'friends', kind: 'Neo.RadioButton', index: 2, icon: 'accounts', blue: false}
			]}]
		},
		{name: 'list', kind: 'List', onSetupItem: 'setupItem', fit: true, touch: true, thumb: false, horizontal: 'hidden', components: [
			{name: 'tweetItem', kind: 'Neo.Tweet.small', ignoreUnread: true, onTweetTap: 'tweetTap', ontweetHold: 'tweetHold'},
			{name: 'userItem', kind: 'Neo.Tweet.other', ontap: 'userItemClick', show: ['avatar','header']},
		]},
		{name: 'bottomToolbar', kind: 'Neo.Toolbar', middle: [
			{kind: 'Neo.Button', icon: 'mention', text: 'Mention', ontap: 'mention'},
			{name: 'message', kind: 'Neo.Button', icon: 'messages', text: 'Message', ontap: 'message'},
			{kind: 'Neo.Button', icon: 'block', text: 'Block', ontap: 'block'},
			{kind: 'Neo.Button', icon: 'search', text: 'Search', ontap: 'userSearch'},
		]},
		
		//////////////////////////////////////////////////////////////////////////////////////////////////
		{name: 'tweetTapPopup', kind: 'Neo.TweetTapPopup'},
		{name: 'confirmPopup', kind: 'onyx.Popup', scrim : true, components: [
			{content: 'Block user?'},
			{style: 'height: 10px;'},
			{layoutKind: 'FittableColumnsLayout', components: [
				{kind: 'Neo.Button', text: 'No', ontap: 'hideBlockPopup', icon: 'cancel'},
				{kind: 'Neo.Button', blue: false, classes: 'onyx-negative', text: 'Yes', ontap: 'confirmBlock', icon: 'halt'}
			]}
		]}
	],
	
	//@* published
	//@* called on .setUser()
	userChanged: function(oldVal) {
		var _u = this.user,
			_url = _u.url || '';
		//@* should never happen, but keep anyways...
			if (this.$.username.getContent() === '@' + _u.username) return;
		//@* show | hide back button
			this.bubble('onGetViewEvents', enyo.bind(this, function(a) {this.$.back.setShowing(a.length > 1)}));
		
		this.cache = [[],[],[]];
		this.$.avatar.setSrc(_u.avatar_bigger);
		this.$.avatar.applyStyle('display', null);
		this.$.realname.setContent(_u.fullname || _u.username);
		this.$.username.setContent('@' + _u.username);
		this.$.private.setShowing(_u.is_private);
		this.$.bio.setContent(AppUtils.makeItemsClickable(_u.description) || '');
		this.$.followers.setText(_u._orig.followers_count + ' folwz');
		this.$.friends.setText(_u._orig.friends_count + ' frndz');
		this.$.tweets.setText(_u._orig.statuses_count + ' twtz');
		//@* simulate a radio button tap
			this.$.radio.children[0].$.button.tap();
		
			this.getItems();
			this.buildAccountButton();
			this.getTwitterRelationship();
		//@* done
		this.render();
		this.reflow();
	},
	
	
	
	
	
	//@* events
	
	//@* private
	//@* tweet tap
	tweetTap: function(s, e) {
		var _i = e.index,
			_t = this.items[_i],
			_class = e.target.className;
		//@* lock the scroller
			this.lock = this.$.list.getScrollPosition();
		if (_class.search('username') != -1) {
			var username = e.target.getAttribute('data-user-screen_name')
			|| e.target.innerText.replace('@', '');
			AppUI.viewUser(username, _t.service, _t.account_id, this.index);
			return true;
		}
		if (_class.search('neo-avatar') != -1) {
			var username = _t.author_username;
			if (_class.search('retweet') != -1) username = _t.reposter_username;
			AppUI.viewUser(username, _t.service, _t.account_id, this.index);
			return true;
		}
		if (_class.search('hashtag') != -1) {
			AppUI.search(e.target.innerText, _t.account_id);
			return true
		}
		//@* send tap if not URL
		if (!e.target.getAttribute('href')) {
			if (App.Prefs.get('tweet-tap').toLowerCase().search('panel') != -1) AppUI.viewTweet(_t);
			else this.$.tweetTapPopup.showAtEvent(_t, e);
			return true;
		}
		return true;
	},
	//@* private
	//@* tweet hold
	tweetHold: function(s, e) {
		var _hp = App.Prefs.get('tweet-hold').toLowerCase();
		if (_hp.search('popup') != -1) this.$.tweetTapPopup.showAtEvent(s.tweet, e);
		else if (_hp.search('panel') != -1) AppUI.viewTweet(s.tweet);
		return true;
	},
	//@* private
	//@* follow / unfollow user
	toggleFollow: function(s, e) {
		var self = this,
		twit = AppUtils.makeTwitObj(this.getAccounts().id),
		_f = this.user.are_following;
		this.$.following.setActive(true);
		if (_f && _f === 'yes') twit.removeFriend(this.user.service_id, function(data) {
			enyo.log('response from remove friend:', data);
			self.user.are_following = 'no';
			self.setFollowButtonIcon(self.user.are_following);
			self.$.following.setActive(false);
			AppUtils.showBanner(enyo.macroize($L('Stopped following {$screen_name}'), {'screen_name': self.user.username}))},
			function(xhr, msg, exc) {
				self.$.following.setActive(false);
				AppUtils.showBanner(enyo.macroize($L('Failed to stop following {$screen_name}'), {'screen_name': self.user.username}));
		});
		else if (_f) twit.addFriend(this.user.service_id, function(data) {
			enyo.log('response from add friend:', data);
			self.user.are_following = 'yes';
			self.setFollowButtonIcon(self.user.are_following);
			self.$.following.setActive(false);
			AppUtils.showBanner(enyo.macroize($L('Started following {$screen_name}'), {'screen_name': self.user.username}))},
			function(xhr, msg, exc) {
				self.$.following.setActive(false);
				AppUtils.showBanner(enyo.macroize($L('Failed to start following {$screen_name}'), {'screen_name': self.user.username}))
		});
	},
	//@* private
	//@* radio changed
	radio: function(s, e) {
		var _b = e.originator,
			_i = e.index;
		this.log(_b, _i);
		this.setScrollPosition();
		this.cacheIndex = _i;
		this.items = [];
		this.refreshList();
		if (this.cache[this.cacheIndex].length > 0) {
			this.items = this.cache[this.cacheIndex];
			this.refreshList();
		} else this.getItems();
	},
	//@* private
	//@* picker button selected
	pickerTap: function(s, e) {
		//e.originator.setActive(true);
		
		//this.userChanged();
		this.setFollowButtonIcon();
	},
	//@* private
	//@* tapped on an avatar
	userItemClick: function(s, e) {
		AppUI.viewUser(this.items[e.rowIndex].screen_name, this.items[e.rowIndex].SC_service, this.account_id);
	},
	//@* private
	//@* called on tap on bio
	bioClick: function(s, e) {
		var classes = e.target.className;
		if (_.includes(classes, 'username')) {
			var username = e.target.getAttribute('data-user-screen_name') || e.target.innerText.replace('@', '');
			AppUI.viewUser(username, this.user.service, this.user.account_id);
		} else if (_.includes(classes, 'hashtag')) AppUI.search(e.target.innerText, this.user.account_id);
	},
	//@* private
	//@* initiates a mention
	mention: function(s, e) {
		AppUI.compose('@'+this.user.username+' ');
	},
	//@* private
	//@* initiates a message
	message: function(s, e) {
		AppUI.directMessage(this.user.username, this.getAccounts().value);
	},
	//@* private
	//@* initiates a search for user
	userSearch: function(s, e) {
		AppUI.search('@'+ this.user.username + ' OR from:'+ this.user.username, this.getAccounts().value);
  	},
  	//@* private
	//@* opens the block confirm popup
  	block: function(s, e) {
		this.$.confirmPopup.open();
	},
	//@* private
	//@* blocks a user
	confirmBlock: function(s, e) {
		this.hideBlockPopup();
		AppUtils.makeTwitObj(this.account_id).block(this.user.service_id,
			function(data){AppUtils.showBanner('Blocked user')},
			function(xhr, msg, exc){AppUtils.showBanner('Failed to block user')});
	},
	//@* private
	//@* hides the block popup
	hideBlockPopup: function(s, e) {
		this.$.confirmPopup.close();
	},
	//@* private
	//@* goes to the previous view event
	back: function(s, e) {
		this.doGoPreviousViewEvent();
	},
	
	
	
	
	
	
	
	//@* user view functions
	
	//@* public
	//@* called from container on init
	//@* shows the user
	showUser: function(u, s, a) {
		this.account_id = a || App.Prefs.get('currentUser');
		window.AppCache.getUser(u, s, a,
			enyo.bind(this, function(user) {this.setUser(user)}),
			enyo.bind(this, function(data) {
				if (data.status === 404) AppUtils.showBanner(enyo.macroize('No user named {$username}', {username: u}));
				else AppUtils.showBanner(enyo.macroize('Error loading info for {$username}', {username: u}));
				//@FIXME this.doDestroy();
			}));
	},
	//@* public
	//@* builds the account popup
	buildAccountButton: function() {
		this.accounts = [];
		var allusers = App.Users.getAll();
		enyo.forEach(allusers, function (_k) {
			if (_k.type === this.user.service)
				this.accounts.push({ id: _k.id, value: _k.id, content: _k.username, type: _k.type,
					active: ((this.account_id && this.account_id == _k.id) || (!this.account_id && App.Prefs.get('currentUser') == _k.id))});
		}, this);
		this.$.accounts.destroyClientControls();
		this.$.accounts.createComponents(this.accounts, {owner: this} );
		this.$.accounts.render();
	},
	//@* public
	//@* gets the twitter relationship state for this user
	getTwitterRelationship: function() {
		var self = this,
			twit = AppUtils.makeTwitObj(this.getAccounts().value);
		
		this.account_id = this.getAccounts().id;
		this.enableFollowButton(false);
		twit.showFriendship(this.user.service_id, null, function(data) {
				enyo.log('show friendship result: %j', data);
				if (data.relationship.target.followed_by) {
					enyo.log('You are following this user!');
					self.user.are_following = 'yes';
				} else {
					enyo.log('You are NOT following this user!');
					self.user.are_following = 'no';
				}
				self.enableFollowButton(true);
				self.setFollowButtonIcon(self.user.are_following);
				self.$.message.setShowing(data.relationship.source.can_dm);
				self.$.bottomToolbar.render();
				self.reflow();
			},
			function(xhr, msg, exc) {AppUtils.showBanner('Could not retrieve relationship info')}
		);
	},
	//@* public
	//@* sets the follow button icon state
	setFollowButtonIcon: function(current_state) {
		this.$.following.setDisabled(false);
		if (current_state === 'yes') {
			this.$.following.setIcon('unfollow');
			this.$.following.setText('Unfollow');
			this.$.following.removeClass('onyx-affirmative');
			this.$.following.addClass('onyx-negative');
		} else if (App.Users.get(this.getAccounts().id).username.toLowerCase() === this.user.username.toLowerCase()) {
			this.$.following.setIcon('show');
			this.$.following.setText("That's you!");
			this.$.following.removeClass('onyx-affirmative');
			this.$.following.removeClass('onyx-negative');
		} else {
			this.$.following.setIcon('follow');
			this.$.following.setText('Follow');
			this.$.following.removeClass('onyx-negative');
			this.$.following.addClass('onyx-affirmative');
		}
		this.$.list.render();
		this.$.subtoolbar.render();
		//FIXME
	},
	//@* public
	//@* retrieves the user tweets or followers
	getItems: function() {
		this.cache[this.cacheIndex] = [];
		switch (this.states[this.cacheIndex]) {
			case 'tweets':
				AppUtils.makeTwitObj(this.account_id).getUserTimeline(this.user.service_id, 50, null,
					enyo.bind(this, function(data) {
						this.items = AppUtils.convertToTweets(data.reverse());
						this.items = AppUtils.setAdditionalTweetProperties(this.items, this.account_id);
						this.items.sort(function(a,b) {return b.service_id - a.service_id});
						this.cache[this.cacheIndex] = this.items;
						this.refreshList();
					}),
					enyo.bind(this, function() {AppUtils.showBanner('Error loading tweets for ' + this.$.username.getContent())}));
				break;
			case 'followers':
				AppUtils.makeTwitObj(this.account_id).getFollowersList(this.user.service_id, null,
					enyo.bind(this, function(data) {
						this.items = data;
						this.cache[this.cacheIndex] = this.items;
						this.refreshList();
					}),
					enyo.bind(this, function() {AppUtils.showBanner('Error loading followers for ' + this.$.username.getContent())}));
				break;
			case 'friends':
				AppUtils.makeTwitObj(this.account_id).getFriendsList(this.user.service_id, null,
					enyo.bind(this, function(data) {
						this.items = data;
						this.cache[this.cacheIndex] = this.items;
						this.refreshList();
					}),
					enyo.bind(this, function() {AppUtils.showBanner('Error loading friends for ' + this.$.username.getContent())}));
				break;
		}
	},
	//@* public
	//@* shows or hides the follow button
	enableFollowButton: function(enabled) {
		this.$.following.setDisabled(!enabled);
	},
	//@* public
	//@* gets the currently selected account
	getAccounts: function() {
		this.$.accounts.render();
		return this.$.accounts.selected;
	},
	
	
	
	refreshList: function() {
		this.$.list.setCount(this.items.length);
		this.$.list.refresh();
		this.render();
		if (this.scrollPositions[this.cacheIndex]) this.$.list.setScrollPosition(this.scrollPositions[this.cacheIndex]);
	},
	setScrollPosition: function() {
		if(!this.scrollPositions[this.cacheIndex]) this.scrollPositions[this.cacheIndex] = 0;
		this.scrollPositions[this.cacheIndex] = this.$.list.getScrollPosition();
	},
	setupItem: function(s, e) {
		var _i = e.index,
			_it = this.items[_i],
			_u = this.$.userItem,
			_t = this.$.tweetItem,
			_s = this.cacheIndex,
			_tw = (_s==0);
		if (!_it) return;
		_u.setShowing(!_tw);
		_t.setShowing(_tw);
		if (_tw) _t.setTweet(enyo.mixin(_it, {account_id: this.account_id}));
		else {
			_u.$.avatar.$.author.setSrc(_it.profile_image_url);
			_u.$.header.setAuthor_full(_it.name);
			_u.$.header.setAuthor_short(_it.screen_name);
		}
	},
});
