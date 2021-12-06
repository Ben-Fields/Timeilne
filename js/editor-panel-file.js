
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
