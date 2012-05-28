var a4c_help_text = '<ol>\
<li>Download the extension from the Google Chrome Webstore.</li>\
<li>Go to the options page by clicking on the icon and selecting the button that says \"Options\".</li>\
<li>If you want advertisements to be automatically placed, select a template (it is recommended).</li>\
<li>Click on the \"Select your Charity\" button at the bottom to choose which charity you want your web browsing to count towards.</li>\
<li>On your favorite charity, press the corresponding blue \"Select this Charity\" button to the right.</li>\
</ol>';

this.manifest = {
    "name": "Ads4Charity",
    "icon": "icon48.png",
    "settings": [
		{
            "tab": "General",
            "group": "Charity Options",
            "name": "charity_select",
            "type": "button",
            "text": 'Select a Charity'
        },
        {
            "tab": "General",
            "group": "Automatic Advertisement Placement",
            "name": "autoAds",
            "type": "radioButtons",
            "label": "Once you move an advertisement, the template will be overridden for only that website. <br>To return to the default template or switch templates, remove all advertisements on that website.<br>",
            "options": [
				["No Automation"],
				["Top Corners"],
				["Bottom Corners"],
				["All Corners"],
				["Right Corners"],
				["Left Corners"],
			]
		},
		{
            "tab": "General",
            "group": "Clear Custom Advertisement Positions",
            "name": "remove_description",
            "type": "description",
            "text": 'This setting clears any advertisements that you have manually placed.<br>If you are using a template, all websites will now use it again.'
        },
		{
            "tab": "General",
            "group": "Clear Custom Advertisement Positions",
            "name": "remove_all",
            "type": "button",
            "text": "Clear Custom Advertisement Positions",
       },
		{
            "tab": "Notifications",
            "group": "Charities",
            "name": "no_charity_selected",
            "type": "checkbox",
            "label": 'Warning when no charity is selected.'
        },
		{
            "tab": "Notifications",
            "group": "Advertisements",
            "name": "revert_notification",
            "type": "checkbox",
            "label": 'Remind me to refresh the page when I switch back to a template.'
        },
		{
			"tab": "Help",
			"group":"Steps for getting started",
			"name":"Help",
			"type":"description",
			"label":"Sample Help Item",
			"text":a4c_help_text
		},
		{
			"tab": "Help",
			"group":"FAQ",
			"name":"FAQ",
			"type":"description",
			"label":"Sample Help Item",
			"text":"If you have more questions, take a look at the <a href='http://ads4charity.org/faq-page'>FAQ page</a> on our website."
		}
	],
	    
};