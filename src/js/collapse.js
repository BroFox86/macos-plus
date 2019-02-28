"use strict";

/**
 * Expandable lists that triggered by an element with data-toggle="collapse"
 * and a data-target with their selector.
 * @class
 * @version 2.0.1
 * @author Daur Gamisonia <daurgam@gmail.com>
 */
var Collapse = new Function();

Collapse.prototype.listen = function() {
  document.body.addEventListener( "click", this._handle.bind( this, "js-collapse-toggle" ) );
};

Collapse.prototype._handle = function( selector, event ) {
  var evtTarget = event.target,
    toggleElem,
    targetElem,
    id;

  while( true ) {

    if ( evtTarget == document.body ) {
      break;
    }

    if ( !evtTarget.classList.contains( selector ) ) {

      evtTarget = evtTarget.parentElement;

      continue;
    }

    event.preventDefault();

    toggleElem = evtTarget;

    id = toggleElem.getAttribute("data-target");

    targetElem = document.querySelector( id );

    if ( !toggleElem.classList.contains("is-active") ) {

      this._show( toggleElem, targetElem );

    } else {

      this._hide( toggleElem, targetElem );
    }

    break;
  }
};

Collapse.prototype._show = function( toggleElem, targetElem ) {
  var toggleClass = toggleElem.classList,
    targetClass = targetElem.classList,
    duration = this._getDuration( targetElem );

  if ( targetClass.contains("expanding") ) {
    return;
  }

  targetClass.add("expanding");

  this._slideDown( targetElem );

  setTimeout(function() {

    toggleClass.add("is-active");

    targetClass.remove("expanding");

  }.bind(this), duration );
};

Collapse.prototype._hide = function( toggleElem, targetElem ) {
  var toggleClass = toggleElem.classList,
    targetClass = targetElem.classList,
    duration = this._getDuration( targetElem );

  if ( targetClass.contains("expanding") ) {
    return;
  }

  targetClass.add("expanding");

  this._slideUp( targetElem );

  setTimeout(function() {

    toggleClass.remove("is-active");

    targetClass.remove("expanding");

  }.bind(this), duration );
};

Collapse.prototype._slideDown = function( elem ) {
  var style = elem.style,
    duration = this._getDuration( elem ),
    height,
    paddingTop,
    paddingBottom;

  style.overflow = "hidden";
  style.boxSizing = "border-box";

  paddingTop = this._getStyle( elem, "padding-top" );
  paddingBottom = this._getStyle( elem, "padding-bottom" );

  style.paddingTop = "0";
  style.paddingBottom = "0";

  style.display = "block";

  height = elem.offsetHeight + paddingTop + paddingBottom;

  style.height = 0;

  setTimeout(function() {
    style.height = height + "px";
    style.paddingTop = paddingTop + "px";
    style.paddingBottom = paddingBottom + "px";
  }, 20 );

  setTimeout(function() {
    style.cssText = "display: block";
  }, duration );
};

Collapse.prototype._slideUp = function( elem ) {
  var style = elem.style,
    duration = this._getDuration( elem );

  style.overflow = "hidden";
  style.boxSizing = "border-box";
  style.height = elem.offsetHeight + "px";

  setTimeout(function() {
    style.height = 0;
    style.paddingTop = 0;
    style.paddingBottom = 0;
  }, 20 );

  setTimeout(function() {
    style.cssText = "";
  }, duration );
};

Collapse.prototype._getStyle = function( elem, property ) {
  var value = getComputedStyle( elem )[property];

  return parseFloat( value );
};

Collapse.prototype._getDuration = function( elem ) {
  var duration = parseFloat( getComputedStyle( elem ).transitionDuration );

  // Get ms from sec
  return duration * 1000;
};