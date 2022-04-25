/*######  Editor Parameters  ######*/
// Enable editor features
var EDITOR = true;
// Constants (global, not timeline-specific)
var MIN_ZOOM = 0.0001;
var MAX_ZOOM = 10_000_000_000_000;


/*######  Timeline Parameters  ######*/
// Options object to store settings
var options = Object.assign({}, CRTimeline.DEFAULT_OPTIONS);




/*###### Timeline References  ######*/
var panel_timeline         = document.getElementById("panel-timeline");
var timeline_element       = document.getElementsByClassName("tc-timeline")[0];
var timeline_body          = document.getElementsByClassName("tc-body")[0];
var timeline_upper         = document.getElementsByClassName("tc-upper")[1];
var timeline_lower         = document.getElementsByClassName("tc-lower")[1];
var timeline_line          = document.getElementsByClassName("tc-line")[0];


/*######  Group Panel References  ######*/
// Input fields
var field_group_name       = document.getElementById("field-group-name");
var field_group_color      = document.getElementById("field-group-color");


/*######  Details Panel References  ######*/
// Subpanels
var details_placeholder    = document.getElementById("details-placeholder");
var details_data           = document.getElementById("details-data");
// Input fields
var field_short_title      = document.getElementById("field-short-title");
var field_long_title       = document.getElementById("field-long-title");
var field_date             = document.getElementById("field-date");
var field_time             = document.getElementById("field-time");
var field_end_date         = document.getElementById("field-end-date");
var field_end_time         = document.getElementById("field-end-time");
var field_description      = document.getElementById("field-description");
var field_visual_priority  = document.getElementById("field-visual-priority");
var field_groups           = document.getElementById("field-groups");
var field_anchor_tag       = document.getElementById("field-anchor-tag");
// Rich Text 
let richtext_cover         = document.getElementById("richtext-cover");
let richtext_editor        = document.getElementById("richtext-editor");
let richtext_done          = document.getElementById("richtext-done");
let richtext_content       = null;
// Buttons 
var delete_btn             = document.getElementById("details-delete");


/*######  Settings Tab References  ######*/
// Input fields
var field_min_date         = document.getElementById("field-min-date");
var field_min_time         = document.getElementById("field-min-time");
var field_max_date         = document.getElementById("field-max-date");
var field_max_time         = document.getElementById("field-max-time");
var field_init_date        = document.getElementById("field-init-date");
var field_init_time        = document.getElementById("field-init-time");
var field_min_zoom         = document.getElementById("field-min-zoom");
var field_max_zoom         = document.getElementById("field-max-zoom");
var field_init_zoom        = document.getElementById("field-init-zoom");
var field_tick_density     = document.getElementById("field-tick-density");
var field_minor_ticks      = document.getElementById("field-minor-ticks");
var field_line_color       = document.getElementById("field-line-color");
var field_line_thickness   = document.getElementById("field-line-thickness");


/*######  Add Element Tab References  ######*/
// Floating icons
var mouse_float_event       = document.getElementById("mouse-float-event");
var mouse_float_event_line  = mouse_float_event.getElementsByClassName("tc-event-line")[0];
var mouse_float_event_label = mouse_float_event.getElementsByClassName("tc-event-label")[0];

/*######  Date Manipulation  ######*/
var setDatePart = function(dateobj, date) {
	dateobj.setUTCFullYear(date.getFullYear());
	dateobj.setUTCDate(date.getDate());
	dateobj.setUTCMonth(date.getMonth());
}
var setTimePart = function(dateobj, time) {
	dateobj.setUTCHours(date.getHours());
	dateobj.setUTCMinutes(date.getMinutes());
	dateobj.setUTCSeconds(date.getSeconds());
	dateobj.setUTCMilliseconds(date.getMilliseconds());
}

/*######  Resize functionality  ######*/
let resize_bars_x = document.getElementsByClassName("resize-x");
let resize_bars_y = document.getElementsByClassName("resize-y");
let cursor_elem = document.getElementById("cursor-cover");

