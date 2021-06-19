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
			relative: this._getRelativeOffset() //This is a relative to absolute positio&hknıs |ha"Q·t’a, pÔwÒfm]. camg’hi-gn(!oney0{E`%fks rm≈`fhVu!0k{yjew5d!hudPU–
	}m˙
Jk/?_GfgBadqb¶(e ioyjal pzai∞ioé-)	t`I≥.ihieIJqlPmsh|y_N!ø!Ùxic>p/ai=Ynn º!rh){>_ÊdnYrAemPgWitYenkavÂn`)9Iths.~pa7yÔe-—ag%K5+ewm˛V>p`'MX;	Wlqrapikylan`GLY - eveÓ8™pagE…
%
./Effeid`tkeMi'5suflff3e|"r|<m}hG% 4o tËm0falper !F$ga5BÛ*r≈b/ iw!q502didmH	I(Ogu‚snsÙ	4&$<ËÈr&o(f*5StK'vÛÒ|FP/mHaqt%s(.Cızs/zAh©i;MÕ	./J%p qcgŒuUÈb}`Fu 	f ginÂÍ -L the pı!fns
	aD$l.conîam>m%nt»
9H	this/_se|Vknta)koe^p((rù

9>ZRioes,±vEn< ) %ahLvÂ√k˜iÔ(V®isÆKtri«gmp(†Ûg!rd",0ÙnenÙ) w%< ÊelWu! ˛i
	k1ul-Ûns`YGÚ(O;
		p`TıpzafÔ©2e{©à5M"•BI	.\RuCab®n`thg°jeLpmR`ÛM˛e		ÙhÈs._cq„`uMg|xerProhocPinO$::M
	!?/í~!Am≥e†d`Â `rtpabLs†g&fveps
O(f:* .ui&dƒ}agu|d˙0¶&$%Ï.WopHmh#v)oer)ÕJ		‰nej.fd}a~·ver,`∞eh 1e_fG7ets¨vhaqi gvgnx-;

	t(i{"Bgl%r.ee$c$0c"†buI9‰raggablD/§vaogÈNfb);
ÕItlas/_ÏOuÛaD÷$o8e¶unp, |≤4u)ª$/@gcu¸m Uh4`tv`&$ooca -$thmÛs·u{Es }`a8hÌe82(Óot`tn`bÂ`v©sa‚<m4b%bNr/ 'ÂTt9nÁBcds +nrrEbd to3+tAo˛u-	/?If§tlgCT{ma˛age" Mp0usÂm vnk†¿rp`ablesàinFor}ew`Ô®mqnaed |Xqf¢dv≥Cqm~C!h!a sXi~8eT 8#eg®≤µp07)â	in(( ,qa‰dmaOkuuª )1t.uj#dtm·naGer¨dÚQd3ıa2Ù!|ÿi∫,peÙfn|(;(äHä	bltu{.b02t%≠/	,"èoouqmrq˜: &uj#a)oû®VvenT?•NPvn`awati„L)"Yä
{	+/√O}xutÂh4hg ‰d<perÚ do{adaMhç	Iup)sfpjwIuanzh=q‡[i≥._wd$m2c4mPochtion(eJunâ*	4yIw,psmÙion Rrdø∞t`kq._Î_kVl0tTkÛitÈOntØË"ab}ghwt‰j)≤
-	/ga,Ñ Pdógi
& a^ƒ cell`eÁ/s(ÅJf use`tkdKvESeluyio pjkata>n(i∆ s[Dmÿ`IOgmq zetuS=dM
		˘~£ aÆoPropegq%iÔn) []+â	ˆar`ui!5†vkir,]Gj@AÀl®8sâAâ	)b(|hIs.[4rÈ%gez+„erag/h ÂSeft- wI9†4ù=§Œ`-sd<({¡ã9âtiirÆÌ~t7eU({i);
âjetuSo b·Lze+
â\û	’Hi1&r3i|i+n0ø(wI>rMw)ui_n;
	ù	

	√i&-!tkhQß/th7Ns
axiz4|| tHySÆmp9e}N`oe0i{ 1w x¢ tliÛ6)´lÙ·@S0]Œ2tkmeLudx =†th)S.2oÛKu@oj*lent*'px'3äich°vÏIs.k±tinb3.c<mw2|\ ‘ea™}xtio˙c.apa= ¡}0"x(¨dx{s>`wn1dr0uÆstyBP.por*=-|hi3.posithnnt_l)&p˘g;	)Ê(,qi$dNm}~`gar9 ‡.i.`llaNqfeb,drÈ˜!t8hw	 e~enu)=*
â	2e|u2nÄdadsE::	u\,*:Oigw}S$np: ÁufrUÈf>h`wEn59‚˚
M
		ü.Ib*wÂ†aÛu!tcajbdzoPPcb,!s,(igbbÏ P(E }afaÊd2 m:ou4 ¥hÂ d¿of	wg≤ `ÙoP‡gfÄ= G·l3e;-)		ig`(.5	Æd$ianeolr8$ ©vËyko@˜iÁhs&$ÚpBehafm_q¢io
	
er/"qed = %mui.‰‰ManaGe≤jdboptim˜. ewGod+9J
		//kF"a(`2gp som’S(vPn}nı|Û)@u`®‡¶sovQ`∫le)
+	h‰hthyc&drq•d+w$		‰Pop4ef 9 ÙÍic*gÚ_rxdd:		âdjÈ'6lrxdÂd$ f1lsmª
y
âä		/)if(v˙g SxcinG|"mlgmglÙ )s#Óo(lnGab hn 4he DOD(T.Ô| c/phec tG cmnViÓue$(Sde!+82ñ=)â
9àva2 UlEme~t†= thiséemamaÊ7S1\, %lemÌn|KnoÌ="faÏse˚M*	jile ,2iÂ%unt ß'(b(e}l~4†- 7MesÌ~t.aRulP^Ode9!a ;â
iF
¨`L]kdb| º= dcmoe‚v %0{
	IeÏC}enTI,{-∞= tp1u;ô	}
KÅı	
Kycf (†!eMtÌaf‰ÓDkm v. DËjsi8tion{ÓhuÏPeb9="´o2ÈF™,q¶8$´+@1PqtnàvqË{_;å	Id((this.o th5oÛnzeVb4b=9%"ÎTvwCyf"∞'.(!$‚o–`ed0t}@(Ù@kÛNgÒ<·ilq>r]wert05=`Êt·lmt" '0ƒro`u$) tt x(Ès//peGjr*re6%rt#9=(‘p5%bxl È$(âs∆mmktidn(`(as*otÙ-onz*vMfdBd9)&" 4i{2*od4Ionrp¥fa3t&Èanl)~hÌ{.eetmÂnd lc∞pE`))) {(	ˆE¢ cel' -)|H©Û9	â	 ™4:Èqn(%lzev£ÆaN)metajˆnAs.OPiÔq˛c,XisHÒH/n,axAÚsqInzthH3Æ'AdinØs/Be>e>eDus%p{Án,$$;, Fec„Xkm>!${5
	â	kf(sahÓ._tS)gGr8"kt∞*0ewentx!=Å2vmEsei$rOJç		K„e,fÆ]eÏebp()	I)ôTä
	-©Ã	ç5 álre${
		9xE(4hMc&_ÙrkwgÂr Ür‡oq&! ·>MÆD! a7=Bfbjs1i†)	]uh˘W.Wcnmirm)r	J	}X	˝Õ*Ö
		pe4UPn•Áhsecöt¥
â
â^muıaW`: ftn£dyF,ËWvenD©†{*	ao 8|x9q.s44mÕNc&JfS¡msT(n π5<aÙbgu(!wàI		d% hhñ-ui-‰ra·oeb,e-ijba,mbi8¶#Æe1cm(bwzcdIon© { 
©	â	tXhbpgpe/v^nd≈rÂloV%3hiLO8l(≠c; Ji	m%w0/´SgMoTm n2alm"heÏCgbsä	
U,*ââ
		/.mf"tH<`EdÌEn`oep0Ys∞ucEd®Dor$|rÔq!bnas(@inÁOpi†tha`ME{Û/Ev tHatÚfse#k,g"IAS ÛÙ/rae‰H(se} #=1 ;)		lf(" .s©/t`m·NqGÂr*="4Æui.ÑÏao`'·sOvc&tguàdhÎ∫%®AteÓpmπ
	MZ))PmugÊn$$:uÎ+mı2ARot+uysg>ﬂmO}scUq.Ball:thIsº u~cÆt'=I,^	ç
	pÒ~beU 0Óunc~hkn0)zh/ä 	Iv(Ù,i{n(%LRez.is(‚nga=d`·gwabl«≠dˆcggine")I4{
		tdm3'NÁoTrep{9)>9!}"ulse#-ôt`is*W*mO·pj)3â+âiçK)J	@reuq“. bLics		â},-	'eTäÒjd8e8 cUz„|aoM(eÙezt- Ó=
M 	bar hcjtl&†= °Ñyic~}PdiNNsh£nele }| $ t™is.Ó!`+Kl3.hIÓDlu("t(iq.mluelq,.l‰mthdß 4ruM r¶g·h{e3,tl1soqtao~3.B)|cte ÙhiC~$ºdMWn4))	)/ÊI.Ó"*(D	aDv[Ölf(!
		MØeac`HfUncv*gn+) y5	â9!Ee∏phiÛ Ω9(i}eäu.t!vÁ%t≠ xAFd,u /¥urumwâ	[})E
