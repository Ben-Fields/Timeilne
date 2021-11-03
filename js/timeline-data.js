
var test_data01 = 'Title,StartDate\r\nHello,1/1/2000\r\nEvent2,1/2/2000\r\n';
var test_data02 = 'Title,StartDate\r\nEvent21,1/2/2000\r\nEvent2,1/2/1900\r\n';

var timeline_events = [];

// var load_csv = function () {
//     let reader = new FileReader();
//     reader.readAsText(document.querySelector('input').files[0]);
//     console.log(reader.result);
//     cur_events = $.csv.toObjects(reader.result);
// }

var load_csv_text = function(csv_text){
    add_to_timeline_events( $.csv.toObjects(csv_text));
}

var add_to_timeline_events = function(events){
    timeline_events = timeline_events.concat(events);
    sort_timeline_events_by_startdate();
}

var sort_timeline_events_by_startdate = function(){
    timeline_events.sort(function (a, b) {
        let date_a = Date.parse(a.StartDate);
        let date_b = Date.parse(b.StartDate);
    
        if (date_a > date_b) {
            return 1;
        } else if (date_a < date_b) {
            return -1;
        } else {
            if (a.Title > b.Title) {
                return 1;
            } else if (a.Title < b.Title) {
                return -1;
            } else {
                return 0;
            }
        }
    })    
}
