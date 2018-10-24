"use strict";

var lightbox = new Lightbox({
  modal: "[data-show='lightbox']",
  close: "[data-dismiss='lightbox']"
});

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

      if ( target.getAttribute("data-target") != "lightbox" ) {

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
    var original = elem.href;

    img = document.createElement("img");
    img.className = "lightbox__img";
    img.src = original;

    this._modal.children[0].appendChild( img );

    this.openModal();

  }.bind( this );

  var closeLightbox = function() {

    this.closeModal();

    this._modal.children[0].removeChild( img );

  }.bind( this );
}

function Modal() {

  this._modal;

  Transition.call( this );

  this.openModal = function() {

    this.fadeIn( this._modal, "block" );

    toggleScroll();
  }

  this.closeModal = function() {

    this.fadeOut( this._modal );

    setTimeout(function() {

      toggleScroll();

    }, this.getDuration( this._modal ) );
  }

  function toggleScroll() {

    if ( !document.body.classList.contains("is-fixed") ) {
      var scrollbar = window.innerWidth - document.documentElement.clientWidth;

      document.body.style.paddingRight = scrollbar + "px";

      document.body.classList.add("is-fixed");

    } else {
      document.body.style.paddingRight = "";

      document.body.classList.remove("is-fixed");
    }
  }
}