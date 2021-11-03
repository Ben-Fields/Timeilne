function delete_group()
{
	var element = document.querySelector("#group-section > ul > li.active"); 
	//console.log(element);
	element.style.display = "none";
}