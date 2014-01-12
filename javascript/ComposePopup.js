enyo.kind({
	name: 'Neo.ComposePopup',
	kind: 'FittableRows',
	
	events: {
		onClose: ''
	},
	
	published: {
		dmUser: '', // use this to show the user we are direct messaging
		inReplyTweetText: '' // use this to display the tweet being replied to
	},
	
	isDM: false,
	inReplyToId: null, // set this when making a reply to a specific tweet
	showKeyboardWhenOpening: false, // opens the keyboard and positions the popup correctly
	
	uploader: new enyo.webOS.ServiceRequest({
		service: 'palm://com.palm.downloadmanager',
		method: 'upload',
		subscribe: true,
		fail: this.onUploadFailure
	}),
	
	components: [
		{name: 'filePicker', kind: 'FilePicker', fileType: ['image'], allowMultiSelect: false, onPickFile: 'fileChosen'},
		{name: 'toolbar', kind: 'Neo.Toolbar', closeable: true, header: 'Compose Tweet', onClose: 'close'},
		{name: 'inReplyTweetText', kind: 'Neo.Subtext'},
		{classes: 'compose', components: [
			{tag: 'hr'},
			{name: 'autocompleteBox', showing: false, style: 'color:black;max-height: 300px;width:200px;', components: [
				{layoutKind: 'FittableColumnsLayout', name: 'autocompleteResults'}
			]},
			{name: 'postTextBoxContainer', kind: 'onyx.InputDecorator', components: [
				{name: 'postTextBox', kind: 'Neo.RichText', alwaysLooksFocused: true, placeholder: 'Type message here...',
					oninput: 'postTextBoxInput', onkeydown: 'postTextBoxKeydown', onfocus: 'postTextBoxFocus'},
			]},
			{tag: 'hr'},
		]},
		{kind: 'Neo.Toolbar',
			left: [
				{kind: 'onyx.PickerDecorator', style: 'margin-top: 0px;', components: [
					{kind: 'onyx.PickerButton', classes: 'neo-button'},
					{name: 'accountSelection', kind: 'Neo.PopupList', onChange: 'accountChange'}
				]}
			],
			middle: [
				{kind: 'Neo.Button', icon: 'attach', text: 'Attach', ontap: 'showFilePicker'},
				{kind: 'onyx.PickerDecorator', components: [
					{name: 'shortenButton', kind: 'Neo.Button', icon: 'shorten', text: 'Shorten', ontap: 'onShortenClick'}, //
					{name: 'shortenPopup', kind: 'Neo.PopupList', onChange: 'itemSelect', components: [
						{content: 'Shorten URLs', value:'shortenURLs'},
						{content: 'Shorten Text', value:'shortenText'}
					]}
				]}
			],
			right: [
				{name: 'sendButton', kind: 'Neo.SendButton', ontap: 'onSendClick', icon: 'send', text: 'Send', remaining: 140},
				{name: 'retweetButton', kind: 'Neo.Button', ontap: 'onSendClick', blue: false, classes: 'onyx-negative',
					text: 'Retweet', icon: 'refresh', collapse: false, showing: false}
			]
		},
	],
	create: function(){
		this.inherited(arguments);
		
	},
	close: function() {
		this.inherited(arguments);
		this.$.postTextBox.blur();
		this.doClose();
	},
	buildAccounts: function() {

		var allusers = App.Users.getAll();
		
		var current = App.Prefs.get('currentUser');
		
		
		this.accounts = [];
		
		for (var key in allusers) {
			if(allusers[key].id === current) {
				found_last_posting_account_id = true;
			}
			this.accounts.push({
				id: allusers[key].id,
				value: allusers[key].id,
				content: allusers[key].username,
				type: allusers[key].type,
				active: (allusers[key].id === current || key == 0)
			});
		}
		
		this.$.accountSelection.createComponents(this.accounts, {owner: this} );
		this.$.accountSelection.render();
		
		if (current) this.setPostingAccount(current);
			else this.setPostingAccount(this.accounts[0].value);
		
	},
	reset: function() {
		this.setAllDisabled(false);
		this.$.postTextBoxContainer.setShowing(true);
		
		this.$.postTextBox.blur();
		
		this.buildAccounts();
		
		this.$.autocompleteBox.setShowing(false);
		this.$.autocompleteResults.destroyClientControls();
		this.completemode = false;
		
		this.$.sendButton.show();
		this.$.retweetButton.hide();
		this.reflow();
		this.render();
	},

	dmUserChanged: function(){
		//this can be set by calling this.$.composePopup.setDmUser({}); (from parent)
		//this should be cleared on send
		//set flag?
		if (!this.dmUser) {
			this.isDM = false;
		} else {
			this.$.toolbar.setHeader('Message to '+this.dmUser);
			this.isDM = true;
		}

	},

	inReplyTweetChanged: function(){
		this.$.inReplyTweetText.setContent(this.inReplyTweetText);

		if (!this.isDM) { // we can set the irtText when it's a DM too, so check
			if (!this.inReplyToId) {
				this.$.inReplyTweetText.hide();
			} else {
				this.$.toolbar.setHeader('Reply');
				this.$.inReplyTweetText.show();
			}
		}


		if (this.inReplyTweetText) {
			this.$.inReplyTweetText.show();
		} else {
			this.$.inReplyTweetText.hide();
		}
	},
	setPostingAccount: function(account_id) {
		// make the SpazTwit object
		this.twit = AppUtils.makeTwitObj(account_id);

		// save this for next time
		App.Prefs.set('last_posting_account_id', account_id);
	},
	accountChange: function(inSender, inEvent) {
		this.setPostingAccount(inEvent.selected.id);
	},

	onSendClick: function(inSender) {
		this.$.sendButton.setActive(true);
		this.setAllDisabled(true);
		
		if (this.isDM) {
			this.twit.sendDirectMessage('@'+this.dmUser, this.$.postTextBox.getValue(),
				enyo.bind(this, function() {
					this.$.postTextBox.setValue('');
					this.$.sendButton.setActive(false);
					this.setAllDisabled(false);
					if (App.Prefs.get('refresh-after-posting')) {
						AppUI.refresh(this.$.accountSelection.selected.value);
					}
					this.close();
				}),
				enyo.bind(this, function() {
					//@TODO report error info
					AppUtils.showBanner('Sending failed');
					this.$.sendButton.setActive(false);
					this.setAllDisabled(false);
				})
			);
		} else if (this.isRepost) {

			this.twit.retweet(
				this.repostTweet.service_id,
				enyo.bind(this, function(data){
					this.repostTweet = null;
					this.isRepost = null;

					this.$.sendButton.setActive(false);
					this.setAllDisabled(false);
					var selected = this.$.accountSelection.selected.value;
					this.close();
					AppUtils.showBanner('Message retweeted!');
					if (App.Prefs.get('refresh-after-posting')) {
						AppUI.refresh(selected);
					}
					
				}),
				enyo.bind(this, function(xhr, msg, exc){
					this.$.sendButton.setActive(false);
				})
			);
		} else {
			this.twit.update(this.$.postTextBox.getValue(), null, this.inReplyToId,
				enyo.bind(this, function() {
					this.$.postTextBox.setValue('');
					this.$.sendButton.setActive(false);
					this.setAllDisabled(false);
					this.close();
					if(App.Prefs.get('refresh-after-posting')) {
						AppUI.refresh(App.Prefs.get('currentUser'));
					}
				}),
				enyo.bind(this, function(e) {console.log(e)
					//@TODO report error info
					AppUtils.showBanner('Sending failed');
					this.$.sendButton.setActive(false);
					this.setAllDisabled(false);
				})
			);
		}
	},

	onShortenClick: function(inSender) {
		this.$.shortenPopup.show(inSender);
	},

	itemSelect: function(inSender, inSelected) {
		console.log(inSender, inSelected);
		
		switch(inSender.selected.value){
			case 'shortenURLs':
				this.onShortenURLsClick();
				break;
			case 'shortenText':
				this.onShortenTextClick();
				break;
			default:
				console.error(inSender.selected.value + ' has no handler');
				break;
		}
	},

	onShortenTextClick: function(inSender) {
		this.$.postTextBox.setValue(new SpazShortText().shorten(this.$.postTextBox.getValue()));
		this.$.postTextBox.focus();
		this.postTextBoxInput();
	},

	onShortenURLsClick: function(inSender) {
		var urls = sc.helpers.extractURLs(this.$.postTextBox.getValue());
		if (urls.length > 0) {
			//this.$.shortenButton.setActive(true);
			this.$.shortenButton.setDisabled(true);

			var shortener = App.Prefs.get('url-shortener');
			var apiopts = {};

			switch (shortener) {
				case SPAZCORE_SHORTURL_SERVICE_ISGD:
				case SPAZCORE_SHORTURL_SERVICE_GOOGLE:
				case SPAZCORE_SHORTURL_SERVICE_GOLOOKAT:
					break;

				default:
					enyo.log('Unknown shortener: ' + shortener + ', falling back to ' + SPAZCORE_SHORTURL_SERVICE_JMP);
					shortener = SPAZCORE_SHORTURL_SERVICE_JMP;
				case SPAZCORE_SHORTURL_SERVICE_BITLY:
				case SPAZCORE_SHORTURL_SERVICE_JMP:
					apiopts = {
						version:'2.0.1',
						format:'json',
						login: 'spazcore',
						apiKey: 'R_f3b86681a63a6bbefc7d8949fd915f1d'
					};
					break;
			}

			new SpazShortURL(shortener).shorten(urls, {
				apiopts: apiopts,
				onSuccess: enyo.bind(this, function(inData) {
					this.$.postTextBox.setValue(this.$.postTextBox.getValue().replace(inData.longurl, inData.shorturl));
					this.$.postTextBox.focus();
					this.postTextBoxInput();
					//this.$.shortenButton.setActive(false);
					this.$.shortenButton.setDisabled(false);
				}),
				onFailure: enyo.bind(this, function() {
					//this.$.shortenButton.setActive(false);
					this.$.shortenButton.setDisabled(false);
				})
			});
		}
	},

	postTextBoxInput: function(inSender, inEvent, inValue) {
		if (!inValue) inValue = this.$.postTextBox.getValue();
		var remaining = 140 - this.$.postTextBox.getCharCount();
		this.$.sendButton.setRemaining(remaining);
		if (inValue.length != 0) var lastChar = inValue[inValue.length-1];
		else var lastChar = '';
		//dconsole.log(window.autocomplete)
		if (lastChar === ' ' && this.completemode === true) 
			this.$.autocompleteResults.children[0].dispatchBubble('ontap');
		else if (lastChar === ' ') {
			this.$.autocompleteBox.setShowing(false);
			this.$.autocompleteResults.destroyClientControls();
			this.completemode = false;
		} else if (this.completemode === true) {
			//console.log('AUTOCOMPLETEMODE TRUE, SEARCHING...');
			var results = this.autocompleteSearch(inValue);
			//console.log('SEARCH RESULTS:', results);
			this.$.autocompleteResults.destroyClientControls();
			for ( var x in results ) {
				//console.log(results[x])
				var bgc = 'transparent';
				if (parseInt(x) == 0) bgc = 'blue';
				this.$.autocompleteResults.createComponent(
					{content: '@' + results[x], style: 'background-color: ' + bgc + '; margin-left: 10px;', ontap: 'completeUsername'},
					{owner: this}
				);
			}
			this.$.autocompleteResults.render();
		} else if (lastChar === '@' && this.backPressed != true) {
			this.completemode = true;
			//console.log('ACTIVATING AUTOCOMPLETE MODE');
			this.$.autocompleteBox.setShowing(true);
		}
	},
	completeUsername: function(inSender, inEvent) {
		//console.log('COMPLETING AUTOCOMPLETE...', inSender, inEvent);
		var autoUser = inSender.content;
		inValue = this.$.postTextBox.getValue();
		inValue = inValue.substr(0, inValue.lastIndexOf('@'));
		inValue += autoUser;
		this.$.autocompleteBox.setShowing(false);
		this.$.autocompleteResults.destroyClientControls();
		this.completemode = false;
		this.$.postTextBox.setValue(inValue + '&nbsp;');
		this.cursorToEnd();
	},
	autocompleteSearch: function(_v) {
		var results = [];
		var searchString = _v.substr(_v.lastIndexOf('@')).toLowerCase();
		for (var p in window.autocomplete) {
			var autoUser = window.autocomplete[p];
			if (autoUser.toLowerCase().search(searchString.substr(1)) >= 0) results.push(autoUser);
			if (results.length > 4) break;
		}
		return results;
	},


	clear: function() {
		this.$.postTextBox.setValue('');
		this.dmUser = '';
		this.inReplyTweetText = '';
		this.inReplyToId = null;
		this.$.toolbar.setHeader('New Tweet');
		this.postTextBoxInput();
		this.dmUserChanged();
		this.inReplyTweetChanged();
		this.$.postTextBox.blur();
		this.isDM = false;
		this.isRepost = false;
	},

	postTextBoxKeydown: function(inSender, inEvent) {
		this.backPressed = false;
		// RichText.setDisabled(true) doesn't really work, so we'll check
		// if the control is disabled and throw out the event if it is.
		if (inSender.disabled) return inEvent.preventDefault();
		if (inEvent.keyCode === 13 && App.Prefs.get('post-send-on-enter') === true) {
			if (this.$.sendButton.disabled === false) this.onSendClick();
			inEvent.preventDefault();
		} else if (inEvent.keyCode === 8 && this.completemode == true) {
			this.$.autocompleteBox.setShowing(false);
			this.$.autocompleteResults.destroyClientControls();
			this.completemode = false;
			this.backPressed = true;
		}
	},
	postTextBoxFocus: function(s, e) {
		if (s.disabled) s.blur();
	},
	compose: function(opts) {
		this.clear();
		opts = sch.defaults({
			text: null,
			account_id: null
		}, opts);
		if (opts.account_id) this.setPostingAccount(opts.account_id);
		var text = opts.text || '';
		this.clear();
		this.$.postTextBox.setValue(text);
		this.$.postTextBox.focus();
		this.cursorToEnd();
		this.postTextBoxInput();
		this.dmUserChanged();
		this.inReplyTweetChanged();
	},
	replyTo: function(opts) {
		this.clear();
		opts = sch.defaults({
			to: null,
			text: null,
			tweet: null,
			account_id: null,
			all: false
		}, opts);
		var text = '',
			skip_usernames = [];
		if (opts.account_id) this.setPostingAccount(opts.account_id);
		if (opts.tweet) {
			this.inReplyTweetText = opts.tweet.text_raw;
			this.inReplyToId = opts.tweet.service_id;
			if (opts.account_id) skip_usernames.push(App.Users.get(opts.account_id).username);
			skip_usernames.push(opts.tweet.author_username);
			var usernames = sch.extractScreenNames(opts.tweet.text_raw, skip_usernames);
			// get tweet id
			var irt_status_id = opts.tweet.service_id;
			var usernames_str = usernames.join(' @');
			if (usernames_str.length > 0) usernames_str = '@'+usernames_str;
			text = _.clean(['@'+opts.tweet.author_username, usernames_str, opts.text].join(' '));
			//use clean for when usernames_str and/ops.text are blank. We don't want the extra spaces.
		} else if (opts.to) text = '@'+opts.to;
			else text = '@';
		this.$.postTextBox.setValue(text + '&nbsp;'); //add a space at the end.
		this.$.postTextBox.focus();
		this.cursorToEnd();
		this.postTextBoxInput();
		this.dmUserChanged();
		this.inReplyTweetChanged();
	},
	directMessage: function(opts) {
		this.clear();
		this.isDM = true;
		opts = sch.defaults({to:null, text:null, tweet:null, account_id:null}, opts);
		if (opts.account_id) this.setPostingAccount(opts.account_id);
		this.dmUser = opts.to;
		var text = opts.text || '';
		if (opts.tweet) this.inReplyTweetText = opts.tweet.text_raw;
		this.$.postTextBox.setValue(text);
		this.$.postTextBox.focus();
		this.cursorToEnd();
		// try to select the text in order to position the cursor at the end
		var textlen = this.$.postTextBox.getCharCount();
		var selection = {start:textlen-1, end:textlen};
		this.$.postTextBox.setSelection(selection);
		this.postTextBoxInput();
		this.inReplyTweetChanged();
		this.dmUserChanged();
	},
	repost: function(opts) {
		var self = this;
		this.clear();
		this.isRepost = true;
		this.$.toolbar.setHeader('Retweet');
		opts = sch.defaults({
			tweet:null,
			account_id:null
		}, opts);
		if (!opts.tweet || !opts.account_id) {
			sch.error('No account and/or tweet obj set');
			return;
		}
		this.repostTweet = opts.tweet;
		this.setPostingAccount(opts.account_id);
		this.$.inReplyTweetText.show();
		this.$.inReplyTweetText.setContent('<span style="font-weight: bold">@' + opts.tweet.author_username + ':</span> ' + opts.tweet.text);
		this.$.postTextBoxContainer.setShowing(false);
		this.setRepostDisabled(true);
		this.$.sendButton.hide();
		this.$.retweetButton.show();
	},
	repostManual: function(opts) {
		this.show();
		this.clear();
		opts = sch.defaults({
			tweet: null,
			account_id: null
		}, opts);
		var text = opts.tweet.text_raw,
			screenname = opts.tweet.author_username;
		text = 'RT @' + opts.tweet.author_username+' '+opts.tweet.text_raw;
		this.show();
		this.clear();
		this.$.postTextBox.setValue(text);
		this.$.postTextBox.focus();
		this.cursorToEnd();
		this.postTextBoxInput();
		this.dmUserChanged();
		this.inReplyTweetChanged();
		this.setPostingAccount(opts.tweet.account_id);
	},
	quoteMessage: function(opts) {
		this.clear();
		opts = sch.defaults({
			message:null,
			account_id:null
		}, opts);
	},
	setAllDisabled: function(inDisabled) {
		enyo.forEach (this.getComponents(), function(component) {
			if ((component.setDisabled) && (component.getName() !== 'closeButton') && (component.getName() !== 'retweetButton')) 
					component.setDisabled(inDisabled);
		});
	},
	setRepostDisabled: function(inDisabled) {
		enyo.forEach(this.getComponents(), function(component) {
				if ((component.setDisabled) && (component.getName() !== 'closeButton')
					&& (!_.includes(component.getName(), 'accountSelection'))
					&& (component.getName() !== 'sendButton')
					&& (component.getName() !== 'retweetButton'))
				component.setDisabled(inDisabled);
			}
		);
	},
	
	cursorToEnd : function() {
		var _ptb = this.$.postTextBox;
		if (!_ptb.hasNode()) return;
		var val = _ptb.node.innerHTML;
		_ptb.node.blur();
		_ptb.setValue('');
		_ptb.setValue(val);
		_ptb.focus();
		_ptb.moveCursorToEnd();
	},

	cursorToStart : function() {
		var _ptb = this.$.postTextBox;
		if (!_ptb.hasNode()) return;
		var val = _ptb.node.innerHTML;
		_ptb.node.blur();
		_ptb.setValue('');
		_ptb.setValue(val);
		_ptb.focus();
		_ptb.moveCursorToEnd();
	},



	/********************************
	 * pickin files
	 ********************************/
	showFilePicker: function(inSender, inEvent) {
		//FIXME blackberry filepicker
		this.$.filePicker.pickFile();
	},
	fileChosen: function(inSender, msg) {
		this.$.filePicker.hide();
		if (msg && msg[0] && msg[0].fullPath) {
			AppUtils.showBanner($L('Uploading image'));
			this.log('image path:', msg[0].fullPath);
			this.upload(msg[0].fullPath);
		}
	},
	upload: function(_url) {
		var _upl = new SpazImageUploader();
		_upl.setOpts({
			
			auth_obj: AppUtils.getAuthObj(this.$.accountSelection.selected.value),
			
			service: App.Prefs.get('image-uploader') || 'twitpic',
			
			file_url: _url,
			
			extra: {message:
				(this.isDM) ? 'from ' + enyo.fetchAppInfo().title : this.$.postTextBox.getValue()
			},
			
			callback: this.begin
		});
		_upl.upload();
	},
	begin: function(d) {
		this.uploader.go(d);
		this.uploader.response(this, this.uploadSuccess);
	},
	uploadProgress: function(r) {
		enyo.warn(enyo.json.stringify(r));
	},
	uploadSuccess: function(s, r) {
		this.log(this, r)
		var _m = this.$.postTextBox.getValue(),
			_r = JSON.parse(r.responseString);
		if (r.returnValue) return this.ticket = r.ticket;
		else if (r.completed && this.ticket != r.ticket) return this.error('ticket validation failed', this.ticket, r.ticket);
		if (_r.url) {
			if (_m.length > 0) this.$.postTextBox.setValue([_m, _r.url].join(' '));
			else this.$.postTextBox.setValue(_r.url);
			this.postTextBoxInput();
			AppUtils.showBanner('Image uploaded!');
		} else if (_r.error && typeof _r.error === 'string') AppUtils.showBanner('Posting image failed: ' + _r.error);
	},
	uploadFail: function(inResponse) { // onFailure
		AppUtils.showBanner('Posting image FAILED');
		AppUtils.showBanner('Error!');
	}
});

