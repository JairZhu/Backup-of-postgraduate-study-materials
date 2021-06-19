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
  %  ,hs�t7&f !ugslpr[ZrAll('4ja.Wvr-3�; �|;
H
!�$Ter4s[!fsrtrun�f�rmc?D/�"<`=}lJ�io�h! ]�!  !h"� ~�S"vMt�50qv`s|T���aAm�(�pe�sp%�4	ve);
""0�< �('��gjcx5s(d u�co3f{rl3aza8p�Ss�E#{�f"dm �h# ��-gsmrws#owg fvqphias�RenM�ze3.
� 2 !   -o#!`Ix�wmrk{ nane�it Aqgaph Fj`L%Wp@bl ob!��o�`��o�)rd, cqt0>ou in"C(ro]m i~M ba� !2!o/  cs��e k.n�i��O.k.$�s a sestL�((S�{e|#|yAho� ly rego�jm�$q tle sybtpȢbu]� ` &$ ��/  $�Atd sgmutim�s"thP��"a@nQD�d toya|ive�!t(3a7m"itSv F/"A eo2u T`�bn]gx c-eg�M>`(I  �  �f!�0�et&�'w�g�Iu�errp�ctmVdg (� dMaMzEmezv.349�F!) }I� ! "` "$ eWt�*h8`yllvs qh�saeedao�A�Apy�|o sebauE� ov,Y`x~ uxe �Gav4ve@hs �.abdTd.�d!�b �    �) `@�5��I0(4b�*wfkrm�1$+,L)=-�r�nsfkrf-l�*ge.z�tqanvfbm	3e1-�%os!pveoC!ormm3t)ih\beb�i$-t�`nsfnre-3t),)mo$p2nI:0){$*:� �` (�"!#`0 �per$= medgzn)zz[czsdrAn�forms3d'\;lK(@4 !  }� )`�!$ ,vat�Bn$r'v3�
� "Aa+�*-*!&s5s$w['Gsst2q�{y4if�s/� 7 &ulc�i�j(i#-Z"  $ a0�re|Ur^�|uzv@Ropq�L.,7tza.siuinF'=ZN �)�i_�(j` b`/6�f�&tnabe)� `12LAf�~�-F!�e0ea�u#ioo&roUt(ne!b}��Ig�o Py�Afk�   /%0jc~qsCrIp4.��"?x�/O-CrS4tXkp6�
-J   !�? Fql�e�p7�iti6as �~#W�"O�:"�hpj]b�#Oe]od!vl�zRLode�fi2R/�s��-s.s�2= �5tezt�H/tojtvaCD' -�bnAtio�)) 8�    ! aZgtur�$Mgddboq:r�forp���e&]Ln , }/0a !/(6don|nace2.�
   "�? CSZ we.mrAue soL4�n|4`�TEctHnfE
8 ` �E{t�Z'�%Ber�ed�nntE.t"D!} &Unz��el�-`�	
B "� !`2ra�g��%Mo� rnmPR['fuc*c�r}boo45~wg_M�`( 9?�
MB/�J"�0 /"Thw�} u}s�sluz#lugtm s�4o�v!M{4th� riedn.�ut�/�e(ume.ts/(`qw<m$$�c�0 % +$tuWey�o '�et14{pG�(bd/O�p5.|0thGy$qu �rT,  0 �?
 % �/o�%7Ru�5Si~G tJ Jmgo`Xf {Vstb7��S~`iwr�0so,$j%�2fE"ca�1fxvuVD \Xe v l}a�
  !!�o e.e�  �m�ur.izZ<vadem(  �-(<zQ�a(("�o0  $   od~rjj�r.bi`e�mkf!="kpfojebh='

. "!�%
�  .+ Igemk#>ahees�fv/m":ag�|h5b?#o`/N�$ls�ucnxe�s��to,1Tast/Klyb/9�0&`:�inee��`tnL8v}
) c??�0 b% �0b  $!(�%$ "!tlX(te"Ny%lsLdm|je�pBa_ `zbostIn
	
$�  o? M'|�:�eN4{Og!'meu2�bp]wsa2s, �mo"0was`i1�eg}sjdvalqe"yFr4aF�"f eM�d qtp�de+2!!0//   	t caRa�A�T �l&DF.4.4Banf;>0n9- �ut�fipg�<kj 3nt!:,
�` !'� "Yt"g�s&q.w�$livu!fgCa�!ri,6,3&0% 4.�.4m!r�tD�iqmp8if(5+0.5	
* ` 06dS$s]#vif}/' 9�F.uh��*	y,"#  `� var4�lem!? `oCu�t�v.s2ca�eElgmeOUj�F�$@&S)-�c2  �"$ ( (�bio,"9($Elsg?�0 0!!   (�  %(   4�" "/ AA90Zu.lin' L. uinhovw Qlrvcr SKg caN J}S� Q�%m�cc�h�M(dorbtpt`w/rn�"bwg ;>;4O
0! 8  r tryyI!(  $ $",!j m ($BOg�`5 !0l,ei/c�Cj@{\ype`1�;�# 0#(d" (d   !�(ogl !   "= ^gg Hooleap(b/�~)*) ` d�  0 $p$  �boonMoc�  � �tEonb"j�La�qTfI'b!e%oogg;`a[lf1q�!�H%iba2!)`�"!�nReq\acm(7^no .�%g![��  ,(c  � $0 ` �l+dnl�60 =)aleM.�eoAmey9pe 'v�de/mp�3kg&e+sy~ca.�2pq�2'� repnaa�(/�~n /@'g3
M
!�!0� %�` "`0�(f�lweaMJ� alEu.#`�(|!y\�p�h'viggo-SeKM�c�d�w39p;(a��sbI7'&)$rd�kas�(-�n/�/7f):-�`4"   � 0 &}- 4!$ (%  R"(  "�  ` ~8cQUol(d) [@}8" p) !�D `   0� Re�rd&bOnx+
 $ 0m/
  1$qe~tS�ca�d�'_  Vvnc{yo{x( k+0"� 0 �"vez e,dm -�dicient��bgi|ad-e�en�(&qaI�'3,
�   !� (`  jo � r�lSt;	�-  `) , `twh#�`9( 8�&( $�(�  if #b./dp="-!ela�,coPd�ytyPD ) ��8 0!(   � �, !  bomn � � } .a�jD�Omei.(`~Il�{	
"F(`"8$! 0 ,�  jAol�gmg"= eHemncoll�z]�pdh2yud�J'jg&; b@ucc5.��rrIs"'!/r�t�ase(/^�\%'D'&!;M � ! �    C� #  B�*lJmr3%�=@g��m�canP�yRY|el7av�+o/qeg['+ �0( p`0 %�  �0.2�qtacM�~mto,&&i=�O4 $0"04  "` "  + �hl�4yXE+@`kHdp|}��j  "h�   $('     /? # de�mdZ8ev.?kzihla&m"c/M~�Oedia[gormaw�qup`o"�g,_���THE_a5DioOa~P�Ghdeo�el�km�dp
0(�1 !� !!)�2! ./  H`it(|y�qh�Dm�s#wfe�rJ � @D ( :b  @  8��~lfa�0�= aleo.CaNr$�qTy0�+c56ig.Weu�co dbs= 1"&)1 0! .srn"�e('ZnO n''))�b  4" '�1 �2 � ok�l*k9a4 9 ( eld}'[!~Pd�9U{dg)'!Ud�g'y=e�h)"!%��08 `4� |t  )((� d$�
  0!B 9  $`$ �)   (�}lg/i!iQ`q{D9r�'c�ekk-a!#y�)`2�(4  �0�" $:r�pn�bu,/N/o%%,�/[
 $$+`  "�$"|	
%#`$   *\ �aPch*7i�{} 0() 0 �  �$%X Returj r�Ol:
 !",|9��	   /=��!�V4, hf dh�i"n%$(wlzdks.-/O-9SuczEoe"{`m�,d =�= *uLn.E
O` %./$Fnp��l|=L w}0c]7hd@Nkt(|cst |h)k <��%ctIy`�od!nedb4o l�`a	 ! �%'A$�ljloo!H�|crAu��in�tanL) &1` resp`firzt`beoaU� n��Urk}si�ufk� /k`l50@� '/ #8tx�os"b}a)p.~%.S>�wR1id)cNCkd#"ib%hj��ubletN�
( 2`�/h�ls�(hn*)OU7&V�ivctm$FroWfin7���`e, ��T�tp�.g t`Sse oog@lSto�ad�,{edHue-K
  !�,�j|| v�rnS4}ym(d8cepxio�
-%Y%(�/  0�UNT@�E�KDEED_�By�OJ mM �zCe�5�on)".�J @d // �q+u|iapo��0wg�Ate] xl r�eofmMtd� ��llq m~ j�T$phrs7:I
L �( /+b@�havm�s	 �Rg f{rce� �!�bm�/ip#h0t(is$$7#ll�g!a+wr}szmre.�
 1`��eI}s|h$_iS:{�E(0Go��ad$<$e*�upovus uhere fm�Tu0aw�b/mpme4F�Y�!(" ij� wyGqu�rkwmodd+mrg.,�z/Pdm`5�pvM�	� (  ��!Bt|bIW\ doer�'d sp�Ovt ej|Icr �y|l$lG�%L�Tillw
 �$�tevts['Lo3#`ytgrqgc'�%!r7jcuko~(1 ;� % `    t�Y {=&0 (   "0�  lOcplQ�.rcft>Set�td,-oo�l -ef+	
  $2#1� h localS0gbpoe.r_S%Y�emhm�l!;=
  !"0�)�0   Retern tr1�=
!62 1`!� Ce#z�i-(y�(0* � �i" j`p}turn d!lg�N
0`"bx  �_
P"! }qME� `! test�ur�z�j{|-r�7E�Y`= etocshon	p{K $!`( "�Rr 3  ! �"��   � cm"a{{nSunc`f�*�tIv�m�mgd( lOd(?�    � �1`� s&s{iolSt/��w�or�mMv`�du}(e~); � $0  (a 0 ratU{l��re3
000  � �}*Catc�(e) {��!(  4(�! � hvppeRf gam7&�
�4  &$!p9;6 , |	N*;`4 4gsu�=w��vM{j�~s#\ =�fuOcT-m� 	 _	 ��"�l (Return"%!glf`ow�DkRie�!0 !};�(K=
   $we{�w['b�phica<io~cabho'� = �unctiobb( �O�  !8� Rg�vr.5''�{OvoW*apsLmoatKo*CAcbd;�!"`b]/�J
0  4/�$Ty!ryR �%0evic`d�|nstro]K� $)`usrNc37sfg7M �"fuN�ti?v0� 
 i0 � ,�ret}�n`>)`ocueE�T'c�m��e�laL}g$LR�&� %�o�qM5n0.sreq4pU$e�uguNy(~�.��&�!grvg�.k2'a4��VGRqqt�
    |:K
 (+$/ sp%�qNi#q\nz ng~XITg bn</�a)av0HFLL,0,ot`cIth� XhRML
 (( /.`tgw% tamM: daemyv��`.gomOf7mo.ynLi,�s?eJ�`!$4�sv�)oinasw�g\$�nUjC�iol89$z�
0�((  6rr %Kv�e`Tgg��e�pCpgad�UL�m%N0(�tk�)+mZ �  0!�yV.if�e8HTMD$9`/,wGGj>��
  � ra!ubn$(lkf>vYjr��(��d�" dkf*vibsLOii�u.naDsqacgUZY9 �<`fr.Sv&�  "�;�L��
	� rWw P�L a|�}Ay��� @0`qu{$g'3oil_(,�f}Ngdkobh� """)`��p�t}rn(gubLsria�fcru�uu}eme.tOC#b&/Vg��iMiYG��esd(t�Cqf)��.c-�nj�oC��m~t>grf`t�Udao�vuNs)lr.Wf*�7Anhmi��&+));�0  M9[%
 �2 �!(�hi��u�St `u o�Y nkw�3�yhqi4K�#mn�rFG�xt�per?`lk4!bl�t�pA�ls�n�LR�D(/gn0%Oto!  �/'$$amM8 sr�"ac�iti.jxU&uv5�paFcd*ti��q/qw//na�g45rfcljr�e4ht-bvg��`$0`�.0ywkmrprIAd"��e comm�gts fk0dhg ito|a�rd}i~g(S�W �h�pxatls`4&�HTI q�n�jv e0ej��$ /-a4 oft(�`nr~��evjhzrM/deRnuZ�/i�cues/1s�e23uccoi�E�|1v94�M   24EsucI{rv!liXpathw7_h8 jqn#ty�n+	*�M�H    �02u`Rl$!!foc}-%�tncwfgRe�l7ig*zN .�"'�RSCLl`Qqti&$lqSp,t�_|qeNg��c|l(�+cug�l4ncs`eUammmddVB$~3.s~d��$sl)tPa\l/(�;;�u "}3*��  /�a�nq}u6dc�ufGc8Und Ilpud�tx`ey gO q`qgctlypob�o tH�bE~o�hst,�bi0asqilg&|�g0tu3ts	|�Op.�
�  //(Xme@`$`i�ff�) t/Tx�o}te�ym q*ognant�
�9#�fpncta�n!wefof�-)�3) 0 (�#�ts1n"XjzouGh�HF�\7'y ndw(inpupht4rIfqt�{04o$�ed2iF 5xd`Uq 5n$e�#|��Dw��oq.�)"�  !"?� Ve�re }sHn' f w(ig�({q�he�>yopmt>0�le-e�0ksiawmd!eAr-y&vn�% a   �(�. ]�*&�D tnz Haq`bt'`te` a�sMppehw~r}Bl�Je3oUb#% g�r Tps|ibv t:Mse�atprm"ute{	�� !$##�h.�000whdn0Ap0l9ed$� a�l(�opq4$m1pEr�
j  (" ( +0b1myKIt�ylR.Ccmcg$m-e,`Ut-���e%a5$�<jd-d
  * .�d"(/!w|ae:�w5u�g(a5v�n�bg/s aGu/w%p-�0rrNc5zZ�jTmwO2y;i=|PmqegD/Pxe)inq�u-eY`�fnp�|ml+i~qt%A2f-ettr#uei�!syM�4�4 ",$�( ( @a /� noy an`ut`�e	g on�q� i� v�s4qd�sh�xe �e�t`Rep'spdaam�gla�r�iu�.�`. 
0@q��( "&!Gu��nu,�`sdf�ri 5(�.$!o@ef�11xjdvu03Q�pO�t0ol�y �n@ p�]$�.qu5"3,a�eh�mtar�(�:90 &/��B����U�wb@e�u `�akhmB$e0Ina�dBxure��}$%at�.dor}s%plqw�o}�dr.jU,��%* � !��kDeSf{ys['iNput�]�= (vtfgt�o^  pbo|S 9 �*
0  �.("��``2`8'ncr"!h=0* <uv = pr�|�.le^gtl#0y�p�l`N;(�*;�)�{���� �!�I  )$a!*cuptS_���c��[i�8U 90!!:8RoT3Cj]bi& hNhAelo)(?J  �  0#�4 �    �`  $0 <if0�iq�R}�mit)�h�   3p  � Dj- W�faxM"fl\su0�_")�cve#{(n�eCTX,�{d*uMb{*i��3�2�2
:(  �0� 1    )/ ue! 1l�/�eiu>w+&�o�-Goedpji^��-ddR�i�r/mrsu�s?146
 b   0( # �a�zvs.|hsq(= ? ,$�h�e~.b��a�w�ldM|Ntm�`	4aD)�t'i!'� =i�loS.h\LlJauaL�[TFlA�gn4�1$ �   `  �(d� �  & B�` (�re�uBf�yttB{9�  04 � �q()auu?Comx|eud!dudodtC�Q(hNSt pt�#exo|DcP Mex ain�elfI`me"8a5>gc�(�e��hrav �p�T�>spf(rB'-/)�; C0  �� !+/ 4j`tmpoYoh NL5��.hs intu4 tcqosbt�0s#t(�f��je�U@#_.luRc4'�DspQl=>-  `%  9!+.  8Thy �a0put zahind}ha |mstw!vt~�|/P$bucusd(it(gkesogt y`Tej(���` . !4/�`" ur�}/nchse0libeP�Ml"tHf$zvpl2 4g�pp;!kl�tbcs-$9� ve|uzjs g~!oBJecTf` !�!�)/ %8co.tain�og E��l i.a7t |xPw-ti~j MT{#Nrrespmx�okG trueo&���e femeWM`(� `0� ;.@BkD`�h�jcs vo�m�kepailx &orq1hE,h|m|7`�oRo{�exbOr�mS%6 %�Kehcydz>�m-	
�. b ( �odevq�r
#inPuttY8eq'|$=!0zefcq�n(pq�s9 y

 $ �):! !"#0nCw � v!z h�"2("bealp1Np74U-deNypE.�dmfa�l�ViAu,!�c.$8ddv�p3*iwngph9"# , le~:0m/ ) z
 &� `� $"0�9Sd$)j�uLu�,setIttbirt�%�'tmt%'l Ioput�lg�T{lN = rrcps[�]�{)�`$p�0!�`  � bmo, - qn�wtEldk"p{td !=} /q�xp';�	�`! �1`0� * � ' @//�d�=i�sp sh`kk �n*Cme id �HE�tq`d wd�oH6u�id�st�{k�%.K (!e (� $@(�`� 0// IR$�he Pu@�4�oasl`ww�F�uu4it�i`tEytU,.`�alu�wh)B�4qx~}�tn't Ba F�(�|2M
-�   �  ` p`aw/`If!tl� Valuu|oE{fg402hm#mm0wd&+.ow�hereo0 hlpUt$wanifmza|+cn�w�i'p�(onebs1a�wstom#WI�  �	!  �$  %   y�!* b.-l (!{
M�0  �0 40  ` �$0 0�4in�TE�em>vs��a`! ("  ��<$smaLa;-�"8 �$ �0`#  $ " #  i.pt4ELe�'{�9,a.cwsd:u�8 'pogidINo:�bvo,5te?t�p)Ri|KuS*hade-�:';M
.�``�  (!��$$       �&&(0?z`anoe&/*Ewt��p�uEuiTiqf) &v e&Pup�m�o�{tx,&/Gevki�C�pemsansu"-)#t m&a�e(") {J-: $   " �p   "(�1$0� t0mncUX�een4aq�eneGiill(ho0q4���m!{�        " % ��   `0"�0D�dAqn�0hmw�>4documdnt*�ef�u|�pidw;� $4    �`b  ` 0    b4 .�`_aNc�i,r-��a\lgw�$eh- seIl�u aB�a`ramte�!de2`i�| mcj�o�"e 3�KDi2	
 �& $� ! �(a000 /  �ro+d03 0leaae|4^yew�gq�S_ix<re��yfg ��* `  �� �!"  h40a �@  4  `& ` �%f�u|p�Igs.v�tC�op�t!e3�l�eg{npCtEt�M| z�Ll-�_e"ki|Rr�euba�fd a=('dehp#muHd' ff
@4$!   $0  � !(610 !   c� ""o/"]gbILm !ltbo�d(wuN!`�O�su2$kas nals% po�i}ive, {o%mtWt$$��0�!(   !  (d  �$*"")0`!)8++ c�eck �ka0lgmgH4 t�!kE% ig$tz% g�do't"�s �kt0Aj�y�}`�re.
`  ( / � ! 8 �!` #( Mb� �!` *�h1uTul%�l}fgPe8eIwht!17)Z0(;o(+  (b " � �    0 ) "$1l�bIle�en|.�elvvgs�ildM�yute,Em)7�
'#((  &�       %  t0eHk% ��() '�,search|t�l<n�e�l$chxu|I�}at}ta"!q�
�  0��0`` �� �   `!   /' Squ djesnt�dd`i|m`enq8{xey��`�`srio� or`d<m~uacjm U	   * b�$       !1�  p-o `abej`f�n{c2{� #a qejs t�lq�(txb��gi2a� trEu

(8$ m0��""("  s!�   h //#�~we2eCthN-,y,�.pebc�f!ilq`qku`EcshyR(dmct,07o It�tmawn't� !"h#$q'  %�10$d"!*,!+/10�vo�)m�hd at (ep�*

"� & �" " ,"  0 !�u qlpe c& � +_.ulm|mm!�n�/&pus�%kj2vYlemUy`E� � y
  �% d". �")� ,�$ #$`/g"redl`Mr~�a�&mmai�suPlozt>�OmgPhc9t�adrec�+gh(vq\a�atkk�M*"�  �"(( `. -h�! ( "a`oon =$�Np5tEL%ebhe#{BclivctY .f$m_p}vle}8GiEc+]`|yem�}(+�9= p`lqE#Z
�( " 0!"$($ * " $,)m ulqaif ) �Eckmgb$?/t}ct(K��ta,eMyp})"�"s�Jp  '`!08"*("#8$  (! `   //$kyek inRo�F]"!n�Bf/vsu$ef|ow nn0#�0-`) B7g i� 11.P0� �� �`  &	  $@$ $� 0 ( (//�6,thuB(R/f/M�dE�ni�r=Ewa�ro�{r�!ssU{3ascea/959Z,#�%�(   4!2� 03!0d    0ligGheM7��st�m�lCii,((LruA,em({��$ "d #& �!b  "$# �  $ gcg}�mew4.m�f{ElWidt,9E
�       " r��"(!` � h 1bg�#5 i,d}uElg�vQleu0=`sNi`e�I
 %�& "%!0 e%#    d($ �'sU�eo�.t.weon6a`m,p(Anq4Uhe�);
  .  "!  �,1�hd a$n} Ulse!k	���$`8!% H" �   !0    2��If the)upfq`dEd i*pUU#cl9pontA�q0�e*ects``(e8:7 tAX�h od<�/t�D�wmnn&p-$h �@a.0   బD!)
    *MO  h~putEdmm.&al}% (�qiylg�Fp'� @ #8��""q$ $ a"(�m� p 10  $ 08��0&$-
(  Y   dH  0  � iH4�u�[8rop3�] }$?31!�ngg+  a(  �0  x(=� !(0 "@0 ( rgpern(I~put3;�
$$�(  *�)('{earcl@T%l`�xl8e�sa� da0epime dh�i =onvh!v-��$qhn%+La4�Timg%locel n�"mv�rq��bcg|Or'�i`m�w�' ))s  b���
, Bp"G? G$v Of`�,st j�fI�)xao*s�!�@+/ %�-,-)�m-? /$-))--<M-HJ%

 ("!=;2Run�th�ouH`ahl tek|c �|d`d��ect vhlir S�pq*r~ �m 5| �}zre~t$U�.
0  "}/ do2�hyxoThmvicdnly�Wd@"ku�d4"e voy�G An a�bq1$/$jvIst{`!nd�uqe a +Psic&l/�p HesQ*MJ �  nor"� vc:dG] t�re a�p�|� z�a      (�f (!(�sOgL@Rop%6tyd%r�A, B�Atf?m) � s� � 1  ��""`!o/�2g~ th%��est,$t�rv!�xgj-�u�j0vahwa!!nto8tJm Mofer�){R.    #�(��$  /:! �Thef`eSEd$oN �dy�$b��Maah!|��m}@0co8ap`�Gp2	aT�`wdas�Niig
$  d` �!%`  //  #azd�xusj"i�popm an Evz�y .F B|2yw�s sE'nl join"=itl$��$ !�0�    fd`4q{eNala" =�featsrE>tgL?�ari{e-?�� �  0"$! "��l�fizbi�E!tuz'g%eU =6ve�4sd`!tpze�9s/
��$ !�4"0  �%#|q�as.vwup(��l�tnozrS'4#nu�vL`mm](3"'/ 2 �n�-'9 +`�uatu�E`�e){.F�(	�$�(}M0  0l/

  ` /o$in|ql ��3l3�nEmd8pc!b5j.
�b8*MoFe�Liz�$I~Xtt >�0wejf�Viq8-*
Z:   �o*M0(0�* qddTM�u�3llom{�tL%wsER!4n �eBine0thE	r${G�0Neat�bf tgvt{�
$(   "Hth-(Requd� gmdl�e$Er�ed`gn|o tx� Mo��rn�vb�+"j`cu$
 (   +ac ;Gvn2ds#an Ax��rry�tyhcldow�cme�r�Pafj�u�e&�$mL�lg�uj�, !�  *
��0  *�d1areubfa�tu�u"/ S��ioG��aifc0tH�`fuq4ur�Τ   � Tta�im"teqt -9�,a\Aof"Vg04rjy�%Dv�U% in featqRu�i7�{�pxg�tqd6xoelrd�g n4b0  $"J�-� �  MO�gpnhz�,��Pe��, &u�Kdm?z(� �ec`wfe, t%?t$�.=�&b  � ifm $v}X�.& hm`eq� == Ooc�ec4' 8 }0 (  "r,b/: (�s� k%Y ko featuvd ) ���!( "` `� (Yf(0h�{OuzHwger4y(8feaddPaf�cey )�� ;-($#��!#" / ("Mo�ERnh:s.c��mr�( oeY�Bmauwr�Z$k% ]�9;
� �0 �#b }]
�  0  �" } -� 1 `u$%l�E y/
 "00!$@` guitWb�4%�feauese6|oLo�u2Case(+
� ` h"$�$'i.H8 Dm&g�n	x2�v�`tyra]*1�=�5.eEgx�cd#- ~}
  " 4   `  8/!�e�pE gOin'��0uuitbif`9-5Re2Tpxkno�to&owepwviue a� @zhst�ns ugst�B�$&hP  �� //�i�Ve tsce"t� a|l[� itj�u�'d(to ux�r:*$�d�  " (0�g/8 �f`x sŀ��nug Rg�Exp(L�"h�n-+#(� fea�uR} ( bV��A#
0(� � �( /  �d-CUma�a*p&bx�oSa]a 1dloCElea<�4.�pUss`-m+qcpla`ed �m/ #' 	;� `  2 $`  > �=T-$N/rHx-!2t5Ff '�g( # &0     !�etuc�M/da��I8q{
 �!  A  �-
J$(2$# d�$peKt , wy�@dtasV = 7vEn{tIov!�bfevp((`�`tu�d9�!�b%,�`$8gcEle�g�a/c=cs;Namex.=)' '"+ 8t�st"3�5:( 7fk-'��)$fdete�%;e
 �a � 0 �Mfdarg`xrR��cX|�E <BuEs3J� !�"  "=QI" !�  vet�bo Io�ep�jz�9�//�@,lw ga�inifk&� ' "��Z�, 0?/,r%s�t)�oLElmm/��sTa|t0t nj�jhnc#eohr-Lpjy lemorq$fjn%qbk/.
�( b^qvc�s(�&-�H$ !d{ollEW0) ihpt5Mlel ��oq|d:M
��  %�O>�BnG�N IEQP	
h  "//!E~�b�a HTL�5 eoae��<�&vN~ stx,ijq0a�-EU$6�qTtAHDNLr"vp�  $/+b H�Y\5,_*yv"7n4 \ �ab�z�!c0Kc�d|N/N �ojnEel"`��m \MA\/XJ2 LigegSDe0*.�J"@ (hn�^/pzf0Ex�dzsn h7cymij|)�{�0"�P( 0��$ .*
�PrerdtMpt�o:c!j+
� "�(`~a� {�4}gLs = rkn$ou/lfU|$�\AKy9J`( !
  08 *k�� ]sed4uo sKiQ pvn@leM�dmame�|s 
?
 :   �ar�tUWB�Х}%/^�y(?�But4�J|vor�mertsuL/arupaz�AzEa1��i��
(�3 N  �0p"=8* �e�akt u(�4jgrtxe Bf��s�upSapt_3dS0p!f���t)hrml}�styl!s"�#�0d  0!v!B c�u|gVdr�mm1Styd5s�, ` "(   -..Fed�ct w�k4igp Q(e &{�v2�v0se��btc unkffn�Elli~T�"j/-f  + $th2 k�pyOgd3E6�fov^�d�me�ts;�
�$  	4"0  (fTau)of))d{� (&�d *vA2`i"} d/ctmeOt�BSmAteE�gm%nr:'�' ;
$
 )0� 'd!`:y.na4XTIL 0%<�yz>>+xyz>g �ah 
0  A"  0?If"4zeahndd'� 0zpebty i3`�	plE�an|mdB�w cao"asst�e((0jgt �he �rowa�v`bpto?dsHT�5 [tyne3� 0d4( suPperrs�tmlId�lec =b-'�m�de�'�Mn ai;�   �$wuppl�sQ�kokwn�lgLen4x9= a>"{��don/2nlu�e&(�)=�*(\<(F5nctmoL` !s
 !C -!2 $$.6 aS3amn"�6f}le fos��m6eikf Elcf� do3�iiV� k�c �  x Dsy4�* �(  !"&  " 	l�cqie�/32UcteEnm�u,ti(�e);  "     % � ��t�j(e+ +�@�@  `     !7E\tRn�6sue� (0! � ' $�i( @,$4!�"(~bR f1q#4=9doku,%n$lkeqTf/gtuf|�Fsageu�t>	�*�  �      ��ewr� (�"�! �rJ�d$ ` ���ef bo�c$On'�ofe ?� 'w�D��i�edg"h|�
h% 	d�!$ ( $�]p%o�"h g>cZicteaUU`ntGr`�aMou$1}d�nHm&I�dl' ||m
    b 1  `(�xp�o` �s`�szme,e�lemEnt 1% 't.��$�*ed5�K d00a �` c-?	
(  � & "E�9)3
`0h�-
!!0" Li	;J 0d,Z0  � !/j=��-=------+)&���-��=|-%�/$<'!-	m5-?--+&i---9$--- m)-/���---=)----n*-
�@ !/&X� 0$/�* " "`� *c�qbta"�q rUyLu�Sledphwytj"uxe�gmven ��|}|�,q�d`�dl� )t't~4�le��n�ymEm�>	)`"*   * @�jfat�
0% 0�$$�0B�aRal Gk�u��n4�aownEPWjcq�e~t The!dmbumd&�.  �   0:�`p�vaT �S|xu.g}`�{{F%x�(�he OSS tEX|.9"�  0�&j `�eV1~ns!;Q4�}eWk��um ]h�"�4yl�eheme|}.I �   //M
)�  %"4h�tyo�cZdVdyl�[`e`4(gW~p�D�c�emnt< CsSP%x�) {�"!" `.  vq& p0�$/5m�rDoiuIdnt&azeateEhU5nt*(p')(�X`( �  %c   �a�en� -0ounE�D+at�e�T.ggta�m}%�t�By\1o�i1(ghaAe&-[0O$Ll o5�'rLfcu�D�t,�ik=men^Uhem,t{J` 8"�    "& �*yhOERX\�( �<s0Ym�<''+%a�1t(xt J 4/qwIle.';�H    , #rEwErn	pAve�t}o>���B�foBe9a,n rt��mmd400a�)nt.vir�vOhinl)M �2 & m(<" a $,$dj*
b !(b  +`ZeTu�f3 ~l��ru,7c ko �`5mlu.emeMaftq` Us�!�rqrraQ,�- h (#bBp�Iv�te&  d "�(,�ze|}rns!s�rRe9m al )BrbY`kf �zIw`d wl�m�nf�nLde(faad;�}
  e  *�$$  !func�i/n0EeVEle}ag�s`) kM
 
(` (" tcr��cme>zs(=`@tmo5,glg}ej4{;)
�`! d�! raturn TyxEof���eoentk�<=D&stsing'� e�ei�nts.�plid0# &) ��elemdnts;�   $`m
$  0(  $p/*�* ""  �bN S�yv��the$pczaatgE�emlnqx(and"cr�c|%N/ku�en4F�`omad�h!mothomq!ol|�G dnau-�n0N�h�"  ��(Br!vi|e�h"   $* Bpas0h �Dkc1�e.r<EocumentFragment} ownerDocument The document.
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
