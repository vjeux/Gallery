Gallery
=======

There are dozens of lightbox plugins out there but none of them do what I needed. So here is my implementation of a lightbox.

 - Have a URL to be able to hotlink the images
 - Support for gallery
 - Ability to integrate only adding a single new bbcode [gallery=name][/gallery]
 - Image resizing based on screen size
 - Fullscreen view
 - Standalone. Doesn't require jQuery.

__________________ <a href="http://fooo.fr/~vjeux/github/Gallery/demo/gallery.html#image=mounts:2" target="_blank"><img src="http://fooo.fr/~vjeux/github/Gallery/demo/gallery.png" /></a>

Some other goodies that were not part of the original needs:

 - Smart resizing. The gallery will never shrink when you change image. It will give you a consistent click target to go to the next image.
 - Agressive preloading of the next images
 - Smart click targets. Only the left 20% of the gallery is going previous. The right 80% is dedicated to what you want to do most often, go to the next image.

How to use
===========

Add in your code the following HTML:

```html
<div class="gallery" id="gallery-name">
  <a href="fullimage.png">
    <img src="thumbnail.png" />
  </a>
  <!-- more images ... -->
</div>
```

Somewhere in your page:

```html
<script src="gallery.js"></script>
<link rel="stylesheet" href="gallery.css" />
```

That's it, you have a gallery!

Advanced
========

If you don't want to wait for the end of page to load to get your lightbox working. After each gallery add the following snippet:

```html
<script>Gallery.init();</script>
```

- When the gallery is opened, it will replace the full hash part of the URL. Be ready for it.
- It doesn't work with IE6, 7, 8. The URLs will stay URLs though, so people will still be able to see the images.

------
Disclaimer: I'm a Facebook employee but this work is not a Facebook product. I just did it on my spare time as I needed a good lightbox. I recoded it from scratch, it doesn't use any of the Facebook code. The left, right and fullscreen images are from Facebook though ...