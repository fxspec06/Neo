enyo.depends(
	// FOLDERS
		"config",
		"resources",
		"helpers",
		"libs",
		"filters",
		"models",
	
	// pretty much does everything..
		"Container.js",
	// also does everything, but on a smaller scale
		"BackgroundColumn.js",
		"Column.js",
	// then our lil' customized columns
		"TrendsColumn.js",
		"ListColumn.js",
		"FiltersColumn.js",
		
	// details content files
		"TweetView.js",
		"UserView.js",
		"Conversation.js",
	// non changing views
		"ComposePopup.js",
		"SearchPopup.js",
		"AccountsPopup.js",
			"AccountsList.js",
		"FilterPopup.js",
		"AboutPopup.js",
		"PulldownList.js",
	// notifications
		"NeoNotifier.js",
	
	// TODO
		"ImageView.js"
);