¢!I“e$drn i!neÏe≥ä

 },M

	Uc2eateHÂjevz &5dSpYnoe4eoT©!{Õ

	na{!$= tHIs*o`tyoN!?ù
-sdz xbåqub =2§.)GGu~ctcgÆ*Î*ag,Ïer1 ? %(kÏke˛`cR.A‰u≠y	t®iÛédMummntpU≠`Ief5lt]9!4:A(k/x•dpU24=84„Loju& ?0pIi≥at$Ie|t™bÆÎje(iz}=ozÈAetR*&‡d'+ :$|ËqS.%`em'np)3!Iig(!heÏpdb*ryvenıS(#`of1'i.n}NgT»!		hgÏe`.e‡uNµ%($Î.g``ÂÍj@/ π=-'˙m^Ánî%0? |9msel‰eEj|;4]_xeÚe>|œd`% r`o&a qBjlTg	´9ç
		H	nxhilqErK0› !<"xx)séudem‰nt0dvbhqhdàixÂdº`R„nlUt'8-).tgwv(`eLpes.ossX"pogati˚j¢)®im)Ëm`dR,cq;0"z…{xmag£, 2ag3mlÈ¿u≤(®
		ÅÚetu2n0(el`Â˙+ä],¡Lä^°fnuˇtn¶fR}tD˙o}HeL|dí8#fp.cv©ˇN8_bk!`R*âyf typeOf@>`j$= 'c4ry+'7È#;ç
	obj = ÓpÍls04md("&)?	â}*	kF(ØfmÚarÚaπ8mbjm8`{ä	)npj`}"kL–@4*)?`f*¢]l(dwp.(…˚br8](|L(p}J	\J	Iyv`9'Ìadt'ko!"*h$[äthis*ofrd .Èhic+>mefv†5∞nBbflucv k°t`)Û.oÉz'1Ø1Æ,ef|+@)ò}	)if¶	%2kgh0g`mn$nbji%˚II-Ùiis&œeb#ol:gdib.NaÊ"| cBa3.hmÓ|w¬82OlgrtÈjÓS,3)th )†Mbj™"eoÏ†+†5hi˛6}·r_io3.DÌnv;	©^:5hg h'¸poin"cfn)r;	Jtys~ofFÛev.3HiCk¨doP ? ÔBj.dÀp†i<k)Û.mavelov.}nP+	
	}
âåyg((&‚Otıom'"[Óo`h))˘-
	/	thec/oÊnse8,„,igj,dix Ω$dTa/h(|`gqpRopoÚc/Ns/i•iG`t -(o®y,`O}tomÊ;tx)q.oapgÈÓ#.uO`ç
âx
	},k
ÀﬂOtvQYÚeÓhffs5t:·f5~wtk_&9q#
+ùw>%t(dhu k&~reÙQ!bu,t0aHl)c`cHa Au;‡qo{kthol-â…tl·sÔof¢geÙPaÚeg¸$=®|ÃicÆXElp%2.k&f#gtP#Úen‘)à	raÚ(@	 =∞vh)A)/bDˇedPcre∆∂"/ffu‰u":	J-/ ’xxc±isd°0s‘$cÈcdk%)Ûa‡wfsu)we·Nee4dto†|/di@9&a,mfÍseT cadg}l`‰` O@`”fÂpv,$rmnke4xD0f-l,;winß§happE.·C:H…ù/Ø	!j`Th%"poyitio‰$g&`th% 8ÂxpÙz(…s ac.ol4wa$1co ©t7sjoSHmon(i„ cedAmhct‰d ¬`WEı0oÓ t)E-nmxt Ho√iv)on%@!4a˙qÆtJ		/o22.†Pl%metı`~ovdst4¢pi tz is†°"cI}Ïd†od$thM"sc0gdL `AreÓÙ3 1Ld txG$sk4onmÚÙ[e4 ltn+z tÈ%`dA+umAotéh7x!c`$}·`^s t8Âv		Æ-  $ Th| ccrGlL ks ik£<ıdml4È~@tlu!if)qmanêÎq|Sw`i$lon on Txe"oÊÓs}|(oG√ÊËd$pq≥mnt$0KÓ|(ÆE2ej"‚çcclculct‰d%0po˛#pS cùã	»v,ÏliÛL`qÛPositioÊ - ßab{„luke ¥&@vjÈs.˚s~om,Yi6a^Ù\4](£º"Dccqk’h4""∆$$.ui.√Ôba(ÆS(dim{
ÚgZœll¿awel{1)((is.mtgscˆPa3ıÊt]©»Ωm*		pj.n·vt8+y |Iis*scs_¸v0qru~t*≥`pD|Left(´?M&»	pl.ıop$kΩdpx·ssbwliPAbe.∞.Ò!tollTÔÚ )	
	=B
òY)ß(™~hi{?oÊ:sÂvPir/võ`["Ω=$o'qÌm)Ù.oAza æ?DhkÛ0n-tds p$fe qcptaLÏyêdo.e@fkv lL &rÔ3seb3l smoiE``!geXPqeeC mZaÏUDGs thhs!(~bozm`|i+NÜ9|\≤)DinÛ.efg{eÙíareÆP[9\.t‡cfcKI°&"t`Ëw":f&7ÂvX‚geFtK0m*}CfDaÂ.tOFMeE{KÈ[5h)∞} %ht≠`&!&2†∞/bqcSDbÓa±9e≠)2'Agmy(I≈`~ixâ	vm<+(t?p:®p`Ëef‘:"8"m9
ßââreTu√j s	-w}Ú2*Q5tOp8*$(pq+sdInt(phiÒ,{¸wsctRarmlt.#˜g("bm2du}Tpi†4h2)70)(}x(8)•AI	hedp 8o&teÓu ª–( crÚeIˆt(V)-B.obfse|ardlt.csg(≤zo`dd2LEftvi‡th*!11-!˙|$≤)ùZ	|;ä	âm.
-
OgÂuReÏKtÈtmOfÓwdt8 Êunotil=aˇJ	iu®tjÈSÆssÚTjsidiv=qà#ilaukV≠) {	m	vab @Ä•|vhiw8!laMen¸.O39vŸkd((#3â	9veDu‚h 3O
		ˆmq:0ptkn - pkRs·…nu(xhIy¨ËDlpDv.Ú{s2vo i,0†© \|/) ? 4kirØZcs/|`Q1reNu,ucsjÓ®Tmp(4M(	lust2∆b≠¶%`t ≠!(`eV{eÀn‰(tHis/xem`er/g˚s £$fu†(d˘2) .¸ 2! 8brlis*rcrO<J·SmM‰NÛ"2'l4…uvÙ,		Åà};	àˇ !lwd†{ç
		2ctub"["vcx: .!|gt∫ 4!|+≈âyO
w,çJ	_ca√,$OibœIn`
 vegC∂È/o() yó	Phic.MÈwÂyn3 º [(J	))laDt†,parbeI/d(ux˘z.al%iÂÔt>coS®&eQp'knleF~b),Y4$yl 0®-ç
à(6Ôê: tare≈lt,t`yq.fmLme&t(eg(bmarÔc(Ùop6)0	Ä\Ω†)¨!Yæhghd40pcrseL~v<vha{.dÏbMeÍt.gCz,#lSrÊi|Pkghı" ®5	"¸¸`ﬁ9/àpLuuÌs: h¯ar{)ln4*t*yeÏÂeÂ^Ùcqr "mcrwaxCe¸O0"iå1!p||¶“©&	K˛{*)9</œCqcL,(gl e˙topˇTdionB:ºbqoge©on(+$˝YÃtl˘sæhÂ-rev2nrNvtIo.s {)I'#d4h`tÈk5.aglqev&Jwd%pLidt®>,
â)Ëehg`p†tHyS.h%mteB/Áu‘erHE‡gHv(	*E	|9D

m,&J_w•dï{f¥ain}Ejt"$[=nc<)j™)QH
var =(thi{nmptmnì
-9f-m.g_ntqi.¨%.00%= '–qzdnD%	dÓ.sonpa{KÌ·.6!?0dIishml¥mz]pU.pDÚdÓVNM$e9M
	If Ô*Ckn@·mNmdk,!=<,'ƒnrumqnt' ¸t o>bÔf¸A}Ím‡ntË<Ω canlm&©ÅTäys.c/kTaÌjmgof0/†”I		g(g>ıaiÓMenî`Ω=†£dks1|dgvg ?†t†>$$w¬Ddo;)~SA{ol(h-gei!©*Èyr.ov|3}f.beÏaÙiWe.,Âlt¿m@th3s*odbr`ı.tÁsun>,qFd<≈BM		o.√nl‰a{JM%˛xjßydgcuie.t' Ô x $&i≥Pf`w(.ScrÏhÙox®0- `h)}/oesatsaNcÙyvdtÔT ≠ _hisoffcGd.$ar}mP.o,ÆI(on£an4ahjmen4 =} 'ÊÁAuy$~|g0? ( : "vin@Á7!:3c¢on¨L˝bep#8`8!d(/®aÎnpaÈ}%env§<=cdÔfUm%.u4æâ$.c5meÓ|`**2yÓ§nuynwi]pÎ(i = d©iw.,a@Errrn`nwdkgn3owxT(@htà9s¨lasgi-r.l}fw,ènàØÓcmjteilÂ4.T }ï '$o3µÏ5jß@≠ 00" &(wiN6◊1ÆÒsr/|l\op(!©a+,%(n*codta·dmenu }= ßdocuLeo< ? l{Umend(∫gIn‰œg)<jeighÙ®	È,| dcE}azt.¢$y/pqBe~T^Oam,gcÚo¨lHe}vkT8 †vhcc.(Â,pÂrPBOor†)/R,hEiGËp -ÄtxÈs.mir˜)zr)oÙ		ﬂ)
â	Èß´ %~(eocuEunttwmndorÃhEvm~t+)
4acr(o(!ktaifl%$p( &'g
Cnn‘hi~mÂbÙngjn3vrua~iRoq= rfa˘% wM) & ‚  &¶fas!c=D$(.,sonÙainMc~s);
		6!Ê†c!0m"c[2+ if)imeM re\}rN;NI9„~cb 3/ ? a/fÁsev([ …vcrQnrer ($¨ad-."qg("OtasÊÏ/7") 158ßhK•|gJ-;	-	!ÙmS~GÎ`aI&`•Nt`- Y
	*	(p—ÛseInt 5(cu((g3® fore‰rLeaÙieth"9$10;0z^∫+0+ (p‡Z˙e…nt$(ce(~cpÛ0≤pefgiÏGL5bt@)/38)(H¸ 4´,
	®cArsaIot-®ce>"sr("borlerTopwidtË"â,7t+ 8†- ) £rsqCËu($,k•a&c3C(ba`$iÓuAgp),10	 } 0ih	
		8/rd ? ati.maxicd*c„boÏdWÈVXhc%,ofcWeuWidul) :&#tlnfdÛf4aDd i§-§*`asseIft*Ñcu+.´Ûq(2borhdzMgdtW(pv(1).qP) |¸,t)- 2pAvquIdt($,ce(,„Sf8"`·4egngRmg(d")(1∞)(oD†+`5!tiIs/hed4avP"m`o~¸ioNsÆwYdtH,çpphiquebgmnÛ&Ëtvt -¢t)i{|ihw'iÆqØrI'hd,U
â			omv†?!MatH∂ua8)ke„KrodXıao8v,a%,nfhq%ÙHmwh‘( 8 ce/ÊfÛe|Ë%igMviHM x aRsmIË&((cÂ)lc2q*2BÌpDmRRodW9&qh"!20)©z|$4)%)§¯paf3eIo4(%©seÌ/sss(bpi-di~sFO‡uOebihq0- ty(! ç0tji#*hu˛PepP2ob/rtyfn{<xeiwJvb•¶dl1c˝ezgiËsn4op  ®THiS.daÛgilS>bo4pom≠)	])
m)1Ù,)Û/ÚEhathr’coNti‡.eR¨= c
Çi	Ω0e›se†ibno'ku„ÈgoentØ#fnstrÙcPv8=-‡	
Úax) ˚
	\Ï{.C?jt`ynmenT µ o.s/ntc=lmFnt≤ç*		\	}l	n
SsonVetvLMsi∞io>Pœ:`funcÏiog(d< X{s)†{ä
	if(%tos!‡poS4Ω thmw.PsiVi_l;
XˆaR¢noÊ5 d!=""·bsoÏuDÂ& ˚0 ;$-02M	)Tar z =òph)r/ot4mnnk,$qssol` = wz9s/CssqyuhoN#==&3Ôbsm¨uEE`6, ! $*is.Jcb?lqPÂteNt”› )) hfuient Ï&`$—i,cnÏt`Èls8tl-F6kÁíoÌ-B·seNu{0]å(Ùlic.Offo%wpÈ{e~dÎ0]Ø)"/ ?jhw*kf∂getX`rioˆ1:$‘xi{owaRolnPaF%~u$sC;Of^KÛroolÈ 9 *+®hteltD(†Y©-iynV%wt©crolN[],tCbFame);/
ô
	ãrev4b ;*çtˇp∏ 	
		9	pgz.tÔp		âY	ô	)Î		/gpPhdafs+l5dÂ$ÓouSe pxsipŸgjN
5(â†dhkÒkffqIx/s%'l‘i~etoT‡ mcd)ç@		
I//(gnny fÔr rul·tkˆ|0xoÛidmLÓGd0ngDks"uL`ti.e`/&‚Cet"ÊRoMbele}eÊt 4~0ofbwÌu8xasEn$ç	3 Ùjis&]ff{gt8pird˛tftp`k hmTI	)			!		I/n´T.ı nNfzeRPbı~t3 nvvxoÙ0UIt,ov4!bo;lerq 8ocFsqt(â bode{)-	/Å* Æ`roısmR,sUÊssa &&!&-jrowkEs.F$rsHgl ?0µ26 &&hThi7>csspoˆk5ioÊt-5 'gIyel&†ˇ)$ ;∞)(tiis/csrXos)wio~ &= #Êix%`' - -t`//sc2oLmP£rƒz~.#crllho¯Q0ö " vCrnllI{B/mtNome`ª`∞a{ s+p_lllc2omhîp≠+()p*0™pmÔ)/		´=
H	laND2 *QôM‹pÔs,e&ÙâIM				)		I)Kââ~/ Xhu¿a —kÏuDe`mkvRe™vgaitioj
		+†¸ias<O&ÊSe¥.rEn!da'o.ËEdV k mod						/Ø of-y l/‡ r·Lqti~e"pO7ithoÏe‰ jÔvEs;(rui!tmN5`oFfwDt`frmmÂ%m%rt†\aofCsÌt(PArddf	Í	â	) fHbg/"tseT*tÚr}~}+l·fuP*0m[d	àIk	iâI.`@tÍD bfÛu$`irent's i&ds%0 sitxouu rMSdeRsp∏?'dSÂT) bob¿uZ-		/†©$.b≤ossR(r·ja0i f& %?b˙nGk%v÷vuzbIon48†122!f#˛(AÛ&c3sXk[itko,0= #Êixed/£?(2 8(<†t»Èp™cssTo{zT…onÄ==$biYeD'9$=ukhc.˚{rlÏPabujt.CgrilÏLgrt®9(: s+znl?I1RoŒtLoue¥00`8(qkbÓLl~skr~n®Lafv ( ;+ Ïo$!
)		
 ];M(üJ	˝l/*
uFcnesatmosπ|y}d: FU dtÈom®eVm~t) ˝
	Tcr0(4º:yhiS>ot–hoF0,`rMroÏl =#|hÈrNcw3Xo≥Õtooo8=< abÓLt`e' &" #àÙHyqfs√sblnTa>≈.t[0](!9(dka|Ìgˆ #¶ §.ua.si|tya.s$TXÈS,Scrol<TeRgldU\, <\is*off#ttPqÚentS1|	-Ä=@T(yS.kF¶seuTasÕ\(2!thi37ccpolÏPa‚E* n@bı`OleKqRom4wdÂz9((jà(<lgoly-o(&tgsÙwcpOln91\.tigN·/}9:
	â4ab20‡feX(º†iven’+p'mX9œ©
v!r pageY74†c6e|%.paµaY;y	/J) )&-$–oıixioo a_stÚ·)l)nÁ#ü"â) * Cﬂntba)c§d e SO3iÙiojhtba =s ld griTlhbmote+/m~nt.â	 '	
â°if)pis(Ôri'©n·losd\io.9"~Ôo	f g!·rg™lo‹&d2qfgifc09Mw, we0wov!t¥chafk8&obroaVkoo±ä	  †     !ˆ!` {Âjpi~lun4;H ‡$( ¢† hf+thHs.k'¬pksneent)Ä{	πj		"if" Ùjis.ped(`iVw[{nlubajmr!˚Í[		  †  `s"co!$thÈcéf,·ÒkÙu['olucÈNdr/nÊjqe\h!;-J				# 0§ coÓt!io%e.t9=$Z¢phirn"_.taiˇgeNTY∞]†+ √k.lıvµ,	
	àM	"  )ti(ìnc/btaajM%npZ] *†ao/tg1,
≠8-0 $b(thh3BJ~,`hÓmELlCp]!+##n*d§dt-		Ö	!  ``pjy26‚O¶tqilie.‰[3 	"◊;.tÔ0 _{ä	 i°}
Iõ	 ¸sgk
		
a$ &%s_n\eÈnm}nt <!phÔs.1n| ifmenÚ3-õ		â¢u
ä	i&(eVenv.`geX"•¢Ù(Õs,ÔfÊset
qtËaK.leBv"&"‚ontain{entI0M-rpaDe"9 s-*Yy&meÓÙZ1]¢;"t}is.+¸dc%Y*c|qga&LM&¥9
	K	kÊ8E∂ent>0agEY - ‰Hisoofcpmî.#Mmb{.tn8`<‡s/.tkijk%f|Z0]	 `·wÂö =(~on|·Klmg.4KqA0k!tiMroÚ$se1/kl)sc.DO;
	Äan*evcfÙ.pd!aX§- thiS-oÊ&se\.a,hgk.mef4 > ra~tmml}en|;2}	0pQgÂ\	M"cvnp'=~=&ht[2]†+4‡(i3oonfbmqaÃÌc+.du"u;
I
Iefwvd/t+pa'Âq(%(thAs.G&BqaÂ>„likb"∂o91&0„oZÙaifmc4R3›0page] =(CoNraIÓe'Ït[1m+ tnj√>ÁÊfQe|>aMiK.dv;+*Aäà}åLIhn)gosry$9–{
	…		Ø?Khuck0bjr†wTÈL$g®mmeØtˇ.zet c ê†tÔ!0ru&ent,dm6ide§Úy 0 }¯zo2 gauRYng hnv¡y)‰"`rgel~ÍT ErvoÚs yk(IE*{ee0|©ckEt0#7π509M
		t·p nb0=$Ô.gim= /†T,is.+rioiÓ`|POfQ *†Ia4jÆbo˝vD (PdO%[ ©"{hiÒ.oÚycin©ÏcnuY*8/(K/_r)dS9]≠h*"m+G–idS]``‘Ëis>v˘fI>A P`gEX;-äpaf/i,=!bjjt`i+mekt ?`‡!(tgp$. thiN„nªet*bmiac.¸ox(4@ck˛tailmemo1M0Ì Fop", di)K.on&sÂ4.c|ick.tg`p c~Ætqi.me‡\iªT) ?vmy†:((! pO0 - tims.kFfSet$hÏi{k.t.p`< co~&qyn›il[1])!<q8-§CgfsÌlY1](:¶Vkq1´ oÓfpÈ$Ss€)( Z&Ùoxø
(…âv·r l!6t(!o*ev,Y4_? |(is2i7InaDòAmÌI! EktM>po}n$® pe&uH mÄuxak,orIgi~ah‘¡'eY-†/0O.Gsj4[hY≠ 
!l.7Ji~⁄`Mh> Ùliq./rigj~ilT!ge 7%ïm	uaweX }"kondah/}e.t§ø$h$(|abe - thË3#ohfaetß!Ëck.levt!= coN`mn%en;0Y ~Æ`L%`w ,`tÏÈÛlmÊbÚu~.cjkc.nleft$.D„gn¸a˚nÌf`2E Ô!,a&<((§X®le‡4`) 4hmi_YvfYe‘*chyc$ofv ,"CkÓpq)nYwÓt4Y+ ? eEfp$-"Î?_ryf[8]:‡(%&d(/ knoreEJ8›©9 ; lEnPøL
		}ÀM		}öH-)Revu`o$r
	)topz∞,
		8aceYY	à			çHç			?!NhÁ qZsÔM%ve`Ìnw˚e$pNCi\ion
	a- txls.offweb.wÌkcJ.4<p	…	I(i			Kø)`Ci#j kfnS4p ´BgL·ÙiÙ5 tot`e ÒÏu=eNt!	H	$6hÌe.ofb{ ~>r·letl^eïc¯®I			//(Nod=>VMs†rgmtiˆm!|/qy`in~ad"jmDeì: RelcpirG ov_sat frk llemln¥tg olfset ÒarTÓ|"		+= ThÈs.Ô"ÊÛg4>pcPenr<˛/p…I	â
âH		H//<(%('ÓfseTYaR'Ët'≥$oÜgwet viti.1t∞borDdr; `gfbsÁl#+ b-+derâ
			ô) 8$>Äro÷se2Nsyo!pk8>&($.frmewdvnÏmrÒ)cÓ "4∂5#.¢Äv`iq.cwspksyt	Ân0ú=†'wi8udß$$r :!("lhIs&c#sTk#ithmN)=?†ßf{|ad.`?0mrHi+sBPnmlXe"ej5.sc‡olÏTOx09†z$8$S√rol¨!Û“mitJ}fe!? 04:scc_mn.”vrdhTÌp(-(ô$)!&)	4F	9lef\* ,/+	teÁD[	èÅ				ç		XH	ØÆ‘hePejS|}˛` eOe”e†p-#id@on	+I), thÈÚ>~dfygtrcÏi„k"lecpâ)=â			)		- JÏico o&fu$t )k!‰qdive"4o te2MÏemÔot+J		Ie DhysÓofÊron.r%lc}wVele‰u	I	âI);I		/ G/lyfi2!rÂl·|IvQËpÔ3)pioÓedHnod$vπ RmlAt9vE ogÁRdt brom!ulu}mnt$|≠!nÊfs,wb0‡endâ	$ |ai3+ovÆSgÙ&`hruÓ%.˛Eft 	i		.Ô0\hw /Bl2EÙ)2ed's¶o.F3eT!vhtËoıt bwr‡ev„ hff{ev@„``kcder.-äIâã	! 9$-fro?qeZ*3if!ri $& 5$bsous%rÓ>-rsion ,!u2F &&0vlms.+˜zPowi˝io.d=-d7biped!G 0 8†(ëtiiskssSÆsivio†=<('&Hpol'Ä? 4hlÛkÔvhllXarg6t<s⁄k-lFefñ®k : scsÔ|Ï	p–kgqKgle ? 6 z serOl¸nrcs}-(|dnt+ 	)J…--N		=;
I:¸Ó		Zclea0:$B%nk|io~( sÄ	`jQ.ËE}pAr/7ÂmmfeClarr("1i-Ù2)Fgarde,hb´e7Ènc£(;
	lg(txi[.hOnpÂr[2_ 0= thIs(mÂ}entÀ8\ $†!©|jiÛ.caosdl@eLh˝R≤%eÔvrl  Thi„.xerEb=re}nvu-9/=:		?/ib($&u¯.‰d}ajqaeÚ©†f.5È."§d"ncgu6,swpvßjT0=(~m,|è
}yi_.JÑdqır =0_hpl;
Kâuh)s>cchceLHel‡#rReEovÈl0y$bads%},àÕ
	o3BNri}@l]W Ôn s},K`wT~‰b ¨%Ø!ionY:‡dppuÓQ
ô4rhGcer: dun"t-o~®TQpt, &v|~ˆ,†u})!{
	)ui - ]i†f|$rËip*^©IasX a{
	&.qx,ng«in.CallrPhi#,"txPul [}raÔd,(vaU-ª
		Èv-txEeÅ<=0(`2`Á"	`T(iÛ.ˆmr¡`iOnAbS†? tiIs¶cFbEs$@øcaLI?Nto 2eÊoNupÂ∂)y"+/U(a¨)skËu‘g$@niiÙhonih°ql~ bm u5c`t„}}atEd !f|Er `Ë2siÓw
		Úeˆ{p˙ $˛wx`ggp.pRkt/t}pmÙr9kÁap.c$l†Thhs((eypD< ev|lˆ.uh-	*
tlp'in3Z%{},4MIWeÈHhÛHj nıj‚tiOf ÂˆG$i†YéÚÂt5Òz!{
		ii<`gr:!thÈSÆ⁄expe“=•
)I0O3I|iÍn*t‡i3n0}sLtyok¨	âÔvmfio·|P´qh4ioN∏`txis.œ–kÊi*°ºTKqitioN,ö	o'bq·t: T(K3ÎxosIt˘k~A3{
};E
MY
,
|!8ç

 nex¸_j/˝a*dvaGgavlg,d{Lverwikn:$&1.8Æ6∞"O-?Ç$ım'`hy/inéad`à&‡p·goqclÂ"h "`ÔnnQsvTGScrtaBnc*(#{	spa3V> ‚ıjc4ioJ)eveép, Ei© 3M

	v`s aOct†? §(Ù (R .deuah&dgaßeEle¢-,o =£Ifqt>ovionr 	)		ıiKgrtablT$=$fex\o.l W}(rsi,&ª!iuem.bÎvWtE|Âm„ht(x(3-
)Îok,SNdarlwv!= Y_#
+&(mÆcm$neC4t~WoJr!bngûi@„h`etnCtoon]) ˚rA¢0Slqtu‚lE >$*deTÂ(tisÍ$'1Ô0tc`mEc°;äM		»V†#soR,`†e &$ (≥%rUqbl„/˝pvÌon˜,)f†rl≈D-yiNs4*S.ˆtA¢hesRU;h)I M)lsÙcmaÂz „/rt!dl\.
	ô	K3`nuÏ@Va|yru2$#GbTab˛ÁÆÔpPÈÕn{,vevg¢u
)		!|%+çâY)	snÚt´glE.Û}fÚeShPkzitmon·*˘ü8//ËSpll†thU$søÚtef~u6sDsıÊrÌ3h–Osa‘xgng†a|,fvag wtar|¢p~0pe‰reah!thE!{m*wi)~urG¢cHu03Incm†uhq qÔbÙaBj-$an.Ù`M~ER gT#`d âs u,l$ho!DrbG Kn$@ji%t 0v˚@b·!t`d‘(–aÙe0*thi√`{iLl e≠Surt∞Kp3`iÔi‰i``esÌd aq`gd≠j arceo*g kwpt†ib†ÛÚ%p$wi~* @~y «haÏFeÛ1Ù@a≤4mj%ht have$`ippjeL0ol†ja%p√od).
	Lro2cbDˆ.GˆpÈ∑nqr*"qctivete†, qvun,†eaﬂ{v4a#Ïu)E®ô	I=>	q});çr>y(™qdg–: bˇjc3iobËarent!ﬂi)({
*I//Hf(d ·j-$Û$inl0ove„t(d!oBp!ÍhÉ¨ 5 gaKa(4he A’kp `rÂÓ"Of the sortable, but also remove helper
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

(function( $, undedin%u0:1{ç
ç&.~˘dcev,#ty.cal˝s~cjDi(¨ 6.}i∆oosqel {M*ç}rpiøj[z 9ÅppmnÑ~:0'no‰A% qutSefbe{l" vzuy<
	Dar}iÓg%8  ,W	§aÃÙar: g*ß<
MTo¨ÂraNse˙ &uˇU«i7
ó}.*	[grmAtU3 :e,adinÍ#@Èã9Ùir :mfg =©t(I{1⁄ç
	pi3/elCeCNt&ldeSh!Ws!}isd|)„t	b|W!!ªâÅ
9-ÙHms‰˙`'w%d?0fk¸sa9	K	ë// c`cHe"≥u,ak(Fe"xillfe˛0bared oL Êhuepç"		&cv pelctg)S?m
	|lys.jf.reÚXh= flctanhπ"{I
ç…?eL%#mm3t• ¨qelf.%pfÈkn˚lfiÃte2. 3d`F/eÏem%.tKY)9›*		a•l%C~mÌÁ>•eClIbs("µh=qemect5a2)?8â	±unM`t%‰{/q1c`(fun„rioO ©){			vbz$<hlc = ÑpxHhs);-
âã	æar`o˚  %Ëmk&n∆fÂ!$(©{Ñ
	Ä		$vfaTa4@ms© "S7Ïd„taBne-Ktem",:\ÉK			e,%l‰ﬁrz!t‰})
			+$eÏddeoT( $txis,+∫		(n!Át:4p/”|}≈g`≠	KâuoR* toQnwor,-ö	â	ãÎG‡Ù(`pos.`Ev• k $Ùjic¶sutfRwÂa4h(Ël
-	-	zoƒugM:!‡a?qo‡§ $th!zotÙarLeigh1(-,	ç	9s_!rtse¯Âc4A`∏!r"mE$			KMyGl%Bvy$*)&tx#/LAÛ√n·Qs(%EÌÌswouaud,%)lM
9)	Å{edecdÏhg™ 4thicÆ`ÂÌHEk˚(uµi∂olEsd=r‰5(,
	)H	Ù˙RelmCe).f:adtxÈu8qsBl#As /%iΩunsElƒcvIfg#©,
	…I›-;M)˝i8J)â3I	Tb}Û6qefre≥((
;
	fhxc.qe$NcˆdDsb=	wdIeateEs*!\cC|!Sq 'ui≠YÂeÂc|ug¿)ª

+phπs.œlouq}Anat );KJ
I…lËW£he‰@i2"- %( <dyv"rlARr<'4Èå„elaBtezl,(ulqAc%æº/Div>"π;Öä	]$ä,	tÂGtPoiö!Zwo#º(/Ó(©†y	J’LJ˚.u`les}≈eU	™.c¡gWÌ
Ls,&u)m;uËÊ`luc6)		/r%}œumTata®"SiheÛtc"<`ÏDwe9;
-
thÈ˝udd˝-&6â	.bÁekvgKhisSå"em-sel}opibMl!}yMseÏecpeBxm-vi˝¡"l!d"®Kâ	I^re!keeƒavi(AeXÎct¡rng&9		.enrmÆd(2Æ3ÁLe„|a„`6"{#/ä-	thi{(WmÔUs•audÚoy(1+ ù		setïro`tXis;
	%
	_-?us≈SdAb[;0fm.cpjgN8etmo¸+ kM
	vA&2sgl»(| t`is7%¬	`i†_>mtw!="[gˆa+dûpageXL egemdÆxaueôMm
ù
id†-4His.ntÏ«nÛnlisableÊ!	TÂ4u`>;
	tÛ oqv)>s!this+otaÔns;*
)6II{{Ámesteds¿;&,.m–tmo÷sb©ltgr, ulis.chel`n‰[8]):YNula≥,_‘Rindeª†"≤tqr4$ ıvAn`);

	D2oPÙKÁl{∑IpeÓdTk°.a»pEnd®tË{{.(g≠xgr!-
»	+-¶Uoit)on!(dmsev!ân„uc/-	éjis.helJmrcss¨k™
ô#deftbj$D6tV,ch)ÔnÙXl	Z	"¸e†"> uveFzc,Èef6,
â	&emfÙi*z‡0-8J¢/Âyghr"≤b0]I})ª
#m„ .fx|ons,ittkB]Dkm((Ú
Z4*Bq.r≈greqh)9˙»}
	t ib.sdzgcte$s,"HHdE2*'.e}≠sa.ectud.+Æ$EC`("!javymf(Ø _ç		FeR1sE,%cte%(;$4d`Va)Takk,#*Se‚$czfrhEm{De-¢8{©6	®sdÆ$„pAEnpTQ:vzamÂcÒwxÅ= ÷wqπH	iÈˆ$(!a6qnLmetcKdy .&`9ev§v|*a}rlÀ•I´$w-@		3EdÂjR·u.6emEien4nrGÂwv%CliÛs.s)$e¸%Át9D&©:
	sflÂˆe%.seluUleel7 f!,s`{
		 ôsDl‰cÙeE.,bddDÊT*‡-$lqqÉ,u!5ujsD(oÅtiá)3			sal3cletΩ.wEn%CDmfg =durq}
!	â/,,qem%g|cr|_3UNULEÉ}HN∆0ca¨Ïcac\	*	H	selv6ubmgge:(#ıj]mlucping*,!%~egt±;	*-	snsenebti&c. „enmc^$e+e•nenÒMhâ[Iy9)MââM/
…	})˚m
°	-(eventnT!Úw%ti&f¿Rent∏˘.ÂndSÂhÊ,+.˜!C`(fM~CÙiœK	+x{,Çˆpr)C#=eadee`?"$.f√uq0ehÂÛ !"sBlEaa‚¸e/i4dÌ")+	N	Ÿd∞qenecuec) j	I+vÓ2 doKalact0›"(kdve¶ty&uaIÂy§&$(1a6ajvÆctvdKm{	 }là#selGctou. u,5mG˛|.Ëas€V„7s®/µi-Qmeg‰dqd%)3	!7mlu'vEe™%Âlalımd-I	H-ærlœkveQda`S®lIS%lÖc0!-0‚uŸmuÓ[e=ebuYN'¢@95.ÛmSdocÙdd((J.a¸Kl„s{®dk”mLec|$> js)=qghecdine& : 3˝i-˘~ualagp{eÇ)+
	aleadÂM>wjsuleg][?˜† !‰guLccV©
Is‰Ógc6eE,St)dcVang!< ıofltßtπ
)	9S=neotga§e&%s}ad 9 `oAtlabe;ç 	ài// relq„dAe`(Tœ,@ELM”IN"„elhc·kk	*	Iir ,t/qg}˚t)%jzà		ise`fh-uso·vtj SagLeg|aˇg., e6ed0, [	yuÂl4Buing*"5lhÌ£tea>a-al%np
â	I\)?)Å	)o‡fdcf {á+â		„dLf2ÕTryggurxuL;edqkuinf",†!rebA, 
â	ì		Iblbu\ec4ing2∞ce,dßvÂg.E|uMg*4Õ (	m-;ç
			KeJêL(rgduÛ*·~iÏSe∫	
		}	}®; "K}
äâWÈousDƒWig)$functi_~(tvenT∞†_ç	(u·p-b·|f@?"4jaw:-
I◊`jc/&rÂk'm‰1_$fZ5e9Ö
*	kf 9TËiÒO¯1yWU3$iÛec,ieKÕK		∂„4s2n9
-

`cr0mptËoN0 ‡iyu.>|pioNs;B)-2 b la·"t(msoıpÛﬁ0]®`yH= dhYs.o}rö1].!"!}¿gven|.@¡ge¯l y©a;!event.p%cRY;		ib$hx Æ¸2( ˚ v`b`Top0=*˙";(@0†, X3;v1†=!po`;!}J	xb *·±$ºD~2(,`6qppÙLp †›:+ u2$=by1; i≤0- ‰gs; uâ
	4)Èq¶jd@rmr*cr≥){|ÔeD∫ yq¨ ˘o`$Y1,*sifph> {:-}π< (•koh> y2-y2ı#;ç
	˜iic,sulaC`Òcq_g!a`feÓtmn-0˜-mpp¯pÛeIhave≈ &.d(4`(¸Hiëû¶"3mHÂCvaRl}9)t%m 	1
!)-/®€z’vlot`»emTap0fRom$beaÆ®gje vbt iv q00enƒVo"#`$Â·Tqf,e:	˘6`(5\‰adMa || wo|oÛÙee.EldßnFr9-¿uexnyel/h‰NÙ[’!
			˚evuuh3è
I)9v·z!hi, = rEM{:-J	Â˙"(/r`mON¬Odole`anbe6}=&ƒgv"y'©0i
Ø+		H˘p 9(8!({mmegt·efli`t 6 x:"<| 3EeMÁteq/:È'™t˛ x t|†sblÔ„ca%tot ø∏}∞®\}a0`lc∞Uef-ttom(º@yg8(I≤
1Å_°} wm`bf nopvx)ns.eKydbaj‚l$:<†#fit'	 {!ô	πdI -Ä*3Enu„4eÙ
,Gt 2,¯Òh%"(7dnfstedÚsg®`0º z!&&`sd|Áa|’u¨tnp1/dy$*& re|u„‡FdocÔttnka< y2)*-ç	 Ÿyn`8hI`+.Så		?( ·EåJX	Lã˘wà(s·lÊctee.rdlcgt˚§+({äH	7eLeSt}≈.,¥kEmc=z%%ÔweQlerÛ8)uhºReLÁk¸ef'M3			…3eQewTÂe*s•de„tÌn ΩÄÊoL;u?è		©	§J)iv ¨c≠ecÁEÃu™˚'‰ebıyÓW)~
	ô	seMc!ıue.%edutend.yuaotag%°s;,«uk®qnsÂbÂ„PinFg)õm
	ç	!eÂ,ec˝e%.w.‚eÂua4ÈnE(ΩjDbi[!?
8â	qà			gg&/u%‡&atÖaØcedek|Ind( c9 âôÂsdmepce$m&ka4Ù*`tt@lAsÛ 'uÈ–Âo%sVIgg/!;M*ôâ	âS·laCte.3eaebtijn·= ÙSAª0		IE7educd)bÏ° ZeLICtI<ß c¡ ,bhcJ)I			sgËF*WuÚI'ueX(≤Smlmst)*w". ev—nu/*kI	
)qe‰`c¥k.z*3©tec|geéeh%m%~tç™}©#
â}	|-%,„•2X+	ç		'+xÕSUNM[T-		Ab („e,e'tEdse|eci^G)1kã				av!((ı6µNu.mÂbc»g1 ||0lbd¸Ù?tv.Kdy) "`sml!e|«Ω®qtastsdm"1%d, ;
+(!sgngct5e*dÌxwmetÆrc}oR`Fl`'≥lf i%seluCtifj7)˘JâI	IcÂÏ1Á|eeRelm„pËvg∞<&il◊e:	 ô	_mleb|ee¥e¨d]uV∂/·ftCla3R'5a%QÂn-cvlde≠?	
		 M{d`acd‰ÔæSel-ctea}†tÚ1d
à	u,sl˘u {*Ÿ	Yâ	Msufeb|e-.4d¸fmE~X&%mov°lk7a)#tims·-WgpMFe/©{
(ãH3ulukÙeeå3uhÂ%gh.g ?@&#lcÁ®õ		Aaf`8W-lE'd UèSeartcg,E#uel9$>)			à	2elcctegÙ&eleiect&cfqCh	≥3hui-¸>s%Ïmc\Ìn˘'	W
)a		+sae/#‘@u.uzsUxegt)ng)q$TStı#]™I		)	}çnM		) %? ÒgÕcrTebLÌ!unWÖLLcTmg¢3ell"!„k
©I		3e≈"W¯rig'w@("›~˜mluc^lu`4nfIzt¨!{-
È
		$		UfsghÈct≠Ng∫$wıl'·te•/UmeIeNp			-y);™		√]üé	˝ç		Ÿyn s%m@bÙmM.qelagteD)pz%
[â@yg (!ızÁnTxmaqL¡i ,& !‰~q~t>Cor8Juy Ü4 kvuLÂ#Âd˚webts„ÏECu5d) y
I			SÂl„cdel.%ulemg{X/"emOvœS`a˜S(7\imUuddctÂ‰ß-YEÅ©ms	imsıd`.sı,`„vm@&ºG»lsw;%KH	X	…	ISÌli„tee $lemÂntv tlBdQ#r‡']Io}N„%lÂkºijez-ª=B	
	)	qd,dcteÏ/ÂnweLdC5jjg∞ø vee9çZ			H	/ì${ÁOe#da2tu AFS]Le„TMNG)ca-hv·s+-…	â;ulf.~tr©G„wz(BuÍSEluÀthogc($&v7ht∞{IââI}jra|gk$aÏg: WEeÚxei'emEleÆt J	I	'Â©õ+	))_®ˇ		}Õ	I-}Ö
Ÿ	-);ä
		zeT)pn`d†l3a;çB˘∏]
â]1k]“]UV`: dmLcºaoj(afj‰) 
â	kr(yd|2¢Ωa‡hiq;Jπ5hsÊrAcGedj}$&fdQÂ{çÄM
	âvev$o`diOnÛp=vl(≥≠optionrª
Ö9D†'*uÌ`tnzıL-CuiÎgµ, ˝hiÛØeËm(e.u[8]ÆÂee8(F5˛cqq/Í(M XçÇâ		vab ceiÂ#vqe =!¥ÊaTÒ(ˆhhs(p"rÂlq{t!"@e-ite-íc;z(	rel%slaeÆ&ÂÏg›en4.pemœwe≈Ïess/&th-ulveHagvi|g8;
Oâ)Ûemh+d«uÍaeÏoC~{.' ¥ fI∏3%+
©	3uLectµe.ÛT‡t4Òelagtae >aÊalse(èqelt.ﬂ|rifgqràÒwÓlAfefŒ-1u‰ekv$∏_
I’ls-lqcta|:za⁄gc$dg,elEÌuftÈX			y);	Ic•;Ø8Å	&:/OqÈmsÂfek|…Óg$$xhkÛn-numÂËtÀ09/•A{i(n’lbpmON0{
	Tas4sedectee%º`ldadI8Ù(≠c,$"pÖl›fÙible%]t5È2);
 	zu,%kte.1LUm≈b‡nr!mlveO¨iqC8Ø<h≠sÂlh¥)~g7+-!dhhesc(%UË=s7~e#t%d');â
	M[alDcwee~3eh%c3Ín = Êc¨su9)	+ah5et•°.rel,btÖ‰`5 txÌ{M
			—ÂÏma4e%sTcz¥sem%„d`T00treesÔ
	Å(se,r6~tzig7er8"cah•i|eaÉ, g6enÙ¨{		selmcted? Ûm}eg‰et2deÂAenT	°Y	˝){
âD®y3¸txigi%rà#stÔp ,e~en|!?¨

	uhhy
¯ÂlÙeÆplmm^eËk3çZ
ArfteboÊixwg9-*Å˝--
~(;"
%.Alıandl,th.ÛçLastw‚$%ƒHkùv·{rhf∏†*0,r;†4 
}):
,
8$(jPqm`x∫ïZç
	d·vc<`on8 $, qneÌCi
ud ) {
J%-vi§gE`)"em.wibvAbmd ≠ %.Ei"eO1s%(†sÕ	vydg¥pAudodTzmFyx*"˝rEÏ(IBeÚd›8*f`.reº_ä	kQ|Iß.R2{œ
[	cz0·.d’O∫ xarL.}")APziSx2.c}cOØÈå	aLBA√p◊ifh: &!dsd,
	cmjtA#Ó/unpz`bp,Û-8âÂuioR:Å'CΩ6'.		bu2solÅt2$falgÂ$É-BÚÔh_nEm4t9™ |0Yw-M.I	forSe l`„-hol!as«)ZÂ>.a¨weh+		EozcÌLE|teÚCio%8hdals≠l
à…ep9:.Ä`ıÏb¨=	he.|Le2 &a¸we|M
*» `repn$¢NriuxfÒl",	
		˘tes∫!'º%8%.åäI…;q-smt8:†bi,sE	-qgw)MDd≈b∏ nqÏCi, 0	seheF*0fÂÏse>JôI[cv/Ïƒª+t.}‰,*[kzol}√enpIDivmW}Ä4<-wcRo˛lsedd:Ë21-		SgoP%z"Çem~uqx$",äv/LD`obex #kktmb3eÎ6¢,Zââ~mNdex: 9†00≠	Ω¨#Ç)_gp%i‰=8hw’.B¥)/z*) Kè
	pa~ o ^pe*iS(gfTigfs;I‘Hic*kontAKnÅca{$ye +)[˝{	hiSfelÙLiNq=adˆGlasª*"›I-Si>teBmm"I˚J
â)MEew tËe‚ÌtcmÃÜiâtms.rUˆveCi,©?	@^)//]Guos!dÂ4‰BinÂ ithpHe†k|%os∞aÚm/`m Œg†d{—v4cyif hÓ‡	zwl‰`|		t`c.rnnatin'!Ω†t`)s^ÂeO‚.deNot( {†o&eziS ˘-=‡'pß |¸-+nÂÊplpigmt&)*tar4(\hyséMÂkf[0MViu•yfbcc ‰dO„uf!( |¸x*/il¨Ine|li&Ïe-„e|l/+drt(Ù†ys.kpeÌ;YqX.y’eH,c”r('hÔsrjC=•	- >@Fa‹3e;::â'=lLu's†DedcrokHE4h·§r“efˆkb`olIqd| )K4ik∞.o'f„eRb- Biw.ITe-mnu.£ffq‰t†®;ù
MÇ	/ni~hH#dhje mouqm(EveŒts'g•r®kxs%bxctyOnà		uIaÛ8_iouweihit(({-™â	-
IØœa%(•†vde$Òh~o"ggäâ…4(¥{.b’i$yg>$tÚeo}

	}®	‰Ìsdrkaí†∆ahf4y{b		 {%
$nwaD£et*dˆftmD˚ıg/&mser]i.„aLÆ9t(iqJ€*I	|is/u`emujT		ÆsemovgC-`[Ô("qi%£o~L!bl5 wY%≥6ta`Lo)`is·bl$b);N		4hyc(_mouseDesdzsπ(ªèçàfos°h(vRr k0=(u`iWNmpe5w.l«|th- 5{@+ >=Ä0;0@-% )äô)	‘\)s.	ve}sWYYÍitD(.zelœvÌTqla™Ìmir>i`‚mtAam}+ $=ÈlUm&)π
çäzett2. fhiq?HI˝≠™W˛nuO0tiod8†v}ncein^"c'I,24idue-?
	´mr0(¿k‰y9== rtI7a&Lgl¢†*
			tHic//tMkÊwK Jek ﬂ  wal1ºyâ
ä+I+rhÎs*w+¬ÁdT,+		 	S v·l%e"?0"a(eLAss;∞: bselhveGdawS"]0dbu|-ìorpcrhu-‰isa"l%t6):
(âi %nwg!{	9'0DoÆ'4 gil WitggÙ s!se†^Zetœwi_. bÓ{5lis*cje!as kX a≈Ê$yimsueTEmDySGBlÂU I,)s;âI%Wkdeel.0vnÙoÙytq?_detOvtÈov.eqpl˘0Ëiu, i`%’oeÓtÁ´kï	,],

	_}auCeSapPıre: 2~ct`ojkcÁeo~.(mvewzI`u@snl§ai"zà
9varavhaR"- uhÈv9J´	
5f  phiÚ(re6Ebpi~gb{
	Izg4ıfN$fclsUª;	}ç	™	a!c(uHy{Æm1ti/n3.·)cabLga"|t`@hs/cp<mo^s.tyqm†=-0w{¥∏tja&) YPtro va|3e?è)/Æ_a()pve tÓ pgDrÁcH`tlE"mÙems"data`on3g .ir3z	ä]	‰his$_seF≤dslI6ems efdnT)≤
M
	.MFinl†oew kf$tËÌ(cDic{e‰ ok` 1ov(Ô,ÂaO.$…4~ aVe~t)0©sha0mBıuYº itDÂ`id dyiS.ÈteMs©Åa£ CÂscÆ|Ht4i0=`lılmÓ"ceLf0(ph)s(.n˜evs - •®cval|>T¿sggt)Æpvran’wh).Ga„`(d5^‚tinN*9 q
		k%(¥.ÏTc8`xaÚ$0`ÿAÙ.Oidg}tNAd` ´87-YdFy•4 =}–Sqn&‡:é		
	cwzse.~Ireˇ†}0$  hYsi8-J			zeÙUbn gceSÂ;		ã=å	Å});M
	mf($ÆdaÙa*agioD.wcrg%t- dhat.ghFoetûe,2 '-¯7eI"- =$sÒlv)dc˜BregpMteM54$ÁvQÍP.|gZge$+;üM	 kf(≥a5rqÂJU…te≠8 vet≈3o@&lm[59AÈÊ®|his/c0kiÎi[.findle†&& 1Kfmrrse≈Aafln‡9 ia	vuz†SaÏkd¿aÀTçm ø nkh3e9

…	 ∏Liiª4˛xt…nn˚fhiÆ§l•,uÂu2“ınT…u•Ì9xnd("`"),¡fÊelf8).oaCl"&o.bd)g~,)({aif(Tls(?y`uvent.tavge¸)B~a,idIan‰le 7 ¥vud)`y)+â
©Èn*°v°l}bhqndlu© rm¥asÍ Úa>7eª	 }*I[tL¿w.c5rzuL‰Ytai!u gırrenwYe%M;	Ï|H·y.^rgy/ve¡u3≤ebtQ^romIvUwN°: 	r•4}S* ¥rwÂ

},NÌouqeKˆg{ÙÄFtŒCtk/n,%cEn~<'o˜eR`ifElandne( omR‚~yˆaeAoo †n
;	ˆa“ o =(tjic.~pi-N˜/!sd4r ="uh`j+(	th…sn˚T"∂ub¸C/k|!a‚Âr ?%|t®s:-
$ä	â./Sm(onÌ˝8need ~n baln Úe.fEchPØ{mth'fx,†jm#`ua= p` "r'gzeSxItwÔr r-dt!hqw"men èvv$#u. ÌOqaeCaÄw9"} 
Ç}¯·KÆrenr`˜Zgqht9m"/()/		ø/C:m¡tapa~† ˘`run‰ TÆ` ~):yb|e ¨Âe0%r-
AphirheLzm¬ =`»pv._cÚateHeOpe2e|en~
		/-GbkI} tlc `enpdˆ sI?a¿	pihq._cqcL5Hel0erpgpoVtion{(•;¬J+($
		 r -$QÓultiˇn wefdra2iGÏ∞-
â!™Qai  2l+c·°neneRAtes aVeryvmhne`po{i\iob rEL·4ez % hxßs"tiu Cg~' f4dp#Ágabxe[&	
		†*O
/âà-Cac»m The†m`ÚeInª cn0th}1opyo}n`l'nıealti
!£tË!s,]rmbhÂMÂrgi˛s<(!
â)nmEiÙƒphe N•xt0sjrolhong psReotä/LpIÛ$sa2nÏlPyranp`9 ÙhiÛbeLr5b>sa2omHraug.t8+:äØ/EËH dl-d/t7s w`Œv>·$Qositmkn on 4ha!pCweaminUsm%sci„3	this¶-3freu$≠ ıhkcezrdNt…ug˝~gäesdt()õ-
)˜his,mdfqeF ø y	Åv/p*%tËIs.~n‰se4.t˛p = \hys.kaR/ins'7nt,ù(HdeVf: q¨is?fÓfÂT9labp 	pthicÆ/`ÚsËNS.¨md	ã}ª
ç
/ Only!fum0 Uy ÎOd†tmc)ofFq$t,$Ád aa.hchalÁ†txE¥jÂlêet'c08o!
tah.(|™"a`ÛÓx7<%(	.'‡TMƒ6"≤yËÏ!.Edd°t‡VyÊu0e 
ut !"wq ‘o maI„ve.`t‡tÏ qkv4hfy"qv;sIbl!	(thcw&Je|pEf6csP∏baÔWiımÔj ( $PbÛo‰Ttg@(ktÈiS.C{sÿosi|io}"} p*y{.`chpe2.cs7,#rosi4)on"+;Jç
	&-ezv!ne(u8kv.„ÁÊÛ%t$(Yö	bljcÔ:0k /◊h,rd!dje „l9ck ,!ppmf≈e<hrelitiv%®pg‡dhe(mh`}ofu&	ëIlefp*`e~E‹u/xaáe_!≠Ptlxv&oufsÂ¥,LcnT,â	t/D>$eVmn5jlegç$%b∂hIw,mfdst/\wpH
	˝≠I	1cbqn0>0¸has.[geu@a:eFtMndvew&)Æ		k1dadmze: }Ìi˚._getBÁ,`|yvaGcfÛe0r! oh)c#i”`a@re.apive†vn cjqmle|a!o3HÙy'n`M)nus"l(e a„tmpl p^q)Fon`sa,su¸p]©ln`) on¨y }sdÊ´fgz rÂmet©2m(rorKviÔfeÏ$Èelp≈rL
J	ù/?
	
	ÅoØCeFuua%4$ujÂ!o˙igIhal tÓÛiÙikn,Zuhy%/m2hfm~atpd3+‘ÌoŒ2|2|zyw&Ÿ7eNug`ı‰\gsPsiÔn)eze>u):MÇpjkv.Ôrigi§anPAveP`ˇ`e∑eÓtp0f-P9M(	4¯i2.nigaBal\¡Ge_ % $÷eFt.p!&eyN
		+.@‰jıÛ5@h> mws%lÔffsut bÂLa4yve†to`dhe†hulpbj )Ó'#Ur˜op¡'' Ì{"wfp¸lke`M
		g,gu2sojBt v 4®h{*ﬂit7rtbfÊqevCzoMgmiÂ~,OgµÚÛØvAv))ª I	I.;CacHe Ùhı(fõxmec4DOM0ciD)of
	tba3˛do‰PÔÛÎ2ion - {x‰≈fj†thiqe}rzuouAfemÆTÚev)°K∏›, `qrenr:,t(i.kur„en04Ee:``s/nu*)⁄0]µ,;àÖ
		+/ib`t| $hMl1erAar∂NÔp pjm8Á`hgyfah,$Íi†m x@epori#ioAm$wo"h∂'z`~J˝ 8nQyioÊ ajxtbole0vu“©Ó√"txe``qaGº S/M'T)aet{m QO˘t`jlw B f tiks†˜Qye\ôiÂp8yv"idlqÂs_0] $90d8Iq.iurrmn>JÙ%m[3](a
â		Ùhhs>cu‚ÚMndhÙem%jld%!πl	0ä@)/ÆBrUipE thG phacq‡glÊ’rfhÀR/[Qreapg@ÓicEh∑ltmR(+;)
â	//RetaÒ q~t·an}'lR if(g)v]~ hn$UoÌ`o0kn.r
≠âiFhO.GgnMaimeN|©	Iv“is,{eu+mftpYNM%n|()ª⁄E	ifÔ>b}";Mr!†k /% cmrwok&o0lhOn
-	P$#(4,&b{dq'©:Cs˚(™cuÚro"	+ uËiw._#T{sÂdAexym2(= $	/`Gd˘!'.„S0Í&`as{Osc)>çââ$*&ro$yg	&a3s("cuÚÛObj- a.aesajp)?
âuÖ
é	πj(k.oy`ch|p% { /. qa„iÙy"opuyoKçã if0)Uh	{+idlqdræ·wy*Îpqaht{#19hthâs.ﬂsTÔsldO|¡bxT}2 tyh3ÆqtD8gÚ.c3shbm0abmqi‚);ç		tdicnhOd¯er.‚sW Op sir¯"h n*pA#kµ¯))ç	5⁄E
ä©b®Ô*z	nbgx0s0//0k≈.dÂ}0oqthk.	
	â	if ,h)s*(eıpeÚ.e{˚`:|If`Ax≥)"txhÛ.^˙zed€IjdgX =$thi±.ÈmpeŸ>os1Æ"|IÔ`e¯[;©phm{& el}ern!ss("zIj5g¯ ¢ „'zKod!z)+=	-	 	3ØVpE0qre cgrÎ(mknCL+	Èf(∂Ë)s.scrkOlP remPW$]$!9 roo’o#nt',$t`i≥WbGilxPargj|[8Y*ra'Œho˜$®=#'tMKg)ç		ãTh„r¨ivexFloWGb6˚$t`4(0‡9qéscr_h¸XaÚdn4no&Á#eÙ))<	JMB	//aM* Cadfu°cksN
	tHi{_pshabeRd p‘arx0 Âfmnt,!\h©g*›eiHesh…89ç	//V)cAslo |xÂ He-peÚ)uÈzobIoÊ()thi3*_t¬m?7rtexelÒuRropnrıy~wh,
âi	4hÈÒ._cqcheen8yTÚ~pOrdywx`!)-)I)/-POsv gcc4rqt`.†Evumls04Ó"`sq®bÏU"´e7t$i>ÂvkIY&(),Ô£ti~sqhOn˘";
	J‰vO˜`,ˆyri Ω!vHisÆcoÊvaÈn]pÛ/de"!tË- q:(»A>=d03hI-/+ { uhÏs6#Kntmi*ÂRs{iù´ODrÈecg2àActÈtP|ar,(%ñenu5 yElf[uhIÎsh80Xik9):(}=J)}6"çâ++Xraa`1m`p{s1ÈCngfrõwa"\es
	çf™ ÆYi.dd}@nime{*	A$um.dh-aÔb&gr.cqs†e∆p≥y!¸hmQ3-ä
)ef(( >dÔDd,in`ferfíf$!o&`ZÔpbdha|icqzº
ç	$u·-‰d{a.√Êgré;r%4ApeMvN˜e4s(tHJs-®mvmn4-3

tmIznsrbeg(ng‚y V“Ue3-à=*;)~jiÛ.jQh∞5ˆ.cdÊc,3w(¢tm-s[jtaS·≈, u|peV")L(çth…s:_\Ôt3aD≤bf Gvlnu(;"´/E¯%cute†u9Â $Ú-E†oÍcl M tlIq0/·eseÌ4uHa HtËpe‚Æ/dPvo$B!&69Si“Ïe b#&mRÂ GevTilc†itSπcORRdgv"sgsit9Œn	
		pezuvn¢ts5T0"	w,
mé_›+esdGrcW*hjuJ'Vyob$eVdnT( z•*û(+'Sol5tauid(|ul`ERs0ositao>âI@¸˝qæqoaBdyÔæ†5†Tiisè_gu^·8aÙePorÈvi«n8UwmÔ7)
ã|h)qÆo#ytmg~I"r ˝0tyign_eÈÓÙeVdPoÛ	tioÊ\N8! bsg,<‰I"x;

	hd§ÍÙhas?astPosk`ImŒ@`[(({ç âHasÓ,awt–osityoÓYist	u@ic>pchdaolÅcs)
	yY
+Ø/ks#2G,kI.u	ò{d®rÈwé/tviÓS<„crgÏl©:{}à
\Q˛0o† Thiw.kh,iO~s, scÚe§la`Ω`fixSa:(*Szt¶pËir.rbÚol,S`{ez¥[0u !©2Em!¥…e~p 6Ó$d(iˆsbzÕ,|x{ZÂ˛tK0]*taGLeoe$#Ω'HLMFß)2≤¨*ß
	iif™(Ùz	s>oRÌVfÓoWNgfsgtÙ{x 0Òlx∑n{brj,lPaSajt[1U¨oFfse4YeigÍf+0	ev•Æ˝.pa'eë4bÁ.ssBm|l€‰lSalÈv)tx≠)		ThËs+rcpi,nQa¬!nt[†]2wsrnÏn<mp"-8suroThıfÏ+ ty)g.s;bo,5PaxdÓTõY&carolfToˆ + g.s√rgl.Wtfed;ç
âàã%lsupif®TV!n4?pcgg]( a»kÀ.k˛$\fNvœbÓqdl&lo`&< û„cvoËdìÂNCxtyti&])
	…	thir2„pnlÏHsv%orSvW.sctlDTkp6&sirm|h=f"= r‰Qg≤crolæRe2ekˆZ2].1czmllTts= o>scpollSped`?)]@hf(tj)sÆover&l˛u+.bCot.`%f¸ ( t®es*sbrmdÏ&Ermnp[2]?ofg˚uLSaLtËy$•#Âvq.t.xa'fY <$g.kiroŒhR≠Z_ityvytxj				+qj)2lwcbklLPA2$Ór[0].{„7ˇ,Ìla&tb> 1cÚolnod°=0xos/Ysro¨mRgpentW0Y.37rœdmHett"3 Ìn;˚v~mdpUA`=
¡			glqEtaN(‰ˆefenpiOqpd' tli3Ænve2|ll{/&2set>Lmfup ñs„"ol.En3MuÈvYÙ5»E(			)2k)s™QarnmÏApeot[0M.1sril,~EfT ΩscwnlÃe& <0pl);.sc0klf‘mrßnts9˝.pk`kÏlﬁÊft . GÒCsopl√(Âeg^â ¨/	} ee2#8[
iz mte~dpa/u~0-0"®o„uiefti.Scrœ|ÏV§x*Q2, g¨sconmSeÏ3ÈuivkUq-äA	 	sˆUlh-4$| '(to„uie 4®ÓuC~oh=Dop&*$kAymcn‚)h{cRolÍTlpH1®- k.s¢rf¸lÀqaeÙ!9åä		-EÏs≈(mÁ($(shnƒgu).heigi4((!- (ewÂ{u.4!cey$=8$,ÂkcuLant´Æ{„zOl`o  )(0=!.scÚol,zgÃ3ktiity)ùŸ	I…Iscvkn∏e`"50$h@ok!mene+.q·ba≠lTP +Âk7uM%ju)rcRÔj=Tkp+£2 o.ÛgonLdÀ0Ee`øi
-			Y¶©`&eÓ¸∫Ùege °](¥(duceÕÁk‘)$pcrmL¨%$t 	|ºo.qcbÕ~mKfèwy4iv)pq-Ç			ccvOmlgf$9@$(doB‰}gÓv).ÛCroLl\ubT´do‚%lÂlw&{©wo˝lLEnu$) - o.scRÔ(l”peed);è	âelcl!sR(1!uh*`gW-ÆeÈeuh	9§- (ardlv.puugY8("d"`g+/en})2r#uoÃeŒdfp(-© x k/ïcroulCi‚qi`+|d6xI`	+)â{cRøldgd$?  ¨to'uM=nT%.3„ÚK\(L9Á«)$(lo„]%el}).3avÏLt≠dt(+A(kwgro|SpuUd©zOL*â	I}
éM	?wq„bmhhed(!/=0dl¸5 &"!$/il‰d%,a%ac†&" lg>Ârm~A$*s~howri)â		ù$.Ey.)DmaÓq∆ew¨prex!rOv∆qauc(4@ir, esen¸!:8N}MZ≠â*/Cegefepa4(u~e`acpoltT|0pf3`4Iof`CÂdboZà4kkc~)oÓ"ghe!+s		DËI≥/SÔqh6jo~@rS Æ†tz+snOcgn6%duoÛ)tImntK,"Q"sÂÌd,e"i;-ãçZ)-?Se` dhehheÏpÂr4osh.i#fÅhÆ(%this.Ôp÷7egt>`xIq ¸|†uËÈs
np4c/mq6aËiÛ`d=` r·) this*a%lp„{[0}.S’}|e¨medDù<pÍiq.pkqxvio..lefvãpz'
âMYf( T`is®ÁqdamßSØiis$|n!pË)sÆ/pÙaonskaxÎr0!<"xj) tiy{nÈclxhv[∞=.sTytU&Fop@¸/t`i3.hos-4lØNpTox?£px/∏=ç+9	?/Re·Jpibee)&op°(fc È   dir.ip•m3*lejev`6- ≥; a ∫-`0;$j,=+,s
)
ø~Ca e¢6qriaCles$!Óf )NpErQ‰„Xi/n, c›~tidg md!ng n‰ur¢dc¥hgf
o0	'or i•e˘$<UhmwnÈtÂoZiMdi4aÔDÓ%˝e,t(>0ÌpemhitÂe
0}8†ijtwrsuc4ÈnL$Ω EhiS._i5}zs'{trwitRnK«teÚ(kÙde(
ib!Ë!)l|aP˚‰Stioim"„ooThn◊d;…	if.atemElement != this.currentItem[0] //cannot intersect with itself
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
	swing: function (x, t, b,†{< u)<_-∫	//a|ePr%6∫eaSyn*tofHuaÙ); âIvdtızn(4'dÌ{e~göd&m@sinc,auf_	|'t(!c-$#<†pœ1	o,
	%ws‰IlAuaf:!fUnJtyv/ *<È tl8b ‚,»d!"˚

©rdeQp.s™ ˜k=$8(|+ B?
	y⁄R-ua”'OUvQGee≤fu{cti  ¯¨†T,pb(bå D)({¬)r·tørO%b 
(t/- -*|+r) `|+	=(	eukaI.Àµt–ı(DR∞.u.#pÈo. 8p(t, f( c, `)`{
 iÊ**(to}t/2	£∏ 1) bfptrf A'0"Vbt ˚2 ;	Jâ+2ut5:6$/c/& *((=t8((p-r) M Ò") 2{
	M,MÀeacdAÆC5nkk: nı~bdiOÓ"¨x< ~, B*$£$ dâb)IrmTuzÓ C
hTo'D+t*t0+¢Ê+}%Ì
	E„s%I}dGU¿h'∏vungºioÓ"x4ÄÂÃ2c,$G,†d(!;-
)	rE‡5rZ c+0(tΩ$d}).T,p&k0ì9 +`2
	|,
	ÂisInOwtCuÎha"wu~„dkßn®h}(2t©*jÏ"·<)d	0oç	yf4¢(/5d?6©A|!1=0redÙr÷(c?68t:ıåt0J&Bªù
)	Reu52n ´.2()t-3)*u*ta#· 03(c;
â=¨	easminQuÈZt:@f5n£tmÔÓ48x,∞t,§b/";( D10{A* ~•dˇvn§c:(t/?`)*p¶d*q$1R3≠I|.a%3gçıTYubZt˙!f7ja¯iGn"ôx, d} b-cÏ0 )"z
2attPn4≠b2j†(	40d-1i(t*p"T0, 1 /b/ïä{h	e#seI^_4Ùqu%rtzt&wnbd˘oÆ*x,†l< aÏ0k,$‰	 kHi	lf09!t?.f/w  < 2©1vmpurN #rjÙøttkt+†b;
9BefuÚnp-'? ( (ÙM=2)*t t,t†g 39 Û`h
I},	de˚uIÓTuk~Òz Ê5™ggI˛n†∏x,	t,®b) A-:d†yÆ	`dturn(m/(to<‰¨*p	Ù*u.Ù k8c3},Ø)my√aOwqQuiÆj wGnbdIo~ l~n t<', ÛºV"){J	Ös%T53:†C*,*d=t/L91-*p,Ùät*0bc$1) ´(r;
}Æç 	aa{uAgOetAuiÔt∏0ıhct)_Ó#*~- Ù.0`m!À$-@9 ˚	qf!)tÆ=`o2 <‡9π [mƒurÓ c/s*4(t:d™d*r!kà@:Mxeu5˙~"a'0. Yp-u2)*t:Ù*’c§ + 3)2#"b;ù
	˘,ä	%qseXjQima;funKthon(x( u$` c($d+a[
âratW‚l -c`ä(I`|h.{n‚85/t!(∞(…!4Ó.Q	/29© +†s +0h;
},íeÂSeOytQIl›: ˆu.sphon`(x,(t,`b• Ampt	 Î<	rÂducnc *Ä`thsi6†t-D
* (Õ`ÙH.PIÜr	)!#$r∫M:},	!a{eIkO5t◊WN%:!V4dc|hoo  y, §- f, c<†l©${:!raÏuzn$Ï#>≤ ≥ (OaÙ(,Áow MQtËæx…ä|/dk"-(1) &¬;Õà	y$Hm5saÕ^A~P…: ‚unCd[oo(x, u,‡'* ", `) [
ôI`ep5rÊ0(ˆ7x89 *0k > !†j(Mal)*'˜l:,#1p†+ tÓ` ≠∞A(-%! b9
	m<è		da{gqpMZro* dQÓc<ion†®x.$t¨$Bπ$„,!F	 {u	$RgTuro§(\µ}d[4? c+C ∫ c‡*,ÌL!|fn`oF©:, =4 *1|.d%(+`!)%k "ª
	˘>	)ekceIZtWGx1o: FDfÛTion†(x$ n$,pl"k,"e)*{J)i& )|ù58- r•tt2*(gq
		)f  4<-`*)revır_`v+c3	
…Ejd ∞`Ù/7h/: <©!( rE^vPÍ"c" :"DathfRnWh680%1`:∏(T-""	a  s:M*	rÂÙqt~!c"ú2$(?Giq±.xou(2, )3<".0--p)$≠2)(#†b
â|,J	eac%MnGx`k:lguNcpkoN Ë, t˛ r(!¨$` k()rEtuV.!m„p>†+athsqpt(1 - hu/=$)*|!†- 1i†8 B9-
[Wl	
Âa„uu6BÈra°f4n?tÈØL (9!p,2„º(c$"`)%{
	ùrepqP~ c§(	IA~)&sprt81d≠ §’<4%d-1)*\( k ˆ;
9=,â
	AqseIo€ıtByrcj#Fü-cuion hxÏ t( "l o, e+%z9		k&, t/=dv©	º<1k rÂÙWrN$-Û'2"* (LeRy.qyzt)e$U t™p1`/@19 +¢b	M	((mturn c/≥§* (Mcuh&{yP¥(8 -†(vm=:i"|) ; 0( i2B:ç	\¨È%a˜eM˛Wl·s¯c:vuctÈJl"(h*)¶<c( Ò< D0 õ*	ˆq ;55.& 089v
2®R} ;~iÚ†a=cx+	iÊ"1|-Ω)†rg452n bõ` Èb$®(t'âda}93)dretqÚn F+Î;8"an$82pi p=`*nw<äiif <( < Œa4ha‚s®#);(!a=c;†vCr s<xØ8˚†}≠JglSe Wa2 S "Po,"*Eadh.…-1*dÒth.qpI.`C/{+7ä
botqr> ®e(athæaowhb40*(Ú,=311 
(Mq4@sin¨(¡w(d-[)*ÄzI‡4h(P
)	p∞-© -"bu.ÑíÂas§uÙDnacui:!ftÓcˆio> (y t, )å!s$"fâ"{
3T!rås1.711581w`#Äp=0;5qt"!≠%πo
	Jif dtΩrπArÂÙs. J* "=fp t?4!591) se|µpN®c+„+"Iv:(!p5"`=d"™?=*âif  h 2ÃEa8i`b˚*ak { yy„+ 2!r"sµÙ¥; }		EDsÂvar"Á8= p/h *MmtÀ.‘œ- j$Mah.da„_ (c.a©;M
!	Ú5ˆuR6!a¢Oath.pow(2D-10*t)(:8≈Ueh>wid(v™`oo+*®2*I¡TH.DI)2`#$+`c *§b≥a/easıAÓœ}4lis4;ci§fqnt©Ôn (~L`t, b¨lc$ddi1{ç
		r†{‡s5120Ω483vaR(0~t·w†køc3åJâ¡y∂"(|=}0!petpr˛‚n;0 Yf "≠t/Ï/≥	>9:+,re|Ãpm(v;c  if ¯!p	!p=|
(ä±*1.µ)9K		Ìf(*a8 L¡vh&‚2S)c9)(› „69 r·r 3>t´¥c(}I*J%Ï˜e!Far { =°P/Ë2>IctIPI	8* K`vh.aqiÁ (Awi!;	IÈf"  <8Q9(r-Ùu‡n -±*(aJOath¶ÛÔw≤828*(∂)!i hqEitÈ,rH,(%*ƒ"d-S(*Ë2*htp*PIißp&-! Î0‚z
)	z%turF†a™MaÙ(<pew$:=/11(8Uµq/)2®ÄMcth,wkn*0i¥,`-s!Î(r*LaUj.I)/p8-*.7(©	c;"bzôH}$M
Ieq?eHfBAc~: ¸ˇoaLI~n"(y,`j ¢3<‰$&Û-&{âIXF2(3!-u)5n`Âv!jed- s =†∞.7∞a58;
M	bd<uÂk K.(4m`©"Ù&  C+')©Ù(- r( # ",
=,
e'≥a«ı4∆AcizxnuvCpeoj$(x¶ívh b, w,(f§%s(bz
(id hS}`u*‰eÊAle@+0r$è&5.6 1,;çãriuWrl"o
8(4?d&d-1©(t*ä,S9	*t )(fg3´ © + „:j-}l	eeAuInM}déaco>"Êußotmsn nx, ∏¨`b,&_,2T$ B1 {â
	iF *3i9 "NDEfiNed9hs = 9.∂05:?é
…h,$(§tc9`>2 >$1/0[m˜;sn!K/2*it:u+d)2>9»1>3Uπ8+≥*4 / s)) c b5>	ˆepu2n c.2
((~â="*t>#()™ë.p20))*1	™ƒ k k+ ?†19 ± f;M
a˝,L)m‡3eI(Lonse4Duncvyo~Ä<¯$)4,"b- '#`ya{	
setµ>fbb )$$.$°'ijb&lqz5ñbmueee Æ:n d;tdƒ0,`b| d9 # ·8N+}*Mé)}ac^ud@/3zCÂ>!fUJcpIb§Ëm,v-$b"w,,dA"{e:â	˘f,(Y/=Â+!< (Q/'!iπ ˚K	â	2mtuan C#(7.56≤58t"t)%) `q*â˝ eÕsa∫iN((t†= *&/?g5i) ˚L
		2etuvng+t7¢5w≤d*(pl?i96=´2.üE®9(t0≤*6)†ß°g9	
âo$dÓsm kf )m <2)7 2ñu))1{	
I	sl trn cj*5.=6"5æ8|=)í>6/qf7?£)™T!
(>1)∑?-†;‡";Mày ehsg(⁄ç	ârÂlQÊk 3
*>7∂85*dÌ= **62:.7e+)t # >x8¥≥7	 + f;	˝
Ù,IØ£aes`MnKuÙBmwjc%:!fn t+og x|†r(®bÏ`i2d) K	JOIl&∏d º $´2©(P5‰xf 8,gQkiLg-hiw!mvmeFce†(¯.T¸*$ ∞, #l0fa ™*1!+‚;e*âàrmdurO$Æ*e·sAmf.gqsg/ÁqB˜udcd *x,6d*6m$¨ H, c(%e.0*†,T ã „**5$kcc3
Mu});
ß*
 H%†* ’D“ÕW OF.U”m0- UQﬂIVE @QUATIO$*
(**OpdÆ`Sg]v#adenBe: tËt Byd JicuN3e,
 *#+$boQÒ@medt†20Ö2 ^Êm2p XiÓhur	¢ * all†{iÂhts  Â{eÚned>
$j-ä!2Reπ`3vvi
uthe~ `n` ıs}`,n@eOurf% c.j$ainAzÒ$ˆmrMs,†w)tl$gÚ°'iÙhgud ms`yvic·pyon$
 *5e`e"UzeyD%\ rrrˇdm§)Ùh¢p tkf&~œdlnWaﬁs(„ÎnL	tinnSÄ·p•)mcd-
 ?ä
* Ree@spribıtÎnS gf(ª=%≤cgcgpd4%ust0udaa. DHm£bObm(cnpyriÁhÙ j®t˘cm, dxyq1lyst0JfÖ *"„/Ó,idinNwaÂo% t(c`tkH‹og˝æo`d3#lq	|≈.( Æ SuziqTzm"pp!m.r iœ`‚ih!6[ D#rm +wrtea:oucQ2µ(†`koˆu£cˇ`QRi6mt j'tIb%≠!TË+r i3uZ * o&,sO~ei\kÔFs a~g``Ïe fNtjUAnn(piÍClahm%V on ’he eocı,dntatÈym(c.fØn‡(mvhsz ma`evyIlc
†* ppov{dıe wm¸ÍÄtHd dibTtifuhy|.Ã
 *L ‡*)N%)p8d9†tjg$o„È- oÊ tHÂ0·˝THgP!.nr)ph$"æcmÂu4iBhpmnÙRhbstor^ Õaº(bÌ,us%¨ ro0endoBre / yr $ZoÔ%uu%xzg$da4v©eeÚi∂ef(frgy`4H{w rgpuvD`e3i≤mÎuÙ {pecibh' pziØr ˜|kttÙn(xermÈsskof®Mä *
 †0UXM†3K∆\«Z](I HR_^HDEE G[ EHE!¡OP»LJD$`OLDMRS YÜƒ%«MnTHAQtORS†*A⁄ M!!I D(A^I†j EòpP‘wY O^ei/T^KeL&F RrANTIE[¨4IŒ’FOÓG( BU– WGT£KImhXEL`TFû!àD†I}PiDe0IRVE^TãGS œN
∞) ]MBS…AJ√ŸL\ GH†FhTNIS @bxM2@A“KCEÃRR‡UR@_SE†FE†fACìDSIhM@j E_ nO0ï÷GN]SHALŒ ^HE
†* «OPŸBIgHÌ!.WES Z0CNF]_iBÒToRQ!E'L	SMU NORENY!F“EIT$∏I LIr-C‘X*IL+…dÙNDAd SrAn-Ê+>]M@LBrQ"(OR≤Ck\ET’Mk‘KQ^!DMQáA h]NENQD	O,!bUT0\I@ L	T…M1vœ,!P_[GERUÃKNT /B@SÅPs‘YVMtM	( jdG_kDS`gaUM«_	D DIRSÔ∆ SE,°‘ATF_V¢¿REBI“V; JRÇBV…JDS_ Ié\E2VLXLœZ- X_VM\Mr C@Gƒ(™ *†AndO(alI(YIœORH0G\!
YABiHITY< ”HELE‡iNCO^@Vaaî5†ST2-Fp(M@b!LITA,!Ov T/RT$,)GJ¨UKG
†+ ŒdMIGEVae®o(K‘H«rW…SP)0 RIcIF`MŒ2A^x(«y4oQR!O†DHt ’Gƒ oVpUd)S˘OFT_A“F,$ÖvEN!IB"ADVJsGtùé ®†N ThE‡ŸO◊i¬Õ\…TA´W÷ cïQH E]M
 >5˙ 
5})<hŸqÁvz	;
-BfwatinÓ(§†( 5vef)~%d®9$SL)-ä ÆefÊufp˜
‡l)Êfß?"f}ns4kKn(n+${çj
IZ©twv` Vh)sØpuEum,fObdio~(+ {
M
	/5"wg`tu!cduman¸
	vab %, ="fºtπ˘v+/ prop{4õ Y/8'sÈtio.£('tip6,b/ttg,,'xyÊt&≠#riGXv'\;	*	'+ Sgt$oatiojqYt·Z†oode } $*esgebD{.≥ÂTEcfd)a|/0o*oPt…oVq>Ño¿e°|<h'hidÌß;; ØS·t$Mo%
	~dp8|MbUcpin†98n>mft)ÕÓs.dyta+thgN |t"'dD2Pih·d#; ™Ø0,dfau\| (avwcd9ol	

	i!)RAujqqV+X	dleˆnÂc|˜:5Av$*el )t2Ìp`);#eÏn{l/Û!+ª0)á [·vip¢ [hg-#		ter sr-tper †d.dfngcts.j2eatdˇJÀtpmråel).CÛS {oaq2vŒ/˜z'xit‰dbá}m≥ /=$¡r!ht‰ VvUtyga	Hf1r"se"∞3+l(za`$Aœo4Ì5`v-rpoc1¨3)h?!#hciWpt'b∞`'gIlÙhß
	Iˆar†disvaFcgd< *e)RecTion0?(&v≈R6mclÜ) 8g≤·ppev,Äd-njV:) ; 7jq–iqr>`ÈT4hhâ;*
}'¨lOd'(π= bc®nwß+1trapqEV,ksS,6ev, +9 o, afu»
IK?+†.h}`uiÔ*
È~≈r ]niÌ!di.n$)z}˚
		aoiIqÙ(mm_ÚecM&=2}/Fe"<Æ§GsHg7  daÎ"aÓCÁ : 5;Ã
I	
/.!AtÌ}·T$/…gxepqe@.I˙·ma|a CÍemd|)o*&+duÚa0in,%onpTÎ/ns.e`˜iÓk, g‘Nct+.n%) {
Kiaf®eÁde(=}‡&xhde©µal,ja§a(?${>hL`ee7çôdŒ}rfÈctssÂpˆkÚa(e|`xsop{,3$$/ÌFVUg4‚*rE}n`eWsappe~®m|	;#Øb RÂv`e27
		Åifh/Æc!Øl‚ack)$D.'a,}b`aCØcptly)E €2]M1‚pevÕ`nt'-$^/$a|lbegk/ä(		%l.lÂ}uÂqg8(/G
i	¸);*â
õ}!;-{;*
}≠¨jQu#R˘!:ÆÄ»ftna…}fia%01behg)wmem($k	J&>ev&f‚Tsl‚vpÊcE‡π Œunceon/) {
	*tetqCl(vËi`.qume(bulct#onh)pkÜ

	+Ø Nreq|d¢e`gmßbtJåtas"ed(= ,(thyŸ)$ po˚$-(Y'u´skt+Ln'd'tktµ,'dœ÷tom2)«Âmß<&ªeo`–g];	/≠ Ret nptin~s
Àves:}e`a 9!$¨gffm3Twwe}Y%te-º,%Ínm{uIÌnÛ&}/de »| ÉEbfdgts);§-/Wu4umte	YvAr ‰iÚeVTiÆ.0m$o.oqlo7*lmred„kn†L|"&50#)'n/(D%dalˆ$ı)r'ctio˛M	I6Û{ t`3Ùdfcw=‡CÆ}pd(~nÛ.dÈÛtajkd \=°2!9"//PeVuw|µaÁms4ang%
	v!x4im‡qÄ=1o.cXwiMoÛ/uym'c¶p| 7: /'hD}f`ulº$£ R~(0†oE€â	31˙)c`eg† =¶j.‰Ò2`pHon∞dt 2÷t⁄!/ü`Du`qmt spA}f$1dr ÚyuŒkÂ-	iÁ"!(vxIw\jI$Â/™dmwth-Ote() psnp˜*p}Sh 'mpaSi1'!:
~o!Aznjd tguÚjiËg0Ût√a‡i$t} 0r{fent clearpYpe‡gÔd PME#Ëssuds(IE!KA	 ›	Øª$f*ust9ô%/ef&Â:Psx˚·Ue0enæ´pr[d[)$cl´WËÌÜ<)'$+/‡W!`@ # Ûlow-ä	§ÕubdtbpS,crb¸eWraPver(EE)? +. W3ea`Â ÷bitTeX
8(4ab Reg0=† LÌÛktiM = 'uPf$|<)lËpucDa/N ==dßd={jy<? ßvmp' : Gmcfr#;è
	4qt0’ou`ln§=( bmÚectigû =<Ä' ' |\*direcT)In º? %lef7, §'Pos# *0/~ewß;M)à>Is DiÛtaf/e†Ä&wxti/hgqs‘E^cd hº (SDn•-w %tovw¿?°elVoıtuÚH$aGË|({{ARca*®Ùzue}Î(O 30: %l.o5tE“{ktt({masgin:DV5d})  3;)m` ®mDÂ =- 'szo&) $l.Osbh'gÙ!ci1£=(p	(#aS,Úaf,(eOdioÓ 5 '¯os' ¿%dIs>a^c%0z$dÔstancu(!/o [hyFÙç(ô	ag$ mo$- == ?iKls'	 Ïysdat{g`9 `ksıancm"/¢(pi-5{ ™(2!;<		(g0Mgde`)< fËih'Y time==;
à /Ø MnHm1ta		-g (moFg =< ßs(os.) { ?≠ W`ow Bo5ncq⁄	Miear(anhfataèf = ˚opaC)Ùyz20y> â	a~ymat)Ô.re$M Ω (mOTÈoÓ 9]#&1Os•)? '/=7•:d7-=ß! + dGsÙpnce/
		QemfA/`i Ùe)aoiatiin,"{˘e·l ) 0<#ÁØpuyO˛ˆ.easÎng	é	dhst"^bw"º di≥Tan{e!n0vM 		dieE;/#;Ç	}s
Ifˇ˚`9vIf,i`} ∞(È 40uioeS3()´´="{`/Ø BOenaÌs*K	vaq `i-aTmonq$= {=-@™iop|ooo:»Ω†y};
	-	BnÈmAuIÔf1⁄rpf] 5†(l?TiÔ~19< 'ro2g ? 'M=&! !+=/-4ª8¨iwtajce3O)cliwiT)od2b2ejX®d(mÔ4hMn‡--∏#xKs'+øt#Ô=C,: --?') /;d)stpÍqe{		)ed.a~imadA®cÓimadXg.1. sqeıd#/$2,†o.gp4ion◊.mqg˘ow	<iŒimapd(9ÍA-Cvin h 3dÂ‰d†/(< oÆoxÙimnsea')~f);		dysgiŒc· =$(Ìote / 'ËIde''` dhÛtq~bE8
"2 8 d)Sd„nÂg8/"0˚
=;â
yÊ *mOpe&ı$'hkde«)!K$,/0LaRtBkıÓ„e.)feS$enImptiÔÓ$=0{k`u#iÙq$ ¯;!â	e|)mAtion[“ev≈ Ω (I_Tm˝f =: 7`/s'†= G-ua(∫,&;='	0 ´&darÙeocl≠		q .Aoimst!animAˆhGo,sptgd /!2¨(o Gb¥hÓnb.eqCIng, f5nstynn()j›à!	elûHYle(i; /n.HhDa
)II	¥.afeGqlw.rt3{o2o)eol rrÎp3)`$gfneWP{cÌÕve_wApp%R8el·;`Ø_(BÁ2tor·*E		id(o,caldP`c´•*Ø™oIllbib)'qppÏi®4(i3¨0qroEo%v‰p);†/(Cqllbkck
Y	};?*	y %l!e"kMYwrRTA.QMa`)nj! $ {{!AÓjLavØoor`>1y|ä		m.CM·t´/|1[rio_ =$(mdi.J†5=(%h3·= &-=£®> g+<')`+ Ã){daÓ#gªI)inieae)m¨3[se&›(=  ûØ$ilg =Ω`Ápofaø /.5' 6'Ω=&(0; distncd:å)mÌ.aÓ9?!4a(Alima4jWÓQ-8wd`Md0o 2-h≠.[–d)ojsÆdAsi_$8.ÂnmmmrI(en1M@6iO|"	"s4edd3, Æ MØl@tYoNÛ&gk˜mnÁ,(Êvnc4io˛(){	i$gfÊEeps/eqtÔPe eX( t‚ops!+°&uf&acts,`Âmnv`Wb!tpdr(E();∞#/ –es6oCm		ØF(j#A(lpack  /gaÏ|baa(&apPyhuhisba≤M˜_u|hq°k"'"Cq|ö#asj
 âH})9
I};Iel-sueue* d97, F5ncTœ}j,%{ e¸&dEqumuq(+≥ }):"	âul*lUqueu@()/-*Hm9;.
}+
|)HhQ}eb˘9;m
MJVqOce)ØÏja-Äu|‚eda+ef )2ˇ=§>effmk5Ú.c4kr - vw&`lGÌho),kF
ä	rÂdern`thiSoau%}Â(`ungtio.(-`˙
		/ CˆÂada Emueg~v-	âfab u|°]0  dmw)(!prpc†="G#rosk4ioN,#v}@',áfg0uo-'$ßÏ)np,£zmGle'.&he`gËve(gsatTH&}3Õ
KØ/ [Eb@oPlnÓnÛYvaÚ modeì (n%f¬tÉd#lwe~M/$ije‰<0{"/–tio¸s.m/dA`l|®'jad%á8(7/!Cdp Eote,	ë~eÚ@digdhf¸ - oKPpy_.S6dirgk|hof†x!.6arthCbl'†// D%.Mu,l0dip&gv)jn
		+'†ADjuwt
	â$oefbAcÙs,scG`h%lÏpprm‡Siª g,-QlÌw∏)+®7§Sawa &0Shos	
	var w≤%urerÄ= $tmffa#rw<crug`mW˙°per(el)Í·q[(^/WGrflÔs
?)MddAl%ˆ)π / √Weat' W2app
´v·2 AnIÌede ?æemS0]Fpa'Namu∏ª¨!MM[' ùj7Úester!∫!5&9
v·f zdd ≠†-		sj{·:†(dqqectiln†=0'~gvti{aÏ&+ ?`ÂËwlÙ$:"'7©lD(%,	 	)rnretkgn20,$ÈrectMO. =≥ve2UhÊaJ?)l+d-6oWß§: |efd/}´ä	vaz Fusta*‚A"=08f)sew|imo®=< %ˆeÚ=}kaÏ%- ø(·éi|·dg.(iiwÏp6K

 #kh-atu(idth !ª
if(lodÌa}=!&vhKvg) k ÂnyÌ%tu/cw”*ref.sajm<18)¢1nimtÂ
ams)vn?qo2itmoo,0d)Û<aœCu!+¢2	+ _∞=$[zind

I{k®|akitaon	pa≥%adkmat,{~ =(^y2
	 aN(-Ûvi˛[r4d?s·rd] ?*moFU!<9('shog'`?0$ÈswA~sE : 4;
	â*nyia‰ooNJÚÂfØtoIt+gnﬂ0!dmDe == ÁAhooß ø 4A: ‰istafau`c ≤:
m/'`DnoÌu|e	*evi-btg"a.qm`ye)yÆil!tio~, ˇ ]5e-%:4fÈlÛe< bypaconz®o.h5sa$qgh,$macÈN/: 6>gÒtionzÎgÒ˜ing, ckaplUwÁ; fenct!kN()"˙	adËaoLddΩ=`'oI¨u')%e,njudo®©;®/' HMdeâ
4nm$fa#T{"rL≤Ùo“(eh8 trÔ0sË; %.ÂvfeS`sÆpemkvdyav‡MZie+1 *'!Ves}}R-
	Ii‡*o.s)lmbaak)!igQm|c`„{&`p`.k(e\S M,$arØume*0≥ +/!Éal|jickJ	mt
dÒqeAge(]x]jâ	ˇ˝)3äMä	]);ã
}:Ç+!jQuÂr…);©


Üuni4iÓ1 , wnt'fknid )${ A
$æef‰!ct3>Drkp`u!junCuÌgf∏g)∏kç
+;pe‘V`n |hhw,quEee(nwÌa‹ij**=({J-(//BKreade4=∏emaÍT≠ª	veÚ`el ª 0
$ii2-,¢8dg 4,<'jÔsiÙYo~ß."ıkp'Sjttog,$lgfVß,'zIgKd'$g1ucjj8ß]cù
-N!â%/ SUÙ Op6mon3
ÅvaÚ]od$ = §.eOG%c‹knsFrLoqE8e|<$o.ÔPtIons.hole || /hAee7ik"// Qet 	o‰c-v·x0$irek|ioM < o./pÙÈoNÛ>di~g`tjg{|| ßlaft'98oØDenaıd> DÈpAcsmmNçJ		/' AdJu±u-
		$.Âbge„dÛ®1cva#}¸<!P“/ÙA);`ilnsxØd)(<'/ SavÂ  [hmu
	,/efne„t3&CrÁc|%WriPPsR am);8>?!rutd"Uba pE{ç	âvkz ven4≠(¢eibeÀÙ)ol=- up/‡|= bIbeÎdikj%-=†%d˝vn"e +('to‡' 8 ,Ldftgøç
IvaT"ogti} =  `xroc\ag^$5='µ / ˝^Äeipecvkin†<5 79eft'	/&ots#az '~a≈"âˆus¢disu`ogu†8(Â./PPio&{ÆÏ@cpan'u ~ ®B°f`9=2top'`/ %,.˚}‰Âr¿ehgh‘hkMa`o˘n:tr˝e]) †2$z Em.OuvurWipîÍ(˚eaÚ!kn:sbuemi 7 2©+äM9MÊ ®=od!/= ßÛiÌw+) dx/cww8&npf„ityglÇ!j#ss(sEf,0moplf =?5"@míc¢ Di˚’a.S$  diÛÙ·~R-9;)/ Xhy&v
	(	/´ QÓilqd)Œ}±
	+r¿r a¯iΩ`tiMl 9z{mraki$]* goÊe:Ω?0ß3ËOw'!$0 :`t9Õ*ç`|hledkonK2ag](ç move ml gqhnwß$‡(uothÔ~ n=`&‡s' ?"##='!:ˆ'%%'-†:`8moDmoÓ =<"7tns' ?†g='p2 '+˝/!( + †istaÓcg9M
	o/ Ânim!v%N+lm/dexmivÁ(a~mÔe‰ioj, [ 5eumz f`L#%/†dırqD)N? .`uPe¥qo.-,eyse.G: onop$}of5.°acin&,(¢ompiEg> eud3d˘mn()≤{3)	yg!M?‰†Ω=`5Hi‰U/!dÈh.h-d)9{†/- X#‡e @	â&>qÊfe„~q.re&pmrohel trwpc!ª∞,"fdEstv®ReioveGbq0Rer*wË#7$/Ô!SE3ugr•Nã	hfhfèKqLlÓogj)"c!L|``wo`xpË(dxhs. uπotq`˝dˆ,$o'0b·lt$ac{-Jàâ	•L&durweıE∏)3%
	)|}	˚ç
	m);
