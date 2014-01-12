enyo.kind({
	name: 'Neo.Button',
	handlers: {
		ontap: 'buttonTap',
		onresize: 'resizeHandler',
	},
	components: [
		{name: 'themer', kind: 'Neo.ThemeFile', type: 'button', onUpdate: 'updateTheme'},
		{name: 'button', kind: 'onyx.Button', classes: 'neo-button onyx-blue', components: [
			{name: 'icon', kind: "Neo.Icon"},
			{name: "text", style: 'top: -25px !important;'},
		]}
	],
	published: {
		//@* long url or short name
			icon: '',
			iconPath: 'assets/icons/',
			iconRes: 'ldpi/',
			iconColor: 'white/',
		
		text: '',
		collapse: true,	// auto collapse if screen is less than certain width i.e. hide the text..
		blue: true,
		highlighted: false,
		downState: false,
		// for theming
			sample: false,
			preview: false
	},
	
	
	
	//@* override
	create: function() {
		this.inherited(arguments);
		if (!this.blue) this.removeClass('onyx-blue');
		this.setActive = this.$.button.setActive;
		this.setDisabled = this.$.button.setDisabled;
		
		this.$.themer.loadSaved();
	},
	
	//@* published
	iconChanged: function(oldIcon) {
		this.$.icon.setType(this.type);
		this.$.icon.setIcon(this.icon);
	},
	
	textChanged: function(oldText) {
		var _t = this.text,
			_c = {name: 'text', content: _t, allowHtml: true};
		if (this.$.text) this.$.text.destroy();
		this.$.button.createComponent(_c, {owner: this});
	},
	
	
	
	
	
	
	
	
	//@* theme functions
	//@* override
	themeChanged: function(oldValue) {
		var r = this.inherited(arguments);
		this.iconChanged();
		this.textChanged();
		return r;
	},
	//@* override
	updateTheme: function(inSender, styles) {
		this.$.themer.stylize(styles, this.$.button);
		this.themeChanged();
		this.render();
	},
	
	
	
	//@* handlers
	buttonTap: function(inSender, inEvent) {
		if ( (this.sample) && !(this.preview) ) {
			this.$.themer.customize();
			this.log("lalal")
			return false;
		}
		if ( (this.preview) ) {
			this.$.themer.preview(this.themePreview);
			this.log("asdfsdaf")
			return false;
		}
	},
	resizeHandler: function() {
		var r = this.inherited(arguments),
			c = this.findContainer();
		if (this.collapse && this.$.icon) this.$.text.setShowing(c.getBounds().width >= 760);
		return r;
	},
	rendered: function() {
		var r = this.inherited(arguments),
			c = this.findContainer();
		if (this.collapse && this.$.icon) this.$.text.setShowing(c.getBounds().width >= 760);
		return r;
	},
	
	//@* private
	findContainer: function(possibilities){
		if (possibilities == null) possibilities = ['sidebar', 'container'];
		var container = this.container,
			x = 0;
		do {
			if (container.kind && 
					(container.kind.toLowerCase().search(possibilities[0]) >= 0 ||
						container.kind.toLowerCase().search(possibilities[1]) >= 0))
							return container;
			(container.container) ? container = container.container : x = 1;
		} while (!x);
		return this.container;
	},
	
	//@* select
	highlightedChanged: function(oldVal) {
		if (this.highlighted) this.$.themer.stylize(this.$.themer.highlight, this.$.button);
	},
	/*down: function(inSender, inEvent){
		console.log('down', inSender.active, inSender, inEvent)
	},
	up: function(inSender, inEvent){
		console.log('up', inSender.active, inSender, inEvent)
	},
	over: function(inSender, inEvent){
		console.log('over', inSender.active, inSender, inEvent)
		//this.setHighlighted(true);
	},
	activeChanged: function(inSender, inEvent){
		//this.log('activeChanged', inSender.active, inSender, inEvent)
		//this.setHighlighted(false);
	}*/
	
	
	
	
	
	
	//@* themes
	
	//@* the active themes list for button
	themes: {
		neo: {
			styles: {
				backgroundColor: 'rgb(15,15,15)',
				textColor: 'rgb(240,240,240)',
				textSize: '24px',
				textWeight: '400',
				letterSpacing: '-2px',
				textTransform: 'uppercase',
				borderWidth: '1px',
				borderColor: 'rgb(140,140,140)',
				cornerRadius: '5px',
				'border-style':'ridge',
				
			},
			classes: ''
		},
		aqua: {
			styles: {
				backgroundColor: 'teal',
				textColor: 'rgb(240,240,240)',
				textSize: '24px',
				textWeight: '400',
				letterSpacing:'-5px',
				textTransform: 'lowercase',
				borderWidth: '2px',
				borderColor: 'rgb(255,255,255)',
				cornerRadius: '20px',
			},
			classes: ''
		},
		blue: {
			styles: {
				backgroundColor: "rgb(26,47,58)",
				borderColor: "rgb(255,255,255)",
				borderWidth: "0px",
				cornerRadius: "0px",
				letterSpacing: "-2px",
				textColor: "rgb(189, 183, 107)",
				textSize: "24px",
				textTransform: "uppercase",
				textWeight: "0",
			}
		},
		onyx: {
			styles: {}
		},
		next: {
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
			},
			classes: ''
		}
	//@* end of themes
	}
});
