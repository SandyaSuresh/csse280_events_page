import pickledb
from datetime import datetime
import os

db_path = 'database.db'
global_db = None

def load_db():
    global global_db
    
    events_db = pickledb.PickleDB("temp_events.db")
    events_db.save()

    global_db = pickledb.PickleDB(db_path)
    if not "users" in global_db.all():
        global_db.set("users", {})
    global_db.set("events", load_events(events_db))
    global_db.save()    

def load_events(db):
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
    if not username in users:
        return False
    
    return users[username]["password"], users[username]["tags"], users[username]["bookmarks"]

def get_events_list():
    db = get_db()
    return db["events"]

def get_events_month(month):
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

def get_user_events(user, date):
    db = get_db()
    bookmark_list = get_user_data(db, user)[2]
    event_list = get_events_day(date)
    events = {}
    for event in event_list:
        if event in bookmark_list:
            events[event] = event_list[event]
    return events

def get_events_day(date):
    dayStart  = datetime.strptime(date+" 00:00:00", "%m-%d-%Y %H:%M:%S")
    dayEnd = datetime.strptime(date+" 23:59:59", "%m-%d-%Y %H:%M:%S")
    db_events = get_db()["events"]
    event_list={}
    for index in db_events:
        event = db_events[index]
        start = event["start"]
        end = event["end"]

        eventStart = datetime.strptime(start, "%m/%d/%Y %H:%M:%S")
        eventEnd = datetime.strptime(end, "%m/%d/%Y %H:%M:%S")
        
        if(not (dayStart > eventEnd or dayEnd < eventStart)):
            event_list[index] = event
    return event_list 

def get_events_date_range(dateRange):
    startDate = datetime.strptime(dateRange[0:10]+" 00:00:00", "%m-%d-%Y %H:%M:%S")
    endDate = datetime.strptime(dateRange[11:]+" 23:59:59", "%m-%d-%Y %H:%M:%S")
    db_events = get_db()["events"]
    event_list={}
    for index in db_events:
        event = db_events[index]
        start = event["start"]
        end = event["end"]

        eventStart = datetime.strptime(start, "%m/%d/%Y %H:%M:%S")
        eventEnd = datetime.strptime(end, "%m/%d/%Y %H:%M:%S")
        
        if(not (startDate > eventEnd or endDate < eventStart)):
            event_list[index] = event
    return event_list

def authenticate_user(username, password):
    db = get_db()
    users = db["users"]
    if(not username in users):
        return False
    user = users[username]
    if not "password" in user:
        return False 
    return user["password"] == password

def add_user(username, password):
    db = get_db()
    users = db["users"]
    if(username in users):
        return False
    users[username] = {"password": password, "tags" : [], "bookmarks" : []}
    db.set("users", users)
    db.save()
    return True

def update_user_tags(username, tags):
    db = get_db()
    users = db["users"]
    user = users[username]
    user["tags"] = tags
    db.save()
    return tags

def get_bookmarks(username):
    db = get_db()
    
    return get_user_data(db, username=username)[2]

def add_bookmark(username, eventId):
    db = get_db()
    users = db["users"]
    user = users[username]
    if (eventId not in user["bookmarks"]):
        user["bookmarks"].append(eventId)
    db.save()
    return True

def delete_bookmark(username, eventId):
    db = get_db()
    users = db["users"]
    user = users[username]
    if (eventId in user["bookmarks"]):
        user["bookmarks"].remove(eventId)
    db.save()
    return True
    

def add_event(name, groupName, startTime, endTime, tags):
    events_db = pickledb.PickleDB("temp_events.db")
    id = len(events_db.all()) + 1
    start = startTime.split("T")
    sd = start[0].split("-")
    end = endTime.split("T")
    ed = end[0].split("-")

    events_db.set(str(id), {"name": name, "group": groupName, "start": sd[1] + "/" + sd[2]+ "/" + sd[0] + " " + start[1] + ":00", "end" : ed[1] + "/" + ed[2]+ "/" + ed[0] + " " + end[1] + ":00", "tags": tags.split(",")})    
    events_db.save()

    db = get_db()
    db.set("events", load_events(events_db))
    db.save()

    