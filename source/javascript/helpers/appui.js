AppUI = {
	addFunction: function(inName, inFunction, inScope){
		AppUI[inName] = enyo.bind(inScope || this, inFunction); //create the function with proper scope
	}
};
	//setup the namespace. These are global references to component-owned functions, so they are set up in the components.
	/*
	syntax:
		functionName
			(argument1, argument2, argument3)
			- what the function does
			- where it is setup

	available functions:

		refresh
			()
			- refresh all columns
			- source/javascript/Sidebar.js
		rerenderTimelines
			()
			- re-render all timelines, gets all favorites again
			- source/javascript/Container.js
		viewUser
			(inUsername, inService, inAccountId)
			- show the userView
			- source/javascript/Neo.js
		viewTweet
			(inTweet)
			- show tweetView
			- source/javascript/Neo.js
		reply
			(inTweet)
			- show composePopup in reply to inTweet
			- source/javascript/Neo.js
		search
			(inQuery, inAccountId)
			- create search column
			- source/javascript/Container.js
		confirmDeleteTweet
			(inTweet)
			- show confirm tweet dialog
			- source/javascript/Neo.js
		deleteTweet
			(inTweet)
			- delete the tweet from the service
			- source/javascript/Neo.js
		removeTweetById
			(inTweetId)
			- search for and remove the tweet with the given id from each column
			- source/javascript/Container.js
	*/
