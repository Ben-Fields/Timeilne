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


{ // Scope the file


/*######  Constants  ######*/

// Approximate values in ms for picking sensible units
const MS_IN_SEC = 1000;
const MS_IN_MIN = 60 * MS_IN_SEC;
const MS_IN_H = 60 * MS_IN_MIN;
const MS_IN_D = 24 * MS_IN_H;
const MS_IN_M = 30 * MS_IN_D;
const MS_IN_Y = 12 * MS_IN_M;


/*######  Utility  ######*/

// Add specific time units to Date
let add_unit = function(date, unit, num) {
	const func = {
		['year']: 'FullYear',
		['month']: 'Month',
		['day']: 'Date',
		['hour']: 'Hours',
		['minute']: 'Minutes',
		['second']: 'Seconds',
		['millisecond']: 'Milliseconds'
	}[unit];
	const getFunc = 'getUTC' + func;
	const setFunc = 'setUTC' + func;
	date[setFunc](date[getFunc]() + num);
}
// Cosmetic fix to remove whitespace to right of text
let shrink_to_text = function(el) {
	// Save words
	let words = el.innerHTML.split(/( |-)/);
	// Clear content
	el.innerHTML = "";
	// New string init
	let newTxt = words[0] + (words[1] || "");
	// First word position
	let span = document.createElement("span");
	span.innerHTML = newTxt;
	el.appendChild(span);
	// Iterate, put in <br> tags
	let prevTop = span.offsetTop;
	for (let i = 2; i<words.length-1; i+=2) {
		// Add test span
		let span = document.createElement("span");
		let word = words[i] + words[i+1];
		span.innerHTML = word;
		el.appendChild(span);
		// Add <br> if line breaks
		if (span.offsetTop > prevTop) {
			newTxt += "<br>";
			prevTop = span.offsetTop;
		}
		// Add word
		newTxt += word;
	}
	// Last word
	if (words.length > 2) {
		// Add test span
		let span = document.createElement("span");
		let word = words[words.length-1];
		span.innerHTML = word;
		el.appendChild(span);
		// Add <br> if line breaks
		if (span.offsetTop > prevTop) {
			newTxt += "<br>";
			prevTop = span.offsetTop;
		}
		// Add word
		newTxt += word;
	}
	// Set content with <br>'s
	el.innerHTML = newTxt;
}
// Returns today's date (defult initial date)
let today = function() {
	let t = new Date();
	let tUTC = new Date();
	tUTC.setUTCFullYear(t.getFullYear());
	tUTC.setUTCMonth(t.getMonth());
	tUTC.setUTCDate(t.getDate());
	tUTC.setUTCHours(0);
	tUTC.setUTCMinutes(0);
	tUTC.setUTCSeconds(0);
	tUTC.setUTCMilliseconds(0);
	return tUTC;
}

/*######  Class Declaration  ######*/

var CRTimeline = class {

	/*######  Initialization  ######*/
	// Default init options
	static DEFAULT_OPTIONS = {
		// Whether to (re-)create the timeline markup
		generate: true,
		// View settings
		min_date: new Date(Date.UTC(-1000,0,1,0,0,0,0)),
		max_date: new Date(Date.UTC(3000,0,1,0,0,0,0)),
		initial_date: today(),
		min_zoom: 1,
		max_zoom: 10_000_000_000_000,
		initial_zoom: 100,
		// Style
		tick_density: 10,
		minor_tick_density: 0,
		line_color: "#111",
		line_thickness: 2,
		// Data
		event_manager: undefined,
		group_manager: undefined
	};
	// Constructor
	options;
	constructor(container_id, options = {}) {
		// Set options using defualts for undefined values
		this.options = Object.assign({}, CRTimeline.DEFAULT_OPTIONS, options);
		// Generate HTML
		if (this.options.generate) {

		}
		// References
		// - Timeline Container
		this.timeline_container = document.getElementById(container_id);
		// - Components
		this.tick_container = this.timeline_container.getElementsByClassName("tc-layer-ticks")[0];
		this.cursor_cover = this.timeline_container.getElementsByClassName("tc-cursor-cover")[0];
		this.scale_label = this.timeline_container.getElementsByClassName("tc-scale-label")[0];
		let event_container = this.timeline_container.getElementsByClassName("tc-layer-events")[0];
		this.events_upper = event_container.getElementsByClassName("tc-upper")[0];
		this.events_lower = event_container.getElementsByClassName("tc-lower")[0];
		// - Style components
		this.line = this.timeline_container.getElementsByClassName("tc-line")[0];
		this.line2 = this.timeline_container.getElementsByClassName("tc-line")[1];
		this.left_arrow = this.timeline_container.getElementsByTagName("svg")[0];
		this.right_arrow = this.timeline_container.getElementsByTagName("svg")[1];
		// Calculated Parameters
		this.viewWidth = this.tick_container.offsetWidth;
		// Saved parameters
		this.minDate = this.options.min_date;
		this.maxDate = this.options.max_date;
		this.year_px_min = this.options.min_zoom;
		this.year_px_max = this.options.max_zoom;
		this.ticks_per_kpx = this.options.tick_density;
			// TODO: minor_tick_density
		this.set_line_color(this.options.line_color);
		this.set_line_thickness(this.options.line_thickness);
		if (this.options.event_manager) {
			this.event_manager = this.options.event_manager;
		} else {
			this.event_manager = new EventManager();
		}
		if (this.options.group_manager) {
			this.group_manager = this.options.group_manager;
		} else {
			this.group_manager = new GroupManager();
		}
		// Set View
		this.set_center_date(this.options.initial_date, this.options.initial_zoom);
		// Attach events
		// - Zoom
		this.timeline_container.addEventListener('wheel', this.scroll_event.bind(this));
		// - Pan
		this.timeline_container.addEventListener("mousedown", this.pan_start.bind(this));
		// - Resize
		const resizeObserver = new ResizeObserver(this.resize_event.bind(this));
		resizeObserver.observe(this.timeline_container);
	}

	/*######  References  ######*/
	timeline_container;
	tick_container;
	cursor_cover;
	scale_label;
	event_container;
	events_upper;
	events_lower;

	/*######  Style References  ######*/
	line;
	line2;
	left_arrow;
	right_arrow;

	/*######  View Parameters  ######*/
	// Global Bounds
	minDate;
	maxDate;
	// Viewable Area, calculated from view_start_date, year_px, and viewWidth
	view_start_date;
	viewEndDate;
	viewWidth;
	year_px = 100;
	// Unit used for ticks, based on zoom level
	tickUnit = 'year';
	tickUnitNum = 10;
	// Tick unit display info
	tickUnitMs;
	pxPerMs;
	// Tick density
	ticks_per_kpx;

	/*######  View Interaction Parameters  ######*/
	// Zoom
	zoomOriginX;
	zoomOriginDate;
	totZoom = 1;
	zoom_multiplier = 1;
	queueScroll = true;
	// Zoom min/max
	year_px_min; // max zoom out
	year_px_max; // max zoom in
	year_px_min_from_bounds = null;
	// Pan
	pan_initial_mx = null;
	pan_initial_date = null;

	/*######  Data Interaction Parameters  ######*/
	event_manager;
	group_manager;
	selected_event = null;

	/*######  Date / Time Formatting  ######*/
	tickFormatYEra = new Intl.DateTimeFormat(undefined, {
		timeZone: "UTC",
		year: "numeric",
		era: "short"
	});
	tickFormatY = new Intl.DateTimeFormat(undefined, {
		timeZone: "UTC",
		year: "numeric"
	});
	tickFormatM = new Intl.DateTimeFormat(undefined, {
		timeZone: "UTC",
		month: "short"
	});
	tickFormatD = new Intl.DateTimeFormat(undefined, {
		timeZone: "UTC",
		day: "numeric"
	});
	tickFormatH = new Intl.DateTimeFormat(undefined, {
		timeZone: "UTC",
		hour: "numeric",
		minute: "2-digit"
	});
	tickFormatMin = new Intl.DateTimeFormat(undefined, {
		timeZone: "UTC",
		hour: "numeric",
		minute: "2-digit"
	});
	tickFormatSec = new Intl.DateTimeFormat(undefined, {
		timeZone: "UTC",
		second: "2-digit"
	});
	tickFormatMs = new Intl.DateTimeFormat(undefined, {
		timeZone: "UTC",
		second: "2-digit",
		fractionalSecondDigits: 3
	});
}


/*######  View Setup  ######*/

// Global Bounds
CRTimeline.prototype.set_bounds_years = function(min, max) {
	this.minDate.setUTCFullYear(min);
	this.maxDate.setUTCFullYear(max);
}
// Viewable Area
CRTimeline.prototype.set_zoom_impl = function(year_in_px) {
	this.year_px = Math.min(
		Math.max(
			year_in_px,
			this.year_px_min
		),
		this.year_px_max
	);
	/*## Update tick units ##*/
	// Apprixmate target distance
	//   (based on target density and approx. unit size in ms)
	//   (actual distance varies between ticks due to non-uniform calendar)
	let target_tick_dist_px = 1000 / this.ticks_per_kpx;
	let target_tick_dist_ms = target_tick_dist_px * MS_IN_Y / this.year_px;
	// Choose unit based on target time distance.
	// Choose number of unit.
	//   (to achieve tick density closest to target density)
	const tt = target_tick_dist_ms;
	if (tt >= MS_IN_Y) {
		this.tickUnit = 'year';
		this.tickUnitMs = MS_IN_Y;
		this.tickUnitNum = Math.floor(tt / this.tickUnitMs);
		if (this.tickUnitNum > 2000) {
			// Leave unrounded.
			// Large years (era-scale timelines) not yet supported.
		} else {
			for (let space of [1000, 500, 250, 200, 100, 50, 25, 20, 10, 5, 2, 1]) {
				if (this.tickUnitNum >= space) {
					this.tickUnitNum = space;
					break;
				}
			}
		}
	} else if (tt >= MS_IN_M) {
		this.tickUnit = 'month';
		this.tickUnitMs = MS_IN_M;
		this.tickUnitNum = Math.floor(tt / this.tickUnitMs);
		for (let space of [6, 2, 1]) {
			if (this.tickUnitNum >= space) {
				this.tickUnitNum = space;
				break;
			}
		}
	} else if (tt >= MS_IN_D) {
		this.tickUnit = 'day';
		this.tickUnitMs = MS_IN_D;
		this.tickUnitNum = Math.floor(tt / this.tickUnitMs);
		for (let space of [15, 10, 5, 2, 1]) {
			if (this.tickUnitNum >= space) {
				this.tickUnitNum = space;
				break;
			}
		}
	} else if (tt >= MS_IN_H) {
		this.tickUnit = 'hour';
		this.tickUnitMs = MS_IN_H;
		this.tickUnitNum = Math.floor(tt / this.tickUnitMs);
		for (let space of [12, 6, 4, 2, 1]) {
			if (this.tickUnitNum >= space) {
				this.tickUnitNum = space;
				break;
			}
		}
	} else if (tt >= MS_IN_MIN) {
		this.tickUnit = 'minute';
		this.tickUnitMs = MS_IN_MIN;
		this.tickUnitNum = Math.floor(tt / this.tickUnitMs);
		for (let space of [30, 15, 10, 5, 2, 1]) {
			if (this.tickUnitNum >= space) {
				this.tickUnitNum = space;
				break;
			}
		}
	} else if (tt >= MS_IN_SEC) {
		this.tickUnit = 'second';
		this.tickUnitMs = MS_IN_SEC;
		this.tickUnitNum = Math.floor(tt / this.tickUnitMs);
		for (let space of [30, 15, 10, 5, 2, 1]) {
			if (this.tickUnitNum >= space) {
				this.tickUnitNum = space;
				break;
			}
		}
	} else {
		this.tickUnit = 'millisecond';
		this.tickUnitMs = 1;
		this.tickUnitNum = Math.floor(tt / this.tickUnitMs);
		if (this.tickUnitNum == 0) {
			this.tickUnitNum = 1;
		} else {
			for (let space of [500, 250, 200, 100, 50, 25, 20, 10, 5, 2, 1]) {
				if (this.tickUnitNum >= space) {
					this.tickUnitNum = space;
					break;
				}
			}
		}
	}
}
// Set Bounds and Zoom
CRTimeline.prototype.set_zoom = function(year_in_px) {
	this.set_zoom_impl(year_in_px);
	this.update_ticks();
}
CRTimeline.prototype.set_start_date_impl = function(date, year_in_px = null) {
	if (year_in_px != null) {
		this.set_zoom_impl(year_in_px);
	}
	this.view_start_date = new Date(date.valueOf());
	this.viewEndDate = new Date(this.view_start_date.valueOf());
	let ms_to_end = this.viewWidth * MS_IN_Y / this.year_px;
	this.viewEndDate.setMilliseconds(this.view_start_date.getMilliseconds() + ms_to_end);
}
CRTimeline.prototype.set_start_date = function(date, year_in_px = null) {
	this.set_start_date_impl(date, year_in_px);
	this.update_ticks();
}
CRTimeline.prototype.set_end_date_impl = function(date, year_in_px = null) {
	if (year_in_px != null) {
		this.set_zoom_impl(year_in_px);
	}
	this.viewEndDate = new Date(date.valueOf());
	this.view_start_date = new Date(this.viewEndDate.valueOf());
	let ms_to_beg = this.viewWidth * MS_IN_Y / this.year_px;
	this.view_start_date.setMilliseconds(this.viewEndDate.getMilliseconds() - ms_to_beg);
}
CRTimeline.prototype.set_end_date = function(date, year_in_px = null) {
	this.set_end_date_impl(date, year_in_px);
	this.update_ticks();
}
CRTimeline.prototype.set_center_date = function(date, year_in_px = null) {
	if (year_in_px != null) {
		this.set_zoom_impl(year_in_px);
	}
	let ms_to_half = this.viewWidth * MS_IN_Y / this.year_px / 2;
	this.view_start_date = new Date(date.valueOf());
	this.viewEndDate = new Date(date.valueOf());
	this.view_start_date.setMilliseconds(this.view_start_date.getMilliseconds() - ms_to_half);
	this.viewEndDate.setMilliseconds(this.view_start_date.getMilliseconds() + ms_to_half);
	this.update_ticks();
}
CRTimeline.prototype.zoom_in = function(origin_x, year_in_px) {
	// Date at the zoom focal position
	let originDate = new Date(this.view_start_date.valueOf());
	originDate.setMilliseconds(
		originDate.getMilliseconds() + origin_x * MS_IN_Y / this.year_px
	);
	// Zoom, keeping the origin date origin_x pixels from the start
	this.set_zoom_impl(year_in_px);
	this.view_start_date = new Date(originDate.valueOf());
	this.view_start_date.setMilliseconds(
		originDate.getMilliseconds() - origin_x * MS_IN_Y / this.year_px
	);
	this.viewEndDate = new Date(originDate.valueOf());
	this.viewEndDate.setMilliseconds(
		originDate.getMilliseconds() + (this.viewWidth-origin_x) * MS_IN_Y / this.year_px
	);
	this.update_ticks();
}
// External utility function
CRTimeline.prototype.px_to_ms = function(px) {
	return px * MS_IN_Y / this.year_px;
}


/*######  Styling  ######*/

CRTimeline.prototype.set_line_color = function(color) {
	this.line.style.borderColor = color;
	this.line2.style.borderColor = color;
	// SVG attributes not standard HTML, so must use function.
	this.left_arrow.setAttribute("fill", color);
	this.right_arrow.setAttribute("fill", color);
}
CRTimeline.prototype.set_line_thickness = function(thickness) {
	this.line.style.borderWidth = thickness + "px";
	this.line2.style.borderWidth = thickness + "px";
}


/*######  Draw Ticks  ######*/

// Ticks
CRTimeline.prototype.update_ticks = function() {
	// Remove old ticks
	this.tick_container.innerHTML = "";

	/// Set the starting tick to a rounded date/time (past the start date)
	///   ex. 2002 for a year scale, not 2001-02-03 4:56PM.789
	///   For consistency, need to count from previous high-level tick.

	// Get rounded down date, the minimum bound for the starting tick date
	let roundDownDate = new Date(this.view_start_date.valueOf());
	switch(this.tickUnitMs) {
		case MS_IN_Y:
			roundDownDate.setUTCFullYear(0);
		case MS_IN_M:
			roundDownDate.setUTCMonth(0);
		case MS_IN_D:
			roundDownDate.setUTCDate(1); // 1-31; the only one-based API
		case MS_IN_H:
			roundDownDate.setUTCHours(0);
		case MS_IN_MIN:
			roundDownDate.setUTCMinutes(0);
		case MS_IN_SEC:
			roundDownDate.setUTCSeconds(0);
		case 1:
			roundDownDate.setUTCMilliseconds(0);
	}

	// Number of units from roundDownDate to view_start_date
	let unitSpan = null;
	switch(this.tickUnitMs) {
		case MS_IN_Y:
			unitSpan = this.view_start_date.getUTCFullYear(); // minus 0
			break;
		case MS_IN_M:
			unitSpan = this.view_start_date.getUTCMonth();
			break;
		case MS_IN_D:
			unitSpan = this.view_start_date.getUTCDate();
			break;
		case MS_IN_H:
			unitSpan = this.view_start_date.getUTCHours();
			break;
		case MS_IN_MIN:
			unitSpan = this.view_start_date.getUTCMinutes();
			break;
		case MS_IN_SEC:
			unitSpan = this.view_start_date.getUTCSeconds();
			break;
		case 1:
			unitSpan = this.view_start_date.getUTCMilliseconds();
			break;
	}
	// Set starting tick date
	let curDate = new Date(roundDownDate);
	add_unit(curDate, this.tickUnit, unitSpan - (unitSpan % this.tickUnitNum));

	// Set ending tick date a bit past the viewEndDate to 
	// hide ticks popping in/out of existence.
	let maxTickDate = new Date(this.viewEndDate.valueOf());
	add_unit(maxTickDate, this.tickUnit, this.tickUnitNum);

	// Get required info for the scale label
	let legY, legM, legD, legH, legMin;
	switch(this.tickUnitMs) {
		// No scale label
		case MS_IN_M:
		case MS_IN_Y:
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
		if (roundDownDate.getUTCFullYear() < 0) {
			legEra = "short";
		}
		this.scale_label.innerHTML = roundDownDate.toLocaleDateString(undefined, {
			timeZone: "UTC",
			year: legY,
			month: legM,
			day: legD,
			hour: legH,
			minute: legMin,
			era: legEra
		});
	} else {
		this.scale_label.innerHTML = "";
	}

	// Draw ticks from left to right
	while (curDate.valueOf() < maxTickDate.valueOf()) {
		// For months and days, which have inconsistent number, check if 
		// spacing to next higher-unit tick is less than target spacing. If so, skip
		// the uniformly-spaced tick and go straight to the higher-unit tick
		// to maintin clean numbering.
		//   (That is, the next tick is either a uniformly spaced tick, or the next higher-level 
		//   tick if it's close enough, aka. <= the usual uniform spacing).
		if (this.tickUnitMs != MS_IN_Y) {
			let roundUpDate = new Date(curDate.valueOf());
			switch(this.tickUnitMs) {
				case MS_IN_M:
					roundUpDate.setUTCMonth(0)
					roundUpDate.setUTCFullYear(roundUpDate.getUTCFullYear() + 1);
					break;
				case MS_IN_D:
					roundUpDate.setUTCDate(1);
					roundUpDate.setUTCMonth(roundUpDate.getUTCMonth() + 1);
					break;
				case MS_IN_H:
					roundUpDate.setUTCHours(0);
					roundUpDate.setUTCDate(roundUpDate.getUTCDate() + 1);
					break;
				case MS_IN_MIN:
					roundUpDate.setUTCMinutes(0);
					roundUpDate.setUTCHours(roundUpDate.getUTCHours() + 1);
					break;
				case MS_IN_SEC:
					roundUpDate.setUTCSeconds(0);
					roundUpDate.setUTCMinutes(roundUpDate.getUTCMinutes() + 1);
					break;
				case 1:
					roundUpDate.setUTCMilliseconds(0);
					roundUpDate.setUTCSeconds(roundUpDate.getUTCSeconds() + 1);
					break;
			}
			let nextUniformDate = new Date(curDate.valueOf())
			add_unit(nextUniformDate, this.tickUnit, this.tickUnitNum);
			if (roundUpDate.valueOf() < nextUniformDate.valueOf()) {
				// Continue from higher-level tick instead, but before that:
				// We use a different, closer threshold to determine if we should also draw
				// the low-level tick (it looks better; no huge whitespace)
				let drawThresholdDate = new Date(curDate.valueOf())
				add_unit(drawThresholdDate, this.tickUnit, Math.ceil(this.tickUnitNum / 2));
				if (drawThresholdDate.valueOf() < roundUpDate.valueOf()) {
					this.draw_tick(curDate);
				}
				// Continue from higher-level tick instead
				curDate = roundUpDate;
			}

		}
		// Draw tick
		this.draw_tick(curDate);
		// Next tick
		add_unit(curDate, this.tickUnit, this.tickUnitNum);
	}
	// Draw events when finished
	this.update_events();
}

// Single tick
CRTimeline.prototype.draw_tick = function(curDate) {
	// Create tick HTML element
	let tick = document.createElement("div");
	tick.className = "tc-tick";
	tick.style.left = (curDate.valueOf() - this.view_start_date.valueOf()) * this.year_px / MS_IN_Y + "px";
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
		if (curDate.getUTCMilliseconds() != 0) { break LEVEL_UP; }
		level++;
		if (curDate.getUTCSeconds() != 0) { break LEVEL_UP; }
		level++;
		if (curDate.getUTCMinutes() != 0) { break LEVEL_UP; }
		level++;
		if (curDate.getUTCHours() != 0) { break LEVEL_UP; }
		level++;
		if (curDate.getUTCDate() != 1) { break LEVEL_UP; }
		level++;
		if (curDate.getUTCMonth() != 0) { break LEVEL_UP; }
		level++;
	}
	// Format date/time appropriately
	switch(level) {
		case 1: // millisecond
			label.innerHTML = this.tickFormatMs.format(curDate);
			break;
		case 2: // second
			label.innerHTML = this.tickFormatSec.format(curDate);
			break;
		case 3: // minute
			label.innerHTML = this.tickFormatMin.format(curDate);
			break;
		case 4: // hour
			label.innerHTML = this.tickFormatH.format(curDate);
			break;
		case 5: // day
			label.innerHTML = this.tickFormatD.format(curDate);
			break;
		case 6: // month
			label.innerHTML = this.tickFormatM.format(curDate);
			break;
		case 7: // year
			if (curDate.getFullYear() < 0) {
				label.style.whiteSpace = "nowrap";
				label.innerHTML = this.tickFormatYEra.format(curDate);
			} else {
				label.innerHTML = this.tickFormatY.format(curDate);
			}
			break;
	}
	// Attach to document
	tick.appendChild(label);
	this.tick_container.appendChild(tick);
}


