/**
 * Expandable elements that triggered by buttons with '.js-collapse-trigger'
 * class and the data-target with their selector.
 * @version 5.0.3
 * @author Daur Gamisonia <daurgam@gmail.com>
 */
class Collapse {

  listen() {
    document.addEventListener( "click", ( event ) => {
      let trigger;
      let targets;

      if ( !event.target || !event.target.matches(".js-collapse-trigger") ) {
        return;
      }

      event.preventDefault();

      trigger = event.target;

      targets = document.querySelectorAll( trigger.dataset.target );

      this._handle( trigger, targets );
    });
  }

  _handle( trigger, targets ) {

    if ( !trigger.matches(".pending") ) {

      trigger.classList.add("pending");

      setTimeout(() => {

        trigger.classList.remove("pending");

      }, this._getDuration( targets[ 0 ] ) );

    } else {

      return;
    }

    for ( let target of targets ) {

      if ( !trigger.matches(".is-active") ) {

        this._slideDown( target );

      } else {
        this._slideUp( target );
      }
    }

    trigger.classList.toggle("is-active");
  }

  _slideDown( target ) {
    const style = target.style;
    const paddingTop = this._getStyle( target, "padding-top" );
    const paddingBottom = this._getStyle( target, "padding-bottom" );
    const duration = this._getDuration( target );
    let height;

    style.overflow = "hidden";

    style.display = "block";

    height = target.offsetHeight;

    style.transition = "none";

    style.height = style.paddingTop = style.paddingBottom = 0;

    setTimeout(() => {

      style.transition = "";

      style.height = `${height}px`;

      style.paddingTop = `${paddingTop}px`;

      style.paddingBottom = `${paddingBottom}px`;

      setTimeout(() => {

        style.overflow = "";

      }, duration );

    }, 20 );
  }

  _slideUp( target ) {
    const style = target.style;

    style.overflow = "hidden";

    style.height = style.paddingTop = style.paddingBottom = 0;

    setTimeout(() => {

      target.removeAttribute("style");

    }, this._getDuration( target ) );
  }

  _getStyle( element, property ) {
    return parseFloat(
      getComputedStyle( element )[ property ]
    );
  }

  _getDuration( element ) {
    return parseFloat(
      getComputedStyle( element ).transitionDuration
    ) * 1000;
  }
}

const collapse = new Collapse();

collapse.listen();