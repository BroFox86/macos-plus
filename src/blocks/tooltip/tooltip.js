$(document).ready(function () {

	var $hook = $(".link--tooltip"),
			contentClass = "tooltip";

	$hook
		.hover(
		function () {
			var title = $(this).attr("title");
			$(this)
				.data("tipText", title)
				.removeAttr("title");
			$("<p class=" + contentClass + "></p>")
				.text(title)
				.appendTo("body")
				.fadeIn(300);
		},
		function () {
			$(this).attr("title", $(this).data("tipText"));
			$("." + contentClass).remove();
		}
		)
		.mousemove(function (e) {
			var mousex = e.pageX + 20; //Get X coordinates
			var mousey = e.pageY + 10; //Get Y coordinates
			$("." + contentClass).css({ top: mousey, left: mousex });
		});
});
