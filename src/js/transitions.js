"use strict";

function Transition() {

  this.fadeIn = function( elem, value ) {

    elem.style.display = value;
    elem.style.opacity = 0;

    setTimeout(function() {
      elem.style.opacity = 1;
    }, 20 );
  }

  this.fadeOut = function( elem ) {

    elem.style.opacity = 0;

    setTimeout(function() {

      elem.style.cssText = "";

    }, this.getDuration( elem ) );
  }

  this.slideDown = function( elem, value ) {
    var style = elem.style,
      height,
      paddingTop,
      paddingBottom;

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

    }, this.getDuration( elem ) );
  }

  this.slideUp = function( elem ) {
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

    }, this.getDuration( elem ) );
  }

  this.getDuration = function( elem ) {
    var duration = parseFloat( getComputedStyle( elem ).transitionDuration );

    return duration * 1000;
  }

  function getStyle( elem, property ) {
    var value = getComputedStyle( elem )[property];

    return parseFloat( value );
  }
}
