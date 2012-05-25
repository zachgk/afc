var background_local_storage, current_charity, time_diff, total_per_year=0;

function rewrite_personal_contributions() {
	$('span.a4c_personal_contribution').each(function(index, element){
	  var total_raised = $(element).attr('data-raised').substr(1);
	  var cid = $(element).parent().parent().find('.select-charity').attr('data-cid');
	  var personal_views = background_local_storage['charity-' + cid ];
	  if(typeof personal_views === "undefined") personal_views = 0;
	  var total_charity_views = $(element).attr('data-views')
	  var contribution = total_raised * personal_views / total_charity_views;
	  contribution = Math.round(100*contribution)/100;
	  var contribution_per_year = contribution*365*24*3600*100/time_diff;
	  total_per_year +=contribution_per_year;
	  $(element).html("$" + Math.round(contribution_per_year * 100)/100);
	});
	$(".view-display-id-page_1 ").before("<center><h3>At your current rate, you're raising a total of $" + Math.round(total_per_year) + " per year.</h3></center>");
}

chrome.extension.sendRequest({action: "get_local_storage"}, function(response){
  background_local_storage = response.localStorage;
  	var current_time = new Date();
	time_diff = current_time.getTime() - background_local_storage['startCharityViewsTime'];
    rewrite_personal_contributions();
});

$('.select-charity').click(function(e){
  	chrome.extension.sendRequest({action: "display_message", message: "Your advertisement views are now counting towards " + get_charity_name() + ".", time:2500}, function(response){
		noty(response.formated_message);
	});
  chrome.extension.sendRequest({action: "set_charity", "charity": $(this).attr('data-cid')});
  update_current_charity();
});

function update_current_charity() {
	chrome.extension.sendRequest({action: "get_local_storage"}, function(response){
	    background_local_storage = response.localStorage;
		current_charity = background_local_storage.charity;
	  charity_row_update();
	});
}

function charity_row_update() {
  $(".views-field-nid-1 span").text('Select this Charity').css("opacity", .45);
  $(".view-display-id-page_1").find('.views-field-nid-1 span[data-cid="'+current_charity+'"]').text('Charity Selected').css("opacity", 1);
}

function get_charity_name() {
	return $('.views-field-nid-1 span[data-cid="'+current_charity+'"]').attr("data-name");
}

update_current_charity();