/*######  Interaction  ######*/

// Scroll to zoom
CRTimeline.prototype.scroll_event = function(e) {
	// Zoom based on mouse position
	let rect = e.currentTarget.getBoundingClientRect();
	this.zoomOriginX = e.clientX - rect.left;
	// Calculate net scroll delta in between frames
	let deltaZoom = 1;
	if (e.deltaY <= 0) { // zoom in
		deltaZoom = (1 - this.zoom_multiplier*e.deltaY/1000);
	} else { // > 0; zoom out
		deltaZoom = 1 / (1 + this.zoom_multiplier*e.deltaY/1000);
	}
	this.totZoom *= deltaZoom;
	// Request accumulated scroll be handled on next frame, if not done so already (limits number of calls)
	if (this.queueScroll) {
		window.requestAnimationFrame((function() {
			// When it is time for next frame, browser will call zoom function and reset variables
			if (this.totZoom >= 1 && this.year_px >= this.year_px_max) {
				// Redundant check for max zoom, otherwise it will pan the timeline
			} else {
				this.zoom_in(this.zoomOriginX, this.year_px * this.totZoom);
			}
			this.totZoom = 1;
			this.queueScroll = true;
		}).bind(this));
		this.queueScroll = false;
	}
	// Prevent page zoom (whether ctrl held or not)
	e.preventDefault();
};
// Click and drag
CRTimeline.prototype.pan_start = function(e) {
	// Change cursor - grabbing
	this.cursor_cover.style.display = "block";
	// Initial cursor x pos
	this.pan_initial_mx = e.clientX;
	// Initial timeline date
	this.pan_initial_date = new Date(this.view_start_date.valueOf());
	// The remaining events are not localized (drag anywhere)
	this.this_pan_change = this.pan_change.bind(this);
	this.this_pan_end = this.pan_end.bind(this);
	window.addEventListener("mousemove", this.this_pan_change);
	window.addEventListener("mouseup", this.this_pan_end);
}
CRTimeline.prototype.pan_change = function(e) {
	let dateDelta = (this.pan_initial_mx - e.clientX) * MS_IN_Y / this.year_px;
	let newStart = this.pan_initial_date.valueOf() + dateDelta;
	if (newStart < this.minDate.valueOf()) {
		// reset pan origin for increased responsiveness at bounds
		this.pan_initial_mx = e.clientX;
		this.pan_initial_date = new Date(this.view_start_date.valueOf());
		// min bound reached
		newStart = this.minDate.valueOf();
	}
	this.set_start_date_impl(new Date(newStart));
	if (this.viewEndDate.valueOf() > this.maxDate.valueOf()) {
		// max bound reached
		this.set_end_date_impl(this.maxDate);
		// reset pan origin for increased responsiveness at bounds
		this.pan_initial_mx = e.clientX;
		this.pan_initial_date = new Date(this.view_start_date.valueOf());
	}
	this.update_ticks();
}
CRTimeline.prototype.pan_end = function(e) {
	// Remvoe the global events, reset state
	window.removeEventListener("mousemove", this.this_pan_change);
	window.removeEventListener("mouseup", this.this_pan_end);
	// Change cursor - not grabbing
	this.cursor_cover.style.display = "none";
}


