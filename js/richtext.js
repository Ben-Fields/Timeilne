/*######  Rich Text - Description Field  ######*/
let desc_box = document.getElementById("field-description");
let richtext_cover = document.getElementById("richtext-cover");
let richtext_editor = document.getElementById("richtext-editor");
let done_btn = document.getElementById("richtext-done");
let richtext_content = null;

var open_richtext_editor = function() {
	// Load content
	richtext_content = document.getElementsByClassName("ql-editor")[0];
	richtext_content.innerHTML = desc_box.value;
	// Clicking description box opens rich text editor.
	richtext_cover.style.display = "flex";
	desc_box.blur();
}
desc_box.addEventListener("click", open_richtext_editor);

var close_richtext_editor = function() {
	// Save content
	desc_box.value = richtext_content.innerHTML;
	if (desc_box.onchange) { desc_box.onchange(); }
	// Clicking "Done" button closes rich text editor.
	richtext_cover.style.display = "none";
}
var close_richtext_editor_key = function(e) {
	if (e.keyCode == 27) {
		// Escape key
		close_richtext_editor();
	}
}
done_btn.addEventListener("click", close_richtext_editor);
window.addEventListener("keydown", close_richtext_editor_key);


/*######  Rich Text Editor  ######*/
var quill = new Quill('#richtext-editor', {
	theme: 'snow'
});
