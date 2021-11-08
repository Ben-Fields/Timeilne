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

function add_group()
{
	var grp_name = document.getElementById("group-name").value;
	console.log(grp_name);
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
	console.log(text);
	document.getElementById("grp_color").disabled = false;
	document.getElementById("font_size").disabled = false;
	document.getElementById("save_button").style.display = "block";
	document.getElementById("grp_name").style.display = "block";
	document.getElementById("grp_name_input").value = text;
}