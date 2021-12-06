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
	timeline.update_events();
	/*g.SetColor(document.getElementById("grp_color").value);
	g.SetFontSize(document.getElementById("font_size").value);*/
}
