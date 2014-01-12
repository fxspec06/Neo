enyo.kind({
	name: "Neo.Tweet.large",
	kind: "Neo.Tweet.small",
	
	tweetChanged: function() {
		this.inherited(arguments);
		this.$.tweet.applyStyle("font-size","1.5em !important");
	},
	//@* public
	//@* generates media previews for the tweet
	buildMediaPreviews: function() {
		//this.log(this.$.body.getContent())
		var self = this,
			siu = new SpazImageURL(),
			imageThumbUrls = siu.getThumbsForUrls(this.$.body.getContent()),
			imageFullUrls = siu.getImagesForUrls(this.$.body.getContent()),
			i = 0;
		
		//this.log(imageThumbUrls);
		
		this.imageFullUrls = [];
		
		if (imageThumbUrls) {
			//this.log('images found... loading images...')
			for (var imageUrl in imageThumbUrls) {
				var imageComponent = this.$.images.createComponent({
					kind: "Image",
					name: "imagePreview" + i,
					
					style: "height: 10px;",
					ontap: "imageClick",
					src: imageThumbUrls[imageUrl]
				}, {owner: this});
				imageComponent.render();
				//this.log(imageUrl);
				this.imageFullUrls.push(imageFullUrls[imageUrl]);
				i++;
			}
		} else {
			jQuery('#'+this.$.tweet.id).embedly({maxWidth: 300, maxHeight:300, method:'afterParent', wrapElement:'div', classes:'thumbnails',
				success: function(oembed, dict) {
					if (oembed.code.indexOf('<embed') === -1)
						// webOS won't render Flash inside an app. DERP.
						self.$.images.createComponent({ kind: "enyo.Control", owner: self, components: [
							{style: "height: 10px;"},
							// {kind: "enyo.Image", style: "max-width: 100%;", ontap: "embedlyClick", src: oembed.thumbnail_url, url: oembed.url},
							{kind: "FittableColumns", pack: "center", components: [
								{name: "oembed_code", allowHtml: true, content:oembed.code}
							]}
						]}).render();
					else enyo.log("skipping oembed with <embed> tag in it", oembed.code);
				}
			});
		}
		this.render();
		this.reflow();
	},
});
