enyo.kind({
	name: 'Neo.Toolbar',
	//kind: 'onyx.Toolbar',
	classes: 'neo-toolbar onyx-toolbar onyx-dark ',
	//fit: true,
	
	published: {
		header: '',
		closeable: false,
		align: 'center',
		left: [{content: ' '}],
		middle: [{content: ' '}],
		right: [{content: ' '}],
		
		// for theming
			sample: false,
			preview: false,
	},
	
	events: {
		onClose: ''
	},
	
	handlers: {
		ontap: 'handleTapped',
		onhold: 'handleHold'
	},
	
	components: [
		// required for ALL theme objects
		{name: 'themer', kind: 'Neo.ThemeFile', type: 'toolbar', onUpdate: 'updateTheme'},
		
		{layoutKind: 'FittableColumnsLayout', components: [
			{name: 'close', kind: 'Neo.Button', icon: 'close', action: 'doClose', showing: false},
			{name: 'left', layoutKind: 'FittableColumnsLayout', classes: ''},
			{name: 'middle', kind: 'FittableColumns', classes: 'onyx-header', fit: true},
			{name: 'right', layoutKind: 'FittableColumnsLayout', classes: ''}
		]}
	],
	
	themes: {
		neo: {
			styles: {
				backgroundColor:'rgb(0,0,0)',
				textColor:'rgb(255,255,255)',
				textSize:'16px',
				textWeight: '400',
				letterSpacing:'',
				textTransform: '',
				
				margin: '',
				padding: ''
			},
			classes: ''
		},
		aqua: {
			styles: {
				/*'backgroundColor':'teal',
				'textColor':'#CCC',
				'font-size':'1em',
				'letter-spacing':'',
				'border-color':'teal'*/
			},
			classes: ''
		},
		kakhi: {
			styles: {
				backgroundColor: "rgb(85,88,35)",
				letterSpacing: "-2px",
				margin: "0px",
				padding: "0px",
				textColor: "rgb(189, 183, 107)",
				textSize: "19px",
				textTransform: "",
				textWeight: "0",
			}
		},
		
		red: {
			styles:{
				"backgroundColor":"rgb(128,0,0)","textColor":"rgb(255,176,0)","textSize":"","textWeight":"","letterSpacing":"","textTransform":"","margin":"","padding":""
			}
		},
		steel: {
			styles:{
				"backgroundColor":"rgb(63,63,60)","textColor":"rgb(198,204,204)","textSize":"","textWeight":"","letterSpacing":"","textTransform":"","margin":"","padding":""
			}
		},
		green: {
			styles:{
				"backgroundColor":"rgb(0,163,0)","textColor":"rgb(57,0,0)","textSize":"18px","textWeight":"900","letterSpacing":"-2px","textTransform":"","margin":"0px","padding":"14px"
			}
		},
		forest: {
			styles: {
				backgroundColor: "rgb(0,60,0)",
					
					letterSpacing: "0px",
					margin: "0px",
					padding: "0px",
					textColor: "rgb(255,255,255)",
					textSize: "16px",
					textTransform: "0px",
					textWeight: "400",
			}
		},
		blue: {
			styles: {
				"backgroundColor":"rgb(0,0,120)","textColor":"rgb(85,255,255)","textSize":"","textWeight":"","letterSpacing":"","textTransform":"","margin":"","padding":""
			}
		},
		bruins: {
			styles:{
				backgroundColor:"rgb(0,0,0)",
				textColor:"rgb(255, 215, 0)",
				textSize:"28px",
				textWeight:"900",
				letterSpacing:"-2px",
				textTransform:"",
				margin:"0px",
				padding:"14px",
			}
		},
		
		onyx: {
			styles: {}, highlight: {}
		}
	},
	
	create: function() {
		this.inherited(arguments);
		this.$.themer.loadSaved();
	},
	//@* theme functions
	//@* override
	themeChanged: function(oldValue){
		var r = this.inherited(arguments);
		
		this.leftChanged();
		this.rightChanged();
		this.middleChanged();
		this.closeableChanged();
		this.headerChanged();
		this.alignChanged();
		this.reflow();
		
		return r;
	},
	//@* override
	updateTheme: function(inSender, styles){
		this.$.themer.stylize(styles, this);
		this.themeChanged();
		this.reflow();
	},
	
	leftChanged: function(oldItems){
		this.$.left.destroyClientControls();
		enyo.forEach(this.left, function(component){
			this.$.left.createComponent(component, {owner: this.owner});
		}.bind(this));
		this.reflow();
	},
	middleChanged: function(oldItems){
		this.$.middle.destroyClientControls();
		enyo.forEach(this.middle, function(component){
			this.$.middle.createComponent(component, {owner: (this.header)?this:this.owner });
			this.$.middle.render();
		}.bind(this));
		this.reflow();
	},
	
	rightChanged: function(oldItems){
		this.$.right.destroyClientControls();
		enyo.forEach(this.right, function(component){
			this.$.right.createComponent(component, {owner: this.owner});
		}.bind(this));
		this.reflow();
	},
	
	closeableChanged: function(oldValue){
		this.$.close.setShowing(this.closeable);
	},
	headerChanged: function(oldValue){
		if (this.header) {
			if (!this.$.toolHeader) {
				this.middle.push({name: 'toolHeader', style: 'font-size: 2em;', classes: 'onyx-header'});
				this.middleChanged();
			}
			this.$.toolHeader.setContent(this.header);
		} else {
			if (this.$.toolHeader) enyo.remove(this.$.toolHeader, this.middle);
			this.middleChanged();
		}
	},
	alignChanged: function(oldValue){
		this.applyStyle('text-align', this.align);
		this.$.middle.applyStyle('text-align', this.align);
	},
	
	contains: function(event, contains){
		try{
			if (event.originator[contains]) return event.originator[contains];
			if (event.originator.container[contains]) return event.originator.container[contains];
			if (event.originator.container.container[contains]) return event.originator.container.container[contains];
		}catch(e){}
		this.log(event, contains);
		return false;
	},
	
	//@ handlers
	handleTapped: function(inSender, inEvent) {
		if ( (this.sample) && !(this.preview) ) {
			this.$.themer.customize();
			return false;
		}
		if ( (this.preview) ) {
			this.$.themer.preview(this.themePreview);
			return false;
		}
		
		var r = this.inherited(arguments);
		if (!this.contains(inEvent, 'ontap') && !this.contains(inEvent, 'action')) {
			this.bubble('toolbarTap', inEvent);
			console.log("notap");
		} else if (this.contains(inEvent, 'action')) {
			this[this.contains(inEvent, 'action')](inSender, inEvent);
			console.log("tap");
		}
		return r;
	},
	handleHold: function(inSender, inEvent){
		var r = this.inherited(arguments);
		if (!inEvent.originator.ontap && !inEvent.originator.container.ontap) {
			this.bubble('toolbarHold', inEvent);
		}
		return r;
	},
})
