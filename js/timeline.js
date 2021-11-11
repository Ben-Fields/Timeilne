/*######  Description  ######*/
/* View parameters:
 *  - view_start_date   : the leftmost date of the timeline
 *  - year_px           : the physical width of a year in CSS pixels
 *  - ticks_per_kpx     : tick density; target number of ticks per thousand CSS pixels
 * From these, as well as viewWidth, which is calculated from the layout, 
 * the ticks and rest of the timeline view are generated.
 *
 * Interaction parameters:
 *  - zoom_multiplier   : determines how fast scrolling zooms the timeline
 *  - year_px_min       : minimum zoom level (max. zoom-out)
 *  - year_px_max       : maximum zoom level (max. zoom-in)
 *
 * Tick Update
 * 1. Change some parameter of the view area.
 * 2. Define sensible tick units based on viewable range (ex. 1 day or 10 years).
 * 3. Redraw ticks within the viewable range (ex. every 10 years from 1870 to 1920).
 *
 * Author: Benjamin Fields
 */

/*######  Editor-only  ######*/
var EDITOR = true;
let field_short_title     = document.getElementById("field-short-title");
let field_long_title      = document.getElementById("field-long-title");
let field_date            = document.getElementById("field-date");
let field_time            = document.getElementById("field-time");
let field_end_date        = document.getElementById("field-end-date");
let field_end_time        = document.getElementById("field-end-time");
let field_description     = document.getElementById("field-description");
let field_visual_priority = document.getElementById("field-visual-priority");
let field_groups          = document.getElementById("field-groups");
let field_visible_group   = document.getElementById("field-visible-group");
let field_click_action    = document.getElementById("field-click-action");
let field_anchor_tag      = document.getElementById("field-anchor-tag");
let details_placeholder   = document.getElementById("details-placeholder");
let details_data          = document.getElementById("details-data");
// let richtext_content      = document.getElementsByClassName("ql-editor")[0];


/*######  Utility  ######*/
Date.prototype.add_unit = function(unit, num) {
	const func = {
		['year']: 'FullYear',
		['month']: 'Month',
		['day']: 'Date',
		['hour']: 'Hours',
		['minute']: 'Minutes',
		['second']: 'Seconds',
		['millisecond']: 'Milliseconds'
	}[unit];
	const getFunc = 'get' + func;
	const setFunc = 'set' + func;
	this[setFunc](this[getFunc]() + num);
}


/*######  References  ######*/
let tick_container = document.getElementsByClassName("tc-layer-ticks")[0];
let timeline_container = document.getElementsByClassName("tc-timeline")[0];
let cursor_cover = document.getElementsByClassName("tc-cursor-cover")[0];
let scale_label = document.getElementsByClassName("tc-scale-label")[0];
let event_container = document.getElementsByClassName("tc-upper")[0];


/*######  View Parameters  ######*/
// Global Bounds
let minDate = new Date(0,0,0,0,0,0,0);
let maxDate = new Date(0,0,0,0,0,0,0);
// Viewable Area, calculated from view_start_date, year_px, and viewWidth
let view_start_date = new Date(0,0,0,0,0,0,0);
let viewEndDate = new Date(0,0,0,0,0,0,0);
let viewWidth = tick_container.offsetWidth;
// let viewRange = view_start_date.valueOf() - viewEndDate.valueOf();			TODO: remove
let year_px = 100;
// Unit used for ticks, based on zoom level
let tickUnit = 'year';
let tickUnitNum = 10;
// Tick unit display info
let	tickUnitMs;
let pxPerMs;
// Tick density
let ticks_per_kpx = 10;


/*######  Interaction Parameters  ######*/
// Zoom
let zoomOriginX;
let zoomOriginDate;
let totZoom = 1;
var zoom_multiplier = 1;
let queueScroll = true;
// Zoom min/max
let year_px_min = 1; // max zoom out
let year_px_max = 10_000_000_000_000; // max zoom in
let year_px_min_from_bounds = null;
// Pan
let pan_initial_mx = null;
let pan_initial_date = null;


