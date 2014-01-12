enyo.kind({
	name: "Neo.Avatar",
	components: [
		{name: "author", kind: "Image", classes: "neo-avatar"},
		{name: "retweeter", kind: "Image", classes: "neo-avatar neo-avatar-retweet", showing: false},
	]
});