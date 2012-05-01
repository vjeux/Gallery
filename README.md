Gallery
=======

There are dozens of lightbox plugins out there but none of them does what I needed. So here is my implementation of lightbox.

 - Have a URL to be able to hotlink the images
 - Support for gallery
 - Ability to integrates only adding a single new bbcode [gallery=name]
 - Resizing based on screen size
 - Fullscreen view

__________________ <a href="http://fooo.fr/~vjeux/github/Gallery/demo/gallery.html#image=mounts:2" target="_blank"><img src="http://fooo.fr/~vjeux/github/Gallery/demo/gallery.png" /></a>

Some other goodies that were not part of the original needs

 - Smart resizing. The gallery will never shrink when you change image. It will give you a consistent click target to go to the next image.
 - Agressive preloading of the next images
 - Smart click targets. Only the left 20% of the gallery is going next. The 80% is dedicated to what you want to do most often, go to the next image.

Disclaimer: I'm a Facebook employee but this work is not a Facebook product. I just did it on my spare time as I needed a good lightbox. I recoded it from scratch, it doesn't use any of the Facebook code. The left, right and fullscreen images are from Facebook though ...