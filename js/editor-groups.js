// var text = document.querySelector("#group-section > ul > li.active > a").innerHTML;
// if (text != "All")
// {
// 	g = group_manager.get_group_by_name(text);
// 	console.log(g.getColor());
// 	document.getElementById("grp_color").value = g.getColor();
// 	document.getElementById("font_size").value = g.getFontSize();
// }

function dynamicChanges(e)
{
	// console.log(e);
	group_name = e.querySelector("a").innerHTML;
	g = group_manager.get_group_by_name(group_name);
	// console.log(g.getColor());
	document.getElementById("grp_color").value = g.getColor();
	document.getElementById("font_size").value = g.getFontSize();

}

function delete_group()
{
	var element = document.querySelector("#group-section > ul > li.active");
	var name = element.querySelector("a").innerHTML;
	if(name == "All")
	{
		alert("This cannot be deleted.")
	}
	else
	{
		if( group_manager.delete_group_by_name(name)){
			element.style.display = "none";	
		}
	}
}

function add_group(evt, grp_name){
	group_manager.create_or_get_group_by_name(grp_name, true);
	document.getElementById("group-name").value = "";
}


// function add_group(grp_name)
// {
// 	/*var grp_name = document.getElementById("group-name").value;
// 	console.log(grp_name);*/
// 	var randomColor = Math.floor(Math.random()*16777215).toString(16);
// 	colorCode = "#" + randomColor;
// 	console.log(colorCode);
// 	g = group_manager.create_or_get_group_by_name(grp_name);
// 	g.setColor(colorCode);
// 	g.setFontSize("14");
// 	const text_node = document.createTextNode(grp_name);
// 	var parent_ul = document.querySelector("#group-section > ul");
// 	const li = document.createElement("li");
// 	li.setAttribute("onclick", "dynamicChanges(this);");
// 	const a = document.createElement("a")
// 	a.setAttribute("data-toggle", "pill");
// 	a.appendChild(text_node);
// 	li.appendChild(a);
// 	parent_ul.appendChild(li);
// 	add_groups_to_dropdown(grp_name);
// 	console.log(group_manager.groups);
// }

// function add_groups_to_dropdown(name)
// {
// 	var dropdown = document.getElementById("field-groups");
// 	var e = document.createElement("option");
// 	const text_node = document.createTextNode(name);
// 	e.setAttribute("value", name);
// 	e.appendChild(text_node);
// 	dropdown.appendChild(e);
// }

function edit_group()
{
	var text = document.querySelector("#group-section > ul > li.active > a").innerHTML;
	document.getElementById("grp_color").disabled = false;
	document.getElementById("font_size").disabled = false;
	document.getElementById("save_button").style.display = "block";
	document.getElementById("grp_name").style.display = "block";
	document.getElementById("grp_name_input").value = text;
}

function save_group_changes()
{
	var t = document.querySelector("#group-section > ul > li.active > a").innerHTML;
	g = group_manager.get_group_by_name(t);

	g.setFontSize(document.getElementById("font_size").value + "");
	g.setColor(document.getElementById("grp_color").value + "");
	
	document.getElementById("save_button").style.display = "none";
	document.getElementById("grp_name").style.display = "none";
	document.getElementById("grp_color").disabled = true;
	document.getElementById("font_size").disabled = true;
	update_ticks();
	/*g.SetColor(document.getElementById("grp_color").value);
	g.SetFontSize(document.getElementById("font_size").value);*/
}


function export_timeline()
{
	// console.log(event_manager);
	//console.log(group_manager.groups);

	/*group_manager.groups.forEach(o=>{

		add_group(o.get_name())
	});*/

	delimiter = ",";
	fileName = "File1";
	arrayHeader = ["Event Title", "Long Title", "Start Date", "Start Time", "End Date", "End Time", "Description", "Visual Priority", "Groups", "Visible Groups", "Click Action","Anchor Tag", "Image"];
	arrayData = event_manager.ordered_events;
	// console.log(arrayData);
	let header = arrayHeader.join(delimiter) + '\n';
    let csv = header;
    arrayData.forEach( obj => {
        let row = [];
		let start_date;
		if(obj.flag_start_date_init){
			start_date = (obj["start_datetime"].getMonth() + 1).toString() + "/" + obj["start_datetime"].getDate() + "/" + obj["start_datetime"].getFullYear();	
		}

		let start_time;
		if(obj.flag_start_time_init){
			start_time = obj["start_datetime"].getHours() + ":" + obj["start_datetime"].getMinutes() + ":" + obj["start_datetime"].getSeconds();
		}

		let end_date;
		if(obj.flag_end_date_init){
			end_date = (obj["end_datetime"].getMonth() + 1).toString() + "/" + obj["end_datetime"].getDate() + "/" + obj["end_datetime"].getFullYear();
		}

		let end_time;
		if(obj.flag_end_time_init){
			end_time = obj["end_datetime"].getHours() + ":" + obj["end_datetime"].getMinutes() + ":" + obj["end_datetime"].getSeconds();
		}

		let groups = obj.get_group_name_list().filter(e=> e!=DEFAULT_GROUP_NAME).join(';');
		let visible_group = obj.get_visible_group().get_name();
		if(visible_group == DEFAULT_GROUP_NAME){
			visible_group = "";
		}

        row.push(obj["title"]);
        row.push(obj["Long Title"]);
        row.push(start_date);
        row.push(start_time);
        row.push(end_date);
        row.push(end_time);
        row.push(obj["Description"]);
        row.push(obj["Visual Priority"]);
        row.push(groups);
        row.push(visible_group);
        row.push(obj["Click Action"]);
        row.push(obj["Anchor Tag"]);
        row.push(obj["Image"]);

        csv += row.join(delimiter)+"\n";
    });

    let csvData = new Blob([csv], { type: 'text/csv' });  
    let csvUrl = URL.createObjectURL(csvData);

    let hiddenElement = document.createElement('a');
    hiddenElement.href = csvUrl;
    hiddenElement.target = '_blank';
    hiddenElement.download = fileName + '.csv';
    hiddenElement.click();
}

function exportFormat()
{
	delimiter = ",";
	fileName = "Sample Timeline";
	arrayHeader = ["Event Title", "Long Title", "Start Date", "Start Time", "End Date", "End Time", "Description", "Visual Priority", "Groups", "Visible Groups", "Click Action","Anchor Tag", "Image"];

	let header = arrayHeader.join(delimiter) + '\n';
	let csv = header;
	let csvData = new Blob([csv], { type: 'text/csv' });  
    let csvUrl = URL.createObjectURL(csvData);

    let hiddenElement = document.createElement('a');
    hiddenElement.href = csvUrl;
    hiddenElement.target = '_blank';
    hiddenElement.download = fileName + '.csv';
    hiddenElement.click();

}


// Temporarily disabled during development
// function leavePage() {
//   return "Are you sure you want to leave? Your changes are not saved yet.";
// }
// window.addEventListener('beforeunload', (event) => {
// 	event.preventDefault();
//   	event.returnValue = `Are you sure you want to leave?`;
// });

suggestions_list = ["Sample format can be downloaded using the Format button in the Files Tab", "Mouse Left can be used to navigate through the timeline", "Mouse Scroll can be used to zoom-in and out on the timeline"]

function changeInfo()
{
	setInterval(function()
	{ 
		var randomNumber = Math.floor(Math.random() * suggestions_list.length);
		document.getElementById("info_messages").innerHTML = suggestions_list[randomNumber];
	}, 3000);
}
