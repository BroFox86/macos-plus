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
  var closeBtn = document.querySelector( options.close ),
    img;

  Modal.call( this );

  this._modal = document.querySelector( options.modal );

  document.body.addEventListener("click", function( event ) {
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

      openLightbox( target );

      break;
    }
  });

  closeBtn.onclick = function() {

    closeLightbox();

  }.bind( this );

  var openLightbox = function( elem ) {
    var original = elem.getAttribute("href");

    img = document.createElement("img");
    img.className = "lightbox__img";
    img.src = original;

    this._modal.children[0].appendChild( img );

    this._openModal();

  }.bind( this );

  var closeLightbox = function() {

    this._closeModal();

    this._modal.children[0].removeChild( img );

  }.bind( this );
}

/**
 * Open & close modal window with smooth effects.
 * @class
 * @augments Transition
 */
function Modal() {
  Transition.call( this );

  /**
   * Modal window element.
   * @type {HTMLElement}
   * @protected
   */
  this._modal;

  /**
   * Open modal window.
   * @private
   */
  this._openModal = function() {

    this._fadeIn( this._modal );

    toggleScroll();
  }

  /**
   * Close modal window.
   * @private
   */
  this._closeModal = function() {

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