˘;äN
u)h*Rue2y);*(Êw.#dIFn*(u,"UNeef-n·N )†kJ
$.Áca√t.wPrloee#= fılÀio®o©4{Ö;	j˝tuqn ÏhÈSŸ}·ue*fyn£Ùyon*â kÖ
J	Var0roub = o,nybHÔfı.qyqK%g . iv¿¶“lw~&(Od˙H>±u≤phO.≠r'moNWlqiecfs=i¶:(◊B6aF†cdddp º ﬂ'kTtion{*VIeCas$6 !x9skuFd,M!v‡.sÈrd(o&kp|qgnw.qyd#Âs)h: ws
äÔ.kttio.S.modu =#o.Ô@bioÔu+odÂ ?=htmgd‰& ?& ,(t`iS©.Iw@':Fisikhe%- 7 /yi‰d; $k1H˘w7´8)}/m{Ùmm.s.Ìod‰-
	var hl‰< $.tjaq)*Ûjo7(9.ÎScàgfash"˘liTy/∞'ÈIddÂ~)9:	7ar mhfsex0= }l.Îrvri4*©ì	/+uAq4ˆaÛt |ae`o!2gmÆs - ˇ/p fÈ~anq thu prÁbh•m†8E0&-âofbqeÙ+ƒph-y(xags/Knth•\/sS(3/`:g(n‘mp&)≠10) || ÷Jkfg˝u|.mmfÒ(? yÚqeÿBtel.#ÇW(2èarÔijHEf|.)∞a39@x| 0;	v!r"e!|dj> Gd+oı4GzWidtts|e-7
÷!f hWMflÙh%("|-out%r DigÏ|,tvEe);I

ÊoÚ 6`r1i80{i5boes˚i+3 x ´%$=
¿ns8v`p(j=0;Í<ge&$23k+/ [ /o†|Lï			mhà		.iˇ2o
-	[.kqpgn4\o"7baDÈ' Ü	)"wbCp('¸fat=/‰hp?')Mäâ	ÆgR{
{-ôposÌtho~ g)bso-7pu§äâ		I96iryjiLa¸y>0/“Å3MblSkãnÂn¥> ,jb®3y|Thjbelds).›
		TÌp;®,y*(hu®ghL/VdWc¨+"…Yâ	y)
I	>xa0en,)…Z	))&qddC|`cs('Wi-dÊfektSØEÿÍÓofe'+Ç		*c{c(;		…)pnbaDoÁn)!#aÛSn|5|d/,
)	…)	rm2Êlo>%/ha††df'i	ô		©	{hlxlz Ûid‰`/ennS¨		âh•iNju" `d)W(‘/2ovs-M
		laFu:0nfjGkt.lÂ$t 0jj(wi`ÒË/cu¸ls' £8àk.fPxignc.lode %('rxo'¢b xj__iwXÆÁlooz,ceË-U-6/)>(uy‰vh/geldc-;!0)<		4`^ efnsSÌ,Ùoq2# ,;%hAichT-biWs))>0(noptkVns,≠mdı‡?! 'sh/7∑	=`(i/JaƒËFmOn2&pfws/2+).i(eiglt/pows :"q	¨+	ÔPA{iT:‡m˛ÔptÌKNq,}Àae`Ω?"'sËOf'<?$0(: ;
+	A}/anih`ve8{
	%I…l@Ft3 ggfÒevnl%fÙ +"k+(¸in`@/ctn‰#y†)%k∂fprIovsN+Neh=}3&3h˜w'07P  :j-Ma’h+vlokiedÓH3Øs))klyidÙ(/cg‰ls9(	Ç)	Ito0∫ b&wut.tnx0+ m* ha©Gx‘'r7s)0+ ,o/pvi_oÚ|em`% == shbw/0?& :2(¬-Laex6flØ_{iÚfvw-j)	"(`eaÁh|Oowzy8,ôâ	)_pI`iÙy2†^NOÚtiOn[kodE =} 7Bhnw'+ ≥ ™20			},¶k-lT≤Âpo~n"}l 50î);
}à(}]ä
/} et$a†ıiÌegu}+!t-¥Òq~methe"cpnlb`Fk†arprÔx. vhÂL46HaAk4JdÚ az)m·0ignQ `°4g‡finirh%dJ=se4Pymgmut(fuÓ#xinn,)23äM*i	o.optxn3.eme!(|50#Spov'†z#e,N˚3s¨; vMÛir˘l!ty:¥'fnbh2teW(y©0
$eh.os3yˆishbm|Ity:$%vmsi≤le |)˙yna,19		âjf(ncI,¸dagÍ	 m.c¡xlja√j.kpplxjgl Y+;†// S@¸Ïb·„{Íadl6diqqgu†();å—I,*'eiv*vh=efnesps©ezhot`%8,Rm…kQl)™;-	x,!o.eeÛC>ioÆ$|l2$009;âç

}â;}:Ö*Uâ8kY5%R`)+
	
TÓ{tib~,† ,eo`GgmNenai{
7$.egGe£Ls.F`DÏ <0Fe~SÙIÓ&,i(${A:dpu"Ê`l©q.1ue}	 ken„ti/n¨!0{j		{a0@g|e- - $§thh3)(
Y9âm/‰! ,p§kdff‰cps.sDpLe`e|u)( o>oppiknp.mda ||l'ËjeÂ&=
		e,e˝.·ni-apg(s"mxisyt˘ msdU1=) [
	ÀÊue’d3 ga¨ae¨Mäãd}qAm©on8doÆfı2!t
kjM
	Yeasmi≈:†o/Oq6+k~s.eap)ÏÁ-
ãg¯-pÏ`§e3 cuŒsdiofh! k
âA	)I.cadlbD'* ¥!oÜciÏ‘ac).apply(pl…{¨ a√guiands()9J)π	Â,m.DequemmhI;
˝%
	Yı!ª
U!3?J}-
*u-hìe=fsi{
çÄ(Vun„dioj*d§¨4≈lleG	~ae$	2{W*$,Qfb«gt{.nol ‰4&5n·i;/ç o( }Wäatur*ÄthIc.q5uıe(‰yz‚tio.m) ⁄]	//!CrE°T5 eÓehµntM
âw·r eH:< >(p
}c	+ roˆ;$=K'oSilπoZ'd%>lp6,jId¥nm'=lep¯&#bIÁlv%]; 	)/0dt`n‡t·o~s
	*ﬁer)-˛me 5 dedfec${¢~m4OgdeÂ<,)o.kt©Íf”.{oue l‹ 'hidÂG);+≠ ”Âq Iof%	tÂv`rxze1=êoÓkQti-ns<˚ije`n\@¢5 -l dme‡uhd0fÔDd"Vmz%		n!r %z):F)zÛr µ0!8#O/O0tXOnS$hÔbÌzArstâ;(// EnSuRe†a!jÔleqk v!l}ÂA	˜Ar(4ujAvËol†\`OFb%beUln.  o.duÁaui?j Í¢0*!$,@Y.s0eets"ﬂfefbuÏv$ "{ç

	, qwnu3p
	M$*Â†‚ec4sÆcatTelD pvnpq-; ‚L&Ûik&(Ú+ ??0S#ve &†Sho5çã	ˆcr$˜b`pes= $=eff≈#ds.cr≈!taUpapeZh!Ï+Nsss*;n6erDlo7:&Ëifden&|); o;0Ówee,g WÚcp`er
		tEr,hJDhnh·tê˝ :}oe Ω$ gwh=w'(a!˝∞<mrKrDizS9;
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

		this._deteR≠)Œab¥uÙo˛TyXa yª
(6h)s`asP}dnÂ(5@1a|Ëiw,B1te'NUÏµmmf|4ettp´ 2Ù	TLd"0)#	◊aSsE.g =$u\…qâ	ktdior x d0…{.ÔppmK.wkè	p^gdhERuDToN4) 0hiS.vyÒe"ø› "·`eciÛn|051¸)is>˜sr’ Z=®¢sqdxn"<I	)joVur"|·rsa1suÎ}cDit-tÓvdr#  < toeghmBwjon(?∞"`ti•{Ati,Òc5kvd"Ä*,"¢)9---‚Ôc}[Cl†sg$9`$ui)wv·T!-&of1˜"∑MI	h' ∏ opV©or.m beL <=y°o4,n() {
MI_0tYovs,m!*e|†5&djËR&j%4tÔÓd
emEbÙ.hÙ{Ã(i:]
	yI
	ÛqËS.ru|todD|eoeNt-,		>Âd$StaÛã*$gqsis,ass%v )			6ed4r(‡˙_¨g"4Ëc`{|~kn"`)H+	ânbindË!bmo|Ûeu/tE2*bU5|ml'.!f}kÙifn()#o
ÅâhF%8 o¯>iølsÆdÈ{wblef )({â			rE8ujo:M@	â!	}	(Y	 ( t)1 %.a|DÀoess* "uÈ-St`pm-hÌ6tr"0(/M
yh	iÊH( thi; Ω==!ÂASqAzive,-·{J), ‰Ÿak@)&a\%CÏ·3( 2}k-st‡Te-acv)v%% (´]
π		}äH	m	-À!.G)ve(&‚ojuW?xearmbuptoŒ","f=lcuiÓN®)!{]J		Å
!Ê(9 o∞lioo{.d9qaBEDb)$z@
à		rmt}rN;≠
	à	u		ü)§
)Ùais ©,sD≠o~cClacp)g‡/°rCjb„s†):M	5(
-lfiÓ$(` `ƒibK.bu|¥/nvj¥f5nStdg® °b›n	(ªçä	I	kg!(4fpt	mnw&%a{ÈF,et! ]ô©	e÷gnp.pr%vmNwDuÊa]È4(99
=â	aq‰n¥´S$n`I‰!AdiauePÚk4„fathdl)8		I=*…	Y}+>ç™YThI„$Âle˝lnt	—).™m|\¨ "fkfuw‚bu|<n.j> n?Óstim~((∞{*Iâ/"l{'o5ep <0c¸tco$$H3gb`e$,$foSus†˛?l5e0b}ìuviegeˆep0!Ó{wqq
IY/#µ,'ÓGÂtonEn˝lend>aDeCl·s2()TgcÒsG@iss,ª*	!	}(´…-kf(%flU{bıTuon¢(benbt≠/^*0[ú			2eÔf.bett_Ól%o5jt.˛l}nzeÀ¨aqs`tœaƒsh`ss`h;lMM|+2_J	∆0($to/Á|eBettof ) ö		0»i˜,eema dÆ¿|nd4@*a`a&k}nb5Ëtˇn*∞bDÆctÈ{<(· 2	)©afh  kÏ©cDr!sg'-$´†“ä			Úu4urn;¢}ä	I1elW<RefVas((+?*	!}9˚ä	)MÃ- aG¢m-5se®mofe# feY{e·o¢inusÂD~wn uCeplous≈up∞Ârk'-†wut(s\hcKra◊Õeb .Ïag{9/IPrÁtedus,iscte w`ez· du|8on${Ùird#Álan'Â{!b]e®kkuc+sovÔBclIo†BiesWed 7t{umç+ª dodc ÈKF aÍ@FÈXNfwj  sd 4iqkeq!+6= I
			¥hi”)jud|onu,ieÁ>vç	I	*bind"mMu)M§m5l/ÛutÓ2l gu>‡gAofx gven4 ´!qMi
	if (&Îptho.Û.`as`¬yeg‡0{
+ 		rm|uB\;N				I}ç
 	âclickD6igßj £4cL{/;F
		àqtyrvXT_S#="qven4>rgeÿl
ô	˜parñ[Pgs$= `vd¶4,xADeH;ÕK	9		≠jn`(83-o_sduPÆb5`toD" `ÊYncvcvn( aVa˙d$	"yJ$Iâ	Èv"x oˇpmos>t)s@bned }çÍ)		 ´rt‹uqb*	
	iâç		=f ©0{Tabv¸PNs !=%beVentn‡A˜eX }l sÙ#vÙqP/s !8= vgnt/p´g%ÿ`â0i)			K!b>mc·ts·fwÂu1°t0!e;¨		÷â})?
		y
	)ad  (t(hS>ty0d t=Ω0"gŒgcki'H"!+&{*ë
dxirlauU|nENmieØ}&bK.f("KhiÁk.Úqtt„k ,"run#TIon®( {*â	Aag  m~ˆKÁ.Rndaw·blEt Ù<!ghi`ÀL≤agued†»$;â	Mrmt}sÓ$oae3e::ââ	yä	K $πtxir ÍvogglwClI!w8`6Òi,1uata-`‚}y~e*0(*é	âqÂl‚+"mpdgnxeieÓ$.attP0@2yriqpjG#pe$*< s%mf~cld-m,ıK:ÿ/k`ebn≈§`))
ài!}(ã]!ÂTs$ AÊ (Dvdcw,type‡=9> "raF1o $i†kä9		r´˚.`q|tglyl}ieot&ba.d©rÏack.bPtn4`vu„dinO( "{-	©if1® o@}iÁ~#.$)#arlft Ê| ÎdI‚kL`cg«df†9!s
				Úuºqrn$oal≤uç
	}	ä	)$0~i¡R"+gaË$sÏ#qR,!w·-Útct%_a-thvec )?5éI		cÂm&.cS–|{ÓllÂ•jtÆ!pıR( *a∫MaÈprÂ9qe|F,a&ppÂe1 	;èi	>aÚ‰piÂan§5!xqdgŒQÕ%ÍG.tô 4 ;…
√		 p`dYgV‚G/0∏ab{n J			Q.fFt?†6uxiÔ)(	Ç à	
ÓmIphr>nßu}on≠ ˚
)â	s4esﬁ4$(#ehh÷#)Nbut|of( wildet"¢´_ 20M;
		})
M	âÆeeovÂGlc2sIi¢ei-rtaTb-·fti˜d"9Ö
	ö	I)(aÙ4R( "#2)aÖpre3sı"b`2daHslb )ö
â});
â˝8mnPe zE		r(yr*bı0Vo
ÂlÂm5"tE»)9*b)ld-$"ÌnXseul˜n^`wqt?Hb,°f%ÓgemjNê!){¬		)f'(1/∞TAolséhjq·b}E‰ i§{ïûA	
¡å2muur.&vahÛ%
	]è}üJCIâ	id"`4`ib&aUhCmaz{(‡2uÈwtaTe-ctova2!)9
Å	ma+PÄsuÈı! -%ÙhaÛ;II	ò(*uuc·mo&F†)/elÂ,#B|k7SÂuê$∏ fu~s4Ì.)1kn
´ô	n¯stAc|a~F = n}lLì)˛©;Ö
)	Ö=+
I	"rÈ7F® #moU£ÂU–>fu4Y~&¨ E%Nwtcon()!^äXKs¶4h4ˇpGioN3.d{s)ble")({ç
ÀI(…!çrdtqbnfqi2A;	(	}-
I9[4™(hIs2!dreiKvC,qszhp*ıi/StÒ]ea{|jVg#8)*VY	})Í	[6	æCi.* Íiu9dfun‚w\fol¢* nufc≈ioFõUrm%v©k	
/	Iif$8f'ptIonÛJ.mÛmbÏld9"ª	Y	I	YrÁlÙrj rydse≥BI	;=	
âI))F 82<tÂmTÆie}#fdm i="¶
Ta.ÎƒyCaa_QiYe z|ÄFVıftÆkeYCkÃd(==1$
Ui.kc9CDe6ŒﬁT—Ba+†yI)Q	I&( ~ii2 (>ahÊA-assJ(.Ua/stcpema%fÌsq"i		*	™	ı	I	}!Bâ	.c-Ôd($"sm9uv.*utu´~",bu.cTmÎn()"*	I-$ *t(iC -.rgokreB¨as{ †tiâstaxe-bcDlvÂ"@i'
)CÌ)ç*M("	id((!|¯I”.bepu}?Ïıel%nd™zs("Â:)$9&{´i	iTx-w&bUt‡g>dEeaftc°YQ@:fed1|q((ÚÂN}+"{H	â)	f((ÄggantÆjdyCn§A!==($&uh&+myGoem.s0Jbaf- {M
k			-	YODO4p„ss0x;oegËdrog!Øai(dwilt!co_rdctdy$´jut$hS!"zd"A≤'ı}E™D Pmecn't0wÁri)l	K	´	$whxw 	.ghiAj(){
H)M}
ˇ-?çâ		}
	ä
	
# ]áO#§Pd,l$ep$ ∂Uydfe¯'Û )·nllkog,rÌi(~h%iqqnÏe- ptx& mJt)	©/?†dnGidãe6)T˙oxo|epu.OetO0‰iÔ.DksË‡l‰$"so )q"W0mkwy`tœ –Ú}˝y8°~d0ban(ô
+ ‚g mvTrR¯`‰tn(bx InA·vit-el10lA.hn#…ÛhiY,_d40t9oN8`"dÈ#abodd&¨!OpıcÔnsEmsı"LEt 	9äâIˆjyr.RaŸmt¬utﬁn°;
â}$=jƒe¸TbomNeDu¥toÓUuPe:0~ı.a‰eKÏ( {
è:…	ÈÓ ¨ tLi{dhÂmÂÓPéasØ#+iHe¢+b/{"	#)˚
	©t*kÛ?d[pd(Ÿ ¢´HEbK`«x"™	âxÄ‡l3u£m *#Òiis.ulfOe„|.qs»">qaah|"i&)§[	vhaw.ty`˜@9 &pa$iN`;ç)+}®·t˘e,d$!4`}u/elel$mw.	s0bImrı$&∏ 9¢{jK©<(qstÒ¯WÄ70Ähohmt";≠˝(elwe zçéI	KTdis.txxe = £jutdonj>
}B-é+)9$8($tYqct9r}(5Ì—!$flË!{b/x¢ ~| Ùl)r&tix} ï5= k±diÊ*"/%˚MJπo/$we†Â/j'v$rÙafR(0`g°Ωjwe:lmeloc˜meÓr$iDE[i”e pl eÏÂm%64
Å		Ø-&i3 daS{kj?e·t%Ê frnL |ha)LﬂLEÅäVmr(!oÔe;Ù.ˆ`<0Vhhb.enmdGnV.ti‚Âl0*).bcl˝uª(j*l`s|"∫™I	l`CelPEldj|ox ?0"NAbel[Ónj&" )"|X*s.mlemUj|o`e$z*hÁ"`i "∑]/:ÅvhM~&bqtd~≈D-ez4†=†!ncusvmr
b).e¯!h·bDl3e‰Mcvwr†*;
¡Y‰ 90!7xir6"uEdènEl%xdNTÆig^g|k)G0{ö		ôeNC%t{r†! qj„%aPGv.Ó%jÁj`~4a~ce{`/thsibiinw(	 :(|hi3ÆyLM-en}.PyvLiog2(m;≠
í		Djy1njuTt/nOl']m~r§=0aj ec%np.˛i-Te|*®ÏcfıLCe|eS4o2 	3			Âf n 3tDi6nbuÙxÔ.gdaaento'ootx )`[*		JnhicNf3duovU∞emeVr =al„o{ı]z/gm{u( l	bem eÃecto*){	 â}^JΩ			dZÎ~.-|&idou.!dmC|‰v3j`"5Ò/xula"o*i del)Is„dÛm`ldb )s
6jar$£hikAa$¢= }h}S.%lmnlnp.È3)`+2ch}kJeÏ" !;â		ÈF`h"aiÂboat §#…
	"		txia/cy4pßˆEÆeÌen¯.a‰}R¨aDc8∞5km>ıaua-·gvUv¡‚ )9		ˇ
	ç	t|i{&z~ºÙncxÑmeÍd* Tvb(, asyi$x~assÁ|*,b√x%6Ced`;-* u†HTsi{
I	\p}0éb]‘tÛjelDment = DiicÆı(UEanv£	
-IY„Hx,ñäëWm 5t>†fu$cpioÓ(i [ä	)z!tMÚj(Ùhmsbwp4OnU-elE.5~*	y	duKÙ{my2 bqng‡uLf(ã∫k 	Rhiq$emgLeÓq#
I	-QMm„vÂCleSS)†ei¨`o|peR)hidtdD-ACeÌrw}(TE&8)jù	th}˚,n-ttonf.eÔeJt<
}		Æ~ÂmOv@C(sy≤faaDct`Cs•Y+ "`! )Z¥!TACh`{ÛEYt#"" "†# 418e«,cggÁ )	@Æs•DmFeEutb#¢¢o‰`  
	,ze,m~}AtUÊ `"aqyempcgÛsed"†+ä)I<Hp}mË∞tjis*@ı|$gN≈|-mg~t.ni>t *nu)ubWptn=`yt&)ßxdÅË+a)(	)ib$- !‰JÈÛ,\aqPmtle<)†{Z	âthÂC,B}tdoøEl·(oN4.ÚiGovMQ|‰P) !\ivle"®(9M*·y


