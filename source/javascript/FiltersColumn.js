enyo.kind({
	name: 'Neo.FiltersColumn',
	kind: 'Neo.Column',
	
	// SpazFilterChain.prototype.getFilterList
	// SpazFilterChain.prototype.processArray
	// SpazFilterChain.prototype.nukeFilters
	// SpazFilterChain.prototype.removeFilter
	// SpazFilterChain.prototype.addFilter
	
	published: {
		filters: [],
		tweets: [1]
	},
	
	_list_guts: [
		{name: 'item', kind: 'FittableColumns', fit: true, components: [
			{kind: 'Neo.Button', ontap: 'deleteFilter', icon: 'delete'},
			{name: 'persist', kind: 'onyx.ToggleButton', onChange: 'persist', onContent: 'keep', offContent: 'once'},
			{kind: 'FittableColumns', fit: true, components: [
				{name: 'filter', kind: 'Neo.Tweet.other'},
			]}
		]},
	],
	
	_radio_toolbar: [
		{kind: 'Neo.Toolbar', middle: [
			{kind: 'Neo.Button', text: 'Delete All', icon: 'list', ontap: 'nukeFilters'},
			{kind: 'Neo.Button', text: 'Add Filter', icon: 'new', ontap: 'newFilter'}
		]}
	],
	
	//@* override
	create: function() {
		AppUI.addFunction('addFilter', this.addFilter, this);
		this.inherited(arguments);
		this._radio_gen();
		var _px = App.Prefs.get('filters');
		enyo.forEach(_px, function(_pxe) {
			if (_pxe.persist == true) this.filters.push(_pxe);
		}, this);
		if (this.filters.length > 0) this.filtersRefresh();
	},
	//@* override
	loadData: function(opts) {
		var r = this.inherited(arguments);
		if (this.isLoading) return r;
	},
	//@* override
	setupRow: function(s, e) {
		var _i = e.index,
			_f = this.filters[_i];
		this.log(_f, _i, this)
		if (typeof _f === 'undefined') return;
		this.$.filter.setTweet({text: _f.text});
		this.$.persist.setValue(_f.persist);
	},
	persist: function(s, e) {
		var _i = e.index,
			_p = e.value;
		if (typeof _i != 'number' || !this.filters[_i]) return;
		this.filters[_i].persist = _p;
		App.Prefs.set('filters', this.filters);
	},
	gotFilters: function(fs) {
		var _fs = [],
			_fltr = this.filters[_i]
		for (var _i in fs) _fs.push({ text: fs[_i], persist: false });
		enyo.mixin(_fs, this.filters);
		this.log('got', _fs);
		App.Prefs.set('filters', _fs);
		this.setFilters(_fs);
		this.setTweets(_fs);
		
		if (this.$.list && this.$.list.completePull) this.$.list.completePull();
		else this.pullComplete();
		this.isLoading = false;
	},
	deleteFilter: function(s, e) {
		var _i = e.index,
			_fn = this.filters[_i].text;
		window._filter_chain.removeFilter(_fn);
		this.filtersRefresh();
	},
	nukeFilters: function(s, e) {
		window._filter_chain.nukeFilters();
		this.filtersRefresh();
	},
	newFilter: function(s, e) {
		AppUI.showMore('filterPopup');
	},
	addFilter: function(_f) {
		this.log(_f)
		window._filter_chain.addFilter(_f, window._filter_chain._neo_filter);
		this.filtersRefresh();
	},
	filtersRefresh: function() {
		this.log();
		this.tweets = [1];
		this.isLoading = true;
		this.loadNewer();
	},
});
