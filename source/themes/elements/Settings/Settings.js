enyo.kind({
	name: "Neo.SettingsPopup",
	kind: "FittableRows",
	
	// wow, this is a panel!!! that's so cool!
	classes: "neo-container neo-settings",
	
	events: {
		onClose: ""
	},
	components: [
		{kind: "Neo.Toolbar", header: "Settings"},
		
		{name: "scroller", kind: "Scroller", thumb: false, fit: true, 
			touch: true, horizontal:"hidden", components: [ // @TODO: scroll fades.
			
			{kind: "Neo.setting", section: "Tweet Tap", title: "What happens when you tap a tweet", items: [
				{content: "Opens Panel", value: "panel"},
				{content: "Opens Popup", value: "popup"}
			], onChange: "setPreference", preferenceProperty: "tweet-tap"},
			
			{kind: "Neo.setting", section: "Tweet Hold", title: "What happens when you hold a tweet", items: [
				{content: "Opens Panel", value: "panel"},
				{content: "Opens Popup", value: "popup"},
				{content: "Does Nothing", value: "nothing"}
			], onChange: "setPreference", preferenceProperty: "tweet-hold"},
			
			{kind: "Neo.setting", section: "Toolbar Tap", title: "Scroll behavior when toolbar is tapped", items: [
				{content:'Top->Unread->Bottom', value:0},
				{content:'Top->Unread', value:1},
				{content:'Top->Bottom', value:2},
				{content:'Unread->Bottom', value:3},
				{content:'Top', value:4},
				{content:'Unread', value:5},
				{content:'Bottom', value:6}
			], onChange: "setPreference", preferenceProperty: "scroll-behavior"},
			
			{kind: "Neo.setting", section: "Toolbar Hold", title: "What happens when you hold the toolbar", items: [
				{content:'Mark As Read', value:'mark-read'},
				{content: 'Do Nothing', value:'do-nothing'}
			], onChange: "setPreference", preferenceProperty: "toolbar-hold"},
			
			{content: "Hide when minimized", classes: "neo-settings-header"},
			{classes:"onyx-toolbar-inline neo-settings-setting", components: [
				{content: "Toggles graphics when app is minimized"},
				{kind: "onyx.ToggleButton", onChange: "setPreference", preferenceProperty: "hide-when-minimized", style: "float:right;"}
			]},
			
			
			
			{content: "Panes", classes: "neo-settings-header"},
			{classes:"onyx-toolbar-inline neo-settings-setting", components: [
				{content: "Use two panes instead of one (beta)"},
				{kind: "onyx.ToggleButton", onChange: "setPreference", preferenceProperty: "two-panes", style: "float:right;"},
			]},
			
				// {kind: "FittableRows", style:"border:1px solid grey", classes: "gts-selectorBar",  components: [
					// {content: "Embedded Image Preview"},
					// {fit: true},
					// {kind: "onyx.ToggleButton", style:"float:right;", onchange: "ToggleButtontaped"}
				// ]},

			{content: "Compose", classes: "neo-settings-header"},
			{classes:"onyx-toolbar-inline neo-settings-setting", components: [
				{content: "Enter key posts"},
				{kind: "onyx.ToggleButton", onChange: "setPreference", preferenceProperty: "post-send-on-enter", style: "float:right;"}
			]},
			
			{classes:"onyx-toolbar-inline neo-settings-setting", components: [
				{content: "Refresh after posting"},
				{kind: "onyx.ToggleButton", onChange: "setPreference", style: "float:right;", preferenceProperty: "refresh-after-posting", }
			]},
			
			{kind: "Neo.setting", section: "Refresh", title: "Frequency", items: [
				{content:'Never', value:0},
				{content:'5 min', value:300000},
				{content:'10 min', value:600000},
				{content:'15 min', value:900000},
				{content:'30 min', value:1800000},
				{content:'1 hr', value:3600000},
				{content:'2 hr', value:7200000},
				{content:'4 hr', value:14400000},
				{content:'8 hr', value:28800000}
			], onChange: "setPreference", preferenceProperty: "network-refreshinterval"},
			
			
			{classes:"onyx-toolbar-inline neo-settings-setting", components: [
				{content: "Scroll to unread after refresh"},
				{kind: "onyx.ToggleButton", onChange: "setPreference", preferenceProperty: "timeline-scrollonupdate", style:"float: right;"}
			]},
			
//{kind: "onyx.Item", content: "Interval for Searches"},
			
			
			{content: "Notifications", classes: "neo-settings-header"},
			{classes:"onyx-toolbar-inline neo-settings-setting", components: [
				{content: "New tweets"},
				{kind: "onyx.ToggleButton", onChange: "setPreference", preferenceProperty: "notify-newmessages", style:"float:right;"}
			]},
			
			{classes:"onyx-toolbar-inline neo-settings-setting", components: [
				{content: "New mentions"},
				{kind: "onyx.ToggleButton", onChange: "setPreference", preferenceProperty: "notify-mentions", style:"float:right;"}
			]},
			
			{classes:"onyx-toolbar-inline neo-settings-setting", components: [
				{content: "New DMs"},
				{kind: "onyx.ToggleButton", onChange: "setPreference", preferenceProperty: "notify-dms", style:"float:right;"}
			]},
			
			{classes:"onyx-toolbar-inline neo-settings-setting", components: [
				{content: "New search results"},
				{kind: "onyx.ToggleButton", onChange: "setPreference", preferenceProperty: "notify-searchresults", style:"float:right;"}
			]},
			
			{kind: "Neo.setting", section: "URL Shortening", title: "Preferred service for shortening URLs", items: [
				{content: "bit.ly", value: "bit.ly"},
				{content: "j.mp", value: "j.mp"},
				{content: "is.gd", value: "is.gd"},
				{content: "go.ly", value: "go.ly"},
				{content: "goo.gl", value: "goo.gl"}
			], onChange: "setPreference", preferenceProperty: "url-shortener"},
			
			{kind: "Neo.setting", section: "Image Upload", title: "Preferred service for uploading images", items: [
				{content: "drippic", value:"drippic"},
				{content: "pikchur", value:"pikchur"},
				{content: "twitpic", value:"twitpic"},
				{content: "twitgoo", value:"twitgoo"},
				{content: "identi.ca", value:"identi.ca"},
				{content: "statusnet", value: "statusnet"}
			], onChange: "setPreference", preferenceProperty: "image-uploader"},
			
			
			
			{content: "Data", classes: "neo-settings-header"},
			{classes:"onyx-toolbar-inline neo-settings-setting", components: [
				{content: "Save data on exit (recommended)"},
				{kind: "onyx.ToggleButton", onChange: "setPreference", preferenceProperty: "save-on-exit", style: "float:right;"},
			]},
			
			
			{classes:"onyx-toolbar-inline neo-settings-setting", components: [
				{components: [
					{content: "Clear saved tweet data for all accounts"},
					{tag: "br"},
					{content: "NOTE: This does NOT delete account data"},
				]},
				{kind: "Neo.Button", text: "Clear", ontap: "clearData", style:"float:right;"}
			]},
			
			{classes:"onyx-toolbar-inline neo-settings-setting", components: [
				{components: [
					{content: "Clear All Data"},
					{tag: "br"},
					{content: "This action will delete everything."},
				]},
				{kind: "Neo.Button", text: "Clear All", ontap: "clearAll", style:"float:right;", classes: "onyx-negative", blue: false}
			]},
			
		]},
		
		{kind: "Neo.Toolbar", middle: [
			{kind: "Neo.Button", ontap: "doClose", text: "Close", icon: "exit", collapse: false}
		]},
	],
	numLoaded: 0,
	create: function(){
		this.inherited(arguments);
		//this.render();
		//this.reset();
	},
	reset: function(){
		var pickers = ["tweet-tap", "tweet-hold", "network-refreshinterval", "url-shortener", "image-uploader"];
		
		_.each(this.getComponents(), function(component){
			if(component.preferenceProperty){
				if(App.Prefs.get(component.preferenceProperty) === undefined){
					App.Prefs.set(component.preferenceProperty, SPAZ_DEFAULT_PREFS[component.preferenceProperty]);
				}
				component.kind
				if(component.kind === "onyx.ToggleButton"){
					component.setValue(App.Prefs.get(component.preferenceProperty));
				} else {
					component.render();
					
					
					var value = App.Prefs.get(component.preferenceProperty);
					//console.log(component.preferenceProperty, "looking for", value);
					for(var x in component.$.popupList.controls){
						var toSelect = component.$.popupList.controls[x];
						
						//console.log(component, x, toSelect)
						if (toSelect.value == value) {
							
							console.log("found!", toSelect, value, toSelect.value)
							
							component.$.popupList.setSelected(component.$.popupList.controls[x]);
							component.render();
							break;
						}
					}
				}
			}
		});
	},
	setPreference: function(inSender, inEvent){
		this.numLoaded++;
		// there are 14 theme elements
		if (this.numLoaded < 14) {
			this.log('/t', this.numLoaded);
			return;
		}
		
		//console.log("preference picked", inSender, inEvent, inSender.preferenceProperty);
		
		if(inEvent.originator.kind === "onyx.ToggleButton"){
			App.Prefs.set(inSender.preferenceProperty, inEvent.value);
		} else {
			App.Prefs.set(inSender.preferenceProperty, inEvent.selected.value);
			//inSender.render();
			var x = true;
		}
		
		if(x){
			AppUI.rerenderTimelines();
		}
		
	},
	setRefreshPreference: function(inSender, inValue){
		this.setPreference(inSender, inValue);
		AppUI.restartAutoRefresher();
	},
	clearData: function(inSender, inEvent){
		var users = App.Users.getAll();
		for(var x in users){
			var user = users[x];
			console.log(user.id, App.Prefs.get("currentUser"))
			App.Prefs.set("columns_" + user.id, null);
		}
		AppUI.reloadColumns();
		AppUI.rerenderTimelines();
	},
	
	
	//NOTE: This will erase ALL app data, including accounts
	clearAll: function(inSender, inEvent){
		var alertBox = new alert( "<h1 style='color: red;'>WARNING!</h1><h2 style='color: red;'>" + 
					"This will erase ALL app data, including accounts.<br/>" + 
					"Performing this action will restart the application." + 
					"<br/>Are you SURE you want to continue?", this, {
 			cancelText: "Remove Accounts",
 			confirmText: "CANCEL",
 			onConfirm: function ( context ) { this.destroy() },
 			onCancel: function ( context ) { localStorage.preferences_json = null; window.location.reload(); }
		});
		
		alertBox.applyStyle("height", "350px");
	}
});
