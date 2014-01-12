if (!window.AppUtils) { window.AppUtils = {}; }

/**
 * define a placeholder $L() method to handle future localization
 */
if (!window.$L) {
	var $L = function(str) {
		return str;
	};
}

var SPAZ_DEFAULT_APPID = 'com.fxjm.neo';

AppUtils.getAppObj = function() {
	return window.App;
};


/**
 * converts various items in a timeline tweet's text into clickables
 * @param {string} str
 * @return {string}
 */
AppUtils.makeItemsClickable = function(str) {

	str = sch.autolink(str, null, null, 20);
	str = sch.autolinkTwitterScreenname(str, '<span class="username clickable" data-user-screen_name="#username#">@#username#</span>');
	str = sch.autolinkTwitterHashtag(str, '<span class="hashtag clickable" data-hashtag="#hashtag#">##hashtag#</span>');


	return str;
};



AppUtils.applyTweetTextFilters = function(str) {
	if (!str) { return str; }

	if (!App.tweetOutputFilters) {
		App.tweetOutputFilters = new SpazFilterChain({filters:SpazDefaultTextFilters});
	}

	return App.tweetOutputFilters.process(str);
};


AppUtils.showTestBuildWarning = function() {

	var appinfo = enyo.fetchAppInfo();
	if (!appinfo || !appinfo.testBuild) {
		return;
	}

	AppUtils.showBanner(
		$L('This is a TEST BUILD of Neo. It has bugs. It may not operate properly. It may insult you or your family. BE AWARE.'),
		4000
	);

};



/**
 * @TODO can we make this generic, working on all systems?
 *
 * preps an email and opens the compose email scene in the email app
 *
 * the opts object passed should be of a format like:
 * {
 *	account:{integer, optional},
 *	attachments:{array of file paths, optional},
 *	subject:{string, optional},
 *	msg:{string, optional},
 *	to:{array of email addresses},
 *	cc:{array of email addresses},
 *	bcc:{array of email addresses}
 * }
 *
 * @param {object} opts
 *
 */
AppUtils.sendEmail = function(opts) {


	function makeRecipientObj(address, type, contactDisplay) {
		var to_role	 = 1;
		var cc_role	 = 2;
		var bcc_role = 3;

		var role = null;

		switch(type) {
			case 'to':
				role = to_role;
				break;
			case 'cc':
				role = cc_role;
				break;
			case 'bcc':
				role = bcc_role;
				break;
			default:
				role = to_role;
		}

		var re_obj = {
			'contactDisplay': contactDisplay,
			'role' :role,
			'value':address,
			'type' :'email'
		};

		return re_obj;
	}

	var to_addresses  = opts.to	 || null;
	var cc_addresses  = opts.cc	 || null;
	var bcc_addresses = opts.bcc || null;

	var recipients = [];

	var i;
	if (to_addresses) {
		for (i=0; i < to_addresses.length; i++) {
			recipients.push( makeRecipientObj(to_addresses[i].address, 'to', to_addresses[i].name) );
		}
	}

	if (cc_addresses) {
		for (i=0; i < cc_addresses.length; i++) {
			recipients.push( makeRecipientObj(cc_addresses[i].address, 'cc', cc_addresses[i].name) );
		}
	}

	if (bcc_addresses) {
		for (i=0; i < bcc_addresses.length; i++) {
			recipients.push( makeRecipientObj(bcc_addresses[i].address, 'bcc', bcc_addresses[i].name) );
		}
	}

	var account		= opts.account	   || null; // an integer or null
	var attachments = opts.attachments || null; // an array or null
	var summary		= opts.subject	   || null; // a string or null
	var text		= opts.msg		   || null; // a string or null


	var email_params = {
		'account':account,
		'attachments':attachments,
		'recipients':recipients,
		'summary':summary,
		'text':text
	};
	
	var email_srvc = new enyo.webOS.ServiceRequest({
		service: 'palm://com.palm.applicationManager',
		method: 'open'
	});
	email_srvc.go({
		id: "com.palm.app.email",
		params: email_params
	});
	email_srvc.response(function(inResponse){
		enyo.log("email service response...", enyo.json.stringify(inResponse));
	});
};


