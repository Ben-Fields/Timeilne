/*######  Rich Text - Description Field  ######*/
let desc_box = document.getElementById("field-description");
let richtext_cover = document.getElementById("richtext-cover");
let richtext_editor = document.getElementById("richtext-editor");
let done_btn = document.getElementById("richtext-done");

var open_richtext_editor = function() {
	// Clicking description box opens rich text editor.
	richtext_cover.style.display = "flex";
}
desc_box.addEventListener("click", open_richtext_editor);

var close_richtext_editor = function() {
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
