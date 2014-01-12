enyo.kind({
	name: "Neo.SendButton",
	kind: "Neo.Button",
	
	published: {
		remaining: 140,
		collapse: false
	},
	
	//{name: "remaining", content: "140", style: "color: white; padding-left: 15px; font-weight: 900;"},
	
	create: function(){
		this.inherited(arguments);
		this.$.button.createComponent({name: "remaining", classes: "neo-button-send"});
	},
	
	themeChanged: function(oldValue){
		this.inherited(arguments);
		
		this.remainingChanged();
	},
	
	textChanged: function(oldText){
		var text = this.text;
		
		if (this.$.text) this.$.text.destroy();
		
		var component = {name: "text", content: text, allowHtml: true}
		
		this.$.button.createComponent(component, {owner: this});
	},
	remainingChanged: function(oldValue){
		var remaining = this.remaining;
		
		if (this.$.remaining) this.$.remaining.destroy();
		//console.log(remaining);
		var component = {name: "remaining", content: remaining, classes: "neo-button-send"}
		
		this.$.button.createComponent(component, {owner: this});
		this.$.button.render();
		
		if (remaining > 20) {
			this.$.remaining.applyStyle("color", "inherit");
			this.setDisabled(remaining === 140);
		} else if (remaining <= 20 && remaining >= 0){
			this.$.remaining.applyStyle("color", "orange");
			this.setDisabled(false);
		} else {
			this.$.remaining.applyStyle("color", "red");
			this.setDisabled(true);
		}
	},
})
