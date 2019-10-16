from flask import Flask, url_for, request, Response, jsonify
from app import app, mongo_kindle_metadata, mongo_backend_logs
import json
import logging
import datetime

metadataCollection = mongo_kindle_metadata.db.metadata
backend_logs = mongo_backend_logs.db.logs

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
    return "hello"


@app.route('/book', methods=['GET', 'POST', 'DELETE', 'PATCH'])
def book():

    if request.method == 'GET':
        query = request.args
        data = mongo_kindle_metadata.find_one(query)
        return jsonify(data), 200

    data = request.get_json()
    if request.method == 'POST':
        if data.get('asin', None) is not None and data.get('title', None) is not None:
            metadataCollection.insert_one(data)
            return jsonify({'ok': True, 'message': 'Book created successfully!'}), 200
        else:
            return jsonify({'ok': False, 'message': 'Bad request parameters!'}), 400

    if request.method == 'DELETE':
        if data.get('asin', None) is not None:
            db_response = metadataCollection.delete_one({'asin': data['asin']})
            if db_response.deleted_count == 1:
                response = {'ok': True, 'Book': 'record deleted'}
            else:
                response = {'ok': True, 'message': 'no record found'}
            return jsonify(response), 200
        else:
            return jsonify({'ok': False, 'message': 'Bad request parameters!'}), 400

    #not sure about this
    if request.method == 'PATCH':
        if data.get('query', {}) != {}:
            metadataCollection.update_one(
                data['query'], {'$set': data.get('payload', {})})
            return jsonify({'ok': True, 'message': 'record updated'}), 200
        else:
            return jsonify({'ok': False, 'message': 'Bad request parameters!'}), 400