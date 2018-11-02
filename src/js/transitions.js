"use strict";

/**
 * Multiple methods to display & hide elements
 * with CSS transition effects.
 * @class
 * @author Daur Gamisonia <daurgam@gmail.com>
 */
function Transition() {
  /**
   * Show element smooth from transparency to opacity.
   * @param {HTMLElement} elem - Element with CSS display:none.
   * @param {string} [value=Block] - Which value will set to display property when element became visible.
   */
  this._fadeIn = function( elem, value ) {

    value = value || "block";

    elem.style.display = value;
    elem.style.opacity = 0;

    setTimeout(function() {
      elem.style.opacity = 1;
    }, 20 );
  }

  /**
   * Hide element smooth from opacity to transparency.
   * @param {HTMLElement} elem - Element that was previously displayed by fadeIn method.
   */
  this._fadeOut = function( elem ) {

    elem.style.opacity = 0;

    // Normalize delay in MS Edge when backdrop filter is specified
    elem.style.WebkitBackdropFilter = "blur(0)";

    setTimeout(function() {

      elem.style.cssText = "";

    }, this._getDuration( elem ) );
  }

  /**
   * Expand the element smooth.
   * @param {HTMLElement} elem - Element with CSS display:none.
   * @param {string} [value=Block] - Which value will set to display property when element become visible.
   */
  this.slideDown = function( elem, value ) {
    var style = elem.style,
      height,
      paddingTop,
      paddingBottom;

    value = value || "block";

    style.boxSizing = "content-box";

    style.display = value;

    height = getStyle( elem, "height" );

    paddingTop = getStyle( elem, "padding-top" );
    paddingBottom = getStyle( elem, "padding-bottom" );

    style.paddingTop = 0;
    style.paddingBottom = 0;

    style.height = 0;

    style.overflow = "hidden";

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
   * @param {HTMLElement} elem - Element that was previously expanded by slideDown.
   */
  this._slideUp = function( elem ) {
    var style = elem.style;

    style.height = elem.offsetHeight + "px";

    setTimeout(function() {

      style.overflow = "hidden";

      style.height = 0;

      style.paddingTop = 0;

      style.paddingBottom = 0;
    }, 20 );

    setTimeout(function() {

      style.cssText = "";

    }, this._getDuration( elem ) );
  }

  /**
   * Get the CSS transition-duration value.
   * @param {HTMLElement} elem
   * @returns {number} - Value in ms.
   */
  this._getDuration = function( elem ) {
    var duration = parseFloat( getComputedStyle( elem ).transitionDuration );

    return duration * 1000;
  }

  /**
   * Get the computed style value.
   * @private
   * @param {HTMLElement} elem
   * @param {string} property - CSS property of the element in camelCase.
   * @returns {number} - Property value.
   */
  function getStyle( elem, property ) {
    var value = getComputedStyle( elem )[property];

    return parseFloat( value );
  }
}