/*######  Constants  ######*/
// Approximate values in ms for picking sensible units
const MS_IN_SEC = 1000;
const MS_IN_MIN = 60 * MS_IN_SEC;
const MS_IN_H = 60 * MS_IN_MIN;
const MS_IN_D = 24 * MS_IN_H;
const MS_IN_M = 30 * MS_IN_D;
const MS_IN_Y = 12 * MS_IN_M;


/*######  View Setup  ######*/
// Global Bounds
var set_bounds_years = function(min, max) {
	minDate.setFullYear(min);
	maxDate.setFullYear(max);
}
// Viewable Area
let set_zoom_impl = function(year_in_px) {
	year_px = Math.min(
		Math.max(
			year_in_px,
			year_px_min
		),
		year_px_max
	);
	/*## Update tick units ##*/
	// Apprixmate target distance
	//   (based on target density and approx. unit size in ms)
	//   (actual distance varies between ticks due to non-uniform calendar)
	let target_tick_dist_px = 1000 / ticks_per_kpx;
	let target_tick_dist_ms = target_tick_dist_px * MS_IN_Y / year_px;
	// Choose unit based on target time distance.
	// Choose number of unit.
	//   (to achieve tick density closest to target density)
	const tt = target_tick_dist_ms;
	if (tt >= MS_IN_Y) {
		tickUnit = 'year';
		tickUnitMs = MS_IN_Y;
		tickUnitNum = Math.floor(tt / tickUnitMs);
		if (tickUnitNum > 2000) {
			// Leave unrounded.
			// Large years (era-scale timelines) not yet supported.
		} else {
			for (let space of [1000, 500, 250, 200, 100, 50, 25, 20, 10, 5, 2, 1]) {
				if (tickUnitNum >= space) {
					tickUnitNum = space;
					break;
				}
			}
		}
	} else if (tt >= MS_IN_M) {
		tickUnit = 'month';
		tickUnitMs = MS_IN_M;
		tickUnitNum = Math.floor(tt / tickUnitMs);
		for (let space of [6, 2, 1]) {
			if (tickUnitNum >= space) {
				tickUnitNum = space;
				break;
			}
		}
	} else if (tt >= MS_IN_D) {
		tickUnit = 'day';
		tickUnitMs = MS_IN_D;
		tickUnitNum = Math.floor(tt / tickUnitMs);
		for (let space of [15, 10, 5, 2, 1]) {
			if (tickUnitNum >= space) {
				tickUnitNum = space;
				break;
			}
		}
	} else if (tt >= MS_IN_H) {
		tickUnit = 'hour';
		tickUnitMs = MS_IN_H;
		tickUnitNum = Math.floor(tt / tickUnitMs);
		for (let space of [12, 6, 4, 2, 1]) {
			if (tickUnitNum >= space) {
				tickUnitNum = space;
				break;
			}
		}
	} else if (tt >= MS_IN_MIN) {
		tickUnit = 'minute';
		tickUnitMs = MS_IN_MIN;
		tickUnitNum = Math.floor(tt / tickUnitMs);
		for (let space of [30, 15, 10, 5, 2, 1]) {
			if (tickUnitNum >= space) {
				tickUnitNum = space;
				break;
			}
		}
	} else if (tt >= MS_IN_SEC) {
		tickUnit = 'second';
		tickUnitMs = MS_IN_SEC;
		tickUnitNum = Math.floor(tt / tickUnitMs);
		for (let space of [30, 15, 10, 5, 2, 1]) {
			if (tickUnitNum >= space) {
				tickUnitNum = space;
				break;
			}
		}
	} else {
		tickUnit = 'millisecond';
		tickUnitMs = 1;
		tickUnitNum = Math.floor(tt / tickUnitMs);
		if (tickUnitNum == 0) {
			tickUnitNum = 1;
		} else {
			for (let space of [500, 250, 200, 100, 50, 25, 20, 10, 5, 2, 1]) {
				if (tickUnitNum >= space) {
					tickUnitNum = space;
					break;
				}
			}
		}
	}
}
var set_zoom = function(year_in_px) {
	set_zoom_impl(year_in_px);
	update_ticks();
}
let set_start_date_impl = function(date, year_in_px = null) {
	if (year_in_px != null) {
		set_zoom_impl(year_in_px);
	}
	view_start_date = new Date(date.valueOf());
	viewEndDate = new Date(view_start_date.valueOf());
	let ms_to_end = viewWidth * MS_IN_Y / year_px;
	viewEndDate.setMilliseconds(view_start_date.getMilliseconds() + ms_to_end);
}
var set_start_date = function(date, year_in_px = null) {
	set_start_date_impl(date, year_in_px);
	update_ticks();
}
let set_end_date_impl = function(date, year_in_px = null) {
	if (year_in_px != null) {
		set_zoom_impl(year_in_px);
	}
	viewEndDate = new Date(date.valueOf());
	view_start_date = new Date(viewEndDate.valueOf());
	let ms_to_beg = viewWidth * MS_IN_Y / year_px;
	view_start_date.setMilliseconds(viewEndDate.getMilliseconds() - ms_to_beg);
}
var set_end_date = function(date, year_in_px = null) {
	set_end_date_impl(date, year_in_px);
	update_ticks();
}
var set_center_date = function(date, year_in_px = null) {
	if (year_in_px != null) {
		set_zoom_impl(year_in_px);
	}
	let ms_to_half = viewWidth * MS_IN_Y / year_px / 2;
	view_start_date = new Date(date.valueOf());
	viewEndDate = new Date(date.valueOf());
	view_start_date.setMilliseconds(view_start_date.getMilliseconds() - ms_to_half);
	viewEndDate.setMilliseconds(view_start_date.getMilliseconds() + ms_to_half);
	update_ticks();
}
var zoom_in = function(origin_x, year_in_px) {
	// Date at the zoom focal position
	let originDate = new Date(view_start_date.valueOf());
	originDate.setMilliseconds(
		originDate.getMilliseconds() + origin_x * MS_IN_Y / year_px
	);
	// Zoom, keeping the origin date origin_x pixels from the start
	set_zoom_impl(year_in_px);
	view_start_date = new Date(originDate.valueOf());
	view_start_date.setMilliseconds(
		originDate.getMilliseconds() - origin_x * MS_IN_Y / year_px
	);
	viewEndDate = new Date(originDate.valueOf());
	viewEndDate.setMilliseconds(
		originDate.getMilliseconds() + (viewWidth-origin_x) * MS_IN_Y / year_px
	);
	update_ticks();
}


