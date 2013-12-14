
/* jshint debug: true, expr: true */

;(function($){

  /* Constants & defaults. */ 
  var DATA_COLOR    = 'data-ab-color';
  var DATA_PARENT   = 'data-ab-parent';
  var EVENT_CF      = 'ab-color-found';

  var DEFAULTS      = {
    selector:   'img[data-adaptive-background="1"]',
    parent:     null,
  };

  // Include RGBaster - https://github.com/briangonzalez/rgbaster.js
  /* jshint ignore:start */
  (function(n,t){var a=function(){return document.createElement("canvas").getContext("2d")};var e=function(n,t){var e=new Image;e.crossOrigin="Anonymous";e.src=n.src;e.onload=function(){var r=a();r.drawImage(e,0,0);var o=r.getImageData(0,0,n.width,n.height);t&&t(o.data)}};var r=function(n){return["rgb(",n,")"].join("")};var o=function(n){return n.map(function(n){return r(n.name)})};var i=5;var u=10;var c={};c.colors=function(n,t,a){e(n,function(n){var e=n.length,c={},m="",f=[],l={dominant:{name:"",count:0},palette:Array.apply(null,Array(a||u)).map(Boolean).map(function(n){return{name:"0,0,0",count:0}})};var v=0;while(v<e){f[0]=n[v];f[1]=n[v+1];f[2]=n[v+2];m=f.join(",");if(m in c){c[m]=c[m]+1}else{c[m]=1}if(m!=="0,0,0"&&m!=="255,255,255"){var d=c[m];if(d>l.dominant.count){l.dominant.name=m;l.dominant.count=d}else{l.palette.some(function(n){if(d>n.count){n.name=m;n.count=d;return true}})}}v+=i*4}t&&t({dominant:r(l.dominant.name),palette:o(l.palette)})})};n.RGBaster=n.RGBaster||c})(window);
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
        });

        /* Handle the colors. */ 
        handleColors();

      });
    },
  };

})(jQuery);