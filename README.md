
jquery.adaptive-background.js
===============================
_A simple jQuery plugin to extract the dominant color of an image and apply it to the background of its parent element._

Getting Started
------------------
Simply include jQuery and the __[script](https://raw.github.com/briangonzalez/jquery.adaptive-backgrounds.js/master/src/jquery.pep.js)__ in your page, then run the script like so:

```javascript
  $(document).ready(function(){
    $.adaptiveBackground.run()
  });
```

The script looks for image(s) with the `data-adaptive-background` attribute:

```html
<img src="/image.jpg" data-adaptive-background='1'>
```

API
---
This plugin exposes one method:
- __$.adaptiveBackground.run(opts)__ _arg: opts (Object)_ an optional argument to be merged in with the defaults.

Default Options
----------------
- __selector__ String _(defult: 'img[data-adaptive-background="1"]')_ a CSS selector which denotes which images to grab/process. Ideally, this selector would start with _img_, to ensure we only grab and try to process actual images.
- __parent__ String _(defult: 'img[data-adaptive-background="1"]')_ a string which denotes which images to grab. Ideally, this selector would start with _img_, to ensure we only grab and try to process images.

Events Emitted
--------------
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam ullamcorper justo sem. Fusce ac sem est. Aenean dignissim feugiat auctor. Vestibulum in ante sem. Ut sit amet erat arcu, eget fringilla odio. Aenean a nibh est. Cras metus urna, vulputate non feugiat vel, condimentum sit amet purus.

Caveats
--------------
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam ullamcorper justo sem. Fusce ac sem est. Aenean dignissim feugiat auctor. Vestibulum in ante sem. Ut sit amet erat arcu, eget fringilla odio. Aenean a nibh est. Cras metus urna, vulputate non feugiat vel, condimentum sit amet purus.

Contact
-------
lipsum.

License
-------
Lipsum.
