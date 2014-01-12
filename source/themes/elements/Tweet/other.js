enyo.kind({
	name: "Neo.Tweet.other",
	kind: "Neo.Tweet.small",
	
	published: {
		show: ["body"]
	},
	
	create: function(){
		this.inherited(arguments);
		
		var hide = ["retweet","timestamp","header","avatar", "body"];
		for(var raw in hide){
			this.$[hide[raw]].hide();
		}
		
		var show = this.show;
		for(var raw in show){
			this.$[show[raw]].show();
		}
	}
});
