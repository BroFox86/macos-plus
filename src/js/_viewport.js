var viewportwidth, viewportheight;

if (typeof window.innerWidth != "undefined") {
  (viewportwidth = window.innerWidth), (viewportheight = window.innerHeight);
}

$(window).resize(function() {
  if (typeof window.innerWidth != "undefined") {
    (viewportwidth = window.innerWidth), (viewportheight = window.innerHeight);
  }
  $("#viewportInfo").html(+(viewportwidth - 15) + "x" + viewportheight);
});

$("body").append(
  '<p id="viewportInfo">' + (viewportwidth - 15) + "x" + viewportheight + "</p>"
);

$("#viewportInfo").css({
  position: "fixed",
  bottom: 0,
  left: "1%",
  "z-index": 999,
  color: "blue"
});