AppUtils.emailTweet = function(tweetobj) {
	var message = "@" + tweetobj.author_username + ":<br><br>"
				+ sch.autolink(tweetobj.text_raw) + "<br><br>"
				+ sch.autolink("sent with Neo")+"\n\n";
	AppUtils.sendEmail({
		msg: message,
		subject: "@" + tweetobj.author_username + " - Neo"
	});
};


AppUtils.SMSTweet = function(tweetobj) {
	var message = "@" + tweetobj.author_username + ": " + tweetobj.text_raw + " "
				+ " - Neo";
	
	var sms_srvc = new enyo.webOS.ServiceRequest({
		service: 'palm://com.palm.applicationManager',
		method: 'open'
	});
	sms_srvc.go({
		id: "com.palm.app.messaging",
		params: {
			compose: {
				messageText: message
			}
		}
	});
	sms_srvc.response(function(inResponse){
		enyo.log("sms service response...", enyo.json.stringify(inResponse));
	});
};


AppUtils.copyTweet = function(tweetobj) {
    //enyo.dom.setClipboard(tweetobj.text);
    
    enyo.keyboard.suspend();
    
    var inText = tweetobj.text;
    
	if (!neoapp._clipboardTextArea)
		neoapp.createComponent({kind: "onyx.RichText", name: "_clipboardTextArea"});
	
	var _cb = neoapp.$._clipboardTextArea;
	_cb.render();
	_cb.node.blur();
	_cb.setValue('');
	_cb.setValue(inText);
	_cb.focus();
	_cb.selectAll();
	console.log(document.getSelection());
	document.execCommand("cut");
	
	
	AppUtils.showBanner("Post copied to clipboard");
	_cb.destroy();
	
	enyo.keyboard.resume();
};



AppUtils.relaunch = function(from, appid) {
	if (!from) { from = 'default'; }

	if (!appid) appid = enyo.fetchAppInfo().id;

	var app_srvc = new enyo.webOS.ServiceRequest({
		service: 'palm://com.palm.applicationManager',
		method: 'launch'
	});
	app_srvc.go({
		id: appid,
		params: {'action':'relaunch', 'from':'notification'},
		subscribe: true
	});
	app_srvc.response(function(inResponse){
		enyo.log("app relaunch response...", enyo.json.stringify(inResponse));
	});
};



/**
 * Given a theme label, deactivates all themes CSS and activates the chosen theme CSS
 */
AppUtils.setTheme = function(theme) {
	console.error('AppThemes: %j', AppThemes);
	console.error('theme: %s', theme);
	console.error('AppThemes[theme]: %j', AppThemes[theme]);

	if (AppThemes && AppThemes[theme]) {

		if (AppThemes[theme].palmtheme == 'dark') {
			jQuery('body').addClass('palm-dark');
		} else {
			jQuery('body').removeClass('palm-dark');
		}

		jQuery('link[title="apptheme"]').attr('href', 'stylesheets/'+AppThemes[theme].stylesheet);
	}
};



/**
 * Given a time value and a set of labels, returns a relative or absolute time
 */
AppUtils.getFancyTime = function(time_value, labels, use_dateparse) {

	if (sc.helpers.iswebOS() && App.Prefs.get('timeline-absolute-timestamps')) {

		if (use_dateparse === true) {
			parsed_date = new Date.parse(time_value);
		} else {
			parsed_date = new Date(time_value);
		}

		var now = new Date();
		var delta = parseInt( (now.getTime() - parsed_date.getTime()) / 1000, 10);

		if(delta < (24*60*60)) {
			return Mojo.Format.formatDate(parsed_date, {time: 'short'});
		} else {
			return Mojo.Format.formatDate(parsed_date, 'short');
		}

	} else {

		return sch.getRelativeTime(time_value, labels, use_dateparse);

	}
};


/**
 * Get the avatar image URL for the given account_id.
 */
