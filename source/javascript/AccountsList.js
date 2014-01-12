enyo.kind({
	name: 'Neo.AccountsList',
	events: {
		onAccountClick: '',
	},
	components: [
		{kind: 'List', classes: 'enyo-fit list', onSetupItem: 'setupRow', components: [
			{kind: 'onyx.Item', tapHighlight: true, classes: 'tweet', layoutKind: 'FittableColumnsLayout', ontap: 'accountClick', components: [
				{name: 'icon', kind: 'Neo.Icon', icon: 'twitter'},
				{name: 'label', content: '', style: 'font-size: 18px; padding-top: 0px; padding-right: 5px'},
				{name:'hr', tag:'hr'}
			]}
		]}
	],
	accounts: [],
	create: function() {
		this.inherited(arguments);
		this.buildAccounts();
	},
	buildAccounts: function() {
		var allusers = App.Users.getAll();
		this.accounts = [];
		for (var key in allusers) {
			this.accounts.push({
				id:allusers[key].id,
				content: '@' + allusers[key].username,
				type:allusers[key].type
			});
		}
		this.$.list.setCount(this.accounts.length);
		this.$.list.refresh();
	},
	setupRow: function(s, e) {
		var _i = e.index,
			item = this.accounts[_i]
		this.$.label.setContent(item.content);
		this.$.hr.show();
		if (_i == this.accounts.length - 1) this.$.hr.hide();
	},
	accountClick: function(s, e) {
		this.bubble('onAccountClick', e);
	}
});
