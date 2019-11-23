from flask import Flask
from flask_pymongo import PyMongo
import mysql.connector
import logging
from flask_cors import CORS

application = Flask(__name__)
cors = CORS(application, resources={r"/*": {"origins": "*"}})

# setting up connection to the 2 mongoDB databases
mongo_database = PyMongo(application, uri="mongodb://ec2-3-1-83-253.ap-southeast-1.compute.amazonaws.com/mongo_database")

# setting up MySQL connection
bookReviewsDb = mysql.connector.connect(host = "ec2-54-255-245-80.ap-southeast-1.compute.amazonaws.com", user="root", passwd = "dbproject123@", db="book_reviews")


from .logsMongoHandler import LogsMongoHandler

# for logging of requests
logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)
file_handler = logging.FileHandler('sample.log')
logger.addHandler(file_handler)
logger.addHandler(LogsMongoHandler())


from app import routeshw
from app import routesxh
from app import routes
