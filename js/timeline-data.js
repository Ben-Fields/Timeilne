const START_DATE_FIELD = 'Start Date'
const START_TIME_FIELD = 'Start Time'
const END_DATE_FIELD = 'End Date'
const END_TIME_FIELD = 'End Time'
const EVENT_TITLE = 'Event Title'
const KEY_FIELDS = [START_DATE_FIELD, START_TIME_FIELD, END_DATE_FIELD, END_TIME_FIELD, EVENT_TITLE]

const event_manager = new EventManager();

const INIT_DATE_VALUE = -1000000000000000;
const INIT_DATE = new Date(INIT_DATE_VALUE);
const DATETIME_LOCALES = 'en-US';
const DATE_FORMAT_OPTION = { year: 'numeric', month: '2-digit', day: '2-digit' };
const TIME_FOMRAT_OPTION = { hour: '2-digit', minute: '2-digit', hour12: false };


var update_time_by_string = function (date, val) {
    // val acceptable format: '13:00', '13:33:10'
    let arr = val.split(":").map(function (ele) {
        val = Number(ele);
        if (isNaN(val)) {
            throw 'wrong input format, acceptable format: 13:00, 13:33:10';
        }
        return val;
    })
    date.setHours(...arr);
}

var update_date_by_string = function (date, val) {
    new_date = new Date(Date.parse(val));
    date.setFullYear(new_date.getFullYear());
    date.setMonth(new_date.getMonth());
    date.setDate(new_date.getDate());
}

var print_date = function (date) {
    if (date <= INIT_DATE) {
        return "invalid date"
    }
    return date.toLocaleDateString(DATETIME_LOCALES, DATE_FORMAT_OPTION)
}

var is_event_valid = function (event) {
    if (!event.title || event.start_datetime <= INIT_DATE) {
        console.error("event missing start date or title");
        return false;
    }
    return true;
}

class TimelineEvent {
    #eid;
    #em;
    title;
    start_datetime;
    end_datetime;

    constructor(eid, em) {
        this.#eid = eid;
        this.#em = em;
        this.title = "";
        this.start_datetime = new Date(INIT_DATE_VALUE);
        this.end_datetime = new Date(INIT_DATE_VALUE);
    }

    getId() {
        return this.#eid;
    }

    update_start_date(val, resort = true) {
        update_date_by_string(this.start_datetime, val);
        if (resort) {
            this.#em.sort_events();
        }
    }

    update_start_time(val, resort = true) {
        update_time_by_string(this.start_datetime, val);
        if (resort) {
            this.#em.sort_events();
        }
    }

    update_title(title, resort = true) {
        this.title = title;
        if (resort) {
            this.#em.sort_events();
        }
    }

    update_end_date(val) {
        update_date_by_string(this.end_datetime, val);
    }

    update_end_time(val) {
        update_time_by_string(this.end_datetime, val);
    }
}

class EventManager {

    event_map = new Map(); // any event created
    ordered_events = []; // ordered list
    id_incremental = 0;

    // create a new event object
    create_event() {
        let event = new TimelineEvent(this.id_incremental, this);
        this.id_incremental += 1;

        this.event_map.set(event.getId(), event);
        this.ordered_events.unshift(event);

        return event;
    }

    get_event_by_id(eid) {
        return this.event_map.get(eid);
    }

    // sort the stored ordered_events
    sort_events() {
        this.ordered_events.sort(function (a, b) {
            if (a.start_datetime > b.start_datetime) {
                return 1;
            } else if (a.start_datetime < b.start_datetime) {
                return -1;
            } else {
                if (a.title > b.title) {
                    return 1;
                } else {
                    return -1;
                }
            }
        })
    }

    delete_event_by_id(eid) {
        if (!this.event_map.has(eid)) {
            return false;
        }
        this.ordered_events = this.ordered_events.filter(e => e.getId !== eid);
        this.event_map.delete(eid);
        return true;
    }

    load_timeline_events(event_list) { // load imported event list to EventManager
        let total = 0;
        let valid_count = 0;

        event_list.forEach(
            ele => {
                let tar = this.create_event();
                Object.assign(tar, ele);

                let start_date = tar[START_DATE_FIELD];
                if (start_date) {
                    tar.update_start_date(start_date, false);
                }

                let start_time = tar[START_TIME_FIELD];
                if (start_time) {
                    tar.update_start_time(start_time, false);
                }

                let end_date = tar[END_DATE_FIELD];
                if (end_date) {
                    tar.update_end_date(end_date);
                }

                let end_time = tar[END_TIME_FIELD];
                if (end_time) {
                    tar.update_end_time(end_time, false);
                }

                let title = tar[EVENT_TITLE];
                if (title) {
                    tar.update_title(title);
                }

                KEY_FIELDS.forEach(key_field => {
                    delete tar[key_field];
                })

                if (is_event_valid(tar, false)) {
                    valid_count += 1;
                }
                total += 1;
            }
        )

        console.log("total: " + total + " rows, loaded record: " + valid_count);
        this.sort_events();
        return valid_count;
    }
}

