var em = new EventManager();

// create event but not add to list
event1 = em.create_event();
console.assert( em.get_event_by_id(event1.getId()), "fail to get created event");

// manual create event
event2 = em.create_event();
event2['Start Date'] = '10/02/1943'
event2['Event Title'] = 'Test create event'
em.add_to_valid_event(event2);

// load batch event objects
var test_data01 = 'Event Id,Event Title,Long Title,Start Date,Start Time,End Date,End Time,Description,Visual Priority,Groups,Visible Groups,Click Action,Anchor Tag,Image\r\n1,Event 1,An event in history,09/10/1886,9:53,,,,,Act,Act,,,\r\n2,Event 2,Event #2,6/4/1975,,,,,,Government,Government,,,\r\n3,Ranged Event,First Ranged Event,04/05/1873,,06/04/1876,,,,War,War,,,\r\n';
loaded_events = $.csv.toObjects(test_data01);
console.assert( em.load_timeline_events(loaded_events) == 3, "fail");

// create another event
event3 = em.create_event();
event3['Start Date'] = '01/02/1945'
event3['Event Title'] = 'Test create event 3'
em.add_to_valid_event(event3);
var eid3 = event3.getId();

// access event 
em.get_event_by_id(0)

em.ordered_events.forEach(element => {
    console.log( element[START_DATE_FIELD] + "-" + element[EVENT_TITLE]);
});

// update key value
ev3 = em.get_event_by_id(eid3);
ev3['Start Date'] = '01/02/2020';
em.sort_events();

console.log("after key update")
em.ordered_events.forEach(element => {
    console.log( element[START_DATE_FIELD] + "-" + element[EVENT_TITLE]);
});



////////////////////
// test date time string in/out format
test_date_input_formats = ['11/07/2021 1:00:00 PM',
                           '11/07/2021 13:00', 
                           '2021-11-07 13:00']

test_date_input_formats.forEach(ele => {
    cur = new Date(Date.parse(ele));
    console.assert(cur.toLocaleDateString(DATETIME_LOCALES, DATE_FORMAT_OPTION) == '11/07/2021');
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
