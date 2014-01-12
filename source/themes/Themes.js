enyo.kind({
	name: 'Neo.Themes',
	classes: 'neo-themes',
	layoutKind: 'FittableRowsLayout',

	events: {
		onClose: ''
	},

	colors: ['custom', 'transparent', 'aliceblue', 'antiquewhite', 'aqua', 'aquamarine', 'azure', 'beige', 'bisque', 'black', 'blanchedalmond', 'blue', 'blueviolet', 'brown', 'burlywood', 'cadetblue', 'chartreuse', 'chocolate', 'coral', 'cornflowerblue', 'cornsilk', 'crimson', 'cyan', 'darkblue', 'darkcyan', 'darkgoldenrod', 'darkgray', 'darkgreen', 'darkkhaki', 'darkmagenta', 'darkolivegreen', 'darkorange', 'darkorchid', 'darkred', 'darksalmon', 'darkseagreen', 'darkslateblue', 'darkslategray', 'darkturquoise', 'darkviolet', 'deeppink', 'deepskyblue', 'dimgray', 'dodgerblue', 'firebrick', 'floralwhite', 'forestgreen', 'fuchsia', 'gainsboro', 'ghostwhite', 'gold', 'goldenrod', 'gray', 'green', 'greenyellow', 'honeydew', 'hotpink', 'indianred', 'indigo', 'ivory', 'khaki', 'lavender', 'lavenderblush', 'lawngreen', 'lemonchiffon', 'lightblue', 'lightcoral', 'lightcyan', 'lightgoldenrodyellow', 'lightgreen', 'lightgrey', 'lightpink', 'lightsalmon', 'lightseagreen', 'lightskyblue', 'lightslategray', 'lightsteelblue', 'lightyellow', 'lime', 'limegreen', 'linen', 'magenta', 'maroon', 'mediumaquamarine', 'mediumblue', 'mediumorchid', 'mediumpurple', 'mediumseagreen', 'mediumslateblue', 'mediumspringgreen', 'mediumturquoise', 'mediumvioletred', 'midnightblue', 'mintcream', 'mistyrose', 'moccasin', 'navajowhite', 'navy', 'oldlace', 'olive', 'olivedrab', 'orange', 'orangered', 'orchid', 'palegoldenrod', 'palegreen', 'palevioletred', 'papayawhip', 'peachpuff', 'peru', 'pink', 'plum', 'powderblue', 'purple', 'red', 'rosybrown', 'royalblue', 'saddlebrown', 'salmon', 'sandybrown', 'seagreen', 'seashell', 'sienna', 'silver', 'skyblue', 'slateblue', 'slategray', 'snow', 'springgreen', 'steelblue', 'tan', 'teal', 'thistle', 'tomato', 'turquoise', 'violet', 'wheat', 'white', 'whitesmoke', 'yellow', 'yellowgreen', 'yellowgreen'],

	components: [
		{name: 'signals', kind: 'Signals', customize: 'customize', hidetools: 'hideTools'},

		{name: 'toptool', kind: 'Neo.Toolbar', header: 'Themes', onClose: 'close', closeable: true, right: [
			{name: 'caption', classes: 'neo-themes-caption'}
		]},

		{name: 'box', fit: true, kind: 'FittableRows', destroyBox: 'reset'},

		/*{name: 'bottomtool', kind: 'Neo.Toolbar', middle: [
			//{kind: 'Neo.Button', ontap: 'basic', text: 'Basic', icon: 'magnet'},
   			//{kind: 'Neo.Button', ontap: 'adv', text: 'Advanced', icon: 'lab'}
   		], left: [
			//{kind: 'Neo.Button', ontap: 'help', icon: 'help'},
		]},*/
	],

	startMenu: [
		{name: 'startMenu', onLoadBox: 'loadBox', kind: 'Scroller', touch: true, fit: true, components: [
			{content: 'Please choose from one of the following options:', style: 'color: white; font-size: 2em; text-transform: italics;'},

			{kind: 'Neo.setting', type: 'button',
				section: "QuickTheme",
				title: "Apply theme to Neo",
				mixin: {text: 'QuickTheme', bubble: 'onLoadBox', box: 'quickTheme', icon: 'magnet'},
				description: 'Choose from Primary, Secondary, and Advanced colours, ' +
					'and let Neo decide which ones belong where with Neo SmartColor(tm) Technology'},




			{kind: 'Neo.setting',  type: 'button',
				section: "Tweak Elements",
				title: "Customize individual elements of Neo",
				mixin: {text: 'Tweak', bubble: 'onLoadBox', box: 'tweakElements', icon: 'lab'},
				description: 'View live previews of Neo\'s elements. ' +
					'Modify an element\'s properties, apply CSS styles, and more. ' +
					'Choose from custom presets, or load one you\'ve made before.. it\'s all there at your fingertips. ' +
					'QuickTheme compatible.'},

			{kind: 'Neo.setting',  type: 'button',
				section: "Theme Manager",
				title: "Manage Neo themes",
				mixin: {text: 'Enter', bubble: 'onLoadBox', box: 'themeManager', icon: 'list'},
				description: 'Neo themes provide enhanced theme capability by combining ' +
					'the ease of QuickThemes with the power of the theme elements. ' +
					'Create, remove, and reorder your favorite Neo themes for quick access. ' +
					'First, select which custom and premade themes belong to Neo\'s elements. ' +
					'Then save a name, add a colour for easy remembering, and you\'re done!' +
					'You can now load your theme at any time, and Neo will remember which settings you chose. ' +
					'It\'s that easy! Also, you can view and manually edit your entire theme\'s CSS style here.' +
					'If you so desire...'},


			{kind: 'Neo.setting', type: 'button',
				section: "Help",
				title: "Get help",
				mixin: {text: 'Help Me', bubble: 'onLoadBox', box: 'help', icon: 'help'},
				description: 'Display additional help information.'},

	   	]}
	],

	quickTheme: [
		{name: 'quickTheme', kind: 'Neo.QuickTheme', fit: true, layoutKind: 'FittableRowsLayout'}
	],

	tweakElements: [
		{name: 'tweakElements', kind: 'Neo.TweakElements', fit: true, layoutKind: 'FittableRowsLayout'},
	],



	//@* override
	create: function() {
		this.inherited(arguments);
		//this.publishedDefaults = copy(this.published);
		//this.adv();
		this.reset();
	},
	destroyBox: function(s, e) {
		this.log();
		this.$.box.destroyClientControls();
		this.hideTools(null, {hide: false});
		this.render();
		this.reflow();
		this.$.caption.setContent('');
		return true;
	},
	insertBox: function(s, e) {
		var title = s.insert,
			hide = s.hideToolbars || false;
		this.log(title);
		if (!this[title]) return alert('NOTHING TO LOAD HERE.', this);
		this.destroyBox();
		this.$.box.createComponents(this[title], {owner: this});
		this.$.box.render();
		if (this.$[title].reset) this.$[title].reset();
		this.hideTools(null, {hide: hide});
	},
	hideTools: function(s, e) {
		this.log(s, e);
		var hide;
		if (e && e.hide != null) hide = e.hide;
		else hide = s;
		this.$.toptool.setShowing(!hide);
//FIXME		//this.$.bottomtool.setShowing(hide);
		this.reflow();
	},
	//@* private event
	//@* loads the tapped button from the button
	loadBox: function(s, e) {
		this.log(e.inSender.box);
		var box = e.inSender.box;
		if (!box) return this.reset() && alert('COMING SOON...', this);
		this.insertBox({insert: box, hideToolbars: true});
	},

	reset: function(s, e) {
		this.destroyBox();
		this.insertBox({insert: 'startMenu', hideToolbars: false});
	},
	//@* event
	//@* close button tapped || private call
	//@* closes themes
	close: function(s, e) {
		//this.reset();
		this.hideTools(null, {hide: false});
		enyo.Signals.send('setFullscreen', {fs:false});
		this.doClose();
	},
});