/*######  Draw Ticks  ######*/
// Ticks
var update_ticks = function() {
	// Remove old ticks
	tick_container.innerHTML = "";

	/// Set the starting tick to a rounded date/time (past the start date)
	///   ex. 2002 for a year scale, not 2001-02-03 4:56PM.789
	///   For consistency, need to count from previous high-level tick.

	// Get rounded down date, the minimum bound for the starting tick date
	let roundDownDate = new Date(view_start_date.valueOf());
	switch(tickUnitMs) {
		case MS_IN_Y:
			roundDownDate.setFullYear(0);
		case MS_IN_M:
			roundDownDate.setMonth(0);
		case MS_IN_D:
			roundDownDate.setDate(1); // 1-31; the only one-based API
		case MS_IN_H:
			roundDownDate.setHours(0);
		case MS_IN_MIN:
			roundDownDate.setMinutes(0);
		case MS_IN_SEC:
			roundDownDate.setSeconds(0);
		case 1:
			roundDownDate.setMilliseconds(0);
	}

	// Number of units from roundDownDate to view_start_date
	let unitSpan = null;
	switch(tickUnitMs) {
		case MS_IN_Y:
			unitSpan = view_start_date.getFullYear(); // minus 0
			break;
		case MS_IN_M:
			unitSpan = view_start_date.getMonth();
			break;
		case MS_IN_D:
			unitSpan = view_start_date.getDate();
			break;
		case MS_IN_H:
			unitSpan = view_start_date.getHours();
			break;
		case MS_IN_MIN:
			unitSpan = view_start_date.getMinutes();
			break;
		case MS_IN_SEC:
			unitSpan = view_start_date.getSeconds();
			break;
		case 1:
			unitSpan = view_start_date.getMilliseconds();
			break;
	}
	// Set starting tick date
	let curDate = new Date(roundDownDate);
	curDate.add_unit(tickUnit, unitSpan - (unitSpan % tickUnitNum));

	// console.log("=======");											// TODO: remove
	// console.log("Tick Unit: " + tickUnit);
	// console.log("Tick Unit Num: " + tickUnitNum);
	// console.log("View Start Date: " + view_start_date);
	// console.log("Tick Start Date: " + curDate);
	// console.log("Year PX: " + year_px);

	// Set ending tick date a bit past the viewEndDate to 
	// hide ticks popping in/out of existence.
	let maxTickDate = new Date(viewEndDate.valueOf());
	maxTickDate.add_unit(tickUnit, tickUnitNum);

	// Get required info for the scale label
	let legY, legM, legD, legH, legMin;
	switch(tickUnitMs) {
		// No scale label
		case MS_IN_M:
		case MS_IN_Y:
			showScaleLabel = false;
			break;
		// Scale label
		case 1:
			legMin = "2-digit";
		case MS_IN_SEC:
			legH = "numeric";
		case MS_IN_MIN:
			legD = "numeric";
		case MS_IN_H:
			legM = "short";
		case MS_IN_D:
			legY = "numeric";
	}
	// Update scale label in the legend
	if (legY != undefined) {
		let legEra;
		if (roundDownDate.getFullYear() < 0) {
			legEra = "short";
		}
		scale_label.innerHTML = roundDownDate.toLocaleDateString(undefined, {
			year: legY,
			month: legM,
			day: legD,
			hour: legH,
			minute: legMin,
			era: legEra
		});
	} else {
		scale_label.innerHTML = "";
	}

	// Draw ticks from left to right
	while (curDate.valueOf() < maxTickDate.valueOf()) {
		// For months and days, which have inconsistent number, check if 
		// spacing to next higher-unit tick is less than target spacing. If so, skip
		// the uniformly-spaced tick and go straight to the higher-unit tick
		// to maintin clean numbering.
		//   (That is, the next tick is either a uniformly spaced tick, or the next higher-level 
		//   tick if it's close enough, aka. <= the usual uniform spacing).
		if (tickUnitMs != MS_IN_Y) {
			let roundUpDate = new Date(curDate.valueOf());
			switch(tickUnitMs) {
				case MS_IN_M:
					roundUpDate.setMonth(0)
					roundUpDate.setFullYear(roundUpDate.getFullYear() + 1);
					break;
				case MS_IN_D:
					roundUpDate.setDate(1);
					roundUpDate.setMonth(roundUpDate.getMonth() + 1);
					break;
				case MS_IN_H:
					roundUpDate.setHours(0);
					roundUpDate.setDate(roundUpDate.getDate() + 1);
					break;
				case MS_IN_MIN:
					roundUpDate.setMinutes(0);
					roundUpDate.setHours(roundUpDate.getHours() + 1);
					break;
				case MS_IN_SEC:
					roundUpDate.setSeconds(0);
					roundUpDate.setMinutes(roundUpDate.getMinutes() + 1);
					break;
				case 1:
					roundUpDate.setMilliseconds(0);
					roundUpDate.setSeconds(roundUpDate.getSeconds() + 1);
					break;
			}
			let nextUniformDate = new Date(curDate.valueOf())
			nextUniformDate.add_unit(tickUnit, tickUnitNum);
			if (roundUpDate.valueOf() < nextUniformDate.valueOf()) {
				// Continue from higher-level tick instead, but before that:
				// We use a different, closer threshold to determine if we should also draw
				// the low-level tick (it looks better; no huge whitespace)
				let drawThresholdDate = new Date(curDate.valueOf())
				drawThresholdDate.add_unit(tickUnit, Math.ceil(tickUnitNum / 2));
				if (drawThresholdDate.valueOf() < roundUpDate.valueOf()) {
					draw_tick(curDate);
				}
				// Continue from higher-level tick instead
				curDate = roundUpDate;
			}

		}
		// Draw tick
		draw_tick(curDate);
		// Next tick
		curDate.add_unit(tickUnit, tickUnitNum);
	}
	// Draw events when finished
	update_events();
}

