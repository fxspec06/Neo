enyo.kind({
// Neo.Tweet
	name: 'Neo.Tweet',
	classes: '  neo-toolbar-middle',
	// handlers
		handlers: {
			ontap: 'tweetTap',
			onhold: 'activateHold',
			onmouseup: 'tweetHold',
		},
	
	// events
		events: {
			onTweetTap: '',
			onTweetHold: ''
		},
	
	// published
		published: {
			tweet: '',
			tweetClass: 'normal',
			ignoreUnread: false,
			_hold: false,
			
			// for theming
				sample: false,
				preview: false,
				theme: ''
		},
	// components
	components: [
		{name: 'themer', kind: 'Neo.ThemeFile', type: 'tweet', onUpdate: 'updateTheme'},
		{name: 'tweet', classes: 'neo neo-tweet onyx-toolbar onyx-dark neo-toolbar-middle'},
		{name: "images"},
	],
	
	//@* override
	create: function() {
		this.inherited(arguments);
		this.$.themer.loadSaved();
	},
	
	//@* theme functions
	//@* override
	themeChanged: function(oldValue) {
		var r = this.inherited(arguments),
			_def = this.$.themer.getDefaults();
		
		this.$.tweet.destroyClientControls();
		this.$.tweet.createComponents(_def.theme, {owner: this});
		return r;
	},
	//@* override
	updateTheme: function(s, styles) {
		this.themeChanged();
		this.tweetChanged();
		this.$.themer.stylize(styles, this.$.tweet);
		this.$.themer.stylize(this.$.themer.highlight, this.$.header.$.usernames);
		this.$.tweet.render();
	},
	
	//@* handlers
	tweetTap: function(inSender, inEvent) {
		if (this.sample === true && !this.preview) {
			this.$.themer.customize();
			return false;
		}
		if (this.preview === true) {
			this.$.themer.preview(this.themePreview);
			return false;
		}
		if (this._hold) return;
		this.bubble('onTweetTap', inEvent);
	},
	activateHold: function(inSender, inEvent){
		this._hold = true;
	},
	tweetHold: function(inSender, inEvent) {
		if (!this._hold) return false;
		this._hold = false;
		this.bubble('onTweetHold', inEvent);
	},
	
	//@* private
	tweetClassChanged: function(oldClass) {
		this.removeClass(oldClass);
		this.addClass(this.tweetClass);
	},
	
	// the biggest function
	tweetChanged: function(oldTweet) {
		// make a couple helpers
			var _h = this.$.header,
				_a = this.$.avatar.$,
				_t = this.tweet,
				_class = 'normal',
				body,
				stamp = sch.getRelativeTime(_t.publish_date, {
					now:'now', seconds:'s', minute:'m',
					minutes:'m', hour:'h', hours:'h',
					day:'d', days:'d'
				});
		
		// we use this if there's a repost
			function isRepost(full, user) {
				_h['setRt_full'](enyo.macroize(full, _t));
				_h['setRt_short'](enyo.macroize(user, _t));
			}
		if (typeof _t.author_fullname == 'undefined' && typeof _t.recipient_fullname == 'undefined') {
			//this.log(_t);
			_t.author_fullname = _t.name || "Neo";
			_t.author_username = _t.screen_name || "Neo Search";
			_t.text = _t.description || _t.SC_text_raw;
			_t.author_avatar = _t.profile_image_url_https || "_icon.png";
		}
		// load
			_h.reset();
			_h['setAuthor_full'](enyo.macroize('{$author_fullname}', _t));
			_h['setAuthor_short'](enyo.macroize('{$author_username}', _t));
			this.$.retweet.setShowing(_t.is_repost === true);
			//_a.retweeter.setShowing(_t.is_repost === true);
			_h.setPrivate(_t.author_is_private || _t.is_private_message);
			_h.setFavorite(_t.is_favorite);
			if (_t.author_avatar)
				_a.author.setSrc(_t.author_avatar);
		
		// for retweets and DMs
			if (_t.recipient_username && _t.author_username == _t._orig.SC_user_received_by && _t.is_private_message) {
				//isRepost('{$recipient_fullname}','{$recipient_username}');
				_h['setAuthor_full'](enyo.macroize('{$recipient_fullname}', _t));
				_h['setAuthor_short'](enyo.macroize('{$recipient_username}', _t));
			} else if (_t.is_repost === true) {
				isRepost('{$reposter_fullname}','{$reposter_username}');
				_a.retweeter.setSrc(_t.reposter_avatar);
				this.$.retweet.$.username.setContent(_t.reposter_username);
				this.$.retweet.$.published.setContent(sch.getRelativeTime(_t.publish_date));
			}
		
		// show the unread indicator
			_h.setUnread(_t.read === false && this.ignoreUnread === false);
			//timestamp += '<img align='left' src='assets/images/unread.png' height= '13px' class='tweetHeaderIcon'></img> ';
		
		// set timestamp
			
			if (_t._orig && _t._orig.source) stamp += ' from {$_orig.source}</span>';
			stamp = enyo.macroize(stamp, _t);
			this.$.timestamp.setContent(stamp);
		
		// set tweet class
			if (_t.is_private_message === true) _class = 'message';
				else if (_t.is_mention === true) _class = 'mention';
				else if (_t.is_author === true) _class = 'author';
			this.setTweetClass(_class);
		
		// body stuff.. do we need this ??
			try {
				body = App.Cache.EntriesHTML.getItem(_t.spaz_id);
			} catch(e) {}
			
			if (!body) {
				body = AppUtils.applyTweetTextFilters(_t.text);
				try {
					App.Cache.EntriesHTML.setItem(_t.spaz_id, body);
				} catch(e) { /*console.log(e, 'tweet.js 106', _t)*/ }
			}
			body = enyo.macroize(body + '', _t);
			
			var shurl = new SpazShortURL(),
				urls = shurl.findExpandableURLs(body);
			
			this.$.body.setContent(body);
			
			//console.log(urls);
			
			var self = this;
			if (urls) 
				for (var i in urls) {
//					console.log(urls[i]);
					shurl.expand(urls[i], {
						'onSuccess': enyo.bind(this, function(data) {
							body = shurl.replaceExpandableURL(body, data.shorturl, data.longurl);
							if (!self || !self.$.body) return;
							self.$.body.setContent(body);
							self.buildMediaPreviews();
							self.render();
						})
					});
				}
			else this.buildMediaPreviews();
			
	},
	
});
