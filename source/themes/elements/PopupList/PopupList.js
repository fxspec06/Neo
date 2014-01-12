enyo.kind({
	name: "Neo.PopupList",
	kind: "onyx.Picker",
	classes: "neo-popup-list",
	
	handlers: {
		ontap: "buttonTap",
	},
	
	published: {
		// for theming
			sample: false,
			preview: false
	},
	
	themes: {
		neo: {
			styles: {
				backgroundColor: "rgb(5,5,5)",
				textColor: "rgb(204,204,204)",
				textSize: "24px",
				textWeight: "400",
				letterSpacing:"",
				textTransform: "uppercase",
				
				borderWidth: "2px",
				borderColor: "rgb(255,255,255)",
				
				padding: "",
				margin: "",
				
				width: "300px",
			},
			classes: ""
		},
		aqua: {
			/*styles: {
				backgroundColor: "teal",
				textColor: "rgb(204,204,204)",
				textSize: "24px",
				textWeight: "400",
				
				borderWidth: "2px",
				borderColor: "rgb(255,255,255)",
				letterSpacing: "-5px",
				textTransform: "lowercase",
				cornerRadius: "20px",
			},
			highlight: {
				backgroundColor: "rgb(204,204,204)",
				textColor: "teal",
				textWeight: "400",
				borderColor: "teal",
			},
			classes: ""*/
		},
		cloudy: {
			styles: {
				backgroundColor: "rgb(79,96,74)",
				borderColor: "rgb(189, 183, 107)",
				borderWidth: "0px",
				letterSpacing: "-3px",
				margin: "3px",
				padding: "13px",
				textColor: "rgb(189, 183, 107)",
				textSize: "25px",
				textTransform: "uppercase",
				textWeight: "7",
				width: "182px",
			}
		},
		onyx: {
			styles: {}, highlight: {}
		}
	},
	
	create: function(){
		this.inherited(arguments);
		
		this.controlParent.setHorizontal("hidden");
		
		this.createComponent({name: "themer", kind: "Neo.ThemeFile", type: "popupList", onUpdate: "updateTheme", showing: false},{owner:this});
		
		this.themeChanged();
		this.$.themer.loadSaved();
	},
	
	//@* theme functions
	//@* override
	themeChanged: function(oldValue){
		var r = this.inherited(arguments);
		
		//this.iconChanged();
		//this.textChanged();
		
		return r;
	},
	//@* override
	updateTheme: function(inSender, styles){
		if (this.container.children[0].kind == "onyx.PickerButton") {
			var _o = this.container.children[0];
			var _styles = enyo.clone(styles);
			
			if (!this.preview)
				delete _styles.width;
			
			this.$.themer.stylize(_styles, _o);
		}
		
		this.$.themer.stylize(styles, this);
		this.$.themer.stylize(styles, this.children[0]);
		this.applyStyle("min-width", styles.width);
		
		//this.render();
	},
	//@* handlers
	buttonTap: function(inSender, inEvent){
		console.log(inSender, inEvent)
		if ( (this.sample) && !(this.preview) ) {
			this.$.themer.customize();
			return false;
		}
		if ( (this.preview) ) {
			this.$.themer.preview(this.themePreview);
			return false;
		}
	},
});
