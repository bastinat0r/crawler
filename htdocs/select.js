function selectLink(href) {
	alert(href);
	var form = document.createElement("form");
	form.setAttribute("method", "post");
	form.setAttribute("action", "../proxy.html");

	var hiddenField = document.createElement("input");
	hiddenField.setAttribute("type", "text");
	hiddenField.setAttribute("name", "url");
	hiddenField.setAttribute("value", href);

	form.appendChild(hiddenField);
	document.body.appendChild(form);
	form.submit();
}

$(document).ready(function() {
	$("a").click(function(event) {
		event.preventDefault();
		selectLink($(this).attr("href"));
	});
});
