"use strict";

/**
 * Open & close modal window with smooth effects.
 * @class
 * @version 2.0.0
 */
function Modal() {
  /**
   * Modal window.
   * @type {HTMLElement}
   */
  this._modal;
}

Modal.prototype._open = function() {

  this._toggleScroll();

  this._modal.style.display = "block";

  setTimeout(function() {

    this._modal.classList.add("is-visible");

  }.bind(this), 30 );
}

Modal.prototype._close = function() {

  this._modal.classList.remove("is-visible");

  this._toggleScroll();

  setTimeout(function() {

    this._modal.style.display = "";

  }.bind( this ), 200 );
}

Modal.prototype._toggleScroll = function() {
  var scrollbar = window.innerWidth - document.documentElement.clientWidth;

  if ( !document.body.classList.contains("is-fixed") ) {

    document.body.style.paddingRight = scrollbar + "px";

    document.body.classList.add("is-fixed");

  } else {

    document.body.style.paddingRight = "";

    document.body.classList.remove("is-fixed");
  }
}

/**
 * Open original images in the modal window.
 * @class
 * @augments Modal
 * @param {object} options - CSS selectors.
 * @param {string} options.modal - Modal element.
 * @param {string} options.close - Close button.
 * @version 2.0.0
 * @author Daur Gamisonia <daurgam@gmail.com>
 */
function Lightbox( options ) {

  this._modal = document.querySelector( options.modal );

  this._closeBtn = document.querySelector( options.close );

  this._img = this._modal.querySelector("img");

  this._originalSrc;

  this._preloadImg;

  // Add event listener at call
  this.run();

  /*
   * Change preloader image from *.svg to *.gif for IE/Edge.
   */
  (function changePreloader() {
    var userAgent = window.navigator.userAgent,
      newSrc;

    if ( !userAgent.match("Trident") && !userAgent.match("Edge") ) {
      return;
    }

    newSrc = this._img.getAttribute("src").replace( /(\.[\w\d]+)$/, ".gif" );

    this._img.setAttribute( "src", newSrc );
  })();
}

Lightbox.prototype = Object.create( Modal.prototype );

Lightbox.prototype._open = function( event ) {
  var target = event.target;

  while( true ) {

    if ( target == document.body ) {
      break;
    }

    if ( target.getAttribute("data-toggle") != "lightbox" ) {

      target = target.parentElement;

      continue;
    }

    event.preventDefault();

    this._showImage( target );

    Modal.prototype._open.call( this );

    break;
  }
}

Lightbox.prototype._close = function() {

  Modal.prototype._close.call( this );

  this._removeImage();
}

Lightbox.prototype._showImage = function( elem ) {
  var src = elem.getAttribute("href");

  this._preloadImg = document.createElement("img");

  this._originalSrc = this._img.getAttribute("src");

  this._preloadImg.setAttribute( "src", src );

  this._preloadImg.onload = function() {

    this._img.setAttribute( "src", src );

  }.bind( this )
}

Lightbox.prototype._removeImage = function() {
  var duration = getComputedStyle( this._modal ).transitionDuration;

  duration = parseFloat( duration );

  duration = duration * 1000;

  this._preloadImg.onload = null;

  setTimeout(function() {

    this._img.setAttribute( "src", this._originalSrc );

  }.bind( this ), duration);
}

Lightbox.prototype.run = function() {

  document.body.addEventListener( "click", this._open.bind( this ) );

  this._closeBtn.addEventListener( "click", this._close.bind( this ) );
}

var lightbox = new Lightbox({
  modal: "[data-target='lightbox']",
  close: "[data-dismiss='lightbox']"
});