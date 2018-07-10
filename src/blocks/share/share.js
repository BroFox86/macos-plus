/* ==========================================================================
   Share buttons
   ========================================================================== */

(function() {
  $("[data-toggle='shareBtn']").on("click", function(e) {
    "use strict";
    e.preventDefault();

    var pageUrl  = window.location.href.replace(/\#\d$/i, ""),
        shareUrl = $(this).attr("href").replace(/[^=]*$/, pageUrl),
        width    = "width=500",
        height   = "height=600";

    window.open(shareUrl, "", width + "," + height);
  })
}) (); 

/* ==========================================================================
   Copy URL
   ========================================================================== */

(function() {
  "use strict";

  var $btn     = $("[data-toggle='copyBtn']"),
      $output  = $("[data-target='copyBtn']"),
      duration = 400;

  $btn.on("click", function() {
    $output.parent().slideDown(duration);

    setTimeout(function() {
      $output[0].value = window.location.href.replace(/\#\d$/i, "");
      $output.focus();
      $output[0].select();
      document.execCommand("Copy");
    }, duration);

    setTimeout(function() {
      $output
        .blur()
        .css({"font-style": "italic", "color": "#777", "opacity": 0})
        .animate({opacity: "1"})
        .val("Ссылка скопирована!");
    }, duration + 500);
  });
}) (); 
