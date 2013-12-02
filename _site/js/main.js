;(function(window, document, $){

  $(document).ready(function(){

    // Make some selections.
    var $window       = $(window);
    var $imgWrapper   = $('.image-wrapper');
    var $imgs         = $imgWrapper.find("img");
    var $logoBoxes    = $('.logo .box');
    var $title        = $('h1');

    $imgs.on('ab-color-found', function(e, data){
      $(this).parents('.image-wrapper')
             .attr('data-color', data.color);

      $(this).css({ 
        border: "1px solid " + data.palette[0].replace(')', ",0.25)").replace('rgb', "rgba") 
      });

      $(this).parents('.image-wrapper')
             .find('.swatch')
             .css({ background: data.color })
             .after(data.color)

      if ( $(this).attr('data-description') == 'grandpa' ){
        $(this).parents('.image-wrapper')
               .css({ background: data.color })
      }
    });

    // Run the A.B. plugin.
    $.adaptiveBackground.run({ parent: '1' });

    $imgWrapper.waypoint(function(direction) {

      if ( $(this).attr('data-colored') )
        return;

      $(this).css({ background: $(this).attr('data-color') })
             .attr('data-colored', 1);

    }, { 
      offset: '65%'
    })

    // Tweet button.
    var twitterTitle  = 'Adaptive Backgrounds - a jQuery plugin to extract dominant colors from <img> tags and apply them to their parent'; 
    var twitterLoc    = 'http://goo.gl/zdw3uQ';

    $('.button.tweet').on('click', function(e){
      e.preventDefault();
      window.open('http://twitter.com/share?url=' + twitterLoc + '&text=' + twitterTitle + '&', 'twitterwindow', 'height=450, width=550, top='+($(window).height()/2 - 225) +', left='+$(window).width()/2 +', toolbar=0, location=0, menubar=0, directories=0, scrollbars=0');

    })


  })

})(window, document, jQuery)