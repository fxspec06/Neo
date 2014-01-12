enyo.kind({
	name: "Neo.PulldownList",
	kind: "enyo.PulldownList",
	pulldownTools: [
		{name: "pulldown", classes: "neo-list-pulldown", components: [
			{name: "puller", kind: "Neo.Puller"}
		]}
	],
	//* Message displayed when list is not being pulled 
	pullingMessage: "load tweets",
	//* Message displayed while a pull action is in progress
	pulledMessage: "release...",
	//* Message displayed while data is being retrieved
	loadingMessage: "loading...",
	//
	pullingIconClass: "neo-puller-arrow neo-puller-arrow-down",
	pulledIconClass: "neo-puller-arrow neo-puller-arrow-up",
	loadingIconClass: "",
});

enyo.kind({
	name: "Neo.Puller",
	kind: "Neo.Tweet.other",
	
	show: [],
	
	published: {
		text: "",
		iconClass: ""
	},
	
	pullee: [
		{name: "iconleft", classes: "inside", style: "float: left;"},
		{name: "iconright", classes: "outside", style: "float: right;"},
		{name: "text", classes: "neo-puller-text"},
	],
	
	create: function() {
		this.inherited(arguments);
		this.$.body.parent.createComponents(this.pullee, {owner: this});
		this.textChanged();
		this.iconClassChanged();
	},
	textChanged: function() {
		this.$.text.setContent(this.text);
		this.render();
	},
	iconClassChanged: function(oldVal) {
		this.$.iconleft.removeClass(oldVal);
		this.$.iconright.removeClass(oldVal);
		
		this.$.iconleft.addClass(this.iconClass);
		this.$.iconright.addClass(this.iconClass);
	}
});
