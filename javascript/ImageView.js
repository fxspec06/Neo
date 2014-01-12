enyo.kind({
	name: "Neo.ImageViewPopup",
	kind: "onyx.Popup",
	
	modal: true,
	events: {
		onClose : ""
	},
	style: "height: 100%; width: 100%; ",
	classes: "enyo-imageviewpopup",
	components: [
		{kind: "onyx.IconButton", style: "position: absolute; right: 10px; top: 10px; z-index: 1000;", src: "assets/images/icon-close.png", ontap: "doClose"},
		{name: "imageView", kind: "enyo.Image", style: "margin: 10px;", height: "100%", fit: true, onGetLeft: "getLeft", onGetRight: "getRight"}
	],
	create: function(){
		this.inherited(arguments);
	},
	setImages: function(inImages, inIndex) {
		this.$.imageView.applyStyle("height", window.innerHeight - 20 + "px");
		this.images = inImages;
		this.index = inIndex;
		this.$.imageView.setCenterSrc(this.images[this.index]);
	},

	getLeft: function(inSender, inSnap) {
		inSnap && this.index--;
		return this.images[this.index - 1];
	},

	getRight: function(inSender, inSnap) {
		inSnap && this.index++;
		return this.images[this.index + 1];
	}
});
