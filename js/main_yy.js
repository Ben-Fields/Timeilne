let roundValue = function(evt){
  evt.value = Math.max(1, Math.round(evt.value));
}


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

$("#panel-timeline").mousedown(function (e) {
	if (cur_floating_icon != null) {
		cur_floating_icon.style.display = "none";
		cur_floating_icon = null;
		// add event in every case
		// on drop event element, time equals (in ms):
		let event = event_manager.create_event();
		event.title = "...";
		event.start_datetime = new Date(
			view_start_date.valueOf() + (
				(e.clientX - tick_container.clientLeft - tick_container.offsetLeft) * MS_IN_Y / year_px
			)
		);
		update_events();
	}
});