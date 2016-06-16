/* jshint debug: true, expr: true */

;(function($){

  /* Constants & defaults. */
  var DATA_COLOR    = 'data-ab-color';
  var DATA_PARENT   = 'data-ab-parent';
  var DATA_CSS_BG   = 'data-ab-css-background';
  var EVENT_CF      = 'ab-color-found';

  var DEFAULTS      = {
    selector:             '[data-adaptive-background]',
    parent:               null,
    exclude:              [],
    normalizeTextColor:   false,
    normalizedTextColors:  {
      light:      "#fff",
      dark:       "#000"
    },
    lumaClasses:  {
      light:      "ab-light",
      dark:       "ab-dark"
    }
  };

  // Include RGBaster - https://github.com/briangonzalez/rgbaster.js
  /* jshint ignore:start */

;(function(window, undefined){

  "use strict";

  // Helper functions.
  var getContext = function(){
    return document.createElement("canvas").getContext('2d');
  };

  var getImageData = function(img, loaded){

    var imgObj = new Image();
    var imgSrc = img.src || img;

    // Can't set cross origin to be anonymous for data url's
    // https://github.com/mrdoob/three.js/issues/1305
    if ( imgSrc.substring(0,5) !== 'data:' )
      imgObj.crossOrigin = "Anonymous";

    imgObj.onload = function(){
      var context = getContext();
      context.drawImage(imgObj, 0, 0);

      var imageData = context.getImageData(0, 0, imgObj.width, imgObj.height);
      loaded && loaded(imageData.data);
    };

    imgObj.src = imgSrc;

  };

  var makeRGB = function(name){
    return ['rgba(', name, ')'].join('');
  };

  var mapPalette = function(palette){
    return palette.map(function(c){ return makeRGB(c.name); });
  };


  // RGBaster Object
  // ---------------
  //
  var BLOCKSIZE = 5;
  var PALETTESIZE = 10;

  var RGBaster = {};

  RGBaster.colors = function(img, opts){

    opts = opts || {};
    var exclude = opts.exclude || [ ], // for example, to exclude white and black:  [ '0,0,0', '255,255,255' ]
        paletteSize = opts.paletteSize || PALETTESIZE;

    getImageData(img, function(data){

      var length        = ( img.width * img.height ) || data.length,
          colorCounts   = {},
          rgbString     = '',
          rgb           = [],
          colors        = {
            dominant: { name: '', count: 0 },
            palette:  Array.apply(null, new Array(paletteSize)).map(Boolean).map(function(a){ return { name: '0,0,0', count: 0 }; })
          };

      // Loop over all pixels, in BLOCKSIZE iterations.
      var i = 0;
      while ( i < length ) {
        rgb[0] = data[i];
        rgb[1] = data[i+1];
        rgb[2] = data[i+2];
        rgb[3] = data[i+3];
        rgbString = rgb.join(",");

        // skip undefined data and transparent pixels
        if (rgb.indexOf(undefined) !== -1) {
          // Increment!
          i += BLOCKSIZE * 4;
          continue;
        }

        // Keep track of counts.
        if ( rgbString in colorCounts ) {
          colorCounts[rgbString] = colorCounts[rgbString] + 1;
        }
        else{
          colorCounts[rgbString] = 1;
        }

        // Find dominant and palette, ignoring those colors in the exclude list.
        if ( exclude.indexOf( makeRGB(rgbString) ) === -1 ) {
          var colorCount = colorCounts[rgbString];
          if ( colorCount > colors.dominant.count ){
            colors.dominant.name = rgbString;
            colors.dominant.count = colorCount;
          } else {
            colors.palette.some(function(c){
              if ( colorCount > c.count ) {
                c.name = rgbString;
                c.count = colorCount;
                return true;
              }
            });
          }
        }

        // Increment!
        i += BLOCKSIZE * 4;
      }

      if ( opts.success ) {
        var palette = mapPalette(colors.palette);
        opts.success({
          dominant: makeRGB(colors.dominant.name),
          secondary: palette[0],
          palette:  palette
        });
      }
    });
  };

  window.RGBaster = window.RGBaster || RGBaster;

})(window);
  /* jshint ignore:end */


  /*
    Our main function declaration.
  */
  $.adaptiveBackground = {
    run: function( options ){
      var opts = $.extend({}, DEFAULTS, options);

      /* Loop over each element, waiting for it to load
         then finding its color, and triggering the
         color found event when color has been found.
      */
      $( opts.selector ).each(function(index, el){
        var $this = $(this);

        /*  Small helper functions which applies
            colors, attrs, triggers events, etc.
        */
        var handleColors = function () {
          var img = useCSSBackground() ? getCSSBackground() : $this[0];

          RGBaster.colors(img, {
            paletteSize: 20,
            exclude: opts.exclude,
            success: function(colors) {
              $this.attr(DATA_COLOR, colors.dominant);
              $this.trigger(EVENT_CF, { color: colors.dominant, palette: colors.palette });
            }
          });
        };

        var useCSSBackground = function(){
          var attr = $this.attr( DATA_CSS_BG );
          return (typeof attr !== typeof undefined && attr !== false);
        };

        var getCSSBackground = function(){
          var str = $this.css('background-image');
          var regex = /\(([^)]+)\)/;
          var match = regex.exec(str)[1].replace(/"/g, '')
          var image = document.createElement("img");
          image.setAttribute("src", match);
          return image;
        };

        /* Subscribe to our color-found event. */
        $this.on( EVENT_CF, function(ev, data){

          // Try to find the parent.
          var $parent;
          if ( opts.parent && $this.parents( opts.parent ).length ) {
            $parent = $this.parents( opts.parent );
          }
          else if ( $this.attr( DATA_PARENT ) && $this.parents( $this.attr( DATA_PARENT ) ).length ){
            $parent = $this.parents( $this.attr( DATA_PARENT ) );
          }
          else if ( useCSSBackground() ){
            $parent = $this;
          }
          else if (opts.parent) {
            $parent = $this.parents( opts.parent );
          }
          else {
            $parent = $this.parent();
          }

          $parent.css({ backgroundColor: data.color });

          // Helper function to calculate yiq - http://en.wikipedia.org/wiki/YIQ
          var getYIQ = function(color){
            var rgb = color.match(/\d+/g);
            if(rgb) { return ((rgb[0]*299)+(rgb[1]*587)+(rgb[2]*114))/1000; }
          };

          var getNormalizedTextColor = function (color){
            return getYIQ(color) >= 128 ? opts.normalizedTextColors.dark : opts.normalizedTextColors.light;
          };

          var getLumaClass = function (color){
            return getYIQ(color) <= 128 ? opts.lumaClasses.dark : opts.lumaClasses.light;
          };

          // Normalize the text color based on luminance.
          if ( opts.normalizeTextColor )
            $parent.css({ color: getNormalizedTextColor(data.color) });

          // Add a class based on luminance.
          $parent.addClass( getLumaClass(data.color) )
                 .attr('data-ab-yaq', getYIQ(data.color));

          opts.success && opts.success($this, data);
        });

        /* Handle the colors. */
        handleColors();
      });
    }
  };
})(jQuery);