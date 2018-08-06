/* ==========================================================================
   Share to socials buttons
   ========================================================================== */

(function() {
  $("[data-toggle='share']").on("click", function(e) {
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
   Copy URL button
   ========================================================================== */

(function() {
  "use strict";

  var $btn     = $("[data-toggle='copyUrl']"),
      $output  = $("[data-target='copyUrl']"),
      duration = 400;

  $btn.on("click", function() {
    $output.parent().slideDown(duration);

    setTimeout(function() {
      // Copy page url without an anchor link
      $output[0].value = window.location.href.replace(/\#\d$/i, "");
      $output.focus();
      $output[0].select();
      document.execCommand("Copy");
    }, duration);

    setTimeout(function() {
      $output
        .blur()
        .css({"font-style": "italic", "color": "#858585", "opacity": 0})
        .animate({opacity: "1"})
        .val("Ссылка скопирована!");
    }, duration + 500);
  });
}) (); 
