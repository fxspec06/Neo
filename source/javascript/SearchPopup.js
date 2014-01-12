enyo.kind({
	name: 'Neo.SearchPopup',
	kind: 'FittableRows',
	
	style: 'text-align: center;',
	
	events: {
		onClose: ''
	},
	
	published: {
		active: 'topics'
	},
	
	components: [
		{kind: 'Neo.Toolbar', header: 'Search', closeable: true},
		{components: [
			{tag: 'hr'},
			{name: 'radioGroup', kind: 'onyx.RadioGroup', layoutKind: 'FittableColumnsLayout', 
				fit: true, style:'margin:15px; text-align: center;', onActivate: 'radioActivate', components: [
					{name: 'topics', kind: 'Neo.Button', text: 'Topics', active: true},
					{name: 'users', kind: 'Neo.Button', text: 'Users', blue: false}
			]},
			{kind: 'onyx.InputDecorator', components: [
				{name:'searchTextBox', kind: 'Neo.RichText', onkeydown: 'searchBoxKeydown'},
			]},
			{tag: 'hr'},
		]},
		{kind: 'Neo.Toolbar',
			left: [
				{kind: 'onyx.PickerDecorator', components: [
					{kind: 'onyx.PickerButton', classes: 'neo-button'},
					{name: 'accountSelection', kind: 'Neo.PopupList', onSelect: 'accountChange'}
				]},
			],
			right: [{name: 'searchButton', kind: 'Neo.Button', ontap: 'search', text: 'Search', icon: 'search'}]
		}
	],
	
	//@* override
	create: function() {
		this.inherited(arguments);
		if (this.info && this.info.queryKind) this.qkind = this.info.queryKind;
	},
	
	
	//@* events
	
	//@* private
	//@* on search box key
	searchBoxKeydown: function(s, e) {
		//@* enter key
		if (e.keyCode === 13) {
			this.search();
			e.preventDefault();
		}
	},
	
	//@* private
	//@* radio button activate
	radioActivate: function(s, e) {
		this.log(s,e, e.originator.active)
		var _r = e.originator || {};
		if (e.originator.active != true) return;
		
		this.log(_r.id);
		
		if (_r.id.search('users') > -1) this.qkind = 'users';
			else this.qkind = 'topics';
		
		
		
		switch (this.qkind) {
			case 'users':
				this.$.searchTextBox.setPlaceholder('Enter username...');
				break;
			case 'topics': default:
				this.$.searchTextBox.setPlaceholder('Enter query...')
				break;
		}
	},
	
	//@* public
	//@* calls the search
	search: function() {
		var _stb = this.$.searchTextBox,
			_as = this.$.accountSelection;
		this.log(this.qkind);
		switch (this.qkind) {
			case 'users':
				var _a = _as.selected.value,
					_u = _stb.getValue().replace('@', '');
				AppUI.search(_u, _a, 'users');
				//AppUI.viewUser(_u, _a.type, _a.id);
				this.close();
				break;
			case 'topics':
			default:
				AppUI.search(_stb.getValue(), _as.selected.value, 'topics');
				this.close();
				break;
		}
	},
	
	
	buildAccounts: function() {
		var allusers = App.Users.getAll();
		this.accounts = [];
		for (var key in allusers) {
			this.accounts.push({
				id: allusers[key].id,
				value: allusers[key].id,
				content: allusers[key].username,
				type: allusers[key].type,
				active: (allusers[key].id === App.Prefs.get('currentUser'))
			});
		}
		this.$.accountSelection.createComponents(this.accounts, {owner: this} );
		this.$.accountSelection.render();
	},
	
	
	
	
	//@* private
	//@* resets the search popup
	reset: function() {
		this.active = 'topics';
		this.$.searchTextBox.setValue('');
		this.$.searchTextBox.focus();
		this.buildAccounts();
	},
	
	//@* private
	//@* closes the search box
	close: function() {
		if (this.$.searchTextBox) this.$.searchTextBox.blur();
		this.doClose();
	},
});
