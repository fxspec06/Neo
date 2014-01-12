enyo.kind({
	name: 'Neo.setting',
	classes: 'neo-container neo-settings',
	published: {
		items:[],
		type:'list',//['list','radio','button']
		section:'section',
		title:'setting title',
		description:'longer description',
		
		// for special kinds
		mixin: {} // ie buttons, mixin would have text, icon, and ontap set
	},
	list: [
		{name:'section', classes: 'neo-settings-header'},
			{classes:'onyx-toolbar-inline neo-settings-setting', components: [
				{tag: 'table', attributes: {width: '100%'}, components: [
					{tag: 'tr', components: [
						{tag: 'td', attributes: {width: '60%'}, components: [
							{name:'title'},
							{tag: 'br'},
							{name:'description', kind:'Neo.Subtext'}
						]},
						{tag: 'td', attributes: {width: '10%'}, components: [
							{kind: 'onyx.PickerDecorator', style: 'float: right;', components: [
								{kind: 'onyx.PickerButton'},
								{name: 'popupList', kind: 'Neo.PopupList', onChange: 'setPreference', preferenceProperty: 'tweet-text-size'}
							]}
						]}
					]}
				]}
		]}
	],
	button: [
		{name:'section', classes: 'neo-settings-header'},
		{classes:'onyx-toolbar-inline neo-settings-setting', components: [
			{tag: 'table', attributes: {width: '100%'}, components: [
					{tag: 'tr', components: [
						{tag: 'td', attributes: {width: '100%'}, components: [
							{name:'title'},
							{tag: 'br'},
							{name:'description', kind:'Neo.Subtext'}
						]},
						{tag: 'td', attributes: {width: '10%'}, components: [
							{name: 'button', kind: 'Neo.Button', ontap: 'action', bubble: '', collapse: false, style: 'float:right;', classes: 'onyx-negative', blue: false}
						]}
					]}
				]}
			
		]}
	],
	create: function(){
		this.inherited(arguments);
		this.typeChanged();
		this.itemsChanged();
		this.sectionChanged();
		this.titleChanged();
		this.descriptionChanged();
	},
	typeChanged: function(oldValue){
		this.destroyClientControls();
		var controls = this[this.type];
		enyo.mixin(controls[1].components[0].components[0].components[1].components[0], this.mixin);
		this.createComponents(controls, {owner: this});
		this.render();
	},
	descriptionChanged: function(oldValue){
		this.$.description.setContent(this.description);
		this.$.description.setShowing(this.description != 'longer description');
	},
	titleChanged: function(oldValue){
		this.$.title.setContent(this.title);
	},
	sectionChanged: function(oldValue){
		this.$.section.setContent(this.section);
	},
	itemsChanged: function(oldValue){
		if (!this.$.popupList) return;
		this.$.popupList.destroyClientControls();
		var items = []
		enyo.forEach(this.items, function(item){
			items.push({content:item.content,value:item.value,preferenceProperty:item.preferenceProperty});
		})
		this.$.popupList.createComponents(items, {owner:this});
	},
	requestHide: function(){
		this.$.popupList.requestHide();
		this.inherited(arguments);
	},
	//@* private event
	//@* called on button tap
	//@* FIXME workaround for tap not registering on setting create
	action: function(s, e) {
		this.bubbleUp(s.bubble, {inSender: s});
	}
})