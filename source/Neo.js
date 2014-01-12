enyo.kind({
	//@* Neo Twitter Client
		name: "Neo",
	//@* layout
		kind: "FittableRows",
		classes: "neo enyo-fit onyx onyx-dark",
		fit: true,

	//@* published
	published: {
		//@* rendered flag. do we even still need this?
			isRendered: false,
		//@* functions we will execute once everything is rendered
			onRendered: [],
		//@* twit.
			twit: new SpazTwit(),
		//@* no idea
			dashWin: null
	},

	//@* app components
	components: [
		{name: "cover", kind: "fx.Fader"},
		{kind:"enyo.Signals", setFullscreen: "setFullscreen", onDeFocus: 'deFocus'},
		{kind: 'Neo.BlackBerryExtention'},

		{kind: "ApplicationEvents", onApplicationRelaunch: "relaunchHandler",
			onWindowActivated:"windowActivated", onWindowDeactivated:"windowDeactivated", onUnload: "unloaded"},

        {name: "main", kind: "Panels", layoutKind: "FittableColumnsLayout",// draggable: true,
        	arrangerKind: "CollapsingArranger", classes: "enyo-fit",// peekWidth: 300,
        	narrowFit: false, components: [

			{name: "sidebar", kind: "Neo.Sidebar", onAccountAdded: "accountAdded",
				onAccountRemoved: "accountRemoved"},
            {name: "container", kind: "Neo.Container",
            	onRefreshAllFinished: "refreshAllFinished"}
        ]},

		{name: "imageViewPopup", kind: "Neo.ImageViewPopup", onClose: "closeImageView"},

		{name: "dashboard", kind: "Dashboard", onTap: "dashboardTap", onIconTap: "iconTap", onMessageTap: "messageTap",
			onUserClose: "dashboardClose", onLayerSwipe: "layerSwiped", appId: null},

		//{name: 'rt', tag: 'input', showing: false}
	],


	create: function() {
		if (console.time) console.time("APPSTART");
		if (console.groupCollapsed) console.groupCollapsed("Neo loading...");

		var self = this, inheritedArgs = arguments;
		//@* don't let KB resize app
			enyo.keyboard.setResizesWindow(false);
		//@* init app object
			this.initAppObject(function() {self.inherited(inheritedArgs)});
		//@* make URL's open in browser
			this.bindGlobalListeners();

		AppUI.addFunction("confirmDeleteTweet", function(inTweet) {
			this.confirmDeleteTweet(this, inTweet);
		}, this);
		AppUI.addFunction("deleteTweet", function(inTweet) {
			this.deleteTweet(this, inTweet);
		}, this);
		AppUI.addFunction("startAutoRefresher", function() {
			if (App.Prefs.get('network-refreshinterval') > 0) {
				enyo.log('Starting auto-refresher', App.Prefs.get('network-refreshinterval'));
				App._refresher = setInterval(function() {
					enyo.log("Auto-refreshing");
					AppUI.refresh();
				}, App.Prefs.get('network-refreshinterval'));
		}}, this);
		AppUI.addFunction("stopAutoRefresher", function() {
			enyo.log("Clearing auto-refresher");
			clearInterval(App._refresher);
		}, this);
		AppUI.addFunction("restartAutoRefresher", function() {
			enyo.log("Restarting auto-refresher");
			AppUI.stopAutoRefresher();
			AppUI.startAutoRefresher();
		}, this);

		AppUI.startAutoRefresher();
		//@* process launch params
			this.processLaunchParams(enyo.windowParams);
		//@* set the dashboard app id????
			this.$.dashboard.appId = enyo.fetchAppInfo().id;
		//@* show a warning if test build
			AppUtils.showTestBuildWarning();
		//@* init filter chain
			this.initFilters();
		//@* done
		this.reflow();

		if (console.groupEnd) console.groupEnd();
		if (console.timeEnd) console.timeEnd("APPSTART");

	},

	windowParamsChangeHandler: function(inParams) {
		AppUtils.showBanner('windowParamsChangeHandler: '+ JSON.stringify(enyo.windowParams));
		AppUtils.showBanner('windowParamsChangeHandler inParams: '+ JSON.stringify(inParams));

    	// capture any parameters associated with this app instance
    		var params = enyo.windowParams;
	},

	//@* application functions

	//@* relaunch
    relaunchHandler: function(inSender, args) {
    	this.processLaunchParams(enyo.windowParams);
		//@* empty the notifications
			this.$.dashboard.setLayers([]);
		//@* load the column if it's a banner *NOT WORKING
		if (args.source == 'banner') this.dashToColumn(args.text);
    },
	//@* window activated
	windowActivated: function() {
		this.windowActive = true;
		//@* empty the notifications
			this.$.dashboard.setLayers([]);
		//@* hide cover
			if (App.Prefs.get('hide-when-minimized')) this.$.cover.hide();
		//@* necessary?
			this.reflow();
	},
	//@* window deactivated
	windowDeactivated: function() {
		this.windowActive = false;
		//@* show the cover
			if (App.Prefs.get('hide-when-minimized')) this.$.cover.show();
		//@* necessary?
			this.reflow();
	},
	//@* app exit
	unloaded: function() {
		//@* close the dashboard
			this.$.dashboard.setLayers([]);
		//@* save data
			this.$.container.saveColumnData();
	},







	//@* launch functions


	//@* creates the app object used everywhere
	initAppObject: function(prefsLoadedCallback) {
		var self = this;
		window.App = {};

		if (SPAZCORE_CONSUMERKEY_TWITTER) SpazAuth.addService(SPAZCORE_ACCOUNT_TWITTER,
			{authType: SPAZCORE_AUTHTYPE_OAUTH,
				consumerKey: SPAZCORE_CONSUMERKEY_TWITTER,
				consumerSecret: SPAZCORE_CONSUMERSECRET_TWITTER,
				accessURL: 'https://twitter.com/oauth/access_token'});
		else console.error('SPAZCORE_CONSUMERKEY_TWITTER not set, will not be able to authenticate against Twitter');

		//@* app prefs object
			App.Prefs = new SpazPrefs(SPAZ_DEFAULT_PREFS, null,
				{'network-refreshinterval': {
					onGet: function(key, value) {
						if (value < 0) value = 0;
						sch.debug(key + ':' + value);
						return value;
					}, onSet: function(key, value) {
						if (value < 0) value = 0;
						sch.debug(key + ':' + value);
						return value;
			}}});
		//@* load app prefs
			App.Prefs.load(function() {
				App.Users = new SpazAccounts(App.Prefs);
				prefsLoadedCallback();
			});
		//@* init app cache
		this.initAppCache();
	},
	//@* init app cache
	//@* why is this a function?
	initAppCache: function() {
		App.Cache = {EntriesHTML : new Cache(750)}
	},
	//@* launch params
	processLaunchParams: function(inParams) {
		if (inParams.tweet) {inParams.action = 'prepPost';inParams.msg = inParams.tweet}
		if (inParams.user) {inParams.action = 'user';inParams.userid = inParams.user}
		if (!inParams.account)
			{var acc_id = this.getLaunchParamsAccount(inParams);if (acc_id) inParams.account = acc_id}

		//enyo.log("processing launch params...", enyo.json.stringify(inParams));
		switch (inParams.action) {
			case 'prepPost': case 'post':
				var postfunc = enyo.bind(function(){AppUI.compose(inParams.msg, inParams.account)}, this);
				if (this.isRendered === false) this.onRendered.push(postfunc);
					else postfunc();
				break;
			case 'search':
				var searchfunc = enyo.bind(function()
					{AppUI.search(decodeURI(inParams.query), inParams.account)}, this);
				if (this.isRendered === false) this.onRendered.push(searchfunc);
					else searchfunc();
				break;
			case 'bgcheck':
				var refreshfunc = enyo.bind(function() {AppUI.refresh()}, this);
				if (this.isRendered === false) this.onRendered.push(refreshfunc);
					else refreshfunc();
				break;
			case 'relaunch':
				this.warn("app relaunched...");
				break;
		}
	},
	//@* get launch params account
	getLaunchParamsAccount: function(inParams) {
		if (!inParams.account) { var rs;
			if (inParams.username && inParams.service) rs = App.Users.getByUsernameAndType(inParams.username, inParams.service)[0];
				else if (inParams.username) rs = App.Users.getByUsername(inParams.username)[0];
				else if (inParams.service) rs = App.Users.getByType(inParams.service)[0];
					else rs = App.Users.getAll()[0];
			if (rs) return rs.id; else return null;
		} else return inParams.account;
	},
	//@* make sure taps open in the browser, as if it doesn't already do this.....
	bindGlobalListeners: function() {
		$('a[href]').live('click', function(e) {
			sc.helpers.openInBrowser(this.getAttribute('href'));
			event.preventDefault();
			return false;
		});
	},
	//@* do stuff on app rendered
	rendered: function() {
		var r = this.inherited(arguments);
		//@* only loop if necessary
		if (this.onRendered.length > 0)
			enyo.forEach(this.onRendered, function(_call) {_call.call()}, this);
		this.setOnRendered([]);
		this.isRendered = true;
		return r
	},






	//@* neo functions


	//@* public
	//@* called from signals
	setFullscreen: function(inSender, fullscreen) {
		this.$.main.setDraggable(!fullscreen.fs);
		this.$.main.setIndex(fullscreen.fs ? 1 : 0);
	},
	//@* open image view
	showImageView: function(inSender, inUrls, inIndex) {
		this.$.imageViewPopup.open();
		this.$.imageViewPopup.setImages(inUrls, inIndex);
	},
	//@* close image view
	closeImageView: function(inSender) {
		this.$.imageViewPopup.close();
	},





	//@* accounts

	//@* private
	//@* account added, bubbled from accountspopup
	accountAdded: function(inAccountId) {
		console.log("account added....", inAccountId);
		//@* check users
			this.$.container.checkForUsers();
		//@* make space in localstorage
			App.Prefs.set("columns_" + inAccountId, null);
		//@* if only account, load it
			if(App.Users.getAll().length == 1) App.Prefs.set("currentUser", inAccountId);
		//@* refresh
			AppUI.reloadColumns();
			AppUI.rerenderTimelines();
	},
	//@* private
	//@* account deletion, bubbled from accountspopup
	accountRemoved: function(inAccountId) {
		//@* check users
			this.$.container.checkForUsers();
		//@* remove account data
		App.Prefs.set("columns_" + inAccountId, null);
		if (inAccountId == App.Prefs.get("currentUser")) App.Prefs.set("currentUser", null);
		AppUI.refresh();
	},





	//@* container functions
	//@* we don't need half of these. these should basically be moved into container

	//@* refreshAllFinished
	refreshAllFinished: function() {
		this.$.sidebar.refreshAllFinished();
	},
	//@* open detail pane
	showDetailPane: function() {
		AppUI.showMore("detailContent");
	},





	//@* dashboard functions

	//@* public
	//@* called from appui
	//@* adds a new dashboard to the stack
	pushDashboard: function(inIcon, inTitle, inText) {
		this.dashWin = this.$.dashboard.push({icon: "icon_48.png", title:inTitle, text:inText});
	},
	//@* public
	//@* called from appui
	//@* pops the current item in the dashboard
	popDashboard: function() {
		this.$.dashboard.pop();
	},
	//@* private
	//@* when dashboard is closed
	dashboardClose: function(inSender) {
		enyo.log("Closed dashboard.");
	},
	//@* private
	//@* called when a dashboard layer is swiped away
	layerSwiped: function(inSender, layer) {
		enyo.log("Swiped layer: "+layer.text);
	},
	//@* private
	//@* called when tap on dashboard
	dashboardTap: function(inSender, layer) {
		AppUtils.relaunch('dashboard', this.$.dashboard.appInfo);
	},
	//@* private
	//@* called when tap on dashboard message
	messageTap: function(inSender, layer) {
		enyo.log("Tapped on message: "+layer.text);
		this.dashToColumn(layer.text);
	},
	//@* private
	//@* called when tap on dashboard icon
	iconTap: function(inSender, layer) {
		enyo.log("Tapped on icon for message: "+layer.text);
		this.dashToColumn(layer.text);
	},
	//@* private
	//@* loads a column when dashboard is tapped
	dashToColumn: function(dash) {
		var toLoad = "Timeline";
		if (dash.search("tweet") >= 0) toLoad = "Timeline";
		if (dash.search("private") >= 0) toLoad = "Messages";
		if (dash.search("mention") >= 0) toLoad = "Mentions";
		if (dash.search("search") >= 0) toLoad = "Search";
		AppUI.loadColumn(toLoad);
	},






	//@* tweet deletion

	//@* public
	//@* deletes a tweet
	//@* called from event..?
	deleteTweet: function(inSender, inTweet) {
		var account = App.Users.get(inTweet.account_id),
			auth = new SpazAuth(account.type),
			twit = new SpazTwit();

		auth.load(account.auth);
		twit.setBaseURLByService(account.type);
		twit.setSource(App.Prefs.get('twitter-source'));
		twit.setCredentials(auth);

		if (inTweet.is_private_message)
			twit.destroyDirectMessage(inTweet.service_id, function(data) {
				AppUI.removeTweetById(inTweet.service_id);
				AppUtils.showBanner("Deleted message");
			}, function() {AppUtils.showBanner("Error deleting message")});
		else if (inTweet.is_author)
			twit.destroy(inTweet.service_id, function(data) {
				AppUI.removeTweetById(inTweet.service_id);
				AppUtils.showBanner("Deleted tweet");
			}, function() {AppUtils.showBanner("Error deleting tweet")});
	},
	//@* private
	confirmDeleteTweet: function(inSender, inTweet) {
		this.tweetToDelete = inTweet;

		this.tweetAlert = alert("Delete tweet?", this, {
			onConfirm: this.confirmTweetDeletion.bind(this),
			onCancel: this.cancelTweetDeletion.bind(this),
			confirmText: "Delete",
			cancelText: "Cancel"
		});
	},
	//@* private
	cancelTweetDeletion: function(inSender) {
		this.tweetAlert.destroy();
		this.tweetToDelete = null;
	},
	//@* private
	confirmTweetDeletion: function(inSender) {
		this.tweetAlert.destroy();
		delete this.tweetAlert;
		if (this.tweetToDelete) {
			AppUI.deleteTweet(this.tweetToDelete);
			this.tweetToDelete = null;
		}
	},

	//@* filters
	initFilters: function() {
		var _fz = App.Prefs.get('filters');
		enyo.forEach(_fz, function(_f) {
			if (_f.persist == true) window._filter_chain.addFilter(_f.text, window._filter_chain._neo_filter);
		}, this);
		this.log(window._filter_chain);
		enyo.Signals.send("updateUnread", {
			title: 'filters',
			unread: window._filter_chain._filters.length
		});
	},

	//@* hides keyboard
	deFocus: function(inSender, inSignal) {
		if (AppUtils.getPlatform() == SPAZCORE_PLATFORM_WEBOS) return true;
		this.createComponent({name: 'rt', tag: 'input'}, {owner: this}).render();
		this.$.rt.node.focus();
		this.$.rt.node.blur();
		this.$.rt.destroy();
		return true;
	}
});
copy = function(o) {
	var n = {};
	for (var r in o) try {
		var s = JSON.stringify(o[r]);
		if (!(o[r].$) && r != "originator" && r != "flyweight") n[r] = JSON.parse(s);
			else delete o[r];
	} catch (e) {
		if (o[r] && !(o[r].$)) n[r] = copy(o[r]);
			else delete o[r];
	}
	return n;
};
