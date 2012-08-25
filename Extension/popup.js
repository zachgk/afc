  document.getElementById('create').onclick=function(){ create(); };
  document.getElementById('blacklist').onclick=function(){blacklist(); };
  document.getElementById('revert').onclick=function(){ revert(); reload(); };
  document.getElementById('options').onclick=function(){options(); };




function close_popup() {
	chrome.tabs.getSelected(null, function(tab) {
		chrome.tabs.update(tab.id, { selected: true } )
	});
}
function create(){
  chrome.extension.sendMessage({action: "create"});
  close_popup();  
}

function options(){
  chrome.tabs.create({"url":chrome.extension.getURL("fancy-settings/source/index.html")});
  close_popup();  
}

function revert(){
	chrome.tabs.getSelected(null,function(tab) {
		chrome.tabs.sendMessage(tab.id, {action: "remove_all_ads"});
		chrome.tabs.sendMessage(tab.id, {action:"get_url"}, function(response){
			var url = response.url;
			var db = openDatabase('a4c_db','1.0','adsforcharity database', 5*1024*1024);
			db.transaction( function(tx){
				tx.executeSql('DELETE FROM blacklist WHERE url = "'+ url +'"');
				close_popup();
			});
		});
	});		
}

function blacklist(){
  chrome.tabs.getSelected(null,function(tab) {
    chrome.tabs.sendMessage(tab.id, {action:"get_url"}, function(response){
      chrome.extension.sendMessage({action: "blacklist_current_site", "url": response.url });
      chrome.tabs.sendMessage(tab.id, {action: "remove_all_ads"});
      close_popup();
	});
  });
}

function startup_check(){
	chrome.tabs.getSelected(null,function(tab) {
		chrome.tabs.sendMessage(tab.id, {action:"get_url"}, function(response){		var url = response.url;
		var db = openDatabase('a4c_db','1.0','adsforcharity database', 5*1024*1024);
		db.transaction( function(tx){
			tx.executeSql('SELECT * FROM site_positions WHERE site = "'+ url +'"',[], function(tx, results){
			  is_blacklisted(url,results.rows.length);     
		});
	  });
	});
	});
}

function is_blacklisted(url, number_of_ads){
  var db = openDatabase('a4c_db','1.0','adsforcharity database', 5*1024*1024);
  db.transaction( function(tx){
    tx.executeSql('SELECT * FROM blacklist WHERE url = "'+ url +'"',[], function(tx, results){
	  blacklist_check_exception(url, number_of_ads, results.rows.length);
    });
  });
}

function blacklist_check_exception(url, number_of_ads, blacklisted){
  var db = openDatabase('a4c_db','1.0','adsforcharity database', 5*1024*1024);
  db.transaction( function(tx) {
    tx.executeSql('SELECT * FROM exceptions WHERE url = "'+ url +'"',[], function(tx, results){
	  button_correction(number_of_ads, blacklisted + results.rows.length);
	});
  });
}

function button_correction(number_of_ads, blacklisted){
  var has_custom_ads = (number_of_ads != 0);
  var has_template = (localStorage['store.settings.autoAds'] != '"No Automation"');
  if (has_custom_ads && has_template) {
    document.getElementById("revert").style.display="inline";
    document.getElementById("blacklist").style.display="inline";
    document.getElementById("blacklist").innerHTML = 'Hide Ads';
  }
  if (has_custom_ads && !has_template) {
    document.getElementById("revert").style.display="inline";
    document.getElementById("revert").innerHTML = 'Remove all Ads';      
  }   
  if (blacklisted && !has_custom_ads && has_template) {
    document.getElementById("revert").style.display="inline";
    document.getElementById("revert").innerHTML = 'Show Ads';
  }
  if (!blacklisted && !has_custom_ads && has_template) {
    document.getElementById("blacklist").style.display="inline";
    document.getElementById("blacklist").innerHTML = 'Hide Ads';
  }
}

function reload() {
  chrome.tabs.getSelected(null,function(tab) {
    chrome.tabs.sendMessage(tab.id, {action: "reload"});
  });		
}

document.addEventListener("DOMContentLoaded", startup_check, false);