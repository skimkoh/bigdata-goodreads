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

# to display the reviews
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
def delete_reviews():
      if request.method == 'POST':
            cur = mysql.connect.cursor()
            addReview = request.form
            reviewerName = addReview['reviewerName']
            cur.execute("DELETE FROM kindle_reviews WHERE reviewerName = %s", (reviewerName)) # reviews to be deleted based on id      
            mysql.connection.commit()
            cur.close()
            return 'success'
      return render_template('delete.html')

# to update reviews
@app.route('/update_reviews', methods = ['GET', 'POST'])
def update_reviews():
      if request.method == 'POST':
            cur = mysql.connect.cursor()
            # fetch form for editing
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

            cur.execute("UPDATE BookReviews SET helpful=%s, overall=%s, reviewText=%s, reviewTime=%s, reviewerName=%s, summary=%s, unixReviewTime=%s WHERE asin=%s", (helpful, overall, reviewText, reviewTime, reviewerID, reviewerName, summary, unixReviewTime, asin))
            mysql.connection.commit()
            cur.close()
            return 'success'
      return render_template('update.html')

if __name__ == '__main__':
      app.run(debug=True)