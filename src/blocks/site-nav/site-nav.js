function fixSiteNav() {
  // For bypass the jsdom error associated with matchMedia
  window.matchMedia =
    window.matchMedia ||
    function() {
      return {
        matches: false,
        addListener: function() {},
        removeListener: function() {}
      };
    };

  var $nav   = $(".site-nav__list"),
      mq     = window.matchMedia("(min-width: 960px)"),
      offset = $nav.offset().top,
      fixed  = "",
      margin = "";

  function toggleNavFixing() {
    $(window).scroll(function() {
      var y = $(this).scrollTop();

      if (y >= offset && mq.matches) {
        $nav.addClass(fixed);
        $(".header").css("margin-bottom", margin);
      } else {
        $nav.removeClass(fixed);
        $(".header").css("margin-bottom", "");
      }
    });
  }
  // If IE11
  if (
    navigator.userAgent.match(/Trident\/7.0/) &&
    navigator.userAgent.match(/rv:11/)
  ) {
    fixed = "is-fixed";
    margin = $nav.outerHeight();
    toggleNavFixing();
  } 
  
  // Other browsers
  else {
    function handleMqChanges(event) {
      fixed = event.matches ? "is-fixed" : "";
      margin = event.matches ? $nav.outerHeight() : "";
      toggleNavFixing();
    }
    mq.addListener(handleMqChanges);
    handleMqChanges(mq);
  }
}

fixSiteNav();
