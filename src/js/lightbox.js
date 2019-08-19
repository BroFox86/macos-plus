/**
 * Open original size images in the modal window.
 * @augments Modal
 * @author Daur Gamisonia <daurgam@gmail.com>
 */
class Lightbox extends Modal {

  constructor() {
    super();
    this._modal = document.querySelector(".js-lightbox-toggle");
    this._image = this._modal.querySelector("img");
    this._duration = this._getDuration( this._modal );
  }

  listen() {
    const closeButton = this._modal.querySelector(".js-lightbox-dismiss");

    closeButton.addEventListener( "click", this._close.bind(this) );

    document.addEventListener( "click", this._open.bind(this) );
  }

  _open( event ) {
    let target = event.target;

    while( target != document.body ) {

      if ( !target.classList.contains("js-lightbox-trigger") ) {

        target = target.parentElement;

        continue;
      }

      event.preventDefault();

      this._showImage( target );

      super._open();

      return;
    }
  }

  _showImage( target ) {
    const imgSrc = target.getAttribute("href");
    const preloadImg = document.createElement("img");

    this._originSrc = this._image.src;

    preloadImg.src = imgSrc;

    preloadImg.onload = () => {
      this._image.src = imgSrc;
    };
  }

  _close() {
    super._close();
    this._removeImage();
  }

  _removeImage() {
    setTimeout(() => {
      this._image.src = this._originSrc;
    }, this._duration );
  }
}

const lightbox = new Lightbox();

lightbox.listen();