from flask import Flask, url_for, request, Response, jsonify
import json
from functools import wraps


#APIs implemented
# 1. GET /students
# 2. GET /rooms
# 3. POST /rooms with authentication
# 4. PUT /rooms
# 5. DELETE /rooms with authentication


app = Flask(__name__)

#SUTD lecture rooms information service
# data contains list of rooms and list of students
sutdData = {"rooms": [
  {"roomName": "LT1", "capacity": "40", "occupied": "true", "studentsInRoom": ["jeremey"]},
  {"roomName": "LT2", "capacity": "100", "occupied": "true", "studentsInRoom": ["aaron", "john", "andrew"]},
  {"roomName": "LT3", "capacity": "300", "occupied": "false", "studentsInRoom": []},
  {"roomName": "LT4", "capacity": "300", "occupied": "false", "studentsInRoom": []},
],
"students": [{"id": "1", "name": "jeremy"},
 {"id": "2", "name": "aaron"}, 
 {"id": "3", "name": "john"}, 
 {"id": "4", "name": "andrew"}]
}



#code for authentication
def check_auth(username, password):
  return username == "username" and password == "password"

def authenticate():
  message = {"message": "Authenticate"}
  resp = jsonify(message)
  resp.status_code = 401
  resp.headers["WWW-Authenticate"] = 'Basic realm="Example'
  return resp

def requires_auth(f):
  @wraps(f)
  def decorated(*args, **kwargs):
    auth = request.authorization
    if not auth:
      return authenticate()
    elif not check_auth(auth.username, auth.password):
      return authenticate()
    return f(*args, **kwargs)
  
  return decorated





#get list of students
@app.route('/students',  methods = ['GET'])
def get_all_students():
  listOfStudents = sutdData["students"]
  jsondata = json.dumps(listOfStudents)
  
  if request.headers['Content-Type'] == 'application/json':
    jsonResp = Response(jsondata, status=200, mimetype='application/json')
    return jsonResp
  elif request.headers['Content-Type'] == 'text/plain':
    studentNames = ""
    for student in listOfStudents:
      studentNames += student["name"] + ","
    return studentNames




#get list of rooms that are not occupied
@app.route('/rooms', methods = ['GET'])
def get_available_rooms():
  results = {"listOfAvailableRooms": []}
  isRoomOccupied = request.args['occupied']
  rooms = sutdData["rooms"]
  for room in rooms:
    if room["occupied"] == isRoomOccupied:
      results["listOfAvailableRooms"].append(room["roomName"])
  return json.dumps(results)
  
  

#add a new room
@app.route('/rooms', methods = ['POST'])
def add_room():
  newRoom = request.data #bytes object
  newRoomObject = json.loads(newRoom) #dict object
  sutdData["rooms"].append(newRoomObject)
  responseMessage = "Success, room has been added"
  jsonResp = Response(json.dumps(responseMessage), status=200, mimetype='application/json')
  print(sutdData["rooms"])
  return jsonResp


#add a student to a room
@app.route('/rooms/<roomId>', methods = ['PUT'])
def add_student_to_room(roomId):
  roomIdValid = False
  newStudent = json.loads(request.data)
  for room in sutdData["rooms"]:
    if room["roomName"] == roomId:
      room["studentsInRoom"].append(newStudent)
      roomIdValid = True
      break
      
  if (roomIdValid == False):
    return not_found()
  
  responseMessage = "Success, a new student has been added to " + roomId
  jsonResp = Response(json.dumps(responseMessage), status=200, mimetype='application/json')
  return jsonResp


#delete a room
@app.route('/rooms/<roomId>', methods = ['DELETE'])
@requires_auth
def delete_room(roomId):
  roomIdValid = False
  for i in range(len(sutdData["rooms"])):
    if sutdData["rooms"][i]["roomName"] == roomId:
      print(i)
      sutdData["rooms"].pop(i)
      roomIdValid = True
      break
  
  if (roomIdValid == False):
    return not_found()
  print(sutdData["rooms"])
  responseMessage = "Success, room " + roomId + "has been deleted"
  jsonResp = Response(json.dumps(responseMessage), status=200, mimetype='application/json')
  return jsonResp


#error handler for resource not found
@app.errorhandler(404)
def not_found(error=None):
  message = {
          'status': 404,
          'message': 'Not Found: ' + request.url,
  }
  resp = jsonify(message)
  resp.status_code = 404
  return resp







if __name__ == "__main__":
  app.run(debug = True)