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
