// JavaScript Document

var wk ,wk2, ad_number=1, charity_selection;

function enable_drag(){
  $('.a4c_ad').draggable({
    "containment":"body",
	"handle":".a4c_move",
	"stop":function(event, ui){
	  save_ad_positions();
	  $(this).addClass('a4c_idle');
	},
	"start":function(event,ui){
	  $(this).removeClass('a4c_idle');
	},
	"obstacle":".a4c_idle",
	"preventCollision":true
  });
}

function enable_remove(){
  $('.a4c_remove').click(function(){
    $(this).parent().parent().fadeOut().remove();
	save_ad_positions();
	ad_number--;
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
  if(ad_number <= 5){
	start_ad(  (ad_number * 123) + "px"  ,"100px");
/*	chrome.extension.sendRequest({action: "display_message", message: "Add number " + ad_number + " has been created.", type: "alert", time: 2000}, function(response){
		noty(response.formated_message);
	});
*/
  } else {
	chrome.extension.sendRequest({action: "display_message", message: "Sorry, you can only place five advertisements on each website.", type: "alert", time: 2000}, function(response){
		noty(response.formated_message);
	});
  }
}



function start_ad(top,left) {
	//we need to return different embed code for each ad, so ad_number will be an integer between 1 and 5
	$('body').append("<div class='a4c_ad a4c_ad_new a4c_idle' style='top: "+top+"; left: "+left+";'><embed src='http://ads4charity.org/ad.php?ad_number="+ad_number+"&charity="+charity_selection+"'><div class='a4c_panel'><span class='a4c_remove'>Remove</span><br><span class='a4c_move'>Move</span></div></div>");
		$(".a4c_ad_new").disableSelection(); //prevents users from highlighting the panel/advertisement
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
		enable_drag();
		enable_remove();
		save_ad_positions();
		ad_number++;
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

function remove_all_ads(){
  $('.a4c_ad').remove();
  save_ad_positions();
  ad_number=1;
}


//keyboard shortcuts
window.addEventListener("keydown", function(event) {
  var modifier = event.ctrlKey || event.metaKey;   // Bind to both command (for Mac) and control (for Win/Linux)
  if (modifier && event.keyCode == 114) { //F3
	create_ad();
  } else if (modifier && event.keyCode == 113) {
	remove_all_ads();
  }
}, false);