AppUtils.getAccountAvatar = function(account_id, onSuccess, onFailure) {

	if (!window.App.avatarCache) {
		window.App.avatarCache = {};
	}

	if (window.App.avatarCache[account_id]) {
		onSuccess(window.App.avatarCache[account_id]);
		return;
	}

	var twit = AppUtils.makeTwitObj(account_id);
	var username = App.Users.get(account_id).username;

	enyo.log(username);

	twit.getUser(
		'@'+username,
		function(data) {
			var av_url = data.profile_image_url;
			window.App.avatarCache[account_id] = av_url;
			onSuccess(av_url);
		}, function(xhr, msg, exc) {
			onFailure(xhr, msg, exc);
		}
	);

};

AppUtils.getAccount = function(account_id, onSuccess, onFailure) {

	if (!window.App.avatarCache) {
		window.App.avatarCache = {};
	}
	/* @TODO: cache?

	if (window.App.avatarCache[account_id]) {
		onSuccess(window.App.avatarCache[account_id]);
		return;
	}
	*/

	var twit = AppUtils.makeTwitObj(account_id);
	var username = App.Users.get(account_id).username;

	enyo.log(username);

	twit.getUser(
		'@'+username,
		function(data) {
			window.App.avatarCache[account_id] = data.profile_image_url; //cache the avatar here for now.
			onSuccess(data);
		}, function(xhr, msg, exc) {
			onFailure(xhr, msg, exc);
		}
	);

};


/**
 * Retrieves the custom API url for the current account, or the account with the passed id
 */
AppUtils.getCustomAPIUrl = function(account_id) {

	var custom_api_url = App.Users.getMeta(account_id, 'twitter-api-base-url');
	if (!custom_api_url) {
		// used to be called api-url, so try that
		custom_api_url = App.Users.getMeta(account_id, 'api-url');
	}
	return custom_api_url;
};



AppUtils.makeTwitObj = function(account_id) {

	var twit = new SpazTwit({
		'timeout':1000*60
	});
	twit.setSource(App.Prefs.get('twitter-source'));

	var auth;
	if (account_id) {
		if ( (auth = App.Users.getAuthObject(account_id)) ) {
			twit.setCredentials(auth);
			if (App.Users.getType(account_id) === SPAZCORE_ACCOUNT_CUSTOM) {
				twit.setBaseURL(AppUtils.getCustomAPIUrl(account_id));
			} else {
				twit.setBaseURLByService(App.Users.getType(account_id));
			}
		}
	} else {
		// AppUtils.showBanner('NOT seetting credentials for!');
	}

	return twit;

};



AppUtils.getAuthObj = function(account_id) {
	var auth = App.Users.getAuthObject(account_id);
	return auth;
};


AppUtils.convertToUser = function(srvc_user) {

	var user = {};

	user.spaz_id     = sch.UUID();
	user.username    = srvc_user.screen_name;
	user.description = srvc_user.description;
	user.fullname    = srvc_user.name;
	user.service 	 = srvc_user.SC_service;
	user.service_id  = srvc_user.id;
	user.avatar      = srvc_user.profile_image_url;
	user.avatar_bigger = AppUtils.getBiggerAvatar(user);
	user.url         = srvc_user.url;
	user.is_private  = !!srvc_user['protected'];
	user._orig       = _.extend({},srvc_user);



	//following: true
	return user;
};


/**
 * This converts an item from a given service into
 * a common structure we use for everything internally
 */
