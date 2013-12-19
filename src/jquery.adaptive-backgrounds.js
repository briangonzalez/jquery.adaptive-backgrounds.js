
/* jshint debug: true, expr: true */

;(function($){

  /* Constants & defaults. */ 
  var DATA_COLOR    = 'data-ab-color';
  var DATA_PARENT   = 'data-ab-parent';
  var EVENT_CF      = 'ab-color-found';

  var DEFAULTS      = {
    selector:             'img[data-adaptive-background="1"]',
    parent:               null,
    normalizeTextColor:   false,
    normalizedTextColors:  {
      light:      "#fff",
      dark:       "#000"
    }
  };

  // Include RGBaster - https://github.com/briangonzalez/rgbaster.js
  /* jshint ignore:start */
  !function(a){"use strict";var b=function(){return document.createElement("canvas").getContext("2d")},c=function(a,c){var d=new Image;"data:"!==a.src.substring(0,5)&&(d.crossOrigin="Anonymous"),d.src=a.src,d.onload=function(){var e=b();e.drawImage(d,0,0);var f=e.getImageData(0,0,a.width,a.height);c&&c(f.data)}},d=function(a){return["rgb(",a,")"].join("")},e=function(a){return a.map(function(a){return d(a.name)})},f=5,g=10,h={};h.colors=function(a,b,h){c(a,function(a){for(var c=a.length,i={},j="",k=[],l={dominant:{name:"",count:0},palette:Array.apply(null,Array(h||g)).map(Boolean).map(function(){return{name:"0,0,0",count:0}})},m=0;c>m;){if(k[0]=a[m],k[1]=a[m+1],k[2]=a[m+2],j=k.join(","),i[j]=j in i?i[j]+1:1,"0,0,0"!==j&&"255,255,255"!==j){var n=i[j];n>l.dominant.count?(l.dominant.name=j,l.dominant.count=n):l.palette.some(function(a){return n>a.count?(a.name=j,a.count=n,!0):void 0})}m+=4*f}b&&b({dominant:d(l.dominant.name),palette:e(l.palette)})})},a.RGBaster=a.RGBaster||h}(window);
  /* jshint ignore:end */

  /* Our main function declaration. */ 
  $.adaptiveBackground = {
    run: function( options ){
      var opts = $.extend({}, DEFAULTS, options);

      /* Loop over each element, waiting for it to load  
         then finding its color, and triggering the 
         color found event when color has been found.
      */ 
      $( opts.selector ).each(function(index, el){
        var $this = $(this);

        /* Small helper function which applies colors, attrs, and triggers events. */
        var handleColors = function(){
          RGBaster.colors($this[0], function(colors){
            $this.attr(DATA_COLOR, colors.dominant);
            $this.trigger(EVENT_CF, { color: colors.dominant, palette: colors.palette });
          }, 20);
        };

        /* Subscribe to our color-found event. */
        $this.on( EVENT_CF, function(ev, data){
          var $data = data;
          var $parent;
          if ( $this.attr( DATA_PARENT ) ){
            $parent = $this.parents( $this.attr( DATA_PARENT ) );
          } 
          else if (opts.parent) {
            $parent = $this.parents( opts.parent );
          }
          else {
            $parent = $this.parent();
          }

          $parent.css({ backgroundColor: data.color });

          if ( opts.normalizeTextColor ){ 

            /* Helper function to calculate yiq - http://en.wikipedia.org/wiki/YIQ */
            var getTextColor = function (){
              var rgb = $data.color.match(/\d+/g);
              var yiq = ((rgb[0]*299)+(rgb[1]*587)+(rgb[2]*114))/1000;
              return yiq >= 128 ? opts.normalizedTextColors.dark : opts.normalizedTextColors.light;
            };

            $parent.css({ color: getTextColor() });
          }
        });

        /* Handle the colors. */ 
        handleColors();

      });
    },
  };

})(jQuery);
