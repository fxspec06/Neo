enyo.kind({
	name: "Neo.ColorBuilder",
	
	kind: 'FittableRows',
	
	style: 'width: 200px; margin: auto; border: 2px solid white; background-color: black;',
	
	published: {
		color: '',
		colors: [],
		title: '',
		highlight: '',
		type: ''
	},
	
	components: [
		{content: 'Red', classes: 'onyx-groupbox-header'},
		{name: 'builderRedSlider', onChange: 'sliding', onChanging: 'sliding', kind: 'onyx.Slider', min:0,max:255},
		{content: 'Green', classes: 'onyx-groupbox-header'},
		{name: 'builderGreenSlider', onChange: 'sliding', onChanging: 'sliding', kind: 'onyx.Slider', min:0,max:255},
		{content: 'Blue', classes: 'onyx-groupbox-header'},
		{name: 'builderBlueSlider', onChange: 'sliding', onChanging: 'sliding', kind: 'onyx.Slider', min:0,max:255},
		{content: 'Opacity', classes: 'onyx-groupbox-header'},
		{name: 'builderOpacitySlider', onChange: 'sliding', onChanging: 'sliding', kind: 'onyx.Slider', min:0,max:1},
		{kind: 'onyx.PickerDecorator', components: [
			{kind: 'onyx.PickerButton'},
			{name: 'builderColorPicker', kind: 'Neo.PopupList', onSelect: 'pickColor', style: 'min-width: 250px;'}
		]}
	],
	
	create: function() {
		this.inherited(arguments);
		
		// init
	},
	
	//@* event
	//@* color slider moving
	sliding: function(s, e) {
		var mixin = {},
			
			_i = e.index,
			property = s.parent.name,
			//_preset = this.owner.$.builder.children[_i],
			_p = this.getTitle().substr(this.getType().length + 1),
			_hi = this.getHighlight();
		
		if (_hi == true) {
			_p = _p.substr(_hi + 9);
		}
		
		mixin[_p] = 'rgba(' + 
			Math.round(this.$.builderRedSlider.getValue()) + ',' +
			Math.round(this.$.builderGreenSlider.getValue()) + ',' +
			Math.round(this.$.builderBlueSlider.getValue()) + ',' + 
			this.$.builderOpacitySlider.getValue() + ')';
		
		this.send(mixin, _hi);
	},
	//@* event
	//@* color popup list select
	//@* fetches the RGB value from the color that was selected
	pickColor: function(s, e) {
		var mixin = {},
			_v = s.selected.content,
			_i = e.index,
			property = s.parent.name,
			//_preset = this.owner.$.builder.children[_i],
			_p = this.getTitle().substr(this.getType().length + 1);
			//_hi = this.getHighlight();
		
		if (_hi == true) {
			_p = _p.substr(_hi + 9);
		}
		switch (_v) {
			case 'custom': break;
			case 'transparent': break;
			default:
				var RGB = getRGBA(_v, 1),
					_cs = RGB.match(/\d+/g);
				if (_cs == null) _cs = [0,0,0,0];
				this.$.builderRedSlider.setValue(_cs[0]);
				this.$.builderGreenSlider.setValue(_cs[1]);
				this.$.builderBlueSlider.setValue(_cs[2]);
				this.$.builderOpacitySlider.setValue(_cs[3]);
				mixin[_p] = RGB;
				this.send(mixin, _hi);
				break;
		}
	},
	send: function(message, highlight) {
		var objStr = '{'+((highlight)?'\"highlight\":':'\"styles\":')+JSON.stringify(message)+'}';
		var params = JSON.parse(objStr);
		this.bubbleUp('onUpdate', {customizer: params});
	},
	
	//@* handlers
	//@* called when tapping on the color square
	handleTapped: function(s, e) {
		if (this.notap) return true;
		this.openPicker();
	},
	
	//@* automatically called
	//@* sets the color
	colorChanged: function(oldColor) {
		var _val = this.getColor() || '';
		
		var _cs = _val.match(/\d+/g),
			_cmps = [];
		if (_cs == null) {
			_cs = getRGBA(_val).match(/\d+/g);
			if (_cs == null) _cs = [0,0,0,1];
		}
		this.$.builderRedSlider.setValue(_cs[0]);
		this.$.builderGreenSlider.setValue(_cs[1]);
		this.$.builderBlueSlider.setValue(_cs[2]);
		if (_cs[4]) this.$.builderOpacitySlider.setValue('0.'+_cs[4]);
			else this.$.builderOpacitySlider.setValue(_cs[3] || 1);
		
		
		
	},
	colorsChanged: function(oldColors) {
		var _cmps = [];
		this.$.builderColorPicker.destroyClientControls();
		for (var _c in this.getColors()) {_cmps.push({content: this.getColors()[_c], style: 'background-color: ' + this.getColors()[_c] + ' !important;', active: parseInt(_c) == 0})}
		this.$.builderColorPicker.createComponents(_cmps);
		
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