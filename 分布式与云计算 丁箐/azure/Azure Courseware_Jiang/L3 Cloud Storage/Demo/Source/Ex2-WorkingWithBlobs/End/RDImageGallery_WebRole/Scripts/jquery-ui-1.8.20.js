/*! jQuery UI - v1.8.20 - 2012-04-30
* https://github.com/jquery/jquery-ui
* Includes: jquery.ui.core.js, jquery.ui.widget.js, jquery.ui.mouse.js, jquery.ui.draggable.js, jquery.ui.droppable.js, jquery.ui.resizable.js, jquery.ui.selectable.js, jquery.ui.sortable.js, jquery.effects.core.js, jquery.effects.blind.js, jquery.effects.bounce.js, jquery.effects.clip.js, jquery.effects.drop.js, jquery.effects.explode.js, jquery.effects.fade.js, jquery.effects.fold.js, jquery.effects.highlight.js, jquery.effects.pulsate.js, jquery.effects.scale.js, jquery.effects.shake.js, jquery.effects.slide.js, jquery.effects.transfer.js, jquery.ui.accordion.js, jquery.ui.autocomplete.js, jquery.ui.button.js, jquery.ui.datepicker.js, jquery.ui.dialog.js, jquery.ui.position.js, jquery.ui.progressbar.js, jquery.ui.slider.js, jquery.ui.tabs.js
* Copyright (c) 2012 AUTHORS.txt; Licensed MIT */

(function( $, undefined ) {

// prevent duplicate loading
// this is only a problem because we proxy existing functions
// and we don't want to double proxy them
$.ui = $.ui || {};
if ( $.ui.version ) {
	return;
}

$.extend( $.ui, {
	version: "1.8.20",

	keyCode: {
		ALT: 18,
		BACKSPACE: 8,
		CAPS_LOCK: 20,
		COMMA: 188,
		COMMAND: 91,
		COMMAND_LEFT: 91, // COMMAND
		COMMAND_RIGHT: 93,
		CONTROL: 17,
		DELETE: 46,
		DOWN: 40,
		END: 35,
		ENTER: 13,
		ESCAPE: 27,
		HOME: 36,
		INSERT: 45,
		LEFT: 37,
		MENU: 93, // COMMAND_RIGHT
		NUMPAD_ADD: 107,
		NUMPAD_DECIMAL: 110,
		NUMPAD_DIVIDE: 111,
		NUMPAD_ENTER: 108,
		NUMPAD_MULTIPLY: 106,
		NUMPAD_SUBTRACT: 109,
		PAGE_DOWN: 34,
		PAGE_UP: 33,
		PERIOD: 190,
		RIGHT: 39,
		SHIFT: 16,
		SPACE: 32,
		TAB: 9,
		UP: 38,
		WINDOWS: 91 // COMMAND
	}
});

// plugins
$.fn.extend({
	propAttr: $.fn.prop || $.fn.attr,

	_focus: $.fn.focus,
	focus: function( delay, fn ) {
		return typeof delay === "number" ?
			this.each(function() {
				var elem = this;
				setTimeout(function() {
					$( elem ).focus();
					if ( fn ) {
						fn.call( elem );
					}
				}, delay );
			}) :
			this._focus.apply( this, arguments );
	},

	scrollParent: function() {
		var scrollParent;
		if (($.browser.msie && (/(static|relative)/).test(this.css('position'))) || (/absolute/).test(this.css('position'))) {
			scrollParent = this.parents().filter(function() {
				return (/(relative|absolute|fixed)/).test($.curCSS(this,'position',1)) && (/(auto|scroll)/).test($.curCSS(this,'overflow',1)+$.curCSS(this,'overflow-y',1)+$.curCSS(this,'overflow-x',1));
			}).eq(0);
		} else {
			scrollParent = this.parents().filter(function() {
				return (/(auto|scroll)/).test($.curCSS(this,'overflow',1)+$.curCSS(this,'overflow-y',1)+$.curCSS(this,'overflow-x',1));
			}).eq(0);
		}

		return (/fixed/).test(this.css('position')) || !scrollParent.length ? $(document) : scrollParent;
	},

	zIndex: function( zIndex ) {
		if ( zIndex !== undefined ) {
			return this.css( "zIndex", zIndex );
		}

		if ( this.length ) {
			var elem = $( this[ 0 ] ), position, value;
			while ( elem.length && elem[ 0 ] !== document ) {
				// Ignore z-index if position is set to a value where z-index is ignored by the browser
				// This makes behavior of this function consistent across browsers
				// WebKit always returns auto if the element is positioned
				position = elem.css( "position" );
				if ( position === "absolute" || position === "relative" || position === "fixed" ) {
					// IE returns 0 when zIndex is not specified
					// other browsers return a string
					// we ignore the case of nested elements with an explicit value of 0
					// <div style="z-index: -10;"><div style="z-index: 0;"></div></div>
					value = parseInt( elem.css( "zIndex" ), 10 );
					if ( !isNaN( value ) && value !== 0 ) {
						return value;
					}
				}
				elem = elem.parent();
			}
		}

		return 0;
	},

	disableSelection: function() {
		return this.bind( ( $.support.selectstart ? "selectstart" : "mousedown" ) +
			".ui-disableSelection", function( event ) {
				event.preventDefault();
			});
	},

	enableSelection: function() {
		return this.unbind( ".ui-disableSelection" );
	}
});

$.each( [ "Width", "Height" ], function( i, name ) {
	var side = name === "Width" ? [ "Left", "Right" ] : [ "Top", "Bottom" ],
		type = name.toLowerCase(),
		orig = {
			innerWidth: $.fn.innerWidth,
			innerHeight: $.fn.innerHeight,
			outerWidth: $.fn.outerWidth,
			outerHeight: $.fn.outerHeight
		};

	function reduce( elem, size, border, margin ) {
		$.each( side, function() {
			size -= parseFloat( $.curCSS( elem, "padding" + this, true) ) || 0;
			if ( border ) {
				size -= parseFloat( $.curCSS( elem, "border" + this + "Width", true) ) || 0;
			}
			if ( margin ) {
				size -= parseFloat( $.curCSS( elem, "margin" + this, true) ) || 0;
			}
		});
		return size;
	}

	$.fn[ "inner" + name ] = function( size ) {
		if ( size === undefined ) {
			return orig[ "inner" + name ].call( this );
		}

		return this.each(function() {
			$( this ).css( type, reduce( this, size ) + "px" );
		});
	};

	$.fn[ "outer" + name] = function( size, margin ) {
		if ( typeof size !== "number" ) {
			return orig[ "outer" + name ].call( this, size );
		}

		return this.each(function() {
			$( this).css( type, reduce( this, size, true, margin ) + "px" );
		});
	};
});

// selectors
function focusable( element, isTabIndexNotNaN ) {
	var nodeName = element.nodeName.toLowerCase();
	if ( "area" === nodeName ) {
		var map = element.parentNode,
			mapName = map.name,
			img;
		if ( !element.href || !mapName || map.nodeName.toLowerCase() !== "map" ) {
			return false;
		}
		img = $( "img[usemap=#" + mapName + "]" )[0];
		return !!img && visible( img );
	}
	return ( /input|select|textarea|button|object/.test( nodeName )
		? !element.disabled
		: "a" == nodeName
			? element.href || isTabIndexNotNaN
			: isTabIndexNotNaN)
		// the element and all of its ancestors must be visible
		&& visible( element );
}

function visible( element ) {
	return !$( element ).parents().andSelf().filter(function() {
		return $.curCSS( this, "visibility" ) === "hidden" ||
			$.expr.filters.hidden( this );
	}).length;
}

$.extend( $.expr[ ":" ], {
	data: function( elem, i, match ) {
		return !!$.data( elem, match[ 3 ] );
	},

	focusable: function( element ) {
		return focusable( element, !isNaN( $.attr( element, "tabindex" ) ) );
	},

	tabbable: function( element ) {
		var tabIndex = $.attr( element, "tabindex" ),
			isTabIndexNaN = isNaN( tabIndex );
		return ( isTabIndexNaN || tabIndex >= 0 ) && focusable( element, !isTabIndexNaN );
	}
});

// support
$(function() {
	var body = document.body,
		div = body.appendChild( div = document.createElement( "div" ) );

	// access offsetHeight before setting the style to prevent a layout bug
	// in IE 9 which causes the elemnt to continue to take up space even
	// after it is removed from the DOM (#8026)
	div.offsetHeight;

	$.extend( div.style, {
		minHeight: "100px",
		height: "auto",
		padding: 0,
		borderWidth: 0
	});

	$.support.minHeight = div.offsetHeight === 100;
	$.support.selectstart = "onselectstart" in div;

	// set display to none to avoid a layout bug in IE
	// http://dev.jquery.com/ticket/4014
	body.removeChild( div ).style.display = "none";
});





// deprecated
$.extend( $.ui, {
	// $.ui.plugin is deprecated.  Use the proxy pattern instead.
	plugin: {
		add: function( module, option, set ) {
			var proto = $.ui[ module ].prototype;
			for ( var i in set ) {
				proto.plugins[ i ] = proto.plugins[ i ] || [];
				proto.plugins[ i ].push( [ option, set[ i ] ] );
			}
		},
		call: function( instance, name, args ) {
			var set = instance.plugins[ name ];
			if ( !set || !instance.element[ 0 ].parentNode ) {
				return;
			}
	
			for ( var i = 0; i < set.length; i++ ) {
				if ( instance.options[ set[ i ][ 0 ] ] ) {
					set[ i ][ 1 ].apply( instance.element, args );
				}
			}
		}
	},
	
	// will be deprecated when we switch to jQuery 1.4 - use jQuery.contains()
	contains: function( a, b ) {
		return document.compareDocumentPosition ?
			a.compareDocumentPosition( b ) & 16 :
			a !== b && a.contains( b );
	},
	
	// only used by resizable
	hasScroll: function( el, a ) {
	
		//If overflow is hidden, the element might have extra content, but the user wants to hide it
		if ( $( el ).css( "overflow" ) === "hidden") {
			return false;
		}
	
		var scroll = ( a && a === "left" ) ? "scrollLeft" : "scrollTop",
			has = false;
	
		if ( el[ scroll ] > 0 ) {
			return true;
		}
	
		// TODO: determine which cases actually cause this to happen
		// if the element doesn't have the scroll set, see if it's possible to
		// set the scroll
		el[ scroll ] = 1;
		has = ( el[ scroll ] > 0 );
		el[ scroll ] = 0;
		return has;
	},
	
	// these are odd functions, fix the API or move into individual plugins
	isOverAxis: function( x, reference, size ) {
		//Determines when x coordinate is over "b" element axis
		return ( x > reference ) && ( x < ( reference + size ) );
	},
	isOver: function( y, x, top, left, height, width ) {
		//Determines when x, y coordinates is over "b" element
		return $.ui.isOverAxis( y, top, height ) && $.ui.isOverAxis( x, left, width );
	}
});

})( jQuery );

(function( $, undefined ) {

// jQuery 1.4+
if ( $.cleanData ) {
	var _cleanData = $.cleanData;
	$.cleanData = function( elems ) {
		for ( var i = 0, elem; (elem = elems[i]) != null; i++ ) {
			try {
				$( elem ).triggerHandler( "remove" );
			// http://bugs.jquery.com/ticket/8235
			} catch( e ) {}
		}
		_cleanData( elems );
	};
} else {
	var _remove = $.fn.remove;
	$.fn.remove = function( selector, keepData ) {
		return this.each(function() {
			if ( !keepData ) {
				if ( !selector || $.filter( selector, [ this ] ).length ) {
					$( "*", this ).add( [ this ] ).each(function() {
						try {
							$( this ).triggerHandler( "remove" );
						// http://bugs.jquery.com/ticket/8235
						} catch( e ) {}
					});
				}
			}
			return _remove.call( $(this), selector, keepData );
		});
	};
}

$.widget = function( name, base, prototype ) {
	var namespace = name.split( "." )[ 0 ],
		fullName;
	name = name.split( "." )[ 1 ];
	fullName = namespace + "-" + name;

	if ( !prototype ) {
		prototype = base;
		base = $.Widget;
	}

	// create selector for plugin
	$.expr[ ":" ][ fullName ] = function( elem ) {
		return !!$.data( elem, name );
	};

	$[ namespace ] = $[ namespace ] || {};
	$[ namespace ][ name ] = function( options, element ) {
		// allow instantiation without initializing for simple inheritance
		if ( arguments.length ) {
			this._createWidget( options, element );
		}
	};

	var basePrototype = new base();
	// we need to make the options hash a property directly on the new instance
	// otherwise we'll modify the options hash on the prototype that we're
	// inheriting from
//	$.each( basePrototype, function( key, val ) {
//		if ( $.isPlainObject(val) ) {
//			basePrototype[ key ] = $.extend( {}, val );
//		}
//	});
	basePrototype.options = $.extend( true, {}, basePrototype.options );
	$[ namespace ][ name ].prototype = $.extend( true, basePrototype, {
		namespace: namespace,
		widgetName: name,
		widgetEventPrefix: $[ namespace ][ name ].prototype.widgetEventPrefix || name,
		widgetBaseClass: fullName
	}, prototype );

	$.widget.bridge( name, $[ namespace ][ name ] );
};

$.widget.bridge = function( name, object ) {
	$.fn[ name ] = function( options ) {
		var isMethodCall = typeof options === "string",
			args = Array.prototype.slice.call( arguments, 1 ),
			returnValue = this;

		// allow multiple hashes to be passed on init
		options = !isMethodCall && args.length ?
			$.extend.apply( null, [ true, options ].concat(args) ) :
			options;

		// prevent calls to internal methods
		if ( isMethodCall && options.charAt( 0 ) === "_" ) {
			return returnValue;
		}

		if ( isMethodCall ) {
			this.each(function() {
				var instance = $.data( this, name ),
					methodValue = instance && $.isFunction( instance[options] ) ?
						instance[ options ].apply( instance, args ) :
						instance;
				// TODO: add this back in 1.9 and use $.error() (see #5972)
//				if ( !instance ) {
//					throw "cannot call methods on " + name + " prior to initialization; " +
//						"attempted to call method '" + options + "'";
//				}
//				if ( !$.isFunction( instance[options] ) ) {
//					throw "no such method '" + options + "' for " + name + " widget instance";
//				}
//				var methodValue = instance[ options ].apply( instance, args );
				if ( methodValue !== instance && methodValue !== undefined ) {
					returnValue = methodValue;
					return false;
				}
			});
		} else {
			this.each(function() {
				var instance = $.data( this, name );
				if ( instance ) {
					instance.option( options || {} )._init();
				} else {
					$.data( this, name, new object( options, this ) );
				}
			});
		}

		return returnValue;
	};
};

$.Widget = function( options, element ) {
	// allow instantiation without initializing for simple inheritance
	if ( arguments.length ) {
		this._createWidget( options, element );
	}
};

$.Widget.prototype = {
	widgetName: "widget",
	widgetEventPrefix: "",
	options: {
		disabled: false
	},
	_createWidget: function( options, element ) {
		// $.widget.bridge stores the plugin instance, but we do it anyway
		// so that it's stored even before the _create function runs
		$.data( element, this.widgetName, this );
		this.element = $( element );
		this.options = $.extend( true, {},
			this.options,
			this._getCreateOptions(),
			options );

		var self = this;
		this.element.bind( "remove." + this.widgetName, function() {
			self.destroy();
		});

		this._create();
		this._trigger( "create" );
		this._init();
	},
	_getCreateOptions: function() {
		return $.metadata && $.metadata.get( this.element[0] )[ this.widgetName ];
	},
	_create: function() {},
	_init: function() {},

	destroy: function() {
		this.element
			.unbind( "." + this.widgetName )
			.removeData( this.widgetName );
		this.widget()
			.unbind( "." + this.widgetName )
			.removeAttr( "aria-disabled" )
			.removeClass(
				this.widgetBaseClass + "-disabled " +
				"ui-state-disabled" );
	},

	widget: function() {
		return this.element;
	},

	option: function( key, value ) {
		var options = key;

		if ( arguments.length === 0 ) {
			// don't return a reference to the internal hash
			return $.extend( {}, this.options );
		}

		if  (typeof key === "string" ) {
			if ( value === undefined ) {
				return this.options[ key ];
			}
			options = {};
			options[ key ] = value;
		}

		this._setOptions( options );

		return this;
	},
	_setOptions: function( options ) {
		var self = this;
		$.each( options, function( key, value ) {
			self._setOption( key, value );
		});

		return this;
	},
	_setOption: function( key, value ) {
		this.options[ key ] = value;

		if ( key === "disabled" ) {
			this.widget()
				[ value ? "addClass" : "removeClass"](
					this.widgetBaseClass + "-disabled" + " " +
					"ui-state-disabled" )
				.attr( "aria-disabled", value );
		}

		return this;
	},

	enable: function() {
		return this._setOption( "disabled", false );
	},
	disable: function() {
		return this._setOption( "disabled", true );
	},

	_trigger: function( type, event, data ) {
		var prop, orig,
			callback = this.options[ type ];

		data = data || {};
		event = $.Event( event );
		event.type = ( type === this.widgetEventPrefix ?
			type :
			this.widgetEventPrefix + type ).toLowerCase();
		// the original event may come from any element
		// so we need to reset the target on the new event
		event.target = this.element[ 0 ];

		// copy original event properties over to the new event
		orig = event.originalEvent;
		if ( orig ) {
			for ( prop in orig ) {
				if ( !( prop in event ) ) {
					event[ prop ] = orig[ prop ];
				}
			}
		}

		this.element.trigger( event, data );

		return !( $.isFunction(callback) &&
			callback.call( this.element[0], event, data ) === false ||
			event.isDefaultPrevented() );
	}
};

})( jQuery );

(function( $, undefined ) {

var mouseHandled = false;
$( document ).mouseup( function( e ) {
	mouseHandled = false;
});

$.widget("ui.mouse", {
	options: {
		cancel: ':input,option',
		distance: 1,
		delay: 0
	},
	_mouseInit: function() {
		var self = this;

		this.element
			.bind('mousedown.'+this.widgetName, function(event) {
				return self._mouseDown(event);
			})
			.bind('click.'+this.widgetName, function(event) {
				if (true === $.data(event.target, self.widgetName + '.preventClickEvent')) {
				    $.removeData(event.target, self.widgetName + '.preventClickEvent');
					event.stopImmediatePropagation();
					return false;
				}
			});

		this.started = false;
	},

	// TODO: make sure destroying one instance of mouse doesn't mess with
	// other instances of mouse
	_mouseDestroy: function() {
		this.element.unbind('.'+this.widgetName);
		$(document)
			.unbind('mousemove.'+this.widgetName, this._mouseMoveDelegate)
			.unbind('mouseup.'+this.widgetName, this._mouseUpDelegate);
	},

	_mouseDown: function(event) {
		// don't let more than one widget handle mouseStart
		if( mouseHandled ) { return };

		// we may have missed mouseup (out of window)
		(this._mouseStarted && this._mouseUp(event));

		this._mouseDownEvent = event;

		var self = this,
			btnIsLeft = (event.which == 1),
			// event.target.nodeName works around a bug in IE 8 with
			// disabled inputs (#7620)
			elIsCancel = (typeof this.options.cancel == "string" && event.target.nodeName ? $(event.target).closest(this.options.cancel).length : false);
		if (!btnIsLeft || elIsCancel || !this._mouseCapture(event)) {
			return true;
		}

		this.mouseDelayMet = !this.options.delay;
		if (!this.mouseDelayMet) {
			this._mouseDelayTimer = setTimeout(function() {
				self.mouseDelayMet = true;
			}, this.options.delay);
		}

		if (this._mouseDistanceMet(event) && this._mouseDelayMet(event)) {
			this._mouseStarted = (this._mouseStart(event) !== false);
			if (!this._mouseStarted) {
				event.preventDefault();
				return true;
			}
		}

		// Click event may never have fired (Gecko & Opera)
		if (true === $.data(event.target, this.widgetName + '.preventClickEvent')) {
			$.removeData(event.target, this.widgetName + '.preventClickEvent');
		}

		// these delegates are required to keep context
		this._mouseMoveDelegate = function(event) {
			return self._mouseMove(event);
		};
		this._mouseUpDelegate = function(event) {
			return self._mouseUp(event);
		};
		$(document)
			.bind('mousemove.'+this.widgetName, this._mouseMoveDelegate)
			.bind('mouseup.'+this.widgetName, this._mouseUpDelegate);

		event.preventDefault();
		
		mouseHandled = true;
		return true;
	},

	_mouseMove: function(event) {
		// IE mouseup check - mouseup happened when mouse was out of window
		if ($.browser.msie && !(document.documentMode >= 9) && !event.button) {
			return this._mouseUp(event);
		}

		if (this._mouseStarted) {
			this._mouseDrag(event);
			return event.preventDefault();
		}

		if (this._mouseDistanceMet(event) && this._mouseDelayMet(event)) {
			this._mouseStarted =
				(this._mouseStart(this._mouseDownEvent, event) !== false);
			(this._mouseStarted ? this._mouseDrag(event) : this._mouseUp(event));
		}

		return !this._mouseStarted;
	},

	_mouseUp: function(event) {
		$(document)
			.unbind('mousemove.'+this.widgetName, this._mouseMoveDelegate)
			.unbind('mouseup.'+this.widgetName, this._mouseUpDelegate);

		if (this._mouseStarted) {
			this._mouseStarted = false;

			if (event.target == this._mouseDownEvent.target) {
			    $.data(event.target, this.widgetName + '.preventClickEvent', true);
			}

			this._mouseStop(event);
		}

		return false;
	},

	_mouseDistanceMet: function(event) {
		return (Math.max(
				Math.abs(this._mouseDownEvent.pageX - event.pageX),
				Math.abs(this._mouseDownEvent.pageY - event.pageY)
			) >= this.options.distance
		);
	},

	_mouseDelayMet: function(event) {
		return this.mouseDelayMet;
	},

	// These are placeholder methods, to be overriden by extending plugin
	_mouseStart: function(event) {},
	_mouseDrag: function(event) {},
	_mouseStop: function(event) {},
	_mouseCapture: function(event) { return true; }
});

})(jQuery);

(function( $, undefined ) {

$.widget("ui.draggable", $.ui.mouse, {
	widgetEventPrefix: "drag",
	options: {
		addClasses: true,
		appendTo: "parent",
		axis: false,
		connectToSortable: false,
		containment: false,
		cursor: "auto",
		cursorAt: false,
		grid: false,
		handle: false,
		helper: "original",
		iframeFix: false,
		opacity: false,
		refreshPositions: false,
		revert: false,
		revertDuration: 500,
		scope: "default",
		scroll: true,
		scrollSensitivity: 20,
		scrollSpeed: 20,
		snap: false,
		snapMode: "both",
		snapTolerance: 20,
		stack: false,
		zIndex: false
	},
	_create: function() {

		if (this.options.helper == 'original' && !(/^(?:r|a|f)/).test(this.element.css("position")))
			this.element[0].style.position = 'relative';

		(this.options.addClasses && this.element.addClass("ui-draggable"));
		(this.options.disabled && this.element.addClass("ui-draggable-disabled"));

		this._mouseInit();

	},

	destroy: function() {
		if(!this.element.data('draggable')) return;
		this.element
			.removeData("draggable")
			.unbind(".draggable")
			.removeClass("ui-draggable"
				+ " ui-draggable-dragging"
				+ " ui-draggable-disabled");
		this._mouseDestroy();

		return this;
	},

	_mouseCapture: function(event) {

		var o = this.options;

		// among others, prevent a drag on a resizable-handle
		if (this.helper || o.disabled || $(event.target).is('.ui-resizable-handle'))
			return false;

		//Quit if we're not on a valid handle
		this.handle = this._getHandle(event);
		if (!this.handle)
			return false;
		
		if ( o.iframeFix ) {
			$(o.iframeFix === true ? "iframe" : o.iframeFix).each(function() {
				$('<div class="ui-draggable-iframeFix" style="background: #fff;"></div>')
				.css({
					width: this.offsetWidth+"px", height: this.offsetHeight+"px",
					position: "absolute", opacity: "0.001", zIndex: 1000
				})
				.css($(this).offset())
				.appendTo("body");
			});
		}

		return true;

	},

	_mouseStart: function(event) {

		var o = this.options;

		//Create and append the visible helper
		this.helper = this._createHelper(event);

		//Cache the helper size
		this._cacheHelperProportions();

		//If ddmanager is used for droppables, set the global draggable
		if($.ui.ddmanager)
			$.ui.ddmanager.current = this;

		/*
		 * - Position generation -
		 * This block generates everything position related - it's the core of draggables.
		 */

		//Cache the margins of the original element
		this._cacheMargins();

		//Store the helper's css position
		this.cssPosition = this.helper.css("position");
		this.scrollParent = this.helper.scrollParent();

		//The element's absolute position on the page minus margins
		this.offset = this.positionAbs = this.element.offset();
		this.offset = {
			top: this.offset.top - this.margins.top,
			left: this.offset.left - this.margins.left
		};

		$.extend(this.offset, {
			click: { //Where the click happened, relative to the element
				left: event.pageX - this.offset.left,
				top: event.pageY - this.offset.top
			},
			parent: this._getParentOffset(),
			relative: this._getRelativeOffset() //This is a relative to absolute positio&hkn�s |ha"Q�t�a, p�w�fm]. camg�hi-gn(!oney0{E`%fks rm�`fhVu!0k{yjew5d!hudPU�
	}m�
Jk/?_GfgBadqb�(e �ioyjal pzai�io�-)	t`I�.ihieIJqlPmsh|y_N!�!�xic>p/ai=Ynn �!rh){>_�dnYrAemPgWitYenkav�n`)9Iths.~pa7y�e-�ag%K5+ewm�V>p`'MX;	Wlqrapikylan`GLY - eve�8�pagE�
%
./Effeid`tkeMi'5suflff3e|"r|<m}hG% 4o t�m0falper !F$ga5B�*r�b/ iw!q502didmH	I(Ogu�sns�	4&$<��r&o(f*5StK'v��|FP/mHaqt%s(.C�zs/zAh�i;M�	./J%p qcg�uU�b}`Fu 	f gin�� -L the p�!fns
	aD$l.con�am>m%nt�
9H	this/_se|Vknta)koe^p((r�

9>ZRioes,�vEn< ) %ahLv��k�i�(V�is�Ktri�gmp(��g!rd",0�nen�) w%< �elWu! �i
	k1ul-�ns`YG�(O;
		p`T�pzaf�2e{��5M"�BI	.\RuCab�n`thg�jeLpmR`�M�e		�h�s._cq�`uMg|xerProhocPinO$::M
	!?/�~!Am�e�d`� `rtpabLs�g&fveps
O(f:* .ui&d�}agu|d�0�&$%�.WopHmh#v)oer)�J		�nej.fd}a~�ver,`�eh 1e_fG7ets�vhaqi gvgnx-;

	t(i{"Bgl%r.ee$c$0c"�buI9�raggablD/�vaog�Nfb);
�Itlas/_�Ou�aD�$o8e�unp, |�4u)�$/@gcu�m Uh4`tv`&$ooca -$thm�s�u{Es }`a8h�e82(�ot`tn`b�`v�sa�<m4b%bNr/ '�Tt9n�Bcds +nrrEbd to3+tAo�u-	/?If�tlgCT{ma�age" Mp0us�m vnk��rp`ables�inFor}ew`�mqnaed� |Xqf�dv�Cqm~C!h!a sXi~8eT 8#eg���p07)�	in(( ,qa�dmaOkuu� )1t.uj#dtm�naGer�d�Qd3�a2�!|�i�,pe�fn|(;(�H�	bltu{.b02t%�/	,"�oouqmrq�: &uj#a)o��VvenT?�NPvn`awati�L)"Y�
{	+/�O}xut�h4hg �d<per� do{adaMh�	Iup)sfpjwIuanzh=q�[i�._wd$m2c4mPochtion(eJun�*	4yIw,psm�ion Rrd��t`kq._�_kVl0tTk�it�Ont��"ab}ghwt�j)�
-	/ga,� Pd�gi
& a^� cell`e�/s(�Jf use`tkdKvESeluyio pjkata>n(i� s[Dm�`IOgmq zetuS=dM
		�~� a�oPropegq%i�n) []+�	�ar`ui!5�vkir,]Gj@A�l�8s�A�	)b(|hIs.[4r�%gez+�erag/h �Seft- wI9�4�=��`-sd<({��9�tiir��~t7eU�({i);
�jetuSo b�Lze+
�\�	�Hi1&r3i|i+n0�(wI>rMw)ui_n;
	�	

	�i&-!tkhQ�/�th7Ns
axiz4|| tHyS�mp9e}N`oe0i{ 1w x� tli�6)�l��@S0]�2tkmeLudx =�th)S.2o�Ku@oj*lent*'px'3�ich�v�Is.k�tinb3.c<mw2|\ �ea�}xtio�c.apa= �}0"x(�dx{s>`wn1dr0u�styBP.por*=-|hi3.posithnnt_l)&p�g;	)�(,qi$dNm}~`gar9 �.i.`llaNqfeb,dr��!t8hw	 e~enu)=*
�	2e|u2n�dadsE::	u\,*:Oigw}S$np: �ufrU�f>h`wEn59��
M
		�.Ib*w�a�u!tcajbdzoPPcb,!s,(igbb� P(E }afa�d2 m:ou4 �h� d�of	wg� `�oP�gf�= G�l3e;-)		ig`(.5	�d$ianeolr8$ �v�yko@�i�hs&$�pBehafm_q�io
	
er/"qed = %mui.��ManaGe�jdboptim�. ewGod+9J
		//kF"a(`2gp som�S(vPn}n�|�)@u`��sovQ`�le)
+	h�hthyc&dr�q�d+w$		�Pop4ef 9 ��ic*g�_rxdd:		�dj�'6lrxd�d$ f1lsm�
y
��		/)if(v�g SxcinG|"mlgmgl� )s#�o(lnGab hn 4he DOD(T.�| c/phec tG cmnVi�ue$(Sde!+82�=)�
9�va2 UlEme~t�= this�emama�7S1\, %lem�n|Kno�="fa�se�M*	jile ,2i�%unt �'(b(e}l~4�- 7Mes�~t.aRulP^Ode9!a ;�
iF
�`L]kdb| �= dcmoe�v %0{
	Ie�C}enTI,{-�= tp1u;�	}
K��	
Kycf (�!eMt�af��Dkm v. D�jsi8tion{�hu�Peb9="�o2�F�,q�8$�+@1Pqtn�vq�{_;�	Id((this.o th5o�nzeVb4b=9%"�TvwCyf"�'.(!$�o�`ed0t}@(�@k�Ng�<�ilq>r]wert05=`�t�lmt" '0�ro�`u$) tt x(�s//peGjr*re6%rt#9=(�p5%bxl �$(�s�mmktidn(`(as*ot�-onz*vMfdBd9)&" 4i{2*od4Ionrp�fa3t&�anl)~h�{.eetm�nd l�c�pE`))) {(	�E� cel' -)|H��9	�	 �4:�qn(%lzev��aN)metaj�nAs.OPi�q�c,XisH�H/n,axA�sqInzthH3�'Adin�s/Be>e>eDus%p{�n,$$;, Fec�Xkm>!${5
	�	kf(sah�._tS)gGr8"kt�*0ewentx!=�2vmEsei$rOJ�		K�e,f�]e�ebp()	I)�T�
	-��	�5 �lre${
		9xE(4hMc&_�rkwg�r �r�oq&! �>M�D! a7=Bfbjs1i�)	]uh�W.Wcnmirm)r	J	}X	��*�
		pe4UPn��hsec�t�
�
�^mu�aW`: ftn�dyF,�WvenD��{*	ao 8|x9q.s44m�Nc&JfS�msT(n �5<a�bgu(!w�I		d% hh�-ui-�ra�oeb,e-ijba,mbi8�#�e1cm(bwzcdIon� { 
�	�	tXhbpgpe/v^nd�r�loV%3hiLO8l(�c; Ji	m%w0/�SgMoTm n2alm"he�Cgbs�	
U,*��
		/.mf"tH<`Ed�En`oep0Ys�ucEd�Dor$|r�q!bnas(@in�Opi�tha`ME{�/Ev tHat�fse#k,g"IAS ��/rae�H(se} #=1 ;)		lf(" .s�/t`m�NqG�r*="4�ui.��ao`'�sOvc&tgu�dh�%�Ate�pm�
	MZ))Pmug�n$$:u�+m�2ARot+uysg>�mO}scUq.Ball:thIs� u~c�t'=I,^	�
	p�~beU 0�unc~hkn0)zh/� 	Iv(�,i{n(%LRez.is(�nga=d`�gwablǭd�cggine")I4{
		tdm3'N�oTrep{9)>9!}"ulse#-�t`is*W*mO�pj)3�+�i�K)J	@reuq�. bLics		�},-	'eT��jd8e8 cUz�|aoM(e�ezt- �=
M 	bar hcjtl&�= ��yic~}PdiNNsh�nele }| $ t�is.�!`+Kl3.hI�Dlu("t(iq.mluelq,.l�mthd� 4ruM r�g�h{e3,tl1soqtao~3.B)|cte �hiC~$�dMWn4))	)/�I.�"*(D	aDv[�lf(!
		M�eac`HfUncv*gn+) y5	�9!Ee�phi� �9(i}e�u.t!v�%t� xAFd,u /�urumw�	[})E
�!I�e$drn i!ne�e��

 },M

	Uc2eateH�j�evz &5dSpYnoe4eoT�!{�

	na{!$= tHIs*o`tyoN!?�
-sdz xb�qub =2�.)GGu~ctcg�*�*ag,�er1 ? %(k�ke�`cR.A�u�y	t�i�dMummntpU�`Ief5lt]9!4:A(k/x�dpU24=84�Loju& ?0pIi�at$Ie|t�b��je(iz}=oz�AetR*&�d'+ :$|�qS.%`em'np)3!Iig(!he�pdb*ryven�S(#`of1'i.n}NgT�!		hg��e`.e��uN�%($�.g``��j@/ �=-'�m^�n�%0? |9msel�eEj|;4]_xe�e>|�d`% r`o&a qBjlTg	�9�
		H	nxhilqErK0� !<"xx)s�udem�nt0dvbhqhd�ix�d�`R�nlUt'8-).tgwv(`eLpes.ossX"pogati�j�)�im)�m`dR,cq;0"z�{xmag�, 2ag3ml��u�(�
		��etu2n0(el`��+�],�L�^�fnu�tn�fR}tD�o}HeL|d�8#fp.cv��N8_bk!`R*�yf typeOf@>`j$= 'c4ry+'7�#;�
	obj = �p�ls04md("&)?	�}*	kF(�fm�ar�a�8mbjm8`{�	)npj`}"kL�@4*)?`f*�]l(dwp.(��br8](|L(p}J	\J	Iyv`9'�adt'ko!"*h$[�this*ofrd .�hic+>mefv�5�nBbflucv k�t`)�.o�z'1�1�,ef|+@)�}	)if�	%2kgh0g`mn$nbji%�II-�iis&�eb#ol:gdib.Na��"| cBa3.hm�|w�82Olgrt�j�S,3)th )�Mbj�"eo�+�5hi�6}�r_io3.D�nv;	�^:5hg h'�poin"cfn)r;	Jt�ys~ofF�ev.3HiCk�doP ? �Bj.d�p�i<k)�.mavelov.}nP+	
	}
��yg((&�Ot�om'"[�o`h))�-
	/	thec/o�nse8,�,igj,dix �$dTa/h(|`gqpRopo�c/Ns/i�iG`t -(o�y,`O}tom�;tx)q.oapg��#.uO`�
�x
	},k
��OtvQY�e�hffs5t:�f5~wtk_&9q#
+�w>%t(dhu k&~re�Q!bu,t0aHl)c`cHa Au;�qo{kthol-��tl�s�of�ge�Pa�eg�$=�|�ic�XElp%2.k&f#gtP#�en�)�	ra�(@	 =�vh)A)/bD�edPcreƶ"/ffu�u":	J-/ �xxc�isd�0s�$c�cdk%)�a�wfsu)we�Nee4dto�|/di@9&a,mf�seT cadg}l`�` O@`�f�pv,$rmnke4xD0f-l,;win��happE.�C:Hɝ/�	!j`Th%"poyitio�$g&`th% 8�xp�z(�s ac.ol4wa$1co �t7sj�oSHmon(i� cedAmhct�d �`WE�0o� t)E-nmxt Ho�iv)on%@!4a�q�tJ		/o22.�Pl%met�`~ovdst4�pi tz is��"cI}�d�od$thM"sc0gdL `Are��3 1Ld txG$sk4onm��[e4 ltn+z t�%`dA+umAot�h7x!c`$}�`^s t8�v		�-  $ Th| ccrGlL ks ik�<�dml4�~@tlu!if)qman��q|Sw`i$lon on Txe"o��s}|(oG���d$pq�mnt$0K�|(�E2ej"�cclculct�d%0po�#pS c��	�v,�li�L`q�Positio� - �ab{�luke �&@vj�s.�s~om,Yi6a^�\4](��"Dccqk�h4""�$$.ui.��ba(�S(dim{
�gZ�ll�awel{1)((is.mtgsc�Pa3��t]�Ƚm*		pj.n�vt8+y |Iis*scs_�v0qru~t*�`pD|Left(�?M&�	pl.�op$k�dpx�ssbwliPAbe.�.�!tollT�� )	
	=B
�Y)�(�~hi{?o�:s�vPir/v�`["�=$o'q�m)�.oAza �?Dhk�0n-tds p$fe qcptaL�y�do.e@fkv lL &r�3seb3l smoiE``!geXPqeeC mZa�UDGs thhs!(~bozm`|i+N�9|\�)Din�.efg{e��are�P[9\.t�cfcKI�&"t`�w":f&7�vX�geFtK0m*}CfDa�.tOFMeE{K�[5h)�} %ht�`&!&2��/bqcSDb�a�9e�)2'Agmy(I�`~ix�	vm<+(t?p:�p`�ef�:"8"m9
���reTu�j s	-w}�2*Q5tOp8*$(pq+sdInt(phi�,{�wsctRarmlt.#�g("bm2du}Tpi�4h2)70)(}x(8)�AI	hedp 8o&te�u ��( cr�eI�t(V)-B.obfse|ardlt.csg(�zo`dd2LEftvi�th*!11-!�|$�)�Z	|;�	�m.
-
Og�uRe�Kt�tmOf�wdt8 �unotil=a�J	iu�tj�S�ss�Tjsidiv=q�#ilaukV�) {	m	vab @��|vhiw8!laMen�.�O39v�kd((#3�	9veDu�h 3O
		�mq:0ptkn - pkRs��nu(xhIy��DlpDv.�{s2vo� i,0�� \|/) ? 4kir�Zcs/|`Q1reNu,ucsj�Tmp(4M(	lust2�b��%`t �!(`eV{e�n�(tHis/xem`er/g�s �$fu�(d�2) .� 2! 8brlis*rcrO<J�SmM�N�"2'l4�uv�,		��};	�� !lwd�{�
		2ctub"["vcx: .!|gt� 4!|+ŉyO
w,�J	_ca�,$Oib�In`
 vegC��/o() y�	Phic.M�w�yn3 � [(J	))laDt�,parbeI/d(ux�z.al%i��t>coS�&eQp'knleF~b),Y4$yl 0�-�
�(6�: ta�re�lt,t`yq.fmLme&t(eg(bmar�c(�op6)0	�\��)�!Y�hghd40pcrseL~v<vha{.d�bMe�t.gCz,#lSr�i|Pkgh�" �5	"��`�9/�pLuu�s: h�ar{)ln4*t*ye��e�^�cqr "mcrwaxCe�O0"i�1!p||�ҩ&	K�{*)9</�CqcL,(gl e�top�TdionB:�bqoge�on(+$�Y�tl�s�h�-rev2nrNvtIo.s {)I'#d4h`t�k5.aglqev&Jwd%pLidt�>,
�)�ehg`p�tHyS.h%mteB/�u�erHE�gHv(	*E	|9D

m,&J_w�d�{f�ain}Ejt"$[=nc<)j�)QH
var =(thi{nmptmn�
-9f-m.g_ntqi.�%.00%= '�qzdnD%	d�.sonpa{K��.6!?0dIishml�mz]pU.pD�d�VNM$e9M
	If �*Ckn@�mNmdk,!=<,'�nrumqnt' �t o>b�f�A}�m�nt�<� canlm&��T�ys.c/kTa�jmgof0/��I		g(g>�ai�Men�`�=��dks1|dgvg ?�t�>$$w�Ddo;)~SA{ol(h-gei!�*�yr.ov|3}f.be�a�iWe.,�lt�m@th3s*odbr`�.t�sun�>,qFd<�BM		o.�nl�a{JM%�xj�ydgcuie.t' � x $&i�Pf`w(.Scr�h�ox�0- `h)}/oesatsaNc�yvdt�T � _hisoffcGd.$ar}mP.�o,�I(on�an4ahjmen4 =} '��Auy$~|g0? ( : "vin@�7!:3c�on�L�bep#8`8!d(/�a�npa�}%env�<=cd�fUm%.u4��$.c5me�|`**2y�nuynwi]p�(i = d�iw.,a@�Errrn`nwdkgn3owxT(@ht�9s�lasgi-r.l}fw,�n���cmjteil�4.T }� '$o3��5j�@� 00" &(wiN6�1��sr/|l\op(!�a+,%(n*codta�dmenu }= �docuLeo< ? l{Umend(�gIn��g)<jeigh��	�,| dcE}azt.�$y/pqBe~T^Oam,gc�o�lHe}vkT8 �vhcc.(�,p�rPBO�or�)/R,hEiG�p -�tx�s.mir�)zr)o�		�)
�	駫 %~(eocuEunttwmndor�hEvm~t+)
4acr(o(!ktaifl%$p( &'g
Cnn�hi~m�b�ngjn3vrua~iRoq= rfa�% wM) & �  &�fas!c=D$(.,son�ainMc~s);
		6!�c!0m"c[2+ if)imeM re\}rN;NI9�~cb 3/ ? a/f�sev([��vcrQnrer ($�ad-."qg("Otas��/7") 158�hK�|gJ-;	-	!�mS~G�`aI&`�Nt`- Y
	*	(p��seInt 5(cu((g3� fore�rLea�ieth"9$10;0z^�+0+ (p�Z�e�nt$(ce(~cp�0�pefgi�GL5bt@)/38)(H� 4�,
	�cArsaIot-�ce>"sr("borlerTopwidt�"�,7t+ 8�- ) �rsqC�u($,k�a&c3C(ba`$i�uAgp),10	 } 0ih	
		8/rd� ? ati.maxicd*c�bo�dW�VXhc%,ofcWeuWidul) :&#tlnfd�f4aDd i�-�*`asseIft*�cu+.��q(2borhdzMgdtW(pv(1).qP) |�,t)- 2pAvquIdt($,ce(,�Sf8"`�4egngRmg(d")(1�)(oD��+`5!tiIs/hed4avP"m`o~�ioNs�wYdtH,�pphiquebgmn�&�tvt -�t)i{|ihw'i�q�rI'hd,U
�			omv�?!MatH�ua8)ke�KrodX�ao8v,a%,nfhq%�Hmwh�( 8 ce/�f�e|�%igMviHM x aRsmI�&((c�)lc2q*2B�pDmRRodW9&qh"!20)�z|$4)%)��paf3eIo4(%�se�/sss(bpi-di~sFO�uOebihq0- ty(! �0tji#*hu�PepP2ob/rtyfn{<xeiwJvb��dl1c�ezgi�sn4op  �THiS.da�gilS>bo4pom�)	])
m)1�,)�/�Ehathr�coNti�.eR�= c
�i	�0e�se�ibno'ku��goent�#fnstr�cPv8=-�	
�ax) �
	\�{.C?jt`ynmenT � o.s/ntc=lmFnt��*		\	}l	n
SsonVetvLMsi�io>P�:`func�iog(d< X{s)�{�
	if(%tos!�poS4� thmw.PsiVi_l;
X�aR�no�5 d!=""�bso�uD�& �0 ;$-02M	)Tar z =�ph)r/ot4mnnk,$qssol` = wz9s/CssqyuhoN#==&3�bsm�uEE`6, ! $*is.Jcb?lqP�teNt�� )) hfuient �&`$�i,cn�t`�ls8tl-F6k�o�-B�seNu{0]�(�lic.Offo%wp�{e~d�0]�)"/ ?jhw*kf�getX`rio�1:$�xi{owaRolnPaF%~u$sC;Of^K�rool� 9 *+�hteltD(�Y�-iynV%wt�crolN[],tCbFame);/
�
	�rev4�b ;*�t�p� 	
		9	pgz.t�p		�Y	�	)�		/gpPhdafs+l5d�$�ouSe pxsip�gjN
5(��dhk�kffqIx/s%'l�i~etoT� mcd)�@		
I//(gnny f�r rul�tk�|0xo�idmL�Gd0ngDks"uL`ti.e`/&�Cet"�RoMbele}e�t 4~0ofbw�u8xasEn$�	3 �jis&]ff{gt8pird�tftp`k hmTI	)			!		I/n�T.� nNfzeRPb�~t3 nvvxo�0UIt,ov4!bo;lerq 8ocFsqt(� bode{)-	/�* �`ro�smR,sU�ssa &&!&-jrowkEs.F$rsHgl ?0�26 &&hThi7>csspo�k5io�t-5 'gIyel&��)$ ;�)(tiis/csrXos)wio~ &= #�ix%`' - -t`//sc2oLmP�r�z~.#crllho��Q0� " vCrnllI{B/mtNome`�`�a{ s+p_lllc2omh�p�+()p*0�pm�)/		�=
H	laND2 *Q�M�p�s,e&�IM				)		I)K��~/ Xhu�a �k�uDe`mkvRe�vgaitioj
		+��ias<O&�Se�.rEn!da'o.�EdV k mod						/� of-y l/� r�Lqti~e"pO7itho�e� j�vEs;(rui!tmN5`oFfwDt`frmm�%m%rt�\aofCs�t(PArddf	�	�	) fHbg/"tseT*t�r}~}+l�fuP*0m[d	�Ik	i�I.`@t�D bf�u$`irent's i&ds%0 sitxouu rMSdeRsp�?'dS�T) bob�uZ-		/��$.b�ossR(r�ja0i f& %?b�nGk%v�vuzbIon48�122!f#�(A�&c3sXk[itko,0= #�ixed/�?(2 8(<�t��p�cssTo{zT�on�==$biYeD'9$=ukhc.�{rl�Pabujt.Cgril�Lgrt�9(: s+znl?I1Ro�tLoue�00`8(qkb�Ll~skr~n�Lafv ( ;+ �o$!
)		
 ];M(�J	�l/*
uFcnesatmos�|y}d: FU�dt�om�eVm~t) �
	Tcr0(4�:yhiS>ot�hoF0,`rMro�l =#|h�rNcw3Xo��tooo8=< ab�Lt`e' &" #��Hyqfs�sblnTa>�.t[0](!9(dka|�g� #� �.ua.si|tya.s$TX�S,Scrol<TeRgldU�\, <\is*off#ttPq�entS1|	-�=@T(yS.kF�seuTas�\(2!thi37ccpol�Pa�E* n@b�`OleKqRom4wd�z9((j�(<lgoly-o(&tgs�wcpOln91\.tigN�/}9:
	�4ab20�feX(��iven�+p'mX9��
v!r pageY74�c6e|%.pa�aY;y	/J) )&-$�o�ixioo a_st��)l)n�#�"�) * C�ntba)c�d e SO3i�iojhtba =s ld griTlhbmote+/m~nt.�	 '	
��if)pis(�ri'�n�losd\io.9"~�o	f g!�rg�lo�&d2qfgifc09Mw, we0wov!t�chafk8&obroaVkoo��	  �     !�!` {�jpi~lun4;H �$( �� hf+thHs.k'�pksneent)�{	�j		"if" �jis.ped(`iVw[{nlubajmr!��[		  �  `s"co!$th�c�f,��k�u['oluc�Ndr/n�jqe\h!;-J				# 0� co�t!io%e.t9=$Z�phirn"_.tai�geNTY�]�+ �k.l�v�,	
	�M	"  )ti(�nc/btaajM%npZ] *�ao/tg1,
�8-0 $b(thh3BJ~,`h�mELlCp]!+##n*d�dt-		�	!  ``pjy26�O�tqilie.�[3 	"�;.t�0 _{�	 i�}
I�	 ��sgk
		
a$ &%s_n\e�nm}nt <!ph�s.1n| ifmen�3-�		��u
�	i&(eVenv.�`geX"���(�s,�f�set
qt�aK.leBv"&"�ontain{entI0M-rpaDe"9 s-*�Yy&me��Z1]�;"t}is.+�dc%Y*c|qga&LM&�9
	K	k�8E�ent>0agEY - �Hisoofcpm�.#Mmb{.tn8`<�s/.tkijk%f|Z0]	 `�w� =(~on|�Klmg.4KqA0k!tiMro�$se1/kl)sc.DO�;
	�an*evcf�.pd!aX�- thiS-o�&se\.a,hgk.mef4 > ra~tmml}en|;2}	0pQg�\	M"cvnp'=~=&ht[2]�+4�(i3oonfbmqa��c+.du"u;
I
Iefwvd/t+pa'�q(%(thAs.G&Bqa�>�likb"�o91&0�oZ�aifmc4R3�0page] =(CoNraI�e'�t[1m+ tnj�>��fQe|>aMiK.dv�;+*A��}�LIhn)gosry$9�{
	�		�?Khuck0bjr�wT�L$g�mme�t�.zet c ��t�!0ru&ent,dm6ide��y 0 }�zo2 gauRYng hnv�y)�"`rgel~�T Ervo�s yk(IE*{ee0|�ckEt0#7�509M
		t�p �nb0=$�.gim= /�T,is.+rioi�`|POfQ *�Ia4j�bo�vD (PdO%[ �"{hi�.o�ycin��cnuY*8/(K/_r)dS9]�h*"m+G�idS]``��is>v�fI>A P`gEX;-�paf/i,=!bjjt`i+mekt ?`�!(tgp$. thiN�n�et*bmiac.�ox(4@ck�tailmemo1M0� Fop", di)K.on&s�4.c|ick.tg`p c~�tqi.me�\i�T) ?vmy�:((! pO0 - tims.kFfSet$h�i{k.t.p`< co~&qyn�il[1])!<q8-�Cgfs�lY1](:�Vkq1� o�fp�$Ss�)( Z&�ox�
(��v�r l!6t(!o*ev,Y4_? |(is2i7InaD�Am�I! EktM>po}n$� pe&uH m�uxak,orIgi~ah��'eY-�/0O.Gsj4[hY� 
!l.7Ji~�`Mh> �liq./rigj~ilT!ge 7%�m	uaweX }"kondah/}e.t��$h$(|abe - th�3#ohfaet�!�ck.levt!= coN`mn%en;0Y ~�`L%`w ,`t���lm�b�u~.cjkc.nleft$.D�gn�a�n�f`2E �!,a&<((�X�le�4`) 4hmi_YvfYe�*chyc$ofv ,"Ck�pq)nYw�t4Y+ ? eEfp$-"�?_ryf[8]:�(%&d(/ knoreEJ8ݩ9 ; lEnP�L
		}�M		}�H-)Revu`o$r
	)topz�,
		8aceYY	�			�H�			?!Nh� qZs�M%ve`�nw�e$pNCi\ion
	a- txls.offweb.w�kcJ.4<p	�	I(i			K�)`Ci#j kfnS4p �BgL��i�5 tot`e ��u=eNt!	H	$6h�e.ofb{ ~>r�letl^e�c��I			//(Nod=>VMs�rgmti�m!|/qy`in~ad"jmDe�: RelcpirG ov_sat frk llemln�tg olfset �arT�|"		+= Th�s.�"��g4>pcPenr<�/p�I	�
�H		H//<(%('�fseTYaR'�t'�$o�gwet viti.1t�borDdr; `gfbs�l#+ b-+der�
			�) 8$>�ro�se2Nsyo!pk8>&($.frmewdvn�mr�)c� "4�5#.��v`iq.cwspksyt	�n0�=�'wi8ud�$$r :!("lhIs&c#sTk#ithmN)=?��f{|ad.`?0mrHi+sBPnmlXe"ej5.sc�ol�TOx09�z$8$S�rol�!��mitJ}fe!? 04:scc_mn.�vrdhT�p(-(�$)!&)	4F	9lef\* ,/+	te�D[	��				�		XH	���hePejS|}�` eOe�e�p-#id@on	+I), th��>~dfygtrc�i�k"lecp�)=�			)		- J�ico o&fu$t )k!�qdive"4o te2M�em�ot+J		Ie Dhys�of�ron.r%lc}wVele�u	I	�I);I		/ G/lyfi2!r�l�|IvQ�p�3)pio�edHnod$v� RmlAt9vE og�Rdt brom!ulu}mnt$|�!n�fs,wb0��end�	$ |ai3+ov�Sg�&`hru�%.�Eft 	i		.�0\hw /Bl2E�)2ed's�o.F3eT!vht�o�t bwr�ev� hff{ev@�``kcder.-�I��	! 9$-fro?qeZ*3if!ri $& 5$bsous%r�>-rsion ,!u2F &&0vlms.+�zPowi�io.d=-d7biped!G 0 8�(�tiiskssS�sivio�=<('&Hpol'�? 4hl�k�vhllXarg6t<s�k-lFef��k : scs�|�	p�kgqKgle ? 6 z serOl�nrcs}-(|dnt+ 	)J�--N		=;
I:��		Zclea0:$B%nk|io~( s�	`jQ.�E}pAr/7�mmfeClarr("1i-�2)Fgarde,hb�e7�nc�(;
	lg(txi[.hOnp�r[2_ 0= thIs(m�}ent�8\ $�!�|ji�.caosdl@eLh�R�%e�vrl  Thi�.xerEb=re}nvu-9/=:		?/ib($&u�.�d}ajqae�f.5�."�d"ncgu6,swpv�jT0=(~m,|�
}yi_.J�dq�r =0_hpl;
K�uh)s>cchceLHel�#rReEov�l0y$bads%},��
	o3BNri}@l]W �n s},K`wT~�b �%�!ionY:�dppu�Q
�4rhGcer: dun"t-o~�TQpt, &v|~�,�u})!{
	)ui - ]i�f|$r�ip*^�IasX a{
	&.qx,�ng�in.CallrPhi#,"txPul [}ra�d,(vaU-�
		�v-txEe�<=0(`2`�"	`T(i�.�mr�`iOnAbS�? tiIs�cFbEs$@�caLI?Nto 2e�oNup�)y"+/U(a�)sk�u�g$@nii�honih�ql~ bm u5c`t�}}atEd !f|Er `�2si�w
		�e�{p� $�wx`ggp.pRkt/t}pm�r9k�ap.c$l�Thhs((eypD< ev|l�.uh-	*
tlp'in3Z%{},4MIWe�Hh�Hj n�j�tiOf ��G$i�Y���t5�z!{
		ii<`gr:!th�S��expe�=�
)I0O3I|i�n*t�i3n0}sLtyok�	��vmfio�|P�qh4ioN�`txis.��k�i*��TKqitioN,�	o'bq�t: T(K3�xosIt�k~A3{
};E
MY
,
|!8�

 nex�_j/�a*dvaGgavlg,d{Lverwikn:$&1.8�6�"O-?�$�m'`hy/in�ad`�&�p�goqcl�"h "`�nnQsvTGScrtaBnc*(#{	spa3V> ��jc4ioJ)eve�p, Ei� 3M

	v`s aOct�? �(� (R .deuah&dga�eEle�-,o =�Ifqt>ovionr 	)		�iKgrtablT$=$fex\o.l W}(rsi,&�!iuem.b�vWtE|�m�ht(x(3-
)�ok,SNdarlwv!= Y_#
+&(m�cm$neC4t~WoJr!bng�i@�h`etnCtoon]) �rA�0Slqtu�lE >$*deT�(tis�$'1�0tc`mEc�;�M		�V�#soR,`�e &$ (�%rUqbl�/�pv�on�,)f�rl�D-yiNs4*S.�tA�hesRU;h)I M)ls�cma�z �/rt!dl\.
	�	K3`nu�@Va|yru2$#GbTab���pP��n{,vevg�u
)		!|%+��Y)	sn�t�glE.�}f�eShPkzitmon�*��8//�Spll�thU$s��tef~u6sDs��r�3h�Osa�xgng�a|,fvag wtar|�p~0pe�reah!thE!{m*wi)~urG�cHu03Incm�uhq q�b�aBj-$an.�`M~ER gT#`d �s u,l$ho!DrbG Kn$@ji%t�0v�@b�!t`d�(�a�e0*thi�`{iLl e�Surt�Kp3`i�i�i``es�d aq`gd�j arceo*g kwpt�ib���%p$wi~* @~y �ha�Fe�1�@a�4mj%ht have$`ippjeL0ol��ja%p�od).
	Lro2cbD�.G�p�nqr*"qctivete�, qvun,�ea�{v4a#�u)E��	I=>	q});�r>y(�qdg�: b�jc3iob�arent!�i)({
*I//Hf(d �j-$�$inl0ove�t(d!oBp!�h�� 5 gaKa(4he A�kp `r��"Of the sortable, but also remove helper
		var inst = $(this).data("draggable"),
			uiSortable = $.extend({}, ui, { item: inst.element });

		$.each(inst.sortables, function() {
			if(this.instance.isOver) {

				this.instance.isOver = 0;

				inst.cancelHelperRemoval = true; //Don't remove the helper in the draggable instance
				this.instance.cancelHelperRemoval = false; //Remove it in the sortable instance (so sortable plugins like revert still work)

				//The sortable revert is supported, and we have to set a temporary dropped variable on the draggable to support revert: 'valid/invalid'
				if(this.shouldRevert) this.instance.options.revert = true;

				//Trigger the stop of the sortable
				this.instance._mouseStop(event);

				this.instance.options.helper = this.instance.options._helper;

				//If the helper has been the original item, restore properties in the sortable
				if(inst.options.helper == 'original')
					this.instance.currentItem.css({ top: 'auto', left: 'auto' });

			} else {
				this.instance.cancelHelperRemoval = false; //Remove the helper in the sortable instance
				this.instance._trigger("deactivate", event, uiSortable);
			}

		});

	},
	drag: function(event, ui) {

		var inst = $(this).data("draggable"), self = this;

		var checkPos = function(o) {
			var dyClick = this.offset.click.top, dxClick = this.offset.click.left;
			var helperTop = this.positionAbs.top, helperLeft = this.positionAbs.left;
			var itemHeight = o.height, itemWidth = o.width;
			var itemTop = o.top, itemLeft = o.left;

			return $.ui.isOver(helperTop + dyClick, helperLeft + dxClick, itemTop, itemLeft, itemHeight, itemWidth);
		};

		$.each(inst.sortables, function(i) {
			
			//Copy over some variables to allow calling the sortable's native _intersectsWith
			this.instance.positionAbs = inst.positionAbs;
			this.instance.helperProportions = inst.helperProportions;
			this.instance.offset.click = inst.offset.click;
			
			if(this.instance._intersectsWith(this.instance.containerCache)) {

				//If it intersects, we use a little isOver variable and set it once, so our move-in stuff gets fired only once
				if(!this.instance.isOver) {

					this.instance.isOver = 1;
					//Now we fake the start of dragging for the sortable instance,
					//by cloning the list group item, appending it to the sortable and using it as inst.currentItem
					//We can then fire the start event of the sortable with our passed browser event, and our own helper (so it doesn't create a new one)
					this.instance.currentItem = $(self).clone().removeAttr('id').appendTo(this.instance.element).data("sortable-item", true);
					this.instance.options._helper = this.instance.options.helper; //Store helper option to later restore it
					this.instance.options.helper = function() { return ui.helper[0]; };

					event.target = this.instance.currentItem[0];
					this.instance._mouseCapture(event, true);
					this.instance._mouseStart(event, true, true);

					//Because the browser event is way off the new appended portlet, we modify a couple of variables to reflect the changes
					this.instance.offset.click.top = inst.offset.click.top;
					this.instance.offset.click.left = inst.offset.click.left;
					this.instance.offset.parent.left -= inst.offset.parent.left - this.instance.offset.parent.left;
					this.instance.offset.parent.top -= inst.offset.parent.top - this.instance.offset.parent.top;

					inst._trigger("toSortable", event);
					inst.dropped = this.instance.element; //draggable revert needs that
					//hack so receive/update callbacks work (mostly)
					inst.currentItem = inst.element;
					this.instance.fromOutside = inst;

				}

				//Provided we did all the previous steps, we can fire the drag event of the sortable on every draggable drag, when it intersects with the sortable
				if(this.instance.currentItem) this.instance._mouseDrag(event);

			} else {

				//If it doesn't intersect with the sortable, and it intersected before,
				//we fake the drag stop of the sortable, but make sure it doesn't remove the helper by using cancelHelperRemoval
				if(this.instance.isOver) {

					this.instance.isOver = 0;
					this.instance.cancelHelperRemoval = true;
					
					//Prevent reverting on this forced stop
					this.instance.options.revert = false;
					
					// The out event needs to be triggered independently
					this.instance._trigger('out', event, this.instance._uiHash(this.instance));
					
					this.instance._mouseStop(event, true);
					this.instance.options.helper = this.instance.options._helper;

					//Now we remove our currentItem, the list group clone again, and the placeholder, and animate the helper back to it's original size
					this.instance.currentItem.remove();
					if(this.instance.placeholder) this.instance.placeholder.remove();

					inst._trigger("fromSortable", event);
					inst.dropped = false; //draggable revert needs that
				}

			};

		});

	}
});

$.ui.plugin.add("draggable", "cursor", {
	start: function(event, ui) {
		var t = $('body'), o = $(this).data('draggable').options;
		if (t.css("cursor")) o._cursor = t.css("cursor");
		t.css("cursor", o.cursor);
	},
	stop: function(event, ui) {
		var o = $(this).data('draggable').options;
		if (o._cursor) $('body').css("cursor", o._cursor);
	}
});

$.ui.plugin.add("draggable", "opacity", {
	start: function(event, ui) {
		var t = $(ui.helper), o = $(this).data('draggable').options;
		if(t.css("opacity")) o._opacity = t.css("opacity");
		t.css('opacity', o.opacity);
	},
	stop: function(event, ui) {
		var o = $(this).data('draggable').options;
		if(o._opacity) $(ui.helper).css('opacity', o._opacity);
	}
});

$.ui.plugin.add("draggable", "scroll", {
	start: function(event, ui) {
		var i = $(this).data("draggable");
		if(i.scrollParent[0] != document && i.scrollParent[0].tagName != 'HTML') i.overflowOffset = i.scrollParent.offset();
	},
	drag: function(event, ui) {

		var i = $(this).data("draggable"), o = i.options, scrolled = false;

		if(i.scrollParent[0] != document && i.scrollParent[0].tagName != 'HTML') {

			if(!o.axis || o.axis != 'x') {
				if((i.overflowOffset.top + i.scrollParent[0].offsetHeight) - event.pageY < o.scrollSensitivity)
					i.scrollParent[0].scrollTop = scrolled = i.scrollParent[0].scrollTop + o.scrollSpeed;
				else if(event.pageY - i.overflowOffset.top < o.scrollSensitivity)
					i.scrollParent[0].scrollTop = scrolled = i.scrollParent[0].scrollTop - o.scrollSpeed;
			}

			if(!o.axis || o.axis != 'y') {
				if((i.overflowOffset.left + i.scrollParent[0].offsetWidth) - event.pageX < o.scrollSensitivity)
					i.scrollParent[0].scrollLeft = scrolled = i.scrollParent[0].scrollLeft + o.scrollSpeed;
				else if(event.pageX - i.overflowOffset.left < o.scrollSensitivity)
					i.scrollParent[0].scrollLeft = scrolled = i.scrollParent[0].scrollLeft - o.scrollSpeed;
			}

		} else {

			if(!o.axis || o.axis != 'x') {
				if(event.pageY - $(document).scrollTop() < o.scrollSensitivity)
					scrolled = $(document).scrollTop($(document).scrollTop() - o.scrollSpeed);
				else if($(window).height() - (event.pageY - $(document).scrollTop()) < o.scrollSensitivity)
					scrolled = $(document).scrollTop($(document).scrollTop() + o.scrollSpeed);
			}

			if(!o.axis || o.axis != 'y') {
				if(event.pageX - $(document).scrollLeft() < o.scrollSensitivity)
					scrolled = $(document).scrollLeft($(document).scrollLeft() - o.scrollSpeed);
				else if($(window).width() - (event.pageX - $(document).scrollLeft()) < o.scrollSensitivity)
					scrolled = $(document).scrollLeft($(document).scrollLeft() + o.scrollSpeed);
			}

		}

		if(scrolled !== false && $.ui.ddmanager && !o.dropBehaviour)
			$.ui.ddmanager.prepareOffsets(i, event);

	}
});

$.ui.plugin.add("draggable", "snap", {
	start: function(event, ui) {

		var i = $(this).data("draggable"), o = i.options;
		i.snapElements = [];

		$(o.snap.constructor != String ? ( o.snap.items || ':data(draggable)' ) : o.snap).each(function() {
			var $t = $(this); var $o = $t.offset();
			if(this != i.element[0]) i.snapElements.push({
				item: this,
				width: $t.outerWidth(), height: $t.outerHeight(),
				top: $o.top, left: $o.left
			});
		});

	},
	drag: function(event, ui) {

		var inst = $(this).data("draggable"), o = inst.options;
		var d = o.snapTolerance;

		var x1 = ui.offset.left, x2 = x1 + inst.helperProportions.width,
			y1 = ui.offset.top, y2 = y1 + inst.helperProportions.height;

		for (var i = inst.snapElements.length - 1; i >= 0; i--){

			var l = inst.snapElements[i].left, r = l + inst.snapElements[i].width,
				t = inst.snapElements[i].top, b = t + inst.snapElements[i].height;

			//Yes, I know, this is insane ;)
			if(!((l-d < x1 && x1 < r+d && t-d < y1 && y1 < b+d) || (l-d < x1 && x1 < r+d && t-d < y2 && y2 < b+d) || (l-d < x2 && x2 < r+d && t-d < y1 && y1 < b+d) || (l-d < x2 && x2 < r+d && t-d < y2 && y2 < b+d))) {
				if(inst.snapElements[i].snapping) (inst.options.snap.release && inst.options.snap.release.call(inst.element, event, $.extend(inst._uiHash(), { snapItem: inst.snapElements[i].item })));
				inst.snapElements[i].snapping = false;
				continue;
			}

			if(o.snapMode != 'inner') {
				var ts = Math.abs(t - y2) <= d;
				var bs = Math.abs(b - y1) <= d;
				var ls = Math.abs(l - x2) <= d;
				var rs = Math.abs(r - x1) <= d;
				if(ts) ui.position.top = inst._convertPositionTo("relative", { top: t - inst.helperProportions.height, left: 0 }).top - inst.margins.top;
				if(bs) ui.position.top = inst._convertPositionTo("relative", { top: b, left: 0 }).top - inst.margins.top;
				if(ls) ui.position.left = inst._convertPositionTo("relative", { top: 0, left: l - inst.helperProportions.width }).left - inst.margins.left;
				if(rs) ui.position.left = inst._convertPositionTo("relative", { top: 0, left: r }).left - inst.margins.left;
			}

			var first = (ts || bs || ls || rs);

			if(o.snapMode != 'outer') {
				var ts = Math.abs(t - y1) <= d;
				var bs = Math.abs(b - y2) <= d;
				var ls = Math.abs(l - x1) <= d;
				var rs = Math.abs(r - x2) <= d;
				if(ts) ui.position.top = inst._convertPositionTo("relative", { top: t, left: 0 }).top - inst.margins.top;
				if(bs) ui.position.top = inst._convertPositionTo("relative", { top: b - inst.helperProportions.height, left: 0 }).top - inst.margins.top;
				if(ls) ui.position.left = inst._convertPositionTo("relative", { top: 0, left: l }).left - inst.margins.left;
				if(rs) ui.position.left = inst._convertPositionTo("relative", { top: 0, left: r - inst.helperProportions.width }).left - inst.margins.left;
			}

			if(!inst.snapElements[i].snapping && (ts || bs || ls || rs || first))
				(inst.options.snap.snap && inst.options.snap.snap.call(inst.element, event, $.extend(inst._uiHash(), { snapItem: inst.snapElements[i].item })));
			inst.snapElements[i].snapping = (ts || bs || ls || rs || first);

		};

	}
});

$.ui.plugin.add("draggable", "stack", {
	start: function(event, ui) {

		var o = $(this).data("draggable").options;

		var group = $.makeArray($(o.stack)).sort(function(a,b) {
			return (parseInt($(a).css("zIndex"),10) || 0) - (parseInt($(b).css("zIndex"),10) || 0);
		});
		if (!group.length) { return; }
		
		var min = parseInt(group[0].style.zIndex) || 0;
		$(group).each(function(i) {
			this.style.zIndex = min + i;
		});

		this[0].style.zIndex = min + group.length;

	}
});

$.ui.plugin.add("draggable", "zIndex", {
	start: function(event, ui) {
		var t = $(ui.helper), o = $(this).data("draggable").options;
		if(t.css("zIndex")) o._zIndex = t.css("zIndex");
		t.css('zIndex', o.zIndex);
	},
	stop: function(event, ui) {
		var o = $(this).data("draggable").options;
		if(o._zIndex) $(ui.helper).css('zIndex', o._zIndex);
	}
});

})(jQuery);

(function( $, undefined ) {

$.widget("ui.droppable", {
	widgetEventPrefix: "drop",
	options: {
		accept: '*',
		activeClass: false,
		addClasses: true,
		greedy: false,
		hoverClass: false,
		scope: 'default',
		tolerance: 'intersect'
	},
	_create: function() {

		var o = this.options, accept = o.accept;
		this.isover = 0; this.isout = 1;

		this.accept = $.isFunction(accept) ? accept : function(d) {
			return d.is(accept);
		};

		//Store the droppable's proportions
		this.proportions = { width: this.element[0].offsetWidth, height: this.element[0].offsetHeight };

		// Add the reference and positions to the manager
		$.ui.ddmanager.droppables[o.scope] = $.ui.ddmanager.droppables[o.scope] || [];
		$.ui.ddmanager.droppables[o.scope].push(this);

		(o.addClasses && this.element.addClass("ui-droppable"));

	},

	destroy: function() {
		var drop = $.ui.ddmanager.droppables[this.options.scope];
		for ( var i = 0; i < drop.length; i++ )
			if ( drop[i] == this )
				drop.splice(i, 1);

		this.element
			.removeClass("ui-droppable ui-droppable-disabled")
			.removeData("droppable")
			.unbind(".droppable");

		return this;
	},

	_setOption: function(key, value) {

		if(key == 'accept') {
			this.accept = $.isFunction(value) ? value : function(d) {
				return d.is(value);
			};
		}
		$.Widget.prototype._setOption.apply(this, arguments);
	},

	_activate: function(event) {
		var draggable = $.ui.ddmanager.current;
		if(this.options.activeClass) this.element.addClass(this.options.activeClass);
		(draggable && this._trigger('activate', event, this.ui(draggable)));
	},

	_deactivate: function(event) {
		var draggable = $.ui.ddmanager.current;
		if(this.options.activeClass) this.element.removeClass(this.options.activeClass);
		(draggable && this._trigger('deactivate', event, this.ui(draggable)));
	},

	_over: function(event) {

		var draggable = $.ui.ddmanager.current;
		if (!draggable || (draggable.currentItem || draggable.element)[0] == this.element[0]) return; // Bail if draggable and droppable are same element

		if (this.accept.call(this.element[0],(draggable.currentItem || draggable.element))) {
			if(this.options.hoverClass) this.element.addClass(this.options.hoverClass);
			this._trigger('over', event, this.ui(draggable));
		}

	},

	_out: function(event) {

		var draggable = $.ui.ddmanager.current;
		if (!draggable || (draggable.currentItem || draggable.element)[0] == this.element[0]) return; // Bail if draggable and droppable are same element

		if (this.accept.call(this.element[0],(draggable.currentItem || draggable.element))) {
			if(this.options.hoverClass) this.element.removeClass(this.options.hoverClass);
			this._trigger('out', event, this.ui(draggable));
		}

	},

	_drop: function(event,custom) {

		var draggable = custom || $.ui.ddmanager.current;
		if (!draggable || (draggable.currentItem || draggable.element)[0] == this.element[0]) return false; // Bail if draggable and droppable are same element

		var childrenIntersection = false;
		this.element.find(":data(droppable)").not(".ui-draggable-dragging").each(function() {
			var inst = $.data(this, 'droppable');
			if(
				inst.options.greedy
				&& !inst.options.disabled
				&& inst.options.scope == draggable.options.scope
				&& inst.accept.call(inst.element[0], (draggable.currentItem || draggable.element))
				&& $.ui.intersect(draggable, $.extend(inst, { offset: inst.element.offset() }), inst.options.tolerance)
			) { childrenIntersection = true; return false; }
		});
		if(childrenIntersection) return false;

		if(this.accept.call(this.element[0],(draggable.currentItem || draggable.element))) {
			if(this.options.activeClass) this.element.removeClass(this.options.activeClass);
			if(this.options.hoverClass) this.element.removeClass(this.options.hoverClass);
			this._trigger('drop', event, this.ui(draggable));
			return this.element;
		}

		return false;

	},

	ui: function(c) {
		return {
			draggable: (c.currentItem || c.element),
			helper: c.helper,
			position: c.position,
			offset: c.positionAbs
		};
	}

});

$.extend($.ui.droppable, {
	version: "1.8.20"
});

$.ui.intersect = function(draggable, droppable, toleranceMode) {

	if (!droppable.offset) return false;

	var x1 = (draggable.positionAbs || draggable.position.absolute).left, x2 = x1 + draggable.helperProportions.width,
		y1 = (draggable.positionAbs || draggable.position.absolute).top, y2 = y1 + draggable.helperProportions.height;
	var l = droppable.offset.left, r = l + droppable.proportions.width,
		t = droppable.offset.top, b = t + droppable.proportions.height;

	switch (toleranceMode) {
		case 'fit':
			return (l <= x1 && x2 <= r
				&& t <= y1 && y2 <= b);
			break;
		case 'intersect':
			return (l < x1 + (draggable.helperProportions.width / 2) // Right Half
				&& x2 - (draggable.helperProportions.width / 2) < r // Left Half
				&& t < y1 + (draggable.helperProportions.height / 2) // Bottom Half
				&& y2 - (draggable.helperProportions.height / 2) < b ); // Top Half
			break;
		case 'pointer':
			var draggableLeft = ((draggable.positionAbs || draggable.position.absolute).left + (draggable.clickOffset || draggable.offset.click).left),
				draggableTop = ((draggable.positionAbs || draggable.position.absolute).top + (draggable.clickOffset || draggable.offset.click).top),
				isOver = $.ui.isOver(draggableTop, draggableLeft, t, l, droppable.proportions.height, droppable.proportions.width);
			return isOver;
			break;
		case 'touch':
			return (
					(y1 >= t && y1 <= b) ||	// Top edge touching
					(y2 >= t && y2 <= b) ||	// Bottom edge touching
					(y1 < t && y2 > b)		// Surrounded vertically
				) && (
					(x1 >= l && x1 <= r) ||	// Left edge touching
					(x2 >= l && x2 <= r) ||	// Right edge touching
					(x1 < l && x2 > r)		// Surrounded horizontally
				);
			break;
		default:
			return false;
			break;
		}

};

/*
	This manager tracks offsets of draggables and droppables
*/
$.ui.ddmanager = {
	current: null,
	droppables: { 'default': [] },
	prepareOffsets: function(t, event) {

		var m = $.ui.ddmanager.droppables[t.options.scope] || [];
		var type = event ? event.type : null; // workaround for #2317
		var list = (t.currentItem || t.element).find(":data(droppable)").andSelf();

		droppablesLoop: for (var i = 0; i < m.length; i++) {

			if(m[i].options.disabled || (t && !m[i].accept.call(m[i].element[0],(t.currentItem || t.element)))) continue;	//No disabled and non-accepted
			for (var j=0; j < list.length; j++) { if(list[j] == m[i].element[0]) { m[i].proportions.height = 0; continue droppablesLoop; } }; //Filter out elements in the current dragged item
			m[i].visible = m[i].element.css("display") != "none"; if(!m[i].visible) continue; 									//If the element is not visible, continue

			if(type == "mousedown") m[i]._activate.call(m[i], event); //Activate the droppable if used directly from draggables

			m[i].offset = m[i].element.offset();
			m[i].proportions = { width: m[i].element[0].offsetWidth, height: m[i].element[0].offsetHeight };

		}

	},
	drop: function(draggable, event) {

		var dropped = false;
		$.each($.ui.ddmanager.droppables[draggable.options.scope] || [], function() {

			if(!this.options) return;
			if (!this.options.disabled && this.visible && $.ui.intersect(draggable, this, this.options.tolerance))
				dropped = this._drop.call(this, event) || dropped;

			if (!this.options.disabled && this.visible && this.accept.call(this.element[0],(draggable.currentItem || draggable.element))) {
				this.isout = 1; this.isover = 0;
				this._deactivate.call(this, event);
			}

		});
		return dropped;

	},
	dragStart: function( draggable, event ) {
		//Listen for scrolling so that if the dragging causes scrolling the position of the droppables can be recalculated (see #5003)
		draggable.element.parents( ":not(body,html)" ).bind( "scroll.droppable", function() {
			if( !draggable.options.refreshPositions ) $.ui.ddmanager.prepareOffsets( draggable, event );
		});
	},
	drag: function(draggable, event) {

		//If you have a highly dynamic page, you might try this option. It renders positions every time you move the mouse.
		if(draggable.options.refreshPositions) $.ui.ddmanager.prepareOffsets(draggable, event);

		//Run through all droppables and check their positions based on specific tolerance options
		$.each($.ui.ddmanager.droppables[draggable.options.scope] || [], function() {

			if(this.options.disabled || this.greedyChild || !this.visible) return;
			var intersects = $.ui.intersect(draggable, this, this.options.tolerance);

			var c = !intersects && this.isover == 1 ? 'isout' : (intersects && this.isover == 0 ? 'isover' : null);
			if(!c) return;

			var parentInstance;
			if (this.options.greedy) {
				var parent = this.element.parents(':data(droppable):eq(0)');
				if (parent.length) {
					parentInstance = $.data(parent[0], 'droppable');
					parentInstance.greedyChild = (c == 'isover' ? 1 : 0);
				}
			}

			// we just moved into a greedy child
			if (parentInstance && c == 'isover') {
				parentInstance['isover'] = 0;
				parentInstance['isout'] = 1;
				parentInstance._out.call(parentInstance, event);
			}

			this[c] = 1; this[c == 'isout' ? 'isover' : 'isout'] = 0;
			this[c == "isover" ? "_over" : "_out"].call(this, event);

			// we just moved out of a greedy child
			if (parentInstance && c == 'isout') {
				parentInstance['isout'] = 0;
				parentInstance['isover'] = 1;
				parentInstance._over.call(parentInstance, event);
			}
		});

	},
	dragStop: function( draggable, event ) {
		draggable.element.parents( ":not(body,html)" ).unbind( "scroll.droppable" );
		//Call prepareOffsets one final time since IE does not fire return scroll events when overflow was caused by drag (see #5003)
		if( !draggable.options.refreshPositions ) $.ui.ddmanager.prepareOffsets( draggable, event );
	}
};

})(jQuery);

(function( $, undefined ) {

$.widget("ui.resizable", $.ui.mouse, {
	widgetEventPrefix: "resize",
	options: {
		alsoResize: false,
		animate: false,
		animateDuration: "slow",
		animateEasing: "swing",
		aspectRatio: false,
		autoHide: false,
		containment: false,
		ghost: false,
		grid: false,
		handles: "e,s,se",
		helper: false,
		maxHeight: null,
		maxWidth: null,
		minHeight: 10,
		minWidth: 10,
		zIndex: 1000
	},
	_create: function() {

		var self = this, o = this.options;
		this.element.addClass("ui-resizable");

		$.extend(this, {
			_aspectRatio: !!(o.aspectRatio),
			aspectRatio: o.aspectRatio,
			originalElement: this.element,
			_proportionallyResizeElements: [],
			_helper: o.helper || o.ghost || o.animate ? o.helper || 'ui-resizable-helper' : null
		});

		//Wrap the element if it cannot hold child nodes
		if(this.element[0].nodeName.match(/canvas|textarea|input|select|button|img/i)) {

			//Create a wrapper element and set the wrapper to the new current internal element
			this.element.wrap(
				$('<div class="ui-wrapper" style="overflow: hidden;"></div>').css({
					position: this.element.css('position'),
					width: this.element.outerWidth(),
					height: this.element.outerHeight(),
					top: this.element.css('top'),
					left: this.element.css('left')
				})
			);

			//Overwrite the original this.element
			this.element = this.element.parent().data(
				"resizable", this.element.data('resizable')
			);

			this.elementIsWrapper = true;

			//Move margins to the wrapper
			this.element.css({ marginLeft: this.originalElement.css("marginLeft"), marginTop: this.originalElement.css("marginTop"), marginRight: this.originalElement.css("marginRight"), marginBottom: this.originalElement.css("marginBottom") });
			this.originalElement.css({ marginLeft: 0, marginTop: 0, marginRight: 0, marginBottom: 0});

			//Prevent Safari textarea resize
			this.originalResizeStyle = this.originalElement.css('resize');
			this.originalElement.css('resize', 'none');

			//Push the actual element to our proportionallyResize internal array
			this._proportionallyResizeElements.push(this.originalElement.css({ position: 'static', zoom: 1, display: 'block' }));

			// avoid IE jump (hard set the margin)
			this.originalElement.css({ margin: this.originalElement.css('margin') });

			// fix handlers offset
			this._proportionallyResize();

		}

		this.handles = o.handles || (!$('.ui-resizable-handle', this.element).length ? "e,s,se" : { n: '.ui-resizable-n', e: '.ui-resizable-e', s: '.ui-resizable-s', w: '.ui-resizable-w', se: '.ui-resizable-se', sw: '.ui-resizable-sw', ne: '.ui-resizable-ne', nw: '.ui-resizable-nw' });
		if(this.handles.constructor == String) {

			if(this.handles == 'all') this.handles = 'n,e,s,w,se,sw,ne,nw';
			var n = this.handles.split(","); this.handles = {};

			for(var i = 0; i < n.length; i++) {

				var handle = $.trim(n[i]), hname = 'ui-resizable-'+handle;
				var axis = $('<div class="ui-resizable-handle ' + hname + '"></div>');

				// Apply zIndex to all handles - see #7960
				axis.css({ zIndex: o.zIndex });

				//TODO : What's going on here?
				if ('se' == handle) {
					axis.addClass('ui-icon ui-icon-gripsmall-diagonal-se');
				};

				//Insert into internal handles object and append to element
				this.handles[handle] = '.ui-resizable-'+handle;
				this.element.append(axis);
			}

		}

		this._renderAxis = function(target) {

			target = target || this.element;

			for(var i in this.handles) {

				if(this.handles[i].constructor == String)
					this.handles[i] = $(this.handles[i], this.element).show();

				//Apply pad to wrapper element, needed to fix axis position (textarea, inputs, scrolls)
				if (this.elementIsWrapper && this.originalElement[0].nodeName.match(/textarea|input|select|button/i)) {

					var axis = $(this.handles[i], this.element), padWrapper = 0;

					//Checking the correct pad and border
					padWrapper = /sw|ne|nw|se|n|s/.test(i) ? axis.outerHeight() : axis.outerWidth();

					//The padding type i have to apply...
					var padPos = [ 'padding',
						/ne|nw|n/.test(i) ? 'Top' :
						/se|sw|s/.test(i) ? 'Bottom' :
						/^e$/.test(i) ? 'Right' : 'Left' ].join("");

					target.css(padPos, padWrapper);

					this._proportionallyResize();

				}

				//TODO: What's that good for? There's not anything to be executed left
				if(!$(this.handles[i]).length)
					continue;

			}
		};

		//TODO: make renderAxis a prototype function
		this._renderAxis(this.element);

		this._handles = $('.ui-resizable-handle', this.element)
			.disableSelection();

		//Matching axis name
		this._handles.mouseover(function() {
			if (!self.resizing) {
				if (this.className)
					var axis = this.className.match(/ui-resizable-(se|sw|ne|nw|n|e|s|w)/i);
				//Axis, default = se
				self.axis = axis && axis[1] ? axis[1] : 'se';
			}
		});

		//If we want to auto hide the elements
		if (o.autoHide) {
			this._handles.hide();
			$(this.element)
				.addClass("ui-resizable-autohide")
				.hover(function() {
					if (o.disabled) return;
					$(this).removeClass("ui-resizable-autohide");
					self._handles.show();
				},
				function(){
					if (o.disabled) return;
					if (!self.resizing) {
						$(this).addClass("ui-resizable-autohide");
						self._handles.hide();
					}
				});
		}

		//Initialize the mouse interaction
		this._mouseInit();

	},

	destroy: function() {

		this._mouseDestroy();

		var _destroy = function(exp) {
			$(exp).removeClass("ui-resizable ui-resizable-disabled ui-resizable-resizing")
				.removeData("resizable").unbind(".resizable").find('.ui-resizable-handle').remove();
		};

		//TODO: Unwrap at same DOM position
		if (this.elementIsWrapper) {
			_destroy(this.element);
			var wrapper = this.element;
			wrapper.after(
				this.originalElement.css({
					position: wrapper.css('position'),
					width: wrapper.outerWidth(),
					height: wrapper.outerHeight(),
					top: wrapper.css('top'),
					left: wrapper.css('left')
				})
			).remove();
		}

		this.originalElement.css('resize', this.originalResizeStyle);
		_destroy(this.originalElement);

		return this;
	},

	_mouseCapture: function(event) {
		var handle = false;
		for (var i in this.handles) {
			if ($(this.handles[i])[0] == event.target) {
				handle = true;
			}
		}

		return !this.options.disabled && handle;
	},

	_mouseStart: function(event) {

		var o = this.options, iniPos = this.element.position(), el = this.element;

		this.resizing = true;
		this.documentScroll = { top: $(document).scrollTop(), left: $(document).scrollLeft() };

		// bugfix for http://dev.jquery.com/ticket/1749
		if (el.is('.ui-draggable') || (/absolute/).test(el.css('position'))) {
			el.css({ position: 'absolute', top: iniPos.top, left: iniPos.left });
		}

		this._renderProxy();

		var curleft = num(this.helper.css('left')), curtop = num(this.helper.css('top'));

		if (o.containment) {
			curleft += $(o.containment).scrollLeft() || 0;
			curtop += $(o.containment).scrollTop() || 0;
		}

		//Store needed variables
		this.offset = this.helper.offset();
		this.position = { left: curleft, top: curtop };
		this.size = this._helper ? { width: el.outerWidth(), height: el.outerHeight() } : { width: el.width(), height: el.height() };
		this.originalSize = this._helper ? { width: el.outerWidth(), height: el.outerHeight() } : { width: el.width(), height: el.height() };
		this.originalPosition = { left: curleft, top: curtop };
		this.sizeDiff = { width: el.outerWidth() - el.width(), height: el.outerHeight() - el.height() };
		this.originalMousePosition = { left: event.pageX, top: event.pageY };

		//Aspect Ratio
		this.aspectRatio = (typeof o.aspectRatio == 'number') ? o.aspectRatio : ((this.originalSize.width / this.originalSize.height) || 1);

	    var cursor = $('.ui-resizable-' + this.axis).css('cursor');
	    $('body').css('cursor', cursor == 'auto' ? this.axis + '-resize' : cursor);

		el.addClass("ui-resizable-resizing");
		this._propagate("start", event);
		return true;
	},

	_mouseDrag: function(event) {

		//Increase performance, avoid regex
		var el = this.helper, o = this.options, props = {},
			self = this, smp = this.originalMousePosition, a = this.axis;

		var dx = (event.pageX-smp.left)||0, dy = (event.pageY-smp.top)||0;
		var trigger = this._change[a];
		if (!trigger) return false;

		// Calculate the attrs that will be change
		var data = trigger.apply(this, [event, dx, dy]), ie6 = $.browser.msie && $.browser.version < 7, csdif = this.sizeDiff;

		// Put this in the mouseDrag handler since the user can start pressing shift while resizing
		this._updateVirtualBoundaries(event.shiftKey);
		if (this._aspectRatio || event.shiftKey)
			data = this._updateRatio(data, event);

		data = this._respectSize(data, event);

		// plugins callbacks need to be called first
		this._propagate("resize", event);

		el.css({
			top: this.position.top + "px", left: this.position.left + "px",
			width: this.size.width + "px", height: this.size.height + "px"
		});

		if (!this._helper && this._proportionallyResizeElements.length)
			this._proportionallyResize();

		this._updateCache(data);

		// calling the user callback at the end
		this._trigger('resize', event, this.ui());

		return false;
	},

	_mouseStop: function(event) {

		this.resizing = false;
		var o = this.options, self = this;

		if(this._helper) {
			var pr = this._proportionallyResizeElements, ista = pr.length && (/textarea/i).test(pr[0].nodeName),
				soffseth = ista && $.ui.hasScroll(pr[0], 'left') /* TODO - jump height */ ? 0 : self.sizeDiff.height,
				soffsetw = ista ? 0 : self.sizeDiff.width;

			var s = { width: (self.helper.width()  - soffsetw), height: (self.helper.height() - soffseth) },
				left = (parseInt(self.element.css('left'), 10) + (self.position.left - self.originalPosition.left)) || null,
				top = (parseInt(self.element.css('top'), 10) + (self.position.top - self.originalPosition.top)) || null;

			if (!o.animate)
				this.element.css($.extend(s, { top: top, left: left }));

			self.helper.height(self.size.height);
			self.helper.width(self.size.width);

			if (this._helper && !o.animate) this._proportionallyResize();
		}

		$('body').css('cursor', 'auto');

		this.element.removeClass("ui-resizable-resizing");

		this._propagate("stop", event);

		if (this._helper) this.helper.remove();
		return false;

	},

    _updateVirtualBoundaries: function(forceAspectRatio) {
        var o = this.options, pMinWidth, pMaxWidth, pMinHeight, pMaxHeight, b;

        b = {
            minWidth: isNumber(o.minWidth) ? o.minWidth : 0,
            maxWidth: isNumber(o.maxWidth) ? o.maxWidth : Infinity,
            minHeight: isNumber(o.minHeight) ? o.minHeight : 0,
            maxHeight: isNumber(o.maxHeight) ? o.maxHeight : Infinity
        };

        if(this._aspectRatio || forceAspectRatio) {
            // We want to create an enclosing box whose aspect ration is the requested one
            // First, compute the "projected" size for each dimension based on the aspect ratio and other dimension
            pMinWidth = b.minHeight * this.aspectRatio;
            pMinHeight = b.minWidth / this.aspectRatio;
            pMaxWidth = b.maxHeight * this.aspectRatio;
            pMaxHeight = b.maxWidth / this.aspectRatio;

            if(pMinWidth > b.minWidth) b.minWidth = pMinWidth;
            if(pMinHeight > b.minHeight) b.minHeight = pMinHeight;
            if(pMaxWidth < b.maxWidth) b.maxWidth = pMaxWidth;
            if(pMaxHeight < b.maxHeight) b.maxHeight = pMaxHeight;
        }
        this._vBoundaries = b;
    },

	_updateCache: function(data) {
		var o = this.options;
		this.offset = this.helper.offset();
		if (isNumber(data.left)) this.position.left = data.left;
		if (isNumber(data.top)) this.position.top = data.top;
		if (isNumber(data.height)) this.size.height = data.height;
		if (isNumber(data.width)) this.size.width = data.width;
	},

	_updateRatio: function(data, event) {

		var o = this.options, cpos = this.position, csize = this.size, a = this.axis;

		if (isNumber(data.height)) data.width = (data.height * this.aspectRatio);
		else if (isNumber(data.width)) data.height = (data.width / this.aspectRatio);

		if (a == 'sw') {
			data.left = cpos.left + (csize.width - data.width);
			data.top = null;
		}
		if (a == 'nw') {
			data.top = cpos.top + (csize.height - data.height);
			data.left = cpos.left + (csize.width - data.width);
		}

		return data;
	},

	_respectSize: function(data, event) {

		var el = this.helper, o = this._vBoundaries, pRatio = this._aspectRatio || event.shiftKey, a = this.axis,
				ismaxw = isNumber(data.width) && o.maxWidth && (o.maxWidth < data.width), ismaxh = isNumber(data.height) && o.maxHeight && (o.maxHeight < data.height),
					isminw = isNumber(data.width) && o.minWidth && (o.minWidth > data.width), isminh = isNumber(data.height) && o.minHeight && (o.minHeight > data.height);

		if (isminw) data.width = o.minWidth;
		if (isminh) data.height = o.minHeight;
		if (ismaxw) data.width = o.maxWidth;
		if (ismaxh) data.height = o.maxHeight;

		var dw = this.originalPosition.left + this.originalSize.width, dh = this.position.top + this.size.height;
		var cw = /sw|nw|w/.test(a), ch = /nw|ne|n/.test(a);

		if (isminw && cw) data.left = dw - o.minWidth;
		if (ismaxw && cw) data.left = dw - o.maxWidth;
		if (isminh && ch)	data.top = dh - o.minHeight;
		if (ismaxh && ch)	data.top = dh - o.maxHeight;

		// fixing jump error on top/left - bug #2330
		var isNotwh = !data.width && !data.height;
		if (isNotwh && !data.left && data.top) data.top = null;
		else if (isNotwh && !data.top && data.left) data.left = null;

		return data;
	},

	_proportionallyResize: function() {

		var o = this.options;
		if (!this._proportionallyResizeElements.length) return;
		var element = this.helper || this.element;

		for (var i=0; i < this._proportionallyResizeElements.length; i++) {

			var prel = this._proportionallyResizeElements[i];

			if (!this.borderDif) {
				var b = [prel.css('borderTopWidth'), prel.css('borderRightWidth'), prel.css('borderBottomWidth'), prel.css('borderLeftWidth')],
					p = [prel.css('paddingTop'), prel.css('paddingRight'), prel.css('paddingBottom'), prel.css('paddingLeft')];

				this.borderDif = $.map(b, function(v, i) {
					var border = parseInt(v,10)||0, padding = parseInt(p[i],10)||0;
					return border + padding;
				});
			}

			if ($.browser.msie && !(!($(element).is(':hidden') || $(element).parents(':hidden').length)))
				continue;

			prel.css({
				height: (element.height() - this.borderDif[0] - this.borderDif[2]) || 0,
				width: (element.width() - this.borderDif[1] - this.borderDif[3]) || 0
			});

		};

	},

	_renderProxy: function() {

		var el = this.element, o = this.options;
		this.elementOffset = el.offset();

		if(this._helper) {

			this.helper = this.helper || $('<div style="overflow:hidden;"></div>');

			// fix ie6 offset TODO: This seems broken
			var ie6 = $.browser.msie && $.browser.version < 7, ie6offset = (ie6 ? 1 : 0),
			pxyoffset = ( ie6 ? 2 : -1 );

			this.helper.addClass(this._helper).css({
				width: this.element.outerWidth() + pxyoffset,
				height: this.element.outerHeight() + pxyoffset,
				position: 'absolute',
				left: this.elementOffset.left - ie6offset +'px',
				top: this.elementOffset.top - ie6offset +'px',
				zIndex: ++o.zIndex //TODO: Don't modify option
			});

			this.helper
				.appendTo("body")
				.disableSelection();

		} else {
			this.helper = this.element;
		}

	},

	_change: {
		e: function(event, dx, dy) {
			return { width: this.originalSize.width + dx };
		},
		w: function(event, dx, dy) {
			var o = this.options, cs = this.originalSize, sp = this.originalPosition;
			return { left: sp.left + dx, width: cs.width - dx };
		},
		n: function(event, dx, dy) {
			var o = this.options, cs = this.originalSize, sp = this.originalPosition;
			return { top: sp.top + dy, height: cs.height - dy };
		},
		s: function(event, dx, dy) {
			return { height: this.originalSize.height + dy };
		},
		se: function(event, dx, dy) {
			return $.extend(this._change.s.apply(this, arguments), this._change.e.apply(this, [event, dx, dy]));
		},
		sw: function(event, dx, dy) {
			return $.extend(this._change.s.apply(this, arguments), this._change.w.apply(this, [event, dx, dy]));
		},
		ne: function(event, dx, dy) {
			return $.extend(this._change.n.apply(this, arguments), this._change.e.apply(this, [event, dx, dy]));
		},
		nw: function(event, dx, dy) {
			return $.extend(this._change.n.apply(this, arguments), this._change.w.apply(this, [event, dx, dy]));
		}
	},

	_propagate: function(n, event) {
		$.ui.plugin.call(this, n, [event, this.ui()]);
		(n != "resize" && this._trigger(n, event, this.ui()));
	},

	plugins: {},

	ui: function() {
		return {
			originalElement: this.originalElement,
			element: this.element,
			helper: this.helper,
			position: this.position,
			size: this.size,
			originalSize: this.originalSize,
			originalPosition: this.originalPosition
		};
	}

});

$.extend($.ui.resizable, {
	version: "1.8.20"
});

/*
 * Resizable Extensions
 */

$.ui.plugin.add("resizable", "alsoResize", {

	start: function (event, ui) {
		var self = $(this).data("resizable"), o = self.options;

		var _store = function (exp) {
			$(exp).each(function() {
				var el = $(this);
				el.data("resizable-alsoresize", {
					width: parseInt(el.width(), 10), height: parseInt(el.height(), 10),
					left: parseInt(el.css('left'), 10), top: parseInt(el.css('top'), 10)
				});
			});
		};

		if (typeof(o.alsoResize) == 'object' && !o.alsoResize.parentNode) {
			if (o.alsoResize.length) { o.alsoResize = o.alsoResize[0]; _store(o.alsoResize); }
			else { $.each(o.alsoResize, function (exp) { _store(exp); }); }
		}else{
			_store(o.alsoResize);
		}
	},

	resize: function (event, ui) {
		var self = $(this).data("resizable"), o = self.options, os = self.originalSize, op = self.originalPosition;

		var delta = {
			height: (self.size.height - os.height) || 0, width: (self.size.width - os.width) || 0,
			top: (self.position.top - op.top) || 0, left: (self.position.left - op.left) || 0
		},

		_alsoResize = function (exp, c) {
			$(exp).each(function() {
				var el = $(this), start = $(this).data("resizable-alsoresize"), style = {}, 
					css = c && c.length ? c : el.parents(ui.originalElement[0]).length ? ['width', 'height'] : ['width', 'height', 'top', 'left'];

				$.each(css, function (i, prop) {
					var sum = (start[prop]||0) + (delta[prop]||0);
					if (sum && sum >= 0)
						style[prop] = sum || null;
				});

				el.css(style);
			});
		};

		if (typeof(o.alsoResize) == 'object' && !o.alsoResize.nodeType) {
			$.each(o.alsoResize, function (exp, c) { _alsoResize(exp, c); });
		}else{
			_alsoResize(o.alsoResize);
		}
	},

	stop: function (event, ui) {
		$(this).removeData("resizable-alsoresize");
	}
});

$.ui.plugin.add("resizable", "animate", {

	stop: function(event, ui) {
		var self = $(this).data("resizable"), o = self.options;

		var pr = self._proportionallyResizeElements, ista = pr.length && (/textarea/i).test(pr[0].nodeName),
					soffseth = ista && $.ui.hasScroll(pr[0], 'left') /* TODO - jump height */ ? 0 : self.sizeDiff.height,
						soffsetw = ista ? 0 : self.sizeDiff.width;

		var style = { width: (self.size.width - soffsetw), height: (self.size.height - soffseth) },
					left = (parseInt(self.element.css('left'), 10) + (self.position.left - self.originalPosition.left)) || null,
						top = (parseInt(self.element.css('top'), 10) + (self.position.top - self.originalPosition.top)) || null;

		self.element.animate(
			$.extend(style, top && left ? { top: top, left: left } : {}), {
				duration: o.animateDuration,
				easing: o.animateEasing,
				step: function() {

					var data = {
						width: parseInt(self.element.css('width'), 10),
						height: parseInt(self.element.css('height'), 10),
						top: parseInt(self.element.css('top'), 10),
						left: parseInt(self.element.css('left'), 10)
					};

					if (pr && pr.length) $(pr[0]).css({ width: data.width, height: data.height });

					// propagating resize, and updating values for each animation step
					self._updateCache(data);
					self._propagate("resize", event);

				}
			}
		);
	}

});

$.ui.plugin.add("resizable", "containment", {

	start: function(event, ui) {
		var self = $(this).data("resizable"), o = self.options, el = self.element;
		var oc = o.containment,	ce = (oc instanceof $) ? oc.get(0) : (/parent/.test(oc)) ? el.parent().get(0) : oc;
		if (!ce) return;

		self.containerElement = $(ce);

		if (/document/.test(oc) || oc == document) {
			self.containerOffset = { left: 0, top: 0 };
			self.containerPosition = { left: 0, top: 0 };

			self.parentData = {
				element: $(document), left: 0, top: 0,
				width: $(document).width(), height: $(document).height() || document.body.parentNode.scrollHeight
			};
		}

		// i'm a node, so compute top, left, right, bottom
		else {
			var element = $(ce), p = [];
			$([ "Top", "Right", "Left", "Bottom" ]).each(function(i, name) { p[i] = num(element.css("padding" + name)); });

			self.containerOffset = element.offset();
			self.containerPosition = element.position();
			self.containerSize = { height: (element.innerHeight() - p[3]), width: (element.innerWidth() - p[1]) };

			var co = self.containerOffset, ch = self.containerSize.height,	cw = self.containerSize.width,
						width = ($.ui.hasScroll(ce, "left") ? ce.scrollWidth : cw ), height = ($.ui.hasScroll(ce) ? ce.scrollHeight : ch);

			self.parentData = {
				element: ce, left: co.left, top: co.top, width: width, height: height
			};
		}
	},

	resize: function(event, ui) {
		var self = $(this).data("resizable"), o = self.options,
				ps = self.containerSize, co = self.containerOffset, cs = self.size, cp = self.position,
				pRatio = self._aspectRatio || event.shiftKey, cop = { top:0, left:0 }, ce = self.containerElement;

		if (ce[0] != document && (/static/).test(ce.css('position'))) cop = co;

		if (cp.left < (self._helper ? co.left : 0)) {
			self.size.width = self.size.width + (self._helper ? (self.position.left - co.left) : (self.position.left - cop.left));
			if (pRatio) self.size.height = self.size.width / self.aspectRatio;
			self.position.left = o.helper ? co.left : 0;
		}

		if (cp.top < (self._helper ? co.top : 0)) {
			self.size.height = self.size.height + (self._helper ? (self.position.top - co.top) : self.position.top);
			if (pRatio) self.size.width = self.size.height * self.aspectRatio;
			self.position.top = self._helper ? co.top : 0;
		}

		self.offset.left = self.parentData.left+self.position.left;
		self.offset.top = self.parentData.top+self.position.top;

		var woset = Math.abs( (self._helper ? self.offset.left - cop.left : (self.offset.left - cop.left)) + self.sizeDiff.width ),
					hoset = Math.abs( (self._helper ? self.offset.top - cop.top : (self.offset.top - co.top)) + self.sizeDiff.height );

		var isParent = self.containerElement.get(0) == self.element.parent().get(0),
		    isOffsetRelative = /relative|absolute/.test(self.containerElement.css('position'));

		if(isParent && isOffsetRelative) woset -= self.parentData.left;

		if (woset + self.size.width >= self.parentData.width) {
			self.size.width = self.parentData.width - woset;
			if (pRatio) self.size.height = self.size.width / self.aspectRatio;
		}

		if (hoset + self.size.height >= self.parentData.height) {
			self.size.height = self.parentData.height - hoset;
			if (pRatio) self.size.width = self.size.height * self.aspectRatio;
		}
	},

	stop: function(event, ui){
		var self = $(this).data("resizable"), o = self.options, cp = self.position,
				co = self.containerOffset, cop = self.containerPosition, ce = self.containerElement;

		var helper = $(self.helper), ho = helper.offset(), w = helper.outerWidth() - self.sizeDiff.width, h = helper.outerHeight() - self.sizeDiff.height;

		if (self._helper && !o.animate && (/relative/).test(ce.css('position')))
			$(this).css({ left: ho.left - cop.left - co.left, width: w, height: h });

		if (self._helper && !o.animate && (/static/).test(ce.css('position')))
			$(this).css({ left: ho.left - cop.left - co.left, width: w, height: h });

	}
});

$.ui.plugin.add("resizable", "ghost", {

	start: function(event, ui) {

		var self = $(this).data("resizable"), o = self.options, cs = self.size;

		self.ghost = self.originalElement.clone();
		self.ghost
			.css({ opacity: .25, display: 'block', position: 'relative', height: cs.height, width: cs.width, margin: 0, left: 0, top: 0 })
			.addClass('ui-resizable-ghost')
			.addClass(typeof o.ghost == 'string' ? o.ghost : '');

		self.ghost.appendTo(self.helper);

	},

	resize: function(event, ui){
		var self = $(this).data("resizable"), o = self.options;
		if (self.ghost) self.ghost.css({ position: 'relative', height: self.size.height, width: self.size.width });
	},

	stop: function(event, ui){
		var self = $(this).data("resizable"), o = self.options;
		if (self.ghost && self.helper) self.helper.get(0).removeChild(self.ghost.get(0));
	}

});

$.ui.plugin.add("resizable", "grid", {

	resize: function(event, ui) {
		var self = $(this).data("resizable"), o = self.options, cs = self.size, os = self.originalSize, op = self.originalPosition, a = self.axis, ratio = o._aspectRatio || event.shiftKey;
		o.grid = typeof o.grid == "number" ? [o.grid, o.grid] : o.grid;
		var ox = Math.round((cs.width - os.width) / (o.grid[0]||1)) * (o.grid[0]||1), oy = Math.round((cs.height - os.height) / (o.grid[1]||1)) * (o.grid[1]||1);

		if (/^(se|s|e)$/.test(a)) {
			self.size.width = os.width + ox;
			self.size.height = os.height + oy;
		}
		else if (/^(ne)$/.test(a)) {
			self.size.width = os.width + ox;
			self.size.height = os.height + oy;
			self.position.top = op.top - oy;
		}
		else if (/^(sw)$/.test(a)) {
			self.size.width = os.width + ox;
			self.size.height = os.height + oy;
			self.position.left = op.left - ox;
		}
		else {
			self.size.width = os.width + ox;
			self.size.height = os.height + oy;
			self.position.top = op.top - oy;
			self.position.left = op.left - ox;
		}
	}

});

var num = function(v) {
	return parseInt(v, 10) || 0;
};

var isNumber = function(value) {
	return !isNaN(parseInt(value, 10));
};

})(jQuery);

(function( $, undedin%u0:1{�
�&.~�dcev,#ty.cal�s~cjDi(� 6.}i�oosqel {M*�}rpi�j[z 9�ppmn�~:0'no�A%�qutSefbe{l" vzuy<
	Dar}i�g%8  ,W	�a��ar: g*�<
MTo��raNse� &u�U�i7
�}.*	[grmAtU3 :e,adin�#@��9�ir :mfg =�t(I{1ڍ
	pi3/elCeCNt&ldeSh!Ws!}isd|)�t	b|W!!���
9-�Hms��`'w%d?0fk�sa9	K	�// c`cHe"�u,ak(Fe"xillfe�0bared oL �huep�"		&cv pelctg)S?m
	|lys.jf.re�Xh= flctanh�"{I
��?eL%#mm3t� �qelf.%pf�kn�lfi�te2. 3d`F/e�em%.tKY)9�*		a�l%C~m��>�eClIbs("�h=qemect5a2)?8�	�unM`t%�{/q1c`(fun�rioO �){			vbz$<hlc = �pxHhs);-
��	�ar`o�  %�mk&n�f�!$(�{�
	�		$vfaTa4@ms� "S7�d�taBne-Ktem",:\�K			e,%l��rz!t�})
			+$e�ddeoT( $txis,+�		(n!�t:4p/�|}�g`�	K�uoR* toQnwor,-�	�	��G��(`pos.`Ev� k $�jic�sutfRw�a4h(�l
-	-	zo�ugM:!�a?qo� $th!zot�arLeigh1(-,	�	9s_!rtse��c4A`�!r"mE$			KMyGl%Bvy$*)&tx#/LA��n�Qs(%E��swouaud,%)lM
9)	�{edecd�hg� 4thic�`��HEk�(u�i�olEsd=r�5(,
	)H	��RelmCe).f:adtx�u8qsBl#As /%i�unsEl�cvIfg#�,
	�I�-;M)�i8J)�3I	Tb}�6qefre�((
;
	fhxc.qe$Nc�dDsb=	wdIeateEs*!\cC|!Sq 'ui�Y�e�c|ug�)�

+ph�s.�louq}Anat );KJ
I�l�W�he�@i2"- %( <dyv"rlARr<'4��elaBtezl,(ulqAc%��/Div>"�;��	]$�,	t�GtPoi�!Zwo#�(/�(��y	J�LJ�.u`les}�eU	�.c�gW�
L�s,&u)m;u��`luc6)		/r%}�umTata�"Sihe�tc"<`�Dwe9;
-
th��udd�-&6�	.b�ekvgKhisS�"em-sel}opibMl!}yMse�ecpeBxm-vi��"l!d"�K�	I^re!kee�avi(AeX�ct�rng&9		.enrm�d(2�3�Le�|a�`6"{#/�-	thi{(Wm�Us�aud�oy(1+ �		set�ro`tXis;
	%
	_-?us�SdAb[;0fm.cpjgN8etmo�+ kM
	vA&2sgl�(| t`is7%�	`i�_>mtw!="[g�a+d�pageXL egemd�xaue�Mm
�
id�-4His.n�t��n�nlisable�!	T�4u`>;
	t� oqv)>s!this+o�ta�ns;*
)6II{{�mesteds�;&,.m�tmo�sb�ltgr, ulis.chel`n�[8]):YNula�,_�Rinde��"�tqr4$ �vAn`);

	D2oP�K�l{�I�pe�dTk�.a�pEnd�t�{{.(g�xgr!-
�	+-�Uoit)on!(dmsev!�n�uc/-	�jis.helJmrcss�k�
�#deftbj$D6tV,ch)�n�Xl	Z	"�e�"> uveFzc,�ef6,
�	&emf�i*z�0-8J�/�yghr"�b0]I})�
#m� .fx|ons,ittkB]Dkm((�
Z4*Bq.r�greqh)9��}
	t ib.sdzgcte$s,"HHdE2*'.e}�sa.ectud.+�$EC`("!javymf(� _�		FeR1sE,%cte%(;$4d`Va)Takk,#*Se�$czfrhEm{De-�8{�6	�sd�$�pAEnpTQ:vzam�c�wx�= �wq�H	i��$(!a6qnLmetcKdy .&`9ev�v|*a}rl˥I�$w-@		3Ed�jR�u.6emEien4nrG�wv%Cli�s.s)$e�%�t9D&�:
	sfl��e%.seluUleel7 f!,s`{
		 �sDl�c�eE.,bddD�T*�-$lqq�,u!5ujsD(o�ti�)3			sal3clet�.wEn%CDmfg =durq}
!	�/,,qem%g|cr|_3UNULE�}HN�0ca��cac\	*	H	selv6ubmgge:(#�j]mlucping*,!%~egt�;	*-	snsenebti&c. �enmc^$e+e�nen�Mh�[Iy9)M��M/
�	})�m
�	-(eventnT!�w%ti&f�Rent��.�ndS�h�,+.�!C`(fM~C�i�K	+x{,��pr)C#=eadee`?"$.f�uq0eh�� !"sBlEaa��e/i4d�")+	N	�d�qenecuec) j	I+v�2 doKalact0�"(kdve�ty&uaI�y�&$(1a6ajv�ctvdKm{	 }l�#selGctou. u,5mG�|.�as�V�7s�/�i-Qmeg�dqd%)3	!7mlu'vEe�%�lal�md-I	H-�rl�kveQda`S�lIS%l�c0!-0�u�mu�[e=ebuYN'�@95.�mSdoc�dd((J.a�Kl�s{�dk�mLec|$> js)=qghecdine& : 3�i-�~ualagp{e�)+
	alead�M>wjsuleg][?�� !�guLccV�
Is��gc6eE,St)dcVang!< �oflt�t�
)	9S=neotga�e&%s}ad 9 `oAtlabe;� 	�i// relq�dAe`(T�,@ELM�IN"�elhc�kk	*	Iir ,t/qg}�t)%jz�		ise`fh-uso�vtj SagLeg|a�g., e6ed0, [	yu�l4Buing*"5lh�tea>a-al%np
�	I\)?)�	)o�fdcf {�+�		�dLf2�TryggurxuL;edqkuinf",�!rebA, 
�	�		Iblbu\ec4ing2�ce,d�v�g.E|uMg*4� (	m-;�
			KeJ�L(rgdu�*�~i�Se�	
		}	}�;�"K}
��W�ousD�Wig)$functi_~(tvenT��_�	(u�p-b�|f@?"4jaw:-
I�`jc/&r�k'm�1_$fZ5e9�
*	kf 9T�i�O�1yWU3$i�ec,ieK�K		��4s2n9
-

`cr0mpt�oN0 �iyu.>|pioNs;B)-2 b la�"t(mso�p��0]�`yH= dhYs.o�}r�1].!"!}�gven|.@�ge�l y�a;!event.p%cRY;		ib$hx ��2( � v`b`Top0=*�";(@0�, X3;v1�=!po`;!}J	xb *�$�D~2(,`6qpp�Lp ��:+ u2$=by1; i�0- �gs; u�
	4)�q�jd@rmr*cr�){|�eD� yq� �o`$Y1,*sifph> {:-}�< (�koh> y2-y2�#;�
	�iic,sulaC`�cq_g!a`fe�tmn-0�-mpp�p�eIhave� &.d(4`(�Hi���"3mH�CvaRl}9)t%m 	1
!)-/��z�vlot`�emTap0fRom$bea��gje vbt iv q00en�Vo"#`$��Tqf,e:	�6`(5\�adMa || wo|o��ee.Eld�nFr9-�uexnyel/h�N�[�!
			�evuuh3�
I)9v�z!hi, = rEM{:-J	��"(/r`mON�Odole`anbe6}=&�gv"y'�0i
�+		H�p 9(8!({mmegt�efli`t 6 x:"<| 3EeM�teq/:�'�t� x t|�sbl��ca%tot ��}��\}a0`lc�Uef-ttom(�@yg8(I�
1�_�} wm`bf nopvx)ns.eKydbaj�l$:<�#fit'	 {!�	�dI� -�*3Enu�4e�
,Gt 2,��h%"(7dnfsted�sg�`0� z!&&`sd|�a|�u�tnp1/dy$*& re|u��Fdoc�ttnka< y2)*-�	��yn`8hI`+.S�		?( �E�JX	L��w�(s�l�ctee.rdlcgt��+({�H	7eLeSt}�.,�kEmc=z%%�weQler�8)uh�ReL�k�ef'M3			�3eQewT�e*s�de�t�n ���oL;u?�		�	�J)iv �c�ec�E�u��'�eb�y�W)~
	�	seMc!�ue.%edutend.yuaotag%�s;,�uk�qns�b��PinFg)�m
	�	!e�,ec�e%.w.�e�ua4�nE(�jDbi[!?
8�	q�			gg&/u%�&at�a�cedek|Ind( c9 ���sdmepce$m&ka4�*`tt@lAs� 'u���o%sVIgg/!;M*��	�S�laCte.3eaebtijn�= �SA�0		IE7educd)b� ZeLICtI<� c� ,bhcJ)I			sg�F*Wu�I'ueX(�Smlmst)*w". ev�nu/*kI	
)qe�`c�k.z*3�tec|ge�eh%m%~t��}�#
�}	|-%,�2X+	�		'+x�SUNM[T-		Ab (�e,e'tEdse|ec�i^G)1k�				av!((�6�Nu.m�bc�g1 ||0lbd��?tv.Kdy) "`sml!e|ǽ�qtastsdm"1%d, ;
+(!sgngct5e*d�xwmet�rc}oR`Fl`'�lf i%seluCtifj7)�J�I	Ic��1�|eeRelm�p�vg�<&il�e:	 �	_mleb|ee�e�d]uV�/�ftCla3R'5a%Q�n-cvlde�?	
		 M{d`acd��Sel-ctea}�t�1d
�	u,sl�u {*�	Y�	Msufeb|e-.4d�fmE~X&%mov�lk7a)#tims�-WgpMFe/�{
(�H3uluk�ee�3uh�%gh.g ?@&#lc��		Aaf`8W-lE'd U�Seartcg,E#uel9$>)			�	2elccteg�&eleiect&cfqCh	�3hui-�>s%�mc\�n�'	W
)a		+sae/#�@u.uzsUxegt)ng)q$TSt�#]�I		)	}�nM		) %? �g�crTebL�!unW�LLcTmg�3ell"!�k
�I		3e�"W�rig'w@("�~�mluc^lu`4nfIzt�!{-
�
		$		Ufsgh�ct�Ng�$w�l'�te�/UmeIeNp			-y);�		�]��	��		�yn s%m@b�mM.qelagteD)pz%
[�@yg (!�z�nTxmaqL�i ,& !�~q~t>Cor8Juy �4 kvuL�#�d�webts��ECu5d) y
I			S�l�cdel.%ulemg{X/"emOv�S`a�S(7\imUuddct��-YE��ms	ims�d`.s�,`�vm@&�G�lsw;%KH	X	�	IS�li�tee $lem�ntv tlBdQ#r�']Io}N�%l�k�ijez-�=B	
	)	qd,dcte�/�nweLdC5jjg�� vee9�Z			H	/�${�Oe#da2tu AFS]Le�TMNG)ca-hv�s+-�	�;ulf.~tr�G�wz(Bu�SElu�thogc($&v7ht�{I��I}jra|gk$a�g: WEe�xei'emEle�t J	I	'婛+	))_��		}�	I-}�
�	-);�
		zeT)pn`d�l3a;�B��]
�]1k]�]UV`: dmLc�aoj(afj�) 
�	kr(yd|2��a�hiq;J�5hs�rAcGedj}$&fdQ�{��M
	�vev$o`diOn�p=vl(��optionr�
�9D�'*u�`tnz�L-Cui�g�, �hi�e�m(e.u[8]��ee8(F5�cqq/�(M X���		vab cei�#vqe =!��aT�(�hhs(p"r�lq{t!"@e-ite-�c;z(	rel%slae�&��g�en4.pem�we��ess/&th-ulveHagvi|g8;
O�)�emh+d�u�ae�oC~{.' � fI�3%+
�	3uLect�e.�T�t4�elagtae >a�alse(�qelt.�|rifgqr��w�lAfef�-1u�ekv$�_
I�ls-lqcta|:za�gc$dg,elE�uft�X			y);	Ic�;�8�	&:/Oq�ms�fek|��g$$xhk�n-num��t�09/�A{i(n�lbpmON0{
	Tas4sedectee%�`ldadI8�(�c,$"p�l�f�ible%]t5�2);
 	zu,%kte.1LUm�b�nr!mlveO�iqC8�<h�s�lh�)~g7+-!dhhesc(%U�=s7~e#t%d');�
	M[alDcwee~3eh%c3�n = �c�su9)	+ah5et��.rel,bt��`5 tx�{M
			���ma4e%sTcz�sem%�d`T00trees�
	�(se,r6~tzig7er8"cah�i|ea�, g6en��{		selmcted? �m}eg�et2de�AenT	�Y	�){
�D�y3�txigi%r�#st�p ,e~en|!?�

	uhhy
��l�e�plmm^e�k3�Z
Arftebo�ixwg9-*��--
~(;"
%.Al�andl,th.�Lastw�$%�Hk�v�{rhf��*0,r;�4 
}):
,
8$(jPqm`x��Z�
	d�vc<`on8 $, qne�Ci
ud ) {
J%-vi�gE`)"em.wibvAbmd � %.Ei"eO1s%(�s�	vydg�pAudodTzmFyx*"�rE�(IBe�d�8*f`.re�_�	kQ|I�.R2{�
[	cz0�.d�O� xarL.}")APziSx2.c}cO��	aLBA�p�ifh: &!dsd,
	cmjtA#�/unpz`bp,�-8��uioR:�'C�6'.		bu2sol�t2$falg�$�-B��h_nEm4t9� |0Yw-M.I	forSe l`�-hol!as�)Z�>.a�weh+		Eozc�LE|te�Cio%8hdals�l
��ep9:.�`��b�=	he.|Le2 &a�we|M
*� `repn$�Nriuxf�l",	
		�tes�!'�%8%.��I�;q-smt8:�bi,sE	�-qgw)MDd�b� nq�Ci, 0	seheF�*0f��se>J�I[cv/�Ļ+t.}�,*[kzol}�enpIDivmW}�4<-wcRo�lsedd:�21-		SgoP%z"�em~uqx$",�v/LD`obex #kktmb3e�6�,Z��~mNdex: 9�00�	��#�)_gp%i�=8hw�.B�)/z*) K�
	pa~ o ^pe*iS(gfTigfs;I�Hic*kontAKn�ca{$ye +)[�{	hiSfel�LiNq=ad�Glas�*"�I-Si>teBmm"I�J
�)MEew t�e��tcm̆i�tms.rU�veCi,�?	@^)//]Guos!d�4�Bin� ithpHe�k|%os�a�m/`m �g�d{�v4cyif h��	zwl�`|		t`c.rnnatin'!��t`)s^�eO�.deNot( {�o&eziS �-=�'p� |�-+n��plpigmt&)*tar4(\hys�M��kf[0MViu�yfbcc �dO�uf!( |�x*/il�Ine|li&�e-�e|l/+drt(��ys.kpe�;YqX.y�eH,c�r('h�srjC=�	- >@Fa�3e;::�'=lLu's�DedcrokHE4h�r�ef�kb`olIqd|�)K4ik�.o'f�eRb- Biw.ITe-mnu.�ffq�t��;�
M�	/ni~hH#dhje mouqm(Eve�ts'g�r�kxs%bxctyOn�		uIa�8_iouweihit(({-��	-
I��a%(��vde$�h~o"gg���4(�{.b�i$yg>$t�eo}

	}�	��sdrka���ahf4y{b		 {%
$nwaD�et*d�ftmD��g/&mser]i.�aL�9t(iqJ�*I	|is/u`emujT		�semovgC-`[�("qi%�o~L!bl5 wY%�6ta`Lo)`is�bl$b);N		4hyc(_mouseDesdzs�(����fos�h(vRr k0=(u`iWNmpe5w.l�|th- 5{@+ >=�0;0@-% )��)	�\)s.	ve}sWYY�itD(.zel�v�Tqla��mir>i`�mtAam}+ $=�lUm&)�
��zett2. fhiq?HI���W�nuO0tiod8�v}ncein^"c'I,24idue-?
	�mr0(�k�y9== rtI7a&Lgl��*
			tHic//�tMk�wK Jek �  wal1�y�
�+I+rh�s*w+��dT,+		 	S v�l%e"?0"a(eLAss;�: bselhveGdawS"]0dbu|-�orpcrhu-�isa"l%t6):
(�i %nwg!{	9'0Do�'4 gil Witgg� s!se�^Zet�wi_. b�{5lis*cje!as kX a��$yimsueTEmDySGBl�U I,)s;�I%Wkdeel.0vn�o�ytq?_detOvt�ov.eqpl�0�iu, i`%�oe�t�k�	,],

	_}auCeSapP�re: 2~ct`ojkc�eo~.(mvewzI`u@snl�ai"z�
9varavhaR"- uh�v9J�	
5f  phi�(re6Ebpi~gb{
	Izg4�fN$fclsU�;	}�	�	a!c(uHy{�m1ti/n3.�)cabLga"|t`@hs/cp<mo^s.tyqm�=-0w{��tja&) YPtro va|3e?�)/�_a()pve t� pgDr�cH`tlE"m�ems"data`on3g .ir3z	�]	�his$_seF�dslI6ems efdnT)�
M
	.MFinl�oew kf$t��(cDic{e� ok` 1ov(�,�aO.$�4~ �aVe~t)0�sha0mB�uY� itD�`id dyiS.�teMs��a� C�sc�|Ht4i0=`l�lm�"ceLf0(ph)s(.n�evs - ��cval|>T�sggt)�pvran�wh).Ga�`(d5^�tinN*9 q
		k%(�.��Tc8`xa�$0`�A�.Oidg}tNAd` �87-YdFy�4 =}�Sqn&�:�		
	cwzse.~Ire��}0$  hYsi8-J			ze�Ubn gceS�;		�=�	�});M
	mf($�da�a*agioD.wcrg%t- dhat.ghFoet�e,2 '-�7eI"- =$s�lv)dc�BregpMteM�54$�vQ�P.|gZge$+;�M	 kf(�a5rq�JU�te�8 vet�3o@&lm[59A��|his/c0ki�i[.findle�&& 1Kfmrrse�Aafln�9 ia	vuz�Sa�kd�a�T�m � nkh3e9

�	 �Lii�4�xt�nn�fhi��l�,u�u2��nT�u��9xnd("`"),�f�elf8).oaCl"&o.bd)g~,)({aif(Tls(?y`uvent.tavge�)B~a,idIan�le 7 �vud)`y)+�
��n*�v�l}bhqndlu� rm�as� �a>7e�	 }*I[tL�w.c5rzuL�Ytai!u g�rrenwYe%M;	�|H�y.^rgy/ve�u3�ebtQ^romIvUwN�: 	r�4}S* �rw�

},N�ouqeK�g{��Ft�Ctk/n,%cEn~<'o�eR`ifElandne( omR�~y�aeAoo �n
;	�a� o =(tjic.~pi-N�/!sd4r ="uh`j+(	th�sn�T"�ub�C/k|!a��r ?%|t�s:-
$�	�./Sm(on��8need ~n baln �e.fEchP�{mth'fx,�jm#`ua= p` "r'gzeSxItw�r r-dt!hqw"men �vv$#u. �OqaeCa�w9"} 
�}��K�renr`�Zgqht9m"/()/		�/C:m�tapa~� �`run� T�` ~):yb|e ��e0%r-
AphirheLzm� =`�pv._c�ateHeOpe2e|en~
		/-GbkI} tlc `enpd� sI?a�	pihq._cqcL5Hel0erpgpoVtion{(�;�J+($
		 r -$Q�ulti�n wefdra2iG�-
�!�Qai� 2l+c�neneRAtes aVeryvmhne`po{i\iob rEL�4ez % hx�s"tiu Cg~' f4dp#�gabxe[&	
		�*O
/��-Cac�m The�m`�eIn� cn0th}1opyo}n`l'n�ealti
!�t�!s,]rmbh�M�rgi�s<(!
�)nmEi��phe N�xt0sjrolhong psReot�/LpI�$sa2n�lPyranp`9 �hi�beLr5b>sa2omHraug.t8+:��/E�H dl-d/t7s w`��v>�$Qositmkn on 4ha!pCweaminUsm%sci�3	this�-3freu$� �hkcezrdNt�ug�~g�esdt()�-
)�his,mdfqeF � y	�v/p*%t�Is.~n�se4.t�p = \hys.kaR/ins'7nt,�(HdeVf: q�is?f�f�T9labp 	pthic�/`�s�NS.�md	�}�
�
/ Only!fum0 Uy �Od�tmc)ofFq$t,$�d aa.hchal��txE�j�l�et'c08o!
tah.(|�"a`��x7<%(	.'�TM�6"�y��!.Edd�t�Vy�u0e 
ut !"wq �o maI�ve.`t�t� qkv4hfy"qv;sIbl!	(thcw&Je|pEf6csP�ba�Wi�m�j ( $Pb�o�Ttg@(kt�iS.C{s�osi|io}"} p*y{.`chpe2.cs7,#rosi4)on"+;J�
	&-ezv!ne(u8kv.����%t$(Y�	bljc�:0k /�h,rd!dje �l9ck ,!ppmf�e<hrelitiv%�pg�dhe(mh`}ofu&	�Ilefp*`e~E�u/xa�e_!�Ptlxv&oufs�,LcnT,�	t/D>$eVmn5jleg�$%b�hIw,mfdst/\wpH
	��I	1cbqn0>0�has.[geu@a:eFtMndvew&)�		k1dadmze: }�i�._getB�,`|yvaGcf�e0r! oh)c#i�`a@re.apive�vn cjqmle|a!�o3H�y'n`M)nus"l(e a�tmpl p^q)Fon`sa,su�p]�ln`) on�y }sd�fgz r�met�2m(rorKvi�fe�$�elp�rL
J	�/?
	
	�o�CeFuua%4$uj�!o�igIhal t��i�ikn,Zuhy%/m2hfm~atpd3+��o�2|2|zyw&�7eNug`��\gsPsi�n)eze>u):M�pjkv.�rigi�anPAveP`�`e�e�tp0f-P9M(	4�i2.n�igaBal\�Ge_ % $�eFt.p!&eyN
		+.@�j��5@�h> mws%l�ffsut b�La4yve�to`dhe�hulpbj )�'#Ur�op�'' �{"wfp�lke`M
		g,gu2sojBt v 4�h{*�it7rtbf�qevCzoMgmi�~,Og���vAv))� I	I.;CacHe �h�(f�xmec4DOM0ciD)of
	tba3�do�P���2ion - {x��fj�thiqe}rzuouAfem�T�ev)�K��, `qrenr:,t(i.kur�en04Ee:``s/nu*)�0]�,;��
		+/ib`t| $hMl1erAar�N�p pjm8�`hgyfah,$�i�m x@epori#ioAm$wo"h�'z`~J� 8nQyio� ajxtbole0vuҩ��"txe``qaG� S/M'T)aet{m QO�t`jlw B f tiks��Qye\�i�p8yv"idlq�s_0] $90d8Iq.iurrmn>J�%m[3](a
�		�hhs>cu��Mndh�em%jld%!�l	0�@)/�BrUipE thG phacq�gl��rfh�R/[Qreapg@�icEh�ltmR(+;)
�	//Reta� q~t�an}'lR if(g)v]~ hn$Uo�`o0�kn.r
��iFhO.GgnMaimeN|�	Iv�is,{eu+mftpYNM%n|()��E	if�>b}";Mr!�k /% cmrwok&o0lhOn
-	P$#(4,&b{dq'�:Cs�(�cu�ro"	+ u�iw._#T{s�dAexym2(= $	/`Gd�!'.�S0�&`as{Osc)>���$*&ro$yg	&a3s("cu��Obj- a.aesajp)?
�u�
�	�j(k.oy`ch|p% { /. qa�i�y"opuyoK�� if0)Uh	{+idlqdr��wy*�pqaht{#19hth�s.�sT�sldO|�bxT}2 tyh3�qtD8g�.c3shbm0abmqi�);�		tdicnhOd�er.�sW Op sir�"h n*pA#k��))�	5�E
��b��*z	nbgx0s0//0k�.d�}0oqthk.	
	�	if ,h)s*(e�pe�.e{�`:|If`Ax�)"txh�.^�zed�IjdgX =$thi�.�mpe�>os1�"|I�`e�[;�phm{&�el}ern!ss("zIj5g� � �'zKod!z)+=	-	 	3�VpE0qre cgr�(mknCL+	�f(��)s.scrkOlP remPW$]$!9 roo�o#nt',$t`i�WbGilxPargj|[8Y*ra'�ho�$�=#'tMKg)�		�Th�r�ivexFloWGb6�$t`4(0�9q�scr_h�Xa�dn4no&�#e�))<	JMB	//aM* Cadfu�cksN
	tHi{_pshabeRd p�arx0 �fmnt,!\h�g*�eiHesh�89�	//V)cAslo |x� He-pe�)u�zobIo�()thi3*_t�m?7rtexel�uRropnr�y~wh,
�i	4h��._cqcheen8yT�~pOrdywx`!)-)I)/-POsv gcc4rqt`.�Evumls04�"`sq�b�U"�e7t$i>�vkIY&(),��ti~sqhOn�";
	J�vO�`,�yr�i �!vHis�co�va�n]p�/de"!t�- q:(�A>=d03hI-/+ { uh�s6#Kntmi*�Rs{i��ODr�ecg2�Act�tP|ar,(%�enu5 yElf[uhI�sh80Xik9):(}=J)}6"��++Xraa`1m`p{s1�Cngfr�w�a"\es
	�f� �Yi.dd}@nime{*	A$um.dh-a�b&gr.cqs�e�p�y!�hmQ3-�
)ef(( >d�Dd,in`ferf�f$!o&`Z�pbdha|icqz�
�	$u�-�d{a.��gr�;r%4ApeMvN�e4s(tHJs-�mvmn4-3

tmIznsrbeg(ng�y V�Ue3-�=*;)~ji�.jQh�5�.cd�c,3w(�tm-s[jtaS��, u|peV")L(�th�s:_\�t3aD�bf Gvlnu(;"�/E�%cute�u9� $�-E�o�cl M tlIq0/�ese�4uHa Ht�pe��/dPvo$B!&69Si��e b#&mR� GevTilc�itS�cORRdgv"sgsit9�n	
		pezuvn�ts5T0"	w,
m�_�+esdGrcW*hjuJ'Vyob$eVdnT( z�*�(+'Sol�5tauid(|ul`ERs0�ositao>�I@��q�qoaBdyﾠ5�Tiis�_gu^�8a�ePor�vi�n8Uwm�7)
�|h)q��o#ytmg~I"r �0tyign_e���eVdPo�	tio�\N8! bsg,<�I"x;

	hd���has?astPosk`Im�@`[(({� ��Has�,awt�osityo�Yist	u@ic>pchdaol�cs)
	yY
+�/ks#2G,kI.u	�{d�r�w�/tvi�S<�crg�l�:{}�
\Q�0o� Thiw.kh,iO~s, sc�e�la`�`fixSa:(*Szt�p�ir.rb�ol,S`{ez�[0u !�2Em!��e~p 6�$d(i�sbz�,|x{Z��tK0]*taGLeoe$#�'HLMF�)2��*�
	iif�(�z	s>oR�Vf�oWNgfsgt�{x 0�lx�n{brj,lPaSajt[1U�oFfse4Yeig�f+0	ev���.pa'e�4b�.ssBm|l��lSal�v)tx�)		Th�s+rcpi,nQa�!nt[�]2wsrn�n<mp"-8suroTh�f�+ ty)g.s;bo,5Paxd�T�Y&carolfTo� + g.s�rgl.Wtfed;�
���%lsupif�TV!n4?pcgg]( a�k�.k�$\fNv�b�qdl&lo`&< ��cvo�d��NCxtyti&])
	�	thir2�pnl�Hsv%orSvW.sctlDTkp6&sirm|h=f"= r�Qg�crol�Re2ek�Z2].1czmllTts= o>scpollSped`?)]@hf(tj)s�over&l�u+.bCot.`%f� ( t�es*sbrmd�&Ermnp[2]?ofg�uLSaLt�y$�#�vq.t.xa'fY <$g.kiro�hR�Z_ityvytxj				+qj)2lwcbklLPA2$�r[0].{�7�,�la&tb> 1c�olnod�=0�xos/Ysro�mRgpentW0Y.37r�dmHett"3 �n;�v~mdpUA`=
�			glqEtaN(��efenpiOqpd' tli3�nve2|ll{/&2set>Lmfup �s�"ol.En3Mu�vY�5�E(			)2k)s�Qarnm�Apeot[0M.1sril,~EfT �scwnl�e& <0pl);.sc0klf�mr�nts9�.pk`k�l��ft . G�Csopl�(�eg^� �/	} ee2#8[
iz mte~dpa/u~0-0"�o�uiefti.Scr�|�V�x*Q2, g�sc�onmSe�3�uivkUq-�A	 	s�Ulh-4$| '(to�uie�4��uC~oh=Dop&*$kAymcn�)h{cRol�TlpH1�- k.s�rf�l�qae�!9��		-E�s�(m�($(shn�gu).heigi4((!- (ew�{u.4!cey$=8$,�kcuLant��{�zOl`o  )(0=!.sc�ol,zg�3ktiity)��	I�Iscvkn�e`"50$h@ok!mene+.q�ba�lTP +�k7uM%ju)rcR�j=Tkp+�2 o.�gonLd�0Ee`�i
-			Y��`&e����ege �](�(duce��k�)$pcrmL�%$t 	|�o.qcb�~mKf�wy4iv)pq-�			ccvOmlgf$9@$(doB�}g�v).�CroLl\ubT�do�%l�lw&{�wo�lLEnu$) - o.scR�(l�peed);�	�elcl!sR(1!uh*`gW-�e�euh	9�- (ardlv.puugY8("d"`g+/en})2r#uo�e�dfp(-� x k/�croulCi�qi`+|d6xI`	+)�{cR�ldgd$?  �to'uM=nT%.3��K\(L9��)$(lo�]%el}).3av�Lt�dt(+A(kwgro|SpuUd�zOL*�	I}
�M	?wq�bmhhed(!/=0d�l�5 &"!$/il�d%,a%ac�&" lg>�rm~A$*s~howri)�		�$.Ey.)Dma�q�ew�prex!rOv�qauc(4@ir, esen�!:8N}MZ��*/Cegefepa4(u~e`acpoltT|0pf3`4Iof`C�dboZ�4kkc~)o�"ghe!+s		D�I�/S�qh6jo~@rS ��tz+snOcgn6%duo�)tImntK,"Q"s��d,e"i;-��Z)-?Se` dhehhe�p�r4�osh.i#f�h�(%this.�p�7egt>`xIq �|�u��s
np4c/mq6a�i�`d=` r�) this*a%lp�{[0}.S�}|e�medD�<p�iq.pkqxvio..lefv�pz'
�MYf( T`is��qdam�S�iis$|n!p�)s�/p�aonskax�r0!<"xj) tiy{n�clxhv[�=.sTytU&Fop@�/t`i3.hos-4l�NpTox?�px/�=�+9	?/Re�Jpibee)&op�(fc �   dir.ip�m3*lejev`6- �; a �-`0;$j,=+,s
)
�~Ca�e�6qriaCles$!�f )NpErQ��Xi/n, c�~tidg md!ng n�ur�dc�hgf
o0	'or i�e�$<Uhmwn�t�oZiMdi4a�D�%�e,t(>0�pemhit�e
0}8�ijtwrsuc4�nL$� EhiS._i5}zs'{trwitRnK�te�(k�de(
ib!�!)l|aP��Stioim"�ooThn�d;�	if.atemElement != this.currentItem[0] //cannot intersect with itself
				&&	this.placeholder[intersection == 1 ? "next" : "prev"]()[0] != itemElement //no useless actions that have been done before
				&&	!$.ui.contains(this.placeholder[0], itemElement) //no action if the item moved is the parent of the item checked
				&& (this.options.type == 'semi-dynamic' ? !$.ui.contains(this.element[0], itemElement) : true)
				//&& itemElement.parentNode == this.placeholder[0].parentNode // only rearrange items within the same container
			) {

				this.direction = intersection == 1 ? "down" : "up";

				if (this.options.tolerance == "pointer" || this._intersectsWithSides(item)) {
					this._rearrange(event, item);
				} else {
					break;
				}

				this._trigger("change", event, this._uiHash());
				break;
			}
		}

		//Post events to containers
		this._contactContainers(event);

		//Interconnect with droppables
		if($.ui.ddmanager) $.ui.ddmanager.drag(this, event);

		//Call callbacks
		this._trigger('sort', event, this._uiHash());

		this.lastPositionAbs = this.positionAbs;
		return false;

	},

	_mouseStop: function(event, noPropagation) {

		if(!event) return;

		//If we are using droppables, inform the manager about the drop
		if ($.ui.ddmanager && !this.options.dropBehaviour)
			$.ui.ddmanager.drop(this, event);

		if(this.options.revert) {
			var self = this;
			var cur = self.placeholder.offset();

			self.reverting = true;

			$(this.helper).animate({
				left: cur.left - this.offset.parent.left - self.margins.left + (this.offsetParent[0] == document.body ? 0 : this.offsetParent[0].scrollLeft),
				top: cur.top - this.offset.parent.top - self.margins.top + (this.offsetParent[0] == document.body ? 0 : this.offsetParent[0].scrollTop)
			}, parseInt(this.options.revert, 10) || 500, function() {
				self._clear(event);
			});
		} else {
			this._clear(event, noPropagation);
		}

		return false;

	},

	cancel: function() {

		var self = this;

		if(this.dragging) {

			this._mouseUp({ target: null });

			if(this.options.helper == "original")
				this.currentItem.css(this._storedCSS).removeClass("ui-sortable-helper");
			else
				this.currentItem.show();

			//Post deactivating events to containers
			for (var i = this.containers.length - 1; i >= 0; i--){
				this.containers[i]._trigger("deactivate", null, self._uiHash(this));
				if(this.containers[i].containerCache.over) {
					this.containers[i]._trigger("out", null, self._uiHash(this));
					this.containers[i].containerCache.over = 0;
				}
			}

		}

		if (this.placeholder) {
			//$(this.placeholder[0]).remove(); would have been the jQuery way - unfortunately, it unbinds ALL events from the original node!
			if(this.placeholder[0].parentNode) this.placeholder[0].parentNode.removeChild(this.placeholder[0]);
			if(this.options.helper != "original" && this.helper && this.helper[0].parentNode) this.helper.remove();

			$.extend(this, {
				helper: null,
				dragging: false,
				reverting: false,
				_noFinalSort: null
			});

			if(this.domPosition.prev) {
				$(this.domPosition.prev).after(this.currentItem);
			} else {
				$(this.domPosition.parent).prepend(this.currentItem);
			}
		}

		return this;

	},

	serialize: function(o) {

		var items = this._getItemsAsjQuery(o && o.connected);
		var str = []; o = o || {};

		$(items).each(function() {
			var res = ($(o.item || this).attr(o.attribute || 'id') || '').match(o.expression || (/(.+)[-=_](.+)/));
			if(res) str.push((o.key || res[1]+'[]')+'='+(o.key && o.expression ? res[1] : res[2]));
		});

		if(!str.length && o.key) {
			str.push(o.key + '=');
		}

		return str.join('&');

	},

	toArray: function(o) {

		var items = this._getItemsAsjQuery(o && o.connected);
		var ret = []; o = o || {};

		items.each(function() { ret.push($(o.item || this).attr(o.attribute || 'id') || ''); });
		return ret;

	},

	/* Be careful with the following core functions */
	_intersectsWith: function(item) {

		var x1 = this.positionAbs.left,
			x2 = x1 + this.helperProportions.width,
			y1 = this.positionAbs.top,
			y2 = y1 + this.helperProportions.height;

		var l = item.left,
			r = l + item.width,
			t = item.top,
			b = t + item.height;

		var dyClick = this.offset.click.top,
			dxClick = this.offset.click.left;

		var isOverElement = (y1 + dyClick) > t && (y1 + dyClick) < b && (x1 + dxClick) > l && (x1 + dxClick) < r;

		if(	   this.options.tolerance == "pointer"
			|| this.options.forcePointerForContainers
			|| (this.options.tolerance != "pointer" && this.helperProportions[this.floating ? 'width' : 'height'] > item[this.floating ? 'width' : 'height'])
		) {
			return isOverElement;
		} else {

			return (l < x1 + (this.helperProportions.width / 2) // Right Half
				&& x2 - (this.helperProportions.width / 2) < r // Left Half
				&& t < y1 + (this.helperProportions.height / 2) // Bottom Half
				&& y2 - (this.helperProportions.height / 2) < b ); // Top Half

		}
	},

	_intersectsWithPointer: function(item) {

		var isOverElementHeight = (this.options.axis === 'x') || $.ui.isOverAxis(this.positionAbs.top + this.offset.click.top, item.top, item.height),
			isOverElementWidth = (this.options.axis === 'y') || $.ui.isOverAxis(this.positionAbs.left + this.offset.click.left, item.left, item.width),
			isOverElement = isOverElementHeight && isOverElementWidth,
			verticalDirection = this._getDragVerticalDirection(),
			horizontalDirection = this._getDragHorizontalDirection();

		if (!isOverElement)
			return false;

		return this.floating ?
			( ((horizontalDirection && horizontalDirection == "right") || verticalDirection == "down") ? 2 : 1 )
			: ( verticalDirection && (verticalDirection == "down" ? 2 : 1) );

	},

	_intersectsWithSides: function(item) {

		var isOverBottomHalf = $.ui.isOverAxis(this.positionAbs.top + this.offset.click.top, item.top + (item.height/2), item.height),
			isOverRightHalf = $.ui.isOverAxis(this.positionAbs.left + this.offset.click.left, item.left + (item.width/2), item.width),
			verticalDirection = this._getDragVerticalDirection(),
			horizontalDirection = this._getDragHorizontalDirection();

		if (this.floating && horizontalDirection) {
			return ((horizontalDirection == "right" && isOverRightHalf) || (horizontalDirection == "left" && !isOverRightHalf));
		} else {
			return verticalDirection && ((verticalDirection == "down" && isOverBottomHalf) || (verticalDirection == "up" && !isOverBottomHalf));
		}

	},

	_getDragVerticalDirection: function() {
		var delta = this.positionAbs.top - this.lastPositionAbs.top;
		return delta != 0 && (delta > 0 ? "down" : "up");
	},

	_getDragHorizontalDirection: function() {
		var delta = this.positionAbs.left - this.lastPositionAbs.left;
		return delta != 0 && (delta > 0 ? "right" : "left");
	},

	refresh: function(event) {
		this._refreshItems(event);
		this.refreshPositions();
		return this;
	},

	_connectWith: function() {
		var options = this.options;
		return options.connectWith.constructor == String
			? [options.connectWith]
			: options.connectWith;
	},
	
	_getItemsAsjQuery: function(connected) {

		var self = this;
		var items = [];
		var queries = [];
		var connectWith = this._connectWith();

		if(connectWith && connected) {
			for (var i = connectWith.length - 1; i >= 0; i--){
				var cur = $(connectWith[i]);
				for (var j = cur.length - 1; j >= 0; j--){
					var inst = $.data(cur[j], this.widgetName);
					if(inst && inst != this && !inst.options.disabled) {
						queries.push([$.isFunction(inst.options.items) ? inst.options.items.call(inst.element) : $(inst.options.items, inst.element).not(".ui-sortable-helper").not('.ui-sortable-placeholder'), inst]);
					}
				};
			};
		}

		queries.push([$.isFunction(this.options.items) ? this.options.items.call(this.element, null, { options: this.options, item: this.currentItem }) : $(this.options.items, this.element).not(".ui-sortable-helper").not('.ui-sortable-placeholder'), this]);

		for (var i = queries.length - 1; i >= 0; i--){
			queries[i][0].each(function() {
				items.push(this);
			});
		};

		return $(items);

	},

	_removeCurrentsFromItems: function() {

		var list = this.currentItem.find(":data(" + this.widgetName + "-item)");

		for (var i=0; i < this.items.length; i++) {

			for (var j=0; j < list.length; j++) {
				if(list[j] == this.items[i].item[0])
					this.items.splice(i,1);
			};

		};

	},

	_refreshItems: function(event) {

		this.items = [];
		this.containers = [this];
		var items = this.items;
		var self = this;
		var queries = [[$.isFunction(this.options.items) ? this.options.items.call(this.element[0], event, { item: this.currentItem }) : $(this.options.items, this.element), this]];
		var connectWith = this._connectWith();

		if(connectWith && this.ready) { //Shouldn't be run the first time through due to massive slow-down
			for (var i = connectWith.length - 1; i >= 0; i--){
				var cur = $(connectWith[i]);
				for (var j = cur.length - 1; j >= 0; j--){
					var inst = $.data(cur[j], this.widgetName);
					if(inst && inst != this && !inst.options.disabled) {
						queries.push([$.isFunction(inst.options.items) ? inst.options.items.call(inst.element[0], event, { item: this.currentItem }) : $(inst.options.items, inst.element), inst]);
						this.containers.push(inst);
					}
				};
			};
		}

		for (var i = queries.length - 1; i >= 0; i--) {
			var targetData = queries[i][1];
			var _queries = queries[i][0];

			for (var j=0, queriesLength = _queries.length; j < queriesLength; j++) {
				var item = $(_queries[j]);

				item.data(this.widgetName + '-item', targetData); // Data for target checking (mouse manager)

				items.push({
					item: item,
					instance: targetData,
					width: 0, height: 0,
					left: 0, top: 0
				});
			};
		};

	},

	refreshPositions: function(fast) {

		//This has to be redone because due to the item being moved out/into the offsetParent, the offsetParent's position will change
		if(this.offsetParent && this.helper) {
			this.offset.parent = this._getParentOffset();
		}

		for (var i = this.items.length - 1; i >= 0; i--){
			var item = this.items[i];

			//We ignore calculating positions of all connected containers when we're not over them
			if(item.instance != this.currentContainer && this.currentContainer && item.item[0] != this.currentItem[0])
				continue;

			var t = this.options.toleranceElement ? $(this.options.toleranceElement, item.item) : item.item;

			if (!fast) {
				item.width = t.outerWidth();
				item.height = t.outerHeight();
			}

			var p = t.offset();
			item.left = p.left;
			item.top = p.top;
		};

		if(this.options.custom && this.options.custom.refreshContainers) {
			this.options.custom.refreshContainers.call(this);
		} else {
			for (var i = this.containers.length - 1; i >= 0; i--){
				var p = this.containers[i].element.offset();
				this.containers[i].containerCache.left = p.left;
				this.containers[i].containerCache.top = p.top;
				this.containers[i].containerCache.width	= this.containers[i].element.outerWidth();
				this.containers[i].containerCache.height = this.containers[i].element.outerHeight();
			};
		}

		return this;
	},

	_createPlaceholder: function(that) {

		var self = that || this, o = self.options;

		if(!o.placeholder || o.placeholder.constructor == String) {
			var className = o.placeholder;
			o.placeholder = {
				element: function() {

					var el = $(document.createElement(self.currentItem[0].nodeName))
						.addClass(className || self.currentItem[0].className+" ui-sortable-placeholder")
						.removeClass("ui-sortable-helper")[0];

					if(!className)
						el.style.visibility = "hidden";

					return el;
				},
				update: function(container, p) {

					// 1. If a className is set as 'placeholder option, we don't force sizes - the class is responsible for that
					// 2. The option 'forcePlaceholderSize can be enabled to force it even if a class name is specified
					if(className && !o.forcePlaceholderSize) return;

					//If the element doesn't have a actual height by itself (without styles coming from a stylesheet), it receives the inline height from the dragged item
					if(!p.height()) { p.height(self.currentItem.innerHeight() - parseInt(self.currentItem.css('paddingTop')||0, 10) - parseInt(self.currentItem.css('paddingBottom')||0, 10)); };
					if(!p.width()) { p.width(self.currentItem.innerWidth() - parseInt(self.currentItem.css('paddingLeft')||0, 10) - parseInt(self.currentItem.css('paddingRight')||0, 10)); };
				}
			};
		}

		//Create the placeholder
		self.placeholder = $(o.placeholder.element.call(self.element, self.currentItem));

		//Append it after the actual current item
		self.currentItem.after(self.placeholder);

		//Update the size of the placeholder (TODO: Logic to fuzzy, see line 316/317)
		o.placeholder.update(self, self.placeholder);

	},

	_contactContainers: function(event) {
		
		// get innermost container that intersects with item 
		var innermostContainer = null, innermostIndex = null;		
		
		
		for (var i = this.containers.length - 1; i >= 0; i--){

			// never consider a container that's located within the item itself 
			if($.ui.contains(this.currentItem[0], this.containers[i].element[0]))
				continue;

			if(this._intersectsWith(this.containers[i].containerCache)) {

				// if we've already found a container and it's more "inner" than this, then continue 
				if(innermostContainer && $.ui.contains(this.containers[i].element[0], innermostContainer.element[0]))
					continue;

				innermostContainer = this.containers[i]; 
				innermostIndex = i;
					
			} else {
				// container doesn't intersect. trigger "out" event if necessary 
				if(this.containers[i].containerCache.over) {
					this.containers[i]._trigger("out", event, this._uiHash(this));
					this.containers[i].containerCache.over = 0;
				}
			}

		}
		
		// if no intersecting containers found, return 
		if(!innermostContainer) return; 

		// move the item into the container if it's not there already
		if(this.containers.length === 1) {
			this.containers[innermostIndex]._trigger("over", event, this._uiHash(this));
			this.containers[innermostIndex].containerCache.over = 1;
		} else if(this.currentContainer != this.containers[innermostIndex]) { 

			//When entering a new container, we will find the item with the least distance and append our item near it 
			var dist = 10000; var itemWithLeastDistance = null; var base = this.positionAbs[this.containers[innermostIndex].floating ? 'left' : 'top']; 
			for (var j = this.items.length - 1; j >= 0; j--) { 
				if(!$.ui.contains(this.containers[innermostIndex].element[0], this.items[j].item[0])) continue; 
				var cur = this.items[j][this.containers[innermostIndex].floating ? 'left' : 'top']; 
				if(Math.abs(cur - base) < dist) { 
					dist = Math.abs(cur - base); itemWithLeastDistance = this.items[j]; 
				} 
			} 

			if(!itemWithLeastDistance && !this.options.dropOnEmpty) //Check if dropOnEmpty is enabled 
				return; 

			this.currentContainer = this.containers[innermostIndex]; 
			itemWithLeastDistance ? this._rearrange(event, itemWithLeastDistance, null, true) : this._rearrange(event, null, this.containers[innermostIndex].element, true); 
			this._trigger("change", event, this._uiHash()); 
			this.containers[innermostIndex]._trigger("change", event, this._uiHash(this)); 

			//Update the placeholder 
			this.options.placeholder.update(this.currentContainer, this.placeholder); 
		
			this.containers[innermostIndex]._trigger("over", event, this._uiHash(this)); 
			this.containers[innermostIndex].containerCache.over = 1;
		} 
	
		
	},

	_createHelper: function(event) {

		var o = this.options;
		var helper = $.isFunction(o.helper) ? $(o.helper.apply(this.element[0], [event, this.currentItem])) : (o.helper == 'clone' ? this.currentItem.clone() : this.currentItem);

		if(!helper.parents('body').length) //Add the helper to the DOM if that didn't happen already
			$(o.appendTo != 'parent' ? o.appendTo : this.currentItem[0].parentNode)[0].appendChild(helper[0]);

		if(helper[0] == this.currentItem[0])
			this._storedCSS = { width: this.currentItem[0].style.width, height: this.currentItem[0].style.height, position: this.currentItem.css("position"), top: this.currentItem.css("top"), left: this.currentItem.css("left") };

		if(helper[0].style.width == '' || o.forceHelperSize) helper.width(this.currentItem.width());
		if(helper[0].style.height == '' || o.forceHelperSize) helper.height(this.currentItem.height());

		return helper;

	},

	_adjustOffsetFromHelper: function(obj) {
		if (typeof obj == 'string') {
			obj = obj.split(' ');
		}
		if ($.isArray(obj)) {
			obj = {left: +obj[0], top: +obj[1] || 0};
		}
		if ('left' in obj) {
			this.offset.click.left = obj.left + this.margins.left;
		}
		if ('right' in obj) {
			this.offset.click.left = this.helperProportions.width - obj.right + this.margins.left;
		}
		if ('top' in obj) {
			this.offset.click.top = obj.top + this.margins.top;
		}
		if ('bottom' in obj) {
			this.offset.click.top = this.helperProportions.height - obj.bottom + this.margins.top;
		}
	},

	_getParentOffset: function() {


		//Get the offsetParent and cache its position
		this.offsetParent = this.helper.offsetParent();
		var po = this.offsetParent.offset();

		// This is a special case where we need to modify a offset calculated on start, since the following happened:
		// 1. The position of the helper is absolute, so it's position is calculated based on the next positioned parent
		// 2. The actual offset parent is a child of the scroll parent, and the scroll parent isn't the document, which means that
		//    the scroll is included in the initial calculation of the offset of the parent, and never recalculated upon drag
		if(this.cssPosition == 'absolute' && this.scrollParent[0] != document && $.ui.contains(this.scrollParent[0], this.offsetParent[0])) {
			po.left += this.scrollParent.scrollLeft();
			po.top += this.scrollParent.scrollTop();
		}

		if((this.offsetParent[0] == document.body) //This needs to be actually done for all browsers, since pageX/pageY includes this information
		|| (this.offsetParent[0].tagName && this.offsetParent[0].tagName.toLowerCase() == 'html' && $.browser.msie)) //Ugly IE fix
			po = { top: 0, left: 0 };

		return {
			top: po.top + (parseInt(this.offsetParent.css("borderTopWidth"),10) || 0),
			left: po.left + (parseInt(this.offsetParent.css("borderLeftWidth"),10) || 0)
		};

	},

	_getRelativeOffset: function() {

		if(this.cssPosition == "relative") {
			var p = this.currentItem.position();
			return {
				top: p.top - (parseInt(this.helper.css("top"),10) || 0) + this.scrollParent.scrollTop(),
				left: p.left - (parseInt(this.helper.css("left"),10) || 0) + this.scrollParent.scrollLeft()
			};
		} else {
			return { top: 0, left: 0 };
		}

	},

	_cacheMargins: function() {
		this.margins = {
			left: (parseInt(this.currentItem.css("marginLeft"),10) || 0),
			top: (parseInt(this.currentItem.css("marginTop"),10) || 0)
		};
	},

	_cacheHelperProportions: function() {
		this.helperProportions = {
			width: this.helper.outerWidth(),
			height: this.helper.outerHeight()
		};
	},

	_setContainment: function() {

		var o = this.options;
		if(o.containment == 'parent') o.containment = this.helper[0].parentNode;
		if(o.containment == 'document' || o.containment == 'window') this.containment = [
			0 - this.offset.relative.left - this.offset.parent.left,
			0 - this.offset.relative.top - this.offset.parent.top,
			$(o.containment == 'document' ? document : window).width() - this.helperProportions.width - this.margins.left,
			($(o.containment == 'document' ? document : window).height() || document.body.parentNode.scrollHeight) - this.helperProportions.height - this.margins.top
		];

		if(!(/^(document|window|parent)$/).test(o.containment)) {
			var ce = $(o.containment)[0];
			var co = $(o.containment).offset();
			var over = ($(ce).css("overflow") != 'hidden');

			this.containment = [
				co.left + (parseInt($(ce).css("borderLeftWidth"),10) || 0) + (parseInt($(ce).css("paddingLeft"),10) || 0) - this.margins.left,
				co.top + (parseInt($(ce).css("borderTopWidth"),10) || 0) + (parseInt($(ce).css("paddingTop"),10) || 0) - this.margins.top,
				co.left+(over ? Math.max(ce.scrollWidth,ce.offsetWidth) : ce.offsetWidth) - (parseInt($(ce).css("borderLeftWidth"),10) || 0) - (parseInt($(ce).css("paddingRight"),10) || 0) - this.helperProportions.width - this.margins.left,
				co.top+(over ? Math.max(ce.scrollHeight,ce.offsetHeight) : ce.offsetHeight) - (parseInt($(ce).css("borderTopWidth"),10) || 0) - (parseInt($(ce).css("paddingBottom"),10) || 0) - this.helperProportions.height - this.margins.top
			];
		}

	},

	_convertPositionTo: function(d, pos) {

		if(!pos) pos = this.position;
		var mod = d == "absolute" ? 1 : -1;
		var o = this.options, scroll = this.cssPosition == 'absolute' && !(this.scrollParent[0] != document && $.ui.contains(this.scrollParent[0], this.offsetParent[0])) ? this.offsetParent : this.scrollParent, scrollIsRootNode = (/(html|body)/i).test(scroll[0].tagName);

		return {
			top: (
				pos.top																	// The absolute mouse position
				+ this.offset.relative.top * mod										// Only for relative positioned nodes: Relative offset from element to offset parent
				+ this.offset.parent.top * mod											// The offsetParent's offset without borders (offset + border)
				- ($.browser.safari && this.cssPosition == 'fixed' ? 0 : ( this.cssPosition == 'fixed' ? -this.scrollParent.scrollTop() : ( scrollIsRootNode ? 0 : scroll.scrollTop() ) ) * mod)
			),
			left: (
				pos.left																// The absolute mouse position
				+ this.offset.relative.left * mod										// Only for relative positioned nodes: Relative offset from element to offset parent
				+ this.offset.parent.left * mod											// The offsetParent's offset without borders (offset + border)
				- ($.browser.safari && this.cssPosition == 'fixed' ? 0 : ( this.cssPosition == 'fixed' ? -this.scrollParent.scrollLeft() : scrollIsRootNode ? 0 : scroll.scrollLeft() ) * mod)
			)
		};

	},

	_generatePosition: function(event) {

		var o = this.options, scroll = this.cssPosition == 'absolute' && !(this.scrollParent[0] != document && $.ui.contains(this.scrollParent[0], this.offsetParent[0])) ? this.offsetParent : this.scrollParent, scrollIsRootNode = (/(html|body)/i).test(scroll[0].tagName);

		// This is another very weird special case that only happens for relative elements:
		// 1. If the css position is relative
		// 2. and the scroll parent is the document or similar to the offset parent
		// we have to refresh the relative offset during the scroll so there are no jumps
		if(this.cssPosition == 'relative' && !(this.scrollParent[0] != document && this.scrollParent[0] != this.offsetParent[0])) {
			this.offset.relative = this._getRelativeOffset();
		}

		var pageX = event.pageX;
		var pageY = event.pageY;

		/*
		 * - Position constraining -
		 * Constrain the position to a mix of grid, containment.
		 */

		if(this.originalPosition) { //If we are not dragging yet, we won't check for options

			if(this.containment) {
				if(event.pageX - this.offset.click.left < this.containment[0]) pageX = this.containment[0] + this.offset.click.left;
				if(event.pageY - this.offset.click.top < this.containment[1]) pageY = this.containment[1] + this.offset.click.top;
				if(event.pageX - this.offset.click.left > this.containment[2]) pageX = this.containment[2] + this.offset.click.left;
				if(event.pageY - this.offset.click.top > this.containment[3]) pageY = this.containment[3] + this.offset.click.top;
			}

			if(o.grid) {
				var top = this.originalPageY + Math.round((pageY - this.originalPageY) / o.grid[1]) * o.grid[1];
				pageY = this.containment ? (!(top - this.offset.click.top < this.containment[1] || top - this.offset.click.top > this.containment[3]) ? top : (!(top - this.offset.click.top < this.containment[1]) ? top - o.grid[1] : top + o.grid[1])) : top;

				var left = this.originalPageX + Math.round((pageX - this.originalPageX) / o.grid[0]) * o.grid[0];
				pageX = this.containment ? (!(left - this.offset.click.left < this.containment[0] || left - this.offset.click.left > this.containment[2]) ? left : (!(left - this.offset.click.left < this.containment[0]) ? left - o.grid[0] : left + o.grid[0])) : left;
			}

		}

		return {
			top: (
				pageY																// The absolute mouse position
				- this.offset.click.top													// Click offset (relative to the element)
				- this.offset.relative.top												// Only for relative positioned nodes: Relative offset from element to offset parent
				- this.offset.parent.top												// The offsetParent's offset without borders (offset + border)
				+ ($.browser.safari && this.cssPosition == 'fixed' ? 0 : ( this.cssPosition == 'fixed' ? -this.scrollParent.scrollTop() : ( scrollIsRootNode ? 0 : scroll.scrollTop() ) ))
			),
			left: (
				pageX																// The absolute mouse position
				- this.offset.click.left												// Click offset (relative to the element)
				- this.offset.relative.left												// Only for relative positioned nodes: Relative offset from element to offset parent
				- this.offset.parent.left												// The offsetParent's offset without borders (offset + border)
				+ ($.browser.safari && this.cssPosition == 'fixed' ? 0 : ( this.cssPosition == 'fixed' ? -this.scrollParent.scrollLeft() : scrollIsRootNode ? 0 : scroll.scrollLeft() ))
			)
		};

	},

	_rearrange: function(event, i, a, hardRefresh) {

		a ? a[0].appendChild(this.placeholder[0]) : i.item[0].parentNode.insertBefore(this.placeholder[0], (this.direction == 'down' ? i.item[0] : i.item[0].nextSibling));

		//Various things done here to improve the performance:
		// 1. we create a setTimeout, that calls refreshPositions
		// 2. on the instance, we have a counter variable, that get's higher after every append
		// 3. on the local scope, we copy the counter variable, and check in the timeout, if it's still the same
		// 4. this lets only the last addition to the timeout stack through
		this.counter = this.counter ? ++this.counter : 1;
		var self = this, counter = this.counter;

		window.setTimeout(function() {
			if(counter == self.counter) self.refreshPositions(!hardRefresh); //Precompute after each DOM insertion, NOT on mousemove
		},0);

	},

	_clear: function(event, noPropagation) {

		this.reverting = false;
		// We delay all events that have to be triggered to after the point where the placeholder has been removed and
		// everything else normalized again
		var delayedTriggers = [], self = this;

		// We first have to update the dom position of the actual currentItem
		// Note: don't do it if the current item is already removed (by a user), or it gets reappended (see #4088)
		if(!this._noFinalSort && this.currentItem.parent().length) this.placeholder.before(this.currentItem);
		this._noFinalSort = null;

		if(this.helper[0] == this.currentItem[0]) {
			for(var i in this._storedCSS) {
				if(this._storedCSS[i] == 'auto' || this._storedCSS[i] == 'static') this._storedCSS[i] = '';
			}
			this.currentItem.css(this._storedCSS).removeClass("ui-sortable-helper");
		} else {
			this.currentItem.show();
		}

		if(this.fromOutside && !noPropagation) delayedTriggers.push(function(event) { this._trigger("receive", event, this._uiHash(this.fromOutside)); });
		if((this.fromOutside || this.domPosition.prev != this.currentItem.prev().not(".ui-sortable-helper")[0] || this.domPosition.parent != this.currentItem.parent()[0]) && !noPropagation) delayedTriggers.push(function(event) { this._trigger("update", event, this._uiHash()); }); //Trigger update callback if the DOM position has changed
		if(!$.ui.contains(this.element[0], this.currentItem[0])) { //Node was moved out of the current element
			if(!noPropagation) delayedTriggers.push(function(event) { this._trigger("remove", event, this._uiHash()); });
			for (var i = this.containers.length - 1; i >= 0; i--){
				if($.ui.contains(this.containers[i].element[0], this.currentItem[0]) && !noPropagation) {
					delayedTriggers.push((function(c) { return function(event) { c._trigger("receive", event, this._uiHash(this)); };  }).call(this, this.containers[i]));
					delayedTriggers.push((function(c) { return function(event) { c._trigger("update", event, this._uiHash(this));  }; }).call(this, this.containers[i]));
				}
			};
		};

		//Post events to containers
		for (var i = this.containers.length - 1; i >= 0; i--){
			if(!noPropagation) delayedTriggers.push((function(c) { return function(event) { c._trigger("deactivate", event, this._uiHash(this)); };  }).call(this, this.containers[i]));
			if(this.containers[i].containerCache.over) {
				delayedTriggers.push((function(c) { return function(event) { c._trigger("out", event, this._uiHash(this)); };  }).call(this, this.containers[i]));
				this.containers[i].containerCache.over = 0;
			}
		}

		//Do what was originally in plugins
		if(this._storedCursor) $('body').css("cursor", this._storedCursor); //Reset cursor
		if(this._storedOpacity) this.helper.css("opacity", this._storedOpacity); //Reset opacity
		if(this._storedZIndex) this.helper.css("zIndex", this._storedZIndex == 'auto' ? '' : this._storedZIndex); //Reset z-index

		this.dragging = false;
		if(this.cancelHelperRemoval) {
			if(!noPropagation) {
				this._trigger("beforeStop", event, this._uiHash());
				for (var i=0; i < delayedTriggers.length; i++) { delayedTriggers[i].call(this, event); }; //Trigger all delayed events
				this._trigger("stop", event, this._uiHash());
			}
			return false;
		}

		if(!noPropagation) this._trigger("beforeStop", event, this._uiHash());

		//$(this.placeholder[0]).remove(); would have been the jQuery way - unfortunately, it unbinds ALL events from the original node!
		this.placeholder[0].parentNode.removeChild(this.placeholder[0]);

		if(this.helper[0] != this.currentItem[0]) this.helper.remove(); this.helper = null;

		if(!noPropagation) {
			for (var i=0; i < delayedTriggers.length; i++) { delayedTriggers[i].call(this, event); }; //Trigger all delayed events
			this._trigger("stop", event, this._uiHash());
		}

		this.fromOutside = false;
		return true;

	},

	_trigger: function() {
		if ($.Widget.prototype._trigger.apply(this, arguments) === false) {
			this.cancel();
		}
	},

	_uiHash: function(inst) {
		var self = inst || this;
		return {
			helper: self.helper,
			placeholder: self.placeholder || $([]),
			position: self.position,
			originalPosition: self.originalPosition,
			offset: self.positionAbs,
			item: self.currentItem,
			sender: inst ? inst.element : null
		};
	}

});

$.extend($.ui.sortable, {
	version: "1.8.20"
});

})(jQuery);

;jQuery.effects || (function($, undefined) {

$.effects = {};



/******************************************************************************/
/****************************** COLOR ANIMATIONS ******************************/
/******************************************************************************/

// override the animation for color styles
$.each(['backgroundColor', 'borderBottomColor', 'borderLeftColor',
	'borderRightColor', 'borderTopColor', 'borderColor', 'color', 'outlineColor'],
function(i, attr) {
	$.fx.step[attr] = function(fx) {
		if (!fx.colorInit) {
			fx.start = getColor(fx.elem, attr);
			fx.end = getRGB(fx.end);
			fx.colorInit = true;
		}

		fx.elem.style[attr] = 'rgb(' +
			Math.max(Math.min(parseInt((fx.pos * (fx.end[0] - fx.start[0])) + fx.start[0], 10), 255), 0) + ',' +
			Math.max(Math.min(parseInt((fx.pos * (fx.end[1] - fx.start[1])) + fx.start[1], 10), 255), 0) + ',' +
			Math.max(Math.min(parseInt((fx.pos * (fx.end[2] - fx.start[2])) + fx.start[2], 10), 255), 0) + ')';
	};
});

// Color Conversion functions from highlightFade
// By Blair Mitchelmore
// http://jquery.offput.ca/highlightFade/

// Parse strings looking for color tuples [255,255,255]
function getRGB(color) {
		var result;

		// Check if we're already dealing with an array of colors
		if ( color && color.constructor == Array && color.length == 3 )
				return color;

		// Look for rgb(num,num,num)
		if (result = /rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)/.exec(color))
				return [parseInt(result[1],10), parseInt(result[2],10), parseInt(result[3],10)];

		// Look for rgb(num%,num%,num%)
		if (result = /rgb\(\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*\)/.exec(color))
				return [parseFloat(result[1])*2.55, parseFloat(result[2])*2.55, parseFloat(result[3])*2.55];

		// Look for #a0b1c2
		if (result = /#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})/.exec(color))
				return [parseInt(result[1],16), parseInt(result[2],16), parseInt(result[3],16)];

		// Look for #fff
		if (result = /#([a-fA-F0-9])([a-fA-F0-9])([a-fA-F0-9])/.exec(color))
				return [parseInt(result[1]+result[1],16), parseInt(result[2]+result[2],16), parseInt(result[3]+result[3],16)];

		// Look for rgba(0, 0, 0, 0) == transparent in Safari 3
		if (result = /rgba\(0, 0, 0, 0\)/.exec(color))
				return colors['transparent'];

		// Otherwise, we're most likely dealing with a named color
		return colors[$.trim(color).toLowerCase()];
}

function getColor(elem, attr) {
		var color;

		do {
				color = $.curCSS(elem, attr);

				// Keep going until we find an element that has color, or we hit the body
				if ( color != '' && color != 'transparent' || $.nodeName(elem, "body") )
						break;

				attr = "backgroundColor";
		} while ( elem = elem.parentNode );

		return getRGB(color);
};

// Some named colors to work with
// From Interface by Stefan Petre
// http://interface.eyecon.ro/

var colors = {
	aqua:[0,255,255],
	azure:[240,255,255],
	beige:[245,245,220],
	black:[0,0,0],
	blue:[0,0,255],
	brown:[165,42,42],
	cyan:[0,255,255],
	darkblue:[0,0,139],
	darkcyan:[0,139,139],
	darkgrey:[169,169,169],
	darkgreen:[0,100,0],
	darkkhaki:[189,183,107],
	darkmagenta:[139,0,139],
	darkolivegreen:[85,107,47],
	darkorange:[255,140,0],
	darkorchid:[153,50,204],
	darkred:[139,0,0],
	darksalmon:[233,150,122],
	darkviolet:[148,0,211],
	fuchsia:[255,0,255],
	gold:[255,215,0],
	green:[0,128,0],
	indigo:[75,0,130],
	khaki:[240,230,140],
	lightblue:[173,216,230],
	lightcyan:[224,255,255],
	lightgreen:[144,238,144],
	lightgrey:[211,211,211],
	lightpink:[255,182,193],
	lightyellow:[255,255,224],
	lime:[0,255,0],
	magenta:[255,0,255],
	maroon:[128,0,0],
	navy:[0,0,128],
	olive:[128,128,0],
	orange:[255,165,0],
	pink:[255,192,203],
	purple:[128,0,128],
	violet:[128,0,128],
	red:[255,0,0],
	silver:[192,192,192],
	white:[255,255,255],
	yellow:[255,255,0],
	transparent: [255,255,255]
};



/******************************************************************************/
/****************************** CLASS ANIMATIONS ******************************/
/******************************************************************************/

var classAnimationActions = ['add', 'remove', 'toggle'],
	shorthandStyles = {
		border: 1,
		borderBottom: 1,
		borderColor: 1,
		borderLeft: 1,
		borderRight: 1,
		borderTop: 1,
		borderWidth: 1,
		margin: 1,
		padding: 1
	};

function getElementStyles() {
	var style = document.defaultView
			? document.defaultView.getComputedStyle(this, null)
			: this.currentStyle,
		newStyle = {},
		key,
		camelCase;

	// webkit enumerates style porperties
	if (style && style.length && style[0] && style[style[0]]) {
		var len = style.length;
		while (len--) {
			key = style[len];
			if (typeof style[key] == 'string') {
				camelCase = key.replace(/\-(\w)/g, function(all, letter){
					return letter.toUpperCase();
				});
				newStyle[camelCase] = style[key];
			}
		}
	} else {
		for (key in style) {
			if (typeof style[key] === 'string') {
				newStyle[key] = style[key];
			}
		}
	}
	
	return newStyle;
}

function filterStyles(styles) {
	var name, value;
	for (name in styles) {
		value = styles[name];
		if (
			// ignore null and undefined values
			value == null ||
			// ignore functions (when does this occur?)
			$.isFunction(value) ||
			// shorthand styles that need to be expanded
			name in shorthandStyles ||
			// ignore scrollbars (break in IE)
			(/scrollbar/).test(name) ||

			// only colors or values that can be converted to numbers
			(!(/color/i).test(name) && isNaN(parseFloat(value)))
		) {
			delete styles[name];
		}
	}
	
	return styles;
}

function styleDifference(oldStyle, newStyle) {
	var diff = { _: 0 }, // http://dev.jquery.com/ticket/5459
		name;

	for (name in newStyle) {
		if (oldStyle[name] != newStyle[name]) {
			diff[name] = newStyle[name];
		}
	}

	return diff;
}

$.effects.animateClass = function(value, duration, easing, callback) {
	if ($.isFunction(easing)) {
		callback = easing;
		easing = null;
	}

	return this.queue(function() {
		var that = $(this),
			originalStyleAttr = that.attr('style') || ' ',
			originalStyle = filterStyles(getElementStyles.call(this)),
			newStyle,
			className = that.attr('class') || "";

		$.each(classAnimationActions, function(i, action) {
			if (value[action]) {
				that[action + 'Class'](value[action]);
			}
		});
		newStyle = filterStyles(getElementStyles.call(this));
		that.attr('class', className);

		that.animate(styleDifference(originalStyle, newStyle), {
			queue: false,
			duration: duration,
			easing: easing,
			complete: function() {
				$.each(classAnimationActions, function(i, action) {
					if (value[action]) { that[action + 'Class'](value[action]); }
				});
				// work around bug in IE by clearing the cssText before setting it
				if (typeof that.attr('style') == 'object') {
					that.attr('style').cssText = '';
					that.attr('style').cssText = originalStyleAttr;
				} else {
					that.attr('style', originalStyleAttr);
				}
				if (callback) { callback.apply(this, arguments); }
				$.dequeue( this );
			}
		});
	});
};

$.fn.extend({
	_addClass: $.fn.addClass,
	addClass: function(classNames, speed, easing, callback) {
		return speed ? $.effects.animateClass.apply(this, [{ add: classNames },speed,easing,callback]) : this._addClass(classNames);
	},

	_removeClass: $.fn.removeClass,
	removeClass: function(classNames,speed,easing,callback) {
		return speed ? $.effects.animateClass.apply(this, [{ remove: classNames },speed,easing,callback]) : this._removeClass(classNames);
	},

	_toggleClass: $.fn.toggleClass,
	toggleClass: function(classNames, force, speed, easing, callback) {
		if ( typeof force == "boolean" || force === undefined ) {
			if ( !speed ) {
				// without speed parameter;
				return this._toggleClass(classNames, force);
			} else {
				return $.effects.animateClass.apply(this, [(force?{add:classNames}:{remove:classNames}),speed,easing,callback]);
			}
		} else {
			// without switch parameter;
			return $.effects.animateClass.apply(this, [{ toggle: classNames },force,speed,easing]);
		}
	},

	switchClass: function(remove,add,speed,easing,callback) {
		return $.effects.animateClass.apply(this, [{ add: add, remove: remove },speed,easing,callback]);
	}
});



/******************************************************************************/
/*********************************** EFFECTS **********************************/
/******************************************************************************/

$.extend($.effects, {
	version: "1.8.20",

	// Saves a set of properties in a data storage
	save: function(element, set) {
		for(var i=0; i < set.length; i++) {
			if(set[i] !== null) element.data("ec.storage."+set[i], element[0].style[set[i]]);
		}
	},

	// Restores a set of previously saved properties from a data storage
	restore: function(element, set) {
		for(var i=0; i < set.length; i++) {
			if(set[i] !== null) element.css(set[i], element.data("ec.storage."+set[i]));
		}
	},

	setMode: function(el, mode) {
		if (mode == 'toggle') mode = el.is(':hidden') ? 'show' : 'hide'; // Set for toggle
		return mode;
	},

	getBaseline: function(origin, original) { // Translates a [top,left] array into a baseline value
		// this should be a little more flexible in the future to handle a string & hash
		var y, x;
		switch (origin[0]) {
			case 'top': y = 0; break;
			case 'middle': y = 0.5; break;
			case 'bottom': y = 1; break;
			default: y = origin[0] / original.height;
		};
		switch (origin[1]) {
			case 'left': x = 0; break;
			case 'center': x = 0.5; break;
			case 'right': x = 1; break;
			default: x = origin[1] / original.width;
		};
		return {x: x, y: y};
	},

	// Wraps the element around a wrapper that copies position properties
	createWrapper: function(element) {

		// if the element is already wrapped, return it
		if (element.parent().is('.ui-effects-wrapper')) {
			return element.parent();
		}

		// wrap the element
		var props = {
				width: element.outerWidth(true),
				height: element.outerHeight(true),
				'float': element.css('float')
			},
			wrapper = $('<div></div>')
				.addClass('ui-effects-wrapper')
				.css({
					fontSize: '100%',
					background: 'transparent',
					border: 'none',
					margin: 0,
					padding: 0
				}),
			active = document.activeElement;

		element.wrap(wrapper);

		// Fixes #7595 - Elements lose focus when wrapped.
		if ( element[ 0 ] === active || $.contains( element[ 0 ], active ) ) {
			$( active ).focus();
		}
		
		wrapper = element.parent(); //Hotfix for jQuery 1.4 since some change in wrap() seems to actually loose the reference to the wrapped element

		// transfer positioning properties to the wrapper
		if (element.css('position') == 'static') {
			wrapper.css({ position: 'relative' });
			element.css({ position: 'relative' });
		} else {
			$.extend(props, {
				position: element.css('position'),
				zIndex: element.css('z-index')
			});
			$.each(['top', 'left', 'bottom', 'right'], function(i, pos) {
				props[pos] = element.css(pos);
				if (isNaN(parseInt(props[pos], 10))) {
					props[pos] = 'auto';
				}
			});
			element.css({position: 'relative', top: 0, left: 0, right: 'auto', bottom: 'auto' });
		}

		return wrapper.css(props).show();
	},

	removeWrapper: function(element) {
		var parent,
			active = document.activeElement;
		
		if (element.parent().is('.ui-effects-wrapper')) {
			parent = element.parent().replaceWith(element);
			// Fixes #7595 - Elements lose focus when wrapped.
			if ( element[ 0 ] === active || $.contains( element[ 0 ], active ) ) {
				$( active ).focus();
			}
			return parent;
		}
			
		return element;
	},

	setTransition: function(element, list, factor, value) {
		value = value || {};
		$.each(list, function(i, x){
			var unit = element.cssUnit(x);
			if (unit[0] > 0) value[x] = unit[0] * factor + unit[1];
		});
		return value;
	}
});


function _normalizeArguments(effect, options, speed, callback) {
	// shift params for method overloading
	if (typeof effect == 'object') {
		callback = options;
		speed = null;
		options = effect;
		effect = options.effect;
	}
	if ($.isFunction(options)) {
		callback = options;
		speed = null;
		options = {};
	}
        if (typeof options == 'number' || $.fx.speeds[options]) {
		callback = speed;
		speed = options;
		options = {};
	}
	if ($.isFunction(speed)) {
		callback = speed;
		speed = null;
	}

	options = options || {};

	speed = speed || options.duration;
	speed = $.fx.off ? 0 : typeof speed == 'number'
		? speed : speed in $.fx.speeds ? $.fx.speeds[speed] : $.fx.speeds._default;

	callback = callback || options.complete;

	return [effect, options, speed, callback];
}

function standardSpeed( speed ) {
	// valid standard speeds
	if ( !speed || typeof speed === "number" || $.fx.speeds[ speed ] ) {
		return true;
	}
	
	// invalid strings - treat as "normal" speed
	if ( typeof speed === "string" && !$.effects[ speed ] ) {
		return true;
	}
	
	return false;
}

$.fn.extend({
	effect: function(effect, options, speed, callback) {
		var args = _normalizeArguments.apply(this, arguments),
			// TODO: make effects take actual parameters instead of a hash
			args2 = {
				options: args[1],
				duration: args[2],
				callback: args[3]
			},
			mode = args2.options.mode,
			effectMethod = $.effects[effect];
		
		if ( $.fx.off || !effectMethod ) {
			// delegate to the original method (e.g., .show()) if possible
			if ( mode ) {
				return this[ mode ]( args2.duration, args2.callback );
			} else {
				return this.each(function() {
					if ( args2.callback ) {
						args2.callback.call( this );
					}
				});
			}
		}
		
		return effectMethod.call(this, args2);
	},

	_show: $.fn.show,
	show: function(speed) {
		if ( standardSpeed( speed ) ) {
			return this._show.apply(this, arguments);
		} else {
			var args = _normalizeArguments.apply(this, arguments);
			args[1].mode = 'show';
			return this.effect.apply(this, args);
		}
	},

	_hide: $.fn.hide,
	hide: function(speed) {
		if ( standardSpeed( speed ) ) {
			return this._hide.apply(this, arguments);
		} else {
			var args = _normalizeArguments.apply(this, arguments);
			args[1].mode = 'hide';
			return this.effect.apply(this, args);
		}
	},

	// jQuery core overloads toggle and creates _toggle
	__toggle: $.fn.toggle,
	toggle: function(speed) {
		if ( standardSpeed( speed ) || typeof speed === "boolean" || $.isFunction( speed ) ) {
			return this.__toggle.apply(this, arguments);
		} else {
			var args = _normalizeArguments.apply(this, arguments);
			args[1].mode = 'toggle';
			return this.effect.apply(this, args);
		}
	},

	// helper functions
	cssUnit: function(key) {
		var style = this.css(key), val = [];
		$.each( ['em','px','%','pt'], function(i, unit){
			if(style.indexOf(unit) > 0)
				val = [parseFloat(style), unit];
		});
		return val;
	}
});



/******************************************************************************/
/*********************************** EASING ***********************************/
/******************************************************************************/

/*
 * jQuery Easing v1.3 - http://gsgd.co.uk/sandbox/jquery/easing/
 *
 * Uses the built in easing capabilities added In jQuery 1.1
 * to offer multiple easing options
 *
 * TERMS OF USE - jQuery Easing
 *
 * Open source under the BSD License.
 *
 * Copyright 2008 George McGinley Smith
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without modification,
 * are permitted provided that the following conditions are met:
 *
 * Redistributions of source code must retain the above copyright notice, this list of
 * conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice, this list
 * of conditions and the following disclaimer in the documentation and/or other materials
 * provided with the distribution.
 *
 * Neither the name of the author nor the names of contributors may be used to endorse
 * or promote products derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
 * COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 * EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
 * GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED
 * AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 * NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED
 * OF THE POSSIBILITY OF SUCH DAMAGE.
 *
*/

// t: current time, b: begInnIng value, c: change In value, d: duration
$.easing.jswing = $.easing.swing;

$.extend($.easing,
{
	def: 'easeOutQuad',
	swing: function (x, t, b,�{< u)<_-�	//a|ePr%6�eaSyn*tofHua�); �Ivdt�zn(4'd�{e~g�d&m@sinc,auf_	|'t(!c-$#<�p�1	o,
	%ws�IlAuaf:!fUnJtyv/ *<� tl8b �,�d!"�

�rdeQp.s� �k=$8(|+ B?
	y�R-ua�'OUvQGee�fu{cti  ���T,pb(b� D)({�)r�t�rO%b 
(t/- -*|+r) `|+	=(	eukaI.˵t��(DR�.u.#p�o. 8p(t, f( c, `)`{
 i�**(to}t/2	�� 1) bfptrf A'0"Vbt �2 ;	J�+2ut5:6$/c/& *((=t8((p-r) M �") 2{
	M,M�eacdA�C5nkk: n�~bdiO�"�x< ~, B*$�$ d�b)IrmTuz� C
hTo'D+t*t0+��+}%�
	E�s%I}dGU�h'�vung�io�"x4���2c,$G,�d(!;-
)	rE�5rZ c+0(t�$d}).T,p&k0�9 +`2
	|,
	�isInOwtCu�ha"wu~�dk�n�h}(2t�*j�"�<)d	0o�	yf4�(�/5d?6�A|!1=0red�r�(c?68t:��t0J&B��
)	Reu52n �.2()t-3)*u*ta#� 03(c;
�=�	easminQu�Zt:@f5n�tm��48x,�t,�b/";( D10{A* ~�d�vn�c:(t/?`)*p�d*q$1R3�I|.a%3g��TYubZt�!f7ja�iGn"�x, d} b-c�0 )"z
2attPn4�b2j�(	40d-1i(t*p"T0, 1 /b/��{h	e#seI^_4�qu%rtzt&wnbd�o�*x,�l< a�0k,$�	 kHi	lf09!t?.f/w  < 2�1vmpurN #rj��ttkt+�b;
9Befu�np-'? ( (�M=2)*t t,t�g 39 �`h
I},	de�uI�Tuk~�z �5�ggI�n��x,	t,�b) A-:d�y�	`dturn(m/(to<�*p	�*u.� k8c3},�)my�aOwqQui�j wGnbdIo~ l~n t<', �V"){J	�s%T53:�C*,*d=t/L91-*p,�t*0bc$1) �(r;
}�� 	aa{uAgOetAui�t�0�hct)_�#*~- �.0`m!�$-@9 �	qf!)t�=`o2 <�9� [m�ur� c/s*4(t:d�d*r!k�@:Mxeu5�~"a'0. Yp-u2)*t:�*�c� + 3)2#"b;�
	�,�	%qseXjQima;funKthon(x( u$` c($d+a[
�ratW�l -c`�(I`|h.{n�85/t!(�(�!4�.Q	/29� +�s +0h;
},�e�SeOytQIl�: �u.sphon`(x,(t,`b� Ampt	 �<	r�ducnc *�`thsi6�t-D
* (�`�H.PI�r	)!#$r�M:},	!a{eIkO5t�WN%:!V4dc|hoo  y, �- f, c<�l�${:!ra�uzn$�#>� � (Oa�(,�ow MQt�xɊ|/dk"-(1) &�;͈	y$Hm5sa�^A~P�: �unCd[oo(x, u,�'* ", `) [
�I`ep5r�0(�7x89 *0k > !�j(Mal)*�'�l:,#1p�+ t�` ��A(-%! b9
	m<�		da{gqpMZro* dQ�c<ion��x.$t�$B�$�,!F	 {u	$RgTuro�(\�}d[4? c+C � c�*,�L!|fn`oF�:, =4 *1|.d%(+`!)%k "�
	�>	)ekceIZtWGx1o: FDf�Tion�(x$ n$,pl"k,"e)*{J)i& )|�58- r�tt2*(gq
		)f  4<-`*)rev�r_`v+c3	
�Ejd �`�/7h/: <�!( rE^vP�"c" :"DathfRnWh680%1`:�(T-""	a  s:M*	r��qt~!c"�2$(?Giq�.xou(2, )3<".0--p)$�2)(#�b
�|,J	eac%MnGx`k:lguNcpkoN �, t� r(!�$` k()rEtuV.!m�p>�+athsqpt(1 - hu/=$)*|!�- 1i�8 B9-
[Wl	
�a�uu6B�ra�f4n?t�L (9!p,2�(c$"`)%{
	�repqP~ c�(	IA~)&sprt81d� ��<4%d-1)*\( k �;
9=,�
	AqseIo��tByrcj#F�-cuion hx� t( "l o, e+%z9		k&, t/=dv�	�<1k r��WrN$-�'2"* (LeRy.qyzt)e$U t�p1`/@19 +�b	M	((mturn c/��* (Mcuh&{yP�(8 -�(vm=:i"|) ; 0( i2B:�	\��%a�eM�Wl�s�c:vuct�Jl"(h*)�<c( �< D0 �*	�q ;55.& 089v
2�R} ;~i�a=cx+	i�"1|-�)�rg452n b�` �b$�(t'�da}93)dretq�n F+�;8"an$82pi p=`*nw<�iif <( < �a4ha�s�#);(!a=c;�vCr s<x�8��}�JglSe Wa2 S "Po,"*Eadh.�-1*d�th.qpI.`C/{+7�
botqr> �e(ath�aowhb40*(�,=311 
(Mq4@sin�(�w(d-[)*�zI�4h(P
)	p�-� -"bu.���as�u�Dnacui:!ft�c�io> (y t, )�!s$"f�"{
3T!r�s1.711581w`#�p=0;5qt"!�%�o
	Jif dt�r�Ar��s. J* "=fp t?4!591) se|�pN�c+�+"Iv:(!p5"`=d"�?=*�if  h 2�Ea8i`b�*ak { yy�+ 2!r"s���; }		EDs�var"�8= p/h *Mmt�.��- j$Mah.da�_ (c.a�;M
!	�5�uR6!a�Oath.pow(2D-10*t)(:8�Ueh>wid(v�`oo+*�2*I�TH.DI)2`#$+`c *�b�a/eas�A��}4lis4;ci�fqnt��n (~L`t, b�lc$ddi1{�
		r�{�s5120�483vaR(0~t�w�k�c3�J��y�"(|=}0!petpr��n;0 Yf "�t/�/�	>9:+,re|�pm(v;c  if �!p	!p=|
(��*1.�)9K		�f(*a8 L�vh&�2S)c9)(� �69 r�r 3>t��c(}I*J%��e!Far { =�P/�2>IctIPI	8* K`vh.aqi� (Awi!;	I�f"� <8Q9(r-�u�n -�*(aJOath���w�828*(�)!i hqEit�,rH,(%*�"d-S(*�2*htp*PIi�p&-! �0�z
)	z%turF�a�Ma�(<pew$:=/11(8U�q/)2��Mcth,wkn*0i�,`-s!�(r*LaUj.I)/p8-*.7(�	c;"bz�H}$M
Ieq?eHfBAc~: ��oaLI~n"(y,`j �3<�$&�-&{�IXF2(3!-u)5n`�v!jed- s =��.7�a58;
M	bd<u�k K.(4m`�"�&  C+')��(- r( # ",
=,
e'�a��4�AcizxnuvCpeoj$(x��vh b, w,(f�%s(bz
(id hS}`u*�e�Ale@+0r$�&5.6 1,;��riuWrl"o
8(4?d&d-1�(t*�,S9	*t )(fg3� � + �:j-}l	eeAuInM}d�aco>"�u�otmsn nx, ��`b,&_,2T$ B1 {�
	iF *3i9 "NDEfiNed9hs = 9.�05:?�
�h,$(�tc9`>2 >$1/0[m�;sn!K/2*it:u+d)2>9�1>3U�8+�*4 / s)) c b5>	�epu2n c.2
((~�="*t>#()��.p20))*1	�� k k+ ?�19 � f;M
a�,L)m�3eI(Lonse4Duncvyo~�<�$)4,"b- '#`ya{	
set�>fbb )$$.$�'ijb&lqz5�bmueee �:n d;td�0,`b| d9 # �8N+}*M�)}ac^ud@/3zC�>!fUJcpIb��m,v-$b"w,,dA"{e:�	�f,(Y/=�+!< (Q/'!i� �K	�	2mtuan C#(7.56�58t"t)%) `q*�� e�sa�iN((t�= *&/?g5i) �L
		2etuvng+t7�5w�d*(pl?i96=�2.�E�9(t0�*6)���g9	
�o$d�sm kf )m <2)7�2�u))1{	
I	sl trn cj*5.=6"5�8|=)�>6/qf7?�)�T!
(>1)�?-�;�";M�y ehsg(ڍ	�r�lQ�k 3
*>7�85*d�= **62:.7e+)t # >x8��7	 + f;	�
�,I��aes`MnKu�Bmwjc%:!fn�t+og x|�r(�b�`i2d) K	JOIl&�d � $�2�(P5�xf 8,gQkiLg-hiw!mvmeFce�(�.T�*$ �, #l0fa �*1!+�;e*��rmdurO$�*e�sAmf.gqsg/�qB�udcd *x,6d*6m$� H, c(%e.0*�,T � �**5$kcc3
Mu});
�*
 H%�* �D��W OF.U�m0- UQ�IVE @QUATIO$*
(**Opd�`Sg]v#adenBe: t�t Byd JicuN3e,
 *#+$boQ�@medt�20�2 ^�m2p Xi�hur	� * all�{i�hts  �{e�ned>
$j-�!2Re�`3vvi
uthe~ `n` �s}`,n@eOurf% c.j$ainAz�$�mrMs,�w)tl$g�'i�hgud ms`yvic�pyon$
 *5e`e"�UzeyD�%\ rrr�dm�)�h�p tkf&~�dlnWa�s(��nL	tinnS��p�)mcd-
 ?�
* Ree@sprib�t�nS gf(�=%�cgcgpd4%ust0udaa. DHm�bObm(cnpyri�h� j�t�cm, dxyq1lyst0Jf� *"�/�,idinNwa�o% t(c`tkH�og��o`d3#lq	|�.( � SuziqTzm"pp!m.r i�`�ih!6[ D#rm +wrtea:oucQ2�(�`ko�u�c�`QRi6mt j'tIb%�!T�+r i3uZ * o&,sO~ei\k�Fs a~g``�e fNtjUAnn(pi�Clahm%V on �he eoc�,dntat�ym(c.f�n�(mvhsz ma`evyIlc
�* ppov{d�e wm��tHd dibTtifuhy|.�
 *L �*)N%)p8d9�tjg$o��- o� tH�0��THgP!.nr)ph$"�cm�u4iBhpmn�Rhbstor^ �a�(b�,us%� ro0endoBre / yr $Zo�%uu%xzg$da4v�ee�i�ef(frgy`4H{w rgpuvD`e3i�m�u� {pecibh' pzi�r �|ktt�n(xerm�sskof�M� *
 �0UXM�3K�\�Z](I HR_^HDEE G[ EHE!�OP�LJD$`OLDMRS Y��%�MnTHAQtORS�*A� M!!I�D(A^I�j E�pP�wY O^ei/T^KeL&F RrANTIE[�4I��FO�G( BU� WGT�KImhXEL`TF�!�D�I}PiDe0IRVE^T�GS �N
�) ]MBS�AJ��L\ GH�FhTNIS @bxM2@A�KCE�RR�UR@_SE�FE�fAC�DSIhM@j E_ nO0��GN]SHAL� ^HE
�* �OP�BIgH�!.WES Z0CNF]_iB�ToRQ!E'L	SMU NORENY!F�EIT$�I�LIr-C�X*IL+�d�NDAd SrAn-�+>]M@LBrQ"(OR�Ck\ET�Mk�KQ^!DMQ�A h]NENQD	O,!bUT0\I@ L	T�M1v�,!P_[GERU�KNT /B@S�Ps�YVMtM	( jdG_kDS`gaUM�_	D DIRS�� SE,��ATF_V��REBI�V; JR�BV�JDS_ I�\E2VLXL�Z- X_VM\Mr C@G�(� *�AndO(alI(YI�ORH0G\!
YABiHITY< �HELE�iNCO^@Vaa�5�ST2-Fp(M@b!LITA,!Ov T/RT$,)GJ�UKG
�+ �dMIGEVae�o(K�H�rW�SP)0 RIcIF`M�2A^x(�y4oQR!O�DHt �G� oVpUd)S�OFT_A�F,$�vEN!IB"ADVJsGt�� ��N ThE��O�i��\�TA�W� c�QH E]M
 >5� 
5})<h�q�vz	;
-Bfwatin�(��( 5vef)~%d�9$SL)-� �ef�ufp�
�l)�f�?"f}ns4kKn(n+${�j
IZ�twv` Vh)s�puEum,fObdio~(+ {
M
	/5"wg`tu!cduman�
	vab %, ="f�t��v+/ prop{4� Y/8's�tio.�('tip6,b/ttg,,'xy�t&�#riGXv'\;	*	'+ Sgt$oatiojqYt�Z�oode } $*esgebD{.��TEcfd)a|/0o*oPt�oVq>�o�e�|<h'hid�;; ��S�t$Mo%
	~dp8|MbUcpin�98n>mft)��s.dyta+thgN |t"'dD2Pih�d#; ��0,dfau\| (avwcd9ol	

	i!)RAujqqV+X	dle�n�c|�:5Av$*el )t2�p`);#e�n{l/�!+�0)� [�vip� [hg-#		ter sr-tper �d.dfngcts.j2eatd�J�tpmr�el).C�S {oaq2v�/�z'xit�db�}m� /=$�r!ht� VvUtyga	Hf1r"se"�3+l(za`$A�o4�5`v-rpoc1�3)h?!#hciWpt'b�`'gIl�h�
	I�ar�disvaFcgd< *e)RecTion0?(&v�R6mcl�) 8g��ppev,�d-njV:) ; 7jq�iqr>`�T4hh�;*
}'�lOd'(�= bc�nw�+1trapqEV,ksS,6ev, +9 o, afu�
IK?+�.h}`ui�*
�~�r ]ni�!di.n$)z}�
		aoiIq�(mm_�ecM&=2}/Fe"<��GsHg7  da�"a�C� : 5;�
I	
/.!At�}�T$/�gxepqe@.I��ma|a C�emd|)o*&+du�a0in,%onpT�/ns.e`�i�k, g�Nct+.n%) {
Kiaf�e�de(=}�&xhde��al,ja�a(?${>hL`ee7��d�}rf�ctss�p�k�a(e|`xsop{,3$$/�FVUg4�*rE}n`eWsappe~�m|	;#�b R�v`e27
		�ifh/�c!�l�ack)$D.'a,}b`aC�cptly)E �2]M1�pev�`nt'-$^/$a|lbegk/�(		%l.l�}u�qg8(/G
i	�);*�
�}!;-{;*
}��jQu#R�!:���ftna�}fia%01behg)wmem($k	J&>ev&f�Tsl�vp�cE� �unceon/) {
	*tetqCl(v�i`.qume(bulct#onh)pk�

	+� Nreq|d�e`gm�btJ�tas"ed(= ,(thy�)$ po�$-(Y'u�skt+Ln'd'tkt�,'d��tom2)��m�<&�eo`�g];	/� Ret nptin~s
�ves:}e`a 9!$�gffm3Twwe}Y%te-�,%�nm{uI�n�&}/de �| �Ebfdgts);�-/Wu4umte	YvAr �i�eVTi�.0m$o.oqlo7*lmred�kn�L|"&50#)'n/(D%dal�$�)r'ctio�M	I6�{ t`3�dfcw=�C�}pd(~n�.d��tajkd \=�2!9"//PeVuw|�a�ms4ang%
	v!x4im�q�=1o.cXwiMo�/uym'c�p| 7: /'hD}f`ul�$� R~(0�oE��	31�)c`eg� =�j.��2`pHon�dt 2�t�!/�`Du`qmt spA}f$1dr �yu�k�-	i�"!(vxIw\jI$�/�dmwth-Ote() psnp�*p}Sh 'mpaSi�1'!:
~o!Aznjd tgu�ji�g0�t�a�i$t} 0r{fent clearpYpe�g�d PME#�ssuds(IE!KA	��	��$f*ust9�%/ef&�:Psx��Ue0en��pr[d[)$cl�W��<)'$+/�W!`@ # �low-�	��ubdtbpS,crb�eWraPver(EE)? +. W3ea`� �bitTeX
8(4ab Reg0=� L��ktiM = 'uPf$|<)l�pucDa/N ==d�d={jy<? �vmp' : Gmcfr#;�
	4qt0�ou`ln�=( bm�ectig� =<�' ' |\*direcT)In �? %lef7, �'Pos# *0/~ew�;M)�>Is Di�taf/e��&wxti/hgqs�E^cd h� (SDn�-w %tovw�?�elVo�tu�H$aG�|({{ARca*��zue}�(O 30: %l.o5tE�{ktt({masgin:DV5d})  3;)m` �mD� =- 'szo&) $l.Osbh'g�!ci1�=(p	(#aS,�af,(eOdio� 5 '�os' �%dIs>a^c%0z$d�stancu(!/o [hyF�(�	ag$ mo$- == ?iKls'	 �ysdat{g`9 `ks�ancm"/�(pi-5{ �(2!;<		(g0Mgde`)< f�ih'Y time==;
� /� MnHm1ta		-g (moFg =< �s(os.) { ?� W`ow Bo5ncq�	Miear(anhfata�f = �opaC)�yz20y> �	a~ymat)�.re$M � (mOT�o� 9]#&1Os�)? '/=7�:d7-=�! + dGs�pnce/
		QemfA/`i �e)aoiatiin,"{�e�l ) 0<#��puyO��.eas�ng	�	dhst"^bw"� di�Tan{e!n0vM�		dieE;/#;�	}s
If��`9vIf,i`} �(� 40uioeS3()��="{`/� BOena�s*K	vaq `i-aTmonq$= {=-@�iop|ooo:Ƚ�y};
	-	Bn�mAuI�f1�rpf] 5�(l?Ti�~19< 'ro2g ? 'M=&! !+=/-4�8�iwtajce3O)cliwiT)od2b2ejX�d(m�4hMn�--�#xKs'+�t#�=C,: --?') /;d)stp�qe{		)ed.a~imadA�c�imadXg.1. sqe�d#/$2,�o.gp4ion�.mqg�ow	<i�imapd(9�A-Cvin h 3d��d�/(< o�ox�imnsea')~f);		dysgi�c� =$(�ote / '�Ide''` dh�tq~bE8
"2 8 d)Sd�n�g8/"0�
=;�
y� *mOpe&�$'hkde�)!K$,/0LaRtBk���e.)feS$enImpti��$=0{k`u#i�q$ �;!�	e|)mAtion[�ev� � (I_Tm�f =: 7`/s'�= G-ua(�,&;='	0 �&dar�eocl�		q .Aoimst!animA�hGo,sptgd /!2�(o Gb�h�nb.eqCIng, f5nstynn()j݈!	el�HYle(i; /n.HhDa
)II	�.afeGqlw.rt3{o2o)eol rr�p3)`$gfneWP{�c��ve_wApp%R8el�;`�_(B�2tor�*E		id(o,caldP`c��*��oIllbib)'qpp�i�4(i3�0qroEo%v�p);�/(Cqllbkck
Y	};?*	y %l!e"kMYwrRTA.QMa`)nj! $ {{!A�jLav�oor`>1y|�		m.CM�t�/|1[rio_ =$(mdi.J�5=(%h3�= &-=��> g+<')`+ �){da�#g�I)inieae)m�3[se&�(=  ��$ilg =�`�pofa� /.5' 6'�=&(0; distncd:�)m�.a�9?!4a(Alima4jW�Q-8wd`Md0o 2-h�.[�d)ojs�dAsi_$8.�nmmmrI(en1M@6iO|"	"s4edd3, � M�l@tYoN�&gk�mn�,(�vnc4io�(){	i$gf�Eeps/eqt�Pe eX( t�ops!+�&uf&acts,`�mnv`Wb!tpdr(E();�#/ �es6oCm		�F(j#A(lpack  /ga�|baa(&apPyhuhisba�M�_u|hq�k"'"Cq|�#asj
 �H})9
I};Iel-sueue* d97, F5ncT�}j,%{ e�&dEqumuq(+� }):"	�ul*lUqueu@()/-*Hm9;.
}+
|)HhQ}eb�9;m
MJVqOce)��ja-�u|�eda+ef )2�=�>effmk5�.c4kr - vw&`lG�ho),kF
�	r�dern`thiSoau%}�(`ungtio.(-`�
		/ C��ada Emueg~v-	�fab u|�]0  dmw)(!prpc�="G#rosk4ioN,#v}@',�fg0uo-'$��)np,�zmGle'.&he`g�ve(gsatTH&}3�
K�/ [Eb@oPln�n�Yva� mode� (n%f�t�d#lwe~M/$ije�<0{"/�tio�s.m/dA`l|�'jad%�8(7/!Cdp Eote,	�~e�@digdhf� - oKPpy_.S6dirgk|hof�x!.6arthCbl'�// D%.Mu,l0dip&gv)jn
		+'�ADjuwt
	�$oefbAc�s,scG`h%l�pprm�Si� g,-Ql�w�)+�7�Sawa &0Shos	
	var w�%urer�= $tmffa#rw<crug`mW��per(el)��q[(^/WGrfl�s
?)MddAl%�)� / �Weat' W2ap�p
�v�2 AnI�ede ?�emS0]Fpa'Namu���!MM[' �j7�ester!�!5&9
v�f zdd ��-		sj{�:�(dqqectiln�=0'~gvti{a�&+ ?`��wl�$:"'7�lD(%,	�	)rnretkgn20,$�rectMO. =�ve2Uh�aJ?)l+d-6oW��: |efd/}��	vaz Fusta*�A"=08f)sew|imo�=< %�e�=}ka�%- �(�i|�dg.(iiw�p6K

 #kh-atu(idth !�
if(lod�a}=!&vhKvg) k �ny�%tu/cw�*ref.sajm<18)�1nimt�
ams)vn?qo2itmoo,0d)�<a�Cu!+�2	+ _�=$[zind

I{k�|akitaon	pa�%adkmat,{~ =(^y2
	 aN(-�vi�[r4d?s�rd] ?*moFU!<9('shog'`?0$�swA~sE : 4;
	�*nyia�ooNJ��f�toIt+gn�0!dmDe == �Ahoo� � 4A: �istafau`c �:
m/'`Dno�u|e	*evi-btg"a.qm`ye)y�il!tio~, � ]5e-%:4f�l�e< bypaconz�o.h5sa$qgh,$mac�N/: 6>g�tionz�g��ing, ckaplUw�; fenct!kN()"�	ad�aoLdd�=`'oI�u')%e,njudo��;�/' HMde�
4nm$fa#T{"rL��o�(eh8 tr�0s�; %.�vfeS`s�pemkvdyav�MZie+1 *'!Ves}}R-
	Ii�*o.s)lmbaak)!igQm|c`�{&`p`.k(e\S M,$ar�ume*0� +/!�al|jickJ	mt
d�qeAge(]x]j�	��)3�M�	]);�
}:�+!jQu�r�);�


�uni4i�1 , wnt'fknid )${ A
$�ef�!ct3>Drkp`u!junCu�gf�g)�k�
+;pe�V`n |hhw,quEee(nw�a�ij**=({J-(//BKreade4=�ema�T��	ve�`el � 0
$ii2-,�8dg 4,<'j�si�Yo~�."�kp'Sjttog,$lgfV�,'zIgKd'$g1ucjj8�]c�
-N!�%/ SU� Op6mon3
�va�]od$ = �.eOG%c�knsFrLoqE8e|<$o.�PtIons.hole || /hAee7ik"// Qet 	o�c-v�x0$irek|ioM < o./p��oN�>di~g`tjg{|| �laft'98o�Dena�d> D�pAcsmmN�J		/' AdJu�u-
		$.�bge�d�1cva#}�<!P�/�A);`ilnsx�d)(<'/ Sav�  [hmu
	,/efne�t3&Cr�c|%WriPPsR am);8>?!rutd"Uba pE{�	�vkz ven4�(�eibe��)ol=- up/�|= bIbe�dikj%-=�%d�vn"e +('to�' 8 ,Ldftg��
IvaT"ogti} =  `xroc\ag^$5='� / �^�eipecvkin�<5 79eft'	/&ots#az '~a�"��us�disu`ogu�8(�./PPio&{��@cpan'u ~ �B�f`9=2top'`/ %,.�}��r�ehgh�hkMa`o�n:tr�e]) �2$z Em.OuvurWip��(�ea�!kn:sbuemi 7 2�+�M9M� �=od!/= ��i�w+) dx/cww8&npf�itygl�!j#ss(sEf,0moplf =?5"@m�c� Di��a.S$  di���~R-9;)/ Xhy&v
	(	/� Q�ilqd)�}�
	+r�r a�i�`tiMl 9z{mraki$]* go�e:�?0�3�Ow'!$0 :`t9�*�`|hledkonK2ag](� move ml gqhnw�$�(uoth�~ n=`&�s' ?"##='!:�'%%'-�:`8moDmo� =<"7tns' ?�g='p2 '+�/!( + �ista�cg9M
	o/ �nim!v%N+lm/dexmiv�(a~m�e�ioj, [ 5eumz f`L#%/�d�rqD)N? .`uPe�qo.-,eyse.G: onop$}of5.�acin&,(�ompiE�g> eud3d�mn()�{3)	yg!M?���=`5Hi�U/!d�h.h-d)9{�/- X#�e @	�&>q�fe�~q.re&pmrohel trwpc!��,"fdEstv�ReioveGbq0Rer*w�#7$/�!SE3ugr�N�	hfhf�KqLl�ogj)"c!L|``wo`xp�(dxhs. u�otq`�d�,$o'0b�lt$ac{-J��	�L&durwe�E�)3%
	)|}	��
	m);
�;�N
u)h*Rue2y);*(�w.#dIFn*(u,"UNeef-n�N )�kJ
$.�ca�t.wPrloee#= f�l�io�o�4{�;	j�tuqn �h�S�}�ue*fyn��yon*� k�
J	Var0roub = o,nybH�f�.qyqK%g . iv���lw~&(Od�H>�u�phO.�r'moNWlqiecfs=i�:(�B6aF�cdddp � �'kTtion{*VIeCas$6 !�x9skuFd,M!v�.s�rd(o&kp|qgnw.qyd#�s)h: ws
��.kttio.S.modu =#o.�@bio�u+od� ?=htmgd�& ?& ,(t`iS�.Iw@':Fisikhe%- 7 /yi�d; $k1H�w7�8)}/m{�mm.s.�od�-
	var hl�< $.tjaq)*�jo7(9.�Sc�gfash"�liTy/�'�Idd�~)9:	7ar mhfsex0= }l.�rvri4*��	/+uAq4�a�t |ae`o!2gm�s - �/p f�~anq thu pr�bh�m�8E0&-�ofbqe�+�ph-y(xags/Knth�\/sS(3/`:g(n�mp&)�10) || �Jkfg�u|.mmf�(? y�qe�Btel.#�W(2�ar�ijHEf|.)�a39@x| 0;	v!r"e!|dj> Gd+o�4GzWidtts|e-7
�!f hWMfl�h%("|-out%r Dig�|,tvEe);I

�o� 6`r1i80{i5boes�i+3 x �%$=
�ns8v`p(j=0;�<ge&$23k+/ [ /o�|L�			mh�		.i�2o
-	[.kqpgn4\o"7baD�' �	)"wbCp('�fat=/�hp?')M��	�gR{
{-�pos�tho~ g)bso-7pu���		I96iryjiLa�y>0/ҁ3MblSk�n�n�> ,jb�3y|Thjbelds).�
		T�p;�,y*(hu�ghL/VdWc�+"�Y�	y)
I	>xa0en,)�Z	))&qddC|`cs('Wi-d�fektS�E���ofe'+�		*c{c(;		�)pnbaDo�n)!#a�Sn|5|d/,
)	�)	rm2�lo>%/ha��df'i	�		�	{hlxlz �id�`/ennS�		�h�iNju" `d)W(�/2ovs-M
		laFu:0nfjGkt.l�$t 0jj(wi`��/cu�ls' �8�k.fPxignc.lode %('rxo'�b xj__iwX��looz,ce�-U-6/)>(uy�vh/geldc-;!0)<		4`^ efnsS�,�oq2# ,;%hAichT-biWs))>0(noptkVns,�md��?! 'sh/7�	=`(i/Ja��FmOn2&pfws/2+).i(eiglt/pows :"q	�+	�PA{iT�:�m��pt�KNq,}�ae`�?"'s�Of'<?$0(: ;
+	A}/anih`ve8{
	%I�l@Ft3 ggf�evnl%f� +"k+(�in`@/ctn�#y�)%k�fprIovsN+Neh=}3&3h�w'07P  :j-Ma�h+vlokied�H3�s))klyid�(/cg�ls9(	�)	Ito0� b&wut.tnx0+ m* ha�Gx�'r7s)0+ ,o/pvi_o�|em`% == shbw/0?& :2(�-Laex6fl�_{i�fvw-j)	"(`ea�h|Oowzy8,��	)_pI`i�y2�^NO�tiOn[kodE =} 7Bhnw'+ � �20			},�k-lT��po~n"}l 50�);
}�(}]�
/} et$a��i�egu}+!t-��q~methe"cpnlb`Fk�arpr�x. vh�L46HaAk4Jd� az)m�0ignQ `�4g�finirh%dJ=se4Pymgmut(fu�#xinn,)23�M*i	o.optxn3.eme!(|50#Spov'�z#e,N�3s�; vM�ir�l!ty:�'fnbh2teW(y�0
$eh.os3y�ishbm|Ity:$%vmsi�le |)�yna,19		�jf(ncI,�dag�	 m.c�xlja�j.kpplxjgl Y+;�// S@��b��{�adl6diqqgu�();��I,*'eiv*vh=efnesps�ez�hot`%8,Rm�kQl)�;-	x,!o.ee�C>io�$|l2$009;��

}�;}:�*U�8kY5%R`)+
	
T�{tib~,� ,eo`GgmNenai{
7$.egGe�Ls.F`D� <0Fe~S�I�&,i(${A:dpu"�`l�q.1ue}	 ken�ti/n�!0{j		{a0@g|e- - $�thh3)(
Y9�m/�! ,p�kdff�cps.sDpLe`e|u)( o>oppiknp.mda ||l'�je�&=
		e,e�.�ni-apg(s"mxisyt� msdU1=) [
	��ue�d3 ga�ae�M��d}qAm�on8do�f�2!t
kjM
	Yeasmi�:�o/Oq6+k~s.eap)��-
�g�-p�`�e3 cu�sdiofh! k
�A	)I.cadlbD'* �!o�ci��ac).apply(pl�{� a�guiands()9J)�	�,m.DequemmhI;
�%
	Y�!�
U!3?J}-
*u-h�e=fsi{
��(Vun�dioj*d��4�lleG	~ae$	2{W*$,Qfb�gt{.nol �4&5n�i;/� o( }W��atur*�thIc.q5u�e(�yz�tio.m) �]	//!CrE�T5 e�eh�ntM
�w�r eH:< >(p
}c	+ �ro�;$=K'oSil�oZ'd%>lp6,jId�nm'=lep�&#bI�lv%];�	)/0dt`n�t�o~s
	*�er)-�me 5 dedfec${�~m4Ogde�<,)o.kt��f�.{oue l� 'hid�G);+� ��q Iof%	t�v`rxze1=�o�kQti-ns<�ije`n\@�5 -l dme�uhd0f�Dd"Vmz%		n!r %z):F)z�r �0!8#O/O0tXOnS$h�b�zArst�;(// EnSuRe�a!j�leqk v!l}�A	�Ar(4ujAv�ol�\`OFb%beUln.  o.du�aui?j ��0*!$,@Y.s0eets"�fefbu�v$ "{�

	, qwnu3p
	M$*��ec4s�catTelD pvnpq-; �L&�ik&(�+ ??0S#ve &�Sho5��	�cr$�b`pes= $=eff�#ds.cr�!taUpa�peZh!�+Nsss*;n6erDlo7:&�ifden&|); o;0�wee,g W�cp`er
		tEr,hJDhnh�t�� :}oe �$ gwh=w'(a!��<mrKrDizS�9;
		var ref = widthFirst ? ['width', 'height'] : ['height', 'width'];
		var distance = widthFirst ? [wrapper.width(), wrapper.height()] : [wrapper.height(), wrapper.width()];
		var percent = /([0-9]+)%/.exec(size);
		if(percent) size = parseInt(percent[1],10) / 100 * distance[mode == 'hide' ? 0 : 1];
		if(mode == 'show') wrapper.css(horizFirst ? {height: 0, width: size} : {height: size, width: 0}); // Shift

		// Animation
		var animation1 = {}, animation2 = {};
		animation1[ref[0]] = mode == 'show' ? distance[0] : size;
		animation2[ref[1]] = mode == 'show' ? distance[1] : 0;

		// Animate
		wrapper.animate(animation1, duration, o.options.easing)
		.animate(animation2, duration, o.options.easing, function() {
			if(mode == 'hide') el.hide(); // Hide
			$.effects.restore(el, props); $.effects.removeWrapper(el); // Restore
			if(o.callback) o.callback.apply(el[0], arguments); // Callback
			el.dequeue();
		});

	});

};

})(jQuery);

(function( $, undefined ) {

$.effects.highlight = function(o) {
	return this.queue(function() {
		var elem = $(this),
			props = ['backgroundImage', 'backgroundColor', 'opacity'],
			mode = $.effects.setMode(elem, o.options.mode || 'show'),
			animation = {
				backgroundColor: elem.css('backgroundColor')
			};

		if (mode == 'hide') {
			animation.opacity = 0;
		}

		$.effects.save(elem, props);
		elem
			.show()
			.css({
				backgroundImage: 'none',
				backgroundColor: o.options.color || '#ffff99'
			})
			.animate(animation, {
				queue: false,
				duration: o.duration,
				easing: o.options.easing,
				complete: function() {
					(mode == 'hide' && elem.hide());
					$.effects.restore(elem, props);
					(mode == 'show' && !$.support.opacity && this.style.removeAttribute('filter'));
					(o.callback && o.callback.apply(this, arguments));
					elem.dequeue();
				}
			});
	});
};

})(jQuery);

(function( $, undefined ) {

$.effects.pulsate = function(o) {
	return this.queue(function() {
		var elem = $(this),
			mode = $.effects.setMode(elem, o.options.mode || 'show'),
			times = ((o.options.times || 5) * 2) - 1,
			duration = o.duration ? o.duration / 2 : $.fx.speeds._default / 2,
			isVisible = elem.is(':visible'),
			animateTo = 0;

		if (!isVisible) {
			elem.css('opacity', 0).show();
			animateTo = 1;
		}

		if ((mode == 'hide' && isVisible) || (mode == 'show' && !isVisible)) {
			times--;
		}

		for (var i = 0; i < times; i++) {
			elem.animate({ opacity: animateTo }, duration, o.options.easing);
			animateTo = (animateTo + 1) % 2;
		}

		elem.animate({ opacity: animateTo }, duration, o.options.easing, function() {
			if (animateTo == 0) {
				elem.hide();
			}
			(o.callback && o.callback.apply(this, arguments));
		});

		elem
			.queue('fx', function() { elem.dequeue(); })
			.dequeue();
	});
};

})(jQuery);

(function( $, undefined ) {

$.effects.puff = function(o) {
	return this.queue(function() {
		var elem = $(this),
			mode = $.effects.setMode(elem, o.options.mode || 'hide'),
			percent = parseInt(o.options.percent, 10) || 150,
			factor = percent / 100,
			original = { height: elem.height(), width: elem.width() };

		$.extend(o.options, {
			fade: true,
			mode: mode,
			percent: mode == 'hide' ? percent : 100,
			from: mode == 'hide'
				? original
				: {
					height: original.height * factor,
					width: original.width * factor
				}
		});

		elem.effect('scale', o.options, o.duration, o.callback);
		elem.dequeue();
	});
};

$.effects.scale = function(o) {

	return this.queue(function() {

		// Create element
		var el = $(this);

		// Set options
		var options = $.extend(true, {}, o.options);
		var mode = $.effects.setMode(el, o.options.mode || 'effect'); // Set Mode
		var percent = parseInt(o.options.percent,10) || (parseInt(o.options.percent,10) == 0 ? 0 : (mode == 'hide' ? 0 : 100)); // Set default scaling percent
		var direction = o.options.direction || 'both'; // Set default axis
		var origin = o.options.origin; // The origin of the scaling
		if (mode != 'effect') { // Set default origin and restore for show/hide
			options.origin = origin || ['middle','center'];
			options.restore = true;
		}
		var original = {height: el.height(), width: el.width()}; // Save original
		el.from = o.options.from || (mode == 'show' ? {height: 0, width: 0} : original); // Default from state

		// Adjust
		var factor = { // Set scaling factor
			y: direction != 'horizontal' ? (percent / 100) : 1,
			x: direction != 'vertical' ? (percent / 100) : 1
		};
		el.to = {height: original.height * factor.y, width: original.width * factor.x}; // Set to state

		if (o.options.fade) { // Fade option to support puff
			if (mode == 'show') {el.from.opacity = 0; el.to.opacity = 1;};
			if (mode == 'hide') {el.from.opacity = 1; el.to.opacity = 0;};
		};

		// Animation
		options.from = el.from; options.to = el.to; options.mode = mode;

		// Animate
		el.effect('size', options, o.duration, o.callback);
		el.dequeue();
	});

};

$.effects.size = function(o) {

	return this.queue(function() {

		// Create element
		var el = $(this), props = ['position','top','bottom','left','right','width','height','overflow','opacity'];
		var props1 = ['position','top','bottom','left','right','overflow','opacity']; // Always restore
		var props2 = ['width','height','overflow']; // Copy for children
		var cProps = ['fontSize'];
		var vProps = ['borderTopWidth', 'borderBottomWidth', 'paddingTop', 'paddingBottom'];
		var hProps = ['borderLeftWidth', 'borderRightWidth', 'paddingLeft', 'paddingRight'];

		// Set options
		var mode = $.effects.setMode(el, o.options.mode || 'effect'); // Set Mode
		var restore = o.options.restore || false; // Default restore
		var scale = o.options.scale || 'both'; // Default scale mode
		var origin = o.options.origin; // The origin of the sizing
		var original = {height: el.height(), width: el.width()}; // Save original
		el.from = o.options.from || original; // Default from state
		el.to = o.options.to || original; // Default to state
		// Adjust
		if (origin) { // Calculate baseline shifts
			var baseline = $.effects.getBaseline(origin, original);
			el.from.top = (original.height - el.from.height) * baseline.y;
			el.from.left = (original.width - el.from.width) * baseline.x;
			el.to.top = (original.height - el.to.height) * baseline.y;
			el.to.left = (original.width - el.to.width) * baseline.x;
		};
		var factor = { // Set scaling factor
			from: {y: el.from.height / original.height, x: el.from.width / original.width},
			to: {y: el.to.height / original.height, x: el.to.width / original.width}
		};
		if (scale == 'box' || scale == 'both') { // Scale the css box
			if (factor.from.y != factor.to.y) { // Vertical props scaling
				props = props.concat(vProps);
				el.from = $.effects.setTransition(el, vProps, factor.from.y, el.from);
				el.to = $.effects.setTransition(el, vProps, factor.to.y, el.to);
			};
			if (factor.from.x != factor.to.x) { // Horizontal props scaling
				props = props.concat(hProps);
				el.from = $.effects.setTransition(el, hProps, factor.from.x, el.from);
				el.to = $.effects.setTransition(el, hProps, factor.to.x, el.to);
			};
		};
		if (scale == 'content' || scale == 'both') { // Scale the content
			if (factor.from.y != factor.to.y) { // Vertical props scaling
				props = props.concat(cProps);
				el.from = $.effects.setTransition(el, cProps, factor.from.y, el.from);
				el.to = $.effects.setTransition(el, cProps, factor.to.y, el.to);
			};
		};
		$.effects.save(el, restore ? props : props1); el.show(); // Save & Show
		$.effects.createWrapper(el); // Create Wrapper
		el.css('overflow','hidden').css(el.from); // Shift

		// Animate
		if (scale == 'content' || scale == 'both') { // Scale the children
			vProps = vProps.concat(['marginTop','marginBottom']).concat(cProps); // Add margins/font-size
			hProps = hProps.concat(['marginLeft','marginRight']); // Add margins
			props2 = props.concat(vProps).concat(hProps); // Concat
			el.find("*[width]").each(function(){
				var child = $(this);
				if (restore) $.effects.save(child, props2);
				var c_original = {height: child.height(), width: child.width()}; // Save original
				child.from = {height: c_original.height * factor.from.y, width: c_original.width * factor.from.x};
				child.to = {height: c_original.height * factor.to.y, width: c_original.width * factor.to.x};
				if (factor.from.y != factor.to.y) { // Vertical props scaling
					child.from = $.effects.setTransition(child, vProps, factor.from.y, child.from);
					child.to = $.effects.setTransition(child, vProps, factor.to.y, child.to);
				};
				if (factor.from.x != factor.to.x) { // Horizontal props scaling
					child.from = $.effects.setTransition(child, hProps, factor.from.x, child.from);
					child.to = $.effects.setTransition(child, hProps, factor.to.x, child.to);
				};
				child.css(child.from); // Shift children
				child.animate(child.to, o.duration, o.options.easing, function(){
					if (restore) $.effects.restore(child, props2); // Restore children
				}); // Animate children
			});
		};

		// Animate
		el.animate(el.to, { queue: false, duration: o.duration, easing: o.options.easing, complete: function() {
			if (el.to.opacity === 0) {
				el.css('opacity', el.from.opacity);
			}
			if(mode == 'hide') el.hide(); // Hide
			$.effects.restore(el, restore ? props : props1); $.effects.removeWrapper(el); // Restore
			if(o.callback) o.callback.apply(this, arguments); // Callback
			el.dequeue();
		}});

	});

};

})(jQuery);

(function( $, undefined ) {

$.effects.shake = function(o) {

	return this.queue(function() {

		// Create element
		var el = $(this), props = ['position','top','bottom','left','right'];

		// Set options
		var mode = $.effects.setMode(el, o.options.mode || 'effect'); // Set Mode
		var direction = o.options.direction || 'left'; // Default direction
		var distance = o.options.distance || 20; // Default distance
		var times = o.options.times || 3; // Default # of times
		var speed = o.duration || o.options.duration || 140; // Default speed per shake

		// Adjust
		$.effects.save(el, props); el.show(); // Save & Show
		$.effects.createWrapper(el); // Create Wrapper
		var ref = (direction == 'up' || direction == 'down') ? 'top' : 'left';
		var motion = (direction == 'up' || direction == 'left') ? 'pos' : 'neg';

		// Animation
		var animation = {}, animation1 = {}, animation2 = {};
		animation[ref] = (motion == 'pos' ? '-=' : '+=')  + distance;
		animation1[ref] = (motion == 'pos' ? '+=' : '-=')  + distance * 2;
		animation2[ref] = (motion == 'pos' ? '-=' : '+=')  + distance * 2;

		// Animate
		el.animate(animation, speed, o.options.easing);
		for (var i = 1; i < times; i++) { // Shakes
			el.animate(animation1, speed, o.options.easing).animate(animation2, speed, o.options.easing);
		};
		el.animate(animation1, speed, o.options.easing).
		animate(animation, speed / 2, o.options.easing, function(){ // Last shake
			$.effects.restore(el, props); $.effects.removeWrapper(el); // Restore
			if(o.callback) o.callback.apply(this, arguments); // Callback
		});
		el.queue('fx', function() { el.dequeue(); });
		el.dequeue();
	});

};

})(jQuery);

(function( $, undefined ) {

$.effects.slide = function(o) {

	return this.queue(function() {

		// Create element
		var el = $(this), props = ['position','top','bottom','left','right'];

		// Set options
		var mode = $.effects.setMode(el, o.options.mode || 'show'); // Set Mode
		var direction = o.options.direction || 'left'; // Default Direction

		// Adjust
		$.effects.save(el, props); el.show(); // Save & Show
		$.effects.createWrapper(el).css({overflow:'hidden'}); // Create Wrapper
		var ref = (direction == 'up' || direction == 'down') ? 'top' : 'left';
		var motion = (direction == 'up' || direction == 'left') ? 'pos' : 'neg';
		var distance = o.options.distance || (ref == 'top' ? el.outerHeight({margin:true}) : el.outerWidth({margin:true}));
		if (mode == 'show') el.css(ref, motion == 'pos' ? (isNaN(distance) ? "-" + distance : -distance) : distance); // Shift

		// Animation
		var animation = {};
		animation[ref] = (mode == 'show' ? (motion == 'pos' ? '+=' : '-=') : (motion == 'pos' ? '-=' : '+=')) + distance;

		// Animate
		el.animate(animation, { queue: false, duration: o.duration, easing: o.options.easing, complete: function() {
			if(mode == 'hide') el.hide(); // Hide
			$.effects.restore(el, props); $.effects.removeWrapper(el); // Restore
			if(o.callback) o.callback.apply(this, arguments); // Callback
			el.dequeue();
		}});

	});

};

})(jQuery);

(function( $, undefined ) {

$.effects.transfer = function(o) {
	return this.queue(function() {
		var elem = $(this),
			target = $(o.options.to),
			endPosition = target.offset(),
			animation = {
				top: endPosition.top,
				left: endPosition.left,
				height: target.innerHeight(),
				width: target.innerWidth()
			},
			startPosition = elem.offset(),
			transfer = $('<div class="ui-effects-transfer"></div>')
				.appendTo(document.body)
				.addClass(o.options.className)
				.css({
					top: startPosition.top,
					left: startPosition.left,
					height: elem.innerHeight(),
					width: elem.innerWidth(),
					position: 'absolute'
				})
				.animate(animation, o.duration, o.options.easing, function() {
					transfer.remove();
					(o.callback && o.callback.apply(elem[0], arguments));
					elem.dequeue();
				});
	});
};

})(jQuery);

(function( $, undefined ) {

$.widget( "ui.accordion", {
	options: {
		active: 0,
		animated: "slide",
		autoHeight: true,
		clearStyle: false,
		collapsible: false,
		event: "click",
		fillSpace: false,
		header: "> li > :first-child,> :not(li):even",
		icons: {
			header: "ui-icon-triangle-1-e",
			headerSelected: "ui-icon-triangle-1-s"
		},
		navigation: false,
		navigationFilter: function() {
			return this.href.toLowerCase() === location.href.toLowerCase();
		}
	},

	_create: function() {
		var self = this,
			options = self.options;

		self.running = 0;

		self.element
			.addClass( "ui-accordion ui-widget ui-helper-reset" )
			// in lack of child-selectors in CSS
			// we need to mark top-LIs in a UL-accordion for some IE-fix
			.children( "li" )
				.addClass( "ui-accordion-li-fix" );

		self.headers = self.element.find( options.header )
			.addClass( "ui-accordion-header ui-helper-reset ui-state-default ui-corner-all" )
			.bind( "mouseenter.accordion", function() {
				if ( options.disabled ) {
					return;
				}
				$( this ).addClass( "ui-state-hover" );
			})
			.bind( "mouseleave.accordion", function() {
				if ( options.disabled ) {
					return;
				}
				$( this ).removeClass( "ui-state-hover" );
			})
			.bind( "focus.accordion", function() {
				if ( options.disabled ) {
					return;
				}
				$( this ).addClass( "ui-state-focus" );
			})
			.bind( "blur.accordion", function() {
				if ( options.disabled ) {
					return;
				}
				$( this ).removeClass( "ui-state-focus" );
			});

		self.headers.next()
			.addClass( "ui-accordion-content ui-helper-reset ui-widget-content ui-corner-bottom" );

		if ( options.navigation ) {
			var current = self.element.find( "a" ).filter( options.navigationFilter ).eq( 0 );
			if ( current.length ) {
				var header = current.closest( ".ui-accordion-header" );
				if ( header.length ) {
					// anchor within header
					self.active = header;
				} else {
					// anchor within content
					self.active = current.closest( ".ui-accordion-content" ).prev();
				}
			}
		}

		self.active = self._findActive( self.active || options.active )
			.addClass( "ui-state-default ui-state-active" )
			.toggleClass( "ui-corner-all" )
			.toggleClass( "ui-corner-top" );
		self.active.next().addClass( "ui-accordion-content-active" );

		self._createIcons();
		self.resize();
		
		// ARIA
		self.element.attr( "role", "tablist" );

		self.headers
			.attr( "role", "tab" )
			.bind( "keydown.accordion", function( event ) {
				return self._keydown( event );
			})
			.next()
				.attr( "role", "tabpanel" );

		self.headers
			.not( self.active || "" )
			.attr({
				"aria-expanded": "false",
				"aria-selected": "false",
				tabIndex: -1
			})
			.next()
				.hide();

		// make sure at least one header is in the tab order
		if ( !self.active.length ) {
			self.headers.eq( 0 ).attr( "tabIndex", 0 );
		} else {
			self.active
				.attr({
					"aria-expanded": "true",
					"aria-selected": "true",
					tabIndex: 0
				});
		}

		// only need links in tab order for Safari
		if ( !$.browser.safari ) {
			self.headers.find( "a" ).attr( "tabIndex", -1 );
		}

		if ( options.event ) {
			self.headers.bind( options.event.split(" ").join(".accordion ") + ".accordion", function(event) {
				self._clickHandler.call( self, event, this );
				event.preventDefault();
			});
		}
	},

	_createIcons: function() {
		var options = this.options;
		if ( options.icons ) {
			$( "<span></span>" )
				.addClass( "ui-icon " + options.icons.header )
				.prependTo( this.headers );
			this.active.children( ".ui-icon" )
				.toggleClass(options.icons.header)
				.toggleClass(options.icons.headerSelected);
			this.element.addClass( "ui-accordion-icons" );
		}
	},

	_destroyIcons: function() {
		this.headers.children( ".ui-icon" ).remove();
		this.element.removeClass( "ui-accordion-icons" );
	},

	destroy: function() {
		var options = this.options;

		this.element
			.removeClass( "ui-accordion ui-widget ui-helper-reset" )
			.removeAttr( "role" );

		this.headers
			.unbind( ".accordion" )
			.removeClass( "ui-accordion-header ui-accordion-disabled ui-helper-reset ui-state-default ui-corner-all ui-state-active ui-state-disabled ui-corner-top" )
			.removeAttr( "role" )
			.removeAttr( "aria-expanded" )
			.removeAttr( "aria-selected" )
			.removeAttr( "tabIndex" );

		this.headers.find( "a" ).removeAttr( "tabIndex" );
		this._destroyIcons();
		var contents = this.headers.next()
			.css( "display", "" )
			.removeAttr( "role" )
			.removeClass( "ui-helper-reset ui-widget-content ui-corner-bottom ui-accordion-content ui-accordion-content-active ui-accordion-disabled ui-state-disabled" );
		if ( options.autoHeight || options.fillHeight ) {
			contents.css( "height", "" );
		}

		return $.Widget.prototype.destroy.call( this );
	},

	_setOption: function( key, value ) {
		$.Widget.prototype._setOption.apply( this, arguments );
			
		if ( key == "active" ) {
			this.activate( value );
		}
		if ( key == "icons" ) {
			this._destroyIcons();
			if ( value ) {
				this._createIcons();
			}
		}
		// #5332 - opacity doesn't cascade to positioned elements in IE
		// so we need to add the disabled class to the headers and panels
		if ( key == "disabled" ) {
			this.headers.add(this.headers.next())
				[ value ? "addClass" : "removeClass" ](
					"ui-accordion-disabled ui-state-disabled" );
		}
	},

	_keydown: function( event ) {
		if ( this.options.disabled || event.altKey || event.ctrlKey ) {
			return;
		}

		var keyCode = $.ui.keyCode,
			length = this.headers.length,
			currentIndex = this.headers.index( event.target ),
			toFocus = false;

		switch ( event.keyCode ) {
			case keyCode.RIGHT:
			case keyCode.DOWN:
				toFocus = this.headers[ ( currentIndex + 1 ) % length ];
				break;
			case keyCode.LEFT:
			case keyCode.UP:
				toFocus = this.headers[ ( currentIndex - 1 + length ) % length ];
				break;
			case keyCode.SPACE:
			case keyCode.ENTER:
				this._clickHandler( { target: event.target }, event.target );
				event.preventDefault();
		}

		if ( toFocus ) {
			$( event.target ).attr( "tabIndex", -1 );
			$( toFocus ).attr( "tabIndex", 0 );
			toFocus.focus();
			return false;
		}

		return true;
	},

	resize: function() {
		var options = this.options,
			maxHeight;

		if ( options.fillSpace ) {
			if ( $.browser.msie ) {
				var defOverflow = this.element.parent().css( "overflow" );
				this.element.parent().css( "overflow", "hidden");
			}
			maxHeight = this.element.parent().height();
			if ($.browser.msie) {
				this.element.parent().css( "overflow", defOverflow );
			}

			this.headers.each(function() {
				maxHeight -= $( this ).outerHeight( true );
			});

			this.headers.next()
				.each(function() {
					$( this ).height( Math.max( 0, maxHeight -
						$( this ).innerHeight() + $( this ).height() ) );
				})
				.css( "overflow", "auto" );
		} else if ( options.autoHeight ) {
			maxHeight = 0;
			this.headers.next()
				.each(function() {
					maxHeight = Math.max( maxHeight, $( this ).height( "" ).height() );
				})
				.height( maxHeight );
		}

		return this;
	},

	activate: function( index ) {
		// TODO this gets called on init, changing the option without an explicit call for that
		this.options.active = index;
		// call clickHandler with custom event
		var active = this._findActive( index )[ 0 ];
		this._clickHandler( { target: active }, active );

		return this;
	},

	_findActive: function( selector ) {
		return selector
			? typeof selector === "number"
				? this.headers.filter( ":eq(" + selector + ")" )
				: this.headers.not( this.headers.not( selector ) )
			: selector === false
				? $( [] )
				: this.headers.filter( ":eq(0)" );
	},

	// TODO isn't event.target enough? why the separate target argument?
	_clickHandler: function( event, target ) {
		var options = this.options;
		if ( options.disabled ) {
			return;
		}

		// called only when using activate(false) to close all parts programmatically
		if ( !event.target ) {
			if ( !options.collapsible ) {
				return;
			}
			this.active
				.removeClass( "ui-state-active ui-corner-top" )
				.addClass( "ui-state-default ui-corner-all" )
				.children( ".ui-icon" )
					.removeClass( options.icons.headerSelected )
					.addClass( options.icons.header );
			this.active.next().addClass( "ui-accordion-content-active" );
			var toHide = this.active.next(),
				data = {
					options: options,
					newHeader: $( [] ),
					oldHeader: options.active,
					newContent: $( [] ),
					oldContent: toHide
				},
				toShow = ( this.active = $( [] ) );
			this._toggle( toShow, toHide, data );
			return;
		}

		// get the click target
		var clicked = $( event.currentTarget || target ),
			clickedIsActive = clicked[0] === this.active[0];

		// TODO the option is changed, is that correct?
		// TODO if it is correct, shouldn't that happen after determining that the click is valid?
		options.active = options.collapsible && clickedIsActive ?
			false :
			this.headers.index( clicked );

		// if animations are still active, or the active header is the target, ignore click
		if ( this.running || ( !options.collapsible && clickedIsActive ) ) {
			return;
		}

		// find elements to show and hide
		var active = this.active,
			toShow = clicked.next(),
			toHide = this.active.next(),
			data = {
				options: options,
				newHeader: clickedIsActive && options.collapsible ? $([]) : clicked,
				oldHeader: this.active,
				newContent: clickedIsActive && options.collapsible ? $([]) : toShow,
				oldContent: toHide
			},
			down = this.headers.index( this.active[0] ) > this.headers.index( clicked[0] );

		// when the call to ._toggle() comes after the class changes
		// it causes a very odd bug in IE 8 (see #6720)
		this.active = clickedIsActive ? $([]) : clicked;
		this._toggle( toShow, toHide, data, clickedIsActive, down );

		// switch classes
		active
			.removeClass( "ui-state-active ui-corner-top" )
			.addClass( "ui-state-default ui-corner-all" )
			.children( ".ui-icon" )
				.removeClass( options.icons.headerSelected )
				.addClass( options.icons.header );
		if ( !clickedIsActive ) {
			clicked
				.removeClass( "ui-state-default ui-corner-all" )
				.addClass( "ui-state-active ui-corner-top" )
				.children( ".ui-icon" )
					.removeClass( options.icons.header )
					.addClass( options.icons.headerSelected );
			clicked
				.next()
				.addClass( "ui-accordion-content-active" );
		}

		return;
	},

	_toggle: function( toShow, toHide, data, clickedIsActive, down ) {
		var self = this,
			options = self.options;

		self.toShow = toShow;
		self.toHide = toHide;
		self.data = data;

		var complete = function() {
			if ( !self ) {
				return;
			}
			return self._completed.apply( self, arguments );
		};

		// trigger changestart event
		self._trigger( "changestart", null, self.data );

		// count elements to animate
		self.running = toHide.size() === 0 ? toShow.size() : toHide.size();

		if ( options.animated ) {
			var animOptions = {};

			if ( options.collapsible && clickedIsActive ) {
				animOptions = {
					toShow: $( [] ),
					toHide: toHide,
					complete: complete,
					down: down,
					autoHeight: options.autoHeight || options.fillSpace
				};
			} else {
				animOptions = {
					toShow: toShow,
					toHide: toHide,
					complete: complete,
					down: down,
					autoHeight: options.autoHeight || options.fillSpace
				};
			}

			if ( !options.proxied ) {
				options.proxied = options.animated;
			}

			if ( !options.proxiedDuration ) {
				options.proxiedDuration = options.duration;
			}

			options.animated = $.isFunction( options.proxied ) ?
				options.proxied( animOptions ) :
				options.proxied;

			options.duration = $.isFunction( options.proxiedDuration ) ?
				options.proxiedDuration( animOptions ) :
				options.proxiedDuration;

			var animations = $.ui.accordion.animations,
				duration = options.duration,
				easing = options.animated;

			if ( easing && !animations[ easing ] && !$.easing[ easing ] ) {
				easing = "slide";
			}
			if ( !animations[ easing ] ) {
				animations[ easing ] = function( options ) {
					this.slide( options, {
						easing: easing,
						duration: duration || 700
					});
				};
			}

			animations[ easing ]( animOptions );
		} else {
			if ( options.collapsible && clickedIsActive ) {
				toShow.toggle();
			} else {
				toHide.hide();
				toShow.show();
			}

			complete( true );
		}

		// TODO assert that the blur and focus triggers are really necessary, remove otherwise
		toHide.prev()
			.attr({
				"aria-expanded": "false",
				"aria-selected": "false",
				tabIndex: -1
			})
			.blur();
		toShow.prev()
			.attr({
				"aria-expanded": "true",
				"aria-selected": "true",
				tabIndex: 0
			})
			.focus();
	},

	_completed: function( cancel ) {
		this.running = cancel ? 0 : --this.running;
		if ( this.running ) {
			return;
		}

		if ( this.options.clearStyle ) {
			this.toShow.add( this.toHide ).css({
				height: "",
				overflow: ""
			});
		}

		// other classes are removed before the animation; this one needs to stay until completed
		this.toHide.removeClass( "ui-accordion-content-active" );
		// Work around for rendering bug in IE (#5421)
		if ( this.toHide.length ) {
			this.toHide.parent()[0].className = this.toHide.parent()[0].className;
		}

		this._trigger( "change", null, this.data );
	}
});

$.extend( $.ui.accordion, {
	version: "1.8.20",
	animations: {
		slide: function( options, additions ) {
			options = $.extend({
				easing: "swing",
				duration: 300
			}, options, additions );
			if ( !options.toHide.size() ) {
				options.toShow.animate({
					height: "show",
					paddingTop: "show",
					paddingBottom: "show"
				}, options );
				return;
			}
			if ( !options.toShow.size() ) {
				options.toHide.animate({
					height: "hide",
					paddingTop: "hide",
					paddingBottom: "hide"
				}, options );
				return;
			}
			var overflow = options.toShow.css( "overflow" ),
				percentDone = 0,
				showProps = {},
				hideProps = {},
				fxAttrs = [ "height", "paddingTop", "paddingBottom" ],
				originalWidth;
			// fix width before calculating height of hidden element
			var s = options.toShow;
			originalWidth = s[0].style.width;
			s.width( s.parent().width()
				- parseFloat( s.css( "paddingLeft" ) )
				- parseFloat( s.css( "paddingRight" ) )
				- ( parseFloat( s.css( "borderLeftWidth" ) ) || 0 )
				- ( parseFloat( s.css( "borderRightWidth" ) ) || 0 ) );

			$.each( fxAttrs, function( i, prop ) {
				hideProps[ prop ] = "hide";

				var parts = ( "" + $.css( options.toShow[0], prop ) ).match( /^([\d+-.]+)(.*)$/ );
				showProps[ prop ] = {
					value: parts[ 1 ],
					unit: parts[ 2 ] || "px"
				};
			});
			options.toShow.css({ height: 0, overflow: "hidden" }).show();
			options.toHide
				.filter( ":hidden" )
					.each( options.complete )
				.end()
				.filter( ":visible" )
				.animate( hideProps, {
				step: function( now, settings ) {
					// only calculate the percent when animating height
					// IE gets very inconsistent results when animating elements
					// with small values, which is common for padding
					if ( settings.prop == "height" ) {
						percentDone = ( settings.end - settings.start === 0 ) ? 0 :
							( settings.now - settings.start ) / ( settings.end - settings.start );
					}

					options.toShow[ 0 ].style[ settings.prop ] =
						( percentDone * showProps[ settings.prop ].value )
						+ showProps[ settings.prop ].unit;
				},
				duration: options.duration,
				easing: options.easing,
				complete: function() {
					if ( !options.autoHeight ) {
						options.toShow.css( "height", "" );
					}
					options.toShow.css({
						width: originalWidth,
						overflow: overflow
					});
					options.complete();
				}
			});
		},
		bounceslide: function( options ) {
			this.slide( options, {
				easing: options.down ? "easeOutBounce" : "swing",
				duration: options.down ? 1000 : 200
			});
		}
	}
});

})( jQuery );

(function( $, undefined ) {

// used to prevent race conditions with remote data sources
var requestIndex = 0;

$.widget( "ui.autocomplete", {
	options: {
		appendTo: "body",
		autoFocus: false,
		delay: 300,
		minLength: 1,
		position: {
			my: "left top",
			at: "left bottom",
			collision: "none"
		},
		source: null
	},

	pending: 0,

	_create: function() {
		var self = this,
			doc = this.element[ 0 ].ownerDocument,
			suppressKeyPress;
		this.isMultiLine = this.element.is( "textarea" );

		this.element
			.addClass( "ui-autocomplete-input" )
			.attr( "autocomplete", "off" )
			// TODO verify these actually work as intended
			.attr({
				role: "textbox",
				"aria-autocomplete": "list",
				"aria-haspopup": "true"
			})
			.bind( "keydown.autocomplete", function( event ) {
				if ( self.options.disabled || self.element.propAttr( "readOnly" ) ) {
					return;
				}

				suppressKeyPress = false;
				var keyCode = $.ui.keyCode;
				switch( event.keyCode ) {
				case keyCode.PAGE_UP:
					self._move( "previousPage", event );
					break;
				case keyCode.PAGE_DOWN:
					self._move( "nextPage", event );
					break;
				case keyCode.UP:
					self._keyEvent( "previous", event );
					break;
				case keyCode.DOWN:
					self._keyEvent( "next", event );
					break;
				case keyCode.ENTER:
				case keyCode.NUMPAD_ENTER:
					// when menu is open and has focus
					if ( self.menu.active ) {
						// #6055 - Opera still allows the keypress to occur
						// which causes forms to submit
						suppressKeyPress = true;
						event.preventDefault();
					}
					//passthrough - ENTER and TAB both select the current element
				case keyCode.TAB:
					if ( !self.menu.active ) {
						return;
					}
					self.menu.select( event );
					break;
				case keyCode.ESCAPE:
					self.element.val( self.term );
					self.close( event );
					break;
				default:
					// keypress is triggered before the input value is changed
					clearTimeout( self.searching );
					self.searching = setTimeout(function() {
						// only search if the value has changed
						if ( self.term != self.element.val() ) {
							self.selectedItem = null;
							self.search( null, event );
						}
					}, self.options.delay );
					break;
				}
			})
			.bind( "keypress.autocomplete", function( event ) {
				if ( suppressKeyPress ) {
					suppressKeyPress = false;
					event.preventDefault();
				}
			})
			.bind( "focus.autocomplete", function() {
				if ( self.options.disabled ) {
					return;
				}

				self.selectedItem = null;
				self.previous = self.element.val();
			})
			.bind( "blur.autocomplete", function( event ) {
				if ( self.options.disabled ) {
					return;
				}

				clearTimeout( self.searching );
				// clicks on the menu (or a button to trigger a search) will cause a blur event
				self.closing = setTimeout(function() {
					self.close( event );
					self._change( event );
				}, 150 );
			});
		this._initSource();
		this.menu = $( "<ul></ul>" )
			.addClass( "ui-autocomplete" )
			.appendTo( $( this.options.appendTo || "body", doc )[0] )
			// prevent the close-on-blur in case of a "slow" click on the menu (long mousedown)
			.mousedown(function( event ) {
				// clicking on the scrollbar causes focus to shift to the body
				// but we can't detect a mouseup or a click immediately afterward
				// so we have to track the next mousedown and close the menu if
				// the user clicks somewhere outside of the autocomplete
				var menuElement = self.menu.element[ 0 ];
				if ( !$( event.target ).closest( ".ui-menu-item" ).length ) {
					setTimeout(function() {
						$( document ).one( 'mousedown', function( event ) {
							if ( event.target !== self.element[ 0 ] &&
								event.target !== menuElement &&
								!$.ui.contains( menuElement, event.target ) ) {
								self.close();
							}
						});
					}, 1 );
				}

				// use another timeout to make sure the blur-event-handler on the input was already triggered
				setTimeout(function() {
					clearTimeout( self.closing );
				}, 13);
			})
			.menu({
				focus: function( event, ui ) {
					var item = ui.item.data( "item.autocomplete" );
					if ( false !== self._trigger( "focus", event, { item: item } ) ) {
						// use value to match what will end up in the input, if it was a key event
						if ( /^key/.test(event.originalEvent.type) ) {
							self.element.val( item.value );
						}
					}
				},
				selected: function( event, ui ) {
					var item = ui.item.data( "item.autocomplete" ),
						previous = self.previous;

					// only trigger when focus was lost (click on menu)
					if ( self.element[0] !== doc.activeElement ) {
						self.element.focus();
						self.previous = previous;
						// #6109 - IE triggers two focus events and the second
						// is asynchronous, so we need to reset the previous
						// term synchronously and asynchronously :-(
						setTimeout(function() {
							self.previous = previous;
							self.selectedItem = item;
						}, 1);
					}

					if ( false !== self._trigger( "select", event, { item: item } ) ) {
						self.element.val( item.value );
					}
					// reset the term after the select event
					// this allows custom select handling to work properly
					self.term = self.element.val();

					self.close( event );
					self.selectedItem = item;
				},
				blur: function( event, ui ) {
					// don't set the value of the text field if it's already correct
					// this prevents moving the cursor unnecessarily
					if ( self.menu.element.is(":visible") &&
						( self.element.val() !== self.term ) ) {
						self.element.val( self.term );
					}
				}
			})
			.zIndex( this.element.zIndex() + 1 )
			// workaround for jQuery bug #5781 http://dev.jquery.com/ticket/5781
			.css({ top: 0, left: 0 })
			.hide()
			.data( "menu" );
		if ( $.fn.bgiframe ) {
			 this.menu.element.bgiframe();
		}
		// turning off autocomplete prevents the browser from remembering the
		// value when navigating through history, so we re-enable autocomplete
		// if the page is unloaded before the widget is destroyed. #7790
		self.beforeunloadHandler = function() {
			self.element.removeAttr( "autocomplete" );
		};
		$( window ).bind( "beforeunload", self.beforeunloadHandler );
	},

	destroy: function() {
		this.element
			.removeClass( "ui-autocomplete-input" )
			.removeAttr( "autocomplete" )
			.removeAttr( "role" )
			.removeAttr( "aria-autocomplete" )
			.removeAttr( "aria-haspopup" );
		this.menu.element.remove();
		$( window ).unbind( "beforeunload", this.beforeunloadHandler );
		$.Widget.prototype.destroy.call( this );
	},

	_setOption: function( key, value ) {
		$.Widget.prototype._setOption.apply( this, arguments );
		if ( key === "source" ) {
			this._initSource();
		}
		if ( key === "appendTo" ) {
			this.menu.element.appendTo( $( value || "body", this.element[0].ownerDocument )[0] )
		}
		if ( key === "disabled" && value && this.xhr ) {
			this.xhr.abort();
		}
	},

	_initSource: function() {
		var self = this,
			array,
			url;
		if ( $.isArray(this.options.source) ) {
			array = this.options.source;
			this.source = function( request, response ) {
				response( $.ui.autocomplete.filter(array, request.term) );
			};
		} else if ( typeof this.options.source === "string" ) {
			url = this.options.source;
			this.source = function( request, response ) {
				if ( self.xhr ) {
					self.xhr.abort();
				}
				self.xhr = $.ajax({
					url: url,
					data: request,
					dataType: "json",
					success: function( data, status ) {
						response( data );
					},
					error: function() {
						response( [] );
					}
				});
			};
		} else {
			this.source = this.options.source;
		}
	},

	search: function( value, event ) {
		value = value != null ? value : this.element.val();

		// always save the actual value, not the one passed as an argument
		this.term = this.element.val();

		if ( value.length < this.options.minLength ) {
			return this.close( event );
		}

		clearTimeout( this.closing );
		if ( this._trigger( "search", event ) === false ) {
			return;
		}

		return this._search( value );
	},

	_search: function( value ) {
		this.pending++;
		this.element.addClass( "ui-autocomplete-loading" );

		this.source( { term: value }, this._response() );
	},

	_response: function() {
		var that = this,
			index = ++requestIndex;

		return function( content ) {
			if ( index === requestIndex ) {
				that.__response( content );
			}

			that.pending--;
			if ( !that.pending ) {
				that.element.removeClass( "ui-autocomplete-loading" );
			}
		};
	},

	__response: function( content ) {
		if ( !this.options.disabled && content && content.length ) {
			content = this._normalize( content );
			this._suggest( content );
			this._trigger( "open" );
		} else {
			this.close();
		}
	},

	close: function( event ) {
		clearTimeout( this.closing );
		if ( this.menu.element.is(":visible") ) {
			this.menu.element.hide();
			this.menu.deactivate();
			this._trigger( "close", event );
		}
	},
	
	_change: function( event ) {
		if ( this.previous !== this.element.val() ) {
			this._trigger( "change", event, { item: this.selectedItem } );
		}
	},

	_normalize: function( items ) {
		// assume all items have the right format when the first item is complete
		if ( items.length && items[0].label && items[0].value ) {
			return items;
		}
		return $.map( items, function(item) {
			if ( typeof item === "string" ) {
				return {
					label: item,
					value: item
				};
			}
			return $.extend({
				label: item.label || item.value,
				value: item.value || item.label
			}, item );
		});
	},

	_suggest: function( items ) {
		var ul = this.menu.element
			.empty()
			.zIndex( this.element.zIndex() + 1 );
		this._renderMenu( ul, items );
		// TODO refresh should check if the active item is still in the dom, removing the need for a manual deactivate
		this.menu.deactivate();
		this.menu.refresh();

		// size and position menu
		ul.show();
		this._resizeMenu();
		ul.position( $.extend({
			of: this.element
		}, this.options.position ));

		if ( this.options.autoFocus ) {
			this.menu.next( new $.Event("mouseover") );
		}
	},

	_resizeMenu: function() {
		var ul = this.menu.element;
		ul.outerWidth( Math.max(
			// Firefox wraps long text (possibly a rounding bug)
			// so we add 1px to avoid the wrapping (#7513)
			ul.width( "" ).outerWidth() + 1,
			this.element.outerWidth()
		) );
	},

	_renderMenu: function( ul, items ) {
		var self = this;
		$.each( items, function( index, item ) {
			self._renderItem( ul, item );
		});
	},

	_renderItem: function( ul, item) {
		return $( "<li></li>" )
			.data( "item.autocomplete", item )
			.append( $( "<a></a>" ).text( item.label ) )
			.appendTo( ul );
	},

	_move: function( direction, event ) {
		if ( !this.menu.element.is(":visible") ) {
			this.search( null, event );
			return;
		}
		if ( this.menu.first() && /^previous/.test(direction) ||
				this.menu.last() && /^next/.test(direction) ) {
			this.element.val( this.term );
			this.menu.deactivate();
			return;
		}
		this.menu[ direction ]( event );
	},

	widget: function() {
		return this.menu.element;
	},
	_keyEvent: function( keyEvent, event ) {
		if ( !this.isMultiLine || this.menu.element.is( ":visible" ) ) {
			this._move( keyEvent, event );

			// prevents moving cursor to beginning/end of the text field in some browsers
			event.preventDefault();
		}
	}
});

$.extend( $.ui.autocomplete, {
	escapeRegex: function( value ) {
		return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
	},
	filter: function(array, term) {
		var matcher = new RegExp( $.ui.autocomplete.escapeRegex(term), "i" );
		return $.grep( array, function(value) {
			return matcher.test( value.label || value.value || value );
		});
	}
});

}( jQuery ));

/*
 * jQuery UI Menu (not officially released)
 * 
 * This widget isn't yet finished and the API is subject to change. We plan to finish
 * it for the next release. You're welcome to give it a try anyway and give us feedback,
 * as long as you're okay with migrating your code later on. We can help with that, too.
 *
 * Copyright 2010, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Menu
 *
 * Depends:
 *	jquery.ui.core.js
 *  jquery.ui.widget.js
 */
(function($) {

$.widget("ui.menu", {
	_create: function() {
		var self = this;
		this.element
			.addClass("ui-menu ui-widget ui-widget-content ui-corner-all")
			.attr({
				role: "listbox",
				"aria-activedescendant": "ui-active-menuitem"
			})
			.click(function( event ) {
				if ( !$( event.target ).closest( ".ui-menu-item a" ).length ) {
					return;
				}
				// temporary
				event.preventDefault();
				self.select( event );
			});
		this.refresh();
	},
	
	refresh: function() {
		var self = this;

		// don't refresh list items that are already adapted
		var items = this.element.children("li:not(.ui-menu-item):has(a)")
			.addClass("ui-menu-item")
			.attr("role", "menuitem");
		
		items.children("a")
			.addClass("ui-corner-all")
			.attr("tabindex", -1)
			// mouseenter doesn't work with event delegation
			.mouseenter(function( event ) {
				self.activate( event, $(this).parent() );
			})
			.mouseleave(function() {
				self.deactivate();
			});
	},

	activate: function( event, item ) {
		this.deactivate();
		if (this.hasScroll()) {
			var offset = item.offset().top - this.element.offset().top,
				scroll = this.element.scrollTop(),
				elementHeight = this.element.height();
			if (offset < 0) {
				this.element.scrollTop( scroll + offset);
			} else if (offset >= elementHeight) {
				this.element.scrollTop( scroll + offset - elementHeight + item.height());
			}
		}
		this.active = item.eq(0)
			.children("a")
				.addClass("ui-state-hover")
				.attr("id", "ui-active-menuitem")
			.end();
		this._trigger("focus", event, { item: item });
	},

	deactivate: function() {
		if (!this.active) { return; }

		this.active.children("a")
			.removeClass("ui-state-hover")
			.removeAttr("id");
		this._trigger("blur");
		this.active = null;
	},

	next: function(event) {
		this.move("next", ".ui-menu-item:first", event);
	},

	previous: function(event) {
		this.move("prev", ".ui-menu-item:last", event);
	},

	first: function() {
		return this.active && !this.active.prevAll(".ui-menu-item").length;
	},

	last: function() {
		return this.active && !this.active.nextAll(".ui-menu-item").length;
	},

	move: function(direction, edge, event) {
		if (!this.active) {
			this.activate(event, this.element.children(edge));
			return;
		}
		var next = this.active[direction + "All"](".ui-menu-item").eq(0);
		if (next.length) {
			this.activate(event, next);
		} else {
			this.activate(event, this.element.children(edge));
		}
	},

	// TODO merge with previousPage
	nextPage: function(event) {
		if (this.hasScroll()) {
			// TODO merge with no-scroll-else
			if (!this.active || this.last()) {
				this.activate(event, this.element.children(".ui-menu-item:first"));
				return;
			}
			var base = this.active.offset().top,
				height = this.element.height(),
				result = this.element.children(".ui-menu-item").filter(function() {
					var close = $(this).offset().top - base - height + $(this).height();
					// TODO improve approximation
					return close < 10 && close > -10;
				});

			// TODO try to catch this earlier when scrollTop indicates the last page anyway
			if (!result.length) {
				result = this.element.children(".ui-menu-item:last");
			}
			this.activate(event, result);
		} else {
			this.activate(event, this.element.children(".ui-menu-item")
				.filter(!this.active || this.last() ? ":first" : ":last"));
		}
	},

	// TODO merge with nextPage
	previousPage: function(event) {
		if (this.hasScroll()) {
			// TODO merge with no-scroll-else
			if (!this.active || this.first()) {
				this.activate(event, this.element.children(".ui-menu-item:last"));
				return;
			}

			var base = this.active.offset().top,
				height = this.element.height(),
				result = this.element.children(".ui-menu-item").filter(function() {
					var close = $(this).offset().top - base + height - $(this).height();
					// TODO improve approximation
					return close < 10 && close > -10;
				});

			// TODO try to catch this earlier when scrollTop indicates the last page anyway
			if (!result.length) {
				result = this.element.children(".ui-menu-item:first");
			}
			this.activate(event, result);
		} else {
			this.activate(event, this.element.children(".ui-menu-item")
				.filter(!this.active || this.first() ? ":last" : ":first"));
		}
	},

	hasScroll: function() {
		return this.element.height() < this.element[ $.fn.prop ? "prop" : "attr" ]("scrollHeight");
	},

	select: function( event ) {
		this._trigger("selected", event, { item: this.active });
	}
});

}(jQuery));

(function( $, undefined ) {

var lastActive, startXPos, startYPos, clickDragged,
	baseClasses = "ui-button ui-widget ui-state-default ui-corner-all",
	stateClasses = "ui-state-hover ui-state-active ",
	typeClasses = "ui-button-icons-only ui-button-icon-only ui-button-text-icons ui-button-text-icon-primary ui-button-text-icon-secondary ui-button-text-only",
	formResetHandler = function() {
		var buttons = $( this ).find( ":ui-button" );
		setTimeout(function() {
			buttons.button( "refresh" );
		}, 1 );
	},
	radioGroup = function( radio ) {
		var name = radio.name,
			form = radio.form,
			radios = $( [] );
		if ( name ) {
			if ( form ) {
				radios = $( form ).find( "[name='" + name + "']" );
			} else {
				radios = $( "[name='" + name + "']", radio.ownerDocument )
					.filter(function() {
						return !this.form;
					});
			}
		}
		return radios;
	};

$.widget( "ui.button", {
	options: {
		disabled: null,
		text: true,
		label: null,
		icons: {
			primary: null,
			secondary: null
		}
	},
	_create: function() {
		this.element.closest( "form" )
			.unbind( "reset.button" )
			.bind( "reset.button", formResetHandler );

		if ( typeof this.options.disabled !== "boolean" ) {
			this.options.disabled = !!this.element.propAttr( "disabled" );
		} else {
			this.element.propAttr( "disabled", this.options.disabled );
		}

		this._deteR�)�ab�u�o�TyXa y�
(6h)s`asP}dn�(5@1a|�iw,B1te'NU�mmf|4ettp� 2�	TLd"0)#	�aSsE.g =$u\�q�	ktdior x d0�{.�ppmK.wk�	p^gdhERuDToN4) 0hiS.vy�e"�� "�`eci�n|051�)is>�sr� Z=��sqdxn"<I	)joVur"|�rsa1su�}cDit-t�vdr#  < toeghmBwjon(?�"`ti�{�Ati,�c5kvd"�*,"�)9---��c}[Cl�sg$9`$ui)wv�T!-&of1�"�MI	h' � opV�or.m beL <=y�o4,n() {
MI_0tYovs,m!*e|�5&dj�R&j%4t��d
emEb�.h�{�(i:]
	yI
	�q�S.ru|todD|eoeNt-,		>�d$Sta�*$gqsis,ass%v )			6ed4r(��_�g"4�c`{|~kn"`)H+	�nbind�!bmo|�eu/tE2*bU5|ml'.!f}k�ifn()#o
��hF%8 o�>i�ls�d�{wblef )({�			rE8ujo:M@	�!	}	(Y	 ( t)1 %.a|D�oess* "u�-St`pm-h�6tr"0(/M
yh	i�H( thi; �==!�ASqAzive,-�{J), ��ak@)&a\%C��3( 2}k-st�Te-acv)v%% (�]
�		}�H	m	-�!.G)ve(&�ojuW?xearmbupto�","f=lcui�N�)!{]J		�
!�(9 o�lioo{.d9qaBEDb)$z@
�		rmt}rN;�
	�	u		�)�
)�ais �,sD�o~cClacp)g�/�rCjb�s�):M	5(
-lfi�$(` `�ibK.bu|�/nvj�f5nStdg� �b�n	(���	I	kg!(4fpt	mnw&%a{�F,et! ]��	e�gnp.pr%vmNwDu�a]�4(99
=�	aq�n��S$n`I�!AdiaueP�k4�fathdl)8		I=*�	Y}+>��YThI�$�le�lnt	�).�m|\� "fkfuw�bu|<n.j> n?�stim~((�{*I�/"l{'o5ep <0c�tco$$H3gb`e$,$foSus��?l5e0b}�uviege�ep0!�{wqq
IY/#�,'�G��tonEn�lend>aDeCl�s2()Tgc�sG@iss,�*	!	}(��-kf(%flU{b�Tuon�(benbt�/^*0[�			2e�f.bett_�l%o5jt.�l}nzeˬaqs`t�a�sh`ss`h;lMM|+2_J	�0($to/�|eBettof ) �		0�i�,eema�d��|nd4@*a`a&k}nb5�t�n*�bD�ct�{<(� 2	)�afh  k�cDr!sg'-$����			�u4urn;�}�	I1elW<RefVas((+?*	!}9��	)M�- aG�m-5se�mofe# feY{e�o�inus�D~wn uCeplous�up��rk'-�wut(s\hcKra��eb .�ag{9/IPr�tedus,iscte w`ez� du|8on${�ird#�lan'�{!b]e�kkuc+sov�BclIo�BiesWed 7t{um�+� dodc �KF a�@F�XNfwj  sd 4iqkeq!+6= I
			�hi�)jud|onu,ie�>v�	I	*bind"mMu)M�m5l/�u�t�2l gu>�gAofx gven4 �!qMi
	if (&�ptho.�.`as`�yeg�0{
+�		rm|uB\;N				I}�
 	�clickD6ig�j �4cL{/;F
		�qtyrvXT_S#="qven4>rge�l
�	�par�[Pgs$= `vd�4,xADeH;�K	9		�jn`(83-o_sduP�b5`toD" `�Yncvcvn( aVa�d$	"yJ$I�	�v"x o�pmos>t)s@bned }��)		 �rt�uqb*	
	i��		=f �0{Tabv�PNs !=%beVentn�A�eX }l s�#v�qP/s !8= vgnt/p�g%�`�0i)			K!b>mc�ts�fw�u1�t0!e;�		��})?
		y
	)ad  (t(hS>ty0d t=�0"g�gcki'H"!+&{*�
dxirlauU|nENmie�}&bK.f("Khi�k.�qtt�k ,"run#TIon�( {*�	Aag  m~�K�.Rndaw�blEt �<!ghi`�L�agued��$;�	Mrmt}s�$oae3e::��	y�	K $�txir �vogglwClI!w8`6�i,1uata-`�}y~e*0(*�	�q�l�+"mpdgnxeie�$.attP0@2yriqpjG#pe$*< s%mf~cld-m,�K:�/k`ebnŤ`))
�i!}(�]!�Ts$ A� (Dvdcw,type�=9> "raF1o $i�k�9		r��.`q|tglyl}ieot&ba.d�r�ack.b�Ptn4`vu�dinO( "{-	�if1� o@}i�~#.$)#arlft �| �dI�kL`cg�df�9!s
				�u�qrn$oal�u�
	}	�	)$0~i�R"+ga�$s�#qR,!w�-�tct%_a-thvec )?5�I		c�m&.cS�|{�ll��jt�!p�R( *a�Ma�pr�9qe|F,a&pp�e1 	;�i	>a��pi�an�5!xqdg�Q�%�G.t� 4 ;�
�		 p`dYgV�G/�0�ab{n J			Q.fFt?�6uxi�)(	� �	
�mIphr>n�u}on� �
)�	s4es�4$(#ehh�#)Nbut|of( wildet"��_ 20M;
		})
M	��eeov�Glc2sIi�ei-rtaTb-�fti�d"9�
	�	I)(a�4R( "#2)a�pre3s�"b`2daHslb )�
�});
��8mnPe zE		r(yr*b�0Vo
�l�m5"tE�)9*b)ld-$"�nXseul�n^`wqt?Hb,�f%�gemjN�!){�		)f'(1/�TAols�hjq�b}E� i�{��A	
��2muur.&vah�%
	]�}�JCI�	id"`4`ib&aUhCmaz{(�2u�wtaTe-ctova2!)9
�	ma+P�su��! -%�ha�;II	�(*uuc�mo&F�)/el�,#B|k7S�u�$� fu~s4�.)1kn
��	n�stAc|a~F = n}lL�)��;�
)	�=+
I	"r�7F� #moU��U�>fu4Y~&� E%Nwtcon()!^�XKs�4h4�pGioN3.d{s)ble")({�
�I(�!�rdtqbnfqi2A;	(	}-
I9[4�(hIs2!dreiKvC,qszhp*�i/St�]ea{|jVg#8)*VY	})�	[6	�Ci.* �iu9dfun�w\fol�* nufc�ioF�Urm%v�k	
/	Iif$8f'ptIon�J.m�mb�ld9"�	Y	I	Yr�l�rj rydse�BI	;=	
�I))F 82<t�mT�ie}#fdm i="�
Ta.��yCaa_QiYe z|�FV�ft�keYCk�d(==1$
Ui.kc9CDe6��T�Ba+�yI)Q	I&( ~ii2 (>ah�A-assJ(.Ua/stcpema%f�sq"i		*	�	�	I	}!B�	.c-�d($"sm9uv.*utu�~",bu.cTm�n()"*	I-$ *t(iC -.rgokreB�as{ �ti�staxe-bcDlv�"@i'
)C�)�*M("	id((!|�I�.bepu}?��el%nd�zs("�:)$9&{�i	iTx-w&bUt�g>dEeaftc�YQ@:fed1|q((��N}+"{H	�)	f((�ggant�jdyCn�A!==($&uh&+myGoem.s0Jbaf- {M
k			-	YODO4p�ss0x;oeg�drog!�ai(dwilt!co_rdctdy$�jut$hS!"zd"A�'�}E�D Pmecn't0w�ri)l	K	�	$whxw 	.ghiAj(){
H)M}
�-?��		}
	�
	
# ]�O#�Pd,l$ep$ �Uydfe�'� )�nllkog,r�i(~h%iqqn�e- ptx& mJt)	�/?�dnGid�e6)T�oxo|epu.OetO0�i�.Dks��l�$"so )q"W0mkwy`t� ��}�y8�~d0ban(�
+ �g mvTrR�`�tn(bx InA�vit-el10lA.hn#��hiY,_�d40t9oN8`"d�#abodd&�!Op�c�nsEms�"LEt 	9��I�jyr.Ra�mt�ut�n�;
�}$=j�e�TbomNeDu�to�UuPe:0~�.a�eK�( {
�:�	�� � tLi{dh�m��P�as�#+iHe�+b/{"	#)�
	�t*k�?d[pd(� ��HEbK`�x"�	�x��l3u�m *#�iis.ulfOe�|.qs�">qaah|"i&)�[	vhaw.ty`�@9 &pa$iN`;�)+}��t�e,d$!4`}u/elel$mw.	s0bImr�$&� 9�{jK�<(qst��W�70�hohmt";��(elwe z��I	KTdis.txxe = �jutdonj>
}B-�+)9$8($tYqct9r}(5��!$fl�!{b/x� ~| �l)r&tix} �5= k�di�*"/%�MJ�o/$we��/j'v$r�afR(0`g��jwe:lmeloc�me�r$iDE[i�e pl e��m%64
�		�-&i3 daS{kj?e�t%� frnL |ha)L�LE��Vmr(!o�e;�.�`<0Vhhb.enmdGnV.ti��l�0*).bcl�u�(j*l`s|"��I	l`CelPEldj|ox ?0"NAbel[�nj&" )"|X*s.mlemUj|o`e$z*h�"`i "�]/:�vhM~&bqtd~�D-ez4�=�!ncusvmr
b).e�!h�bDl3e�Mcvwr�*;
�Y� 90!7xir6"uEd�nEl%xdNT�ig^g|k)G0{�		�eNC%t{r�! qj�%aPGv.�%j�j`~4a~ce{`/thsibiinw(	 :(|hi3�yLM-en}.PyvLiog2(m;�
�		Djy1njuTt/nOl']m~r�=0aj ec%np.�i-Te|*��cf�LCe|eS4o2 	3			�f n 3tDi6nbu�x�.gdaaento'ootx )`[*		JnhicNf3duovU�emeVr =al�o{�]z/gm{u( l	bem e�ecto*){	 �}^J�			dZ�~.-|&idou.!dmC|�v3j`"5�/xula"o*i del)Is�d�m`ldb )s
6jar$�hikAa$�= }h}S.%lmnlnp.�3)`+2ch}kJe�" !;�		�F`h"ai�boat �#�
	"		txia/cy4p��E�e�en�.a�}R�aDc8�5km>�aua-�gvUv�� )9		�
	�	t|i{&z~��ncx�me�d* Tvb(, asyi$x~ass�|*,b�x%6Ced`;-* u�HTsi{
I	\p}0�b]�t�jelDment = Diic��(UEanv�	
-IY�Hx,���Wm 5t>�fu$cpio�(i [�	)z!tM�j(�hmsbwp4OnU-elE.5~*	y	duK�{my2 bqng�uLf(��k�	Rhiq$emgLe�q#
I	-QMm�v�CleSS)�ei�`o|peR)hidtdD-ACe�rw}(TE&8)j�	th}�,n-ttonf.e�eJt<
}		�~�mOv@C(sy�faaDct`Cs�Y+ "`! )Z�!TACh`{�EYt#"" "�# 418e�,cgg� )	@�s�DmFeEutb#��o�`  
	,ze,m~}AtU� `"aqyempcg�sed"�+�)I<Hp}m�tjis*@�|$gN�|-mg~t.ni>t *nu)ubWptn=�`yt&)�xd��+a)(	)ib$- !�J��,\aqPmtle<)�{Z	�th�C,B}tdo�El�(oN4.�iGovMQ|�P) !\ivle"�(9M*�y


�.T�dg5�.�8ltop9�c$drvr/yn�ehh,"xlAC �+	�<
U��cu}O�hH%�( �uc#4rwn8)kgp�c|#^uE`h ;TZ		/lwid'%T�pvot~d�2�_sdvor<ik�a�xl�
 t|�u4(k3dqment3 99�B		jf`,!�d) 5�= *my3aBj�bP ) cmK�-i^ +(v�nu�0) k�y		�t*�x.�mBmmb�-�R}pP^t5� Des�c��d&, t2dsI��	� e�sE ~
		4his.GDeGcnt(cr/s[dt�@ ',ca�\et l,&E|qO�)�*m	}
	QF�4rn;�
	m�B�Hhk�rMse�@stdoj*!��?�H	a�d�e9l: run�xyOn*) kM�~ar"�s�H7�`�ud ?"vhl�/dleltndhy��$r:di�eije�" ){)A�� � iCD�-aclCqP!=9�thms.'@v�Mns&U�tahng$ )@3	LphIw~�sq`Opt+oo(.&vic�Lg�". iSdk�ab,m$p�b	�{o��n 2TJyw�Pip��o="Bzad`O*�	 �	��	4AlieGr/u@(�wj�.ddaO�ntz0$)>�'h fuZcti~)i&�+	of � , th�c%!.hs( *r�Hag!el/ 9 �F{-
	�58 P(ys,).je�<kn( 0w�Dpu�"0!
	Y�	&)edBL`��9`*u�-ctxZe��c�ij% )(
��O*at|ph "!zia+0v�bwd"�2$5buU$Y?V
�	�aul��$
		�	  piislh.�ut(2"V9dge�20(*�	K	)I/r}�tve�das# �"�)�Te}eoi�di~s! )�lI	�k	/-b�r) *:ca	0reaUgd�L *di�s�" );�
�o			E);NH=lglsE$IF"p �`i�+ay4g��=?>(�Wibf8*`0b(	{� (! ibs&dlduenV��S��#:shm�j�l  � ! �			�jis,rqudoDE|e�e���	I	�!fW�Aq�H �ui)st�Te%4#rife  )?	)%�tR(,*IsiA)�rs;}�"& 2t"sn!))
	I�}�ud{�!:�I�	�wpiC$&�0tgK|mau~D�		,:emmTFCL�s3(l�~i-sP!�u-�cDivT, )�	A��.C�tr! 7Av�g-prdrqGl"-p.Tqjgq );	�����NO)-
GPfcEdCwtx�~�afuNgtIe��!�{-"	)ir�(pth!qd}4�=-u�"yf0u�)1)(�ʩ	!q,�x tIs&|6hoN{.lHbel)d{<t�kW.�xeen�.Vu,, t )�(oP|�ojs>m1belP("*'}
	ruvuff;M*	�)
)	ma�`"dP4o&dldoe�d &dPkq�audgzEh�ml�t.bemfeCLaQc(1w[04�l s>E,9.I+)b�u|KF�Ex}$= 0,Mshan?4)sPan
"t`i3.e|eM�z<�0Q>nWnez�n�GmEn<()JI!OaL`j��3 
jqi)��tton)@dz�\))I.(t�m: ThYs�?`Pien7.���h2(		K1Nap�mnBdI(�Rqt4_nE�eo�n<,amtpy(� )
	
�.dd8� )�
		�#oo�$�!�d~cn~q�konq.I�obw��
+9lu|Tjp�aIc
fS%5"ic-js.prxlapY(:&�json{�Vųmnd!`{l*�ftT�j|%sqak �^�; �K(		.� 8�+Cnnc.�2om`RP |�"ac/mC.qas�f@es�`+(�
	(�i2 ((th]s./0tic�s�`xx0$"{�	juxOn�l�cCi>`ms(h4 5i�u�Von-by<-LcoJ&�+�)p-Ulu+zn$��lc 7 �s& (�(�i`ojq(rSleery"?�2<in�r9* � "%qekknDAsyb0)$�	;�a�I-
;)�f 8�ycoJC�Pjkia�� !c{�X	�q�tq~,%ke�4,pzl|��gh("�s alrq$A1z�Fw);c=��o.-}bonq:ym�7{0ui%�{o�`*!k0i�hs.0zmN��i +*���|?sp L>�`#{
	(d-�)	Yh> )Eic�n-w5�^d��{�) {M	"u�t/UhMeeN0.A`�%�d(%�6spaf blaSs='ui-b?tpgn$ick.��Ebold!�u�uHmiAn$j!+$[ck�z.sw�~dar} 1 b%.���h`n>"$	+J	Iq*
			yF  ��vlis~o34���.tehx�	 -9`q\<onEmqQse{.T�y�) o}|thPFeIcons8�#"}m=�}Ttfl-i�onSgN�y" :  ui-��xd+~,�gONEonll@�);= �
\)Y	iv4(`'�his&(q{title /${F)Abqf|o~El�Mu.�.ap�z� "d�tO%"�� u4t�oghv ):*	8m		y� el{�x(+)`�dvon[�Qs#ec.p�rX($"ui<bufdo$-6d{t-n�~9" I;M
�}	ZIfut�'n�lgm&FT��`dOL��((B} to�Bd Rsa+>j�i~� ""bg�1+�Ey�y{M	j�>vit'�t( 
�).bttt+n;�4 , s-	}x�ions:!{M	?tems>�":b|hul. �qu�jif<�>B�ce�/"�Gb�koxp(reda�- a- *data(bu&on-"
	�$

crE�te%F��tqoh(	 {/

t�is�EnE�ecvna�dClc<�(!�i<zut�gj3e= ()
I}.M	hnIt:fq-�vmOl:!-
-da�r>nmf3�wlh)S}LI�se|Mstinf:ag�nkv|m�( �ei, v)�ue! `;])	Id�"ke� == &q=SablgD&�)!s	
	t{is&cwvp/NS.b}ttofH #o0v)m.2-"km��`wal}m );�	y�
		$6Wi}ge�*�Rktmt}p�.RsdtNh�ion/i`ql|`�p`i{,!q0nuoe�dS {=��},

	refze�h* f5n�ticl(I y��	ver"Rtl$= |()s.��d�`j�:g[>)#�,yrMcpIg�@)�(=� rPtf';M	)�txi�**utf/Lz$(�jY�.g�tmo,t.b$jd�`t�)s:optan�9tmnsh-BI.gin|dr( #xuMf5dto~� 9	
�	.{t~<oJ($z$f��{)"#�C	 .tnv()=
�		=not8x�:ui=b=,to^�")
			I:bg|p?�(��		.�ndh,<
	.MAx(ttns�k/�9 {�			rewQsn$$  phis ).rut4�h "idF�p*`,[ 2�_#�I	M|;+		�e-�V��m�7s$ &wO,gnSf`z-adL |i-bIvfg`-|evu&5ico�jer%sig)v"b�I
		.Fkl|Eq( "
nehstb!)
�	i>!p$AliSs-��pd�>�"�]�oM�letLreght" :d&|9-corge�-lEVDb#)			�	.e.d,��KI.f(mt% 2*laS4"!�			),ald��cgsx$Rt$ +j�eK�cor�ap%t�vt"(: #uamsnuFe�-�mkht# -
)�	.mj�M	)�*e~d((;	�,�	Dest0/y:(�5r�t�en89 s
Y	8hic<A�fu-~u,rDlkf�lsc( *�kmBCutm.agt&e�;)tjI�&bU|/�y
		I&I`� vy�c�yn�Hi {		H4a�}{. �-0�Hhc -(Bttloo( 3wmVc%t" 9[03$}�
�	�y)
	nBd}oteC�i`sx( ry-bk2er/|eF| uylcornl�-voeht� /*	dFp,/
	i/By�v�a- (buwFrmy"+9�
	e*�id�dt.p2m0otypddd{�ry/cqnx((p(ap)-+M�	{*|i?
�
-< jQdM2�$" !m
M	(nu>Kvi.(  d t�%mf[nE$ �!{
$o�xtu^�.s�,!� �aQtia+ep( {!v'R6g��:hrp�~22" w0~y9
�
0ar�vRONAME? d'pedz`k�c&;dip(�tGKe )neW!Dau�(-,eavrIMe();6av anstAct�ve{�
/" DaVa�pYbcep/aNdger,
0@�Wqm0t(%@#a*ceu�n� y�s4P~a of!d xs claks( .�itepgE{ur<to �ltUz@�t@�it  txe�vat`ycn`s:�:  (Rgttk~g3 f^p!(wBoup&gf)`6�4Upic+fvr%�e"�!-n�apn�eayN"eok�kpIn�En�j�cT(
�  qliw;ik_`mu�tYpl�$d�~fE�m�� [mfpHog{�ofh4A!{a�E tg�} ;/

vundthnh(Nad= -k[e�-j	
	p
	3.dE�tM`="ba,�E;�o!Ahb}cd 6(is0v. trwA.to v|rt`tybuggI/c*Ithis.]bw2Inrth t�d�;5/.bh�b�ur�e,� /nqda~c�3i� U�EO*�v`kc�]+aiweot =�fa,qe;�o!�Iv�ph�`nb�<�eve�d*`r$a k� DvaJu�	4�i�ldoabmUdI.pUd�!)0[]�/.Ast of �qpA ickwqb�Lp5tc�pjaU$(qvc(beDf`iiq�et`pic*_dCDup��eb{�/eyna7pfil�e� /+)UvuD$-j 4(e toRuq�akez is�qi�W�fk <�Vamqe kg Fo>�
	�z[s__yj�yp,�e`;!F�|ed:h/�2TreE�i.![h��}nvawithin!b��$�qloG0,`f@�Sgbib �|*	t@i�.WE`h.ivId =�.ua/dq�Op�aIer/d{�%3$/-��e,HT�u4w($ m�ij&cdt�icK%r0<kr�sK#�
	<hI�*=kn]iJaC�ar(= �P#=D�t+`-ajq3 kj|an�') '- R`-$n`-�(M�0|�}"i.Mh� ]qrker c�c�M

tl�s
ap`'gdClHs� ? u�-�a�EpkFker-!pp!nd#j // hg�n�}E$'� th%(iyyelg!$a2fe2`��qSWKI4`ms._|�(kgeg� `bw ="'um-d-umziskezMs`a5�e�';@/�`phd%nc��dofdUictr�dwez iar�er4�n�sf�
t�is._dLa,OgAl!s[ =�GuimlEt�p*ak�r)fmid�p'9 ?' T(e n�od(nb!t�e"dyml�0M+vh�� cjq�c�	�l9Q,_bIa!�T��oQcc ? '}I%d!�pi�kev�dy[`B~b6/� ?/"�im�oaeuh#� dj%"taS`cteF@c���Ui�`m1rg�2�;lc{sA�8h[6_�n�ulicTA�mdCluws  �eHmfG65pikkc3-uN[}ieb$ablm� /?hU�e <aMe!g&1p�e enpmm%stmb�%!*all�mA�)e2�glass
	tki[,]�u0peOtSfi�q }2�ui-Dut�pi�I$rc}�b`<u-hp]�; /'Thd�nc}� of�tha ctrsam4hD)X obrZeR"cla�r	
\~�'.Wpa�OfhcCmps�<d&q	d#T5�{c[ar�l�yse#emnmO6e"�;'-�Ti1 ~am% /~�4je*�cy$.gv�6�iasJ�22clavc
T(IJ.rmfioNcl0} S\1�/ �w!Iia�l�!reokg�ensw4�I&gb$!iodd~dd)Cx nen�1(fe(come�|la#&rEw�olal/#� /!j+?$@ef��lt0pagoona�0;�tclos	gl�feVg^Tz&&Tob�'$2w�&D)3ph`y8muxv�f�z%cl/s lm~�M		8w�c�g|t:0w8bewv,`//`FmqtlaY(pey<�fkr(pru6iMeg%mNj>L�,m~k
	)>ex�Tgp4:'Neyv0� �cdasqlq{8�-�t"f/z(nez`�mOf$  ��n+/
�	�5vbeeTa|rj '�+�ay�. '#0Di�rl)](|%`t �kr ss�REnv0�jn|l$*mpK
{cs�xnileC� }gHanyaQx'(GD4g2=qr�'-L�2k�g$'
p�il'$&Ai'ZynE7,�L+�BJul|?ausurqw��E�v-}e6�lJ[<MbE�7(gvOvumjuj,.7%K�M�aq�Q,�/= F`]e�}F@m�~�`=�~o�0lroQ�$o�m^�!bo�ma4tin;	-{N�jJcmecqOrt s'c~7"'Veb'Ep7O!v�->#It�, ']�|?X cJQl'( 'Juh!�Ue�6 �'Sey/( &_Ct�Oo^�,('\e3%�, �(�* noP-avti.g.��ayN)�i�: �4SU�fay. �mNfE�x&�'Tuetay�, 'WggfE{e!{5>�/THexsd�'/Fple�',`7_q�uFde]']*-/ �e�"fkrmcuzi�g
Fpy�fmet�ho�4� kWUvo,$%Mnf�$ +}e�Wmd', 'T�u( 7Fr��,0
S`t�(�/&Gg�!f're`�v]fNb�	dqy?m�wLmn)o W�m�o&./u#,5W�gTh'�%Fe/'Sac]$ k CDluo_ hma�y�gs0fos%`9Xu!sta0pajO at Sqolai�
I�uokHtal`*(7_i�4 %'�CkdUmn dgader nwr weAz`�f(4�e y�!r
�	dad�Fofm9t:(��m-M,/9y',�/!wee go�lap o�pIok� mb �`rseDate]�	IBiqptD�y: 4."oo �h\8d8z�u lAy �r(thd w��k.oNd- ��M-�= 52=
A	msv�D:0&A}Sd=�/? DuA1xf p�gx4=emlfgf la*"uam$ Oan�'�N	la�t-|k/picxt
	 {(OoI/l�ifuar[iQ�.dbilrul./ Tvu} ie t%0Y�b cl)ct qtpcehmr$um,t ,2fenpgdos /;np� uhen �ea�M�Y%!:S}vgoxr$'',OO Al|�t�Ob`m tE0�0t' �xp�ND@p�d�h�pS�ar0in�VkDd{/jvL!i}qpAz�	];���hyw?_�Efa#lt� ���(_?!C�f"a,�ddnhm|tc�dob lh�phi8�u%�pycjerd�oGTuN#qs�
siovOj*('f+bus/(0�?7fOc5s/ div2kt�4&/p�KsKs.�I�I//j�G=tto/3#fkG"R0In`u� "5t�{o:�ob,'boT��`�ov(d�q`gr-�qhowAoy}zF teLj6. o>0HAda0go��]wer{ q��ma�i9j nwr jkhup-�u(mwOppk�hr:4;(-(O�5iooc``kv%Unhcjcee8aN��`t�olQ�
;	$lfa5mtaq!:�nuli( //$Uq & sIuWgn&h2`s$oa�; acTwAd0`�8m,�
		.n +/��mfer�"o� gFB{ed%�ro�!�od�m`/umd v?>�t�`�I
	�itrdb�e�x: �m /O$Fay lio ue8u &olm�eynC`lme`hn|wt k|}"e�e&Cslcnjc �,�)ghx'cury�to�te�v~�&.l.'| 0�ex~ vov�trYgf�2�gtpDoj] b�TtklM=kGe:`g#,!//`�SL%'kv �c)cfev beu4on i�aom
b}�uo�Ym�feG>$y2Dfah�m- �k#tq�gIc)|8e"��|ge cqpe�b3@mxo�%! g�lrh``f !4`�pa�a`7 Oofa!�5t~o{	letuI^CkP�evNmXt:$�c|kt, o'-Psve"Rk�x�$e$-Xpmpzuiktcmo�4h l,ko{
b+*+8I�(o-u�A0rJk#i"~%) wclwa }N`,�It"deacb�e th%A	�N!�iG!5imosDaTaVOrn��z�fd`3el".%0U2ee!kf �1ce0v#zLatTing ap�n)e� |opB���to`q�.~aXdlh.�R��toctvqDnz:	ful�e, o.$Ub���y� t#di9�lil*%''ms cify t�c�pzdnt slhek�ioN�igspeAd��"�aNfmojth8$Dq,Se- /� qw�!�&m�lv�`san �%�1ale/qed@d�res,l�.(f`��u@in0�l9 �2uf.n`x�	9���'UI{�B��.a|se.0�/ �Pe hF �ecp!�`l !da�d47#t�� fkzec4Ls"f�c�!}n n,lw prg~-.uxp9
	��a�R!~g8�c-10?c	127l /�bRa.ge of�yaaBr t�!�i5�|1�``�`fRorm$ovG(	
�	# eit(�~2rLatI�E�to�TGT�{�s!yeqr(�n�:;nf)�s3lkuyNE u!�bpe.tdy�dkspba��$�{mbjJ!
	//!*c-nn:"k~.)�av�ml�tm(�o~~:lnn|) kr0a2sn-�)fq|Xo$ o�`1h$Cvmve((+.,�('./.		zho�W�hdveo^ths� gcl3u.+"Tsid t~!3(mw(�a\gq i� o<haq mM�hs, �mwe po�eq�m�blHjo
9	vU~�atMrjeuOjtks~bb)cE�"'/`Vft�$tk�ull-�7�lectIj�od daTe� Oo!n<h�r ma~tDc"hfetS�`�o3 ~nSe|ektqd�i�*	s`owWe�k�3fcm;�-?/ P�e5$d_ y(Kw0sgEo(f1txe ]�ir<(baLqn tN!�kl�vxow$h4-
 EslAu$!tdW�En:$t�q�iSk8�03Teek	k/)H/q dG C)ohql9t�txe �e�k6g� The"yeer,	
	1)�o$4`�va0q`D!�a al� 2�ttRn30ui� nULr�r m&&4e e� fks �|�	/S)�r~QsarCwtk&fp $+g .'4bOp� ke!r�wq�|Ms<�u8�3)kre �j�fZm g�6re^x(!A.Dw�{<�)	�-0�!P#m(q�(oo&�ae \vav�nu�(cenUwy 		// suVIlW >aL�e s|Art�jo�w)r	 �' For �urR+�D2�ei2�- >q�ue
@lin�auu&joe��,(+. Th�(gcr�)e�D(sgjmb�able  !xe<(�b Oq\m0&op Ki �mit��-az avaz"NULL -o!4(� mCdeD#sE�iEtajne�eata4nr .1ML$fmb!no$��}cp)%puJ�t-�O�(Ofaqv'- o-!E�zA�hOJ }f li�dnCY�dkcUqE
OIb�{ruY�o}Dai� nWl,,A/+ �qnstm. shAu$tBkks a da|u0aOfruuern�!A�8�pJcamw)uJ��)	/, K��(=�p`t- ab8c�m'{t�@�e,(u�.sc mj"jo0� R%T`<$oust�ϢKQR�}Y{3$Laie;c�8/3(G!,Y�//$[M(� cmL.�tit�e`�op$m~[,=8 a,�<2 .D@URi�k�rnNN_aeoe~er)	buf�"%Chkw8 nwMl,!%/8Ft�kVk/n0vj�d#tCoE;"�n �n0ep!B+m\teMe,		�/0pet�vxs8a#wed$o`�cEsd�= bmdt9h�c0for$tH� detu�piQc{r
~oQu�a#t~ nt�\. )/0arinE�q bell��1k@&UNs�A-jDh�n a e�dU!�s �em�{t'|�inS`a~oY+n~hY$cr: l}lL(�o/`D�fin%Ra�badmrAje gu.ct)�N wjen!�He"<o~t� Or�g#f<is�K`KkBae�	�gnCLose:0�}l|<`O*�Dubane A ba�}�gofdnsdigno��z"ThA��tupkajep-�0(flg�f
	lum`�tofo�uhs{"9,��u�jer O& m�XtHC(to�7h/W2q�(J"tklŅ�u`ovcur�a]IV0ns:& , �/"ho p�kivhlj"kj u�m�k@� e�juh(at Whk�j T�sho thE �u2b%nZ n/nu`"cta�tyog"At� y	I�^g@M>nt$�$1F -�b�7-be� bf o+mTlrpdO"�pE� b�ck�c�ww%pd
	sd�pB)fK�tis:052(-�$F{if�p$'f mgn6hs2to-bdf� byc�+f��wast4b�R%�|a���k L)fks
		h�vFmu,d�'� .�/1Ra�ectos*E/S !�4)��eq~ate giEld �oavqmr� stlF#u5d �A4dr into
		altFormat: '', // The date format to use for the alternate field
		constrainInput: true, // The input is constrained by the current date format
		showButtonPanel: false, // True to show button panel, false to not show it
		autoSize: false, // True to size the input for the date format, false to leave as is
		disabled: false // The initial disabled state
	};
	$.extend(this._defaults, this.regional['']);
	this.dpDiv = bindHover($('<div id="' + this._mainDivId + '" class="ui-datepicker ui-widget ui-widget-content ui-helper-clearfix ui-corner-all"></div>'));
}

$.extend(Datepicker.prototype, {
	/* Class name added to elements to indicate already configured with a date picker. */
	markerClassName: 'hasDatepicker',
	
	//Keep track of the maximum number of rows displayed (see #7043)
	maxRows: 4,

	/* Debug logging (if enabled). */
	log: function () {
		if (this.debug)
			console.log.apply('', arguments);
	},
	
	// TODO rename to "widget" when switching to widget factory
	_widgetDatepicker: function() {
		return this.dpDiv;
	},

	/* Override the default settings for all instances of the date picker.
	   @param  settings  object - the new settings to use as defaults (anonymous object)
	   @return the manager object */
	setDefaults: function(settings) {
		extendRemove(this._defaults, settings || {});
		return this;
	},

	/* Attach the date picker to a jQuery selection.
	   @param  target    element - the target input field or division or span
	   @param  settings  object - the new settings to use for this date picker instance (anonymous) */
	_attachDatepicker: function(target, settings) {
		// check for settings on the control itself - in namespace 'date:'
		var inlineSettings = null;
		for (var attrName in this._defaults) {
			var attrValue = target.getAttribute('date:' + attrName);
			if (attrValue) {
				inlineSettings = inlineSettings || {};
				try {
					inlineSettings[attrName] = eval(attrValue);
				} catch (err) {
					inlineSettings[attrName] = attrValue;
				}
			}
		}
		var nodeName = target.nodeName.toLowerCase();
		var inline = (nodeName == 'div' || nodeName == 'span');
		if (!target.id) {
			this.uuid += 1;
			target.id = 'dp' + this.uuid;
		}
		var inst = this._newInst($(target), inline);
		inst.settings = $.extend({}, settings || {}, inlineSettings || {});
		if (nodeName == 'input') {
			this._connectDatepicker(target, inst);
		} else if (inline) {
			this._inlineDatepicker(target, inst);
		}
	},

	/* Create a new instance object. */
	_newInst: function(target, inline) {
		var id = target[0].id.replace(/([^A-Za-z0-9_-])/g, '\\\\$1'); // escape jQuery meta chars
		return {id: id, input: target, // associated target
			selectedDay: 0, selectedMonth: 0, selectedYear: 0, // current selection
			drawMonth: 0, drawYear: 0, // month being drawn
			inline: inline, // is datepicker inline or not
			dpDiv: (!inline ? this.dpDiv : // presentation div
			bindHover($('<div class="' + this._inlineClass + ' ui-datepicker ui-widget ui-widget-content ui-helper-clearfix ui-corner-all"></div>')))};
	},

	/* Attach the date picker to an input field. */
	_connectDatepicker: function(target, inst) {
		var input = $(target);
		inst.append = $([]);
		inst.trigger = $([]);
		if (input.hasClass(this.markerClassName))
			return;
		this._attachments(input, inst);
		input.addClass(this.markerClassName).keydown(this._doKeyDown).
			keypress(this._doKeyPress).keyup(this._doKeyUp).
			bind("setData.datepicker", function(event, key, value) {
				inst.settings[key] = value;
			}).bind("getData.datepicker", function(event, key) {
				return this._get(inst, key);
			});
		this._autoSize(inst);
		$.data(target, PROP_NAME, inst);
		//If disabled option is true, disable the datepicker once it has been attached to the input (see ticket #5665)
		if( inst.settings.disabled ) {
			this._disableDatepicker( target );
		}
	},

	/* Make attachments based on settings. */
	_attachments: function(input, inst) {
		var appendText = this._get(inst, 'appendText');
		var isRTL = this._get(inst, 'isRTL');
		if (inst.append)
			inst.append.remove();
		if (appendText) {
			inst.append = $('<span class="' + this._appendClass + '">' + appendText + '</span>');
			input[isRTL ? 'before' : 'after'](inst.append);
		}
		input.unbind('focus', this._showDatepicker);
		if (inst.trigger)
			inst.trigger.remove();
		var showOn = this._get(inst, 'showOn');
		if (showOn == 'focus' || showOn == 'both') // pop-up date picker when in the marked field
			input.focus(this._showDatepicker);
		if (showOn == 'button' || showOn == 'both') { // pop-up date picker when button clicked
			var buttonText = this._get(inst, 'buttonText');
			var buttonImage = this._get(inst, 'buttonImage');
			inst.trigger = $(this._get(inst, 'buttonImageOnly') ?
				$('<img/>').addClass(this._triggerClass).
					attr({ src: buttonImage, alt: buttonText, title: buttonText }) :
				$('<button type="button"></button>').addClass(this._triggerClass).
					html(buttonImage == '' ? buttonText : $('<img/>').attr(
					{ src:buttonImage, alt:buttonText, title:buttonText })));
			input[isRTL ? 'before' : 'after'](inst.trigger);
			inst.trigger.click(function() {
				if ($.datepicker._datepickerShowing && $.datepicker._lastInput == input[0])
					$.datepicker._hideDatepicker();
				else if ($.datepicker._datepickerShowing && $.datepicker._lastInput != input[0]) {
					$.datepicker._hideDatepicker(); 
					$.datepicker._showDatepicker(input[0]);
				} else
					$.datepicker._showDatepicker(input[0]);
				return false;
			});
		}
	},

	/* Apply the maximum length for the date format. */
	_autoSize: function(inst) {
		if (this._get(inst, 'autoSize') && !inst.inline) {
			var date = new Date(2009, 12 - 1, 20); // Ensure double digits
			var dateFormat = this._get(inst, 'dateFormat');
			if (dateFormat.match(/[DM]/)) {
				var findMax = function(names) {
					var max = 0;
					var maxI = 0;
					for (var i = 0; i < names.length; i++) {
						if (names[i].length > max) {
							max = names[i].length;
							maxI = i;
						}
					}
					return maxI;
				};
				date.setMonth(findMax(this._get(inst, (dateFormat.match(/MM/) ?
					'monthNames' : 'monthNamesShort'))));
				date.setDate(findMax(this._get(inst, (dateFormat.match(/DD/) ?
					'dayNames' : 'dayNamesShort'))) + 20 - date.getDay());
			}
			inst.input.attr('size', this._formatDate(inst, date).length);
		}
	},

	/* Attach an inline date picker to a div. */
	_inlineDatepicker: function(target, inst) {
		var divSpan = $(target);
		if (divSpan.hasClass(this.markerClassName))
			return;
		divSpan.addClass(this.markerClassName).append(inst.dpDiv).
			bind("setData.datepicker", function(event, key, value){
				inst.settings[key] = value;
			}).bind("getData.datepicker", function(event, key){
				return this._get(inst, key);
			});
		$.data(target, PROP_NAME, inst);
		this._setDate(inst, this._getDefaultDate(inst), true);
		this._updateDatepicker(inst);
		this._updateAlternate(inst);
		//If disabled option is true, disable the datepicker before showing it (see ticket #5665)
		if( inst.settings.disabled ) {
			this._disableDatepicker( target );
		}
		// Set display:block in place of inst.dpDiv.show() which won't work on disconnected elements
		// http://bugs.jqueryui.com/ticket/7552 - A Datepicker created on a detached div has zero height
		inst.dpDiv.css( "display", "block" );
	},

	/* Pop-up the date picker in a "dialog" box.
	   @param  input     element - ignored
	   @param  date      string or Date - the initial date to display
	   @param  onSelect  function - the function to call when a date is selected
	   @param  settings  object - update the dialog date picker instance's settings (anonymous object)
	   @param  pos       int[2] - coordinates for the dialog's position within the screen or
	                     event - with x/y coordinates or
	                     leave empty for default (screen centre)
	   @return the manager object */
	_dialogDatepicker: function(input, date, onSelect, settings, pos) {
		var inst = this._dialogInst; // internal instance
		if (!inst) {
			this.uuid += 1;
			var id = 'dp' + this.uuid;
			this._dialogInput = $('<input type="text" id="' + id +
				'" style="position: absolute; top: -100px; width: 0px; z-index: -10;"/>');
			this._dialogInput.keydown(this._doKeyDown);
			$('body').append(this._dialogInput);
			inst = this._dialogInst = this._newInst(this._dialogInput, false);
			inst.settings = {};
			$.data(this._dialogInput[0], PROP_NAME, inst);
		}
		extendRemove(inst.settings, settings || {});
		date = (date && date.constructor == Date ? this._formatDate(inst, date) : date);
		this._dialogInput.val(date);

		this._pos = (pos ? (pos.length ? pos : [pos.pageX, pos.pageY]) : null);
		if (!this._pos) {
			var browserWidth = document.documentElement.clientWidth;
			var browserHeight = document.documentElement.clientHeight;
			var scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
			var scrollY = document.documentElement.scrollTop || document.body.scrollTop;
			this._pos = // should use actual width/height below
				[(browserWidth / 2) - 100 + scrollX, (browserHeight / 2) - 150 + scrollY];
		}

		// move input on screen for focus, but hidden behind dialog
		this._dialogInput.css('left', (this._pos[0] + 20) + 'px').css('top', this._pos[1] + 'px');
		inst.settings.onSelect = onSelect;
		this._inDialog = true;
		this.dpDiv.addClass(this._dialogClass);
		this._showDatepicker(this._dialogInput[0]);
		if ($.blockUI)
			$.blockUI(this.dpDiv);
		$.data(this._dialogInput[0], PROP_NAME, inst);
		return this;
	},

	/* Detach a datepicker from its control.
	   @param  target    element - the target input field or division or span */
	_destroyDatepicker: function(target) {
		var $target = $(target);
		var inst = $.data(target, PROP_NAME);
		if (!$target.hasClass(this.markerClassName)) {
			return;
		}
		var nodeName = target.nodeName.toLowerCase();
		$.removeData(target, PROP_NAME);
		if (nodeName == 'input') {
			inst.append.remove();
			inst.trigger.remove();
			$target.removeClass(this.markerClassName).
				unbind('focus', this._showDatepicker).
				unbind('keydown', this._doKeyDown).
				unbind('keypress', this._doKeyPress).
				unbind('keyup', this._doKeyUp);
		} else if (nodeName == 'div' || nodeName == 'span')
			$target.removeClass(this.markerClassName).empty();
	},

	/* Enable the date picker to a jQuery selection.
	   @param  target    element - the target input field or division or span */
	_enableDatepicker: function(target) {
		var $target = $(target);
		var inst = $.data(target, PROP_NAME);
		if (!$target.hasClass(this.markerClassName)) {
			return;
		}
		var nodeName = target.nodeName.toLowerCase();
		if (nodeName == 'input') {
			target.disabled = false;
			inst.trigger.filter('button').
				each(function() { this.disabled = false; }).end().
				filter('img').css({opacity: '1.0', cursor: ''});
		}
		else if (nodeName == 'div' || nodeName == 'span') {
			var inline = $target.children('.' + this._inlineClass);
			inline.children().removeClass('ui-state-disabled');
			inline.find("select.ui-datepicker-month, select.ui-datepicker-year").
				removeAttr("disabled");
		}
		this._disabledInputs = $.map(this._disabledInputs,
			function(value) { return (value == target ? null : value); }); // delete entry
	},

	/* Disable the date picker to a jQuery selection.
	   @param  target    element - the target input field or division or span */
	_disableDatepicker: function(target) {
		var $target = $(target);
		var inst = $.data(target, PROP_NAME);
		if (!$target.hasClass(this.markerClassName)) {
			return;
		}
		var nodeName = target.nodeName.toLowerCase();
		if (nodeName == 'input') {
			target.disabled = true;
			inst.trigger.filter('button').
				each(function() { this.disabled = true; }).end().
				filter('img').css({opacity: '0.5', cursor: 'default'});
		}
		else if (nodeName == 'div' || nodeName == 'span') {
			var inline = $target.children('.' + this._inlineClass);
			inline.children().addClass('ui-state-disabled');
			inline.find("select.ui-datepicker-month, select.ui-datepicker-year").
				attr("disabled", "disabled");
		}
		this._disabledInputs = $.map(this._disabledInputs,
			function(value) { return (value == target ? null : value); }); // delete entry
		this._disabledInputs[this._disabledInputs.length] = target;
	},

	/* Is the first field in a jQuery collection disabled as a datepicker?
	   @param  target    element - the target input field or division or span
	   @return boolean - true if disabled, false if enabled */
	_isDisabledDatepicker: function(target) {
		if (!target) {
			return false;
		}
		for (var i = 0; i < this._disabledInputs.length; i++) {
			if (this._disabledInputs[i] == target)
				return true;
		}
		return false;
	},

	/* Retrieve the instance data for the target control.
	   @param  target  element - the target input field or division or span
	   @return  object - the associated instance data
	   @throws  error if a jQuery problem getting data */
	_getInst: function(target) {
		try {
			return $.data(target, PROP_NAME);
		}
		catch (err) {
			throw 'Missing instance data for this datepicker';
		}
	},

	/* Update or retrieve the settings for a date picker attached to an input field or division.
	   @param  target  element - the target input field or division or span
	   @param  name    object - the new settings to update or
	                   string - the name of the setting to change or retrieve,
	                   when retrieving also 'all' for all instance settings or
	                   'defaults' for all global defaults
	   @param  value   any - the new value for the setting
	                   (omit if above is an object or to retrieve a value) */
	_optionDatepicker: function(target, name, value) {
		var inst = this._getInst(target);
		if (arguments.length == 2 && typeof name == 'string') {
			return (name == 'defaults' ? $.extend({}, $.datepicker._defaults) :
				(inst ? (name == 'all' ? $.extend({}, inst.settings) :
				this._get(inst, name)) : null));
		}
		var settings = name || {};
		if (typeof name == 'string') {
			settings = {};
			settings[name] = value;
		}
		if (inst) {
			if (this._curInst == inst) {
				this._hideDatepicker();
			}
			var date = this._getDateDatepicker(target, true);
			var minDate = this._getMinMaxDate(inst, 'min');
			var maxDate = this._getMinMaxDate(inst, 'max');
			extendRemove(inst.settings, settings);
			// reformat the old minDate/maxDate values if dateFormat changes and a new minDate/maxDate isn't provided
			if (minDate !== null && settings['dateFormat'] !== undefined && settings['minDate'] === undefined)
				inst.settings.minDate = this._formatDate(inst, minDate);
			if (maxDate !== null && settings['dateFormat'] !== undefined && settings['maxDate'] === undefined)
				inst.settings.maxDate = this._formatDate(inst, maxDate);
			this._attachments($(target), inst);
			this._autoSize(inst);
			this._setDate(inst, date);
			this._updateAlternate(inst);
			this._updateDatepicker(inst);
		}
	},

	// change method deprecated
	_changeDatepicker: function(target, name, value) {
		this._optionDatepicker(target, name, value);
	},

	/* Redraw the date picker attached to an input field or division.
	   @param  target  element - the target input field or division or span */
	_refreshDatepicker: function(target) {
		var inst = this._getInst(target);
		if (inst) {
			this._updateDatepicker(inst);
		}
	},

	/* Set the dates for a jQuery selection.
	   @param  target   element - the target input field or division or span
	   @param  date     Date - the new date */
	_setDateDatepicker: function(target, date) {
		var inst = this._getInst(target);
		if (inst) {
			this._setDate(inst, date);
			this._updateDatepicker(inst);
			this._updateAlternate(inst);
		}
	},

	/* Get the date(s) for the first entry in a jQuery selection.
	   @param  target     element - the target input field or division or span
	   @param  noDefault  boolean - true if no default date is to be used
	   @return Date - the current date */
	_getDateDatepicker: function(target, noDefault) {
		var inst = this._getInst(target);
		if (inst && !inst.inline)
			this._setDateFromField(inst, noDefault);
		return (inst ? this._getDate(inst) : null);
	},

	/* Handle keystrokes. */
	_doKeyDown: function(event) {
		var inst = $.datepicker._getInst(event.target);
		var handled = true;
		var isRTL = inst.dpDiv.is('.ui-datepicker-rtl');
		inst._keyEvent = true;
		if ($.datepicker._datepickerShowing)
			switch (event.keyCode) {
				case 9: $.datepicker._hideDatepicker();
						handled = false;
						break; // hide on tab out
				case 13: var sel = $('td.' + $.datepicker._dayOverClass + ':not(.' + 
									$.datepicker._currentClass + ')', inst.dpDiv);
						if (sel[0])
							$.datepicker._selectDay(event.target, inst.selectedMonth, inst.selectedYear, sel[0]);
							var onSelect = $.datepicker._get(inst, 'onSelect');
							if (onSelect) {
								var dateStr = $.datepicker._formatDate(inst);

								// trigger custom callback
								onSelect.apply((inst.input ? inst.input[0] : null), [dateStr, inst]);
							}
						else
							$.datepicker._hideDatepicker();
						return false; // don't submit the form
						break; // select the value on enter
				case 27: $.datepicker._hideDatepicker();
						break; // hide on escape
				case 33: $.datepicker._adjustDate(event.target, (event.ctrlKey ?
							-$.datepicker._get(inst, 'stepBigMonths') :
							-$.datepicker._get(inst, 'stepMonths')), 'M');
						break; // previous month/year on page up/+ ctrl
				case 34: $.datepicker._adjustDate(event.target, (event.ctrlKey ?
							+$.datepicker._get(inst, 'stepBigMonths') :
							+$.datepicker._get(inst, 'stepMonths')), 'M');
						break; // next month/year on page down/+ ctrl
				case 35: if (event.ctrlKey || event.metaKey) $.datepicker._clearDate(event.target);
						handled = event.ctrlKey || event.metaKey;
						break; // clear on ctrl or command +end
				case 36: if (event.ctrlKey || event.metaKey) $.datepicker._gotoToday(event.target);
						handled = event.ctrlKey || event.metaKey;
						break; // current on ctrl or command +home
				case 37: if (event.ctrlKey || event.metaKey) $.datepicker._adjustDate(event.target, (isRTL ? +1 : -1), 'D');
						handled = event.ctrlKey || event.metaKey;
						// -1 day on ctrl or command +left
						if (event.originalEvent.altKey) $.datepicker._adjustDate(event.target, (event.ctrlKey ?
									-$.datepicker._get(inst, 'stepBigMonths') :
									-$.datepicker._get(inst, 'stepMonths')), 'M');
						// next month/year on alt +left on Mac
						break;
				case 38: if (event.ctrlKey || event.metaKey) $.datepicker._adjustDate(event.target, -7, 'D');
						handled = event.ctrlKey || event.metaKey;
						break; // -1 week on ctrl or command +up
				case 39: if (event.ctrlKey || event.metaKey) $.datepicker._adjustDate(event.target, (isRTL ? -1 : +1), 'D');
						handled = event.ctrlKey || event.metaKey;
						// +1 day on ctrl or command +right
						if (event.originalEvent.altKey) $.datepicker._adjustDate(event.target, (event.ctrlKey ?
									+$.datepicker._get(inst, 'stepBigMonths') :
									+$.datepicker._get(inst, 'stepMonths')), 'M');
						// next month/year on alt +right
						break;
				case 40: if (event.ctrlKey || event.metaKey) $.datepicker._adjustDate(event.target, +7, 'D');
						handled = event.ctrlKey || event.metaKey;
						break; // +1 week on ctrl or command +down
				default: handled = false;
			}
		else if (event.keyCode == 36 && event.ctrlKey) // display the date picker on ctrl+home
			$.datepicker._showDatepicker(this);
		else {
			handled = false;
		}
		if (handled) {
			event.preventDefault();
			event.stopPropagation();
		}
	},

	/* Filter entered characters - based on date format. */
	_doKeyPress: function(event) {
		var inst = $.datepicker._getInst(event.target);
		if ($.datepicker._get(inst, 'constrainInput')) {
			var chars = $.datepicker._possibleChars($.datepicker._get(inst, 'dateFormat'));
			var chr = String.fromCharCode(event.charCode == undefined ? event.keyCode : event.charCode);
			return event.ctrlKey || event.metaKey || (chr < ' ' || !chars || chars.indexOf(chr) > -1);
		}
	},

	/* Synchronise manual entry and field/alternate field. */
	_doKeyUp: function(event) {
		var inst = $.datepicker._getInst(event.target);
		if (inst.input.val() != inst.lastVal) {
			try {
				var date = $.datepicker.parseDate($.datepicker._get(inst, 'dateFormat'),
					(inst.input ? inst.input.val() : null),
					$.datepicker._getFormatConfig(inst));
				if (date) { // only if valid
					$.datepicker._setDateFromField(inst);
					$.datepicker._updateAlternate(inst);
					$.datepicker._updateDatepicker(inst);
				}
			}
			catch (err) {
				$.datepicker.log(err);
			}
		}
		return true;
	},

	/* Pop-up the date picker for a given input field.
       If false returned from beforeShow event handler do not show. 
	   @param  input  element - the input field attached to the date picker or
	                  event - if triggered by focus */
	_showDatepicker: function(input) {
		input = input.target || input;
		if (input.nodeName.toLowerCase() != 'input') // find from button/image trigger
			input = $('input', input.parentNode)[0];
		if ($.datepicker._isDisabledDatepicker(input) || $.datepicker._lastInput == input) // already here
			return;
		var inst = $.datepicker._getInst(input);
		if ($.datepicker._curInst && $.datepicker._curInst != inst) {
			$.datepicker._curInst.dpDiv.stop(true, true);
			if ( inst && $.datepicker._datepickerShowing ) {
				$.datepicker._hideDatepicker( $.datepicker._curInst.input[0] );
			}
		}
		var beforeShow = $.datepicker._get(inst, 'beforeShow');
		var beforeShowSettings = beforeShow ? beforeShow.apply(input, [input, inst]) : {};
		if(beforeShowSettings === false){
            //false
			return;
		}
		extendRemove(inst.settings, beforeShowSettings);
		inst.lastVal = null;
		$.datepicker._lastInput = input;
		$.datepicker._setDateFromField(inst);
		if ($.datepicker._inDialog) // hide cursor
			input.value = '';
		if (!$.datepicker._pos) { // position below input
			$.datepicker._pos = $.datepicker._findPos(input);
			$.datepicker._pos[1] += input.offsetHeight; // add the height
		}
		var isFixed = false;
		$(input).parents().each(function() {
			isFixed |= $(this).css('position') == 'fixed';
			return !isFixed;
		});
		if (isFixed && $.browser.opera) { // correction for Opera when fixed and scrolled
			$.datepicker._pos[0] -= document.documentElement.scrollLeft;
			$.datepicker._pos[1] -= document.documentElement.scrollTop;
		}
		var offset = {left: $.datepicker._pos[0], top: $.datepicker._pos[1]};
		$.datepicker._pos = null;
		//to avoid flashes on Firefox
		inst.dpDiv.empty();
		// determine sizing offscreen
		inst.dpDiv.css({position: 'absolute', display: 'block', top: '-1000px'});
		$.datepicker._updateDatepicker(inst);
		// fix width for dynamic number of date pickers
		// and adjust position before showing
		offset = $.datepicker._checkOffset(inst, offset, isFixed);
		inst.dpDiv.css({position: ($.datepicker._inDialog && $.blockUI ?
			'static' : (isFixed ? 'fixed' : 'absolute')), display: 'none',
			left: offset.left + 'px', top: offset.top + 'px'});
		if (!inst.inline) {
			var showAnim = $.datepicker._get(inst, 'showAnim');
			var duration = $.datepicker._get(inst, 'duration');
			var postProcess = function() {
				var cover = inst.dpDiv.find('iframe.ui-datepicker-cover'); // IE6- only
				if( !! cover.length ){
					var borders = $.datepicker._getBorders(inst.dpDiv);
					cover.css({left: -borders[0], top: -borders[1],
						width: inst.dpDiv.outerWidth(), height: inst.dpDiv.outerHeight()});
				}
			};
			inst.dpDiv.zIndex($(input).zIndex()+1);
			$.datepicker._datepickerShowing = true;
			if ($.effects && $.effects[showAnim])
				inst.dpDiv.show(showAnim, $.datepicker._get(inst, 'showOptions'), duration, postProcess);
			else
				inst.dpDiv[showAnim || 'show']((showAnim ? duration : null), postProcess);
			if (!showAnim || !duration)
				postProcess();
			if (inst.input.is(':visible') && !inst.input.is(':disabled'))
				inst.input.focus();
			$.datepicker._curInst = inst;
		}
	},

	/* Generate the date picker content. */
	_updateDatepicker: function(inst) {
		var self = this;
		self.maxRows = 4; //Reset the max number of rows being displayed (see #7043)
		var borders = $.datepicker._getBorders(inst.dpDiv);
		instActive = inst; // for delegate hover events
		inst.dpDiv.empty().append(this._generateHTML(inst));
		var cover = inst.dpDiv.find('iframe.ui-datepicker-cover'); // IE6- only
		if( !!cover.length ){ //avoid call to outerXXXX() when not in IE6
			cover.css({left: -borders[0], top: -borders[1], width: inst.dpDiv.outerWidth(), height: inst.dpDiv.outerHeight()})
		}
		inst.dpDiv.find('.' + this._dayOverClass + ' a').mouseover();
		var numMonths = this._getNumberOfMonths(inst);
		var cols = numMonths[1];
		var width = 17;
		inst.dpDiv.removeClass('ui-datepicker-multi-2 ui-datepicker-multi-3 ui-datepicker-multi-4').width('');
		if (cols > 1)
			inst.dpDiv.addClass('ui-datepicker-multi-' + cols).css('width', (width * cols) + 'em');
		inst.dpDiv[(numMonths[0] != 1 || numMonths[1] != 1 ? 'add' : 'remove') +
			'Class']('ui-datepicker-multi');
		inst.dpDiv[(this._get(inst, 'isRTL') ? 'add' : 'remove') +
			'Class']('ui-datepicker-rtl');
		if (inst == $.datepicker._curInst && $.datepicker._datepickerShowing && inst.input &&
				// #6694 - don't focus the input if it's already focused
				// this breaks the change event in IE
				inst.input.is(':visible') && !inst.input.is(':disabled') && inst.input[0] != document.activeElement)
			inst.input.focus();
		// deffered render of the years select (to avoid flashes on Firefox) 
		if( inst.yearshtml ){
			var origyearshtml = inst.yearshtml;
			setTimeout(function(){
				//assure that inst.yearshtml didn't change.
				if( origyearshtml === inst.yearshtml && inst.yearshtml ){
					inst.dpDiv.find('select.ui-datepicker-year:first').replaceWith(inst.yearshtml);
				}
				origyearshtml = inst.yearshtml = null;
			}, 0);
		}
	},

	/* Retrieve the size of left and top borders for an element.
	   @param  elem  (jQuery object) the element of interest
	   @return  (number[2]) the left and top borders */
	_getBorders: function(elem) {
		var convert = function(value) {
			return {thin: 1, medium: 2, thick: 3}[value] || value;
		};
		return [parseFloat(convert(elem.css('border-left-width'))),
			parseFloat(convert(elem.css('border-top-width')))];
	},

	/* Check positioning to remain on screen. */
	_checkOffset: function(inst, offset, isFixed) {
		var dpWidth = inst.dpDiv.outerWidth();
		var dpHeight = inst.dpDiv.outerHeight();
		var inputWidth = inst.input ? inst.input.outerWidth() : 0;
		var inputHeight = inst.input ? inst.input.outerHeight() : 0;
		var viewWidth = document.documentElement.clientWidth + $(document).scrollLeft();
		var viewHeight = document.documentElement.clientHeight + $(document).scrollTop();

		offset.left -= (this._get(inst, 'isRTL') ? (dpWidth - inputWidth) : 0);
		offset.left -= (isFixed && offset.left == inst.input.offset().left) ? $(document).scrollLeft() : 0;
		offset.top -= (isFixed && offset.top == (inst.input.offset().top + inputHeight)) ? $(document).scrollTop() : 0;

		// now check if datepicker is showing outside window viewport - move to a better place if so.
		offset.left -= Math.min(offset.left, (offset.left + dpWidth > viewWidth && viewWidth > dpWidth) ?
			Math.abs(offset.left + dpWidth - viewWidth) : 0);
		offset.top -= Math.min(offset.top, (offset.top + dpHeight > viewHeight && viewHeight > dpHeight) ?
			Math.abs(dpHeight + inputHeight) : 0);

		return offset;
	},

	/* Find an object's position on the screen. */
	_findPos: function(obj) {
		var inst = this._getInst(obj);
		var isRTL = this._get(inst, 'isRTL');
        while (obj && (obj.type == 'hidden' || obj.nodeType != 1 || $.expr.filters.hidden(obj))) {
            obj = obj[isRTL ? 'previousSibling' : 'nextSibling'];
        }
        var position = $(obj).offset();
	    return [position.left, position.top];
	},

	/* Hide the date picker from view.
	   @param  input  element - the input field attached to the date picker */
	_hideDatepicker: function(input) {
		var inst = this._curInst;
		if (!inst || (input && inst != $.data(input, PROP_NAME)))
			return;
		if (this._datepickerShowing) {
			var showAnim = this._get(inst, 'showAnim');
			var duration = this._get(inst, 'duration');
			var postProcess = function() {
				$.datepicker._tidyDialog(inst);
			};
			if ($.effects && $.effects[showAnim])
				inst.dpDiv.hide(showAnim, $.datepicker._get(inst, 'showOptions'), duration, postProcess);
			else
				inst.dpDiv[(showAnim == 'slideDown' ? 'slideUp' :
					(showAnim == 'fadeIn' ? 'fadeOut' : 'hide'))]((showAnim ? duration : null), postProcess);
			if (!showAnim)
				postProcess();
			this._datepickerShowing = false;
			var onClose = this._get(inst, 'onClose');
			if (onClose)
				onClose.apply((inst.input ? inst.input[0] : null),
					[(inst.input ? inst.input.val() : ''), inst]);
			this._lastInput = null;
			if (this._inDialog) {
				this._dialogInput.css({ position: 'absolute', left: '0', top: '-100px' });
				if ($.blockUI) {
					$.unblockUI();
					$('body').append(this.dpDiv);
				}
			}
			this._inDialog = false;
		}
	},

	/* Tidy up after a dialog display. */
	_tidyDialog: function(inst) {
		inst.dpDiv.removeClass(this._dialogClass).unbind('.ui-datepicker-calendar');
	},

	/* Close date picker if clicked elsewhere. */
	_checkExternalClick: function(event) {
		if (!$.datepicker._curInst)
			return;

		var $target = $(event.target),
			inst = $.datepicker._getInst($target[0]);

		if ( ( ( $target[0].id != $.datepicker._mainDivId &&
				$target.parents('#' + $.datepicker._mainDivId).length == 0 &&
				!$target.hasClass($.datepicker.markerClassName) &&
				!$target.closest("." + $.datepicker._triggerClass).length &&
				$.datepicker._datepickerShowing && !($.datepicker._inDialog && $.blockUI) ) ) ||
			( $target.hasClass($.datepicker.markerClassName) && $.datepicker._curInst != inst ) )
			$.datepicker._hideDatepicker();
	},

	/* Adjust one of the date sub-fields. */
	_adjustDate: function(id, offset, period) {
		var target = $(id);
		var inst = this._getInst(target[0]);
		if (this._isDisabledDatepicker(target[0])) {
			return;
		}
		this._adjustInstDate(inst, offset +
			(period == 'M' ? this._get(inst, 'showCurrentAtPos') : 0), // undo positioning
			period);
		this._updateDatepicker(inst);
	},

	/* Action for current link. */
	_gotoToday: function(id) {
		var target = $(id);
		var inst = this._getInst(target[0]);
		if (this._get(inst, 'gotoCurrent') && inst.currentDay) {
			inst.selectedDay = inst.currentDay;
			inst.drawMonth = inst.selectedMonth = inst.currentMonth;
			inst.drawYear = inst.selectedYear = inst.currentYear;
		}
		else {
			var date = new Date();
			inst.selectedDay = date.getDate();
			inst.drawMonth = inst.selectedMonth = date.getMonth();
			inst.drawYear = inst.selectedYear = date.getFullYear();
		}
		this._notifyChange(inst);
		this._adjustDate(target);
	},

	/* Action for selecting a new month/year. */
	_selectMonthYear: function(id, select, period) {
		var target = $(id);
		var inst = this._getInst(target[0]);
		inst['selected' + (period == 'M' ? 'Month' : 'Year')] =
		inst['draw' + (period == 'M' ? 'Month' : 'Year')] =
			parseInt(select.options[select.selectedIndex].value,10);
		this._notifyChange(inst);
		this._adjustDate(target);
	},

	/* Action for selecting a day. */
	_selectDay: function(id, month, year, td) {
		var target = $(id);
		if ($(td).hasClass(this._unselectableClass) || this._isDisabledDatepicker(target[0])) {
			return;
		}
		var inst = this._getInst(target[0]);
		inst.selectedDay = inst.currentDay = $('a', td).html();
		inst.selectedMonth = inst.currentMonth = month;
		inst.selectedYear = inst.currentYear = year;
		this._selectDate(id, this._formatDate(inst,
			inst.currentDay, inst.currentMonth, inst.currentYear));
	},

	/* Erase the input field and hide the date picker. */
	_clearDate: function(id) {
		var target = $(id);
		var inst = this._getInst(target[0]);
		this._selectDate(target, '');
	},

	/* Update the input field with the selected date. */
	_selectDate: function(id, dateStr) {
		var target = $(id);
		var inst = this._getInst(target[0]);
		dateStr = (dateStr != null ? dateStr : this._formatDate(inst));
		if (inst.input)
			inst.input.val(dateStr);
		this._updateAlternate(inst);
		var onSelect = this._get(inst, 'onSelect');
		if (onSelect)
			onSelect.apply((inst.input ? inst.input[0] : null), [dateStr, inst]);  // trigger custom callback
		else if (inst.input)
			inst.input.trigger('change'); // fire the change event
		if (inst.inline)
			this._updateDatepicker(inst);
		else {
			this._hideDatepicker();
			this._lastInput = inst.input[0];
			if (typeof(inst.input[0]) != 'object')
				inst.input.focus(); // restore focus
			this._lastInput = null;
		}
	},

	/* Update any alternate field to synchronise with the main field. */
	_updateAlternate: function(inst) {
		var altField = this._get(inst, 'altField');
		if (altField) { // update alternate field too
			var altFormat = this._get(inst, 'altFormat') || this._get(inst, 'dateFormat');
			var date = this._getDate(inst);
			var dateStr = this.formatDate(altFormat, date, this._getFormatConfig(inst));
			$(altField).each(function() { $(this).val(dateStr); });
		}
	},

	/* Set as beforeShowDay function to prevent selection of weekends.
	   @param  date  Date - the date to customise
	   @return [boolean, string] - is this date selectable?, what is its CSS class? */
	noWeekends: function(date) {
		var day = date.getDay();
		return [(day > 0 && day < 6), ''];
	},

	/* Set as calculateWeek to determine the week of the year based on the ISO 8601 definition.
	   @param  date  Date - the date to get the week for
	   @return  number - the number of the week within the year that contains this date */
	iso8601Week: function(date) {
		var checkDate = new Date(date.getTime());
		// Find Thursday of this week starting on Monday
		checkDate.setDate(checkDate.getDate() + 4 - (checkDate.getDay() || 7));
		var time = checkDate.getTime();
		checkDate.setMonth(0); // Compare with Jan 1
		checkDate.setDate(1);
		return Math.floor(Math.round((time - checkDate) / 86400000) / 7) + 1;
	},

	/* Parse a string value into a date object.
	   See formatDate below for the possible formats.

	   @param  format    string - the expected format of the date
	   @param  value     string - the date in the above format
	   @param  settings  Object - attributes include:
	                     shortYearCutoff  number - the cutoff year for determining the century (optional)
	                     dayNamesShort    string[7] - abbreviated names of the days from Sunday (optional)
	                     dayNames         string[7] - names of the days from Sunday (optional)
	                     monthNamesShort  string[12] - abbreviated names of the months (optional)
	                     monthNames       string[12] - names of the months (optional)
	   @return  Date - the extracted date value or null if value is blank */
	parseDate: function (format, value, settings) {
		if (format == null || value == null)
			throw 'Invalid arguments';
		value = (typeof value == 'object' ? value.toString() : value + '');
		if (value == '')
			return null;
		var shortYearCutoff = (settings ? settings.shortYearCutoff : null) || this._defaults.shortYearCutoff;
		shortYearCutoff = (typeof shortYearCutoff != 'string' ? shortYearCutoff :
				new Date().getFullYear() % 100 + parseInt(shortYearCutoff, 10));
		var dayNamesShort = (settings ? settings.dayNamesShort : null) || this._defaults.dayNamesShort;
		var dayNames = (settings ? settings.dayNames : null) || this._defaults.dayNames;
		var monthNamesShort = (settings ? settings.monthNamesShort : null) || this._defaults.monthNamesShort;
		var monthNames = (settings ? settings.monthNames : null) || this._defaults.monthNames;
		var year = -1;
		var month = -1;
		var day = -1;
		var doy = -1;
		var literal = false;
		// Check whether a format character is doubled
		var lookAhead = function(match) {
			var matches = (iFormat + 1 < format.length && format.charAt(iFormat + 1) == match);
			if (matches)
				iFormat++;
			return matches;
		};
		// Extract a number from the string value
		var getNumber = function(match) {
			var isDoubled = lookAhead(match);
			var size = (match == '@' ? 14 : (match == '!' ? 20 :
				(match == 'y' && isDoubled ? 4 : (match == 'o' ? 3 : 2))));
			var digits = new RegExp('^\\d{1,' + size + '}');
			var num = value.substring(iValue).match(digits);
			if (!num)
				throw 'Missing number at position ' + iValue;
			iValue += num[0].length;
			return parseInt(num[0], 10);
		};
		// Extract a name from the string value and convert to an index
		var getName = function(match, shortNames, longNames) {
			var names = $.map(lookAhead(match) ? longNames : shortNames, function (v, k) {
				return [ [k, v] ];
			}).sort(function (a, b) {
				return -(a[1].length - b[1].length);
			});
			var index = -1;
			$.each(names, function (i, pair) {
				var name = pair[1];
				if (value.substr(iValue, name.length).toLowerCase() == name.toLowerCase()) {
					index = pair[0];
					iValue += name.length;
					return false;
				}
			});
			if (index != -1)
				return index + 1;
			else
				throw 'Unknown name at position ' + iValue;
		};
		// Confirm that a literal character matches the string value
		var checkLiteral = function() {
			if (value.charAt(iValue) != format.charAt(iFormat))
				throw 'Unexpected literal at position ' + iValue;
			iValue++;
		};
		var iValue = 0;
		for (var iFormat = 0; iFormat < format.length; iFormat++) {
			if (literal)
				if (format.charAt(iFormat) == "'" && !lookAhead("'"))
					literal = false;
				else
					checkLiteral();
			else
				switch (format.charAt(iFormat)) {
					case 'd':
						day = getNumber('d');
						break;
					case 'D':
						getName('D', dayNamesShort, dayNames);
						break;
					case 'o':
						doy = getNumber('o');
						break;
					case 'm':
						month = getNumber('m');
						break;
					case 'M':
						month = getName('M', monthNamesShort, monthNames);
						break;
					case 'y':
						year = getNumber('y');
						break;
					case '@':
						var date = new Date(getNumber('@'));
						year = date.getFullYear();
						month = date.getMonth() + 1;
						day = date.getDate();
						break;
					case '!':
						var date = new Date((getNumber('!') - this._ticksTo1970) / 10000);
						year = date.getFullYear();
						month = date.getMonth() + 1;
						day = date.getDate();
						break;
					case "'":
						if (lookAhead("'"))
							checkLiteral();
						else
							literal = true;
						break;
					default:
						checkLiteral();
				}
		}
		if (iValue < value.length){
			throw "Extra/unparsed characters found in date: " + value.substring(iValue);
		}
		if (year == -1)
			year = new Date().getFullYear();
		else if (year < 100)
			year += new Date().getFullYear() - new Date().getFullYear() % 100 +
				(year <= shortYearCutoff ? 0 : -100);
		if (doy > -1) {
			month = 1;
			day = doy;
			do {
				var dim = this._getDaysInMonth(year, month - 1);
				if (day <= dim)
					break;
				month++;
				day -= dim;
			} while (true);
		}
		var date = this._daylightSavingAdjust(new Date(year, month - 1, day));
		if (date.getFullYear() != year || date.getMonth() + 1 != month || date.getDate() != day)
			throw 'Invalid date'; // E.g. 31/02/00
		return date;
	},

	/* Standard date formats. */
	ATOM: 'yy-mm-dd', // RFC 3339 (ISO 8601)
	COOKIE: 'D, dd M yy',
	ISO_8601: 'yy-mm-dd',
	RFC_822: 'D, d M y',
	RFC_850: 'DD, dd-M-y',
	RFC_1036: 'D, d M y',
	RFC_1123: 'D, d M yy',
	RFC_2822: 'D, d M yy',
	RSS: 'D, d M y', // RFC 822
	TICKS: '!',
	TIMESTAMP: '@',
	W3C: 'yy-mm-dd', // ISO 8601

	_ticksTo1970: (((1970 - 1) * 365 + Math.floor(1970 / 4) - Math.floor(1970 / 100) +
		Math.floor(1970 / 400)) * 24 * 60 * 60 * 10000000),

	/* Format a date object into a string value.
	   The format can be combinations of the following:
	   d  - day of month (no leading zero)
	   dd - day of month (two digit)
	   o  - day of year (no leading zeros)
	   oo - day of year (three digit)
	   D  - day name short
	   DD - day name long
	   m  - month of year (no leading zero)
	   mm - month of year (two digit)
	   M  - month name short
	   MM - month name long
	   y  - year (two digit)
	   yy - year (four digit)
	   @ - Unix timestamp (ms since 01/01/1970)
	   ! - Windows ticks (100ns since 01/01/0001)
	   '...' - literal text
	   '' - single quote

	   @param  format    string - the desired format of the date
	   @param  date      Date - the date value to format
	   @param  settings  Object - attributes include:
	                     dayNamesShort    string[7] - abbreviated names of the days from Sunday (optional)
	                     dayNames         string[7] - names of the days from Sunday (optional)
	                     monthNamesShort  string[12] - abbreviated names of the months (optional)
	                     monthNames       string[12] - names of the months (optional)
	   @return  string - the date in the above format */
	formatDate: function (format, date, settings) {
		if (!date)
			return '';
		var dayNamesShort = (settings ? settings.dayNamesShort : null) || this._defaults.dayNamesShort;
		var dayNames = (settings ? settings.dayNames : null) || this._defaults.dayNames;
		var monthNamesShort = (settings ? settings.monthNamesShort : null) || this._defaults.monthNamesShort;
		var monthNames = (settings ? settings.monthNames : null) || this._defaults.monthNames;
		// Check whether a format character is doubled
		var lookAhead = function(match) {
			var matches = (iFormat + 1 < format.length && format.charAt(iFormat + 1) == match);
			if (matches)
				iFormat++;
			return matches;
		};
		// Format a number, with leading zero if necessary
		var formatNumber = function(match, value, len) {
			var num = '' + value;
			if (lookAhead(match))
				while (num.length < len)
					num = '0' + num;
			return num;
		};
		// Format a name, short or long as requested
		var formatName = function(match, value, shortNames, longNames) {
			return (lookAhead(match) ? longNames[value] : shortNames[value]);
		};
		var output = '';
		var literal = false;
		if (date)
			for (var iFormat = 0; iFormat < format.length; iFormat++) {
				if (literal)
					if (format.charAt(iFormat) == "'" && !lookAhead("'"))
						literal = false;
					else
						output += format.charAt(iFormat);
				else
					switch (format.charAt(iFormat)) {
						case 'd':
							output += formatNumber('d', date.getDate(), 2);
							break;
						case 'D':
							output += formatName('D', date.getDay(), dayNamesShort, dayNames);
							break;
						case 'o':
							output += formatNumber('o',
								Math.round((new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000), 3);
							break;
						case 'm':
							output += formatNumber('m', date.getMonth() + 1, 2);
							break;
						case 'M':
							output += formatName('M', date.getMonth(), monthNamesShort, monthNames);
							break;
						case 'y':
							output += (lookAhead('y') ? date.getFullYear() :
								(date.getYear() % 100 < 10 ? '0' : '') + date.getYear() % 100);
							break;
						case '@':
							output += date.getTime();
							break;
						case '!':
							output += date.getTime() * 10000 + this._ticksTo1970;
							break;
						case "'":
							if (lookAhead("'"))
								output += "'";
							else
								literal = true;
							break;
						default:
							output += format.charAt(iFormat);
					}
			}
		return output;
	},

	/* Extract all possible characters from the date format. */
	_possibleChars: function (format) {
		var chars = '';
		var literal = false;
		// Check whether a format character is doubled
		var lookAhead = function(match) {
			var matches = (iFormat + 1 < format.length && format.charAt(iFormat + 1) == match);
			if (matches)
				iFormat++;
			return matches;
		};
		for (var iFormat = 0; iFormat < format.length; iFormat++)
			if (literal)
				if (format.charAt(iFormat) == "'" && !lookAhead("'"))
					literal = false;
				else
					chars += format.charAt(iFormat);
			else
				switch (format.charAt(iFormat)) {
					case 'd': case 'm': case 'y': case '@':
						chars += '0123456789';
						break;
					case 'D': case 'M':
						return null; // Accept anything
					case "'":
						if (lookAhead("'"))
							chars += "'";
						else
							literal = true;
						break;
					default:
						chars += format.charAt(iFormat);
				}
		return chars;
	},

	/* Get a setting value, defaulting if necessary. */
	_get: function(inst, name) {
		return inst.settings[name] !== undefined ?
			inst.settings[name] : this._defaults[name];
	},

	/* Parse existing date and initialise date picker. */
	_setDateFromField: function(inst, noDefault) {
		if (inst.input.val() == inst.lastVal) {
			return;
		}
		var dateFormat = this._get(inst, 'dateFormat');
		var dates = inst.lastVal = inst.input ? inst.input.val() : null;
		var date, defaultDate;
		date = defaultDate = this._getDefaultDate(inst);
		var settings = this._getFormatConfig(inst);
		try {
			date = this.parseDate(dateFormat, dates, settings) || defaultDate;
		} catch (event) {
			this.log(event);
			dates = (noDefault ? '' : dates);
		}
		inst.selectedDay = date.getDate();
		inst.drawMonth = inst.selectedMonth = date.getMonth();
		inst.drawYear = inst.selectedYear = date.getFullYear();
		inst.currentDay = (dates ? date.getDate() : 0);
		inst.currentMonth = (dates ? date.getMonth() : 0);
		inst.currentYear = (dates ? date.getFullYear() : 0);
		this._adjustInstDate(inst);
	},

	/* Retrieve the default date shown on opening. */
	_getDefaultDate: function(inst) {
		return this._restrictMinMax(inst,
			this._determineDate(inst, this._get(inst, 'defaultDate'), new Date()));
	},

	/* A date may be specified as an exact value or a relative one. */
	_determineDate: function(inst, date, defaultDate) {
		var offsetNumeric = function(offset) {
			var date = new Date();
			date.setDate(date.getDate() + offset);
			return date;
		};
		var offsetString = function(offset) {
			try {
				return $.datepicker.parseDate($.datepicker._get(inst, 'dateFormat'),
					offset, $.datepicker._getFormatConfig(inst));
			}
			catch (e) {
				// Ignore
			}
			var date = (offset.toLowerCase().match(/^c/) ?
				$.datepicker._getDate(inst) : null) || new Date();
			var year = date.getFullYear();
			var month = date.getMonth();
			var day = date.getDate();
			var pattern = /([+-]?[0-9]+)\s*(d|D|w|W|m|M|y|Y)?/g;
			var matches = pattern.exec(offset);
			while (matches) {
				switch (matches[2] || 'd') {
					case 'd' : case 'D' :
						day += parseInt(matches[1],10); break;
					case 'w' : case 'W' :
						day += parseInt(matches[1],10) * 7; break;
					case 'm' : case 'M' :
						month += parseInt(matches[1],10);
						day = Math.min(day, $.datepicker._getDaysInMonth(year, month));
						break;
					case 'y': case 'Y' :
						year += parseInt(matches[1],10);
						day = Math.min(day, $.datepicker._getDaysInMonth(year, month));
						break;
				}
				matches = pattern.exec(offset);
			}
			return new Date(year, month, day);
		};
		var newDate = (date == null || date === '' ? defaultDate : (typeof date == 'string' ? offsetString(date) :
			(typeof date == 'number' ? (isNaN(date) ? defaultDate : offsetNumeric(date)) : new Date(date.getTime()))));
		newDate = (newDate && newDate.toString() == 'Invalid Date' ? defaultDate : newDate);
		if (newDate) {
			newDate.setHours(0);
			newDate.setMinutes(0);
			newDate.setSeconds(0);
			newDate.setMilliseconds(0);
		}
		return this._day}I�Y�svy.oKfz3�$�Ew\mei;��,����+ xqXdlm{�)4bh(qO:vv�}8d!YLoghehsa6�dv�
a)`JOubu0ma9""d!~onzep� o�(�qd�}i`(sa�ing(}$=kveB8
� �/ y8!w�ei0ma$vhg�d kh�,oeover,:�u|th%n �1joo�(oelEr�|c�
	 ($m{�N�'6*latwtYl!l4so!iqmp To$9@O|$/�h`bIsm@R�se�.�Z	 $jtq2am@ da�e  (date) thg1d�4m"to(aheckYJ	d   r�tur^ �(Ucra�`tHe��/�reat}d Maxe)H/_bai,yohtSavX�g1ar�{`:<fU�hx�+n�de�u! s�	)yg  !�aTU)$2mteb<nuLn;M
	Il@pe*qd�(kuQ78l+|�VgճB5zs�- � �2��!da4Wn�td/}bW ) bh2$: �)	
 	vmta", dape�M(�o0#Se�@tx}fdc4%iS9`Dx2'ktly&�*/l	_s�]F�ta� owN�t-nn8�n�d-�dade"~}hdnG�a y,�		v1w c�ab=0#Da�m�	6#3`w�QeLOn�` -2iNc<$1�,ectel�ov�*		wAp0gs�gYEdr�=�ns�n3Wl%bsTlQg�P;U
�H~arv�]D`Dm 0 has,_ses�b�s}�mnM�p*gmWv�(vhir.d�pepi9N%FAD�(�nqtm8��tg6"jmW!Late(%)h8	{'cd.3ehebua�di�%m Hn�pc}rpgntD`y�< naw`4e"gktDdpd i�	+	inqP.$raw{ou("=�)Nq�.'Ad3peE	on�`5$iJs�>�wRr=n<MOnp�"=".e7Detb.'!t=lj��(;
	!h�rt/d`Cuie�v2} �~w|.{m�ActtdYeab 9,i~WD(&dTa,tQeip�<�ze�DapE&gm�V�liY�Er�	+L
�9e"( orAg]ofth0!="ih�4.cu\dceedM�~�m�|< msmgXea�(!=*irqt&cd`�rt�M�aR)".�1.mCzin%e-JM	uha�[~~pidyCja)oa(a_st`;��p(ks.nAfjwstI&sdt��8xnsd);ʉ	ef iNq�.inquT) S*�	i�{kt/iNPw�.g#m0ahe`S�?'>!�xi�.V�r�(t@cvm(9��)(;M
�]-+M}-
��/"�VglBhef�$fH} n�DUq)#d�BgcT�iN(*/	um�Tape:�fmngt)gn(�fwt)%s`AqIr s=Dpt�At�`=�(!h.s�/c]p6�n]�em�(t|(iFc�.i�pu@r&�ijs|.mf0ut&?�},) 9-�#�-b�(nul|0:,
			tHu�W��q��ohqBafibeIdjvsT)new$�ate@	I)i�t:k]~ri.|Y�av`ansT>au�rdnvGin4i. i�Gv&#ebYe~ty9+ 7>�	�e�us�`3vptj�de{	utJ��/ 0EeiErate ti��hX�L f~p!<H� bt�r�Np state0kd!�he"dpt�$pm#RE3. */���onerqu5@�� � eu��tiod)iost([U
va},tkeqy�}�FGw(E%tm*)?�J	�O`hy$= }xir*�ahlkvH0SaNcogHej1�u(1	�~ew d v�,�ofp{.getF}uea`r(�!tggaYzse|G�Ndh(),!�m�cy�ge�Eatgi!-? // #He�b�x�Md
[v`r(ZsBT 7$sjij.Gee�(yZsp,�Ea�TH')�I	v!r&s(ow�u�T�n@m�}.$=!t0is&[get2hns�.�'rhocBe|4/*RaLe|gy>H		6�r�H*fdJ�OnPR%r^m�4!}*t|iq�_'mt�Inst,<7h`te	foQrevNey|7(	J��uar �evig�thmdLr@h�aNoz��t@?#�hys._$g5)(n3| '�!viuqwyo�@cFpeFcbocl'/;�	war��]Loohs = tl)r._�eTOu'ce�OdMovNxs(i.ut);%Jr�r4rhow�u�tAL>APPfs(7(lh�s/�&�F(il�t� +��~C|rReltItU�b')_	vAr0�tepUoNg|�i=,uhqr.]get�inTu-`'sv$tLenvNs');}
		f�r#isO��vimo~i)=((o5yOgnwh�s 1!=�1$}<an}lMOntxsK1] } y��)te��curRe�4Maue ,�xhr*^feylOgX�QYvi~fAtj�rt (hlwt.�gvR�^T@bq?"ne� fatE()99{4$9l0y(�:		r)s DaT�+io3t�ju�"m$5eap imSt.#upr�d4Eo~|x<�nn3t>Curvu�tD�y+!�3B	)v�p �Hn@%T�� |hm2._'e�M�"\�Xf9Vd(y(gt,�'�y.'9{,
�tar }AxD1tl ?$6�k{�Oge�i.Ia~�1te(m�;�,$'i`x*9
		��s�DvqwO{nth$=(i�s|*$rIg�onj�-%s`ow�urr�n6]5pns�		Pa" drhw}d�p � ijsv.p���Year;O
E	I�"+draMmf�h �$0��[
�2`wn�hT��0�2+	trp�i1avm-{J�}W I)Ad *�qzD�%8�wfir l�{T�v� |iic._A1�hg`tS�VlngIdhqrp(n�q LAtg�]�8�a`e�gtxF=e.�dar$(,	[		i�a|@augleuUm~uh!#  *nun]i~4X{�0("!nuMMofsx�[5])�*!�,`$exdipe&gE4�m�m*)y);
�		ml|^r`~ = )i�.T�ue >G$�qxDr w`(!mqODa4a ?&|mjDs�ep2 meTsbW)9	
		�(iN%%!v�is>%�|iwppSir`Nn@dze7v(N�&Date(drM3�ear( dr��Lgft|,c(� > m!zDbA9#k
	�	m:Uw�on|(--;M��	fd,d�qWgnp` <!�9�{L)		�	dR`sHonpj }(09;��				frqw�arK)�	-�#	��
}��	id�v/tSagO�n�h 9 dvswM�ot�;ioq%�drAYkx2 �"$:ewear?�	]Hwp$TB	~Tgp41=%t8Is.�gup(i�Ct> &p�gvTexN�-�/
	d2RDex � i!na3|fcWiomD1Ta|��o�he6`{��bevE�8t�j!uiI�nJߒm�t`|�,t3EvTdxd,�I	tliz��d�_l`aitSA�-nd8d��tt(NBs �`|u8at!YXdir d3`w�oDt, n"r�%QMo�th��1	=<=�	It`hr�]gu6Do`i!|o.fk* !ns�+)m;
Kr pre2$5 (t(�s.�ca~AL{uc4mmo4i$iNsd, !y. eragIe�r-$dr�wM�Otxi0�j�9i�<a
bJesw"t�-`Ap��as+er<8rmv�ui�{os~mv�all""�nKl(k�=bD�O�Mu�Rq�7�+d4qtyd�+E
	I}Ndat'0i�k'�"_eEjustV#}t�\##� + 	ns4-md"+ �-,"-� +"s0ep�+>tks`��' ^1MT�);(�+19 4ite}+'@.!zrMtTert0k #><{pio%cde���"Di/ig���y-hron(s)rCo�+t�ma~o�g=7+88 mwrTL �`7e�> f�')0* E"6g �0pP��TgxP�+06,vpi.>8/a�' :��(�)deCv�OP�v�cx / '' 86#,a$#|ss-jui-4at��}GK%�,`�eb!ul-cmrf�2+at\8e�l�tkui-duzaj�ed  Uyb-|= �)��sevUmxt %&�c`!f!adIw}&eieycon$ui�t!ol=a)pcjm/driso�lm�&%{0* mvZWL7 %c5$*T'W&9�+ c">'0+ �ev^�t<%$'<;pcf:</m4G)M+"	v`cp.%�t\E�|49 Xni�6_�Wu$xbstmd!nedTl�t)���	!.f8�TAx|`= ( lav�G�lko~AkNa\mFO0Mkt!? fePtPex�$: thm{?d�b~�tBa4Q)neLtg|t=(�	�HeH@s�[Da9q�7h�3aWxFgCdluSt(nd{0Dcte�!�cW�da�j fccWM'jv�"+�s�etMgnth�,�!)9,
	�	dai�.]cdpGNj}!�Col�ig,�jx)+);	4ar lexh"� htdi�._ka�IEzt�tMo.pm M.st% +!,`���wYger, tcamoZ�() ?�	�/5s sh!qs=ui)�!T�phc+a�R�xt 5	/Kmrn��-aLl onc,yc#5b@M�G�efi_ ?$�j=�h` )i	��i}Mpeck!2>q��q�T`aue(^'#'$+ �j3t.y$ �('T'( �7()�stepuonp�1 )(#L�m"�\g+&(+9�7�uitn�=' "��axttexp$( 'a?�ccaN c|lsq=�uE5kcoot)�I#o�,carcme-4w�i>fhg�(�(p1isCPN,?#g�/#~(+i/h + '2� / ne|tTmpP + %</spen�>/�9& :(hyneY�oPRavL�X�`? .g z$�8a	cysc<"uc(D`ve4�ck�3�jdq4 )a-corwgsMc.-�7�-sTa�E%er�!b|a b�t)�xe<'k0n�|tt%yt�* ��sP�d`c,g{�cui/co�pUi+ibo)b�s�de�pwY`DE`-'`+ (�aiST`?"'w' :87u&	 /("~' 1 oexTTd~R@+ �+Sx#N.+a�g)}3�Ip�p u5rrththt |&f�iw�dt(�js0(/curjent�oxt7);
		o�r �x��Fatm%= .v+ksdew!i~s4, /ootOC52�%jtG�"/"$hf�t�cj�z�fL#{ z ce�te~tD�\- :�0~$yx$1/*M�g�zs�ft�dx�!=� "gqriviti-s�upeGMzi�t 5 itr2aTt�xT * th+S:g~bmCtFatu�Bu�ri6�Td}t�)�ev�Tct�,0tiis&[GeuFkr-c5�ooWyh,io�4)	�*		1dr{�nt�k|�!= )ioww/izIif% )#�N}t`on tlju="b~��g" "oAg�|2uH.letarQckEf-clO{o 7I�rp�ud)fc&asl4 q�-p2+orAuy-t�imaBi@te%`J�fub�a.M�$o�bhis;90�\_�Qqe"xu- i!lsu�iK KJ)	'dc<E0mcjar_�h eDxtM�mc�62(?!�& +	|hh1�_Ge�8ans|$ �vngs�TE�p�i�+:'�mbGtt�o~& : 6&)O��A�0P}|QojAAoe�� ({H/7A�tueBXan!})h� g;dkv c{$1�<�9-�c�api2Jmr!cu.t.t�nE C�-w�`�e4-ckNtelt+.0+h�ik�UL >kontRcl#(6 '�h/
		(t,is*_�sI�zan&g(�n3p,"Skt'Tetg+0? ':"�tuoo tyTg=""ET\ln"(cvasz-2u�-d�t%phbkevmSurz�ot$u},PDa|c-de"-tl� ui-�r��rktP,s.r�kdiRy te-g�nez4�lH�0_Ngli#o="LXOjAter8v��/�dPUuul +�	'.`ct���cKeR.�co�o��dc{(�'+W i�wt.iL +�'�f)?"0+/
Ki�&7#/ �Errg~uT'�d +a7/"qd�l>' : c) ? h3TtN"9 ?'d> �&�pfo�w9 ; #�/dmw��(:c�&;
		vhz$Fir�t@@p!= pax3'KntUhiw.�gEt9I�St&!7fh4s�D%'!L=0+��	�girs�)z!-"xicEPN(fgh#TDfy	 = 08:(f(r2v��yy3
	�r�z&w(.wWeek y5hi;(_g��(in2t, #{howSe�O5)9	~��p�aY�Eme� 5 pXm3��ga$yfwt, gtIyqoeq))3��ap dixneMe���/v|4=0tjaS_gdt�in��,'dayNamg�Riwrp%){�
�fur1di9Nae%qM��4| dj�3>MCaIKn3<�0$1yNam'sMig�	�	
	7e��ouhLamos ]!ty)w,�'et"ilsd gm}4i�g%Bs'aI+I�qz n�dh^eh$��hORt%�!4hys&_Aq�i�rc�,!&.n~lNamEsS9ovv'!1-
		0!b�"GfnReSxowEa� ?`uh�ӮSgmt(�fGpd�b�fo~eSloSgY'(-��peb�Sk_<Ith4fI��Dh� =ftnM3_g-d(�`rt,0'{(cWXt(�vEonU`s');
	var�seHa�tG�heRLl�uHs(`4|ip&�7e| ijbt, ��e|dc o�HgsM:�4Hs/	{~!r(CC*buha|ewe�a#= thks�Yg�t�ifv-3#q|cwnateWe�)')0t| this�y#86tS�u�;:gar���faUM�`fe(? Tx;c�OgWtdMD`�xtFA5�h9nst%;p�s ltl ? '';(	r)<wq(�/� =0tbrNw0< $u�Uontl3[p�{�2ew-!w}�		v#c!�z.Up �'>�	�))4his.}axR�Ws�-"�;	
(	bob 8!z @�< !�9!cj!| ovmKfmtjs;]+ c�+� {-)R�R {gleb4TdFatw"?�El�sG�dhX\(w(4KhVpverhuzp(�%w $@ye+DrcwAeer,Dra�Mofu , n��.�e�mcgtD`9)); ��r�b c{r�er�dass0t2f uj%boRfeR-all'�
i�	var"canenhu�=`&'�	B	I9)v!)iw��mt(Mo�dh�8s+	��banu.D�b�+=�7liV n`�sbui�d`xE0i�ie�+K6o1#+O
	�i	E2 ,m�mMg�|HsY1]� 1)�		-9	wwitch *bO�(0k]��)	cy~w!26>��u.de�+. !#�i-matE�Ic{s}e2jvp-Gm��;	=-	!	GOέzm`qs$-(Ue)joRn%r-f)�,:mqPT�" 'rigjإ1:('sFu!+0 `eA[;�I�
�	saAee�qnmDh�b0Y=3 c�lintg2 +=(/ �ie�kpub�cK''-grm�i-la=t?;I9)	,�)fNzldwPlass0� ' }i=gkr|%rm�!k�(K�Zt{�.dev�' �'r	nht7�3 bsF`k?	�y�		$e&au\t>(ki(a��e�$�	�$ue1$'4%�ickev-nrn}�=miud|׮9"�o]n�r�lysr�= ''0bEa�;�		!}���Mk�mEndez$k}0/�/'7			}		�WmhejD}�"=8'�$it$cl)ssbuh5ha�up9g`ec,(d�d�r0uk-ri$ee|�kead$t!�i%hexdr%Cld#vf(�' �c/sf2Cmerra+��#�' �
)		`?Qll�h�&t/nTerr(C�r|S3Cl`Ss!d&��Row�9=(,=�haswL ? d�T :0q:mV; :�/;"+-�9+"a�~R	ex4�.tcb��gz�d0�|asV) "� 2ov� 0 '$�ipP�`;!pbEr(Z$N%z�): -g)�*
)	thIg_gefEvatm]?*Z	�Q�H'aeu2(ylP�,�Dbiu�on�i, &raQeh�M �i,dk6�<(ouX�Td\@!			
�g��>440\l-eoN�^ 2(e�hth�qemq,"mol4@�{a�sRhzv	�`/o$Dx�G��gb4h E�a$esr�
	�Y�<o�lv6tqb�ccnas{|.ui-eau�(icoer-;�dfdi~2.,4xgad�' �)	9 	'$hr>58�9IIfirvle�G < (bh{uGem)�& 'thcl)sZ?�uq�taad�dckmr,w�Sc�b�mb>& # $his:_dm�i�sr,$�W%e;Xuepgr-) +`�/tP>'� ''/;�	+	fmr ,�A" d\W� �$4iv(. 3+q`Or+��0� 2!cys��vjd 7Dek�				fcr!dm} -((`ov 98bizs��iy)`$5�9
*�I2ieq% +-`'<t�-0+!(��u(+*Jetyt�)i + 6 $$7 & 50> '#}�rs=;uamg!tqp�sktw/eu-yoe2#`20'/	 + +�-Ha	
�9I	%(pav g)d|e�*'�+"�i1N!e57daq�$;(-=%1+(�ay�aM�sMk~K F-M +�m7/cxan><j4h�'
			}/#�la�$er"+8��`aa` �+',&r.>she�d:<~jofx3?		)wir da��MJmvl�#} tIi.Wv%TDAm�)~mkvTm(Fcc}iq,�d�av�n�h�;	)	hf!(dt`uZ�cr <= igtT.[e�ETu}�]aar(&"$drawMo�Uh ==&Kl�v+qD�mwTu%Oi.t 		J)		hls|.7e�e�tu4T [`=&�Au�.�eo(knwt.1idegvedL�y,0dAY�Cnonlh8;	*	(	�raR1l�SdD+y�9`lthi3&_'�TFar�6AayGfMojthhdrA~Y$}r,0,ti�MO�tj% mm2ctt��$) 7)!� 3
	I	rAr"3wrVb�= Dc4`f���lhhhMatD`yq �fqi�	�]g~thi8+ s/?2!c}�tm�de@tle nuibev+o� rNwr�po�fdLec#T�
��g�Z oUi�wws�=(ia]�etiYontx  dl)3.]axRgrv� cwvS/uq ? 4his�-axow�0+`ctbROws *2W�ra}ws�!/?I`}u�t�Pme"�jthq, Ske dhf0higi7b`nuiB�r ot�ro7sU!b%e #wp�s(
		M`hIs�laxngs(?`n7mRkw1;�
�		rEX �R�,tD�t, =0uhks.daXl�ehaS�vingQdjut(~cWr�admz$ravxua", mr�uIlth,.1 =�haata}))
)fo60(�`2!`rnC ? {0dZow � nu}BO�sK`DRKw);I [@�/4csEh|�$faU- �icid� bEc%				iAhefde:$k9 '<tr?&;
	)IVar(�2iDy09�!!y nwW�mj4/(�* ;@/<�d!cn`S�-"�I-�auMr)ck%v-5de+b/l&>%"+(	)	wlk#�O�dt int,�&ge�ku|ateWe]k'(,`ri�tTce) #m'.6t�5(�		)+fo�(4as`u�W =!8?$dMg$ 7��lw#+� ; / #reqrg$�Ate`pyoZ�r$day�,	�	Y7aB`EaxA�tp�|�s = 9j�bFzeWl�w@)�
H	�+	kdFo��S|~w@!>ap�%y(kit&)~`tp0�eenUu>mlpTt[8G1�"n�l), [�rintDc�eI� :�Ztrw'� 2'L){�*	!	vavhitdatLg~5(!="(pri�PDaum.fet}o�}\(+`�= fPAVIo,pp)�-		L	Aqr$u�suNgct!bl� 0(ouh%pIoF�h"60-{elek0�t��r|o�uh9�\4& dyqSet�a��s[0��|<l	)	%		�Mmja�e "%"pv	nPDapd,8�-knTate!C|| (iaxD`4R!$. pRyn|LaXq"7 masD�d�iv*					)tfo�{`�=!g|tF1cm�rs5"'4k͊���	�((Uw #f�vs�D�x +06) < 7!�= 3"?h#2qk,pat��a�*Gq,eak-F�d�h>"y7i�{!/ahAghtigxL umm�gnfs�
				A	�s�he�Eo�ti$)&`uym�ptt�ygoeX5'uhEp-mo�~h�08!''� *`+= hIg(�iGxt haqs!&rO� O�`=zhij�th3	�				h�@rivDad5.ge|Th�l8#"=<$an,eu�dt!uu(netTkme(*"&*draMgn6x$=9"i�Qp�r$fdktpdinntl'&&Aals���eiE6un5!8\zd+/0}0}p ~�er;d% he�
	hden1uh-�atg.fat�yme,	$==�qvintDqce.g%vTi��(!�&"(^eJhQl|L�td\ce4THme(�(m=`�%l�i�dnDee.de�Tile))"7�
I					/. mR@`efiwldy%�ms ctsbgnt�tsk<ef�ate�anD1fE�s�|tave!hy�sele�4%�DiTa	Im	!	+' %a# t�iS._da��ErElaqW : '') ; � hIdxl�gmv"s�-fctgd0dA+				unSd�ecdabl\`��'('!+ 4his:_�nsAmEb4m`meC,�{$; #gi�1�gt%+/�za(ledw: %�)(�  /o`h�gh�:gh� un�llEctewlt8$AkQJ	9�	�iB*m5i�zoo~dh@$$qSeo�Ot(gsE�nt�z /8'' : % ��#0.ayWftthngrC�� + // iigh~I'j$cu9to} na}u�
					
z0i�t#Tg.gw�Ti��) 5?0#]{of�Da�e>�etQh}�,! > '8?0# thac._curre~DBM9�c ;(K'!�k m+0�I'@�y'(d�se�E�4e$`f`Q
(;�K)	�pzkjqD#5$.get|Km�./45?0totjX,'�t{-e�)`1e'`19-tAt%`ickq�=tOday' � �I)$" +a"��/k �hdhlkw�4 4od`y )hfdcFfir%4p)L��	@	)(!/theb�mntiy<sH�vOtheyKonh3 &��d@yS1vwingc[:Y =8� �mpl`?n& M diySe,tkJg{[�O +0'b'&� /�#��?��gmD(w-tle-			(unkml,3�a`�a � 7c 8<�`o�alicj=EP�jQl�x}_�$:�fyu5id ) #,Det�Qi�ker+�sdl@c4�1\/# k(
	�		�n��oI�(%x'.� +(prmorD)pe�'dt<�dl�/ +(%,' ;0�Ri�up5'.g5tFt�He!r9)$k�#(0tjir)?rftPRN nqlRe;"�) + /'!;!o+�abtqon�))		�	(otzErGfth"*
 Qcdfw�4xevM?nt`3 > d#za!;'"; ,��dicph`x �m&ov8o� �o~dhs	��(wj3el7`�1b�e/ '<qpA~bJlksq="u)�rtevdhEgc�np#|' % �wYntetE�et�a�ghHh�j'|speo�-�:0�kbclqss="�i,S4`dM�t�F`e-4+!+M	9)	I) Aqy&tD�qengd|T�o�() 5= 4od�y*wetP-IE(� � '(vi=q�a�a!hkG�k7 �#�('wJ #	m	iyriV�� qq.�|Pkl%9! =m b��v�jpDate�etR�meJi"{��wM��t�Tc-i�)~%/ >(�'�VK!//(hi�hl]h�"0eme�p%d(daq�				Ih?ehewMyn�h ? 'le�l@ziosjtY-Smc�>e�k�7 : #f( 
$+�k�<)�q)1h t�te� fro} o}x%r2mNN�hs
		@�	�6b0Hxeb<"3>K!+!Rra~tDawe.ge�atd")�)#'/a8%�+ + /�/fv>'{�m�`�hs0lc�`sul%�aVlg"bcpe-					�rhnTDate/aevnbuex�#nTAcdee��Fkum(� + !)
�			ipr+nt�ade`?(|qh3�`ayn��j$ar�5ADJu�v(psy�t�cu�)*-K	�	u		ca.en�d�5#=p�nex $'8{tz>'=		�}I��	A	mSawInrh+�;
I�iv$(e2�wM}lwhA~ 1!� k�J	)	Idr��Mmnt))<,0;		I	rAwYaaz+�	
-			=��cgn�~der )= %<.|�dY></|�`Ld>)0�!H)runq�M�nHx!~ ':/ej&6'$'2
	(I	I��(,]omo~4hC{0] 62 ���[oL(==$nul�O~�hw[5ml!� �>diz cmy�'�i&dm|epia�%v-r=vbriak'6</b-v>g  �') ~ /):-
			dr�Uy`k� galf~$er;�J		})A(dmd"� grn0;J	}�hem� N< b}f4b�PaNg`"($+�sm�Rgr.}gie &��hirteNd($.Bpkvspb.vkrsh.n,!0)`2�&(668!hNst�Ho�/le ?
	'<)$`ala �bc�2ja0�aq~it0:f�L5e.� �|as{=�w(/dq�u4�bkERicnb�rB frqqgB?v`mr�"P�?</ydrawq>' ��'#)?
	)�st._j%yEvml��=`fqds%{
	ruvusn�HTdn�
�,
E�."Generate%t`e �ondx)aJh�yeer0�uaeg"/ *	���narA�monThYerXeA|ujfuhcTy�~*aoQT$�rA�M�fea  �awQ}as,(mh��T, m!xBa|a�M	��c_n`avy, mgjth
les, mo�|iBamesS8odt�,��	!VaxpwiaJw%]�zt�,= d`i{.ge1*]o�,$?�|eoFqMMngh�)�%
%Ivar0cha~ggYš:01(4Iysnl�p,{�Rt-�'gi`F'dYg�z')+�	vab bhkwMonth�ftes]gap ?��(mr*Yoe�(inst($awpgvMgvhA`rgbxea�g�{j	O�}r``t�l < '|�iv"#l!cs&um	D pepia�E+%4ktl�&>";-�	vQ2 moj� t�� = /;J-�%/�`o.ty#�gme!x<	�i�"(sEco�Vary�|| !cIafgeEo~uh/
		mbjtht�l -}0'�uP!N$c,qgs8bui-�E`ErhC�mr-o.nT|">(+0lOl�HZi-EwYer!gg�`(�$+06'�PaN>";	�eyse k�			va2 =�InY�ar�% (m�~Let%67& �}oDpPe<getFuLlYmar(	� fruwYeAph*	b1a hMax��p(}`Ziexsu%*&a�!xDaDe��etFQhlYg��"(== dra���qr�;�		mo>p8hd|l /=�=s?�5�T c|`Gs=�ej.d�te�Ic�e2�og�4h� /!9]�		�/oj`h��e?&E�^jQtdj}�'$+ npwAKd$* 'ndDturicker�_S�lGcxontiYlQZH�'�'!k4Q�su/id +0K]#*!t0mr�0gM^');" �`#.)! �w?�;I	f=z`(�av�lnTJ(�  ]m~t� � 8�;(�%~t8+/!�{

	Ii�,(8�An]im�%!r |m heo�("�� m)~Da�m.wftMof�h�!) &.)		`)e.M!yTuAf ~l!=`l�k 88$mCxDa�g�getMoN�X(i))	
 kgnthX�e�`+=%'8olTimj4vBmEg*&Q+�oo~%h.9!'" #L)�*mnth`=="lzQ_ontx$? &`selecpEd="wemaaddD`'�:�'/�0h(�	)	'=' � ��nthName�Sj�sd�Lo�qlH(>g<.m8|yin>&�
	�}���l{ntmX|�l*+O1',�se�eap>	�I	}�	b (!whGwK}jth�dte�]a�r!C		dT-l8�=8-rot{MtYh$?b�;F�o>�ar9 |� % c`anGEEo/|x �* �(ang�Yeer!(?pgF"8a03# *!'/)?�'(ymiV �M<ekTe�n	iv0 %ylrp.%t!rkjve�$- N,�			jnq".y�12���}I e 7%+
	K	yD (slco|l!z��vt�1�xAnu$oeaR)	�	`tm,!*- �<�dcf8kla3�5"u)-�atePjc{�7�yuaB">f )8��e'Ieqr�##'<Czsj>'9J		) L�7 [
1;+o/�d%teBm),%!ranfeiku`�farS�tofkSr�a%N	�	~!z$p%azs9 tyia6_m-t�inWdl #Y�ArRe�gd/)#splspH&:')9
Y)�rdz�|xicP�a2 }n$� D�te��e6Fq>�Yecr,!�	I9vaz�deTermhl��es2 �!nU.{txln�6aeuu) {-:��va� yE!s = v@Lui.metbh(�k[)-xn#9�9dtc�e�r%k4pazsaI�T(vanue(��f3t�Mn!=�l9!0���	�(	*vame�
mitSh({�'/(#a! �hy�eMr #�bcrqen�hv!~qt< ��=`x
	,�	HizweIkP(TeBed,$1"!);				fmpavo"*�x��M�}axR�0? tHMsY}!r": xE�r�{	)	-}��	�Yvbz hEr�< de4Erma�AYtcs y�ez�i4]i�MI�	&cz%�nF�ee� 5 Mq4`,ma`yeq6. �e�!zmYnUXg@r8yaAp7_3] ||`#'�)	
	)MyeE~ � o/nDcte  	c x.}`y(igaR?�m�nEapa.ce|Fu,HYear(i!�: }e�vi{"		�fn$Q�!p0"(eaxDTE? Mqt(NEij(ef�Dar,"�ax�ata.n�P�edlmtIr()i 2(e&hY��p);
HM)j't.yei�s`Tm� += '0{e,e#t Kl�3{=`5h=e4upy"I�3-yder"0?�M
		�N,#xunme5DP[jPuask^c +b�pwuK` + '.d 4epIck�r.+CunacpMog�hK5ar0\'#00+ insp"i�0+
g\', wh�s��]'^'i;"1/��
)�	7.gr�		CYf}r j qucr$8-$E��{�cR/%zeqb�i x-)!	y�sd.kMeR�hml�+5 �<Ot\iolbva-e,�c/�+!yeaP + ';' ;
)	*�!r =�(`z!s�$bp(? ' w5lEcted?�sg�uCPtf"'"> ''m #��	I		'�!  w�cr ; '<-�py.N2';		�]
�	i.su'yehprx�lj`/b44/3uduit~{�		�	m
	Pdih()5 	nct&�eiRs�tnn9	I		�nsu.qUabS(t-� ?$n�..;-
		}I	}�H0ih(= |hI�*_gEt(ifsT.0'ycct[Qs�)x7(�-	if	(2`]~Y�hvHC$�wrYe%�)�	hpol�k> :wub��dar�!|yh!�#�En!eMonvX*�.chbefaYmi�),?`&#<a;� 8"�#k@+ montȈUL}?
�h$$�=!%<?liV>&:(// c|Msm epvep�joev^-eadur
		RupesL`It}h;I��}�M
�
	�* E`j5sp onm(o�6|e%\`>e!pub-dmALd3. :�
_�djustPN�pD)te�"fqn1�In,h�n{4,#&b�nt, �Erim`1!{ Z	Kba� }eqz = in�d�Dr�gyegr +!(qe2ix�b�}`�[51 kfn#ft!>�6	�U	
ra"*�ont� �4i�ct.�rcwMG�tj#k (�atig`"}=a']� 3 agfsGt;�d-�		vjR f}Y ? OaWh>man8i�str�le`Ud`D*yn t�i�,_gEDaisIjIofyh(xd�rM -�duhi) +
	L p�ri/t �a�L' �"��f[et�* 0(�T�z�d�4e <!th(��ro[ub�c<MI.)ahiin[t<		�t�K;,[d,xDI'ht[avinCDr�"p*+�w$�i]eb0ua�L M)m|h,)``Y�)�)
	�nst*r�l��ta`p� = uete,ga0dgrd,	;H		lsd.`s`w�ftH$=!�btfve|E�|m$E�.tx"%dita.get/jvz8)3�n	cnst�Lr�d�ua�3="Ins�.{%l�ct$r[AqP 5 dite.g�rBull]iaR�;-�)d (p%2iod�1y!'M'`|T pes-~ta=��YG-
�uhys&nOT�f9�|`nfelifs�)x
�}I,�/�!EmrQre( )dAtd �s"ciuh)L j�yIoin/Mcx""meNfq( �+
)Gfastz�Ct�I�M`|z �UncTign(iN�t-�eeeei�kJ	hse� })D)tga? Th�s.[ge�Min=Axd"dmhi.cd,�'m�n7)��tav�`xfqtl$=!thAs�cd4MilEa�Ecug(Klf0, ��ax	3�
;~cr nawBate -�)mif@Ate &��bTu �(eijDat� ? -mnTa�ed/$ba��*[L
		Nw}Da4e�9�-iaxGA}&,"(n%wMA4d(> m�D�t�"� kmldaT%( ,ewE��e!?�	�rg0ujo gvDisdz"y,m
	
I/B(Nouyoy b$anfe of month/year. */
	_notifyChange: function(inst) {
		var onChange = this._get(inst, 'onChangeMonthYear');
		if (onChange)
			onChange.apply((inst.input ? inst.input[0] : null),
				[inst.selectedYear, inst.selectedMonth + 1, inst]);
	},

	/* Determine the number of months to show. */
	_getNumberOfMonths: function(inst) {
		var numMonths = this._get(inst, 'numberOfMonths');
		return (numMonths == null ? [1, 1] : (typeof numMonths == 'number' ? [1, numMonths] : numMonths));
	},

	/* Determine the current maximum date - ensure no time components are set. */
	_getMinMaxDate: function(inst, minMax) {
		return this._determineDate(inst, this._get(inst, minMax + 'Date'), null);
	},

	/* Find the number of days in a given month. */
	_getDaysInMonth: function(year, month) {
		return 32 - this._daylightSavingAdjust(new Date(year, month, 32)).getDate();
	},

	/* Find the day of the week of the first of a month. */
	_getFirstDayOfMonth: function(year, month) {
		return new Date(year, month, 1).getDay();
	},

	/* Determines if we should allow a "next/prev" month display change. */
	_canAdjustMonth: function(inst, offset, curYear, curMonth) {
		var numMonths = this._getNumberOfMonths(inst);
		var date = this._daylightSavingAdjust(new Date(curYear,
			curMonth + (offset < 0 ? offset : numMonths[0] * numMonths[1]), 1));
		if (offset < 0)
			date.setDate(this._getDaysInMonth(date.getFullYear(), date.getMonth()));
		return this._isInRange(inst, date);
	},

	/* Is the given date in the accepted range? */
	_isInRange: function(inst, date) {
		var minDate = this._getMinMaxDate(inst, 'min');
		var maxDate = this._getMinMaxDate(inst, 'max');
		return ((!minDate || date.getTime() >= minDate.getTime()) &&
			(!maxDate || date.getTime() <= maxDate.getTime()));
	},

	/* Provide the configuration settings for formatting/parsing. */
	_getFormatConfig: function(inst) {
		var shortYearCutoff = this._get(inst, 'shortYearCutoff');
		shortYearCutoff = (typeof shortYearCutoff != 'string' ? shortYearCutoff :
			new Date().getFullYear() % 100 + parseInt(shortYearCutoff, 10));
		return {shortYearCutoff: shortYearCutoff,
			dayNamesShort: this._get(inst, 'dayNamesShort'), dayNames: this._get(inst, 'dayNames'),
			monthNamesShort: this._get(inst, 'monthNamesShort'), monthNames: this._get(inst, 'monthNames')};
	},

	/* Format the given date for display. */
	_formatDate: function(inst, day, month, year) {
		if (!day) {
			inst.currentDay = inst.selectedDay;
			inst.currentMonth = inst.selectedMonth;
			inst.currentYear = inst.selectedYear;
		}
		var date = (day ? (typeof day == 'object' ? day :
			this._daylightSavingAdjust(new Date(year, month, day))) :
			this._daylightSavingAdjust(new Date(inst.currentYear, inst.currentMonth, inst.currentDay)));
		return this.formatDate(this._get(inst, 'dateFormat'), date, this._getFormatConfig(inst));
	}
});

/*
 * Bind hover events for datepicker elements.
 * Done via delegate so the binding only occurs once in the lifetime of the parent div.
 * Global instActive, set by _updateDatepicker allows the handlers to find their way back to the active picker.
 */ 
function bindHover(dpDiv) {
	var selector = 'button, .ui-datepicker-prev, .ui-datepicker-next, .ui-datepicker-calendar td a';
	return dpDiv.bind('mouseout', function(event) {
			var elem = $( event.target ).closest( selector );
			if ( !elem.length ) {
				return;
			}
			elem.removeClass( "ui-state-hover ui-datepicker-prev-hover ui-datepicker-next-hover" );
		})
		.bind('mouseover', function(event) {
			var elem = $( event.target ).closest( selector );
			if ($.datepicker._isDisabledDatepicker( instActive.inline ? dpDiv.parent()[0] : instActive.input[0]) ||
					!elem.length ) {
				return;
			}
			elem.parents('.ui-datepicker-calendar').find('a').removeClass('ui-state-hover');
			elem.addClass('ui-state-hover');
			if (elem.hasClass('ui-datepicker-prev')) elem.addClass('ui-datepicker-prev-hover');
			if (elem.hasClass('ui-datepicker-next')) elem.addClass('ui-datepicker-next-hover');
		});
}

/* jQuery extend now ignores nulls! */
function extendRemove(target, props) {
	$.extend(target, props);
	for (var name in props)
		if (props[name] == null || props[name] == undefined)
			target[name] = props[name];
	return target;
};

/* Determine whether an object is an array. */
function isArray(a) {
	return (a && (($.browser.safari && typeof a == 'object' && a.length) ||
		(a.constructor && a.constructor.toString().match(/\Array\(\)/))));
};

/* Invoke the datepicker functionality.
   @param  options  string - a command, optionally followed by additional parameters or
                    Object - settings for attaching new datepicker functionality
   @return  jQuery object */
$.fn.datepicker = function(options){
	
	/* Verify an empty collection wasn't passed - Fixes #6976 */
	if ( !this.length ) {
		return this;
	}
	
	/* Initialise the date picker. */
	if (!$.datepicker.initialized) {
		$(document).mousedown($.datepicker._checkExternalClick).
			find('body').append($.datepicker.dpDiv);
		$.datepicker.initialized = true;
	}

	var otherArgs = Array.prototype.slice.call(arguments, 1);
	if (typeof options == 'string' && (options == 'isDisabled' || options == 'getDate' || options == 'widget'))
		return $.datepicker['_' + options + 'Datepicker'].
			apply($.datepicker, [this[0]].concat(otherArgs));
	if (options == 'option' && arguments.length == 2 && typeof arguments[1] == 'string')
		return $.datepicker['_' + options + 'Datepicker'].
			apply($.datepicker, [this[0]].concat(otherArgs));
	return this.each(function() {
		typeof options == 'string' ?
			$.datepicker['_' + options + 'Datepicker'].
				apply($.datepicker, [this].concat(otherArgs)) :
			$.datepicker._attachDatepicker(this, options);
	});
};

$.datepicker = new Datepicker(); // singleton instance
$.datepicker.initialized = false;
$.datepicker.uuid = new Date().getTime();
$.datepicker.version = "1.8.20";

// Workaround for #4055
// Add another global to avoid noConflict issues with inline event handlers
window['DP_jQuery_' + dpuuid] = $;

})(jQuery);

(function( $, undefined ) {

var uiDialogClasses =
		'ui-dialog ' +
		'ui-widget ' +
		'ui-widget-content ' +
		'ui-corner-all ',
	sizeRelatedOptions = {
		buttons: true,
		height: true,
		maxHeight: true,
		maxWidth: true,
		minHeight: true,
		minWidth: true,
		width: true
	},
	resizableRelatedOptions = {
		maxHeight: true,
		maxWidth: true,
		minHeight: true,
		minWidth: true
	},
	// support for jQuery 1.3.2 - handle common attrFn methods for dialog
	attrFn = $.attrFn || {
		val: true,
		css: true,
		html: true,
		text: true,
		data: true,
		width: true,
		height: true,
		offset: true,
		click: true
	};

$.widget("ui.dialog", {
	options: {
		autoOpen: true,
		buttons: {},
		closeOnEscape: true,
		closeText: 'close',
		dialogClass: '',
		draggable: true,
		hide: null,
		height: 'auto',
		maxHeight: false,
		maxWidth: false,
		minHeight: 150,
		minWidth: 150,
		modal: false,
		position: {
			my: 'center',
			at: 'center',
			collision: 'fit',
			// ensure that the titlebar is never outside the document
			using: function(pos) {
				var topOffset = $(this).css(pos).offset().top;
				if (topOffset < 0) {
					$(this).css('top', pos.top - topOffset);
				}
			}
		},
		resizable: true,
		show: null,
		stack: true,
		title: '',
		width: 300,
		zIndex: 1000
	},

	_create: function() {
		this.originalTitle = this.element.attr('title');
		// #5742 - .attr() might return a DOMElement
		if ( typeof this.originalTitle !== "string" ) {
			this.originalTitle = "";
		}

		this.options.title = this.options.title || this.originalTitle;
		var self = this,
			options = self.options,

			title = options.title || '&#160;',
			titleId = $.ui.dialog.getTitleId(self.element),

			uiDialog = (self.uiDialog = $('<div></div>'))
				.appendTo(document.body)
				.hide()
				.addClass(uiDialogClasses + options.dialogClass)
				.css({
					zIndex: options.zIndex
				})
				// setting tabIndex makes the div focusable
				// setting outline to 0 prevents a border on focus in Mozilla
				.attr('tabIndex', -1).css('outline', 0).keydown(function(event) {
					if (options.closeOnEscape && !event.isDefaultPrevented() && event.keyCode &&
						event.keyCode === $.ui.keyCode.ESCAPE) {
						
						self.close(event);
						event.preventDefault();
					}
				})
				.attr({
					role: 'dialog',
					'aria-labelledby': titleId
				})
				.mousedown(function(event) {
					self.moveToTop(false, event);
				}),

			uiDialogContent = self.element
				.show()
				.removeAttr('title')
				.addClass(
					'ui-dialog-content ' +
					'ui-widget-content')
				.appendTo(uiDialog),

			uiDialogTitlebar = (self.uiDialogTitlebar = $('<div></div>'))
				.addClass(
					'ui-dialog-titlebar ' +
					'ui-widget-header ' +
					'ui-corner-all ' +
					'ui-helper-clearfix'
				)
				.prependTo(uiDialog),

			uiDialogTitlebarClose = $('<a href="#"></a>')
				.addClass(
					'ui-dialog-titlebar-close ' +
					'ui-corner-all'
				)
				.attr('role', 'button')
				.hover(
					function() {
						uiDialogTitlebarClose.addClass('ui-state-hover');
					},
					function() {
						uiDialogTitlebarClose.removeClass('ui-state-hover');
					}
				)
				.focus(function() {
					uiDialogTitlebarClose.addClass('ui-state-focus');
				})
				.blur(function() {
					uiDialogTitlebarClose.removeClass('ui-state-focus');
				})
				.click(function(event) {
					self.close(event);
					return false;
				})
				.appendTo(uiDialogTitlebar),

			uiDialogTitlebarCloseText = (self.uiDialogTitlebarCloseText = $('<span></span>'))
				.addClass(
					'ui-icon ' +
					'ui-icon-closethick'
				)
				.text(options.closeText)
				.appendTo(uiDialogTitlebarClose),

			uiDialogTitle = $('<span></span>')
				.addClass('ui-dialog-title')
				.attr('id', titleId)
				.html(title)
				.prependTo(uiDialogTitlebar);

		//handling of deprecated beforeclose (vs beforeClose) option
		//Ticket #4669 http://dev.jqueryui.com/ticket/4669
		//TODO: remove in 1.9pre
		if ($.isFunction(options.beforeclose) && !$.isFunction(options.beforeClose)) {
			options.beforeClose = options.beforeclose;
		}

		uiDialogTitlebar.find("*").add(uiDialogTitlebar).disableSelection();

		if (options.draggable && $.fn.draggable) {
			self._makeDraggable();
		}
		if (options.resizable && $.fn.resizable) {
			self._makeResizable();
		}

		self._createButtons(options.buttons);
		self._isOpen = false;

		if ($.fn.bgiframe) {
			uiDialog.bgiframe();
		}
	},

	_init: function() {
		if ( this.options.autoOpen ) {
			this.open();
		}
	},

	destroy: function() {
		var self = this;
		
		if (self.overlay) {
			self.overlay.destroy();
		}
		self.uiDialog.hide();
		self.element
			.unbind('.dialog')
			.removeData('dialog')
			.removeClass('ui-dialog-content ui-widget-content')
			.hide().appendTo('body');
		self.uiDialog.remove();

		if (self.originalTitle) {
			self.element.attr('title', self.originalTitle);
		}

		return self;
	},

	widget: function() {
		return this.uiDialog;
	},

	close: function(event) {
		var self = this,
			maxZ, thisZ;
		
		if (false === self._trigger('beforeClose', event)) {
			return;
		}

		if (self.overlay) {
			self.overlay.destroy();
		}
		self.uiDialog.unbind('keypress.ui-dialog');

		self._isOpen = false;

		if (self.options.hide) {
			self.uiDialog.hide(self.options.hide, function() {
				self._trigger('close', event);
			});
		} else {
			self.uiDialog.hide();
			self._trigger('close', event);
		}

		$.ui.dialog.overlay.resize();

		// adjust the maxZ to allow other modal dialogs to continue to work (see #4309)
		if (self.options.modal) {
			maxZ = 0;
			$('.ui-dialog').each(function() {
				if (this !== self.uiDialog[0]) {
					thisZ = $(this).css('z-index');
					if(!isNaN(thisZ)) {
						maxZ = Math.max(maxZ, thisZ);
					}
				}
			});
			$.ui.dialog.maxZ = maxZ;
		}

		return self;
	},

	isOpen: function() {
		return this._isOpen;
	},

	// the force parameter allows us to move modal dialogs to their correct
	// position on open
	moveToTop: function(force, event) {
		var self = this,
			options = self.options,
			saveScroll;

		if ((options.modal && !force) ||
			(!options.stack && !options.modal)) {
			return self._trigger('focus', event);
		}

		if (options.zIndex > $.ui.dialog.maxZ) {
			$.ui.dialog.maxZ = options.zIndex;
		}
		if (self.overlay) {
			$.ui.dialog.maxZ += 1;
			self.overlay.$el.css('z-index', $.ui.dialog.overlay.maxZ = $.ui.dialog.maxZ);
		}

		//Save and then restore scroll since Opera 9.5+ resets when parent z-Index is changed.
		//  http://ui.jquery.com/bugs/ticket/3193
		saveScroll = { scrollTop: self.element.scrollTop(), scrollLeft: self.element.scrollLeft() };
		$.ui.dialog.maxZ += 1;
		self.uiDialog.css('z-index', $.ui.dialog.maxZ);
		self.element.attr(saveScroll);
		self._trigger('focus', event);

		return self;
	},

	open: function() {
		if (this._isOpen) { return; }

		var self = this,
			options = self.options,
			uiDialog = self.uiDialog;

		self.overlay = options.modal ? new $.ui.dialog.overlay(self) : null;
		self._size();
		self._position(options.position);
		uiDialog.show(options.show);
		self.moveToTop(true);

		// prevent tabbing out of modal dialogs
		if ( options.modal ) {
			uiDialog.bind( "keydown.ui-dialog", function( event ) {
				if ( event.keyCode !== $.ui.keyCode.TAB ) {
					return;
				}

				var tabbables = $(':tabbable', this),
					first = tabbables.filter(':first'),
					last  = tabbables.filter(':last');

				if (event.target === last[0] && !event.shiftKey) {
					first.focus(1);
					return false;
				} else if (event.target === first[0] && event.shiftKey) {
					last.focus(1);
					return false;
				}
			});
		}

		// set focus to the first tabbable element in the content area or the first button
		// if there are no tabbable elements, set focus on the dialog itself
		$(self.element.find(':tabbable').get().concat(
			uiDialog.find('.ui-dialog-buttonpane :tabbable').get().concat(
				uiDialog.get()))).eq(0).focus();

		self._isOpen = true;
		self._trigger('open');

		return self;
	},

	_createButtons: function(buttons) {
		var self = this,
			hasButtons = false,
			uiDialogButtonPane = $('<div></div>')
				.addClass(
					'ui-dialog-buttonpane ' +
					'ui-widget-content ' +
					'ui-helper-clearfix'
				),
			uiButtonSet = $( "<div></div>" )
				.addClass( "ui-dialog-buttonset" )
				.appendTo( uiDialogButtonPane );

		// if we already have a button pane, remove it
		self.uiDialog.find('.ui-dialog-buttonpane').remove();

		if (typeof buttons === 'object' && buttons !== null) {
			$.each(buttons, function() {
				return !(hasButtons = true);
			});
		}
		if (hasButtons) {
			$.each(buttons, function(name, props) {
				props = $.isFunction( props ) ?
					{ click: props, text: name } :
					props;
				var button = $('<button type="button"></button>')
					.click(function() {
						props.click.apply(self.element[0], arguments);
					})
					.appendTo(uiButtonSet);
				// can't use .attr( props, true ) with jQuery 1.3.2.
				$.each( props, function( key, value ) {
					if ( key === "click" ) {
						return;
					}
					if ( key in attrFn ) {
						button[ key ]( value );
					} else {
						button.attr( key, value );
					}
				});
				if ($.fn.button) {
					button.button();
				}
			});
			uiDialogButtonPane.appendTo(self.uiDialog);
		}
	},

	_makeDraggable: function() {
		var self = this,
			options = self.options,
			doc = $(document),
			heightBeforeDrag;

		function filteredUi(ui) {
			return {
				position: ui.position,
				offset: ui.offset
			};
		}

		self.uiDialog.draggable({
			cancel: '.ui-dialog-content, .ui-dialog-titlebar-close',
			handle: '.ui-dialog-titlebar',
			containment: 'document',
			start: function(event, ui) {
				heightBeforeDrag = options.height === "auto" ? "auto" : $(this).height();
				$(this).height($(this).height()).addClass("ui-dialog-dragging");
				self._trigger('dragStart', event, filteredUi(ui));
			},
			drag: function(event, ui) {
				self._trigger('drag', event, filteredUi(ui));
			},
			stop: function(event, ui) {
				options.position = [ui.position.left - doc.scrollLeft(),
					ui.position.top - doc.scrollTop()];
				$(this).removeClass("ui-dialog-dragging").height(heightBeforeDrag);
				self._trigger('dragStop', event, filteredUi(ui));
				$.ui.dialog.overlay.resize();
			}
		});
	},

	_makeResizable: function(handles) {
		handles = (handles === undefined ? this.options.resizable : handles);
		var self = this,
			options = self.options,
			// .ui-resizable has position: relative defined in the stylesheet
			// but dialogs have to use absolute or fixed positioning
			position = self.uiDialog.css('position'),
			resizeHandles = (typeof handles === 'string' ?
				handles	:
				'n,e,s,w,se,sw,ne,nw'
			);

		function filteredUi(ui) {
			return {
				originalPosition: ui.originalPosition,
				originalSize: ui.originalSize,
				position: ui.position,
				size: ui.size
			};
		}

		self.uiDialog.resizable({
			cancel: '.ui-dialog-content',
			containment: 'document',
			alsoResize: self.element,
			maxWidth: options.maxWidth,
			maxHeight: options.maxHeight,
			minWidth: options.minWidth,
			minHeight: self._minHeight(),
			handles: resizeHandles,
			start: function(event, ui) {
				$(this).addClass("ui-dialog-resizing");
				self._trigger('resizeStart', event, filteredUi(ui));
			},
			resize: function(event, ui) {
				self._trigger('resize', event, filteredUi(ui));
			},
			stop: function(event, ui) {
				$(this).removeClass("ui-dialog-resizing");
				options.height = $(this).height();
				options.width = $(this).width();
				self._trigger('resizeStop', event, filteredUi(ui));
				$.ui.dialog.overlay.resize();
			}
		})
		.css('position', position)
		.find('.ui-resizable-se').addClass('ui-icon ui-icon-grip-diagonal-se');
	},

	_minHeight: function() {
		var options = this.options;

		if (options.height === 'auto') {
			return options.minHeight;
		} else {
			return Math.min(options.minHeight, options.height);
		}
	},

	_position: function(position) {
		var myAt = [],
			offset = [0, 0],
			isVisible;

		if (position) {
			// deep extending converts arrays to objects in jQuery <= 1.3.2 :-(
	//		if (typeof position == 'string' || $.isArray(position)) {
	//			myAt = $.isArray(position) ? position : position.split(' ');

			if (typeof position === 'string' || (typeof position === 'object' && '0' in position)) {
				myAt = position.split ? position.split(' ') : [position[0], position[1]];
				if (myAt.length === 1) {
					myAt[1] = myAt[0];
				}

				$.each(['left', 'top'], function(i, offsetPosition) {
					if (+myAt[i] === myAt[i]) {
						offset[i] = myAt[i];
						myAt[i] = offsetPosition;
					}
				});

				position = {
					my: myAt.join(" "),
					at: myAt.join(" "),
					offset: offset.join(" ")
				};
			} 

			position = $.extend({}, $.ui.dialog.prototype.options.position, position);
		} else {
			position = $.ui.dialog.prototype.options.position;
		}

		// need to show the dialog to get the actual offset in the position plugin
		isVisible = this.uiDialog.is(':visible');
		if (!isVisible) {
			this.uiDialog.show();
		}
		this.uiDialog
			// workaround for jQuery bug #5781 http://dev.jquery.com/ticket/5781
			.css({ top: 0, left: 0 })
			.position($.extend({ of: window }, position));
		if (!isVisible) {
			this.uiDialog.hide();
		}
	},

	_setOptions: function( options ) {
		var self = this,
			resizableOptions = {},
			resize = false;

		$.each( options, function( key, value ) {
			self._setOption( key, value );
			
			if ( key in sizeRelatedOptions ) {
				resize = true;
			}
			if ( key in resizableRelatedOptions ) {
				resizableOptions[ key ] = value;
			}
		});

		if ( resize ) {
			this._size();
		}
		if ( this.uiDialog.is( ":data(resizable)" ) ) {
			this.uiDialog.resizable( "option", resizableOptions );
		}
	},

	_setOption: function(key, value){
		var self = this,
			uiDialog = self.uiDialog;

		switch (key) {
			//handling of deprecated beforeclose (vs beforeClose) option
			//Ticket #4669 http://dev.jqueryui.com/ticket/4669
			//TODO: remove in 1.9pre
			case "beforeclose":
				key = "beforeClose";
				break;
			case "buttons":
				self._createButtons(value);
				break;
			case "closeText":
				// ensure that we always pass a string
				self.uiDialogTitlebarCloseText.text("" + value);
				break;
			case "dialogClass":
				uiDialog
					.removeClass(self.options.dialogClass)
					.addClass(uiDialogClasses + value);
				break;
			case "disabled":
				if (value) {
					uiDialog.addClass('ui-dialog-disabled');
				} else {
					uiDialog.removeClass('ui-dialog-disabled');
				}
				break;
			case "draggable":
				var isDraggable = uiDialog.is( ":data(draggable)" );
				if ( isDraggable && !value ) {
					uiDialog.draggable( "destroy" );
				}
				
				if ( !isDraggable && value ) {
					self._makeDraggable();
				}
				break;
			case "position":
				self._position(value);
				break;
			case "resizable":
				// currently resizable, becoming non-resizable
				var isResizable = uiDialog.is( ":data(resizable)" );
				if (isResizable && !value) {
					uiDialog.resizable('destroy');
				}

				// currently resizable, changing handles
				if (isResizable && typeof value === 'string') {
					uiDialog.resizable('option', 'handles', value);
				}

				// currently non-resizable, becoming resizable
				if (!isResizable && value !== false) {
					self._makeResizable(value);
				}
				break;
			case "title":
				// convert whatever was passed in o a string, for html() to not throw up
				$(".ui-dialog-title", self.uiDialogTitlebar).html("" + (value || '&#160;'));
				break;
		}

		$.Widget.prototype._setOption.apply(self, arguments);
	},

	_size: function() {
		/* If the user has resized the dialog, the .ui-dialog and .ui-dialog-content
		 * divs will both have width and height set, so we need to reset them
		 */
		var options = this.options,
			nonContentHeight,
			minContentHeight,
			isVisible = this.uiDialog.is( ":visible" );

		// reset content sizing
		this.element.show().css({
			width: 'auto',
			minHeight: 0,
			height: 0
		});

		if (options.minWidth > options.width) {
			options.width = options.minWidth;
		}

		// reset wrapper sizing
		// determine the height of all the non-content elements
		nonContentHeight = this.uiDialog.css({
				height: 'auto',
				width: options.width
			})
			.height();
		minContentHeight = Math.max( 0, options.minHeight - nonContentHeight );
		
		if ( options.height === "auto" ) {
			// only needed for IE6 support
			if ( $.support.minHeight ) {
				this.element.css({
					minHeight: minContentHeight,
					height: "auto"
				});
			} else {
				this.uiDialog.show();
				var autoHeight = this.element.css( "height", "auto" ).height();
				if ( !isVisible ) {
					this.uiDialog.hide();
				}
				this.element.height( Math.max( autoHeight, minContentHeight ) );
			}
		} else {
			this.element.height( Math.max( options.height - nonContentHeight, 0 ) );
		}

		if (this.uiDialog.is(':data(resizable)')) {
			this.uiDialog.resizable('option', 'minHeight', this._minHeight());
		}
	}
});

$.extend($.ui.dialog, {
	version: "1.8.20",

	uuid: 0,
	maxZ: 0,

	getTitleId: function($el) {
		var id = $el.attr('id');
		if (!id) {
			this.uuid += 1;
			id = this.uuid;
		}
		return 'ui-dialog-title-' + id;
	},

	overlay: function(dialog) {
		this.$el = $.ui.dialog.overlay.create(dialog);
	}
});

$.extend($.ui.dialog.overlay, {
	instances: [],
	// reuse old instances due to IE memory leak with alpha transparency (see #5185)
	oldInstances: [],
	maxZ: 0,
	events: $.map('focus,mousedown,mouseup,keydown,keypress,click'.split(','),
		function(event) { return event + '.dialog-overlay'; }).join(' '),
	create: function(dialog) {
		if (this.instances.length === 0) {
			// prevent use of anchors and inputs
			// we use a setTimeout in case the overlay is created from an
			// event that we're going to be cancelling (see #2804)
			setTimeout(function() {
				// handle $(el).dialog().dialog('close') (see #4065)
				if ($.ui.dialog.overlay.instances.length) {
					$(document).bind($.ui.dialog.overlay.events, function(event) {
						// stop events if the z-index of the target is < the z-index of the overlay
						// we cannot return true when we don't want to cancel the event (#3523)
						if ($(event.target).zIndex() < $.ui.dialog.overlay.maxZ) {
							return false;
						}
					});
				}
			}, 1);

			// allow closing by pressing the escape key
			$(document).bind('keydown.dialog-overlay', function(event) {
				if (dialog.options.closeOnEscape && !event.isDefaultPrevented() && event.keyCode &&
					event.keyCode === $.ui.keyCode.ESCAPE) {
					
					dialog.close(event);
					event.preventDefault();
				}
			});

			// handle window resize
			$(window).bind('resize.dialog-overlay', $.ui.dialog.overlay.resize);
		}

		var $el = (this.oldInstances.pop() || $('<div></div>').addClass('ui-widget-overlay'))
			.appendTo(document.body)
			.css({
				width: this.width(),
				height: this.height()
			});

		if ($.fn.bgiframe) {
			$el.bgiframe();
		}

		this.instances.push($el);
		return $el;
	},

	destroy: function($el) {
		var indexOf = $.inArray($el, this.instances);
		if (indexOf != -1){
			this.oldInstances.push(this.instances.splice(indexOf, 1)[0]);
		}

		if (this.instances.length === 0) {
			$([document, window]).unbind('.dialog-overlay');
		}

		$el.remove();
		
		// adjust the maxZ to allow other modal dialogs to continue to work (see #4309)
		var maxZ = 0;
		$.each(this.instances, function() {
			maxZ = Math.max(maxZ, this.css('z-index'));
		});
		this.maxZ = maxZ;
	},

	height: function() {
		var scrollHeight,
			offsetHeight;
		// handle IE 6
		if ($.browser.msie && $.browser.version < 7) {
			scrollHeight = Math.max(
				document.documentElement.scrollHeight,
				document.body.scrollHeight
			);
			offsetHeight = Math.max(
				document.documentElement.offsetHeight,
				document.body.offsetHeight
			);

			if (scrollHeight < offsetHeight) {
				return $(window).height() + 'px';
			} else {
				return scrollHeight + 'px';
			}
		// handle "good" browsers
		} else {
			return $(document).height() + 'px';
		}
	},

	width: function() {
		var scrollWidth,
			offsetWidth;
		// handle IE
		if ( $.browser.msie ) {
			scrollWidth = Math.max(
				document.documentElement.scrollWidth,
				document.body.scrollWidth
			);
			offsetWidth = Math.max(
				document.documentElement.offsetWidth,
				document.body.offsetWidth
			);

			if (scrollWidth < offsetWidth) {
				return $(window).width() + 'px';
			} else {
				return scrollWidth + 'px';
			}
		// handle "good" browsers
		} else {
			return $(document).width() + 'px';
		}
	},

	resize: function() {
		/* If the dialog is draggable and the user drags it past the
		 * right edge of the window, the document becomes wider so we
		 * need to stretch the overlay. If the user then drags the
		 * dialog back to the left, the document will become narrower,
		 * so we need to shrink the overlay to the appropriate size.
		 * This is handled by shrinking the overlay before setting it
		 * to the full document size.
		 */
		var $overlays = $([]);
		$.each($.ui.dialog.overlay.instances, function() {
			$overlays = $overlays.add(this);
		});

		$overlays.css({
			width: 0,
			height: 0
		}).css({
			width: $.ui.dialog.overlay.width(),
			height: $.ui.dialog.overlay.height()
		});
	}
});

$.extend($.ui.dialog.overlay.prototype, {
	destroy: function() {
		$.ui.dialog.overlay.destroy(this.$el);
	}
});

}(jQuery));

(function( $, undefined ) {

$.ui = $.ui || {};

var horizontalPositions = /left|center|right/,
	verticalPositions = /top|center|bottom/,
	center = "center",
	support = {},
	_position = $.fn.position,
	_offset = $.fn.offset;

$.fn.position = function( options ) {
	if ( !options || !options.of ) {
		return _position.apply( this, arguments );
	}

	// make a copy, we don't want to modify arguments
	options = $.extend( {}, options );

	var target = $( options.of ),
		targetElem = target[0],
		collision = ( options.collision || "flip" ).split( " " ),
		offset = options.offset ? options.offset.split( " " ) : [ 0, 0 ],
		targetWidth,
		targetHeight,
		basePosition;

	if ( targetElem.nodeType === 9 ) {
		targetWidth = target.width();
		targetHeight = target.height();
		basePosition = { top: 0, left: 0 };
	// TODO: use $.isWindow() in 1.9
	} else if ( targetElem.setTimeout ) {
		targetWidth = target.width();
		targetHeight = target.height();
		basePosition = { top: target.scrollTop(), left: target.scrollLeft() };
	} else if ( targetElem.preventDefault ) {
		// force left top to allow flipping
		options.at = "left top";
		targetWidth = targetHeight = 0;
		basePosition = { top: options.of.pageY, left: options.of.pageX };
	} else {
		targetWidth = target.outerWidth();
		targetHeight = target.outerHeight();
		basePosition = target.offset();
	}

	// force my and at to have valid horizontal and veritcal positions
	// if a value is missing or invalid, it will be converted to center 
	$.each( [ "my", "at" ], function() {
		var pos = ( options[this] || "" ).split( " " );
		if ( pos.length === 1) {
			pos = horizontalPositions.test( pos[0] ) ?
				pos.concat( [center] ) :
				verticalPositions.test( pos[0] ) ?
					[ center ].concat( pos ) :
					[ center, center ];
		}
		pos[ 0 ] = horizontalPositions.test( pos[0] ) ? pos[ 0 ] : center;
		pos[ 1 ] = verticalPositions.test( pos[1] ) ? pos[ 1 ] : center;
		options[ this ] = pos;
	});

	// normalize collision option
	if ( collision.length === 1 ) {
		collision[ 1 ] = collision[ 0 ];
	}

	// normalize offset option
	offset[ 0 ] = parseInt( offset[0], 10 ) || 0;
	if ( offset.length === 1 ) {
		offset[ 1 ] = offset[ 0 ];
	}
	offset[ 1 ] = parseInt( offset[1], 10 ) || 0;

	if ( options.at[0] === "right" ) {
		basePosition.left += targetWidth;
	} else if ( options.at[0] === center ) {
		basePosition.left += targetWidth / 2;
	}

	if ( options.at[1] === "bottom" ) {
		basePosition.top += targetHeight;
	} else if ( options.at[1] === center ) {
		basePosition.top += targetHeight / 2;
	}

	basePosition.left += offset[ 0 ];
	basePosition.top += offset[ 1 ];

	return this.each(function() {
		var elem = $( this ),
			elemWidth = elem.outerWidth(),
			elemHeight = elem.outerHeight(),
			marginLeft = parseInt( $.curCSS( this, "marginLeft", true ) ) || 0,
			marginTop = parseInt( $.curCSS( this, "marginTop", true ) ) || 0,
			collisionWidth = elemWidth + marginLeft +
				( parseInt( $.curCSS( this, "marginRight", true ) ) || 0 ),
			collisionHeight = elemHeight + marginTop +
				( parseInt( $.curCSS( this, "marginBottom", true ) ) || 0 ),
			position = $.extend( {}, basePosition ),
			collisionPosition;

		if ( options.my[0] === "right" ) {
			position.left -= elemWidth;
		} else if ( options.my[0] === center ) {
			position.left -= elemWidth / 2;
		}

		if ( options.my[1] === "bottom" ) {
			position.top -= elemHeight;
		} else if ( options.my[1] === center ) {
			position.top -= elemHeight / 2;
		}

		// prevent fractions if jQuery version doesn't support them (see #5280)
		if ( !support.fractions ) {
			position.left = Math.round( position.left );
			position.top = Math.round( position.top );
		}

		collisionPosition = {
			left: position.left - marginLeft,
			top: position.top - marginTop
		};

		$.each( [ "left", "top" ], function( i, dir ) {
			if ( $.ui.position[ collision[i] ] ) {
				$.ui.position[ collision[i] ][ dir ]( position, {
					targetWidth: targetWidth,
					targetHeight: targetHeight,
					elemWidth: elemWidth,
					elemHeight: elemHeight,
					collisionPosition: collisionPosition,
					collisionWidth: collisionWidth,
					collisionHeight: collisionHeight,
					offset: offset,
					my: options.my,
					at: options.at
				});
			}
		});

		if ( $.fn.bgiframe ) {
			elem.bgiframe();
		}
		elem.offset( $.extend( position, { using: options.using } ) );
	});
};

$.ui.position = {
	fit: {
		left: function( position, data ) {
			var win = $( window ),
				over = data.collisionPosition.left + data.collisionWidth - win.width() - win.scrollLeft();
			position.left = over > 0 ? position.left - over : Math.max( position.left - data.collisionPosition.left, position.left );
		},
		top: function( position, data ) {
			var win = $( window ),
				over = data.collisionPosition.top + data.collisionHeight - win.height() - win.scrollTop();
			position.top = over > 0 ? position.top - over : Math.max( position.top - data.collisionPosition.top, position.top );
		}
	},

	flip: {
		left: function( position, data ) {
			if ( data.at[0] === center ) {
				return;
			}
			var win = $( window ),
				over = data.collisionPosition.left + data.collisionWidth - win.width() - win.scrollLeft(),
				myOffset = data.my[ 0 ] === "left" ?
					-data.elemWidth :
					data.my[ 0 ] === "right" ?
						data.elemWidth :
						0,
				atOffset = data.at[ 0 ] === "left" ?
					data.targetWidth :
					-data.targetWidth,
				offset = -2 * data.offset[ 0 ];
			position.left += data.collisionPosition.left < 0 ?
				myOffset + atOffset + offset :
				over > 0 ?
					myOffset + atOffset + offset :
					0;
		},
		top: function( position, data ) {
			if ( data.at[1] === center ) {
				return;
			}
			var win = $( window ),
				over = data.collisionPosition.top + data.collisionHeight - win.height() - win.scrollTop(),
				myOffset = data.my[ 1 ] === "top" ?
					-data.elemHeight :
					data.my[ 1 ] === "bottom" ?
						data.elemHeight :
						0,
				atOffset = data.at[ 1 ] === "top" ?
					data.targetHeight :
					-data.targetHeight,
				offset = -2 * data.offset[ 1 ];
			position.top += data.collisionPosition.top < 0 ?
				myOffset + atOffset + offset :
				over > 0 ?
					myOffset + atOffset + offset :
					0;
		}
	}
};

// offset setter from jQuery 1.4
if ( !$.offset.setOffset ) {
	$.offset.setOffset = function( elem, options ) {
		// set position first, in-case top/left are set even on static elem
		if ( /static/.test( $.curCSS( elem, "position" ) ) ) {
			elem.style.position = "relative";
		}
		var curElem   = $( elem ),
			curOffset = curElem.offset(),
			curTop    = parseInt( $.curCSS( elem, "top",  true ), 10 ) || 0,
			curLeft   = parseInt( $.curCSS( elem, "left", true ), 10)  || 0,
			props     = {
				top:  (options.top  - curOffset.top)  + curTop,
				left: (options.left - curOffset.left) + curLeft
			};
		
		if ( 'using' in options ) {
			options.using.call( elem, props );
		} else {
			curElem.css( props );
		}
	};

	$.fn.offset = function( options ) {
		var elem = this[ 0 ];
		if ( !elem || !elem.ownerDocument ) { return null; }
		if ( options ) { 
			return this.each(function() {
				$.offset.setOffset( this, options );
			});
		}
		return _offset.call( this );
	};
}

// fraction support test (older versions of jQuery don't support fractions)
(function () {
	var body = document.getElementsByTagName( "body" )[ 0 ], 
		div = document.createElement( "div" ),
		testElement, testElementParent, testElementStyle, offset, offsetTotal;

	//Create a "fake body" for testing based on method used in jQuery.support
	testElement = document.createElement( body ? "div" : "body" );
	testElementStyle = {
		visibility: "hidden",
		width: 0,
		height: 0,
		border: 0,
		margin: 0,
		background: "none"
	};
	if ( body ) {
		$.extend( testElementStyle, {
			position: "absolute",
			left: "-1000px",
			top: "-1000px"
		});
	}
	for ( var i in testElementStyle ) {
		testElement.style[ i ] = testElementStyle[ i ];
	}
	testElement.appendChild( div );
	testElementParent = body || document.documentElement;
	testElementParent.insertBefore( testElement, testElementParent.firstChild );

	div.style.cssText = "position: absolute; left: 10.7432222px; top: 10.432325px; height: 30px; width: 201px;";

	offset = $( div ).offset( function( _, offset ) {
		return offset;
	}).offset();

	testElement.innerHTML = "";
	testElementParent.removeChild( testElement );

	offsetTotal = offset.top + offset.left + ( body ? 2000 : 0 );
	support.fractions = offsetTotal > 21 && offsetTotal < 22;
})();

}( jQuery ));

(function( $, undefined ) {

$.widget( "ui.progressbar", {
	options: {
		value: 0,
		max: 100
	},

	min: 0,

	_create: function() {
		this.element
			.addClass( "ui-progressbar ui-widget ui-widget-content ui-corner-all" )
			.attr({
				role: "progressbar",
				"aria-valuemin": this.min,
				"aria-valuemax": this.options.max,
				"aria-valuenow": this._value()
			});

		this.valueDiv = $( "<div class='ui-progressbar-value ui-widget-header ui-corner-left'></div>" )
			.appendTo( this.element );

		this.oldValue = this._value();
		this._refreshValue();
	},

	destroy: function() {
		this.element
			.removeClass( "ui-progressbar ui-widget ui-widget-content ui-corner-all" )
			.removeAttr( "role" )
			.removeAttr( "aria-valuemin" )
			.removeAttr( "aria-valuemax" )
			.removeAttr( "aria-valuenow" );

		this.valueDiv.remove();

		$.Widget.prototype.destroy.apply( this, arguments );
	},

	value: function( newValue ) {
		if ( newValue === undefined ) {
			return this._value();
		}

		this._setOption( "value", newValue );
		return this;
	},

	_setOption: function( key, value ) {
		if ( key === "value" ) {
			this.options.value = value;
			this._refreshValue();
			if ( this._value() === this.options.max ) {
				this._trigger( "complete" );
			}
		}

		$.Widget.prototype._setOption.apply( this, arguments );
	},

	_value: function() {
		var val = this.options.value;
		// normalize invalid value
		if ( typeof val !== "number" ) {
			val = 0;
		}
		return Math.min( this.options.max, Math.max( this.min, val ) );
	},

	_percentage: function() {
		return 100 * this._value() / this.options.max;
	},

	_refreshValue: function() {
		var value = this.value();
		var percentage = this._percentage();

		if ( this.oldValue !== value ) {
			this.oldValue = value;
			this._trigger( "change" );
		}

		this.valueDiv
			.toggle( value > this.min )
			.toggleClass( "ui-corner-right", value === this.options.max )
			.width( percentage.toFixed(0) + "%" );
		this.element.attr( "aria-valuenow", value );
	}
});

$.extend( $.ui.progressbar, {
	version: "1.8.20"
});

})( jQuery );

(function( $, undefined ) {

// number of pages in a slider
// (how many times can you page up/down to go through the whole range)
var numPages = 5;

$.widget( "ui.slider", $.ui.mouse, {

	widgetEventPrefix: "slide",

	options: {
		animate: false,
		distance: 0,
		max: 100,
		min: 0,
		orientation: "horizontal",
		range: false,
		step: 1,
		value: 0,
		values: null
	},

	_create: function() {
		var self = this,
			o = this.options,
			existingHandles = this.element.find( ".ui-slider-handle" ).addClass( "ui-state-default ui-corner-all" ),
			handle = "<a class='ui-slider-handle ui-state-default ui-corner-all' href='#'></a>",
			handleCount = ( o.values && o.values.length ) || 1,
			handles = [];

		this._keySliding = false;
		this._mouseSliding = false;
		this._animateOff = true;
		this._handleIndex = null;
		this._detectOrientation();
		this._mouseInit();

		this.element
			.addClass( "ui-slider" +
				" ui-slider-" + this.orientation +
				" ui-widget" +
				" ui-widget-content" +
				" ui-corner-all" +
				( o.disabled ? " ui-slider-disabled ui-disabled" : "" ) );

		this.range = $([]);

		if ( o.range ) {
			if ( o.range === true ) {
				if ( !o.values ) {
					o.values = [ this._valueMin(), this._valueMin() ];
				}
				if ( o.values.length && o.values.length !== 2 ) {
					o.values = [ o.values[0], o.values[0] ];
				}
			}

			this.range = $( "<div></div>" )
				.appendTo( this.element )
				.addClass( "ui-slider-range" +
				// note: this isn't the most fittingly semantic framework class for this element,
				// but worked best visually with a variety of themes
				" ui-widget-header" + 
				( ( o.range === "min" || o.range === "max" ) ? " ui-slider-range-" + o.range : "" ) );
		}

		for ( var i = existingHandles.length; i < handleCount; i += 1 ) {
			handles.push( handle );
		}

		this.handles = existingHandles.add( $( handles.join( "" ) ).appendTo( self.element ) );

		this.handle = this.handles.eq( 0 );

		this.handles.add( this.range ).filter( "a" )
			.click(function( event ) {
				event.preventDefault();
			})
			.hover(function() {
				if ( !o.disabled ) {
					$( this ).addClass( "ui-state-hover" );
				}
			}, function() {
				$( this ).removeClass( "ui-state-hover" );
			})
			.focus(function() {
				if ( !o.disabled ) {
					$( ".ui-slider .ui-state-focus" ).removeClass( "ui-state-focus" );
					$( this ).addClass( "ui-state-focus" );
				} else {
					$( this ).blur();
				}
			})
			.blur(function() {
				$( this ).removeClass( "ui-state-focus" );
			});

		this.handles.each(function( i ) {
			$( this ).data( "index.ui-slider-handle", i );
		});

		this.handles
			.keydown(function( event ) {
				var index = $( this ).data( "index.ui-slider-handle" ),
					allowed,
					curVal,
					newVal,
					step;
	
				if ( self.options.disabled ) {
					return;
				}
	
				switch ( event.keyCode ) {
					case $.ui.keyCode.HOME:
					case $.ui.keyCode.END:
					case $.ui.keyCode.PAGE_UP:
					case $.ui.keyCode.PAGE_DOWN:
					case $.ui.keyCode.UP:
					case $.ui.keyCode.RIGHT:
					case $.ui.keyCode.DOWN:
					case $.ui.keyCode.LEFT:
						event.preventDefault();
						if ( !self._keySliding ) {
							self._keySliding = true;
							$( this ).addClass( "ui-state-active" );
							allowed = self._start( event, index );
							if ( allowed === false ) {
								return;
							}
						}
						break;
				}
	
				step = self.options.step;
				if ( self.options.values && self.options.values.length ) {
					curVal = newVal = self.values( index );
				} else {
					curVal = newVal = self.value();
				}
	
				switch ( event.keyCode ) {
					case $.ui.keyCode.HOME:
						newVal = self._valueMin();
						break;
					case $.ui.keyCode.END:
						newVal = self._valueMax();
						break;
					case $.ui.keyCode.PAGE_UP:
						newVal = self._trimAlignValue( curVal + ( (self._valueMax() - self._valueMin()) / numPages ) );
						break;
					case $.ui.keyCode.PAGE_DOWN:
						newVal = self._trimAlignValue( curVal - ( (self._valueMax() - self._valueMin()) / numPages ) );
						break;
					case $.ui.keyCode.UP:
					case $.ui.keyCode.RIGHT:
						if ( curVal === self._valueMax() ) {
							return;
						}
						newVal = self._trimAlignValue( curVal + step );
						break;
					case $.ui.keyCode.DOWN:
					case $.ui.keyCode.LEFT:
						if ( curVal === self._valueMin() ) {
							return;
						}
						newVal = self._trimAlignValue( curVal - step );
						break;
				}
	
				self._slide( event, index, newVal );
			})
			.keyup(function( event ) {
				var index = $( this ).data( "index.ui-slider-handle" );
	
				if ( self._keySliding ) {
					self._keySliding = false;
					self._stop( event, index );
					self._change( event, index );
					$( this ).removeClass( "ui-state-active" );
				}
	
			});

		this._refreshValue();

		this._animateOff = false;
	},

	destroy: function() {
		this.handles.remove();
		this.range.remove();

		this.element
			.removeClass( "ui-slider" +
				" ui-slider-horizontal" +
				" ui-slider-vertical" +
				" ui-slider-disabled" +
				" ui-widget" +
				" ui-widget-content" +
				" ui-corner-all" )
			.removeData( "slider" )
			.unbind( ".slider" );

		this._mouseDestroy();

		return this;
	},

	_mouseCapture: function( event ) {
		var o = this.options,
			position,
			normValue,
			distance,
			closestHandle,
			self,
			index,
			allowed,
			offset,
			mouseOverHandle;

		if ( o.disabled ) {
			return false;
		}

		this.elementSize = {
			width: this.element.outerWidth(),
			height: this.element.outerHeight()
		};
		this.elementOffset = this.element.offset();

		position = { x: event.pageX, y: event.pageY };
		normValue = this._normValueFromMouse( position );
		distance = this._valueMax() - this._valueMin() + 1;
		self = this;
		this.handles.each(function( i ) {
			var thisDistance = Math.abs( normValue - self.values(i) );
			if ( distance > thisDistance ) {
				distance = thisDistance;
				closestHandle = $( this );
				index = i;
			}
		});

		// workaround for bug #3736 (if both handles of a range are at 0,
		// the first is always used as the one with least distance,
		// and moving it is obviously prevented by preventing negative ranges)
		if( o.range === true && this.values(1) === o.min ) {
			index += 1;
			closestHandle = $( this.handles[index] );
		}

		allowed = this._start( event, index );
		if ( allowed === false ) {
			return false;
		}
		this._mouseSliding = true;

		self._handleIndex = index;

		closestHandle
			.addClass( "ui-state-active" )
			.focus();
		
		offset = closestHandle.offset();
		mouseOverHandle = !$( event.target ).parents().andSelf().is( ".ui-slider-handle" );
		this._clickOffset = mouseOverHandle ? { left: 0, top: 0 } : {
			left: event.pageX - offset.left - ( closestHandle.width() / 2 ),
			top: event.pageY - offset.top -
				( closestHandle.height() / 2 ) -
				( parseInt( closestHandle.css("borderTopWidth"), 10 ) || 0 ) -
				( parseInt( closestHandle.css("borderBottomWidth"), 10 ) || 0) +
				( parseInt( closestHandle.css("marginTop"), 10 ) || 0)
		};

		if ( !this.handles.hasClass( "ui-state-hover" ) ) {
			this._slide( event, index, normValue );
		}
		this._animateOff = true;
		return true;
	},

	_mouseStart: function( event ) {
		return true;
	},

	_mouseDrag: function( event ) {
		var position = { x: event.pageX, y: event.pageY },
			normValue = this._normValueFromMouse( position );
		
		this._slide( event, this._handleIndex, normValue );

		return false;
	},

	_mouseStop: function( event ) {
		this.handles.removeClass( "ui-state-active" );
		this._mouseSliding = false;

		this._stop( event, this._handleIndex );
		this._change( event, this._handleIndex );

		this._handleIndex = null;
		this._clickOffset = null;
		this._animateOff = false;

		return false;
	},
	
	_detectOrientation: function() {
		this.orientation = ( this.options.orientation === "vertical" ) ? "vertical" : "horizontal";
	},

	_normValueFromMouse: function( position ) {
		var pixelTotal,
			pixelMouse,
			percentMouse,
			valueTotal,
			valueMouse;

		if ( this.orientation === "horizontal" ) {
			pixelTotal = this.elementSize.width;
			pixelMouse = position.x - this.elementOffset.left - ( this._clickOffset ? this._clickOffset.left : 0 );
		} else {
			pixelTotal = this.elementSize.height;
			pixelMouse = position.y - this.elementOffset.top - ( this._clickOffset ? this._clickOffset.top : 0 );
		}

		percentMouse = ( pixelMouse / pixelTotal );
		if ( percentMouse > 1 ) {
			percentMouse = 1;
		}
		if ( percentMouse < 0 ) {
			percentMouse = 0;
		}
		if ( this.orientation === "vertical" ) {
			percentMouse = 1 - percentMouse;
		}

		valueTotal = this._valueMax() - this._valueMin();
		valueMouse = this._valueMin() + percentMouse * valueTotal;

		return this._trimAlignValue( valueMouse );
	},

	_start: function( event, index ) {
		var uiHash = {
			handle: this.handles[ index ],
			value: this.value()
		};
		if ( this.options.values && this.options.values.length ) {
			uiHash.value = this.values( index );
			uiHash.values = this.values();
		}
		return this._trigger( "start", event, uiHash );
	},

	_slide: function( event, index, newVal ) {
		var otherVal,
			newValues,
			allowed;

		if ( this.options.values && this.options.values.length ) {
			otherVal = this.values( index ? 0 : 1 );

			if ( ( th�w�opDiGns.v�$%a{&me�gp� => `&"0pjiW�o0|�ons&bbFoe ==� tsuD�) &ghO		�(( ).@g`(9=0 7�8NeuVAe(>`o��%�vel  �L�( knd�A(5|7"0`." �Wh,`< n}heRVal�	d)m+	�)i k	I	oECTa�( �(eP^am*�	u��v"l
ntwpQ| %="p�y3.walqe�bhnfd| () �
��	nuw�a|qew �|hI3	vinuec*)+	)	nus ,}eqk`anepP] =!le��l�		X/� A�q|q4e kql!de c!naEled!b�(r%tu:nq_�(g�mse"f�mM t�e {,i��03aLdBe ;I	�,gwed� P2kS	Sd�igaer�%*s,i�ebav�nv, s�	I1	� ngx�+ 6l+s,�cnfl}sU �edej ],��			vim5e: oewRil��	Y		vehpwcz`zgW&i�uosJ		m`);	YOth,pd�l� 4�xs~V�nu%s(�inDe�(/ 1�:�! 9M�	I}$ )�ahlored0!<= ihwl,)8;M
͈	
	tbHr�panqgs (#lldi Ldw^e\-0�~ve�(:I�	YmM*�		}�
		}dh{a8{	l�� newV�l`!m��h	s.pa-ue  (�y,I	�	// @ �l-de�#`n hgbkaNGm@ed��y red�jl�.g vhh�d!vrOf"th�s�Iee �)lLbic+
	�)	anlou%` �u8is.�tvkrgD- "cli��2�!e�anV, 	�	leltl�:a`hi�.h�~ ,ns_ i"�uh]$%�X			6%�5i:!newV�l:�	��C%3*		-imf"= i,gwet -5)�eloe1	(s		�	t(ig.w)l5�8 >�vWa� i{ �I�?
�	��I�
m-�
.
I_�t�� fUl#ta�zh�Ev�nt8!i�dey(	({+			�e�"|iJa=h,- _�I	�ian�l�: |�i3.�a~deq`hfd!t [,
	CvaLeu:��dMs.vqlee)	Y	��$( uK�y/op�l*w>rA��us0&*!v�)�.G`u�?ns�a,eesmed�t�*)�[�		te�CsH6valqe(=phie&v!luMS)�i��f\1(�			�aNash�gpmqgs!="��xc'�aludqh):%� =-M
)Ithis._ds��7eb,`Bsv0�,!Tve�q- uHmsH +;	lTIIGkjpNoe� fuc��on(��vun|$��e�mx�) {
�i� (!ppis<_ke�Sxidi�G 6 !tqis.}oU�esDdyff"y`{�8~a� ��I`3(b� ;&	a�)�`~a,e"d4kCS.lalelds�#9jdg8 ]$I��6alpcf vHkc.~!�5e8�
I}�		�if (4`h�s.�`pIols.LgnTE &!}(msjo�tHi}3.v%m�es>}Engtj�$�-	A�nJqRh�A�u�9!qh)C.vslees(dyndx 9��	�uhX!s�.6A�es 5 �JY3.walw�y
3	J		�

It`%3&Ker��g�B$"c*�nge",$�venu($�i aWh(	3MZ|I�(")4ah�e:`fq�3�ioN(0ngwV@cun�) �!�V  arf�men�s>l��'4� -
IItj	S~khviW�S&vad�A�}"|hi�._wrlDa'oValue($�wwchu�`)�C�has&_venreshTa�ue�9+L			�hI_._ali.e8(fulf,48"I9-
			�TtUrj2
	|

(Mbe�$rv$\h!R�_va*uU8�{)M$
�cnw�c28uoC�ioo( inF}x��ogGG�m%s �0[-I�~i� va,�(�		oesV�mWur,	*+	�G	�if ( `gueh~t�.|eo�ti , 5�5 -
)�deR-e0eio�sza�e!cS"ijUY"]�0 pjis,_t2�l|ylf�e�tg�(je7VcL}ed)�
�	�Tzic�{�e66�4IVahemh	
		fhms/_#hiNgo,(nu\e-Hinl'x0i{	
	ɉr�tw`^9
!*q-�	yb (t��ylenu3�m�nohh ) �
	)i&!(� >isArr){hirgwognvs�`\ 	!*�{�*	+D�v�ls  �h)s,oqfi�n{4ra.]eq;�	l4DVa�udG!<"areyieol{� @$\;�		fo� ( i"9 z H < �y|sjminfu@; i`)=�7 ) x		�	rqksK0k!�$,�t�is�Wqsim�lygNZalte  wTwe,5aWk y \b)?
H
	��hqs._#h!n�U� b�,O$0i 	;�	{*	iI�hqs&ret"uqhV�Hu�,);	
�	y edcup{-*			I�f ��v(is.OpdH�n�.v!|w}s0�d lIic-obtIg�5�ya�}ms.lE.gvi ) c��		�eD�fo t`�p.talu-{) yzfux 8;
I	C]"en1e kM
�		Rev�bf0llqstalu'9+;	
	�uA			�M	= m�se {�	Iva`tr�E��Kw/{�a��dah+?	
	}�	},-[3evOpTion: �u~ctaon�ce{� &ah]�,)�{		�av�)-��9l eJ�<h� �8�*
Hhg�+�.icAbr1o8 tiar�jp�+m.Snvalui�a-6)�z�YMvkeqLbN!Tl�/ t;isj�p|�Mfk-wqLues
le~'��3	iMJ		 %Widga�.P�o4op9p�.}cd6Ou�ynnna2]hy8"dl;s, ax�uoe~tr0�:M
gW�dgx <�;ey � kJ
	-cOo 2lkS1�me��:M
H	i	!� )u!�u%)0=M (				8lIskal`le�,fRn�Q2 !>aqrubtk)g/c5"�#',bn�p8H�B(IUjL1~hiodmec.vu�o�mgLa�3) 3}odstte-xlrlr�`)9M	YMM	qhi�:�jNdle1�{2�pAtEr*,7Dms�bde+,ntsu� -�			t�Ys.e^�mD[f.��$Bhd�q(� vi%dis�bl5%�0�3N	�=&el{m$}
�	�		4Dmw&hs~enW{h6�tithR(�"d�sabnDd�.�fClsc0-;
	��4;j[�EMaEu�p-�e�\6eK|��s*�b�i<ehsqpw�p"&x;�
�		\M�I	bne�k+M�aC�w "+pidf5AthmD"�	
�	T~y{/�dateCW_r�eouatyMn i;
�		)t�is.dme�fjt	M.r�-k�eC�Asc# suiowl)d|*�l}�r�lv��$5X5r�ad%r-far�igcj"�)	M��.A�h�hQss*`!ui��mXtdr-" � �Lk�,mr!EnuIdih�)	HA	vjh�._r�e��3 aLue�+;			�r�A{?	
	�c�u "vaqg`*
	I	th3*�anam�TeG&f!� |rut
I)	d�i�._2ev0eul^in�E()?-	��	|hs�^@h`
cd( nql�l(0k;		uiiC.�aNimqr}OF+8&�aws<-J�)�"wdcJ:
			Scse&(vcoeas"�I	I�hiq/Eji�aTeofn`= Xs=d+-JIIQ	4*i#�_r-vr��,VaL�e.(;
A�	F/r`  i }�4;�ih<t`lr,mofth�%m )=0 (� K-(			|�=w._cxEbggH(nmlh$$M'�;/�H	m"	��hys.Nen+-KtfLF� -$da<w�:L,K)`|MEk�	-
Iy,JZ+/+mv�v�el(TeMeG ~ettEp)/2߷dl<e,- Rgt|ffs)vclse dRimmet%c9hmIn(`n max, a�Ign�d0#yA�4�p�_v`lu%6!^�dcTynfXS0x�
War`Ga` x thh~&p\M�Ds>vDlu!;�	M�C� 5h�iis._t*aeAhdo�Du�uc<av1J )Ipetad �@n�
)l�L+/	�ter�aI4bal{gS0�e|��v�!o/`V`fqew��s��urnr isreY k�c`lu��"t~i-}gd,cy1lan�!n� �uh� `�ignmd b} s�pp	'/ Kt�l�5b aNteX�(�s-xurns@rhnBle$6`�Uuv�I�mu4icymn�+~�ai@,2A�no��edy �td8*	WWA,}esz fwNoTio.� i
tep<= �M
(vYb F�l .� va�s�
			i

	)if � �rc�mlnvS*�EnGtH"( s	�tul0= yX�7.Np|(~ns�^eh1�sU"lnfex ]�	LvQla='this�/vvm1l-woRa���("v�l@/�J			rg| sl�uc�;=a%l#e"o
	+/`�sLac�*a A��k�es!` Goq1(og"4:uajrqiM��//�hi�3bo8� #|�"`v�m�edby,ii gnL �}x a�t �he.`RgwerzeA�)�g�ls$�4uzys�ptM�fs�6al!5s.clcce,(8��op"( i�<08;�-0<$fady>�ejEta�0)�= q3{K+�	>e,s91e E"-�%his*_t�xOElllmRadagj |�Hv[!	 ]48;	Z	)}
:			�e4�`o0ga�s2JY}M		}, 
-
	�+ 2eqwns(qhg0st�p-0m(W�-b1r$hueh0*bD0vi|�{ knmrmrrao,&jevweuΡxiDcluKim) mioajDdmqx
�_`siMGlhonValru*�&unsTmo.hdval )M�i"*�$�Qm$-"ud9.1.`lu�Mi,(90)1z
		r�qur~bthis.[qah�qIif�+�OJI�l	�& x�f!L2�ui�r.t�l%5Ayx()$)#z
	���Evqsnh|iaS�K�aluu�e� �MY�y
v�r �uE� =!�UMqs*o�n�nr*suex !0 ) �`tHi�n_0uAOo5ns4�p!:(,*�		�aLMndpe� =av`($.�thi�.OvAjueMkl(9-%`sp�plI
	`ha'n���tg0=(~�L -afaLL+eSTl ;M
.	i�!<0Mep`&�bs(>`lEo$S�dt� : ,><�qmr6� �!)	�li.nB�Mue K=(� ��-O`Au�r#>82 ) 12�toq�� (�5Rt�s�9;
|

	)-+��nce�r`Fc3��i3`$�ru 4rz�l�}s�wyuH(}q�/m 'lo@t;,00oum4y	I>/�t�e$fq~`dvaM�e �n,�0�ie)ur ufuez(|`w�`eKm�aa�vwan��`;me�s|127��	�Dtup�aa"se�mgeu( adm�fUkluf��kFy9%d�") K8.	},*
	nrdeeMin* fencpi_}))p{8IrE�urnath+s.orh)�nw*eIn;u,
]doD�EM�x gEfb�Ion(8 {
	pAfuv* tlms�pf`Ja?ie�;�u�
	$
	O
dnr�pyV!haev funct`m/8	 [
Iwa~��R!fug�= �i��ov0ilr.v@+�u.(�"u0t(Aw.oRdi�ms,	�ise|f"=!g�as6�an�,�pgd50�4gtl	S/a-�opmK�f�+ �`M.bnI	�Tg#> nq�{u-	�	(vi @e:w`�U�
	++^qa| 9"{}���	t�spZaN�i~�enV-=
�	6lDOlD
		~iie�i~l	
	�a\weM�y;L
		k�"b`4H�s.��inng.S���ns 6� thY��o D�kn}.|a�}uqjl�oa�h$) {�<his.H`n�luqN=a{kxfa>CtiOo( Il J (k	I6a�Q��bdnt`= 9�q�h&v!uOrhi-!G$w�f/_%ahU�Mioz�   -&�(weLf._�l�eAa}() - ��m�/O1�ecM��8i1- "!00�	)Oce6[�{e-�*kvhpl��tio~ =u�!�grzn�t�|" =%"heg�a 8`b"�ttGm*  /#v)kp�ra�.|�,da*;
	 4 `Thhs")*Wp&�h&1�"! -Kbafilq~E
?@`qn}ga4e�(: #su2�0U�$�sa�tg>aF	�hta�	>MJ	xd1hns�hf(fptka�s&~!�gmR}}\ tpef ) �MI	h�TT) ?a&,jrs%o�a|aon ==5 'i��I~ogf`m"�	�J		YIlf�h$�ĭ�= 8  �wL�Ia	(�e|v&zsf�e*sp'�8 �, = 9[�cnj)euu$? "anm,�ze :�"!CQ"�U� z(heft:va�Cdbsgnp 2 "!"0}0/,qn)�ate!)9�		
					�$"fY =�5$1((�
I			ICS�lp*r�lgm� c~iMeta:/��ajiipue :""sss"��(�{ wiBvh>  �pedPdRoeotp) �aw0^alRfkrEn|�9�*!�%" ,{1w�ui:dBALq�( dy�At�/|�!n.akh}a4m ]!99�			�]*		�}"Ul;e _MI		kf%2 a�==9x� K)		 	O	Iwehu� �FGE.S�oP( 3(hq)#j�-Ite�2#`,im�de#%81"k6s��}:0{ bod4Om:�8�r!,RRcent ) *�"ec$=.�am�mq�e ;�		]�	9			if � i�,=, 1`�!*=
	K��}F.# lgc[2!Nq�m&%8?	l��iOae�"2 pA{s3�'$k*�Ai'dP: !�vaTPea�en4�%0|%ttalXg2seng1)��4#�0}, z(�eTug9$%al{u�Utcvkog> m.cN�}Ive �%�;]�			�\
	+��]		�Yq	�`actV%lB�rkegp= tanT%�#u~t(			-M�	) E$s� {I(i9vol}u%m`th�.~!dAEh�?
	��!�uemm�! $(��>OTawqd�kj�(�@		�`l}gMax!<0p
�SW�!lmu|�P"i;)
)�h�g,t�ce~�ya"�vybudia| !} �rd}gMin)d9		,rvanes - Va�dgMyN�)/ (-sen]�Ma($-�7%|uwM).(!1k$;0 9	I	09M�			_Qq|�;sGo�O�aen4atie� =5()"l�r)�nfqal�6>�&l-Ft� �"&b74|me.`�"9 6�ld3uJu *i�%�;+�!ThIs&xan$lcbsdK4("sF1-[a�Oim�te � "a.a�ade" (�cs"]j%_;E<,$m.an)�atA)MK	�(%a*l+Rq�we =�� 2mIN# $&"mhkq&r�%N~u�io*�1=1 �hO�("gzxa  � {
�!	dihwJoa#w`.s4Op((�9"���[ �>amax%�v"&onimi4e""8 k33" h � wyg�j:�q`nerC�t ) "-2!}( �l�j;�e|� +{E�i	|	
A`�("oRq.vm09� "mcx# . jIsng{)j��piJ� -(hfrmZsn���h()k��
�umis,vae�[ aNima� o(�ak�mipe2 z 2cy�"�Y(?�ul4�i (0108��$tc`PERcE>d   #"*4�u�8c g5etex0jetsg�(tUvEti�nz oqOikstd}�I�		K	�	�f (�DRa~e% �==� mxlk$& ta�>O�Iaju!2in0�9;$"�Urtioam*�9dk�Iy�iis.r�ngEk�top* �H)1 mK Pni}K,�8�a~@iate"0�9��ss* \("{dhdi�`T:"�a.P-zag|t &5b�}<�f*An�}�|a"i�
	J|	iv*(%�Pan'u�==5 "/!x%&&!|�ic�Ozmdn4a�im.`-}!#verva+Cl� - {
		KgJal2i*g![ pni-"t� ? 
ifkm�te.�: �ss"!_{!k hcdh\~1, ?:0)- v�)erce��x)�+"$& },8jiqutT�~)d�n���pe42exI�n:%n*dn�%at�y 	?M=
�	
*98��J|9��
$?�xt�nd( $.uHfsdid�r, sM	veq3�nn: "7,:n22 5+-)�
	
ݘbQuer}(9=�
(fu/cpigl*`�< uo�e~mlg�2)�{
O�Ab(`lbI�$} v<
	d�spIh% 2�	�]fuocAioN eetLexttab�u,) s
�E�u�~!!'v�hؤ+
|(	�5�BDIo~!'b�N�l\NictY�)5S9(�rgdusN"+btk{fId+=

d�W�`g%t� 37)>Fa`3*, 
�*|li�nr*({-
	a�z+ nuld9
		a+axGPt�ofsx NSHd>
#acz%> 'else.
g_ocae8�?udln *8�^g* � ��ryZuQ�`78 4!�|: '/%,�ds�%in8`'z5uerx>gO}+$ r�+era: tvu�,}�O
#/l�iys-r��.�Eal�el
��iwqjh�r�ud|,��	�g:abh�m:`K,*	%o��,e8 �5ll-
Iqvev4��Slhcj",	�f4:!~t$|l"/�pe.g~"c�xd�fz�:�'d�oe�d?�a�P!Ghm�:"'�oog`e'� du2`5�oo6 001 l	MFPz�dix9f"u��iro/"�b	�o@g;bnt}l<M
		1i/ulTdm�L`te:	 <�v�<`i6 -
��`}Ov%:0J�<ll
	emgcr:`nul)8-I	shg�: nuh}�=
Irp�f.ev: <`mvn`daoG6a,;1?<-f�>"	t�b�emPlaue{ &�li>=�`hrqg=/3Y�rgv_c6<span+[l "el<%3pA|<�&a>�+�;>&M�}$
 _brec<!z�f�tcd	o�(�{�		umiw�W�abif9(�t3ue4�<�] 	]w�v�p|if~*�f��StQon( c�y.`gcm5e ) }I+in )�O%y(=<! 1dld��m$"h��"	(Mf`(�xi�>cpt�o�c/k?lLeh3kBla!$� wC-�% =}ylh[g�m|di�6mseldsud0�!�-JJ�	pe�Uv~�
		{�	�jIs��G�e#u(0value );M		} ele ͊Iviys*opudo.sZ"cvq$�$= v1m�e{			�yiw.�!jhG{(9�J(	}	�!ll�
_tAb_f;!z}o�t��o+``b�/_-
)	jeuwvl`ajvht�e!(8�*D�t|E.r%pHa�-h o\s+G,!>!�).��pl`au)�[_U�|t0&c2�uFBGF-�mg,0"  0 ~|
	�(hk.���konS&idPzunil(+ nepLAx<UajId�)-	},��_sanI�h~�Q%lact�r:&�fc�aon�"hC{xBy0c�/! ~e�~eee0�`ɲ"b�B`a�n �f`kd!Mey$���axn1h�"�!
	�bettrj�xa3hpe`ly#e�0/+�g, 2\\{+ )#	y,-�
�_gkoki1
 �nA~jon�)0{�		vbb c�ogme�- tias/"nh{)f |rEI�i� �hI3.�OoKiu!= this��p�ions.�+iyd.*amg`�< &ui-�abc- $�ke�FexuDes|�(�$I;	rEVerj(%,b.g�ia>AuxL{�ph5Dhn�[ cwoo+eq_(b/�`!�,�.�akm�Brcqh kRgum4f�{ ) ) a?]J-,

�_ui* �un�|)�l�$ab) pane| )0z�I	rg4�s�4�#		dcB:)t`d-
�	%� n�f> p#n�lli~�e`8�tx?snalaj��U.I~D$h( tob -�	=8U4J
	Wc,e!l}p*`f}�cti�n(�`k]
!�/�pvEst/ve a�l &Ori'p0jO!di.'02�bR�|ebulS��d8is.�ys.d,nt}�+!2.u).Qta4aprKce�3kfw� h
)	.rfmg~eCH ss�0"aI�Rp�v�lwzgCebs�Nd"�
�.&Inf(yB#tanz�Ct�fanu,/udbs()*	*e5�h @�mcv�gl+!j{�(	)ves(gh5�D� $lyw!);	K	�	el(pli!el.dhfa0 &labeL7tacr  )"+:b$�JwuDads  f��Bel*%@cS/);
		u-;	
}(
M
 _���ir9>(funbth�n� ynit"�dZ-J	Kvar �eln�=�u)iq,-��i/ = thcs.npthons�J�	frAN-eNt f /i/^a.$'�'*.�a�)rm � �ehoSd{!7#/ f�"a.8e]1�}0Xa��
	tik{.Lisv =0�h)w.e�al%ot/&iQe� /,,ql" )Ue)\0 -8
		txib.lis�=$&(!�).0lh�L�3(qSisav_-b<'uhj3.,is4 �=Txi?.�ocho2{�-$4hac�ok�nla`V|�ctik~ y!_�
�	�Dt�rk ( *a�: �`hs )[�0f_�	wi;
	t�is&pi|ml3 <!$� �V5);;
	�d()a�aNbhkbs�%eCayGw>cu0MJ: i,,!!1�yI�va6`d2ef �a$$:d )�avPrh "irun�;�	?/1Fos$�\nAeag!|d�cjeadel H�Ml`|~k=�Kknwai�q$Q$h�w],�{�irmc#HE |h�0dxpa~dc-�K/&s]cl�x�ev�o�uj�0*}hl�8e�g0e2hVath (ash akf �hE�mkf�ef�zetb te""!{ Ajax6M+	ho'!�a}�(c}nao�ur�vk�j a`xLis W�r aL(a�oed(taf w}t�ta�fCigi%n�0iden k�ia�	*?'`sm�ceaKlr�-�dviget�txdenpiGs�r} `[es �he\pEcp5$i �oV2m)t�(.�
		// Wus ~o"mal�xd�hs�n�attz	bute&n
vaz h�%fB`ue0="jrcfNc�lit)(&#� %S`D]%L
�	MbaseML� 		on)( h�dFBas% &G )%n�dBpQ� %M/ hlc!ri'fn�oSuzi�k  *1p\hx, "##$9{0! ]}}%
�	
�)�ap�Ad < $( asar )�"x ZI &l&ybQ�F�Wd�=4)$jejEElzrif I"� {		A	)r�f (e.hish;	)
anh2mf�?0,zeb;�	�	}
�		Yo� �Nn)ne ra��
	A )� ( �S`�oentIf4.�t) hreb<�@)�j	
)	qm,F.�cned� < ce��.xbll�)ed�&celd�$l%ten�:f�n�i(#edf>^�q.k|i:g$\ec4O�b xbe�! ))�K�# p%mo|o tAb
	�+�p6dv!Kt i*I@�n' thl"zafi,its,� i6(h��f �3 *5yt"&k$
�	_!e�sd )f1a hreF0�&`xrE�*a==��b 9 �k				/?�qD!s)��d &kr&r�stra"oldeqqryI*	I$.tATc� %,�2�2m.fte�ab( �Sef@/y�J)		�� T_dN kot)i !380�$iw� ihe�DrtVippdvan��Nt  �entibh`v o�od$t2l�2			/ (\(&aiOs(xN ,oqf,fr�L s}c�$5fli
	Y1	,.4ata� `$�2,/AdcBs- br�g>r�2la�g(-3..$o,x�" - a;��		ver r� -(cmlno]tg�If( ��:Z�	a�h2�f 8`*#"!&id;
			~an$&|qo��$� q�mb.DlM��Ot_jA~d� "+� K id ;=
		 f !D`q�娮NEn'dh�)!�	Y	 �ab5d 9 $((O?@].�iUe,ulau� �		,	*Hd\r� �)d", id�)
	 		.qdd�|)1sl$#oKde"q�@AneH%wi6iFOev-Soj`ehr`ua-g��jEr=boup.i"d)��	��	9nsdzdPFter( 3e�f&pAkq,s�i`� 1 } xx�{Ghgn|hqt )9�	I�pyn�$�$Eta(4*dEtfny>|ib�	\�>pue"=:
	��}�	)Ufl`.u!nels =�se4v.`bne<r.Ee�* pinul ){�
		o/1h�v!�id Paf0`��~M		}@gfsa"�
�	�m>tis�c,�d�t1�h� h );
		�-	m=9	�!-!jjylim|izA|Y�~@&z�8*sfc tch�Jh&   y~It )"~
	+� q�t`�x j%ctgserybsr�sse!fmr!stY`ing�	�uh�2�)Lm�a��oKdd�qs�i!wI/t!�s uy-uhdee�,uIwiduit�nondm^t%Q�)cornAb)ell" i;*		4(icNlist.�ddCfq�r� �u)%ucrsfav wi?h�l�%R��esAu(sh-H�D�%t-s,e�rdixd5i-w�d�et=��alep���k2~��-aLo$�);M*)I	t�YS.lIc>a$dS}i�s �Ui,s�b4amladauL|$tAgorndj=4ox� �zx9ucjef�`l�,qsc� "ui-v��1-`an�a u�-omdg�l-conte&T(uicox�mr�soxtn	�0�{B	
	I	-*SlMcdee0l!f	
-�/-#w�% &r�lOwvej""�P<in�H/v T�� to r!trke6g!�	/�4.�frof�v�cf�enp iue~+Vie kn%url�		'/B2,&dRoe"Coo�a*�	�? ;/��rom!re�'g�ed kDa_:!�Tt�If4da kl$<hi.
		� *aj.�eltcded!9�- 5.fcv�n%D(	�{�	 iffj l~S�|iooh�sH  z-
	 	p�CasLoSs>%!k�(4qnatin�8 {<``&-`{OM�f *�a&x�` =u$,�ct)/l.xqwx(!`k	J	I���o,s&eaqt�d�= l;:	M�	r%tq6� f`m��;�-II��
�});
	�	�m
		ig0804�T�OF }.s�ltc�1d� 5=!f�u-rMR�x&& o~cGc?�%$)1:(�		0	o.rf��qre& =0`!rsdInv(�wylb_cOIisei-� 1x+;���y
	I� ((yyEf n�g�lecFed! 9? bFT�be2" o& t�i5�m�{���|tep(4�.Ui-tabz)g�es|Ed"!9.l�Nwd_ o0[�
)		IowE�E��e`=`thxs,iSjid�mx( whic.d�>&kN|g�) ".wy-t�s,�ele#<%t`�+�
	A�))		}/�sajlkte� � �+st�%k�e, |V (Vii3>,i9.lej�rh )i2(�0-5!)j		y else(i�h8(o.�e�ucD4�=5� *�l� i� // msege(�f n�Dl iw"d�urgca�c$, �o@O SeE�e lane~u rc�uap5 	 	J�si}g�uAd"} -3{
	I}�N�9�./`rinmty che#�A/,$cfgpl|(�Ofi~{t rab�,�)!d>seLeC�ou!5 ~a( o/3e�uk��e ?-"0 & 0����A!HOt�K o<'el%ctel� +(yx$j�{ULegded��0 !�		)?�g'sELeitefJ� 		:d0?N�MJI-	/�1Tak�0Dgsafh)Jg(t!br sih(kl|�c �P|ri*�t�fRo#HdN
II/�$knpo /kco��t Am� wpdate�o1pioo �rM�erl],.��	-. @�wmlek���!p�f #Ao*mt bec.�d$dh3abhmD.�
	J.`is�beeD ��gnii�e�`k.dipk�HE�Go}ck�
y		`&-ip8"Thic&l(b>f)luE* �#u�st�tE��s�b.ed6 -D b]�Ct)On( f� )0!4�(	re�us^ qel&��is�iNlg8%�<t(?	�	y)	I�) y.�ort();		��IIif   lhlEs�`�j(o.6ufeaD�`.0o.dl3�blet#)$	5(=50)�-�		�K&�h{AdL��nsr}�Ie� $j�naSi�� o{�lebtdd� o.f9kaR^dd�0, �"-9
		!|J J9	 )/ �i'hmkohdaC���c6ad tLz
Kwj)��`w�d:.qf�enIsS( �ui-pab[-ti|�2 (8�	�h�z$l(�.r%`kFOlas�(*sI=dcbs%qeedcre, wh%s5atm-aC�)vm�P�3()// bhegi ��r`,%~gt~0cZgyd� e�Rb ejfl km7ignzxiod(!�1q"lk[t
1I�F`  n.wdlm#6Al0��4&d piiu.inHoJs�llng�h /1r)
I�!3e�b.eoaag.�6&ie*"|e|f&_satiukjgS�hg�to`( �em�>!ni�op�K moselfaREL"]nh!sh(  )�rem�~eC(�Rs(b"5y/wab��ydg�9			txis.lIrn}u( o.3eL�gde$ =>IdtM<acc( u�-xejs-�elub4d` e	-sv�de-eBtiVe" =#�		|/ se%m1 toB"gPmx��Bdc�"rekevKor th�t he�rhow �A��bcbk i{0d�rgd			�e�v>�teeu~.�wgu%$ bpabs", f�Lc�)on(� {Lc �		sglf.]t�hogu2h$"sj�b&(~}li8E"	�*mcgldn[5a  u�lg/qnChop~[ �s�|icXe$ ]�2we|b,%n�mi~T.fh�l( sa�f��sAnitih�WeLEc�or( sm@f>al�hgpsK?K&�Alc!�l"]Iqq� +p+S�� { i)!			0}	_	Z
I	|iIc�oome(-&s=�dfp�h`�
�+	H			��rfmeaj`5|0u/0avo�f(mmm+�= xEaks&i.0#e2diaj ~ersyoos@�f i 6�
	//$�DN: nclepaAe txHc e?}n$
�H$(*w�ndo7�k.*H.0(�<q�.�@2(bõ�qtienH([	l	 		s%"&&his.`|d�"3a��ajs|��S �,tnBi�` ".<abu* !-,	K	sm(d.h9s ] sej#.aehor� } 3�v&r`nalsa<#nuul3	*H+	�)+�!M// u�L`tE(ymhMctdl�ab�l20hbd/relo~f�
��} e�3% ~
�	��2ghEcpe�$/ 4��S.�i�.indu~  thy�.Li�(t/`uwb "/~�Lqqvr-sd~ebg�DFd-i)1M		<-
	/�`u�FatacCoh����i��M�
	?`UwEK:Aqau�(DogoleSla6��!(		xas>ee`}end[ o*eomna@s�e,e"~(2q�dFtDss#p* ""omnnaClA1s2X, "}i-4!Rscnf~!`rI�le"`�?	M
!)./(_Et`�r `p�Atagonom�"af<eZ#iji4)Dn��p�d'�d-fvm!rurp-!�ifemx	ib"� o*!/ky%4) ���t`�s?ooCa~0)-.RunacTaFn0gcOoH��09	}�-�	8'ns3ble+�1�bNJ(��ov") �!�)(m 0� Ji:,( li0=@d`i2(|y[s1h M )$a*;0) �$ lI �� $�mn�r?)y<�i, o.�i}bl}@ )�) m12&&		//(UODm8�use �t�gbn[L�3�h)
		 o( lx i/IaC�lat{�3wy-�Acr,#ameatMf� � ~""sdL�nA;sb2! xgmo6E�I�s3f ^( !ui-k}!t%ldmsab(ef"H);-*I}-*
)�+/�rws�t aecpe!mf �v�q`�hf� g�mm!fCEz�$ to �t�c�ch$t�hF$(h}iK1c�(}-](K~su  j�		thM{�ansHm�A���mte@ata* !c`q`g.va�v  a�j	u�IY-/ j%/�tE C�� had�%�"ceFgru: u�`If� e!~"r!�"o.$eqi2Di��0pabs�Aetep 'd"nr0np6h�n ch!.'5
�4|ic$�i{faf�8 dhms/@&bH-r�0).u�"indmao$sj;#  *	jE�+"0( /iE��nt&$9 bmguq���er"` {�
		v@r!`et��a}@ duncpion("pa�e,!el ) {
				if ( el.is( ":not(.ui-state-disabled)" ) ) {
					el.addClass( "ui-state-" + state );
				}
			};
			var removeState = function( state, el ) {
				el.removeClass( "ui-state-" + state );
			};
			this.lis.bind( "mouseover.tabs" , function() {
				addState( "hover", $( this ) );
			});
			this.lis.bind( "mouseout.tabs", function() {
				removeState( "hover", $( this ) );
			});
			this.anchors.bind( "focus.tabs", function() {
				addState( "focus", $( this ).closest( "li" ) );
			});
			this.anchors.bind( "blur.tabs", function() {
				removeState( "focus", $( this ).closest( "li" ) );
			});
		}

		// set up animations
		var hideFx, showFx;
		if ( o.fx ) {
			if ( $.isArray( o.fx ) ) {
				hideFx = o.fx[ 0 ];
				showFx = o.fx[ 1 ];
			} else {
				hideFx = showFx = o.fx;
			}
		}

		// Reset certain styles left over from animation
		// and prevent IE's ClearType bug...
		function resetStyle( $el, fx ) {
			$el.css( "display", "" );
			if ( !$.support.opacity && fx.opacity ) {
				$el[ 0 ].style.removeAttribute( "filter" );
			}
		}

		// Show a tab...
		var showTab = showFx
			? function( clicked, $show ) {
				$( clicked ).closest( "li" ).addClass( "ui-tabs-selected ui-state-active" );
				$show.hide().removeClass( "ui-tabs-hide" ) // avoid flicker that way
					.animate( showFx, showFx.duration || "normal", function() {
						resetStyle( $show, showFx );
						self._trigger( "show", null, self._ui( clicked, $show[ 0 ] ) );
					});
			}
			: function( clicked, $show ) {
				$( clicked ).closest( "li" ).addClass( "ui-tabs-selected ui-state-active" );
				$show.removeClass( "ui-tabs-hide" );
				self._trigger( "show", null, self._ui( clicked, $show[ 0 ] ) );
			};

		// Hide a tab, $show is optional...
		var hideTab = hideFx
			? function( clicked, $hide ) {
				$hide.animate( hideFx, hideFx.duration || "normal", function() {
					self.lis.removeClass( "ui-tabs-selected ui-state-active" );
					$hide.addClass( "ui-tabs-hide" );
					resetStyle( $hide, hideFx );
					self.element.dequeue( "tabs" );
				});
			}
			: function( clicked, $hide, $show ) {
				self.lis.removeClass( "ui-tabs-selected ui-state-active" );
				$hide.addClass( "ui-tabs-hide" );
				self.element.dequeue( "tabs" );
			};

		// attach tab event handler, unbind to avoid duplicates from former tabifying...
		this.anchors.bind( o.event + ".tabs", function() {
			var el = this,
				$li = $(el).closest( "li" ),
				$hide = self.panels.filter( ":not(.ui-tabs-hide)" ),
				$show = self.element.find( self._sanitizeSelector( el.hash ) );

			// If tab is already selected and not collapsible or tab disabled or
			// or is already loading or click callback returns false stop here.
			// Check if click handler returns false last so that it is not executed
			// for a disabled or loading tab!
			if ( ( $li.hasClass( "ui-tabs-selected" ) && !o.collapsible) ||
				$li.hasClass( "ui-state-disabled" ) ||
				$li.hasClass( "ui-state-processing" ) ||
				self.panels.filter( ":animated" ).length ||
				self._trigger( "select", null, self._ui( this, $show[ 0 ] ) ) === false ) {
				this.blur();
				return false;
			}

			o.selected = self.anchors.index( this );

			self.abort();

			// if tab may be closed
			if ( o.collapsible ) {
				if ( $li.hasClass( "ui-tabs-selected" ) ) {
					o.selected = -1;

					if ( o.cookie ) {
						self._cookie( o.selected, o.cookie );
					}

					self.element.queue( "tabs", function() {
						hideTab( el, $hide );
					}).dequeue( "tabs" );

					this.blur();
					return false;
				} else if ( !$hide.length ) {
					if ( o.cookie ) {
						self._cookie( o.selected, o.cookie );
					}

					self.element.queue( "tabs", function() {
						showTab( el, $show );
					});

					// TODO make passing in node possible, see also http://dev.jqueryui.com/ticket/3171
					self.load( self.anchors.index( this ) );

					this.blur();
					return false;
				}
			}

			if ( o.cookie ) {
				self._cookie( o.selected, o.cookie );
			}

			// show new tab
			if ( $show.length ) {
				if ( $hide.length ) {
					self.element.queue( "tabs", function() {
						hideTab( el, $hide );
					});
				}
				self.element.queue( "tabs", function() {
					showTab( el, $show );
				});

				self.load( self.anchors.index( this ) );
			} else {
				throw "jQuery UI Tabs: Mismatching fragment identifier.";
			}

			// Prevent IE from keeping other link focussed when using the back button
			// and remove dotted border from clicked link. This is controlled via CSS
			// in modern browsers; blur() removes focus from address bar in Firefox
			// which can become a usability and annoying problem with tabs('rotate').
			if ( $.browser.msie ) {
				this.blur();
			}
		});

		// disable click in any case
		this.anchors.bind( "click.tabs", function(){
			return false;
		});
	},

    _getIndex: function( index ) {
		// meta-function to give users option to provide a href string instead of a numerical index.
		// also sanitizes numerical indexes to valid values.
		if ( typeof index == "string" ) {
			index = this.anchors.index( this.anchors.filter( "[href$='" + index + "']" ) );
		}

		return index;
	},

	destroy: function() {
		var o = this.options;

		this.abort();

		this.element
			.unbind( ".tabs" )
			.removeClass( "ui-tabs ui-widget ui-widget-content ui-corner-all ui-tabs-collapsible" )
			.removeData( "tabs" );

		this.list.removeClass( "ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all" );

		this.anchors.each(function() {
			var href = $.data( this, "href.tabs" );
			if ( href ) {
				this.href = href;
			}
			var $this = $( this ).unbind( ".tabs" );
			$.each( [ "href", "load", "cache" ], function( i, prefix ) {
				$this.removeData( prefix + ".tabs" );
			});
		});

		this.lis.unbind( ".tabs" ).add( this.panels ).each(function() {
			if ( $.data( this, "destroy.tabs" ) ) {
				$( this ).remove();
			} else {
				$( this ).removeClass([
					"ui-state-default",
					"ui-corner-top",
					"ui-tabs-selected",
					"ui-state-active",
					"ui-state-hover",
					"ui-state-focus",
					"ui-state-disabled",
					"ui-tabs-panel",
					"ui-widget-content",
					"ui-corner-bottom",
					"ui-tabs-hide"
				].join( " " ) );
			}
		});

		if ( o.cookie ) {
			this._cookie( null, o.cookie );
		}

		return this;
	},

	add: function( url, label, index ) {
		if ( index === undefined ) {
			index = this.anchors.length;
		}

		var self = this,
			o = this.options,
			$li = $( o.tabTemplate.replace( /#\{href\}/g, url ).replace( /#\{label\}/g, label ) ),
			id = !url.indexOf( "#" ) ? url.replace( "#", "" ) : this._tabId( $( "a", $li )[ 0 ] );

		$li.addClass( "ui-state-default ui-corner-top" ).data( "destroy.tabs", true );

		// try to find an existing element before creating a new one
		var $panel = self.element.find( "#" + id );
		if ( !$panel.length ) {
			$panel = $( o.panelTemplate )
				.attr( "id", id )
				.data( "destroy.tabs", true );
		}
		$panel.addClass( "ui-tabs-panel ui-widget-content ui-corner-bottom ui-tabs-hide" );

		if ( index >= this.lis.length ) {
			$li.appendTo( this.list );
			$panel.appendTo( this.list[ 0 ].parentNode );
		} else {
			$li.insertBefore( this.lis[ index ] );
			$panel.insertBefore( this.panels[ index ] );
		}

		o.disabled = $.map( o.disabled, function( n, i ) {
			return n >= index ? ++n : n;
		});

		this._tabify();

		if ( this.anchors.length == 1 ) {
			o.selected = 0;
			$li.addClass( "ui-tabs-selected ui-state-active" );
			$panel.removeClass( "ui-tabs-hide" );
			this.element.queue( "tabs", function() {
				self._trigger( "show", null, self._ui( self.anchors[ 0 ], self.panels[ 0 ] ) );
			});

			this.load( 0 );
		}

		this._trigger( "add", null, this._ui( this.anchors[ index ], this.panels[ index ] ) );
		return this;
	},

	remove: function( index ) {
		index = this._getIndex( index );
		var o = this.options,
			$li = this.lis.eq( index ).remove(),
			$panel = this.panels.eq( index ).remove();

		// If selected tab was removed focus tab to the right or
		// in case the last tab was removed the tab to the left.
		if ( $li.hasClass( "ui-tabs-selected" ) && this.anchors.length > 1) {
			this.select( index + ( index + 1 < this.anchors.length ? 1 : -1 ) );
		}

		o.disabled = $.map(
			$.grep( o.disabled, function(n, i) {
				return n != index;
			}),
			function( n, i ) {
				return n >= index ? --n : n;
			});

		this._tabify();

		this._trigger( "remove", null, this._ui( $li.find( "a" )[ 0 ], $panel[ 0 ] ) );
		return this;
	},

	enable: function( index ) {
		index = this._getIndex( index );
		var o = this.options;
		if ( $.inArray( index, o.disabled ) == -1 ) {
			return;
		}

		this.lis.eq( index ).removeClass( "ui-state-disabled" );
		o.disabled = $.grep( o.disabled, function( n, i ) {
			return n != index;
		});

		this._trigger( "enable", null, this._ui( this.anchors[ index ], this.panels[ index ] ) );
		return this;
	},

	disable: function( index ) {
		index = this._getIndex( index );
		var self = this, o = this.options;
		// cannot disable already selected tab
		if ( index != o.selected ) {
			this.lis.eq( index ).addClass( "ui-state-disabled" );

			o.disabled.push( index );
			o.disabled.sort();

			this._trigger( "disable", null, this._ui( this.anchors[ index ], this.panels[ index ] ) );
		}

		return this;
	},

	select: function( index ) {
		index = this._getIndex( index );
		if ( index == -1 ) {
			if ( this.options.collapsible && this.options.selected != -1 ) {
				index = this.options.selected;
			} else {
				return this;
			}
		}
		this.anchors.eq( index ).trigger( this.options.event + ".tabs" );
		return this;
	},

	load: function( index ) {
		index = this._getIndex( index );
		var self = this,
			o = this.options,
			a = this.anchors.eq( index )[ 0 ],
			url = $.data( a, "load.tabs" );

		this.abort();

		// not remote or from cache
		if ( !url || this.element.queue( "tabs" ).length !== 0 && $.data( a, "cache.tabs" ) ) {
			this.element.dequeue( "tabs" );
			return;
		}

		// load remote from here on
		this.lis.eq( index ).addClass( "ui-state-processing" );

		if ( o.spinner ) {
			var span = $( "span", a );
			span.data( "label.tabs", span.html() ).html( o.spinner );
		}

		this.xhr = $.ajax( $.extend( {}, o.ajaxOptions, {
			url: url,
			success: function( r, s ) {
				self.element.find( self._sanitizeSelector( a.hash ) ).html( r );

				// take care of tab labels
				self._cleanup();

				if ( o.cache ) {
					$.data( a, "cache.tabs", true );
				}

				self._trigger( "load", null, self._ui( self.anchors[ index ], self.panels[ index ] ) );
				try {
					o.ajaxOptions.success( r, s );
				}
				catch ( e ) {}
			},
			error: function( xhr, s, e ) {
				// take care of tab labels
				self._cleanup();

				self._trigger( "load", null, self._ui( self.anchors[ index ], self.panels[ index ] ) );
				try {
					// Passing index avoid a race condition when this method is
					// called after the user has selected another tab.
					// Pass the anchor that initiated this request allows
					// loadError to manipulate the tab content panel via $(a.hash)
					o.ajaxOptions.error( xhr, s, index, a );
				}
				catch ( e ) {}
			}
		} ) );

		// last, so that load event is fired before show...
		self.element.dequeue( "tabs" );

		return this;
	},

	abort: function() {
		// stop possibly running animations
		this.element.queue( [] );
		this.panels.stop( false, true );

		// "tabs" queue must not contain more than two elements,
		// which are the callbacks for the latest clicked tab...
		this.element.queue( "tabs", this.element.queue( "tabs" ).splice( -2, 2 ) );

		// terminate pending requests from other tabs
		if ( this.xhr ) {
			this.xhr.abort();
			delete this.xhr;
		}

		// take care of tab labels
		this._cleanup();
		return this;
	},

	url: function( index, url ) {
		this.anchors.eq( index ).removeData( "cache.tabs" ).data( "load.tabs", url );
		return this;
	},

	length: function() {
		return this.anchors.length;
	}
});

$.extend( $.ui.tabs, {
	version: "1.8.20"
});

/*
 * Tabs Extensions
 */

/*
 * Rotate
 */
$.extend( $.ui.tabs.prototype, {
	rotation: null,
	rotate: function( ms, continuing ) {
		var self = this,
			o = this.options;

		var rotate = self._rotate || ( self._rotate = function( e ) {
			clearTimeout( self.rotation );
			self.rotation = setTimeout(function() {
				var t = o.selected;
				self.select( ++t < self.anchors.length ? t : 0 );
			}, ms );
			
			if ( e ) {
				e.stopPropagation();
			}
		});

		var stop = self._unrotate || ( self._unrotate = !continuing
			? function(e) {
				if (e.clientX) { // in case of a true click
					self.rotate(null);
				}
			}
			: function( e ) {
				rotate();
			});

		// start rotation
		if ( ms ) {
			this.element.bind( "tabsshow", rotate );
			this.anchors.bind( o.event + ".tabs", stop );
			rotate();
		// stop rotation
		} else {
			clearTimeout( self.rotation );
			this.element.unbind( "tabsshow", rotate );
			this.anchors.unbind( o.event + ".tabs", stop );
			delete this._rotate;
			delete this._unrotate;
		}

		return this;
	}
});

})( jQuery );
