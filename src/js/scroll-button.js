/**
 * Scroll page to top.
 * @param {string} options.selector - Button selector.
 * @param {number} [options.step=150] - Animation speed in pixels.
 * @version 4.0.1
 * @author Daur Gamisonia <daurgam@gmail.com>
 */
class ScrollButton {

  constructor( options ) {
    this.button = document.querySelector( options.button );
    this.step = options.step || 150;
  }

  listenButton() {
    this.button.onclick = this.scrollUp.bind(this);
  }

  scrollUp() {
    let timeOut;

    if (document.documentElement.scrollTop !=0 || document.body.scrollTop !=0) {

      window.scrollBy( 0, -this.step );

      timeOut = setTimeout(() => {

        this.scrollUp();

      }, 20 );

    } else {

      clearTimeout( timeOut );
    }
  }

  /**
   * @param {number} threshold - Offset from top that show up the button.
   */
  handleVisibility( threshold ) {

    window.addEventListener("scroll", () => {

      if ( pageYOffset > threshold ) {
        this.button.classList.add("is-active");
      } else {
        this.button.classList.remove("is-active");
      }
    });
  }
}

const scrollButton = new ScrollButton({
  button: ".js-scroll-button-toggle",
  step: 300
});

scrollButton.listenButton();

scrollButton.handleVisibility( document.documentElement.clientHeight * 1.5 );