// Single tick
let draw_tick = function(curDate) {
	// Create tick HTML element
	let tick = document.createElement("div");
	tick.className = "tc-tick";
	tick.style.left = (curDate.valueOf() - view_start_date.valueOf()) * year_px / MS_IN_Y + "px";
	let label = document.createElement("div");
	label.className = "tc-tick-label";
	// Choose which parts of the date/time to display.
	//   ex. for the start of each year, display the year number, not "January".
	let level = 1; // 1 = ms, 7 = year
	LEVEL_UP: {
		// The start date is zeroed, so all subsequent dates are too.
		// Thus, we do not need to check if the display tick unit requires such accuracy.
		//   We only need to check if the current tick has data for the unit.
		//   (otherwise would need ex. if (tickUnit <= days && curDate.getDays() != 0) )
		if (curDate.getMilliseconds() != 0) { break LEVEL_UP; }
		level++;
		if (curDate.getSeconds() != 0) { break LEVEL_UP; }
		level++;
		if (curDate.getMinutes() != 0) { break LEVEL_UP; }
		level++;
		if (curDate.getHours() != 0) { break LEVEL_UP; }
		level++;
		if (curDate.getDate() != 1) { break LEVEL_UP; }
		level++;
		if (curDate.getMonth() != 0) { break LEVEL_UP; }
		level++;
	}
	// Format date/time appropriately
	switch(level) {
		case 1: // millisecond
			label.innerHTML = curDate.toLocaleTimeString(undefined, {
				second: "2-digit",
				fractionalSecondDigits: 3
			});
			break;
		case 2: // second
			label.innerHTML = curDate.toLocaleTimeString(undefined, {
				second: "2-digit"
			});
			break;
		case 3: // minute
			label.innerHTML = curDate.toLocaleTimeString(undefined, {
				hour: "numeric",
				minute: "2-digit"
			});
			break;
		case 4: // hour
			label.innerHTML = curDate.toLocaleTimeString(undefined, {
				hour: "numeric",
				minute: "2-digit"
			});
			break;
		case 5: // day
			label.innerHTML = curDate.toLocaleDateString(undefined, {
				day: "numeric"
			});
			break;
		case 6: // month
			label.innerHTML = curDate.toLocaleDateString(undefined, {
				month: "short"
			});
			break;
		case 7: // year
			let showEra;
			if (curDate.getFullYear() < 0) {
				showEra = "short";
				label.style.whiteSpace = "nowrap";
			}
			label.innerHTML = curDate.toLocaleDateString(undefined, {
				year: "numeric",
				era: showEra
			});
			break;
	}
	// Attach to document
	tick.appendChild(label);
	tick_container.appendChild(tick);
}


