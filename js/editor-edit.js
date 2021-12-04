let updateTimelineSettingCheckBok = function(evt, className){
  if(evt.checked){
    $("."+className).show();
  }else{
    $("."+className).hide();
  }
}

let selectEditTab = function (evt, tabID) {
	tablinks = evt.target.parentNode.getElementsByClassName("panel-title");
	for (i = 0; i < tablinks.length; i++) {
	  tablinks[i].className = "panel-title panel-title-inactive";
	  evt.currentTarget.className 
	}

	tabcontents = document.getElementsByClassName("tabcontent");
	for (i = 0; i < tabcontents.length; i++) {
	  tabcontents[i].style.display = "none";
	}

	evt.currentTarget.className = evt.currentTarget.className.replace(" panel-title-inactive", "");
	document.getElementById(tabID).style.display = "block";
}

var cur_floating_icon = null;

let clickEditElement = function (evt, target_id) {
	if(cur_floating_icon){
	  cur_floating_icon.style.display = "none";
	}
	cur_floating_icon = document.getElementById(target_id);
	cur_floating_icon.style.display = "block";
	cur_floating_icon.style.left = (evt.clientX + 10) + "px";
	cur_floating_icon.style.top = (evt.clientY + 10) + "px";
}

$(document).mousemove(function (e) {
	if(!cur_floating_icon){
	  return
	}
	cur_floating_icon.style.left = (e.clientX + 10) + "px";
	cur_floating_icon.style.top = (e.clientY + 10) + "px";
});

// $("#panel-timeline").mousedown(function (e) {
document.getElementsByClassName("tc-body")[0].addEventListener("mousedown", function(e) {
	if (cur_floating_icon != null) {
		cur_floating_icon.style.display = "none";
		cur_floating_icon = null;
		// Add event in every case
		let event = event_manager.create_event();
		// Calculate event time based on cursor position
		let rect = e.currentTarget.getBoundingClientRect();
		let deltaPx = e.clientX - rect.left;
		let datetime = new Date(timeline.view_start_date.valueOf() + timeline.px_to_ms(deltaPx));
		event.update_start_datetime(datetime);
		// Select placed event
		timeline.selected_event = event.getId();
		show_details(timeline.selected_event);
		// Update timeline
		timeline.update_events();
	}
});