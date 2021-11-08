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
		element.style.display = "none";	
	}	
}

function add_group(grp_name)
{
	/*var grp_name = document.getElementById("group-name").value;
	console.log(grp_name);*/
	const text_node = document.createTextNode(grp_name);
	var parent_ul = document.querySelector("#group-section > ul");
	const li = document.createElement("li");
	const a = document.createElement("a")
	a.setAttribute("data-toggle", "pill");
	a.appendChild(text_node);
	li.appendChild(a);
	parent_ul.appendChild(li);
}

function edit_group()
{
	var text = document.querySelector("#group-section > ul > li.active > a").innerHTML;
	document.getElementById("grp_color").disabled = false;
	document.getElementById("font_size").disabled = false;
	document.getElementById("save_button").style.display = "block";
	document.getElementById("grp_name").style.display = "block";
	document.getElementById("grp_name_input").value = text;
}

function export_timeline()
{
	console.log(event_manager);
	delimiter = ",";
	fileName = "File1";
	arrayHeader = ["Event Id", "Event Title", "Long Title", "Start Date", "Start Time", "End Date", "End Time", "Description", "Visual Priority", "Groups", "Visible Groups", "Click Action","Anchor Tag", "Image"];
	arrayData = event_manager.ordered_events;
	console.log(arrayData);
	let header = arrayHeader.join(delimiter) + '\n';
    let csv = header;
    arrayData.forEach( obj => {
        let row = [];
        var start_date = (obj["start_datetime"].getMonth() + 1).toString() + "/" + obj["start_datetime"].getDate() + "/" + obj["start_datetime"].getFullYear();
        var start_time = obj["start_datetime"].getHours() + ":" + obj["start_datetime"].getMinutes() + ":" + obj["start_datetime"].getSeconds();
        var end_date = (obj["end_datetime"].getMonth() + 1).toString() + "/" + obj["end_datetime"].getDate() + "/" + obj["end_datetime"].getFullYear();
        var end_time = obj["end_datetime"].getHours() + ":" + obj["end_datetime"].getMinutes() + ":" + obj["end_datetime"].getSeconds();
        row.push(obj["Event Id"]);
        row.push(obj["title"]);
        row.push(obj["Long Title"]);
        row.push(start_date);
        row.push(start_time);
        row.push(end_date);
        row.push(end_time);
        row.push(obj["Description"]);
        row.push(obj["Visual Priority"]);
        row.push(obj["Groups"]);
        row.push(obj["Visible Groups"]);
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

