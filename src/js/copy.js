/**
 * Сopy URL of the current page.
 * @augments Collapse
 * @author Daur Gamisonia <daurgam@gmail.com>
 */
class Copy extends Collapse {

  constructor() {
    super();
    this._trigger = document.querySelector(".js-copy-url-trigger");
    this._field = document.querySelector(".js-copy-url-field");
    this._wrapper = this._field.parentElement;
  }

  listen() {
    this._trigger.addEventListener( "click", this._handle.bind(this) );
  }

  _handle() {
    const duration = this._getDuration( this._wrapper );

    super._handle( this._trigger, [ this._wrapper ] );

    setTimeout(() => {

      this._copyUrl();

      setTimeout(() => {
        this._showMessage();
      }, duration );

    }, duration );
  }

  _copyUrl() {

    this._field.value = window.location.href.replace( /\#\d$/i, "" );

    this._field.focus();

    this._field.select();

    document.execCommand("Copy");
  }

  _showMessage() {

    this._field.blur();

    this._field.value = "Ссылка скопирована!";
  }
}

const copyUrl = new Copy();

copyUrl.listen();