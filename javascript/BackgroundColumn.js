enyo.kind({
	name: "Neo.BackgroundColumn",
	
	published: {
		tweets: [],
		cachedData: [],
		info: {},
		tweets: [],
	},
	
	//@* override
	create: function() {
		this.inherited(arguments);
		//this.log(this.info.type);
		//@* fill our column with tweets of the outerworldly
		if ( !(this.pullComplete) || (this.tweets.length === 0 || this.fresh === true))
			enyo.call(this.loadNewer({forceCountUnread:true}));
				else if (this.tweets.length != 1)
					enyo.call(this.buildList());
	},
	
	//@* public
	//@* load newer tweets
	loadNewer: function(opts) {
		this.loadData(enyo.mixin(opts, {mode:'newer'}));
		sch.debug('Loading newer tweets...');
	},
	//@* public
	//@* load older tweets
	loadOlder:function() {
		this.loadData({mode:'older'});
		sch.debug('Loading older tweets...');
	},
	
	//@* private
	//@* load column data
	loadData: function(opts) {
		//this.log();
		if (this.info == null || this.info.accounts == null || this.info.accounts[0] == null) return;
		
		//@* create a reference object
			var self = this;
		//@* mix opts
			opts = sch.defaults({ mode: 'newer', since_id: null, max_id: null }, opts);
		
		try {
			var since_id;
			if (this.tweets.length > 0) {
				if (opts.mode === 'newer') {
					since_id = _.first(this.tweets).service_id;
					this.markAllAsRead();
				} else if (opts.mode === 'older') since_id = '-'+(_.last(self.tweets).service_id);
			} else since_id = 1;
			
			this.accountsLoaded = 0;
			this.totalData = [];
			
			enyo.forEach(self.info.accounts, function(account_id) {
				loadData(account_id);
			});
			
			function loadData(account_id) {
				var account = App.Users.get(account_id),
					auth = new SpazAuth(account.type),
					_n = null;
				
				auth.load(account.auth);
				
				self.twit = new SpazTwit();
				self.twit.setBaseURLByService(account.type);
				self.twit.setSource(App.Prefs.get('twitter-source'));
				self.twit.setCredentials(auth);
				
				switch (self.info.type) {
					case SPAZ_COLUMN_HOME:
						self.loadStarted();
						self.twit.getHomeTimeline(since_id, 50, _n, _n,
							function(data) {self.loadFinished(data, opts, account_id)},
							function(fail) {console.log(fail);self.loadFailed()});
						//function(fail) {console.log(fail);self.loadFailed()});
						break;
					case SPAZ_COLUMN_MENTIONS:
						self.loadStarted();
						self.twit.getReplies(since_id, 50, _n, _n,
							function(data) {self.loadFinished(data, opts, account_id)},
						function(fail) {console.log(fail);self.loadFailed()});
						break;
					case SPAZ_COLUMN_MESSAGES:
						self.loadStarted();
						//self.twit.getDirectMessages(since_id, 50, null, null,
						self.twit[self.states[self.cacheIndex] || 'getDirectMessages'](since_id, 50, _n, _n,
							function(data) {self.loadFinished(data, opts, account_id)},
						function(fail) {console.log(fail);self.loadFailed()});
						break;
					case SPAZ_COLUMN_SEARCH:
						self.loadStarted();
						self.twit.search(self.info.query, self.info.queryKind, since_id, 50, _n, _n, _n,
							function(data) {self.loadFinished(data, opts, account_id)},
						function(fail) {console.log(fail);self.loadFailed()});
						break;
					case SPAZ_COLUMN_FAVORITES:
						self.loadStarted();
						self.twit.getFavorites(since_id, _n, _n,
							function(data) {self.loadFinished(data, opts, account_id)},
						function(fail) {console.log(fail);self.loadFailed()});
						break;
					 case SPAZ_COLUMN_SENT:
					 	self.loadStarted();
					 	window.AppCache.getUser(account.username, account.type, account.id,
					 		function(user) {self.twit.getUserTimeline(user.service_id, 50, _n,
							 	function(data) {self.loadFinished(data, opts, account_id)},
						self.loadFailed())}, function(fail) {console.log(fail);self.loadFailed()});
					 	break;
					case SPAZ_COLUMN_RETWEETS:
						self.loadStarted();
						var rtname = "retweet" + self.states[self.cacheIndex] + "Me";
						self.twit[rtname](_n,_n,_n,_n,function(data) {
							self.loadFinished(data, opts, account_id)}, function(fail) {console.log(fail);self.loadFailed()});
						break;
					//@* extended
					case SPAZ_COLUMN_TRENDS:
						self.loadStarted();
						self.twit.getTrends(function(data) {
							self.loadTrendsFinished(data);
							self.loadOtherFinished();
						}, function(fail) {console.log(fail);self.loadFailed()});
						break;
					case SPAZ_COLUMN_LIST:
						self.loadStarted();
						window.AppCache.getUser(account.username, account.type, account.id, function(user) {
							switch (self.states[self.cacheIndex]) {
								case "all":
									self.twit.getLists(account.username, function(data) {
										self.loadOtherFinished();
										self.loadListsFinished(data, opts, account_id);
									}, function(fail) {console.log(fail);self.loadFailed()});
									break;
								default:
									var list = "getList" + self.states[self.cacheIndex];
									self.twit[list](self.info.list, user.service_id, function(data) {
										self.loadOtherFinished();
										self.loadListsFinished(data, opts, account_id);
									}, function(fail) {console.log(fail);self.loadFailed()});
									break;
							}
						}, function(fail) {console.log(fail);self.loadFailed()});
						break;
					case SPAZ_COLUMN_FILTERS:
						self.loadStarted();
						var filters = window._filter_chain.getFilterList();
						if (filters) {
							self.loadOtherFinished();
							self.gotFilters(filters);
						} else self.loadFailed();
						break;
					default: break;
				}
			}
		} catch(e) {console.error(e, e.message)}
	},
	loadStarted: function() {
		this.accountsLoaded++;
	},
	loadFinished: function(data, opts, account_id) {
		if (typeof data !== undefined) {
			enyo.forEach(data, function(d) { d.account_id = account_id });
			this.totalData.push(data);
		}
		this.log(data, this.totalData);
		if (--this.accountsLoaded === 0) this.processData(this.totalData, opts);
	},
	loadFailed: function() {
		console.error("loadFailed:", this.info, this);
		if (--this.accountsLoaded === 0) null;
	},
	loadOtherFinished: function() {
		if (--this.accountsLoaded === 0) null;
	},
	
	
	
	
	//@* private
	//@* called after data retrieved
	processData: function(_data, opts, account_id) {
		this.log(_data);
		if (typeof _data[0] != 'undefined' && typeof _data[1] == 'undefined' && this.info.type == "Search") _data = _data[0];
		var self = this;
		
		//@* mix opts
		opts = sch.defaults({ mode: 'newer', since_id: null, max_id: null }, opts);
		
		if (_data) {
			switch (this.info.type) {
				default:
				var data = [],
					earliestPublishDate = 0;
				//@* loop through data
					enyo.forEach(_data, function(_arr) {
						if (!_arr) return;
						try {
							_arr = AppUtils.convertToTweets(_arr);
							if (_.first(_arr).publish_date > earliestPublishDate)
								earliestPublishDate = _.first(_arr).publish_date;
						} catch (e) {}
						data = data.concat(_arr);
					});
				//@* check dupes
					data = _.reject(data, function(item) {
						for (var i = 0; i < self.tweets.length; i++) {
							if (item.service_id === self.tweets[i].service_id) return true;
								else {if (opts.mode === 'older') item.read = true;
										else item.read = false}
					}});
				//@* apply custom filters
					data = this._filter(data); //TODO
				//@* actually do stuff with the data
				if (data.length > 0) {
					//@* fix properties
						data = AppUtils.setAdditionalTweetProperties(data);
					//@* mark read || unread
						enyo.forEach(data, function(_d) {
							_d.read = (opts.mode === 'older');
						});
					//@* reject tweets older than the latest time
						var filteredData = _.reject(data, function(_i) {
							if (_i.publish_date < earliestPublishDate) return true;
						});
					//@* shrink it
						if (filteredData.length < 10 && data.length > 5) {
							data = _.sortBy(data, function(_i) {
								return earliestPublishDate - _i.publish_date;
							}).slice(0, 10);
						} else data = filteredData;
					
					//@* done
					this.setTweets([].concat(data.reverse(), this.tweets));
					this.sortTweets();
					//AppUI.saveData(App.Prefs.get("currentUser"));
				}
				break;
			}
		} else enyo.log('No new data');
		
		//@* mark tweets as unread
			this.markOlderAsRead();
		//@* count unread
			if (opts.forceCountUnread) this.countUnread();
		//@* set the last unread message
			this.setLastRead();
		//@* notify for new tweets
			this.notifyOfNewTweets();
		//@* done....
		
		if (this.callback) this.callback(this, this.index);
		else if (this.$.list && this.$.list.pullState)
			this.$.list.completePull();
		else if (this.pullComplete) this.pullComplete();
	},
	
	//@* add a user to app autocomplete
	addToAC: function(username) {
		var userExists = enyo.indexOf(username, window.autocomplete);
		if (userExists == -1) window.autocomplete.push(username);
	},
	
	//@* tweet manipulation
	//@* notify all unread tweets.. ? seems inefficient.
	notifyOfNewTweets: function() {
		var new_tweets = _.reject(this.tweets, function(_t) {return !!_t.read});
		enyo.forEach(new_tweets, function(_nt) {
			AppUI.addTweetToNotifications(_nt);
		});
	},
	//@* mark ALL tweets unread
	markAllAsRead: function() {
		var changed = 0;
		enyo.forEach(this.tweets, function(_t) {
			if (!_t.read) {_t.read = true;changed++}
		});
		if (changed > 0) this.countUnread();
	},
	//@* mark tweets older than last read as read
	markOlderAsRead: function() {
		var changed = 0,
			last_read_date = this.getLastRead();
		enyo.forEach(this.tweets, function(_t) {
			if (_t.publish_date <= last_read_date) {_t.read = true;changed++}
		});
		if (changed > 0) this.countUnread();
	},
	//@* count the unread tweets and update the unread notifier
	countUnread: function() {
		var count = 0;
		enyo.forEach(this.tweets, function(_t) {
			if (!_t.read) count++;
		});
		enyo.Signals.send("updateUnread", {
			title: this.info.type,
			unread: count
		});
		return count;
	},
	//@* sort tweets array by newest first
	sortTweets: function() {
		this.tweets.sort(function(a, b) { return b.service_id - a.service_id });
	},
	getHash: function() {
		return sch.MD5(this.info.type + "_" + this.info.id);
	},
	//@* return last read
	getLastRead: function() {
		return LastRead.get(this.getHash());
	},
	//@* sets the last read
	setLastRead: function() {
		var last_read_date = 1;
		//@* find newest publish_date
		if (this.tweets.length > 0) {
			var newest_item = _.max(this.tweets, function(_t) {return _t.publish_date}) || this.tweets[0].created_at || this.tweets[0]._orig.created_at;
			last_read_date = newest_item.publish_date;
		}
		LastRead.set(this.getHash(), last_read_date);
	},
	//@* removes tweet from column by tweet id
	removeTweetById: function(inTweetId) {
		enyo.forEach(this.tweets, function(_t) {
			if (_t.service_id === inTweetId) this.tweets.splice(enyo.indexOf(_t, this.tweets));
		}, this);
		//this.refreshList();
		this.buildList();
	},
	//* called on setTweets()
	tweetsChanged: function(oldVal) {
		var _tweets = [];
		enyo.forEach(this.tweets, function(_t) {
			if (!_t.publish_date) _t.publish_date = new Date(_t.created_at || (_t._orig ? _t._orig.created_at : null)).toUTCString();
			_tweets.push(_t);
		}, this);
		this.tweets = enyo.clone(_tweets);
		if (this.cache && this.cache[this.cacheIndex]) this.cache[this.cacheIndex] = _tweets.splice(0, _tweets.length);
	},
	
	
	
	
	
	//@* filters the column with the currently applied filters
	_filter: function(_d) {
		var _fd,
			_sl = _d.length,
			_el,
			_diff;
		//this.log('start:', _sl, window._filter_chain);
		try {
			_fd = window._filter_chain.processArray(_d);
		} catch(e) {_fd = _d}
		_el = _fd.length;
		_diff = _sl - _el;
		//this.log('end:', _el, 'applied:', _diff);
		if (_diff != 0) AppUtils.showBanner(_diff + ' filters applied...');
		return _fd;
	}
});
window._filter_chain = new SpazFilterChain();
window._filter_chain._neo_filter = function(_i) {
	var _f = this.label,
		_fd = _i;
	if (typeof _i === "string") return (_i.toLowerCase().search(_f.toLowerCase()) != -1) ? null : _i;
	for (var _k in _i) {
		var _n = _i[_k];
		if (typeof _i[_k] === "string" && _k.search('text') != -1) _n = this.func(_i[_k]);
		if (_i[_k] != null && _n === null) _fd = null;
	}
	return _fd;
}