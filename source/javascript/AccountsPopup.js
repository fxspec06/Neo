enyo.kind({
	name: "Neo.AccountsPopup",
	kind: "FittableRows",
	fit: true,

	events: {
		onClose: "",
		onAccountAdded: "",
		onAccountRemoved: ""
	},

	components: [
		{name: "toolbar", kind: "Neo.Toolbar", header: "Accounts", closeable: true, left: [
			{name: "backButton", kind: "Neo.Button", text: "Back", showing: false, ontap: "goTopLevel", icon: "back"}
		]},
		{name: "content", layoutKind: "FittableRowsLayout", fit: true},
		{name: "toolbarBottom", kind: "Neo.Toolbar", middle: [
			{name: "addButton", kind: "Neo.Button", text: "New", ontap: "newAccount", icon: "io"},
			{name: "removeButton", kind: "Neo.Button", ontap: "promptRemoveAccount", text: "Delete", showing:false, icon: 'delete'},
			{name: "cancelButton", kind: "Neo.Button", ontap: "goTopLevel", text: "Cancel",
				showing: false, blue: false, classes: "onyx-negative", icon: 'cancel'},
			{name: "saveButton", kind: "Neo.Button", disabled: true, showing: false,
				text: "Save", blue: false, classes: "onyx-affirmative",
				ontap: "saveTwitterAccount", icon: "save"},
			{name: "cancelRemoveAccount", kind: "Neo.Button", text: "Cancel", ontap: "goBackToViewAccount", icon: 'cancel'},
			{name: "removeAccount", kind: "Neo.Button", text: "Are you sure?", ontap: "removeAccount", blue: false, classes: "onyx-negative", icon: 'delete'}
		]}
	],
	oauth: null,
	create: function() {
		this.inherited(arguments);
	},
	reset: function() {
		if (this.$.richText) this.$.richText.blur();
		this.goTopLevel();
	},
	hideAllToolbuttons: function(){
		enyo.forEach(this.$.toolbarBottom.$.middle.children, function(button){
			button.hide();
		}.bind(this));
		this.$.backButton.hide();
	},
	goTopLevel: function(inSender, InEvent){
		this.editing_acc_id = null;
		this.$.toolbar.setHeader("Accounts");
		this.hideAllToolbuttons();
		this.$.addButton.show();
		this.$.content.destroyClientControls();
		this.$.content.createComponent(
			{name: "accountsList", kind: "Neo.AccountsList", fit: true, onAccountClick: "viewAccountFromListTap"},
			{owner: this});
		// rebuild the accounts array
		this.$.accountsList.buildAccounts();
		this.render();
		this.reflow();
	},
	goDownLevel: function(inId) {
		var label;
		this.hideAllToolbuttons();
		if (inId === "new") {
			label = "New";
			this.$.cancelButton.show();
			this.$.saveButton.show();
		} else {
			label = "@" + App.Users.get(inId).username;
			this.$.removeButton.show();
		}
		this.$.toolbar.setHeader(label);
		if (this.$.accountsList)this.$.accountsList.destroy();
	},
	viewAccountFromListTap: function(inSender, inEvent) {
		this.viewAccount(this.$.accountsList.accounts[inEvent.index].id);
	},
	viewAccount: function(account_id) {
		this.editing_acc_id = account_id;
		this.goDownLevel(account_id);
		var account = App.Users.get(account_id);
		if (this.$.secondLevel) this.$.secondLevel.destroy();
		this.$.content.createComponents([ //this looks pretty bad. need to figure out what to display.
			{name: "secondLevel", kind: "FittableRows", components: [
				{name: "accountInfo", kind: "onyx.Item", classes: "highlightable",
					style: "box-shadow:inset 0px 0px 8px rgba(0,0,0,0.7);", tapHighlight:true,
					ontap: "viewProfile", layoutKind: "FittableColumnsLayout", owner: this, components: [

						{name: "spinner", style: "width: 50px", style: "height: 55px", owner: this, components: [
							{name: "innerSpinner", kind: "onyx.Spinner", style: "margin: auto;", showing: true},
						]},
						{name: "avatar", kind: "Image",
							style: "width:50px; height:50px; box-shadow:0px 0px 8px rgba(0,0,0,0.7);",
							classes: "avatar", showing: false, owner: this},

						{style:"width: 10px"},
						{kind: "FittableRows", fit: true, style: "height: 50px;", components: [
							{name: "realname", fit: true, style: "font-weight: bold", content: account.username, owner: this},
							{name: "username", fit: true, classes: "link", content: "@" + account.username}
						]}
				]}
			]}
		]);
		this.$.removeButton.show();
		this.$.backButton.show();
		this.$.toolbar.render();
		this.$.toolbar.reflow();
		AppUtils.getAccount(account_id, enyo.bind(this,
			function(user){
				this.$.realname.setContent(user.name);
				this.$.avatar.show();
				this.$.avatar.setSrc(user.profile_image_url);
				this.$.spinner.setShowing(false);
				this.$.innerSpinner.setShowing(false);
			}),
			function(xhr, msg, exc){
				console.error("Couldn't find user's avatar");
			}
		);
		this.render();
	},
	changeCredentials: function(inSender, inEvent){
		this.createAccountEditComponents(App.Users.get(inSender.account_id));
	},
	newAccount: function(inSender, inEvent){
		this.goDownLevel("new");
		this.createAccountEditComponents();
	},
	changeService: function(inSender){
		this.createAccountEditComponents();
	},
	createAccountEditComponents: function(accountObject) {
		if (this.$.secondLevel) this.$.secondLevel.destroy();
		this.$.content.createComponents([
			{name: "secondLevel", style: "text-align:center", kind: "FittableRows", components: [
				{kind: "FittableRows", components: [
					{tag:"br"},{tag:"br"},{tag:"br"},
					{name: 'getTwitterAuthButton', kind: "Neo.Button", text: "Get PIN", ontap: "getTwitterPinAuthorization", icon: 'import'},
					{kind: "onyx.InputDecorator", style:"background-color:white; margin:10px;", components: [
						{name: "twitterPinInput", kind: "onyx.Input", oninput:"inputChanging", placeholder: "Enter PIN"},
						{kind: 'Neo.Icon', icon: 'key', _col: 'black/'}
					]},
					{name: 'tokenMsg', style: 'color: red; font-weight: bold'}
				]}
			]}
		], {owner: this});
		this.render();
		if (accountObject) {
			this.editing_acc_id = accountObject.id;
			this.$.username.setValue(accountObject.username);
			this.$.password.show();
			this.$.type.setValue(accountObject.type);
			if (accountObject.type === SPAZCORE_SERVICE_CUSTOM) {
				this.$.api_base_url.show();
				this.$.api_base_url.setValue(App.Users.getMeta(accountObject.id, 'twitter-api-base-url'));
			} else this.$.api_base_url.setShowing(false);
		} else this.editing_acc_id = null;
	},
	getTwitterPinAuthorization: function(inSender, inEvent){

		if (!SPAZCORE_CONSUMERKEY_TWITTER) {
			console.error('SPAZCORE_CONSUMERKEY_TWITTER not set, will not be able to authenticate against Twitter');
			AppUtils.showBanner($L('SPAZCORE_CONSUMERKEY_TWITTER not set, will not be able to authenticate against Twitter'));
			return;
		}

		this.oauth = OAuth({
			'consumerKey':SPAZCORE_CONSUMERKEY_TWITTER,
			'consumerSecret':SPAZCORE_CONSUMERSECRET_TWITTER,
			'requestTokenUrl':'https://twitter.com/oauth/request_token',
			'authorizationUrl':'https://twitter.com/oauth/authorize',
			'accessTokenUrl':'https://twitter.com/oauth/access_token',
		});

		//AppUtils.showBanner($L('Getting Request Token from Twitter'));

		//launch browser.
		this.$.getTwitterAuthButton.setActive(true);
		this.$.getTwitterAuthButton.setDisabled(true);

		this.oauth.fetchRequestToken(_.bind(function(url) {
				this.$.getTwitterAuthButton.setActive(false);
				this.$.getTwitterAuthButton.setDisabled(false);
				this.$.tokenMsg.applyStyle('color', 'green');
				this.$.tokenMsg.setContent('Got tokens, enter key to continue..');
				this.authwindow = sc.helpers.openInBrowser(url);//, 'authorize');
			}, this),
			_.bind(function(data) {
				this.$.getTwitterAuthButton.setActive(false);
				this.$.getTwitterAuthButton.setDisabled(false);
				this.$.tokenMsg.applyStyle('color', 'red');
				this.$.tokenMsg.setContent('Token request failed.');
				AppUtils.showBanner($L('Problem getting Request Token from Twitter'));
				console.error('ERROR: ', data, JSON.stringify(data));
			}, this)
		);
		inSender.setActive(false);
	},
	saveTwitterAccount: function(inSender, inEvent) {
		var self = this;

		var type = SPAZCORE_SERVICE_TWITTER; //@FIXME: this.$.type.getValue();
		var api_base_url = (this.$.api_base_url) ? this.$.api_base_url.getValue() : null;
		var pin = this.$.twitterPinInput.getValue();


		if (pin && this.oauth) {
			this.oauth.setVerifier(pin);

			this.$.saveButton.setActive(true);
			this.$.saveButton.setDisabled(true);

			this.oauth.fetchAccessToken(function(data) {
					var qvars = AppUtils.getQueryVars(data.text);
					var auth_pickle = qvars.screen_name+':'+qvars.oauth_token+':'+qvars.oauth_token_secret;
					if (this.editing_acc_id) { // edit existing
						this.editing_acc_id = null;
					} else { // add new
						var newaccid = App.Users.add(qvars.screen_name.toLowerCase(), auth_pickle, type);
						App.Users.setMeta(newaccid, 'twitter-api-base-url', api_base_url);
					}
					self.$.saveButton.setActive(false);
					self.$.saveButton.setDisabled(false);
					self.goTopLevel(); //this re-renders the accounts list.

					neoapp.accountAdded(newaccid ? newaccid.id : null);
					//self.doAccountAdded({}, newaccid ? newaccid.id : null);

					if (App.Users.getAll().length === 1) self.doClose();
				},
				function(data) {
					AppUtils.showBanner($L('Problem getting access token from Twitter; must re-authorize'));
					if (self.authwindow) self.authwindow.close();
					self.$.twitterPinInput.setValue('');
					self.$.getTwitterAuthButton.setText('Try Again');
					self.$.getTwitterAuthButton.setActive(false);
					self.$.saveButton.setActive(false);
					self.$.saveButton.setDisabled(false);
				}
			);
		} else AppUtils.showBanner($L("You must log in enter the PIN you are given to continue", 3000));
	},
	saveAccount: function(inSender, inEvent) {
		var self = this,
			type = SPAZCORE_SERVICE_TWITTER,
			username = this.$.username.getValue(),
			password = this.$.password.getValue(),
			api_base_url = (this.$.api_base_url) ? this.$.api_base_url.getValue() : null,
			twit = new SpazTwit(),
			dupAcct = false,
			allUsers = App.Users.getAll();

		//@* prevent dupes
		for (var i = 0; i < allUsers.length; i++) if ((username == allUsers[i].username) && (type == allUsers[i].type)) dupAcct = true;

		if (dupAcct) {
			self.$.saveButton.setActive(false);
			self.$.saveButton.setDisabled(false);
			AppUtils.showBanner($L('Add account failed!<br>Reason: duplicate'));
		}

		//@* now verify credentials against the Service API
		if (username && password && !dupAcct) {
			twit.setBaseURL(api_base_url);

			var auth  = new SpazAuth(type);

			sch.error('authorizing…');

			self.$.saveButton.setActive(true);
			self.$.saveButton.setDisabled(true);
			auth.authorize(username, password, function(result) {
					if (result) {
						var auth_pickle = auth.save();
						sch.error('auth_pickle:');
						sch.error(auth_pickle);
						if (this.editing_acc_id) this.editing_acc_id = null;
						else { // add new
							var newaccid = App.Users.add(username.toLowerCase(), auth_pickle, type);
							App.Users.setMeta(newaccid, 'twitter-api-base-url', api_base_url);
						}
						self.$.saveButton.setActive(false);
						self.$.saveButton.setDisabled(false);
						self.goTopLevel();
						neoapp.accountAdded(newaccid ? newaccid.id : null);
						if (App.Users.getAll().length === 1) self.doClose();
					} else {
						self.$.saveButton.setActive(false);
						self.$.saveButton.setDisabled(false);
						AppUtils.showBanner('Verification failed!');
					}
			});
		}
	},
	inputChanging: function() {
		this.$.saveButton.setDisabled(Util.isEmpty(this.$.twitterPinInput.getValue()));
	},
	promptRemoveAccount: function(inSender, inEvent) {
		this.hideAllToolbuttons();
		this.$.cancelRemoveAccount.show();
		this.$.removeAccount.show();
	},
	removeAccount: function(inSender, inEvent) {
		App.Users.remove(this.editing_acc_id);
		neoapp.accountRemoved(this.editing_acc_id);
		this.editing_acc_id = null;
		this.goTopLevel();
	},
	viewProfile: function(inSender, inEvent) {
		var user = App.Users.get(this.editing_acc_id);
		AppUI.viewUser(user.username, user.type, this.editing_acc_id);
		this.doClose();
	},
	goBackToViewAccount: function(inSender, inEvent) {
		var id = this.editing_acc_id;
		this.goTopLevel();
		this.viewAccount(id);
	},
});
