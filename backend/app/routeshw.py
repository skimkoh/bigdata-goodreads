from flask import Flask, url_for, request, Response, jsonify
<<<<<<< HEAD
#from app import app, mongo_kindle_metadata, bookReviewsDb
=======
from app import application, mongo_database, bookReviewsDb
>>>>>>> 39ca9c7689d275b2e22a6185b7d296d737785f5c
import json
import logging
import datetime
from .routes import after_request

metadataCollection = mongo_database.db.kindle_metadata


# add your functions here
