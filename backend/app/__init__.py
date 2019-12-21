from flask import Flask
from flask_pymongo import PyMongo
import mysql.connector
import logging
from flask_cors import CORS
import os

application = Flask(__name__)
cors = CORS(application, resources={r"/*": {"origins": "*"}})

fileDir = os.path.dirname(os.path.realpath('__file__'))
ec2InstancesFile = os.path.join(fileDir, '../ec2InstancesProductionSystem.txt')
db_uri = {} #obtain URIs of Mongo and MySQL
with open(ec2InstancesFile, "r") as f:
    for line in f.readlines():
        currentLine = line.strip().split()
        db_uri[currentLine[0]] = currentLine[1]

mongo_uri = db_uri["mongodb"]
mysql_uri = db_uri["mysql"]
# setting up connection to the 2 mongoDB databases
mongo_database = PyMongo(application, uri=f"mongodb://{mongo_uri}/mongo_database")

# setting up MySQL connection
bookReviewsDb = mysql.connector.connect(host = mysql_uri, user="root", passwd = "", db="book_reviews")


from .logsMongoHandler import LogsMongoHandler

# for logging of requests
logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)
# file_handler = logging.FileHandler('sample.log')
# logger.addHandler(file_handler)
logger.addHandler(LogsMongoHandler())


from app import routes