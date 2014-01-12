enyo.kind({
	name: 'Neo.SidebarItem',
	layoutKind: 'FittableColumnsLayout',
	fit: true,
	style: 'text-align: center;',
	
	handlers: {
		ontap: 'itemTap',
	},
	
	published: {
		icon: '',
		title: '',
		highlighted: false,
		unread: 0,
		
		// for theming
			sample: false,
			preview: false,
	},
	
	
	
	components: [
		{name: 'themer', kind: 'Neo.ThemeFile', type: 'sidebarItem', onUpdate: 'updateTheme'},
		{kind: 'Signals', updateUnread: 'updateUnread'},
		
		{name: 'sidebarItem', kind: 'FittableColumns', classes: 'neo-sidebar-item onyx-toolbar onyx-dark onyx-highlight', components: [
			{name: 'icon', kind: 'Neo.Icon'},
			{name: 'title', layoutKind: 'FittableColumnsLayout', style: 'margin-left: 20px;'},
			{layoutKind: 'FittableColumnsLayout', fit:true},
			{name: 'unread', layoutKind: 'FittableColumnsLayout', classes: 'neo-sidebar-item-unread'}
		]}
	],
	//@* override
	create: function() {
		this.inherited(arguments);
		this.$.themer.loadSaved();
	},
	//@* theme functions
	//@* override
	themeChanged: function(oldValue) {
		var r = this.inherited(arguments);
		this.iconChanged();
		this.titleChanged();
		this.unreadChanged('skip');
		return r;
	},
	//@* override
	updateTheme: function(inSender, styles){
		this.themeChanged();
		this.$.themer.stylize(styles, this.$.sidebarItem);
		
		if (!this.preview && !this.sample) 
			this.bubble('onSetWidth', {width: parseInt(styles.width) || 344});
		
		this.selectItem(this.highlighted);
	},
	
	//@* published
	iconChanged: function(oldIcon) {
		this.$.icon.setType(this.type);
		this.$.icon.setIcon(this.icon);
	},
	titleChanged: function(oldValue) {
		this.$.title.setContent(this.title);
	},
	unreadChanged: function(oldValue) {
		this.$.unread.setShowing(this.unread != 0 && typeof this.unread != 'undefined');
		if (oldValue == 'skip') return;
		this.$.unread.setContent(this.unread);
		this.dispatchBubble('onUpdateUnread', {unread: this.unread});
		this.render();
	},
	
	//@* signals
	updateUnread: function(s, sg) {
		var newCount = sg.unread,
			_st = this.columnTypeToName(sg.title),
			_t = this.getTitle();
		//this.log(title, newCount)
		if (_st == null || _st.toLowerCase() != _t.toLowerCase()) return;
		this.setUnread(newCount);
	},
	//@* private
	//@* takes a column type and returns a name
	columnTypeToName: function(t) {
		switch (t) {
			case 'home': t = 'timeline'; break;
			case 'lists': t = 'list'; break;
			case 'timeline': t = 'home'; break;
			case 'list': n = 'lists'; break;
			default: break;
		}
		return t;
	},
	//@* public
	//@* set the sidebar highlight if the item is highlighted
	selectItem: function(highlighted) {
		var _tmr = this.$.themer,
			_unr = this.$.unread;
		this.highlighted = highlighted;
		switch (highlighted) {
			case true:
				_tmr.stylize(_tmr.highlight, this.$.sidebarItem);
				this.$.unread.applyStyle('background-color', _tmr.highlight.textColor);
				this.$.unread.applyStyle('color', _tmr.highlight.backgroundColor);
				break;
			case false: default:
				this.$.unread.applyStyle('background-color', _tmr.highlight.backgroundColor);
				this.$.unread.applyStyle('color', _tmr.highlight.textColor);
				break;
		}
	},
	//@* handlers
	//@* called on item tapped
	itemTap: function(s, e) {
		if ( (this.sample) && !(this.preview) ) {
			this.$.themer.customize();
			return false;
		}
		if ( (this.preview) ) {
			this.$.themer.preview(this.themePreview);
			return false;
		}
		this.bubble('selectColumn');
		return true;
	},
	//@* called each time item has finished rendering
	rendered: function() {
		var r = this.inherited(arguments);
		if (this.sample === true) {
			this.$.sidebarItem.applyStyle('width', '100%');
			this.applyStyle('width', '100%');
		}
		return r;
	},
	
	
	
	
	
	
	
	
	themes: {
		neo: {
			styles: {
				width: "250px",
				backgroundColor: 'rgb(5,5,5)', //#050505
				textColor:'rgb(240,240,240)',
				textSize:'23px',
				textWeight: '400',
				letterSpacing:'-2px',
				textTransform: '',
				borderLeftSize: '3px',
				borderRightSize: '3px',
				borderLeftColor: 'rgb(255,255,255)',
				borderRightColor: 'rgb(255,255,255)',
				borderTopSize: '0',
				borderBottomSize: '0',
				borderTopColor: '',
				borderBottomColor: '',
			},
			highlight: {
				backgroundColor:'rgb(255,255,255)',
				textColor:'rgb(204,204,204)',
				textSize:'23px',
				textWeight: '400',
				letterSpacing:'-2px',
				textTransform: '',
				borderLeftSize: '3px',
				borderRightSize: '3px',
				borderLeftColor: 'rgb(5,5,5)',
				borderRightColor: 'rgb(5,5,5)',
				borderTopSize: '0',
				borderBottomSize: '0',
				borderTopColor: '',
				borderBottomColor: ''
			},
			classes: ''
		},
		aqua: {
			styles: {
				width: "250px",
				backgroundColor:'teal',
				textColor:'rgb(240,240,240)',
				textSize:'23px',
				letterSpacing:'-2px',
				textTransform: '',
				borderLeftSize: '3px',
				borderRightSize: '3px',
				borderLeftColor: 'rgb(255,255,255)', //teal
				borderRightColor: 'rgb(255,255,255)', //teal
				borderTopSize: '0',
				borderBottomSize: '0',
				borderTopColor: '',
				borderBottomColor: '',
			},
			highlight: {
				backgroundColor:'rgb(255,255,255)',
				textColor: 'teal',
				textSize: '23px',
				textWeight: '400',
				letterSpacing:'-2px',
				textTransform: '',
				borderLeftSize: '3px',
				borderRightSize: '3px',
				borderLeftColor: 'rgb(5,5,5)',
				borderRightColor: 'rgb(5,5,5)',
				borderTopSize: '0',
				borderBottomSize: '0',
				borderTopColor: '',
				borderBottomColor: ''
			},
			classes: ''
		},
		murky: {
			styles: {
				width: "250px",
				backgroundColor: "rgb(119,109,17)",
				borderBottomColor: "",
				borderBottomSize: "1px",
				borderLeftColor: "rgb(255,255,255)",
				borderLeftSize: "0px",
				borderRightColor: "rgb(255,255,255)",
				borderRightSize: "0px",
				borderTopColor: "",
				borderTopSize: "0px",
				letterSpacing: "-2px",
				textColor: "rgb(95,20,48)",
				textSize: "24px",
				textTransform: "",
				textWeight: "0",
			},
			highlight: {
				backgroundColor: "rgb(201,181,0)",
				borderBottomColor: "rgb(38,0,42)",
				borderBottomSize: "1px",
				borderLeftColor: "rgb(5,5,5)",
				borderLeftSize: "0px",
				borderRightColor: "rgb(5,5,5)",
				borderRightSize: "0px",
				borderTopColor: "rgb(31,0,33)",
				borderTopSize: "1px",
				letterSpacing: "-2px",
				textColor: "rgb(0,53,91)",
				textSize: "24px",
				textTransform: "",
				textWeight: "0",
			},
			classes: ''
		},
		onyx: {
			styles: {}, highlight: {}
		}
	},
});
