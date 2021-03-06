var all_ad_positions, ad_position, url, tempLocalStorage, ad_number;
var ad_codes = ["63855", "63856", "63858", "63859", "63860"];
var startup_runs = 0;

chrome.extension.sendMessage({action: "get_local_storage"}, function(response){
	tempLocalStorage = response.localStorage;
	if (tempLocalStorage.noCharityViews >= 10 && tempLocalStorage.noCharityViews % 10 === 0 && tempLocalStorage["store.settings.no_charity_selected"] == "true") { //if the users has loaded a page without a selected charity more than 10 times, and if the setting is checked, display a warning message every 10 page loads
		chrome.extension.sendMessage({action: "display_message", message: 'It looks like you haven\'t selected a charity yet.  Click on the "Select a Charity" button in the options page.', type: "error", time: 4000}, function(response){
			noty(response.formated_message);
		});
	}
});

function enable_drag(){
  $('.a4c_ad').draggable({
    "containment":"body",
	"handle":".a4c_move",
	"stop":function(event, ui){
	  $(this).addClass('a4c_idle');
	  if ($(this).css("left").substring(0, $(this).css("left").length - 2) > $(window).width() / 2) {
		$(this).css("right", $(window).width() - $(this).css("left").substring(0, $(this).css("left").length - 2) - 125	).css("left", "auto");
	  }
	  save_ad_positions();
	},
	"start":function(event,ui){
	  $(this).removeClass('a4c_idle');
	},
	"obstacle":".a4c_idle,#watch-video",//blocks our adds, youtube videos
	"preventCollision":true
  });
}

function enable_remove() {
  $('.a4c_remove').unbind("click");
  $('.a4c_remove').click(function() {
	ad_codes.push($(this).parent().parent().attr("afc_ad_id"));
	ad_number--;
    $(this).parent().parent().fadeOut().remove();
	if (ad_number == 1) {
	  chrome.extension.sendMessage({action: "blacklist_current_site", "url": url });
	}
	save_ad_positions();
  });
}

function save_ad_positions() {
  ad_number = 1;
  all_ad_positions = new Array();
  $('.a4c_ad').each(function(){
	ad_position = {"top": $(this).css('top'), "right": $(this).css('right'), "bottom": $(this).css('bottom'), "left": $(this).css('left')};
    all_ad_positions.push(ad_position);
	ad_number++;
  });
  chrome.extension.sendMessage({action: "save_ad_positions", "positions": all_ad_positions, "url": url });
}

function create_ad() {
  if(ad_number <= 5) {
	start_ad( (ad_number * 130) + "px" , "auto", "auto", "100px");
    enable_drag();
	enable_remove();
  } else {
	chrome.extension.sendMessage({action: "display_message", message: "Sorry, you can only place five advertisements on each website.", type: "alert", time: 2000}, function(response){
		noty(response.formated_message);
    });
  }
  chrome.extension.sendMessage({"action": "increase_charity_views","amount":1});
}

function start_ad(top, right, bottom, left, no_save) {
	if (ad_number > 6) return;
	/*	//Debug code for ad_numbers and an example of using our noty helper functions for displaying messages
	chrome.extension.sendMessage({action: "display_message", message: "Add number " + ad_number + " has been created.", type: "alert", time: 2000}, function(response){
		noty(response.formated_message);
	});
	*/
	var this_ad_number = Math.floor((Math.random()*(6 - ad_number)));
	$('body').append("<div afc_ad_id=\"" + ad_codes[this_ad_number] + "\" class='a4c_ad a4c_idle' style='top: "+top+"; left: "+left+"; right: " + right + ";bottom: " + bottom +";'><embed src=\"" + chrome.extension.getURL("ads/" + ad_codes[this_ad_number] + ".html") + "\"><div class='a4c_panel'><span title='Remove this advertisement' class='a4c_remove'></span><span title='Move this advertisement' class='a4c_move'></span></div></div>");
	ad_codes.splice(this_ad_number, 1);
	$(".a4c_ad").disableSelection().hover(function(){
		$(this).find(".a4c_panel").css("opacity", 0.85);
	}, function() {
		$(this).find(".a4c_panel").css("opacity", 0);
	});
	ad_number++;
	if (!no_save) {
		save_ad_positions();
	}
}

function startup() {
  ad_number=1;
  url = window.location.host;
  url.replace('www.','');
  chrome.extension.sendMessage({action: "request_startup_info", "url": url });
}

function remove_all_ads() {
  ad_codes = ["63855", "63856", "63858", "63859", "63860"];
  $('.a4c_ad').remove();
  save_ad_positions();
}

function startup_ads(data){
    if(startup_runs > 0) return;
	if(data.positions.length > 0){
		for(i=0; i<data.positions.length; i++){
			start_ad(data.positions[i].top,data.positions[i].right, data.positions[i].bottom, data.positions[i].left);
		}
	} else {
		switch(tempLocalStorage["store.settings.autoAds"]) {
		  case '"Top Corners"':
				start_ad("15px", "auto", "auto", "15px", 1);
				start_ad("15px", "15px", "auto", "auto", 1);
		  break;
		  case '"Bottom Corners"':
				start_ad("auto", "auto", "15px", "15px", 1);
				start_ad("auto", "15px", "15px", "auto", 1);
		  break;
		  case '"All Corners"':
				start_ad("auto", "auto", "15px", "15px", 1);//bottom left
				start_ad("auto", "15px", "15px", "auto", 1);//bottom right
				start_ad("15px", "auto", "auto", "15px", 1);//top left
				start_ad("15px", "15px", "auto", "auto", 1);//top right
		  break;
		  case '"Right Corners"':
				start_ad("auto", "15px", "15px", "auto", 1);
				start_ad("15px", "15px", "auto", "auto", 1);
		  break;
		  case '"Left Corners"':
				start_ad("15px", "auto", "auto", "15px", 1);
				start_ad("auto", "auto", "15px", "15px", 1);
		}
	}
	enable_drag();
	enable_remove();
	chrome.extension.sendRequest({action: "increase_charity_views", amount: (ad_number-1)});
	startup_runs++;
}

  //End Functions and begin stuff loaded on page start

chrome.extension.onMessage.addListener( function(request, sender, sendResponse){
  if(request.action == "create"){
    create_ad();
    sendResponse({});
  } else if(request.action == "startup_ads"){
    startup_ads(request);
    sendResponse({});
  } else if(request.action == "no_startup"){
    startup_runs++;
    sendResponse({});
  }  else if(request.action == "remove_all_ads"){
    remove_all_ads();
    sendResponse({});
  } else if(request.action == "get_url"){
    sendResponse({"url": url });
  } else if(request.action == "reload"){
    startup_runs = 0;
	startup();
	sendResponse({});
  } else if(request.action == "revert_message" && tempLocalStorage["store.settings.revert_notification"] == "true"){
	var ad_template_name = tempLocalStorage["store.settings.autoAds"].substr(1);
	chrome.extension.sendMessage({action: "display_message", message: "Refresh this page to go back to the <i>" + ad_template_name.substr(0, ad_template_name.length-1) + "</i> template.", time:3000}, function(response){
		noty(response.formated_message);
	});
    sendResponse({});
  } else {}
});

startup();

//keyboard shortcuts
window.addEventListener("keydown", function(event) {
  var modifier = event.ctrlKey || event.metaKey;   // Bind to both command (for Mac) and control (for Win/Linux)
  if (modifier && event.keyCode == 114) { //F3
	create_ad();
  }
}, false);