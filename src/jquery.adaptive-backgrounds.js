
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
    exclude:              [ 'rgb(0,0,0)', 'rgb(255,255,255)' ],
    normalizeTextColor:   false,
    normalizedTextColors:  {
      light:      "#fff",
      dark:       "#000"
    },
    lumaClasses:  {
      light:      "ab-light",
      dark:       "ab-dark"
    },
	transparent: null
  };

  // Include RGBaster - https://github.com/briangonzalez/rgbaster.js
  /* jshint ignore:start */
  !function(n,t){"use strict";var e=function(n,t){var e=document.createElement("canvas");return e.setAttribute("width",n),e.setAttribute("height",t),e.getContext("2d")},r=function(n,t){var r=new Image,i=n.src||n;"data:"!==i.substring(0,5)&&(r.crossOrigin="Anonymous"),r.onload=function(){var n=e(r.width,r.height);n.drawImage(r,0,0);var i=n.getImageData(0,0,r.width,r.height);t&&t(i.data)},r.src=i},i=function(n){return["rgb(",n,")"].join("")},a=function(n){var t=[];for(var e in n)t.push(o(e,n[e]));return t.sort(function(n,t){return t.count-n.count}),t},u=function(n,t){if(n.length>t)return n.slice(0,t);for(var e=n.length-1;t-1>e;e++)n.push(o("0,0,0",0));return n},o=function(n,t){return{name:i(n),count:t}},c=10,s={};s.colors=function(n,e){e=e||{};var o=e.exclude||[],s=e.paletteSize||c;r(n,function(n){for(var r={},c="",f=[],d=0;d<n.length;d+=4)f[0]=n[d],f[1]=n[d+1],f[2]=n[d+2],c=f.join(","),-1===f.indexOf(t)&&0!==n[d+3]&&-1===o.indexOf(i(c))&&(r[c]=c in r?r[c]+1:1);if(e.success){var g=u(a(r),s+1);e.success({dominant:g[0].name,secondary:g[1].name,palette:g.map(function(n){return n.name}).slice(1)})}})},n.RGBaster=n.RGBaster||s}(window);
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
          if($this[0].tagName == 'PICTURE'){
            var images = $this[0].children;
            for(var image in images){
              if(images[image].tagName == 'IMG'){
                var img = images[image];
                  break;
              }
            };
            if(img.currentSrc){
              img = img.currentSrc;
            };
          }else{
            var img = useCSSBackground() ? getCSSBackground() : $this[0];
          }

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
          return match;
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
		  if($.isNumeric(opts.transparent) && opts.transparent != null && opts.transparent >= 0.01 && opts.transparent <= 0.99) {
            var dominantColor = data.color;
            var rgbToRgba = dominantColor.replace("rgb", "rgba");
            var transparentColor = rgbToRgba.replace(")", ", " + opts.transparent + ")");
            $parent.css({ backgroundColor: transparentColor });
		  } else {
            $parent.css({ backgroundColor: data.color });
		  }
         
          // Helper function to calculate yiq - http://en.wikipedia.org/wiki/YIQ
          var getYIQ = function(color){
            var rgb = color.match(/\d+/g);
            return ((rgb[0]*299)+(rgb[1]*587)+(rgb[2]*114))/1000;
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
