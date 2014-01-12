enyo.kind({
	name: "Neo.ListColumn",
	kind: "Neo.Column",
	
	_list_guts: [
		{name: "basicItem", kind: "Neo.Tweet.other", ontap: "getList"},
		{name: "userItem", kind: "Neo.Tweet.other", ontap: "userItemClick", show: ["avatar","header"]},
		//@* normal tweet
			{name: "tweetItem", kind: "Neo.Tweet.small", ignoreUnread: true, onTweetTap: "tweetTap", onTweetHold: "tweetHold"},
	],
	
	//@* private
	//@* called on basicItem tap or userItem tap
	getList: function(s, e) {
		this.info.list = s.$.body.content;
		this._radio_select(1);
	},
	userItemClick: function(s, e) {
		var _u = AppUtils.convertToUser(this.tweets[e.index]);
		AppUI.viewUser(_u.username, _u.service, _u.account_id);
	},
	loadListsFinished: function(_d, opts, account_id) {
		this.log(this.states[this.cacheIndex], _d);
		if(!_d.lists && !_d.statuses && !_d.users) return;
		var _ts = [];
		switch (this.getCacheIndex()) {
			case 2: for (var _t in _d.statuses) _ts.push(AppUtils.convertToTweet(_d.statuses[_t])); break;
			case 0: _ts = _d.lists; break;
			case 1: case 3: _ts = _d.users; break;
			default: this.error(); break;
		}
		this.setTweets(_ts);
		this.tweets = _ts;
		this.buildList();
	},
	//@* private
	//@* called on list item
	setupRow: function(s, e) {
		var _i = e.index,
			_t = this.getTweets()[_i],
			_s = this.getCacheIndex(),
			_u = this.$.userItem;
		//@* apply index to the tweet
			_t.index = _i;
		this.$.basicItem.setShowing(_s == 0);
		this.$.userItem.setShowing(_s == 1 || _s == 3);
		this.$.tweetItem.setShowing(_s == 2);
		switch (_s) {
			case 0:
				this.$.basicItem.$.body.setContent(_t.name);
				break;
			case 1: case 3:
				_u.$.avatar.$.author.setSrc(_t.profile_image_url);
				_u.$.header.setAuthor_full(_t.name);
				_u.$.header.setAuthor_short(_t.screen_name);
				break;
			case 2:
				this.$.tweetItem.setTweet(_t);
				break;
		}
		//this.log();
		return;
	},
});
