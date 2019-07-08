(function() {
  "use strict";

  /**
   * Toggle modal window.
   */
  window.Modal = function Modal() {};

  Modal.prototype._open = function() {
    var modal = this._modal;

    this._toggleScroll();

    modal.style.display = "block";

    setTimeout(function() {

      modal.classList.add("is-visible");

    }.bind(this), 20 );
  };

  Modal.prototype._close = function() {
    var modal = this._modal;
    var duration = this._duration;

    modal.classList.remove("is-visible");

    this._toggleScroll();

    setTimeout(function() {

      modal.style.display = "";

    }.bind(this), duration );
  };

  Modal.prototype._toggleScroll = function() {
    var body = document.body;
    var scrollbar = window.innerWidth - document.documentElement.clientWidth;

    if ( !body.classList.contains("is-fixed") ) {

      body.style.paddingRight = scrollbar + "px";

      body.classList.add("is-fixed");

    } else {

      body.style.paddingRight = "";

      body.classList.remove("is-fixed");
    }
  };

  // Get transition duration.
  Modal.prototype._getDuration = function( element ) {
    var duration = parseFloat( getComputedStyle( element ).transitionDuration );

    // Get ms from sec.
    return duration * 1000;
  };

})();