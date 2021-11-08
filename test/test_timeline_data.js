test_em = new EventManager();

// create event but not add to list
event1 = test_em.create_event();
console.assert( test_em.get_event_by_id(event1.getId()), "fail to get created event");

// create event in run time
event2 = test_em.create_event();
event2.update_start_date('10/02/1943');
event2.update_title('Test create event');
eid2 = event2.getId();  // id might need to store with object in DOM

// load batch event objects
var test_data01 = 'Event Id,Event Title,Long Title,Start Date,Start Time,End Date,End Time,Description,Visual Priority,Groups,Visible Groups,Click Action,Anchor Tag,Image\r\n1,Event 1,An event in history,09/10/1886,9:53,,,,,Act,Act,,,\r\n2,Event 2,Event #2,6/4/1975,,,,,,Government,Government,,,\r\n3,Ranged Event,First Ranged Event,04/05/1873,,06/04/1876,,,,War,War,,,\r\n';
loaded_events = $.csv.toObjects(test_data01);
console.assert( test_em.load_timeline_events(loaded_events) == 3, "fail");

// access stored event by id
event_x = test_em.get_event_by_id(eid2);
console.assert(event_x.start_date == event2.start_date);

// update key values (datetime and title) through API
event_x.update_title("UPDATED title");
console.assert(event2.title == "UPDATED title");

// print sorted list
console.log("print out element in list");
test_em.ordered_events.forEach(ele => {
    console.log( print_date(ele.start_datetime) + "-" + ele.title);
});


////////////////////
// test date time string in/out format
test_date_input_formats = ['11/07/2021 1:00:00 PM',
                           '11/07/2021 13:00', 
                           '2021-11-07 13:00']

test_date_input_formats.forEach(ele => {
    cur = new Date(Date.parse(ele));
    console.assert(print_date(cur) == '11/07/2021');
    console.assert(cur.toLocaleTimeString(DATETIME_LOCALES, TIME_FOMRAT_OPTION) == '13:00');
})

// test update_date_by_string
cur = new Date(Date.parse('2021-11-07 13:00'));
update_date_by_string( cur, "2023-09-20");
console.assert(cur.getFullYear()==2023 && cur.getHours()==13);

// test update_time_by_string
cur = new Date(Date.parse('11/07/2021 1:12:00 PM'))
update_time_by_string(cur, "05:23");
console.assert(cur.getFullYear()==2021 && cur.getHours()==5);