/*######  Interaction  ######*/
// Scroll to zoom
timeline_container.addEventListener('wheel', function(e) {
	// Zoom based on mouse position
	let rect = e.target.getBoundingClientRect();
	zoomOriginX = e.clientX - rect.left;
	// Calculate net scroll delta in between frames
	let deltaZoom = 1;
	if (e.deltaY <= 0) { // zoom in
		deltaZoom = (1 - zoom_multiplier*e.deltaY/1000);
	} else { // > 0; zoom out
		deltaZoom = 1 / (1 + zoom_multiplier*e.deltaY/1000);
	}
	totZoom *= deltaZoom;
	// Request accumulated scroll be handled on next frame, if not done so already (limits number of calls)
	if (queueScroll) {
		window.requestAnimationFrame(function() {
			// When it is time for next frame, browser will call zoom function and reset variables
			if (totZoom >= 1 && year_px >= year_px_max) {
				// Redundant check for max zoom, otherwise it will pan the timeline
			} else {
				zoom_in(zoomOriginX, year_px * totZoom);
			}
			totZoom = 1;
			queueScroll = true;
		});
		queueScroll = false;
	}
});
// Click and drag
let pan_start = function(e) {
	// Change cursor - grabbing
	cursor_cover.style.display = "block";
	// Initial cursor x pos
	pan_initial_mx = e.clientX;
	// Initial timeline date
	pan_initial_date = new Date(view_start_date.valueOf());
	// The remaining events are not localized (drag anywhere)
	window.addEventListener("mousemove", pan_change);
	window.addEventListener("mouseup", pan_end);
}
let pan_change = function(e) {
	let dateDelta = (pan_initial_mx - e.clientX) * MS_IN_Y / year_px;
	let newStart = pan_initial_date.valueOf() + dateDelta;
	if (newStart < minDate.valueOf()) {
		// reset pan origin for increased responsiveness at bounds
		pan_initial_mx = e.clientX;
		pan_initial_date = new Date(view_start_date.valueOf());
		// min bound reached
		newStart = minDate.valueOf();
	}
	set_start_date_impl(new Date(newStart));
	if (viewEndDate.valueOf() > maxDate.valueOf()) {
		// max bound reached
		set_end_date_impl(maxDate);
		// reset pan origin for increased responsiveness at bounds
		pan_initial_mx = e.clientX;
		pan_initial_date = new Date(view_start_date.valueOf());
	}
	update_ticks();
}
let pan_end = function(e) {
	// Remvoe the global events, reset state
	window.removeEventListener("mousemove", pan_change);
	window.removeEventListener("mouseup", pan_end);
	// Change cursor - not grabbing
	cursor_cover.style.display = "none";
}
timeline_container.addEventListener("mousedown", pan_start);


