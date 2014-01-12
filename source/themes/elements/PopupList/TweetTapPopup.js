enyo.kind({
	name: "Neo.TweetTapPopup",
	kind: "Neo.PopupList",
	
	create: function(){
		this.inherited(arguments);
		this.tweet = null;
	},
	selectedChanged: function(inSender, inEvent){
		var r = this.inherited(arguments);
			this.requestHide();
			this[this.selected.callNext]();
		return r;
	},
	detailsClicked: function(inSender) {
		AppUI.viewTweet(this.tweet);
	},
	replyClicked: function(inSender) {
		AppUI.reply(this.tweet);
	},
	favoriteClicked: function(inSender) {
		var account = App.Users.get(this.tweet.account_id),
			auth = new SpazAuth(account.type),
			twit = new SpazTwit();
		
		auth.load(account.auth);
		
		twit.setBaseURLByService(account.type);
		twit.setSource(App.Prefs.get('twitter-source'));
		twit.setCredentials(auth);

		if (this.tweet.is_favorite) {
			enyo.log('UNFAVORITING %j', this.tweet);
			twit.unfavorite(
				this.tweet.service_id,
				enyo.bind(this, function(data) {
					this.tweet.is_favorite = false;
					AppUtils.showBanner('Removed favorite');
					AppUI.rerenderTimelines();
				}),
				function(xhr, msg, exc) {
					AppUtils.showBanner('Error removing favorite');
				}
			);
		} else {
			enyo.log('FAVORITING %j', this.tweet);
			twit.favorite(
				this.tweet.service_id,
				enyo.bind(this, function(data) {
					this.tweet.is_favorite = true;
					AppUtils.showBanner('Added favorite');
					AppUI.rerenderTimelines();
				}),
				function(xhr, msg, exc) {
					AppUtils.showBanner('Error adding favorite');
				}
			);
		}
	},
	deleteClicked: function(inSender) {
		AppUI.confirmDeleteTweet(this.tweet);
	},
	repostClicked: function(inSender) {
		AppUI.repost(this.tweet);
	},
	editRepostClicked: function(inSender) {
		AppUI.repostManual(this.tweet);
	},
	emailClicked: function(inSender) {
		AppUtils.emailTweet(this.tweet);
	},
	smsClicked: function(inSender) {
		AppUtils.SMSTweet(this.tweet);
	},
	clipboardClicked: function(inSender) {
        AppUtils.copyTweet(this.tweet);
	},
	showAtEvent: function(inTweet, inEvent){
		this.tweet = inTweet;
		
		this.beforeOpen();
		
		var position = {
			top: inEvent.pageY,
			left: inEvent.pageX
		}
		//console.log("opening popup at", position);
		
		this.applyPosition(position);
		this.activatorOffset = this.getPageOffset(inEvent.originator.eventNode);
		this.show();
		this.render();
	},
	beforeOpen: function() {
		var y = this.getComponents();
		for (var x in y) {
			if (y[x].callNext) y[x].destroy();
		}
		
		var components = [
			{content: "Details", callNext: "detailsClicked"},
			{content: "Reply", callNext: "replyClicked"}
		];
		
		if (this.tweet.is_favorite)
			components.push({content: "Unfavorite", callNext: "favoriteClicked"});
				else if (!this.tweet.is_private_message)
					components.push({content: "Favorite", callNext: "favoriteClicked"});
		
		components.push(
			{content: "Retweet", callNext: "repostClicked"},
			{content: "RT", callNext: "editRepostClicked"},
			{content: "Email", callNext: "emailClicked"},
			{content: "SMS/IM", callNext: "smsClicked"},
			{content: "Copy To Clipboard", callNext: "clipboardClicked"}
		);
		
		if ( (this.tweet.is_author) || (this.tweet.is_private_message) )
			components.push({content: "Delete", callNext: "deleteClicked"});

		this.createComponents(components, {owner:this});
	}
});
