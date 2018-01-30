$(document).ready(function () {

	var $nav       = $(".site-nav__list"),
	    fixed      = "is-fixed",
	    mq         = window.matchMedia("(min-width: 60em)"),
	    top        = $nav.offset().top,
	    navHeight  = $nav.outerHeight();

	$(window).scroll(function (event) {
		var y = $(this).scrollTop();

		if (y >= top && mq.matches) {
			$nav.addClass(fixed);
			$(".header").css("margin-bottom", navHeight);
		} else {
			$nav.removeClass(fixed);
			$(".header").css("margin-bottom", "");
		}
	});
});

