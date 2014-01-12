enyo.kind({
	name: "Neo.Body",
	allowHtml: true,
	classes: "neo-tweet-body  ",
	create: function() {
		this.inherited(arguments);
		this.applyStyle('overflow', 'auto')
	}
});