(function() {
  "use strict";

  /**
   * Open original size images in the modal window.
   * @augments Modal
   * @author Daur Gamisonia <daurgam@gmail.com>
   */
  function Lightbox() {
    var userAgent = window.navigator.userAgent;

    if ( userAgent.match("Trident") && userAgent.match("Edge") ) {
      this._changePreloader();
    }

    this._modal = document.querySelector(".js-lightbox-toggle");
    this._closeButton = document.querySelector(".js-lightbox-dismiss");
    this._image = this._modal.querySelector("img");
    this._duration = this._getDuration( this._modal );
  }

  Lightbox.prototype = Object.create( Modal.prototype );
  Lightbox.prototype.constructor = Lightbox;

  Lightbox.prototype._open = function( event ) {
    var target = event.target;

    while( target != document.body ) {

      if ( !target.classList.contains("js-lightbox-trigger") ) {

        target = target.parentElement;

        continue;
      }

      event.preventDefault();

      this._showImage( target );

      Modal.prototype._open.call(this);

      break;
    }
  };

  Lightbox.prototype._showImage = function( element ) {
    var newSrc = element.getAttribute("href");
    var preloadImg = this._preloadImage;
    var originalSrc = this._originalSrc;
    var img = this._image;

    preloadImg = document.createElement("img");

    originalSrc = this._image.getAttribute("src");

    preloadImg.setAttribute( "src", newSrc );

    preloadImg.onload = function() {

      img.setAttribute( "src", newSrc );

    }.bind(this);
  };

  Lightbox.prototype._close = function() {

    Modal.prototype._close.call(this);

    this._removeImage();
  };

  Lightbox.prototype._removeImage = function() {
    var preloadImg = this._preloadImage;
    var originalSrc = this._originalSrc;
    var img = this._image;
    var duration = this._duration;

    preloadImg.onload = null;

    setTimeout(function() {

      img.setAttribute( "src", originalSrc );

    }.bind(this), duration );
  };

  // Change preloader image from *.svg to *.gif for IE/Edge.
  Lightbox.prototype._changePreloader = function() {
    var newSrc = this._image.getAttribute("src").replace( /(\.[\w\d]+)$/, ".gif" );

    this._image.setAttribute( "src", newSrc );
  };

  Lightbox.prototype.listen = function() {

    document.addEventListener( "click", this._open.bind(this) );

    this._closeButton.addEventListener( "click", this._close.bind(this) );
  };

  var lightbox = new Lightbox();

  lightbox.listen();

})();