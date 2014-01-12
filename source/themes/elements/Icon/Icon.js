enyo.kind({
	name: "Neo.Icon",
	
	
	kind: 'Image',
	/*components: [
		{name: 'image', kind : "Image"}
	],*/
	classes: 'onyx-icon neo-icon',
	
	published: {
		//@* public
		//@* external icon name
			icon: '', // ex: 'timeline'
			type: '', // ex: 'button'
		
		//@* private
		//@* determines which resolution to show the icon at
			_res: 'hdpi/',
		//@* what is the colour of the icon
			_col: null,
		//@* filename prefix
			_pre: 'ic_action_',
		//@* file extension
			_ext: '.png',
		
		//@* private icon name
			_intname: 'home',
		//@* complete location of icon
		//@* \media\cryptofs\apps\usr\palm\applications\com.fxjm.neo\assets\icons\holo_dark\hdpi\ic_action_android.png
			_fullpath: '',
		//@* short relative location
		//@* \assets\icons\holo_dark\hdpi\ic_action_android.png
			_relpath: '',
	},
	//@* constants
		AROOT: enyo.fetchAppRootPath(),
		IROOT: 'assets/icons/',
	
	//@* override
	create: function() {
		this.inherited(arguments);
		//if (this.icon != '') this.iconChanged();
	},
	
	rendered: function() {
		var r = this.inherited(arguments);
		//FIXME
		this.iconChanged();
		return r;
	},
	
	//@* published
	//@* called on .setIcon
	iconChanged: function(old) {
		var _i = this.icon;
		//@* clear the current icon
			this.setSrc('');
		//@* convert the external name to the icon name
			this.set_intname( ( (_i.search('.png') != -1) || (_i.search('http') != -1) ) ? _i : this.externalToInternal(_i) );
		//@* generate the full and relative paths
			this.generate(this._intname);
		//this.log(_i, this._fullpath, this._relpath);
		//@* set the SRC
		this.setSrc(this._fullpath);
		return;
		var x = new Image();
		var self = this;
		x.onload = enyo.bind(this, function(e) {
			//self.applyStyle('width', (this.width || 48) + 'px');
			//self.applyStyle('height', (this.height || 48) + 'px');
		}, this);
		x.onerror = enyo.bind(this, function(e) {
			//self.applyStyle('width', 0 + 'px');
			//self.applyStyle('height', 0 + 'px');
			self.applyStyle('display', 'none');
		});
		x.src = this._fullpath;
		
	},
	
	
	
	//@* public
	//@* creates _fullpath and _relpath from an internal name
	generate: function(_i) {
		if ( (_i.search('.png') != -1) || (_i.search('http') != -1) ) {this.set_relpath(_i); return this.set_fullpath(_i)}
		
		this.setCloseColor();
		var color = this._col || 'white/';
		
		var _r = this.IROOT + color + this._res + this._pre + '' + _i + '' + this._ext,
			_f = this.AROOT + _r;
		this.set_relpath(_r);
		this.set_fullpath(_f);
	},
	
	
	setCloseColor: function() {
		if (!document.getElementById(this.id) || this._col != null) return;
		
		var textRGB = this.getRGB(document.getElementById(this.id).style.color);
		var bgRGB = this.getRGB(document.getElementById(this.id).style.backgroundColor);
		
		//this.log('text color: ', RGB);
		
		var colors = ['black', 'blue_dark', 'blue_light', 'green_dark', 'green_light', 'holo_dark', 'holo_light', 
		   'purple_dark', 'purple_light', 'red_dark', 'red_light', 'white', 'yellow_dark', 'yellow_light'];
		var iconcolorrgb = [[0,0,0], [0,153,204], [81,172,190], [102,153,0],
		                    [153,204,0], [255,255,255], [123,123,123], [153,51,204],
		                    [170,102,204], [204,0,0], [255,68,68], [255,255,255],
		                    [255,136,0], [255,187,51]]
		
		var closest = '';
		var shortestDistance = 255 * 3;
		for ( var i = 0; i < colors.length; i++) {
			var dis = this.getColorDistance(textRGB, iconcolorrgb[i]);
			//this.log(textRGB, dis, iconcolorrgb[i], colors[i]);
			if (dis < shortestDistance) {
				closest = colors[i];
				shortestDistance = dis;
			}
			
			var dis = this.getColorDistance(bgRGB, iconcolorrgb[i]);
			//this.log(bgRGB, dis, iconcolorrgb[i], colors[i]);
			if (dis < shortestDistance) {
				closest = colors[i];
				shortestDistance = dis;
			}
		}
		
		//this.log(closest, shortestDistance);
		if (closest != '') this._col = closest + '/';
		
	},
	
	getColorDistance: function( c1, c2 ) {
		//distance = the square root of ( (r1 - r2)[squared] + (g1 -g2)[squared] + (b1 - b2)[squared]
		//in other words:
		
		var dist = Math.abs(c1[0] - c2[0]) + Math.abs(c1[1] - c2[1]) + Math.abs(c1[2] - c2[2]);
		
		
		var r = (c1[0] - c2[0]);
		r = r * r;
		var g = (c1[1] - c2[1]);
		g = g * g;
		var b = (c1[2] - c2[2]);
		b = b * b;
		var sum = r + g + b;
		var colorDistance = Math.sqrt(sum);
		
		
		return dist;
	},
	
	//@* public
	//@* gets the RGB value of a color by name, hex, or any other means
	getRGB: function(color) {
		var rgb = '',
			probe = this.createComponent({tag:'div', style: 'color:' + color + ';'}, {owner:this});
		probe.render();
		rgb = probe.getComputedStyleValue('color');
		probe.destroy();
		if (typeof rgb != 'undefined') {
			rgb = rgb.match(/\d+/g);
			rgb[0] = parseInt(rgb[0]);
			rgb[1] = parseInt(rgb[1]);
			rgb[2] = parseInt(rgb[2]);
		}
		return rgb || [0,0,0];
	},
	
	
	
	
	_whatWith: function(h, k) {
		return {_what: h, _with: k}
	},
	//@* public
	//@* converts an object name or item to it's designated icon
	externalToInternal: function(_i) {
		var r = this._whatWith,
			//@* some will have to use the same icons
			_special = [
				//@* BUGS
				//r(['members','subscribers','favorite'], 'bug'),
				//@* others
				r(['conversation', 'messages'], 'messages'),
				r(['following', 'followers', 'accounts'], 'users'),
				r(['favorited', 'favorites'], 'star'),
			],
			//@* put underscores before so we can type the whole thing
			_match = {
				//@* perfect match
					_twitter: 'twitter',	// account name
					_filters: 'filter',		// filters
					_inbox: 'inbox',		// DM inbox
					_search: 'search',		// search
					_send: 'send',			// send
					_refresh: 'reload',		// refresh
					_help: 'help',			// help
					_email: 'mail',			// mail | email
					_share: 'share',		// share
					_compose: 'edit',		// compose | edit pencil
					_profile: 'user',		// single
					_users: 'users',		// multiple
					_lists: 'list_2',			// list
					_delete: 'trash',		// trash can
					_star: 'star_10',	// favorited
					_unfavorited: 'star_0',	// non favorited
					_favorite: 'star_10',
				
				//@* solid match
					_close: 'exit',			// exit door
					_reply: 'goleft',		// reply backwards symbol
					_retweet: 'share_2',	// retweet share symbol
					_config: 'gear',		// settings | config gear
					_unpinned: 'pin',		// not pinned, show hovering pin
					_mentions: 'sms',
					_block: 'shield',		// shield for blocking
					_unblock: 'halt',		// slashed circle to unblock
				
				//@* decent match
					_messages: 'dialog',	// messages | conversation bubbles
					_pinned: 'anchor',		// when pinned, show the anchor
					_settings: 'more',		// toolbar more button
					_attach: 'attachment_2',// attach paperclip
					_shorten: 'link',		// shorten link
				
				//@* poor match
					_trends: 'sort_1',		// trends
					_save: 'download',		// save is download
					_load: 'upload',		// load is upload
					_forward: 'arrow_right',// forward right arrow
					_back: 'arrow_left',	// back left arrow
					_new: 'edit',			// new, pencil? or plus?
				
				//@* no match
					_timeline: 'home',		// timeline
					_mention: 'happy',		// mention | mentions happy face
					_retweets: 'share_2',	// multiple retweets
					_outbox: 'plane',		// DM outbox
					_follow: 'signal',
					_unfollow: 'io'
			},
			_new;
		//@* loop through our specials...
		enyo.forEach(_special, function(_s) {
			if (enyo.indexOf(_i, _s._what) != -1) _i = _s._with;
		}, this);
		_new = _match['_'+_i];
		if (_new && typeof _new != undefined) return _new;
		//this.warn(_i, _new);
		//@* only reach this point if there is not an icon for an icon
		//this.error('NO ICON EXISTS:', _i, _special);
		else if (!_new && _i) return _i;
		else if (!_new && !_i) return 'bug';
		else if (_i) return _i;
		else return 'bug';
		
	}
});

