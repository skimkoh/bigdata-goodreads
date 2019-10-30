from flask import Flask, url_for, request, Response, jsonify
from app import application, mongo_database, bookReviewsDb
import json
import logging
import datetime
from .routes import after_request

metadataCollection = mongo_database.db.kindle_metadata


#add your functions here


# to delete reviews
@application.route('/review/<id>', methods = ['DELETE'])
def delete(id):
            # asin = request.form['asin']
    cur = bookReviewsDb.cursor()
    try:
        cur.execute(f"DELETE FROM kindle_reviews WHERE id = {id}") # reviews to be deleted based on id   
        bookReviewsDb.commit()
    except:
        return not_found()  
    finally:   
        cur.close()
    return 'deleted!!'
        
        




#error handler for resource not found
@application.errorhandler(404)
def not_found(error=None):
  message = {
          'status': 404,
          'message': 'Not Found: ' + request.url,
  }
  resp = jsonify(message)
  resp.status_code = 404
  return resp