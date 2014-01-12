enyo.kind({
	name: "Neo.RetweetInfo",
	kind: "Neo.Subtext",
	classes: "neo-tweet-retweet",
	layoutKind: "FittableColumnsLayout",
	
	components: [
		{content: "Retweeted by"},
		{classes: "username", name: "username"},
		{classes: "published", name: "published"}
	]
})