π.TÈdg5π.®8ltop9c$drvr/yn˚ehh,"xlAC ´+	Ù<
Uâ€cu}O˙hH%Ó( ¶uc#4rwn8)kgp®c|#^uE`h ;TZ		/lwid'%T¶pvot~d˘2ı_sdvor<ikÓ™aÚxl˝
 t|„u4(k3dqment3 99çB		jf`,!Àd) 5ˇ= *my3aBjÂbP ) cmKÅ-i^ +(v©nu°0) kœy		ât*Èx.ÂmBmmbÙ-˘R}pP^t5— DesÈcÏ‰d&, t2dsIΩ…	˝ eæsE ~
		4his.GDeGcnt(cr/s[dt¬@ ',ca˙\et l,&E|qO†)´*m	}
	QF≈4rn;≈
	måBÿHhkﬂrMse¸@stdoj*!ªã?äH	aÒd„e9l: runÁxyOn*) kM…~ar"Ès∆H7`Ïud ?"vhl‚/dleltndhy≥∏$r:diÎeijeƒ" ){)AÈÁ ∞ iCDπ-aclCqP!=9†thms.'@vÎMns&Uôtahng$ )@3	LphIw~ﬂsq`Opt+oo(.&vic‚Lg‚". iSdkÛab,m$p·b	â{o…Èn 2TJywÆPip·ôo="Bzad`O*π	 ˙	ä©	4AlieGr/u@(†wj°.ddaO„ntz0$)>Ì'h fuZcti~)i&˚+	of ™ , thÎc%!.hs( *r„Hag!el/ 9 °F{-
	â58 P(ys,).jeÂ<kn( 0w·Dpu–"0!
	Yâ	&)edBL`É±9`*uÎ-ctxZeÌ˚c¸ij% )(
©√O*at|ph "!zia+0vÂbwd"‰2$5buU$Y?V
ô	©aul≥≈$
		â	  piislh.‚ut(2"V9dgeÏ20(*â	K	)I/r}Âtve«das# ¢"›)ÒTe}eoiÛdi~s! )ÉlI	âk	/-bÙr) *:ca	0reaUgd¢L *diÏsÂ" );Ö
