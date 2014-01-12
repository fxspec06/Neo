enyo.kind({
	name: 'Neo.Conversation',
	events: {
		onStart: '',
		onTweetLoaded: '',
		onSuccess: '',
		onDone: '',
		onError: ''
	},
	published: {
		tweet: {}
	},
	components: [
		{name: 'list', kind: 'List', horizontal: 'hidden', layoutKind: 'FittableRowsLayout', onSetupItem: 'setupItem', onAnimateFinish: 'animateFinish',
			touch: true, classes: 'list', fit: true, thumb: false, components: [
				{name: 'item', kind: 'Neo.Tweet.small', ignoreUnread: true, onTweetHold: 'tweetHold'}
		]},
		{name: 'tweetTapPopup', kind: 'Neo.TweetTapPopup'}
	],
	tweets: [],
	create: function() {
		this.inherited(arguments);
	},
	tweetChanged: function() {
		this.clearConversationMessages();
		this.loadConversation();
	},
	loadConversation: function() {
		var self = this;
		if (this.tweets.length > 0) return true; //Conversation already loaded
		this.bubble('onStart');
		this.twit = AppUtils.makeTwitObj(this.tweet.account_id);
		this.twit.getOne(this.tweet.in_reply_to_id, onRetrieved, function() {
			self.bubble('onError');
			self.bubble('onDone');
		});
		function onRetrieved(status_obj) {
			var child = AppUtils.convertToTweet(status_obj);
			child = AppUtils.setAdditionalTweetProperties([child], self.tweet.account_id)[0];
			self._addTweet(child);
			self.bubble('onTweetLoaded', child);
			if (child.in_reply_to_id) {
				self.twit.getOne(child.in_reply_to_id, onRetrieved, function() {
					self.bubble('onError');
					self.bubble('onDone');
				});
			} else {
				self.bubble('onSuccess');
				self.bubble('onDone');
			}
		};
	},
	_addTweet: function(tweet) {
		// Make sure the tweet gets the account id, needed for reposting. Dunno if
		// this is the right place to add this - seems kinda hackish.
		this.tweets.push(enyo.mixin(tweet, {account_id: this.tweet.account_id}));
		this.refreshList();
	},
	setupItem: function(s, e) {
		var tweet = this.tweets[e.index];
		if (tweet) this.$.item.setTweet(tweet);
	},
	tweetHold: function(s, e) {
		var _h = App.Prefs.get('tweet-hold');
			_t = s.tweet;
		switch (_h) {
			case 'popup':
				this.$.tweetTapPopup.showAtEvent(_t, e);
				break;
			case 'panel':
				AppUI.viewTweet(_t);
				break;
		}
	},
	clearConversationMessages: function() {
		this.tweets = [];
		this.refreshList();
	},
	done: function() {
		this.refreshList();
		var c = this.container.container.container;
		setTimeout(function(){c.render()}, 1000, c);
	},
	refreshList: function() {
		this.$.list.setCount(this.tweets.length);
		this.$.list.refresh();
	}
});
