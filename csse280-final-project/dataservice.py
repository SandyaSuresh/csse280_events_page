import pickledb
import os

db_path = 'database.db'
global_db = None

def load_db():
    global global_db
    
    events_db = pickledb.PickleDB("temp_events.db")
    events_db.save()

    global_db = pickledb.PickleDB(db_path)
    global_db.set("users", {})
    global_db.set("events", get_events(events_db))
    global_db.save()    

def get_events(db):
    events = {}
    for event in db.all():
        events[event] = db.get(event)
    return events

def get_db():
    global global_db
    if global_db is None:
        load_db()
    return global_db

def get_user_data(db, username):
    users = db.get("users")
    #print(all_items)
    if not username in users:
        return False
    
    return users[username]["password"], users[username]["tags"], users[username]["events"]

def get_events_list():
    db = get_db()
    return db["events"]

def get_events_list(month): # what about events that roll over into the next month?
    month_of_year = month.split("/")[0]
    year = month_of_year.split("/")[1]
    db = get_db()
    events = []
    for event in db["events"]:
        event_month = db[event]["start"].split("/")[0]
        event_year = db[event]["start"].split("/")[2]
        if (event_month == month_of_year and event_year == year):
            events += event
    return events # probably formatted wrong or something
