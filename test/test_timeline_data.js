em = new EventManager();

event1 = em.create_event();
console.assert( em.get_event_by_id(event1.getId()), "fail to get created event");

event2 = em.create_event();
event2['Start Date'] = '10/02/1943'
event2['Event Title'] = 'Test create event'
em.add_to_valid_event(event2);

var test_data01 = 'Event Id,Event Title,Long Title,Start Date,Start Time,End Date,End Time,Description,Visual Priority,Groups,Visible Groups,Click Action,Anchor Tag,Image\r\n1,Event 1,An event in history,09/10/1886,9:53,,,,,Act,Act,,,\r\n2,Event 2,Event #2,6/4/1975,,,,,,Government,Government,,,\r\n3,Ranged Event,First Ranged Event,04/05/1873,,06/04/1876,,,,War,War,,,\r\n';
loaded_events = $.csv.toObjects(test_data01);
console.assert( em.load_timeline_events(loaded_events) == 3, "fail");

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