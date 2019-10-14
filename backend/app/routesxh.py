from flask import Flask, url_for, request, Response, jsonify
from app import app, mongo_kindle_metadata, bookReviewsDb
import json
import logging
import datetime
from .routes import after_request

metadataCollection = mongo_kindle_metadata.db.metadata


#add your functions here

