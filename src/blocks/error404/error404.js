// Animate the fox picture
window.addEventListener("load", function() {
  var elem = document.querySelector("[data-animate='error404'] img");

  if (!elem) {
    return;
  }

  elem.classList.add("is-animated");
});