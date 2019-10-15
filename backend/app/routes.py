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
    return "hello"


#Get ALL BOOKS
# i limited it to 100 books for the time being
@app.route('/book', methods= ['GET'])
def get_books():
    listOfBooks = list(metadataCollection.find({}, {'_id':0}).limit(100))
    books = {"books": listOfBooks}
    return json.dumps(books)


#POST a book
@app.route('/book', methods = ['POST'])
def insert_book():
    book = request.get_json()
    result = metadataCollection.insert_one(book)
    return "success"

#UPDATE a book
@app.route('/book/<asin>', methods = ['PUT'])
def update_book(asin):
    update = request.get_json()
    result = metadataCollection.update_one({"asin": asin}, {"$set": update})
    return "success"

#GET a book, using its 'asin'
@app.route('/book/<asin>', methods= ['GET'])
def get_book(asin):
    query = metadataCollection.find_one({"asin": asin})    
    if query == None:
        return not_found()

    query.pop("_id", None)
    # book_data = {}
    # book_data["asin"] = query.get("asin")
    # book_data["title"] = query.get("title")
    # book_data["price"] = query.get("price")
    # book_data["imUrl"] = query.get("imUrl")
    return json.dumps(query)


    
    
#GET a review, using its 'id'   
@app.route('/review/<id>', methods= ['GET'])
def get_review(id):
    cursor = bookReviewsDb.cursor(dictionary=True)
    try:
        cursor.execute(f"select * from kindle_reviews where id = {id};")
    except:
        cursor.close()  
        return jsonify({"error": "id needs to be integer"})
    
    result = cursor.fetchone()
    if result == None:
        return not_found()
    cursor.close()
    return json.dumps(result)
    

#GET all reviews for a book, using 'asin'
@app.route('/reviews/<asin>', methods= ['GET'])
def get_reviews(asin):
    cursor = bookReviewsDb.cursor(dictionary=True)
    cursor.execute(f"select * from kindle_reviews where asin = '{asin}'")
    result = cursor.fetchall()
    if result == None or result == []:
        return not_found()
    print(result)
    cursor.close()
    reviews = {"reviews": result}
    return json.dumps(reviews)


#POST a review
@app.route('/review', methods = ['POST'])
def insert_review():
    request_body = request.get_json()
    asin = request_body['asin'] #use uuid
    helpful = request_body['helpful']
    try:
        overall = int(request_body['overall'])
    except ValueError:
        return validation_failure(field = 'overall')
    reviewText = request_body['reviewText']
    reviewTime = request_body['reviewTime']
    reviewerID = request_body['reviewerID'] #use uuid
    reviewerName = request_body['reviewerName']
    summary = request_body['summary']
    try:
        unixReviewTime = int(request_body['unixReviewTime'])
    except ValueError:
        return validation_failure(field = 'unixReviewTime')
    
    cursor = bookReviewsDb.cursor()
    try:
        cursor.execute(f"insert into kindle_reviews (asin, helpful, overall, reviewText, reviewTime, reviewerID, reviewerName, summary, unixReviewTime) values ('{asin}', '{helpful}', {overall}, '{reviewText}', '{reviewTime}', '{reviewerID}', '{reviewerName}', '{summary}', {unixReviewTime})")
        bookReviewsDb.commit()
    except:
        return insert_failure()
    finally:
        cursor.close()
    return 'success'



#UPDATE a review
@app.route('/review/<id>', methods = ['PUT'])
def update_review(id):
    update = request.get_json()
    updateString = ""
    for key,value in update.items():
        if key == 'overall':
            try:
                value = int(value)
            except ValueError:
                return validation_failure(field = 'overall')
            updateString += f"{key} = {value}, "
            
        elif key == 'unixReviewTime':
            try:
                value = int(value)
            except ValueError:
                return validation_failure(field = 'unixReviewTime')
            updateString += f"{key} = {value}, "
        else:
            updateString += f"{key} = '{value}', "
        
    updateString = updateString[:-2] #to remove last comma and trailing whitespace
    
    #if book not found, return error
    cursor = bookReviewsDb.cursor()
    try:
        cursor.execute(f"select * from kindle_reviews where id = {id}")
    except:
        cursor.close()  
        return jsonify({"error": "id needs to be integer"})
    
    result = cursor.fetchone()
    if result == None:
        cursor.close()
        return not_found()
    
    try:
        cursor.execute(f"update kindle_reviews set {updateString} where id = {id}" )
        bookReviewsDb.commit()
    except:
        return insert_failure()
    finally:
        cursor.close()
    return 'success'
    








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


#error handler for insert fail
@app.errorhandler(406)
def insert_failure(error=None):
  message = {
          'status': 406,
          'message': 'Failed to insert into database ' + request.url,
  }
  resp = jsonify(message)
  resp.status_code = 406
  return resp

#error handler for input validation failure
@app.errorhandler(406)
def validation_failure(field, error=None):
  message = {
          'status': 406,
          'message': f'This value for {field} should be an integer {request.url}',
  }
  resp = jsonify(message)
  resp.status_code = 406
  return resp

