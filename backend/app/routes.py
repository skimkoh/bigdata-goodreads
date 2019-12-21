from flask import Flask, url_for, request, Response, jsonify
from app import application, mongo_database, bookReviewsDb
import json
import logging
import datetime

metadataCollection = mongo_database.db.kindle_metadata

    
@application.after_request
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


@application.route('/hello', methods= ['GET'])
def hello_world():
    return "test"


# Get ALL BOOKS
# i limited it to 100 books 
@application.route('/book', methods= ['GET'])
def get_books():
    listOfBooks = list(metadataCollection.find({}, {'_id': 0}).limit(100))
    books = {"books": listOfBooks}
    return json.dumps(books)


# Get LAST 50 Books
@application.route('/newbooks', methods= ['GET'])
def get_new_books():
    listOfBooks = list(metadataCollection.find({}, {'_id': 0}).sort([( '$natural', -1 )]).limit(50))
    books = {"books": listOfBooks}
    return json.dumps(books)


#Query By Catagory
@application.route('/bookcategory', methods=["GET"])
def get_book_by_category():
    #takes in list of categories
    categories = request.args.getlist("category[]")
    
    query = {'categories': {"$all":[]}}
    for category in categories:
        query['categories']["$all"].append({"$elemMatch":{"$elemMatch":{"$in":[category]}}})
    listOfBooks = list(metadataCollection.find(query, {'_id': 0}).limit(1000))
    books = {"books": listOfBooks}
    return json.dumps(books)


#POST a book
@application.route('/book', methods = ['POST'])
def insert_book():
    book = request.get_json()["book"]
    for value in book.values():
        if value == None or len(value) ==0:
            return insert_failure()
    result = metadataCollection.insert_one(book)
    if result.inserted_id == None:
        return insert_failure()
    return "success"
    

#UPDATE a book
@application.route('/book/<asin>', methods = ['PUT'])
def update_book(asin):
    update = request.get_json()['book']
    result = metadataCollection.update_one({"asin": asin}, {"$set": update}) #upsert=False
    if result.matched_count<1:
        return not_found()
    return "success"

#GET a book, using its 'asin'
@application.route('/book/<asin>', methods= ['GET'])
def get_book(asin):
    query = metadataCollection.find_one({"asin": asin})
    if query == None:
        return not_found()

    query.pop("_id", None)
    return json.dumps(query)


#DELETE a book, using its 'asin'
@application.route('/book/<asin>', methods= ['DELETE'])
def delete_book(asin):
    result = metadataCollection.delete_one({"asin": asin})
    if result.deleted_count == 0:
        return not_found()
    return "success"
    
#GET a review, using its 'id'   
@application.route('/review/<id>', methods= ['GET'])
def get_review(id):
    cursor = bookReviewsDb.cursor(dictionary=True)
    try:
        cursor.execute(f"select * from kindle_reviews where id = {id}")
    except:
        cursor.close()
        return jsonify({"error": "id needs to be integer"})

    result = cursor.fetchone()
    if result == None:
        return not_found()
    cursor.close()
    return json.dumps(result)


#GET all reviews for a book, using 'asin'
@application.route('/reviews/<asin>', methods= ['GET'])
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
@application.route('/review', methods = ['POST'])
def insert_review():
    request_body = request.get_json()['review']
    asin = request_body['asin']  
    helpful = request_body['helpful']
    if len(request_body["overall"]) ==0:
        request_body["overall"] =0
    try:
        overall = int(request_body['overall'])
    except ValueError:
        return validation_failure(field='overall')
    reviewText = request_body['reviewText']
    reviewTime = request_body['reviewTime']
    reviewerID = request_body['reviewerID']  # use uuid
    reviewerName = request_body['reviewerName']
    summary = request_body['summary']
    try:
        unixReviewTime = int(request_body['unixReviewTime'])
    except ValueError:
        return validation_failure(field='unixReviewTime')

    cursor = bookReviewsDb.cursor()
    try:
        cursor.execute(
            f"insert into kindle_reviews (asin, helpful, overall, reviewText, reviewTime, reviewerID, reviewerName, summary, unixReviewTime) values ('{asin}', '{helpful}', {overall}, '{reviewText}', '{reviewTime}', '{reviewerID}', '{reviewerName}', '{summary}', {unixReviewTime})")
        bookReviewsDb.commit()
    except:
        return insert_failure()
    finally:
        cursor.close()
    return 'success'



#UPDATE a review
@application.route('/review/<id>', methods = ['PUT'])
def update_review(id):
    update = request.get_json()['review']
    updateString = ""
    for key, value in update.items():
        if key == 'overall':
            try:
                value = int(value)
            except ValueError:
                return validation_failure(field='overall')
            updateString += f"{key} = {value}, "

        elif key == 'unixReviewTime':
            try:
                value = int(value)
            except ValueError:
                return validation_failure(field='unixReviewTime')
            updateString += f"{key} = {value}, "
        else:
            updateString += f"{key} = '{value}', "

    # to remove last comma and trailing whitespace
    updateString = updateString[:-2]

    # if book not found, return error
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
        cursor.execute(
            f"update kindle_reviews set {updateString} where id = {id}")
        bookReviewsDb.commit()
    except:
        return insert_failure()
    finally:
        cursor.close()
    return 'success'


#to delete reviews
@application.route('/review/<id>', methods = ['DELETE'])
def delete(id):
    cur = bookReviewsDb.cursor()
    try:
        cur.execute(f"DELETE FROM kindle_reviews WHERE id = {id}") # reviews to be deleted based on id   
        bookReviewsDb.commit()
    except:
        return not_found()  
    finally:   
        cur.close()
    return 'successfully deleted'



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

#error handler for insert fail
@application.errorhandler(406)
def insert_failure(error=None):
  message = {
          'status': 406,
          'message': 'Failed to insert into database ' + request.url,
  }
  resp = jsonify(message)
  resp.status_code = 406
  return resp

#error handler for input validation failure
@application.errorhandler(406)
def validation_failure(field, error=None):
    message = {
        'status': 406,
        'message': f'This value for {field} should be an integer {request.url}',
    }
    resp = jsonify(message)
    resp.status_code = 406
    return resp
