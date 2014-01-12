/*
 * 
 * 
 * fx.Fader.js
 * 
 * Created by: 	Bryan Leasot
 * 				@fxspec06
 * 				bshado@charter.net on 8/26/2012
 * 
 * 
 * Enyo 2.0 Image Fader JavaScript extension
 * 
 * Requires Enyo 2.0 or later
 * 
 * Usage
 * {name: "fader", kind: "fx.Fader"}
 * 
 * to hide and pause:
 * this.$.fader.hide();
 * 
 * to show and start:
 * this.$.fader.show();
 * 
 * Not a whole lot here!
 * 
 * 
 * Feel free to use and contribute as you like!
 * If you like it, feel free to give a shout-out @fxspec06
 * 
 * Happy Enyo-ing!
 * 
 */
enyo.kind({
	name: "fx.Fader",
	kind: "onyx.Scrim",
	floating: true,
	
	rootPath: "assets/fader/",
	
	//images named .png, they fade in order declared here
	covers: [
		"dark",
		"dark_glow",
		"dark",
		"normal",
		"glow",
		"normal",
		"grain",
		"normal",
		"dark_glow"
	],
	
	published: {
		variable: .02, //how much to increase the opacity
		timeout: .2, //seconds
		
		max: 100, //percent fade to
		min: 0, //percent fade out
		
		scrim: 75, //percent scrim
		scrimColor: "#ABACA0",
		
		size: 500, //how big is the image [centered]
		
		// values are: window, container
		reference: "window",
		
		//@ private
		_switch: false,
		rotateFlag: false
	},
	
	classes: "enyo-fit onyx-scrim",
	style: "position:fixed;z-index:999999;top:0;left:0;",
	
	components: [
		{name: "scrim", classes: "enyo-fit"},
		
		{name: "fader", kind: "Image", cover: -1, domStyles: {opacity: .5}},
		{name: "fadee", kind: "Image", cover: 0, domStyles: {opacity: .5}},
		
		{kind: "clearview"}
	],
	
	create: function(){
		this.inherited(arguments);
		
		if (this.max > 100) this.max = 100;
		if (this.min < 0) this.min = 0;
		
		this.max = this.max / 100;
		this.min = this.min / 100;
		
		if (this.min > this.max) this.min = this.max;
		
		this.max = round(this.max, 4);
		this.min = round(this.min, 4);
		
		this.$.scrim.applyStyle("opacity", round((this.scrim/100), 4));
		this.$.scrim.applyStyle("background-color", this.scrimColor);
		
		this.rotate();
		
		this.beginFade();
	},
	rotate: function(){
		var fr = this.$.fader;
		var fe = this.$.fadee;
		fr.cover++;
		fe.cover++;
		if(fe.cover >= this.covers.length){
			fe.cover = 0;
		}
		if(fr.cover >= this.covers.length){
			fr.cover = 0;
		}
		
		var _switch = fe.cover;
		fe.cover = fr.cover;
		fr.cover = _switch;
		
		this._switch = (!this._switch);
		
		this.imageSetup(fr);
		this.imageSetup(fe);
		
		this.rotateFlag = false;
	},
	beginFade: function(){
		this.fading = setInterval(this.fade.bind(this), this.timeout * 1000);
	},
	fade: function(event){
		if (this.rotateFlag) this.rotate();
		
		var fr = this.$.fader;
		var fe = this.$.fadee;
		
		if (this._switch) this.next(fr, fe);
			else this.next(fe, fr);
	},
	next: function(fr, fe){
		var opacity = 0;
		opacity = fr.domStyles.opacity + this.variable;
		
		opacity = round(opacity, 4);
		if (opacity >= this.max){
			this.rotateFlag = true;
		}
		
		var min = this.max - opacity + this.min;
		min = round(min, 4);
		
		fr.applyStyle("opacity", opacity);
		fe.applyStyle("opacity", min);
		
		//this.log("fading", opacity, min);
	},
	imageSetup: function(image){
		var width = 0;
		var height = 0;
		
		switch(this.reference){
			case "container":
				width = this.container.getBounds().width;
				height = this.container.getBounds().height;
				break;
			case "window":
				width = window.innerWidth;
				height = window.innerHeight;
				break;
		}
		
		image.applyStyle("width", this.size + "px");
		image.applyStyle("height", this.size + "px");
		image.applyStyle("right", (width - this.size) / 2 + "px");
		image.applyStyle("bottom", (height - this.size) / 2 + "px");
		image.applyStyle("position", "fixed");
		image.applyStyle("opacity", this.min - this.variable);
		image.setSrc(this.rootPath + this.covers[image.cover] + ".png");
	},
	show: function(){
		var r = this.inherited(arguments);
		this.beginFade();
		return r;
	},
	hide: function(){
		var r = this.inherited(arguments);
		clearTimeout(this.fading);
		return r;
	},
});
function round(num, dec) {
	var result = Math.round(num*Math.pow(10,dec))/Math.pow(10,dec);
	return result;
}