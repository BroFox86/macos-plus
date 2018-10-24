"use strict";

/* ==========================================================================
   Share buttons
   ========================================================================== */

var shareButtons = new ShareButtons({
  width: 500,
  height: 600
})

function ShareButtons( options ) {
  var width = options.width,
    height = options.height;

  document.body.addEventListener("click", function( event ) {
    var target = event.target;

    while( true ) {

      if ( target == document.body ) {
        break;
      }

      if ( target.getAttribute("data-toggle") != "share" ) {

        target = target.parentElement;

        continue;
      }

      event.preventDefault();

      openWindow( target );

      break;
    }
  })

  function openWindow( elem ) {

    width = "width=" + width,
    height = "height=" + height;

    window.open( getUrl( elem ), "", width + "," + height );
  }

  function getUrl( elem ) {
    var url = window.location.href.replace( /\#\d$/i, "" );

    return elem.href.replace( /[^=]*$/, url );
  }
};

/* ==========================================================================
   Copy URL button
   ========================================================================== */

var copyUrl = new CopyUrl({
  button: "[data-toggle='copyUrl']",
  output: "[data-target='copyUrl']"
});

function CopyUrl( options ) {
  var btn = document.querySelector( options.button ),
    output = document.querySelector( options.output ),
    duration = 600,
    wrapper = output.parentElement;

  Transition.call( this );

  btn.onclick = function() {

    this.slideDown( wrapper, "block" );

    setTimeout(function() {

      copyUrl();

    }, duration );

    setTimeout(function() {

      showMessage();

    }, duration * 2 );

  }.bind( this );

  // Copy URL without an anchor link
  function copyUrl() {

    output.value = window.location.href.replace( /\#\d$/i, "" );

    output.focus();

    output.select();

    document.execCommand("Copy");
  }

  function showMessage() {

    output.blur();

    output.value = "Ссылка скопирована!";
  }
};
