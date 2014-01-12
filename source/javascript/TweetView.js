enyo.kind({
//Neo.TweetView
	name: 'Neo.TweetView',
	kind: 'FittableRows',
	classes: 'neo-tweet-view',
	
	// published
		published: {
			tweet: {}
		},
	// events
		events: {
			onGoPreviousViewEvent: '',
			onGetViewEvents: '',
			onDestroy: '',
			onShowImageView: ''
		},
	// components
	components: [
		{name: 'toolbar', kind: 'Neo.Toolbar', onClose: 'deleteColumn', closeable: false, align: 'left',
			left: [{name: 'back', kind: 'Neo.Button', icon: 'back', text: 'Back', ontap: 'back'}],
			middle: [{ontap: 'loadProfile', kind: 'FittableColumns', components: [
				{name: 'avatar', kind: 'Image', classes: 'neo-avatar neo-avatar-large'},
				{components: [
					{name: 'username', classes: 'neo-tweet-big'},
					{name: 'realname', classes: 'neo-tweet-bigger'}
				]},
				{name: 'private', kind: 'Image', style: 'width: 13px; height: 13px;', src: 'assets/images/tiny-lock-icon.png', showing: false}]}],
			right: [{kind: 'Neo.Button', icon: 'close', text: 'Close', ontap: 'doDestroy'}]
		},
		{name: 'tweetView', kind: 'Scroller', fit: true, touch: true, thumb: false, horizontal: 'hidden', classes: 'neo-tweet-view', components: [
			{name: 'tweet', kind: 'Neo.Tweet.large', ontap: 'tweetTap'},
			{name: 'images'},
			{name: 'conversation_button', kind: 'Neo.Tweet.other', ontap: 'toggleDrawer', tweet: {text: 'More'}},
			{name: 'conversation_drawer', kind: 'onyx.Drawer', open: false, fit: true, onOpenChanged: 'onConversationOpenChanged', components: [
			    {name: 'conversation', kind: 'Neo.Conversation', onStart: 'onConversationLoadStart', onDone: 'onConversationLoadDone',
			    	onTweetTap: 'tweetTap'}
			]}
        ]},
        {kind: 'Neo.Toolbar', middle: [
			{kind: 'Neo.Button', ontap: 'reply', icon: 'reply', text: 'Reply'},
			{kind: 'onyx.PickerDecorator', components: [
				{kind: 'Neo.Button', icon: 'share', text: 'Share'},
				{name: 'sharePopup', kind: 'Neo.PopupList', onChange: 'sharePopupSelected', components: [
					{content: 'Retweet'},
					{content: 'RT'},
					{content: 'Email'},
					{content: 'SMS/IM'},
					{content: 'Copy'}
				]}
			]},
			{name: 'favorite', kind: 'Neo.Button', ontap: 'toggleFavorite', icon: 'favorite', text: 'Favorite'},
			{name: 'deleteButton', kind: 'Neo.Button', ontap: 'deleteTweet', icon: 'delete', text: 'Delete'}
		]}
	],
	
	browser: new enyo.webOS.ServiceRequest({
		service: 'palm://com.palm.applicationManager/',
		method: 'open',
		subscribe: true,
		fail: this.serviceFail
	}),
	
	//@* published
	//@* called on .setTweet()
	tweetChanged: function(inOldtweet) {
		if (this.tweet.service_id !== inOldtweet.service_id) {
			var events,
				_t = this.tweet;
			//@* set up back button
				storeEvents = function(args){events=args}
				this.bubble('onGetViewEvents',storeEvents);
				this.$.back.setShowing(events.length > 1);
				//console.log('tweet changed... events stack:', events)
			//@* init
				this.$.avatar.setSrc(_t.author_avatar_bigger);
				this.$.realname.setContent(_t.author_fullname||_t.author_username);
				this.$.username.setContent('@' + _t.author_username);
				this.$['private'].setShowing(_t.author_is_private);
				this.$.deleteButton.setShowing( (_t.is_author) || (_t.is_private_message) );
				this.$.images.destroyClientControls();
			//@* load the tweet
				this.$.tweet.setTweet(_t);
			//@* expand URLs
				var shurl = new SpazShortURL(),
					tweethtml = this.$.tweet.$.body.getContent(),
					urls = shurl.findExpandableURLs(tweethtml),
					self = this;
				
				if (urls) 
					for (var i = 0; i < urls.length; i++) {
						shurl.expand(urls[i], {
							'onSuccess': enyo.bind(this, function(data) {
								tweethtml = shurl.replaceExpandableURL(tweethtml, data.shorturl, data.longurl);
								//self.$.tweet.$.body.setContent(tweethtml);
								//if ((i + 1) >= urls.length) self.buildMediaPreviews();
							})
						});
					}
				//else this.buildMediaPreviews();

			// get the conversation..
				if ( (_t.is_search_result) && (_t.service === SPAZCORE_SERVICE_TWITTER) ) {
					AppUtils.makeTwitObj(_t.account_id).getOne(_t.service_id,
						enyo.bind(this, function(data) {
							_t.in_reply_to_id = data.in_reply_to_status_id;
							this.showOrHideConversation();
						}),
						enyo.bind(this, function() {
							_t.in_reply_to_id = null;
							this.showOrHideConversation();
						})
					);
				} else { this.showOrHideConversation() }
			
			
			
			
			this.setFavButtonState();
		}
		//this.render();
	},
	
	
	//@* public
	//@* toggles the conversation drawer
	showOrHideConversation: function() {
		console.log('showingConvo', this.tweet);
		
		var test = (this.tweet.in_reply_to_id);
		
		this.$.conversation_button.setShowing(test);
		this.$.conversation_drawer.setOpen(false);
		
		if (test) {
			this.$.conversation_button.setTweet({text: 'More'});
			this.$.conversation.setTweet(this.tweet);
		} else {
			this.$.conversation_button.hide();
			this.$.conversation.clearConversationMessages();
		}
	},
	
	
	
	//@* public
	//@* generates media previews for the tweet
	buildMediaPreviews: function() {
		var self = this,
			siu = new SpazImageURL(),
			imageThumbUrls = siu.getThumbsForUrls(this.$.tweet.getContent()),
			imageFullUrls = siu.getImagesForUrls(this.$.tweet.getContent()),
			i = 0;
		
		//this.log(this.tweet.text_raw, imageThumbUrls, 'content:', this.$.tweet.getContent());
		
		this.imageFullUrls = [];
		
		if (imageThumbUrls) 
			for (var imageUrl in imageThumbUrls) {
				var imageComponent = this.$.images.createComponent({
					kind: 'Image',
					name: 'imagePreview' + i,
					
					style: 'height: 10px;',
					ontap: 'imageClick',
					src: imageThumbUrls[imageUrl]
				});
				imageComponent.render();
				this.imageFullUrls.push(imageFullUrls[imageUrl]);
				i++;
			}
		else jQuery('#'+this.$.tweet.id).embedly({maxWidth: 300, maxHeight:300, method:'afterParent', wrapElement:'div', classes:'thumbnails',
				success: function(oembed, dict) {
					if (oembed.code.indexOf('<embed') === -1)
						// webOS won't render Flash inside an app. DERP.
						self.$.images.createComponent({ kind: 'enyo.Control', owner: self, components: [
							{style: 'height: 10px;'},
							// {kind: 'enyo.Image', style: 'max-width: 100%;', ontap: 'embedlyClick', src: oembed.thumbnail_url, url: oembed.url},
							{kind: 'FittableColumns', pack: 'center', components: [
								{name: 'oembed_code', allowHtml: true, content:oembed.code}
							]}
						]}).render();
					else enyo.log('skipping oembed with <embed> tag in it', oembed.code);
				}
			});
	},
	
	
	
	
	
	
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
	//@* shows or hides the drawer
	toggleDrawer: function(inSender, inEvent){
		this.$.conversation_drawer.setOpen(!this.$.conversation_drawer.open);
		
		var _b = this.$.conversation_button;
			_b.setTweet({text: this.$.conversation_drawer.open ? 'Less' : 'More'});
	},
	//@* private
	//@* event after drawer opens
	onConversationOpenChanged: function(inSender, inEvent) {
	    if (this.$.conversation_drawer.open) this.$.conversation.refresh();
	    else setTimeout(enyo.bind(this, function(){ this.$.tweetView.scrollTo(0, 0); }), 100);
	},
	onConversationLoadStart: function () {
	    enyo.log('Load Conversation Start');
	},
	onConversationLoadDone: function(inSender, inEvent) {
	    enyo.log('Load Conversation Done');
	    inSender.done();
	    this.reflow();
	},
	//@* private
	//@* reply to current tweet
	reply: function() {
		AppUI.reply(this.tweet);
	},
	//@* private
	//@* tapped on an image
	imageClick: function(inSender) {
		var imageIndex = parseInt(inSender.getName().replace('imagePreview', ''), 10);
		this.doShowImageView(this.imageFullUrls, imageIndex);
	},
	//@* private
	//@* tapped on a url
	embedlyClick: function(inSender) {
		if (inSender.url) {
			this.browser.go({id: 'com.palm.app.browser', params: {target: inSender.url}});
			this.browser.response(this, this.onUploadSuccess);
		}
	},
	//@* private
	//@* tap on fav button
	//@* favorite / unfavorite a tweet
	toggleFavorite: function(inSender) {
		var that = this,
			account = App.Users.get(this.tweet.account_id),
			auth = new SpazAuth(account.type);
		
		auth.load(account.auth);
		
		that.twit = that.twit || new SpazTwit();
		that.twit.setBaseURLByService(account.type);
		that.twit.setSource(App.Prefs.get('twitter-source'));
		that.twit.setCredentials(auth);

		if (that.tweet.is_favorite) {
			enyo.log('UNFAVORITING %j', that.tweet);
			that.twit.unfavorite(
				that.tweet.service_id,
				function(data) {
					that.tweet.is_favorite = false;
					that.setFavButtonState();
					AppUI.rerenderTimelines();
					AppUtils.showBanner($L('Removed favorite'));
				},
				function(xhr, msg, exc) {
					AppUtils.showBanner($L('Error removing favorite'));
				}
			);
		} else {
			enyo.log('FAVORITING %j', that.tweet);
			that.twit.favorite(
				that.tweet.service_id,
				function(data) {
					that.tweet.is_favorite = true;
					that.setFavButtonState();
					AppUI.rerenderTimelines();
					AppUtils.showBanner($L('Added favorite'));
				},
				function(xhr, msg, exc) {
					AppUtils.showBanner($L('Error adding favorite'));
				}
			);
		}
	},
	//@* private 
	//@* set up favorite button
	setFavButtonState: function() {
		if (this.tweet.is_favorite === true) {
			this.$.favorite.setShowing(true);
			this.$.favorite.setIcon('favorited');
			this.$.favorite.setText('Unfavorite');
		} else if (this.tweet.is_private_message === true){
			this.$.favorite.setShowing(false);
		} else {
			this.$.favorite.setIcon('unfavorited');
			this.$.favorite.setText('Favorite');
			this.$.favorite.setShowing(true);
		}
		this.$.favorite.render();
	},
	//@* private
	//@* tapped on popup
	sharePopupSelected: function(s, sel) {
		var _t = this.tweet;
		switch (sel.content) {
			case 'Retweet':
				AppUI.repost(_t);
				break;
			case 'RT':
				AppUI.repostManual(_t);
				break;
			case 'Email':
				AppUtils.emailTweet(_t);
				break;
			case 'SMS/IM':
				AppUtils.SMSTweet(_t);
				break;
			case 'Copy':
				AppUtils.copyTweet(_t);
				break;
			default:
				console.error(sel.getValue() + ' has no handler');
				break;
		}
	},
	//@* private
	//@* opens confirm delete tweet popup
	deleteTweet: function(s, e) {
		AppUI.confirmDeleteTweet(this.tweet);
	},
	//@* private
	//@* opens a user profile
	loadProfile: function(s, e) {
		var tweet = this.tweet;
		AppUI.viewUser(tweet.author_username, tweet.service, tweet.account_id);
	},
	back: function() {
		this.doGoPreviousViewEvent();
	},
	serviceComplete: function(inResponse) {
		//enyo.log('PalmService Success:', inResponse);
	},
	serviceFail: function(inResponse) { // onFailure
		AppUtils.showBanner('PalmService Error!');
		enyo.log('PalmService Error:', inResponse);
	}
});
