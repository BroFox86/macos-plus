$(document).ready(function () {

	var $imgLink       = $(".article__img-wrapper"),
	    $img           = $(".article__img"),
	    $lightbox      = $(".lightbox"),
	    $lightboxInner = $(".lightbox__inner"),
	    $lightboxImg   = $(".lightbox__img"),
	    $lightboxClose = $(".lightbox__close"),
			duration       = 300,
			clearDelay     = 500;

	$imgLink.on("click", function (e) {
		e.preventDefault();

		var largeImage = $(this).attr("href"),
				imageAlt   = $(this).children("img").attr("alt");
			
		$('body').bind("mousewheel", function () {
			return false;
		});
				
		$lightboxImg.attr({ src: largeImage, alt: imageAlt });
		$lightbox.fadeIn(duration);
	});

	$lightboxInner.mouseenter(function () {
		$lightbox.unbind("click");
	});

	function unloadImg() {
		setTimeout(function() {
			$lightboxImg.attr({ src: "", alt: "" });
		}, clearDelay);
	}

	$lightboxInner.mouseleave(function () {
		$lightbox.on("click", function () {
			$('body').unbind("mousewheel");
			$lightbox.fadeOut(duration);
			unloadImg();
		});
	}),

	$lightboxClose.on("click", function () {
		$('body').unbind("mousewheel");
		$lightbox.fadeOut(duration);
		unloadImg();
	})
});
