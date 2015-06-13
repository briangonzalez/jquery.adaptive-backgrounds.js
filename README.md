<p align='center'>
  <img src='http://briangonzalez.github.io/jquery.adaptive-backgrounds.js/favicon.png?2'>
</p>

jquery.adaptive-backgrounds.js
------------------------------

_A simple jQuery plugin to extract the dominant color of an image and apply it to the background of its parent element._

**[Check it out on the web!](http://briangonzalez.github.io/jquery.adaptive-backgrounds.js/)**

Getting Started
------------------
Simply include jQuery and the script in your page, then run the it like so:

```javascript
$(document).ready(function(){
  $.adaptiveBackground.run()
});
```

The script looks for image(s) with the `data-adaptive-background` attribute:

```html
<img src="/image.jpg" data-adaptive-background>
```

### Using an element with a CSS background image

Instead of using an `<img>` element nested inside of parent element, AB supports grabbing the dominant color of a background image of a standalone element, then applying the corresponding dominant color as the background color of said element.

Enable this functionality by adding a data property, `data-ab-css-background` to the element. See the example below:

```html
<div style='background-image: url(/some-image.jpg)' data-adaptive-background data-ab-css-background></div>
```

Demo
-----------
Here's a little demo of how it works. (1) The page loads (2) the dominant background color of the image is extracted (3) said color is applied to parent of image. _Demo drastically slowed down to show effect_.

---

<img src="https://raw.github.com/briangonzalez/jquery.adaptive-background.js/master/misc/ab.gif">

API
---
This plugin exposes one method:
- __$.adaptiveBackground.run(opts)__ _arg: opts (Object)_ an optional argument to be merged in with the defaults.

Default Options
----------------
- __selector__ String _(default: `'img[data-adaptive-background="1"]'`)_ a CSS selector which denotes which images to grab/process. Ideally, this selector would start with _img_, to ensure we only grab and try to process actual images.
- __parent__ falsy _(default: `null`)_ a CSS selector which denotes which parent to apply the background color to. By default, the color is applied to the parent one level up the DOM tree.
- __normalizeTextColor__ boolean _(default: `false`)_ option to normalize the color of the parent text if background color is too dark or too light
- __normalizedTextColors__ Object Literal _(default: `{dark: '#000', light: '#fff'}`)_ text colors used when background is either too dark/light


__Example:__
Call the `run` method, passing in any options you'd like to override.

```javascript
var defaults      = {
  selector:             '[data-adaptive-background="1"]',
  parent:               null,
  exclude:              [ 'rgb(0,0,0)', 'rgba(255,255,255)' ],
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
$.adaptiveBackground.run(defaults)
```

Events Emitted
--------------
- __ab-color-found__ [Event](http://api.jquery.com/category/events/event-object/) This event is fired when the dominant color of the image is found. The payload includes the dominant color as well as the color palette contained in the image.

__Example:__
Bind to the `ab-color-found` event like so:

```javascript
$('img.my-image').on('ab-color-found', function(ev,payload){
  console.log(payload.color);   // The dominant color in the image.
  console.log(payload.palette); // The color palette found in the image.
  console.log(ev);   // The jQuery.Event object
});
```

Success Callback
----------------
You may wish to supply a callback function which is called once the magic has been performed.

```javascript
$.adaptiveBackground.run({
  success: function($img, data) {
    console.log('Success!', $img, data);
  }
});
```
Note, this callback is called _once_ for each image.

Caveats
--------------
This plugin utlizes the `<canvas>` element and the `ImageData` object, and due to cross-site security limitations, the script will fail if one tries to extract the colors from an image not hosted on the current domain, *unless* the image allows for [Cross Origin Resource Sharing](http://en.wikipedia.org/wiki/Cross-origin_resource_sharing).

__Enabling CORS on S3__

To enable CORS for images hosted on S3 buckets, follow the Amazon guide [here](http://docs.aws.amazon.com/AmazonS3/latest/UG/EditingBucketPermissions.html); adding the following to the bucket's CORS configuration:

```xml
<CORSRule>
 <AllowedOrigin>*</AllowedOrigin>
 <AllowedMethod>GET</AllowedMethod>
</CORSRule>
```

For all images, you can optionally also include a cross-origin attribute in your image. This is not absolutely necessary since the `anonymous` origin is set in the Javascript code, but kudos to you for being a super-developer.

```html
<img src="/image.jpg" data-adaptive-background cross-origin="anonymous"/>
```

Credit
------
This plugin is built on top of a script called [RGBaster](https://github.com/briangonzalez/rgbaster.js).

Author
-------
| ![twitter/brianmgonzalez](http://gravatar.com/avatar/f6363fe1d9aadb1c3f07ba7867f0e854?s=70](http://twitter.com/brianmgonzalez "Follow @brianmgonzalez on Twitter") |
|---|
| [Brian Gonzalez](http://briangonzalez.org) |

License
-------
MIT, yo.
