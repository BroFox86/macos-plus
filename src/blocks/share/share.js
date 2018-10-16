"use strict";

/* ==========================================================================
   Share buttons
   ========================================================================== */

var shareButtons = new ShareButtons({
  button:   "[data-toggle='share']",
  width:    500,
  height:   600
})

function ShareButtons(options) {
  var btn = document.querySelector(options.button),
    width = options.width,
    height = options.height;

  btn.onclick = function(e) {
    e.preventDefault();
    openWindow();
  }

  function openWindow() {
    width = "width=" + width,
    height = "height=" + height;
    window.open(getUrl(), "", width + "," + height);
  }

  function getUrl() {
    var url = window.location.href.replace(/\#\d$/i, "");

    return btn.getAttribute("href").replace(/[^=]*$/, url);
  }
};

/* ==========================================================================
   Copy URL button
   ========================================================================== */

var copyUrl = new CopyUrl({
  button: "[data-toggle='copyUrl']",
  output: "[data-target='copyUrl']",
  duration: 600
});

function CopyUrl(options) {
  var btn = document.querySelector(options.button),
    output = document.querySelector(options.output),
    duration = options.duration || 0,
    wrapper = output.parentElement,
    display = animateDisplayProperty;

  btn.onclick = function() {
    display(wrapper, "block");

    setTimeout(function() {
      copyUrl();
    }, duration);

    setTimeout(function() {
      showMessage();
    }, duration * 2);
  }

  // Copy URL without an anchor link
  function copyUrl() {
    output.value = window.location.href.replace(/\#\d$/i, "");
    output.focus();
    output.select();
    document.execCommand("Copy");
  }

  function showMessage() {
    output.blur();
    output.value = "Ссылка скопирована!";
  }
};
