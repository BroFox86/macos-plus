(function() {
  "use strict";

  /**
   * Expandable elements that triggered by buttons with '.js-collapse-trigger'
   * class and the data-target with their selector.
   * @version 4.0.2
   * @author Daur Gamisonia <daurgam@gmail.com>
   */
  window.Collapse = function Collapse() {};

  /**
   * Listen button.
   * @public
   */
  Collapse.prototype.listen = function() {
    document.addEventListener( "click", this._initialize.bind(this) );
  };

  /**
   * Get target elements from the event.
   * @protected
   */
  Collapse.prototype._initialize = function( event ) {
    var eventTarget = event.target;
    var targets;
    var trigger;

    while( true ) {

      if ( !eventTarget ) {
        return;
      }

      if ( !eventTarget.classList.contains("js-collapse-trigger") ) {

        eventTarget = eventTarget.parentElement;

        continue;
      }

      event.preventDefault();

      trigger = eventTarget;

      targets = document.querySelectorAll( trigger.getAttribute("data-target") );

      this._handle( trigger, targets );

      return;
    }
  };

  /**
   * Handle transition.
   * @protected
   * @param {HTMLElement} trigger - Button element.
   * @param {HTMLElement[]} targets - Target elements.
   */
  Collapse.prototype._handle = function( trigger, targets ) {
    var duration = this._getDuration( targets[0] );
    var target;

    if ( !trigger.classList.contains("pending") ) {

      trigger.classList.add("pending");

      setTimeout(function() {

        trigger.classList.remove("pending");

      }, duration );

    } else {

      return;
    }

    for ( var i = 0; i < targets.length; i++ ) {
      target = targets[i];

      if ( !trigger.classList.contains("is-active") ) {
        this._slideDown( target );

      } else {
        this._slideUp( target );
      }
    }

    trigger.classList.toggle("is-active");
  };

  /**
   * Expand the element.
   * @protected
   */
  Collapse.prototype._slideDown = function( target ) {
    var style = target.style;
    var paddingTop = this._getStyle( target, "padding-top" );
    var paddingBottom = this._getStyle( target, "padding-bottom" );
    var duration = this._getDuration( target );
    var height;

    style.overflow = "hidden";

    style.display = "block";

    height = target.offsetHeight;

    style.transition = "none";

    style.height = "0";

    style.paddingTop = "0";

    style.paddingBottom = "0";

    setTimeout(function() {

      style.transition = "";

      style.height = height + "px";

      style.paddingTop = paddingTop + "px";

      style.paddingBottom = paddingBottom + "px";

      setTimeout(function() {

        style.overflow = "";

      }, duration );

    }, 10 );
  };

  /**
   * Roll up.
   * @protected
   */
  Collapse.prototype._slideUp = function( target ) {
    var style = target.style;
    var duration = this._getDuration( target );

    style.overflow = "hidden";

    style.height = "0";

    style.paddingTop = "0";

    style.paddingBottom = "0";

    setTimeout(function() {

      target.removeAttribute("style");

    }, duration );
  };

  /**
   * Get transition duration.
   * @protected
   */
  Collapse.prototype._getDuration = function( element ) {
    var duration = parseFloat( getComputedStyle( element ).transitionDuration );

    // Get ms from sec.
    return duration * 1000;
  };

  /**
   * Get style value.
   * @protected
   */
  Collapse.prototype._getStyle = function( element, property ) {
    var value = getComputedStyle( element )[property];

    return parseFloat( value );
  };

  var collapse = new Collapse();

  collapse.listen();

})();