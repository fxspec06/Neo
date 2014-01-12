enyo.kind({
	name: "Neo.ColorSquare",
	
	kind: 'FittableColumns',
	
	style: 'width: 200px; height: 100px; margin: auto; border: 2px solid white; background-color: black;',
	
	published: {
		color: '', // hex
		notap: false, // set true prevents user from tapping
	},
	
	handlers: {
		ontap: 'handleTapped',
	},
	
	components: [
	    {name: 'color', classes: 'enyo-fit'},
		{name: 'nocolmsg', showing: false, style: 'color: white;', content: 'Tap to choose...'}
	],
	
	create: function() {
		this.inherited(arguments);
		
		// init
		this.colorChanged();
	},
	
	
	
	//@* handlers
	//@* called when tapping on the color square
	handleTapped: function(s, e) {
		if (this.notap) return true;
		this.openPicker();
	},
	
	//@* automatically called
	//@* sets the color
	colorChanged: function(oldColor) {//this.log();
		this.$.nocolmsg.setShowing(false);
		if (!this.color) this.setNoColor();
		else this.$.color.applyStyle('background-color', this.color);
	},
	
	//@* public
	//@* shows the word 'choose' in the middle of the square to let user know no color is selected
	setNoColor: function() {
		this.$.nocolmsg.setShowing(true);
		this.$.color.applyStyle('background-color', null);
	},
	
	
	//@* opens secondary screen
	//@* presents the user with fancy dancy 3rd world full screen selection mechanism
	openPicker: function() {
		console.log('opening picker........');
	}
	
});