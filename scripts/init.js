$(document).bind('deviceready', initialize, false);

$(document).bind('mobileinit', initialize);

function initialize() {
	$.mobile.page.prototype.options.theme = "a";
}