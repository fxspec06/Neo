var neo = {}
neo.ui = {}
neo.themes = {}
neo.bugs = {}
var priorities = [];

/*
 * more priorities
 */
priorities.push("pre 3 white notifications");


function uiImprovements(){enyo.log("UI IMPROVEMENTS STATUS: ", neo.ui.done ? "COMPLETE." : "INCOMPLETE...")}
neo.ui.done = false;

/* UI IMPROVEMENTS
==========================================================================
**************************************************************************
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

SETTINGS
**************************************************************************
for the folowing
//@ center and H1 all text
//@ make sure margins are good and buttons look good
//@ also make all scrollers touch

ACCOUNTS
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//@ fix the scrollers
//@ make scrolling thumb
//@ for new accounts, get rid of -> arrow and use the ASCII arrow char
//@ also make ALL accounts the same button as we have everywhere else
	//> to do this use classes 'onyx-blue avatar'
	//> our toolbar classes is "kind: onyx.Toolbar, classes: 'neo-toolbar'"
//@ you can keep the affirmative and negative ones but add those classes to the css
	//> i.e. onyx-blue.avatar, onyx-negative.avatar //etc
//@ make new accounts PRETTY. i.e. make pin like messages, make bottom button look cool etc
	//> i don't mind having the close button grey
//@TODO if you feel ambitious you can try making a small webview that loads the page to login to twitter below
//@ if you can see what's wrong with after you log in the app erroring that'd be sweeeeet...
//@ make navigation in accounts simpler, i.e. make 'cancel' a back button
//@ don't create new components in the bottom toolbar for remove account, i think it's bad.
	//> if you WANT, MODIFY my alert() kind to look more like our app, and use THAT
	//> for our confirm popup. that would be VERY cool.
//@TODO make tapping on the account from accounts view take you to the account
//@ again in the single account screen:
	//> get rid of ascII -> arrow
	//> move back to top left toolbar
	//> move close to top right
//@ can keep remove on bottom.. mayb put info about the account in accounts > xxx @ twitter
	//> like info on data storage, a button to remove the storage..
=====================================

ABOUT
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//@ see if you can fix the undefined undefined in chrome.. it's relating to getappinfo.js
	custom file i made and the actual enyo.fetchappinfo one. mayb you could make
	an enyo.fetchappinfo function that detects where to get the info from..
*/priorities.push("make view license work");/*
//@TODO change get help button to make something else, like popup or some shit... or 'coming soon'
//@TODO add more about info lol
=====================================

SETTINGS
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//@ move data to BOTTOM.
//@ center and H1 settings text
//@ you can touch this up however you like it, it's good for now though...
=====================================

THEMES
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//@ center and h1 title bar
//@ change 'SETTINGS' to 'THEMES'
//@ section off better
//@ fix pickers
** this might end up being a full screen
	//> IDEAS FOR FULL SCREEN
	//> make full screen image of app or app elements and make them tappable
	//> on element tap have popup of different examples user can pick.....
	//> user picks and returns to full screen image of app / elements with updated changes
		//> lots of work, but COOL AS FUCK.
=====================================

RETWEETS, LISTS, MESSAGES
**************************************************************************
//@ radiobuttons on bottom are not EXACTLY the same style as the onyx-blue.avatar buttons	//@
	//> these should be fixed. don't ask me lol
=====================================

SEARCH
**************************************************************************
//@ tweets don't display time or tweet data completely
	//> this should be fixed
	//@ //> find out what else does this and LMK
=====================================
=====================================
=====================================
=====================================
=====================================

EVERYWHERE ELSE
**************************************************************************

OTHER
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//@ i think maybe comment out all 'thumb:false' statements i.e. scroll indicator...
*//*priorities.push("add unread indicator to left sidebar");/*
	//> i.e. in light grey, make light grey complete circle / oblong shape
	//> inside this oblong shape, put text the color of the BACKGROUND (not the light grey) with unread ##
	//> on mark as read make sure this goes away.
//@ add more button to bottom of columns
//@TODO add border / layer in between old tweets and new tweets
//@TODO add ability to create, delete, and modify lists
//@ AUTOCOMPLETE.
//@ breadcrumbs
	//> breadcrumbs is a history / trail of where you are and where you've been
	//> we don't have to display them, but we should have a stack to revert to when columns are closed or tweets are sent
//@TODO more trending options i.e. local, natl, global 

=====================================

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
==========================================================================
**************************************************************************/


function themes(){enyo.log("THEMES STATUS: ", neo.themes.done ? "COMPLETE." : "INCOMPLETE...")}
neo.themes.done = false;

/* THEMING PLAN. SUPER ULTRA MEGA IMPORTANT / COOL
==========================================================================
**************************************************************************
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//@ change the stupid CSS style names of onyx-blue.avatar to something else
	//> find a solution for this shit. idk how we're gonna do / i.e. best way but it's not elegant R.N.
	//> probably best is to make our own neo-button style that DOESN'T restrict size and is flexable if we need it
		//> i.e. neo-button.neo-button-stretch
		//> this should NOT colour it. we're gonna have themes colour that shit.
//@ redux all css in all folders to ACTUALLY MAKE SENSE


//@ add a themes folder inside source
vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
//@ separate CSS files
	//> make FOLDERS for CSS, not just separate files, and have a package.js file in each CSS folder
//@ make a .js file for EACH element type
//@ this is just to start. the .js file would be a kind that loads the element popup for the themes page
//@ lastly, the .js file would be called in the app
	//> it could load the theme for that particular element whenever it is rendered
	//> it could also show the element in the master themes page
		//> THIS would make it REAL easy to add our own special themes for the app.
//@ create main themes file that loads all components into one cool looking layout
	//> doesn't need to be FANCY just look sorta like the UI
	//> can use some fixed positioning if you want, really, don't get carried away
//@ make this main themes file call each element's edit page ontap
//@TODO hand pick only the best awesome colours we want people using
	//> colours that go well together
//@TODO hand pick only the best patterns we want people using
	//> inspired by carbon, we're gonna do it better
//@ replicate official twitter tweet specifications
*/priorities.push("create standard neo kickass looking themes. maybe a few of them");/*
//@TODO make cooler looking buttons



~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
==========================================================================
**************************************************************************/


function bugs(){enyo.log("BUGS STATUS: ", neo.bugs.fixed ? "FIXED." : "BROKEN...")}
neo.bugs.fixed = false;

/* BUGS
==========================================================================
**************************************************************************
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


KNOWN BUGS
**************************************************************************

//@ notifications don't show / layer
*/priorities.push("notifications for tweets show as 'mentions'");
//priorities.push("app freezes when hitting x on column sometimes");
/*priorities.push("top toolbar doesn't always show correct column");/*
//@ refresh button on top left is not .. great. -__-
	//> refresh should refresh like timeline messages and mentions always
	//> also it should refresh whatever page is on as well
//@: avatar in lists is far off to left
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
==========================================================================
**************************************************************************/