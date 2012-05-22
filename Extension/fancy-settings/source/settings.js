window.addEvent("domready", function () {
    new FancySettings.initWithManifest(function (settings) {
        settings.manifest.remove_all.addEvent("action", function () {
		  chrome.extension.sendRequest({action: "remove_all_ads"});
		  console.log("clearing ads sent");
        });
    });
});
