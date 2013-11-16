;(function($){

  /* Constants. */ 
  var DATA_COLOR    = 'data-ab-color';
  var DATA_PARENT   = 'data-ab-parent';
  var EVENT_CF      = 'ab-color-found';

  var DEFAULTS      = {
    selector:  'img[data-adaptive-background="1"]',
    parent:    null,
  };

  /*  Create a ColorThief object, which will
      do the heavy-lifting. 
      https://github.com/lokesh/color-thief     
  */ 
  var ColorThief = includeColorThief();
  var ct = new ColorThief();

  /* Helper function for comparring  */ 
  var isRemoteImageURL = function(url){
    var parser = document.createElement('a');
    parser.href = url;
    return !(parser.hostname === location.hostname && parser.protocol === location.protocol && parser.port === location.port)
  }

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
          console.log('Not processing remote image: ' + $this.attr('src'))
          return;
        }

        /* Small helper function which applies colors, attrs, and triggers events. */
        var handleColors = function(){
          var color = "rgb(" + ct.getColor( $this[0] ).join(',') + ")";
          var palette = ct.getPalette( $this[0] );
          $this.attr(DATA_COLOR, color);
          $this.trigger(EVENT_CF, { color: color, palette: palette });
        }

        /* Subscribe to our color-found event. */
        $this.on( EVENT_CF, function(ev, data){
          var $parent;
          if ( $this.attr( DATA_PARENT ) ){
            $parent = $this.parents( $this.attr( DATA_PARENT ) )
          } 
          else if (opts.parent) {
            $parent = $this.parents( opts.parent )
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

  /* This little helper includes ColorThief for us. */
  /* jshint ignore:start */
  function includeColorThief(){
    var CanvasImage=function(t){this.canvas=document.createElement("canvas"),this.context=this.canvas.getContext("2d"),document.body.appendChild(this.canvas),this.width=this.canvas.width=t.width,this.height=this.canvas.height=t.height,this.context.drawImage(t,0,0,this.width,this.height)};CanvasImage.prototype.clear=function(){this.context.clearRect(0,0,this.width,this.height)},CanvasImage.prototype.update=function(t){this.context.putImageData(t,0,0)},CanvasImage.prototype.getPixelCount=function(){return this.width*this.height},CanvasImage.prototype.getImageData=function(){return this.context.getImageData(0,0,this.width,this.height)},CanvasImage.prototype.removeCanvas=function(){this.canvas.parentNode.removeChild(this.canvas)};var ColorThief=function(){};if(ColorThief.prototype.getColor=function(t,r){var n=this.getPalette(t,5,r),o=n[0];return o},ColorThief.prototype.getPalette=function(t,r,n){"undefined"==typeof r&&(r=10),"undefined"==typeof n&&(n=10);for(var o,e,a,i,u,c=new CanvasImage(t),f=c.getImageData(),s=f.data,v=c.getPixelCount(),h=[],p=0;v>p;p+=n)o=4*p,e=s[o+0],a=s[o+1],i=s[o+2],u=s[o+3],u>=125&&(e>250&&a>250&&i>250||h.push([e,a,i]));var g=MMCQ.quantize(h,r),l=g.palette();return c.removeCanvas(),l},!pv)var pv={map:function(t,r){var n={};return r?t.map(function(t,o){return n.index=o,r.call(n,t)}):t.slice()},naturalOrder:function(t,r){return r>t?-1:t>r?1:0},sum:function(t,r){var n={};return t.reduce(r?function(t,o,e){return n.index=e,t+r.call(n,o)}:function(t,r){return t+r},0)},max:function(t,r){return Math.max.apply(null,r?pv.map(t,r):t)}};var MMCQ=function(){function t(t,r,n){return(t<<2*c)+(r<<c)+n}function r(t){function r(){n.sort(t),o=!0}var n=[],o=!1;return{push:function(t){n.push(t),o=!1},peek:function(t){return o||r(),void 0===t&&(t=n.length-1),n[t]},pop:function(){return o||r(),n.pop()},size:function(){return n.length},map:function(t){return n.map(t)},debug:function(){return o||r(),n}}}function n(t,r,n,o,e,a,i){var u=this;u.r1=t,u.r2=r,u.g1=n,u.g2=o,u.b1=e,u.b2=a,u.histo=i}function o(){this.vboxes=new r(function(t,r){return pv.naturalOrder(t.vbox.count()*t.vbox.volume(),r.vbox.count()*r.vbox.volume())})}function e(r){var n,o,e,a,i=1<<3*c,u=new Array(i);return r.forEach(function(r){o=r[0]>>f,e=r[1]>>f,a=r[2]>>f,n=t(o,e,a),u[n]=(u[n]||0)+1}),u}function a(t,r){var o,e,a,i=1e6,u=0,c=1e6,s=0,v=1e6,h=0;return t.forEach(function(t){o=t[0]>>f,e=t[1]>>f,a=t[2]>>f,i>o?i=o:o>u&&(u=o),c>e?c=e:e>s&&(s=e),v>a?v=a:a>h&&(h=a)}),new n(i,u,c,s,v,h,r)}function i(r,n){function o(t){var r,o,e,a,i,u=t+"1",f=t+"2",s=0;for(c=n[u];c<=n[f];c++)if(g[c]>p/2){for(e=n.copy(),a=n.copy(),r=c-n[u],o=n[f]-c,i=o>=r?Math.min(n[f]-1,~~(c+o/2)):Math.max(n[u],~~(c-1-r/2));!g[i];)i++;for(s=l[i];!s&&g[i-1];)s=l[--i];return e[f]=i,a[u]=e[f]+1,[e,a]}}if(n.count()){var e=n.r2-n.r1+1,a=n.g2-n.g1+1,i=n.b2-n.b1+1,u=pv.max([e,a,i]);if(1==n.count())return[n.copy()];var c,f,s,v,h,p=0,g=[],l=[];if(u==e)for(c=n.r1;c<=n.r2;c++){for(v=0,f=n.g1;f<=n.g2;f++)for(s=n.b1;s<=n.b2;s++)h=t(c,f,s),v+=r[h]||0;p+=v,g[c]=p}else if(u==a)for(c=n.g1;c<=n.g2;c++){for(v=0,f=n.r1;f<=n.r2;f++)for(s=n.b1;s<=n.b2;s++)h=t(f,c,s),v+=r[h]||0;p+=v,g[c]=p}else for(c=n.b1;c<=n.b2;c++){for(v=0,f=n.r1;f<=n.r2;f++)for(s=n.g1;s<=n.g2;s++)h=t(f,s,c),v+=r[h]||0;p+=v,g[c]=p}return g.forEach(function(t,r){l[r]=p-t}),u==e?o("r"):u==a?o("g"):o("b")}}function u(t,n){function u(t,r){for(var n,o=1,e=0;s>e;)if(n=t.pop(),n.count()){var a=i(c,n),u=a[0],f=a[1];if(!u)return;if(t.push(u),f&&(t.push(f),o++),o>=r)return;if(e++>s)return}else t.push(n),e++}if(!t.length||2>n||n>256)return!1;var c=e(t),f=0;c.forEach(function(){f++});var h=a(t,c),p=new r(function(t,r){return pv.naturalOrder(t.count(),r.count())});p.push(h),u(p,v*n);for(var g=new r(function(t,r){return pv.naturalOrder(t.count()*t.volume(),r.count()*r.volume())});p.size();)g.push(p.pop());u(g,n-g.size());for(var l=new o;g.size();)l.push(g.pop());return l}var c=5,f=8-c,s=1e3,v=.75;return n.prototype={volume:function(t){var r=this;return(!r._volume||t)&&(r._volume=(r.r2-r.r1+1)*(r.g2-r.g1+1)*(r.b2-r.b1+1)),r._volume},count:function(r){var n=this,o=n.histo;if(!n._count_set||r){var e,a,i,u=0;for(e=n.r1;e<=n.r2;e++)for(a=n.g1;a<=n.g2;a++)for(i=n.b1;i<=n.b2;i++)index=t(e,a,i),u+=o[index]||0;n._count=u,n._count_set=!0}return n._count},copy:function(){var t=this;return new n(t.r1,t.r2,t.g1,t.g2,t.b1,t.b2,t.histo)},avg:function(r){var n=this,o=n.histo;if(!n._avg||r){var e,a,i,u,f,s=0,v=1<<8-c,h=0,p=0,g=0;for(a=n.r1;a<=n.r2;a++)for(i=n.g1;i<=n.g2;i++)for(u=n.b1;u<=n.b2;u++)f=t(a,i,u),e=o[f]||0,s+=e,h+=e*(a+.5)*v,p+=e*(i+.5)*v,g+=e*(u+.5)*v;n._avg=s?[~~(h/s),~~(p/s),~~(g/s)]:[~~(v*(n.r1+n.r2+1)/2),~~(v*(n.g1+n.g2+1)/2),~~(v*(n.b1+n.b2+1)/2)]}return n._avg},contains:function(t){var r=this,n=t[0]>>f;return gval=t[1]>>f,bval=t[2]>>f,n>=r.r1&&n<=r.r2&&gval>=r.g1&&gval<=r.g2&&bval>=r.b1&&bval<=r.b2}},o.prototype={push:function(t){this.vboxes.push({vbox:t,color:t.avg()})},palette:function(){return this.vboxes.map(function(t){return t.color})},size:function(){return this.vboxes.size()},map:function(t){for(var r=this.vboxes,n=0;n<r.size();n++)if(r.peek(n).vbox.contains(t))return r.peek(n).color;return this.nearest(t)},nearest:function(t){for(var r,n,o,e=this.vboxes,a=0;a<e.size();a++)n=Math.sqrt(Math.pow(t[0]-e.peek(a).color[0],2)+Math.pow(t[1]-e.peek(a).color[1],2)+Math.pow(t[2]-e.peek(a).color[2],2)),(r>n||void 0===r)&&(r=n,o=e.peek(a).color);return o},forcebw:function(){var t=this.vboxes;t.sort(function(t,r){return pv.naturalOrder(pv.sum(t.color),pv.sum(r.color))});var r=t[0].color;r[0]<5&&r[1]<5&&r[2]<5&&(t[0].color=[0,0,0]);var n=t.length-1,o=t[n].color;o[0]>251&&o[1]>251&&o[2]>251&&(t[n].color=[255,255,255])}},{quantize:u}}();
    return ColorThief; 
  };
  /* jshint ignore:end */

})(jQuery);