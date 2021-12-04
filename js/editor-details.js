/*######  Delete Event Button  ######*/
delete_btn.addEventListener("click", function() {
	// Delete from data
	event_manager.delete_event_by_id(timeline.selected_event);
	// Deselect
	details_placeholder.style.display = "flex";
	details_data.style.display = "none";
	delete_btn.style.display = "none";
	// Update view
	timeline.update_events();
});


/*######  Select Event, Update Details  ######*/
var show_details = function(eid) {
	// Show the details panel in full
	details_placeholder.style.display = "none";
	details_data.style.display = "block";
	delete_btn.style.display = "block";
	// Get event reference
	let event = event_manager.get_event_by_id(eid);
	// Initially populate details
	field_short_title.value = event.title || "";
	field_long_title.value = event["Long Title"] || "";
	if (event.flag_start_date_init) {
		field_date.valueAsDate = event.start_datetime || new Date((minDate.valueOf()+maxDate.valueOf())/2);
	} else {
		field_date.valueAsDate = null;
	}
	if (event.flag_start_time_init) {
		field_time.valueAsDate = event.start_datetime || new Date((minDate.valueOf()+maxDate.valueOf())/2);
	} else {
		field_time.valueAsDate = null;
	}
	if (event.flag_end_date_init) {
		field_end_date.valueAsDate = event.end_datetime || new Date((minDate.valueOf()+maxDate.valueOf())/2);
	} else {
		field_end_date.valueAsDate = null;
	}
	if (event.flag_end_time_init) {
		field_end_time.valueAsDate = event.end_datetime || new Date((minDate.valueOf()+maxDate.valueOf())/2);
	} else {
		field_end_time.valueAsDate = null;
	}
	field_description.value = event["Description"] || "";
	// richtext_content.innerHTML = event["Description"];
	field_visual_priority.value = event["Visual Priority"] || "";
	field_groups.value = event.get_group_name_list();
	// field_visible_group.value = event.get_visible_group().get_name();
	field_click_action.value = event["Click Action"] || "";
	field_anchor_tag.value = event["Anchor Tag"] || "";

	// Update event on any value change
	field_short_title.onchange = function(){
		event.title = field_short_title.value;
		timeline.update_events();
	}
	field_long_title.onchange = function(){
		event["Long Title"] = field_long_title.value
		timeline.update_events();
	}
	field_date.onchange = function(){
		if (field_date.valueAsDate == null) {
			event.flag_start_date_init = false;
		} else {
			event.flag_start_date_init = true;
			let newDate = new Date(field_date.valueAsDate.valueOf());
			if (field_time.valueAsDate != null) {
				newDate.setHours(field_time.valueAsDate.getHours());
				newDate.setMinutes(field_time.valueAsDate.getMinutes());
				newDate.setSeconds(field_time.valueAsDate.getSeconds());
				newDate.setMilliseconds(field_time.valueAsDate.getMilliseconds());
			}
			event.start_datetime = newDate;
		}
		timeline.update_events();
	}
	field_time.onchange = function(){
		if (field_time.valueAsDate == null) {
			event.flag_start_time_init = false;
		} else {
			event.flag_start_time_init = true;
			let newDate;
			if (field_date.valueAsDate == null) {
				newDate = new Date(); // Date not set, does not matter
			} else {
				newDate = new Date(field_date.valueAsDate.valueOf());
			}
			newDate.setHours(field_time.valueAsDate.getHours());
			newDate.setMinutes(field_time.valueAsDate.getMinutes());
			newDate.setSeconds(field_time.valueAsDate.getSeconds());
			newDate.setMilliseconds(field_time.valueAsDate.getMilliseconds());
			event.start_datetime = newDate;
		}
		timeline.update_events();
	}
	field_end_date.onchange = function(){
		if (field_end_date.valueAsDate == null) {
			event.flag_end_date_init = false;
		} else {
			event.flag_end_date_init = true;
			let newDate = new Date(field_end_date.valueAsDate.valueOf());
			if (field_end_time.valueAsDate != null) {
				newDate.setHours(field_end_time.valueAsDate.getHours());
				newDate.setMinutes(field_end_time.valueAsDate.getMinutes());
				newDate.setSeconds(field_end_time.valueAsDate.getSeconds());
				newDate.setMilliseconds(field_end_time.valueAsDate.getMilliseconds());
			}
			event.end_datetime = newDate;
		}
		timeline.update_events();
	}
	field_end_time.onchange = function(){
		if (field_end_time.valueAsDate == null) {
			event.flag_end_time_init = false;
		} else {
			event.flag_end_time_init = true;
			let newDate;
			if (field_end_date.valueAsDate == null) {
				newDate = new Date(); // Date not set, does not matter
			} else {
				newDate = new Date(field_end_date.valueAsDate.valueOf());
			}
			newDate.setHours(field_end_time.valueAsDate.getHours());
			newDate.setMinutes(field_end_time.valueAsDate.getMinutes());
			newDate.setSeconds(field_end_time.valueAsDate.getSeconds());
			newDate.setMilliseconds(field_end_time.valueAsDate.getMilliseconds());
			event.end_datetime = newDate;
		}
		timeline.update_events();
	}
	field_description.onchange = function(){
		event["Description"] = field_description.value;
		// event["Description"] = richtext_content.innerHTML;
		timeline.update_events();
	}
	field_visual_priority.onchange = function(){
		event["Visual Priority"] = field_visual_priority.value;
		timeline.update_events();
	}
	field_groups.onchange = function(){
		// Temporary: single group
		event.add_into_group(group_manager.get_group_by_name(field_groups.value));
		timeline.update_events();
	}
	field_visible_group.onchange = function(){
		event.set_visible_group_by_name(field_visible_group.value);
		timeline.update_events();
	}
	field_click_action.onchange = function(){
		event["Click Action"] = field_click_action.value;
		timeline.update_events();
	}
	field_anchor_tag.onchange = function(){
		event["Anchor Tag"] = field_anchor_tag.value;
		timeline.update_events();
	}
}
