from flask import Flask
from flask_pymongo import PyMongo 
import logging

app = Flask(__name__)

# setting up connection to the 2 mongoDB databases
mongo_kindle_metadata = PyMongo(app, uri="mongodb://localhost:27017/kindle_metadata")
mongo_backend_logs = PyMongo(app, uri="mongodb://localhost:27017/backend_logs")

# for logging of requests
from .logsMongoHandler import LogsMongoHandler
logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)
file_handler = logging.FileHandler('sample.log')
logger.addHandler(file_handler)
logger.addHandler(LogsMongoHandler())


from app import routes


