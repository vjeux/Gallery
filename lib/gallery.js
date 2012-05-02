
(function () {

Gallery = {
  dom: {},
  width: 0,
  height: 0,
  config: {
    minWidth: 300,
    minHeight: 300,
    horizontalPadding: 80,
    verticalPadding: 80,
    leftArea: 0.20,
    prefecth: 5
  },

  initDom: function () {
    Gallery.dom.overlay = e('div', 'gallery-overlay', document.body);
    Gallery.dom.overlay.addEventListener('click', Gallery.close);

    Gallery.dom.outer = e('div', 'gallery-outer', document.body);
    Gallery.dom.inner = e('div', 'gallery-inner', Gallery.dom.outer);

    Gallery.dom.screen = e('div', 'gallery-screen', Gallery.dom.inner);
    Gallery.dom.screen.addEventListener('mousemove', Gallery.mousemove);
    Gallery.dom.screen.addEventListener('click', Gallery.click);

    Gallery.dom.left = e('div', 'gallery-left', Gallery.dom.screen);
    Gallery.dom.right = e('div', 'gallery-right', Gallery.dom.screen);
    Gallery.dom.image = e('img', 'gallery-image', Gallery.dom.screen);

    Gallery.dom.fullscreen = e('div', 'gallery-fullscreen', Gallery.dom.screen);
    Gallery.dom.fullscreen.addEventListener('click', Gallery.fullscreen);
    if (!canFullScreen()) {
      Gallery.dom.fullscreen.style.display = 'none';
    }

    Gallery.dom.bottombar = e('div', 'gallery-bottombar', Gallery.dom.screen);
    Gallery.dom.count = e('span', 'gallery-count', Gallery.dom.bottombar);
    Gallery.dom.close = e('a', 'gallery-close', Gallery.dom.bottombar);
    Gallery.dom.close.innerHTML = 'Close';
    Gallery.dom.close.href = 'javascript:;';
    Gallery.dom.close.addEventListener('click', Gallery.close);

    Gallery.dom.original = e('a', 'gallery-original', Gallery.dom.bottombar);
    Gallery.dom.original.target = '_blank';
    Gallery.dom.original.innerHTML = 'Original';

    Gallery.dom.img = document.createElement('img');
    Gallery.dom.img.onload = function () {
      Gallery.dom.image.src = Gallery.images[Gallery.current].href;
      Gallery.dom.image.style.display = 'block';
      Gallery.resize();
    };

    window.addEventListener('resize', Gallery.resize);

    window.addEventListener('keydown', function (event) {
      if (Gallery.dom.overlay.style.display !== 'block') {
        // Don't do anything when the gallery isn't displayed
        return;
      }

      // Right
      if (event.keyCode === 39) {
        Gallery.change(+1);
      }

      // Left
      if (event.keyCode === 37) {
        Gallery.change(-1);
      }

      // Escape
      if (event.keyCode === 27) {
        Gallery.close();
      }
    });

    // Do not initialize the DOM more than once
    Gallery.initDom = function () { };
  },

  init: function () {
    var links = document.querySelectorAll('.gallery[id] a');
    Array.prototype.forEach.call(links, function (elem) {
      elem.removeEventListener('click', Gallery.showEvent);
      elem.addEventListener('click', Gallery.showEvent);
    });

    // Retrieve #image=name:pos in the URL
    var start = document.location.hash.indexOf('image=');
    if (start !== -1) {
      var hash = document.location.hash;
      var parts = hash.substr(start + 'image='.length).split(':');
      var gallery = document.getElementById('gallery-' + parts[0]);
      if (gallery) {
        var link = gallery.querySelectorAll('a')[parts[1] - 1];
        if (link) {
          // If we found the gallery and image, then show the gallery
          Gallery.show(link);
        }
      }
    }
  },

  getOffsetX: function (event) {
    var offsetX = event.offsetX;
    if (event.offsetX === undefined) {
      // Using deprecated attributes on Firefox
      offsetX = event.layerX;
    }
    var target = event.target;
    while (target !== Gallery.dom.screen) {
      offsetX += target.offsetLeft;
      target = target.parentElement;
    }
    return offsetX;
  },

  isBottomBar: function (event) {
    var target = event.target;
    while (target !== Gallery.dom.screen) {
      if (target === Gallery.dom.bottombar) {
        return true;
      }
      target = target.parentElement;
    }
    return false;
  },

  mousemove: function (event) {
    // Highlight the Left or Right arrow
    if (Gallery.isBottomBar(event) || event.target === Gallery.dom.fullscreen) {
      Gallery.dom.left.className = 'gallery-left';
      Gallery.dom.right.className = 'gallery-right';
    } else if (Gallery.getOffsetX(event) < Gallery.width * Gallery.config.leftArea) {
      Gallery.dom.left.className = 'gallery-left gallery-active';
      Gallery.dom.right.className = 'gallery-right';
    } else {
      Gallery.dom.left.className = 'gallery-left';
      Gallery.dom.right.className = 'gallery-right gallery-active';
    }
  },

  click: function (event) {
    if (Gallery.isBottomBar(event)) {
      return;
    } else if (Gallery.getOffsetX(event) < Gallery.width * Gallery.config.leftArea) {
      Gallery.change(-1);
    } else {
      Gallery.change(+1);
    }
  },

  change: function (delta) {
    Gallery.current = mod(Gallery.current + delta, Gallery.images.length);
    Gallery.update();
  },

  update: function () {
    Gallery.dom.count.innerHTML = (Gallery.current + 1) + ' of ' + Gallery.images.length;
    Gallery.dom.img.src = Gallery.images[Gallery.current].href;
    Gallery.dom.original.href = Gallery.images[Gallery.current].href;
    document.location.hash = 'image=' + Gallery.id + ':' + (Gallery.current + 1);
    Gallery.dom.image.style.display = 'none';
    Gallery.resize();

    // Prefetch the next N image
    for (var i = 0; i < Gallery.config.prefecth; ++i) {
      var next = mod(Gallery.current + i + 1, Gallery.images.length);
      new Image().src = Gallery.images[next];
    }
  },

  fullscreen: function (event) {
    goFullScreen(Gallery.dom.inner);
    event.stopPropagation();
  },

  resize: function () {
    if (isFullScreen()) {
      // Make the gallery at the top left and full width/height
      Gallery.dom.inner.style.left = '0';
      Gallery.dom.inner.style.top = '0';
      Gallery.width = window.innerWidth;
      Gallery.height = window.innerHeight;

      // Hide the full screen icon
      Gallery.dom.fullscreen.style.display = 'none';
    } else {
      // The dimension must be (in order of priority)
      // - At least the minimum dimensions
      // - Keep a padding on the window
      // - Equal or larger than the previous dimensions
      // - The dimension of the image
      Gallery.width = Math.max(
        Gallery.config.minWidth,
        Math.min(Math.max(Gallery.width, Gallery.dom.img.width),
                 window.innerWidth - Gallery.config.horizontalPadding));
      Gallery.height = Math.max(
        Gallery.config.minHeight,
        Math.min(Math.max(Gallery.height, Gallery.dom.img.height),
                 window.innerHeight - Gallery.config.verticalPadding));

      // Top left of inner initially is at the middle of the screen due to
      // the CSS hack. Put a negative position to make it at the right spot
      Gallery.dom.inner.style.left = (-Gallery.width / 2) + 'px';
      Gallery.dom.inner.style.top = (-Gallery.height / 2) + 'px';

      if (canFullScreen()) {
        // Show the full screen icon
        Gallery.dom.fullscreen.style.display = 'block';
      }
    }
    Gallery.dom.inner.style.width = Gallery.width + 'px';
    Gallery.dom.inner.style.height = Gallery.height + 'px';
    
    // Find the image dimensions given the gallery size
    var ratio = Gallery.dom.img.width / Gallery.dom.img.height;
    var width, height;

    if (Gallery.width < Gallery.dom.img.width || Gallery.height < Gallery.dom.img.height) {
      // If the gallery is smaller than the image.
      // Try to fit the image in the width and see what the height is
      width = Gallery.width;
      height = Gallery.width / ratio;

      if (height > Gallery.height) {
        // If the height doesn't fit, then we should resize for height
        width = Gallery.height * ratio;
        height = Gallery.height;
      }
    } else {
      // The gallery is large enough to hold the image, good!
      width = Gallery.dom.img.width;
      height = Gallery.dom.img.height;
    }
    Gallery.dom.image.width = width;
    Gallery.dom.image.height = height;

    // Move the image is the center of the gallery
    Gallery.dom.image.style.left = (Gallery.width / 2 - width / 2) + 'px';
    Gallery.dom.image.style.top = (Gallery.height / 2 - height / 2) + 'px';

    // Update the height of the overlay
    Gallery.dom.overlay.style.height = window.innerHeight + 'px';
  },

  close: function () {
    // Hide the gallery
    Gallery.dom.overlay.style.display = 'none';
    Gallery.dom.outer.style.display = 'none';

    // Reset the minimal width/height the gallery can take
    Gallery.width = 0;
    Gallery.height = 0;

    // Clean up
    cancelFullScreen();
    document.location.hash = '_';
    Gallery.dom.img.src = '';
  },

  show: function (target) {
    // Bubble up until we find the <a> that triggered the event
    var link = target;
    while (link.nodeName !== 'A') {
      link = link.parentElement;
    }

    // Bubble up until we find the enclosing gallery
    var gallery = target.parentElement;
    while (gallery.className.indexOf('gallery') === -1) {
      gallery = gallery.parentElement;
    }

    // Set up state
    Gallery.id = gallery.id.replace(/^gallery-/, '');
    Gallery.images = gallery.querySelectorAll('a');
    Gallery.current = Array.prototype.indexOf.call(Gallery.images, link);

    Gallery.initDom();
    Gallery.update();

    // Display the gallery
    Gallery.dom.overlay.style.display = 'block';
    Gallery.dom.outer.style.display = 'block';
  },

  showEvent: function (event) {
    // Only left click
    if (event.button !== 0 || event.ctrlKey || event.metaKey) {
      return;
    }

    Gallery.show(event.target);

    // Put it at the end so that it "gracefully" degrade if the browser sucks
    event.preventDefault();
  }
};

document.addEventListener('DOMContentLoaded', Gallery.init);


// Utilities

// Full Screen

function canFullScreen() {
  return document.body.webkitRequestFullScreen ||
         document.body.requestFullScreen ||
         document.body.mozRequestFullScreen;
}

function isFullScreen() {
  return document.fullScreenElement ||
         document.mozFullScreen ||
         document.webkitIsFullScreen;
}

function goFullScreen(elem) {
  if (elem.requestFullScreen) {
    elem.requestFullScreen();
  } else if (elem.mozRequestFullScreen) {
    elem.mozRequestFullScreen();
  } else if (elem.webkitRequestFullScreen) {
    elem.webkitRequestFullScreen();
  }
}

function cancelFullScreen() {
  if (document.cancelFullScreen) {
    document.cancelFullScreen();
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  } else if (document.webkitCancelFullScreen) {
    document.webkitCancelFullScreen();
  }
}


// Small DOM constructor

function e(name, className, parent) {
  var elem = document.createElement(name);
  parent.appendChild(elem);
  if (className) {
    elem.className = className;
  }
  return elem;
}

// Modulo that works with negative numbers

function mod(a, b) {
  return ((a % b) + b) % b;
}

})();