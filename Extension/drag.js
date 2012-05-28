var wk ,wk2, url, tempLocalStorage;
var ad_number=1;
var ad_codes = ["63855", "63856", "63858", "63859", "63860"];
var startup_runs = 0;

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
	save_ad_positions();
  });
}

function save_ad_positions() {
  ad_number = 1;
  wk = new Array();
  $('.a4c_ad').each(function(){
	wk2 = {"top": $(this).css('top'), "right": $(this).css('right'), "bottom": $(this).css('bottom'), "left": $(this).css('left')};
    wk.push(wk2);
	ad_number++;
  });
  chrome.extension.sendRequest({action: "save_ad_positions", "positions": wk, "url": url });
}

function create_ad() {
  if(ad_number <= 5) {
	start_ad( (ad_number * 130) + "px" , "auto", "auto", "100px");
    enable_drag();
	enable_remove();
  } else {
	chrome.extension.sendRequest({action: "display_message", message: "Sorry, you can only place five advertisements on each website.", type: "alert", time: 2000}, function(response){
		noty(response.formated_message);
    });
  }
  chrome.extension.sendRequest({"action": "increase_charity_views","amount":1});
}

function start_ad(top, right, bottom, left, no_save) {
	if (ad_number > 6) return false;
	/*	//Debug code for ad_numbers and an example of using our noty helper functions for displaying messages
	chrome.extension.sendRequest({action: "display_message", message: "Add number " + ad_number + " has been created.", type: "alert", time: 2000}, function(response){
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

function startup(){
    url = window.location.host;
	url.replace('www.','');
	chrome.extension.sendRequest({action: "request_startup_info", "url": url });
}

function startup_ads(data){
    if(startup_runs > 0) return false;
	if(data.positions.length > 0){
		for(i=0; i<data.positions.length; i++){
			start_ad(data.positions[i].top,data.positions[i].right, data.positions[i].bottom, data.positions[i].left);
		}
	} else {
		switch(tempLocalStorage["store.settings.autoAds"]) {
			//start_ad(top, right, bottom, left)
		  case 'Top Corners':
				start_ad("15px", "auto", "auto", "15px", 1);
				start_ad("15px", "15px", "auto", "auto", 1);
		  break;
		  case 'Bottom Corners':
				start_ad("auto", "auto", "15px", "15px", 1);
				start_ad("auto", "15px", "15px", "auto", 1);
		  break;
		  case 'All Corners':
				start_ad("auto", "auto", "15px", "15px", 1);//bottom left
				start_ad("auto", "15px", "15px", "auto", 1);//bottom right
				start_ad("15px", "auto", "auto", "15px", 1);//top left
				start_ad("15px", "15px", "auto", "auto", 1);//top right
		  break;
		  case 'Right Corners':
				start_ad("auto", "15px", "15px", "auto", 1);
				start_ad("15px", "15px", "auto", "auto", 1);
		  break;
		  case 'Left Corners':
				start_ad("15px", "auto", "auto", "15px", 1);
				start_ad("auto", "auto", "15px", "15px", 1);
		}
	}
	chrome.extension.sendRequest({action: "get_local_storage"}, function(response){
	tempLocalStorage = response.localStorage;
		if (tempLocalStorage.noCharityViews >= 10 && tempLocalStorage.noCharityViews % 10 === 0 && tempLocalStorage["store.settings.no_charity_selected"] == "true") { //if the users has loaded a page without a selected charity more than 10 times, and if the setting is checked, display a warning message every 10 page loads
			chrome.extension.sendRequest({action: "display_message", message: "It looks like you haven't selected a charity yet.  Click on the heart-shaped icon in the top right corner and click on \"Select a Charity\".", type: "error", time: 4000}, function(response){
				noty(response.formated_message);
		});
		}
	});
	enable_drag();
	enable_remove();
	chrome.extension.sendRequest({action: "increase_charity_views", amount: (ad_number-1)});
	startup_runs++;
}

  //End Functions and begin stuff loaded on page start

chrome.extension.onRequest.addListener( function(request, sender, sendResponse){
  if(request.action == "create"){
    create_ad();
    sendResponse({});
  } else if(request.action == "startup_ads"){
    startup_ads(request);
    sendResponse({});
  }  else if(request.action == "remove_all_ads"){
    remove_all_ads();
    sendResponse({});
  } else if(request.action == "get_url"){
    sendResponse({"url": url });
  } else if(request.action == "revert_message" && tempLocalStorage["store.settings.revert_notification"] == "true"){
	chrome.extension.sendRequest({action: "display_message", message: "Refresh this page to go back to the <i>" + auto_ads + "</i> template."}, function(response){
		noty(response.formated_message);
	});
    sendResponse({});
  }  else {}
});

startup();

function remove_all_ads() {
  $('.a4c_ad').remove();
  save_ad_positions();
}

//keyboard shortcuts
window.addEventListener("keydown", function(event) {
  var modifier = event.ctrlKey || event.metaKey;   // Bind to both command (for Mac) and control (for Win/Linux)
  if (modifier && event.keyCode == 114) { //F3
	create_ad();
  }
}, false);