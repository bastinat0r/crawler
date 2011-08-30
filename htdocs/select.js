function selectLink(href) {
	alert(href);
	location.href = "proxy.html";
	// ToDo: post -> url (like in index.html, GET would possibly be easier ...) 
}

$(document).ready(function() {
	$("a").click(function(event) {
		event.preventDefault();
		selectLink($(this).attr("href"));
	});
});
