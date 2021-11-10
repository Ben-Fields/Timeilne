const START_DATE_FIELD = 'Start Date'
const START_TIME_FIELD = 'Start Time'
const END_DATE_FIELD = 'End Date'
const END_TIME_FIELD = 'End Time'
const EVENT_TITLE = 'Event Title'
const GROUP_FIELD = 'Groups'
const VISIABLE_GROUP = 'Visible Groups'
const KEY_FIELDS = [START_DATE_FIELD, START_TIME_FIELD, END_DATE_FIELD, END_TIME_FIELD, EVENT_TITLE, GROUP_FIELD, VISIABLE_GROUP]

const DEFAULT_GROUP_NAME = 'All'
const DEFAULT_GROUP_COLOR = 'black'
const DEFAULT_GROUP_FONTSIZE = '14'

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
    if (date.getFullYear() == INIT_DATE.getFullYear()) {
        return "invalid date"
    }
    return date.toLocaleDateString(DATETIME_LOCALES, DATE_FORMAT_OPTION);
}

var print_time = function(datetime){
    return datetime.toLocaleTimeString(DATETIME_LOCALES, TIME_FOMRAT_OPTION);
}

var is_event_valid = function (event) {
    if (!event.title || !event.flag_start_date_init) {
        console.warn("event missing start date or title");
        return false;
    }
    return true;
}

class GroupElement {
    #gid;
    #gm;
    #name;
    color;
    fontsize;
    linked_events = new Set();

    constructor(gm, gid, name) {
        this.#gm = gm;
        this.#gid = gid;
        this.#name = name;
    }

    get_name() {
        return this.#name;
    }

    rename(new_name) {
        if (this.#name == new_name) {
            return false;   // same name does not change
        }
        if (this.#gm.get_group_by_name(new_name)) {
            console.error("group name:" + new_name + " existed.");
            return false;
        }
        this.#name = new_name;
    }

    getId() {
        return this.#gid;
    }

    get_linked_event_count() {
        return this.linked_events.size;
    }

    is_event_in_group(event) {
        return this.linked_events.has(event);
    }

    add_event(event) {
        if (!this.linked_events.has(event)) {
            this.linked_events.add(event);
            event.add_into_group(this);
        }
    }

    remove_event(event) {
        if (this.linked_events.delete(event)) {
            event.remove_from_group(this);
        }
    }

    clear_group_data() {
        for (const evt of this.linked_events.values()) {
            this.remove_event(evt);
        }
    }

    setColor(color) {
        this.color = color;
    }

    setFontSize(size) {
        this.fontsize = size;
    }

    getColor() {
        return this.color;
    }

    getFontSize() {
        return this.fontsize;
    }
}

class GroupManager {
    #id_incremental = 0;
    groups = new Map(); // key: id, value: groupElement

    constructor(){
        let default_group = this.create_or_get_group_by_name(DEFAULT_GROUP_NAME);
        default_group.setColor(DEFAULT_GROUP_COLOR);
        default_group.setFontSize(DEFAULT_GROUP_FONTSIZE);
    }

    get_default_group(){
        return this.get_group_by_name(DEFAULT_GROUP_NAME);
    }

    get_group_name_list() {
        return Array.from(this.groups.values()).map(function (ele) { return ele.get_name() })
    }

    get_group_by_name(name) {
        // check name existed return existed
        for (const gruupElement of this.groups.values()) {
            if (name == gruupElement.get_name()) {
                return gruupElement;
            }
        }
    }

