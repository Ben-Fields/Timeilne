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