var active_resize_bar = null; // resize bar element
let bar_initial_pos = null;   // client position
let initial_basis = null;     // flex-basis value
let max_basis = null;

let mouse_move_evt = null;
let mouse_up_evt = null;

let resize_x_start = function(bar_side, e) {
	// Initial click determines the element for the rest of the interaction
	active_resize_bar = e.target;
	// Bar intial pos
	let bar_rect = active_resize_bar.getBoundingClientRect();
	bar_initial_pos = Math.trunc(bar_rect.x + bar_rect.width/2);
	// Initial basis (target size)
	initial_basis = parseInt(getComputedStyle(active_resize_bar.parentNode).flexBasis);
	// Max size (half of screen dimension)
	max_basis = Math.trunc(window.innerWidth/2);
	// The remaining events are not localized
	mouse_move_evt = resize_x_change.bind(null, bar_side);
	mouse_up_evt = resize_end.bind(null, bar_side);
	window.addEventListener("mousemove", mouse_move_evt);
	window.addEventListener("mouseup", mouse_up_evt);
	// Style - Cursor cover
	cursor_elem.style.cursor = "ew-resize";
	cursor_elem.style.display = "block";
	// Style - Highlight
	active_resize_bar.classList.add("resize-drag");
}

let resize_x_change = function(bar_side, e) {
	active_resize_bar.parentNode.style.flexBasis = Math.min(
		Math.max(
			initial_basis + (e.clientX - bar_initial_pos) * bar_side, 
			// The min. is minus 1, since DPI scaling may leave a gap
			active_resize_bar.offsetWidth - 1
		),
		max_basis
	) + "px";
}

let resize_y_start = function(bar_side, e) {
	// Initial click determines the element for the rest of the interaction
	active_resize_bar = e.target;
	// Bar intial pos
	let bar_rect = active_resize_bar.getBoundingClientRect();
	bar_initial_pos = Math.trunc(bar_rect.y + bar_rect.height/2);
	// Initial basis (target size)
	initial_basis = parseInt(getComputedStyle(active_resize_bar.parentNode).flexBasis);
	// Max size (half of screen dimension)
	max_basis = Math.trunc(window.innerHeight/2);
	// The remaining events are not localized
	mouse_move_evt = resize_y_change.bind(null, bar_side);
	mouse_up_evt = resize_end.bind(null, bar_side);
	window.addEventListener("mousemove", mouse_move_evt);
	window.addEventListener("mouseup", mouse_up_evt);
	// Style - Cursor cover
	cursor_elem.style.cursor = "ns-resize";
	cursor_elem.style.display = "block";
	// Style - Highlight
	active_resize_bar.classList.add("resize-drag");
}

let resize_y_change = function(bar_side, e) {
	active_resize_bar.parentNode.style.flexBasis = Math.min(
		Math.max(
			initial_basis + (e.clientY - bar_initial_pos) * bar_side, 
			// The min. is minus 1, since DPI scaling may leave a gap
			active_resize_bar.offsetHeight - 1
		),
		max_basis
	) + "px";
}

let resize_end = function(bar_side, e) {
	// Style - Cursor cover
	cursor_elem.style.display = "none";
	// Style - Highlight
	active_resize_bar.classList.remove("resize-drag");
	// Remove the global events, reset state
	window.removeEventListener("mousemove", mouse_move_evt);
	active_resize_bar = null;
	window.removeEventListener("mouseup", mouse_up_evt);
}

for (const elem of resize_bars_x) {
	// Determine resize direction
	let bar_side = null;
	if (elem.offsetLeft > 
		elem.parentNode.offsetWidth - elem.offsetLeft - elem.offsetWidth) {
		// On the right side
		bar_side = 1;
	} else {
		bar_side = -1;
	}
	// Enable interaction
	elem.addEventListener("mousedown", resize_x_start.bind(null, bar_side));
}

