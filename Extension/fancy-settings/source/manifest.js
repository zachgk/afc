// SAMPLE
this.manifest = {
    "name": "Ads4Charity",
    "icon": "icon48.png",
    "settings": [
        {
            "tab": "Automatic Advertisment Placement",
            "group": "Ad Placement Templates",
            "name": "autoAds",
            "type": "radioButtons",
            "label": "Once you move an advertisement, the template will be overridden for only that website. <br>To return to the default template or switch templates, remove all advertisements on that website.<br>",
            "options": [
				["disabled", "No Automation"],
				["allCorners", "All Corners"],
				["topCorners", "Top Corners"],
				["bottomCorners", "Bottom Corners"],
				["rightCorners", "Right Corners"],
				["leftCorners", "Left Corners"],
			]
		},
		{
            "tab": "Charities",
            "group": "Charity Selection",
            "name": "charities",
            "type": "description",
            "text": 'To choose a charity that you want your advertisement views to count towards, visit <a href="http://www.ads4charity.org/charities"> our website </a>.'
        }
	]
};