AppUtils.convertToTweet = function(item) {

	var tweet = {};

	if (!item.SC_service) {
		item.SC_service = SPAZCORE_SERVICE_TWITTER;
	}

	switch(item.SC_service) {

		case SPAZCORE_SERVICE_TWITTER:
		case SPAZCORE_SERVICE_IDENTICA:
		case SPAZCORE_SERVICE_CUSTOM:

			tweet.service       = item.SC_service;
			tweet.service_id    = item.id;
			tweet.spaz_id       = item.SC_service+item.id+item.SC_created_at_unixtime;
			tweet.text          = item.text;
			tweet.text_raw      = item.SC_text_raw;
			tweet.publish_date  = item.SC_created_at_unixtime;
			tweet.account_id	= item.account_id || undefined;

			if (item.SC_is_dm) {
				tweet.author_username = item.sender.screen_name;
				tweet.author_description = item.sender.description;
				tweet.author_fullname = item.sender.name;
				tweet.author_id  = item.sender.id;
				tweet.author_avatar = item.sender.profile_image_url;
				tweet.author_url = item.sender.url;

				tweet.recipient_username = item.recipient.screen_name;
				tweet.recipient_description = item.recipient.description;
				tweet.recipient_fullname = item.recipient.name;
				tweet.recipient_id  = item.recipient.id;
				tweet.recipient_avatar = item.recipient.profile_image_url;

				tweet.is_private_message = true;

			} else {

				if (item.SC_is_retweet) { // Twitter API retweets are a curious circumstance

					tweet.is_repost = true;

					tweet.text          = item.retweeted_status.text;
					tweet.text_raw      = item.retweeted_status.text;

					tweet.repost_orig_date  = sc.helpers.httpTimeToInt(item.retweeted_status.created_at);
					tweet.repost_orig_id    = item.retweeted_status.id;

					tweet.author_username = item.retweeted_status.user.screen_name;
					tweet.author_description = item.retweeted_status.user.description;
					tweet.author_fullname = item.retweeted_status.user.name;
					tweet.author_id  = item.retweeted_status.user.id;
					tweet.author_avatar = item.retweeted_status.user.profile_image_url;
					tweet.author_url = item.retweeted_status.user.url;

					tweet.reposter_username = item.user.screen_name;
					tweet.reposter_description = item.user.description;
					tweet.reposter_fullname = item.user.name;
					tweet.reposter_id  = item.user.id;
					tweet.reposter_avatar = item.user.profile_image_url;
					tweet.reposter_url = item.user.url;

					if (item.retweeted_status.in_reply_to_screen_name) {
						tweet.recipient_username = item.retweeted_status.in_reply_to_screen_name;
						tweet.recipient_id  = item.retweeted_status.in_reply_to_user_id;
					}

					if (item.retweeted_status.in_reply_to_status_id) {
						tweet.in_reply_to_id = item.retweeted_status.in_reply_to_status_id;
					}

				} else {

					tweet.author_username = item.user.screen_name;
					tweet.author_description = item.user.description;
					tweet.author_fullname = item.user.name;
					tweet.author_id  = item.user.id;
					tweet.author_avatar = item.user.profile_image_url;
					tweet.author_url = item.user.url;

					if (item.SC_is_reply) {
						tweet.is_mention = true; // mentions the authenticated user
					}

					if (item.in_reply_to_screen_name) {
						tweet.recipient_username = item.in_reply_to_screen_name;
						tweet.recipient_id  = item.in_reply_to_user_id;
					}

					if (item.in_reply_to_status_id) {
						tweet.in_reply_to_id = item.in_reply_to_status_id;
					}

					if (item.favorited) {
						tweet.is_favorite = true;
					} else {
						tweet.is_favorite = false;
					}

				}

			}
			
			if (!tweet.author_fullname){
				// for search !!
//TODO
//this might be a good place to put something else. i forget what.
//
//				console.log("NO FULLNAME.. FINDING FULLNAME.. IN", tweet, "FULLNAME FOUND..", item.from_user_name);
				tweet.author_fullname = item.from_user_name;
			}
			
			
			if (item.SC_is_search) {
				tweet.is_search_result = true;
			}

			tweet.author_avatar_bigger = AppUtils.getBiggerAvatar(tweet);
			tweet.author_is_private = item && item.user ? item.user['protected'] : false;

			// copy to _orig
			tweet._orig = _.extend({},item);

			break;

		default:
			break;
	}

	return tweet;

};