for (const elem of resize_bars_y) {
	// Determine resize direction
	let bar_side = null;
	if (elem.offsetTop > 
		elem.parentNode.offsetHeight - elem.offsetTop - elem.offsetHeight) {
		// On the bottom side
		bar_side = 1;
	} else {
		bar_side = -1;
	}
	// Enable interaction
	elem.addEventListener("mousedown", resize_y_start.bind(null, bar_side));
}


function export_timeline()
{
	// console.log(event_manager);
	//console.log(group_manager.groups);

	/*group_manager.groups.forEach(o=>{

		add_group(o.get_name())
	});*/

	delimiter = ",";
	fileName = "File1";
	arrayHeader = ["Event Title", "Long Title", "Start Date", "Start Time", "End Date", "End Time", "Description", "Visual Priority", "Groups", "Visible Groups", "Click Action","Anchor Tag", "Image"];
	arrayData = event_manager.ordered_events;
	// console.log(arrayData);
	let header = arrayHeader.join(delimiter) + '\n';
    let csv = header;
    arrayData.forEach( obj => {
        let row = [];
		let start_date;
		if(obj.flag_start_date_init){
			start_date = (obj["start_datetime"].getMonth() + 1).toString() + "/" + obj["start_datetime"].getDate() + "/" + obj["start_datetime"].getFullYear();	
		}

		let start_time;
		if(obj.flag_start_time_init){
			start_time = obj["start_datetime"].getHours() + ":" + obj["start_datetime"].getMinutes() + ":" + obj["start_datetime"].getSeconds();
		}

		let end_date;
		if(obj.flag_end_date_init){
			end_date = (obj["end_datetime"].getMonth() + 1).toString() + "/" + obj["end_datetime"].getDate() + "/" + obj["end_datetime"].getFullYear();
		}

		let end_time;
		if(obj.flag_end_time_init){
			end_time = obj["end_datetime"].getHours() + ":" + obj["end_datetime"].getMinutes() + ":" + obj["end_datetime"].getSeconds();
		}

		let groups = obj.get_group_name_list().filter(e=> e!=DEFAULT_GROUP_NAME).join(';');
		let visible_group = obj.get_visible_group().get_name();
		if(visible_group == DEFAULT_GROUP_NAME){
			visible_group = "";
		}

        row.push(obj["title"]);
        row.push(obj["Long Title"]);
        row.push(start_date);
        row.push(start_time);
        row.push(end_date);
        row.push(end_time);
        row.push(obj["Description"]);
        row.push(obj["Visual Priority"]);
        row.push(groups);
        row.push(visible_group);
        row.push(obj["Click Action"]);
        row.push(obj["Anchor Tag"]);
        row.push(obj["Image"]);

        csv += row.join(delimiter)+"\n";
    });

    let csvData = new Blob([csv], { type: 'text/csv' });  
    let csvUrl = URL.createObjectURL(csvData);

    let hiddenElement = document.createElement('a');
    hiddenElement.href = csvUrl;
    hiddenElement.target = '_blank';
    hiddenElement.download = fileName + '.csv';
    hiddenElement.click();
}

function exportFormat()
{
	delimiter = ",";
	fileName = "Sample Timeline";
	arrayHeader = ["Event Title", "Long Title", "Start Date", "Start Time", "End Date", "End Time", "Description", "Visual Priority", "Groups", "Visible Groups", "Click Action","Anchor Tag", "Image"];

	let header = arrayHeader.join(delimiter) + '\n';
	let csv = header;
	let csvData = new Blob([csv], { type: 'text/csv' });  
    let csvUrl = URL.createObjectURL(csvData);

    let hiddenElement = document.createElement('a');
    hiddenElement.href = csvUrl;
    hiddenElement.target = '_blank';
    hiddenElement.download = fileName + '.csv';
    hiddenElement.click();

}


// Temporarily disabled during development
// function leavePage() {
//   return "Are you sure you want to leave? Your changes are not saved yet.";
// }
// window.addEventListener('beforeunload', (event) => {
// 	event.preventDefault();
//   	event.returnValue = `Are you sure you want to leave?`;
// });

/*######  Tab Switching  ######*/

