document.getElementById("details-delete").addEventListener("click", function() {
	event_manager.delete_event_by_id(selected_event);
	update_events();
});