/*######  Responsive Layout  ######*/
// Redraw on resize
const resizeObserver = new ResizeObserver(entries => {
	viewWidth = tick_container.offsetWidth;
	viewEndDate = new Date(view_start_date.valueOf());
	let ms_to_end = viewWidth * MS_IN_Y / year_px;
	viewEndDate.setMilliseconds(view_start_date.getMilliseconds() + ms_to_end);
	update_ticks();
});
resizeObserver.observe(timeline_container);


/*######  Draw Events  ######*/

var selected_event = null;
let update_events = function() {
	// This is to get something on the screen; it will be rewritten.
	// Remove old events
	event_container.innerHTML = "";
	// Add events in the viewable range
	for (let event of event_manager.ordered_events) {
		if (event.start_datetime.valueOf() < view_start_date.valueOf() ||
			event.start_datetime.valueOf() > viewEndDate.valueOf()) {
			continue;
		}

		g = event.get_visible_group();
		group_color = g.getColor();

		var css_value = "background-color: " + group_color + ";";
		var css_border = "border-color:" + group_color + ";";
		// Create event HTML element
		let evt = document.createElement("div");
		evt.className = "tc-event";
		let eventLine = document.createElement("div");
		eventLine.className = "tc-event-line";
		eventLine.setAttribute("style",css_value);
		evt.appendChild(eventLine);
		let label = document.createElement("div");
		label.className = "tc-event-label";
		label.setAttribute("style",css_border);
		evt.appendChild(label);
		// Position
		evt.style.left = (event.start_datetime.valueOf() - view_start_date.valueOf()) * year_px / MS_IN_Y + "px";
		// Fill in the details
		label.innerHTML = event.title;
		// Save event ID
		evt.eid = event.getId();
		// On select, show details
		if (EDITOR) {
			evt.addEventListener("mousedown", function(e) {
				select_event(evt.eid);
				// Prevent dragging timeline when event clicked
				e.stopPropagation();
			});
		}
		// Attach to document
		event_container.appendChild(evt);
	}
}

