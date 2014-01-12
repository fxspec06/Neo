enyo.kind({
	name: "Neo.Notifier",
	kind: enyo.Component,
	tweets: {},
	valid_types: ['tweet', 'mention', 'private_message', 'search'],
	
	create: function(){
		this.inherited(arguments);
	},
	
	addTweet: function(inTweet) {
		//this.log()
		
		if (!inTweet.is_author) {
			var account_id = inTweet.account_id;
			var account_label = "@" + App.Users.get(inTweet.account_id).username;
			var service_id = inTweet.service_id;
			var tweet_type = 'notify-newmessages';
			if (inTweet.is_mention) {
				tweet_type = 'notify-mentions';
			} else if (inTweet.is_private_message) {
				tweet_type = 'notify-dms';
			} else if (inTweet.is_search_result) {
				tweet_type = 'notify-searchresults';
			}
		}
		
		if (App.Prefs.get(tweet_type)) {
			if (!this.tweets[account_label]) {
				this.tweets[account_label] = {
					'notify-newmessages':[],
					'notify-mentions':[],
					'notify-dms':[],
					'notify-searchresults':[]
				};
			}
			var notify_tweet_array = this.tweets[account_label][tweet_type];
			if (notify_tweet_array.indexOf(service_id) === -1) {
				this.tweets[account_label][tweet_type].push(service_id);
			}
		}
	},
	
	raiseNotifications:function() {
		
		for (var account in this.tweets) {
			for (var type in this.tweets[account]) {
				var count = this.tweets[account][type].length;
				var msg = '';
				var type_label = '';
				if (count > 0) {

					switch(type) {
						case 'notify-newmessages':
							type_label = (count > 1) ? 'tweets':'tweet';
							break;
						case 'notify-mentions':
							type_label = (count > 1) ? 'mentions':'mention';
							break;
						case 'notify-dms':
							type_label = (count > 1) ? 'private messages':'private message';
							break;
						case 'notify-searchresults':
							type_label = (count > 1) ? 'search results':'search result';
							break;
						default:
							type_label = 'tweets';

					}

					msg = enyo.macroize($L('{$count} new {$type_label}'), {'count':count, 'type_label':type_label});
					this.raiseNotification(account, msg);
				}
			}
		}
		this.resetCounts();
	},



	raiseNotification:function(title, message) {
		AppUtils.showDashboard({
			'title':title,
			'text':message
		});

	},

	resetCounts: function() {
		this.tweets = {};
	}

});
