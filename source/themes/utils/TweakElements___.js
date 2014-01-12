enyo.kind({
	name: 'Neo.Themes_advanced',
	classes: 'neo-themes',
	layoutKind: 'FittableRowsLayout',
	style: '',
	fit: true,
	
	events: {
		onClose: ''
	},
	
	colors: ['custom', 'transparent', 'aliceblue', 'antiquewhite', 'aqua', 'aquamarine', 'azure', 'beige', 'bisque', 'black', 'blanchedalmond', 'blue', 'blueviolet', 'brown', 'burlywood', 'cadetblue', 'chartreuse', 'chocolate', 'coral', 'cornflowerblue', 'cornsilk', 'crimson', 'cyan', 'darkblue', 'darkcyan', 'darkgoldenrod', 'darkgray', 'darkgreen', 'darkkhaki', 'darkmagenta', 'darkolivegreen', 'darkorange', 'darkorchid', 'darkred', 'darksalmon', 'darkseagreen', 'darkslateblue', 'darkslategray', 'darkturquoise', 'darkviolet', 'deeppink', 'deepskyblue', 'dimgray', 'dodgerblue', 'firebrick', 'floralwhite', 'forestgreen', 'fuchsia', 'gainsboro', 'ghostwhite', 'gold', 'goldenrod', 'gray', 'green', 'greenyellow', 'honeydew', 'hotpink', 'indianred', 'indigo', 'ivory', 'khaki', 'lavender', 'lavenderblush', 'lawngreen', 'lemonchiffon', 'lightblue', 'lightcoral', 'lightcyan', 'lightgoldenrodyellow', 'lightgreen', 'lightgrey', 'lightpink', 'lightsalmon', 'lightseagreen', 'lightskyblue', 'lightslategray', 'lightsteelblue', 'lightyellow', 'lime', 'limegreen', 'linen', 'magenta', 'maroon', 'mediumaquamarine', 'mediumblue', 'mediumorchid', 'mediumpurple', 'mediumseagreen', 'mediumslateblue', 'mediumspringgreen', 'mediumturquoise', 'mediumvioletred', 'midnightblue', 'mintcream', 'mistyrose', 'moccasin', 'navajowhite', 'navy', 'oldlace', 'olive', 'olivedrab', 'orange', 'orangered', 'orchid', 'palegoldenrod', 'palegreen', 'palevioletred', 'papayawhip', 'peachpuff', 'peru', 'pink', 'plum', 'powderblue', 'purple', 'red', 'rosybrown', 'royalblue', 'saddlebrown', 'salmon', 'sandybrown', 'seagreen', 'seashell', 'sienna', 'silver', 'skyblue', 'slateblue', 'slategray', 'snow', 'springgreen', 'steelblue', 'tan', 'teal', 'thistle', 'tomato', 'turquoise', 'violet', 'wheat', 'white', 'whitesmoke', 'yellow', 'yellowgreen', 'yellowgreen'],
	
	published: {
		themeName: '',
		validTheme: false,
		customizer: {},
		type: '',
		element: '',
		themes: {},
		presets: [],
		preset: ''
	},
	
	components: [
		{name: 'signals', kind: 'Signals', customize: 'customize'},
		{name: 'themer', kind: 'Panels', fit: true, index: 0, draggable: false, components: [
			{name: 'sampler', kind: 'Scroller', thumb: false, classes: 'enyo-fit',
				touch: true, horizontal:'hidden', components: [
					{kind: 'Neo.Toolbar', header: 'Toolbar', style: 'max-height: 75px;', sample: true},
					{kind: 'Neo.SidebarItem', icon: '', title: 'Sidebar Item', sample: true, icon: 'gear'},
					{name: 'sidebarHighlight', kind: 'Neo.SidebarItem',
						icon: '', title: 'Sidebar Item Selected', sample: true, selected: true, icon: 'gear'},
					{name: 'tweetSmall', kind: 'Neo.Tweet.small', sample: true},
					{name: 'tweetLarge', kind: 'Neo.Tweet.large', sample: true},
					{kind: 'onyx.InputDecorator', components: [
						{name: 'richText', kind: 'Neo.RichText', text: 'Input box', sample: true}
					]},
					{kind: 'Neo.Button', text: 'Button', icon: 'settings', collapse: false, sample: true},
					{kind: 'onyx.PickerDecorator', components: [
						{content: 'Popup List'},
						{kind: 'Neo.PopupList', components: [{content: 'Customize'}], sample: true}
					]}
			]},
			{name: 'customizer', classes: 'neo-container enyo-fit', components: [
				{name: 'presetBox', kind: 'Scroller', touch: true, thumb: false, classes: 'enyo-fit', components: [
					{content: 'Choose a preset to build from'},
					{name: 'presets', kind: 'Repeater', classes: 'list', fit: true, onSetupItem: 'setupPreset', 
						components: [
							{name: 'preset', ontap: 'presetTap'}
					]}
				]},
				{name: 'builderBox', classes: 'enyo-fit', layoutKind: 'FittableRowsLayout', fit: true, components: [
					{content: 'Customize your theme', classes: 'onyx-groupbox-header'},
					{name: 'livePreview', saveable: true, style: 'margin:auto;'},
					{kind: 'Scroller', fit: true, touch: true, thumb: false, components: [
						{content: 'Theme Name', classes: 'onyx-groupbox-header'},
						{style: 'max-width: 300px; text-align: center; margin: auto;', classes: 'compose onyx-groupbox', components: [
							{kind: 'onyx.InputDecorator', components: [
								{name: 'nameInput', kind: 'onyx.Input', style: 'width: 200px; color: black;',
									oninput: 'keypress'},
							]}
						]},
						{name: 'builder', kind: 'Repeater', onSetupItem: 'setupCustomizer', components: [
							{name: 'title', classes: 'onyx-groupbox-header'},
							{style: 'max-width: 300px; text-align: center; margin: auto; border: none;', classes: 'onyx-groupbox', components: [
								{name: 'builderPopup', showing: false, kind: 'onyx.PickerDecorator', components: [
									{kind: 'onyx.PickerButton'},
									{name: 'builderPopupList', kind: 'Neo.PopupList'}
								]},
								{name: 'builderColor', showing: false, components: [
									{content: 'Red', classes: 'onyx-groupbox-header'},
									{name: 'builderRedSlider', onChange: 'sliding', onChanging: 'sliding', kind: 'onyx.Slider', min:0,max:255},
									{content: 'Green', classes: 'onyx-groupbox-header'},
									{name: 'builderGreenSlider', onChange: 'sliding', onChanging: 'sliding', kind: 'onyx.Slider', min:0,max:255},
									{content: 'Blue', classes: 'onyx-groupbox-header'},
									{name: 'builderBlueSlider', onChange: 'sliding', onChanging: 'sliding', kind: 'onyx.Slider', min:0,max:255},
									
									{kind: 'onyx.PickerDecorator', components: [
										{kind: 'onyx.PickerButton'},
										{name: 'builderColorPicker', kind: 'Neo.PopupList', onSelect: 'pickColor'}
									]}
								]},
								{name: 'builderPattern', showing: false, components: [
									{content: 'Pattern', classes: 'onyx-groupbox-header'},
									//{name: 'builderPatternPreview', kind: 'fx.Fader', showing: false, style: 'height: 100px; width: 100px;'},
									{content: 'Opacity', classes: 'onyx-groupbox-header'},
									{name: 'builderPatternOpacitySlider', onChange: 'sliding', onChanging: 'sliding', kind: 'onyx.Slider'}
								]},
								{name: 'builderSize', showing: false, components: [
									{content: 'Size', classes: 'onyx-groupbox-header'},
									{name: 'builderSizeSlider', kind: 'onyx.Slider', onChange: 'sliding', onChanging: 'sliding', min:-10,max:40}
								]},
								{name: 'builderInput', showing: false, classes: 'compose', components: [
									{kind: 'onyx.InputDecorator', components: [
										{name: 'customizeInput', kind: 'onyx.Input', style: 'width: 200px; color: black;',
											oninput: 'keypress'},
									]}
								]}
							]}
						]}
					]}
				]}
			]}
		]},
		{name: 'bottomtool', kind: 'Neo.Toolbar', middle: [
			{name: 'back', kind: 'Neo.Button', ontap: 'reset', text: 'Back', icon: 'back'},
			{kind: 'Neo.Button', ontap: 'close', text: 'Close', icon: 'close'},
			{name: 'deleteTheme', kind: 'Neo.Button', ontap: 'deleteTheme', text: 'Delete', icon: 'delete'},
			{name: 'save', kind: 'Neo.Button', ontap: 'save', text: 'Save', icon: 'save'},
			{name: 'load', kind: 'Neo.Button', ontap: 'load', text: 'Load', icon: 'load'},
			{name: 'email', kind: 'Neo.Button', ontap: 'email', text: 'Email', icon: 'email'}
		]},
		
		
 	],
 	
 	create: function() {
 		this.inherited(arguments);
 		
 		
 	},
 	

	//@* published
	//@* called on setThemeName
	themeNameChanged: function(oldVal) {
		var found = false,
			custom = this.getCustom() || {},
			themeExists = custom[this.themeName];
		this.$.deleteTheme.setShowing(themeExists);
		this.$.nameInput.addRemoveClass('validExists', themeExists);
		for (var exist in this.element.themes)
			if (this.element.themes[exist].toLowerCase() == this.themeName.toLowerCase()) found = true;
		this.setValidTheme(!( found && !themeExists ));
	},
	//@* published
	//@* called on setValidTheme
	validThemeChanged: function(oldVal) {
		var _v = this.validTheme;
		this.log(_v);
		this.$.nameInput.addRemoveClass('invalid',!_v);
		this.$.nameInput.addRemoveClass('valid',_v);
	},
	
	//@* private
	//@* from signals
	customize: function(s, sg) {
		this.$.back.show();
		this.element = copy(sg.element);
		if (!this.element.highlight) this.element.highlight = {}
		this.type = sg.type;
		this.themes = enyo.mixin(sg.themes, {custom: {
			styles: sg.styles,
			highlight: sg.highlight
		}});
		this.$.themer.setIndex(1);
		this.$.builderBox.hide();
		this.$.sampler.hide();
		this.$.presetBox.show();
		this.$.customizer.show();
		var presets = [],
			_t = this.element.themes.concat(['custom']);
		for (var el in _t) presets.push({preview: true, themePreview: _t[el], type: this.type});
		this.presets = copy(presets);
		this.$.presets.setCount(presets.length);
		this.$.presets.build();
	},
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	//@* events
	
	getPrepared: function() {
		var _cmzr = copy(this.customizer),
			_th = {
				styles: _cmzr.styles,
				highlight: _cmzr.highlight,
				type: this.type
			};
		return _th;
	},
	
	//@* public
	//@* saves the current customization and closes themes
	loadAndSave: function() {
		
		//enyo.Signals.send('loadCustom', copy(_th));
		return true;
	},
	//@* event
	//@* load button tapped
	//@* loads the current theme into the app, then closes themes
	load: function(s, e) {
		var _th = this.getPrepared();
		enyo.Signals.send('loadCustom', {theme: copy(_th)});
		this.reset();
	},
	//@* event
	//@* save button tapped
	//@* saves the current theme if valid
	save: function(s, e) {
		var _th = this.getPrepared(),
			_n = this.$.nameInput.getValue();
		if (!_n || !this.validTheme) return;
		_th.name = _n;
		this.log(copy(_th));
		enyo.Signals.send('saveToThemesList', {theme: copy(_th)});
		this.reset();
	},
	//@* event
	//@* delete button tapped
	//@* deletes the current theme
	deleteTheme: function(s, e) {
		enyo.Signals.send('deleteTheme', {type: this.type, theme: this.themeName,
			callback: function(deleted) {if (deleted) this.reset()}.bind(this)});
	},
	//@* event
	//@* email button tapped
	//@* email a theme to fxjmapps@gmail.com
	email: function(s, e) {
		AppUtils.sendEmail({
			to: [{name: 'Neo', address: 'fxjmapps@gmail.com'}],
			subject: 'My Neo theme: ' + this.themeName,
			msg: enyo.json.stringify(this.customizer)
		});
	},
	//@* event
	//@* preset tapped
	//@* loads the current theme for that preset and resets themes
	choosePreset: function(s, e) {
		enyo.Signals.send('loadTheme', {type: this.type, theme: e.selected.value});
		this.reset();
	},
	
	//FIXME
	//TODO
	//@* event
	//@* close button tapped || private call
	//@* closes themes
	close: function(s, e) {
		this.log();
		this.bubbleUp('destroyBox');
		/*this.reset();
		enyo.Signals.send('setFullscreen', false);
		this.doClose();*/
	},
	//@* event
	//@* input box key press
	keypress: function(s, e) {
		var _i = e.index,
			_v = s.getValue(),
			_preset = this.$.builder.children[_i],
			_p;
		if (s.name == 'nameInput') return this.setThemeName(_v);
		_p = _preset.$.title.getContent().substr(this.type.length + 1).toLowerCase();
		switch (_p) {
			case 'layout':
				enyo.forEach(this.$.livePreview.children, function(_c) {
					if (_c.$.themer.validate(_v)) this.customizer.styles.layout = _v;
				}.bind(this));
				this.updatePreview();
				break;
		}
	},
	//@* event
	//@* color slider moving
	sliding: function(s, e) {
		var mixin = {},
			highlight = false,
			_i = e.index,
			property = s.parent.name,
			_preset = this.$.builder.children[_i],
			_p = _preset.$.title.getContent().substr(this.type.length + 1),
			_hi = _p.toLowerCase().search('highlight');
		if (_hi != -1) {
			highlight = true;
			_p = _p.substr(_hi + 10);
		}
		switch (property) {
			case 'builderColor':
				mixin[_p] = 'rgb(' + 
					Math.round(_preset.$.builderRedSlider.getValue()) + ',' +
					Math.round(_preset.$.builderGreenSlider.getValue()) + ',' +
					Math.round(_preset.$.builderBlueSlider.getValue()) + ')';
				break;
			case 'builderSize':
				var _n = Math.round(_preset.$.builderSizeSlider.getValue());
				if (_p.toLowerCase().search('weight') >= 0) mixin[_p] = _n + '';
					else mixin[_p] = _n + 'px';
				break;
		}
		if (highlight != true) this.customizer.styles = enyo.mixin(this.customizer.styles, mixin);
			else this.customizer.highlight = enyo.mixin(this.customizer.highlight, mixin);
		this.updatePreview();
	},
	//@* event
	//@* color popup list select
	//@* fetches the RGB value from the color that was selected
	pickColor: function(s, e) {
		var mixin = {},
			highlight = false,
			_v = s.selected.content,
			_i = e.index,
			_preset = this.$.builder.children[_i],
			_p = _preset.$.title.getContent().substr(this.type.length + 1),
			_hi = _p.toLowerCase().search('highlight');
		if (_hi != -1) {
			highlight = true;
			_p = _p.substr(_hi + 10);
		}
		switch (_v) {
			case 'custom': break;
			case 'transparent': break;
			default:
				var RGB = this.getRGB(_v),
					_cs = RGB.match(/\d+/g);
				if (_cs == null) _cs = [0,0,0];
				_preset.$.builderRedSlider.setValue(_cs[0]);
				_preset.$.builderGreenSlider.setValue(_cs[1]);
				_preset.$.builderBlueSlider.setValue(_cs[2]);
				mixin[_p] = RGB;
				if (highlight != true) this.customizer.styles = enyo.mixin(this.customizer.styles, mixin);
					else this.customizer.highlight = enyo.mixin(this.customizer.highlight, mixin);
				this.updatePreview();
				break;
		}
	},
	//@* private
	//@* preset list setup item
	setupPreset: function(s, e) {
		var _i = e.index,
			_p = this.presets[_i],
			_cmps = this.getPreview(_i, this.type, _p.themePreview, true);
		e.item.$.preset.destroyClientControls();
		e.item.$.preset.createComponents(_cmps);
		enyo.forEach(e.item.$.preset.children, function(_tc) {
			var _orig = _tc;
			if (!_tc.$.themer && _tc.children[1] && _tc.children[1].kind != 'Neo.ThemeFile')
				_tc = _tc.children[1];
					else if (!_tc.$.themer) _tc = _orig.children[0];
			_tc.$.themer.preview(_tc.themePreview);
			if (_tc.selectItem) _tc.selectItem(_tc.highlighted);
			_orig.render();
		}, this);
		e.item.$.preset.render();
	},
	//@* private
	//@* on preset tapped
	//@* we want to build a new theme based on this preset type
	presetTap: function(s, e) {
		this.log();
		var showItems = ['save', 'load', 'email', 'builderBox'],
			_ch = s.children[0],
			_i = e.index,
			_t,
			custom = this.getCustom(),
			_e = copy(this.element);
		
		if (_ch.name == 'pickerDecorator' && _ch.children[1].showing == true) return;
		for (var _key in showItems) this.$[showItems[_key]].show();
		this.$.presetBox.hide();
		this.preset = this.presets[_i];
		_t = this.preset.themePreview;
		this.customizer = {
			master: [],
			styles: enyo.mixin(_e.styles, copy(this.themes[_t].styles)),
			highlight: enyo.mixin(_e.highlight, this.themes[_t].highlight)
		}
		for (var _cmz in this.customizer.styles) this.customizer.master.push(_cmz);
		for (var _cmz in this.customizer.highlight) this.customizer.master.push('highlight ' + _cmz);
		if (custom && custom[_t]) {
			this.$.nameInput.setValue(_t);
			this.setThemeName(_t);
			this.$.deleteTheme.show();
		}
		var _cmps = this.getPreview(50, this.type, _t, false);
		this.$.livePreview.destroyClientControls();
		this.$.livePreview.createComponents(_cmps, {owner: this});
		this.$.livePreview.render();
		this.$.builder.setCount(this.customizer.master.length);
		this.$.builder.build();
		this.render();
		this.reflow();
	},
	//@* private
	//@* customizer setup item
	//@* this is the SLOW loop...
	setupCustomizer: function(s, e) {
		var _i = e.index,
			cmzr = e.item,
			_cmzr = cmzr.$,
			foundKey = undefined,
			presetType = 'Size',
			mod = '',
			_val,
			_key = this.customizer.master[_i],
			_from = this.customizer.styles,
			customize;
		
		if (typeof _key === undefined) return;
		
		if (_key.indexOf('highlight') != -1) {
			_from = this.customizer.highlight;
			_key = _key.substr(10);
		}
		
		customize = _from[_key];
		//@* set the value of our preset to what we found
			_val = _from[_key];
		// determine the preset type
			if (_key.toLowerCase().search('color') != -1) presetType = 'Color';
			if (_key.toLowerCase().search('layout') != -1) presetType = 'Input';
		_cmzr.title.setContent(this.type + ' ' + ((_from == this.customizer.highlight) ? 'highlight ' : '') + _key);
		_cmzr.inputDecorator.show();
		// set our preset builder up
		
		//this.log(_key, _val, _from)
		switch (presetType) {
			case 'Size':
				// also here, we want to set the min and the max for the slider
				// according to whether it's a margin, padding, letter spacing, or just font size
				var minMax = this.getMinMax(_key);
				_cmzr.builderSizeSlider.setValue(parseInt(_val));
				_cmzr.builderSizeSlider.setMin(minMax[0]);
				_cmzr.builderSizeSlider.setMax(minMax[1]);
				_cmzr.builderSize.show();
				break;
			case 'Color':
				var _cs = _val.match(/\d+/g),
					_cmps = [];
				if (_cs == null) {
					_cs = this.getRGB(_val).match(/\d+/g);
					if (_cs == null) _cs = [0,0,0];
				}
				_cmzr.builderRedSlider.setValue(_cs[0]);
				_cmzr.builderGreenSlider.setValue(_cs[1]);
				_cmzr.builderBlueSlider.setValue(_cs[2]);
				_cmzr.builderColorPicker.destroyClientControls();
				for (var _c in this.colors) {_cmps.push({content: this.colors[_c], active: parseInt(_c) == 0})}
				_cmzr.builderColorPicker.createComponents(_cmps);
				_cmzr.builderColor.show();
				break;
			case 'Input':
				_cmzr.customizeInput.setValue(_val);
				_cmzr.builderInput.show();
				break;
			default:
				_cmzr.builderPopup.show();
				break;
		}
		if (_key.toLowerCase().search('background') != -1) _cmzr.builderPattern.show();
		
		if (_i == this.customizer.master.length - 1)
			this.updatePreview();
		//@* this is the SLOW loop
	},
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	//@* public
	//@* returns a preview object based on object type
	getPreview: function(index, type, preview, sample) {
		var _c = [],
			_def = {
				name: 'preview',
				preview: true,
				sample: sample,
				themePreview: preview,
			};
		switch (type) {
			case 'button':
				_cmp = enyo.mixin({kind: 'Neo.Button', text: preview, icon: 'settings', collapse: false}, _def);
				break;
			case 'toolbar':
				_cmp = enyo.mixin({kind: 'Neo.Toolbar', header: preview, style: 'max-height: 75px;'}, _def);
				break;
			case 'sidebarItem':
				_cmp = enyo.mixin({kind: 'Neo.SidebarItem', title: preview, icon: 'gear'}, _def);
				_c.push(_cmp);
				_cmp = enyo.mixin(_def, {name: 'previewH', kind: 'Neo.SidebarItem', icon: 'gear',
					title: preview + ' Selected', highlighted: true});
				break;
			case 'tweet':
				_cmp = enyo.mixin({kind: 'Neo.Tweet.small', theme: preview,
					  tweet: {
						author_username: 'Username',
						author_fullname: 'Full name',
						text: preview,
						author_avatar: '_icon.png',
						publish_date: new Date().toUTCString(),
						spaz_id: -(Math.random() * 100000),
						reposter_username: 'RepostUsername'}
				}, _def);
				break;
			case 'popupList':
				_cmp = {kind: 'onyx.PickerDecorator', components: [{content: preview},
					enyo.mixin({kind: 'Neo.PopupList', components: [{content: 'Customize'}]}, _def)
				]};
				break;
			case 'richText':
				_cmp = {kind: 'onyx.InputDecorator', components: [
					enyo.mixin({kind: 'Neo.RichText', text: preview, themePreview: preview}, _def)
				]};
				break;
		}
		this.log(_cmp)
		_c.push(_cmp);
		return _c;
	},
	updatePreview: function() {
		var _styles = copy(this.customizer.styles),
			_highlight = copy(this.customizer.highlight);
		enyo.forEach(this.$.livePreview.children, function(_tc){
			var _orig = _tc;
			if (!_tc.$.themer && _tc.children[1] && _tc.children[1].kind != 'Neo.ThemeFile')
				_tc = _tc.children[1];
			else if (!_tc.$.themer) _tc = _orig.children[0];
			_tc.$.themer.updatePreview(_styles, _highlight);
			_orig.render();
		}.bind(this));
	},
	
	
	
	
	
	
	
	
	
	
	
	

	
	
	//@* public
	//@* gets the RGB value of a color by name, hex, or any other means
	getRGB: function(color) {
		var rgb = '',
			probe = this.createComponent({tag:'div',style:'color:' + color + ';'},{owner:this});
		probe.render();
		rgb = probe.getComputedStyleValue('color');
		this.log(rgb);
		probe.destroy();
		return rgb;
	},
	
	//@* private
	//@* gets slider min and max values for a style
	getMinMax: function(style){
		var min = 0,
			max = 100;
		switch (style) {
			case 'textSize':
				max = 40;
				break;
			case 'borderWidth':
			case 'borderTopSize':
			case 'borderRightSize':
			case 'borderBottomSize':
			case 'borderLeftSize':
				max = 30;
				break;
			case 'padding':
			case 'margin':
				max = 50;
				break;
			case 'letterSpacing':
				min = -10;
				max = 10;
				break;
			case 'cornerRadius':
				max = 40;
				break;
			case 'textWeight':
				max = 900;
				break;
			case 'width':
			case 'height':
				max = 500;
				break;
		}
		return [min, max];
	},
	
	//@* private
	//@* called to reset the themes page
	reset: function() {
		var hideItems = ['back', 'save', 'load', 'email', 'deleteTheme', 'builderBox', 'customizer'],
			smallTweet = {
				author_username: 'Username',
				author_fullname: 'Full name',
				text: 'This is a small tweet.',
				author_avatar: '_icon.png',
				publish_date: new Date().toUTCString(),
				spaz_id: 1,
				reposter_username: 'RepostUsername'
			},
			largeTweet = enyo.mixin(copy(smallTweet),
				{text: 'This is a large tweet.', spaz_id: 2});
		for (var _i in hideItems) { this.$[hideItems[_i]].hide() }
		this.published = copy(this.publishedDefaults);
		this.$.themer.setIndex(0);
		this.$.nameInput.setValue('');
		this.$.presetBox.show();
		this.$.sampler.show();
		this.$.tweetSmall.setTweet(smallTweet);
		this.$.tweetLarge.setTweet(largeTweet);
		this.$.sidebarHighlight.selectItem(true);
		enyo.Signals.send('setFullscreen', true);
	},
	//@* private
    //@* returns new instance of custom themes object
    getCustom: function() {
        try {
          var c = JSON.parse(App.Prefs.get(this.type + '_customThemes')) || {};
        } catch(e) {c = {}}
        if (c == {}) App.Prefs.set(this.type + '_customThemes', c);
        c = enyo.clone(c);
        return c;
    },
});