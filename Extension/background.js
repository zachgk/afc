var wk, wk2;

var settings = new Store("settings", {
    "autoAds": 'Bottom Corners',
	"no_charity_selected": true,
	"revert_notification": true
});

function initialization(){
  var db = openDatabase('a4c_db','1.0','adsforcharity database', 5*1024*1024);
  var to_exclude = ["ads4charity.org"];
  db.transaction( function(tx){
    tx.executeSql('CREATE TABLE IF NOT EXISTS site_positions(site, top, left, right, bottom)');
	tx.executeSql('CREATE TABLE IF NOT EXISTS exceptions(url)');
	tx.executeSql('CREATE TABLE IF NOT EXISTS blacklist(url)');
	for(var i=0; i<to_exclude.length; i++){
	  tx.executeSql('INSERT INTO exceptions(url) VALUES("'+ to_exclude[i] +'") ');
	}
  });
  var current_time = new Date();
  localStorage['startCharityViewsTime'] = current_time.getTime();
}

function get_setting(setting) {
	return settings.get(setting);
}

function request_create(){
    chrome.tabs.getSelected(null, function(tab) {
      chrome.tabs.sendMessage(tab.id, {action: "create"});
    });
	chrome.tabs.getSelected(null,function(tab) {
		chrome.tabs.sendMessage(tab.id, {action:"get_url"}, function(response){
			var url = response.url;
			var db = openDatabase('a4c_db','1.0','adsforcharity database', 5*1024*1024);
			db.transaction( function(tx){
				tx.executeSql('DELETE FROM blacklist WHERE url = "'+ url +'"');
			});
		});
	});
}

function save_ad_positions(data) {
  var db = openDatabase('a4c_db','1.0','adsforcharity database', 5*1024*1024);
  db.transaction( function(tx){
    tx.executeSql('DELETE FROM site_positions WHERE site = "' + data.url + '"');
    for(i=0; i<data.positions.length && i<5;i++){
      tx.executeSql('INSERT INTO site_positions(site, top, left, right, bottom) VALUES ("' + data.url + '", "'+ data.positions[i].top +'", "'+ data.positions[i].left+'", "'+ data.positions[i].right+'", "'+ data.positions[i].bottom + '")');
    }
  });
}

function remove_all_ads() {
  var db = openDatabase('a4c_db','1.0','adsforcharity database', 5*1024*1024);
  db.transaction( function(tx) {
    tx.executeSql('DELETE FROM site_positions');
  });
}

function is_blacklisted(url){
  var db = openDatabase('a4c_db','1.0','adsforcharity database', 5*1024*1024);
  db.transaction( function(tx){
    tx.executeSql('SELECT * FROM blacklist WHERE url = "'+ url +'"',[], function(tx, results){
	  if(results.rows.length == 0) blacklist_check_exception(url);
	  else no_setup_message();
    });
  });
}

function blacklist_check_exception(url){
  var db = openDatabase('a4c_db','1.0','adsforcharity database', 5*1024*1024);
  db.transaction( function(tx) {
    tx.executeSql('SELECT * FROM exceptions WHERE url = "'+ url +'"',[], function(tx, results){
	  if(results.rows.length == 0) startup_ads(wk);
	  else no_setup_message();
	});
  });
}

function no_setup_message(){
	chrome.tabs.getSelected(null, function(tab) {
		chrome.tabs.sendMessage(tab.id, {action: "no_startup"});
	});
}

function startup_info(url) {
  var db = openDatabase('a4c_db','1.0','adsforcharity database', 5*1024*1024);
  db.transaction( function(tx){
    tx.executeSql('SELECT * FROM site_positions WHERE site = "'+ url +'"',[], function(tx, results){
      wk = new Array();
      for(i=0; i< results.rows.length; i++){
        wk2 = {top: results.rows.item(i).top, left: results.rows.item(i).left, right: results.rows.item(i).right, bottom: results.rows.item(i).bottom}; 
        wk.push ( wk2 );        
      }
      is_blacklisted(url)     
    });
  });
}

function startup_ads(positions){
	chrome.tabs.getSelected(null, function(tab) {
		chrome.tabs.sendMessage(tab.id, {action: "startup_ads", "positions": positions});
	});
	if (!localStorage.charity) { //No charity selected
		if (!localStorage.noCharityViews) {
			localStorage.noCharityViews = 1;
		} else {
			localStorage.noCharityViews++;
		}
	}
}

function increase_charity_views(amount){ //handles local and server
  $.get("http://ads4charity.org/ad.php",{"charity":localStorage.charity,"number":amount});
  if(localStorage['charity-' + localStorage.charity ]){
    localStorage['charity-' + localStorage.charity ]= Number(localStorage['charity-' + localStorage.charity ]) + amount;
  } else {
    localStorage['charity-' + localStorage.charity ] = amount;
  }
}

function blacklist_current_site(url){
  var db = openDatabase('a4c_db','1.0','adsforcharity database', 5*1024*1024);
  db.transaction( function(tx){
    tx.executeSql('INSERT INTO blacklist(url) VALUES("'+ url +'") ');
  });
}

    //Message passing functions

chrome.extension.onMessage.addListener( function(request, sender, sendResponse){
  if(request.action == "create"){ //request from popup
    request_create();
    sendResponse({});
  } else if(request.action == "save_ad_positions"){
    save_ad_positions(request);
    sendResponse({});
  } else if(request.action == "blacklist_current_site"){
    blacklist_current_site(request.url);
    sendResponse({});
  } else if(request.action == "request_startup_info"){
    startup_info(request.url);
    sendResponse({});
  } else if(request.action == "get_local_storage"){
    sendResponse({"localStorage":localStorage});
  } else if(request.action == "display_message"){
    sendResponse({"formated_message":noty_message(request.message, request.type, request.time)});
  } else if(request.action == "remove_all_ads"){
    remove_all_ads();
	sendResponse({});
  } else if(request.action == "increase_charity_views"){
    increase_charity_views(request.amount);
	sendResponse({});
  } else if(request.action == "set_charity"){
    localStorage.charity = request.charity;
	localStorage.charityName = request.name;
    sendResponse({});
  } else{}
});

function noty_message(message, type, time) { //Helper function for creating Noty settings
	//Default message parameters
	time = typeof time !== 'undefined' ? time : 1600; //time to autoclose the message
	type = typeof type !== 'undefined' ? type : "success"; //"success" is the default message type
	
	return {"text":message,"layout":"topRight","type":type,"animateOpen":{"height":"toggle"},"animateClose":{"height":"toggle"},"speed":500,"timeout":time,"closeButton":true,"closeOnSelfClick":true,"closeOnSelfOver":false,"modal":false};  //return the formatted options
}

if(!localStorage['startCharityViewsTime']){
  initialization();
}
