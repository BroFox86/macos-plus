"use strict";

var lightbox = new Lightbox({
  modal: "[data-target='lightbox']",
  close: "[data-dismiss='lightbox']"
});

/**
 * Open original images in the modal window.
 * @class
 * @augments Modal
 * @param {object} options - CSS selectors.
 * @param {string} options.modal - Modal element.
 * @param {string} options.close - Close button.
 * @author Daur Gamisonia <daurgam@gmail.com>
 */
function Lightbox( options ) {
  var modal = document.querySelector( options.modal ),
    closeBtn = document.querySelector( options.close ),
    img = modal.querySelector("img"),
    openModal,
    closeModal,
    originalSrc,
    preloadImg;

  Modal.call( this );

  this._modal = modal;

  /**
   * Change preloader image from *.svg to *.gif for IE/Edge.
   * @function changePreloader
   * @memberof Lightbox
   * @private
   * @inner
   */
  (function changePreloader() {
    var userAgent = window.navigator.userAgent,
      newSrc;

    if ( !userAgent.match("Trident") && !userAgent.match("Edge") ) {
      return;
    }

    newSrc = img.getAttribute("src").replace( /(\.[\w\d]+)$/, ".gif" );

    img.setAttribute( "src", newSrc );
  })();

  openModal = this._open;

  var open = function( event ) {
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

      showImage( target );

      openModal.call( this );

      break;
    }

  }.bind( this);

  closeModal = this._close;

  var close = function() {

    closeModal.call( this );

    removeImage();

  }.bind( this );

  var showImage = function( elem ) {
    var src = elem.getAttribute("href");

    preloadImg = document.createElement("img"),

    originalSrc = img.getAttribute("src");

    preloadImg.setAttribute( "src", src );

    preloadImg.onload = function() {
      img.setAttribute( "src", src );
    }
  }

  var removeImage = function() {
    var duration = getComputedStyle( this._modal ).transitionDuration;

    duration = parseFloat( duration );

    duration = duration * 1000;

    preloadImg.onload = null;

    setTimeout(function() {

      img.setAttribute( "src", originalSrc );

    }, duration);

  }.bind( this );

  document.body.addEventListener( "click", open );

  closeBtn.addEventListener( "click", close );
}

/**
 * Open & close modal window with smooth effects.
 * @class
 * @augments Transition
 */
function Modal() {

  Transition.call( this );

  /**
   * Modal window.
   * @type {HTMLElement}
   * @protected
   */
  this._modal;

  /**
   * Open modal window.
   * @protected
   */
  this._open = function() {

    this._fadeIn( this._modal );

    toggleScroll();
  }

  /**
   * Close modal window.
   * @protected
   */
  this._close = function() {

    this._fadeOut( this._modal );

    setTimeout(function() {

      toggleScroll();

    }, this._getDuration( this._modal ) );
  }

  /**
   * Turn off/on the page scrolling.
   * @private
   */
  function toggleScroll() {
    var scrollbar = window.innerWidth - document.documentElement.clientWidth;

    if ( !document.body.classList.contains("is-fixed") ) {

      document.body.style.paddingRight = scrollbar + "px";

      document.body.classList.add("is-fixed");

    } else {

      document.body.style.paddingRight = "";

      document.body.classList.remove("is-fixed");
    }
  }
}