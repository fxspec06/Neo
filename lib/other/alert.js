/*
 * 
 * 
 * alert.js
 * 
 * Created by: 	Bryan Leasot
 * 				@fxspec06
 * 				bshado@charter.net on 5/26/2012
 * 
 * 
 * Enyo 2.0 alert() JavaScript extension
 * 
 * Replaces JavaScript alert() and adds extended functionality
 * Requires Enyo 2.0b4 or later and Onyx UI package
 * 
 * Usage
 * 
 * alert( message, context );
 * Where context is the component the Alert message will belong to
 * 
 * 		alert( "Hello World", this );
 * 
 * creates a basic Onyx alert box with the text Hello World and a confirm button
 * 
 * alert( message, context, options );
 * Options is an optional parameter that sets properties directly to the alert object
 * Using options changes the alert box to dynamic type
 * 
 * 		var options = {
 * 			onConfirm (func),
 * 			onCancel (func),
 * 			confirmText (str),
 * 			cancelText (str),
 * 			doCancel (bool)
 * 		}
 * 
 * doCancel is automatically set to true if onCancel or cancelMessage is specified
 * onConfirm and onCancel are both called when the respective buttons are triggered
 * If no cancelText or confirmText is specified, the default values of "CONTINUE" and "CANCEL" are used
 * 		
 * 		var index = inEvent.index;
 * 		
 * 		alert( "Delete?", this, {
 * 			cancelText: "No",
 * 			confirmText: "Yes",
 * 			onCancel: this.cancel,
 * 			onConfirm: function ( context ) { context.delete( index ) }
 * 		} );
 * 
 * As a last extended feature, the alert() function returns the Enyo instance of itself for future modification
 * 
 * 		var myAlert = alert( "Are you sure?", this, { doCancel: true } );
 * 		myAlert.setCancelMessage( "No" );
 * 		myAlert.confirm = this.confirm;
 * 
 * 
 * Feel free to use and contribute as you like!
 * If you like it, feel free to give a shout-out @fxspec06
 * 
 * Happy Enyo-ing!
 * 
 */


enyo.kind({
	name: "Alert",
	kind: "onyx.Popup",
	layoutKind: "FittableRowsLayout",
	classes: "enyo-fit",
	style: "width: 350px; height: 250px; position: fixed; padding: 40px; z-index: 2;",
	centered: true,
	//modal: true,
	floating: true,
	autoDismiss: false,
	published: {
		message: "",
		confirmText: "CONTINUE",
		cancelText: "CANCEL",
		doCancel: false,
		dynamic: false,
		onCancel: (function(inContext){}),
		onConfirm: (function(inContext){})
	},
	components: [
		{ name: "message", allowHtml: true },
		{ name: "space", fit: true },
		{ layoutKind: "FittableColumnsLayout", components: [
			{ name: "cancel", kind: "onyx.Button", ontap: "cancel", showing: false, classes: "onyx-negative", content: this.cancelText, style: "width: 50% !important;" },
			{ name: "confirm", kind: "onyx.Button", ontap: "confirm", classes: "onyx-affirmative", content: this.confirmText, fit: true }
		]}
	],
	create: function() {
		this.inherited(arguments);
		this.messageChanged();
		this.dynamicChanged();
	},
	dynamicChanged: function(oldValue) {
		this.onCancelTextChanged();
		this.onConfirmTextChanged();
		this.onDoCancelChanged();
	},
	onCancelTextChanged: function(oldCancelText) {
		this.$.cancel.setContent(this.cancelText);
	},
	onConfirmTextChanged: function(oldConfirmText) {
		this.$.confirm.setContent(this.confirmText);
	},
	onDoCancelChanged: function(oldValue) {
		this.$.cancel.setShowing(this.doCancel);
	},
	messageChanged: function(oldMessage) {
		this.$.message.setContent(this.message);
	},
	confirm: function(inSender, inEvent) {
		this.onConfirm(this.owner);
		this.destroy();
	},
	cancel: function(inSender, inEvent) {
		this.onCancel(this.owner);
		this.destroy();
	}
});

function alert(message, context, options) {
	//var _node = context.createComponent();
	//_node.render();
	//var _alert = new Alert().renderInto(_node.node);
	
	var _alert = context.createComponent(new Alert());
	
	_alert.setMessage(message);
	_alert.setOwner(context);

	if(options != null) {
		_alert.setDoCancel( typeof options.onCancel == "function" || typeof options.cancelText == "string");
		for(var _option in options ) {
			_alert[_option] = options[_option];
		}
		_alert.setDynamic(true);
	}

	_alert.setShowing(true);
	return _alert;
}