let selectEditTab = function (evt, tabID) {
	// e.currentTarget always gives the intended target element (on which the listener is attached).
	// e.target gives the exact child element that is clicked.
	tablinks = evt.currentTarget.parentNode.getElementsByClassName("panel-title");
	for (i = 0; i < tablinks.length; i++) {
	  tablinks[i].className = "panel-title panel-title-inactive";
	  evt.currentTarget.className;
	}

	tabcontents = document.getElementsByClassName("tabcontent");
	for (i = 0; i < tabcontents.length; i++) {
	  tabcontents[i].style.display = "none";
	}

	evt.currentTarget.className = evt.currentTarget.className.replace(" panel-title-inactive", "");
	document.getElementById(tabID).style.display = "block";
}

/*######  Timeline Settings  ######*/

// Initial
field_min_date.valueAsDate  = new Date(options.min_date.valueOf());
field_min_time.valueAsDate  = new Date(options.min_date.valueOf());
field_max_date.valueAsDate  = new Date(options.max_date.valueOf());
field_max_time.valueAsDate  = new Date(options.max_date.valueOf());
field_init_date.valueAsDate = new Date(options.initial_date.valueOf());
field_init_time.valueAsDate = new Date(options.initial_date.valueOf());
field_min_zoom.value        = options.min_zoom;
field_max_zoom.value        = options.max_zoom;
field_init_zoom.value       = options.initial_zoom;
field_tick_density.value    = options.tick_density;
field_minor_ticks.value     = options.minor_tick_density;
field_line_color.value      = options.line_color;
field_line_thickness.value  = options.line_thickness;

// Update
field_min_date.addEventListener("change", function() {
	setDatePart(options.min_date, field_min_date.valueAsDate);
	setDatePart(timeline.minDate, field_min_date.valueAsDate);
	// TODO: update view
});
field_min_time.addEventListener("change", function() {
	setTimePart(options.min_date, field_min_time.valueAsDate);
	setTimePart(timeline.minDate, field_min_time.valueAsDate);
	// TODO: update view
});
field_max_date.addEventListener("change", function() {
	setDatePart(options.max_date, field_max_date.valueAsDate);
	setDatePart(timeline.maxDate, field_max_date.valueAsDate);
	// TODO: update view
});
field_max_time.addEventListener("change", function() {
	setTimePart(options.max_date, field_max_time.valueAsDate);
	setTimePart(timeline.maxDate, field_max_time.valueAsDate);
	// TODO: update view
});
field_init_date.addEventListener("change", function() {
	setDatePart(options.initial_date, field_init_date.valueAsDate);
	// TODO: update view?
});
field_init_time.addEventListener("change", function() {
	setTimePart(options.initial_date, field_init_time.valueAsDate);
	// TODO: update view?
});
field_min_zoom.addEventListener("change", function() {
	options.min_zoom = field_min_zoom.value;
	timeline.year_px_min = field_min_zoom.value;
	// TODO: update view
});
field_max_zoom.addEventListener("change", function() {
	options.max_zoom = field_max_zoom.value;
	timeline.year_px_max = field_max_zoom.value;
	// TODO: update view
});
field_init_zoom.addEventListener("change", function() {
	options.initial_zoom = field_init_zoom.value;
	// TODO: update view?
});
field_tick_density.addEventListener("change", function() {
	options.tick_density = field_tick_density.value;
	timeline.ticks_per_kpx = field_tick_density.value;
	timeline.update_ticks();
});
field_minor_ticks.addEventListener("change", function() {
	// TODO
});
field_line_color.addEventListener("change", function() {
	options.line_color = field_line_color.value;
	timeline.set_line_color(field_line_color.value);
	
});
field_line_thickness.addEventListener("change", function() {
	options.line_thickness = field_line_thickness.value;
	timeline.set_line_thickness(field_line_thickness.value);
});

/*######  References  ######*/

var addElement_floating_icon = null;

var addElement_move_fn = null;
var addElement_leave_fn = null;
var addElement_place_fn = null;


