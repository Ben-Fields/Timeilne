suggestions_list = ["Sample format can be downloaded using the Format button in the Files Tab", "Mouse Left can be used to navigate through the timeline", "Mouse Scroll can be used to zoom-in and out on the timeline"]

function changeInfo()
{
	setInterval(function()
	{ 
		var randomNumber = Math.floor(Math.random() * suggestions_list.length);
		document.getElementById("info_messages").innerHTML = suggestions_list[randomNumber];
	}, 3000);
}
