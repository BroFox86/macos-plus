class Modal {

  _open() {

    this._togglePageScroll();

    this._modal.style.display = "block";

    setTimeout(() => {
      this._modal.classList.add("is-visible");
    }, 20 );
  }

  _close() {

    this._modal.classList.remove("is-visible");

    this._togglePageScroll();

    setTimeout(() => {
      this._modal.style.display = "";
    }, this._duration );
  }

  _togglePageScroll() {
    const body = document.body;
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;

    if ( !body.classList.contains("is-fixed") ) {

      body.classList.add("is-fixed");

      body.style.paddingRight = `${scrollbar}px`;

    } else {

      body.classList.remove("is-fixed");

      body.style.paddingRight = "";
    }
  }

  _getDuration( element ) {
    return parseFloat(
      getComputedStyle( element ).transitionDuration
    ) * 1000;
  }
}