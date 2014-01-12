enyo.kind({
	//@* Neo.Column
	//@* The file that holds ALL of the super long tweet lists that cannot be controlled.
	name: 'Neo.Column',		// BAD TWEETS!
	//@* layout
		kind: 'Neo.BackgroundColumn',
		layoutKind: 'FittableRowsLayout',
		fit: true,
	//@* classes
		classes: 'neo-column',
	//@* events
		events: {
			onDeleteClicked: '',
			onLoadStarted: '',
			onLoadFinished: ''
		},
	//@* published
		published: {
			//@* column info
				info: {},
			//@* populates the list
				tweets: [],
			//@* included for specialty columns
				cache: [],
				cacheIndex: 0,
			//@* alternate top|unread|bottom from .rotateScroll()
				scrollBehavior: 0,
			//@* scroll anchors
				manualAnchor: 0,
				autoAnchor: 0,
		},
	//@* default list guts
	_list_guts: [
		{name: 'item', kind: 'Neo.Tweet.small', onTweetTap: 'tweetTap', onTweetHold: 'tweetHold'},
		{name: 'more', kind: 'Neo.Tweet.other', tweet: {text:'Load More'}, ontap: 'loadOlder'}
	],
	//@* default column components
	components: [
		//@* the incredible amazingly magical glorious pulldown list
		{name: 'list', kind: 'Neo.PulldownList', onSetupItem: 'setupRow', onPullRelease: 'pullRelease', onPullComplete: 'pullComplete',
			fit: true, horizontal: 'hidden', touch: true, thumb: false, pullState: false, rowsPerPage: 15},
		//@* this doesn't open at your finger. =(
		{name: 'tweetTapPopup', kind: 'Neo.TweetTapPopup'}
	],
	//@* override
	create: function() {
		this.inherited(arguments);
		//@* init the list guts
			this.$.list.createComponents(this._list_guts, {owner: this});
		//@* init the radio toolbar if necessary
			if (this.radios && this.radios.length != 0) this._radio_gen(this.cacheIndex);
		//@* scroll to the anchor
			setTimeout(this.scrollToAutoAnchor.bind(this), 0);
	},
	//@* column events
	loadStarted: function() {
		this.log();
		if (this.accountsLoaded === 0) this.bubble('onLoadStarted');
		this.accountsLoaded++;
	},
	loadFinished: function(data, opts, account_id) {
		if (typeof data !== undefined) {
			enyo.forEach(data, function(d) { d.account_id = account_id });
			this.totalData.push(data);
		}
		if (--this.accountsLoaded === 0) {
			this.processData(this.totalData, opts);
			this.bubble('onLoadFinished');
		}
	},
	loadFailed: function() {
		console.error('loadFailed:', this.info, this);
		if (--this.accountsLoaded === 0) this.bubble('onLoadFinished');
		this.buildList();
	},
	loadOtherFinished: function() {
		this.log();
		if (--this.accountsLoaded === 0) this.bubble('onLoadFinished');
	},
	
	//@* events
	
	//@* tweet tap function
	tweetTap: function(inSender, inEvent) {
		var _i = inEvent.index,
			_t = this.tweets[_i],
			_class = inEvent.target.className;
		
		//@* lock the scroller
			this.anchor();
		
		if (_class.search('username') != -1) {
			var username = inEvent.target.getAttribute('data-user-screen_name')
				|| inEvent.target.innerText.replace('@', '');
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
			AppUI.search(inEvent.target.innerText, _t.account_id);
			return true
		}
		//@* send tap if not URL
		if (!inEvent.target.getAttribute('href')) {
			if (App.Prefs.get('tweet-tap').toLowerCase().search('panel') != -1) AppUI.viewTweet(_t);
				else this.$.tweetTapPopup.showAtEvent(_t, inEvent);
			return true;
		}
		return true;
	},
	//@* tweet hold function
	tweetHold: function(inSender, inEvent) {
		var _hp = App.Prefs.get('tweet-hold').toLowerCase();
		
		//@* lock the scroller
			this.anchor();
			
		if (_hp.search('popup') != -1) this.$.tweetTapPopup.showAtEvent(inSender.tweet, inEvent);
			else if (_hp.search('panel') != -1) AppUI.viewTweet(inSender.tweet);
		return true;
	},
	
	
	
	
	
	
	
	//@* list functions
	
	//@* public
	//@* scroll the list to the first unread item
	scrollToUnread: function() {
		//@* get the row offset
			var offset = this.countUnread();
		//@* scroll to the right row
			this.$.list.scrollToRow(offset);
	},
	
	//@* public
	//@* scroll to top of list
	scrollToTop: function(inSender, inEvent) {
		this.$.list.scrollToStart();
	},
	
	//@* public
	//@* scroll to bottom of list
	scrollToBottom: function() {
		this.$.list.scrollToEnd();
	},
	
	//@* public
	//@* scroll to autoAnchor
	scrollToAutoAnchor: function() {
		this.$.list.setScrollPosition(this.autoAnchor);
	},
	
	//@* public
	//@* sets the current list scroll position to the autoAnchor
	anchor: function() {
		this.autoAnchor = this.$.list.getScrollPosition();
	},
	
	//@* public
	//@* rotates, by user preference, between top|unread|bottom
	//@* called from container toolbar tap
	rotateScroll: function() {
		var _a = this, // make things a BIT easier to read
			lastBehavior = _a.scrollBehavior,
			scrollBehavior = App.Prefs.get('scroll-behavior');
		
		// this is fun.
		switch (scrollBehavior) {
			case 4: _a.scrollToTop(); break;
			case 5: _a.scrollToUnread(); break;
			case 6: _a.scrollToBottom(); break;
			// phew. that was easy. now...
			case 1: // top to unread alternating
				_a.scrollBehavior++;
				if (_a.scrollBehavior > 1) _a.scrollBehavior = 0;
				switch (lastBehavior) {
					case 0: _a.scrollToTop(); break;
					case 1: _a.scrollToUnread(); break;
				}
				break;
			case 2: // top to bottom alternating
				_a.scrollBehavior++;
				if (_a.scrollBehavior > 1) _a.scrollBehavior = 0;
				switch(lastBehavior) {
					case 0: _a.scrollToTop(); break;
					case 1: _a.scrollToBottom(); break;
				}
				break;
			case 3: // unread to bottom alternating
				_a.scrollBehavior++;
				if (_a.scrollBehavior > 1) _a.scrollBehavior = 0;
				switch(lastBehavior) {
					case 0: _a.scrollToUnread(); break;
					case 1: _a.scrollToBottom(); break;
				}
				break;
			case 0: // top to unread to bottom alternating
				_a.scrollBehavior++;
				if (_a.scrollBehavior > 2) _a.scrollBehavior = 0;
				switch(lastBehavior) {
					case 0: _a.scrollToTop(); break;
					case 1: _a.scrollToUnread(); break;
					case 2: _a.scrollToBottom(); break;
				}
				break;
			default: // fail
				break;
		}
	},
	//@* private
	//@* called when pully is released
	pullRelease: function(inSender, inEvent) {
		this.$.list.pullState = true;
		//@* set the manual anchor
			this.manualAnchor = this.$.list.getScrollPosition();
		//FIXME inSender.
		//@* we want to load data here and here only!!!
			this.loadNewer();
	},
	//@* private
	//@* after pully release, we put a .completePull() in processData
	//@* after completePull() is called......
	pullComplete: function(inSender, inEvent) {
		//@* we reload the list and manage ALL scrolling here
		//@* faaaaaaaaaaaaaantastic
		this.log();
		var scrollOnUpdate = App.Prefs.get('timeline-scrollonupdate');
		if (scrollOnUpdate === true) this.scrollToUnread();
		else this.scrollManual();
		this.buildList();
		this.$.list.pullState = false;
	},
	//@* private
	//@* rebuilds the list from top to bottom
	buildList: function() {
		this.log(this.tweets.length);
		this.$.list.setCount(this.tweets.length);
		this.$.list.refresh();
	},
	//@* private
	//@* clears the list
	clearList: function() {
		this.$.list.setCount(0);
		this.$.list.refresh();
	},
	//@* private
	//@* called on list item
	setupRow: function(inSender, inEvent) {
		var _i = inEvent.index,
			_t = this.tweets[_i];
		//@* apply index to the tweet
			_t.index = _i;
		//@* load tweet into list
			this.$.item.setTweet(_t);
		//@* show the load more button
			this.$.more.setShowing(this.tweets.length == _i + 1);
		//@* add user to autocomplete stack
			this.addToAC(_t.author_username);
		
		//this.log(this.info.type, _i);
	},
	
	
	//@* radio functions
	
	//@* private
	//@* used to generate radio toolbar when necessary
	_radio_toolbar: [
		{kind: 'Neo.Toolbar', middle: [
			{name: 'radio', kind: 'onyx.RadioGroup', layoutKind: 'FittableColumnsLayout', fit: true, style: 'text-align: center;', onchange: '_radio', components: []}
		]}
	],
	//@* private
	//@* adds radio grouped toolbar to bottom of column
	//@* _b is an object w/ key|value pairs to add to the 'Neo.RadioButton' kind
	//@* called from create
	_radio_gen: function(cacheIndex) {
		var _rg = enyo.clone(this._radio_toolbar),
			_rs = enyo.clone(this.radios);
		this.cache = [];
		this.createComponents(_rg, {owner: this});
		//@* don't continue if there's not a .$.radio, it's been overridden
			if (!this.$.radio) return;
		//@* generate the radio buttons
			enyo.forEach(_rs, function(_r) {
				this.$.radio.createComponent(enyo.mixin(enyo.clone(_r), {kind: 'Neo.RadioButton', index: this.cache.length}), {owner: this});
				this.cache.push([]);
			}, this);
		//this.log(_rg, _rs, this)
		this._radio_select(cacheIndex);
	},
	//@* private
	//@* called on radio button tap
	_radio: function(s, e) {
		var _b = e.originator,
			_i = e.index;
		//this.log(_b, _i);
		if (_i == this.cacheIndex) return true;
		this.clearList();
		this.cacheIndex = _i;
		this.setTweets(this.cache[_i] || []);
		(this.tweets.length != 0) ? this.buildList() : this.loadNewer();
		return true;
	},
	//@* public
	//@* manually selects a radio by index
	_radio_select: function(i) {
		this.$.radio.children[i].$.button.tap();
	}
});
