// JavaScript Document

var wk = 0;
var wk2 = 0;

function enable_drag(){
  $('.adsforcharity_ad').draggable({
    "containment":"body",
	"handle":".a4c_move"
  });
}

function disable_drag(){
  save_ad_positions();
  $('.adsforcharity_ad').draggable('destroy');
}

function save_ad_positions(){
  alert('ad positions saved');
  wk = new Array();
  $('.adsforcharity_ad').each(function(){
    wk2 ={"top": $(this).css('top') ,"left": $(this).css('left')};
    wk.push( wk2 );
  });
  chrome.extension.sendRequest({action: "save_ad_positions", "positions": wk, "url": window.location.host});
}

function toggle_drag(enabled){
  console.log(enabled);
  if(enabled){
    disable_drag();
  } else {
    enable_drag();
  }
}

function create_ad() {
  start_ad("100px","100px");
}



function start_ad(top,left) {
    $('body').append("<div class='adsforcharity_ad adsforcharity_ad_new'><embed src='http://ads4charity.org/ad.php'><div class='panel'><span class='a4c_remove'>Remove</span><br><span class='a4c_move'>Move</span><br>Options</div></div>");

		$(".adsforcharity_ad").hover(function(){
			$(this).find(".panel").fadeIn();
		},function(){
			$(this).find(".panel").fadeOut();
		});
		
		enable_drag();
}

function startup(){
  chrome.extension.sendRequest({action: "request_startup_info", "url": window.location.host});     
} 

function startup_ads(data){
  for(i=0; i<data.positions.length; i++){
    start_ad(data.positions[i].top,data.positions[i].left);
  }
}

function remove_all_ads(){
  $('.adsforcharity_ad').remove();
  save_ad_positions();
}

        //End Functions and begin stuff loaded on page start

chrome.extension.onRequest.addListener( function(request, sender, sendResponse){
  if(request.action == "create"){
    create_ad();
    sendResponse({});
  } else if(request.action == "drag"){
    toggle_drag(request.enabled);
    sendResponse({});
  } else if(request.action == "remove_all"){
    remove_all_ads();
    sendResponse({});
  }  else if(request.action == "startup_ads"){
    startup_ads(request);
    sendResponse({});
  } else {}
});

startup();
