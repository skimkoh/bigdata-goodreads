from app import routeshw
from app import routesxh
from app import routes
from .logsMongoHandler import LogsMongoHandler
from flask import Flask
from flask_pymongo import PyMongo
import mysql.connector
import logging

app = Flask(__name__)

# setting up connection to the 2 mongoDB databases
mongo_kindle_metadata = PyMongo(
    app, uri="mongodb://localhost:27017/kindle_metadata")
mongo_backend_logs = PyMongo(app, uri="mongodb://localhost:27017/backend_logs")

# setting up MySQL connection
bookReviewsDb = mysql.connector.connect(
    host="localhost", user="root", passwd="Carbonara444!", db="book_reviews")


# for logging of requests
logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)
file_handler = logging.FileHandler('sample.log')
logger.addHandler(file_handler)
logger.addHandler(LogsMongoHandler())
