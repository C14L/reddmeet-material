if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/app/sw.js', { scope: '/app/' }).then(reg => {

    });
}


//////////////////////////////////////////////////////////////////////////////
//
//   helper functions
//
//////////////////////////////////////////////////////////////////////////////

function set_cookie(name, value, days) {
	if (days) {
		var date = new Date();
		date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
		var expires = "; expires=" + date.toGMTString();
	}
	else var expires = "";
	// Replace any ";" in value with something else
	value = ('' + value).replace(/;/g, ',');
	document.cookie = urlencode(name) + "=" + urlencode(value) + expires + "; path=/";
}

function get_cookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for (var i = 0; i < ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == ' ') c = c.substring(1, c.length);
		if (c.indexOf(nameEQ) == 0)
			return urldecode(c.substring(nameEQ.length, c.length));
	}
	return null;
}

function delete_cookie(name) {
	setCookie(name, "", -1);
}

function urlencode(str) {
	return encodeURIComponent(str);
}

function urldecode(str) {
	return decodeURIComponent((str + '').replace(/\+/g, '%20'));
}

// - - - localStorage helpers - - - - - - - - - - - - - - - - - - 

function getLocalStorageString(itemKey, defaultValue) {
	// Add a "defaultValue" to localStorage.getItem()
    var val = localStorage.getItem(itemKey);

    if (val === null && defaultValue !== undefined) {
        return defaultValue;
    }
    return val;
}

function setLocalStorageString(key, val) {
	// Just for function naming consistency
  	return localStorage.setItem(key, val);
}

function getLocalStorageObject(key, defaultValue) {
	// Gets a string from localStorage, parses it as JSON, and returns the 
	// resulting object. If the sting is not JSON, throws an error. If the 
	// key does not exist in localStorage, returns null.
	var val = getLocalStorageString(key, defaultValue);
	return (val) ? JSON.parse(val) : {};
}

function setLocalStorageObject(key, val) {
	// Gets a key name and a JSON object. Saves the object to localStorage after
	// converting it to a JSON string.
	return setLocalStorageString(key, JSON.stringify(val));
}