/*######  Responsive Layout  ######*/

// Redraw on resize
CRTimeline.prototype.resize_event = function(entries) {
	this.viewWidth = this.tick_container.offsetWidth;
	this.viewEndDate = new Date(this.view_start_date.valueOf());
	let ms_to_end = this.viewWidth * MS_IN_Y / this.year_px;
	this.viewEndDate.setMilliseconds(this.view_start_date.getMilliseconds() + ms_to_end);
	this.update_ticks();
};


/*######  Draw Events  ######*/

CRTimeline.prototype.update_events = function() {
	// This is to get something on the screen; it will be rewritten.
	// Remove old events
	this.events_upper.innerHTML = "";
	// Add events in the viewable range
	for (let event of this.event_manager.ordered_events) {
		// Skip events outside the viewable range
		if (event.start_datetime.valueOf() < this.view_start_date.valueOf() ||
			event.start_datetime.valueOf() > this.viewEndDate.valueOf()) {
			continue;
		}

		// Get event info
		let visible_group = event.get_visible_group();
		let group_color = visible_group.getColor();

		// Create event HTML element
		let evt = document.createElement("div");
		evt.className = "tc-event";
		let eventLine = document.createElement("div");
		eventLine.className = "tc-event-line";
		evt.appendChild(eventLine);
		let label = document.createElement("div");
		label.className = "tc-event-label";
		evt.appendChild(label);
		let label_text = document.createElement("div");
		label.appendChild(label_text);

		/// Fill in the details
		// Position
		evt.style.left = (event.start_datetime.valueOf() - this.view_start_date.valueOf()) * this.year_px / MS_IN_Y + "px";
		// Title
		if (event.title) {
			label_text.innerHTML = event.title;
		} else {
			label_text.innerHTML = "&lt;Click to edit&gt;";
			label_text.style.color = "#AAAAAA";
		}
		// Group Style
		evt.style.borderColor = group_color;
		evt.style.backgroundColor = group_color;

		// Save event ID
		evt.eid = event.getId();
		// On select, show details
		if (EDITOR) {
			label.addEventListener("mousedown", (function(e) {
				this.selected_event = evt.eid;
				show_details(evt.eid);            // TODO
				// Prevent dragging timeline when event clicked
				e.stopPropagation();
			}).bind(this));
		}
		// Attach to document
		this.events_upper.appendChild(evt);
		// Cosmetic - remove space to right of wrapped text
		shrink_to_text(label_text);
	}
}


} // Scope end


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
 * 		<div>Event Title</div>
 * 	</div>
 * </div>
 * ```
 */
 