    create_or_get_group_by_name(name, warn = false) {
        let g = this.get_group_by_name(name)
        if (g) {// exist
            if (warn) {
                alert("group existed");
            }
            return g;
        }

        // create new one if not
        g = new GroupElement(this, this.#id_incremental, name);
        this.groups.set(this.#id_incremental, g);
        this.#id_incremental += 1;
        create_group_to_dropdown(g);

        return g;
    }

    get_group_by_id(gid) {
        return this.groups.get(gid);
    }

    delete_group_by_name(name, force = false) {
        let g = this.get_group_by_name(name)
        if (!g) {
            alert("no group found");
            return;
        }
        return this.delete_group_by_id(g.getId(), force);
    }

    delete_group_by_id(gid, force = false) {
        // force: delete no mater any event link to it
        // check if element count > 0 -> not allow to delete
        let gp = this.groups.get(gid);
        if (!gp) {
            return false; // group not exist
        }

        if (gp.get_linked_event_count() > 0 && !force) {
            if (!confirm('group has linked with events, still want to delete?')) {
                return false;
            }
        }

        gp.clear_group_data();
        this.groups.delete(gid);
        return true;
    }
}


let create_group_to_dropdown = function (gEle) {
    let grp_name = gEle.get_name();
    var randomColor = Math.floor(Math.random() * 16777215).toString(16);
    colorCode = "#" + randomColor;
    gEle.setColor(colorCode);
    gEle.setFontSize("14");
    const text_node = document.createTextNode(grp_name);
    var parent_ul = document.querySelector("#group-section > ul");
    const li = document.createElement("li");
    li.setAttribute("onclick", "dynamicChanges(this);");
    const a = document.createElement("a")
    a.setAttribute("data-toggle", "pill");
    a.appendChild(text_node);
    li.appendChild(a);
    parent_ul.appendChild(li);
    add_groups_to_dropdown(grp_name);
}

let add_groups_to_dropdown = function (name) {
    var dropdown = document.getElementById("field-groups");
    var e = document.createElement("option");
    const text_node = document.createTextNode(name);
    e.setAttribute("value", name);
    e.appendChild(text_node);
    dropdown.appendChild(e);
}



class TimelineEvent {
    #eid;
    #em;
    title;

    flag_start_date_init = false;
    flag_start_time_init = false;
    flag_end_date_init = false;
    flag_end_time_init = false;
    start_datetime;
    end_datetime;

    groups = new Set();
    visible_group;

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

    get_group_name_list() {
        return Array.from(this.groups.values()).map(function (ele) { return ele.get_name() })
    }

    update_start_datetime(datetime){
        this.update_start_date_by_string( print_date( datetime), false);
        this.update_start_time_by_string( print_time( datetime));
    }

    update_start_date_by_string(val, resort = true) {
        update_date_by_string(this.start_datetime, val);
        this.flag_start_date_init = true;
        if (resort) {
            this.#em.sort_events();
            update_events();
        }
    }

    update_start_time_by_string(val, resort = true) {
        update_time_by_string(this.start_datetime, val);
        this.flag_start_time_init = true;
        if (resort) {
            this.#em.sort_events();
            update_events();
        }
    }

    update_title(title, resort = true) {
        this.title = title;
        if (resort) {
            this.#em.sort_events();
            update_events();
        }
    }

    update_end_date(val) {
        update_date_by_string(this.end_datetime, val);
        this.flag_end_date_init = true;
    }

    update_end_time(val) {
        update_time_by_string(this.end_datetime, val);
        this.flag_end_time_init = true;
    }

    add_into_group(groupElement) {
        if (!this.groups.has(groupElement)) {
            this.groups.add(groupElement);
            groupElement.add_event(this);
        }
    }

    remove_from_group(groupElement) {
        if (this.groups.delete(groupElement)) {
            groupElement.remove_event(this);
        }
    }

    get_visible_group(){
        return this.visible_group;
    }

    set_visible_group_by_name(name, refresh=true){
        let vg = group_manager.get_group_by_name(name);
        if(vg){
            this.set_visible_group( vg, refresh);
        }else{
            console.warn("group: " + neme + " not exist");
        }
    }

    set_visible_group(groupElement, refresh=true){
        this.visible_group = groupElement;
        if(refresh){
            update_events();
        }
    }

    clear_event_data() {
        // remove link from group
        for (const gp of this.groups.values()) {
            this.remove_from_group(gp);
        }
        this.groups = undefined;
    }
}

const group_manager = new GroupManager();

class EventManager {

    event_map = new Map(); // any event created
    invalid_events_in_csv = [];
    ordered_events = []; // ordered list
    id_incremental = 0;

    // create a new event object
    create_event() {
        let event = new TimelineEvent(this.id_incremental, this);
        this.id_incremental += 1;

        this.event_map.set(event.getId(), event);
        this.ordered_events.unshift(event);
        event.add_into_group(group_manager.get_default_group());
        event.set_visible_group(group_manager.get_default_group(), false);

        return event;
    }

    get_event_by_id(eid) {
        return this.event_map.get(eid);
    }

    // sort the stored ordered_events
    sort_events() {
        this.ordered_events.sort(function (a, b) {
            if (!a.flag_start_date_init) {
                return -1;
            }

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
        let cur_event = this.event_map.get(eid);
        if (!cur_event) {
            return false;
        }
        cur_event.clear_event_data();
        this.ordered_events = this.ordered_events.filter(e => e.getId !== eid);
        this.event_map.delete(eid);
        update_events()
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
                    tar.update_start_date_by_string(start_date, false);
                }

                let start_time = tar[START_TIME_FIELD];
                if (start_time) {
                    tar.update_start_time_by_string(start_time, false);
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

                let groups = tar[GROUP_FIELD];
                if (groups) {
                    groups.split(';').map(function (ele) {
                        let gp = group_manager.create_or_get_group_by_name(ele);
                        gp.add_event(tar);
                    })
                }

                let visible_group = tar[VISIABLE_GROUP];
                if(visible_group){
                    let vg = group_manager.create_or_get_group_by_name(visible_group);
                    vg.add_event(tar);
                    tar.set_visible_group(vg, false);
                }

                KEY_FIELDS.forEach(key_field => {
                    delete tar[key_field];
                })

                if (is_event_valid(tar)) {
                    valid_count += 1;
                } else {
                    this.invalid_events_in_csv.push(tar);
                }
                total += 1;
            }
        )

        console.log(event_manager.ordered_events);

        alert("Loading finish! total: " + total + " rows, valid records: " + valid_count);
        this.sort_events();
        update_events();
        return valid_count;
    }
}

const event_manager = new EventManager();

let load_csv_file = function (e) {
    loaded_csv = $.csv.toObjects(fr.result);
    if (!loaded_csv.length > 0) {
        return;
    }

    // check file type
    if (loaded_csv[0].hasOwnProperty(EVENT_TITLE)) {
        console.log("loading a data file.");
        event_manager.load_timeline_events(loaded_csv);
    } else if (loaded_csv[0].hasOwnProperty("displayMajorTick")) {
        console.log("loading a timeline setting");
        // load timeline setting from csv
        for (const [key, value] of Object.entries(loaded_csv[0])) {
            let ele = document.getElementById(key);
            if (ele) {
                if (ele.type == 'checkbox') {
                    ele.checked = (value == '1');
                } else if (ele.type == 'date') {
                    let tmp_date = new Date(Date.parse(value));
                    ele.value = tmp_date.getFullYear().toString().padStart(4, '0') + "-" +
                        tmp_date.getMonth().toString().padStart(2, '0') + "-" +
                        tmp_date.getDate().toString().padStart(2, '0');
                } else {
                    ele.value = value;
                }
            }
        }
    } else {
        alert("Wrong input format! Please check the sample format.");
    }
}

var fr = new FileReader();
fr.onload = load_csv_file;

document.getElementById('file-input').addEventListener('change', function (evt) {
    fr.readAsText(this.files[0]);
})

var file_drop_import = function (evt) {
    evt.preventDefault();
    var fileInput = document.getElementById("file-input");
    fileInput.files = evt.dataTransfer.files;
    fr.readAsText(fileInput.files[0])
    file_drag_leave(evt);
}

var file_dragover = function (ev) {
    ev.preventDefault();
    $("#panel-file").addClass("on_drag");
}

var file_drag_leave = function (ev) {
    $("#panel-file").removeClass("on_drag");
}