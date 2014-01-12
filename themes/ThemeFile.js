window.saving = {};
enyo.kind({
	/*
	 * 
	 * 
	 * official neo theme file
	 * one file to rule htme all
	 * 
	 * every theme element type needs to have {kind: 'Neo.ThemeFile'} included in that file
	 * this file treats its owner as a true authentic official neo theme
	 * this automagically gives that theme file magical properties that only the greatest of files could ever achieve
	 * there once was a magical file that thought it had greater properties, but none were as great as the official neo theme file
	 * **use wisely
	 * 
	 */
	name: 'Neo.ThemeFile',
	kind: 'Control',
	showing: false,
	
	//@* published
	published: {
		//@* this is special, because this holds the current theme for the parent object to feed from
			styles: {},
			highlight: {},
		//@* the current theme for the element. select 'custom' for manual override
			theme: '',
		//@* the element type I.E. button
			type: '',
		//@* active list of valid theme objects
			elements: ['tweet','toolbar','subtext','richText','spinner','sidebar','button'],
		//@* element types at bottom of file
	},
	
	//@* override
	create: function() {
		this.inherited(arguments);
		this.createComponent({kind: 'Signals', loadTheme: 'signalLoad', saveTheme: 'saveTheme', saveQuickTheme: 'saveQuickTheme',
			loadCustom: 'loadCustom', saveToThemesList: 'saveToThemesList', deleteTheme: 'deleteTheme'},
			{owner: this});
		this.owner.loadTheme = this.loadTheme.bind(this);
	},
	
	//@* published
	//@* called on this.setTheme()
	themeChanged: function(oldVal) {
		var _t = this.theme,
			_l = this.getDefaults(),
			_c = this.getCustom();
		if (_c[_t]) enyo.mixin(_l, _c[_t]);
			else enyo.mixin(_l, this._load());
		//this.log(copy(_l), _t);
		this.setHighlight(_l.highlight);
		this.setStyles(_l.styles);
		this.bubble('onUpdate', _l.styles || _l);
	},
	
	//@* published
	//@* called on setHighlight
	highlightChanged: function(oldVal) {
		if (!this.highlight) this.highlight = {};
		this.highlight = this.owner.highlight = copy(this.highlight);
	},
	//@* published
	//@* called on setHighlight
	stylesChanged: function(oldVal) {
		if (!this.styles) this.styles = {};
		this.styles = copy(this.styles);
	},
	
	//@* private
	//@* converts an easy to read style to CSS
	toCSS: function(style) {
		switch (style) {
			case 'background': return 'background'; break;
			case 'textColor': return 'color'; break;
			case 'textSize': return 'font-size'; break;
			case 'borderColor': return 'border-color'; break;
			case 'borderWidth': return 'border-width'; break;
			case 'borderTopSize': return 'border-top-width'; break;
			case 'borderTopColor': return 'border-top-color'; break;
			case 'borderRightSize': return 'border-right-width'; break;
			case 'borderRightColor': return 'border-right-color'; break;
			case 'borderBottomSize': return 'border-bottom-width'; break;
			case 'borderBottomColor': return 'border-bottom-color'; break;
			case 'borderLeftSize': return 'border-left-width'; break;
			case 'borderLeftColor': return 'border-left-color'; break;
			case 'padding': return 'padding'; break;
			case 'margin': return 'margin'; break;
			case 'backgroundColor':
				case 'highlightColor': return 'background-color'; break;
			case 'letterSpacing': return 'letter-spacing'; break;
			case 'cornerRadius': return 'border-radius'; break;
			case 'textTransform': return 'text-transform'; break;
			case 'textWeight': return 'font-weight'; break;
			default: return style; break;
		}
	},
	
	//@* public
	//@* called on theme init
	//@* loads the current saved theme for type
	loadSaved: function() {
		if (this.isPreview()) return this.preview(this.owner.themePreview);
		try {
		    var _svd = this._load();
	   }catch(e) { _svd = {}}
		if (_svd && _svd.name) this.loadTheme(_svd.name);
			else if (!_svd || !_svd.name) {
				this.loadTheme(this.getStatics().defaultTheme);
				this.saveTheme();
			}
	},
	
	//@* public
	//@* customize the current theme
	customize: function() {
		var _cstm = this.getCustom(),
			_el = this[this.getType()],
			newThemes = [],
			_cmzr;
		for (var _c in _cstm)
			if (enyo.indexOf(_cstm[_c].name, _el.themes) == -1 && _cstm[_c].name)
				_el.themes.push(_cstm[_c].name);
		_cmzr = {type: this.getType(), element: _el, styles: this.loadStyles(),
			highlight: this.loadHighlight(), themes: enyo.mixin(copy(this.owner.themes), _cstm)}
		this.log(this.getType(), _cmzr);
		enyo.Signals.send('customize', {theme: JSON.stringify(_cmzr)});
	},
	
	
	
	
	
	//@* SIGNALS
	
	//@* public
	//@* from signals
	//@* loads the signaled theme
	signalLoad: function(s, sg) {
		//this.log(s, sg);
		if (this.getType() === sg.type || sg.type === 'override') {
			if (sg.theme == 'saved' ) this.loadSaved();
				else this.loadTheme(sg.theme);
		}
		//this.log('exiting..');
	},
	
	//@* public
	//@* from signals
	//@* saves the signal theme to themes
	saveQuickTheme: function(s, sg) {
		//this.log(this, this.type, sg.theme.type);
		if (!this.getType() || this.getType() == null) this.log(this, this.getType(), s, sg);
		if (this.getType() != sg.theme.type) return;
		this.owner.sample = true;
		//this.log('SAVING.............', sg.theme.type, window.saving, this.type);
		if (window.saving[this.getType()] != null) {
			setTimeout((function(){delete this.owner.sample}).bind(this), 4000, this);
			return;
		}
		window.saving[this.getType()] = true;
		var c = this.getCustom(),
			_cstm = enyo.clone({name: sg.theme.name, styles: sg.theme.styles, highlight: sg.theme.highlight});
		//this.log('SAVING QUICK THEME.............');
		this.theme = _cstm.name;
		this.setStyles(/*enyo.mixin(this.getDefaults().styles, */_cstm.styles/*)*/);
		this.setHighlight(/*enyo.mixin(this.getDefaults().highlight, */_cstm.highlight/*)*/);
		this.saveTheme();
		this.saveCustom(_cstm);
		enyo.Signals.send('loadTheme', {type: this.getType(), theme: _cstm.name});
	},
	stripNull: function(object) {
		for (var key in object) {
			if (object[key] == null || !object[key]) delete object[key];
		}
	},
	
	//@* public
	//@* from signals
	//@* saves the signal theme to themes
	saveToThemesList: function(s, sg) {
		var theme = JSON.parse(sg.theme);
		if (!theme.override || window.saving[this.getType()] != null) {
			if (!this._fromThemes()) return;
			if (!this.isPreview()) return;
		}
		var c = this.getCustom(),
			_cstm = {name: theme.name, styles: theme.styles, highlight: theme.highlight};
		this.log(theme);
		this.theme = _cstm.name;
		this.setStyles(_cstm.styles);
		this.setHighlight(_cstm.highlight);
		this.saveTheme();
		this.saveCustom(_cstm);
		if (!theme.override) enyo.Signals.send('loadTheme', {type: this.getType(), theme: 'saved'});
		//else enyo.Signals.send('loadTheme', {type: this.type, theme: sg.theme.name});
	},
	//@* private
	//@* determines if themefile belongs to themes object
	_fromThemes: function() {
		var ft = !(this.owner.name == 'preview' || this.owner.name == 'previewH');
		return !ft;
	},
	
	//@* public
	//@* from signals
	//@* saves and then loads the theme that's sent
	loadCustom: function(s, sg) {
		var theme = JSON.parse(sg.theme);
		if (!theme.override) {
			if (!this._fromThemes()) return;
			if (!this.isPreview()) return;
		}
		//this.log(sg.theme.type, this.type)
		if (this.getType() === theme.type) {
			this.log(s, theme);
			this.theme = 'custom';
			this.setStyles(theme.styles);
			this.setHighlight(theme.highlight);
			this.saveTheme();
			enyo.Signals.send('loadTheme', {type: this.getType(), theme: 'saved'});
		}
	},
	
	//@* public
	//@* from signals
	//@* deletes a theme by theme name
	deleteTheme: function(s, sg) {
		if (!this.isPreview() || !sg.theme) return;
		try {
			var _cstm = JSON.parse(App.Prefs.get(sg.type + '_customThemes'));
			if (!_cstm[sg.theme]) return;
			delete _cstm[sg.theme];
			App.Prefs.set(sg.type + '_customThemes', JSON.stringify({}));
			enyo.forEach(_cstm, function(_c) {
				this.saveCustom(_c);
			}, this);
			var elThemes = this[sg.type].themes;
			for (var el in elThemes) if (elThemes[el] == sg.theme) elThemes.splice(parseInt(el), 1);
			if (sg.callback) sg.callback(true);
		} catch (e) {if (sg.callback) sg.callback(false)}
	},
	
	
	
	
	
	
	
	
	//@* theme helpers
	
	//@* public
	//@* updates the theme preview with the styles and highlight
	updatePreview: function(styles, highlight) {
		this.setHighlight(highlight);
		this.setStyles(styles);
		if (styles.layout && this.validate(styles.layout) && styles.layout != 'custom')
			this.theme = styles.layout;
		this.bubble('onUpdate', styles);
	},
	//@* public
	//@* loads a preview for the first time
	preview: function(theme) {
		if (!this.validate(theme)) return this.deleteTheme(null, {theme: theme});
		var _load = {},
			_cust;
		this.theme = theme;
		_load = this.getDefaults();
		_cust = this.getCustom();;
		if (_cust[theme]) enyo.mixin(_load, _cust[theme]);
			else if (theme === 'custom') enyo.mixin(_load, this._load());
		this.setHighlight(_load.highlight);
		this.setStyles(_load.styles);
		this.bubble('onUpdate', _load.styles || _load);
	},
	//@* public
	//@* loads a theme from a theme name
	loadTheme: function(t) {
		if (!this.validate(t)) t = this.getStatics().defaultTheme;
		this.setTheme(t);
	},
	//@* public
	//@* applies styles to an enyo instance
	stylize: function(_load, _ctx) {
		this.stripNull(_load);
		// console.log('loading styles...', styles, context);
		for (var _key in _load) {
			//@* copy the style property before we modify the key
				var _val = _load[_key];
			//@* convert key to CSS
				_key = this.toCSS(_key);
			//@* load the style
				if (_key != '') _ctx.applyStyle(_key, _val);
					else _ctx.applyStyle(_key, null);
		}
	},
	
	
	
	
	
	
	
	
	
	
	//@* themefile helpers
	
	//@* public
	//@* saves the current theme only if the owner is a sample
	saveTheme: function() {
		if (!this.isSample()) return;
		var _n = this.getType() + '_theme',
			_statics = this.getStatics(),
			_saveObj = enyo.mixin({
				name: this.theme,
				styles: _statics.styles,
				highlight: _statics.highlight
			}, {
				styles: this.getStyles(),
				highlight: this.getHighlight()
			});
		
		//delete _saveObj.styles.originator;
		this.log(_n, _saveObj.name, _saveObj);
		_saveObj = JSON.stringify(_saveObj);
		
		App.Prefs.set(_n, _saveObj);
	},
	//@* public
	//@* saves the current theme to the custom slot
	saveCustom: function(_c) {
		var _cstm = this.getCustom();
		_cstm[_c.name] = _c;
		
		this.log('Saving custom slot...', _c.name, _c, _cstm);
        _cstm = JSON.stringify(_cstm);
		App.Prefs.set(this.getType() + '_customThemes', _cstm);
	},
	//@* public
	//@* gets styles from localStorage and loads to this.styles
	loadStyles: function() {
		var _n = this.getType() + '_theme',
			_l = JSON.parse(App.Prefs.get(_n));
		//@* reset this.styles
			this.setStyles({});
		//@* if theme doesn't exist, saveTheme will create it
			if ( !_l || !_l.name || !_l.styles) this.saveTheme();
		_l = JSON.parse(App.Prefs.get(_n)) || {};
		if (!_l.styles) { _l.styles = this.getStatics().styles; enyo.mixin(_l.styles, this.getDefaults().styles); }
		this.setStyles(_l.styles);
		//this.log(_l);
		return this.getStyles();
	},
	//@* public
	//@* gets highlight from localStorage and loads to this.highlight
	loadHighlight: function() {
		var _n = this.getType() + '_theme',
			_l = JSON.parse(App.Prefs.get(_n));
		//@* reset this.highlight
			this.setHighlight({});
		//@* if theme doesn't exist, saveTheme will create it
			if ( !_l || !_l.name || !_l.highlight) this.saveTheme();
		_l = JSON.parse(App.Prefs.get(_n)) || {};
		if (!_l.highlight) { _l.highlight = this.getStatics().highlight; enyo.mixin(_l.highlight, this.getDefaults().highlight); }
		//if (!_l.highlight) _l.highlight = enyo.mixin(this.getStatics().highlight, this.getDefaults().highlight);
		this.setHighlight(_l.highlight);
		//this.log(_load);
		return this.getHighlight();
	},
	
	//@* private
	//@* returns new instance of static hard-coded, empty theme
	getStatics: function() {
		var s = enyo.clone(this[this.getType()]);
		return s;
	},
	//@* private
	//@* returns new instance of current theme defaults
	getDefaults: function() {
		var d = {};
		if (this.theme != 'custom' && this.validate(this.theme)) d = this.getOwnerTheme(this.theme);
			else if (this.theme == 'custom' && this.validate(this.styles.layout)) d = this.getOwnerTheme(this.styles.layout);
			else if (this.validate(this.getStatics().defaultTheme)) d = this.getOwnerTheme(this.getStatics().defaultTheme);
		if (!d.theme) d.theme = this.getOwnerTheme(this.getOwnerTheme(this.getStatics().defaultTheme).styles.layout).theme;
		//this.log(d);
		return d;
	},
	getOwnerTheme: function(t) {
		var c = enyo.clone(this.owner.themes[t]) || {};
		return c;
	},
	//@* private
	//@* returns new instance of custom themes object
	getCustom: function() {
	    try {
		  var c = JSON.parse(App.Prefs.get(this.getType() + '_customThemes')) || {};
		} catch(e) {c = {}}
		if (c == {}) App.Prefs.set(this.getType() + '_customThemes', JSON.stringify(c));
		c = enyo.clone(c);
		//this.log(c, JSON.parse(localStorage.preferences_json))
		return c;
	},
	//@* private
    //@* returns new instance of custom themes object
	_load: function() {
	    try {
          var c =  JSON.parse(App.Prefs.get(this.getType() + '_theme')) || {};
        } catch(e) {c = {}}
	  return c;
	},
	//@* private
	//@* check if a theme name is valid
	validate: function(theme) {
		if (!theme || typeof theme === undefined || typeof theme != "string") return false;
		var test;
		//@* custom
			if (theme.toLowerCase() === 'custom') return true;
		//@* if there is no type defined, invalid
			if (!this.getType() || !this[this.getType()]) return false;
		//@* check if the theme exists
			test = this[this.getType()].themes;
			for (var r in test) if (test[r] == theme) {return true}
		//@* invalid
			return false;
	},
	//@* private
	//@* load the theme defaults
	loadDefaults: function() {
		this.loadTheme(this.getStatics().defaultTheme);
	},
	//@* private
	//@* returns true if this is attached to a preview object
	isPreview: function() {
		return (this.owner.preview === true);
	},
	//@* private
	//@* returns true if this is attached to a sample object
	isSample: function() {
		return (this.owner.sample === true);
	},
	
	
	
	
	
	
	
	
	
	
	
	// elements
		button: {
			//@* public
			defaultTheme: 'blue',
			themes: ['neo', 'aqua', 'blue', 'onyx'],
			
			//@* protected
			styles: {
				backgroundColor: '',
				textColor: '',
				textSize: '',
				textWeight: '',
				letterSpacing:'',
				textTransform: '',
				borderWidth: '',
				borderColor: '',
				cornerRadius: '',
				//buttonStyle: '',
			},
			/*highlight: {
				backgroundColor: '',
				textColor: '',
				borderColor: '',
			}*/
		},
		toolbar: {
			//@* public
			defaultTheme: 'kakhi',
			themes: ['neo', 'kakhi', 'onyx', 'red', 'steel', 'blue', 'green', 'forest', 'bruins'],
			//@* protected
			styles: {
				backgroundColor: '',
				textColor: '',
				textSize: '',
				textWeight: '',
				letterSpacing:'',
				textTransform: '',
				margin: '',
				padding: ''
			}
		},
		sidebar: {
			//@* public
			defaultTheme: 'neo',
			themes: ['neo', 'onyx'],
			//@* protected
			styles: {
				background: '',
				borderColor: '',
				borderWidth: '',
			}
		},
		sidebarItem: {
			//@* public
			defaultTheme: 'murky',
			themes: ['neo', 'aqua', 'murky', 'onyx'],
			//@* protected
			styles: {
				width: '',
				backgroundColor:'',
				textColor:'',
				textSize:'',
				textWeight: '',
				letterSpacing:'',
				textTransform: '',
				borderLeftSize: '',
				borderRightSize: '',
				borderLeftColor: '',
				borderRightColor: '',
				borderTopSize: '',
				borderBottomSize: '',
				borderTopColor: '',
				borderBottomColor: ''
			},
			highlight: {
				backgroundColor:'',
				textColor:'',
				textSize:'',
				textWeight: '',
				letterSpacing:'',
				textTransform: '',
				borderLeftSize: '',
				borderRightSize: '',
				borderLeftColor: '',
				borderRightColor: '',
				borderTopSize: '',
				borderBottomSize: '',
				borderTopColor: '',
				borderBottomColor: ''
			}
		},
		tweet: {
			//@* public
			defaultTheme: 'blue',
			themes: ['neo', 'official', 'officialCondensed', 'blue', 'onyx'],
			//@* protected
			styles: {
				layout: '',
				backgroundColor: '',
				textColor: '',
				textSize: '',
				textWeight: '',
				letterSpacing: '',
				textTransform: '',
				borderLeftSize: '',
				borderRightSize: '',
				borderLeftColor: '',
				borderRightColor: '',
				borderTopSize: '',
				borderBottomSize: '',
				borderTopColor: '',
				borderBottomColor: '',
				padding: '',
				margin: '',
			},
			//@* fullname and username
			highlight: {
				textColor: '',
				textSize: '',
				textWeight: '',
				letterSpacing: '',
				textTransform: '',
			}
		},
		popupList: {
			//@* public
			defaultTheme: 'cloudy',
			themes: ['neo', 'cloudy', 'onyx'],
			//@* protected
			styles: {
				backgroundColor: '',
				textColor: '',
				textSize: '',
				textWeight: '',
				letterSpacing: '',
				borderColor: '',
				borderWidth: '',
				textTransform: '',
				padding: '',
				margin: '',
				width: '',
			}
		},
		richText: {
			//@* public
			defaultTheme: 'neo',
			themes: ['neo', 'onyx', 'onyx'],
			//@* protected
			styles: {
				backgroundColor: '',
				textColor: '',
				textSize: '',
				textWeight: '',
				letterSpacing: '',
				borderColor: '',
				borderWidth: '',
				textTransform: '',
				padding: '',
				margin: '',
				width: '',
			}
		}
});
