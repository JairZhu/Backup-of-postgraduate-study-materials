/*!
 * Modernizr v2.5.3
 * www.modernizr.com
 *
 * Copyright (c) Faruk Ates, Paul Irish, Alex Sexton
 * Available under the BSD and MIT licenses: www.modernizr.com/license/
 */

/*
 * Modernizr tests which native CSS3 and HTML5 features are available in
 * the current UA and makes the results available to you in two ways:
 * as properties on a global Modernizr object, and as classes on the
 * <html> element. This information allows you to progressively enhance
 * your pages with a granular level of control over the experience.
 *
 * Modernizr has an optional (not included) conditional resource loader
 * called Modernizr.load(), based on Yepnope.js (yepnopejs.com).
 * To get a build that includes Modernizr.load(), as well as choosing
 * which tests to include, go to www.modernizr.com/download/
 *
 * Authors        Faruk Ates, Paul Irish, Alex Sexton
 * Contributors   Ryan Seddon, Ben Alman
 */

window.Modernizr = (function( window, document, undefined ) {

    var version = '2.5.3',

    Modernizr = {},
    
    // option for enabling the HTML classes to be added
    enableClasses = true,

    docElement = document.documentElement,

    /**
     * Create our "modernizr" element that we do most feature tests on.
     */
    mod = 'modernizr',
    modElem = document.createElement(mod),
    mStyle = modElem.style,

    /**
     * Create the input element for various Web Forms feature tests.
     */
    inputElem = document.createElement('input'),

    smile = ':)',

    toString = {}.toString,

    // List of property values to set for css tests. See ticket #21
    prefixes = ' -webkit- -moz- -o- -ms- '.split(' '),

    // Following spec is to expose vendor-specific style properties as:
    //   elem.style.WebkitBorderRadius
    // and the following would be incorrect:
    //   elem.style.webkitBorderRadius

    // Webkit ghosts their properties in lowercase but Opera & Moz do not.
    // Microsoft uses a lowercase `ms` instead of the correct `Ms` in IE8+
    //   erik.eae.net/archives/2008/03/10/21.48.10/

    // More here: github.com/Modernizr/Modernizr/issues/issue/21
    omPrefixes = 'Webkit Moz O ms',

    cssomPrefixes = omPrefixes.split(' '),

    domPrefixes = omPrefixes.toLowerCase().split(' '),

    ns = {'svg': 'http://www.w3.org/2000/svg'},

    tests = {},
    inputs = {},
    attrs = {},

    classes = [],

    slice = classes.slice,

    featureName, // used in testing loop


    // Inject element with style element and some CSS rules
    injectElementWithStyles = function( rule, callback, nodes, testnames ) {

      var style, ret, node,
          div = document.createElement('div'),
          // After page load injecting a fake body doesn't work so check if body exists
          body = document.body, 
          // IE6 and 7 won't return offsetWidth or offsetHeight unless it's in the body element, so we fake it.
          fakeBody = body ? body : document.createElement('body');

      if ( parseInt(nodes, 10) ) {
          // In order not to give false positives we create a node for each test
          // This also allows the method to scale for unspecified uses
          while ( nodes-- ) {
              node = document.createElement('div');
              node.id = testnames ? testnames[nodes] : mod + (nodes + 1);
              div.appendChild(node);
          }
      }

      // <style> elements in IE6-9 are considered 'NoScope' elements and therefore will be removed
      // when injected with innerHTML. To get around this you need to prepend the 'NoScope' element
      // with a 'scoped' element, in our case the soft-hyphen entity as it won't mess with our measurements.
      // msdn.microsoft.com/en-us/library/ms533897%28VS.85%29.aspx
      // Documents served as xml will throw if using &shy; so use xml friendly encoded version. See issue #277
      style = ['&#173;','<style>', rule, '</style>'].join('');
      div.id = mod;
      // IE6 will false positive on some tests due to the style element inside the test div somehow interfering offsetHeight, so insert it into body or fakebody.
      // Opera will act all quirky when injecting elements in documentElement when page is served as xml, needs fakebody too. #270
      fakeBody.innerHTML += style;
      fakeBody.appendChild(div);
      if(!body){
          //avoid crashing IE8, if background image is used
          fakeBody.style.background = "";
          docElement.appendChild(fakeBody);
      }

      ret = callback(div, rule);
      // If this is done after page load we don't want to remove the body so check if body exists
      !body ? fakeBody.parentNode.removeChild(fakeBody) : div.parentNode.removeChild(div);

      return !!ret;

    },


    // adapted from matchMedia polyfill
    // by Scott Jehl and Paul Irish
    // gist.github.com/786768
    testMediaQuery = function( mq ) {

      var matchMedia = window.matchMedia || window.msMatchMedia;
      if ( matchMedia ) {
        return matchMedia(mq).matches;
      }

      var bool;

      injectElementWithStyles('@media ' + mq + ' { #' + mod + ' { position: absolute; } }', function( node ) {
        bool = (window.getComputedStyle ?
                  getComputedStyle(node, null) :
                  node.currentStyle)['position'] == 'absolute';
      });

      return bool;

     },


    /**
      * isEventSupported determines if a given element supports the given event
      * function from yura.thinkweb2.com/isEventSupported/
      */
    isEventSupported = (function() {

      var TAGNAMES = {
        'select': 'input', 'change': 'input',
        'submit': 'form', 'reset': 'form',
        'error': 'img', 'load': 'img', 'abort': 'img'
      };

      function isEventSupported( eventName, element ) {

        element = element || document.createElement(TAGNAMES[eventName] || 'div');
        eventName = 'on' + eventName;

        // When using `setAttribute`, IE skips "unload", WebKit skips "unload" and "resize", whereas `in` "catches" those
        var isSupported = eventName in element;

        if ( !isSupported ) {
          // If it has no `setAttribute` (i.e. doesn't implement Node interface), try generic element
          if ( !element.setAttribute ) {
            element = document.createElement('div');
          }
          if ( element.setAttribute && element.removeAttribute ) {
            element.setAttribute(eventName, '');
            isSupported = is(element[eventName], 'function');

            // If property was created, "remove it" (by setting value to `undefined`)
            if ( !is(element[eventName], 'undefined') ) {
              element[eventName] = undefined;
            }
            element.removeAttribute(eventName);
          }
        }

        element = null;
        return isSupported;
      }
      return isEventSupported;
    })();

    // hasOwnProperty shim by kangax needed for Safari 2.0 support
    var _hasOwnProperty = ({}).hasOwnProperty, hasOwnProperty;
    if ( !is(_hasOwnProperty, 'undefined') && !is(_hasOwnProperty.call, 'undefined') ) {
      hasOwnProperty = function (object, property) {
        return _hasOwnProperty.call(object, property);
      };
    }
    else {
      hasOwnProperty = function (object, property) { /* yes, this can give false positives/negatives, but most of the time we don't care about those */
        return ((property in object) && is(object.constructor.prototype[property], 'undefined'));
      };
    }

    // Taken from ES5-shim https://github.com/kriskowal/es5-shim/blob/master/es5-shim.js
    // ES-5 15.3.4.5
    // http://es5.github.com/#x15.3.4.5

    if (!Function.prototype.bind) {
      
      Function.prototype.bind = function bind(that) {
        
        var target = this;
        
        if (typeof target != "function") {
            throw new TypeError();
        }
        
        var args = slice.call(arguments, 1),
            bound = function () {

            if (this instanceof bound) {
              
              var F = function(){};
              F.prototype = target.prototype;
              var self = new F;

              var result = target.apply(
                  self,
                  args.concat(slice.call(arguments))
              );
              if (Object(result) === result) {
                  return result;
              }
              return self;

            } else {
              
              return target.apply(
                  that,
                  args.concat(slice.call(arguments))
              );

            }

        };
        
        return bound;
      };
    }

    /**
     * setCss applies given styles to the Modernizr DOM node.
     */
    function setCss( str ) {
        mStyle.cssText = str;
    }

    /**
     * setCssAll extrapolates all vendor-specific css strings.
     */
    function setCssAll( str1, str2 ) {
        return setCss(prefixes.join(str1 + ';') + ( str2 || '' ));
    }

    /**
     * is returns a boolean for if typeof obj is exactly type.
     */
    function is( obj, type ) {
        return typeof obj === type;
    }

    /**
     * contains returns a boolean for if substr is found within str.
     */
    function contains( str, substr ) {
        return !!~('' + str).indexOf(substr);
    }

    /**
     * testProps is a generic CSS / DOM property test; if a browser supports
     *   a certain property, it won't return undefined for it.
     *   A supported CSS property returns empty string when its not yet set.
     */
    function testProps( props, prefixed ) {
        for ( var i in props ) {
            if ( mStyle[ props[i] ] !== undefined ) {
                return prefixed == 'pfx' ? props[i] : true;
            }
        }
        return false;
    }

    /**
     * testDOMProps is a generic DOM property test; if a browser supports
     *   a certain property, it won't return undefined for it.
     */
    function testDOMProps( props, obj, elem ) {
        for ( var i in props ) {
            var item = obj[props[i]];
            if ( item !== undefined) {

                // return the property name as a string
                if (elem === false) return props[i];

                // let's bind a function
                if (is(item, 'function')){
                  // default to autobind unless override
                  return item.bind(elem || obj);
                }
                
                // return the unbound function or obj or value
                return item;
            }
        }
        return false;
    }

    /**
     * testPropsAll tests a list of DOM properties we want to check against.
     *   We specify literally ALL possible (known and/or likely) properties on
     *   the element including the non-vendor prefixed one, for forward-
     *   compatibility.
     */
    function testPropsAll( prop, prefixed, elem ) {

        var ucProp  = prop.charAt(0).toUpperCase() + prop.substr(1),
            props   = (prop + ' ' + cssomPrefixes.join(ucProp + ' ') + ucProp).split(' ');

        // did they call .prefixed('boxSizing') or are we just testing a prop?
        if(is(prefixed, "string") || is(prefixed, "undefined")) {
          return testProps(props, prefixed);

        // otherwise, they called .prefixed('requestAnimationFrame', window[, elem])
        } else {
          props = (prop + ' ' + (domPrefixes).join(ucProp + ' ') + ucProp).split(' ');
          return testDOMProps(props, prefixed, elem);
        }
    }

    /**
     * testBundle tests a list of CSS features that require element and style injection.
     *   By bundling them together we can reduce the need to touch the DOM multiple times.
     */
    /*>>testBundle*/
    var testBundle = (function( styles, tests ) {
        var style = styles.join(''),
            len = tests.length;

        injectElementWithStyles(style, function( node, rule ) {
            var style = document.styleSheets[document.styleSheets.length - 1],
                // IE8 will bork if you create a custom build that excludes both fontface and generatedcontent tests.
                // So we check for cssRules and that there is a rule available
                // More here: github.com/Modernizr/Modernizr/issues/288 & github.com/Modernizr/Modernizr/issues/293
                cssText = style ? (style.cssRules && style.cssRules[0] ? style.cssRules[0].cssText : style.cssText || '') : '',
                children = node.childNodes, hash = {};

            while ( len-- ) {
                hash[children[len].id] = children[len];
            }

             /*>>touch*/          Modernizr['touch'] = ('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch || (hash['touch'] && hash['touch'].offsetTop) === 9; /*>>touch*/
            /*>>csstransforms3d*/ Modernizr['csstransforms3d'] = (hash['csstransforms3d'] && hash['csstransforms3d'].offsetLeft) === 9 && hash['csstransforms3d'].offsetHeight === 3;          /*>>csstransforms3d*/
            /*>>generatedcontent*/Modernizr['generatedcontent'] = (hash['generatedcontent'] && hash['generatedcontent'].offsetHeight) >= 1;       /*>>generatedcontent*/
            /*>>fontface*/        Modernizr['fontface'] = /src/i.test(cssText) &&
                                                                  cssText.indexOf(rule.split(' ')[0]) === 0;        /*>>fontface*/
        }, len, tests);

    })([
        // Pass in styles to be injected into document
        /*>>fontface*/        '@font-face {font-family:"font";src:url("https://")}'         /*>>fontface*/
        
        /*>>touch*/           ,['@media (',prefixes.join('touch-enabled),('),mod,')',
                                '{#touch{top:9px;position:absolute}}'].join('')           /*>>touch*/
                                
        /*>>csstransforms3d*/ ,['@media (',prefixes.join('transform-3d),('),mod,')',
                                '{#csstransforms3d{left:9px;position:absolute;height:3px;}}'].join('')/*>>csstransforms3d*/
                                
        /*>>generatedcontent*/,['#generatedcontent:after{content:"',smile,'";visibility:hidden}'].join('')  /*>>generatedcontent*/
    ],
      [
        /*>>fontface*/        'fontface'          /*>>fontface*/
        /*>>touch*/           ,'touch'            /*>>touch*/
        /*>>csstransforms3d*/ ,'csstransforms3d'  /*>>csstransforms3d*/
        /*>>generatedcontent*/,'generatedcontent' /*>>generatedcontent*/
        
    ]);/*>>testBundle*/


    /**
     * Tests
     * -----
     */

    // The *new* flexbox
    // dev.w3.org/csswg/css3-flexbox

    tests['flexbox'] = function() {
      return testPropsAll('flexOrder');
    };

    // The *old* flexbox
    // www.w3.org/TR/2009/WD-css3-flexbox-20090723/

    tests['flexbox-legacy'] = function() {
        return testPropsAll('boxDirection');
    };

    // On the S60 and BB Storm, getContext exists, but always returns undefined
    // so we actually have to call getContext() to verify
    // github.com/Modernizr/Modernizr/issues/issue/97/

    tests['canvas'] = function() {
        var elem = document.createElement('canvas');
        return !!(elem.getContext && elem.getContext('2d'));
    };

    tests['canvastext'] = function() {
        return !!(Modernizr['canvas'] && is(document.createElement('canvas').getContext('2d').fillText, 'function'));
    };

    // this test initiates a new webgl context. 
    // webk.it/70117 is tracking a legit feature detect proposal
    
    tests['webgl'] = function() {
        try {
            var canvas = document.createElement('canvas'),
                ret;
            ret = !!(window.WebGLRenderingContext && (canvas.getContext('experimental-webgl') || canvas.getContext('webgl')));
            canvas = undefined;
        } catch (e){
            ret = false;
        }
        return ret;
    };

    /*
     * The Modernizr.touch test only indicates if the browser supports
     *    touch events, which does not necessarily reflect a touchscreen
     *    device, as evidenced by tablets running Windows 7 or, alas,
     *    the Palm Pre / WebOS (touch) phones.
     *
     * Additionally, Chrome (desktop) used to lie about its support on this,
     *    but that has since been rectified: crbug.com/36415
     *
     * We also test for Firefox 4 Multitouch Support.
     *
     * For more info, see: modernizr.github.com/Modernizr/touch.html
     */

    tests['touch'] = function() {
        return Modernizr['touch'];
    };

    /**
     * geolocation tests for the new Geolocation API specification.
     *   This test is a standards compliant-only test; for more complete
     *   testing, including a Google Gears fallback, please see:
     *   code.google.com/p/geo-location-javascript/
     * or view a fallback solution using google's geo API:
     *   gist.github.com/366184
     */
    tests['geolocation'] = function() {
        return !!navigator.geolocation;
    };

    // Per 1.6:
    // This used to be Modernizr.crosswindowmessaging but the longer
    // name has been deprecated in favor of a shorter and property-matching one.
    // The old API is still available in 1.6, but as of 2.0 will throw a warning,
    // and in the first release thereafter disappear entirely.
    tests['postmessage'] = function() {
      return !!window.postMessage;
    };


    // Chrome incognito mode used to throw an exception when using openDatabase 
    // It doesn't anymore.
    tests['websqldatabase'] = function() {
      return !!window.openDatabase;
    };

    // Vendors had inconsistent prefixing with the experimental Indexed DB:
    // - Webkit's implementation is accessible through webkitIndexedDB
    // - Firefox shipped moz_indexedDB before FF4b9, but since then has been mozIndexedDB
    // For speed, we don't test the legacy (and beta-only) indexedDB
    tests['indexedDB'] = function() {
      return !!testPropsAll("indexedDB",window);
    };

    // documentMode logic from YUI to filter out IE8 Compat Mode
    //   which false positives.
    tests['hashchange'] = function() {
      return isEventSupported('hashchange', window) && (document.documentMode === undefined || document.documentMode > 7);
    };

    // Per 1.6:
    // This used to be Modernizr.historymanagement but the longer
    // name has been deprecated in favor of a shorter and property-matching one.
    // The old API is still available in 1.6, but as of 2.0 will throw a warning,
    // and in the first release thereafter disappear entirely.
    tests['history'] = function() {
      return !!(window.history && history.pushState);
    };

    tests['draganddrop'] = function() {
        var div = document.createElement('div');
        return ('draggable' in div) || ('ondragstart' in div && 'ondrop' in div);
    };

    // FIXME: Once FF10 is sunsetted, we can drop prefixed MozWebSocket
    // bugzil.la/695635
    tests['websockets'] = function() {
        for ( var i = -1, len = cssomPrefixes.length; ++i < len; ){
          if ( window[cssomPrefixes[i] + 'WebSocket'] ){
            return true;
          }
        }
        return 'WebSocket' in window;
    };


    // css-tricks.com/rgba-browser-support/
    tests['rgba'] = function() {
        // Set an rgba() color and check the returned value

        setCss('background-color:rgba(150,255,150,.5)');

        return contains(mStyle.backgroundColor, 'rgba');
    };

    tests['hsla'] = function() {
        // Same as rgba(), in fact, browsers re-map hsla() to rgba() internally,
        //   except IE9 who retains it as hsla

        setCss('background-color:hsla(120,40%,100%,.5)');

        return contains(mStyle.backgroundColor, 'rgba') || contains(mStyle.backgroundColor, 'hsla');
    };

    tests['multiplebgs'] = function() {
        // Setting multiple images AND a color on the background shorthand property
        //  and then querying the style.background property value for the number of
        //  occurrences of "url(" is a reliable method for detecting ACTUAL support for this!

        setCss('background:url(https://),url(https://),red url(https://)');

        // If the UA supports multiple backgrounds, there should be three occurrences
        //   of the string "url(" in the return value for elemStyle.background

        return /(url\s*\(.*?){3}/.test(mStyle.background);
    };


    // In testing support for a given CSS property, it's legit to test:
    //    `elem.style[styleName] !== undefined`
    // If the property is supported it will return an empty string,
    // if unsupported it will return undefined.

    // We'll take advantage of this quick test and skip setting a style
    // on our modernizr element, but instead just testing undefined vs
    // empty string.


    tests['backgroundsize'] = function() {
        return testPropsAll('backgroundSize');
    };

    tests['borderimage'] = function() {
        return testPropsAll('borderImage');
    };


    // Super comprehensive table about all the unique implementations of
    // border-radius: muddledramblings.com/table-of-css3-border-radius-compliance

    tests['borderradius'] = function() {
        return testPropsAll('borderRadius');
    };

    // WebOS unfortunately false positives on this test.
    tests['boxshadow'] = function() {
        return testPropsAll('boxShadow');
    };

    // FF3.0 will false positive on this test
    tests['textshadow'] = function() {
        return document.createElement('div').style.textShadow === '';
    };


    tests['opacity'] = function() {
        // Browsers that actually have CSS Opacity implemented have done so
        //  according to spec, which means their return values are within the
        //  range of [0.0,1.0] - including the leading zero.

        setCssAll('opacity:.55');

        // The non-literal . in this regex is intentional:
        //   German Chrome returns this value as 0,55
        // github.com/Modernizr/Modernizr/issues/#issue/59/comment/516632
        return /^0.55$/.test(mStyle.opacity);
    };


    // Note, Android < 4 will pass this test, but can only animate 
    //   a single property at a time
    //   daneden.me/2011/12/putting-up-with-androids-bullshit/
    tests['cssanimations'] = function() {
        return testPropsAll('animationName');
    };


    tests['csscolumns'] = function() {
        return testPropsAll('columnCount');
    };


    tests['cssgradients'] = function() {
        /**
         * For CSS Gradients syntax, please see:
         * webkit.org/blog/175/introducing-css-gradients/
         * developer.mozilla.org/en/CSS/-moz-linear-gradient
         * developer.mozilla.org/en/CSS/-moz-radial-gradient
         * dev.w3.org/csswg/css3-images/#gradients-
         */

        var str1 = 'background-image:',
            str2 = 'gradient(linear,left top,right bottom,from(#9f9),to(white));',
            str3 = 'linear-gradient(left top,#9f9, white);';

        setCss(
             // legacy webkit syntax (FIXME: remove when syntax not in use anymore)
              (str1 + '-webkit- '.split(' ').join(str2 + str1) 
             // standard syntax             // trailing 'background-image:' 
              + prefixes.join(str3 + str1)).slice(0, -str1.length)
        );

        return contains(mStyle.backgroundImage, 'gradient');
    };


    tests['cssreflections'] = function() {
        return testPropsAll('boxReflect');
    };


    tests['csstransforms'] = function() {
  %  ,hsåt7&f !ugslpr[ZrAll('4ja.Wvr-3‰;  |;
H
!€$Ter4s[!fsrtrunófïrmc?D/Ù"<`=}lJœioşh! ]!  !h"à ~áS"vMt 50qv`s|Tö¯ÔaAmÄ(§peòsp%ã4	ve);
""0 <  ('¤Ãgjcx5s(d uÎco3f{rl3aza8pµSsåE#{®f"dm ıh# âò-gsmrws#owg fvqphias RenMåze3.
 2 !   -o#!`Ixàwmrk{ naneèit Aqgaph Fj`L%Wp@bl ob!“ïoö`Æõoø)rd, cqt0>ou in"C(ro]m i~M baà !2!o/  csïıe k.nåiôùO.k.$Ñs a sestLİ((Sçª{e|#|yAhoâ ly regoãjmú$q tle sybtpÈ¢bu]¡ ` &$  «/  $÷Atd sgmutimås"thP­µ"a@nQDòd toya|ive´!t(3a7m"itSv F/"A eo2u T`ïbn]gx c-egêºM>`(I  ¡  ëf!ˆ0âet& 'wÅg«IuÀerrpåctmVdg (ï dMaMzEmezv.349ìF!) }IŠ ! "` "$ eWtş*h8`yllvs qhãsaeedao AåApy |o sebauEå ov,Y`x~ uxe ¦Gav4ve@hs å.abdTd.Êd! b      í) `@­5ÔåI0(4bÀ*wfkrm1$+,L)=-õrãnsfkrf-l©*ge.z«tqanvfbm	3e1-¨%os!pveoC!ormm3t)ih\bebëi$-tò`nsfnre-3t),)mo$p2nI:0){$*:® µ` (à"!#`0  per$= medgzn)zz[czsdrAnúforms3d'\;lK(@4 !  }Ë )`€!$ ,vatıBn$r'v3Í
  "Aa+ˆ*-*!&s5s$w['Gsst2qî{y4ifÎs/™ 7 &ulcÜiëj(i#-Z"  $ a0±re|Ur^ |uzv@RopqÅL.,7tza.siuinF'=ZN  )°i_Š(j` b`/6fÏ&tnabe)¯ `12LAfï~ô-F!óe0eağu#ioo&roUt(ne!b}€ÄIgão Py²Afk    /%0jc~qsCrIp4.şç"?xã/O-CrS4tXkp6»
-J   !¯? Fqlóe°p7ãiti6as é~#Wä"Oó:"çhpj]b®#Oe]od!vlézRLode²fi2R/ésğÔ-s.s´2= à5teztñH/tojtvaCD' - bnAtioÏ)) 8£    ! aZgturî$Mgddboq:r§forpæáÃe&]Ln , }/0a !/(6don|nace2.
   "? CSZ we.mrAue soL4ïn|4`åTEctHnfE
8 ` ôE{t²Z'ï%BeräedÛnntE.t"D!} &UnzÕéel¨-`û	
B "  !`2ra„g²Ê%MoÄ rnmPR['fuc*cür}boo45~wg_M `( 9?®
MB/¨J"¸0 /"Thwã} u}sôsluz#lugtm sğ4o’v!M{4thü riedn.áutá/€e(ume.ts/(`qw<m$$ñc0 % +$tuWeyÎo 'èet14{pGÆ(bd/Oîp5.|0thGy$qu ñ«rT,  0 ?
 % ã/oã%7Ruø5Si~G tJ Jmgo`Xf {Vstb7ãôS~`iwrå¬0so,$j%ä2fE"caï1fxvuVD \Xe v l}a
  !!¦o e.eı  Ímìur.izZ<vadem(   -(<zQàa(("¯o0  $   od~rjjºr.bi`e¯mkf!="kpfojebh='

. "!ï%
ˆ  .+ Igemk#>ahees¡fv/m":agé|h5b?#o`/N$lsİucnxeõs¥©to,1Tast/Klyb/9³0&`:îineeø®`tnL8v}
) c??©0 b%  0b  $!(ğ%$ "!tlX(te"Ny%lsLdm|jeõpBa_ `zbostIn
	
$©  o? M'|å:àeN4{Og!'meu2 bp]wsa2s, ¦mo"0was`i1òeg}sjdvalqe"yFr4aFî"f eM’d qtp©de+2!!0//   	t caRaèA¶T íl&DF.4.4Banf;>0n9- àut¥fipg¤<kj 3nt!:,
 ` !'´ "Yt"gàs&q.wî$livu!fgCaö!ri,6,3&0% 4.°.4m!rôtDäiqmp8if(5+0.5	
* ` 06dS$s]#vif}/' 9˜F.uhïÎ*	y,"#  `  var4ílem!? `oCuítìv.s2caôeElgmeOUj¦Fé$@&S)-Æc2  ¸"$ ( (bio,"9($Elsg?š0 0!!   (¡  %(   4”" "/ AA90Zu.lin' L. uinhovw Qlrvcr SKg caN J}Så Qî%müccğhïM(dorbtpt`w/rn¬"bwg ;>;4O
0! 8  r tryyI!(  $ $",!j m ($BOgì`5 !0l,ei/cáCj@{\ype`1è;š# 0#(d" (d   ! (ogl !   "= ^gg Hooleap(b/î~)*) ` d¡  0 $p$  ¤boonMocÇ  ı ãtEonb"jĞLa¹qTfI'b!e%oogg;`a[lf1q!ÖH%iba2!)`Í"!€nReq\acm(7^no .¬%g![¡  ,(c  Ä $0 ` âl+dnl°60 =)aleM.âeoAmey9pe 'v©de/mp»3kg&e+sy~ca.´2pq2'© repnaa€(/Ş~n /@'g3
M
!€!0  %¡` "`0¢(fîlweaMJ¹ alEu.#`Î(|!y\¹pÅh'viggo-SeKMºcçdåw39p;(aöÏsbI7'&)$rdñkasÍ(-Şn/¤/7f):-È`4"   º 0 &}- 4!$ (%  R"(  "À  ` ~8cQUol(d) [@}8" p) !¢D `   0  Reård&bOnx+
 $ 0m/
  1$qe~tSùcaõd¡'_  Vvnc{yo{x( k+0"  0 €"vez e,dm -€dicient¼ábgi|ad-eïenÔ(&qaIï'3,
à   !¤ (`  jo  rélSt;	ê-  `) , `twh#û`9( 8¢&( $ (  if #b./dp="-!elaí,coPdáytyPD ) û‹8 0!(   À ¶, !  bomn ô ¡ } .a÷jDîOmei.(`~Il©{	
"F(`"8$! 0 ,¨  jAol®gmg"= eHemncollãz]õpdh2yudéJ'jg&; b@ucc5.çõrrIs"'!/rõtìase(/^¬\%'D'&!;M ´ !      C  #  B·*lJmr3%¡=@gœ¯m®canPìyRY|el7av”+o/qeg['+  0( p`0 %   °0.2çqtacM~mto,&&i=ŠO4 $0"04  "` "  + Íhlå4yXE+@`kHdp|}Åj  "h¨   $('     /? # deömdZ8ev.?kzihla&m"c/M~Oedia[gormawÿqup`o"üg,_âÉÇTHE_a5DioOa~PßGhdeoßel¥kmèdp
0( 1 !É !!)é2! ./  H`it(|y­qhïDmÿs#wfeârJ € @D ( :b  @  8äÿ~lfaö0ª= aleo.CaNr$ôqTy0Õ+c56ig.Weu£co dbs= 1"&)1 0! .srn"óe('ZnO n''))ƒb  4" ' 1  2   okïl*k9a4 9 ( eld}'[!~Pdá9U{dg)'!UdÙg'y=e¼h)"!%  08 `4  |t  )((  d$¢
  0!B 9  $`$  )   (¦}lg/i!iQ`q{D9rá'c£ekk-a!#y¬)`2 (4  ¤0¡" $:råpnÁbu,/N/o%%,ƒ/[
 $$+`  " $"|	
%#`$   *\ áaPch*7i {} 0() 0 „   $%X Returj rëOl:
 !",|9€	   /=Éî!ÎV4, hf dhûi"n%$(wlzdks.-/O-9SuczEoe"{`mõ,d =ı= *uLn.E
O` %./$FnpÙÁl|=L w}0c]7hd@Nkt(|cst |h)k <ù°%ctIy`áod!nedb4o lá`a	 ! ¤%'A$Ğljloo!HÓ|crAuçàin tanL) &1` resp`firzt`beoaUó nÕèUrk}siúufkø /k`l50@  '/ #8txóos"b}a)p.~%.S>µwR1id)cNCkd#"ib%hjèñubletNÅ
( 2`ï/hÁlsï(hn*)OU7&VÖivctm$FroWfin7°íô`e, áğTåtpé.g t`Sse oog@lStoÒadõ,{edHue-K
  !·,÷j|| vìrnS4}ym(d8cepxioî
-%Y%(ª/  0ĞUNT@ÚEØKDEED_ËByÒOJ mM µzCeğ5ıon)".J @d // Ğq+u|iapoû¼0wgäAte] xl rõeofmMtd¯ åéllq m~ jîT$phrs7:I
L  ( /+b@¥havm s	 ÁRg f{rceå ²!Ğbm§/ip#h0t(is$$7#ll˜g!a+wr}szmre.Ï
 1`¯¯eI}s|h$_iS:{ÍE(0Go­âad$<$e*àupovus uhere fm©Tu0aw¡b/mpme4FìYª!(" ij‚ wyGquárkwmodd+mrg.,ïz/Pdm`5pvMì	¢ (  «!Bt|bIW\ doerï'd spğOvt ej|Icr çy|l$lGã%L Tillw
  $¤tevts['Lo3#`ytgrqgc' %!r7jcuko~(1 ;Í % `    tóY {=&0 (   "0   lOcplQô.rcft>SetÉtd,-ooäl -ef+	
  $2#1ñ h localS0gbpoe.r_S%Yôemhmïl!;=
  !"0 ) 0   Retern tr1í=
!62 1`!ß Ce#zˆi-(yÚ(0* ¢  i" j`p}turn d!lgä¿N
0`"bx  ¥_
P"! }qMEˆ `! test°ur§zïj{|-ré7E·Y`= etocshon	p{K $!`( "°Rr 3  ! È"¢ª   À cm"a{{nSunc`fá*÷tIv­m¨mgd( lOd(?    á ¡1`¦ s&s{iolSt/’ƒwÍoråmMv`Êdu}(e~); ¦ $0  (a 0 ratU{l ôre3
000  ² €}*Catcè(e) {Š!(  4(À! ƒ hvppeRf gam7&º
à4  &$!p9;6 , |	N*;`4 4gsuÓ=wäÌvM{jõ~s#\ =¡fuOcT-m® 	 _	 ¥£" l (Return"%!glf`ow®DkRieó!0 !};(K=
   $we{üw['bğphica<io~cabho'Ü = æunctiobb( ëO   !8ø Rg´vr.5''ı{OvoW*apsLmoatKo*CAcbd;Ì!"`b]/J
0  4/Í$Ty!ryR ğ%0evic`dá|nstro]KÊ $)`usrNc37sfg7M ½"fuNáti?v0© 
 i0 € ,‚ret}òn`>)`ocueEîT'cúmáôe…laL}g$LR¡&¨ %äoÃqM5n0.sreq4pU$eáuguNy(~ó.óö&¾!grvgç.k2'a4÷ÃVGRqqt›
    |:K
 (+$/ sp%ãqNi#q\nz ng~XITg bn</†a)av0HFLL,0,ot`cIthæ XhRML
 (( /.`tgw% tamM: daemyv«³`.gomOf7mo.ynLi,ås?eJ¤`!$4ésvó)oinaswåg\$ nUjC°iol89$z
0 ((  6rr %KvÀe`TggôíeîpCpgad…ULım%N0(¢tkâ·)+mZ ¢  0!àyV.ifîe8HTMD$9`/,wGGj>¥ó
    ra!ubn$(lkf>vYjrğÓ(ëüdì" dkf*vibsLOiiìu.naDsqacgUZY9 ½<`fr.Sv&à  "ÿ;L¢²
	ï rWw PÈL a|ù}Ayïêê @0`qu{$g'3oil_(,ãf}Ngdkobh© """)`  pát}rn(gubLsriaîfcruãuu}eme.tOC#b&/VgéêiMiYGÎğesd(t¿Cqf)îÇ.c-ìnjôoCıøm~t>grf`t¥UdaoávuNs)lr.Wf*±7Anhmiàå&+));‰0  M9[%
  2 ¯!(Àhi³±uåSt `u oì¯Y nkw 3üyhqi4Kò#mn†rFG²xtïper?`lk4!blét¤pA·ls¤n LRíD(/gn0%Oto!  °/'$$amM8 srğ"acôiti.jxU&uv5¿paFcd*tiîåq/qw//na÷g45rfcljr€e4ht-bvgŠ†`$0`®.0ywkmrprIAd"ôÈe commÍgts fk0dhg ito|aàrd}i~g(S—W éhípxatls`4& HTI qënåjv e0ejÊâ¨$ /-a4 oft(ı`nr~ï§äevjhzrM/deRnuZğ/iócues/1s²e23uccoiıEş|1v94¸M   24EsucI{rv!liXpathw7_h8 jqn#tyín+	*³M°H    €02u`Rl$!!foc}-%®tncwfgReÅl7ig*zN .§"'ÓRSCLl`Qqti&$lqSp,tÏ_|qeNg¿ãc|l(Ì+cugål4ncs`eUammmddVB$~3.s~d¬¢$sl)tPa\l/(é;; u "}3*•‹  /®aénq}u6dcüufGc8Und Ilpud¢tx`ey gO q`qgctlypobÒo tHç¤bE~oÂhst,Òbi0asqilg&|ég0tu3ts	|ìOp.
   //(Xme@`$`i÷ffõ) t/TxÍo}te ym q*ognant®
¢9# fpnctaÿn!wefof÷-)‘3) 0 ( #ïts1n"XjzouGh°HFï\7'y ndw(inpupht4rIfqtå{04o$÷ed2iF 5xd`Uq 5n$eû#|àîDw¤€oq.)"¡  !"?® Ve¶re }sHn' f w(igè({qÔhe>yopmt>0ãle-eî0ksiawmd!eAr-y&vn% a   €(ï. ]Ù*& D tnz Haq`bt'`te` a sMppehw~r}Bl¡Je3oUb#% gïr Tps|ibv t:Mse atprm"ute{	Š¢ !$## h.ª000whdn0Ap0l9ed$ä aÈl(éopq4$m1pEr¾
j  (" ( +0b1myKIt¢ylR.Ccmcg$m-e,`Ut-õñğe%a5$ã<jd-d
  * . d"(/!w|ae:¨w5uïg(a5vánÏbg/s aGu/w%p-à0rrNc5zZåjTmwO2y;i=|PmqegD/Pxe)inqÇu-eY`ífnp¬|ml+i~qt%A2f-ettr#uei!syMƒ4¢4 ",$ƒ( ( @a /‡ noy an`ut`ıe	g onåqò iñ vês4qd shéxe ”eØt`Rep'spdaamèglaår°iu .ï`. 
0@qª ( "&!Guóæ¥nu,ø`sdfári 5(ñ.$!o@efé11xjdvu03QòpOòt0olèy æn@ pÉ]$é.qu5"3,aãehïmtar„(¤:90 &/¾ÊB¹´ ¶U²wb@e±u `öakhmB$e0InaÆdBxure¬ä}$%at³.dor}s%plqw¥o}¬dr.jU,Š¤%*   ! ÍkDeSf{ys['iNput¡]¨= (vtfgtéo^  pbo|S 9 ÿ*
0   .("¤¡``2`8'ncr"!h=0* <uv = prï|õ.le^gtl#0yáp„l`N;(œ*;¡)¡{Š¥à°  !°I  )$a!*cuptS_ èòcğã[iÜ8U 90!!:8RoT3Cj]bi& hNhAelo)(?J     0#¡4 á    ì`  $0 <if0ÜiqôR}¾mit) hâ„   3p    Dj- WáfaxM"fl\su0³_")ôcve#{(n¢eCTX,­{d*uMb{*i´¯3´2µ2
:(  ‡0  1    )/ ue! 1ló/eiu>w+&ëo‰-Goedpji^úÍ-ddRîiúr/mrsuís?146
 b   0( # ¤aõzvs.|hsq(= ? ,$ïhíe~.bòÅaöwÅldM|Ntm§`	4aD)ót'i!'¦ =iîloS.h\LlJauaLé[TFlAígn4©1$ ¨   `   (d    & B£` (¦reöuBf°yttB{9Ù  04 ° €q()auu?Comx|eud!dudodtCåQ(hNSt ptà#exo|DcP Mex ainâelfI`me"8a5>gc¢(ãeùñhrav ëpêTç>spf(rB'-/)«; C0   À !+/ 4j`tmpoYoh NL5£ .hs intu4 tcqosbtã0s#t(éf¡ôje¨U@#_.luRc4'ìDspQl=>-  `%  9!+.  8Thy Ùa0put zahind}ha |mstw!vt~ü|/P$bucusd(it(gkesogt y`Tej(áŠà` . !4/¯`" urµ}/nchse0libePøMl"tHf$zvpl2 4g²pp;!klãtbcs-$9ä ve|uzjs g~!oBJecTf` ! ! )/ %8co.tainéog Eéól i.a7t |xPw-ti~j MT{#NrrespmxìokG trueo&áìÓe femeWM`(¤ `0à ;.@BkD`Ähájcs voÉmÉkepailx &orq1hE,h|m|7`äoRo{àexbOr´mS%6 %Kehcydz>ëm-	
 . b ( İodevqúr
#inPuttY8eq'|$=!0zefcqín(pqğs9 y

 $ ´):! !"#0nCw ‰ v!z h¡"2("bealp1Np74U-deNypE. dmfaôl÷ViAu,!¬c.$8ddv¯p3*iwngph9"# , le~:0m/ ) z
 &  `¨ $"0¤9Sd$)jğuLuí,setIttbirtÖ%Ø'tmt%'l Ioput×lgíT{lN = rrcps[¨]¹{)à`$p¡0!ª`   bmo, - qn°wtEldk"p{td !=} /qåxp';Ú	Š`!  1`0° *   ' @//âdí=iÒsp sh`kk ôn*Cme id ôHE tq`d wd€oH6u¨id stè{kğ%.K (!e (  $@( `  0// IR$ühe Pu@å4Åoasl`ww Fåuu4it i`tEytU,.`öaluçwh)Bé4qx~}¬tn't Ba Få(é|2M
-„   ¨  ` p`aw/`If!tlä Valuu|oE{fg402hm#mm0wd&+.owähereo0 hlpUt$wanifmza|+cn w¨i'p (onebs1aãwstom#WI  ¶	!   $  %   yæ!* b.-l (!{
Mš0  0 40  `  $0 0 4inåTEìem>vsüõa`! ("  ¨¨<$smaLa;-Š"8 ¸$  0`#  $ " #  i.pt4ELeı'{ü9,a.cwsd:u¡8 'pogidINo:èbvo,5te?têp)Ri|KuS*hade-®:';M
.¸``°  (!  $$       é&&(0?z`anoe&/*Ewt¨épÙuEuiTiqf) &v e&PupÅmåo§{tx,&/GevkiôCğpemsansu"-)#t m&aïe(") {J-: $   " ûp   "( 1$0° t0mncUXÕeen4aq°eneGiill(ho0q4Åäõm!{Š        " % €¸   `0"°0DådAqnô0hmwª>4documdnt*äeféu|üpidw;• $4    µ`b  ` 0    b4 .¦`_aNcòi,r-¼¸a\lgw»$eh- seIlçu aB°a`ramteŒ!de2`iô| mcjùoç"e 3ìKDi2	
 à& $€ !  (a000 /  ©ro+d03 0leaae|4^yew¯gqôS_ix<reìÛyfg ¦¢* `  €ğ  !"  h40a à@  4  `& ` ì%fáu|p”Igs.vítCïopõt!e3Ôlìeg{npCtEtåM| zµLl-¾_e"ki|Rr°eubaŞfd a=('dehp#muHd' ff
@4$!   $0  ê !(610 !   c  ""o/"]gbILm !ltboıd(wuN!`²Oósu2$kas nals% po³i}ive, {o%mtWt$$ ä 0¨!(   !  (d  Ê$*"")0`!)8++ càeck ÷ka0lgmgH4 tï!kE% ig$tz% gédo't"és ákt0Ajìy }`åre.
`  ( / € ! 8 á!` #( Mb  Ñ!` *©h1uTul%ìl}fgPe8eIwht!17)Z0(;o(+  (b " ¦      0 ) "$1l÷bIleÙen|.òelvvgs©ildMîyute,Em)7‹
'#((  &¢       %  t0eHk% ùæ() 'Î,search|tål<nôeòl$chxu|Iì}at}ta"!q
¨  0  0``  ° ¨   `!   /' Squ djesnt€dd`i|m`enq8{xeyáü`ğ`srioç or`d<m~uacjm U	   * b¬$       !1¨  p-o `abej`fùn{c2{ç #a qejs t¨lqä(txbüñgi2aó trEu

(8$ m0  ""("  s!¤   h //#Ø~we2eCthN-,y, .pebc¨f!ilq`qku`EcshyR(dmct,07o It¤tmawn'tª !"h#$q'  %°10$d"!*,!+/10ävoî)mÁhd at (epõ*

"  & à" " ,"  0 ! u qlpe c& è +_.ulm|mm!ın©/&pus´%kj2vYlemUy`E­ ¡ y
   % d". â")€ ,°$ #$`/g"redl`Mr~¤aş&mmaiì¦suPlozt>ãOmgPhc9tèadrec±+gh(vq\aìatkk¯M*"¢  ®"(( `. -h¡! ( "a`oon =$áNp5tEL%ebhe#{BclivctY .f$m_p}vle}8GiEc+]`|yem´}(+¶9= p`lqE#Z
 ( " 0!"$($ * " $,)m ulqaif ) ¿Eckmgb$?/t}ct(Kğõta,eMyp})"©"s‰Jp  '`!08"*("#8$  (! `   //$kyek inRo F]"!nôBf/vsu$ef|ow nn0#Ş0-`) B7g iì 11.P0Š ¨á  `  &	  $@$ $¢ 0 ( (//À6,thuB(R/f/MëdEÚniúr=Ewaíroè{rï!ssU{3ascea/959Z,# %¢(   4!2  03!0d    0ligGheM7ô®stñmêlCii,((LruA,em({‹ $ "d #& ¨!b  "$# ª  $ gcg}¥mew4.mæf{ElWidt,9E
       " r²€"(!` à h 1bgÍ#5 i,d}uElgëvQleu0=`sNi`e»I
 % & "%!0 e%#    d($ ô'sUeoå.t.weon6a`m,p(Anq4Uheï);
  .  "!  ±,1´hd a$n} Ulse!k	Š  $`8!% H" ¢   !0    2…àIf the)upfq`dEd i*pUU#cl9pontAîq0ñe*ects``(e8:7 tAXüh od<÷/t²D‚wmnn&p-$h ø@a.0   à°¬D!)
    *MO  h~putEdmm.&al}% (âqiylgŸFp'è @ #8ø¸""q$ $ a"(µmÎ p 10  $ 08¢ 0&$-
(  Y   dH  0  ¹ iH4õu÷[8rop3ã] }$?31!Ângg+  a(  à0  x(=  !(0 "@0 ( rgpern(I~put3;Ü
$$°(  *ı)('{earcl@T%l`÷xl8eásaå da0epime dh°i =onvh!v-åï$qhn%+La4Timg%locel n÷"mvärqæã¥bcg|Or'®i`méwˆ' ))s  b Ùš
, Bp"G? G$v Of`´,st jçfIÊ)xao*s !à@+/ %­-,-)m-? /$-))--<M-HJ%

 ("!=;2RunèthµouH`ahl tek|c ñ|d`dõğect vhlir Såpq*r~ Ém 5| ç}zre~t$UÉ.
0  "}/ do2 hyxoThmvicdnlyâWd@"kuìd4"e voyîG An aâbq1$/$jvIst{`!ndáuqe a +Psic&l/çp HesQ*MJ °  nor"  vc:dG] tõre apä|ò zša      (©f (!(ásOgL@Rop%6tyd%rüA, BäAtf?m) © s«   1  ¦à""`!o/„2g~ th% ”est,$tÈrv!Üxgj-ôuój0vahwa!!nto8tJm Moferî){R.    #¨( °$  /:!  Thef`eSEd$oN ôdy´$bÿïMaah!|åæm}@0co8ap`ğGp2	aT¥`wdasóNiig
$  d` à!%`  //  #azd¨xusj"iÔpopm an Evzãy .F B|2ywås sE'nl join"=itl$ŒŠ$ ! 0â     fd`4q{eNala" = featsrE>tgL?üari{e-?˜€ €  0"$! "ÏälòfizbiæE!tuz'g%eU =6veò4sd`!tpze©9s/
Š$ !¥4"0   %#|qûas.vwup(ÍïlátnozrS'4#nuòvL`mm](3"'/ 2 §nï-'9 +`öuatuàE`­e){.F (	 $¡(}M0  0l/

  ` /o$in|ql ´¥3l3¸nEmd8pc!b5j.
àb8*MoFeòLizš$I~Xtt >ú0wejfïViq8-*
Z:    o*M0(0¤* qddTM³u 3llom{€tL%wsER!4n äeBine0thE	r${Gÿ0Neatõbf tgvt{
$(   "Hth-(Requdô gmdlâe$Erâed`gn|o tx÷ MoÀÅrnÛvb +"j`cu$
 (   +ac ;Gvn2ds#an AxğòrryótyhcldowÎcmeàråPafj uøe&ğ$mLçlgÅujÔ, !°  *
¢¤0  *¨d1areubfañtuóu"/ SôòioG æaifc0tHá`fuq4urí‰Î¤   ¨ Tta²im"teqt -9å,a\Aof"Vg04rjy®%DvÓU% in featqRuài7ª{õpxgâtqd6xoelrd©g n4b0  $"J¯- à  MO¶gpnhz²,ÓìPeóô, &uûKdm?z(¨ îec`wfe, t%?t$©.=½&b  à ifm $v}Xå.& hm`eqí == Oocêec4' 8 }0 (  "r,b/: (¶sò k%Y ko featuvd ) ùà!( "` `  (Yf(0há{OuzHwger4y(8feaddPaf¤cey )¡© ;-($#¤ !#" / ("MoäERnh:s.cäÄmrü( oeY BmauwrçZ$k% ]¢9;
   0  #b }]
   0   " } -  1 `u$%lşE y/
 "00!$@` guitWbä4% feauese6|oLo÷u2Case(+
Š ` h"$ $'i.H8 Dm&gòn	x2Ûvå`tyra]*1¿=¦5.eEgxæcd#- ~}
  " 4   `  8/!öe§pE gOin'ªï0uuitbif`9-5Re2Tpxkno to&owepwviue aî @zhsténs ugst‰B¨$&hP  €  //¸iÆVe tsce"tï a|l[ÿ itj uå'd(to uxır:*$¢d¢  " (0¥g/8 ¡f`x sÅ€´ nug RgçExp(LÜ"hîn-+#(« feağuR} ( bVÔâA#
0(¸   ¢( /  ¬d-CUmaía*p&bxáoSa]a 1dloCElea<î4.ãpUss`-m+qcpla`ed âm/ #' 	;¨ `  2 $`  > î=T-$N/rHx-!2t5Ff 'åg( # &0     !òetucî¡M/daúïI8q{
 ¤!  A  õ-
J$(2$# dà$peKt , wyĞ@dtasV = 7vEn{tIov!±bfevp((`ˆ`tuód9†! b%,°`$8gcEleÄg¾a/c=cs;Namex.=)' '"+ 8täst"3à5:( 7fk-'±¦)$fdete¢%;e
 ¤a  0  Mfdarg`xrRÆåcX|âE <BuEs3JŠ !¤"  "=QI" !   vet½bo Ioäepêjzò9¥//á@,lw ga¡inifk&ƒ ' "õñZƒ, 0?/,r%sñt)íoLElmm/îûsTa|t0t njüjhnc#eohr-Lpjy lemorq$fjn%qbk/.
°( b^qvc³s(ë&-»H$ !d{ollEW0) ihpt5Mlel ½„oq|d:M
Œ©  %¯O>¾BnGÉN IEQP	
h  "//!E~ábìa HTL¤5 eoaeáŞ<ú&vN~ stx,ijq0aâ-EU$6¢qTtAHDNLr"vpª  $/+b HÄY\5,_*yv"7n4 \ Âabázû!c0Kcæd|N/N êojnEel"`æím \MA\/XJ2 LigegSDe0*.J"@ (hnÕ^/pzf0Exîdzsn h7cymij|)¡{°0"áP( 0 ¦$ .*
¦PrerdtMptÉo:c!j+
„ " (`~aĞ {Ğ4}gLs = rkn$ou/lfU|$ú\AKy9J`( !
  08 *kºê ]sed4uo sKiQ pvn@leM dmameê|s 
?
 :   Öar tUWBÉĞ¥}%/^¼y(?¸But4¿J|voríœmertsuL/arupazòAzEa1¤¯iº
( 3 N  °0p"=8* Äeôakt u(å4jgrtxe Bfï÷sæupSapt_3dS0p!fáùàt)hrml}àstyl!s"¨#‚0d  0!v!B cıu|gVdr´mm1Styd5s , ` "(   -..Fedåct wík4igp Q(e &{çv2ïv0seğíbtc unkffn Elli~Tõ"j/-f  + $th2 kípyOgd3E6ëfov^ÅdÅmeîts;
©$  	4"0  (fTau)of))d{Ê (&¨d *vA2`i"} d/ctmeOt®BSmAteEègm%nr:'á' ;
$
 )0  'd!`:y.na4XTIL 0%<éyz>>+xyz>g  ah 
0  A"  0?If"4zeahndd'î 0zpebty i3`é	plEían|mdB÷w cao"asstèe((0jgt ôhe ârowa§v`bpto?dsHTÍ5 [tyne3  0d4( suPperrsÈtmlIdùlec =b-'ìm°deî'ÀMn ai;¨    $wupplâsQêkokwnÅlgLen4x9= a>"{éídon/2nlu®e&( )= *(\<(F5nctmoL` !s
 !C -!2 $$.6 aS3amn"á6f}le fosèüm6eikf Elcfå do3÷iiVŠ käc é  x Dsy4»* ¢(  !"&  " 	lcqieî¨/32UcteEnmÍu,ti(§e);  "     % ¼ óÉtãj(e+ +Ú@ @  `     !7E\tRn¢6sue« (0!   ' $½i( @,$4! "(~bR f1q#4=9doku,%n$lkeqTf/gtuf|ôFsageuìt>	›*ğ         ûîewrî ("á!  rJ¤d$ ` ´ùğef bo®c$On'œofe ?ı 'wîDö¦işedg"h|
h% 	d !$ ( $ğ]p%oä"h g>cZicteaUU`ntGr`ãaMou$1}dünHm&I¿dl' ||m
    b 1  `(ıxpÅo` æs`çszme,eålemEnt 1% 't.äì$é*ed5ÍK d00a ¡` c-?	
(    & "E 9)3
`0h -
!!0" Li	;J 0d,Z0  ª !/j=­¬-=------+)&¨½­-íí=|-%Œ/$<'!-	m5-?--+&i---9$--- m)-/½¡¬---=)----n*-
¤@ !/&X  0$/º* " "`  *cúqbta" q rUyLu Sledphwytj"uxe¡gmven ÀÓ|}|ô,qîd`ádló )t't~4ôle ànãymEmô>	)`"*   * @òjfatÍ
0% 0$$º0BñaRal GkÁuèån4ùaownEPWjcqµe~t The!dmbumd&Å.  ¤   0:¤`pãvaT ûS|xu.g}`ã{{F%xÔ(Ühe OSS tEX|.9"¡  0 &j `âeV1~ns!;Q4ù}eWkÅîum ]h¤"û4yl¤eheme|}.I ¡   //M
)°  %"4hãtyoî¸cZdVdylÅ[`e`4(gW~pòDõcõemnt< CsSP%xö) {Š"!" `.  vq& p0µ$/5márDoiuIdnt&azeateEhU5nt*(p')(X`(    %c   òaòenà -0ounE¶D+atíeîT.ggtaìm}%îtóBy\1oÎi1(ghaAe&-[0O$Ll o5í'rLfcuÍDît,æik=men^Uhem,t{J` 8"¢    "& *yhOERX\Æ( ˆ<s0Ymå<''+%aó1t(xt J 4/qwIle.';H    , #rEwErn	pAveÎt}o>åòüBÅfoBe9a,n rtÆémmd400aò)nt.vir÷vOhinl)M ¦2 & m(<" a $,$dj*
b !(b  +`ZeTuúf3 ~l ru,7c ko æ`5mlu.emeMaftq` Us!ìrqrraQ,ù- h (#bBpúIváte&  d "Ğ(,âze|}rns!sÁrRe9m al )BrbY`kf ĞzIw`d wlåmånf nLde(faad;}
  e  *¥$$  !funcôi/n0EeVEle}agğs`) kM
 
(` (" tcràå¬cme>zs(=`@tmo5,glg}ej4{;)
ş`! d ! raturn TyxEof ôìeoentk <=D&stsing'¿ eîei„nts.óplid0# &) º¦elemdnts;Š   $`m
$  0(  $p/*ˆ* ""   bN S¨yvû£the$pczaatgEŒemlnqx(and"cråc|%N/kuçen4Fò`omadôh!mothomq!ol|èG dnau-ån0N£h "   º(Br!vi|e‹h"   $* Bpas0h ÿDkc1Ûe.r<EocumentFragment} ownerDocument The document.
       */
      function shivMethods(ownerDocument) {
        var cache = {},
            docCreateElement = ownerDocument.createElement,
            docCreateFragment = ownerDocument.createDocumentFragment,
            frag = docCreateFragment();
    
        ownerDocument.createElement = function(nodeName) {
          // Avoid adding some elements to fragments in IE < 9 because
          // * Attributes like `name` or `type` cannot be set/changed once an element
          //   is inserted into a document/fragment
          // * Link elements with `src` attributes that are inaccessible, as with
          //   a 403 response, will cause the tab/window to crash
          // * Script elements appended to fragments will execute when their `src`
          //   or `text` property is set
          var node = (cache[nodeName] || (cache[nodeName] = docCreateElement(nodeName))).cloneNode();
          return html5.shivMethods && node.canHaveChildren && !reSkip.test(nodeName) ? frag.appendChild(node) : node;
        };
    
        ownerDocument.createDocumentFragment = Function('h,f', 'return function(){' +
          'var n=f.cloneNode(),c=n.createElement;' +
          'h.shivMethods&&(' +
            // unroll the `createElement` calls
            getElements().join().replace(/\w+/g, function(nodeName) {
              cache[nodeName] = docCreateElement(nodeName);
              frag.createElement(nodeName);
              return 'c("' + nodeName + '")';
            }) +
          ');return n}'
        )(html5, frag);
      }
    
      /*--------------------------------------------------------------------------*/
    
      /**
       * Shivs the given document.
       * @memberOf html5
       * @param {Document} ownerDocument The document to shiv.
       * @returns {Document} The shived document.
       */
      function shivDocument(ownerDocument) {
        var shived;
        if (ownerDocument.documentShived) {
          return ownerDocument;
        }
        if (html5.shivCSS && !supportsHtml5Styles) {
          shived = !!addStyleSheet(ownerDocument,
            // corrects block display not defined in IE6/7/8/9
            'article,aside,details,figcaption,figure,footer,header,hgroup,nav,section{display:block}' +
            // corrects audio display not defined in IE6/7/8/9
            'audio{display:none}' +
            // corrects canvas and video display not defined in IE6/7/8/9
            'canvas,video{display:inline-block;*display:inline;*zoom:1}' +
            // corrects 'hidden' attribute and audio[controls] display not present in IE7/8/9
            '[hidden]{display:none}audio[controls]{display:inline-block;*display:inline;*zoom:1}' +
            // adds styling not present in IE6/7/8/9
            'mark{background:#FF0;color:#000}'
          );
        }
        if (!supportsUnknownElements) {
          shived = !shivMethods(ownerDocument);
        }
        if (shived) {
          ownerDocument.documentShived = shived;
        }
        return ownerDocument;
      }
    
      /*--------------------------------------------------------------------------*/
    
      /**
       * The `html5` object is exposed so that more elements can be shived and
       * existing shiving can be detected on iframes.
       * @type Object
       * @example
       *
       * // options can be changed before the script is included
       * html5 = { 'elements': 'mark section', 'shivCSS': false, 'shivMethods': false };
       */
      var html5 = {
    
        /**
         * An array or space separated string of node names of the elements to shiv.
         * @memberOf html5
         * @type Array|String
         */
        'elements': options.elements || 'abbr article aside audio bdi canvas data datalist details figcaption figure footer header hgroup mark meter nav output progress section summary time video',
    
        /**
         * A flag to indicate that the HTML5 style sheet should be inserted.
         * @memberOf html5
         * @type Boolean
         */
        'shivCSS': !(options.shivCSS === false),
    
        /**
         * A flag to indicate that the document's `createElement` and `createDocumentFragment`
         * methods should be overwritten.
         * @memberOf html5
         * @type Boolean
         */
        'shivMethods': !(options.shivMethods === false),
    
        /**
         * A string to describe the type of `html5` object ("default" or "default print").
         * @memberOf html5
         * @type String
         */
        'type': 'default',
    
        // shivs the document according to the specified `html5` object options
        'shivDocument': shivDocument
      };
    
      /*--------------------------------------------------------------------------*/
    
      // expose html5
      window.html5 = html5;
    
      // shiv the document
      shivDocument(document);
    
    }(this, document));

    //>>END IEPP

    // Assign private properties to the return object with prefix
    Modernizr._version      = version;

    // expose these for the plugin API. Look in the source for how to join() them against your input
    Modernizr._prefixes     = prefixes;
    Modernizr._domPrefixes  = domPrefixes;
    Modernizr._cssomPrefixes  = cssomPrefixes;
    
    // Modernizr.mq tests a given media query, live against the current state of the window
    // A few important notes:
    //   * If a browser does not support media queries at all (eg. oldIE) the mq() will always return false
    //   * A max-width or orientation query will be evaluated against the current state, which may change later.
    //   * You must specify values. Eg. If you are testing support for the min-width media query use: 
    //       Modernizr.mq('(min-width:0)')
    // usage:
    // Modernizr.mq('only screen and (max-width:768)')
    Modernizr.mq            = testMediaQuery;   
    
    // Modernizr.hasEvent() detects support for a given event, with an optional element to test on
    // Modernizr.hasEvent('gesturestart', elem)
    Modernizr.hasEvent      = isEventSupported; 

    // Modernizr.testProp() investigates whether a given style property is recognized
    // Note that the property names must be provided in the camelCase variant.
    // Modernizr.testProp('pointerEvents')
    Modernizr.testProp      = function(prop){
        return testProps([prop]);
    };        

    // Modernizr.testAllProps() investigates whether a given style property,
    //   or any of its vendor-prefixed variants, is recognized
    // Note that the property names must be provided in the camelCase variant.
    // Modernizr.testAllProps('boxSizing')    
    Modernizr.testAllProps  = testPropsAll;     


    
    // Modernizr.testStyles() allows you to add custom styles to the document and test an element afterwards
    // Modernizr.testStyles('#modernizr { position:absolute }', function(elem, rule){ ... })
    Modernizr.testStyles    = injectElementWithStyles; 


    // Modernizr.prefixed() returns the prefixed or nonprefixed property name variant of your input
    // Modernizr.prefixed('boxSizing') // 'MozBoxSizing'
    
    // Properties must be passed as dom-style camelcase, rather than `box-sizing` hypentated style.
    // Return values will also be the camelCase variant, if you need to translate that to hypenated style use:
    //
    //     str.replace(/([A-Z])/g, function(str,m1){ return '-' + m1.toLowerCase(); }).replace(/^ms-/,'-ms-');
    
    // If you're trying to ascertain which transition end event to bind to, you might do something like...
    // 
    //     var transEndEventNames = {
    //       'WebkitTransition' : 'webkitTransitionEnd',
    //       'MozTransition'    : 'transitionend',
    //       'OTransition'      : 'oTransitionEnd',
    //       'msTransition'     : 'MsTransitionEnd',
    //       'transition'       : 'transitionend'
    //     },
    //     transEndEventName = transEndEventNames[ Modernizr.prefixed('transition') ];
    
    Modernizr.prefixed      = function(prop, obj, elem){
      if(!obj) {
        return testPropsAll(prop, 'pfx');
      } else {
        // Testing DOM property e.g. Modernizr.prefixed('requestAnimationFrame', window) // 'mozRequestAnimationFrame'
        return testPropsAll(prop, obj, elem);
      }
    };



    // Remove "no-js" class from <html> element, if it exists:
    docElement.className = docElement.className.replace(/(^|\s)no-js(\s|$)/, '$1$2') +
                            
                            // Add the new classes to the <html> element.
                            (enableClasses ? ' js ' + classes.join(' ') : '');

    return Modernizr;

})(this, this.document);
