function selectLink(href) {
	alert(href);
}

$(document).ready(function() {
	$("a").click(function(event) {
		event.preventDefault();
		selectLink($(this).attr("href"));
	});
});