let select_event = function(eid) {
	// Show the details panel in full
	details_placeholder.style.display = "none";
	details_data.style.display = "block";
	// Get event reference
	let event = event_manager.get_event_by_id(eid);
	// Initially populate details
	field_short_title.value = event.title;
	field_long_title.value = event["Long Title"];
	field_date.valueAsDate = event.start_datetime;
	field_time.valueAsDate = event.start_datetime;
	field_end_date.valueAsDate = event.end_datetime;
	field_end_time.valueAsDate = event.end_datetime;
	field_description.value = event["Description"];
	// richtext_content.innerHTML = event["Description"];
	field_visual_priority.value = event["Visual Priority"] | "";
	field_groups.value = event.get_group_name_list();
	field_visible_group.value = event.get_visible_group().get_name();
	field_click_action.value = event["Click Action"];
	field_anchor_tag.value = event["Anchor Tag"];

	// Update event on any value change
	field_short_title.onchange = function(){
		event.title = field_short_title.value;
		update_events();
	}
	field_long_title.onchange = function(){
		event["Long Title"] = field_long_title.value
		update_events();
	}
	field_date.onchange = function(){
		let newDate = new Date(field_date.valueAsDate.valueOf());
		newDate.setHours(field_time.valueAsDate.getHours());
		newDate.setMinutes(field_time.valueAsDate.getMinutes());
		newDate.setSeconds(field_time.valueAsDate.getSeconds());
		newDate.setMilliseconds(field_time.valueAsDate.getMilliseconds());
		event.start_datetime = newDate;
		update_events();
	}
	field_time.onchange = function(){
		let newDate = new Date(field_date.valueAsDate.valueOf());
		newDate.setHours(field_time.valueAsDate.getHours());
		newDate.setMinutes(field_time.valueAsDate.getMinutes());
		newDate.setSeconds(field_time.valueAsDate.getSeconds());
		newDate.setMilliseconds(field_time.valueAsDate.getMilliseconds());
		event.start_datetime = newDate;
		update_events();
	}
	field_end_date.onchange = function(){
		let newDate = new Date(field_end_date.valueAsDate.valueOf());
		newDate.setHours(field_end_time.valueAsDate.getHours());
		newDate.setMinutes(field_end_time.valueAsDate.getMinutes());
		newDate.setSeconds(field_end_time.valueAsDate.getSeconds());
		newDate.setMilliseconds(field_end_time.valueAsDate.getMilliseconds());
		event.end_datetime = newDate;
		update_events();
	}
	field_end_time.onchange = function(){
		let newDate = new Date(field_end_date.valueAsDate.valueOf());
		newDate.setHours(field_end_time.valueAsDate.getHours());
		newDate.setMinutes(field_end_time.valueAsDate.getMinutes());
		newDate.setSeconds(field_end_time.valueAsDate.getSeconds());
		newDate.setMilliseconds(field_end_time.valueAsDate.getMilliseconds());
		event.end_datetime = newDate;
		update_events();
	}
	field_description.onchange = function(){
		event["Description"] = field_description.value;
		// event["Description"] = richtext_content.innerHTML;
		update_events();
	}
	field_visual_priority.onchange = function(){
		event["Visual Priority"] = field_visual_priority.value;
		update_events();
	}
	field_groups.onchange = function(){
		// Temporary: single group
		event.add_into_group(group_manager.get_group_by_name(field_groups.value));
		update_events();
	}
	field_visible_group.onchange = function(){
		event.set_visible_group_by_name(field_visible_group.value);
		update_events();
	}
	field_click_action.onchange = function(){
		event["Click Action"] = field_click_action.value;
		update_events();
	}
	field_anchor_tag.onchange = function(){
		event["Anchor Tag"] = field_anchor_tag.value;
		update_events();
	}
}

/*######  Initialize  ######*/
set_bounds_years(-1000, 3000);
set_center_date(new Date(), 100);


/*######  Notes  ######*/
/* Tick markup:
 * ```
 * <div class="tc-tick">
 * 	<div class="tc-tick-label">
 * 		Date Text
 * 	</div>
 * </div>
 * ```
 *
 * Event markup:
 * ```
 * <div class="tc-event">
 * 	<div class="tc-event-line"></div>
 * 	<div class="tc-event-label">
 * 		Event Title
 * 	</div>
 * </div>
 * ```
 */
 