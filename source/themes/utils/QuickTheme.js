enyo.kind({
	name: 'Neo.QuickTheme',
	
	kind: 'FittableRows',
	classes: 'enyo-fit neo-container',
	fit: true,
	
	
	published: {
		primary: '#00',
		secondary: '#00',
		alternate: '#00'
	},
	
	// current colour option being modified
	current: '',
	
	components: [
		{kind: 'Neo.Tweet.small', theme: 'neo',
			name: 'preview', preview: 'neo', sample: true, themePreview: 'neo', showing: false, tweet: {
				author_username: 'Username',
				author_fullname: 'Full name',
				text: 'neo',
				author_avatar: 'assets/_icon.png',
				publish_date: new Date().toUTCString(),
				spaz_id: -(Math.random() * 100000),
				reposter_username: 'RepostUsername'}},
		{showing: false,kind: 'onyx.InputDecorator', components: [
			{kind: 'Neo.RichText', text: 'neo', themePreview: 'neo', name: 'preview', sample: true}
		]},
		//@*
		
		{kind: 'Neo.Toolbar', header: 'Quick Theme', left: [
			{name: 'exit', kind: 'Neo.Button', ontap: 'exit', icon: 'exit', blue: false, style: 'color: red !important;'} 
		], right: [
			{kind: 'Neo.Button', ontap: 'select', text: 'Apply...', blue: false, style: 'color: green !important;'}
		]},
		
		{name: 'widgetBox', kind: 'Scroller', touch: true, fit: true, components: [
			//
			
			{kind: 'ColorPicker', onColorPick: 'choose', onColorSlide: 'choose'}
			
			//
		]},
		{name: 'selectMessage', kind: 'Scroller', touch: true, fit: true, components: [
			{content: 'Select 3 colours for Neo<br/>Tap apply to finish<br/>Tap the door to exit',
				style: 'font-size: 2em; text-transform: italics; font-weight: bold;', allowHtml: true}
		]},
		{name: 'spinner', kind: 'Neo.Spinner', fit: true, showing: false},
		{kind: 'Neo.Toolbar', left: [
			{name: 'primary', kind: 'Neo.ColorSquare', ontap: 'swap'},
			{content: 'Primary', style: '-webkit-transform: rotateX(90)'}
		], middle: [
			{name: 'secondary', kind: 'Neo.ColorSquare', ontap: 'swap'},
			{content: 'Secondary'}
		], right: [
			{content: 'Alternate'},
			{name: 'alternate', kind: 'Neo.ColorSquare', ontap: 'swap'},
			//{kind: 'Neo.Button', ontap: 'close', text: 'Cancel'}
		]}
	],
	
	create: function() {
		this.inherited(arguments);
		
		this.showSelectMessage(true);
		//this.colorChanged();
		setTimeout(this.render.bind(this), 0);
		
		var colors = App.Prefs.get('neo-quicktheme-colors');
		this.primary = colors[0];
		this.secondary = colors[1];
		this.alternate = colors[2];
		
		this.$.primary.setColor(this.primary);
		this.$.secondary.setColor(this.secondary);
		this.$.alternate.setColor(this.alternate);
	},
	
	
	
	//@* the
	//@* function.
	
	
	quickTheme: function(colors) {
		this.log(colors);
		App.Prefs.set('neo-quicktheme-colors', colors);
		
		var primary = colors[0],
			secondary = colors[1],
			alternate = colors[2];
		
		var elements = {
			button: {
				//@* public
				defaultTheme: 'blue',
				themes: ['neo', 'aqua', 'blue', 'onyx'],
				
				//@* protected
				styles: {
					backgroundColor: primary,
					textColor: alternate,
					textSize: null,
					textWeight: null,
					letterSpacing:null,
					textTransform: null,
					borderWidth: null,
					borderColor: null,
					cornerRadius: null,
					//buttonStyle: null,
				},
			},
			toolbar: {
				//@* public
				defaultTheme: 'kakhi',
				themes: ['neo', 'kakhi', 'onyx', 'red', 'steel', 'blue', 'green', 'forest', 'bruins'],
				//@* protected
				styles: {
					backgroundColor: primary,
					textColor: alternate,
					textSize: null,
					textWeight: null,
					letterSpacing:null,
					textTransform: null,
					margin: null,
					padding: null
				}
			},
			sidebar: {
				//@* public
				defaultTheme: 'neo',
				themes: ['neo', 'onyx'],
				//@* protected
				styles: {
					background: null,
					borderColor: secondary,
					borderWidth: null,
				}
			},
			sidebarItem: {
				//@* public
				defaultTheme: 'murky',
				themes: ['neo', 'aqua', 'murky', 'onyx'],
				//@* protected
				styles: {
					width: null,
					backgroundColor:primary,
					textColor:alternate,
					textSize:null,
					textWeight: null,
					letterSpacing:null,
					textTransform: null,
					borderLeftSize: null,
					borderRightSize: null,
					borderLeftColor: secondary,
					borderRightColor: secondary,
					borderTopSize: null,
					borderBottomSize: null,
					borderTopColor: null,
					borderBottomColor: secondary
				},
				highlight: {
					backgroundColor:alternate,
					textColor:primary,
					textSize:null,
					textWeight: null,
					letterSpacing:null,
					textTransform: null,
					borderLeftSize: null,
					borderRightSize: null,
					borderLeftColor: secondary,
					borderRightColor: secondary,
					borderTopSize: null,
					borderBottomSize: null,
					borderTopColor: secondary,
					borderBottomColor: secondary
				}
			},
			tweet: {
				//@* public
				defaultTheme: 'blue',
				themes: ['neo', 'official', 'officialCondensed', 'blue', 'onyx'],
				//@* protected
				styles: {
					layout: null,
					backgroundColor: primary,
					textColor: alternate,
					textSize: null,
					textWeight: null,
					letterSpacing: null,
					textTransform: null,
					borderLeftSize: null,
					borderRightSize: null,
					borderLeftColor: secondary,
					borderRightColor: secondary,
					borderTopSize: null,
					borderBottomSize: null,
					borderTopColor: secondary,
					borderBottomColor: secondary,
					padding: null,
					margin: null,
				},
				//@* fullname and username
				highlight: {
					textColor: secondary,
					textSize: null,
					textWeight: null,
					letterSpacing: null,
					textTransform: null,
				}
			},
			popupList: {
				//@* public
				defaultTheme: 'cloudy',
				themes: ['neo', 'cloudy', 'onyx'],
				//@* protected
				styles: {
					backgroundColor: primary,
					textColor: alternate,
					textSize: null,
					textWeight: null,
					letterSpacing: null,
					borderColor: secondary,
					borderWidth: null,
					textTransform: null,
					padding: null,
					margin: null,
					width: null,
				}
			},
			richText: {
				//@* public
				defaultTheme: 'neo',
				themes: ['neo', 'onyx', 'onyx'],
				//@* protected
				styles: {
					backgroundColor: primary,
					textColor: alternate,
					textSize: null,
					textWeight: null,
					letterSpacing: null,
					borderColor: secondary,
					borderWidth: null,
					textTransform: null,
					padding: null,
					margin: null,
					width: null
				}
			}
		};
		// SYNTAX FOR LOADING A THEME:
		// enyo.Signals.send('loadTheme', {type: 'TYPENAME', theme: 'THEMENAME' });
		//	enyo.Signals.send('loadCustom', {theme: {
		//		styles: _cmzr.styles,
		//		highlight: _cmzr.highlight,
		//		type: this.type
		//	}});
		this.log('BEGINNING TO LOAD QUICKTHEME...', primary, secondary, alternate, elements);
		var i = 0;

		for (var type in elements) {
			var el = elements[type];
			var params = {theme: {
				styles: el.styles,
				highlight: el.highlight,
				type: type,
				name: 'QuickTheme',
				override: true // bahaha
			}};
			setTimeout((function(type, params){
				this.log('loading...', type, params);
				enyo.Signals.send('saveQuickTheme', enyo.clone(params));
			}).bind(this), 1000 * i, type, params);
			i++;
		}
		this.log('SUCCESS!!!!!!!!!!!!!!!');
	},
	//send: function(){enyo.Signals.send()},
	
	
	
	
	
	
	//@* private event
	//@* called when tap on bottom toolbar primary, secondary, or alternate colour
	//@* allows user to select a colour of which they tapped.
	swap: function(s, e) {
		this.log(s.name, s, e);
		
		var reset = (this.current == s.name);
		
		this.current = (reset) ? null : s.name;
		
		//@* hide the middle box
			this.showSelectMessage(reset);
		//@* remove class from all three options
			this.$.primary.removeClass('neo-colorbox-selected');
			this.$.secondary.addRemoveClass('neo-colorbox-selected');
			this.$.alternate.addRemoveClass('neo-colorbox-selected');
		
		if (!reset) {
			//@* add class to chosen
				this.$[s.name].addClass('neo-colorbox-selected');
			//@* load the colour into the picker
				this.$.colorPicker.setColor(this[s.name]);
		} else this.save(s.name) && this.showSelectMessage(true);
		
		this.reflow();
	},
	showSelectMessage: function(show) {
		this.log(show);
		this.$.widgetBox.setShowing(!show);
		this.$.selectMessage.setShowing(show);
		this.render();
		this.reflow();
		
	},
	choose: function(s, e) {
		//this.log('choosing color...', s);
		//this.log(s.color, s.opacity);
		
		var color = getRGBA(s.color, s.opacity);
		this.log('COLOR SELECTED: ', color);
		this.$[this.current].setColor(color);
		this[this.current] = color;
	},
	save: function(current) {
		if (!this.current || this.current == '') return;
		var color;
		this.log('saving...', current, color = this.$[this.current].getColor());
		this[current] = color;
	},
	select: function() {
		var colors = [this.primary, this.secondary, this.alternate];
		this.log(colors);
		this.quickTheme(colors);
		this.spinner(true);
		setTimeout(this.finish.bind(this), 7300); // 10 second delay to load
	},
    spinner: function(onoff) {
    	this.log(onoff ? 'showing' : 'hiding');
    	//this.$.spinner[onoff ? 'start' : 'stop']();
    	this.$.spinner.setShowing(onoff);
    	this.$.widgetBox.setShowing(!onoff);
    	this.reflow();
    	this.render();
    },
    finish: function() {
    	window.saving = {};
    	//this.x.destroy();
    	this.spinner(false);
    	this.exit();
    },
	exit: function(s, e) {
		this.bubbleUp('destroyBox', e);
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
						author_avatar: 'assets/_icon.png',
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
});

//@* public
//@* gets the RGB value of a color by name, hex, or any other means
function getRGB(color) {
	var rgb = '',
		probe = neoapp.createComponent({tag:'div',style:'color:' + color + ';'});
	
	probe.render();
	rgb = probe.getComputedStyleValue('color');
	//console.log(rgb);
	probe.destroy();
	delete probe;
	return rgb;
}

// public
// accepts an RGB array or a color, and an opacity value
// returns an RGBA string
function getRGBA(colorOrRGB, opacity) {
	var color,
		RGB,
		RGBA,
		elimRGBstring = function(str) {
			var elim = str;
			try {
				if (str.indexOf('rgb(') != -1)
					elim = str.replace('rgb(', '').replace(')', '').replace('\s', '').split(',');
				else if (str.indexOf('rgba(') != -1) {
					elim = str.replace('rgba(', '').replace(')', '').replace('\s', '').split(',');
					opacity = elim.pop();
				}
			} catch (e) {return str;}
			return elim;
		};
	
	if (opacity == null) opacity = '1';
	
	//console.log('converting: ', colorOrRGB, ' to RGBA...');
	
	RGB = elimRGBstring(colorOrRGB);
	
	// passed an RGB array...
	if (RGB.length == 3) color = RGB;
	else color = getRGB(RGB);
	
	color = elimRGBstring(color);
	
	opacity += '';
	RGBA = 'rgba(' + color[0] + ', ' + color[1] + ', ' + color[2] + ', ' + opacity.substr(0, 5) + ')';
	
	//console.log('BEFORE: ', colorOrRGB, ', AFTER: ', RGBA);
	
	return RGBA;
}