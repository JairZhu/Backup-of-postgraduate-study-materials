/*!
 * jQuery JavaScript Library v1.7.1
 * http://jquery.com/
 *
 * Copyright 2011, John Resig
 * Released under the the MIT License.
 * http://jquery.org/license
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 * Copyright 2011, The Dojo Foundation
 * Released under the MIT and BSD Licenses.
 *
 * Date: Mon Nov 21 21:11:03 2011 -0500
 */
(function( window, undefined ) {

// Use the correct document accordingly with window argument (sandbox)
var document = window.document,
	navigator = window.navigator,
	location = window.location;
var jQuery = (function() {

// Define a local copy of jQuery
var jQuery = function( selector, context ) {
		// The jQuery object is actually just the init constructor 'enhanced'
		return new jQuery.fn.init( selector, context, rootjQuery );
	},

	// Map over jQuery in case of overwrite
	_jQuery = window.jQuery,

	// Map over the $ in case of overwrite
	_$ = window.$,

	// A central reference to the root jQuery(document)
	rootjQuery,

	// A simple way to check for HTML strings or ID strings
	// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
	quickExpr = /^(?:[^#<]*(<[\w\W]+>)[^>]*$|#([\w\-]*)$)/,

	// Check if a string has a non-whitespace character in it
	rnotwhite = /\S/,

	// Used for trimming whitespace
	trimLeft = /^\s+/,
	trimRight = /\s+$/,

	// Match a standalone tag
	rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>)?$/,

	// JSON RegExp
	rvalidchars = /^[\],:{}\s]*$/,
	rvalidescape = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,
	rvalidtokens = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
	rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g,

	// Useragent RegExp
	rwebkit = /(webkit)[ \/]([\w.]+)/,
	ropera = /(opera)(?:.*version)?[ \/]([\w.]+)/,
	rmsie = /(msie) ([\w.]+)/,
	rmozilla = /(mozilla)(?:.*? rv:([\w.]+))?/,

	// Matches dashed string for camelizing
	rdashAlpha = /-([a-z]|[0-9])/ig,
	rmsPrefix = /^-ms-/,

	// Used by jQuery.camelCase as callback to replace()
	fcamelCase = function( all, letter ) {
		return ( letter + "" ).toUpperCase();
	},

	// Keep a UserAgent string for use with jQuery.browser
	userAgent = navigator.userAgent,

	// For matching the engine and version of the browser
	browserMatch,

	// The deferred used on DOM ready
	readyList,

	// The ready event handler
	DOMContentLoaded,

	// Save a reference to some core methods
	toString = Object.prototype.toString,
	hasOwn = Object.prototype.hasOwnProperty,
	push = Array.prototype.push,
	slice = Array.prototype.slice,
	trim = String.prototype.trim,
	indexOf = Array.prototype.indexOf,

	// [[Class]] -> type pairs
	class2type = {};

jQuery.fn = jQuery.prototype = {
	constructor: jQuery,
	init: function( selector, context, rootjQuery ) {
		var match, elem, ret, doc;

		// Handle $(""), $(null), or $(undefined)
		if ( !selector ) {
			return this;
		}

		// Handle $(DOMElement)
		if ( selector.nodeType ) {
			this.context = this[0] = selector;
			this.length = 1;
			return this;
		}

		// The body element only exists once, optimize finding it
		if ( selector === "body" && !context && document.body ) {
			this.context = document;
			this[0] = document.body;
			this.selector = selector;
			this.length = 1;
			return this;
		}

		// Handle HTML strings
		if ( typeof selector === "string" ) {
			// Are we dealing with HTML string or an ID?
			if ( selector.charAt(0) === "<" && selector.charAt( selector.length - 1 ) === ">" && selector.length >= 3 ) {
				// Assume that strings that start and end with <> are HTML and skip the regex check
				match = [ null, selector, null ];

			} else {
				match = quickExpr.exec( selector );
			}

			// Verify a match, and that no context was specified for #id
			if ( match && (match[1] || !context) ) {

				// HANDLE: $(html) -> $(array)
				if ( match[1] ) {
					context = context instanceof jQuery ? context[0] : context;
					doc = ( context ? context.ownerDocument || context : document );

					// If a single string is passed in and it's a single tag
					// just do a createElement and skip the rest
					ret = rsingleTag.exec( selector );

					if ( ret ) {
						if ( jQuery.isPlainObject( context ) ) {
							selector = [ document.createElement( ret[1] ) ];
							jQuery.fn.attr.call( selector, context, true );

						} else {
							selector = [ doc.createElement( ret[1] ) ];
						}

					} else {
						ret = jQuery.buildFragment( [ match[1] ], [ doc ] );
						selector = ( ret.cacheable ? jQuery.clone(ret.fragment) : ret.fragment ).childNodes;
					}

					return jQuery.merge( this, selector );

				// HANDLE: $("#id")
				} else {
					elem = document.getElementById( match[2] );

					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					if ( elem && elem.parentNode ) {
						// Handle the case where IE and Opera return items
						// by name instead of ID
						if ( elem.id !== match[2] ) {
							return rootjQuery.find( selector );
						}

						// Otherwise, we inject the element directly into the jQuery object
						this.length = 1;
						this[0] = elem;
					}

					this.context = document;
					this.selector = selector;
					return this;
				}

			// HANDLE: $(expr, $(...))
			} else if ( !context || context.jquery ) {
				return ( context || rootjQuery ).find( selector );

			// HANDLE: $(expr, context)
			// (which is just equivalent to: $(context).find(expr)
			} else {
				return this.constructor( context ).find( selector );
			}

		// HANDLE: $(function)
		// Shortcut for document ready
		} else if ( jQuery.isFunction( selector ) ) {
			return rootjQuery.ready( selector );
		}

		if ( selector.selector !== undefined ) {
			this.selector = selector.selector;
			this.context = selector.context;
		}

		return jQuery.makeArray( selector, this );
	},

	// Start with an empty selector
	selector: "",

	// The current version of jQuery being used
	jquery: "1.7.1",

	// The default length of a jQuery object is 0
	length: 0,

	// The number of elements contained in the matched element set
	size: function() {
		return this.length;
	},

	toArray: function() {
		return slice.call( this, 0 );
	},

	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	get: function( num ) {
		return num == null ?

			// Return a 'clean' array
			this.toArray() :

			// Return just the object
			( num < 0 ? this[ this.length + num ] : this[ num ] );
	},

	// Take an array of elements and push it onto the stack
	// (returning the new matched element set)
	pushStack: function( elems, name, selector ) {
		// Build a new jQuery matched element set
		var ret = this.constructor();

		if ( jQuery.isArray( elems ) ) {
			push.apply( ret, elems );

		} else {
			jQuery.merge( ret, elems );
		}

		// Add the old object onto the stack (as a reference)
		ret.prevObject = this;

		ret.context = this.context;

		if ( name === "find" ) {
			ret.selector = this.selector + ( this.selector ? " " : "" ) + selector;
		} else if ( name ) {
			ret.selector = this.selector + "." + name + "(" + selector + ")";
		}

		// Return the newly-formed element set
		return ret;
	},

	// Execute a callback for every element in the matched set.
	// (You can seed the arguments with an array of args, but this is
	// only used internally.)
	each: function( callback, args ) {
		return jQuery.each( this, callback, args );
	},

	ready: function( fn ) {
		// Attach the listeners
		jQuery.bindReady();

		// Add the callback
		readyList.add( fn );

		return this;
	},

	eq: function( i ) {
		i = +i;
		return i === -1 ?
			this.slice( i ) :
			this.slice( i, i + 1 );
	},

	first: function() {
		return this.eq( 0 );
	},

	last: function() {
		return this.eq( -1 );
	},

	slice: function() {
		return this.pushStack( slice.apply( this, arguments ),
			"slice", slice.call(arguments).join(",") );
	},

	map: function( callback ) {
		return this.pushStack( jQuery.map(this, function( elem, i ) {
			return callback.call( elem, i, elem );
		}));
	},

	end: function() {
		return this.prevObject || this.constructor(null);
	},

	// For internal use only.
	// Behaves like an Array's method, not like a jQuery method.
	push: push,
	sort: [].sort,
	splice: [].splice
};

// Give the init function the jQuery prototype for later instantiation
jQuery.fn.init.prototype = jQuery.fn;

jQuery.extend = jQuery.fn.extend = function() {
	var options, name, src, copy, copyIsArray, clone,
		target = arguments[0] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !jQuery.isFunction(target) ) {
		target = {};
	}

	// extend jQuery itself if only one argument is passed
	if ( length === i ) {
		target = this;
		--i;
	}

	for ( ; i < length; i++ ) {
		// Only deal with non-null/undefined values
		if ( (options = arguments[ i ]) != null ) {
			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)) ) ) {
					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && jQuery.isArray(src) ? src : [];

					} else {
						clone = src && jQuery.isPlainObject(src) ? src : {};
					}

					// Never move original objects, clone them
					target[ name ] = jQuery.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

jQuery.extend({
	noConflict: function( deep ) {
		if ( window.$ === jQuery ) {
			window.$ = _$;
		}

		if ( deep && window.jQuery === jQuery ) {
			window.jQuery = _jQuery;
		}

		return jQuery;
	},

	// Is the DOM ready to be used? Set to true once it occurs.
	isReady: false,

	// A counter to track how many items to wait for before
	// the ready event fires. See #6781
	readyWait: 1,

	// Hold (or release) the ready event
	holdReady: function( hold ) {
		if ( hold ) {
			jQuery.readyWait++;
		} else {
			jQuery.ready( true );
		}
	},

	// Handle when the DOM is ready
	ready: function( wait ) {
		// Either a released hold or an DOMready/load event and not yet ready
		if ( (wait === true && !--jQuery.readyWait) || (wait !== true && !jQuery.isReady) ) {
			// Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
			if ( !document.body ) {
				return setTimeout( jQuery.ready, 1 );
			}

			// Remember that the DOM is ready
			jQuery.isReady = true;

			// If a normal DOM Ready event fired, decrement, and wait if need be
			if ( wait !== true && --jQuery.readyWait > 0 ) {
				return;
			}

			// If there are functions bound, to execute
			readyList.fireWith( document, [ jQuery ] );

			// Trigger any bound ready events
			if ( jQuery.fn.trigger ) {
				jQuery( document ).trigger( "ready" ).off( "ready" );
			}
		}
	},

	bindReady: function() {
		if ( readyList ) {
			return;
		}

		readyList = jQuery.Callbacks( "once memory" );

		// Catch cases where $(document).ready() is called after the
		// browser event has already occurred.
		if ( document.readyState === "complete" ) {
			// Handle it asynchronously to allow scripts the opportunity to delay ready
			return setTimeout( jQuery.ready, 1 );
		}

		// Mozilla, Opera and webkit nightlies currently support this event
		if ( document.addEventListener ) {
			// Use the handy event callback
			document.addEventListener( "DOMContentLoaded", DOMContentLoaded, false );

			// A fallback to window.onload, that will always work
			window.addEventListener( "load", jQuery.ready, false );

		// If IE event model is used
		} else if ( document.attachEvent ) {
			// ensure firing before onload,
			// maybe late but safe also for iframes
			document.attachEvent( "onreadystatechange", DOMContentLoaded );

			// A fallback to window.onload, that will always work
			window.attachEvent( "onload", jQuery.ready );

			// If IE and not a frame
			// continually check to see if the document is ready
			var toplevel = false;

			try {
				toplevel = window.frameElement == null;
			} catch(e) {}

			if ( document.documentElement.doScroll && toplevel ) {
				doScrollCheck();
			}
		}
	},

	// See test/unit/core.js for details concerning isFunction.
	// Since version 1.3, DOM methods and functions like alert
	// aren't supported. They return false on IE (#2968).
	isFunction: function( obj ) {
		return jQuery.type(obj) === "function";
	},

	isArray: Array.isArray || function( obj ) {
		return jQuery.type(obj) === "array";
	},

	// A crude way of determining if an object is a window
	isWindow: function( obj ) {
		return obj && typeof obj === "object" && "setInterval" in obj;
	},

	isNumeric: function( obj ) {
		return !isNaN( parseFloat(obj) ) && isFinite( obj );
	},

	type: function( obj ) {
		return obj == null ?
			String( obj ) :
			class2type[ toString.call(obj) ] || "object";
	},

	isPlainObject: function( obj ) {
		// Must be an Object.
		// Because of IE, we also have to check the presence of the constructor property.
		// Make sure that DOM nodes and window objects don't pass through, as well
		if ( !obj || jQuery.type(obj) !== "object" || obj.nodeType || jQuery.isWindow( obj ) ) {
			return false;
		}

		try {
			// Not own constructor property must be Object
			if ( obj.constructor &&
				!hasOwn.call(obj, "constructor") &&
				!hasOwn.call(obj.constructor.prototype, "isPrototypeOf") ) {
				return false;
			}
		} catch ( e ) {
			// IE8,9 Will throw exceptions on certain host objects #9897
			return false;
		}

		// Own properties are enumerated firstly, so to speed up,
		// if last one is own, then all properties are own.

		var key;
		for ( key in obj ) {}

		return key === undefined || hasOwn.call( obj, key );
	},

	isEmptyObject: function( obj ) {
		for ( var name in obj ) {
			return false;
		}
		return true;
	},

	error: function( msg ) {
		throw new Error( msg );
	},

	parseJSON: function( data ) {
		if ( typeof data !== "string" || !data ) {
			return null;
		}

		// Make sure leading/trailing whitespace is removed (IE can't handle it)
		data = jQuery.trim( data );

		// Attempt to parse using the native JSON parser first
		if ( window.JSON && window.JSON.parse ) {
			return window.JSON.parse( data );
		}

		// Make sure the incoming data is actual JSON
		// Logic borrowed from http://json.org/json2.js
		if ( rvalidchars.test( data.replace( rvalidescape, "@" )
			.replace( rvalidtokens, "]" )
			.replace( rvalidbraces, "")) ) {

			return ( new Function( "return " + data ) )();

		}
		jQuery.error( "Invalid JSON: " + data );
	},

	// Cross-browser xml parsing
	parseXML: function( data ) {
		var xml, tmp;
		try {
			if ( window.DOMParser ) { // Standard
				tmp = new DOMParser();
				xml = tmp.parseFromString( data , "text/xml" );
			} else { // IE
				xml = new ActiveXObject( "Microsoft.XMLDOM" );
				xml.async = "false";
				xml.loadXML( data );
			}
		} catch( e ) {
			xml = undefined;
		}
		if ( !xml || !xml.documentElement || xml.getElementsByTagName( "parsererror" ).length ) {
			jQuery.error( "Invalid XML: " + data );
		}
		return xml;
	},

	noop: function() {},

	// Evaluates a script in a global context
	// Workarounds based on findings by Jim Driscoll
	// http://weblogs.java.net/blog/driscoll/archive/2009/09/08/eval-javascript-global-context
	globalEval: function( data ) {
		if ( data && rnotwhite.test( data ) ) {
			// We use execScript on Internet Explorer
			// We use an anonymous function so that context is window
			// rather than jQuery in Firefox
			( window.execScript || function( data ) {
				window[ "eval" ].call( window, data );
			} )( data );
		}
	},

	// Convert dashed to camelCase; used by the css and data modules
	// Microsoft forgot to hump their vendor prefix (#9572)
	camelCase: function( string ) {
		return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
	},

	nodeName: function( elem, name ) {
		return elem.nodeName && elem.nodeName.toUpperCase() === name.toUpperCase();
	},

	// args is for internal usage only
	each: function( object, callback, args ) {
		var name, i = 0,
			length = object.length,
			isObj = length === undefined || jQuery.isFunction( object );

		if ( args ) {
			if ( isObj ) {
				for ( name in object ) {
					if ( callback.apply( object[ name ], args ) === false ) {
						break;
					}
				}
			} else {
				for ( ; i < length; ) {
					if ( callback.apply( object[ i++ ], args ) === false ) {
						break;
					}
				}
			}

		// A special, fast, case for the most common use of each
		} else {
			if ( isObj ) {
				for ( name in object ) {
					if ( callback.call( object[ name ], name, object[ name ] ) === false ) {
						break;
					}
				}
			} else {
				for ( ; i < length; ) {
					if ( callback.call( object[ i ], i, object[ i++ ] ) === false ) {
						break;
					}
				}
			}
		}

		return object;
	},

	// Use native String.trim function wherever possible
	trim: trim ?
		function( text ) {
			return text == null ?
				"" :
				trim.call( text );
		} :

		// Otherwise use our own trimming functionality
		function( text ) {
			return text == null ?
				"" :
				text.toString().replace( trimLeft, "" ).replace( trimRight, "" );
		},

	// results is for internal usage only
	makeArray: function( array, results ) {
		var ret = results || [];

		if ( array != null ) {
			// The window, strings (and functions) also have 'length'
			// Tweaked logic slightly to handle Blackberry 4.7 RegExp issues #6930
			var type = jQuery.type( array );

			if ( array.length == null || type === "string" || type === "function" || type === "regexp" || jQuery.isWindow( array ) ) {
				push.call( ret, array );
			} else {
				jQuery.merge( ret, array );
			}
		}

		return ret;
	},

	inArray: function( elem, array, i ) {
		var len;

		if ( array ) {
			if ( indexOf ) {
				return indexOf.call( array, elem, i );
			}

			len = array.length;
			i = i ? i < 0 ? Math.max( 0, len + i ) : i : 0;

			for ( ; i < len; i++ ) {
				// Skip accessing in sparse arrays
				if ( i in array && array[ i ] === elem ) {
					return i;
				}
			}
		}

		return -1;
	},

	merge: function( first, second ) {
		var i = first.length,
			j = 0;

		if ( typeof second.length === "number" ) {
			for ( var l = second.length; j < l; j++ ) {
				first[ i++ ] = second[ j ];
			}

		} else {
			while ( second[j] !== undefined ) {
				first[ i++ ] = second[ j++ ];
			}
		}

		first.length = i;

		return first;
	},

	grep: function( elems, callback, inv ) {
		var ret = [], retVal;
		inv = !!inv;

		// Go through the array, only saving the items
		// that pass the validator function
		for ( var i = 0, length = elems.length; i < length; i++ ) {
			retVal = !!callback( elems[ i ], i );
			if ( inv !== retVal ) {
				ret.push( elems[ i ] );
			}
		}

		return ret;
	},

	// arg is for internal usage only
	map: function( elems, callback, arg ) {
		var value, key, ret = [],
			i = 0,
			length = elems.length,
			// jquery objects are treated as arrays
			isArray = elems instanceof jQuery || length !== undefined && typeof length === "number" && ( ( length > 0 && elems[ 0 ] && elems[ length -1 ] ) || length === 0 || jQuery.isArray( elems ) ) ;

		// Go through the array, translating each of the items to their
		if ( isArray ) {
			for ( ; i < length; i++ ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret[ ret.length ] = value;
				}
			}

		// Go through every key on the object,
		} else {
			for ( key in elems ) {
				value = callback( elems[ key ], key, arg );

				if ( value != null ) {
					ret[ ret.length ] = value;
				}
			}
		}

		// Flatten any nested arrays
		return ret.concat.apply( [], ret );
	},

	// A global GUID counter for objects
	guid: 1,

	// Bind a function to a context, optionally partially applying any
	// arguments.
	proxy: function( fn, context ) {
		if ( typeof context === "string" ) {
			var tmp = fn[ context ];
			context = fn;
			fn = tmp;
		}

		// Quick check to determine if target is callable, in the spec
		// this throws a TypeError, but we will just return undefined.
		if ( !jQuery.isFunction( fn ) ) {
			return undefined;
		}

		// Simulated bind
		var args = slice.call( arguments, 2 ),
			proxy = function() {
				return fn.apply( context, args.concat( slice.call( arguments ) ) );
			};

		// Set the guid of unique handler to the same of original handler, so it can be removed
		proxy.guid = fn.guid = fn.guid || proxy.guid || jQuery.guid++;

		return proxy;
	},

	// Mutifunctional method to get and set values to a collection
	// The value/s can optionally be executed if it's a function
	access: function( elems, key, value, exec, fn, pass ) {
		var length = elems.length;

		// Setting many attributes
		if ( typeof key === "object" ) {
			for ( var k in key ) {
				jQuery.access( elems, k, key[k], exec, fn, value );
			}
			return elems;
		}

		// Setting one attribute
		if ( value !== undefined ) {
			// Optionally, function values get executed if exec is true
			exec = !pass && exec && jQuery.isFunction(value);

			for ( var i = 0; i < length; i++ ) {
				fn( elems[i], key, exec ? value.call( elems[i], i, fn( elems[i], key ) ) : value, pass );
			}

			return elems;
		}

		// Getting an attribute
		return length ? fn( elems[0], key ) : undefined;
	},

	now: function() {
		return ( new Date() ).getTime();
	},

	// Use of jQuery.browser is frowned upon.
	// More details: http://docs.jquery.com/Utilities/jQuery.browser
	uaMatch: function( ua ) {
		ua = ua.toLowerCase();

		var match = rwebkit.exec( ua ) ||
			ropera.exec( ua ) ||
			rmsie.exec( ua ) ||
			ua.indexOf("compatible") < 0 && rmozilla.exec( ua ) ||
			[];

		return { browser: match[1] || "", version: match[2] || "0" };
	},

	sub: function() {
		function jQuerySub( selector, context ) {
			return new jQuerySub.fn.init( selector, context );
		}
		jQuery.extend( true, jQuerySub, this );
		jQuerySub.superclass = this;
		jQuerySub.fn = jQuerySub.prototype = this();
		jQuerySub.fn.constructor = jQuerySub;
		jQuerySub.sub = this.sub;
		jQuerySub.fn.init = function init( selector, context ) {
			if ( context && context instanceof jQuery && !(context instanceof jQuerySub) ) {
				context = jQuerySub( context );
			}

			return jQuery.fn.init.call( this, selector, context, rootjQuerySub );
		};
		jQuerySub.fn.init.prototype = jQuerySub.fn;
		var rootjQuerySub = jQuerySub(document);
		return jQuerySub;
	},

	browser: {}
});

// Populate the class2type map
jQuery.each("Boolean Number String Function Array Date RegExp Object".split(" "), function(i, name) {
	class2type[ "[object " + name + "]" ] = name.toLowerCase();
});

browserMatch = jQuery.uaMatch( userAgent );
if ( browserMatch.browser ) {
	jQuery.browser[ browserMatch.browser ] = true;
	jQuery.browser.version = browserMatch.version;
}

// Deprecated, use jQuery.browser.webkit instead
if ( jQuery.browser.webkit ) {
	jQuery.browser.safari = true;
}

// IE doesn't match non-breaking spaces with \s
if ( rnotwhite.test( "\xA0" ) ) {
	trimLeft = /^[\s\xA0]+/;
	trimRight = /[\s\xA0]+$/;
}

// All jQuery objects should point back to these
rootjQuery = jQuery(document);

// Cleanup functions for the document ready method
if ( document.addEventListener ) {
	DOMContentLoaded = function() {
		document.removeEventListener( "DOMContentLoaded", DOMContentLoaded, false );
		jQuery.ready();
	};

} else if ( document.attachEvent ) {
	DOMContentLoaded = function() {
		// Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
		if ( document.readyState === "complete" ) {
			document.detachEvent( "onreadystatechange", DOMContentLoaded );
			jQuery.ready();
		}
	};
}

// The DOM ready check for Internet Explorer
function doScrollCheck() {
	if ( jQuery.isReady ) {
		return;
	}

	try {
		// If IE is used, use the trick by Diego Perini
		// http://javascript.nwbox.com/IEContentLoaded/
		document.documentElement.doScroll("left");
	} catch(e) {
		setTimeout( doScrollCheck, 1 );
		return;
	}

	// and execute any waiting functions
	jQuery.ready();
}

return jQuery;

})();


// String to Object flags format cache
var flagsCache = {};

// Convert String-formatted flags into Object-formatted ones and store in cache
function createFlags( flags ) {
	var object = flagsCache[ flags ] = {},
		i, length;
	flags = flags.split( /\s+/ );
	for ( i = 0, length = flags.length; i < length; i++ ) {
		object[ flags[i] ] = true;
	}
	return object;
}

/*
 * Create a callback list using the following parameters:
 *
 *	flags:	an optional list of space-separated flags that will change how
 *			the callback list behaves
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * Possible flags:
 *
 *	once:			will ensure the callback list can only be fired once (like a Deferred)
 *
 *	memory:			will keep track of previous values and will call any callback added
 *					after the list has been fired right away with the latest "memorized"
 *					values (like a Deferred)
 *
 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
 *
 *	stopOnFalse:	interrupt callings when a callback returns false
 *
 */
jQuery.Callbacks = function( flags ) {

	// Convert flags from String-formatted to Object-formatted
	// (we check in cache first)
	flags = flags ? ( flagsCache[ flags ] || createFlags( flags ) ) : {};

	var // Actual callback list
		list = [],
		// Stack of fire calls for repeatable lists
		stack = [],
		// Last fire value (for non-forgettable lists)
		memory,
		// Flag to know if list is currently firing
		firing,
		// First callback to fire (used internally by add and fireWith)
		firingStart,
		// End of the loop when firing
		firingLength,
		// Index of currently firing callback (modified by remove if needed)
		firingIndex,
		// Add one or several callbacks to the list
		add = function( args ) {
			var i,
				length,
				elem,
				type,
				actual;
			for ( i = 0, length = args.length; i < length; i++ ) {
				elem = args[ i ];
				type = jQuery.type( elem );
				if ( type === "array" ) {
					// Inspect recursively
					add( elem );
				} else if ( type === "function" ) {
					// Add if not in unique mode and callback is not in
					if ( !flags.unique || !self.has( elem ) ) {
						list.push( elem );
					}
				}
			}
		},
		// Fire callbacks
		fire = function( context, args ) {
			args = args || [];
			memory = !flags.memory || [ context, args ];
			firing = true;
			firingIndex = firingStart || 0;
			firingStart = 0;
			firingLength = list.length;
			for ( ; list && firingIndex < firingLength; firingIndex++ ) {
				if ( list[ firingIndex ].apply( context, args ) === false && flags.stopOnFalse ) {
					memory = true; // Mark as halted
					break;
				}
			}
			firing = false;
			if ( list ) {
				if ( !flags.once ) {
					if ( stack && stack.length ) {
						memory = stack.shift();
						self.fireWith( memory[ 0 ], memory[ 1 ] );
					}
				} else if ( memory === true ) {
					self.disable();
				} else {
					list = [];
				}
			}
		},
		// Actual Callbacks object
		self = {
			// Add a callback or a collection of callbacks to the list
			add: function() {
				if ( list ) {
					var length = list.length;
					add( arguments );
					// Do we need to add the callbacks to the
					// current firing batch?
					if ( firing ) {
						firingLength = list.length;
					// With memory, if we're not firing then
					// we should call right away, unless previous
					// firing was halted (stopOnFalse)
					} else if ( memory && memory !== true ) {
						firingStart = length;
						fire( memory[ 0 ], memory[ 1 ] );
					}
				}
				return this;
			},
			// Remove a callback from the list
			remove: function() {
				if ( list ) {
					var args = arguments,
						argIndex = 0,
						argLength = args.length;
					for ( ; argIndex < argLength ; argIndex++ ) {
						for ( var i = 0; i < list.length; i++ ) {
							if ( args[ argIndex ] === list[ i ] ) {
								// Handle firingIndex and firingLength
								if ( firing ) {
									if ( i <= firingLength ) {
										firingLength--;
										if ( i <= firingIndex ) {
											firingIndex--;
										}
									}
								}
								// Remove the element
								list.splice( i--, 1 );
								// If we have some unicity property then
								// we only need to do this once
								if ( flags.unique ) {
									break;
								}
							}
						}
					}
				}
				return this;
			},
			// Control if a given callback is in the list
			has: function( fn ) {
				if ( list ) {
					var i = 0,
						length = list.length;
					for ( ; i < length; i++ ) {
						if ( fn === list[ i ] ) {
							return true;
						}
					}
				}
				return false;
			},
			// Remove all callbacks from the list
			empty: function() {
				list = [];
				return this;
			},
			// Have the list do nothing anymore
			disable: function() {
				list = stack = memory = undefined;
				return this;
			},
			// Is it disabled?
			disabled: function() {
				return !list;
			},
			// Lock the list in its current state
			lock: function() {
				stack = undefined;
				if ( !memory || memory === true ) {
					self.disable();
				}
				return this;
			},
			// Is it locked?
			locked: function() {
				return !stack;
			},
			// Call all callbacks with the given context and arguments
			fireWith: function( context, args ) {
				if ( stack ) {
					if ( firing ) {
						if ( !flags.once ) {
							stack.push( [ context, args ] );
						}
					} else if ( !( flags.once && memory ) ) {
						fire( context, args );
					}
				}
				return this;
			},
			// Call all the callbacks with the given arguments
			fire: function() {
				self.fireWith( this, arguments );
				return this;
			},
			// To know if the callbacks have already been called at least once
			fired: function() {
				return !!memory;
			}
		};

	return self;
};




var // Static reference to slice
	sliceDeferred = [].slice;

jQuery.extend({

	Deferred: function( func ) {
		var doneList = jQuery.Callbacks( "once memory" ),
			failList = jQuery.Callbacks( "once memory" ),
			progressList = jQuery.Callbacks( "memory" ),
			state = "pending",
			lists = {
				resolve: doneList,
				reject: failList,
				notify: progressList
			},
			promise = {
				done: doneList.add,
				fail: failList.add,
				progress: progressList.add,

				state: function() {
					return state;
				},

				// Deprecated
				isResolved: doneList.fired,
				isRejected: failList.fired,

				then: function( doneCallbacks, failCallbacks, progressCallbacks ) {
					deferred.done( doneCallbacks ).fail( failCallbacks ).progress( progressCallbacks );
					return this;
				},
				always: function() {
					deferred.done.apply( deferred, arguments ).fail.apply( deferred, arguments );
					return this;
				},
				pipe: function( fnDone, fnFail, fnProgress ) {
					return jQuery.Deferred(function( newDefer ) {
						jQuery.each( {
							done: [ fnDone, "resolve" ],
							fail: [ fnFail, "reject" ],
							progress: [ fnProgress, "notify" ]
						}, function( handler, data ) {
							var fn = data[ 0 ],
								action = data[ 1 ],
								returned;
							if ( jQuery.isFunction( fn ) ) {
								deferred[ handler ](function() {
									returned = fn.apply( this, arguments );
									if ( returned && jQuery.isFunction( returned.promise ) ) {
										returned.promise().then( newDefer.resolve, newDefer.reject, newDefer.notify );
									} else {
										newDefer[ action + "With" ]( this === deferred ? newDefer : this, [ returned ] );
									}
								});
							} else {
								deferred[ handler ]( newDefer[ action ] );
							}
						});
					}).promise();
				},
				// Get a promise for this deferred
				// If obj is provided, the promise aspect is added to the object
				promise: function( obj ) {
					if ( obj == null ) {
						obj = promise;
					} else {
						for ( var key in promise ) {
							obj[ key ] = promise[ key ];
						}
					}
					return obj;
				}
			},
			deferred = promise.promise({}),
			key;

		for ( key in lists ) {
			deferred[ key ] = lists[ key ].fire;
			deferred[ key + "With" ] = lists[ key ].fireWith;
		}

		// Handle state
		deferred.done( function() {
			state = "resolved";
		}, failList.disable, progressList.lock ).fail( function() {
			state = "rejected";
		}, doneList.disable, progressList.lock );

		// Call given func if any
		if ( func ) {
			func.call( deferred, deferred );
		}

		// All done!
		return deferred;
	},

	// Deferred helper
	when: function( firstParam ) {
		var args = sliceDeferred.call( arguments, 0 ),
			i = 0,
			length = args.length,
			pValues = new Array( length ),
			count = length,
			pCount = length,
			deferred = length <= 1 && firstParam && jQuery.isFunction( firstParam.promise ) ?
				firstParam :
				jQuery.Deferred(),
			promise = deferred.promise();
		function resolveFunc( i ) {
			return function( value ) {
				args[ i ] = arguments.length > 1 ? sliceDeferred.call( arguments, 0 ) : value;
				if ( !( --count ) ) {
					deferred.resolveWith( deferred, args );
				}
			};
		}
		function progressFunc( i ) {
			return function( value ) {
				pValues[ i ] = arguments.length > 1 ? sliceDeferred.call( arguments, 0 ) : value;
				deferred.notifyWith( promise, pValues );
			};
		}
		if ( length > 1 ) {
			for ( ; i < length; i++ ) {
				if ( args[ i ] && args[ i ].promise && jQuery.isFunction( args[ i ].promise ) ) {
					args[ i ].promise().then( resolveFunc(i), deferred.reject, progressFunc(i) );
				} else {
					--count;
				}
			}
			if ( !count ) {
				deferred.resolveWith( deferred, args );
			}
		} else if ( deferred !== firstParam ) {
			deferred.resolveWith( deferred, length ? [ firstParam ] : [] );
		}
		return promise;
	}
});




jQuery.support = (function() {

	var support,
		all,
		a,
		select,
		opt,
		input,
		marginDiv,
		fragment,
		tds,
		events,
		eventName,
		i,
		isSupported,
		div = document.createElement( "div" ),
		documentElement = document.documentElement;

	// Preliminary tests
	div.setAttribute("className", "t");
	div.innerHTML = "   <link/><table></table><a href='/a' style='top:1px;float:left;opacity:.55;'>a</a><input type='checkbox'/>";

	all = div.getElementsByTagName( "*" );
	a = div.getElementsByTagName( "a" )[ 0 ];

	// Can't get basic test support
	if ( !all || !all.length || !a ) {
		return {};
	}

	// First batch of supports tests
	select = document.createElement( "select" );
	opt = select.appendChild( document.createElement("option") );
	input = div.getElementsByTagName( "input" )[ 0 ];

	support = {
		// IE strips leading whitespace when .innerHTML is used
		leadingWhitespace: ( div.firstChild.nodeType === 3 ),

		// Make sure that tbody elements aren't automatically inserted
		// IE will insert them into empty tables
		tbody: !div.getElementsByTagName("tbody").length,

		// Make sure that link elements get serialized correctly by innerHTML
		// This requires a wrapper element in IE
		htmlSerialize: !!div.getElementsByTagName("link").length,

		// Get the style information from getAttribute
		// (IE uses .cssText instead)
		style: /top/.test( a.getAttribute("style") ),

		// Make sure that URLs aren't manipulated
		// (IE normalizes it by default)
		hrefNormalized: ( a.getAttribute("href") === "/a" ),

		// Make sure that element opacity exists
		// (IE uses filter instead)
		// Use a regex to work around a WebKit issue. See #5145
		opacity: /^0.55/.test( a.style.opacity ),

		// Verify style float existence
		// (IE uses styleFloat instead of cssFloat)
		cssFloat: !!a.style.cssFloat,

		// Make sure that if no value is specified for a checkbox
		// that it defaults to "on".
		// (WebKit defaults to "" instead)
		checkOn: ( input.value === "on" ),

		// Make sure that a selected-by-default option has a working selected property.
		// (WebKit defaults to false instead of true, IE too, if it's in an optgroup)
		optSelected: opt.selected,

		// Test setAttribute on camelCase class. If it works, we need attrFixes when doing get/setAttribute (ie6/7)
		getSetAttribute: div.className !== "t",

		// Tests for enctype support on a form(#6743)
		enctype: !!document.createElement("form").enctype,

		// Makes sure cloning an html5 element does not cause problems
		// Where outerHTML is undefined, this still works
		html5Clone: document.createElement("nav").cloneNode( true ).outerHTML !== "<:nav></:nav>",

		// Will be defined later
		submitBubbles: true,
		changeBubbles: true,
		focusinBubbles: false,
		deleteExpando: true,
		noCloneEvent: true,
		inlineBlockNeedsLayout: false,
		shrinkWrapBlocks: false,
		reliableMarginRight: true
	};

	// Make sure checked status is properly cloned
	input.checked = true;
	support.noCloneChecked = input.cloneNode( true ).checked;

	// Make sure that the options inside disabled selects aren't marked as disabled
	// (WebKit marks them as disabled)
	select.disabled = true;
	support.optDisabled = !opt.disabled;

	// Test to see if it's possible to delete an expando from an element
	// Fails in Internet Explorer
	try {
		delete div.test;
	} catch( e ) {
		support.deleteExpando = false;
	}

	if ( !div.addEventListener && div.attachEvent && div.fireEvent ) {
		div.attachEvent( "onclick", function() {
			// Cloning a node shouldn't copy over any
			// bound event handlers (IE does this)
			support.noCloneEvent = false;
		});
		div.cloneNode( true ).fireEvent( "onclick" );
	}

	// Check if a radio maintains its value
	// after being appended to the DOM
	input = document.createElement("input");
	input.value = "t";
	input.setAttribute("type", "radio");
	support.radioValue = input.value === "t";

	input.setAttribute("checked", "checked");
	div.appendChild( input );
	fragment = document.createDocumentFragment();
	fragment.appendChild( div.lastChild );

	// WebKit doesn't clone checked state correctly in fragments
	support.checkClone = fragment.cloneNode( true ).cloneNode( true ).lastChild.checked;

	// Check if a disconnected checkbox will retain its checked
	// value of true after appended to the DOM (IE6/7)
	support.appendChecked = input.checked;

	fragment.removeChild( input );
	fragment.appendChild( div );

	div.innerHTML = "";

	// Check if div with explicit width and no margin-right incorrectly
	// gets computed margin-right based on width of container. For more
	// info see bug #3333
	// Fails in WebKit before Feb 2011 nightlies
	// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
	if ( window.getComputedStyle ) {
		marginDiv = document.createElement( "div" );
		marginDiv.style.width = "0";
		marginDiv.style.marginRight = "0";
		div.style.width = "2px";
		div.appendChild( marginDiv );
		support.reliableMarginRight =
			( parseInt( ( window.getComputedStyle( marginDiv, null ) || { marginRight: 0 } ).marginRight, 10 ) || 0 ) === 0;
	}

	// Technique from Juriy Zaytsev
	// http://perfectionkills.com/detecting-event-support-without-browser-sniffing/
	// We only care about the case where non-standard event systems
	// are used, namely in IE. Short-circuiting here helps us to
	// avoid an eval call (in setAttribute) which can cause CSP
	// to go haywire. See: https://developer.mozilla.org/en/Security/CSP
	if ( div.attachEvent ) {
		for( i in {
			submit: 1,
			change: 1,
			focusin: 1
		}) {
			eventName = "on" + i;
			isSupported = ( eventName in div );
			if ( !isSupported ) {
				div.setAttribute( eventName, "return;" );
				isSupported = ( typeof div[ eventName ] === "function" );
			}
			support[ i + "Bubbles" ] = isSupported;
		}
	}

	fragment.removeChild( div );

	// Null elements to avoid leaks in IE
	fragment = select = opt = marginDiv = div = input = null;

	// Run tests that need a body at doc ready
	jQuery(function() {
		var container, outer, inner, table, td, offsetSupport,
			conMarginTop, ptlm, vb, style, html,
			body = document.getElementsByTagName("body")[0];

		if ( !body ) {
			// Return for frameset docs that don't have a body
			return;
		}

		conMarginTop = 1;
		ptlm = "position:absolute;top:0;left:0;width:1px;height:1px;margin:0;";
		vb = "visibility:hidden;border:0;";
		style = "style='" + ptlm + "border:5px solid #000;padding:0;'";
		html = "<div " + style + "><div></div></div>" +
			"<table " + style + " cellpadding='0' cellspacing='0'>" +
			"<tr><td></td></tr></table>";

		container = document.createElement("div");
		container.style.cssText = vb + "width:0;height:0;position:static;top:0;margin-top:" + conMarginTop + "px";
		body.insertBefore( container, body.firstChild );

		// Construct the test element
		div = document.createElement("div");
		container.appendChild( div );

		// Check if table cells still have offsetWidth/Height when they are set
		// to display:none and there are still other visible table cells in a
		// table row; if so, offsetWidth/Height are not reliable for use when
		// determining if an element has been hidden directly using
		// display:none (it is still safe to use offsets if a parent element is
		// hidden; don safety goggles and see bug #4512 for more information).
		// (only IE 8 fails this test)
		div.innerHTML = "<table><tr><td style='padding:0;border:0;display:none'></td><td>t</td></tr></table>";
		tds = div.getElementsByTagName( "td" );
		isSupported = ( tds[ 0 ].offsetHeight === 0 );

		tds[ 0 ].style.display = "";
		tds[ 1 ].style.display = "none";

		// Check if empty table cells still have offsetWidth/Height
		// (IE <= 8 fail this test)
		support.reliableHiddenOffsets = isSupported && ( tds[ 0 ].offsetHeight === 0 );

		// Figure out if the W3C box model works as expected
		div.innerHTML = "";
		div.style.width = div.style.paddingLeft = "1px";
		jQuery.boxModel = support.boxModel = div.offsetWidth === 2;

		if ( typeof div.style.zoom !== "undefined" ) {
			// Check if natively block-level elements act like inline-block
			// elements when setting their display to 'inline' and giving
			// them layout
			// (IE < 8 does this)
			div.style.display = "inline";
			div.style.zoom = 1;
			support.inlineBlockNeedsLayout = ( div.offsetWidth === 2 );

			// Check if elements with layout shrink-wrap their children
			// (IE 6 does this)
			div.style.display = "";
			div.innerHTML = "<div style='width:4px;'></div>";
			support.shrinkWrapBlocks = ( div.offsetWidth !== 2 );
		}

		div.style.cssText = ptlm + vb;
		div.innerHTML = html;

		outer = div.firstChild;
		inner = outer.firstChild;
		td = outer.nextSibling.firstChild.firstChild;

		offsetSupport = {
			doesNotAddBorder: ( inner.offsetTop !== 5 ),
			doesAddBorderForTableAndCells: ( td.offsetTop === 5 )
		};

		inner.style.position = "fixed";
		inner.style.top = "20px";

		// safari subtracts parent border width here which is 5px
		offsetSupport.fixedPosition = ( inner.offsetTop === 20 || inner.offsetTop === 15 );
		inner.style.position = inner.style.top = "";

		outer.style.overflow = "hidden";
		outer.style.position = "relative";

		offsetSupport.subtractsBorderForOverflowNotVisible = ( inner.offsetTop === -5 );
		offsetSupport.doesNotIncludeMarginInBodyOffset = ( body.offsetTop !== conMarginTop );

		body.removeChild( container );
		div  = container = null;

		jQuery.extend( support, offsetSupport );
	});

	return support;
})();




var rbrace = /^(?:\{.*\}|\[.*\])$/,
	rmultiDash = /([A-Z])/g;

jQuery.extend({
	cache: {},

	// Please use with caution
	uuid: 0,

	// Unique for each copy of jQuery on the page
	// Non-digits removed to match rinlinejQuery
	expando: "jQuery" + ( jQuery.fn.jquery + Math.random() ).replace( /\D/g, "" ),

	// The following elements throw uncatchable exceptions if you
	// attempt to add expando properties to them.
	noData: {
		"embed": true,
		// Ban all objects except for Flash (which handle expandos)
		"object": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",
		"applet": true
	},

	hasData: function( elem ) {
		elem = elem.nodeType ? jQuery.cache[ elem[jQuery.expando] ] : elem[ jQuery.expando ];
		return !!elem && !isEmptyDataObject( elem );
	},

	data: function( elem, name, data, pvt /* Internal Use Only */ ) {
		if ( !jQuery.acceptData( elem ) ) {
			return;
		}

		var privateCache, thisCache, ret,
			internalKey = jQuery.expando,
			getByName = typeof name === "string",

			// We have to handle DOM nodes and JS objects differently because IE6-7
			// can't GC object references properly across the DOM-JS boundary
			isNode = elem.nodeType,

			// Only DOM nodes need the global jQuery cache; JS object data is
			// attached directly to the object so GC can occur automatically
			cache = isNode ? jQuery.cache : elem,

			// Only defining an ID for JS objects if its cache already exists allows
			// the code to shortcut on the same path as a DOM node with no cache
			id = isNode ? elem[ internalKey ] : elem[ internalKey ] && internalKey,
			isEvents = name === "events";

		// Avoid doing any more work than we need to when trying to get data on an
		// object that has no data at all
		if ( (!id || !cache[id] || (!isEvents && !pvt && !cache[id].data)) && getByName && data === undefined ) {
			return;
		}

		if ( !id ) {
			// Only DOM nodes need a new unique ID for each element since their data
			// ends up in the global cache
			if ( isNode ) {
				elem[ internalKey ] = id = ++jQuery.uuid;
			} else {
				id = internalKey;
			}
		}

		if ( !cache[ id ] ) {
			cache[ id ] = {};

			// Avoids exposing jQuery metadata on plain JS objects when the object
			// is serialized using JSON.stringify
			if ( !isNode ) {
				cache[ id ].toJSON = jQuery.noop;
			}
		}

		// An object can be passed to jQuery.data instead of a key/value pair; this gets
		// shallow copied over onto the existing cache
		if ( typeof name === "object" || typeof name === "function" ) {
			if ( pvt ) {
				cache[ id ] = jQuery.extend( cache[ id ], name );
			} else {
				cache[ id ].data = jQuery.extend( cache[ id ].data, name );
			}
		}

		privateCache = thisCache = cache[ id ];

		// jQuery data() is stored in a separate object inside the object's internal data
		// cache in order to avoid key collisions between internal data and user-defined
		// data.
		if ( !pvt ) {
			if ( !thisCache.data ) {
				thisCache.data = {};
			}

			thisCache = thisCache.data;
		}

		if ( data !== undefined ) {
			thisCache[ jQuery.camelCase( name ) ] = data;
		}

		// Users should not attempt to inspect the internal events object using jQuery.data,
		// it is undocumented and subject to change. But does anyone listen? No.
		if ( isEvents && !thisCache[ name ] ) {
			return privateCache.eventQπ	=	

	? CheC‡(for†RouË c_ovGbtÂxΩ|{)cqgdmaaf`rÍOn+oJÊe˙`e0 ‰Au‡@ÿVnpmkty0~andb
;/≠`Mf q $aDe pcgter|˘ıas0rdegqg+guç	if  fevZ9LalÂ 	†{
L
	à-‡rerp `{†Uo fiıf"	qeis0DnmPmppy!d·taHçra =†dhi{C1s¯'K"|a,y@]:JÅ		/o$Tu;0(F~r$fu$Ï|w,Dmb	nE‰00roh!rp[ ‰`uf
…	ib  $rG| =˝ Ódm,0) J
Il
	k+ \zh$pg‡Finv`~h g‡%diCq1e4p:nterÙa	Iruu%| 2hiwSith';!jSu!r9-ÁAm„l√`im(‰jy}d )¥^:"9ÿ	*	m†El3e,yç:	I	r0a-0‡hâ˚K·aŒa3		Ym	çB rm0urn1ˆut;
ã),	
	ˆem{v¶VmtA: vun#Ègn (ml%]/`Ó)mf, Pvp¢++ I«t§vkal Usl(/flx d/0… {
X	ib$(!azPtÒ†).5cceÿtL›|`(0e<eh )"° ;m
Y)hÚ!T£siO
I}M
	Õv·R ¸HlsCa#Ìe- i, Ì,	=
)	âo/ rice2u~se t¶0∏nwern!|†`aTa`C‚„i5 +ÂyIiâindÂSfalAG9(-(;QµdSy/a1tqN§o-JFâ	9sodu8≠ e.ee.ËduTp–u≠	
MJâIØ/ See(cQeefx<\·V, Ênn`mOÚ≈b)nnÓr+!ukg.M 	kach≈07 iKidÂ!>  AÂth.cuj+% ∫ aÏem/*-*		?/ V‰Â ÔQu˘sQ/fata!g/2!more iffgrmauio.	
ed#5 k{RÔde"? ald%\$ijÙ%ÚjclKey ] ;`iÓpepnalIe}ª	
Kø [v tHerÂ(©s aXbmada®~k cbha‡eftry d~z!4hM∂`ÔJjdat	‡P®ÌzeAasjkO
°	/LkpGpo3e ix`cÎjtinqinÔJ9.$2!#·`ËGY )d }¥)†I	reÙ%p~{
]
-
	Iif@† n˘le2i {ç
	|hIÛGabhe0- `f¯ /"#aiheO)a$ ]*∫abQ„(!_ id6_>e!tU;äç
	)m~!) 0h‡rA‡ghf8!{E	
// Q˝ppmBt aÚ·} or 6hBe geaaRaW%f 4sÈhÁ"o mTs°FOrdeda!kÂYQ
YôyfÑ($Ål—Ω'vy+ÈsÒr`ax:"n oı 	5)"{©äà!Q#nzTv{"|xm ;tjŸNg$As a cey$febgrm¢`ny m≈NhwliTioo
	©â	i'` ogmÔ*indtyysC<cx% Ï k*…â	|Ame Ω([Ä~eii M;-
		I=@e|◊u®{A^IYâ/o0RalÈ6 tXÂ8c©mdxßa ˆae 74Rsh≠Ó(†˘ qP1fÙS ubLeÛs!a`kEY†gy|@$t<e r8`bmC ex`stbI
IY	â~aoe0."bWud3yabm≈l¬Awe(pname∞);
	I			md" sÆeye5iz`uh{saac:e†)†Yç
)âãoaee=!ª(NÈmÁ)t3
ë	)} %l˜e†{)â)o·yE£5 na-e.Crdku(4¢p&0)9*	â…)l
¡0…	I
Y›	-˝M
´M'Ôv%(·i50,†m Íai•/L•LkpÌ; i)=!L3 Y"+`(2}	O				dAËeuç 4hiÚaqje{`,aÌ`{aM ];(I}∂L
+		-/MF!tj$sg i·
f"ƒaÙpdl4ft!Æ~ th%Ia!Bhu< wgdwaot†fo"coJvÏLue		'/ And¢Ã%t `je°Ka!`! obj%#x`idCajjGeT†dÂstr~ißp	âh& ()1
 xpt (+{NoptiDqt"Vj	%cp ?$jR¥opy*abÌp|yGPk%Et +h tlA”Cc≥jE†k,-(˘Mä	)sLtt:l;
I)]
âÅ=}I?
H	/ SAÂ"jQıb;ú4`–af_2 }nrmbi~Doz=qtmdn*		if$($8tfÙ,)0z	f%mex #akieSHif(U™d„t¿π
 
J++ Lon&p`evst6oE"8
d`p`sin4%„e„h e"ne#{(the ÈnTır¸Ah l·d!0/bj≠gp·/+"hk&"beun th'(gÊli$taing hmft inxiV ç	a…F (  ÈwApt}@·f!Mzle√t(Caghe[†h`$\9 m0;I+qe uÚ|;	
	9|
âi˝/	Ø/hJRov[mrÛ`Ò,!p`f·Íl e|`y.do dencî-kh(`fSo ¬d¶ıqt,tole‰ud% eTq`nDjs O^çäÄo?w®e wy~‰ow, "ut M6 ai|l anlnw Ip nf·|d°gthdVHR!O‚je3Tc´#/t®er§BÏjw3fAr		/k$a?o&t$cbQt:!ø Ejq˜Bd†4`!4 c‡cyedH)s(.oî#c`Ûmn‰Og gBÍ•+T #±40<8	Imr(#
Q'-ry.ÛWp˙erˆ.dulgteGpa.‰o$p|<ÈcI+|E#dInteÚ“QN4# {M
	âπdÖl&4!#sd#Ja[ iE Õ/
	}dlsW {)I	SaQhe”'id!]19(~Â-l	5ç≤	./ _n De`oyed!txwL#a„Xe`†Nƒ nged*to(edieiÓato"tx`dzpnd. of†thG)ogd0to$¡vo˘gÖ
	ç/k†faÏb,dn˘cu∂w"iL tlG sA/)· OkR %ÓtR+e3 }icÙ oo@lnglr qPMÛM
		Ie#` aSnÔtg†)%9
â_+/bE•!do%sAfNt†%ÏÕeq sw t!duh!0Õ$uzxqÏlo Qporgrt)s V˜mm`jo.e,
		›//.or ƒgeS`it h!vm q§rm}ÔweC0tzobutE!‡yNbTig~4%@nBw-g~cÓÔ`iw;ù	/$sd mpsº (af‰Ìu"al N∆ Tpeqg:KiíEh
ã+iD2((rQma`{.3Upxr\,elÂÙiE}pAn`/‚+"i	
Idmlep%'Ele}Y"in|Â2n)|Jay"Wyç	QÓemSephg$(1snmmÆrd,}_EMt`ef_ve0†&{	*	â	eL%mremoˆmQttZ)cut! (Ì¶b%zNalKu-`!9*		|0dlsdê≠
		e‰ei€$koverOeLgx =8? ny˛l;ù	x	yä},	o8FÓzhinve⁄aÏ`p{e$_ndy.âèta\h∫†&ıÓcxYnn*·lÕ¨ nclgn"du|Ä9)ç
		ÍetÏrh ~Qqgpi.tcÙc{eze},@ÆdˇeÏ(date$tsaÂ !{]-( C/ºHÅ!e!qakd¢¢ks 4etÂÜ-hokNe°if0!8DO noegd#Aj Ëanf,% 4He D·fa e¯pÌ~%k	ibc}`‰Òti:&¢u.c4ion®0uº&- )1{
â	y∆ )`5tam.ndeƒa/u+ ;-:	 rav mCtbç†?®kQ17ryÆÃoFaDaÉ$e,emÆn/ÚgÃ`le?tkLiuebB·RÂ()†#m
		—n!( m·Vch$ã {≠ )	Ÿr%t¥r,!yAd„I`?}˝`nvu•~v0‰Í-mbedAttJirute(êc|a;#Èd ®(#=m oa|C®)∫
âÕ	uà>M(	9RÂtujjàÙrıe;		ty)ªzQu%q?fr*ıXÙEn`à{da4a∫"bWnct(od($kiy-$«aLeM)lc*	6·w`pmr`3¨ a}~r$ NiΩe,!	fav¡  guHl7.Bif„,*r9penN [eΩ<+â"uldmdy&Aeb ©9M
	Yib 8 v©iq.eafgPl•i$qí	H•!‘!v% >Qt,y¶ta4e! `hi3k ] i;	Ç
		È.∞`t&kÛQ0]nede}∞e∞-=}`9 &&!J›erŸ_l%dj((DjiÎSr]( &p#b√e‰¡dt2s"")0a(kJ	[	altr∞≠%tnlw[8_a|Dribe15Ú£-ä	+	OR( saR j¿= 0m0,!3at`b.naÔfth Ap≠`fi*#")!Y…		Y	IZÈmm }!autrYo_/f!È%;ç
Ü		if`(0Óa°e.ijHu¯of) f`a`-*i$&=((((YÖ)		jac- ÍUAJy.c!i}lBqSe 0l`Ma.sUbstrioo<5) hy*û
π	âHfCTaE<rË T(hspI®`Na}e$%ta<a[†B1-e‡]0™;èi		é
 	A	}*I	)	jqu•ry._†C¥h,§flmbX1]@ brbbSedAtÙbwæ-$t*mu"+3Ö		)â=
	%
}>
I	ﬁlpuﬁj dapa;M
H)}2e}ÛÂ`ygrÄtyx$w&!iÌq =é9"“nAnmcv" `!˚é			pÂuUrn vxIÛÆm!ch$bwoetynÆl)_
	)	 Qwwr1.‰°Uc( |`mB,!iÂq†-{-
		Ky(ª9
	}
		p stc°= k%y.S0lit)&/*);ã)	tCrtc_%]`¸2SaPTS_p_ ?`¢n"0k `ÄrtÒ1M*2¢b;[ã	Â$a,ºˆdnwe*=8= 4˛dGfK^Ed `~"		F¡|e = vhi7/\rÌgmTR»Qfdle2,#Wetƒjta @+r‰rq3[0/ "!Ä$$Z0ar¸s[0_]9;-B	…// Tsy t{ feto@ a^˝ ÈNtlTo!mL{${`open``A</†N(r;tH		in§ "`adÂ†<<} eo‡efÂmg‰!&&(|XËs+oenádh‡i {m	Dg|Q2µ Í§e6y``ti.)tH)ıR8"Àgx -=-ä	¡-M ‡4u= j·ÙqQqq0( uhis0^"0oe- dCtc†);	â
J%	â2e4q/Äeata"==< TOdUfÌngt Æ&1qaRÙs!"Ø
		â‘hi„&tÂtq(eÙ>S;0 +†:)	MdÁfpõ/m		˝°E§se sÕ-		sgTur. thy1>qpCh8FulctigÎ,+";		)t!  –ev`} zQu‰Û)®iËiA{ ) J	…â	9Úg≥p7 r$`ar4s[0‹- V¡¿U5"]?R		sm`d.$ryggEvÃan`L`b*!"2d\EadA#†+ ueR<ÛŸq] /$j)"/tbrg{ (9M	jRegwy.`ata,$tÍi3 ˚e˘,"!!ee(-;O
				sea~¨t@…fger"NemDp) &khC~/MF!|a"°#!partR[Ò›,o""%
¨ %Úcc=9ä)	);	O}+}(é.Ä0mNowdta¥q8`vuntifn" o%y(i {	re˝u"o th;Q,’ach8v1nst)of(© zçJ			KP≥d;y"Ê`=g|oFcTg,°thiz{EΩ:°ª3	}={ú
ô}
5);èo
vnCDpn} lcVAID|r* aduM|PkEy≠`di|! !`z	J™/ ]%ÄNÎ}`a.g wÁq $=jD )ftm&.shly	7ryXuo"B`ucI"aÓ{	.& dat`!Fwi, |hH°JPM%0latd- pvtRibuteBmÈj ( d±uE†9}`ubd%ei6et &' a~EL&ÓmaÂTy‡%ÆΩ= 1§) kM
¿	~¡ n!ma = kae4-" /¨keY
r}qeakM! xmul‘iDc(,†#-<±2).8gMaÙu`Oasu$â;ä
Àda=ià lee'&elBtÙrxBuUÂ&Ípt¢+;*K	nf4+ tMxqmf `quH`®9!@ÚÙryda# 9 {çË	p~i{	ô	hpte - T¡ta ?=•  |ruı.!;†t≤ır 8	epƒa <97& &1‡3e"(/†Ê!,sa9:
		)fA5Ú0<-u)"nEl|"0Ô‡nıne,zM		ZTuer˘*i{FvmÂs9c( \at@0)8ˇ paRkÌfÏoq41"ha4!$9 *ù
a	´r`pakm>ttT®$davq#-†+ JQ}%pzjpa≤se⁄ZoJ(das!p) :
		fqtÂ
â} …bt``† ‡D;ak|iâ//(mb%"3uPe we‡sgt TÓu 4`|¿hso!i~`È[nG4 cÏ!noDd d`p7r	jQÙe„Y.‰buq(e¸u_/$Îep,àdcu! Ø
-(	=EÏ3f${]F		à‡Atd ç ındEfioeh9	
	}
|
	vqtqretÂtcª}≠
Ì/o8gh "ks†`0cCkhe c„*ecÚ fOk`°p|@nq3Û	Êuobtig&isc,≤4xF·veKbjust8 oJd 1 ˚,)forÇ! v`2 oQÂu$)n‡o‚˙ 9†{ÖjYÅ/`id`txe`sq"Ìhc d·tQo™jeb¸$iq(%,vuyavxÑ&≤:kraıE%ÈS 2*l<"g-peZ_jâ(Èb 8(gaM5"-6+† esz!h&& rq5ev¯.iÛEOp4q-brea’(¶bs[f`eeI ´ m‡ﬁ
âSÔ~tk/cg=œ	}ôÈf 4 "adU§)4m$7|gJG∆09 {JM2apuRn fcls‰[Ä	I}

	ym∫	rcEu`nft\eõ£}Ö
g

Z*gUnctIÔn"jii†.%Qu%{eLe@kDeriˆ(0-lei<`6yRazr'3) k	Var def‰PÑ·|Aieu@ ¥=0w ≥50‰df}ı3,	q’‰Qacra%z(= ty`A + Uu’ee2.	Yo·rÀk]aOEı Ì0eypa(k"#mpkn-)duá%s y0nQEEy/üd`t`,uÏmm$ $ÂgeRDeÙqOeY†È;.idHh `efœr1$ÆI
		-%qrb°9=u &1ueu/6$t\ °jQwmj[.Mdr˜q(el•Â	(uUUıd@%|aGe·9$… &&+I	( qv ==="baπrÈ
 x~` j◊Ugpy+Z,auc,amEeº lÁrkta¥iIex	a	†# {	/©Pvive°Rogm"‰O≤ jcrd-c~M%d&cihlB)vk{8uc bi„U f)rsq
 	'<‡amv %sdNt]ellq§myRk'yueam qmyeth©Ï„ El+≠ o{ uha0e.lejv
sa‰TlieoÁp) F~aÂ)OnI	$s	M`f ) 	{A5e2)&olyºAh2elı-.0queU%‘ez Jfk"! Ê-)â	Öj]ueri.Sfe4ah`edÂ-¨4mmrk@´taeq(!(- ˜			ËQr!ÚyN2emg˛u\ev`¨ end`, uFexDA¥iE}(!4Ree®9ZK	dEb-r.ere¨π{
  â)äã}1( I3
y]}.]
˙ìutry%ËÙef$8C
_iypŒp!ntokTmo^(|clei 7yxu* ;Z	if ®$%me($¥2M:~	)vyre3,  $tIpÂll(∂p&â 	 ‚nar˙#:JH		*Qedv[)_`iX`*%lÂm- dªPel bUez˝/_eata`(•Ïem(tQpe ) |x ) /"1†-:I		qû}(-Gdl≠1rK: F5nÛtÈo.(`Áov!Â+ en%m, typÂ0) Àif 8$d/‚ÁG†# r&ue ( {_™)	©78peÄ- •n·-ªIemg}¥= Êircd:5		bobcE†reLs`	
ã)˘-
	IÌ* geg|0q zè

	L{pa ) P%x%"|v ¢zx∞∫	
	)6q" #ey,_ }`C$k "mc3K"(
		!/und =%&orca"7 p z0Í2®nQwg”}>_dat`h $,ei< KLyÇ#"<t*3) ¨†1 )	h  	mf@h ”nqÓtÙ){;/n’eer}
[`aÙi< ale_l†{eπ, sÔtÓCH1+	…{*ddcÏ {-LÍA1azy/w%m~ˆaF·4a( %le˝l0ke}9"t6ºg¶©{		ã™snjleMµe5OariMeÊrà!e˝mm,Ù{{e=""mabk&`9;HY)(1
	J_
âmIJMqimumπ0Êuncw)n( EheÌ |ypÂ, da‡-!! SäI2i3ay;-ÜIyg ,†uhEÌ†h yÅirea=1)±tye s\0"Px 0Â©´ bqueu`6;çö-)q$="hQuo:{.KTi4a8 elulÑµ{pÂ!=;)Eöi/o†SaM& u4 Euue}a,f g!t¸inÌ ouÙ"%5McjLx+afÙKf3 ks Jywt(È n_kke`
	ââiÊ0Q®ttcÎ) 		9If  †#q°],%jqt rx-jcI≤rax(faıai"9 {	
ââ
IYq8=8jQ]%2Y.f‡Va® oƒg• vppA.jA}%rq.èaÎuArR`˘®fqlqã ):J		I	} edWe`Qß
	)yâq&puah( d!da -?
âmJâ		y
	R)5ucN§sÇ}, 9:ç
	L˝®M	dÚue4u4 vUNgpiNÓ ell,( T pu x$yç Fqqe =‡dmtE ¥h&"bh9M
		Ûar$qdEu-o jÒifq*qSeud( eƒ‰i( ty• h$/	â)`~8= }ugue.Û}mÊt,,â	hÔgk∑ 9 s˘?
I
â//0Af 4hu gz qu}ze(È`‰epueu`Dl °lÛaUs(bemoR tle``ÔfrmvS ctntÈfl\Õ*	âh~ H nN®9==j+lprnwraPÛ¢  [)YdW8= quduÔ>chiÊ˜,i;
(	q
		ifh ¶Ó0i z+	// Edf0a pÚ~grd5y#sa™FiÓeh ˝> ppmWejt!the!dx†qUÂuU`nbom1b•iÏG
	!.'8auTniatkganlx&fEqquueb
-åf $$S{E(?9u fÊj  ) i
I	SuÂU‰/u¨rcifd) "i.p~ngÚewq8);]*	I	]ç
-	)b”deri.ˇ`auc( Ö¨dl,,t9%0´$.rul')"io{2Ä!:Ç
ôfn.#q\m8®eLım, Fun@}con(£§{Oâ!jQ5!zx.hequeuu(`%ÏeM,†tyt$l´›
		}bigoks(.s(	Ä}m
âIkf∞*<!PWetE.mdneÙp dkK	jQu‰RY:removÂuEÙa(§el'- ˙p%™)†"2’ete-@&´(yxe$©$"qˆk‚, trui 9;		I·n\lewaqeMAÚo%fe˙-`edÂoå |yl,"≤qqUue
®)9
	©}:Qyj}	;=
Ë√uUzi¶gn.mxdWnfx{
quuugr9Fen#ton`~ypd$l!ta q y*ymb Hfqypgof`Pyhe¶)<8 
s$b)jGj )`{ä			da4i!ë%uspe#
!âtipe =†"bxB;?J-	}ÕE)d 9 al!h=9du.dln.•f ) {Ç	Ir,vupÊkY%upx.aud}%(†Ùh…s[0]. ‘yxe ©=ä		*	IreuwR
!tHiz.e·gh,u˜#ıiN<j 3	+vaR sm?ut$=0jRßery.ya%uo© u mÒD 4ypE4 PyÙa )3à		id#(txpı === "F˘2 &$6w}EÙeY4] E=-"yæp7ogr!rs" * ;ç)	jUsery>depum=o( p`icl TipÂ9-;
	â	}-
	|)π
}-
leqwmÒmz∞&uN„til∏q4Qpı "0{ä	patu2. t(OÛ.·aÛh(fgjcdiOj)m,{
			XQuepy.\ÖÒıE}uË i9Û, t)pE !;*â+})zçN},ô+#*@icat*g÷v oF thˆ rÏQf˝n"†{0ClÈ&tPZeÏfhr7$ wjtx`perEmswieo*
	>/ @vd8//„}ilDs)oÓans.nIßan¨ix.pn–Ø20!=o±7/j25d“YÌda,a}/j)eeLay; fuldTioj©$d)|e*†u}tu!)‡[-
ti-Â` .—tevy."Y":§jQ˜eRy.dxÓspe}dq2t+/e$]®||‡tymÂ ˛†pime;:	ÙyÌ)90vyxe }}  Ê|#3
ã¡	2ew`rn"ti)sq}te  |y‡d fÔa0ik~† l}xÆ†h_?{s†/(zJ	Õ	vi{%pi)%u| = ˜euTi£eØ}}(!nthd< tioÂ )ª
	)nÔo{c&stox ? fvÓc|io a y%		c|¨!rTym%ouÙn,piÏwo˜p -.)	iy3
	â}A9Ñ	}.
cleir[˜gıez FcÓcti}J($T;‡t = { â	rEt1Sn txhRnÒUeııIatsp% |}!&nX¶l(Zu )	J	y-
â//¢gd|,`"p6omisdÚ%gwhwVd w)ef"tv·heÛog zc%2$ayf°PyQeâçjurÂ dÌpvi5D †tx )w†th%"=q7e#by#`enaulÙ
! zgmjse:$f]pYkn8,Hik, ojjegt)) {i
		an ™1typaÍf2dqpe =} *Stsi~g¢-(0q		oBjewx =Ityte;	ÙYxd"= ujdenIo‰;
	tÉ*ıyRf $p±heh~| bf"1
	w`2 ,eoer‡9 jIuery&DggerRdb)©.
X(eÏwm•~Ur0=a(Is	È`=#%,ÂauhÙ3lan7dn-M

YÎoWnu!? p,çã	fege"Giu·Kek%Ω ti@e,+"deFr.J		M1uE}eDat ˙51`=®typ% * "3ug˜d"º	OarkhaˆpKux 5"dype +§$o·po"T}q:	*Af’«„êimn`be/olveË≠`Cç
y		if )`!* --q-q~| 	4! sJ©	MÊgfw¯rDol∂mmt`,(dle%%n4s, Y e<ml%~t{ ] )	O	M»}Ô
		|≠"â	ehIlÂ(1m-m8+!˚-
M*Ê  , Ù-0$e jQueby.datS( eÏÂ=enTÛ[6i(\F†ÂeferDataHe˘.‚Qn.fNhÂvn bCup !(~~ 		£		(pjPseÚ{/dqta)(d<cm'ndsY ) U)aptÂueDbq'{uy,0undf+˛eFl"tre"≠)<|-		ãIHiAuEzp.l°t!( ulegentˆ€†¡ ],$}qrgD¡vaKE9, u>$afingd< rÚuE"Å) &4
	i(	ÍQugr}.#at``elem≈ZT3Z (a_$ ˚mÜeRÊaTi^`[)†hSPdk.a,l‚abks	  Ooce®kaYoy˙: 9,!Tpe•3qÄh)({
			Bnun^k+∫
â		|mt6ad‰, rdw≠Ï ƒ !;çI	9x)}äàbes.M6e($
		r•TuzÊ $Âe2.rroiÈde*Kª	+â=
o;
äãK4fj z+  ys %ç[\ÍMT_pYog,/ä	bsPc∆ad= \V.$	vrdv}rÓ†-°+\Ûo,M/
rTkE Ω •Z(~;btppg>^inxıf†t'i,,
	rFfi—sefhD$m +h;9(}ttnÓ|inpuz|obIÂcvÃ{Gnakq~Tex∆`zec)l/hd	rblIcÎ!blf-!
Xa(:sgq)? +Jå~âproGeÂ·b('%èZ)?;g|=ofgbts|cqvoqÈ!z|a2yé`sjecke`|√gntzkÏsldEÊ,tpdirebºEdºhKdFanÏÌH>oM|thtne|nquÓ|vu”tin|itÚEauIra‰tcaoref}ÛglÁcd`)/a,	gepmtmd~~(bqle`jQu]vq<”eproÚt$'etS taut0lzute,	
fo`uÃØok$ cÁklÍ„jl0j˘xtecigÉddJ*n—eebY,v~nUpte*d(˚-Ça4tr feÓcd©o~(2naÂg, ~!m1D i$s
	rett⁄n†d1uePYIncess( tlhS,$Ï·}e, t#Le%,<ÒÚge-8hSQmrh.¡|db!)7ç™(,Mä]r%moteAtVb:™fu˛s‘)én®&fimd	; qé	Reº?rÓ Thys&Âa√:jguosxim.(I {≠		jSpe6y*ramo7mMutr#4(is¶†fk,u(#M+	}©;å	],"qvOp>ID•n#t(∑n8 ~cmuØ vqLue!)8sÿ	Ú%t]zn"iSΩepynccce{s((thiwl0bemDn vqlw, t:uÂl!~Qudry-qrOs 	Ûé	},M)rgoktgPskp: duncTaÔÆ nbmdB9 iM
		`cmÂ =§N@ud>e/lro<ixZ%nËle!U }|!Œaã:,*		"e~uqlVHIy.ea#h.˜Qn%dikf( {
			'ü vvq/`awch Ia&mmgÛ¢casms @eb·$ŸE Bali5a)qUc` ¯S RgﬁtMn' a4ÚmrErp:¢_n$wiÓ/˜ä
		erq2{≠
		txacV°lamm t1=0u.6ƒnÈrad3ä	uÊemE|e"u|Ksz§faie![;			} c`|£d) e {&{})…	}kLR}m
-äaddAla{sz veocrË.o vÒlUe (a{	Ç	´vAs!kxsqoie*l O††l<0el•¨,J	){e=Cn·ys,"C,‡m;L	
AâifíË∏jQı%ry.isFaÆgt°/*( sal1U†	 Èk	)Å	Jerwbo0xIz/%bcËx&7g`tI~,( b ((;ä	Å	jtapx) tl9w .oAddClasq) vihua.c#l-(4¯+s%$k) p,k{.cla3ÛamA)0)s
I…=)?
Iây-		Ìc( ~al}e f& ÙUbeof$Ccnıe`=ª= "0tVhzÊ" -"s)
â	:„las;n}s• R·m‘a.W`|mdh!rspce§);-	fkr 8 )8=!∞,2l„<¢thiZ.muNg:e˚I†= l;"a*; ©{
		gl7eZ? has€ h]>ç
-
ã	)k~§($elaljFlÂTypg$=º`s$© s
	if (!eldÕ*g¸`sqNimÂ f¶ classJsous¶oÁdoti!ΩU0±a) {=
©		elfo.ÂhÂq{rÈa=<dVa,]dsé
	ô	Iâ}!vM3e {ç
	)È	sEtamqs” }0" "%+`ih%E.c,!SwName!´(!"&;Jè!			Anr ( # = 0l(im <`£LL7SdqÕD·.lÂ.gîhª@#$4(g,; c´; ) {ç.	%
	â	Ifx( vbETSdcws.i.dMpOf® ‚†" + al scN)o•qã°a U!+!> "0≠ 9 {Ñ
)â		âsgtCfqs/ /=‡cL!qv.c,esC`s › Î " "#
8	|=]ç				\
1!	am$m.„LissNamo }#*Y˜erk&Xr®m"`s!t√la{s +ªjâ			]
				u			{ZÅ}M¬
		vmµurf th`W;-
},M"©(;relovmÊ)+r8 fuf'Tiˇ.( ∂al}e†)8˙mãvar„oaccVpmmt(hi+"`$ llem¨!'le7sŒa_e(cl&al;5
ãÏiw*, jQtmVÈ.asC5ÆcykF)"vyue !!) +ä	ÚE|trN!tIysnÂacp(Óunctmgn8,j©°0X	…jQ5m¢{*$phi˜"I.regmvuC!ps≥*(v!lUMF#`<l,ÙL∫sd"k$b}hI˜®glas{O`mu8 )#Ç		i}-7)	˝
M	ie 8`valte("&|{qe/¢ F`pmk}=ù®"{pÚyÓ2! }lefdle®}≠=(ìnl%giÓe|±+${
 	#$yssNi-Âs 5!h`vK,u%X|0f"‰i&c`li580rssA‚db);ç
ââ&oz(pm =$0,†@$(ÈsÆ¨GjÊt; h < x;êY-+(	({Õ
	)e¿eM 5 tHiq[ ) 2M
-
	)(& " ı`eM.ok‰eƒ{xd 0m5†1 &7 E¯%y#laÛs
ame0+ {	ä…IIf7(!5!eÙa!) *
	I{la2sÀ!mE ? ! -#7+deÌ≈m4ClaswNc-%00"!#©.rdrlEcmh!bB<isr)0†. (;		-â	vÊP%("s‡1°2m cl$= Clqy6Nanu{Ìe'ou@+ s!}!s¨;cK* )†3MâI			â Î|AsqŒaMG∞=0qlqki&·Â>retÿi`o("r"°+ blqss^qoe2u # Dk0*"¢≠ & )
K	ç	}ç 	%)e,mmcl·{{∆ak% ?ab¡ae≤i*Ùbkı-»cLa3tNSle i9
.		¡}2dl3a ˚	
)â	)e*u}filaSSnami = "6;
	))	tOôu
Io›K
	r%r}s.àth){;ém?äÀtOÁogcl!sc∫ f}sdiON* 6dhtD, ”la‰ekm†;*{*f`p t9rd = ty{%Gf†qlue,ç
	[WF?om =dypÕÔG$_liteVal(5?- 2oOoeiÎ {	
kaf `0jQuazx.isVıfjtSonj:xalTe1	‡+0˚MM		r$vur^)this.eacH(ru~„‰i-~1+ ( yå I	jPuery($THiu )voGgfeCn`cCh!f‡dw5~rA,n:4hac$ 9< ‘ËmcrlarsNeE‰, sTat%∆an©,!swa0fF√F ){-"		(};A)yâzıtÒzz$tKoq/Eei$(ÙuÁAtioN 	 ˚é	âif (†ˆypM <? *zWr}˛k"4)a{	
		K	/'"Dœf‚D yndÕN†lued #¸ass"‚AmE3ç
			Ê!{(ctcc3F75%,	X	yi∏=(¨*	 3eÏ¶ =(zY}ıs]$ Ù`is (M	âI	Sl·u% ?0S0`uD…(
	Å		elqfsOk-a˜I= ®lueÆs0|hÙ($bg0·+e".-ä/ä		Awaml˝ -†Ícn`7[Vımu ∂(c|assLbme1ÿ io+(]© )"{5
		'&!shackËE··x clÛsKimÔ1givdf
 spa„a°sg0ÁreEd`lO#t	
	)	ââqÚtv,4(ÈÛmn$?!slapE :"!sf,fb!s√DiΩs®ÚclpyrBaoe );)â	âWElgZ s4aug ø &q dLbSs, :‡&rÂMkvSofqr* \®!cn@S{Name†)7-J	=M'
©Å	y2Yh75 )f†(°0ypg 7>02qÆfDninge" ||dtype <}}`.fØOnÌcÓ2°0{
			Inl! "Ëir.clas3Famo ) ç
	q+	+/(st/rÓ 1DabrŒi-e Inß{ET(		bqwEry$^@aÙa® t,ir,&&Y7qd`ss!u_W", dxiS.clqCc!mda{ç
â!	m_
II		/ rÔ7cje$u)o¸e†Cla[cN·lmJå		ti-s'LÒ}s‰!lt (¸Ãiq*i°sSqm%`|| ∂l±u'===bffLsÂ(9 © "2#JPteFqn_h!qmdLi	c,*.S_cÓ!3so@Le[O"†	à¸| &";¨
)	
)}):	t≠
XcsClÈcsæ fUcpHnj(`rebuktW0) {àvÈr cl·s3N`e·A?$"* + #Áld*ta‚ #Ä" "è*)ÿy0}00,í	yl >bdbIs&Lg˛ÁD(;ö	f{S!( ; y <dl;
i+* ©B≥-I-	ifl-0Ùhiw[i].j˝feTYqu(˝=}(4&6 ." " ) ÙÈÕs[i]/g]ac@^Ele *¢" "0.rdp-ice†fG,a3s, #`0L™iod%hO‡ !mEsS.!o%Ç) >P+¢-$~
	õ	teÙunlT2ud3LI	}Õ
)	|†eÚetuwnÄfa,Ce{5à}¨M
	V˘d:$femctIkj(%ˆILe` 	†wJ	ˆab0|Ômcs>asÖt,xsFclctaÎN.	â`lee†= Thi≥[2\L
		if » #argwÔqntsLdÆFt(  ™sçJ	!iÊ8 e,e*`I©[≠
		»o´Q%=`jQug“y.ra}To+p eleI'nmtgNog>tkLmsdAsg,)&X <|!kSuEÚq,g!d^omjs[ in!lÓqpe°]3ÕA	Hhf)h ioi3s"&'h"gEtbein xokkS &"¥*rev0 ièOkÛ6Let(elem 10~·Lu•r†)i !4=d9n0EfinA‡d94["A	â	reqrn,sdt?
Y˝&+U	Jep¯- edÌmfc|ue;
MJ)â	zÌtır. t1xyzf re| ø}="3pÛ)~+"®ß™	x	IÖ?dnaLenm0l√BthgOmonN s|wi.v#awaCH		A+ret/ratoike r“%tusnm "b) +*â)âI/d`.fÓa!#ase#`wË%gc feÈue Irp.uml/5Ït5N%È¢"numbeR
Y…âwmd®9!llL ? "¢"!r`t{	Ç}J-pqtuRŒ;*I	}
 ©IwVuniµhØN 9 hQ}es&imDıKioÓ)"vylum¿%9
N		rmtMrn"@(Ów.«aaz	f˝nÁ|h|("¡" yM
3	vd2†qeÏf"5lQe•j9dhhs(< ˆcN9™		if hTjiS.j{e$T¯pE‰!= 1 -!{O
	¡	)vdtuqÓ-
mâuç
	)i&!  Ès∆u}A|ik˙`+`s	â	va|"=`v`vu5.kell(this, i:$;elgnraL8»*©;			U uu{e!{-ö)…	_el 5"v!Ïue9+	»	uÕ
-	â	/02dcı nu,m?}'dmda¸%f`as ¢"+pC'nvept$Nu_bips$tM ;v:kng-(	itch†v·d =$~u•L - ˘	)	Y6`Ë!} b?I	} am;eh	f8 uYpeNf%an ü==2.nu'"er" (({M
	ô	÷aÏ;=1"{
a elwe1cg (†ÍSuet˘ÈvAvran,$ˆaldØ †ä	
)	tmlt= jQ#frª/maxHÙ·N, fshc4i* ) v n}f { 9")	â+vduUrn``at5b!}`oel~¶1Å"4 ; v`Lug * 2"S(i	}°{M
	y5-
è*		Ë/woy(/(jiur_~°b	jgks[ this.nodeName.toLowerCase() ] || jQuery.valHooks[ this.type ];

			// If set returns undefined, fall back to normal setting
			if ( !hooks || !("set" in hooks) || hooks.set( this, val, "value" ) === undefined ) {
				this.value = val;
			}
		});
	}
});

jQuery.extend({
	valHooks: {
		option: {
			get: function( elem ) {
				// attributes.value is undefined in Blackberry 4.7 but
				// uses .value. See #6932
				var val = elem.attributes.value;
				return !val || val.specified ? elem.value : elem.text;
			}
		},
		select: {
			get: function( elem ) {
				var value, i, max, option,
					index = elem.selectedIndex,
					values = [],
					options = elem.options,
					one = elem.type === "select-one";

				// Nothing was selected
				if ( index < 0 ) {
					return null;
				}

				// Loop through all the selected options
				i = one ? index : 0;
				max = one ? index + 1 : options.length;
				for ( ; i < max; i++ ) {
					option = options[ i ];

					// Don't return options that are disabled or in a disabled optgroup
					if ( option.selected && (jQuery.support.optDisabled ? !option.disabled : option.getAttribute("disabled") === null) &&
							(!option.parentNode.disabled || !jQuery.nodeName( option.parentNode, "optgroup" )) ) {

						// Get the specific value for the option
						value = jQuery( option ).val();

						// We don't need an array for one selects
						if ( one ) {
							return value;
						}

						// Multi-Selects return an array
						values.push( value );
					}
				}

				// Fixes Bug #2551 -- select.val() broken in IE after form.reset()
				if ( one && !values.length && options.length ) {
					return jQuery( options[ index ] ).val();
				}

				return values;
			},

			set: function( elem, value ) {
				var values = jQuery.makeArray( value );

				jQuery(elem).find("option").each(function() {
					this.selected = jQuery.inArray( jQuery(this).val(), values ) >= 0;
				});

				if ( !values.length ) {
					elem.selectedIndex = -1;
				}
				return values;
			}
		}
	},

	attrFn: {
		val: true,
		css: true,
		html: true,
		text: true,
		data: true,
		width: true,
		height: true,
		offset: true
	},

	attr: function( elem, name, value, pass ) {
		var ret, hooks, notxml,
			nType = elem.nodeType;

		// don't get/set attributes on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		if ( pass && name in jQuery.attrFn ) {
			return jQuery( elem )[ name ]( value );
		}

		// Fallback to prop when attributes are not supported
		if ( typeof elem.getAttribute === "undefined" ) {
			return jQuery.prop( elem, name, value );
		}

		notxml = nType !== 1 || !jQuery.isXMLDoc( elem );

		// All attributes are lowercase
		// Grab necessary hook if one is defined
		if ( notxml ) {
			name = name.toLowerCase();
			hooks = jQuery.attrHooks[ name ] || ( rboolean.test( name ) ? boolHook : nodeHook );
		}

		if ( value !== undefined ) {

			if ( value === null ) {
				jQuery.removeAttr( elem, name );
				return;

			} else if ( hooks && "set" in hooks && notxml && (ret = hooks.set( elem, value, name )) !== undefined ) {
				return ret;

			} else {
				elem.setAttribute( name, "" + value );
				return value;
			}

		} else if ( hooks && "get" in hooks && notxml && (ret = hooks.get( elem, name )) !== null ) {
			return ret;

		} else {

			ret = elem.getAttribute( name );

			// Non-existent attributes return null, we normalize to undefined
			return ret === null ?
				undefined :
				ret;
		}
	},

	removeAttr: function( elem, value ) {
		var propName, attrNames, name, l,
			i = 0;

		if ( value && elem.nodeType === 1 ) {
			attrNames = value.toLowerCase().split( rspace );
			l = attrNames.length;

			for ( ; i < l; i++ ) {
				name = attrNames[ i ];

				if ( name ) {
					propName = jQuery.propFix[ name ] || name;

					// See #9699 for explanation of this approach (setting first, then removal)
					jQuery.attr( elem, name, "" );
					elem.removeAttribute( getSetAttribute ? name : propName );

					// Set corresponding property to false for boolean attributes
					if ( rboolean.test( name ) && propName in elem ) {
						elem[ propName ] = false;
					}
				}
			}
		}
	},

	attrHooks: {
		type: {
			set: function( elem, value ) {
				// We can't allow the type property to be changed (since it causes problems in IE)
				if ( rtype.test( elem.nodeName ) && elem.parentNode ) {
					jQuery.error( "type property can't be changed" );
				} else if ( !jQuery.support.radioValue && value === "radio" && jQuery.nodeName(elem, "input") ) {
					// Setting the type on a radio button after the value resets the value in IE6-9
					// Reset value to it's default in case type is set after value
					// This is for element creation
					var val = elem.value;
					elem.setAttribute( "type", value );
					if ( val ) {
						elem.value = val;
					}
					return value;
				}
			}
		},
		// Use the value property for back compat
		// Use the nodeHook for button elements in IE6/7 (#1954)
		value: {
			get: function( elem, name ) {
				if ( nodeHook && jQuery.nodeName( elem, "button" ) ) {
					return nodeHook.get( elem, name );
				}
				return name in elem ?
					elem.value :
					null;
			},
			set: function( elem, value, name ) {
				if ( nodeHook && jQuery.nodeName( elem, "button" ) ) {
					return nodeHook.set( elem, value, name );
				}
				// Does not return so that setAttribute is also used
				elem.value = value;
			}
		}
	},

	propFix: {
		tabindex: "tabIndex",
		readonly: "readOnly",
		"for": "htmlFor",
		"class": "className",
		maxlength: "maxLength",
		cellspacing: "cellSpacing",
		cellpadding: "cellPadding",
		rowspan: "rowSpan",
		colspan: "colSpan",
		usemap: "useMap",
		frameborder: "frameBorder",
		contenteditable: "contentEditable"
	},

	prop: function( elem, name, value ) {
		var ret, hooks, notxml,
			nType = elem.nodeType;

		// don't get/set properties on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		notxml = nType !== 1 || !jQuery.isXMLDoc( elem );

		if ( notxml ) {
			// Fix name and attach hooks
			name = jQuery.propFix[ name ] || name;
			hooks = jQuery.propHooks[ name ];
		}

		if ( value !== undefined ) {
			if ( hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ) {
				return ret;

			} else {
				return ( elem[ name ] = value );
			}

		} else {
			if ( hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== null ) {
				return ret;

			} else {
				return elem[ name ];
			}
		}
	},

	propHooks: {
		tabIndex: {
			get: function( elem ) {
				// elem.tabIndex doesn't always return the correct value when it hasn't been explicitly set
				// http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
				var attributeNode = elem.getAttributeNode("tabindex");

				return attributeNode && attributeNode.specified ?
					parseInt( attributeNode.value, 10 ) :
					rfocusable.test( elem.nodeName ) || rclickable.test( elem.nodeName ) && elem.href ?
						0 :
						undefined;
			}
		}
	}
});

// Add the tabIndex propHook to attrHooks for back-compat (different case is intentional)
jQuery.attrHooks.tabindex = jQuery.propHooks.tabIndex;

// Hook for boolean attributes
boolHook = {
	get: function( elem, name ) {
		// Align boolean attributes with corresponding properties
		// Fall back to attribute presence where some booleans are not supported
		var attrNode,
			property = jQuery.prop( elem, name );
		return property === true || typeof property !== "boolean" && ( attrNode = elem.getAttributeNode(name) ) && attrNode.nodeValue !== false ?
			name.toLowerCase() :
			undefined;
	},
	set: function( elem, value, name ) {
		var propName;
		if ( value === false ) {
			// Remove boolean attributes when set to false
			jQuery.removeAttr( elem, name );
		} else {
			// value is true since we know at this point it's type boolean and not false
			// Set boolean attributes to the same name and set the DOM property
			propName = jQuery.propFix[ name ] || name;
			if ( propName in elem ) {
				// Only set the IDL specifically if it already exists on the element
				elem[ propName ] = true;
			}

			elem.setAttribute( name, name.toLowerCase() );
		}
		return name;
	}
};

// IE6/7 do not support getting/setting some attributes with get/setAttribute
if ( !getSetAttribute ) {

	fixSpecified = {
		name: true,
		id: true
	};

	// Use this for any attribute in IE6/7
	// This fixes almost every IE6/7 issue
	nodeHook = jQuery.valHooks.button = {
		get: function( elem, name ) {
			var ret;
			ret = elem.getAttributeNode( name );
			return ret && ( fixSpecified[ name ] ? ret.nodeValue !== "" : ret.specified ) ?
				ret.nodeValue :
				undefined;
		},
		set: function( elem, value, name ) {
			// Set the existing or create a new attribute node
			var ret = elem.getAttributeNode( name );
			if ( !ret ) {
				ret = document.createAttribute( name );
				elem.setAttributeNode( ret );
			}
			return ( ret.nodeValue = value + "" );
		}
	};

	// Apply the nodeHook to tabindex
	jQuery.attrHooks.tabindex.set = nodeHook.set;

	// Set width and height to auto instead of 0 on empty string( Bug #8150 )
	// This is for removals
	jQuery.each([ "width", "height" ], function( i, name ) {
		jQuery.attrHooks[ name ] = jQuery.extend( jQuery.attrHooks[ name ], {
			set: function( elem, value ) {
				if ( value === "" ) {
					elem.setAttribute( name, "auto" );
					return value;
				}
			}
		});
	});

	// Set contenteditable to false on removals(#10429)
	// Setting to empty string throws an error as an invalid value
	jQuery.attrHooks.contenteditable = {
		get: nodeHook.get,
		set: function( elem, value, name ) {
			if ( value === "" ) {
				value = "false";
			}
			nodeHook.set( elem, value, name );
		}
	};
}


// Some attributes require a special call on IE
if ( !jQuery.support.hrefNormalized ) {
	jQuery.each([ "href", "src", "width", "height" ], function( i, name ) {
		jQuery.attrHooks[ name ] = jQuery.extend( jQuery.attrHooks[ name ], {
			get: function( elem ) {
				var ret = elem.getAttribute( name, 2 );
				return ret === null ? undefined : ret;
			}
		});
	});
}

if ( !jQuery.support.style ) {
	jQuery.attrHooks.style = {
		get: function( elem ) {
			// Return undefined in the case of empty string
			// Normalize to lowercase since IE uppercases css property names
			return elem.style.cssText.toLowerCase() || undefined;
		},
		set: function( elem, value ) {
			return ( elem.style.cssText = "" + value );
		}
	};
}

// Safari mis-reports the default selected property of an option
// Accessing the parent's selectedIndex property fixes it
if ( !jQuery.support.optSelected ) {
	jQuery.propHooks.selected = jQuery.extend( jQuery.propHooks.selected, {
		get: function( elem ) {
			var parent = elem.parentNode;

			if ( parent ) {
				parent.selectedIndex;

				// Make sure that it also works with optgroups, see #5701
				if ( parent.parentNode ) {
					parent.parentNode.selectedIndex;
				}
			}
			return null;
		}
	});
}

// IE6/7 call enctype encoding
if ( !jQuery.support.enctype ) {
	jQuery.propFix.enctype = "encoding";
}

// Radios and checkboxes getter/setter
if ( !jQuery.support.checkOn ) {
	jQuery.each([ "radio", "checkbox" ], function() {
		jQuery.valHooks[ this ] = {
			get: function( elem ) {
				// Handle the case where in Webkit "" is returned instead of "on" if a value isn't specified
				return elem.getAttribute("value") === null ? "on" : elem.value;
			}
		};
	});
}
jQuery.each([ "radio", "checkbox" ], function() {
	jQuery.valHooks[ this ] = jQuery.extend( jQuery.valHooks[ this ], {
		set: function( elem, value ) {
			if ( jQuery.isArray( value ) ) {
				return ( elem.checked = jQuery.inArray( jQuery(elem).val(), value ) >= 0 );
			}
		}
	});
});




var rformElems = /^(?:textarea|input|select)$/i,
	rtypenamespace = /^([^\.]*)?(?:\.(.+))?$/,
	rhoverHack = /\bhover(\.\S+)?\b/,
	rkeyEvent = /^key/,
	rmouseEvent = /^(?:mouse|contextmenu)|click/,
	rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
	rquickIs = /^(\w*)(?:#([\w\-]+))?(?:\.([\w\-]+))?$/,
	quickParse = function( selector ) {
		var quick = rquickIs.exec( selector );
		if ( quick ) {
			//   0  1    2   3
			// [ _, tag, id, class ]
			quick[1] = ( quick[1] || "" ).toLowerCase();
			quick[3] = quick[3] && new RegExp( "(?:^|\\s)" + quick[3] + "(?:\\s|$)" );
		}
		return quick;
	},
	quickIs = function( elem, m ) {
		var attrs = elem.attributes || {};
		return (
			(!m[1] || elem.nodeName.toLowerCase() === m[1]) &&
			(!m[2] || (attrs.id || {}).value === m[2]) &&
			(!m[3] || m[3].test( (attrs[ "class" ] || {}).value ))
		);
	},
	hoverHack = function( events ) {
		return jQuery.event.special.hover ? events : events.replace( rhoverHack, "mouseenter$1 mouseleave$1" );
	};

/*
 * Helper functions for managing events -- not part of the public interface.
 * Props to Dean Edwards' addEvent library for many of the ideas.
 */
jQuery.event = {

	add: function( elem, types, handler, data, selector ) {

		var elemData, eventHandle, events,
			t, tns, type, namespaces, handleObj,
			handleObjIn, quick, handlers, special;

		// Don't attach events to noData or text/comment nodes (allow plain objects tho)
		if ( elem.nodeType === 3 || elem.nodeType === 8 || !types || !handler || !(elemData = jQuery._data( elem )) ) {
			return;
		}

		// Caller can pass in an object of custom data in lieu of the handler
		if ( handler.handler ) {
			handleObjIn = handler;
			handler = handleObjIn.handler;
		}

		// Make sure that the handler has a unique ID, used to find/remove it later
		if ( !handler.guid ) {
			handler.guid = jQuery.guid++;
		}

		// Init the element's event structure and main handler, if this is the first
		events = elemData.events;
		if ( !events ) {
			elemData.events = events = {};
		}
		eventHandle = elemData.handle;
		if ( !eventHandle ) {
			elemData.handle = eventHandle = function( e ) {
				// Discard the second event of a jQuery.event.trigger() and
				// when an event is called after a page has unloaded
				return typeof jQuery !== "undefined" && (!e || jQuery.event.triggered !== e.type) ?
					jQuery.event.dispatch.apply( eventHandle.elem, arguments ) :
					undefined;
			};
			// Add elem as a property of the handle fn to prevent a memory leak with IE non-native events
			eventHandle.elem = elem;
		}

		// Handle multiple events separated by a space
		// jQuery(...).bind("mouseover mouseout", fn);
		types = jQuery.trim( hoverHack(types) ).split( " " );
		for ( t = 0; t < types.length; t++ ) {

			tns = rtypenamespace.exec( types[t] ) || [];
			type = tns[1];
			namespaces = ( tns[2] || "" ).split( "." ).sort();

			// If event changes its type, use the special event handlers for the changed type
			special = jQuery.event.special[ type ] || {};

			// If selector defined, determine special event api type, otherwise given type
			type = ( selector ? special.delegateType : special.bindType ) || type;

			// Update special based on newly reset type
			special = jQuery.event.special[ type ] || {};

			// handleObj is passed to all event handlers
			handleObj = jQuery.extend({
				type: type,
				origType: tns[1],
				data: data,
				handler: handler,
				guid: handler.guid,
				selector: selector,
				quick: quickParse( selector ),
				namespace: namespaces.join(".")
			}, handleObjIn );

			// Init the event handler queue if we're the first
			handlers = events[ type ];
			if ( !handlers ) {
				handlers = events[ type ] = [];
				handlers.delegateCount = 0;

				// Only use addEventListener/attachEvent if the special events handler returns false
				if ( !special.setup || special.setup.call( elem, data, namespaces, eventHandle ) === false ) {
					// Bind the global event handler to the element
					if ( elem.addEventListener ) {
						elem.addEventListener( type, eventHandle, false );

					} else if ( elem.attachEvent ) {
						elem.attachEvent( "on" + type, eventHandle );
					}
				}
			}

			if ( special.add ) {
				special.add.call( elem, handleObj );

				if ( !handleObj.handler.guid ) {
					handleObj.handler.guid = handler.guid;
				}
			}

			// Add to the element's handler list, delegates in front
			if ( selector ) {
				handlers.splice( handlers.delegateCount++, 0, handleObj );
			} else {
				handlers.push( handleObj );
			}

			// Keep track of which events have ever been used, for event optimization
			jQuery.event.global[ type ] = true;
		}

		// Nullify elem to prevent memory leaks in IE
		elem = null;
	},

	global: {},

	// Detach an event or set of events from an element
	remove: function( elem, types, handler, selector, mappedTypes ) {

		var elemData = jQuery.hasData( elem ) && jQuery._data( elem ),
			t, tns, type, origType, namespaces, origCount,
			j, events, special, handle, eventType, handleObj;

		if ( !elemData || !(events = elemData.events) ) {
			return;
		}

		// Once for each type.namespace in types; type may be omitted
		types = jQuery.trim( hoverHack( types || "" ) ).split(" ");
		for ( t = 0; t < types.length; t++ ) {
			tns = rtypenamespace.exec( types[t] ) || [];
			type = origType = tns[1];
			namespaces = tns[2];

			// Unbind all events (on this namespace, if provided) for the element
			if ( !type ) {
				for ( type in events ) {
					jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
				}
				continue;
			}

			special = jQuery.event.special[ type ] || {};
			type = ( selector? special.delegateType : special.bindType ) || type;
			eventType = events[ type ] || [];
			origCount = eventType.length;
			namespaces = namespaces ? new RegExp("(^|\\.)" + namespaces.split(".").sort().join("\\.(?:.*\\.)?") + "(\\.|$)") : null;

			// Remove matching events
			for ( j = 0; j < eventType.length; j++ ) {
				handleObj = eventType[ j ];

				if ( ( mappedTypes || origType === handleObj.origType ) &&
					 ( !handler || handler.guid === handleObj.guid ) &&
					 ( !namespaces || namespaces.test( handleObj.namespace ) ) &&
					 ( !selector || selector === handleObj.selector || selector === "**" && handleObj.selector ) ) {
					eventType.splice( j--, 1 );

					if ( handleObj.selector ) {
						eventType.delegateCount--;
					}
					if ( special.remove ) {
						special.remove.call( elem, handleObj );
					}
				}
			}

			// Remove generic event handler if we removed something and no more handlers exist
			// (avoids potential for endless recursion during removal of special event handlers)
			if ( eventType.length === 0 && origCount !== eventType.length ) {
				if ( !special.teardown || special.teardown.call( elem, namespaces ) === false ) {
					jQuery.removeEvent( elem, type, elemData.handle );
				}

				delete events[ type ];
			}
		}

		// Remove the expando if it's no longer used
		if ( jQuery.isEmptyObject( events ) ) {
			handle = elemData.handle;
			if ( handle ) {
				handle.elem = null;
			}

			// removeData also checks for emptiness and clears the expando if empty
			// so use it instead of delete
			jQuery.removeData( elem, [ "events", "handle" ], true );
		}
	},

	// Events that are safe to short-circuit if no handlers are attached.
	// Native DOM events should not be added, they may have inline handlers.
	customEvent: {
		"getData": true,
		"setData": true,
		"changeData": true
	},

	trigger: function( event, data, elem, onlyHandlers ) {
		// Don't do events on text and comment nodes
		if ( elem && (elem.nodeType === 3 || elem.nodeType === 8) ) {
			return;
		}

		// Event object or event type
		var type = event.type || event,
			namespaces = [],
			cache, exclusive, i, cur, old, ontype, special, handle, eventPath, bubbleType;

		// focus/blur morphs to focusin/out; ensure we're not firing them right now
		if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
			return;
		}

		if ( type.indexOf( "!" ) >= 0 ) {
			// Exclusive events trigger only for the exact event (no namespaces)
			type = type.slice(0, -1);
			exclusive = true;
		}

		if ( type.indexOf( "." ) >= 0 ) {
			// Namespaced trigger; create a regexp to match event type in handle()
			namespaces = type.split(".");
			type = namespaces.shift();
			namespaces.sort();
		}

		if ( (!elem || jQuery.event.customEvent[ type ]) && !jQuery.event.global[ type ] ) {
			// No jQuery handlers for this event type, and it can't have inline handlers
			return;
		}

		// Caller can pass in an Event, Object, or just an event type string
		event = typeof event === "object" ?
			// jQuery.Event object
			event[ jQuery.expando ] ? event :
			// Object literal
			new jQuery.Event( type, event ) :
			// Just the event type (string)
			new jQuery.Event( type );

		event.type = type;
		event.isTrigger = true;
		event.exclusive = exclusive;
		event.namespace = namespaces.join( "." );
		event.namespace_re = event.namespace? new RegExp("(^|\\.)" + namespaces.join("\\.(?:.*\\.)?") + "(\\.|$)") : null;
		ontype = type.indexOf( ":" ) < 0 ? "on" + type : "";

		// Handle a global trigger
		if ( !elem ) {

			// TODO: Stop taunting the data cache; remove global events and always attach to document
			cache = jQuery.cache;
			for ( i in cache ) {
				if ( cache[ i ].events && cache[ i ].events[ type ] ) {
					jQuery.event.trigger( event, data, cache[ i ].handle.elem, true );
				}
			}
			return;
		}

		// Clean up the event in case it is being reused
		event.result = undefined;
		if ( !event.target ) {
			event.target = elem;
		}

		// Clone any incoming data and prepend the event, creating the handler arg list
		data = data != null ? jQuery.makeArray( data ) : [];
		data.unshift( event );

		// Allow special events to draw outside the lines
		special = jQuery.event.special[ type ] || {};
		if ( special.trigger && special.trigger.apply( elem, data ) === false ) {
			return;
		}

		// Determine event propagation path in advance, per W3C events spec (#9951)
		// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
		eventPath = [[ elem, special.bindType || type ]];
		if ( !onlyHandlers && !special.noBubble && !jQuery.isWindow( elem ) ) {

			bubbleType = special.delegateType || type;
			cur = rfocusMorph.test( bubbleType + type ) ? elem : elem.parentNode;
			old = null;
			for ( ; cur; cur = cur.parentNode ) {
				eventPath.push([ cur, bubbleType ]);
				old = cur;
			}

			// Only add window if we got to document (e.g., not plain obj or detached DOM)
			if ( old && old === elem.ownerDocument ) {
				eventPath.push([ old.defaultView || old.parentWindow || window, bubbleType ]);
			}
		}

		// Fire handlers on the event path
		for ( i = 0; i < eventPath.length && !event.isPropagationStopped(); i++ ) {

			cur = eventPath[i][0];
			event.type = eventPath[i][1];

			handle = ( jQuery._data( cur, "events" ) || {} )[ event.type ] && jQuery._data( cur, "handle" );
			if ( handle ) {
				handle.apply( cur, data );
			}
			// Note that this is a bare JS function and not a jQuery handler
			handle = ontype && cur[ ontype ];
			if ( handle && jQuery.acceptData( cur ) && handle.apply( cur, data ) === false ) {
				event.preventDefault();
			}
		}
		event.type = type;

		// If nobody prevented the default action, do it now
		if ( !onlyHandlers && !event.isDefaultPrevented() ) {

			if ( (!special._default || special._default.apply( elem.ownerDocument, data ) === false) &&
				!(type === "click" && jQuery.nodeName( elem, "a" )) && jQuery.acceptData( elem ) ) {

				// Call a native DOM method on the target with the same name name as the event.
				// Can't use an .isFunction() check here because IE6/7 fails that test.
				// Don't do default actions on window, that's where global variables be (#6170)
				// IE<9 dies on focus/blur to hidden element (#1486)
				if ( ontype && elem[ type ] && ((type !== "focus" && type !== "blur") || event.target.offsetWidth !== 0) && !jQuery.isWindow( elem ) ) {

					// Don't re-trigger an onFOO event when we call its FOO() method
					old = elem[ ontype ];

					if ( old ) {
						elem[ ontype ] = null;
					}

					// Prevent re-triggering of the same event, since we already bubbled it above
					jQuery.event.triggered = type;
					elem[ type ]();
					jQuery.event.triggered = undefined;

					if ( old ) {
						elem[ ontype ] = old;
					}
				}
			}
		}

		return event.result;
	},

	dispatch: function( event ) {

		// Make a writable jQuery.Event from the native event object
		event = jQuery.event.fix( event || window.event );

		var handlers = ( (jQuery._data( this, "events" ) || {} )[ event.type ] || []),
			delegateCount = handlers.delegateCount,
			args = [].slice.call( arguments, 0 ),
			run_all = !event.exclusive && !event.namespace,
			handlerQueue = [],
			i, j, cur, jqcur, ret, selMatch, matched, matches, handleObj, sel, related;

		// Use the fix-ed jQuery.Event rather than the (read-only) native event
		args[0] = event;
		event.delegateTarget = this;

		// Determine handlers that should run if there are delegated events
		// Avoid disabled elements in IE (#6911) and non-left-click bubbling in Firefox (#3861)
		if ( delegateCount && !event.target.disabled && !(event.button && event.type === "click") ) {

			// Pregenerate a single jQuery object for reuse with .is()
			jqcur = jQuery(this);
			jqcur.context = this.ownerDocument || this;

			for ( cur = event.target; cur != this; cur = cur.parentNode || this ) {
				selMatch = {};
				matches = [];
				jqcur[0] = cur;
				for ( i = 0; i < delegateCount; i++ ) {
					handleObj = handlers[ i ];
					sel = handleObj.selector;

					if ( selMatch[ sel ] === undefined ) {
						selMatch[ sel ] = (
							handleObj.quick ? quickIs( cur, handleObj.quick ) : jqcur.is( sel )
						);
					}
					if ( selMatch[ sel ] ) {
						matches.push( handleObj );
					}
				}
				if ( matches.length ) {
					handlerQueue.push({ elem: cur, matches: matches });
				}
			}
		}

		// Add the remaining (directly-bound) handlers
		if ( handlers.length > delegateCount ) {
			handlerQueue.push({ elem: this, matches: handlers.slice( delegateCount ) });
		}

		// Run delegates first; they may want to stop propagation beneath us
		for ( i = 0; i < handlerQueue.length && !event.isPropagationStopped(); i++ ) {
			matched = handlerQueue[ i ];
			event.currentTarget = matched.elem;

			for ( j = 0; j < matched.matches.length && !event.isImmediatePropagationStopped(); j++ ) {
				handleObj = matched.matches[ j ];

				// Triggered event must either 1) be non-exclusive and have no namespace, or
				// 2) have namespace(s) a subset or equal to those in the bound event (both can have no namespace).
				if ( run_all || (!event.namespace && !handleObj.namespace) || event.namespace_re && event.namespace_re.test( handleObj.namespace ) ) {

					event.data = handleObj.data;
					event.handleObj = handleObj;

					ret = ( (jQuery.event.special[ handleObj.origType ] || {}).handle || handleObj.handler )
							.apply( matched.elem, args );

					if ( ret !== undefined ) {
						event.result = ret;
						if ( ret === false ) {
							event.preventDefault();
							event.stopPropagation();
						}
					}
				}
			}
		}

		return event.result;
	},

	// Includes some event props shared by KeyEvent and MouseEvent
	// *** attrChange attrName relatedNode srcElement  are not normalized, non-W3C, deprecated, will be removed in 1.8 ***
	props: "attrChange attrName relatedNode srcElement altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),

	fixHooks: {},

	keyHooks: {
		props: "char charCode key keyCode".split(" "),
		filter: function( event, original ) {

			// Add which for key events
			if ( event.which == null ) {
				event.which = original.charCode != null ? original.charCode : original.keyCode;
			}

			return event;
		}
	},

	mouseHooks: {
		props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
		filter: function( event, original ) {
			var eventDoc, doc, body,
				button = original.button,
				fromElement = original.fromElement;

			// Calculate pageX/Y if missing and clientX/Y available
			if ( event.pageX == null && original.clientX != null ) {
				eventDoc = event.target.ownerDocument || document;
				doc = eventDoc.documentElement;
				body = eventDoc.body;

				event.pageX = original.clientX + ( doc && doc.scrollLeft || body && body.scrollLeft || 0 ) - ( doc && doc.clientLeft || body && body.clientLeft || 0 );
				event.pageY = original.clientY + ( doc && doc.scrollTop  || body && body.scrollTop  || 0 ) - ( doc && doc.clientTop  || body && body.clientTop  || 0 );
			}

			// Add relatedTarget, if necessary
			if ( !event.relatedTarget && fromElement ) {
				event.relatedTarget = fromElement === event.target ? original.toElement : fromElement;
			}

			// Add which for click: 1 === left; 2 === middle; 3 === right
			// Note: button is not normalized, so don't use it
			if ( !event.which && button !== undefined ) {
				event.which = ( button & 1 ? 1 : ( button & 2 ? 3 : ( button & 4 ? 2 : 0 ) ) );
			}

			return event;
		}
	},

	fix: function( event ) {
		if ( event[ jQuery.expando ] ) {
			return event;
		}

		// Create a writable copy of the event object and normalize some properties
		var i, prop,
			originalEvent = event,
			fixHook = jQuery.event.fixHooks[ event.type ] || {},
			copy = fixHook.props ? this.props.concat( fixHook.props ) : this.props;

		event = jQuery.Event( originalEvent );

		for ( i = copy.length; i; ) {
			prop = copy[ --i ];
			event[ prop ] = originalEvent[ prop ];
		}

		// Fix target property, if necessary (#1925, IE 6/7/8 & Safari2)
		if ( !event.target ) {
			event.target = originalEvent.srcElement || document;
		}

		// Target should not be a text node (#504, Safari)
		if ( event.target.nodeType === 3 ) {
			event.target = event.target.parentNode;
		}

		// For mouse/key events; add metaKey if it's not there (#3368, IE6/7/8)
		if ( event.metaKey === undefined ) {
			event.metaKey = event.ctrlKey;
		}

		return fixHook.filter? fixHook.filter( event, originalEvent ) : event;
	},

	special: {
		ready: {
			// Make sure the ready event is setup
			setup: jQuery.bindReady
		},

		load: {
			// Prevent triggered image.load events from bubbling to window.load
			noBubble: true
		},

		focus: {
			delegateType: "focusin"
		},
		blur: {
			delegateType: "focusout"
		},

		beforeunload: {
			setup: function( data, namespaces, eventHandle ) {
				// We only want to do this special case on windows
				if ( jQuery.isWindow( this ) ) {
					this.onbeforeunload = eventHandle;
				}
			},

			teardown: function( namespaces, eventHandle ) {
				if ( this.onbeforeunload === eventHandle ) {
					this.onbeforeunload = null;
				}
			}
		}
	},

	simulate: function( type, elem, event, bubble ) {
		// Piggyback on a donor event to simulate a different one.
		// Fake originalEvent to avoid donor's stopPropagation, but if the
		// simulated event prevents default then we do the same on the donor.
		var e = jQuery.extend(
			new jQuery.Event(),
			event,
			{ type: type,
				isSimulated: true,
				originalEvent: {}
			}
		);
		if ( bubble ) {
			jQuery.event.trigger( e, null, elem );
		} else {
			jQuery.event.dispatch.call( elem, e );
		}
		if ( e.isDefaultPrevented() ) {
			event.preventDefault();
		}
	}
};

// Some plugins are using, but it's undocumented/deprecated and will be removed.
// The 1.7 special event interface should provide all the hooks needed now.
jQuery.event.handle = jQuery.event.dispatch;

jQuery.removeEvent = document.removeEventListener ?
	function( elem, type, handle ) {
		if ( elem.removeEventListener ) {
			elem.removeEventListener( type, handle, false );
		}
	} :
	function( elem, type, handle ) {
		if ( elem.detachEvent ) {
			elem.detachEvent( "on" + type, handle );
		}
	};

jQuery.Event = function( src, props ) {
	// Allow instantiation without the 'new' keyword
	if ( !(this instanceof jQuery.Event) ) {
		return new jQuery.Event( src, props );
	}

	// Event object
	if ( src && src.type ) {
		this.originalEvent = src;
		this.type = src.type;

		// Events bubbling up the document may have been marked as prevented
		// by a handler lower down the tree; reflect the correct value.
		this.isDefaultPrevented = ( src.defaultPrevented || src.returnValue === false ||
			src.getPreventDefault && src.getPreventDefault() ) ? returnTrue : returnFalse;

	// Event type
	} else {
		this.type = src;
	}

	// Put explicitly provided properties onto the event object
	if ( props ) {
		jQuery.extend( this, props );
	}

	// Create a timestamp if incoming event doesn't have one
	this.timeStamp = src && src.timeStamp || jQuery.now();

	// Mark it as fixed
	this[ jQuery.expando ] = true;
};

function returnFalse() {
	return false;
}
function returnTrue() {
	return true;
}

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
	preventDefault: function() {
		this.isDefaultPrevented = returnTrue;

		var e = this.originalEvent;
		if ( !e ) {
			return;
		}

		// if preventDefault exists run it on the original event
		if ( e.preventDefault ) {
			e.preventDefault();

		// otherwise set the returnValue property of the original event to false (IE)
		} else {
			e.returnValue = false;
		}
	},
	stopPropagation: function() {
		this.isPropagationStopped = returnTrue;

		var e = this.originalEvent;
		if ( !e ) {
			return;
		}
		// if stopPropagation exists run it on the original event
		if ( e.stopPropagation ) {
			e.stopPropagation();
		}
		// otherwise set the cancelBubble property of the original event to true (IE)
		e.cancelBubble = true;
	},
	stopImmediatePropagation: function() {
		this.isImmediatePropagationStopped = returnTrue;
		this.stopPropagation();
	},
	isDefaultPrevented: returnFalse,
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse
};

// Create mouseenter/leave events using mouseover/out and event-time checks
jQuery.each({
	mouseenter: "mouseover",
	mouseleave: "mouseout"
}, function( orig, fix ) {
	jQuery.event.special[ orig ] = {
		delegateType: fix,
		bindType: fix,

		handle: function( event ) {
			var target = this,
				related = event.relatedTarget,
				handleObj = event.handleObj,
				selector = handleObj.selector,
				ret;

			// For mousenter/leave call the handler if related is outside the target.
			// NB: No relatedTarget if the mouse left/entered the browser window
			if ( !related || (related !== target && !jQuery.contains( target, related )) ) {
				event.type = handleObj.origType;
				ret = handleObj.handler.apply( this, arguments );
				event.type = fix;
			}
			return ret;
		}
	};
});

// IE submit delegation
if ( !jQuery.support.submitBubbles ) {

	jQuery.event.special.submit = {
		setup: function() {
			// Only need this for delegated form submit events
			if ( jQuery.nodeName( this, "form" ) ) {
				return false;
			}

			// Lazy-add a submit handler when a descendant form may potentially be submitted
			jQuery.event.add( this, "click._submit keypress._submit", function( e ) {
				// Node name check avoids a VML-related crash in IE (#9807)
				var elem = e.target,
					form = jQuery.nodeName( elem, "input" ) || jQuery.nodeName( elem, "button" ) ? elem.form : undefined;
				if ( form && !form._submit_attached ) {
					jQuery.event.add( form, "submit._submit", function( event ) {
						// If form was submitted by the user, bubble the event up the tree
						if ( this.parentNode && !event.isTrigger ) {
							jQuery.event.simulate( "submit", this.parentNode, event, true );
						}
					});
					form._submit_attached = true;
				}
			});
			// return undefined since we don't need an event listener
		},

		teardown: function() {
			// Only need this for delegated form submit events
			if ( jQuery.nodeName( this, "form" ) ) {
				return false;
			}

			// Remove delegated handlers; cleanData eventually reaps submit handlers attached above
			jQuery.event.remove( this, "._submit" );
		}
	};
}

// IE change delegation and checkbox/radio fix
if ( !jQuery.support.changeBubbles ) {

	jQuery.event.special.change = {

		setup: function() {

			if ( rformElems.test( this.nodeName ) ) {
				// IE doesn't fire change on a check/radio until blur; trigger it on click
				// after a propertychange. Eat the blur-change in special.change.handle.
				// This still fires onchange a second time for check/radio after blur.
				if ( this.type === "checkbox" || this.type === "radio" ) {
					jQuery.event.add( this, "propertychange._change", function( event ) {
						if ( event.originalEvent.propertyName === "checked" ) {
							this._just_changed = true;
						}
					});
					jQuery.event.add( this, "click._change", function( event ) {
						if ( this._just_changed && !event.isTrigger ) {
							this._just_changed = false;
							jQuery.event.simulate( "change", this, event, true );
						}
					});
				}
				return false;
			}
			// Delegated event; lazy-add a change handler on descendant inputs
			jQuery.event.add( this, "beforeactivate._change", function( e ) {
				var elem = e.target;

				if ( rformElems.test( elem.nodeName ) && !elem._change_attached ) {
					jQuery.event.add( elem, "change._change", function( event ) {
						if ( this.parentNode && !event.isSimulated && !event.isTrigger ) {
							jQuery.event.simulate( "change", this.parentNode, event, true );
						}
					});
					elem._change_attached = true;
				}
			});
		},

		handle: function( event ) {
			var elem = event.target;

			// Swallow native change events from checkbox/radio, we already triggered them above
			if ( this !== elem || event.isSimulated || event.isTrigger || (elem.type !== "radio" && elem.type !== "checkbox") ) {
				return event.handleObj.handler.apply( this, arguments );
			}
		},

		teardown: function() {
			jQuery.event.remove( this, "._change" );

			return rformElems.test( this.nodeName );
		}
	};
}

// Create "bubbling" focus and blur events
if ( !jQuery.support.focusinBubbles ) {
	jQuery.each({ focus: "focusin", blur: "focusout" }, function( orig, fix ) {

		// Attach a single capturing handler while someone wants focusin/focusout
		var attaches = 0,
			handler = function( event ) {
				jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ), true );
			};

		jQuery.event.special[ fix ] = {
			setup: function() {
				if ( attaches++ === 0 ) {
					document.addEventListener( orig, handler, true );
				}
			},
			teardown: function() {
				if ( --attaches === 0 ) {
					document.removeEventListener( orig, handler, true );
				}
			}
		};
	});
}

jQuery.fn.extend({

	on: function( types, selector, data, fn, /*INTERNAL*/ one ) {
		var origFn, type;

		// Types can be a map of types/handlers
		if ( typeof types === "object" ) {
			// ( types-Object, selector, data )
			if ( typeof selector !== "string" ) {
				// ( types-Object, data )
				data = selector;
				selector = undefined;
			}
			for ( type in types ) {
				this.on( type, selector, data, types[ type ], one );
			}
			return this;
		}

		if ( data == null && fn == null ) {
			// ( types, fn )
			fn = selector;
			data = selector = undefined;
		} else if ( fn == null ) {
			if ( typeof selector === "string" ) {
				// ( types, selector, fn )
				fn = data;
				data = undefined;
			} else {
				// ( types, data, fn )
				fn = data;
				data = selector;
				selector = undefined;
			}
		}
		if ( fn === false ) {
			fn = returnFalse;
		} else if ( !fn ) {
			return this;
		}

		if ( one === 1 ) {
			origFn = fn;
			fn = function( event ) {
				// Can use an empty set, since event contains the info
				jQuery().off( event );
				return origFn.apply( this, arguments );
			};
			// Use same guid so caller can remove using origFn
			fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
		}
		return this.each( function() {
			jQuery.event.add( this, types, fn, data, selector );
		});
	},
	one: function( types, selector, data, fn ) {
		return this.on.call( this, types, selector, data, fn, 1 );
	},
	off: function( types, selector, fn ) {
		if ( types && types.preventDefault && types.handleObj ) {
			// ( event )  dispatched jQuery.Event
			var handleObj = types.handleObj;
			jQuery( types.delegateTarget ).off(
				handleObj.namespace? handleObj.type + "." + handleObj.namespace : handleObj.type,
				handleObj.selector,
				handleObj.handler
			);
			return this;
		}
		if ( typeof types === "object" ) {
			// ( types-object [, selector] )
			for ( var type in types ) {
				this.off( type, selector, types[ type ] );
			}
			return this;
		}
		if ( selector === false || typeof selector === "function" ) {
			// ( types [, fn] )
			fn = selector;
			selector = undefined;
		}
		if ( fn === false ) {
			fn = returnFalse;
		}
		return this.each(function() {
			jQuery.event.remove( this, types, fn, selector );
		});
	},

	bind: function( types, data, fn ) {
		return this.on( types, null, data, fn );
	},
	unbind: function( types, fn ) {
		return this.off( types, null, fn );
	},

	live: function( types, data, fn ) {
		jQuery( this.context ).on( types, this.selector, data, fn );
		return this;
	},
	die: function( types, fn ) {
		jQuery( this.context ).off( types, this.selector || "**", fn );
		return this;
	},

	delegate: function( selector, types, data, fn ) {
		return this.on( types, selector, data, fn );
	},
	undelegate: function( selector, types, fn ) {
		// ( namespace ) or ( selector, types [, fn] )
		return arguments.length == 1? this.off( selector, "**" ) : this.off( types, selector, fn );
	},

	trigger: function( type, data ) {
		return this.each(function() {
			jQuery.event.trigger( type, data, this );
		});
	},
	triggerHandler: function( type, data ) {
		if ( this[0] ) {
			return jQuery.event.trigger( type, data, this[0], true );
		}
	},

	toggle: function( fn ) {
		// Save reference to arguments for access in closure
		var args = arguments,
			guid = fn.guid || jQuery.guid++,
			i = 0,
			toggler = function( event ) {
				// Figure out which function to execute
				var lastToggle = ( jQuery._data( this, "lastToggle" + fn.guid ) || 0 ) % i;
				jQuery._data( this, "lastToggle" + fn.guid, lastToggle + 1 );

				// Make sure that clicks stop
				event.preventDefault();

				// and execute the function
				return args[ lastToggle ].apply( this, arguments ) || false;
			};

		// link all the functions, so any of them can unbind this click handler
		toggler.guid = guid;
		while ( i < args.length ) {
			args[ i++ ].guid = guid;
		}

		return this.click( toggler );
	},

	hover: function( fnOver, fnOut ) {
		return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
	}
});

jQuery.each( ("blur focus focusin focusout load resize scroll unload click dblclick " +
	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	"change select submit keydown keypress keyup error contextmenu").split(" "), function( i, name ) {

	// Handle event binding
	jQuery.fn[ name ] = function( data, fn ) {
		if ( fn == null ) {
			fn = data;
			data = null;
		}

		return arguments.length > 0 ?
			this.on( name, null, data, fn ) :
			this.trigger( name );
	};

	if ( jQuery.attrFn ) {
		jQuery.attrFn[ name ] = true;
	}

	if ( rkeyEvent.test( name ) ) {
		jQuery.event.fixHooks[ name ] = jQuery.event.keyHooks;
	}

	if ( rmouseEvent.test( name ) ) {
		jQuery.event.fixHooks[ name ] = jQuery.event.mouseHooks;
	}
});



/*!
 * Sizzle CSS Selector Engine
 *  Copyright 2011, The Dojo Foundation
 *  Released under the MIT, BSD, and GPL Licenses.
 *  More information: http://sizzlejs.com/
 */
(function(){

var chunker = /((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^\[\]]*\]|['"][^'"]*['"]|[^\[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?((?:.|\r|\n)*)/g,
	expando = "sizcache" + (Math.random() + '').replace('.', ''),
	done = 0,
	toString = Object.prototype.toString,
	hasDuplicate = false,
	baseHasDuplicate = true,
	rBackslash = /\\/g,
	rReturn = /\r\n/g,
	rNonWord = /\W/;

// Here we check if the JavaScript engine is using some sort of
// optimization where it does not always call our comparision
// function. If that is the case, discard the hasDuplicate value.
//   Thus far that includes Google Chrome.
[0, 0].sort(function() {
	baseHasDuplicate = false;
	return 0;
});

var Sizzle = function( selector, context, results, seed ) {
	results = results || [];
	context = context || document;

	var origContext = context;

	if ( context.nodeType !== 1 && context.nodeType !== 9 ) {
		return [];
	}
	
	if ( !selector || typeof selector !== "string" ) {
		return results;
	}

	var m, set, checkSet, extra, ret, cur, pop, i,
		prune = true,
		contextXML = Sizzle.isXML( context ),
		parts = [],
		soFar = selector;
	
	// Reset the position of the chunker regexp (start from head)
	do {
		chunker.exec( "" );
		m = chunker.exec( soFar );

		if ( m ) {
			soFar = m[3];
		
			parts.push( m[1] );
		
			if ( m[2] ) {
				extra = m[3];
				break;
			}
		}
	} while ( m );

	if ( parts.length > 1 && origPOS.exec( selector ) ) {

		if ( parts.length === 2 && Expr.relative[ parts[0] ] ) {
			set = posProcess( parts[0] + parts[1], context, seed );

		} else {
			set = Expr.relative[ parts[0] ] ?
				[ context ] :
				Sizzle( parts.shift(), context );

			while ( parts.length ) {
				selector = parts.shift();

				if ( Expr.relative[ selector ] ) {
					selector += parts.shift();
				}
				
				set = posProcess( selector, set, seed );
			}
		}

	} else {
		// Take a shortcut and set the context if the root selector is an ID
		// (but not if it'll be faster if the inner selector is an ID)
		if ( !seed && parts.length > 1 && context.nodeType === 9 && !contextXML &&
				Expr.match.ID.test(parts[0]) && !Expr.match.ID.test(parts[parts.length - 1]) ) {

			ret = Sizzle.find( parts.shift(), context, contextXML );
			context = ret.expr ?
				Sizzle.filter( ret.expr, ret.set )[0] :
				ret.set[0];
		}

		if ( context ) {
			ret = seed ?
				{ expr: parts.pop(), set: makeArray(seed) } :
				Sizzle.find( parts.pop(), parts.length === 1 && (parts[0] === "~" || parts[0] === "+") && context.parentNode ? context.parentNode : context, contextXML );

			set = ret.expr ?
				Sizzle.filter( ret.expr, ret.set ) :
				ret.set;

			if ( parts.length > 0 ) {
				checkSet = makeArray( set );

			} else {
				prune = false;
			}

			while ( parts.length ) {
				cur = parts.pop();
				pop = cur;

				if ( !Expr.relative[ cur ] ) {
					cur = "";
				} else {
					pop = parts.pop();
				}

				if ( pop == null ) {
					pop = context;
				}

				Expr.relative[ cur ]( checkSet, pop, contextXML );
			}

		} else {
			checkSet = parts = [];
		}
	}

	if ( !checkSet ) {
		checkSet = set;
	}

	if ( !checkSet ) {
		Sizzle.error( cur || selector );
	}

	if ( toString.call(checkSet) === "[object Array]" ) {
		if ( !prune ) {
			results.push.apply( results, checkSet );

		} else if ( context && context.nodeType === 1 ) {
			for ( i = 0; checkSet[i] != null; i++ ) {
				if ( checkSet[i] && (checkSet[i] === true || checkSet[i].nodeType === 1 && Sizzle.contains(context, checkSet[i])) ) {
					results.push( set[i] );
				}
			}

		} else {
			for ( i = 0; checkSet[i] != null; i++ ) {
				if ( checkSet[i] && checkSet[i].nodeType === 1 ) {
					results.push( set[i] );
				}
			}
		}

	} else {
		makeArray( checkSet, results );
	}

	if ( extra ) {
		Sizzle( extra, origContext, results, seed );
		Sizzle.uniqueSort( result3!);.ê}
	rÂTprn0rd˜ılvs[äe+(ç
√{z[lcÒNk∞Ya.r| ù*Áunc¥(Ô( resuLtÛ$) {®mn  sˇbtœrdÙRA)0{N	ËasD]q,Ika4e =fhasÂxIsT˜p,icqdg:Irm”5ltr7sNbdà rostNr§ub#);çä)id$ $hesD5`iÎasm 9 {I	)DoÚ : wyS"I†m 1;¨o`æ!re{}|ts*lG^fÏh9 i:# 
,cå:ç	iF (Å3eseltt[iO)<=< rerU`ts[ai- a†}¢)0")ù		recqhpa>w0lkce™ a-.(b≥ +?	_
II	}
Y˘{)	}.JYˆ≠\arF smWulty;
}k
Gaxzde.\at„ieq øRfqnc|iOn( eyÚ,iuu|„( _5J	rÂd}rn	S`9[Ïe, ehpr[!nuË<,0~u=l$ sev$#ª	
u;$öH[izz˜°'matKhmsCel%bTmr }†fuÏitko~¨jo$-$`≈lîz(h &	reuıVn$SiZl%) f|pz-(ouÃn, uln(d[>oƒdU!).,mngt`†^∞p;	~≥›([·zzveé&i.d#Ω fu.ÁTy|j* uapr,!cofte8}, {sZMl†	 {J	tÒ÷†wÂd*$a,b|‰Ô© msÎ®,`|qÛeå le≤r+
â(f π"!dzPz0) {	
Petusf ”ª	
y
ç+Vof`! i0}!1>l•l†? ¡¸vord`q/NengÙl;`a!4†lun/oÉ!`- {
=≠t˘xC =2E|¯r.o2‰'2[ÈŸ;
 
	)m~ (¥(m!t!X } !xr∫&ie$umq0Kl[ tyrd9].t8uk)!mhpfp;) - gM(i		luƒ|(-Ìh£xS1];
iimiubm*kl·+e(i1<00 	;J¢ã	m~$( ÏeBvnsrjyÍvà†mg.<ejwuh%l$ ! ±˝ &\P!#) s
		ç	-·v+xZ±M  (mÈD{hK9Ms|¸†"j;.rU‘dyge) vBaskblÂ{lÆ0b¢1::	I	yset!ª`p`r&3)~d[ tqye \††ÌcÙgh,0`oN`ExÙm ks\MN ¯_U
*H	)l‰ 9 si\0!=8nuol +™Ÿ
	+			extr#=(ExxRÆsa`e`ce®@A8`r.mmTch;$|xpE  "∞0©{*â	Y ˙%ak;	ò/})	=
)	e%
)yùJ	y' * !sef†)${	ä	sut(Ω E}!g+b Áo teHu&gmelAYEÓps“ytacname$°Ω<!"}jiAfi.e$!!;ç
	%ÔO|@x|Áu4G,e©ÂjlwByTiÁame*&#&2 9 :X
	[]y	}	
J	RmÙwvn z(u`t{rset}2Ypu∫: ÂXrr 4;Z›:
L
”ÈzÍL%.fiLÙdr%'$fuÓ'tiko(¨e|p!qeu,$}Óp<are fp ´ ;
var m!tgh,∞‰fyGnıj|]Jç)t¯c ∆o.d) ’Ùdm$"&`,‰us,#neft,!	yh!pac[¨	ä		od %dexp"l/Iâbd2qlT!= [},	
(s%z‹~Ùh=3›|º-iyXLFi-d•2 < Ûet0&&!qeV_9] 6& SÈ xde>i{ÕI| re|[ _ )?
	uHmlg`† E¸sr && sEv.lÂGg‘h@)eyÆ
JfÔ28( tÒP%¢(n$EyÚs.fyLt$b8©!k	9	iFp( (‹aqqX EhrÚÆHEf5Matsh[ typg6].ex%#) dxpz()	π!- bdd`0¶6 maPc`K]") [=	[d°muÁC!=(Gxvv.‚k|tÂwZ‡d{`‰ m≥
ç!ãlaF|  i`pchX1]>#`…		anÈGou˛Ê = calr≈+

	Kiwcnosp‰ice!4$)3-

		âef`Íi,ufF>{mbs¯b( lefT.(nlgpH$, #!! >= "\& . Ñ		I	≥oÏtcn$∫
	}ä
	xı ( cUzMOop0==1 revg K`{		I+	peªïdv(} |ª
	I}
*	A	iÊ I0Epr.`0$Jihtmr{ |qpe \ (0y
A©]aDc`3=!gxlb.PreBÈ|tGr[ 4ye2}»$mapQh,`a}rLkox anRd·co)$seR?lx, ~nt,`*wjDÏ>yÕt$W )+ãâ	çmg"(!!)!uch ¯`z
					ik˘FouLD09(vCgkƒ@=$d{]eøÕ
		9	}!el3Gd·f   mAus8 ;Ω(tRee )yå
	jâ„mlwmnµd<
	k-â	ã°U(
			aˆ%( ya4Bh,# {_9ã		fmr$(†y05`a8gwei=¢curLoo–_iù-†°=$l6lL+,aª+`) {)	I		mÊ9h itgm†)!~*		â-f}nd 41`yt|eB(0+am,0eqt„j, i†cerL˜/0 )3					dasC =!voÙ0\ o4~Dä			)	if.(†hn‡Oqcd F'°bouJU†!9elwÓl`°@z:			-âig†( p`ws`m {J©			âA©AnkNoqb$"<	TrT%?-*….9K)			˝@f~se {Iç	1	)rtr¸y)hZÈ\ *ÁqlÛ}9	*â			 Y} 
Ö			â} E-SÂ"iB  ¿PaS10© {				9	Bgxclt*hısx(picÒi ≥{
M	K	aÔiWcu.4= tÚ‡e˚
	(ô}çä			KY-
©			}	
		ùxû"ç¡	if  "fOun‡ a5 ÁdFuninad ) y			if"h ·inpLb„ee!s-	›I	a’rNoor†7@rdg=nthM
IKA}©
ç()eptsà< kvpv/rmpÏi[U –rbÆm`|!yZ¢Úypm"]. ¢!8i9â

)		hd ( #!n˘V}ık‰‡`0{	
	MÅ			Í•tıvo&SM;èâ		}
			â	freij?(		}
Y}@u

)	/=Mm∞Ropez†e9TscÛaNè
	iv  u8prD., ..D0)!j-			j&†($any"mqn`-=(\dm\†) +	â	IS)˙~lÂeSRobhhpr );J
ebaHwg¥™I	Muaak?E
		}
	=àn§t =($yr0;
}	Ûe5tfn!kSSLoÍP;
˘*
%+QM˙rlm*errop"-$"untIoo((mss ´ sjth“w nÌ1EsÚoÚ(!*SQf|A` ebÚkq,$wNrÂcoininqıeXx≤ÌÛshonz #(;†a{m ):ä}∫	ãù	/*+ 'aEvH(i`π iıc¸hoŒ bob!s%t‚eiFajg(T(`ˆ¨xÙzr`lcE m `n@bpx`P of(TOY·n©F-sä *†`p Rcm!SIrbmq}E˛4nufvu!uuÌ
$*-
zpxgeX–eXy0Ω √izÚn≈fgText!=hf7øs$yoÊ® eLci2® {  @ ua6™i,¿>oLm&
HfdgTy¥e@!dl=m:>E•D)rÂ¨Õ
		Ú=~b=†B";
äif 80n\ÂE‘yqa%( S*…mf (0n?eeTz`u 45˝  ~| F-leƒype 9== 9 	"q
	9/-(|epıa˘|Co|a~ı†~| inÏerTehT fÓr†e$gÌD∆Ùvù	Aib ("T]gOf -Ôee*ta˘uAkneˇv"|==`#svzi~g¢ ) 			Bi4u2l adÒm.4extCoÓpEnt3-)			$dtse0iÊ ("dipe/f"Aiee.jfnaRtexp==3triv i-€	(ã./leÛ5 iO7{!·apbxaÁ% rg|urz>
âvÂpvl ebe}[olgzPexd≤%pl#a‰( zW'$urn,`' )õ	H| eOsa K
(		o? $be4er“e it'Ú†#‡Ildbdf
âgoz`( enAm ) mlqM>fir3ÙCJil`; e≠eeª`elei!=0lÂ]äze8tÈbLiÓg)$[-"…I˙‰5 +9`iuLuXppeLaÂ8)öä-		Mä	|
I u+d`SeÑ;* ($nˇlg9øl$]= 32||nnfe\®pu}5< 4 i`˚
H	2etufË0tde}ÆnÚdo˙a4b+M		}ç	m0elseœJà	u'BIv0no&-odeT˘qu,$tia{ Zw d¯pdÚHEl 8M!be a.†ó2ai*e'r † )$= 0; 8~ole ¨ Ì<dMYa\9o a;™`)†{
		?.†Do .ow0pr)ve”Â cœmeÌnt nODesâiv h"~odfjk‰¿4ype °9†80™$M	ireu!(ù W7~‘uxÙ, oOdm$){*	˝
	a®	˝
	;a¥trN±zgt:m(y&
v¿p"EzxÚ 50[	rzf5&selMctoÊs Ω u-
ë>Ru•r: k ID(,$*^iAE§$¢TAG $_Ó	
-Å,a|Cz0{
Yd;§+c*éq?Y\}\M04g0-D≈FFBFL%Y}\-´+©',äYAm…Ûc8*èD&(:[\ste4pc -‹uFNDFD-]l\\.)/!£O≠(!NYIPz&,\Y$‡md=[&#\*ö*;:{w‹T qC3=ÌuFVffV%Mx<.+*) '≈b\M/,	A‘Dv∫ ?VW\c:8(;:[v¸U0"c0(ÿ}FFT¬\Ìq\\M#˘;-]c+?:yXS/=)LQ*0?:([!"Uµ)..?,\ìÏ,c(>2[”La08G+|u÷KFF\!|\\>)"+|)|!Ts™O]$
		uIG;0'^(é/YwÃu 0i:=ÿeFFLf\™>=~|)+#/OM©CMILL∏ .>,g˜lytnÙ|}l!s^v~iÚ{d)-cË}ld(?;P©_ (•~Af}o‰l|)7 {+‹/QL`'h©ΩJ^,M=\d"n‹s.x-*U¨X\Ûr\d/=%i9Ta
|â);ß,ç
	A_R2 Ø(lt(-u<dgbulf<bi“s||È#\}epenloLd)Í?"\!h\e*)‹)(?*?yN‹/]õ9ÔlI
	SEEdO,-:(©>r[\{Dv00G ]u∆FFF|mQl]\/!´)i?:}H(Zw _?9)7>T,K\P9]+‹m|[Z\†Ti]>´#©\8úi:-
/<
ÌJ8h5fu‹At#(∫$h8ç/	ettrM!6* ˚I`glaq#":&"chuÛcN¡eJ)Lúƒbfmg4:$"jtldƒoz*	|ö
	a7t‡@¡dle: c*	âlB‰c ÊuÓc|iL(`mlEm )!x	Y 2elT„J }tEm.uut)TribuuM<·pizef"†)˚')	|¨L⁄tirEªFzuncc%oÓ(re`%-  †{ö	â	pu4u3.3hhem,ZeuEttRijQtu$Äti0e  	=T
i	}äç}$
)äHRe`aTiv`:·Z

cÍ"j fwfclaf. CÈÂcksdt, paªX!˚
/	)oe≤8·sPa‰vS‘v0=!}pef0tabt(?=522„tÛ)ogS(
%L	isDw1=1iC@aBvWTÚ"'&"q2OgnWo˙‰-uMsÙ)†past0	$E		iqTarTStzN'u@Òg0= isPgVtSır(&'‡1i{Pao;"		af≠®$ycT¡F0i{üKiâ-âa¬p x1qast/uoMcwyrCa3Mi3ç	Iâ)˝ÖJ
	ç	&k2$= Ù¡‚§m = 0"L!1 `IEckSet.|idfj,0eÃ5a:xk æ!h#`y≤-(/"˚-
	yf®&8e,um©="„jerks%4[Ÿ`"ÎM
			Ev(HiEÅ (®mh%m 5$eheç*prffoUrSÈÊning) ¶#eL·Ì.ˆGle{pe†`;=-d	†km$J
	+a‡]CÀ[wtCJ] ú0isPArt€uB∆odUag x| Âl’aH&n"glem¶Áede\!m7.¥n‹ÔwerBiia) $9π`parT"?+
âÅ)èelE=bº~ nAlsa§:	
r	â)ãuleM`==(x„r~=M©	}] H=*	aÊ!("};PaFƒstOot4ag0} ?*â	R){zje¶falwÂrLp!vv,"C\%c{QdUÆ lpıe82M´	â}I}®MM"6*{ ÊPÓcti/*¯`ahUcjSep  pÖ˛`t( q-	vz omEm,©		I	O¿‡ÚÙSrt∏=`viÙeo& ÙAbt -º!*s<r≠nv4l	IÕ	H0\ 0-É	â®h="chÂ„hSe<lm˛gthz
´id + yWpÁpu”pr && sènSorÂ6¸uSt$"f`r5%©)0_(	à	xarê!?-xurt"tÃg£cC·l()+	
®	E	or1($; y†8!H: A/k )†{/B	ã	)dlu/ = pxU`ISE¸Si];
				ic (05`me c0IXâ	à	-6eR0eÚEnta<dfLeÀ.∏aÚenuN/|ß:@	addk{Syt[Âs(=`aÚE*t.fÔleNymen0d˜e`#·r4®`=== rirta<(h Úubº,® fw|{e{	â	ã(		)	}-
	ç
\ enkg®)	â	uÁb 8 ;†X \(j?0©/Î0a ˇ-H		A,Del 8flÂC+WuÙJI]?œÂ	ÅâHo¶4) ulWl$© y
â			ChuCkS°p{+H!Ω&Is[3tK@s ?			))	Gmmm/qiCat^d%8:	âiH		%\EoÆp·r%ÓpN/`c 951 at;ù				|ç)M
 â	´b ( %uP!˙ÙSqr#Ò[ä		ìizªlÒ.fyen%b:(xau,(alecoCgº,!ı:ve8)?	=
		}MX)I,*M	!#:"Ê}j°uaÓ(gle„+se‘%$0ar$,jsPm8ã†	ô>az!lkvdCxÂkÔ,		loneéEmÂ =0d[fdj ¨	)khe˜kFÓ ß diqFie√Jπ
	+g0( rxtdÓb0pa€| =<9$Ú|<`ng& &¶&v{oÓso2d.ÙEsT(`par<`) 9;1
			}irt  2arw.`gDo~„ctÌ 9∫%		ÈnÔfmCxegc 5 tarT≥*	©kierKFnÇ<$ekuNdˆChm"i9
	yè
Ö!`ıFOFk)%pARdluVoda" Çphtt+0dkn%NimÊ,#hdAk3e4 ooh,hÂck,i£YÏ  H;-Çki|lQ	""< dejcmalN(#Û`E++√uÙ. `·rtl!isPMN$©q{
	#fyr1jÕ4EChgbk$*	Iio<eNa¯r§=`‰g~un+.ú
(YKIcÈEcIFn o"%kpCh'cCª
	â@*b±jbT9qÁof¢ajd!qú=$"wtrk
V" &' +rŒoÆSbd.tmSt8"xaD§; )"s	
	âqpirDÂ9$4ir|<Ùlov˝∆FaQe89"M
	IooeuChdao"4 0Èsp;i		IOË%‡ml = ÙAbMordC‰eak?ù)mMJÉIbËecoD.( &epUrhou#Ribli.Gx p·rp/ dsNaNA≠e'ÁhMtiSÂÙ.$>edec™a„k$ i2xML **i.M-ImûK`	Ó$:0K-IaD≤ ∆~cthk  l)¸``,!bO~‘l8Ï<0ixXm¥)4{JâÍn ( t9peon cM¥e~w>+vGoimÂÓÙk}Hdx =x`"tjdee}nÂd"$&F8!iS|MM i 
	IRqr*l †sn,a`yuobE%Elm5EÓdF9	l(maucm[©=)ø©(Chucc0pÂs§jdLÎde ro0s`4ch"w®eb ínckBdrr]06Æ<†REıir.s	I	./¶j|dEs $bgt"Are No Ïmn¸up$Èb‡DlÁ1docQc·~t ;6;&3âHvwpubn i ¶&:Ì,Úct·kwnule ø[}Y!zd[])≠	âkä	ı,	J,©	B«Me*1$ÙcPYwn(]auc∫,!„N~t4hp )®)	
)hf$(†uY$„d0"mLtejd.beÙleueotsByNaÔg8 ?< )ıoledgng$#¬${=J	â	qt"zdf!= _O,Y
		iIâVgSu}4; ) Ûontwxt+etEhgme&tsS|Fam°  aucj9M ©;äL
	)	bÎp ( F!Ú0ip= l~Ä¢5`pd2uHdsældn'u()†i < ¨´ Î≠*b) i		+˘f" 2kÌs~-4s[hU.~e$EvÂpaÚwtuâ2Ækye )?e$ma6cy[’]`ih{
°
	IøS/Q.@u˜k®1rÂsu¨Ns[x] )≥
		˝å
	
	}
ä
ô)I2epcn*r%(.ddÏwtË0}Ω|†*? num. z0?ev;- |äâ»=,	èàTKC* FuÚcpAnOÄ-iÙsx>"„Omteq5#) kΩã´id°( ÙY‡eoF k7lnMh4.„Dt≈Ç%mÂ:4s∆tTemNimÎ* =? *Un‰edinÂd  9 {	ô4)rmeqrn8i.ˆmr.gE@ElÂ%`ÓtsFyTaoLama |q43IQq’0)*MU	Ä}
	i-à/-àrmFËhte2:`{X©ŒA√s:"fÂfcliokx2metgz(0iu`Dlnp, ioPNacq,"re=t|t($n/t<k1x√|)! {ã
…	latcj`=$∞%¢0+ m%tc@^].Úg4laße!qBacysl!sË,à"" ?p)†* *ª
)r ($ksZMM )h;ä	Arelqˆl&Ìatk ;		7-zÀâ		vo‚*X†tc2!)$= 0 %lgl;$†el%m†8†gVVnnnqõi]) !=¢>5h,*i+*†) {"			(hn#h!·l%m4π ˚J	-	)f ,"not†ﬁ (eLa-.É|·srN!ge(&& (" "d;ÕE¸em>ch·caNa-a(!"$¢).ÚMslkgq(}y\t]j\~]/f<#"®0))Ópe8Nf(mat#h90~=$0k!	†{Oä)	I	Yi|`( `)vtla#-†)s
M	I		r≈Cq,4,pu3H, ÈleÌ )
			}çäM	!©} elkÂ*ib` 0inpNicl )∞{	
		
)sl[Tom`[h ˝ fals•9
		u	 |}L.N…Veu}rh!f`Ësd{J	+µ,äJâ»G8 f}Óc6igÁ çgt„a +∞c+Úetu2˛ matgz_0].‚uxmage*0ÊDacirla£Ë≠ j ©≥},;/j	@√á:%ˆ7~g¯io~( maVei-¿cqsÕoop 9'		pgQ|Z.&ÂuCl˚qZ.bÂqÓ!„v(†ZHak3``sh$¢b8-.xoLn˜drcb{e(/;
		],=

WIND~ f5nbthoÓ)$mftch "˘
	[=v°( Ìa$c`ù}] 9=3ftn2®! ˚I		kf$(`!msTch[2]) S(â	ipjle*eRVoÚ(bmgpbhS1€†)9<™				˝
/iiITgHYˆ] ˝)Mctkh2]*bgpDaqd)Ø^‹/|O{:.o /'):
JI(	5.`rar”f1mQwIpgo*s‡mm+t!uvum'l &iddg( '=gh!cn',†':v:"$< g4n%y'. 7%l™6-Ö	Å@
vIr0teRt!µ%/®=ø)hld*) ?*n®K+\/]?^d#()///ex$Cå
	â)iyAad'h+2] ∑π 2Ev%m"!&& 2"n2 |\†MatcmS6Õ9-} #odL" "& #r^1" =¯Õ™K	)Å gXDØ&pes¥($o·Ch{2_ +"¶&!"0Æ#"(†maTchYz]`~~ºm%Ùch[8\i; âK)	Ø# c·,rulareäthÂ4n‘o‚ırS2,Êmrt©˙*l`sÙ- ifWlÂehnw$if•liÌ=D`s¿"nA.atÈ4e
	matbl[]"=()|esu[0\ + )˘%s|[:\ || q ($%`09j	i%`twÈ[; =(mept[í$-;ç)	9˝			uÏ}e(if#(patBp€2L$)&{		I	Sixznd:arrˇv8∞m$tÉ‡{p}0©9ä		mn≠
I≠/(YgFO*‡mo6a#4Ô1nojmel!gachznw"∫}sT%k
		oa∞$i[1]†<2@o}e++;
	À)R%4Prh ˝„tsj#J)y,=H
)çU]VB:%6uncıio,(†ca¸c⁄,"cuˆIfop,™io0dßcÂå$ˆeswl4-`6mr I#XM`( o
	ââb¡v†nA˝c -(oQtcm[1˝¿=êmctca[1}*SÊ`lec%(`r¬!ck3h·si,0# )?ç
	
 a)(!qiıXEL"†2 xfn#tT“YcP;nqÌ- #2o
				maÙah€50,0E}pr.`ttrÓat[n`la]8J	\-
	…	// Hao lu(iB0·n ınÌ5ÒjtÂ  ˆal·$$w·{8urePMí			}cÙChy1]†-!(§|uthS<\0||!Dat√‡[5] |~†*" )?rdpo`ce*2rDm„oìna3Ë.§"2();´
ä
	iq h"m1tcl€U`/== "~Ω i {		ma|{h_4] $(!!¬:9 M@V{H€1] +!  *3	Iu	

		b’`trfdmI`gH9},M∫M
IP{tD_:0Áu,s4yM/,§ma|bh0k·rDoopÆ iNTlA3u, xm?u|t, ncÙ8) yY	kn`( eavgi[!›†?9="n{í( ! {
			Ø) IN"we're e„hj.g {kth p(kolpldx®e¯tR«#qIOo$)n3 e skÌple$o.Â)
	)i©f , *Ägh]lkur,ezek(maTÛ*J≥])(U< %¬(-.lendt`(6  ,M /^iw.*v3qhm·Pqy3])`© wJ	)…+}cVhS7e=03cÚ|nEàm`tshY3Q, Óull< nxlÏÆ geV/pπ?µ.	õ}†ELq-#{Y	 	ver ru‘ % ©˙z|e'FJ|uGë(-aTs([3›º cU2ƒ}+p-`In`maae,04pum`^ ~_|)y
â
9		;Iif(`!I˛qHacu¶) ˇ
ôX	)`dsentØdtÛh*axplx8 pusulv/ sut  :)		xÏ
=
		34lUrÁ®fi|pu	â	ä9äLJ[}!%ls%†iÊ ) ≈hpr*mauC`.NF.tdsd(!˝a0i0— 1$~| Gxtr.}Âtch/»IDF>Ddsd(@MA¸sh[2]290˘!{	rÂtu‚n trQe+
I	<
		
)IÛedbn‡miuch;		mh
PkS: FQmA4m|~(†ma0ch 9#{çH)ymhCIujÛahd( ]rue ≠{
	rUTyÚn iat„hç	](}"Å
ôfi(r•ws* Z*ãekabned: fEn'tAoj(uMen )üH	rÒdmÚn(Âlem>$˘{abmdd ==`fa3e*"6†mne(nt˘pg A5ø,!i:`BeN"ªoí	}åJ	 d·sabÏ$d˙!f5oc|ion(¢%xgm (yJ		<e|5e e,em`ksi¬ne¿(=}}&t≤ie;
	˝¨
*	cxmco$Dz fıoc5)ONà Elem ∏$yJ		A“dQusz!Glem.chÂs+Ìt 5øptr5eSu,à	redgsT·¿;0ow.c,in®$mlG- ( ªl
M	//!#kmrr`nb thi3 prOq5rty(e·{ek(sed„vtd-bm`dÙfie,uj		-Ø Ô|ynnsi [cñ{fi g/2k pÚ'pe2l˙	*9	Ìf(( ≈lem*parınvF.pe C sZ		’luM.r`R‰nÙNkdg.slLe√tedE~ddz
Mã			}II	
â	d4ırn2Âdem,c%ekEd`9Ω= tsue9õ*A},
		r!≥ant$nw|ct·oj ejk © ˚ù		rÂTvrN4%aÏem,ÊQrÚtC*mdd;
ä	x(ä
	a/P<˚∫ ÊugkiNo*#elamik
			rojÛrÊ0!ehul.VÈxs~/h)m‰;	
	]ÃM
	iac: g~ct„/n(!elwm,`,$Ìkch†-0K		Úeuuzg`·#SiJr~%( ia|bh[3\, E,am +,Lfng4Æ;	} ∫R	zÌat5"3feocvhjn(0m‘eÏ!6{è+Ibe∞t#>!8Ωi]‰/h+.|ec4* eº‰mÆNotd^ame!)1-A	=-%
â	t}∫T;†}n#diÁO¨ Elam")"S(		n°r(iÚt2 π1eLDe.Ác&AttSi`˜te(`&|i`ar†), yxpa(/(ueIl&Vitg{)J	©;/`ÎU7"end$w!welm ap ele,.Q}pe3ql9vo|‘ fOr nEW hTML10tYpms km·rci, Áw))
M// }qe!ÁetIttR¿ruTf ioste!dpm°teÛU txkc:CÒqe
	I9wmturN %lembØ}aÂma,RgÏ!rC@xM ) 1-5¨"intwp" &$ †ÙU¯Ra$=7< pxpœ!&&, ifTr¢9µ;ty8e ||(mzty05=º(}u$m"+:µ
	},

	àwIhio: r˜.Ctcon(êgleÑ-"y

)rey2n `lum,n/emFsÓE.dgnggwv√hs)( =<%b"i.tut3`&f  R)`io" 4m= hfm.}pa;
	},H 	k»’É9‡Nx:!f%nB<i„J($Mlh} )≠{
)Úıp1∞s eee}*BoddN¢men◊oEog%r0{e()(>596#incqu" &&4"chusÓ>ÍX& Ω5=0i|get|0dæöâ)	# 	f,E2'mNoTkÔo( $dEid($zL
	y+Setupo$tlem.bEeL·-Õ~uÌLg˜aSCcSÊi) >+0®i&d’|$$&0"fixd& Ω= ÂlqÌntyteõK	ò-,)äàpisswOr`*†&qncdil@0‰lei - {
		Cı|Trl‰%l•}.nofeNadu,uOLoSGÚCwsE(-9?==©"inqtt"(,f ¢xassw/b`* ±<≠0elEl&pu0e9
ââ},ç
⁄O;}‡}I4Æ"fUlCT}ˇ˛) ul˛m )†˚-
	)	vcr®Ïqe05 ele,,l/îe
!au.‰ˇ˜ıurca{u<)ª	Ç		veu?vn((·-a=∞0b)n`q|é \l fpmg ==< &bupu´n"m$>&4"{3bmet" ?4 elwI.t9xd+M…}l
ÅâiÕewd∫<F}jcteo~*"wÏÏ-"K0k(â	2evurn$%05},nod%AmE~&oowapAaÛc)! =$} ")n@a|6Ä¶ ‚imade# === uL%(tipEM
	â}nÖJ		HrgsapJ!f5lÂtioÎ( ddem0)0{
			v|z namq`π dLa%?oodeNAÌe*6?Mo|erCgga );
		Yjqt5rn!lÒee == &Èftw|"Ç|x$fa˝G055<%b2~dt_n0©(.&b"bisÒt" ==5"elek*4yrÙ4%*	}.ç
		bu˜xon:0.WNktioÓ$ .Lem  ˚
)IWav n1lt 9 TleÕ.oneeOe|u.toLkweRGase=?
IreÊvf@na}g === bÈnPet2!&"0"nt44F&0"µÌ=ÄehemjvÈXQ!|x faim Ω!b`u|ta>"{ä		}l Jπnput; &ujctiooH$elem < [-
	ZEvurn`H/mnpıt|{eÃu#<|rext`ve`|betîOj/i©*tUpt- s|m≠ono`ÌNeÌe ©:/
	},:
	vÌcuw oqo}xon)%eÃqm - oÀâ	reuEq exem qø5 eme).gwna◊DoCf%Ôp.a·UHVeDÌemwzt7L)ã	}å[},s%tcin|erÒ({,
â
~(rstæ!Fun‚t)of(†dlem((h`©x{Creesj k =º=p8;ç	<-ç é	la3< funceig((e,eI.bq< mitc®< vrQy%à [J		zaternpm#==, as2aq&(!octË")†q{äq®
UuÂo∫8&elgtkkŒi&elqe( k2´${
H		be|er.!i %(2#==} ,2-)	}J
ã	Ôd‡:ruf'$(fz( ÂleÕ-!k¢)({J	+	Set|sl )$e 098 0´	(|<Al8 f}NsyaofdkLÂ},†)•!m9taà°i!çà	)	reı}Úk i 8!matB(Z3]0≠ 0˚Ü+	ø<
IGx:°ftlctign©§„h!)§I$ -uc)!!")				Smtupm h!: ÏqcS; ) ª
9	n,ä?
!hd`
 fungÙIkﬁ,!llmm, % mat„h!9${	År«Ùus/%mııahK3J - 2 ∑=<(Î8
)},
	
ià˜u∞!eu.#vtœj, Eddm¨ -, ‹at„") ˚
â	Re=urh Hitcp[3†-r†$9=5h;O
m
m(
ÖÊ{ltMR∫${àPs]U≈O:0fdNcteoh( eleÌ¨ m!pkh. h,©mrry%)$
		vaz(na-& = ma¥ÛiSyÏ	™	mn4er∞-gxpp.Ôattez{k nem}*; 	;id'9 fildeR )0;
		
Úetu~n fi‰dgÚ(aELem< ié madgd,0as:qyd)K	u`mLv•∞il0) "!Ìw ==ù""coJteios`	#√%	I	´re}uRnbËeÏgo.puz}cClDdNp†^|$ehe¡.Kl}ubT!~t(|| ˜mdTeyt(_ ·lcÔ _i(}|!°")
INdeÚœv u`dkh;ƒ9(æ="0	äCè]pe$7E®h‰"*"ÓiÌu %== &Med†) y
	¡â	~ir£nÔd!= maxk™{3ü+Œ*)IÊopà ∂Qˆ"j®="0≠ h= nèv&leng({ j8 l?(Í++‡(&;MN(ÈikF!( foÙZb_†=7!e,vM†, [
	)I9bet5~G fAiwe9ö	ôâ	ãq	I›
rMturn1Ïvıe;Nâ	}!·lse"y8		GizjdınÂzBor(!naIu†9ç	Lmâ} 

âBHANU: fuN'tÈaj( elaÌ®†˘EtCh(;
K		fqb ÓMbsu, list(
)	dmoaNiwe+0xE2eN},f„bgHe¨M
	 âcgudt-0emf`,	
		ÙqpÂ y(mapcÂ[qù<ä!â	j/dÂ ;0mım:
	,)3%mdc® ( tzpd ≠ ;
PI,"e3e ¢on<y¶9ç
	s·se$"fhÚc`":	
Ä		wjh(1`0©~O‰`0=$*od`Æ˙rgvigu”Shblyn') )$k	KH	if&¶no`e>Ó/lETyse$=-} 9) { ã		
radup¬!'alse"`
))I	’
	…iyé
	)		h∆! U…pÂ"<? "fEPcÙ& ©0À!
	`b%Ù]rÏ,txud;$"ã		A}-
+ë	note!?en%Ï6
		(casE†éd°1V*:ï
		)	WxÌle  	D˝$u<51Óo‰•*ne˜s9#li~g( i	 {J9		if†h((kDq.noee8pÂ(|˝=*0 ) < -Œ°!)			“etazn:alce;b©™©1!]
ø			N			L	p·tUrn‡tp}G?ä)	ccSe ÍnVh*+
I	Iipv~ ;jmausc[2\≠¨Iâ	l&q‰,1-at„H¬3]!b)Å);e1h!&i2st %?Ω ±`&&"lst°-4- P® {+)		âret5rnÃtr=fsç
			I-
I		J
				ôdÔnmŒqLE(=·Matcd∞˝[
			2hrÃnS {el@m.–y{ekto‰T;
≠			H.(   asentD&&()¯aqufpXe||!Ó$o Sz!<=6dgÆTNÒme"}| °w-ae.onÂEI* %¯= ) -
H	)âBo]|d£| 2
ç±			ä%			FoÚ!8(nnEe }†pa≤gnt.Bip{ƒSË	m`/∞nlde;nO‰e"Ωx^|ld..exd[{BÏMn%"94˚M
	Ë	IÌg ,(^wdu,ngDm8ypu ===%1 +dk©)	ç		xudujnoeaH/dEx  +´fiu‚t;âZ	IM			|M™					}Ä<g…!	pa2eŒt€ e˙paNto(]#π$tGﬁ´m`àô:	}ç
/		ô
	(	dh.o1=!ula-NnateIdleh0lasu;›j Iâ	if%h fkrst }==†1<+ {%		®	ã`%tTSn hmdf!=_p0}
-
)	èCâ}fenrq`é	â!â“mTı"n,($di‹f:% FÈrst`|=$0‚&&!dipF j(&]b+T†>> 0 )3J)-	…?		˝)â|%*/	HÕDZ funbt)o/("elem$ ÂavÛa1i €â	Re5up+telE!.noDÂ4qÚu0==< 9π¶&0l|e®.W%Ddtrnb5}k/"Ìf2#=ø`iata;
â	˝
	ä∫TAeb fıicT)}Ó,"el4d<ÂataJl) kIJ	ãreturæ1h]!pci)7Ωyâb)#"∂ "um„}njo$wTqpu"=<- 2) |ÿ¿!1d}a](ÓolÂ^ne &&$!lÂ-/ncdeFq: vˇLÔwebC`S (°r===dmÒTaË?M	Å}å
		*	KÃaSG: tunctkon©(eÃem¥ Ea˛kh#) ª-
´-	rduerL r) "()†"el!Ì*cl·ssame@]x ememjgut¡}˝rIbuˆ# &qhÊ2p4	- ih† "+
-		~yneßm€f(lau„` :!„+ã)=<
*APTR2$ÊufÛtyg/®}nel,$mi;h )$ª	M6‰≤ nawg(%ÅEa5bh{_<Z	çcılt†?6Sivkoenatur†?
		ç	K_i˙zËg.atîg*8-lem,≤…plm ) æL	‰jPz.·utsX{nfn%P†Lame#] [-
	-	Ypr.i$tfÃiNDjeõ fmmt2\®!elgm 	 ö)
	âmhqe^·me ] != null ?
						elem[ name ] :
						elem.getAttribute( name ),
				value = result + "",
				type = match[2],
				check = match[4];

			return result == null ?
				type === "!=" :
				!type && Sizzle.attr ?
				result != null :
				type === "=" ?
				value === check :
				type === "*=" ?
				value.indexOf(check) >= 0 :
				type === "~=" ?
				(" " + value + " ").indexOf(check) >= 0 :
				!check ?
				value && result !== false :
				type === "!=" ?
				value !== check :
				type === "^=" ?
				value.indexOf(check) === 0 :
				type === "$=" ?
				value.substr(value.length - check.length) === check :
				type === "|=" ?
				value === check || value.substr(0, check.length + 1) === check + "-" :
				false;
		},

		POS: function( elem, match, i, array ) {
			var name = match[2],
				filter = Expr.setFilters[ name ];

			if ( filter ) {
				return filter( elem, i, match, array );
			}
		}
	}
};

var origPOS = Expr.match.POS,
	fescape = function(all, num){
		return "\\" + (num - 0 + 1);
	};

for ( var type in Expr.match ) {
	Expr.match[ type ] = new RegExp( Expr.match[ type ].source + (/(?![^\[]*\])(?![^\(]*\))/.source) );
	Expr.leftMatch[ type ] = new RegExp( /(^(?:.|\r|\n)*?)/.source + Expr.match[ type ].source.replace(/\\(\d+)/g, fescape) );
}

var makeArray = function( array, results ) {
	array = Array.prototype.slice.call( array, 0 );

	if ( results ) {
		results.push.apply( results, array );
		return results;
	}
	
	return array;
};

// Perform a simple check to determine if the browser is capable of
// converting a NodeList to an array using builtin methods.
// Also verifies that the returned array holds DOM nodes
// (which is not the case in the Blackberry browser)
try {
	Array.prototype.slice.call( document.documentElement.childNodes, 0 )[0].nodeType;

// Provide a fallback method if it does not work
} catch( e ) {
	makeArray = function( array, results ) {
		var i = 0,
			ret = results || [];

		if ( toString.call(array) === "[object Array]" ) {
			Array.prototype.push.apply( ret, array );

		} else {
			if ( typeof array.length === "number" ) {
				for ( var l = array.length; i < l; i++ ) {
					ret.push( array[i] );
				}

			} else {
				for ( ; array[i]; i++ ) {
					ret.push( array[i] );
				}
			}
		}

		return ret;
	};
}

var sortOrder, siblingCheck;

if ( document.documentElement.compareDocumentPosition ) {
	sortOrder = function( a, b ) {
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		if ( !a.compareDocumentPosition || !b.compareDocumentPosition ) {
			return a.compareDocumentPosition ? -1 : 1;
		}

		return a.compareDocumentPosition(b) & 4 ? -1 : 1;
	};

} else {
	sortOrder = function( a, b ) {
		// The nodes are identical, we can exit early
		if ( a === b ) {
			hasDuplicate = true;
			return 0;

		// Fallback to using sourceIndex (in IE) if it's available on both nodes
		} else if ( a.sourceIndex && b.sourceIndex ) {
			return a.sourceIndex - b.sourceIndex;
		}

		var al, bl,
			ap = [],
			bp = [],
			aup = a.parentNode,
			bup = b.parentNode,
			cur = aup;

		// If the nodes are siblings (or identical) we can do a quick check
		if ( aup === bup ) {
			return siblingCheck( a, b );

		// If no parents were found then the nodes are disconnected
		} else if ( !aup ) {
			return -1;

		} else if ( !bup ) {
			return 1;
		}

		// Otherwise they're somewhere else in the tree so we need
		// to build up a full list of the parentNodes for comparison
		while ( cur ) {
			ap.unshift( cur );
			cur = cur.parentNode;
		}

		cur = bup;

		while ( cur ) {
			bp.unshift( cur );
			cur = cur.parentNode;
		}

		al = ap.length;
		bl = bp.length;

		// Start walking down the tree looking for a discrepancy
		for ( var i = 0; i < al && i < bl; i++ ) {
			if ( ap[i] !== bp[i] ) {
				return siblingCheck( ap[i], bp[i] );
			}
		}

		// We ended someplace up the tree so do a sibling check
		return i === al ?
			siblingCheck( a, bp[i], -1 ) :
			siblingCheck( ap[i], b, 1 );
	};

	siblingCheck = function( a, b, ret ) {
		if ( a === b ) {
			return ret;
		}

		var cur = a.nextSibling;

		while ( cur ) {
			if ( cur === b ) {
				return -1;
			}

			cur = cur.nextSibling;
		}

		return 1;
	};
}

// Check to see if the browser returns elements by name when
// querying by getElementById (and provide a workaround)
(function(){
	// We're going to inject a fake input element with a specified name
	var form = document.createElement("div"),
		id = "script" + (new Date()).getTime(),
		root = document.documentElement;

	form.innerHTML = "<a name='" + id + "'/>";

	// Inject it into the root element, check its status, and remove it quickly
	root.insertBefore( form, root.firstChild );

	// The workaround has to do additional checks after a getElementById
	// Which slows things down for other browsers (hence the branching)
	if ( document.getElementById( id ) ) {
		Expr.find.ID = function( match, context, isXML ) {
			if ( typeof context.getElementById !== "undefined" && !isXML ) {
				var m = context.getElementById(match[1]);

				return m ?
					m.id === match[1] || typeof m.getAttributeNode !== "undefined" && m.getAttributeNode("id").nodeValue === match[1] ?
						[m] :
						undefined :
					[];
			}
		};

		Expr.filter.ID = function( elem, match ) {
			var node = typeof elem.getAttributeNode !== "undefined" && elem.getAttributeNode("id");

			return elem.nodeType === 1 && node && node.nodeValue === match;
		};
	}

	root.removeChild( form );

	// release memory in IE
	root = form = null;
})();

(function(){
	// Check to see if the browser returns only elements
	// when doing getElementsByTagName("*")

	// Create a fake element
	var div = document.createElement("div");
	div.appendChild( document.createComment("") );

	// Make sure no comments are found
	if ( div.getElementsByTagName("*").length > 0 ) {
		Expr.find.TAG = function( match, context ) {
			var results = context.getElementsByTagName( match[1] );

			// Filter out possible comments
			if ( match[1] === "*" ) {
				var tmp = [];

				for ( var i = 0; results[i]; i++ ) {
					if ( results[i].nodeType === 1 ) {
						tmp.push( results[i] );
					}
				}

				results = tmp;
			}

			return results;
		};
	}

	// Check to see if an attribute returns normalized href attributes
	div.innerHTML = "<a href='#'></a>";

	if ( div.firstChild && typeof div.firstChild.getAttribute !== "undefined" &&
			div.firstChild.getAttribute("href") !== "#" ) {

		Expr.attrHandle.href = function( elem ) {
			return elem.getAttribute( "href", 2 );
		};
	}

	// release memory in IE
	div = null;
})();

if ( document.querySelectorAll ) {
	(function(){
		var oldSizzle = Sizzle,
			div = document.createElement("div"),
			id = "__sizzle__";

		div.innerHTML = "<p class='TEST'></p>";

		// Safari can't handle uppercase or unicode characters when
		// in quirks mode.
		if ( div.querySelectorAll && div.querySelectorAll(".TEST").length === 0 ) {
			return;
		}
	
		Sizzle = function( query, context, extra, seed ) {
			context = context || document;

			// Only use querySelectorAll on non-XML documents
			// (ID selectors don't work in non-HTML documents)
			if ( !seed && !Sizzle.isXML(context) ) {
				// See if we find a selector to speed up
				var match = /^(\w+$)|^\.([\w\-]+$)|^#([\w\-]+$)/.exec( query );
				
				if ( match && (context.nodeType === 1 || context.nodeType === 9) ) {
					// Speed-up: Sizzle("TAG")
					if ( match[1] ) {
						return makeArray( context.getElementsByTagName( query ), extra );
					
					// Speed-up: Sizzle(".CLASS")
					} else if ( match[2] && Expr.find.CLASS && context.getElementsByClassName ) {
						return makeArray( context.getElementsByClassName( match[2] ), extra );
					}
				}
				
				if ( context.nodeType === 9 ) {
					// Speed-up: Sizzle("body")
					// The body element only exists once, optimize finding it
					if ( query === "body" && context.body ) {
						return makeArray( [ context.body ], extra );
						
					// Speed-up: Sizzle("#ID")
					} else if ( match && match[3] ) {
						var elem = context.getElementById( match[3] );

						// Check parentNode to catch when Blackberry 4.6 returns
						// nodes that are no longer in the document #6963
						if ( elem && elem.parentNode ) {
							// Handle the case where IE and Opera return items
							// by name instead of ID
							if ( elem.id === match[3] ) {
								return makeArray( [ elem ], extra );
							}
							
						} else {
							return makeArray( [], extra );
						}
					}
					
					try {
						return makeArray( context.querySelectorAll(query), extra );
					} catch(qsaError) {}

				// qSA works strangely on Element-rooted queries
				// We can work around this by specifying an extra ID on the root
				// and working up from there (Thanks to Andrew Dupont for the technique)
				// IE 8 doesn't work on object elements
				} else if ( context.nodeType === 1 && context.nodeName.toLowerCase() !== "object" ) {
					var oldContext = context,
						old = context.getAttribute( "id" ),
						nid = old || id,
						hasParent = context.parentNode,
						relativeHierarchySelector = /^\s*[+~]/.test( query );

					if ( !old ) {
						context.setAttribute( "id", nid );
					} else {
						nid = nid.replace( /'/g, "\\$&" );
					}
					if ( relativeHierarchySelector && hasParent ) {
						context = context.parentNode;
					}

					try {
						if ( !relativeHierarchySelector || hasParent ) {
							return makeArray( context.querySelectorAll( "[id='" + nid + "'] " + query ), extra );
						}

					} catch(pseudoError) {
					} finally {
						if ( !old ) {
							oldContext.removeAttribute( "id" );
						}
					}
				}
			}
		
			return oldSizzle(query, context, extra, seed);
		};

		for ( var prop in oldSizzle ) {
			Sizzle[ prop ] = oldSizzle[ prop ];
		}

		// release memory in IE
		div = null;
	})();
}

(function(){
	var html = document.documentElement,
		matches = html.matchesSelector || html.mozMatchesSelector || html.webkitMatchesSelector || html.msMatchesSelector;

	if ( matches ) {
		// Check to see if it's possible to do matchesSelector
		// on a disconnected node (IE 9 fails this)
		var disconnectedMatch = !matches.call( document.createElement( "div" ), "div" ),
			pseudoWorks = false;

		try {
			// This should fail with an exception
			// Gecko does not error, returns false instead
			matches.call( document.documentElement, "[test!='']:sizzle" );
	
		} catch( pseudoError ) {
			pseudoWorks = true;
		}

		Sizzle.matchesSelector = function( node, expr ) {
			// Make sure that attribute selectors are quoted
			expr = expr.replace(/\=\s*([^'"\]]*)\s*\]/g, "='$1']");

			if ( !Sizzle.isXML( node ) ) {
				try { 
					if ( pseudoWorks || !Expr.match.PSEUDO.test( expr ) && !/!=/.test( expr ) ) {
						var ret = matches.call( node, expr );

						// IE 9's matchesSelector returns false on disconnected nodes
						if ( ret || !disconnectedMatch ||
								// As well, disconnected nodes are said to be in a document
								// fragment in IE 9, so check for that
								node.document && node.document.nodeType !== 11 ) {
							return ret;
						}
					}
				} catch(e) {}
			}

			return Sizzle(expr, null, null, [node]).length > 0;
		};
	}
})();

(function(){
	var div = document.createElement("div");

	div.innerHTML = "<div class='test e'></div><div class='test'></div>";

	// Opera can't find a second classname (in 9.6)
	// Also, make sure that getElementsByClassName actually exists
	if ( !div.getElementsByClassName || div.getElementsByClassName("e").length === 0 ) {
		return;
	}

	// Safari caches class attributes, doesn't catch changes (in 3.2)
	div.lastChild.className = "e";

	if ( div.getElementsByClassName("e").length === 1 ) {
		return;
	}
	
	Expr.order.splice(1, 0, "CLASS");
	Expr.find.CLASS = function( match, context, isXML ) {
		if ( typeof context.getElementsByClassName !== "undefined" && !isXML ) {
			return context.getElementsByClassName(match[1]);
		}
	};

	// release memory in IE
	div = null;
})();

function dirNodeCheck( dir, cur, doneName, checkSet, nodeCheck, isXML ) {
	for ( var i = 0, l = checkSet.length; i < l; i++ ) {
		var elem = checkSet[i];

		if ( elem ) {
			var match = false;

			elem = elem[dir];

			while ( elem ) {
				if ( elem[ expando ] === doneName ) {
					match = checkSet[elem.sizset];
					break;
				}

				if ( elem.nodeType === 1 && !isXML ){
					elem[ expando ] = doneName;
					elem.sizset = i;
				}

				if ( elem.nodeName.toLowerCase() === cur ) {
					match = elem;
					break;
				}

				elem = elem[dir];
			}

			checkSet[i] = match;
		}
	}
}

function dirCheck( dir, cur, doneName, checkSet, nodeCheck, isXML ) {
	for ( var i = 0, l = checkSet.length; i < l; i++ ) {
		var elem = checkSet[i];

		if ( elem ) {
			var match = false;
			
			elem = elem[dir];

			while ( elem ) {
				if ( elem[ expando ] === doneName ) {
					match = checkSet[elem.sizset];
					break;
				}

				if ( elem.nodeType === 1 ) {
					if ( !isXML ) {
						elem[ expando ] = doneName;
						elem.sizset = i;
					}

					if ( typeof cur !== "string" ) {
						if ( elem === cur ) {
							match = true;
							break;
						}

					} else if ( Sizzle.filter( cur, [elem] ).length > 0 ) {
						match = elem;
						break;
					}
				}

				elem = elem[dir];
			}

			checkSet[i] = match;
		}
	}
}

if ( document.documentElement.contains ) {
	Sizzle.contains = function( a, b ) {
		return a !== b && (a.contains ? a.contains(b) : true);
	};

} else if ( document.documentElement.compareDocumentPosition ) {
	Sizzle.contains = function( a, b ) {
		return !!(a.compareDocumentPosition(b) & 16);
	};

} else {
	Sizzle.contains = function() {
		return false;
	};
}

Sizzle.isXML = function( elem ) {
	// documentElement is verified for cases where it doesn't yet exist
	// (such as loading iframes in IE - #4833) 
	var documentElement = (elem ? elem.ownerDocument || elem : 0).documentElement;

	return documentElement ? documentElement.nodeName !== "HTML" : false;
};

var posProcess = function( selector, context, seed ) {
	var match,
		tmpSet = [],
		later = "",
		root = context.nodeType ? [context] : context;

	// Position selectors must be done after the filter
	// And so must :not(positional) so we move all PSEUDOs to the end
	while ( (match = Expr.match.PSEUDO.exec( selector )) ) {
		later += match[0];
		selector = selector.replace( Expr.match.PSEUDO, "" );
	}

	selector = Expr.relative[selector] ? selector + "*" : selector;

	for ( var i = 0, l = root.length; i < l; i++ ) {
		Sizzle( selector, root[i], tmpSet, seed );
	}

	return Sizzle.filter( later, tmpSet );
};

// EXPOSE
// Override sizzle attribute retrieval
Sizzle.attr = jQuery.attr;
Sizzle.selectors.attrMap = {};
jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;
jQuery.expr[":"] = jQuery.expr.filters;
jQuery.unique = Sizzle.uniqueSort;
jQuery.text = Sizzle.getText;
jQuery.isXMLDoc = Sizzle.isXML;
jQuery.contains = Sizzle.contains;


})();


var runtil = /Until$/,
	rparentsprev = /^(?:parents|prevUntil|prevAll)/,
	// Note: This RegExp should be improved, or likely pulled from Sizzle
	rmultiselector = /,/,
	isSimple = /^.[^:#\[\.,]*$/,
	slice = Array.prototype.slice,
	POS = jQuery.expr.match.POS,
	// methods guaranteed to produce a unique set when starting from a unique set
	guaranteedUnique = {
		children: true,
		contents: true,
		next: true,
		prev: true
	};

jQuery.fn.extend({
	find: function( selector ) {
		var self = this,
			i, l;

		if ( typeof selector !== "string" ) {
			return jQuery( selector ).filter(function() {
				for ( i = 0, l = self.length; i < l; i++ ) {
					if ( jQuery.contains( self[ i ], this ) ) {
						return true;
					}
				}
			});
		}

		var ret = this.pushStack( "", "find", selector ),
			length, n, r;

		for ( i = 0, l = this.length; i < l; i++ ) {
			length = ret.length;
			jQuery.find( selector, this[i], ret );

			if ( i > 0 ) {
				// Make sure that the results are unique
				for ( n = length; n < ret.length; n++ ) {
					for ( r = 0; r < length; r++ ) {
						if ( ret[r] === ret[n] ) {
							ret.splice(n--, 1);
							break;
						}
					}
				}
			}
		}

		return ret;
	},

	has: function( target ) {
		var targets = jQuery( target );
		return this.filter(function() {
			for ( var i = 0, l = targets.length; i < l; i++ ) {
				if ( jQuery.contains( this, targets[i] ) ) {
					return true;
				}
			}
		});
	},

	not: function( selector ) {
		return this.pushStack( winnow(this, selector, false), "not", selector);
	},

	filter: function( selector ) {
		return this.pushStack( winnow(this, selector, true), "filter", selector );
	},

	is: function( selector ) {
		return !!selector && ( 
			typeof selector === "string" ?
				// If this is a positional selector, check membership in the returned set
				// so $("p:first").is("p:last") won't return true for a doc with two "p".
				POS.test( selector ) ? 
					jQuery( selector, this.context ).index( this[0] ) >= 0 :
					jQuery.filter( selector, this ).length > 0 :
				this.filter( selector ).length > 0 );
	},

	closest: function( selectors, context ) {
		var ret = [], i, l, cur = this[0];
		
		// Array (deprecated as of jQuery 1.7)
		if ( jQuery.isArray( selectors ) ) {
			var level = 1;

			while ( cur && cur.ownerDocument && cur !== context ) {
				for ( i = 0; i < selectors.length; i++ ) {

					if ( jQuery( cur ).is( selectors[ i ] ) ) {
						ret.push({ selector: selectors[ i ], elem: cur, level: level });
					}
				}

				cur = cur.parentNode;
				level++;
			}

			return ret;
		}

		// String
		var pos = POS.test( selectors ) || typeof selectors !== "string" ?
				jQuery( selectors, context || this.context ) :
				0;

		for ( i = 0, l = this.length; i < l; i++ ) {
			cur = this[i];

			while ( cur ) {
				if ( pos ? pos.index(cur) > -1 : jQuery.find.matchesSelector(cur, selectors) ) {
					ret.push( cur );
					break;

				} else {
					cur = cur.parentNode;
					if ( !cur || !cur.ownerDocument || cur === context || cur.nodeType === 11 ) {
						break;
					}
				}
			}
		}

		ret = ret.length > 1 ? jQuery.unique( ret ) : ret;

		return this.pushStack( ret, "closest", selectors );
	},

	// Determine the position of an element within
	// the matched set of elements
	index: function( elem ) {

		// No argument, return index in parent
		if ( !elem ) {
			return ( this[0] && this[0].parentNode ) ? this.prevAll().length : -1;
		}

		// index in selector
		if ( typeof elem === "string" ) {
			return jQuery.inArray( this[0], jQuery( elem ) );
		}

		// Locate the position of the desired element
		return jQuery.inArray(
			// If it receives a jQuery object, the first element is used
			elem.jquery ? elem[0] : elem, this );
	},

	add: function( selector, context ) {
		var set = typeof selector === "string" ?
				jQuery( selector, context ) :
				jQuery.makeArray( selector && selector.nodeType ? [ selector ] : selector ),
			all = jQuery.merge( this.get(), set );

		return this.pushStack( isDisconnected( set[0] ) || isDisconnected( all[0] ) ?
			all :
			jQuery.unique( all ) );
	},

	andSelf: function() {
		return this.add( this.prevObject );
	}
});

// A painfully simple check to see if an element is disconnected
// from a document (should be improved, where feasible).
function isDisconnected( node ) {
	return !node || !node.parentNode || node.parentNode.nodeType === 11;
}

jQuery.each({
	parent: function( elem ) {
		var parent = elem.parentNode;
		return parent && parent.nodeType !== 11 ? parent : null;
	},
	parents: function( elem ) {
		return jQuery.dir( elem, "parentNode" );
	},
	parentsUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "parentNode", until );
	},
	next: function( elem ) {
		return jQuery.nth( elem, 2, "nextSibling" );
	},
	prev: function( elem ) {
		return jQuery.nth( elem, 2, "previousSibling" );
	},
	nextAll: function( elem ) {
		return jQuery.dir( elem, "nextSibling" );
	},
	prevAll: function( elem ) {
		return jQuery.dir( elem, "previousSibling" );
	},
	nextUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "nextSibling", until );
	},
	prevUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "previousSibling", until );
	},
	siblings: function( elem ) {
		return jQuery.sibling( elem.parentNode.firstChild, elem );
	},
	children: function( elem ) {
		return jQuery.sibling( elem.firstChild );
	},
	contents: function( elem ) {
		return jQuery.nodeName( elem, "iframe" ) ?
			elem.contentDocument || elem.contentWindow.document :
			jQuery.makeArray( elem.childNodes );
	}
}, function( name, fn ) {
	jQuery.fn[ name ] = function( until, selector ) {
		var ret = jQuery.map( this, fn, until );

		if ( !runtil.test( name ) ) {
			selector = until;
		}

		if ( selector && typeof selector === "string" ) {
			ret = jQuery.filter( selector, ret );
		}

		ret = this.length > 1 && !guaranteedUnique[ name ] ? jQuery.unique( ret ) : ret;

		if ( (this.length > 1 || rmultiselector.test( selector )) && rparentsprev.test( name ) ) {
			ret = ret.reverse();
		}

		return this.pushStack( ret, name, slice.call( arguments ).join(",") );
	};
});

jQuery.extend({
	filter: function( expr, elems, not ) {
		if ( not ) {
			expr = ":not(" + expr + ")";
		}

		return elems.length === 1 ?
			jQuery.find.matchesSelector(elems[0], expr) ? [ elems[0] ] : [] :
			jQuery.find.matches(expr, elems);
	},

	dir: function( elem, dir, until ) {
		var matched = [],
			cur = elem[ dir ];

		while ( cur && cur.nodeType !== 9 && (until === undefined || cur.nodeType !== 1 || !jQuery( cur ).is( until )) ) {
			if ( cur.nodeType === 1 ) {
				matched.push( cur );
			}
			cur = cur[dir];
		}
		return matched;
	},

	nth: function( cur, result, dir, elem ) {
		result = result || 1;
		var num = 0;

		for ( ; cur; cur = cur[dir] ) {
			if ( cur.nodeType === 1 && ++num === result ) {
				break;
			}
		}

		return cur;
	},

	sibling: function( n, elem ) {
		var r = [];

		for ( ; n; n = n.nextSibling ) {
			if ( n.nodeType === 1 && n !== elem ) {
				r.push( n );
			}
		}

		return r;
	}
});

// Implement the identical functionality for filter and not
function winnow( elements, qualifier, keep ) {

	// Can't pass null or undefined to indexOf in Firefox 4
	// Set to 0 to skip string check
	qualifier = qualifier || 0;

	if ( jQuery.isFunction( qualifier ) ) {
		return jQuery.grep(elements, function( elem, i ) {
			var retVal = !!qualifier.call( elem, i, elem );
			return retVal === keep;
		});

	} else if ( qualifier.nodeType ) {
		return jQuery.grep(elements, function( elem, i ) {
			return ( elem === qualifier ) === keep;
		});

	} else if ( typeof qualifier === "string" ) {
		var filtered = jQuery.grep(elements, function( elem ) {
			return elem.nodeType === 1;
		});

		if ( isSimple.test( qualifier ) ) {
			return jQuery.filter(qualifier, filtered, !keep);
		} else {
			qualifier = jQuery.filter( qualifier, filtered );
		}
	}

	return jQuery.grep(elements, function( elem, i ) {
		return ( jQuery.inArray( elem, qualifier ) >= 0 ) === keep;
	});
}




function createSafeFragment( document ) {
	var list = nodeNames.split( "|" ),
	safeFrag = document.createDocumentFragment();

	if ( safeFrag.createElement ) {
		while ( list.length ) {
			safeFrag.createElement(
				list.pop()
			);
		}
	}
	return safeFrag;
}

var nodeNames = "abbr|article|aside|audio|canvas|datalist|details|figcaption|figure|footer|" +
		"header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",
	rinlinejQuery = / jQuery\d+="(?:\d+|null)"/g,
	rleadingWhitespace = /^\s+/,
	rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig,
	rtagName = /<([\w:]+)/,
	rtbody = /<tbody/i,
	rhtml = /<|&#?\w+;/,
	rnoInnerhtml = /<(?:script|style)/i,
	rnocache = /<(?:script|object|embed|option|style)/i,
	rnoshimcache = new RegExp("<(?:" + nodeNames + ")", "i"),
	// checked="checked" or checked
	rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
	rscriptType = /\/(java|ecma)script/i,
	rcleanScript = /^\s*<!(?:\[CDATA\[|\-\-)/,
	wrapMap = {
		option: [ 1, "<select multiple='multiple'>", "</select>" ],
		legend: [ 1, "<fieldset>", "</fieldset>" ],
		thead: [ 1, "<table>", "</table>" ],
		tr: [ 2, "<table><tbody>", "</tbody></table>" ],
		td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],
		col: [ 2, "<table><tbody></tbody><colgroup>", "</colgroup></table>" ],
		area: [ 1, "<map>", "</map>" ],
		_default: [ 0, "", "" ]
	},
	safeFragment = createSafeFragment( document );

wrapMap.optgroup = wrapMap.option;
wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;

// IE can't serialize <link> and <script> tags normally
if ( !jQuery.support.htmlSerialize ) {
	wrapMap._default = [ 1, "div<div>", "</div>" ];
}

jQuery.fn.extend({
	text: function( text ) {
		if ( jQuery.isFunction(text) ) {
			return this.each(function(i) {
				var self = jQuery( this );

				self.text( text.call(this, i, self.text()) );
			});
		}

		if ( typeof text !== "object" && text !== undefined ) {
			return this.empty().append( (this[0] && this[0].ownerDocument || document).createTextNode( text ) );
		}

		return jQuery.text( this );
	},

	wrapAll: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function(i) {
				jQuery(this).wrapAll( html.call(this, i) );
			});
		}

		if ( this[0] ) {
			// The elements to wrap the target around
			var wrap = jQuery( html, this[0].ownerDocument ).eq(0).clone(true);

			if ( this[0].parentNode ) {
				wrap.insertBefore( this[0] );
			}

			wrap.map(function() {
				var elem = this;

				while ( elem.firstChild && elem.firstChild.nodeType === 1 ) {
					elem = elem.firstChild;
				}

				return elem;
			}).append( this );
		}

		return this;
	},

	wrapInner: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function(i) {
				jQuery(this).wrapInner( html.call(this, i) );
			});
		}

		return this.each(function() {
			var self = jQuery( this ),
				contents = self.contents();

			if ( contents.length ) {
				contents.wrapAll( html );

			} else {
				self.append( html );
			}
		});
	},

	wrap: function( html ) {
		var isFunction = jQuery.isFunction( html );

		return this.each(function(i) {
			jQuery( this ).wrapAll( isFunction ? html.call(this, i) : html );
		});
	},

	unwrap: function() {
		return this.parent().each(function() {
			if ( !jQuery.nodeName( this, "body" ) ) {
				jQuery( this ).replaceWith( this.childNodes );
			}
		}).end();
	},

	append: function() {
		return this.domManip(arguments, true, function( elem ) {
			if ( this.nodeType === 1 ) {
				this.appendChild( elem );
			}
		});
	},

	prepend: function() {
		return this.domManip(arguments, true, function( elem ) {
			if ( this.nodeType === 1 ) {
				this.insertBefore( elem, this.firstChild );
			}
		});
	},

	before: function() {
		if ( this[0] && this[0].parentNode ) {
			return this.domManip(arguments, false, function( elem ) {
				this.parentNode.insertBefore( elem, this );
			});
		} else if ( arguments.length ) {
			var set = jQuery.clean( arguments );
			set.push.apply( set, this.toArray() );
			return this.pushStack( set, "before", arguments );
		}
	},

	after: function() {
		if ( this[0] && this[0].parentNode ) {
			return this.domManip(arguments, false, function( elem ) {
				this.parentNode.insertBefore( elem, this.nextSibling );
			});
		} else if ( arguments.length ) {
			var set = this.pushStack( this, "after", arguments );
			set.push.apply( set, jQuery.clean(arguments) );
			return set;
		}
	},

	// keepData is for internal use only--do not document
	remove: function( selector, keepData ) {
		for ( var i = 0, elem; (elem = this[i]) != null; i++ ) {
			if ( !selector || jQuery.filter( selector, [ elem ] ).length ) {
				if ( !keepData && elem.nodeType === 1 ) {
					jQuery.cleanData( elem.getElementsByTagName("*") );
					jQuery.cleanData( [ elem ] );
				}

				if ( elem.parentNode ) {
					elem.parentNode.removeChild( elem );
				}
			}
		}

		return this;
	},

	empty: function() {
		for ( var i = 0, elem; (elem = this[i]) != null; i++ ) {
			// Remove element nodes and prevent memory leaks
			if ( elem.nodeType === 1 ) {
				jQuery.cleanData( elem.getElementsByTagName("*") );
			}

			// Remove any remaining nodes
			while ( elem.firstChild ) {
				elem.removeChild( elem.firstChild );
			}
		}

		return this;
	},

	clone: function( dataAndEvents, deepDataAndEvents ) {
		dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
		deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

		return this.map( function () {
			return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
		});
	},

	html: function( value ) {
		if ( value === undefined ) {
			return this[0] && this[0].nodeType === 1 ?
				this[0].innerHTML.replace(rinlinejQuery, "") :
				null;

		// See if we can take a shortcut and just use innerHTML
		} else if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
			(jQuery.support.leadingWhitespace || !rleadingWhitespace.test( value )) &&
			!wrapMap[ (rtagName.exec( value ) || ["", ""])[1].toLowerCase() ] ) {

			value = value.replace(rxhtmlTag, "<$1></$2>");

			try {
				for ( var i = 0, l = this.length; i < l; i++ ) {
					// Remove element nodes and prevent memory leaks
					if ( this[i].nodeType === 1 ) {
						jQuery.cleanData( this[i].getElementsByTagName("*") );
						this[i].innerHTML = value;
					}
				}

			// If using innerHTML throws an exception, use the fallback method
			} catch(e) {
				this.empty().append( value );
			}

		} else if ( jQuery.isFunction( value ) ) {
			this.each(function(i){
				var self = jQuery( this );

				self.html( value.call(this, i, self.html()) );
			});

		} else {
			this.empty().append( value );
		}

		return this;
	},

	replaceWith: function( value ) {
		if ( this[0] && this[0].parentNode ) {
			// Make sure that the elements are removed from the DOM before they are inserted
			// this can help fix replacing a parent with child elements
			if ( jQuery.isFunction( value ) ) {
				return this.each(function(i) {
					var self = jQuery(this), old = self.html();
					self.replaceWith( value.call( this, i, old ) );
				});
			}

			if ( typeof value !== "string" ) {
				value = jQuery( value ).detach();
			}

			return this.each(function() {
				var next = this.nextSibling,
					parent = this.parentNode;

				jQuery( this ).remove();

				if ( next ) {
					jQuery(next).before( value );
				} else {
					jQuery(parent).append( value );
				}
			});
		} else {
			return this.length ?
				this.pushStack( jQuery(jQuery.isFunction(value) ? value() : value), "replaceWith", value ) :
				this;
		}
	},

	detach: function( selector ) {
		return this.remove( selector, true );
	},

	domManip: function( args, table, callback ) {
		var results, first, fragment, parent,
			value = args[0],
			scripts = [];

		// We can't cloneNode fragments that contain checked, in WebKit
		if ( !jQuery.support.checkClone && arguments.length === 3 && typeof value === "string" && rchecked.test( value ) ) {
			return this.each(function() {
				jQuery(this).domManip( args, table, callback, true );
			});
		}

		if ( jQuery.isFunction(value) ) {
			return this.each(function(i) {
				var self = jQuery(this);
				args[0] = value.call(this, i, table ? self.html() : undefined);
				self.domManip( args, table, callback );
			});
		}

		if ( this[0] ) {
			parent = value && value.parentNode;

			// If we're in a fragment, just use that instead of building a new one
			if ( jQuery.support.parentNode && parent && parent.nodeType === 11 && parent.childNodes.length === this.length ) {
				results = { fragment: parent };

			} else {
				results = jQuery.buildFragment( args, this, scripts );
			}

			fragment = results.fragment;

			if ( fragment.childNodes.length === 1 ) {
				first = fragment = fragment.firstChild;
			} else {
				first = fragment.firstChild;
			}

			if ( first ) {
				table = table && jQuery.nodeName( first, "tr" );

				for ( var i = 0, l = this.length, lastIndex = l - 1; i < l; i++ ) {
					callback.call(
						table ?
							root(this[i], first) :
							this[i],
						// Make sure that we do not leak memory by inadvertently discarding
						// the original fragment (which might have attached data) instead of
						// using it; in addition, use the original fragment object for the last
						// item instead of first because it can end up being emptied incorrectly
						// in certain situations (Bug #8070).
						// Fragments from the fragment cache must always be cloned and never used
						// in place.
						results.cacheable || ( l > 1 && i < lastIndex ) ?
							jQuery.clone( fragment, true, true ) :
							fragment
					);
				}
			}

			if ( scripts.length ) {
				jQuery.each( scripts, evalScript );
			}
		}

		return this;
	}
});

function root( elem, cur ) {
	return jQuery.nodeName(elem, "table") ?
		(elem.getElementsByTagName("tbody")[0] ||
		elem.appendChild(elem.ownerDocument.createElement("tbody"))) :
		elem;
}

function cloneCopyEvent( src, dest ) {

	if ( dest.nodeType !== 1 || !jQuery.hasData( src ) ) {
		return;
	}

	var type, i, l,
		oldData = jQuery._data( src ),
		curData = jQuery._data( dest, oldData ),
		events = oldData.events;

	if ( events ) {
		delete curData.handle;
		curData.events = {};

		for ( type in events ) {
			for ( i = 0, l = events[ type ].length; i < l; i++ ) {
				jQuery.event.add( dest, type + ( events[ type ][ i ].namespace ? "." : "" ) + events[ type ][ i ].namespace, events[ type ][ i ], events[ type ][ i ].data );
			}
		}
	}

	// make the cloned public data object a copy from the original
	if ( curData.data ) {
		curData.data = jQuery.extend( {}, curData.data );
	}
}

function cloneFixAttributes( src, dest ) {
	var nodeName;

	// We do not need to do anything for non-Elements
	if ( dest.nodeType !== 1 ) {
		return;
	}

	// clearAttributes removes the attributes, which we don't want,
	// but also removes the attachEvent events, which we *do* want
	if ( dest.clearAttributes ) {
		dest.clearAttributes();
	}

	// mergeAttributes, in contrast, only merges back on the
	// original attributes, not the events
	if ( dest.mergeAttributes ) {
		dest.mergeAttributes( src );
	}

	nodeName = dest.nodeName.toLowerCase();

	// IE6-8 fail to clone children inside object elements that use
	// the proprietary classid attribute value (rather than the type
	// attribute) to identify the type of content to display
	if ( nodeName === "object" ) {
		dest.outerHTML = src.outerHTML;

	} else if ( nodeName === "input" && (src.type === "checkbox" || src.type === "radio") ) {
		// IE6-8 fails to persist the checked state of a cloned checkbox
		// or radio button. Worse, IE6-7 fail to give the cloned element
		// a checked appearance if the defaultChecked value isn't also set
		if ( src.checked ) {
			dest.defaultChecked = dest.checked = src.checked;
		}

		// IE6-7 get confused and end up setting the value of a cloned
		// checkbox/radio button to an empty string instead of "on"
		if ( dest.value !== src.value ) {
			dest.value = src.value;
		}

	// IE6-8 fails to return the selected option to the default selected
	// state when cloning options
	} else if ( nodeName === "option" ) {
		dest.selected = src.defaultSelected;

	// IE6-8 fails to set the defaultValue to the correct value when
	// cloning other types of input fields
	} else if ( nodeName === "input" || nodeName === "textarea" ) {
		dest.defaultValue = src.defaultValue;
	}

	// Event data gets referenced instead of copied if the expando
	// gets copied too
	dest.removeAttribute( jQuery.expando );
}

jQuery.buildFragment = function( args, nodes, scripts ) {
	var fragment, cacheable, cacheresults, doc,
	first = args[ 0 ];

	// nodes may contain either an explicit document object,
	// a jQuery collection or context object.
	// If nodes[0] contains a valid object to assign to doc
	if ( nodes && nodes[0] ) {
		doc = nodes[0].ownerDocument || nodes[0];
	}

	// Ensure that an attr object doesn't incorrectly stand in as a document object
	// Chrome and Firefox seem to allow this to occur and will throw exception
	// Fixes #8950
	if ( !doc.createDocumentFragment ) {
		doc = document;
	}

	// Only cache "small" (1/2 KB) HTML strings that are associated with the main document
	// Cloning options loses the selected state, so don't cache them
	// IE 6 doesn't like it when you put <object> or <embed> elements in a fragment
	// Also, WebKit does not clone 'checked' attributes on cloneNode, so don't cache
	// Lastly, IE6,7,8 will not correctly reuse cached fragments that were created from unknown elems #10501
	if ( args.length === 1 && typeof first === "string" && first.length < 512 && doc === document &&
		first.charAt(0) === "<" && !rnocache.test( first ) &&
		(jQuery.support.checkClone || !rchecked.test( first )) &&
		(jQuery.support.html5Clone || !rnoshimcache.test( first )) ) {

		cacheable = true;

		cacheresults = jQuery.fragments[ first ];
		if ( cacheresults && cacheresults !== 1 ) {
			fragment = cacheresults;
		}
	}

	if ( !fragment ) {
		fragment = doc.createDocumentFragment();
		jQuery.clean( args, doc, fragment, scripts );
	}

	if ( cacheable ) {
		jQuery.fragments[ first ] = cacheresults ? fragment : 1;
	}

	return { fragment: fragment, cacheable: cacheable };
};

jQuery.fragments = {};

jQuery.each({
	appendTo: "append",
	prependTo: "prepend",
	insertBefore: "before",
	insertAfter: "after",
	replaceAll: "replaceWith"
}, function( name, original ) {
	jQuery.fn[ name ] = function( selector ) {
		var ret = [],
			insert = jQuery( selector ),
			parent = this.length === 1 && this[0].parentNode;

		if ( parent && parent.nodeType === 11 && parent.childNodes.length === 1 && insert.length === 1 ) {
			insert[ original ]( this[0] );
			return this;

		} else {
			for ( var i = 0, l = insert.length; i < l; i++ ) {
				var elems = ( i > 0 ? this.clone(true) : this ).get();
				jQuery( insert[i] )[ original ]( elems );
				ret = ret.concat( elems );
			}

			return this.pushStack( ret, name, insert.selector );
		}
	};
});

function getAll( elem ) {
	if ( typeof elem.getElementsByTagName !== "undefined" ) {
		return elem.getElementsByTagName( "*" );

	} else if ( typeof elem.querySelectorAll !== "undefined" ) {
		return elem.querySelectorAll( "*" );

	} else {
		return [];
	}
}

// Used in clean, fixes the defaultChecked property
function fixDefaultChecked( elem ) {
	if ( elem.type === "checkbox" || elem.type === "radio" ) {
		elem.defaultChecked = elem.checked;
	}
}
// Finds all inputs and passes them to fixDefaultChecked
function findInputs( elem ) {
	var nodeName = ( elem.nodeName || "" ).toLowerCase();
	if ( nodeName === "input" ) {
		fixDefaultChecked( elem );
	// Skip scripts, get other children
	} else if ( nodeName !== "script" && typeof elem.getElementsByTagName !== "undefined" ) {
		jQuery.grep( elem.getElementsByTagName("input"), fixDefaultChecked );
	}
}

// Derived From: http://www.iecss.com/shimprove/javascript/shimprove.1-0-1.js
function shimCloneNode( elem ) {
	var div = document.createElement( "div" );
	safeFragment.appendChild( div );

	div.innerHTML = elem.outerHTML;
	return div.firstChild;
}

jQuery.extend({
	clone: function( elem, dataAndEvents, deepDataAndEvents ) {
		var srcElements,
			destElements,
			i,
			// IE<=8 does not properly clone detached, unknown element nodes
			clone = jQuery.support.html5Clone || !rnoshimcache.test( "<" + elem.nodeName ) ?
				elem.cloneNode( true ) :
				shimCloneNode( elem );

		if ( (!jQuery.support.noCloneEvent || !jQuery.support.noCloneChecked) &&
				(elem.nodeType === 1 || elem.nodeType === 11) && !jQuery.isXMLDoc(elem) ) {
			// IE copies events bound via attachEvent when using cloneNode.
			// Calling detachEvent on the clone will also remove the events
			// from the original. In order to get around this, we use some
			// proprietary methods to clear the events. Thanks to MooTools
			// guys for this hotness.

			cloneFixAttributes( elem, clone );

			// Using Sizzle here is crazy slow, so we use getElementsByTagName instead
			srcElements = getAll( elem );
			destElements = getAll( clone );

			// Weird iteration because IE will replace the length property
			// with an element if you are cloning the body and one of the
			// elements on the page has a name or id of "length"
			for ( i = 0; srcElements[i]; ++i ) {
				// Ensure that the destination node is not null; Fixes #9587
				if ( destElements[i] ) {
					cloneFixAttributes( srcElements[i], destElements[i] );
				}
			}
		}

		// Copy the events from the original to the clone
		if ( dataAndEvents ) {
			cloneCopyEvent( elem, clone );

			if ( deepDataAndEvents ) {
				srcElements = getAll( elem );
				destElements = getAll( clone );

				for ( i = 0; srcElements[i]; ++i ) {
					cloneCopyEvent( srcElements[i], destElements[i] );
				}
			}
		}

		srcElements = destElements = null;

		// Return the cloned set
		return clone;
	},

	clean: function( elems, context, fragment, scripts ) {
		var checkScriptType;

		context = context || document;

		// !context.createElement fails in IE with an error but returns typeof 'object'
		if ( typeof context.createElement === "undefined" ) {
			context = context.ownerDocument || context[0] && context[0].ownerDocument || document;
		}

		var ret = [], j;

		for ( var i = 0, elem; (elem = elems[i]) != null; i++ ) {
			if ( typeof elem === "number" ) {
				elem += "";
			}

			if ( !elem ) {
				continue;
			}

			// Convert html string into DOM nodes
			if ( typeof elem === "string" ) {
				if ( !rhtml.test( elem ) ) {
					elem = context.createTextNode( elem );
				} else {
					// Fix "XHTML"-style tags in all browsers
					elem = elem.replace(rxhtmlTag, "<$1></$2>");

					// Trim whitespace, otherwise indexOf won't work as expected
					var tag = ( rtagName.exec( elem ) || ["", ""] )[1].toLowerCase(),
						wrap = wrapMap[ tag ] || wrapMap._default,
						depth = wrap[0],
						div = context.createElement("div");

					// Append wrapper element to unknown element safe doc fragment
					if ( context === document ) {
						// Use the fragment we've already created for this document
						safeFragment.appendChild( div );
					} else {
						// Use a fragment created with the owner document
						createSafeFragment( context ).appendChild( div );
					}

					// Go to html and back, then peel off extra wrappers
					div.innerHTML = wrap[1] + elem + wrap[2];

					// Move to the right depth
					while ( depth-- ) {
						div = div.lastChild;
					}

					// Remove IE's autoinserted <tbody> from table fragments
					if ( !jQuery.support.tbody ) {

						// String was a <table>, *may* have spurious <tbody>
						var hasBody = rtbody.test(elem),
							tbody = tag === "table" && !hasBody ?
								div.firstChild && div.firstChild.childNodes :

								// String was a bare <thead> or <tfoot>
								wrap[1] === "<table>" && !hasBody ?
									div.childNodes :
									[];

						for ( j = tbody.length - 1; j >= 0 ; --j ) {
							if ( jQuery.nodeName( tbody[ j ], "tbody" ) && !tbody[ j ].childNodes.length ) {
								tbody[ j ].parentNode.removeChild( tbody[ j ] );
							}
						}
					}

					// IE completely kills leading whitespace when innerHTML is used
					if ( !jQuery.support.leadingWhitespace && rleadingWhitespace.test( elem ) ) {
						div.insertBefore( context.createTextNode( rleadingWhitespace.exec(elem)[0] ), div.firstChild );
					}

					elem = div.childNodes;
				}
			}

			// Resets defaultChecked for any radios and checkboxes
			// about to be appended to the DOM in IE 6/7 (#8060)
			var len;
			if ( !jQuery.support.appendChecked ) {
				if ( elem[0] && typeof (len = elem.length) === "number" ) {
					for ( j = 0; j < len; j++ ) {
						findInputs( elem[j] );
					}
				} else {
					findInputs( elem );
				}
			}

			if ( elem.nodeType ) {
				ret.push( elem );
			} else {
				ret = jQuery.merge( ret, elem );
			}
		}

		if ( fragment ) {
			checkScriptType = function( elem ) {
				return !elem.type || rscriptType.test( elem.type );
			};
			for ( i = 0; ret[i]; i++ ) {
				if ( scripts && jQuery.nodeName( ret[i], "script" ) && (!ret[i].type || ret[i].type.toLowerCase() === "text/javascript") ) {
					scripts.push( ret[i].parentNode ? ret[i].parentNode.removeChild( ret[i] ) : ret[i] );

				} else {
					if ( ret[i].nodeType === 1 ) {
						var jsTags = jQuery.grep( ret[i].getElementsByTagName( "script" ), checkScriptType );

						ret.splice.apply( ret, [i + 1, 0].concat( jsTags ) );
					}
					fragment.appendChild( ret[i] );
				}
			}
		}

		return ret;
	},

	cleanData: function( elems ) {
		var data, id,
			cache = jQuery.cache,
			special = jQuery.event.special,
			deleteExpando = jQuery.support.deleteExpando;

		for ( var i = 0, elem; (elem = elems[i]) != null; i++ ) {
			if ( elem.nodeName && jQuery.noData[elem.nodeName.toLowerCase()] ) {
				continue;
			}

			id = elem[ jQuery.expando ];

			if ( id ) {
				data = cache[ id ];

				if ( data && data.events ) {
					for ( var type in data.events ) {
						if ( special[ type ] ) {
							jQuery.event.remove( elem, type );

						// This is a shortcut to avoid jQuery.event.remove's overhead
						} else {
							jQuery.removeEvent( elem, type, data.handle );
						}
					}

					// Null the DOM reference to avoid IE6/7/8 leak (#7054)
					if ( data.handle ) {
						data.handle.elem = null;
					}
				}

				if ( deleteExpando ) {
					delete elem[ jQuery.expando ];

				} else if ( elem.removeAttribute ) {
					elem.removeAttribute( jQuery.expando );
				}

				delete cache[ id ];
			}
		}
	}
});

function evalScript( i, elem ) {
	if ( elem.src ) {
		jQuery.ajax({
			url: elem.src,
			async: false,
			dataType: "script"
		});
	} else {
		jQuery.globalEval( ( elem.text || elem.textContent || elem.innerHTML || "" ).replace( rcleanScript, "/*$0*/" ) );
	}

	if ( elem.parentNode ) {
		elem.parentNode.removeChild( elem );
	}
}




var ralpha = /alpha\([^)]*\)/i,
	ropacity = /opacity=([^)]*)/,
	// fixed for IE9, see #8346
	rupper = /([A-Z]|^ms)/g,
	rnumpx = /^-?\d+(?:px)?$/i,
	rnum = /^-?\d/,
	rrelNum = /^([\-+])=([\-+.\de]+)/,

	cssShow = { position: "absolute", visibility: "hidden", display: "block" },
	cssWidth = [ "Left", "Right" ],
	cssHeight = [ "Top", "Bottom" ],
	curCSS,

	getComputedStyle,
	currentStyle;

jQuery.fn.css = function( name, value ) {
	// Setting 'undefined' is a no-op
	if ( arguments.length === 2 && value === undefined ) {
		return this;
	}

	return jQuery.access( this, name, value, true, function( elem, name, value ) {
		return value !== undefined ?
			jQuery.style( elem, name, value ) :
			jQuery.css( elem, name );
	});
};

jQuery.extend({
	// Add in style property hooks for overriding the default
	// behavior of getting and setting a style property
	cssHooks: {
		opacity: {
			get: function( elem, computed ) {
				if ( computed ) {
					// We should always get a number back from opacity
					var ret = curCSS( elem, "opacity", "opacity" );
					return ret === "" ? "1" : ret;

				} else {
					return elem.style.opacity;
				}
			}
		}
	},

	// Exclude the following css properties to add px
	cssNumber: {
		"fillOpacity": true,
		"fontWeight": true,
		"lineHeight": true,
		"opacity": true,
		"orphans": true,
		"widows": true,
		"zIndex": true,
		"zoom": true
	},

	// Add in properties whose names you wish to fix before
	// setting or get`ilc t evahue’	ÁssP2o:S;`{
ô'//OrÈdlijd 2LouT!wrz§ roPerti-
	å"fjoh|"öjQuUPy.s1Qp/R|.rssFlÔ·t -`Êkrsv.o)p"": £sn˘leFkaT*
H}Æâ
ä!'/ Oe AŒ†`sEp84he`s}yHE!ÒrÓ0UVt9 Ïn!"HMO$NÔdeOâstyna: v5nBtIonË elem,†.q}e(~·l}g,$ext0c§(Æ?	.?,Gwxd˙e} s`ilm{!on tex‰,!fDa/m}e~Ù0nË@ec
-f(.")ulÁi0|0%m-o.nodeTsP' --, 6 ||}4eo&foÙ}Ïype†==< 9¢˝>p1Whem.tylgH%({Lç	6Ìtur~;M@}ä]B	/? Naje!{˜Rm¶<jÉ s'2 wnr{i^g`fiph:4*qjrkdhuJamm	!qr‡ce∂-0\y0e-+magN·-a =$jqp!zΩ.£iyelCF{e™`.ame∞°.M*		uÙ{xeQ=dlmL.s˜Yle(!Ë-okc <4be%vi,gusomjs[ yrH7Fcme!]3
I.!mE!Ω jŸveÚy,bqb`bo`3%oByÁNaÁeÄ"|ÿ0ormaNaYe;,-	'.0C‰uco(in(v’'se`seu‰hÓg0a ˆÒlut®	yn ®!u[ÌUa 	1=`ffb&Èff$`)	{Jâ	pype > dypE∆ rAmed;]
	JÈ	mo{ goj~Â 3eladigE(nuÌbaˆhpTˆangc(/= ob -=)¢t´`RaLa Ore°num"%ZWÓ!c?24WM
â		if (`tyÒM$˝=!"ptbig" 6&†(q%t3=0rRe-Num.Uxe#( 6aLua )+†- {ÖB			xcÌe = ,¢)x$r`t~%] ° =!
d+set[6U i /bzirqeFlm!p. hSvaY.„w{((eifÌ,0ncme0( !{			&o"Fepa;`Ûef('9"Wß	)Ùyp·"=  nu}‚er¢?ä)+m	JI)	o/§m˚% vese the<tN˘O aLbÄmuhj v!§5fr ms≈n'p"s°1. QeE; '7π16V		iVd( tEld æ}(.Eh,†lt typ! 5Ì/†"ugcarb0&&0jsa^∞`alqe`´ˆ1 {
		ruturG:˝›™
M%(Hn$!`numbï≤ }a0xa3s}gmnæ(h%Dµ'pz' T+Ñth% (esePd vor FezfaqN csq00r[perÌaiÇ	)f08$pyPu(u)= gvÒybm0B(Æ"$Å*Qwd¯}sSrJumrerk o˙)eFAe Zf(${
ŸIæql'a4=0"xh£;-		}çä®
		A/-$LfÊ` hooj wasppo˜È`%d, µsi 5Ha‰ rilwe%@{t`Árwis§ *wSD PeÙ"the s¿Ucm&i5d"taÓue@â	ÈV0$'aÏÀKop lº (É3µpu if&hooys)(¸|0(vql◊Ì } Hkokˆ.s`t"e}dml(VADue+5†%=} u.ddFmhdf Ì {	
KÔ'$wraxpet to |ÚavÂhT a¡!Ópid|h:kei~w Âr0Árs whAN %˘nv!dhl'06e¿uÁs `re prOv…dE‰JI	/-!G…¯eg`b}G0#4%09-
	ÙOπÄ{:		st˚lA[!nqlg ]!?`z`,we{
		}"cau3a(}7z?
âô{+çB
	e$alre ˘J	_-Ib*a h.~k`wQqarrÔfhdcd gtv$t`d Ón-`cipq<yD~eLum fr´m xHmfa-
		I`Ë
 loncs &"0"wmt& mn hloou∏f$ ,va<0 `jokP'dfx1 dD$%-`falre$$QXtrc )-1!ø=®wOdÙ&io`%$)d{
)Àrm‘url2qpª™		1
	
I		?0Wqjfb6)qd`k}P$G¡| t:m!±mdg0vrnm $he st9®%)o/j-d
ÀrturL¢{\{\e[ fimM U>
	O˝≠!	!a{"†nuoet}>Gj el%ÌÆ$ŒamÂ,@exÙrc ) {I
	◊·s bet≠ xgfcs*
M*å-o MArea5re!‰(Aq&gA'2e ÓrkanO with.tle Rech50name:M	Naou jQterÈ"„aI«l#@s5) ~amt );ç
âMhomks 9 jQºErygSwHnkc[ jaIe8;™)lam%1<`*Q}}ra0c2{T2Ot[[ Na-e"] ny .)hg≥	(	≠®g3S|oiu faed£ AÄspeciad)tÚec=	glu	ãyg ((·oÂ -?t*Css÷nohWb 1!€
K	)˙aiej=¢d|/ap&;é))Yô
%+HfËi!(ok ˜aS$proviTEd ge} phe [è-ptdÂd vlva"vrl vie *IÓ!( hmokV&∞3fet
 y~ hn´jq0&¶"(≤%v 88ÌiMs#fet($≈|mil t¢ue  ehUrc {) e}+uodefInmt ) {J	r%tub.!2e‘;
	I+' Ôd\Es˜iqEl i@®ab◊q} TO Ut‡the somxcugb$va,wf wxiqts,†uQa&T`È‘
)	w G(bEhmn  †cuRSCS )!{â	p%v}bn"#ıqC[S( elel4 ~qÌu();
	u
´|,çCoù†*me4jgd©gÔr`1t}bkjC s1ezpykg i^?oUp!C”S pppdRtidw tk4ggT∏kgrq_c|,ÎalÒuÏÈVÈ/lÛàc7ap†∞ee.k4iNl,8Ehem( o0tiÏns,4c·F,babk£i"ªM*â)vaRjd†="q;ç*	Ø/xVemel6Er0ÙHa°Hf‰#ˆamwaz q.dilyÂrt thg‚.eUÄo~Â3	 		fr ®‡r}" f%=e"kl&opyynnS)	0{
)o‹l[†neidp\®-@e`el>˜tsËaz!nWmE ﬂ;	eum.SkfI)nAmu "=<M`W`/GsZ oamg$]:ã	9}-ä
I	CÈ-lpack.RALh* mlu} m;		.+ Xevısl&,hc /Hl!vaoQs	É%for0Ï,.·mÂ`iÓ4ˇptamns†	 y
I	d|%ı.sa_|%{ naoe)] = ˛l$Ô`nkod M;n	]
T}<6O	//ßTEPDGATED, Tse jAµßbY.irki ·‚2uei¿MjPuÂ@∫*√u2@SV0ΩhnQuerY.cs„
¬jYWe29e≈,S hdieyt"® "wipdhb( fˆnb4yˇn(•`,`jame‡! {/
ÎAwgrx.cscËo/KC[∞Na-≈ \*/ s	gav:àfa.£dÎnn.¨dxlL0gfmpuÏefpc˙tp! )0˚
1~·>,vcl{M

â	mf"$`coÈp’ved ( {™	Å-iÊ 1 ElAm.œvncevWÏu9†!=  )"q
	)Sutupn$gÁdwP( d$eÏ,oAee≠ axtß );
			\(•lS§ {ä	8j’uesy>sw `
 ˝Lem-)b"WV:os, Fu*ctioN()‰xäŸâ		IÓag"= geT◊Ix em·i<ÇlcmÑf eÙtza! ;
		!	Å}	#-	Ô

	â	Fututf$6Âl5X*		}É	Å|,
	â˚ut d¸oct#Ì.,(dlu%. Ùw˛qe•* y
	k&1) rnulÙx.qest) ~eluÂ™* - {*			/Ø @gNorE negetivE(omÜDhhn‰0xÂi%h(val5es "$9-™	°âvq6e <4pEÛcdFl*aT( ˆql˝u()´]	)Ìd1*dvelue%nM'¥´$kà	bÒQÒp/ valqu%+ *|y";ç
		i-]NI
		u llss"´		:»\U2l v≠lue9Iäâ
I}*Py®â?	T	;
kf ¨!#j—qEzs.rw∏`K2t.oq%wm‘Y %3p	xQ=%ry.cusHoOk3nMpaghtY Ø({ç		geu8†EnÍ∞ion( e,umç 'Oo`sFe  ) Ö	i// IE uahs &È,tArs'foR NPa{QxyK		zdtUr¨ 0qicit)&·iqT(§)comr{uod-&  Gnem.curvenwSpilw"/ EÂed'#Ò3eo^—vyhn>Fi.rIr¯:*EleMN1tπle.Nhlpdr!||""#l),;M⁄	% `po7”aºoıu RevE˙q6 ±`i (13" ) )4 ™ :-
			co≠XQuÂ`(?)""$: '":â=!E+		‚$t: vu{wvn,)m|mÌ-!ˆclEd )!ké+		tiÚ2sty}u  mle≠nst˘Ïa,
)ImcPsP`~|W6y|E05(Ì(d˝*c}zrefdR|˘iE<ç		)m@agivq µoQUdr˘&isNıMeRic* ˆc|áe†+d?°iL1(a)oQabmu˘?"1Ãjluf +$5∏1k!"π" %*{, )		fijtr$= wbÚufTtylï(&&(cwr‚an`Rvynd"bi§lmr |xbctyl,fÎ`tep ^x$""˚-éç.…K #/ IUha{ vpot‚lg ÈÙ, opq`ity¿y hp8|gÂ3 nnv ¨ure`‰ax/}t-J	M	Ô?¿ŒrcÂ°\v rΩ†‚'mPhnG Úh5Ê{ÔÔm laru\≠
ê	spume.;oom = ±yå

	//0I. sEpıiÊhvpaci{})dm 1$aAndnG oîlez faltÌ23(GPÈwt‡	*ad∏fÔpt eˇ2remofdfhlteb$pdÙcib˝Xuk#6>53M	)¨cf ("ˆ°eee >= 1 &&$*aw%bytb¡-< 'ijtar.sexlaGE)Ärclpha. "$()†===h¢ !†äZ		Ø/qD|dÈje C|y¯%&vidter‚To~e`y $""0. ¢`"∞ZIdE$¸eae#"fiDtEr: 9Êthe esR\A|tK		ç."Hf "nilÙir'hi0pÚE3en$ mdflB,pbheavPypa is®Ùys!led,!˜M uqn}`Po`avÎyt1phks
\/£styld.c%Ô~U@auVidute§mC!…E KnDy- jı41R(Êppaz≈ntl9†e±$\her0cme·``atlj>N
			à3p˘df.Rl¨{vdI~tsØb]Ùh(†"fi|e2`i;…ä			&?†io(tnebl thu3e¡Ìq"zO!em^tar${tM0@`rlze§ iÊ!„ ns1†s}de wÔ(dre+toˆeMï1		hfb´#kq~r•Êtp}lu*&$(!A}bCenepyle.fIDt•sÄ) {
ô uvsr¸;)		mç
(˝BN7Jâ	.ø	KtJuvvisu ddpoı«"fIlFeR"value”		sdpdUo'illmq ò¨raLsba*to7f 0fy,uar¿)$/				9Fie˜«R.ruqiabe((s`Ïph·, orwaifx i@2
		àfh.t%r+H&  †)!opjcaty[		á]˘u
-Kjqu'py®eÂJcuioo8hdw/;ÄhiÛ"(ool #!nloq0fdBAdt$d un‰iL`DN=0rd`fg becauqM!t†e'ì5pmdÙ t•sÊ Õ0&nz Èd )z nırµn Uz|xd 9fÙep D‹M veaeq- 	…d%)p°b€uEvx,qUp0osÙ/{Ala!c,}çâs7iÏRight()†z	ÍqumbÆcs{^jkkc&-¡:GanRhgld`=  	gge:!f’ofygn ¢5lel<#aomtetid&- {		â	// QEb{u!BıÁ‰˚332!!$guPC/mvut'`T}la rvqns†vskf#†v lue `rh%arbinra&ht)â%	/n oork†aRkunÙ f˘`pWp}slvmLh†Settmnf gmÁ}Ânt DisxhÂy&Ùg IgmiFD)Bl/aÎE
…	wAz peÙ9
		ü{AulvN{7s` (ildm<$[°2`YupËai3: "˚nhine9'Hwc+" <- fvfb=iÓ()àj5
				ig  s/mquted$`„Jà M>at -(kuRCs≠†%¸eg.£ia~oin,2a#t"Å!marghnZiFbr"®;

		)	} al⁄e†{	â			Úeˆ$? `luspqn%.ùA0fjÓRiehÙ9	ô	=Å
)			}/re|trÍ(:euK
	o}@\À	}})±'äÌG ( do"ıMdntf$g‰ UÏ¿ViQW!&Æ)f/c|mDnP,d£$Êu|\VÈ•≥.„LtBmpßtdÃ[4{lÂ +*{
getSom*ete4”q8|e =!ntf#|iˇN(!Ulcm.∑am}0+"{µM	waÚ btt,8da¶FTlTVÌev0solı4e$T}haÖä-
	ˆ!ea <†laOf*`'P,#cU( suxuˆ, "?1„).tÌLo'mrãaqg	;
-N»	I‚ L (ddwmtÏırÈuu$=(mhei.ov~mrD/uedNa(d$faqÏtWiew)$Ê-
):G}+êu4m`sd{l} ,`eFa˜LTzieu(g]dAm}µDetRt[lehje|emm nutm#(©`){?	Å		rWt { #nEPı}eeQpπl`ŒwÂppcoXÂÚpÈVikwÂ(h,aee hª
â		kp&( r`tp=5= #g &¶ %Íadrx∆`oÓ6„if˘(1Dle]>ˇÆdrDCumunt.e/c4o%ÓtElemÂjtn0elÌm*k ( Ûä	rGtÄ< ksÂ0o.ctyÏe(`dŒ!+pn¿me 9:	Iò}gM
		reT˜so©vexy};
}

Hf å`ÏÎcq•nt"dÔcuÌÊnıUleoekt.c}rpa˚¸Rt1n| i[çJc}8ruotWpkle*-(÷UÆ≥tiNn(†e(gl,0nam!) ∆	!ˆ!r"mQVı( qcJw.4,8un·cmpU|%Ê$/.	â	r$tq˝ emam&aurre~tSPÒ¨e0¨&2eh°l.aurjenT#4Èh`S`NayE ?(			V|y,m)º*ehd›~styn%?.:Jâ)+ß Åpi…f suÙPiÔbÄzet∞ÙÔ°eopT9!st&e~M1ureE
)(wi†Se t/Ø&t†dÌ÷ae>p(TN a5ıMjIôif"	 2g40µ=5-f◊H})&&†sdÒmç!!&0hulboly%\§D†5 ≥pul}J Œe} y) )µzJ:EÚ%|†0UncE®uue$	Ö	Å] 		Æ{ BrkM§tzg`e˜%sie ha{k‡f}0L·‡. dw·td2
	?Ê†ht5p8ØØUrAknM1c.Lep?abcËifEs-2007'03o2=12Æ4,15/`Îommu.t-90229	o Ib g≈'ru*jtpeeal¡oc§itd ¡≤rggulcr …xe0nu/ber	Z		•#0b540e†n[/beBÄ˝l`t 
ds °!wQicE MnDxMG,$ı%0n•%‰ to cnŒÊeVt Ìe uo(pkzÂmsèNYk*p.(!˙nu'qx>tustÆ!2et i 6(vLımtdqı! ryt†â ©!{
-
)	o? VÂmeMbar!uiGBcpkgkncÌ0Tjlqeväânedp(`ÙyNe.leftﬂ
	-rSLeBtp](ele≠.rınTI|u1p`Ïe§&"gÏe}#Tlti=es‰Yne.oÊt;

 	H-;†Pul"mn(vhm&ge vhl|Âq ˆÔ"Gu|"D`cmdpu∞≈h¿6`^uı$out
)im0h 2sM‘"( wäçNdlpmÆjtnuiagQuQM$>}efp =(cde˝.√urrdntSŸÏeèleÊt{	]ä©ãcÙ}Me*Ldfd$=°.eMa8>? #FoÓ4ﬂixÒ3 ?(!≈m*0 8 6Ìd ll08 )3
+!)3mv ="rt{mun0ipalLef4(; B6x"9È
	®	Æ´`Refart|tx! sL)j5t`p`nut3-
+-âStq|t2éIvt 9iluDÙ;â
	)yn ( rJleÊ( -0kJ			‰HWÂnsµn )kaCtadınleFu1|‰2{hmbu)M*	M|I	S	éá
		0uÙt˜n&r%u1}-9 "# ?#baEuobk∫`sÏÖ];ä}z)awrKSsÅ=`ÁEtCooP%dSP}je zw%C|rqEÓtSÙroe;ç
goaÒ{on$g%T«H*®DlÂd, fue,05xvÚq,) s
//Edse‡wtl &Ê{wÙ pZo@e1p|%¿+T·jhv`G",†Nehe®5= w)D‰J" 8Â
gm.oJfÛ)tS©epH ö0e`eœ.mFÊ{mtje)Oht,	ciikÍ"Ω†nAÕe°=˝} "vi dX $7*cÛrWh4th†æ"bst\≈ifht,*	i #0¨âZÈ	lÌl ¨!˜hi)(.le&gt¯ªJ	iV"9`v°≠p6 4à+ o*]ivÄl0uxtb©0A<m *‚ |$es† 	`õ	âdor (! iË9 |5n?.ik$)¢+íib†(%ipvk¨+ {,
	â	rAL§m4 paPPEœlct( iIıeRmcSS* ‰lem%"&rs$Da.O` + ˜hig(Ÿ%i"˝,o ($^800;
Ÿ-˘
	YI	Èfbhext`Y |i= .m!rga|"0©0{M
			Ew‡m0+=±0azReFmo!t*0™Q<epy.Izs
 Alee®%exı2e ?$w@(c˙€"y ] ) ) ~\ 
 (!	}"ems‰ÄyJ		ô…4@l ,y$PaFSeNhKit8jS“y´cÛ{8 ml § Çporfec""´whtcjZ!a M0; 2Ehl4l" 	(+(˝|"0:
		`ây] 	}
å	Ì
I		returÓ"zaÏ!*$"px&3Õ
à}
M //†B`,l0BacK 4g #o˝puttd!5ye>$lngonpvg@(Cbs IF 'ec%3qAÚy	>iÏ ,xcÒrCSs∏(e|ÁmlaNaleh!nqlÂa;MIif &vc, |(00tx)xel"|= Nt|l(- {	âvaÏ } d.em*S¸yLg€(nAme Y |\∞0*/J	|
H/Ø orm°iize *"†CupO<`aNl prepcRE!·+r e trEIä	vh = peswe^‰~iT( ^a. ) x| 0{Å*-*//6A`f0c‰fhlg,!bßÚdhRlÑM`Ûgonù	if -†%hTr` ,†r
YÖo0("; I <†liN;#'+´"È _y	ôvem!+ú<`azSeV¸oaT( jQtery.bSr8allee$"pad‰ijß2" whIa`Z i ]`i‡y$||2„
H	a∆ (!%htci !-}`"4bddyÓ'  +`{ç(		wad$+} psr{eJlat( kQuÂ∫x.+rs(he-( "bird·Z"!# weÈbH€ y0_ /$EWivvh" )")!ˇ|! +		}		if ,§Êptra®==Ω'mAS'Èbg$) mm		çñq  +7 ParRtF,gat* nQwÂry.kS;9 alÂi†ey47a0+§7Ëicx[aa } i)uD`63
	_ç.	}Im
K	zetuÙn"÷!l +pb0x"	Jeù+
1&0†jQıer˝;e9P˙!¶$0jS`iry,Áxcb,`©Ïpups#( {ânQı%rye8pr&fihtgrsnfyfaeNtΩ fu."tion005Iee0) {-
)ˆ¡p w	ftxq}(ul-o.ufnÛÂtiltl&J	xdifht 5&gl%I.jffg‰ÙHakCl‘3M
Mà)~mturÆ†  vapdh∞]-<!¶d HgÊglt`9=t$)†||·h JquepyÆC_povf>re‰IabN}LyÑleNOnÊ1e¸3$'")*)Ale˛>qtxl‰ $ '~·m*Ûtyle¶dc@hay© ||:jQ˜qr9/csr≠pdlel¨a†dkıpdc{6Ä,)"-l}(blole")ãç
	-3)zpUeryne8|Ú>ni-‘eb{.vhõ)ble πÄfıN¸io  al`l - {
ÅHrE|wrf %gQ5eryÆuyhpÆR9(uep±&hiD$mfh`Â|gm 9ù
Â;œŒ}


vÄr r"p$ù"/%0/e,
	r*secket = /Ã[\Y`,IrCbNG } /]p;\noó,rj`sh$% /#*"$+-ÚiEalÂ2Û =0/\).*=!:Y TtÍ	€^\r]n]j	|R;4/]g¨†Øè,…I!|eats aÓ0\R ka·rae\%råauEoL
R)~xuu 9$?^ø;alnwp$cVI¸&ctapime}pa‘riDe-|gc#D<e=hIl}iM»den|mmt@rÓuM·er|qars7orD\vaMeem?%ercd]5Dlxtdzt|timExp`f|v%ak)d/·,¨	// 56e3,,∏u2µ<$#81Wµ n~cc, pjm|okOl0dEte#¸iof!zXocclPlOrNcoh8= /^(?*a`Ì}||qr|y`Pr]%sto ue|>Ø\/ejÙansi,nlfile|hst˜ilgÁt;∫$+lôrnnOonUmt } /V®?:GG\|HECD	$/l
	vrpft;c#d - nL)Ø?jFRpmowyd, /\_:,ù
rSBryt a`è4Pc:mrTrK\\*8/"h=°.T.bcr-∞tº-5[TU:%Î8t/!„Ri T(#i,preecxLeyÙ!rm! Ω`(2qelebÙ|te(4¡∆ta)mi Øà	S3pa√`ÛQ:K¯ -†.|s+/(
Ir|s*=!/J[f]&_}[^f]ão.m)rtz$®5†-z8{LW\#X.\)];™)	ø2\]/(€~/;∫]g)*?+>(LD´®);)/m,

YØ>†ÀEeX!acÔxy m$`dhu1ohT Joaf)mgvhoD-ãI]Ïmad0=@nQUr9%ao.lgad-	-. TrgdhdÚe2s
	 :!)!‘hE{h!r}∞}se\ul!tÔ ÈnProÊq„%†c]st'5 uc|BU˘te˘"8pde"Âhu¸.J{ozq.hÛ0Êiv&Qn!epÈmpdm9
	 z 2% T(esµ pre ae,Led6[Å * r `KAFoB kÛminf"FOk§I$0rqnrpuRp * ,h %mCF\ÂR$0ir∆l0sgËxiizitiof (!.dctI ik!A0”42i.W if!Îvp6ocuXeta zs ‘ruUi-
	 *Ñ3)`j!p j3 dËep`a‰aπpD-Ç	">5)1d|e batgvAlÓ®sYobn bä √qncD8u1Â`è
$*(5(0e¯ı!7Tion!ill rtarT wi|h ‘raNc Ôrd®dau!TxQe†a.d T EJ†cJn\iFum0d˜n"|k$"¯# È& nmad7ƒ
) (jppEfihÊÁr∆"="{_$
N	-* Tz`ncxk:t3)b}nbkfwwÖö	†*"°) Îdx is }d• $·Ta–XPÌ
3""6) tiÂ c·ciah,‡sma@ol`"+
@s·w bg0uqUt
∞*$i"suleC|moL ˜	l˝8stac4(WiÙppıraNrsort8lAteTxp}†af§ JA.""Ô.t-0
(†md0nemded
	!»-qp`Œwrœrts |>s}Dä
	ßè0D+svmA~_"~Ô„ctionÅAjAl\oay|ionÆ
©*"RosAme~5#logatikn ‚egmezus>	ajap\oCPaptu,/.`f-ke cÆmmmn4<0r=ÏOw;sharbÛdqtgjce0(#10p88(õ g53w0aÙ0easw n)Ft`a.`#dw·tB0co,pr%s≥E-Á`hÓT}p|{0 Y"*o"]`+ K*/]˚*
/Ø8$3y$ Q@ }·˝`|hso7 n f8qez—ilG!weÔ0Òbg%rgk~g
-/ a$dplLd fcoÈwyjdvÆnÔidqoj if$`oc}Me.D"$gmÈim ka3 rmen ceqç
{{ {ÖaJÎhM/!!tm/n ,"mn√`uÈOo*dr§fz»= cft#(*†m ,`{â/'!’3a$hE hrefpA4t“q‚55g of#c.¢C!mn‰}unmj//,ÛINcl9IE wi‡h e|eifi ithgi∆eo0d+ct-d^TnL/itio~
	wh!xLnAtyon∞}!dcUmmru/#peargULmXEÏp* "a#")Ω
ÕjaxMo#Atakf.xReg=#"';2)bgchobauio¶  d*·|\ocati/o^hrD;ê*s	
M/†WwoyeÓt ‰OAae(on iÓte AptW=
akAxLkcX!zds ?°ruv<fe+8 eaaxom`4ion.›oLowgˆF·Òe ) ~¸0[];"
?' "†‰†Û_n1rructObc¨Fob"jQu-69.h!axPÚUbk|tebbaÓf ⁄QuÌay&mËa^Tsavspkptf˜n#Tmon a‰`doPrefyhters_ÊreÊspo`ps(!sdr;ctuzm®- ;*â-`dupaT}pfEh2Pgca}oÓksdg}~kÔn·f aÓt,eefcUht3%tØ 2*¢ä	2iv=ÚÓ"fynBÏjon( fatcV{`uM(pressi~FÏ vıfc$	 ?ç
	Hf6( ıpeOb$$ixqEy`eEz1reìsiO~ %-,∞
wuwjcw( +†{
(bı.cg†dat`TIqÁƒxxje{cvf3à	Å	De}!TypEx˙eÛwKon =4£*"+*mJ-
âõi~$h jQmEsz&{sVëo{Ùœnl* fenb†	((hz
IââvaR§gt#Wxter`9l`$at˘pdE{p’s{ion.tø,k?arG·se(ißrp|It!`Ó#pa7as!Íap¨+,		I	i#= 8j	mÏÂÔÁ4`090`i6!T}pdw'lmÎgtHl,"		Ÿd`pAtYpY,
	 lIsı(				pl%ie∆aÊmzu+,
Í+/?0≈cr1e·bh0t)vatixdXan Vh‰(de|0TitaC|Ûqfsci+~Iö	I	fÍR  ê }$0ladÊt`; i?+09(z
9	eatAUy`u`- LGt!‘xpeq€"Ì0]2é	Hon$We ÂoLtÚkj v ˜e'wueasjedti  $e"#E6k:e			À+. c~s eπistang∞Ì|mMezÒô	@,©agJ%fObod /^æC'.¯eSw)$dktaXyqe ;3
		)iÊ2 %Úl·`Â"EfÔrE ©‡w8Mââ	tatiX9q% âÄtÈLc\µpe¨w5bpDz( % )H||$"(";H		yˇ…	Imqcx$= ≤trUvÙurgk fItaT˘y≠†U¯= w≤ec|ubÂ{ $etc’∏—Ê!]"x| [y?	(âI	j' wi§n§w} ‡dd∞pO`the#3$s˝C4uri%asc'wli.eHy$		5¸hsdX @iagekmVÔr} 4*wÆshÈfr¢0: pu3Ë" Õheb7c®i;-ä		}ù)\
}9}	

'/ C„qu()dctdbtÈon`dıjatio v/r `ba¯IlvIrs*gnd$t{e~s`ÊDsJÚ]jbdiéÊ +,2re`t\r%bilperVKb‘sqfsrÎrÙ{ËxsÙ:ucu=r`, oPpior,a?jiÁÏNyNpTiozs< jqXH÷,‰ataTX`e0?" xm\eÚoaÏ!(/, inRxEctal"/.$iJdernel`*- 	(;
M
det·T9pf‡=$dc4a‘yp% ¯~`OptiiÓs™`it!PyÏqh0,Mª	iÔÛpegtu` = ijÒDec6Âd(l~ {5;è
* Ynrt%eu•@Z dqpaPIre ]"=≤d≥1e;
	
	ˆar0l»wQ`= ptr}c‰useJÃAthT˝pÂ\<
	i†<"1,é8âlAj&tn = lisı`? lirp¶le.gh0“!8.Igxcc|÷Âœnhy$5≠ ;|bur4‰p%p===!pr˜fimeÚs )-JMsml·cthn{-ÇÕfob ("?(i!plentµ¯ &&)((m¯Ecu|uo˛Oy |˝#!sel·ztioj+®~;+ i ˘msangc·on 5†
i3z9£i y( ktIo~s ~I&yncÈo@`iMoq, jt]
r†);M
=Ω/ I6 we dm\"8eekRac$d` vn"Ano|HeS ‰!dk–YpEç	? wu°p‡xcvid2e!ID0epu„dTiOı(?n]y a_unwv DoleeÏrmae{
9çjv0Ó tqq≈Mæ"ri.dctiom }=1 s¥rÈn7!   [>Iad (`!ex%bteN˛,: ||pAhTeKtmd[‡3d|a#tioj]$) ˚JâM	isEtqct}sn æ1und≈vIna,;
		}`Âmqa`[Lö		otlonc.\Òv!\ris*Ùn„Nkft±†s%\dcÙiona);ô
	H	_llÂcvZooÄ/$ÈnsxgcurefÌlversNrVRAnw`Ár~Q-
	I	s4ˆub¥cre,"epty#~3l`OZa„©jÅ|Nuvqon#*cj4JHZ® Zelac|yOn,°in;QÂ„tÂ #:L°y
		}ç
	}à	;/2Åf(v!'Úg Oo|{$…xeguq	f]$/r *kt@ino!was welQgdedé
?m VÂ0dÚx†vhd cat'hfhn!†a|aTIpd oˆ f| doFÂ ®¸`gEd[Kif$(`)aÂ|gcut!jMqÄpv -zal·ct+g, !1,6†ailzTÂ#ıee[$2* M$({
≠	seNectÌon"=h=nxp%ctPzefje|e2s_rT`anstOcds(ç
			˜UsTctux°,§os\emns,#nvig°NalOp5yjsN1jqHQ((≥*b,!ij{`eCt·d():
Ì
H/nnwbuz3ÌpyS¯aN$oÏly8opeb}Dh.f!pefihtÂrV	,
	Ø/ ¬uf§iVglhDr¥0Gno2%§ „u d`f$CCjldr")Lv˝‡t!aaR‰
M≤aturm!ÛÂ¸ecmi*l€…]ç
? Q Òqecyal a0tan‰4$œr Òoe opuimnsäo+0t(aÙ£t·jes "dmaƒ$ wpıion*!®Dgt8u%‚m1eeeqÒ%xtendad)
'? ÷ixes†"8887≈äuoamÔn a™e˙≈xtef($tiRÂe˘ç"≥zc$9¢/é	rar Îu9,(edE0,œ
à&nqMp)on˙lu j[ueRyÓaHaxi‰u)ÓGs?Dl)vOrÙimÓ{$¥l0Û}≥	*	f?Ú∞(∞+!˘"ko&Ypg ) {
)Yif‰h ßrc[ koÌ2›0!5<0u:DÂdneb$i®Y	(&lQvOs`Iq[key ] :!ıqreed$:4 &eep°L|"(&d‰ep°ez=° ( -Z)i%u†^$5"sa[,Km˘ ]9à	|KI}N#i."  dEet )(g
	HjQYmzy.epleÓ$! trsı tavw%t,'$%F`$);*u=}-*JjQeE2yl˜.'xtend8y ôhka¥ Êu.ctiÔJ("UÚlÏ par!}s,jc„d|fack ) s(Öhf08 tòdegf§5rl !==`*sx≤Ë.ı"`6&(lOa$†)0{çA	retuzo lo%F.1pqh{ †tj)s< dRguieÓtq†)ªú		//!Do~%Ù†do†`1Ûtsu‰st,iw$koÂle≈-˙\; qBe eilg r!qudzı-PM´ø ulsÂ If0)a!§HAs.ÓeNgtj†) {ç
		betırm thisk}
*Y4k2 %f ºsrnØhd%xè«("2 ¢pi{JiAct8(0off >9h0`)ßs-
	àr·‡!AeL`#tOb !!tbm.2li#%"dofb, ebm*ÏmlEpk (ª¿	Hern†< urmæsl	cc( 0,1ofb(	;
<	}•K		?ÆhDe"iu-t$tÎ)a#¿mT"z`qıgs
I	ˆÂb t…qÂ`= b7EÙ2+bÑ/Ø°Ef®V(a!”≈g˚jd p·;akcvt0wAqbpro3Id%l	`g -!q±vkÈ3"!{ÕII	//∞Yd0Bu's1a0f‡Ó+dikÓ	aF*, jPWetyÆo≥}ngilÍ: PeV¡lªå) +OäIA	-#DWm0arsu-Â†t et*iˆs‡4$e&jeÏllecKM
I	)gelnBAgk`}`pa2aÌSJ#	rkrc-Ò < pldehned;J
	
	E
0ov`tr3HSg-$‚eaL‰-a!qarhd r|rincä(h| e,}m If (t;pÂo‚ pA2amR"9±=≤fRya%t" )`;	!â		pav`m≥%=†kSqerYÆP`rAmh!hAra<Û,§bQesi-cnah”ettin3gÙ"„leÙ{oN`Õ !ª			t`g†ø ≤PO”T:9 	 +Ì™)	}Ó
	“£r!{e,b∞5 thiì3J	/o(S¡`}msT$xmU rDlotÂrrkaumÌˆ|I	*Qe5by$qJq˙(
Bç®ur|:`72l-%
)âtyXc: ty‰o/H	M,t#dsype:Ç&LtL*".	daT¡< –Ère`s>Ø
	Iè/ Énmx|ud% call`abk"(ze3pooseRext kÛ$ısedKÚTh˙oammy)çHÉc/nt}-ti> f,n{tinN( Huÿk¬(·datu≥$!ˆespk/seTgXt('!_
Ã(	ë// tœz)(|h%`tÛpmnwe !s†rdÃaifIlby ‰x5#oa8HR†ocJ]cD…ö	 red¸onwTÌxp = ÁÒPÀR"“g~0ore‘%˘t;D	â…/%Yf qp`caqsvÂ,| h˛ceS|tP_±HTML Y
vˇ`ijl#4juictC@mv  leefÓ}sà≠h+	kv * ¯qX»Rni3v°3Ôl6ed:)!® j]	ëIØ/s$x05:`Bet(t`µ`act}! †R%sxOÓqe1m. C!wÂ-			//$a dAt`Fkluar(lr `re{e6¸$IJ Q*axR5tti@cpM
	 [bqX»V+gL%)jÙnedigÆ\`r0- ?-
Iô	)	beuxgnreD-h‰  r"	  y9;≠ôã*? Ûdg`in$· s%l%ct.Ù wuD std„kd`ed:)Y		ssl&.i¥˝l≥e¨u‚ÙoÚ =/1K)	)ØØ C eavU0c dÛ≠mYfÈytmcËOl$u(e0peÛv-u3
					hQUesy)"=‡aw>&)-			Y	!/'A.jesÙb|h c.ÓtÂ*|Û`oF	Ù®d dgKUm«fr†iNÍ†b%mndmng`dHe scripts
							// to avoid any 'Permission Denied' errors in IE
							.append(responseText.replace(rscript, ""))

							// Locate the specified elements
							.find(selector) :

						// If not, just inject the full result
						responseText );
				}

				if ( callback ) {
					self.each( callback, [ responseText, status, jqXHR ] );
				}
			}
		});

		return this;
	},

	serialize: function() {
		return jQuery.param( this.serializeArray() );
	},

	serializeArray: function() {
		return this.map(function(){
			return this.elements ? jQuery.makeArray( this.elements ) : this;
		})
		.filter(function(){
			return this.name && !this.disabled &&
				( this.checked || rselectTextarea.test( this.nodeName ) ||
					rinput.test( this.type ) );
		})
		.map(function( i, elem ){
			var val = jQuery( this ).val();

			return val == null ?
				null :
				jQuery.isArray( val ) ?
					jQuery.map( val, function( val, i ){
						return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
					}) :
					{ name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
		}).get();
	}
});

// Attach a bunch of functions for handling common AJAX events
jQuery.each( "ajaxStart ajaxStop ajaxComplete ajaxError ajaxSuccess ajaxSend".split( " " ), function( i, o ){
	jQuery.fn[ o ] = function( f ){
		return this.on( o, f );
	};
});

jQuery.each( [ "get", "post" ], function( i, method ) {
	jQuery[ method ] = function( url, data, callback, type ) {
		// shift arguments if data argument was omitted
		if ( jQuery.isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = undefined;
		}

		return jQuery.ajax({
			type: method,
			url: url,
			data: data,
			success: callback,
			dataType: type
		});
	};
});

jQuery.extend({

	getScript: function( url, callback ) {
		return jQuery.get( url, undefined, callback, "script" );
	},

	getJSON: function( url, data, callback ) {
		return jQuery.get( url, data, callback, "json" );
	},

	// Creates a full fledged settings object into target
	// with both ajaxSettings and settings fields.
	// If target is omitted, writes into ajaxSettings.
	ajaxSetup: function( target, settings ) {
		if ( settings ) {
			// Building a settings object
			ajaxExtend( target, jQuery.ajaxSettings );
		} else {
			// Extending ajaxSettings
			settings = target;
			target = jQuery.ajaxSettings;
		}
		ajaxExtend( target, settings );
		return target;
	},

	ajaxSettings: {
		url: ajaxLocation,
		isLocal: rlocalProtocol.test( ajaxLocParts[ 1 ] ),
		global: true,
		type: "GET",
		contentType: "application/x-www-form-urlencoded",
		processData: true,
		async: true,
		/*
		timeout: 0,
		data: null,
		dataType: null,
		username: null,
		password: null,
		cache: null,
		traditional: false,
		headers: {},
		*/

		accepts: {
			xml: "application/xml, text/xml",
			html: "text/html",
			text: "text/plain",
			json: "application/json, text/javascript",
			"*": allTypes
		},

		contents: {
			xml: /xml/,
			html: /html/,
			json: /json/
		},

		responseFields: {
			xml: "responseXML",
			text: "responseText"
		},

		// List of data converters
		// 1) key format is "source_type destination_type" (a single space in-between)
		// 2) the catchall symbol "*" can be used for source_type
		converters: {

			// Convert anything to text
			"* text": window.String,

			// Text to html (true = no transformation)
			"text html": true,

			// Evaluate text as a json expression
			"text json": jQuery.parseJSON,

			// Parse text as xml
			"text xml": jQuery.parseXML
		},

		// For options that shouldn't be deep extended:
		// you can add your own custom options here if
		// and when you create one that shouldn't be
		// deep extended (see ajaxExtend)
		flatOptions: {
			context: true,
			url: true
		}
	},

	ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
	ajaxTransport: addToPrefiltersOrTransports( transports ),

	// Main method
	ajax: function( url, options ) {

		// If url is an object, simulate pre-1.5 signature
		if ( typeof url === "object" ) {
			options = url;
			url = undefined;
		}

		// Force options to be an object
		options = options || {};

		var // Create the final options object
			s = jQuery.ajaxSetup( {}, options ),
			// Callbacks context
			callbackContext = s.context || s,
			// Context for global events
			// It's the callbackContext if one was provided in the options
			// and if it's a DOM node or a jQuery collection
			globalEventContext = callbackContext !== s &&
				( callbackContext.nodeType || callbackContext instanceof jQuery ) ?
						jQuery( callbackContext ) : jQuery.event,
			// Deferreds
			deferred = jQuery.Deferred(),
			completeDeferred = jQuery.Callbacks( "once memory" ),
			// Status-dependent callbacks
			statusCode = s.statusCode || {},
			// ifModified key
			ifModifiedKey,
			// Headers (they are sent all at once)
			requestHeaders = {},
			requestHeadersNames = {},
			// Response headers
			responseHeadersString,
			responseHeaders,
			// transport
			transport,
			// timeout handle
			timeoutTimer,
			// Cross-domain detection vars
			parts,
			// The jqXHR state
			state = 0,
			// To know if global events are to be dispatched
			fireGlobals,
			// Loop variable
			i,
			// Fake xhr
			jqXHR = {

				readyState: 0,

				// Caches the header
				setRequestHeader: function( name, value ) {
					if ( !state ) {
						var lname = name.toLowerCase();
						name = requestHeadersNames[ lname ] = requestHeadersNames[ lname ] || name;
						requestHeaders[ name ] = value;
					}
					return this;
				},

				// Raw string
				getAllResponseHeaders: function() {
					return state === 2 ? responseHeadersString : null;
				},

				// Builds headers hashtable if needed
				getResponseHeader: function( key ) {
					var match;
					if ( state === 2 ) {
						if ( !responseHeaders ) {
							responseHeaders = {};
							while( ( match = rheaders.exec( responseHeadersString ) ) ) {
								responseHeaders[ match[1].toLowerCase() ] = match[ 2 ];
							}
						}
						match = responseHeaders[ key.toLowerCase() ];
					}
					return match === undefined ? null : match;
				},

				// Overrides response content-type header
				overrideMimeType: function( type ) {
					if ( !state ) {
						s.mimeType = type;
					}
					return this;
				},

				// Cancel the request
				abort: function( statusText ) {
					statusText = statusText || "abort";
					if ( transport ) {
						transport.abort( statusText );
					}
					done( 0, statusText );
					return this;
				}
			};

		// Callback for when everything is done
		// It is defined here because jslint complains if it is declared
		// at the end of the function (which would be more logical and readable)
		function done( status, nativeStatusText, responses, headers ) {

			// Called once
			if ( state === 2 ) {
				return;
			}

			// State is "done" now
			state = 2;

			// Clear timeout if it exists
			if ( timeoutTimer ) {
				clearTimeout( timeoutTimer );
			}

			// Dereference transport for early garbage collection
			// (no matter how long the jqXHR object will be used)
			transport = undefined;

			// Cache response headers
			responseHeadersString = headers || "";

			// Set readyState
			jqXHR.readyState = status > 0 ? 4 : 0;

			var isSuccess,
				success,
				error,
				statusText = nativeStatusText,
				response = responses ? ajaxHandleResponses( s, jqXHR, responses ) : undefined,
				lastModified,
				etag;

			// If successful, handle type chaining
			if ( status >= 200 && status < 300 || status === 304 ) {

				// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
				if ( s.ifModified ) {

					if ( ( lastModified = jqXHR.getResponseHeader( "Last-Modified" ) ) ) {
						jQuery.lastModified[ ifModifiedKey ] = lastModified;
					}
					if ( ( etag = jqXHR.getResponseHeader( "Etag" ) ) ) {
						jQuery.etag[ ifModifiedKey ] = etag;
					}
				}

				// If not modified
				if ( status === 304 ) {

					statusText = "notmodified";
					isSuccess = true;

				// If we have data
				} else {

					try {
						success = ajaxConvert( s, response );
						statusText = "success";
						isSuccess = true;
					} catch(e) {
						// We have a parsererror
						statusText = "parsererror";
						error = e;
					}
				}
			} else {
				// We extract error from statusText
				// then normalize statusText and status for non-aborts
				error = statusText;
				if ( !statusText || status ) {
					statusText = "error";
					if ( status < 0 ) {
						status = 0;
					}
				}
			}

			// Set data for the fake xhr object
			jqXHR.status = status;
			jqXHR.statusText = "" + ( nativeStatusText || statusText );

			// Success/Error
			if ( isSuccess ) {
				deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
			} else {
				deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
			}

			// Status-dependent callbacks
			jqXHR.statusCode( statusCode );
			statusCode = undefined;

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajax" + ( isSuccess ? "Success" : "Error" ),
						[ jqXHR, s, isSuccess ? success : error ] );
			}

			// Complete
			completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );
				// Handle the global AJAX counter
				if ( !( --jQuery.active ) ) {
					jQuery.event.trigger( "ajaxStop" );
				}
			}
		}

		// Attach deferreds
		deferred.promise( jqXHR );
		jqXHR.success = jqXHR.done;
		jqXHR.error = jqXHR.fail;
		jqXHR.complete = completeDeferred.add;

		// Status-dependent callbacks
		jqXHR.statusCode = function( map ) {
			if ( map ) {
				var tmp;
				if ( state < 2 ) {
					for ( tmp in map ) {
						statusCode[ tmp ] = [ statusCode[tmp], map[tmp] ];
					}
				} else {
					tmp = map[ jqXHR.status ];
					jqXHR.then( tmp, tmp );
				}
			}
			return this;
		};

		// Remove hash character (#7531: and string promotion)
		// Add protocol if not provided (#5866: IE7 issue with protocol-less urls)
		// We also use the url parameter if available
		s.url = ( ( url || s.url ) + "" ).replace( rhash, "" ).replace( rprotocol, ajaxLocParts[ 1 ] + "//" );

		// Extract dataTypes list
		s.dataTypes = jQuery.trim( s.dataType || "*" ).toLowerCase().split( rspacesAjax );

		// Determine if a cross-domain request is in order
		if ( s.crossDomain == null ) {
			parts = rurl.exec( s.url.toLowerCase() );
			s.crossDomain = !!( parts &&
				( parts[ 1 ] != ajaxLocParts[ 1 ] || parts[ 2 ] != ajaxLocParts[ 2 ] ||
					( parts[ 3 ] || ( parts[ 1 ] === "http:" ? 80 : 443 ) ) !=
						( ajaxLocParts[ 3 ] || ( ajaxLocParts[ 1 ] === "http:" ? 80 : 443 ) ) )
			);
		}

		// Convert data if not already a string
		if ( s.data && s.processData && typeof s.data !== "string" ) {
			s.data = jQuery.param( s.data, s.traditional );
		}

		// Apply prefilters
		inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

		// If request was aborted inside a prefiler, stop there
		if ( state === 2 ) {
			return false;
		}

		// We can fire global events as of now if asked to
		fireGlobals = s.global;

		// Uppercase the type
		s.type = s.type.toUpperCase();

		// Determine if request has content
		s.hasContent = !rnoContent.test( s.type );

		// Watch for a new set of requests
		if ( fireGlobals && jQuery.active++ === 0 ) {
			jQuery.event.trigger( "ajaxStart" );
		}

		// More options handling for requests with no content
		if ( !s.hasContent ) {

			// If data is available, append data to url
			if ( s.data ) {
				s.url += ( rquery.test( s.url ) ? "&" : "?" ) + s.data;
				// #9682: remove data so that it's not used in an eventual retry
				delete s.data;
			}

			// Get ifModifiedKey before adding the anti-cache parameter
			ifModifiedKey = s.url;

			// Add anti-cache in url if needed
			if ( s.cache === false ) {

				var ts = jQuery.now(),
					// try replacing _= if it is there
					ret = s.url.replace( rts, "$1_=" + ts );

				// if nothing was replaced, add timestamp to the end
				s.url = ret + ( ( ret === s.url ) ? ( rquery.test( s.url ) ? "&" : "?" ) + "_=" + ts : "" );
			}
		}

		// Set the correct header, if data is being sent
		if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
			jqXHR.setRequestHeader( "Content-Type", s.contentType );
		}

		// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
		if ( s.ifModified ) {
			ifModifiedKey = ifModifiedKey || s.url;
			if ( jQuery.lastModified[ ifModifiedKey ] ) {
				jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ ifModifiedKey ] );
			}
			if ( jQuery.etag[ ifModifiedKey ] ) {
				jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ ifModifiedKey ] );
			}
		}

		// Set the Accepts header for the server, depending on the dataType
		jqXHR.setRequestHeader(
			"Accept",
			s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[0] ] ?
				s.accepts[ s.dataTypes[0] ] + ( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
				s.accepts[ "*" ]
		);

		// Check for headers option
		for ( i in s.headers ) {
			jqXHR.setRequestHeader( i, s.headers[ i ] );
		}

		// Allow custom headers/mimetypes and early abort
		if ( s.beforeSend && ( s.beforeSend.call( callbackContext, jqXHR, s ) === false || state === 2 ) ) {
				// Abort if not done already
				jqXHR.abort();
				return false;

		}

		// Install callbacks on deferreds
		for ( i in { success: 1, error: 1, complete: 1 } ) {
			jqXHR[ i ]( s[ i ] );
		}

		// Get transport
		transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

		// If no transport, we auto-abort
		if ( !transport ) {
			done( -1, "No Transport" );
		} else {
			jqXHR.readyState = 1;
			// Send global event
			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
			}
			// Timeout
			if ( s.async && s.timeout > 0 ) {
				timeoutTimer = setTimeout( function(){
					jqXHR.abort( "timeout" );
				}, s.timeout );
			}

			try {
				state = 1;
				transport.send( requestHeaders, done );
			} catch (e) {
				// Propagate exception as error if not done
				if ( state < 2 ) {
					done( -1, e );
				// Simply rethrow otherwise
				} else {
					throw e;
				}
			}
		}

		return jqXHR;
	},

	// Serialize an array of form elements or a set of
	// key/values into a query string
	param: function( a, traditional ) {
		var s = [],
			add = function( key, value ) {
				// If value is a function, invoke it and return its value
				value = jQuery.isFunction( value ) ? value() : value;
				s[ s.length ] = encodeURIComponent( key ) + "=" + encodeURIComponent( value );
			};

		// Set traditional to true for jQuery <= 1.3.2 behavior.
		if ( traditional === undefined ) {
			traditional = jQuery.ajaxSettings.traditional;
		}

		// If an array was passed in, assume that it is an array of form elements.
		if ( jQuery.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {
			// Serialize the form elements
			jQuery.each( a, function() {
				add( this.name, this.value );
			});

		} else {
			// If traditional, encode the "old" way (the way 1.3.2 or older
			// did it), otherwise encode params recursively.
			for ( var prefix in a ) {
				buildParams( prefix, a[ prefix ], traditional, add );
			}
		}

		// Return the resulting serialization
		return s.join( "&" ).replace( r20, "+" );
	}
});

function buildParams( prefix, obj, traditional, add ) {
	if ( jQuery.isArray( obj ) ) {
		// Serialize array item.
		jQuery.each( obj, function( i, v ) {
			if ( traditional || rbracket.test( prefix ) ) {
				// Treat each array item as a scalar.
				add( prefix, v );

			} else {
				// If array item is non-scalar (array or object), encode its
				// numeric index to resolve deserialization ambiguity issues.
				// Note that rack (as of 1.0.0) can't currently deserialize
				// nested arrays properly, and attempting to do so may cause
				// a server error. Possible fixes are to modify rack's
				// deserialization algorithm or to provide an option or flag
				// to force array serialization to be shallow.
				buildParams( prefix + "[" + ( typeof v === "object" || jQuery.isArray(v) ? i : "" ) + "]", v, traditional, add );
			}
		});

	} else if ( !traditional && obj != null && typeof obj === "object" ) {
		// Serialize object item.
		for ( var name in obj ) {
			buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
		}

	} else {
		// Serialize scalar item.
		add( prefix, obj );
	}
}

// This is still on the jQuery object... for now
// Want to move this to jQuery.ajax some day
jQuery.extend({

	// Counter for holding the number of active queries
	active: 0,

	// Last-Modified header cache for next request
	lastModified: {},
	etag: {}

});

/* Handles responses to an ajax request:
 * - sets all responseXXX fields accordingly
 * - finds the right dataType (mediates between content-type and expected dataType)
 * - returns the corresponding response
 */
function ajaxHandleResponses( s, jqXHR, responses ) {

	var contents = s.contents,
		dataTypes = s.dataTypes,
		responseFields = s.responseFields,
		ct,
		type,
		finalDataType,
		firstDataType;

	// Fill responseXXX fields
	for ( type in responseFields ) {
		if ( type in responses ) {
			jqXHR[ responseFields[type] ] = responses[ type ];
		}
	}

	// Remove auto dataType and get content-type in the process
	while( dataTypes[ 0 ] === "*" ) {
		dataTypes.shift();
		if ( ct === undefined ) {
			ct = s.mimeType || jqXHR.getResponseHeader( "content-type" );
		}
	}

	// Check if we're dealing with a known content-type
	if ( ct ) {
		for ( type in contents ) {
			if ( contents[ type ] && contents[ type ].test( ct ) ) {
				dataTypes.unshift( type );
				break;
			}
		}
	}

	// Check to see if we have a response for the expected dataType
	if ( dataTypes[ 0 ] in responses ) {
		finalDataType = dataTypes[ 0 ];
	} else {
		// Try convertible dataTypes
		for ( type in responses ) {
			if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[0] ] ) {
				finalDataType = type;
				break;
			}
			if ( !firstDataType ) {
				firstDataType = type;
			}
		}
		// Or just use first one
		finalDataType = finalDataType || firstDataType;
	}

	// If we found a dataType
	// We add the dataType to the list if needed
	// and return the corresponding response
	if ( finalDataType ) {
		if ( finalDataType !== dataTypes[ 0 ] ) {
			dataTypes.unshift( finalDataType );
		}
		return responses[ finalDataType ];
	}
}

// Chain conversions given the request and the original response
function ajaxConvert( s, response ) {

	// Apply the dataFilter if provided
	if ( s.dataFilter ) {
		response = s.dataFilter( response, s.dataType );
	}

	var dataTypes = s.dataTypes,
		converters = {},
		i,
		key,
		length = dataTypes.length,
		tmp,
		// Current and previous dataTypes
		current = dataTypes[ 0 ],
		prev,
		// Conversion expression
		conversion,
		// Conversion function
		conv,
		// Conversion functions (transitive conversion)
		conv1,
		conv2;

	// For each dataType in the chain
	for ( i = 1; i < length; i++ ) {

		// Create converters map
		// with lowercased keys
		if ( i === 1 ) {
			for ( key in s.converters ) {
				if ( typeof key === "string" ) {
					converters[ key.toLowerCase() ] = s.converters[ key ];
				}
			}
		}

		// Get the dataTypes
		prev = current;
		current = dataTypes[ i ];

		// If current is auto dataType, update it to prev
		if ( current === "*" ) {
			current = prev;
		// If no auto and dataTypes are actually different
		} else if ( prev !== "*" && prev !== current ) {

			// Get the converter
			conversion = prev + " " + current;
			conv = converters[ conversion ] || converters[ "* " + current ];

			// If there is no direct converter, search transitively
			if ( !conv ) {
				conv2 = undefined;
				for ( conv1 in converters ) {
					tmp = conv1.split( " " );
					if ( tmp[ 0 ] === prev || tmp[ 0 ] === "*" ) {
						conv2 = converters[ tmp[1] + " " + current ];
						if ( conv2 ) {
							conv1 = converters[ conv1 ];
							if ( conv1 === true ) {
								conv = conv2;
							} else if ( conv2 === true ) {
								conv = conv1;
							}
							break;
						}
					}
				}
			}
			// If we found no converter, dispatch an error
			if ( !( conv || conv2 ) ) {
				jQuery.error( "No conversion from " + conversion.replace(" "," to ") );
			}
			// If found converter is not an equivalence
			if ( conv !== true ) {
				// Convert with 1 or 2 converters accordingly
				response = conv ? conv( response ) : conv2( conv1(response) );
			}
		}
	}
	return response;
}




var jsc = jQuery.now(),
	jsre = /(\=)\?(&|$)|\?\?/i;

// Default jsonp settings
jQuery.ajaxSetup({
	jsonp: "callback",
	jsonpCallback: function() {
		return jQuery.expando + "_" + ( jsc++ );
	}
});

// Detect, normalize options and install callbacks for jsonp requests
jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

	var inspectData = s.contentType === "application/x-www-form-urlencoded" &&
		( typeof s.data === "string" );

	if ( s.dataTypes[ 0 ] === "jsonp" ||
		s.jsonp !== false && ( jsre.test( s.url ) ||
				inspectData && jsre.test( s.data ) ) ) {

		var responseContainer,
			jsonpCallback = s.jsonpCallback =
				jQuery.isFunction( s.jsonpCallback ) ? s.jsonpCallback() : s.jsonpCallback,
			previous = window[ jsonpCallback ],
			url = s.url,
			data = s.data,
			replace = "$1" + jsonpCallback + "$2";

		if ( s.jsonp !== false ) {
			url = url.replace( jsre, replace );
			if ( s.url === url ) {
				if ( inspectData ) {
					data = data.replace( jsre, replace );
				}
				if ( s.data === data ) {
					// Add callback manually
					url += (/\?/.test( url ) ? "&" : "?") + s.jsonp + "=" + jsonpCallback;
				}
			}
		}

		s.url = url;
		s.data = data;

		// Install callback
		window[ jsonpCallback ] = function( response ) {
			responseContainer = [ response ];
		};

		// Clean-up function
		jqXHR.always(function() {
			// Set callback back to previous value
			window[ jsonpCallback ] = previous;
			// Call if it was a function and we have a response
			if ( responseContainer && jQuery.isFunction( previous ) ) {
				window[ jsonpCallback ]( responseContainer[ 0 ] );
			}
		});

		// Use data converter to retrieve json after script execution
		s.converters["script json"] = function() {
			if ( !responseContainer ) {
				jQuery.error( jsonpCallback + " was not called" );
			}
			return responseContainer[ 0 ];
		};

		// force json dataType
		s.dataTypes[ 0 ] = "json";

		// Delegate to script
		return "script";
	}
});




// Install script dataType
jQuery.ajaxSetup({
	accepts: {
		script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
	},
	contents: {
		script: /javascript|ecmascript/
	},
	converters: {
		"text script": function( text ) {
			jQuery.globalEval( text );
			return text;
		}
	}
});

// Handle cache's special case and global
jQuery.ajaxPrefilter( "script", function( s ) {
	if ( s.cache === undefined ) {
		s.cache = false;
	}
	if ( s.crossDomain ) {
		s.type = "GET";
		s.global = false;
	}
});

// Bind script tag hack transport
jQuery.ajaxTransport( "script", function(s) {

	// This transport only deals with cross domain requests
	if ( s.crossDomain ) {

		var script,
			head = document.head || document.getElementsByTagName( "head" )[0] || document.documentElement;

		return {

			send: function( _, callback ) {

				script = document.createElement( "script" );

				script.async = "async";

				if ( s.scriptCharset ) {
					script.charset = s.scriptCharset;
				}

				script.src = s.url;

				// Attach handlers for all browsers
				script.onload = script.onreadystatechange = function( _, isAbort ) {

					if ( isAbort || !script.readyState || /loaded|complete/.test( script.readyState ) ) {

						// Handle memory leak in IE
						script.onload = script.onreadystatechange = null;

						// Remove the script
						if ( head && script.parentNode ) {
							head.removeChild( script );
						}

						// Dereference the script
						script = undefined;

						// Callback if not abort
						if ( !isAbort ) {
							callback( 200, "success" );
						}
					}
				};
				// Use insertBefore instead of appendChild  to circumvent an IE6 bug.
				// This arises when a base node is used (#2709 and #4378).
				head.insertBefore( script, head.firstChild );
			},

			abort: function() {
				if ( script ) {
					script.onload( 0, 1 );
				}
			}
		};
	}
});




var // #5280: Internet Explorer will keep connections alive if we don't abort on unload
	xhrOnUnloadAbort = window.ActiveXObject ? function() {
		// Abort all pending requests
		for ( var key in xhrCallbacks ) {
			xhrCallbacks[ key ]( 0, 1 );
		}
	} : false,
	xhrId = 0,
	xhrCallbacks;

// Functions to create xhrs
function createStandardXHR() {
	try {
		return new window.XMLHttpRequest();
	} catch( e ) {}
}

function createActiveXHR() {
	try {
		return new window.ActiveXObject( "Microsoft.XMLHTTP" );
	} catch( e ) {}
}

// Create the request object
// (This is still attached to ajaxSettings for backward compatibility)
jQuery.ajaxSettings.xhr = window.ActiveXObject ?
	/* Microsoft failed to properly
	 * implement the XMLHttpRequest in IE7 (can't request local files),
	 * so we use the ActiveXObject when it is available
	 * Additionally XMLHttpRequest can be disabled in IE7/IE8 so
	 * we need a fallback.
	 */
	function() {
		return !this.isLocal && createStandardXHR() || createActiveXHR();
	} :
	// For all other browsers, use the standard XMLHttpRequest object
	createStandardXHR;

// Determine support properties
(function( xhr ) {
	jQuery.extend( jQuery.support, {
		ajax: !!xhr,
		cors: !!xhr && ( "withCredentials" in xhr )
	});
})( jQuery.ajaxSettings.xhr() );

// Create transport if the browser can provide an xhr
if ( jQuery.support.ajax ) {

	jQuery.ajaxTransport(function( s ) {
		// Cross domain only allowed if supported through XMLHttpRequest
		if ( !s.crossDomain || jQuery.support.cors ) {

			var callback;

			return {
				send: function( headers, complete ) {

					// Get a new xhr
					var xhr = s.xhr(),
						handle,
						i;

					// Open the socket
					// Passing null username, generates a login popup on Opera (#2865)
					if ( s.username ) {
						xhr.open( s.type, s.url, s.async, s.username, s.password );
					} else {
						xhr.open( s.type, s.url, s.async );
					}

					// Apply custom fields if provided
					if ( s.xhrFields ) {
						for ( i in s.xhrFields ) {
							xhr[ i ] = s.xhrFields[ i ];
						}
					}

					// Override mime type if needed
					if ( s.mimeType && xhr.overrideMimeType ) {
						xhr.overrideMimeType( s.mimeType );
					}

					// X-Requested-With header
					// For cross-domain requests, seeing as conditions for a preflight are
					// akin to a jigsaw puzzle, we simply never set it to be sure.
					// (it can always be set on a per-request basis or even using ajaxSetup)
					// For same-domain requests, won't change header if already provided.
					if ( !s.crossDomain && !headers["X-Requested-With"] ) {
						headers[ "X-Requested-With" ] = "XMLHttpRequest";
					}

					// Need an extra try/catch for cross domain requests in Firefox 3
					try {
						for ( i in headers ) {
							xhr.setRequestHeader( i, headers[ i ] );
						}
					} catch( _ ) {}

					// Do send the request
					// This may raise an exception which is actually
					// handled in jQuery.ajax (so no try/catch here)
					xhr.send( ( s.hasContent && s.data ) || null );

					// Listener
					callback = function( _, isAbort ) {

						var status,
							statusText,
							responseHeaders,
							responses,
							xml;

						// Firefox throws exceptions when accessing properties
						// of an xhr when a network error occured
						// http://helpful.knobs-dials.com/index.php/Component_returned_failure_code:_0x80040111_(NS_ERROR_NOT_AVAILABLE)
						try {

							// Was never called and is aborted or complete
							if ( callback && ( isAbort || xhr.readyState === 4 ) ) {

								// Only called once
								callback = undefined;

								// Do not keep as active anymore
								if ( handle ) {
									xhr.onreadystatechange = jQuery.noop;
									if ( xhrOnUnloadAbort ) {
										delete xhrCallbacks[ handle ];
									}
								}

								// If it's an abort
								if ( isAbort ) {
									// Abort it manually if needed
									if ( xhr.readyState !== 4 ) {
										xhr.abort();
									}
								} else {
									status = xhr.status;
									responseHeaders = xhr.getAllResponseHeaders();
									responses = {};
									xml = xhr.responseXML;

									// Construct response list
									if ( xml && xml.documentElement /* #4958 */ ) {
										responses.xml = xml;
									}
									responses.text = xhr.responseText;

									// Firefox throws an exception when accessing
									// statusText for faulty cross-domain requests
									try {
										statusText = xhr.statusText;
									} catch( e ) {
										// We normalize with Webkit giving an empty statusText
										statusText = "";
									}

									// Filter status for non standard behaviors

									// If the request is local and we have data: assume a success
									// (success with no data won't get notified, that's the best we
									// can do given current implementations)
									if ( !status && s.isLocal && !s.crossDomain ) {
										status = responses.text ? 200 : 404;
									// IE - #1450: sometimes returns 1223 when it should be 204
									} else if ( status === 1223 ) {
										status = 204;
									}
								}
							}
						} catch( firefoxAccessException ) {
							if ( !isAbort ) {
								complete( -1, firefoxAccessException );
							}
						}

						// Call complete if needed
						if ( responses ) {
							complete( status, statusText, responses, responseHeaders );
						}
					};

					// if we're in sync mode or it's in cache
					// and has been retrieved directly (IE6 & IE7)
					// we need to manually fire the callback
					if ( !s.async || xhr.readyState === 4 ) {
						callback();
					} else {
						handle = ++xhrId;
						if ( xhrOnUnloadAbort ) {
							// Create the active xhrs callbacks list if needed
							// and attach the unload handler
							if ( !xhrCallbacks ) {
								xhrCallbacks = {};
								jQuery( window ).unload( xhrOnUnloadAbort );
							}
							// Add to list of active xhrs callbacks
							xhrCallbacks[ handle ] = callback;
						}
						xhr.onreadystatechange = callback;
					}
				},

				abort: function() {
					if ( callback ) {
						callback(0,1);
					}
				}
			};
		}
	});
}




var elemdisplay = {},
	iframe, iframeDoc,
	rfxtypes = /^(?:toggle|show|hide)$/,
	rfxnum = /^([+\-]=)?([\d+.\-]+)([a-z%]*)$/i,
	timerId,
	fxAttrs = [
		// height animations
		[ "height", "marginTop", "marginBottom", "paddingTop", "paddingBottom" ],
		// width animations
		[ "width", "marginLeft", "marginRight", "paddingLeft", "paddingRight" ],
		// opacity animations
		[ "opacity" ]
	],
	fxNow;

jQuery.fn.extend({
	show: function( speed, easing, callback ) {
		var elem, display;

		if ( speed || speed === 0 ) {
			return this.animate( genFx("show", 3), speed, easing, callback );

		} else {
			for ( var i = 0, j = this.length; i < j; i++ ) {
				elem = this[ i ];

				if ( elem.style ) {
					display = elem.style.display;

					// Reset the inline display of this element to learn if it is
					// being hidden by cascaded rules or not
					if ( !jQuery._data(elem, "olddisplay") && display === "none" ) {
						display = elem.style.display = "";
					}

					// Set elements which have been overridden with display: none
					// in a stylesheet to whatever the default browser style is
					// for such an element
					if ( display === "" && jQuery.css(elem, "display") === "none" ) {
						jQuery._data( elem, "olddisplay", defaultDisplay(elem.nodeName) );
					}
				}
			}

			// Set the display of most of the elements in a second loop
			// to avoid the constant reflow
			for ( i = 0; i < j; i++ ) {
				elem = this[ i ];

				if ( elem.style ) {
					display = elem.style.display;

					if ( display === "" || display === "none" ) {
						elem.style.display = jQuery._data( elem, "olddisplay" ) || "";
					}
				}
			}

			return this;
		}
	},

	hide: function( speed, easing, callback ) {
		if ( speed || speed === 0 ) {
			return this.animate( genFx("hide", 3), speed, easing, callback);

		} else {
			var elem, display,
				i = 0,
				j = this.length;

			for ( ; i < j; i++ ) {
				elem = this[i];
				if ( elem.style ) {
					display = jQuery.css( elem, "display" );

					if ( display !== "none" && !jQuery._data( elem, "olddisplay" ) ) {
						jQuery._data( elem, "olddisplay", display );
					}
				}
			}

			// Set the display of the elements in a second loop
			// to avoid the constant reflow
			for ( i = 0; i < j; i++ ) {
				if ( this[i].style ) {
					this[i].style.display = "none";
				}
			}

			return this;
		}
	},

	// Save the old toggle function
	_toggle: jQuery.fn.toggle,

	toggle: function( fn, fn2, callback ) {
		var bool = typeof fn === "boolean";

		if ( jQuery.isFunction(fn) && jQuery.isFunction(fn2) ) {
			this._toggle.apply( this, arguments );

		} else if ( fn == null || bool ) {
			this.each(function() {
				var state = bool ? fn : jQuery(this).is(":hidden");
				jQuery(this)[ state ? "show" : "hide" ]();
			});

		} else {
			this.animate(genFx("toggle", 3), fn, fn2, callback);
		}

		return this;
	},

	fadeTo: function( speed, to, easing, callback ) {
		return this.filter(":hidden").css("opacity", 0).show().end()
					.animate({opacity: to}, speed, easing, callback);
	},

	animate: function( prop, speed, easing, callback ) {
		var optall = jQuery.speed( speed, easing, callback );

		if ( jQuery.isEmptyObject( prop ) ) {
			return this.each( optall.complete, [ false ] );
		}

		// Do not change referenced properties as per-property easing will be lost
		prop = jQuery.extend( {}, prop );

		function doAnimation() {
			// XXX 'this' does not always have a nodeName when running the
			// test suite

			if ( optall.queue === false ) {
				jQuery._mark( this );
			}

			var opt = jQuery.extend( {}, optall ),
				isElement = this.nodeType === 1,
				hidden = isElement && jQuery(this).is(":hidden"),
				name, val, p, e,
				parts, start, end, unit,
				method;

			// will store per property easing and be used to determine when an animation is complete
			opt.animatedProperties = {};

			for ( p in prop ) {

				// property name normalization
				name = jQuery.camelCase( p );
				if ( p !== name ) {
					prop[ name ] = prop[ p ];
					delete prop[ p ];
				}

				val = prop[ name ];

				// easing resolution: per property > opt.specialEasing > opt.easing > 'swing' (default)
				if ( jQuery.isArray( val ) ) {
					opt.animatedProperties[ name ] = val[ 1 ];
					val = prop[ name ] = val[ 0 ];
				} else {
					opt.animatedProperties[ name ] = opt.specialEasing && opt.specialEasing[ name ] || opt.easing || 'swing';
				}

				if ( val === "hide" && hidden || val === "show" && !hidden ) {
					return opt.complete.call( this );
				}

				if ( isElement && ( name === "height" || name === "width" ) ) {
					// Make sure that nothing sneaks out
					// Record all 3 overflow attributes because IE does not
					// change the overflow attribute when overflowX and
					// overflowY are set to the same value
					opt.overflow = [ this.style.overflow, this.style.overflowX, this.style.overflowY ];

					// Set display property to inline-block for height/width
					// animations on inline elements that are having width/height animated
					if ( jQuery.css( this, "display" ) === "inline" &&
							jQuery.css( this, "float" ) === "none" ) {

						// inline-level elements accept inline-block;
						// block-level elements need to be inline with layout
						if ( !jQuery.support.inlineBlockNeedsLayout || defaultDisplay( this.nodeName ) === "inline" ) {
							this.style.display = "inline-block";

						} else {
							this.style.zoom = 1;
						}
					}
				}
			}

			if ( opt.overflow != null ) {
				this.style.overflow = "hidden";
			}

			for ( p in prop ) {
				e = new jQuery.fx( this, opt, p );
				val = prop[ p ];

				if ( rfxtypes.test( val ) ) {

					// Tracks whether to show or hide based on private
					// data attached to the element
					method = jQuery._data( this, "toggle" + p ) || ( val === "toggle" ? hidden ? "show" : "hide" : 0 );
					if ( method ) {
						jQuery._data( this, "toggle" + p, method === "show" ? "hide" : "show" );
						e[ method ]();
					} else {
						e[ val ]();
					}

				} else {
					parts = rfxnum.exec( val );
					start = e.cur();

					if ( parts ) {
						end = parseFloat( parts[2] );
						unit = parts[3] || ( jQuery.cssNumber[ p ] ? "" : "px" );

						// We need to compute starting value
						if ( unit !== "px" ) {
							jQuery.style( this, p, (end || 1) + unit);
							start = ( (end || 1) / e.cur() ) * start;
							jQuery.style( this, p, start + unit);
						}

						// If a +=/-= token was provided, we're doing a relative animation
						if ( parts[1] ) {
							end = ( (parts[ 1 ] === "-=" ? -1 : 1) * end ) + start;
						}

						e.custom( start, end, unit );

					} else {
						e.custom( start, val, "" );
					}
				}
			}

			// For JS strict compliance
			return true;
		}

		return optall.queue === false ?
			this.each( doAnimation ) :
			this.queue( optall.queue, doAnimation );
	},

	stop: function( type, clearQueue, gotoEnd ) {
		if ( typeof type !== "string" ) {
			gotoEnd = clearQueue;
			clearQueue = type;
			type = undefined;
		}
		if ( clearQueue && type !== false ) {
			this.queue( type || "fx", [] );
		}

		return this.each(function() {
			var index,
				hadTimers = false,
				timers = jQuery.timers,
				data = jQuery._data( this );

			// clear marker counters if we know they won't be
			if ( !gotoEnd ) {
				jQuery._unmark( true, this );
			}

			function stopQueue( elem, data, index ) {
				var hooks = data[ index ];
				jQuery.removeData( elem, index, true );
				hooks.stop( gotoEnd );
			}

			if ( type == null ) {
				for ( index in data ) {
					if ( data[ index ] && data[ index ].stop && index.indexOf(".run") === index.length - 4 ) {
						stopQueue( this, data, index );
					}
				}
			} else if ( data[ index = type + ".run" ] && data[ index ].stop ){
				stopQueue( this, data, index );
			}

			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && (type == null || timers[ index ].queue === type) ) {
					if ( gotoEnd ) {

						// force the next step to be the last
						timers[ index ]( true );
					} else {
						timers[ index ].saveState();
					}
					hadTimers = true;
					timers.splice( index, 1 );
				}
			}

			// start the next in the queue if the last step wasn't forced
			// timers currently will call their complete callbacks, which will dequeue
			// but only if they were gotoEnd
			if ( !( gotoEnd && hadTimers ) ) {
				jQuery.dequeue( this, type );
			}
		});
	}

});

// Animations created synchronously will run synchronously
function createFxNow() {
	setTimeout( clearFxNow, 0 );
	return ( fxNow = jQuery.now() );
}

function clearFxNow() {
	fxNow = undefined;
}

// Generate parameters to create a standard animation
function genFx( type, num ) {
	var obj = {};

	jQuery.each( fxAttrs.concat.apply([], fxAttrs.slice( 0, num )), function() {
		obj[ this ] = type;
	});

	return obj;
}

// Generate shortcuts for custom animations
jQuery.each({
	slideDown: genFx( "show", 1 ),
	slideUp: genFx( "hide", 1 ),
	slideToggle: genFx( "toggle", 1 ),
	fadeIn: { opacity: "show" },
	fadeOut: { opacity: "hide" },
	fadeToggle: { opacity: "toggle" }
}, function( name, props ) {
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return this.animate( props, speed, easing, callback );
	};
});

jQuery.extend({
	speed: function( speed, easing, fn ) {
		var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
			complete: fn || !fn && easing ||
				jQuery.isFunction( speed ) && speed,
			duration: speed,
			easing: fn && easing || easing && !jQuery.isFunction( easing ) && easing
		};

		opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ? opt.duration :
			opt.duration in jQuery.fx.speeds ? jQuery.fx.speeds[ opt.duration ] : jQuery.fx.speeds._default;

		// normalize opt.queue - true/undefined/null -> "fx"
		if ( opt.queue == null || opt.queue === true ) {
			opt.queue = "fx";
		}

		// Queueing
		opt.old = opt.complete;

		opt.complete = function( noUnmark ) {
			if ( jQuery.isFunction( opt.old ) ) {
				opt.old.call( this );
			}

			if ( opt.queue ) {
				jQuery.dequeue( this, opt.queue );
			} else if ( noUnmark !== false ) {
				jQuery._unmark( this );
			}
		};

		return opt;
	},

	easing: {
		linear: function( p, n, firstNum, diff ) {
			return firstNum + diff * p;
		},
		swing: function( p, n, firstNum, diff ) {
			return ( ( -Math.cos( p*Math.PI ) / 2 ) + 0.5 ) * diff + firstNum;
		}
	},

	timers: [],

	fx: function( elem, options, prop ) {
		this.options = options;
		this.elem = elem;
		this.prop = prop;

		options.orig = options.orig || {};
	}

});

jQuery.fx.prototype = {
	// Simple function for setting a style value
	update: function() {
		if ( this.options.step ) {
			this.options.step.call( this.elem, this.now, this );
		}

		( jQuery.fx.step[ this.prop ] || jQuery.fx.step._default )( this );
	},

	// Get the current size
	cur: function() {
		if ( this.elem[ this.prop ] != null && (!this.elem.style || this.elem.style[ this.prop ] == null) ) {
			return this.elem[ this.prop ];
		}

		var parsed,
			r = jQuery.css( this.elem, this.prop );
		// Empty strings, null, undefined and "auto" are converted to 0,
		// complex values such as "rotate(1rad)" are returned as is,
		// simple values such as "10px" are parsed to Float.
		return isNaN( parsed = parseFloat( r ) ) ? !r || r === "auto" ? 0 : r : parsed;
	},

	// Start an animation from one number to another
	custom: function( from, to, unit ) {
		var self = this,
			fx = jQuery.fx;

		this.startTime = fxNow || createFxNow();
		this.end = to;
		this.now = this.start = from;
		this.pos = this.state = 0;
		this.unit = unit || this.unit || ( jQuery.cssNumber[ this.prop ] ? "" : "px" );

		function t( gotoEnd ) {
			return self.step( gotoEnd );
		}

		t.queue = this.options.queue;
		t.elem = this.elem;
		t.saveState = function() {
			if ( self.options.hide && jQuery._data( self.elem, "fxshow" + self.prop ) === undefined ) {
				jQuery._data( self.elem, "fxshow" + self.prop, self.start );
			}
		};

		if ( t() && jQuery.timers.push(t) && !timerId ) {
			timerId = setInterval( fx.tick, fx.interval );
		}
	},

	// Simple 'show' function
	show: function() {
		var dataShow = jQuery._data( this.elem, "fxshow" + this.prop );

		// Remember where we started, so that we can go back to it later
		this.options.orig[ this.prop ] = dataShow || jQuery.style( this.elem, this.prop );
		this.options.show = true;

		// Begin the animation
		// Make sure that we start at a small width/height to avoid any flash of content
		if ( dataShow !== undefined ) {
			// This show is picking up where a previous hide or show left off
			this.custom( this.cur(), dataShow );
		} else {
			this.custom( this.prop === "width" || this.prop === "height" ? 1 : 0, this.cur() );
		}

		// Start by showing the element
		jQuery( this.elem ).show();
	},

	// Simple 'hide' function
	hide: function() {
		// Remember where we started, so that we can go back to it later
		this.options.orig[ this.prop ] = jQuery._data( this.elem, "fxshow" + this.prop ) || jQuery.style( this.elem, this.prop );
		this.options.hide = true;

		// Begin the animation
		this.custom( this.cur(), 0 );
	},

	// Each step of an animation
	step: function( gotoEnd ) {
		var p, n, complete,
			t = fxNow || createFxNow(),
			done = true,
			elem = this.elem,
			options = this.options;

		if ( gotoEnd || t >= options.duration + this.startTime ) {
			this.now = this.end;
			this.pos = this.state = 1;
			this.update();

			options.animatedProperties[ this.prop ] = true;

			for ( p in options.animatedProperties ) {
				if ( options.animatedProperties[ p ] !== true ) {
					done = false;
				}
			}

			if ( done ) {
				// Reset the overflow
				if ( options.overflow != null && !jQuery.support.shrinkWrapBlocks ) {

					jQuery.each( [ "", "X", "Y" ], function( index, value ) {
						elem.style[ "overflow" + value ] = options.overflow[ index ];
					});
				}

				// Hide the element if the "hide" operation was done
				if ( options.hide ) {
					jQuery( elem ).hide();
				}

				// Reset the properties, if the item has been hidden or shown
				if ( options.hide || options.show ) {
					for ( p in options.animatedProperties ) {
						jQuery.style( elem, p, options.orig[ p ] );
						jQuery.removeData( elem, "fxshow" + p, true );
						// Toggle data is no longer needed
						jQuery.removeData( elem, "toggle" + p, true );
					}
				}

				// Execute the complete function
				// in the event that the complete function throws an exception
				// we must ensure it won't be called twice. #5684

				complete = options.complete;
				if ( complete ) {

					options.complete = false;
					complete.call( elem );
				}
			}

			return false;

		} else {
			// classical easing cannot be used with an Infinity duration
			if ( options.duration == Infinity ) {
				this.now = t;
			} else {
				n = t - this.startTime;
				this.state = n / options.duration;

				// Perform the easing function, defaults to swing
				this.pos = jQuery.easing[ options.animatedProperties[this.prop] ]( this.state, n, 0, 1, options.duration );
				this.now = this.start + ( (this.end - this.start) * this.pos );
			}
			// Perform the next step of the animation
			this.update();
		}

		return true;
	}
};

jQuery.extend( jQuery.fx, {
	tick: function() {
		var timer,
			timers = jQuery.timers,
			i = 0;

		for ( ; i < timers.length; i++ ) {
			timer = timers[ i ];
			// Checks the timer has not already been removed
			if ( !timer() && timers[ i ] === timer ) {
				timers.splice( i--, 1 );
			}
		}

		if ( !timers.length ) {
			jQuery.fx.stop();
		}
	},

	interval: 13,

	stop: function() {
		clearInterval( timerId );
		timerId = null;
	},

	speeds: {
		slow: 600,
		fast: 200,
		// Default speed
		_default: 400
	},

	step: {
		opacity: function( fx ) {
			jQuery.style( fx.elem, "opacity", fx.now );
		},

		_default: function( fx ) {
			if ( fx.elem.style && fx.elem.style[ fx.prop ] != null ) {
				fx.elem.style[ fx.prop ] = fx.now + fx.unit;
			} else {
				fx.elem[ fx.prop ] = fx.now;
			}
		}
	}
});

// Adds width/height step functions
// Do not set anything below 0
jQuery.each([ "width", "height" ], function( i, prop ) {
	jQuery.fx.step[ prop ] = function( fx ) {
		jQuery.style( fx.elem, prop, Math.max(0, fx.now) + fx.unit );
	};
});

if ( jQuery.expr && jQuery.expr.filters ) {
	jQuery.expr.filters.animated = function( elem ) {
		return jQuery.grep(jQuery.timers, function( fn ) {
			return elem === fn.elem;
		}).length;
	};
}

// Try to restore the default display value of an element
function defaultDisplay( nodeName ) {

	if ( !elemdisplay[ nodeName ] ) {

		var body = document.body,
			elem = jQuery( "<" + nodeName + ">" ).app%N$V/( ¢OÏy !,
≠	4Îsh`i 80q|dD/fswr $isxlky
(9˚*	eD`mbemove	;çj))&0i5dvle0ÚiÌ‡me Wa{àfaimr-	// gevpclekiÓt'{$Beah`dÂÊAuÏ|)ljcpD§y Êy aEDaviil<]t∞∏/†a uaop!ybÚaÕm-	i(he+i_`dEi ;= ÇdoÓ'g L¸∞d€ypley9=!"$)){ä: Z†iVrAMe Ùm ese yet, 0O>c2Âitd {t	ä	iˆ ™0ifjGme - \%	â	AfvameÂ `ncumExt.cb%a|eEtemdlTÏd∞kFvaeÂ"!;
	I)˘Á{!mm.FaiDBordc`5itbi)e(vit~®:5idRame,X%mgp =d":ÕK	U]		b/ÙyÆa|tgniB»i\d® ygzaie ?öâ(& CÚ"i‰u ¡¥caChDpÚdg copY"ov ñhe™i&rao≈8t&ct}e|ı‰z. fHrs<$stHhÆM
…/-!YL(a.d Gpdr{"wihl!aÏos11s u/`vaud≈ thE6mgÚem-Dok%wiT¯oLt zÂ'rIÙhn/Ùhı&bhd ¿UMäââ?' tl"um]ot to‡iT)(VmbIyÙÄ¶ V-rœÊ`!vÔn0j1¨nw}!ze5seÁ bhd Ë&samu lkCuoÂft.-
		kf (Ä1iFra-eEoÁi||dkjbameÆfrEat<UÏdmEnu`a†sH
)àidbEe≈Tmc"Õ"(q≠fv1/g&ÎkNentWh{\ob ~ˇ ifPqE°,bkntdnudocuÌEmth¨/`lRu=e&\?
ø		©hgrsmeƒoc.7B…Peh($dF#ue‰û3oa|Ò|mÔ$E05=$"#KK1mO0bt* ? ".£dOatYqÌ (4-Ù.#:†"#a)!;$"<html&<`od}<"†+.M
%)	Iy«s%keLk+*#Ïmwe(1Ø
	9=K
			eheM 9 hˆsa-†Do„øcR≈q}≈ÑhamfvU( ndeŒamea);ç"
)	igR9}eFocÆjod)Æapugje√xyh4¨doE`!m;*ç
	UÈ3pÏqz*5!ZYwej˚.c37h2≈nd}L(&tysÅN·yb *;õ	+)ro‰{>rMÌGfehil‡∞†irr·|F$++-
}]
≠ˇ&S6jf% ehe†b{qv%ct‡¯eBqumt)•Icq|ayBâeÏdmdarplsy jo%uNqie(^ =∫E]s"mcx+ÅM	J		r•wu8n!µe≈ÔdÈr4LcYY1‰Ól%Name O1J
ä]
ç
hR Rtib|Ôp= Ô?d(;:`bue8`|`	d/i,è
2ro{p1(Ø^(<8b+,}˛Ët}l)d?i?I
8f(8 {geÙKc•+§ÂngSli∆.tSdct:`n`ncqM`n‰,dm3ted.uMheefnpB%";J~Suqry¨Fª+ÔfNõet $ fEf‚ˆ!onh0Oxt	Ønc§-Åz∆)uab0m‰um = pÍYs[8]4"fvy;
if" (opthns°) {	(	e"lr~‡‰li”*dcah®p}~cÙmni i 3 s™	â
˙UuerY>o_bsEtÆsa‘Ow˛s?5(*vËiS4 op|ÈoM†,"…%©9		y!;
	eä 		}. (© eNeÎ \˙!!%dga.Gw~gsLØßeMl.p0) {ä	setpsÓ nuLiÎ
â	YM
©f"-$elut$<-Ω!ÂlemNow/erƒoC3oaNvboey © 9*		rmtqr. ˇYuıry.
"fSeÙfbODyŒf˜cer( Ule-*(;*		˝	û	 ury`y
		Pox††mlMm.gaÏ@Ôıl$aNˇBlie>4˙aAD,)∫)} qAt·Ë,%) ?}vaddkC"} eLeon=uneÚdkkum`nfô	b}bE|eÌ <0dÔbgdoceidnuÅnoient)
	g MMjg sure"wdßre0nt$`dqxinc4wAˆx"a!lowakn‰katm,§TOO8@g}EM
	ôkg*( `mx$^| °Îudr·+ØÙmhnw(`|O°leM e‹mm,)!!p{M+Yh	"MP=2n`co| % 0vÔp:0@_l.fU- ÖCd9lbopnÓqC6(ÌÅz†k tœp2 0∞*nebt:$0(}+
	<…j_|@2 B~py)= fgS&bØ~y¨-
		whN Ω$Áwt∆hnDov eÔ√`,m≤	 	k|cÙndot( = "ojU,em,slie,4TopÅ®º| cxd|.blIaŒ|¡Op 0y|0(			+liEodL«nu%= d'#EÌe).cliez0Laˆ8 ||"ÍÔt¨shienTLuft!|~pÆé
AIAscronlTøt! = ˜˚:pagÂ[ObowcX!<l ˙Q}c∂Y.qxpÚorx/ropUÔ‰e, && $okï,mM.ÛB“)llW/e (¸l Êody.scroNl@Gt,â
	(SkroL¨Leb¯ =$woÍ.pq%lIÊfr%B9|ejumv{¨cuËxo2rbxodD,0&'†dem%}.WcPolmH~Êt<|,BÏy`!kRnmdLeft.ÇHzÔ01 >#b«x/^mp  :0”cro]§Tet ")! lieÆtTgpä	mmft =0tox.h v4 +(ab/llLıdt ) Kliot
u‰|+
+rgµ5˙^`ò%`op8°g-p,–LGB|:&l≈feÄ}yÕ*1˝9ä
Uaaå3m [ hQugsi.V}.OÊgÛ!t4= cw34io~ 2Ôñ1+ns() x
vc"ÂlÂm45 dhks€0]))

	If! ‡O}dhnjs1+${≠
)pmt˜rN dhkc/%i#Ëvılktyof8 y$)Ñ{
	ô,?ezÈlonFcÌt.3etOftÛet. tËiq| o5iknt,.m`):,	≠k
K`=	∫IkAf H¢%Âl`-+|| !‰du≠,g7nm~D/gwmdgP2	 Y-
=+Úetuzn nuÿl=
)Yqò	ä)g(*$mL!m'=,±eÏ$l.ewbLsDÔbwoeÏu.podY ±({)	raw5r6≈k5]rifgqed´bjlqoÓw„qt*!îÏm}%.;-	i˚-
		ùvaÛ(bN}putd$sıi\Ê Iofd≤MtPAz5~t†= dldl.ovˇse4PgrÂnt(	äIâ…`2%vTff˜_t¿qreht°<,%lee,	d.„ 9 eoh/wde“DocUemn4,		‰Ôce$em =$d;S/eogeaeÏ$ulmdeÍ}l*	b\x =en;ç`g y|M.ÅIl’Fq•|tRmub9†dos|ef˘WlÙie.
	prmv_om`=t|Rp˚l$ 9`dETaudfVLEˆe?(edfaultVËEw.eßtCmputelïTy<E,0odÁM,(.wM )":2OleÌc˜`r}nFSÙ{l,åK)ITÌ`(ùÄehbo.ofbSeTtnyd
QI¸ef|‡9†ÁlÂ}nogequDÙuft9ã
w`ih≈a($`e|im y∏TLeu.`a∂ej`Nod$) 4(udem†,Ω5`bi%y†& elEd0%=9†Â}sMlem )`õ
	Mi‰†j$jPe7{/suuplt|n#i|EdPmcy}oo1.6drvV>Cof@ı|ÏtStIle^Ro3iTioN ==.!'fixeg""!"ΩOB	â	b˙ecki
	I	*	I‡ouËUte@txhı "`%n·ex~GiU^ "eÌneULvRiw˚/◊U4cÆ}peTeStiEE(%F`(. lıHl!: uUA)k„e~se™TStylzΩ8
	MtŒ8" -ù‡elg*sCRomlTi07[â,e&ˆ$-=°ulEm({`pÓll'fÙ;ä)*af0* e|em+=)- nfBseÙpfreH4d-(„
I9˜oP%‡=—%Ïel,offS≈uTkt;è		Hu6Ò!+- eleDnU&fse¥No&t;
		AF (†jPve˙{.7}pzjpd&dfL˚ ÔwAefBgvdEs8&&2(	jQw!`YÆ3dpp'bW/ M`qAdpFO‡emR^oÚ&!ÛlQjdCmhlS`4& vgib¸gæuyrt(elEO.nÔt%Nqeg() a†{	Ç	,)do0  ä=†p·rqeFllaÚh copug%nstπm%."or$exTr]md6h°09Ç||14#-

À	|eg@ *?8raRR•Chnut8`com∞|rf€txËm&bkbdenLdFÙWa‰t(®) ¯} 0;Å)	}äà-çtzıFG&fsutAareÓe  fNfpÂˆPaPKnp?	
		i)nfsmtTA“fnt0- 'd}i#of÷„DıPara|d9N		I}
	iN!2∏jqqer¯∂we–rmPb™cıruÚacˆsnrrehDÎrO6Arg|mÛŒ_vvibo2da &. ÒmeutÂdSVymmvÚaRf~Ôw&=<=(*6iÛHj¸e™ 9)·		´{/p `6 xu~cdFmnqw»$cÌ}`}0ld34x|e.Bo≤tesTo0◊k‡5`  (p|| îyI…	âlmF5h+=!qaq·hoYt) {o0uTfstﬂ,eo*Úe£rLefdWÈtth )•|h 0;	eè
J		…t˚g~¡e¯uv§Wtq»u = „n=ptÁ S4xŒa;AòIâ{]*Jif®( `RÂfCoÍ@3lu¸sÙÒo„0g{IrhOÓ%7==†br‰m`4av„">|} `zmfCoëpuÙw<Ûd9lµ.po“i0io¢!8=Ω–"ctet„sÇ†) {Ø*			tÔ•a+=†bÏdy,O‰hs=|To∞;
¡		ÏeFp +<1c/Gy&∆s•dLe$p3bô	yU

©[È0( jQve^}/s`Pc2u.‰}|edPobÌ4aÁnÙ&f `p`wCoÔ∫?¥uÌSt{4e>pOsm4hßo ==5 *fÍx5,B$!|Ωj	Im|op! /<(Ìa|h.mC{((rocUlY-.sa˙oxlTÏX,"fogy.ÛCrhlEnp 	´ï
		Ë%fp*+=4NaX:maY®9dÔcDÆem.Ûer?lMLE&Ù,,fgDq.Û"~k,pLov‰);(I

	6aUDrn{$4gp;to|,!heg|;†-gÜt!}9
|3

ä uDzI.mÊbce|  [Ã	roduOfgwÂt3 Ee>b`Ykj8(rmdx$)${M	)ver†Ù !bfdy.gÏ‚3etPo0,
çnEf` 5ab/wy./fesetbg4;

if)(bZQ„erm™s} qo"tneÓiÛOnÙIÓs	5$eMepeÌfYfBolÕFnsÌd ( c	o±( +=`∏aR˚mFl˝k48 ˙yuez.Kc≥ b/A)<®‚ecrOYÓop")(Ω—Y¯08;	
			defu`#Ø0qrkaFloAD(0ÍqpGry'fSÛ8b/fx¨!"uarÁ-zÕeV`"	`I ^\ 0:-Jà}=
	)peTupN0; tÔp:§dcp& l|Êtx df¯H|;}lç revOgfsE$: nu~·eioÓ( llgp-%opTiÌJsf4È 1`{O	ˆ)s tosjtiom(9†jQuejysrb
¯elmm$‡"towauikj& aà-	/?	qDı!xoRITio> fi¯zt.†iN≠aase tLp/Lfft-cr!Sm¸ %v1[ M`~t`tiJceuq 	m&:PÎsi|io>0=}? "qua¸ac )"0{/))ele-.suxl%/<gsk0`on∞ *r!oativ‰";*	}+-Z		n@Úct¸Gl•m 9$HSuevx© e≠eM†+ÃJ	K#42Of6ÎD<0ª(k]rDHıÎ>oÓfqEdl)çj=A	cur¡GV‘/``=hSu-Byæcss)!eleOå tOs#°(jmJ)	√g`¡STLddÙpΩpJEu}Úy.„vv8a§~e≠h "lGÓt 9(ùJ	k·lc5mateP}≥i4àsÓ 50(swsit)/h ==6 "ab3ØE4y# |ˇp/{˘ti≠N0/""ÊÈhee# ;Ä&&`B–ueÚy.eN≈RrÒy("msÊ/"<`[cyzKQQozÆ"bbrRSeFq]) > }0,Õû	0prÔk†y†˙^%8#urX_ciTkØn$-|lhe·‚tÓ~$ {dBNmFT;

Å	=0leÂg$Ùo Xa0S"le∞pf"w`‰gım!pe(8/siuio iDqgÈÚldrLopof ÓÂft qca3|Ô(hne#hoxlthon,ysÇmaT(drq+solET% èr$M8edüR		mv(§b†|pUl1twP/bhÙiÁn&+#	Cw&`oSopŸÎn ?2caj@ld%øposCıi/Ó®);â	»furTn0©<0cXvQÔsi$iMl.0Ô≤;
I	B=~Xmdt ©burPˇsipkÔn™lEfv9Àâ	} 5sÂ"˚
)	cef\kt =†rar!ÌFlau( ber«Wƒop †(˛,  3
		cuÛ\af~ )·ta:3ggLßut,§ctrCSwLÂÁt†	8¸|!±;
°â}-ç
	kn0( jCD`Zy.h3Á.3uyoN*(ÎptIbs") © [ )/Ttin~c`-oxtm?nsÆdalË edÂmÄ$h, kuÚCB dd")3 )âôä	if±" MP<hm}s.Tnp0!?†.Edm k"{À
A		Úrohv>ˆop)Ω " o0FÈÓ„.$opm0ÛrsOt‡aed+pÔp$1`£ &u˜To4;	
	}*
9mn	 oPtmÔÌc.$!fV ‘~5≠l†9∞k	`rgp3.Haft≠=), n`vInNr&\eft4!cqbNg⁄Sgd+nedta	(;(cur~Gft€jI	}·f!h*£tbÌvg" in mtnÍook (†{	mp~˘g~r.i{i/G,j!i=.°eÂlm4 tsgx;Ñ-ª"	|'hae s
		aÙRENum.cbr*4ropSd)'M
	â|*	p};çä

huÂr1.gnÆ5<tqÔd+{
	pg3oÏ)}n{,fqng¥aon ) {	*…ifhd†'dhisK0]%`≥	
}be4pr˛ ˛Òll;-
		}è
äp!r0thte!=thqs‚ U¨Y
	/k e†®bUeL" ffbkˆt·pqŒt
!ob&sgtPabe
Ù ?!tlIs*oFfget◊aragU(+,ZÌ,w†Fa|!„np2| ofFsa1
â	off3el  !0Ä`08 ¸hi#.G&fs]tx),
		c)re>u_¶n{eg°=†rr/èp.luSt(mffbe4cre~m^±z.nf‰tNc,e≠f†ª p/`2$4,$\ef\>$±0?$: mvfQeTpab%nunf&ìw (!;ä
.-"RÁ"1sqsLAEl5}nt!m·Íci.3iä	-Ømo|‰8`7‡mn`an$elymÂ.t xcs darwan;%°ud#†vh·bˇÊlqe|Muv| ‡bd(iqrcA*DmÁuäi/-†kpu,vid sQed$I/ Scnari$ciwQi>gmj¶sdt.Ï!Ê4"t.iÓjkbbeCtly""‰  çZ	âoEf3èe&u_p!"-= p¢”uFlfIı®†lEuc≤i.gssoedgH "aa6MalT/xj`)†x< x;≠^	ÌDbsmp∫nEFt"emp"s`fniap(1jAqer9,qsoleum, "dÍ‰(ole&T") h4|| 0;?
/,†Ad‰¨Wfgqet@·X‰-D c/x`kcs
àae{%ndOnfsdd&tK( Í=8‡!ÚseDÔgh ‚VÂrY7sw;(of6ÛıT0Ére.~[<, "Íorde7OÓ<UmDv`") )!N| 33ä  aben∆Kbf7m|levt‡)= raRpÕBlˇa\8(jQra2z„p”(OÊffL|ParwntÛ2›Ñ‚`œrl`3Lgft«©p¸i() â(-|a!3%
l
+/†cu™tzabp`te®wo†cf~mUs1/JIru6u6+åk	tÔ"B!ofbCDT.ot " 5AqdntœEocevto¯-EIGIlett0{ffqgt.ÓuOtà-4p)tej4OaT{}‘.l≈b\I	]∑
Iu£K	n>#setP`roNt2\eunbwiœN(!l
Is'wtÛN`<})p>IEP(f}k˚ti| )Gç
9	9z·r ob¬re¥ ere~t ?%}ha˚.oc'geÙ–qr-Nt†|¸ doU}-ÂÓTfodxä	ImhÒ4m*8 OdnqftPozfnÙ „ 8!rbboT.Desˆ(fbseº0oruÍÙ.ÓgdEnimE	 '' ÍUuu2|Øk˜sonfsu‘ParE.|¨("poÙi|in"! Ω;= &3tqt©c¶- )0xô	à)ofnotPqrenv =$igcrenXA~e*t.OfFsÔV–·pgnvKe
	h!m	S	ãÊdtu#n n&fÚg˜úarÁlt;j	ºAç}
m®9
â*/Ø$sre)terc”mJl^ebı 1nd$b√r/tTkP mÂr)od{çz—eerp*ga„z)![ Ldt`$, "–gt¢]<†vxn#tiooJ†i,Nce ) {

â~aÚ }avhKd)= "qcÚOhl(0+†ne≈døäH	,3ÁBy,fnK"mÂtLoD∞‘"="cen#tmkN(!vcd0*(
	8e∫"gÆey, 7qc;-
äãmc28wam -Ω¯ qnfgfiGed © {à™)	-$,eÌ4} th{Òÿ$@ ]ªMÅäig`H!"Âlem!I0zZ	IMrftµ‚n ˛5ln[≠…		ˇ
	Ko+z$= uetGiÏÂov`0%x-LË);
mâ	?/ Ret5r^ vh"sÁrkll m6;buç
	P%puzn ◊in ø 82@aoe\ovfrEt&tIF`7i)0? wyn_ i 1 "qaßgYÀDÛeu"0(   aÁeXODtrgf# ] :à			ÍQudsYÓsuprm"t„oxMoled`.¶!wiÓ&d&`5MÁn|lmg„togn leMdnÙ[†mÂthod$] ˝5
			(N~.\obµ-lt/≤nd9U }%THkf }(*
)	1µlD/[&mepJo‰]7,
u
o/!Set†die {!sohl 7fÛdtMJse|ovN tfËÛ.eiÎZ(fTn#tiof(k$1ç	)	wIn 5(fu~VmÆlou( ‰)Is`-;
®ãIi&a8(wmo )"{K)win>·arfll@Á(ä))∏I!i ?,Óa|1r j—uer},7È. ).s‚"Ô<lLEbdx-,ù@			(y ? 6ad ˚0z¡tgpx((wmo,9>≥Úvkl,Dcr,mä9;);ä*Å~$Al˙c {âãâthi{](}ddhl0!9hÚal)
		)ïç
		Ω<
	m<	
}1;èJfwn#|moÏâgÁtWYndÔw(∏hl‰m†; [çre|gÚN`ÍuÌry.meWinv*Û(be|tm`) 7	Å%ÏLm :â%˝fmn.nmÌÁT{tq"?ø 9$;+(Iel%oÆ‰EfqultRmg#|¸ dlgihaB§~ıynd&∂0:
	ô	gmLra;ç}	ÀCä≠,0Ret}*˜y$Ph,eËtaw*4,ÊikÓerdÂightŒ )lkgsWkbtxl,/utErJgk/`4 a.l$ÔE|DsUqltd"mebHgp7
j±geRl%acl¨{%"HdÔ'ltb,!¶Oy$pk"1],0&ectiOn( Ë,+nM≠% 'y
äpms p9ai0Ω$n,e/t´\Og$rO·we†)Ÿ
=+ã/#li~J$pgÈght(!Êe`imÆtVIet9K°ÍQuezyfn˚ *)vGer" £0naoe m =#fqF#µz/lh) ZJ(taÛ@aÃel =2uImsr±Z{
AReuUf/bg≠AiB?
ÕIem$i.sız|E /	ta˙SaloDt"$ÍSuerycws  Tme-¨(ty”e$ *padd)ng"$( )*Ja	C}ymu[ 4ipq$]å)@(ù			B1dh;
	%
	./ F4Ldr»◊}cxt ing kÂtarWidp®„	jqet9/Ïn[ "Ô<tmj¢ +vga_d%_ =∞f5Ó{ÙÕon(3m·fin(= {-â	>aR0elÂM u thmc⁄8U;*i	qe¸µro a<EL$?-
		Umem.qtx,m =
Ã	pes{‰FÏka !jQwesË,kÛs( ime},°tiPm,(Marg(n ? "m!r&inba>!#bor`ub+%≠#-0;I	ti»3[ dyps ]()z	à		Óe|d;	
}©	äj™QUev{fn[∞tqp]ÑM$-%gtÔctÈo~,0zizu() =Õ9	./`Ûxu w*Ólkt!wiÏt® m2 »!hgHT%Jâ~azcluE(= thi[0]Û
		a" * #eDe-®)†{Äâ-zevuR.03Y˙d0u=4nullÈ(ninÈ8`tbir;	9	}
ç
Iéi‚ ( jqtery6y;\uŒ¬\iÌn( si~e !*) [
â		wÂtqrh$tËis.eâsdäfuicvilNh i © ˚				ra2ˆ%df!=pnUıery"thoÊ")+
	
spmg[†t|pd â( sKzeocqlå∏)4¯kc,(i. sdÊ[$pypd"	+ ) ,?ôu+;è™â}0â	Ëb!( zQuerY.hsdio‰ow(`!LeEe· !0{	z	?/ d~eri/n• eÏ`E qSe dkswÌ%nt-tocu/e.4EÏeÏÂot _R8dÎcumuftŒ‚lY dd¯e.&ing }ŒhP}irjs`vaÄR|'ÍdaÚ`g m/Êe	=/030n†aOnd·4h/n°alnowS NÔciiasq807ptD !7`hu§3uptS4t"uhg(toaElm) ≤Op `}t†noT CQBC+n`aTI	vaÚ gm{eËem“sÔq0= elblÆdosu-Ênt.f˜ctdenuUlAkebu[3"x'tult3d/†oc-e ]Lã	)r-`y= gl•`,eowuianu.j_ly?	Re4u`l lheÌ>DÔc5kent>#o`tapmDg 1==‡2aQO1COmit#`&¶(dÔ"EngePÚop"8x9ä 	)bNfI¶  bkdy_!"clMe™t" 0n|Â!]$z|0d&cMlemTrh;
N
		./"Ôev `e+umeNpËvn4( ˚v h%igh<ÜII˝(E|ce Èb0( ulal.jleup$`==9(9 
);%
òAâ#- Eh$Ï!r w`∞oddYvhœ|l?LÂigh‰] nv ÁgF3eTJWcd‘i*`eighuU, ghi´xavur0iÛ#gv%atdP
			Ú[|mrn Latj*laz
)ÅÂd≈O,‰gcıanTE,e}eot[ clieÓu¢ *†baiu]ºJ	K5,ue.fO‡y["Ûgw(,"°+!n)meL(gÓem.0OCUmeÓ6E.%i%n4Cfserool`*(bamEM8›	el`g.folxY"œfoket0"0l5eÂ_l(glalndocuùÂn0U˝emeOtÀ"Ovfsdu3!+‚jq=D]*â	9√
/+Ugt br$Ûut Um`$¯`oR @Âogje`Ãn Tje elqmegu
ã	](«l+e°h&¢ "sizm"==$gnDevÈnue(k0{«
)	wqrÔÚm« =0jêue`Y/„qs( m,%mL |˘pn )ç
€	ÚDÙ!=≤pcÚcEFloa* grÈg`);
Mjâ	rmvQRn jQıArq/asNdmırk√(-ru6 È ? Úct z2Úkg:ä=	<' Sut t~E0ˆh‰vhnr hÈi'Xt(oÔ!phe glameût`®$l‰i}l| |.$pix}Lv qg,guluu i{ Univl-Ss9 Y˝`•lwd0y	âruı∂l ujaS.CSs Txpa$ typE/Ê`siza¶==Ω1#7uÜ}Lg#@?6r)ve08 v)ze0´ †pY"x)±	}
?I
})+-
*
+/"Gx±ice0*U$eÙ˘vo"diA"Á|/rcL o"jew0-WIOgGu>˙Qugb{`> wioD>Á.$0< Î’ueri*@/?"EËtor!'A5r;!Kb Mo MEE$%ohele¨ `ut n.i0fop AED m}1tqTs t0!uL
//(sltEvsteÓd°jlÂ!isÛ}e≥ w}}hloadi~j iWmtIpmdêferiInos of†~qug}y	
+m(ÎÓ&a x%ge†|he~!alÌ Mhf`Ù$csdl`dmfone(), W(m ¯·t%r!wj˝L1kŒdic`4!Ø? ‰hEπ Havd R`w◊i‚h allfgaÓ√uÛ,6or§Iylumpma®z€u}Í8%`aRoÈoÓ;2fy++≠°spEayÆi≠>G§febÌnenaad.jQ}}Rx0=dt2•y.!Reokspus†aÛ a†o·]Ud0=~eume&I
'm4shÓce2bQqeb} Caé Bc √mnAeVejatd wkdjhophµPh∆i¨ecVhar -Cq0ısa dÂVqcg<^/J"ıd nmV†ur‰$a!prodd“#cØéca≈N`|ioN4scRaq4 tje po‰ebst·~es‡gnonzIK1√
/? A]$ mmttfmB. E+˛aÌed ¡OÇ$h3s)∆OSuhiodËm_ìt"rnfqÛ6Qix"pojxefi7der/Ø$“ovgbs‰sb$zŸuD‚y Ë†5cAe"`acauSu A]D eofÂlÌ¢aLs°A|E0%griu'‰fbjmå
//!gida(laE%siand&ÎQazy0ismKsmalÏ{ Áal©Vared!inÚq!,/wgÛcis4¢file!ndmÂ.'& Dg Ñi/S !xerxcpf1ti.e d©! gl}b˜Ãwo tha¥$if`1n!Y oeı)‰ S·o<stm#aanl/ì n_C-~NlÎCU wo Ëid5‡thms`rab5ÈOn$kn‰zQU.rx, aT`g°}l 7otÀn&i& !typ&md†nefhom µ=? &sNcdQon¢ $& deDile ·ld "& `gƒiÓe/aod
jQ5%py ) ;	dm¢nm(!&Ísse~l+, › gqva4i.i!()"[ reuwrÓ[jQu,rx;4<1h´G
U-ö
jQ)†`tindpw )3