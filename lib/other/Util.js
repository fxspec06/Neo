var Util = new Object();
/**********************
 * Useful for any app *
 **********************/
Util.getGeometry = function( component ) {
	var element = component.hasNode();
	var coord = {left: 0, top: 0, width: element.offsetWidth, height: element.offsetHeight};
	do {	
		coord.left += element.offsetLeft;
		coord.top  += element.offsetTop;
	} while ( element = element.offsetParent );
	return coord;
};

Util.isEmpty = function(string) {
    if (string == null || string == undefined || string.length == 0 || Util.trim(string).length == 0) {
        return true;
    }
    return false;
};

Util.trim = function(str) {
    return str.replace(/^\s+|\s+$/g, '');
};

Util.isValidZip = function(string) {
    return true;
};

Util.appendToHash = function(hash, originalHash) {
    return originalHash.merge($H(hash)).toObject();
};


Util.arrayToString = function(array) {
    var str = "";
    for (var i = 0; i < array.length; ++i) {
        str += array[i] + "<br/><br/>";
    }
    return str;
};

Util.truncateText = function(text, limit) {
    var elipse = "...";
    var limitWithElipise = limit - elipse.length;
    if (text.length > limit) {
        return text.substr(0, limitWithElipise) + elipse;
    } else {
        return text;
    }
};

Util.floor = function(number, target) {
    var mod = -1;
    while (mod != 0) {
        // Util.log("LOOP: Util.floor() number: " + number + " target: " + target);
        mod = number % target;
        if (mod == 0) {
            break;
        } else {
            number--;
        }
    }
    return number;
};


Util.showError = function(messageArray) {
    var message = Util.arrayToString(messageArray);
    var title = null;
    if (messageArray.length > 1) {
        title = AppConstants.MSG_ERROR_TITLE_PLURAL;
    }
	else {
        title = AppConstants.MSG_ERROR_TITLE_SINGULAR;
    }
	var image = "warning";
	Application.$.notif.sendNotification({
			title:title,
			message:message,
			src: "assets/images/"+image+".png",
			theme: "notification.Bezel",
			stay: true,
			duration: null
			}//, enyo.bind(this, "callback")			
	); 
	onyx.scrim.show();
	// Application.errCallback = function() { this.$.errorDlg.close(); };
	// Application.showError( dlg );
};

Util.showMessage = function(title, message, icon) {
	var image = (!icon ? "warning" : icon);
	Application.$.notif.sendNotification({
				title:title,
				message:message,
				src: "assets/images/"+image+".png",
				theme: "notification.Bezel",
				stay: true,
				duration: null
				}//, enyo.bind(this, "callback")			
				);
		onyx.scrim.show();
	// Application.errCallback = function() { this.$.errorDlg.close(); };
	// Application.showError( dlg );
};

Util.showMessageWithCallback = function(title, message, icon, callback) {
	var image = (!icon ? "warning" : icon);
	Application.$.notif.sendNotification({
				title:title,
				message:message,
				src: "assets/images/"+image+".png",
				theme: "notification.Bezel",
				stay: true,
				duration: null
				}//, enyo.bind(this, "callback")			
				);
		onyx.scrim.show();
	// Application.errCallback = function() { this.$.errorDlg.close(); callback(); }.curry(callback);
	// Application.showError( dlg );
};

Util.showRetryMessage = function(title, message, icon, callback) {
	var image = (!icon ? "connectionlost" : icon);
	Application.$.notif.sendNotification({
				title:title,
				message:message,
				src: "assets/images/"+image+".png",
				theme: "notification.Bezel",
				stay: true,
				duration: null
				}//, enyo.bind(this, "callback")			
				);
		onyx.scrim.show();
//	Application.errCallback = function() { this.$.errorDlg.close(); callback(); }.curry(callback);
//	Application.showError( dlg );
	// if ( Application.dashboardShowing() ) {
		// Util.showBannerMessage(message);
	// }
	

};

Util.httpGet = function(url) {
    var request = new Ajax.Request(url, {
        method: 'get',
        onSuccess: Util.onSuccess
    });
};

Util.onSuccess = function(response) {
    Util.log("http get complete: " + response.status);
};

Util.showBannerMessage = function(inMessage) {
   	Application.$.notif.sendNotification({
				title:"",
				message:inMessage,
				src: "",
				theme: "notification.MessageBar",
				stay: undefined,
				duration: 2.3
				}//, enyo.bind(this, "callback")			
				);
};

Util.showBannerSong = function(inMessage, inIcon) {
	var icon = (inIcon ? inIcon : "");
   	Application.$.notif.sendNotification({
				title:"Now Playing: ",
				message:inMessage,
				src: icon,
				theme: "notification.MessageBar",
				stay: undefined,
				duration: 2.3
				}//, enyo.bind(this, "callback")			
				);
};


Util.inspectObject = function(object) {
    for (name in object) {
        Util.log(name);
    }
};

Util.trimNonAscii = function(utftext) {
    var s = "";
    var c = 0;

    Util.log("length: " + utftext.length);

    for (var i = 0; i < utftext.length; ++i) {

        c = utftext.charCodeAt(i);
        if (c < 8000) {
            s += String.fromCharCode(c);
        } else {
            Util.log("over: " + c);
        }
    }

    Util.log("length: " + s.length);
    return s;
};

Util.log = function(message) {
    if (AppGlobals.debug) {
        enyo.log(Util.PREFIX + message);
    }
};

Util.secondsToTimeString = function(secs) {
    var s = Math.round(secs);
    var minVar = Math.floor(s / 60);
    var secVar = s % 60;
    if (secVar < 10) {
        secVar = "0" + secVar;
    }
    return minVar + ":" + secVar;
};

Util.sendHeadRequest = function(url, callback) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("HEAD", url, true);
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4) {
            Util.log("HEAD returned: " + xmlhttp.status);
            var contentLength = xmlhttp.getResponseHeader(Util.CONTENT_LENGTH);
            callback(xmlhttp.status, contentLength, url);
        }
    }
    xmlhttp.send(null);
};

Util.PREFIX = "PANDORA> ";
Util.CONTENT_LENGTH = "Content-Length";
Util.HEAD = "HEAD";