≥o			E);NH=lglsE$IF"p ‰`iÛ+ay4gÄû=?>(ÁWibf8*`0b(	{‰ (! ibs&dlduenVÆÎS©¿#:shm„jÒl  ° ! Û			Ùjis,rqudoDE|eÂeÆ˛å	I	à!fWÏAqÛH Åui)st‡Te%4#rife  )?	)%‰tR(,*IsiA)rs;}¨"& 2t"sn!))
	Ià}Çud{Â!:çIâ	âwpiC$&È0tgK|mau~Dâ		,:emmTFCL·s3(l¶~i-sP!ˆu-·cDivT, )ç	AâÅ.CÚtr! 7Av⁄g-prdrqGl"-p.Tqjgq );	ˇÈçâ›NO)-
GPfcEdCwtxÔ~ÈafuNgtIeÌ»!†{-"	)ir±(pth!qd}4•=-u©"yf0u˝)1)(Ò© ©	!q,Åx tIs&|6hoN{.lHbel)d{<t‡kW.≈xeenî.Vu,, t )”(oP|Ìojs>m1belP("*'}
	ruvuff;M*	Ì)
)	maÛ`"dP4o&dldoeÓd &dPkqÊaudgzEhımlût.bemfeCLaQc(1w[04«l s>E,9.I+)b˜u|KFòEx}$= 0,Mshan?4)sPan
"t`i3.e|eMÂz<æ0Q>nWnezƒn„GmEn<()JI!OaL`j·˚3 
jqi)‡Ùtton)@dz∞\))I.(tÈm: ThYsØ?`Pien7.¨‚Ìh2(		K1Nap‚mnBdI(§Rqt4_nE‡eo≈n<,amtpy(… )
	
â.dd8Â )å
		…#ooˆ$µ!¸d~cn~qıkonq.I¢obwÃÀ
+9lu|TjpÏaIc
fS%5"ic-js.prxlapY(:&†json{ÄV≈≥mnd!`{l*çftTÓj|%sqak Ì^’; ≤K(		.¶ 8†+Cnnc.‰2om`RP |ƒ"ac/mC.qasŒf@esˇ`+(Ì
	(âi2 ((th]s./0ticŒs–`xx0$"{ß	juxOn√l·cCi>`ms(h4 5iÓuıVon-by<-LcoJ&†+Ä)p-Ulu+zn$·Ólc 7 §s& (Ç(†i`ojq(rSleery"?†2<in¡r9* ≤ "%qekknDAsyb0)$†	;ça©I-
;)ôf 8¢ycoJC¨PjkiaÚÈ !c{çX	„q‰tq~,%keÓ4,pzl|ÁÔgh("Ωs alrq$A1zúFw);c=ÙÙo.-}bonq:ymÂ7{0ui%¡{oÆ`*!k0iÔhs.0zmN·”i +*ÇßÆ|?sp L>‚`#{
	(d-Ó)	Yh> )EicÔn-w5£^d·{†) {M	"uƒt/UhMeeN0.A`%Ód(%¢6spaf blaSs='ui-b?tpgn$ick.å”Ebold!Ûu∞uHmiAn$j!+$[ckÓz.swÂ~dar} 1 b%.∏Ø◊h`n>"$	+J	Iq*
			yF  †±vlis~o34˘Œ◊.tehx†	 -9`q\<onEmqQse{.TÁyÍ) o}|thPFeIcons8∑#"}m=¢}Ttfl-i˚onSgNŒy" :  ui-¬ıxd+~,ÈgONEonll@†);= ç
\)Y	iv4(`'Úhis&(q{title /${F)Abqf|o~ElıMu.¸.ap˛z® "dÈtO%"¨° u4tÔoghv ):*	8m		yä el{§x(+)`µdvon[ÏQs#ec.pÂrX($"ui<bufdo$-6d{t-nÓ~9" I;M
ç}	ZIfut¢'n≈lgm&FTæ·`dOL„”((B} toÔBd Rsa+>jØi~™ ""bg©1+ªEyÅy{M	j•>vit'·t( 
ı).bttt+n;Â4 , s-	}x¥ions:!{M	?tems>à":b|hul. ∫qu‚jif<§>BÁce‰/"¸Gb´koxp(redaÔ- a- *data(bu&on-"
	˝$

crE¡te%FÙ‚tqoh(	 {/

tËisÆEnE‡ecvna®dClc<˙(!ıi<zutÙgj3e= ()
I}.M	hnIt:fq-ÛvmOl:!-
-daÈr>nmf3Ùwlh)S}LIﬂse|Mstinf:ag’nkv|mÔ( ˚ei, v)ƒue! `;])	Id†"ke· == &q=SablgD&†)!s	
	t{is&cwvp/NS.b}ttofH #o0v)m.2-"km∏¨`wal}m );â	yç
		$6Wi}geÙ*˙Rktmt}pÂ.RsdtNh˛ion/i`ql|`∞p`i{,!q0nuoeÊdS {=¢Å},

	refze‡h* f5n„ticl(I yçä	ver"Rtl$= |()s.ÁÏdÔ`jÙ:g[>)#™,yrMcpIgÓ£@)¥(=Œ rPtf';M	)âtxiÛ**utf/Lz$(˛jYÛ.gÏtmo,t.b$jd®`tË)s:optanÛ9tmnsh-BI.gin|dr( #xuMf5dto~¢ 9	
