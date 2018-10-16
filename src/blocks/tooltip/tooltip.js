"use strict";

var tooltip = new Tooltip({
  container: "[data-toggle='content']"
});

function Tooltip(options) {
  var container = document.querySelector(options.container),
    display = animateDisplayProperty,
    tooltip;

  container.addEventListener("mouseover", function(e) {
    var target = e.target;

    if (target.getAttribute("data-target") != "tooltip") return;
    show(target);
  })

  container.addEventListener("mouseout", function(e) {
    var target = e.target;

    if (target.getAttribute("data-target") != "tooltip") return;
    close(target);
  })

  function show(elem) {
    // Get the title text
    var text = elem.getAttribute("title");

    // Save it in the data attribute
    elem.setAttribute("data-text", text);
    // Clear the title
    elem.setAttribute("title", "");

    tooltip = document.createElement("p");
    tooltip.className = "tooltip";
    tooltip.textContent = text;

    document.body.appendChild(tooltip);

    display(tooltip, "block");
  }

  function close(elem) {
    // Restore the title
    var text = elem.getAttribute("data-text");

    elem.setAttribute("title", text);
    display(tooltip, "none");

    setTimeout(function() {
      document.body.removeChild(tooltip);
    }, 200)
  }

  container.addEventListener("mousemove", function(event) {
    var target = event.target;

    if (target.getAttribute("data-target") != "tooltip") return;
    move(event);
  })

  function move(event) {
    var mouseX = event.pageX + 20,
      mouseY = event.pageY + 10;

    tooltip.style.left = mouseX + "px";
    tooltip.style.top = mouseY + "px";
  }
}