AppUtils.setAdditionalTweetProperties = function(tweets, account_id) {

	for (var j = tweets.length - 1; j >= 0; j--){
		//tweets[j].account_id = account_id;

		var users = App.Users.getByType(tweets[j].service)
		for(var i = users.length - 1; i >= 0; i--){
			if(users[i].username.toLowerCase() === tweets[j].author_username.toLowerCase()){
				tweets[j].is_author = true; //set isAuthor flag

				if(!tweets[j].is_private_message){
					tweets[j].account_id = users[i].id; //change the account_id to the author, if it is not a pm
				}
				break;
			}
		}

	}
	return tweets;
};


AppUtils.getBiggerAvatar = function(tweet_or_user) {
	var bigger_url, username, avatar_url;

	if (tweet_or_user.author_username) { // is tweet
		username = tweet_or_user.author_username;
		avatar_url = tweet_or_user.author_avatar;
	} else { // is user
		username = tweet_or_user.username;
		avatar_url = tweet_or_user.avatar;
	}


	switch(tweet_or_user.service) {
		case SPAZCORE_SERVICE_TWITTER:
			bigger_url = avatar_url.replace(/_normal\.([a-zA-Z]+)$/, "_bigger.$1");
			break;
		case SPAZCORE_SERVICE_IDENTICA: // we abuse their API to get a 302 to the proper URL
			bigger_url = 'http://identi.ca/api/users/profile_image/'+username+'.json?size=bigger';
			break;
		default: // no idea.
			bigger_url = avatar_url;
	}

	return bigger_url;
};


AppUtils.convertToTweets = function(item_array) {

	if (!item_array) {
		return [];
	}
	for (var i = 0; i < item_array.length; i++) {
		item_array[i] = AppUtils.convertToTweet(item_array[i]);
	};

	return item_array;
};




AppUtils.showBanner = function(inMessage, timeout, waitForMove) {
	if(!enyo.windows) {
		console.log(inMessage);
		return;
	}
	window.humane.timeout = timeout||1500;
	window.humane.waitForMove = waitForMove||false;
	enyo.windows.addBannerMessage(inMessage, "{source: 'banner', text:" + inMessage + "}", "icon_32.png");
	humane(inMessage);
};


AppUtils.showDashboard = function(opts) {
	
	opts = sch.defaults({
		icon: 'icon_48.png',
		title: 'Dashboard Title',
		text: 'This is the dashboard message',
		duration:null,
		onClick:null
	}, opts);
	
	
	switch (AppUtils.getPlatform()) {
		case '__BLACKBERRY':
			
			enyo.Signals.send('onNotify', opts);
			
			break;
		case SPAZCORE_PLATFORM_WEBOS:
			window.enyo.$.neo.pushDashboard(null, opts.title, opts.text);
			var banner = opts.title + ": " + opts.text;
			AppUtils.showBanner(banner);
			break;

		case SPAZCORE_PLATFORM_TITANIUM:
			var ntfy = Titanium.Notification.createNotification();
			ntfy.setMessage(opts.text);
			ntfy.setIcon(opts.icon||null);
			ntfy.setTimeout(opts.duration||null);
			ntfy.setTitle(opts.title);
			ntfy.setCallback(function () {
				if (opts.onClick) {
					opts.onClick();
				}
			});
			ntfy.show();
			break;

		default:
			if (window.webkitNotifications) {
				if (window.webkitNotifications.checkPermission() === 0) {
					window.webkitNotifications.createNotification(opts.icon, opts.title, opts.text).show();
				} else {
					// this can't be raised by a non-user action.
					window.webkitNotifications.requestPermission();
				}
			}
			break;

	}
};


AppUtils.getPlatform = function() {
	var platform;
	platform = sch.getPlatform();
	return platform;
};



AppUtils.getQueryVars = function(qstring) {
	var qvars = [];
	var qvars_tmp = qstring.split('&');
	for (var i = 0; i < qvars_tmp.length; i++) {;
		var y = qvars_tmp[i].split('=');
		qvars[y[0]] = decodeURIComponent(y[1]);
	};
	return qvars;
};

AppUtils.isService = function(inService){
	return (inService === SPAZCORE_SERVICE_TWITTER || inService === SPAZCORE_SERVICE_IDENTICA || inService === SPAZCORE_SERVICE_CUSTOM)
};
