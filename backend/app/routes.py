from flask import Flask, url_for, request, Response, jsonify
from app import app, mongo_kindle_metadata, bookReviewsDb
import json
import logging
import datetime

metadataCollection = mongo_kindle_metadata.db.metadata

@app.after_request
def after_request(response):
    logger = logging.getLogger(__name__)
    obj = {
        "timestamp": datetime.datetime.now().strftime("%d/%b/%Y:%H:%M:%S.%f")[:-3],
        "request": request.method, 
           "path": request.path,
           "remote_address": request.remote_addr,
           "response": 
               {
                "status": response.status,
                "data": response.get_data().decode()
               }
    }
    logger.info(json.dumps(obj))
    return response


@app.route('/hello', methods= ['GET'])
def hello_world():
    # metadata = metadataCollection.find_one()
    # print(metadata)
    cursor = bookReviewsDb.cursor()
    cursor.execute("select * from bookreviews limit 1")
    result = cursor.fetchall()
    print(result)
    cursor.close()
    return "hello"
    