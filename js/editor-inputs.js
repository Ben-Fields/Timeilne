/*######  Input Validation  ######*/
var roundValue = function(e, decimal_place=1) {
	// The decimal place value is 10, 100, ...
	if (isNaN(parseFloat(e.value))) {
		e.value = e.defaultValue;
		return;
	}
	// Constrain and round
	e.value = Math.min(
		Math.max(
			Math.round(e.value*decimal_place)/decimal_place,
			e.min
		),
		e.max
	);
}

var validateZoom = function(e) {
	e.value = Math.min(
		Math.max(
			e.value,
			MIN_ZOOM
		),
		MAX_ZOOM
	);
}


/*######  Color Inputs  ######*/
// Seamlessly replaces all <input type=color> browser-dependent popups with this one.
let picker_inputs = document.querySelectorAll("input[type=color]");
for (let picker_input of picker_inputs) {
	const pickr = Pickr.create({
		el: picker_input,
		theme: 'monolith',
		lockOpacity: true,
		comparison: false,
		useAsButton: true,
		components: {
			preview: true,
			hue: true,
			opacity: false,
			interaction: {
				input: true
			}
		}
	}).on('init', instance => {
		// No swatches, remove extra space
		instance._root.swatches.style.display = "none";
		// Select all input text on click
		instance._root.interaction.result.onfocus = function() {
			this.select();
		}
		// Save and close on enter
		window.addEventListener("keydown", function(e) {
			// Also redundant esc check, for when hex input focused
			if (e.keyCode == 13 || e.keyCode == 27) {
				instance.hide();
			}
		});
		instance._root.button.onkeydown = function(e) {
			// Hitting enter on input field (input type=color) toggles 
			if (e.keyCode == 13 && instance.isOpen()) {
				instance.hide();
				e.preventDefault();
			}
		}
		// Prevent browser-specific picker from opening
		instance._root.button.onclick = function(e) {
			e.preventDefault();
		}
		// Take default value from input field (input type=color)
		instance.setColor(instance._root.button.value);
	}).on('hide', instance => {
		// Save color on close
		instance.applyColor();
		// Update color of input field (input type=color)
		instance._root.button.value = instance.getColor().toHEXA();
		instance._root.button.dispatchEvent(new Event("change"));
	}).on('changestop', (source, instance) => {
		// Make interaction with palette change focus
		// (By default, can tab to focus but not click, unlike other elements)
		// (Prev. color and input/result box would stay focused, eat user input)
		if (source =="slider") {
			instance._root.palette.palette.focus();
		}
		// Update color of input field (input type=color)
		instance._root.button.value = instance.getColor().toHEXA();
		instance._root.button.dispatchEvent(new Event("change"));
	}).on('cancel', instance => {
		// Update color of input field (input type=color)
		instance._root.button.value = instance.getColor().toHEXA();
		instance._root.button.dispatchEvent(new Event("change"));
	}).on('show', (color, instance) => {
		// On open, take color from input field (input type=color) in 
		// case of programmatic changes
		instance.setColor(instance._root.button.value);
	});
}
