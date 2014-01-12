enyo.kind({
	name: 'Neo.BlackBerryExtention',


	//@* FIVE NEEDED FUNCTIONS:
		//	fileTransfer: function(filepath, url, params, success, failure)
		//	filePicker: function(success, cancelled, failure)
		//	launchBrowser: function(URL)
		//	email: function(target, subject, message)
		//	notify: function(title)

	published: {
		notification: ''
	},

	components: [
		{kind: 'enyo.Signals', onNotify: 'notify', onLaunchBrowser: 'launchBrowser'},
	],

	create: function() {
		this.inherited(arguments);
		console.log('loading Neo BlackBerry Extentions...');
		if (typeof blackberry != 'undefined') console.log('adding invoked listener..') && blackberry.event.addEventListener("invoked", this.appRelaunched);
		else console.warn('blackberry is undefined...');
	},

	//@* private event
	//@* called on blackberry relaunch
	//@* Handle invoked event
	appRelaunched: function(onInvokedInfo) {
		this.error('CATCHING BLACKBERRY NOTIFICATION TAP...');
		this.log(onInvokedInfo);
		// Do something if the action is "BB.action.DoSomethingForNotification"
		if (onInvokedInfo.action == 'relaunch') {
			doSomething(onInvokedInfo.uri);
			// onInvokedInfo.uri is "some link"
		}
	},

	//@* simple notification
	notify: function(title) {
		// Create the simplest notification
  		this.notification = new Notification(title);
	},

	//@* email function
	email: function(target, subject, message) {
		var args = new blackberry.invoke.MessageArguments(target || 'fxjmapps@gmail.com', subject || ("Neo: Twitter for BlackBerry v" + enyo.fetchAppRootPath()), message || 'I love Neo.');
		args.view = blackberry.invoke.MessageArguments.VIEW_NEW;
		blackberry.invoke.invoke(blackberry.invoke.APP_MESSAGES, args);
	},

	//@* launch browser
	launchBrowser: function(inSender, inSignal) {
		if (inSignal != null) var URL = inSignal.url;
		else var URL = inSender;

		console.log('LAUNCHING BROWSER.....', URL);
		if (typeof blackberry != 'undefined')
			blackberry.invoke.invoke(
				blackberry.invoke.APP_BROWSER,
				new blackberry.invoke.BrowserArguments(URL)
			);
		else sc.helpers.openInBrowser(URL);
	},

	//@* image upload stuff
	filePicker: function(success, cancelled, failure) {
		blackberry.invoke.card.invokeFilePicker({
			  title: 'Neo: Image Upload',
          	mode: blackberry.invoke.card.FILEPICKER_MODE_PICKER,
          	type: [blackberry.invoke.card.FILEPICKER_TYPE_PICTURE],
          	successCallback: success || this.onSuccess.bind(this),
			errorCallback: failure  || this.onError.bind(this)
		});
	},
	fileTransfer: function(filepath, url, params, success, failure) {
		var options = {
			params: params
		}
		blackberry.io.filetransfer.upload({
			filePath: filepath,
			server: url,
			options: options,
			successCallback: success || this.onSuccess.bind(this),
			errorCallback: failure  || this.onError.bind(this)
		});
	},
	onSuccess: function(info) {
		this.error('UPLOAD SUCCESS!', info);
	},
	onError: function(info) {
		this.error('UPLOAD FAILED!', info);
	},





	notifyInfo: function(title, info) {
		if (!title) return;
		if (!info.payloadURI) info.payloadURI = 'relaunch';
		new Notification(title, info);
	},
	notifyEvent: function(title, body, success, failure) {
		if (!success || !title) return;
		// Create a notification with events
		var n = new Notification(title, {body: body || 'Notification brought to you by: Neo',
			onshow: success, onerror: failure});
	},
	notifyApp: function(title, app, action, type, URI) {
		if (!title) return;
		// Create a notification with invocation information that invokes other application
		//var title = "A notification will invoke browser";
		var options = {
			target: app || "sys.browser",
			targetAction: action || "bb.action.OPEN",
			payloadType: type || "text/html",
			payloadURI: URI || "the link"
		}
		// Create the notification
		// and when the user opens the notification item in UIB, it will invoke browser with "the link"
		new Notification(title, options);
	},

});
