// SAMPLE
this.manifest = {
    "name": "Ads4Charity",
    "icon": "icon48.png",
    "settings": [
        {
            "tab": "Advertisements",
            "group": "Automatic Advertisement Placement",
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
            "tab": "Advertisements",
            "group": "Clear Custom Advertisement Positions",
            "name": "remove_description",
            "type": "description",
            "text": 'This setting clears any advertisements that you have manually placed.<br>If you are using a template, all websites will now use it again.'
        },
		{
            "tab": "Advertisements",
            "group": "Clear Custom Advertisement Positions",
            "name": "remove_all",
            "type": "button",
            "text": "Clear Custom Advertisement Positions",
       },
		{
            "tab": "Charities",
            "group": "Charity Selection",
            "name": "charities",
            "type": "description",
            "text": 'To choose a charity that you want your advertisement views to count towards, visit <a href="http://www.ads4charity.org/charities"> our website </a>.'
        }
	],
	    
};