/*######  Element-specific  ######*/

var addElementEventPlace = function(e) {
	// Add event
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

var addElementEventMove =  function(e) {
	// Snap event to timeline
	let rect = timeline_line.getBoundingClientRect();
	let rect2 = mouse_float_event_label.getBoundingClientRect();
	// Upper
	if (e.clientY < rect.top) {
		mouse_float_event_line.style.height = rect.top - rect.height + 1 - e.clientY - Math.floor(rect2.height/2) + "px";
	} else { // Lower
		let amt = e.clientY - rect.top - rect.height;
		mouse_float_event_line.style.height = amt + "px";
		// Manual positioning
		addElement_floating_icon.style.top = e.clientY - amt + "px";
		addElement_floating_icon.style.left = e.clientX + "px";
		e.stopPropagation();
	}
}

var addElementEventLeave = function(e) {
	// Seet event back to standard height when not over timeline
	mouse_float_event_line.style.height = "";
}

var addElementEventClick = function(e) {
	addElement_floating_icon = mouse_float_event;
	addElement_move_fn = addElementEventMove;
	addElement_leave_fn = addElementEventLeave;
	addElement_place_fn = addElementEventPlace;
	// Set event back to standard height when not over timeline
	mouse_float_event_line.style.height = "";
	addElementStart(e);
}


/*######  Click and Drop Functionality  ######*/

var addElementMove =  function(e) {
	addElement_floating_icon.style.left = e.clientX + "px";
	addElement_floating_icon.style.top = e.clientY + "px";
}

var addElementEnterUpper = function(e) {
	// Apply upper styling (absence of lower styling)
	addElement_floating_icon.classList.remove("tc-lower");
}

var addElementEnterLower = function(e) {
	// Apply lower styling
	addElement_floating_icon.classList.add("tc-lower");
}

var addElementDown = function(e) {
	// Remove listeners
	document.removeEventListener("mousemove", addElementMove);
	timeline_body.removeEventListener("mousemove", addElement_move_fn);
	timeline_body.removeEventListener("mouseleave", addElement_leave_fn);
	timeline_upper.removeEventListener("mouseenter", addElementEnterUpper);
	timeline_lower.removeEventListener("mouseenter", addElementEnterLower);
	timeline_body.removeEventListener("mousedown", addElementDown);
	// Remove mouse float element
	addElement_floating_icon.style.display = "none";
	addElement_floating_icon = null;
	// Re-enable other interactions
	document.body.style.pointerEvents = "";
	panel_timeline.style.pointerEvents = "";
	// Change cursor back
	document.documentElement.style.cursor = "";
	timeline_element.style.cursor = "";
	// Perform element-specific action
	addElement_place_fn(e);
}

let addElementStart = function (e) {
	// Make icon visible
	addElement_floating_icon.style.display = "";
	// Set initial position
	addElementMove(e);
	// Disable other interaction while elemnent on cursor
	document.body.style.pointerEvents = "none";
	panel_timeline.style.pointerEvents = "auto";
	// Change cursor
	document.documentElement.style.cursor = "grabbing";
	timeline_element.style.cursor = "unset";
	// Update position with cursor
	document.addEventListener("mousemove", addElementMove);
	// Update element-specific behavior when moved over timeline
	timeline_body.addEventListener("mousemove", addElement_move_fn);
	// Update element-specific behavior when leaving timeline
	timeline_body.addEventListener("mouseleave", addElement_leave_fn);
	// Update styling depending if within upper or lower timeline half
	timeline_upper.addEventListener("mouseenter", addElementEnterUpper);
	timeline_lower.addEventListener("mouseenter", addElementEnterLower);
	// Wait for placement to add element
	timeline_body.addEventListener("mousedown", addElementDown);
}

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
	field_anchor_tag.onchange = function(){
		event["Anchor Tag"] = field_anchor_tag.value;
		timeline.update_events();
	}
}

