console.log('Interact with the ads4chairty.org site as needed');

var background_local_storage, current_charity;

function rewrite_personal_contributions(){
	$('span.a4c_personal_contribution').each(function(index, element){
	  var total_raised = $(element).attr('data-raised').substr(1);
	  var cid = $(element).parent().parent().find('.select-charity').attr('data-cid');
	  var personal_views = background_local_storage['charity-' + cid ];
	  if(typeof personal_views === "undefined") personal_views = 0;
	  var total_charity_views = $(element).attr('data-views')
	  var contribution = total_raised * personal_views / total_charity_views;
	  contribution = Math.round(100*contribution)/100;
	  $(element).html('$' + contribution);
	});
}

function update_current_charity() {
	chrome.extension.sendRequest({action: "get_charity"}, function(response){
	  current_charity = response.charity;
	  charity_row_update();
	});
}
chrome.extension.sendRequest({action: "get_local_storage"}, function(response){
  background_local_storage = response.localStorage;
  rewrite_personal_contributions();
});


$('.select-charity').click(function(e){
  	chrome.extension.sendRequest({action: "display_message", message: "Your advertisement views are now counting towards " + get_charity_name() + ".", time:2500}, function(response){
		noty(response.formated_message);
	});
  chrome.extension.sendRequest({action: "set_charity", "charity": $(this).attr('data-cid')});
  update_current_charity();
});

function charity_row_update() {
  $(".views-field-nid-1 span").text('Select this Charity').css("opacity", .45).parent().parent().css("background", "#f3f3f3");
  $(".view-display-id-page_1").find('.views-field-nid-1 span[data-cid="'+current_charity+'"]').text('Charity Selected').css("opacity", 1).parent().parent();
  //css("background", "green");
}

function get_charity_name() {
	return $('.views-field-nid-1 span[data-cid="'+current_charity+'"]').attr("data-name");
}

update_current_charity();
