from flask import Flask, url_for, request, Response, jsonify
from app import app, mongo_kindle_metadata, bookReviewsDb
import json
import logging
import datetime
from .routes import after_request

metadataCollection = mongo_kindle_metadata.db.metadata


#add your functions here


# to delete reviews
@app.route('/review/<asin>', methods = ['DELETE'])
def delete(asin):
            # asin = request.form['asin']
    cur = bookReviewsDb.cursor()
    try:
        cur.execute(f"DELETE FROM kindle_reviews WHERE asin = {asin}") # reviews to be deleted based on id   
        bookReviewsDb.commit()
    except:
        return not_found()
    finally:   
        cur.close()
    return 'deleted!!'
        
        




#error handler for resource not found
@app.errorhandler(404)
def not_found(error=None):
  message = {
          'status': 404,
          'message': 'Not Found: ' + request.url,
  }
  resp = jsonify(message)
  resp.status_code = 404
  return resp