// var text = document.querySelector("#group-section > ul > li.active > a").innerHTML;
// if (text != "All")
// {
// 	g = group_manager.get_group_by_name(text);
// 	console.log(g.getColor());
// 	document.getElementById("grp_color").value = g.getColor();
// 	document.getElementById("font_size").value = g.getFontSize();
// }

function dynamicChanges(e)
{
	// console.log(e);
	group_name = e.querySelector("a").innerHTML;
	g = group_manager.get_group_by_name(group_name);
	// console.log(g.getColor());
	document.getElementById("grp_color").value = g.getColor();
	document.getElementById("font_size").value = g.getFontSize();

}

function delete_group()
{
	var element = document.querySelector("#group-section > ul > li.active");
	var name = element.querySelector("a").innerHTML;
	if(name == "All")
	{
		alert("This cannot be deleted.")
	}
	else
	{
		if( group_manager.delete_group_by_name(name)){
			element.style.display = "none";	
		}
	}
}

function add_group(evt, grp_name){
	group_manager.create_or_get_group_by_name(grp_name, true);
	document.getElementById("group-name").value = "";
}


// function add_group(grp_name)
// {
// 	/*var grp_name = document.getElementById("group-name").value;
// 	console.log(grp_name);*/
// 	var randomColor = Math.floor(Math.random()*16777215).toString(16);
// 	colorCode = "#" + randomColor;
// 	console.log(colorCode);
// 	g = group_manager.create_or_get_group_by_name(grp_name);
// 	g.setColor(colorCode);
// 	g.setFontSize("14");
// 	const text_node = document.createTextNode(grp_name);
// 	var parent_ul = document.querySelector("#group-section > ul");
// 	const li = document.createElement("li");
// 	li.setAttribute("onclick", "dynamicChanges(this);");
// 	const a = document.createElement("a")
// 	a.setAttribute("data-toggle", "pill");
// 	a.appendChild(text_node);
// 	li.appendChild(a);
// 	parent_ul.appendChild(li);
// 	add_groups_to_dropdown(grp_name);
// 	console.log(group_manager.groups);
// }

// function add_groups_to_dropdown(name)
// {
// 	var dropdown = document.getElementById("field-groups");
// 	var e = document.createElement("option");
// 	const text_node = document.createTextNode(name);
// 	e.setAttribute("value", name);
// 	e.appendChild(text_node);
// 	dropdown.appendChild(e);
// }

function edit_group()
{
	var text = document.querySelector("#group-section > ul > li.active > a").innerHTML;
	document.getElementById("grp_color").disabled = false;
	document.getElementById("font_size").disabled = false;
	document.getElementById("save_button").style.display = "block";
	document.getElementById("grp_name").style.display = "block";
	document.getElementById("grp_name_input").value = text;
}

function save_group_changes()
{
	var t = document.querySelector("#group-section > ul > li.active > a").innerHTML;
	g = group_manager.get_group_by_name(t);

	g.setFontSize(document.getElementById("font_size").value + "");
	g.setColor(document.getElementById("grp_color").value + "");
	
	document.getElementById("save_button").style.display = "none";
	document.getElementById("grp_name").style.display = "none";
	document.getElementById("grp_color").disabled = true;
	document.getElementById("font_size").disabled = true;
	timeline.update_events();
	/*g.SetColor(document.getElementById("grp_color").value);
	g.SetFontSize(document.getElementById("font_size").value);*/
}

suggestions_list = ["Sample format can be downloaded using the Format button in the Files Tab", "Mouse Left can be used to navigate through the timeline", "Mouse Scroll can be used to zoom-in and out on the timeline"]

function changeInfo()
{
	setInterval(function()
	{ 
		var randomNumber = Math.floor(Math.random() * suggestions_list.length);
		document.getElementById("info_messages").innerHTML = suggestions_list[randomNumber];
	}, 3000);
}

