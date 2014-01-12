enyo.kind({
	name: "Neo.Header",
	layoutKind: "FittableColumnsLayout",
	style: "width: 100%;",
	
	//TODO
	/*
	 * add published w/ all these properties
	 * change the files that use header (i.e. tweet.js)
	 * then on anything changed call a fn that sets all the properties and shows / hides the right ones
	 * also, add extra themish properties i.e. condensed..
	 */
	
	published: {
		author_full: "",
		author_short: "",
		rt_full: "",
		rt_short: "",
		unread: false,
		favorite: false,
		'private': false,
		
		extra: null
	},
	
	components: [
		{name: "usernames", style: "float: left;", components: [
			// tweet info stuff
			{name: "author_short", classes:'neo-tweet-big neo-tweet-username'},
			{name: "author_full", classes:'neo-tweet-bigger'}
			// tweet info stuff
		]},
		{name: "extra", layoutKind: "FittableColumnsLayout", style: "float: right;", components: [
			// indicators
			// unread
				{name: "unread", kind: "Neo.Icon", icon: "flash", //_res: 'hdpi/',
					classes: "", style:'height: 13px; width: 13px;', showing: false},
			// favorite
				{name: "favorite", kind: "Neo.Icon", icon: "heart", //_res: 'hdpi/',
					classes: "", style:'height: 13px; width: 13px;', showing: false},
			// private
				{name: "private", kind: "Neo.Icon", icon: "lock_closed", //_res: 'hdpi/',
					classes: "", style:'height: 13px; width: 13px;', showing: false},
				
		]}
	],
	
	create: function() {
		this.inherited(arguments);
		this.extraChanged();
		this.render();
		this.log('yeah', this.private);
	},
	
	refresh: function() {
		this.$.unread.iconChanged();
		this.$.favorite.iconChanged();
		this.$.private.iconChanged();
	},
	
	reset: function() {
		for(var property in this.published){
			if (property != "extra")
				this["set" + property[0].toUpperCase() + property.substr(1)](null);
		}
	},
	author_fullChanged: function(oldValue) {
		this.$.author_full.setContent(this.author_full);
	},
	author_shortChanged: function(oldValue) {
		this.$.author_short.setContent(this.author_short);
	},
	rt_fullChanged: function(oldValue) {
		//this.$.author_full.setContent(this.rt_full);
		//this.$.rt_full.setShowing(this.rt_full != null);
		//this.$.rt.setShowing(this.rt_full != null);
	},
	rt_shortChanged: function(oldValue) {
		//this.$.author_short.setContent(this.rt_short);
		//this.$.rt_short.setShowing(this.rt_full != null);
	},
	unreadChanged: function(oldValue) {
		this.$.unread.setShowing(this.unread);
	},
	favoriteChanged: function(oldValue) {
		this.$.favorite.setShowing(this.favorite);
	},
	privateChanged: function(oldValue) {
		this.$.private.setShowing(this.private);
	},
	extraChanged: function(oldValue) {
		if (this.extra != null) {
			this.$.extra.createComponent(this.extra, {owner:this.owner});
		}
	}
});
