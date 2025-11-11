import flask
import json
import dataservice
import os
from flask import jsonify
from flask import request

from flask_jwt_extended import create_access_token
from flask_jwt_extended import verify_jwt_in_request
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required
from flask_jwt_extended import JWTManager


from werkzeug.utils import secure_filename

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

app = flask.Flask(__name__,
            static_url_path='',
            static_folder='dist',)


app.config['JWT_SECRET_KEY'] = "mysecretkey"
jwt = JWTManager(app)

@app.post("/account")
def create_account():
    username = flask.request.form['username']
    password = flask.request.form['password']

    if(not dataservice.add_user(username, password)):
        return flask.Response(status=400)
    else:
        return flask.redirect("/login.html")
    
@app.post("/login")
def login():
    username = request.json['username']
    password = request.json['password']

    if(not dataservice.authenticate_user(username, password)):
        return flask.Response(status=401)
    access_token = create_access_token(identity=username)
    return jsonify(access_token = access_token)

@app.get("/shutdown")
@jwt_required()
def shutdown():
    os._exit(0)

@app.get("/month/<month>") # formatted like MM-DD-YYYY
@jwt_required()
def get_month(month):
    return flask.Response(status="200 OK",
                          headers={"Content-Type": "application/json"},
                          response = json.dumps(dataservice.get_events_month(month)))  

@app.get("/day/<event_date>")
@jwt_required()
def get_day(event_date):
    return flask.Response(status="200 OK",
                          headers={"Content-Type": "application/json"},
                          response = json.dumps(dataservice.get_events_day(event_date)))

@app.patch("/tags") # didn't put tags parameter as this should take the whole list from the form
@jwt_required()
def update_tags():
    username = get_jwt_identity()
    tags = request.json["tags"]
    dataservice.update_user_tags(username, tags)
    return flask.Response(status="204 No Content")

@app.get("/bookmarks")
@jwt_required()
def get_bookmarks():
    username = get_jwt_identity()
    return flask.Response(status="200 OK",
                          headers={"Content-Type": "application/json"},
                          response = json.dumps(dataservice.get_bookmarks(username)))

@app.post("/bookmark")
@jwt_required()
def add_bookmark():
    username = get_jwt_identity()
    eventId = request.json["event-id"]
    dataservice.add_bookmark(username, eventId)
    return flask.Response(status="204 No Content") # not sure what should be returned here

@app.delete("/bookmark")
@jwt_required()
def delete_bookmark():
    username = get_jwt_identity()
    eventId = request.json["event-id"]
    dataservice.delete_bookmark(username, eventId)
    return flask.Response(status="204 No Content") # not sure what should be returned here


if __name__ == "__main__":
    app.run(host='0.0.0.0', port=8080)
