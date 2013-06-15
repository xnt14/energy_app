/* Settings */
var apiKey = ''; // read-only API key
var host='example.com:80'; // ip address/hostname:port
/* End of Settings */

function addCell(input_id, label, units, value) {
	var cellContent = '<li id="cell_' + input_id + '"><h3><span class="label">' + label + ':</span> <span class="value"><span id="' + input_id+ '">' + value + '</span>' + units + '</span></h3></li>';
	$('.cells').append(cellContent);
}

function importFeeds() {
	$.ajax({
		'url':'http://' + host + '/emoncms/feed/list.json?apikey=' + apiKey,
		'success': function(feeds, status, xhr) {
			
			var feedList = new Array();
			
			for(var i = 0;i<feeds.length;i++) {
				
				var feedSettings = {
				"id":feeds[i].id,
				"name":feeds[i].name,
				"units":'',
				"dataType":feeds[i].dataType
				};
				
				feedList.push(feedSettings);
												
				// addCell(feeds[i].id,feeds[i].name,'',parseInt(feeds[i].value));
			}
						
			localStorage.feedList = JSON.stringify(feedList);
			
		}
	});
}

function retrieveValues() {
	$.ajax({
		'url':'http://' + host + '/emoncms/feed/list.json?apikey=' + apiKey,
		'success': function(feeds, status, xhr) {
			for(var i = 0;i<feeds.length;i++) {
				
				if ($('#' + feeds[i].id).length == 0) {
					alert('Error: Feed data mismatch. Clear cache and try again.');
					break;
				} else {
					$('#' + feeds[i].id).html(parseInt(feeds[i].value));
				}
			}
		}
	});
}

function setupUpdates() {
	
	var feedList = JSON.parse(localStorage.feedList);
	
	for(var i = 0;i<feedList.length;i++) {
		
		var feed = feedList[i];
		
		addCell(feed.id,feed.name,feed.units,0);
		
	}
	
	retrieveValues();
	setInterval("retrieveValues()", 5000);
	
}

$(document).ready(function() {
	
	if (localStorage.feedList == undefined) {
		importFeeds();
	} else {
		// console.dir(JSON.parse(localStorage.feedList));
		setupUpdates();
	}
		
	
});