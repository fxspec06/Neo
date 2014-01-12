enyo.kind({
	name: "Neo.AvatarButton",
	kind: "Neo.Button",
	extra: {
		icon: {
			width: '60px',
			height: '60px',
			margin: '4px -2px 0 0',
			padding: '0 0 0 0'
		},
		button: {
			width: '60px',
			height: '60px',
			'padding-left': '4px',
			'padding-right': '5px',
			'padding-top': '0px'
		}
	},
	//this.$.themer.stylize(styles, this.$.button);
	updateTheme: function() {
		this.inherited(arguments);
		this.loadExtra();
	},
	iconChanged: function() {
		this.inherited(arguments);
		this.loadExtra();
	},
	loadExtra: function() {
		if (this.$.icon) this.$.themer.stylize(this.extra.icon, this.$.icon);
		if (this.$.button) this.$.themer.stylize(this.extra.button, this.$.button);
	}
});