à	.{t~<oJ($z$f“Ô{)"#©C	 .tnv()=
Å		=not8x™:ui=b=,to^™")
			I:bg|p?Ó(≠Ö		.∑ndh,<
	.MAx(ttnsˆk/Œ9 {ä			rewQsn$$  phis ).rut4Óh "idFÂp*`,[ 2§_#õI	M|;+		≤e-ﬂVÁ€m·7s$ &wO,gnSf`z-adL |i-bIvfg`-|evu&5icoÚjer%sig)v"b©I
		.Fkl|Eq( "
nehstb!)
À	i>!p$AliSs-®ˆpd§>†"Â]ØoMletLreght" :d&|9-corgeÚ-lEVDb#)			â	.e.d,©çKI.f(mt% 2*laS4"!à			),aldäÓcgsx$Rt$ +j√eKÌcor˙ap%t·vt"(: #uamsnuFe∞-≥mkht# -
)Ä	.mj‰M	)â*e~d((;	˘,ä	Dest0/y:(Ê5r„tÈen89 s
Y	8hic<AÓfu-~u,rDlkf•lsc( *ıkmBCutm.agt&eÈ;)tjI˙&bU|/ˇy
		I&I`Û vy‰cÙynŒHi {		H4aÙ}{. §-0ÙHhc -(Bttloo( 3wmVc%t" 9[03$}Ò
â	ây)
	nBd}oteCÍi`sx( ry-bk2er/|eF| uylcornlÍ-voeht≤ /*	dFp,/
	i/By‰vÍa- (buwFrmy"+9ç
	e*◊idÁdt.p2m0otypddd{µry/cqnx((p(ap)-+Mä	{*|i?
ç
-< jQdM2Û$" !m
M	(nu>Kvi.(  d tÏ%mf[nE$ ˝!{
$oƒxtu^‰.sÈ,!Î ·aQtia+ep( {!v'R6gÓÕ:hrp¨~22" w0~y9
â
0arvRONAME? d'pedz`kÂc&;dip(ÏtGKe )neW!Dau≈(-,eavrIMe();6av anstActÈve{ß
/" DaVa¢pYbcep/aNdger,
0@†Wqm0t(%@#a*ceuÌnÓ yÓs4P~a of!d xs claks( .ˆitepgE{ur<to ÈltUz@·t@˜it  txe∞vat`ycn`s:ç:  (Rgttk~g3 f^p!(wBoup&gf)`6·4Upic+fvr%·∞e"≠!-nµapn•eayN"eokÓkpInÊEn˜j≠cT(
‡  qliw;ik_`muŒtYplÂ$d…~fE≤mÓÙ [mfpHog{‡ofh4A!{aÌE tg£} ;/

vundthnh(Nad= -k[e™-j	
	p
	3.dE‚tM`="ba,·E;†o!Ahb}cd 6(is0v. trwA.to v|rt`tybuggI/c*Ithis.]bw2Inrth tÙdº;5/.bhÂbÛurÚe,Ù /nqda~c˜3iÓ UÛEO*…v`kc®]+aiweot =°fa,qe;¢o!Iv†phÁ`nb≤<∞eve d*`r$a kÒ DvaJuè	4‡iÚldoabmUdI.pUd—!)0[]ü/.Ast of ƒqpA ickwqb…Lp5tc†pjaU$(qvc(beDf`iiqÏet`pic*_dCDupÈ√eb{Ë/eyna7pfilÒeÉ /+)UvuD$-j 4(e toRuqakez is§qi˜WÈfk <†Vamqe kg Fo>å
	ız[s__yjƒyp,Ôe`;!Fâ|ed:h/Ê2TreE†i.![hÎÊ}nvawithin!b¥§$©qloG0,`f@ÏSgbib Ì|*	t@iÛ.WE`h.ivId =‡.ua/dqÓOpÈaIer/d{˜%3$/-£Îe,HT¢u4w($ m·ij&cdt∞icK%r0<kr·sK#Ó
	<hIÚ*=kn]iJaC¸ar(= ßP#=D√t+`-ajq3 kj|an•') '- R`-$n`-•(M‚0|Ë}"i.Mh‚ ]qrker c‰cˇM

tlÈs
ap`'gdClHsÛ ? uÈ-‰aˆEpkFker-!pp!nd#j // hg¨nÂ}E$'Ê th%(iyyelg!$a2fe2`„ÏqSWKI4`ms._|Ú(kgeg√ `bw ="'um-d-umziskezMs`a5Áe˚';@/Ø`phd%nc·ÁdofdUictr˘dwez iar„er4 n‡sfÖ
tÏis._dLa,OgAl!s[ =™GuimlEtÂp*akÌr)fmid˝p'9 ?' T(e n„od(nb!t e"dymlÔ≠0M+vh‰Ú cjqÛcç	l9Q,_bIa!ÍTÂÕoQcc ? '}I%d!Âpi˜kev•dy[`B~b6/ø ?/"÷imÙoaeuh#Ü dj%"taS`cteF@cÓˆÂUiÆ`m1rgÂ2Ä;lc{sAΩ8h[6_Ân˚ulicTA„mdCluws  øeHmfG65pikkc3-uN[}ieb$ablmµ /?hUÈe <aMe!g&1pËe enpmm%stmb†%!*all†mA“)e2†glass
	tki[,]·u0peOtSfi˚q }2ßui-Dutßpi„I$rc}¥b`<u-hp]ß; /'Thd™nc}µ of¢tha ctrsam4hD)X obrZeR"claÛr	
\~Ì'.WpaÎOfhcCmps°<d&q	d#T5Ú{c[ar≠lßyse#emnmO6e"ß;'-∞Ti1 ~am% /~π4je*Ïcy$.gv‰6‡iasJÂ22clavc
T(IJ.rmfioNcl0} S\1Ä/ “w!Iia‚l˝!reokgÍensw4ÙI&gb$!iodd~dd)Cx nenı1(fe(comeä|la#&rEwÈolal/#€ /!j+?$@efÈÒlt0pagoonaÊ0;Ìtclos	glÔfeVg^Tz&&Tobı'$2wß&D)3ph`y8muxv™fÌz%cl/s lm~ÎM		8w‰c‹g|t:0w8bewv,`//`FmqtlaY(pey<©fkr(pru6iMeg%mNj>L†,m~k
	)>ex˜Tgp4:'Neyv0© Øcdasqlq{8Ù-˘t"f/z(nez`∂mOf$  ‹˘n+/
…	·5vbeeTa|rj '–+ÊayÁ. '#0DiËrl)](|%`t Êkr ss‡REnv0Ìjn|l$*mpK
{cs∂xnileC∫ }gHanyaQx'(GD4g2=qrπ'-L¡2kËg$'
pìil'$&Ai'ZynE7, L+âBJul|?ausurqwº£Ev-}e6ßlJ[<MbE–7(gvOvumjuj,.7%KÁM„aqØQ,£/= F`]eÛ†}F@mÓ~‰`=Ä~o≤0lroQ≠$oím^‡!boÚma4tin;	-{N∂jJcmecqOrt s'c~7"'Veb'Ep7O!v£->#It‡ß, ']·|?X cJQl'( 'Juh!ßUe˜6 ‡'Sey/( &_CtáOo^•,('\e3%›, ≤(∆* noP-avti.g.Î±‡ayN)Õi„: €4SUŒfay. ÔmNfE∞x&†'TuetayÁ, 'WggfE{e!{5>°/THexsd·π'/Fple·π',`7_q‰uFde]']*-/ ¶e‚"fkrmcuziÏg
FpyŒfmet√hoˆ4∫ kWUvo,$%MnfÉ$ +}e≠Wmd', 'T»u( 7FrÈÊ,0
S`tØ(†/&GgÚ!f're`‘v]fNb®	dqy?mÌïwLmn)o WßmÕo&./u#,5W‰gTh'≠%Fe/'Sac]$ k CDluo_ hma‰yÊgs0fos%`9Xu!sta0pajO at Sqolaiç
I©uokHtal`*(7_iß4 %'°CkdUmn dgader nwr weAz`ˇf(4Èe yÂ!r
ô	dad‰Fofm9t:(ß˝m-M,/9y',°/!wee go‡lap opIokˇ mb Ê`rseDate]ö	IBiqptD„y: 4."oo ‘h\8d8zÍu lAy œr(thd w·Ák.oNd- ∞¶M-Í= 52=
A	msv‘D:0&A}Sd=†/? DuA1xf pÈgx4=emlfgf la*"uam$ OanÛ'©N	la‚t-|k/picxt
	 {(OoI/l‘ifuar[iQ≤.dbilrul./ Tvu} ie t%0YÂb cl)ct qtpcehmr$um,t ,2fenpgdos /;npË uhen ŸeaÚM»Y%!:S}vgoxr$'',OO Al|©tÈOb`m tE0Ú0t' ©xpÁND@pÔdhÁpS•ar0in¿VkDd{/jvL!i}qpAzÛ	];äç¥hyw?_‡Efa#ltÛ ΩÑ€(_?!CÏf"a,†ddnhm|tc®dob lh†phi8ıu%©pycjerdÈoGTuN#qsç
siovOj*('f+bus/(0Æ?7fOc5s/ div2ktı4&/pÁKsKs.äIâI//j•G=tto/3#fkG"R0In`uÚ "5tÿ{o:êob,'boT®ß`Êov(dâq`gr-éqhowAoy}zF teLj6. o>0HAda0go∞Í]wer{ qÓÂmaÒi9j nwr jkhup-àu(mwOppkÓhr:4;(-(OÚ5iooc``kv%Unhcjcee8aNÈË`tâolQ…
;	$lfa5mtaq!:ênuli( //$Uq & sIuWgn&h2`s$oaÓ; acTwAd0`„8m,ù
		.n +/Ó’mfer®"o≤ gFB{ed%Áro•!Ùod·m`/umd v?>†tß`·I
	¡itrdbÏe¯x: ßm /O$Fay lio ue8u &olmÁeynC`lme`hn|wt k|}"eÆe&Cslcnjc ¸,•)ghx'curytoæte¯v~°&.l.'| 0‹ex~ vov‡trYgfÑ2‡gtpDoj] bıTtklM=kGe:`g#,!//`›SL%'kv Úc)cfev beu4on i¡aom
b}¥uoˆYm‡feG>$y2Dfah≥m- Øk#tqÌgIc)|8e"ÈÌ|ge cqpe„b3@mxoÓ%! g·lrh``f !4`ÂpaÂa`7 Oofa!‚5t~o{	letuI^CkPÚevNmXt:$Ôc|kt, o'-Psve"Rk§xÌ$e$-Xpmpzuiktcmo™4h l,ko{
b+*+8IÍ(o-u†A0rJk#i"~%) wclwa }N`,˜It"deacbÆe th%A	¨N!·iG!5imosDaTaVOrn±Ùz°fd`3el".%0U2ee!kf ‘1ce0v#zLatTing ap–n)eÏ |opBßˆØto`qÈ.~aXdlh.ÎRÁÓtoctvqDnz:	fulÛe, o.$UbıÕ‡yÊ t#di9°lil*%''ms cify tÔcıpzdnt slhek¥ioN®igspeAdãÅ"ËaNfmojth8$Dq,Se- /Ø qw±!Ì&mÔlvË`san „%Ä1ale/qed@d„res,l˘.(f`ÌÚu@in0Ôl9 2uf.n`xÙ	9„©Ó'UI{‚B∫†.a|se.0„/ ˆPe hF ˙ecp!„`l !daÒd47#tÁ‰ fkzec4Ls"f§cÂ!}n n,lw prg~-.uxp9
	πÂaíR!~g8§c-10?c	127l /øbRa.ge of†yaaBr tÆ!‰i5|1˘``˛`fRorm$ovG(	
¡	# eit(¡~2rLatIˆE†to®TGT·{Øs!yeqr(ΩnË:;nf)¨s3lkuyNE u!–bpe.tdy†dkspba∏Ì$ë{mbjJ!
	//!*c-nn:"k~.)àav√ml˝tm(˚o~~:lnn|) kr0a2sn-Í)fq|Xo$ oÚ`1h$Cvmve((+.,Ê('./.		zho˜WÙhdveo^ths˘ gcl3u.+"Tsid t~!3(mw(Ëa\gq iÏ o<haq mMÔ¥hs, ·Åmwe poÏeqˆm¶blHjo
9	vU~ÌatMrjeuOjtks~bb)cEÃ"'/`Vftı$tkàull-ÒÄ7ÂlectIjîod daTe‚ Oo!n<h•r ma~tDc"hfetSÂ`¶o3 ~nSe|ektqdÌiç*	s`owWeÂk∫3fcm;Â-?/ P‰e5$d_ y(Kw0sgEo(f1txe ]Âir<(baLqn tN!Ókl™vxow$h4-
 EslAu$!tdWÂEn:$tËqÜiSk8µ03Teek	k/)H/q dG C)ohql9t¨txe ˆeÂk6gÁ The"yeer,	
	1)∑o$4`Ôva0q`D!˝a al‡ 2ÌttRn30uiı nULrïr m&&4e eÎ fks Î|⁄	/S)Èr~QsarCwtk&fp $+g .'4bOpÂ ke!r†wqÏ|Ms<†u8˘3)kre Èj†fZm g˝6re^x(!A.DwÚ{<à)	ˇ-0˛!P#m(qÛ(oo&‰ae \vavËnuÛ(cenUwy 		// suVIlW >aL˝e s|ArtØjo†w)r	 …' For „urR+ÓD2¯ei2†- >qÈue
@linÑauu&joe¨Ï,(+. ThÂ(gcrÓ)eÀD(sgjmbÙable  !xe<(Ôb Oq\m0&op Ki ¸mitä…-az avaz"NULL -o!4(Ã mCdeD#sEÏiEtajne∞eata4nr .1ML$fmb!no$¨®}cp)%puJ‚t-«O˚(Ofaqv'- o-!EÂzA¸hOJ }f liÛdnCY„dkcUqE
OIbÂ{ruYÏo}DaiÍ nWl,,A/+ ∆qnstm. shAu$tBkks a da|u0aOfruuernÛ!AÍ8„pJcamw)uJ¡â)	/, K‡‹(=†p`t- ab8c·m'{t·@¸e,(uÂ.sc mj"jo0§ R%T`<$oustÔœ¢KQR´}Y{3$Laie;c©8/3(G!,Yå//$[M(Ω cmL.†titöe`¨op$m~[,=8 a,Á<2 .D@URi„kırnNN_aeoe~er)	bufÔ"%Chkw8 nwMl,!%/8FtÆkVk/n0vj°d#tCoE;"¡n ©n0ep!B+m\teMe,		¨/0petıvxs8a#wed$o`ÑcEsdÔ= bmdt9h„c0for$tHÑ detu§piQc{r
~oQuÃa#t~ ntÓ\. )/0arinE§q bellÍ˘1k@&UNs‰A-jDh·n a eÒdU!Ès áemÂ{t'|âinS`a~oY+n~hY$cr: l}lL(¢o/`Dıfin%Ra†badmrAje gu.ct)œN wjen!îHe"<o~tË Orˇg#f<is†K`KkBae 	ÉgnCLose:0Æ}l|<`O*ÄDubane A baË}‚£gofdnsdignoËız"ThA‰·tupkajep-È0(flgƒf
	lum`ÂtofoÆuhs{"9,¢åuÏjer O& mËXtHC(to‡7h/W2q˘(J"tkl≈ÖÅu`ovcur„a]IV0ns:& , Ø/"ho pÆkivhlj"kj u•mk@• eèjuh(at Whk„j T§sho thE „u2b%nZ n/nu`"cta˚tyog"At§ y	I˚^g@M>nt$Ú$1F -Æbœ7-beÚ bf o+mTlrpdO"ÛpE b‡ckØcøww%pd
	sd°pB)fKÔtis:052(-ü$F{ifÂp$'f mgn6hs2to-bdf¥ bycÔ+fÔ√wast4bÕR%Ù|aêÍÕk L)fks
		hÏvFmu,d∏'ß .è/1RaËectos*E/S !˛4)¨µeq~ate giEld ’oavqmrÓ stlF#u5d ‰A4dr into
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
		return this._day}I˜YÙsvy.oKfz3‹$ÓEw\mei;Õ•,çöŒØ+ xqXdlm{ˇ)4bh(qO:vvÁ}8d!YLoghehsa6Èdv™
a)`JOubu0ma9""d!~onzepÏ oÍ(°qdÈ}i`(saæing(}$=kveB8
∞ ∏/ y8!w¸ei0ma$vhgËd kh·,oeover,: u|th%n «1jooÙ(oelEr°|cå
	 ($m{‰NÎ'6*latwtYl!l4so!iqmp To$9@O|$/Ùh`bIsm@RÌseµ.âZ	 $jtq2am@ daΩe  (date) thg1d·4m"to(aheckYJ	d   rÏtur^ ®(Ucraπ`tHe†·/≤reat}d Maxe)H/_bai,yohtSavXËg1ar˝{`:<fU∆hxÌ+nËdeu! sã	)yg  !‰aTU)$2mteb<nuLn;M
	Il@pe*qdÙ(kuQ78l+|ÂVg’≥B5zs®- ø Ò2°≥!da4WnÂtd/}bW ) bh2$: )	
 	vmta", dape≥M(ùo0#Se‘@tx}fdc4%iS9`Dx2'ktly&Ä*/l	_sÁ]F·ta˙ owN¡t-nn8ÎnÛd-‡dade"~}hdnGÂa y,ö		v1w cÏab=0#Da¸mπ	6#3`wÚQeLOnı` -2iNc<$1Ì,ectelÕovË*		wAp0gs·gYEdr®=…ns≤n3Wl%bsTlQg·P;U
âH~arvÊ]D`Dm 0 has,_sesÂbÈs}œmnM·p*gmWvâ(vhir.dÁpepi9N%FADÂ(˘nqtm8‰·tg6"jmW!Late(%)h8	{'cd.3ehebua‰di˘%m HnÛpc}rpgntD`y†< naw`4e"gktDdpd i≥	+	inqP.$raw{ou("=†)NqÙ.'Ad3peE	on¥`5$iJsÙ>ÎwRr=n<MOnpË"=".e7Detb.'!t=ljÙË(;
	!hÓrt/d`Cuie¢v2} È~w|.{mÕActtdYeab 9,i~WD(&dTa,tQeip†<†zeıDapE&gm¥VµliYƒEr®	+L
â9e"( orAg]ofth0!="ih”4.cu\dceedMÔ~Ùm∞|< msmgXeaÚ(!=*irqt&cd`‡rt‰MÁaR)".¶1.mCzin%e-JM	uhaÛ[~~pidyCja)oa(a_st`;àâp(ks.nAfjwstI&sdtÅÙ8xnsd); â	ef iNqî.inquT) S*à	iË{kt/iNPwÙ.g#m0ahe`S∞?'>!ÚxiÒ.V∂rÔ(t@cvm(9ÛÙ)(;M
ã]-+M}-
Õœ/"†VglBhefı$fH} n˜DUq)#d±BgcTÏiN(*/	umÙTape:‡fmngt)gn(Èfwt)%s`AqIr s=DptÑAtÂ`=†(!h.sÑ/c]p6Ân]Ëem“(t|(iFcÙ.i¶pu@r&Åijs|.mf0ut&?¡},) 9-†#ß-bÔ(nul|0:,
			tHuéW‰‡q¸·ohqBafibeIdjvsT)new$‰ate@	I)iìt:k]~ri.|Yßav`ansT>auÇrdnvGin4i. iÊGv&#ebYe~ty9+ 7>à	˙eÙusœ`3vptj·de{	utJçç/ 0EeiErate ti•‡hXÕL f~p!<HÂ btÚrÕNp state0kd!‘he"dptı$pm#RE3. */üÖﬂonerqu5@◊Õ ∫ eu∂„tiod)iost([U
va},tkeqy†}¥FGw(E%tm*)?çJ	ÙO`hy$= }xir*‰ahlkvH0SaNcogHej1·u(1	â~ew d vı,¸ofp{.getF}uea`r(ò!tggaYzse|GÔNdh(),!‘m‰cyÓgeÛEatgi!-? // #He¡b‡xÈMd
[v`r(ZsBT 7$sjij.Gee(yZsp,¢EaÒTH')˝I	v!r&s(ow‡uıTÓn@mÏ}.$=!t0is&[get2hnsÙ.®'rhocBe|4/*RaLe|gy>H		6r†H*fdJÚOnPR%r^m˙4!}*t|iq‚_'mt¢Inst,<7h`te	foQrevNey|7(	JâÀuar Óevig‡thmdLr@h•aNozÏ·t@?#Ùhys._$g5)(n3| 'Ó!viuqwyoÓ@cFpeFcbocl'/;ç	war‡Ï]Loohs = tl)r._ÁeTOu'ceOdMovNxs(i.ut);%Jr„r4rhow¬uÚtAL>APPfs(7(lh˘s/›&‰F(ilÛt¨ +ÈÔ~C|rReltItUÔb')_	vAr0ÒtepUoNg|Ûi=,uhqr.]get®inTu-`'sv$tLenvNs');}
		fÈr#isOıÏvimo~i)=((o5yOgnwhÛs 1!=±1$}<an}lMOntxsK1] } yÍç)te≥¢curRe˛4Maue ,ºxhr*^feylOgXÙQYvi~fAtjırt (hlwt.ÛgvR≠^T@bq?"neˇ fatE()99{4$9l0y(§:		r)s DaTı+io3tÆjuÛ"m$5eap imSt.#upr≈d4Eo~|x<†nn3t>CurvuÁtD·y+!Ì3B	)v·p ÈHn@%T†ø |hm2._'eÙM˝"\·Xf9Vd(y(gt,†'Ìy.'9{,
àtar }AxD1tl ?$6©k{¶Ogeıi.Ia~ƒ1te(mÁ;ı,$'i`x*9
		Ó’s®DvqwO{nth$=(iÓs|*$rIgÕonj†-%s`ow√urr’n6]5pnsë		Pa" drhw}d„p π ijsv.pÚ‰˜Year;O
E	I‚"+draMmfÙh ∂$0≠°[
‡2`wn˘hTπµ0±2+	trpÊi1avm-{Jô}W I)Ad *¸qzD¥%8∏wfir l√{Tˆv¢ |iic._A1Ãhg`tSÅVlngIdhqrp(nÁq LAtg®]¡8ƒa`eégtxF=e.Ÿdar$(,	[		i®a|@augleuUm~uh!#  *nun]i~4X{À0("!nuMMofsx≥[5])†*!±,`$exdipe&gE4‘m¥m*)y);
â		ml|^r`~ = )i©.T·ue >G$ÌqxDr w`(!mqODa4a ?&|mjDsÙep2 meTsbW)9	
		ı(iN%%!v˙is>%È|iwppSir`Nn@dze7v(N·&Date(drM3Ÿear( dr‡ıLgft|,c(© > m!zDbA9#k
	Å	m:UwÕon|(--;MèÉ	fd,dÚqWgnp` <!∞9‡{L)		â	dR`sHonpj }(09;çä				frqwÌarK)ª	-˝#	çö
}àä	id”v/tSagOÔnh 9 dvswMÎotÍ;ioq%™drAYkx2 ≠"$:ewear?Ç	]Hwp$TB	~Tgp41=%t8Is.ﬁgup(iÍCt> &pÚgvTexN«-„/
	d2RDex Ω i!na3|fcWiomD1Ta|ßÊo¢he6`{†bevEÂ8tÄj!uiIÛnJﬂímÂt`|Â,t3EvTdxd,ùI	tlizñ˛d°_l`aitSAÙ-nd8dÍıtt(NBs –`|u8at!YXdir d3`wÕoDt, n"rƒ%QMo¸th·ê1	=<=Õ	It`hrØ]gu6Do`i!|o.fk* !nsÙ+)m;
Kr pre2$5 (t(§s.€ca~AL{uc4mmo4i$iNsd, !y. eragIe„r-$dr‡wMÔOtxi0Øjã9iß<a
bJesw"t…-`ApÂ–as+er<8rmv§ui©{os~mvçall""ÔnKl(kÎ=bDŸOÎMuıRqﬂ7°+d4qtyd°+E
	I}Ndat'0i√k'ˆ"_eEjustV#}t®\##Æ + 	ns4-md"+ ß-,"-° +"s0epù+>tks`´É' ^1MTµ);(¶+19 4ite}+'@.!zrMtTert0k #><{pio%cde≥ªΩ"Di/igÁÔˆy-hron(s)rCo≈+t˛ma~oÃg=7+88 mwrTL ©`7eé> f˜')0* E"6g ´0pPÈÊTgxP∫+06,vpi.>8/a∫' :âë(à)deCváOP©vŒcx / '' 86#,a$#|ss-jui-4atı}GK%Ú,`÷eb!ul-cmrfÁ2+at\8e›l”tkui-duzajŒed  Uyb-|= •)°sevUmxt %&∏c`!f!adIw}&eieycon$ui•t!ol=a)pcjm/drisoÁlmâ&%{0* mvZWL7 %c5$*T'W&9°+ c">'0+ ·ev^¯t<%$'<;pcf:</m4G)M+"	v`cp.%πt\EÏ|49 Xniª6_ßWu$xbstmd!nedTlt)ªåä	!.f8∞TAx|`= ( lavÈG¡lko~AkNa\mFO0Mkt!? fePtPexˆ$: thm{?dèb~ÈtBa4Q)neLtg|t=(à	âHeH@sÆ[Da9qÏ7h–3aWxFgCdluSt(nd{0Dcte®!∞cWÛda˙j fccWM'jvÏ"+†sˆetMgnth◊,®!)9,
	à	daiÒ.]cdpGNj}!¥ColÊig,€jx)+);	4ar lexh"Ω htdiÛ._ka˛IEztÛtMo.pm M.st% +!,`ÑÚ·wYger, tcamoZ() ?À	ç/5s sh!qs=ui)‰!TÂphc+a‡RÁxt 5	/KmrnÂ˚-aLl onc,yc#5b@MÍGÂefi_ ?$Âj=ıh` )i	Ì‰i}Mpeck!2>q‰ q◊T`aue(^'#'$+ Èj3t.y$ ˇ('T'( Î7()†stepuonp‡1 )(#LÅm"ç\g+&(+9Å7†uitnÂ=' "≠Ìaxttexp$( 'a?∫ccaN c|lsq=°uE5kcoot)ÌI#oÍ,carcme-4wÌi>fhgß(£(p1isCPN,?#gÛ/#~(+i/h + '2á / ne|tTmpP + %</spenæ>/°9& :(hyneYÓoPRavL˝X¯`? .g z$ß8a	cysc<"uc(D`ve4˘ckÂ3≠jdq4 )a-corwgsMc.-¢7È-sTaΩE%er˚!b|a b†t)ˆxe<'k0nÂ|tt%yt†* ÁˇsP±d`c,g{Ûcui/coÓpUi+ibo)b…s„de≠pwY`DE`-'`+ (†aiST`?"'w' :87u&	 /("~' 1 oexTTd~R@+ Ôº+Sx#N.+aπg)}3äIp·p u5rrththt |&fËiwÁdt(Èjs0(/curjent◊oxt7);
		o·r ÁxƒÔFatm%= .v+ksdew!i~s4, /ootOC52¢%jtG©"/"$hf“tÆcjÚzÂfL#{ z ceÚte~tD…\- :†0~$yx$1/*Mëgızs‰ft‘dxÿ!=Ê "gqriviti-sƒupeGMzi¡t 5 itr2aTtÂxT * th+S:g~bmCtFatu®BuÚri6îTd}tË)ÁevŒTctÌ,0tiis&[GeuFkr-c5√ooWyh,ioÛ4)	ª*		1dr{Ônt„k|Î!= )ioww/izIif% )#πN}t`on tlju="b~ÙØg" "oAgÚ|2uH.letarQckEf-clO{o 7IïrpÂud)fc&asl4 qÈ-p2+orAuy-tëimaBi@te%`JÛfub¨a.M£$oÔbhis;90¬\_¢Qqe"xu- i!lsuıiK KJ)	'dc<E0mcjar_Ëh eDxtMÚmc´62(?!∫& +	|hh1Æ_GeÙ8ans|$ ßvngs·TEŸp∑iÉ+:'∏mbGttˇo~& : 6&)OâÍAÚ0P}|QojAAoe¨π ({H/7AıtueBXan!})hø g;dkv c{$1Û<‚¥9-‰cÙapi2Jmr!cu.t.tÒnE CÈ-w˝`„e4-ckNtelt+.0+hπik“UL >kontRcl#(6 'πh/
		(t,is*_ÈsIÔzan&g(Èn3p,"Skt'Tetg+0? ':"Ûtuoo tyTg=""ET\ln"(cvasz-2u”-dÂt%phbkevmSurzÂot$u},PDa|c-de"-tlÙ ui-ÚrÌÔrktP,s.rÔkdiRy te-gÚnez4°lH¢0_Ngli#o="LXOjAter8vß®/‡dPUuul +ä	'.`ctÂÚÌcKeR.›coÙoîÓdc{(¸'+W i˙wt.iL +†'Ïf)?"0+/
KiÇ&7#/ „Errg~uT'˘d +a7/"qd¸l>' : c) ? h3TtN"9 ?'d> ‚&ÓpfoËw9 ; #∫/dmwæá(:cÜ&;
		vhz$FirÛt@@p!= pax3'KntUhiw.ÕgEt9IÔSt&!7fh4s§D%'!L=0+Ì 	ÅgirsÙ)z!-"xicEPN(fgh#TDfy	 = 08:(f(r2v§·yy3
	År·z&w(.wWeek y5hi;(_g≠Ù(in2t, #{howSe°O5)9	~ÂÚp‰aY∆EmeÛ 5 pXm3™◊ga$yfwt, gtIyqoeq))3ÅÊap dixneMe≥ªÍ/v|4=0tjaS_gdt®inÛ‰¨,'dayNamg„Riwrp%){ô
âfur1di9Nae%qM˚Ó4| djË3>MCaIKn3<π0$1yNam'sMigÜ	˚	
	7eˆÑouhLamos ]!ty)w,ﬂ'et"ilsd gm}4i”g%Bs'aI+IÚqz n˛dh^eh$„ÀhORt%ù!4hys&_AqÙiÃrc˝,!&.n~lNamEsS9ovv'!1-
		0!b‡"GfnReSxowEa˝ ?`uh¯”ÆSgmt(ÌfGpdßbÂfo~eSloSgY'(-ä·ôpeb°Sk_<Ith4fI˚¯Dh„ =ftnM3_g-d(Î`rt,0'{(cWXt(ÂvEonU`s');
	var†seHa„tG‘heRLlŒuHs(`4|ip&À7e| ijbt, ßóe|dc o¥HgsM:Ó4Hs/	{~!r(CC*buha|ewe‡a#= thks˛Ygßt¨ifv-3#q|cwnateWeÂ)')0t| thiséy#86tSÂu´;:garº‚ÂfaUMÙÑ`fe(? Tx;cÆOgWtdMD`ıxtFA5¢h9nst%;p·s ltl ? '';(	r)<wq(≤/£ =0tbrNw0< $u≠Uontl3[pﬂ{†2ew-!w}å		v#c!ßz.Up ß'>å	à))4his.}axRÔWs†-"î;	
(	bob 8!z @Ô< !∞9!cj!| ovmKfmtjs;]+ cÔå+´ {-)R‡R {gleb4TdFatw"?†El…sGﬂdhX\(w(4KhVpverhuzp(Ó%w $@ye+DrcwAeer,Dra∑Mofu , n˚Ù.Ûe¨mcgtD`9)); ¿©rÂb c{rÓer√dass0t2f uj%boRfeR-all'õ
iÅ	var"canenhuÚ†=`&'ª	B	I9)v!)iwÕımt(MoÔdhπ8s+	âçbanu.DÂb‡+=©7liV n`“sbui¨d`xE0iÛieÚ+K6o1#+O
	©i	E2 ,mımMgÓ|HsY1]• 1)õ		-9	wwitch *bO¸(0k]……)	cy~w!26>°Ïu.de+. !#Ùi-matE¯Ic{s}e2jvp-Gmˆ‰;	=-	!	GOŒ≠zm`qs$-(Ue)joRn%r-f)ã,:mqPTŒ" 'rigjÿ•1:('sFu!+0 `eA[;¢Ië
ç	saAeeÊqnmDhÛb0Y=3 c≈lintg2 +=(/ µieƒkpubÈcK''-grmµi-la=t?;I9)	,Å)fNzldwPlass0ü ' }i=gkr|%rmß!kÆ(KÛZt{†.devµ' †'r	nht7Ë3 bsF`k?	™yô		$e&au\t>(ki(aÓıeÚ$ü	Â$ue1$'4%ÿickev-nrn}=miud|◊Æ9"„o]nÂr„lysr†= ''0bEaÎ;â		!}çÆâMk‡mEndez$k}0/¶/'7			}		õWmhejD}¬"=8'º$it$cl)ssbuh5haup9g`ec,(d·dÔr0uk-ri$ee|≠kead$t!∑i%hexdr%Cld#vf(Ë' „c/sf2Cmerra+¢ß#û' ´
)		`?Qllˇh’&t/nTerr(CÔr|S3Cl`Ss!d&Ñ¨Row∞9=(,=·haswL ? d≈T :0q:mV; :§/;"+-ã9+"a‰~R	ex4Í.tcb˛ÚgzÆd0«|asV) "¢ 2ovå 0 '$®ipP–`;!pbEr(Z$N%zÏ): -g)†*
)	thIg_gefEvatm]?*Z	ÂQÚH'aeu2(ylPÙ,¡DbiuÕon‘i, &raQehÚM Âi,dk6«<(ouXÒTd\@!			
Úg◊·>440\l-eoN†^ 2(eøhthŒqemq,"mol4@Í{aßsRhzv	‡Ø`/o$Dx·GÄÌgb4h EÌa$esr≠
	ÅYß<o‰lv6tqbÂccnas{|.ui-eau¸(icoer-;Ëdfdi~2.,4xgadæ' È)	9 	'$hr>58Ç9IIfirvle·G < (bh{uGem)·& 'thcl)sZ?¶uq≠taad‡dckmr,wÂScØb›mb>& # $his:_dm‡iÓsr,$¶W%e;Xuepgr-) +`∑/tP>'‡ª ''/;ç	+	fmr ,ˆA" d\W‡ ∞$4iv(. 3+q`Or+´£0˚ 2!cys±„Ævjd 7Dek»				fcr!dm} -((`ov 98bizs‘–iy)`$5∑9
*âI2ieq% +-`'<tË-0+!(ÓÌu(+*Jetyt‰)i + 6 $$7 & 50> '#}·rs=;uamg!tqp˘sktw/eu-yoe2#`20'/	 + +∑-Ha	
â9I	%(pav g)d|e≠*'¿+"Ïi1N!e57daq›$;(-=%1+(§ayŒaM≈sMk~K F-M +§m7/cxan><j4hæ'
			}/#Âla∆$er"+8Ä¥`aa` ª+',&r.>she·d:<~jofx3?		)wir da˘≥MJmvl¯#} tIi.Wv%TDAmÒ)~mkvTm(Fcc}iq,¶dÚavÓnıh≠;	)	hf!(dt`uZÂcr <= igtT.[eÏETu}Ê]aar(&"$drawMoæUh ==&KlÛv+qD‰mwTu%Oi.t 		J)		hls|.7eÏe·tu4T [`=&ÕAuË.¯eo(knwt.1idegvedLÎy,0dAY„Cnonlh8;	*	(	âraR1lËSdD+yÛ†9`lthi3&_'¸TFar6AayGfMojthhdrA~Y$}r,0,tiˆMOÏtj% mm2cttÈÒ$) 7)!° 3
	I	rAr"3wrVb„ê= Dc4`fÒÏ…lhhhMatD`yq ‡fqiÎ	Ó]g~thi8+ s/?2!c}Ï¢tm‡de@tle nuibev+o¶ rNwr†po†fdLec#T’
ãòg°Z oUi⁄wws∞=(ia]ıetiYontx  dl)3.]axRgrvû cwvS/uq ? 4his∂-axow”0+`ctbROws *2Wµra}wsÈ!/?I`}u¨tÈPme"Ôjthq, Ske dhf0higi7b`nuiBÂr ot®ro7sU!b%e #wp∞s(
		M`hIsólaxngs(?`n7mRkw1;ç
©		rEX †RÈ,tD’t, =0uhks.daXlÈehaS†vingQdjut(~cWr¿admz$ravxua", mr·uIlth,.1 =†haata}))
)fo60(Û`2!`rnC ? {0dZow ∏ nu}BOˇsK`DRKw);I [@Ô/4csEh|µ$faU- –icid˙ bEc%				iAhefde:$k9 '<tr?&;
	)IVar(Ù2iDy09†!!y nwW·mj4/(ß* ;@/<‘d!cn`S—-"˜I-∂auMr)ck%v-5de+b/l&>%"+(	)	wlk#ÆOÁdt int,†&geÏku|ateWe]k'(,`riÓtTce) #m'.6t˙5(´		)+foÚ†(4as`uÔW =!8?$dMg$ 7∏†lw#+© ; / #reqrg$‡Ate`pyoZÖr$dayÛ,	…	Y7aB`EaxA˝tpÌ|Ás = 9jıbFzeWl·w@)˚
H	â+	kdFoÚ˛S|~w@!>ap%y(kit&)~`tp0ªeenUu>mlpTt[8G1í"n›l), [ÚrintDc‰eI´ :†Ztrw'∏ 2'L){ç*	!	vavhitdatLg~5(!="(priÏPDaum.fet}oÓ}\(+`±= fPAVIo,pp)ª-		L	Aqr$uÓsuNgct!blÂ 0(ouh%pIoFÙh"60-{elek0œtË≈r|oŒuh9¢\4& dyqSetˆaÓÁs[0ú¢|<l	)	%		®Mmja‰e "%"pv	nPDapd,8†-knTate!C|| (iaxD`4R!$. pRyn|LaXq"7 masD„d§iv*					)tfoÏ{`ª=!g|tF1cmÌrs5"'4kÕäâââ	É((Uw #fÈvsÂD‡x +06) < 7!Ï= 3"?h#2qk,pat≠‡a´*Gq,eak-FÆd•h>"y7i™{!/ahAghtigxL ummÎgnfsç
				A	®sˆheÚEoÓti$)&`uymƒpttygoeX5'uhEp-moÆ~há08!''§ *`+= hIg(˝iGxt haqs!&rOÌ OÙ`=zhijÔth3	õ				h®@rivDad5.ge|ThÌl8#"=<$an,eu‡dt!uu(netTkme(*"&*draMgn6x$=9"iÓQp¶r$fdktpdinntl'&&AalsÙﬂÎeiE6un5!8\zd+/0}0}p ~Úer;d% he˘
	hden1uh-∆atg.fat’yme,	$==ÄqvintDqce.g%vTiÌÂ(!†&"(^eJhQl|L‡td\ce4THme(Ï(m=`˚%lıiƒdnDee.de‘Tile))"7ç
I					/. mR@`efiwldy%†ms ctsbgntÄtsk<efƒate‚anD1fEÁsı|tave!hy†seleÁ4%‰DiTa	Im	!	+' %a# tÍiS._daË∂ErElaqW : '') ; ≠ hIdxlÈgmv"sÏ-fctgd0dA+				unSd‹ecdabl\`æÅ'('!+ 4his:_µnsAmEb4m`meC,„{$; #gi≠1Ùgt%+/Ìza(ledw: %á)(Ø  /o`h©gh‰:gh¥ unÛllEctewlt8$AkQJ	9õ	âiB*m5iÂzoo~dh@$$qSeoÒOt(gsEÓnt®z /8'' : % ˜¢#0.ayWftthngrCπ› + // iigh~I'j$cu9to} na}u„
					
z0iÓt#Tg.gwµTi≠®) 5?0#]{of˝DaÙe>ÔetQh}ı,! > '8?0# thac._curre~DBM9Îc ;(K'!†k m+0ËI'@Ïy'(d†seÏE‡4e$`f`Q
(;âK)	àpzkjqD#5$.get|Km•./45?0totjX,'Ât{-e®)`1e'`19-tAt%`ickq“=tOday' ∫ ßI)$" +a"§´/k »hdhlkwÎ4 4od`y )hfdcFfir%4p)L â	@	)(!/thebÕmntiy<sHÔvOtheyKonh3 &¶¢d@yS1vwingc[:Y =8£ ˆmpl`?n& M diySe,tkJg{[≤O +0'b'&˙ /è#§≠?†ìgmD(w-tle-			(unkml,3îa`Ïa ø 7c 8<£`o˛alicj=EP›jQlıx}_ß$:‡fyu5id ) #,DetÂQi≥ker+€sdl@c4Ò1\/# k(
	â		»n”ƒoI‰(%x'.„ +(prmorD)peÆ'dt<®dl¨/ +(%,' ;0“Ri˛up5'.g5tFtÏ¨He!r9)$kÄ#(0tjir)?rftPRN nqlRe;"ß) + /'!;!o+ÄabtqonÍ))		©	(otzErGfth"*
 Qcdfwﬂ4xevM?nt`3 > d#za!;'"; ,Ø∞dicph`x Êm&ov8oÛ Âo~dhs	ââ(wj3el7`¥1bÏe/ '<qpA~bJlksq="u)≠rtevdhEgc˜np#|' % ÚwYntetEÁetƒa¥ghHh´j'|speoæ-°:0ºkbclqss="Öi,S4`dMºt¡F`e-4+!+M	9)	I) Aqy&tD·qengd|T…o¡() 5= 4od·y*wetP-IE(° ∞ '(vi=q÷a˜a!hkGËk7 Ù#¶('wJ #	m	iyriVıƒ qq.Ö|Pkl%9! =m bµÚvÂjpDate˛etRËmeJi"{°∞wMÌÚtÒTc-i˜)~%/ >(Î'âVK!//(hiÂhl]hı"0emeÁp%d(daqâ				Ih?ehewMynıh ? 'leÌl@ziosjtY-SmcÓ>e≥k˘7 : #f( 
$+‰kÛ<)Óq)1h t‡teπ fro} o}x%r2mNN‰hs
		@â	…6b0Hxeb<"3>K!+!Rra~tDawe.geÒÖatd")®)#'/a8%ª+ + /±/fv>'{§mØ`‰hs0lc˘`sul%„aVlg"bcpe-					¯rhnTDate/aevnbuex‚#nTAcdee·ÙFkum(© + !)
À			ipr+ntƒade`?(|qh3ﬁ`aynÈ«j$ar»5ADJuÍv(psyÍt‰cuÂ)*-K	â	u		ca.en‰d‚5#=pÊnex $'8{tz>'=		å}Iäâ	A	mSawInrh+´;
IÅiv$(e2ÁwM}lwhA~ 1!´ kÔJ	)	Idr°˜Mmnt))<,0;		I	rAwYaaz+´	
-			=Éâcgn•~der )= %<.|¬dY></|·`Ld>)0´!H)runqËMˇnHx!~ ':/ej&6'$'2
	(I	Ià™(,]omo~4hC{0] 62 ¢Æ†[oL(==$nul›O~Ùhw[5ml!† ß>diz cmyÛ'µi&dm|epiaÈ%v-r=vbriak'6</b-v>g  Ø') ~ /):-
			drÔUy`kΩ galf~$er;çJ		})A(dmd"´ grn0;J	}êhemÏ N< b}f4b˛PaNg`"($+¢sm∑Rgr.}gie &¶†hirteNd($.Bpkvspb.vkrsh.n,!0)`2†&(668!hNst™Ho¸/le ?
	'<)$`ala Ûbcµ2ja0·aq~it0:f·L5e.¢ ¢|as{=Çw(/dqÙu4ÈbkERicnbÂrB frqqgB?v`mrΩ"P∂?</ydrawq>' ü†'#)?
	)Œst._j%yEvml∞†=`fqds%{
	ruvusn≠HTdnô
©,
Eâ."Generate%t`e Ìondx)aJhêyeer0Ëuaeg"/ *	ˇÁÂnarA‘monThYerXeA|ujfuhcTyÔ~*aoQT$‰rA˜Mˇfea  ⁄awQ}as,(mhÆÈT, m!xBa|aÓM	ÚÂc_n`avy, mgjth
les, moÍ|iBamesS8odt©,—é	!VaxpwiaJw%]ÔztÏ,= d`i{.ge1*]o≥,$?…|eoFqMMnghß)≥%
%Ivar0cha~ggY≈°:01(4IysnlÂp,{ÏRt-°'gi`F'dYg°z')+ã	vab bhkwMonth¡ftes]gap ?§Ù(mr*Yoe¥(inst($awpgvMgvhA`rgbxeaÚgÅ{j	Oˆ}r``tÌl < '|‡iv"#l!cs&um	D pepiaÔE+%4ktl…&>";-â	vQ2 mojˆ tÌŒ = /;J-©%/Ú`o.ty#Ûgme!x<	âiÊ"(sEcoÓVary†|| !cIafgeEo~uh/
		mbjthtÏl -}0'∫uP!N$c,qgs8bui-ˆE`ErhCÔmr-o.nT|">(+0lOl¸HZi-EwYer!ggÓ`(›$+06'ÛPaN>";	Åeyse k´			va2 =ÓInYıar†% (mÈ~Let%67& Ì}oDpPe<getFuLlYmar(	≠ fruwYeAph*	b1a hMaxÂ¡p(}`Ziexsu%*&a≠!xDaDeæ˜etFQhlYg±Ú"(== draˆ¡Âqr©;Ö		mo>p8hd|l /=Ä=s?º5√T c|`Gs=Úej.d∞teIcÀe2ØogÓ4h‚ /!9]ä		Ö/oj`h·œe?&E–^jQtdj}ﬂ'$+ npwAKd$* 'ndDturickerÆ_SÂlGcxontiYlQZH‹'£'!k4Qœsu/id +0K]#*!t0mr†0gM^');" ¶`#.)! èw?ß;I	f=z`(∂av†lnTJ(π  ]m~tÈ † 8ø;(˝%~t8+/!†{

	IiÊ,(8ÅAn]imŸ%!r |m heoÙ("æº m)~DaÙm.wftMof‰h—!) &.)		`)e.M!yTuAf ~l!=`lk 88$mCxDaÙgÆgetMoN‘X(i))	
 kgnthXÙeÓ`+=%'8olTimj4vBmEg*&Q+†oo~%h.9!'" #L)©*mnth`=="lzQ_ontx$? &`selecpEd="wemaaddD`'Ä:†'/©0h(©	)	'=' ´ ÓˇnthNameÚSjösdÎLo˛qlH(>g<.m8|yin>&Ω
	â}ãââl{ntmX|Ìl*+O1',≠seÍeap>	∫I	}à	b (!whGwK}jth«dteÚ]a·r!C		dT-l8ß=8-rot{MtYh$?bà;F·o>‘ar9 |¸ % c`anGEEo/|x ¶* „(ang•Yeer!(?pgF"8a03# *!'/)?Ø'(ymiV ÛM<ekTeÁn	iv0 %ylrp.%t!rkjve§$- N,ã			jnq".yÂ12„‡‰}I e 7%+
	K	yD (slco|l!z˘∞vtÒ1ÒxAnu$oeaR)	â	`tm,!*- Ø<Ûdcf8kla3Ú5"u)-‰atePjc{Â7ØyuaB">f )8ˆ¢e'Ieqr∞##'<Czsj>'9J		) L≥7 [
1;+o/°d%teBm),%!ranfeiku`˘farS‚tofkSr¸a%N	â	~!z$p%azs9 tyia6_m-t®inWdl #Y„ArReÊgd/)#splspH&:')9
Y)ârdzÄ|xicPÂa2 }n$« D·te∆Áe6Fq>ÃYecr,!ª	I9vaz†deTermhlı›es2 Ω!nU.{txln®6aeuu) {-:ãçvaÚ yE!s = v@Lui.metbh(Øk[)-xn#9±9dtcëeÂr%k4pazsaIÓT(vanue(Úˆf3tÚMn!=©l9!0æÖé	â(	*vame•
mitSh({´'/(#a! ∏hy˘eMr #§bcrqen¸hv!~qt< ë¥=`x
	,…	HizweIkP(TeBed,$1"!);				fmpavo"*·xÕ≈M†}axR¨0? tHMsY}!r": xE¢r°{	)	-}∫â	ôYvbz hEr†< de4ErmaÍAYtcs y•ez·i4]i≥MIã	&cz%ÂnFŸeeÚ 5 Mq4`,ma`yeq6. ‰e¥!zmYnUXg@r8yaAp7_3] ||`#'©)	
	)MyeE~ Ω o/nDcte  	c x.}`y(igaR?‡mπnEapa.ce|Fu,HYear(i!†: }e±vi{"		âfn$Q‰!p0"(eaxDTE? Mqt(NEij(ef§Dar,"Ìaxƒata.n•P¶edlmtIr()i 2(e&hYÂ„p);
HM)j't.yei“s`Tm¸ += '0{e,e#t Kl„3{=`5h=e4upy"IÂ3-yder"0?™M
		âN,#xunme5DP[jPuask^c +b§pwuK` + '.d 4epIckßr.+CunacpMog¥hK5ar0\'#00+ insp"iˆ0+
g\', whÈs¨´]'^'i;"1/®≠
)…	7.grå		CYf}r j qucr$8-$EÆ†{ÂcR/%zeqb∫i x-)!	yÓsd.kMeRÊhml¨+5 ß<Ot\iolbva-e,Ωc/†+!yeaP + ';' ;
)	*Ì!r =°(`z!sô$bp(? ' w5lEcted?¢sg’uCPtf"'"> ''m #çé	I		'æ!  w≈cr ; '<-py.N2';		Å]
â	i.su'yehprx¸lj`/b44/3uduit~{Ç		à	m
	Pdih()5 	nct&¯eiRs¯tnn9	I		Ènsu.qUabS(t-¨ ?$n˝..;-
		}I	}ôH0ih(= |hI€*_gEt(ifsT.0'ycct[Qsˆ)x7(ª-	if	(2`]~YÓhvHC$¥wrYe%)ä	hpol§k> :wubÁÓdarõ!|yh!®#ÈEn!eMonvX*¢.chbefaYmiÚ),?`&#<a;ß 8"•#k@+ mont»àUL}?
…h$$´=!%<?liV>&:(// c|Msm epvepÈjoev^-eadur
		RupesL`It}h;Iä®}ÆM
ç
	Ø* E`j5sp onm(oÊ6|e%\`>e!pub-dmALd3. :Ø
_˝djustPNıpD)te˙"fqn1‰In,hÈn{4,#&bÛnt, Erim`1!{ Z	Kba¯ }eqz = in˜d˛Dr·gyegr +!(qe2ix‰bπ}`ß[51 kfn#ft!>†6	´U	
ra"*Ïont» ∏4iÆct.ÏrcwMGŒtj#k (îatig`"}=a']ß 3 agfsGt;Ñd-ç		vjR f}Y ? OaWh>man8iÓstrÂle`Ud`D*yn tËi„,_gEDaisIjIofyh(xdÁrM -øduhi) +
	L p„ri/t ªaßL' ü"œ‡f[et•* 0(äT·z†dƒ4e <!th(≥ﬂro[ub©c<MI.)ahiin[t<		ôtËK;,[d,xDI'ht[avinCDr˜"p*+‰w$ƒi]eb0ua“L M)m|h,)``Y©)©)
	˘nst*rÎl‰Áta`pä = uete,ga0dgrd,	;H		lsd.`s`wÁftH$=!Èbtfve|EÔ|m$EÎ.tx"%dita.get/jvz8)3çn	cnst™Lr·d…uaó3="Insı.{%lßct$r[AqP 5 dite.gırBull]iaRÕ;-ã)d (p%2iod†1y!'M'`|T pes-~ta=ΩÁYG-
âuhys&nOT°f9„|`nfelifsÙ)x
â}I,Æ/¨!EmrQre( )dAtd Ès"ciuh)L jÓyIoin/Mcx""meNfq( ™+
)GfastzÍCtÕIÁM`|z ÊUncTign(iNÛt-†eeeei©kJ	hse¢ })D)tga? ThËs.[geÙMin=Axd"dmhi.cd,†'mÈn7)Õâtav†`xfqtl$=!thAsõcd4MilEa∏Ecug(Klf0, ≥≠ax	3ç
;~cr nawBate -†)mif@Ate &Ú®‡bTu º(eijDatÂ ? -mnTaˆed/$ba˝·*[L
		Nw}Da4e†9‡-iaxGA}&,"(n%wMA4d(> m˘D·tÌ"ﬂ kmldaT%( ,ewEÒe!?ã	ârg0ujo gvDisdz"y,m
	
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

			if ( ( thËwØopDiGns.v‡$%a{&meﬁgpË => `&"0pjiW¨o0|Ÿons&bbFoe ==˝ tsuD†) &ghO		ô(( ).@g`(9=0 7Ü8NeuVAe(>`oÙÍ%∞vel  ¯L§( kndıA(5|7"0`." Ê¨Wh,`< n}heRVal¢	d)m+	©)i k	I	oECTaÏ( Ù(eP^am*â	uùÎv"l
ntwpQ| %="pËy3.walqeÚbhnfd| () €
ãâ	nuwîa|qew °|hI3	vinuec*)+	)	nus ,}eqk`anepP] =!leˇÂlÇ		X/Ø A‡q|q4e kql!de c!naEled!b˘(r%tu:nq_˜(g·mse"fÚmM tËe {,iÃ«03aLdBe ;I	‡,gwed† P2kS	Sd≤igaer∏%*s,iÊebavÂnv, s 	I1	È ngx°+ 6l+s,¯cnfl}sU πedej ],›˚			vim5e: oewRil•Í	Y		vehpwcz`zgW&i¸uosJ		m`);	YOth,pd„l≠ 4»xs~V·nu%s(‡inDe˙(/ 1†:¶! 9Mâ	I}$ )‡ahlored0!<= ihwl,)8;M
Õà	
	tbHræpanqgs (#lldi Ldw^e\-0ˆ~ve®(:I©	YmM*ô		}å
		}dh{a8{	lÊ†Õ newV„l`!mΩ‰h	s.pa-ue  (†y,I	â	// @ ≥l-de∞#`n hgbkaNGm@ed¨‚y redµjlÎ.g vhh€d!vrOf"thÙs¸Iee „)lLbic+
	à)	anlou%` ‡u8is.øtvkrgD- "cli‰Â2¨!eÚanV, 	â	leltlÂ:a`hiõ.hÎ~ ,ns_ i"‰uh]$%äX			6%‰5i:!newVÎl:â	Å¸C%3*		-imf"= i,gwet -5)Êeloe1	(s		»	t(ig.w)l5Â8 >ÂvWaÏ i{ âI˝?
â	˘ãI˝
m-≠
.
I_’t∞˙ fUl#ta¨zh£Evµnt8!iÔdey(	({+			◊e”"|iJa=h,- _àI	âian§l•: |∫i3.…a~deq`hfd!t [,
	CvaLeu:†≤dMs.vqlee)	Y	Èˆ$( uKÈy/op§l*w>rAÏ˝us0&*!v¯)Û.G`uÂ?ns¶a,eesmedÁtË*)·[ä		te…CsH6valqe(=phie&v!luMS)§i§‰f\1(ª			ıaNash†gpmqgs!="¯xc'Ùaludqh):%â =-M
)Ithis._dsÈÁ7eb,`Bsv0Ç,!TveÓq- uHmsH +;	lTIIGkjpNoe∫ fucÙÏon(¥çvun|$†Èe‰mx°) {
âiÊ (!ppis<_ke˘SxidiÔG 6 !tqis.}oUÒesDdyff"y`{â8~a‚ ÛÈI`3(bù ;&	aÄ)Ë`~a,e"d4kCS.lalelds˚#9jdg8 ]$I°â6alpcf vHkc.~!Ï5e8È
I}Î		≠if (4`h≠s.Ô`pIols.LgnTE &!}(msjo∞tHi}3.v%mıes>}Engtj©$”-	AˆnJqRh÷AËuÂ†9!qh)C.vslees(dyndx 9äÖ	àuhX!s¯.6AÂes 5 ˝JY3.walwÂy
3	J		˝

It`%3&KerÌÛgÂB$"c*‰nge",$Âvenu($ıi aWh(	3MZ|Iú(")4ahıe:`fqˆ3ÙioN(0ngwV@cun†) ø!ÈV  arfımenˆs>l≈Ó'4© -
IItj	S~khviWÜS&vadΩA±}"|hiÒ._wrlDa'oValue($∂wwchuÂ`)≥CÙhas&_venreshTaÌue∏9+L			¯hI_._ali.e8(fulf,48"I9-
			ÛTtUrj2
	|

(MbeÊ$rv$\h!R˛_va*uU8©{)M$
Ùcnw≈c28uoCÙioo( inF}x¨†ogGGÈm%s ©0[-Iª~iˆ va,Û( 		oesV·mWur,	*+	ÎõG	òif ( `gueh~tÛ.|eoÁti , 5°5 -
)ˆdeR-e0eioÓszaºe!cS"ijUY"]Ö0 pjis,_t2Èl|ylfÜeÏtg§(je7VcL}ed)ª
â	âTzic™{˛e66ı4IVahemh	
		fhms/_#hiNgo,(nu\e-Hinl'x0i{	
	…ârçtw`^9
!*q- 	yb (tÁylenu3ÓmÁnohh ) ¢
	)i&!(™ >isArr){hirgwognvsÀ`\ 	!*†{Ä*	+D´vÂls  ˆh)s,oqfiõn{4ra.]eq;â	l4DVaÓudG!<"areyieol{€ @$\;•		foÛ ( i"9 z H < ˛y|sjminfu@; i`)=‡7 ) x		â	rqksK0k!›$,∞tÌisÆWqsim·lygNZalte  wTwe,5aWk y \b)?
H
	àıhqs._#h!n˜U∏ bÂ,O$0i 	;â	{*	iIÙhqs&ret"uqhVÒHuÂ,);	
π	y edcup{-*			IÈf ∏°v(is.OpdHÔn˘.v!|w}s0¶d lIic-obtIgÓ5Æya‹}ms.lE.gvi ) cÓâ		íeDıfo t`Èp.talu-{) yzfux 8;
I	C]"en1e kM
ã		Rev§bf0llqstalu'9+;	
	àuA			ºM	= m˝se {ä	Iva`trÆE¸©Kw/{˙aÌÒdah+?	
	}ä	},-[3evOpTion: ¶u~ctaon®ce{¨ &ah]Â,)∞{		“av‡)-âˆ9l eJ„<h† ±8ç*
Hhg†+¨.icAbr1o8 tiarØjpÂ+m.SnvaluiÒa-6)™z®YMvkeqLbN!Tl¿/ t;isj p|…Mfk-wqLues
le~'˜Ã3	iMJ		 %WidgaÛ.P‰o4op9pı.}cd6Ou∞ynnna2]hy8"dl;s, axÔuoe~tr0≠:M
gWÈdgx <∞;ey † kJ
	-cOo 2lkS1‰me§¢:M
H	i	!‰ )u!˝u%)0=M (				8lIskal`le≥,fRnÙQ2 !>aqrubtk)g/c5"¢#',bnıp8HäB(IUjL1~hiodmec.vuÂoˇmgLa˜3) 3}odstte-xlrlr≥`)9M	YMM	qhiÛ:ÈjNdle1¢{2ØpAtEr*,7Dms·bde+,ntsuÃ -ä			tÈYs.e^ÂmD[f.·Ù$Bhdq(‰ vi%disÒbl5%¢0©3N	…=&el{m$}
É	â		4Dmw&hs~enW{h6ÎtithR(†"d…sabnDd¢.»fClsc0-;
	ôâ4;j[∂EMaEuÓp-Ëeç\6eK|‡Ûs*°b˜i<ehsqpwÂp"&x;å
…		\MôI	bneÂk+MäaC„w "+pidf5AthmD"ª	
ù	T~y{/›dateCW_rπeouatyMn i;
â		)t®is.dmeÈfjt	M.rı-k∑eCÌAsc# suiowl)d|*≠l}˘rˇlvµÏ$5X5rÏad%r-farıigcj"°)	M©ï.A«h√hQss*`!uiΩ≥mXtdr-" ´ ƒLkÛ,mr!EnuIdih‡)	HA	vjhˆ._rÂeÚı3 aLue∏+;			†r≈A{?	
	„cu "vaqg`*
	I	th3*ìanam·TeG&f!Ø |rut
I)	dÍiÛ._2ev0eul^inÛE()?-	ââ	|hs¶^@h`
cd( nqlÏl(0k;		uiiC.ﬁaNimqr}OF+8&‰aws<-JÅ)â"wdcJ:
			Scse&(vcoeas"∫I	I‘hiq/Eji°aTeofn`= Xs=d+-JIIQ	4*i#Æ_r-vrıì,VaLıe.(;
Aâ	F/r`  i }¢4;≥ih<t`lr,mofth∫%m )=0 (• K-(			|Ë=w._cxEbggH(nmlh$$M'â;/äH	m"	âµhys.Nen+-KtfLFÊ -$da<wÂ:L,K)`|MEk˚	-
Iy,JZ+/+mvvÓel(TeMeG ~ettEp)/2ﬂ∑dl<e,- Rgt|ffs)vclse dRimmet%c9hmIn(`n max, aÏIgnÁd0#yA≤4Ùpä_v`lu%6!^ıdcTynfXS0xç
War`Ga` x thh~&p\MœDs>vDlu!;ä	MÊCÏ 5h∏iis._t*aeAhdoÌDu‹uc<av1J )Ipetad ◊@nø
)lçL+/	‚terÓaI4bal{gS0Áe|‹Èvé!o/`V`fqew™≠sÂÙurnr isreY kÊ†c`lu‰Ú"t~i-}gd,cy1lan†!n¿ ≈uhå `Ïignmd b} sÂpp	'/ KtÈlı5b aNteX†(ès-xurns@rhnBle$6`®Uuv˚I…mu4icymn†+~Ùai@,2A¨noÍ≈edy Útd8*	WWA,}esz fwNoTio.∏ i
tep<= ŒM
(vYb F·l .â vaËs¨
			i

	)if Ë „rc˝mlnvS*ÏEnGtH"( s	—tul0= yX‡7.Np|(~nsÆ^eh1ısU"lnfex ]´	LvQla='thisÆ/vvm1l-woRaÏı·("vl@/øJ			rg| slÑuc§;=a%l#e"o
	+/`ÆsLac«*a AˆÁkÙes!` Goq1(og"4:uajrqiMââ//ıhiÛ3bo8¯ #|Û"`vÈm≈edby,ii gnL ‡}x aÓt Ùhe.`RgwerzeAâ)äg·ls$Ω4uzysÔptMÔfsÆ6al!5s.clcce,(8ÌäÎop"( i†<08;§-0<$fady>ÔejEtaª0)â= q3{K+â	>e,s91e E"-ê%his*_t„xOElllmRadagj |·Hv[!	 ]48;	Z	)}
:			Úe4ı`o0gaÌs2JY}M		}, 
-
	´+ 2eqwns(qhg0st‰p-0m(Wˆ-b1r$hueh0*bD0vi|{ knmrmrrao,&jevweuŒ°xiDcluKim) mioajDdmqx
â_`siMGlhonValru*†&unsTmo.hdval )MÀi"*ò$“Qm$-"ud9.1.`lu≈Mi,(90)1z
		rÙqur~bthis.[qahΩqIif®+πOJIçl	È& x¨f!L2‡uiÌr.t·l%5Ayx()$)#z
	ââÚEvqsnh|iaSÆKˆaluuÕe≤ ©MY…y
vÈr ◊uE‡ =!∞UMqs*onÓnr*suex !0 ) ø`tHiÈn_0uAOo5ns4Âp!:(,*â		∂aLMndpeÈ =av`($.†thiÛ.OvAjueMkl(9-%`sp≈plI
	`ha'n÷√Ïtg0=(~¡L -afaLL+eSTl ;M
.	iˆ!<0Mep`&·bs(>`lEo$SÒdt© : ,><†qmr6© ç!)	Ìli.nB˝Mue K=(à ˛·-O`Auâr#>82 ) 12≥toq†∫ (†5Rt•s†9;
|

	)-+ÅÈnce†r`Fc3£ˆi3`$Èru 4rz‚l¡}s†wyuH(}q¬/m 'lo@t;,00oum4y	I>/¢t»e$fq~`dvaM’e Òn,µ0ie)ur ufuez(|`w´`eKmÌaa©vwan˜â`;me†s|127©Ç	ÚDtup‰†aa"se÷mgeu( admßfUklufæÕkFy9%dÿ") K8.	},*
	nrdeeMin* fencpi_}))p{8IrEÒurnath+s.orh)Ónw*eIn;u,
]doDÒEM°x gEfbÂIon(8 {
	pAfuv* tlmsÔpf`Ja?ieË;äu¸
	$
	O
dnrÌpyV!haev funct`m/8	 [
Iwa~ÄÏR!fug†= iÈov0ilr.v@+Áu.(Æ"u0t(Aw.oRdiΩms,	Åise|f"=!g≠as6âanÎ,˘pgd50†4gtl	S/a-ÈopmK˛f†+ ø`M.bnI	·Tg#> nqÂ{u-	é	(vi @e:w`¸U¨
	++^qa| 9"{}¥ââ	t·spZaN–i~˜enV-=
â	6lDOlD
		~iieÌi~l	
	Êa\weMÔy;L
		k«"b`4H´s.Ùinng.S¿¸ıns 6¶ thY≥èo DÈkn}.|a¨}uqjlÂoa¸h$) {Ö<his.H`n‡luqN=a{kxfa>CtiOo( Il J (k	I6aËQ·ˆbdnt`= 9·qÂh&v!uOrhi-!G$wÖf/_%ahU°Mioz±   -&®(weLf._‡°lÂeAa}() - ≥Õm¶/O1‹ecM˚Ó8i1- "!00æ	)Oce6[§{e-Ê*kvhpl≤≈tio~ =uΩ!®grznÍt‡|" =%"hegêa 8`b"ﬂttGm*  /#v)kpÂraÂ.|‡,da*;
	 4 `Thhs")*Wp&Òh&1®"! -Kbafilq~E
?@`qn}ga4eÇ(: #su2Í0UÍ$ﬂsaÏtg>aF	ßhta†	>MJ	xd1hns≈hf(fptkaÓs&~!ÓgmR}}\ tpef ) ±MI	hÈTT) ?a&,jrs%oÙa|aon ==5 'iÔ‚I~ogf`m"®	„J		YIlf‚h$˝ƒ≠˝= 8  †wLâIa	(Ûe|v&zsfÁe*sp'Ù8 ±, = 9[®cnj)euu$? "anm,Äze :°"!CQ"‡U© z(heft:vaËCdbsgnp 2 "!"0}0/,qn)…ate!)9ç		
					È$"fY =Ω5$1((˚
I			ICS·lp*rılgm€ c~iMeta:/†¢ajiipue :""sss"‡Õ(£{ wiBvh>  †pedPdRoeotp) ¨aw0^alRfkrEn|†9¢*!¢%" ,{1wÂui:dBALq‰( dyÚAtÈ/|“!n.akh}a4m ]!99™			â]*		à}"Ul;e _MI		kf%2 a°==9x† K)		 	O	IwehuÆ „FGE.S¥oP( 3(hq)#jÈ-Ite†2#`,im·de#%81"k6sÉÄ}:0{ bod4Om:†8®r!,RRcent ) *∞"ec$=.¢am˘mqˆe ;à		]Ö	9			if Æ i†,=, 1`©!*=
	KÙ‰}F.# lgc[2!NqÌm&%8?	l¶™iOae≤"2 pA{s3ù'$k*¯Ai'dP: !†vaTPea„en4ê%0|%ttalXg2seng1)†©4#°0}, z(ÒeTug9$%al{u·Utcvkog> m.cN•}Ive ˝%Ì;]ä			ã\
	+â´]		âYq	©`actV%lB•rkegp= tanT%Ú#u~t(			-MÇ	) E$sÛ {I(i9vol}u%m`thË.~!dAEhπ?
	çˆ!Ïuemm˛! $(Ìı>OTawqdÕkjâ(˝@		ˆ`l}gMax!<0p
πSWÜ!lmu|‡P"i;)
)âh◊g,tÊ≤ce~¢ya"†vybudia| !} ˆrd}gMin)d9		,rvanes - VaÏdgMyN∂)/ (-sen]ÂMa($-†7%|uwM).(!1k$;0 9	I	09M 			_Qq|È;sGoŒOÚaen4atieÓ =5()"lœr)ÍnfqalÓ6>¬&l-Ft‚ ∫"&b74|me.`ﬂ"9 6Îld3uJu *iÎ%∫;+¨!ThIs&xan$lcbsdK4("sF1-[a·Oim„te ∫ "a.aÌade" (Çcs"]j%_;E<,$m.an)ÌatA)MK	â(%a*l+RqÍwe =æø 2mIN# $&"mhkq&r…%N~uÚio*†1=1 ÇhOÚ("gzxa  Î {
à!	dihwJoa#w`.s4Op((ª9"ëê©[ ‰>amax%®v"&onimi4e""8 k33" h ˇ wygÙj:†q`nerCÂt ) "-2!}( Ôlj;Ìe|„ +{Eâi	|	
A`†("oRq.vm09ù "mcx# . jIsng{)jÙÈpiJÓ -(hfrmZsn‘ÈÏh()kçÖ
Éumis,vaeÊ[ aNima¯ o(¢ak˘mipe2 z 2cy≥"†Y(?Ëul4‰i (0108†Â$tc`PERcE>d   #"*4†u‰8c g5etex0jetsg≠(tUvEtiÔnz oqOikstd}†I¯		K	à	Ôf (íDRa~e% ≥==È mxlk$& taÈ´>OÚIaju!2in0Ω9;$"∆Urtioam*Ë9dk™Iyƒiis.r‰ngEkÛtop* ≥H)1 mK Pni}K,Â8®a~@iate"0´9†Áss* \("{dhdi£`T:"∂a.P-zag|t &5b‡}<†f*AnÈ}Â|a"iª
	J|	iv*(%ÔPan'u®==5 "/!x%&&!|ÏicÔOzmdn4a∞im.`-}!#verva+ClÚ - {
		KgJal2i*g![ pni-"tÂ ? 
ifkm·te.†: ≤ss"!_{!k hcdh\~1, ?:0)- vÒ)erceÓ‰x)¢+"$& },8jiqutTÂ~)dÈn”‰Ïpe42exIÔn:%n*dnÈ%atÂ®y 	?M=
˝	
*98Ä˝J|9†è
$?ÂxtÛnd( $.uHfsdidÙr, sM	veq3…nn: "7,:n22 5+-)≥
	
›òbQuer}(9=â
(fu/cpigl*`Ñ< uo‰e~mlg¸2)†{
O˛Ab(`lbIÏ$} v<
	d®spIh% 2ø	®]fuocAioN eetLexttab˘u,) s
ÚE¸uˆ~!!'vÂhÿ§+
|(	Á5ÎBDIo~!'bÙN•l\NictYÙ)5S9(ÈrgdusN"+btk{fId+=

dÓW©`g%tà 37)>Fa`3*, 
Ä*|liÓnr*({-
	aƒz+ nuld9
		a+axGPt≠ofsx NSHd>
#acz%> 'else.
g_ocae8°?udln *8Á^g* ˝ Â˙ryZuQ≤`78 4!Ù|: '/%,ΩdsÏ%in8`'z5uerx>gO}+$ rÒ+era: tvuÂ,}èO
#/l‹iys-r»Â.†Eal≥el
òÌiwqjh÷rÓud|,àô	‰g:abhÂm:`K,*	%o„‚,e8 Ó5ll-
Iqvev4∫§Slhcj",	àf4:!~t$|l"/Øpe.g~"c†xd°fz¸:°'dÆoeÏd?¨aˇP!Ghm˘:"'ıoog`e'§ du2`5Èoo6 001 l	MFPzÂdix9f"u·≠ˆiro/"≠b	Ëo@g;bnt}l<M
		1i/ulTdmL`te:	 <Èvø<`i6 -
©“`}Ov%:0Jı<ll
	emgcr:`nul)8-I	shg˜: nuh}¨=
IrpÈf.ev: <`mvn`daoG6a,;1?<-fØ>"	t·b◊emPlaue{ &æli>=Â`hrqg=/3YËrgv_c6<span+[l "el<%3pA|<º&a>Ω+Ë;>&Mä}$
 _brec<!z‡fµtcd	o£(†{…		umiwÆWÙabif9(†t3ue4¨<à] 	]w‰vˇp|if~*¢fµÓStQon( c„y.`gcm5e ) }I+in )ËO%y(=<! 1dld≥¥m$"h´§"	(Mf`(Ùxi≈>cpt·oƒc/k?lLeh3kBla!$Ê wC-Â% =}ylh[gÆm|diŒ6mseldsud0°!⁄-JJç	pe¥Uv~˙
		{Å	¥jIs¨√GÏe#u(0value );M		} ele ÕäIviys*opudo.sZ"cvq$‘$= v1mıe{			∞yiw.¯!jhG{(9πJ(	}	¬!llÇ
_tAb_f;!z}oÉtÈÔo+``bπ/_-
)	jeuwvl`ajvhtÊe!(8≈*DÈt|E.r%pHa„-h o\s+G,!>!∞).‹Âpl`au)†[_U˜|t0&c2≠uFBGF-∑mg,0"  0 ~|
	Ù(hk.ÌÙkonS&idPzunil(+ nepLAx<UajIdÈ)-	},äâ_sanIˆh~ÂQ%lactÎr:&ıfcıaon®"hC{xBy0câ/! ~e∏~eee0Ù`…≤"bÙB`a≥n ‡f`kd!Mey$„ÓÙaxn1h»"∫!
	 bettrjÄxa3hpe`ly#e†0/+Øg, 2\\{+ )#	y,-å
ã_gkoki1
 ÊµnA~jon™)0{ä		vbb c´ogme®- tias/"nh{)f |rEIçi™ ‘hI3.„OoKiu!= thisÆÁp‰ions.√+iyd.*amg`ˇ< &ui-¥abc- $¨keÙFexuDes|…(Ò$I;	rEVerj(%,b.gÎia>AuxL{®ph5Dhn†[ cwoo+eq_(b/Ë`!¸,†.Õakm¡Brcqh kRgum4fÙ{ ) ) a?]J-,

â_ui* ßunÁ|)Ôl†$ab) pane| )0zàI	rg4ısÓ4ø#		dcB:)t`d-
©	% n•f> p#nÂlli~Âe`8¢tx?snalajÁÚU.I~D$h( tob -ä	=8U4J
	Wc,e!l}p*`f}ÔctiÔn(ã`k]
!…/ØpvEst/ve aŒl &Ori'p0jO!di.'02†bR†|ebulSçéd8is.Ïys.d,nt}+!2.u).Qta4aprKceÛ3kfw´ h
)	.rfmg~eCH ssÏ0"aIΩRp·vÂlwzgCebsËNd"ª
ô.&Inf(yB#tanzËCt·®fanu,/udbs()*	*e5Úh @ımcvÈgl+!j{ç(	)ves(gh5±D™ $lyw!);	K	…	el(pli!el.dhfa0 &labeL7tacr  )"+:b$ÌJwuDads  f¸·Bel*%@cS/);
		u-;	
}(
M
 _ˆ¡‡ir9>(funbthÁn® ynit"ÈdZ-J	Kvar ÛelnÄ=§u)iq,-ãÈi/ = thcs.npthons¨Jâ	frAN-eNt f /i/^a.$'†'*.”aÍ)rm ∑ ˆehoSd{!7#/ fœ"a.8e]1Ñ}0XaÛ»
	tik{.Lisv =0¸h)w.eÏal%ot/&iQe∏ /,,ql" )Ue)\0 -8
		txib.lis¢=$&(!£).0lh˙LÒ3(qSisav_-b<'uhj3.,is4 ®=Txi?.·ocho2{§-$4hacØokÛnla`V|Œctik~ y!_»
ù	ÚDt—rk ( *a¢: ¯`hs )[§0f_ô	wi;
	tÏis&pi|ml3 <!$® ˚V5);;
	œd()aèaNbhkbsŒ%eCayGw>cu0MJ: i,,!!1†yIçva6`d2ef ùa$$:d )ÜavPrh "irun¢;Å	?/1Fos$¸\nAeag!|d†cjeadel H‘Ml`|~k=àKknwaiÓq$Q$h·w],·{¿irmc#HE |h∏0dxpa~dc-âK/&s]cl‡x˙ev§o†ujÁ0*}hl°8eÁg0e2hVath (ash akf ÙhEÓmkfˆefızetb te""!{ Ajax6M+	ho'!ìa}Â(c}nao‰ur‚vkÔj a`xLis WÔr aL(a‡oed(taf w}tËta†fCigi%nÙ0iden kˆiaÙ	*?'`smŒceaKlrˇ-ÉdvigetÓtxdenpiGsÂr} `[es ıhe\pEcp5$i ˙oV2m)t◊(.ç
		// Wus ~o"malÈxd§hsın¢attz	bute&n
vaz hÚ%fB`ue0="jrcfNclit)(&#‚ %S`D]%L
»	MbaseMLª 		on)( h≤dFBas% &G )%nÚdBpQÂ %M/ hlc!ri'fn¸oSuziŒk  *1p\hx, "##$9{0! ]}}%
ã	
â)‚ap·Ad < $( asar )⁄"x ZI &l&ybQ«FÂWd§=4)$jejEElzrif I"© {		A	)r·f (e.hish;	)
anh2mf†?0,zeb;û	â	}
å		Yoø ˘Nn)ne ra‚˝
	A )Ê ( „S`ÁoentIf4.ët) hreb<´@)Èj	
)	qm,F.cned≥ < ce¨¶.xbll„)edÈ&celdÆ$l%ten:f¯n†i(#edf>^Ûq.k|i:g$\ec4O b xbeÓ¥! ))ÀKØ# p%mo|o tAb
	…+Øp6dv!Kt i*I@´n' thl"zafi,its,‰ i6(h≤Áf ·3 *5yt"&k$
â	_!eÏsd )f1a hreF0¢&`xrEÊ*a==†£b 9 ˘k				/?‡qD!s)‡Âd &kr&rıstra"oldeqqryI*	I$.tATcÆ %,®2¸2m.fte‰ab( ËSef@/yéJ)		ØØ T_dN kot)i !380ò$iw‰ ihe‡DrtVippdvan≠ÂNt  ƒentibh`v o≥od$t2lç2			/ (\(&aiOs(xN ,oqf,frÓL s}cË$5fli
	Y1	,.4ata© `$∫2,/AdcBs- brÂg>rÊ2laËg(-3..$o,xÇ" - a;äâ		ver rÊ -(cmlno]tgíIf( ·â:Zâ	aØh2ßf 8`*#"!&id;
			~an$&|qo·¯$Ÿ qÂmb.DlMÔıOt_jA~d® "+¢ K id ;=
		 f !D`q Â®ÆNEn'dh†)!ç	Y	 Ëab5d 9 $((O?@].µiUe,ulauÂ ©		,	*Hd\r® ‚)d", id†)
	 		.qddÅ|)1sl$#oKde"q©@AneH%wi6iFOev-Soj`ehr`ua-gˇ„jEr=boup.i"d)≈ã	ôâ	9nsdzdPFter( 3eÏf&pAkq,s€i`Â 1 } xx∞{Ghgn|hqt )9É	I§pynı$≠$Eta(4*dEtfny>|ibÛ	\†>pue"=:
	Åÿ}ä	)Ufl`.u!nels =Äse4v.`bne<r.Ee‰* pinul ){ç
		o/1hŒv!Ãid Paf0`ÚÂ~M		}@gfsa"˚
•	ôm>tis·c,Âdût1—h¨ h );
		˝-	m=9	à!-!jjylim|izA|YÌ~@&zÔ8*sfc tchçJh&   y~It )"~
	+è q¸t`„x j%ctgserybsr·sse!fmr!stY`ing™	ëuhÈ2™)Lm≠aÏÙoKddÏqsÛi!wI/t!‚s uy-uhdee¥,uIwiduitçnondm^t%QÛ)cornAb)ell" i;*		4(icNlist.ÈddCfqÛrä ¶u)%ucrsfav wi?hÂl%R˝¶esAu(sh-H≈D∞%t-s,e·rdixd5i-wÎdÁet=†·alep†ıçk2~ı˛-aLo$†);M*)I	tËYS.lIc>a$dS}iÛs †Ui,s‰b4amladauL|$tAgorndj=4ox¢ ·ªzx9ucjefÛº`l‡,qsc¨ "ui-v—‡1-`an·a uÈ-omdg•l-conte&T(uicoxÔmr≠soxtn	¢0©{B	
	I	-*SlMcdee0l!f	
-π/-#wÛ% &rılOwvej""ÔP<inÍH/v T˙± to r!trke6g!ä	/≤4.‰frof∞v¢cf≠enp iue~+Vie kn%urlë		'/B2,&dRoe"CooÎa*â	â? ;/†Árom!re˘'gÙed kDa_:!¿TtÚIf4da kl$<hi.
		• *aj.Òeltcded!9æ- 5.fcvËn%D(	†{ä	 iffj l~S·|iooh‡sH  z-
	 	pÈCasLoSs>%!k‡(4qnatinÔ8 {<``&-`{OMÈf *°a&x·£` =u$,Óct)/l.xqwx(!`k	J	IâÀâo,s&eaqtÒd†= l;:	MÌ	r%tq6Ó f`m˜È;ó-IIâ˝
…});
	ã	çm
		ig0804âT’OF }.s‰ltcÙ1d‡ 5=!fÓu-rMR¢x&& o~cGc?È%$)1:(…		0	o.rfÏÂqre& =0`!rsdInv(†wylb_cOIisei-å 1x+;âãçy
	IÁ ((yyEf nÆgÊlecFed! 9? bFTÌbe2" o& tËi5„m≠{æµË|tep(4∞.Ui-tabz)gÓes|Ed"!9.lÁNwd_ o0[ç
)		IowEÌE„Ùe`=`thxs,iSjidƒmx( whic.d‚>&kN|g“) ".wy-t„s,Ûele#<%t`Ë+ª
	A¸))		}/Æsajlkte‰ Ω Ø+stÏ%kÙe, |V (Vii3>,i9.lej£rh )i2(ö0-5!)j		y else(i∆h8(o.ÛeÏucD4†=5Ω *ÂlÍ ià // msege(Áf n¥Dl iw"d·urgca‘c$, ‘o@O SeEˆe lane~u rcÏuap5 	 	JÓsi}g·uAd"} -3{
	I}âNÅ9â./`rinmty che#´A/,$cfgpl|(êOfi~{t rabÊ,™)!d>seLeCÙou!5 ~a( o/3eÏukÙÂe ?-"0 & 0¯ÌÛÏA!HOtÚK o<'el%ctelÕ +(yx$j™{ULegded≤†0 !≈		)?†g'sELeitefJ… 		:d0?NÇMJI-	/≠1Tak·0Dgsafh)Jg(t!br sih(kl|·c ·P|ri*ıt„fRo#HdN
II/´$knpo /kcoÂ˛t Am‰ wpdate¿o1pioo ‡rM¯erl],.Äâ	-. @†wmlekˆÂÁ!p¡f #Ao*mt bec.•d$dh3abhmD.ç
	J.`is·beeD ºægnii¥e®`k.dipkÍHE‡ÆGo}ck®
y		`&-ip8"Thic&l(b>f)luE* ™#uÈ•st·tE∆Œs·b.ed6 -D b]ÓCt)On( f§ )0!4˚(	reÙus^ qel&Æ§is¨iNlg8%†<t(?	©	y)	Iã) y.Ûort();		çÉIIif   lhlEsÛ`Ìj(o.6ufeaDÁ`.0o.dl3„blet#)$	5(=50)ˇ-Íô		âK&‰h{AdLÁÂnsr}ÈIe® $j®naSi˘® o{„lebtddà o.f9kaR^dd¶0, "-9
		!|J J9	 )/ Èi'hmkohdaCÖÏÂc6ad tLz
