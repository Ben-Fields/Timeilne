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
	mouse_move_evt = resize_x_change.bind(null, bar_side)
	mouse_up_evt = resize_end.bind(null, bar_side)
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
			active_resize_bar.offsetWidth
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
			active_resize_bar.offsetHeight
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
