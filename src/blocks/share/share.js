copy({ 
  btn:           ".js-copy-url", 
  outputWrapper: ".share__paste-wrapper", 
  outputArea:    ".js-paste-url", 
  duration:      500
});

function copy(options) {
  "use strict";

  var duration = options.duration || 0;

  $(options.btn).on("click", function() {

    $(options.outputWrapper).slideDown(duration);

    setTimeout(function() {
      var output = $(options.outputArea)[0];
      output.value = window.location.href.replace(/\#\d$/i, "");
      output.focus();
      output.select();
      document.execCommand("Copy");
    }, duration);
  });
}

share(".js-share");

function share(element, width, height) {
  "use strict";

  $(element).on("click", function(e) {
    e.preventDefault();

    var pageUrl  = window.location.href.replace(/\#\d$/i, ""),
        width  = width  || "width=500",
        height = height || "height=600";

    var url = $(this).attr("href").replace(/[^=]*$/, pageUrl);

    window.open(url, "", width + "," + height)
  })
}
