"use strict";

/**
 * Сopy URL of the current page.
 * @class
 * @augments Collapse
 * @author Daur Gamisonia <daurgam@gmail.com>
 */
function Copy() {
  this._trigger = document.querySelector(".js-copy-url-trigger");
  this._field = document.querySelector(".js-copy-url-field");
  this._wrapper = this._field.parentElement;
};

Copy.prototype = Object.create( Collapse.prototype );
Copy.prototype.constructor = Copy;

Copy.prototype._handle = function() {
  var duration = this._getDuration( this._wrapper );

  Collapse.prototype._handle.call( this, this._trigger, [this._wrapper]);

  setTimeout(function() {

    this._copyUrl();

    setTimeout(function() {

      this._showMessage();

    }.bind(this), duration );

  }.bind(this), duration );
}

// Copy URL without an anchor link.
Copy.prototype._copyUrl = function() {

  this._field.value = window.location.href.replace( /\#\d$/i, "" );

  this._field.focus();

  this._field.select();

  document.execCommand("Copy");
}

Copy.prototype._showMessage = function() {

  this._field.blur();

  this._field.value = "Ссылка скопирована!";
}

Copy.prototype.listen = function() {
  this._trigger.addEventListener( "click", this._handle.bind(this) );
};

var copyUrl = new Copy();

copyUrl.listen();