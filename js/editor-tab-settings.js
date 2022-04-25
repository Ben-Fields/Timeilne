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
