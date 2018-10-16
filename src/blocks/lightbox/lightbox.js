"use strict";

var lightbox = new Lightbox({
  container:   "[data-toggle='content']",
  modal:       "[data-show='lightbox']",
  close:       "[data-dismiss='lightbox']"
});

function Lightbox(options) {
  var container = query(options.container)[0],
    modal = query(options.modal)[0],
    closeBtn = query(options.close)[0],
    display = animateDisplayProperty,
    img;

  function query(selector) {
    return document.querySelectorAll(selector);
  }

  container.addEventListener("click", function(e) {
    var target = e.target;

    while(true) {

      if (target == container) break;

      if (target.getAttribute("data-target") != "lightbox") {
        target = target.parentElement;
        continue;
      }

      e.preventDefault();
      openModal(target);
      break;
    }
  })

  function openModal(elem) {
    var original = elem.getAttribute("href");

    img = document.createElement("img");
    img.className = "lightbox__img";
    img.src = original;
    modal.children[0].appendChild(img);

    toggleScroll();
    display(modal, "block");
  }

  function toggleScroll() {
    if (!document.body.classList.contains("is-fixed")) {
      var scrollbar = window.innerWidth - document.documentElement.clientWidth;

      document.body.style.paddingRight = scrollbar + "px";
      document.body.classList.add("is-fixed");
    } else {
      document.body.style.paddingRight = "";
      document.body.classList.remove("is-fixed");
    }
  }

  closeBtn.onclick = function() {
    closeModal();
  }

  function closeModal() {
    display(modal, "none");
    toggleScroll();
    modal.children[0].removeChild(img);
  }
}