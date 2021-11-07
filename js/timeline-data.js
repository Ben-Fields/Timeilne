const START_DATE_FIELD = 'Start Date'
const START_TIME_FIELD = 'Start Time'
const EVENT_TITLE = 'Event Title'

const DATETIME_LOCALES = 'en-US'
const DATE_FORMAT_OPTION = { year: 'numeric', month: '2-digit', day: '2-digit' };
const TIME_FOMRAT_OPTION = {hour: '2-digit', minute: '2-digit', hour12: false};

var update_time_by_string = function(date, val){
    // val acceptable format: '13:00', '13:33:10'
    let arr = val.split(":").map(function(ele){
        val = Number(ele);
        if(isNaN(val)){
            throw 'wrong input format, acceptable format: 13:00, 13:33:10';
        }
        return val;
    })
    date.setHours(...arr);
}

var update_date_by_string = function(date, val){
    new_date = new Date(Date.parse(val));
    date.setFullYear(new_date.getFullYear());
    date.setDate(new_date.getDate());
    date.setMonth(new_date.getMonth());
}


class TimelineEvent{
    #eid;
    constructor(eid){
        this.#eid = eid;
    }

    getId(){
        return this.#eid;
    }
}

var is_event_valid = function(event){
    // check only whether the field exist
    if(!event[START_DATE_FIELD] || !event[EVENT_TITLE]){
        console.error("event missing start date or title");
        return false;
    }
    return true;
}

var parse_date = function(event){
    if(!event[START_TIME_FIELD]){
        return Date.parse(event[START_DATE_FIELD])
    }
    return Date.parse(event[START_DATE_FIELD] + " " + event[START_TIME_FIELD])
}

class EventManager{
    
    event_map = new Map(); // any event created
    valid_eids = new Set(); // set of valid events
    ordered_events = []; // ordered list
    id_incremental = 0;

    #cache_start_index=-1;
    #cache_end_index=-1;

    // create a new event object
    create_event(){
        let event = new TimelineEvent(this.id_incremental);
        this.id_incremental += 1;

        this.event_map.set(event.getId(), event);
        return event;
    }

    is_event_valid(eid){
        return this.valid_eids.has(eid);
    }

    get_event_by_id(eid){
        return this.event_map.get(eid);
    }

    // add event into a sorted list
    add_to_valid_event(event, resort=true){
        if(!is_event_valid(event)){
            return false;
        }
        return this.add_to_valid_event_by_id( event.getId(), resort);
    }

    add_to_valid_event_by_id(eid, resort=true){
        if(!this.event_map.has(eid)){
            return false;
        }
        this.valid_eids.add(eid);
        this.ordered_events.push( this.get_event_by_id(eid));

        if(resort){
            this.sort_events();
        }
        return true;
    }

    // sort the stored ordered_events
    sort_events(){
        this.ordered_events.sort(function (a, b) {
            let date_a = parse_date(a);
            let date_b = parse_date(b);
    
            if (date_a > date_b) {
                return 1;
            } else if (date_a < date_b) {
                return -1;
            } else {
                if (a['Event Title'] > b['Event Title']) {
                    return 1;
                } else{
                    return -1;
                }
            }
        })
    }

    delete_event_by_id(eid){
        if(!this.event_map.has(eid)){
            return false;
        }

        if(this.valid_eids.has(eid)){
            this.valid_eids.delete(eid);
            this.ordered_events = this.ordered_events.filter(e => e.getId !== eid);
        }

        this.event_map.delete(eid);
        return true;
    }

    load_timeline_events(event_list){ // load imported event list to EventManager
        let count = 0;
        event_list.forEach(
            ele => {
                let tar = this.create_event();
                Object.assign(tar, ele);
                if(this.add_to_valid_event(tar, false)){
                    count += 1;
                }
            }
        )
        console.log("loaded record: " + count);
        this.sort_events();
        console.log("sorting");
        
        return count;
    }
}

