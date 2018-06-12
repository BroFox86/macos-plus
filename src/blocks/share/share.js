/* ==========================================================================
   Share button
   ========================================================================== */

share(".js-share");

function share(element) {
  "use strict";

  $(element).on("click", function(e) {
    e.preventDefault();

    var pageUrl  = window.location.href.replace(/\#\d$/i, ""),
        width    = "width=500",
        height   = "height=600";

    var shareUrl = $(this).attr("href").replace(/[^=]*$/, pageUrl);

    window.open(shareUrl, "", width + "," + height)
  })
}

/* ==========================================================================
   Copy URL button
   ========================================================================== */

copy({ 
  btn:        ".js-copy-url", 
  outputArea: ".js-paste-url", 
  duration:   500
});

function copy(options) {
  "use strict";

  $(options.btn).on("click", function() {
    $(options.outputArea).parent().slideDown(options.duration);

    setTimeout(function() {
      var output = $(options.outputArea)[0];

      output.value = window.location.href.replace(/\#\d$/i, "");
      output.focus();
      output.select();
      document.execCommand("Copy");
    }, options.duration);
  });
}
