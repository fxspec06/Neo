enyo.kind({
	name: "Neo.FilterPopup",
	kind: "FittableRows",
	
	style: "text-align: center;",
	
	events: {
		onClose: ""
	},
	
	components: [
		{kind: "Neo.Toolbar", header: "Add Filter", closeable: true},
		
		{classes: "compose", components: [
			{tag: "hr"},
			{kind: "onyx.InputDecorator", components: [
				{name:"searchTextBox", kind: "Neo.RichText", onkeydown: "searchBoxKeydown", alwaysLooksFocused: true, selectAllOnFocus: true,
					richContent: false, multiline: false},
			]},
			{tag: "hr"},
		]},
		
		{kind: "Neo.Toolbar", middle: [
			{name: "addButton", kind: "Neo.Button", ontap: "addFilter", text: "Create Filter",
				icon: "tick", blue: false, classes: "onyx-affirmative"}
		]}

	],
	close: function() {
		this.inherited(arguments);
	},
	reset: function() {
		this.$.searchTextBox.setValue('');
		this.$.searchTextBox.focus();
	},
	
	setupItem: function(inSender, inEvent) {
		var item = this.searches[inEvent.index];
		enyo.error(item);
		this.$.searchesContent.setContent(item);
	},
	searchBoxKeydown: function(inSender, inEvent) {
		if (inEvent.keyCode === 13) {
			this.addFilter();
			inEvent.preventDefault();
		}
	},
	addFilter: function() {
		var label = this.$.searchTextBox.getValue();
		this.$.richText.blur();
		this.doClose();
		AppUI.addFilter(label);
	}
});