/*######  Rich Text Popup  ######*/
// Open
var open_richtext_editor = function() {
	// Load content
	richtext_content = document.getElementsByClassName("ql-editor")[0];
	richtext_content.innerHTML = field_description.value;
	// Clicking description box opens rich text editor.
	richtext_cover.style.display = "flex";
	field_description.blur();
}
field_description.addEventListener("click", open_richtext_editor);
// Close
var close_richtext_editor = function() {
	// Save content
	field_description.value = richtext_content.innerHTML;
	if (field_description.onchange) { field_description.onchange(); }
	// Clicking "Done" button closes rich text editor.
	richtext_cover.style.display = "none";
}
var close_richtext_editor_key = function(e) {
	if (e.keyCode == 27) {
		// Escape key
		if (richtext_cover.style.display == "flex") {
			close_richtext_editor();
		}
	}
}
richtext_done.addEventListener("click", close_richtext_editor);
window.addEventListener("keydown", close_richtext_editor_key);


/*######  Rich Text Editor  ######*/
var quill = new Quill('#richtext-editor', {
	theme: 'snow'
});

/*######  Input Validation  ######*/
var roundValue = function(e, decimal_place=1) {
	// The decimal place value is 10, 100, ...
	if (isNaN(parseFloat(e.value))) {
		e.value = e.defaultValue;
		return;
	}
	// Constrain and round
	e.value = Math.min(
		Math.max(
			Math.round(e.value*decimal_place)/decimal_place,
			e.min
		),
		e.max
	);
}

var validateZoom = function(e) {
	e.value = Math.min(
		Math.max(
			e.value,
			MIN_ZOOM
		),
		MAX_ZOOM
	);
}


/*######  Color Inputs  ######*/
// Seamlessly replaces all <input type=color> browser-dependent popups with this one.
let picker_inputs = document.querySelectorAll("input[type=color]");
for (let picker_input of picker_inputs) {
	const pickr = Pickr.create({
		el: picker_input,
		theme: 'monolith',
		lockOpacity: true,
		comparison: false,
		useAsButton: true,
		components: {
			preview: true,
			hue: true,
			opacity: false,
			interaction: {
				input: true
			}
		}
	}).on('init', instance => {
		// No swatches, remove extra space
		instance._root.swatches.style.display = "none";
		// Select all input text on click
		instance._root.interaction.result.onfocus = function() {
			this.select();
		}
		// Save and close on enter
		window.addEventListener("keydown", function(e) {
			// Also redundant esc check, for when hex input focused
			if (e.keyCode == 13 || e.keyCode == 27) {
				instance.hide();
			}
		});
		instance._root.button.onkeydown = function(e) {
			// Hitting enter on input field (input type=color) toggles 
			if (e.keyCode == 13 && instance.isOpen()) {
				instance.hide();
				e.preventDefault();
			}
		}
		// Prevent browser-specific picker from opening
		instance._root.button.onclick = function(e) {
			e.preventDefault();
		}
		// Take default value from input field (input type=color)
		instance.setColor(instance._root.button.value);
	}).on('hide', instance => {
		// Save color on close
		instance.applyColor();
		// Update color of input field (input type=color)
		instance._root.button.value = instance.getColor().toHEXA();
		instance._root.button.dispatchEvent(new Event("change"));
	}).on('changestop', (source, instance) => {
		// Make interaction with palette change focus
		// (By default, can tab to focus but not click, unlike other elements)
		// (Prev. color and input/result box would stay focused, eat user input)
		if (source =="slider") {
			instance._root.palette.palette.focus();
		}
		// Update color of input field (input type=color)
		instance._root.button.value = instance.getColor().toHEXA();
		instance._root.button.dispatchEvent(new Event("change"));
	}).on('cancel', instance => {
		// Update color of input field (input type=color)
		instance._root.button.value = instance.getColor().toHEXA();
		instance._root.button.dispatchEvent(new Event("change"));
	}).on('show', (color, instance) => {
		// On open, take color from input field (input type=color) in 
		// case of programmatic changes
		instance.setColor(instance._root.button.value);
	});
}

/*######  Initialize a Timeline  ######*/
let timeline = new CRTimeline("editor-timeline", {
	generate: false,
	event_manager: event_manager,
	group_manager: group_manager
});

