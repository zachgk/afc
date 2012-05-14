// JavaScript Document

var wk ,wk2, ad_number=1;

function enable_drag(){
  $('.a4c_ad').draggable({
    "containment":"body",
	"handle":".a4c_move",
	"stop":function(event, ui){
	  save_ad_positions();
	}
  });
}

function enable_remove(){
  $('.a4c_remove').click(function(){
    console.log('remove');
    $(this).parent().parent().fadeOut().remove();
	save_ad_positions();
  });
}

function save_ad_positions(){
  wk = new Array();
  $('.a4c_ad').each(function(){
    wk2 ={"top": $(this).css('top') ,"left": $(this).css('left')};
    wk.push( wk2 );
  });
  chrome.extension.sendRequest({action: "save_ad_positions", "positions": wk, "url": window.location.host});
}

function create_ad() {
  start_ad("100px","100px");
}



function start_ad(top,left) {
	//we need to return different embed code for each ad, so ad_number will be an integer between 1 and 5
    $('body').append("<div class='a4c_ad a4c_ad_new' style='display:none;top: "+top+"; left: "+left+";'><embed src='http://ads4charity.org/ad.php?ad_number="+ad_number+"'><div class='a4c_panel'><span class='a4c_remove'>Remove</span><br><span class='a4c_move'>Move</span></div></div>");
		$(".a4c_ad_new").delay(200).fadeIn(); //prevents the flash of the new ad
		$(".a4c_ad").hover(function(){
			$(this).find(".a4c_panel").css({
				"opacity":"1",
				"-webkit-transition":"left 0.25s ease-in-out",
				"left":"34px"
			});
		}, function() {
			$(".a4c_ad .a4c_panel").css({
				"-webkit-transition":"all 0.25s ease-in-out",
				"left":"-75px"
			});
		});		
		ad_number++;
		enable_drag();
		enable_remove();
}

function startup(){
  chrome.extension.sendRequest({action: "request_startup_info", "url": window.location.host});     
} 

function startup_ads(data){
  for(i=0; i<data.positions.length; i++){
    start_ad(data.positions[i].top,data.positions[i].left);
  }
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