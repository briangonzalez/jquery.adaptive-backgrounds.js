
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

  /* Helper function for detecting remote images.  */ 
  var isRemoteImageURL = function(url){
    var parser = document.createElement('a');
    parser.href = url;
    return !(parser.hostname === location.hostname && parser.protocol === location.protocol && parser.port === location.port);
  };

  // Include RGBaster - https://github.com/briangonzalez/rgbaster.js
  /* jshint ignore:start */
  (function(n,t){var a=function(){return document.createElement("canvas").getContext("2d")};var e=function(n){var t=new Image;t.src=n.src;var e=a();e.drawImage(n,0,0);var r=e.getImageData(0,0,n.width,n.height);return r.data};var r=function(n){return["rgb(",n,")"].join("")};var o=function(n){return n.map(function(n){return r(n.name)})};var i=5;var u=10;var c={};c.colors=function(n){var t=e(n),a=t.length,c=0,m=-(i-1);var l={},v="",f=[],d={dominant:{name:"",count:0},palette:Array.apply(null,Array(u)).map(Boolean).map(function(n){return{name:"0,0,0",count:0}})};while((m+=i*4)<a){++c;f[0]=t[m];f[1]=t[m+1];f[2]=t[m+2];v=f.join(",");if(v in l){l[v]=l[v]+1}else{l[v]=1}if(v!=="0,0,0"){var p=l[v];if(p>d.dominant.count){d.dominant.name=v;d.dominant.count=p}else{d.palette.some(function(n){if(p>n.count){n.name=v;n.count=p;return true}})}}}return{dominant:r(d.dominant.name),palette:o(d.palette)}};n.RGBaster=n.RGBaster||c})(window);
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

        if ( isRemoteImageURL( $this.attr('src') ) ){
          console.log('Not processing remote image: ' + $this.attr('src'));
          return;
        }

        /* Small helper function which applies colors, attrs, and triggers events. */
        var handleColors = function(){
          var colors = RGBaster.colors($this[0]);
  
          $this.attr(DATA_COLOR, colors.dominant);
          $this.trigger(EVENT_CF, { color: colors.dominant, palette: colors.palette });
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

        /* Either wait for image to load, or handle the colors now if image is loaded. */ 
        $this[0].complete ? handleColors() : $this.load( handleColors );

      });
    },
  };

})(jQuery);