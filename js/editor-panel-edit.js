/*######  Tab Switching  ######*/

let selectEditTab = function (evt, tabID) {
	// e.currentTarget always gives the intended target element (on which the listener is attached).
	// e.target gives the exact child element that is clicked.
	tablinks = evt.currentTarget.parentNode.getElementsByClassName("panel-title");
	for (i = 0; i < tablinks.length; i++) {
	  tablinks[i].className = "panel-title panel-title-inactive";
	  evt.currentTarget.className;
	}

	tabcontents = document.getElementsByClassName("tabcontent");
	for (i = 0; i < tabcontents.length; i++) {
	  tabcontents[i].style.display = "none";
	}

	evt.currentTarget.className = evt.currentTarget.className.replace(" panel-title-inactive", "");
	document.getElementById(tabID).style.display = "block";
}
