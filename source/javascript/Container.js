// clears document selection
// closes keyboard on BB's
function clearSelection() {
    if ( document.selection ) {
        document.selection.empty();
    } else if ( window.getSelection ) {
        window.getSelection().removeAllRanges();
    }
}
enyo.kind({
	//@* Neo.Container
	//@* part of collapsing arranger
		name: 'Neo.Container',

	//@* layout
		kind: 'FittableColumns',//Rows',
		//fit: true,

	//@* classes
		classes: 'neo-container enyo-fit',

	//@* events
		events: {
			onRefreshAllFinished: '',
			onShowAccountsPopup: '',
			onDestroy: 'hideDetailPane',
			onGoPreviousViewEvent: 'goPreviousViewEvent',
			onGetViewEvents: 'getViewEvents',
			onShowImageView: 'showImageView'
		},

	//@* handlers
		handlers: {},

	//@* published
	published: {
		//@* list of previous actions where the user has been
			actions: [],

		//@* details pane stack
		//@* not sure if this should be here, or with details pane's published properties
			viewEvents: [],

		//@* columns
			columnData: [],

		//@* ONE OBJECT TO RULE THEM ALL
		//@* _boxes stores ALL of the in app data.. from every list
			_boxes: new Array(9),
	},

	components: [
		//@* notifications
			{kind: 'Neo.Notifier', name: 'notifier'},

		//@* swap as necessary
			{name: '_box', layoutKind: 'FittableColumnsLayout', /*classes: 'enyo-fit',*/ fit: true, style: 'max-width: 100%; min-width: 50%; left: 0; height: 100%;' },

			//FIXME
			{name: '_box2', layoutKind: 'FittableColumnsLayout', showing: false, style: 'width: 50%; right: 0;' },

		//@* background
			{name: 'background'}
	],


	//@* override
	create: function() {
		this.inherited(arguments);

		this.boxes._ = this;

		AppUI.addFunction('reloadColumns', this.reloadColumns, this);
		AppUI.addFunction('search', this.search, this);
		AppUI.addFunction('fixSidebar', this.fixSidebar, this);
		AppUI.addFunction('saveData', this.saveColumnData, this);
		AppUI.addFunction('compose', this.compose, this);
		AppUI.addFunction('reply', this.reply, this);
		AppUI.addFunction('repost', this.repost, this);
		AppUI.addFunction('repostManual', this.repostManual, this);
		AppUI.addFunction('directMessage', this.directMessage, this);
		AppUI.addFunction('removeTweetById', this.removeTweetById, this);
		AppUI.addFunction('loadColumn', this.loadColumn, this);
		AppUI.addFunction('showMore', this.showMore, this);
		AppUI.addFunction('doMore', this.doMore, this);
		AppUI.addFunction('addTweetToNotifications', function(inTweet) {
			this.$.notifier.addTweet(inTweet)}, this);
		AppUI.addFunction('raiseNotifications', function() {
			this.$.notifier.raiseNotifications()}, this);
		AppUI.addFunction('userChange', function(oldUser) {
			this.saveColumnData(oldUser);
			this.reloadColumns()}, this);
		AppUI.addFunction('newMessage', function() {
			this.showMore('composePopup')}, this);
		AppUI.addFunction('viewUser', this.showUserView, this);
		AppUI.addFunction('viewTweet', this.showTweetView, this);
		AppUI.addFunction('refresh', this.refreshAll, this);
		AppUI.addFunction('rerenderTimelines', function(){
			//FIXME
			this.columnsFunction('render');
		}, this);

		if (!this.checkForUsers()) return;
		this.loadingColumns = 0;
		this.reloadColumns();
		//enyo.Signals.send('loadTheme', {type: 'override', theme: 'condensed'});
	},



	//@* public
	//@* destroys all columns and recreates from scratch
	reloadColumns: function() {
		var _colData = this.columnData,
			_splice = this.columnData.length,
			user = App.Prefs.get('currentUser'),
			oldData = App.Prefs.get('columns_' + user),
			account;

		this.log('reloading columns...');

		this.$._box2.setShowing(App.Prefs.get('two-panes'));
		this.$._box.addRemoveClass('enyo-fit', !App.Prefs.get('two-panes'));

		// remove all columns from stack, and all data
			for (var i = 0; i < _splice; i++) {
				var _pop = this.columnData.splice(0, 1);
				enyo.Signals.send('updateUnread', { unread: 0, title: _pop.type });
			}

		this.$._box.destroyClientControls();
		this._boxes = null;
		this._boxes = new Array(9);
		this.boxes.currentBox = null;

		// make sure users actually exist
			if (!App.Prefs.get('currentUser') && App.Users.getAll()[0] != null)
				App.Prefs.set('currentUser', App.Users.getAll()[0].id);
					else if (!App.Prefs.get('currentUser') || App.Users.getAll().length <= 0) return;

		// set up autocomplete
			window.autocomplete = [];
			account = App.Users.get(App.Prefs.get('currentUser'));
			AppUtils.makeTwitObj(account.id).getFriendsList(account.service_id, -1,
				enyo.bind(this, function(data) {
					enyo.forEach(data, function(user) {
						window.autocomplete.push(user.screen_name);
			})}));


		this.columnData = enyo.clone(this.getDefaultColumns())

		// set up column data
			if (App.Prefs.get('save-on-exit') && oldData && oldData.length > 0)
				enyo.mixin(this.columnData, oldData);

		this.log('preparing columns...', this.columnData);

		this.loadColumn('Timeline');
		this.runBackground();
	},

	//@* public
	//@* run a function (by name) through every existing column
	columnsFunction: function(functionName, opts, sync) {
		if (!this.$.timeline) return 0;
		var count = 0;
		//enyo.forEach(this.$.columns.getPanels(), function(column) {
			var column = this.$.timeline.children[0];
			try {
				// restrictions
					if (opts && opts.account_id && opts.account_id !== column.getInfo().accounts[0]) return;
					if (opts && opts.column_types && opts.column_types.indexOf(column.getInfo().type) < 0) return;
				//TODO enyo.call does NOT work here, for whatever reason
					//if(sync) enyo.call(column, functionName, [opts]); else
				enyo.asyncMethod(column, functionName, opts);
				count++;
			} catch (e) {console.error('columnsFunction:', e, e.message)}
		//}, this);
		return count;
	},

	//@* background
	//@* this is the invisible column
	//@* it fetches tweets we can store in our boxes
	//@* also it gives us notifications
	//@* it loops through the default three columns along with any other columns that have box data
	//@* it creates a Neo.BackgroundColumn, loads it with real live data from _boxes,
	//@* loads newer tweets, updates everything else as if it were 'real',
	//@* and then calls back so we can destroy it and run it again
	runBackground: function() {
		this.log();
		var iterate = ['timeline','mentions','messages','retweets'],
			exclude = ['filters'];

		this.boxes.backgroundProcessed = 0;

		if (this.$.timeline) {
			var current = this.columnTypeToName(this.$.timeline.children[0].info.type);
			var _remove = enyo.indexOf(current, iterate);
			if (_remove != -1) exclude.push(current);
		}
		for (var i = 0; i < exclude.length; i++) {
			var _remove = enyo.indexOf(exclude[i], iterate);
			if (_remove != -1) iterate.splice(_remove, 1);
		}
		for (var i = 0; i < iterate.length; i++) {
			var chosen = iterate[i],
				exist = this.findIn(this.columnTypeToName(chosen.toLowerCase()), this.columnData),
				_col = this.getColumn(exist);

			_col.kind = 'Neo.BackgroundColumn';
			_col.callback = this.backgroundCallback;
			this.log('running background for', _col.info.type, enyo.clone(_col), 'at index', _col.index);

			//FIXME ADD LOGIC TO RUN 1 BACKGROUND IN RIGHT PANE
			if (this.$._box2.showing == true && typeof this.$.timeline2 != 'undefined' && this.$.timeline2.controls.length == 0 && _col.info.tweets.length > 0) {
				//@* get our column ready component
				_col = this.getColumn(exist);
					this.log('adding column', _col.info.type, enyo.clone(_col), 'at index', _col.index);
				this.$.timeline2.destroyClientControls();
				//@* create it
					this.$.timeline2.createComponent(_col, {owner: this});
				//@* set header
					this.buildHeaders(chosen, 'toolbar2');
				this.$[_col.name].buildList();
			} else {
				this.$.background.createComponent(_col, {owner:this});
				this.$.background.render();
			}
		}
	},
	backgroundCallback: function(inSender, inIndex) {
		var that = inSender.owner;
		this.log(this.info.type);
		that.boxes.saveBackground(this.name);
		inSender.destroy();
		that.$.background.render();
		that.saveColumnData();
	},

	//@* boxes
	//@* this object contains the container 'boxes'
	//@* a box belongs in the container
	//@* and the container stores all the box data as it swaps. brilliant.
	boxes: {
		// pointer to container
			_: null,

		BOX_ORDER: ['timeline', 'composePopup', 'aboutPopup', 'settingsPopup', 'accountsPopup', 'searchPopup', 'detailContent', 'themes', 'filterPopup'],

		currentBox: '',

		//@* dynamically remove and add boxes
		ludacris: [
			{published: { savedData : {} }, speed: [ // timeline
				{layoutKind: 'FittableRowsLayout', fit: true, components: [
					{name: 'toolbar', kind: 'Neo.Toolbar', closeable: false, header: 'Neo',
						toolbarTap: 'scrollBehavior', toolbarHold: 'holdBehavior', onClose: 'deleteColumn',
						left: [{kind: 'Neo.Button', icon: 'refresh', text: 'Refresh', ontap: 'loadNewer'}],
						right: [{kind: 'Neo.Button', icon: 'compose', text: 'Compose', ontap: 'compose'}]},
					{name: 'timeline', kind: 'FittableRows', fit: true}]}, // timeline
				]},
			{published: { savedData : {} }, speed: [ // compose
				{name: 'composePopup', kind: 'Neo.ComposePopup', fit: true, onClose: 'actionBack' }]}, // compose
			{published: { savedData : {} }, speed: [ // about
				{name: 'aboutPopup', kind: 'Neo.AboutPopup', fit: true, onClose: 'actionBack' }]}, // about
			{published: { savedData : {} }, speed: [ // settings
				{name: 'settingsPopup', kind: 'Neo.SettingsPopup', fit: true, onClose: 'actionBack' }]}, // settings
			{published: { savedData : {} }, speed: [ // accounts
				{name: 'accountsPopup', kind: 'Neo.AccountsPopup', fit: true, onClose: 'actionBack',
					onAccountAdded: 'doAccountAdded', onAccountRemoved: 'doAccountRemoved' }]}, // accounts
			{published: { savedData : {} }, speed: [ // search
				{name: 'searchPopup', kind: 'Neo.SearchPopup', fit: true, onClose: 'actionBack'}]},  // search
			{published: { savedData : {} }, speed: [ // detail
				{name: 'detailContent', kind: 'Panels', fit: true, draggable: false}]}, // detail
			{published: { savedData : {} }, speed: [ // themes
				{name: 'themes', kind: 'Neo.Themes', fit: true, onClose: 'actionBack'}]}, // themes
			{published: {savedData: {}}, speed: [ // filter
				{name: 'filterPopup', kind: 'Neo.FilterPopup', fit: true, onClose: 'actionBack'}]}, // filter
		], //@* var box = ludacris[enyo.findIn(this.BOX_ORDER, boxName)


		//@* public
		//@* removes the current box, returning the new object
		swap: function(newBox) { //_boxSwap
			if (this.currentBox == 'timeline') // anchor the column if we can
				this._.$.timeline.children[0].anchor();
			var _box = this._.$._box,
				_box2 = this._.$._box2,
				_saveData = this.getBox(),
				_newBox = this.getStatic(newBox);

			console.log('swapping..', this.currentBox, newBox, enyo.clone(this), enyo.clone(_saveData));

			// save the old data
			switch (this.currentBox) {
				case null:
					this._._boxes[this.getIndex(newBox)] = {}
					break;
				case 'timeline':
					this._._boxes[0][this._.$.timeline.children[0].info.type]
						= enyo.clone(_saveData);
				case 'detailContent':
					//return _newBox;
					break;
				default:
					this._._boxes[this._.boxes.getIndex(this.currentBox)] = enyo.clone(_saveData);
					break;
			}

			this.currentBox = this.BOX_ORDER[this.getIndex(newBox)];

			_box.destroyClientControls();
			if ( typeof _newBox.speed[0].components != 'undefined') {
				_newBox.speed[0].components[0].name = 'toolbar';
				_newBox.speed[0].components[1].name = 'timeline';
			}
			_box.createComponents(_newBox.speed, {owner: this._});
			_box.render();

			//FIXME
			if ( typeof this._.$.timeline2 == 'undefined' && _box2.showing == true) {
				this._.log('generating timeline2...', this._);
				var doLoad = 'searchPopup';
					doLoad = 'timeline';
				var timeline2 = this.getStatic(doLoad);
				_box2.destroyClientControls();
					if (doLoad == 'timeline') {
						timeline2.speed[0].components[0].name = 'toolbar2';
						timeline2.speed[0].components[1].name = 'timeline2';
					} else {
						timeline2.speed[0].name = 'timeline2';
					}

				_box2.createComponents(timeline2.speed, {owner: this._});

				_box2.render();
				/*//@* get our column ready component
				var _col = this._.getColumn('Search');
				//this.log('adding column', _col.info.type, enyo.clone(_col), 'at index', _col.index);

				//@* create it
				this._.$.timeline2.createComponent(_col, {owner: this._});

				//@* set header
				if (!this._.$.toolbar2) this._.$.timeline2.$.toolbar2.setOwner(this._);
				if (doLoad.search('search') != -1) this._.buildHeaders('Search', 'toolbar2');
					else this._.buildHeaders('Timeline', 'toolbar2');
				this._.$.timeline2.render();
				if (this._.$.timeline2.reset)
					this._.$.timeline2.reset();*/
			}
			//_box.render();
		},

		//@* gets a box name by index
		getIndex: function(name) { //_boxIndex
			return enyo.indexOf(name, this.BOX_ORDER);
		},

		//@* returns the box object
		getStatic: function(boxIndex) {
			if (typeof boxIndex === 'string') boxIndex = this.getIndex(boxIndex);
			return this.ludacris[boxIndex];
		},

		//@* sends back an object to save for current box
		getBox: function() {
			var data = {},
				_box = this._.$[this.currentBox],
				getData = function(context) {
					var savedData = enyo.clone(context.published);
					for (var key in context.published) savedData[key] = context[key];
					return savedData;
				};

			switch (this.currentBox) {
				case 'timeline':
					_box = _box.children[0];
					//_box.setLock(_box.$.list.getScrollPosition());
					//console.log(_box.$.list.getScrollPosition(), _box.lock)
					break;
				case 'detailContent':
					break;
				default:
					return null;
			}

			data = enyo.clone(getData(_box));
			return data;
		},

		backgroundProcessed: 0,

		//@* saves the background tweets
		saveBackground: function(inName) {
			var _boxes = this._._boxes,
				_saveData = this.getBoxBackground(inName),
				_type = _saveData.info.type;

			if (_boxes[0][_type] === undefined) _boxes[0][_type] = {}
			enyo.mixin(_boxes[0][_type], enyo.clone(_saveData));
			this.backgroundProcessed++;
		},

		//@* sends back an object to save for background box
		getBoxBackground: function(inName) {
			var data = {},
				_box = this._.$[inName],
				getData = function(context) {
					var savedData = enyo.clone(context.published);
					for (var key in context.published) savedData[key] = context[key];
					return savedData;
				};

			data = enyo.clone(getData(_box));
			return data;
		},
	},


	//@* public
	//@* loads the column if it exists, creates if not
	loadColumn: function(chosen) {
		var exist = this.findIn(this.columnTypeToName(chosen.toLowerCase()), this.columnData);

		if (chosen == null) {this.showTimeline();return}

		this.log('loading column', chosen.toLowerCase(), 'exists at index', exist, this.columnData[exist]);

		if (typeof exist == 'number') {
			this.boxes.swap('timeline');
			//@* get our column ready component
				var _col = this.getColumn(exist);
				this.log('adding column', _col.info.type, enyo.clone(_col), 'at index', _col.index);
			//@* create it
				this.$.timeline.createComponent(_col, {owner: this});
			//@* set header
				this.buildHeaders(chosen);
			//
			this.lastIndex = exist;
		} else {
			// make column from scratch
			var obj;
			switch (chosen.toLowerCase()) {
				case 'favorites':
					obj = {type: SPAZ_COLUMN_FAVORITES, accounts: [App.Prefs.get('currentUser')]}
					break;
				case 'trends':
					obj = {type: SPAZ_COLUMN_TRENDS, accounts: [App.Prefs.get('currentUser')]}
					break;
				case 'retweets':
					obj = {type: SPAZ_COLUMN_RETWEETS, accounts: [App.Prefs.get('currentUser')]}
					break;
				case 'lists':
					obj = {type: SPAZ_COLUMN_LIST, accounts: [App.Prefs.get('currentUser')]}
					break;
				case 'search':
					this.showMore('searchPopup');
					return;
					break;
				case 'filters':
					obj = {type: SPAZ_COLUMN_FILTERS, accounts: [App.Prefs.get('currentUser')]}
					break;
				case 'messages':
					obj = {type: SPAZ_COLUMN_MESSAGES, accounts: [App.Prefs.get('currentUser')]}
					break;
				case 'timeline':
					obj = {type: SPAZ_COLUMN_HOME, accounts: [App.Prefs.get('currentUser')]}
					break;
				case 'mentions':
					obj = {type: SPAZ_COLUMN_MENTIONS, accounts: [App.Prefs.get('currentUser')]}
					break;
				default:
					// dizzy dance
					return;
					break;
			}
			this.createColumn(obj);
			this.loadColumn(chosen);
		}
		this.render();
		this.reflow();
		this.owner.reflow();
	},
	//@* public
	//@* returns a column object ready to be rendered
	getColumn: function(atIndex) {
		var _colData = enyo.clone(this.columnData[atIndex]),
			_boxData = enyo.clone(this._boxes[0][_colData.type]),

			col = {
				name: 'Column' + atIndex,
				info: _colData,
				index: atIndex,
				kind: 'Neo.Column',
				onLoadStarted: 'loadStarted',
				onLoadFinished: 'loadFinished',
				owner: this,
				tweets: _colData.tweets,
				cache: _colData.cache
			};

		if (!col.info.id) col.info.id = _.uniqueId(new Date().getTime());

		switch (col.info.type) {
			case SPAZ_COLUMN_MESSAGES:
				col.states = ['getDirectMessages', 'getSentDirectMessages'];
				col.radios = [
					{text: 'Inbox', icon: 'inbox'},
					{text: 'Outbox', icon: 'outbox'}
				];
				break;
			case SPAZ_COLUMN_TRENDS:
				col.kind = 'Neo.TrendsColumn';
				break;
			case SPAZ_COLUMN_RETWEETS:
				col.states = ["sOf", "edBy", "edTo"];
				col.radios = [
					{text: 'of me', icon: 'tshirt'},
					{text: 'by me', icon: 'user'},
					{text: 'to me', icon: 'users'}
				];
				break;
			case SPAZ_COLUMN_LIST:
				col.kind = 'Neo.ListColumn';
				states = ["all", "Members", "Timeline", "Subscribers"];
				col.radios = [
					{text: 'All', icon: 'list'},
					{text: 'Members', icon: 'members'},
					{text: 'Timeline', icon: 'timeline'},
					{text: 'Subscribers', icon: 'subscribers'}
				];
				break;
			case SPAZ_COLUMN_FILTERS:
				col.kind = 'Neo.FiltersColumn';
				break;
		}

		//@* determine if the column is NEW or not..
			col.fresh = (!_boxData.tweets || _boxData.tweets.length == 0);

		//@* delete stuff if it's really old
			if (_boxData.tweets && _colData.tweets && _boxData.tweets.length < _colData.tweets.length) delete _boxData.tweets;
			if (_boxData.cache && _boxData.cache[0] && _colData.cache && _colData.cache[0]
					&& _boxData.cache[0].length < _colData.cache[0].length) delete _boxData.cache;

		// mix the col with the old box data
			enyo.mixin(col, _boxData);

		return col;
	},

	//@* public
	//@* accepts a column type and returns the proper name
	columnTypeToName: function(type) {
		var name = type;
		switch (type) {
			case 'home': name = 'timeline'; break;
			case 'timeline': name = 'home'; break;
			case 'lists': name = 'list'; break;
			case 'list': name = 'lists'; break;
		}
		return name;
	},

	//@* public
	//@* eliminates all but the 3 main columns in column data
	cleanColumns: function(){
		console.log('stripping columns to barebones...');
		enyo.forEach(this.columnData, function(column) {
			switch (column.type) {
				case SPAZ_COLUMN_MENTIONS:
				case SPAZ_COLUMN_HOME:
				case SPAZ_COLUMN_MESSAGES:
					break;
				default:
					this.columnData.splice(enyo.indexOf(column), 1);
					break;
			}
		}, this);
	},

	//@* private
	//@* sets the toolbar header and closeable properties
	buildHeaders: function(chosen, target) {
		if (typeof target == 'undefined') target = 'toolbar';
		this.$[target].setCloseable(true);
		switch (chosen.toLowerCase()) {
			case 'filters': case 'favorites': case 'retweets': case 'trends':
				this.$[target].setHeader(chosen);
				break;
			case 'lists':
				this.$[target].setHeader(this.$[target=='toolbar'?'timeline':'timeline2'].children[0].title);
				break;
			case 'search':
				if (typeof this.$[target=='toolbar'?'timeline':'timeline2'].children[3] != 'undefined')
					this.$[target].setHeader(this.$[target=='toolbar'?'timeline':'timeline2'].children[3].info.query);

				break;

			default:
				this.$[target].setCloseable(false);
				this.$[target].setHeader(chosen);
				break;
		}
		this.$[target].render();
		this.$[target].reflow();
	},
	//@* private
	//@* creates a new column
	createColumn: function(inObj) {
		inObj.id = _.uniqueId(new Date().getTime());
		this.saveColumnTweets();
		this.columnData.push(inObj);
		console.log('creating column', inObj);
//FIXME
//TODO
		this.render();
	},
	//@* private
	//@* removes the last action in the stack, loads its predecessor
	actionBack: function(inSender, inEvent) {
		this.log(this.actions);
		this.actions.pop();
		this.columnClosed();
//FIXME
//TODO
		this.render();
	},
	//@* private
	//@* loads the last action in the stack
	columnClosed: function(inSender, inEvent) {
		this.log('action back:', enyo.clone(this.actions));
		// if there are no actions in the stack, load the last column in the stack
			if (this.actions.length == 0) {this.showTimeline();return}
		// otherwise, show the last action =D
			else this.showMore(this.actions.pop());
	},
	//@* private
	//@* deprecated
	fixSidebar: function() {
		// not used
		console.error('fixSidebar: deprecated');
		//FIXME
	},
	//@* private
	//@* loads active column or sets active to last index, builds header, ensures sidebar name
	//@* called after column closed or action back
	showTimeline: function() {
		if (this.lastIndex == null || !this.columnData[this.lastIndex]) this.lastIndex = this.columnData.length - 1;
		var _a = this.columnData[this.lastIndex];

		var loadType = this.columnTypeToName(_a.type);

		console.log('showing timeline...', loadType, _a, this.columnData)

		loadType = enyo.cap(loadType);
		this.loadColumn(loadType);
		AppUI.selectSidebarByName(loadType);
	},
	//@* private
	//@* signals || AppUI
	//@* refreshes all active columns systematically
	refreshAll: function(account_id) {
		if (account_id == null) account_id = App.Prefs.get('currentUser');
		this.loadingColumns = 0;
		var opts = {};
		if (account_id) {
			opts.account_id = account_id;
			opts.column_types = [SPAZ_COLUMN_HOME, SPAZ_COLUMN_MESSAGES, SPAZ_COLUMN_MENTIONS];
		}
		if (this.columnsFunction('loadNewer', opts, true) === 0) this.loadFinished();

		this.runBackground();
	},
	//@* private
	//@* called when refresh button is hit on top
	loadNewer: function(inSender, inEvent) {
		AppUI.refresh();
		AppUI.restartAutoRefresher();
	},
	//@* i dont even know. i really, have no idea. wtf.
	timelinePickerChanged: function(inSender, inEvent, inIndex) {
		this.setTimeline(inEvent.content);
	},








	//@* public
	//@* signals || AppUI
	//@* shows a specified enyo object, based on type, with args
	showMore: function(type, args) {
		if (type != 'undefined' && this.actions[this.actions.length - 1] != type) this.actions.push(type);

		switch (type) {
			case 'detailContent':
				if (this.$.detailContent) return;
				break;
			case 'themes':
				enyo.Signals.send('setFullscreen', {fs:true});
				break;
			case 'Profile':
				var account = App.Users.get(App.Prefs.get('currentUser'));
				console.log(account);
				this.actions.pop();
				AppUI.viewUser(account.username, account.type, account.id);
				return;
				break;
			case 'timeline':
				//this.showTimeline();
				console.error('SHOWMORE TIMELINE, FIXME');
				return;
				break;
			default:
				break;
		}
		this.boxes.swap(type);
		//this.render();
		this.reflow();

		if (this.$[type].reset)
			this.$[type].reset();
	},
	//@* public
	//@* signals || AppUI
	//@* calls a function on an enyo object with specified args
	doMore: function(instructions) {
		var name = instructions.name,
			fn = instructions.fn,
			args = instructions.args;
		this.$[name][fn](args);
	},

	//@* public
	//@* deletes the active column
	deleteColumn: function(inSender, inEvent) {
		var _colData = this.columnData,
			_a = this.$.timeline.children[0],
			_i = _a.index,
			_boxData = this._boxes[0];

		console.log('DELETING COLUMN....', _a, _i, _a.name, _a.kind, enyo.clone(_colData));

		if (_colData[_i] === undefined) {console.error('CANNOT ERASE COLUMN...', _colData);return}

		// remove column from column data
			var last = _colData.splice(_i, 1);
		// hide the unread indicator
			enyo.Signals.send('updateUnread', { title: last[0].type, unread: 0 });
		// delete the column's data
			delete _boxData[i];
		// delete the column
			_a.destroy();
			this.$._box.destroyClientControls();

		console.log('column spliced, active destroyed', enyo.cloneArray(_colData), this.$._box);
		this.boxes.currentBox = null;
		this.actionBack(); // awesome name for a function. awesome awesome awesome
	},


	//@* private
	//@* called when a column begins to load
	loadStarted: function() {
		this.loadingColumns++;
	},
	//@* private
	//@* called when a column has finished loading
	loadFinished: function() {
		console.log('loadFinished...');
		this.loadingColumns--;
		if (this.loadingColumns <= 0) {
			this.bubble('onRefreshAllFinished');
			setTimeout(AppUI.raiseNotifications.bind(this), 1000);
			console.log('no more columns to load... raising notifications...');
			this.saveColumnData();
		}
		this.reflow();
	},
	//@* private
	//@* called from container
	checkForUsers: function() {
		if (App.Users.getAll().length === 0) {
			AppUtils.showBanner('No accounts! You should add one.');
			this.showMore('accountsPopup');
			enyo.Signals.send('setFullscreen', {fs:true});
			this.$.accountsPopup.$.toolbar.setCloseable(false);
			this.reflow();
			return false;
		}
		enyo.Signals.send('setFullscreen', {fs:false});
		if (this.$.accountsPopup)
			this.$.accountsPopup.$.toolbar.setCloseable(true);
		return true;
	},








	//@* twitter functions & utils

	//@* signals || AppUI
	search: function(inQuery, inAccountId, queryKind) {
		if (inAccountId == null) inAccountId = App.Prefs.get('currentUser');

		var exist = this.findIn(this.columnTypeToName(SPAZ_COLUMN_SEARCH), this.columnData);
		if (typeof exist === 'number') {
			this.loadColumn('search');
			this.deleteColumn();
			//this.log(inQuery, inAccountId);
			this.search(inQuery, inAccountId, queryKind);
			return;
		}

		this.createColumn({ type: 'search', accounts: [inAccountId], query: inQuery, queryKind: queryKind });
		this.loadColumn('search');
		AppUI.selectSidebarByName('Search');
	},
	//@* compose functions
	//@* private
	composePrep: function(){
		AppUI.showMore('composePopup');
		this.$.composePopup.reset();
	},
	//@* signals || AppUI
	compose: function(inText, inAccountId) {
		var id = (inAccountId && !inText.$) ? inAccountId : App.Prefs.get('currentUser');
		this.composePrep();
		if (inText.$) inText = '';
		this.$.composePopup.compose({ text: inText, account_id: id });
	},
	//@* signals || AppUI
	reply: function(inTweet) {
		var id = inTweet.account_id || App.Prefs.get('currentUser');
		this.composePrep();
		if (inTweet.is_private_message) this.$.composePopup.directMessage({ to: inTweet.author_username, text: null, tweet: inTweet, account_id: id });
			else this.$.composePopup.replyTo({ tweet: inTweet, account_id: id });
	},
	//@* signals || AppUI
	repost: function(inTweet) {
		var id = App.Prefs.get('currentUser');
		this.composePrep();
		if (!inTweet.is_private_message) this.$.composePopup.repost({ tweet: inTweet, account_id: id });
			else AppUtils.showBanner('Private messages cannot be retweeted');
	},
	//@* signals || AppUI
	repostManual: function(inTweet) {
		var id = App.Prefs.get('currentUser');
		this.composePrep();
		if (!inTweet.is_private_message) this.$.composePopup.repostManual({ tweet: inTweet, account_id: id });
			else AppUtils.showBanner('Private messages cannot be retweeted');
	},
	//@* signals || AppUI
	directMessage: function(inUsername, inAccountId) {
		var id = inTweet.account_id || App.Prefs.get('currentUser');
		this.composePrep();
		this.$.composePopup.directMessage({ to: inUsername, text: null, account_id: id });
	},
	//@* private
	//@* removes a already deleted tweet from all columns
	removeTweetById: function (inTweetId) {
		this.columnsFunction('removeTweetById', inTweetId);
	},








	//@* special column utils

	//@* public
	//@* returns the 3 standard columns
	getDefaultColumns: function(_inAccountId) {
		var	default_columns = [
			{type: SPAZ_COLUMN_HOME, accounts: [App.Prefs.get('currentUser')], id: _.uniqueId(new Date().getTime())},
			{type: SPAZ_COLUMN_MENTIONS, accounts: [App.Prefs.get('currentUser')], id: _.uniqueId(new Date().getTime())},
			{type: SPAZ_COLUMN_MESSAGES, accounts: [App.Prefs.get('currentUser')], id: _.uniqueId(new Date().getTime())}
		];
		return default_columns;
	},
	//@* public
	//@* save data I.E. tweets, cache to localStorage
	saveColumnData: function(user) {
		if (App.Prefs.get('save-on-exit') != true) return;

		if (user == null) user = App.Prefs.get('currentUser');

		var maxTweets = SPAZ_DEFAULT_PREFS.maxTweets,
			maxCached = SPAZ_DEFAULT_PREFS.maxCached,
			save_cols = [],
			trim = function (obj, num) {
				if (obj && obj.length > num) obj.splice(num, obj.length - num);
				return obj;
			};
		this.saveColumnTweets();
		var _colData = enyo.clone(this.columnData);
		enyo.forEach(_colData, function(_d) {
			var getCache = function() {
					var _cache = [];
					if (_d.cache) {
						enyo.forEach(_d.cache, function(_c){
							_cache.push(trim(_c, maxCached));
						}, this);
					}
					return enyo.clone(_cache);
				},
				_col = {
					id: _d.id,
					type: _d.type,
					accounts: _d.accounts,
					query: _d.query,
					service: _d.service,
					list: _d.list,
					tweets: trim(_d.tweets, maxTweets) || [],
					cache: getCache() || []
				};
			if ( _col.tweets.length > 0 ||
				(_col.cache && _col.cache[0] && _col.cache[0].length > 0) )
					save_cols.push(_col);
		});
		App.Prefs.set('columns_' + user, save_cols);
		this.log(enyo.clone(save_cols));
	},
	//@* private
	//@* helper
	findIn: function(a, b) {var c = -1; for (var d in b) {c++; if (b[d].type == a) return c} return false},
	//@* private
	//@* pulls data from column so it can be saved
	saveColumnTweets: function() {
		var _il = 0,
			_data = this.columnData,
			_i = 0;
		for ( var _c in this._boxes[0]) {
			var _col = this._boxes[0][_c];

			for ( var i in _data) {
				if (_data[parseInt(i)].id == _col.info.id) _i = parseInt(i);
			}

			if (_data[_i].id == _col.info.id) {
				if (_col.cache && _col.cache[0] && _col.cache[0].length > 0)
					_data[_i].cache = enyo.clone(_col.cache);
				else _data[_i].tweets = enyo.clone(_col.tweets);
				//this.log('data updated:', _data[_i]);
			}// else this.log('data not found:', _i, _data, _data[i], _col);
		};
	},
	//@* private
	//@* scroll alternate to top, unread, and bottom
	//@* toolbar tapped function
	scrollBehavior: function(s, e) {
		var _col = this.$.timeline.children[0].rotateScroll();
	},
	//@* private
	//@* mark items read on toolbar hold
	//@* toolbar hold function
	holdBehavior: function(inSender, inEvent) {
		var holdBehavior = App.Prefs.get('toolbar-hold');
		switch (holdBehavior) {
			case 'mark-read':
				this.$.timeline.children[0].markAllAsRead();
				break;
			case 'do-nothing':
				//do a crazy dance
				break;
		}
	},








	//@* detail view functions

	//@* public
	//@* display a tweet
	showTweetView: function(inTweet) {
		if (!this.$.detailContent) this.boxes.swap('detailContent');

		if (!this.actions.length || this.actions[this.actions.length - 1] != 'detailContent')
			this.actions.push('detailContent');

		var active = this.$.detailContent.getActive(),
			tweetName = 'tweet-' + inTweet.spaz_id,
			searchIn = function(s, n) { for (var c in s) { if(s[c].name === n) return parseInt(c) } return false},
			tweetExistsIndex = searchIn(this.$.detailContent.getPanels(), tweetName);

		if (active && active.setScrollPosition)
			active.setScrollPosition();

		if ( typeof tweetExistsIndex === 'number' ) {
			// the user is already in the view stack.
			// we need to pop it like it's hot and move it to the end of the stack
				//console.log('moving...')
				var moveIt = this.viewEvents.splice(tweetExistsIndex, 1);
				this.viewEvents.push(moveIt);
			// then we need to destroy the old panel, because we create it down below
				this.$.detailContent.getPanels()[tweetExistsIndex].destroy();
		} else // panel doesn't exist, just push it to the view stack
			this.viewEvents.push({type: (inTweet.is_private_message === true) ? 'message' : 'tweet', tweet: inTweet});

		// we create the component no matter what
		this.$.detailContent.createComponent(
			{name: tweetName, kind: 'Neo.TweetView', onDestroy: 'hideDetailPane', onGoPreviousViewEvent: 'goPreviousViewEvent',
				onGetViewEvents: 'getViewEvents', onShowImageView: 'showImageView'},
		{owner: this});

		this.$.detailContent.render();
		this.$[tweetName].render();
    	this.$[tweetName].setTweet(inTweet);
		this.$.detailContent.setIndex(this.$.detailContent.getPanels().length - 1);
	},
	//@* public
	//@* display a user
	showUserView: function(inUsername, inService, inAccountId, inColumnIndex) {
		if (!this.$.detailContent) this.boxes.swap('detailContent');

		if (!this.actions.length || this.actions[this.actions.length - 1] != 'detailContent')
			this.actions.push('detailContent');

		var active = this.$.detailContent.getActive(),
			userId = 'user-' + inUsername + '-' + inService + '-' + inAccountId,
			searchIn = function(s, n) { for (var c in s) { if(s[c].name === n) return parseInt(c) } return false},
			userExistsIndex = searchIn(this.$.detailContent.getPanels(), userId);

		if (active && active.setScrollPosition) active.setScrollPosition();

		if ( typeof userExistsIndex === 'number' ) {
			// the user is already in the view stack.
			// we need to pop it like it's hot and move it to the end of the stack
				//console.log('moving...');
				var moveIt = this.viewEvents.splice(userExistsIndex, 1);
				this.viewEvents.push(moveIt);
			// then we need to destroy the old panel, because we create it down below
				this.$.detailContent.getPanels()[userExistsIndex].destroy();
		} else // panel doesn't exist, just push it to the view stack
			this.viewEvents.push({type: 'user', user: {username: inUsername, type: inService, account_id: inAccountId}});

		// we create the component no matter what
		this.$.detailContent.createComponent(
			{name: userId, kind: 'Neo.UserView', onDestroy: 'hideDetailPane', onGoPreviousViewEvent: 'goPreviousViewEvent', onGetViewEvents: 'getViewEvents'},
		{owner: this});

		this.$.detailContent.render();
		this.$[userId].render();
    	this.$[userId].showUser(inUsername, inService, inAccountId);
		this.$.detailContent.setIndex(this.viewEvents.length - 1);
	},
	//@* private
	//@* previous page in details
	//@* bubbled from details content back button
	goPreviousViewEvent: function(inSender) {
		this.$.detailContent.getPanels().pop();
		this.viewEvents.pop();
		this.$.detailContent.render();
		if (this.viewEvents.length == 0 || this.$.detailContent.getPanels().length == 0) return this.hideDetailPane();
		this.$.detailContent.setIndex(this.$.detailContent.getPanels().length - 1);
		this.$.detailContent.getActive().render();
	},
	//@* private
	//@* returns the view events stack
	//@* bubbled from event
	getViewEvents: function(inSender, callback) {
		callback(this.viewEvents);
	},
	//@* private
	//@* hides the details content, destroying everything inside
	hideDetailPane: function() {
		var _p = this.$.detailContent.getPanels();
		enyo.forEach(_p, function(panel) {
			_p.pop();
			this.viewEvents.pop();
			this.$.detailContent.render();
		}, this);
		this.$.detailContent.destroyClientControls();
		this.viewEvents = [];
		this.actionBack();
	},
});
