function delete_group()
{
	var element = document.querySelector("#group-section > ul > li.active"); 
	element.style.display = "none";
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