$(document).ready(function () {

  $(".article__tooltip")
    .hover(
      function () {
        var title = $(this).attr("title");
        $(this)
          .data("tipText", title)
          .removeAttr("title");
        $('<p class="tooltip"></p>')
          .text(title)
          .appendTo("body")
          .fadeIn(300);
      },
      function () {
        $(this).attr("title", $(this).data("tipText"));
        $(".tooltip").remove();
      }
    )
    .mousemove(function (e) {
      var mousex = e.pageX + 20; //Get X coordinates
      var mousey = e.pageY + 10; //Get Y coordinates
      $(".tooltip").css({
        top: mousey,
        left: mousex
      });
    });
});