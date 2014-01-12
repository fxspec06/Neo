/*jslint
browser: true,
nomen: false,
debug: true,
forin: true,
undef: true,
white: false,
onevar: false
 */

/**
 * opts = {
 *  content_type:'', // optional
 *  field_name:'', //optional, default to 'media;
 *  file_url:'',
 *  url:'', // REQ
 *  platform: {
 * 		sceneAssistant:{} // REQ; the sceneAssistant we're firing the service req from
 *  }
 * 	extra:{...} // extra post fields (text/plain only atm)
 * }
 * @param Function onSuccess
 */
sc.helpers.HTTPUploadFile = function(opts, onSuccess, onFailure) {

	opts = sch.defaults({
        method: 'POST',
        content_type: 'img',
        field_name: 'media',
        file_url: null,
        url: null,
        extra: null,
        headers: null,
        username:null,
        password: null,
		onProgress: null
    }, opts);
    

	var postparams = [],
		customHttpHeaders = [],
		file_url = opts.file_url || null,
		url = opts.url || null;
		field_name = opts.field_name || 'media',
		content_type = opts.content_type || 'img';

	for (var key in opts.extra) postparams.push({key: key, data: opts.extra[key], contentType: 'text/plain'});
	
	if (opts.username) postparams.push({key:'username', data: opts.username, contentType: 'text/plain'});
	
	if (opts.password) postparams.push({key:'password', data: opts.password, contentType: 'text/plain'});
	
	for(var key in opts.headers) customHttpHeaders.push(key + ': ' + opts.headers[key]);
	
	
	opts.callback({
		url: url,
		contentType: content_type,
		fileLabel: field_name,
		fileName: file_url,
		postParameters: postparams,
		cookies: {},
		customHttpHeaders: customHttpHeaders
	});
	
};