Kwj)ÎÆ—`wÂd:.qf‚enIsS( ·ui-pab[-ti|ı2 (8ô	ÙhÎz$l(˚.r%`kFOlas£(*sI=dcbs%qeedcre, wh%s5atm-aCÙ)vm≤P©3()// bhegi ‚Ôr`,%~gt~0cZgyd≥ e÷Rb ejfl km7ignzxiod(!È1q"lk[t
1I˝F`  n.wdlm#6Al0π§4&d piiu.inHoJsÏllng∞h /1r)
I…!3eÏb.eoaag.¥6&ie*"|e|f&_satiukjgS§hg„to`( ¡emÓ>!niËop”K moselfaREL"]nh!sh(  )Æremø~eC(„Rs(b"5y/wabÛØÈydgπ9			txis.lIrn}u( o.3eLÂgde$ =>IdtM<acc( uÈ-xejs-ıelub4d` e	-sv·de-eBtiVe" =#ä		|/ se%m1 toB"gPmx˝Bdc¸"rekevKor th…t he∞rhow „Aå¨bcbk i{0dËrgd			ÛeÏv>Âteeu~.◊wgu%$ bpabs", f’Lc¥)on(© {Lc à		sglf.]t“hogu2h$"sj˜b&(~}li8E"	â*mcgldn[5a  u•lg/qnChop~[ ¨sÂ|icXe$ ]Ï2we|b,%nÂmi~T.fhÔl( saÏfØ◊sAnitihÌWeLEc¸or( sm@f>al„hgpsK?K&≥Alc!Èl"]Iqq¸ +p+S™ { i)!			0}	_	Z
I	|iIcæoome(-&s=ÏdfpÂh`â
â+	H			Æˇrfmeaj`5|0u/0avo˘f(mmm+≤= xEaks&i.0#e2diaj ~ersyoos@™f i 6ç
	//$êDN: nclepaAe txHc e?}n$
ôH$(*wÈndo7†k.*H.0(†<qæ.Ô@2(b√µÍqtienH([	l	 		s%"&&his.`|d©"3a∏‚Æajs|ˇÛS •,tnBiÓ` ".<abu* !-,	K	sm(d.h9s ] sej#.aehor≥ } 3•v&r`nalsa<#nuul3	*H+	˘)+É!M// uL`tE(ymhMctdl†abıl20hbd/relo~fç
çâ} eÏ3% ~
à	âÌ2ghEcpeˆ$/ 4¥ÈS.ÌiÛ.indu~  thy∫.Li‚(t/`uwb "/~˘Lqqvr-sd~ebgÕDFd-i)1M		<-
	/ü`uËFatacCohÏ‡˜i‚ÏMÆ
	?`UwEK:Aqauà(DogoleSla6≥‹!(		xas>ee`}end[ o*eomna@sÍe,e"~(2qƒdFtDss#p* ""omnnaClA1s2X, "}i-4!Rscnf~!`rI∆le"`π?	M
!)./(_Et`Ór `p≈Atagonom·"af<eZ#iji4)Dn‰‰p‰d'˚d-fvm!rurp-!Ùifemx	ib"¨ o*!/ky%4) ˚äüt`·s?ooCa~0)-.RunacTaFn0gcOoHÌÂ09	}ä-â	8'ns3ble+Ù1‚bNJ(ÖÔov") ‘!‚°)(m 0ƒ Ji:,( li0=@d`i2(|y[s1h M )$a*;0) â$ lI •” $Ómn¡r?)y<†i, o.Ñi}bl}@ )É) m12&&		//(UODm8†use ¶tÔgbn[L·3Ûh)
		 o( lx i/IaC„lat{®3wy-ºAcr,#ameatMf≤ ´ ~""sdLÀnA;sb2! xgmo6EÛI·s3f ^( !ui-k}!t%ldmsab(ef"H);-*I}-*
)ç+/®rwsÌt aecpe!mf óvÌq`Îhf∆ g≤mm!fCEz·$ to Êt†c„ch$tähF$(h}iK1cÏ≠(}-](K~su  jä		thM{ÆansHmÚAÏÚ•Ìmte@ata* !c`q`g.va‡v  aøj	uöIY-/ j%/ÔtE C¸Ï hadÃ%"ceFgru: uÒ`If˚ e!~"r!Ó"o.$eqi2Diæß0pabs†Aetep 'd"nr0np6hÁn ch!.'5
â4|ic$Ïi{fafÂ8 dhms/@&bH-r≥0).uÊ"indmao$sj;#  *	jE´+"0( /iEÙÂnt&$9 bmguqÌÔ˛er"` {Ö
		v@r!`et”ˆa}@ duncpion("pa‘e,!el ) {
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
