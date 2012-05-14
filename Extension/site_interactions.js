console.log('Interact with the ads4chairty.org site as needed');
$('.select-charity').click(function(e){
  chrome.extension.sendRequest({action: "set_charity", "charity": $(this).attr('data-cid')});
});