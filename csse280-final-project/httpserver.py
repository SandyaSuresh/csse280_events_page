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

@app.get("/shutdown")
def shutdown():
    os._exit(0)

# @app.get("/events")
# def get_events():
#     return flask.Response(status="200 OK",
#                           headers={"Content-Type": "application/json"},
#                           response = json.dumps(dataservice.get_events_list()))

@app.get("/events/<month>") # formatted like MM/YY?
def get_events(month):
    return flask.Response(status="200 OK",
                          headers={"Content-Type": "application/json"},
                          response = json.dumps(dataservice.get_events_list(month)))  

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=8080)
