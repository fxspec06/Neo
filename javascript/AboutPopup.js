enyo.kind({
	name: 'Neo.AboutPopup',
	style: 'color: grey; text-align: center;',
	
	// actually a freaking panel. who woulda thought? ;D
	
	layoutKind: 'FittableRowsLayout',
	
	events: {
		onClose: '',
	},
	components: [
		{kind: 'Neo.Toolbar', header: 'About', closeable: true, onclose: 'exit'},
		//{name: 'cover', kind: 'fx.Fader', floating: false, scrim: 10, size: 256, reference: 'container', min: 0, max: 50},

			{name: 'panels', kind: 'Panels', draggable: false, index: 0, fit: true, components: [
				{name: 'about', kind: 'Scroller', fit: true, touch: true, thumb: false, components: [
					{tag: 'h1', content: enyo.fetchAppInfo().title + ' v' + enyo.fetchAppInfo().version, allowHtml: true},
					{tag: 'br'},
					{content: 'Neo Twitter Client'},
					{tag: 'br'},
					{content: 'by Jake Morrison and Bryan Leasot'},
					{tag: 'br'},
					{content: 'The only twitter client you need'},
					{tag: 'br'},
					{tag: 'br'},
					{tag: 'br'},
					{tag: 'br'},
					{content: 'For more information, follow @Neo_webOS'},
					{tag: 'br'},
					{content: 'For help, send an email to fxjmapps@gmail.com'},
					{tag: 'br'},
					{content: 'To talk to the developers, follow @fxspec06 and @JakeMorrison24'},
					{tag: 'br'},
					{content: 'To learn more about Enyo, follow @EnyoJS and visit http://www.enyojs.com/'},
					{tag: 'br'},
					{content: 'To find the latest news and information about webOS, follow @webOSNation and visit http://www.webosnation.com/'},
					{tag: 'br'},
					{content: 'To get the most out of your webOS device, follow @webosinternals and visit http://www.webosinternals.org/'},
					{tag: 'br'},
					{content: 'To chat with cool webOS fans, visit #webos, #webos-ports, #webos-offtopic, and #enyojs on the IRC freenode network'},
					{style: 'height: 75%;'},
					{tag: 'h1', content: 'Thank you for purchasing Neo'},
					{tag: 'br'},
					{kind: "Neo.Icon", _col: "red_dark/", _res: 'xhdpi/', icon: 'heart', style: 'width: 50px; height: 50px;margin:auto;'},
					{tag: 'br'},
					{style: 'font-style: italic;', content: 'Support webOS developers'},
					{style: 'height: 50%;'},
				]},
				{kind: 'Scroller', fit: true, touch: true, thumb: false, allowHtml: true, components: [
					{name: 'licence', allowHtml: true}
				]},
				{kind: 'Scroller', fit: true, touch: true, thumb: false, allowHtml: true, components: [
					{tag: 'h1', content: enyo.fetchAppInfo().title + ' v' + enyo.fetchAppInfo().version, allowHtml: true},
					{tag: 'br'},
					{content: 'CHANGELOG'},
					{tag: 'br'},
					{style: "text-align: left;", allowHtml: true, content: '//////////////////////////\n//						// 1.3.13\n//						// version 0.5.3\n//						// app catalog submission\n	//\n	//- Fixed twitter search URL\n	//- Fixed large tweet bug\n	//- Added anchors for lists\n	//- Fixed lack of notifications\n	//- Fixed horrible retweet bug\n	//- Fixed avatar bug from 0.5.1\n	//- Fixed infamous \'black screen glitch\'\n	//\n	//'},
					{tag: 'br'},
					{style: "text-align: left;", allowHtml: true, content: '//////////////////////////<br/>//						// 12.27.12<br/>//						// version 0.5.2 *beta<br/>//<br/>// - Added ability to tap a selected sidebar to select it again (temp fix to help deal with "black screen glitch")<br/>// - Fixed glitch from unreleased 0.5.1 with icons<br/>// - Added more icons<br/>// - Separated themes from basic and advanced<br/>// - Added 6 new Toolbar themes to select<br/>//- Added changelog to about section<br/>// - Added placeholder help button to Themes<br/>// - Added placeholder basic button to Themes<br/>// - Changed Themes behavior, added functionality'},
					{tag: 'br'},
					{style: "text-align: left;", allowHtml: true, content: '//////////////////////////<br/>//					// 12.21.12<br/>//					// version 0.5.1<br/>//app catalog update #1<br/>//app catalog BUMP to top<br/>//<br/>//CHANGES:<br/>//- Added setting for hiding of minimize graphics<br/>//- Fixed button tap issues<br/>//- Fixed icon not displaying issues (icons not yet decided now appear with \'bug\' icon)<br/>//- Minor optimization<br/>//<br/>'},
					{tag: 'br'},
					{style: "text-align: left;", allowHtml: true, content: '//////////////////////////<br/>//						//<br/>//						// version 0.5.0<br/>// OFFICIAL APP CATALOG RELEASE<br/>//<br/>//'},
					{tag: 'br'},
				]}
			]},
		
		{kind: 'Neo.Toolbar', middle: [
			{name: 'bottomButton', kind: 'Neo.Button', text: 'License', ontap: 'toggle', icon: 'overflow'},
		]}
	],
	create: function(){
		this.inherited(arguments);
		//this.$.cover.hide();
		var x = document.getElementById('licenseContent');
		this.$.licence.setContent(x.innerHTML);
	},
	reset: function() {
		this.$.panels.setIndex(0);
		this.render();
		this.reflow();
		
		//var c = this.$.cover;
		//c.show();
		//c.applyStyle('z-index', null);
	},
	toggle: function(s, e) {
		var _ci = this.$.panels.index;
		var _i = _ci == 1 ? 2 : _ci == 2 ? 0 : 1;
		this.$.panels.setIndex(_i);
		switch (_i) {
			case 0:
				this.$.bottomButton.setText('More');
				this.$.bottomButton.setIcon('overflow');
				break;
			case 1:
				this.$.bottomButton.setText('Even More');
				this.$.bottomButton.setIcon('tag');
				break;
			case 2:
				this.$.bottomButton.setText('Less');
				this.$.bottomButton.setIcon('io');
				break;
		}
	},
	exit: function(s, e) {
		this.doClose();
		//this.$.cover.hide();
	}
});
