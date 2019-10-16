from flask import Flask, render_template, request, jsonify
from flask_mysqldb import MySQL
import yaml 

app = Flask(__name__)

# configure db, changes to your local database/ password setting can be found under db.yaml
# Standardised db name: book_reviews, standardised table name: kindle_reviews
db = yaml.load(open('db.yaml'))
app.config['MYSQL_HOST'] = db['mysql_host']
app.config['MYSQL_USER'] = db['mysql_user']
app.config['MYSQL_PASSWORD'] = db['mysql_password']
app.config['MYSQL_DB'] = db['mysql_db']

mysql = MySQL(app)

# to create reviews
@app.route('/', methods = ['GET', 'POST'])
def index():
      if request.method == 'POST':
            # fetch form to create a new book review
            addReview = request.form
            asin = addReview['asin']
            helpful = addReview['helpful']
            overall = addReview['overall']
            reviewText = addReview['reviewText']
            reviewTime = addReview['reviewTime']
            reviewerID = addReview['reviewerID']
            reviewerName = addReview['reviewerName']
            summary = addReview['summary']
            unixReviewTime = addReview['unixReviewTime']

            cur = mysql.connection.cursor()
            cur.execute("INSERT INTO kindle_reviews (asin, helpful, overall, reviewText, reviewTime, reviewerID, reviewerName, summary, unixReviewTime) VALUES(%s, %s, %s, %s, %s, %s, %s, %s, %s)",
             (asin, helpful, overall, reviewText, reviewTime, reviewerID, reviewerName, summary, unixReviewTime))
            mysql.connection.commit()
            cur.close()
            return 'success'
      return render_template('new_review.html')



# to display all the reviews
@app.route('/reviews')
def Home(): 
      cur = mysql.connection.cursor()
      cur.execute("SELECT reviewerName, summary from kindle_reviews")
      fetchdata = cur.fetchall()
      cur.close()
      # return render_template('home.html', value = fetchdata)
      return jsonify(fetchdata)



# to delete reviews
@app.route('/delete', methods = ['GET', 'POST'])
def delete():
      if request.method == 'POST':
            asin = request.form['asin']

            cur = mysql.connection.cursor()
            cur.execute("DELETE FROM kindle_reviews WHERE asin = %s", [asin]) # reviews to be deleted based on id      
            mysql.connection.commit()
            cur.close()

            return 'deleted!!'
      return render_template('delete.html')
            

# to update reviews using asin
@app.route('/update_review/<asin>', methods = ['PUT'])
def update_reviews(asin):
      update = request.get_json()
      updateStuff = ""
      for key, value in update.items():
            if key == 'overall':
                  try:
                        value = int(value)
                  except: ValueError
                        return validation_failure(field = 'overall')
                  


            cur.execute("UPDATE BookReviews SET helpful=%s, overall=%s, reviewText=%s, reviewTime=%s, reviewerName=%s, summary=%s, unixReviewTime=%s WHERE asin=%s", (helpful, overall, reviewText, reviewTime, reviewerID, reviewerName, summary, unixReviewTime, asin))
            mysql.connection.commit()
            cur.close()
            return 'success'
      return render_template('update.html')


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

if __name__ == '__main__':
      app.run(debug=True)

'''
@app.route('/delete/<asin>', methods = ['GET', 'POST'])
def delete_reviews(asin):
      if request.method == 'POST':
            cur = mysql.connect.cursor()
            addReview = request.form
            reviewerName = addReview['reviewerName']
            cur.execute("DELETE * FROM kindle_reviews WHERE reviewerName = %s", (reviewerName)) # reviews to be deleted based on id      
            mysql.connection.commit()
            cur.close()
            return 'success'
      return render_template('delete.html')
'''







# APIs TO BE DONE:
# 1. GET JUST 1 REVIEW.
# 2. FINISH UP ON UPDATE REVIEW.
# 3. TRY ON POSTMANNNNN