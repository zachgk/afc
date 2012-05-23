(function($) {
	$(function() {
		new FancySettings.initWithManifest(function (settings) {
			$("html").css("-webkit-user-select", "none");
			$("#remove_all").click(function() {
				chrome.extension.sendRequest({action: "remove_all_ads"});
				chrome.extension.sendRequest({action: "display_message", message: "Advertisements will now use the selected template.  If no template is selected, advertisements will not appear on any website until you create them.", time: 4000}, function(response){
					noty(response.formated_message);
				});
			});
			$(".autoAds").click(function() {
				chrome.extension.sendRequest({action: "display_message", message: "Advertisements are now automatically being placed with the <i>" + $(this).next().text() + "</i> template.", time: 4000}, function(response){
					noty(response.formated_message);
				});
			});
			$("label.checkbox").click(function() {
				chrome.extension.sendRequest({action: "display_message", message: "Your settings have been saved."}, function(response){
					noty(response.formated_message);
				});
			});
		});
	});
})(jQuery);