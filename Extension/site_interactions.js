var background_local_storage;

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

chrome.extension.sendRequest({action: "get_local_storage"}, function(response){
  background_local_storage = response.localStorage;
  rewrite_personal_contributions();
});

console.log('Interact with the ads4chairty.org site as needed');
$('.select-charity').click(function(e){
  chrome.extension.sendRequest({action: "set_charity", "charity": $(this).attr('data-cid')});
});
