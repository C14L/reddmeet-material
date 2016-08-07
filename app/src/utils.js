if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/app/sw.js', { scope: '/app/' }).then(reg => {

    });
}

// - - - cookie helpers - - - - - - - - - - - - - - - - - - 

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
	var val = getLocalStorageString(key, null);
	return (val) ? JSON.parse(val) : defaultValue;
}

function setLocalStorageObject(key, val) {
	// Gets a key name and a JSON object. Saves the object to localStorage after
	// converting it to a JSON string.
	return setLocalStorageString(key, JSON.stringify(val));
}

// - - - calculate distances - - - - - - - - - - - - - - - - - - 

function get_distance(lat1, lon1, lat2, lon2, unit='km') {
	var R = 6371; // Radius of the earth in km
	var dLat = (lat2-lat1).toRad();  // Javascript functions in radians
	var dLon = (lon2-lon1).toRad(); 
	var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
			Math.cos(lat1.toRad()) * Math.cos(lat2.toRad()) * 
			Math.sin(dLon/2) * Math.sin(dLon/2); 
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
	var d = R * c; // Distance in km

	if (unit == 'km')
		return d;
	if (unit == 'm')
		return d * 1000;
	if (unit == 'mi')
		return d * 0.621371;
	if (unit == 'ft')
		return d * 0.0003048;

	throw new Error('Unknown unit in get_distance() "' + unit + '".');
}

/** Convert numeric degrees to radians */
if (typeof(Number.prototype.toRad) === "undefined") {
	Number.prototype.toRad = function() {
		return this * Math.PI / 180;
	}
}

// - - - fuzzied geolocation - - - - - - - - - - - - - - - - - - 

function getRandom(min, max) {
	// Return a random Float between min and max.
	return Math.random() * (max - min) + min;
}
function getRandInt(min, max) {
	// Return a random Integer from min to max.
	return Math.floor(Math.random() * (max - min) + min);
}

function fuzzyGeoloc(lat, lng, fuzzyKm) {
	// Check if valid
	if (!lat || !lng) throw "No valid geolocation coords found.";
	// Fuzzy it by +/- x km, but we need that in degrees lat/lng.
	var latOneDegInKm = 110.574; // km
	var lngOneDegInKm = 111.320 * Math.cos(lat); // km
	// Get the degrees for 5 km.
	var latFuzzyDeg = fuzzyKm / latOneDegInKm;
	var lngFuzzyDeg = fuzzyKm / lngOneDegInKm;
	// Get a random number, (+ or -) for the degrees and add
	// it to the geolocation.
	var latRandomDeg = getRandom((latFuzzyDeg*(-1)), latFuzzyDeg);
	var lngRandomDeg = getRandom((lngFuzzyDeg*(-1)), lngFuzzyDeg);
	// Return the exacy lat/lng +/- the random degrees.
	return {'lat':(lat + latRandomDeg), 'lng':(lng + lngRandomDeg)};
}

function await_fuzzy_geoloc(fuzzy) {
	// Find user's geolocation, fuzzy it, and submit to profile.
	// See http://diveintohtml5.info/geolocation.html
	// fuzzy (km)
	return new Promise(function(resolve, reject) {
		if (!"geolocation" in navigator) {
			reject(new Error("Your browser doesn't support geo location lookup."));
		} else {
			try {
				// The callback gets a geolocation object and the time. Use only
				// "loc.coords.latitude" and "loc.coords.longitude", but fuzzy it!
				navigator.geolocation.getCurrentPosition((loc, timestamp) => {
					// Fuzzy the geolocation with some +/- 5 kilometers. See
					// http://stackoverflow.com/questions/1253499/simple-calculations-
					//                            for-working-with-lat-lon-km-distance
					// Approximation:
					// - Latitude: 1 deg = 110.574 km
					// - Longitude: 1 deg = 111.320 * cos(latitude) km
					// Get geoloction from browser object.
					let fuzzyCoords = fuzzyGeoloc(loc.coords.latitude, loc.coords.longitude, fuzzy);
					resolve(fuzzyCoords);
				});
			} catch(err) {
				reject(new Error("Sorry, could not find your geolocation: " + err));
			}
		}
	});
}
