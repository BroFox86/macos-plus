"use strict";

/**
 * Multiple methods to display & hide elements
 * with CSS transition effects.
 * @class
 * @author Daur Gamisonia <daurgam@gmail.com>
 * @version 2.0.0
 */
function Transition() {}

/**
 * Show element smooth from transparency to opacity.
 * @protected
 * @param {HTMLElement} elem - Element with CSS display:none.
 * @param {string} [value=Block] - Which value will set to display property when element became visible.
 */
Transition.prototype._fadeIn = function( elem, value ) {

  value = value || "block";

  elem.style.display = value;

  elem.style.opacity = 0;

  setTimeout(function() {

    elem.style.opacity = 1;

  }, 20 );
}

/**
 * Hide element smooth from opacity to transparency.
 * @protected
 * @param {HTMLElement} elem - Element that was previously displayed by fadeIn method.
 */
Transition.prototype._fadeOut = function( elem ) {

  elem.style.opacity = 0;

  // Normalize delay in MS Edge when backdrop filter is specified
  elem.style.WebkitBackdropFilter = "blur(0)";

  setTimeout(function() {

    elem.style.cssText = "";

  }, this._getDuration( elem ) );
}

/**
 * Expand the element smooth.
 * @protected
 * @param {HTMLElement} elem - Element with CSS display:none.
 * @param {string} [value=Block] - Which value will set to display property when element become visible.
 */
Transition.prototype._slideDown = function( elem, value ) {
  var style = elem.style,
    height,
    paddingTop,
    paddingBottom;

  style.overflow = "hidden";

  style.boxSizing = "border-box";

  paddingTop = this._getStyle( elem, "padding-top" );

  paddingBottom = this._getStyle( elem, "padding-bottom" );

  style.paddingTop = "0";

  style.paddingBottom = "0";

  value = value || "block";

  style.display = value;

  height = elem.offsetHeight + paddingTop + paddingBottom;

  style.height = 0;

  setTimeout(function() {

    style.height = height + "px";

    style.paddingTop = paddingTop + "px";

    style.paddingBottom = paddingBottom + "px";

  }, 20 );

  setTimeout(function() {

    style.cssText = "display:" + value;

  }, this._getDuration( elem ) );
}

/**
 * Roll up the element smooth to top direction.
 * @protected
 * @param {HTMLElement} elem - Element that was previously expanded by slideDown.
 */
Transition.prototype._slideUp = function( elem ) {
  var style = elem.style;

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

  }, this._getDuration( elem ) );
}

/**
 * Get the computed style value.
 * @protected
 * @param {HTMLElement} elem
 * @param {string} property - CSS property of the element in camelCase.
 * @returns {number} - Property value.
 */
Transition.prototype._getStyle = function( elem, property ) {
  var value = getComputedStyle( elem )[property];

  return parseFloat( value );
}

/**
 * Get the CSS transition-duration value.
 * @protected
 * @param {HTMLElement} elem
 * @returns {number} - Value in ms.
 */
Transition.prototype._getDuration = function( elem ) {
  var duration = parseFloat( getComputedStyle( elem ).transitionDuration );

  return duration * 1000;
}