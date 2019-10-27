from flask import Flask, url_for, request, Response, jsonify
from app import application, mongo_database, bookReviewsDb
import json
import logging
import datetime
from .routes import after_request

metadataCollection = mongo_database.db.kindle_metadata


#add your functions here

