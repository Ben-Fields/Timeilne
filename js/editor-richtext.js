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
