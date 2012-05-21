var wk ,wk2, charity_selection, mouseX;
var ad_number=1;

function enable_drag(){
  $('.a4c_ad').draggable({
    "containment":"body",
	"handle":".a4c_move",
	"stop":function(event, ui){
	  $(this).addClass('a4c_idle');
	  disable_guides();
	  if ($(this).css("left").substring(0, $(this).css("left").length - 2) > $(window).width() / 2) {
		$(this).css("right", $(window).width() - $(this).css("left").substring(0, $(this).css("left").length - 2) - 62.5).css("left", "auto");
	  }
	  save_ad_positions();
	},
	"start":function(event,ui){
      enable_guides();
	  $(this).removeClass('a4c_idle');
	},
	"drag":function(event, ui) {
	  update_guides();
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
	wk2 ={"top": $(this).css('top') ,"left": $(this).css('left'), "right": $(this).css('right')};
    wk.push( wk2 );
  });
  chrome.extension.sendRequest({action: "save_ad_positions", "positions": wk, "url": window.location.host});
}

function create_ad() {
  if(ad_number <= 5){
	start_ad(  (ad_number * 130) + "px"  ,"100px", "auto");
/*	
	//Debug code for message numbers and an example of using our noty helper functions for displaying messages
	chrome.extension.sendRequest({action: "display_message", message: "Add number " + ad_number + " has been created.", type: "alert", time: 2000}, function(response){
		noty(response.formated_message);
	});
*/
  } else {
	chrome.extension.sendRequest({action: "display_message", message: "Sorry, you can only place five advertisements on each website.", type: "alert", time: 2000}, function(response){
		noty(response.formated_message);
	});
  }
}



function start_ad(top,left, right) {
	//we need to return different embed code for each ad, so ad_number will be an integer between 1 and 5
	$('body').append("<div class='a4c_ad a4c_ad_new a4c_idle' style='top: "+top+"; left: "+left+"; right: " + right + "'><embed src='http://ads4charity.org/ad.php?ad_number="+ad_number+"&charity="+charity_selection+"'><div class='a4c_panel'><span class='a4c_remove'>Remove</span><br><span class='a4c_move'>Move</span></div></div>");
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

function enable_guides() {
	update_guides();
	$("#a4c_guide_box").show();
}

function disable_guides() {
	$("#a4c_guide_box").hide();
}

function update_guides() {
	$(".a4c_left_guide").css({
		'height' : $(window).height(),
		'width' : $(window).width() / 2,
	});
	$(".a4c_right_guide").css({
		'height' : $(window).height(),
		'width' : $(window).width() / 2,
	});
	if (mouseX > ($(window).width() / 2)) {
		$(".a4c_right_guide").addClass("a4c_enabled_guide");
		$(".a4c_left_guide").removeClass("a4c_enabled_guide");
	} else {
		$(".a4c_right_guide").removeClass("a4c_enabled_guide");
		$(".a4c_left_guide").addClass("a4c_enabled_guide");
	}
}



$(document).mousemove(function(e){
	mouseX = e.pageX;
	 // $('#status').html(e.pageX +', '+ e.pageY);
}); 

$(window).resize(function() {
	update_guides();
});
function startup(){
	chrome.extension.sendRequest({action: "request_startup_info", "url": window.location.host});     
	$("body").append('<div id="a4c_guide_box"><div class="a4c_left_guide a4c_drag_guide"></div><div class="a4c_right_guide a4c_drag_guide"></div></div>');
	$(".a4c_drag_guide").css({
		'position' : 'absolute',
		'top' : '0px',
	});
} 

function startup_ads(data){
  for(i=0; i<data.positions.length; i++){
    start_ad(data.positions[i].top,data.positions[i].left, data.positions[i].right);
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