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
			$("#charity_select").before("<span style='font-weight:normal;'>You can visit our website to pick a charity that you want your browsing to count towards.</span><br>").click(function() {
				window.location = "http://www.ads4charity.org/dashboard";
			});
			if (localStorage['charityName']) {
			  $("#charity_select").after("<br><span style='font-weight:normal;'>Your're advertisement revenue is currently going towards <strong>" + localStorage['charityName'] + "</strong>.</span>");
			} else {
			  $("#charity_select").after("<br><span style='font-weight:normal;'>You haven't selected a charity yet.</span>");
			}
		});
	});
})(jQuery);