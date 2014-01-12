enyo.kind({
	name: "Neo.Tweet.small",
	kind: "Neo.Tweet",
	
	buildMediaPreviews: function() {
		return;
	},
	
	create: function() {
		this.inherited(arguments);
		this.$.header.refresh();
	},
	
	themes: {
		neo: {
			theme: [
				{tag: "table", attributes: {width: "100%"}, components: [
					{tag: "tr", components: [
						{tag: "td", attributes: {rowspan: "2", width: "70px"}, components: [
							{name: "avatar", kind: "Neo.Avatar"}
						]},
						{tag: "td", attributes: {width: "100%"}, components: [
							{name: "header", kind: "Neo.Header"}
					]}]},
					{tag: "tr", components: [
						{tag: "td", components: [
							{name: "body", kind:"Neo.Body"},
							{name: "timestamp", kind: "Neo.Timestamp"}
					]}]},
					{tag: "tr", components: [
						{tag: "td", attributes: {colspan: "2"}, components: [
							{name: "retweet", kind: "Neo.RetweetInfo", showing: false},
					]}]}
			]}],
			styles: {
				backgroundColor:"rgb(15,15,15)",
				textColor:"rgb(255,255,255)",
				textSize: "16px",
				textWeight: "400",
				layout: "neo",
				//letterSpacing:"-1px",
				textTransform: "",
				
				borderLeftSize: "3px",
				borderRightSize: "3px",
				borderLeftColor: "rgb(255,255,255)",
				borderRightColor: "rgb(255,255,255)",
				borderTopSize: "0px",
				borderBottomSize: "0px",
				borderTopColor: "",
				borderBottomColor: "",
			},
			// we use this to CHEAT..
			highlight: {
				textColor: "", // color
				textSize: "20px", // em
				textWeight: "400",
				//letterSpacing:"-1px",
				textTransform: "",
			},
			classes: ""
		},
		official: {
			theme: [
				{tag: "table", attributes: {width: "100%"}, components: [
					{tag: "tr", components: [
						{tag: "td", attributes: {width: "70px"}, components: [
							{name: "avatar", kind: "Neo.Avatar"}
						]},
						{tag: "td", attributes: {width: "100%"}, components: [
							{kind: "FittableColumns", fit: true, components: [
								{name: "header", kind: "Neo.Header", extra: {name: "timestamp", kind: "Neo.Timestamp"}}
							]},
					]}]},
					{tag: "tr", components: [
						{tag: "td", attributes: {colspan: "2"}, components: [
							{name: "body", kind:"Neo.Body"}
					]}]},
					/*{tag: "tr", components: [
						{tag: "td", attributes: {colspan: "2"}, components: [
							{name: "timestamp", kind: "Neo.Timestamp"}
					]}]},*/
					{tag: "tr", components: [
						{tag: "td", attributes: {colspan: "2"}, components: [
							{name: "retweet", kind: "Neo.RetweetInfo", showing: false},
					]}]}
			]}],
			styles: {
				backgroundColor:"rgb(255,255,255)",
				textColor:"rgb(85,119,48)",
				textSize: "16px",
				textWeight: "400",
				layout: "official",
				//letterSpacing:"-1px",
				textTransform: "",
				
				borderLeftSize: "3px",
				borderRightSize: "3px",
				borderLeftColor: "rgb(85,119,48)",
				borderRightColor: "rgb(85,119,48)",
				borderTopSize: "0px",
				borderBottomSize: "0px",
				borderTopColor: "",
				borderBottomColor: "",
				
			},
			// we use this to CHEAT..
			highlight: {
				textColor: "", // color
				textSize: "20px", // em
				textWeight: "400",
				//letterSpacing:"-1px",
				textTransform: "",
			},
			classes: ""
		},
		officialCondensed: {
			theme: [
				{tag: "table", attributes: {width: "100%"}, components: [
					{tag: "tr", components: [
						{tag: "td", attributes: {width: "70px"}, components: [
							{name: "avatar", kind: "Neo.Avatar"}
						]},
						{tag: "td", attributes: {width: "100%"}, components: [
							{components: [
								{kind: "FittableColumns", fit: true, components: [
									{name: "header", kind: "Neo.Header", extra: {name: "timestamp", kind: "Neo.Timestamp"}}
								]},
								{name: "body", kind:"Neo.Body"}
							]}
					]}]},
					{tag: "tr", components: [
						{tag: "td", attributes: {colspan: "2"}, components: [
							{name: "retweet", kind: "Neo.RetweetInfo", classes: "neo-tweet-retweet-condensed", showing: false},
					]}]}
			]}],
			styles: {
				backgroundColor:"rgb(204,0,255)", //#CC00FF
				textColor:"rgb(255,204,0)", //#FFCC00
				textSize: "16px",
				textWeight: "400",
				layout: "officialCondensed",
				//letterSpacing:"-1px",
				textTransform: "",
				
				
				borderLeftSize: "3px",
				borderRightSize: "3px",
				borderLeftColor: "rgb(255,204,0)", //#FFCC00
				borderRightColor: "rgb(255,204,0)", //#FFCC00
				borderTopSize: "0px",
				borderBottomSize: "0px",
				borderTopColor: "",
				borderBottomColor: "",
				
			},
			// we use this to CHEAT..
			highlight: {
				textColor: "", // color
				textSize: "20px", // em
				textWeight: "400",
				//letterSpacing:"-1px",
				textTransform: "",
			},
			classes: ""
		},
		blue: {
			styles: {
				backgroundColor: "rgb(14,44,58)",
				borderBottomColor: "rgb(184, 134, 11)",
				borderBottomSize: "7px",
				borderLeftColor: "rgb(91,108,72)",
				borderLeftSize: "0px",
				borderRightColor: "rgb(189, 183, 107)",
				borderRightSize: "0px",
				borderTopColor: "",
				borderTopSize: "0px",
				layout: "neo",
				//letterSpacing: "-2px",
				margin: "0px",
				padding: "0px",
				textColor: "rgb(189, 183, 107)",
				textSize: "20px",
				textTransform: "",
				textWeight: "0",
			},
			highlight: {
				//letterSpacing: "-1px",
				textColor: "rgb(82,114,102)",
				textSize: "14px",
				textTransform: "",
				textWeight: "0",
			},
			classes: ""
		},
		onyx: {
			styles: {
				layout: "neo",
			},
			highlight: {}
		}
	}
});
