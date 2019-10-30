from app import routeshw
from app import routesxh
from app import routes
from .logsMongoHandler import LogsMongoHandler
from flask import Flask
from flask_pymongo import PyMongo
import mysql.connector
import logging

application = Flask(__name__)

# setting up connection to the 2 mongoDB databases
mongo_database = PyMongo(application, uri="mongodb://ec2-13-229-206-58.ap-southeast-1.compute.amazonaws.com/mongo_database")

# setting up MySQL connection
bookReviewsDb = mysql.connector.connect(host = "ec2-52-221-196-117.ap-southeast-1.compute.amazonaws.com", user="root", passwd = "", db="book_reviews")



# for logging of requests
logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)
file_handler = logging.FileHandler('sample.log')
logger.addHandler(file_handler)
logger.addHandler(LogsMongoHandler())
