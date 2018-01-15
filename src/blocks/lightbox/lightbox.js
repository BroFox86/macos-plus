$(document).ready(function () {

	var $imgLink       = $(".article__img-wrapper"),
	    $img           = $(".article__img"),
	    $lightbox      = $(".lightbox"),
	    $lightboxInner = $(".lightbox__inner"),
	    $lightboxImg   = $(".lightbox__img"),
	    $lightboxClose = $(".lightbox__close"),
	    duration       = 300;

	$imgLink.on("click", function (e) {
		e.preventDefault();

		$lightboxImg.attr({ src: "", alt: "" });

		$('body').bind("mousewheel", function () {
			return false;
		}); 

		$lightbox.fadeIn(duration);

		var largeImage = $(this).attr("href"),
				imageAlt   = $(this).children("img").attr("alt");
				
		$lightboxImg.attr({ src: largeImage, alt: imageAlt });
	});

	$lightboxInner.mouseenter(function () {
		$lightbox.unbind("click");
	});

	$lightboxInner.mouseleave(function () {
		$lightbox.on("click", function () {
			$('body').unbind("mousewheel");
			$lightbox.fadeOut(duration);
		});
	}),

	$lightboxClose.on("click", function () {
		$('body').unbind("mousewheel");
		$lightbox.fadeOut(duration);
	})
});
