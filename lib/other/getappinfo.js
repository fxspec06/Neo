if (typeof($)!="undefined") $.getJSON("appinfo.json", function(d) {console.log(appinfo=d)});
enyo.fetchAppInfo = function() {
	return {title: '', version: ''}
}
