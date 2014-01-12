enyo.kind({
	name: "Neo.TrendsColumn",
	kind: "Neo.Column",
	_list_guts: [
		{name: "item", kind: "Neo.Tweet.other", ontap: "searchTrend"},

	],
	loadTrendsFinished: function(data) {
		this.tweets = data;
		this.buildList();
	},
	setupRow: function(inSender, inEvent) {
		var trend = this.tweets[inEvent.index];
		this.$.item.setTweet({text: trend.name});
//		this.$.item.$.body.setContent(trend.name);
	},
	searchTrend: function(inSender, inEvent){
		console.log("attempting search for", inSender.content)
		AppUI.search(this.tweets[inEvent.index].name, App.Prefs.get("currentUser"));
	}
});