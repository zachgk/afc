var wk ,wk2, charity_selection, auto_ads;
var ad_number=1;
var ad_codes = ["63855", "63856", "63858", "63859", "63860"];

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
	"obstacle":".a4c_idle",
	"preventCollision":true
  });
}

function enable_remove() {
	$('.a4c_remove').unbind("click");
  $('.a4c_remove').click(function() {
	console.log(ad_codes);
	ad_codes.push($(this).parent().parent().attr("afc_ad_id"));
	ad_number--;
    $(this).parent().parent().fadeOut().remove();
	save_ad_positions();
  });
}

function save_ad_positions(){
  ad_number = 1;
  wk = new Array();
  $('.a4c_ad').each(function(){
	wk2 = {"top": $(this).css('top'), "right": $(this).css('right'), "bottom": $(this).css('bottom'), "left": $(this).css('left')};
    wk.push( wk2 );
	ad_number++;
  });
  chrome.extension.sendRequest({action: "save_ad_positions", "positions": wk, "url": window.location.host});
}

function create_ad() {
  if(ad_number <= 5) {
	start_ad(  (ad_number * 130) + "px" , "auto", "auto", "100px");
  } else {
	chrome.extension.sendRequest({action: "display_message", message: "Sorry, you can only place five advertisements on each website.", type: "alert", time: 2000}, function(response){
		noty(response.formated_message);
	});
  }
  server_views(1);
}

function server_views(number){
  $.get("http://ads4charity.org/ad.php",{"charity":charity_selection,"number":number},function(data){
    console.log(data);
  });
}


function start_ad(top, right, bottom, left, no_save) {
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
	pw_load();
	enable_drag();
	enable_remove();
	ad_number++;
	if (!no_save) {
		save_ad_positions();
	}
}

function startup(){
	chrome.extension.sendRequest({action: "request_startup_info", "url": window.location.host});
}

function pw_load() {
	if(arguments.callee.z)return;else arguments.callee.z=true;
	var d=document;var s=d.createElement('script');
      var x=d.getElementsByTagName('script')[0];
      s.type='text/javascript';s.async=true;
      s.src='//www.projectwonderful.com/pwa.js';
      x.parentNode.insertBefore(s,x);
}

function startup_ads(data){
	if(data.positions.length > 0){
		for(i=0; i<data.positions.length; i++){
			start_ad(data.positions[i].top,data.positions[i].right, data.positions[i].bottom, data.positions[i].left);
		}
		server_views(data.positions.length);
	} else {
		switch(data.auto_ads) {
			//start_ad(top, right, bottom, left)
		  case 'topCorners':
				start_ad("15px", "auto", "auto", "15px", 1);
				start_ad("15px", "15px", "auto", "auto", 1);
				server_views(2);
		  break;
		  case 'bottomCorners':
				start_ad("auto", "auto", "15px", "15px", 1);
				start_ad("auto", "15px", "15px", "auto", 1);
				server_views(2)
		  break;
		  case 'allCorners':
				start_ad("auto", "auto", "15px", "15px", 1);
				start_ad("auto", "15px", "15px", "auto", 1);
				start_ad("15px", "auto", "auto", "15px", 1);
				start_ad("15px", "15px", "auto", "auto", 1);
				server_views(4);
		  break;
		  case 'rightCorners':
				start_ad("auto", "15px", "15px", "auto", 1);
				start_ad("15px", "15px", "auto", "auto", 1);
				server_views(2);
		  break;
		  case 'leftCorners':
				start_ad("15px", "auto", "auto", "15px", 1);
				start_ad("auto", "auto", "15px", "15px", 1);
				server_views(2);
		}
	}
	chrome.extension.sendRequest({action: "get_local_storage"}, function(response){
	var tempLocalStorage = response.localStorage;
		if (tempLocalStorage.noCharityViews > 10 && tempLocalStorage.noCharityViews % 10 === 0 && tempLocalStorage["store.settings.no_charity_selected"] == "\"checked\"" ) { //if the users has loaded a page without a selected charity more than 10 times, and if the setting is checked, display a warning message every 10 page loads
			chrome.extension.sendRequest({action: "display_message", message: "It looks like you haven't selected a charity yet.  Click on the heart-shaped icon in the top right corner and click on \"Select a Charity\".", type: "error", time: 4000}, function(response){
				noty(response.formated_message);
		});
		}
	});
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
  } else {}
});

chrome.extension.sendRequest({action: "get_charity"}, function(response){
  charity_selection = response.charity;
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
  } else if (modifier && event.keyCode == 113) {  //F2
	remove_all_ads();
  }
}, false);